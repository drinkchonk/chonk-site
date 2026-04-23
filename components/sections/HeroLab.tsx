"use client";

import { useEffect, useRef } from "react";

export function HeroLab() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);
  const creamFadeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    let lastProgress = -1;

    const tick = () => {
      const section = sectionRef.current;
      const iframe = iframeRef.current;
      const title = titleRef.current;
      const cue = scrollCueRef.current;
      const creamFade = creamFadeRef.current;
      if (section && iframe && iframe.contentWindow) {
        const rect = section.getBoundingClientRect();
        const travel = section.offsetHeight - window.innerHeight;
        const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
        if (Math.abs(progress - lastProgress) > 0.0005) {
          // Cap iframe progress at 0.78 so the user's 100% scroll lands
          // on the tunnel-black moment (the helix reveal is disabled;
          // from there the cream overlay takes over to bleed the scene
          // into the cream next-section below — "end of the straw"
          // opens into the shake, reading as white/cream.
          const iframeProgress = Math.min(0.78, progress * 0.78);
          iframe.contentWindow.postMessage(
            { type: "chonk-lab-scroll", progress: iframeProgress },
            "*"
          );
          const fade =
            1 -
            Math.max(0, Math.min(1, (progress - 0.03) / (0.18 - 0.03)));
          if (title) title.style.opacity = String(fade);
          if (cue) cue.style.opacity = String(fade * 0.75);
          // Cream fade: starts rising as the tunnel goes dark, reaches
          // full cream by the time the hero releases sticky.
          if (creamFade) {
            const creamT = Math.max(0, Math.min(1, (progress - 0.70) / (0.98 - 0.70)));
            creamFade.style.opacity = String(creamT);
          }
          lastProgress = progress;
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Chonk Shakes hero experiment"
      className="relative bg-[#0a0809]"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/chonk-hero-lab.html"
          title="Chonk Shakes 3D hero (lab)"
          scrolling="no"
          loading="eager"
          className="absolute inset-0 h-full w-full border-0"
        />
        {/* Cream fade — the "end of the straw" reveal. Opacity is
            driven by the rAF loop: it sits transparent through the
            whole scene, rises as the tunnel darkens, and reaches
            full cream by 98% scroll — so the hero releases sticky
            directly into the cream next section with no seam. */}
        <div
          ref={creamFadeRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "#FEF6EC",
            opacity: 0,
            transition: "opacity 60ms linear",
          }}
        />
        {/* Title and scroll cue live INSIDE the sticky wrapper so the
            mobile hamburger menu (fixed z-40 overlay at the document
            root) paints over them when opened. */}
        <h1
          ref={titleRef}
          className="pointer-events-none absolute z-10"
          style={{
            top: "22vh",
            left: "6vw",
            margin: 0,
            color: "#F2B8CC",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.5rem, 2.6vw, 2.5rem)",
            lineHeight: 1,
            letterSpacing: "-0.012em",
            whiteSpace: "nowrap",
            fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 96',
            textAlign: "left",
            textShadow:
              "0 0 18px rgba(242, 184, 204, 0.45), 0 0 42px rgba(242, 184, 204, 0.22)",
            transition: "opacity 120ms linear",
          }}
        >
          Enter the Chonkiverse.
        </h1>
        <div
          ref={scrollCueRef}
          aria-hidden="true"
          className="pointer-events-none absolute z-10"
          style={{
            right: "4vw",
            bottom: "5vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            color: "rgba(242, 184, 204, 0.60)",
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.55rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: 0.6,
            transition: "opacity 200ms linear",
          }}
        >
        <span>Scroll</span>
        <svg
          width="8"
          height="22"
          viewBox="0 0 8 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <line
            x1="4"
            y1="0"
            x2="4"
            y2="17"
            stroke="rgba(242, 184, 204, 0.60)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <path
            d="M1 15 L4 19 L7 15"
            stroke="rgba(242, 184, 204, 0.60)"
            strokeWidth="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        </div>
      </div>
    </section>
  );
}

export default HeroLab;
