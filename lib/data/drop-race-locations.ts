/**
 * Drop Race Map — gyms + suburb demand zones around the City of Stirling,
 * Perth. Powers the Leaflet pins on the home demand-capture landing.
 *
 * Coordinates are real-ish; the `votes` count is the seed vote tally
 * shown on first paint. Final values come from the Google Form tracker
 * downstream, not from this file.
 */

export type DropRaceLocationKind = "gym" | "suburb";

export type DropRaceLocation = {
  id: string;
  kind: DropRaceLocationKind;
  name: string;
  suburb: string;
  lat: number;
  lng: number;
  votes: number;
};

export const DROP_RACE_LOCATIONS: DropRaceLocation[] = [
  // Gyms
  { id: "revo-scar",    kind: "gym",    name: "Revo Scarborough",     suburb: "Scarborough",   lat: -31.8930, lng: 115.7580, votes: 18 },
  { id: "f45-karri",    kind: "gym",    name: "F45 Karrinyup",        suburb: "Karrinyup",     lat: -31.8770, lng: 115.7780, votes: 8 },
  { id: "plus-innaloo", kind: "gym",    name: "Plus Fitness Innaloo", suburb: "Innaloo",       lat: -31.8930, lng: 115.7990, votes: 5 },
  { id: "anytime-stir", kind: "gym",    name: "Anytime Stirling",     suburb: "Stirling",      lat: -31.8830, lng: 115.8080, votes: 3 },
  // Suburb demand zones
  { id: "scarborough",  kind: "suburb", name: "Scarborough",          suburb: "Scarborough",   lat: -31.8970, lng: 115.7620, votes: 24 },
  { id: "karrinyup",    kind: "suburb", name: "Karrinyup",            suburb: "Karrinyup",     lat: -31.8700, lng: 115.7720, votes: 14 },
  { id: "innaloo",      kind: "suburb", name: "Innaloo",              suburb: "Innaloo",       lat: -31.8970, lng: 115.8040, votes: 11 },
  { id: "doubleview",   kind: "suburb", name: "Doubleview",           suburb: "Doubleview",    lat: -31.9050, lng: 115.7820, votes: 9 },
  { id: "woodlands",    kind: "suburb", name: "Woodlands",            suburb: "Woodlands",     lat: -31.9050, lng: 115.7960, votes: 6 },
  { id: "wembley-dw",   kind: "suburb", name: "Wembley Downs",        suburb: "Wembley Downs", lat: -31.9180, lng: 115.7700, votes: 5 },
  { id: "osborne-pk",   kind: "suburb", name: "Osborne Park",         suburb: "Osborne Park",  lat: -31.9020, lng: 115.8160, votes: 7 },
  { id: "stirling",     kind: "suburb", name: "Stirling",             suburb: "Stirling",      lat: -31.8780, lng: 115.8000, votes: 4 },
];
