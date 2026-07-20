import Hero from "@/src/components/landing/Hero";
import TrustBar from "@/src/components/landing/TrustBar";
import Problem from "@/src/components/landing/Problem";
import DayInTheLife from "@/src/components/landing/DayInTheLife";
import FeaturesBento from "@/src/components/landing/FeaturesBento";
import AIStudio from "@/src/components/landing/AIStudio";
import Automation from "@/src/components/landing/Automation";
import HowItWorks from "@/src/components/landing/HowItWorks";
import Testimonials from "@/src/components/landing/Testimonials";
import PricingSection from "@/src/components/landing/PricingSection";
import FAQ from "@/src/components/landing/FAQ";
import WideImageBand from "@/src/components/landing/WideImageBand";
import FinalCTA from "@/src/components/landing/FinalCTA";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />
      <DayInTheLife />
      <FeaturesBento />
      <AIStudio />
      <Automation />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <WideImageBand />
      <FinalCTA />
      <ScrollToTopButton />
    </>
  );
}
