import { MessageSquare, ChevronDown, FileText, Bot, Clock, RefreshCw } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";
import StatRing from "@/components/StatRing";

interface HeroSectionProps {
  onOpenChat: () => void;
}

const HeroSection = ({ onOpenChat }: HeroSectionProps) => {
  const { data: profile } = useProfile();

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-6 relative">
      <div className="max-w-5xl mx-auto text-center space-y-10">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm font-body">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-muted-foreground">
            {profile?.status_badge || "🟢 Open to Level 5 \"Dark Factory\" environments where Spec is the Product"}
          </span>
        </div>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-display leading-[0.95] tracking-tight text-foreground">
          {profile?.full_name || "Mikaela Bertucci"}
        </h1>

        {/* Title */}
        <p className="text-2xl md:text-3xl font-display italic text-primary">
          {profile?.title || "Agentic Product Owner | Context Engineer"}
        </p>

        {/* Dashboard-style stat bar */}
        <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body mb-6 text-left">
            AI-Augmented Impact Dashboard
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatRing value={20} max={40} label="Hours Saved Weekly" unit="h" size={90} icon={Clock} hideRing />
            <StatRing value={90} max={100} label="Fewer Clarification Loops" unit="%" size={90} icon={RefreshCw} hideRing />
            <StatRing value={2000} max={2500} label="Pages Analyzed" unit="+" size={90} colorClass="stroke-[hsl(var(--accent))]" icon={FileText} />
            <StatRing value={16} max={20} label="AI Agents Built" unit="" size={90} colorClass="stroke-[hsl(var(--primary))]" icon={Bot} />
          </div>
          <div className="mt-6 pt-5 border-t border-border/30">
            <p className="text-sm text-muted-foreground font-body leading-relaxed text-center max-w-xl mx-auto">
              {profile?.positioning || "I save 20 hours a week letting AI handle the grunt work. That means I spend my time where it counts — setting vision, solving real problems, and building teams that don't just deliver — they thrive."}
            </p>
          </div>
        </div>

        {/* Company badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(profile?.company_badges || ["Real Estate Applications", "Registry Applications"]).map((company: string) => (
            <span
              key={company}
              className="px-4 py-1.5 text-xs font-body font-medium tracking-wide text-muted-foreground bg-secondary rounded-full border border-border/50"
            >
              {company}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onOpenChat}
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body font-semibold text-base rounded-xl glow-primary hover:brightness-110 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          Ask AI About Me
        </button>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
