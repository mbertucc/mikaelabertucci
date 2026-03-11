import { useSkills } from "@/hooks/usePortfolioData";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const categoryConfig = {
  strong: {
    title: "Strong",
    pillClass: "bg-primary/15 text-primary border-primary/25",
    tagClass: "bg-primary/10 text-primary border-primary/20",
  },
  moderate: {
    title: "Working Knowledge",
    pillClass: "bg-muted text-muted-foreground border-border",
    tagClass: "bg-muted text-foreground border-border",
  },
  gap: {
    title: "Learning",
    pillClass: "bg-accent/15 text-accent-foreground border-accent/25",
    tagClass: "bg-accent/10 text-accent-foreground border-accent/20",
  },
};

const categories = ["strong", "moderate", "gap"] as const;

const SkillsMatrix = () => {
  const { data: skills, isLoading } = useSkills();
  const [activeCat, setActiveCat] = useState<typeof categories[number]>("strong");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const grouped = {
    strong: (skills || []).filter((s) => s.category === "strong"),
    moderate: (skills || []).filter((s) => s.category === "moderate"),
    gap: (skills || []).filter((s) => s.category === "gap"),
  };

  const activeSkills = grouped[activeCat];

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [activeCat, skills]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  if (isLoading) return null;

  return (
    <ScrollReveal>
    <TooltipProvider delayDuration={200}>
      <section className="py-10 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body mb-2">Capability Radar</p>
              <h2 className="text-3xl md:text-4xl font-display text-foreground">Skills Matrix</h2>
            </div>
            {/* Category pills */}
            <div className="flex gap-2">
              {categories.map((cat) => {
                const config = categoryConfig[cat];
                const isActive = activeCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${
                      isActive
                        ? `${config.pillClass} shadow-sm`
                        : "bg-transparent text-muted-foreground border-border/50 hover:border-border"
                    }`}
                  >
                    {config.title}
                    <span className="ml-1.5 opacity-60">{grouped[cat].length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable strip */}
          <div className="relative">
            {/* Left fade */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-card/90 to-transparent"
                aria-label="Scroll left"
              >
                <span className="text-muted-foreground text-lg">‹</span>
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCat}
                ref={scrollRef}
                onScroll={checkScroll}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex gap-2.5 overflow-x-auto scrollbar-hide py-2 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {activeSkills.map((skill, i) => {
                  const config = categoryConfig[activeCat];
                  const tag = (
                    <motion.span
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className={`inline-flex items-center whitespace-nowrap px-3.5 py-2 rounded-full text-sm font-body border transition-colors shrink-0 ${config.tagClass} ${
                        skill.note ? "cursor-help" : ""
                      }`}
                    >
                      {skill.name}
                    </motion.span>
                  );

                  if (skill.note) {
                    return (
                      <Tooltip key={skill.id}>
                        <TooltipTrigger asChild>{tag}</TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[240px] text-[11px] leading-relaxed">
                          💡 {skill.note}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <span key={skill.id}>{tag}</span>;
                })}
              </motion.div>
            </AnimatePresence>

            {/* Right fade */}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-card/90 to-transparent"
                aria-label="Scroll right"
              >
                <span className="text-muted-foreground text-lg">›</span>
              </button>
            )}
          </div>

          <p className="text-muted-foreground/60 font-body text-xs mt-3 italic">
            Hover skills for honest notes — because knowing what I <em>don't</em> know matters too.
          </p>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default SkillsMatrix;
