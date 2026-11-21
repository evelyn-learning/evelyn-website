/**
 * Learner summary for a session that ran on tutor brain v2 (Task 8g, item 1; TUTOR_V2_LEARNER_SUMMARY).
 *
 * Mic test 11 (embed-1795220913119): the summary said no pronunciation score was measured (it was 84), listed no corrections, and told
 * the learner "He bought it" was correct when they had said "He buy it". learner-summary.ts reads data only v1 writes
 * (`pronunciation_note_planted`, cards on transcript lines). A v2 session stores, on its row:
 *  - `pronunciation_armed` "#n "sentence" (v2)" and `pronunciation_scored` "#n measured X/100 (v2)" (pronunciation-recorder.ts);
 *  - its board as the row's `whiteboardCommands`: each sentence card (`showSentence`, `data.sentence`, `data.emphasis` = the marks of a
 *    correction) with `sourceMessageIndex`, the transcript index of the tutor reply that wrote it; pages (`newPage`, `data.title`);
 *  - its transcript (role / text).
 * So everything the summary needs is on the row at session end: nothing new is stored. The corrections are the sentence cards (marked or
 * not) that rework a sentence of theirs in the student lines just before the reply, by the one correction test (sentence-cards.ts
 * v2IsCorrectionOf, stems alike for a marked card): the same pairing the 7w record makes during the lesson; a card that pairs with none
 * is left out. Cards on a closing page (the summary recaps) are no correction of the line before them. The sentences they said right
 * are those the tutor carded exactly as said, with no word marked. Pure.
 */
import { V2_CLOSING_PAGE } from '../v2/part-close';
import { v2CorrectionStems, v2CorrectionWords, v2IsCorrectionOf } from '../v2/sentence-cards';
import { v2CardIsAsSaid } from '../v2/learner-card';

export type V2SummaryInput = {
  transcript: Array<{ role: string; text: string }>;
  whiteboardCommands?: Array<Record<string, unknown>>;
  debugEvents?: Array<{ type: string; message: string }>;
};

/** A v2 session: the voice client's `start_v2` event (useV2Turns.ts). */
export function isV2SummarySession(events: ReadonlyArray<{ type: string }> | undefined): boolean {
  return (events ?? []).some((e) => e.type === 'start_v2');
}

const isStudent = (role: string) => role === 'student' || role === 'user';
const key = (s: string) => v2CorrectionWords(s).join(' ');
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const SPLIT = /(?<=[.!?。！？])\s+/;
const indexOf = (v: unknown): number => {
  if (typeof v === 'number') return v;
  const n = Number(typeof v === 'object' && v ? (v as Record<string, unknown>).$numberInt : v);
  return Number.isFinite(n) ? n : -1;
};

/** The pronunciation scores of the session: each `pronunciation_scored` measurement with the sentence of its arm. */
export function v2PronunciationScores(events: ReadonlyArray<{ type: string; message: string }>): Array<{ sentence: string; overall: number; prosody: number | null; weak: string[] }> {
  const armed = new Map<string, string>();
  const out: Array<{ sentence: string; overall: number; prosody: number | null; weak: string[] }> = [];
  for (const e of events) {
    if (e.type === 'pronunciation_armed') {
      const m = /^#(\d+)\s+"([\s\S]*)"\s*\(v2\)\s*$/.exec(e.message ?? '');
      if (m) armed.set(m[1]!, m[2]!);
      continue;
    }
    if (e.type !== 'pronunciation_scored') continue;
    const m = /^#(\d+)\s+measured\s+(\d+(?:\.\d+)?)\/100\b/.exec(e.message ?? '');
    const sentence = m ? armed.get(m[1]!) : undefined;
    if (m && sentence) out.push({ sentence, overall: Number(m[2]), prosody: null, weak: [] });
  }
  return out;
}

/** The distinct sentences armed for a recording (a re-arm of the same sentence is not a second one). */
export function v2PronunciationArmedCount(events: ReadonlyArray<{ type: string; message: string }>): number {
  const texts = new Set<string>();
  for (const e of events) {
    if (e.type !== 'pronunciation_armed') continue;
    const m = /"([\s\S]*)"\s*(?:\(v2\))?\s*$/.exec(e.message ?? '');
    texts.add(m ? m[1]! : e.message);
  }
  return texts.size;
}

type Card = { sentence: string; marked: boolean; stems: boolean; at: number };

