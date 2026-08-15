/**
 * G8 — Social Studies: French Revolution (1789-1799).
 *
 * The collapse of the French monarchy and the radical reshaping of
 * European politics. Causes: financial crisis, Enlightenment ideas,
 * inequality. Key events: Estates-General, Bastille, Declaration of
 * Rights, Reign of Terror, Napoleon\'s rise.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_SS_FRENCH_REVOLUTION: LessonPlan = {
  id: 'evelyn.g8.ss.french-revolution.v1',
  title: 'The French Revolution',
  curriculum: 'state-standards',
  grade: '8',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g8.world.french-revolution',
      description: 'Explain causes, key events, and consequences of the French Revolution.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the French Revolution as a turning point.',
      script: 'In 1789 — just six years after the American Revolution ended — French citizens stormed a prison called the Bastille and started toppling their 800-year-old monarchy. Within five years, the king and queen were beheaded. The Revolution\'s ideas — liberty, equality, brotherhood — would reshape Europe and inspire revolutions for centuries. It also showed how a revolution can turn dark.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-french-revolution',
      kind: 'concept',
      goal: 'Causes, key events, Reign of Terror, Napoleon, legacy.',
      keyIdeas: [
        'CAUSES:',
        '  FINANCIAL CRISIS: France was bankrupt from supporting wars (including the American Revolution) and royal extravagance.',
        '  INEQUALITY: society divided into THREE ESTATES.',
        '    1st Estate: clergy (~1% of population).',
        '    2nd Estate: nobility (~2%).',
        '    3rd Estate: everyone else (~97%) — peasants, urban workers, middle class.',
        '    The first two estates owned most land and paid almost no taxes; the 3rd Estate carried the burden.',
        '  ENLIGHTENMENT IDEAS: writers like ROUSSEAU, VOLTAIRE, MONTESQUIEU questioned monarchy and divine right; promoted reason, natural rights, popular sovereignty.',
        '  IMMEDIATE TRIGGER: King LOUIS XVI called the ESTATES-GENERAL in May 1789 to address the financial crisis. The 3rd Estate broke off and declared itself the NATIONAL ASSEMBLY.',
        'KEY EVENTS:',
        '  STORMING OF THE BASTILLE (July 14, 1789) — Parisians attacked a royal prison; symbolic start of the revolution. Now French national holiday (Bastille Day).',
        '  DECLARATION OF THE RIGHTS OF MAN AND CITIZEN (Aug 1789) — declared liberty, equality, fraternity; inspired by US Declaration.',
        '  KING\'S FAILED ESCAPE (1791) — confirmed suspicions Louis was secretly counter-revolutionary.',
        '  REIGN OF TERROR (1793-94) — radical Jacobins, led by ROBESPIERRE, executed thousands (including Louis XVI and Marie Antoinette) by GUILLOTINE for being "enemies of the revolution". Robespierre himself was executed when the Terror went too far.',
        '  END OF REVOLUTION → DIRECTORY (weak govt 1795-99) → NAPOLEON BONAPARTE seized power 1799.',
        'NAPOLEON ruled France 1799-1815, conquered most of Europe, eventually defeated at Waterloo (1815).',
        'LEGACY:',
        '  Ended absolute monarchy in France (eventually after some monarchical comebacks).',
        '  Inspired revolutions across Europe and Latin America.',
        '  NAPOLEONIC CODE — uniform legal code that influenced many countries\' laws.',
        '  Concepts of "left" vs "right" politics originated in seating of the National Assembly.',
        '  Showed both the promise of revolution (equality, rights) and its danger (terror, dictatorship).',
      ],
      vocabulary: [
        { term: 'estates', definition: 'the three social classes of pre-revolutionary France.' },
        { term: 'Bastille', definition: 'royal prison whose 1789 storming launched the revolution.' },
        { term: 'Reign of Terror', definition: '1793-94 period of mass executions during the revolution.' },
        { term: 'guillotine', definition: 'execution device used during the Reign of Terror.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-causes',
      kind: 'worked_example',
      problem: 'Explain how Enlightenment ideas + financial crisis + inequality combined to spark the Revolution.',
      steps: [
        'INEQUALITY: 97% of the population (3rd Estate) carried tax burden while clergy and nobles paid almost nothing. Long-standing resentment.',
        'FINANCIAL CRISIS: France was bankrupt. Louis XVI couldn\'t fund the government. He needed new taxes — and only the Estates-General could approve them.',
        'ENLIGHTENMENT IDEAS gave the 3rd Estate a FRAMEWORK: government should serve the people; rights are natural, not granted by kings.',
        'The combination: a desperate king needing money + a sophisticated political theory + popular fury at inequality = revolution.',
      ],
      answer: 'See chain above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What are the three ideals of the French Revolution, often quoted in French?',
      expectedAnswer: 'Liberté, Égalité, Fraternité (Liberty, Equality, Brotherhood)',
      responseFormat: 'free',
      hints: [
        'Three words. Sound similar in English.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-revolution-good',
      kind: 'misconception_check',
      question: 'Sage says "the French Revolution was a good thing for France from start to finish." More nuanced view?',
      commonErrors: [
        {
          answer: 'true — democracy is good',
          misconception: 'Treating revolutions as uniformly good or bad.',
          correctsTo: 'The Revolution introduced ideas that have lasted (rights, equality, modern law). But it also produced massive bloodshed (Reign of Terror killed ~40,000), wars, and ultimately Napoleon\'s dictatorship. France didn\'t even become a stable democracy until decades later. The legacy is mixed and continues to be debated.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes: financial crisis + inequality (3 estates) + Enlightenment ideas.',
        'Key events: Estates-General → Bastille → Declaration of Rights → Reign of Terror → Napoleon.',
        'Three ideals: Liberté, Égalité, Fraternité.',
        'Reign of Terror executed thousands including King Louis XVI and Robespierre himself.',
        'Napoleon ended the revolution by seizing power; legacy is genuinely mixed.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How were the American and French Revolutions similar — and how were they DIFFERENT in outcome?',
      hint: 'Both inspired by Enlightenment, both ended monarchies, both produced foundational documents (Declaration of Independence; Declaration of Rights of Man). DIFFERENCES: American settled into a stable republic. French had decades of monarchy comebacks, military dictatorships, more revolutions. The French wanted to remake society more deeply; that\'s harder.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
