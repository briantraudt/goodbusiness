import { NextResponse } from "next/server";
import { z } from "zod";
import { enqueueFirstPendingStep } from "@/lib/goodbot/executors";
import { getLatestContext, mergeContext } from "@/lib/goodbot/context";
import { createPlan, hasUsableContext, parseGoal } from "@/lib/goodbot/planner";
import { enforceRateLimit, readClientIp, requireGoalAccess } from "@/lib/goodbot/security";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const contextSchema = z.object({
  product_name: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  subheadline: z.string().nullable().optional(),
  value_prop: z.string().nullable().optional(),
  audience: z.string().nullable().optional(),
  features: z.union([z.array(z.string()), z.string()]).optional(),
  tone: z.string().nullable().optional(),
  differentiators: z.union([z.array(z.string()), z.string()]).optional(),
  pricing: z.string().nullable().optional(),
  risks: z.union([z.array(z.string()), z.string()]).optional(),
  confidence: z.enum(["low", "medium", "high"]).optional()
});

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("confirm"),
    context: contextSchema.optional(),
    answers: z.record(z.string()).optional()
  }),
  z.object({
    action: z.literal("edit"),
    context: contextSchema,
    answers: z.record(z.string()).optional()
  })
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const access = await requireGoalAccess(request, goalId);
  if (!access.ok) return access.response;

  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:context",
    key: `${goalId}:${readClientIp(request)}`,
    limit: 60,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid context action." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const [{ data: goal, error: goalError }, context] = await Promise.all([
    supabase.from("goals").select("*").eq("id", goalId).single(),
    getLatestContext(goalId)
  ]);

  if (goalError || !goal) return NextResponse.json({ error: "Goal not found." }, { status: 404 });
  if (!context) return NextResponse.json({ error: "GoodBot context was not found." }, { status: 404 });

  const contextEdits = parsed.data.context
    ? {
        ...parsed.data.context,
        features: normalizeList(parsed.data.context.features),
        differentiators: normalizeList(parsed.data.context.differentiators),
        risks: normalizeList(parsed.data.context.risks)
      }
    : undefined;
  const merged = mergeContext(context.extracted_json, contextEdits, parsed.data.answers);
  if (parsed.data.action === "confirm" && !hasUsableContext(merged)) {
    return NextResponse.json(
      { error: "I need a bit more detail before generating assets. Confirm the product, audience, value proposition, and at least one concrete feature." },
      { status: 400 }
    );
  }
  const answers = { ...(context.answers ?? {}), ...(parsed.data.answers ?? {}) };
  const confirmedAt = parsed.data.action === "confirm" ? new Date().toISOString() : context.confirmed_at;
  const status = parsed.data.action === "confirm" ? "confirmed" : "pending_confirmation";

  const { data: updatedContext, error: updateError } = await supabase
    .from("goodbot_context")
    .update({
      extracted_json: merged,
      answers,
      status,
      confirmed_at: confirmedAt
    })
    .eq("id", context.id)
    .select("*")
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  if (parsed.data.action === "confirm") {
    const existingPlan = await supabase.from("plans").select("id").eq("goal_id", goalId).limit(1).maybeSingle();
    if (!existingPlan.data) {
      const goalObject = {
        ...parseGoal(goal.goal),
        app_name: merged.product_name || goal.app_name,
        audience: merged.audience || goal.audience,
        positioning: merged.value_prop || goal.positioning
      };
      const plan = await createPlan(goalObject, merged);
      const { data: planRow, error: planError } = await supabase
        .from("plans")
        .insert({
          goal_id: goal.id,
          rationale: plan.rationale,
          plan_json: plan.steps
        })
        .select("id")
        .single();
      if (planError) return NextResponse.json({ error: planError.message }, { status: 500 });

      const { error: stepsError } = await supabase.from("steps").insert(
        plan.steps.map((step, index) => ({
          goal_id: goal.id,
          plan_id: planRow.id,
          position: index + 1,
          step_type: step.step_type,
          title: step.title,
          input: step.input
        }))
      );
      if (stepsError) return NextResponse.json({ error: stepsError.message }, { status: 500 });
    }

    await supabase
      .from("goals")
      .update({
        status: "working",
        app_name: merged.product_name || goal.app_name,
        audience: merged.audience || goal.audience,
        positioning: merged.value_prop || goal.positioning,
        updated_at: new Date().toISOString()
      })
      .eq("id", goalId);

    await enqueueFirstPendingStep(goalId);
  }

  return NextResponse.json({ ok: true, context: updatedContext });
}

function normalizeList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  return undefined;
}
