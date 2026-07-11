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
// AP World Unit-2 (Networks of Exchange) DBQ documents
import { PASSAGE_APWORLD_MARCO_POLO_KINSAY } from './seeds/apworld-marco-polo-kinsay';
import { PASSAGE_APWORLD_MARCO_POLO_YAM } from './seeds/apworld-marco-polo-yam';
import { PASSAGE_APWORLD_MARCO_POLO_PAPER_MONEY } from './seeds/apworld-marco-polo-paper-money';
import { PASSAGE_APWORLD_IBN_BATTUTA_KILWA } from './seeds/apworld-ibn-battuta-kilwa';
import { PASSAGE_APWORLD_MANSA_MUSA } from './seeds/apworld-mansa-musa';
import { PASSAGE_APWORLD_BLACK_DEATH } from './seeds/apworld-black-death';
import { PASSAGE_APWORLD_CATALAN_ATLAS } from './seeds/apworld-catalan-atlas';
// AP Gov Unit-1 (Foundations of American Democracy) documents
import { PASSAGE_APGOV_FEDERALIST_51 } from './seeds/apgov-federalist-51';
import { PASSAGE_APGOV_FEDERAL_GRANTS_TABLE } from './seeds/apgov-federal-grants-table';
// AP Gov Unit-2 (Interactions Among Branches of Government) documents
import { PASSAGE_APGOV_ARTICLES_CONFEDERATION } from './seeds/apgov-articles-confederation';
import { PASSAGE_APGOV_FEDERALIST_70 } from './seeds/apgov-federalist-70';
import { PASSAGE_APGOV_FEDERALIST_78 } from './seeds/apgov-federalist-78';
import { PASSAGE_APGOV_CONGRESS_DEMOGRAPHICS_TABLE } from './seeds/apgov-congress-demographics-table';
import { PASSAGE_APGOV_MARBURY_OPINION } from './seeds/apgov-marbury-opinion';

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
  PASSAGE_APWORLD_MARCO_POLO_KINSAY,
  PASSAGE_APWORLD_MARCO_POLO_YAM,
  PASSAGE_APWORLD_MARCO_POLO_PAPER_MONEY,
  PASSAGE_APWORLD_IBN_BATTUTA_KILWA,
  PASSAGE_APWORLD_MANSA_MUSA,
  PASSAGE_APWORLD_BLACK_DEATH,
  PASSAGE_APWORLD_CATALAN_ATLAS,
  PASSAGE_APGOV_FEDERALIST_51,
  PASSAGE_APGOV_FEDERAL_GRANTS_TABLE,
  PASSAGE_APGOV_ARTICLES_CONFEDERATION,
  PASSAGE_APGOV_FEDERALIST_70,
  PASSAGE_APGOV_FEDERALIST_78,
  PASSAGE_APGOV_CONGRESS_DEMOGRAPHICS_TABLE,
  PASSAGE_APGOV_MARBURY_OPINION,
];

export const passageById = new Map<string, Passage>(
  SEED_PASSAGES.map((p) => [p.id, p]),
);

export function resolvePassage(id: string): Passage | undefined {
  return passageById.get(id);
}
