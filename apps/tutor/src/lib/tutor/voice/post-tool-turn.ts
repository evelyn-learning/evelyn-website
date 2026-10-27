// src/lib/tutor/voice/post-tool-turn.ts
/**
 * What the brain's agent loop does around a tool call (claude-brain.ts).
 *
 * WHY (GAC typed sessions, 2026-10-26):
 *
 *  A. Thin reply. Bringing a new problem got "Sure, let's take this new one
 *     step at a time. Here it is on the board." and nothing more: the model
 *     wrote a lead-in, emitted the board tool call and ended its response
 *     (stop=end_turn, one API call — the loop never ran a second call, so the
 *     question never came). Option-A rescue only covered a turn with NO text,
 *     the turn continuation skipped any turn with a tool call. Seen in five
 *     subjects (portal-55fb8446, -0359f156, -5d282dc9, -94457631, -0d18f9e1).
 *     `decideThinToolTurnRescue` decides when one text-only follow-up call
 *     finishes such a turn.
 *
 *  B. The same content twice in one reply. A turn wrote its whole reply
 *     (check, verdict, question), called show_equation, got back the bare
 *     "show_equation executed successfully." and — on the second call —
 *     wrote the reply again in other words (two API calls each:
 *     portal-871c8a4e, -55fb8446, -5c2f9dea). The bare ack told the model
 *     nothing about what the student already had. `toolResultWithDelivered`
 *     says it; `isNearDuplicateSentence` is the backstop that drops a later
 *     call's sentence restating an earlier call's.
 *
 * Generic: no subject words. Pure; never throws.
 */

/** Tools whose turn legitimately ends without a question. */
const CLOSING_TOOLS = new Set(['close_session_notes', 'hold_for_student']);

export type ThinTurnRescueReason =
  | 'thin-tool-turn'
  | 'flag-off' | 'muted' | 'no-text' | 'no-tool-in-last-response' | 'tool-round-trip'
  | 'has-question' | 'turn-closed' | 'closing-tool' | 'recap';

/** A recap move: advance to the recap segment, or its card. */
function isRecapCall(call: { name: string; args?: Record<string, unknown> }): boolean {
  const a = call.args ?? {};
  if (call.name === 'advance_lesson') return /\brecap\b/i.test(String(a.to ?? ''));
  if (call.name === 'show_segment_card') return /(^|[.\-_])recap$/i.test(String(a.segmentId ?? ''));
  return false;
}

export function decideThinToolTurnRescue(input: {
  enabled: boolean;
  /** Everything forwarded to the student this turn. */
  text: string;
  /** tool_use blocks in the loop's LAST response. */
  lastResponseToolUses: number;
  /** stop_reason of that last response. */
  lastStopReason: string;
  /** Every tool call this turn (name + args). */
  toolCalls: ReadonlyArray<{ name: string; args?: Record<string, unknown> }>;
  /** The reply was stopped by a guard (whole-answer reveal etc.). */
  muted: boolean;
}): { rescue: boolean; reason: ThinTurnRescueReason } {
  const no = (reason: ThinTurnRescueReason) => ({ rescue: false, reason });
  if (!input.enabled) return no('flag-off');
  if (input.muted) return no('muted');
  const text = (input.text ?? '').trim();
  // Zero text is the older Option-A rescue's case.
  if (!text) return no('no-text');
  if (!(input.lastResponseToolUses > 0)) return no('no-tool-in-last-response');
  // A tool_use stop means the loop ran (or capped) the round trip itself.
  if (input.lastStopReason === 'tool_use') return no('tool-round-trip');
  if (/[?？]/.test(text)) return no('has-question');
  if (endsTurn(text)) return no('turn-closed');
  if (input.toolCalls.some((c) => CLOSING_TOOLS.has(c.name))) return no('closing-tool');
  if (input.toolCalls.some(isRecapCall)) return no('recap');
  return { rescue: true, reason: 'thin-tool-turn' };
}

/** The user message for the thin-turn follow-up call (no tools offered). */
export const THIN_TURN_RESCUE_INSTRUCTION =
  'Your words so far this turn have already reached the student, and what you put on the board is showing. ' +
  'Do not repeat or rephrase any of it. Finish the turn: ask the student the one question they should answer next ' +
  'about what is now on the board, in one or two short sentences. Text only — no tools.';

const DELIVERED_CLIP = 600;

/**
 * The tool_result for a fire-and-forget call. When the turn has already sent
 * text, the result says so and quotes it, so the next call continues instead
 * of starting the reply over. Only the bare default ack is extended — a
 * resolver's own result (generate_problem data, advance_lesson grounding, a
 * rejection) is returned unchanged.
 */
export function toolResultWithDelivered(content: string, name: string, delivered: string, enabled: boolean): string {
  if (!enabled) return content;
  if (content !== `${name} executed successfully.`) return content;
  const said = (delivered ?? '').replace(/\s+/g, ' ').trim();
  if (!said) return content;
  const quoted = said.length > DELIVERED_CLIP ? `…${said.slice(said.length - DELIVERED_CLIP)}` : said;
  // Round 3 (Haiku 5.5, 10-27): a longer note with a conditional ("If those
  // words already ask the student a question, end the turn …") was echoed
  // back to the student ("Those words already ask the question, so I'll stop
  // there."). Terse, with nothing to talk about; what a later call may add is
  // decided structurally (laterCallSentenceDecision).
  return `${content} Already sent to the student this turn (never repeat or mention it): «${quoted}»`;
}

