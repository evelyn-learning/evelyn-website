import type { Passage } from '../types';

/**
 * President John F. Kennedy's radio and television address to the American
 * people on the Soviet arms build-up in Cuba, October 22, 1962 (the Cuban
 * Missile Crisis "quarantine" address). AP World Unit-8 document — the
 * announcement of the naval quarantine plus the nuclear-stakes framing that
 * opens the speech. Excerpt is a US-government work (17 USC §105), therefore
 * public domain regardless of year; verified as contiguous spans (three
 * non-adjacent paragraphs, elisions marked ". . .") against the American
 * Presidency Project's full-text transcript of the address.
 */
export const PASSAGE_APWORLD_JFK_CUBA: Passage = {
  id: 'evelyn.passage.apworld-jfk-cuba.v1',
  title: 'Radio and Television Report to the American People on the Soviet Arms Build-Up in Cuba',
  author: 'John F. Kennedy',
  year: 1962,
  sourceUrl:
    'https://www.presidency.ucsb.edu/documents/radio-and-television-report-the-american-people-the-soviet-arms-buildup-cuba',
  license: 'public-domain',
  genre: 'speech',
  fullText:
    'Good evening, my fellow citizens:\n\n' +
    'This Government, as promised, has maintained the closest surveillance of the Soviet military buildup on the island of Cuba. Within the past week, unmistakable evidence has established the fact that a series of offensive missile sites is now in preparation on that imprisoned island. The purpose of these bases can be none other than to provide a nuclear strike capability against the Western Hemisphere.\n\n' +
    '. . .\n\n' +
    "Neither the United States of America nor the world community of nations can tolerate deliberate deception and offensive threats on the part of any nation, large or small. We no longer live in a world where only the actual firing of weapons represents a sufficient challenge to a nation's security to constitute maximum peril. Nuclear weapons are so destructive and ballistic missiles are so swift, that any substantially increased possibility of their use or any sudden change in their deployment may well be regarded as a definite threat to peace.\n\n" +
    '. . .\n\n' +
    'First: To halt this offensive buildup, a strict quarantine on all offensive military equipment under shipment to Cuba is being initiated. All ships of any kind bound for Cuba from whatever nation or port will, if found to contain cargoes of offensive weapons, be turned back. This quarantine will be extended, if needed, to other types of cargo and carriers. We are not at this time, however, denying the necessities of life as the Soviets attempted to do in their Berlin blockade of 1948.',
  lineNumbered: true,
  wordCount: 249,
};
