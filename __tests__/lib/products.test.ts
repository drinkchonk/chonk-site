import { products, featuredProducts } from "@/lib/data/products";

describe("products data", () => {
  it("contains all four flavours", () => {
    const ids = products.map((p) => p.id).sort();
    expect(ids).toEqual(["choc-chonk", "chonky-monkey", "lite", "raw"]);
  });

  it("has every featured product at 60g protein", () => {
    expect(featuredProducts).toHaveLength(3);
    featuredProducts.forEach((p) => expect(p.protein).toBe(60));
  });

  it("Lite is the only sub-60g flavour and is not featured", () => {
    const lite = products.find((p) => p.id === "lite")!;
    expect(lite.featured).toBe(false);
    expect(lite.protein).toBe(50);
  });

  it("every product carries non-empty ingredients and flavour notes", () => {
    products.forEach((p) => {
      expect(p.ingredients.length).toBeGreaterThan(0);
      expect(p.flavourNotes.length).toBeGreaterThan(0);
    });
  });

  it("every product uses contrasting bg/text colours from the brand palette", () => {
    const allowedBg = ["#C8E8C0", "#6B4423", "#F4D35E", "#FFD8F3"];
    const allowedText = ["#1A1614", "#FEF6EC"];
    products.forEach((p) => {
      expect(allowedBg).toContain(p.bgColor);
      expect(allowedText).toContain(p.textColor);
    });
  });
});
