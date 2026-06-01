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
  if (!process.env.SOCIAL_ARB_CRON_SECRET) {
    return true;
  }

  const header = req.headers.authorization || "";
  const expected = `Bearer ${process.env.SOCIAL_ARB_CRON_SECRET}`;
  return header === expected || req.query?.secret === process.env.SOCIAL_ARB_CRON_SECRET;
}
