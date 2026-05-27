"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ChonkLogo from "@/components/ui/ChonkLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/references", label: "Science" },
  { href: "/about", label: "About" },
];

/**
 * Sticky header with translucent dark surface + blur, matching the design
 * artboard. The underline indicator tracks the active route so visitors
 * always know where they are in the site tree.
 */
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 inset-x-0 z-50",
          "border-b border-[var(--color-hairline)]",
          "bg-[#F2B8CC]"
        )}
      >
        <div className="container-site site-header-inner flex h-[72px] items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Chonk — home"
            onClick={() => setMenuOpen(false)}
            className="flex items-center"
          >
            <ChonkLogo variant="dark-splash" size="sm" />
          </Link>

          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-body text-sm font-medium transition-colors duration-150 relative",
                    "text-black"
                  )}
                  style={{ color: "#000000" }}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 right-0 -bottom-[22px] h-[2px] bg-pink"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="chonk-header-actions flex items-center">
            <Link
              href="/#newsletter"
              className="chonk-btn chonk-btn-primary chonk-btn-header"
              style={{
                border: "2px solid #000000",
                color: "#000000",
              }}
            >
              Get on the list
            </Link>
            <Link
              href="/"
              className="chonk-btn chonk-btn-outline chonk-btn-header chonk-btn-header-launch chonk-btn-header-soft-hover"
              style={{
                border: "2px solid #000000",
                color: "#000000",
              }}
            >
              Where should Chonk launch first?
            </Link>

            <button
              type="button"
              className="flex h-9 w-9 flex-none flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-[#ffe7f7] md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen ? "true" : "false"}
            >
              <span
                className={cn(
                  "block h-0.5 w-6 bg-black transition-all duration-200",
                  menuOpen && "translate-y-2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-black transition-all duration-200",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-6 bg-black transition-all duration-200",
                  menuOpen && "-translate-y-2 -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-cream pt-20 transition-all duration-300 md:hidden",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        aria-hidden={menuOpen ? "false" : "true"}
      >
        <nav
          className="container-site flex flex-col gap-2 pt-8"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display font-black text-3xl text-ink py-4 border-b border-[var(--color-hairline)] tracking-tight"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6">
            <Link
              href="/#newsletter"
              onClick={() => setMenuOpen(false)}
              className="chonk-btn chonk-btn-primary chonk-btn-lg w-full"
            >
              Get on the list
            </Link>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="chonk-btn chonk-btn-outline chonk-btn-header-soft-hover chonk-btn-lg w-full mt-3"
            >
              Where should Chonk launch first?
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
