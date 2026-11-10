import { PENDING_TTL_MINUTES, config, randomToken, readBody, rest, sha256, signInToken, userFromRequest } from "../lib/gridbook-auth.js";

// Gridbook sign-in helpers, chosen by `action`:
// - "remember": a signed-in device asks for a device token so next time
//   Sign up / Log in works without an email.
// - "approve":  the device that opened an emailed link marks that request as
//   done, so the tab that asked for it can sign in too.
// - "poll":     the tab that asked for the link checks whether it was opened;
//   once it was, it gets a one-time sign-in token (single use).

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: "Sign-in is temporarily unavailable." });

  const body = readBody(req);
  try {
    if (body.action === "remember") {
      const user = await userFromRequest(cfg, req);
      if (!user) return res.status(401).json({ error: "Not signed in." });
      const deviceToken = randomToken();
      await rest(cfg, "gridbook_devices", { method: "POST", body: { user_id: user.id, token_hash: sha256(deviceToken) }, prefer: "return=minimal" });
      return res.status(200).json({ ok: true, deviceToken });
    }

    if (body.action === "approve") {
      const user = await userFromRequest(cfg, req);
      if (!user) return res.status(401).json({ error: "Not signed in." });
      if (!UUID.test(String(body.pending || ""))) return res.status(400).json({ error: "Bad request." });
      const since = new Date(Date.now() - PENDING_TTL_MINUTES * 60_000).toISOString();
      const email = String(user.email || "").toLowerCase();
      await rest(cfg, `gridbook_pending_logins?id=eq.${body.pending}&email=eq.${encodeURIComponent(email)}&approved_at=is.null&created_at=gte.${encodeURIComponent(since)}`, {
        method: "PATCH",
        body: { approved_user_id: user.id, approved_at: new Date().toISOString() },
        prefer: "return=minimal",
      });
      return res.status(200).json({ ok: true });
    }

    if (body.action === "poll") {
      if (!UUID.test(String(body.pending || "")) || typeof body.poll !== "string") return res.status(400).json({ error: "Bad request." });
      const rows = await rest(cfg, `gridbook_pending_logins?select=id,email,approved_at,consumed_at,created_at&id=eq.${body.pending}&poll_secret_hash=eq.${sha256(body.poll)}&limit=1`);
      const row = rows && rows[0];
      if (!row) return res.status(404).json({ status: "unknown" });
      if (Date.now() - new Date(row.created_at).getTime() > PENDING_TTL_MINUTES * 60_000) return res.status(200).json({ status: "expired" });
      if (row.consumed_at) return res.status(200).json({ status: "used" });
      if (!row.approved_at) return res.status(200).json({ status: "waiting" });
      // Claim it exactly once.
      const claimed = await rest(cfg, `gridbook_pending_logins?id=eq.${row.id}&consumed_at=is.null`, {
        method: "PATCH",
        body: { consumed_at: new Date().toISOString() },
        prefer: "return=representation",
      });
      if (!claimed || !claimed.length) return res.status(200).json({ status: "used" });
      const token = await signInToken(cfg, row.email);
      return res.status(200).json({ status: "approved", token_hash: token });
    }

    return res.status(400).json({ error: "Unknown action." });
  } catch (error) {
    console.error("Gridbook auth failed.", error);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
