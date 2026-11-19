/**
 * Tutor brain v2 — measured pronunciation practice.
 *
 * A partner with `pronunciation` (partner-session-options.ts, under the TUTOR_PRONUNCIATION_ASSESS kill switch) has
 * the tutor practise saying words and sentences with a measurement, never by ear: the recogniser writes what it
 * guessed, not how it sounded, and v1 praised and corrected pronunciation from that transcript. The control tool
 * `practise_pronunciation({ items })` arms the student's next spoken reply; the voice client records it (the
 * recogniser's microphone frames into v1's ClipCapture, pronunciation-recorder.ts) and has it scored by
 * /api/tutor/pronunciation/assess; the score is put in the state before the next turn and comes back in that
 * turn's facts. Below PRONUNCIATION_LOW_SCORE the facts ask for one more try, once; a recording that could not be
 * measured is asked for again, once. Without a measurement the facts and the session part say nothing is to be
 * said about how they sounded.
 *
 * Spoken lessons only (the measurement needs the microphone), in a taught lesson: not homework, not a discussion.
 * The thresholds and the "measured" rule are v1's (pronunciation/assessor.ts). Pure, client-safe.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { PRONUNCIATION_LOW_SCORE, pronunciationLowScore } from '../pronunciation/assessor';
import { MAX_REFERENCE_CHARS } from '../pronunciation/assess-request';
import { WORD_FLAG_SCORE } from '../pronunciation/normalize';
import { discussionOf } from './discussion';
import { stripBoardBlocks } from './board-inline';
import { v2ReplySentences } from './one-question';
import { TUTOR_V2_PRONUNCIATION_FALLBACK, TUTOR_V2_PRONUNCIATION_PAGE, TUTOR_V2_TEXT_NO_SOUND } from '../orchestrator/flags';
import type { V2Session, V2State } from './types';

export { PRONUNCIATION_LOW_SCORE };

/** What one scored reply came to, as the voice client puts it into the state for the next turn. `seq` is the arm it
 *  answers; a result for an older arm is dropped. `cut`: the vendor answered, but fewer than three quarters of the
 *  words came through (v1 isMeasuredResult). `unavailable`: nothing was measured (silence, a vendor error, no reply
 *  in time). `off`: measuring is not available to this session at all. */
export interface V2PronunciationHeard {
  seq: number;
  status: 'measured' | 'cut' | 'unavailable' | 'off';
  reason?: string;
  overall?: number;
  words?: Array<{ word: string; score: number; omitted?: boolean; sound?: { ipa: string; score: number }; stressWrong?: boolean }>;
}

/** The pronunciation part of the session state (types.ts V2State.pronunciation). */
export interface V2PronunciationState {
  /** The number of the latest arm. */
  seq: number;
  /** The student's next spoken reply is recorded and scored against `reference`. `attempt` 2 is the one more try. */
  armed?: { seq: number; items: string[]; reference: string; attempt: 1 | 2 };
  /** The score of the armed reply, put in by the browser before the turn that answers it. */
  heard?: V2PronunciationHeard;
  /** The words of an item whose result asked for one more try: an arm made only of them is that try. */
  retryOf?: string[];
  /** Measuring is not available to this session: no more practice is offered. */
  off?: boolean;
}

/** At most this many items in one arm: one recording holds them all, and a clip is capped at 15 s. */
export const V2_PRONUNCIATION_MAX_ITEMS = 6;
const MAX_ITEM_CHARS = 160;
/** Reasons that mean measuring is not available to this session (no vendor, no key, the route closed to it). */
const OFF_REASONS = new Set(['no_vendor', 'no_key', 'http_404']);

/** Measured practice runs in a spoken, taught lesson of a partner that has it. */
export function v2PronunciationOn(session: V2Session): boolean {
  return !!session.pronunciation && session.mode === 'voice' && !session.homework && !session.homeworkSheet && !discussionOf(session.plan);
}

