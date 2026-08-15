import type { Passage } from '../types';

/**
 * President Barack Obama's First Inaugural Address, January 20, 2009.
 * APUSH Period-9 document — delivered amid the 2008 financial crisis
 * and two ongoing wars. Excerpt is the crisis-and-renewal framing: the
 * paragraph naming the crisis (war on terror, weakened economy, lost
 * homes and jobs) paired with the later paragraph pivoting to renewal
 * and resolve ("begin again the work of remaking America"); a
 * substantial non-contiguous span between the two is elided (marked
 * with an ellipsis paragraph). Verbatim public-domain text (U.S.
 * government work, 17 USC §105), verified as contiguous spans against
 * the Obama White House Archives' full-text transcript of the address.
 */
export const PASSAGE_APUSH_OBAMA_INAUGURAL: Passage = {
  id: 'evelyn.passage.apush-obama-inaugural.v1',
  title: "President Barack Obama's Inaugural Address",
  author: 'Barack Obama',
  year: 2009,
  sourceUrl:
    'https://obamawhitehouse.archives.gov/blog/2009/01/21/president-barack-obamas-inaugural-address',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    "That we are in the midst of crisis is now well understood. Our nation is at war against a far-reaching network of violence and hatred. Our economy is badly weakened, a consequence of greed and irresponsibility on the part of some, but also our collective failure to make hard choices and prepare the nation for a new age. Homes have been lost, jobs shed, businesses shuttered. Our health care is too costly, our schools fail too many -- and each day brings further evidence that the ways we use energy strengthen our adversaries and threaten our planet.\n\n...\n\nThis is the journey we continue today. We remain the most prosperous, powerful nation on Earth. Our workers are no less productive than when this crisis began. Our minds are no less inventive, our goods and services no less needed than they were last week, or last month, or last year. Our capacity remains undiminished. But our time of standing pat, of protecting narrow interests and putting off unpleasant decisions -- that time has surely passed. Starting today, we must pick ourselves up, dust ourselves off, and begin again the work of remaking America.",
  lineNumbered: true,
  wordCount: 191,
};
