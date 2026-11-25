/**
 * The whiteboard's figure counts and names, read from the engine (2026-11-24), so the home page and the
 * whiteboard docs page state the same numbers and neither goes stale when a figure is added.
 *
 * SERVER ONLY: this imports the diagram catalogue with all its solvers. Never import it in a client component.
 */
import { DIAGRAM_CATALOG, isImplementedKind } from '@/lib/tutor/diagrams/catalog/manifest';
import { TOOL_FIGURES } from '@/lib/tutor/v2/figure-catalogue';

/** Catalogue subjects, in the order and under the names the docs page shows them. */
const SUBJECTS: Array<{ id: string; name: string }> = [
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'earth', name: 'Earth and space' },
  { id: 'social', name: 'Social studies and economics' },
  { id: 'ela', name: 'English language arts' },
  { id: 'cs', name: 'Computer science' },
  { id: 'general', name: 'Any subject' },
];

const implemented = () => DIAGRAM_CATALOG.filter((k) => isImplementedKind(k.kind));

export interface BoardCounts {
  /** Figures the catalogue draws exactly from a few parameters. */
  catalogueFigures: number;
  /** Further figures that have a drawing tool of their own. */
  toolFigures: number;
}

export function boardCounts(): BoardCounts {
  return { catalogueFigures: implemented().length, toolFigures: TOOL_FIGURES.length };
}

/** The catalogue's figures by subject, under the names the engine gives them. A figure used in two subjects is
 *  listed under each, so the lists add up to more than the catalogue's count. */
export function catalogueBySubject(): Array<{ id: string; name: string; figures: string[] }> {
  const rows = implemented();
  return SUBJECTS
    .map((s) => ({ ...s, figures: rows.filter((k) => (k.subjects as readonly string[]).includes(s.id)).map((k) => k.displayName) }))
    .filter((s) => s.figures.length > 0);
}
