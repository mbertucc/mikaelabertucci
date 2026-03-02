import { useProfile } from "@/hooks/usePortfolioData";

const HeroIntro = () => {
  const { data: profile } = useProfile();

  return (
    <section id="hero" className="pt-28 pb-4 px-6">
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
      </div>
    </section>
  );
};

export default HeroIntro;
