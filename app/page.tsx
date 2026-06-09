import { Hero } from "@/components/marketing/Hero";
import { StatsBar } from "@/components/marketing/StatsBar";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { Products } from "@/components/marketing/Products";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CaptureSection } from "@/components/marketing/CaptureSection";
import { InboxSection } from "@/components/marketing/InboxSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CtaBand } from "@/components/marketing/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <TrustedBy />
      <Products />
      <HowItWorks />
      <CaptureSection />
      <InboxSection />
      <Testimonials />
      <CtaBand />
    </>
  );
}
