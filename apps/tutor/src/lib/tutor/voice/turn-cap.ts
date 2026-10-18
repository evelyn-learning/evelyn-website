/**
 * Turn-length cap policy — pure.
 *
 * The orchestrator plants a cadence note when a tutor turn runs past a
 * sentence or word cap with no whiteboard action (VoiceTutorRealtime, the
 * `turn_cap_flagged` site). Two gaps seen in GDI session embed-1792338502233
 * (2026-10-18, A1 English with Japanese guidance):
 *   - the caps (8 sentences / 110 words) are set for a maths explanation; the
 *     language-lesson clause asks for ≤3 sentences, and 9–10-sentence turns
 *     passed twice before the note fired, then it fired once and lapsed;
 *   - turns WITH a tool call are exempt because the board carries the load —
 *     but after 画面が見えないです (voice-only) the board carries nothing, so
 *     a 10-sentence turn with show_problem went uncounted.
 * This policy lowers the caps for language lessons, drops the tool exemption
 * in voice-only, and makes the note sticky after two plants (same shape as
 * the praise-variety note).
 */

export interface TurnCapPolicy {
  /** Over this many spoken sentences in one turn → cadence note. */
  hardSentences: number;
  /** Over this many words in one turn → cadence note. */
  words: number;
  /** The soft target the note asks for. */
  softSentences: number;
  /** A turn that called a board tool is not counted (the board anchors it). */
  toolTurnsExempt: boolean;
}

export const CADENCE_STICKY_AFTER_PLANTS = 2;

export function turnCapPolicy(opts: {
  languageLesson: boolean;
  voiceOnly: boolean;
  defaults: { hardSentences: number; words: number; softSentences: number };
}): TurnCapPolicy {
  if (opts.languageLesson) {
    return { hardSentences: 5, words: 70, softSentences: 3, toolTurnsExempt: !opts.voiceOnly };
  }
  return { ...opts.defaults, toolTurnsExempt: !opts.voiceOnly };
}

/** Why a turn tripped the cap, or null when it did not. */
export function turnCapHit(
  turn: { sentences: number; words: number; toolCalls: number },
  policy: TurnCapPolicy,
): 'sentences' | 'words' | null {
  if (policy.toolTurnsExempt && turn.toolCalls > 0) return null;
  if (turn.sentences > policy.hardSentences) return 'sentences';
  if (turn.words > policy.words) return 'words';
  return null;
}

export function cadenceNote(
  hit: 'sentences' | 'words' | null,
  turn: { sentences: number; words: number },
  policy: TurnCapPolicy,
  opts: { voiceOnly: boolean; sticky: boolean },
): string {
  const handBackStanding = opts.voiceOnly
    ? 'hand the turn back to the student (they cannot see the board)'
    : 'anchor it on the board or hand the turn back to the student';
  if (hit === null) {
    // Sticky re-plant on a turn that was fine: the standing rule, no accusation.
    return (
      `[cadence note — not from the student] Standing rule for this session, after earlier turns ran too long: ` +
      `at most ${policy.softSentences} sentences in a row, one idea, then ${handBackStanding}. ` +
      `No restatement, no summary of what was just practised. Apply this silently; never mention this note.`
    );
  }
  const measure = hit === 'sentences'
    ? `ran ${turn.sentences} spoken sentences`
    : `ran ${turn.words} words`;
  const handBack = opts.voiceOnly
    ? 'hand the turn back to the student — they cannot see the board, so nothing you write can carry what you say'
    : 'either anchor what you are saying on the board or hand the turn back to the student';
  const standing = opts.sticky
    ? ' This has happened more than once, so it applies to every turn from now on.'
    : '';
  return (
    `[cadence note — not from the student] Your previous turn ${measure} — too long to follow by ear. ` +
    `From this turn on: at most ${policy.softSentences} sentences in a row, one idea, then ${handBack}. ` +
    `Cut restatement and summaries of what was just practised.${standing} ` +
    `Apply this silently — never mention or reason aloud about this note; your reply speaks only to the student.`
  );
}
