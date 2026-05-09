import { ReactNode } from 'react';

export interface Phase {
  id: string;
  label: string;
  sub: string;
  prompt: string;
}

export const PHASES: Phase[] = [
  { id: 'problem',   label: 'Problem',   sub: 'What needs fixing',         prompt: 'What problem are we solving?' },
  { id: 'who',       label: 'Who & Why', sub: 'The people and the stakes', prompt: 'Who feels this, and why does it matter?' },
  { id: 'solution',  label: 'Solution',  sub: 'How we fix it',             prompt: 'How should we solve it?' },
  { id: 'blueprint', label: 'Blueprint', sub: 'Review & rework',           prompt: "Let's draft the build plan." },
  { id: 'handoff',   label: 'Hand-off',  sub: 'Ship it',                   prompt: 'Pick where this goes.' },
];

export interface SubPhase {
  id: string;
  label: string;
  hint: string;
}

export const SUB_PHASES: Record<string, SubPhase[]> = {
  problem: [
    { id: 'hypothesis',  label: 'Hypothesis',         hint: 'The bet — if X, then Y, because Z' },
    { id: 'problem',     label: 'Problem statement',  hint: "What's broken about today" },
    { id: 'assumptions', label: 'Working assumptions',hint: "What we're betting on" },
  ],
  who: [
    { id: 'personas',    label: 'Primary persona',    hint: "The person whose Monday changes" },
    { id: 'stakes',      label: 'Stakes & impact',    hint: 'What it costs them today' },
    { id: 'secondary',   label: 'Secondary users',    hint: 'Who else is affected' },
  ],
  solution: [
    { id: 'features',    label: 'Features',           hint: 'MoSCoW-prioritised' },
    { id: 'criteria',    label: 'Acceptance criteria',hint: 'How we know it works' },
    { id: 'out-of-scope',label: 'Out of scope',       hint: "What we're choosing not to build" },
  ],
  blueprint: [
    { id: 'epics',   label: 'Epics',           hint: 'Sized chunks of work' },
    { id: 'stories', label: 'User stories',    hint: 'With Gherkin tests' },
    { id: 'rules',   label: 'Rules & technical',hint: 'Business rules + tech requirements' },
  ],
};

export type SubStatus = 'done' | 'building' | 'pending';

export const DEMO_SUB_PROGRESS: Record<string, SubStatus> = {
  'problem.hypothesis':    'done',
  'problem.problem':       'done',
  'problem.assumptions':   'done',
  'who.personas':          'done',
  'who.stakes':            'done',
  'who.secondary':         'building',
  'solution.features':     'building',
  'solution.criteria':     'pending',
  'solution.out-of-scope': 'pending',
  'blueprint.epics':       'pending',
  'blueprint.stories':     'pending',
  'blueprint.rules':       'pending',
};

export function getSubStatus(phaseId: string, subId: string, currentIdx: number, phaseIdx: number): SubStatus {
  const explicit = DEMO_SUB_PROGRESS[`${phaseId}.${subId}`];
  if (explicit) return explicit;
  if (phaseIdx < currentIdx) return 'done';
  if (phaseIdx === currentIdx) return 'building';
  return 'pending';
}

export function isPhaseReadyForReview(phaseIdx: number, currentIdx: number): boolean {
  const ph = PHASES[phaseIdx];
  if (!ph) return false;
  const subs = SUB_PHASES[ph.id] || [];
  if (!subs.length) return false;
  return subs.every(s => getSubStatus(ph.id, s.id, currentIdx, phaseIdx) === 'done');
}

// ── Chat message type ──────────────────────────────────────────────────
export interface ChatMessage {
  who: 'guide' | 'you';
  text: ReactNode;
  fresh?: boolean;
}

// ── Tone variants ──────────────────────────────────────────────────────
export interface Tone {
  chat: ChatMessage[];
  suggestions: string[];
  composerPlaceholder: string;
  spec: { name: string; subtitle: string };
}

export type ToneKey = 'plainspoken' | 'technical' | 'poetic' | 'product';

