import { NextResponse } from "next/server";
import { checkLinkedInReadiness } from "@/lib/goodbot/linkedin";
import { requireAuthenticatedUser } from "@/lib/goodbot/security";

export async function GET(request: Request) {
  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) return auth.response;

  const readiness = checkLinkedInReadiness(request);
  return NextResponse.json(readiness, { status: readiness.ok ? 200 : 500 });
}
