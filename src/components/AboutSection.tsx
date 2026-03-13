import { useState } from "react";
import { Zap, Target, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import headshot from "@/assets/headshot.png";
import { useProfile } from "@/hooks/usePortfolioData";
import { useSiteMetrics } from "@/hooks/useSiteMetrics";
import StatRing from "@/components/StatRing";
import ScrollReveal from "@/components/ScrollReveal";

type MetricKey = "velocity" | "precision" | "culture" | null;

const metricLabels: Record<Exclude<MetricKey, null>, string> = {
  velocity: "Velocity",
  precision: "Precision",
  culture: "Culture",
};

const metricAccents: Record<Exclude<MetricKey, null>, { bg: string; text: string; pattern: string }> = {
  velocity: {
    bg: "bg-[hsl(var(--bg-teal))]",
    text: "text-primary",
    pattern: "mcm-pattern-atomic",
  },
  precision: {
    bg: "bg-[hsl(var(--bg-olive))]",
    text: "text-[hsl(var(--olive))]",
    pattern: "mcm-pattern-diamond",
  },
  culture: {
    bg: "bg-[hsl(var(--bg-slate))]",
    text: "text-secondary",
    pattern: "mcm-pattern-dots",
  },
};

const defaultText =
  "Hover over a metric to see the numbers behind how I work.";

const AboutSection = () => {
  const { data: profile } = useProfile();
  const { data: m } = useSiteMetrics();
  const [activeMetric, setActiveMetric] = useState<MetricKey>(null);
  const [headshotClicks, setHeadshotClicks] = useState(0);

  const metricDescriptions: Record<Exclude<MetricKey, null>, string[]> = {
    velocity: [
      "I run a multi-stage PO Agent with a Chain of Thought workflow.",
      "Discovery stage scans 2500+ pages of legislation and business rules. Extracts requirements automatically.",
      "Story Architect maps findings into Gherkin format. Reviewer validates against Definition of Ready.",
      "Stories arrive 90% complete, validated against Definition of Ready before they hit the backlog.",
    ],
    precision: [
      "This comes from context engineering with product-specific agent environments.",
      "Edge-Case Agent identifies 'what-if' scenarios that cause mid-sprint pivots.",
      "Consistency Agent catches contradictions before they reach the backlog.",
      `Result: ${m?.about_precision_accuracy ?? 75}% increase in accuracy. Clarification loops virtually eliminated.`,
    ],
    culture: [
      `${m?.about_precision_requirement ?? 95}% precision means developers code instead of chasing missing details.`,
      `${m?.dark_factory_hours_saved_weekly ?? 20} hrs of automated PO overhead reinvested into unblocking the team.`,
      "Sprint planning is 50% faster because the work arrives ready — not because the process got heavier.",
      "Teams thrive because they ship, not because they're managed.",
    ],
  };

  const displayItems = activeMetric ? metricDescriptions[activeMetric] : null;

  const easterEggActive = headshotClicks >= 3;

  return (
    <section id="about" className="py-28 px-8 md:px-16 bg-card/50 relative overflow-hidden">
      {/* N° watermark */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 font-display text-[340px] font-black text-foreground/[0.025] dark:text-[hsl(var(--nav-text)/0.02)] leading-[1] tracking-[-10px] pointer-events-none select-none">
        N°
      </div>

      <div className="max-w-[1200px] mx-auto relative z-[1]">
        <ScrollReveal>
          {/* Header */}
          <div className="flex items-baseline gap-5 mb-14">
            <p className="font-body text-[10px] font-bold tracking-[4px] uppercase text-primary whitespace-nowrap">
              Measured Results
            </p>
            <h2 className="font-display text-[38px] md:text-[48px] font-normal italic text-foreground tracking-[-0.5px]">
              What This Looks Like in Practice
            </h2>
          </div>
        </ScrollReveal>

        {/* Headshot + Bio row */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 mb-16">
            <div className="shrink-0">
              <motion.div
                className="w-48 h-48 md:w-56 md:h-56 overflow-hidden border-2 border-primary/20 cursor-pointer"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHeadshotClicks((c) => c + 1)}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.img
                  src={headshot}
                  alt={`${profile?.full_name || "Mikaela Bertucci"} — professional headshot`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  animate={easterEggActive ? {
                    rotate: [0, -5, 5, -3, 3, 0],
                  } : {}}
                  transition={easterEggActive ? {
                    duration: 0.6,
                    ease: "easeInOut",
                  } : {}}
                />
              </motion.div>
              {easterEggActive && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[hsl(var(--mustard))] font-body text-center mt-2 italic"
                >
                  ✨ You found me! I like your curiosity.
                </motion.p>
              )}
            </div>
            <div className="space-y-4 text-center md:text-left">
              <p className="text-[14px] text-muted-foreground font-body font-light leading-[1.85] max-w-xl">
                {profile?.positioning ||
                  "I use AI to cut through the documentation overhead, saving 19.4 hours every week. That's not theory — that's what I'm doing today. I don't write production code. I write specs so clear that developers ship without coming back to ask questions."}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Ledger-style stats grid */}
        <div className="py-1" onMouseLeave={() => setActiveMetric(null)}>
          {/* Double-rule top border */}
          <div className="relative">
            <div className="h-[3px] dark:h-[2px] bg-foreground dark:bg-[hsl(var(--nav-text)/0.2)]" />
            <div className="h-px bg-[hsl(var(--teal))] opacity-40 dark:opacity-30 mt-1" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 relative">
            {/* Velocity — Teal */}
            <motion.div
              className={`text-left space-y-4 cursor-default group p-10 transition-colors duration-200 border-r border-border relative ${activeMetric === "velocity" ? "bg-[hsl(var(--teal-pale))] dark:bg-[hsl(var(--teal)/0.15)]" : ""}`}
              onMouseEnter={() => setActiveMetric("velocity")}
              whileHover={{ scale: 1.0 }}
            >
              {/* Mustard underline on hover */}
              <div className={`absolute bottom-0 left-0 h-[3px] dark:h-[2px] bg-[hsl(var(--mustard))] transition-all duration-300 ${activeMetric === "velocity" ? "w-full" : "w-0"}`} style={{
                boxShadow: activeMetric === "velocity" ? '0 0 8px hsl(var(--mustard) / 0.4)' : 'none',
              }} />

              <div className="flex items-center gap-2 mb-2">
                <Zap className={`w-4 h-4 transition-colors duration-200 ${activeMetric === "velocity" ? "text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal-lt))]" : "text-muted-foreground"}`} strokeWidth={2.25} />
                <p className={`font-body text-[10px] font-semibold tracking-[2px] uppercase ${activeMetric === "velocity" ? metricAccents.velocity.text : "text-muted-foreground"}`}>Velocity</p>
              </div>
              <StatRing value={m?.about_velocity_time_to_draft ?? 2} max={m?.about_velocity_time_to_draft_max ?? 5} label="Faster Time-to-Draft" unit="x" size={90} hideRing />
              <StatRing value={m?.about_velocity_planning ?? 50} max={100} label="Faster Planning" unit="%" size={90} hideRing />
            </motion.div>

            {/* Precision — Olive */}
            <motion.div
              className={`text-left space-y-4 cursor-default group p-10 transition-colors duration-200 border-r border-border relative ${activeMetric === "precision" ? "bg-[hsl(var(--bg-olive))] dark:bg-[hsl(var(--olive)/0.12)]" : ""}`}
              onMouseEnter={() => setActiveMetric("precision")}
              whileHover={{ scale: 1.0 }}
            >
              <div className={`absolute bottom-0 left-0 h-[3px] dark:h-[2px] bg-[hsl(var(--mustard))] transition-all duration-300 ${activeMetric === "precision" ? "w-full" : "w-0"}`} style={{
                boxShadow: activeMetric === "precision" ? '0 0 8px hsl(var(--mustard) / 0.4)' : 'none',
              }} />

              <div className="flex items-center gap-2 mb-2">
                <Target className={`w-4 h-4 transition-colors duration-200 ${activeMetric === "precision" ? "text-[hsl(var(--olive))]" : "text-muted-foreground"}`} strokeWidth={2.25} />
                <p className={`font-body text-[10px] font-semibold tracking-[2px] uppercase ${activeMetric === "precision" ? metricAccents.precision.text : "text-muted-foreground"}`}>Precision</p>
              </div>
              <StatRing value={m?.about_precision_requirement ?? 95} max={100} label="Requirement Precision" unit="%" size={90} hideRing />
              <StatRing value={m?.about_precision_accuracy ?? 75} max={100} label="Increase in Accuracy" unit="%" size={90} hideRing />
            </motion.div>

            {/* Culture — Slate */}
            <motion.div
              className={`text-left space-y-4 col-span-2 md:col-span-1 cursor-default group p-10 transition-colors duration-200 relative ${activeMetric === "culture" ? "bg-[hsl(var(--bg-slate))] dark:bg-[hsl(var(--slate)/0.12)]" : ""}`}
              onMouseEnter={() => setActiveMetric("culture")}
              whileHover={{ scale: 1.0 }}
            >
              <div className={`absolute bottom-0 left-0 h-[3px] dark:h-[2px] bg-[hsl(var(--mustard))] transition-all duration-300 ${activeMetric === "culture" ? "w-full" : "w-0"}`} style={{
                boxShadow: activeMetric === "culture" ? '0 0 8px hsl(var(--mustard) / 0.4)' : 'none',
              }} />

              <div className="flex items-center gap-2 mb-2">
                <Users className={`w-4 h-4 transition-colors duration-200 ${activeMetric === "culture" ? "text-secondary" : "text-muted-foreground"}`} strokeWidth={2.25} />
                <p className={`font-body text-[10px] font-semibold tracking-[2px] uppercase ${activeMetric === "culture" ? metricAccents.culture.text : "text-muted-foreground"}`}>Culture</p>
              </div>
              <StatRing value={m?.about_culture_satisfaction ?? 80} max={100} label="Higher Team Satisfaction" unit="%" size={90} hideRing />
              <StatRing value={m?.about_culture_strategy ?? 40} max={100} label="More Strategy Time" unit="%" size={90} hideRing />
            </motion.div>
          </div>

          {/* Hover Detail Area */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="min-h-[6rem] md:min-h-[5rem] flex flex-col md:flex-row items-start gap-4">
              <div className="flex-1 relative">
                <div
                  key={activeMetric || "default"}
                  className="animate-fade-in"
                >
                  {activeMetric && (
                    <p className={`text-[11px] uppercase tracking-[0.2em] font-body font-semibold mb-2.5 ${metricAccents[activeMetric].text}`}>
                      {metricLabels[activeMetric]}
                    </p>
                  )}
                  {displayItems ? (
                    <ul className="space-y-2">
                      {displayItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[14px] text-muted-foreground font-body leading-relaxed">
                          <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[14px] text-muted-foreground font-body leading-relaxed">
                      {defaultText}
                    </p>
                  )}
                </div>
              </div>
              {activeMetric && (
                <button
                  className="shrink-0 inline-flex items-center gap-2 text-xs font-body text-[hsl(var(--mustard))] hover:text-[hsl(var(--mustard)/0.8)] transition-colors duration-200 border border-[hsl(var(--mustard)/0.3)] px-4 py-2 hover:bg-[hsl(var(--mustard)/0.05)] animate-fade-in"
                  onClick={() => {
                    const deepDivePrompts: Record<Exclude<MetricKey, null>, string> = {
                      velocity: `Tell me about the multi-agent Chain of Thought workflow you use for ${m?.about_velocity_time_to_draft ?? 2}x faster story drafting — specifically the Discovery Agent, Story Architect, and Reviewer Agent.`,
                      precision: `How do your Edge-Case Agent and Consistency Agent achieve ${m?.about_precision_requirement ?? 95}% requirement precision and eliminate clarification loops?`,
                      culture: `Explain how automating PO overhead drives ${m?.about_culture_satisfaction ?? 80}% higher team satisfaction and creates a 'thrive' culture.`,
                    };
                    const event = new CustomEvent("open-chat", {
                      detail: activeMetric ? deepDivePrompts[activeMetric] : "",
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Deep Dive with AI
                </button>
              )}
            </div>
          </div>

          <p className="font-display text-[13px] italic text-muted-foreground mt-6 border-t border-border pt-5">
            Numbers drawn from a real 6-week sprint cycle — Manufactured Home Registry Self Serve feature.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
