export default function FindUsTeaser() {
  return (
    <section
      id="find-us"
      className="section-padding"
      style={{ background: "var(--color-milk)" }}
      aria-label="Where to find chonk."
    >
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] items-center">
          <div>
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              Where to find us
            </span>
            <h2 className="text-section mt-3">
              First pop-up,
              <br />
              <span style={{ color: "var(--color-pink)" }}>
                dropping soon.
              </span>
            </h2>
            <p
              className="text-pretty leading-[1.65] mt-5 max-w-[460px]"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              We&apos;re prepping the first chonk. pop-up in Perth right now —
              recipe, compliance, cup. Get on the list and we&apos;ll tell you
              the moment it&apos;s pouring.
            </p>
            <div className="flex gap-3 flex-wrap mt-7">
              <a
                href="/#newsletter"
                className="chonk-btn chonk-btn-primary"
              >
                Get on the list
              </a>
              <a
                href="/find-us"
                className="chonk-btn chonk-btn-outline"
              >
                Wholesale &amp; venues
              </a>
            </div>
          </div>

          <div
            className="loc-card"
            style={{ borderColor: "rgba(159, 211, 165, 0.25)" }}
          >
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-proof-fg)",
                }}
              />
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-proof-fg)" }}
              >
                Status · Pre-launch
              </span>
            </div>
            <h3 style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
              Perth, WA
            </h3>
            <p
              className="text-sm leading-[1.5]"
              style={{ color: "var(--color-muted)" }}
            >
              Location, date, and pour details dropping to the list first.
              Markets, gyms, studios — where Perth actually trains.
            </p>
            <div
              className="flex flex-col gap-1.5 text-[13px] mt-2 pt-4"
              style={{ borderTop: "1px solid var(--color-hairline)" }}
            >
              <div className="flex justify-between">
                <span style={{ color: "var(--color-muted)" }}>Recipe</span>
                <span>Locked</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-muted)" }}>Compliance</span>
                <span>In progress</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-muted)" }}>First pour</span>
                <span style={{ color: "var(--color-proof-fg)" }}>Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
