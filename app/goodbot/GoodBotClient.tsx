"use client";

import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getGoodBotBrowserSupabase } from "@/lib/goodbot/browserSupabase";

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
  external_post_id?: string | null;
  external_url?: string | null;
  posted_at?: string | null;
  auto_post_status?: string | null;
  metadata?: Record<string, unknown>;
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

type MissionSummary = {
  id: string;
  goal: string;
  status: string;
  target_value: number;
  created_at: string;
  is_demo: boolean;
  project_name: string | null;
  signups: number;
};

type GoodBotContext = {
  product_name: string | null;
  headline?: string | null;
  subheadline?: string | null;
  value_prop: string | null;
  audience: string | null;
  features: string[];
  tone: string | null;
  differentiators: string[];
  pricing?: string | null;
  risks?: string[];
  confidence: "low" | "medium" | "high";
};

type GoodBotContextRecord = {
  id: string;
  goal_id: string;
  source_type: "website" | "user_input";
  status: "pending_confirmation" | "confirmed";
  extracted_json: GoodBotContext;
  raw_text: string | null;
  questions: string[];
  answers: Record<string, string>;
  confirmed_at: string | null;
  created_at: string;
};

type LinkedInIntegration = {
  connected: boolean;
  provider?: string;
  account_name?: string | null;
  scopes?: string[];
  token_expires_at?: string | null;
  status?: string;
  reconnect_required?: boolean;
  reconnect_reason?: string | null;
  comment_monitoring_available?: boolean;
};

type StatusResponse = {
  goal: {
    id: string;
    goal: string;
    target_value: number;
    status: string;
    app_name?: string | null;
    project_name?: string | null;
    autonomous_mode?: boolean;
    auto_post_mode?: "manual" | "auto_post";
    daily_post_limit?: number;
    auto_response_level?: string;
    paused_at?: string | null;
  };
  steps: Step[];
  notifications: Notification[];
  content_assets: ContentAsset[];
  landing_pages: LandingPage[];
  distribution_events: DistributionEvent[];
  landing_page_variants: LandingPageVariant[];
  recommendations: Recommendation[];
  engagement_events: Array<{ id: string; category: string | null; sentiment: string | null; response_status: string; comment_text: string; suggested_response: string | null; created_at: string }>;
  integrations?: { linkedin?: LinkedInIntegration };
  context: GoodBotContextRecord | null;
  attribution: {
    by_asset: AttributionRow[];
    by_variant: AttributionRow[];
    by_distribution_event: AttributionRow[];
  };
  jobs: Job[];
  metrics: { visits: number; signups: number; events?: { metric_type: string; value: number; created_at: string; source: string | null }[] };
  landing_page_url: string | null;
};

type ExecutionState = "idle" | "executing" | "waiting_for_approval" | "waiting_for_distribution" | "measuring" | "recommending";

