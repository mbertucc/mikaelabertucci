import { FileText, Cpu, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    label: "THE INPUT",
    title: "Legislative Complexity",
    accent: "amber-warm" as const,
    icon: FileText,
    content:
      "200+ pages of the **Short-Term Rental Accommodations Act**, Regulations, and Policy — dense legal language spanning registration requirements, platform obligations, compliance triggers, and municipal enforcement rules.",
    stat: "200+",
    statLabel: "Pages of Legislation",
  },
  {
    number: "02",
    label: "THE PROCESS",
    title: "AI Synthesis",
    accent: "primary" as const,
    icon: Cpu,
    content:
      "I use **custom AI agents** to extract epics, stories, scenarios, business rules, validation logic, and compliance triggers in minutes — saving **20 hours** of manual analysis per legislative package.",
    stat: "20hrs",
    statLabel: "Saved Per Package",
  },
  {
    number: "03",
    label: "THE OUTPUT",
    title: "The Spec",
    accent: "teal" as const,
    icon: Rocket,
    content:
      "A **high-fidelity User Story** with business rules, scenarios, edge cases, error handling, and Gherkin/Markdown specification that an AI developer agent can build from **immediately** — without human clarification.",
    stat: "0",
    statLabel: "Clarification Rounds",
  },
];

const accentStyles = {
  "amber-warm": {
    border: "border-[hsl(var(--amber-warm))]",
    text: "text-[hsl(var(--amber-warm))]",
    bg: "bg-[hsl(var(--amber-warm)/0.08)]",
    glow: "shadow-[0_0_24px_hsl(var(--amber-warm)/0.15)]",
    ring: "ring-[hsl(var(--amber-warm)/0.25)]",
  },
  primary: {
    border: "border-primary",
    text: "text-primary",
    bg: "bg-primary/8",
    glow: "shadow-[0_0_24px_hsl(var(--primary)/0.15)]",
    ring: "ring-primary/25",
  },
  teal: {
    border: "border-[hsl(var(--teal))]",
    text: "text-[hsl(var(--teal))]",
    bg: "bg-[hsl(var(--teal)/0.08)]",
    glow: "shadow-[0_0_24px_hsl(var(--teal)/0.15)]",
    ring: "ring-[hsl(var(--teal)/0.25)]",
  },
};

const DarkFactorySection = () => (
  <section id="dark-factory" className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <p className="text-xs font-body uppercase tracking-[0.3em] text-primary">
          Technical Proof
        </p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
          The Dark Factory Workflow
        </h2>
        <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
          From Law to Logic — using the{" "}
          <span className="text-[hsl(var(--amber-warm))] font-medium">
            Short-Term Rental Registry
          </span>{" "}
          as a case study.
        </p>
      </div>

      {/* Steps */}
      <div className="grid gap-8 lg:grid-cols-3">
        {steps.map((step) => {
          const s = accentStyles[step.accent];
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`glass-card relative overflow-hidden p-8 flex flex-col gap-6 ring-1 ${s.ring} ${s.glow} transition-all duration-300 hover:scale-[1.02]`}
            >
              {/* Step number + label */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-bold tracking-widest ${s.text}`}
                >
                  {step.number}
                </span>
                <span
                  className={`text-[10px] font-body uppercase tracking-[0.25em] px-2 py-0.5 rounded ${s.bg} ${s.text}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${s.bg}`}>
                  <Icon className={`w-5 h-5 ${s.text}`} />
                </div>
                <h3 className="font-display text-xl text-foreground">
                  {step.title}
                </h3>
              </div>

              {/* Body — render bold via simple split */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {step.content.split(/(\*\*.*?\*\*)/).map((seg, i) =>
                  seg.startsWith("**") ? (
                    <strong key={i} className="text-foreground font-semibold">
                      {seg.slice(2, -2)}
                    </strong>
                  ) : (
                    <span key={i}>{seg}</span>
                  )
                )}
              </p>

              {/* Big stat */}
              <div className={`border-t border-border/50 pt-5 mt-auto`}>
                <p className={`font-display text-3xl font-bold ${s.text}`}>
                  {step.stat}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  {step.statLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connecting line (desktop) */}
      <div className="hidden lg:flex items-center justify-center mt-10 gap-2">
        <span className="h-px w-16 bg-[hsl(var(--amber-warm)/0.4)]" />
        <span className="text-xs text-muted-foreground font-mono">→</span>
        <span className="h-px w-16 bg-primary/40" />
        <span className="text-xs text-muted-foreground font-mono">→</span>
        <span className="h-px w-16 bg-[hsl(var(--teal)/0.4)]" />
        <span className="text-xs text-[hsl(var(--teal))] font-mono font-bold">
          Ship-Ready
        </span>
      </div>
    </div>
  </section>
);

export default DarkFactorySection;
