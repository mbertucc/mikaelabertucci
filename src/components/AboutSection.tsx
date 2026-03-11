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
      "Discovery stage scans 2500+ pages of legislation & policy. Extracts requirements automatically.",
      "Story Architect maps findings into Gherkin format. Reviewer validates against Definition of Ready.",
      "Stories arrive 90% complete. That's not a target — that's what's happening.",
    ],
    precision: [
      "This comes from context engineering with product-specific agent environments.",
      "Edge-Case Agent hunts for 'what-if' scenarios that cause mid-sprint pivots.",
      "Consistency Agent catches contradictions before they reach the backlog.",
      `Result: ${m?.about_precision_accuracy ?? 75}% increase in accuracy. Clarification loops virtually eliminated.`,
    ],
    culture: [
      `${m?.about_precision_requirement ?? 95}% precision means developers code instead of chasing missing details.`,
      `${m?.dark_factory_hours_saved_weekly ?? 20} hrs of automated PO overhead reinvested into unblocking the team.`,
      `Sprint planning is ${m?.about_velocity_planning ?? 50}% faster — every item arrives truly Ready.`,
      "The result: teams that thrive because they ship, not because they're managed.",
    ],
  };

  const displayItems = activeMetric ? metricDescriptions[activeMetric] : null;

  const easterEggActive = headshotClicks >= 3;

  return (
    <section id="about" className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="glass-card p-8 md:p-12 space-y-8">
            {/* Top: Headshot + Bio */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
              <div className="shrink-0">
                <motion.div
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg cursor-pointer"
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
                    className="text-xs text-accent-warm font-body text-center mt-2 italic"
                  >
                    ✨ You found me! I like your curiosity.
                  </motion.p>
                )}
              </div>
              <div className="space-y-4 text-center md:text-left">
                <p className="text-base text-muted-foreground font-body leading-relaxed max-w-xl">
                  {profile?.positioning ||
                    "I use AI to cut through the documentation overhead, saving 19.4 hours every week. That's not theory — that's what I'm doing today. I don't write production code. I write specs so clear that developers ship without coming back to ask questions."}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30" />

            {/* Bottom: Impact Dashboard */}
            <div className="py-1" onMouseLeave={() => setActiveMetric(null)}>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body mb-6 text-left">
                AI-Augmented Impact Dashboard
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {/* Velocity */}
                <motion.div
                  className="text-center space-y-3 cursor-pointer group"
                  onMouseEnter={() => setActiveMetric("velocity")}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className={`flex items-center justify-center gap-1.5 mb-1 transition-colors duration-200 ${activeMetric === "velocity" ? "text-primary" : ""}`}>
                    <Zap className={`w-5 h-5 transition-transform duration-200 ${activeMetric === "velocity" ? "text-primary scale-125" : "text-primary"}`} strokeWidth={2.25} />
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-body transition-colors duration-200 ${activeMetric === "velocity" ? "text-primary" : "text-muted-foreground"}`}>Velocity</p>
                  </div>
                  <StatRing value={m?.about_velocity_time_to_draft ?? 2} max={m?.about_velocity_time_to_draft_max ?? 5} label="Faster Time-to-Draft" unit="x" size={90} hideRing />
                  <StatRing value={m?.about_velocity_planning ?? 50} max={100} label="Faster Planning" unit="%" size={90} hideRing />
                </motion.div>

                {/* Precision */}
                <motion.div
                  className="text-center space-y-3 cursor-pointer group"
                  onMouseEnter={() => setActiveMetric("precision")}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className={`flex items-center justify-center gap-1.5 mb-1 transition-colors duration-200 ${activeMetric === "precision" ? "text-primary" : ""}`}>
                    <Target className={`w-5 h-5 transition-transform duration-200 ${activeMetric === "precision" ? "text-primary scale-125" : "text-primary"}`} strokeWidth={2.25} />
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-body transition-colors duration-200 ${activeMetric === "precision" ? "text-primary" : "text-muted-foreground"}`}>Precision</p>
                  </div>
                  <StatRing value={m?.about_precision_requirement ?? 95} max={100} label="Requirement Precision" unit="%" size={90} hideRing />
                  <StatRing value={m?.about_precision_accuracy ?? 75} max={100} label="Increase in Accuracy" unit="%" size={90} hideRing />
                </motion.div>

                {/* Culture */}
                <motion.div
                  className="text-center space-y-3 col-span-2 md:col-span-1 cursor-pointer group"
                  onMouseEnter={() => setActiveMetric("culture")}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className={`flex items-center justify-center gap-1.5 mb-1 transition-colors duration-200 ${activeMetric === "culture" ? "text-primary" : ""}`}>
                    <Users className={`w-5 h-5 transition-transform duration-200 ${activeMetric === "culture" ? "text-primary scale-125" : "text-primary"}`} strokeWidth={2.25} />
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-body transition-colors duration-200 ${activeMetric === "culture" ? "text-primary" : "text-muted-foreground"}`}>Culture</p>
                  </div>
                  <StatRing value={m?.about_culture_satisfaction ?? 80} max={100} label="Higher Team Satisfaction" unit="%" size={90} hideRing />
                  <StatRing value={m?.about_culture_strategy ?? 40} max={100} label="More Strategy Time" unit="%" size={90} hideRing />
                </motion.div>
              </div>

              {/* Hover Detail Area */}
              <div className="mt-6 border-t border-border/20 pt-5">
                <div className="min-h-[5.5rem] md:min-h-[4.5rem] flex flex-col md:flex-row items-start gap-3">
                  <div className="flex-1 relative">
                    <div
                      key={activeMetric || "default"}
                      className="animate-fade-in"
                    >
                      {activeMetric && (
                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body font-medium mb-2">
                          {metricLabels[activeMetric]}
                        </p>
                      )}
                      {displayItems ? (
                        <ul className="space-y-1.5">
                          {displayItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-body leading-relaxed">
                              <span className="text-primary mt-1.5 shrink-0 w-1 h-1 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground font-body leading-relaxed">
                          {defaultText}
                        </p>
                      )}
                    </div>
                  </div>
                  {activeMetric && (
                    <button
                      className="shrink-0 inline-flex items-center gap-1.5 text-xs font-body text-accent-warm hover:text-accent-warm/80 transition-colors duration-200 border border-accent-warm/20 rounded-full px-3 py-1.5 hover:bg-accent-warm/5 animate-fade-in"
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
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
