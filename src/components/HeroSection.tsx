import portraitImg from "@/assets/portrait.png";

const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center pt-20">
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 opacity-0 animate-fade-up">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body">
            Creative Director & Designer
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[0.9] tracking-tight text-foreground">
            Mikaela
            <br />
            <span className="italic text-accent">Bertucci</span>
          </h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-md">
            Crafting visual narratives that bridge art and strategy. Based in Buenos Aires, working globally.
          </p>
          <button
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-foreground font-body border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            View Selected Work
            <span className="text-lg">↓</span>
          </button>
        </div>
        <div className="opacity-0 animate-fade-up [animation-delay:200ms]">
          <div className="relative">
            <img
              src={portraitImg}
              alt="Mikaela Bertucci portrait"
              className="w-full max-w-md mx-auto lg:ml-auto object-cover rounded-sm shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-accent rounded-sm" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
