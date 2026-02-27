import { MessageSquare, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onOpenChat: () => void;
}

const companies = ["Acme Corp", "TechFlow", "Buildwise", "Quantum Labs", "NovaPay"];

const HeroSection = ({ onOpenChat }: HeroSectionProps) => {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-6 relative">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm font-body">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-muted-foreground">
            Open to <span className="text-foreground font-medium">Staff Engineer</span> at{" "}
            <span className="text-foreground font-medium">Series B+</span>
          </span>
        </div>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-display leading-[0.95] tracking-tight text-foreground">
          Mikaela Bertucci
        </h1>

        {/* Title */}
        <p className="text-2xl md:text-3xl font-display italic text-primary">
          Staff Software Engineer
        </p>

        {/* Positioning */}
        <p className="text-lg text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
          Building high-performance systems at the intersection of product and infrastructure.
          10+ years shipping what matters.
        </p>

        {/* Company badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {companies.map((company) => (
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
