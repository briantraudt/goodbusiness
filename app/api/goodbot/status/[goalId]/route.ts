import { NextResponse } from "next/server";
import { enforceRateLimit, readClientIp, requireGoalAccess } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function GET(request: Request, { params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const access = await requireGoalAccess(request, goalId);
  if (!access.ok) return access.response;
  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:status",
    key: `${goalId}:${readClientIp(request)}`,
    limit: 120,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const supabase = getSupabaseAdmin();
  const [
    { data: goal, error: goalError },
    { data: steps },
    { data: notifications },
    { data: metrics },
    { data: landing },
    { data: contentAssets },
    { data: landingPages },
    { data: jobs },
    { data: distributionEvents },
    { data: landingPageVariants },
    { data: recommendations },
    { data: context },
    { data: engagementEvents },
    { data: googleAdsDrafts },
    { data: googleAdsCampaigns },
    { data: googleAdsMetrics }
  ] = await Promise.all([
    supabase.from("goals").select("*").eq("id", goalId).single(),
    supabase.from("steps").select("id,title,step_type,status,output,error,position,created_at,updated_at").eq("goal_id", goalId).order("position"),
    supabase.from("notifications").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(10),
    supabase
      .from("metrics")
      .select("metric_type,value,created_at,source,utm_source,utm_medium,utm_campaign,utm_content,distribution_event_id,content_asset_id,landing_page_variant_id")
      .eq("goal_id", goalId),
    supabase.from("landing_pages").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase
      .from("content_assets")
      .select("*")
      .eq("goal_id", goalId)
      .neq("approval_status", "rejected")
      .order("created_at", { ascending: false }),
    supabase.from("landing_pages").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }),
    supabase.from("goodbot_jobs").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(20),
    supabase.from("distribution_events").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }),
    supabase.from("landing_page_variants").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }),
    supabase.from("goodbot_recommendations").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(10),
    supabase.from("goodbot_context").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("engagement_events").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(20),
    supabase.from("google_ads_campaign_drafts").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(10),
    supabase.from("google_ads_campaigns").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(10),
    supabase.from("google_ads_metrics").select("*").eq("goal_id", goalId).order("captured_at", { ascending: false }).limit(50)
  ]);

  if (goalError) {
    return NextResponse.json({ error: "Goal not found." }, { status: 404 });
  }

  const { data: linkedinAccount } = access.user
    ? await supabase
      .from("connected_accounts")
      .select("id,provider,provider_account_name,status,scopes,token_expires_at,metadata")
      .eq("user_id", access.user.id)
      .eq("provider", "linkedin")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    : { data: null };

  const { data: googleAdsAccount } = access.user
    ? await supabase
      .from("connected_accounts")
      .select("id,provider,provider_account_name,status,scopes,token_expires_at,metadata")
      .eq("user_id", access.user.id)
      .eq("provider", "google_ads")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    : { data: null };

  const googleAdsMetadata = typeof googleAdsAccount?.metadata === "object" && googleAdsAccount.metadata
    ? googleAdsAccount.metadata as Record<string, unknown>
    : {};

  const visits = (metrics ?? []).filter((row) => row.metric_type === "visit").reduce((sum, row) => sum + Number(row.value), 0);
  const signups = (metrics ?? []).filter((row) => row.metric_type === "signup").reduce((sum, row) => sum + Number(row.value), 0);

  return NextResponse.json({
    goal,
    steps,
    notifications,
    content_assets: contentAssets ?? [],
    landing_pages: landingPages ?? [],
    google_ads_campaign_drafts: googleAdsDrafts ?? [],
    google_ads_campaigns: googleAdsCampaigns ?? [],
    google_ads_metrics: googleAdsMetrics ?? [],
    distribution_events: distributionEvents ?? [],
    landing_page_variants: landingPageVariants ?? [],
    recommendations: recommendations ?? [],
    engagement_events: engagementEvents ?? [],
    integrations: {
      linkedin: linkedinAccount ? {
        connected: linkedinAccount.status === "connected",
        provider: linkedinAccount.provider,
        account_name: linkedinAccount.provider_account_name,
        scopes: linkedinAccount.scopes ?? [],
        token_expires_at: linkedinAccount.token_expires_at,
        status: linkedinAccount.status,
        reconnect_required: linkedinAccount.status === "reconnect_required",
        comment_monitoring_available: (linkedinAccount.scopes ?? []).includes("r_member_social_feed") || (linkedinAccount.scopes ?? []).includes("r_member_social"),
        reconnect_reason: typeof linkedinAccount.metadata === "object" && linkedinAccount.metadata && "reconnect_reason" in linkedinAccount.metadata
          ? String(linkedinAccount.metadata.reconnect_reason)
          : null
      } : { connected: false },
      google_ads: googleAdsAccount ? {
        connected: googleAdsAccount.status === "connected",
        provider: googleAdsAccount.provider,
        account_name: googleAdsAccount.provider_account_name,
        status: googleAdsAccount.status,
        scopes: googleAdsAccount.scopes ?? [],
        token_expires_at: googleAdsAccount.token_expires_at,
        reconnect_required: googleAdsAccount.status === "reconnect_required",
        customer_id: typeof googleAdsMetadata.customer_id === "string" ? googleAdsMetadata.customer_id : null,
        login_customer_id: typeof googleAdsMetadata.login_customer_id === "string" ? googleAdsMetadata.login_customer_id : null,
        raw_tokens_exposed: false
      } : { connected: false, raw_tokens_exposed: false }
    },
    context,
    attribution: {
      by_asset: rollup(metrics ?? [], contentAssets ?? [], "content_asset_id"),
      by_variant: rollup(metrics ?? [], landingPageVariants ?? [], "landing_page_variant_id"),
      by_distribution_event: rollup(metrics ?? [], distributionEvents ?? [], "distribution_event_id")
    },
    jobs: jobs ?? [],
    metrics: { visits, signups, events: metrics ?? [] },
    landing_page_url: landing ? `/goodbot/landing/${goalId}` : null
  }, {
    headers: { "Cache-Control": "no-store" }
  });
}

function rollup(
  metrics: { metric_type: string; value: number; [key: string]: unknown }[],
  records: { id: string; title?: string | null; headline?: string | null; variant_name?: string | null; channel?: string | null; status?: string | null }[],
  key: string
) {
  return records.map((record) => {
    const rows = metrics.filter((metric) => metric[key] === record.id);
    const visits = rows.filter((row) => row.metric_type === "visit").reduce((sum, row) => sum + Number(row.value ?? 0), 0);
    const signups = rows.filter((row) => row.metric_type === "signup").reduce((sum, row) => sum + Number(row.value ?? 0), 0);
    return {
      id: record.id,
      label: record.title || record.headline || record.variant_name || record.channel || "Untitled",
      visits,
      signups,
      conversion_rate: visits > 0 ? signups / visits : 0
    };
  });
}
