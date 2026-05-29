import { cupMarkerHtml } from "@/components/ui/CupMarker";
import { DROP_RACE_LOCATIONS } from "@/lib/data/drop-race-locations";

const sampleLocation = DROP_RACE_LOCATIONS[0];

describe("cupMarkerHtml — live 3D cup-marker component", () => {
  it("returns HTML containing an <iframe> element", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toContain("<iframe");
  });

  it("iframe src points at /chonk-hero.html#marker with a per-id spin multiplier", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toMatch(/src="\/chonk-hero\.html#marker&v=[0-9.]+"/);
  });

  it("the per-id spin multiplier is deterministic (same id → same v) and varies across ids", () => {
    const a1 = cupMarkerHtml(sampleLocation).match(/v=([0-9.]+)/)?.[1];
    const a2 = cupMarkerHtml(sampleLocation).match(/v=([0-9.]+)/)?.[1];
    expect(a1).toBeDefined();
    expect(a1).toEqual(a2);

    // Across all locations, multipliers should span more than one value
    // so the 12 marker cups don't spin in lockstep.
    const all = DROP_RACE_LOCATIONS.map(
      (l) => cupMarkerHtml(l).match(/v=([0-9.]+)/)?.[1],
    );
    expect(new Set(all).size).toBeGreaterThan(1);
  });

  it("carries a per-id reveal stagger via inline animation-delay (deterministic, varied)", () => {
    // Same id always lands on the same delay bucket.
    const a1 = cupMarkerHtml(sampleLocation).match(
      /animation-delay:(\d+)ms/,
    )?.[1];
    const a2 = cupMarkerHtml(sampleLocation).match(
      /animation-delay:(\d+)ms/,
    )?.[1];
    expect(a1).toBeDefined();
    expect(a1).toEqual(a2);

    // Across all locations, delays should span more than one bucket so
    // the 12 markers don't pop in at the same instant.
    const all = DROP_RACE_LOCATIONS.map(
      (l) => cupMarkerHtml(l).match(/animation-delay:(\d+)ms/)?.[1],
    );
    expect(new Set(all).size).toBeGreaterThan(1);
  });

  it("iframe is lazy-loaded, non-scrolling, and hidden from the a11y tree", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toMatch(/<iframe[^>]*\bloading="lazy"/);
    expect(html).toMatch(/<iframe[^>]*\bscrolling="no"/);
    expect(html).toMatch(/<iframe[^>]*\baria-hidden="true"/);
  });

  it("wraps the iframe in a .chonk-cup-marker container", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toContain("chonk-cup-marker");
  });

  it("carries data-loc-id so the cinematic overlay can find the clicked pin's DOM rect", () => {
    // The click-cinematic flow does
    //   document.querySelector(`.chonk-cup-marker[data-loc-id="${loc.id}"]`)
    // at click time and reads its getBoundingClientRect() to snap the
    // cinematic iframe to the pin's screen position. Drop the attribute
    // and the cinematic falls back to direct-modal mode silently.
    for (const loc of DROP_RACE_LOCATIONS) {
      const html = cupMarkerHtml(loc);
      expect(html).toContain(`data-loc-id="${loc.id}"`);
    }
  });

  it("carries data-spin echoing the v= multiplier (lets the cinematic match spin rate)", () => {
    const html = cupMarkerHtml(sampleLocation);
    const v = html.match(/v=([0-9.]+)/)?.[1];
    expect(v).toBeDefined();
    expect(html).toContain(`data-spin="${v}"`);
  });

  it("renders only the iframe — no pink wordmark fallback, no vote badge on the marker itself", () => {
    // The marker is now the bare 3D cup: no pink halo, no 'chonk.' text
    // backdrop, no vote badge attached to the pin. Vote counts live in
    // the leaderboard panel; the cup sits on the exact map coordinate.
    const html = cupMarkerHtml({ ...sampleLocation, votes: 42 });
    expect(html).not.toContain("cup-fallback");
    expect(html).not.toContain("cup-votes");
    expect(html).not.toContain("42");
  });
});
