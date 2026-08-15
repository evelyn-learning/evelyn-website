import type { Passage } from '../types';

/**
 * Franklin D. Roosevelt, First Inaugural Address (March 4, 1933). APUSH
 * Period-7 document — the "the only thing we have to fear is fear itself"
 * passage plus, later in the same address, the "action, and action now"
 * call to put people to work, framing the bold, active federal-government
 * posture that would become the New Deal. US-government work (17 USC
 * §105); public domain regardless of date. Verbatim excerpt in two
 * contiguous spans from different paragraphs of the same address, joined
 * with an ellipsis, each verified separately, transcribed from The
 * American Presidency Project's full-text transcript. Note: the phrase
 * "bold, persistent experimentation" is from FDR's 1932 Oglethorpe
 * University address, NOT this inaugural — it is not quoted here; only
 * this address's own "action, and action now" language is attributed to
 * this document.
 */
export const PASSAGE_APUSH_FDR_FIRST_INAUGURAL: Passage = {
  id: 'evelyn.passage.apush-fdr-first-inaugural.v1',
  title: 'First Inaugural Address',
  author: 'Franklin D. Roosevelt',
  year: 1933,
  sourceUrl: 'https://www.presidency.ucsb.edu/documents/inaugural-address-8',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'So, first of all, let me assert my firm belief that the only thing we have to fear is fear itself—nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance. ... This Nation is asking for action, and action now. Our greatest primary task is to put people to work. This is no unsolvable problem if we face it wisely and courageously. It can be accomplished in part by direct recruiting by the Government itself, treating the task as we would treat the emergency of a war, but at the same time, through this employment, accomplishing greatly needed projects to stimulate and reorganize the use of our great natural resources.',
  lineNumbered: true,
  wordCount: 112,
};
