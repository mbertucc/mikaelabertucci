import { Zap, Target, Users } from "lucide-react";
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-1 text-center">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body mb-3">Velocity</p>
                <StatRing value={3} max={5} label="Faster Time-to-Draft" unit="x" size={90} hideRing />
                <StatRing value={50} max={100} label="Faster Planning" unit="%" size={90} hideRing />
              </div>
              <div className="space-y-1 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body mb-3">Precision</p>
                <StatRing value={95} max={100} label="Requirement Precision" unit="%" size={90} hideRing />
                <StatRing value={75} max={100} label="Increase in Accuracy" unit="%" size={90} hideRing />
              </div>
              <div className="space-y-1 text-center col-span-2 md:col-span-1">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body mb-3">Culture</p>
                <StatRing value={80} max={100} label="Higher Team Satisfaction" unit="%" size={90} hideRing />
                <StatRing value={40} max={100} label="More Strategy Time" unit="%" size={90} hideRing />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
