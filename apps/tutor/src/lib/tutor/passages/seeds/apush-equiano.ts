import type { Passage } from '../types';

/**
 * Olaudah Equiano, "The Interesting Narrative of the Life of Olaudah
 * Equiano" (1789). APUSH Period-2 DBQ document — the Middle Passage, told
 * through Equiano's own first sight of a slave ship and his confinement
 * below deck. Verbatim public-domain excerpt, two contiguous spans joined by
 * an ellipsis (dropping one intervening sentence describing the crew's
 * appearance), from the raw Project Gutenberg text (#15399). MEASURED
 * SELECTION FOR RESTRAINT: this excerpt conveys terror, confinement, and
 * dehumanizing conditions (being handled and inspected like cargo, chained
 * captives, overpowering horror) entirely through Equiano's own
 * psychological account, and stops short of the narrative's later,
 * more graphic passages describing flogging, death, and bodily suffering
 * elsewhere in this chapter — deliberately excluded to keep the passage
 * exam-neutral while still conveying the reality of the Middle Passage. Each
 * span verified as a contiguous substring of the fetched Gutenberg text.
 */
export const PASSAGE_APUSH_EQUIANO: Passage = {
  id: 'evelyn.passage.apush-equiano.v1',
  title: 'The Interesting Narrative of the Life of Olaudah Equiano',
  author: 'Olaudah Equiano',
  year: 1789,
  sourceUrl: 'https://www.gutenberg.org/ebooks/15399',
  license: 'public-domain',
  genre: 'memoir',
  fullText:
    'The first object which saluted my eyes when I arrived on the coast was the sea, and a slave ship, which was then riding at anchor, and waiting for its cargo. These filled me with astonishment, which was soon converted into terror when I was carried on board. I was immediately handled and tossed up to see if I were sound by some of the crew; and I was now persuaded that I had gotten into a world of bad spirits, and that they were going to kill me. …\n\n' +
    'Indeed such were the horrors of my views and fears at the moment, that, if ten thousand worlds had been my own, I would have freely parted with them all to have exchanged my condition with that of the meanest slave in my own country. When I looked round the ship too and saw a large furnace or copper boiling, and a multitude of black people of every description chained together, every one of their countenances expressing dejection and sorrow, I no longer doubted of my fate; and, quite overpowered with horror and anguish, I fell motionless on the deck and fainted.',
  lineNumbered: true,
  wordCount: 192,
};
