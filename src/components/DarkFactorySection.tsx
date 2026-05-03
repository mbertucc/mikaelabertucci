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
    accent: "mustard" as const,
    icon: FileText,
    content:
      `**${m.dark_factory_pages}+ pages** of the Manufactured Home Act and associated Regulations — registration requirements, platform obligations, compliance triggers, and municipal enforcement rules.`,
    stat: `${m.dark_factory_pages}+`,
    statLabel: "Pages of Legislation",
  },
  {
    number: "02",
    label: "THE PROCESS",
    title: "AI Synthesis",
    accent: "teal" as const,
    icon: Cpu,
    content:
      `I build **custom AI agents** using context engineering. Weeks of manual analysis of legislation and business rules — done in minutes. Structured, traceable outputs. **${m.dark_factory_hours_saved_weekly} hours saved per week**.`,
    stat: `${m.dark_factory_hours_saved_weekly}hrs`,
    statLabel: "Saved Per Week",
  },
  {
    number: "03",
    label: "THE OUTPUT",
    title: "The Spec",
    accent: "olive" as const,
    icon: Rocket,
    content:
      `A **complete, hand-off-ready User Story**. Business rules, scenarios, edge cases, error handling, Gherkin/Markdown spec. **Designers and Developers** build from it immediately. Clarification loops reduced by **${m.dark_factory_clarification_reduction}%**.`,
    stat: `${m.dark_factory_clarification_reduction}%`,
    statLabel: "Fewer Clarification Loops",
  },
];

const headerBgs: Record<string, string> = {
  mustard: "bg-foreground dark:bg-[hsl(var(--charcoal))]",
  teal: "bg-[hsl(var(--teal))] dark:bg-[hsl(var(--teal-dk))]",
  olive: "bg-[hsl(var(--mustard-dk))] dark:bg-[hsl(var(--mustard)/0.35)]",
};

