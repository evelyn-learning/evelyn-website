/**
 * G7 — Social Studies: Ancient Greece (city-states, democracy,
 * philosophy).
 *
 * Foundational world history. The geography that fragmented Greece
 * into independent city-states; Athens (democracy, philosophy)
 * vs. Sparta (military society); the Persian Wars and the Golden
 * Age; lasting contributions in democracy, drama, philosophy,
 * and architecture.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_ANCIENT_GREECE: LessonPlan = {
  id: 'evelyn.g7.ss.ancient-greece.v1',
  title: 'Ancient Greece',
  curriculum: 'state-standards',
  grade: '7',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g7.world.greece',
      description: 'Describe the geography, government forms, and cultural achievements of Ancient Greece.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tie Greece\'s impact to ideas you still encounter today.',
      script: 'Ever heard the words DEMOCRACY, PHILOSOPHY, OLYMPICS, GEOMETRY, MARATHON, THEATER? All five are Greek. Ancient Greece punched WAY above its size — it was a fractured collection of small city-states on a rocky peninsula, and its ideas still shape how Western civilization works 2,500 years later.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-greece',
      kind: 'concept',
      goal: 'Geography → city-states → Athens vs Sparta → Persian Wars → Golden Age → contributions.',
      keyIdeas: [
        'GEOGRAPHY: Greece is a peninsula with mountainous terrain and many islands. Hard to unite — natural barriers fragmented it into hundreds of CITY-STATES (POLEIS).',
        'A city-state = a city + the surrounding farmland, with its own government and laws.',
        'TWO MAJOR city-states with different cultures:',
        '  ATHENS: democratic government (eventually), focus on philosophy, art, trade, naval power.',
        '  SPARTA: oligarchic government (small group rule), focus on military training from age 7. Disciplined, feared army.',
        'Both had SLAVERY and EXCLUDED women + non-citizens from political life.',
        'PERSIAN WARS (~499-449 BCE): Greek city-states united against the much-larger Persian Empire and won. Boosted Greek confidence and Athens\' power.',
        'GOLDEN AGE OF ATHENS (~480-404 BCE) under PERICLES:',
        '  DEMOCRACY: adult male citizens voted directly on laws (DIRECT democracy, not representative).',
        '  Philosophy: SOCRATES, PLATO, ARISTOTLE.',
        '  Drama: tragedies (Sophocles, Euripides) and comedies (Aristophanes).',
        '  Architecture: the Parthenon on the Acropolis.',
        'PELOPONNESIAN WAR (431-404 BCE): Athens vs Sparta. Sparta won; Athens declined.',
        'Eventually all of Greece fell to MACEDONIA and ALEXANDER THE GREAT (~330s BCE), who spread Greek culture across his vast empire (Hellenistic period).',
      ],
      vocabulary: [
        { term: 'city-state', definition: 'a city + surrounding land with its own government.' },
        { term: 'democracy', definition: 'rule by the people; first practiced in Athens.' },
        { term: 'oligarchy', definition: 'rule by a small group; Sparta\'s system.' },
        { term: 'philosophy', definition: 'the study of fundamental questions about existence, knowledge, ethics.' },
      ],
      suggestedTools: ['show_map', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-athens-vs-sparta',
      kind: 'worked_example',
      problem: 'Compare Athens and Sparta on government, education, and role of women.',
      steps: [
        'GOVERNMENT: Athens had DIRECT DEMOCRACY (adult male citizens vote). Sparta had OLIGARCHY (two kings + council of elders + assembly).',
        'EDUCATION: Athenian boys studied math, music, philosophy, athletics. Spartan boys entered military training at 7 and lived in barracks until 30.',
        'WOMEN: Athenian women had VERY limited public roles — couldn\'t vote, own significant property, or appear publicly without a male relative. Spartan women had MORE freedom — they could own property, exercise publicly, and were expected to be physically fit (so they could bear strong soldiers).',
      ],
      answer: 'See comparison above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did ancient Greece develop into many separate city-states rather than one unified country?',
      expectedAnswer: 'Mountainous geography made unification difficult',
      responseFormat: 'free',
      hints: [
        'Look at the geography clue.',
        'Mountains and islands make travel and unification hard.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-democracy',
      kind: 'misconception_check',
      question: 'Sami says ancient Athens was the first true democracy where everyone could vote. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Calling Athenian democracy "everyone votes".',
          correctsTo: 'Athens had the first DIRECT democracy, but only adult male citizens voted — perhaps 10-20% of the population. Women, enslaved people, and metics (non-citizens) were excluded. It was revolutionary for its time, but very limited by modern standards.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Greek geography (mountains, islands) → fragmented city-states.',
        'Athens (democracy, art, philosophy) vs Sparta (oligarchy, military).',
        'Persian Wars united Greeks; Peloponnesian War divided them.',
        'Golden Age of Athens under Pericles produced Socrates, Plato, Aristotle, the Parthenon.',
        'Athenian "democracy" excluded women, slaves, and non-citizens.',
        'Alexander the Great later spread Greek culture across Egypt, Persia, India.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does so much of modern Western government, philosophy, and even vocabulary still trace back to Athens?',
      hint: 'The Romans admired and copied the Greeks. The Romans then spread their version across Europe. The Renaissance rediscovered Greek thought. Each wave amplified the influence.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
