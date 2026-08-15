import type { Passage } from '../types';

/**
 * President John F. Kennedy's Inaugural Address, January 20, 1961. APUSH
 * Period-8 document — the Cold War generational-torch speech. Excerpt
 * combines the "pay any price, bear any burden" pledge (from the section
 * addressed to allies and adversaries) with the closing "ask not what
 * your country can do for you" appeal; the two sentences are widely
 * separated in the delivered address, so the elision is marked with an
 * ellipsis. Each segment is verbatim public-domain text (U.S. government
 * work, 17 USC §105), verified independently as a contiguous span
 * against the Avalon Project's full-text transcript of the address.
 */
export const PASSAGE_APUSH_JFK_INAUGURAL: Passage = {
  id: 'evelyn.passage.apush-jfk-inaugural.v1',
  title: 'Inaugural Address',
  author: 'John F. Kennedy',
  year: 1961,
  sourceUrl: 'https://avalon.law.yale.edu/20th_century/kennedy.asp',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'Let every nation know, whether it wishes us well or ill, that we shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe, in order to assure the survival and the success of liberty.\n\n...\n\nAnd so, my fellow Americans: ask not what your country can do for you--ask what you can do for your country. My fellow citizens of the world: ask not what America will do for you, but what together we can do for the freedom of man.',
  lineNumbered: true,
  wordCount: 86,
};
