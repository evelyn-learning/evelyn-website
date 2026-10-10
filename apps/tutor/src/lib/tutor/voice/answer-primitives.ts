/**
 * Pure answer-comparison primitives, extracted from problem-generator.ts
 * (2026-08-10 hotfix). problem-generator imports the ProblemBank mongoose
 * model + connectDB, so it is SERVER-ONLY — but the R43 verdict-detector
 * round made utterance-answer-match.ts (consumed by the CLIENT components
 * VoiceTutorRealtime and perception-classifier) import these two functions
 * from it, which dragged mongoose into the browser bundle and crashed
 * /tutor and /tutor-portal/embed at runtime ("Cannot read properties of
 * undefined (reading 'ProblemBank')").
 *
 * These functions are moved here VERBATIM — no behavior change — and
 * problem-generator.ts re-exports them, so its existing server-side
 * consumers (answersAgree, mcqAnswersAgree, practice-gen) are unchanged.
 * This module must stay free of server-only imports.
 */

/** Extract a comparable number from an answer string. Handles fractions
 *  ("3/4" → 0.75), currency ("$4.50" → 4.5), comma thousands ("300,000" →
 *  300000), and a number embedded in prose / units ("15 square feet" → 15,
 *  "Area = 20" → 20). Returns null when there's no digit. Used by
 *  answersAgree to verify a brain-generated problem's answer. */
export function extractAnswerNumber(s: string): number | null {
  let t = (s ?? '').trim();
  if (!t) return null;
  // Round-24 notation normalization — realistic solver-vs-brain form pairs
  // that must extract the same value: \frac{1}{2} vs 1/2, π/4 vs 0.785,
  // 50% vs 0.5, √2/2 vs 0.707, unicode minus, leading-dot decimals. Order
  // matters: structural forms to plain slashes first, then symbolic
  // constants to numerics, then percent.
  t = t
    .replace(/−/g, '-')
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√$1')
    .replace(/(^|[^\d.])\.(\d)/g, '$10.$2');
  t = t.replace(/(\d*\.?\d*)\s*(?:π|\\pi(?![a-zA-Z])|\bpi\b)/gi, (_m, c: string) =>
    String((c && c.trim() !== '' ? parseFloat(c) : 1) * Math.PI));
  t = t.replace(/√\s*(\d+(?:\.\d+)?)/g, (_m, n: string) => String(Math.sqrt(parseFloat(n))));
  t = t.replace(/(-?\d+(?:\.\d+)?)\s*%/g, (_m, n: string) => String(parseFloat(n) / 100));
  const frac = t.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/);
  if (frac) {
    const d = parseFloat(frac[2]);
    if (d !== 0) return parseFloat(frac[1]) / d;
  }
  const m = t.replace(/[$,]/g, '').match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? n : null;
}

/** Normalize for MCQ text comparison — strips LaTeX-ish noise + punctuation. */
export function normMcqText(s: string): string {
  return (s ?? '').toLowerCase().replace(/\$|\\[a-z]+|[{}()]/g, ' ').replace(/[^a-z0-9]/g, '');
}

// ── MCQ option text: fold, unless the fold merges two options ───────────────
// `normMcqText` is a lossy fold: it drops letter case and every character that
// is not a-z / 0-9. Inside ONE item it can therefore merge options that are
// different answers — genotypes "TT" / "Tt" / "tt", "Kc" / "KC", units "mg" /
// "Mg", "pH" / "PH", and equally "-2" / "2" or "1.5" / "15". Matching on the
// fold then returned whichever merged option came FIRST (2026-10-10: a wrong
// key letter at generation, a wrong verdict on a typed/spoken option text).
//
// The rule (the academy's `mcq-core` block, apps/api/src/services/mcqAnswer.ts,
// is the same rule for case): both sides are trimmed and NFC-normalised; the
// fold is used as before UNLESS two options of the item are different texts
// with the same fold — that item is compared exactly, and an answer that
// still names more than one option names none.

