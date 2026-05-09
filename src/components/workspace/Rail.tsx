import { PHASES, SUB_PHASES, INSIGHT_VARIANTS, getSubStatus, ConfidenceKey } from './data';
import { Ico } from './Mark';

// ── Delpheus Insight card ─────────────────────────────────────────────
interface DelpheusInsightProps {
  confidence: ConfidenceKey;
  onCTA: () => void;
}

export function DelpheusInsight({ confidence, onCTA }: DelpheusInsightProps) {
  const v = INSIGHT_VARIANTS[confidence] || INSIGHT_VARIANTS.medium;
  return (
    <div className={`dp-insight-card ${confidence}`}>
      <div className="dp-insight-head">
        <span className="dp-insight-dot"/>
        <span className="dp-insight-label">Delpheus Insight</span>
        <span className="dp-insight-badge">{v.badge}</span>
      </div>
      <div className="dp-insight-summary">{v.summary}</div>
      <div className="dp-insight-assumption-lbl">{v.assumptions.length} assumptions captured</div>
      <div className="dp-insight-assumptions">
        {v.assumptions.map((a, i) => (
          <div key={i} className="dp-insight-assumption">{a}</div>
        ))}
      </div>
      <button className="dp-insight-cta" onClick={onCTA}>
        {v.cta} <Ico name="arrow-r" size={13}/>
      </button>
    </div>
  );
}

// ── Sub-phase row ─────────────────────────────────────────────────────
interface SubPhaseRowProps {
  phaseId: string;
  sub: { id: string; label: string; hint: string };
  status: 'done' | 'building' | 'pending';
  isOpen: boolean;
  onClick: (subId: string) => void;
}

function SubPhaseRow({ phaseId: _phaseId, sub, status, isOpen, onClick }: SubPhaseRowProps) {
  const cueLabel = status === 'done' ? 'Done' : status === 'building' ? 'Now' : 'Pending';
  return (
    <button
      type="button"
      className={`dp-sub-phase ${status} ${isOpen ? 'open' : ''}`}
      onClick={() => onClick(sub.id)}
      title={`${sub.label} — ${sub.hint}`}
      aria-expanded={isOpen}
    >
      <span className="dp-sub-dot" aria-hidden="true">
        {status === 'done' && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M2 4.6L3.6 6.2L7 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className="dp-sub-label-wrap">
        <span className="dp-sub-label">{sub.label}</span>
        <span className="dp-sub-hint">{sub.hint}</span>
      </span>
      <span className="dp-sub-cue" aria-hidden="true">{cueLabel}</span>
    </button>
  );
}

// ── Phase header row ──────────────────────────────────────────────────
interface PhaseHeaderProps {
  phase: typeof PHASES[0];
  idx: number;
  currentIdx: number;
  isExpanded: boolean;
  doneCount: number;
  totalCount: number;
  isReviewed: boolean;
  onToggle: () => void;
  onViewReview: (idx: number) => void;
}

function PhaseHeader({ phase, idx, currentIdx, isExpanded, doneCount, totalCount, isReviewed, onToggle, onViewReview }: PhaseHeaderProps) {
  const cls = idx < currentIdx ? 'done' : idx === currentIdx ? 'active' : 'pending';
  const phaseColor = `var(--ph-${idx + 1})`;
  return (
    <div className={`dp-phase-row ${cls} ${isExpanded ? 'expanded' : ''}`} data-phase={idx + 1}>
      <button
        type="button"
        className="dp-phase-row-main"
        onClick={onToggle}
        aria-expanded={isExpanded}
        title={isExpanded ? `Collapse ${phase.label}` : `Expand ${phase.label}`}
      >
        <span className="dp-phase-idx" style={{ '--phase-color': phaseColor } as React.CSSProperties}>
          {cls === 'done' ? (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2.5 5.5L4.5 7.5L8.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <span>{idx + 1}</span>
          )}
        </span>
        <span className="dp-phase-label-wrap">
          <span className="dp-phase-label">{phase.label}</span>
          <span className="dp-phase-progress-line">
            <span className="dp-phase-count">{doneCount}/{totalCount}</span>
            <span className="dp-phase-count-sep">·</span>
            <span className="dp-phase-sub-summary">{phase.sub}</span>
          </span>
        </span>

        {isReviewed ? (
          <span
            className="dp-phase-review-link"
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onViewReview(idx); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onViewReview(idx); } }}
            title={`View ${phase.label} review`}
          >
            View review
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        ) : (
          <span className={`dp-phase-chev ${isExpanded ? 'open' : ''}`} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </button>

      <div className="dp-phase-strip" aria-hidden="true">
        {Array.from({ length: totalCount }).map((_, i) => (
          <span key={i} className={`dp-phase-strip-seg ${i < doneCount ? 'done' : ''}`}
            style={{ '--phase-color': phaseColor } as React.CSSProperties}/>
        ))}
      </div>
    </div>
  );
}

