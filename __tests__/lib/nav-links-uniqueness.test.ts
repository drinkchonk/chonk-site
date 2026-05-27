import { readFileSync } from "fs";
import { join } from "path";

/**
 * Structural Poka-Yoke guards for the two top-level nav arrays.
 *
 * Source of the AC-1 React-19 crash: `Header.tsx` had two `navLinks` entries
 * with the same `href` ("/"), which `key={link.href}` then collided on.
 * These tests grep the source files directly so the guard survives even if
 * the array shape later changes or moves between files.
 */

const projectRoot = join(__dirname, "..", "..");

function extractHrefs(source: string, arrayName: string): string[] {
  const arrayMatch = source.match(
    new RegExp(`const\\s+${arrayName}\\s*=\\s*\\[([\\s\\S]*?)\\];`),
  );
  if (!arrayMatch) {
    throw new Error(
      `Could not find \`const ${arrayName} = [...]\` in source — has the array been renamed or moved?`,
    );
  }
  const hrefMatches = [...arrayMatch[1].matchAll(/href:\s*"([^"]+)"/g)];
  return hrefMatches.map((m) => m[1]);
}

describe("nav-link uniqueness (structural Poka-Yoke)", () => {
  it("Header.tsx navLinks has no duplicate href values", () => {
    const source = readFileSync(
      join(projectRoot, "components/layout/Header.tsx"),
      "utf-8",
    );
    const hrefs = extractHrefs(source, "navLinks");
    expect(hrefs.length).toBeGreaterThan(0);
    const unique = new Set(hrefs);
    expect(Array.from(unique).sort()).toEqual([...hrefs].sort());
    expect(unique.size).toBe(hrefs.length);
  });

  it("Footer.tsx exploreLinks has no duplicate href values", () => {
    const source = readFileSync(
      join(projectRoot, "components/layout/Footer.tsx"),
      "utf-8",
    );
    const hrefs = extractHrefs(source, "exploreLinks");
    expect(hrefs.length).toBeGreaterThan(0);
    const unique = new Set(hrefs);
    expect(Array.from(unique).sort()).toEqual([...hrefs].sort());
    expect(unique.size).toBe(hrefs.length);
  });
});
