import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const supabase = getSupabaseAdmin();
  const [{ data: goal, error: goalError }, { data: steps }, { data: notifications }, { data: metrics }, { data: landing }] =
    await Promise.all([
      supabase.from("goals").select("*").eq("id", goalId).single(),
      supabase.from("steps").select("id,title,step_type,status,output,error,position").eq("goal_id", goalId).order("position"),
      supabase.from("notifications").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(5),
      supabase.from("metrics").select("metric_type,value").eq("goal_id", goalId),
      supabase.from("landing_pages").select("slug").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(1).maybeSingle()
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
    metrics: { visits, signups },
    landing_page_url: landing ? `/goodbot/landing/${goalId}` : null
  });
}