/** The row's sentence cards with the transcript index of the reply that wrote each, closing pages' cards left out. */
function cardsOf(commands: ReadonlyArray<Record<string, unknown>>): Card[] {
  const out: Card[] = [];
  let closing = false;
  for (const c of commands) {
    const data = (c.data ?? {}) as Record<string, unknown>;
    if (c.action === 'newPage') { closing = V2_CLOSING_PAGE.test(String(data.title ?? '')); continue; }
    if (c.action !== 'showSentence' || closing || typeof data.sentence !== 'string' || !data.sentence.trim()) continue;
    const at = indexOf(c.sourceMessageIndex);
    if (at < 0) continue;
    const marked = Array.isArray(data.emphasis) && data.emphasis.some((w) => typeof w === 'string' && w.trim());
    out.push({ sentence: clean(data.sentence), marked, stems: v2CorrectionStems(data.emphasis), at });
  }
  return out;
}

/** The student lines right before transcript index `at` (the answer the reply at `at` replies to), as sentences. */
function answerBefore(transcript: V2SummaryInput['transcript'], at: number): string[] {
  const lines: string[] = [];
  for (let k = Math.min(at, transcript.length) - 1; k >= 0 && isStudent(transcript[k]!.role); k -= 1) lines.unshift(String(transcript[k]!.text ?? ''));
  return clean(lines.join(' ')).split(SPLIT).map((x) => x.trim()).filter(Boolean);
}
/** The sentence of theirs a card reworks by the one correction test (sentence-cards.ts v2IsCorrectionOf, stems alike only for a
 *  marked card, as the engine reads it): of those it pairs with, the one sharing the most words; or null. Fix round 1 (I2): never paired
 *  without the test. */
/** Fix round 2 (I-1, the controller's ruling): `right`, the keys of their sentences the same reply carded unmarked exactly as said: a
 *  card is no correction of those (a pattern-drill model card after a right sentence: "I have worked here for five years." carded as
 *  said, then "She has worked here for three years."). */
function saidFor(card: Card, sentences: readonly string[], right: ReadonlySet<string> = new Set()): string | null {
  const cardWords = new Set(key(card.sentence).split(' '));
  let best: string | null = null; let bestN = -1;
  for (const s of sentences) {
    if (right.has(key(s)) || !v2IsCorrectionOf(card.sentence, s, undefined, card.stems)) continue;
    const n = key(s).split(' ').filter((w) => cardWords.has(w)).length;
    if (n > bestN) { best = s; bestN = n; }
  }
  return best;
}

/** The lesson's corrections, what they said → the corrected sentence, in lesson order, one per sentence of theirs (its last card).
 *  Fix round 1 (I1): a card is a correction by the test, marked or not ("He buy it." → an unmarked "He bought it." is one). Fix round 1
 *  (I2): only the student lines right before the reply that wrote it are read; a card that pairs with none of them is left out. */
export function v2CorrectionsFromRow(input: V2SummaryInput, max: number): Array<{ student: string; corrected: string }> {
  const transcript = input.transcript ?? [];
  const bySaid = new Map<string, { student: string; corrected: string }>();
  const cards = cardsOf(input.whiteboardCommands ?? []);
  // Fix round 2 (I-1): per reply, their sentences it carded unmarked exactly as said.
  const rightIn = (at: number): Set<string> => {
    const theirs = answerBefore(transcript, at);
    return new Set(cards.filter((c) => c.at === at && !c.marked).flatMap((c) => theirs.filter((x) => v2CardIsAsSaid(c.sentence, x)).map(key)));
  };
  for (const card of cards) {
    const said = saidFor(card, answerBefore(transcript, card.at), rightIn(card.at));
    // A second card for the same sentence of theirs (a shorter one, then the whole) replaces the first, in its place.
    if (said) bySaid.set(key(said), { student: clean(said), corrected: card.sentence });
  }
  return [...bySaid.values()].slice(0, max);
}

/** The sentences they said right: an unmarked card that IS a sentence of theirs as they said it (learner-card.ts v2CardIsAsSaid:
 *  numbers as words, fillers, case and punctuation aside), in the student lines right before the reply that wrote it, and never one a
 *  correction reworks or a corrected sentence (fix round 1, I1). A sentence the tutor did not correct is not taken as right on that
 *  alone (the level check corrects nothing). The last `max`, once each, as carded. */
export function v2SentencesSaidRight(input: V2SummaryInput, max: number): string[] {
  const transcript = input.transcript ?? [];
  const corrections = v2CorrectionsFromRow(input, Number.MAX_SAFE_INTEGER);
  const correctedSaid = new Set(corrections.map((c) => key(c.student)));
  const corrected = new Set(corrections.map((c) => key(c.corrected)));
  const out: string[] = []; const seen = new Set<string>();
  for (const card of cardsOf(input.whiteboardCommands ?? [])) {
    if (card.marked) continue;
    const k = key(card.sentence);
    if (!k || seen.has(k) || corrected.has(k)) continue;
    const of = answerBefore(transcript, card.at).find((x) => v2CardIsAsSaid(card.sentence, x));
    if (!of || correctedSaid.has(key(of))) continue;
    seen.add(k); out.push(card.sentence);
  }
  return out.slice(-max);
}
