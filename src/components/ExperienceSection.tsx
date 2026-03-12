import { useState } from "react";
import { Building2, ChevronDown, History, MessageSquare } from "lucide-react";
import { useExperiences } from "@/hooks/usePortfolioData";
import ScrollReveal from "@/components/ScrollReveal";

const EARLIER_CAREER_CUTOFF = 5;
const ALWAYS_SHOW_IDS = ["64a6c882-9026-4cf9-b638-f5b5b3f0d063"];

const renderBulletText = (text: string) => {
  const parts = text.split(/(\$?\d[\d,.]*%\s*(?:hours?|hrs?|days?|weeks?|months?|products?|ministries|clients|sprints?|stories|municipalities|years?)?)/gi);
  return parts.map((part, i) => {
    if (/^\$?\d[\d,.]*%\s*(?:hours?|hrs?|days?|weeks?|months?|products?|ministries|clients|sprints?|stories|municipalities|years?)?$/i.test(part)) {
      return (
        <span key={i} className="font-mono text-foreground font-medium tracking-tight">
          {part}
        </span>
      );
    }
    return part;
  });
};

const PRIMARY_SECTIONS = [
  { key: "ai_situation", label: "Challenge" },
  { key: "achievements", label: "Outcome" },
] as const;

const DETAIL_SECTIONS = [
  { key: "ai_approach", label: "Approach" },
  { key: "ai_technical_work", label: "Technical Work" },
  { key: "ai_lessons_learned", label: "Lessons Learned" },
] as const;

const ExperienceSection = () => {
  const [showEarlierCareer, setShowEarlierCareer] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { data: experiences, isLoading } = useExperiences();

  if (isLoading) return null;

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAskAI = (role: { title_progression: string; company: string }) => {
    window.dispatchEvent(
      new CustomEvent("open-chat", {
        detail: `Tell me more about Mikaela's experience as ${role.title_progression} at ${role.company}. What was the impact and what skills were demonstrated?`,
      })
    );
  };

  const parseCompany = (company: string) => {
    const parts = company.split(" — ");
    if (parts.length >= 2) {
      return { org: parts[0].trim(), project: parts.slice(1).join(" — ").trim() };
    }
    return { org: company, project: null };
  };

  const recentRoles = (experiences || []).filter(
    (r) => r.sort_order < EARLIER_CAREER_CUTOFF || ALWAYS_SHOW_IDS.includes(r.id)
  );
  const earlierRoles = (experiences || []).filter(
    (r) => r.sort_order >= EARLIER_CAREER_CUTOFF && !ALWAYS_SHOW_IDS.includes(r.id)
  );

  const renderSections = (sections: readonly { key: string; label: string }[], role: any) => (
    <>
      {sections.map(({ key, label }) => {
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
    </>
  );

  const isExpanded = (id: string) => expandedCards.has(id);

  const renderCard = (role: typeof recentRoles[number], index: number, isGovRole = false) => (
    <ScrollReveal key={role.id} delay={index * 0.1}>
      <article className="relative pl-6 md:pl-8 group">
        {/* Agentic left accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40 group-hover:bg-primary/50 transition-colors duration-500" />
        <div className="absolute left-[-2.5px] top-6 w-[6px] h-[6px] rounded-full bg-primary/60 group-hover:bg-primary transition-colors duration-300" />

        <div className="glass-card p-6 md:p-8 space-y-5">
          {/* Header */}
          <header className="space-y-1.5">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
              <h3 className="text-lg md:text-xl font-display font-semibold text-foreground tracking-[0.03em]">
                {isGovRole ? (parseCompany(role.company).project || role.title_progression) : role.title_progression}
              </h3>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleAskAI(role)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-body font-medium text-primary/70 hover:text-primary transition-colors"
                  aria-label={`Ask AI about ${role.title_progression}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ask AI
                </button>
                <span className="text-xs font-mono text-muted-foreground tracking-wide">
                  {role.date_range}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              {isGovRole
                ? role.title_progression
                : role.company}
            </p>
          </header>

          {/* Primary sections (always visible) */}
          <div className="space-y-4 pt-1">
            {renderSections(PRIMARY_SECTIONS, role)}
          </div>

          {/* Detail sections (collapsible) */}
          {DETAIL_SECTIONS.some(({ key }) => role[key]) && (
            <>
              {isExpanded(role.id) && (
                <div className="space-y-4 animate-fade-in">
                  {renderSections(DETAIL_SECTIONS, role)}
                </div>
              )}
              <button
                onClick={() => toggleCard(role.id)}
                className="flex items-center gap-1.5 text-xs font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded(role.id) ? "Hide Details" : "Show Details"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded(role.id) ? "rotate-180" : ""}`} />
              </button>
            </>
          )}
        </div>
      </article>
    </ScrollReveal>
  );

  return (
    <section id="experience" className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-3">
              Where I've Been
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-2">
              Experience
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-xl">
              Every role here delivered measurable results.
            </p>
          </div>
        </ScrollReveal>

        {/* BC Provincial Government Project Portfolio */}
        <ScrollReveal>
          <div className="relative border border-border/30 rounded-2xl p-6 md:p-8 bg-muted/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-primary/70" />
                <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground">
                  BC Provincial Government
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground tracking-wide">
                2018 – Present
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-8 max-w-xl">
              Seven years delivering digital products across multiple ministries and programs.
            </p>

            <div className="space-y-8">
              {recentRoles.map((role, i) => renderCard(role, i, true))}
            </div>
          </div>
        </ScrollReveal>

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
              <div className="space-y-8 mt-8">
                {earlierRoles.map((role, i) => renderCard(role, i))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
