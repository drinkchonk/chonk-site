export type Reference = {
  id: number;
  section: string;
  authors: string;
  title: string;
  journal: string;
  year: string;
  vol: string;
  page: string;
  doi: string;
  loe: string;
};

/**
 * Citation list for the Science/Ingredient claims made on the home page
 * and the dedicated /references route.
 *
 * Each reference carries a Level of Evidence (LOE) note summarising why it
 * supports the corresponding claim — matches what's shown on the page.
 */
export const references: Reference[] = [
  // Whey protein, casein and muscle protein synthesis
  {
    id: 1,
    section: "Whey protein, casein and muscle protein synthesis",
    authors: "Jager R, Kerksick CM, Campbell BI, et al.",
    title:
      "International Society of Sports Nutrition Position Stand: protein and exercise.",
    journal: "J Int Soc Sports Nutr.",
    year: "2017",
    vol: "14",
    page: "20",
    doi: "10.1186/s12970-017-0177-8",
    loe: "Position Stand (ISSN). Establishes leucine threshold (700–3,000 mg) for MPS stimulation, fast vs slow protein kinetics, and the whey + casein complementary model.",
  },
  {
    id: 2,
    section: "Whey protein, casein and muscle protein synthesis",
    authors: "Kerksick CM, Wilborn CD, Roberts MD, et al.",
    title:
      "International Society of Sports Nutrition Position Stand: nutrient timing.",
    journal: "J Int Soc Sports Nutr.",
    year: "2017",
    vol: "14",
    page: "33",
    doi: "10.1186/s12970-017-0189-4",
    loe: "Position Stand (ISSN). Supports the 30-min post-exercise anabolic window, protein + carbohydrate co-ingestion for glycogen and MPS.",
  },
  {
    id: 3,
    section: "Whey protein, casein and muscle protein synthesis",
    authors: "Nunes EA, Colenso-Semple L, McKellar SR, et al.",
    title: "Current perspectives on protein supplementation in athletes.",
    journal: "Nutrients.",
    year: "2025",
    vol: "17(22)",
    page: "3528",
    doi: "10.3390/nu17223528",
    loe: "Narrative review. Confirms whey as most effective fast protein for acute MPS; casein sustains aminoacidemia for hours; blends extend anabolic window.",
  },
  // Raw honey
  {
    id: 4,
    section:
      "Raw honey — carbohydrate metabolism, recovery and antioxidant properties",
    authors: "Hills SP, Mitchell P, Wells C, Russell M.",
    title: "Honey supplementation and exercise: a systematic review.",
    journal: "Nutrients.",
    year: "2019",
    vol: "11(7)",
    page: "1586",
    doi: "10.3390/nu11071586",
    loe: "Systematic review (PRISMA). Confirms honey as low-GI multi-transport carbohydrate for endurance athletes; antioxidant and immunological effects noted.",
  },
  {
    id: 5,
    section:
      "Raw honey — carbohydrate metabolism, recovery and antioxidant properties",
    authors: "Sukri SSM, Ooi FK, Chen CK.",
    title:
      "Effects of honey on exercise performance and health components: a systematic review.",
    journal: "Sci Sports.",
    year: "2018",
    vol: "33(6)",
    page: "e247–e261",
    doi: "10.1016/j.scispo.2018.01.003",
    loe: "Systematic review (PRISMA). 13 RCTs analysed. Honey reduced DOMS, CK and lactate post-exercise vs glucose controls; anti-inflammatory properties documented.",
  },
  // Banana
  {
    id: 6,
    section: "Banana — electrolytes, B6 and carbohydrate delivery",
    authors: "Nieman DC, Gillitt ND, Henson DA, et al.",
    title: "Bananas as an energy source during exercise: a metabolomics approach.",
    journal: "PLOS ONE.",
    year: "2012",
    vol: "7(5)",
    page: "e37479",
    doi: "10.1371/journal.pone.0037479",
    loe: "RCT crossover. Bananas matched sports drink for 75 km cycling performance; dopamine and serotonin metabolites from banana uniquely modulated inflammation vs glucose only.",
  },
  {
    id: 7,
    section: "Banana — electrolytes, B6 and carbohydrate delivery",
    authors: "Volpe SL.",
    title: "Magnesium and the athlete.",
    journal: "Curr Sports Med Rep.",
    year: "2015",
    vol: "14(4)",
    page: "279–283",
    doi: "10.1249/JSR.0000000000000178",
    loe: "Narrative review. Confirms potassium and magnesium as primary electrolytes for muscle contraction; B6 role in amino acid metabolism and protein synthesis.",
  },
  // Raw cacao
  {
    id: 8,
    section:
      "Raw cacao — vascular function, nitric oxide and oxidative stress",
    authors: "Fraga CG, Actis-Goretta L, Ottaviani JI, et al.",
    title:
      "Regular consumption of a flavanol-rich chocolate can improve oxidant stress in young soccer players.",
    journal: "Clin Dev Immunol.",
    year: "2005",
    vol: "12(1)",
    page: "11–17",
    doi: "10.1080/17402520400004031",
    loe: "RCT. 4-week intervention. Epicatechin-rich cacao reduced oxidative stress markers in athletes; NO-mediated vasodilation documented.",
  },
  {
    id: 9,
    section:
      "Raw cacao — vascular function, nitric oxide and oxidative stress",
    authors: "Katz DL, Doughty K, Ali A.",
    title: "Cocoa and chocolate in human health and disease.",
    journal: "Antioxidants & Redox Signaling.",
    year: "2011",
    vol: "15(10)",
    page: "2779–2811",
    doi: "10.1089/ars.2010.3697",
    loe: "Comprehensive review. Confirms epicatechin stimulates eNOS → nitric oxide → vasodilation. Magnesium and iron content supports aerobic metabolism.",
  },
  // Peanut butter
  {
    id: 10,
    section: "Peanut butter — magnesium, vitamin E and sustained energy",
    authors: "Zhang Y, Xun P, Wang R, Mao L, He K.",
    title: "Can magnesium enhance exercise performance?",
    journal: "Nutrients.",
    year: "2017",
    vol: "9(9)",
    page: "946",
    doi: "10.3390/nu9090946",
    loe: "Systematic review. Magnesium deficiency impairs exercise performance; supplementation improves glucose availability, lactate clearance and oxygen uptake efficiency.",
  },
  {
    id: 11,
    section: "Peanut butter — magnesium, vitamin E and sustained energy",
    authors: "Taghiyar M, Darvishi L, Askari G, et al.",
    title:
      "The effect of vitamin C and E supplementation on muscle damage and oxidative stress.",
    journal: "Int J Prev Med.",
    year: "2013",
    vol: "4(Suppl 1)",
    page: "S16–S23",
    doi: "",
    loe: "RCT. Vitamin E reduces exercise-induced lipid peroxidation and DOMS; fat-soluble delivery via food matrix (peanut butter) provides sustained release.",
  },
  // Cinnamon
  {
    id: 12,
    section: "Cinnamon — insulin sensitivity and glucose metabolism",
    authors: "Costello RB, Dwyer JT, Saldanha L, et al.",
    title:
      "Do cinnamon supplements have a role in glycemic control in type 2 diabetes? A narrative review.",
    journal: "J Acad Nutr Diet.",
    year: "2016",
    vol: "116(11)",
    page: "1794–1802",
    doi: "10.1016/j.jand.2016.07.015",
    loe: "Narrative review. Cinnamaldehyde improves insulin receptor signalling; chromium enhances insulin sensitivity — smoothing post-exercise blood sugar recovery.",
  },
  {
    id: 13,
    section: "Cinnamon — insulin sensitivity and glucose metabolism",
    authors: "Al-Habori M, Al-Aghbari A, Al-Mamary M, Baker M.",
    title: "Honey, cinnamon and HSP-70.",
    journal: "Int J Food Sci Nutr.",
    year: "2014",
    vol: "65(3)",
    page: "338–345",
    doi: "10.3109/09637486.2013.854749",
    loe: "In vitro and animal study. Honey + cinnamon combination upregulated HSP-70 (heat shock protein) in exercised models — relevant to recovery from thermal and mechanical stress.",
  },
  // Full cream milk
  {
    id: 14,
    section: "Full cream milk — casein, calcium and recovery",
    authors: "Hartman JW, Tang JE, Wilkinson SB, et al.",
    title:
      "Consumption of fat-free fluid milk after resistance exercise promotes greater lean mass accretion than consumption of soy or carbohydrate.",
    journal: "Am J Clin Nutr.",
    year: "2007",
    vol: "86(2)",
    page: "373–381",
    doi: "10.1093/ajcn/86.2.373",
    loe: "RCT (12 weeks). Milk post-resistance exercise produced greater lean mass and strength gains than soy protein or carbohydrate isocaloric controls.",
  },
  {
    id: 15,
    section: "Full cream milk — casein, calcium and recovery",
    authors: "Cockburn E, Hayes PR, French DN, et al.",
    title:
      "Acute milk-based protein–CHO supplementation attenuates exercise-induced muscle damage.",
    journal: "Appl Physiol Nutr Metab.",
    year: "2008",
    vol: "33(4)",
    page: "775–783",
    doi: "10.1139/H08-057",
    loe: "RCT crossover. Milk + carbohydrate post-exercise attenuated CK and myoglobin elevation vs carbohydrate alone; supports milk as whole-food recovery matrix.",
  },
];

