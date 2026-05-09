import { useEffect } from 'react';
import { PHASES, ARTIFACT_CONTENT } from './data';

interface ArtifactPeekProps {
  artifactId: string | null;
  onClose: () => void;
  onReturnToPhase: (idx: number) => void;
}

export function ArtifactPeek({ artifactId, onClose, onReturnToPhase }: ArtifactPeekProps) {
  const data = artifactId ? ARTIFACT_CONTENT[artifactId] : null;

  useEffect(() => {
    if (!artifactId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [artifactId, onClose]);

  return (
    <>
      <div
        className={`dp-peek-scrim${artifactId ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`dp-peek-panel${artifactId ? ' open' : ''}`}
        role="dialog"
        aria-modal={false as unknown as boolean}
        aria-label={data ? `${data.label} preview` : 'Artifact preview'}
      >
        {data && (
          <>
            <header className="dp-peek-head">
              <div className="dp-peek-head-meta">
                <div className="dp-peek-eyebrow">{data.eyebrow}</div>
                <div className={`dp-peek-status status-${data.status}`}>
                  <span className="dp-peek-status-dot" />
                  {data.statusLabel}
                </div>
              </div>
              <button className="dp-peek-close" onClick={onClose} aria-label="Close preview">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="dp-peek-body">
              <h2 className="dp-peek-h">{data.headline}</h2>

              <div className="dp-peek-content">
                {data.body.map((b: Record<string, unknown>, i: number) => {
                  if (b.kind === 'p') return (
                    <p key={i} className="dp-peek-p">{b.text as string}</p>
                  );

                  if (b.kind === 'meta') return (
                    <dl key={i} className="dp-peek-meta">
                      {(b.items as Array<{ k: string; v: string }>).map((it, j) => (
                        <div key={j} className="dp-peek-meta-row">
                          <dt>{it.k}</dt>
                          <dd>{it.v}</dd>
                        </div>
                      ))}
                    </dl>
                  );

                  if (b.kind === 'persona') return (
                    <div key={i} className="dp-peek-persona">
                      <div className="dp-peek-persona-head">
                        <span className="dp-peek-persona-name">{b.name as string}</span>
                        <span className={`dp-peek-persona-weight w-${(b.weight as string).toLowerCase()}`}>{b.weight as string}</span>
                      </div>
                      <ul className="dp-peek-bullets">
                        {(b.bullets as string[]).map((bl, j) => <li key={j}>{bl}</li>)}
                      </ul>
                      <blockquote className="dp-peek-quote">{b.quote as string}</blockquote>
                    </div>
                  );

                  if (b.kind === 'feature') return (
                    <div key={i} className="dp-peek-feature">
                      <div className="dp-peek-feature-head">
                        <span className="dp-peek-feature-name">{b.name as string}</span>
                        <span className={`dp-peek-moscow m-${(b.moscow as string).toLowerCase()}`}>{b.moscow as string}</span>
                      </div>
                      <p className="dp-peek-feature-why">{b.why as string}</p>
                    </div>
                  );

                  if (b.kind === 'criterion') return (
                    <div key={i} className="dp-peek-criterion">
                      <div className="dp-peek-cr-row">
                        <span className="dp-peek-cr-lbl">When</span>
                        <span className="dp-peek-cr-text">{b.when as string}</span>
                      </div>
                      <div className="dp-peek-cr-row">
                        <span className="dp-peek-cr-lbl">Then</span>
                        <span className="dp-peek-cr-text">{b.then as string}</span>
                      </div>
                    </div>
                  );

                  if (b.kind === 'callout') return (
                    <div key={i} className="dp-peek-callout">
                      <span className="dp-peek-callout-icon" aria-hidden="true">◊</span>
                      <span>{b.text as string}</span>
                    </div>
                  );

                  if (b.kind === 'placeholder') return (
                    <ul key={i} className="dp-peek-placeholder">
                      {(b.items as string[]).map((it, j) => <li key={j}>{it}</li>)}
                    </ul>
                  );

                  return null;
                })}
              </div>
            </div>

            <footer className="dp-peek-foot">
              <button className="dp-peek-foot-btn ghost" onClick={onClose}>
                Keep going in chat
              </button>
              <button
                className="dp-peek-foot-btn primary"
                onClick={() => { onReturnToPhase(data.phaseIdx as number); onClose(); }}
              >
                Return to {PHASES[data.phaseIdx as number]?.label}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M3 6.5h7M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
