"use client";

import { useEffect } from "react";

export default function LandingTracker({ goalId, variantId }: { goalId: string; variantId: string | null }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    fetch("/api/goodbot/metrics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal_id: goalId,
        path: window.location.pathname,
        utm_source: params.get("utm_source") || undefined,
        utm_medium: params.get("utm_medium") || undefined,
        utm_campaign: params.get("utm_campaign") || undefined,
        utm_content: params.get("utm_content") || undefined,
        distribution_event_id: params.get("distribution_event_id") || undefined,
        content_asset_id: params.get("content_asset_id") || params.get("utm_content") || undefined,
        landing_page_variant_id: params.get("landing_page_variant_id") || variantId || undefined
      })
    }).catch(() => undefined);
  }, [goalId, variantId]);

  return null;
}
