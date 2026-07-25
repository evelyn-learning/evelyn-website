/**
 * Contextual latency-cover layer (R32) — successor to the rotation-only ack.
 *
 * Grounded in the 2026-07-25 taxonomy of ~350 real student turns across ~25
 * sessions: 16 observed utterance types collapse into 6 cover buckets, 4
 * silence verdicts, and one instant-reply category (liveness checks like
 * "Are you still there?", which are CAUSED by our latency).
 *
 * Rules inherited from ack-layer.ts: covers are non-evaluative (at cover time
 * we don't know if the student was right); phrases are complete short
 * sentences ending in '.', never dangling em-dashes (Cartesia prosody);
 * pickers are index-deterministic so tests are exact.
 *
 * ORDER MATTERS in classifyCover: liveness and student-stall must win over
 * question/request shapes ("Can you hear me?" is not a request; "let me
 * think" is the student claiming the floor — the correct cover is silence).
 * Agreement-prefixed content ("Yeah, that's 16.") must reach numeric-echo,
 * not backchannel — the single highest-risk boundary in the taxonomy.
 */

import { ACK_PHRASES } from './ack-layer';

export type CoverCategory =
  | 'numeric-echo' | 'question' | 'request' | 'stuck' | 'think-aloud' | 'generic';

export type CoverVerdict =
  | { kind: 'cover'; category: CoverCategory }
  | { kind: 'silent'; reason: 'backchannel' | 'student-stall' | 'continuation' | 'synthetic' }
  | { kind: 'instant'; category: 'liveness' };

const LIVENESS_RE =
  /\b(are you (still )?(there|here|listening)|can you (hear|listen to)? ?me|are you able to hear)\b/i;
// Note: "which" is deliberately excluded from the leading-word alternation
// below — 'which is 0.' is a continuation of the tutor's own sentence, not a
// question, and no question test needs it ('what is jizya?' ends in '?',
// 'How does...' starts with how, 'tell me what' has its own alternate).
// STALL_RE also accepts "let me just try to remember" (filler + hedging
// verb before the stall verb) and a bare "for a second/moment" tail, both
// observed in the taxonomy's student-stall turns.
const STALL_RE =
  /\b(just|give me|gimme) (a |one )?(sec|second|moment|minute)\b|\blet me (just )?(try to )?(think|see|check|try|remember)\b|\bfor a (sec|second|moment)\b|\bhold on\b|^(uh,? |um,? )?wait\b|\bone (sec|second|moment)\b/i;
