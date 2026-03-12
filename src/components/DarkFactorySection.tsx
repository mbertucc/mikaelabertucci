import { useState, useEffect, useRef } from "react";
import { FileText, Cpu, Rocket, Clock, FileCheck, Layers, Brain } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { useSiteMetrics, SiteMetrics } from "@/hooks/useSiteMetrics";

const buildSteps = (m: SiteMetrics) => [
  {
    number: "01",
    label: "THE INPUT",
    title: "Legislative Complexity",
    accent: "amber-warm" as const,
    icon: FileText,
    content:
      `**${m.dark_factory_pages}+ pages** of the Manufactured Home Act, Regulations, and Policy. Dense legal language. Registration requirements, platform obligations, compliance triggers, municipal enforcement rules. All of it.`,
    stat: `${m.dark_factory_pages}+`,
    statLabel: "Pages of Legislation",
  },
  {
    number: "02",
    label: "THE PROCESS",
    title: "AI Synthesis",
    accent: "primary" as const,
    icon: Cpu,
    content:
      `I build **custom AI agents** using context engineering. Weeks of manual analysis of **legislation, policy, and business rules** — done in minutes. Structured, traceable outputs. **${m.dark_factory_hours_saved_weekly} hours saved per week**.`,
    stat: `${m.dark_factory_hours_saved_weekly}hrs`,
    statLabel: "Saved Per Week",
  },
  {
    number: "03",
    label: "THE OUTPUT",
    title: "The Spec",
    accent: "teal" as const,
    icon: Rocket,
    content:
      `A **complete, hand-off-ready User Story**. Business rules, scenarios, edge cases, error handling, Gherkin/Markdown spec. **Designers and Developers** build from it immediately. Clarification loops reduced by **${m.dark_factory_clarification_reduction}%**.`,
    stat: `${m.dark_factory_clarification_reduction}%`,
    statLabel: "Fewer Clarification Loops",
  },
];

const accentStyles = {
  "amber-warm": {
    border: "border-[hsl(var(--amber-warm))]",
    text: "text-[hsl(var(--amber-warm))]",
    bg: "bg-[hsl(var(--amber-warm)/0.08)]",
    glow: "shadow-[0_0_24px_hsl(var(--amber-warm)/0.15)]",
    ring: "ring-[hsl(var(--amber-warm)/0.25)]",
  },
  primary: {
    border: "border-primary",
    text: "text-primary",
    bg: "bg-primary/8",
    glow: "shadow-[0_0_24px_hsl(var(--primary)/0.15)]",
    ring: "ring-primary/25",
  },
  teal: {
    border: "border-[hsl(var(--teal))]",
    text: "text-[hsl(var(--teal))]",
    bg: "bg-[hsl(var(--teal)/0.08)]",
    glow: "shadow-[0_0_24px_hsl(var(--teal)/0.15)]",
    ring: "ring-[hsl(var(--teal)/0.25)]",
  },
};

const useAnimatedNumber = (target: number, isVisible: boolean, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);
  return value;
};

const buildImpactStats = (m: SiteMetrics) => [
  { target: m.dark_factory_total_hours_saved, unit: "hrs", label: "Saved Per Feature Set", icon: Clock, accent: "primary" as const, decimals: true, key: "saved" },
  { target: m.dark_factory_quality_lift, unit: "%", label: "Quality Lift", icon: FileCheck, accent: "teal" as const, decimals: false, key: "quality" },
  { target: m.dark_factory_stories_drafted, unit: "+", label: "Stories Drafted", icon: Layers, accent: "amber-warm" as const, decimals: false, key: "stories" },
  { target: m.dark_factory_cognitive_load, unit: "%", label: "Less Cognitive Load", icon: Brain, accent: "primary" as const, decimals: false, key: "cognitive" },
];

type StatKey = "saved" | "quality" | "stories" | "cognitive" | null;

const buildStatDescriptions = (m: SiteMetrics): Record<Exclude<StatKey, null>, string[]> => ({
  saved: [
    "Multilevel agent built specifically for the Manufactured Home Registry.",
    "Automated discovery and drafting for this feature set — measured across a real 6-week cycle.",
  ],
  quality: [
    "Agent systematically uncovers edge cases & business requirements others miss.",
    "Each finding confirmed with the business for final accuracy.",
    "Collaborative validation loop. Documentation quality goes up every cycle.",
  ],
  stories: [
    "AI drafts stories from legislative artifacts before any human writing begins.",
    "BA validates for accuracy and corporate knowledge — not authoring from scratch.",
    "Cuts the initial product discovery cycle significantly. Time and budget saved.",
  ],
  cognitive: [
    "16 multilevel agents manage tactical overhead across different products.",
    "I focus entirely on high-level vision and team leadership. The routine work is handled.",
  ],
});

const buildStatHoverLabels = (m: SiteMetrics): Record<Exclude<StatKey, null>, string> => ({
  saved: `${m.dark_factory_total_hours_saved}hrs Saved Per Feature`,
  quality: `${m.dark_factory_quality_lift}% Quality Lift`,
  stories: `${m.dark_factory_stories_drafted}+ Stories Drafted`,
  cognitive: `${m.dark_factory_cognitive_load}% Less Cognitive Load`,
});

