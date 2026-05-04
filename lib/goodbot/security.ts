import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase";

export type RateLimitResult = { ok: true } | { ok: false; response: NextResponse };

export function getGoodBotBaseUrl(request?: Request) {
  const configured = process.env.GOODBOT_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (request) return new URL(request.url).origin;
  throw new Error("GoodBot is missing required environment variable: GOODBOT_BASE_URL or NEXT_PUBLIC_SITE_URL.");
}

export function requireCronAuth(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return new Response("GoodBot is missing required environment variable: CRON_SECRET.", { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  return null;
}

export function createGoalAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requireGoalAccess(request: Request, goalId: string) {
  const token = readAccessToken(request);
  if (!token) {
    return { ok: false as const, response: NextResponse.json({ error: "GoodBot access token is required." }, { status: 401 }) };
  }

  const supabase = getSupabaseAdmin();
  const { data: goal, error } = await supabase.from("goals").select("id,access_token_hash").eq("id", goalId).single();
  if (error || !goal?.access_token_hash) {
    return { ok: false as const, response: NextResponse.json({ error: "Goal not found." }, { status: 404 }) };
  }

  if (!safeEqual(hashToken(token), goal.access_token_hash)) {
    return { ok: false as const, response: NextResponse.json({ error: "Invalid GoodBot access token." }, { status: 403 }) };
  }

  return { ok: true as const };
}

export async function requireAssetAccess(request: Request, assetId: string) {
  const supabase = getSupabaseAdmin();
  const { data: asset, error } = await supabase.from("content_assets").select("goal_id").eq("id", assetId).single();
  if (error || !asset) {
    return { ok: false as const, response: NextResponse.json({ error: "Asset not found." }, { status: 404 }) };
  }

  const access = await requireGoalAccess(request, asset.goal_id);
  if (!access.ok) return access;
  return { ok: true as const, goalId: asset.goal_id };
}

export async function requireRecommendationAccess(request: Request, recommendationId: string) {
  const supabase = getSupabaseAdmin();
  const { data: recommendation, error } = await supabase
    .from("goodbot_recommendations")
    .select("goal_id")
    .eq("id", recommendationId)
    .single();
  if (error || !recommendation) {
    return { ok: false as const, response: NextResponse.json({ error: "Recommendation not found." }, { status: 404 }) };
  }

  const access = await requireGoalAccess(request, recommendation.goal_id);
  if (!access.ok) return access;
  return { ok: true as const, goalId: recommendation.goal_id };
}

export function readClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function enforceRateLimit(
  request: Request,
  input: {
    name: string;
    key?: string;
    limit: number;
    windowSeconds: number;
  }
): Promise<RateLimitResult> {
  const supabase = getSupabaseAdmin();
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / (input.windowSeconds * 1000)) * input.windowSeconds * 1000).toISOString();
  const rawKey = `${input.name}:${input.key || readClientIp(request)}`;
  const keyHash = hashToken(rawKey);

  const { data: existing, error: readError } = await supabase
    .from("goodbot_rate_limits")
    .select("id,count")
    .eq("key_hash", keyHash)
    .eq("window_start", windowStart)
    .maybeSingle();

  if (readError) throw readError;

  if (existing) {
    if (Number(existing.count) >= input.limit) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Too many GoodBot requests. Try again shortly." }, { status: 429 })
      };
    }

    const { error } = await supabase
      .from("goodbot_rate_limits")
      .update({ count: Number(existing.count) + 1, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw error;
    return { ok: true };
  }

  const { error } = await supabase.from("goodbot_rate_limits").insert({
    key_hash: keyHash,
    route: input.name,
    window_start: windowStart,
    count: 1
  });
  if (error) throw error;
  return { ok: true };
}

function readAccessToken(request: Request) {
  const header = request.headers.get("x-goodbot-access-token");
  if (header) return header;
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("GoodBot ")) return auth.slice("GoodBot ".length);
  const token = new URL(request.url).searchParams.get("access_token");
  return token || null;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
