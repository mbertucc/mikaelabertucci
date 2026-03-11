import { useProfile } from "@/hooks/usePortfolioData";

const HeroIntro = () => {
  const { data: profile } = useProfile();

  return (
    <section id="hero" className="pt-24 pb-2 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-card text-sm font-body">
           <span className="w-2 h-2 rounded-full bg-accent-warm animate-pulse-glow" />
           <span className="text-muted-foreground">
             {profile?.status_badge || "🟢 Open to \"Dark Factory\" environments where Spec is the Product"}
           </span>
        </div>

        {/* Name */}
         <h1 className="text-7xl md:text-9xl font-display font-bold leading-[0.95] tracking-tight text-foreground">
           {profile?.full_name || "Mikaela Bertucci"}
        </h1>

        {/* Title */}
         <p className="text-2xl md:text-3xl font-display italic text-accent-warm">
           {profile?.title || "Agentic Product Owner | Context Engineer"}
         </p>
      </div>
    </section>
  );
};

export default HeroIntro;
