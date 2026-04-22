import Link from "next/link";
import ChonkLogo from "@/components/ui/ChonkLogo";
import { locations } from "@/lib/data/locations";
import NewsletterForm from "./NewsletterForm";

const exploreLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/references", label: "Science" },
  { href: "/find-us", label: "Find Us" },
  { href: "/about", label: "About" },
];

const socialLinks = [
  {
    href: "https://instagram.com/chonkshakes",
    label: "Instagram",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://tiktok.com/@chonkshakes",
    label: "TikTok",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-6.11 7.05 6.86 6.86 0 0 0 11.68 4.85 6.86 6.86 0 0 0 2-4.87v-6.9a8.16 8.16 0 0 0 4.77 1.52v-3.39a4.85 4.85 0 0 1-1.11-.87z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-milk pt-20 pb-10 border-t border-[var(--color-hairline)]">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr] mb-14">
          <div>
            <ChonkLogo variant="light" size="md" />
            <p className="mt-4 text-muted max-w-[320px] text-sm leading-relaxed">
              Australia&apos;s highest-protein smoothie. Fresh-blended,
              made-to-order, Perth-born.
            </p>
            <div className="flex gap-2.5 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-ink hover:bg-white/[0.12] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-eyebrow text-muted mb-4">Explore</div>
            <ul className="flex flex-col gap-2.5 text-sm">
              {exploreLinks.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <Link
                    href={link.href}
                    className="text-ink/80 hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-eyebrow text-muted mb-4">Locations</div>
            <ul className="flex flex-col gap-2.5 text-sm">
              {locations.map((loc) => (
                <li key={loc.id}>
                  {loc.suburb}{" "}
                  <span
                    className={`text-[11px] ml-1 ${
                      loc.status === "open"
                        ? "text-[var(--color-proof-fg)]"
                        : "text-muted"
                    }`}
                  >
                    {loc.status === "open" ? "OPEN" : "SOON"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-eyebrow text-muted mb-4">Newsletter</div>
            <p className="text-sm text-muted mb-3">
              New flavours, new stalls, no fluff.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="hairline" />

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 pt-8 text-xs text-muted">
          <div>© Chonk Shakes {year}. Perth, Western Australia.</div>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-ink transition-colors">
              Terms
            </Link>
            <Link href="/find-us" className="hover:text-ink transition-colors">
              Wholesale
            </Link>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="mt-16 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
        }}
      >
        <div
          className="wordmark-huge text-center px-4"
          style={{ color: "rgba(255, 216, 243, 0.08)" }}
        >
          chonk
        </div>
      </div>
    </footer>
  );
}
