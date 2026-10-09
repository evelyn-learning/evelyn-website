/**
 * Deterministic grading of a typed answer against a PLAIN-NUMBER key.
 *
 * Pure (no I/O, no env, no imports). Applied before any model call by the
 * typed-answer graders (./grade-free-response.ts, ./assessment.ts).
 *
 * Why it exists: a student's answer is correct when it EQUALS the key, not
 * when it is near it. The model judge accepted `4.976` for a key of `5`
 * ("within rounding") and `10.80` for `10.81`; a relative tolerance does the
 * same. So a numeric key is never judged by closeness — the only slack is the
 * precision the key itself is written to.
 *
 * THE RULE (the academy app implements the identical rule; keep them in step):
 *
 *   Key form, read from the key's text —
 *     INTEGER   `5`, `-12`
 *     DECIMAL   with d ≥ 1 places: `10.81` → 2, `2.0` → 1
 *     FRACTION  `13/3`
 *
 *   Student answer — read WHOLE by `readSingleNumber` in the shared block
 *   below (identifier-equals prefix, sign, currency sign, thousands
 *   separators, scientific notation evaluated to its value, fractions, a
 *   trailing full stop or `%`). An answer that carries a unit or words, or
 *   is not a single number ("2 or 3", "2-3", "2,5", a mixed number "1 1/2"),
 *   is NOT decided here: the caller hands it to the model judge. It is never
 *   read by its leading number.
 *
 *   INTEGER key   correct iff the values are equal.
 *   DECIMAL key   correct iff the answer has at least d decimal places and
 *                 |answer − key| ≤ 0.5·10^(−d), or has fewer places and its
 *                 value equals the key exactly.
 *   FRACTION key  correct iff an equal fraction / the exact value, or a
 *                 decimal with at least 2 places equal to the key rounded to
 *                 the answer's own number of places.
 *   (Exact arithmetic: `numericRuleVerdict` in the shared block.)
 *
 *   One reading the rule text leaves open, decided here: a FRACTION answer to
 *   a DECIMAL key is an exact value, so it is treated as having unlimited
 *   places — `13/3` is correct for a key of `4.33`.
 */

// ── numeric-core:begin ──────────────────────────────────────────────────────
// ONE reader and ONE rule, kept BYTE-IDENTICAL in three files:
//   engine   apps/tutor/src/lib/tutor/portal/numeric-answer-rule.ts
//   academy  apps/api/src/services/numericAnswer.ts
//   academy  apps/web/components/practice/lib.ts
// Each repo's test pins the SHA-256 of this block and of the shared case table
// (numeric-answer-cases.json). Change all three copies and both pins together.
//
// READING (`readSingleNumber`): the WHOLE text must be one number. Before this
// reader (2026-10-09) the academy read the LEADING number and ignored the rest,
// so "2 × 10^3", "2 or 3", "2,5", "2-3", "2 1/2" and "2π" were all 2.
//   - sign (+, -, typographic minus), optionally around one currency sign;
//   - digits with thousands separators ("1,200", "1,00,000") — a comma
//     anywhere else is not part of a number;
//   - then at most one of: e-notation ("2e3"), a power of ten ("2 × 10^3",
//     "2 x 10^3", "2*10^3", "2·10³", "2 × 10⁻⁵", bare "10^3") or a fraction
//     ("13/3"). A mixed number ("1 1/2") is NOT read: it is two numbers
//     (null), as it always was for the key it equals — and no longer 1;
//   - then nothing, a percent sign, or a unit: words, ° % μ Ω, "/", "·",
//     brackets, a word's own exponent ("s^2", "s²", "cm3"). A digit that is
//     not such an exponent, an operator, or a word that changes the value
//     ("and", "or", "million", "pi", a leading "squared") makes the text NOT
//     a single number (null) — never the leading number.
//
// PRECISION OF SCIENTIFIC NOTATION: the answer is judged as the plain decimal
// it denotes. `places` = the significand's decimals minus the exponent, i.e.
// the position of the last digit actually written: "1.2 × 10^-5" states 6
// places (0.000012), "1 × 10^-5" states 5, "6.02e23" states -21. The rule is
// then applied unchanged, so the notation never loosens it: against a key of
// 0.000012, "1.2 × 10^-5" and "1.23 × 10^-5" are right, "1 × 10^-5" and
// "1.3 × 10^-5" are wrong. `kind` is 'decimal' when the significand has
// decimals, else 'integer'.
//
// THE RULE (`numericRuleVerdict`, 2026-10-04 — equal, never "close"):
//   same value                      → right, whatever the form;
//   INTEGER key                     → nothing else is right;
//   DECIMAL key with d places       → an answer with ≥ d places within half a
//                                     unit of the key's last place, or an
//                                     exact fraction within that half unit;
//   FRACTION key                    → a decimal answer with 2–12 places equal
//                                     to the key rounded (half away from
//                                     zero) to the answer's own places.

