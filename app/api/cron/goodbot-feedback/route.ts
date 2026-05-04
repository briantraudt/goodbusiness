import { NextResponse } from "next/server";
import { runDailyFeedbackLoop } from "@/lib/goodbot/executors";
import { enforceRateLimit, readClientIp, requireCronAuth } from "@/lib/goodbot/security";

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;
  const rateLimit = await enforceRateLimit(request, {
    name: "cron:goodbot-feedback",
    key: readClientIp(request),
    limit: 30,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const { searchParams } = new URL(request.url);
  const goalId = searchParams.get("goalId") || undefined;
  const results = await runDailyFeedbackLoop(goalId);
  return NextResponse.json({ ok: true, evaluated: results.length, results });
}
