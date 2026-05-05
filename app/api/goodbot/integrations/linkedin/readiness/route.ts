import { NextResponse } from "next/server";
import { checkLinkedInReadiness } from "@/lib/goodbot/linkedin";
import { requireAuthenticatedUser } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function GET(request: Request) {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const readiness = checkLinkedInReadiness(request);
  const supabase = getSupabaseAdmin();
  const { data: account, error } = await supabase
    .from("connected_accounts")
    .select("id,provider,provider_account_name,status,scopes,token_expires_at,access_token_ciphertext,refresh_token_ciphertext,metadata,updated_at")
    .eq("user_id", auth.user.id)
    .eq("provider", "linkedin")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "LinkedIn readiness check failed." }, { status: 500 });
  }

  const connected = account?.status === "connected";
  return NextResponse.json({
    ...readiness,
    connection: account ? {
      connected,
      provider: account.provider,
      account_name: account.provider_account_name,
      status: account.status,
      granted_scopes: account.scopes ?? [],
      token_expires_at: account.token_expires_at,
      reconnect_required: account.status === "reconnect_required",
      access_token_encrypted: typeof account.access_token_ciphertext === "string" && account.access_token_ciphertext.startsWith("v1:"),
      refresh_token_encrypted: typeof account.refresh_token_ciphertext === "string" && account.refresh_token_ciphertext.startsWith("v1:"),
      raw_tokens_exposed: false
    } : {
      connected: false,
      provider: "linkedin",
      status: "not_connected",
      granted_scopes: [],
      token_expires_at: null,
      reconnect_required: false,
      access_token_encrypted: false,
      refresh_token_encrypted: false,
      raw_tokens_exposed: false
    }
  }, { status: readiness.ok ? 200 : 500 });
}
