import { z } from "zod";
import { contentPrompt, feedbackPrompt, landingPagePrompt } from "./prompts";
import { getSupabaseAdmin } from "./supabase";
import { generateJson } from "./llm";
import type { GoalObject, GoalRecord, GoodBotJobRecord, LandingPageRecord, StepOutput, StepRecord } from "./types";

const landingSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  cta: z.string().min(1),
  bullets: z.array(z.string()).min(3).max(5)
});

const contentSchema = z.object({
  linkedin_posts: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
  blog_posts: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
  email_drafts: z.array(z.object({ title: z.string(), body: z.string() })).default([])
});

const JOB_BATCH_SIZE = 5;

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

export async function enqueueFirstPendingStep(goalId: string) {
  const supabase = getSupabaseAdmin();
  const { data: step, error } = await supabase
    .from("steps")
    .select("*")
    .eq("goal_id", goalId)
    .eq("status", "pending")
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!step) return null;
  return enqueueStepJob(step as StepRecord);
}

export async function enqueueStepJob(step: StepRecord, runAfter = new Date()) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase
    .from("goodbot_jobs")
    .select("id,status")
    .eq("step_id", step.id)
    .in("status", ["pending", "running", "completed"])
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from("goodbot_jobs")
    .insert({
      goal_id: step.goal_id,
      step_id: step.id,
      job_type: "execute_step",
      status: "pending",
      run_after: runAfter.toISOString(),
      input: { step_type: step.step_type, title: step.title }
    })
    .select("id,status")
    .single();

  if (error) throw error;
  return data;
}

export async function runQueuedJobs(limit = JOB_BATCH_SIZE) {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: jobs, error } = await supabase
    .from("goodbot_jobs")
    .select("*")
    .eq("status", "pending")
    .lte("run_after", now)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;

  const results = [];
  for (const job of (jobs ?? []) as GoodBotJobRecord[]) {
    results.push(await runQueuedJob(job));
  }

  return results;
}

