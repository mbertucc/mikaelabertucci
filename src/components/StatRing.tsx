import { useEffect, useState, useRef } from "react";
import { LucideIcon } from "lucide-react";

interface StatRingProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  icon?: LucideIcon;
  hideRing?: boolean;
}

const StatRing = ({ value, max, label, unit = "", size = 100, strokeWidth = 6, colorClass = "stroke-primary", icon: Icon, hideRing = false }: StatRingProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedValue / max) * circumference;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return (
    <div className="flex flex-col items-center gap-2">
      {!hideRing ? (
        <svg ref={ref} width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" strokeWidth={strokeWidth}
            className="stroke-border/30"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-100`}
          />
        </svg>
      ) : (
        <div ref={ref as any} style={{ width: size, height: size }} className="flex items-center justify-center">
          {Icon && <Icon className="w-10 h-10 text-primary" />}
        </div>
      )}
      <div className="text-center mt-1">
        {!hideRing && Icon && <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-0.5" />}
        <span className="font-display text-2xl text-foreground font-bold">{animatedValue}{unit}</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body text-center leading-tight">{label}</p>
    </div>
  );
};

export default StatRing;
