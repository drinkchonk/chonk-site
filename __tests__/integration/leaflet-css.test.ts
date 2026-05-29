import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Sprint 2 structural Poka-Yoke guards for AC-2 / AC-3 / AC-4.
 *
 * These tests grep the source files directly rather than render in jsdom
 * because the defects we're locking in are CSS-loading + token-routing,
 * neither of which jsdom can faithfully reproduce (no real layout, no
 * stylesheet preflight). The fs-read approach gives us deterministic
 * coverage of the contract clauses without standing up a real browser.
 *
 * The real-browser smoke for these same defects lands in Sprint 3 (AC-6).
 */

const projectRoot = join(__dirname, "..", "..");

function read(relPath: string): string {
  return readFileSync(join(projectRoot, relPath), "utf-8");
}

describe("AC-2 — Leaflet CSS + Tailwind preflight compat", () => {
  it("DropRaceLeaflet.tsx imports leaflet/dist/leaflet.css at the module level", () => {
    const source = read("components/sections/DropRaceLeaflet.tsx");
    // Match either single OR double quotes; only the top of the file
    // matters — the import must execute before the component renders.
    const importLine =
      /^\s*import\s+["']leaflet\/dist\/leaflet\.css["']\s*;?\s*$/m;
    expect(source).toMatch(importLine);

    // Belt and braces: the import must appear before the component
    // function definition.
    const sourceUpToComponent = source.split(/export\s+default\s+function/)[0];
    expect(sourceUpToComponent).toMatch(importLine);
  });

  it("app/globals.css contains a .leaflet-container img rule with max-width: none", () => {
    const css = read("app/globals.css");
    // Tolerant regex: matches the selector + body, allowing whitespace,
    // additional declarations, and trailing semicolons.
    const rule =
      /\.leaflet-container\s+img[^{]*\{[^}]*max-width\s*:\s*none\s*;?[^}]*\}/;
    expect(css).toMatch(rule);
  });

  it("leaflet's CSS file is resolvable at node_modules/leaflet/dist/leaflet.css", () => {
    expect(
      existsSync(join(projectRoot, "node_modules/leaflet/dist/leaflet.css")),
    ).toBe(true);
  });
});

describe("AC-3 — Section height respects sticky header (one source of truth)", () => {
  it("app/globals.css defines the --chonk-header-height custom property", () => {
    const css = read("app/globals.css");
    // The token can live inside :root, @theme, or any selector — we just
    // require the declaration to exist.
    expect(css).toMatch(/--chonk-header-height\s*:\s*\d+\s*px/);
  });

  it("DropRaceLeaflet.tsx section style references --chonk-header-height and does NOT use bare 100vh", () => {
    const source = read("components/sections/DropRaceLeaflet.tsx");

    // The section is the <section aria-label="Drop Race ...">; isolate its
    // inline style by capturing from the section tag to its first child div.
    const sectionMatch = source.match(
      /<section[^>]*aria-label=["']Drop Race[^"']*["'][^>]*style=\{([\s\S]*?)\}\}/,
    );
    expect(sectionMatch).not.toBeNull();
    const sectionStyleBody = sectionMatch![1];

    // Must reference the token via var(--chonk-header-height) — with or
    // without a default fallback (e.g. `var(--chonk-header-height, 72px)`).
    expect(sectionStyleBody).toMatch(/var\(--chonk-header-height\b/);

    // Must NOT use a bare `100vh` value (without calc()) in the height
    // declaration. Tolerant: allow `height: "calc(100vh - var(--...))"` but
    // reject `height: "100vh"` (with or without surrounding whitespace).
    const heightMatch = sectionStyleBody.match(/height\s*:\s*["']([^"']+)["']/);
    expect(heightMatch).not.toBeNull();
    const heightValue = heightMatch![1];
    expect(heightValue).not.toMatch(/^\s*100vh\s*$/);
    // And it should be a calc() expression to be the only correct form.
    expect(heightValue).toMatch(/calc\(/);
  });

  it("Header.tsx consumes --chonk-header-height (no hardcoded h-[72px] / h-18 left behind)", () => {
    const source = read("components/layout/Header.tsx");
    // Either inline style refs var(--chonk-header-height), or a Tailwind
    // arbitrary value h-[var(--chonk-header-height)] / h-[length:--chonk-header-height].
    const referencesToken =
      /var\(--chonk-header-height\)|h-\[var\(--chonk-header-height\)\]|h-\[length:--chonk-header-height\]/;
    expect(source).toMatch(referencesToken);

    // And the literal `h-[72px]` / `h-18` should be gone — otherwise the
    // token isn't a single source of truth.
    expect(source).not.toMatch(/h-\[72px\]/);
  });
});

describe("AC-3 — Cup marker styling (replaces pre-sprint .chonk-pin styles)", () => {
  it("app/globals.css contains .chonk-cup-marker styling with a :hover transform translateY (the bob)", () => {
    const css = read("app/globals.css");

    // Base selector must exist.
    expect(css).toMatch(/\.chonk-cup-marker\b/);

    // :hover rule with translateY — tolerant regex matches either `transform:
    // translateY(-8px)` or `transform: translate(0, -8px)` style declarations.
    const hoverBob =
      /\.chonk-cup-marker[^{}]*:hover[^{}]*\{[^{}]*transform\s*:[^{}]*translate(Y\([^)]*-\d+|\([^,]*,\s*-\d+)/;
    expect(css).toMatch(hoverBob);
  });

  it("honours prefers-reduced-motion (no transform on hover when user requests reduced motion)", () => {
    const css = read("app/globals.css");

    // Contract: hover bob must respect prefers-reduced-motion.
    // Match a `@media (prefers-reduced-motion: reduce)` block that contains
    // a .chonk-cup-marker rule disabling the transition/transform.
    const reducedMotion =
      /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)[\s\S]*?\.chonk-cup-marker/;
    expect(css).toMatch(reducedMotion);
  });

  it("contains styling for the live 3D cup iframe (.cup-iframe)", () => {
    // Marker shape was simplified to iframe-only — no pink wordmark
    // fallback, no vote-count badge. The cup iframe is the entire pin.
    const css = read("app/globals.css");
    expect(css).toMatch(/\.cup-iframe\b/);
  });
});
