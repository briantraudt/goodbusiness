import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const supabase = getSupabaseAdmin();
  const [
    { data: goal, error: goalError },
    { data: steps },
    { data: notifications },
    { data: metrics },
    { data: landing },
    { data: contentAssets },
    { data: landingPages },
    { data: jobs }
  ] = await Promise.all([
    supabase.from("goals").select("*").eq("id", goalId).single(),
    supabase.from("steps").select("id,title,step_type,status,output,error,position,created_at,updated_at").eq("goal_id", goalId).order("position"),
    supabase.from("notifications").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(10),
    supabase.from("metrics").select("metric_type,value,created_at,source").eq("goal_id", goalId),
    supabase.from("landing_pages").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase
      .from("content_assets")
      .select("*")
      .eq("goal_id", goalId)
      .neq("approval_status", "rejected")
      .order("created_at", { ascending: false }),
    supabase.from("landing_pages").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }),
    supabase.from("goodbot_jobs").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(20)
  ]);

  if (goalError) {
    return NextResponse.json({ error: "Goal not found." }, { status: 404 });
  }

  const visits = (metrics ?? []).filter((row) => row.metric_type === "visit").reduce((sum, row) => sum + Number(row.value), 0);
  const signups = (metrics ?? []).filter((row) => row.metric_type === "signup").reduce((sum, row) => sum + Number(row.value), 0);

  return NextResponse.json({
    goal,
    steps,
    notifications,
    content_assets: contentAssets ?? [],
    landing_pages: landingPages ?? [],
    jobs: jobs ?? [],
    metrics: { visits, signups, events: metrics ?? [] },
    landing_page_url: landing ? `/goodbot/landing/${goalId}` : null
  });
}
