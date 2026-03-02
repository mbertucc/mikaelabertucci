import { Bot, Clock, RefreshCw } from "lucide-react";
import headshot from "@/assets/headshot.png";
import { useProfile } from "@/hooks/usePortfolioData";
import StatRing from "@/components/StatRing";

const AboutSection = () => {
  const { data: profile } = useProfile();

  return (
    <section id="about" className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 md:p-12 space-y-8">
          {/* Top: Headshot + Bio */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            <div className="shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                <img
                  src={headshot}
                  alt={`${profile?.full_name || "Mikaela Bertucci"} — professional headshot`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <p className="text-base text-muted-foreground font-body leading-relaxed max-w-xl">
                {profile?.positioning ||
                  "I save 20 hours a week letting AI handle the grunt work. That means I spend my time where it counts — setting vision, solving real problems, and building teams that don't just deliver — they thrive."}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/30" />

          {/* Bottom: Impact Dashboard */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-body mb-6 text-left">
              AI-Augmented Impact Dashboard
            </p>
            <div className="grid grid-cols-3 gap-6 md:gap-8">
              <StatRing value={20} max={40} label="Hours Saved Weekly" unit="h" size={90} icon={Clock} hideRing />
              <StatRing value={90} max={100} label="Fewer Clarification Loops" unit="%" size={90} icon={RefreshCw} hideRing />
              <StatRing value={16} max={20} label="AI Agents Built" unit="" size={90} icon={Bot} hideRing />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
