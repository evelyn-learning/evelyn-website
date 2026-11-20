/**
 * Tutor brain v2 — Task 7w (SUMMARY_MARKS): the summary's cards carry the marks of the corrections they come from.
 *
 * Mic test 7 (embed-1795100797999, 16.9 min): the facts asked for stress on the "To improve" cards and the model wrote none; one card
 * of a correction ("I felt nice when people appreciated me.") stood under "What went well"; and its note on the robot card named an
 * error the learner never made. The runtime knew each correction and the words it changed (7q / 7v), but kept only the sentences.
 * Now, in a spoken lesson that teaches a language with a labelled plan:
 *  - each correction card is recorded with what they said and the words it changed (state.corrections, at most
 *    V2_MAX_CORRECTIONS): the changed words the runtime computes (adaptive.ts v2ChangedWords: "robots … interest" → "robot",
 *    "interests"), or the card's own stress when more than three words changed;
 *  - on the Summary page, a sentence card that is one of them (words compared as 7u does: numbers as words, fillers out) gets that
 *    record's marks when the model wrote none or wrote words that are not in the sentence; under the "What went well" heading it is
 *    not painted (it is a correction);
 *  - the summary facts list the corrections as "said → correct (changed: …)" and say the "To improve" cards come only from them.
 * The marks are drawn as on the lesson's correction cards (a sentence card's `emphasis`, WhiteboardCanvas.tsx SentenceCard). Every
 * other lesson: nothing recorded, nothing changed. Pure, client-safe.
 */
import { TUTOR_V2_CORRECTION_KEPT, TUTOR_V2_CORRECTIONS_ALL_GUARDED, TUTOR_V2_SUMMARY_MARKS } from '../orchestrator/flags';
import { v2ChangedWords } from './adaptive';
import { v2CardCorrects } from './learner-card';
import { v2NoteTargetsOn } from './note-targets';
import { V2_CLOSING_PAGE } from './part-close';
import { v2PlanLabelled } from './part-flow';
import { v2CorrectionWords, v2IsCorrectionOf, v2SentenceCardsOn, v2SentenceTokens } from './sentence-cards';
import type { V2Correction, V2Session, V2State, V2ToolCall } from './types';

/** The corrections the state keeps (the most recent). */
export const V2_MAX_CORRECTIONS = 12;
/** Task 8a (CORRECTIONS_ALL_GUARDED): the older corrections kept as their normalised sentence only (a 25-minute lesson made 19). */
export const V2_MAX_CORRECTED_OLDER = 60;
const OLDER_CHARS = 160;
const MAX_CHARS = 200;
const MAX_STRESS = 6;

/** The lessons it applies to: spoken, teaching a language through a second one (sentence cards), with a labelled plan. */
export function v2SummaryMarksOn(session: V2Session, enabled: boolean = TUTOR_V2_SUMMARY_MARKS): boolean {
  return enabled && v2NoteTargetsOn(session) && v2SentenceCardsOn(session) && v2PlanLabelled(session.plan);
}

const key = (s: string) => v2CorrectionWords(s).join(' ');
const clean = (s: string) => s.replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS);
const stressOf = (raw: unknown): string[] => (Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(/\s*[|,]\s*/) : []).filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.trim());

/** The sentence of theirs a card corrects: the one of their sentences it reworks with the most words in common, else their words whole. */
/** Task 8c (CORRECTION_KEPT, `kept`): a stem-alike rewrite of their sentence (learner-card.ts v2CardCorrects) is one too. */
function saidFor(card: string, studentSaid: string, kept: boolean = TUTOR_V2_CORRECTION_KEPT): string | null {
  const parts = studentSaid.split(/(?<=[.!?。！？])\s+/).map((x) => x.trim()).filter(Boolean);
  const cardWords = new Set(key(card).split(' '));
  let best: string | null = null; let bestN = -1;
  for (const p of parts) {
    if (!v2IsCorrectionOf(card, p) && !(kept && v2CardCorrects(card, p))) continue;
    const n = key(p).split(' ').filter((w) => cardWords.has(w)).length;
    if (n > bestN) { best = p; bestN = n; }
  }
  return best ?? (v2IsCorrectionOf(card, studentSaid) || (kept && v2CardCorrects(card, studentSaid)) ? studentSaid.trim() : null);
}

