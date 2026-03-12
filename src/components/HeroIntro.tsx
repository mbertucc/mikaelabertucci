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
    <section id="hero" className="pt-24 pb-2 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm font-body"
        >
          <span className="w-2 h-2 rounded-full bg-accent-warm animate-pulse-glow" />
          <span className="text-muted-foreground">
            {profile?.status_badge || "🟢 Open to \"Dark Factory\" environments where Spec is the Product"}
          </span>
        </motion.div>

        {/* Name — staggered word reveal */}
        <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.95] tracking-tight text-foreground">
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

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-2xl md:text-3xl font-display italic text-accent-warm"
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
