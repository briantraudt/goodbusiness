const requestTimeoutMs = 14_000;
const reportRecipient = "briantraudt@gmail.com";
const socialUserAgent = "GoodBusiness Social ARB/1.0 (+free public social monitoring)";

const sourceWeights = {
  reddit: 1,
  hacker_news: 0.85,
  lobsters: 0.55,
  lemmy: 0.65,
  stocktwits: 1.25,
};

const stocktwitsSymbols = [
  "NVDA", "TSLA", "AAPL", "MSFT", "GOOGL", "META", "AMZN", "AMD", "INTC", "AVGO",
  "TSM", "PLTR", "SMCI", "COIN", "MSTR", "HOOD", "ARM", "NOW", "NFLX", "DIS",
  "BA", "JPM", "XOM",
];

const redditSubreddits = [
  "wallstreetbets", "stocks", "investing", "StockMarket", "options", "ValueInvesting",
  "technology", "artificial", "electricvehicles", "CryptoCurrency", "economics", "news",
];

const hnQueries = [
  "Nvidia GPU AI chip datacenter",
  "Apple iPhone App Store",
  "Tesla EV robotaxi",
  "Microsoft OpenAI Azure",
  "Google Gemini antitrust",
  "Amazon AWS",
  "Meta Instagram WhatsApp",
  "semiconductor TSMC ASML",
  "cybersecurity breach ransomware",
  "rates inflation jobs recession",
];

const rssFeeds = [
  { source: "lobsters", channel: "lobsters", url: "https://lobste.rs/rss" },
  { source: "lemmy", channel: "lemmy technology", url: "https://lemmy.world/feeds/c/technology.xml?sort=Active" },
  { source: "lemmy", channel: "lemmy news", url: "https://lemmy.world/feeds/c/news.xml?sort=Active" },
  { source: "lemmy", channel: "lemmy world", url: "https://lemmy.world/feeds/c/world.xml?sort=Active" },
  { source: "lemmy", channel: "programming.dev", url: "https://programming.dev/feeds/c/programming.xml?sort=Active" },
];

const tickerAliases = new Map(
  Object.entries({
    Apple: "AAPL",
    iPhone: "AAPL",
    Microsoft: "MSFT",
    Azure: "MSFT",
    OpenAI: "MSFT",
    Nvidia: "NVDA",
    NVIDIA: "NVDA",
    GPU: "NVDA",
    CUDA: "NVDA",
    Tesla: "TSLA",
    robotaxi: "TSLA",
    Google: "GOOGL",
    Alphabet: "GOOGL",
    Gemini: "GOOGL",
    Meta: "META",
    Facebook: "META",
    Instagram: "META",
    Amazon: "AMZN",
    AWS: "AMZN",
    AMD: "AMD",
    Intel: "INTC",
    Broadcom: "AVGO",
    TSMC: "TSM",
    ASML: "ASML",
    Palantir: "PLTR",
    Coinbase: "COIN",
    Bitcoin: "MSTR",
    "BTC.X": "MSTR",
    Netflix: "NFLX",
    Disney: "DIS",
    Boeing: "BA",
    JPMorgan: "JPM",
    Exxon: "XOM",
  }).map(([key, value]) => [key.toLowerCase(), value]),
);

const sectorTickers = {
  ai: ["NVDA", "MSFT", "GOOGL", "META", "AMD", "AVGO", "PLTR"],
  semiconductor: ["NVDA", "AMD", "INTC", "AVGO", "TSM", "ASML", "SMCI"],
  ev: ["TSLA", "GM", "F", "RIVN", "LCID"],
  crypto: ["MSTR", "COIN", "HOOD", "RIOT", "MARA"],
  streaming: ["NFLX", "DIS", "WBD", "PARA"],
  cybersecurity: ["CRWD", "PANW", "ZS", "NET", "OKTA"],
  banking: ["JPM", "BAC", "C", "GS", "MS"],
  energy: ["XOM", "CVX", "OXY", "COP", "SLB"],
  retail: ["AMZN", "WMT", "TGT", "COST", "SHOP"],
};

