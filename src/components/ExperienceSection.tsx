import { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import { useExperiences } from "@/hooks/usePortfolioData";

const EARLIER_CAREER_CUTOFF = 5;
const ALWAYS_SHOW_IDS = ["13d490f8-23d3-4091-9f0a-9774ccbfb350", "64a6c882-9026-4cf9-b638-f5b5b3f0d063"];

/** Wraps numbers/metrics in monospace spans */
const renderBulletText = (text: string) => {
  const parts = text.split(/(\$?\d[\d,.]*%?\s*(?:hours?|hrs?|days?|weeks?|months?|products?|ministries|clients|sprints?|stories|municipalities|years?)?)/gi);
  return parts.map((part, i) => {
    if (/^\$?\d[\d,.]*%?\s*(?:hours?|hrs?|days?|weeks?|months?|products?|ministries|clients|sprints?|stories|municipalities|years?)?$/i.test(part)) {
      return (
        <span key={i} className="font-mono text-foreground font-medium tracking-tight">
          {part}
        </span>
      );
    }
    return part;
  });
};

const SECTIONS = [
  { key: "ai_situation", label: "Challenge" },
  { key: "ai_approach", label: "Approach" },
  { key: "ai_technical_work", label: "Technical Work" },
  { key: "achievements", label: "Outcome" },
  { key: "ai_lessons_learned", label: "Lessons Learned" },
] as const;

const ExperienceSection = () => {
  const [showEarlierCareer, setShowEarlierCareer] = useState(false);
  const { data: experiences, isLoading } = useExperiences();

  if (isLoading) return null;

  const recentRoles = (experiences || []).filter(
    (r) => r.sort_order < EARLIER_CAREER_CUTOFF || ALWAYS_SHOW_IDS.includes(r.id)
  );
  const earlierRoles = (experiences || []).filter(
    (r) => r.sort_order >= EARLIER_CAREER_CUTOFF && !ALWAYS_SHOW_IDS.includes(r.id)
  );

  const renderCard = (role: typeof recentRoles[number]) => (
    <article key={role.id} className="relative pl-6 md:pl-8 group">
      {/* Agentic left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40 group-hover:bg-primary/50 transition-colors duration-500" />
      <div className="absolute left-[-2.5px] top-6 w-[6px] h-[6px] rounded-full bg-primary/60 group-hover:bg-primary transition-colors duration-300" />

      <div className="glass-card p-6 md:p-8 space-y-5">
        {/* Header */}
        <header className="space-y-1.5">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 className="text-lg md:text-xl font-display font-semibold text-foreground tracking-[0.03em]">
              {role.title_progression}
            </h3>
            <span className="text-xs font-mono text-muted-foreground shrink-0 tracking-wide">
              {role.date_range}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-body">{role.company}</p>
        </header>

        {/* All sections */}
        <div className="space-y-4 pt-1">
          {SECTIONS.map(({ key, label }) => {
            const value = role[key];
            if (!value || (Array.isArray(value) && value.length === 0)) return null;

            return (
              <div key={key}>
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary/60 font-body mb-1.5">
                  {label}
                </p>

                {key === "achievements" ? (
                  <div className="space-y-2">
                    {(value as string[]).map((a, j) => (
                      <div key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground font-body leading-relaxed">
                        <span className="text-primary/50 mt-0.5 shrink-0 text-xs">▪</span>
                        <span>{renderBulletText(a)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm text-muted-foreground font-body leading-relaxed ${
                    key === "ai_situation" ? "italic" : ""
                  } ${key === "ai_lessons_learned" ? "text-foreground/80" : ""}`}>
                    {renderBulletText(value as string)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );

  return (
    <section id="experience" className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-3">
            Strategic Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-2">
            Experience
          </h2>
          <p className="text-sm text-muted-foreground font-body max-w-xl">
            Roles defined by measurable impact, human-agent collaboration, and organizational transformation.
          </p>
        </div>

        <div className="space-y-8">
          {recentRoles.map((role) => renderCard(role))}
        </div>

        {earlierRoles.length > 0 && (
          <div className="mt-12">
            <button
              onClick={() => setShowEarlierCareer(!showEarlierCareer)}
              className="flex items-center gap-2.5 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <History className="w-4 h-4" />
              {showEarlierCareer ? "Hide Earlier Career" : `Earlier Career · ${earlierRoles.length} roles`}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showEarlierCareer ? "rotate-180" : ""}`} />
            </button>

            {showEarlierCareer && (
              <div className="space-y-8 mt-8 animate-fade-in">
                {earlierRoles.map((role) => renderCard(role))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
