import type { Passage } from '../types';

/**
 * Jonathan Swift, "A Modest Proposal" (1729). The canonical satire/irony text
 * for AP English Language — used at the paragraph grain to teach how a writer's
 * persona, tone, and understatement create meaning distinct from the literal
 * claim. Verbatim public-domain opening (the earnest set-up before the ironic
 * proposal). Genre: satirical essay/pamphlet.
 */
export const PASSAGE_SWIFT_MODEST_PROPOSAL: Passage = {
  id: 'evelyn.passage.swift-modest-proposal.v1',
  title: 'A Modest Proposal',
  author: 'Jonathan Swift',
  year: 1729,
  sourceUrl: 'https://www.gutenberg.org/ebooks/1080',
  license: 'public-domain',
  genre: 'pamphlet',
  fullText:
    'It is a melancholy object to those, who walk through this great town, or travel in the country, when they see the streets, the roads, and cabbin-doors crowded with beggars of the female sex, followed by three, four, or six children, all in rags, and importuning every passenger for an alms. These mothers, instead of being able to work for their honest livelihood, are forced to employ all their time in stroling to beg sustenance for their helpless infants who, as they grow up, either turn thieves for want of work, or leave their dear native country, to fight for the Pretender in Spain, or sell themselves to the Barbadoes.\n\n' +
    'I think it is agreed by all parties, that this prodigious number of children in the arms, or on the backs, or at the heels of their mothers, and frequently of their fathers, is in the present deplorable state of the kingdom, a very great additional grievance; and therefore whoever could find out a fair, cheap and easy method of making these children sound and useful members of the commonwealth, would deserve so well of the publick, as to have his statue set up for a preserver of the nation.\n\n' +
    'But my intention is very far from being confined to provide only for the children of professed beggars: it is of a much greater extent, and shall take in the whole number of infants at a certain age, who are born of parents in effect as little able to support them, as those who demand our charity in the streets.\n\n' +
    'As to my own part, having turned my thoughts for many years upon this important subject, and maturely weighed the several schemes of our projectors, I have always found them grossly mistaken in their computation. It is true, a child just dropt from its dam, may be supported by her milk, for a solar year, with little other nourishment: at most not above the value of two shillings, which the mother may certainly get, or the value in scraps, by her lawful occupation of begging; and it is exactly at one year old that I propose to provide for them.',
  lineNumbered: true,
  wordCount: 360,
};