export interface NumberForm {
  value: number;
  kind: 'integer' | 'decimal' | 'fraction';
  /** Decimal places as written (0 for a fraction); see the note above for
   *  scientific notation. */
  places: number;
}

export interface SingleNumber extends NumberForm {
  /** What follows the number: nothing, a bare percent sign, or a unit. */
  tail: 'none' | 'percent' | 'unit';
  /** The number as typed, without sign decoration, unit or spaces. */
  text: string;
}

const NC_LETTERS = 'A-Za-z\\u00B5\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u024F\\u0370-\\u03FF\\u2126\\u212B';
const NC_SUPERS = '\\u2070\\u00B9\\u00B2\\u00B3\\u2074-\\u2079';
const NC_SUPER_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const NC_INT = '[+-]?\\d+';
const NC_TIMES = '[\\u00D7\\u2715xX*\\u00B7\\u22C5\\u2219]';
/** "^3", "^-5", "^(−5)", "^{3}", "**3", "³", "⁻⁵". Groups 1–3 = the typed
 *  exponent, 4 = a superscript one. */
const NC_POWER =
  '(?:(?:\\^|\\*\\*)\\s*(?:\\(\\s*(' + NC_INT + ')\\s*\\)|\\{\\s*(' + NC_INT + ')\\s*\\}|(' + NC_INT + '))' +
  '|([\\u207A\\u207B]?[' + NC_SUPERS + ']+))(?![.^\\d' + NC_SUPERS + '])';
const NC_HEAD_RE = /^([+-]?)\s*[$€£₹]?\s*([+-]?)\s*/;
const NC_NUMBER_RE = /^(\d{1,3}(?:,\d{3})+(?!\d)|\d{1,2}(?:,\d{2})+,\d{3}(?!\d)|\d+)?(?:\.(\d+))?/;
const NC_E_RE = /^[eE]([+-]?\d+)(?![\w.])/;
const NC_TIMES_TEN_RE = new RegExp('^\\s*' + NC_TIMES + '\\s*10\\s*' + NC_POWER);
const NC_TEN_POWER_RE = new RegExp('^\\s*' + NC_POWER);
const NC_OVER_RE = /^\s*\/\s*([+-]?)(\d+(?:\.\d+)?)(?![\d.,])/;
const NC_PRODUCT_RE = new RegExp('^' + NC_TIMES + '\\s*[+-]?[\\d.]');
/** One piece of a unit. Group 1 = a word (optionally hyphenated), which may
 *  carry an abbreviation stop or its own exponent. */
const NC_UNIT_TOKEN_RE = new RegExp(
  '^(?:([' + NC_LETTERS + ']+(?:-[' + NC_LETTERS + ']+)*)' +
    '(?:\\.(?!\\d)|\\d+|[\\u207A\\u207B]?[' + NC_SUPERS + ']+|\\^\\s*(?:\\(\\s*' + NC_INT + '\\s*\\)|' + NC_INT + '))?' +
    '|[\\u00B0\\u00BA%$\\u20AC\\u00A3\\u00A2\\u20B9\\u2032\\u2033\'"]|[/\\u00B7\\u22C5\\u2219()]|\\s+)',
);
/** Words after a number that make it a different value or a second value. */
const NC_VALUE_WORDS = ['and', 'or', 'plus', 'minus', 'hundred', 'thousand', 'million', 'billion', 'trillion', 'dozen', 'pi', 'factorial'];

function ncExponent(m: RegExpExecArray): number {
  const typed = m[1] ?? m[2] ?? m[3];
  if (typed !== undefined) return parseInt(typed, 10);
  let digits = '';
  for (const ch of (m[4] ?? '').split('')) {
    if (ch === '⁻') digits += '-';
    else if (ch !== '⁺') digits += String(NC_SUPER_DIGITS.indexOf(ch));
  }
  return parseInt(digits, 10);
}