const themes = {
  "AI infrastructure": ["ai", "artificial", "intelligence", "gpu", "gpus", "datacenter", "llm", "model", "models", "chip", "chips"],
  Semiconductors: ["semiconductor", "semiconductors", "chip", "chips", "foundry", "wafer", "tsmc", "asml", "gpu", "cuda"],
  "Electric vehicles": ["tesla", "ev", "electric", "vehicle", "vehicles", "robotaxi", "battery", "charging"],
  "Crypto risk appetite": ["bitcoin", "btc", "ethereum", "crypto", "coinbase", "mstr", "etf", "stablecoin"],
  "Consumer platforms": ["iphone", "app", "store", "instagram", "facebook", "tiktok", "ads", "advertising", "streaming"],
  Cybersecurity: ["cybersecurity", "breach", "ransomware", "hack", "hacked", "security", "vulnerability", "outage"],
  "Macro rates": ["inflation", "rates", "rate", "fed", "jobs", "cpi", "recession", "yield", "yields", "tariff"],
  "Healthcare biotech": ["fda", "drug", "trial", "biotech", "vaccine", "approval", "phase", "patient"],
};

const positiveWords = new Set([
  "beat", "beats", "bull", "bullish", "breakout", "growth", "upgrade", "record", "surge",
  "rally", "strong", "profit", "margin", "demand", "buyback", "approval", "win", "launch",
  "partnership", "raise", "love", "cheap", "ready", "bulls", "buy",
]);

const negativeWords = new Set([
  "bear", "bearish", "miss", "lawsuit", "probe", "investigation", "antitrust", "recall",
  "delay", "cut", "weak", "fraud", "breach", "hack", "outage", "strike", "tariff", "ban",
  "downgrade", "selloff", "crash", "risk", "short", "dump", "expensive", "overvalued",
]);

const stopwords = new Set([
  "about", "after", "again", "against", "also", "because", "before", "being", "could",
  "daily", "does", "down", "from", "have", "into", "just", "like", "market", "markets",
  "more", "most", "news", "over", "people", "post", "really", "says", "some", "stock",
  "stocks", "than", "that", "their", "there", "these", "they", "this", "those", "through",
  "today", "trading", "under", "what", "when", "where", "which", "while", "with", "would",
  "year", "years", "your",
]);

const nonEquityTickers = new Set(["BTC", "ETH", "DOGE", "SOL", "XRP", "ADA"]);

export async function runSocialArbNightly(options = {}) {
  const startedAt = new Date();
  const hours = Number(options.hours || process.env.SOCIAL_ARB_LOOKBACK_HOURS || 14);
  const limitPerSource = Number(options.limitPerSource || process.env.SOCIAL_ARB_LIMIT_PER_SOURCE || 80);
  const items = await collectSocialItems(limitPerSource);
  const recentItems = items.filter((item) => new Date(item.createdAt).getTime() >= Date.now() - hours * 60 * 60 * 1000);
  const analyzedItems = recentItems.length ? recentItems : items;
  const heuristicReport = analyzeItems(analyzedItems);
  const report = await refineReportWithOpenAI(heuristicReport, analyzedItems);
  const persisted = await persistReport(report, analyzedItems, startedAt);
  const email = await sendReportEmail(report, persisted?.id || null);

  return {
    ok: true,
    collected: items.length,
    analyzed: analyzedItems.length,
    topics: report.topics.length,
    reportId: persisted?.id || null,
    emailId: email?.id || null,
    generatedAt: report.generatedAt,
  };
}

