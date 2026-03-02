import { useState, useEffect, useRef } from "react";
import { Clock, RefreshCw, FileText, Bot } from "lucide-react";

type MetricKey = "hours" | "loops" | "pages" | "agents" | null;

const metrics = [
  { key: "hours" as const, icon: Clock, value: 20, unit: "h", label: "Saved Weekly", accent: "text-primary", bg: "bg-primary/10" },
  { key: "loops" as const, icon: RefreshCw, value: 90, unit: "%", label: "Fewer Clarification Loops", accent: "text-primary", bg: "bg-primary/10" },
  { key: "pages" as const, icon: FileText, value: 2000, unit: "+", label: "Pages Analyzed", accent: "text-primary", bg: "bg-primary/10" },
  { key: "agents" as const, icon: Bot, value: 16, unit: "", label: "AI Agents Built", accent: "text-primary", bg: "bg-primary/10" },
];

const descriptions: Record<Exclude<MetricKey, null>, string> = {
  hours: "20 hours are reclaimed weekly by offloading administrative and tactical tasks to a network of 16 custom AI agents.",
  loops: "High-precision automated drafting eliminates the back-and-forth between product and engineering.",
  pages: "Agents have processed over 2,000 pages of technical specs and legislation to ensure data-grounded product decisions.",
  agents: "16 multilevel agents — one for each product — maintain high government privacy standards while hitting 10x productivity gains.",
};

const hoverLabels: Record<Exclude<MetricKey, null>, string> = {
  hours: "20h Saved Weekly",
  loops: "90% Fewer Clarification Loops",
  pages: "2000+ Pages Analyzed",
  agents: "16 AI Agents Built",
};

const useAnimatedNumber = (target: number, isVisible: boolean, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);
  return value;
};

const CoreEfficiencyDashboard = () => {
  const [activeMetric, setActiveMetric] = useState<MetricKey>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-8 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body mb-6 text-left">
            Core Efficiency Dashboard
          </p>

          <div className="py-1" onMouseLeave={() => setActiveMetric(null)}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {metrics.map((m) => {
                const Icon = m.icon;
                const animatedVal = useAnimatedNumber(m.value, visible);
                const isActive = activeMetric === m.key;
                return (
                  <div
                    key={m.key}
                    className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 rounded-lg p-4 ${isActive ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-primary/[0.02]"}`}
                    onMouseEnter={() => setActiveMetric(m.key)}
                  >
                    <Icon className={`w-8 h-8 transition-transform duration-200 ${isActive ? "text-primary scale-110" : "text-primary"}`} />
                    <div className="text-center mt-1">
                      <span className="font-display text-2xl text-foreground font-bold">
                        {animatedVal}{m.unit}
                      </span>
                    </div>
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-body text-center leading-tight transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Hover Detail Area */}
            <div className="mt-6 border-t border-border/20 pt-5 min-h-[3rem]">
              <p
                key={activeMetric || "default"}
                className="text-sm text-muted-foreground font-body leading-relaxed animate-fade-in"
              >
                {activeMetric ? (
                  <>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-body font-medium mr-2">
                      {hoverLabels[activeMetric]} ›
                    </span>
                    {descriptions[activeMetric]}
                  </>
                ) : (
                  "Hover over a metric to see how AI agents drive core efficiency across the portfolio."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreEfficiencyDashboard;