import { useProfile } from "@/hooks/usePortfolioData";
import { motion } from "framer-motion";
import headshot from "@/assets/headshot.png";

const HeroIntro = () => {
  const { data: profile } = useProfile();

  const name = profile?.full_name || "Mikaela Bertucci";
  const words = name.split(" ");
  const firstName = words[0] || "Mikaela";
  const lastName = words.slice(1).join(" ") || "Bertucci";

  return (
    <section id="hero" className="relative overflow-hidden bg-background" style={{ marginTop: '52px', minHeight: '680px' }}>
      {/* 6px teal strip across top */}
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-primary z-10" />

      {/* 8px mustard bar on right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-[8px] bg-accent-warm z-10" />

      {/* Two-column grid */}
      <div className="grid md:grid-cols-2 min-h-[680px]">
        {/* LEFT column */}
        <div className="px-8 md:px-16 py-14 relative z-[2] flex flex-col justify-center">
          {/* Massive name */}
          <div className="relative">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="block font-display text-[80px] sm:text-[100px] md:text-[130px] font-black leading-[0.85] tracking-[-4px] text-foreground"
            >
              {firstName}
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="block font-display text-[60px] sm:text-[80px] md:text-[100px] font-normal italic leading-[0.9] tracking-[-2px] text-primary mt-[-8px]"
            >
              {lastName}
            </motion.span>
          </div>

          {/* Triple rule — no gap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-0 my-5"
          >
            <div className="h-[3px] bg-foreground w-full max-w-[340px]" />
            <div className="h-[3px] bg-primary w-[60%] max-w-[200px]" />
            <div className="h-[3px] bg-accent-warm w-[30%] max-w-[100px]" />
          </motion.div>

          {/* Photo with teal offset border frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="relative mb-8 w-[280px] h-[300px]"
          >
            {/* Teal offset border — 8px left, 8px up */}
            <div
              className="absolute border-2 border-primary"
              style={{ top: '-8px', left: '-8px', width: '280px', height: '300px' }}
            />
            {/* Photo */}
            <img
              src={headshot}
              alt={`${profile?.full_name || "Mikaela Bertucci"} — professional headshot`}
              className="relative z-[1] w-[280px] h-[300px] object-cover object-top"
              loading="lazy"
            />
            {/* Mustard 28px square accent bottom-right */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-accent-warm z-[2]" />
          </motion.div>

          {/* Cover lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            <span className="block font-body text-[9px] font-bold tracking-[3px] uppercase text-secondary leading-[2]">
              Certified Product Owner
            </span>
            <span className="block font-body text-[9px] font-bold tracking-[3px] uppercase text-[hsl(var(--mustard-dk))] leading-[2]">
              Context Engineer
            </span>
            <span className="block font-body text-[9px] font-bold tracking-[3px] uppercase text-secondary leading-[2]">
              Agentic Workflow Architect
            </span>

            <p className="font-body text-[10px] font-light text-[hsl(var(--text-mid))] leading-[1.85] max-w-[340px] mt-3">
              Seven years delivering complex government digital products across BC Registries and Citizens' Services.
            </p>
          </motion.div>
        </div>

        {/* RIGHT column — vertically centered */}
        <div className="px-8 md:px-16 py-14 relative z-[2] flex flex-col justify-center">
          {/* Teal block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative bg-primary p-7 md:px-9 md:py-7"
          >
            {/* Mustard 40px square accent bottom-right, offset 8px outside */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent-warm" />

            <p className="font-body text-[8px] font-bold tracking-[3px] uppercase mb-2.5" style={{ color: 'rgba(242,236,216,0.6)' }}>
              Victoria, BC · Portfolio 2025
            </p>
            <p className="font-display text-[18px] md:text-[20px] italic font-normal leading-[1.5]" style={{ color: 'hsl(var(--card))' }}>
              I'm not just a PM or just an Agile coach. I translate — strategy into stories, chaos into structure, user needs into things{" "}
              <strong className="not-italic font-bold">
                engineers can actually build.
              </strong>
            </p>

            {/* Internal rule */}
            <div className="my-5 h-px" style={{ background: 'rgba(242,236,216,0.25)' }} />

            <p className="font-body text-[9px] font-bold tracking-[2.5px] uppercase" style={{ color: 'rgba(242,236,216,0.55)' }}>
              I Build Environments Where People Want to Show Up.
            </p>
          </motion.div>

          {/* Contact strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-3.5 mt-0"
            style={{ borderTop: '1px solid hsl(var(--mustard))' }}
          >
            <div className="flex items-center gap-0 flex-wrap">
              <span className="font-body text-[8px] font-semibold tracking-[2px] uppercase text-foreground">
                mikaela@bertucci.ca
              </span>
              <span className="mx-2 text-[8px] text-accent-warm">·</span>
              <a
                href={profile?.linkedin_url || "https://linkedin.com/in/mikaelabertucci"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[8px] font-semibold tracking-[2px] uppercase text-foreground hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
              <span className="mx-2 text-[8px] text-accent-warm">·</span>
              <span className="font-body text-[8px] font-semibold tracking-[2px] uppercase text-primary">
                Open to opportunities
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroIntro;
