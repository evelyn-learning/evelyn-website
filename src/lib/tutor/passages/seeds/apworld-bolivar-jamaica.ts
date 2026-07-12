import type { Passage } from '../types';

/**
 * Simón Bolívar, the "Jamaica Letter" (Kingston, September 6, 1815), a
 * reply to a Jamaican gentleman on Spanish America's condition and prospects
 * for independence. AP World Unit-5 DBQ document — a creole-elite statement
 * of the Atlantic Revolutions, to be read alongside the French Declaration's
 * universalist claims (contrast: Bolívar's grievances center on colonial
 * exclusion from office and trade, not on the French Revolution's rights
 * language). Excerpt covers Spanish America's shut-out from viceregal,
 * ecclesiastical, diplomatic, and administrative office under colonial rule,
 * the sudden, unprepared assumption of self-government after independence,
 * and Bolívar's closing aspiration for American greatness and freedom (one
 * intervening paragraph elided, marked). Quoted, in this single named PD
 * English translation, from Guillermo A. Sherwell's 1921 English-language
 * biography "Simón Bolívar (The Liberator)" (Project Gutenberg #8928;
 * Washington, 1921), itself in the public domain; Sherwell wrote the
 * biography directly in English (it was later translated into Spanish, not
 * the reverse), so the quoted Jamaica Letter passages are his own
 * contemporary English rendering of Bolívar's Spanish original. The
 * biography's typographic convention re-opens a quotation mark at the start
 * of each paragraph of a multi-paragraph block quote (closing only at the
 * excerpt's end); those paragraph-boundary quote marks are dropped here as
 * typesetting artifacts, not part of Bolívar's text.
 */
export const PASSAGE_APWORLD_BOLIVAR_JAMAICA: Passage = {
  id: 'evelyn.passage.apworld-bolivar-jamaica.v1',
  title: 'The Jamaica Letter',
  author: 'Simón Bolívar (trans. Guillermo A. Sherwell)',
  year: 1815,
  sourceUrl: 'https://www.gutenberg.org/ebooks/8928',
  license: 'public-domain',
  genre: 'letter',
  fullText:
    'We were never viceroys or governors except by very extraordinary reasons; archbishops and bishops, seldom; ambassadors, never; military men, only as subordinates; nobles, without privileges; lastly, we were neither magistrates nor financiers, and hardly merchants. All this we had to accept in direct opposition to our institutions.\n\nThe Americans have risen suddenly and without previous preparation and without previous knowledge and, what is more deplorable, without experience in public affairs, to assume in the world the eminent dignity of legislators, magistrates, administrators of the public treasury, diplomats, generals and all the supreme and subordinate authorities which form the hierarchy of an organized state.\n\n... I desire more than anybody else to see the formation in America the greatest nation in the world, not so much as to its extension and wealth as to its glory and freedom.',
  lineNumbered: true,
  wordCount: 137,
};
