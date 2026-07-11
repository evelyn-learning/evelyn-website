import type { Passage } from '../types';

/**
 * The Articles of Confederation (drafted by the Second Continental Congress
 * 1777, ratified 1781) — AP Gov's last unseeded required foundational
 * document. Excerpt centers on the four weaknesses AP tests: Article II
 * (state sovereignty retained), Article III (a "firm league of friendship"
 * rather than a national government), Article VIII (no federal taxing
 * power — expenses requisitioned from the states), and Article XIII
 * (unanimous state consent required to amend). Trimmed with internal
 * ellipses to stay within excerpt length; verbatim public-domain text
 * otherwise, verified against the National Archives transcript.
 */
export const PASSAGE_APGOV_ARTICLES_CONFEDERATION: Passage = {
  id: 'evelyn.passage.apgov-articles-confederation.v1',
  title: 'Articles of Confederation',
  author: 'Second Continental Congress',
  year: 1781,
  sourceUrl: 'https://www.archives.gov/milestone-documents/articles-of-confederation',
  license: 'public-domain',
  genre: 'constitution',
  fullText:
    'Article II. Each state retains its sovereignty, freedom and independence, and every power, jurisdiction and right, which is not by this confederation expressly delegated to the United States, in Congress assembled.\n\nArticle III. The said states hereby severally enter into a firm league of friendship with each other, for their common defence, the security of their liberties, and their mutual and general welfare ... against all force offered to, or attacks made upon them, on account of religion, sovereignty, trade, or any other pretence whatever.\n\nArticle VIII. All charges of war, and all other expenses that shall be incurred for the common defence or general welfare ... shall be defrayed out of a common treasury, which shall be supplied by the several states, in proportion to the value of all land within each state.\n\nArticle XIII. The Articles of this confederation shall be inviolably observed by every state, and the union shall be perpetual; nor shall any alteration at any time hereafter be made in any of them; unless such alteration be agreed to in a congress of the united states, and be afterwards confirmed by the legislatures of every state.',
  lineNumbered: true,
  wordCount: 188,
};
