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
 *   Student answer — after stripping an identifier-equals prefix (`x = `), a
 *   leading `$`, a trailing full stop, a trailing `%` and typographic minus —
 *   must be a single number (integer, decimal or fraction). Anything else
 *   (words, units, several numbers) is NOT decided here: the caller hands it
 *   to the model judge.
 *
 *   INTEGER key   correct iff the values are equal (|diff| < 1e-9).
 *   DECIMAL key   correct iff the answer has at least d decimal places and
 *                 |answer − key| ≤ 0.5·10^(−d) + 1e-12, or has fewer places
 *                 and its value equals the key exactly.
 *   FRACTION key  correct iff an equal fraction / the exact value, or a
 *                 decimal with at least 2 places equal to the key rounded to
 *                 the answer's own number of places.
 *
 *   One reading the rule text leaves open, decided here: a FRACTION answer to
 *   a DECIMAL key is an exact value, so it is treated as having unlimited
 *   places — `13/3` is correct for a key of `4.33`.
 */

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
  /** Decimal places as typed (0 for an integer or a fraction). */
  places: number;
  fraction: boolean;
  /** The number as typed, minus the stripped decoration. */
  text: string;
}

export type NumericVerdict =
  | { decided: true; correct: boolean; feedback: string }
  | { decided: false };

const EXACT_EPS = 1e-9;
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

/** The student's answer as a single number, or null when it is not one. */
export function parseStudentNumber(raw: string): StudentNumber | null {
  let t = asciiMinus((raw ?? '').trim());
  t = t.replace(/\.$/, '').trim(); // trailing full stop
  t = t.replace(/^[A-Za-z]\w*\s*=\s*/, ''); // "x = "
  t = t.replace(/^(-?)\$\s*/, '$1'); // leading $
  t = t.replace(/\s*%$/, ''); // trailing %
  const n = readNumber(t);
  if (!n || !Number.isFinite(n.value)) return null;
  return { ...n, text: t.replace(/\s+/g, '') };
}

/** Round half away from zero to `places` decimal places. */
function roundTo(value: number, places: number): number {
  const f = 10 ** places;
  return (Math.sign(value) * Math.round(Math.abs(value) * f + 1e-9)) / f;
}

const PLACE_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
function placesPhrase(d: number): string {
  return `${PLACE_WORDS[d] ?? String(d)} decimal place${d === 1 ? '' : 's'}`;
}

function isCorrect(key: NumericKey, ans: StudentNumber): boolean {
  const diff = Math.abs(ans.value - key.value);
  const exact = diff < EXACT_EPS;
  if (key.form === 'integer') return exact;
  if (key.form === 'decimal') {
    if (exact) return true;
    // A fraction is an exact value: unlimited places.
    if (ans.fraction || ans.places >= key.places) return diff <= 0.5 * 10 ** -key.places + 1e-12;
    return false;
  }
  // fraction key
  if (exact) return true;
  if (ans.fraction || ans.places < 2) return false;
  return Math.abs(ans.value - roundTo(key.value, Math.min(ans.places, 10))) < EXACT_EPS;
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
