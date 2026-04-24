"use client";

import { useState } from "react";
import { products, featuredProducts } from "@/lib/data/products";
import { ingredients } from "@/lib/data/references";
import MiniCup, { miniCupShadeFor } from "@/components/ui/MiniCup";

export default function MenuClient() {
  const [active, setActive] = useState(featuredProducts[0].id);
  const [scoops, setScoops] = useState<1 | 2>(2);
  const product = products.find((p) => p.id === active) ?? products[0];
  const variant = product.scoops[scoops];

  const nutritionCells = [
    { k: "Protein", v: `${variant.proteinG}g`, hot: true },
    { k: "Calories", v: variant.calories },
    { k: "Carbs", v: `${variant.carbs}g` },
    { k: "Fat", v: `${variant.fat}g` },
  ];

  return (
    <>
      {/* Hero — headline + tagline */}
      <section className="pt-[72px] pb-12">
        <div className="container-site">
          <div>
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              The menu
            </span>
            <h1 className="text-hero mt-3 max-w-[820px]">
              <span style={{ color: "var(--color-pink)" }}>Four chonks.</span>{" "}
              One standard.
            </h1>
            <p
              className="leading-[1.6] max-w-[620px] mt-5"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              Every chonk starts with whey isolate and whole ingredients. No
              added sugar, no artificial colours, no thickeners, no fillers.
              Blended in front of you, on order.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs + product detail */}
      <section className="pb-24">
        <div className="container-site">
          <div
            className="flex gap-2 flex-wrap mb-8 pb-0.5"
            style={{ borderBottom: "1px solid var(--color-hairline)" }}
            role="tablist"
            aria-label="Flavours"
          >
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active === p.id}
                aria-controls={`flavour-${p.id}`}
                onClick={() => setActive(p.id)}
                className="font-display"
                style={{
                  padding: "14px 22px",
                  fontVariationSettings: '"SOFT" 100, "WONK" 1',
                  fontWeight: 900,
                  fontSize: 15,
                  color:
                    active === p.id
                      ? "var(--color-ink)"
                      : "var(--color-muted)",
                  borderBottom:
                    active === p.id
                      ? "3px solid var(--color-pink)"
                      : "3px solid transparent",
                  marginBottom: -2,
                  transition: "color 150ms ease",
                }}
              >
                {p.name}
                <span
                  className="font-body ml-2.5"
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    color: "var(--color-proof-fg)",
                  }}
                >
                  ${p.scoops[2].price.toFixed(2).replace(/\.00$/, "")}
                </span>
              </button>
            ))}
          </div>

          <div
            id={`flavour-${product.id}`}
            className="grid gap-14 md:grid-cols-[1.1fr_1fr] items-stretch"
            key={product.id}
          >
            <div
              className="flex items-center justify-center relative overflow-hidden"
              style={{
                background: product.bgColor,
                borderRadius: "var(--radius-card-lg)",
                padding: 48,
                minHeight: 520,
                color: product.textColor,
              }}
            >
              <div style={{ width: "55%", maxWidth: 280 }}>
                <MiniCup
                  bg={miniCupShadeFor(product.bgColor)}
                  fg={product.textColor}
                />
              </div>
              <div
                className="absolute"
                style={{
                  top: 32,
                  left: 32,
                  right: 32,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="text-eyebrow"
                  style={{ opacity: 0.65 }}
                >
                  {product.flavourNotes.join(" · ")}
                </div>
                <div
                  className="font-display"
                  style={{
                    background: product.textColor,
                    color: product.bgColor,
                    padding: "14px 18px",
                    borderRadius: 14,
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1',
                  }}
                >
                  <div style={{ fontSize: 40, lineHeight: 0.9 }}>
                    {variant.proteinG}g
                  </div>
                  <div
                    className="font-body"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      opacity: 0.7,
                    }}
                  >
                    protein
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2
                className="text-hero"
                style={{ fontSize: "clamp(44px, 5vw, 72px)" }}
              >
                {product.name}
              </h2>
              <p
                className="font-display"
                style={{
                  fontSize: 19,
                  color: "var(--color-pink)",
                  marginTop: 8,
                  fontWeight: 900,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1',
                }}
              >
                {product.tagline}
              </p>
              <p
                className="leading-[1.65] mt-6"
                style={{ color: "var(--color-muted)", fontSize: 17 }}
              >
                {product.desc}
              </p>

              {/* SCOOP TOGGLE + PRICE */}
              <div
                className="flex items-center gap-3 flex-wrap mt-8"
                role="tablist"
                aria-label="Scoops"
              >
                <div
                  style={{
                    display: "inline-flex",
                    background: "var(--color-milk)",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: 999,
                    padding: 3,
                  }}
                >
                  {([1, 2] as const).map((n) => {
                    const isActive = scoops === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setScoops(n)}
                        className="font-display"
                        style={{
                          border: "none",
                          background: isActive
                            ? "var(--color-ink)"
                            : "transparent",
                          color: isActive
                            ? "var(--color-cream)"
                            : "var(--color-muted)",
                          padding: "8px 16px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 900,
                          fontVariationSettings: '"SOFT" 100, "WONK" 1',
                          letterSpacing: "0.02em",
                          cursor: "pointer",
                          transition: "background 150ms ease, color 150ms ease",
                        }}
                      >
                        {n} scoop · {product.scoops[n].proteinG}g
                      </button>
                    );
                  })}
                </div>
                <div
                  className="font-display"
                  style={{
                    padding: "8px 16px",
                    background: "var(--color-pink)",
                    color: "#1A1614",
                    borderRadius: 999,
                    fontSize: 15,
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1',
                    letterSpacing: "-0.01em",
                  }}
                >
                  ${variant.price.toFixed(2)}
                </div>
              </div>

              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7 py-6"
                style={{ borderBlock: "1px solid var(--color-hairline)" }}
              >
                {nutritionCells.map((n) => (
                  <div key={n.k}>
                    <div
                      className="text-eyebrow mb-1.5"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {n.k}
                    </div>
                    <div
                      className="font-display"
                      style={{
                        fontWeight: 900,
                        fontVariationSettings: '"SOFT" 100, "WONK" 1',
                        fontSize: 32,
                        letterSpacing: "-0.02em",
                        color: n.hot
                          ? "var(--color-pink)"
                          : "var(--color-ink)",
                      }}
                    >
                      {n.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <div
                  className="text-eyebrow mb-3"
                  style={{ color: "var(--color-muted)" }}
                >
                  What&apos;s in it
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-[13px]"
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        border: "1px solid var(--color-hairline)",
                        background: "var(--color-milk)",
                      }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3 flex-wrap">
                <a
                  href="/#newsletter"
                  className="chonk-btn chonk-btn-primary chonk-btn-lg"
                >
                  ${variant.price.toFixed(2)} at first pop-up · Get on the list
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Whole lineup — compact grid */}
      <section
        className="section-padding"
        style={{ background: "var(--color-milk)" }}
      >
        <div className="container-site">
          <header className="max-w-[720px] mb-12 flex flex-col gap-3">
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              See it all
            </span>
            <h2 className="text-section">The whole lineup.</h2>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setActive(p.id);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flavour-card text-left"
                style={{
                  background: p.bgColor,
                  color: p.textColor,
                  minHeight: 300,
                  padding: 22,
                }}
              >
                <div className="flex justify-between">
                  <div>
                    <div
                      className="text-eyebrow mb-1"
                      style={{ opacity: 0.6, fontSize: 11 }}
                    >
                      {p.flavourNotes.join(" · ")}
                    </div>
                    <h3
                      style={{ fontSize: 24, letterSpacing: "-0.02em" }}
                    >
                      {p.name}
                    </h3>
                  </div>
                  <div
                    className="protein-tag"
                    style={{ background: p.textColor, color: p.bgColor }}
                  >
                    <b style={{ fontSize: 22 }}>50g</b>
                  </div>
                </div>
                <div className="flex-1 flex items-end justify-center w-full">
                  <div style={{ width: "55%", maxWidth: 130 }}>
                    <MiniCup
                      bg={miniCupShadeFor(p.bgColor)}
                      fg={p.textColor}
                    />
                  </div>
                </div>
                <div
                  className="font-display"
                  style={{
                    fontWeight: 900,
                    fontSize: 13,
                    opacity: 0.85,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1',
                    letterSpacing: "0.02em",
                  }}
                >
                  ${p.scoops[1].price.toFixed(2).replace(/\.00$/, "")} / $
                  {p.scoops[2].price.toFixed(2).replace(/\.00$/, "")}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
