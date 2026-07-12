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
// APUSH Period-1 (1491-1607) DBQ documents
import { PASSAGE_APUSH_COLUMBUS_LETTER } from './seeds/apush-columbus-letter';
import { PASSAGE_APUSH_LAS_CASAS } from './seeds/apush-las-casas';
import { PASSAGE_APUSH_CORTES_TENOCHTITLAN } from './seeds/apush-cortes-tenochtitlan';
import { PASSAGE_APUSH_CODEX_MENDOZA } from './seeds/apush-codex-mendoza';
import { PASSAGE_APUSH_HAKLUYT_WESTERN_PLANTING } from './seeds/apush-hakluyt-western-planting';
// APUSH Period-2 (1607-1754) DBQ documents
import { PASSAGE_APUSH_MAYFLOWER_COMPACT } from './seeds/apush-mayflower-compact';
import { PASSAGE_APUSH_WINTHROP_CHARITY } from './seeds/apush-winthrop-charity';
import { PASSAGE_APUSH_BACON_DECLARATION } from './seeds/apush-bacon-declaration';
import { PASSAGE_APUSH_EQUIANO } from './seeds/apush-equiano';
import { PASSAGE_APUSH_EDWARDS_SINNERS } from './seeds/apush-edwards-sinners';
// APUSH Period-4 (1800-1848) documents
import { PASSAGE_APUSH_JEFFERSON_INAUGURAL } from './seeds/apush-jefferson-inaugural';
import { PASSAGE_APUSH_MONROE_DOCTRINE } from './seeds/apush-monroe-doctrine';
import { PASSAGE_APUSH_JACKSON_BANK_VETO } from './seeds/apush-jackson-bank-veto';
import { PASSAGE_APUSH_SENECA_FALLS } from './seeds/apush-seneca-falls';
import { PASSAGE_APUSH_GARRISON_LIBERATOR } from './seeds/apush-garrison-liberator';
// AP World Unit-2 (Networks of Exchange) DBQ documents
import { PASSAGE_APWORLD_MARCO_POLO_KINSAY } from './seeds/apworld-marco-polo-kinsay';
import { PASSAGE_APWORLD_MARCO_POLO_YAM } from './seeds/apworld-marco-polo-yam';
import { PASSAGE_APWORLD_MARCO_POLO_PAPER_MONEY } from './seeds/apworld-marco-polo-paper-money';
import { PASSAGE_APWORLD_IBN_BATTUTA_KILWA } from './seeds/apworld-ibn-battuta-kilwa';
import { PASSAGE_APWORLD_MANSA_MUSA } from './seeds/apworld-mansa-musa';
import { PASSAGE_APWORLD_BLACK_DEATH } from './seeds/apworld-black-death';
import { PASSAGE_APWORLD_CATALAN_ATLAS } from './seeds/apworld-catalan-atlas';
// AP World Unit-8 (Cold War & Decolonization) documents
import { PASSAGE_APWORLD_JFK_CUBA } from './seeds/apworld-jfk-cuba';
import { PASSAGE_APWORLD_UDHR } from './seeds/apworld-udhr';
import { PASSAGE_APWORLD_UN_MEMBERSHIP_TABLE } from './seeds/apworld-un-membership-table';
import { PASSAGE_APWORLD_BERLIN_WALL_VISUAL } from './seeds/apworld-berlin-wall-visual';
// AP World Unit-9 (Globalization) documents
import { PASSAGE_APWORLD_LIFE_EXPECTANCY_TABLE } from './seeds/apworld-life-expectancy-table';
import { PASSAGE_APWORLD_ICT_TABLE } from './seeds/apworld-ict-table';
import { PASSAGE_APWORLD_TRADE_CONTAINER_TABLE } from './seeds/apworld-trade-container-table';
// AP Gov Unit-1 (Foundations of American Democracy) documents
import { PASSAGE_APGOV_FEDERALIST_51 } from './seeds/apgov-federalist-51';
import { PASSAGE_APGOV_FEDERAL_GRANTS_TABLE } from './seeds/apgov-federal-grants-table';
// AP Gov Unit-2 (Interactions Among Branches of Government) documents
import { PASSAGE_APGOV_ARTICLES_CONFEDERATION } from './seeds/apgov-articles-confederation';
import { PASSAGE_APGOV_FEDERALIST_70 } from './seeds/apgov-federalist-70';
import { PASSAGE_APGOV_FEDERALIST_78 } from './seeds/apgov-federalist-78';
import { PASSAGE_APGOV_CONGRESS_DEMOGRAPHICS_TABLE } from './seeds/apgov-congress-demographics-table';
import { PASSAGE_APGOV_MARBURY_OPINION } from './seeds/apgov-marbury-opinion';
// AP Gov Unit-3 (Civil Liberties and Civil Rights) documents
import { PASSAGE_APGOV_CIVIL_RIGHTS_FILINGS_TABLE } from './seeds/apgov-civil-rights-filings-table';
import { PASSAGE_APGOV_BROWN_OPINION } from './seeds/apgov-brown-opinion';
import { PASSAGE_APGOV_TINKER_OPINION } from './seeds/apgov-tinker-opinion';
// AP Gov Unit-4 (American Political Ideologies and Beliefs) documents
import { PASSAGE_APGOV_IDEOLOGY_AGE_TABLE } from './seeds/apgov-ideology-age-table';
// AP Gov Unit-5 (Political Participation) documents
import { PASSAGE_APGOV_TURNOUT_AGE_TABLE } from './seeds/apgov-turnout-age-table';
import { PASSAGE_APGOV_CITIZENS_UNITED_OPINION } from './seeds/apgov-citizens-united-opinion';
// APUSH Period-5 (1844-1877) documents
import { PASSAGE_APUSH_OSULLIVAN_ANNEXATION } from './seeds/apush-osullivan-annexation';
import { PASSAGE_APUSH_SC_SECESSION } from './seeds/apush-sc-secession';
import { PASSAGE_APUSH_EMANCIPATION_PROCLAMATION } from './seeds/apush-emancipation-proclamation';
// APUSH Period-6 (1865-1898) DBQ documents
import { PASSAGE_APUSH_CARNEGIE_WEALTH } from './seeds/apush-carnegie-wealth';
import { PASSAGE_APUSH_OMAHA_PLATFORM } from './seeds/apush-omaha-platform';
import { PASSAGE_APUSH_CHINESE_EXCLUSION } from './seeds/apush-chinese-exclusion';
import { PASSAGE_APUSH_IMMIGRATION_TABLE } from './seeds/apush-immigration-table';
import { PASSAGE_APUSH_CROSS_OF_GOLD } from './seeds/apush-cross-of-gold';
// APUSH Period-7 (1890-1945) DBQ documents
import { PASSAGE_APUSH_ROOSEVELT_COROLLARY } from './seeds/apush-roosevelt-corollary';
import { PASSAGE_APUSH_WILSON_WAR_MESSAGE } from './seeds/apush-wilson-war-message';
import { PASSAGE_APUSH_FDR_FIRST_INAUGURAL } from './seeds/apush-fdr-first-inaugural';
import { PASSAGE_APUSH_FOUR_FREEDOMS } from './seeds/apush-four-freedoms';
import { PASSAGE_APUSH_EO_9066 } from './seeds/apush-eo-9066';
// APUSH Period-8 (1945-1980) DBQ documents
import { PASSAGE_APUSH_TRUMAN_DOCTRINE } from './seeds/apush-truman-doctrine';
import { PASSAGE_APUSH_EISENHOWER_FAREWELL } from './seeds/apush-eisenhower-farewell';
import { PASSAGE_APUSH_JFK_INAUGURAL } from './seeds/apush-jfk-inaugural';
import { PASSAGE_APUSH_LBJ_GREAT_SOCIETY } from './seeds/apush-lbj-great-society';
// APUSH Period-9 (1980-present) DBQ documents
import { PASSAGE_APUSH_REAGAN_INAUGURAL } from './seeds/apush-reagan-inaugural';
import { PASSAGE_APUSH_REAGAN_BRANDENBURG } from './seeds/apush-reagan-brandenburg';
import { PASSAGE_APUSH_BUSH_SEPT_2001 } from './seeds/apush-bush-sept-2001';
import { PASSAGE_APUSH_OBAMA_INAUGURAL } from './seeds/apush-obama-inaugural';
import { PASSAGE_APUSH_IMMIGRATION_ORIGINS_TABLE } from './seeds/apush-immigration-origins-table';

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
  PASSAGE_APUSH_COLUMBUS_LETTER,
  PASSAGE_APUSH_LAS_CASAS,
  PASSAGE_APUSH_CORTES_TENOCHTITLAN,
  PASSAGE_APUSH_CODEX_MENDOZA,
  PASSAGE_APUSH_HAKLUYT_WESTERN_PLANTING,
  PASSAGE_APUSH_MAYFLOWER_COMPACT,
  PASSAGE_APUSH_WINTHROP_CHARITY,
  PASSAGE_APUSH_BACON_DECLARATION,
  PASSAGE_APUSH_EQUIANO,
  PASSAGE_APUSH_EDWARDS_SINNERS,
  PASSAGE_APUSH_JEFFERSON_INAUGURAL,
  PASSAGE_APUSH_MONROE_DOCTRINE,
  PASSAGE_APUSH_JACKSON_BANK_VETO,
  PASSAGE_APUSH_SENECA_FALLS,
  PASSAGE_APUSH_GARRISON_LIBERATOR,
  PASSAGE_APWORLD_MARCO_POLO_KINSAY,
  PASSAGE_APWORLD_MARCO_POLO_YAM,
  PASSAGE_APWORLD_MARCO_POLO_PAPER_MONEY,
  PASSAGE_APWORLD_IBN_BATTUTA_KILWA,
  PASSAGE_APWORLD_MANSA_MUSA,
  PASSAGE_APWORLD_BLACK_DEATH,
  PASSAGE_APWORLD_CATALAN_ATLAS,
  PASSAGE_APWORLD_JFK_CUBA,
  PASSAGE_APWORLD_UDHR,
  PASSAGE_APWORLD_UN_MEMBERSHIP_TABLE,
  PASSAGE_APWORLD_BERLIN_WALL_VISUAL,
  PASSAGE_APWORLD_LIFE_EXPECTANCY_TABLE,
  PASSAGE_APWORLD_ICT_TABLE,
  PASSAGE_APWORLD_TRADE_CONTAINER_TABLE,
  PASSAGE_APGOV_FEDERALIST_51,
  PASSAGE_APGOV_FEDERAL_GRANTS_TABLE,
  PASSAGE_APGOV_ARTICLES_CONFEDERATION,
  PASSAGE_APGOV_FEDERALIST_70,
  PASSAGE_APGOV_FEDERALIST_78,
  PASSAGE_APGOV_CONGRESS_DEMOGRAPHICS_TABLE,
  PASSAGE_APGOV_MARBURY_OPINION,
  PASSAGE_APGOV_CIVIL_RIGHTS_FILINGS_TABLE,
  PASSAGE_APGOV_BROWN_OPINION,
  PASSAGE_APGOV_TINKER_OPINION,
  PASSAGE_APGOV_IDEOLOGY_AGE_TABLE,
  PASSAGE_APGOV_TURNOUT_AGE_TABLE,
  PASSAGE_APGOV_CITIZENS_UNITED_OPINION,
  PASSAGE_APUSH_OSULLIVAN_ANNEXATION,
  PASSAGE_APUSH_SC_SECESSION,
  PASSAGE_APUSH_EMANCIPATION_PROCLAMATION,
  PASSAGE_APUSH_CARNEGIE_WEALTH,
  PASSAGE_APUSH_OMAHA_PLATFORM,
  PASSAGE_APUSH_CHINESE_EXCLUSION,
  PASSAGE_APUSH_IMMIGRATION_TABLE,
  PASSAGE_APUSH_CROSS_OF_GOLD,
  PASSAGE_APUSH_ROOSEVELT_COROLLARY,
  PASSAGE_APUSH_WILSON_WAR_MESSAGE,
  PASSAGE_APUSH_FDR_FIRST_INAUGURAL,
  PASSAGE_APUSH_FOUR_FREEDOMS,
  PASSAGE_APUSH_EO_9066,
  PASSAGE_APUSH_TRUMAN_DOCTRINE,
  PASSAGE_APUSH_EISENHOWER_FAREWELL,
  PASSAGE_APUSH_JFK_INAUGURAL,
  PASSAGE_APUSH_LBJ_GREAT_SOCIETY,
  PASSAGE_APUSH_REAGAN_INAUGURAL,
  PASSAGE_APUSH_REAGAN_BRANDENBURG,
  PASSAGE_APUSH_BUSH_SEPT_2001,
  PASSAGE_APUSH_OBAMA_INAUGURAL,
  PASSAGE_APUSH_IMMIGRATION_ORIGINS_TABLE,
];

export const passageById = new Map<string, Passage>(
  SEED_PASSAGES.map((p) => [p.id, p]),
);

export function resolvePassage(id: string): Passage | undefined {
  return passageById.get(id);
}
