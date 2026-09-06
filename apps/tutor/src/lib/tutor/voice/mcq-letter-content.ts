/**
 * MCQ letter ↔ content reconciliation (live 2026-09-05, portal-51b667f1).
 *
 * The student said "this is definitely a stratified sampling, so option B";
 * STT heard "B" for "D". The tutor graded the LETTER and marked a correct
 * answer wrong. When an utterance names BOTH a letter and the content of a
 * choice, and the content uniquely identifies a DIFFERENT choice, the
 * content wins — a student who names the concept has answered the concept;
 * the letter is the fragile channel (B/D, C/see, A/eh).
 *
 * Pure and subject-free: content matching is token overlap against the
 * choice texts the problem actually offered. Nothing is rewritten unless
 * exactly one choice matches and its letter differs from the spoken one.
 */
export interface ChoiceOption { letter: string; text: string }

const STOP = new Set(['a', 'an', 'the', 'of', 'and', 'or', 'to', 'in', 'on', 'for', 'is', 'are', 'it', 'this', 'that', 'with', 'by', 'as', 'at', 'be', 'from']);

export function extractChoiceOptions(
  choices: Array<{ letter?: unknown; id?: unknown; text?: unknown; label?: unknown; content?: unknown } | string> | null | undefined,
): ChoiceOption[] {
  if (!Array.isArray(choices) || choices.length === 0) return [];
  return choices.map((c, i) => {
    if (typeof c === 'string') return { letter: String.fromCharCode(65 + i), text: c };
    const raw = (typeof c?.letter === 'string' && c.letter) || (typeof c?.id === 'string' && c.id) || '';
    const letter = /^[A-Za-z]$/.test(raw.trim()) ? raw.trim().toUpperCase() : String.fromCharCode(65 + i);
    const text = (typeof c?.text === 'string' && c.text) || (typeof c?.label === 'string' && c.label) || (typeof c?.content === 'string' && c.content) || '';
    return { letter, text };
  });
}

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/\$[^$]*\$/g, ' ').replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w && !STOP.has(w));
}
function stem(w: string): string { return w.length > 4 ? w.replace(/(ing|ed|es|s|e)$/, '') : w; }

/** The spoken letter, when the utterance clearly names one as its answer. */
export function spokenChoiceLetter(utterance: string, letters: string[]): { letter: string; index: number; length: number } | null {
  const set = new Set(letters.map((l) => l.toUpperCase()));
  const re = /\b(?:option|choice|answer(?:\s+is)?|letter|it'?s|its|so|pick|go with|i'?d say|i think)\s+\(?([A-Ea-e])\)?(?=[\s.,!?)]|$)|(?:^|[\s(])([A-Ea-e])[).]?\s*$/g;
  let m: RegExpExecArray | null;
  let last: { letter: string; index: number; length: number } | null = null;
  while ((m = re.exec(utterance))) {
    const raw = (m[1] ?? m[2] ?? '').toUpperCase();
    if (!set.has(raw)) continue;
    const idx = m.index + m[0].lastIndexOf(m[1] ?? m[2] ?? '');
    last = { letter: raw, index: idx, length: 1 };
  }
  return last;
}

/** Which option's content the utterance names — exactly one, or null. */
export function namedChoiceByContent(utterance: string, options: ChoiceOption[]): ChoiceOption | null {
  const ut = new Set(tokens(utterance).map(stem));
  if (ut.size === 0) return null;
  const scored = options.map((o) => {
    const ct = Array.from(new Set(tokens(o.text).map(stem)));
    const hits = ct.filter((w) => ut.has(w)).length;
    // A match needs at least two content tokens, or the whole text when it
    // is a single significant word ("Stratified" alone).
    const strong = ct.length > 0 && (hits >= 2 || (ct.length === 1 && hits === 1));
    return { o, hits, strong, frac: ct.length ? hits / ct.length : 0 };
  }).filter((s) => s.strong);
  if (scored.length !== 1) return null;
  return scored[0].o;
}

export interface Reconciliation { from: string; to: string; rewritten: string; content: string }

/**
 * Returns a rewritten utterance when the spoken letter contradicts the named
 * content; null when there is nothing to reconcile.
 */
export function reconcileMcqLetterWithContent(utterance: string, options: ChoiceOption[]): Reconciliation | null {
  if (!utterance || options.length < 2) return null;
  const spoken = spokenChoiceLetter(utterance, options.map((o) => o.letter));
  if (!spoken) return null;
  const named = namedChoiceByContent(utterance, options);
  if (!named || named.letter === spoken.letter) return null;
  const rewritten = utterance.slice(0, spoken.index) + named.letter + utterance.slice(spoken.index + spoken.length);
  return { from: spoken.letter, to: named.letter, rewritten, content: named.text };
}
