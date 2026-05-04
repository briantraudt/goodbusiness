import { NextResponse } from "next/server";
import { runQueuedJobs } from "@/lib/goodbot/executors";
import { enforceRateLimit, readClientIp, requireCronAuth } from "@/lib/goodbot/security";

async function run(request: Request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;
  const rateLimit = await enforceRateLimit(request, {
    name: "cron:goodbot-jobs",
    key: readClientIp(request),
    limit: 30,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  const results = await runQueuedJobs();
  return NextResponse.json({ ok: true, processed: results.length, results });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}
