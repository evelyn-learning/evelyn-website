/**
 * Tutor brain v2 — sentence cards for language lessons.
 *
 * A lesson taught in two languages (V2Session.languages, the support language second) puts the sentences of the
 * target language it models or corrects on the board as sentence cards, written inline where the tutor says them:
 *
 *   <board sentence stress="met" gloss="a short note in the support language">Last week I met a customer.</board>
 *
 * The block becomes v1's show_sentence card (board-inline.ts inlineToolCall → showSentence on the whiteboard and in
 * the session PDF): the sentence, its stressed words marked, the gloss under it. v1 asked its brain for these cards
 * and got them on 3 turns of 29 (voice/sentence-board.ts); a card that costs one line of the reply is written.
 *
 * A painted card that reworks what the student has just said is one of their corrected sentences: the turn records it
 * (v2NoteCorrectedSentence) and the facts list them, so the summary can put up to four on the board (v1 did this on the
 * client, ≤4 via typedLearnerSentencesRef; on v2 the brain picks them from the facts).
 *
 * Keyed on the session having a second teaching language, never on a subject name or a partner: the gloss is in that
 * language, and a lesson without one has nothing to gloss in. Under the TUTOR_V2_SENTENCE_CARDS kill switch. A session
 * without it gets a byte-identical session part and facts. Pure, client-safe.
 */
import { TUTOR_V2_SENTENCE_CARDS } from '../orchestrator/flags';
import { languageNameOf } from '../voice/language-request';
import { discussionOf } from './discussion';
import type { V2Session, V2State } from './types';

/** The corrected sentences the state keeps (the most recent), and the most the summary boards. */
export const V2_MAX_CORRECTED_SENTENCES = 8;
export const V2_SUMMARY_SENTENCE_CARDS = 4;
const MAX_SENTENCE_CHARS = 200;
/** v1 CORRECTION_OVERLAP (voice/sentence-board.ts): a card is a correction of theirs when at least half its words are theirs. */
const CORRECTION_OVERLAP = 0.5;
const MIN_WORDS = 3;

/** Sentence cards run in a taught lesson with a second teaching language. `enabled` is the kill switch (tests pass it). */
export function v2SentenceCardsOn(session: V2Session, enabled: boolean = TUTOR_V2_SENTENCE_CARDS): boolean {
  return enabled && (session.languages?.length ?? 0) >= 2 && !discussionOf(session.plan) && !session.homework && !session.homeworkSheet;
}

/** The session part's section (sentence-card sessions only). Stable for the whole session. */
export function v2SentenceCardsSection(languages: readonly string[]): string {
  const T = languageNameOf(languages[0]!);
  const S = languageNameOf(languages[1]!.toLowerCase().split(/[-_]/)[0]!);
  return [
    'SENTENCE CARDS',
    // v1 run 1: told to board every model or corrected sentence, the brain did so on 3 turns of 29; the learner only heard them.
    `A ${T} sentence you model or correct goes on the board as a sentence card, written in the reply where you say it: <board sentence stress="word | word" gloss="a short note in ${S}">The whole sentence.</board>`,
    // The card's stressed words are drawn bold (v1 SentenceCard); a gloss in the target language helps nobody who needs one.
    `stress (optional): the words you changed, or the ones to stress when saying it. gloss (optional): a few words in ${S} on what it means or what changed, with no double quote inside it. One sentence per card; a card for what they should say, never for their mistake.`,
    // v1 boarded up to four of the learner's sentences in its summary (typedLearnerSentencesRef); v2 has no client summary.
    // Each listed sentence is already a card on the page it was corrected on, and the board does not write a thing twice
    // on one page (board.ts): written there, the summary's cards only scrolled back to the old ones. On a new page they are
    // written again, and the recap stands as its own page (review 4c I1).
    `When you sum the lesson up, including a close they asked for, open a page for the summary with a page block first, then put up to ${V2_SUMMARY_SENTENCE_CARDS} of their corrected sentences from the facts on it as sentence cards, the ones most worth keeping. On the page they were corrected on they are already up and are not written again.`,
  ].join('\n');
}

const tokens = (text: string) => (text.toLowerCase().replace(/’/g, "'").match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) ?? []);

/** Whether a card's sentence reworks what the student said: most of its words are theirs, and it is not their words as they said them. */
export function v2IsCorrectionOf(sentence: string, studentSaid: string | null | undefined): boolean {
  const card = tokens(sentence);
  const theirs = tokens(studentSaid ?? '');
  if (card.length < MIN_WORDS || !theirs.length) return false;
  const have = new Set(theirs);
  if (card.filter((w) => have.has(w)).length / card.length < CORRECTION_OVERLAP) return false;
  // Their own sentence carded as it stands is an echo, not a correction.
  return !` ${theirs.join(' ')} `.includes(` ${card.join(' ')} `);
}

/** After a sentence card has painted, or was pointed at an item already up that holds it: a correction of what the student just said is remembered for the summary. */
export function v2NoteCorrectedSentence(session: V2Session, state: V2State, sentence: unknown, studentSaid: string | null | undefined): void {
  if (!v2SentenceCardsOn(session) || typeof sentence !== 'string') return;
  const s = sentence.replace(/\s+/g, ' ').trim().slice(0, MAX_SENTENCE_CHARS);
  if (!v2IsCorrectionOf(s, studentSaid)) return;
  const key = tokens(s).join(' ');
  const kept = (state.correctedSentences ?? []).filter((x) => tokens(x).join(' ') !== key);
  state.correctedSentences = [...kept, s].slice(-V2_MAX_CORRECTED_SENTENCES);
}

/** The facts line (sentence-card sessions with a correction on record only). */
export function v2SentenceCardsFacts(session: V2Session, state: V2State): string[] {
  const list = state.correctedSentences ?? [];
  if (!v2SentenceCardsOn(session) || !list.length) return [];
  // Quoted as JSON strings: a sentence with a double quote in it (reported speech) would end its quote early (review 4c M5).
  return [`their corrected sentences so far: ${list.map((s) => JSON.stringify(s)).join('; ')}`];
}

/** The route's reading of the corrected sentences in the client's state: anything malformed is dropped. */
export function v2ReadCorrectedSentences(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out = raw.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(-V2_MAX_CORRECTED_SENTENCES).map((x) => x.slice(0, MAX_SENTENCE_CHARS));
  return out.length ? out : undefined;
}
