import type { Passage } from '../types';

/**
 * President Harry S. Truman's address to a joint session of Congress,
 * March 12, 1947. APUSH Period-8 document — the speech announcing the
 * containment policy that came to bear his name, requesting aid for
 * Greece and Turkey and committing the United States to "support free
 * peoples who are resisting attempted subjugation by armed minorities or
 * by outside pressures." Excerpt is the doctrine's core statement (the
 * two-ways-of-life framing plus the three "I believe" commitments);
 * verbatim public-domain text (U.S. government work, 17 USC §105),
 * verified as a contiguous span against the Avalon Project's full-text
 * transcript of the address.
 */
export const PASSAGE_APUSH_TRUMAN_DOCTRINE: Passage = {
  id: 'evelyn.passage.apush-truman-doctrine.v1',
  title: "Address Before a Joint Session of Congress (Truman Doctrine)",
  author: 'Harry S. Truman',
  year: 1947,
  sourceUrl: 'https://avalon.law.yale.edu/20th_century/trudoc.asp',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'At the present moment in world history nearly every nation must choose between alternative ways of life. The choice is too often not a free one.\n\nOne way of life is based upon the will of the majority, and is distinguished by free institutions, representative government, free elections, guarantees of individual liberty, freedom of speech and religion, and freedom from political oppression.\n\nThe second way of life is based upon the will of a minority forcibly imposed upon the majority. It relies upon terror and oppression, a controlled press and radio; fixed elections, and the suppression of personal freedoms.\n\nI believe that it must be the policy of the United States to support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures.\n\nI believe that we must assist free peoples to work out their own destinies in their own way.\n\nI believe that our help should be primarily through economic and financial aid which is essential to economic stability and orderly political processes.',
  lineNumbered: true,
  wordCount: 168,
};
