import { useState, useEffect, useRef } from "react";
import { Brain, Clock, FileCheck, Layers, Users, Zap, ChevronDown } from "lucide-react";

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

const activities = [
  { activity: "Epic Drafting", count: "9 epics", previous: "~27 hrs", withAI: "~13.5 hrs", saved: "13.5 hrs", improvement: "Draft speed + clarity" },
  { activity: "Story Writing", count: "≈60 stories", previous: "~90 hrs", withAI: "~45 hrs", saved: "45 hrs", improvement: "Structure + completeness" },
  { activity: "Validation & Alignment", count: "—", previous: "~30 hrs", withAI: "~12 hrs", saved: "18 hrs", improvement: "Fewer rework loops" },
  { activity: "Scenario Spreadsheet", count: "—", previous: "~40 hrs", withAI: "~0 hrs", saved: "40+ hrs", improvement: "Automated cross-referencing" },
];

const humanRetained = [
  { icon: Layers, label: "Product Vision & Scope" },
  { icon: FileCheck, label: "Legislative Interpretation" },
  { icon: Users, label: "Stakeholder Engagement" },
  { icon: Zap, label: "Prioritization & Trade-offs" },
];

const AugmentationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tableExpanded, setTableExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const hoursSaved = useAnimatedNumber(116.5, isVisible);
  const qualityDelta = useAnimatedNumber(35, isVisible);
  const storiesWritten = useAnimatedNumber(60, isVisible);
  const cognitiveReduction = useAnimatedNumber(50, isVisible);

  return (
    <section id="augmentation" className="py-28 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-3">
            Case Study
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            AI Augmentation in Practice
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-3xl">
            A real-world demonstration of the human-in-the-loop model — using the{" "}
            <span className="text-[hsl(var(--amber-warm))] font-medium">
              Manufactured Home Registry Self Serve Feature
            </span>{" "}
            as the proving ground.
          </p>
        </div>

        {/* Top-level stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { value: hoursSaved, unit: "hrs", label: "Saved Per Cycle", sublabel: "6-week sprint", icon: Clock, accent: "primary" },
            { value: qualityDelta, unit: "%", label: "Quality Improvement", sublabel: "Documentation clarity", icon: FileCheck, accent: "teal" },
            { value: storiesWritten, unit: "+", label: "Stories Drafted", sublabel: "With AI co-creation", icon: Layers, accent: "amber-warm" },
            { value: cognitiveReduction, unit: "%", label: "Less Cognitive Load", sublabel: "Routine writing & formatting", icon: Brain, accent: "primary" },
          ].map((stat) => {
            const Icon = stat.icon;
            const isAmber = stat.accent === "amber-warm";
            const isTeal = stat.accent === "teal";
            const textColor = isAmber
              ? "text-[hsl(var(--amber-warm))]"
              : isTeal
              ? "text-[hsl(var(--teal))]"
              : "text-primary";
            const bgColor = isAmber
              ? "bg-[hsl(var(--amber-warm)/0.08)]"
              : isTeal
              ? "bg-[hsl(var(--teal)/0.08)]"
              : "bg-primary/8";

            return (
              <div key={stat.label} className="glass-card p-5 space-y-3">
                <div className={`inline-flex p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`w-4 h-4 ${textColor}`} />
                </div>
                <div>
                  <span className={`font-display text-3xl font-bold ${textColor}`}>
                    {stat.unit === "hrs" ? stat.value.toFixed(1) : Math.round(stat.value)}
                  </span>
                  <span className={`text-lg font-display ${textColor}`}>{stat.unit}</span>
                </div>
                <p className="text-xs uppercase tracking-[0.15em] text-foreground font-body font-medium">
                  {stat.label}
                </p>
                <p className="text-[10px] text-muted-foreground font-body">{stat.sublabel}</p>
              </div>
            );
          })}
        </div>

        {/* Activity breakdown table */}
        <div className="glass-card overflow-hidden mb-12">
          <button
            onClick={() => setTableExpanded(!tableExpanded)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-card/80 transition-colors"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body mb-1">
                Detailed Breakdown
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Per-activity time savings across a 6-week cycle
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${tableExpanded ? "rotate-180" : ""}`} />
          </button>

          {tableExpanded && (
            <div className="border-t border-border/30 animate-fade-in">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-5 gap-4 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body border-b border-border/20">
                <span>Activity</span>
                <span>Previous Effort</span>
                <span>With AI</span>
                <span>Time Saved</span>
                <span>Key Improvement</span>
              </div>

              {/* Table rows */}
              {activities.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-5 py-4 border-b border-border/10 last:border-b-0 hover:bg-card/60 transition-colors"
                >
                  <div>
                    <span className="text-sm text-foreground font-body font-medium">{row.activity}</span>
                    {row.count !== "—" && (
                      <span className="text-[10px] text-muted-foreground font-body ml-2">({row.count})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] text-muted-foreground md:hidden">Previous: </span>
                    <span className="text-sm text-muted-foreground font-mono">{row.previous}</span>
                  </div>
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] text-muted-foreground md:hidden">With AI: </span>
                    <span className="text-sm text-primary font-mono font-medium">{row.withAI}</span>
                  </div>
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] text-muted-foreground md:hidden">Saved: </span>
                    <span className="text-sm text-[hsl(var(--teal))] font-mono font-bold">{row.saved}</span>
                  </div>
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] text-muted-foreground md:hidden">Improvement: </span>
                    <span className="text-xs text-muted-foreground font-body">{row.improvement}</span>
                  </div>
                </div>
              ))}

              {/* Total row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-5 py-4 bg-primary/5 border-t border-primary/20">
                <span className="text-sm text-foreground font-body font-bold">Total Per Cycle</span>
                <span className="text-sm text-muted-foreground font-mono">~187 hrs</span>
                <span className="text-sm text-primary font-mono font-medium">~70.5 hrs</span>
                <span className="text-sm text-[hsl(var(--teal))] font-mono font-bold">≈116.5 hrs</span>
                <span className="text-xs text-muted-foreground font-body italic">~19.4 hrs/week gained</span>
              </div>
            </div>
          )}
        </div>

        {/* Human value retained */}
        <div className="glass-card p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body mb-6">
            Human Value Retained
          </p>
          <p className="text-sm text-muted-foreground font-body mb-6 max-w-2xl">
            AI operates within the framework I created — amplifying my decisions, not replacing them.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {humanRetained.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border/30">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs text-foreground font-body font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AugmentationSection;
