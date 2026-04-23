import Link from "next/link";

export default function CTABlock() {
  return (
    <section
      className="section-padding"
      style={{ paddingBlock: 160 }}
      aria-label="Call to action"
    >
      <div className="container-site">
        <div
          className="text-center"
          style={{
            background: "var(--color-pink)",
            color: "#1A1614",
            borderRadius: "var(--radius-card-lg)",
            padding: "80px clamp(24px, 6vw, 64px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="text-hero mx-auto"
            style={{ color: "#1A1614", maxWidth: 820 }}
          >
            50 grams closer.
          </div>
          <p
            className="mx-auto mt-5"
            style={{
              fontSize: 18,
              color: "rgba(26,22,20,0.7)",
              maxWidth: 560,
            }}
          >
            Whey-forward. Real food. Made to order. From $4.50 — up to 50g
            protein — pouring soon in Perth.
          </p>
          <div className="flex gap-3 justify-center mt-9 flex-wrap">
            <Link
              href="/#newsletter"
              className="chonk-btn chonk-btn-lg"
              style={{ background: "#1A1614", color: "var(--color-pink)" }}
            >
              Get on the list
            </Link>
            <Link
              href="/menu"
              className="chonk-btn chonk-btn-lg"
              style={{ border: "2px solid #1A1614", color: "#1A1614" }}
            >
              See the menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