export async function collectSocialItems(limitPerSource = 80) {
  const groups = await Promise.allSettled([
    collectStocktwits(limitPerSource),
    collectHackerNews(limitPerSource),
    collectRssFeeds(limitPerSource),
    collectReddit(limitPerSource),
  ]);

  return groups
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item) => item.title || item.body)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function collectStocktwits(limitPerSource) {
  const urls = [
    "https://api.stocktwits.com/api/2/streams/trending.json",
    ...stocktwitsSymbols.map((symbol) => `https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`),
  ];
  const items = [];

  for (const url of urls) {
    if (items.length >= limitPerSource) break;
    try {
      const data = await fetchJson(url);
      const channel = data.symbol?.symbol || "trending";
      for (const message of data.messages || []) {
        const symbols = (message.symbols || []).map((symbol) => `$${symbol.symbol}`).join(" ");
        const body = stripHtml(`${message.body || ""} ${symbols}`.trim());
        items.push({
          source: "stocktwits",
          channel,
          externalId: String(message.id),
          title: body.slice(0, 160),
          body,
          url: `https://stocktwits.com/message/${message.id}`,
          author: message.user?.username || "",
          score: 0,
          comments: 0,
          createdAt: parseDate(message.created_at),
          raw: {
            symbols: message.symbols || [],
            sentiment: message.entities?.sentiment?.basic || null,
          },
        });
      }
    } catch {
      continue;
    }
  }

  return items.slice(0, limitPerSource);
}

async function collectHackerNews(limitPerSource) {
  const perQuery = Math.max(1, Math.floor(limitPerSource / hnQueries.length));
  const items = [];

  for (const query of hnQueries) {
    const url = `https://hn.algolia.com/api/v1/search_by_date?${new URLSearchParams({
      query,
      tags: "story",
      hitsPerPage: String(perQuery),
    })}`;
    try {
      const data = await fetchJson(url);
      for (const hit of data.hits || []) {
        const title = stripHtml(hit.title || hit.story_title || "");
        const body = stripHtml(hit.story_text || "");
        items.push({
          source: "hacker_news",
          channel: query,
          externalId: String(hit.objectID || stableId("hn", title)),
          title,
          body,
          url: hit.url || hit.story_url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          author: hit.author || "",
          score: Number(hit.points || 0),
          comments: Number(hit.num_comments || 0),
          createdAt: parseDate(hit.created_at),
          raw: {},
        });
      }
    } catch {
      continue;
    }
  }

  return items.slice(0, limitPerSource);
}

async function collectRssFeeds(limitPerSource) {
  const items = [];
  for (const feed of rssFeeds) {
    if (items.length >= limitPerSource) break;
    try {
      const xml = await fetchText(feed.url);
      items.push(...parseRss(xml, feed));
    } catch {
      continue;
    }
  }
  return items.slice(0, limitPerSource);
}

async function collectReddit(limitPerSource) {
  const items = [];
  for (const subreddit of redditSubreddits) {
    if (items.length >= limitPerSource) break;
    const feed = {
      source: "reddit",
      channel: `r/${subreddit}`,
      url: `https://www.reddit.com/r/${subreddit}/top/.rss?t=day`,
    };
    try {
      const xml = await fetchText(feed.url);
      items.push(...parseRss(xml, feed));
    } catch {
      continue;
    }
  }
  return items.slice(0, limitPerSource);
}

function analyzeItems(items) {
  const grouped = new Map();
  for (const item of items) {
    const text = `${item.title} ${item.body}`;
    const tokens = tokenize(text);
    const tickers = extractTickers(text);
    const topic = chooseTheme(tokens, tickers);
    const sentiment = itemSentiment(item, tokens);
    const score = itemScore(item);
    if (!grouped.has(topic)) grouped.set(topic, []);
    grouped.get(topic).push({ item, tickers, sentiment, score });
  }

  const topics = [...grouped.entries()]
    .map(([topic, rows]) => buildTopic(topic, rows))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    generatedAt: new Date().toISOString(),
    topics,
  };
}

