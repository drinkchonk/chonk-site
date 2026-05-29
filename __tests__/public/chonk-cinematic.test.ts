import { statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve(__dirname, "..", "..", "public");
const cinematicPath = resolve(publicDir, "chonk-cinematic.html");

// The cinematic is a duplicate-then-stripped derivative of chonk-hero-lab.html
// that the React side iframes into DropRaceLeaflet for the click-to-fullscreen
// dive sequence. jsdom has no WebGL so we can't render-test it, but we CAN
// lock the static contract: the cinematic message protocol, the six-stage
// camera rig (zoom_start → zoom_end → birds_eye → over_straw → descend →
// helix), the zoom-coupled vortex spin (re-added per Sam: faster spin as
// camera zooms in), direct-bind camera tracking (no 0.12-alpha chase lerp
// that caused the structural shake), and the absence of every other
// per-frame jitter source the lab carries (mouse parallax, breath pulse,
// idle bob, drag handlers, force-field motes) plus the absence of orbital +
// lab-chrome code carried in from the lab.

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
      // 5s: zoom 1.5s, pause 0.5s, lift 1.10s, over 0.6s, descend 0.65s,
      // helix 0.65s. The 0.5s pause is Sam's explicit ask; the slow zoom
      // is his second iteration ('the zoom is still messy').
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

    it("zoom phase covers the first 30% of the cinematic (1.5s @ default duration)", () => {
      // Sam's second iteration: 'the zoom is still messy, slow it down'.
      // The zoom_start → zoom_end branch fires when p <= 0.30, which at
      // a 5s duration is 1.5s of dolly. If a future tweak narrows that
      // window the zoom snaps too fast again — lock the slow boundary.
      expect(html).toMatch(
        /p <= 0\.30\s*\)\s*\{\s*out\.a = K\.zoom_start;\s*out\.b = K\.zoom_end/,
      );
    });

    it("camera tracks the K rig directly (camera.position.copy, not lerp) — kills the chase-artifact shake", () => {
      // Sam's reported 'really shaky' bug traced to camera.position.lerp(
      // tmpPos, 0.12). resolveKeyframe already smoothstep01-eases the
      // target, so a second-order exponential chase introduces a frame-
      // rate-dependent trailing wobble — visible as shake. Direct copy
      // makes the camera track the smoothed target frame-exact.
      expect(html).toMatch(/camera\.position\.copy\(\s*tmpPos\s*\)/);
      expect(html).toMatch(/camCurrentLook\.copy\(\s*tmpLook\s*\)/);
      expect(html).not.toMatch(/camera\.position\.lerp\(\s*tmpPos/);
      expect(html).not.toMatch(/camCurrentLook\.lerp\(\s*tmpLook/);
    });
  });

  describe("vortex spin (zoom-coupled — re-added per Sam's third iteration)", () => {
    it("vortexW weight grows during zoom, holds during pause, decays during lift", () => {
      // Sam: 'make the cup spin faster as you zoom in, this will add a
      // really nice effect.' The piecewise weight:
      //   p < 0.30: smoothstep01(p / 0.30)      ← ramp up during zoom
      //   p < 0.40: 1                            ← hold at peak during pause
      //   p < 0.55: 1 - smoothstep01(…)          ← decay during early lift
      //   otherwise: 0                           ← still for the rest of arc
      expect(html).toMatch(/let\s+vortexW;/);
      expect(html).toMatch(/vortexW\s*=\s*smoothstep01\(\s*p\s*\/\s*0\.30\s*\)/);
      expect(html).toMatch(/vortexW\s*=\s*1\s*-\s*smoothstep01/);
    });

    it("vortex is applied as cupGroup.rotation.y += VORTEX_PEAK_RAD_PER_MS * vortexW * dtMs", () => {
      // Locks the application formula so a future strip can't silently
      // re-introduce the old lab spin pattern (constant + scrollBoost).
      expect(html).toMatch(/VORTEX_PEAK_RAD_PER_MS\s*=\s*-?\d/);
      expect(html).toMatch(
        /cupGroup\.rotation\.y\s*\+=\s*VORTEX_PEAK_RAD_PER_MS\s*\*\s*vortexW\s*\*\s*dtMs/,
      );
    });
  });

  describe("shake sources (every non-vortex per-frame jitter must remain absent)", () => {
    it("no mouse parallax: cursor movement does not nudge the camera", () => {
      expect(html).not.toMatch(/tmpPos\.x\s*\+=\s*mx/);
      expect(html).not.toMatch(/tmpPos\.y\s*\+=\s*my/);
      expect(html).not.toMatch(/const\s+mx\s*=\s*\(state\.mouseX/);
    });

    it("no drag-to-spin or pointer handlers attached to the canvas/window", () => {
      expect(html).not.toMatch(/canvas\.addEventListener\(\s*['"]mousedown/);
      expect(html).not.toMatch(/canvas\.addEventListener\(\s*['"]touchstart/);
      expect(html).not.toMatch(/function onDragStart\(/);
    });

    it("no breath pulse or idle bob/sway: the cup holds its pose every frame", () => {
      expect(html).not.toMatch(/breathScale\s*=/);
      expect(html).not.toMatch(/Math\.sin\(time\s*\*\s*0\.0011\)/);
      expect(html).not.toMatch(/Math\.sin\(time\s*\*\s*0\.0008\)/);
      expect(html).not.toMatch(/Math\.sin\(time\s*\*\s*0\.0007\)/);
    });

    it("force-field motes are hidden — no animated background particles", () => {
      // The lab's force-field motes are per-frame sin/cos particles that
      // read as background noise during the deterministic arc. Lock them
      // hidden so the only motion is camera + vortex.
      expect(html).toMatch(/forcePoints\.visible\s*=\s*false/);
      expect(html).not.toMatch(
        /Math\.sin\(tSec\s*\*\s*0\.45\s*\+\s*forcePhase/,
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
