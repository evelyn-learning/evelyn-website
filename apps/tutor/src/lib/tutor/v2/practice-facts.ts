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
import { v2AskedToProduce } from './learner-card';
import { v2ScoredTurn } from './pronunciation';
import { v2NoteTargetsOn } from './note-targets';
import { v2PartInHand, v2PlanLabelled } from './part-flow';
import { v2PracticePart } from './time-fit';
import type { V2Session, V2State } from './types';

export interface V2PracticeFactFlags { practised: boolean; starter: boolean; questionCard: boolean }
const FLAGS = (): V2PracticeFactFlags => ({ practised: TUTOR_V2_PRACTISED_SENTENCE, starter: TUTOR_V2_STARTER_IS_ANSWER, questionCard: TUTOR_V2_QUESTION_NOT_NOTE });

export const V2_PRACTISED_SENTENCE_LINE = 'practised sentence: your last reply asked them to make a question or to say a sentence you gave, so their words just now are that practice sentence, whatever its form (a question such as "Did you enjoy…?" included, with or without a question mark): give feedback on it as practice (right as said, or corrected) and card it as you card their sentences; do not answer it as if they had asked you, and nothing from your own persona card. Only if they are plainly asking you what to do or what a word means, answer that. A question they ask you outside such an ask is answered as usual';
export const V2_STARTER_LINE = 'starters: a starter you give for their answer is the first words of the answer itself, a statement ("Yes, I enjoyed…", "The project has…"), never the question form ("Did you enjoy…", "Has the project…"). Only when the task is to make a question, say so plainly ("Ask me a question starting with…")';
export const V2_QUESTION_CARD_LINE = 'board: a question the learner must answer, on any page and in the summary too, goes on a question card (a <board problem> block), never in a note; a note holds a rule, an example or a point to remember';

/** The lines for this turn (empty outside spoken lessons that teach a language). `heard`: their words this turn. */
export function v2PracticeFactLines(session: V2Session, state: V2State, heard: string | null | undefined, flags: V2PracticeFactFlags = FLAGS()): string[] {
  if (!v2NoteTargetsOn(session) || state.closed) return [];
  const lines: string[] = [];
  // Fix round 1 (I1): only after an ask to make a question or say a given sentence, and only when their turn is a question (the
  // case the persona card would answer); (I3) never on a turn whose words answer an armed pronunciation recording.
  // Fix round 2 (N1, ruling): the ask to produce decides, whatever the form of their words (a question transcribed with a period
  // is still their question); the line leaves room for a plain request for help. (N5) Never on a scored turn, whatever
  // PRONUNCIATION_PAGE says: this line's own flag owns that guard.
  if (flags.practised && typeof heard === 'string' && heard.trim() && v2AskedToProduce(state.history) && !v2ScoredTurn(session, state, heard, true)) lines.push(V2_PRACTISED_SENTENCE_LINE);
  // Fix round 1 (M5): in a practice part only (a labelled plan; any part of a plan without names).
  const practice = !v2PlanLabelled(session.plan) || v2PracticePart(session.plan, v2PartInHand(session.plan, state));
  if (flags.starter && typeof state.summaryBegunAt !== 'number' && practice) lines.push(V2_STARTER_LINE);
  if (flags.questionCard) lines.push(V2_QUESTION_CARD_LINE);
  return lines;
}
