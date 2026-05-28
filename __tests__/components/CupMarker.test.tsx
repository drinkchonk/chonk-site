import { cupMarkerHtml } from "@/components/ui/CupMarker";
import { DROP_RACE_LOCATIONS } from "@/lib/data/drop-race-locations";

const sampleLocation = DROP_RACE_LOCATIONS[0];

describe("cupMarkerHtml — AC-3 cup-marker component", () => {
  it("returns HTML containing a <video> element", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toContain("<video");
  });

  it("video src points at /chonk-cup-marker.webm", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toContain('src="/chonk-cup-marker.webm"');
  });

  it("video has autoplay, loop, muted, and playsinline attributes (iOS-safe combo)", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toMatch(/<video[^>]*\bautoplay\b/);
    expect(html).toMatch(/<video[^>]*\bloop\b/);
    expect(html).toMatch(/<video[^>]*\bmuted\b/);
    expect(html).toMatch(/<video[^>]*\bplaysinline\b/);
  });

  it("includes a CSS-rendered wordmark fallback element (always-visible chonk glyph)", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toContain("cup-fallback");
    // The fallback carries the chonk wordmark text so the marker is never
    // visually empty during the placeholder period before Sam records the
    // real WebM.
    expect(html.toLowerCase()).toContain("chonk");
  });

  it("overlays the location's current vote count as a number badge", () => {
    const html = cupMarkerHtml({ ...sampleLocation, votes: 42 });
    expect(html).toContain("42");
    expect(html).toContain("cup-votes");
  });

  it("wraps everything in a .chonk-cup-marker container", () => {
    const html = cupMarkerHtml(sampleLocation);
    expect(html).toContain("chonk-cup-marker");
  });

  it("escapes the vote count safely (numeric, no HTML injection surface)", () => {
    // Votes come from server-side seed + local +1 increments; both numeric.
    // Belt-and-braces: the helper must not just inline raw strings — if a
    // future change pulled votes from URL params we want this contained.
    const html = cupMarkerHtml({ ...sampleLocation, votes: 7 });
    expect(html).toContain(">7<");
    expect(html).not.toContain("undefined");
    expect(html).not.toContain("NaN");
  });
});
