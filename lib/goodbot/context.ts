import { z } from "zod";
import { generateJson } from "./llm";
import { contextExtractionPrompt } from "./prompts";
import { getSupabaseAdmin } from "./supabase";
import type { GoalObject, GoodBotContext, GoodBotContextRecord } from "./types";

const contextSchema = z.object({
  product_name: z.string().nullable().default(null),
  headline: z.string().nullable().default(null),
  subheadline: z.string().nullable().default(null),
  value_prop: z.string().nullable().default(null),
  audience: z.string().nullable().default(null),
  features: z.array(z.string()).default([]),
  tone: z.string().nullable().default(null),
  differentiators: z.array(z.string()).default([]),
  pricing: z.string().nullable().default(null),
  risks: z.array(z.string()).default([]),
  confidence: z.enum(["low", "medium", "high"]).default("low")
});

export function extractUrlFromGoal(rawGoal: string) {
  const match = rawGoal.match(/\bhttps?:\/\/[^\s)]+|\b(?:www\.)[^\s)]+/i);
  if (!match) return null;
  const raw = match[0].replace(/[),.]+$/, "");
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

export function hasMeaningfulDescription(rawGoal: string) {
  const withoutUrl = rawGoal.replace(/\bhttps?:\/\/[^\s)]+|\b(?:www\.)[^\s)]+/gi, "").trim();
  return withoutUrl.length >= 80 || /\b(for|helps|built for|because|so that|who)\b/i.test(withoutUrl);
}

export async function gatherAndStoreContext(goalId: string, goal: GoalObject, rawGoal: string) {
  const sourceUrl = extractUrlFromGoal(rawGoal);
  const sourceType = sourceUrl ? "website" : "user_input";
  const rawText = sourceUrl ? await fetchWebsiteText(sourceUrl) : rawGoal;
  const extracted = await extractContext(goal, sourceType, rawText, sourceUrl);
  const questions = criticalQuestions(extracted);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("goodbot_context")
    .insert({
      goal_id: goalId,
      source_type: sourceType,
      status: "pending_confirmation",
      extracted_json: extracted,
      raw_text: rawText.slice(0, 30000),
      questions
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as GoodBotContextRecord;
}

export async function getLatestContext(goalId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("goodbot_context")
    .select("*")
    .eq("goal_id", goalId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as GoodBotContextRecord | null;
}

export async function getConfirmedContext(goalId: string) {
  const context = await getLatestContext(goalId);
  if (!context || context.status !== "confirmed") {
    throw new Error("GoodBot needs confirmed product context before generating assets.");
  }
  return context.extracted_json;
}

export function mergeContext(
  context: GoodBotContext,
  edits?: Partial<GoodBotContext>,
  answers?: Record<string, string>
): GoodBotContext {
  const answerText = Object.values(answers ?? {}).filter(Boolean).join(" ");
  const merged = contextSchema.parse({
    ...context,
    ...edits,
    features: normalizeList(edits?.features ?? context.features),
    differentiators: normalizeList(edits?.differentiators ?? context.differentiators),
    risks: normalizeList(edits?.risks ?? context.risks)
  });

  if (!merged.audience && answers?.audience) merged.audience = answers.audience;
  if (!merged.value_prop && answers?.strongest_outcome) merged.value_prop = answers.strongest_outcome;
  if (answers?.signup_objection && !merged.risks.includes(answers.signup_objection)) {
    merged.risks = [...merged.risks, answers.signup_objection];
  }
  if (answerText && merged.confidence === "low" && merged.product_name && merged.value_prop && merged.audience) {
    merged.confidence = "medium";
  }
  return merged;
}

async function fetchWebsiteText(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "GoodBot/1.0 (+https://goodbusinesshq.com/goodbot)"
      }
    });
    if (!response.ok) throw new Error(`Website returned HTTP ${response.status}.`);
    const html = await response.text();
    return htmlToText(html);
  } finally {
    clearTimeout(timeout);
  }
}

async function extractContext(goal: GoalObject, sourceType: string, rawText: string, url: string | null): Promise<GoodBotContext> {
  const fallback = deterministicExtract(goal, rawText, url);
  const generated = await generateJson(contextExtractionPrompt({ goal, sourceType, url, rawText }), fallback);
  const parsed = contextSchema.safeParse(generated);
  return parsed.success ? parsed.data : fallback;
}

function deterministicExtract(goal: GoalObject, rawText: string, url: string | null): GoodBotContext {
  const lines = rawText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 2 && line.length < 220);
  const title = lines[0] || goal.app_name || hostName(url) || null;
  const headline = lines.find((line) => line.length > 12 && line.length < 90) || title;
  const featureLines = lines.filter((line) => /\b(platform|tool|helps|create|manage|track|launch|users|founders|teams|AI|workflow)\b/i.test(line)).slice(0, 5);

  return {
    product_name: goal.app_name && goal.app_name !== "your app" ? goal.app_name : title,
    headline,
    subheadline: lines.find((line) => line !== headline && line.length > 20) || null,
    value_prop: featureLines[0] || headline || goal.positioning || null,
    audience: goal.audience || inferAudience(rawText),
    features: featureLines.length ? featureLines : [goal.goal],
    tone: inferTone(rawText),
    differentiators: featureLines.slice(1, 4),
    pricing: lines.find((line) => /\$\d+|pricing|free|per month/i.test(line)) || null,
    risks: [],
    confidence: featureLines.length >= 2 ? "medium" : "low"
  };
}

function criticalQuestions(context: GoodBotContext) {
  const questions: string[] = [];
  if (!context.audience) questions.push("Who specifically are you trying to reach?");
  if (!context.value_prop) questions.push("What is the single strongest outcome your product delivers?");
  if (!context.risks?.length) questions.push("Why would someone NOT sign up?");
  if (questions.length === 0 && context.confidence !== "high") {
    questions.push("Who specifically are you trying to reach?");
    questions.push("What is the single strongest outcome your product delivers?");
  }
  return questions.slice(0, 3);
}

function htmlToText(html: string) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  const withBreaks = withoutScripts
    .replace(/<\/(h1|h2|h3|p|li|title|meta|div|section|article)>/gi, "\n")
    .replace(/<meta[^>]+content=["']([^"']+)["'][^>]*>/gi, "\n$1\n");
  return decodeEntities(withBreaks.replace(/<[^>]+>/g, " "))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 30000);
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function inferAudience(text: string) {
  if (/founders|startup|indie hacker/i.test(text)) return "startup founders";
  if (/sales|revenue|pipeline/i.test(text)) return "sales teams";
  if (/developer|engineer|API/i.test(text)) return "software teams";
  if (/creator|coach|consultant/i.test(text)) return "solo operators and creators";
  return null;
}

function inferTone(text: string) {
  if (/AI|automated|agent|engine/i.test(text)) return "direct, modern, operator-focused";
  if (/simple|calm|easy/i.test(text)) return "simple and approachable";
  return "clear and practical";
}

function hostName(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function normalizeList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  return [];
}
