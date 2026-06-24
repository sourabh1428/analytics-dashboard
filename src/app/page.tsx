import EasibillHero from "@/src/components/easibill/EasibillHero";
import EasibillProblem from "@/src/components/easibill/EasibillProblem";
import EasibillSolution from "@/src/components/easibill/EasibillSolution";
import EasibillFeatures from "@/src/components/easibill/EasibillFeatures";
import EasibillPricing from "@/src/components/easibill/EasibillPricing";
import EasibillTestimonials from "@/src/components/easibill/EasibillTestimonials";
import EasibillCTA from "@/src/components/easibill/EasibillCTA";
import ScrollToTopButton from "@/src/components/ScrollToTopButton";

export default function HomePage() {
  return (
    <>
      <div id="product">
        <EasibillHero />
      </div>

      <div className="space-y-16 pb-20 md:space-y-24 md:pb-28">
        <div id="problem" className="scroll-mt-28">
          <EasibillProblem />
        </div>

        <div id="solution" className="scroll-mt-28">
          <EasibillSolution />
        </div>

        <div id="features" className="scroll-mt-28">
          <EasibillFeatures />
        </div>

        <div id="pricing" className="scroll-mt-28">
          <EasibillPricing />
        </div>

        <div id="customers" className="scroll-mt-28">
          <EasibillTestimonials />
        </div>

        <div id="contact" className="scroll-mt-28">
          <EasibillCTA />
        </div>
      </div>

      <ScrollToTopButton />
    </>
  );
}
