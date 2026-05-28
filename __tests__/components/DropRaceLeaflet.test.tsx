/**
 * @jest-environment jsdom
 */
import {
  act,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { DROP_RACE_LOCATIONS } from "@/lib/data/drop-race-locations";

/**
 * Leaflet relies on real DOM measurements jsdom can't provide. Mock the
 * module so DropRaceLeaflet's `await import('leaflet')` resolves to a
 * fixture that exercises every method the component calls.
 */
jest.mock("leaflet", () => {
  const tile = { addTo: jest.fn().mockReturnThis(), remove: jest.fn() };
  const marker = {
    addTo: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    bindTooltip: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  };
  const layerGroup = {
    addTo: jest.fn().mockReturnThis(),
    addLayer: jest.fn(),
    clearLayers: jest.fn(),
    remove: jest.fn(),
  };
  const mapInstance = {
    setView: jest.fn().mockReturnThis(),
    fitBounds: jest.fn().mockReturnThis(),
    addLayer: jest.fn().mockReturnThis(),
    removeLayer: jest.fn(),
    remove: jest.fn(),
    on: jest.fn().mockReturnThis(),
    off: jest.fn().mockReturnThis(),
  };
  const boundsObject = { pad: jest.fn().mockReturnThis() };
  const L = {
    map: jest.fn(() => mapInstance),
    tileLayer: jest.fn(() => tile),
    divIcon: jest.fn(() => ({})),
    marker: jest.fn(() => marker),
    layerGroup: jest.fn(() => layerGroup),
    latLngBounds: jest.fn(() => boundsObject),
  };
  return { __esModule: true, default: L, ...L };
});

describe("<DropRaceLeaflet />", () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollIntoView, which Leaflet/popups can call.
    Element.prototype.scrollIntoView = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  async function renderComponent() {
    const { default: DropRaceLeaflet } = await import(
      "@/components/sections/DropRaceLeaflet"
    );
    return render(<DropRaceLeaflet />);
  }

  it("renders the headline 'Where should Chonk drop first?'", async () => {
    await renderComponent();
    expect(
      screen.getByText(/Where should Chonk drop first\?/i),
    ).toBeInTheDocument();
  });

  it("renders the live total-votes counter equal to sum(DROP_RACE_LOCATIONS.votes)", async () => {
    await renderComponent();
    const expectedTotal = DROP_RACE_LOCATIONS.reduce(
      (acc, l) => acc + l.votes,
      0,
    );
    // The counter has a unique testid so we can pinpoint it.
    const counter = screen.getByTestId("drop-race-total-votes");
    expect(counter.textContent).toContain(String(expectedTotal));
  });

  it("renders top-3 suburbs by aggregated votes (gym + suburb) in correct order", async () => {
    await renderComponent();
    const leaderboard = screen.getByTestId("drop-race-leaderboard");
    const rows = within(leaderboard).getAllByTestId(/^lb-row-/);
    expect(rows).toHaveLength(3);
    // Scarborough: 18 (revo gym) + 24 (suburb zone) = 42
    // Karrinyup:   8 (f45)      + 14            = 22
    // Innaloo:     5 (plus)     + 11            = 16
    expect(rows[0].textContent).toMatch(/Scarborough/);
    expect(rows[0].textContent).toContain("42");
    expect(rows[1].textContent).toMatch(/Karrinyup/);
    expect(rows[1].textContent).toContain("22");
    expect(rows[2].textContent).toMatch(/Innaloo/);
    expect(rows[2].textContent).toContain("16");
  });

  it("initialises the Leaflet map only on the client (uses dynamic import)", async () => {
    await renderComponent();
    const leaflet = await import("leaflet");
    // The component should have called L.map() during its client-side
    // useEffect — proving the dynamic-import path executed.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((leaflet.default as any).map).toHaveBeenCalled();
  });

  it("renders the 'Current Drop Race' leaderboard heading", async () => {
    await renderComponent();
    expect(screen.getByText(/Current Drop Race/i)).toBeInTheDocument();
  });

  describe("AC-3: cup-marker integration", () => {
    it("L.divIcon is called 12 times with cup-marker HTML", async () => {
      await renderComponent();
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;

      await waitFor(() =>
        expect(L.divIcon).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length),
      );

      // Every marker uses the cup-marker shape — none are left as the
      // legacy .chonk-pin div.
      for (let i = 0; i < L.divIcon.mock.calls.length; i++) {
        const opts = L.divIcon.mock.calls[i][0];
        expect(opts.html).toContain("chonk-cup-marker");
        expect(opts.html).toContain("/chonk-cup-marker.webm");
      }
    });

    it("each marker's HTML reflects the matching location's vote count", async () => {
      await renderComponent();
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;

      await waitFor(() =>
        expect(L.divIcon).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length),
      );

      // The iteration order in DropRaceLeaflet mirrors DROP_RACE_LOCATIONS,
      // so call i corresponds to location i.
      for (let i = 0; i < DROP_RACE_LOCATIONS.length; i++) {
        const opts = L.divIcon.mock.calls[i][0];
        expect(opts.html).toContain(String(DROP_RACE_LOCATIONS[i].votes));
      }
    });
  });

  describe("AC-2: frozen map + auto-fit bounds", () => {
    it("L.map is called with all six interaction-disabling options (frozen view)", async () => {
      await renderComponent();
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;

      await waitFor(() => expect(L.map).toHaveBeenCalled());

      const opts = L.map.mock.calls[0][1];
      // All six interaction surfaces are locked. Each false is load-bearing —
      // a stray `true` (or missing key) means a way for users to break the view.
      expect(opts).toMatchObject({
        dragging: false,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      });
    });

    it("L.latLngBounds is called with all 12 marker [lat,lng] pairs", async () => {
      await renderComponent();
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;

      await waitFor(() => expect(L.latLngBounds).toHaveBeenCalled());

      const arg = L.latLngBounds.mock.calls[0][0];
      expect(arg).toHaveLength(DROP_RACE_LOCATIONS.length);
      for (const loc of DROP_RACE_LOCATIONS) {
        expect(arg).toContainEqual([loc.lat, loc.lng]);
      }
    });

    it("map.fitBounds is called (with padding) instead of setView", async () => {
      await renderComponent();
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;

      await waitFor(() =>
        expect(L.map.mock.results[0].value.fitBounds).toHaveBeenCalled(),
      );

      const mapInstance = L.map.mock.results[0].value;
      const fitBoundsCall = mapInstance.fitBounds.mock.calls[0];
      // Second arg should include padding so markers don't kiss the viewport edge.
      expect(fitBoundsCall[1]).toMatchObject({
        padding: expect.any(Array),
      });
      // The interaction lock makes setView obsolete; we shouldn't be calling it.
      expect(mapInstance.setView).not.toHaveBeenCalled();
    });
  });

  describe("AC-4: vote-only marker click (Google Forms removed)", () => {
    it("clicking a map marker increments that location's vote count by +1 without opening a modal", async () => {
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;

      await renderComponent();

      // Wait for the async useEffect (Leaflet dynamic import + map setup) to
      // create all 12 markers. The shared marker-mock captures every .on()
      // call across all markers.
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length);
      });

      const initialTotal = DROP_RACE_LOCATIONS.reduce(
        (acc, l) => acc + l.votes,
        0,
      );
      expect(
        screen.getByTestId("drop-race-total-votes").textContent,
      ).toContain(String(initialTotal));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Pluck the first marker's click handler from the mock's call log.
      const marker = L.marker.mock.results[0].value;
      const clickCalls = marker.on.mock.calls.filter(
        (c: unknown[]) => c[0] === "click",
      );
      expect(clickCalls.length).toBe(DROP_RACE_LOCATIONS.length);

      const firstHandler = clickCalls[0][1];
      act(() => firstHandler());

      // After click: total votes +1, NO modal opened.
      await waitFor(() => {
        expect(
          screen.getByTestId("drop-race-total-votes").textContent,
        ).toContain(String(initialTotal + 1));
      });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not render the 'Vote My Gym' or 'Join First-Drop List' modal-opener CTAs", async () => {
      await renderComponent();
      expect(
        screen.queryByRole("button", { name: /Vote My Gym/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Join First-Drop List/i }),
      ).not.toBeInTheDocument();
    });

    it("copy no longer claims 'Votes locked live' (honest about local-only state)", async () => {
      await renderComponent();
      expect(screen.queryByText(/Votes locked live/i)).not.toBeInTheDocument();
      // Replacement copy steers the user toward the marker-click action.
      expect(
        screen.getByText(/Tap your gym or suburb to lock a vote/i),
      ).toBeInTheDocument();
    });
  });
});