export const V2_PRACTISE_PRONUNCIATION_TOOL: Anthropic.Tool = {
  name: 'practise_pronunciation',
  description: 'Have the student\'s next spoken reply recorded and its pronunciation scored. Call it in the reply that asks them to say the items, after you have said them once yourself; then stop and let them speak. The score comes in the next turn\'s facts. The student does not see this call.',
  input_schema: {
    type: 'object',
    properties: {
      items: { type: 'array', items: { type: 'string' }, maxItems: V2_PRONUNCIATION_MAX_ITEMS, description: 'Exactly what they are to say, in order: one sentence, or a few single words. Written as it is said, with no notes or translations.' },
    },
    required: ['items'],
  },
};

const wordsOf = (text: string) => text.toLowerCase().split(/[^\p{L}\p{N}']+/u).filter(Boolean);
/** The reference text the recording is scored against: the items in order, each ended as a sentence. */
export function v2PronunciationReference(items: string[]): string {
  return items.map((i) => (/[.!?]$/.test(i) ? i : `${i}.`)).join(' ');
}

/** The tool's effect on the state: arm the next spoken reply. */
export function v2ApplyPractisePronunciation(state: V2State, args: Record<string, unknown>, fallback: boolean = TUTOR_V2_PRONUNCIATION_FALLBACK): string {
  const p = state.pronunciation ?? { seq: 0 };
  if (p.off) return fallback
    ? `not armed: pronunciation cannot be measured in this session. ${NO_SCORE_PRACTICE}`
    : 'not armed: pronunciation cannot be measured in this session. Say nothing about how they sound, and do not offer pronunciation practice again.';
  const items = (Array.isArray(args.items) ? args.items : typeof args.items === 'string' ? [args.items] : [])
    .filter((x): x is string => typeof x === 'string').map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
  if (!items.length) return 'not armed: give the words or sentence they are to say, in items.';
  if (items.length > V2_PRONUNCIATION_MAX_ITEMS || items.some((x) => x.length > MAX_ITEM_CHARS)) return `not armed: at most ${V2_PRONUNCIATION_MAX_ITEMS} items, each a word or one sentence. Ask for fewer at once.`;
  const reference = v2PronunciationReference(items);
  if (reference.length > MAX_REFERENCE_CHARS) return 'not armed: that is too much to record at once. Ask for less.';
  // The one more try: an arm made only of the words of the item that asked for it (the whole sentence again, or its weak word).
  const retry = !!p.retryOf?.length && wordsOf(reference).every((w) => p.retryOf!.includes(w));
  const seq = p.seq + 1;
  state.pronunciation = { seq, armed: { seq, items, reference, attempt: retry ? 2 : 1 } };
  return `armed: their next spoken reply is recorded and scored against "${reference}". Stop after asking them to say it; say nothing about how it sounds until the score is in the facts.`;
}

/** The browser puts a scored reply into the state before the turn that answers it; one for another arm is dropped. */
export function v2WithPronunciationHeard(state: V2State, heard: V2PronunciationHeard | null | undefined): V2State {
  if (!heard || !state.pronunciation?.armed || state.pronunciation.armed.seq !== heard.seq) return state;
  return { ...state, pronunciation: { ...state.pronunciation, heard } };
}

const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? Math.max(0, Math.min(100, Math.round(x))) : undefined);

/** The assess route's answer (route.ts: { status, reason?, measured, result? }) as a scored reply. */
export function v2PronunciationHeardOf(seq: number, httpStatus: number, data: unknown): V2PronunciationHeard {
  if (httpStatus === 404) return { seq, status: 'off', reason: 'http_404' };
  if (httpStatus < 200 || httpStatus >= 300) return { seq, status: 'unavailable', reason: `http_${httpStatus}` };
  const d = (data && typeof data === 'object' ? data : {}) as { status?: unknown; reason?: unknown; measured?: unknown; result?: { overall?: unknown; words?: unknown } | null };
  const reason = typeof d.reason === 'string' ? d.reason : undefined;
  if (d.status !== 'ok' || !d.result) return { seq, status: reason && OFF_REASONS.has(reason) ? 'off' : 'unavailable', reason: reason ?? 'bad_response' };
  if (d.measured !== true) return { seq, status: 'cut', reason: 'not_attempted' };
  const raw = Array.isArray(d.result.words) ? d.result.words as Array<Record<string, unknown>> : [];
  const words = raw.filter((w) => w && w.errorType !== 'insertion' && typeof w.word === 'string').map((w) => {
    const phonemes = Array.isArray(w.phonemes) ? (w.phonemes as Array<{ ipa?: unknown; score?: unknown }>).filter((x) => typeof x?.ipa === 'string' && num(x.score) !== undefined) : [];
    const worst = [...phonemes].sort((a, b) => num(a.score)! - num(b.score)!)[0];
    return {
      word: String(w.word), score: num(w.score) ?? 0,
      ...(w.errorType === 'omission' ? { omitted: true } : {}),
      ...(worst ? { sound: { ipa: String(worst.ipa), score: num(worst.score)! } } : {}),
      ...(w.stress === 'wrong' ? { stressWrong: true } : {}),
    };
  });
  const overall = num(d.result.overall);
  return { seq, status: 'measured', ...(overall !== undefined ? { overall } : {}), words };
}

/** The route's reading of the pronunciation state in the client's state: anything malformed is dropped. */
export function v2ReadPronunciation(raw: unknown): V2PronunciationState | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const seq = typeof r.seq === 'number' && Number.isInteger(r.seq) && r.seq >= 0 ? r.seq : null;
  if (seq === null) return undefined;
  const out: V2PronunciationState = { seq };
  const a = r.armed as Record<string, unknown> | undefined;
  if (a && typeof a === 'object' && a.seq === seq && Array.isArray(a.items)) {
    const items = a.items.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, V2_PRONUNCIATION_MAX_ITEMS).map((x) => x.slice(0, MAX_ITEM_CHARS));
    if (items.length) out.armed = { seq, items, reference: v2PronunciationReference(items), attempt: a.attempt === 2 ? 2 : 1 };
  }
  const h = r.heard as Record<string, unknown> | undefined;
  if (out.armed && h && typeof h === 'object' && h.seq === seq && ['measured', 'cut', 'unavailable', 'off'].includes(String(h.status))) {
    const words = Array.isArray(h.words) ? (h.words as Array<Record<string, unknown>>).filter((w) => w && typeof w.word === 'string').slice(0, 40).map((w) => {
      const s = w.sound as { ipa?: unknown; score?: unknown } | undefined;
      return {
        word: String(w.word).slice(0, 60), score: num(w.score) ?? 0,
        ...(w.omitted === true ? { omitted: true } : {}),
        ...(s && typeof s.ipa === 'string' && num(s.score) !== undefined ? { sound: { ipa: s.ipa.slice(0, 8), score: num(s.score)! } } : {}),
        ...(w.stressWrong === true ? { stressWrong: true } : {}),
      };
    }) : undefined;
    out.heard = {
      seq, status: h.status as V2PronunciationHeard['status'],
      ...(typeof h.reason === 'string' ? { reason: h.reason.slice(0, 60) } : {}),
      ...(num(h.overall) !== undefined ? { overall: num(h.overall) } : {}),
      ...(words ? { words } : {}),
    };
  }
  const retryOf = Array.isArray(r.retryOf) ? r.retryOf.filter((x): x is string => typeof x === 'string').slice(0, 80) : [];
  if (retryOf.length) out.retryOf = retryOf;
  if (r.off === true) out.off = true;
  return out;
}

