import type { Metadata } from "next";
import BuilderClient from "./BuilderClient";

export const metadata: Metadata = {
  title: "Build your chonk",
  description:
    "Build your own chonk — base, protein, flavours. Live pricing and macros. Pouring soon in Perth.",
};

export default function BuildPage() {
  return (
    <>
      <section className="pt-[72px] pb-4">
        <div className="container-site">
          <span
            className="text-eyebrow"
            style={{ color: "var(--color-proof-fg)" }}
          >
            Build your chonk
          </span>
          <h1 className="text-hero mt-3 max-w-[820px]">
            Your chonk,
            <br />
            <span style={{ color: "var(--color-pink)" }}>your rules.</span>
          </h1>
          <p
            className="leading-[1.6] max-w-[600px] mt-5"
            style={{ color: "var(--color-muted)", fontSize: 17 }}
          >
            Pick a base, pick a protein, stack up to five flavours. Live price,
            live macros. Whatever you build, you&apos;re 50 grams closer.
          </p>
        </div>
      </section>
      <BuilderClient />
    </>
  );
}
