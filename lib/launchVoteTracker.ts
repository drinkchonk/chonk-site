const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScUzNHnnRTWMk5ZEqeGfbT-aBmqp7MGV2nglh4d8k28K0P4Lg/formResponse";

const GOOGLE_FORM_FIELDS = {
  firstName: "entry.127176558",
  phone: "entry.1258489291",
  email: "entry.742701446",
  gym: "entry.1230472754",
  suburb: "entry.537196160",
  finishTime: "entry.1812202236",
  flavour: "entry.424483543",
  firstDropInterest: "entry.2026426370",
  consent: "entry.1025801648",
} as const;

const CONSENT_VALUE = "I agree to receive SMS/email launch updates from Chonk.";

export type LaunchVoteTrackerPayload = {
  firstName: string;
  phone: string;
  email: string;
  gym: string;
  suburb: string;
  finishTime: string;
  flavour: string;
  firstDropInterest: string;
  consent: boolean;
};

export function buildLaunchVoteTrackerBody(
  payload: LaunchVoteTrackerPayload,
) {
  const body = new URLSearchParams();
  body.set(GOOGLE_FORM_FIELDS.firstName, payload.firstName);
  body.set(GOOGLE_FORM_FIELDS.phone, payload.phone);
  body.set(GOOGLE_FORM_FIELDS.email, payload.email);
  body.set(GOOGLE_FORM_FIELDS.gym, payload.gym);
  body.set(GOOGLE_FORM_FIELDS.suburb, payload.suburb);
  body.set(GOOGLE_FORM_FIELDS.finishTime, payload.finishTime);
  body.set(GOOGLE_FORM_FIELDS.flavour, payload.flavour);
  body.set(GOOGLE_FORM_FIELDS.firstDropInterest, payload.firstDropInterest);
  if (payload.consent) {
    body.set(GOOGLE_FORM_FIELDS.consent, CONSENT_VALUE);
  }
  body.set("submit", "Submit");
  return body;
}

export async function submitLaunchVoteToTracker(
  payload: LaunchVoteTrackerPayload,
  fetchImpl: typeof fetch = fetch,
) {
  const res = await fetchImpl(GOOGLE_FORM_ACTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: buildLaunchVoteTrackerBody(payload).toString(),
    redirect: "manual",
  });

  if (res.status >= 200 && res.status < 400) {
    return;
  }

  throw new Error(`Google Forms submit failed with status ${res.status}`);
}
