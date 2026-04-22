import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Chonk was started in a Perth gym carpark with a blender and a grudge against sugar-water protein.",
};

const values = [
  {
    n: "01",
    title: "Real food, not fortified water.",
    body: "Whey isolate plus whole ingredients — banana, cacao, honey, peanut butter. If we can\u2019t pronounce it, it doesn\u2019t go in.",
  },
  {
    n: "02",
    title: "Receipts on every claim.",
    body: "Every nutrition line on this site traces back to a peer-reviewed source. Fifteen of them. Linked inline.",
  },
  {
    n: "03",
    title: "Made to order. Full stop.",
    body: "Nothing pre-blended, nothing sat in a fridge for six days. Four minutes, start to finish, while you stand there.",
  },
  {
    n: "04",
    title: "Built for the set after the set.",
    body: "This is post-gym fuel. Designed for people who actually train — not a wellness accessory.",
  },
];

const stats = [
  { v: "2024", k: "First shake poured" },
  { v: "11,400+", k: "Shakes blended to date" },
  { v: "1", k: "Stall open · 2 on the way" },
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
            We got sick of sugar-water
            <br />
            <span style={{ color: "var(--color-pink)" }}>
              pretending to be protein.
            </span>
          </h1>
          <p
            className="leading-[1.6] max-w-[620px] mt-5"
            style={{ color: "var(--color-muted)", fontSize: 17 }}
          >
            Chonk started in a gym carpark in Osborne Park with a blender, a
            grudge, and a stubborn belief that post-workout nutrition should
            taste like something you actually want.
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
              alt="Three Chonk cups with fresh fruit"
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
                alt="Jack Mahoney, founder of Chonk"
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
                The founder
              </span>
              <h2 className="text-section mt-3">
                Jack Mahoney,
                <br />
                <span style={{ color: "var(--color-pink)" }}>
                  head chonk.
                </span>
              </h2>
              <p
                className="leading-[1.65] mt-5"
                style={{ color: "var(--color-muted)", fontSize: 17 }}
              >
                Trained six days a week, hated every post-workout option. Ran
                the numbers on the supermarket shelf: 17g protein, 13g sugar,
                $4. Did the maths three more times. Opened the first Chonk
                stall eight months later.
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

      <section
        className="section-padding"
        style={{ background: "var(--color-milk)" }}
        aria-label="Press"
      >
        <div className="container-site">
          <div className="max-w-[900px] mx-auto text-center">
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              On the record
            </span>
            <blockquote
              className="text-hero mt-4"
              style={{ fontSize: "clamp(32px, 4vw, 54px)" }}
            >
              &ldquo;The smoothie bar every gym-goer in Australia was
              missing.&rdquo;
            </blockquote>
            <p
              className="mt-5"
              style={{ color: "var(--color-muted)", fontSize: 15 }}
            >
              — Perth Now, Food & Fitness, 2025
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site text-center">
          <h2 className="text-section mb-8">Come try one.</h2>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/find-us"
              className="chonk-btn chonk-btn-primary chonk-btn-lg"
            >
              Find a Stall
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
