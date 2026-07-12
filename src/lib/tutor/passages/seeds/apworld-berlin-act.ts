import type { Passage } from '../types';

/**
 * General Act of the Berlin Conference on West Africa (26 February 1885).
 * Verbatim public-domain treaty text, the official English translation as
 * signed by the United Kingdom, France, Germany, Austria-Hungary, Belgium,
 * Denmark, Spain, the United States, Italy, the Netherlands, Portugal,
 * Russia, Sweden-Norway, and the Ottoman Empire, reproduced from the
 * scholarly treaty archive at loveman.sdsu.edu (San Diego State University).
 * AP World Unit-6 document: two of the Act's operative clauses — Article 5
 * (the free-trade / no-monopoly rule for the Congo basin) and the Chapter VI
 * "effective occupation" declaration (Articles 34-35) requiring notification
 * and the actual establishment of authority before a new African coastal
 * claim would be recognized by the other powers. These two clauses are the
 * ones AP World courses cite to explain how Berlin regulated, without
 * itself carrying out, the Scramble for Africa. The omitted middle portion
 * (Articles 6-33) covers native-protection, postal, navigation-commission,
 * and slave-trade provisions; ellipsis marks the cut.
 */
export const PASSAGE_APWORLD_BERLIN_ACT: Passage = {
  id: 'evelyn.passage.apworld-berlin-act.v1',
  title: 'General Act of the Berlin Conference on West Africa (1885)',
  author: 'Plenipotentiaries of the Berlin Conference',
  year: 1885,
  sourceUrl: 'https://loveman.sdsu.edu/docs/1885GeneralActBerlinConference.pdf',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'Article 5\n\nNo Power which exercises or shall exercise sovereign rights in the abovementioned regions shall be allowed to grant therein a monopoly or favour of any kind in matters of trade.\n\n[...]\n\nCHAPTER VI\n\nDECLARATION RELATIVE TO THE ESSENTIAL CONDITIONS TO BE OBSERVED IN ORDER THAT NEW OCCUPATIONS ON THE COASTS OF THE AFRICAN CONTINENT MAY BE HELD TO BE EFFECTIVE\n\nArticle 34\n\nAny Power which henceforth takes possession of a tract of land on the coasts of the African continent outside of its present possessions, or which, being hitherto without such possessions, shall acquire them, as well as the Power which assumes a Protectorate there, shall accompany the respective act with a notification thereof, addressed to the other Signatory Powers of the present Act, in order to enable them, if need be, to make good any claims of their own.\n\nArticle 35\n\nThe Signatory Powers of the present Act recognize the obligation to insure the establishment of authority in the regions occupied by them on the coasts of the African continent sufficient to protect existing rights, and, as the case may be, freedom of trade and of transit under the conditions agreed upon.',
  lineNumbered: true,
  wordCount: 159,
};
