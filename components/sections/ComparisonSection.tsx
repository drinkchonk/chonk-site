"use client";

import { useEffect, useRef, useState } from "react";

type Bar = {
  label: string;
  sub?: string;
  grams: number;
  highlight?: boolean;
  ceiling?: boolean;
};

/**
 * Protein gap chart — horizontal bar reveal, scroll-triggered.
 *
 * Category labels are deliberately generic (no competitor names) per the
 * positioning doc: the numbers do the work, we don't attack operators by
 * name. The chonk. bar visually extends past the "retail ceiling" marker
 * to make the +43% gap land without having to spell it out twice.
 */
const bars: Bar[] = [
  {
    label: "Supermarket breakfast drink",
    sub: "mass-market default",
    grams: 12,
  },
  {
    label: "Category-average protein RTD",
    sub: "what's in the fridge",
    grams: 29,
  },
  {
    label: "Fresh-made smoothie ceiling",
    sub: "national chain top-end",
    grams: 33,
  },
  {
    label: "Premium supermarket RTD",
    sub: "the retail ceiling",
    grams: 35,
    ceiling: true,
  },
  {
    label: "chonk.",
    sub: "whey-forward, made to order",
    grams: 50,
    highlight: true,
  },
];

const MAX = 55; // visual axis — leaves chonk breathing room past 50

export default function ComparisonSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [animate, setAnimate] = useState(false);
  const [displayGrams, setDisplayGrams] = useState<number[]>(
    () => bars.map(() => 0)
  );

  // Trigger the reveal once the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setAnimate(true);
      setDisplayGrams(bars.map((b) => b.grams));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // rAF-driven count-up, staggered per bar.
  useEffect(() => {
    if (!animate) return;
    const duration = 1200; // ms per bar
    const stagger = 140; // ms between bars
    let rafId: number | null = null;

    const starts = bars.map((_, i) => performance.now() + i * stagger);

    const tick = (now: number) => {
      const next = bars.map((b, i) => {
        const t = Math.max(0, Math.min(1, (now - starts[i]) / duration));
        const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
        return Math.round(b.grams * eased);
      });
      setDisplayGrams(next);

      const allDone = bars.every((b, i) => next[i] === b.grams);
      if (!allDone) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [animate]);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--color-milk)",
        paddingBlock: 128,
      }}
      aria-label="How chonk. compares on protein"
    >
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] items-start">
          {/* LEFT — copy */}
          <div>
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              The gap
            </span>
            <h2 className="text-section mt-3">
              No one&apos;s in our
              <br />
              <span style={{ color: "var(--color-pink)" }}>weight class.</span>
            </h2>
            <p
              className="text-pretty leading-[1.65] mt-5 max-w-[440px]"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              We built a chonk around whey isolate — the gold-standard protein
              for muscle recovery and synthesis. Then we stacked it at 50g per
              cup. That&apos;s +43% above the best supermarket protein drink
              and +72% above the nearest fresh-made smoothie.
            </p>
            <p
              className="text-pretty leading-[1.65] mt-4 max-w-[440px]"
              style={{ color: "var(--color-muted)", fontSize: 15 }}
            >
              Not a gimmick. A recipe fact. You do the maths.
            </p>
          </div>

          {/* RIGHT — chart */}
          <div
            style={{
              background: "var(--color-cream)",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-card-lg)",
              padding: "28px clamp(20px, 3vw, 36px)",
            }}
          >
            <div
              className="text-eyebrow mb-6"
              style={{ color: "var(--color-muted)" }}
            >
              Protein per serve · grams
            </div>

            <div className="flex flex-col gap-5">
              {bars.map((bar, i) => {
                const widthPct = animate ? (bar.grams / MAX) * 100 : 0;
                const accent = bar.highlight
                  ? "var(--color-pink)"
                  : "rgba(254, 246, 236, 0.22)";
                const labelColor = bar.highlight
                  ? "var(--color-ink)"
                  : "var(--color-muted)";
                const gramsColor = bar.highlight
                  ? "var(--color-pink)"
                  : "var(--color-ink)";

                return (
                  <div key={bar.label} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <div
                        className="font-body"
                        style={{
                          color: labelColor,
                          fontSize: bar.highlight ? 16 : 14,
                          fontWeight: bar.highlight ? 700 : 500,
                          letterSpacing: bar.highlight ? "-0.01em" : 0,
                        }}
                      >
                        {bar.label}
                        {bar.sub && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 12,
                              color: "var(--color-muted)",
                              fontWeight: 500,
                              letterSpacing: "0.02em",
                            }}
                          >
                            · {bar.sub}
                          </span>
                        )}
                      </div>
                      <div
                        className="font-display"
                        style={{
                          fontWeight: 900,
                          fontVariationSettings: '"SOFT" 100, "WONK" 1',
                          fontSize: bar.highlight ? 32 : 22,
                          letterSpacing: "-0.02em",
                          color: gramsColor,
                          lineHeight: 1,
                        }}
                      >
                        {displayGrams[i]}
                        <span
                          style={{
                            fontSize: "0.45em",
                            marginLeft: 2,
                            color: bar.highlight
                              ? "var(--color-ink)"
                              : "var(--color-muted)",
                          }}
                        >
                          g
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        position: "relative",
                        height: bar.highlight ? 18 : 12,
                        borderRadius: 999,
                        background: "rgba(254, 246, 236, 0.05)",
                        overflow: "visible",
                      }}
                    >
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: "0 auto 0 0",
                          width: `${widthPct}%`,
                          borderRadius: 999,
                          background: bar.highlight
                            ? "linear-gradient(90deg, var(--color-pink), #ffbce6)"
                            : accent,
                          transition:
                            "width 1100ms cubic-bezier(.2, .75, .25, 1)",
                          boxShadow: bar.highlight
                            ? "0 0 0 2px rgba(255,216,243,0.12)"
                            : "none",
                        }}
                      />
                      {bar.ceiling && (
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            top: -6,
                            bottom: -6,
                            left: `${(35 / MAX) * 100}%`,
                            width: 2,
                            background: "rgba(254, 246, 236, 0.35)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-7 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{ borderTop: "1px solid var(--color-hairline)" }}
            >
              <div
                className="text-eyebrow"
                style={{ color: "var(--color-proof-fg)" }}
              >
                50 grams closer.
              </div>
              <div
                className="text-[13px]"
                style={{ color: "var(--color-muted)" }}
              >
                Figures represent category ceilings and averages across
                Australian retail and fresh-made options.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
