import { useState } from "react";
import { Building2, ChevronDown, History, MessageSquare } from "lucide-react";
import { useExperiences } from "@/hooks/usePortfolioData";
import ScrollReveal from "@/components/ScrollReveal";

const EARLIER_CAREER_CUTOFF = 5;
const ALWAYS_SHOW_IDS = ["64a6c882-9026-4cf9-b638-f5b5b3f0d063"];

const renderBulletText = (text: string) => {
  // First strip markdown bold markers, then highlight metrics
  const cleaned = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  const parts = cleaned.split(/(\$?\d[\d,.]*%?\s*(?:hours?|hrs?|days?|weeks?|months?|products?|ministries|clients|sprints?|stories|municipalities|years?|million)?)/gi);
  return parts.map((part, i) => {
    if (/^\$?\d[\d,.]*%?\s*(?:hours?|hrs?|days?|weeks?|months?|products?|ministries|clients|sprints?|stories|municipalities|years?|million)?$/i.test(part)) {
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
        const value = (role as any)[key];
        if (!value || (Array.isArray(value) && value.length === 0)) return null;

        return (
          <div key={key}>
            <p className="font-body text-[10px] font-bold tracking-[3px] uppercase text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal))] mt-5 mb-2">
              {label}
            </p>

            {key === "achievements" ? (
              <ul className="list-none space-y-2.5">
                {(value as string[]).map((a, j) => (
                  <li key={j} className="font-body text-[14px] font-light text-muted-foreground leading-[1.85] pl-6 relative">
                    <span className="absolute left-0 top-[10px] w-1.5 h-1.5 bg-[hsl(var(--mustard))] rotate-45 opacity-80" style={{
                      boxShadow: 'var(--mustard-bullet-shadow, none)',
                    }} />
                    {renderBulletText(a)}
                  </li>
                ))}
              </ul>
            ) : key === "ai_situation" ? (
              <p className="font-display text-[15px] italic text-muted-foreground leading-[1.8]">
                {renderBulletText(value as string)}
              </p>
            ) : key === "ai_lessons_learned" ? (
              <p className="font-display text-[15px] italic text-muted-foreground leading-[1.8]">
                {renderBulletText(value as string)}
              </p>
            ) : (
              <p className="font-body text-[14px] font-light text-muted-foreground leading-[1.85]">
                {renderBulletText(value as string)}
              </p>
            )}
          </div>
        );
      })}
    </>
  );

  const isExpanded = (id: string) => expandedCards.has(id);

  const isPlainDescription = (role: typeof recentRoles[number]) => {
    const hasAchievements = role.achievements && role.achievements.length > 0;
    const hasDetails = DETAIL_SECTIONS.some(({ key }) => role[key as keyof typeof role]);
    return !hasAchievements && !hasDetails && !!role.ai_situation;
  };

  const renderCard = (role: typeof recentRoles[number], index: number, isGovRole = false) => (
    <ScrollReveal key={role.id} delay={index * 0.06}>
      <article className="grid md:grid-cols-[220px_1px_1fr] gap-0 mb-14 pb-14 border-b border-border last:border-b-0 last:mb-0">
        {/* Sidebar — dates, org, tag */}
        <div className="pr-9 mb-4 md:mb-0">
          <p className="font-body text-[10px] font-bold tracking-[2px] uppercase text-[hsl(var(--teal))] dark:text-[hsl(var(--teal-lt))] mb-2">
            {role.date_range}
          </p>
          <p className="font-display text-[16px] italic text-muted-foreground leading-[1.45] mb-4">
            {isGovRole ? (parseCompany(role.company).org || role.company) : role.company}
          </p>
          {index === 0 && (
            <span className="inline-block font-body text-[8px] font-bold tracking-[2px] uppercase bg-[hsl(var(--teal))] dark:bg-[hsl(var(--teal-dk))] dark:border dark:border-[hsl(var(--teal)/0.3)] text-[hsl(var(--nav-text))] px-2.5 py-0.5">
              Current
            </span>
          )}
        </div>

        {/* Column rule */}
        <div className="hidden md:block bg-border mx-10 self-stretch" />

        {/* Main content */}
        <div>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4 mb-4">
            <h3 className="font-display text-[24px] font-bold text-foreground leading-[1.2]">
              {isGovRole ? (parseCompany(role.company).project || role.title_progression) : role.title_progression}
            </h3>
            <button
              onClick={() => handleAskAI(role)}
              className="inline-flex items-center gap-1.5 text-[12px] font-body font-medium text-primary/70 hover:text-primary transition-colors shrink-0"
              aria-label={`Ask AI about ${role.title_progression}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask AI
            </button>
          </div>

          {isPlainDescription(role) ? (
            <p className="font-body text-[14px] font-light text-muted-foreground leading-[1.85]">
              {role.ai_situation}
            </p>
          ) : (
            <>
              {renderSections(PRIMARY_SECTIONS, role)}

              {DETAIL_SECTIONS.some(({ key }) => role[key as keyof typeof role]) && (
                <>
                  {isExpanded(role.id) && (
                    <div className="animate-fade-in">
                      {renderSections(DETAIL_SECTIONS, role)}
                    </div>
                  )}
                  <button
                    onClick={() => toggleCard(role.id)}
                    className="flex items-center gap-1.5 text-[13px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors mt-5"
                  >
                    {isExpanded(role.id) ? "Hide Details" : "Show Details"}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded(role.id) ? "rotate-180" : ""}`} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </article>
    </ScrollReveal>
  );

  return (
    <section id="experience" className="py-28 px-8 md:px-16 bg-popover relative overflow-hidden">
      {/* Teal side accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] md:w-[6px] bg-[hsl(var(--teal))]" style={{
        boxShadow: 'var(--teal-side-shadow, none)',
      }} />

      {/* Dark mode: ambient glow */}
      <div className="hidden dark:block absolute -bottom-[100px] -right-[100px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, hsl(var(--teal) / 0.04) 0%, transparent 70%)',
        animation: 'glowPulse 12s ease-in-out infinite',
      }} />

      <div className="max-w-[1200px] mx-auto relative z-[1]">
        <ScrollReveal>
          {/* Header — double-ruled */}
          <div className="flex items-baseline gap-5 mb-14 border-b-[3px] dark:border-b-[2px] border-foreground dark:border-[hsl(var(--nav-text)/0.2)] pb-5 relative">
            <div className="absolute -bottom-[5px] dark:-bottom-[4px] left-0 w-full h-px bg-[hsl(var(--teal))] opacity-35 dark:opacity-25" />
            <p className="font-body text-[10px] font-bold tracking-[4px] uppercase text-[hsl(var(--teal))] dark:text-[hsl(var(--teal-lt))] whitespace-nowrap">
              Where I've Been
            </p>
            <h2 className="font-display text-[38px] md:text-[48px] font-normal italic text-foreground tracking-[-0.5px]">
              Experience & Impact
            </h2>
          </div>
        </ScrollReveal>

        {/* BC Provincial Government wrapper */}
        <ScrollReveal>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-primary/70" />
                <h3 className="font-display text-[24px] md:text-[30px] text-foreground">
                  BC Provincial Government
                </h3>
              </div>
              <span className="font-body text-[10px] font-bold tracking-[2px] uppercase text-muted-foreground">
                2018 – Present
              </span>
            </div>
            <p className="font-body text-[14px] font-light text-muted-foreground leading-[1.85] mb-14 max-w-xl">
              Seven years delivering digital products across multiple ministries and programs.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-0">
          {recentRoles.map((role, i) => renderCard(role, i, true))}
        </div>

        {earlierRoles.length > 0 && (
          <div className="mt-14">
            <button
              onClick={() => setShowEarlierCareer(!showEarlierCareer)}
              className="flex items-center gap-2.5 text-[14px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <History className="w-4 h-4" />
              {showEarlierCareer ? "Hide Earlier Career" : `Earlier Career · ${earlierRoles.length} roles`}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showEarlierCareer ? "rotate-180" : ""}`} />
            </button>

            {showEarlierCareer && (
              <div className="mt-10 space-y-0">
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
