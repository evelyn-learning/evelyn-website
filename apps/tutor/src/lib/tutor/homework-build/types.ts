/**
 * Types for the per-problem homework build: for each problem of an uploaded
 * homework, a figure and a verified answer key, prepared ahead of the session.
 */

import { createHash } from 'node:crypto';
import type { GraphData } from '@core/knowledge/types';

export type FigureCommand =
  | { action: 'showGeometryConstructed'; title?: string; given: unknown[]; steps: unknown[]; display?: Record<string, unknown> }
  | { action: 'showGraph'; type: 'function'; data: GraphData };

export type FigureClaim =
  | { kind: 'on_segment'; point: string; segment: [string, string] }
  | { kind: 'on_circle'; point: string; circle: string }
  | { kind: 'parallel'; a: [string, string]; b: [string, string] }
  | { kind: 'perpendicular'; a: [string, string]; b: [string, string] }
  | { kind: 'collinear'; points: string[] }
  | { kind: 'between'; point: string; ends: [string, string] }
  /** GAC acceptance 2026-10-22 (hw-14b p1, G1): a stated relative position of
   *  two named points ("E is to the right of A"); y up, the solver's convention. */
  | { kind: 'left_of' | 'right_of' | 'above' | 'below'; point: string; of: string };

export interface AnswerPart {
  label: string;
  final: string;
  canonical: { kind: 'number'; value: number; units?: string } | { kind: 'text'; value: string };
  /** 2026-10-21 (hw-11 problem 2, "x = 7, PA = 17"): a part whose final holds
   *  several named numbers is confirmed value by value, across messages
   *  (keyed-verdict.ts). Names are normalised (lower case, no spaces). */
  values?: Array<{ name: string; value: number }>;
}

/** One step of the verified solution path: the fact/theorem/equation used, and the intermediate result when there is one. */
export interface KeyStep { relation: string; value?: string }

export interface AnswerKey { parts: AnswerPart[]; solvers: string[]; steps?: KeyStep[] }

export type ProblemBuildStatus = 'preparing' | 'ready' | 'unverified';

export interface ProblemBuild {
  n: number;
  text: string;
  hash: string;
  status: ProblemBuildStatus;
  figure: FigureCommand | null;
  figureNote?: string;
  /** Static SVG of a geometry figure for list thumbnails (figure-svg.ts); absent for graphs and failures. */
  figureSvg?: string;
  key: AnswerKey | null;
  verify: { agreed: boolean; candidates?: string[]; note?: string };
  ms?: number;
  tokens?: { in: number; out: number };
  updatedAt: Date;
}

export interface HomeworkBuildDoc {
  _id: string;
  partnerId: string;
  problems: ProblemBuild[];
  startedAt: Date;
  updatedAt: Date;
  done: boolean;
}

/** sha256 of the text with whitespace collapsed and trimmed, first 16 hex chars. */
export function problemHash(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}
