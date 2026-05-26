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

export const DROP_RACE_LOCATIONS: DropRaceLocation[] = [];
