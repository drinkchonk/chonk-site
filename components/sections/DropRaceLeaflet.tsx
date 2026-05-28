"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DROP_RACE_LOCATIONS,
  type DropRaceLocation,
} from "@/lib/data/drop-race-locations";
import { cupMarkerHtml } from "@/components/ui/CupMarker";
import DropRaceVoteModal, {
  type DropRaceVoteTarget,
} from "@/components/forms/DropRaceVoteModal";

type LocalLocation = DropRaceLocation;

function aggregateSuburbVotes(locations: LocalLocation[]) {
  const byName = new Map<string, number>();
  for (const l of locations) {
    byName.set(l.suburb, (byName.get(l.suburb) ?? 0) + l.votes);
  }
  return Array.from(byName.entries())
    .map(([suburb, votes]) => ({ suburb, votes }))
    .sort((a, b) => b.votes - a.votes);
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

  // Hydration: read localStorage AFTER mount only (SSR-safe). Returning
  // voters get the gate engaged AND the banner rendered before their first
  // click.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("chonk:launchVote:voted");
    if (stored) {
      hasVotedRef.current = stored;
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
          // no rubber-band box-zoom, no keyboard pans/zooms.
          dragging: false,
          scrollWheelZoom: false,
          touchZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        });
        const bounds = L.latLngBounds(
          DROP_RACE_LOCATIONS.map((l) => [l.lat, l.lng] as [number, number]),
        );
        map.fitBounds(bounds, { padding: [40, 40] });
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
          {
            subdomains: "abcd",
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        ).addTo(map);
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
          { subdomains: "abcd", maxZoom: 19, opacity: 0.95 },
        ).addTo(map);
        const markerGroup = L.layerGroup().addTo(map);
        for (const loc of locations) {
          const icon = L.divIcon({
            className: "chonk-cup-marker-icon",
            html: cupMarkerHtml(loc),
            iconSize: [56, 56],
            iconAnchor: [28, 28],
          });
          const m = L.marker([loc.lat, loc.lng], { icon }).addTo(markerGroup);
          m.bindTooltip(
            `<strong>${loc.name}</strong><br/><span style="opacity:.7">${loc.kind === "gym" ? "Gym" : "Zone"} · ${loc.suburb}</span>`,
            { direction: "top", offset: [0, -10] },
          );
          m.on("click", () => {
            // Closure reads ref at click-time — always current, never stale.
            if (hasVotedRef.current) return;
            setModalLocationId(loc.id);
          });
        }
        cleanup = () => map.remove();
      } catch {
        // Leaflet failed to load (e.g. in a test env that doesn't mock it);
        // the static React UI still renders.
      }
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [locations]);

  const modalTarget: DropRaceVoteTarget = modalLocationId
    ? (() => {
        const loc = DROP_RACE_LOCATIONS.find((l) => l.id === modalLocationId);
        return loc
          ? { id: loc.id, name: loc.name, suburb: loc.suburb, kind: loc.kind }
          : null;
      })()
    : null;

  return (
    <section
      aria-label="Drop Race demand-capture landing"
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - var(--chonk-header-height, 72px))",
        background: "var(--color-cream)",
        overflow: "hidden",
      }}
    >
      <div
        ref={mapContainerRef}
        data-testid="drop-race-map"
        style={{ position: "absolute", inset: 0 }}
      />

      <div
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

      <DropRaceVoteModal
        open={modalLocationId !== null}
        target={modalTarget}
        onClose={() => setModalLocationId(null)}
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
        }}
      />
    </section>
  );
}
