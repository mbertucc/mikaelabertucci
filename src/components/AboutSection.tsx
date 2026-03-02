import { useState } from "react";
import { Zap, Target, Users, Sparkles } from "lucide-react";
import headshot from "@/assets/headshot.png";
import { useProfile } from "@/hooks/usePortfolioData";
import StatRing from "@/components/StatRing";

type MetricKey = "velocity" | "precision" | "culture" | null;

const metricDescriptions: Record<Exclude<MetricKey, null>, string> = {
  velocity:
    "To achieve 3x faster time-to-draft, I utilize a multi-stage Product Owner Agent with a 'Chain of Thought' workflow. The Discovery stage scans raw meeting transcripts, legislation, and policy manuals to extract core requirements. The Story Architect stage maps those into standardized Gherkin format. The Reviewer stage validates against our Definition of Ready before I ever see it — meaning stories arrive 90% complete, so I focus on the 10% requiring human intuition.",
  precision:
    "Hitting 95% Requirement Precision is about pre-emptive problem solving. The Edge-Case Agent hunts for 'what-if' scenarios that cause mid-sprint pivots. The Consistency Agent ensures no new requirement contradicts a previous story. The result is a 75% increase in accuracy, virtually eliminating the clarification loops that traditionally slow down development.",
  culture:
    "80% Higher Team Satisfaction is a direct result of clarity. Stories delivered with 95% precision mean developers code instead of chasing missing details. 20 hours of automated PO overhead gets reinvested into unblocking the team. Sprint planning is 50% faster because the Context Engineering ensures every item is truly Ready — creating a thrive culture led by vision, not bottlenecks.",
};

const metricLabels: Record<Exclude<MetricKey, null>, string> = {
  velocity: "Velocity",
  precision: "Precision",
  culture: "Culture",
};

const defaultText =
  "Hover over a metric to see how an Agentic Product Owner drives these results.";

const AboutSection = () => {
  const { data: profile } = useProfile();
  const [activeMetric, setActiveMetric] = useState<MetricKey>(null);

  const displayText = activeMetric ? metricDescriptions[activeMetric] : defaultText;

  return (
    <section id="about" className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 md:p-12 space-y-8">
          {/* Top: Headshot + Bio */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            <div className="shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                <img
                  src={headshot}
                  alt={`${profile?.full_name || "Mikaela Bertucci"} — professional headshot`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <p className="text-base text-muted-foreground font-body leading-relaxed max-w-xl">
                {profile?.positioning ||
                  "As an Agentic Product Owner, I don't just manage a backlog; I orchestrate an AI-augmented ecosystem. By automating the tactical overhead—achieving 3x faster story drafts and 95% requirement precision—I reclaim the space to lead. This means I spend my time where it counts: setting vision, solving real problems, and building teams that don't just deliver—they thrive."}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/30" />

          {/* Bottom: Impact Dashboard */}
          <div className="py-1" onMouseLeave={() => setActiveMetric(null)}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body mb-6 text-left">
              AI-Augmented Impact Dashboard
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {/* Velocity */}
              <div
                className="text-center space-y-3 cursor-pointer group"
                onMouseEnter={() => setActiveMetric("velocity")}
              >
                <div className={`flex items-center justify-center gap-1.5 mb-1 transition-colors duration-200 ${activeMetric === "velocity" ? "text-primary" : ""}`}>
                  <Zap className={`w-4 h-4 transition-transform duration-200 ${activeMetric === "velocity" ? "text-primary scale-125" : "text-primary"}`} />
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-body transition-colors duration-200 ${activeMetric === "velocity" ? "text-primary" : "text-muted-foreground"}`}>Velocity</p>
                </div>
                <StatRing value={3} max={5} label="Faster Time-to-Draft" unit="x" size={90} hideRing />
                <StatRing value={50} max={100} label="Faster Planning" unit="%" size={90} hideRing />
              </div>

              {/* Precision */}
              <div
                className="text-center space-y-3 cursor-pointer group"
                onMouseEnter={() => setActiveMetric("precision")}
              >
                <div className={`flex items-center justify-center gap-1.5 mb-1 transition-colors duration-200 ${activeMetric === "precision" ? "text-primary" : ""}`}>
                  <Target className={`w-4 h-4 transition-transform duration-200 ${activeMetric === "precision" ? "text-primary scale-125" : "text-primary"}`} />
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-body transition-colors duration-200 ${activeMetric === "precision" ? "text-primary" : "text-muted-foreground"}`}>Precision</p>
                </div>
                <StatRing value={95} max={100} label="Requirement Precision" unit="%" size={90} hideRing />
                <StatRing value={75} max={100} label="Increase in Accuracy" unit="%" size={90} hideRing />
              </div>

              {/* Culture */}
              <div
                className="text-center space-y-3 col-span-2 md:col-span-1 cursor-pointer group"
                onMouseEnter={() => setActiveMetric("culture")}
              >
                <div className={`flex items-center justify-center gap-1.5 mb-1 transition-colors duration-200 ${activeMetric === "culture" ? "text-primary" : ""}`}>
                  <Users className={`w-4 h-4 transition-transform duration-200 ${activeMetric === "culture" ? "text-primary scale-125" : "text-primary"}`} />
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-body transition-colors duration-200 ${activeMetric === "culture" ? "text-primary" : "text-muted-foreground"}`}>Culture</p>
                </div>
                <StatRing value={80} max={100} label="Higher Team Satisfaction" unit="%" size={90} hideRing />
                <StatRing value={40} max={100} label="More Strategy Time" unit="%" size={90} hideRing />
              </div>
            </div>

            {/* Hover Detail Area */}
            <div className="mt-6 border-t border-border/20 pt-5">
              <div className="min-h-[3.5rem] flex items-start gap-3">
                <div className="flex-1 relative">
                  <p
                    key={activeMetric || "default"}
                    className="text-sm text-muted-foreground font-body leading-relaxed animate-fade-in"
                  >
                    {activeMetric && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-body font-medium mr-2">
                        {metricLabels[activeMetric]} ›
                      </span>
                    )}
                    {displayText}
                  </p>
                </div>
                {activeMetric && (
                  <button
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-body text-primary hover:text-primary/80 transition-colors duration-200 border border-primary/20 rounded-full px-3 py-1.5 hover:bg-primary/5 animate-fade-in"
                    onClick={() => {
                      const deepDivePrompts: Record<Exclude<MetricKey, null>, string> = {
                        velocity: "Tell me about the multi-agent Chain of Thought workflow you use for 3x faster story drafting — specifically the Discovery Agent, Story Architect, and Reviewer Agent.",
                        precision: "How do your Edge-Case Agent and Consistency Agent achieve 95% requirement precision and eliminate clarification loops?",
                        culture: "Explain how automating PO overhead drives 80% higher team satisfaction and creates a 'thrive' culture.",
                      };
                      const event = new CustomEvent("open-chat", {
                        detail: activeMetric ? deepDivePrompts[activeMetric] : "",
                      });
                      window.dispatchEvent(event);
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Deep Dive with AI
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;