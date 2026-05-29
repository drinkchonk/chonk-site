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

// Home is now a click-cinematic flow: DropRaceLeaflet owns the map +
// pin-click → fullscreen cinematic overlay (rendered fixed) → vote modal,
// then dissolves to scroll into FlavourGrid. HeroLab moved off the home
// stack (still lives at /lab as a sketchpad route). The cinematic is the
// hero now.
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
