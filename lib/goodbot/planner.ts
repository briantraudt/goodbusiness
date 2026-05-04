import { z } from "zod";
import { generateJson } from "./llm";
import { goalToPlanPrompt } from "./prompts";
import type { ExecutionPlan, GoalObject } from "./types";

const planSchema = z.object({
  rationale: z.string().min(1),
  steps: z
    .array(
      z.object({
        step_type: z.enum(["create_landing_page", "generate_content", "publish_content", "track_metrics"]),
        title: z.string().min(1),
        input: z.record(z.unknown()).default({})
      })
    )
    .length(4)
});

export function parseGoal(rawGoal: string): GoalObject {
  const targetValueMatch = rawGoal.match(/(\d+)\s+(users?|signups?|customers?)/i);
  const timeframeMatch = rawGoal.match(/in\s+(\d+\s+(days?|weeks?|months?))/i);
  const targetValue = targetValueMatch ? Number(targetValueMatch[1]) : 50;

  return {
    goal: rawGoal.trim(),
    target_metric: "users",
    target_value: Number.isFinite(targetValue) && targetValue > 0 ? targetValue : 50,
    timeframe: timeframeMatch?.[1] ?? null,
    app_name: inferAppName(rawGoal),
    audience: null,
    positioning: null
  };
}

export async function createPlan(goal: GoalObject): Promise<ExecutionPlan> {
  const fallback = deterministicPlan(goal);
  const generated = await generateJson<ExecutionPlan>(goalToPlanPrompt(goal), fallback);
  const parsed = planSchema.safeParse(generated);
  return parsed.success ? parsed.data : fallback;
}

function deterministicPlan(goal: GoalObject): ExecutionPlan {
  return {
    rationale: `Create a focused acquisition loop for ${goal.target_value} users: landing page, content, publishing, and metric tracking.`,
    steps: [
      {
        step_type: "create_landing_page",
        title: "Create acquisition landing page",
        input: { variant: "v1" }
      },
      {
        step_type: "generate_content",
        title: "Generate 5 LinkedIn posts and 2 blog posts",
        input: { linkedin_posts: 5, blog_posts: 2 }
      },
      {
        step_type: "publish_content",
        title: "Publish GoodBot-hosted content and prepare LinkedIn posts",
        input: { publish_blog_posts: true, prepare_linkedin_posts: true }
      },
      {
        step_type: "track_metrics",
        title: "Track visits and signups",
        input: { metrics: ["visit", "signup"] }
      }
    ]
  };
}

function inferAppName(rawGoal: string) {
  const appMatch = rawGoal.match(/(?:for|to)\s+(?:my\s+)?([A-Z][A-Za-z0-9 -]{2,40})(?:\s+app)?/);
  return appMatch?.[1]?.trim() ?? "your app";
}
