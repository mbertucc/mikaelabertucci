import {
  Dumbbell, CircleDot, Bike, Car, Flame,
  Dog, TreePine, Heart, Sparkles, Music, Sprout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Interest {
  label: string;
  icon: LucideIcon;
}

const interests: Interest[] = [
  { label: "Pilates", icon: Dumbbell },
  { label: "Pickleball", icon: CircleDot },
  { label: "Motorcyclist", icon: Bike },
  { label: "MX-5 Driver", icon: Car },
  { label: "Sauna Enthusiast", icon: Flame },
  { label: "Boston Terriers", icon: Dog },
  { label: "Hiking", icon: TreePine },
  { label: "Healthy Lifestyle", icon: Heart },
  { label: "AI in Daily Life", icon: Sparkles },
  { label: "70s · 80s · 90s", icon: Music },
  { label: "Plant Mom", icon: Sprout },
];

const BeyondWorkSection = () => (
  <section className="px-6 md:px-12 lg:px-24 py-20 max-w-6xl mx-auto">
    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-body mb-3">
      Beyond the Backlog
    </p>
    <h2 className="font-display text-2xl md:text-3xl text-foreground mb-10">
      When I'm Not Shipping
    </h2>

    <div className="flex flex-wrap gap-3">
      {interests.map(({ label, icon: Icon }) => (
        <span
          key={label}
          className="glass-card inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-body text-foreground/80 transition-all duration-200 hover:scale-105 hover:bg-card/80 cursor-default"
        >
          <Icon className="w-4 h-4 text-primary shrink-0" />
          {label}
        </span>
      ))}
    </div>
  </section>
);

export default BeyondWorkSection;
