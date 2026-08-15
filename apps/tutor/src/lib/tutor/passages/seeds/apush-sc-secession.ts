import type { Passage } from '../types';

/**
 * South Carolina, Declaration of the Immediate Causes Which Induce and
 * Justify the Secession of South Carolina from the Federal Union (December
 * 24, 1860). APUSH Period-5 document — the secession convention's own
 * stated reasoning, presented here as a historical primary source: it names
 * slavery explicitly as the institution the non-slaveholding states had
 * denounced and undermined. Measured, factual framing; verbatim
 * public-domain excerpt (pre-1929); single contiguous paragraph, no
 * elision. (The source transcription reads "have assume the right," an
 * uncorrected artifact of the original document, reproduced verbatim.)
 */
export const PASSAGE_APUSH_SC_SECESSION: Passage = {
  id: 'evelyn.passage.apush-sc-secession.v1',
  title: 'Declaration of the Immediate Causes of Secession',
  author: 'South Carolina Secession Convention',
  year: 1860,
  sourceUrl: 'https://avalon.law.yale.edu/19th_century/csa_scarsec.asp',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'We affirm that these ends for which this Government was instituted have been defeated, and the Government itself has been made destructive of them by the action of the non-slaveholding States. Those States have assume the right of deciding upon the propriety of our domestic institutions; and have denied the rights of property established in fifteen of the States and recognized by the Constitution ; they have denounced as sinful the institution of slavery; they have permitted open establishment among them of societies, whose avowed object is to disturb the peace and to eloign the property of the citizens of other States. They have encouraged and assisted thousands of our slaves to leave their homes; and those who remain, have been incited by emissaries, books and pictures to servile insurrection.',
  lineNumbered: true,
  wordCount: 130,
};
