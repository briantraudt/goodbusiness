const MARKET_TIME_ZONE = "America/Chicago";
const MARKET_OPEN_MINUTE = 8 * 60 + 30;
const NORMAL_CLOSE_MINUTE = 15 * 60;
const EARLY_CLOSE_MINUTE = 12 * 60;

const DEFAULT_UNIVERSE = [
  "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "AMD", "AVGO", "PLTR",
  "NFLX", "COIN", "MSTR", "HOOD", "ARM", "SMCI", "TSM", "INTC", "JPM", "BAC",
  "XOM", "CVX", "BA", "DIS", "WMT", "COST", "CRWD", "PANW", "RIVN", "MARA",
];

export function getMarketSession(date = new Date()) {
  const parts = zonedParts(date);
  const dateKey = `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
  const closedReason = marketClosedReason(parts.year, parts.month, parts.day, parts.weekday);
  if (closedReason) return { isTradingDay: false, dateKey, reason: closedReason };

  const earlyClose = isEarlyClose(parts.year, parts.month, parts.day, parts.weekday);
  const closeMinute = earlyClose ? EARLY_CLOSE_MINUTE : NORMAL_CLOSE_MINUTE;
  return {
    isTradingDay: true,
    dateKey,
    earlyClose,
    openMinute: MARKET_OPEN_MINUTE,
    closeMinute,
    recommendationMinute: closeMinute - 15,
    closeLabel: minuteLabel(closeMinute),
    recommendationLabel: minuteLabel(closeMinute - 15),
  };
}

export function isRecommendationWindow(date = new Date(), toleranceMinutes = 9) {
  const session = getMarketSession(date);
  if (!session.isTradingDay) return false;
  const parts = zonedParts(date);
  const nowMinute = parts.hour * 60 + parts.minute;
  return Math.abs(nowMinute - session.recommendationMinute) <= toleranceMinutes;
}

export async function buildOvernightSignalReport({ items, topicReport, generatedAt = new Date() }) {
  const session = getMarketSession(generatedAt);
  const candidates = candidateTickers(topicReport);
  const marketRows = await mapLimit(candidates, 6, fetchMarketSnapshot);
  const scored = marketRows
    .filter(Boolean)
    .map((market) => scoreCandidate(market, socialStats(items, market.ticker)))
    .sort((a, b) => b.score - a.score);

  const minimumScore = numberEnv("SOCIAL_ARB_MIN_BUY_SCORE", 62);
  const maxPicks = Math.max(1, Math.min(8, numberEnv("SOCIAL_ARB_MAX_PICKS", 5)));
  const picks = scored
    .filter((row) => row.qualified && row.score >= minimumScore)
    .filter((row, index, rows) => rows.findIndex((other) => other.ticker === row.ticker) === index)
    .slice(0, maxPicks)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return {
    generatedAt: generatedAt.toISOString(),
    strategy: "Buy near today's close; evaluate at the next regular-session open",
    session,
    marketRegime: marketRegime(scored),
    recommendation: picks.length ? "BUY_CANDIDATES" : "NO_TRADE",
    picks,
    watchlist: scored.filter((row) => !picks.some((pick) => pick.ticker === row.ticker)).slice(0, 5),
    methodology: {
      minimumScore,
      factors: [
        "social sentiment and acceleration",
        "independent-source confirmation",
        "late-day price momentum",
        "relative volume and liquidity",
        "overnight catalyst language",
        "gap-chase, reversal, volatility, and concentration penalties",
      ],
    },
  };
}

function candidateTickers(topicReport) {
  const ranked = (topicReport?.topics || []).flatMap((topic) =>
    (topic.affectedStocks || [])
      .filter((stock) => stock.direction === "up")
      .sort((a, b) => Number(b.confidence || 0) - Number(a.confidence || 0))
      .map((stock) => stock.ticker),
  );
  return [...new Set([...ranked, ...DEFAULT_UNIVERSE])].slice(0, 36);
}

function socialStats(items, ticker) {
  const now = Date.now();
  const direct = [];
  for (const item of items || []) {
    const text = `${item.title || ""} ${item.body || ""}`;
    const explicit = new RegExp(`(?:\\$${ticker}\\b|\\b${ticker}\\b)`, "i").test(text);
    const channelMatch = String(item.channel || "").toUpperCase() === ticker;
    if (!explicit && !channelMatch) continue;
    const ageHours = Math.max(0, (now - Date.parse(item.createdAt || 0)) / 3_600_000);
    if (ageHours > 24) continue;
    direct.push({ item, ageHours, sentiment: itemSentiment(item, text) });
  }

  const recent = direct.filter((row) => row.ageHours <= 3);
  const prior = direct.filter((row) => row.ageHours > 3);
  const weightedSentiment = weightedAverage(direct.map((row) => [row.sentiment, 1 / (1 + row.ageHours / 4)]));
  const recentRate = recent.length / 3;
  const priorRate = prior.length / 21;
  const acceleration = priorRate ? recentRate / priorRate : recentRate > 0 ? 2 : 0;
  const sources = [...new Set(direct.map((row) => row.item.source))];
  const catalysts = direct.filter((row) => /earnings|guidance|upgrade|approval|contract|launch|deal|buyback|after.?hours|tomorrow|pre.?market|overnight/i.test(`${row.item.title} ${row.item.body}`));
  return {
    mentions24h: direct.length,
    mentions3h: recent.length,
    sourceCount: sources.length,
    sources,
    sentiment: round(weightedSentiment),
    acceleration: round(Math.min(acceleration, 5)),
    catalystCount: catalysts.length,
    evidence: direct
      .sort((a, b) => b.sentiment - a.sentiment || a.ageHours - b.ageHours)
      .slice(0, 3)
      .map(({ item }) => ({ title: item.title, url: item.url, source: item.source })),
  };
}

async function fetchMarketSnapshot(ticker) {
  try {
    const period2 = Math.floor(Date.now() / 1000);
    const period1 = period2 - 12 * 24 * 60 * 60;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?period1=${period1}&period2=${period2}&interval=5m&includePrePost=false&events=div%2Csplits`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 GoodBusiness-SocialARB/2.0" } });
    if (!response.ok) return null;
    const chart = (await response.json())?.chart?.result?.[0];
    const quote = chart?.indicators?.quote?.[0];
    const timestamps = chart?.timestamp || [];
    if (!quote || timestamps.length < 10) return null;
    const bars = timestamps.map((timestamp, index) => ({
      timestamp,
      close: finite(quote.close?.[index]),
      high: finite(quote.high?.[index]),
      low: finite(quote.low?.[index]),
      volume: finite(quote.volume?.[index]) || 0,
    })).filter((bar) => bar.close !== null);
    const last = bars.at(-1);
    const todayKey = chicagoDateKey(new Date(last.timestamp * 1000));
    const today = bars.filter((bar) => chicagoDateKey(new Date(bar.timestamp * 1000)) === todayKey);
    const previous = bars.filter((bar) => chicagoDateKey(new Date(bar.timestamp * 1000)) !== todayKey);
    const priorClose = previous.at(-1)?.close;
    if (!last || !priorClose || today.length < 3) return null;
    const first = today[0];
    const recent = today.slice(-4);
    const averageBarVolume = average(previous.slice(-390).map((bar) => bar.volume).filter(Boolean));
    return {
      ticker,
      price: round(last.close),
      dayChangePct: pct(last.close, priorClose),
      lateMomentumPct: pct(last.close, recent[0].close),
      fromOpenPct: pct(last.close, first.close),
      dayRangePct: pct(Math.max(...today.map((bar) => bar.high || bar.close)), Math.min(...today.map((bar) => bar.low || bar.close))),
      relativeVolume: round(average(today.map((bar) => bar.volume)) / Math.max(averageBarVolume, 1)),
      dollarVolume: round(today.reduce((sum, bar) => sum + bar.volume * bar.close, 0)),
      lastTimestamp: new Date(last.timestamp * 1000).toISOString(),
      provider: "Yahoo Finance delayed/public chart feed",
    };
  } catch {
    return null;
  }
}

