/**
 * MCQ letter-homophone normalization (2026-08-10 triage, session
 * portal-cb2addf5).
 *
 * ASR transcribes a spoken multiple-choice letter as the English word it
 * sounds like, not the letter: "C" comes back as "See." / "Sea." / "Cee.".
 * None of the verification-turn signals in VoiceTutorRealtime recognize
 * "See." as an answer (no digits, no math language, 1 word, short) — the
 * turn dispatches as ordinary chatter and the brain says '"See" isn't
 * quite giving me the pieces yet', even though `improvised_answer_verified`
 * elsewhere in the SAME session proves the runtime already knows C is
 * correct. The runtime already has a bare-letter recognizer
 * (`isMcqLetterAnswer`, `/^[a-eA-E][).\s]*$/`) — this module normalizes the
 * homophone BACK to that literal-letter form before dispatch so the
 * existing machinery (verification classification, grading) sees the shape
 * it already understands.
 *
 * Pure module so the mapping is unit-testable:
 * npx tsx scripts/test-mcq-letter-homophone.ts
 */

/** Homophones ASR is observed to produce for each spoken MCQ letter. The
 *  literal lowercase letter is included too (harmless — the existing bare-
 *  letter regex already accepts it, so this is just a no-op pass-through
 *  for that case rather than new behavior). Only letters actually reported
 *  in the triage are covered — no invented forms for untested letters. */
const LETTER_HOMOPHONES: Record<string, string[]> = {
  A: ['a', 'ay', 'aye', 'eh'],
  B: ['b', 'bee', 'be'],
  C: ['c', 'see', 'sea', 'cee'],
  D: ['d', 'dee'],
};

/** "letter C" / "option C" / "choice C" / "the answer C" framing — strip
 *  the leading frame word(s) before homophone matching. */
const FRAME_PREFIX_RE = /^(?:the\s+)?(?:letter|option|choice|answer)\s+/i;

/**
 * Normalize a bare letter-homophone MCQ answer to its literal choice
 * letter (e.g. "See." → "C"). Returns null when nothing should change —
 * callers dispatch the ORIGINAL transcript unmodified in that case.
 *
 * Fires ONLY when:
 *  - `choiceLetters` is non-empty (a lettered-choices problem is active —
 *    callers must gate this on the active problem, never call it
 *    unconditionally), and
 *  - the ENTIRE trimmed utterance (after stripping one optional framing
 *    prefix and trailing punctuation) is a homophone of one of the ACTIVE
 *    problem's choice letters.
 *
 * Never rewrites inside a longer sentence — "see the graph" and "will it
 * be graded" must reach the brain verbatim. A homophone for a letter that
 * ISN'T one of this problem's actual choices (e.g. "Dee" on a 3-choice
 * A/B/C problem) is left unmatched — a bare homophone should never be
 * force-mapped onto a choice the problem doesn't have.
 */
export function normalizeMcqLetterUtterance(
  transcript: string,
  choiceLetters: string[],
): string | null {
  if (!transcript || choiceLetters.length === 0) return null;
  const validLetters = new Set(
    choiceLetters
      .map((l) => l.trim().toUpperCase())
      .filter((l) => /^[A-Z]$/.test(l)),
  );
  if (validLetters.size === 0) return null;

  let t = transcript.trim().toLowerCase();
  t = t.replace(/[.!?,;:]+$/, '').trim();
  t = t.replace(FRAME_PREFIX_RE, '').trim();
  if (!t) return null;

  for (const letter of validLetters) {
    const homophones = LETTER_HOMOPHONES[letter];
    if (homophones && homophones.includes(t)) return letter;
  }
  return null;
}

/** Choice-shape union covering both known card shapes: showProblem's
 *  answerChoices ({letter, text}) and show_try_yourself's choices
 *  ({id, text}). Extracts the letter each choice presents to the student,
 *  falling back to positional A/B/C/... when neither field carries one. */
export function extractChoiceLetters(
  choices: Array<{ letter?: unknown; id?: unknown }> | null | undefined,
): string[] {
  if (!Array.isArray(choices) || choices.length === 0) return [];
  return choices.map((c, i) => {
    const raw =
      (typeof c?.letter === 'string' && c.letter) ||
      (typeof c?.id === 'string' && c.id) ||
      '';
    const upper = raw.trim().toUpperCase();
    return /^[A-Z]$/.test(upper) ? upper : String.fromCharCode(65 + i);
  });
}
