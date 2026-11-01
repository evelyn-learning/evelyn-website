/**
 * A checked-correct answer that the tutor asked for again.
 *
 * GDI starter session embed-1792261973710 (2026-10-17): the tutor said aloud
 * "make a sentence about last week — a place you went, anything"; the student
 * said "I went to Nagoya last week."; the independent check found it correct
 * for the question asked; the tutor replied 「でも、今回の問題は「岐阜」でした。
 * もう一度、"Gifu" を使って言ってみてください」 — grading against the card's
 * example, not against what it had asked. The before-display kill reads only
 * the opening stance, and this reply opened with praise; the rejection came
 * two sentences later, after the praise had been spoken.
 *
 * Deterministic half, after the turn: the check said CORRECT (deciding, for
 * the question asked or the problem itself) and the delivered turn asked the
 * student to say it again — the next brain turn gets a note to credit the
 * earlier answer and not ask for it again.
 */
import { precheckDecides, type PublicVerdictPrecheck } from './verdict-precheck-shared';
import { isRetryAsk } from './retry-cap';
import { extractQuotedSentences } from './sentence-board';
import { FILLER_TOKENS, dropFillersAndRepeats } from './filler-repeats';
import { normaliseNumberTokens } from './number-tokens';
import { withSilentClause } from './output-budget';
import { hasCorrectionCue } from './sentence-board';

export { dropFillersAndRepeats };

/** Did this delivered turn re-ask for an answer the check found correct? */
export function reAskedCheckedCorrect(p: PublicVerdictPrecheck | null | undefined, tutorText: string): boolean {
  if (!precheckDecides(p)) return false;
  if (p.verdict !== 'correct' || p.answers === 'other_part' || p.answers === 'neither') return false;
  return isRetryAsk(tutorText);
}

/** Task 15 §C (GDI run 5): the note scripted "your earlier sentence was right
 *  too, so there's no need to repeat it" after a plain repeat DRILL — it was
 *  written for the 10-17 case (the tutor REJECTED a correct answer). It now
 *  tells the brain to tell the two cases apart. */
export const CORRECT_RETRY_NOTE =
  '[runtime note — not from the student] An independent check found the student\'s previous answer CORRECT for the task as you stated it aloud, ' +
  'yet your last turn asked them to say it again or to use a different word. The task is what you SAID, not the example on the card. ' +
  'In this turn: if your last turn said the answer was wrong or asked for a different word, say in one short clause that their earlier sentence was right too; ' +
  'if it only asked them to say it again, accept what they say now in one short clause and do not mention the repeat. ' +
  'Either way do not ask for it again — move to the next item. Apply this silently; never mention this note.';

