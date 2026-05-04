import { getGoodBotBaseUrl } from "./security";
import { decryptSecret, encryptSecret } from "./crypto";

const LINKEDIN_API_VERSION = process.env.LINKEDIN_API_VERSION || "202601";
const LINKEDIN_SCOPES = ["openid", "profile", "w_member_social", "r_member_social"];

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
};

export function getLinkedInConfig(request?: Request) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("LinkedIn is not configured. Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET.");
  }
  const baseUrl = getGoodBotBaseUrl(request);
  return {
    clientId,
    clientSecret,
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
  const accessToken = decryptLinkedInToken(input.account.access_token_ciphertext);
  const authorId = input.account.provider_user_id;
  if (!authorId) throw new Error("LinkedIn account is missing provider_user_id.");

  const response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Linkedin-Version": LINKEDIN_API_VERSION,
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

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`LinkedIn post failed: HTTP ${response.status}${details ? ` ${details.slice(0, 240)}` : ""}`);
  }

  const postId = response.headers.get("x-restli-id");
  if (!postId) throw new Error("LinkedIn post succeeded but did not return x-restli-id.");
  return {
    post_id: postId,
    url: linkedInPostUrl(postId)
  };
}

export async function fetchLinkedInComments(input: { account: LinkedInAccount; postId: string }) {
  const accessToken = decryptLinkedInToken(input.account.access_token_ciphertext);
  const encodedPostId = encodeURIComponent(input.postId);
  const response = await fetch(`https://api.linkedin.com/rest/socialActions/${encodedPostId}/comments?count=50`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Linkedin-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0"
    }
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`LinkedIn comment polling failed: HTTP ${response.status}${details ? ` ${details.slice(0, 240)}` : ""}`);
  }

  const payload = await response.json() as { elements?: Array<Record<string, unknown>> };
  return payload.elements ?? [];
}

function linkedInPostUrl(postId: string) {
  const id = postId.split(":").pop();
  return id ? `https://www.linkedin.com/feed/update/${encodeURIComponent(postId)}/` : null;
}
