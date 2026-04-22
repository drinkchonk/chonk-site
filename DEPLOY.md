# Deploying Chonk

Target: **Vercel**. The repo is a zero-config Next.js 16 App Router project — Vercel auto-detects the framework, build command, and output directory.

## First-time setup

1. Push this repo to GitHub.
2. In the Vercel dashboard: **Add New → Project → Import** the repo.
3. Framework preset: **Next.js** (auto-detected). Leave build command, output directory, and install command at defaults.
4. Set environment variables under **Settings → Environment Variables** if/when needed (none required at launch).
5. Click **Deploy**. First deploy takes ~90 seconds.
6. Add the production domain (`chonkshakes.com.au`) under **Settings → Domains**.

## Branch & preview model

- `main` deploys to **Production**.
- Every other branch and PR gets a **Preview deployment** with its own URL — share the link for review.
- The CI workflow (`.github/workflows/ci.yml`) runs `lint → test → build` on every push and PR; merge is gated on green CI.

## Local pre-flight

Before pushing, run the same checks CI runs:

```bash
npm run lint
npm test
npm run build
```

## Roll back

In Vercel, go to **Deployments**, find a known-good deployment, and click **Promote to Production**. Rollbacks are instant — no rebuild required.

## Notes

- **Fluid Compute** is on by default; the marketing site is fully static so this doesn't change much, but server components and metadata are rendered without cold-start penalties when ISR/dynamic routes are added later.
- **Image optimisation** runs on the edge automatically for `next/image` consumers (currently `ChonkLogo`).
- **No third-party CDNs** are required — all assets ship from `/public`.
- The `/chonk-hero.html` page loads Three.js from `unpkg.com`; if you want first-party-only delivery, vendor those scripts into `/public/vendor/`.
