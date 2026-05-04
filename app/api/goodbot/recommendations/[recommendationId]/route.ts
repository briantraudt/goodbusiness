import { NextResponse } from "next/server";
import { z } from "zod";
import { executeRecommendation } from "@/lib/goodbot/executors";
import { enforceRateLimit, readClientIp, requireRecommendationAccess } from "@/lib/goodbot/security";

const actionSchema = z.object({
  action: z.enum(["approve", "reject"])
});

export async function PATCH(request: Request, { params }: { params: Promise<{ recommendationId: string }> }) {
  const { recommendationId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid recommendation action." }, { status: 400 });
  }

  const access = await requireRecommendationAccess(request, recommendationId);
  if (!access.ok) return access.response;
  const rateLimit = await enforceRateLimit(request, {
    name: "goodbot:recommendation-mutation",
    key: `${access.goalId}:${readClientIp(request)}`,
    limit: 60,
    windowSeconds: 60
  });
  if (!rateLimit.ok) return rateLimit.response;

  try {
    const recommendation = await executeRecommendation(recommendationId, parsed.data.action);
    return NextResponse.json({ ok: true, recommendation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recommendation action failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
