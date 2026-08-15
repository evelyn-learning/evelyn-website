import type { Passage } from '../types';

/**
 * Rudyard Kipling, "The White Man's Burden" (McClure's Magazine / The Five
 * Nations, 1899). Verbatim public-domain excerpt (first two stanzas) from the
 * Wikisource proofread edition of The Five Nations (1899), collated against
 * the original page scans. AP World Unit-6 document: Kipling wrote the poem
 * urging the United States to take up colonial rule in the Philippines after
 * the Spanish-American War. It is presented here as a primary source OF
 * imperial ideology — a widely circulated, highly influential statement of
 * the "civilizing mission" argument for empire (paternalistic obligation,
 * racial hierarchy, the costs and thanklessness of rule) — not as an
 * endorsement of that argument. Historians read it as a document to be
 * analyzed for its ideology and its moment (1899, US expansion), not as a
 * neutral description of colonial subjects.
 */
export const PASSAGE_APWORLD_WHITE_MANS_BURDEN: Passage = {
  id: 'evelyn.passage.apworld-white-mans-burden.v1',
  title: "The White Man's Burden (1899)",
  author: 'Rudyard Kipling',
  year: 1899,
  sourceUrl: "https://en.wikisource.org/wiki/The_Five_Nations/The_White_Man%27s_Burden",
  license: 'public-domain',
  genre: 'document',
  fullText:
    "Take up the White Man's burden—\nSend forth the best ye breed—\nGo bind your sons to exile\nTo serve your captives' need;\nTo wait in heavy harness,\nOn fluttered folk and wild—\nYour new-caught, sullen peoples,\nHalf-devil and half-child.\n\nTake up the White Man's burden—\nIn patience to abide,\nTo veil the threat of terror\nAnd check the show of pride;\nBy open speech and simple,\nAn hundred times made plain,\nTo seek another's profit,\nAnd work another's gain.",
  lineNumbered: true,
  wordCount: 80,
};
