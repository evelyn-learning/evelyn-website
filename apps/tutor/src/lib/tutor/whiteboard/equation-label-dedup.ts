// src/lib/tutor/whiteboard/equation-label-dedup.ts
/**
 * show_equation label-duplicate guard — pure decision.
 *
 * WHY (live 2026-09-06, portal-3a024b75 — the "R1 silent render drop"):
 * the brain reuses step labels across problems ("Collecting x terms",
 * "Final answer", "Fresh equation to solve"). The old guard kept one map per
 * SEGMENT and silently dropped any later equation whose normalized label
 * matched an earlier one with different latex. A segment that hosts several
 * problems (27 min in "hook" that day) therefore lost one equation per
 * repeated label — six times in one session — and the brain, told nothing,
 * narrated as if the board had it.
 *
 * Rule now: a label collision only matters when the prior equation is on
 * the SAME PAGE and is STILL ON THE BOARD. Then it is a real "two different
 * equations under one heading" and the brain is told to relabel (a
 * rejection with a reason, not a silent drop — silent drops are the class
 * that hid this for months). Any other collision is a fresh artefact.
 */
export interface SeenEquationLabel {
  originalLabel: string;
  originalLatex: string;
  latexNormalized: string;
  /** buildShowSignature(...) of the registered command; the catalog is asked whether it is still on the board. */
  signature: string;
  /** Catalog page title the equation was registered on ('' for the untitled first page). */
  pageKey: string;
}

export type LabelDedupDecision =
  | { kind: 'pass' }
  | { kind: 'register' }
  | { kind: 'reject'; reason: string };

export function normalizeEquationLabel(raw: string): string {
  return (raw ?? '')
    .toLowerCase()
    .replace(/[✓✗✔✘☐☑]/g, '')
    .replace(/\s*\(final\)\s*$/i, '')
    .replace(/\s*\(corrected\)\s*$/i, '')
    .replace(/\s*\(updated\)\s*$/i, '')
    .replace(/\s*\(\d+\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function decideLabelDuplicate(args: {
  normalizedLabel: string;
  normalizedLatex: string;
  seen: SeenEquationLabel | undefined;
  currentPageKey: string;
  priorOnBoard: boolean;
}): LabelDedupDecision {
  const { seen } = args;
  if (!args.normalizedLabel) return { kind: 'pass' };
  if (!seen) return { kind: 'register' };
  if (seen.latexNormalized === args.normalizedLatex) return { kind: 'pass' };
  if (seen.pageKey !== args.currentPageKey) return { kind: 'register' };
  if (!args.priorOnBoard) return { kind: 'register' };
  return {
    kind: 'reject',
    reason:
      `An equation labeled "${seen.originalLabel}" is already on this page with different content (${seen.originalLatex.slice(0, 60)}). ` +
      `Re-emit show_equation with a distinct label that names THIS step, or scroll to the existing one if it is what you meant.`,
  };
}
