import { useState } from "react";
import { Sparkles, ChevronDown, MessageSquare, History } from "lucide-react";
import { useExperiences } from "@/hooks/usePortfolioData";

interface ExperienceSectionProps {
  onQueryRole?: (question: string) => void;
}

const EARLIER_CAREER_CUTOFF = 7; // sort_order >= 7 are collapsed

const ExperienceSection = ({ onQueryRole }: ExperienceSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showEarlierCareer, setShowEarlierCareer] = useState(false);
  const { data: experiences, isLoading } = useExperiences();

  if (isLoading) return null;

  const recentRoles = (experiences || []).filter((r) => r.sort_order < EARLIER_CAREER_CUTOFF);
  const earlierRoles = (experiences || []).filter((r) => r.sort_order >= EARLIER_CAREER_CUTOFF);

  const renderCard = (role: typeof recentRoles[number], i: number) => {
    const isExpanded = expandedIndex === i;
    return (
      <div key={role.id} className="glass-card-hover p-6 md:p-8 flex flex-col">
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

        <button
          onClick={() => setExpandedIndex(isExpanded ? null : i)}
          className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Sparkles className="w-4 h-4" />
          {isExpanded ? "Hide AI Context" : "Show AI Context"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        {isExpanded && (
          <div className="mb-4 p-6 bg-background/60 rounded-lg border border-border/30 space-y-5 animate-fade-in">
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

        {onQueryRole && (
          <div className="mt-auto pt-4 border-t border-border/30">
            <button
              onClick={() => onQueryRole(`Tell me about Mikaela's experience at ${role.company} as ${role.title_progression}. What did she accomplish and what was her approach?`)}
              className="flex items-center gap-2 text-sm font-body font-medium text-primary-foreground bg-primary px-4 py-2.5 rounded-lg hover:brightness-110 transition-all glow-primary"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI About This Role
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-3">Career Timeline</p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Experience</h2>
        </div>

        <div className="space-y-6">
          {recentRoles.map((role, i) => renderCard(role, i))}
        </div>

        {earlierRoles.length > 0 && (
          <div className="mt-10">
            <button
              onClick={() => setShowEarlierCareer(!showEarlierCareer)}
              className="flex items-center gap-2.5 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <History className="w-4 h-4" />
              {showEarlierCareer ? "Hide Earlier Career" : `Show Earlier Career (${earlierRoles.length} roles)`}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showEarlierCareer ? "rotate-180" : ""}`} />
            </button>

            {showEarlierCareer && (
              <div className="space-y-6 mt-6 animate-fade-in">
                {earlierRoles.map((role, i) => renderCard(role, recentRoles.length + i))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
