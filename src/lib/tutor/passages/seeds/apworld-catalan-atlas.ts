import type { Passage } from '../types';

/**
 * The Catalan Atlas (1375), West Africa panel depicting Mansa Musa. AP World
 * Unit-2 DBQ document of the VISUAL type. Passage is text-only, so fullText is
 * a factual DESCRIPTION of the image + its caption + attribution (how a visual
 * DBQ document is presented for analysis), not the image itself.
 */
export const PASSAGE_APWORLD_CATALAN_ATLAS: Passage = {
  id: 'evelyn.passage.apworld-catalan-atlas.v1',
  title: 'The Catalan Atlas — Mansa Musa (political map, 1375)',
  author: 'Abraham Cresques (Majorca)',
  year: 1375,
  sourceUrl: 'https://www.bnf.fr/en/catalan-atlas',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[VISUAL DOCUMENT — description] A panel from the Catalan Atlas, a richly illustrated map of the known world made in 1375 by the Majorcan cartographer Abraham Cresques for the king of Aragon. The West African section shows a crowned Black king seated on a throne, holding a large golden orb (a nugget of gold) in his raised right hand and a golden sceptre in his left. A caption in Catalan identifies him as "Musse Melly, lord of the Blacks of Guinea," and states that "this king is the richest and most noble lord of all this region on account of the abundance of gold that is gathered in his land." A robed merchant on a camel approaches him across the Sahara. The panel presents Mali and Mansa Musa to a European audience as the fabled source of the gold that flowed north across the trans-Saharan trade routes.',
  lineNumbered: false,
  wordCount: 147,
};
