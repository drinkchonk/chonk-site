import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";

describe("<Footer />", () => {
  it("links to all top-level routes", () => {
    render(<Footer />);
    ["Menu", "About", "Find Us", "Science"].forEach((label) => {
      expect(
        screen.getByRole("link", { name: new RegExp(`^${label}$`, "i") })
      ).toBeInTheDocument();
    });
  });

  it("renders Instagram and TikTok with target=_blank and noopener", () => {
    render(<Footer />);
    const ig = screen.getByLabelText("Instagram");
    const tt = screen.getByLabelText("TikTok");
    [ig, tt].forEach((a) => {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.getAttribute("rel")).toMatch(/noopener/);
    });
  });

  it("includes the current year in the copyright string", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
