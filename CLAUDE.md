# Chonk Shakes — Site Context

The marketing site for **Chonk Shakes**, a high-protein shake pop-up (50–60g per shake) operating out of Perth markets and gyms. Design-first: premium photography, confident typography, purposeful animation. The site introduces the brand to the general public and communicates the science without feeling clinical.

---

## Brand voice

- **Clinical in the science, playful in everything else.** The contrast is the point — the product delivers what it claims; the brand doesn't take itself too seriously.
- Assume the reader has never heard of Chonk.
- What to communicate: the promise (real protein, no gimmick), the science (what 50–60g does and why it's formulated this way), the vibe (bold, cheeky, unapologetic), where to find it (markets, gyms, pop-ups).

## What to avoid

- Emoji decoration in UI copy.
- Generic gradients, pastel blobs, glassmorphism, centre-aligned-everything layouts.
- Default "AI-looking" aesthetics — the site should feel designed, not templated.
- Animation for decoration. Motion should communicate something (reveal a relationship, reward scrolling, signal hierarchy).
- Raw `<img>` tags — always `next/image`.

---

## Tech stack (as-is, not aspirational)

- **Next.js 16** (App Router, Turbopack). This is **not the Next.js most training data describes** — APIs, conventions, and file structure may differ. Read the relevant guide in `node_modules/next/dist/docs/` before writing anything non-trivial. The root `AGENTS.md` echoes this rule.
- **TypeScript** throughout.
- **Tailwind v4** via the `@theme inline` token syntax in `app/globals.css`. Custom utilities in the same file: `.container-site`, `.section-padding`, `.text-hero`, `.text-nutrition`, `.text-section`, `.text-eyebrow`. Prefer those over rewriting spacing/typography ad hoc.
- **next/font** loads Fraunces (display, with `SOFT` + `WONK` + `opsz` variable axes) and Inter (body). They resolve to `--font-display` / `--font-body`.
- **Lenis** for smooth momentum scroll (`components/layout/SmoothScroll.tsx`). Honours `prefers-reduced-motion`. Components that need scroll position should rAF-poll `window.scrollY` / `getBoundingClientRect()` — Lenis's smooth-wheel mode does not reliably dispatch native `scroll` events.
- **Three.js** inside an iframe at `public/chonk-hero.html` for the hero cup. Keeps heavy WebGL out of the Next bundle. Same-origin; reads scroll from `window.parent` via a shim.
- **No Framer Motion** is wired up. Prefer raw CSS transitions plus scroll- or time-driven JS where needed (see `components/sections/Hero.tsx`).
- **Supabase** is a listed dependency for future use (newsletter, forms, ordering). Nothing is wired to it yet. When it is: RLS always on, server client for sensitive operations, never expose `service_role` in the browser.

---

## Design tokens (`app/globals.css`)

Brand:
- `--color-cream` — page surface. **Currently dark (`#0E0C0D`)** as part of a dark-theme experiment (swapped with `--color-ink`).
- `--color-ink` — primary text. **Currently light (`#FEF6EC`)** for the same reason.
- `--color-milk` — off-white highlight.
- `--color-pink` (`#FFD8F3`) — primary brand accent. Header, CTAs, hero accents.
- `--color-proof` (`#3A5A40`) — deep green used for science / data chrome.

Flavour palette: `--color-sage`, `--color-cocoa`, `--color-banana`.

Utility: `--color-muted`, `--color-hairline` — tinted with the active text colour, so flip alongside cream/ink.

Shadows: `--shadow-card`, `--shadow-card-hover`, `--shadow-brutalist` (hard 4px offset, brand signature).

Radii: `--radius-pill`, `--radius-card-lg`, `--radius-card`, `--radius-card-sm`, `--radius-card-xs`.

**Subtlety that matters:** `text-cream` is doing double duty — it's both "the cream colour" and "light text on a dark brand surface" (buttons, dark-card overlays, the Instagram hover state). When flipping the theme, usages in the second role must be pinned to an explicit light value (e.g. `text-white`) so contrast doesn't break. Don't let a single token change cascade into places where readability depends on the token meaning the other thing.

---

## File map

- `app/` — App Router pages. `app/layout.tsx` mounts `SmoothScroll`, `Header`, `Footer`, and the font variables.
- `app/page.tsx` — home.
- `components/sections/` — page-level blocks (`Hero`, `ProofBar`, `FlavourGrid`, `FounderStory`, `IngredientScience`, `InstagramGrid`).
- `components/ui/` — reusable primitives (`Button`, `ChonkLogo`, `SmallCup`).
- `components/layout/` — `Header`, `Footer`, `SmoothScroll`.
- `public/` — static assets.
  - `public/chonk-hero.html` — Three.js hero cup. Treat as its own micro-app.
  - `public/images/` — photography and logo variants.
- `lib/utils.ts` — `cn()` class merger.

Don't create new top-level folders without asking.

---

## How the hero works (so you don't accidentally break it)

`components/sections/Hero.tsx` mounts a full-screen section containing:

1. An iframe embedding `public/chonk-hero.html` — a Three.js cup textured with the Chonk wordmark, rotating **autonomously** at a base angular velocity.
2. A `z-10` overlay of four "beat" headlines that cross-fade through a **16 s time loop**, centres at 1/8, 3/8, 5/8, 7/8 so the wrap point lands in a visual gap.

Scroll does not pin the hero. Instead, scroll delta adds a short-lived **velocity boost** to the cup's rotation — scrolling pushes it past its idle pace, then decays back. The iframe scrolls via a shim that reads `window.parent.scrollY`; keep `scrolling="no"` on the iframe or it will intercept wheel events.

If asked to go back to a scroll-pinned hero, the pattern is: outer `<section>` with `h-[Nvh]`, inner `sticky top-0 h-screen` wrapper, iframe inside that, progress computed from `-sectionRef.getBoundingClientRect().top / (offsetHeight - innerHeight)`. Track progress via rAF polling, not scroll events.

---

## Collaboration expectations

- **Read before you edit.** Check existing tokens, utilities, and patterns before introducing new ones.
- **Don't expand the stack without asking.** What's listed above is the whole stack. No new UI libraries, animation libraries, icon packs, or state stores.
- **One change at a time.** Don't refactor code adjacent to the task unless explicitly asked.
- **Test design changes in the browser.** `npm run dev` → `http://localhost:3000`. Type-checking verifies correctness, not feel — for UI work, load the page and inspect across narrow / tablet / desktop viewports. Verify animations respect `prefers-reduced-motion`.
- **Never commit `.env.local` or any `service_role` key.**

When a design decision is ambiguous or load-bearing, propose two or three directions in a sentence each and let the user pick — don't silently commit to one.

---

## Response style

The user is non-technical. Keep explanations simple and jargon-light. After changes, answer three things in that order:

1. **What changed** — one sentence, plain English.
2. **Why it matters** — one sentence.
3. **What to do next** — one concrete action (e.g. "hard-refresh the page", "try scrolling through the hero", "set `X` in Vercel → Settings → Environment Variables").

For external tools (Vercel, Supabase, domain setup, GitHub): walk the user to the exact location (`Vercel dashboard → Project → Settings → Environment Variables`) and describe each field in one line. Less is more.

If something failed, say so plainly and give the single clearest fix.
