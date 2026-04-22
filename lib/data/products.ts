export type Product = {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  flavourNotes: string[];
  bgColor: string;
  textColor: string;
  featured: boolean;
};

export const products: Product[] = [
  {
    id: "raw",
    name: "Raw",
    tagline: "Clean. Pure. 60g protein.",
    desc:
      "The purest expression of Chonk. Whey isolate, banana, oat milk, honey. No chocolate to hide behind. No flavour tricks. Just 60g of clean protein that tastes like breakfast should.",
    protein: 60,
    calories: 380,
    carbs: 32,
    fat: 5,
    ingredients: [
      "Whey Isolate",
      "Banana",
      "Oat Milk",
      "Honey",
      "No Added Sugar",
    ],
    flavourNotes: ["Vanilla", "Banana", "Oat"],
    bgColor: "#C8E8C0",
    textColor: "#1A1614",
    featured: true,
  },
  {
    id: "choc-chonk",
    name: "Choc Chonk",
    tagline: "Chocolate. That earns it.",
    desc:
      "Raw cacao, peanut butter, banana and whey. Tastes like the milkshake you loved as a kid — except it also contains the protein you'd need across three meals to hit a 60g target.",
    protein: 60,
    calories: 460,
    carbs: 38,
    fat: 10,
    ingredients: [
      "Whey Isolate",
      "Cacao",
      "Peanut Butter",
      "Banana",
      "No Added Sugar",
    ],
    flavourNotes: ["Chocolate", "Peanut Butter", "Banana"],
    bgColor: "#6B4423",
    textColor: "#FEF6EC",
    featured: true,
  },
  {
    id: "chonky-monkey",
    name: "Chonky Monkey",
    tagline: "Banana-forward fuel.",
    desc:
      "Double banana, peanut butter, oat milk, honey. The heaviest carb load on the menu — built for after long sessions, climbs, or anything that left you in a hole.",
    protein: 60,
    calories: 430,
    carbs: 44,
    fat: 8,
    ingredients: [
      "Whey Isolate",
      "Banana",
      "Peanut Butter",
      "Oat Milk",
      "Honey",
      "No Added Sugar",
    ],
    flavourNotes: ["Banana", "Peanut Butter", "Oat"],
    bgColor: "#F4D35E",
    textColor: "#1A1614",
    featured: true,
  },
  {
    id: "lite",
    name: "Lite",
    tagline: "50g. Same Chonk rules.",
    desc:
      "Same whey isolate. Same no-sugar-added promise. 50g of protein at 320 calories — for mornings, smaller frames, or back-to-back training days where you want the hit without the heft.",
    protein: 50,
    calories: 320,
    carbs: 28,
    fat: 4,
    ingredients: [
      "Whey Isolate",
      "Strawberry",
      "Banana",
      "Oat Milk",
      "Honey",
      "No Added Sugar",
    ],
    flavourNotes: ["Strawberry", "Banana", "Vanilla"],
    bgColor: "#FFD8F3",
    textColor: "#1A1614",
    featured: false,
  },
];

export const featuredProducts = products.filter((p) => p.featured);