// ── Rail Progress ─────────────────────────────────────────────────────
interface RailProgressProps {
  currentIdx: number;
  onJump: (idx: number) => void;
  onPeekSub: (phaseId: string, subId: string) => void;
  peekSubId: string | null;
  expandedPhase: string | null;
  onTogglePhase: (phaseId: string) => void;
  onReviewPhase: (idx: number) => void;
  reviewedPhases: Set<number>;
}

export function RailProgress({
  currentIdx, onJump, onPeekSub, peekSubId,
  expandedPhase, onTogglePhase, onReviewPhase, reviewedPhases,
}: RailProgressProps) {
  const phases = PHASES.slice(0, 4);

  let totalSubs = 0, doneSubs = 0;
  phases.forEach((ph, idx) => {
    const subs = SUB_PHASES[ph.id] || [];
    subs.forEach(s => {
      totalSubs++;
      if (getSubStatus(ph.id, s.id, currentIdx, idx) === 'done') doneSubs++;
    });
  });
  const pct = totalSubs ? Math.round((doneSubs / totalSubs) * 100) : 0;

  return (
    <div className="dp-rail-block dp-rail-progress-v2">
      <div className="dp-rail-eyebrow">
        <span>Progress</span>
        <span className="dp-pct-mini">{pct}%</span>
      </div>

      <div className="dp-phase-accordion">
        {phases.map((ph, idx) => {
          const subs = SUB_PHASES[ph.id] || [];
          const subDone = subs.filter(s => getSubStatus(ph.id, s.id, currentIdx, idx) === 'done').length;
          const isExpanded = expandedPhase === ph.id;
          const allDone = subs.length > 0 && subDone === subs.length;
          const isCurrent = idx === currentIdx;
          const isPast = idx < currentIdx;
          const reviewed = reviewedPhases?.has(idx);

          return (
            <div key={ph.id} className="dp-phase-block">
              <PhaseHeader
                phase={ph} idx={idx} currentIdx={currentIdx}
                isExpanded={isExpanded} doneCount={subDone} totalCount={subs.length}
                isReviewed={reviewed}
                onToggle={() => onTogglePhase(ph.id)}
                onViewReview={onReviewPhase}
              />

              <div className={`dp-sub-list ${isExpanded ? 'open' : ''}`}>
                <div className="dp-sub-list-inner">
                  {subs.map(sub => {
                    const status = getSubStatus(ph.id, sub.id, currentIdx, idx);
                    const isOpenPeek = peekSubId === `${ph.id}.${sub.id}`;
                    return (
                      <SubPhaseRow
                        key={sub.id} phaseId={ph.id} sub={sub} status={status}
                        isOpen={isOpenPeek}
                        onClick={(subId) => onPeekSub(ph.id, subId)}
                      />
                    );
                  })}

                  {allDone && !reviewed ? (
                    <button
                      type="button"
                      className="dp-sub-review-cta"
                      onClick={() => onReviewPhase(idx)}
                      title={`Review what we've agreed for ${ph.label} before moving on`}
                    >
                      <span className="dp-sub-review-icon" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="dp-sub-review-text">
                        <span className="dp-sub-review-title">Review {ph.label}</span>
                        <span className="dp-sub-review-hint">All {subs.length} drafted — ready for the gate</span>
                      </span>
                      <svg className="dp-sub-review-arrow" width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M3 5.5h5M5.5 3l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="dp-sub-jump"
                      onClick={() => onJump(idx)}
                      title={isPast ? `Return to ${ph.label}` : isCurrent ? `${ph.label} — already active` : `Skip ahead to ${ph.label}`}
                    >
                      {isPast    ? `Return to ${ph.label}`    :
                       isCurrent ? `Continue in ${ph.label}`  :
                                   `Skip ahead to ${ph.label}`}
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M2.5 5.5h6M5.5 2.5L8.5 5.5L5.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