export default function GoodBotClient() {
  const [goal, setGoal] = useState("");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [clockTick, setClockTick] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [authState, setAuthState] = useState<"loading_session" | "signed_out" | "signing_in" | "signed_in">("loading_session");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [missions, setMissions] = useState<MissionSummary[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [deletingMissionId, setDeletingMissionId] = useState<string | null>(null);
  const [autoSelectMission, setAutoSelectMission] = useState(true);
  const [contextSaving, setContextSaving] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const goalInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGoalId = params.get("goalId");
    const urlToken = params.get("access_token");
    const linkedinState = params.get("linkedin");
    const linkedinError = params.get("linkedin_error");
    const linkedinErrorDescription = params.get("linkedin_error_description");
    if (urlGoalId && urlToken) {
      setGoalId(urlGoalId);
      setAccessToken(urlToken);
      window.localStorage.setItem(`goodbot:${urlGoalId}:access_token`, urlToken);
    }
    if (linkedinState === "connected") {
      setError(null);
    }
    if (linkedinState === "failed") {
      const details = [linkedinError, linkedinErrorDescription].filter(Boolean).join(": ");
      setError(details ? `LinkedIn connection failed: ${details}` : "LinkedIn connection failed.");
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let supabase: ReturnType<typeof getGoodBotBrowserSupabase>;
    try {
      supabase = getGoodBotBrowserSupabase();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "GoodBot auth is not configured.");
      setAuthState("signed_out");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthState(data.session ? "signed_in" : "signed_out");
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setAuthState(nextSession ? "signed_in" : "signed_out");
      if (!nextSession) {
        setMissions([]);
        setGoalId(null);
        setAccessToken(null);
        setStatus(null);
        setAutoSelectMission(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    loadMissions(session.access_token).catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : "Could not load missions.");
    });
  }, [session]);

  useEffect(() => {
    if (!session || goalId || !missions.length || !autoSelectMission) return;
    const storedGoalId = window.localStorage.getItem("goodbot:last_goal_id");
    const storedMission = storedGoalId ? missions.find((mission) => mission.id === storedGoalId) : null;
    const activeMission = missions.find((mission) => mission.status === "active") ?? missions[0];
    selectMission(storedMission ?? activeMission);
  }, [goalId, missions, session]);

  useEffect(() => {
    if (!goalId) return;
    const tokenValue = accessToken || window.localStorage.getItem(`goodbot:${goalId}:access_token`);
    if (!tokenValue && !session?.access_token) return;
    if (!accessToken && tokenValue) setAccessToken(tokenValue);
    const token = tokenValue;
    let cancelled = false;

    async function loadStatus() {
      const response = await fetch(`/api/goodbot/status/${goalId}`, {
        headers: buildApiHeaders(session, token)
      });
      if (!response.ok || cancelled) return;
      setStatus(await response.json());
      setLastUpdatedAt(new Date());
    }

    loadStatus();
    const interval = window.setInterval(loadStatus, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [goalId, accessToken, session]);

  useEffect(() => {
    if (!lastUpdatedAt) return;
    const interval = window.setInterval(() => setClockTick((tick) => tick + 1), 1000);
    return () => window.clearInterval(interval);
  }, [lastUpdatedAt]);

  useEffect(() => {
    if (!showAuthForm) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && authState !== "signing_in") {
        setShowAuthForm(false);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [authState, showAuthForm]);

  async function submitGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setError("Sign in before giving GoodBot a mission.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    setGoalId(null);
    setAccessToken(null);
    const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";

    const response = await fetch("/api/goodbot/goals", {
      method: "POST",
      headers: buildApiHeaders(session, null, { "Content-Type": "application/json" }),
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
    setAutoSelectMission(true);
    window.localStorage.setItem(`goodbot:${payload.goal_id}:access_token`, payload.access_token);
    window.localStorage.setItem("goodbot:last_goal_id", payload.goal_id);
    window.history.replaceState(null, "", `/goodbot?goalId=${payload.goal_id}&access_token=${encodeURIComponent(payload.access_token)}`);
    await loadMissions(session.access_token);
  }

  async function assetAction(asset: ContentAsset, action: "approve" | "reject" | "edit" | "mark_distributed" | "retry_auto_post") {
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
      headers: buildApiHeaders(session, accessToken, { "Content-Type": "application/json" }),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "Asset update failed.");
      return;
    }

    if (goalId) {
      const statusResponse = await fetch(`/api/goodbot/status/${goalId}`, {
        headers: buildApiHeaders(session, accessToken)
      });
      if (statusResponse.ok) setStatus(await statusResponse.json());
    }
  }

  async function recommendationAction(recommendation: Recommendation, action: "approve" | "reject") {
    const response = await fetch(`/api/goodbot/recommendations/${recommendation.id}`, {
      method: "PATCH",
      headers: buildApiHeaders(session, accessToken, { "Content-Type": "application/json" }),
      body: JSON.stringify({ action })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "Recommendation update failed.");
      return;
    }

    if (goalId) {
      const statusResponse = await fetch(`/api/goodbot/status/${goalId}`, {
        headers: buildApiHeaders(session, accessToken)
      });
      if (statusResponse.ok) setStatus(await statusResponse.json());
    }
  }

  async function updateGoalSettings(input: Record<string, unknown>) {
    if (!goalId) return;
    const response = await fetch(`/api/goodbot/goals/${goalId}`, {
      method: "PATCH",
      headers: buildApiHeaders(session, accessToken, { "Content-Type": "application/json" }),
      body: JSON.stringify(input)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "GoodBot settings update failed.");
      return;
    }
    const statusResponse = await fetch(`/api/goodbot/status/${goalId}`, {
      headers: buildApiHeaders(session, accessToken)
    });
    if (statusResponse.ok) setStatus(await statusResponse.json());
  }

  async function connectLinkedIn() {
    const response = await fetch("/api/goodbot/integrations/linkedin/start", {
      method: "POST",
      headers: buildApiHeaders(session, null)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.authorization_url) {
      setError(payload.error || "LinkedIn connection could not start.");
      return;
    }
    window.location.href = payload.authorization_url;
  }

  async function disconnectLinkedIn() {
    const confirmed = window.confirm("Disconnect LinkedIn and turn off auto-post for your missions?");
    if (!confirmed) return;

    const response = await fetch("/api/goodbot/integrations/linkedin", {
      method: "DELETE",
      headers: buildApiHeaders(session, null)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || "LinkedIn disconnect failed.");
      return;
    }

    if (goalId) {
      const statusResponse = await fetch(`/api/goodbot/status/${goalId}`, {
        headers: buildApiHeaders(session, accessToken)
      });
      if (statusResponse.ok) {
        setStatus(await statusResponse.json());
        setLastUpdatedAt(new Date());
      }
    }
  }

  async function contextAction(input: { action: "confirm" | "edit"; context?: Partial<GoodBotContext>; answers?: Record<string, string> }) {
    if (!goalId) return;
    setContextSaving(true);
    setError(null);
    const response = await fetch(`/api/goodbot/context/${goalId}`, {
      method: "PATCH",
      headers: buildApiHeaders(session, accessToken, { "Content-Type": "application/json" }),
      body: JSON.stringify(input)
    });
    const payload = await response.json().catch(() => ({}));
    setContextSaving(false);
    if (!response.ok) {
      setError(payload.error || "GoodBot could not save context.");
      return;
    }
    const statusResponse = await fetch(`/api/goodbot/status/${goalId}`, {
      headers: buildApiHeaders(session, accessToken)
    });
    if (statusResponse.ok) {
      setStatus(await statusResponse.json());
      setLastUpdatedAt(new Date());
    }
    if (session) await loadMissions(session.access_token);
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setAuthState("signing_in");
    const supabase = getGoodBotBrowserSupabase();
    const email = authEmail.trim();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: authPassword
    });

    if (!signInError && data.session) {
      setSession(data.session);
      setAuthState("signed_in");
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: authPassword
    });

    if (signUpError) {
      setAuthState("signed_out");
      setError(signUpError.message || signInError?.message || "Sign in failed.");
      return;
    }

    setSession(signUpData.session);
    setAuthState(signUpData.session ? "signed_in" : "signed_out");
    if (!signUpData.session) {
      setError("Check your email to confirm your account, then sign in.");
    }
  }

  async function signOut() {
    await getGoodBotBrowserSupabase().auth.signOut();
    window.history.replaceState(null, "", "/goodbot");
  }

  async function loadMissions(accessJwt: string) {
    setMissionsLoading(true);
    try {
      const response = await fetch("/api/goodbot/goals", {
        headers: { Authorization: `Bearer ${accessJwt}` }
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not load missions.");
      setMissions(payload.goals ?? []);
    } finally {
      setMissionsLoading(false);
    }
  }

  function selectMission(mission: MissionSummary) {
    setGoalId(mission.id);
    setGoal(mission.goal);
    setAutoSelectMission(true);
    setStatus(null);
    const token = window.localStorage.getItem(`goodbot:${mission.id}:access_token`);
    setAccessToken(token);
    window.localStorage.setItem("goodbot:last_goal_id", mission.id);
    const tokenParam = token ? `&access_token=${encodeURIComponent(token)}` : "";
    window.history.replaceState(null, "", `/goodbot?goalId=${mission.id}${tokenParam}`);
  }

  function startNewMission() {
    setGoalId(null);
    setStatus(null);
    setAccessToken(null);
    setAutoSelectMission(false);
    window.history.replaceState(null, "", "/goodbot");
    window.setTimeout(() => goalInputRef.current?.focus(), 0);
  }

  async function deleteMission(mission: MissionSummary) {
    if (!session) {
      setError("Sign in before deleting a mission.");
      return;
    }

    const confirmed = window.confirm(`Delete "${mission.goal}" and all generated GoodBot work for this mission? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingMissionId(mission.id);
    setError(null);

    const response = await fetch(`/api/goodbot/goals/${mission.id}`, {
      method: "DELETE",
      headers: buildApiHeaders(session, null)
    });
    const payload = await response.json().catch(() => ({}));
    setDeletingMissionId(null);

    if (!response.ok) {
      setError(payload.error || "GoodBot could not delete that mission.");
      return;
    }

    window.localStorage.removeItem(`goodbot:${mission.id}:access_token`);
    if (window.localStorage.getItem("goodbot:last_goal_id") === mission.id) {
      window.localStorage.removeItem("goodbot:last_goal_id");
    }

    if (goalId === mission.id) {
      setGoalId(null);
      setStatus(null);
      setAccessToken(null);
      setAutoSelectMission(false);
      window.history.replaceState(null, "", "/goodbot");
    }

    await loadMissions(session.access_token);
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
  const executionState = useMemo(() => deriveExecutionState(status, isSubmitting || Boolean(goalId && !status)), [goalId, isSubmitting, status]);
  const canUseGoodBot = authState === "signed_in" || Boolean(goalId && accessToken);
  const activeStep = status ? getActiveStep(status.steps) : null;
  const activeStepIndex = status && activeStep ? status.steps.findIndex((step) => step.id === activeStep.id) + 1 : null;
  const totalSteps = status?.steps.length ?? 0;
  const completedStepCount = completedSteps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedStepCount / totalSteps) * 100) : 0;
  const lastUpdatedLabel = lastUpdatedAt ? `${secondsAgo(lastUpdatedAt.toISOString(), clockTick)} seconds ago` : "not yet";
  const jobDebug = buildJobDebug(status, clockTick);
  const landingPageStep = status?.steps.find((step) => step.status === "completed" && step.step_type === "create_landing_page");
  const firstCompletedAction = landingPageStep
    ? { label: "Landing page created", url: status?.landing_page_url ?? null }
    : completedSteps[0]
      ? { label: completedSteps[0].output?.summary || completedSteps[0].title, url: null }
      : null;
  const rightPanel = status
    ? buildRightPanelState(status, activeStep, activeStepIndex)
    : { headline: "GoodBot gets to work.", detail: "Tell it the outcome. It will create the plan, queue the work, and bring you approvals only when needed." };
  const showExecutionBanner = executionState !== "idle" && (Boolean(status) || isSubmitting || Boolean(goalId && !status));
  const hasMissionInFlight = Boolean(goalId || status || isSubmitting);

  return (
    <main className={`goodbot-shell ${hasMissionInFlight ? "has-mission" : ""}`}>
      <TopBar session={session} authState={authState} onSignIn={() => setShowAuthForm(true)} onSignOut={signOut} />

      <section className={`goodbot-hero ${canUseGoodBot ? "with-intake" : ""} ${hasMissionInFlight ? "is-compact" : ""}`}>
        {!canUseGoodBot ? (
          <div className="goodbot-copy" aria-label="Want mailbox money? Then meet the Mailman. Mailbot.">
            <p className="type-line type-money" aria-hidden="true">Want Mailbox Money?</p>
            <div className="mailbot-reveal" aria-hidden="true">
              <p className="type-line type-mailman">
                Then Meet the <span className="mailman-word">Mailman.<span className="mailman-strike" /></span>
              </p>
              <div className="mailbot-final">
                <img className="hero-bot" src="/assets/good-business-robot.svg" alt="" />
              </div>
            </div>
            <button className="hero-signup-button" type="button" onClick={() => setShowAuthForm(true)}>
              Sign up
            </button>
          </div>
        ) : null}
        {canUseGoodBot && !hasMissionInFlight ? (
          <form onSubmit={submitGoal} className="goal-form hero-goal-form">
            <div className={`wish-bot ${executionState === "executing" ? "is-executing" : ""}`} aria-hidden="true">
              <span className="wish-bot-antenna" />
              <span className="wish-bot-face">
                <span className="wish-bot-eye left" />
                <span className="wish-bot-eye right" />
                <span className="wish-bot-smile" />
              </span>
            </div>
            <textarea
              ref={goalInputRef}
              id="goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="How can I help?"
              aria-label="GoodBot mission"
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Starting GoodBot…" : "Make it happen"}
            </button>
            {error ? <p className="error">{error}</p> : null}
          </form>
        ) : null}
        {canUseGoodBot && hasMissionInFlight ? (
          <div className="mission-bar">
            <div>
              <span>Current Mission</span>
              <p>{status?.goal.goal || goal || "GoodBot is starting..."}</p>
            </div>
            <button type="button" onClick={startNewMission}>
              New Mission
            </button>
          </div>
        ) : null}
      </section>

      {showExecutionBanner ? <ExecutionBanner state={executionState} lastUpdatedLabel={lastUpdatedLabel} /> : null}

      <AuthPanel
        authState={authState}
        email={authEmail}
        password={authPassword}
        visible={showAuthForm || authState === "signing_in"}
        onClose={() => setShowAuthForm(false)}
        onEmailChange={setAuthEmail}
        onPasswordChange={setAuthPassword}
        onSignIn={signIn}
      />
      {error && !canUseGoodBot ? <p className="auth-error error">{error}</p> : null}

      {canUseGoodBot && status ? <section className="workbench support-workbench" aria-label="GoodBot status">
        <div className="status-panel operator-panel">
          <div className="operator-heading-row">
            <div>
              <p className="status-label">{status ? "Next Move" : "What Happens Next"}</p>
              <h2>{rightPanel.headline}</h2>
            </div>
            <img src="/assets/good-business-robot.svg" alt="" className={`panel-bot ${executionState === "executing" ? "is-executing" : ""}`} />
          </div>
          <p className="operator-detail">{rightPanel.detail}</p>
          {status ? (
            <>
              <ProgressIndicator completed={completedStepCount} total={totalSteps} percent={progressPercent} />
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
              <p className="job-debug">Jobs processed: {jobDebug.processed} | Last job run: {jobDebug.lastRun}</p>
            </>
          ) : (
            <ol className="next-list">
              <li>Breaks the mission into executable steps.</li>
              <li>Creates the landing page and acquisition content.</li>
              <li>Queues the work and tracks visits and signups.</li>
              <li>Brings you approvals only when action is needed.</li>
            </ol>
          )}
          {firstCompletedAction ? <MagicMoment action={firstCompletedAction} onCopy={copyText} /> : null}
          {status?.landing_page_url ? (
            <button className="text-button" type="button" onClick={() => copyText(`${window.location.origin}${status.landing_page_url}`)}>
              Copy Landing Page Link
            </button>
          ) : null}
          {nextRecommendation ? <p className="operator-note">I found the best next move.</p> : null}
        </div>
      </section> : null}

      {status?.context && canUseGoodBot ? (
        <ContextPanel context={status.context} saving={contextSaving} onAction={contextAction} />
      ) : null}

      {authState === "signed_in" && (missionsLoading || missions.length > 0) ? (
        <MissionHistory
          missions={missions}
          selectedGoalId={goalId}
          missionsLoading={missionsLoading}
          onSelectMission={selectMission}
          onNewMission={startNewMission}
          onDeleteMission={deleteMission}
          deletingMissionId={deletingMissionId}
        />
      ) : null}

      {status && canUseGoodBot ? (
        <section className="operator-sections">
          <section>
            <p className="status-label">Autonomy</p>
            <AutonomyPanel
              status={status}
              onConnectLinkedIn={connectLinkedIn}
              onDisconnectLinkedIn={disconnectLinkedIn}
              onUpdate={updateGoalSettings}
            />
          </section>

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
                <StepRow key={step.id} step={step} />
              ))}
            </ol>
          </section>

          <section>
            <p className="status-label">Ready for Approval</p>
            {approvalAssets.length ? (
              <div className="approval-grid">
                {approvalAssets.map((asset) => (
                  <ApprovalCard key={asset.id} asset={asset} linkedin={status.integrations?.linkedin} onAction={assetAction} onCopy={copyText} />
                ))}
              </div>
            ) : (
              <p className="empty">I will notify you when something needs approval.</p>
            )}
          </section>

          <section>
            <p className="status-label">Ready to Distribute</p>
            {readyAssets.length ? (
              <div className="approval-grid">
                {readyAssets.map((asset) => (
                  <DistributionCard key={asset.id} asset={asset} linkedin={status.integrations?.linkedin} onAction={assetAction} onCopy={copyText} />
                ))}
              </div>
            ) : (
              <p className="empty">No assets approved yet.</p>
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
              <p className="empty">I need at least one distributed asset to measure results.</p>
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

function AutonomyPanel({
  status,
  onConnectLinkedIn,
  onDisconnectLinkedIn,
  onUpdate
}: {
  status: StatusResponse;
  onConnectLinkedIn: () => void;
  onDisconnectLinkedIn: () => void;
  onUpdate: (input: Record<string, unknown>) => void;
}) {
  const linkedinConnected = Boolean(status.integrations?.linkedin?.connected);
  const reconnectRequired = Boolean(status.integrations?.linkedin?.reconnect_required);
  const commentMonitoringAvailable = Boolean(status.integrations?.linkedin?.comment_monitoring_available);
  const autonomous = Boolean(status.goal.autonomous_mode);
  const autoPost = status.goal.auto_post_mode === "auto_post";
  const paused = status.goal.status === "paused" || Boolean(status.goal.paused_at);

  return (
    <div className="autonomy-panel">
      <div>
        <h3>{autonomous ? "Controlled autonomy is on" : "Controlled autonomy is off"}</h3>
        <p>
          {reconnectRequired
            ? `Reconnect LinkedIn${status.integrations?.linkedin?.reconnect_reason ? `: ${status.integrations.linkedin.reconnect_reason}` : " to keep posting."}`
            : linkedinConnected
            ? `LinkedIn connected${status.integrations?.linkedin?.account_name ? ` as ${status.integrations.linkedin.account_name}` : ""}.`
            : "Connect LinkedIn before GoodBot can publish approved posts."}
        </p>
        {linkedinConnected && !commentMonitoringAvailable ? (
          <p className="inline-warning">GoodBot can publish approved posts. Reading comments is not enabled for this LinkedIn app yet.</p>
        ) : null}
      </div>
      <div className="action-row">
        {!linkedinConnected || reconnectRequired ? (
          <button type="button" onClick={onConnectLinkedIn}>
            {reconnectRequired ? "Reconnect LinkedIn" : "Connect LinkedIn"}
          </button>
        ) : null}
        {linkedinConnected ? (
          <button type="button" onClick={onDisconnectLinkedIn}>
            Disconnect LinkedIn
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onUpdate({ autonomous_mode: !autonomous, auto_post_mode: !autonomous ? "auto_post" : "manual" })}
          disabled={(!linkedinConnected || reconnectRequired) && !autonomous}
        >
          {autonomous && autoPost ? "Turn off auto-post" : "Enable auto-post"}
        </button>
        <button type="button" onClick={() => onUpdate({ paused: !paused })}>
          {paused ? "Resume GoodBot" : "Pause GoodBot"}
        </button>
      </div>
    </div>
  );
}

function TopBar({
  session,
  authState,
  onSignIn,
  onSignOut
}: {
  session: Session | null;
  authState: string;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const email = session?.user.email ?? "";
  return (
    <header className="goodbot-topbar">
      <div className="topbar-brand">
        <p className="topbar-logo">GoodBot</p>
      </div>
      {authState === "signed_in" && email ? (
        <div className="topbar-account">
          <span className="avatar" aria-hidden="true">
            {initialsForEmail(email)}
          </span>
          <span className="account-email">{email}</span>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      ) : authState === "signed_out" ? (
        <button className="topbar-login" type="button" onClick={onSignIn}>
          Log in
        </button>
      ) : null}
    </header>
  );
}

function AuthPanel({
  authState,
  email,
  password,
  visible,
  onClose,
  onEmailChange,
  onPasswordChange,
  onSignIn,
}: {
  authState: "loading_session" | "signed_out" | "signing_in" | "signed_in";
  email: string;
  password: string;
  visible: boolean;
  onClose: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSignIn: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (authState === "loading_session") {
    return (
      <section className="auth-panel" aria-live="polite">
        <h2>Loading your GoodBot session...</h2>
      </section>
    );
  }

  if (authState === "signed_out" || authState === "signing_in") {
    if (!visible) return null;
    function closeFromBackdrop(event: MouseEvent<HTMLElement>) {
      if (event.target === event.currentTarget && authState !== "signing_in") {
        onClose();
      }
    }

    return (
      <section className="auth-modal-backdrop" role="presentation" onMouseDown={closeFromBackdrop}>
        <div className="auth-panel" role="dialog" aria-modal="true" aria-labelledby="goodbot-login-title">
          <button className="modal-close" type="button" onClick={onClose} disabled={authState === "signing_in"} aria-label="Close login">
            ×
          </button>
          <div>
            <h2 id="goodbot-login-title">Log in</h2>
            <p>Save your missions, assets, results, and next moves.</p>
          </div>
          <form className="auth-form" onSubmit={onSignIn}>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              minLength={6}
              required
            />
            <button type="submit" disabled={authState === "signing_in"}>
              {authState === "signing_in" ? "Signing in..." : "Sign in / create account"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return null;
}

function MissionHistory({
  missions,
  selectedGoalId,
  missionsLoading,
  onSelectMission,
  onNewMission,
  onDeleteMission,
  deletingMissionId
}: {
  missions: MissionSummary[];
  selectedGoalId: string | null;
  missionsLoading: boolean;
  onSelectMission: (mission: MissionSummary) => void;
  onNewMission: () => void;
  onDeleteMission: (mission: MissionSummary) => void;
  deletingMissionId: string | null;
}) {
  const groupedMissions = groupMissionsByProject(missions);

  return (
    <section className="mission-history" aria-label="My missions">
      <div className="missions-heading">
        <div>
          <h2>My Missions</h2>
          {!missionsLoading && missions.length === 0 ? <p>You haven’t created a mission yet.</p> : null}
        </div>
        <button type="button" onClick={onNewMission}>
          {missions.length ? "New Mission" : "Create your first mission"}
        </button>
      </div>
      {missionsLoading ? <p className="empty">Loading missions...</p> : null}
      {groupedMissions.length ? (
        <div className="project-groups">
          {groupedMissions.map((group) => (
            <section key={group.projectName} className="project-group">
              <h3>{group.projectName}</h3>
              <ol className="mission-list">
                {group.missions.map((mission) => (
                  <li key={mission.id} className="mission-item" data-active={mission.id === selectedGoalId}>
                    <button type="button" className="mission-select" onClick={() => onSelectMission(mission)}>
                      <span>{mission.goal}</span>
                      <small>
                        {mission.status} / {new Date(mission.created_at).toLocaleDateString()} / {mission.signups} of {mission.target_value} users
                        {mission.is_demo ? " / demo" : ""}
                      </small>
                    </button>
                    <button
                      type="button"
                      className="mission-delete"
                      onClick={() => onDeleteMission(mission)}
                      disabled={deletingMissionId === mission.id}
                    >
                      {deletingMissionId === mission.id ? "Deleting..." : "Delete"}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function groupMissionsByProject(missions: MissionSummary[]) {
  const groups = new Map<string, MissionSummary[]>();
  for (const mission of missions) {
    const projectName = mission.project_name?.trim() || "Untitled Project";
    groups.set(projectName, [...(groups.get(projectName) ?? []), mission]);
  }

  return Array.from(groups.entries()).map(([projectName, projectMissions]) => ({
    projectName,
    missions: projectMissions
  }));
}

function ContextPanel({
  context,
  saving,
  onAction
}: {
  context: GoodBotContextRecord;
  saving: boolean;
  onAction: (input: { action: "confirm" | "edit"; context?: Partial<GoodBotContext>; answers?: Record<string, string> }) => void;
}) {
  const extracted = context.extracted_json;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    product_name: extracted.product_name || "",
    audience: extracted.audience || "",
    value_prop: extracted.value_prop || "",
    features: extracted.features.join("\n"),
    differentiators: extracted.differentiators.join("\n"),
    tone: extracted.tone || ""
  });
  const [answers, setAnswers] = useState<Record<string, string>>(context.answers || {});

  useEffect(() => {
    setDraft({
      product_name: extracted.product_name || "",
      audience: extracted.audience || "",
      value_prop: extracted.value_prop || "",
      features: extracted.features.join("\n"),
      differentiators: extracted.differentiators.join("\n"),
      tone: extracted.tone || ""
    });
    setAnswers(context.answers || {});
  }, [context.id, context.created_at]);

  const draftContext = {
    product_name: draft.product_name || null,
    audience: draft.audience || null,
    value_prop: draft.value_prop || null,
    features: draft.features.split("\n").map((item) => item.trim()).filter(Boolean),
    differentiators: draft.differentiators.split("\n").map((item) => item.trim()).filter(Boolean),
    tone: draft.tone || null,
    confidence: extracted.confidence
  };

  return (
    <section className="context-panel">
      <div className="context-heading">
        <div>
          <p className="status-label">What I Understand</p>
          <h2>I looked at your {context.source_type === "website" ? "site" : "mission"}. Here’s what I understand:</h2>
        </div>
        <span data-status={context.status}>{context.status === "confirmed" ? "Confirmed" : "Needs confirmation"}</span>
      </div>

      {editing ? (
        <div className="context-edit-grid">
          <label>
            Product
            <input value={draft.product_name} onChange={(event) => setDraft({ ...draft, product_name: event.target.value })} />
          </label>
          <label>
            Who it’s for
            <input value={draft.audience} onChange={(event) => setDraft({ ...draft, audience: event.target.value })} />
          </label>
          <label className="wide">
            What it does / why it matters
            <textarea value={draft.value_prop} onChange={(event) => setDraft({ ...draft, value_prop: event.target.value })} />
          </label>
          <label>
            Features
            <textarea value={draft.features} onChange={(event) => setDraft({ ...draft, features: event.target.value })} />
          </label>
          <label>
            Differentiators
            <textarea value={draft.differentiators} onChange={(event) => setDraft({ ...draft, differentiators: event.target.value })} />
          </label>
        </div>
      ) : (
        <dl className="context-summary">
          <div>
            <dt>Product</dt>
            <dd>{extracted.product_name || "Unknown"}</dd>
          </div>
          <div>
            <dt>Who it’s for</dt>
            <dd>{extracted.audience || "Not clear yet"}</dd>
          </div>
          <div>
            <dt>What it does</dt>
            <dd>{extracted.value_prop || extracted.headline || "Not clear yet"}</dd>
          </div>
          <div>
            <dt>Why it matters</dt>
            <dd>{extracted.differentiators[0] || extracted.features[0] || "Needs your clarification"}</dd>
          </div>
        </dl>
      )}

      {context.status !== "confirmed" && context.questions.length ? (
        <div className="context-questions">
          {context.questions.map((question) => (
            <label key={question}>
              {question}
              <input value={answers[question] || ""} onChange={(event) => setAnswers({ ...answers, [question]: event.target.value })} />
            </label>
          ))}
        </div>
      ) : null}

      <div className="context-actions">
        {editing ? (
          <button type="button" onClick={() => {
            onAction({ action: "edit", context: draftContext, answers });
            setEditing(false);
          }} disabled={saving}>
            {saving ? "Saving..." : "Save edits"}
          </button>
        ) : (
          <button type="button" onClick={() => onAction({ action: "confirm", answers })} disabled={saving || context.status === "confirmed"}>
            {context.status === "confirmed" ? "Looks right" : saving ? "Confirming..." : "Looks right"}
          </button>
        )}
        <button type="button" onClick={() => setEditing(!editing)} disabled={saving}>
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>
    </section>
  );
}

function ExecutionBanner({ state, lastUpdatedLabel }: { state: ExecutionState; lastUpdatedLabel: string }) {
  return (
    <section className="execution-banner" data-state={state} aria-live="polite">
      <div>
        <strong>{executionStateMessage(state)}</strong>
        <span>Last updated {lastUpdatedLabel}</span>
      </div>
    </section>
  );
}

function ProgressIndicator({ completed, total, percent }: { completed: number; total: number; percent: number }) {
  return (
    <div className="progress-block" aria-label={`Step ${completed} of ${total} complete`}>
      <div className="progress-copy">
        <span>
          Step {completed} of {total} complete
        </span>
        <small>{percent}%</small>
      </div>
      <div className="progress-track">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function MagicMoment({
  action,
  onCopy
}: {
  action: { label: string; url: string | null };
  onCopy: (text: string) => void;
}) {
  const fullUrl = action.url && typeof window !== "undefined" ? `${window.location.origin}${action.url}` : null;
  return (
    <div className="magic-moment">
      <span>✅ {action.label}</span>
      {fullUrl ? (
        <button type="button" onClick={() => onCopy(fullUrl)}>
          Copy link
        </button>
      ) : null}
    </div>
  );
}

function StepRow({ step }: { step: Step }) {
  return (
    <li data-status={step.status}>
      <span className="step-line">
        <StepStatusIcon status={step.status} />
        <span>{step.title}</span>
      </span>
      <small>{step.output?.summary || step.status}</small>
    </li>
  );
}

function StepStatusIcon({ status }: { status: string }) {
  if (status === "completed") return <span className="step-icon" data-status={status} aria-label="completed">✓</span>;
  if (status === "failed") return <span className="step-icon" data-status={status} aria-label="failed">!</span>;
  if (status === "running") return <span className="step-icon" data-status={status} aria-label="running">⚙️</span>;
  return <span className="step-icon" data-status="pending" aria-label="pending">•</span>;
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
  linkedin,
  onAction,
  onCopy
}: {
  asset: ContentAsset;
  linkedin?: LinkedInIntegration;
  onAction: (asset: ContentAsset, action: "approve" | "reject" | "edit" | "mark_distributed" | "retry_auto_post") => void;
  onCopy: (text: string) => void;
}) {
  const body = asset.edited_body || asset.body;
  return (
    <article className="approval-card">
      <div className="asset-card-topline">
        <p>{assetLabel(asset.content_type)}</p>
        <AssetPostBadge asset={asset} linkedin={linkedin} />
      </div>
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
  linkedin,
  onAction,
  onCopy
}: {
  asset: ContentAsset;
  linkedin?: LinkedInIntegration;
  onAction: (asset: ContentAsset, action: "approve" | "reject" | "edit" | "mark_distributed" | "retry_auto_post") => void;
  onCopy: (text: string) => void;
}) {
  const body = asset.edited_body || asset.body;
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const link = asset.published_url ? `${origin}${asset.published_url}` : null;
  const copyText = link || body;
  const retryAvailable = canRetryAutoPost(asset, linkedin);
  const postError = retryAvailable
    ? "The last auto-post attempt failed before LinkedIn was fully connected. Retry now to queue it again."
    : assetPostError(asset);
  return (
    <article className="approval-card ready-card">
      <div className="asset-card-topline">
        <p>{assetLabel(asset.content_type)}</p>
        <AssetPostBadge asset={asset} linkedin={linkedin} />
      </div>
      <h3>{asset.title || "Untitled asset"}</h3>
      <pre>{copyText.slice(0, 420)}</pre>
      <small>{retryAvailable ? "GoodBot can retry this through LinkedIn auto-post." : distributionInstruction(asset)}</small>
      {asset.external_url ? (
        <a href={asset.external_url} target="_blank" rel="noreferrer">
          View LinkedIn post
        </a>
      ) : null}
      {asset.auto_post_status === "partially_posted" ? <small>Posted, URL unavailable.</small> : null}
      {postError ? <small className={retryAvailable ? "asset-retry-note" : "asset-error"}>{postError}</small> : null}
      <div className="action-row">
        <button type="button" onClick={() => onCopy(copyText)}>
          {asset.content_type === "blog_post" ? "Copy Link" : asset.content_type === "email_draft" ? "Copy Email" : "Copy Post"}
        </button>
        {retryAvailable ? (
          <button type="button" onClick={() => onAction(asset, "retry_auto_post")}>
            Retry auto-post
          </button>
        ) : null}
        <button type="button" onClick={() => onAction(asset, "mark_distributed")}>
          {asset.content_type === "blog_post" ? "Mark as Shared" : asset.content_type === "email_draft" ? "Mark as Sent" : "Mark as Posted"}
        </button>
      </div>
    </article>
  );
}

function AssetPostBadge({ asset, linkedin }: { asset: ContentAsset; linkedin?: LinkedInIntegration }) {
  const label = assetPostBadgeLabel(asset, linkedin);
  if (!label) return null;
  const state = asset.auto_post_status || (linkedin?.reconnect_required ? "reconnect_required" : linkedin?.connected === false ? "not_connected" : asset.distribution_status);
  return <span className="asset-post-badge" data-state={state}>{label}</span>;
}

function assetPostBadgeLabel(asset: ContentAsset, linkedin?: LinkedInIntegration) {
  if (asset.content_type !== "linkedin_post") return null;
  if (linkedin?.reconnect_required) return "Reconnect LinkedIn";
  if (linkedin?.connected === false) return "LinkedIn not connected";
  if (asset.auto_post_status === "queued") return "Queued for LinkedIn";
  if (asset.auto_post_status === "posting") return "Posting";
  if (asset.auto_post_status === "posted") return "Published";
  if (asset.auto_post_status === "partially_posted") return "Posted, URL unavailable";
  if (asset.auto_post_status === "failed") return "Failed";
  if (asset.auto_post_status === "reconnect_required") return "Reconnect LinkedIn";
  if (asset.approval_status === "approved" && asset.distribution_channel !== "linkedin_auto") return "Auto-post off";
  return null;
}

function canRetryAutoPost(asset: ContentAsset, linkedin?: LinkedInIntegration) {
  return (
    asset.content_type === "linkedin_post" &&
    asset.approval_status === "approved" &&
    asset.auto_post_status === "failed" &&
    Boolean(linkedin?.connected) &&
    !linkedin?.reconnect_required
  );
}

function assetPostError(asset: ContentAsset) {
  const error = asset.metadata?.linkedin_auto_post_error;
  return typeof error === "string" && error ? error : null;
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

function deriveExecutionState(status: StatusResponse | null, isStarting: boolean): ExecutionState {
  if (isStarting) return "executing";
  if (!status) return "idle";

  const hasActiveJob = status.jobs.some((job) => job.status === "pending" || job.status === "running");
  const hasRunningStep = status.steps.some((step) => step.status === "running");
  const hasPendingApproval = status.content_assets.some((asset) => asset.approval_status === "pending");
  const hasReadyDistribution = status.content_assets.some((asset) => asset.approval_status === "approved" && asset.distribution_status === "ready");
  const hasRecommendation = status.recommendations.some((recommendation) => ["pending", "approved", "running"].includes(recommendation.status));
  const hasDistribution = status.distribution_events.length > 0 || status.metrics.visits > 0 || status.metrics.signups > 0;

  if (hasActiveJob || hasRunningStep) return "executing";
  if (hasPendingApproval) return "waiting_for_approval";
  if (hasReadyDistribution) return "waiting_for_distribution";
  if (hasRecommendation) return "recommending";
  if (hasDistribution) return "measuring";
  return "idle";
}

function executionStateMessage(state: ExecutionState) {
  if (state === "executing") return "⚙️ GoodBot is executing your plan…";
  if (state === "waiting_for_approval") return "🟡 Waiting for your approval to continue.";
  if (state === "waiting_for_distribution") return "🟠 Waiting for distribution to measure results.";
  if (state === "measuring") return "📊 Measuring results from live traffic.";
  if (state === "recommending") return "🧠 Identifying the next best move.";
  return "GoodBot is ready for a mission.";
}

function getActiveStep(steps: Step[]) {
  return steps.find((step) => step.status === "running") ?? steps.find((step) => step.status === "pending") ?? null;
}

function buildRightPanelState(status: StatusResponse, activeStep: Step | null, activeStepIndex: number | null) {
  const total = status.steps.length;
  if (activeStep && activeStepIndex) {
    return {
      headline: `Executing step ${activeStepIndex} of ${total}`,
      detail: stepDetail(activeStep)
    };
  }

  const pendingApprovals = status.content_assets.filter((asset) => asset.approval_status === "pending").length;
  const readyAssets = status.content_assets.filter((asset) => asset.approval_status === "approved" && asset.distribution_status === "ready").length;
  const pendingRecommendation = status.recommendations.find((recommendation) => ["pending", "approved", "running"].includes(recommendation.status));

  if (pendingApprovals) {
    return {
      headline: "Preparing assets for approval",
      detail: `${pendingApprovals} asset${pendingApprovals === 1 ? "" : "s"} ready for your review.`
    };
  }

  if (readyAssets) {
    return {
      headline: "Waiting for distribution",
      detail: `${readyAssets} approved asset${readyAssets === 1 ? "" : "s"} need to be posted or shared before I can measure results.`
    };
  }

  if (pendingRecommendation) {
    return {
      headline: "Identifying the next best move",
      detail: pendingRecommendation.title
    };
  }

  if (status.distribution_events.length || status.metrics.visits || status.metrics.signups) {
    return {
      headline: "Measuring live traffic",
      detail: "Watching visits, signups, attribution, and variant performance."
    };
  }

  return {
    headline: "Watching the acquisition loop",
    detail: "No manual refresh needed. I will update this page when work moves."
  };
}

function stepDetail(step: Step) {
  if (step.step_type === "create_landing_page") return "Creating landing page";
  if (step.step_type === "generate_content") return "Generating content";
  if (step.step_type === "publish_content") return "Preparing assets for approval";
  if (step.step_type === "track_metrics") return "Activating tracking";
  return step.title;
}

function buildJobDebug(status: StatusResponse | null, tick: number) {
  void tick;
  if (!status || !status.jobs.length) return { processed: 0, lastRun: "not yet" };
  const lastJob = [...status.jobs].sort((a, b) => Date.parse(b.updated_at || b.created_at) - Date.parse(a.updated_at || a.created_at))[0];
  const processed = status.jobs.filter((job) => job.status === "completed").length;
  return {
    processed,
    lastRun: lastJob ? `${secondsAgo(lastJob.updated_at || lastJob.created_at, tick)}s ago` : "not yet"
  };
}

function secondsAgo(value: string, tick: number) {
  void tick;
  const elapsed = Math.max(0, Math.floor((Date.now() - Date.parse(value)) / 1000));
  return elapsed;
}

function buildApiHeaders(session: Session | null, accessToken?: string | null, extra?: HeadersInit) {
  const headers = new Headers(extra);
  if (session?.access_token) headers.set("Authorization", `Bearer ${session.access_token}`);
  if (accessToken) headers.set("x-goodbot-access-token", accessToken);
  return headers;
}

function initialsForEmail(email: string) {
  const localPart = email.split("@")[0] || "GB";
  const pieces = localPart.split(/[._+-]/).filter(Boolean);
  const initials = pieces.length > 1 ? `${pieces[0][0]}${pieces[1][0]}` : localPart.slice(0, 2);
  return initials.toUpperCase();
}
