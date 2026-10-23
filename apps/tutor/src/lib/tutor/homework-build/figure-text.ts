/**
 * Text provenance for homework figures: does a label, title or other free-text
 * field of a figure come from the problem text? Shared by every figure kind's
 * validator. Moved unchanged from figure-validate.ts. Pure.
 */

export function normalise(s: string): string {
  return s.replace(/[−‒–]/g, '-').replace(/\s+/g, ' ').trim().replace(/\.$/, '');
}

/** Clause boundaries: a value must be in the same clause as its NAME. */
const BOUNDARY = new Set([',', ';', ')', ']']);
/** Words allowed between NAME and VALUE in a label (plus the = : operators). */
const LABEL_LINKS = new Set(['is', 'measures', 'of']);

/**
 * Words of the text, the = : operators, and clause boundaries (, ; ) ] and a
 * sentence-ending period). A leading minus is kept when part of a number.
 */
export function tokenize(s: string): string[] {
  const raw = normalise(s).match(/[A-Za-z0-9\u00b0\u03c0'\u2032.\-/]+|[=:,;()\[\]]/g) ?? [];
  const out: string[] = [];
  for (const r of raw) {
    if (r === '(') continue;
    if (BOUNDARY.has(r) || isOp(r)) { out.push(r); continue; }
    const t = r.replace(/^[.\/]+(?=[A-Za-z0-9])/, '').replace(/^-(?![0-9\u03c0.])/, '').replace(/[.\-/]+$/, '');
    if (t) out.push(t);
    if (r.length > 1 && r.endsWith('.')) out.push(';');
  }
  return out;
}

export const isOp = (t: string) => t === '=' || t === ':';

const IDENT_RE = /^[A-Za-z][A-Za-z'\u2032]{0,2}$/;
const VALUE_RE = /^-?\d+(?:\.\d+)?(?:\/\d+)?(?:\u00b0|\u03c0)?[A-Za-z%\u00b0]*$|^-?\d*\u03c0(?:\/\d+)?$|^[A-Za-z]$/;
/** One whole word of a label: identifier / number / unit / pi fraction, optional leading minus. */
const LABEL_WORD_RE = /^-?[A-Za-z0-9\u00b0\u03c0'\u2032./]+$/;

/**
 * Does this label come from the problem text? Passes when it is
 * (a) a bare point name, (b) a bare value or single variable, or
 * (c) `NAME op VALUE` (op = : is measures of, or none) with VALUE in the same
 * clause, within 4 words after an occurrence of NAME. Anything else (sums,
 * products, computed values) fails.
 */
/**
 * 2026-10-21 (hw-10 problem 5): the proposer captioned a polygon "Rectangle
 * with semicircle cut out" and the whole figure was rejected for it. A label
 * of three or more words with no digit is a caption, not a value: it can
 * never leak an answer, so it is dropped from the figure instead of failing
 * it. Two words ("DE = 9" is three tokens but carries a digit) stay labels.
 */
export function isCaptionLabel(label: string): boolean {
  const l = String(label ?? '').trim();
  if (/[\d=+−×÷*/^<>≤≥≠∠∥⊥°√π%]/.test(l)) return false;   // a relation or a value is a label (a hyphen inside "quarter-circle" is not)
  return l.split(/\s+/).filter((w) => /^[A-Za-z]{2,}$/.test(w)).length >= 3;
}

export function labelIsFromText(label: string, problemText: string): boolean {
  const l = normalise(label).replace(/([=:])/g, ' $1 ').replace(/\s+/g, ' ').trim();
  if (!l) return true;
  const pieces = l.split(' ');
  // GAC acceptance 2026-10-21 (worksheet3_photo): the sheet labels its angles
  // "(5x + 10)°" and "(8x − 56)°", written exactly so in the problem text, and
  // the token rule below (name/value, NAME = VALUE) has no shape for an
  // expression — six of eight figures were dropped for it. A label of two or
  // more pieces that appears verbatim in the text (case and spacing aside) is
  // from the text by definition. A single token keeps the word rule: "8" must
  // be a word of the text, not a digit inside one.
  if (pieces.length >= 2 && phraseInText(l, problemText)) return true;
  if (!pieces.every((w) => isOp(w) || LABEL_WORD_RE.test(w))) return false;
  const toks = tokenize(problemText);
  const words = new Set(toks.filter((t) => !isOp(t) && !BOUNDARY.has(t) && t !== ';'));
  if (pieces.length === 1) {
    const w = pieces[0];
    if ((IDENT_RE.test(w) || VALUE_RE.test(w)) && words.has(w)) return true;
    // GAC acceptance 2026-10-22 (hw-14 p7): the sheet writes x°, a degree-signed
    // variable that IDENT_RE (letters only) rejects as a token. Test it without
    // the sign, against the text as written (x° or x).
    // GAC acceptance 2026-10-22 (hw-14 p2, round 8): the sheet names points only
    // inside △ABC / AB / Sector OBA, never as standalone words. A point-id label
    // is from the text when its letter sits in a compound name (2-4 capitals).
    // namedPointsIn is deliberately NOT widened: a compound token may be an
    // acronym, so permitting a label is safe, demanding a drawn point is not.
    if (/^[A-Z]\d?['\u2032]?$/.test(w)) {
      const letter = w[0];
      if (toks.some((t) => {
        // △ABC, ∠AEB and m∠AEB (final review, finding 2). tokenize already splits
        // at these signs (they are not token characters), so this is the guard
        // for a token that keeps one, not the path the sheets take today.
        const c = t.replace(/^(?:m?[\u25b3\u25b2\u2220])+/, '').replace(/['\u2032]+$/, '');
        return /^[A-Z]{2,4}\d?$/.test(c) && c.includes(letter);
      })) return true;
    }
    if (/[\u00b0\u00ba]$/.test(w)) {
      const bare = w.slice(0, -1);
      return (IDENT_RE.test(bare) || VALUE_RE.test(bare)) && (words.has(w) || words.has(bare));
    }
    return false;
  }
  const parts = pieces.filter((w) => !isOp(w) && !LABEL_LINKS.has(w));
  const ops = pieces.filter((w) => isOp(w) || LABEL_LINKS.has(w));
  if (parts.length !== 2 || ops.length > 1 || pieces.length > 3) return false;
  const [name, value] = parts;
  if (pieces[0] !== name || pieces[pieces.length - 1] !== value) return false;
  for (let i = 0; i < toks.length; i++) {
    if (toks[i] !== name) continue;
    const after: string[] = [];
    for (let j = i + 1; j < toks.length && after.length < 4; j++) {
      if (BOUNDARY.has(toks[j]) || toks[j] === ';') break;
      if (!isOp(toks[j])) after.push(toks[j]);
    }
    if (after.includes(value)) return true;
  }
  return false;
}

/**
 * A free-text figure field (a title, an axis label, an annotation): passes
 * when it is a label `labelIsFromText` accepts, or a whole phrase of the
 * problem text (case and spacing aside). A value the text does not state —
 * an answer — fails either way.
 */
export function textFieldIsFromText(field: string, problemText: string): boolean {
  if (labelIsFromText(field, problemText)) return true;
  return phraseInText(normalise(field), problemText);
}

/** `phrase` occurs in the text as a whole phrase: not inside a longer word or number, case and spacing aside. */
export function phraseInText(phrase: string, problemText: string): boolean {
  const f = phrase.toLowerCase();
  if (!f) return true;
  const esc = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
  return new RegExp(`(?<![A-Za-z0-9])${esc}(?![A-Za-z0-9])`).test(normalise(problemText).toLowerCase());
}

/** I4: every free-text field of a figure comes from the sheet; one-letter axis names always pass. */
export function textFieldReasons(fields: Array<{ value: unknown; axis?: boolean }>, problemText: string): string[] {
  const out: string[] = [];
  for (const { value, axis } of fields) {
    if (typeof value !== 'string' || !value.trim()) continue;
    if (axis && /^\s*[A-Za-z]\s*$/.test(value)) continue;
    if (!textFieldIsFromText(value, problemText)) out.push(`label "${value}" does not come from the problem text`);
  }
  return out;
}
