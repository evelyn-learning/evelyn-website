import type { Passage } from '../types';

/**
 * Abraham Lincoln, the Emancipation Proclamation (January 1, 1863). APUSH
 * Period-5 document — the operative "shall be then, thenceforward, and
 * forever free" clause (quoted here from the proclamation's own recital of
 * its September 22, 1862 preliminary version) together with the January 1
 * order-and-declare clause and the closing military-necessity frame ("as a
 * fit and necessary war measure... warranted by the Constitution, upon
 * military necessity"). US government work (17 USC §105) — public domain
 * regardless of date. Verbatim excerpt; four contiguous spans joined by
 * ellipses to skip the intervening list of exempted states/parishes and
 * procedural clauses.
 */
export const PASSAGE_APUSH_EMANCIPATION_PROCLAMATION: Passage = {
  id: 'evelyn.passage.apush-emancipation-proclamation.v1',
  title: 'The Emancipation Proclamation',
  author: 'Abraham Lincoln',
  year: 1863,
  sourceUrl: 'https://www.archives.gov/milestone-documents/emancipation-proclamation',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'That on the first day of January, in the year of our Lord one thousand eight hundred and sixty-three, all persons held as slaves within any State or designated part of a State, the people whereof shall then be in rebellion against the United States, shall be then, thenceforward, and forever free;\n\n. . .\n\n' +
    'Now, therefore I, Abraham Lincoln, President of the United States, by virtue of the power in me vested as Commander-in-Chief, of the Army and Navy of the United States in time of actual armed rebellion against the authority and government of the United States, and as a fit and necessary war measure for suppressing said rebellion,\n\n. . .\n\n' +
    'I do order and declare that all persons held as slaves within said designated States, and parts of States, are, and henceforward shall be free; and that the Executive government of the United States, including the military and naval authorities thereof, will recognize and maintain the freedom of said persons.\n\n. . .\n\n' +
    'And upon this act, sincerely believed to be an act of justice, warranted by the Constitution, upon military necessity, I invoke the considerate judgment of mankind, and the gracious favor of Almighty God.',
  lineNumbered: true,
  wordCount: 191,
};
