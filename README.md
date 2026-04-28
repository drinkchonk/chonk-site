# Chonk

Australia's highest-protein smoothie bar. Marketing site for [chonkshakes.com.au](https://chonkshakes.com.au).

Built on Next.js 16 (App Router) + React 19 + Tailwind v4. The hero shake spins as you scroll — driven by an embedded Three.js scene wired to the parent page's smooth-scroll position.

## Stack

| Layer            | Choice                                                    |
| ---------------- | --------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)                        |
| UI               | React 19                                                  |
| Styling          | Tailwind CSS v4 (`@theme inline` tokens in `globals.css`) |
| Smooth scroll    | [Lenis](https://github.com/darkroomengineering/lenis)     |
| 3D hero          | Three.js r160 (ES-module importmap) + Poly Haven HDRI, sandboxed in `/public/chonk-hero.html` |
| Display type     | Fraunces (variable, SOFT + WONK + opsz axes via `next/font`) |
| Body type        | Inter (via `next/font`)                                   |
| Class composition| `clsx` + `tailwind-merge` (`lib/utils.ts → cn()`)         |
| Tests            | Jest 30 + React Testing Library + jsdom                   |
| CI               | GitHub Actions (`.github/workflows/ci.yml`)               |

## Run it

```bash
npm install
npm run dev          # http://localhost:3000 (or -p 3010 if 3000 is taken)
```

## Newsletter signup (Resend)

The footer "Get on the list" form posts to `/api/subscribe`, which adds the email as a contact in the **chonk waitlist** Resend audience and sends a welcome email. Set these in `.env.local` for local dev and in Vercel (Production + Preview) for deploys:

| Var | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | From the drinkchonk workspace at [resend.com/api-keys](https://resend.com/api-keys). Mark **Sensitive** in Vercel. |
| `RESEND_AUDIENCE_ID` | recommended | Audience ID from [resend.com/audiences](https://resend.com/audiences). Optional — if unset, the handler resolves (or creates) the **chonk waitlist** audience on first request and logs the ID; copy it back here for stability. |
| `RESEND_FROM` | optional | e.g. `chonk. <hello@chonkshakes.com>`. Domain must be verified in Resend. If unset, contacts are still added; the welcome email is skipped. |

## Verify

```bash
npm run lint
npm test
npm run build        # production bundle
```

## Project shape

```
app/
  layout.tsx            # root: fonts, smooth-scroll wrapper, header, footer
  page.tsx              # home — composes Hero + 8 section components
  globals.css           # Tailwind v4 theme tokens + utility layer
  menu/
    page.tsx            # server wrapper w/ metadata
    MenuClient.tsx      # client: tabbed flavour detail + whole-lineup grid
  about/page.tsx        # story + values + founder + press quote
  find-us/
    page.tsx            # stylised SVG map + stall cards + wholesale form
    WholesaleForm.tsx   # client: venue enquiry form
  references/page.tsx   # sticky TOC + 15-source bibliography
components/
  layout/               # Header, Footer, NewsletterForm, SmoothScroll
  sections/             # Hero, TickerStrip, ProofBar, FlavourGrid,
                        # IngredientScience, ComparisonSection,
                        # FounderStory, FindUsTeaser, CTABlock
  ui/                   # Card, ChonkLogo, Cite, MiniCup
lib/
  utils.ts              # cn()
  data/                 # products, locations, references (single source of truth)
public/
  chonk-hero.html       # standalone Three.js scroll-driven cup
  images/               # logos, product photography
__tests__/              # mirrors components/ and lib/
```

## How the scroll-driven 3D hero works

1. `app/layout.tsx` mounts `<SmoothScroll />`, a client component that initialises Lenis on the document. Lenis owns `scroll` events on the parent page.
2. `components/sections/Hero.tsx` renders an `<iframe src="/chonk-hero.html">` inside a rounded card. The iframe has `scrolling="no"`, so wheel/touch events pass through to the Lenis-driven parent.
3. Inside the iframe, `chonk-hero.html` builds a `LatheGeometry` cup, listens to its own `window.scrollY`, and rotates the mesh on every animation frame. Because the iframe is same-origin and unaffected by Lenis, its `scrollY` changes naturally as the parent scrolls — so the cup spins in lockstep without any postMessage glue.
4. `prefers-reduced-motion` short-circuits the Lenis raf loop and the smooth scrolling becomes native — Three.js still runs but the rotation is incidental, not animated.

Decoupling the 3D into a standalone HTML file keeps the Three.js dependency out of the React bundle and makes the rotation behaviour easy to iterate without redeploying the app shell.

### Render pipeline (r160)

- **Three.js r160** loaded via `<script type="importmap">` pinning `three@0.160.x`. Addons (`RGBELoader`, `RectAreaLightUniformsLib`, `PMREMGenerator`) come from the same CDN version — no legacy `sRGBEncoding` / `outputEncoding` anywhere.
- **Studio HDRI** at `/public/assets/studio.hdr` — Poly Haven `studio_small_09` 1K equirectangular (CC0). Decoded by `RGBELoader`, prefiltered via `PMREMGenerator`, and assigned to `scene.environment`. A procedural canvas gradient is used as a fallback while the HDR streams in.
- **Softbox key light**: `RectAreaLight` (4×6, 8.5 intensity) after `RectAreaLightUniformsLib.init()` — gives the cup its specular roll-off.
- **Anisotropic filtering** on every texture via a shared `MAX_ANISO = renderer.capabilities.getMaxAnisotropy()` constant.
- **Baked contact shadow** plane in world space (not parented to the cup) using a canvas radial gradient squashed to an ellipse.
- **Opaque white plastic straw** — `MeshStandardMaterial`, no `transmission`, 64 radial segments, closed top.
- **Transparent canvas preserved end-to-end** (`alpha: true`, `setClearColor(0x000000, 0)`) so the iframe composites over the host page. Post-processing (`EffectComposer`) was intentionally omitted — it clobbered alpha, and the HDRI + RectAreaLight produce the highlight roll-off bloom was faking.

Locked brand values (enforced by `__tests__/public/chonk-hero.test.ts`): cup pink `#d46894`, the `studio.hdr` asset, r160 importmap pins, opaque-straw invariant, anisotropy on ≥3 textures, and the transparent-canvas contract.

## Home page composition

`app/page.tsx` is a nine-section server component:

1. `Hero` — split column; copy + CTAs left, 3D iframe right with a rotating beat pill and "Made fresh. To order." circle.
2. `TickerStrip` — pink marquee of brand claims, duplicated row + `-50%` keyframe for a seamless loop.
3. `ProofBar` — four stat columns (60g / 0g / 3× / ≈4min).
4. `FlavourGrid` — three featured products, `.flavour-card` utility, `MiniCup` SVG tinted via `miniCupShadeFor`.
5. `IngredientScience` — six ingredient cards, inline `<Cite refs={…} />` chips.
6. `ComparisonSection` — protein bar chart + head-to-head table (`.compare` utility).
7. `FounderStory` — split portrait + copy with "Started in a gym carpark with a blender and a grudge." hook.
8. `FindUsTeaser` — three `.loc-card`s driven from `lib/data/locations.ts`.
9. `CTABlock` — full-bleed pink block with the "stop paying gym-fridge prices" line.

## Testing notes

- `next/jest` handles SWC transforms, the `@/*` alias, and CSS stubbing.
- `jest.setup.ts` loads `@testing-library/jest-dom` matchers.
- Tests cover: `cn()`, products/locations/references invariants (cardinality, citation integrity, palette), `Cite` link generation, `Footer` nav + social, and the `chonk-hero.html` locked brand values.

## Deploying

See [DEPLOY.md](./DEPLOY.md). Vercel is the target — the project ships zero custom infrastructure.

## License

© Chonk Shakes Pty Ltd. All rights reserved.
