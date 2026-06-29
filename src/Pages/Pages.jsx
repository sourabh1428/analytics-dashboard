import { Automation } from "@/components/sections/Automation"
import { CTA } from "@/components/sections/Cta"
import { Features } from "@/components/sections/Features"
import { Hero } from "@/components/sections/Hero"
import { Partners } from "@/components/sections/Partners"
import { PredictiveInsights } from "@/components/sections/Predictive"
import { Pricing } from "@/components/sections/Pricing"
import { Steps } from "@/components/sections/Steps"

export default function Page() {
  return (
    <main className="min-h-screen bg-[#09090B]">
      <Hero />
      <Partners />
      <Features />
      <PredictiveInsights />
      <Automation />
      <Steps />
      <Pricing />
      <CTA />
    </main>
  )
}

