import { z } from "zod";
import { contentPrompt, feedbackPrompt, landingPagePrompt } from "./prompts";
import { getSupabaseAdmin } from "./supabase";
import { generateJson } from "./llm";
import type { GoalObject, GoalRecord, StepOutput, StepRecord } from "./types";

const landingSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  cta: z.string().min(1),
  bullets: z.array(z.string()).min(3).max(5)
});

const contentSchema = z.object({
  linkedin_posts: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
  blog_posts: z.array(z.object({ title: z.string(), body: z.string() })).default([])
});

export async function executeStep(goal: GoalRecord, step: StepRecord): Promise<StepOutput> {
  const supabase = getSupabaseAdmin();
  const { data: execution, error: executionError } = await supabase
    .from("executions")
    .insert({
      goal_id: goal.id,
      step_id: step.id,
      function_name: step.step_type,
      input: step.input,
      status: "started"
    })
    .select("id")
    .single();

  if (executionError) throw executionError;

  await supabase.from("steps").update({ status: "running", updated_at: new Date().toISOString() }).eq("id", step.id);

  try {
    const output = await runStep(goal, step);
    await supabase
      .from("steps")
      .update({
        status: "completed",
        output,
        error: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", step.id);
    await supabase
      .from("executions")
      .update({ status: "completed", output, finished_at: new Date().toISOString() })
      .eq("id", execution.id);
    return output;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown execution error";
    await supabase
      .from("steps")
      .update({ status: "failed", error: message, updated_at: new Date().toISOString() })
      .eq("id", step.id);
    await supabase
      .from("executions")
      .update({ status: "failed", error: message, finished_at: new Date().toISOString() })
      .eq("id", execution.id);
    throw error;
  }
}

export async function executePendingSteps(goalId: string) {
  const supabase = getSupabaseAdmin();
  const { data: goal, error: goalError } = await supabase.from("goals").select("*").eq("id", goalId).single();
  if (goalError) throw goalError;

  const { data: steps, error: stepsError } = await supabase
    .from("steps")
    .select("*")
    .eq("goal_id", goalId)
    .eq("status", "pending")
    .order("position", { ascending: true });
  if (stepsError) throw stepsError;

  const outputs: StepOutput[] = [];
  for (const step of (steps ?? []) as StepRecord[]) {
    outputs.push(await executeStep(goal as GoalRecord, step));
  }

  return outputs;
}

async function runStep(goal: GoalRecord, step: StepRecord): Promise<StepOutput> {
  switch (step.step_type) {
    case "create_landing_page":
      return createLandingPage(goal);
    case "generate_content":
      return generateContent(goal, step.input);
    case "publish_content":
      return publishContent(goal);
    case "track_metrics":
      return trackMetrics(goal);
    default:
      throw new Error(`Unsupported step type: ${step.step_type}`);
  }
}

export async function createLandingPage(goal: GoalRecord): Promise<StepOutput> {
  const supabase = getSupabaseAdmin();
  const goalObject = toGoalObject(goal);
  const fallback = {
    headline: `Get early access to ${goal.app_name || "this app"}`,
    subheadline: `A focused way for ${goal.audience || "busy teams"} to solve the problem behind: ${goal.goal}`,
    cta: "Join the early list",
    bullets: ["Built for a specific workflow", "Simple onboarding", "Early users shape the roadmap"]
  };
  const generated = await generateJson(landingPagePrompt(goalObject), fallback);
  const copy = landingSchema.safeParse(generated).success ? landingSchema.parse(generated) : fallback;
  const slug = `${slugify(goal.app_name || "goodbot-app")}-${goal.id.slice(0, 8)}`;

  const { data, error } = await supabase
    .from("landing_pages")
    .upsert(
      {
        goal_id: goal.id,
        slug,
        headline: copy.headline,
        subheadline: copy.subheadline,
        cta: copy.cta,
        bullets: copy.bullets,
        status: "published"
      },
      { onConflict: "slug" }
    )
    .select("id, slug")
    .single();

  if (error) throw error;
  return {
    ok: true,
    summary: "Landing page generated and published.",
    artifacts: { landing_page_id: data.id, url: `/goodbot/landing/${goal.id}`, slug: data.slug }
  };
}

export async function generateContent(goal: GoalRecord, input: Record<string, unknown>): Promise<StepOutput> {
  const supabase = getSupabaseAdmin();
  const goalObject = toGoalObject(goal);
  const linkedinCount = Number(input.linkedin_posts ?? 5);
  const blogCount = Number(input.blog_posts ?? 2);
  const fallback = {
    linkedin_posts: Array.from({ length: linkedinCount }, (_, index) => ({
      title: `LinkedIn acquisition post ${index + 1}`,
      body: `We are looking for early users for ${goal.app_name || "a focused web app"}. Goal: ${goal.goal}. Join the early list and help shape what ships next.`
    })),
    blog_posts: Array.from({ length: blogCount }, (_, index) => ({
      title: `${goal.app_name || "GoodBot"} acquisition note ${index + 1}`,
      body: `This is a simple launch note for ${goal.app_name || "the app"}.\n\nThe goal is clear: ${goal.goal}.\n\nWe are inviting early users who feel this problem and want a practical product shaped around their workflow. Join the early list to get access and updates.`
    }))
  };
  const generated = await generateJson(contentPrompt(goalObject), fallback);
  const parsed = contentSchema.safeParse(generated);
  const content = parsed.success ? parsed.data : fallback;

  const rows = [
    ...content.linkedin_posts.slice(0, linkedinCount).map((post) => ({
      goal_id: goal.id,
      content_type: "linkedin_post",
      status: "draft",
      title: post.title,
      body: post.body,
      channel: "linkedin"
    })),
    ...content.blog_posts.slice(0, blogCount).map((post) => ({
      goal_id: goal.id,
      content_type: "blog_post",
      status: "draft",
      title: post.title,
      body: post.body,
      channel: "goodbot_blog"
    }))
  ];

  const { data, error } = await supabase.from("content_assets").insert(rows).select("id, content_type");
  if (error) throw error;

  return {
    ok: true,
    summary: `Generated ${data.length} content assets.`,
    artifacts: { content_asset_ids: data.map((asset) => asset.id) }
  };
}

export async function publishContent(goal: GoalRecord): Promise<StepOutput> {
  const supabase = getSupabaseAdmin();
  const { data: drafts, error } = await supabase
    .from("content_assets")
    .select("id, content_type")
    .eq("goal_id", goal.id)
    .in("status", ["draft", "ready_to_publish"]);
  if (error) throw error;

  const blogIds = (drafts ?? []).filter((asset) => asset.content_type === "blog_post").map((asset) => asset.id);
  const linkedInIds = (drafts ?? []).filter((asset) => asset.content_type === "linkedin_post").map((asset) => asset.id);

  if (blogIds.length) {
    await supabase
      .from("content_assets")
      .update({ status: "published", published_url: null })
      .in("id", blogIds);
  }
  if (linkedInIds.length) {
    await supabase.from("content_assets").update({ status: "ready_to_publish" }).in("id", linkedInIds);
  }

  return {
    ok: true,
    summary: `Published ${blogIds.length} blog posts and prepared ${linkedInIds.length} LinkedIn posts.`,
    artifacts: { published_blog_posts: blogIds.length, linkedin_ready_to_publish: linkedInIds.length }
  };
}

export async function trackMetrics(goal: GoalRecord): Promise<StepOutput> {
  return {
    ok: true,
    summary: "Visit and signup tracking is active.",
    artifacts: {
      visit_endpoint: "/api/goodbot/metrics/visit",
      signup_endpoint: "/api/goodbot/signup",
      metric_types: ["visit", "signup"]
    }
  };
}

export async function runDailyFeedbackLoop() {
  const supabase = getSupabaseAdmin();
  const { data: goals, error } = await supabase.from("goals").select("*").eq("status", "working");
  if (error) throw error;

  const results = [];
  for (const goal of (goals ?? []) as GoalRecord[]) {
    const result = await evaluateGoal(goal);
    results.push({ goal_id: goal.id, ...result });
  }
  return results;
}

async function evaluateGoal(goal: GoalRecord) {
  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [{ data: recentMetrics }, { data: allSignups }] = await Promise.all([
    supabase.from("metrics").select("metric_type,value").eq("goal_id", goal.id).gte("created_at", since),
    supabase.from("metrics").select("value").eq("goal_id", goal.id).eq("metric_type", "signup")
  ]);

  const visits24h = sumMetric(recentMetrics, "visit");
  const signups24h = sumMetric(recentMetrics, "signup");
  const totalSignups = (allSignups ?? []).reduce((sum, row) => sum + Number(row.value ?? 0), 0);

  if (totalSignups >= goal.target_value) {
    await supabase.from("goals").update({ status: "completed", last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
    await createNotification(goal.id, "goal_completed", `Goal completed: ${totalSignups} users acquired.`);
    return { decision: "goal_completed", totalSignups };
  }

  const fallback = {
    progressing: signups24h > 0,
    decision: signups24h > 0 ? "continue_current_strategy" : "adjust_strategy",
    reason: signups24h > 0 ? "Recent signups show progress." : "No signups in the last 24 hours.",
    new_steps: signups24h > 0 ? [] : [{ step_type: "generate_content", title: "Generate 3 sharper LinkedIn posts", input: { linkedin_posts: 3, blog_posts: 0, strategy_note: "Sharpen pain point and CTA" } }],
    notification: signups24h > 0 ? undefined : "No new users in 24 hours. I generated sharper acquisition content and will keep watching signups."
  };

  const decision = await generateJson(
    feedbackPrompt({ goal: toGoalObject(goal), visits24h, signups24h, totalSignups, targetValue: goal.target_value }),
    fallback
  );

  if (decision.decision === "adjust_strategy" && Array.isArray(decision.new_steps) && decision.new_steps.length) {
    const { data: plan } = await supabase
      .from("plans")
      .insert({
        goal_id: goal.id,
        version: 2,
        rationale: decision.reason,
        plan_json: decision.new_steps
      })
      .select("id")
      .single();

    if (plan) {
      await supabase.from("steps").insert(
        decision.new_steps.map((step: { step_type: string; title: string; input?: Record<string, unknown> }, index: number) => ({
          goal_id: goal.id,
          plan_id: plan.id,
          position: index + 1,
          step_type: step.step_type,
          title: step.title,
          input: step.input ?? {}
        }))
      );
      await executePendingSteps(goal.id);
    }

    if (decision.notification) {
      await createNotification(goal.id, "strategy_changed", decision.notification);
    }
  }

  await supabase.from("goals").update({ last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
  return { decision: decision.decision, visits24h, signups24h, totalSignups };
}

async function createNotification(goalId: string, notificationType: string, message: string) {
  const supabase = getSupabaseAdmin();
  await supabase.from("notifications").insert({
    goal_id: goalId,
    notification_type: notificationType,
    message
  });
}

function toGoalObject(goal: GoalRecord): GoalObject {
  return {
    goal: goal.goal,
    target_metric: "users",
    target_value: goal.target_value,
    timeframe: goal.timeframe,
    app_name: goal.app_name,
    audience: goal.audience,
    positioning: goal.positioning
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function sumMetric(rows: { metric_type: string; value: number }[] | null, metricType: string) {
  return (rows ?? [])
    .filter((row) => row.metric_type === metricType)
    .reduce((sum, row) => sum + Number(row.value ?? 0), 0);
}
