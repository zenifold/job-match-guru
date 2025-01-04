import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainPointsSection } from "@/components/landing/PainPointsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

const Index = () => {
  return (
    <MainLayout hideNav>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <HeroSection />
        <PainPointsSection />
        <PricingSection />
        <UseCasesSection />
        <FinalCTA />
      </div>
    </MainLayout>
  );
};

export default Index;