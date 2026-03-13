import { Github, Linkedin, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/usePortfolioData";

const Footer = () => {
  const { data: profile } = useProfile();

  return (
    <footer className="relative overflow-hidden">
      {/* Bottom bar */}
      <div className="border-t border-border py-8 px-8 md:px-16 bg-background">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-display text-xl text-foreground">{profile?.full_name || "Mikaela Bertucci"}</p>
            <p className="font-body text-[10px] font-medium tracking-[2px] uppercase text-muted-foreground mt-1.5">{profile?.title || "Agentic Product Owner | Context Engineer"}</p>
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
