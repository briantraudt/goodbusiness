import { NextResponse } from "next/server";
import { buildGoogleAdsAuthUrl, checkGoogleAdsReadiness, getGoogleAdsOAuthDebug } from "@/lib/goodbot/googleAds";
import { createGoalAccessToken, enforceRateLimit, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";

async function start(request: Request, asJson = false) {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:google-ads-oauth-start",
    key: `${auth.user.id}:${readClientIp(request)}`,
    limit: 10,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const state = `${auth.user.id}.${createGoalAccessToken()}`;
  const isDebug = new URL(request.url).searchParams.get("debug") === "1";
  const readiness = checkGoogleAdsReadiness(request);
  if (!readiness.ok) {
    return NextResponse.json({
      error: `Google Ads is not production-ready. Missing: ${readiness.missing.join(", ")}.`,
      readiness
    }, { status: 500 });
  }

  if (isDebug) {
    return NextResponse.json(getGoogleAdsOAuthDebug(request, state));
  }

  const authorizationUrl = buildGoogleAdsAuthUrl(request, state);
  if (asJson) {
    const json = NextResponse.json({ authorization_url: authorizationUrl });
    json.cookies.set("goodbot_google_ads_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 10 * 60,
      path: "/"
    });
    return json;
  }

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("goodbot_google_ads_oauth_state", state, {
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
