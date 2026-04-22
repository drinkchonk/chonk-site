import { locations } from "@/lib/data/locations";

describe("locations data", () => {
  it("includes the open Osborne Park flagship and two coming-soon stalls", () => {
    expect(locations).toHaveLength(3);
    const open = locations.filter((l) => l.status === "open");
    expect(open).toHaveLength(1);
    expect(open[0].id).toBe("osborne-park");
  });

  it("open locations expose trading hours; coming-soon locations do not", () => {
    locations.forEach((loc) => {
      if (loc.status === "coming-soon") {
        expect(loc.hours).toHaveLength(0);
      } else {
        expect(loc.hours.length).toBeGreaterThan(0);
        loc.hours.forEach((h) => {
          expect(h.day).toBeTruthy();
          expect(h.time).toMatch(/\d.*[ap]m.*\d.*[ap]m/i);
        });
      }
    });
  });

  it("every location carries a suburb and address", () => {
    locations.forEach((loc) => {
      expect(loc.suburb).toBeTruthy();
      expect(loc.address).toBeTruthy();
    });
  });

  it("coming-soon stalls include a rough map pin with ETA", () => {
    const soon = locations.filter((l) => l.status === "coming-soon");
    soon.forEach((loc) => {
      expect(loc.pin).toBeDefined();
      expect(loc.pin?.eta).toBeTruthy();
    });
  });
});
