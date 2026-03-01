import { MessageSquare, ChevronDown } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";

interface HeroSectionProps {
  onOpenChat: () => void;
}

const HeroSection = ({ onOpenChat }: HeroSectionProps) => {
  const { data: profile } = useProfile();

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-6 relative">
      <div className="max-w-3xl mx-auto text-center space-y-8">
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

        {/* Positioning — AI-Augmented Leadership */}
        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            {profile?.positioning || "I save 20 hours a week letting AI handle the grunt work. That means I spend my time where it counts — setting vision, solving real problems, and building teams that don't just deliver. They want to."}
          </p>
          <p className="text-sm text-primary/80 font-body italic">
            AI-Augmented Leadership — I don't ramp up. I dive in.
          </p>
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