/** After a sentence card painted (or pointed back at one holding it): a correction of what they just said is recorded with the words it
 *  changed. `emphasis`: the card's own stress. Mutates. */
export function v2NoteCorrection(session: V2Session, state: V2State, sentence: unknown, emphasis: unknown, studentSaid: string | null | undefined, enabled: boolean = TUTOR_V2_SUMMARY_MARKS, guardAll: boolean = TUTOR_V2_CORRECTIONS_ALL_GUARDED): void {
  if (!v2SummaryMarksOn(session, enabled) || typeof sentence !== 'string' || !studentSaid?.trim()) return;
  const s = clean(sentence);
  const said = saidFor(s, studentSaid);
  if (!said) return;
  // The words the correction changed, one word a mark (the card marks whole words); more than three changed: the card's own stress.
  const changed = v2ChangedWords(said, s).flatMap((p) => p.split(' ')).filter(Boolean);
  const stress = (changed.length ? changed : stressOf(emphasis)).slice(0, MAX_STRESS);
  const k = key(s);
  const kept = (state.corrections ?? []).filter((c) => key(c.sentence) !== k);
  const all = [...kept, { said: clean(said), sentence: s, stress }];
  state.corrections = all.slice(-V2_MAX_CORRECTIONS);
  // Task 8a (CORRECTIONS_ALL_GUARDED, mic test 9, embed-1795132864767: WB76 "I attended a robotics exhibition in Tokyo last year.", corrected
  // at T42, was pushed out by 14 later corrections and painted under "What went well"): those pushed out are kept as their normalised
  // sentence, for the guard; one recorded again in full leaves the older list.
  if (guardAll) {
    const out = all.slice(0, Math.max(0, all.length - V2_MAX_CORRECTIONS)).map((c) => key(c.sentence).slice(0, OLDER_CHARS)).filter(Boolean);
    const inFull = new Set(state.corrections.map((c) => key(c.sentence)));
    const older = [...(state.correctedOlder ?? []).filter((x) => !inFull.has(x) && !out.includes(x)), ...out].slice(-V2_MAX_CORRECTED_OLDER);
    if (older.length) state.correctedOlder = older; else delete state.correctedOlder;
  }
}

/** The recorded correction a sentence is (words compared as 7u does), or undefined. */
export function v2CorrectionFor(state: Pick<V2State, 'corrections'>, sentence: string): V2Correction | undefined {
  const k = key(sentence);
  return k ? [...(state.corrections ?? [])].reverse().find((c) => key(c.sentence) === k) : undefined;
}

/** Task 8a (CORRECTIONS_ALL_GUARDED): the sentence is one of the older corrections (state.correctedOlder, normalised as `key`). */
export function v2OlderCorrection(state: Pick<V2State, 'correctedOlder'>, sentence: string): boolean {
  const k = key(sentence).slice(0, OLDER_CHARS);
  return !!k && (state.correctedOlder ?? []).includes(k);
}

/** The heading groups of the summary page: "What went well" (or the first heading) and "To improve" (or the second). */
export const V2_SUMMARY_WELL = /\bwent well\b|\bwell done\b|\bgood\b|よくでき|良かった/i;
export const V2_SUMMARY_IMPROVE = /\bimprove|\bwork on\b|\bbetter\b|改善|気をつけ/i;
export const V2_SUMMARY_WELL_REFUSED = 'not painted: this sentence is one of their corrections, so it goes under "To improve" (with the words it changed in stress), never under "What went well"; say it there or leave it';

/** On the Summary page in view: a sentence card that is one of their corrections gets the record's marks where the model wrote none (or
 *  words not in the sentence: mutates `args.emphasis`), and is refused under the "What went well" heading (the reason). `calls`: this
 *  reply's settled calls so far (the headings written on the page in this reply). Null: paint it. */
