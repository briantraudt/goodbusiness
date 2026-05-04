import { NextResponse } from "next/server";
import { buildLinkedInAuthUrl } from "@/lib/goodbot/linkedin";
import { createGoalAccessToken, enforceRateLimit, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";

async function start(request: Request, asJson = false) {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:linkedin-oauth-start",
    key: `${auth.user.id}:${readClientIp(request)}`,
    limit: 10,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const state = `${auth.user.id}.${createGoalAccessToken()}`;
  const authorizationUrl = buildLinkedInAuthUrl(request, state);
  if (asJson) {
    const json = NextResponse.json({ authorization_url: authorizationUrl });
    json.cookies.set("goodbot_linkedin_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 10 * 60,
      path: "/"
    });
    return json;
  }
  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("goodbot_linkedin_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 10 * 60,
    path: "/"
  });
  return response;
}

export async function GET(request: Request) {
  return start(request);
}

export async function POST(request: Request) {
  return start(request, true);
}
