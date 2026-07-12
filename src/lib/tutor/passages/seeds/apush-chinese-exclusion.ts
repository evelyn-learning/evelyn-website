import type { Passage } from '../types';

/**
 * Chinese Exclusion Act (May 6, 1882), ch. 126, 22 Stat. 58. APUSH Period-6
 * document — the operative Section 1 text suspending the immigration of
 * Chinese laborers for ten years. US-government work (17 USC §105); public
 * domain regardless of date. Verbatim excerpt, a single contiguous span,
 * transcribed from the National Archives' milestone-documents transcript
 * and cross-checked against the Wikisource transcription of the statute
 * (Forty-Seventh Congress, Session I, Chapter 126) — the two sources agree
 * on this passage aside from immaterial comma placement.
 */
export const PASSAGE_APUSH_CHINESE_EXCLUSION: Passage = {
  id: 'evelyn.passage.apush-chinese-exclusion.v1',
  title: 'Chinese Exclusion Act',
  author: 'United States Congress',
  year: 1882,
  sourceUrl: 'https://www.archives.gov/milestone-documents/chinese-exclusion-act',
  license: 'public-domain',
  genre: 'document',
  fullText:
    'Be it enacted by the Senate and House of Representatives of the United States of America in Congress assembled, That from and after the expiration of ninety days next after the passage of this act, and until the expiration of ten years next after the passage of this act, the coming of Chinese laborers to the United States be, and the same is hereby, suspended; and during such suspension it shall not be lawful for any Chinese laborer to come, or having so come after the expiration of said ninety days to remain within the United States.',
  lineNumbered: true,
  wordCount: 97,
};
