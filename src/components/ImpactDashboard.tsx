import { useEffect, useRef, useState, useCallback } from "react";
import { Clock, TrendingUp, FileCheck, Brain, Scale, Zap, Target, Calendar } from "lucide-react";

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
    icon: <Clock className="w-7 h-7" strokeWidth={2.25} />,
    value: 19.4,
    suffix: " hrs / week",
    label: "Time Reclaimed",
    sublabel: "Redirected to strategy, vision & stakeholder work",
    accentClass: "text-primary",
  },
  {
    icon: <TrendingUp className="w-7 h-7" strokeWidth={2.25} />,
    value: 233,
    suffix: "+ hrs",
    label: "Quarterly Strategic Capacity",
    sublabel: "Gained back every quarter for high-value decisions",
    accentClass: "text-amber-warm",
  },
  {
    icon: <FileCheck className="w-7 h-7" strokeWidth={2.25} />,
    value: 35,
    suffix: "%",
    label: "Quality Lift",
    sublabel: "Clearer, more complete documentation output",
    accentClass: "text-primary",
  },
  {
    icon: <Brain className="w-7 h-7" strokeWidth={2.25} />,
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
              <div className={`${m.accentClass} p-3 rounded-lg bg-card border border-border/40`}>
                {m.icon}
              </div>

              <div>
                <p className={`text-3xl font-display ${m.accentClass} leading-none`}>
                  <CountUpValue end={m.value} duration={1800} visible={visible} decimals={m.value % 1 !== 0 ? 1 : 0} />
                  <span className="text-lg font-body font-semibold ml-0.5">
                    {m.suffix}
                  </span>
                </p>
                <p className="text-sm font-body font-semibold text-foreground/70 mt-2">
                  {m.label}
                </p>
                <p className="text-xs font-body text-muted-foreground mt-1 leading-relaxed">
                  {m.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The Proof – Callout Box */}
        <div
          className={`mt-16 glass-card border-l-4 border-l-primary p-8 md:p-10 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-2">
            The Proof
          </p>
          <h3 className="text-2xl md:text-3xl font-display text-foreground mb-3">
            Quantified Impact: The 19.4-Hour Dividend
          </h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-8 max-w-3xl">
            This model was proven through the delivery of a complex Manufactured Home Feature Set. 
            By using AI as a structured partner, I transformed the "grunt work" into strategic capacity:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {([
              {
                icon: <Scale className="w-5 h-5" strokeWidth={2.25} />,
                stat: "40 hrs → 2.5 hrs",
                title: "Legislative Analysis",
                desc: "Reduced manual compilation of requirement spreadsheets by 94%.",
              },
              {
                icon: <Zap className="w-5 h-5" strokeWidth={2.25} />,
                stat: "50% faster",
                title: "Velocity",
                desc: "Drafting speed for Epics and User Stories.",
              },
              {
                icon: <Target className="w-5 h-5" strokeWidth={2.25} />,
                stat: "~35% improvement",
                title: "Precision",
                desc: "Documentation clarity and completeness.",
              },
              {
                icon: <Calendar className="w-5 h-5" strokeWidth={2.25} />,
                stat: "2 days / week",
                title: "Strategic Gain",
                desc: "Reinvested into stakeholder alignment and long-term vision.",
              },
            ]).map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="text-primary p-2 rounded-lg bg-accent/50 border border-border/30 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-display text-primary leading-tight">{item.stat}</p>
                  <p className="text-sm font-body font-semibold text-foreground mt-0.5">{item.title}</p>
                  <p className="text-xs font-body text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactDashboard;
