/**
 * Wrong answer to the WHOLE problem — the result never leaves the server
 * (2026-10-08c).
 *
 * The no-reveal rule (verdict-precheck-shared.ts, work-then-match.ts) is a
 * prompt rule, and live it held in one run of three: twice the reply narrated
 * the working and landed on the final value. Wording cannot be the guard.
 *
 * The server holds the pre-check's correct value (it is never sent to the
 * browser). While the rule is active for a turn — flag on, a HIGH-confidence
 * "overall_problem / incorrect" check — every sentence and every board tool
 * call is read HERE before it is forwarded:
 *   - one that states the value is not forwarded at all; the server sends an
 *     `answer-reveal` frame (no value in it), then a fixed tail that reveals
 *     nothing, and forwards nothing more of that model reply;
 *   - the browser, on the frame, discards the attempt and retries ONCE with
 *     `wholeAnswerRevealFeedback` (the standard kill-and-retry path); when
 *     that retry is spent it keeps what the server let through — the fixed
 *     tail included.
 * So a value-bearing sentence or board item is never shown or spoken on
 * either attempt; the retry only decides how good the reply around it is.
 *
 * Matching is by VALUE for numbers (rounding, units, LaTeX, fractions,
 * percent, powers of ten), never on a number the student wrote or one given
 * in the problem. For a value with no number in it: a whole-word / whole-
 * expression match, or a named choice letter. NOT covered: a formula that
 * evaluates to the result but does not state it; a result that is itself one
 * of the problem's given numbers; a paraphrase of a result in words.
 *
 * Pure, browser-safe (no SDK, no crypto). Wording is generic.
 * `npx tsx scripts/test-whole-answer-reveal.ts`.
 */
import { TUTOR_WRONG_WHOLE_ANSWER_NO_REVEAL } from '@/lib/tutor/orchestrator/turn-round-flags';
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';
import { canonicalizeMathExpression } from '@/lib/tutor/voice/utterance-answer-match';
import { precheckDecides, wrongWholeAnswerChecked, WRONG_WHOLE_ANSWER_REEMIT, type PublicVerdictPrecheck } from '@/lib/tutor/voice/verdict-precheck-shared';

/** What the server knows for a turn under the rule. */
export interface WithheldAnswer {
  /** The pre-check's correct value, as the check wrote it. */
  value: string;
  /** The student's message (their own wrong value is never a hit). */
  studentText: string;
  /** The problem's wording and anything else the student supplied — numbers
   *  in it are given data, never a hit. */
  givenText: string;
}

/** Is the guard on for this turn? HIGH confidence only, and only with a value. */
export function wholeAnswerRevealGuardActive(
  p: PublicVerdictPrecheck | null | undefined,
  value: string | null | undefined,
  opts?: { enabled?: boolean },
): boolean {
  if (!(opts?.enabled ?? TUTOR_WRONG_WHOLE_ANSWER_NO_REVEAL)) return false;
  if (!String(value ?? '').trim()) return false;
  return precheckDecides(p) && wrongWholeAnswerChecked(p, { enabled: true });
}

// ── numbers ────────────────────────────────────────────────────────────────

interface Num {
  value: number;
  /** Digits after the decimal point as written (a fraction: 6). */
  decimals: number;
  /** Follows "=", "≈", a relation, or "is / equals / gives / to …". */
  resultPosition: boolean;
  /** Directly followed by a letter or bracket ("2x", "3(…)") — a coefficient. */
  coefficient: boolean;
}

function cleanMath(text: string): string {
  return String(text ?? '')
    .replace(/−|–(?=\s*\d)/g, '-')
    .replace(/\\(?:text|mathrm|textbf|mathbf|operatorname)\s*\{([^{}]*)\}/g, ' $1 ')
    .replace(/\\[,;:!]|\\quad\b|\\qquad\b|~/g, ' ')
    .replace(/\\left|\\right/g, '')
    .replace(/\\approx|\\simeq|\\sim(?![a-z])/g, '≈')
    .replace(/\\leq?(?![a-z])/g, '≤').replace(/\\geq?(?![a-z])/g, '≥')
    .replace(/\\%/g, '%')
    .replace(/\\[dt]?frac\s*\{\s*(-?\d+(?:\.\d+)?)\s*\}\s*\{\s*(\d+(?:\.\d+)?)\s*\}/g, ' $1/$2 ')
    .replace(/(\d)\{,\}(\d)/g, '$1$2')
    .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')
    // a × 10^b → the plain number
    .replace(/(\d+(?:\.\d+)?)\s*(?:\\times|\\cdot|×|·|x|\*)\s*10\s*\^\s*\{?\s*(-?\d+)\s*\}?/g, (_m, a: string, b: string) => {
      const e = parseInt(b, 10);
      const dec = Math.max(0, (a.split('.')[1]?.length ?? 0) - e);
      const v = parseFloat(a) * Math.pow(10, e);
      return Number.isFinite(v) && Math.abs(e) <= 12 ? ` ${v.toFixed(Math.min(dec, 12))} ` : _m;
    });
}

