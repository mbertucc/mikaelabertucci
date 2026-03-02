import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroIntro from "@/components/HeroIntro";
import AboutSection from "@/components/AboutSection";

import ExperienceSection from "@/components/ExperienceSection";
import DarkFactorySection from "@/components/DarkFactorySection";
import SkillsMatrix from "@/components/SkillsMatrix";
import JDAnalyzer from "@/components/JDAnalyzer";
import ChatDrawer from "@/components/ChatDrawer";
import Footer from "@/components/Footer";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>();

  const handleOpenChat = useCallback((initialMessage?: string) => {
    setChatInitialMessage(initialMessage);
    setChatOpen(true);
  }, []);

  useEffect(() => {
    const onOpenChat = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      handleOpenChat(detail);
    };
    window.addEventListener("open-chat", onOpenChat);
    return () => window.removeEventListener("open-chat", onOpenChat);
  }, [handleOpenChat]);

  return (
    <div className="bg-background min-h-screen">
      <Navbar onOpenChat={() => handleOpenChat()} />
      <main>
        <HeroIntro />
        <AboutSection />
        
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
