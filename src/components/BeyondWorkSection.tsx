import {
  Dumbbell, CircleDot, Bike, Car, Flame,
  Dog, TreePine, Heart, Sparkles, Music, Sprout, Link,
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
  { label: "Blockchain & Crypto", icon: Link },
];

const BeyondWorkSection = () => (
  <section className="px-8 md:px-16 py-20 max-w-[1200px] mx-auto">
    <p className="font-body text-[9px] font-bold tracking-[4px] uppercase text-primary mb-3">
      Beyond the Backlog
    </p>
    <h2 className="font-display text-[28px] md:text-[34px] font-normal italic text-foreground mb-10 tracking-[-0.5px]">
      When I'm Not Shipping
    </h2>

    <div className="flex flex-wrap gap-3">
      {interests.map(({ label, icon: Icon }) => (
        <span
          key={label}
          className="glass-card inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-foreground/80 transition-all duration-200 hover:scale-105 hover:bg-card/80 cursor-default"
        >
          <Icon className="w-4 h-4 text-[hsl(var(--mustard))] shrink-0" />
          {label}
        </span>
      ))}
    </div>
  </section>
);

export default BeyondWorkSection;
