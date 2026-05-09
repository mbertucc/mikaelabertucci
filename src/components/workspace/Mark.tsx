import { useMemo } from 'react';

// ── Dual Ring Mark — matches the actual LogoMark.tsx ──────────────────
interface DualRingMarkProps {
  size?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}

export function DualRingMark({ size = 26, animated = true, style }: DualRingMarkProps) {
  const uid = useMemo(() => 'm' + Math.random().toString(36).slice(2, 8), []);
  const ring1 = animated ? 'dp-ring1 8s linear infinite' : 'none';
  const ring2 = animated ? 'dp-ring2 11s linear infinite' : 'none';

  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`dlpg${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a5f3fc"/>
          <stop offset="100%" stopColor="#818cf8"/>
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="4.5" fill={`url(#dlpg${uid})`}/>
      <ellipse cx="14" cy="14" rx="11" ry="5.5" stroke="#38bdf8" strokeWidth="1.4" fill="none"
        style={{ transformOrigin: '14px 14px', animation: ring1 }}/>
      <ellipse cx="14" cy="14" rx="11" ry="5.5" stroke="#818cf8" strokeWidth="1.1" fill="none"
        style={{ transformOrigin: '14px 14px', animation: ring2 }}/>
    </svg>
  );
}

// ── Ambient Orb ───────────────────────────────────────────────────────
type OrbState = 'idle' | 'listening' | 'intensified' | 'celebratory' | 'thinking';

interface AmbientOrbProps {
  size?: number;
  state?: OrbState;
  style?: React.CSSProperties;
}

export function AmbientOrb({ size = 56, state = 'listening', style }: AmbientOrbProps) {
  const uid = useMemo(() => 'o' + Math.random().toString(36).slice(2, 8), []);

  const cfg: Record<OrbState, { coreOpacity: number; ringOpacity: number; ring1Dur: string; ring2Dur: string; haloColor: string; haloOpacity: number }> = {
    idle:        { coreOpacity: 0.35, ringOpacity: 0.45, ring1Dur: '14s', ring2Dur: '18s',  haloColor: 'transparent',                  haloOpacity: 0 },
    listening:   { coreOpacity: 0.75, ringOpacity: 0.85, ring1Dur: '8s',  ring2Dur: '11s',  haloColor: 'rgba(56,189,248,0.18)',         haloOpacity: 0.6 },
    thinking:    { coreOpacity: 0.85, ringOpacity: 0.95, ring1Dur: '5s',  ring2Dur: '7s',   haloColor: 'rgba(129,140,248,0.22)',        haloOpacity: 0.8 },
    intensified: { coreOpacity: 1,    ringOpacity: 1,    ring1Dur: '4s',  ring2Dur: '5.5s', haloColor: 'rgba(129,140,248,0.3)',         haloOpacity: 1 },
    celebratory: { coreOpacity: 1,    ringOpacity: 1,    ring1Dur: '6s',  ring2Dur: '8s',   haloColor: 'rgba(16,185,129,0.32)',         haloOpacity: 1 },
  };

  const i = cfg[state] || cfg.listening;
  const isCelebrate = state === 'celebratory';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...(style || {}) }}>
      {i.haloOpacity > 0 && (
        <div aria-hidden="true" style={{
          position: 'absolute', inset: `-${Math.round(size * 0.18)}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${i.haloColor} 0%, transparent 70%)`,
          opacity: i.haloOpacity,
          transition: 'opacity 420ms ease',
          pointerEvents: 'none',
        }}/>
      )}
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" style={{ position: 'relative', zIndex: 1 }}>
        <defs>
          <radialGradient id={`ob${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isCelebrate ? '#a7f3d0' : '#a5f3fc'}/>
            <stop offset="100%" stopColor={isCelebrate ? '#10b981' : '#818cf8'}/>
          </radialGradient>
        </defs>
        <circle cx="14" cy="14" r="4.5" fill={`url(#ob${uid})`} opacity={i.coreOpacity}/>
        <ellipse cx="14" cy="14" rx="11" ry="5.5"
          stroke={isCelebrate ? '#10b981' : '#38bdf8'}
          strokeWidth="1.4" fill="none" opacity={i.ringOpacity}
          style={{ transformOrigin: '14px 14px', animation: `dp-ring1 ${i.ring1Dur} linear infinite` }}/>
        <ellipse cx="14" cy="14" rx="11" ry="5.5"
          stroke={isCelebrate ? '#34d399' : '#818cf8'}
          strokeWidth="1.1" fill="none" opacity={i.ringOpacity}
          style={{ transformOrigin: '14px 14px', animation: `dp-ring2 ${i.ring2Dur} linear infinite` }}/>
      </svg>
    </div>
  );
}

// ── Minimal icon set ───────────────────────────────────────────────────
interface IcoProps { name: string; size?: number }

export function Ico({ name, size = 16 }: IcoProps) {
  const s = size;
  const p: React.SVGProps<SVGSVGElement> = {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.7,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'plus':      return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'send':      return <svg {...p}><path d="M4 12l16-8-5 16-3-7-8-1z"/></svg>;
    case 'arrow-r':   return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-l':   return <svg {...p}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>;
    case 'settings':  return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'clock':     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'check':     return <svg {...p}><path d="M5 12l5 5L20 7"/></svg>;
    case 'edit':      return <svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>;
    case 'sparkles':  return <svg {...p}><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z"/><path d="M19 14l.9 2.4L22.3 17l-2.4.9L19 20.3l-.9-2.4L15.7 17l2.4-.9L19 14z"/></svg>;
    case 'message':   return <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'loader':    return <svg {...p} style={{ animation: 'dp-ring1 1s linear infinite', transformOrigin: '12px 12px' }}><path d="M21 12a9 9 0 1 1-6.2-8.55"/></svg>;
    case 'x':         return <svg {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case 'chevron-d': return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    default:          return null;
  }
}
