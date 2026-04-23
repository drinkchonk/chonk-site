import type { Metadata } from "next";
import MenuClient from "./MenuClient";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Four chonks, one standard. Up to 50g of whey-forward protein per serve. Real fruit, no added sugar, zero fillers.",
};

export default function MenuPage() {
  return <MenuClient />;
}
