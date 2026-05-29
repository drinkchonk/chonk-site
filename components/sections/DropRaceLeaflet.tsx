"use client";

import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DROP_RACE_LOCATIONS,
  type DropRaceLocation,
} from "@/lib/data/drop-race-locations";
import { cupMarkerHtml } from "@/components/ui/CupMarker";
import DropRaceVoteModal, {
  type DropRaceVoteTarget,
} from "@/components/forms/DropRaceVoteModal";

type LocalLocation = DropRaceLocation;

/**
 * cinematicState — the click-cinematic finite state machine.
 *
 *   idle    → no overlay, map fully interactive.
 *   playing → cinematic iframe snapped to clicked-pin rect + animating to
 *             fullscreen. Map tiles + UI chrome + other pins fading out.
 *             Click anywhere skips to the end.
 *   voting  → cinematic at fullscreen, vote form composited on top.
 *             (Fresh voters only — returning voters skip this state.)
 *   done    → form submitted / closed / returning voter finishing.
 *             Smooth-scrolling the document to FlavourGrid. After a short
 *             timeout the overlay resets to idle so subsequent visits are
 *             clean (no leftover cinematic frame visible if the user
 *             scrolls back up to the map).
 */
type CinematicState = "idle" | "playing" | "voting" | "done";

// 5s cinematic: zoom 1.0s, pause 0.5s, lift 1.25s, over_straw 0.75s,
// descend 0.75s, helix 0.75s. The 0.5s pause after the establishing
// zoom is Sam's explicit ask — without it the camera lift bleeds
// into the zoom and reads as a single tilt instead of two motions.
// Keep this in sync with `cinematicDurMs` in public/chonk-cinematic.html
// (locked at 5000 by the chonk-cinematic.test.ts duration assertion).
const CINEMATIC_DURATION_MS = 5000;
// Safety margin: if the iframe stalls and never emits chonk-cinematic-done,
// the React-side timeout still advances state so the user is never
// stranded mid-cinematic. 500ms over the duration covers normal frame
// jitter without forcing a premature jump.
const CINEMATIC_TIMEOUT_MS = 5500;

