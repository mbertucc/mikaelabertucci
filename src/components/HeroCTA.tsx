import { MessageSquare, ChevronDown } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";

interface HeroCTAProps {
  onOpenChat: () => void;
}

const HeroCTA = ({ onOpenChat }: HeroCTAProps) => {
  const { data: profile } = useProfile();

  return (
    <section className="pb-10 px-6 relative">
      <div className="max-w-5xl mx-auto text-center space-y-10">
        {/* Company badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(profile?.company_badges || ["Real Estate Applications", "Registry Applications"]).map((company: string) => (
            <span
              key={company}
              className="px-4 py-1.5 text-xs font-body font-medium tracking-wide text-secondary-foreground bg-secondary rounded-full border border-border/50"
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
      <div className="flex justify-center mt-12">
        <button
          onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroCTA;
