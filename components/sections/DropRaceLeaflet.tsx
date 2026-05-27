"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DROP_RACE_LOCATIONS,
  type DropRaceLocation,
} from "@/lib/data/drop-race-locations";
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
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<DropRaceVoteTarget>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const totalVotes = useMemo(
    () => locations.reduce((acc, l) => acc + l.votes, 0),
    [locations],
  );

  const leaderboard = useMemo(
    () => aggregateSuburbVotes(locations).slice(0, 3),
    [locations],
  );

  // Esc-to-close (global), per AC-3.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
          minZoom: 12,
          maxZoom: 16,
          zoomControl: false,
          attributionControl: true,
        }).setView([-31.89, 115.79], 13);
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
            className: "chonk-pin-icon",
            html: `<div class="chonk-pin ${loc.kind === "gym" ? "gym" : "zone"}"><div class="halo"></div><div class="core">${loc.votes}</div></div>`,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          });
          const m = L.marker([loc.lat, loc.lng], { icon }).addTo(markerGroup);
          m.bindTooltip(
            `<strong>${loc.name}</strong><br/><span style="opacity:.7">${loc.kind === "gym" ? "Gym" : "Zone"} · ${loc.suburb}</span>`,
            { direction: "top", offset: [0, -10] },
          );
          m.on("click", () => {
            setTarget({
              id: loc.id,
              name: loc.name,
              suburb: loc.suburb,
              kind: loc.kind,
            });
            setOpen(true);
          });
        }
        cleanup = () => map.remove();
      } catch {
        // Leaflet failed to load (e.g. in a test env that doesn't mock it);
        // the static React UI still renders, AC-3 doesn't require a real
        // map for its assertions.
      }
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [locations]);

  function openVoteCta() {
    setTarget(null);
    setOpen(true);
  }

  function openListCta() {
    // OQ-2: same modal opens with empty gym/suburb. No pre-fill = target null.
    setTarget(null);
    setOpen(true);
  }

  function handleSubmitted(submittedFor: DropRaceVoteTarget) {
    // Optimistic bump on the matched pin.
    if (submittedFor) {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === submittedFor.id ? { ...l, votes: l.votes + 1 } : l,
        ),
      );
    }
    // Modal handles its own confirmation state.
  }

  return (
    <section
      aria-label="Drop Race demand-capture landing"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
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
            Vote for your gym or suburb. Most votes wins the first drop.
          </p>
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
              Votes locked live
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

      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 400,
        }}
      >
        <button
          type="button"
          onClick={openVoteCta}
          className="chonk-btn chonk-btn-primary chonk-btn-lg"
          style={{ background: "var(--color-pink)", color: "white" }}
        >
          Vote My Gym
        </button>
        <button
          type="button"
          onClick={openListCta}
          className="chonk-btn chonk-btn-outline"
          style={{
            background: "transparent",
            color: "var(--color-ink)",
            border: "1px solid var(--color-hairline)",
          }}
        >
          Join First-Drop List
        </button>
      </div>

      <DropRaceVoteModal
        open={open}
        target={target}
        onClose={() => setOpen(false)}
        onSubmitted={handleSubmitted}
      />
    </section>
  );
}
