import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";
import { useSiteMetrics } from "@/hooks/useSiteMetrics";
import ScrollReveal from "@/components/ScrollReveal";

type MetricKey = "velocity" | "precision" | "culture" | null;

const metricDescriptions = (m: any): Record<Exclude<MetricKey, null>, string[]> => ({
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
});

const defaultText = "Hover over a metric to see the numbers behind how I work.";

const buildLedgerStats = (m: any) => [
  { value: `${m?.about_velocity_time_to_draft ?? 2}`, unit: "×", label: "Faster\nTime-to-Draft", key: "velocity" as const },
  { value: `${m?.about_precision_requirement ?? 95}`, unit: "%", label: "Requirement\nPrecision", key: "precision" as const },
  { value: `${m?.dark_factory_clarification_reduction ?? 90}`, unit: "%", label: "Fewer Clarification\nLoops", key: "precision" as const, highlight: true },
  { value: `${m?.dark_factory_total_hours_saved ?? 116.5}`, unit: "", label: "Hours Saved\nPer Feature Set", key: "velocity" as const },
  { value: `40→2.5`, unit: "", label: "Hours Per\nLegislative Domain", key: "velocity" as const },
  { value: `3`, unit: "", label: "Registries\nConcurrently", key: "culture" as const },
];

const AboutSection = () => {
  const { data: profile } = useProfile();
  const { data: m } = useSiteMetrics();
  const [activeMetric, setActiveMetric] = useState<MetricKey>(null);

  const descriptions = metricDescriptions(m);
  const ledgerStats = buildLedgerStats(m);
  const displayItems = activeMetric ? descriptions[activeMetric] : null;

  return (
    <section id="about" className="py-28 px-8 md:px-16 bg-card relative overflow-hidden">
      {/* N° watermark */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 font-display text-[340px] font-black text-foreground/[0.025] dark:text-[hsl(var(--nav-text)/0.02)] leading-[1] tracking-[-10px] pointer-events-none select-none">
        N°
      </div>

      <div className="max-w-[1200px] mx-auto relative z-[1]">
        <ScrollReveal>
          <div className="flex items-baseline gap-5 mb-14">
            <p className="font-body text-[10px] font-bold tracking-[4px] uppercase text-primary whitespace-nowrap">
              Measured Results
            </p>
            <h2 className="font-display text-[38px] md:text-[52px] font-normal italic text-foreground tracking-[-0.5px]">
              What This Looks Like in Practice
            </h2>
          </div>
        </ScrollReveal>

        <div onMouseLeave={() => setActiveMetric(null)}>
          {/* Double-rule top border */}
          <div className="relative mb-0">
            <div className="h-[3px] bg-foreground" />
            <div className="h-px bg-primary opacity-40 mt-1" style={{ marginTop: '4px' }} />
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 border-b border-border">
            {ledgerStats.map((stat, idx) => (
              <div
                key={idx}
                className={`py-10 px-5 cursor-default transition-colors duration-200 relative group ${
                  idx < ledgerStats.length - 1 ? "border-r border-border" : ""
                } ${stat.highlight ? "bg-[hsl(var(--teal-pale))]" : ""} ${
                  activeMetric === stat.key && !stat.highlight ? "bg-card/60" : ""
                }`}
                onMouseEnter={() => setActiveMetric(stat.key)}
                style={activeMetric === stat.key ? { backgroundColor: 'hsl(var(--teal-pale))' } : undefined}
              >
                <div className="mb-3">
                  <span className="font-display text-[48px] md:text-[56px] font-bold text-foreground leading-[1] tracking-[-2px]">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="font-display text-[24px] md:text-[28px] text-muted-foreground ml-0.5">
                      {stat.unit}
                    </span>
                  )}
                </div>
                <p className="font-body text-[9px] md:text-[10px] font-bold tracking-[2px] uppercase text-muted-foreground leading-[1.6] whitespace-pre-line">
                  {stat.label}
                </p>
                {stat.highlight && (
                  <div className="h-[3px] bg-accent-warm mt-4 w-full" />
                )}
                {/* Mustard bar on hover — animates from 0 to 100% */}
                <div className="absolute bottom-0 left-0 h-[3px] bg-accent-warm w-0 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Hover Detail Area */}
          <div className="mt-8 min-h-[5.5rem] md:min-h-[5rem]">
            <div key={activeMetric || "default"} className="animate-fade-in">
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
            {activeMetric && (
              <button
                className="shrink-0 inline-flex items-center gap-2 text-xs font-body text-accent-warm hover:text-accent-warm/80 transition-colors duration-200 border border-accent-warm/30 px-4 py-2 hover:bg-accent-warm/5 animate-fade-in mt-4"
                onClick={() => {
                  const deepDivePrompts: Record<Exclude<MetricKey, null>, string> = {
                    velocity: `Tell me about the multi-agent Chain of Thought workflow you use for ${m?.about_velocity_time_to_draft ?? 2}x faster story drafting.`,
                    precision: `How do your Edge-Case Agent and Consistency Agent achieve ${m?.about_precision_requirement ?? 95}% requirement precision?`,
                    culture: `Explain how automating PO overhead drives ${m?.about_culture_satisfaction ?? 80}% higher team satisfaction.`,
                  };
                  window.dispatchEvent(new CustomEvent("open-chat", { detail: activeMetric ? deepDivePrompts[activeMetric] : "" }));
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Deep Dive with AI
              </button>
            )}
          </div>

          <p className="font-display text-[14px] italic text-muted-foreground mt-6 border-t border-border pt-5">
            Numbers drawn from a real 6-week sprint cycle — Manufactured Home Registry Self Serve feature.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
      </div>
    </section>
  );
};

export default AboutSection;
