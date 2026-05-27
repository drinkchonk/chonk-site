/**
 * @jest-environment jsdom
 *
 * AC-4 guardrails on app/page.tsx — home page is the demand-capture
 * landing and only the demand-capture landing.
 */
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";

// Mock leaflet because DropRaceLeaflet's useEffect imports it; the actual
// map init is irrelevant to AC-4 — we only assert the page's section shape.
jest.mock("leaflet", () => {
  const noop = jest.fn().mockReturnThis();
  return {
    __esModule: true,
    default: {
      map: jest.fn(() => ({
        setView: noop,
        addLayer: noop,
        remove: jest.fn(),
        on: noop,
        off: noop,
      })),
      tileLayer: jest.fn(() => ({ addTo: noop, remove: jest.fn() })),
      divIcon: jest.fn(() => ({})),
      marker: jest.fn(() => ({
        addTo: noop,
        on: noop,
        bindTooltip: noop,
        remove: jest.fn(),
      })),
      layerGroup: jest.fn(() => ({
        addTo: noop,
        addLayer: jest.fn(),
        clearLayers: jest.fn(),
        remove: jest.fn(),
      })),
    },
  };
});

describe("app/page.tsx — AC-4 (home is demand-capture landing)", () => {
  it("renders DropRaceLeaflet (Drop Race headline copy is in the DOM)", async () => {
    const { default: HomePage } = await import("@/app/page");
    render(<HomePage />);
    expect(
      screen.getByText(/Where should Chonk drop first\?/i),
    ).toBeInTheDocument();
  });

  it("does NOT import any of the archived home-page section components", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "app/page.tsx"),
      "utf8",
    );
    const archived = [
      "HeroLab",
      "FlavourGrid",
      "ProofBar",
      "ComparisonSection",
      "IngredientScience",
      "FounderStory",
      "FindUsTeaser",
      "CTABlock",
    ];
    const offenders = archived.filter((name) =>
      new RegExp(`import[^;]*\\b${name}\\b`).test(src),
    );
    expect(offenders).toEqual([]);
  });

  it("does NOT destructure searchParams (or any prop) in the HomePage signature", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "app/page.tsx"),
      "utf8",
    );
    // Match the function signature: export default (async)? function HomePage(<sig>)
    const m = src.match(
      /export\s+default\s+(?:async\s+)?function\s+HomePage\s*\(([^)]*)\)/,
    );
    expect(m).not.toBeNull();
    const signature = (m?.[1] ?? "").trim();
    // Empty signature is the only acceptable form.
    expect(signature).toBe("");
    // Belt-and-braces: the word "searchParams" must not appear in the file.
    expect(src).not.toMatch(/searchParams/);
  });
});

describe("AC-4 cross-cut guard — no /find-us hrefs in components/ or app/", () => {
  /**
   * Walk components/ and app/ for .ts(x) files and assert no string
   * "/find-us" survives the migration. The /api/launch-vote/route.ts
   * file is allowed to mention "/find-us" inside comments per the
   * contract (documents the API's backwards-compat path).
   */
  function* walk(dir: string): Generator<string> {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) yield* walk(p);
      else yield p;
    }
  }

  it("contains no '/find-us' string in any tsx/ts file (api comments excepted)", () => {
    const roots = ["components", "app"];
    const offenders: string[] = [];
    for (const root of roots) {
      const abs = path.join(process.cwd(), root);
      if (!fs.existsSync(abs)) continue;
      for (const f of walk(abs)) {
        if (!/\.(tsx|ts)$/.test(f)) continue;
        if (f.endsWith(path.join("api", "launch-vote", "route.ts"))) continue;
        const src = fs.readFileSync(f, "utf8");
        if (src.includes("/find-us")) offenders.push(path.relative(process.cwd(), f));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("app/find-us/ directory does not exist", () => {
    const dir = path.join(process.cwd(), "app/find-us");
    expect(fs.existsSync(dir)).toBe(false);
  });
});
