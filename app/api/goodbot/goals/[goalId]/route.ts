import { NextResponse } from "next/server";
import { enforceRateLimit, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

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
