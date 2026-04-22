const stats = [
  {
    big: "60",
    unit: "g",
    label: "Protein",
    sub: "per serve (Raw, Choc Chonk, Chonky Monkey)",
  },
  {
    big: "0",
    unit: "g",
    label: "Added sugar",
    sub: "sweetened with honey + real fruit only",
  },
  {
    big: "3×",
    unit: "",
    label: "Up&Go's protein",
    sub: "Up&Go has 17g. You do the maths.",
  },
  {
    big: "≈4",
    unit: "min",
    label: "To blend",
    sub: "fresh-made while you stretch",
  },
];

export default function ProofBar() {
  return (
    <section className="section-padding" aria-label="The receipts">
      <div className="container-site">
        <header className="max-w-[720px] mb-14 flex flex-col gap-3">
          <span
            className="text-eyebrow"
            style={{ color: "var(--color-proof-fg)" }}
          >
            The receipts
          </span>
          <h2 className="text-section">No one comes close.</h2>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="py-8"
              style={{ borderTop: "1px solid var(--color-hairline-strong)" }}
            >
              <div
                className="text-nutrition"
                style={{ color: "var(--color-pink)" }}
              >
                {s.big}
                {s.unit && (
                  <span
                    style={{
                      fontSize: "0.35em",
                      marginLeft: 4,
                      color: "var(--color-ink)",
                      verticalAlign: "super",
                    }}
                  >
                    {s.unit}
                  </span>
                )}
              </div>
              <div
                className="text-eyebrow mt-4 mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                {s.label}
              </div>
              <div className="text-sm text-ink/90 leading-[1.5] max-w-[240px]">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
