import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MetodologiaSection from "@/components/landing/MetodologiaSection";
import SobreSection from "@/components/landing/SobreSection";
import ContatoSection from "@/components/landing/ContatoSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <MetodologiaSection />
        <SobreSection />
        <ContatoSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
