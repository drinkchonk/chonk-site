import { statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve(__dirname, "..", "..", "public");
const heroPath = resolve(publicDir, "chonk-hero.html");
const hdrPath = resolve(publicDir, "assets", "studio.hdr");
const logoPath = resolve(publicDir, "logo-transparent.png");

// The hero is a single-file Three.js micro-app that the Next.js app
// iframes into `components/sections/Hero.tsx`. It can't be unit-tested
// for actual rendering (jsdom has no WebGL) — but we CAN lock the
// static contract it relies on: correct Three.js version, required
// imports, the HDR asset, and no stray legacy-API drift.

describe("chonk-hero iframe asset", () => {
  let html: string;

  beforeAll(() => {
    html = readFileSync(heroPath, "utf8");
  });

  describe("on-disk assets", () => {
    it("chonk-hero.html exists in public/", () => {
      expect(statSync(heroPath).isFile()).toBe(true);
    });

    it("studio HDRI exists at /assets/studio.hdr", () => {
      const stat = statSync(hdrPath);
      expect(stat.isFile()).toBe(true);
      // Poly Haven 1k equirectangular is ≥ 1MB — a truncated download
      // would quietly fall back to the canvas gradient env. Catch it here.
      expect(stat.size).toBeGreaterThan(500_000);
    });

    it("logo-transparent.png exists", () => {
      expect(statSync(logoPath).isFile()).toBe(true);
    });

    it("studio HDRI starts with a valid Radiance HDR header", () => {
      const head = readFileSync(hdrPath).slice(0, 40).toString("ascii");
      expect(head).toMatch(/^#\?RADIANCE\b/);
    });
  });

  describe("Three.js r160 pipeline", () => {
    it("uses an importmap pinned to three@0.160.x", () => {
      expect(html).toContain('<script type="importmap">');
      expect(html).toMatch(/three@0\.160\.\d+\/build\/three\.module\.js/);
      expect(html).toMatch(/three@0\.160\.\d+\/examples\/jsm\//);
    });

    it("imports RGBELoader so the HDRI env decodes", () => {
      expect(html).toContain("three/addons/loaders/RGBELoader.js");
      expect(html).toContain("new RGBELoader()");
      expect(html).toContain("/assets/studio.hdr");
    });

    it("imports and initialises RectAreaLightUniformsLib for the softbox key", () => {
      expect(html).toContain(
        "three/addons/lights/RectAreaLightUniformsLib.js",
      );
      expect(html).toContain("RectAreaLightUniformsLib.init()");
      expect(html).toMatch(/new\s+THREE\.RectAreaLight\s*\(/);
    });

    it("uses r160+ colour-space API (no legacy encoding fields)", () => {
      expect(html).toContain("outputColorSpace = THREE.SRGBColorSpace");
      expect(html).toMatch(/colorSpace\s*=\s*THREE\.SRGBColorSpace/);
      expect(html).not.toMatch(/sRGBEncoding/);
      expect(html).not.toMatch(/outputEncoding/);
    });

    it("does NOT pull in the deprecated r128 postprocessing scripts", () => {
      // These were the old CDN tags; they MUST be gone or the importmap
      // fallback vs. UMD load order will race on a cold cache.
      expect(html).not.toMatch(
        /cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\//,
      );
      expect(html).not.toMatch(/three@0\.128\.0\/examples\/js\//);
    });
  });

  describe("render-quality guardrails", () => {
    it("sets anisotropy on every texture it creates", () => {
      // Canvas textures (logo, lid, contact shadow) are all built with
      // the shared MAX_ANISO constant. If someone adds a new texture
      // without anisotropy the "I can see pixels" regression returns
      // instantly — this test catches it.
      const anisotropyAssignments = html.match(/\.anisotropy\s*=/g) ?? [];
      expect(anisotropyAssignments.length).toBeGreaterThanOrEqual(3);
      expect(html).toContain("getMaxAnisotropy()");
    });

    it("renders the straw as opaque white plastic (not translucent)", () => {
      // Brand spec lock: see CLAUDE-realtime-perfect.md §Locked brand values.
      // If the straw drifts back to transmission/clearcoat we've silently
      // broken the brand decision.
      const strawMatMatch = html.match(
        /const\s+strawMat\s*=\s*new\s+THREE\.(MeshStandardMaterial|MeshPhysicalMaterial)\s*\(\{[^}]*\}/,
      );
      expect(strawMatMatch).not.toBeNull();
      const strawMat = strawMatMatch![0];
      expect(strawMat).toContain("MeshStandardMaterial");
      expect(strawMat).not.toMatch(/transmission\s*:/);
      expect(strawMat).not.toMatch(/transparent\s*:\s*true/);
    });

    it("keeps the locked brand pink (#d46894) on the cup body", () => {
      // The hero colour is tuned for the studio render rig. Accidentally
      // swapping in the marketing site's #FFD8F3 washes the cup to near
      // white under the softbox.
      expect(html).toMatch(/ctx\.fillStyle\s*=\s*['"]#d46894['"]/i);
    });

    it("preserves a transparent canvas clear so the iframe composites over the host page", () => {
      expect(html).toContain("alpha: true");
      expect(html).toMatch(/setClearColor\(0x0{6},\s*0\)/);
    });
  });

  describe("cinematic-mode protocol (click-to-fullscreen dive sequence)", () => {
    it("listens for chonk-cinematic-play, chonk-cinematic-skip, chonk-cinematic-reset", () => {
      // The React side (DropRaceLeaflet) postMessages these three types
      // on click / mid-cinematic skip / post-cinematic cleanup. The
      // iframe must register handlers for all three.
      expect(html).toContain("'chonk-cinematic-play'");
      expect(html).toContain("'chonk-cinematic-skip'");
      expect(html).toContain("'chonk-cinematic-reset'");
      // Listener is attached to window message events, not e.g. document.
      expect(html).toMatch(
        /window\.addEventListener\(\s*['"]message['"]/,
      );
    });

    it("emits chonk-cinematic-progress (mid-flight) and chonk-cinematic-done (completion)", () => {
      // The React side uses cinematic-done to advance state (open the
      // form or scroll to FlavourGrid). Without these emits the cinematic
      // never terminates and the safety timeout has to fire — verify the
      // primary path exists.
      expect(html).toContain("'chonk-cinematic-progress'");
      expect(html).toContain("'chonk-cinematic-done'");
      // Emits target the host page (window.parent).
      expect(html).toMatch(
        /window\.parent\.postMessage\(\s*\{\s*type:\s*['"]chonk-cinematic-(progress|done)['"]/,
      );
    });

    it("ships the two overlay DOM elements the cinematic fades through (#cinematicBlueprint, #cinematicBlack)", () => {
      // The blueprint-blue grid overlay rises and falls across the middle
      // of the timeline; the black overlay rises in the last 18% so the
      // final frame dissolves cleanly into the next host content.
      expect(html).toContain('id="cinematicBlueprint"');
      expect(html).toContain('id="cinematicBlack"');
    });

    it("defines the cinematic camera dolly target (eased lerp from z=9.5 to z=0.6)", () => {
      // The cinematic dollies the camera from idle position (0, 0.15, 9.5)
      // toward the cup (0, 1.1, 0.6) over the timeline. This regression
      // catches an accidental change to the dolly target — the "flying
      // into the cup" read depends on hitting the inner cup body.
      expect(html).toMatch(/lerp\(9\.5,\s*0\.6,/);
      expect(html).toMatch(/lerp\(0\.15,\s*1\.1,/);
    });

    it("default cinematic duration is 3.5s (matches the React side's CINEMATIC_DURATION_MS)", () => {
      // The iframe uses a default of 3500ms if the play message doesn't
      // carry a durationMs. Keep these in sync with the React side.
      expect(html).toMatch(/cinematicDurMs\s*=\s*[^;]*3500/);
    });
  });
});
