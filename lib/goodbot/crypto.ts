import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function encryptionKey() {
  const secret = process.env.GOODBOT_TOKEN_ENCRYPTION_KEY ||
    (process.env.NODE_ENV === "production" ? undefined : process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!secret) {
    throw new Error("GoodBot is missing required environment variable: GOODBOT_TOKEN_ENCRYPTION_KEY.");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${Buffer.concat([iv, tag, encrypted]).toString("base64url")}`;
}

export function decryptSecret(value: string) {
  if (!value.startsWith("v1:")) throw new Error("Unsupported encrypted token format.");
  const payload = Buffer.from(value.slice(3), "base64url");
  const iv = payload.subarray(0, IV_LENGTH);
  const tag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
