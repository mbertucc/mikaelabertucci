import { useState, useEffect, useRef } from "react";
import { Brain, Clock, FileCheck, Layers, Users, Zap, ChevronDown, CheckCircle2, ArrowRight, Lightbulb } from "lucide-react";

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
  { activity: "Scenario Spreadsheet", count: "—", previous: "~40 hrs", withAI: "~2.5 hrs", saved: "37.5 hrs", improvement: "Automated cross-referencing" },
];

const workflowStages = [
  { stage: "System Setup", human: "Author templates, instructions & working agreements", ai: "Apply rules for structure & compliance", outcome: "Reusable foundation" },
  { stage: "Scenario Definition", human: "Frame use cases, personas & legislative context", ai: "Translate into MVP boundaries & backlog slices", outcome: "Accelerated context" },
  { stage: "Co-Drafting", human: "Describe problems & desired results", ai: "Produce first-draft epics & stories from templates", outcome: "Quality drafts in minutes" },
  { stage: "Strategic Refinement", human: "Interpret legislation, run chain-of-thought checks", ai: "Surface gaps, contradictions & low-confidence areas", outcome: "Fewer downstream issues" },
  { stage: "Validation & Sprint Prep", human: "Final calls on sequencing & readiness", ai: "Check completeness & forecast sprint load", outcome: "Clearer sprint plans" },
];

