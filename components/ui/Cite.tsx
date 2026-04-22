import Link from "next/link";

type CiteProps = {
  /** Reference IDs — must match entries in lib/data/references.ts */
  refs: number[];
};

/**
 * Inline citation chip. Renders as superscript linked reference numbers
 * that scroll to /references#ref-N. Uses the sage/proof accent colour so
 * claims remain legible against the dark milk cards.
 */
export default function Cite({ refs }: CiteProps) {
  return (
    <sup className="cite">
      {refs.map((n, i) => (
        <span key={n}>
          <Link href={`/references#ref-${n}`} aria-label={`Reference ${n}`}>
            [{n}]
          </Link>
          {i < refs.length - 1 && ","}
        </span>
      ))}
    </sup>
  );
}