export function v2SummaryCardCheck(session: V2Session, state: V2State, args: Record<string, unknown>, calls: readonly V2ToolCall[], enabled: boolean = TUTOR_V2_SUMMARY_MARKS, guardAll: boolean = TUTOR_V2_CORRECTIONS_ALL_GUARDED): string | null {
  if (!v2SummaryMarksOn(session, enabled) || typeof args.sentence !== 'string') return null;
  const page = state.board.pages[state.board.current];
  if (!page || !V2_CLOSING_PAGE.test(page.title)) return null;
  const rec = v2CorrectionFor(state, args.sentence);
  // Task 8a (CORRECTIONS_ALL_GUARDED): an older correction (its sentence only) is refused under "What went well" too; it has no marks.
  const older = !rec && guardAll && v2OlderCorrection(state, args.sentence);
  if (!rec && !older) return null;
  // The group the card is written under: the last heading note on this page (this reply's, as written; else the page's record).
  const onPage = new Set(page.items.map((it) => it.id));
  const headings = calls.filter((c) => c.name === 'annotate' && c.args.style === 'heading' && !/^not /.test(c.outcome) && onPage.has(c.id)).map((c) => String(c.args.text ?? ''));
  const last = headings[headings.length - 1];
  // Fix round 1 (M3): only a heading that reads as "What went well"; an unrecognised one ("Next steps") is no reason to refuse.
  const well = last !== undefined && V2_SUMMARY_WELL.test(last) && !V2_SUMMARY_IMPROVE.test(last);
  if (well) return V2_SUMMARY_WELL_REFUSED;
  if (!rec) return null;
  const words = new Set(v2SentenceTokens(args.sentence));
  const given = stressOf(args.emphasis);
  // Fix round 1 (M4): the model's marks stand only when they are words of the sentence and include every word the correction changed
  // (mic test 7: the live card marked "robot, is" where "robots … interest" was the error).
  const givenWords = new Set(given.flatMap((w) => v2SentenceTokens(w)));
  const fits = given.length > 0 && given.every((w) => v2SentenceTokens(w).length > 0 && v2SentenceTokens(w).every((x) => words.has(x)))
    && rec.stress.flatMap((w) => v2SentenceTokens(w)).every((x) => givenWords.has(x));
  if (!fits && rec.stress.length) args.emphasis = [...rec.stress];
  return null;
}

/** The summary facts' list of the corrections (with the summary page's layout line). */
export function v2SummaryCorrectionsLine(session: V2Session, state: V2State, enabled: boolean = TUTOR_V2_SUMMARY_MARKS): string | null {
  if (!v2SummaryMarksOn(session, enabled)) return null;
  const list = state.corrections ?? [];
  if (!list.length) return 'their corrections in this lesson: none recorded, so the summary has no "To improve" cards; do not describe an error they did not make';
  return `their corrections in this lesson (said → correct): ${list.map((c) => `${JSON.stringify(c.said)} → ${JSON.stringify(c.sentence)}${c.stress.length ? ` (changed: ${c.stress.join(', ')})` : ''}`).join('; ')}. The "To improve" cards come only from this list, each the correct sentence with its changed words in stress; do not describe an error that is not in it. A sentence in this list is never put under "What went well"`;
}

/** The route's reading of the client's copy: anything malformed is dropped. */
export function v2ReadCorrections(raw: unknown): V2Correction[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out = raw.filter((c): c is V2Correction => !!c && typeof c === 'object' && typeof (c as V2Correction).said === 'string' && typeof (c as V2Correction).sentence === 'string' && !!(c as V2Correction).sentence.trim())
    .slice(-V2_MAX_CORRECTIONS)
    .map((c) => ({ said: clean(c.said), sentence: clean(c.sentence), stress: (Array.isArray(c.stress) ? c.stress : []).filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, MAX_STRESS).map((x) => x.trim().slice(0, 40)) }));
  return out.length ? out : undefined;
}

/** Task 8a (CORRECTIONS_ALL_GUARDED): the route's reading of the older corrections: strings only, trimmed and bounded. */
export function v2ReadCorrectedOlder(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out = raw.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(-V2_MAX_CORRECTED_OLDER).map((x) => x.trim().slice(0, OLDER_CHARS));
  return out.length ? out : undefined;
}
