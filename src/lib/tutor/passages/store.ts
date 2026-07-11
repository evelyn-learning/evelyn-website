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
// APUSH Period-3 DBQ documents
import { PASSAGE_APUSH_COMMON_SENSE } from './seeds/apush-common-sense';
import { PASSAGE_APUSH_DECLARATION } from './seeds/apush-declaration';
import { PASSAGE_APUSH_FEDERALIST_10 } from './seeds/apush-federalist-10';
import { PASSAGE_APUSH_BRUTUS_1 } from './seeds/apush-brutus-1';
import { PASSAGE_APUSH_CONSTITUTION_PREAMBLE } from './seeds/apush-constitution-preamble';
import { PASSAGE_APUSH_JOIN_OR_DIE } from './seeds/apush-join-or-die';

export const SEED_PASSAGES: Passage[] = [
  PASSAGE_DOUGLASS_FOURTH_OF_JULY,
  PASSAGE_HENRY_GIVE_ME_LIBERTY,
  PASSAGE_SWIFT_MODEST_PROPOSAL,
  PASSAGE_LINCOLN_GETTYSBURG,
  PASSAGE_APUSH_COMMON_SENSE,
  PASSAGE_APUSH_DECLARATION,
  PASSAGE_APUSH_FEDERALIST_10,
  PASSAGE_APUSH_BRUTUS_1,
  PASSAGE_APUSH_CONSTITUTION_PREAMBLE,
  PASSAGE_APUSH_JOIN_OR_DIE,
];

export const passageById = new Map<string, Passage>(
  SEED_PASSAGES.map((p) => [p.id, p]),
);

export function resolvePassage(id: string): Passage | undefined {
  return passageById.get(id);
}
