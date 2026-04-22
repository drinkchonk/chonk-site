import type { Metadata } from "next";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Four shakes, one standard. Up to 60g protein per serve. Whey isolate, real fruit, no added sugar.",
};

export default function MenuPage() {
  return <MenuClient />;
}
