/**
 * Tutor brain v2 — Task 7s: practice facts of a spoken lesson that teaches a language (mic test 5, embed-1795050656326).
 *
 *  2. PRACTISED_SENTENCE: the turn after the tutor asked the learner for a sentence (to make one, a question included, or to say
 *     a given one), their words are their practice: feedback and a card, never an answer from the persona card. The tutor asked
 *     for "Did you enjoy…", he said "Did you enjoy the robotics exhibition in Tokyo last year?", and the tutor told him about its
 *     own weekend (10.2 min). Decided from the structural record (learner-card.ts v2AskedForSentence on the last reply), never
 *     from the learner's words.
 *  3. STARTER_IS_ANSWER: a starter given for an answer is the opening of the answer itself, a statement; the question form only
 *     when the task is to make a question, and then said plainly ("Did you enjoy…" and "Has the project…" were given as the
 *     words to start an answer with, 10.2 and 14.1 min).
 *  5. QUESTION_NOT_NOTE: a question the learner must answer goes in a question card, never a note (the summary's check question
 *     was a note and looked like the learner's sentence cards above it, 18.4 min).
 *
 * Facts only: nothing of the lesson's state moves on them. Spoken lessons that teach a language (the 7h gate, note-targets.ts);
 * every other lesson gets none, so its facts are byte-identical. Pure, client-safe.
 */
import { TUTOR_V2_PRACTISED_SENTENCE, TUTOR_V2_QUESTION_NOT_NOTE, TUTOR_V2_STARTER_IS_ANSWER } from '../orchestrator/flags';
import { v2AskedForSentence } from './learner-card';
import { v2NoteTargetsOn } from './note-targets';
import type { V2Session, V2State } from './types';

export interface V2PracticeFactFlags { practised: boolean; starter: boolean; questionCard: boolean }
const FLAGS = (): V2PracticeFactFlags => ({ practised: TUTOR_V2_PRACTISED_SENTENCE, starter: TUTOR_V2_STARTER_IS_ANSWER, questionCard: TUTOR_V2_QUESTION_NOT_NOTE });

export const V2_PRACTISED_SENTENCE_LINE = 'practised sentence: their words just now answer your ask to make a sentence or to say one you gave: whatever its form, a question included ("Did you enjoy…?"), it is their practice sentence. Give feedback on it as practice (right as said, or corrected) and card it as you card their sentences; do not answer it as if they had asked you, and nothing from your own persona card. A question they ask you when you have not asked them for a sentence is answered as usual';
export const V2_STARTER_LINE = 'starters: a starter you give for their answer is the first words of the answer itself, a statement ("Yes, I enjoyed…", "The project has…"), never the question form ("Did you enjoy…", "Has the project…"). Only when the task is to make a question, say so plainly ("Ask me a question starting with…")';
export const V2_QUESTION_CARD_LINE = 'board: a question the learner must answer, on any page and in the summary too, goes on a question card (a <board problem> block), never in a note; a note holds a rule, an example or a point to remember';

/** The lines for this turn (empty outside spoken lessons that teach a language). `heard`: their words this turn. */
export function v2PracticeFactLines(session: V2Session, state: V2State, heard: string | null | undefined, flags: V2PracticeFactFlags = FLAGS()): string[] {
  if (!v2NoteTargetsOn(session) || state.closed) return [];
  const lines: string[] = [];
  if (flags.practised && typeof heard === 'string' && heard.trim() && v2AskedForSentence(state.history, true)) lines.push(V2_PRACTISED_SENTENCE_LINE);
  if (flags.starter && typeof state.summaryBegunAt !== 'number') lines.push(V2_STARTER_LINE);
  if (flags.questionCard) lines.push(V2_QUESTION_CARD_LINE);
  return lines;
}