function ncIsUnit(tail: string): boolean {
  // "2 e3" and "2 x 3" are a number times something, not a number and a unit.
  if (/^[eE][+-]?\d/.test(tail) || NC_PRODUCT_RE.test(tail)) return false;
  let rest = tail;
  let firstWord = true;
  while (rest !== '') {
    const m = NC_UNIT_TOKEN_RE.exec(rest);
    if (!m || m[0] === '') return false;
    if (m[1] !== undefined) {
      for (const w of m[1].toLowerCase().split('-')) {
        if (w.indexOf('π') >= 0 || NC_VALUE_WORDS.indexOf(w) >= 0) return false;
        if (firstWord && (w === 'squared' || w === 'cubed')) return false;
      }
      firstWord = false;
    }
    rest = rest.slice(m[0].length);
  }
  return true;
}

/** The whole text as ONE number, or null when it is not one. No "x =" prefix
 *  is stripped here (see `readAnswerNumber`). */
export function readSingleNumber(raw: string): SingleNumber | null {
  const t = (raw ?? '').replace(/[−–—]/g, '-').trim().replace(/\.\s*$/, '');
  const head = NC_HEAD_RE.exec(t);
  if (!head || (head[1] && head[2])) return null;
  const negative = (head[1] || head[2]) === '-';
  const body = t.slice(head[0].length);
  const num = NC_NUMBER_RE.exec(body);
  if (!num || (num[1] === undefined && num[2] === undefined)) return null;
  const whole = (num[1] ?? '').replace(/,/g, '');
  const dec = num[2] ?? '';
  const afterNumber = body.slice(num[0].length);
  const plain = (w: string, exp: number): number => Number((w || '0') + '.' + (dec || '0') + 'e' + exp);

  let used = num[0].length;
  let value: number;
  let kind: NumberForm['kind'] = dec ? 'decimal' : 'integer';
  let places = dec.length;
  const e = NC_E_RE.exec(afterNumber);
  const timesTen = e ? null : NC_TIMES_TEN_RE.exec(afterNumber);
  const tenPower = e || timesTen || num[0] !== '10' ? null : NC_TEN_POWER_RE.exec(afterNumber);
  const over = e || timesTen || tenPower ? null : NC_OVER_RE.exec(afterNumber);
  if (e || timesTen || tenPower) {
    const m = (e ?? timesTen ?? tenPower) as RegExpExecArray;
    const exp = e ? parseInt(e[1] ?? '', 10) : ncExponent(m);
    value = plain(tenPower ? '1' : whole, exp);
    places -= exp;
    used += m[0].length;
  } else if (over) {
    const den = Number(over[2]) * (over[1] === '-' ? -1 : 1);
    if (den === 0) return null;
    value = plain(whole, 0) / den;
    kind = 'fraction';
    places = 0;
    used += over[0].length;
  } else {
    value = plain(whole, 0);
  }
  if (!Number.isFinite(value)) return null;

  const tailText = body.slice(used).trim();
  let tail: SingleNumber['tail'];
  if (tailText === '') tail = 'none';
  else if (tailText === '%') tail = 'percent';
  else if (/^=\s*[A-Za-z]\w*$/.test(tailText) || ncIsUnit(tailText)) tail = 'unit'; // "5 = x", "5 m/s"
  else return null;

  const text = (negative ? '-' : '') + body.slice(0, used).replace(/\s+/g, '');
  return { value: negative ? -value : value, kind, places, tail, text };
}

/** A STUDENT answer: an identifier-equals prefix ("x = ", "y1=", "ans =") is
 *  dropped first. Never applied to a key ("y = 2x + 3" must not become 2). */
export function readAnswerNumber(raw: string): SingleNumber | null {
  return readSingleNumber((raw ?? '').trim().replace(/^[A-Za-z]\w*\s*=\s*/, ''));
}

/** The rule. There is no "approximately equal" fallback — do not add one. */
export function numericRuleVerdict(key: NumberForm, ans: NumberForm): boolean {
  const diff = Math.abs(ans.value - key.value);
  // "The same value": 1e-9 absolute, tightened for keys below 1 so that 0 is
  // never "equal" to a tiny key such as 1.6e-19.
  if (diff <= Math.min(1e-9, Math.abs(key.value) * 1e-9)) return true;
  if (key.kind === 'integer') return false;
  if (key.kind === 'decimal') {
    // An exact fraction is the unrounded answer: unlimited places.
    if (ans.kind !== 'fraction' && ans.places < key.places) return false;
    const half = 0.5 * 10 ** -key.places;
    // Float slack only (1e-12 for everyday numbers), never a tolerance band.
    return diff <= half + Math.max(Math.min(1e-12, half * 1e-6), Math.abs(key.value) * 1e-15);
  }
  if (ans.kind !== 'decimal' || ans.places < 2 || ans.places > 12) return false;
  const scale = 10 ** ans.places;
  return Math.sign(key.value) * Math.round(Math.abs(key.value) * scale + 1e-9) === Math.round(ans.value * scale);
}
// ── numeric-core:end ────────────────────────────────────────────────────────

