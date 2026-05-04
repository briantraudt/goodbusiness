import { NextResponse } from "next/server";
import { exchangeLinkedInCode, fetchLinkedInProfile, encryptLinkedInToken } from "@/lib/goodbot/linkedin";
import { getGoodBotBaseUrl } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.headers.get("cookie")?.match(/(?:^|;\s*)goodbot_linkedin_oauth_state=([^;]+)/)?.[1];
  const baseUrl = getGoodBotBaseUrl(request);

  if (!code || !state || !storedState || decodeURIComponent(storedState) !== state) {
    return NextResponse.redirect(`${baseUrl}/goodbot?linkedin=failed`);
  }

  const userId = state.split(".")[0];
  if (!userId) {
    return NextResponse.redirect(`${baseUrl}/goodbot?linkedin=failed`);
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
    return NextResponse.redirect(`${baseUrl}/goodbot?linkedin=failed`);
  }
}
