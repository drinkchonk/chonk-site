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
import userEvent from "@testing-library/user-event";
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

// matchMedia helper — every test starts in reduced-motion mode so the
// cinematic flow is bypassed and the existing assertions (click → modal)
// keep their original semantics. The new "cinematic flow (motion-OK)"
// describe-block flips this to exercise the cinematic path.
//
// Direct assignment (not Object.defineProperty) because jest.setup.ts
// declares window.matchMedia as `writable: true, configurable: false`,
// so we can only overwrite the value, not redefine the descriptor.
function setMatchMediaReducedMotion(reduced: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any;
}

describe("<DropRaceLeaflet />", () => {
  beforeEach(() => {
    // Default: reduced-motion = true so the click handler takes the
    // direct-modal branch. Existing tests written against that flow
    // keep working without modification.
    setMatchMediaReducedMotion(true);
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
      // legacy .chonk-pin div — and embeds the live 3D hero in marker mode.
      for (let i = 0; i < L.divIcon.mock.calls.length; i++) {
        const opts = L.divIcon.mock.calls[i][0];
        expect(opts.html).toContain("chonk-cup-marker");
        expect(opts.html).toContain("/chonk-hero.html#marker");
      }
    });

    it("marker iconSize is 40x40 centered (iconAnchor 20,20) so the cup sits exactly on the lat/lng", async () => {
      await renderComponent();
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;

      await waitFor(() =>
        expect(L.divIcon).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length),
      );

      for (let i = 0; i < L.divIcon.mock.calls.length; i++) {
        const opts = L.divIcon.mock.calls[i][0];
        expect(opts.iconSize).toEqual([40, 40]);
        expect(opts.iconAnchor).toEqual([20, 20]);
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

  describe("AC-4 (revised): marker click opens vote modal; localStorage gate enforces one open per browser", () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it("AC-2: clicking a marker opens the vote modal and does NOT increment votes yet", async () => {
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;
      await renderComponent();
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length);
      });

      // No modal before click.
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      const marker = L.marker.mock.results[0].value;
      const clickHandler = marker.on.mock.calls.find(
        (c: unknown[]) => c[0] === "click",
      )?.[1] as () => void;
      expect(clickHandler).toBeDefined();

      const initialTotal = DROP_RACE_LOCATIONS.reduce(
        (acc, l) => acc + l.votes,
        0,
      );
      act(() => clickHandler());

      // Modal opens; vote count unchanged (votes only bump after submit).
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
      expect(
        screen.getByTestId("drop-race-total-votes").textContent,
      ).toContain(String(initialTotal));
    });

    it("AC-3: when localStorage 'chonk:launchVote:voted' is set, clicking does NOT open the modal and does NOT bump votes", async () => {
      // Gate must be set BEFORE render so the hydration effect picks it up.
      window.localStorage.setItem(
        "chonk:launchVote:voted",
        DROP_RACE_LOCATIONS[0].id,
      );

      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;
      await renderComponent();
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length);
      });

      const marker = L.marker.mock.results[0].value;
      const clickHandler = marker.on.mock.calls.find(
        (c: unknown[]) => c[0] === "click",
      )?.[1] as () => void;

      const initialTotal = DROP_RACE_LOCATIONS.reduce(
        (acc, l) => acc + l.votes,
        0,
      );
      act(() => clickHandler());

      // Gate engaged — modal stays closed, vote count unchanged.
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(
        screen.getByTestId("drop-race-total-votes").textContent,
      ).toContain(String(initialTotal));
    });

    it("AC-4: submitting the form bumps the vote by +1, sets localStorage, and closes the modal", async () => {
      // The outer beforeEach already mocked global.fetch as a plain object
      // returning { ok: true, json: () => ({ok: true}) } — re-use it (jsdom
      // doesn't define the Response constructor, so jest.spyOn(global,"fetch")
      // .mockResolvedValue(new Response(...)) crashes with ReferenceError).
      const fetchMock = global.fetch as jest.Mock;

      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;
      await renderComponent();
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length);
      });

      const clickedLoc = DROP_RACE_LOCATIONS[0]; // Revo Scarborough (gym)
      const marker = L.marker.mock.results[0].value;
      const clickHandler = marker.on.mock.calls.find(
        (c: unknown[]) => c[0] === "click",
      )?.[1] as () => void;

      act(() => clickHandler());
      await waitFor(() =>
        expect(screen.getByRole("dialog")).toBeInTheDocument(),
      );

      // Gym target — suburb + gym fields are pre-filled from target prop.
      // Only name + email are required to fill manually.
      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/First name/i), "Sam");
      await user.type(screen.getByLabelText(/Email/i), "sam@example.com");

      const initialTotal = DROP_RACE_LOCATIONS.reduce(
        (acc, l) => acc + l.votes,
        0,
      );
      await user.click(
        screen.getByRole("button", { name: /Submit My Vote/i }),
      );

      // Confirm the POST landed on /api/launch-vote.
      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/launch-vote",
          expect.objectContaining({ method: "POST" }),
        );
      });

      // (a) Vote count bumped by exactly +1.
      await waitFor(() => {
        expect(
          screen.getByTestId("drop-race-total-votes").textContent,
        ).toContain(String(initialTotal + 1));
      });

      // (b) localStorage gate engaged with the clicked locationId.
      expect(window.localStorage.getItem("chonk:launchVote:voted")).toBe(
        clickedLoc.id,
      );

      // (c) Modal removed from DOM.
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("AC-5: opening then closing the modal without submitting does NOT bump votes, set localStorage, or engage the gate", async () => {
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;
      await renderComponent();
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length);
      });

      const marker = L.marker.mock.results[0].value;
      const clickHandler = marker.on.mock.calls.find(
        (c: unknown[]) => c[0] === "click",
      )?.[1] as () => void;

      // First click opens the modal.
      act(() => clickHandler());
      await waitFor(() =>
        expect(screen.getByRole("dialog")).toBeInTheDocument(),
      );

      const initialTotal = DROP_RACE_LOCATIONS.reduce(
        (acc, l) => acc + l.votes,
        0,
      );

      // Close via the modal's × button (aria-label="Close").
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Close/i }));

      // Modal removed from DOM.
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
      );

      // Vote count unchanged — close without submit must NOT call bumpVote.
      expect(
        screen.getByTestId("drop-race-total-votes").textContent,
      ).toContain(String(initialTotal));

      // localStorage gate untouched — close without submit must NOT setItem.
      expect(window.localStorage.getItem("chonk:launchVote:voted")).toBeNull();

      // Subsequent click reopens the modal — proves the gate is not engaged.
      act(() => clickHandler());
      await waitFor(() =>
        expect(screen.getByRole("dialog")).toBeInTheDocument(),
      );
    });

    it("AC-4 banner: after a successful submit, a '✓ Vote locked for {Name}' banner appears", async () => {
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;
      await renderComponent();
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length);
      });

      const clickedLoc = DROP_RACE_LOCATIONS[0]; // Revo Scarborough (gym)
      const marker = L.marker.mock.results[0].value;
      const clickHandler = marker.on.mock.calls.find(
        (c: unknown[]) => c[0] === "click",
      )?.[1] as () => void;

      // No banner before submit.
      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      act(() => clickHandler());
      await waitFor(() =>
        expect(screen.getByRole("dialog")).toBeInTheDocument(),
      );

      const user = userEvent.setup();
      await user.type(screen.getByLabelText(/First name/i), "Sam");
      await user.type(screen.getByLabelText(/Email/i), "sam@example.com");
      await user.click(
        screen.getByRole("button", { name: /Submit My Vote/i }),
      );

      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
      );

      // Banner appears with the location's name in the copy.
      const banner = screen.getByRole("status");
      expect(banner).toHaveTextContent(/Vote locked for/i);
      expect(banner).toHaveTextContent(new RegExp(clickedLoc.name, "i"));
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

  /**
   * Direct pin-click behaviour (no cinematic).
   *
   * The click-cinematic was removed (too clunky, not enough value). A pin
   * click now goes straight to the vote modal (fresh voter) or scrolls to
   * FlavourGrid (returning voter) — the SAME behaviour regardless of the
   * user's motion preference. These tests run in motion-OK mode to prove
   * the cinematic no longer intercepts the click for anyone.
   */
  describe("AC-6: pin click is direct, no cinematic overlay", () => {
    beforeEach(() => {
      // motion-OK: the removed cinematic used to branch here. Prove that a
      // motion-OK user now gets the direct modal too.
      setMatchMediaReducedMotion(false);
      window.localStorage.clear();
    });

    async function getFirstMarkerClickHandler() {
      const leaflet = await import("leaflet");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = leaflet.default as any;
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(DROP_RACE_LOCATIONS.length);
      });
      const marker = L.marker.mock.results[0].value;
      const handler = marker.on.mock.calls.find(
        (c: unknown[]) => c[0] === "click",
      )?.[1] as () => void;
      expect(handler).toBeDefined();
      return handler;
    }

    it("fresh voter (motion-OK): click opens the vote modal immediately — no cinematic-done needed", async () => {
      await renderComponent();
      const handler = await getFirstMarkerClickHandler();

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      act(() => handler());

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("no cinematic overlay iframe is ever mounted", async () => {
      await renderComponent();
      expect(
        screen.queryByTestId("chonk-cinematic-iframe"),
      ).not.toBeInTheDocument();
    });

    it("the section carries no data-cinematic-state attribute", async () => {
      await renderComponent();
      const section = screen.getByLabelText(
        /Drop Race demand-capture landing/i,
      );
      expect(section.hasAttribute("data-cinematic-state")).toBe(false);
    });

    it("returning voter (motion-OK): click scrolls to FlavourGrid, opens no modal, bumps no votes", async () => {
      window.localStorage.setItem(
        "chonk:launchVote:voted",
        DROP_RACE_LOCATIONS[0].id,
      );
      // scrollToFlavourGrid() targets #flavour-grid — that section lives on
      // the home page, not inside this component, so inject a stand-in.
      const flavourGrid = document.createElement("div");
      flavourGrid.id = "flavour-grid";
      document.body.appendChild(flavourGrid);

      await renderComponent();
      const handler = await getFirstMarkerClickHandler();

      const initialTotal = DROP_RACE_LOCATIONS.reduce(
        (acc, l) => acc + l.votes,
        0,
      );
      act(() => handler());

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(flavourGrid.scrollIntoView).toHaveBeenCalled();
      expect(
        screen.getByTestId("drop-race-total-votes").textContent,
      ).toContain(String(initialTotal));
    });
  });
});
