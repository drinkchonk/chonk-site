/**
 * @jest-environment node
 *
 * /api/launch-vote — backward-compat + new modal shape.
 *
 * The route accepts TWO body shapes:
 *  1. Legacy /find-us LaunchVoteForm shape: firstName / phone / email /
 *     gym / suburb / finishTime / flavour / firstDropInterest / consent.
 *  2. New Leaflet modal shape: name (alias for firstName) / email /
 *     phone (optional) / suburb / gym / flavour / firstDrop boolean
 *     (alias for firstDropInterest) / consent.
 *
 * Both must be accepted. Both must produce a tracker submission.
 */
import { POST } from "@/app/api/launch-vote/route";
import { FLAVOUR_OPTIONS } from "@/lib/launchVoteOptions";

const validFlavour = FLAVOUR_OPTIONS[0];

const submitMock = jest.fn();

jest.mock("@/lib/launchVoteTracker", () => {
  return {
    submitLaunchVoteToTracker: (...args: unknown[]) => submitMock(...args),
  };
});

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/launch-vote", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const legacyBody = {
  firstName: "Sam",
  phone: "0400 000 000",
  email: "sam@example.com",
  gym: "Revo Scarborough",
  suburb: "Scarborough",
  finishTime: "6:00pm",
  flavour: validFlavour,
  firstDropInterest: "Yes",
  consent: true,
};

const modalBody = {
  name: "Sam",
  email: "sam@example.com",
  phone: "0400 000 000",
  suburb: "Scarborough",
  gym: "Revo Scarborough",
  flavour: validFlavour,
  firstDrop: true,
  consent: true,
};

describe("POST /api/launch-vote", () => {
  beforeEach(() => {
    submitMock.mockReset();
    submitMock.mockResolvedValue(undefined);
    // RESEND_API_KEY left unset so the route skips the email step.
    delete process.env.RESEND_API_KEY;
  });

  describe("legacy /find-us shape (backward compat)", () => {
    it("returns 200 on a valid legacy payload", async () => {
      const res = await POST(makeRequest(legacyBody));
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ ok: true });
    });

    it("forwards firstName + finishTime to the tracker for the legacy shape", async () => {
      await POST(makeRequest(legacyBody));
      expect(submitMock).toHaveBeenCalledTimes(1);
      const tracked = submitMock.mock.calls[0][0];
      expect(tracked.firstName).toBe("Sam");
      expect(tracked.finishTime).toBe("6:00pm");
      expect(tracked.firstDropInterest).toBe("Yes");
    });

    it("400s on missing legacy required field", async () => {
      const res = await POST(
        makeRequest({ ...legacyBody, firstName: "" }),
      );
      expect(res.status).toBe(400);
      expect(submitMock).not.toHaveBeenCalled();
    });
  });

  describe("new Leaflet modal shape", () => {
    it("returns 200 on a valid modal payload", async () => {
      const res = await POST(makeRequest(modalBody));
      expect(res.status).toBe(200);
    });

    it("aliases `name` to firstName when forwarding to the tracker", async () => {
      await POST(makeRequest(modalBody));
      expect(submitMock).toHaveBeenCalledTimes(1);
      expect(submitMock.mock.calls[0][0].firstName).toBe("Sam");
    });

    it("maps firstDrop: true to firstDropInterest: 'Yes'", async () => {
      await POST(makeRequest({ ...modalBody, firstDrop: true }));
      expect(submitMock.mock.calls[0][0].firstDropInterest).toBe("Yes");
    });

    it("maps firstDrop: false to firstDropInterest: 'No'", async () => {
      await POST(makeRequest({ ...modalBody, firstDrop: false }));
      expect(submitMock.mock.calls[0][0].firstDropInterest).toBe("No");
    });

    it("accepts an empty phone (phone optional in the modal)", async () => {
      const res = await POST(makeRequest({ ...modalBody, phone: "" }));
      expect(res.status).toBe(200);
      expect(submitMock.mock.calls[0][0].phone).toBe("");
    });

    it("accepts an absent phone field (modal doesn't always send it)", async () => {
      const { phone: _p, ...withoutPhone } = modalBody;
      void _p;
      const res = await POST(makeRequest(withoutPhone));
      expect(res.status).toBe(200);
    });

    it("does NOT require finishTime (modal doesn't have that field)", async () => {
      // The modal payload omits finishTime; the route must default it to "".
      const res = await POST(makeRequest(modalBody));
      expect(res.status).toBe(200);
      expect(submitMock.mock.calls[0][0].finishTime).toBe("");
    });

    it("still requires consent: true", async () => {
      const res = await POST(makeRequest({ ...modalBody, consent: false }));
      expect(res.status).toBe(400);
      expect(submitMock).not.toHaveBeenCalled();
    });

    it("still requires email + suburb + gym + name (the four irreducible fields)", async () => {
      const required = ["name", "email", "suburb", "gym"] as const;
      for (const field of required) {
        submitMock.mockReset();
        const res = await POST(
          makeRequest({ ...modalBody, [field]: "" }),
        );
        expect(res.status).toBe(400);
        expect(submitMock).not.toHaveBeenCalled();
      }
    });

    it("rejects a malformed email (regex unchanged)", async () => {
      const res = await POST(
        makeRequest({ ...modalBody, email: "not-an-email" }),
      );
      expect(res.status).toBe(400);
    });

    it("rejects a flavour that isn't in FLAVOUR_OPTIONS", async () => {
      const res = await POST(
        makeRequest({ ...modalBody, flavour: "Chocolate Peanut Butter" }),
      );
      expect(res.status).toBe(400);
    });
  });

  describe("honeypot still works", () => {
    it("silently 200s without calling the tracker when hp is set", async () => {
      const res = await POST(makeRequest({ ...modalBody, hp: "spam-bot" }));
      expect(res.status).toBe(200);
      expect(submitMock).not.toHaveBeenCalled();
    });
  });
});