export const TONES: Record<ToneKey, Tone> = {
  plainspoken: {
    chat: [
      { who: 'guide', text: 'Nice work on the problem statement. Before we talk solutions, I want to get a clear picture of the people who feel this problem.\n\nWho is the very first person who benefits when this gets fixed?' },
      { who: 'you',   text: 'Volunteer coordinators at small food banks. They spend Sunday nights texting people to confirm shifts for Monday morning.' },
      { who: 'guide', text: "Got it. Let's sharpen that picture a little.\n\nA few things help me build a useful spec:\n• Roughly how many shifts are they coordinating a week?\n• Are they paid staff, or volunteers themselves?\n• What happens today if someone doesn't reply?" },
      { who: 'you',   text: "Usually volunteers themselves. Maybe 40–80 shifts a week. If nobody replies, they show up short-staffed and a pallet of produce can sit out too long." },
      { who: 'guide', text: "That's a real stake — wasted food, strained teams. I'll capture this. The spec is updating on the right.\n\nOne more: is this person picking up the phone themselves, or are they forwarding texts to a group thread?" },
    ],
    suggestions: ['They usually forward to a group thread', 'They call people individually', 'Skip — move on to Solution'],
    composerPlaceholder: 'Answer in your own words…',
    spec: { name: 'Food bank shift coordinator', subtitle: "A quieter way to confirm Monday's crew" },
  },
  technical: {
    chat: [
      { who: 'guide', text: 'Problem statement captured. Proceeding to user definition.\n\nIdentify the primary user persona who benefits first from resolution of this problem.' },
      { who: 'you',   text: 'Volunteer coordinators at small food banks. Confirming Monday shifts on Sunday nights by SMS.' },
      { who: 'guide', text: 'Acknowledged. Additional attributes required to complete persona model:\n• Shift volume per week\n• Employment type (paid / volunteer)\n• Failure mode when non-response occurs' },
      { who: 'you',   text: 'Volunteers. 40–80 shifts/week. Non-response → understaffed shift → perishable donations spoil.' },
      { who: 'guide', text: 'Persona recorded. Impact vector: donation loss + team strain. Spec panel synchronized.\n\nClarification: is communication 1:1 or broadcast (group thread / list)?' },
    ],
    suggestions: ['Broadcast to group thread', '1:1 SMS', 'Advance to Solution phase'],
    composerPlaceholder: 'Enter response…',
    spec: { name: 'Food bank shift coordinator', subtitle: 'SMS confirmation workflow replacement' },
  },
  poetic: {
    chat: [
      { who: 'guide', text: "You've named the problem well. Now — who carries it?\n\nThink of the first person whose morning is different when this is solved. Tell me about them." },
      { who: 'you',   text: "Volunteer coordinators at small food banks. Their Sundays belong to texts they hope people will answer." },
      { who: 'guide', text: "That's a tender detail — Sunday evening spent chasing confirmations.\n\nA few things will help the picture come clear:\n• How many shifts, roughly, does a week hold?\n• Are they paid for this work, or giving their time?\n• When a reply doesn't come, what does Monday morning look like?" },
      { who: 'you',   text: "Volunteers themselves, mostly. Forty to eighty shifts. When the reply doesn't come, produce sits too long and the team feels it." },
      { who: 'guide', text: "I can see it. I've set that down on the right.\n\nOne more thread: is the coordinator speaking to each person directly, or into a room — a group thread?" },
    ],
    suggestions: ['A group thread, mostly', 'One by one', 'Onward — to the solution'],
    composerPlaceholder: 'Say it however it comes…',
    spec: { name: 'Food bank shift coordinator', subtitle: 'Holding the morning together' },
  },
  product: {
    chat: [
      { who: 'guide', text: "Good problem statement — specific, measurable, tied to a real bottleneck.\n\nLet's define the primary persona. Who feels the pain first?" },
      { who: 'you',   text: "Volunteer coordinators at small food banks. They text people to confirm Monday shifts on Sunday nights." },
      { who: 'guide', text: "Good. A few things I want to lock before we move on:\n• Shift volume per week (order of magnitude)\n• Paid staff or volunteers themselves\n• What the non-response failure mode actually costs" },
      { who: 'you',   text: "Volunteers, not staff. 40–80 shifts/week. When nobody replies they show up short-staffed and perishables spoil." },
      { who: 'guide', text: "Got it — persona is volunteer-staffed coordinator, impact vector is perishable loss. I've added both to the spec.\n\nOne more before Solution: 1:1 SMS, or broadcast to a group thread? This changes the flow significantly." },
    ],
    suggestions: ['Broadcast to group thread', '1:1 SMS, individually', 'Ready — move to Solution'],
    composerPlaceholder: 'Your response…',
    spec: { name: 'Food bank shift coordinator', subtitle: 'Confirmation workflow replacement' },
  },
};

