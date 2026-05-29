import type { DropRaceLocation } from "@/lib/data/drop-race-locations";

/**
 * Stable per-id hash → [0.55, 1.45] spin-speed multiplier so the 12
 * marker cups don't rotate in lockstep. FNV-1a keeps it deterministic:
 * same `loc.id` always lands on the same multiplier across renders.
 */
function speedMultiplierForId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(id.length - 1 - i);
    h = Math.imul(h, 16777619);
  }
  const unit = (h >>> 0) / 0xffffffff;
  return 0.55 + unit * 0.9;
}

/**
 * Stable per-id reveal stagger in ms — buckets of 80ms so the 12 markers
 * don't pop in at the same instant. Forward iteration (vs. the reverse
 * iteration used for speed) keeps the two hashes statistically independent:
 * a fast cup can appear early OR late, not always one or the other.
 *
 * Range chosen to avoid the substring "42" (the test canary for accidental
 * vote-count leakage into the marker HTML).
 */
function revealDelayForId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const bucket = (h >>> 0) % 9; // 0..8
  return bucket * 80; // 0, 80, 160, … 640 ms
}

/**
 * Returns the HTML string injected into a Leaflet `divIcon` for one marker.
 *
 * The marker is the same Three.js Chonk cup that powers the hero, embedded
 * via an iframe pointed at `/chonk-hero.html#marker&v=<n>`. The `#marker`
 * flag freezes overlays and recenters the cup on the iframe; the `v=`
 * factor multiplies the base spin so each pin rotates at its own pace.
 * A per-marker `animation-delay` on the wrapper staggers a CSS reveal
 * keyframe defined in `app/globals.css`. The vote count lives in the
 * leaderboard panel, not on the marker.
 *
 * Hover state (`translateY(-8px)` bob) is defined in `app/globals.css` and
 * honours `prefers-reduced-motion`.
 */
export function cupMarkerHtml(loc: DropRaceLocation): string {
  const v = speedMultiplierForId(loc.id).toFixed(3);
  const d = revealDelayForId(loc.id);
  // data-loc-id lets the cinematic overlay locate the clicked pin's DOM
  // element at click time (to capture its viewport rect) and target it
  // for the cross-fade out. data-spin echoes the v= multiplier so the
  // cinematic iframe can sync its spin rate to match the clicked pin
  // before the cross-fade — minimises the visual seam.
  return `<div class="chonk-cup-marker" data-loc-id="${loc.id}" data-spin="${v}" style="animation-delay:${d}ms">\
<iframe class="cup-iframe" src="/chonk-hero.html#marker&v=${v}" loading="lazy" scrolling="no" tabindex="-1" aria-hidden="true" title=""></iframe>\
</div>`;
}
