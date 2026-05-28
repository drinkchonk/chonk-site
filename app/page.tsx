import type { Metadata } from "next";
import DropRaceLeaflet from "@/components/sections/DropRaceLeaflet";
import HeroLab from "@/components/sections/HeroLab";
import FlavourGrid from "@/components/sections/FlavourGrid";
import ComparisonSection from "@/components/sections/ComparisonSection";
import ProofBar from "@/components/sections/ProofBar";

export const metadata: Metadata = {
  title: "Chonk — Where should we drop first?",
  description:
    "Vote for your gym or suburb. Most votes wins the first Chonk drop.",
};

export default function HomePage() {
  return (
    <>
      <DropRaceLeaflet />
      <HeroLab />
      <FlavourGrid />
      <ComparisonSection />
      <ProofBar />
    </>
  );
}
