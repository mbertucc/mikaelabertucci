import { Check, Circle, X } from "lucide-react";
import { useSkills } from "@/hooks/usePortfolioData";

const categoryConfig = {
  strong: {
    title: "Strong",
    icon: <Check className="w-4 h-4" />,
    colorClass: "text-primary border-primary/30",
    iconBg: "bg-primary/10",
  },
  moderate: {
    title: "Moderate",
    icon: <Circle className="w-4 h-4" />,
    colorClass: "text-muted-foreground border-border",
    iconBg: "bg-muted",
  },
  gap: {
    title: "Gaps",
    icon: <X className="w-4 h-4" />,
    colorClass: "text-accent border-accent/30",
    iconBg: "bg-accent/10",
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
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
                </div>
                <ul className="space-y-3">
                  {grouped[cat].map((skill) => (
                    <li key={skill.id} className="text-sm text-muted-foreground font-body">
                      {skill.name}
                      {skill.note && (
                        <p className="mt-1 text-xs text-primary/70 italic leading-relaxed">
                          💡 {skill.note}
                        </p>
                      )}
                    </li>
                  ))}
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
