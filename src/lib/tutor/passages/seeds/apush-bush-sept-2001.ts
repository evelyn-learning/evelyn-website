import type { Passage } from '../types';

/**
 * President George W. Bush's address before a joint session of Congress
 * on the United States' response to the September 11 terrorist attacks,
 * September 20, 2001. APUSH Period-9 document — the speech that framed
 * the war on terror. Excerpt is deliberately measured and factual: the
 * opening statement that the attacks were an act of war on "freedom
 * itself" (no graphic detail), followed by the direct message to
 * Muslims worldwide distinguishing the terrorists from Islam and its
 * adherents. An audience "(Applause.)" interjection between the two
 * sentences of the second paragraph is elided (marked "..."); a
 * separate, non-contiguous paragraph earlier in the speech is elided
 * between paragraphs one and two (marked with an ellipsis paragraph).
 * Verbatim public-domain text (U.S. government work, 17 USC §105),
 * verified as contiguous spans against the George W. Bush White House
 * Archives' full-text transcript of the address.
 */
export const PASSAGE_APUSH_BUSH_SEPT_2001: Passage = {
  id: 'evelyn.passage.apush-bush-sept-2001.v1',
  title:
    'Address Before a Joint Session of the Congress on the United States Response to the Terrorist Attacks of September 11',
  author: 'George W. Bush',
  year: 2001,
  sourceUrl:
    'https://georgewbush-whitehouse.archives.gov/news/releases/2001/09/20010920-8.html',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    "On September the 11th, enemies of freedom committed an act of war against our country. Americans have known wars -- but for the past 136 years, they have been wars on foreign soil, except for one Sunday in 1941. Americans have known the casualties of war -- but not at the center of a great city on a peaceful morning. Americans have known surprise attacks -- but never before on thousands of civilians. All of this was brought upon us in a single day -- and night fell on a different world, a world where freedom itself is under attack.\n\n...\n\nI also want to speak tonight directly to Muslims throughout the world. We respect your faith. It's practiced freely by many millions of Americans, and by millions more in countries that America counts as friends. Its teachings are good and peaceful, and those who commit evil in the name of Allah blaspheme the name of Allah. ... The terrorists are traitors to their own faith, trying, in effect, to hijack Islam itself. The enemy of America is not our many Muslim friends; it is not our many Arab friends. Our enemy is a radical network of terrorists, and every government that supports them.",
  lineNumbered: true,
  wordCount: 202,
};
