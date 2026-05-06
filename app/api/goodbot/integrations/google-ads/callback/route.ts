import { NextResponse } from "next/server";
import { encryptGoogleAdsToken, exchangeGoogleAdsCode, fetchGoogleAdsAccessibleCustomers, parseGoogleAdsScopes } from "@/lib/goodbot/googleAds";
import { getGoodBotBaseUrl } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const oauthErrorDescription = url.searchParams.get("error_description");
  const storedState = request.headers.get("cookie")?.match(/(?:^|;\s*)goodbot_google_ads_oauth_state=([^;]+)/)?.[1];
  const baseUrl = getGoodBotBaseUrl(request);

  if (oauthError) {
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("google_ads", "failed");
    errorUrl.searchParams.set("google_ads_error", oauthError);
    if (oauthErrorDescription) errorUrl.searchParams.set("google_ads_error_description", oauthErrorDescription);
    return NextResponse.redirect(errorUrl);
  }

  if (!code || !state || !storedState || decodeURIComponent(storedState) !== state) {
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("google_ads", "failed");
    errorUrl.searchParams.set("google_ads_error", "invalid_state");
    errorUrl.searchParams.set("google_ads_error_description", "Google Ads did not return a valid OAuth state. Try connecting again.");
    return NextResponse.redirect(errorUrl);
  }

  const userId = state.split(".")[0];
  if (!userId) {
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("google_ads", "failed");
    errorUrl.searchParams.set("google_ads_error", "invalid_user");
    return NextResponse.redirect(errorUrl);
  }

  try {
    const token = await exchangeGoogleAdsCode(request, code);
    const scopes = parseGoogleAdsScopes(token.scope, ["https://www.googleapis.com/auth/adwords"]);
    const expiresAt = token.expires_in ? new Date(Date.now() + token.expires_in * 1000).toISOString() : null;
    let accessibleCustomers: string[] = [];
    let customerLookupError: string | null = null;

    try {
      accessibleCustomers = await fetchGoogleAdsAccessibleCustomers(token.access_token);
    } catch (error) {
      customerLookupError = error instanceof Error ? error.message : "Google Ads customer lookup failed.";
    }

    const customerId = accessibleCustomers[0]?.split("/").pop() || null;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("connected_accounts").upsert({
      user_id: userId,
      provider: "google_ads",
      provider_user_id: customerId || `google_ads:${userId}`,
      provider_account_name: customerId ? `Google Ads ${customerId}` : "Google Ads connected",
      access_token_ciphertext: encryptGoogleAdsToken(token.access_token),
      refresh_token_ciphertext: token.refresh_token ? encryptGoogleAdsToken(token.refresh_token) : null,
      token_expires_at: expiresAt,
      scopes,
      status: "connected",
      metadata: {
        customer_id: customerId,
        login_customer_id: customerId,
        scopes,
        accessible_customers: accessibleCustomers,
        customer_lookup_error: customerLookupError
      },
      updated_at: new Date().toISOString()
    }, {
      onConflict: "user_id,provider,provider_user_id"
    });

    if (error) throw error;
    const response = NextResponse.redirect(`${baseUrl}/goodbot?google_ads=connected`);
    response.cookies.delete("goodbot_google_ads_oauth_state");
    return response;
  } catch (error) {
    console.error("GoodBot Google Ads callback failed.", error);
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("google_ads", "failed");
    errorUrl.searchParams.set("google_ads_error", "callback_failed");
    errorUrl.searchParams.set("google_ads_error_description", error instanceof Error ? error.message : "Google Ads callback failed.");
    return NextResponse.redirect(errorUrl);
  }
}
