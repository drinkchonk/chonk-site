/**
 * Build-your-own chonk — option catalogue and pricing rules.
 *
 * Macros are per serving-as-used in a chonk (not per 100g). Prices are on top
 * of the BASE_CUSTOM_PRICE + per-scoop charge. Ported from the internal order
 * guide; keep in sync with the order app when recipes or supplier specs move.
 */

export type BuilderMacros = {
  kcal: number;
  p: number;
  c: number;
  f: number;
};

export type BuilderOption = {
  id: string;
  name: string;
  price: number;
  serving: string;
  macros: BuilderMacros;
  cat?: string;
};

export const BASES: BuilderOption[] = [
  { id: "full-cream", name: "Whole milk", price: 0, serving: "250ml", macros: { kcal: 160, p: 8, c: 12, f: 9 } },
  { id: "coconut-water", name: "Coconut water", price: 1, serving: "250ml", macros: { kcal: 55, p: 0, c: 13, f: 0 } },
  { id: "oat", name: "Oat milk", price: 1, serving: "250ml", macros: { kcal: 100, p: 2, c: 17, f: 3 } },
  { id: "almond", name: "Almond milk", price: 1, serving: "250ml", macros: { kcal: 40, p: 1, c: 2, f: 3 } },
  { id: "soy", name: "Soy milk", price: 1, serving: "250ml", macros: { kcal: 110, p: 8, c: 10, f: 4 } },
];

export const PROTEINS: BuilderOption[] = [
  { id: "whey-vanilla", name: "Whey vanilla", price: 0, serving: "1 scoop", macros: { kcal: 120, p: 24, c: 3, f: 1 } },
  { id: "whey-choc", name: "Whey chocolate", price: 0, serving: "1 scoop", macros: { kcal: 125, p: 24, c: 4, f: 1 } },
  { id: "raw", name: "Raw whey", price: 0, serving: "1 scoop", macros: { kcal: 110, p: 25, c: 1, f: 1 } },
  { id: "plant", name: "Plant / vegan", price: 1, serving: "1 scoop", macros: { kcal: 120, p: 22, c: 4, f: 2 } },
];

export const FLAVOURS: BuilderOption[] = [
  { id: "banana", name: "Banana", price: 1, cat: "fruit", serving: "1 med", macros: { kcal: 105, p: 1, c: 27, f: 0 } },
  { id: "berries", name: "Mixed berries", price: 1.5, cat: "fruit", serving: "80g", macros: { kcal: 45, p: 1, c: 11, f: 0 } },
  { id: "strawberry", name: "Strawberry", price: 1.5, cat: "fruit", serving: "80g", macros: { kcal: 26, p: 1, c: 6, f: 0 } },
  { id: "mango", name: "Mango", price: 1.5, cat: "fruit", serving: "80g", macros: { kcal: 48, p: 1, c: 12, f: 0 } },
  { id: "greek-yog", name: "Greek yoghurt", price: 1, cat: "dairy", serving: "2 tbsp", macros: { kcal: 35, p: 4, c: 2, f: 1 } },
  { id: "coco-yog", name: "Coconut yoghurt", price: 1.5, cat: "dairy", serving: "2 tbsp", macros: { kcal: 50, p: 0, c: 2, f: 4 } },
  { id: "pb", name: "Peanut butter", price: 1, cat: "nut", serving: "1 tsp", macros: { kcal: 30, p: 1, c: 1, f: 2 } },
  { id: "almond-butter", name: "Almond butter", price: 1.5, cat: "nut", serving: "1 tsp", macros: { kcal: 32, p: 1, c: 1, f: 3 } },
  { id: "cocoa", name: "Cocoa powder", price: 0.5, cat: "powder", serving: "2 tsp", macros: { kcal: 12, p: 1, c: 3, f: 1 } },
  { id: "cinnamon", name: "Cinnamon", price: 0, cat: "powder", serving: "pinch", macros: { kcal: 6, p: 0, c: 2, f: 0 } },
  { id: "milo", name: "Milo", price: 0.5, cat: "powder", serving: "1 tsp", macros: { kcal: 18, p: 0, c: 4, f: 0 } },
  { id: "honey", name: "Honey", price: 0.5, cat: "sweet", serving: "1 tsp", macros: { kcal: 21, p: 0, c: 6, f: 0 } },
  { id: "dates", name: "Dates / date powder", price: 1, cat: "sweet", serving: "1 date", macros: { kcal: 20, p: 0, c: 5, f: 0 } },
  { id: "oats", name: "Rolled oats", price: 0.5, cat: "carb", serving: "1 tbsp", macros: { kcal: 38, p: 1, c: 7, f: 1 } },
  { id: "vanilla-ext", name: "Vanilla extract", price: 0, cat: "powder", serving: "dash", macros: { kcal: 1, p: 0, c: 0, f: 0 } },
];

export const BASE_CUSTOM_PRICE = 2; // cup + labour + blend
export const PROTEIN_SCOOP_PRICE = 2.5; // per scoop charge on top of base
export const MAX_FLAVOURS = 5;
export const MAX_SCOOPS = 4;
