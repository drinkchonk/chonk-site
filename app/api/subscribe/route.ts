import { NextResponse } from "next/server";
import { Resend } from "resend";
import { welcomeHtml, welcomeSubject, welcomeText } from "@/lib/email/welcome";
import { buildUnsubscribeUrl } from "@/lib/email/unsubscribe";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUDIENCE_NAME = "chonk waitlist";

// Module-scoped promise so concurrent cold-start requests share one lookup.
let audienceIdPromise: Promise<string> | null = null;

function genericError(status = 500) {
  return NextResponse.json(
    { error: "Could not subscribe right now. Try again shortly." },
    { status },
  );
}

async function resolveAudienceId(resend: Resend): Promise<string> {
  const fromEnv = process.env.RESEND_AUDIENCE_ID?.trim();
  if (fromEnv) return fromEnv;

  if (!audienceIdPromise) {
    audienceIdPromise = (async () => {
      const list = await resend.audiences.list();
      if (list.error) {
        throw new Error(`audiences.list: ${list.error.name}`);
      }
      const existing = list.data?.data.find((a) => a.name === AUDIENCE_NAME);
      if (existing) {
        console.warn(
          `subscribe: using audience "${AUDIENCE_NAME}" (${existing.id}). Set RESEND_AUDIENCE_ID to skip this lookup.`,
        );
        return existing.id;
      }
      const created = await resend.audiences.create({ name: AUDIENCE_NAME });
      if (created.error || !created.data) {
        throw new Error(
          `audiences.create: ${created.error?.name ?? "no data"}`,
        );
      }
      console.warn(
        `subscribe: created audience "${AUDIENCE_NAME}" (${created.data.id}). Set RESEND_AUDIENCE_ID=${created.data.id} to make this stable.`,
      );
      return created.data.id;
    })().catch((err) => {
      audienceIdPromise = null; // allow retry on next request
      throw err;
    });
  }
  return audienceIdPromise;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, hp } = (body ?? {}) as { email?: string; hp?: string };

  // Honeypot: bots fill hidden fields. Pretend success without doing anything.
  if (hp) return NextResponse.json({ ok: true });

  const trimmed = (email ?? "").trim().toLowerCase();
  if (!trimmed || !EMAIL_RE.test(trimmed) || trimmed.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("subscribe: RESEND_API_KEY missing");
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  let audienceId: string;
  try {
    audienceId = await resolveAudienceId(resend);
  } catch (err) {
    console.error(
      "subscribe: audience resolve failed",
      err instanceof Error ? err.message : "unknown",
    );
    return genericError();
  }

  // Resend's contacts.create silently upserts (returns the same id on repeat
  // calls with no error), so "already on the list" can't be detected from
  // the create response. Probe with contacts.get first.
  const existing = await resend.contacts.get({
    email: trimmed,
    audienceId,
  });
  const isDuplicate = !!existing.data && !existing.error;

  if (existing.error && existing.error.name !== "not_found") {
    console.error(
      "subscribe: contacts.get failed",
      existing.error.name,
      existing.error.message,
    );
    return genericError();
  }

  if (!isDuplicate) {
    const created = await resend.contacts.create({
      email: trimmed,
      audienceId,
      unsubscribed: false,
    });
    if (created.error) {
      console.error(
        "subscribe: contacts.create failed",
        created.error.name,
        created.error.message,
      );
      return genericError();
    }
  }

  // Welcome email — only on first-time subscribe, only when a verified
  // sender is configured. RESEND_FROM must be a domain verified in the
  // drinkchonk Resend workspace; we don't fall back to a guessed default.
  const from = process.env.RESEND_FROM?.trim();
  const replyTo = process.env.RESEND_REPLY_TO?.trim() || "hello@chonkshakes.com.au";
  // PUBLIC_SITE_URL lets us pin links to the canonical domain regardless of
  // whether the request hit a preview deploy URL. Falls back to the request
  // origin so it works in dev and prod without configuration.
  const baseUrl =
    process.env.PUBLIC_SITE_URL?.trim() || new URL(req.url).origin;
  const unsubscribeUrl = buildUnsubscribeUrl(trimmed, baseUrl, apiKey);
  if (!isDuplicate && from) {
    // Deliverability headers — the goal is Gmail Primary, not Promotions.
    // - List-Unsubscribe (HTTPS + mailto) is required by Gmail/Yahoo for
    //   bulk senders. The HTTPS URL handles RFC 8058 one-click POSTs from
    //   the inbox-level "Unsubscribe" link mail clients render automatically.
    // - replyTo points at a real human inbox so replies actually reach Sam.
    // - tags identifies this as transactional (welcome) for Resend analytics.
    const sent = await resend.emails.send({
      from,
      to: trimmed,
      replyTo,
      subject: welcomeSubject,
      html: welcomeHtml(unsubscribeUrl),
      text: welcomeText(unsubscribeUrl),
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${replyTo}?subject=unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      tags: [{ name: "type", value: "welcome" }],
    });
    if (sent.error) {
      // Contact is saved; failure to send the welcome is non-fatal.
      console.error(
        "subscribe: welcome email failed",
        sent.error.name,
        sent.error.message,
      );
    }
  } else if (!isDuplicate && !from) {
    // TODO: set RESEND_FROM (e.g. "chonk. <hello@chonkshakes.com>") once a
    // domain is verified in the drinkchonk Resend workspace, then welcome
    // emails will start sending automatically.
    console.warn("subscribe: RESEND_FROM unset — skipping welcome email");
  }

  return NextResponse.json({ ok: true, alreadySubscribed: isDuplicate });
}
