"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Step = {
  id: string;
  title: string;
  step_type: string;
  status: string;
  output?: { summary?: string } | null;
  created_at?: string;
  updated_at?: string;
};

type ContentAsset = {
  id: string;
  content_type: "linkedin_post" | "blog_post" | "email_draft";
  title: string | null;
  body: string;
  edited_body: string | null;
  approval_status: "pending" | "approved" | "rejected";
  distribution_status: "not_ready" | "ready" | "distributed" | "failed";
  distribution_channel: string | null;
  distributed_at: string | null;
  published_url: string | null;
  recommended_action: string | null;
  created_at: string;
};

type LandingPage = {
  id: string;
  goal_id: string;
  headline: string;
  subheadline: string;
  cta: string;
  approval_status: string;
  distribution_status: string;
  created_at: string;
};

type DistributionEvent = {
  id: string;
  goal_id: string;
  content_asset_id: string | null;
  landing_page_id: string | null;
  channel: string;
  status: "claimed" | "verified" | "failed";
  claimed_url: string | null;
  tracking_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  verified_at: string | null;
  created_at: string;
};

type LandingPageVariant = {
  id: string;
  goal_id: string;
  landing_page_id: string;
  variant_name: string;
  headline: string;
  status: "draft" | "active" | "archived";
  reason: string | null;
  created_at: string;
};

type AttributionRow = {
  id: string;
  label: string;
  visits: number;
  signups: number;
  conversion_rate: number;
};

type Job = {
  id: string;
  job_type: string;
  status: string;
  attempts: number;
  error: string | null;
  created_at: string;
  updated_at: string;
};

type Notification = { id: string; message: string; created_at: string; notification_type: string };

type Recommendation = {
  id: string;
  goal_id: string;
  recommendation_type: string;
  title: string;
  rationale: string;
  confidence: "low" | "medium" | "high";
  status: "pending" | "approved" | "running" | "rejected" | "executed" | "failed";
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  created_at: string;
  executed_at: string | null;
};

type StatusResponse = {
  goal: { id: string; goal: string; target_value: number; status: string; app_name?: string | null };
  steps: Step[];
  notifications: Notification[];
  content_assets: ContentAsset[];
  landing_pages: LandingPage[];
  distribution_events: DistributionEvent[];
  landing_page_variants: LandingPageVariant[];
  recommendations: Recommendation[];
  attribution: {
    by_asset: AttributionRow[];
    by_variant: AttributionRow[];
    by_distribution_event: AttributionRow[];
  };
  jobs: Job[];
  metrics: { visits: number; signups: number; events?: { metric_type: string; value: number; created_at: string; source: string | null }[] };
  landing_page_url: string | null;
};

