import type { GoalObject } from "./types";

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

export function landingPagePrompt(goal: GoalObject) {
  return `
${SYSTEM_SCOPE}

Generate acquisition landing-page copy for this web app goal:
${JSON.stringify(goal, null, 2)}

Return JSON only:
{
  "headline": "short specific headline",
  "subheadline": "one sentence",
  "cta": "short button text",
  "bullets": ["3 concrete reasons to join"]
}
`.trim();
}

export function contentPrompt(goal: GoalObject) {
  return `
${SYSTEM_SCOPE}

Generate content for this acquisition goal:
${JSON.stringify(goal, null, 2)}

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
