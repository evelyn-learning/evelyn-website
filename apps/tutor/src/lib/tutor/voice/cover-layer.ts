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

/** One number-ish answer EXPRESSION: optional sign (literal "-" glued to the
 *  digits, or a spoken "minus"/"negative"), digits with optional decimal,
 *  optional fraction tail ("/6", itself optionally signed). R36 (live
 *  2026-07-30): the old extractor grabbed only the last digit RUN, so
 *  "-3/6" echoed as "ok 6" and "m is 4 and b is -2" as "ok 2". */
const ANSWER_EXPR_RE = /(?:-|\b(?:minus|negative)\s+)?(?:\d+(?:\.\d+)?|\.\d+)(?:\s*\/\s*-?\d+(?:\.\d+)?)?/gi;

/** R45 T7 (live): "i over 1 + x" (ASR for "1/(1+x)") echoed as "1 over 1" —
 *  the fraction capture stopped at the "+". Per R36's precedent (multi-number
 *  turns → null → generic ack), a captured fraction followed by MORE math
 *  tokens must refuse rather than truncate and misquote. */
const FRACTION_CONTINUATION_RE =
  /(?:^|\s)(?:plus|minus|times|over|divided(?:\s+by)?|[+\-*/^])\s*\S/i;

/** R50 T4 (live, portal-1f44f0eb + portal-14bbe45a): the echo dropped the
 *  words ATTACHED to the number and quoted the bare digits back, which reads
 *  as a mishear. Four real turns:
 *    "B 5 is deeper down."               -> "Okay, 5."
 *    "flow 3."           (ASR: floor 3)  -> "Okay, 3."
 *    "point 3 repeating is smaller"      -> "3. Okay."
 *    "66.6 bar."                         -> "Hmm, 66.6."
 *  The last two are not cosmetic: "point 3" is 0.3 and "66.6 bar" is 66.6
 *  REPEATING, so the echo states a different VALUE than the student did.
 *
 *  Same principle already applied twice in this file (R36 multi-number, R45
 *  fraction-continuation): refuse rather than truncate and misquote. The
 *  asymmetry makes refusing cheap — a generic cover ("One moment.") is never
 *  wrong, while a confident wrong echo actively confuses.
 *
 *  Implemented as an ALLOW-list of tokens that may sit directly before the
 *  number, not a deny-list of labels: labels are open-ended and arrive
 *  ASR-garbled ("flow" for "floor"), so an enumeration of them would miss
 *  exactly the cases nobody predicted. Anything unrecognised => refuse. */
const ANSWER_PREFIX_ALLOWED = new Set([
  // fillers / discourse markers
  'uh', 'um', 'er', 'erm', 'ah', 'oh', 'hmm', 'well', 'so', 'like', 'okay',
  'ok', 'yeah', 'yes', 'yep', 'yup', 'no', 'nope', 'right', 'sure', 'and',
  'or', 'then', 'but', 'alright',
  // copulas / auxiliaries (covers "that'll be 28", "it's -2")
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am', 'will', 'would',
  'could', 'should', 'can', 'may', 'might', 'must', 'do', 'does', 'did',
  'get', 'gets', 'got', 'make', 'makes', 'made', 'come', 'comes', 'came',
  // pronouns / determiners (covers "that's 16")
  'it', 'its', "it's", 'that', "that's", 'thats', 'this', 'they', 'them',
  'i', 'we', 'you', 'he', 'she', 'the', 'a', 'an', 'my', 'your',
  // answering verbs
  'think', 'thinks', 'guess', 'say', 'says', 'said', 'believe', 'reckon',
  'answer', 'answers', 'equals', 'equal', 'gives', 'give', 'means', 'put',
  // hedges
  'maybe', 'probably', 'roughly', 'about', 'around', 'approximately',
  'exactly', 'just', 'only', 'still', 'actually', 'definitely', 'perhaps',
  'possibly', 'almost', 'nearly',
  // prepositions / comparatives
  'to', 'of', 'at', 'by', 'with', 'than', 'as', 'into', 'from', 'for',
  // arithmetic cues (already part of the captured expression grammar)
  'plus', 'minus', 'negative', 'times', 'over', 'divided',
]);

/** Words IMMEDIATELY AFTER the number that change what it denotes, so
 *  echoing the bare number misstates the student's answer. "bar"/"repeating"
 *  are the live cases (66.6 vs 66.6-repeating); the fraction-denominator
 *  words cover "3 fourths" echoing as "3". */
const VALUE_MODIFIER_TRAIL_RE =
  /^\s*(?:%|(?:bar|repeating|recurring|repeated|percent|percentage|squared|cubed|root|halves|thirds|fourths|quarters|fifths|sixths|sevenths|eighths|ninths|tenths)\b)/i;

