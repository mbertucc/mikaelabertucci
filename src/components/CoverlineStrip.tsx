interface CoverlineStripProps {
  label: string;
}

const CoverlineStrip = ({ label }: CoverlineStripProps) => (
  <div className="bg-[hsl(var(--teal-dk))] dark:bg-[hsl(var(--teal-dk))] py-3.5 px-8 md:px-16 flex items-center gap-0 relative overflow-hidden border-y border-[hsl(var(--teal)/0.2)]">
    {/* Shimmer */}
    <div
      className="absolute top-0 h-full w-1/2 pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
        animation: 'shimmer 5s ease-in-out infinite',
      }}
    />
    <div className="h-px flex-1 bg-[hsl(var(--nav-text)/0.12)]" />
    <div className="w-1 h-1 rounded-full bg-[hsl(var(--mustard))] shrink-0 shadow-[0_0_6px_hsl(var(--mustard)/0.5)]" />
    <span className="px-7 font-display text-[11px] font-bold italic tracking-[4px] uppercase text-[hsl(var(--nav-text))] whitespace-nowrap opacity-80">
      {label}
    </span>
    <div className="w-1 h-1 rounded-full bg-[hsl(var(--mustard))] shrink-0 shadow-[0_0_6px_hsl(var(--mustard)/0.5)]" />
    <div className="h-px flex-1 bg-[hsl(var(--nav-text)/0.12)]" />
  </div>
);

export default CoverlineStrip;
