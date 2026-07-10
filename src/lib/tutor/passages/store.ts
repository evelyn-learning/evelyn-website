/**
 * Passage registry. Each passage is a seed module imported here and added to
 * SEED_PASSAGES. Resolve by id to render (show_annotated_passage) or to feed
 * the passage-aware grader. Mirrors topic-notes/store.ts.
 */
import type { Passage } from './types';
import { PASSAGE_DOUGLASS_FOURTH_OF_JULY } from './seeds/douglass-fourth-of-july';
import { PASSAGE_HENRY_GIVE_ME_LIBERTY } from './seeds/henry-give-me-liberty';
import { PASSAGE_SWIFT_MODEST_PROPOSAL } from './seeds/swift-modest-proposal';
import { PASSAGE_LINCOLN_GETTYSBURG } from './seeds/lincoln-gettysburg';

export const SEED_PASSAGES: Passage[] = [
  PASSAGE_DOUGLASS_FOURTH_OF_JULY,
  PASSAGE_HENRY_GIVE_ME_LIBERTY,
  PASSAGE_SWIFT_MODEST_PROPOSAL,
  PASSAGE_LINCOLN_GETTYSBURG,
];

export const passageById = new Map<string, Passage>(
  SEED_PASSAGES.map((p) => [p.id, p]),
);

export function resolvePassage(id: string): Passage | undefined {
  return passageById.get(id);
}