function buildTopic(topic, rows) {
  const score = rows.reduce((sum, row) => sum + row.score, 0);
  const sentiment = rows.reduce((sum, row) => sum + row.sentiment * row.score, 0) / Math.max(score, 0.001);
  const sources = {};
  const tickerScores = new Map();
  const tickerSentiments = new Map();
  const tickerMentions = new Map();

  for (const row of rows) {
    sources[row.item.source] = (sources[row.item.source] || 0) + 1;
    for (const ticker of uniqueTickers([...row.tickers, ...inferredTickers(topic).slice(0, 3)])) {
      if (nonEquityTickers.has(ticker)) continue;
      const direct = row.tickers.includes(ticker);
      const multiplier = direct ? 1.35 : 0.45;
      tickerScores.set(ticker, (tickerScores.get(ticker) || 0) + row.score * multiplier);
      tickerSentiments.set(ticker, (tickerSentiments.get(ticker) || 0) + row.sentiment * row.score);
      tickerMentions.set(ticker, (tickerMentions.get(ticker) || 0) + (direct ? 1 : 0));
    }
  }

  const affectedStocks = [...tickerScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ticker, tickerScore]) => {
      let tickerSentiment = (tickerSentiments.get(ticker) || 0) / Math.max(tickerScore, 0.001);
      if (Math.abs(tickerSentiment) < 0.05) tickerSentiment = sentiment;
      const direction = tickerSentiment > 0.08 ? "up" : tickerSentiment < -0.08 ? "down" : "mixed";
      const mentions = tickerMentions.get(ticker) || 0;
      return {
        ticker,
        direction,
        confidence: round(Math.min(0.95, 0.35 + Math.min(tickerScore, 20) / 40 + Math.min(Math.abs(tickerSentiment), 1) * 0.2)),
        mentions,
        reason: directionReason(direction, mentions),
      };
    });

  for (const ticker of inferredTickers(topic)) {
    if (affectedStocks.length >= 3) break;
    if (affectedStocks.some((stock) => stock.ticker === ticker)) continue;
    const direction = sentiment > 0.08 ? "up" : sentiment < -0.08 ? "down" : "mixed";
    affectedStocks.push({
      ticker,
      direction,
      confidence: round(0.32 + Math.min(Math.abs(sentiment), 1) * 0.18),
      mentions: 0,
      reason: directionReason(direction, 0),
    });
  }

  const evidence = rows
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((row) => row.item);

  return {
    topic,
    summary: `${rows.length} items across ${Object.keys(sources).length} sources show ${tone(sentiment)} attention around ${topic}.`,
    score: round(score),
    sentiment: round(sentiment),
    sources,
    affectedStocks: affectedStocks.slice(0, 3),
    evidence,
  };
}

