import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";

const projects = [
  { title: "Aurea Brand Identity", category: "Branding", image: project1 },
  { title: "Nockor Editorial", category: "Print Design", image: project2 },
  { title: "Solana Interiors", category: "Art Direction", image: project3 },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-32 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-4">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-display italic text-foreground">Selected Work</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="group cursor-pointer opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="overflow-hidden rounded-sm mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body">{project.category}</p>
              <h3 className="text-xl font-display mt-1 text-foreground group-hover:text-accent transition-colors">
                {project.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
