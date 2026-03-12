import { useState } from "react";
import { MessageSquare, Moon, Sun, Lock, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

interface NavbarProps {
  onOpenChat: () => void;
}

const Navbar = ({ onOpenChat }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--nav-bg))] border-b border-[hsl(var(--nav-text)/0.15)] relative overflow-hidden">
      {/* Subtle starburst decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--nav-text) / 0.4) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        <button
          onClick={() => scrollTo("hero")}
          className="font-display text-2xl text-[hsl(var(--mustard))] tracking-wide"
        >
          MB
        </button>
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop nav links */}
          <button
            onClick={() => scrollTo("experience")}
             className="text-sm font-body tracking-wide text-[hsl(var(--nav-text))] hover:text-[hsl(var(--mustard))] transition-colors hidden sm:block"
          >
            Experience
          </button>
          <button
            onClick={() => scrollTo("fit-check")}
            className="text-sm font-body tracking-wide text-[hsl(var(--nav-text))] hover:text-[hsl(var(--mustard))] transition-colors hidden sm:block"
          >
            Fit Check
          </button>
          <button
            onClick={() => navigate("/ventures")}
            className="items-center gap-1.5 text-sm font-body tracking-wide text-[hsl(var(--nav-text))] hover:text-[hsl(var(--mustard))] transition-colors hidden sm:flex"
          >
            <Lock className="w-3.5 h-3.5" />
            Ventures
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-[hsl(var(--nav-text)/0.7)] hover:text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-text)/0.1)] transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Ask AI — mustard accent */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[hsl(var(--mustard))] text-[hsl(var(--mustard-foreground))] font-body text-sm font-medium rounded-md glow-warm hover:brightness-110 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI About Me</span>
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-[hsl(var(--nav-text)/0.7)] hover:text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-text)/0.1)] transition-colors sm:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[hsl(var(--nav-text)/0.15)] bg-[hsl(var(--nav-bg)/0.98)] backdrop-blur-xl animate-fade-in">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
            <button
              onClick={() => scrollTo("experience")}
              className="text-sm font-body tracking-wide text-[hsl(var(--nav-text))] hover:text-[hsl(var(--mustard))] transition-colors text-left py-2"
            >
              Experience
            </button>
            <button
              onClick={() => scrollTo("fit-check")}
              className="text-sm font-body tracking-wide text-[hsl(var(--nav-text))] hover:text-[hsl(var(--mustard))] transition-colors text-left py-2"
            >
              Fit Check
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/ventures");
              }}
              className="flex items-center gap-1.5 text-sm font-body tracking-wide text-[hsl(var(--nav-text))] hover:text-[hsl(var(--mustard))] transition-colors py-2"
            >
              <Lock className="w-3.5 h-3.5" />
              Ventures
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;