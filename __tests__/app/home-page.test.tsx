/**
 * @jest-environment jsdom
 *
 * AC-1 (home section order): the home page composes four sections in
 * order — Map (DropRaceLeaflet) → FlavourGrid (Pick your chonk.) →
 * ComparisonSection (no one's in our weight class) → ProofBar (The
 * receipts). HeroLab is no longer on the home stack; the Drop Race map
 * is the hero moment.
 */
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";

// Mock leaflet because DropRaceLeaflet's useEffect imports it; the actual
// map init is irrelevant to AC-1 — we only assert the page's section shape.
jest.mock("leaflet", () => {
  const noop = jest.fn().mockReturnThis();
  return {
    __esModule: true,
    default: {
      map: jest.fn(() => ({
        setView: noop,
        fitBounds: noop,
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
      latLngBounds: jest.fn(() => ({ pad: noop })),
    },
  };
});

describe("app/page.tsx — AC-1 (home composes 4 sections in order)", () => {
  it("renders DropRaceLeaflet (Drop Race headline copy is in the DOM)", async () => {
    const { default: HomePage } = await import("@/app/page");
    render(<HomePage />);
    expect(
      screen.getByText(/Where should Chonk drop first\?/i),
    ).toBeInTheDocument();
  });

  it("renders all four sections in the expected DOM order: Map → FlavourGrid → ComparisonSection → ProofBar", async () => {
    const { default: HomePage } = await import("@/app/page");
    render(<HomePage />);

    // Pick one stable unique anchor per section.
    const mapEl = screen.getByTestId("drop-race-map");
    const flavourEl = screen.getByText(/Pick your chonk\./i);
    const weightClassEl = screen.getByText(/weight class\./i);
    // ProofBar's eyebrow appears once; the section's aria-label "The receipts"
    // is also unique. Use the eyebrow text.
    const receiptsEl = screen.getByText("The receipts");

    // Each section must follow the previous one in DOM order.
    function follows(a: Element, b: Element) {
      return (
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
      ) !== 0;
    }

    expect(follows(mapEl, flavourEl)).toBe(true);
    expect(follows(flavourEl, weightClassEl)).toBe(true);
    expect(follows(weightClassEl, receiptsEl)).toBe(true);
  });

  it("imports the three restored brand-section components (FlavourGrid / ComparisonSection / ProofBar)", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "app/page.tsx"),
      "utf8",
    );
    // Each must appear as an import. Tolerant of named vs default form.
    expect(src).toMatch(/import[^;]*\bFlavourGrid\b/);
    expect(src).toMatch(/import[^;]*\bComparisonSection\b/);
    expect(src).toMatch(/import[^;]*\bProofBar\b/);
  });

  it("does NOT import HeroLab on the home page (HeroLab now lives at /lab only)", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "app/page.tsx"),
      "utf8",
    );
    // After the click-cinematic restructure HeroLab is off the home stack.
    // The lab route (app/lab/page.tsx) still owns it as a sketchpad.
    expect(src).not.toMatch(/import[^;]*\bHeroLab\b/);
    expect(src).not.toMatch(/<HeroLab\b/);
  });

  it("FlavourGrid section carries id='flavour-grid' so the post-vote scroll can reach it", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "components/sections/FlavourGrid.tsx"),
      "utf8",
    );
    expect(src).toMatch(/id="flavour-grid"/);
  });

  it("does NOT import any of the still-archived section components (IngredientScience / FounderStory / FindUsTeaser / CTABlock)", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "app/page.tsx"),
      "utf8",
    );
    // These four were part of the legacy home page but are deliberately NOT
    // being restored in AC-1. The redesigned home is 5 sections; these stay archived.
    const stillArchived = [
      "IngredientScience",
      "FounderStory",
      "FindUsTeaser",
      "CTABlock",
    ];
    const offenders = stillArchived.filter((name) =>
      new RegExp(`import[^;]*\\b${name}\\b`).test(src),
    );
    expect(offenders).toEqual([]);
  });

  it("does NOT destructure searchParams (or any prop) in the HomePage signature", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "app/page.tsx"),
      "utf8",
    );
    const m = src.match(
      /export\s+default\s+(?:async\s+)?function\s+HomePage\s*\(([^)]*)\)/,
    );
    expect(m).not.toBeNull();
    const signature = (m?.[1] ?? "").trim();
    expect(signature).toBe("");
    expect(src).not.toMatch(/searchParams/);
  });
});

describe("AC-4 cross-cut guard — no /find-us hrefs in components/ or app/", () => {
  /**
   * Walk components/ and app/ for .ts(x) files and assert no string
   * "/find-us" survives the migration.
   */
  function* walk(dir: string): Generator<string> {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) yield* walk(p);
      else yield p;
    }
  }

  it("contains no quoted '/find-us' URL in any tsx/ts file", () => {
    // Tightened from bare `src.includes("/find-us")` — that false-positived
    // on inert documentation comments. The real risk this Poka-Yoke catches
    // is a live URL reference (fetch target, <Link href>, route segment),
    // which is always quoted. Comment text mentioning `/find-us` for
    // historical context is harmless and now permitted.
    const QUOTED_FIND_US = /['"`]\/find-us\b/;
    const roots = ["components", "app"];
    const offenders: string[] = [];
    for (const root of roots) {
      const abs = path.join(process.cwd(), root);
      if (!fs.existsSync(abs)) continue;
      for (const f of walk(abs)) {
        if (!/\.(tsx|ts)$/.test(f)) continue;
        const src = fs.readFileSync(f, "utf8");
        if (QUOTED_FIND_US.test(src)) offenders.push(path.relative(process.cwd(), f));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("app/find-us/ directory does not exist", () => {
    const dir = path.join(process.cwd(), "app/find-us");
    expect(fs.existsSync(dir)).toBe(false);
  });
});
