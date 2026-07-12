import type { Passage } from '../types';

/**
 * Described visual-document stimulus (photograph set) for AP World Unit-8:
 * the Berlin Wall, 1961-1989. Passage is text-only, so fullText is a
 * factual DESCRIPTION of three widely reproduced photographs + captions
 * (how a visual DBQ document is presented for analysis), not the images
 * themselves - mirrors the described-visual pattern used for the Catalan
 * Atlas. Facts (construction beginning August 13, 1961; Checkpoint Charlie
 * as the best-known Allied crossing point on Friedrichstrasse; the wall's
 * opening on the night of November 9, 1989, after an East German
 * government announcement of open travel) are the well-documented public
 * record, consistent with the Berlin Wall Memorial's own exhibition on the
 * period.
 */
export const PASSAGE_APWORLD_BERLIN_WALL_VISUAL: Passage = {
  id: 'evelyn.passage.apworld-berlin-wall-visual.v1',
  title: 'The Berlin Wall, 1961–1989 (photograph set)',
  author: 'Berlin Wall Memorial (Stiftung Berliner Mauer)',
  year: 2026,
  sourceUrl:
    'https://www.stiftung-berliner-mauer.de/en/berlin-wall-memorial/visit/exhibitions/indoor-exhibition-1961-1989-berlin-wall',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[VISUAL DOCUMENT — description] A set of three widely reproduced photographs from the Berlin Wall Memorial\'s exhibition on the Wall\'s history. The first, dated August 13, 1961, shows East German soldiers and police laying rolls of barbed wire and building the first crude barrier across streets and rail lines dividing East and West Berlin, sealing the border overnight; the caption notes the barrier was progressively rebuilt in concrete over the following years. The second shows the checkpoint sign "You are leaving the American Sector" at Checkpoint Charlie, the best-known Allied crossing point on Friedrichstrasse, with American and Soviet-bloc guard posts facing each other across the line. The third, dated November 9, 1989, shows crowds of East and West Berliners standing atop the Wall near the Brandenburg Gate the night border guards opened the crossings, after an East German government spokesman announced that citizens could travel freely; in the days that followed, civilians began chipping away sections of the Wall by hand. Together the three images frame the Wall\'s history from erection to breach.',
  lineNumbered: false,
  wordCount: 173,
};
