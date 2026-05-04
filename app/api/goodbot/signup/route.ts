import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const signupSchema = z.object({
  goal_id: z.string().uuid(),
  email: z.string().email().max(220),
  name: z.string().trim().max(160).optional(),
  source: z.string().trim().max(120).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email and goal_id are required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").upsert(
    {
      goal_id: parsed.data.goal_id,
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name || null,
      source: parsed.data.source || "goodbot_landing_page"
    },
    { onConflict: "goal_id,email" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("metrics").insert({
    goal_id: parsed.data.goal_id,
    metric_type: "signup",
    value: 1,
    source: parsed.data.source || "goodbot_landing_page",
    metadata: { email: parsed.data.email.toLowerCase() }
  });

  return NextResponse.json({ ok: true });
}
