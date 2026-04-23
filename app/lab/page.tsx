import type { Metadata } from "next";
import { HeroLab } from "@/components/sections/HeroLab";
import ProofBar from "@/components/sections/ProofBar";
import FlavourGrid from "@/components/sections/FlavourGrid";
import IngredientScience from "@/components/sections/IngredientScience";
import ComparisonSection from "@/components/sections/ComparisonSection";
import FounderStory from "@/components/sections/FounderStory";
import FindUsTeaser from "@/components/sections/FindUsTeaser";
import CTABlock from "@/components/sections/CTABlock";

export const metadata: Metadata = {
  title: "Chonk Shakes — Lab",
  description: "Experimental cinematic hero prototype. Not a live product page.",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <>
      <HeroLab />
      {/* Rest of the home page — everything except the spinning-shake
          <Hero />. */}
      <FlavourGrid />
      <ProofBar />
      <ComparisonSection />
      <IngredientScience />
      <FounderStory />
      <FindUsTeaser />
      <CTABlock />
    </>
  );
}
