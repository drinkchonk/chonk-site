/**
 * Lock the drop-race-locations dataset shape. The Leaflet map (Sprint 3)
 * binds directly to this export — if the schema drifts, the map breaks
 * silently. The 12-entry count and 4-gym / 8-suburb split mirrors the
 * reference design at /tmp/chonk-zip/Drop Race Map.html.
 */
import {
  DROP_RACE_LOCATIONS,
  type DropRaceLocation,
} from "@/lib/data/drop-race-locations";

describe("DROP_RACE_LOCATIONS", () => {
  it("exports 12 locations (4 gyms + 8 suburbs)", () => {
    expect(DROP_RACE_LOCATIONS).toHaveLength(12);
    const gyms = DROP_RACE_LOCATIONS.filter((l) => l.kind === "gym");
    const suburbs = DROP_RACE_LOCATIONS.filter((l) => l.kind === "suburb");
    expect(gyms).toHaveLength(4);
    expect(suburbs).toHaveLength(8);
  });

  it("uses unique ids across the dataset", () => {
    const ids = DROP_RACE_LOCATIONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("anchors every coordinate inside the City of Stirling envelope", () => {
    // City of Stirling sits roughly within -31.95..-31.85 lat,
    // 115.74..115.84 lng. Any pin outside this box was either typo'd
    // or copy-pasted from an unrelated suburb — fail loud.
    for (const loc of DROP_RACE_LOCATIONS) {
      expect(loc.lat).toBeGreaterThan(-31.96);
      expect(loc.lat).toBeLessThan(-31.84);
      expect(loc.lng).toBeGreaterThan(115.73);
      expect(loc.lng).toBeLessThan(115.85);
    }
  });

  it("includes the four reference gyms from the design", () => {
    const gymIds = DROP_RACE_LOCATIONS.filter((l) => l.kind === "gym").map(
      (l) => l.id,
    );
    expect(gymIds).toEqual(
      expect.arrayContaining([
        "revo-scar",
        "f45-karri",
        "plus-innaloo",
        "anytime-stir",
      ]),
    );
  });

  it("includes the eight reference suburbs from the design", () => {
    const suburbIds = DROP_RACE_LOCATIONS.filter(
      (l) => l.kind === "suburb",
    ).map((l) => l.id);
    expect(suburbIds).toEqual(
      expect.arrayContaining([
        "scarborough",
        "karrinyup",
        "innaloo",
        "doubleview",
        "woodlands",
        "wembley-dw",
        "osborne-pk",
        "stirling",
      ]),
    );
  });

  it("seeds vote counts as non-negative integers", () => {
    for (const loc of DROP_RACE_LOCATIONS) {
      expect(Number.isInteger(loc.votes)).toBe(true);
      expect(loc.votes).toBeGreaterThanOrEqual(0);
    }
  });

  it("total seed votes is greater than zero (the leaderboard would render empty otherwise)", () => {
    const total = DROP_RACE_LOCATIONS.reduce((s, l) => s + l.votes, 0);
    expect(total).toBeGreaterThan(0);
  });

  it("each location's suburb field is a non-empty string", () => {
    for (const loc of DROP_RACE_LOCATIONS) {
      expect(typeof loc.suburb).toBe("string");
      expect(loc.suburb.length).toBeGreaterThan(0);
    }
  });

  // Type-level guard: the array literal must be assignable to the type.
  // If this stops compiling, the schema drift is real.
  const _typed: DropRaceLocation[] = DROP_RACE_LOCATIONS;
  void _typed;
});
