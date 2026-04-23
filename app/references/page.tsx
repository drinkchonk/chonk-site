import type { Metadata } from "next";
import Link from "next/link";
import {
  references,
  referenceSections,
  type Reference,
} from "@/lib/data/references";

export const metadata: Metadata = {
  title: "References",
  description:
    "Every nutrition claim chonk. makes, cited. 15 peer-reviewed sources across 7 ingredient families.",
};

function slugify(s: string) {
  return s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function RefRow({ entry }: { entry: Reference }) {
  return (
    <li id={`ref-${entry.id}`} className="ref-row scroll-mt-24">
      <span className="num">{entry.id}</span>
      <div>
        <p
          className="font-body leading-[1.55]"
          style={{ fontSize: 15, color: "var(--color-ink)" }}
        >
          <span style={{ color: "var(--color-muted)" }}>{entry.authors}</span>{" "}
          <span style={{ fontWeight: 600 }}>{entry.title}</span>{" "}
          <span className="italic" style={{ color: "var(--color-muted)" }}>
            {entry.journal}
          </span>{" "}
          {entry.year}; {entry.vol}: {entry.page}.
          {entry.doi && (
            <>
              {" "}
              <a
                href={`https://doi.org/${entry.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-pink)" }}
                className="break-all hover:underline"
              >
                doi:{entry.doi}
              </a>
            </>
          )}
        </p>
        <p
          className="mt-2 leading-[1.55]"
          style={{ color: "var(--color-muted)", fontSize: 13 }}
        >
          <span
            className="text-eyebrow"
            style={{ color: "var(--color-proof-fg)" }}
          >
            Why it&apos;s here —
          </span>{" "}
          {entry.loe}
        </p>
      </div>
    </li>
  );
}

export default function ReferencesPage() {
  return (
    <>
      <section className="pt-[72px] pb-12">
        <div className="container-site">
          <Link
            href="/"
            className="text-eyebrow inline-flex items-center gap-2 mb-6"
            style={{ color: "var(--color-proof-fg)" }}
          >
            <span aria-hidden>←</span> Back home
          </Link>
          <span
            className="text-eyebrow"
            style={{ color: "var(--color-proof-fg)" }}
          >
            References & evidence
          </span>
          <h1 className="text-hero mt-3 max-w-[900px]">
            Every claim,
            <br />
            <span style={{ color: "var(--color-pink)" }}>sourced.</span>
          </h1>
          <p
            className="leading-[1.6] max-w-[620px] mt-5"
            style={{ color: "var(--color-muted)", fontSize: 17 }}
          >
            Every nutrition line on this site traces back to one of the{" "}
            {references.length} peer-reviewed sources below. Grouped by
            ingredient family. DOIs resolve to the original paper.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr] items-start">
            <nav
              aria-label="Jump to section"
              className="lg:sticky lg:top-24 flex flex-col gap-2"
            >
              <span
                className="text-eyebrow mb-2"
                style={{ color: "var(--color-muted)" }}
              >
                Contents
              </span>
              {referenceSections.map((section) => (
                <a
                  key={section}
                  href={`#${slugify(section)}`}
                  className="font-body text-[13px] leading-[1.4] hover:underline"
                  style={{ color: "var(--color-ink)" }}
                >
                  {section.split(" — ")[0]}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-14">
              {referenceSections.map((section) => {
                const items = references.filter((r) => r.section === section);
                return (
                  <section
                    key={section}
                    id={slugify(section)}
                    className="scroll-mt-24"
                  >
                    <h2
                      className="text-section"
                      style={{ fontSize: "clamp(22px, 2.4vw, 30px)" }}
                    >
                      {section}
                    </h2>
                    <p
                      className="mt-1 mb-4 text-[13px]"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {items.length}{" "}
                      {items.length === 1 ? "source" : "sources"}
                    </p>
                    <ul className="list-none p-0 m-0 flex flex-col">
                      {items.map((item) => (
                        <RefRow key={item.id} entry={item} />
                      ))}
                    </ul>
                  </section>
                );
              })}

              <div
                style={{
                  padding: 28,
                  borderRadius: "var(--radius-card-lg)",
                  background: "var(--color-milk)",
                  border: "1px solid var(--color-hairline)",
                }}
              >
                <span
                  className="text-eyebrow"
                  style={{ color: "var(--color-proof-fg)" }}
                >
                  A note on evidence
                </span>
                <p
                  className="leading-[1.6] mt-3"
                  style={{ color: "var(--color-muted)", fontSize: 15 }}
                >
                  We&apos;ve prioritised systematic reviews, ISSN position
                  stands and RCTs wherever possible. Where narrative reviews or
                  mechanistic studies are used, we&apos;ve said so in the
                  &ldquo;Why it&apos;s here&rdquo; note above. Spot an error or
                  have a better source?{" "}
                  <a
                    href="mailto:science@chonkshakes.com.au"
                    style={{ color: "var(--color-pink)" }}
                    className="hover:underline"
                  >
                    science@chonkshakes.com.au
                  </a>
                  . Build in public is a core value — if we&apos;re wrong,
                  we want to know.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