/** An offer / sign-off line that hands the turn back without a "?". */
const CLOSING_LINE_RE =
  /\b(?:when(?:ever)?\s+you(?:['’]re|\s+are)\s+ready|let\s+me\s+know\s+(?:when|if|whenever)|see\s+you|take\s+care|talk\s+(?:to\s+you\s+)?soon|that['’]?s\s+(?:all|it)\s+for\s+(?:now|today))\b/i;

/** True when the LAST sentence of `text` already hands the turn to the
 *  student: a question, or an offer / sign-off line. */
export function endsTurn(text: string): boolean {
  const t = (text ?? '').trim();
  if (!t) return false;
  const parts = t.split(/(?<=[.!?？])\s+/);
  const last = parts[parts.length - 1] ?? '';
  return /[?？]["'”’)\]]*\s*$/.test(last) || CLOSING_LINE_RE.test(last);
}

/** What a sentence from a LATER API call of the turn may do.
 *  · `continuation` — the earlier call's tool results were bare acks: the
 *    later call only continues the same reply. When the earlier text already
 *    ended the turn (a question / an offer line), nothing more is said.
 *  · `question-only` — the thin-turn follow-up, made only to add the missing
 *    question: its first question sentence is kept, nothing else.
 *  · `data` — a tool returned data the brain must present: unrestricted. */
export type LaterCallMode = 'continuation' | 'question-only' | 'data';
export type LaterCallDecision = 'keep' | 'keep-question' | 'drop-turn-ended' | 'drop-not-question' | 'drop-after-question';

export function laterCallSentenceDecision(input: {
  sentence: string;
  /** Sentences forwarded by EARLIER calls of this turn. */
  earlier: ReadonlyArray<string>;
  mode: LaterCallMode;
  /** The question-only follow-up already kept its question. */
  questionTaken: boolean;
}): LaterCallDecision {
  if (!input.earlier.length) return 'keep';
  if (input.mode === 'question-only') {
    if (input.questionTaken) return 'drop-after-question';
    return /[?？]["'”’)\]]*\s*$/.test((input.sentence ?? '').trim()) ? 'keep-question' : 'drop-not-question';
  }
  if (input.mode === 'continuation' && endsTurn(input.earlier.join(' '))) return 'drop-turn-ended';
  return 'keep';
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'your', 'yours', 'all', 'any', 'can', 'had', 'has', 'have', 'her', 'his',
  'its', 'our', 'out', 'was', 'were', 'who', 'why', 'how', 'what', 'when', 'where', 'which', 'with', 'this', 'that', 'these',
  'those', 'there', 'then', 'than', 'them', 'they', 'from', 'into', 'onto', 'does', 'did', 'doing', 'done', 'just', 'now',
  'let', "let's", 'lets', 'here', "here's", 'okay', 'yes', 'also', 'some', 'very', 'will', 'would', 'could', 'should', 'shall',
  'may', 'might', 'must', 'about', 'over', 'each', 'both', 'more', 'most', 'such', 'only', 'own', 'same', 'too', 'get', 'got',
  'one', 'two', 'it', 'is', 'in', 'of', 'to', 'a', 'an', 'so', 'do', 'be', 'by', 'on', 'at', 'or', 'as', 'if', 'me', 'we',
  'us', "it's", "that's", "what's", 'gives', 'give', 'show', 'tell',
]);

/** Content words of a sentence: lower-case, LaTeX commands and punctuation out, short function words out. */
export function contentWords(sentence: string): Set<string> {
  const words = (sentence ?? '')
    .toLowerCase()
    .replace(/\\[a-z]+/g, ' ')
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, '').replace(/'s$/, ''))
    .filter((w) => w && !STOP_WORDS.has(w) && (w.length >= 3 || /\d/.test(w)));
  return new Set(words);
}

const MIN_CONTENT_WORDS = 3;
export const NEAR_DUPLICATE_OVERLAP = 0.6;

const isQuestion = (s: string): boolean => /[?？]\s*$/.test((s ?? '').trim());

/**
 * True when `sentence`, written by a LATER call of the turn, restates what the
 * turn's EARLIER calls already sent (`earlier`):
 *  · a statement — ≥ 60 % of its content words already appear in the earlier
 *    sentences together;
 *  · a question — only when an earlier sentence was a question too, and
 *    ≥ 60 % of its content words appear in one such earlier question (a new
 *    question built from the turn's own words is the turn's point, not a
 *    repeat).
 * Sentences with fewer than three content words are never dropped.
 */
export function isNearDuplicateSentence(sentence: string, earlier: ReadonlyArray<string>, threshold = NEAR_DUPLICATE_OVERLAP): boolean {
  if (!earlier.length) return false;
  const mine = contentWords(sentence);
  if (mine.size < MIN_CONTENT_WORDS) return false;
  const share = (pool: Set<string>): number => {
    let hit = 0;
    for (const w of mine) if (pool.has(w)) hit++;
    return hit / mine.size;
  };
  if (isQuestion(sentence)) {
    return earlier.filter(isQuestion).some((q) => share(contentWords(q)) >= threshold);
  }
  const pool = new Set<string>();
  for (const s of earlier) for (const w of contentWords(s)) pool.add(w);
  return share(pool) >= threshold;
}
