/**
 * Tutor brain v2 — Task 7o: the target word of a rule / correction note is marked on the board.
 *
 * Mic test 4 (embed-1795028886172, flag 2): the note read "For a period of time, use for + the number of years: for six years."
 * in one plain line, with nothing to show which word was the corrected one. The sentence card above it marked its stress word
 * ("for") amber and underlined; a note had no emphasis at all.
 *
 * In a spoken lesson that teaches a language (the 7h gate: two teaching languages or measured pronunciation):
 *  1. the session part asks for the target word or short phrase in double quotes (v2NoteTargetsSection);
 *  2. the note carries `targets: true`, and the board draws each short quoted span (the 7h target test: at most three Latin
 *     words) as a sentence card draws a stress word, without its quote marks (v2NoteSegments; the renderer is
 *     whiteboard/NoteTargetText.tsx). A longer quoted span is a sentence and is left as written;
 *  3. a note that quotes no target, written in a reply whose sentence card has stress words, carries those of them that
 *     stand in it as whole words (`stress`, v2NoteStressWords), and the board marks them there.
 * The marks are the board's: the note's text (its record) is unchanged. Fix round 1 (I2, ruling): the quotes stay in a note's
 * spoken copy, so a quoted target there gets the 7l target marks in speech too (speech and board agree).
 * The board side (segments, stress words) is in note-marks.ts, which the whiteboard imports without this module's lesson gate
 * (fix round 1, minor 1: the gate pulls in discussion.ts and the constitution). Pure.
 */
import { discussionOf } from './discussion';
import type { V2Session } from './types';

/** Spoken lessons that teach a language, as taught lessons (not a discussion, not homework). */
export function v2NoteTargetsOn(session: V2Session): boolean {
  return session.mode === 'voice' && !discussionOf(session.plan) && !session.homework && !session.homeworkSheet && ((session.languages?.length ?? 0) >= 2 || !!session.pronunciation);
}

/** The session part's section (such lessons only, under NOTE_TARGET_QUOTES). Stable for the whole session. */
export function v2NoteTargetsSection(): string {
  return [
    'TARGET WORDS IN NOTES',
    'In a note that states a rule or a correction (a <board note> block, or annotate), put the target word or short phrase (at most three words) in double quotes every time it stands as the target, in the rule and in its example: use "for" + the number of years: "for" six years. The board marks the quoted words. Quote only the target, never a whole sentence, and write no ** or other markdown in a note.',
  ].join('\n');
}

export { v2NoteHasTarget, v2NoteStressWords, v2NoteSegments, type V2NoteSegment } from './note-marks';
