import ScrollReveal from "@/components/ScrollReveal";

const WHAT_IT_DOES = [
  "An AI agent that answers questions about Mikaela's experience, skills, and work history — in plain language, on demand.",
  "Honest fit assessment: paste a job description, get a real answer — including when she's not the right fit.",
  "Live demo of the context engineering methodology that became the foundation for Delpheus.",
];

const AIQueryablePortfolioSection = () => {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-chat", { detail: "Tell me about this site and how the AI agent works." }));
  };

  return (
    <section id="ai-portfolio" className="py-28 px-8 md:px-16 bg-popover relative overflow-hidden">
      {/* 6px teal left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-primary" />

      <div className="max-w-[1200px] mx-auto relative z-[1]">
        <ScrollReveal>
          <div className="flex items-baseline gap-5 mb-14 border-b-[3px] border-foreground pb-5 relative">
            <div className="absolute left-0 w-full h-px bg-primary opacity-35" style={{ bottom: "-5px" }} />
            <p className="font-body text-[10px] font-bold tracking-[4px] uppercase text-primary whitespace-nowrap">
              AI-Queryable Portfolio
            </p>
            <h2 className="font-display text-[38px] md:text-[48px] font-normal italic text-foreground tracking-[-0.5px]">
              A working product, not a brochure.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-[1fr_1fr] gap-16 items-start">
          {/* Left — origin story */}
          <ScrollReveal>
            <div>
              <p className="font-body text-[10px] font-bold tracking-[3px] uppercase text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal))] mb-3">
                Origin
              </p>
              <p className="font-display text-[15px] italic text-muted-foreground leading-[1.8] mb-8">
                Built before Delpheus existed — this site was the proof of concept. Conceived and directed by Mikaela, with initial code by Nate B Jones. Originally built on Lovable, now migrated to Claude Code, Supabase, and Vercel.
              </p>
              <p className="font-body text-[10px] font-bold tracking-[3px] uppercase text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal))] mb-3">
                Why It Matters
              </p>
              <p className="font-body text-[14px] font-light text-muted-foreground leading-[1.85] mb-8">
                This site is not a portfolio brochure. It's a working product. The methodology you're reading about is the same one powering the agent you can talk to right now.
              </p>
              <button
                onClick={openChat}
                className="inline-flex items-center gap-2 font-body text-[11px] font-bold tracking-[3px] uppercase bg-primary text-card px-8 py-4 transition-all duration-300 hover:tracking-[4px] hover:-translate-y-0.5"
              >
                ✦ Ask the AI
              </button>
            </div>
          </ScrollReveal>

          {/* Right — what it does */}
          <ScrollReveal delay={0.1}>
            <div>
              <p className="font-body text-[10px] font-bold tracking-[3px] uppercase text-[hsl(var(--teal-dk))] dark:text-[hsl(var(--teal))] mb-5">
                What It Does
              </p>
              <ul className="list-none space-y-5">
                {WHAT_IT_DOES.map((item, i) => (
                  <li key={i} className="font-body text-[14px] font-light text-muted-foreground leading-[1.85] pl-6 relative">
                    <span
                      className="absolute left-0 top-[10px] w-1.5 h-1.5 bg-[hsl(var(--mustard))] rotate-45 opacity-80"
                      style={{ boxShadow: "var(--mustard-bullet-shadow, none)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AIQueryablePortfolioSection;
