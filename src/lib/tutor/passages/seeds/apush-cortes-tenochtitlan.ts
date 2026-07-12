import type { Passage } from '../types';

/**
 * Hernán Cortés, Second Letter to Charles V (October 30, 1520). APUSH
 * Period-1 DBQ document — Cortés's description of Tenochtitlan's causeways
 * and scale, and of the great market at Tlatelolco. Verbatim public-domain
 * excerpt, Francis Augustus MacNutt's 1908 translation ("Letters of Cortés",
 * vol. 1), from the Wikisource proofread transcription of the digitized
 * Hakluyt-Society-descended edition
 * (Letters_of_Cortes_to_Emperor_Charles_V_-_Vol_1.djvu, pages 280-281). Two
 * contiguous spans joined with an ellipsis: (1) the city's causeways and
 * comparison to Seville/Cordoba; (2) the great market's scale and goods.
 * Each span verified as a contiguous substring of the fetched Wikisource
 * source (wikitext markup for margin captions and page headers stripped
 * before comparison; whitespace normalized). A short run of the source
 * (marked {{sic}} by the Wikisource transcriber as printer's errors in the
 * 1908 edition itself, "haev"/"frmo") falls between the two spans and was
 * elided rather than quoted.
 */
export const PASSAGE_APUSH_CORTES_TENOCHTITLAN: Passage = {
  id: 'evelyn.passage.apush-cortes-tenochtitlan.v1',
  title: 'Second Letter to Charles V (on Tenochtitlan)',
  author: 'Hernán Cortés',
  year: 1520,
  sourceUrl:
    'https://en.wikisource.org/wiki/Letters_of_Cortes_to_Emperor_Charles_V_-_Vol_1/Second_Letter,_October_30,_1520',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'This great city of Temixtitan is built on the salt lake, and from the mainland to the city is a distance of two leagues, from any side from which you enter. It has four approaches by means of artificial causeways, two cavalry lances in width. The city is as large as Seville or Cordoba.\n\n' +
    '… The city has many squares where markets are held and trading is carried on. There is one square, twice as large as that of Salamanca, all surrounded by arcades, where there are daily more than sixty thousand souls, buying and selling, and where are found all the kinds of merchandise produced in these countries, including food products, jewels of gold and silver, lead, brass, copper, zinc, stone, bones, shells, and feathers.',
  lineNumbered: true,
  wordCount: 125,
};