const ImpactStatCard = ({ stat, visible, isActive, onHover }: {
  stat: ReturnType<typeof buildImpactStats>[number];
  visible: boolean;
  isActive: boolean;
  onHover: () => void;
}) => {
  const Icon = stat.icon;
  const val = useAnimatedNumber(stat.target, visible);
  const s = accentStyles[stat.accent];
  return (
    <div
      className={`glass-card p-5 space-y-2 cursor-pointer transition-all duration-200 ${isActive ? "ring-1 ring-primary/30 scale-[1.02]" : ""}`}
      onMouseEnter={onHover}
    >
      <div className={`inline-flex p-2.5 rounded-lg ${s.bg}`}>
        <Icon className={`w-5 h-5 ${s.text}`} strokeWidth={2.25} />
      </div>
      <div>
        <span className={`font-display text-2xl font-bold ${s.text}`}>
          {stat.decimals ? val.toFixed(1) : Math.round(val)}
        </span>
        <span className={`text-sm font-display ${s.text}`}>{stat.unit}</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-body font-medium">
        {stat.label}
      </p>
    </div>
  );
};

const DarkFactorySection = () => {
  const [visible, setVisible] = useState(false);
  const [activeStat, setActiveStat] = useState<StatKey>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { data: m } = useSiteMetrics();

  const steps = m ? buildSteps(m) : [];
  const impactStats = m ? buildImpactStats(m) : [];
  const statDescriptions = m ? buildStatDescriptions(m) : {} as Record<Exclude<StatKey, null>, string[]>;
  const statHoverLabels = m ? buildStatHoverLabels(m) : {} as Record<Exclude<StatKey, null>, string>;

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="dark-factory" className="py-12 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-10 space-y-3">
            <p className="text-xs font-body uppercase tracking-[0.3em] text-primary">
              How I Actually Work
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
              The Agentic Product Owner Workflow
            </h2>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
              Real example:{" "}
              <span className="text-[hsl(var(--amber-warm))] font-medium">
                Manufactured Home Registry Transfer
              </span>
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, idx) => {
            const s = accentStyles[step.accent];
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.number} delay={idx * 0.15}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`glass-card relative overflow-hidden p-8 flex flex-col gap-6 ring-1 ${s.ring} ${s.glow} transition-all duration-300`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold tracking-widest ${s.text}`}>
                    {step.number}
                  </span>
                  <span className={`text-[10px] font-body uppercase tracking-[0.25em] px-2 py-0.5 rounded ${s.bg} ${s.text}`}>
                    {step.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${s.bg}`}>
                    <Icon className={`w-6 h-6 ${s.text}`} strokeWidth={2.25} />
                  </div>
                  <h3 className="font-display text-xl text-foreground">
                    {step.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {step.content.split(/(\*\*.*?\*\*)/).map((seg, i) =>
                    seg.startsWith("**") ? (
                      <strong key={i} className="text-foreground font-semibold">
                        {seg.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={i}>{seg}</span>
                    )
                  )}
                </p>

                <div className="border-t border-border/50 pt-5 mt-auto">
                  <p className={`font-display text-3xl font-bold ${s.text}`}>
                    {step.stat}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {step.statLabel}
                  </p>
                </div>
              </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Connecting line (desktop) */}
        <div className="hidden lg:flex items-center justify-center mt-10 gap-2">
          <span className="h-px w-16 bg-[hsl(var(--amber-warm)/0.4)]" />
          <span className="text-xs text-muted-foreground font-mono">→</span>
          <span className="h-px w-16 bg-primary/40" />
          <span className="text-xs text-muted-foreground font-mono">→</span>
          <span className="h-px w-16 bg-[hsl(var(--teal)/0.4)]" />
          <span className="text-xs text-[hsl(var(--teal))] font-mono font-bold">
            Ship-Ready
          </span>
        </div>

        {/* Impact Stats */}
        <div className="py-1" onMouseLeave={() => setActiveStat(null)}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            {impactStats.map((stat) => (
              <ImpactStatCard
                key={stat.label}
                stat={stat}
                visible={visible}
                isActive={activeStat === stat.key}
                onHover={() => setActiveStat(stat.key as StatKey)}
              />
            ))}
          </div>

          {/* Hover Detail Area */}
          <div className="mt-6 min-h-[5rem] md:min-h-[3.5rem]">
            <div
              key={activeStat || "default"}
              className="animate-fade-in"
            >
              {activeStat && statDescriptions[activeStat] ? (
                <>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body font-medium mb-2">
                    {statHoverLabels[activeStat]}
                  </p>
                  <ul className="space-y-1.5">
                    {statDescriptions[activeStat].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-body leading-relaxed">
                        <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Hover over a metric to learn what it measures and why it matters.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-6">
          These numbers come from a real 6-week sprint cycle on the Manufactured Home Registry Self Serve feature.
        </p>
      </div>
    </section>
  );
};

export default DarkFactorySection;
