/**
 * STAGE-2 lazy-cancel policy (E1, live session repeat-storm fix).
 *
 * Incident: student answers "60"; brain turn starts (prod='processing',
 * 8-23s with no audio yet). Hearing silence, the student repeats "60".
 * The OLD behavior aborted the in-flight brain turn the instant
 * speech_started fired (`STAGE-2 cancel: aborting in 'processing'`), then
 * the repeat's transcript ("60 60") resolved to noise
 * (`dropped as noise (classifyTranscript)`) and RE-FIRED the whole turn
 * from scratch (`RESTORE — re-firing original transcript`). Net effect:
 * every repeat added 10-20s of fresh silence, which invited more repeats
 * — a self-reinforcing loop, all from a student who was just being patient
 * wrong.
 *
 * The fix: in 'processing' ONLY (brain running, no TTS delivered for this
 * turn yet), do NOT abort on the raw speech_started onset. Wait for the
 * new utterance's transcript + classification, THEN decide:
 *   - noise / filler / drop_self_voice / a DUPLICATE of the in-flight
 *     turn's transcript → 'continue': do nothing, the in-flight turn
 *     plays out undisturbed exactly as if the interruption never
 *     happened.
 *   - a genuine new turn (continuation / barge_in / new_turn) → abort
 *     the in-flight turn, THEN dispatch the new transcript.
 * 'speaking' (true barge-in — must stay instant) and 'listening'
 * (production WS owns dispatch there) are UNCHANGED — this module only
 * changes the decision inside 'processing'; both other states resolve to
 * 'eager', meaning "do whatever the existing eager cancel path already
 * does, this module has no opinion here."
 *
 * Kept pure and React-free so it's script-testable (test:stage2-cancel),
 * matching the bargein-gate / stage2-restore pattern.
 */

/** The subset of PerceptionVerdict values that can reach this decision.
 *  Deliberately NOT importing PerceptionVerdict from perception-classifier
 *  to keep this module dependency-free — the literal union is small and
 *  stable enough to duplicate (same convention as stage2-restore.ts). */
export type Stage2Verdict =
  | 'drop_self_voice'
  | 'noise'
  | 'filler'
  | 'new_turn'
  | 'continuation'
  | 'barge_in'
  /** Shouldn't reach here in practice (Haiku always resolves escalate to a
   *  concrete verdict before this function is called) — treated the same
   *  as the substantive-interrupt family, defensively, same as
   *  applyPerceptionVerdict's existing "escalate shouldn't reach here
   *  post-Haiku, but handle defensively" comment. */
  | 'escalate';

export type Stage2ProdState = 'processing' | 'speaking' | 'listening';

export type Stage2CancelAction =
  /** Not 'processing' — this module has no opinion, use the existing
   *  eager (instant abort at speech_started) path unchanged. */
  | 'eager'
  /** 'processing' + non-substantive or duplicate — let the in-flight
   *  brain turn continue undisturbed; drop the new transcript. */
  | 'continue'
  /** 'processing' + genuine new content — abort the in-flight turn now,
   *  then dispatch the new transcript. */
  | 'abort_and_dispatch';

const NOISE_FAMILY = new Set<Stage2Verdict>(['drop_self_voice', 'noise', 'filler']);

/**
 * Fillers stripped ONLY from the leading/trailing edges of the NEW
 * transcript before the duplicate comparison (rule (c) below) — never from
 * the middle, and never reordered/collapsed to a set (review-round-1
 * ruling: order-sensitive). Not the same list as transcript-filters.ts's
 * NOISE_PATTERNS (that one drops whole *utterances*; this one drops
 * individual edge *tokens* inside an otherwise substantive utterance —
 * "yeah, sure 60" needs the leading "yeah"/"sure" gone so the remainder
 * can compare against "60").
 *
 * 'like', 'right', 'so' are deliberately NOT here — review-round-1 ruling:
 * substantive in math/English ("So, what's next?", "right angle", "like
 * terms") and must never be silently stripped.
 */
const EDGE_FILLERS = new Set([
  'um', 'umm', 'uh', 'uhh', 'er', 'ah', 'hmm', 'oh', 'well',
  'yeah', 'yep', 'yup', 'yea', 'ya', 'sure', 'okay', 'ok',
]);

