import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PURCHASE_OPTIONS = [
  "After training",
  "Before training",
  "Lunch",
  "Afternoon snack",
  "Weekend treat",
  "At markets/events",
];

const FLAVOUR_OPTIONS = [
  "Peanut Butter Chonk",
  "Strawberry Cheesecake",
  "Choc Banana",
  "Vanilla Biscoff-style",
  "Mango Cream",
  "Coffee Protein",
  "Other",
];

const PRICE_OPTIONS = ["$10-$11", "$12-$13", "$14-$15", "$16+"];
const EARLY_ACCESS_OPTIONS = ["Yes, text me", "Maybe, email me", "No, just voting"];

function cleanString(value: unknown, maxLength = 200) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, maxLength)
    : "";
}

function cleanParagraph(value: unknown, maxLength = 1200) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function parseRecipients(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function validateOption(value: string, options: string[], label: string) {
  if (!value || !options.includes(value)) {
    return `${label} is required.`;
  }
  return null;
}

function tableRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #eadfcd;color:#6f6259;font-weight:700;width:210px;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eadfcd;color:#0E0C0D;">${escapeHtml(value || "Not provided")}</td>
    </tr>
  `;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const hp = cleanString(raw.hp, 120);
  if (hp) return NextResponse.json({ ok: true });

  const firstName = cleanString(raw.firstName, 80);
  const phone = cleanString(raw.phone, 60);
  const email = cleanString(raw.email, 254).toLowerCase();
  const gym = cleanString(raw.gym, 160);
  const suburb = cleanString(raw.suburb, 120);
  const purchaseMoment = cleanString(raw.purchaseMoment, 80);
  const flavour = cleanString(raw.flavour, 80);
  const fairPrice = cleanString(raw.fairPrice, 40);
  const earlyAccess = cleanString(raw.earlyAccess, 80);
  const notes = cleanParagraph(raw.notes);
  const consent = raw.consent === true;

  const requiredFields = [
    ["First name", firstName],
    ["Phone number", phone],
    ["Gym", gym],
    ["Suburb", suburb],
  ];
  const missing = requiredFields.find(([, value]) => !value);
  if (missing) {
    return NextResponse.json(
      { error: `${missing[0]} is required.` },
      { status: 400 },
    );
  }

  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const choiceError =
    validateOption(purchaseMoment, PURCHASE_OPTIONS, "Purchase timing") ??
    validateOption(flavour, FLAVOUR_OPTIONS, "Flavour") ??
    validateOption(fairPrice, PRICE_OPTIONS, "Price") ??
    validateOption(earlyAccess, EARLY_ACCESS_OPTIONS, "Early access");

  if (choiceError) {
    return NextResponse.json({ error: choiceError }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json(
      { error: "Marketing consent is required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) {
    console.error("launch-vote: RESEND_API_KEY or RESEND_FROM missing");
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 500 },
    );
  }

  const recipients = parseRecipients(process.env.LAUNCH_VOTE_TO);
  const fallbackRecipient =
    process.env.RESEND_REPLY_TO?.trim() || "hello@chonkshakes.com.au";
  const to = recipients.length > 0 ? recipients : [fallbackRecipient];
  const replyTo = email || fallbackRecipient;

  const submittedAt = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const fields = [
    ["First name", firstName],
    ["Phone", phone],
    ["Email", email],
    ["Gym", gym],
    ["Launch suburb", suburb],
    ["Likely purchase moment", purchaseMoment],
    ["First flavour vote", flavour],
    ["Fair price", fairPrice],
    ["Early access", earlyAccess],
    ["Consent", consent ? "Agreed" : "Not agreed"],
    ["Submitted", `${submittedAt} AWST`],
    ["Notes", notes],
  ];

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#FEF6EC;padding:24px;color:#0E0C0D;">
      <div style="max-width:680px;margin:0 auto;background:#F5EDD8;border:1px solid #eadfcd;border-radius:18px;overflow:hidden;">
        <div style="padding:24px 26px;background:#F2B8CC;">
          <h1 style="font-size:28px;line-height:1.05;margin:0;">New Chonk launch vote</h1>
          <p style="margin:8px 0 0;color:rgba(14,12,13,0.72);">Where should Chonk launch first?</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tbody>
            ${fields.map(([label, value]) => tableRow(label, value)).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const text = fields
    .map(([label, value]) => `${label}: ${value || "Not provided"}`)
    .join("\n");

  const resend = new Resend(apiKey);
  const sent = await resend.emails.send({
    from,
    to,
    replyTo,
    subject: `Chonk launch vote: ${suburb} / ${flavour}`,
    html,
    text,
    tags: [{ name: "type", value: "launch_vote" }],
  });

  if (sent.error) {
    console.error(
      "launch-vote: email send failed",
      sent.error.name,
      sent.error.message,
    );
    return NextResponse.json(
      { error: "Could not submit your vote right now. Try again shortly." },
      { status: 500 },
    );
  }

  console.log(
    "launch-vote: submitted",
    JSON.stringify({
      suburb,
      flavour,
      fairPrice,
      earlyAccess,
      messageId: sent.data?.id ?? null,
    }),
  );

  return NextResponse.json({ ok: true });
}
