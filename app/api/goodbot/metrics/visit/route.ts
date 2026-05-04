import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const visitSchema = z.object({
  goal_id: z.string().uuid(),
  source: z.string().trim().max(120).optional(),
  path: z.string().trim().max(300).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = visitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "goal_id is required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("metrics").insert({
    goal_id: parsed.data.goal_id,
    metric_type: "visit",
    value: 1,
    source: parsed.data.source || "goodbot_landing_page",
    metadata: { path: parsed.data.path || null }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