export default function GoodBotClient() {
  const [goal, setGoal] = useState("Get 50 users for GoodBot in 7 days");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGoalId = params.get("goalId");
    const urlToken = params.get("access_token");
    if (urlGoalId && urlToken) {
      setGoalId(urlGoalId);
      setAccessToken(urlToken);
      window.localStorage.setItem(`goodbot:${urlGoalId}:access_token`, urlToken);
    }
  }, []);

  useEffect(() => {
    if (!goalId) return;
    const tokenValue = accessToken || window.localStorage.getItem(`goodbot:${goalId}:access_token`);
    if (!tokenValue) return;
    if (!accessToken) setAccessToken(tokenValue);
    const token = tokenValue;
    let cancelled = false;

    async function loadStatus() {
      const response = await fetch(`/api/goodbot/status/${goalId}`, {
        headers: { "x-goodbot-access-token": token }
      });
      if (!response.ok || cancelled) return;
      setStatus(await response.json());
    }

    loadStatus();
    const interval = window.setInterval(loadStatus, 3500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [goalId, accessToken]);

  const currentState = useMemo(() => {
    if (!status) return "Waiting for a mission.";
    const activeJob = status.jobs.find((job) => job.status === "running" || job.status === "pending");
    const pendingApprovals = status.content_assets.filter((asset) => asset.approval_status === "pending").length;
    const readyToDistribute = status.content_assets.filter((asset) => asset.distribution_status === "ready").length;
    if (activeJob) return "Working through the queued execution plan.";
    if (pendingApprovals) return `I prepared ${pendingApprovals} assets for review.`;
    if (readyToDistribute) return `${readyToDistribute} approved assets are ready to distribute.`;
    return "The acquisition loop is live and being watched.";
  }, [status]);

  async function submitGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    setGoalId(null);
    setAccessToken(null);
    const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";

    const response = await fetch("/api/goodbot/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal,
        demo_mode: demoMode || undefined
      })
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error || "GoodBot could not start.");
      return;
    }

    setGoalId(payload.goal_id);
    setAccessToken(payload.access_token);
    window.localStorage.setItem(`goodbot:${payload.goal_id}:access_token`, payload.access_token);
    window.history.replaceState(null, "", `/goodbot?goalId=${payload.goal_id}&access_token=${encodeURIComponent(payload.access_token)}`);
  }

  async function assetAction(asset: ContentAsset, action: "approve" | "reject" | "edit" | "mark_distributed") {
    let body: Record<string, unknown> = { action };
    if (action === "edit") {
      const edited = window.prompt("Edit this asset", asset.edited_body || asset.body);
      if (!edited) return;
      body = { action, body: edited };
    }
    if (action === "mark_distributed") {
      const claimedUrl = window.prompt("Paste the URL where this was posted or shared. Leave blank if you do not have one yet.", "");
      if (claimedUrl === null) return;
      body = claimedUrl ? { action, claimed_url: claimedUrl } : { action, no_url: true };
    }

    const response = await fetch(`/api/goodbot/assets/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-goodbot-access-token": accessToken || "" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "Asset update failed.");
      return;
    }

    if (goalId) {
      const statusResponse = await fetch(`/api/goodbot/status/${goalId}`, {
        headers: { "x-goodbot-access-token": accessToken || "" }
      });
      if (statusResponse.ok) setStatus(await statusResponse.json());
    }
  }

  async function recommendationAction(recommendation: Recommendation, action: "approve" | "reject") {
    const response = await fetch(`/api/goodbot/recommendations/${recommendation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-goodbot-access-token": accessToken || "" },
      body: JSON.stringify({ action })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "Recommendation update failed.");
      return;
    }

    if (goalId) {
      const statusResponse = await fetch(`/api/goodbot/status/${goalId}`, {
        headers: { "x-goodbot-access-token": accessToken || "" }
      });
      if (statusResponse.ok) setStatus(await statusResponse.json());
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  const approvalAssets = status?.content_assets.filter((asset) => asset.approval_status === "pending") ?? [];
  const readyAssets = status?.content_assets.filter((asset) => asset.approval_status === "approved" && asset.distribution_status === "ready") ?? [];
  const completedSteps = status?.steps.filter((step) => step.status === "completed") ?? [];
  const distributionProof = status?.distribution_events ?? [];
  const variantPerformance = status?.landing_page_variants ?? [];
  const nextRecommendation = status?.recommendations.find((recommendation) => ["pending", "approved", "running", "failed"].includes(recommendation.status)) ?? null;
  const activity = buildActivity(status);

  return (
    <main className="goodbot-shell">
      <section className="goodbot-hero">
        <div className="goodbot-copy">
          <p className="eyebrow">Good Business / GoodBot</p>
          <h1>Autonomous Outcome Engine</h1>
          <p className="subcopy">
            Give GoodBot a user-acquisition outcome. It will prepare the work, queue the execution, and ask for approval before anything external happens.
          </p>
        </div>
        <img src="/assets/good-business-robot.svg" alt="" className="bot" />
      </section>

      <section className="workbench" aria-label="GoodBot goal intake">
        <form onSubmit={submitGoal} className="goal-form">
          <label htmlFor="goal">Give GoodBot the Mission</label>
          <textarea
            id="goal"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder='Tell GoodBot the outcome. Example: "Get 50 users for my app in 7 days."'
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Queuing the mission..." : "Give GoodBot the mission"}
          </button>
          <p className="approval-note">GoodBot prepares the work first. Nothing external is posted, sent, or shared without your approval.</p>
          {error ? <p className="error">{error}</p> : null}
        </form>

        <div className="status-panel operator-panel">
          <p className="status-label">{status ? "Next Move" : "What Happens Next"}</p>
          <h2>{status ? currentState : "GoodBot gets to work."}</h2>
          {status ? (
            <div className="metrics">
              <span>
                <strong>{status.metrics.visits}</strong>
                Visits
              </span>
              <span>
                <strong>{status.metrics.signups}</strong>
                Users
              </span>
              <span>
                <strong>{status.goal.target_value}</strong>
                Target
              </span>
            </div>
          ) : (
            <ol className="next-list">
              <li>Breaks the mission into executable steps.</li>
              <li>Creates the landing page and acquisition content.</li>
              <li>Queues the work and tracks visits and signups.</li>
              <li>Brings you approvals only when action is needed.</li>
            </ol>
          )}
          {status?.landing_page_url ? (
            <button className="text-button" type="button" onClick={() => copyText(`${window.location.origin}${status.landing_page_url}`)}>
              Copy Landing Page Link
            </button>
          ) : null}
          {nextRecommendation ? <p className="operator-note">I found the best next move.</p> : null}
        </div>
      </section>

      {status ? (
        <section className="operator-sections">
          <section>
            <p className="status-label">Next Move</p>
            {nextRecommendation ? (
              <RecommendationCard recommendation={nextRecommendation} onAction={recommendationAction} />
            ) : (
              <p className="empty">No recommendation is waiting. I am watching the loop for the next bottleneck.</p>
            )}
          </section>

          <section>
            <p className="status-label">What I’ve Done</p>
            <ol className="steps">
              {status.steps.map((step) => (
                <li key={step.id} data-status={step.status}>
                  <span>{step.title}</span>
                  <small>{step.output?.summary || step.status}</small>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <p className="status-label">Ready for Approval</p>
            {approvalAssets.length ? (
              <div className="approval-grid">
                {approvalAssets.map((asset) => (
                  <ApprovalCard key={asset.id} asset={asset} onAction={assetAction} onCopy={copyText} />
                ))}
              </div>
            ) : (
              <p className="empty">Nothing needs approval right now.</p>
            )}
          </section>

          <section>
            <p className="status-label">Ready to Distribute</p>
            {readyAssets.length ? (
              <div className="approval-grid">
                {readyAssets.map((asset) => (
                  <DistributionCard key={asset.id} asset={asset} onAction={assetAction} onCopy={copyText} />
                ))}
              </div>
            ) : (
              <p className="empty">Approved assets will appear here before any external action.</p>
            )}
          </section>

          <section>
            <p className="status-label">Results So Far</p>
            <div className="metrics results-metrics">
              <span>
                <strong>{completedSteps.length}</strong>
                Actions done
              </span>
              <span>
                <strong>{status.content_assets.filter((asset) => asset.distribution_status === "distributed").length}</strong>
                Distributed
              </span>
              <span>
                <strong>{status.jobs.filter((job) => job.status === "pending" || job.status === "running").length}</strong>
                Queued
              </span>
            </div>
          </section>

          <section>
            <p className="status-label">Distribution Proof</p>
            {distributionProof.length ? (
              <div className="proof-list">
                {distributionProof.map((event) => (
                  <DistributionProofRow
                    key={event.id}
                    event={event}
                    asset={status.content_assets.find((asset) => asset.id === event.content_asset_id) ?? null}
                    stats={status.attribution.by_distribution_event.find((row) => row.id === event.id)}
                    onCopy={copyText}
                  />
                ))}
              </div>
            ) : (
              <p className="empty">I can’t measure this yet because it has not been distributed.</p>
            )}
          </section>

          <section>
            <p className="status-label">Variant Performance</p>
            {variantPerformance.length ? (
              <div className="variant-list">
                {variantPerformance.map((variant) => (
                  <VariantRow key={variant.id} variant={variant} stats={status.attribution.by_variant.find((row) => row.id === variant.id)} />
                ))}
              </div>
            ) : (
              <p className="empty">No landing page variants have been generated yet.</p>
            )}
          </section>

          <section>
            <p className="status-label">GoodBot Activity</p>
            <ol className="activity-list">
              {activity.map((item) => (
                <li key={item.id}>
                  <span>{item.label}</span>
                  <small>{item.when}</small>
                </li>
              ))}
            </ol>
          </section>
        </section>
      ) : null}
    </main>
  );
}

function RecommendationCard({
  recommendation,
  onAction
}: {
  recommendation: Recommendation;
  onAction: (recommendation: Recommendation, action: "approve" | "reject") => void;
}) {
  return (
    <article className="recommendation-card">
      <div>
        <h3>{recommendation.title}</h3>
        <p>{recommendation.rationale}</p>
        <small>
          Confidence: {recommendation.confidence} / {recommendation.status} / {recommendationLabel(recommendation.recommendation_type)}
        </small>
      </div>
      <div className="action-row">
        <button type="button" onClick={() => onAction(recommendation, "approve")} disabled={recommendation.status !== "pending"}>
          Do it
        </button>
        <button type="button" onClick={() => onAction(recommendation, "reject")} disabled={recommendation.status !== "pending"}>
          Not now
        </button>
      </div>
    </article>
  );
}

function recommendationLabel(type: string) {
  if (type === "approve_share_first_asset") return "distribution blocker";
  if (type === "create_distribution_copy") return "stronger copy";
  if (type === "create_landing_page_variant") return "conversion blocker";
  if (type === "create_similar_posts") return "winning angle";
  if (type === "keep_winning_variant") return "variant winner";
  return "next move";
}

function DistributionProofRow({
  event,
  asset,
  stats,
  onCopy
}: {
  event: DistributionEvent;
  asset: ContentAsset | null;
  stats?: AttributionRow;
  onCopy: (text: string) => void;
}) {
  const visits = stats?.visits ?? 0;
  const signups = stats?.signups ?? 0;
  return (
    <article className="proof-row">
      <div>
        <p>{asset ? asset.title || assetLabel(asset.content_type) : event.channel}</p>
        <small>
          {event.status === "verified" ? "Verified" : event.status === "failed" ? "Failed" : "Verification pending"} / {event.channel}
        </small>
        {event.claimed_url ? (
          <a href={event.claimed_url} target="_blank" rel="noreferrer">
            Claimed URL
          </a>
        ) : (
          <small>I do not have a posted URL for this yet.</small>
        )}
      </div>
      <div className="proof-stats">
        <span>{visits} visits</span>
        <span>{signups} signups</span>
        <button type="button" onClick={() => onCopy(event.tracking_url)}>
          Copy Tracking URL
        </button>
      </div>
    </article>
  );
}

function VariantRow({ variant, stats }: { variant: LandingPageVariant; stats?: AttributionRow }) {
  const visits = stats?.visits ?? 0;
  const signups = stats?.signups ?? 0;
  const rate = visits > 0 ? Math.round((signups / visits) * 100) : 0;
  return (
    <article className="variant-row" data-status={variant.status}>
      <div>
        <p>{variant.headline}</p>
        <small>
          {variant.variant_name} / {variant.status}
          {variant.reason ? ` / ${variant.reason}` : ""}
        </small>
      </div>
      <div className="proof-stats">
        <span>{visits} visits</span>
        <span>{signups} signups</span>
        <span>{rate}% conversion</span>
      </div>
    </article>
  );
}

function ApprovalCard({
  asset,
  onAction,
  onCopy
}: {
  asset: ContentAsset;
  onAction: (asset: ContentAsset, action: "approve" | "reject" | "edit" | "mark_distributed") => void;
  onCopy: (text: string) => void;
}) {
  const body = asset.edited_body || asset.body;
  return (
    <article className="approval-card">
      <p>{assetLabel(asset.content_type)}</p>
      <h3>{asset.title || "Untitled asset"}</h3>
      <pre>{body.slice(0, 420)}</pre>
      <small>{asset.recommended_action}</small>
      <div className="action-row">
        <button type="button" onClick={() => onAction(asset, "approve")}>
          Approve
        </button>
        <button type="button" onClick={() => onAction(asset, "edit")}>
          Edit
        </button>
        <button type="button" onClick={() => onAction(asset, "reject")}>
          Reject
        </button>
        <button type="button" onClick={() => onCopy(body)}>
          Copy
        </button>
      </div>
    </article>
  );
}

function DistributionCard({
  asset,
  onAction,
  onCopy
}: {
  asset: ContentAsset;
  onAction: (asset: ContentAsset, action: "approve" | "reject" | "edit" | "mark_distributed") => void;
  onCopy: (text: string) => void;
}) {
  const body = asset.edited_body || asset.body;
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const link = asset.published_url ? `${origin}${asset.published_url}` : null;
  const copyText = link || body;
  return (
    <article className="approval-card ready-card">
      <p>{assetLabel(asset.content_type)}</p>
      <h3>{asset.title || "Untitled asset"}</h3>
      <pre>{copyText.slice(0, 420)}</pre>
      <small>{distributionInstruction(asset)}</small>
      <div className="action-row">
        <button type="button" onClick={() => onCopy(copyText)}>
          {asset.content_type === "blog_post" ? "Copy Link" : asset.content_type === "email_draft" ? "Copy Email" : "Copy Post"}
        </button>
        <button type="button" onClick={() => onAction(asset, "mark_distributed")}>
          {asset.content_type === "blog_post" ? "Mark as Shared" : asset.content_type === "email_draft" ? "Mark as Sent" : "Mark as Posted"}
        </button>
      </div>
    </article>
  );
}

function assetLabel(type: string) {
  if (type === "linkedin_post") return "LinkedIn post";
  if (type === "blog_post") return "Blog post";
  if (type === "email_draft") return "Email draft";
  return "Asset";
}

function distributionInstruction(asset: ContentAsset) {
  if (asset.content_type === "linkedin_post") return "Post this manually to LinkedIn, then mark it posted.";
  if (asset.content_type === "blog_post") return "Share the hosted URL, then mark it shared.";
  if (asset.content_type === "email_draft") return "Send this manually, then mark it sent.";
  return "Distribute manually, then mark complete.";
}

function buildActivity(status: StatusResponse | null) {
  if (!status) return [];
  const items = [
    ...status.steps
      .filter((step) => step.status === "completed")
      .map((step) => ({ id: `step-${step.id}`, label: step.output?.summary || step.title, date: step.updated_at || step.created_at || "" })),
    ...status.content_assets.map((asset) => ({
      id: `asset-${asset.id}`,
      label:
        asset.distribution_status === "distributed"
          ? `Distributed ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}`
          : asset.approval_status === "approved"
            ? `Approved ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}`
            : `Generated ${assetLabel(asset.content_type)}: ${asset.title || "Untitled"}`,
      date: asset.distributed_at || asset.created_at
    })),
    ...status.notifications.map((notification) => ({
      id: `notification-${notification.id}`,
      label: notification.message,
      date: notification.created_at
    })),
    ...status.recommendations.map((recommendation) => ({
      id: `recommendation-${recommendation.id}`,
      label:
        recommendation.status === "executed"
          ? `Executed next move: ${recommendation.title}.`
          : recommendation.status === "rejected"
            ? `Skipped next move: ${recommendation.title}.`
            : `Recommended next move: ${recommendation.title}.`,
      date: recommendation.executed_at || recommendation.created_at
    })),
    ...status.distribution_events.map((event) => ({
      id: `distribution-${event.id}`,
      label:
        event.status === "verified"
          ? `Verified distribution on ${event.channel}.`
          : `Distribution claimed on ${event.channel}. Verification pending.`,
      date: event.verified_at || event.created_at
    })),
    ...(status.metrics.events ?? []).slice(-10).map((metric, index) => ({
      id: `metric-${metric.created_at}-${index}`,
      label: `${metric.metric_type === "signup" ? "Signup" : "Visit"} recorded${metric.source ? ` from ${metric.source}` : ""}.`,
      date: metric.created_at
    }))
  ];

  return items
    .filter((item) => item.date)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 12)
    .map((item) => ({ ...item, when: new Date(item.date).toLocaleString() }));
}
