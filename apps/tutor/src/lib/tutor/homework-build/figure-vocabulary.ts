/**
 * The homework figure vocabulary: which figure kinds the per-problem homework
 * build may propose, validate and store, and the HOMEWORK_FIGURE_KINDS kill
 * switch. `all` (the default: unset, `all`, or anything unrecognised) is the
 * whole vocabulary; `geometry` is the two kinds the build had before it
 * (constructed geometry and function graphs). Pure: no I/O.
 *
 * Each kind task appends its action to FIGURE_ACTIONS, its type to
 * FIGURE_STATS_TYPES / FIGURE_DIAGRAM_KINDS, and its entry to FIGURE_KIND_DOCS;
 * the drift test in scripts/test-homework-build.ts keeps the four in step.
 */

import type { FigureDiagramKind, FigureStatsType } from './types';

export type FigureVocabulary = 'all' | 'geometry';

/** The two kinds every vocabulary allows. */
const GEOMETRY_IDS: readonly string[] = ['showGeometryConstructed', 'showGraph'];

/** Every whiteboard action a homework figure may use. */
export const FIGURE_ACTIONS: readonly string[] = [...GEOMETRY_IDS];

/** The showStats chart types in the vocabulary. */
export const FIGURE_STATS_TYPES: readonly FigureStatsType[] = [];

/** The showDiagram catalog kinds in the vocabulary (each has a catalog solver). */
export const FIGURE_DIAGRAM_KINDS: readonly FigureDiagramKind[] = [];

/** One kind as the proposer is told about it: its id (figureKindId), when to use it, its shape, and how its thumbnail box is sized. */
export interface FigureKindDoc { id: string; when: string; shape: string; box: 'fixed' | 'natural' }

/** The kinds beyond geometry and function graphs, one entry each. */
export const FIGURE_KIND_DOCS: readonly FigureKindDoc[] = [];

/** HOMEWORK_FIGURE_KINDS, trimmed and lower-cased: `geometry` → geometry; unset or `all` → all; anything else → all, with a warning (flags default ON). */
export function figureVocabularyFromEnv(env: Record<string, string | undefined> = process.env): FigureVocabulary {
  const raw = env.HOMEWORK_FIGURE_KINDS;
  const v = (raw ?? '').trim().toLowerCase();
  if (v === 'geometry') return 'geometry';
  if (v === '' || v === 'all') return 'all';
  console.warn(`[homework-build] HOMEWORK_FIGURE_KINDS="${raw}" not recognised, using all`);
  return 'all';
}

/** A figure's kind id: `showStats:<type>` and `showDiagram:<type>`, the bare action otherwise. */
export function figureKindId(figure: { action?: unknown; type?: unknown }): string {
  const action = String(figure?.action);
  return action === 'showStats' || action === 'showDiagram' ? `${action}:${String(figure.type)}` : action;
}

/** Under `geometry`, only the two geometry ids; under `all`, those plus every documented kind. */
export function isFigureKindAllowed(id: string, v: FigureVocabulary): boolean {
  if (GEOMETRY_IDS.includes(id)) return true;
  return v === 'all' && FIGURE_KIND_DOCS.some((d) => d.id === id);
}
