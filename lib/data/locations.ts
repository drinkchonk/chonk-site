export type Location = {
  id: string;
  name: string;
  suburb: string;
  address: string;
  status: "open" | "coming-soon";
  hours: { day: string; time: string }[];
  comingSoon?: boolean;
  /** Optional rough map coordinates (%) for the Find Us page pins. */
  pin?: { x: number; y: number; eta?: string };
};

export const locations: Location[] = [
  {
    id: "osborne-park",
    name: "Chonk Osborne Park",
    suburb: "Osborne Park",
    address: "Stirling Leisure Centres — Osborne Park, WA 6017",
    status: "open",
    hours: [
      { day: "Mon–Fri", time: "6:00am — 8:00pm" },
      { day: "Sat", time: "7:00am — 5:00pm" },
      { day: "Sun", time: "8:00am — 4:00pm" },
    ],
    pin: { x: 38, y: 32 },
  },
  {
    id: "perth-cbd",
    name: "Chonk Perth CBD",
    suburb: "Perth CBD",
    address: "Forrest Pl, Perth WA 6000",
    status: "coming-soon",
    hours: [],
    comingSoon: true,
    pin: { x: 52, y: 56, eta: "Q2 2026" },
  },
  {
    id: "leederville",
    name: "Chonk Leederville",
    suburb: "Leederville",
    address: "Oxford St, Leederville WA 6007",
    status: "coming-soon",
    hours: [],
    comingSoon: true,
    pin: { x: 45, y: 44, eta: "Q3 2026" },
  },
];
