"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Step = {
  id: string;
  title: string;
  step_type: string;
  status: string;
  output?: { summary?: string } | null;
};

type StatusResponse = {
  goal: { goal: string; target_value: number; status: string };
  steps: Step[];
  notifications: { id: string; message: string; created_at: string }[];
  metrics: { visits: number; signups: number };
  landing_page_url: string | null;
};

export default function GoodBotClient() {
  const [goal, setGoal] = useState("Get 50 users for my app");
  const [appName, setAppName] = useState("");
  const [audience, setAudience] = useState("");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!goalId) return;
    let cancelled = false;

    async function loadStatus() {
      const response = await fetch(`/api/goodbot/status/${goalId}`);
      if (!response.ok || cancelled) return;
      setStatus(await response.json());
    }

    loadStatus();
    const interval = window.setInterval(loadStatus, 3500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [goalId]);

  const workingCopy = useMemo(() => {
    if (!status) return "Tell GoodBot the outcome. It will build the first acquisition loop.";
    const completed = status.steps.filter((step) => step.status === "completed").length;
    if (status.goal.status === "completed") return "Goal completed.";
    if (completed === status.steps.length) return "Working. The loop is live and GoodBot is watching for progress.";
    return `Working. ${completed} of ${status.steps.length} actions complete.`;
  }, [status]);

  async function submitGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    setGoalId(null);

    const response = await fetch("/api/goodbot/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal,
        app_name: appName || undefined,
        audience: audience || undefined
      })
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error || "GoodBot could not start.");
      return;
    }

    setGoalId(payload.goal_id);
  }

  return (
    <main className="goodbot-shell">
      <section className="goodbot-hero">
        <div className="goodbot-copy">
          <p className="eyebrow">Good Business / GoodBot</p>
          <h1>Autonomous Outcome Engine</h1>
          <p className="subcopy">
            One goal goes in. GoodBot creates the acquisition page, generates content, publishes the hosted pieces, captures email, and keeps adjusting every 24 hours.
          </p>
        </div>
        <img src="/assets/good-business-robot.svg" alt="" className="bot" />
      </section>

      <section className="workbench" aria-label="GoodBot goal intake">
        <form onSubmit={submitGoal} className="goal-form">
          <label htmlFor="goal">What do you want to achieve?</label>
          <textarea id="goal" value={goal} onChange={(event) => setGoal(event.target.value)} />
          <div className="field-row">
            <input value={appName} onChange={(event) => setAppName(event.target.value)} placeholder="App name" />
            <input value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Audience" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Starting..." : "Start GoodBot"}
          </button>
          {error ? <p className="error">{error}</p> : null}
        </form>

        <div className="status-panel">
          <p className="status-label">Status</p>
          <h2>{workingCopy}</h2>
          {status ? (
            <>
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
              <ol className="steps">
                {status.steps.map((step) => (
                  <li key={step.id} data-status={step.status}>
                    <span>{step.title}</span>
                    <small>{step.output?.summary || step.status}</small>
                  </li>
                ))}
              </ol>
              {status.notifications[0] ? <p className="notification">{status.notifications[0].message}</p> : null}
              {status.landing_page_url ? (
                <a className="landing-link" href={status.landing_page_url}>
                  Open generated landing page
                </a>
              ) : null}
            </>
          ) : (
            <p className="empty">No dashboard. No task board. Just the loop starting when you press the button.</p>
          )}
        </div>
      </section>
    </main>
  );
}
