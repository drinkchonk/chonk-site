# How to edit this site

You don't need to install anything on your laptop. Pick the path that matches the change.

## Option 1 — Tiny copy edits (one paragraph, one button label)

1. Go to https://github.com/drinkchonk/chonk-site
2. Click into the file you want to change (e.g. `components/sections/Hero.tsx`).
3. Click the pencil icon (top right).
4. Edit the text. The "Preview" tab shows what changed.
5. Scroll down → "Commit changes" → green button.
6. Vercel deploys to chonkshakes.com.au in ~60 seconds.

Best for: changing a headline, swapping a stat, fixing a typo.

## Option 2 — Anything bigger (new section, layout tweak, image swap)

Use **GitHub Codespaces** — a full editor in your browser, no Mac install needed.

1. On the repo home page, click the green `<> Code` button.
2. Switch to the **Codespaces** tab → "Create codespace on main".
3. Wait ~30 seconds. VS Code opens in your browser with everything installed.
4. In the bottom terminal, run:
   ```bash
   npm run dev
   ```
5. A popup says "Your application running on port 3000 is available." Click **Open in Browser** — that's your live preview. Edits show up as you save.
6. When you're done:
   - Sidebar → branch icon (third from top)
   - Type a short message ("Updated hero copy")
   - Click the ✓ checkmark, then "Sync changes"
7. Vercel auto-deploys the new commit.

Free tier is 60 hours/month — plenty for a marketing site.

## Option 3 — Preview before going live (optional, for risky changes)

1. In Codespaces, before editing, run in the terminal:
   ```bash
   git checkout -b try-new-hero
   ```
2. Make your edits, commit, push (same sync button as above).
3. On github.com, you'll see "Compare & pull request" — click it, "Create pull request."
4. Vercel comments on the PR with a preview URL (e.g. `chonk-site-try-new-hero.vercel.app`). Share that URL with anyone for feedback.
5. Happy? On the PR page click "Merge pull request." That promotes it to live.

## What CI does

Every push runs in GitHub Actions:

- **Lint** — style checks. Advisory — failing lint does NOT block deploys.
- **Tests** — must pass.
- **Production build** — must pass. If this fails, Vercel won't deploy either.

If you see a red X on the Actions tab, click into the run. The error message tells you which file and line. Copy that to Claude or fix it directly.

## When something breaks

- **Vercel didn't deploy** → Vercel dashboard → Project → Deployments → click the failed one → "View Build Logs."
- **Site looks wrong after deploy** → Vercel dashboard → Deployments → click the previous green deploy → "Promote to Production." Instant rollback.
- **Codespace acting weird** → close the tab, reopen from the Codespaces tab. Or delete it and create a fresh one.

## What NOT to commit

- `.env.local` (secrets)
- `node_modules/` (the `.gitignore` already excludes it)
- Anything with API keys or passwords