const strategicBenefits = [
  "Surfaced gaps early — exposed unclear rules during backlog creation. Collaboration happened before it became a blocker.",
  "Higher-quality collaboration — BA received complete stories with clear personas and acceptance criteria. No guessing.",
  "Reduced rework — UX/UI team got full context up front. Eliminated repeated requirement-gathering sessions.",
  "Bigger picture visible — end-to-end filing flow mapped before sprint 1. Early planning for later epics.",
  "Fewer downstream issues — stories complete on first draft. Design mismatches and corrections dropped.",
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
  const [workflowExpanded, setWorkflowExpanded] = useState(false);
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
            The Numbers
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            AI Augmentation in Practice
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-3xl">
            What human-in-the-loop actually looks like — using the{" "}
            <span className="text-[hsl(var(--mustard))] font-medium">
              Manufactured Home Registry Self Serve Feature
            </span>{" "}
            as the proving ground. AI saves ~19.4 hours each week. Epics drafted, gaps surfaced, legislation checked, and rework eliminated across PO, BA, and UX.
          </p>
        </div>

        {/* Top-level stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { value: hoursSaved, unit: "hrs", label: "Saved Per Feature", sublabel: "6-week sprint cycle", icon: Clock, accent: "teal" },
            { value: qualityDelta, unit: "%", label: "Quality Improvement", sublabel: "Clearer documentation", icon: FileCheck, accent: "olive" },
            { value: storiesWritten, unit: "+", label: "Stories Drafted", sublabel: "With AI co-creation", icon: Layers, accent: "mustard" },
            { value: cognitiveReduction, unit: "%", label: "Less Cognitive Load", sublabel: "Routine writing & formatting", icon: Brain, accent: "teal" },
          ].map((stat) => {
            const Icon = stat.icon;
            const isMustard = stat.accent === "mustard";
            const isOlive = stat.accent === "olive";
            const textColor = isMustard
              ? "text-[hsl(var(--mustard))]"
              : isOlive
              ? "text-[hsl(var(--olive))]"
              : "text-primary";
            const bgColor = isMustard
              ? "bg-[hsl(var(--mustard)/0.08)]"
              : isOlive
              ? "bg-[hsl(var(--bg-olive))]"
              : "bg-[hsl(var(--bg-teal))]";

            return (
              <div key={stat.label} className="glass-card p-5 space-y-3 relative overflow-hidden">
                <div className="absolute inset-0 mcm-pattern-dots opacity-20 pointer-events-none" />
                <div className={`inline-flex p-2 rounded-md ${bgColor} relative z-10`}>
                  <Icon className={`w-4 h-4 ${textColor}`} />
                </div>
                <div className="relative z-10">
                  <span className={`font-display text-3xl ${textColor}`}>
                    {stat.unit === "hrs" ? stat.value.toFixed(1) : Math.round(stat.value)}
                  </span>
                  <span className={`text-lg font-display ${textColor}`}>{stat.unit}</span>
                </div>
                <p className="text-xs uppercase tracking-[0.15em] text-foreground font-body font-medium relative z-10">
                  {stat.label}
                </p>
                <p className="text-[10px] text-muted-foreground font-body relative z-10">{stat.sublabel}</p>
              </div>
            );
          })}
        </div>

        {/* Human-in-the-Loop Workflow */}
        <div className="glass-card overflow-hidden mb-12">
          <button
            onClick={() => setWorkflowExpanded(!workflowExpanded)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-card/80 transition-colors"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body mb-1">
                Human-in-the-Loop Workflow
              </p>
              <p className="text-sm text-muted-foreground font-body">
                How I partner with AI across 5 stages — staying in the driver seat
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${workflowExpanded ? "rotate-180" : ""}`} />
          </button>

          {workflowExpanded && (
            <div className="border-t border-[hsl(var(--divider))] animate-fade-in">
              {/* Desktop headers */}
              <div className="hidden md:grid grid-cols-4 gap-4 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body border-b border-[hsl(var(--divider)/0.5)]">
                <span>Stage</span>
                <span>My Role (Human)</span>
                <span>AI Role (Partnering)</span>
                <span>Outcome</span>
              </div>

              {workflowStages.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 px-5 py-4 border-b border-[hsl(var(--divider)/0.3)] last:border-b-0 hover:bg-card/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-primary font-bold">0{i + 1}</span>
                    <span className="text-sm text-foreground font-body font-medium">{row.stage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground md:hidden">My Role: </span>
                    <span className="text-xs text-muted-foreground font-body">{row.human}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground md:hidden">AI Role: </span>
                    <span className="text-xs text-primary/80 font-body">{row.ai}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground md:hidden">Outcome: </span>
                    <span className="text-xs text-[hsl(var(--olive))] font-body font-medium">{row.outcome}</span>
                  </div>
                </div>
              ))}

              {/* Pipeline visual */}
              <div className="hidden md:flex items-center justify-center py-4 gap-1 bg-card/30">
                {workflowStages.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-muted-foreground px-2 py-1 rounded bg-background/60 border border-[hsl(var(--divider)/0.5)]">{s.stage}</span>
                    {i < workflowStages.length - 1 && <ArrowRight className="w-3 h-3 text-primary/40" />}
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <div className="border-t border-[hsl(var(--divider))] animate-fade-in">
              <div className="hidden md:grid grid-cols-5 gap-4 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body border-b border-[hsl(var(--divider)/0.5)]">
                <span>Activity</span>
                <span>Previous Effort</span>
                <span>With AI</span>
                <span>Time Saved</span>
                <span>Key Improvement</span>
              </div>

              {activities.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-5 py-4 border-b border-[hsl(var(--divider)/0.3)] last:border-b-0 hover:bg-card/60 transition-colors"
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
                    <span className="text-sm text-[hsl(var(--olive))] font-mono font-bold">{row.saved}</span>
                  </div>
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] text-muted-foreground md:hidden">Improvement: </span>
                    <span className="text-xs text-muted-foreground font-body">{row.improvement}</span>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-5 py-4 bg-[hsl(var(--bg-teal)/0.3)] border-t border-primary/20">
                <span className="text-sm text-foreground font-body font-bold">Total Per Cycle</span>
                <span className="text-sm text-muted-foreground font-mono">~187 hrs</span>
                <span className="text-sm text-primary font-mono font-medium">~73 hrs</span>
                <span className="text-sm text-[hsl(var(--olive))] font-mono font-bold">≈114 hrs</span>
                <span className="text-xs text-muted-foreground font-body italic">~19 hrs/week gained</span>
              </div>
            </div>
          )}
        </div>

        {/* Strategic Benefits */}
        <div className="glass-card p-6 md:p-8 mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body mb-6">
            Strategic Benefits
          </p>
          <div className="space-y-3">
            {strategicBenefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--olive))] shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario Spreadsheet callout */}
        <div className="glass-card p-6 md:p-8 mb-12 ring-1 ring-[hsl(var(--mustard)/0.2)]">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-md bg-[hsl(var(--mustard)/0.08)] shrink-0">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--mustard))]" />
            </div>
            <div>
              <p className="text-sm text-foreground font-body font-medium mb-2">
                Scenario Spreadsheet — 40+ Hours Saved
              </p>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                I used AI to co-develop a comprehensive scenario spreadsheet — all filing request variants, requirements, legislative references, and use cases. This took 2.5 hours. That's approximately one full week of manual compilation, done in an afternoon. The spreadsheet went to a legal contractor whose analysis was critical for changing established ways of working.
              </p>
            </div>
          </div>
        </div>

        {/* Human value retained */}
        <div className="glass-card p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body mb-4">
            Human Value Retained
          </p>
          <p className="text-sm text-muted-foreground font-body mb-2 max-w-3xl">
            I stay in the driver seat. I set the vision. I define scope boundaries. I interpret legislation. I make every trade-off and prioritization decision. AI works inside the system I designed — it amplifies my decisions, it doesn't replace them.
          </p>
          <p className="text-sm text-muted-foreground font-body mb-6 max-w-3xl">
            I also use AI to pressure-test ideas, explore edge cases, and run structured chain-of-thought checks — "Where are we guessing?", "What should we verify?", "Which sources might be outdated?" The result: clearer stories, stronger BA requirements, and designers who get full context up front.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {humanRetained.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-md bg-background/60 border border-[hsl(var(--divider))]">
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