export type PersonaKey = 'beginner' | 'product' | 'engineer';
export type ConfidenceKey = 'high' | 'medium' | 'low';
export type ScreenState = 'chat' | 'review';

const PERSONA_TO_TONE: Record<PersonaKey, ToneKey> = {
  beginner: 'plainspoken',
  product:  'product',
  engineer: 'technical',
};

export function resolveTone(key: string): ToneKey {
  if (!key) return 'plainspoken';
  if (key in TONES) return key as ToneKey;
  if (key in PERSONA_TO_TONE) return PERSONA_TO_TONE[key as PersonaKey];
  return 'plainspoken';
}

// ── Phase review content ───────────────────────────────────────────────
export interface ReviewSection {
  id: string;
  label: string;
  body: string;
}

export interface PhaseOutcome {
  sections: ReviewSection[];
}

export const PHASE_OUTCOMES: Record<number, PhaseOutcome> = {
  0: {
    sections: [
      { id: 'problem',    label: 'Problem statement',
        body: "Small food banks lose hours each week confirming volunteer shifts over text. When people don't reply, Monday morning arrives short-staffed and donated produce spoils." },
      { id: 'hypothesis', label: 'Hypothesis',
        body: 'A simpler, asynchronous confirmation flow will raise on-time response rates and cut the Sunday-night coordination load.' },
      { id: 'workaround', label: 'Current workaround',
        body: 'Individual SMS, group threads, occasional phone calls on Sunday evenings. No tracking, no nudges, no visibility into who has replied.' },
      { id: 'impact',     label: 'Impact',
        body: 'Per coordinator, roughly 2–3 hours a week spent chasing confirmations. Missed shifts cascade into spoiled perishables — one coordinator reported losing a full pallet of produce last month.' },
    ],
  },
  1: {
    sections: [
      { id: 'primary-users',   label: 'Primary users',
        body: 'Volunteer coordinators at small food banks. They spend Sunday nights texting people to confirm shifts for Monday morning. Usually volunteers themselves, coordinating 40–80 shifts a week.' },
      { id: 'current-state',   label: 'Current state',
        body: "They text people one-by-one, or sometimes forward to a group thread. No tracking, no nudges. If nobody replies they show up Monday short-staffed and a pallet of produce can sit out too long." },
      { id: 'success-metrics', label: 'Success metrics',
        body: 'Reduce Sunday-night coordination time from ~2–3 hours to under 30 minutes. Hit ≥90% confirmed shifts by Saturday evening. Cut produce loss from missed shifts to zero in a 4-week pilot.' },
    ],
  },
};

export const REVISE_PROMPT_HINTS: Record<string, string[]> = {
  'primary-users':   ['Narrow the audience', 'Add a secondary user', 'I picked the wrong type of user'],
  'current-state':   ['Add more detail', "This isn't quite right", 'Reframe around the pain'],
  'success-metrics': ['Make these measurable', 'Different metrics entirely', "I don't know how to measure this"],
  'problem':         ['Sharpen the problem', 'Different problem entirely', 'Add a constraint'],
  'hypothesis':      ['Reframe the hypothesis', 'Make it more falsifiable'],
  'workaround':      ['Add another workaround', 'Be more specific'],
  'impact':          ['Add a number', 'Reframe in user terms'],
};

// ── Insight variants ───────────────────────────────────────────────────
export interface InsightVariant {
  badge: string;
  summary: string;
  assumptions: string[];
  cta: string;
}

