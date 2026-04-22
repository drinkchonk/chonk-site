"use client";

import Link from "next/link";
import { useState } from "react";

type Status = "idle" | "sending" | "sent";

export default function WholesaleForm() {
  const [status, setStatus] = useState<Status>("idle");

  return (
    <form
      className="flex flex-col gap-4"
      style={{
        padding: 28,
        borderRadius: "var(--radius-card-lg)",
        background: "var(--color-cream)",
        border: "1px solid var(--color-hairline)",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sending");
        setTimeout(() => setStatus("sent"), 600);
      }}
    >
      <label className="flex flex-col gap-2">
        <span
          className="text-eyebrow"
          style={{ color: "var(--color-muted)" }}
        >
          Your name
        </span>
        <input
          type="text"
          name="name"
          required
          className="font-body"
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid var(--color-hairline)",
            background: "var(--color-milk)",
            color: "var(--color-ink)",
            fontSize: 15,
          }}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span
          className="text-eyebrow"
          style={{ color: "var(--color-muted)" }}
        >
          Venue
        </span>
        <input
          type="text"
          name="venue"
          required
          className="font-body"
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid var(--color-hairline)",
            background: "var(--color-milk)",
            color: "var(--color-ink)",
            fontSize: 15,
          }}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span
          className="text-eyebrow"
          style={{ color: "var(--color-muted)" }}
        >
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          className="font-body"
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid var(--color-hairline)",
            background: "var(--color-milk)",
            color: "var(--color-ink)",
            fontSize: 15,
          }}
        />
      </label>
      <button
        type="submit"
        disabled={status !== "idle"}
        className="chonk-btn chonk-btn-primary chonk-btn-lg self-start mt-2"
      >
        {status === "sent"
          ? "Sent — we'll be in touch"
          : status === "sending"
            ? "Sending…"
            : "Send enquiry"}
      </button>
      <p className="text-[12px]" style={{ color: "var(--color-muted)" }}>
        Or email{" "}
        <Link
          href="mailto:hello@chonkshakes.com.au"
          style={{ color: "var(--color-pink)" }}
        >
          hello@chonkshakes.com.au
        </Link>{" "}
        directly.
      </p>
    </form>
  );
}
