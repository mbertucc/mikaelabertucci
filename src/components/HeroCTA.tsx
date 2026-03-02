import { useProfile } from "@/hooks/usePortfolioData";

const HeroCTA = () => {
  const { data: profile } = useProfile();

  return (
    <section className="pb-4 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(profile?.company_badges || ["Real Estate Applications", "Registry Applications"]).map((company: string) => (
            <span
              key={company}
              className="px-4 py-1.5 text-xs font-body font-medium tracking-wide text-secondary-foreground bg-secondary rounded-full border border-border/50"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCTA;
