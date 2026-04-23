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
                src="/images/product-cup-solo-clean.jpg"
                alt="chonk. cup — pink, with lid and straw"
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
              Two mates.
              <br />
              <span style={{ color: "var(--color-pink)" }}>
                One missing shake.
              </span>
            </h2>
            <p
              className="text-pretty leading-[1.65] mt-5 max-w-[520px]"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              We were just two mates from Perth, who became obsessed with
              health. But as we became more conscious about what we consume,
              it became impossible to find food options that aligned with our
              goals and lifestyle. And no matter what we tried — store-bought
              drinks, smoothie shops, &ldquo;high-protein&rdquo; bars — we
              could never hit a proper protein number without choking down
              something that tasted like chalk or half a dessert, or was
              filled with substances you can&apos;t pronounce.
            </p>
            <p
              className="text-pretty leading-[1.65] mt-4 max-w-[520px]"
              style={{ color: "var(--color-muted)", fontSize: 17 }}
            >
              So we built a chonk around <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>whey
              isolate</strong> — the gold-standard protein for muscle recovery
              and synthesis. Fast-absorbing, complete amino profile,
              research-backed at the doses athletes actually need. Real whole
              milk. Real fruit. Real protein. Blended in front of you.
            </p>
            <p
              className="text-pretty leading-[1.65] mt-4 max-w-[520px]"
              style={{ color: "var(--color-ink)", fontSize: 17, fontWeight: 600 }}
            >
              One chonk. 50 grams closer.
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
                  Two mates, Perth
                </div>
                <div
                  className="text-[13px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  First pop-up · Coming soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
