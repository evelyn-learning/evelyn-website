import type { Passage } from '../types';

/**
 * John Winthrop, "A Model of Christian Charity" (1630), a lay sermon
 * delivered aboard the Arbella to the Puritan settlers of the Massachusetts
 * Bay Colony. APUSH Period-2 DBQ document — the covenant framing ("We are
 * entered into Covenant with Him for this worke") and the "citty upon a
 * hill" charge that New England's fate would be watched by "the eies of all
 * people." Verbatim public-domain excerpt, three contiguous spans joined by
 * ellipses (dropping an intervening sentence on the specifics of the
 * commission, and the transition into the sermon's closing exhortation from
 * Deuteronomy), from the period transcription hosted by the Hanover
 * Historical Texts Project. Each span verified as a contiguous substring of
 * the fetched source (early-modern orthography, e.g. "wee", "haue", "citty",
 * preserved exactly as rendered).
 */
export const PASSAGE_APUSH_WINTHROP_CHARITY: Passage = {
  id: 'evelyn.passage.apush-winthrop-charity.v1',
  title: 'A Model of Christian Charity',
  author: 'John Winthrop',
  year: 1630,
  sourceUrl: 'https://history.hanover.edu/texts/winthmod.html',
  license: 'public-domain',
  genre: 'sermon',
  fullText:
    'We are entered into Covenant with Him for this worke. … Now if the Lord shall please to heare us, and bring us in peace to the place we desire, then hath hee ratified this covenant and sealed our Commission, and will expect a strict performance of the articles contained in it; but if wee shall neglect the observation of these articles which are the ends wee have propounded, and, dissembling with our God, shall fall to embrace this present world and prosecute our carnall intentions, seeking greate things for ourselves and our posterity, the Lord will surely breake out in wrathe against us; be revenged of such a [sinful] people and make us knowe the price of the breache of such a covenant.\n\n' +
    '… For wee must consider that wee shall be as a citty upon a hill. The eies of all people are uppon us. Soe that if wee shall deale falsely with our God in this worke wee haue undertaken, and soe cause him to withdrawe his present help from us, wee shall be made a story and a by-word through the world.',
  lineNumbered: true,
  wordCount: 186,
};
