import type { Passage } from '../types';

/**
 * The Taj Mahal (Agra, 1632-1653), commissioned by Mughal emperor Shah
 * Jahan as a mausoleum for his wife Mumtaz Mahal, who died in 1631. AP
 * World Unit-3 document of the VISUAL/monument type. Passage is text-only,
 * so fullText is a factual DESCRIPTION of the monument (as a visual DBQ
 * document is presented for analysis), not a photograph of it. Facts
 * (dates, workforce, cost, calligrapher) verified against the UNESCO World
 * Heritage Centre's inscription (Taj Mahal, ref. 252, inscribed 1983) and
 * corroborating standard reference accounts (Britannica, Smarthistory):
 * construction of the mausoleum proper ran 1632-1648, with the surrounding
 * garden, gateway, and outbuildings completing the whole complex by 1653;
 * the workforce is estimated at over 20,000 masons, marble-workers,
 * mosaicists, and decorators (UNESCO's justification for inscription
 * calls it "an international team of several thousands"); the contemporary
 * estimated cost was roughly 32 million rupees. This entry contains no
 * quoted text and carries no verbatim-fidelity risk.
 */
export const PASSAGE_APWORLD_TAJ_MAHAL: Passage = {
  id: 'evelyn.passage.apworld-taj-mahal.v1',
  title: 'The Taj Mahal (1632-1653) — Mughal Imperial Legitimacy in Stone',
  author: 'Ustad Ahmad Lahori (chief architect, under Shah Jahan)',
  year: 1653,
  sourceUrl: 'https://whc.unesco.org/en/list/252/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[VISUAL DOCUMENT — description] The Taj Mahal, a white-marble mausoleum complex on the Yamuna river at Agra, built 1632-1653 by the Mughal emperor Shah Jahan for his wife Mumtaz Mahal, who died in 1631 giving birth to their fourteenth child. A raised octagonal tomb chamber sits at the center of a symmetrical charbagh, a four-quadrant "paradise garden" divided by long reflecting channels — a layout drawn from Quranic descriptions of paradise, so that the building and its grounds together stage the tomb as a gateway to Paradise. Four minarets frame the mausoleum at the corners of its marble plinth; a red-sandstone mosque and an identical "guest house" flank it in perfect bilateral symmetry, and a monumental red-sandstone gate is inscribed with the calligrapher Amanat Khan\'s rendering of the Quranic Surah Ya-Sin and other verses on Judgment Day, in black marble inlaid into white — the only place in the complex where the calligrapher signed his own name. The scale of the undertaking was itself a statement of power: a workforce estimated at more than 20,000 masons, marble-workers, mosaicists, and calligraphers labored for over two decades, at a contemporary cost estimated near 32 million rupees, drawing white marble from Makrana and semi-precious inlay stones from as far as Persia, Tibet, and Sri Lanka. For a Mughal court whose legitimacy rested on Timurid descent, Persianate court culture, and Sunni Islamic patronage, the Taj Mahal converted dynastic grief into a permanent, empire-wide advertisement of the emperor\'s wealth, piety, and command over resources and skilled labor across the empire.',
  lineNumbered: false,
  wordCount: 255,
};
