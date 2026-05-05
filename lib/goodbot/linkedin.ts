import { getGoodBotBaseUrl } from "./security";
import { decryptSecret, encryptSecret } from "./crypto";
import { getSupabaseAdmin } from "./supabase";

const LINKEDIN_SCOPES = ["openid", "profile", "w_member_social", "r_member_social"];
const TOKEN_REFRESH_SKEW_MS = 10 * 60 * 1000;

export class LinkedInApiError extends Error {
  status: number;
  details: string;
  retryAfterMs: number | null;

  constructor(message: string, input: { status: number; details?: string; retryAfterMs?: number | null }) {
    super(message);
    this.name = "LinkedInApiError";
    this.status = input.status;
    this.details = input.details || "";
    this.retryAfterMs = input.retryAfterMs ?? null;
  }
}

export type LinkedInAccount = {
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

export function checkLinkedInReadiness(request?: Request) {
  const missing = [
    "LINKEDIN_CLIENT_ID",
    "LINKEDIN_CLIENT_SECRET",
    "GOODBOT_TOKEN_ENCRYPTION_KEY",
    "LINKEDIN_API_VERSION"
  ].filter((key) => !process.env[key]);
  if (!process.env.GOODBOT_BASE_URL && !process.env.NEXT_PUBLIC_SITE_URL && (process.env.NODE_ENV === "production" || !request)) {
    missing.push("GOODBOT_BASE_URL or NEXT_PUBLIC_SITE_URL");
  }

  let redirectUri: string | null = null;
  if (!missing.includes("GOODBOT_BASE_URL or NEXT_PUBLIC_SITE_URL")) {
    try {
      redirectUri = `${getGoodBotBaseUrl(request)}/api/goodbot/integrations/linkedin/callback`;
    } catch {
      missing.push("GOODBOT_BASE_URL or NEXT_PUBLIC_SITE_URL");
    }
  }

  return {
    ok: missing.length === 0,
    missing,
    redirect_uri: redirectUri,
    scopes: LINKEDIN_SCOPES,
    api_version: process.env.LINKEDIN_API_VERSION || null
  };
}

export function assertLinkedInReadiness(request?: Request) {
  const readiness = checkLinkedInReadiness(request);
  if (!readiness.ok) {
    throw new Error(`LinkedIn is not production-ready. Missing: ${readiness.missing.join(", ")}.`);
  }
  return readiness;
}

function linkedInApiVersion() {
  const version = process.env.LINKEDIN_API_VERSION;
  if (!version) throw new Error("GoodBot is missing required environment variable: LINKEDIN_API_VERSION.");
  return version;
}

export function getLinkedInConfig(request?: Request) {
  assertLinkedInReadiness(request);
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const baseUrl = getGoodBotBaseUrl(request);
  return {
    clientId: clientId!,
    clientSecret: clientSecret!,
    redirectUri: `${baseUrl}/api/goodbot/integrations/linkedin/callback`
  };
}

export function buildLinkedInAuthUrl(request: Request, state: string) {
  const config = getLinkedInConfig(request);
  const url = new URL("https://www.linkedin.com/oauth/v2/authorization");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", LINKEDIN_SCOPES.join(" "));
  return url.toString();
}

export async function exchangeLinkedInCode(request: Request, code: string) {
  const config = getLinkedInConfig(request);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri
  });

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    throw new Error(`LinkedIn token exchange failed: HTTP ${response.status}`);
  }

  return response.json() as Promise<{ access_token: string; expires_in?: number; refresh_token?: string; scope?: string }>;
}

export async function refreshLinkedInAccessToken(account: LinkedInAccount) {
  if (!account.refresh_token_ciphertext) {
    await markLinkedInReconnectRequired(account.id, "LinkedIn did not provide a refresh token. Reconnect LinkedIn.");
    throw new LinkedInApiError("Reconnect LinkedIn to continue posting.", { status: 401 });
  }

  const config = getLinkedInConfig();
  const refreshToken = decryptLinkedInToken(account.refresh_token_ciphertext);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret
  });

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    await markLinkedInReconnectRequired(account.id, `LinkedIn token refresh failed with HTTP ${response.status}.`);
    throw new LinkedInApiError("Reconnect LinkedIn to continue posting.", {
      status: response.status,
      details
    });
  }

  const payload = await response.json() as { access_token: string; expires_in?: number; refresh_token?: string; scope?: string };
  const expiresAt = payload.expires_in ? new Date(Date.now() + payload.expires_in * 1000).toISOString() : null;
  const scopes = payload.scope?.split(/\s+/).filter(Boolean) ?? account.scopes;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("connected_accounts")
    .update({
      access_token_ciphertext: encryptLinkedInToken(payload.access_token),
      refresh_token_ciphertext: payload.refresh_token ? encryptLinkedInToken(payload.refresh_token) : account.refresh_token_ciphertext,
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
  return data as LinkedInAccount;
}

export async function getValidLinkedInAccessToken(account: LinkedInAccount) {
  if (account.status === "reconnect_required") {
    throw new LinkedInApiError("Reconnect LinkedIn to continue posting.", { status: 401 });
  }
  const expiresAt = account.token_expires_at ? Date.parse(account.token_expires_at) : null;
  const needsRefresh = expiresAt !== null && expiresAt - Date.now() <= TOKEN_REFRESH_SKEW_MS;
  const activeAccount = needsRefresh ? await refreshLinkedInAccessToken(account) : account;
  return {
    account: activeAccount,
    accessToken: decryptLinkedInToken(activeAccount.access_token_ciphertext)
  };
}

export async function fetchLinkedInProfile(accessToken: string) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) {
    throw new Error(`LinkedIn profile fetch failed: HTTP ${response.status}`);
  }
  return response.json() as Promise<{ sub: string; name?: string; email?: string }>;
}

