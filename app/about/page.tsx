import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "chonk. is a high-protein smoothie built by two mates from Perth. 50 grams of whey-forward protein, zero compromise on taste. Launching soon.",
};

const values = [
  {
    n: "01",
    title: "Delicious is non-negotiable.",
    body: "If a chonk tastes like a supplement, it’s failed. Taste is the reason anyone comes back. We don’t ship what we wouldn’t drink.",
  },
  {
    n: "02",
    title: "Substance under the style.",
    body: "Every claim we make is measurable on the nutrition label. No spin. 50g of protein is the recipe, not the marketing.",
  },
  {
    n: "03",
    title: "Whey-forward. Real food.",
    body: "Whey isolate — the gold standard for muscle recovery — plus whole ingredients you can pronounce. No fillers, no gums, no hidden sugars.",
  },
  {
    n: "04",
    title: "Made to order. Always.",
    body: "Nothing pre-blended. Nothing sitting in a fridge. Fresh, in front of you, every time. That’s the ritual.",
  },
];

const stats = [
  { v: "50g", k: "Protein per chonk" },
  { v: "+43%", k: "Above the retail ceiling" },
  { v: "Soon", k: "First pop-up · Perth" },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-[72px] pb-12">
        <div className="container-site">
          <span
            className="text-eyebrow"
            style={{ color: "var(--color-proof-fg)" }}
          >
            The story
          </span>
          <h1 className="text-hero mt-3 max-w-[900px]">
            Two mates. One missing
            <br />
            <span style={{ color: "var(--color-pink)" }}>
              shake.
            </span>
          </h1>
          <p
            className="leading-[1.6] max-w-[640px] mt-5"
            style={{ color: "var(--color-muted)", fontSize: 17 }}
          >
            We&apos;re two mates from Perth. We train, we cook, we care about
            this stuff. And no matter what we tried, we could never hit a
            proper protein number without choking down something that tasted
            like chalk or half a dessert. So we built one.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-site">
          <div
            className="relative"
            style={{
              background: "var(--color-pink)",
              borderRadius: "var(--radius-card-lg)",
              aspectRatio: "16 / 8",
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/hero-cup.jpg"
              alt="chonk. cups with fresh fruit"
              fill
              sizes="(max-width: 960px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </section>

      <section
        className="section-padding"
        style={{ background: "var(--color-milk)" }}
        aria-label="Values"
      >
        <div className="container-site">
          <header className="max-w-[720px] mb-14 flex flex-col gap-3">
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              What we stand for
            </span>
            <h2 className="text-section">Four rules. No exceptions.</h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v) => (
              <div
                key={v.n}
                style={{
                  padding: 32,
                  borderRadius: "var(--radius-card-lg)",
                  background: "var(--color-cream)",
                  border: "1px solid var(--color-hairline)",
                }}
              >
                <div
                  className="font-display"
                  style={{
                    fontVariationSettings: '"SOFT" 100, "WONK" 1',
                    fontWeight: 900,
                    fontSize: 48,
                    color: "var(--color-pink)",
                    lineHeight: 1,
                  }}
                >
                  {v.n}
                </div>
                <h3
                  className="mt-4"
                  style={{ fontSize: 24, letterSpacing: "-0.02em" }}
                >
                  {v.title}
                </h3>
                <p
                  className="leading-[1.6] mt-3"
                  style={{ color: "var(--color-muted)", fontSize: 16 }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <div className="grid gap-14 md:grid-cols-[1fr_1fr] items-center">
            <div
              className="relative"
              style={{
                background: "var(--color-pink)",
                borderRadius: "var(--radius-card-lg)",
                aspectRatio: "4 / 5",
                overflow: "hidden",
              }}
            >
              <Image
                src="/images/hero-cup.jpg"
                alt="chonk. — two mates from Perth"
                fill
                sizes="(max-width: 960px) 100vw, 600px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <span
                className="text-eyebrow"
                style={{ color: "var(--color-proof-fg)" }}
              >
                The founders
              </span>
              <h2 className="text-section mt-3">
                Two mates,
                <br />
                <span style={{ color: "var(--color-pink)" }}>
                  one blender.
                </span>
              </h2>
              <p
                className="leading-[1.65] mt-5"
                style={{ color: "var(--color-muted)", fontSize: 17 }}
              >
                We&apos;re building chonk. in public. Recipe tests, compliance,
                supplier calls, pop-up planning — all of it. No outside funding.
                Just two people who got sick of the choice between sugar-water
                smoothies and chalky shaker bottles. And who think Perth
                deserves better.
              </p>
              <p
                className="leading-[1.65] mt-4"
                style={{ color: "var(--color-muted)", fontSize: 17 }}
              >
                First pop-up is coming. Get on the list and we&apos;ll tell you
                where and when, first.
              </p>

              <div
                className="grid grid-cols-3 gap-4 mt-9 py-6"
                style={{ borderBlock: "1px solid var(--color-hairline)" }}
              >
                {stats.map((s) => (
                  <div key={s.k}>
                    <div
                      className="font-display"
                      style={{
                        fontWeight: 900,
                        fontVariationSettings: '"SOFT" 100, "WONK" 1',
                        fontSize: 28,
                        letterSpacing: "-0.02em",
                        color: "var(--color-pink)",
                      }}
                    >
                      {s.v}
                    </div>
                    <div
                      className="text-eyebrow mt-1"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {s.k}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site text-center">
          <h2 className="text-section mb-8">Be there for the first pour.</h2>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/#newsletter"
              className="chonk-btn chonk-btn-primary chonk-btn-lg"
            >
              Get on the list
            </Link>
            <Link
              href="/menu"
              className="chonk-btn chonk-btn-ghost chonk-btn-lg"
            >
              See the menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
