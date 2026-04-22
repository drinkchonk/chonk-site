import { render, screen } from "@testing-library/react";
import Cite from "@/components/ui/Cite";

describe("<Cite />", () => {
  it("renders a link per ref pointing at /references#ref-N", () => {
    render(<Cite refs={[1, 4]} />);
    const link1 = screen.getByRole("link", { name: /reference 1/i });
    const link4 = screen.getByRole("link", { name: /reference 4/i });
    expect(link1).toHaveAttribute("href", "/references#ref-1");
    expect(link4).toHaveAttribute("href", "/references#ref-4");
  });

  it("inserts a comma between adjacent citations only", () => {
    const { container } = render(<Cite refs={[2, 3, 5]} />);
    const text = container.textContent ?? "";
    expect((text.match(/,/g) ?? []).length).toBe(2);
  });

  it("renders the ids in source order", () => {
    render(<Cite refs={[7, 1, 9]} />);
    const links = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(links).toEqual([
      "/references#ref-7",
      "/references#ref-1",
      "/references#ref-9",
    ]);
  });

  it("wraps everything in a <sup class='cite'> element", () => {
    const { container } = render(<Cite refs={[1]} />);
    const sup = container.querySelector("sup");
    expect(sup).not.toBeNull();
    expect(sup).toHaveClass("cite");
  });
});
