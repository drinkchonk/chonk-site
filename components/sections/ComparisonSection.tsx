const rows = [
  {
    name: "Chonk — Raw",
    protein: 60,
    sugar: 0,
    real: "Yes",
    price: "$12",
    highlight: true,
  },
  { name: "Up&Go Protein", protein: 17, sugar: 13, real: "No", price: "$4" },
  { name: "Maxibon Protein Bar", protein: 20, sugar: 2, real: "No", price: "$5" },
  { name: "YoPro Yoghurt 250g", protein: 25, sugar: 4, real: "No", price: "$5" },
  {
    name: "Servo protein shake (RTD)",
    protein: 30,
    sugar: 5,
    real: "No",
    price: "$7",
  },
];

/** Head-to-head table with a side panel showing the Up&Go vs Chonk gap. */
export default function ComparisonSection() {
  return (
    <section
      style={{
        background: "var(--color-milk)",
        paddingBlock: 128,
      }}
      aria-label="How Chonk compares to supermarket protein"
    >
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] items-center">
          <div>
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              The proof
            </span>
            <h2 className="text-section mt-3">
              Up&Go has 17g.
              <br />
              <span style={{ color: "var(--color-pink)" }}>
                Chonk has 60g.
              </span>
            </h2>
            <p
              className="text-pretty leading-[1.6] mt-5 max-w-[420px]"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              You do the maths. A Chonk hits the protein of three
              convenience-store &ldquo;high-protein&rdquo; products at less
              than the combined price — and without the sugar, fillers, or
              sweeteners.
            </p>

            <div
              className="mt-7"
              style={{
                padding: "20px 24px",
                borderRadius: "var(--radius-card-lg)",
                background: "var(--color-cream)",
                border: "1px solid var(--color-hairline)",
              }}
            >
              <div
                className="text-eyebrow mb-2.5"
                style={{ color: "var(--color-muted)" }}
              >
                Protein gap vs #1 supermarket seller
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="pbar">
                    <div
                      className="fill"
                      data-target="28"
                      style={{ width: "28%" }}
                    />
                  </div>
                  <div
                    className="flex justify-between mt-2 text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    <span>Up&Go</span>
                    <span>17g</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1">
                  <div className="pbar">
                    <div
                      className="fill"
                      data-target="100"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span style={{ fontWeight: 600 }}>Chonk Raw</span>
                    <span style={{ fontWeight: 600 }}>60g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="compare">
              <thead>
                <tr>
                  <th aria-label="Product" />
                  <th style={{ textAlign: "right" }}>Protein</th>
                  <th style={{ textAlign: "right" }}>Sugar</th>
                  <th style={{ textAlign: "right" }}>Real food</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className={r.highlight ? "highlight" : ""}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td className="num" style={{ textAlign: "right" }}>
                      {r.protein}g
                    </td>
                    <td
                      className="num"
                      style={{
                        textAlign: "right",
                        color:
                          r.sugar === 0
                            ? "var(--color-proof-fg)"
                            : undefined,
                      }}
                    >
                      {r.sugar}g
                    </td>
                    <td style={{ textAlign: "right" }}>{r.real}</td>
                    <td style={{ textAlign: "right" }}>{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