/** R50b (live, portal-d7825123): ASR writes a bare decimal as ".6", and the
 *  original expression matched only the digit RUN — so ".6" echoed as "6",
 *  stating a value ten times too large. The word form ("point 6") was already
 *  refused by the prefix rule; the SYMBOL form slipped straight through.
 *  Normalised rather than refused, because ".6" IS the student's whole answer
 *  and "point six" is a useful, correct echo. */
function normaliseLeadingDot(token: string): string {
  return token.replace(/(^|[^\d])\.(\d)/g, '$10.$2');
}

/** R50c (live, portal-0984e111): the student's answer was an ALGEBRAIC
 *  EXPRESSION and the echo quoted only its number, dropping the variable:
 *    "SS plus 4."              -> "Okay, 4."        (student meant s + 4)
 *    "Yeah, there will be 17 plus A." -> "Hmm, 17."  (meant 17 + a)
 *  Third variant of one class in one night (R50 caught the word forms
 *  "point 6"/"60 percent"; R50b the symbol forms ".6"/"60%"), and the reason
 *  each slipped is the same: the guard was built from the surface forms in
 *  the last transcript instead of from the question "is the captured token
 *  the WHOLE answer?".
 *
 *  This asks that question directly. R45 already established the principle
 *  for one case — "a captured fraction followed by MORE math tokens must
 *  refuse rather than truncate and misquote" — it was simply never
 *  generalised past fractions. An operator sitting OUTSIDE the captured
 *  token means the utterance is an expression and the token is a fragment
 *  of it.
 *
 *  Deliberately operator-based, NOT variable-detection: "is that token a
 *  variable or an English word?" is unanswerable ("a" is both an article
 *  and the variable in the live case above), whereas "is there an operator
 *  the captured token does not cover?" is decidable from the text. */
const MATH_OPERATOR_RE =
  /(?:^|\s)(?:plus|minus|times|over|divided(?:\s+by)?)(?:\s|$)|[+*/×÷]/i;

/** Lowercased word directly before `index`, apostrophes normalised to ASCII.
 *  Empty string when the number opens the utterance (always allowed). */
