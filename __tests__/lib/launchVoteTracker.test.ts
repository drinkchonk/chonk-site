import {
  buildLaunchVoteTrackerBody,
  submitLaunchVoteToTracker,
  type LaunchVoteTrackerPayload,
} from "@/lib/launchVoteTracker";

const payload: LaunchVoteTrackerPayload = {
  firstName: "Sam",
  phone: "0400 000 000",
  email: "sam@example.com",
  gym: "Revo Scarborough",
  suburb: "Scarborough",
  finishTime: "6:00pm",
  flavour: "Choc Chonk - original chocolate hit (50g protein, 470 cal)",
  firstDropInterest: "Yes",
  consent: true,
};

describe("launch vote tracker", () => {
  it("maps website votes to the linked Google Form entries", () => {
    const body = buildLaunchVoteTrackerBody(payload);

    expect(body.get("entry.127176558")).toBe("Sam");
    expect(body.get("entry.1258489291")).toBe("0400 000 000");
    expect(body.get("entry.742701446")).toBe("sam@example.com");
    expect(body.get("entry.1230472754")).toBe("Revo Scarborough");
    expect(body.get("entry.537196160")).toBe("Scarborough");
    expect(body.get("entry.1812202236")).toBe("6:00pm");
    expect(body.get("entry.424483543")).toBe(
      "Choc Chonk - original chocolate hit (50g protein, 470 cal)",
    );
    expect(body.get("entry.2026426370")).toBe("Yes");
    expect(body.get("entry.1025801648")).toBe(
      "I agree to receive SMS/email launch updates from Chonk.",
    );
  });

  it("posts to Google Forms with form-url-encoded data", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ status: 302 } as Response);

    await submitLaunchVoteToTracker(payload, fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/formResponse"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("entry.127176558=Sam"),
        redirect: "manual",
      }),
    );
  });

  it("throws when Google Forms rejects the submit", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ status: 500 } as Response);

    await expect(submitLaunchVoteToTracker(payload, fetchMock)).rejects.toThrow(
      "Google Forms submit failed with status 500",
    );
  });
});
