import { createHmac, timingSafeEqual } from "crypto";

// Token format: u=<base64url(email)>&s=<hex(hmac-sha256(email, secret))>
// The secret is the RESEND_API_KEY — anyone holding the key can already
// unsubscribe contacts directly via the Resend API, so reusing it here adds
// no new attack surface and saves an env var.

function b64url(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(input: string): string {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/") + pad,
    "base64",
  ).toString("utf8");
}

export function signEmail(email: string, secret: string): string {
  return createHmac("sha256", secret).update(email).digest("hex");
}

export function verifyEmail(
  email: string,
  signature: string,
  secret: string,
): boolean {
  const expected = signEmail(email, secret);
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(
  email: string,
  baseUrl: string,
  secret: string,
): string {
  const u = b64url(email);
  const s = signEmail(email, secret);
  return `${baseUrl.replace(/\/$/, "")}/api/unsubscribe?u=${u}&s=${s}`;
}

export function decodeEmail(u: string): string | null {
  try {
    const decoded = fromB64url(u);
    if (!decoded.includes("@")) return null;
    return decoded;
  } catch {
    return null;
  }
}
