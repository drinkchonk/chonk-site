import { NextResponse } from "next/server";
import { Resend } from "resend";
import { decodeEmail, verifyEmail } from "@/lib/email/unsubscribe";

export const runtime = "nodejs";

function htmlPage(opts: { title: string; heading: string; body: string }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${opts.title}</title>
    <style>
      body { margin:0; padding:48px 20px; background:#0E0C0D; color:#FEF6EC;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
        min-height:100vh; box-sizing:border-box;
        display:flex; align-items:center; justify-content:center; }
      .card { max-width:520px; width:100%; }
      h1 { margin:0 0 20px 0; font-family:Georgia,'Times New Roman',serif;
        font-size:36px; line-height:1.1; letter-spacing:-0.02em; font-weight:600; }
      p { margin:0 0 16px 0; font-size:16px; line-height:1.65;
        color:rgba(254,246,236,0.85); }
      a { color:#F2B8CC; text-decoration:underline; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${opts.heading}</h1>
      ${opts.body}
    </div>
  </body>
</html>`;
}

async function unsubscribe(u: string | null, s: string | null) {
  if (!u || !s) {
    return { ok: false, status: 400, message: "Missing token." };
  }
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.error("unsubscribe: RESEND_API_KEY or RESEND_AUDIENCE_ID missing");
    return { ok: false, status: 500, message: "Service not configured." };
  }
  const email = decodeEmail(u);
  if (!email) {
    return { ok: false, status: 400, message: "Invalid token." };
  }
  if (!verifyEmail(email, s, apiKey)) {
    return { ok: false, status: 400, message: "Invalid signature." };
  }
  const resend = new Resend(apiKey);
  const result = await resend.contacts.update({
    email,
    audienceId,
    unsubscribed: true,
  });
  if (result.error) {
    // Treat "not found" (already removed) as success to be idempotent.
    if (result.error.name === "not_found") {
      return { ok: true, email };
    }
    console.error(
      "unsubscribe: contacts.update failed",
      result.error.name,
      result.error.message,
    );
    return { ok: false, status: 500, message: "Could not unsubscribe." };
  }
  return { ok: true, email };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const result = await unsubscribe(url.searchParams.get("u"), url.searchParams.get("s"));
  if (!result.ok) {
    return new NextResponse(
      htmlPage({
        title: "Unsubscribe — chonk.",
        heading: "Something's not right.",
        body: `<p>${result.message}</p><p>If you meant to unsubscribe, email us at <a href="mailto:hello@chonkshakes.com.au">hello@chonkshakes.com.au</a> and we'll take care of it.</p>`,
      }),
      { status: result.status, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  return new NextResponse(
    htmlPage({
      title: "Unsubscribed — chonk.",
      heading: "You're off the list.",
      body: `<p>We've removed <strong>${result.email}</strong>. You won't get another email from us.</p><p>Change your mind? <a href="/#newsletter">Resubscribe here</a>.</p>`,
    }),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

// One-click unsubscribe per RFC 8058. Gmail/Apple Mail POST here when the
// user hits the inbox-level "Unsubscribe" link rendered from the
// List-Unsubscribe header. Body and query both carry the token; we accept
// either so we work with both clients.
export async function POST(req: Request) {
  const url = new URL(req.url);
  let u = url.searchParams.get("u");
  let s = url.searchParams.get("s");
  if (!u || !s) {
    try {
      const form = await req.formData();
      u = u || (form.get("u") as string | null);
      s = s || (form.get("s") as string | null);
    } catch {
      // Body might be `List-Unsubscribe=One-Click` only — token must then
      // come from the query string, which is the case for our links.
    }
  }
  const result = await unsubscribe(u, s);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json({ ok: true });
}
