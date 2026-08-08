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
 * Fillers stripped before the duplicate-multiset comparison. Not the same
 * list as transcript-filters.ts's NOISE_PATTERNS (that one drops whole
 * *utterances*; this one drops individual *tokens* inside an otherwise
 * substantive utterance — "yeah, sure 60" needs "yeah"/"sure" gone so the
 * remaining {60} can compare against the original {60}).
 */
const DUPLICATE_CHECK_FILLERS = new Set([
  'um', 'umm', 'uh', 'uhh', 'er', 'ah', 'hmm', 'oh',
  'so', 'well', 'like', 'right',
  'yeah', 'yep', 'yup', 'yea', 'ya', 'sure', 'okay', 'ok',
]);

/**
 * Lowercase, strip punctuation, drop filler tokens, return the SET of
 * remaining words (repeats collapse — "60 60" and "60" both normalize to
 * {60}, which is exactly the word-multiset-repeat case the design calls
 * out).
 */
export function normalizeForDuplicateCheck(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[.,!?;:'"]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0 && !DUPLICATE_CHECK_FILLERS.has(w));
  return new Set(words);
}

/**
 * Is `newTranscript` a duplicate/repeat of `originalTranscript` — the
 * transcript the in-flight brain turn is already answering? True for an
 * exact match ("60" vs "60"), a repeated-word echo ("60 60" vs "60"), and
 * a filler-padded repeat ("yeah 60" / "yeah, sure 60" vs "60"). False when
 * either side is empty after filler-stripping (nothing substantive to
 * compare — let the ordinary noise/heuristic classification handle it)
 * or when the new transcript carries any word the original didn't
 * (genuinely new content, e.g. "60 and then what" vs "60").
 */
export function isDuplicateTranscript(newTranscript: string, originalTranscript: string): boolean {
  const a = normalizeForDuplicateCheck(newTranscript);
  const b = normalizeForDuplicateCheck(originalTranscript);
  if (a.size === 0 || b.size === 0) return false;
  if (a.size !== b.size) return false;
  for (const w of a) {
    if (!b.has(w)) return false;
  }
  return true;
}

/**
 * The main decision: given the production state, the resolved verdict for
 * the new utterance, and whether it's a duplicate of the in-flight turn's
 * transcript, what should the STAGE-2 cancel machinery do?
 *
 * Duplicate overrides verdict — even if the generic classifier would have
 * called a filler-padded repeat 'new_turn' (3+ words, so it slips past the
 * heuristic's brief-utterance filler gate), the multiset match still
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
