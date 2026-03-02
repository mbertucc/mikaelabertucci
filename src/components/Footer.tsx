import { Github, Linkedin, Mail } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";

const Footer = () => {
  const { data: profile } = useProfile();

  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="font-display text-xl text-foreground">{profile?.full_name || "Mikaela Bertucci"}</p>
          <p className="text-sm text-muted-foreground font-body mt-1">{profile?.title || "Agentic Product Owner | Level 5 Intent Architect"}</p>
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
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>

        <p className="text-xs text-muted-foreground/80 font-body text-center md:text-right">
          This portfolio is AI-queryable.
          <br />
          Ask it anything.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
