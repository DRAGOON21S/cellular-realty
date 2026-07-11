import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import BrandNarrative from "@/components/BrandNarrative";
import Portfolio from "@/components/Portfolio";
import ClientLogos from "@/components/ClientLogos";
import Insights from "@/components/Insights";
import Testimonials from "@/components/Testimonials";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";

export default function BrownAccentsHome() {
  return (
    <div className="theme-brown flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero iconSuffix="-brown" />
        <StatsBar iconSuffix="-brown" />
        <BrandNarrative />
        <Portfolio />
        <ClientLogos />
        <Insights />
        <Testimonials />
        <NewsletterCTA />
      </main>
      <Footer iconSuffix="-brown" />
    </div>
  );
}
