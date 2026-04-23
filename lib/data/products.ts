export type ScoopVariant = {
  price: number;
  proteinG: number; // whey-isolate grams (the hero number)
  calories: number;
  carbs: number;
  fat: number;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  ingredients: string[];
  flavourNotes: string[];
  bgColor: string;
  textColor: string;
  featured: boolean;
  /** Per-scoop build — 1 scoop (25g whey) or 2 scoops (50g whey). */
  scoops: { 1: ScoopVariant; 2: ScoopVariant };
};

/**
 * The classics as of pre-launch. Every chonk comes in 1 scoop (25g whey) or
 * 2 scoops (50g whey) — the hero number on this site is the 2-scoop build.
 * Honey is a natural sweetener in Choc Chonk and Chonkey Monkey. Raw is the
 * stripped-back speed-build: whey and whole milk, that's it.
 *
 * Macros are from the formulation spec. protein figures here count whey
 * isolate specifically (the marketable claim). Total dietary protein runs
 * slightly higher once milk/yoghurt are factored in — honest upside.
 */
export const products: Product[] = [
  {
    id: "choc-chonk",
    name: "Choc Chonk",
    tagline: "The original chocolate hit.",
    desc:
      "Whey isolate (Vanilla + Raw), raw cocoa, slightly salted peanut butter, Greek or coconut yoghurt, banana, whole milk, a touch of honey. Creamy, rich, indulgent — the milkshake you loved as a kid, stacked with 50g of complete whey-forward protein.",
    ingredients: [
      "Whey Isolate (Vanilla + Raw)",
      "Greek or Coconut Yoghurt",
      "Banana",
      "Cocoa",
      "Slightly Salted Peanut Butter",
      "Whole Milk",
      "Honey",
    ],
    flavourNotes: ["Chocolate", "Peanut Butter", "Banana"],
    bgColor: "#6B4423",
    textColor: "#FEF6EC",
    featured: true,
    scoops: {
      1: { price: 8.5, proteinG: 25, calories: 360, carbs: 31, fat: 12 },
      2: { price: 11, proteinG: 50, calories: 470, carbs: 32, fat: 13 },
    },
  },
  {
    id: "chonkey-monkey",
    name: "Chonkey Monkey",
    tagline: "Banana forward, cinnamon finish.",
    desc:
      "Whey isolate (Vanilla + Raw), Greek yoghurt, banana, whole milk, a sprinkle of cinnamon, a drizzle of honey. Smooth, classic, balanced — 50g of complete protein, and the cinnamon does double duty on flavour and blood-sugar response.",
    ingredients: [
      "Whey Isolate (Vanilla + Raw)",
      "Greek Yoghurt",
      "Banana",
      "Whole Milk",
      "Cinnamon",
      "Honey",
    ],
    flavourNotes: ["Banana", "Honey", "Greek Yogurt"],
    bgColor: "#F4D35E",
    textColor: "#1A1614",
    featured: true,
    scoops: {
      1: { price: 8.5, proteinG: 25, calories: 328, carbs: 38, fat: 6 },
      2: { price: 11, proteinG: 50, calories: 438, carbs: 39, fat: 7 },
    },
  },
  {
    id: "raw",
    name: "Raw",
    tagline: "Milk + whey. That’s it.",
    desc:
      "The purest expression of a chonk. Whey isolate, whole milk, done. No fruit, no frills. Built for the gym-bag crowd who want the protein and want it now — speed build, full stop.",
    ingredients: ["Whey Isolate (Vanilla + Raw)", "Whole Milk"],
    flavourNotes: ["Vanilla", "Milk"],
    bgColor: "#C8E8C0",
    textColor: "#1A1614",
    featured: true,
    scoops: {
      1: { price: 4.5, proteinG: 25, calories: 250, carbs: 12, fat: 8 },
      2: { price: 7, proteinG: 50, calories: 370, carbs: 15, fat: 9 },
    },
  },
  {
    id: "lite",
    name: "Lite",
    tagline: "Protein slushy, beach mode.",
    desc:
      "Whey isolate, coconut water, coconut yoghurt, mixed berries, banana, blended long for a slushy finish. Light, icy, refreshing — same 50g protein anchor, none of the heft. No milk.",
    ingredients: [
      "Whey Isolate",
      "Coconut Water",
      "Coconut Yoghurt",
      "Mixed Berries",
      "Banana",
    ],
    flavourNotes: ["Berry", "Coconut", "Banana"],
    bgColor: "#F2B8CC",
    textColor: "#1A1614",
    featured: false,
    scoops: {
      1: { price: 8.5, proteinG: 25, calories: 307, carbs: 40, fat: 5 },
      2: { price: 11, proteinG: 50, calories: 427, carbs: 43, fat: 6 },
    },
  },
];

export const featuredProducts = products.filter((p) => p.featured);
