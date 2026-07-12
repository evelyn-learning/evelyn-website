import type { Passage } from '../types';

/**
 * Jonathan Edwards, "Sinners in the Hands of an Angry God" (1741), preached
 * at Enfield during the First Great Awakening. APUSH Period-2 DBQ document —
 * a short, phrase-length span of the sermon's famous spider imagery, set
 * inside a longer argumentative excerpt built from the sermon's closing call
 * to awakening. Verbatim public-domain excerpt, three contiguous spans
 * joined by ellipses (the imagery is deliberately kept brief; the material
 * dropped between spans is further doctrinal argument and a list of
 * particular audiences addressed — ministers, young people, children —
 * omitted to keep the excerpt to its argumentative core), from the raw
 * Project Gutenberg text of "Selected Sermons of Jonathan Edwards" (ed. H.
 * Norman Gardiner, 1904; Gutenberg #34632). Each span verified as a
 * contiguous substring of the fetched source.
 */
export const PASSAGE_APUSH_EDWARDS_SINNERS: Passage = {
  id: 'evelyn.passage.apush-edwards-sinners.v1',
  title: 'Sinners in the Hands of an Angry God',
  author: 'Jonathan Edwards',
  year: 1741,
  sourceUrl: 'https://www.gutenberg.org/ebooks/34632',
  license: 'public-domain',
  genre: 'sermon',
  fullText:
    'The God that holds you over the pit of hell, much as one holds a spider or some loathsome insect over the fire, abhors you, and is dreadfully provoked; his wrath towards you burns like fire; …\n\n' +
    '… And now you have an extraordinary opportunity, a day wherein Christ has flung the door of mercy wide open, and stands in the door calling and crying with a loud voice to poor sinners; a day wherein many are flocking to him and pressing into the Kingdom of God. … Therefore let every one that is out of Christ now awake and fly from the wrath to come.',
  lineNumbered: true,
  wordCount: 106,
};
