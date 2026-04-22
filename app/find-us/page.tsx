import type { Metadata } from "next";
import { locations } from "@/lib/data/locations";
import { cn } from "@/lib/utils";
import WholesaleForm from "./WholesaleForm";

export const metadata: Metadata = {
  title: "Find Us",
  description:
    "Pull up. Chonk stalls across Perth — Osborne Park open now, Perth CBD and Leederville coming soon.",
};

export default function FindUsPage() {
  return (
    <>
      <section className="pt-[72px] pb-12">
        <div className="container-site">
          <span
            className="text-eyebrow"
            style={{ color: "var(--color-proof-fg)" }}
          >
            Find us
          </span>
          <h1 className="text-hero mt-3 max-w-[820px]">
            Perth stalls.
            <br />
            <span style={{ color: "var(--color-pink)" }}>
              More dropping soon.
            </span>
          </h1>
          <p
            className="leading-[1.6] max-w-[620px] mt-5"
            style={{ color: "var(--color-muted)", fontSize: 17 }}
          >
            One stall open now in Osborne Park. CBD and Leederville are in
            build. Tap a pin for the full story — or scroll for addresses,
            hours and directions.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-site">
          <div
            className="relative"
            style={{
              background: "var(--color-milk)",
              borderRadius: "var(--radius-card-lg)",
              border: "1px solid var(--color-hairline)",
              aspectRatio: "16 / 9",
              overflow: "hidden",
            }}
            aria-label="Stylised map of Perth with Chonk stall pins"
          >
            <svg
              viewBox="0 0 100 56"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
              aria-hidden="true"
            >
              <path
                d="M0 38 C 15 34, 25 40, 35 36 S 55 30, 70 34 S 92 30, 100 28"
                stroke="var(--color-pink)"
                strokeWidth="0.6"
                fill="none"
                opacity="0.35"
              />
              <text
                x="72"
                y="26"
                fill="var(--color-muted)"
                fontSize="2"
                fontFamily="var(--font-body)"
                letterSpacing="0.3"
              >
                SWAN RIVER
              </text>
            </svg>

            {locations.map((loc) => {
              if (!loc.pin) return null;
              const isOpen = loc.status === "open";
              return (
                <div
                  key={loc.id}
                  style={{
                    position: "absolute",
                    left: `${loc.pin.x}%`,
                    top: `${loc.pin.y}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: isOpen
                        ? "var(--color-proof-fg)"
                        : "var(--color-pink)",
                      border: "3px solid var(--color-cream)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    }}
                  />
                  <div
                    className="font-display whitespace-nowrap"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginTop: 6,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "var(--color-cream)",
                      border: "1px solid var(--color-hairline)",
                      fontSize: 11,
                      fontWeight: 900,
                      fontVariationSettings: '"SOFT" 100, "WONK" 1',
                      color: "var(--color-ink)",
                    }}
                  >
                    {loc.suburb}
                    {!isOpen && loc.pin.eta ? ` · ${loc.pin.eta}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-site">
          <header className="max-w-[720px] mb-12 flex flex-col gap-3">
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              The stalls
            </span>
            <h2 className="text-section">Addresses, hours, directions.</h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className={cn("loc-card", loc.status === "open" && "open")}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        loc.status === "open"
                          ? "var(--color-proof-fg)"
                          : "var(--color-muted)",
                    }}
                  />
                  <span
                    className="text-eyebrow"
                    style={{
                      color:
                        loc.status === "open"
                          ? "var(--color-proof-fg)"
                          : "var(--color-muted)",
                    }}
                  >
                    {loc.status === "open" ? "Open now" : "Coming soon"}
                  </span>
                </div>
                <h3 style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
                  {loc.suburb}
                </h3>
                <p
                  className="text-sm leading-[1.5]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {loc.address}
                </p>
                {loc.hours.length > 0 ? (
                  <div
                    className="flex flex-col gap-1.5 text-[13px] mt-2 pt-4"
                    style={{ borderTop: "1px solid var(--color-hairline)" }}
                  >
                    {loc.hours.map((h) => (
                      <div key={h.day} className="flex justify-between">
                        <span style={{ color: "var(--color-muted)" }}>
                          {h.day}
                        </span>
                        <span>{h.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-[13px] mt-2 pt-4"
                    style={{
                      color: "var(--color-muted)",
                      borderTop: "1px solid var(--color-hairline)",
                    }}
                  >
                    Opening {loc.pin?.eta ?? "2026"} · Get notified below
                  </div>
                )}
                <button
                  type="button"
                  className="chonk-btn chonk-btn-ghost chonk-btn-sm self-start mt-2"
                  style={{ padding: "8px 0" }}
                >
                  {loc.status === "open" ? "Get directions →" : "Notify me →"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section-padding"
        style={{ background: "var(--color-milk)" }}
        aria-label="Wholesale enquiry"
      >
        <div className="container-site">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr] items-start">
            <div>
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-proof-fg)" }}
              >
                Wholesale & venues
              </span>
              <h2 className="text-section mt-3">
                Got a gym?
                <br />
                <span style={{ color: "var(--color-pink)" }}>
                  Let&apos;s talk.
                </span>
              </h2>
              <p
                className="leading-[1.6] mt-5 max-w-[460px]"
                style={{ color: "var(--color-muted)", fontSize: 17 }}
              >
                We pop up inside gyms, studios and leisure centres across WA.
                Low build-out, no kitchen required. Drop your details and
                we&apos;ll come back within 48 hours.
              </p>
            </div>

            <WholesaleForm />
          </div>
        </div>
      </section>
    </>
  );
}
