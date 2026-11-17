import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

// Server helpers for the private HQ page. The password is never in this repo or
// in an environment variable: its scrypt hash and the session-signing secret
// live in the server-only hq_settings table.

export const SESSION_DAYS = 30;
export const COOKIE = "hq_session";

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

// stored: "scrypt$<salt hex>$<hash hex>"
export function passwordMatches(password, stored) {
  const [scheme, salt, hash] = String(stored || "").split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  if (typeof password !== "string" || !password || password.length > 200) return false;
  const candidate = scryptSync(password, salt, hash.length / 2).toString("hex");
  return safeEqual(candidate, hash);
}

const sign = (secret, expires) => createHmac("sha256", secret).update(`hq:${expires}`).digest("hex");

export function makeSession(secret, now = Date.now()) {
  const expires = now + SESSION_DAYS * 864e5;
  return `${expires}.${sign(secret, expires)}`;
}

export function sessionValid(secret, value, now = Date.now()) {
  if (!secret || typeof value !== "string") return false;
  const [expires, mac] = value.split(".");
  if (!/^\d{13}$/.test(expires || "") || !mac) return false;
  if (Number(expires) < now) return false;
  return safeEqual(mac, sign(secret, expires));
}

export function readCookie(req, name) {
  const header = String(req.headers?.cookie || "");
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return "";
}

export function sessionCookie(value, maxAgeSeconds) {
  return `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}
