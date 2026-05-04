import { NextResponse } from "next/server";
import { z } from "zod";
import { enqueueLinkedInAutoPost } from "@/lib/goodbot/executors";
import { enforceRateLimit, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const updateSchema = z.object({
  autonomous_mode: z.boolean().optional(),
  auto_post_mode: z.enum(["manual", "auto_post"]).optional(),
  daily_post_limit: z.number().int().min(0).max(5).optional(),
  channels_enabled: z.array(z.enum(["linkedin"])).optional(),
  auto_response_level: z.enum(["approval_required", "low_risk_auto", "manual"]).optional(),
  paused: z.boolean().optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid GoodBot goal settings." }, { status: 400 });
  }

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:goal-update",
    key: `${auth.user.id}:${readClientIp(request)}`,
    limit: 60,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const update: Record<string, unknown> = {};
  for (const key of ["autonomous_mode", "auto_post_mode", "daily_post_limit", "channels_enabled", "auto_response_level"] as const) {
    if (parsed.data[key] !== undefined) update[key] = parsed.data[key];
  }
  if (parsed.data.paused !== undefined) {
    update.status = parsed.data.paused ? "paused" : "working";
    update.paused_at = parsed.data.paused ? new Date().toISOString() : null;
  }
  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "No settings were provided." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: goal, error } = await supabase
    .from("goals")
    .update(update)
    .eq("id", goalId)
    .eq("user_id", auth.user.id)
    .select("id,autonomous_mode,auto_post_mode,daily_post_limit,channels_enabled,auto_response_level,status,paused_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!goal) return NextResponse.json({ error: "Mission not found or you do not own it." }, { status: 404 });

  if (goal.autonomous_mode && goal.auto_post_mode === "auto_post") {
    const { data: readyAssets } = await supabase
      .from("content_assets")
      .select("id")
      .eq("goal_id", goalId)
      .eq("content_type", "linkedin_post")
      .eq("approval_status", "approved")
      .eq("distribution_status", "ready")
      .is("external_post_id", null)
      .limit(Number(goal.daily_post_limit ?? 1));
    for (const asset of readyAssets ?? []) {
      await enqueueLinkedInAutoPost(goalId, asset.id);
    }
  }

  return NextResponse.json({ ok: true, goal });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:goal-delete",
    key: `${auth.user.id}:${readClientIp(request)}`,
    limit: 20,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const supabase = getSupabaseAdmin();
  const { data: deletedGoal, error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", auth.user.id)
    .select("id,goal,project_name")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!deletedGoal) {
    return NextResponse.json({ error: "Mission not found or you do not own it." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, goal: deletedGoal });
}
