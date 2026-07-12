import type { Passage } from '../types';

/**
 * Theodore Roosevelt, Fourth Annual Message to Congress (December 6, 1904).
 * APUSH Period-7 document — the "Roosevelt Corollary" to the Monroe
 * Doctrine, asserting that chronic wrongdoing by a Western Hemisphere
 * nation "may force the United States ... to the exercise of an
 * international police power." US-government work (17 USC §105); public
 * domain regardless of date. Verbatim excerpt in three contiguous spans
 * from the same paragraph, joined with ellipses (the elided sentence is a
 * transitional clause about a country's "hearty friendship" that adds no
 * substantive claim), transcribed from The American Presidency Project's
 * full-text transcript of the message. Note: attribute to this excerpt
 * only the corollary/police-power claim it contains — the message's later
 * discussion of Santo Domingo and customs receivership (unseeded) is the
 * student's own outside evidence, not this document's content.
 */
export const PASSAGE_APUSH_ROOSEVELT_COROLLARY: Passage = {
  id: 'evelyn.passage.apush-roosevelt-corollary.v1',
  title: 'Fourth Annual Message to Congress',
  author: 'Theodore Roosevelt',
  year: 1904,
  sourceUrl: 'https://www.presidency.ucsb.edu/documents/fourth-annual-message-15',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'It is not true that the United States feels any land hunger or entertains any projects as regards the other nations of the Western Hemisphere save such as are for their welfare. ... Chronic wrongdoing, or an impotence which results in a general loosening of the ties of civilized society, may in America, as elsewhere, ultimately require intervention by some civilized nation, and in the Western Hemisphere the adherence of the United States to the Monroe Doctrine may force the United States, however reluctantly, in flagrant cases of such wrongdoing or impotence, to the exercise of an international police power. If every country washed by the Caribbean Sea would show the progress in stable and just civilization which with the aid of the Platt amendment Cuba has shown since our troops left the island, and which so many of the republics in both Americas are constantly and brilliantly showing, all question of interference by this Nation with their affairs would be at an end.',
  lineNumbered: true,
  wordCount: 163,
};
