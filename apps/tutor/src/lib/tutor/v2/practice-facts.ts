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
import { TUTOR_V2_PRACTISED_SENTENCE, TUTOR_V2_QUESTION_NOT_NOTE, TUTOR_V2_SELF_CORRECTION, TUTOR_V2_STARTER_IS_ANSWER } from '../orchestrator/flags';
import { v2AskedToProduce, v2LearnerSentence } from './learner-card';
import { v2SentenceTokens } from './sentence-cards';
import { v2ScoredTurn } from './pronunciation';
import { v2NoteTargetsOn } from './note-targets';
import { v2PartInHand, v2PlanLabelled } from './part-flow';
import { v2PracticePart } from './time-fit';
import type { V2Session, V2State } from './types';

export interface V2PracticeFactFlags { practised: boolean; starter: boolean; questionCard: boolean; selfCorrection?: boolean }
const FLAGS = (): V2PracticeFactFlags => ({ practised: TUTOR_V2_PRACTISED_SENTENCE, starter: TUTOR_V2_STARTER_IS_ANSWER, questionCard: TUTOR_V2_QUESTION_NOT_NOTE });

export const V2_PRACTISED_SENTENCE_LINE = 'practised sentence: your last reply asked them to make a question or to say a sentence you gave, so their words just now are that practice sentence, whatever its form (a question such as "Did you enjoy…?" included, with or without a question mark): give feedback on it as practice (right as said, or corrected) and card it as you card their sentences; do not answer it as if they had asked you, and nothing from your own persona card. Only if they are plainly asking you what to do, what a word means, or to hear it again, answer that. A question they ask you outside such an ask is answered as usual';
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
  // Fix round 3 (m2), fix round 4 (N-A, ruling): not when the last reply's recording arm was dropped because it closed on its own
  // different question (the M3 rule, turn.ts; state.pronunciation.disarmed): their words answer that question. Read from that
  // mark alone, never from the reply's wording: "Repeat after me.\n\nWhat did you do last weekend?" is the practice sentence itself.
  if (flags.practised && typeof heard === 'string' && heard.trim() && v2AskedToProduce(state.history) && !v2ScoredTurn(session, state, heard, true) && !state.pronunciation?.disarmed) lines.push(V2_PRACTISED_SENTENCE_LINE);
  // Fix round 1 (M5): in a practice part only (a labelled plan; any part of a plan without names).
  const practice = !v2PlanLabelled(session.plan) || v2PracticePart(session.plan, v2PartInHand(session.plan, state));
  if (flags.starter && typeof state.summaryBegunAt !== 'number' && practice) lines.push(V2_STARTER_LINE);
  if (flags.questionCard) lines.push(V2_QUESTION_CARD_LINE);
  // Task 7v (SELF_CORRECTION): a short phrase right after a full sentence of theirs in the same turn corrects that sentence.
  const self = (flags.selfCorrection ?? TUTOR_V2_SELF_CORRECTION) ? v2SelfCorrection(heard) : null;
  if (self) lines.push(`self-correction: their words just now are "${self.sentence}" and then "${self.phrase}". The short phrase right after their sentence corrects it (part of it said again, better): read the two together as the one sentence they meant and give your feedback on that sentence; never treat or correct the phrase as a sentence of its own or a fragment`);
  return lines;
}

/** Task 7v (SELF_CORRECTION): their turn's last part is a short phrase (one to three words, not a yes / no, a thanks or a question)
 *  said right after a full sentence (four words or more, v2LearnerSentence): the sentence and the phrase, else null. Mic test 6
 *  (embed-1795067373124, 6.1 min): "My team is working on um uh presentation for senior staff." then "for senior bosses." was
 *  corrected as a fragment. */
export const V2_SELF_CORRECTION_MAX_WORDS = 4;
/** A bare yes / no / thanks / okay / greeting (the whole phrase). */
const NOT_A_PHRASE = /^(?:yes|yeah|yep|no|nope|ok(?:ay)?|sure|thanks?|thank you|sorry|right|i see|uh|um|hi|hello|bye|goodbye|good ?bye|はい|いいえ|ええ|ありがとう(?:ございます)?)(?:[,.!\s]+(?:thanks?|thank you|so much|very much))*[.!。！]*$/i;
export function v2SelfCorrection(heard: string | null | undefined): { sentence: string; phrase: string } | null {
  if (!heard) return null;
  const parts = heard.split(/\n+|(?<=[.!?。！？])\s+/).map((x) => x.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const phrase = parts[parts.length - 1]!; const before = parts[parts.length - 2]!;
  const n = v2SentenceTokens(phrase).filter((w) => !/^(?:u+h+|u+m+|e+r+m*)$/.test(w)).length;
  // Fix round 2 (N1, the controller's ruling): the shape alone decides: at most V2_SELF_CORRECTION_MAX_WORDS words that are not a
  // sentence of their own (a subject and a verb: "I went there."). "I have work here for five years." then "Worked." is a correction
  // that shares no word with it.
  // Fix round 3 (N8, ruling): nothing else is tested ("The senior bosses.", "I have worked.", "I went." are corrections too).
  if (n < 1 || n > V2_SELF_CORRECTION_MAX_WORDS || /[?？]\s*$/.test(phrase) || NOT_A_PHRASE.test(phrase)) return null;
  const sentence = v2LearnerSentence(before);
  return sentence ? { sentence: before.replace(/\s+/g, ' ').slice(0, 200), phrase: phrase.slice(0, 80) } : null;
}