/** v1 W9-B2: the last word was omitted because the recording ended before it, not because they skipped it. */
const cutWordOf = (h: V2PronunciationHeard) => { const last = h.words?.[h.words.length - 1]; return last?.omitted ? last : undefined; };
/** Below PRONUNCIATION_LOW_SCORE overall or on any word (v1 W11-A), a cut last word not counted against them. */
function isLow(h: V2PronunciationHeard): boolean {
  const cut = cutWordOf(h);
  return pronunciationLowScore({ overall: h.overall, words: (h.words ?? []).filter((w) => w !== cut).map((w) => ({ score: w.score, errorType: w.omitted ? 'omission' : 'none' })) }, PRONUNCIATION_LOW_SCORE);
}
const quote = (xs: string[]) => xs.map((x) => `"${x}"`).join(', ');

/** Task 6f: practice without a measurement, when there is none to be had: the tutor's model to say after, no comment on
 *  how it sounded, and the learner's choice whether to go on. */
const NO_SCORE_PRACTICE = 'If they want to go on practising, do it without a score: say the word or sentence yourself and have them say it after you, then the next one; say nothing about how they sounded, and do not call practise_pronunciation. Go on to the summary only when they want to or the time is up.';
/** Task 6f: a reply to the ask that was not a try at the item ("I said individual words.") is answered first. */
const ANSWER_FIRST = 'If what they said was not a try at it (a question, a complaint, something else), answer that first.';

