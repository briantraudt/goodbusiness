"use client";

import { FormEvent, useState } from "react";

export default function SignupForm({ goalId, cta, variantId }: { goalId: string; cta: string; variantId: string | null }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const params = new URLSearchParams(window.location.search);
    const response = await fetch("/api/goodbot/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal_id: goalId,
        email,
        name,
        utm_source: params.get("utm_source") || undefined,
        utm_medium: params.get("utm_medium") || undefined,
        utm_campaign: params.get("utm_campaign") || undefined,
        utm_content: params.get("utm_content") || undefined,
        distribution_event_id: params.get("distribution_event_id") || undefined,
        content_asset_id: params.get("content_asset_id") || params.get("utm_content") || undefined,
        landing_page_variant_id: params.get("landing_page_variant_id") || variantId || undefined
      })
    });

    if (!response.ok) {
      setError("That signup did not go through.");
      return;
    }
    setDone(true);
  }

  if (done) return <p className="signup-done">You are on the list.</p>;

  return (
    <form className="signup-form" onSubmit={submit}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
      <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" required />
      <button>{cta}</button>
      {error ? <small>{error}</small> : null}
    </form>
  );
}
