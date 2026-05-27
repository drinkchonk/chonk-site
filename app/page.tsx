import type { Metadata } from "next";
import DropRaceLeaflet from "@/components/sections/DropRaceLeaflet";

export const metadata: Metadata = {
  title: "Chonk — Where should we drop first?",
  description:
    "Vote for your gym or suburb. Most votes wins the first Chonk drop.",
};

export default function HomePage() {
  return <DropRaceLeaflet />;
}
