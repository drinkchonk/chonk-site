import type { Metadata } from "next";
import WholesaleForm from "@/components/forms/WholesaleForm";

export const metadata: Metadata = {
  title: "Chonk — Wholesale",
  description: "Stock Chonk in your gym, café, or venue.",
};

export default function WholesalePage() {
  return (
    <main
      style={{
        padding: "60px 24px",
        maxWidth: 720,
        margin: "0 auto",
        display: "grid",
        gap: 24,
      }}
    >
      <header>
        <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.1 }}>
          Stock Chonk in your venue
        </h1>
        <p style={{ marginTop: 12, color: "var(--color-muted)" }}>
          Tell us where you&apos;d like to carry Chonk and we&apos;ll come
          back with wholesale pricing, lead times, and a sample pack.
        </p>
      </header>
      <WholesaleForm />
    </main>
  );
}
