import { Check, Circle, X } from "lucide-react";

const categories = [
  {
    title: "Strong",
    icon: <Check className="w-4 h-4" />,
    colorClass: "text-primary border-primary/30",
    iconBg: "bg-primary/10",
    skills: [
      "TypeScript / JavaScript",
      "React & Next.js",
      "Node.js / Express",
      "System Design",
      "PostgreSQL / Redis",
      "CI/CD & DevOps",
      "Technical Leadership",
      "API Design (REST/GraphQL)",
    ],
  },
  {
    title: "Moderate",
    icon: <Circle className="w-4 h-4" />,
    colorClass: "text-muted-foreground border-border",
    iconBg: "bg-muted",
    skills: [
      "Python",
      "Go",
      "Kubernetes",
      "Machine Learning",
      "Mobile (React Native)",
      "Data Engineering",
    ],
  },
  {
    title: "Gaps",
    icon: <X className="w-4 h-4" />,
    colorClass: "text-accent border-accent/30",
    iconBg: "bg-accent/10",
    skills: [
      "Rust / C++",
      "iOS / Swift",
      "Blockchain / Web3",
      "Game Development",
    ],
  },
];

const SkillsMatrix = () => {
  return (
    <section className="py-28 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Skills Matrix</h2>
          <p className="text-muted-foreground font-body text-lg">
            An honest snapshot—because knowing what I <em className="italic">don't</em> know matters too.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.title} className={`glass-card p-6 border ${cat.colorClass}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg ${cat.iconBg} flex items-center justify-center ${cat.colorClass}`}>
                  {cat.icon}
                </div>
                <h3 className="font-display text-lg text-foreground">{cat.title}</h3>
              </div>
              <ul className="space-y-3">
                {cat.skills.map((skill) => (
                  <li key={skill} className="text-sm text-muted-foreground font-body">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsMatrix;
