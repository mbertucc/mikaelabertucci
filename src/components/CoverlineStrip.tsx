interface CoverlineStripProps {
  label: string;
}

const CoverlineStrip = ({ label }: CoverlineStripProps) => (
  <div
    className="bg-primary relative overflow-hidden flex items-center justify-center"
    style={{ height: '40px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}
  >
    {/* Shimmer */}
    <div
      className="absolute top-0 h-full w-1/2 pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
        animation: 'shimmer 5s ease-in-out infinite',
      }}
    />
    <div className="flex items-center gap-3">
      <span className="w-1 h-1 rounded-full bg-accent-warm" style={{ boxShadow: '0 0 6px hsl(var(--mustard) / 0.5)' }} />
      <span
        className="font-body text-[9px] font-semibold tracking-[4px] uppercase whitespace-nowrap"
        style={{ color: 'rgba(242,236,216,0.85)' }}
      >
        {label}
      </span>
      <span className="w-1 h-1 rounded-full bg-accent-warm" style={{ boxShadow: '0 0 6px hsl(var(--mustard) / 0.5)' }} />
    </div>
  </div>
);

export default CoverlineStrip;