/** Lower-cased Latin words of a text, as a single space-joined string. */
function latinSentence(text: string): string {
  return (text.match(/[A-Za-z][A-Za-z']*/g) ?? []).map((w) => w.toLowerCase()).join(' ');
}

/**
 * 2026-10-18 (GDI embed-1792338502233, turn 6): the student said "I went to
 * the office yesterday" correctly and the tutor replied 「Nice. 言ってみましょう。
 * I went to the office yesterday. — 完璧です」 — asked for a sentence it was
 * about to praise. No verdict precheck was involved, so reAskedCheckedCorrect
 * could not see it. This catches the shape directly: a repeat-ask whose text
 * contains the student's own last English sentence (four words or more).
 */
// A plain "say it" ask — 言ってみましょう / 言ってみてください / repeat after me —
// without the もう一度 that isRetryAsk needs: the live turn had none.
const SAY_IT_ASK_RE =
  /言(?:って|い)(?:み(?:ましょう|てください|て)|ましょう)|繰り返し|リピート|\brepeat after me\b|\bsay (?:it|this|that)\b|\btry saying\b/;

/** "Say it once more / again / one more time" in English. */
const SAY_AGAIN_RE = /\b(?:say|repeat)\b[^.!?。？]*\b(?:once more|again|one more time)\b/i;

/** Task 18 §A: a plain "say it" ask (言ってみましょう, repeat after me, say it,
 *  try saying, "say the sentence once more") — isRetryAsk's もう一度 forms
 *  are separate. */
export function isSayItAsk(text: string): boolean {
  const t = text ?? '';
  return SAY_IT_ASK_RE.test(t) || SAY_AGAIN_RE.test(t) || /\brepeat (?:it |that |this )?after me\b/i.test(t);
}

/** Japanese "say it" asks only (言ってみましょう / 言ってみてください / 繰り返し / リピート). */
const JA_SAY_IT_ASK_RE = /言(?:って|い)(?:み(?:ましょう|てください|て)|ましょう)|繰り返し|リピート/;

/** Task 19 §A1 (GDI run 7, 140 s): `The change I meant is "the cafeteria":
 *  say "I eat lunch at the cafeteria."` — a say-verb leading straight into a
 *  quoted sentence (opening quote within 40 chars, no sentence break between)
 *  is an ask. The 言って branch sits outside \b (no ASCII word boundary
 *  before a kana/kanji). A statement ("we can say that "…"", "you could say
 *  "…"") is not: the verb must not follow a modal or a "we / people" subject. */
// Fix round 2 (m6): never / don't / do not / not / shouldn't before the verb
// is a negated say ("Never say "I have went there".") — no ask.
const SAY_QUOTE_ASK_RE = /(?:(?<!\b(?:can|could|might|would|also|often|usually|we|they|people|never|don['’]t|do not|not|shouldn['’]t)\s+)\b(?:say|repeat|try saying)\b|言って)[^"“「.!?。！？]{0,40}["“「]/giu;
/** Fix round 3 (m6): a descriptive say with words between subject and verb —
 *  "In English we often just say "…"", "people normally say "…"", "you
 *  sometimes say "…"" — is no ask. A bare "you" stays an ask ("Now you say
 *  "…"", "Could you say "…"?"): it needs an adverb, and never after can /
 *  could / would / will / do / did. Fix round 4 (m6): a plural-noun subject
 *  ("Native speakers just say "…" here.") is descriptive too. */
const DESCRIPTIVE_SAY_LEAD_RE = /(?:\b(?:we|they|people|(?:native )?speakers|natives|americans|britons|everyone|most people)\s+(?:\w+\s+){0,2}|(?<!\b(?:can|could|would|will|do|did)\s+)\byou\s+(?:\w+\s+){0,1}(?:often|usually|just|normally|also|sometimes)\s+)$/i;

/** A say-verb leading into a quote that is not descriptive (fix round 3, m6). */
function hasSayQuoteAsk(t: string): boolean {
  for (const m of t.matchAll(SAY_QUOTE_ASK_RE)) {
    const before = t.slice(Math.max(0, (m.index ?? 0) - 60), m.index ?? 0);
    if (!DESCRIPTIVE_SAY_LEAD_RE.test(before)) return true;
  }
  return false;
}
/** Fix round 2 (m6): a negated say and the quote it introduces — the wrong
 *  form (`Don't say "I am agree", say "I agree"`), never a target. */
const NEGATED_SAY_QUOTE_RE = /\b(?:never|don['’]t|do not|not|shouldn['’]t)\s+(?:say|use)\b[^"“「.!?。！？]{0,40}["“「][^"”」]*["”」]?/gi;

/** The turn's quoted sentences that can be a repeat target: quotes after a
 *  negated say dropped, then the last ≥ 3-word one. */
function lastTargetQuote(text: string): string | null {
  const quotes = extractQuotedSentences(text.replace(NEGATED_SAY_QUOTE_RE, ' '));
  return quotes.length > 0 ? quotes[quotes.length - 1]! : null;
}

/** Fix round 2 (m1, m5): a repeat ask strict enough to act on — isRetryAsk,
 *  "say/repeat … once more / again", "repeat after me", a Japanese say-it
 *  ask, or (Task 19 §A1) a say-verb followed by a quoted sentence. Not the
 *  bare "say it" / "say that" / "try saying" of isSayItAsk ("you can say it
 *  naturally now", "we can say that …"). */
export function isStrictRepeatAsk(text: string): boolean {
  const t = text ?? '';
  return isRetryAsk(t) || SAY_AGAIN_RE.test(t) || /\brepeat (?:it |that |this )?after me\b/i.test(t) || JA_SAY_IT_ASK_RE.test(t) || hasSayQuoteAsk(t);
}

// ─────────────────────────────────────────────────────────────────────────
// Task 25 §G (GDI run 13, 798–854 s): "let's say "other experienced
// colleagues" instead. Can you try that sentence once more?" → the student's
// attempt (partly correct) → "Can you say: I talked to my manager and other
// colleagues?" — a THIRD wording to repeat. Two tries, then teach (10-30): a
// correct-enough repeat ends the probe.
// ─────────────────────────────────────────────────────────────────────────
/** "Can you say: …" / "Can you say "…"" / "can you repeat / try it / that /
 *  the sentence / saying …", "try that sentence". Narrowed from a bare "can
 *  you say / try": "Can you say what you did next?" is a new question. */
const CAN_YOU_REPEAT_RE = /\bcan you (?:say|repeat|try)\b(?:\s*[:："“「]|\s+(?:it|that|this|the (?:whole |full |same )?sentence|saying)\b)|\btry that sentence\b/i;
/** A repeat ask for the third-version rule: isStrictRepeatAsk's forms, plus
 *  the "can you say: …" / "try that sentence" asks. */
export function isRepeatAskForThirdVersion(text: string): boolean {
  const t = text ?? '';
  return isStrictRepeatAsk(t) || CAN_YOU_REPEAT_RE.test(t);
}
const ATTEMPT_MIN_CONTENT_TOKENS = 3;
const ATTEMPT_MIN_OVERLAP = 0.5;
const ATTEMPT_FUNCTION_WORDS = new Set(['i', 'me', 'my', 'you', 'your', 'we', 'our', 'he', 'she', 'it', 'they', 'them', 'his', 'her', 'their',
  'a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'is', 'am', 'are', 'was', 'were', 'be', 'that', 'this']);
const ATTEMPT_FILLERS = new Set(['uh', 'um', 'umm', 'uhm', 'er', 'erm', 'ah', 'hmm', 'like', 'yes', 'yeah', 'no', 'ok', 'okay', 'so', 'well', 'oh']);
/**
 * The attempt asks the learner to say a sentence AGAIN after a repeat ask
 * they answered with an attempt (≥ 3 content words, not a question) that the
 * check did not find incorrect ⇒ reject (validator repeat_ask_third_version).
 * An incorrect repeat may be asked once more (the "two tries" rule).
 */
export function repeatAskThirdVersion(input: {
  prevTutorText: string | null | undefined;
  studentText: string | null | undefined;
  verdict: string | null | undefined;
  attemptText: string | null | undefined;
}): boolean {
  if (input.verdict === 'incorrect') return false;
  if (!isRepeatAskForThirdVersion(input.prevTutorText ?? '')) return false;
  const student = (input.studentText ?? '').trim();
  if (!student || /[?？]\s*$/.test(student)) return false;
  const content = (student.toLowerCase().match(/[a-z]+(?:['’][a-z]+)*/g) ?? []).filter((w) => !ATTEMPT_FILLERS.has(w));
  if (content.length < ATTEMPT_MIN_CONTENT_TOKENS) return false;
  // Fix round 1 (m-4): an attempt says (half of) what was asked — "I don't
  // understand that" / "Sorry I forgot it" are no attempts. Function words
  // aside, ≥ 50 % of the reply's words appear in the previous turn.
  const asked = new Set((input.prevTutorText ?? '').toLowerCase().match(/[a-z]+(?:['’][a-z]+)*/g) ?? []);
  const said = content.filter((w) => !ATTEMPT_FUNCTION_WORDS.has(w));
  if (said.length === 0 || said.filter((w) => asked.has(w)).length / said.length < ATTEMPT_MIN_OVERLAP) return false;
  return isRepeatAskForThirdVersion(input.attemptText ?? '');
}
/** The directive the killed attempt's retry gets. */
export const REPEAT_ASK_THIRD_VERSION_REASON = withSilentClause(
  'The student has already tried this sentence twice. Accept their attempt in one sentence (say the natural form once if you must), then continue with your next question. Do not ask them to say it again.');

// ─────────────────────────────────────────────────────────────────────────
// Task 28 §D (GDI run 15, 444–518 s; the pacing rule "two tries, then teach",
// 2026-10-30): the tutor asked for "presentations" (plural); the student said
// the singular (458 s, incorrect) → asked again (461 s); "present at ions"
// (501 s) → asked AGAIN (503 s). §G lets an incorrect repeat be asked once
// more but puts no ceiling on it. After TWO attempts at the same model
// sentence / target word since the first repeat ask, a turn that asks for it
// again is rejected whatever the verdict (validator repeat_ask_after_two_tries).
// The counter (RepeatAskTries, held by VTR next to the re-ask state) resets
// when the model sentence changes or the segment advances.
// ─────────────────────────────────────────────────────────────────────────
/** Attempts after which a repeat ask of the same target is rejected. */
export const REPEAT_ASK_MAX_TRIES = 2;
/** The open repeat ask: its model sentence (normalised tokens joined, or
 *  null when the ask quoted only a word), its target words (quoted 1–2-word
 *  spans, normalised), the segment it was asked on, and the student's
 *  attempts at it since. */
export interface RepeatAskTries { sentence: string | null; words: string[]; segmentId: string; attempts: number }
const QUOTED_ANY_RE = /"([^"\n]+)"|“([^”\n]+)”|「([^」\n]+)」/g;
/** Fix round 1 (m-4): contractions expanded, so "I've learned" ≡ "I have learned". */
const CONTRACTION_EXPANSIONS: Array<[RegExp, string]> = [
  [/\b(i|you|we|they)'ve\b/g, '$1 have'], [/\bi'm\b/g, 'i am'], [/\b(you|we|they)'re\b/g, '$1 are'],
  [/\b(i|you|we|they|he|she|it)'ll\b/g, '$1 will'], [/\b(it|that|he|she|there)'s\b/g, '$1 is'],
  [/\bcan't\b/g, 'can not'], [/\bwon't\b/g, 'will not'], [/\b(\w+)n't\b/g, '$1 not'],
];
const repeatToks = (text: string): string[] => {
  let t = (text ?? '').toLowerCase().replace(/’/g, "'");
  for (const [re, to] of CONTRACTION_EXPANSIONS) t = t.replace(re, to);
  return normaliseNumberTokens(t.match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) ?? []);
};
/** Fix round 1 (m-4): two model sentences are the same target when ≥ 80 % of
 *  the longer one's tokens are shared (a rewording or one edit). */
const SAME_TARGET_SHARE = 0.8;
function sameModelSentence(a: string, b: string): boolean {
  if (a === b) return true;
  const x = a.split(' '), y = b.split(' ');
  const left = new Map<string, number>();
  for (const w of x) left.set(w, (left.get(w) ?? 0) + 1);
  let common = 0;
  for (const w of y) { const n = left.get(w) ?? 0; if (n > 0) { common++; left.set(w, n - 1); } }
  return common / Math.max(x.length, y.length) >= SAME_TARGET_SHARE;
}
/** The target a repeat ask names, or null when the text is no repeat ask
 *  (isRepeatAskForThirdVersion). sentence = the last ≥ 3-word quote (negated
 *  says aside), words = the quoted 1–2-word spans ("presentations"). */
export function repeatAskTargetOf(text: string | null | undefined): { sentence: string | null; words: string[] } | null {
  const t = text ?? '';
  if (!isRepeatAskForThirdVersion(t)) return null;
  const q = lastTargetQuote(t);
  const words: string[] = [];
  for (const m of t.replace(NEGATED_SAY_QUOTE_RE, ' ').matchAll(QUOTED_ANY_RE)) {
    const inner = repeatToks(m.slice(1).find((g) => g !== undefined) ?? '');
    if (inner.length >= 1 && inner.length <= 2) words.push(inner.join(' '));
  }
  return { sentence: q ? repeatToks(q).join(' ') : null, words };
}
/** The target `t` is the one `tries` counts: the same sentence; words only,
 *  all inside the tracked sentence / words; a sentence holding all the tracked
 *  words (a word-only ask before); or no quote at all (an ask that points back). */
function sameRepeatTarget(tries: RepeatAskTries, t: { sentence: string | null; words: string[] }): boolean {
  if (!t.sentence && t.words.length === 0) return true;
  const inTracked = (w: string) => tries.words.includes(w) || (!!tries.sentence && ` ${tries.sentence} `.includes(` ${w} `));
  if (t.sentence && tries.sentence) return sameModelSentence(t.sentence, tries.sentence);
  if (!t.sentence) return t.words.every(inTracked);
  return tries.words.length > 0 && tries.words.every((w) => ` ${t.sentence} `.includes(` ${w} `));
}
/** After a delivered tutor turn: a repeat ask of the tracked target keeps the
 *  count (sentence / words merged); a repeat ask of a new target starts a new
 *  count at 0; a turn that asks no repeat ends it — unless it answered a
 *  runtime directive (an idle nudge, a continuation), which keeps it. A new
 *  segment always ends it. */
export function repeatAskTriesAfterTutorTurn(
  tries: RepeatAskTries | null,
  input: { tutorText: string; segmentId: string; runtimeTriggered: boolean },
): RepeatAskTries | null {
  const cur = tries && tries.segmentId === input.segmentId ? tries : null;
  const target = repeatAskTargetOf(input.tutorText);
  if (!target) return input.runtimeTriggered ? cur : null;
  if (cur && sameRepeatTarget(cur, target)) {
    return { ...cur, sentence: cur.sentence ?? target.sentence, words: [...new Set([...cur.words, ...target.words])] };
  }
  if (!target.sentence && target.words.length === 0) return null;
  return { sentence: target.sentence, words: target.words, segmentId: input.segmentId, attempts: 0 };
}
/** A student turn at the tracked target: not a question, and ≥ 3 content
 *  words of which (function words aside) ≥ 50 % are the target's, or a
 *  target word itself ("presentations"). Counts one attempt. */
export function repeatAskTriesAfterStudentTurn(
  tries: RepeatAskTries | null,
  input: { studentText: string; segmentId: string },
): RepeatAskTries | null {
  if (!tries) return null;
  if (tries.segmentId !== input.segmentId) return null;
  const student = (input.studentText ?? '').trim();
  if (!student || /^\s*\[/.test(student) || /[?？]\s*$/.test(student)) return tries;
  const toks = repeatToks(student);
  const content = toks.filter((w) => !ATTEMPT_FILLERS.has(w));
  const target = new Set([...(tries.sentence ? tries.sentence.split(' ') : []), ...tries.words.flatMap((w) => w.split(' '))]);
  // Fix round 1 (m-5): a quoted function word ("the" before USA) is no target word to say.
  const hasWord = tries.words.filter((w) => !w.split(' ').every((x) => ATTEMPT_FUNCTION_WORDS.has(x)))
    .some((w) => ` ${toks.join(' ')} `.includes(` ${w} `));
  const said = content.filter((w) => !ATTEMPT_FUNCTION_WORDS.has(w));
  const overlap = said.length > 0 && said.filter((w) => target.has(w)).length / said.length >= ATTEMPT_MIN_OVERLAP;
  const attempt = hasWord || (content.length >= ATTEMPT_MIN_CONTENT_TOKENS && overlap);
  return attempt ? { ...tries, attempts: tries.attempts + 1 } : tries;
}
/** The attempt asks for the tracked target again after REPEAT_ASK_MAX_TRIES
 *  attempts on this segment ⇒ reject. A new model sentence is allowed. */
export function repeatAskAfterTwoTries(input: { tries: RepeatAskTries | null; attemptText: string | null | undefined; segmentId: string }): boolean {
  const tries = input.tries;
  if (!tries || tries.segmentId !== input.segmentId || tries.attempts < REPEAT_ASK_MAX_TRIES) return false;
  const target = repeatAskTargetOf(input.attemptText);
  return !!target && sameRepeatTarget(tries, target);
}
/** The directive the killed attempt's retry gets. */
export const REPEAT_ASK_AFTER_TWO_TRIES_REASON = withSilentClause(
  'The student has tried this twice. Say the correct form once yourself, accept their effort in one sentence, and continue with the next question. Do not ask them to say it again.');

/** Task 27 §D3: a tutor turn that CORRECTS the student — a quoted model
 *  sentence (3+ words) with a correction cue ("should be", "so it's", "the
 *  natural form is", "let's fix", or sentence-board's hasCorrectionCue). */
// Fix round 1 (m-5): "should be" / "so it's" count only when they lead into a quote.
const CORRECTION_TURN_CUE_RE = /\b(?:should be|so it['’]s)\s*["“「]|\b(?:the natural (?:form|way)\b[^.!?]*\bis|let['’]s fix|the correct (?:form|sentence) is)\b/i;
const QUOTED_MODEL_RE = /["“「]\s*[A-Za-z][^"”」]*?(?:\s+[A-Za-z'’,-]+){2,}[^"”」]*["”」]/;
export function isCorrectionTurn(text: string | null | undefined): boolean {
  const t = text ?? '';
  if (!QUOTED_MODEL_RE.test(t)) return false;
  return CORRECTION_TURN_CUE_RE.test(t) || hasCorrectionCue(t);
}

/** Task 19 §A5: "starting with / begin with "…"" — the verb phrase leads into
 *  an opening quote within 20 chars, no sentence break between. */
const STARTER_ASK_RE = /\b(?:start(?:ing)?|begin(?:ning)?)\s+with\b[^"“「.!?。！？]{0,20}["“「]/i;

/** Task 18 §A (GDI run 6): the line the student was asked to say, for the
 *  perception classifier's expected-repeat exemption. Fix round 2 (m2) order:
 *  an armed pronunciation target, else the last quoted sentence of the last
 *  delivered tutor turn when that turn is a strict repeat ask (then, Task 19
 *  §A5, when it is a starter ask), else a
 *  pronunciation clip sent moments ago (`recentClip` — the capture disarms
 *  when the clip closes, before the transcript lands). null otherwise. */
export function expectedRepeatFor(
  lastTutorTurn: string | null | undefined,
  armedReference: string | null | undefined,
  recentClip?: string | null,
): { text: string } | null {
  if (armedReference && armedReference.trim()) return { text: armedReference.trim() };
  const t = lastTutorTurn ?? '';
  if (t && isStrictRepeatAsk(t)) {
    const q = lastTargetQuote(t);
    if (q) return { text: q };
  }
  // Task 19 fix round 1 (§A5, GDI run 7, 197 s): `Could you say that in one
  // English sentence, starting with "I work in the sales department"?` — the
  // student said the starter alone, word for word, and it dropped as
  // self-voice. A starter ask names a line the student is expected to say.
  // (extractQuotedSentences needs ≥ 3 words, so an "I am" starter is no target.)
  if (t && STARTER_ASK_RE.test(t)) {
    const q = lastTargetQuote(t);
    if (q) return { text: q };
  }
  // Task 23 §F (GDI run 11, 987 s): the quote in one sentence, the ask that
  // points at it in a later one ("Could you say that one for me?").
  const referred = t ? quoteReferredByLaterAsk(t) : null;
  if (referred) return { text: referred };
  return recentClip && recentClip.trim() ? { text: recentClip.trim() } : null;
}

/** Task 23 §F: an ask that points back at a sentence — say / repeat / try …
 *  that / this / it / that one / the sentence, or once more / again. */
const REFERRING_ASK_RE = /\b(?:say|repeat|try)\b[^.!?。？]*\b(?:that one|this one|that sentence|the sentence|that|this|it)\b|\b(?:once more|again)\b/i;
const REFERRED_QUOTE_RE = /"([^"\n]+)"|“([^”\n]+)”/g;
const REFERRED_QUOTE_MIN_WORDS = 4;
/** Task 23 §F (GDI run 11, 987 s: `Now let's make it smoother: "I gave
 *  everyone sweets to get them to come to the seminar." Could you say that
 *  one for me?` — no expected repeat, the repeat dropped as self-voice): the
 *  last quoted span of ≥ 4 words that ends BEFORE a later sentence of the
 *  turn asking to say / repeat it. Quotes after a negated say ("Don't say
 *  "…"") are never a target. null when no such ask follows a quote. */
export function quoteReferredByLaterAsk(text: string): string | null {
  const t = (text ?? '').replace(NEGATED_SAY_QUOTE_RE, (m) => ' '.repeat(m.length));
  const quotes: Array<{ q: string; start: number; end: number }> = [];
  for (const m of t.matchAll(REFERRED_QUOTE_RE)) {
    const q = (m[1] ?? m[2] ?? '').trim();
    quotes.push({ q, start: m.index ?? 0, end: (m.index ?? 0) + m[0].length });
  }
  let found: string | null = null;
  quotes.forEach((x, i) => {
    if (latinWordCount(x.q) < REFERRED_QUOTE_MIN_WORDS) return;
    // the text after the quote up to the next quote; a quote that does not
    // end its sentence leaves the rest of that sentence as its own
    let region = t.slice(x.end, quotes[i + 1]?.start ?? t.length);
    if (!/[.!?。！？]$/.test(x.q)) region = region.replace(/^[^.!?。！？]*[.!?。！？]?/, '');
    const later = region.split(/(?<=[.!?。！？])\s+/).map((y) => y.trim()).filter(Boolean);
    if (later.some((y) => REFERRING_ASK_RE.test(y))) found = x.q;
  });
  return found;
}

/** Japanese fillers (no word boundaries in Japanese: removed as substrings
 *  from the STUDENT's text only). */
const JA_FILLER_RE = /えー+|えっと|えーと|あのー?|そのー?|まあ/g;

/** GDI run 4 (2026-10-29): the student's transcript as compared with a tutor
 *  sentence — Japanese fillers removed, then Latin fillers and stutter repeats
 *  (dropFillersAndRepeats). Lower-cased Latin words, space-joined. */
export function cleanStudentSentence(studentText: string): string {
  const latin = latinSentence((studentText ?? '').replace(JA_FILLER_RE, ' '));
  return dropFillersAndRepeats(latin.split(' ').filter(Boolean)).join(' ');
}

/** The same filler-free tokens wordTokens gives (for saidModelSentence). */
function cleanStudentTokens(studentText: string): string[] {
  return dropFillersAndRepeats(wordTokens((studentText ?? '').replace(JA_FILLER_RE, ' ')));
}

/** A tutor text's Latin words with the filler tokens dropped ("like" is a
 *  filler on both sides, so "I like sushi" still compares equal). */
function tutorLatin(text: string): string {
  return latinSentence(text).split(' ').filter((t) => t && !FILLER_TOKENS.has(t)).join(' ');
}

/** Task 24 §E1: a cue that the turn has moved to the NEXT item. */
const NEXT_ITEM_CUE_RE = /\b(?:next|move on|moving on|go on|now let'?s|let'?s (?:try|look at|practice))\b|次(?:は|に|の)|では次/i;

/** Task 24 §E2 (GDI run 12, 1018 s): "Could you try saying the full sentence
 *  now, starting with "The seminar…"?" — an ask for the full / whole /
 *  complete / same sentence with a starter quote. The starter (≥ 2 words,
 *  trailing … / ... stripped) as lower-cased Latin words, or null. */
const FULL_SENTENCE_STARTER_RE = /\b(?:say|try saying|give me|tell me)\b[^.!?]*\b(?:the|that|this) (?:full|whole|complete|same) sentence\b[^?!]*?\bstart(?:ing)? with\s*["“]([^"”\n]+)["”]/i;
function fullSentenceStarter(tutorText: string): string | null {
  const m = FULL_SENTENCE_STARTER_RE.exec(tutorText ?? '');
  if (!m) return null;
  const starter = latinSentence(m[1].replace(/(?:…|\.{2,})\s*$/, ''));
  return starter.split(' ').filter(Boolean).length >= 2 ? starter : null;
}

/** Fix round 1 (I-1): the pre-check verdict as reAskedOwnSentence's
 *  `studentCorrect` — true / false for correct / incorrect, else undefined. */
export function precheckCorrectness(verdict: string | null | undefined): boolean | undefined {
  return verdict === 'correct' ? true : verdict === 'incorrect' ? false : undefined;
}

export function reAskedOwnSentence(
  studentText: string,
  tutorText: string,
  /** Task 24 fix round 1 (I-1): the verdict pre-check on the student's turn,
   *  any confidence — true = correct, false = incorrect, undefined = none.
   *  The §E2 starter path needs `true`; the quote early return is off on
   *  `false` — a correction drill that quotes the learner's WRONG sentence
   *  and asks for it again ("…starting with "The seminar…"?") is not a
   *  re-ask. */
  opts?: { studentCorrect?: boolean },
): boolean {
  // Task 24 §E2: the full-sentence ask with a starter that begins the
  // student's own (correct) sentence, in a turn that already says it back.
  const starter = opts?.studentCorrect === true ? fullSentenceStarter(tutorText) : null;
  if (starter) {
    const saidForStarter = cleanStudentSentence(studentText);
    if (saidForStarter.split(' ').filter(Boolean).length >= 3
      && (saidForStarter === starter || saidForStarter.startsWith(`${starter} `))
      && tutorLatin(tutorText ?? '').includes(saidForStarter)) return true;
  }
  const sayAgain = SAY_AGAIN_RE.test(tutorText ?? '');
  if (!isRetryAsk(tutorText) && !SAY_IT_ASK_RE.test(tutorText ?? '') && !sayAgain) return false;
  const said = cleanStudentSentence(studentText);
  if (said.split(' ').filter(Boolean).length < 3) return false;
  // GDI run 4: 'Let's make it a clean sentence: "I showed the customer models
  // of washing machines." Can you say that once more?' after the student said
  // exactly that (with an "uh") — the quoted sentence IS the student's, and
  // every quoted sentence of three or more words in the turn is that one.
  const quotes = quotedSpans(tutorText).map(tutorLatin).filter((q) => q.split(' ').filter(Boolean).length >= 3);
  // Task 24 §E1 (GDI run 12, 231 s): the quote may sit in a PRAISE sentence
  // while the ask targets the next item ("…correctly: "I have worked …"
  // Let's move on. 次は… 言ってみましょう。Have you worked …?"). The early
  // return holds only when the quote is in the ask sentence or the one right
  // before it, with no next-item cue from the quote through the ask.
  if (opts?.studentCorrect !== false && quotes.length > 0 && quotes.every((q) => q === said) && quoteTargetsAsk(tutorText ?? '', said)) return true;
  if (!isRetryAsk(tutorText) && !SAY_IT_ASK_RE.test(tutorText ?? '')) return false;
  if (!tutorLatin(tutorText ?? '').includes(said)) return false;
  // 2026-10-18 (embed-1792350642171, turn 33): 「"I went to Nagoya Castle last
  // week." いいですね。次は "Have you ever eaten sushi?" 言ってみてください。」
  // quoted the student's correct sentence and asked for the NEXT item — not
  // a re-ask. The ask is a re-ask only when its target is the student's own
  // sentence: the ask sentence (or, when it carries no English of its own,
  // the sentence before it) holds the student's sentence and no other English
  // run of three or more words.
  const sentences = (tutorText ?? '').split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
  const askIdx = sentences.findIndex((x) => isRetryAsk(x) || SAY_IT_ASK_RE.test(x));
  if (askIdx < 0) return true;
  const own = sentences[askIdx]!;
  // An ask with no English of its own takes its target from the sentences
  // around it (「言ってみましょう。I went to the office yesterday.」).
  const target = latinWordCount(own) >= 3 ? own : `${sentences[askIdx - 1] ?? ''} ${own} ${sentences[askIdx + 1] ?? ''}`;
  const targetLatin = tutorLatin(target);
  if (!targetLatin.includes(said)) return false;
  const remainder = targetLatin.replace(said, ' ').trim();
  return latinWordCount(remainder) < 3;
}

/** §E1: the sentence quoting `said` is the (last) ask sentence or one of
 *  the two before it (fix round 1, m-1), and no sentence from it through the ask carries a
 *  next-item cue. No ask sentence ⇒ the last sentence is the ask. */
function quoteTargetsAsk(tutorText: string, said: string): boolean {
  const sentences = tutorText.split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
  if (!sentences.length) return false;
  let askIdx = -1;
  for (let i = sentences.length - 1; i >= 0; i--) {
    const x = sentences[i]!;
    if (isRetryAsk(x) || SAY_IT_ASK_RE.test(x) || SAY_AGAIN_RE.test(x)) { askIdx = i; break; }
  }
  if (askIdx < 0) askIdx = sentences.length - 1;
  let quoteIdx = -1;
  for (let i = askIdx; i >= 0; i--) {
    if (tutorLatin(sentences[i]!).includes(said)) { quoteIdx = i; break; }
  }
  // Fix round 1 (m-1): the ask sentence or either of the TWO before it (one
  // praise sentence may sit between the quote and the ask).
  if (quoteIdx < 0 || askIdx - quoteIdx > 2) return false;
  for (let i = quoteIdx; i <= askIdx; i++) if (NEXT_ITEM_CUE_RE.test(sentences[i]!)) return false;
  return true;
}

function latinWordCount(text: string): number {
  return (text.match(/[A-Za-z][A-Za-z']*/g) ?? []).length;
}

// Task 23 §D1: moved to ./number-tokens (the sentence board uses it too, and
// correct-retry already imports sentence-board); re-exported here.
export { normaliseNumberTokens };

/** Lower-cased tokens (letters/digits); apostrophes and punctuation ignored
 *  ("haven't" → "havent"); small integers as words (normaliseNumberTokens). */
function wordTokens(text: string): string[] {
  return normaliseNumberTokens(((text ?? '').match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []).map((w) => w.toLowerCase().replace(/['’]/g, '')));
}

/** Model sentences of a tutor turn: double-quoted spans and plain sentences
 *  with three or more words. */
function modelCandidates(tutorText: string): string[] {
  const t = tutorText ?? '';
  const quoted = [...t.matchAll(/"([^"\n]+)"|“([^”\n]+)”/g)].map((m) => (m[1] ?? m[2] ?? '').trim());
  const plain = t.split(/(?<=[.!?。！？])\s+|\n+/).map((x) => x.trim());
  return [...quoted, ...plain].filter((x) => wordTokens(x).length >= 3);
}

/** The student said the model sentence: EVERY token of the model is in the
 *  student's utterance, counted with multiplicity ("for … for" needs two) —
 *  fix round 1: a missing "have" in "I (have) worked for…" is the very error
 *  being corrected — and the student added at most max(2, 10 % of the model)
 *  tokens of their own (a "Yes," or "um" may ride along). */
export function saidModelSentence(model: string, studentText: string): boolean {
  const m = wordTokens(model).filter((t) => !FILLER_TOKENS.has(t));
  const st = cleanStudentTokens(studentText);
  if (m.length < 3 || st.length === 0) return false;
  const left = new Map<string, number>();
  for (const w of st) left.set(w, (left.get(w) ?? 0) + 1);
  for (const w of m) {
    const n = left.get(w) ?? 0;
    if (n === 0) return false;
    left.set(w, n - 1);
  }
  let extra = 0;
  for (const n of left.values()) extra += n;
  return extra <= Math.max(2, Math.ceil(m.length * 0.1));
}

/** A board line's leading item label ("Question 1:", "Q2.", "3)") — not
 *  something the student reads aloud. */
const BOARD_LINE_LABEL_RE = /^\s*(?:(?:question|q)\s*\d+\s*[:.)]?|\d+\s*[.)])\s*/i;

/** Task 22 §E (GDI run 10, 241 s): "Look at the card on the board and read it
 *  through. Then tell me one sentence…" — the student read the card's question
 *  aloud and a brain turn ran at once, cutting across the answer to come. A
 *  READ-ALOUD = the student's filler-free tokens are a near-verbatim reading
 *  of one line of the current board question (≥ 4 words; at most one of its
 *  tokens missing, at most two of the student's own added), and the last
 *  tutor turn did not ask for exactly that line (`expectedRepeat`). */
/** Fix round 1 (I3): the student asks the question BACK — "And you? Have
 *  you …?", "How about you?", "What about you, have you …?", "You?". */
const QUESTION_BACK_LEAD_RE = /^\s*(?:(?:um|uh|so|well|ok(?:ay)?|yes|yeah|no)\s*[,.]?\s*)*(?:(?:and|how about|what about) you\b|you\s*\?)/i;
export function isBoardReadAloud(input: {
  transcript: string; boardQuestion: string | null | undefined; expectedRepeat: string | null | undefined;
  /** Fix round 1 (I3): this board statement was held once already — a second reading is a turn. */
  heldBefore?: boolean;
}): boolean {
  const board = input.boardQuestion ?? '';
  if (!board.trim() || input.heldBefore === true) return false;
  if (QUESTION_BACK_LEAD_RE.test(input.transcript ?? '')) return false;
  const st = cleanStudentTokens(input.transcript ?? '');
  if (st.length === 0) return false;
  // Fix round 1 (I2): the student said the line they were asked for —
  // matched as saidModelSentence does (a quoted target one word off the
  // board line is still the asked-for line), not by string equality.
  if (input.expectedRepeat && saidModelSentence(input.expectedRepeat, input.transcript ?? '')) return false;
  const expected = input.expectedRepeat ? wordTokens(input.expectedRepeat).filter((t) => !FILLER_TOKENS.has(t)).join(' ') : '';
  const lines = board.split(/\n+/).map((l) => l.replace(BOARD_LINE_LABEL_RE, '').trim()).filter(Boolean);
  if (expected && expected === lines.flatMap((l) => wordTokens(l)).filter((t) => !FILLER_TOKENS.has(t)).join(' ')) return false;
  for (const line of lines) {
    const m = wordTokens(line).filter((t) => !FILLER_TOKENS.has(t));
    if (m.length < 4) continue;
    if (expected && expected === m.join(' ')) continue;
    const left = new Map<string, number>();
    for (const w of st) left.set(w, (left.get(w) ?? 0) + 1);
    let missing = 0;
    for (const w of m) {
      const n = left.get(w) ?? 0;
      if (n === 0) { missing++; continue; }
      left.set(w, n - 1);
    }
    let extra = 0;
    for (const n of left.values()) extra += n;
    if (missing <= 1 && extra <= 2) return true;
  }
  return false;
}

/** The tutor asked the student to read something ALOUD ("Please read the
 *  question aloud", "read it out loud for me", "読んでみてください") — then a
 *  reading of the board question is the asked-for line, not a read-aloud to
 *  hold. "Read it through" / "look at the card" (silent reading) is no ask. */
const READ_ALOUD_ASK_RE = /\bread(?:ing)?\b[^.!?。！？]{0,40}?\b(?:aloud|out loud|out|to me|for me)\b|読(?:んで|み上げ)/i;
/** Fix round 1 (I2): "Say the question on the card.", "Please ask me the
 *  question on the card.", "Repeat the question after me." — a say / read /
 *  repeat / ask-me / tell-me ask pointing at the question, card or board. */
const BOARD_LINE_ASK_RE = /\b(?:say|read(?:ing)?|repeat|ask me|tell me)\b[^.!?。！？]{0,40}?\b(?:question|card|board|line)\b/i;
/** Fix round 2 (I2): the ask's TARGET must be the question itself — a
 *  sentence that also asks for the answer ("Read the question on the board
 *  and answer it.", "Tell me your answer to the question on the board.") is
 *  a reading we hold (the answer is what we wait for). A say-it / repeat ask
 *  for some other sentence is not a board ask at all: its quoted target goes
 *  through expectedRepeatFor + saidModelSentence instead. */
const ANSWER_ASK_RE = /\banswer/i;
export function asksToReadAloud(tutorText: string | null | undefined): boolean {
  const sentences = (tutorText ?? '').split(/(?<=[.!?。！？])\s+|\n+/).map((x) => x.trim()).filter(Boolean);
  return sentences.some((x) => (READ_ALOUD_ASK_RE.test(x) || BOARD_LINE_ASK_RE.test(x)) && !ANSWER_ASK_RE.test(x));
}

/** A re-ask cue. */
const REASK_CUE_RE = /\b(?:once more|again|one more time)\b|もう一度/i;
/** The attempt refers to the sentence already given, without quoting it. */
const SAME_SENTENCE_REF_RE = /\b(?:that|the)\s+(?:(?:whole|full|same)\s+)?sentence\b|その文|同じ文/i; // bare それ matched それでは/それぞれ (re-review)

function quotedSpans(text: string): string[] {
  return [...(text ?? '').matchAll(/"([^"\n]+)"|“([^”\n]+)”|(?<!\p{L})'([^'\n]{6,}?)'(?!\p{L})|‘([^’\n]+)’/gu)]
    .map((m) => (m[1] ?? m[2] ?? m[3] ?? m[4] ?? '').trim());
}

/** `span`'s tokens appear, contiguous and in order, in `model`'s tokens. */
function containsRun(model: string[], span: string[]): boolean {
  if (span.length === 0 || span.length > model.length) return false;
  outer: for (let i = 0; i + span.length <= model.length; i++) {
    for (let j = 0; j < span.length; j++) if (model[i + j] !== span[j]) continue outer;
    return true;
  }
  return false;
}

/**
 * GDI run 3 (2026-10-29): the tutor modelled `Last month, I sold 25 machines
 * to Toyota.`, the student said `Last month I sold 25 machines to Toyota.`,
 * and the reply asked `Could you say the whole sentence once more, starting
 * with "Last month"?` — reAskedOwnSentence needs the student's sentence in
 * the ask and could not see it. The model sentence (from the PREVIOUS tutor
 * turn) the student just said, when the attempt asks for THAT sentence again:
 *   (a) a re-ask cue (once more | again | one more time | もう一度), and
 *   (b) it quotes ≥ 3 words of the model sentence, or refers to "that/the
 *       (whole|full|same) sentence" / それ / その文, and
 *   (c) it quotes no other span of ≥ 3 words that is not part of the model
 *       ("try again with a new one: 'Last week I visited Osaka.'" is a new item).
 * null ⇒ not a re-ask.
 */
export function reAskedModelSentence(prevTutorText: string, studentText: string, attemptText: string): string | null {
  const attempt = attemptText ?? '';
  if (!REASK_CUE_RE.test(attempt)) return null;
  const spans = quotedSpans(attempt).map(wordTokens).filter((t) => t.length >= 3);
  for (const c of modelCandidates(prevTutorText)) {
    if (!saidModelSentence(c, studentText)) continue;
    const m = wordTokens(c);
    if (spans.some((sp) => !containsRun(m, sp))) continue;
    const quotesModel = spans.some((sp) => containsRun(m, sp));
    if (quotesModel || SAME_SENTENCE_REF_RE.test(attempt)) return c;
  }
  return null;
}

/** Language sessions: the validator rejection (kill + retry) for such a re-ask. */
export const REPEAT_AFTER_CORRECT_REASON = withSilentClause(
  'The student just said that sentence correctly. Confirm it in one short sentence and move to the next item; do not ask for it again.');

export const OWN_SENTENCE_RETRY_NOTE =
  '[runtime note — not from the student] Your last turn asked the student to say a sentence they had JUST said, in those words. ' +
  'A sentence they already produced is done: confirm it in one short clause and move to the next item. ' +
  'Never ask for a repeat of something that was right. Apply this silently; never mention this note.';

/** English questions of a tutor turn, normalised: lower-cased Latin words,
 *  with a trailing "too" dropped so "Have you ever eaten sushi, too?" and
 *  "Have you ever eaten sushi?" are the same question. */
export function englishQuestions(tutorText: string): string[] {
  const out: string[] = [];
  for (const raw of (tutorText ?? '').split(/(?<=[。！？.!?])\s+|\n+/)) {
    const s = raw.trim();
    if (!/[?？]\s*$/.test(s)) continue;
    const words = (s.match(/[A-Za-z][A-Za-z']*/g) ?? []).map((w) => w.toLowerCase());
    if (words.length < 3) continue;
    if (words[words.length - 1] === 'too') words.pop();
    out.push(words.join(' '));
  }
  return out;
}

/** Did the student's turn carry an answer (any English, a yes/no, or a
 *  Japanese sentence)? */
function carriesAnswer(studentText: string): boolean {
  const t = studentText ?? '';
  if ((t.match(/[A-Za-z][A-Za-z']*/g) ?? []).length >= 2) return true;
  if (/\b(?:yes|no|yeah|nope)\b/i.test(t)) return true;
  if (/^[\s、。]*(?:はい|いいえ|うん|ええ|ないです|あります)/.test(t)) return true;
  // a Japanese sentence, not a filler (えっと / えーと / あの / うーん)
  const cjk = (t.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) ?? []).join('');
  return cjk.length >= 3 && !/^(?:え+ー*っ?と+ー*|あの+ー*|うー*ん+|ん+|はい|えー+)$/.test(cjk);
}

/**
 * 2026-10-18 (GDI embed-1792346446334): "Have you ever eaten sushi?" was asked
 * three times after a correct "Yes, I have." — a three-word answer under the
 * own-sentence floor, and the return-question loop (student asks it back, the
 * tutor answers and asks the student again). The same English question in two
 * consecutive tutor turns, with an answer from the student in between, is a
 * re-ask of a finished question.
 */
export function reAskedAnsweredQuestion(prevTutorText: string, studentText: string, tutorText: string): string | null {
  if (!carriesAnswer(studentText)) return null;
  const before = new Set(englishQuestions(prevTutorText));
  if (before.size === 0) return null;
  for (const q of englishQuestions(tutorText)) if (before.has(q)) return q;
  return null;
}

export const REASKED_QUESTION_NOTE =
  '[runtime note — not from the student] Your last turn asked the same English question you had asked the turn before, ' +
  'and the student had already answered it. A question that was answered is finished — also when the student asks it back ' +
  'to you: answer it yourself in one sentence and move to the next item. Do not ask it again. Apply this silently; never mention this note.';


/**
 * 2026-10-18 (embed-1792350642171): "What did you do last weekend?" came
 * back eight turns after it was answered (39 → 47); the consecutive-turn rule
 * above could not see it. The orchestrator keeps the English questions the
 * student has ANSWERED this session; a later turn that asks one of them again
 * — when it was not the previous turn's question (that case is the rule
 * above, and a legitimate retry after a wrong answer) — plants a note.
 */
export function recordAnsweredQuestions(answered: Set<string>, prevTutorText: string, studentText: string): void {
  if (!carriesAnswer(studentText)) return;
  for (const q of englishQuestions(prevTutorText)) answered.add(q);
}

export function reAskedEarlierQuestion(answered: ReadonlySet<string>, prevTutorText: string, tutorText: string): string | null {
  if (answered.size === 0) return null;
  const prev = new Set(englishQuestions(prevTutorText));
  for (const q of englishQuestions(tutorText)) {
    if (answered.has(q) && !prev.has(q)) return q;
  }
  return null;
}

export const REASKED_EARLIER_QUESTION_NOTE =
  '[runtime note — not from the student] Your last turn asked an English question the student already answered earlier in this lesson. ' +
  'A question that was answered is finished for the whole lesson: whatever they say now, do not grade it as a new answer to that question, ' +
  'do not ask it again, and move to a different item or a new detail. Apply this silently; never mention this note.';

/**
 * The student says they already answered (same session: 「それはもう答えました
 * よ」 was ignored and the question graded as a new answer). Read it as the
 * complaint it is.
 */
const ALREADY_ANSWERED_RE =
  /さっき(?:も)?(?:言い|答え|話し)ました|(?:それ|これ)?(?:は)?もう(?:答え|言い|話し)ました|もう答えた|二回目|2回目|同じ質問|また同じ|\b(?:i (?:already|just) (?:said|answered|told you)(?: that)?|you (?:already |just )?asked (?:me )?that|same question(?: again)?|again\?)/i;

export function saysAlreadyAnswered(studentText: string): boolean {
  // Task 28 §C (GDI run 15, 373 s): the idle-nudge directive ("…hand the same
  // question back warmly…") matched "same question", so the already-answered
  // note rode the nudge turn and the tutor spoke "Acknowledge it briefly, then
  // move on to the next item." A bracketed runtime directive is not the student.
  if (/^\s*\[/.test(studentText ?? '')) return false;
  return ALREADY_ANSWERED_RE.test(studentText ?? '');
}

export const ALREADY_ANSWERED_NOTE =
  '[runtime note — not from the student] The student is telling you they already answered this question. They are right: ' +
  'acknowledge it in a few words, do not grade these words as a new answer, do not ask that question again, and move to the next item. ' +
  'Apply this silently; never mention this note.';

// ─────────────────────────────────────────────────────────────────────────
// Task 27 §F (GDI run 14, 1083–1142 s; the pacing rule agreed 2026-10-30:
// "move on" is an order): offered "shall we stop here for today, or would you
// like one more pronunciation item?", the student said "Uh, let's do
// summary." — the tutor said "Let's do it", put a key sentence up, asked for
// it once more and ran two more drills before the part advanced. A student
// turn that asks to move on must be followed by a turn that moves the lesson
// (advance_lesson, or the pointer moved); otherwise the attempt is killed
// once and the retry closes the part and advances. Not in the last part
// (nothing to advance to), nor when the student's turn also answers (3+
// Latin words besides the request).
// ─────────────────────────────────────────────────────────────────────────
// Fix round 1 (I-1, controller ruling — narrower than the brief's regex): a
// move-on request is ONLY
//  (a) a request lead (let's / can we / shall we / could we / I'd like to /
//      I want to / please) or the start of the turn + move on / go on / skip /
//      continue / wrap up, optionally + "to the next part / to the summary /
//      to the end", ending the phrase;
//  (b) a request lead or the start of the turn + go to / start / do + "the
//      next part / the summary / the end" or a later part's LABEL as a whole
//      phrase, ending the phrase;
//  (c) the whole turn is "skip", "next part", "move on" or "summary".
// "next" alone, "next one / sentence / question / item" and a bare do /
// start inside a sentence never match ("Let's do the next sentence." is the
// next drill item; "I do conversation at work." is an answer).
const MOVE_ON_LEAD = String.raw`(?:let'?s|let us|can we|could we|shall we|i(?:'d| would) like to|i want to|please)`;
const MOVE_ON_FILLER_LEAD = String.raw`^(?:(?:uh+|um+|umm|uhm|er|erm|ah|hmm+|oh|ok(?:ay)?|yes|yeah|yep|so|well|and|then|alright|right)[\s,.!]*)*`;
const MOVE_ON_END = String.raw`(?:\s+(?:now|please|then))?(?=\s*(?:[.!?,;]|$))`;
const MOVE_ON_VERB_TAIL = String.raw`(?:move on|go on|skip|continue|wrap[- ]?up)(?:\s+to\s+(?:the\s+)?(?:next part|summary|end))?`;
const MOVE_ON_FIXED_TARGET = String.raw`(?:the\s+next\s+part|(?:the\s+)?summary|the\s+end)`;
const MOVE_ON_WHOLE_TURN_RE = /^(?:skip|next part|move on|summary)$/;
const MOVE_ON_FILLERS = new Set(['uh', 'um', 'umm', 'uhm', 'er', 'erm', 'ah', 'hmm', 'oh', 'ok', 'okay', 'yes', 'yeah', 'yep', 'so', 'well', 'please', 'now', 'then', 'and', 'alright', 'right']);
const escapeMoveOnRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** "<lead> X" anywhere, or X at the start of the turn (after fillers). */
function leadOrStart(body: string): RegExp {
  return new RegExp(`(?:\\b${MOVE_ON_LEAD}\\s+|${MOVE_ON_FILLER_LEAD})(?:${body})${MOVE_ON_END}`);
}
/** The span of the student's turn that asks to move on (lower-cased), or
 *  null. `labels`: the later parts' labels in any language (metadata.label /
 *  labelLocalized) — a Latin label as a whole phrase, a Japanese one as a run
 *  with a Japanese move verb. */
export function moveOnRequestSpan(studentText: string | null | undefined, labels: readonly string[] = []): string | null {
  const t = (studentText ?? '').toLowerCase().replace(/[’]/g, "'").trim();
  if (!t) return null;
  const a = t.match(leadOrStart(MOVE_ON_VERB_TAIL));
  if (a) return a[0].trim();
  const targets = [MOVE_ON_FIXED_TARGET, ...labels
    .map((l) => (l ?? '').toLowerCase().trim())
    .filter((l) => l && !/[぀-ヿ㐀-鿿]/.test(l))
    .map((l) => String.raw`(?:the\s+)?${escapeMoveOnRe(l).replace(/\s+/g, String.raw`\s+`)}`)];
  const b = t.match(leadOrStart(String.raw`(?:go to|start|do)\s+(?:${targets.join('|')})`));
  if (b) return b[0].trim();
  const bare = t.replace(/[^\p{L}\p{N}' ]+/gu, ' ').split(/\s+/).filter((w) => w && !MOVE_ON_FILLERS.has(w)).join(' ');
  if (MOVE_ON_WHOLE_TURN_RE.test(bare)) return bare;
  for (const raw of labels) {
    const label = (raw ?? '').trim();
    if (!label || !/[぀-ヿ㐀-鿿]/.test(label)) continue;
    const m = t.match(new RegExp(`${escapeMoveOnRe(label)}(?:に進|へ進|をやり|を始め|にし)`));
    if (m) return m[0];
  }
  return null;
}
/** The student's turn says more than the request: any content word (the
 *  attempt test's filler / function-word sets) left beyond the span. */
function answersBesidesMoveOn(studentText: string, span: string): boolean {
  const rest = (studentText ?? '').toLowerCase().replace(/[’]/g, "'").replace(span, ' ');
  const words = (rest.match(/[a-z]+(?:'[a-z]+)*/g) ?? [])
    .filter((w) => !MOVE_ON_FILLERS.has(w) && !ATTEMPT_FILLERS.has(w) && !ATTEMPT_FUNCTION_WORDS.has(w));
  return words.length >= 1;
}
export function moveOnIgnored(input: {
  studentText: string | null | undefined;
  /** the attempt called advance_lesson, or the segment pointer moved this turn */
  advanced: boolean;
  /** the current part has a part after it */
  hasNextSegment: boolean;
  /** the later parts' labels, any language */
  labels?: readonly string[];
}): boolean {
  if (input.advanced || !input.hasNextSegment) return false;
  const span = moveOnRequestSpan(input.studentText, input.labels ?? []);
  if (!span) return false;
  return !answersBesidesMoveOn(input.studentText ?? '', span);
}
/** The directive the killed attempt's retry gets. */
export const MOVE_ON_IGNORED_REASON = withSilentClause(
  'The student asked to move on. Close this part in one sentence and call advance_lesson now. No practice, no repeat.');
