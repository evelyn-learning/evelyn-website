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
 *
 * 2026-10-14 (U3 DBQ re-read): the byline no longer names the architect as
 * author (he did not write this description) — like a visual DBQ source
 * line it names the patron and completion year, and the text is marked
 * "[VISUAL DOCUMENT — description]"; the closing interpretive
 * sentence and the "statement of power" clause were cut (they handed
 * students the analysis); the gate inscription
 * is the close of Surah al-Fajr (89), "enter My Paradise" — Surah Ya-Sin
 * and the "only signature" claim were removed (Amanat Khan also signed
 * inside the mausoleum). The tomb stands at the garden's riverside end,
 * not its center (the center holds a raised marble water tank).
 */
export const PASSAGE_APWORLD_TAJ_MAHAL: Passage = {
  id: 'evelyn.passage.apworld-taj-mahal.v1',
  title: 'The Taj Mahal, Agra (1632-1653)',
  author: 'Mughal emperor Shah Jahan (patron of the monument)',
  year: 1653,
  sourceUrl: 'https://whc.unesco.org/en/list/252/',
  license: 'public-domain',
  genre: 'political-cartoon',
  fullText:
    '[VISUAL DOCUMENT — description] The Taj Mahal, a white-marble mausoleum complex on the Yamuna river at Agra, built 1632-1653 by the Mughal emperor Shah Jahan for his wife Mumtaz Mahal, who died in 1631 giving birth to their fourteenth child. The domed tomb stands at the far, riverside end of a symmetrical charbagh, a four-quadrant "paradise garden" divided by long reflecting channels — a layout drawn from Quranic descriptions of paradise, so that the building and its grounds together stage the tomb as a gateway to Paradise. Four minarets frame the mausoleum at the corners of its marble plinth; a red-sandstone mosque and an identical "guest house" flank it in perfect bilateral symmetry, and a monumental red-sandstone gate bears Quranic verses in the calligrapher Amanat Khan\'s black marble inlaid into white, among them the close of Surah al-Fajr, which invites the righteous soul to "enter My Paradise." The undertaking was vast: a workforce estimated at more than 20,000 masons, marble-workers, mosaicists, and calligraphers labored for over two decades, at a contemporary cost estimated near 32 million rupees, drawing white marble from Makrana and semi-precious inlay stones from as far as Persia, Tibet, and Sri Lanka.',
  lineNumbered: false,
  wordCount: 195,
};