async function refineReportWithOpenAI(report, items) {
  if (!process.env.OPENAI_API_KEY || report.topics.length < 3) {
    return report;
  }

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      topics: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            topic: { type: "string" },
            summary: { type: "string" },
            sentiment: { type: "number" },
            affectedStocks: {
              type: "array",
              minItems: 3,
              maxItems: 3,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  ticker: { type: "string" },
                  direction: { type: "string", enum: ["up", "down", "mixed"] },
                  confidence: { type: "number" },
                  mentions: { type: "integer" },
                  reason: { type: "string" },
                },
                required: ["ticker", "direction", "confidence", "mentions", "reason"],
              },
            },
          },
          required: ["topic", "summary", "sentiment", "affectedStocks"],
        },
      },
    },
    required: ["topics"],
  };

  try {
    const result = await requestOpenAIJson({
      model: process.env.SOCIAL_ARB_OPENAI_MODEL || process.env.OPENAI_MODEL || "gpt-5-mini",
      name: "social_arb_nightly_report",
      schema,
      developerPrompt:
        "You are a social-market signal analyst. Use only the supplied free/public social data and heuristic report. " +
        "Return exactly three conversation topics. For each topic, return exactly three publicly traded equity tickers, likely direction of social pressure, confidence from 0 to 1, and a concise rationale. " +
        "Do not claim certainty, do not give trading advice, and do not invent source data.",
      input: {
        heuristic_report: report,
        evidence_items: items.slice(0, 80).map((item) => ({
          source: item.source,
          channel: item.channel,
          title: item.title.slice(0, 220),
          body: item.body.slice(0, 500),
          url: item.url,
          score: item.score,
          comments: item.comments,
          createdAt: item.createdAt,
        })),
      },
    });

    return {
      ...report,
      generatedAt: new Date().toISOString(),
      topics: result.topics.map((topic, index) => ({
        ...report.topics[index],
        topic: sanitizeText(topic.topic, 120) || report.topics[index]?.topic || "Market conversation",
        summary: sanitizeText(topic.summary, 700) || report.topics[index]?.summary || "",
        sentiment: clamp(Number(topic.sentiment || 0), -1, 1),
        affectedStocks: topic.affectedStocks.map((stock) => ({
          ticker: sanitizeTicker(stock.ticker),
          direction: ["up", "down", "mixed"].includes(stock.direction) ? stock.direction : "mixed",
          confidence: clamp(Number(stock.confidence || 0.5), 0, 1),
          mentions: Math.max(0, Number.parseInt(stock.mentions || 0, 10)),
          reason: sanitizeText(stock.reason, 220),
        })),
      })),
    };
  } catch (error) {
    return {
      ...report,
      openaiError: error instanceof Error ? error.message.slice(0, 300) : "OpenAI refinement failed",
    };
  }
}

async function persistReport(report, items, startedAt) {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/social_arb_reports`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      generated_at: report.generatedAt,
      started_at: startedAt.toISOString(),
      item_count: items.length,
      topics: report.topics,
      source_counts: countBy(items, "source"),
      raw_item_sample: items.slice(0, 75),
      email_to: process.env.SOCIAL_ARB_EMAIL_TO || reportRecipient,
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase report insert failed: ${(await response.text()).slice(0, 300)}`);
  }

  const rows = await response.json();
  return rows?.[0] || null;
}

async function sendReportEmail(report, reportId) {
  if (!process.env.RESEND_API_KEY) return null;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.SOCIAL_ARB_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "Good Business <onboarding@resend.dev>",
      to: process.env.SOCIAL_ARB_EMAIL_TO || reportRecipient,
      subject: `Social ARB Nightly: ${report.topics.map((topic) => topic.topic).join(" | ")}`,
      html: renderEmailHtml(report, reportId),
      text: renderEmailText(report, reportId),
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend email failed: ${JSON.stringify(payload).slice(0, 300)}`);
  }

  return payload;
}

function renderEmailHtml(report, reportId) {
  const topics = report.topics
    .map((topic, index) => `
      <section style="border-top:1px solid #e5e7eb;padding:22px 0;">
        <h2 style="font-size:20px;line-height:1.25;margin:0 0 8px;">${index + 1}. ${escapeHtml(topic.topic)}</h2>
        <p style="margin:0 0 12px;color:#374151;">${escapeHtml(topic.summary)}</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <thead><tr>
            <th align="left" style="border-bottom:1px solid #d1d5db;padding:8px;">Stock</th>
            <th align="left" style="border-bottom:1px solid #d1d5db;padding:8px;">Direction</th>
            <th align="right" style="border-bottom:1px solid #d1d5db;padding:8px;">Confidence</th>
            <th align="left" style="border-bottom:1px solid #d1d5db;padding:8px;">Rationale</th>
          </tr></thead>
          <tbody>
            ${topic.affectedStocks
              .map((stock) => `
                <tr>
                  <td style="border-bottom:1px solid #f3f4f6;padding:8px;font-weight:700;">${escapeHtml(stock.ticker)}</td>
                  <td style="border-bottom:1px solid #f3f4f6;padding:8px;">${escapeHtml(stock.direction)}</td>
                  <td align="right" style="border-bottom:1px solid #f3f4f6;padding:8px;">${Math.round(stock.confidence * 100)}%</td>
                  <td style="border-bottom:1px solid #f3f4f6;padding:8px;">${escapeHtml(stock.reason)}</td>
                </tr>`)
              .join("")}
          </tbody>
        </table>
        <div style="margin-top:12px;">
          ${(topic.evidence || [])
            .slice(0, 3)
            .map((item) => `<p style="margin:6px 0;font-size:13px;"><a href="${escapeAttribute(item.url)}">${escapeHtml(item.title || item.url)}</a> <span style="color:#6b7280;">(${escapeHtml(item.source)})</span></p>`)
            .join("")}
        </div>
      </section>`)
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:0 auto;color:#111827;">
      <h1 style="font-size:26px;line-height:1.2;margin:0 0 6px;">Social ARB Nightly Report</h1>
      <p style="margin:0 0 18px;color:#6b7280;">Generated ${escapeHtml(new Date(report.generatedAt).toLocaleString("en-US", { timeZone: "America/Chicago" }))}</p>
      ${topics}
      <p style="color:#6b7280;font-size:12px;margin-top:20px;">Public social conversation summary only. Not financial advice.${reportId ? ` Report ID: ${escapeHtml(reportId)}` : ""}</p>
    </div>`;
}

