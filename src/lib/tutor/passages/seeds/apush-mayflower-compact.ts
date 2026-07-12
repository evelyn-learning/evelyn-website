import type { Passage } from '../types';

/**
 * The Mayflower Compact (1620), signed aboard the Mayflower by 41 adult male
 * passengers before landing at Cape Cod. APUSH Period-2 DBQ document — an
 * early instance of colonists covenanting together to form a "civil Body
 * Politick" and submit to self-made laws, absent a royal charter covering
 * their landing site. Full operative text of the compact (its complete short
 * body, excluding the signatures list), verbatim public-domain, from the
 * Avalon Project at Yale Law School's transcription of the 1620 document.
 * Verified as a contiguous substring of the fetched Avalon page text (stray
 * spaces introduced by anchor-tag stripping around linked proper nouns, e.g.
 * "King James", "Great Britain", removed as an HTML-extraction artifact, not
 * a content change).
 */
export const PASSAGE_APUSH_MAYFLOWER_COMPACT: Passage = {
  id: 'evelyn.passage.apush-mayflower-compact.v1',
  title: 'The Mayflower Compact',
  author: 'Signers of the Mayflower (led by John Carver, William Bradford, et al.)',
  year: 1620,
  sourceUrl: 'https://avalon.law.yale.edu/17th_century/mayflower.asp',
  license: 'public-domain',
  genre: 'constitution',
  fullText:
    'IN THE NAME OF GOD, AMEN. We, whose names are underwritten, the Loyal Subjects of our dread Sovereign Lord King James, by the Grace of God, of Great Britain, France, and Ireland, King, Defender of the Faith, &c. Having undertaken for the Glory of God, and Advancement of the Christian Faith, and the Honour of our King and Country, a Voyage to plant the first Colony in the northern Parts of Virginia; Do by these Presents, solemnly and mutually, in the Presence of God and one another, covenant and combine ourselves together into a civil Body Politick, for our better Ordering and Preservation, and Furtherance of the Ends aforesaid: And by Virtue hereof do enact, constitute, and frame, such just and equal Laws, Ordinances, Acts, Constitutions, and Officers, from time to time, as shall be thought most meet and convenient for the general Good of the Colony; unto which we promise all due Submission and Obedience. IN WITNESS whereof we have hereunto subscribed our names at Cape-Cod the eleventh of November, in the Reign of our Sovereign Lord King James, of England, France, and Ireland, the eighteenth, and of Scotland the fifty-fourth, Anno Domini; 1620.',
  lineNumbered: true,
  wordCount: 195,
};
