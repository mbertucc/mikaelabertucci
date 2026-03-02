import headshot from "@/assets/headshot.png";
import { useProfile } from "@/hooks/usePortfolioData";

const AboutSection = () => {
  const { data: profile } = useProfile();

  return (
    <section id="about" className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 md:gap-14">
          {/* Headshot */}
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

          {/* Bio */}
          <div className="space-y-4 text-center md:text-left">
            <p className="text-base text-muted-foreground font-body leading-relaxed max-w-xl">
              {profile?.positioning ||
                "I save 20 hours a week letting AI handle the grunt work. That means I spend my time where it counts — setting vision, solving real problems, and building teams that don't just deliver — they thrive."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
