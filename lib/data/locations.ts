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

/**
 * Pre-launch: no stalls are open. Everything is "coming-soon".
 * Addresses and ETAs are placeholders — the list gets the real drop first.
 */
export const locations: Location[] = [
  {
    id: "perth-first-popup",
    name: "chonk. — First pop-up",
    suburb: "Perth · First pop-up",
    address: "Location dropping to the list first. Markets, gyms, studios — where Perth actually trains.",
    status: "coming-soon",
    hours: [],
    comingSoon: true,
    pin: { x: 52, y: 50, eta: "Soon" },
  },
  {
    id: "perth-north",
    name: "chonk. — Northern suburbs",
    suburb: "Northern suburbs",
    address: "Pop-up #2 in the build. Details to the list.",
    status: "coming-soon",
    hours: [],
    comingSoon: true,
    pin: { x: 38, y: 32, eta: "Later" },
  },
  {
    id: "perth-west",
    name: "chonk. — Coastal",
    suburb: "Coastal",
    address: "Pop-up #3 in the build. Details to the list.",
    status: "coming-soon",
    hours: [],
    comingSoon: true,
    pin: { x: 45, y: 44, eta: "Later" },
  },
];