/** The facts lines for pronunciation practice (only in a session that has it). `studentSaid` is this turn's words.
 *  `fallback` (TUTOR_V2_PRONUNCIATION_FALLBACK): with no measurement to be had, the learner is told once and offered
 *  practice without a score, instead of the lines that moved the learner to the summary (gdi-real-james) after one word (Task 6f). */
export function v2PronunciationFacts(session: V2Session, state: V2State, studentSaid: string | null | undefined, fallback: boolean = TUTOR_V2_PRONUNCIATION_FALLBACK, onlyScore: boolean = TUTOR_V2_PRONUNCIATION_PAGE): string[] {
  if (!v2PronunciationOn(session)) return [];
  const p = state.pronunciation;
  // A session the route will not measure: offered practice would only ever come back unmeasured.
  if (p?.off && !p.heard) return [fallback
    ? `pronunciation: it cannot be measured in this session, and they have been told there is no score today: do not say it again. ${NO_SCORE_PRACTICE}`
    : 'pronunciation: it cannot be measured in this session. Say nothing about how they sound, and do not offer pronunciation practice'];
  if (!p?.armed) return [];
  const { armed, heard } = p;
  // v1 W9-B3 (run 5): told the recording failed, the tutor told the learner "I cannot hear the sounds".
  const never = 'never say you cannot hear them, and say nothing about how it sounded';
  if (!heard) {
    if (studentSaid === null || studentSaid === undefined) return [`pronunciation: their next spoken reply is recorded and scored against "${armed.reference}"`];
    // Typed, spoken over the tutor, or the score did not come back in time: there is no measurement.
    if (!fallback) return ['pronunciation: this reply was not measured, so say nothing about how it sounded'];
    return armed.attempt === 1
      ? [`pronunciation: no score came back for this reply, so say nothing about how it sounded. ${ANSWER_FIRST} If it was a try at "${armed.reference}", ask them in one short sentence to say it once more, and call practise_pronunciation with it again (${never})`]
      : [`pronunciation: no score came back for this reply either. Say once, in one short sentence, that there is no score for it this time (${never}). ${NO_SCORE_PRACTICE}`];
  }
  if (heard.status === 'off') return [fallback
    ? `pronunciation: scoring is not available today, so this reply was not measured. ${ANSWER_FIRST} Tell them once, in one short sentence, that you cannot give a score today (${never}). ${NO_SCORE_PRACTICE}`
    : 'pronunciation: it cannot be measured in this session, so this reply was not measured: say nothing about how it sounded, and do not offer pronunciation practice again'];
  if (heard.status !== 'measured') {
    if (!fallback) return armed.attempt === 1
      ? [`pronunciation: the recording of "${armed.reference}" was cut short and could not be measured. In one short sentence ask them to say it once more, and call practise_pronunciation with it again (${never})`]
      : [`pronunciation: the second recording of "${armed.reference}" could not be measured either. Leave it there and go on (${never})`];
    return armed.attempt === 1
      ? [`pronunciation: the recording of "${armed.reference}" was cut short and could not be measured. ${ANSWER_FIRST} Otherwise, in one short sentence ask them to say it once more, and call practise_pronunciation with it again (${never})`]
      : [`pronunciation: the second recording of "${armed.reference}" could not be measured either. Say once, in one short sentence, that there is no score for it this time (${never}). ${NO_SCORE_PRACTICE}`];
  }
  const cut = cutWordOf(heard);
  const words = (heard.words ?? []).filter((w) => w !== cut).slice(0, 8).map((w) => w.omitted
    ? `"${w.word}" not said`
    : `"${w.word}" ${w.score}/100${w.score < WORD_FLAG_SCORE && w.sound ? `, weakest sound /${w.sound.ipa}/ ${w.sound.score}/100` : ''}${w.stressWrong ? ', stress on the wrong syllable' : ''}`);
  const lines = [`pronunciation, measured just now for "${armed.reference}": ${heard.overall ?? '?'}/100 overall${words.length ? `; ${words.join('; ')}` : ''}`];
  if (cut) lines.push(`the recording ended before "${cut.word}": that is not their mistake, and it is not counted against them`);
  // v1 Task 25 §E: "was it graded?": the number was never said. v1: sounds the measurement did not name were invented.
  lines.push(`tell them the score as "${heard.overall ?? '?'} out of 100", and speak only of the items and sounds measured here`);
  // Task 7s (PRONUNCIATION_PAGE, mic test 5, embed-1795050656326): the tutor said "responsibilities は90点" beside the measured 93,
  // and "international は98点" beside 96: a second number of its own.
  // Fix round 1 (M2): the word numbers above are for the tutor; the overall is the one number said.
  if (onlyScore && typeof heard.overall === 'number') lines.push(`the score of this attempt is ${heard.overall} out of 100, and it is the only number you may say about it: the word numbers above are for you, not to be said, and no other score or number of your own`);
  const weak = (heard.words ?? []).filter((w) => w !== cut && !w.omitted && w.score < PRONUNCIATION_LOW_SCORE).map((w) => w.word);
  if (isLow(heard)) {
    // v1 W11-A (run 7): "developed" scored 16/100, the tutor named the sound and moved on: no repeat in five items.
    lines.push(armed.attempt === 1
      ? `below ${PRONUNCIATION_LOW_SCORE}: one more try. Say ${weak.length ? quote(weak) : 'it'} once more yourself with one tip on the weakest sound, ask them to try again, and call practise_pronunciation with it`
      : 'that was their one more try: say what improved, if anything, and go on; no further repeat of it');
  }
  return lines;
}