const RESULT_LEAD_RE = /(?:[=≈<>≤≥]|\b(?:is|equals?|gives?|get|gets|got|(?:comes?|came|equal|simplifies|reduces|works\s+out|adds\s+up)\s+(?:out\s+)?to|answer|result|value)(?:\s+(?:about|approximately|roughly|around|exactly|just))?)\s*[$(\s]*$/i;
const NUM_RE = /(?<![\w.^])(?<!\^\{)(\d+(?:\.\d+)?|\.\d+)(?:\s*\/\s*(\d+(?:\.\d+)?))?(\s*%)?/g;

/** Every number written in a text, each with the readings it can have
 *  ("25%" is 25 and 0.25; "3/4" is 0.75). */
function numbersIn(text: string): Num[] {
  const t = cleanMath(text);
  const out: Num[] = [];
  NUM_RE.lastIndex = 0;
  for (let m = NUM_RE.exec(t); m; m = NUM_RE.exec(t)) {
    const before = t.slice(0, m.index);
    const lead = /(-)\s*$/.exec(before);
    // A minus is a sign unless something it could be subtracted from precedes it.
    const negative = !!lead && !/[\w)\]}.%]\s*-\s*$/.test(before);
    const sign = negative ? -1 : 1;
    const resultPosition = RESULT_LEAD_RE.test(negative ? before.replace(/-\s*$/, '') : before);
    const after = t.slice(m.index + m[0].length);
    const coefficient = /^[a-zA-Z\\(]/.test(after) && !m[3];
    const a = parseFloat(m[1]);
    const aDec = m[1].split('.')[1]?.length ?? 0;
    if (!Number.isFinite(a)) continue;
    if (m[2]) {
      const b = parseFloat(m[2]);
      if (b !== 0) out.push({ value: sign * a / b, decimals: 6, resultPosition, coefficient });
      else out.push({ value: sign * a, decimals: aDec, resultPosition, coefficient });
      continue;
    }
    out.push({ value: sign * a, decimals: aDec, resultPosition, coefficient });
    if (m[3]) out.push({ value: sign * a / 100, decimals: aDec + 2, resultPosition, coefficient });
  }
  return out;
}

function sigDigits(n: Num): number {
  const s = Math.abs(n.value).toFixed(Math.min(n.decimals, 12)).replace('.', '').replace(/^0+/, '');
  return s.length;
}

const sameNumber = (a: number, b: number): boolean => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** Is `r` the value `t`, allowing for one of them being the other rounded?
 *  The coarser of the two must still be a distinctive number (two significant
 *  digits, or written with a decimal point) — a bare "2" is not "2.4". */
function agrees(r: Num, t: Num): boolean {
  if (sameNumber(r.value, t.value)) return true;
  if (r.decimals === t.decimals) return false;
  const coarse = r.decimals < t.decimals ? r : t;
  if (coarse.value === 0) return false;
  if (sigDigits(coarse) < 2 && coarse.decimals === 0) return false;
  return Math.abs(r.value - t.value) <= 0.5 * Math.pow(10, -coarse.decimals) + 1e-12;
}

/** The part of the check's value that IS the result: for each alternative,
 *  what follows its last "=" / "≈"; a bracketed aside is dropped when
 *  something stands outside it. */
function resultParts(value: string): string[] {
  const v = cleanMath(value);
  const outside = v.replace(/\([^()]*\)/g, ' ');
  const base = /\d/.test(outside) || (!/\d/.test(v) && /[a-zA-Z]/.test(outside)) ? outside : v;
  // "or" / "and" separate alternatives of a mathematical value only; in a
  // value made of words they are part of the phrase.
  const splitter = /[\d=≈]/.test(base) ? /\s*(?:;|\bor\b|\band\b|,(?!\d))\s*/i : /\s*[;,]\s*/;
  return base.split(splitter)
    .map((part) => part.slice(Math.max(part.lastIndexOf('='), part.lastIndexOf('≈')) + 1).trim())
    .filter(Boolean);
}

