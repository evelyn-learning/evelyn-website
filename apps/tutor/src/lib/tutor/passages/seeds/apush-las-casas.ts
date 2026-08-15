import type { Passage } from '../types';

/**
 * Bartolomé de las Casas, "A Brief Account of the Destruction of the Indies"
 * (Spanish orig. 1552, describing events of 1542 and after). APUSH Period-1
 * DBQ document — measured excerpt on the encomienda-style distribution of
 * native laborers and Las Casas's own closing thesis on Spanish motives (no
 * graphic spans). Verbatim public-domain excerpt, the 1699 English
 * translation "Popery Truly Display'd in its Bloody Colours" (Project
 * Gutenberg #20321, the only complete English-translation PD text of this
 * work). Three contiguous spans joined with ellipses: (1)+(2) the
 * distribution of natives among Spanish masters and their forced labor in
 * the mines and fields (main narrative), and (3) the Author's Epilogue
 * stating that the Spaniards' true motive was avarice, not faith or service
 * to the Crown. Each span verified as a contiguous substring of the fetched
 * Gutenberg text (whitespace/italics-markup normalized); the graphic
 * mid-paragraph material on infant deaths that follows span (2) in the
 * source was deliberately elided per the measured-tone constraint.
 */
export const PASSAGE_APUSH_LAS_CASAS: Passage = {
  id: 'evelyn.passage.apush-las-casas.v1',
  title: 'A Brief Account of the Destruction of the Indies',
  author: 'Bartolomé de las Casas',
  year: 1542,
  sourceUrl: 'https://www.gutenberg.org/ebooks/20321',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'The Warlike Engagements being over, and the Inhabitants all swept away, they divided among themselves the Young Men, Women, and Children reserved promiscuously for that purpose, one obtained thirty, another forty, to this Man one hundred were disposed, to the other two hundred, and the more one was in favor with the domineering Tyrant (which they styled Governor) the more he became Master of, upon this pretence, and with this Proviso, that he should see them instructed in the Catholick Religion … And this was the great care they had of them, they sent the Males to the Mines to dig and bring away the Gold, which is an intollerable labor; but the Women they made use of to Manure and Till the ground, which is a toil most irksome even to Men of the strongest and most robust constitutions.\n\n' +
    '… The Spaniards first set Sail to America, not for the Honour of God, or as Persons moved and merited thereunto by servent Zeal to the True Faith, nor to promote the Salvation of their Neighbours, nor to serve the King, as they falsely boast and pretend to do, but in truth, only stimulated and goaded on by insatiable Avarice and Ambition, that they might for ever Domineer, Command, and Tyrannize over the West-Indians, whose Kingdoms they hoped to divide and distribute among themselves.',
  lineNumbered: true,
  wordCount: 222,
};