/** Trimmed + NFC — the form two option texts are compared in when exact. */
export function mcqExactText(s: string | null | undefined): string {
  return (s ?? '').normalize('NFC').trim();
}

/** True when two of the values are DIFFERENT texts that `fold` makes equal.
 *  Two identical values are not such a pair. The default fold is letter case
 *  only (the academy's `mcqCaseDistinct`); pass `normMcqText` for the wider
 *  fold `resolveMcqLetter` matches with. */
export function mcqFoldCollides(
  values: Array<string | null | undefined>,
  fold: (s: string) => string = (s) => s.toLowerCase(),
): boolean {
  const seen = new Map<string, string>();
  for (const raw of values) {
    const v = mcqExactText(raw);
    const k = fold(v);
    if (!k) continue; // nothing left to match on — the fold never matches it
    const prev = seen.get(k);
    if (prev === undefined) seen.set(k, v);
    else if (prev !== v) return true;
  }
  return false;
}

/** Progressively looser readings of an option text, tightest first. Used only
 *  inside an item whose options collide under `normMcqText`. */
const MCQ_TIERS: Array<(s: string) => string> = [
  (s) => s,                                                    // exact
  (s) => s.replace(/[−–—]/g, '-').replace(/[$\s]/g, ''),        // "$-2$" ≡ "-2", "T t" ≡ "Tt"
  (s) => s.replace(/[−–—]/g, '-').replace(/[$\s]/g, '').toLowerCase(),
  normMcqText,                                                 // the usual fold
];

/** The letter of the ONE option `answer` names in a colliding item: the
 *  tightest reading under which it matches any option decides, and it must
 *  match exactly one there — two (byte-identical options, or an answer that
 *  only matches after the fold that merged them) is no match. */
function resolveCollidingMcqText(
  answer: string,
  choices: Array<{ letter: string; text: string }>
): string | null {
  const a = mcqExactText(answer);
  for (const tier of MCQ_TIERS) {
    const key = tier(a);
    if (!key) continue;
    const hits = choices.filter((c) => tier(mcqExactText(c.text)) === key);
    if (hits.length === 1) return hits[0].letter.toUpperCase();
    if (hits.length > 1) return null;
  }
  return null;
}

/** Resolve an answer string to a bare choice LETTER — direct letter shapes
 *  ("D", "(D)", "Option D."), else an EXACT normalized match against a
 *  choice's text. Returns null when unresolvable. Text → letter is
 *  deliberately exact-only (no fuzzy/containment matching): MCQ choices
 *  about one concept share most of their words (a negation distractor
 *  differs from the correct choice by one token), so paraphrase matching
 *  would mis-resolve. Shared by `mcqAnswersAgree` (tutor-session) and
 *  Practice's answer-shape gate (`practice-gen.ts`) so both resolve a claimed
 *  MCQ answer to a bank-storable bare letter the exact same way.
 *
 *  2026-10-10: when two options of the item are different texts with the same
 *  normalized form, the item is matched exactly instead (see the block above)
 *  — never "the first option that folds to it". Every other item resolves as
 *  it always did (scripts/test-mcq-letter-case.ts compares old and new). */
export function resolveMcqLetter(
  answer: string,
  choices: Array<{ letter: string; text: string }>
): string | null {
  const t = (answer ?? '').trim();
  const direct = t.match(/^\(?([A-Ea-e])\)?[.):]?$/);
  if (direct) return direct[1].toUpperCase();
  const prefixed = t.match(/^(?:option|choice|answer(?:\s+is)?)[:\s]+\(?([A-Ea-e])\)?[.):]?\s*$/i);
  if (prefixed) return prefixed[1].toUpperCase();
  const n = normMcqText(t);
  if (!n) return null;
  if (mcqFoldCollides(choices.map((c) => c.text), normMcqText)) return resolveCollidingMcqText(t, choices);
  for (const c of choices) {
    if (normMcqText(c.text) === n) return c.letter.toUpperCase();
  }
  return null;
}
