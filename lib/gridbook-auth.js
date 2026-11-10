import { createHash, randomBytes } from "node:crypto";

// Shared server helpers for Gridbook sign-in. Everything here runs with the
// Supabase service role, so it must only be imported by /api routes.

export const DEVICE_TTL_DAYS = 90;
export const PENDING_TTL_MINUTES = 30;

export function config() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } };
}

export const sha256 = value => createHash("sha256").update(String(value)).digest("hex");
export const randomToken = () => randomBytes(32).toString("base64url");
export const cleanEmail = value => (typeof value === "string" ? value.trim().toLowerCase().slice(0, 254) : "");
export const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function readBody(req) {
  try {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return {};
  }
}

export async function rest(cfg, path, { method = "GET", body, prefer } = {}) {
  const headers = { ...cfg.headers };
  if (prefer) headers.Prefer = prefer;
  const r = await fetch(`${cfg.url}/rest/v1/${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!r.ok) throw new Error(`rest ${method} ${path.split("?")[0]} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const text = await r.text();
  return text ? JSON.parse(text) : null;
}

async function generateLink(cfg, email) {
  const r = await fetch(`${cfg.url}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: cfg.headers,
    body: JSON.stringify({ type: "magiclink", email }),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

// One-time sign-in token for an email, creating the account if it is new.
export async function signInToken(cfg, email) {
  let result = await generateLink(cfg, email);
  if (!result.ok) {
    const created = await fetch(`${cfg.url}/auth/v1/admin/users`, {
      method: "POST",
      headers: cfg.headers,
      body: JSON.stringify({ email, email_confirm: true }),
    });
    if (!created.ok && created.status !== 422) {
      throw new Error(`create user ${created.status}: ${(await created.text()).slice(0, 200)}`);
    }
    result = await generateLink(cfg, email);
  }
  const token = result.data?.hashed_token || result.data?.properties?.hashed_token;
  if (!result.ok || !token) throw new Error(`generate_link ${result.status}: ${JSON.stringify(result.data).slice(0, 200)}`);
  return token;
}

// The signed-in user behind a request's access token, or null.
export async function userFromRequest(cfg, req) {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  const r = await fetch(`${cfg.url}/auth/v1/user`, { headers: { apikey: cfg.headers.apikey, Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const user = await r.json().catch(() => null);
  return user && user.id ? user : null;
}

export async function userEmail(cfg, userId) {
  const r = await fetch(`${cfg.url}/auth/v1/admin/users/${encodeURIComponent(userId)}`, { headers: cfg.headers });
  if (!r.ok) return null;
  const user = await r.json().catch(() => null);
  return user && user.email ? String(user.email).toLowerCase() : null;
}

// Returns the device's user id when the token is valid and belongs to `email`.
export async function checkDevice(cfg, deviceToken, email) {
  if (typeof deviceToken !== "string" || deviceToken.length < 20 || deviceToken.length > 200) return null;
  const rows = await rest(cfg, `gridbook_devices?select=id,user_id,last_used_at&token_hash=eq.${sha256(deviceToken)}&limit=1`);
  const device = rows && rows[0];
  if (!device) return null;
  if (Date.now() - new Date(device.last_used_at).getTime() > DEVICE_TTL_DAYS * 864e5) return null;
  const owner = await userEmail(cfg, device.user_id);
  if (!owner || owner !== email) return null;
  await rest(cfg, `gridbook_devices?id=eq.${device.id}`, { method: "PATCH", body: { last_used_at: new Date().toISOString() }, prefer: "return=minimal" }).catch(() => null);
  return device.user_id;
}