/** Ordered list of section headings as they appear on the References page. */
export const referenceSections: string[] = Array.from(
  new Set(references.map((r) => r.section))
);

/** Ingredient cards rendered in the "How it stacks up" / Science section. */
export type Ingredient = {
  name: string;
  category: string;
  categoryColor: string;
  categoryText: string;
  keyNutrients: string;
  detail: string;
  refs: number[];
};

export const ingredients: Ingredient[] = [
  {
    name: "Whey protein",
    category: "Muscle synthesis",
    categoryColor: "#C8E8C0",
    categoryText: "#2A5A30",
    keyNutrients: "BCAAs (20–26%), leucine ~11%, cysteine → glutathione",
    detail:
      "Fastest-digesting complete protein. Leucine directly triggers muscle protein synthesis. Cysteine boosts your primary intracellular antioxidant.",
    refs: [1, 2, 3],
  },
  {
    name: "Raw honey",
    category: "Fuel + recovery",
    categoryColor: "#FFD4B8",
    categoryText: "#8A4A10",
    keyNutrients: "Glucose + fructose, flavonoids, phenolic acids, enzymes",
    detail:
      "Dual-pathway carb absorption means sustained energy without crash. Shown to reduce lactate, creatine kinase, and DOMS markers post-exercise. GI-friendly vs commercial gels.",
    refs: [4, 5],
  },
  {
    name: "Banana",
    category: "Energy + electrolytes",
    categoryColor: "#FEF6EC",
    categoryText: "#7A5A10",
    keyNutrients: "Potassium, B6, vitamin C, natural sugars, resistant starch",
    detail:
      "Potassium is the primary electrolyte for muscle contraction and preventing cramps. B6 supports protein metabolism. Adds creamy texture and fast-release carbs.",
    refs: [6, 7],
  },
  {
    name: "Raw cacao",
    category: "Vascular + antioxidant",
    categoryColor: "#E8D5F0",
    categoryText: "#5A2A7A",
    keyNutrients: "Epicatechin (flavanol), magnesium, iron, theobromine",
    detail:
      "Flavanols stimulate nitric oxide production — widening blood vessels, improving oxygen delivery to muscle, and reducing the oxygen cost of exercise. Also reduces exercise-induced oxidative stress.",
    refs: [8, 9],
  },
  {
    name: "Peanut butter",
    category: "Endurance + fat",
    categoryColor: "#D4B896",
    categoryText: "#6A3A10",
    keyNutrients: "Mg, vitamin E, niacin (B3), manganese, monounsaturated fats",
    detail:
      "Magnesium supports muscle function, energy metabolism, and reduces fatigue. Vitamin E is a fat-soluble antioxidant protecting cell membranes during oxidative stress from training.",
    refs: [10, 11],
  },
  {
    name: "Cinnamon",
    category: "Blood sugar control",
    categoryColor: "#FFD4B8",
    categoryText: "#8A3A10",
    keyNutrients: "Cinnamaldehyde, polyphenols, chromium",
    detail:
      "Improves insulin sensitivity and glucose uptake — smoothing the blood sugar curve from the shake's carbs. Combined with honey in research on athletic antioxidant formulas, it upregulated heat shock protein (HSP-70).",
    refs: [12, 13],
  },
  {
    name: "Full cream milk",
    category: "Baseline nutrition",
    categoryColor: "#C8E8C0",
    categoryText: "#2A5A30",
    keyNutrients: "Calcium, phosphorus, casein, B12, riboflavin, iodine",
    detail:
      "Provides the slow-digesting casein to complement whey's fast action — extending the anabolic window. Calcium and phosphorus support bone density under load.",
    refs: [14, 15],
  },
  {
    name: "Ice",
    category: "Recovery aid",
    categoryColor: "#E8D5F0",
    categoryText: "#3A4A7A",
    keyNutrients: "Cooling, palatability, GI tolerance",
    detail:
      "Cold temperatures slow gastric emptying slightly, extending nutrient absorption. Improves palatability post-workout when body temp is elevated — increasing likelihood of hitting the critical 30-min recovery window.",
    refs: [2],
  },
];

