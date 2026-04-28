"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>("");

  const disabled = status === "sending" || status === "sent";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;

    const form = e.currentTarget;
    const hp = (form.elements.namedItem("hp") as HTMLInputElement | null)?.value;

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hp }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        alreadySubscribed?: boolean;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setStatus("sent");
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list."
          : "You're on the list — check your inbox.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
        aria-label="Newsletter signup"
        noValidate
      >
        {/* Honeypot — hidden from real users, catches naive bots */}
        <input
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="you@email.com"
          aria-label="Email address"
          required
          disabled={disabled}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/[0.06] border border-[var(--color-hairline)] rounded-full px-4 py-2.5 text-ink text-[13px] outline-none focus-visible:border-pink disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled}
          className="chonk-btn chonk-btn-primary chonk-btn-sm"
          aria-label={
            status === "sent"
              ? "Subscribed"
              : status === "sending"
                ? "Subscribing"
                : "Subscribe"
          }
        >
          {status === "sent" ? "✓" : status === "sending" ? "…" : "→"}
        </button>
      </form>
      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-2 text-[12px] ${status === "error" ? "text-pink" : "text-muted"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
