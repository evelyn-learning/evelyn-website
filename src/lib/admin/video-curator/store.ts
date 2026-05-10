/**
 * Read/write helpers for `src/data/curated-videos-ap.json`.
 *
 * Direct file writes are only safe in dev (the local repo is the storage).
 * In prod, this would move to Mongo. v1 ships with the static-file model
 * because it's the smallest path that lets the user accept/reject and
 * version-control the curation work as it happens.
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { CuratedVideoStore, SavedSegment } from './types';

const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'curated-videos-ap.json');

export async function readStore(): Promise<CuratedVideoStore> {
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  const parsed = JSON.parse(raw) as CuratedVideoStore;
  if (!parsed.segments) parsed.segments = [];
  return parsed;
}

export async function writeStore(store: CuratedVideoStore): Promise<void> {
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8');
}

export async function upsertSegment(segment: SavedSegment): Promise<void> {
  const store = await readStore();
  const idx = store.segments.findIndex((s) => s.id === segment.id);
  if (idx >= 0) store.segments[idx] = segment;
  else store.segments.push(segment);
  await writeStore(store);
}

export async function deleteSegment(id: string): Promise<boolean> {
  const store = await readStore();
  const before = store.segments.length;
  store.segments = store.segments.filter((s) => s.id !== id);
  if (store.segments.length === before) return false;
  await writeStore(store);
  return true;
}

export async function countSegmentsByConcept(): Promise<Record<string, number>> {
  const store = await readStore();
  const counts: Record<string, number> = {};
  for (const seg of store.segments) {
    counts[seg.conceptId] = (counts[seg.conceptId] ?? 0) + 1;
  }
  return counts;
}
