import type { Passage } from '../types';

/**
 * The Codex Mendoza (c. 1541), tribute section. APUSH Period-1 DBQ document
 * of the VISUAL type. Since Passage is text-only, fullText is a factual
 * description of the tribute folios + their organization and numeral
 * notation (the standard way a visual/pictorial DBQ document is presented
 * for analysis), not the image itself — mirrors the described-visual
 * pattern used for "Join, or Die" (apush-join-or-die.ts). Facts (province
 * count, tribute-item categories, numeral values, provenance) verified
 * against the manuscript's Bodleian Library catalogue record and standard
 * secondary descriptions of its three sections while authoring; no text is
 * quoted from the codex itself (it is pictorial, with Nahuatl and Spanish
 * glosses added later — there is no English "verbatim" to quote).
 */
export const PASSAGE_APUSH_CODEX_MENDOZA: Passage = {
  id: 'evelyn.passage.apush-codex-mendoza.v1',
  title: 'Codex Mendoza, tribute section (pictorial manuscript)',
  author: 'Aztec tlacuiloque (scribe-painters), commissioned by Viceroy Antonio de Mendoza',
  year: 1541,
  sourceUrl: 'https://digital.bodleian.ox.ac.uk/objects/2fea788e-2aa2-4f08-b6d9-648c00486220/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    "[VISUAL DOCUMENT — description] A pictorial manuscript commissioned around 1541 by Antonio de Mendoza, first Spanish viceroy of New Spain, and painted by Aztec tlacuiloque (scribe-painters) trained at the Franciscan Colegio de Santa Cruz de Tlatelolco, intended as a gift for Emperor Charles V explaining Aztec history and government to Spanish readers. The manuscript has three sections: a pictorial history of Mexica conquests and rulers from the founding of Tenochtitlan (1325) to the Spanish conquest (1521); a tribute list recording what roughly three dozen conquered provinces of the Aztec (Triple Alliance) empire owed their rulers; and an ethnographic account of daily Aztec life from infancy through old age. In the tribute section, each folio is headed by the place-glyphs of a province's head town and subject towns, followed by rows of the goods it owed at set intervals: bundles of woven cotton mantles (mantas) of specified patterns, quilted cotton warrior costumes and shields, strings of feathers, bins of cacao beans, loads of maize and other foodstuffs, and, from a few provinces, raw materials such as gold dust or precious stones. Quantities are given in the Mesoamerican vigesimal (base-20) tally system used throughout the manuscript: a dot for one, a flag for twenty, a stylized feather for four hundred, and a small bag for eight thousand, so that a folio combining flags and feathers records tribute running into the thousands of units. The finished manuscript never reached Charles V — the ship carrying it was taken by French privateers, and it passed through the hands of the French royal cosmographer André Thevet and the English geographer Richard Hakluyt before entering the library of the antiquarian John Selden, whose bequest brought it to the Bodleian Library at Oxford in 1659, where the original is held today as MS. Arch. Selden. A. 1.",
  lineNumbered: false,
  wordCount: 300,
};
