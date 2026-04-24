"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { featuredProducts } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";
import MiniCup, { miniCupShadeFor } from "@/components/ui/MiniCup";

/**
 * Home-page lineup of the three featured chonks. The first card spans a
 * little wider so the lead flavour (Choc Chonk) gets visual priority.
 *
 * Cards pop in one-by-one when the section enters the viewport — each
 * with its own starting offset, rotation and stagger — so they feel
 * like whimsical characters springing out of the dark rather than a
 * boring scroll reveal. Honours prefers-reduced-motion.
 */
export default function FlavourGrid() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setVisible(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            return;
          }
        }
      },
      // Trigger once the section is ~20% into the viewport from the
      // bottom — user is actively looking at the cards when they pop.
      { rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
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
            <h2 className="text-section">Pick your chonk.</h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/menu" className="chonk-btn chonk-btn-primary">
              See the menu
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredProducts.map((product, i) => (
            <FlavourCard
              key={product.id}
              product={product}
              index={i}
              visible={visible}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Per-card whimsy: each character enters from a slightly different
// angle + rotation so the line-up reads as three distinct characters
// popping in, not a synchronised grid sweep.
const cardEntries = [
  { y: 80, x: -10, rot: -4 },
  { y: 110, x: 0, rot: 3 },
  { y: 72, x: 10, rot: -2.5 },
];

function FlavourCard({
  product,
  index,
  visible,
  reducedMotion,
}: {
  product: Product;
  index: number;
  visible: boolean;
  reducedMotion: boolean;
}) {
  const isLead = index === 0;
  const price1 = product.scoops[1].price;
  const price2 = product.scoops[2].price;
  const entry = cardEntries[index % cardEntries.length];
  const delay = index * 150; // staggered entrance

  // Overshoot cubic-bezier — card lands past its resting position then
  // settles back. Classic cartoon-squash feel.
  const bouncy = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  const transform = visible || reducedMotion
    ? "translate3d(0, 0, 0) scale(1) rotate(0deg)"
    : `translate3d(${entry.x}px, ${entry.y}px, 0) scale(0.88) rotate(${entry.rot}deg)`;
  const opacity = visible || reducedMotion ? 1 : 0;

  return (
    <Link
      href={`/menu#${product.id}`}
      className="flavour-card"
      style={{
        background: product.bgColor,
        color: product.textColor,
        gridColumn: isLead ? "span 1" : undefined,
        transform,
        opacity,
        transition: reducedMotion
          ? undefined
          : `transform 900ms ${bouncy} ${delay}ms, opacity 600ms ease-out ${delay}ms`,
        willChange: "transform, opacity",
      }}
      aria-label={`${product.name} — 25g or 50g protein, $${price1.toFixed(2)} or $${price2.toFixed(2)}`}
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
          <b>50g</b>
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
        className="flex items-center justify-between gap-2"
        style={{ opacity: 0.95 }}
      >
        <span
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: 15,
            fontVariationSettings: '"SOFT" 100, "WONK" 1',
          }}
        >
          ${price1.toFixed(2).replace(/\.00$/, "")}
          <span style={{ opacity: 0.55, fontWeight: 500, margin: "0 4px" }}>
            /
          </span>
          ${price2.toFixed(2).replace(/\.00$/, "")}
          <span
            style={{
              opacity: 0.55,
              fontWeight: 500,
              fontSize: 11,
              marginLeft: 6,
              letterSpacing: "0.08em",
            }}
          >
            1 / 2 SCOOP
          </span>
        </span>
        <span
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: 15,
            fontVariationSettings: '"SOFT" 100, "WONK" 1',
          }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
