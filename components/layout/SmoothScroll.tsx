"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis-driven momentum scroll. Mounts once at the root layout, owns the
 * page-level scroll, and keeps the iframe-embedded 3D hero
 * (/chonk-hero.html) in sync via standard window.scrollY — its rAF loop
 * dispatches native scroll events so any consumer using window scroll
 * keeps working without modification.
 *
 * Honours prefers-reduced-motion: completely no-ops on those clients so
 * keyboard / assistive-tech navigation isn't wrapped in an animation.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
