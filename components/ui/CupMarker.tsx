import type { DropRaceLocation } from "@/lib/data/drop-race-locations";

/**
 * Returns the HTML string injected into a Leaflet divIcon for one marker.
 *
 * The marker is a small spinning Chonk cup (pre-rendered transparent WebM
 * loop at /chonk-cup-marker.webm) on top of a CSS-rendered wordmark fallback,
 * with the location's current vote count overlaid as a number badge.
 *
 * The :hover state translates the marker up ~8px for the bob; the rule lives
 * in app/globals.css alongside the .chonk-cup-marker selectors.
 */
export function cupMarkerHtml(_loc: DropRaceLocation): string {
  return "";
}
