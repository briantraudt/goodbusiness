import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve") }),
  z.object({ action: z.literal("reject") }),
  z.object({ action: z.literal("edit"), body: z.string().trim().min(1).max(10000) }),
  z.object({ action: z.literal("mark_distributed") })
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid asset action." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: asset, error: assetError } = await supabase.from("content_assets").select("*").eq("id", assetId).single();
  if (assetError || !asset) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  let update: Record<string, unknown> = {};
  let activity = "";

  if (parsed.data.action === "edit") {
    update = {
      edited_body: parsed.data.body,
      approval_status: "pending",
      rejected_at: null
    };
    activity = `Edited ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}.`;
  }

  if (parsed.data.action === "approve") {
    update = {
      approval_status: "approved",
      approved_at: now,
      rejected_at: null,
      distribution_status: "ready",
      status: asset.content_type === "blog_post" ? "published" : "ready_to_publish",
      published_url: asset.content_type === "blog_post" ? `/goodbot/blog/${asset.id}` : asset.published_url
    };
    activity = `Approved ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}.`;
  }

  if (parsed.data.action === "reject") {
    update = {
      approval_status: "rejected",
      rejected_at: now,
      distribution_status: "not_ready"
    };
    activity = `Rejected ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}.`;
  }

  if (parsed.data.action === "mark_distributed") {
    if (asset.approval_status !== "approved") {
      return NextResponse.json({ error: "Approve this asset before marking it distributed." }, { status: 400 });
    }
    update = {
      distribution_status: "distributed",
      distributed_at: now,
      distribution_channel: distributionChannel(asset.content_type)
    };
    activity = `Distributed ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}.`;
  }

  const { data: updated, error: updateError } = await supabase
    .from("content_assets")
    .update(update)
    .eq("id", assetId)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (activity) {
    await supabase.from("notifications").insert({
      goal_id: asset.goal_id,
      notification_type: parsed.data.action === "mark_distributed" ? "milestone" : "strategy_changed",
      message: activity
    });
  }

  return NextResponse.json({ ok: true, asset: updated });
}

function assetLabel(contentType: string) {
  if (contentType === "linkedin_post") return "LinkedIn post";
  if (contentType === "blog_post") return "blog post";
  if (contentType === "email_draft") return "email draft";
  return "asset";
}

function distributionChannel(contentType: string) {
  if (contentType === "linkedin_post") return "linkedin_manual";
  if (contentType === "blog_post") return "blog_manual_share";
  if (contentType === "email_draft") return "email_manual";
  return "manual";
}
