import Hero from "@/components/sections/Hero";
import TickerStrip from "@/components/sections/TickerStrip";
import ProofBar from "@/components/sections/ProofBar";
import FlavourGrid from "@/components/sections/FlavourGrid";
import IngredientScience from "@/components/sections/IngredientScience";
import ComparisonSection from "@/components/sections/ComparisonSection";
import FounderStory from "@/components/sections/FounderStory";
import FindUsTeaser from "@/components/sections/FindUsTeaser";
import CTABlock from "@/components/sections/CTABlock";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TickerStrip />
      <ProofBar />
      <FlavourGrid />
      <IngredientScience />
      <ComparisonSection />
      <FounderStory />
      <FindUsTeaser />
      <CTABlock />
    </>
  );
}
