/**
 * The client-safe half of `homework-problem.ts`: the one-problem plan's
 * metadata shape and its reader. The browser (VoiceTutorRealtime) reads a
 * plan's problem with this; it must not import `homework-problem.ts`, whose
 * builder pulls in the server-only plan generator.
 */

import type { FigureCommand } from '../homework-build/types';

export const HOMEWORK_PROBLEM_KIND = 'homework-problem' as const;

export interface HomeworkProblemMeta {
  kind: typeof HOMEWORK_PROBLEM_KIND;
  parentPlanId: string;
  n: number;
  text: string;
  figure: FigureCommand | null;
  verified: boolean;
  priorNote?: string;
}

/** Read the problem metadata back off a plan, or null when it isn't a one-problem plan. */
export function homeworkProblemOf(plan: { metadata?: Record<string, unknown> } | null | undefined): HomeworkProblemMeta | null {
  const m = plan?.metadata;
  if (!m || m.kind !== HOMEWORK_PROBLEM_KIND) return null;
  if (typeof m.parentPlanId !== 'string' || typeof m.n !== 'number' || typeof m.text !== 'string') return null;
  return {
    kind: HOMEWORK_PROBLEM_KIND,
    parentPlanId: m.parentPlanId,
    n: m.n,
    text: m.text,
    figure: (m.figure ?? null) as FigureCommand | null,
    verified: m.verified === true,
    ...(typeof m.priorNote === 'string' ? { priorNote: m.priorNote } : {}),
  };
}

const FIGURE_DESCRIPTION_OPEN_RE = /^\[\s*(?:figure|graph|diagram)\s*:/i;

/**
 * The problem text as the ProblemPanel shows it. With a figure drawn, every
 * bracketed `[Figure: …]` / `[Graph: …]` / `[Diagram: …]` description the
 * photo read wrote is removed — it can state exactly what the student is
 * asked to read off the figure (peaks, a midline). The scan is
 * bracket-balanced: descriptions hold intervals like `[0, 2π]`. Without a
 * figure the text is returned unchanged (the description is then the only
 * rendering of it). Pure.
 */
export function problemTextForDisplay(text: string, hasFigure: boolean): string {
  if (!hasFigure) return text;
  let out = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '[' && FIGURE_DESCRIPTION_OPEN_RE.test(text.slice(i, i + 40))) {
      let depth = 0;
      let j = i;
      for (; j < text.length; j++) {
        if (text[j] === '[') depth++;
        else if (text[j] === ']') { depth--; if (depth === 0) break; }
      }
      if (j >= text.length) { out += text.slice(i); break; } // unbalanced: keep the rest as written
      i = j + 1;
      continue;
    }
    out += text[i];
    i++;
  }
  return out
    .replace(/[ \t]+/g, ' ')
    .replace(/ +(?=\n|\\n)/g, '')
    .replace(/(\n|\\n) +/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