export const INSIGHT_VARIANTS: Record<ConfidenceKey, InsightVariant> = {
  high: {
    badge: 'High',
    summary: 'Problem definition is solid — specific, measurable, and tied to a real bottleneck.',
    assumptions: [
      'Non-response rate is the primary failure mode (not late response)',
      'Coordinators have reliable phone access during confirmation windows',
    ],
    cta: 'View assumptions',
  },
  medium: {
    badge: 'Medium',
    summary: 'The problem is clear, but scale and adoption are still unconfirmed.',
    assumptions: [
      'Coordinators are typically volunteers, not paid staff',
      'Shift volume of 40–80/week is representative, not an outlier',
      'Non-response leads to wasted perishables most weeks',
      'Group threads already exist at most food banks',
    ],
    cta: 'Ask Oracle to validate',
  },
  low: {
    badge: 'Low',
    summary: "Several key assumptions haven't been validated. Worth addressing before moving on.",
    assumptions: [
      "No data on whether coordinators would adopt a new tool",
      'Spoilage impact is anecdotal — needs a specific figure',
      'Unclear how coordinators are currently reached (SMS? app? calls?)',
    ],
    cta: 'Address gaps with Oracle',
  },
};

// ── Artifact peek content ──────────────────────────────────────────────
export type BodyKind = 'p' | 'meta' | 'persona' | 'feature' | 'criterion' | 'callout' | 'placeholder';

export interface BodyBlock {
  kind: BodyKind;
  text?: string | React.ReactNode;
  items?: Array<{ k: string; v: string }>;
  name?: string;
  role?: string;
  weight?: string;
  bullets?: string[];
  quote?: string;
  moscow?: string;
  why?: string;
  when?: string;
  then?: string;
}

export interface ArtifactData {
  label: string;
  status: 'done' | 'building' | 'pending';
  statusLabel: string;
  phaseIdx: number;
  eyebrow: string;
  headline: string;
  body: BodyBlock[];
}

