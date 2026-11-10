import { checkDevice, cleanEmail, config, isEmail, randomToken, readBody, rest, sha256, signInToken } from "../lib/gridbook-auth.js";

// Sign up / Log in for Gridbook.
// - A remembered device (it completed an email sign-in before) gets a one-time
//   sign-in token back immediately, with no email.
// - Otherwise a link is emailed from hello@goodbusinesshq.com via Resend, and
//   the requesting tab gets a pending id + secret so it can finish signing in
//   once the link is opened on any device. New emails get an account.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SENDER = "Good Business <hello@goodbusinesshq.com>";
const CANONICAL_ORIGIN = "https://goodbusinesshq.com";
const MAX_PER_EMAIL_PER_HOUR = 5;
const MAX_PER_IP_PER_HOUR = 20;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const cfg = config();
  if (!cfg || !process.env.RESEND_API_KEY) {
    console.error("Gridbook link: missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY.");
    return res.status(503).json({ error: "Sign-in is temporarily unavailable." });
  }

  const body = readBody(req);
  const email = cleanEmail(body.email);
  if (!isEmail(email)) return res.status(400).json({ error: "Enter a valid email address." });

  const supabaseUrl = cfg.url;
  const admin = cfg.headers;
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const emailHash = sha256(email);
  const ipHash = sha256(ip);

  try {
    if (body.deviceToken && (await checkDevice(cfg, body.deviceToken, email))) {
      const token = await signInToken(cfg, email);
      return res.status(200).json({ ok: true, mode: "device", token_hash: token });
    }
  } catch (error) {
    console.error("Gridbook device check failed.", error);
  }

  try {
    const since = new Date(Date.now() - 3600_000).toISOString();
    const [byEmail, byIp] = await Promise.all([
      countRecent(supabaseUrl, admin, "email_hash", emailHash, since),
      countRecent(supabaseUrl, admin, "ip_hash", ipHash, since),
    ]);
    if (byEmail >= MAX_PER_EMAIL_PER_HOUR || byIp >= MAX_PER_IP_PER_HOUR) {
      return res.status(429).json({ error: "Too many links requested. Wait a bit and try again." });
    }

    const token = await signInToken(cfg, email);
    const pollSecret = randomToken();
    const [pending] = await rest(cfg, "gridbook_pending_logins", { method: "POST", body: { email, poll_secret_hash: sha256(pollSecret) }, prefer: "return=representation" });
    const link = `${originFor(req)}/gridbook/?token_hash=${encodeURIComponent(token)}&type=magiclink&p=${pending.id}`;

    await fetch(`${supabaseUrl}/rest/v1/gridbook_link_requests`, {
      method: "POST",
      headers: { ...admin, Prefer: "return=minimal" },
      body: JSON.stringify({ email_hash: emailHash, ip_hash: ipHash }),
    }).catch(() => null);

    const sent = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: SENDER,
        to: [email],
        subject: "Your Gridbook sign-in link",
        html: emailHtml(link),
        text: `Open this link to sign in to Gridbook:\n\n${link}\n\nIt works once and expires in one hour. If you didn't ask for it, ignore this email.`,
      }),
    });
    if (!sent.ok) {
      console.error("Gridbook link: Resend rejected the email.", sent.status, (await sent.text()).slice(0, 300));
      return res.status(502).json({ error: "We couldn't send the email. Try again in a minute." });
    }
    return res.status(200).json({ ok: true, mode: "email", pending: pending.id, poll: pollSecret });
  } catch (error) {
    console.error("Gridbook link failed.", error);
    return res.status(500).json({ error: "We couldn't send the email. Try again in a minute." });
  }
}

async function countRecent(base, headers, column, value, since) {
  const url = `${base}/rest/v1/gridbook_link_requests?select=id&${column}=eq.${value}&created_at=gte.${encodeURIComponent(since)}`;
  const r = await fetch(url, { headers: { ...headers, Prefer: "count=exact", Range: "0-0" } });
  if (!r.ok) throw new Error(`rate check ${r.status}`);
  const total = Number((r.headers.get("content-range") || "").split("/")[1]);
  return Number.isFinite(total) ? total : 0;
}

function originFor(req) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").toLowerCase();
  if (host === "goodbusinesshq.com" || host === "www.goodbusinesshq.com") return `https://${host}`;
  if (/^localhost(:\d+)?$/.test(host)) return `http://${host}`;
  return CANONICAL_ORIGIN;
}

function emailHtml(link) {
  const safe = link.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `
    <div style="background:#050608;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;color:#f5f7fb">
      <div style="max-width:520px;margin:0 auto;background:#0b0e13;padding:36px;border:1px solid #1d232c;border-radius:10px">
        <p style="margin:0 0 24px;font-size:15px;font-weight:bold;letter-spacing:-.02em">Good Business <span style="color:#6b7380">/</span> <span style="color:#30d6a3;font-family:monospace;font-size:12px;letter-spacing:.12em">GRIDBOOK</span></p>
        <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2">Sign in to Gridbook</h1>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#aab2bf">Click the button to open your spreadsheets. The link works once and expires in one hour.</p>
        <a href="${safe}" style="display:inline-block;background:#30d6a3;color:#03140d;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 22px;border-radius:8px">Open Gridbook</a>
        <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:#6b7380">If the button doesn't work, paste this into your browser:<br><span style="color:#aab2bf;word-break:break-all">${safe}</span></p>
        <p style="margin:20px 0 0;padding-top:18px;border-top:1px solid #1d232c;font-size:12px;color:#6b7380">Didn't ask for this? You can ignore it.</p>
      </div>
    </div>`;
}
