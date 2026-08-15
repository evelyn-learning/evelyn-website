/**
 * Shared, client-safe types for the lesson-plan search/browse index.
 *
 * The index is a slim, fully-resolved view of the whole catalog, fetched
 * once on the tutor setup page so quick-search AND the Subject→Level→Topic→
 * Lesson cascade are instant and DB-free. Each entry carries both the plan's
 * raw tags and the taxonomy CELL it resolves into (cellSubject/Level/Topic),
 * so search-select and the drilldown agree by construction. See
 * resolve-cell.ts for how the cell is computed (server-side).
 */
export interface PlanIndexEntry {
  id: string;
  title: string;
  curriculum: string;
  grade: string;
  subject: string; // raw plan subject tag
  topic?: string; // raw plan topic tag
  estimatedMinutes: number;
  firstLo?: string; // los[0].description, for the search-result subtitle
  // CED unit grouping metadata (AP courses) — drives <optgroup> labels.
  cedUnit?: string;
  cedTopic?: string;
  cedTitle?: string;
  // Resolved taxonomy cell. null on all three → orphan (topic lives in no
  // cell); such a plan is still searchable but won't appear in the cascade.
  cellSubject: string | null;
  cellLevel: string | null;
  cellTopic: string | null;
  // Precomputed lowercased haystack for token-AND search.
  search: string;
}

export interface PlanIndexResponse {
  /** Schema/version stamp — bump to bust client caches. */
  version: number;
  count: number;
  entries: PlanIndexEntry[];
}

export const PLAN_INDEX_VERSION = 2;
