/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("<Header />", () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  async function renderHeader() {
    const { default: Header } = await import("@/components/layout/Header");
    return render(<Header />);
  }

  it("mounts without React 'duplicate key' / 'two children with the same key' warning", async () => {
    await renderHeader();

    const allCalls = [...errorSpy.mock.calls, ...warnSpy.mock.calls].flat();

    const offending = allCalls.filter((c) => {
      const s = typeof c === "string" ? c : String(c);
      return (
        /two children with the same key/i.test(s) ||
        /encountered two children/i.test(s) ||
        /duplicate key/i.test(s)
      );
    });

    expect(offending).toEqual([]);
  });

  it("renders the 'Home' link to /", async () => {
    await renderHeader();
    const homeLinks = screen.getAllByRole("link", { name: /^Home$/i });
    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((l) => expect(l.getAttribute("href")).toBe("/"));
  });
});