export type NumericKeyForm = 'integer' | 'decimal' | 'fraction';

export interface NumericKey {
  form: NumericKeyForm;
  value: number;
  /** Decimal places the key is written to (0 for integer and fraction keys). */
  places: number;
  /** The key as compared and quoted in feedback (`$` stripped, ASCII minus). */
  text: string;
}

export interface StudentNumber {
  value: number;
  /** Decimal places as typed (0 for an integer or a fraction; the
   *  significand's places minus the exponent for scientific notation). */
  places: number;
  fraction: boolean;
  /** As written: 'decimal' when the number (or its significand) has decimals. */
  kind: NumberForm['kind'];
  /** The number as typed, minus the stripped decoration. */
  text: string;
}

export type NumericVerdict =
  | { decided: true; correct: boolean; feedback: string }
  | { decided: false };

const DECIMAL_RE = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;
const FRACTION_RE = /^(-?\d+)\s*\/\s*(-?\d+)$/;

function asciiMinus(s: string): string {
  return s.replace(/[−–—]/g, '-');
}

function readNumber(t: string): { value: number; places: number; fraction: boolean } | null {
  if (DECIMAL_RE.test(t)) {
    const dot = t.indexOf('.');
    return { value: Number(t), places: dot < 0 ? 0 : t.length - dot - 1, fraction: false };
  }
  const f = t.match(FRACTION_RE);
  if (f) {
    const den = Number(f[2]);
    if (den === 0) return null;
    return { value: Number(f[1]) / den, places: 0, fraction: true };
  }
  return null;
}

/** The stored key as a plain number, or null when it is anything else
 *  (units, a percent, an assignment, an expression, prose, several numbers). */
export function parseNumericKey(raw: string): NumericKey | null {
  const t = asciiMinus((raw ?? '').trim()).replace(/^(-?)\$\s*/, '$1');
  const n = readNumber(t);
  if (!n || !Number.isFinite(n.value)) return null;
  const form: NumericKeyForm = n.fraction ? 'fraction' : n.places > 0 ? 'decimal' : 'integer';
  return { form, value: n.value, places: n.places, text: t.replace(/\s+/g, '') };
}

/** The student's answer as a single number, or null when it is not one —
 *  or when it carries a unit or words (the judge sees the question; this
 *  rule does not know which unit it asks for). */
export function parseStudentNumber(raw: string): StudentNumber | null {
  const n = readAnswerNumber(raw);
  if (!n || n.tail === 'unit') return null;
  return { value: n.value, places: n.places, fraction: n.kind === 'fraction', kind: n.kind, text: n.text };
}

const PLACE_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
function placesPhrase(d: number): string {
  return `${PLACE_WORDS[d] ?? String(d)} decimal place${d === 1 ? '' : 's'}`;
}

function isCorrect(key: NumericKey, ans: StudentNumber): boolean {
  return numericRuleVerdict(
    { value: key.value, kind: key.form, places: key.places },
    { value: ans.value, kind: ans.kind, places: ans.places },
  );
}

/**
 * Grade `answerText` against `keyText` by the rule above. `decided: false`
 * when the key is not a plain number or the answer is not a single number.
 * The feedback names the expected answer — the graders that use this already
 * return the key to the caller alongside the verdict.
 */
export function gradeNumericAnswer(keyText: string, answerText: string): NumericVerdict {
  const key = parseNumericKey(keyText);
  if (!key) return { decided: false };
  const ans = parseStudentNumber(answerText);
  if (!ans) return { decided: false };
  if (isCorrect(key, ans)) return { decided: true, correct: true, feedback: 'Correct.' };
  const feedback =
    key.form === 'decimal'
      ? `The expected answer to ${placesPhrase(key.places)} is ${key.text}, not ${ans.text}.`
      : `The expected answer is ${key.text}; ${ans.text} is not equal to it.`;
  return { decided: true, correct: false, feedback };
}
