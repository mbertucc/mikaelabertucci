import { Github, Linkedin, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/usePortfolioData";

const Footer = () => {
  const { data: profile } = useProfile();

  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section — dark background with diagonal stripe pattern */}
      <div className="bg-[hsl(var(--nav-bg))] py-16 px-6 relative">
        {/* Diagonal stripe pattern overlay */}
        <div className="absolute inset-0 pointer-events-none mcm-pattern-stripes opacity-60" />
        
        {/* Large organic background shapes */}
        <div className="absolute -bottom-12 -left-12 w-48 h-48 pointer-events-none opacity-[0.04]" style={{
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          background: `hsl(var(--mustard))`,
          transform: 'rotate(-30deg)',
        }} />
        <div className="absolute -top-8 -right-8 w-36 h-36 pointer-events-none opacity-[0.04]" style={{
          borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%',
          background: `hsl(var(--teal))`,
          transform: 'rotate(20deg)',
        }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl text-[hsl(var(--nav-text))] mb-4">
            Let's Talk
          </h2>
          <p className="text-[hsl(var(--nav-text)/0.7)] font-body mb-8 max-w-lg mx-auto">
            This portfolio is AI-queryable. Ask it anything — or reach out directly.
          </p>
          <div className="flex items-center justify-center gap-4">
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                className="px-6 py-3 bg-[hsl(var(--mustard))] text-[hsl(var(--mustard-foreground))] font-body font-semibold text-sm rounded-md glow-warm hover:brightness-110 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            )}
            {profile?.github_url && (
              <a
                href={profile.github_url}
                className="px-6 py-3 border border-[hsl(var(--nav-text)/0.3)] text-[hsl(var(--nav-text))] font-body font-medium text-sm rounded-md hover:border-[hsl(var(--nav-text)/0.6)] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[hsl(var(--divider))] py-6 px-6 bg-background">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-display text-lg text-foreground">{profile?.full_name || "Mikaela Bertucci"}</p>
            <p className="text-xs text-muted-foreground font-body mt-1">{profile?.title || "Agentic Product Owner | Context Engineer"}</p>
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