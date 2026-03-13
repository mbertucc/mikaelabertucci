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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--nav-bg))] border-b border-[hsl(var(--nav-text)/0.08)]" style={{ height: '52px' }}>
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 h-full flex items-center justify-between">
        {/* Logo — Bodoni, uppercase, wide tracking */}
        <button
          onClick={() => scrollTo("hero")}
          className="font-display text-[22px] font-black tracking-[6px] uppercase text-[hsl(var(--nav-text))]"
        >
          Mikaela Bertucci
        </button>

        <div className="flex items-center gap-0">
          {/* Desktop nav links — tiny Montserrat, uppercase */}
          <div className="hidden sm:flex items-center gap-9">
            <button
              onClick={() => scrollTo("experience")}
              className="text-[9px] font-body font-medium tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.45)] hover:text-[hsl(var(--mustard-lt))] transition-colors relative group"
            >
              Experience
              <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-[hsl(var(--mustard))] transition-all duration-200 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollTo("fit-check")}
              className="text-[9px] font-body font-medium tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.45)] hover:text-[hsl(var(--mustard-lt))] transition-colors relative group"
            >
              Fit Check
              <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-[hsl(var(--mustard))] transition-all duration-200 group-hover:w-full" />
            </button>
            <button
              onClick={() => navigate("/ventures")}
              className="flex items-center gap-1.5 text-[9px] font-body font-medium tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.45)] hover:text-[hsl(var(--mustard-lt))] transition-colors relative group"
            >
              <Lock className="w-3 h-3" />
              Ventures
              <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-[hsl(var(--mustard))] transition-all duration-200 group-hover:w-full" />
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-6 p-2 text-[hsl(var(--nav-text)/0.45)] hover:text-[hsl(var(--nav-text))] transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Ask AI button — teal filled (light) / teal outline (dark) */}
          <button
            onClick={onOpenChat}
            className="ml-4 relative overflow-hidden bg-[hsl(var(--teal))] dark:bg-transparent dark:border dark:border-[hsl(var(--teal-dk))] text-[hsl(var(--nav-text))] dark:text-[hsl(var(--teal-lt))] px-5 py-2 font-body text-[9px] font-bold tracking-[2.5px] uppercase transition-all hover:bg-[hsl(var(--teal-dk))] dark:hover:text-[hsl(var(--nav-text))] dark:hover:border-[hsl(var(--teal))]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI About Me</span>
            </span>
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-3 p-2 text-[hsl(var(--nav-text)/0.7)] hover:text-[hsl(var(--nav-text))] transition-colors sm:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[hsl(var(--nav-text)/0.08)] bg-[hsl(var(--nav-bg)/0.98)] backdrop-blur-xl animate-fade-in">
          <div className="max-w-[1400px] mx-auto px-8 py-4 flex flex-col gap-3">
            <button
              onClick={() => scrollTo("experience")}
              className="text-[9px] font-body font-medium tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.45)] hover:text-[hsl(var(--mustard-lt))] transition-colors text-left py-2"
            >
              Experience
            </button>
            <button
              onClick={() => scrollTo("fit-check")}
              className="text-[9px] font-body font-medium tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.45)] hover:text-[hsl(var(--mustard-lt))] transition-colors text-left py-2"
            >
              Fit Check
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/ventures");
              }}
              className="flex items-center gap-1.5 text-[9px] font-body font-medium tracking-[3px] uppercase text-[hsl(var(--nav-text)/0.45)] hover:text-[hsl(var(--mustard-lt))] transition-colors py-2"
            >
              <Lock className="w-3 h-3" />
              Ventures
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
