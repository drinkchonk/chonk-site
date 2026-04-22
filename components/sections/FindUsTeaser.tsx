import { locations } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

export default function FindUsTeaser() {
  return (
    <section
      id="find-us"
      className="section-padding"
      style={{ background: "var(--color-milk)" }}
      aria-label="Find us teaser"
    >
      <div className="container-site">
        <header className="max-w-[720px] mb-14 flex flex-col gap-3">
          <span
            className="text-eyebrow"
            style={{ color: "var(--color-proof-fg)" }}
          >
            Where to get one
          </span>
          <h2 className="text-section">Pull up.</h2>
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
                    <div
                      key={h.day}
                      className="flex justify-between"
                    >
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
  );
}
