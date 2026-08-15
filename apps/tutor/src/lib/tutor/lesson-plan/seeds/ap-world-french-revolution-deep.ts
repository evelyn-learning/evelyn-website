/**
 * AP World History — French Revolution and Napoleon (deep dive).
 *
 * Causes, phases (Estates-General → Reign of Terror → Napoleon),
 * legacy. Key concepts: Enlightenment ideas, sans-culottes, the
 * Code Napoleon.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_FRENCH_REVOLUTION_DEEP: LessonPlan = {
  id: 'evelyn.ap.world.french-revolution-deep.v1',
  title: 'French Revolution and Napoleon (deep dive)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.atlantic-revolutions',
      description: 'Analyze the causes, phases, and consequences of the French Revolution and Napoleonic era.',
      standard: 'AP-WORLD-5.3',
    },
  ],
  prerequisites: ['ncss.68.history.french-revolution'],
  followUps: ['apworld.industrial-revolution'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Revolution as both inspiring and terrifying.',
      script: 'In 1789, French peasants stormed a prison. Within 10 years they\'d killed their king, executed thousands by guillotine, declared the rights of man, and ended up with a dictator. The French Revolution did everything you can imagine politics doing — sometimes within months.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-causes-phases',
      kind: 'concept',
      goal: 'Causes + four phases + Napoleon\'s rise + lasting impact.',
      keyIdeas: [
        'CAUSES: 1) Enlightenment ideas (Voltaire, Rousseau) — equality, popular sovereignty. 2) Financial crisis — wars + American Revolution support bankrupted France. 3) Estates system — clergy (1st), nobles (2nd) had privileges; commoners (3rd) paid all the taxes. 4) Bad harvests + bread shortages.',
        'PHASE 1 (1789-1791) — moderate: Estates-General convened; Third Estate declared itself National Assembly. Tennis Court Oath. Storming of the Bastille (July 14). Declaration of the Rights of Man and Citizen. Constitutional monarchy attempted.',
        'PHASE 2 (1792-1794) — radical: monarchy abolished. King Louis XVI executed (Jan 1793). Reign of Terror under Robespierre and Committee of Public Safety. ~17,000 executed by guillotine. Eventually Robespierre himself executed.',
        'PHASE 3 (1795-1799) — Directory: a 5-man executive. Corrupt and weak.',
        'PHASE 4 (1799-1815) — NAPOLEON: military genius staged a coup, became "First Consul" then Emperor. Code Napoleon (legal reform, equality before law, religious freedom). Conquered most of Europe. Defeated at Waterloo 1815.',
        'LEGACY: spread Enlightenment ideas across Europe. Concept of NATIONALISM born here. Inspired Latin American independence. Code Napoleon influenced legal systems globally.',
      ],
      vocabulary: [
        { term: 'Estates-General', definition: 'a French legislative assembly representing the three estates (clergy, nobles, commoners).' },
        { term: 'sans-culottes', definition: 'urban working-class radicals; literally "without breeches".' },
        { term: 'Code Napoleon', definition: 'Napoleon\'s civil law code emphasizing equality before law and property rights.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-bastille',
      kind: 'worked_example',
      problem: 'Why is the Storming of the Bastille (July 14, 1789) the symbolic start of the French Revolution?',
      steps: [
        'The Bastille was a royal prison in Paris — symbol of arbitrary royal power. Held only 7 inmates that day.',
        'A Paris crowd, fearing a royal crackdown, attacked it for ARMS (gunpowder).',
        'They overpowered the guards, killed the commander, freed the prisoners.',
        'Symbolic value: COMMONERS attacking royal authority directly and winning. Showed the king couldn\'t control Paris.',
        'July 14 became Bastille Day — French national holiday.',
        'Marked the moment the Revolution went from political debates to popular uprising.',
      ],
      answer: 'first popular uprising; commoners attacking royal symbol and winning',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is Robespierre considered both a hero and a villain of the Revolution?',
      expectedAnswer: 'pushed equality and democracy; ran the Reign of Terror with mass executions',
      responseFormat: 'free',
      hints: [
        'Hero: he was a champion of equality and the abolition of slavery in French colonies.',
        'Villain: he led the Committee of Public Safety; oversaw the guillotining of thousands.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-revolution-monolithic',
      kind: 'misconception_check',
      question: 'Was the French Revolution a single, unified movement?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating it as one continuous event.',
          correctsTo: 'No — it had multiple phases with DIFFERENT factions and goals. Liberal nobles, radical Jacobins, urban sans-culottes, peasants — all wanted different things. Sometimes they fought EACH OTHER. The Revolution killed many of its own leaders.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Causes: Enlightenment ideas, financial crisis, unequal Estates system, food shortages.',
        'Four phases: moderate → radical (Terror) → Directory → Napoleon.',
        'Code Napoleon spread legal equality across Europe.',
        'Birth of modern nationalism and inspiration for Latin American revolutions.',
        'Revolutions can devour their own — Robespierre executed by his own movement.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compare and contrast the AMERICAN Revolution (1775-1783) and the FRENCH Revolution (1789-1799).',
      hint: 'Both Enlightenment-inspired. American: more conservative, replaced one elite with another, succeeded relatively cleanly. French: more radical, attempted total social restructuring, devolved into Terror. Different starting conditions explain much.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
