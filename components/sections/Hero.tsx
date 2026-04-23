"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const beats = [
  { big: "50g", small: "whey-forward protein" },
  { big: "Real food.", small: "No fillers." },
  { big: "No added sugar.", small: "Ever." },
  { big: "Launching soon.", small: "In Perth." },
];

export default function Hero() {
  const [beat, setBeat] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", onChange);
    if (mq.matches) return () => mq.removeEventListener("change", onChange);
    const t = setInterval(() => setBeat((b) => (b + 1) % beats.length), 3400);
    return () => {
      clearInterval(t);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const activeBeat = beats[beat];

  return (
    <section className="relative overflow-hidden" aria-label="Hero">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14 items-center py-16 lg:pt-[72px] lg:pb-24">
          {/* LEFT — copy + CTAs */}
          <div className="flex flex-col gap-7">
            <div className="eyebrow-dot text-eyebrow">
              <span style={{ color: "var(--color-proof-fg)" }}>
                Launching soon in Perth
              </span>
            </div>

            <h1 className="text-hero text-ink">50 grams closer.</h1>

            <p className="text-pretty text-muted text-lg leading-[1.55] max-w-[540px]">
              The high-protein smoothie for people chasing something — a goal,
              a feeling, a physique, a lifestyle. Whey-forward, real food, zero
              compromise on taste.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/#newsletter"
                className="chonk-btn chonk-btn-primary chonk-btn-lg"
              >
                Get on the list
              </Link>
              <Link
                href="/menu"
                className="chonk-btn chonk-btn-outline chonk-btn-lg"
              >
                See the menu
              </Link>
            </div>

            <div className="flex gap-2.5 flex-wrap mt-2">
              <span className="proof-pill">50g Whey Isolate</span>
              <span className="proof-pill">No Added Sugar</span>
              <span className="proof-pill">Real Fruit</span>
              <span className="proof-pill">Made to Order</span>
            </div>
          </div>

          {/* RIGHT — 3D cup iframe + floating stats */}
          <div
            className="relative mx-auto w-full"
            style={{ aspectRatio: "4 / 5", maxWidth: 560 }}
          >
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ borderRadius: 24, background: "#000000" }}
            >
              <iframe
                src="/chonk-hero.html"
                title="chonk. 3D cup, rotating"
                className="absolute inset-0 w-full h-full border-0"
                loading="eager"
                scrolling="no"
                aria-hidden="true"
              />
            </div>

            {/* Rotating beat pill — top-right */}
            <div
              className="absolute whitespace-nowrap overflow-hidden"
              style={{
                top: "8%",
                right: "-8%",
                background: "var(--color-pink)",
                color: "#1A1614",
                padding: "14px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"SOFT" 100, "WONK" 1',
                fontWeight: 900,
                fontSize: 16,
                boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
                transform: "rotate(-6deg)",
                maxWidth: "min(80vw, 460px)",
                transition: prefersReduced ? undefined : "opacity 300ms ease",
              }}
              aria-live="polite"
            >
              {activeBeat.big}{" "}
              <span
                className="font-body"
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  marginLeft: 6,
                  opacity: 0.7,
                }}
              >
                · {activeBeat.small}
              </span>
            </div>

            {/* Made-fresh circle — mid-left */}
            <div
              className="absolute text-center uppercase"
              style={{
                top: "45%",
                left: "-4%",
                background: "var(--color-proof)",
                color: "#E8F4EA",
                width: 92,
                height: 92,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"SOFT" 100, "WONK" 1',
                fontWeight: 900,
                fontSize: 12,
                lineHeight: 1.1,
                letterSpacing: "0.05em",
                transform: "rotate(-14deg)",
                padding: 8,
                boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
              }}
            >
              Made fresh.
              <br />
              To order.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
