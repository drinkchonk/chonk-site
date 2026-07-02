import { products, featuredProducts } from "@/lib/data/products";

describe("products data", () => {
  it("contains all three flavours", () => {
    const ids = products.map((p) => p.id).sort();
    expect(ids).toEqual(["choc-chonk", "chonkey-monkey", "lite"]);
  });

  it("every featured product has a 50g two-scoop build", () => {
    expect(featuredProducts).toHaveLength(3);
    featuredProducts.forEach((p) => expect(p.scoops[2].proteinG).toBe(50));
  });

  it("every product has a 25g one-scoop and a 50g two-scoop build", () => {
    products.forEach((p) => {
      expect(p.scoops[1].proteinG).toBe(25);
      expect(p.scoops[2].proteinG).toBe(50);
    });
  });

  it("two-scoop is priced higher than one-scoop for every flavour", () => {
    products.forEach((p) => {
      expect(p.scoops[2].price).toBeGreaterThan(p.scoops[1].price);
    });
  });

  it("Lite is featured (promoted to the homepage lineup when Raw was retired)", () => {
    const lite = products.find((p) => p.id === "lite")!;
    expect(lite.featured).toBe(true);
  });

  it("every product carries non-empty ingredients and flavour notes", () => {
    products.forEach((p) => {
      expect(p.ingredients.length).toBeGreaterThan(0);
      expect(p.flavourNotes.length).toBeGreaterThan(0);
    });
  });

  it("every product uses contrasting bg/text colours from the brand palette", () => {
    const allowedBg = ["#C8E8C0", "#6B4423", "#F4D35E", "#F2B8CC"];
    const allowedText = ["#1A1614", "#FEF6EC"];
    products.forEach((p) => {
      expect(allowedBg).toContain(p.bgColor);
      expect(allowedText).toContain(p.textColor);
    });
  });
});
