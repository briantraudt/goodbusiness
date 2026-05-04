import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve") }),
  z.object({ action: z.literal("reject") }),
  z.object({ action: z.literal("edit"), body: z.string().trim().min(1).max(10000) }),
  z.object({
    action: z.literal("mark_distributed"),
    claimed_url: z.string().trim().max(1000).optional(),
    no_url: z.boolean().optional()
  })
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
    const claimedUrl = parsed.data.claimed_url || null;
    if (claimedUrl && !isValidHttpUrl(claimedUrl)) {
      return NextResponse.json({ error: "Paste a valid http or https URL, or choose that you do not have one." }, { status: 400 });
    }

    const [{ data: landingPage }, { data: activeVariant }] = await Promise.all([
      supabase.from("landing_pages").select("id").eq("goal_id", asset.goal_id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
      supabase.from("landing_page_variants").select("id").eq("goal_id", asset.goal_id).eq("status", "active").limit(1).maybeSingle()
    ]);

    const channel = distributionChannel(asset.content_type);
    const verification = claimedUrl ? await verifyClaimedUrl(claimedUrl) : { status: "claimed" as const, verified_at: null, note: "No claimed URL was provided." };
    const eventId = crypto.randomUUID();
    const trackingUrl = buildTrackingUrl(request, {
      goalId: asset.goal_id,
      distributionEventId: eventId,
      contentAssetId: asset.id,
      landingPageVariantId: activeVariant?.id ?? null,
      channel,
      contentType: asset.content_type
    });

    const { error: eventError } = await supabase.from("distribution_events").insert({
      id: eventId,
      goal_id: asset.goal_id,
      content_asset_id: asset.id,
      landing_page_id: landingPage?.id ?? null,
      channel,
      status: verification.status,
      claimed_url: claimedUrl,
      tracking_url: trackingUrl,
      utm_source: sourceForAsset(asset.content_type),
      utm_medium: mediumForAsset(asset.content_type),
      utm_campaign: `goodbot_${asset.goal_id}`,
      utm_content: asset.id,
      verified_at: verification.verified_at,
      metadata: {
        no_url: Boolean(parsed.data.no_url || !claimedUrl),
        verification_note: verification.note
      }
    });

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    update = {
      distribution_status: "distributed",
      distributed_at: now,
      distribution_channel: channel
    };
    activity =
      verification.status === "verified"
        ? `Verified distribution for ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}.`
        : `Distribution claimed for ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}. Verification pending.`;
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

function sourceForAsset(contentType: string) {
  if (contentType === "linkedin_post") return "linkedin";
  if (contentType === "blog_post") return "goodbot_blog";
  if (contentType === "email_draft") return "email";
  return "manual";
}

function mediumForAsset(contentType: string) {
  if (contentType === "linkedin_post") return "social";
  if (contentType === "blog_post") return "referral";
  if (contentType === "email_draft") return "email";
  return "manual";
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function verifyClaimedUrl(url: string): Promise<{ status: "claimed" | "verified"; verified_at: string | null; note: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal
    });
    if (response.ok) {
      return { status: "verified", verified_at: new Date().toISOString(), note: `Reachable with HTTP ${response.status}.` };
    }
    return { status: "claimed", verified_at: null, note: `URL accepted but returned HTTP ${response.status}.` };
  } catch {
    return { status: "claimed", verified_at: null, note: "URL accepted but reachability could not be confirmed." };
  } finally {
    clearTimeout(timeout);
  }
}

function buildTrackingUrl(
  request: Request,
  input: {
    goalId: string;
    distributionEventId: string;
    contentAssetId: string;
    landingPageVariantId: string | null;
    channel: string;
    contentType: string;
  }
) {
  const origin = new URL(request.url).origin;
  const url = new URL(`/goodbot/landing/${input.goalId}`, origin);
  url.searchParams.set("utm_source", sourceForAsset(input.contentType));
  url.searchParams.set("utm_medium", mediumForAsset(input.contentType));
  url.searchParams.set("utm_campaign", `goodbot_${input.goalId}`);
  url.searchParams.set("utm_content", input.contentAssetId);
  url.searchParams.set("distribution_event_id", input.distributionEventId);
  url.searchParams.set("content_asset_id", input.contentAssetId);
  if (input.landingPageVariantId) url.searchParams.set("landing_page_variant_id", input.landingPageVariantId);
  url.searchParams.set("channel", input.channel);
  return url.toString();
}
