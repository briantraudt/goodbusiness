import { NextResponse } from "next/server";
import { z } from "zod";
import { planGoogleAdsCampaign } from "@/lib/goodbot/executors";
import { enforceRateLimit, readClientIp, requireAuthenticatedUser } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const createSchema = z.object({
  goal_id: z.string().uuid()
});

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Goal id is required to draft a Google Ads campaign." }, { status: 400 });
  }

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:google-ads-draft-create",
    key: `${auth.user.id}:${readClientIp(request)}`,
    limit: 10,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const supabase = getSupabaseAdmin();
  const { data: goal, error } = await supabase
    .from("goals")
    .select("id")
    .eq("id", parsed.data.goal_id)
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!goal) return NextResponse.json({ error: "Mission not found or you do not own it." }, { status: 404 });

  try {
    const output = await planGoogleAdsCampaign(parsed.data.goal_id);
    return NextResponse.json({ ok: true, output });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Google Ads draft could not be created."
    }, { status: 500 });
  }
}
