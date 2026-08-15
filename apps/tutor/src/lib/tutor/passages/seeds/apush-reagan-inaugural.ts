import type { Passage } from '../types';

/**
 * President Ronald Reagan's First Inaugural Address, January 20, 1981.
 * APUSH Period-9 document — the speech that framed the conservative
 * resurgence's central diagnosis of the era's stagflation and its
 * governing philosophy. Excerpt is the doctrine's core statement (the
 * "government is not the solution to our problem; government is the
 * problem" line and its immediate defense/qualification). Verbatim
 * public-domain text (U.S. government work, 17 USC §105), verified as a
 * contiguous span against the Reagan Presidential Library's full-text
 * transcript of the address.
 */
export const PASSAGE_APUSH_REAGAN_INAUGURAL: Passage = {
  id: 'evelyn.passage.apush-reagan-inaugural.v1',
  title: 'First Inaugural Address',
  author: 'Ronald Reagan',
  year: 1981,
  sourceUrl: 'https://www.reaganlibrary.gov/archives/speech/inaugural-address-1981',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    "In this present crisis, government is not the solution to our problem; government is the problem. From time to time we've been tempted to believe that society has become too complex to be managed by self-rule, that government by an elite group is superior to government for, by, and of the people. Well, if no one among us is capable of governing himself, then who among us has the capacity to govern someone else? All of us together, in and out of government, must bear the burden. The solutions we seek must be equitable, with no one group singled out to pay a higher price.",
  lineNumbered: true,
  wordCount: 105,
};
