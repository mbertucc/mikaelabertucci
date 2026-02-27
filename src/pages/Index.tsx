import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import DarkFactorySection from "@/components/DarkFactorySection";
import SkillsMatrix from "@/components/SkillsMatrix";
import JDAnalyzer from "@/components/JDAnalyzer";
import ChatDrawer from "@/components/ChatDrawer";
import Footer from "@/components/Footer";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      {/* Prototype banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-primary/90 backdrop-blur-sm text-primary-foreground text-center py-2 px-4 text-sm font-body">
        🚧 This portfolio is a <strong>prototype</strong> and currently a work in progress. Stay tuned!
      </div>
      <Navbar onOpenChat={() => setChatOpen(true)} />
      <main>
        <HeroSection onOpenChat={() => setChatOpen(true)} />
        <ExperienceSection />
        <DarkFactorySection />
        <SkillsMatrix />
        <JDAnalyzer />
      </main>
      <Footer />
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Index;
