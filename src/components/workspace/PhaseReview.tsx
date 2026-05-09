import { useState, useEffect, useRef } from 'react';
import { PHASES, PHASE_OUTCOMES, REVISE_PROMPT_HINTS } from './data';
import { AmbientOrb, Ico } from './Mark';
import { DualRingMark } from './Mark';

// ── PhaseReviewSection ────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  body: string;
}

interface PhaseReviewSectionProps {
  section: Section;
  reviseMode: boolean;
  value: string;
  onChange: (v: string) => void;
  onAskOracle: (section: Section, prompt: string) => void;
  busyAsk: boolean;
}

function PhaseReviewSection({ section, reviseMode, value, onChange, onAskOracle, busyAsk }: PhaseReviewSectionProps) {
  const [mode, setMode] = useState<'idle' | 'editing' | 'asking'>('idle');
  const [draft, setDraft] = useState(value);
  const [askText, setAskText] = useState('');
  const editRef = useRef<HTMLTextAreaElement>(null);
  const askRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (mode === 'editing' && editRef.current) {
      editRef.current.focus();
      const len = editRef.current.value.length;
      editRef.current.setSelectionRange(len, len);
    }
    if (mode === 'asking' && askRef.current) askRef.current.focus();
  }, [mode]);

  useEffect(() => {
    if (!reviseMode) setMode('idle');
  }, [reviseMode]);

  const startEdit = () => { setDraft(value); setMode('editing'); };
  const saveEdit = () => { onChange(draft); setMode('idle'); };
  const cancelEdit = () => { setDraft(value); setMode('idle'); };

  const startAsk = () => { setAskText(''); setMode('asking'); };
  const submitAsk = () => {
    const t = askText.trim();
    if (!t) return;
    onAskOracle(section, t);
    setMode('idle');
  };
  const dismissAsk = () => setMode('idle');

  const hints = REVISE_PROMPT_HINTS[section.id] || [];

  return (
    <div className={`dp-pr-section${reviseMode ? ' revisable' : ''}${mode !== 'idle' ? ' active' : ''}`}>
      <div className="dp-pr-section-head">
        <div className="dp-pr-section-lbl">{section.label}</div>
        {reviseMode && mode === 'idle' && (
          <div className="dp-pr-section-tools">
            <button className="dp-pr-tool" onClick={startEdit} title="Edit this answer directly">
              <Ico name="edit" size={12} /> Edit
            </button>
            <button className="dp-pr-tool sky" onClick={startAsk} title="Send this back to Oracle for another pass">
              <Ico name="sparkles" size={12} /> Ask Oracle to revise
            </button>
          </div>
        )}
      </div>

      {mode === 'editing' ? (
        <div className="dp-pr-card editing">
          <textarea
            ref={editRef}
            className="dp-pr-edit-area"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={Math.max(2, Math.min(10, draft.split('\n').length + 1))}
            onKeyDown={e => {
              if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveEdit(); }
            }}
          />
          <div className="dp-pr-edit-actions">
            <span className="dp-pr-edit-hint"><kbd>⌘↵</kbd> save · <kbd>Esc</kbd> cancel</span>
            <button className="dp-pr-mini-btn ghost" onClick={cancelEdit}>Cancel</button>
            <button
              className="dp-pr-mini-btn primary"
              onClick={saveEdit}
              disabled={draft.trim() === value.trim()}
            >
              Save edit
            </button>
          </div>
        </div>
      ) : mode === 'asking' ? (
        <>
          <div className="dp-pr-card muted">
            <div className="dp-pr-section-text">{value}</div>
          </div>
          <div className="dp-pr-ask-box">
            <div className="dp-pr-ask-head">
              <DualRingMark size={18} />
              <span>Tell Oracle what to change about <em>{section.label.toLowerCase()}</em></span>
              <button className="dp-pr-ask-close" onClick={dismissAsk} aria-label="Cancel">
                <Ico name="x" size={13} />
              </button>
            </div>
            {hints.length > 0 && (
              <div className="dp-pr-ask-hints">
                {hints.map((h, i) => (
                  <button key={i} className="dp-pr-ask-hint" onClick={() => setAskText(h)}>{h}</button>
                ))}
              </div>
            )}
            <textarea
              ref={askRef}
              className="dp-pr-ask-area"
              placeholder={`e.g. "the test group is actually 5 players, not 4 — and we meet weekly now"`}
              value={askText}
              onChange={e => setAskText(e.target.value)}
              rows={3}
              onKeyDown={e => {
                if (e.key === 'Escape') { e.preventDefault(); dismissAsk(); }
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submitAsk(); }
              }}
            />
            <div className="dp-pr-ask-foot">
              <span className="dp-pr-edit-hint">Oracle will revise this section and you can re-review.</span>
              <button
                className="dp-pr-mini-btn primary sky"
                onClick={submitAsk}
                disabled={!askText.trim() || busyAsk}
              >
                {busyAsk
                  ? <><Ico name="loader" size={13} /> Sending…</>
                  : <><Ico name="send" size={13} /> Send to Oracle</>}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="dp-pr-card">
          <div className="dp-pr-section-text">{value}</div>
        </div>
      )}
    </div>
  );
}