function renderEmailText(report, reportId) {
  return [
    "Social ARB Nightly Report",
    `Generated ${new Date(report.generatedAt).toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
    "",
    ...report.topics.flatMap((topic, index) => [
      `${index + 1}. ${topic.topic}`,
      topic.summary,
      ...topic.affectedStocks.map((stock) => `- ${stock.ticker}: ${stock.direction}, confidence ${Math.round(stock.confidence * 100)}%, ${stock.reason}`),
      "",
    ]),
    "Public social conversation summary only. Not financial advice.",
    reportId ? `Report ID: ${reportId}` : "",
  ].join("\n");
}

async function requestOpenAIJson({ model, name, schema, developerPrompt, input }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: "low" },
      text: { format: { type: "json_schema", name, strict: true, schema } },
      input: [
        { role: "developer", content: developerPrompt },
        { role: "user", content: JSON.stringify(input) },
      ],
    }),
  });

  if (!response.ok) throw new Error((await response.text()).slice(0, 400));
  const payload = await response.json();
  const text =
    payload.output_text ||
    payload.output?.flatMap((item) => item.content || [])?.find((item) => item.type === "output_text")?.text;
  if (!text) throw new Error("OpenAI response did not include output text.");
  return JSON.parse(text);
}

function parseRss(xml, feed) {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
  return blocks.map((block) => {
    const title = stripHtml(xmlValue(block, "title"));
    const link = xmlValue(block, "link") || xmlLinkHref(block) || feed.url;
    const body = stripHtml(xmlValue(block, "description") || xmlValue(block, "summary") || xmlValue(block, "content:encoded"));
    const id = xmlValue(block, "guid") || xmlValue(block, "id") || stableId(feed.source, link, title);
    const published = xmlValue(block, "pubDate") || xmlValue(block, "published") || xmlValue(block, "updated");
    return {
      source: feed.source,
      channel: feed.channel,
      externalId: id,
      title,
      body,
      url: stripHtml(link),
      author: stripHtml(xmlValue(block, "author") || xmlValue(block, "dc:creator")),
      score: 0,
      comments: 0,
      createdAt: parseDate(published),
      raw: { feedUrl: feed.url },
    };
  });
}

function xmlValue(block, tag) {
  const escaped = escapeRegExp(tag);
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return decodeEntities(match?.[1] || "").trim();
}

function xmlLinkHref(block) {
  const match = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  return decodeEntities(match?.[1] || "").trim();
}

function tokenize(text) {
  return [...text.matchAll(/[A-Za-z][A-Za-z0-9+\-.]{2,}/g)]
    .map((match) => match[0].toLowerCase())
    .filter((word) => !stopwords.has(word));
}

function extractTickers(text) {
  const tickers = [...text.toUpperCase().matchAll(/(?<![A-Z0-9])\$([A-Z]{1,5})(?:\.X)?(?![A-Z0-9])/g)].map((match) => match[1]);
  const lowerText = text.toLowerCase();
  for (const [alias, ticker] of tickerAliases.entries()) {
    if (new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i").test(lowerText)) tickers.push(ticker);
  }
  return tickers.filter((ticker) => ticker.length <= 5 && !nonEquityTickers.has(ticker));
}

function chooseTheme(tokens, tickers) {
  const tokenSet = new Set(tokens);
  const scores = new Map(Object.keys(themes).map((theme) => [theme, themes[theme].filter((word) => tokenSet.has(word)).length]));
  const tickerSet = new Set(tickers);
  for (const [sector, symbols] of Object.entries(sectorTickers)) {
    const overlap = symbols.filter((symbol) => tickerSet.has(symbol)).length;
    if (!overlap) continue;
    const theme = sectorTheme(sector);
    scores.set(theme, (scores.get(theme) || 0) + overlap * 2);
  }
  const [bestTheme, bestScore] = [...scores.entries()].sort((a, b) => b[1] - a[1])[0];
  return bestScore > 0 ? bestTheme : "General market chatter";
}

function itemSentiment(item, tokens) {
  if (item.raw?.sentiment === "Bullish") return 0.6;
  if (item.raw?.sentiment === "Bearish") return -0.6;
  const positive = tokens.filter((token) => positiveWords.has(token)).length;
  const negative = tokens.filter((token) => negativeWords.has(token)).length;
  return clamp((positive - negative) / Math.sqrt(Math.max(tokens.length, 1)), -1, 1);
}

function itemScore(item) {
  const ageHours = Math.max(0, (Date.now() - new Date(item.createdAt).getTime()) / 3_600_000);
  const recency = 1 / (1 + ageHours / 12);
  const engagement = 1 + Math.log1p(Math.max(0, item.score || 0)) + Math.log1p(Math.max(0, item.comments || 0));
  return (sourceWeights[item.source] || 1) * recency * engagement;
}

function inferredTickers(topic) {
  const lookup = {
    "AI infrastructure": "ai",
    Semiconductors: "semiconductor",
    "Electric vehicles": "ev",
    "Crypto risk appetite": "crypto",
    "Consumer platforms": "streaming",
    Cybersecurity: "cybersecurity",
    "Macro rates": "banking",
  };
  return sectorTickers[lookup[topic]] || [];
}

function sectorTheme(sector) {
  if (sector === "ai") return "AI infrastructure";
  if (sector === "ev") return "Electric vehicles";
  if (sector === "crypto") return "Crypto risk appetite";
  return sector.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function directionReason(direction, mentions) {
  const mentionText = mentions ? `${mentions} direct mentions` : "sector/theme exposure";
  if (direction === "up") return `positive conversation skew with ${mentionText}`;
  if (direction === "down") return `negative conversation skew with ${mentionText}`;
  return `balanced or conflicting conversation with ${mentionText}`;
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": socialUserAgent,
        Accept: "application/json, application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function parseDate(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? new Date(time).toISOString() : new Date().toISOString();
}

function stripHtml(value) {
  return decodeEntities(String(value || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stableId(...parts) {
  let hash = 0;
  for (const char of parts.join("|")) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function uniqueTickers(tickers) {
  return [...new Set(tickers)];
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
    return counts;
  }, {});
}

function tone(sentiment) {
  if (sentiment > 0.08) return "positive";
  if (sentiment < -0.08) return "negative";
  return "mixed";
}

function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function sanitizeText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeTicker(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z.]/g, "")
    .slice(0, 6);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
