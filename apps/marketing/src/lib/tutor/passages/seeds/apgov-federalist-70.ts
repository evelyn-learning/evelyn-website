import type { Passage } from '../types';

/**
 * Alexander Hamilton, "Federalist No. 70" (1788). AP Gov Unit-2 core
 * document — the case for a unitary, energetic executive. First paragraph
 * covers "Energy in the Executive is a leading character in the definition
 * of good Government" and the four ingredients of executive energy (unity,
 * duration, adequate support, competent powers); second paragraph is the
 * unity argument ("decision, activity, secrecy, and dispatch") and the
 * plurality-destroys-accountability argument. Trimmed with internal
 * ellipses to stay within excerpt length; verbatim public-domain text
 * otherwise, verified against the Wikisource transcript.
 */
export const PASSAGE_APGOV_FEDERALIST_70: Passage = {
  id: 'evelyn.passage.apgov-federalist-70.v1',
  title: 'Federalist No. 70',
  author: 'Alexander Hamilton (Publius)',
  year: 1788,
  sourceUrl: 'https://en.wikisource.org/wiki/The_Federalist_Papers/No._70',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'There is an idea, which is not without its advocates, that a vigorous Executive is inconsistent with the genius of republican Government. ... Energy in the Executive is a leading character in the definition of good Government. It is essential to the protection of the community against foreign attacks; it is not less essential to the steady administration of the laws ... The ingredients which constitute energy in the Executive are, first, unity; secondly, duration; thirdly, an adequate provision for its support; fourthly, competent powers.\n\nThat unity is conducive to energy, will not be disputed. Decision, activity, secrecy, and despatch, will generally characterize the proceedings of one man, in a much more eminent degree than the proceedings of any greater number ... But one of the weightiest objections to a plurality in the Executive ... is, that it tends to conceal faults, and destroy responsibility.',
  lineNumbered: true,
  wordCount: 144,
};