/** The facts line for a typed language lesson (D4/D8, Task 6): one with measured pronunciation or a second teaching
 *  language, in text mode, where practise_pronunciation is not offered. Typed, the tutor said "you said it clearly …
 *  sounds natural" two replies after saying it cannot hear (beginner-ja t69–t75), and a learner's pick of "a sentence"
 *  became a meaning-and-grammar drill (upper-int t61–t69). Every turn, since the plan's pronunciation part can come at
 *  any point. `enabled` is the kill switch (tests pass it). */
export function v2TextSoundFacts(session: V2Session, enabled: boolean = TUTOR_V2_TEXT_NO_SOUND): string[] {
  if (!enabled || session.mode !== 'text' || session.homework || session.homeworkSheet || discussionOf(session.plan)) return [];
  if (!session.pronunciation && (session.languages?.length ?? 0) < 2) return [];
  return ['sound: this lesson is typed: nothing they say reaches you as sound and nothing is measured, so say nothing about their pronunciation or how anything sounded when they said it (never "you said it clearly"); a word on their wording is fine. At a pronunciation part, give the sentence or words with the stressed words marked, for them to say aloud on their own and type when they are ready; it is practice in saying it, not a grammar or meaning drill'];
}

/** After the facts are rendered: a scored reply, or a spoken one, uses the arm up; what it asked for is remembered. */
export function v2ConsumePronunciation(session: V2Session, state: V2State, studentSaid: string | null | undefined, fallback: boolean = TUTOR_V2_PRONUNCIATION_FALLBACK): void {
  const p = state.pronunciation;
  if (!v2PronunciationOn(session) || !p) return;
  if (!p.heard && (studentSaid === null || studentSaid === undefined)) return;
  const h = p.heard; const armed = p.armed;
  // Task 6f: a reply with no score back asks once more, as an unmeasured one does, and that try is the second (so a
  // result that never comes cannot ask again and again).
  const asksAgain = !!armed && armed.attempt === 1 && (h ? (h.status === 'cut' || h.status === 'unavailable' || (h.status === 'measured' && isLow(h))) : fallback);
  state.pronunciation = {
    seq: p.seq,
    ...(asksAgain ? { retryOf: wordsOf(armed!.reference) } : {}),
    ...(p.off || h?.status === 'off' ? { off: true } : {}),
  };
}

