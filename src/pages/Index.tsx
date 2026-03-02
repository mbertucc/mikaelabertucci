import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ImpactDashboardSection from "@/components/ImpactDashboardSection";
import ExperienceSection from "@/components/ExperienceSection";
import DarkFactorySection from "@/components/DarkFactorySection";
import SkillsMatrix from "@/components/SkillsMatrix";
import JDAnalyzer from "@/components/JDAnalyzer";
import ChatDrawer from "@/components/ChatDrawer";
import Footer from "@/components/Footer";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();

  const handleOpenChat = (initialMessage?: string) => {
    setChatInitialMessage(initialMessage);
    setChatOpen(true);
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar onOpenChat={() => handleOpenChat()} />
      <main>
        <HeroSection onOpenChat={() => handleOpenChat()} />
        <AboutSection />
        <ImpactDashboardSection />
        <ExperienceSection />
        <DarkFactorySection />
        <SkillsMatrix />
        <JDAnalyzer />
      </main>
      <Footer />
      <ChatDrawer isOpen={chatOpen} onClose={() => { setChatOpen(false); setChatInitialMessage(undefined); }} initialMessage={chatInitialMessage} />
    </div>
  );
};

export default Index;