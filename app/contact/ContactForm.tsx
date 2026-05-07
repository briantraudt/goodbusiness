"use client";

import { FormEvent, useState } from "react";

const budgets = [
  "Under $10k",
  "$10k - $25k",
  "$25k - $50k",
  "$50k+",
  "Not sure yet"
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error || "Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    form.reset();
    setStatus("sent");
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="field-row">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        Company
        <input name="company" autoComplete="organization" required />
      </label>
      <label>
        What are you trying to build?
        <textarea name="project" rows={5} required />
      </label>
      <label>
        Biggest bottleneck
        <textarea name="bottleneck" rows={4} required />
      </label>
      <label>
        Budget range
        <select name="budget" required defaultValue="">
          <option value="" disabled>
            Select a range
          </option>
          {budgets.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
      </label>
      <button className="button button-dark" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Book Strategy Call"}
      </button>
      {status === "sent" ? <p className="form-note">Thanks. We got it and will follow up soon.</p> : null}
      {status === "error" ? <p className="form-note form-error">{error}</p> : null}
    </form>
  );
}
