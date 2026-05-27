/**
 * @jest-environment jsdom
 *
 * AC-4 / OQ-3 — wholesale form gets its own /wholesale route after
 * /find-us is deleted.
 */
import { render, screen } from "@testing-library/react";

describe("app/wholesale/page.tsx — OQ-3 relocation", () => {
  it("renders the WholesaleForm", async () => {
    const { default: WholesalePage } = await import("@/app/wholesale/page");
    render(<WholesalePage />);
    // The form has a 'Send enquiry' submit button in the recovered source.
    expect(
      screen.getByRole("button", { name: /Send enquiry/i }),
    ).toBeInTheDocument();
  });

  it("renders the wholesale page H1 / heading copy", async () => {
    const { default: WholesalePage } = await import("@/app/wholesale/page");
    render(<WholesalePage />);
    // Page must announce its purpose so the route isn't a bare form.
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
