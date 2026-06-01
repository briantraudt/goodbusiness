import { runSocialArbNightly } from "../lib/social-arb.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (isVercelCron(req) && !isMarketMorningWindow()) {
    return res.status(200).json({
      ok: true,
      skipped: true,
      reason: "Outside 8:20 AM America/Chicago market-morning window.",
    });
  }

  try {
    const result = await runSocialArbNightly({
      hours: req.query?.hours,
      limitPerSource: req.query?.limitPerSource,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Social ARB run failed.",
    });
  }
}

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET || process.env.SOCIAL_ARB_CRON_SECRET;
  if (!secret) {
    return true;
  }

  const header = req.headers.authorization || "";
  const expected = `Bearer ${secret}`;
  return header === expected || req.query?.secret === secret;
}

function isVercelCron(req) {
  return String(req.headers["user-agent"] || "").toLowerCase().includes("vercel-cron");
}

function isMarketMorningWindow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekday = values.weekday;
  const hour = Number(values.hour);
  const minute = Number(values.minute);

  if (weekday === "Sat" || weekday === "Sun") {
    return false;
  }

  return hour === 8 && minute >= 15 && minute <= 25;
}
