# Newsletter setup (Resend)

The "Get on the list" form in the footer posts to `/api/subscribe`, which
adds the email to a Resend Audience and sends a welcome email.

You need three environment variables. Set them once locally, once on Vercel.

| Name | What it is | Where to find it |
| --- | --- | --- |
| `RESEND_API_KEY` | Server key Resend uses to authenticate API calls | Resend dashboard → **API Keys** → **Create API Key** (scope: *Sending access* + *Full access* on Audiences) |
| `RESEND_AUDIENCE_ID` | The mailing list new subscribers are added to | Resend dashboard → **Audiences** → create one called `chonk.` → copy the ID from the URL or settings |
| `RESEND_FROM` | The "From" address on the welcome email | See "Sender" below |

## Sender

The `RESEND_FROM` value must use a domain you've verified in Resend.

- **Until your domain is verified**, use Resend's sandbox sender so testing
  works:
  ```
  RESEND_FROM=onboarding@resend.dev
  ```
  Welcome emails will only be deliverable to the email address you signed
  up to Resend with.

- **After verifying `chonkshakes.com.au`** (Resend → **Domains** → **Add
  Domain** → add the DNS records they show you in your registrar), switch to:
  ```
  RESEND_FROM=chonk. <hello@chonkshakes.com.au>
  ```

## Local development

1. Copy `.env.local.example` to `.env.local`.
2. Paste in your real values.
3. `npm run dev` and submit the footer form with a real email you control.

## Vercel (production)

1. Go to **Vercel dashboard → chonk-site → Settings → Environment
   Variables**.
2. Add each of `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `RESEND_FROM`.
   Tick all three environments (Production, Preview, Development).
3. Redeploy (Vercel does this automatically on the next git push, or
   trigger one manually from the **Deployments** tab → **Redeploy**).

## What happens on submit

1. Email is validated.
2. Contact is added to your Resend Audience. Duplicates are silently
   ignored — the user sees "You're already on the list."
3. New subscribers receive the welcome email.

## Sending the actual newsletter later

Compose and send broadcasts from **Resend dashboard → Broadcasts**. Pick
the `chonk.` audience as the recipient list. No code changes needed.