function aggregateSuburbVotes(locations: LocalLocation[]) {
  const byName = new Map<string, number>();
  for (const l of locations) {
    byName.set(l.suburb, (byName.get(l.suburb) ?? 0) + l.votes);
  }
  return Array.from(byName.entries())
    .map(([suburb, votes]) => ({ suburb, votes }))
    .sort((a, b) => b.votes - a.votes);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function scrollToFlavourGrid() {
  if (typeof document === "undefined") return;
  const el = document.getElementById("flavour-grid");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function DropRaceLeaflet() {
  const [locations, setLocations] = useState<LocalLocation[]>(() =>
    DROP_RACE_LOCATIONS.map((l) => ({ ...l })),
  );
  const [modalLocationId, setModalLocationId] = useState<string | null>(null);
  // votedLocationId mirrors hasVotedRef but as state — it drives the
  // post-submit confirmation banner re-render. The ref handles click-time
  // gating; state handles render-time UI.
  const [votedLocationId, setVotedLocationId] = useState<string | null>(null);
  // hasVotedRef holds the locationId this browser previously voted for, or
  // null. Stored in a ref (not state) so the click-handler closure reads the
  // CURRENT value at click-time rather than the snapshot captured when the
  // Leaflet map was built — flipping the gate doesn't force a map rebuild.
  const hasVotedRef = useRef<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // ─── Cinematic state ────────────────────────────────────────────────
  const [cinematicState, setCinematicState] = useState<CinematicState>("idle");
  const [activeLocId, setActiveLocId] = useState<string | null>(null);
  // Mirror activeLocId into a ref so the message-handler closure (set up
  // once on mount) always reads the current id at the moment the iframe
  // emits chonk-cinematic-done.
  const activeLocIdRef = useRef<string | null>(null);
  useEffect(() => {
    activeLocIdRef.current = activeLocId;
  }, [activeLocId]);

  // Leaflet map instance — captured inside the map-init useEffect so the
  // click handler can call flyTo() against it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  // The pre-loaded cinematic iframe — mounted off-screen at idle so the
  // Three.js scene is already booted (chonk-cup-ready already fired) when
  // the user clicks a pin. Snaps to the clicked-pin rect, then transitions
  // to fullscreen in one tween.
  const cinematicIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Safety timer: if the iframe's chonk-cinematic-done never arrives
  // (WebGL context loss, blocked, manual frame stall), force the
  // transition so the user is never stranded mid-cinematic.
  const cinematicTimeoutRef = useRef<number | null>(null);

  // Hydration: read localStorage AFTER mount only (SSR-safe). Returning
  // voters get the gate engaged AND the banner rendered before their first
  // click. The setState-in-effect here IS the canonical SSR-safe pattern:
  // localStorage is unavailable during SSR, so the initial state is `null`,
  // and this effect promotes the stored value after mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("chonk:launchVote:voted");
    if (stored) {
      hasVotedRef.current = stored;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVotedLocationId(stored);
    }
  }, []);

  const totalVotes = useMemo(
    () => locations.reduce((acc, l) => acc + l.votes, 0),
    [locations],
  );

  const leaderboard = useMemo(
    () => aggregateSuburbVotes(locations).slice(0, 3),
    [locations],
  );

  function bumpVote(id: string) {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, votes: l.votes + 1 } : l)),
    );
  }

  // ─── Cinematic helpers ──────────────────────────────────────────────

  /** Wipe overlay state + tell the cinematic iframe to reset its internals
   *  so it's clean for any subsequent click. */
  const resetCinematic = useCallback(() => {
    setCinematicState("idle");
    setActiveLocId(null);
    if (cinematicTimeoutRef.current !== null) {
      window.clearTimeout(cinematicTimeoutRef.current);
      cinematicTimeoutRef.current = null;
    }
    const iframe = cinematicIframeRef.current;
    if (iframe) {
      // Park the iframe back off-screen and clear inline sizing so the CSS
      // rules take over again at idle.
      iframe.style.transition = "none";
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      iframe.style.width = "320px";
      iframe.style.height = "320px";
      iframe.style.opacity = "0";
      try {
        iframe.contentWindow?.postMessage(
          { type: "chonk-cinematic-reset" },
          "*",
        );
      } catch {
        /* iframe gone or cross-origin — fine */
      }
    }
  }, []);

  /** Finish the cinematic: branch on whether the user has already voted.
   *  Fresh voters get the form; returning voters dissolve straight to the
   *  scroll-to-FlavourGrid finish. */
  const handleCinematicDone = useCallback(() => {
    if (cinematicTimeoutRef.current !== null) {
      window.clearTimeout(cinematicTimeoutRef.current);
      cinematicTimeoutRef.current = null;
    }

    if (hasVotedRef.current) {
      // Returning voter — no form, scroll to FlavourGrid and reset.
      setCinematicState("done");
      scrollToFlavourGrid();
      window.setTimeout(resetCinematic, 800);
      return;
    }

    // Fresh voter — composite the form on top of the cinematic.
    const id = activeLocIdRef.current;
    if (id) {
      setCinematicState("voting");
      setModalLocationId(id);
    } else {
      // Defensive: if somehow activeLocId got cleared, just reset.
      resetCinematic();
    }
  }, [resetCinematic]);

  // Single mount-time message listener for iframe events. activeLocId is
  // read via ref so we can leave this listener attached for the component's
  // lifetime without re-binding on every state change.
  useEffect(() => {
    function handler(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      const t = (e.data as { type?: unknown }).type;
      if (t === "chonk-cinematic-done") {
        handleCinematicDone();
      }
      // chonk-cinematic-progress is emitted ~20Hz but the React side
      // doesn't need per-frame sync — CSS transitions handle the map
      // tile + UI fade. Future: could drive a progress bar from this.
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [handleCinematicDone]);

  /** Start the cinematic for a given pin: snap the cinematic iframe to the
   *  pin's screen rect, kick off the size tween toward fullscreen, dispatch
   *  the play message to the iframe, and trigger a Leaflet flyTo. */
  const startCinematic = useCallback(
    (loc: LocalLocation) => {
      const pinEl = document.querySelector<HTMLElement>(
        `.chonk-cup-marker[data-loc-id="${loc.id}"]`,
      );
      const iframe = cinematicIframeRef.current;
      if (!pinEl || !iframe) {
        // DOM not ready — fall back to direct behaviour so the user is
        // never stranded.
        if (hasVotedRef.current) {
          scrollToFlavourGrid();
        } else {
          setModalLocationId(loc.id);
        }
        return;
      }

      const rect = pinEl.getBoundingClientRect();

      // Flip cinematic state FIRST so CSS rules (map fade, UI fade, other
      // markers fade) start at the same instant as the iframe snap.
      setActiveLocId(loc.id);
      setCinematicState("playing");

      // Snap-then-tween: kill the transition for the snap to pinRect, force
      // a reflow so the new origin is committed, then re-enable the tween
      // toward fullscreen on the next frame.
      iframe.style.transition = "none";
      iframe.style.top = `${rect.top}px`;
      iframe.style.left = `${rect.left}px`;
      iframe.style.width = `${rect.width}px`;
      iframe.style.height = `${rect.height}px`;
      iframe.style.opacity = "1";
      iframe.style.visibility = "visible";
      // Reflow.
      void iframe.offsetHeight;

      requestAnimationFrame(() => {
        if (!iframe) return;
        iframe.style.transition =
          "top 3.5s cubic-bezier(0.16, 0.84, 0.44, 1), " +
          "left 3.5s cubic-bezier(0.16, 0.84, 0.44, 1), " +
          "width 3.5s cubic-bezier(0.16, 0.84, 0.44, 1), " +
          "height 3.5s cubic-bezier(0.16, 0.84, 0.44, 1), " +
          "opacity 240ms ease-out";
        iframe.style.top = "0px";
        iframe.style.left = "0px";
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";

        try {
          iframe.contentWindow?.postMessage(
            { type: "chonk-cinematic-play", durationMs: CINEMATIC_DURATION_MS },
            "*",
          );
        } catch {
          /* fall through to safety timer */
        }
      });

      // Map flyTo — zooms toward the clicked pin's lat/lng in sync with
      // the iframe growth. Wrapped in try/catch because the test mock
      // doesn't implement flyTo.
      const map = mapInstanceRef.current;
      if (map && typeof map.flyTo === "function") {
        try {
          map.flyTo([loc.lat, loc.lng], 16, { duration: 1.6 });
        } catch {
          /* swallow — flyTo missing on test mock or older Leaflet */
        }
      }

      // Safety timer: if the iframe never emits done, force the transition.
      if (cinematicTimeoutRef.current !== null) {
        window.clearTimeout(cinematicTimeoutRef.current);
      }
      cinematicTimeoutRef.current = window.setTimeout(() => {
        handleCinematicDone();
      }, CINEMATIC_TIMEOUT_MS);
    },
    [handleCinematicDone],
  );

  // Each cup-marker iframe posts {type: 'chonk-cup-ready'} once its 3D
  // scene has rendered a frame AND its texture image has loaded. Until
  // then the marker stays invisible (default opacity: 0 in CSS). When the
  // signal arrives we flag the matching wrapper with data-cup-ready so
  // its reveal keyframes fire — making the appearance feel deliberate
  // rather than a loading fade-in over an empty iframe.
  useEffect(() => {
    function handler(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      if ((e.data as { type?: unknown }).type !== "chonk-cup-ready") return;
      const iframes = document.querySelectorAll<HTMLIFrameElement>(
        ".chonk-cup-marker .cup-iframe",
      );
      for (const f of Array.from(iframes)) {
        if (f.contentWindow === e.source) {
          const wrapper = f.closest<HTMLElement>(".chonk-cup-marker");
          if (wrapper) wrapper.dataset.cupReady = "true";
        }
      }
    }
    window.addEventListener("message", handler);

    // Fallback: if a marker hasn't reported ready in 5s (broken iframe,
    // blocked CDN, mobile WebGL eviction), reveal it anyway so the map
    // never has invisible holes where pins should be.
    const fallback = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>(
          ".chonk-cup-marker:not([data-cup-ready])",
        )
        .forEach((el) => {
          el.dataset.cupReady = "true";
        });
    }, 5000);

    return () => {
      window.removeEventListener("message", handler);
      window.clearTimeout(fallback);
    };
  }, []);

  // Client-only Leaflet init via dynamic import — keeps Next SSR happy.
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      if (!mapContainerRef.current) return;
      try {
        const leaflet = await import("leaflet");
        if (cancelled || !mapContainerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L: any = (leaflet as any).default ?? leaflet;
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: true,
          // Frozen view: every interaction surface is locked so the map
          // stays clamped to the bounds we compute below. No zoom controls,
          // no drag, no scroll-zoom, no pinch-zoom, no double-click-zoom,
          // no rubber-band box-zoom, no keyboard pans/zooms. flyTo (used
          // during the cinematic) bypasses these locks — it's an
          // imperative animation, not a user-driven interaction.
          dragging: false,
          scrollWheelZoom: false,
          touchZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        });
        mapInstanceRef.current = map;
        const bounds = L.latLngBounds(
          DROP_RACE_LOCATIONS.map((l) => [l.lat, l.lng] as [number, number]),
        );
        map.fitBounds(bounds, { padding: [40, 40] });
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
          {
            subdomains: "abcd",
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        ).addTo(map);
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
          { subdomains: "abcd", maxZoom: 19, opacity: 0.95 },
        ).addTo(map);
        const markerGroup = L.layerGroup().addTo(map);
        for (const loc of locations) {
          const icon = L.divIcon({
            className: "chonk-cup-marker-icon",
            html: cupMarkerHtml(loc),
            // 40×40 centered on the lat/lng; the iframe-mode hero renders
            // the cup at its origin so the visible cup body lands on the
            // exact map coordinate.
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
          const m = L.marker([loc.lat, loc.lng], { icon }).addTo(markerGroup);
          m.bindTooltip(
            `<strong>${loc.name}</strong><br/><span style="opacity:.7">${loc.kind === "gym" ? "Gym" : "Zone"} · ${loc.suburb}</span>`,
            { direction: "top", offset: [0, -10] },
          );
          m.on("click", () => {
            // Branch the click on motion preference + voted state.
            // - reduced-motion: skip cinematic entirely; behave like the
            //   pre-restructure flow (modal opens directly, or returning
            //   voter scrolls to FlavourGrid).
            // - motion-ok:      play the cinematic, then form (fresh) or
            //   scroll (returning voter).
            // The gate (hasVotedRef) lives at click-time so a same-session
            // submit immediately gates further clicks before the next
            // page-load picks up localStorage.
            const reduced = prefersReducedMotion();
            const voted = !!hasVotedRef.current;

            if (reduced) {
              if (voted) {
                scrollToFlavourGrid();
              } else {
                setModalLocationId(loc.id);
              }
              return;
            }

            // Motion-OK: cinematic plays for everyone.
            startCinematic(loc);
          });
        }
        cleanup = () => {
          map.remove();
          mapInstanceRef.current = null;
        };
      } catch {
        // Leaflet failed to load (e.g. in a test env that doesn't mock it);
        // the static React UI still renders.
      }
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [locations, startCinematic]);

  // On unmount: clear any pending safety timer.
  useEffect(() => {
    return () => {
      if (cinematicTimeoutRef.current !== null) {
        window.clearTimeout(cinematicTimeoutRef.current);
        cinematicTimeoutRef.current = null;
      }
    };
  }, []);

  const modalTarget: DropRaceVoteTarget = modalLocationId
    ? (() => {
        const loc = DROP_RACE_LOCATIONS.find((l) => l.id === modalLocationId);
        return loc
          ? { id: loc.id, name: loc.name, suburb: loc.suburb, kind: loc.kind }
          : null;
      })()
    : null;

  // Skip the cinematic mid-flight — click anywhere over the cinematic
  // iframe forwards a skip message to the iframe (which backdates its
  // internal clock so the next animate() tick reads t=1 and emits done).
  const handleSkip = useCallback(() => {
    const iframe = cinematicIframeRef.current;
    try {
      iframe?.contentWindow?.postMessage(
        { type: "chonk-cinematic-skip" },
        "*",
      );
    } catch {
      /* fall through to safety timer */
    }
  }, []);

  return (
    <section
      aria-label="Drop Race demand-capture landing"
      data-cinematic-state={cinematicState}
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - var(--chonk-header-height, 72px))",
        background: "var(--color-ink)",
        overflow: "hidden",
      }}
    >
      <div
        ref={mapContainerRef}
        data-testid="drop-race-map"
        style={{ position: "absolute", inset: 0 }}
      />

      <div
        className="chonk-map-chrome"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          display: "flex",
          gap: 16,
          justifyContent: "space-between",
          pointerEvents: "none",
          zIndex: 400,
        }}
      >
        <div
          style={{
            background: "var(--color-milk)",
            borderRadius: 16,
            padding: "16px 20px",
            maxWidth: 360,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            pointerEvents: "auto",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              lineHeight: 1.2,
              color: "var(--color-ink)",
            }}
          >
            Where should Chonk drop first?
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              color: "var(--color-muted)",
            }}
          >
            Tap your gym or suburb to lock a vote.
          </p>
          {votedLocationId && (
            <div
              role="status"
              className="text-eyebrow"
              style={{
                background: "var(--color-pink)",
                color: "var(--color-ink)",
                padding: "8px 14px",
                borderRadius: "var(--radius-pill)",
                marginTop: 10,
                boxShadow: "var(--shadow-card)",
                display: "inline-block",
              }}
            >
              ✓ Vote locked for{" "}
              {
                DROP_RACE_LOCATIONS.find((l) => l.id === votedLocationId)
                  ?.name
              }
              . One per person — see you at the drop.
            </div>
          )}
        </div>

        <div
          style={{
            background: "var(--color-milk)",
            borderRadius: 16,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            pointerEvents: "auto",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-pink)",
              boxShadow: "0 0 0 0 var(--color-pink)",
              animation: "chonk-live-pulse 1.6s infinite",
            }}
          />
          <div>
            <div
              data-testid="drop-race-total-votes"
              style={{ fontWeight: 700, fontSize: 18 }}
            >
              {totalVotes}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-muted)" }}>
              Votes locked
            </div>
          </div>
        </div>
      </div>

      <div
        data-testid="drop-race-leaderboard"
        className="chonk-map-chrome"
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          background: "var(--color-milk)",
          borderRadius: 16,
          padding: "16px 18px",
          minWidth: 260,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          zIndex: 400,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: "var(--color-muted)",
          }}
        >
          Current Drop Race
        </h3>
        <ol style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
          {leaderboard.map((r, i) => (
            <li
              key={r.suburb}
              data-testid={`lb-row-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 0",
                borderTop:
                  i === 0 ? "none" : "1px solid var(--color-hairline)",
              }}
            >
              <span
                style={{
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--color-muted)",
                  fontSize: 12,
                  width: 22,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ flex: 1, fontWeight: 600 }}>{r.suburb}</span>
              <span
                style={{
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--color-pink)",
                  fontWeight: 700,
                }}
              >
                {r.votes}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Cinematic iframe — pre-loaded off-screen so the Three.js scene
          is already booted (chonk-cup-ready already fired) when the user
          clicks a pin. Inline `style` is owned by startCinematic() /
          resetCinematic(); the CSS rules just control initial idle
          chrome and visibility transitions. */}
      <iframe
        ref={cinematicIframeRef}
        src="/chonk-cinematic.html"
        className="chonk-cinematic-iframe"
        data-cinematic-state={cinematicState}
        data-testid="chonk-cinematic-iframe"
        data-active-loc-id={activeLocId ?? ""}
        loading="eager"
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        title=""
      />

      {/* Click-to-skip surface — only mounted during 'playing' so it
          doesn't intercept clicks in idle or once the form is up. */}
      {cinematicState === "playing" && (
        <div
          className="chonk-cinematic-skip-zone"
          data-testid="chonk-cinematic-skip-zone"
          onClick={handleSkip}
          role="button"
          aria-label="Skip cinematic"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleSkip();
          }}
        />
      )}

      <DropRaceVoteModal
        open={modalLocationId !== null}
        target={modalTarget}
        onClose={() => {
          setModalLocationId(null);
          // If the modal was opened as the final frame of a cinematic,
          // dissolve the overlay and scroll to the products menu. In
          // reduced-motion mode (no cinematic), closing returns to the
          // map unchanged — preserving the AC-5 "close-then-reclick"
          // round trip used by the existing tests.
          if (cinematicState === "voting") {
            setCinematicState("done");
            scrollToFlavourGrid();
            window.setTimeout(resetCinematic, 800);
          }
        }}
        onSubmitted={(target) => {
          if (target) {
            bumpVote(target.id);
            if (typeof window !== "undefined") {
              window.localStorage.setItem(
                "chonk:launchVote:voted",
                target.id,
              );
            }
            // Keep the ref in sync so a same-session second click is gated
            // before the next page load picks up localStorage on hydration.
            hasVotedRef.current = target.id;
            // State drives the post-submit banner re-render.
            setVotedLocationId(target.id);
          }
          setModalLocationId(null);
          // Vote → menu. Whether the cinematic just played or the modal
          // opened directly under reduced-motion, the post-submit
          // destination is always FlavourGrid — that's the "overlay
          // closes onto the menu" from the restructure brief. Lenis no-ops
          // in reduced-motion so the scroll is instant for those users.
          scrollToFlavourGrid();
          if (cinematicState === "voting") {
            setCinematicState("done");
            window.setTimeout(resetCinematic, 800);
          }
        }}
      />
    </section>
  );
}
