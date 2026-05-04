import { NextResponse } from "next/server";
import { z } from "zod";
import { gatherAndStoreContext, hasMeaningfulDescription, extractUrlFromGoal } from "@/lib/goodbot/context";
import { parseGoal } from "@/lib/goodbot/planner";
import { createGoalAccessToken, enforceRateLimit, getGoodBotBaseUrl, hashToken, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const intakeSchema = z.object({
  goal: z.string().trim().min(8).max(300),
  project_name: z.string().trim().max(120).optional(),
  app_name: z.string().trim().max(120).optional(),
  audience: z.string().trim().max(200).optional(),
  positioning: z.string().trim().max(300).optional(),
  demo_mode: z.boolean().optional()
});

export async function GET(request: Request) {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:goals-list",
    key: auth.user.id,
    limit: 120,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const supabase = getSupabaseAdmin();
  const { data: goals, error } = await supabase
    .from("goals")
    .select("id,goal,status,target_value,created_at,is_demo,project_name")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const goalIds = (goals ?? []).map((goal) => goal.id);
  const { data: metrics } = goalIds.length
    ? await supabase.from("metrics").select("goal_id,metric_type,value").in("goal_id", goalIds)
    : { data: [] };

  const missions = (goals ?? []).map((goal) => {
    const signups = (metrics ?? [])
      .filter((metric) => metric.goal_id === goal.id && metric.metric_type === "signup")
      .reduce((sum, metric) => sum + Number(metric.value ?? 0), 0);
    return { ...goal, signups };
  });

  return NextResponse.json({ goals: missions }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = intakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a clear user-acquisition goal." }, { status: 400 });
  }

  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin();
  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:goal-create",
    key: auth.user.id || readClientIp(request),
    limit: 5,
    windowSeconds: 60 * 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  if (!extractUrlFromGoal(parsed.data.goal) && !hasMeaningfulDescription(parsed.data.goal)) {
    return NextResponse.json({ error: "I need a bit more detail to generate high-quality work. Include your website URL or describe who the product is for and what outcome it delivers." }, { status: 400 });
  }

  const parsedGoal = parseGoal(parsed.data.goal);
  const accessToken = createGoalAccessToken();
  const goalObject = {
    ...parsedGoal,
    app_name: parsed.data.app_name || parsedGoal.app_name,
    audience: parsed.data.audience || null,
    positioning: parsed.data.positioning || null
  };

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .insert({
      goal: goalObject.goal,
      target_metric: goalObject.target_metric,
      target_value: goalObject.target_value,
      timeframe: goalObject.timeframe,
      app_name: goalObject.app_name,
      audience: goalObject.audience,
      positioning: goalObject.positioning,
      project_name: parsed.data.project_name || goalObject.app_name || inferProjectName(parsed.data.goal),
      is_demo: Boolean(parsed.data.demo_mode),
      user_id: auth.user.id,
      status: "paused",
      access_token_hash: hashToken(accessToken)
    })
    .select("*")
    .single();

  if (goalError) {
    return NextResponse.json({ error: goalError.message }, { status: 500 });
  }

  let context;
  try {
    context = await gatherAndStoreContext(goal.id, goalObject, parsed.data.goal);
  } catch (error) {
    const message = error instanceof Error ? error.message : "GoodBot could not gather context.";
    await supabase.from("goals").update({ status: "failed" }).eq("id", goal.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const statusUrl = `/api/goodbot/status/${goal.id}?access_token=${encodeURIComponent(accessToken)}`;
  const baseUrl = getGoodBotBaseUrl(request);

  return NextResponse.json({
    goal_id: goal.id,
    access_token: accessToken,
    goal: goalObject,
    context_required: true,
    context,
    status_url: statusUrl,
    landing_page_url: `/goodbot/landing/${goal.id}`,
    absolute_landing_page_url: `${baseUrl}/goodbot/landing/${goal.id}`
  });
}

function inferProjectName(goal: string) {
  const url = extractUrlFromGoal(goal);
  if (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  }
  return null;
}
