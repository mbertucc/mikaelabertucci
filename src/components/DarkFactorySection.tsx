import { useState, useEffect, useRef } from "react";
import { FileText, Cpu, Rocket, Clock, FileCheck, Layers, Brain } from "lucide-react";

const steps = [
  {
    number: "01",
    label: "THE INPUT",
    title: "Legislative Complexity",
    accent: "amber-warm" as const,
    icon: FileText,
    content:
      "200+ pages of the **Manufactured Home Act**, Regulations, and Policy — dense legal language spanning registration requirements, platform obligations, compliance triggers, and municipal enforcement rules.",
    stat: "200+",
    statLabel: "Pages of Legislation",
  },
  {
    number: "02",
    label: "THE PROCESS",
    title: "AI Synthesis",
    accent: "primary" as const,
    icon: Cpu,
    content:
      "I build **custom AI agents** using a **context engineering** approach — replacing weeks of manual analysis of **legislation, policy documents, business rules, and requirements** with structured, traceable outputs in minutes — saving **20 hours per week**.",
    stat: "20hrs",
    statLabel: "Saved Per Week",
  },
  {
    number: "03",
    label: "THE OUTPUT",
    title: "The Spec",
    accent: "teal" as const,
    icon: Rocket,
    content:
      "A **complete, hand-off-ready User Story** with business rules, scenarios, edge cases, error handling, and Gherkin/Markdown specification that **Designers and Developers** can build from immediately — reducing requirement clarification loops by **90%**.",
    stat: "90%",
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

const impactStats = [
  { target: 116.5, unit: "hrs", label: "Saved Per Feature Set", icon: Clock, accent: "primary" as const, decimals: true, key: "saved" },
  { target: 35, unit: "%", label: "Quality Lift", icon: FileCheck, accent: "teal" as const, decimals: false, key: "quality" },
  { target: 60, unit: "+", label: "Stories Drafted", icon: Layers, accent: "amber-warm" as const, decimals: false, key: "stories" },
  { target: 50, unit: "%", label: "Less Cognitive Load", icon: Brain, accent: "primary" as const, decimals: false, key: "cognitive" },
];

type StatKey = "saved" | "quality" | "stories" | "cognitive" | null;

const statDescriptions: Record<Exclude<StatKey, null>, string[]> = {
  saved: [
    "Multilevel agent tailored to the Manufactured Home Registry.",
    "Automated the heavy lifting of discovery and drafting for this feature.",
  ],
  quality: [
    "Agent systematically uncovers deep edge cases & business requirements.",
    "Each finding confirmed with the business for final accuracy.",
    "Collaborative validation loop that consistently elevates documentation quality.",
  ],
  stories: [
    "AI drafts stories from legislative artifacts before any human writing begins.",
    "Business Analyst validates for accuracy and corporate knowledge — not authoring from scratch.",
    "Reduces initial product discovery cycle significantly, saving time and budget.",
  ],
  cognitive: [
    "16 multilevel agents manage tactical overhead across different products.",
    "Frees me to focus entirely on high-level vision and team leadership.",
  ],
};

const statHoverLabels: Record<Exclude<StatKey, null>, string> = {
  saved: "116.5hrs Saved Per Feature",
  quality: "35% Quality Lift",
  stories: "60+ Stories Drafted",
  cognitive: "50% Less Cognitive Load",
};

const DarkFactorySection = () => {
  const [visible, setVisible] = useState(false);
  const [activeStat, setActiveStat] = useState<StatKey>(null);
  const ref = useRef<HTMLDivElement>(null);

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
        <div className="text-center mb-10 space-y-3">
          <p className="text-xs font-body uppercase tracking-[0.3em] text-primary">
            Technical Proof
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
            The Agentic Product Owner Workflow
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Case Study:{" "}
            <span className="text-[hsl(var(--amber-warm))] font-medium">
              Manufactured Home Registry Transfer
            </span>
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step) => {
            const s = accentStyles[step.accent];
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`glass-card relative overflow-hidden p-8 flex flex-col gap-6 ring-1 ${s.ring} ${s.glow} transition-all duration-300 hover:scale-[1.02]`}
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
              </div>
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
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              const val = useAnimatedNumber(stat.target, visible);
              const s = accentStyles[stat.accent];
              const isActive = activeStat === stat.key;
              return (
                <div
                  key={stat.label}
                  className={`glass-card p-5 space-y-2 cursor-pointer transition-all duration-200 ${isActive ? "ring-1 ring-primary/30 scale-[1.02]" : ""}`}
                  onMouseEnter={() => setActiveStat(stat.key as StatKey)}
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
            })}
          </div>

          {/* Hover Detail Area */}
          <div className="mt-6 min-h-[5rem] md:min-h-[3.5rem]">
            <div
              key={activeStat || "default"}
              className="animate-fade-in"
            >
              {activeStat ? (
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
          Proven through a 6-week sprint cycle on the Manufactured Home Registry Self Serve feature.
        </p>
      </div>
    </section>
  );
};

export default DarkFactorySection;