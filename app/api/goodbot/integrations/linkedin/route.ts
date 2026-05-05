import { NextResponse } from "next/server";
import { enforceRateLimit, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export async function DELETE(request: Request) {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:linkedin-disconnect",
    key: `${auth.user.id}:${readClientIp(request)}`,
    limit: 10,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  const { data: userGoals, error: goalsError } = await supabase
    .from("goals")
    .select("id")
    .eq("user_id", auth.user.id);

  if (goalsError) {
    return NextResponse.json({ error: goalsError.message }, { status: 500 });
  }

  const goalIds = (userGoals ?? []).map((goal) => goal.id);

  const { data: deletedAccounts, error: accountError } = await supabase
    .from("connected_accounts")
    .delete()
    .eq("user_id", auth.user.id)
    .eq("provider", "linkedin")
    .select("id");

  if (accountError) {
    return NextResponse.json({ error: accountError.message }, { status: 500 });
  }

  if (goalIds.length) {
    await supabase
      .from("goals")
      .update({
        autonomous_mode: false,
        auto_post_mode: "manual",
        updated_at: now
      })
      .in("id", goalIds);

    await supabase
      .from("goodbot_jobs")
      .update({
        status: "failed",
        locked_at: null,
        error: "LinkedIn disconnected by user.",
        updated_at: now
      })
      .in("goal_id", goalIds)
      .eq("job_type", "linkedin_auto_post")
      .in("status", ["pending", "running"]);

    await supabase
      .from("content_assets")
      .update({
        auto_post_status: "manual"
      })
      .in("goal_id", goalIds)
      .eq("content_type", "linkedin_post")
      .in("auto_post_status", ["queued", "posting", "reconnect_required"]);
  }

  return NextResponse.json({
    ok: true,
    disconnected: true,
    removed_accounts: deletedAccounts?.length ?? 0,
    affected_goals: goalIds.length
  });
}
