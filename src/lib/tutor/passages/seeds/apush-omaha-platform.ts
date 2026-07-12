import type { Passage } from '../types';

/**
 * People's (Populist) Party, Omaha Platform (July 4, 1892). APUSH Period-6
 * document — the preamble's "verge of ruin" indictment plus three of the
 * platform's core demands (sub-treasury/currency reform, free silver, and
 * government ownership of railroads). Verbatim public-domain excerpt in
 * three segments, each independently verified as a contiguous span of the
 * source; internal cuts (skipping the preamble's middle paragraphs and the
 * platform's other numbered planks) are marked with ellipses. Transcribed
 * from Wikisource, whose text is itself sourced to History Matters (George
 * Mason University).
 */
export const PASSAGE_APUSH_OMAHA_PLATFORM: Passage = {
  id: 'evelyn.passage.apush-omaha-platform.v1',
  title: "Omaha Platform (People's Party Platform)",
  author: "People's Party (Populist Party) of America",
  year: 1892,
  sourceUrl: 'https://en.wikisource.org/wiki/Omaha_Platform',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'The conditions which surround us best justify our co-operation; we meet in the midst of a nation brought to the verge of moral, political, and material ruin. Corruption dominates the ballot-box, the Legislatures, the Congress, and touches even the ermine of the bench.\n\n' +
    "FINANCE.—We demand a national currency, safe, sound, and flexible, issued by the general government only, a full legal tender for all debts, public and private, and that without the use of banking corporations, a just, equitable, and efficient means of distribution direct to the people, at a tax not to exceed 2 per cent. per annum, to be provided as set forth in the sub-treasury plan of the Farmers' Alliance, or a better system; also by payments in discharge of its obligations for public improvements. ... We demand free and unlimited coinage of silver and gold at the present legal ratio of 16 to 1.\n\n" +
    'TRANSPORTATION—Transportation being a means of exchange and a public necessity, the government should own and operate the railroads in the interest of the people.',
  lineNumbered: true,
  wordCount: 171,
};
