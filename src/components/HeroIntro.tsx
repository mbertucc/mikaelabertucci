import { useProfile } from "@/hooks/usePortfolioData";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSiteMetrics } from "@/hooks/useSiteMetrics";

const taglines = [
  "I build environments where people want to show up.",
  "Spec is my product. Clarity is how I deliver it.",
  "19.4 hours saved per week — and counting.",
  "AI-augmented product ownership with human judgment at the center.",
  "3 concurrent registry portfolios. One PO. AI-augmented workflows.",
];

const HeroIntro = () => {
  const { data: profile } = useProfile();
  const { data: m } = useSiteMetrics();
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const name = profile?.full_name || "Mikaela Bertucci";
  const words = name.split(" ");
  const firstName = words[0] || "Mikaela";
  const lastName = words.slice(1).join(" ") || "Bertucci";

  return (
    <section id="hero" className="relative overflow-hidden" style={{ marginTop: '52px', minHeight: '680px' }}>
      {/* Teal top strip */}
      <div className="absolute top-0 left-0 right-0 h-[5px] z-10" style={{
        background: 'linear-gradient(to right, hsl(var(--teal)), hsl(var(--teal-lt)), hsl(var(--teal)))',
      }}>
        <div className="dark:block hidden absolute inset-0" style={{
          boxShadow: '0 0 20px hsl(var(--teal) / 0.4)',
        }} />
      </div>

      {/* Mustard right bar */}
      <div className="absolute right-0 top-0 bottom-0 w-[6px] md:w-[8px] bg-[hsl(var(--mustard))] z-10">
        <div className="dark:block hidden absolute inset-0" style={{
          boxShadow: '-4px 0 20px hsl(var(--mustard) / 0.2)',
        }} />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      {/* Dark mode: teal ambient glow bottom-left */}
      <div className="hidden dark:block absolute -bottom-[100px] -left-[100px] w-[500px] h-[500px] rounded-full pointer-events-none z-0" style={{
        background: 'radial-gradient(circle, hsl(var(--teal) / 0.07) 0%, transparent 70%)',
        animation: 'glowPulse 8s ease-in-out infinite',
      }} />

      {/* Vertical rule divider (dark mode) */}
      <div className="hidden dark:block md:block absolute left-1/2 top-[8%] bottom-[8%] w-px z-[1]" style={{
        background: 'linear-gradient(to bottom, transparent, hsl(var(--nav-text) / 0.14), transparent)',
      }} />

      {/* Two-column grid */}
      <div className="grid md:grid-cols-2 min-h-[680px]">
        {/* LEFT — massive stacked type */}
        <div className="px-8 md:px-16 py-14 relative z-[2] flex flex-col justify-center">
          {/* Status badge — preserved */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-[9px] font-body font-bold tracking-[3px] uppercase text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal-lt))]"
          >
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--mustard))] animate-pulse-glow" />
            <span className="text-muted-foreground text-[10px] tracking-[1px] font-normal normal-case font-body">
              {profile?.status_badge || "🟢 Open to \"Dark Factory\" environments where Spec is the Product"}
            </span>
          </motion.div>

          {/* Name — massive Bodoni, staggered reveal */}
          <div className="relative">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="block font-display text-[80px] sm:text-[100px] md:text-[130px] font-black leading-[0.85] tracking-[-4px] text-foreground"
            >
              {firstName}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="block font-display text-[60px] sm:text-[80px] md:text-[100px] font-normal italic leading-[0.9] tracking-[-2px] text-[hsl(var(--teal))] dark:text-[hsl(var(--teal-lt))] mt-[-8px]"
              style={{ textShadow: 'var(--teal-glow-shadow, none)' }}
            >
              {lastName}
            </motion.span>
          </div>

          {/* Triple rule set */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-1 my-5"
          >
            <div className="h-[3px] dark:h-[2px] bg-foreground dark:bg-[hsl(var(--nav-text)/0.2)] w-full max-w-[340px]" />
            <div className="h-[3px] dark:h-[2px] bg-[hsl(var(--teal))] w-[60%] max-w-[200px]" style={{
              boxShadow: 'var(--teal-rule-shadow, none)',
            }} />
            <div className="h-[3px] dark:h-[2px] bg-[hsl(var(--mustard))] w-[30%] max-w-[100px]" style={{
              boxShadow: 'var(--mustard-rule-shadow, none)',
            }} />
          </motion.div>

          {/* Coverline sidebar text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            <span className="block font-body text-[9px] font-bold tracking-[3px] uppercase text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal-lt))] leading-[2]">
              Certified Product Owner
            </span>
            <span className="block font-body text-[9px] font-bold tracking-[3px] uppercase text-[hsl(var(--mustard-dk))] dark:text-[hsl(var(--mustard-lt))] leading-[2]">
              Context Engineer
            </span>
            <span className="block font-body text-[9px] font-bold tracking-[3px] uppercase text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal-lt))] leading-[2]">
              Agentic Workflow Architect
            </span>

            {/* Rotating tagline — preserved logic */}
            <div className="h-12 mt-2 max-w-[280px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="font-body text-[10px] font-light tracking-[1px] text-muted-foreground leading-[1.8]"
                >
                  {taglines[taglineIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — teal block pull quote + bottom stat */}
        <div className="px-8 md:px-16 py-14 relative z-[2] flex flex-col justify-end pb-20">
          {/* Dark mode: mustard ambient glow top-right */}
          <div className="hidden dark:block absolute -top-[60px] -right-[60px] w-[360px] h-[360px] rounded-full pointer-events-none" style={{
            background: 'radial-gradient(circle, hsl(var(--mustard) / 0.05) 0%, transparent 70%)',
            animation: 'glowPulse 10s ease-in-out infinite reverse',
          }} />

          {/* Teal block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative bg-[hsl(var(--teal))] dark:bg-[hsl(var(--teal-dk))] dark:border dark:border-[hsl(var(--teal)/0.3)] p-7 md:p-9 mb-8"
            style={{ boxShadow: 'var(--teal-block-shadow, none)' }}
          >
            {/* Mustard corner accent */}
            <div className="absolute -bottom-2 -right-2 w-9 h-9 md:w-10 md:h-10 bg-[hsl(var(--mustard))]" style={{
              boxShadow: 'var(--mustard-corner-shadow, none)',
            }} />

            <p className="font-body text-[8px] font-bold tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.6)] dark:text-[hsl(var(--nav-text)/0.45)] mb-2.5">
              Victoria, BC · Portfolio 2025
            </p>
            <p className="font-display text-[18px] md:text-[20px] italic font-normal text-[hsl(var(--nav-text))] dark:text-[hsl(var(--nav-text))] leading-[1.5]">
              I'm not just a PM or just an Agile coach. I translate — strategy into stories, chaos into structure, user needs into things{" "}
              <strong className="not-italic font-bold dark:text-[hsl(var(--mustard-lt))]">
                engineers can actually build.
              </strong>
            </p>
          </motion.div>

          {/* Bottom quote — big number + pull quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="block font-display text-[100px] md:text-[120px] font-black leading-[1] -mb-5 tracking-[-4px] text-[hsl(var(--mustard-dk))] dark:text-[hsl(var(--mustard))] opacity-[0.35] dark:opacity-[0.25]">
              {m?.dark_factory_clarification_reduction ?? 90}
            </span>
            <p className="font-display text-[15px] md:text-[17px] italic font-normal text-[hsl(var(--charcoal))] dark:text-muted-foreground leading-[1.65] max-w-[340px] border-l-[3px] border-[hsl(var(--mustard))] pl-4">
              percent fewer clarification loops — from {m?.dark_factory_pages ?? 200}+ pages of legislation to a ready-to-ship spec.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroIntro;
