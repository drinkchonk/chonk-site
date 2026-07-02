import type { Metadata } from "next";
import DropRaceLeaflet from "@/components/sections/DropRaceLeaflet";
import FlavourGrid from "@/components/sections/FlavourGrid";
import ComparisonSection from "@/components/sections/ComparisonSection";
import ProofBar from "@/components/sections/ProofBar";

export const metadata: Metadata = {
  title: "Chonk — Where should we drop first?",
  description:
    "Vote for your gym or suburb. Most votes wins the first Chonk drop.",
};

// Home leads with the Drop Race map: DropRaceLeaflet owns the map, and a
// pin click opens the vote modal (fresh voter) or scrolls to FlavourGrid
// (returning voter) — no cinematic. HeroLab moved off the home stack
// (still lives at /lab as a sketchpad route).
export default function HomePage() {
  return (
    <>
      <DropRaceLeaflet />
      <FlavourGrid />
      <ComparisonSection />
      <ProofBar />
    </>
  );
}
