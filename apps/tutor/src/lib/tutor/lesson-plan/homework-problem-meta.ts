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
  /** A2 (2026-10-23): marks earlier sessions of this problem confirmed (keyed-verdict.ts). */
  priorConfirmed?: string[];
}

/** Client-safe copy of keyed-verdict's sanitizeConfirmedMarks (this file must stay import-light). */
function priorMarks(raw: unknown[]): string[] {
  const out: string[] = [];
  for (const m of raw) {
    if (typeof m !== 'string' || m.length > 120 || out.includes(m)) continue;
    if (/^part:[a-z0-9]*$/.test(m) || /^value:[a-z0-9]*=.+$/.test(m)) out.push(m);
    if (out.length >= 40) break;
  }
  return out;
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
    ...(Array.isArray(m.priorConfirmed) ? { priorConfirmed: priorMarks(m.priorConfirmed) } : {}),
  };
}

const FIGURE_DESCRIPTION_OPEN_RE = /^\[\s*(?:figure|graph|diagram)\s*:/i;
/** 2026-10-21 (hw-11 problem 1): the read wrote "[Angles, one at a time: 55°: its arc …]"
 *  instead of "[Figure: …]". A bracketed block that opens with a capitalised word or
 *  short phrase and a colon, and runs long, is a description too; "[Note: see back]",
 *  "[2 marks]" and an interval "[0, 2π]" are not. */
const DESCRIPTION_OPEN_RE = /^\[\s*[A-Z][^\]:]{0,40}:\s/;
const DESCRIPTION_MIN_CHARS = 60;

/** [start, endExclusive] of the bracket-balanced block opening at `i`, or null when unbalanced. */
function blockAt(text: string, i: number): number | null {
  let depth = 0;
  for (let j = i; j < text.length; j++) {
    if (text[j] === '[') depth++;
    else if (text[j] === ']') { depth--; if (depth === 0) return j + 1; }
  }
  return null;
}

/** The bracketed block at `i` is a figure description: an explicit Figure/Graph/Diagram opener, or a long "Word:" block. */
function isDescriptionAt(text: string, i: number): boolean {
  if (text[i] !== '[') return false;
  const head = text.slice(i, i + 48);
  if (FIGURE_DESCRIPTION_OPEN_RE.test(head)) return true;
  if (!DESCRIPTION_OPEN_RE.test(head)) return false;
  const end = blockAt(text, i);
  return end !== null && end - i >= DESCRIPTION_MIN_CHARS;
}

/** The photo read wrote a bracketed figure/graph/diagram description into this problem's text. Pure. */
export function hasFigureDescription(text: string): boolean {
  const t = String(text ?? '');
  for (let i = t.indexOf('['); i >= 0; i = t.indexOf('[', i + 1)) if (isDescriptionAt(t, i)) return true;
  return false;
}

/**
 * The problem text as the ProblemPanel shows it: every bracketed
 * `[Figure: …]` / `[Graph: …]` / `[Diagram: …]` description the photo read
 * wrote is removed, whether or not a figure was drawn (owner ruling
 * 2026-10-22, hw-14: the drawer carries the problem text only; the student
 * has the sheet). A description can state exactly what the student is asked
 * to read off the figure (peaks, a midline). The scan is bracket-balanced:
 * descriptions hold intervals like `[0, 2π]`. The tutor's prompt path keeps
 * the full text. Pure.
 */
export function problemTextForDisplay(text: string): string {
  let out = '';
  let i = 0;
  while (i < text.length) {
    if (isDescriptionAt(text, i)) {
      const end = blockAt(text, i);
      if (end === null) { out += text.slice(i); break; } // unbalanced: keep the rest as written
      i = end;
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
