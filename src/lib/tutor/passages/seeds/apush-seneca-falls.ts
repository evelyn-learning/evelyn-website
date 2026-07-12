import type { Passage } from '../types';

/**
 * Elizabeth Cady Stanton (principal author), Declaration of Sentiments,
 * Seneca Falls Convention (July 19-20, 1848). APUSH Period-4 document — the
 * Declaration of Independence's frame repurposed for women's rights, plus
 * the opening of the grievance list. Verbatim public-domain excerpt; two
 * contiguous spans joined by an ellipsis to skip the intervening paragraph.
 */
export const PASSAGE_APUSH_SENECA_FALLS: Passage = {
  id: 'evelyn.passage.apush-seneca-falls.v1',
  title: 'Declaration of Sentiments',
  author: 'Elizabeth Cady Stanton and the Seneca Falls Convention',
  year: 1848,
  sourceUrl: 'https://www.nps.gov/wori/learn/historyculture/declaration-of-sentiments.htm',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'We hold these truths to be self-evident; that all men and women are created equal; that they are endowed by their Creator with certain inalienable rights; that among these are life, liberty, and the pursuit of happiness; that to secure these rights governments are instituted, deriving their just powers from the consent of the governed.\n\n. . .\n\nSuch has been the patient sufferance of the women under this government, and such is now the necessity which constrains them to demand the equal station to which they are entitled. The history of mankind is a history of repeated injuries and usurpations on the part of man toward woman, having in direct object the establishment of an absolute tyranny over her. To prove this, let facts be submitted to a candid world. He has never permitted her to exercise her inalienable right to the elective franchise. He has compelled her to submit to laws, in the formation of which she had no voice.',
  lineNumbered: true,
  wordCount: 162,
};
