/**
 * Migration guard — proves AC-1 of the chonk-leaflet-landing harness
 * contract: every artifact shipped earlier in the session was removed,
 * /find-us is gone, the hero-lab additive patches were reverted, and
 * the home page no longer mounts LaunchVoteForm conditionally.
 *
 * Regression value: catches accidental restoration of any of those
 * artifacts in a future session (e.g. someone resurrects a stale
 * branch and the cup-marker component reappears).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repo = resolve(__dirname, "..", "..");
const here = (p: string) => resolve(repo, p);

describe("chonk-leaflet-landing teardown (AC-1)", () => {
  describe("session artifacts deleted", () => {
    it("components/sections/DropRaceMap.tsx does not exist", () => {
      expect(existsSync(here("components/sections/DropRaceMap.tsx"))).toBe(false);
    });

    it("public/chonk-shake-marker.html does not exist", () => {
      expect(existsSync(here("public/chonk-shake-marker.html"))).toBe(false);
    });

    it("__tests__/components/DropRaceMap.test.tsx does not exist", () => {
      expect(existsSync(here("__tests__/components/DropRaceMap.test.tsx"))).toBe(false);
    });

    it("__tests__/public/chonk-shake-marker.test.ts does not exist", () => {
      expect(existsSync(here("__tests__/public/chonk-shake-marker.test.ts"))).toBe(false);
    });
  });

  describe("public/chonk-hero-lab.html additive patches reverted", () => {
    const labPath = here("public/chonk-hero-lab.html");
    let lab = "";
    beforeAll(() => {
      lab = existsSync(labPath) ? readFileSync(labPath, "utf8") : "";
    });

    it("file still exists (we only reverted patches, not the file)", () => {
      expect(existsSync(labPath)).toBe(true);
    });

    it("no isMarker declaration", () => {
      // The patch added `const isMarker = ...` (true unconditionally
      // in the marker variant, hash-gated in lab). Both forms must be
      // gone after revert.
      expect(lab).not.toMatch(/const\s+isMarker\s*=/);
    });

    it("no diveActive state", () => {
      expect(lab).not.toMatch(/let\s+diveActive\b/);
      expect(lab).not.toMatch(/\bdiveActive\s*=\s*true/);
    });

    it("no hoverImpulse state", () => {
      expect(lab).not.toMatch(/\bhoverImpulse\b/);
    });

    it("no chonk-lab-dive / chonk-lab-hover / chonk-lab-dive-complete handlers", () => {
      expect(lab).not.toMatch(/['"]chonk-lab-dive['"]/);
      expect(lab).not.toMatch(/['"]chonk-lab-hover['"]/);
      expect(lab).not.toMatch(/['"]chonk-lab-dive-complete['"]/);
    });
  });

  describe("/find-us route fully removed", () => {
    it("app/find-us directory does not exist", () => {
      expect(existsSync(here("app/find-us"))).toBe(false);
    });

    it("app/find-us/page.tsx does not exist", () => {
      expect(existsSync(here("app/find-us/page.tsx"))).toBe(false);
    });

    it("app/find-us/LaunchVoteForm.tsx does not exist", () => {
      expect(existsSync(here("app/find-us/LaunchVoteForm.tsx"))).toBe(false);
    });

    it("app/find-us/WholesaleForm.tsx does not exist", () => {
      expect(existsSync(here("app/find-us/WholesaleForm.tsx"))).toBe(false);
    });
  });

  describe("app/page.tsx no longer carries the from=drop-race mount", () => {
    const homePath = here("app/page.tsx");
    let home = "";
    beforeAll(() => {
      home = existsSync(homePath) ? readFileSync(homePath, "utf8") : "";
    });

    it("home page does not import LaunchVoteForm", () => {
      expect(home).not.toMatch(/import\s+LaunchVoteForm/);
    });

    it("home page does not read searchParams for the drop-race flag", () => {
      expect(home).not.toMatch(/from-drop-race|home-drop-race-form|"drop-race"/);
    });
  });
});
