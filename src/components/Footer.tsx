import { Github, Linkedin, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/usePortfolioData";

const Footer = () => {
  const { data: profile } = useProfile();

  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section — Teal (light) / Black (dark) */}
      <div className="bg-[hsl(var(--teal))] dark:bg-[hsl(0_0%_3%)] py-20 px-8 md:px-16 relative overflow-hidden">
        {/* Diagonal stripe texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 24px, hsl(var(--nav-text) / 0.03) 24px, hsl(var(--nav-text) / 0.03) 25px)',
        }} />

        {/* Mustard right bar */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-[hsl(var(--mustard))]" />

        {/* Giant ghosted letter */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 font-display text-[300px] md:text-[380px] font-black text-[hsl(var(--nav-text)/0.04)] dark:text-[hsl(var(--nav-text)/0.02)] leading-[1] tracking-[-15px] pointer-events-none select-none">
          MB
        </div>

        {/* Dark mode: ambient glows */}
        <div className="hidden dark:block absolute -left-[100px] -bottom-[100px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, hsl(var(--teal) / 0.06) 0%, transparent 70%)',
          animation: 'glowPulse 10s ease-in-out infinite',
        }} />
        <div className="hidden dark:block absolute -right-[80px] -top-[80px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, hsl(var(--mustard) / 0.05) 0%, transparent 70%)',
          animation: 'glowPulse 14s ease-in-out infinite reverse',
        }} />

        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_auto] gap-16 items-center relative z-10">
          <div>
            <p className="font-body text-[9px] font-bold tracking-[4px] uppercase text-[hsl(var(--nav-text)/0.55)] dark:text-[hsl(var(--nav-text)/0.35)] mb-4 flex items-center gap-2.5">
              <span className="inline-block w-5 h-px bg-[hsl(var(--mustard))] opacity-50" />
              Ready to Work Together?
            </p>
            <h2 className="font-display text-[50px] md:text-[68px] font-black uppercase text-[hsl(var(--nav-text))] leading-[0.88] tracking-[-2px] mb-5">
              See If
              <em className="block italic font-normal text-[40px] md:text-[54px] normal-case tracking-[-1px] text-[hsl(var(--mustard-lt))] dark:text-[hsl(var(--teal-lt))]" style={{
                textShadow: 'var(--cta-em-shadow, none)',
              }}>
                I'm The Right Fit.
              </em>
            </h2>
            <p className="font-body text-[12.5px] font-light text-[hsl(var(--nav-text)/0.6)] dark:text-[hsl(var(--nav-text)/0.35)] leading-[1.9] max-w-[420px]">
              Paste a job description. Get an honest assessment — including when I'm not.
            </p>
          </div>

          <div>
            <button
              onClick={() => document.getElementById("fit-check")?.scrollIntoView({ behavior: "smooth" })}
              className="relative overflow-hidden bg-[hsl(var(--nav-text))] dark:bg-transparent dark:border dark:border-[hsl(var(--teal-dk))] text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal-lt))] px-12 py-5 font-body text-[10px] font-bold tracking-[3px] uppercase whitespace-nowrap transition-all duration-300 hover:tracking-[4px] hover:-translate-y-0.5 group"
            >
              <span className="relative z-10">✦ Analyze Fit</span>
              {/* Hover fill */}
              <span className="absolute inset-0 bg-[hsl(var(--mustard))] dark:bg-[hsl(var(--teal-dk))] transform scale-x-0 origin-right dark:origin-bottom group-hover:scale-x-100 dark:group-hover:scale-y-100 transition-transform duration-300 z-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border py-6 px-8 md:px-16 bg-background">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-display text-lg text-foreground">{profile?.full_name || "Mikaela Bertucci"}</p>
            <p className="font-body text-[9px] font-medium tracking-[2px] uppercase text-muted-foreground mt-1">{profile?.title || "Agentic Product Owner | Context Engineer"}</p>
          </div>

          <div className="flex items-center gap-6">
            {profile?.github_url && (
              <a href={profile.github_url} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            <Link to="/admin/login" className="inline-flex items-center gap-1 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <Lock className="w-3 h-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