export type Synergy = {
  title: string;
  body: string;
  refs: number[];
};

export const synergies: Synergy[] = [
  {
    title: "Whey + milk → extended anabolic window",
    body:
      "Fast (whey) + slow (casein from milk) protein creates a sustained amino acid release profile — covering both the immediate post-workout spike and the hours-long repair phase. Research shows combining fast and slow-digesting proteins maximises muscle protein synthesis vs either alone.",
    refs: [1, 2, 3],
  },
  {
    title: "Honey + banana → dual-transport carb delivery",
    body:
      "Honey's glucose + fructose are absorbed via separate transporters in the gut simultaneously, while banana adds B6 to help process the incoming amino acids. This is the same logic behind commercial sports drinks using multiple carb sources — you're hitting it here with whole food.",
    refs: [4, 5, 6],
  },
  {
    title: "Cacao + cinnamon → vascular + metabolic amplifier",
    body:
      "Cacao's epicatechin raises nitric oxide, widening blood vessels and improving nutrient delivery. Cinnamon's polyphenols improve insulin sensitivity, meaning the nutrients delivered through those widened vessels are taken up more efficiently by muscle cells. These two compounds stack mechanistically.",
    refs: [8, 9, 12, 13],
  },
  {
    title: "Peanut butter → sustained energy + antioxidant buffer",
    body:
      "The monounsaturated fats slow overall digestion and provide a slow-burning energy substrate. Magnesium (critical for ATP production) and vitamin E (lipid-soluble antioxidant) address two key limiting factors in heavy training — energy availability and cell membrane protection from oxidative damage.",
    refs: [10, 11],
  },
];