const STUCK_RE =
  /\bi (don'?t|do not) know\b|\bnot sure\b|\bno idea\b|\bi'?m (stuck|lost|confused)\b|\bnot getting it\b|\b(don'?t|do not) understand\b/i;
const REQUEST_RE =
  /\b(can|could|will|would) (you|u)\b.*\b(draw|show|write|repeat|read|explain|speak|say|slow|walk|demonstrate)|\b(let'?s|can we) (move|jump|go|do|try|wrap)\b|\bmove on\b|\bnext (one|problem|question|qn|round)\b|\b(harder|easier) (one|problem|question)\b|\bskip (this|it)\b|\bwrap up\b|\bwalk me (through|thru)\b/i;
const QUESTION_RE =
  /\?\s*$|^(what|why|how|when|where|who)\b|\b(what|why|how|where|when) (is|are|was|does|do|did|would|will)\b|^tell me\b|\btell me what\b/i;
const CONTINUATION_LEAD_RE =
  /^(and|which|that is|so that|before|after|with|is |equals|plus|minus|times|divided)\b/i;
// "minus"/"plus" are also numeric signs, not just continuation connectives —
// a bare signed number ("minus 22.") is the taxonomy's cat-1 numeric echo,
// not a continuation fragment, even though it starts with a lead word.
const BARE_SIGNED_NUMBER_RE = /^(minus|plus|negative)\s+\d+(\.\d+)?\.?\s*$/i;

const BACKCHANNEL_WORDS = new Set([
  'yeah', 'yes', 'yep', 'yup', 'ok', 'okay', 'mhm', 'mm', 'hmm', 'right',
  'gotcha', 'sure', 'alright', 'all', 'cool', 'oh', 'i', 'see', 'got', 'it',
  'makes', 'sense', 'uh', 'um', 'fine', 'so', 'good', 'nice', 'thanks',
  'thank', 'you',
]);

function words(t: string): string[] {
  return t.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(Boolean);
}

/** Last number-ish token run, for the echo cover ("minus 22", "16", "3.5"). */
export function extractAnswerToken(t: string): string | null {
  const m = t.match(/(?:(?:minus|negative)\s+)?\d+(?:\.\d+)?(?!.*\d)/i);
  return m ? m[0].trim() : null;
}

export function classifyCover(transcript: string): CoverVerdict {
  const t = transcript.trim();
  const w = words(t);

  // Synthetic bracketed dispatches ([start lesson], [Session-resumed…],
  // [Continuation-after-cutoff…], [Skip-button-clicked…]) never cover.
  if (t.startsWith('[')) return { kind: 'silent', reason: 'synthetic' };

  if (LIVENESS_RE.test(t) || (/^hello+[.,!?\s]*$/i.test(t)))
    return { kind: 'instant', category: 'liveness' };

  if (STALL_RE.test(t)) return { kind: 'silent', reason: 'student-stall' };

  // Backchannel: short, every word in the ack lexicon, no digits.
  if (w.length <= 4 && w.length > 0 && !/\d/.test(t) && w.every((x) => BACKCHANNEL_WORDS.has(x)))
    return { kind: 'silent', reason: 'backchannel' };

  // Continuation fragments of the tutor's own sentence ("which is 0.",
  // "and the upper half is 23, 28, 30."): short, continuation lead token.
  if (w.length <= 10 && CONTINUATION_LEAD_RE.test(t) && !QUESTION_RE.test(t) && !BARE_SIGNED_NUMBER_RE.test(t))
    return { kind: 'silent', reason: 'continuation' };

  if (STUCK_RE.test(t)) return { kind: 'cover', category: 'stuck' };
  if (REQUEST_RE.test(t)) return { kind: 'cover', category: 'request' };
  if (QUESTION_RE.test(t)) return { kind: 'cover', category: 'question' };

  // Short answer carrying a number → echo it back (taxonomy cats 1 + 5).
  if (w.length <= 8 && extractAnswerToken(t) !== null)
    return { kind: 'cover', category: 'numeric-echo' };

  if (w.length >= 22) return { kind: 'cover', category: 'think-aloud' };

  return { kind: 'cover', category: 'generic' };
}

/** {a} is replaced with the extracted answer token. */
const POOLS: Record<CoverCategory, readonly string[]> = {
  'numeric-echo': ['Hmm, {a}.', '{a}. Okay.', 'Okay, {a}. One moment.'],
  question: ['Good question.', 'Ah, let me think.', 'Hmm, let me see.'],
  request: ['Sure.', 'Okay.', 'Alright, one moment.'],
  stuck: ['No worries.', "That's alright, let me think.", 'Okay, let me help.'],
  'think-aloud': ['Okay, let me follow that.', 'Alright, let me check your steps.', 'Okay, one moment.'],
  generic: ACK_PHRASES,
};

export const LIVENESS_REPLIES = [
  "Yep, I'm here. Still thinking.",
  "I'm here. Give me a second.",
  'Still here. Working on it.',
] as const;

export function pickCoverPhrase(
  category: CoverCategory,
  transcript: string,
  turnIndex: number,
  lastIndex: number | null,
): { text: string; index: number } {
  const pool = POOLS[category];
  const n = pool.length;
  let index = ((turnIndex % n) + n) % n;
  if (index === lastIndex) index = (index + 1) % n;
  let text = pool[index];
  if (text.includes('{a}')) {
    const a = extractAnswerToken(transcript) ?? '';
    text = a ? text.replace(/\{a\}/g, a) : POOLS.generic[index % POOLS.generic.length];
  }
  return { text, index };
}

export function pickLivenessReply(turnIndex: number): string {
  return LIVENESS_REPLIES[((turnIndex % LIVENESS_REPLIES.length) + LIVENESS_REPLIES.length) % LIVENESS_REPLIES.length];
}

/**
 * Escalating in-flight covers. One contextual cover at COVER_FIRE_MS is the
 * head; if the brain still hasn't produced sentence-0, tier 1 (~9s) keeps the
 * student, tier 2 (~25s) is HONEST about the cause (baseline p90 first
 * sentence 9.2s — tier 2 only fires on genuinely sick turns). At
 * TURN_GIVE_UP_MS the client stops waiting entirely (Task 4 wires the abort):
 * riding the server's full 3x30s retry ladder (~93s, silence audit) is worse
 * than an honest reset. Tiers are one-shot per turn.
 */
export const COVER_FIRE_MS = 1200;
export const TURN_GIVE_UP_MS = 45_000;

export const ESCALATION_TIERS = [
  {
    atMs: 9_000,
    pool: [
      "Still with you. This one's taking me a second.",
      'Hang on, still working it out.',
      'One more moment, almost there.',
    ],
  },
  {
    atMs: 25_000,
    pool: [
      "Sorry, my connection's being slow. Hang on.",
      'Bear with me, something on my end is being slow today.',
    ],
  },
] as const;

export interface EscalationState { fired: boolean[] }
export function createEscalationState(): EscalationState {
  return { fired: ESCALATION_TIERS.map(() => false) };
}

export type EscalationAction =
  | { action: 'wait' }
  | { action: 'speak'; tier: number; text: string }
  | { action: 'give-up' };

export function decideEscalation(
  state: EscalationState,
  msSinceDispatch: number,
  turnIndex: number,
): EscalationAction {
  if (msSinceDispatch >= TURN_GIVE_UP_MS) return { action: 'give-up' };
  for (let i = ESCALATION_TIERS.length - 1; i >= 0; i--) {
    if (msSinceDispatch >= ESCALATION_TIERS[i].atMs && !state.fired[i]) {
      state.fired[i] = true;
      const pool = ESCALATION_TIERS[i].pool;
      return { action: 'speak', tier: i, text: pool[((turnIndex % pool.length) + pool.length) % pool.length] };
    }
  }
  return { action: 'wait' };
}

/**
 * Consecutive-noise nag (silence audit §5): real speech repeatedly
 * misclassified as noise was an UNBOUNDED silent drop with zero feedback.
 * Two ≥1.5s "noise" drops within 30s → speak one "didn't catch that" line,
 * then 60s cooldown. True ambient noise (short bursts) never trips it.
 */
export interface NoiseNagState { drops: number; windowStartMs: number; lastNagMs: number }
export function createNoiseNagState(): NoiseNagState {
  return { drops: 0, windowStartMs: 0, lastNagMs: -Infinity };
}
export const NOISE_NAG_MIN_SPOKE_MS = 1_500;
export const NOISE_NAG_WINDOW_MS = 30_000;
export const NOISE_NAG_COOLDOWN_MS = 60_000;
export const NOISE_NAG_LINE = "Sorry, I didn't catch that. Could you say it again?";

export function recordNoiseDrop(
  state: NoiseNagState, nowMs: number, spokeMs: number,
): { nag: boolean } {
  if (spokeMs < NOISE_NAG_MIN_SPOKE_MS) return { nag: false };
  if (nowMs - state.windowStartMs > NOISE_NAG_WINDOW_MS) {
    state.drops = 0;
    state.windowStartMs = nowMs;
  }
  state.drops++;
  if (state.drops >= 2 && nowMs - state.lastNagMs >= NOISE_NAG_COOLDOWN_MS) {
    state.lastNagMs = nowMs;
    state.drops = 0;
    return { nag: true };
  }
  return { nag: false };
}
