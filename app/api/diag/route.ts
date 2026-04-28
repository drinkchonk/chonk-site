import { NextResponse } from "next/server";

export const runtime = "nodejs";

// TEMPORARY diagnostic endpoint. Returns presence + length of expected env
// vars (never values) so we can confirm what the running production
// container actually sees. Folder is named "diag" (not "_diag") because
// Next.js App Router treats `_`-prefixed folders as private and skips
// them when discovering routes. Remove this file once newsletter signup
// is fully verified in prod.
export async function GET() {
  const summarize = (raw: string | undefined) => ({
    set: typeof raw === "string",
    length: raw?.length ?? 0,
    trimmedLength: raw?.trim().length ?? 0,
    firstChar: raw?.[0] ?? null,
    lastChar: raw?.[raw.length - 1] ?? null,
  });
  return NextResponse.json({
    deployedAt: new Date().toISOString(),
    env: {
      RESEND_API_KEY: summarize(process.env.RESEND_API_KEY),
      RESEND_AUDIENCE_ID: summarize(process.env.RESEND_AUDIENCE_ID),
      RESEND_FROM: summarize(process.env.RESEND_FROM),
      RESEND_REPLY_TO: summarize(process.env.RESEND_REPLY_TO),
      PUBLIC_SITE_URL: summarize(process.env.PUBLIC_SITE_URL),
    },
  });
}
