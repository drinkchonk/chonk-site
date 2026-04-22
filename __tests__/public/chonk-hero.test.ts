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
});
