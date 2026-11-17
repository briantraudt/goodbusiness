import { config, readBody, rest } from "../lib/gridbook-auth.js";
import { COOKIE, SESSION_DAYS, makeSession, passwordMatches, readCookie, sessionCookie, sessionValid } from "../lib/hq-auth.js";

// Private agent dashboard for goodbusinesshq.com/hq.
// GET            -> the dashboard data, only with a valid session cookie.
// POST login     -> checks the password, sets the session cookie.
// POST logout    -> clears it.

const MAX_FAILS = 8; // wrong passwords allowed per 15 minutes, site-wide

async function settings(cfg) {
  const rows = await rest(cfg, "hq_settings?select=key,value&key=in.(password_hash,session_secret)");
  return Object.fromEntries((rows || []).map(row => [row.key, row.value]));
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: "The dashboard is temporarily unavailable." });

  try {
    const { password_hash: passwordHash, session_secret: secret } = await settings(cfg);
    if (!passwordHash || !secret) return res.status(503).json({ error: "The dashboard is not set up yet." });

    if (req.method === "GET") {
      if (!sessionValid(secret, readCookie(req, COOKIE))) return res.status(401).json({ error: "Sign in." });
      const data = await rest(cfg, "rpc/hq_dashboard", { method: "POST", body: {} });
      return res.status(200).json(data || {});
    }

    if (req.method === "POST") {
      const body = readBody(req);
      if (body.action === "logout") {
        res.setHeader("Set-Cookie", sessionCookie("", 0));
        return res.status(200).json({ ok: true });
      }
      if (body.action !== "login") return res.status(400).json({ error: "Unknown action." });

      const since = new Date(Date.now() - 15 * 60_000).toISOString();
      const recent = await rest(cfg, `hq_login_attempts?select=id&created_at=gte.${encodeURIComponent(since)}&limit=${MAX_FAILS}`);
      if ((recent || []).length >= MAX_FAILS) return res.status(429).json({ error: "Too many tries. Wait 15 minutes." });

      if (!passwordMatches(body.password, passwordHash)) {
        await rest(cfg, "hq_login_attempts", { method: "POST", body: {}, prefer: "return=minimal" }).catch(() => null);
        return res.status(401).json({ error: "Wrong password." });
      }
      res.setHeader("Set-Cookie", sessionCookie(makeSession(secret), SESSION_DAYS * 86400));
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("HQ dashboard failed.", error);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
