import { expect, test } from "@playwright/test";

test("GoodBot tracking URL records attributed visit and signup", async ({ page, request }) => {
  const appBaseUrl = process.env.GOODBOT_TEST_BASE_URL || "http://127.0.0.1:3000";
  const goalResponse = await request.post("/api/goodbot/goals", {
    data: {
      goal: "Get 5 users for GoodBot demo tracking in 7 days",
      app_name: "GoodBot",
      audience: "founders testing GoodBot attribution",
      demo_mode: true
    }
  });
  expect(goalResponse.ok()).toBeTruthy();
  const goalPayload = await goalResponse.json();
  const goalId = goalPayload.goal_id as string;

  await runGoodBotJobs(request);

  const initialStatus = await getStatus(request, goalId);
  const asset = initialStatus.content_assets.find((item: any) => item.content_type === "linkedin_post");
  expect(asset?.id).toBeTruthy();

  const approveResponse = await request.patch(`/api/goodbot/assets/${asset.id}`, {
    data: { action: "approve" }
  });
  expect(approveResponse.ok()).toBeTruthy();

  const distributeResponse = await request.patch(`/api/goodbot/assets/${asset.id}`, {
    data: {
      action: "mark_distributed",
      claimed_url: `${appBaseUrl}/goodbot`
    }
  });
  expect(distributeResponse.ok()).toBeTruthy();

  const distributedStatus = await getStatus(request, goalId);
  const distributionEvent = distributedStatus.distribution_events.find((event: any) => event.content_asset_id === asset.id);
  expect(distributionEvent?.tracking_url).toBeTruthy();

  const trackingUrl = distributionEvent.tracking_url.replace("http://localhost:3000", appBaseUrl);
  await page.goto(trackingUrl);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await expect.poll(async () => {
    const status = await getStatus(request, goalId);
    const row = status.attribution.by_distribution_event.find((item: any) => item.id === distributionEvent.id);
    return row?.visits ?? 0;
  }).toBeGreaterThan(0);

  await page.getByPlaceholder("Name").fill("GoodBot Demo");
  await page.getByPlaceholder("Email").fill(`goodbot-demo-${Date.now()}@example.com`);
  await page.getByRole("button", { name: /early|join|get/i }).click();
  await expect(page.getByText("You are on the list.")).toBeVisible();

  await expect.poll(async () => {
    const status = await getStatus(request, goalId);
    const row = status.attribution.by_distribution_event.find((item: any) => item.id === distributionEvent.id);
    return row?.signups ?? 0;
  }).toBeGreaterThan(0);

  const finalStatus = await getStatus(request, goalId);
  const assetAttribution = finalStatus.attribution.by_asset.find((item: any) => item.id === asset.id);
  const variantId = new URL(distributionEvent.tracking_url).searchParams.get("landing_page_variant_id");
  const variantAttribution = finalStatus.attribution.by_variant.find((item: any) => item.id === variantId);

  expect(assetAttribution.visits).toBeGreaterThan(0);
  expect(assetAttribution.signups).toBeGreaterThan(0);
  expect(variantAttribution.visits).toBeGreaterThan(0);
  expect(variantAttribution.signups).toBeGreaterThan(0);
});

async function runGoodBotJobs(request: any) {
  for (let index = 0; index < 8; index += 1) {
    const response = await request.post("/api/cron/goodbot-jobs");
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    if (!payload.processed) return;
  }
}

async function getStatus(request: any, goalId: string) {
  const response = await request.get(`/api/goodbot/status/${goalId}`, {
    headers: { "Cache-Control": "no-cache" }
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}
