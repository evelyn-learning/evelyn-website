/**
 * Read/write helpers for `src/data/curated-videos-ap.drafts.json`.
 *
 * The drafts file is populated by the offline batch script
 * (`scripts/curate-ap-macro-videos.ts`) and read by the admin UI. The
 * UI never writes here — when the user approves, the entry moves to
 * `curated-videos-ap.json` (via store.ts) and is removed from drafts.
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { DraftClip, DraftsStore } from './types';

const DRAFTS_PATH = path.join(
  process.cwd(),
  'src',
  'data',
  'curated-videos-ap.drafts.json',
);

const EMPTY: DraftsStore = {
  schemaVersion: 1,
  course: 'ap-macroeconomics',
  generatedAt: new Date(0).toISOString(),
  searchQueriesByConcept: {},
  drafts: [],
};

export async function readDrafts(): Promise<DraftsStore> {
  try {
    const raw = await fs.readFile(DRAFTS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as DraftsStore;
    if (!parsed.drafts) parsed.drafts = [];
    if (!parsed.searchQueriesByConcept) parsed.searchQueriesByConcept = {};
    return parsed;
  } catch {
    return { ...EMPTY };
  }
}

export async function writeDrafts(store: DraftsStore): Promise<void> {
  await fs.writeFile(
    DRAFTS_PATH,
    JSON.stringify(store, null, 2) + '\n',
    'utf8',
  );
}

export async function getDraftsForConcept(conceptId: string): Promise<{
  drafts: DraftClip[];
  searchQueries: DraftsStore['searchQueriesByConcept'][string];
  generatedAt: string;
}> {
  const store = await readDrafts();
  return {
    drafts: store.drafts.filter((d) => d.conceptId === conceptId),
    searchQueries: store.searchQueriesByConcept[conceptId] ?? [],
    generatedAt: store.generatedAt,
  };
}

/**
 * Replace all drafts for a concept (idempotent re-run safe). Other
 * concepts' drafts are preserved.
 */
export async function replaceDraftsForConcept(
  conceptId: string,
  drafts: DraftClip[],
  searchQueries: DraftsStore['searchQueriesByConcept'][string],
): Promise<void> {
  const store = await readDrafts();
  store.drafts = store.drafts.filter((d) => d.conceptId !== conceptId);
  store.drafts.push(...drafts);
  store.searchQueriesByConcept[conceptId] = searchQueries;
  store.generatedAt = new Date().toISOString();
  await writeDrafts(store);
}

export async function removeDraft(id: string): Promise<boolean> {
  const store = await readDrafts();
  const before = store.drafts.length;
  store.drafts = store.drafts.filter((d) => d.id !== id);
  if (store.drafts.length === before) return false;
  await writeDrafts(store);
  return true;
}

export async function countDraftsByConcept(): Promise<Record<string, number>> {
  const store = await readDrafts();
  const counts: Record<string, number> = {};
  for (const d of store.drafts) {
    counts[d.conceptId] = (counts[d.conceptId] ?? 0) + 1;
  }
  return counts;
}
