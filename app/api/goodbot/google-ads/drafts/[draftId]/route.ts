import { NextResponse } from "next/server";
import { z } from "zod";
import { enqueueGoogleAdsDryRunLaunch } from "@/lib/goodbot/executors";
import { enforceRateLimit, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const updateSchema = z.object({
  action: z.enum(["approve", "reject", "edit"]),
  draft_json: z.record(z.string(), z.unknown()).optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ draftId: string }> }) {
  const { draftId } = await params;
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid Google Ads draft action." }, { status: 400 });
  }

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:google-ads-draft-update",
    key: `${auth.user.id}:${readClientIp(request)}`,
    limit: 30,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const supabase = getSupabaseAdmin();
  const { data: draft, error: draftError } = await supabase
    .from("google_ads_campaign_drafts")
    .select("id,goal_id,status,draft_json,goals!inner(user_id)")
    .eq("id", draftId)
    .maybeSingle();
  if (draftError) return NextResponse.json({ error: draftError.message }, { status: 500 });
  const ownerId = Array.isArray(draft?.goals) ? draft?.goals[0]?.user_id : (draft?.goals as { user_id?: string } | undefined)?.user_id;
  if (!draft || ownerId !== auth.user.id) {
    return NextResponse.json({ error: "Campaign draft not found or you do not own it." }, { status: 404 });
  }

  if (parsed.data.action === "reject") {
    const { error } = await supabase
      .from("google_ads_campaign_drafts")
      .update({ status: "rejected", rejected_at: new Date().toISOString() })
      .eq("id", draftId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  if (parsed.data.action === "edit") {
    if (!parsed.data.draft_json) return NextResponse.json({ error: "Edited draft JSON is required." }, { status: 400 });
    const { error } = await supabase
      .from("google_ads_campaign_drafts")
      .update({ draft_json: parsed.data.draft_json, status: "pending_approval" })
      .eq("id", draftId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, status: "pending_approval" });
  }

  const { error } = await supabase
    .from("google_ads_campaign_drafts")
    .update({ status: "approved", approved_at: new Date().toISOString(), rejected_at: null })
    .eq("id", draftId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const job = await enqueueGoogleAdsDryRunLaunch(draft.goal_id, draft.id);
  return NextResponse.json({ ok: true, status: "queued", job });
}
