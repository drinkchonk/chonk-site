"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const purchaseOptions = [
  "After training",
  "Before training",
  "Lunch",
  "Afternoon snack",
  "Weekend treat",
  "At markets/events",
];

const flavourOptions = [
  "Peanut Butter Chonk",
  "Strawberry Cheesecake",
  "Choc Banana",
  "Vanilla Biscoff-style",
  "Mango Cream",
  "Coffee Protein",
  "Other",
];

const priceOptions = ["$10-$11", "$12-$13", "$14-$15", "$16+"];

const earlyAccessOptions = ["Yes, text me", "Maybe, email me", "No, just voting"];

const inputClassName =
  "w-full rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-cream)] px-4 py-3 text-[15px] text-ink outline-none transition focus-visible:border-[var(--color-proof-fg)] disabled:opacity-60";

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <span className="text-eyebrow" style={{ color: "var(--color-muted)" }}>
      {label}
      {required ? " *" : ""}
    </span>
  );
}

function RadioGroup({
  legend,
  name,
  options,
}: {
  legend: string;
  name: string;
  options: string[];
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend>
        <FieldLabel label={legend} required />
      </legend>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex min-h-[54px] items-center gap-3 rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-cream)] px-4 py-3 text-sm font-semibold text-ink transition hover:border-[var(--color-hairline-strong)]"
          >
            <input
              type="radio"
              name={name}
              value={option}
              required
              className="h-4 w-4 accent-[var(--color-proof-fg)]"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function LaunchVoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const disabled = status === "sending";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/launch-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          gym: formData.get("gym"),
          suburb: formData.get("suburb"),
          purchaseMoment: formData.get("purchaseMoment"),
          flavour: formData.get("flavour"),
          fairPrice: formData.get("fairPrice"),
          earlyAccess: formData.get("earlyAccess"),
          consent: formData.get("consent") === "on",
          notes: formData.get("notes"),
          hp: formData.get("hp"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not submit your vote. Try again.");
        return;
      }

      form.reset();
      setStatus("sent");
      setMessage("Vote locked in. Founding voters hear first.");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 grid gap-6 rounded-[24px] border border-[var(--color-hairline)] bg-[var(--color-milk)] p-5 shadow-sm sm:p-7 lg:p-9"
      aria-label="Where should Chonk launch first?"
    >
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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <FieldLabel label="First name" required />
          <input
            type="text"
            name="firstName"
            required
            disabled={disabled}
            autoComplete="given-name"
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-2">
          <FieldLabel label="Phone number" required />
          <input
            type="tel"
            name="phone"
            required
            disabled={disabled}
            autoComplete="tel"
            className={inputClassName}
          />
          <span className="text-xs leading-[1.4] text-muted">
            Used for first-drop launch updates only. You can opt out anytime.
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <FieldLabel label="Email" />
          <input
            type="email"
            name="email"
            disabled={disabled}
            autoComplete="email"
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel label="Which gym do you train at most?" required />
          <input
            type="text"
            name="gym"
            required
            disabled={disabled}
            placeholder="Revo Scarborough, Club Lime, Plus Fitness, private gym, home gym, etc."
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <FieldLabel label="Which suburb should Chonk launch in first?" required />
          <input
            type="text"
            name="suburb"
            required
            disabled={disabled}
            className={inputClassName}
          />
        </label>
      </div>

      <RadioGroup
        legend="When would you most likely buy a Chonk shake?"
        name="purchaseMoment"
        options={purchaseOptions}
      />

      <RadioGroup
        legend="Which flavour should drop first?"
        name="flavour"
        options={flavourOptions}
      />

      <RadioGroup
        legend="What price feels fair for a thick high-protein smoothie?"
        name="fairPrice"
        options={priceOptions}
      />

      <RadioGroup
        legend="Would you want early access to the first Chonk drop?"
        name="earlyAccess"
        options={earlyAccessOptions}
      />

      <label className="flex items-start gap-3 rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-cream)] p-4 text-sm leading-[1.5]">
        <input
          type="checkbox"
          name="consent"
          required
          disabled={disabled}
          className="mt-1 h-4 w-4 flex-none accent-[var(--color-proof-fg)]"
        />
        <span>
          I agree to receive Chonk launch updates and marketing messages. I
          understand I can unsubscribe at any time.
        </span>
      </label>

      <label className="flex flex-col gap-2">
        <FieldLabel label="Anything you want Chonk to know?" />
        <textarea
          name="notes"
          rows={4}
          disabled={disabled}
          className={`${inputClassName} resize-y`}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={disabled}
          className="chonk-btn chonk-btn-primary chonk-btn-lg self-start"
        >
          {status === "sending" ? "Submitting..." : "Submit vote"}
        </button>
        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${status === "error" ? "text-pink" : "text-muted"}`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
