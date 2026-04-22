import Link from "next/link";
import { featuredProducts } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";
import MiniCup, { miniCupShadeFor } from "@/components/ui/MiniCup";

/**
 * Home-page lineup of the three 60g shakes. The first card spans a little
 * wider so the lead flavour (Raw) gets visual priority.
 */
export default function FlavourGrid() {
  return (
    <section
      className="section-padding"
      style={{ background: "var(--color-milk)" }}
      aria-label="Featured flavours"
    >
      <div className="container-site">
        <div className="flex items-end justify-between flex-wrap gap-5 mb-12">
          <div className="flex flex-col gap-3">
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              The lineup
            </span>
            <h2 className="text-section">Pick your protein.</h2>
          </div>
          <Link href="/menu" className="chonk-btn chonk-btn-outline">
            See Full Menu
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredProducts.map((product, i) => (
            <FlavourCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlavourCard({ product, index }: { product: Product; index: number }) {
  const isLead = index === 0;
  return (
    <Link
      href={`/menu#${product.id}`}
      className="flavour-card"
      style={{
        background: product.bgColor,
        color: product.textColor,
        gridColumn: isLead ? "span 1" : undefined,
      }}
      aria-label={`${product.name} — ${product.protein}g protein`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <div
            className="text-eyebrow mb-1.5"
            style={{ opacity: 0.6, color: product.textColor }}
          >
            {product.flavourNotes.join(" · ")}
          </div>
          <h3
            style={{
              fontSize: isLead ? "clamp(36px, 4.2vw, 54px)" : 30,
              letterSpacing: "-0.02em",
            }}
          >
            {product.name}
          </h3>
          <div
            className="text-sm mt-2 max-w-[280px]"
            style={{ opacity: 0.75 }}
          >
            {product.tagline}
          </div>
        </div>
        <div
          className="protein-tag"
          style={{ background: product.textColor, color: product.bgColor }}
        >
          <b>{product.protein}g</b>
          <span>protein</span>
        </div>
      </div>
      <div className="flex-1 flex items-end justify-center pt-3">
        <div style={{ width: isLead ? "60%" : "55%", maxWidth: 180 }}>
          <MiniCup
            bg={miniCupShadeFor(product.bgColor)}
            fg={product.textColor}
          />
        </div>
      </div>
      <div
        className="flex items-center gap-2 font-display"
        style={{
          fontWeight: 900,
          fontSize: 15,
          opacity: 0.85,
          fontVariationSettings: '"SOFT" 100, "WONK" 1',
        }}
      >
        <span>Order this</span>
        <span>→</span>
      </div>
    </Link>
  );
}
