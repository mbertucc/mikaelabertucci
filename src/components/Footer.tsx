import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-16 px-6">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="text-center md:text-left">
        <p className="font-display text-xl text-foreground">Mikaela Bertucci</p>
        <p className="text-sm text-muted-foreground font-body mt-1">Staff Software Engineer</p>
      </div>

      <div className="flex items-center gap-6">
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
          <Github className="w-5 h-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
          <Mail className="w-5 h-5" />
        </a>
      </div>

      <p className="text-xs text-muted-foreground/60 font-body text-center md:text-right">
        This portfolio is AI-queryable.
        <br />
        Ask it anything.
      </p>
    </div>
  </footer>
);

export default Footer;
