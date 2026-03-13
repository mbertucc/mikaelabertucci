import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroIntro from "@/components/HeroIntro";
import CoverlineStrip from "@/components/CoverlineStrip";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import DarkFactorySection from "@/components/DarkFactorySection";
import SkillsMatrix from "@/components/SkillsMatrix";
import BeyondWorkSection from "@/components/BeyondWorkSection";
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
        {/* Hero — mustard bg */}
        <HeroIntro />

        {/* Coverline divider — directly below hero */}
        <CoverlineStrip label="AI-Augmented Impact" />

        {/* About / Stats */}
        <AboutSection />

        {/* Mustard quote banner */}
        <section className="bg-accent-warm py-20 px-8 md:px-16 relative overflow-hidden">
          {/* Diagonal stripe texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 24px, hsl(0 0% 0% / 0.04) 24px, hsl(0 0% 0% / 0.04) 25px)',
          }} />
          {/* Ghost watermark */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 font-display text-[200px] md:text-[280px] font-black text-[hsl(0_0%_0%/0.06)] dark:text-[hsl(0_0%_100%/0.06)] leading-[1] tracking-[-10px] pointer-events-none select-none">
            25
          </div>
          {/* Vol. label */}
          <div className="absolute right-8 top-8 font-body text-[9px] font-bold tracking-[3px] uppercase text-[hsl(0_0%_0%/0.3)] dark:text-[hsl(0_0%_100%/0.3)]">
            Vol.
          </div>
          <div className="max-w-[1200px] mx-auto relative z-[1]">
            <h2 className="font-display text-[32px] md:text-[46px] font-black text-[hsl(var(--ink))] dark:text-[hsl(var(--nav-text))] leading-[1.15] mb-3">
              AI handles the volume.{" "}
              <em className="font-normal italic text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal-lt))]">
                I handle the accountability.
              </em>
            </h2>
            <p className="font-body text-[11px] font-medium tracking-[2px] uppercase text-[hsl(var(--ink)/0.5)] dark:text-[hsl(var(--nav-text)/0.5)] flex items-center gap-2">
              <span className="inline-block w-5 h-px bg-[hsl(var(--ink)/0.3)]" />
              Mikaela Bertucci · Agentic Product Owner
            </p>
          </div>
        </section>

        {/* The Method coverline */}
        <CoverlineStrip label="The Method" />

        {/* Workflow section — parchment bg */}
        <DarkFactorySection />

        {/* Experience coverline */}
        <CoverlineStrip label="Experience & Impact" />

        {/* Experience — parchment bg */}
        <ExperienceSection />

        {/* Skills */}
        <SkillsMatrix />

        {/* Beyond Work */}
        <BeyondWorkSection />

        {/* CTA + Fit Assessment — full teal bg */}
        <section className="bg-[hsl(var(--teal))] dark:bg-[hsl(var(--teal-dk))] relative overflow-hidden">
          {/* Diagonal stripe texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 24px, hsl(var(--nav-text) / 0.03) 24px, hsl(var(--nav-text) / 0.03) 25px)',
          }} />

          {/* Mustard right bar */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-[hsl(var(--mustard))]" />

          {/* Giant ghosted letter */}
          <div className="absolute right-16 top-[160px] font-display text-[300px] md:text-[380px] font-black text-[hsl(var(--nav-text)/0.04)] dark:text-[hsl(var(--nav-text)/0.02)] leading-[1] tracking-[-15px] pointer-events-none select-none">
            MB
          </div>

          {/* Dark mode: ambient glows */}
          <div className="hidden dark:block absolute -left-[100px] -bottom-[100px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{
            background: 'radial-gradient(circle, hsl(var(--teal) / 0.15) 0%, transparent 70%)',
          }} />

          {/* CTA Header */}
          <div className="py-20 px-8 md:px-16 border-b border-[hsl(var(--nav-text)/0.1)]">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_auto] gap-16 items-center relative z-10">
              <div>
                <p className="font-body text-[10px] font-bold tracking-[4px] uppercase text-[hsl(var(--nav-text)/0.55)] dark:text-[hsl(var(--nav-text)/0.4)] mb-5 flex items-center gap-2.5">
                  <span className="inline-block w-5 h-px bg-[hsl(var(--mustard))] opacity-50" />
                  Ready to Work Together?
                </p>
                <h2 className="font-display text-[54px] md:text-[72px] font-black uppercase text-[hsl(var(--nav-text))] leading-[0.88] tracking-[-2px] mb-6">
                  See If
                  <em className="block italic font-normal text-[44px] md:text-[58px] normal-case tracking-[-1px] text-[hsl(var(--mustard-lt))] dark:text-[hsl(var(--mustard))]" style={{
                    textShadow: 'var(--cta-em-shadow, none)',
                  }}>
                    I'm The Right Fit.
                  </em>
                </h2>
                <p className="font-body text-[14px] font-light text-[hsl(var(--nav-text)/0.6)] dark:text-[hsl(var(--nav-text)/0.45)] leading-[1.85] max-w-[440px]">
                  Paste a job description. Get an honest assessment — including when I'm not.
                </p>
              </div>

              <div>
                <button
                  onClick={() => document.getElementById("fit-check")?.scrollIntoView({ behavior: "smooth" })}
                  className="relative overflow-hidden bg-[hsl(var(--nav-text))] dark:bg-[hsl(var(--nav-text)/0.9)] text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal))] px-14 py-6 font-body text-[11px] font-bold tracking-[3px] uppercase whitespace-nowrap transition-all duration-300 hover:tracking-[4px] hover:-translate-y-0.5 group"
                >
                  <span className="relative z-10">✦ Analyze Fit</span>
                  <span className="absolute inset-0 bg-[hsl(var(--mustard))] transform scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 z-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Fit Assessment inside the teal section */}
          <JDAnalyzer />
        </section>
      </main>
      <Footer />
      <ChatDrawer isOpen={chatOpen} onClose={() => { setChatOpen(false); setChatInitialMessage(undefined); }} initialMessage={chatInitialMessage} />
    </div>
  );
};

export default Index;
