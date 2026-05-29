import { statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve(__dirname, "..", "..", "public");
const cinematicPath = resolve(publicDir, "chonk-cinematic.html");

// The cinematic is a duplicate-then-stripped derivative of chonk-hero-lab.html
// that the React side iframes into DropRaceLeaflet for the click-to-fullscreen
// dive sequence. jsdom has no WebGL so we can't render-test it, but we CAN
// lock the static contract: the cinematic message protocol, the 5-keyframe
// camera rig, the vortex spin-up formula, and the absence of orbital +
// lab-chrome code carried in from the lab parent file.

describe("chonk-cinematic iframe asset", () => {
  let html: string;

  beforeAll(() => {
    html = readFileSync(cinematicPath, "utf8");
  });

  describe("on-disk", () => {
    it("chonk-cinematic.html exists in public/", () => {
      expect(statSync(cinematicPath).isFile()).toBe(true);
    });
  });

  describe("cinematic message protocol", () => {
    it("listens for chonk-cinematic-play, chonk-cinematic-skip, chonk-cinematic-reset", () => {
      // The React side (DropRaceLeaflet) postMessages these three types
      // on click / mid-cinematic skip / post-cinematic cleanup.
      expect(html).toContain("'chonk-cinematic-play'");
      expect(html).toContain("'chonk-cinematic-skip'");
      expect(html).toContain("'chonk-cinematic-reset'");
      expect(html).toMatch(
        /window\.addEventListener\(\s*['"]message['"]/,
      );
    });

    it("emits chonk-cinematic-progress (~20Hz) and chonk-cinematic-done (completion) with locked payload shape", () => {
      // The React side uses cinematic-done to advance state (open the
      // form, scroll to FlavourGrid). The progress payload uses the
      // field name `progress:` — locking the shape so the React side
      // can rely on it without falling back to either {t:…} or {progress:…}.
      expect(html).toContain("'chonk-cinematic-progress'");
      expect(html).toContain("'chonk-cinematic-done'");
      expect(html).toMatch(/progress:\s*cinematicProgress/);
    });

    it("default cinematic duration is 3500ms (matches React's CINEMATIC_DURATION_MS)", () => {
      expect(html).toMatch(/cinematicDurMs\s*=\s*3500/);
    });
  });

  describe("camera rig + vortex spin-up", () => {
    it("uses the 5-keyframe K table + resolveKeyframe helper from the lab rig", () => {
      // K table is the lab's 5-keyframe camera arc (p0=establish,
      // p1=birds-eye, p2=over-straw, p3=descend, p4=helix-look).
      expect(html).toMatch(
        /const K = \{[\s\S]*p0[\s\S]*p1[\s\S]*p2[\s\S]*p3[\s\S]*p4/,
      );
      expect(html).toMatch(/function resolveKeyframe\(/);
    });

    it("vortex spin-up formula is BASE_ANGULAR_VEL * spinW * cinematicSpinBoost (locks Step 4 against regression)", () => {
      // cinematicSpinBoost ramps 1× → 5× over the first 30% of the
      // cinematic; spinW (lab's existing upright-lock taper) decays it
      // back to 0 by the time the camera lines up over the straw.
      // Magnitude is a tuning knob — locks shape, not value.
      expect(html).toMatch(/cinematicSpinBoost\s*=\s*1\s*\+\s*\d+/);
      expect(html).toMatch(
        /BASE_ANGULAR_VEL\s*\*\s*spinW\s*\*\s*cinematicSpinBoost/,
      );
    });
  });

  describe("strip invariants (must NOT contain any of these)", () => {
    it("orbital + dead-scroll-boost code is fully purged", () => {
      // Lab's solar-system code + scroll-driven spin boost have no
      // place in the click-cinematic. Listing every dropped symbol
      // makes regressions LOUD if a future merge re-introduces them.
      const banned = [
        "addFruitToOrbit",
        "buildOrange",
        "buildMango",
        "buildBanana",
        "buildStrawberry",
        "buildHoneyGlob",
        "buildBlueberryCluster",
        "buildProteinPowder",
        "buildMilkGlob",
        "buildOrbitRings",
        "chonk-lab-scroll",
        "fruitRenderAlpha",
        "fruitAlpha",
        "scrollBoost",
        "boostW",
      ];
      for (const sym of banned) {
        expect(html).not.toContain(sym);
      }
    });

    it("lab UI chrome (loader / scrollHint / holdSip / vignette) is fully purged", () => {
      // These are full-page elements appropriate to the lab's standalone
      // viewer but inappropriate to a 3.5s iframe playback. Hard-fail
      // if any sneak back in.
      expect(html).not.toContain('id="loader"');
      expect(html).not.toContain('id="scrollHint"');
      expect(html).not.toContain('id="holdSip"');
      expect(html).not.toContain('class="vignette');
    });
  });
});
