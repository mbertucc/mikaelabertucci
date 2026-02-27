import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { useExperiences } from "@/hooks/usePortfolioData";

const ExperienceSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { data: experiences, isLoading } = useExperiences();

  if (isLoading) return null;

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Experience</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            Each role includes queryable AI context—the real story behind the bullet points.
          </p>
        </div>

        <div className="space-y-6">
          {(experiences || []).map((role, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div key={role.id} className="glass-card-hover p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-display text-foreground">{role.company}</h3>
                    <p className="text-sm text-primary font-body font-medium">{role.title_progression}</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-body shrink-0">{role.date_range}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {(role.achievements || []).map((a: string, j: number) => (
                    <li key={j} className="text-sm text-muted-foreground font-body flex items-start gap-2">
                      <span className="text-primary mt-1 shrink-0">▸</span>
                      {a}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="flex items-center gap-2 text-sm font-body text-primary/80 hover:text-primary transition-colors"
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
