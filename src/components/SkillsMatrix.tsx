import { Check, Circle, X, TrendingUp } from "lucide-react";
import { useSkills } from "@/hooks/usePortfolioData";

const categoryConfig = {
  strong: {
    title: "Strong",
    icon: <Check className="w-4 h-4" />,
    colorClass: "text-primary border-primary/30",
    iconBg: "bg-primary/10",
    barColor: "bg-primary",
    level: 90,
  },
  moderate: {
    title: "Moderate",
    icon: <Circle className="w-4 h-4" />,
    colorClass: "text-muted-foreground border-border",
    iconBg: "bg-muted",
    barColor: "bg-[hsl(var(--amber-warm))]",
    level: 55,
  },
  gap: {
    title: "Gaps",
    icon: <X className="w-4 h-4" />,
    colorClass: "text-accent-foreground border-accent/30",
    iconBg: "bg-accent/10",
    barColor: "bg-muted",
    level: 20,
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
    <section className="py-28 px-6 bg-card/30">
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
              <div key={cat} className={`glass-card p-6 border ${config.colorClass}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center ${config.colorClass}`}>
                    {config.icon}
                  </div>
                  <h3 className="font-display text-lg text-foreground">{config.title}</h3>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">{grouped[cat].length} skills</span>
                </div>
                <ul className="space-y-4">
                  {grouped[cat].map((skill, i) => {
                    // Vary the bar width slightly per skill for visual interest
                    const barValue = config.level + (i % 3) * 3 - 3;
                    return (
                      <li key={skill.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground font-body">{skill.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{Math.min(barValue, 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${config.barColor} transition-all duration-700`}
                            style={{ width: `${Math.min(barValue, 100)}%` }}
                          />
                        </div>
                        {skill.note && (
                          <p className="mt-1 text-[10px] text-primary/70 italic leading-relaxed font-body">
                            💡 {skill.note}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsMatrix;
