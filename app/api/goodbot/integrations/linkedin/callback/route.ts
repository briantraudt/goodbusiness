import { NextResponse } from "next/server";
import { exchangeLinkedInCode, fetchLinkedInProfile, encryptLinkedInToken } from "@/lib/goodbot/linkedin";
import { getGoodBotBaseUrl } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const oauthErrorDescription = url.searchParams.get("error_description");
  const storedState = request.headers.get("cookie")?.match(/(?:^|;\s*)goodbot_linkedin_oauth_state=([^;]+)/)?.[1];
  const baseUrl = getGoodBotBaseUrl(request);

  if (oauthError) {
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("linkedin", "failed");
    errorUrl.searchParams.set("linkedin_error", oauthError);
    if (oauthErrorDescription) errorUrl.searchParams.set("linkedin_error_description", oauthErrorDescription);
    return NextResponse.redirect(errorUrl);
  }

  if (!code || !state || !storedState || decodeURIComponent(storedState) !== state) {
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("linkedin", "failed");
    errorUrl.searchParams.set("linkedin_error", "invalid_state");
    errorUrl.searchParams.set("linkedin_error_description", "LinkedIn did not return a valid OAuth state. Try connecting again.");
    return NextResponse.redirect(errorUrl);
  }

  const userId = state.split(".")[0];
  if (!userId) {
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("linkedin", "failed");
    errorUrl.searchParams.set("linkedin_error", "invalid_user");
    return NextResponse.redirect(errorUrl);
  }

  try {
    const token = await exchangeLinkedInCode(request, code);
    const profile = await fetchLinkedInProfile(token.access_token);
    const scopes = token.scope?.split(/\s+/).filter(Boolean) ?? [];
    const expiresAt = token.expires_in ? new Date(Date.now() + token.expires_in * 1000).toISOString() : null;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("connected_accounts").upsert({
      user_id: userId,
      provider: "linkedin",
      provider_user_id: profile.sub,
      provider_account_name: profile.name || profile.email || "LinkedIn member",
      access_token_ciphertext: encryptLinkedInToken(token.access_token),
      refresh_token_ciphertext: token.refresh_token ? encryptLinkedInToken(token.refresh_token) : null,
      token_expires_at: expiresAt,
      scopes,
      status: "connected",
      metadata: { profile },
      updated_at: new Date().toISOString()
    }, {
      onConflict: "user_id,provider,provider_user_id"
    });

    if (error) throw error;
    const response = NextResponse.redirect(`${baseUrl}/goodbot?linkedin=connected`);
    response.cookies.delete("goodbot_linkedin_oauth_state");
    return response;
  } catch (error) {
    console.error("GoodBot LinkedIn callback failed.", error);
    const errorUrl = new URL("/goodbot", baseUrl);
    errorUrl.searchParams.set("linkedin", "failed");
    errorUrl.searchParams.set("linkedin_error", "callback_failed");
    errorUrl.searchParams.set("linkedin_error_description", error instanceof Error ? error.message : "LinkedIn callback failed.");
    return NextResponse.redirect(errorUrl);
  }
}