// ── PhaseReview ───────────────────────────────────────────────────
interface AskOraclePayload {
  phaseIdx: number;
  section: Section;
  prompt: string;
}

interface PhaseReviewProps {
  phaseIdx: number;
  tone?: string;
  capturedOutcomes?: Record<string, string>;
  onCaptureChange?: (sectionId: string, body: string) => void;
  onApprove: () => void;
  onRevise: () => void;
  onAskOracleAboutSection: (payload: AskOraclePayload) => void;
}

export function PhaseReview({
  phaseIdx, tone, capturedOutcomes,
  onCaptureChange, onApprove, onRevise, onAskOracleAboutSection,
}: PhaseReviewProps) {
  const phase = PHASES[phaseIdx];
  const baseContent = PHASE_OUTCOMES[phaseIdx] || { sections: [] };

  const [sections, setSections] = useState<Section[]>(() =>
    baseContent.sections.map((s: Section) => ({
      ...s,
      body: (capturedOutcomes && capturedOutcomes[s.id]) || s.body,
    }))
  );

  useEffect(() => {
    setSections(baseContent.sections.map((s: Section) => ({
      ...s,
      body: (capturedOutcomes && capturedOutcomes[s.id]) || s.body,
    })));
    setReviseMode(false);
    setEdited({});
    setAskingBusy(null);
  }, [phaseIdx, capturedOutcomes]);

  const [reviseMode, setReviseMode] = useState(false);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [askingBusy, setAskingBusy] = useState<string | null>(null);

  const enterRevise = () => setReviseMode(true);
  const exitRevise = () => setReviseMode(false);

  const updateSection = (id: string, newBody: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, body: newBody } : s));
    setEdited(prev => ({ ...prev, [id]: 'edited' }));
    if (typeof onCaptureChange === 'function') onCaptureChange(id, newBody);
  };

  const askOracle = (section: Section, prompt: string) => {
    setAskingBusy(section.id);
    if (typeof onAskOracleAboutSection === 'function') {
      onAskOracleAboutSection({ phaseIdx, section, prompt });
    }
    setTimeout(() => {
      setEdited(prev => ({ ...prev, [section.id]: 'sent' }));
      setAskingBusy(null);
    }, 250);
  };

  const editedCount = Object.keys(edited).length;
  const hasEdits = editedCount > 0;
  const nextPhase = PHASES[Math.min(phaseIdx + 1, PHASES.length - 1)];

  return (
    <div className="dp-phase-review">
      <div className={`dp-pr-inner${reviseMode ? ' revising' : ''}`}>
        <div className="dp-pr-head">
          <div className="dp-pr-orb">
            <AmbientOrb size={56} state={reviseMode ? 'thinking' : 'celebratory'} />
          </div>
          <div className="dp-pr-title">
            {reviseMode ? (
              <>
                <h2>Revising — <span className="dp-ph-name">{phase?.label}</span></h2>
                <div className="dp-pr-sub">
                  Edit any section directly, or ask Oracle to revise it for you.
                  {hasEdits && (
                    <span className="dp-pr-edit-count"> · {editedCount} change{editedCount === 1 ? '' : 's'} pending</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2>Phase {phaseIdx + 1} complete — <span className="dp-ph-name">{phase?.label}</span></h2>
                <div className="dp-pr-sub">Review what was captured before moving on. You can go back and change anything.</div>
              </>
            )}
          </div>
          {reviseMode && (
            <button className="dp-pr-exit-revise" onClick={exitRevise} title="Stop editing">
              <Ico name="x" size={14} />
            </button>
          )}
        </div>

        <div className="dp-pr-divider" />

        {sections.map(s => (
          <PhaseReviewSection
            key={s.id}
            section={s}
            reviseMode={reviseMode}
            value={s.body}
            onChange={(v) => updateSection(s.id, v)}
            onAskOracle={(sec, prompt) => askOracle(sec, prompt)}
            busyAsk={askingBusy === s.id}
          />
        ))}

        <div className="dp-pr-actions">
          {reviseMode ? (
            <>
              <button className="dp-btn-success" onClick={exitRevise}>
                <Ico name="check" size={16} /> Done revising
              </button>
              <button className="dp-btn-secondary" onClick={() => onRevise && onRevise()}>
                <Ico name="message" size={14} /> Open full chat instead
              </button>
              <span className="dp-pr-helper">
                {hasEdits ? 'Changes are saved as you go.' : 'Tip: hover any section and pick Edit or Ask Oracle.'}
              </span>
            </>
          ) : (
            <>
              <button className="dp-btn-success" onClick={onApprove}>
                <Ico name="check" size={16} /> On to {nextPhase?.label || 'next'}
              </button>
              <button className="dp-btn-secondary" onClick={enterRevise}>
                <Ico name="arrow-l" size={15} /> I want to change something
              </button>
              <span className="dp-pr-helper">You can always revisit completed phases</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
