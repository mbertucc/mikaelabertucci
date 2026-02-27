import { MessageSquare } from "lucide-react";

interface NavbarProps {
  onOpenChat: () => void;
}

const Navbar = ({ onOpenChat }: NavbarProps) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => scrollTo("hero")}
          className="font-display text-2xl text-primary tracking-wide"
        >
          MB
        </button>
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollTo("experience")}
            className="text-sm font-body tracking-wide text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Experience
          </button>
          <button
            onClick={() => scrollTo("fit-check")}
            className="text-sm font-body tracking-wide text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Fit Check
          </button>
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg glow-primary hover:brightness-110 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Ask AI
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
