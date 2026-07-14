/**
 * AP World History — Unit 5 CED 5.2: The Atlantic Revolutions.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.atlantic-revolutions.v1`. Covers the American, French,
 * Haitian, and Latin American revolutions (1776-1826), their mutual
 * influence, and their sharply different exclusions/grievances. Measured,
 * exam-neutral tone throughout, per Global Constraints.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_ATLANTIC_REVOLUTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.atlantic-revolutions.v1',
  course: 'AP World History: Modern',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'The Atlantic Revolutions',
  planId: 'evelyn.ap.apworld.atlantic-revolutions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.atlantic-revolutions.v1' }],
  theory: [
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'definition',
      title: 'Estates-General',
      content:
        "The French assembly of the three estates (clergy, nobility, commoners) convened by Louis XVI in 1789 amid fiscal crisis; the Third Estate's breakaway formed the National Assembly.",
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'definition',
      title: 'creole',
      content:
        'In the Spanish American colonial context, a person of Spanish descent born in the Americas, generally excluded from the highest colonial offices reserved for peninsula-born Spaniards, and the social group that led most Latin American independence movements.',
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'event',
      title: 'American independence (1776)',
      content:
        'The thirteen British colonies declared independence in 1776, justifying the break in the language of natural rights and government by consent — a direct application of Lockean theory that circulated back across the Atlantic and helped inspire French reformers.',
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'event',
      title: 'French Revolution (from 1789)',
      content:
        'A fiscal crisis forced the 1789 Estates-General; the Third Estate formed the National Assembly, which, after the storming of the Bastille (July 14, 1789), issued the Declaration of the Rights of Man and of the Citizen (August 1789), proclaiming universal natural rights and national sovereignty.',
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'event',
      title: 'Haitian Revolution (1791-1804)',
      content:
        "Enslaved people in Saint-Domingue rose in 1791 and, under leaders including Toussaint L'Ouverture, fought French, British, and Spanish forces for over a decade; Haiti declared independence in 1804 under Jean-Jacques Dessalines — the only one of the four revolutions in which enslaved people themselves achieved abolition and independence through sustained armed struggle.",
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'event',
      title: "Haiti's post-independence isolation",
      content:
        "Haiti's independence was met with diplomatic and economic isolation by France, the United States, and other slaveholding powers, which refused recognition for years; France later extracted a crippling indemnity (1825) as the price of recognition.",
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'event',
      title: 'Latin American independence (1808-1826)',
      content:
        "Napoleon's 1808 invasion of Spain triggered a crisis of political legitimacy across Spanish America. Independence movements led chiefly by creoles (Simón Bolívar in the north, José de San Martín in the south) achieved independence for most of Spanish America by 1826.",
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'event',
      title: "Bolívar's central grievance",
      content:
        "Bolívar's Jamaica Letter (1815) shows creole leaders' central grievance was exclusion from high colonial office (viceregal, ecclesiastical, diplomatic, administrative posts reserved for peninsular-born Spaniards) — not, in the first instance, the French Declaration's universal-rights language.",
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'framework',
      title: 'chain of influence, sharp divergence',
      content:
        "Each revolution influenced the next (American precedent → France; French upheaval → Saint-Domingue; 1808 Spanish crisis → Latin America) but each drew its own, different line around who counted as free and equal (property, race, gender).",
    },
    {
      loId: 'apworld.atlantic-revolutions-era',
      kind: 'trap',
      title: 'not equal rights everywhere',
      content:
        "The French Declaration's universal language did not end slavery in most French colonies; property qualifications limited voting in the U.S. and France; women were excluded nearly everywhere; Latin American creole-led governments largely preserved existing racial/social hierarchies.",
    },
  ],
  methods: [
    {
      title: 'Compare a universalist rights document with a locally-grounded grievance document',
      when_to_use:
        'Use this when asked to compare the French Declaration of the Rights of Man with a Latin American independence document such as Bolívar\'s Jamaica Letter.',
      steps: [
        'Identify the KIND of claim each document makes: abstract/universal (rights belong to all people as such) versus concrete/administrative (exclusion from specific offices or privileges).',
        "Identify the document's intended audience and purpose (state proclamation for all citizens vs. a private letter arguing a specific political case).",
        'State the structural difference explicitly (arguing from principle down vs. arguing from grievance up).',
        'Connect the difference to the broader pattern: the Atlantic Revolutions were not one uniform application of French-style universalism.',
      ],
      example: {
        problem:
          'The French Declaration proclaims universal natural rights; Bolívar\'s letter catalogs specific colonial offices Spanish Americans were excluded from. How do these differ?',
        solution:
          "The French Declaration argues from abstract universal principle; Bolívar argues from concrete, lived colonial exclusion toward a claim for self-government — different registers of argument responding to different local contexts.",
      },
      relatedLoIds: ['apworld.atlantic-revolutions-era'],
    },
  ],
  pointers: [
    { content: 'Haiti (1791-1804) is the ONLY Atlantic Revolution where enslaved people achieved abolition and independence by their OWN armed struggle — this is the #1 tested distinction for this topic.', kind: 'trap' },
    { content: "Bolívar's Jamaica Letter is quoted here via Sherwell's 1921 English rendering — attribute quotes to Bolívar via that translation, never as his original Spanish wording.", kind: 'gotcha' },
    { content: "Each revolution drew a DIFFERENT line on who counted as equal (property, race, gender) — never claim the Atlantic Revolutions extended rights uniformly.", kind: 'tip' },
    { content: 'Sequence: American (1776) → French (1789) → Haitian (1791-1804) → Latin American (1808-1826) — each influenced by the one before, via a different mechanism each time.', kind: 'tip' },
    { content: "France's 1825 indemnity on Haiti (the price of diplomatic recognition) is a distinct, later event from Haiti's 1804 independence — don't conflate the two dates.", kind: 'gotcha' },
  ],
};
