import Hero from "@/src/components/landing/Hero";
import TrustBar from "@/src/components/landing/TrustBar";
import Problem from "@/src/components/landing/Problem";
import FeaturesBento from "@/src/components/landing/FeaturesBento";
import HowItWorks from "@/src/components/landing/HowItWorks";
import Testimonials from "@/src/components/landing/Testimonials";
import PricingSection from "@/src/components/landing/PricingSection";
import FAQ from "@/src/components/landing/FAQ";
import FinalCTA from "@/src/components/landing/FinalCTA";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />
      <FeaturesBento />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <FinalCTA />
      <ScrollToTopButton />
    </>
  );
}