function tokenBefore(t: string, index: number): string {
  const head = t.slice(0, index).replace(/[\u2018\u2019]/g, "'");
  const m = /([A-Za-z][A-Za-z']*)[^A-Za-z']*$/.exec(head);
  return m ? m[1].toLowerCase() : '';
}

/** The transcript's single answer expression, in SPOKEN form ("minus 3 over
 *  6"). Null when there is no number — or MORE than one ("m is 4 and b is
 *  -2"): a lone echoed tail misquotes the student, so multi-number turns
 *  fall back to the generic (non-echo) cover instead. Also null when the
 *  capture is fraction-shaped (literal "/", or the spoken cue "over"/
 *  "divided" anywhere in the utterance — the cue survives even when ASR
 *  garbles the numerator into a non-digit, e.g. "i over 1") AND the text
 *  past the captured token still carries more math — a truncated fraction
 *  read ("1 over 1") misquotes the student worse than a generic ack. */
/** Why a numeric echo was refused. Every refusal path in
 *  `extractAnswerTokenDetailed` returns one of these. */
export type AnswerRefusalReason =
  | 'no-number'
  | 'multi-number'
  | 'fraction-continuation'
  | 'prefix-not-allowed'
  | 'operator-outside-token'
  | 'trailing-modifier';

export interface AnswerTokenResult {
  token: string | null;
  reason?: AnswerRefusalReason;
}

/**
 * R52 — the detailed form, added so the guard's REFUSALS become observable.
 *
 * `ANSWER_PREFIX_ALLOWED` is an allowlist built from what student utterances
 * were assumed to look like, and everything outside it is refused SILENTLY:
 * the caller falls back to a generic cover, which is never wrong and never
 * reported. That is the correct failure direction for correctness and the
 * worst one for tuning — if the list is too narrow the numeric echo quietly
 * stops applying and nothing says so.
 *
 * Measured at the time this was added: 5 refusal points in this function, 0
 * telemetry calls in the whole file. The three separate patches this guard
 * received (R50 word forms, R50b symbol forms, R50c expressions) were each
 * evaluated against silence.
 *
 * Credit where it belongs: a peer project shipped an allowlist that discarded
 * 100% of one business's conversion events, and caught it ONLY because an
 * earlier reviewer had forced its filter to report a skip count — 11,964
 * skipped vs 2,853 kept, sitting in the output the whole time. Vigilance does
 * not survive a context reset; a counter in the output does.
 */
export function extractAnswerTokenDetailed(t: string): AnswerTokenResult {
  const matches = [...t.matchAll(ANSWER_EXPR_RE)];
  if (matches.length === 0) return { token: null, reason: 'no-number' };
  if (matches.length > 1) return { token: null, reason: 'multi-number' };
  const m = matches[0];
  const raw = m[0];

  const looksLikeFraction = /\//.test(raw) || /\b(over|divided)\b/i.test(t);
  if (looksLikeFraction) {
    const remainder = t.slice((m.index ?? 0) + raw.length);
    if (FRACTION_CONTINUATION_RE.test(remainder)) return { token: null, reason: 'fraction-continuation' };
  }

  // R50 T4: the number is qualified by an adjacent word — echoing the bare
  // digits would misquote (and for "point 3" / "66.6 bar", misstate the
  // value). Refuse; the caller falls back to the generic cover.
  const before = tokenBefore(t, m.index ?? 0);
  if (before && !ANSWER_PREFIX_ALLOWED.has(before)) return { token: null, reason: 'prefix-not-allowed' };
  // R50c: an operator the captured token does not span means the student
  // gave an EXPRESSION and this token is only a fragment of it. Blank out
  // the token's own span first, so a spoken sign ("minus 22") or a fraction
  // ("-3/6") — where the operator IS inside the capture — still echoes.
  const outsideToken =
    t.slice(0, m.index ?? 0) + ' ' + t.slice((m.index ?? 0) + raw.length);
  if (MATH_OPERATOR_RE.test(outsideToken)) return { token: null, reason: 'operator-outside-token' };
  if (VALUE_MODIFIER_TRAIL_RE.test(t.slice((m.index ?? 0) + raw.length))) return { token: null, reason: 'trailing-modifier' };

  return {
    token: normaliseLeadingDot(raw)
      .replace(/\s*\/\s*/, ' over ')
      .replace(/-\s*/g, 'minus ')
      .replace(/\bnegative\b/gi, 'minus')
      .replace(/\s+/g, ' ')
      .trim(),
  };
}

/** Back-compat wrapper — every existing call site and test uses this shape. */
export function extractAnswerToken(t: string): string | null {
  return extractAnswerTokenDetailed(t).token;
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

/**
 * {a} is replaced with the extracted answer token.
 *
 * R33 collision rule: no phrase may be a standalone acknowledgment token the
 * brain habitually opens replies with ("Good question.", "Sure.", "Okay.",
 * "No worries.") — the cover fires while the brain turn is already in flight,
 * so such a phrase doubles when the brain opens the same way (observed live
 * 2026-07-25: cover "Good question." + brain "Good question — let's nail
 * that down."). Pool phrases are thinking-fillers, not acknowledgments;
 * test-cover-layer's no-opener-collision check enforces this.
 */
export const COVER_POOLS: Record<CoverCategory, readonly string[]> = {
  'numeric-echo': ['Hmm, {a}.', '{a}. Okay.', 'Okay, {a}. One moment.'],
  question: ['Hmm, let me think about that.', 'Ah, let me think.', 'Hmm, let me see.'],
  request: ['On it.', 'Mm, one second.', 'Alright, one moment.'],
  stuck: ['Hmm, let me think how to help.', "That's alright, let me think.", 'Okay, let me help.'],
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
  const pool = COVER_POOLS[category];
  const n = pool.length;
  let index = ((turnIndex % n) + n) % n;
  if (index === lastIndex) index = (index + 1) % n;
  let text = pool[index];
  if (text.includes('{a}')) {
    const a = extractAnswerToken(transcript) ?? '';
    text = a ? text.replace(/\{a\}/g, a) : COVER_POOLS.generic[index % COVER_POOLS.generic.length];
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

/**
 * Warmup watchdog (silence audit §6 + lifecycle R2): a [start lesson] or
 * [Session-resumed…] brain turn that stalls without a state change used to pin
 * "Starting…" forever with the mic DISABLED. 20s → re-kick once; 40s → give
 * up: clear the spinner, surface an error, re-enable the mic.
 */
export interface WarmupState { startedAtMs: number; rekicked: boolean; failed: boolean }
export function createWarmupState(nowMs: number): WarmupState {
  return { startedAtMs: nowMs, rekicked: false, failed: false };
}
export const WARMUP_REKICK_MS = 20_000;
export const WARMUP_FAIL_MS = 40_000;

export function decideWarmupAction(state: WarmupState, nowMs: number): 'wait' | 'rekick' | 'fail' {
  const age = nowMs - state.startedAtMs;
  if (age >= WARMUP_FAIL_MS && !state.failed) { state.failed = true; return 'fail'; }
  if (age >= WARMUP_REKICK_MS && !state.rekicked && !state.failed) { state.rekicked = true; return 'rekick'; }
  return 'wait';
}
