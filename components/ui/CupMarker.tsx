import type { DropRaceLocation } from "@/lib/data/drop-race-locations";

/**
 * Returns the HTML string injected into a Leaflet `divIcon` for one marker.
 *
 * The marker is a small spinning Chonk cup (pre-rendered transparent WebM
 * loop at `/chonk-cup-marker.webm`) on top of a CSS-rendered wordmark
 * fallback. The fallback is always rendered so the marker is never visually
 * empty — during the placeholder period (1x1 transparent WebM) the fallback
 * shows through; once Sam replaces the placeholder with the real recording
 * the video's opaque pixels cover the fallback.
 *
 * The location's current vote count is overlaid as a number badge so the
 * leaderboard remains scan-friendly even at a glance.
 *
 * Hover state (`translateY(-8px)` bob) is defined in `app/globals.css` and
 * honours `prefers-reduced-motion`.
 */
export function cupMarkerHtml(loc: DropRaceLocation): string {
  const votes = Number.isFinite(loc.votes) ? loc.votes : 0;
  return `<div class="chonk-cup-marker">\
<div class="cup-fallback" aria-hidden="true">chonk.</div>\
<video class="cup-video" src="/chonk-cup-marker.webm" autoplay loop muted playsinline aria-hidden="true"></video>\
<div class="cup-votes">${votes}</div>\
</div>`;
}
