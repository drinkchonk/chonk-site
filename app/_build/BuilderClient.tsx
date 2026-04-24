"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BASES,
  PROTEINS,
  FLAVOURS,
  BASE_CUSTOM_PRICE,
  PROTEIN_SCOOP_PRICE,
  MAX_FLAVOURS,
  MAX_SCOOPS,
  type BuilderOption,
} from "@/lib/data/builder";

export default function BuilderClient() {
  const [base, setBase] = useState<BuilderOption | null>(null);
  const [protein, setProtein] = useState<BuilderOption | null>(null);
  const [scoops, setScoops] = useState(1);
  const [flavours, setFlavours] = useState<BuilderOption[]>([]);

  const price = useMemo(() => {
    let p = BASE_CUSTOM_PRICE;
    if (base) p += base.price;
    if (protein) p += protein.price + PROTEIN_SCOOP_PRICE * scoops;
    flavours.forEach((f) => (p += f.price));
    return p;
  }, [base, protein, scoops, flavours]);

  const macros = useMemo(() => {
    const sum = { kcal: 0, p: 0, c: 0, f: 0 };
    if (base) {
      sum.kcal += base.macros.kcal;
      sum.p += base.macros.p;
      sum.c += base.macros.c;
      sum.f += base.macros.f;
    }
    if (protein) {
      sum.kcal += protein.macros.kcal * scoops;
      sum.p += protein.macros.p * scoops;
      sum.c += protein.macros.c * scoops;
      sum.f += protein.macros.f * scoops;
    }
    flavours.forEach((f) => {
      sum.kcal += f.macros.kcal;
      sum.p += f.macros.p;
      sum.c += f.macros.c;
      sum.f += f.macros.f;
    });
    return sum;
  }, [base, protein, scoops, flavours]);

  const hasAny = base !== null || protein !== null || flavours.length > 0;

  const toggleFlavour = (f: BuilderOption) => {
    setFlavours((prev) => {
      if (prev.find((x) => x.id === f.id)) {
        return prev.filter((x) => x.id !== f.id);
      }
      if (prev.length >= MAX_FLAVOURS) return prev;
      return [...prev, f];
    });
  };

  const reset = () => {
    setBase(null);
    setProtein(null);
    setScoops(1);
    setFlavours([]);
  };

  return (
    <section
      className="pb-24"
      style={{ paddingTop: 24 }}
      aria-label="Build your own chonk"
    >
      <div className="container-site">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* STEP 1 — BASE */}
          <Step step="01" title="Base" active={base !== null}>
            <OptionGrid
              options={BASES}
              selected={base ? [base.id] : []}
              onToggle={(o) => setBase(base?.id === o.id ? null : o)}
            />
          </Step>

          {/* STEP 2 — PROTEIN */}
          <Step step="02" title="Protein" active={protein !== null}>
            <OptionGrid
              options={PROTEINS}
              selected={protein ? [protein.id] : []}
              onToggle={(o) => {
                if (protein?.id === o.id) {
                  setProtein(null);
                  setScoops(1);
                } else {
                  setProtein(o);
                }
              }}
              showProtein
            />
            {protein && (
              <ScoopCounter
                scoops={scoops}
                onChange={setScoops}
                protein={protein}
              />
            )}
          </Step>

          {/* STEP 3 — FLAVOURS */}
          <Step
            step="03"
            title={`Flavours · ${flavours.length}/${MAX_FLAVOURS}`}
            active={flavours.length > 0}
          >
            <OptionGrid
              options={FLAVOURS}
              selected={flavours.map((f) => f.id)}
              onToggle={toggleFlavour}
              disabledCheck={(o) =>
                flavours.length >= MAX_FLAVOURS &&
                !flavours.find((f) => f.id === o.id)
              }
            />
          </Step>

          {/* LIVE PANEL — macros + price */}
          {hasAny && (
            <LivePanel
              price={price}
              macros={macros}
              base={base}
              protein={protein}
              scoops={scoops}
              flavours={flavours}
              onReset={reset}
              ready={base !== null && protein !== null}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function Step({
  step,
  title,
  active,
  children,
}: {
  step: string;
  title: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <span
          className="font-display"
          style={{
            fontSize: 13,
            letterSpacing: "0.14em",
            color: active ? "var(--color-pink)" : "var(--color-muted)",
            fontWeight: 900,
            fontVariationSettings: '"SOFT" 100, "WONK" 1',
          }}
        >
          {step}
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: active ? "var(--color-ink)" : "var(--color-muted)",
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"SOFT" 100, "WONK" 1',
          }}
        >
          {title}
        </span>
        <span
          style={{ flex: 1, height: 1, background: "var(--color-hairline)" }}
        />
      </div>
      {children}
    </div>
  );
}

function OptionGrid({
  options,
  selected,
  onToggle,
  disabledCheck,
  showProtein,
}: {
  options: BuilderOption[];
  selected: string[];
  onToggle: (o: BuilderOption) => void;
  disabledCheck?: (o: BuilderOption) => boolean;
  showProtein?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const isSel = selected.includes(o.id);
        const isDisabled = disabledCheck ? disabledCheck(o) : false;
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => !isDisabled && onToggle(o)}
            disabled={isDisabled}
            style={{
              background: isSel ? "var(--color-pink)" : "var(--color-milk)",
              color: isSel
                ? "#1A1614"
                : isDisabled
                  ? "rgba(254, 246, 236, 0.3)"
                  : "var(--color-ink)",
              border: `1px solid ${isSel ? "var(--color-pink)" : "var(--color-hairline)"}`,
              borderRadius: 999,
              padding: "10px 16px",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              cursor: isDisabled ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              opacity: isDisabled ? 0.45 : 1,
              transition: "background 150ms ease, color 150ms ease",
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            <span style={{ fontWeight: isSel ? 700 : 500 }}>{o.name}</span>
            <span
              style={{
                fontSize: 11,
                fontFamily: "var(--font-body)",
                color: isSel ? "rgba(26, 22, 20, 0.55)" : "var(--color-muted)",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {showProtein
                ? `${o.macros.p}g · ${o.macros.kcal}kcal`
                : `${o.macros.kcal}kcal`}
            </span>
            {o.price > 0 && (
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  color: isSel
                    ? "#1A1614"
                    : "var(--color-proof-fg)",
                  fontWeight: 700,
                }}
              >
                +${o.price}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ScoopCounter({
  scoops,
  onChange,
  protein,
}: {
  scoops: number;
  onChange: (n: number) => void;
  protein: BuilderOption;
}) {
  const totalProtein = protein.macros.p * scoops;
  const totalKcal = protein.macros.kcal * scoops;
  const extraCost = PROTEIN_SCOOP_PRICE * scoops;

  return (
    <div
      style={{
        marginTop: 14,
        background: "var(--color-milk)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-card)",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: 180 }}>
        <div
          className="text-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 4,
          }}
        >
          Scoops · ${PROTEIN_SCOOP_PRICE.toFixed(2)} each
        </div>
        <div style={{ fontSize: 15, letterSpacing: "-0.01em" }}>
          <span
            className="font-display"
            style={{
              color: "var(--color-pink)",
              fontWeight: 900,
              fontSize: 20,
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
            }}
          >
            {totalProtein}g
          </span>
          <span style={{ color: "var(--color-muted)", marginLeft: 8 }}>
            · {totalKcal} kcal · ${extraCost.toFixed(2)}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "var(--color-cream)",
          borderRadius: 999,
          border: "1px solid var(--color-hairline)",
          overflow: "hidden",
        }}
      >
        <ScoopBtn
          disabled={scoops <= 1}
          onClick={() => onChange(Math.max(1, scoops - 1))}
          label="Decrease scoops"
        >
          −
        </ScoopBtn>
        <div
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: 17,
            minWidth: 32,
            textAlign: "center",
            color: "var(--color-ink)",
            fontVariationSettings: '"SOFT" 100, "WONK" 1',
          }}
        >
          {scoops}
        </div>
        <ScoopBtn
          disabled={scoops >= MAX_SCOOPS}
          onClick={() => onChange(Math.min(MAX_SCOOPS, scoops + 1))}
          label="Increase scoops"
        >
          +
        </ScoopBtn>
      </div>
    </div>
  );
}

function ScoopBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        border: "none",
        background: disabled ? "transparent" : "var(--color-pink)",
        color: disabled ? "rgba(254, 246, 236, 0.3)" : "#1A1614",
        width: 36,
        height: 36,
        fontSize: 18,
        fontWeight: 900,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
      }}
    >
      {children}
    </button>
  );
}

function LivePanel({
  price,
  macros,
  base,
  protein,
  scoops,
  flavours,
  onReset,
  ready,
}: {
  price: number;
  macros: { kcal: number; p: number; c: number; f: number };
  base: BuilderOption | null;
  protein: BuilderOption | null;
  scoops: number;
  flavours: BuilderOption[];
  onReset: () => void;
  ready: boolean;
}) {
  const { kcal, p, c, f } = macros;
  const pCal = p * 4;
  const cCal = c * 4;
  const fCal = f * 9;
  const totalCal = pCal + cCal + fCal || 1;
  const pPct = (pCal / totalCal) * 100;
  const cPct = (cCal / totalCal) * 100;
  const fPct = (fCal / totalCal) * 100;

  return (
    <div
      style={{
        marginTop: 16,
        background: "var(--color-milk)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-card-lg)",
        padding: "clamp(20px, 3vw, 32px)",
      }}
    >
      {/* Hero numbers */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <div className="text-eyebrow" style={{ color: "var(--color-muted)" }}>
            Your chonk
          </div>
          <div
            className="font-display"
            style={{
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "var(--color-ink)",
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
              marginTop: 6,
            }}
          >
            ${price.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="text-eyebrow" style={{ color: "var(--color-muted)" }}>
            Protein
          </div>
          <div
            className="font-display"
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: "var(--color-pink)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
              marginTop: 6,
            }}
          >
            {p}
            <span style={{ fontSize: "0.5em", marginLeft: 2 }}>g</span>
          </div>
          <div
            className="text-[13px]"
            style={{ color: "var(--color-muted)", marginTop: 4 }}
          >
            {kcal} kcal
          </div>
        </div>
      </div>

      {/* Macro bar */}
      <div
        style={{
          display: "flex",
          height: 10,
          borderRadius: 999,
          overflow: "hidden",
          marginBottom: 12,
          background: "rgba(254, 246, 236, 0.06)",
        }}
      >
        <div style={{ width: `${pPct}%`, background: "var(--color-pink)" }} />
        <div style={{ width: `${cPct}%`, background: "#F4D35E" }} />
        <div style={{ width: `${fPct}%`, background: "var(--color-proof-fg)" }} />
      </div>

      {/* Macro legend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <MacroStat label="Protein" grams={p} pct={pPct} swatch="var(--color-pink)" />
        <MacroStat label="Carbs" grams={c} pct={cPct} swatch="#F4D35E" />
        <MacroStat label="Fat" grams={f} pct={fPct} swatch="var(--color-proof-fg)" />
      </div>

      {/* Build summary */}
      <div
        style={{
          padding: "16px 18px",
          background: "var(--color-cream)",
          border: "1px solid var(--color-hairline)",
          borderRadius: "var(--radius-card)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <div
          className="text-eyebrow"
          style={{
            color: "var(--color-proof-fg)",
            marginBottom: 6,
          }}
        >
          Build card
        </div>
        {base && (
          <div>
            <span style={{ color: "var(--color-muted)" }}>Base · </span>
            {base.name}
          </div>
        )}
        {protein && (
          <div>
            <span style={{ color: "var(--color-muted)" }}>Protein · </span>
            {scoops} scoop{scoops > 1 ? "s" : ""} {protein.name}
          </div>
        )}
        {flavours.length > 0 && (
          <div>
            <span style={{ color: "var(--color-muted)" }}>Flavours · </span>
            {flavours.map((f) => f.name).join(", ")}
          </div>
        )}
        {!ready && (
          <div
            style={{
              color: "var(--color-muted)",
              marginTop: 6,
              fontStyle: "italic",
            }}
          >
            Pick a base and a protein to complete your chonk.
          </div>
        )}
      </div>

      {/* CTAs */}
      <div
        className="flex flex-wrap gap-3 mt-6"
        style={{ alignItems: "center" }}
      >
        <Link
          href="/#newsletter"
          className="chonk-btn chonk-btn-primary chonk-btn-lg"
          aria-disabled={!ready}
          style={
            ready
              ? undefined
              : { opacity: 0.5, pointerEvents: "none" }
          }
        >
          Get on the list for the first pour
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="chonk-btn chonk-btn-ghost"
        >
          Reset
        </button>
      </div>

      <div
        className="mt-4 text-[12px]"
        style={{ color: "var(--color-muted)" }}
      >
        Pre-launch · price shown is indicative, macros are estimates from the
        formulation spec.
      </div>
    </div>
  );
}

function MacroStat({
  label,
  grams,
  pct,
  swatch,
}: {
  label: string;
  grams: number;
  pct: number;
  swatch: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 4,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: swatch,
            display: "inline-block",
          }}
        />
        <span
          className="text-eyebrow"
          style={{
            color: "var(--color-muted)",
            fontSize: 10,
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="font-display"
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "var(--color-ink)",
          fontVariationSettings: '"SOFT" 100, "WONK" 1',
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {grams}
        <span style={{ fontSize: "0.5em", marginLeft: 2 }}>g</span>
      </div>
      <div
        className="text-[11px]"
        style={{ color: "var(--color-muted)", marginTop: 2 }}
      >
        {Math.round(pct)}%
      </div>
    </div>
  );
}
