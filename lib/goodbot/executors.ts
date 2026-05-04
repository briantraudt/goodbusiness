import { z } from "zod";
import { contentPrompt, landingPagePrompt } from "./prompts";
import { getSupabaseAdmin } from "./supabase";
import { generateJson } from "./llm";
import { getConfirmedContext } from "./context";
import type { GoalObject, GoalRecord, GoodBotContext, GoodBotJobRecord, LandingPageRecord, PlanStep, RecommendationRecord, StepOutput, StepRecord } from "./types";

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
type RecommendedStep = PlanStep & { recommendation_id?: string };

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

export async function enqueueStepJob(step: StepRecord, runAfter = new Date(), recommendationId?: string | null) {
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
      recommendation_id: recommendationId || null,
      job_type: "execute_step",
      status: "pending",
      run_after: runAfter.toISOString(),
      input: { step_type: step.step_type, title: step.title, recommendation_id: recommendationId || null }
    })
    .select("id,status")
    .single();

  if (error) throw error;
  return data;
}

export async function executeRecommendation(recommendationId: string, action: "approve" | "reject") {
  const supabase = getSupabaseAdmin();
  const { data: recommendation, error } = await supabase
    .from("goodbot_recommendations")
    .select("*")
    .eq("id", recommendationId)
    .single();

  if (error) throw error;
  if (!recommendation) throw new Error("Recommendation not found.");
  const record = recommendation as RecommendationRecord;

  if (record.status !== "pending") {
    throw new Error("Recommendation has already been handled.");
  }

  if (action === "reject") {
    const { data, error: updateError } = await supabase
      .from("goodbot_recommendations")
      .update({ status: "rejected", output: { rejected_at: new Date().toISOString() } })
      .eq("id", record.id)
      .select("*")
      .single();
    if (updateError) throw updateError;
    return data;
  }

  await supabase
    .from("goodbot_recommendations")
    .update({ status: "approved", output: { approved_at: new Date().toISOString() } })
    .eq("id", record.id);

  try {
    await supabase
      .from("goodbot_recommendations")
      .update({ status: "running", output: { approved_at: new Date().toISOString(), running_at: new Date().toISOString() } })
      .eq("id", record.id);

    const output = await executeRecommendationAction(record);
    const isQueued = Boolean((output as { job_id?: unknown }).job_id);
    const { data, error: updateError } = await supabase
      .from("goodbot_recommendations")
      .update({
        status: isQueued ? "running" : "executed",
        output,
        executed_at: isQueued ? null : new Date().toISOString()
      })
      .eq("id", record.id)
      .select("*")
      .single();

    if (updateError) throw updateError;
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recommendation execution failed.";
    const { data } = await supabase
      .from("goodbot_recommendations")
      .update({ status: "failed", output: { error: message }, executed_at: null })
      .eq("id", record.id)
      .select("*")
      .single();
    if (data) return data;
    throw error;
  }
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

    await markRecommendationFromJob(job, "executed", output);

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

    if (failedPermanently) {
      await markRecommendationFromJob(job, "failed", { ok: false, summary: message });
    }

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

async function markRecommendationFromJob(job: GoodBotJobRecord, status: "executed" | "failed", output: StepOutput) {
  const recommendationId =
    job.recommendation_id ||
    (typeof job.input?.recommendation_id === "string" ? job.input.recommendation_id : null);
  if (!recommendationId) return;

  const supabase = getSupabaseAdmin();
  await supabase
    .from("goodbot_recommendations")
    .update({
      status,
      output: {
        job_id: job.id,
        step_id: job.step_id,
        job_status: status === "executed" ? "completed" : "failed",
        result: output
      },
      executed_at: status === "executed" ? new Date().toISOString() : null
    })
    .eq("id", recommendationId)
    .in("status", ["approved", "running"]);
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
  const context = await getConfirmedContext(goal.id);
  const isVariant = Boolean(input.variant_reason || input.variant);
  const variantReason = String(input.variant_reason || input.variant || (isVariant ? "Generated from feedback loop." : "Initial generated landing page."));
  const fallback = {
    headline: isVariant ? `${context.product_name} for ${context.audience}` : `${context.product_name}: ${specificOutcome(context)}`,
    subheadline: context.value_prop || `A focused way for ${context.audience || "the right users"} to solve the problem behind: ${goal.goal}`,
    cta: isVariant ? "Get early access" : "Join the early list",
    bullets: context.features.slice(0, 3).length >= 3 ? context.features.slice(0, 3) : [context.value_prop || "Specific product value", ...context.features, "Early users shape the roadmap"].slice(0, 3)
  };
  const generated = await generateJson(landingPagePrompt(goalObject, context), fallback);
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
  const context = await getConfirmedContext(goal.id);
  const linkedinCount = Number(input.linkedin_posts ?? 5);
  const blogCount = Number(input.blog_posts ?? 2);
  const emailCount = Number(input.email_drafts ?? 0);
  const sourceAssetId = typeof input.source_asset_id === "string" ? input.source_asset_id : null;
  const sourceAsset = sourceAssetId
    ? await fetchSourceAsset(goal.id, sourceAssetId)
    : null;
  const fallback = {
    linkedin_posts: Array.from({ length: linkedinCount }, (_, index) => ({
      title: `LinkedIn acquisition post ${index + 1}`,
      body: sourceAsset
        ? `For ${goal.audience || "early users"}: ${extractHook(sourceAsset.body)}\n\n${extractPain(sourceAsset.body)}\n\nIf this sounds familiar, join the early list for ${goal.app_name || "this app"} and help shape what ships next.`
        : `${context.product_name} is looking for ${context.audience} who want ${context.value_prop}.\n\n${context.features[0] || "The product is built around a specific workflow."}\n\nIf this is the problem you are solving now, join the early list.`
    })),
    blog_posts: Array.from({ length: blogCount }, (_, index) => ({
      title: `${context.product_name} for ${context.audience}: launch note ${index + 1}`,
      body: `${context.product_name} is built for ${context.audience}.\n\nThe core promise is simple: ${context.value_prop}.\n\nWhat it does:\n${context.features.map((feature) => `- ${feature}`).join("\n")}\n\nWhy it matters: ${context.differentiators[0] || "the product is focused on a concrete use case instead of generic software sprawl"}.\n\nWe are inviting early users who feel this problem now. Join the early list to get access and shape what ships next.`
    })),
    email_drafts: Array.from({ length: emailCount }, (_, index) => ({
      title: `${goal.app_name || "GoodBot"} early access email ${index + 1}`,
      body: `Subject: Early access for ${goal.app_name || "our app"}\n\nHi,\n\nI am inviting a small group of early users to try ${goal.app_name || "our app"}.\n\nThe goal: ${goal.goal}.\n\nIf this sounds relevant, join the early list here: /goodbot/landing/${goal.id}\n\nThanks.`
    }))
  };
  let generated = await generateJson(buildContentPrompt(goalObject, context, input, sourceAsset), fallback);
  const parsed = contentSchema.safeParse(generated);
  let content = parsed.success ? parsed.data : fallback;
  if (!contentPassesQuality(content, context)) {
    generated = await generateJson(`${buildContentPrompt(goalObject, context, input, sourceAsset)}

Quality failure from previous draft: the copy was too generic.
Regenerate with stricter specificity:
- Mention ${context.product_name}.
- Mention ${context.audience}.
- Include at least one actual feature: ${context.features.join(", ")}.
- Name the concrete use case and outcome.
- Avoid generic SaaS claims.`, fallback);
    const retryParsed = contentSchema.safeParse(generated);
    content = retryParsed.success && contentPassesQuality(retryParsed.data, context) ? retryParsed.data : fallback;
  }

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
      recommended_action: "Review, approve, copy, and post manually to LinkedIn.",
      metadata: sourceAsset ? { source_asset_id: sourceAsset.id, source_angle: summarizeSourceAngle(sourceAsset.body) } : {}
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
      recommended_action: "Approve to publish this hosted post, then share the URL.",
      metadata: sourceAsset ? { source_asset_id: sourceAsset.id, source_angle: summarizeSourceAngle(sourceAsset.body) } : {}
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
      recommended_action: "Approve, copy, send manually, then mark as sent.",
      metadata: sourceAsset ? { source_asset_id: sourceAsset.id, source_angle: summarizeSourceAngle(sourceAsset.body) } : {}
    }))
  ];

  const { data, error } = await supabase.from("content_assets").insert(rows).select("id, content_type");
  if (error) throw error;

  return {
    ok: true,
    summary: `Generated ${data.length} content assets.`,
    artifacts: { content_asset_ids: data.map((asset) => asset.id), source_asset_id: sourceAsset?.id ?? null }
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

async function fetchSourceAsset(goalId: string, sourceAssetId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("content_assets")
    .select("id,title,body,content_type,channel")
    .eq("goal_id", goalId)
    .eq("id", sourceAssetId)
    .maybeSingle();

  if (error) throw error;
  return data as { id: string; title: string | null; body: string; content_type: string; channel: string } | null;
}

function buildContentPrompt(
  goal: GoalObject,
  context: GoodBotContext,
  input: Record<string, unknown>,
  sourceAsset: { id: string; title: string | null; body: string; content_type: string; channel: string } | null
) {
  const basePrompt = contentPrompt(goal, context);
  if (!sourceAsset) return basePrompt;

  return `${basePrompt}

Winning source asset:
- id: ${sourceAsset.id}
- type: ${sourceAsset.content_type}
- title: ${sourceAsset.title || "Untitled"}
- body:
${sourceAsset.body}

The user asked GoodBot to create more posts using the winning angle.
Generate ${Number(input.linkedin_posts ?? 3)} LinkedIn posts that intentionally mirror the source asset:
- Same audience, but do not repeat identical wording.
- Same hook structure and opening tension.
- Same pain point and promised outcome.
- Same CTA intent.
- Same tone and directness.

Return JSON only in the original schema. Do not mention that you mirrored the source asset.`;
}

function contentPassesQuality(content: z.infer<typeof contentSchema>, context: GoodBotContext) {
  const productTerms = [context.product_name, context.audience, ...context.features.slice(0, 3)]
    .filter(Boolean)
    .map((term) => String(term).toLowerCase());
  const genericPhrases = ["transform your workflow", "revolutionize", "unlock your potential", "seamless solution", "streamline everything"];
  const assets = [...content.linkedin_posts, ...content.blog_posts, ...content.email_drafts];
  if (!assets.length) return false;
  return assets.every((asset) => {
    const text = `${asset.title} ${asset.body}`.toLowerCase();
    const hasSpecificTerm = productTerms.some((term) => term.length > 3 && text.includes(term.slice(0, Math.min(term.length, 32))));
    const hasGenericPhrase = genericPhrases.some((phrase) => text.includes(phrase));
    return hasSpecificTerm && !hasGenericPhrase;
  });
}

function specificOutcome(context: GoodBotContext) {
  if (context.value_prop) return context.value_prop.replace(/[.。]$/, "");
  return `built for ${context.audience || "a specific user"}`;
}

function extractHook(body: string) {
  return body.split(/\n+/).find((line) => line.trim().length > 0)?.trim().slice(0, 180) || "The old way of getting users is too manual.";
}

function extractPain(body: string) {
  const sentences = body.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences[1]?.trim().slice(0, 220) || "Most founders know they need distribution, but the work gets stuck between planning and posting.";
}

function summarizeSourceAngle(body: string) {
  return body.replace(/\s+/g, " ").trim().slice(0, 240);
}

export async function runDailyFeedbackLoop(goalId?: string) {
  const supabase = getSupabaseAdmin();
  let query = supabase.from("goals").select("*").eq("status", "working");
  if (goalId) query = query.eq("id", goalId);
  const { data: goals, error } = await query;
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
    supabase.from("metrics").select("value").eq("goal_id", goal.id).eq("metric_type", "signup"),
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
    await createRecommendation(goal.id, {
      recommendation_type: "approve_share_first_asset",
      title: "Share the first approved asset",
      rationale: "This is the bottleneck. I have approved work, but I cannot measure results until one asset is posted or shared.",
      confidence: "high",
      input: { next_action: "share_ready_asset" }
    });
    await createNotification(
      goal.id,
      "strategy_changed",
      `I have ${approvedUndistributed} approved assets ready. Post or share them so I can measure results.`
    );
    await supabase.from("goals").update({ last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
    return { decision: "awaiting_distribution", visits24h, signups24h, totalSignups, approvedUndistributed };
  }

  if (!claimedOrVerifiedEvents.length) {
    await createRecommendation(goal.id, {
      recommendation_type: "approve_share_first_asset",
      title: "Approve and share the first asset",
      rationale: "I need one approval before I can measure results. No asset has a distribution event yet.",
      confidence: "high",
      input: { next_action: "approve_first_pending_asset" }
    });
    await createNotification(goal.id, "strategy_changed", "I can’t measure this yet because no approved asset has been distributed.");
    await supabase.from("goals").update({ last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
    return { decision: "distribution_blocked", visits24h, signups24h, totalSignups };
  }

  if (visits24h === 0) {
    await createRecommendation(goal.id, {
      recommendation_type: "create_distribution_copy",
      title: "Create stronger distribution copy",
      rationale: "Assets were distributed, but they did not drive visits. The next best move is sharper post copy with a clearer reason to click.",
      confidence: verifiedEvents.length > 0 ? "high" : "medium",
      input: {
        step_type: "generate_content",
        title: "Generate 3 stronger distribution posts",
        linkedin_posts: 3,
        blog_posts: 0,
        strategy_note: verifiedEvents.length > 0 ? "Verified distribution did not produce visits." : "Claimed distribution did not produce visits."
      }
    });
    await createNotification(goal.id, "strategy_changed", "I found the best next move: stronger distribution copy.");
  } else if (signups24h === 0) {
    await createRecommendation(goal.id, {
      recommendation_type: "create_landing_page_variant",
      title: "Create a landing page variant",
      rationale: "People are visiting, but they are not signing up. The bottleneck is the landing page message or CTA.",
      confidence: "high",
      input: {
        step_type: "create_landing_page",
        title: "Generate landing page headline and CTA variant",
        variant_reason: "Visits without signups."
      }
    });
    await createNotification(goal.id, "strategy_changed", "This landing page received visits but no signups, so I prepared a new version as the next move.");
  } else if (bestAsset && bestAsset.visits > 0) {
    await createRecommendation(goal.id, {
      recommendation_type: "create_similar_posts",
      title: "Create 3 more posts using the winning angle",
      rationale: `One asset is driving the most traffic. I should make more content using that angle while it is working.`,
      confidence: bestAsset.signups > 0 ? "high" : "medium",
      input: {
        step_type: "generate_content",
        title: "Generate 3 posts similar to the best traffic driver",
        linkedin_posts: 3,
        blog_posts: 0,
        source_asset_id: bestAsset.id,
        strategy_note: `Create more content similar to asset ${bestAsset.id}.`
      }
    });
    await createNotification(goal.id, "strategy_changed", "I found the best next move: create more posts like the one driving traffic.");
  } else if (bestVariant && bestVariant.signups > 0) {
    await createRecommendation(goal.id, {
      recommendation_type: "keep_winning_variant",
      title: "Keep the winning landing page active",
      rationale: "One landing page variant is converting best. I should keep it active and archive weaker variants.",
      confidence: "medium",
      input: { landing_page_variant_id: bestVariant.id }
    });
    await createNotification(goal.id, "strategy_changed", "I found a landing page winner and prepared the cleanup move.");
  }

  await supabase.from("goals").update({ last_evaluated_at: new Date().toISOString() }).eq("id", goal.id);
  return { decision: "recommendation_created", visits24h, signups24h, totalSignups };
}

async function createNotification(goalId: string, notificationType: string, message: string) {
  const supabase = getSupabaseAdmin();
  await supabase.from("notifications").insert({
    goal_id: goalId,
    notification_type: notificationType,
    message
  });
}

async function createRecommendation(
  goalId: string,
  recommendation: {
    recommendation_type: string;
    title: string;
    rationale: string;
    confidence: "low" | "medium" | "high";
    input: Record<string, unknown>;
  }
) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase
    .from("goodbot_recommendations")
    .select("id")
    .eq("goal_id", goalId)
    .eq("recommendation_type", recommendation.recommendation_type)
    .in("status", ["pending", "approved", "running"])
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from("goodbot_recommendations")
    .insert({ goal_id: goalId, ...recommendation })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

async function executeRecommendationAction(recommendation: RecommendationRecord) {
  if (recommendation.recommendation_type === "approve_share_first_asset") {
    return approveFirstAsset(recommendation.goal_id);
  }

  if (recommendation.recommendation_type === "keep_winning_variant") {
    const variantId = typeof recommendation.input.landing_page_variant_id === "string" ? recommendation.input.landing_page_variant_id : null;
    if (!variantId) throw new Error("Recommendation is missing landing_page_variant_id.");
    return keepWinningVariant(recommendation.goal_id, variantId);
  }

  const step = recommendationToStep(recommendation);
  if (!step) throw new Error(`Unsupported recommendation type: ${recommendation.recommendation_type}`);
  return createRecommendedStep(recommendation.goal_id, recommendation.title, recommendation.rationale, step);
}

async function approveFirstAsset(goalId: string) {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: pendingAsset, error } = await supabase
    .from("content_assets")
    .select("*")
    .eq("goal_id", goalId)
    .eq("approval_status", "pending")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  const asset = pendingAsset;
  if (!asset) {
    const { data: readyAsset, error: readyError } = await supabase
      .from("content_assets")
      .select("id,title,content_type")
      .eq("goal_id", goalId)
      .eq("approval_status", "approved")
      .eq("distribution_status", "ready")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (readyError) throw readyError;
    return {
      ok: true,
      summary: readyAsset ? "First asset is already approved and ready to share." : "No asset is waiting for approval.",
      asset_id: readyAsset?.id ?? null
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from("content_assets")
    .update({
      approval_status: "approved",
      approved_at: now,
      rejected_at: null,
      distribution_status: "ready",
      status: asset.content_type === "blog_post" ? "published" : "ready_to_publish",
      published_url: asset.content_type === "blog_post" ? `/goodbot/blog/${asset.id}` : asset.published_url
    })
    .eq("id", asset.id)
    .select("id,title,content_type")
    .single();
  if (updateError) throw updateError;

  await createNotification(goalId, "strategy_changed", `I approved the first asset. It is ready for you to share so I can measure results.`);
  return { ok: true, summary: "Approved first asset and moved it to Ready to Distribute.", asset_id: updated.id };
}

async function keepWinningVariant(goalId: string, variantId: string) {
  const supabase = getSupabaseAdmin();
  const { data: variant, error } = await supabase
    .from("landing_page_variants")
    .select("*")
    .eq("id", variantId)
    .eq("goal_id", goalId)
    .single();
  if (error) throw error;

  await supabase
    .from("landing_page_variants")
    .update({ status: "archived" })
    .eq("landing_page_id", variant.landing_page_id)
    .neq("id", variantId);
  await supabase.from("landing_page_variants").update({ status: "active" }).eq("id", variantId);
  await createNotification(goalId, "strategy_changed", "I kept the winning landing page active and archived weaker variants.");
  return { ok: true, summary: "Kept winning variant active.", landing_page_variant_id: variantId };
}

function recommendationToStep(recommendation: RecommendationRecord): RecommendedStep | null {
  if (recommendation.recommendation_type === "create_distribution_copy") {
    return {
      step_type: "generate_content",
      title: String(recommendation.input.title || "Generate stronger distribution copy"),
      input: {
        linkedin_posts: Number(recommendation.input.linkedin_posts ?? 3),
        blog_posts: Number(recommendation.input.blog_posts ?? 0),
        strategy_note: recommendation.input.strategy_note || "Create sharper distribution copy."
      },
      recommendation_id: recommendation.id
    };
  }

  if (recommendation.recommendation_type === "create_landing_page_variant") {
    return {
      step_type: "create_landing_page",
      title: String(recommendation.input.title || "Generate landing page headline and CTA variant"),
      input: {
        variant_reason: recommendation.input.variant_reason || "Recommended next move."
      },
      recommendation_id: recommendation.id
    };
  }

  if (recommendation.recommendation_type === "create_similar_posts") {
    return {
      step_type: "generate_content",
      title: String(recommendation.input.title || "Generate 3 posts similar to the best traffic driver"),
      input: {
        linkedin_posts: Number(recommendation.input.linkedin_posts ?? 3),
        blog_posts: Number(recommendation.input.blog_posts ?? 0),
        source_asset_id: recommendation.input.source_asset_id || null,
        strategy_note: recommendation.input.strategy_note || "Create more content using the winning angle."
      },
      recommendation_id: recommendation.id
    };
  }

  return null;
}

async function createRecommendedStep(goalId: string, title: string, rationale: string, step: RecommendedStep) {
  const supabase = getSupabaseAdmin();
  const { data: latestPlan } = await supabase
    .from("plans")
    .select("version")
    .eq("goal_id", goalId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const version = Number(latestPlan?.version ?? 1) + 1;

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .insert({
      goal_id: goalId,
      version,
      rationale,
      plan_json: [step]
    })
    .select("id")
    .single();
  if (planError) throw planError;

  const { data: latestStep } = await supabase
    .from("steps")
    .select("position")
    .eq("goal_id", goalId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: insertedStep, error: stepError } = await supabase
    .from("steps")
    .insert({
      goal_id: goalId,
      plan_id: plan.id,
      position: Number(latestStep?.position ?? 0) + 1,
      step_type: step.step_type,
      title,
      input: step.input
    })
    .select("*")
    .single();
  if (stepError) throw stepError;

  const job = await enqueueStepJob(insertedStep as StepRecord, new Date(), step.recommendation_id || null);
  await createNotification(goalId, "strategy_changed", `I queued the next move: ${title}.`);
  return { ok: true, summary: "Queued recommendation as a GoodBot job.", step_id: insertedStep.id, job_id: job.id };
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
