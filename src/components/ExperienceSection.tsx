import { useState } from "react";
import { Sparkles, ChevronDown, TrendingUp, Clock, Target } from "lucide-react";
import { useExperiences } from "@/hooks/usePortfolioData";

// Mini horizontal bar for visual interest
const MiniBar = ({ value, max, colorClass = "bg-primary" }: { value: number; max: number; colorClass?: string }) => (
  <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden">
    <div
      className={`h-full rounded-full ${colorClass} transition-all duration-700`}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

const ExperienceSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { data: experiences, isLoading } = useExperiences();

  if (isLoading) return null;

  // Assign visual metrics per role index (fallback data for visual richness)
  const roleMetrics = [
    { impact: 90, efficiency: 85, scope: 95, impactLabel: "Strategic Impact", effLabel: "Process Efficiency", scopeLabel: "Scope Breadth" },
    { impact: 80, efficiency: 90, scope: 75, impactLabel: "Strategic Impact", effLabel: "Process Efficiency", scopeLabel: "Scope Breadth" },
    { impact: 75, efficiency: 70, scope: 80, impactLabel: "Strategic Impact", effLabel: "Process Efficiency", scopeLabel: "Scope Breadth" },
    { impact: 70, efficiency: 65, scope: 70, impactLabel: "Strategic Impact", effLabel: "Process Efficiency", scopeLabel: "Scope Breadth" },
  ];

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-3">Career Timeline</p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Experience</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            Each role includes queryable AI context—the real story behind the bullet points.
          </p>
        </div>

        <div className="space-y-6">
          {(experiences || []).map((role, i) => {
            const isExpanded = expandedIndex === i;
            const metrics = roleMetrics[i] || roleMetrics[0];
            return (
              <div key={role.id} className="glass-card-hover p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: text content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-display text-foreground">{role.company}</h3>
                        <p className="text-sm text-primary font-body font-medium">{role.title_progression}</p>
                      </div>
                      <span className="text-sm text-muted-foreground font-body shrink-0 font-mono">{role.date_range}</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {(role.achievements || []).map((a: string, j: number) => (
                        <li key={j} className="text-sm text-muted-foreground font-body flex items-start gap-2">
                          <span className="text-primary mt-1 shrink-0">▸</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: visual metrics sidebar */}
                  <div className="lg:w-48 shrink-0 glass-card p-4 space-y-4 self-start">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-body">Role Metrics</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground font-body flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-primary" /> {metrics.impactLabel}
                          </span>
                          <span className="text-[10px] font-mono text-foreground">{metrics.impact}%</span>
                        </div>
                        <MiniBar value={metrics.impact} max={100} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground font-body flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[hsl(var(--amber-warm))]" /> {metrics.effLabel}
                          </span>
                          <span className="text-[10px] font-mono text-foreground">{metrics.efficiency}%</span>
                        </div>
                        <MiniBar value={metrics.efficiency} max={100} colorClass="bg-[hsl(var(--amber-warm))]" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground font-body flex items-center gap-1">
                            <Target className="w-3 h-3 text-[hsl(var(--teal))]" /> {metrics.scopeLabel}
                          </span>
                          <span className="text-[10px] font-mono text-foreground">{metrics.scope}%</span>
                        </div>
                        <MiniBar value={metrics.scope} max={100} colorClass="bg-[hsl(var(--teal))]" />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="flex items-center gap-2 text-sm font-body text-primary/80 hover:text-primary transition-colors mt-4"
                >
                  <Sparkles className="w-4 h-4" />
                  {isExpanded ? "Hide AI Context" : "Show AI Context"}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="mt-6 p-6 bg-background/60 rounded-lg border border-border/30 space-y-5 animate-fade-in">
                    {([
                      ["SITUATION", role.ai_situation],
                      ["APPROACH", role.ai_approach],
                      ["TECHNICAL WORK", role.ai_technical_work],
                      ["LESSONS LEARNED", role.ai_lessons_learned],
                    ] as const).map(([label, text]) => (
                      <div key={label}>
                        <p className="text-xs tracking-[0.2em] uppercase text-primary/70 font-body mb-1.5">{label}</p>
                        <p className={`text-sm text-muted-foreground font-body leading-relaxed ${label === "LESSONS LEARNED" ? "italic" : ""}`}>
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
