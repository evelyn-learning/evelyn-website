import type { Passage } from '../types';

/**
 * Lin Zexu, letter to Queen Victoria (1839), on the opium trade. Verbatim
 * public-domain translation excerpt from the Chinese Repository, vol. 8
 * (Feb. 1840), pp. 497-503 (the standard 19th-century English translation of
 * Lin's letter), as reprinted in the Internet History Sourcebooks Project
 * (Fordham University), "Commissioner Lin: Letter to Queen Victoria, 1839."
 * AP World Unit-6 document: Lin, the Qing imperial commissioner sent to
 * suppress the opium trade at Canton, appeals to Britain's own domestic
 * prohibition of opium and to the mutual dependence of Anglo-Chinese trade
 * (tea, rhubarb, silk) to argue that Britain should not profit by exporting
 * a drug it forbids at home — a measured statement of the moral case against
 * the opium trade on the eve of the First Opium War, not a summary of its
 * outcome.
 */
export const PASSAGE_APWORLD_LIN_ZEXU: Passage = {
  id: 'evelyn.passage.apworld-lin-zexu.v1',
  title: 'Commissioner Lin: Letter to Queen Victoria (1839)',
  author: 'Lin Zexu (Chinese Repository translation)',
  year: 1839,
  sourceUrl: 'https://sourcebooks.fordham.edu/mod/1839lin2.asp',
  license: 'public-domain',
  genre: 'letter',
  fullText:
    'We have heard that in your own country opium is prohibited with the utmost strictness and severity:---this is a strong proof that you know full well how hurtful it is to mankind. Since then you do not permit it to injure your own country, you ought not to have the injurious drug transferred to another country, and above all others, how much less to the Inner Land! Of the products which China exports to your foreign countries, there is not one which is not beneficial to mankind in some shape or other. There are those which serve for food, those which are useful, and those which are calculated for re-sale; but all are beneficial. Has China (we should like to ask) ever yet sent forth a noxious article from its soil? Not to speak of our tea and rhubarb, things which your foreign countries could not exist a single day without, if we of the Central Land were to grudge you what is beneficial, and not to compassionate your wants, then wherewithal could you foreigners manage to exist?',
  lineNumbered: true,
  wordCount: 178,
};
