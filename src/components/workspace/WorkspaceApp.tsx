import { useState, useEffect, useRef } from 'react';
import './workspace.css';
import {
  PHASES, TONES, resolveTone, isPhaseReadyForReview,
  PersonaKey, ConfidenceKey, ScreenState, ToneKey, ChatMessage,
} from './data';
import { DualRingMark } from './Mark';
import { TopBarV2, OracleChat } from './OracleChat';
import { RailProgress, DelpheusInsight } from './Rail';
import { PhaseReview } from './PhaseReview';
import { ArtifactPeek } from './ArtifactPeek';

// ── Tweaks hook ────────────────────────────────────────────────────
interface TweakState {
  persona: PersonaKey;
  confidence: ConfidenceKey;
  screen: ScreenState;
}

const TWEAK_DEFAULTS: TweakState = {
  persona: 'beginner',
  confidence: 'medium',
  screen: 'chat',
};

function useEditMode(defaults: TweakState): [TweakState, (patch: Partial<TweakState>) => void, boolean] {
  const [state, setState] = useState<TweakState>(defaults);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setOpen(true);
      else if (d.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const update = (patch: Partial<TweakState>) => {
    setState(s => ({ ...s, ...patch }));
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch {}
  };

  return [state, update, open];
}

// ── WorkspaceApp ───────────────────────────────────────────────────
export function WorkspaceApp() {
  const [tweaks, setTweak, tweaksOpen] = useEditMode(TWEAK_DEFAULTS);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [reviewedPhases, setReviewedPhases] = useState<Set<number>>(() => new Set([0]));
  const [peekId, setPeekId] = useState<string | null>(null);

  const onPeekSub = (phaseId: string, subId: string) => {
    const key = `${phaseId}.${subId}`;
    setPeekId(prev => prev === key ? null : key);
  };
  const closePeek = () => setPeekId(null);

  const [expandedPhase, setExpandedPhase] = useState<string | null>(() => PHASES[1]?.id || 'who');
  useEffect(() => {
    setExpandedPhase(PHASES[currentPhase]?.id ?? null);
  }, [currentPhase]);

  const onTogglePhase = (phaseId: string) => {
    setExpandedPhase(prev => prev === phaseId ? null : phaseId);
  };

  const [screenState, setScreenState] = useState<ScreenState>(() => {
    try { return (localStorage.getItem('dp2.screen') as ScreenState) || tweaks.screen || 'chat'; }
    catch { return tweaks.screen || 'chat'; }
  });

  useEffect(() => {
    if (tweaks.screen && tweaks.screen !== screenState) setScreenState(tweaks.screen);
  }, [tweaks.screen]);

  useEffect(() => {
    try { localStorage.setItem('dp2.screen', screenState); } catch {}
  }, [screenState]);

  const persona = tweaks.persona || 'beginner';
  const tone: ToneKey = resolveTone(persona);
  const confidence = tweaks.confidence || 'medium';

  const [messages, setMessages] = useState<ChatMessage[]>(() => TONES[tone].chat);
  const prevTone = useRef(tone);
  useEffect(() => {
    if (prevTone.current !== tone) {
      setMessages(TONES[tone].chat);
      prevTone.current = tone;
    }
  }, [tone]);

  const [capturedOutcomes, setCapturedOutcomes] = useState<Record<number, Record<string, string>>>(() => ({
    1: {
      'primary-users':  'Volunteer coordinators at small food banks. They spend Sunday nights texting people to confirm shifts for Monday morning. Usually volunteers themselves, coordinating 40–80 shifts a week.',
      'current-state':  'They text people one-by-one, or sometimes forward to a group thread. No tracking, no nudges. If nobody replies they show up Monday short-staffed and a pallet of produce can sit out too long.',
      'success-metrics': 'Reduce Sunday-night coordination time from ~2–3 hours to under 30 minutes. Hit ≥90% confirmed shifts by Saturday evening. Cut produce loss from missed shifts to zero in a 4-week pilot.',
    },
  }));

  const updateCapturedOutcome = (phaseIdx: number, sectionId: string, body: string) => {
    setCapturedOutcomes(prev => ({
      ...prev,
      [phaseIdx]: { ...(prev[phaseIdx] || {}), [sectionId]: body },
    }));
  };

  const jumpToPhase = (idx: number) => {
    setCurrentPhase(idx);
    setScreenState('chat');
    setTweak({ screen: 'chat' });
  };

  const onPhaseComplete = () => {
    setScreenState('review');
    setTweak({ screen: 'review' });
  };

  const onReviewPhase = (idx: number) => {
    setCurrentPhase(idx);
    setScreenState('review');
    setTweak({ screen: 'review' });
  };

  const onApprove = () => {
    setReviewedPhases(prev => {
      const next = new Set(prev);
      next.add(currentPhase);
      return next;
    });
    setCurrentPhase(p => Math.min(p + 1, PHASES.length - 1));
    setScreenState('chat');
    setTweak({ screen: 'chat' });
  };

  const onRevise = () => {
    setScreenState('chat');
    setTweak({ screen: 'chat' });
  };

  const onAskOracleAboutSection = ({ phaseIdx: pIdx, section, prompt }: {
    phaseIdx: number;
    section: { id: string; label: string; body: string };
    prompt: string;
  }) => {
    setCurrentPhase(pIdx);
    setMessages(m => [
      ...m,
      {
        who: 'you' as const,
        fresh: true,
        text: `Revise · ${section.label}\n${prompt}`,
      },
      {
        who: 'guide' as const,
        fresh: true,
        text: `Got it — let's rework ${section.label.toLowerCase()}. Here's what we had:\n\n"${section.body}"\n\nA couple of clarifying questions before I rewrite it:\n• What part of that landed wrong — the framing, the specifics, or the scope?\n• Anything new I should pull in that wasn't on the table before?\n\nOnce you answer, I'll draft a revised version and you can re-review the phase.`,
      },
    ]);
    setScreenState('chat');
    setTweak({ screen: 'chat' });
  };

  const reviewPhaseIdx = screenState === 'review' ? Math.max(0, currentPhase - 1) : currentPhase;

  return (
    <div className="dp-ws">
      <div className="dp-aurora-bg" />
      <div className="dp-geo-echo" aria-hidden="true">
        <svg viewBox="0 0 1400 1400" fill="none">
          <ellipse cx="700" cy="700" rx="620" ry="310" stroke="#38bdf8" strokeWidth="1" transform="rotate(15 700 700)" />
          <ellipse cx="700" cy="700" rx="620" ry="310" stroke="#818cf8" strokeWidth="1" transform="rotate(-22 700 700)" />
          <ellipse cx="700" cy="700" rx="420" ry="210" stroke="#a5f3fc" strokeWidth="0.8" transform="rotate(55 700 700)" />
        </svg>
      </div>
      <div className="dp-aurora-noise" />

      <div className="dp-app-shell">
        <TopBarV2 projectName={TONES[tone].spec.name} onHome={() => {}} />

        <div className="dp-ws2">
          <div className="dp-rail">
            <RailProgress
              currentIdx={currentPhase}
              onJump={jumpToPhase}
              onPeekSub={onPeekSub}
              peekSubId={peekId}
              expandedPhase={expandedPhase}
              onTogglePhase={onTogglePhase}
              onReviewPhase={onReviewPhase}
              reviewedPhases={reviewedPhases}
            />
            <div className="dp-rail-block dp-rail-insight">
              <div className="dp-rail-eyebrow">
                <span>Reflection</span>
              </div>
              <DelpheusInsight confidence={confidence as ConfidenceKey} onCTA={() => {}} />
            </div>
          </div>

          {screenState === 'review' ? (
            <div className="dp-oracle-col">
              <PhaseReview
                phaseIdx={reviewPhaseIdx}
                tone={tone}
                capturedOutcomes={capturedOutcomes[reviewPhaseIdx]}
                onCaptureChange={(sid, body) => updateCapturedOutcome(reviewPhaseIdx, sid, body)}
                onApprove={onApprove}
                onRevise={onRevise}
                onAskOracleAboutSection={onAskOracleAboutSection}
              />
            </div>
          ) : (
            <OracleChat
              tone={tone}
              currentPhase={currentPhase}
              messages={messages}
              setMessages={setMessages}
              onPhaseComplete={onPhaseComplete}
              canWrapUp={isPhaseReadyForReview(currentPhase, currentPhase)}
            />
          )}
        </div>
      </div>

      <ArtifactPeek
        artifactId={peekId}
        onClose={closePeek}
        onReturnToPhase={jumpToPhase}
      />

      {tweaksOpen && (
        <div className="dp-tweaks-panel">
          <h4>Tweaks</h4>

          <div className="dp-tweak-row">
            <div className="dp-tlabel">Screen</div>
            <div className="dp-tweak-segments">
              <button
                className={screenState === 'chat' ? 'on' : ''}
                onClick={() => { setScreenState('chat'); setTweak({ screen: 'chat' }); }}
              >Chat</button>
              <button
                className={screenState === 'review' ? 'on' : ''}
                onClick={() => { setScreenState('review'); setTweak({ screen: 'review' }); }}
              >Phase review</button>
            </div>
          </div>

          <div className="dp-tweak-row">
            <div className="dp-tlabel">Delpheus Insight confidence</div>
            <div className="dp-tweak-segments">
              {(['high', 'medium', 'low'] as ConfidenceKey[]).map(c => (
                <button key={c} className={confidence === c ? 'on' : ''} onClick={() => setTweak({ confidence: c })}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="dp-tweak-row">
            <div className="dp-tlabel">Persona (from Antechamber Gate)</div>
            <div className="dp-tweak-segments">
              {(['beginner', 'product', 'engineer'] as PersonaKey[]).map(p => (
                <button key={p} className={persona === p ? 'on' : ''} onClick={() => setTweak({ persona: p })}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="dp-tweak-note">
            Click "Wrap up this phase" in the chat to trigger the review screen naturally.
          </div>
        </div>
      )}

      {/* Ambient mark in top-left for the tweaks panel trigger hint */}
      <div className="dp-tweaks-hint" aria-hidden="true">
        <DualRingMark size={16} animated={false} />
      </div>
    </div>
  );
}