async function runQueuedJob(job: GoodBotJobRecord) {
  const supabase = getSupabaseAdmin();
  const lockedAt = new Date().toISOString();
  const { data: lockedJob, error: lockError } = await supabase
    .from("goodbot_jobs")
    .update({
      status: "running",
      locked_at: lockedAt,
      attempts: job.attempts + 1,
      updated_at: lockedAt
    })
    .eq("id", job.id)
    .eq("status", "pending")
    .select("*")
    .single();

  if (lockError || !lockedJob) {
    return { job_id: job.id, status: "skipped", error: lockError?.message };
  }

  try {
    let output: StepOutput;
    let shouldEnqueueNextStep = false;
    if (job.job_type === "execute_step" && job.step_id) {
      const [{ data: goal, error: goalError }, { data: step, error: stepError }] = await Promise.all([
        supabase.from("goals").select("*").eq("id", job.goal_id).single(),
        supabase.from("steps").select("*").eq("id", job.step_id).single()
      ]);
      if (goalError) throw goalError;
      if (stepError) throw stepError;

      output = await executeStep(goal as GoalRecord, step as StepRecord);
      shouldEnqueueNextStep = true;
    } else if (job.job_type === "feedback_loop") {
      const { data: goal, error: goalError } = await supabase.from("goals").select("*").eq("id", job.goal_id).single();
      if (goalError) throw goalError;
      output = {
        ok: true,
        summary: "Feedback loop evaluated.",
        artifacts: await evaluateGoal(goal as GoalRecord)
      };
    } else {
      throw new Error(`Unsupported job type: ${job.job_type}`);
    }

    await supabase
      .from("goodbot_jobs")
      .update({
        status: "completed",
        output,
        error: null,
        locked_at: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", job.id);

    if (shouldEnqueueNextStep) {
      await enqueueNextPendingStep(job.goal_id);
    }

    return { job_id: job.id, status: "completed", output };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown job error";
    const attempts = job.attempts + 1;
    const failedPermanently = attempts >= job.max_attempts;
    const retryDelayMs = Math.min(60, Math.pow(2, attempts) * 5) * 1000;

    await supabase
      .from("goodbot_jobs")
      .update({
        status: failedPermanently ? "failed" : "pending",
        error: message,
        locked_at: null,
        run_after: new Date(Date.now() + retryDelayMs).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", job.id);

    return { job_id: job.id, status: failedPermanently ? "failed" : "retrying", error: message };
  }
}

async function enqueueNextPendingStep(goalId: string) {
  const supabase = getSupabaseAdmin();
  const { data: runningOrPendingJobs, error: jobError } = await supabase
    .from("goodbot_jobs")
    .select("id")
    .eq("goal_id", goalId)
    .in("status", ["pending", "running"])
    .limit(1);

  if (jobError) throw jobError;
  if (runningOrPendingJobs?.length) return null;

  return enqueueFirstPendingStep(goalId);
}

async function runStep(goal: GoalRecord, step: StepRecord): Promise<StepOutput> {
  switch (step.step_type) {
    case "create_landing_page":
      return createLandingPage(goal, step.input);
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

export async function createLandingPage(goal: GoalRecord, input: Record<string, unknown> = {}): Promise<StepOutput> {
  const supabase = getSupabaseAdmin();
  const goalObject = toGoalObject(goal);
  const isVariant = Boolean(input.variant_reason || input.variant);
  const variantReason = String(input.variant_reason || input.variant || (isVariant ? "Generated from feedback loop." : "Initial generated landing page."));
  const fallback = {
    headline: isVariant ? `Try ${goal.app_name || "this app"} with less friction` : `Get early access to ${goal.app_name || "this app"}`,
    subheadline: `A focused way for ${goal.audience || "busy teams"} to solve the problem behind: ${goal.goal}`,
    cta: isVariant ? "Get early access" : "Join the early list",
    bullets: ["Built for a specific workflow", "Simple onboarding", "Early users shape the roadmap"]
  };
  const generated = await generateJson(landingPagePrompt(goalObject), fallback);
  const copy = landingSchema.safeParse(generated).success ? landingSchema.parse(generated) : fallback;
  const slug = `${slugify(goal.app_name || "goodbot-app")}-${goal.id.slice(0, 8)}`;

  let { data: page, error: pageReadError } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("goal_id", goal.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (pageReadError) throw pageReadError;

  if (!page) {
    const { data: createdPage, error: pageCreateError } = await supabase
      .from("landing_pages")
      .insert({
        goal_id: goal.id,
        slug,
        headline: copy.headline,
        subheadline: copy.subheadline,
        cta: copy.cta,
        bullets: copy.bullets,
        status: "published",
        approval_status: "approved",
        approved_at: new Date().toISOString(),
        distribution_status: "ready",
        distribution_channel: "landing_page",
        recommended_action: "Copy this link anywhere you are asking for early users."
      })
      .select("*")
      .single();

    if (pageCreateError) throw pageCreateError;
    page = createdPage;
  }

  const { count: variantCount, error: countError } = await supabase
    .from("landing_page_variants")
    .select("id", { count: "exact", head: true })
    .eq("landing_page_id", page.id);
  if (countError) throw countError;

  await supabase
    .from("landing_page_variants")
    .update({ status: "archived" })
    .eq("landing_page_id", page.id)
    .eq("status", "active");

  const variantName = `v${Number(variantCount ?? 0) + 1}`;
  const { data: variant, error } = await supabase
    .from("landing_page_variants")
    .insert({
      goal_id: goal.id,
      landing_page_id: page.id,
      variant_name: variantName,
      headline: copy.headline,
      subheadline: copy.subheadline,
      cta: copy.cta,
      bullets: copy.bullets,
      status: "active",
      reason: variantReason
    })
    .select("id, variant_name")
    .single();

  if (error) throw error;

  await supabase
    .from("landing_pages")
    .update({
      headline: copy.headline,
      subheadline: copy.subheadline,
      cta: copy.cta,
      bullets: copy.bullets,
      version: Number(variantCount ?? 0) + 1
    })
    .eq("id", page.id);

  return {
    ok: true,
    summary: isVariant ? `Landing page variant ${variant.variant_name} generated and activated.` : "Landing page generated and published.",
    artifacts: { landing_page_id: page.id, landing_page_variant_id: variant.id, variant_name: variant.variant_name, url: `/goodbot/landing/${goal.id}`, slug: (page as LandingPageRecord).slug }
  };
}

export async function generateContent(goal: GoalRecord, input: Record<string, unknown>): Promise<StepOutput> {
  const supabase = getSupabaseAdmin();
  const goalObject = toGoalObject(goal);
  const linkedinCount = Number(input.linkedin_posts ?? 5);
  const blogCount = Number(input.blog_posts ?? 2);
  const emailCount = Number(input.email_drafts ?? 0);
  const fallback = {
    linkedin_posts: Array.from({ length: linkedinCount }, (_, index) => ({
      title: `LinkedIn acquisition post ${index + 1}`,
      body: `We are looking for early users for ${goal.app_name || "a focused web app"}. Goal: ${goal.goal}. Join the early list and help shape what ships next.`
    })),
    blog_posts: Array.from({ length: blogCount }, (_, index) => ({
      title: `${goal.app_name || "GoodBot"} acquisition note ${index + 1}`,
      body: `This is a simple launch note for ${goal.app_name || "the app"}.\n\nThe goal is clear: ${goal.goal}.\n\nWe are inviting early users who feel this problem and want a practical product shaped around their workflow. Join the early list to get access and updates.`
    })),
    email_drafts: Array.from({ length: emailCount }, (_, index) => ({
      title: `${goal.app_name || "GoodBot"} early access email ${index + 1}`,
      body: `Subject: Early access for ${goal.app_name || "our app"}\n\nHi,\n\nI am inviting a small group of early users to try ${goal.app_name || "our app"}.\n\nThe goal: ${goal.goal}.\n\nIf this sounds relevant, join the early list here: /goodbot/landing/${goal.id}\n\nThanks.`
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
      channel: "linkedin",
      approval_status: "pending",
      distribution_status: "not_ready",
      distribution_channel: "linkedin_manual",
      recommended_action: "Review, approve, copy, and post manually to LinkedIn."
    })),
    ...content.blog_posts.slice(0, blogCount).map((post) => ({
      goal_id: goal.id,
      content_type: "blog_post",
      status: "draft",
      title: post.title,
      body: post.body,
      channel: "goodbot_blog",
      approval_status: "pending",
      distribution_status: "not_ready",
      distribution_channel: "blog_manual_share",
      recommended_action: "Approve to publish this hosted post, then share the URL."
    })),
    ...content.email_drafts.slice(0, emailCount).map((draft) => ({
      goal_id: goal.id,
      content_type: "email_draft",
      status: "draft",
      title: draft.title,
      body: draft.body,
      channel: "email",
      approval_status: "pending",
      distribution_status: "not_ready",
      distribution_channel: "email_manual",
      recommended_action: "Approve, copy, send manually, then mark as sent."
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
    .eq("approval_status", "pending")
    .neq("distribution_status", "distributed");
  if (error) throw error;

  await createNotification(
    goal.id,
    "strategy_changed",
    `I prepared ${(drafts ?? []).length} assets for approval. Approve what you want distributed.`
  );

  return {
    ok: true,
    summary: `Prepared ${(drafts ?? []).length} assets for approval.`,
    artifacts: { pending_approval: (drafts ?? []).length }
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
  const [{ data: recentMetrics }, { data: allSignups }, { data: distributionEvents }, { data: assetMetrics }, { data: variantMetrics }] = await Promise.all([
    supabase.from("metrics").select("metric_type,value,distribution_event_id,content_asset_id,landing_page_variant_id").eq("goal_id", goal.id).gte("created_at", since),
    supabase.from("metrics").select("value").eq("goal_id", goal.id).eq("metric_type", "signup")
    ,
    supabase.from("distribution_events").select("*").eq("goal_id", goal.id),
    supabase.from("metrics").select("metric_type,value,content_asset_id").eq("goal_id", goal.id).not("content_asset_id", "is", null),
    supabase.from("metrics").select("metric_type,value,landing_page_variant_id").eq("goal_id", goal.id).not("landing_page_variant_id", "is", null)
  ]);

  const visits24h = sumMetric(recentMetrics, "visit");
  const signups24h = sumMetric(recentMetrics, "signup");
  const totalSignups = (allSignups ?? []).reduce((sum, row) => sum + Number(row.value ?? 0), 0);
  const { data: assets } = await supabase
    .from("content_assets")
    .select("id,approval_status,distribution_status,content_type")
    .eq("goal_id", goal.id)
    .neq("approval_status", "rejected");

  const approvedUndistributed = (assets ?? []).filter(
    (asset) => asset.approval_status === "approved" && asset.distribution_status === "ready"
  ).length;
  const claimedOrVerifiedEvents = (distributionEvents ?? []).filter((event) => event.status === "claimed" || event.status === "verified");
  const verifiedEvents = (distributionEvents ?? []).filter((event) => event.status === "verified");
  const bestAsset = findBestPerformer(assetMetrics ?? [], "content_asset_id");
  const bestVariant = findBestPerformer(variantMetrics ?? [], "landing_page_variant_id");

  if (totalSignups >= goal.target_value) {
    await supabase.from("goals").update({ status: "completed", last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
    await createNotification(goal.id, "goal_completed", `Goal completed: ${totalSignups} users acquired.`);
    return { decision: "goal_completed", totalSignups };
  }

  if (approvedUndistributed > 0) {
    await createNotification(
      goal.id,
      "strategy_changed",
      `I have ${approvedUndistributed} approved assets ready. Post or share them so I can measure results.`
    );
    await supabase.from("goals").update({ last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
    return { decision: "awaiting_distribution", visits24h, signups24h, totalSignups, approvedUndistributed };
  }

  if (!claimedOrVerifiedEvents.length) {
    await createNotification(goal.id, "strategy_changed", "I can’t measure this yet because no approved asset has been distributed.");
    await supabase.from("goals").update({ last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
    return { decision: "distribution_blocked", visits24h, signups24h, totalSignups };
  }

  const fallback = {
    progressing: signups24h > 0,
    decision: signups24h > 0 ? "continue_current_strategy" : "adjust_strategy",
    reason: signups24h > 0 ? "Recent signups show progress." : "No signups in the last 24 hours.",
    new_steps:
      signups24h > 0
        ? []
        : visits24h > 0
          ? [{ step_type: "create_landing_page", title: "Generate landing page headline and CTA variant", input: { variant_reason: "Visits without signups" } }]
          : [{ step_type: "generate_content", title: bestAsset ? "Generate 3 posts similar to the best traffic driver" : "Generate 3 sharper LinkedIn posts", input: { linkedin_posts: 3, blog_posts: 0, strategy_note: bestAsset ? `Create more content similar to asset ${bestAsset.id}` : verifiedEvents.length > 0 ? "Verified distribution did not produce visits" : "Claimed distribution did not produce visits" } }],
    notification:
      signups24h > 0
        ? bestVariant
          ? `Signups are coming in. I am keeping the best-converting landing page active.`
          : undefined
        : visits24h > 0
          ? "This landing page received visits but no signups, so I created a new version."
          : "Assets were distributed but did not drive visits, so I generated new distribution copy."
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
      const { data: insertedSteps, error: stepInsertError } = await supabase.from("steps").insert(
        decision.new_steps.map((step: { step_type: string; title: string; input?: Record<string, unknown> }, index: number) => ({
          goal_id: goal.id,
          plan_id: plan.id,
          position: index + 1,
          step_type: step.step_type,
          title: step.title,
          input: step.input ?? {}
        }))
      ).select("*");
      if (stepInsertError) throw stepInsertError;
      if (insertedSteps?.[0]) await enqueueStepJob(insertedSteps[0] as StepRecord);
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

function findBestPerformer(rows: { metric_type: string; value: number; [key: string]: unknown }[], key: string) {
  const totals = new Map<string, { id: string; visits: number; signups: number }>();
  for (const row of rows) {
    const id = typeof row[key] === "string" ? row[key] : null;
    if (!id) continue;
    const current = totals.get(id) ?? { id, visits: 0, signups: 0 };
    if (row.metric_type === "visit") current.visits += Number(row.value ?? 0);
    if (row.metric_type === "signup") current.signups += Number(row.value ?? 0);
    totals.set(id, current);
  }

  return [...totals.values()].sort((a, b) => b.signups - a.signups || b.visits - a.visits)[0] ?? null;
}