export function scoreCandidate(market, social) {
  const socialSentiment = clamp((social.sentiment + 0.15) / 0.75, 0, 1) * 18;
  const socialAcceleration = clamp((social.acceleration - 0.7) / 2.3, 0, 1) * 12;
  const sourceDiversity = clamp(social.sourceCount / 4, 0, 1) * 10;
  const directEvidence = clamp(social.mentions24h / 12, 0, 1) * 8;
  const priceMomentum = clamp((market.lateMomentumPct + 0.15) / 1.35, 0, 1) * 16;
  const closeStrength = clamp((market.fromOpenPct + 0.5) / 3, 0, 1) * 10;
  const volumeConfirmation = clamp((market.relativeVolume - 0.75) / 1.25, 0, 1) * 10;
  const catalyst = clamp(social.catalystCount / 2, 0, 1) * 8;
  const liquidity = clamp(Math.log10(Math.max(market.dollarVolume, 1)) / 9, 0, 1) * 8;
  let penalty = 0;
  const riskFlags = [];
  if (market.dayChangePct > 7) { penalty += Math.min(14, market.dayChangePct); riskFlags.push("already extended today"); }
  if (market.lateMomentumPct < -0.2) { penalty += 10; riskFlags.push("fading into the close"); }
  if (market.dayRangePct > 10) { penalty += 8; riskFlags.push("extreme intraday volatility"); }
  if (social.mentions24h < 2) { penalty += 10; riskFlags.push("thin direct social evidence"); }
  if (social.sourceCount < 2) { penalty += 8; riskFlags.push("single-source concentration"); }
  if (market.dollarVolume < 20_000_000) { penalty += 12; riskFlags.push("insufficient liquidity"); }
  const raw = socialSentiment + socialAcceleration + sourceDiversity + directEvidence + priceMomentum + closeStrength + volumeConfirmation + catalyst + liquidity - penalty;
  const score = Math.round(clamp(raw, 0, 100));
  const qualified = social.sentiment > 0.05 && social.mentions24h >= 2 && social.sourceCount >= 2 && market.lateMomentumPct > -0.2 && market.dollarVolume >= 20_000_000;
  return {
    ticker: market.ticker,
    score,
    confidenceBand: score >= 78 ? "HIGH" : score >= 68 ? "MEDIUM" : "SPECULATIVE",
    qualified,
    entryReference: market.price,
    targetEvent: "next regular-session open",
    social,
    market,
    factorScores: {
      socialSentiment: round(socialSentiment), socialAcceleration: round(socialAcceleration), sourceDiversity: round(sourceDiversity),
      directEvidence: round(directEvidence), priceMomentum: round(priceMomentum), closeStrength: round(closeStrength),
      volumeConfirmation: round(volumeConfirmation), catalyst: round(catalyst), liquidity: round(liquidity), riskPenalty: round(penalty),
    },
    riskFlags,
    thesis: thesisText(market, social, score),
    invalidation: "Do not enter if the price reverses sharply before the close or material negative news appears after generation.",
  };
}