export const ARTIFACT_CONTENT: Record<string, ArtifactData> = {
  'problem.hypothesis': {
    label: 'Hypothesis', status: 'done', statusLabel: 'Drafted in Phase 1',
    phaseIdx: 0, eyebrow: 'PHASE 1 · PROBLEM',
    headline: "If we replace Sunday-night text chasing with one-tap async confirmation, we believe coordinators will recover their evenings — because the failure mode is non-response, not unwillingness.",
    body: [
      { kind: 'p', text: 'The bet sits on three legs: that volunteers do intend to show up; that one-tap confirmation removes the friction that causes silence; and that coordinators feel the recovered time as a meaningful win.' },
      { kind: 'meta', items: [
        { k: 'If we…',   v: 'Replace SMS chasing with async tap-to-confirm' },
        { k: 'Then…',    v: 'Coordinators reclaim Sunday evening + reduce spoilage' },
        { k: 'Because…', v: 'Non-response is friction, not refusal' },
      ]},
      { kind: 'callout', text: 'Hypothesis sharpened over three rounds with the Oracle. Ready to flow into Problem statement.' },
    ],
  },
  'problem.problem': {
    label: 'Problem statement', status: 'done', statusLabel: 'Drafted in Phase 1',
    phaseIdx: 0, eyebrow: 'PHASE 1 · PROBLEM',
    headline: "Small food banks lose hours each week confirming Monday's shifts.",
    body: [
      { kind: 'p', text: "When volunteers don't reply to Sunday-night confirmation texts, coordinators arrive to a short-staffed morning — and donated produce sits out longer than it should." },
      { kind: 'meta', items: [
        { k: 'Pain owner',   v: 'Volunteer coordinators (often volunteers themselves)' },
        { k: 'Frequency',    v: 'Weekly · 40–80 shifts' },
        { k: 'Failure mode', v: 'Non-response → understaffed shift → spoilage' },
      ]},
      { kind: 'callout', text: 'Confidence: medium. Spoilage impact is anecdotal — worth tightening before Phase 4.' },
    ],
  },
  'problem.assumptions': {
    label: 'Working assumptions', status: 'done', statusLabel: 'Drafted in Phase 1',
    phaseIdx: 0, eyebrow: 'PHASE 1 · PROBLEM',
    headline: "Four bets we're making — explicit, so we can test them later.",
    body: [
      { kind: 'p', text: "Assumptions are commitments to revisit, not facts. Each one carries a confidence level so the team knows where the spec is solid and where it's leaning on hope." },
      { kind: 'meta', items: [
        { k: 'Confidence', v: 'Coordinators are volunteers, not paid staff' },
        { k: 'Confidence', v: 'Shift volume of 40–80/week is representative' },
        { k: 'Hypothesis', v: 'Group threads already exist at most food banks' },
        { k: 'Hypothesis', v: 'Non-response leads to spoilage most weeks' },
      ]},
      { kind: 'callout', text: 'Two of these are still hypotheses, not facts. Worth a phone call to one or two coordinators in Phase 4.' },
    ],
  },
  'who.personas': {
    label: 'Primary persona', status: 'done', statusLabel: 'Drafted in Phase 2',
    phaseIdx: 1, eyebrow: 'PHASE 2 · WHO & WHY',
    headline: "Maren's Monday is the design constraint.",
    body: [
      { kind: 'persona', name: 'Maren — Volunteer Coordinator', role: 'Primary', weight: 'Primary',
        bullets: ['Often a volunteer herself, not paid staff', 'Confirms 40–80 shifts a week, mostly via SMS group threads', 'Sundays are spent chasing replies that may not come'],
        quote: '"If three people don\'t answer, my Monday is already broken."' },
      { kind: 'callout', text: "Maren is the user whose week visibly changes when this works. Every feature gets weighed against her Sunday." },
    ],
  },
  'who.stakes': {
    label: 'Stakes & impact', status: 'done', statusLabel: 'Drafted in Phase 2',
    phaseIdx: 1, eyebrow: 'PHASE 2 · WHO & WHY',
    headline: 'What Sunday-night chasing actually costs.',
    body: [
      { kind: 'meta', items: [
        { k: 'Time lost',      v: '2–3 hours per coordinator each week' },
        { k: 'Knock-on cost',  v: 'Spoiled produce on understaffed Mondays (anecdotal)' },
        { k: 'Burnout signal', v: 'Coordinator turnover — hard to replace mid-cycle' },
        { k: 'Trust cost',     v: 'Volunteers feel hassled; coordinators feel ignored' },
      ]},
      { kind: 'callout', text: 'Spoilage figure is still anecdotal. The Oracle flagged this for Phase 4 validation.' },
    ],
  },
  'who.secondary': {
    label: 'Secondary users', status: 'building', statusLabel: 'Taking shape — one more pass',
    phaseIdx: 1, eyebrow: 'PHASE 2 · WHO & WHY',
    headline: 'Who else feels this — and how much weight they carry.',
    body: [
      { kind: 'p', text: "The volunteers themselves are affected, but the design centres Maren. Jules' needs are heard — they just don't override hers." },
      { kind: 'persona', name: 'Jules — Shift Volunteer', role: 'Secondary', weight: 'Secondary',
        bullets: ['Replies when convenient, often hours late', "Doesn't feel ownership over the confirmation step", 'Will swap shifts informally if asked directly'],
        quote: '"I show up if I said I would. The texts pile up."' },
      { kind: 'callout', text: 'Oracle is asking one more question — whether donors should be tracked here too. Answer in chat to wrap this sub-phase.' },
    ],
  },
  'solution.features': {
    label: 'Features', status: 'building', statusLabel: 'Taking shape — Phase 3 in progress',
    phaseIdx: 2, eyebrow: 'PHASE 3 · SOLUTION',
    headline: 'Three features the Oracle is currently weighing.',
    body: [
      { kind: 'feature', name: 'Async confirm-by-tap', moscow: 'Must',    why: 'Removes the back-and-forth — coordinator sees confirmation status at a glance.' },
      { kind: 'feature', name: 'Auto-nudge for non-responders', moscow: 'Should', why: 'A second touch at a calm hour catches most missed replies.' },
      { kind: 'feature', name: 'Group thread bridge', moscow: 'Could',   why: "Posts confirmation summaries back into the team's existing chat." },
      { kind: 'callout', text: 'Oracle is currently asking about the nudge cadence — answer in chat to lock this list in.' },
    ],
  },
  'solution.criteria': {
    label: 'Acceptance criteria', status: 'building', statusLabel: 'First draft — will firm up in Phase 4',
    phaseIdx: 2, eyebrow: 'PHASE 3 · SOLUTION',
    headline: "How we'll know it's working.",
    body: [
      { kind: 'criterion', when: 'Coordinator opens the shift list on Sunday evening', then: 'Each shift shows confirmed / pending / declined inline, no chasing required.' },
      { kind: 'criterion', when: "A volunteer hasn't replied 12 hours before shift", then: 'The system sends one nudge — not the coordinator.' },
      { kind: 'criterion', when: "A volunteer can't make it", then: 'Decline takes one tap; coordinator sees the gap immediately.' },
      { kind: 'callout', text: 'Three more criteria will likely emerge once the nudge cadence is decided.' },
    ],
  },
  'solution.out-of-scope': {
    label: 'Out of scope', status: 'pending', statusLabel: 'Not yet started — finalised after features lock',
    phaseIdx: 2, eyebrow: 'PHASE 3 · SOLUTION',
    headline: "What this build deliberately won't do.",
    body: [
      { kind: 'p', text: "This section is intentionally empty until Phase 4. The Oracle will draft a list of explicit non-goals once features and criteria are settled — out-of-scope is a contract, not a wishlist, and it works best when the rest of the spec is firm." },
      { kind: 'placeholder', items: [{ k: '', v: 'Volunteer scheduling beyond confirmation' }, { k: '', v: 'Donor-side communication' }, { k: '', v: 'Multi-location coordination' }, { k: '', v: 'Payments / stipends' }] },
      { kind: 'callout', text: "These are guesses, shown so you can react. Nothing is written into the spec yet." },
    ],
  },
  'blueprint.epics': {
    label: 'Epics', status: 'pending', statusLabel: 'Not yet started — Phase 4',
    phaseIdx: 3, eyebrow: 'PHASE 4 · BLUEPRINT',
    headline: 'Sized chunks of work the team can plan against.',
    body: [
      { kind: 'p', text: 'Once features lock in Phase 3, the Oracle slices them into epics — each one a coherent piece of work a small team can finish in a sprint or two.' },
      { kind: 'placeholder', items: [{ k: '', v: 'Async confirmation flow' }, { k: '', v: 'Nudge engine (rules + delivery)' }, { k: '', v: 'Coordinator dashboard' }, { k: '', v: 'Group-thread bridge (if scoped in)' }] },
      { kind: 'callout', text: 'Placeholders only. The Oracle drafts epics after the feature list is committed.' },
    ],
  },
  'blueprint.stories': {
    label: 'User stories', status: 'pending', statusLabel: 'Not yet started — Phase 4',
    phaseIdx: 3, eyebrow: 'PHASE 4 · BLUEPRINT',
    headline: 'Stories with Gherkin acceptance tests, ready to estimate.',
    body: [
      { kind: 'p', text: "Each story carries a Given/When/Then so engineers and QA share one definition of done. The Oracle drafts these by walking through Maren's and Jules' flows step by step." },
      { kind: 'callout', text: 'Pending. Shows up here as soon as Phase 3 wraps.' },
    ],
  },
  'blueprint.rules': {
    label: 'Rules & technical', status: 'pending', statusLabel: 'Not yet started — Phase 4',
    phaseIdx: 3, eyebrow: 'PHASE 4 · BLUEPRINT',
    headline: 'Business rules and technical requirements.',
    body: [
      { kind: 'p', text: "The non-functional layer: nudge windows, retention, accessibility, channel choice, integrations. The pieces that don't fit on a screen but make or break the product on day one." },
      { kind: 'placeholder', items: [{ k: '', v: 'One nudge per shift, never two' }, { k: '', v: 'Confirmation expires 30 min before shift' }, { k: '', v: 'SMS is the canonical channel; in-app is the upgrade path' }, { k: '', v: 'No volunteer PII shared across food banks' }] },
      { kind: 'callout', text: 'Pending. Drafted alongside stories in Phase 4.' },
    ],
  },
};
