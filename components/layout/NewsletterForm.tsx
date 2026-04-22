"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex gap-2"
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        placeholder="you@email.com"
        aria-label="Email address"
        required
        disabled={sent}
        className="flex-1 bg-white/[0.06] border border-[var(--color-hairline)] rounded-full px-4 py-2.5 text-ink text-[13px] outline-none focus-visible:border-pink"
      />
      <button
        type="submit"
        disabled={sent}
        className="chonk-btn chonk-btn-primary chonk-btn-sm"
        aria-label={sent ? "Subscribed" : "Subscribe"}
      >
        {sent ? "✓" : "→"}
      </button>
    </form>
  );
}