const statColors: Record<string, string> = {
  mustard: "text-foreground dark:text-[hsl(var(--nav-text)/0.2)]",
  teal: "text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal))]",
  olive: "text-[hsl(var(--mustard-dk))] dark:text-[hsl(var(--mustard-dk))]",
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
  { target: m.dark_factory_total_hours_saved, unit: "hrs", label: "Saved Per Feature Set", icon: Clock, accent: "teal" as const, decimals: true, key: "saved" },
  { target: m.dark_factory_quality_lift, unit: "%", label: "Quality Lift", icon: FileCheck, accent: "olive" as const, decimals: false, key: "quality" },
  { target: m.dark_factory_stories_drafted, unit: "+", label: "Stories Drafted", icon: Layers, accent: "mustard" as const, decimals: false, key: "stories" },
  { target: m.dark_factory_cognitive_load, unit: "%", label: "Less Cognitive Load", icon: Brain, accent: "teal" as const, decimals: false, key: "cognitive" },
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
  return (
    <div
      className={`border border-border p-7 space-y-3 cursor-pointer transition-all duration-200 relative overflow-hidden ${isActive ? "bg-[hsl(var(--teal-pale))] dark:bg-[hsl(var(--teal)/0.15)] ring-1 ring-primary/30" : "bg-card/40 hover:bg-card/70"}`}
      onMouseEnter={onHover}
    >
      <div className="inline-flex p-2.5 bg-card/60 dark:bg-[hsl(var(--charcoal)/0.5)] relative z-10">
        <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"}`} strokeWidth={2.25} />
      </div>
      <div className="relative z-10">
        <span className="font-display text-[48px] font-bold text-foreground leading-[1] tracking-[-1px]">
          {stat.decimals ? val.toFixed(1) : Math.round(val)}
        </span>
        <span className="text-base font-display text-muted-foreground ml-1">{stat.unit}</span>
      </div>
      <p className="font-body text-[10px] font-semibold tracking-[2px] uppercase text-muted-foreground relative z-10 leading-[1.6]">
        {stat.label}
      </p>
      {/* Mustard underline on hover */}
      <div className={`absolute bottom-0 left-0 h-[2px] bg-[hsl(var(--mustard))] transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
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
    <section id="dark-factory" className="py-28 px-8 md:px-16 relative" ref={ref}>
      {/* Dark mode: horizontal line pattern */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, hsl(var(--teal) / 0.03) 79px, hsl(var(--teal) / 0.03) 80px)',
      }} />

      <div className="max-w-[1200px] mx-auto relative z-[1]">
        {/* Header — editorial */}
        <ScrollReveal>
          <div className="flex items-baseline gap-5 mb-16 border-b border-border pb-6">
            <div className="flex items-center gap-2 font-body text-[10px] font-bold tracking-[4px] uppercase text-[hsl(var(--mustard-dk))] dark:text-[hsl(var(--mustard))] whitespace-nowrap">
              <span className="inline-block w-1.5 h-1.5 bg-[hsl(var(--mustard))] rotate-45" style={{
                boxShadow: 'var(--mustard-diamond-shadow, none)',
              }} />
              Three Steps
            </div>
            <h2 className="font-display text-[36px] md:text-[46px] font-normal italic text-foreground tracking-[-0.5px]">
              The Agentic Product Owner Workflow
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-muted-foreground font-body text-[14px] font-light leading-[1.85] mb-12">
            Real example:{" "}
            <span className="text-[hsl(var(--mustard))] font-medium">
              Manufactured Home Registry Transfer
            </span>
          </p>
        </ScrollReveal>

        {/* Workflow cards — 3-column editorial grid */}
        <div className="grid md:grid-cols-3 border border-border">
          {steps.map((step, idx) => (
            <ScrollReveal key={step.number} delay={idx * 0.08}>
              <motion.div
                whileHover={{ backgroundColor: 'var(--card-hover-bg)' }}
                className={`relative overflow-hidden transition-colors duration-200 ${idx < 2 ? "border-r border-border" : ""} hover:bg-popover`}
              >
                {/* Colored header bar */}
                <div className={`px-8 py-6 flex items-center justify-between border-b border-[hsl(0_0%_100%/0.15)] dark:border-border ${headerBgs[step.accent]}`}>
                  <span className="font-display text-[40px] font-black text-[hsl(var(--nav-text)/0.2)] dark:text-[hsl(var(--nav-text)/0.1)] leading-[1] tracking-[-1px]">
                    {step.number}
                  </span>
                  <span className="font-body text-[9px] font-bold tracking-[2.5px] uppercase text-[hsl(var(--nav-text)/0.7)] dark:text-[hsl(var(--nav-text)/0.5)]">
                    {step.label}
                  </span>
                </div>

                {/* Body */}
                <div className="p-8 md:p-10">
                  <h3 className="font-display text-[26px] font-bold text-foreground mb-4 leading-[1.15]">
                    {step.title}
                  </h3>
                  <p className="font-body text-[14px] font-light text-muted-foreground leading-[1.85]">
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

                  {/* Stat */}
                  <div className="mt-8 pt-5 border-t border-border flex items-baseline gap-3">
                    <span className={`font-display text-[52px] font-bold leading-[1] tracking-[-2px] transition-colors duration-200 ${statColors[step.accent]}`}>
                      {step.stat}
                    </span>
                    <span className="font-body text-[10px] font-semibold tracking-[2px] uppercase text-muted-foreground leading-[1.6] max-w-[100px]">
                      {step.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Connecting line (desktop) */}
        <div className="hidden lg:flex items-center justify-center mt-12 gap-2">
          <span className="h-px w-16 bg-[hsl(var(--mustard)/0.4)]" />
          <span className="text-sm text-muted-foreground font-mono">→</span>
          <span className="h-px w-16 bg-primary/40" />
          <span className="text-sm text-muted-foreground font-mono">→</span>
          <span className="h-px w-16 bg-[hsl(var(--olive)/0.4)]" />
          <span className="text-sm text-[hsl(var(--olive))] font-mono font-bold">
            Ship-Ready
          </span>
        </div>

        {/* Impact Stats */}
        <div className="py-1" onMouseLeave={() => setActiveStat(null)}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-20 border border-border">
            {impactStats.map((stat, i) => (
              <div key={stat.label} className={i < 3 ? "border-r border-border" : ""}>
                <ImpactStatCard
                  stat={stat}
                  visible={visible}
                  isActive={activeStat === stat.key}
                  onHover={() => setActiveStat(stat.key as StatKey)}
                />
              </div>
            ))}
          </div>

          {/* Hover Detail Area */}
          <div className="mt-8 min-h-[5.5rem] md:min-h-[4rem]">
            <div
              key={activeStat || "default"}
              className="animate-fade-in"
            >
              {activeStat && statDescriptions[activeStat] ? (
                <>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-body font-semibold mb-2.5">
                    {statHoverLabels[activeStat]}
                  </p>
                  <ul className="space-y-2">
                    {statDescriptions[activeStat].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[14px] text-muted-foreground font-body leading-relaxed">
                        <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-[14px] text-muted-foreground font-body leading-relaxed">
                  Hover over a metric to learn what it measures and why it matters.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="font-display text-[14px] italic text-muted-foreground mt-8 border-t border-border pt-5">
          These numbers come from a real 6-week sprint cycle on the Manufactured Home Registry Self Serve feature.
        </p>
      </div>
    </section>
  );
};

export default DarkFactorySection;