function targetNumbers(a: WithheldAnswer): Num[] {
  const known = [...numbersIn(a.studentText), ...numbersIn(a.givenText)];
  const out: Num[] = [];
  for (const part of resultParts(a.value)) {
    for (const n of numbersIn(part)) {
      if (n.coefficient && isWeak(n)) continue;
      if (known.some((k) => sameNumber(k.value, n.value))) continue;
      out.push(n);
    }
  }
  return out;
}

/** A single-digit whole number: common enough in prose that it is a hit only
 *  where a result stands (after "=", "is", …), never as a coefficient. */
const isWeak = (n: Num): boolean => n.decimals === 0 && Math.abs(n.value) < 10;

function numericHit(text: string, a: WithheldAnswer, targets: Num[], board: boolean): string | null {
  if (!targets.length) return null;
  const known = [...numbersIn(a.studentText), ...numbersIn(a.givenText)];
  // Speech: "eighty-four point nine" → "84 point 9" → "84.9".
  const said = numbersIn(board ? text : spokenNumbersToDigits(text).replace(/(\d)\s+point\s+(\d(?:\s\d)*)(?!\d)/gi, (_m, i: string, f: string) => `${i}.${f.replace(/\s/g, '')}`));
  const lone = said.length === 1;
  for (const r of said) {
    // A number the student wrote, or one given in the problem, is never a hit.
    if (known.some((k) => sameNumber(k.value, r.value))) continue;
    for (const t of targets) {
      if (!agrees(r, t)) continue;
      if (r.coefficient && isWeak(t)) continue;
      if (isWeak(t) && !(r.resultPosition || (board && lone))) continue;
      return String(r.value);
    }
  }
  return null;
}

// ── values with no number in them ──────────────────────────────────────────

