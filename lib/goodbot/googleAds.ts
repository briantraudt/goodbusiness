import { decryptSecret, encryptSecret } from "./crypto";
import { getGoodBotBaseUrl } from "./security";
import { getSupabaseAdmin } from "./supabase";

const GOOGLE_ADS_SCOPE = "https://www.googleapis.com/auth/adwords";
const TOKEN_REFRESH_SKEW_MS = 10 * 60 * 1000;

export class GoogleAdsApiError extends Error {
  status: number;
  details: string;
  retryAfterMs: number | null;

  constructor(message: string, input: { status: number; details?: string; retryAfterMs?: number | null }) {
    super(message);
    this.name = "GoogleAdsApiError";
    this.status = input.status;
    this.details = input.details || "";
    this.retryAfterMs = input.retryAfterMs ?? null;
  }
}

export type GoogleAdsAccount = {
  id: string;
  user_id: string;
  provider_user_id: string | null;
  provider_account_name: string | null;
  access_token_ciphertext: string;
  refresh_token_ciphertext: string | null;
  token_expires_at: string | null;
  scopes: string[];
  status: string;
  metadata?: Record<string, unknown> | null;
};

export function getGoogleAdsScopes() {
  return [GOOGLE_ADS_SCOPE];
}

export function checkGoogleAdsReadiness(request?: Request) {
  const missing = [
    "GOOGLE_ADS_CLIENT_ID",
    "GOOGLE_ADS_CLIENT_SECRET",
    "GOOGLE_ADS_DEVELOPER_TOKEN",
    "GOODBOT_TOKEN_ENCRYPTION_KEY"
  ].filter((key) => !process.env[key]);
  if (!process.env.GOODBOT_BASE_URL && !process.env.NEXT_PUBLIC_SITE_URL && (process.env.NODE_ENV === "production" || !request)) {
    missing.push("GOODBOT_BASE_URL or NEXT_PUBLIC_SITE_URL");
  }

  let redirectUri: string | null = null;
  if (!missing.includes("GOODBOT_BASE_URL or NEXT_PUBLIC_SITE_URL")) {
    try {
      redirectUri = `${getGoodBotBaseUrl(request)}/api/goodbot/integrations/google-ads/callback`;
    } catch {
      missing.push("GOODBOT_BASE_URL or NEXT_PUBLIC_SITE_URL");
    }
  }

  return {
    ok: missing.length === 0,
    missing,
    redirect_uri: redirectUri,
    scopes: getGoogleAdsScopes(),
    api_version: googleAdsApiVersion()
  };
}

export function assertGoogleAdsReadiness(request?: Request) {
  const readiness = checkGoogleAdsReadiness(request);
  if (!readiness.ok) {
    throw new Error(`Google Ads is not production-ready. Missing: ${readiness.missing.join(", ")}.`);
  }
  return readiness;
}

export function getGoogleAdsConfig(request?: Request) {
  assertGoogleAdsReadiness(request);
  const baseUrl = getGoodBotBaseUrl(request);
  return {
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    redirectUri: `${baseUrl}/api/goodbot/integrations/google-ads/callback`,
    apiVersion: googleAdsApiVersion()
  };
}

export function getGoogleAdsOAuthDebug(request: Request, state: string) {
  const config = getGoogleAdsConfig(request);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", getGoogleAdsScopes().join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  return {
    client_id_present: Boolean(config.clientId),
    client_id_last4: config.clientId.slice(-4),
    redirect_uri: config.redirectUri,
    scopes_requested: getGoogleAdsScopes(),
    base_url: getGoodBotBaseUrl(request),
    auth_url_without_secret: url.toString(),
    missing_config: checkGoogleAdsReadiness(request).missing
  };
}

export function buildGoogleAdsAuthUrl(request: Request, state: string) {
  return getGoogleAdsOAuthDebug(request, state).auth_url_without_secret;
}

export async function exchangeGoogleAdsCode(request: Request, code: string) {
  const config = getGoogleAdsConfig(request);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Google Ads token exchange failed: HTTP ${response.status}${details ? ` ${details.slice(0, 240)}` : ""}`);
  }

  return response.json() as Promise<{
    access_token: string;
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
  }>;
}

export async function fetchGoogleAdsAccessibleCustomers(accessToken: string) {
  const config = getGoogleAdsConfig();
  const response = await fetch(`https://googleads.googleapis.com/${config.apiVersion}/customers:listAccessibleCustomers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": config.developerToken
    }
  });

  if (!response.ok) {
    throw await googleAdsError(response, "Google Ads customer lookup failed");
  }

  const payload = await response.json() as { resourceNames?: string[] };
  return payload.resourceNames ?? [];
}

