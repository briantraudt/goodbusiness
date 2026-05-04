"use client";

import { FormEvent, useState } from "react";

export default function SignupForm({ goalId, cta }: { goalId: string; cta: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/goodbot/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal_id: goalId, email, name })
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