/** The session part's section (pronunciation sessions only). Stable for the whole session. */
export function v2PronunciationSection(): string {
  return [
    'PRONUNCIATION PRACTICE',
    // v1: pronunciation was praised and corrected from the transcript, which is the recogniser's guess at the words.
    'How they pronounce can be measured. Call practise_pronunciation with exactly what you ask them to say, in the reply that asks them; their next spoken reply is recorded and scored, and the score comes in the next turn\'s facts. Comment on their pronunciation only from a score in the facts, and only on what it measured; without one, say nothing about how they sounded.',
    // The partner's brief: an optional pronunciation mode, at the plan's pronunciation part and on request.
    'Offer it at the plan\'s pronunciation part, and whenever they ask for it. The items are that part\'s pronunciation words and sentences, or sentences of their own that you corrected this lesson.',
    // Live session (real-run-B): "Uh, just a little bit of individual words." was answered by reading the menu again.
    'Ask how they want to practise (single words or a whole sentence) as a plain spoken question, never a numbered list, and take their answer however they put it.',
    // One recording holds the whole reply: a clip is capped at 15 seconds.
    // The bilingual section has them build sentences rather than repeat yours; a drill of sounds needs a model to say after.
    'One sentence, or a few single words, at a time. Say it once yourself, ask them to say it after you (this practice is the one place where they repeat a model), and stop: their reply is the recording.',
  ].join('\n');
}

/** Task 7s fix round 1 (I3, PRONUNCIATION_PAGE): this turn's words answer an armed recording (sent for scoring, or meant to be):
 *  the pronunciation facts own the turn, and no practised-sentence line or 7b/7g card line is added beside the measured score
 *  (「私の後に繰り返してください。」 then "responsibilities." got both, mic test 5, embed-1795050656326). Read before the arm is used up. */
export function v2ScoredTurn(session: V2Session, state: Pick<V2State, 'pronunciation'>, heard: string | null | undefined, enabled: boolean = TUTOR_V2_PRONUNCIATION_PAGE): boolean {
  return enabled && v2PronunciationOn(session) && !!state.pronunciation?.armed && heard !== null && heard !== undefined;
}

/** Task 7s fix round 3 (I-A, ruling): a content question: a question word (what / when / where / why / how / which / who; 何 / どこ /
 *  いつ / なぜ / どうして / どう / どんな / どちら / だれ) in a sentence that is a question (？/? at its end, or a Japanese 〜か ending). */
const CONTENT_QWORD = /\b(?:what|when|where|why|how|which|who|whom|whose)\b|何|どこ|いつ|なぜ|どうして|どう|どんな|どちら|だれ|誰/i;
const IS_QUESTION = /[?？]["'”’」』)）]*\s*$|か[。？?]?["'”’」』)）]*\s*$/;
export function v2IsContentQuestion(sentence: string): boolean {
  const s = sentence.trim();
  return !!s && IS_QUESTION.test(s) && CONTENT_QWORD.test(s);
}
/** Task 7s fix round 2 (M3), fix round 3 (I-A, controller ruling; PRONUNCIATION_PAGE): a reply that armed a recording keeps the arm,
 *  unless its LAST sentence is a content question (v2IsContentQuestion) that holds none of the armed items ("…Repeat after me: X.
 *  What did you do last weekend?"): their answer is to that question. Every invitation to speak, hand-over, readiness check or
 *  yes/no "can you say it?" keeps the arm (「発音してみてください。」, "Now you try.", "Ready?", 「言えますか。」): a lost score is worse
 *  than a rare score against the wrong item. */
export function v2ArmClosesOnOtherAsk(said: string, items: readonly string[]): boolean {
  const last = v2ReplySentences(stripBoardBlocks(said)).pop()?.trim() ?? '';
  if (!v2IsContentQuestion(last)) return false;
  const low = last.toLowerCase();
  return !items.some((x) => { const w = x.toLowerCase().replace(/[.!?]+$/, '').trim(); return !!w && low.includes(w); });
}