export async function refreshGoogleAdsAccessToken(account: GoogleAdsAccount) {
  if (!account.refresh_token_ciphertext) {
    await markGoogleAdsReconnectRequired(account.id, "Google did not provide a refresh token. Reconnect Google Ads.");
    throw new GoogleAdsApiError("Reconnect Google Ads to continue.", { status: 401 });
  }

  const config = getGoogleAdsConfig();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: decryptGoogleAdsToken(account.refresh_token_ciphertext),
    client_id: config.clientId,
    client_secret: config.clientSecret
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    await markGoogleAdsReconnectRequired(account.id, `Google Ads token refresh failed with HTTP ${response.status}.`);
    throw new GoogleAdsApiError("Reconnect Google Ads to continue.", {
      status: response.status,
      details
    });
  }

  const payload = await response.json() as { access_token: string; expires_in?: number; refresh_token?: string; scope?: string };
  const expiresAt = payload.expires_in ? new Date(Date.now() + payload.expires_in * 1000).toISOString() : null;
  const scopes = parseGoogleAdsScopes(payload.scope, account.scopes);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("connected_accounts")
    .update({
      access_token_ciphertext: encryptGoogleAdsToken(payload.access_token),
      refresh_token_ciphertext: payload.refresh_token ? encryptGoogleAdsToken(payload.refresh_token) : account.refresh_token_ciphertext,
      token_expires_at: expiresAt,
      scopes,
      status: "connected",
      metadata: { ...(account.metadata || {}), refreshed_at: new Date().toISOString() },
      updated_at: new Date().toISOString()
    })
    .eq("id", account.id)
    .select("*")
    .single();

  if (error) throw error;
  return data as GoogleAdsAccount;
}

export async function getValidGoogleAdsAccessToken(account: GoogleAdsAccount) {
  if (account.status === "reconnect_required") {
    throw new GoogleAdsApiError("Reconnect Google Ads to continue.", { status: 401 });
  }
  const expiresAt = account.token_expires_at ? Date.parse(account.token_expires_at) : null;
  const needsRefresh = expiresAt !== null && expiresAt - Date.now() <= TOKEN_REFRESH_SKEW_MS;
  const activeAccount = needsRefresh ? await refreshGoogleAdsAccessToken(account) : account;
  return {
    account: activeAccount,
    accessToken: decryptGoogleAdsToken(activeAccount.access_token_ciphertext)
  };
}

export function parseGoogleAdsScopes(scope: string | null | undefined, fallback: string[] = []) {
  return scope ? scope.split(/[,\s]+/).map((item) => item.trim()).filter(Boolean) : fallback;
}

export function encryptGoogleAdsToken(token: string) {
  return encryptSecret(token);
}

export function decryptGoogleAdsToken(ciphertext: string) {
  return decryptSecret(ciphertext);
}

function googleAdsApiVersion() {
  return process.env.GOOGLE_ADS_API_VERSION || "v21";
}

async function markGoogleAdsReconnectRequired(accountId: string, reason: string) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("connected_accounts")
    .update({
      status: "reconnect_required",
      metadata: { reconnect_reason: reason, reconnect_required_at: new Date().toISOString() },
      updated_at: new Date().toISOString()
    })
    .eq("id", accountId);
}

async function googleAdsError(response: Response, prefix: string) {
  const details = await response.text().catch(() => "");
  const retryAfterHeader = response.headers.get("retry-after");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
  const retryAfterMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : null;
  let message = `${prefix}: HTTP ${response.status}`;
  if (response.status === 403) message = "Google Ads permission or developer token was not approved.";
  if (response.status === 429) message = "Google Ads rate limit reached.";
  if (response.status === 401) message = "Reconnect Google Ads to continue.";
  return new GoogleAdsApiError(details ? `${message} ${details.slice(0, 240)}` : message, {
    status: response.status,
    details,
    retryAfterMs
  });
}
