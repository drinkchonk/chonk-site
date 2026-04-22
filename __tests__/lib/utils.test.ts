import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges plain class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters out falsy values", () => {
    expect(cn("a", undefined, null, false, "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind utilities (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-ink", "text-cream")).toBe("text-cream");
  });

  it("supports clsx object syntax", () => {
    expect(cn("base", { active: true, inactive: false })).toBe("base active");
  });
});