/**
 * Lowercase, strip punctuation, split into an ORDERED token list. No filler
 * removal, no reordering, no dedup — this is the raw normalized token
 * sequence rules (a)-(c) below compare.
 */
export function normalizeForDuplicateCheck(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/** Strip EDGE_FILLERS tokens from the front and back of `tokens` only —
 *  order of the remaining middle is untouched. */
export function stripLeadingTrailingFillers(tokens: string[]): string[] {
  let start = 0;
  let end = tokens.length;
  while (start < end && EDGE_FILLERS.has(tokens[start])) start++;
  while (end > start && EDGE_FILLERS.has(tokens[end - 1])) end--;
  return tokens.slice(start, end);
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((w, i) => w === b[i]);
}

/**
 * Is `newTranscript` a duplicate/repeat of `originalTranscript` — the
 * transcript the in-flight brain turn is already answering?
 *
 * Review-round-1 ruling: order-sensitive and strict. Duplicate iff, after
 * normalization (lowercase + strip punctuation, tokenized):
 *   (a) exact token-sequence equality ("60" vs "60", "SIXTY" vs "sixty"), OR
 *   (b) the in-flight transcript is a SINGLE token and the new one is 1+
 *       repetitions of that exact token ("60 60" / "60 60 60" vs "60"), OR
 *   (c) the new transcript equals the in-flight one after stripping ONLY
 *       leading/trailing filler tokens — order of whatever remains is
 *       preserved, nothing in the middle is touched, nothing reordered
 *       ("yeah, sure 60" vs "60"; "Um, sixty." vs "sixty").
 *
 * Explicitly NOT a duplicate: reordered content carrying the same words
 * ("5 minus 12" vs "12 minus 5" — a genuinely different math statement),
 * or the new transcript adding any substantive word ("60 and then what"
 * vs "60").
 */
export function isDuplicateTranscript(newTranscript: string, originalTranscript: string): boolean {
  const newTokens = normalizeForDuplicateCheck(newTranscript);
  const originalTokens = normalizeForDuplicateCheck(originalTranscript);
  if (newTokens.length === 0 || originalTokens.length === 0) return false;

  // (a) exact equality
  if (arraysEqual(newTokens, originalTokens)) return true;

  // (b) single-token original, repeated 1+ times in the new transcript
  if (originalTokens.length === 1 && newTokens.every((t) => t === originalTokens[0])) {
    return true;
  }

  // (c) new transcript, minus leading/trailing fillers only, equals the
  // original — order preserved.
  const strippedNew = stripLeadingTrailingFillers(newTokens);
  if (strippedNew.length > 0 && arraysEqual(strippedNew, originalTokens)) return true;

  return false;
}

/**
 * The main decision: given the production state, the resolved verdict for
 * the new utterance, and whether it's a duplicate of the in-flight turn's
 * transcript, what should the STAGE-2 cancel machinery do?
 *
 * Duplicate overrides verdict — even if the generic classifier would have
 * called a filler-padded repeat 'new_turn' (3+ words, so it slips past the
 * heuristic's brief-utterance filler gate), the duplicate match still
 * routes to 'continue'.
 */
export function decideStage2CancelAction(args: {
  state: Stage2ProdState;
  verdict: Stage2Verdict;
  isDuplicate: boolean;
}): Stage2CancelAction {
  if (args.state !== 'processing') return 'eager';
  if (args.isDuplicate) return 'continue';
  if (NOISE_FAMILY.has(args.verdict)) return 'continue';
  return 'abort_and_dispatch';
}

/**
 * Convenience wrapper combining the duplicate check + the decision, for
 * call sites that have both transcripts on hand (the real wiring in
 * VoiceTutorRealtime.tsx does, via lastBrainCallContextRef).
 */
export function decideStage2CancelPolicy(args: {
  state: Stage2ProdState;
  verdict: Stage2Verdict;
  newTranscript: string;
  originalTranscript: string;
}): Stage2CancelAction {
  return decideStage2CancelAction({
    state: args.state,
    verdict: args.verdict,
    isDuplicate: isDuplicateTranscript(args.newTranscript, args.originalTranscript),
  });
}
