import Image from "next/image";

export default function FounderStory() {
  return (
    <section className="section-padding" aria-label="Founder story">
      <div className="container-site">
        <div className="grid gap-16 md:grid-cols-[1fr_1.1fr] items-center">
          <div>
            <div
              className="overflow-hidden bg-milk"
              style={{
                borderRadius: "var(--radius-card-lg)",
                aspectRatio: "4 / 5",
                maxWidth: 520,
              }}
            >
              <Image
                src="/images/product-cup-fruit.jpg"
                alt="Chonk cup with tropical fruit on warm orange"
                width={520}
                height={650}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <span
              className="text-eyebrow"
              style={{ color: "var(--color-proof-fg)" }}
            >
              The story
            </span>
            <h2 className="text-section mt-3">
              Started in a gym carpark with a blender and a grudge.
            </h2>
            <p
              className="text-pretty leading-[1.65] mt-5 max-w-[520px]"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              I was paying $8 for &ldquo;protein shakes&rdquo; with 15g of
              protein and half a cup of sugar. So I built my own. 60g of whey
              isolate, real banana, raw honey, oat milk, blended in 4 minutes.
              My mates started asking for them. Then strangers at the gym.
              Then a stall at the leisure centre.
            </p>
            <p
              className="text-pretty leading-[1.65] mt-4 max-w-[520px]"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              Chonk isn&apos;t wellness. It&apos;s not a lifestyle brand.
              It&apos;s a protein shake that actually has protein, made by
              someone who got tired of being ripped off.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--color-pink)",
                }}
              />
              <div>
                <div
                  className="font-display"
                  style={{
                    fontWeight: 900,
                    fontVariationSettings: '"SOFT" 100, "WONK" 1',
                    fontSize: 16,
                  }}
                >
                  Jack Mahoney
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  Founder · Osborne Park · est. 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
