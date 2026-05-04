import type { GoalObject, GoodBotContext } from "./types";

export const SYSTEM_SCOPE = `
You are GoodBot, an autonomous outcome engine for one V1 domain only:
user acquisition for a web app.

Allowed tools:
- Landing page generator
- Content generator for LinkedIn posts and simple blog posts
- Email draft generator for copy-ready launch emails
- Email capture and Supabase storage
- Basic analytics tracking for page visits and signups

Do not create generalized agent tasks, scraping, browser automation, paid ads, Zapier, outbound email, or multi-goal orchestration.
All steps must be deterministic and map to one of:
create_landing_page, generate_content, publish_content, track_metrics.
`.trim();

export function goalToPlanPrompt(goal: GoalObject) {
  return `
${SYSTEM_SCOPE}

Create a compact execution plan for this goal object:
${JSON.stringify(goal, null, 2)}

Return JSON only:
{
  "rationale": "one sentence",
  "steps": [
    {
      "step_type": "create_landing_page",
      "title": "Create acquisition landing page",
      "input": {}
    }
  ]
}

Rules:
- Include exactly these step types in this order: create_landing_page, generate_content, publish_content, track_metrics.
- generate_content must request 5 LinkedIn posts and 2 simple blog posts.
- email drafts are optional and must only be generated when explicitly requested.
- publish_content means publish GoodBot-hosted blog/landing artifacts and mark LinkedIn posts ready_to_publish.
- track_metrics means enable visits and signups tracking.
- No vague steps.
`.trim();
}

export function goalContextToPlanPrompt(goal: GoalObject, context: GoodBotContext) {
  return `
${SYSTEM_SCOPE}

Create a compact execution plan for this goal and confirmed product context:
${JSON.stringify({ goal, context }, null, 2)}

Return JSON only:
{
  "rationale": "one sentence",
  "steps": [
    {
      "step_type": "create_landing_page",
      "title": "Create acquisition landing page",
      "input": {}
    }
  ]
}

Rules:
- Context is mandatory. If product_name, value_prop, or audience is missing, make the rationale say context is insufficient and still return the fixed deterministic step shell.
- Include exactly these step types in this order: create_landing_page, generate_content, publish_content, track_metrics.
- Every title/input should reference the real product, audience, or use case.
- generate_content must request 5 LinkedIn posts and 2 simple blog posts.
- No vague steps.
`.trim();
}

export function contextExtractionPrompt(input: { goal: GoalObject; sourceType: string; url?: string | null; rawText: string }) {
  return `
You are extracting product context for GoodBot before it plans user-acquisition work.

Goal:
${JSON.stringify(input.goal, null, 2)}

Source type: ${input.sourceType}
Source URL: ${input.url || "none"}

Raw source text:
${input.rawText.slice(0, 12000)}

Return JSON only:
{
  "product_name": "name or null",
  "headline": "homepage headline or null",
  "subheadline": "homepage subheadline or null",
  "value_prop": "specific value proposition or null",
  "audience": "specific target user or null",
  "features": ["concrete visible features"],
  "tone": "plain description of tone",
  "differentiators": ["specific reasons this product is different"],
  "pricing": "pricing if visible or null",
  "risks": ["why someone may not sign up"],
  "confidence": "low" | "medium" | "high"
}

Rules:
- Do not invent facts.
- Prefer concrete nouns from the source.
- If the site is vague, use null and confidence low.
`.trim();
}

export function landingPagePrompt(goal: GoalObject, context: GoodBotContext) {
  return `
${SYSTEM_SCOPE}

Generate acquisition landing-page copy for this confirmed product context:
${JSON.stringify({ goal, context }, null, 2)}

Return JSON only:
{
  "headline": "short specific headline",
  "subheadline": "one sentence",
  "cta": "short button text",
  "bullets": ["3 concrete reasons to join"]
}

Rules:
- Use the product name, real value proposition, audience, and concrete features.
- Avoid generic phrases like "transform your workflow", "revolutionize productivity", and "streamline everything".
- The headline must name a specific outcome or use case.
`.trim();
}

export function contentPrompt(goal: GoalObject, context: GoodBotContext) {
  return `
${SYSTEM_SCOPE}

Generate content for this confirmed product context:
${JSON.stringify({ goal, context }, null, 2)}

Return JSON only:
{
  "linkedin_posts": [
    {"title": "internal title", "body": "post copy"}
  ],
  "blog_posts": [
    {"title": "public title", "body": "simple blog post copy, 400-700 words"}
  ],
  "email_drafts": [
    {"title": "internal title", "body": "plain text email draft"}
  ]
}

Rules:
- Exactly 5 LinkedIn posts.
- Exactly 2 blog posts.
- Include email_drafts only if requested in the execution input.
- Tie every piece of content to the landing page CTA.
- Use concrete language from the context: product_name, value_prop, audience, features, tone, and differentiators.
- Every asset must reference an actual use case or feature.
- Do not use generic SaaS filler, including "transform your workflow", "revolutionize productivity", "unlock your potential", or "seamless solution".
`.trim();
}

export function feedbackPrompt(input: {
  goal: GoalObject;
  visits24h: number;
  signups24h: number;
  totalSignups: number;
  targetValue: number;
}) {
  return `
${SYSTEM_SCOPE}

Evaluate whether GoodBot is progressing toward the goal:
${JSON.stringify(input, null, 2)}

Return JSON only:
{
  "progressing": true,
  "decision": "continue_current_strategy" | "adjust_strategy" | "goal_completed",
  "reason": "one sentence",
  "new_steps": [
    {
      "step_type": "generate_content",
      "title": "Generate 3 revised LinkedIn posts",
      "input": {"linkedin_posts": 3, "blog_posts": 0, "strategy_note": "specific adjustment"}
    }
  ],
  "notification": "only include if milestone achieved, strategy changed, or goal completed"
}

Rules:
- If totalSignups >= targetValue, decision is goal_completed.
- If visits24h > 0 and signups24h is 0, create a landing page variant.
- If there were no visits, generate more content with sharper distribution copy.
- New steps can only use create_landing_page, generate_content, publish_content, or track_metrics.
`.trim();
}
