import { useRef, useState, useEffect } from 'react';
import { PHASES, TONES, ChatMessage } from './data';
import { DualRingMark, Ico } from './Mark';

export type { ChatMessage };

// ── TopBarV2 ──────────────────────────────────────────────────────
interface TopBarV2Props {
  projectName: string;
  onHome: () => void;
}

export function TopBarV2({ projectName, onHome }: TopBarV2Props) {
  return (
    <div className="dp-topbar">
      <div className="dp-brand" onClick={onHome} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') onHome(); }}>
        <DualRingMark size={26} />
        <span className="dp-wordmark">delpheus</span>
      </div>
      <div className="dp-topbar-sep" />
      <span className="dp-crumb">
        <span style={{ cursor: 'pointer' }} onClick={onHome}>Workspace</span>
        <span style={{ margin: '0 10px', color: 'var(--dp-text-4)' }}>/</span>
        <strong>{projectName}</strong>
      </span>
      <div className="dp-topbar-spacer" />
      <button className="dp-topbar-btn"><Ico name="clock" size={14} /> History</button>
      <button className="dp-topbar-btn"><Ico name="settings" size={14} /></button>
      <div className="dp-user-dot">M</div>
    </div>
  );
}

// ── OracleChat ────────────────────────────────────────────────────
interface OracleChatProps {
  tone: string;
  currentPhase: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onPhaseComplete: () => void;
  canWrapUp: boolean;
}

export function OracleChat({ tone, currentPhase, messages, setMessages, onPhaseComplete, canWrapUp }: OracleChatProps) {
  const T = TONES[tone] || TONES.plainspoken;
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const send = (text: string) => {
    const t = (text || '').trim();
    if (!t) return;
    setMessages((m: ChatMessage[]) => [...m, { who: 'you' as const, text: t, fresh: true }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m: ChatMessage[]) => [...m, {
        who: 'guide' as const,
        fresh: true,
        text: "Got it — I've added that to our notes. Want to keep exploring, or are you ready to wrap this phase?",
      }]);
    }, 1200);
  };

  return (
    <div className="dp-oracle-col">
      <div className="dp-oracle-head">
        <div className="dp-mark-wrap">
          <DualRingMark size={28} />
          <h2>
            <span className="dp-oracle-name">Oracle</span>
            <span className="dp-oracle-sub">asking the questions</span>
          </h2>
        </div>
        <div className="dp-phase-indicator">
          <span className="dp-phase-num">PHASE {currentPhase + 1}/4</span>
          {PHASES[currentPhase]?.label}
        </div>
      </div>

      <div className="dp-oracle-body">
        <div className="dp-oracle-scroll" ref={scrollRef}>
          <div className="dp-oracle-inner">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`dp-msg ${m.who}`}
                style={m.fresh ? { animation: 'dp-fresh-in 400ms ease-out both' } : undefined}
              >
                <div className="dp-msg-avatar">
                  {m.who === 'guide' ? <DualRingMark size={20} /> : <span>M</span>}
                </div>
                <div className="dp-msg-body">
                  <span className="dp-msg-meta">{m.who === 'guide' ? 'Oracle' : 'You'}</span>
                  <div className="dp-msg-bubble">
                    {typeof m.text === 'string'
                      ? m.text.split('\n').filter(Boolean).map((line, j) => <p key={j}>{line}</p>)
                      : m.text}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="dp-msg guide">
                <div className="dp-msg-avatar"><DualRingMark size={20} /></div>
                <div className="dp-msg-body">
                  <span className="dp-msg-meta">Oracle</span>
                  <div className="dp-msg-bubble">
                    <div className="dp-chat-typing"><span /><span /><span /></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dp-suggestions">
          <div className="dp-suggestions-inner">
            {(T.suggestions || []).slice(0, 2).map((s: string, i: number) => (
              <button key={i} className="dp-chip" onClick={() => send(s)}>{s}</button>
            ))}
            {canWrapUp ? (
              <button
                className="dp-chip dp-wrap-chip ready"
                onClick={onPhaseComplete}
                title="All sub-phases drafted — review and approve"
              >
                <Ico name="check" size={13} /> Wrap up this phase
              </button>
            ) : (
              <button
                className="dp-chip dp-wrap-chip locked"
                disabled
                title="Finish the remaining sub-phases first"
              >
                <Ico name="check" size={13} /> Wrap up this phase
              </button>
            )}
          </div>
        </div>

        <div className="dp-oracle-composer">
          <div className="dp-oracle-composer-inner">
            <div className="dp-composer-inner">
              <textarea
                placeholder={T.composerPlaceholder || 'Reply to Oracle…'}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(draft); }
                }}
              />
              <div className="dp-composer-actions">
                <div className="dp-composer-hints">
                  <kbd>↵</kbd> to send · <kbd>⇧↵</kbd> for newline
                </div>
                <button className="dp-send-btn" onClick={() => send(draft)} disabled={!draft.trim()}>
                  <Ico name="send" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
