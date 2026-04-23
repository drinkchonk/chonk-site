const stats = [
  {
    big: "50",
    unit: "g",
    label: "Protein",
    sub: "whey-forward, per chonk — Raw, Choc Chonk, Chonky Monkey.",
  },
  {
    big: "9",
    unit: "",
    label: "Essential amino acids",
    sub: "every EAA your body can’t make. Whey isolate is a complete protein — no gaps, every chonk.",
  },
  {
    big: "8",
    unit: "",
    label: "Key micronutrients",
    sub: "B6, B12, vitamin C, calcium, magnesium, potassium, manganese, riboflavin — from real food, not a fortification spray.",
  },
  {
    big: "5",
    unit: "",
    label: "Natural ingredients",
    sub: "whole milk, greek yogurt, raw honey, raw cacao, real fruit.",
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
          <h2 className="text-section">All the right numbers.</h2>
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
