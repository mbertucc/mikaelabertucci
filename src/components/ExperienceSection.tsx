import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";

interface Role {
  company: string;
  dateRange: string;
  titleProgression: string;
  achievements: string[];
  aiContext: {
    situation: string;
    approach: string;
    technicalWork: string;
    lessonsLearned: string;
  };
}

const roles: Role[] = [
  {
    company: "Quantum Labs",
    dateRange: "2022 – Present",
    titleProgression: "Senior → Staff Engineer",
    achievements: [
      "Led migration of monolith to microservices, reducing deploy times by 73%",
      "Designed real-time data pipeline processing 2M+ events/day",
      "Mentored 6 engineers across 2 teams; 3 promoted within 18 months",
    ],
    aiContext: {
      situation: "Inherited a fragile monolith with 45-minute deploys and a team that had lost confidence in shipping.",
      approach: "Started with a strangler fig pattern rather than a big-bang rewrite. Built trust by shipping small wins weekly while laying the groundwork for the larger migration.",
      technicalWork: "Designed event-driven architecture using Kafka, implemented service mesh with Istio, built custom blue-green deployment pipeline. Introduced contract testing to prevent integration failures.",
      lessonsLearned: "The hardest part wasn't the technology — it was convincing the team that incremental progress was real progress. I learned that showing a working demo beats a perfect architecture doc every time.",
    },
  },
  {
    company: "TechFlow",
    dateRange: "2019 – 2022",
    titleProgression: "Engineer → Senior Engineer",
    achievements: [
      "Built payment processing system handling $50M+ ARR with 99.97% uptime",
      "Reduced API latency p99 from 800ms to 120ms through caching redesign",
      "Introduced observability stack that cut incident MTTR by 60%",
    ],
    aiContext: {
      situation: "Payment system was held together with duct tape. Every release was a prayer. PCI compliance was a constant worry.",
      approach: "Proposed and led a phased reliability initiative. Started with observability (you can't fix what you can't see), then tackled the hot paths.",
      technicalWork: "Implemented distributed tracing with OpenTelemetry, redesigned caching layer with Redis Cluster, built circuit breakers for third-party payment providers. Wrote runbooks that actually got used.",
      lessonsLearned: "Learned that 'move fast and break things' is a luxury you don't have with payments. Developed a deep appreciation for boring, reliable systems and the discipline it takes to build them.",
    },
  },
  {
    company: "Buildwise",
    dateRange: "2017 – 2019",
    titleProgression: "Junior → Mid-level Engineer",
    achievements: [
      "Shipped first production ML feature: recommendation engine improving engagement 34%",
      "Owned frontend-to-backend feature development for core product",
      "Built internal tooling that saved ops team 15 hours/week",
    ],
    aiContext: {
      situation: "Early-stage startup with a 5-person engineering team. Everyone wore multiple hats. Had to learn fast and ship faster.",
      approach: "Said yes to everything. Built features I'd never attempted before. Made mistakes, learned from them, and shipped anyway.",
      technicalWork: "Full-stack React/Node.js development, introduced TypeScript to the codebase, built a basic ML pipeline using scikit-learn for content recommendations, managed AWS infrastructure.",
      lessonsLearned: "This is where I learned that perfect is the enemy of shipped. Also learned that the best code is the code you don't have to maintain — simplicity wins in a small team.",
    },
  },
];

const ExperienceSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
          {roles.map((role, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div key={role.company} className="glass-card-hover p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-display text-foreground">{role.company}</h3>
                    <p className="text-sm text-primary font-body font-medium">{role.titleProgression}</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-body shrink-0">{role.dateRange}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {role.achievements.map((a, j) => (
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
                    {(
                      [
                        ["SITUATION", role.aiContext.situation],
                        ["APPROACH", role.aiContext.approach],
                        ["TECHNICAL WORK", role.aiContext.technicalWork],
                        ["LESSONS LEARNED", role.aiContext.lessonsLearned],
                      ] as const
                    ).map(([label, text]) => (
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