function thesisText(market, social, score) {
  return `${social.mentions24h} direct mentions across ${social.sourceCount} sources; sentiment ${signed(social.sentiment)}, attention acceleration ${social.acceleration}x, late-day move ${signed(market.lateMomentumPct)}%, and relative volume ${market.relativeVolume}x produced a ${score}/100 overnight setup score.`;
}

function marketRegime(rows) {
  const liquid = rows.filter((row) => row.market.dollarVolume >= 20_000_000).slice(0, 20);
  const breadth = liquid.length ? liquid.filter((row) => row.market.dayChangePct > 0).length / liquid.length : 0.5;
  const lateBreadth = liquid.length ? liquid.filter((row) => row.market.lateMomentumPct > 0).length / liquid.length : 0.5;
  const label = breadth >= 0.62 && lateBreadth >= 0.55 ? "RISK_ON" : breadth <= 0.38 ? "RISK_OFF" : "MIXED";
  return { label, positiveBreadthPct: Math.round(breadth * 100), positiveLateBreadthPct: Math.round(lateBreadth * 100), sampleSize: liquid.length };
}

function itemSentiment(item, text) {
  if (item.raw?.sentiment === "Bullish") return 0.7;
  if (item.raw?.sentiment === "Bearish") return -0.7;
  const positive = (text.match(/\b(beat|bullish|breakout|upgrade|record|surge|rally|strong|buyback|approval|contract|partnership|raise|buy)\b/gi) || []).length;
  const negative = (text.match(/\b(bearish|miss|lawsuit|probe|recall|delay|cut|weak|fraud|downgrade|selloff|crash|short|dump)\b/gi) || []).length;
  return clamp((positive - negative) / Math.max(2, Math.sqrt(text.split(/\s+/).length)), -1, 1);
}

