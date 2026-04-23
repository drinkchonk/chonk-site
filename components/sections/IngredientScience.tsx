import Link from "next/link";
import Cite from "@/components/ui/Cite";
import { ingredients } from "@/lib/data/references";

/**
 * Home-page ingredient science section. Shows the first six ingredients as
 * compact cards with inline citation chips linking to /references#ref-N.
 * The full bibliography + synergies live on /references.
 */
export default function IngredientScience() {
  const featured = ingredients.slice(0, 6);
  return (
    <section
      id="science"
      className="section-padding"
      aria-label="Ingredient science"
    >
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-2 items-end mb-14">
          <div className="flex flex-col gap-3">
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              The science
            </span>
            <h2 className="text-section">
              Every ingredient earns its place.
            </h2>
          </div>
          <p
            className="text-pretty leading-[1.6] max-w-[480px]"
            style={{ color: "var(--color-muted)", fontSize: 17 }}
          >
            We hand picked our ingredients. Each one does a specific job —
            protein synthesis, glycogen recovery, vasodilation, electrolyte
            balance. Peer-reviewed. No vibes, no fillers, no guessing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((ing) => (
            <article key={ing.name} className="ingredient-card">
              <span
                className="cat"
                style={{
                  background: ing.categoryColor,
                  color: ing.categoryText,
                }}
              >
                {ing.category}
              </span>
              <h3
                style={{ fontSize: 26, letterSpacing: "-0.015em" }}
              >
                {ing.name}
                <Cite refs={ing.refs} />
              </h3>
              <div
                className="font-body"
                style={{
                  fontSize: 12,
                  color: "var(--color-proof-fg)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {ing.keyNutrients}
              </div>
              <p
                className="leading-[1.6]"
                style={{
                  fontSize: 14,
                  color: "var(--color-muted)",
                  marginTop: 4,
                }}
              >
                {ing.detail}
              </p>
            </article>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{
            padding: "28px 32px",
            background: "var(--color-milk)",
            border: "1px solid var(--color-hairline)",
            borderRadius: "var(--radius-card-lg)",
          }}
        >
          <div>
            <div
              className="text-eyebrow mb-1.5"
              style={{ color: "var(--color-proof-fg)" }}
            >
              15 citations · position stands · RCTs · systematic reviews
            </div>
            <div style={{ fontSize: 17 }}>
              All references listed, all claims sourced. Don&apos;t take our
              word for it — check the papers.
            </div>
          </div>
          <Link href="/references" className="chonk-btn chonk-btn-outline">
            View References →
          </Link>
        </div>
      </div>
    </section>
  );
}
