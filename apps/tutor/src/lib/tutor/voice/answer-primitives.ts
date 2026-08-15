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

/** Resolve an answer string to a bare choice LETTER — direct letter shapes
 *  ("D", "(D)", "Option D."), else an EXACT normalized match against a
 *  choice's text. Returns null when unresolvable. Text → letter is
 *  deliberately exact-only (no fuzzy/containment matching): MCQ choices
 *  about one concept share most of their words (a negation distractor
 *  differs from the correct choice by one token), so paraphrase matching
 *  would mis-resolve. Shared by `mcqAnswersAgree` (tutor-session) and
 *  Practice's answer-shape gate (`practice-gen.ts`) so both resolve a claimed
 *  MCQ answer to a bank-storable bare letter the exact same way. */
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
  for (const c of choices) {
    if (normMcqText(c.text) === n) return c.letter.toUpperCase();
  }
  return null;
}