function marketClosedReason(year, month, day, weekday) {
  if (weekday === "Sat" || weekday === "Sun") return "weekend";
  const key = `${month}-${day}`;
  const observedFixed = new Set([observedDate(year, 1, 1), observedDate(year, 6, 19), observedDate(year, 7, 4), observedDate(year, 12, 25)]);
  if (observedFixed.has(key)) return "US market holiday";
  if (month === 1 && day === nthWeekday(year, 1, 1, 3)) return "Martin Luther King Jr. Day";
  if (month === 2 && day === nthWeekday(year, 2, 1, 3)) return "Presidents Day";
  if (month === 5 && day === lastWeekday(year, 5, 1)) return "Memorial Day";
  if (month === 9 && day === nthWeekday(year, 9, 1, 1)) return "Labor Day";
  if (month === 11 && day === nthWeekday(year, 11, 4, 4)) return "Thanksgiving";
  const easter = easterSunday(year);
  const goodFriday = new Date(Date.UTC(year, easter.month - 1, easter.day - 2));
  if (month === goodFriday.getUTCMonth() + 1 && day === goodFriday.getUTCDate()) return "Good Friday";
  return null;
}

function isEarlyClose(year, month, day, weekday) {
  const thanksgiving = nthWeekday(year, 11, 4, 4);
  if (month === 11 && day === thanksgiving + 1 && weekday === "Fri") return true;
  if (month === 12 && day === 24 && !marketClosedReason(year, month, day, weekday)) return true;
  if (month === 7 && ((day === 3 && weekday !== "Sat" && weekday !== "Sun") || (day === 2 && weekday === "Fri"))) return true;
  return false;
}

function zonedParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: MARKET_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { year: Number(values.year), month: Number(values.month), day: Number(values.day), weekday: values.weekday, hour: Number(values.hour) % 24, minute: Number(values.minute) };
}

function observedDate(year, month, day) { const d = new Date(Date.UTC(year, month - 1, day)); const w = d.getUTCDay(); if (w === 6) d.setUTCDate(day - 1); if (w === 0) d.setUTCDate(day + 1); return `${d.getUTCMonth() + 1}-${d.getUTCDate()}`; }
function nthWeekday(year, month, weekday, nth) { const first = new Date(Date.UTC(year, month - 1, 1)); return 1 + ((7 + weekday - first.getUTCDay()) % 7) + (nth - 1) * 7; }
function lastWeekday(year, month, weekday) { const last = new Date(Date.UTC(year, month, 0)); return last.getUTCDate() - ((7 + last.getUTCDay() - weekday) % 7); }
function easterSunday(year) { const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1; return { month, day }; }
async function mapLimit(values, concurrency, mapper) { const output=new Array(values.length); let cursor=0; async function worker(){ while(cursor<values.length){ const index=cursor++; output[index]=await mapper(values[index]); } } await Promise.all(Array.from({length:Math.min(concurrency,values.length)},worker)); return output; }
function weightedAverage(rows) { const total=rows.reduce((sum,[,w])=>sum+w,0); return total ? rows.reduce((sum,[v,w])=>sum+v*w,0)/total : 0; }
function average(values) { return values.length ? values.reduce((sum,value)=>sum+value,0)/values.length : 0; }
function finite(value) { const number=Number(value); return Number.isFinite(number) ? number : null; }
function pct(value, base) { return round(((value-base)/Math.max(Math.abs(base),0.0001))*100); }
function clamp(value,min,max){ return Math.max(min,Math.min(max,Number(value)||0)); }
function round(value){ return Math.round((Number(value)||0)*100)/100; }
function signed(value){ return `${Number(value)>=0?"+":""}${round(value)}`; }
function numberEnv(name,fallback){ const value=Number(process.env[name]); return Number.isFinite(value)?value:fallback; }
function pad(value){ return String(value).padStart(2,"0"); }
function minuteLabel(value){ const hour=Math.floor(value/60); const minute=value%60; return `${hour%12||12}:${pad(minute)} ${hour>=12?"PM":"AM"} CT`; }
function chicagoDateKey(date){ const p=zonedParts(date); return `${p.year}-${pad(p.month)}-${pad(p.day)}`; }
