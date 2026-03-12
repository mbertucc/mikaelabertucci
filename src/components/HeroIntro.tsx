import { useProfile } from "@/hooks/usePortfolioData";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const taglines = [
  "I build environments where people want to show up.",
  "Spec is my product. Clarity is how I deliver it.",
  "19.4 hours saved per week — and counting.",
  "AI-augmented product ownership with human judgment at the center.",
  "3 concurrent registry portfolios. One PO. AI-augmented workflows.",
];

const HeroIntro = () => {
  const { data: profile } = useProfile();
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const name = profile?.full_name || "Mikaela Bertucci";
  const words = name.split(" ");

  return (
    <section id="hero" className="pt-24 pb-2 px-6 relative overflow-hidden">
      {/* Boomerang decorative shapes */}
      <div className="absolute top-16 right-[10%] w-32 h-32 pointer-events-none opacity-[0.06]" style={{
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        background: `hsl(var(--teal))`,
        transform: 'rotate(-25deg)',
      }} />
      <div className="absolute bottom-8 left-[5%] w-20 h-20 pointer-events-none opacity-[0.05]" style={{
        borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%',
        background: `hsl(var(--mustard))`,
        transform: 'rotate(15deg)',
      }} />
      <div className="absolute top-32 left-[15%] w-3 h-3 rounded-full pointer-events-none opacity-[0.12]" style={{
        background: `hsl(var(--olive))`,
      }} />

      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm font-body"
        >
          <span className="w-2 h-2 rounded-full bg-[hsl(var(--mustard))] animate-pulse-glow" />
          <span className="text-muted-foreground">
            {profile?.status_badge || "🟢 Open to \"Dark Factory\" environments where Spec is the Product"}
          </span>
        </motion.div>

        {/* Name — staggered word reveal with serif display */}
        <h1 className="text-7xl md:text-9xl font-display font-normal leading-[0.95] text-foreground">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Title — mustard accent */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-2xl md:text-3xl font-display italic text-[hsl(var(--mustard))]"
        >
          {profile?.title || "Agentic Product Owner | Context Engineer"}
        </motion.p>

        {/* Rotating tagline */}
        <div className="h-8 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-sm md:text-base font-body text-muted-foreground tracking-wide"
            >
              {taglines[taglineIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HeroIntro;