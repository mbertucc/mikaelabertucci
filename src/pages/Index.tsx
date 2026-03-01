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
