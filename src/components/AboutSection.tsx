const AboutSection = () => {
  return (
    <section id="about" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-4">About</p>
            <h2 className="text-4xl md:text-5xl font-display italic text-foreground">
              The Story
            </h2>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              With over a decade of experience in creative direction, branding, and visual design, I help brands find their authentic voice through thoughtful, intentional design.
            </p>
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              My approach blends editorial sensibility with strategic thinking — every project is an opportunity to tell a story that resonates and endures.
            </p>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              {[
                { number: "12+", label: "Years Experience" },
                { number: "80+", label: "Projects Delivered" },
                { number: "15", label: "Awards Won" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-display text-accent">{stat.number}</p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