function compact(text: string): string {
  return cleanMath(text).toLowerCase().replace(/\$|\\\(|\\\)|\\\[|\\\]/g, '').replace(/\\cdot|\\times|×|·/g, '*')
    .replace(/\\([a-z]+)/g, '$1').replace(/[{}()\s]/g, '').replace(/^[.,;:!?]+|[.,;:!?]+$/g, '');
}

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function textHit(text: string, a: WithheldAnswer): string | null {
  for (const part of resultParts(a.value)) {
    const p = part.replace(/^[\s"'“”.,:;]+|[\s"'“”.,:;]+$/g, '');
    if (!p || /\d/.test(p)) continue;
    // A choice letter: only where it is named as the choice.
    const letter = /^\(?([A-Ea-e])\)?$/.exec(p);
    if (letter) {
      const L = letter[1].toUpperCase();
      const re = new RegExp(`\\((?:${L})\\)|\\b(?:option|choice|answer|letter)(?:\\s+is)?\\s*:?\\s*\\(?${L}\\)?(?![\\w'’])|\\b${L}\\s+is\\s+(?:the\\s+)?(?:right|correct|answer)`, '');
      if (re.test(text.replace(/[*_~`]/g, ''))) return L;
      continue;
    }
    // Words: a whole-word match of the phrase, unless the student or the
    // problem already says it.
    if (/^[\p{L}][\p{L}\s'’-]*$/u.test(p)) {
      if (p.length < 4) continue;
      const re = new RegExp(`(?<![\\p{L}])${escapeRe(p.toLowerCase()).replace(/\s+/g, '\\s+')}(?![\\p{L}])`, 'u');
      if (re.test(a.studentText.toLowerCase()) || re.test(a.givenText.toLowerCase())) continue;
      if (re.test(text.toLowerCase())) return p;
      continue;
    }
    // An expression: the same string once spacing and markup are gone, or
    // the same canonical form as one side of something written in the reply.
    const c = compact(p);
    if (c.length < 3) continue;
    if (compact(a.studentText).includes(c) || compact(a.givenText).includes(c)) continue;
    if (compact(text).includes(c)) return p;
    const canon = canonicalizeMathExpression(p);
    if (canon && canon.length >= 3) {
      for (const side of cleanMath(text).split(/[=≈$,;]|\s{2,}/)) {
        if (side.trim() && canonicalizeMathExpression(side) === canon) return p;
      }
    }
  }
  return null;
}

// ── the decision ───────────────────────────────────────────────────────────

export interface RevealRead {
  hit: boolean;
  how: 'number' | 'text' | null;
  /** What in the text matched (server log only — never sent to the browser). */
  matched?: string;
}

const NO_HIT: RevealRead = { hit: false, how: null };

function read(text: string, a: WithheldAnswer | null | undefined, board: boolean): RevealRead {
  if (!a || !String(text ?? '').trim() || !String(a.value ?? '').trim()) return NO_HIT;
  try {
    const targets = targetNumbers(a);
    const n = numericHit(text, a, targets, board);
    if (n !== null) return { hit: true, how: 'number', matched: n };
    const t = textHit(text, a);
    if (t !== null) return { hit: true, how: 'text', matched: t };
  } catch { /* never throws: an unreadable text is not a hit */ }
  return NO_HIT;
}

/** Does this sentence of the reply state the withheld result? */
export function revealsWithheldAnswer(sentence: string, a: WithheldAnswer | null | undefined): RevealRead {
  return read(sentence, a, false);
}

const SKIP_KEYS = /^(?:id|ids|color|colour|stroke|fill|url|src|href|type|kind|action|position|anchor|align|size|style|font|target|targetId|segmentId|pageId)$/i;

/** Every piece of text a board tool call would paint (equation LaTeX,
 *  handwriting, problem / solution fields, labels, table cells…). */
export function boardStrings(args: unknown, depth = 0): string[] {
  if (depth > 6 || args == null) return [];
  if (typeof args === 'string') return /^#[0-9a-f]{3,8}$/i.test(args.trim()) || /^https?:\/\//i.test(args.trim()) ? [] : [args];
  if (Array.isArray(args)) return args.flatMap((v) => boardStrings(v, depth + 1));
  if (typeof args === 'object') {
    return Object.entries(args as Record<string, unknown>)
      .filter(([k]) => !SKIP_KEYS.test(k))
      .flatMap(([, v]) => boardStrings(v, depth + 1));
  }
  return [];
}

/** Would this board tool call write the withheld result? */
export function boardRevealsWithheldAnswer(args: unknown, a: WithheldAnswer | null | undefined): RevealRead {
  for (const s of boardStrings(args)) {
    const r = read(s, a, true);
    if (r.hit) return r;
  }
  return NO_HIT;
}

// ── what happens on a hit ──────────────────────────────────────────────────

export const WHOLE_ANSWER_REVEAL_ACTION = 'whole_answer_reveal';

/** The tool_result the model gets for a board call the server did not forward. */
export const WHOLE_ANSWER_BOARD_WITHHELD_REASON =
  'not shown — it writes the result of the problem, which the student has yet to find';

/** Retry feedback via the standard rejection channel. Carries no value. */
export function wholeAnswerRevealFeedback(studentText: string): string {
  return `The student wrote "${(studentText ?? '').trim().slice(0, 120)}". `
    + 'Your reply stated or wrote the result of the problem, which is theirs to find; that part was not shown to them. '
    + 'Re-emit your response. ' + WRONG_WHOLE_ANSWER_REEMIT
    + 'Do not mention this note or narrate the correction — just reply naturally.';
}

/** The fixed tail: it reveals nothing and is the same for every subject. */
export const WHOLE_ANSWER_FALLBACK_STATEMENT = 'That answer is not what the problem gives.';
export const WHOLE_ANSWER_FALLBACK_QUESTION = 'Which part of your reasoning would you check again first?';

const STATES_NON_MATCH_RE = /\b(?:is\s+not|isn['’]?t|does\s+not|doesn['’]?t|not)\s+(?:what|match|give)\b/i;

/**
 * What the server appends after it stops forwarding a reply: the non-match
 * statement unless a forwarded sentence already made one, and the question
 * unless a forwarded sentence already asked one.
 */
export function wholeAnswerFallbackTail(forwarded: ReadonlyArray<string>): string[] {
  const tail: string[] = [];
  if (!forwarded.some((s) => !/\?\s*$/.test(s.trim()) && STATES_NON_MATCH_RE.test(s))) tail.push(WHOLE_ANSWER_FALLBACK_STATEMENT);
  if (!forwarded.some((s) => /\?\s*["'”)*_]*\s*$/.test(s.trim()))) tail.push(WHOLE_ANSWER_FALLBACK_QUESTION);
  return tail;
}
