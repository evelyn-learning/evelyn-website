import type { Passage } from '../types';

/**
 * Alexander Hamilton, "Federalist No. 78" (1788). AP Gov Unit-2 core
 * document — the case for judicial review and life tenure. First paragraph
 * covers the judiciary as the "least dangerous" branch and the "neither
 * FORCE nor WILL, but merely judgment" argument; second paragraph is
 * permanent tenure as the guarantee of judicial independence and the
 * courts' duty to void acts contrary to the Constitution. Trimmed with
 * internal ellipses to stay within excerpt length; verbatim public-domain
 * text otherwise, verified against the Wikisource transcript.
 */
export const PASSAGE_APGOV_FEDERALIST_78: Passage = {
  id: 'evelyn.passage.apgov-federalist-78.v1',
  title: 'Federalist No. 78',
  author: 'Alexander Hamilton (Publius)',
  year: 1788,
  sourceUrl: 'https://en.wikisource.org/wiki/The_Federalist_Papers/No._78',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'Whoever attentively considers the different departments of power must perceive, that, in a government in which they are separated from each other, the judiciary, from the nature of its functions, will always be the least dangerous to the political rights of the Constitution ... The Executive not only dispenses the honors, but holds the sword of the community. The legislature not only commands the purse, but prescribes the rules by which the duties and rights of every citizen are to be regulated. The Judiciary, on the contrary, has no influence over either the sword or the purse; no direction either of the strength or of the wealth of the society; and can take no active resolution whatever. It may truly be said to have neither FORCE nor WILL, but merely judgment; and must ultimately depend upon the aid of the Executive arm even for the efficacy of its judgments.\n\n... nothing can contribute so much to its firmness and independence as permanency in office; this quality may therefore be justly regarded as an indispensable ingredient in its constitution ... No Legislative act, therefore, contrary to the Constitution, can be valid ... duty it must be to declare all Acts contrary to the manifest tenor of the Constitution void.',
  lineNumbered: true,
  wordCount: 207,
};
