import { NextResponse } from "next/server";
import { z } from "zod";
import { enqueueFirstPendingStep } from "@/lib/goodbot/executors";
import { createPlan, parseGoal } from "@/lib/goodbot/planner";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

const intakeSchema = z.object({
  goal: z.string().trim().min(8).max(300),
  app_name: z.string().trim().max(120).optional(),
  audience: z.string().trim().max(200).optional(),
  positioning: z.string().trim().max(300).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = intakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a clear user-acquisition goal." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const goalObject = {
    ...parseGoal(parsed.data.goal),
    app_name: parsed.data.app_name || parseGoal(parsed.data.goal).app_name,
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
      positioning: goalObject.positioning
    })
    .select("*")
    .single();

  if (goalError) {
    return NextResponse.json({ error: goalError.message }, { status: 500 });
  }

  const plan = await createPlan(goalObject);
  const { data: planRow, error: planError } = await supabase
    .from("plans")
    .insert({
      goal_id: goal.id,
      rationale: plan.rationale,
      plan_json: plan.steps
    })
    .select("id")
    .single();

  if (planError) {
    return NextResponse.json({ error: planError.message }, { status: 500 });
  }

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

  if (stepsError) {
    return NextResponse.json({ error: stepsError.message }, { status: 500 });
  }

  try {
    await enqueueFirstPendingStep(goal.id);
  } catch (error) {
    console.error("GoodBot job enqueue failed", error);
  }

  return NextResponse.json({
    goal_id: goal.id,
    goal: goalObject,
    status_url: `/api/goodbot/status/${goal.id}`,
    landing_page_url: `/goodbot/landing/${goal.id}`
  });
}
