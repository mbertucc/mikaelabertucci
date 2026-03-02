import { useEffect, useRef, useState, useCallback } from "react";
import { Clock, TrendingUp, FileCheck, Brain } from "lucide-react";

const useCountUp = (end: number, duration: number, start: boolean, decimals = 0) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration, decimals]);
  return value;
};

const CountUpValue = ({ end, duration, visible, decimals = 0 }: { end: number; duration: number; visible: boolean; decimals?: number }) => {
  const value = useCountUp(end, duration, visible, decimals);
  return <>{value}</>;
};

interface MetricCard {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  accentClass: string;
}

const metrics: MetricCard[] = [
  {
    icon: <Clock className="w-6 h-6" />,
    value: 19.4,
    suffix: " hrs / week",
    label: "Time Reclaimed",
    sublabel: "Redirected to strategy, vision & stakeholder work",
    accentClass: "text-primary",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: 233,
    suffix: "+ hrs",
    label: "Quarterly Strategic Capacity",
    sublabel: "Gained back every quarter for high-value decisions",
    accentClass: "text-amber-warm",
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    value: 35,
    suffix: "%",
    label: "Quality Lift",
    sublabel: "Clearer, more complete documentation output",
    accentClass: "text-primary",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    value: 50,
    suffix: "%",
    label: "Cognitive Shift",
    sublabel: "Reduction in routine mental load (40–60% range)",
    accentClass: "text-amber-warm",
  },
];

const ImpactDashboard = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-28 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-3">
            Measured Outcomes
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            The Impact of Intent Architecting
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl">
            Quantified results from embedding AI into the product ownership workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`glass-card-hover p-6 flex flex-col items-start gap-4 transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className={`${m.accentClass} p-2.5 rounded-lg bg-card border border-border/40`}>
                {m.icon}
              </div>

              <div>
                <p className={`text-3xl font-display ${m.accentClass} leading-none`}>
                  <CountUpValue end={m.value} duration={1800} visible={visible} decimals={m.value % 1 !== 0 ? 1 : 0} />
                  <span className="text-lg font-body font-semibold ml-0.5">
                    {m.suffix}
                  </span>
                </p>
                <p className="text-sm font-body font-semibold text-foreground mt-2">
                  {m.label}
                </p>
                <p className="text-xs font-body text-muted-foreground mt-1 leading-relaxed">
                  {m.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactDashboard;
