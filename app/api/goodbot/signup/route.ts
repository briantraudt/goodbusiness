import { NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit, readClientIp } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const signupSchema = z.object({
  goal_id: z.string().uuid(),
  email: z.string().email().max(220),
  name: z.string().trim().max(160).optional(),
  source: z.string().trim().max(120).optional(),
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(220).optional(),
  utm_content: z.string().trim().max(220).optional(),
  distribution_event_id: z.string().uuid().optional(),
  content_asset_id: z.string().uuid().optional(),
  landing_page_variant_id: z.string().uuid().optional(),
  demo_mode: z.boolean().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email and goal_id are required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:signup",
    key: `${parsed.data.goal_id}:${readClientIp(request)}`,
    limit: 10,
    windowSeconds: 60 * 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const { data: goal } = await supabase.from("goals").select("is_demo").eq("id", parsed.data.goal_id).maybeSingle();
  const isDemo = Boolean(parsed.data.demo_mode || goal?.is_demo);
  const { error } = await supabase.from("leads").upsert(
    {
      goal_id: parsed.data.goal_id,
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name || null,
      source: parsed.data.source || parsed.data.utm_source || "goodbot_landing_page",
      utm_source: parsed.data.utm_source || null,
      utm_medium: parsed.data.utm_medium || null,
      utm_campaign: parsed.data.utm_campaign || null,
      utm_content: parsed.data.utm_content || null,
      distribution_event_id: parsed.data.distribution_event_id || null,
      content_asset_id: parsed.data.content_asset_id || null,
      landing_page_variant_id: parsed.data.landing_page_variant_id || null,
      is_demo: isDemo,
      metadata: {
        distribution_event_id: parsed.data.distribution_event_id || null,
        content_asset_id: parsed.data.content_asset_id || null,
        landing_page_variant_id: parsed.data.landing_page_variant_id || null,
        demo_mode: isDemo
      }
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
    source: parsed.data.source || parsed.data.utm_source || "goodbot_landing_page",
    utm_source: parsed.data.utm_source || null,
    utm_medium: parsed.data.utm_medium || null,
    utm_campaign: parsed.data.utm_campaign || null,
    utm_content: parsed.data.utm_content || null,
    distribution_event_id: parsed.data.distribution_event_id || null,
    content_asset_id: parsed.data.content_asset_id || null,
    landing_page_variant_id: parsed.data.landing_page_variant_id || null,
    is_demo: isDemo,
    metadata: { email: parsed.data.email.toLowerCase(), demo_mode: isDemo }
  });

  return NextResponse.json({ ok: true });
}
