"use client";

import { useEffect } from "react";

export default function LandingTracker({ goalId }: { goalId: string }) {
  useEffect(() => {
    fetch("/api/goodbot/metrics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal_id: goalId, path: window.location.pathname })
    }).catch(() => undefined);
  }, [goalId]);

  return null;
}
