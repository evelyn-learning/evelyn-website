import type { Passage } from '../types';

/**
 * Magna Carta (1215), clauses 12, 39, and 40 (1215 numbering), Avalon
 * Project translation (Yale Law School's Lillian Goldman Law Library).
 * AP World Unit-1 DBQ document — the baronial charter limiting King John's
 * powers of taxation and arbitrary justice, a case study in medieval
 * European decentralization of royal authority. Verbatim public-domain
 * excerpt, three contiguous clauses joined with ellipses (each clause is a
 * separate numbered article of the charter, so no ellipsis marks an
 * internal cut within a clause). Each clause verified as a contiguous
 * substring of the fetched Avalon Project page source (whitespace
 * normalized). Clause 12 as published on Avalon reads "No scutage not aid"
 * (an apparent "nor"/"not" transcription slip preserved in the source
 * itself, quoted as fetched rather than silently corrected).
 */
export const PASSAGE_APWORLD_MAGNA_CARTA: Passage = {
  id: 'evelyn.passage.apworld-magna-carta.v1',
  title: 'Magna Carta (1215) — Clauses 12, 39, 40',
  author: 'King John of England and the English barons',
  year: 1215,
  sourceUrl: 'https://avalon.law.yale.edu/medieval/magna.asp',
  license: 'public-domain',
  genre: 'constitution',
  fullText:
    '12. No scutage not aid shall be imposed on our kingdom, unless by common counsel of our kingdom, except for ransoming our person, for making our eldest son a knight, and for once marrying our eldest daughter; and for these there shall not be levied more than a reasonable aid.\n\n' +
    '… 39. No freemen shall be taken or imprisoned or disseised or exiled or in any way destroyed, nor will we go upon him nor send upon him, except by the lawful judgment of his peers or by the law of the land.\n\n' +
    '… 40. To no one will we sell, to no one will we refuse or delay, right or justice.',
  lineNumbered: true,
  wordCount: 110,
};
