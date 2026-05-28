"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { FLAVOUR_OPTIONS } from "@/lib/launchVoteOptions";

export type DropRaceVoteTarget = {
  id: string;
  name: string;
  suburb: string;
  kind: "gym" | "suburb";
} | null;

export type DropRaceVoteModalProps = {
  open: boolean;
  target: DropRaceVoteTarget;
  onClose: () => void;
  onSubmitted: (target: DropRaceVoteTarget) => void;
};

type Status = "idle" | "sending" | "sent" | "error";

export default function DropRaceVoteModal({
  open,
  target,
  onClose,
  onSubmitted,
}: DropRaceVoteModalProps) {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [flavour, setFlavour] = useState<string>(FLAVOUR_OPTIONS[0]);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setError("");
      setFlavour(FLAVOUR_OPTIONS[0]);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/launch-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone") ?? "",
          suburb: fd.get("suburb"),
          gym: fd.get("gym"),
          flavour: fd.get("flavour"),
          firstDrop: fd.get("firstDrop") === "on",
          consent: true,
          hp: fd.get("hp"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error ?? "Could not lock your vote. Try again.");
        return;
      }
      setStatus("sent");
      onSubmitted(target);
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  }

  const headline = target
    ? `Locking your vote for ${target.name}`
    : "Lock your vote";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 20, 28, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        // Backdrop click closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--color-milk)",
          borderRadius: 18,
          padding: "20px 24px",
          width: "min(540px, 92vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <div>
            <div
              className="text-eyebrow"
              style={{ color: "var(--color-muted)" }}
            >
              {target ? "Locking your vote" : "First-drop list"}
            </div>
            <h2
              id={`${formId}-title`}
              style={{ margin: "6px 0 0", fontSize: 22 }}
            >
              {headline}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "var(--color-muted)",
            }}
          >
            ×
          </button>
        </div>

        {status === "sent" ? (
          <div style={{ padding: "20px 0" }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 22,
                color: "var(--color-pink)",
              }}
            >
              VOTE LOCKED
            </div>
            <p style={{ marginTop: 12, color: "var(--color-ink)" }}>
              Done. You&apos;re on the Chonk first-drop list.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="chonk-btn chonk-btn-outline"
              style={{ marginTop: 16 }}
            >
              Back to the map
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: 12 }}
            aria-label="Drop Race vote form"
          >
            <input
              type="text"
              name="hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -9999,
                width: 1,
                height: 1,
                opacity: 0,
              }}
            />

            <label
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-muted)" }}
              >
                First name *
              </span>
              <input
                name="name"
                type="text"
                required
                placeholder="First name"
                disabled={status === "sending"}
              />
            </label>

            <label
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-muted)" }}
              >
                Email *
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                disabled={status === "sending"}
              />
            </label>

            <label
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-muted)" }}
              >
                Phone (optional)
              </span>
              <input
                name="phone"
                type="tel"
                placeholder="04XX XXX XXX"
                disabled={status === "sending"}
              />
            </label>

            <label
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-muted)" }}
              >
                Suburb *
              </span>
              <input
                name="suburb"
                type="text"
                required
                defaultValue={target?.suburb ?? ""}
                placeholder="Scarborough"
                disabled={status === "sending"}
              />
            </label>

            <label
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-muted)" }}
              >
                Gym *
              </span>
              <input
                name="gym"
                type="text"
                required
                defaultValue={target?.kind === "gym" ? target.name : ""}
                placeholder="Revo Scarborough, F45, home gym…"
                disabled={status === "sending"}
              />
            </label>

            <fieldset
              style={{
                border: "1px solid var(--color-hairline)",
                borderRadius: 12,
                padding: "10px 12px",
                margin: 0,
                display: "grid",
                gap: 6,
              }}
            >
              <legend
                className="text-eyebrow"
                style={{ color: "var(--color-muted)", padding: "0 6px" }}
              >
                Flavour you&apos;d buy first *
              </legend>
              {FLAVOUR_OPTIONS.map((f) => (
                <label
                  key={f}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="radio"
                    name="flavour"
                    value={f}
                    checked={flavour === f}
                    onChange={() => setFlavour(f)}
                    required
                  />
                  <span>{f}</span>
                </label>
              ))}
            </fieldset>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="firstDrop" />
              <span style={{ fontSize: 14 }}>
                Want first-drop access (priority shipment)
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="chonk-btn chonk-btn-primary chonk-btn-lg"
              style={{ background: "var(--color-pink)", color: "white" }}
            >
              {status === "sending" ? "Locking…" : "Submit My Vote"}
            </button>

            {error && (
              <p
                role="status"
                aria-live="polite"
                style={{ color: "var(--color-pink)", fontSize: 13 }}
              >
                {error}
              </p>
            )}

            <p style={{ fontSize: 11, color: "var(--color-muted)" }}>
              We&apos;ll only use your details for launch updates. Unsubscribe
              anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
