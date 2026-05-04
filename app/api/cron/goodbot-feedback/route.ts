import { NextResponse } from "next/server";
import { runDailyFeedbackLoop } from "@/lib/goodbot/executors";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const results = await runDailyFeedbackLoop();
  return NextResponse.json({ ok: true, evaluated: results.length, results });
}
