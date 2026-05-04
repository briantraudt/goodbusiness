import { NextResponse } from "next/server";
import { runQueuedJobs } from "@/lib/goodbot/executors";

async function run(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const results = await runQueuedJobs();
  return NextResponse.json({ ok: true, processed: results.length, results });
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}