export function encryptLinkedInToken(token: string) {
  return encryptSecret(token);
}

export function decryptLinkedInToken(ciphertext: string) {
  return decryptSecret(ciphertext);
}

export async function createLinkedInTextPost(input: {
  account: LinkedInAccount;
  text: string;
}) {
  const { account, accessToken } = await getValidLinkedInAccessToken(input.account);
  const authorId = account.provider_user_id;
  if (!authorId) throw new Error("LinkedIn account is missing provider_user_id.");

  let response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Linkedin-Version": linkedInApiVersion(),
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      author: `urn:li:person:${authorId}`,
      commentary: input.text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: []
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    })
  });

  if (response.status === 401) {
    const refreshed = await refreshLinkedInAccessToken(account);
    const retryToken = decryptLinkedInToken(refreshed.access_token_ciphertext);
    response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${retryToken}`,
        "Content-Type": "application/json",
        "Linkedin-Version": linkedInApiVersion(),
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify({
        author: `urn:li:person:${authorId}`,
        commentary: input.text,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: []
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false
      })
    });
  }

  if (!response.ok) {
    if (response.status === 401) {
      await markLinkedInReconnectRequired(account.id, "LinkedIn rejected the refreshed access token.");
    }
    throw await linkedInError(response, "LinkedIn post failed");
  }

  const postId = response.headers.get("x-restli-id");
  if (!postId) throw new Error("LinkedIn post succeeded but did not return x-restli-id.");
  return {
    post_id: postId,
    url: linkedInPostUrl(postId)
  };
}

export async function fetchLinkedInComments(input: { account: LinkedInAccount; postId: string }) {
  if (!hasLinkedInCommentReadScope(input.account)) {
    throw new LinkedInApiError("Comment monitoring not available for this LinkedIn app yet.", { status: 403 });
  }
  const { account, accessToken } = await getValidLinkedInAccessToken(input.account);
  const encodedPostId = encodeURIComponent(input.postId);
  let response = await fetch(`https://api.linkedin.com/rest/socialActions/${encodedPostId}/comments?count=50`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Linkedin-Version": linkedInApiVersion(),
      "X-Restli-Protocol-Version": "2.0.0"
    }
  });

  if (response.status === 401) {
    const refreshed = await refreshLinkedInAccessToken(account);
    response = await fetch(`https://api.linkedin.com/rest/socialActions/${encodedPostId}/comments?count=50`, {
      headers: {
        Authorization: `Bearer ${decryptLinkedInToken(refreshed.access_token_ciphertext)}`,
        "Linkedin-Version": linkedInApiVersion(),
        "X-Restli-Protocol-Version": "2.0.0"
      }
    });
  }

  if (!response.ok) {
    if (response.status === 401) {
      await markLinkedInReconnectRequired(account.id, "LinkedIn rejected the refreshed access token.");
    }
    throw await linkedInError(response, "LinkedIn comment polling failed");
  }

  const payload = await response.json() as { elements?: Array<Record<string, unknown>> };
  return payload.elements ?? [];
}

export function hasLinkedInCommentReadScope(account: Pick<LinkedInAccount, "scopes">) {
  return account.scopes.includes("r_member_social_feed") || account.scopes.includes("r_member_social");
}

async function markLinkedInReconnectRequired(accountId: string, reason: string) {
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

async function linkedInError(response: Response, prefix: string) {
  const details = await response.text().catch(() => "");
  const retryAfterHeader = response.headers.get("retry-after");
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : NaN;
  const retryAfterMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : null;
  let message = `${prefix}: HTTP ${response.status}`;
  if (response.status === 403) message = "LinkedIn permission not approved.";
  if (response.status === 429) message = "LinkedIn rate limit reached.";
  if (response.status === 401) message = "Reconnect LinkedIn to continue posting.";
  return new LinkedInApiError(details ? `${message} ${details.slice(0, 240)}` : message, {
    status: response.status,
    details,
    retryAfterMs
  });
}

function linkedInPostUrl(postId: string) {
  const id = postId.split(":").pop();
  return id ? `https://www.linkedin.com/feed/update/${encodeURIComponent(postId)}/` : null;
}
