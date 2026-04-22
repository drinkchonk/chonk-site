import {
  references,
  referenceSections,
  ingredients,
  synergies,
} from "@/lib/data/references";

describe("references data", () => {
  it("contains exactly 15 peer-reviewed sources", () => {
    expect(references).toHaveLength(15);
  });

  it("uses contiguous 1-based ids", () => {
    const ids = references.map((r) => r.id).sort((a, b) => a - b);
    ids.forEach((id, i) => expect(id).toBe(i + 1));
  });

  it("preserves first-occurrence ordering of section headings", () => {
    const seen: string[] = [];
    references.forEach((r) => {
      if (!seen.includes(r.section)) seen.push(r.section);
    });
    expect(referenceSections).toEqual(seen);
  });

  it("every reference has a journal, year, and either a doi or an explicit empty string", () => {
    references.forEach((r) => {
      expect(r.journal).toBeTruthy();
      expect(r.year).toMatch(/^\d{4}$/);
      expect(r.loe.length).toBeGreaterThan(20);
      expect(typeof r.doi).toBe("string");
    });
  });
});

describe("ingredients & synergies", () => {
  it("each ingredient cites only valid reference ids", () => {
    const validIds = new Set(references.map((r) => r.id));
    ingredients.forEach((ing) => {
      expect(ing.refs.length).toBeGreaterThan(0);
      ing.refs.forEach((id) => expect(validIds.has(id)).toBe(true));
    });
  });

  it("each synergy cites only valid reference ids", () => {
    const validIds = new Set(references.map((r) => r.id));
    synergies.forEach((s) => {
      expect(s.refs.length).toBeGreaterThan(0);
      s.refs.forEach((id) => expect(validIds.has(id)).toBe(true));
    });
  });

  it("ingredient category colours look like 6-digit hex", () => {
    ingredients.forEach((ing) => {
      expect(ing.categoryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(ing.categoryText).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
