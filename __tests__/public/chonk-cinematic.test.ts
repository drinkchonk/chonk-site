import { statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve(__dirname, "..", "..", "public");
const cinematicPath = resolve(publicDir, "chonk-cinematic.html");

// The cinematic is a duplicate-then-stripped derivative of chonk-hero-lab.html
// that the React side iframes into DropRaceLeaflet for the click-to-fullscreen
// dive sequence. jsdom has no WebGL so we can't render-test it, but we CAN
// lock the static contract: the cinematic message protocol, the six-stage
// camera rig (zoom_start → zoom_end → birds_eye → over_straw → descend →
// helix), the absence of every per-frame shake source Sam called out
// (mouse parallax, breath pulse, idle bob, drag handlers, vortex spin),
// and the absence of orbital + lab-chrome code carried in from the lab.

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

    it("default cinematic duration is 5000ms (matches React's CINEMATIC_DURATION_MS)", () => {
      // 5s: zoom 1.0s, pause 0.5s, lift 1.25s, over 0.75s, descend 0.75s,
      // helix 0.75s. The 0.5s pause is Sam's explicit ask.
      expect(html).toMatch(/cinematicDurMs\s*=\s*5000/);
    });
  });

  describe("camera rig", () => {
    it("uses the six-stage K table with zoom + pause keyframes (locks Sam's structural rewrite)", () => {
      // Old rig (lab): p0..p4 establish → birds_eye → over → descend → helix.
      // New rig: zoom_start, zoom_end, birds_eye, over_straw, descend, helix.
      // The zoom_start → zoom_end push-in is the establishing motion; the
      // pause at zoom_end is the 0.5s hold Sam asked for.
      expect(html).toMatch(
        /const K = \{[\s\S]*zoom_start[\s\S]*zoom_end[\s\S]*birds_eye[\s\S]*over_straw[\s\S]*descend[\s\S]*helix/,
      );
      expect(html).toMatch(/function resolveKeyframe\(/);
    });

    it("resolveKeyframe defines the pause phase (zoom_end → zoom_end with t=0)", () => {
      // The pause phase is the visual moment that anchors "zoom finished,
      // now the camera moves" — without it the lift bleeds into the zoom
      // and reads as one continuous tilt instead of two motions.
      expect(html).toMatch(
        /out\.a = K\.zoom_end;\s*out\.b = K\.zoom_end;\s*out\.t = 0/,
      );
    });
  });

  describe("shake sources (every per-frame jitter Sam called out must be absent)", () => {
    it("no vortex spin-up: the cup does not rotate during the cinematic", () => {
      // Sam: 'cup flip happens too early and it looks like the cup is
      // moving not the camera angle.' Killing the spin removes the
      // ambiguity. If the formula returns, the test catches it.
      expect(html).not.toMatch(/cinematicSpinBoost/);
      expect(html).not.toMatch(/cinematicEarly/);
      expect(html).not.toMatch(/cupGroup\.rotation\.y\s*\+=/);
    });

    it("no mouse parallax: cursor movement does not nudge the camera", () => {
      // The lab's parallax is fine standalone but inside a fullscreen
      // iframe it reads as shake. Lock that the tmpPos += mx/my coupling
      // is gone.
      expect(html).not.toMatch(/tmpPos\.x\s*\+=\s*mx/);
      expect(html).not.toMatch(/tmpPos\.y\s*\+=\s*my/);
      expect(html).not.toMatch(/const\s+mx\s*=\s*\(state\.mouseX/);
    });

    it("no drag-to-spin or pointer handlers attached to the canvas/window", () => {
      // The cinematic is a fixed-playback iframe; ANY mousedown/touchstart
      // listener invites the user's accidental clicks to register as drag
      // input. Lock the handlers out.
      expect(html).not.toMatch(/canvas\.addEventListener\(\s*['"]mousedown/);
      expect(html).not.toMatch(/canvas\.addEventListener\(\s*['"]touchstart/);
      expect(html).not.toMatch(/function onDragStart\(/);
    });

    it("no breath pulse or idle bob/sway: the cup holds its pose every frame", () => {
      // Per-frame sin(time) terms create sub-pixel jitter that compounds
      // with everything else. The cinematic plays a fixed arc; nothing
      // organic should move.
      expect(html).not.toMatch(/breathScale\s*=/);
      expect(html).not.toMatch(/Math\.sin\(time\s*\*\s*0\.0011\)/);
      expect(html).not.toMatch(/Math\.sin\(time\s*\*\s*0\.0008\)/);
      expect(html).not.toMatch(/Math\.sin\(time\s*\*\s*0\.0007\)/);
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
