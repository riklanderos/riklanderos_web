import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ClientsStrip } from "@/components/home/ClientsStrip";
import { Problem } from "@/components/home/Problem";
import { AISection } from "@/components/home/AISection";
import { OrderSection } from "@/components/home/OrderSection";
import { About } from "@/components/home/About";
import { MethodSection } from "@/components/home/MethodSection";
import { StackSection } from "@/components/home/StackSection";
import { Services } from "@/components/home/Services";
import { Results } from "@/components/home/Results";
import { QuizSection } from "@/components/home/QuizSection";
import { IngeniakSection } from "@/components/home/IngeniakSection";
import { Manifesto } from "@/components/home/Manifesto";
import { FAQ } from "@/components/home/FAQ";
import { CTASection } from "@/components/CTASection";
import { SessionChooser } from "@/components/SessionChooser";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ClientsStrip />
      <Problem />
      <AISection />
      <OrderSection />
      <About />
      <MethodSection />
      <StackSection />
      <Services />
      <SessionChooser section="home" id="sesiones" />
      <Results />
      <QuizSection />
      <IngeniakSection />
      <Manifesto />
      <FAQ />
      <CTASection section="home_final" />
    </>
  );
}
