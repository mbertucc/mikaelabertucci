import { useSkills } from "@/hooks/usePortfolioData";

const categoryConfig = {
  strong: {
    title: "Strong",
    borderClass: "border-primary/30",
    headerClass: "text-primary",
    tagClass: "bg-primary/10 text-primary border-primary/20",
    noteClass: "text-primary/70",
  },
  moderate: {
    title: "Working Knowledge",
    borderClass: "border-border",
    headerClass: "text-muted-foreground",
    tagClass: "bg-muted text-foreground border-border",
    noteClass: "text-muted-foreground",
  },
  gap: {
    title: "Learning",
    borderClass: "border-accent/30",
    headerClass: "text-accent-foreground",
    tagClass: "bg-accent/10 text-accent-foreground border-accent/20",
    noteClass: "text-accent-foreground/70",
  },
};

const SkillsMatrix = () => {
  const { data: skills, isLoading } = useSkills();

  if (isLoading) return null;

  const grouped = {
    strong: (skills || []).filter((s) => s.category === "strong"),
    moderate: (skills || []).filter((s) => s.category === "moderate"),
    gap: (skills || []).filter((s) => s.category === "gap"),
  };

  return (
    <section className="py-14 px-6 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-3">Capability Radar</p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Skills Matrix</h2>
          <p className="text-muted-foreground font-body text-lg">
            An honest snapshot—because knowing what I <em className="italic">don't</em> know matters too.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["strong", "moderate", "gap"] as const).map((cat) => {
            const config = categoryConfig[cat];
            return (
              <div key={cat} className={`glass-card p-6 border ${config.borderClass}`}>
                <h3 className={`font-display text-lg mb-5 ${config.headerClass}`}>{config.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {grouped[cat].map((skill) => (
                    <div key={skill.id} className="group relative">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-sm font-body border ${config.tagClass} transition-colors`}
                      >
                        {skill.name}
                      </span>
                      {skill.note && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-card border border-border text-[11px] text-muted-foreground font-body leading-relaxed whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg max-w-[240px] whitespace-normal">
                          💡 {skill.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsMatrix;
