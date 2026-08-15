/**
 * AP Biology — Population ecology.
 *
 * Exponential vs logistic growth, carrying capacity, density-
 * dependent vs density-independent factors, life-history strategies.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_POPULATION_ECOLOGY: LessonPlan = {
  id: 'evelyn.ap.bio.population-ecology.v1',
  title: 'Population ecology: growth, carrying capacity, life history',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'ap-biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.population-ecology',
      description: 'Apply exponential and logistic growth models and analyze population factors.',
      standard: 'AP-BIO-IST-1',
    },
  ],
  prerequisites: [],
  followUps: ['apbio.community-ecosystem'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why bacteria don\'t take over the world.',
      script: 'A single bacterium dividing every 20 minutes would, in 24 hours, fill the entire ocean. They don\'t. WHY? Because growth always hits limits — food, space, predators. Population ecology studies those limits.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-models-factors',
      kind: 'concept',
      goal: 'Two growth models + carrying capacity + density factors + life-history.',
      keyIdeas: [
        'EXPONENTIAL GROWTH: dN/dt = rN. Population grows by a fixed percentage per unit time. r = per-capita growth rate. Yields a J-curve.',
        'LOGISTIC GROWTH: dN/dt = rN(1 − N/K). K = carrying capacity. Growth slows as N approaches K. Yields an S-curve.',
        'CARRYING CAPACITY (K): the maximum population the environment can sustain long-term. Set by food, water, space, predators, disease.',
        'DENSITY-DEPENDENT factors: stronger as population grows. Competition for food, disease spread, predators that switch to abundant prey.',
        'DENSITY-INDEPENDENT factors: hit regardless of density. Hurricanes, fires, cold snaps.',
        'LIFE-HISTORY STRATEGIES:',
        '  r-SELECTED: many offspring, little parental care, fast reproduction, short life. Boom-bust populations. Mice, weeds, insects, bacteria.',
        '  K-SELECTED: few offspring, lots of parental care, slow reproduction, long life. Stable populations near K. Elephants, humans, oak trees.',
        'POPULATION CRASH: when N exceeds K, mortality jumps until population falls back. Often overshoots, oscillates.',
      ],
      vocabulary: [
        { term: 'carrying capacity', definition: 'the maximum population an environment can sustain.' },
        { term: 'logistic growth', definition: 'population growth slowing as it approaches carrying capacity.' },
        { term: 'r vs K selection', definition: 'two life-history strategies: many small offspring (r) vs few well-cared-for offspring (K).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-strategies',
      kind: 'worked_example',
      problem: 'Compare the life-history strategy of a mouse vs an elephant. Why do these strategies make sense for their environments?',
      steps: [
        'MOUSE: r-selected. Mature in ~6 weeks. Litters of 5-10 every few weeks. Life ~1-2 years.',
        '  Fits unstable environments where rapid colonization wins.',
        'ELEPHANT: K-selected. Mature ~10-15 years. ONE calf every 4-5 years. Life ~70 years.',
        '  Fits stable environments where parental care = high offspring survival.',
        'TRADE-OFF: there\'s no "best" strategy — both are evolutionary stable in their contexts. Mice and elephants both succeed where they live.',
      ],
      answer: 'mouse: r-selected fast and many; elephant: K-selected slow and few',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In logistic growth, when is dN/dt MAXIMUM?',
      expectedAnswer: 'when N = K/2 (population at half carrying capacity)',
      responseFormat: 'free',
      hints: [
        'dN/dt = rN(1 − N/K).',
        'Take derivative w.r.t. N, set to 0.',
        'Maximum at N = K/2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-density-independent-rare',
      kind: 'misconception_check',
      question: 'Are density-independent factors RARE compared to density-dependent ones?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating density-dependent as the dominant force.',
          correctsTo: 'Both matter. For SHORT-LIVED species in fluctuating environments, density-INDEPENDENT factors (weather, fire) often dominate. For long-lived species near carrying capacity, density-DEPENDENT factors matter more. Real populations face both.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Exponential: dN/dt = rN. J-curve.',
        'Logistic: dN/dt = rN(1 − N/K). S-curve.',
        'K = carrying capacity, set by environmental limits.',
        'r-selected: many small offspring; K-selected: few well-cared.',
        'Density-dependent (competition, disease) vs density-independent (weather) factors.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Where do humans fit on the r vs K spectrum, and how is that changing?',
      hint: 'Strongly K-selected — long lives, few offspring, high parental investment. Modern humans even more so: birth rates dropping below replacement in developed countries. Possibly the most extreme K-strategy in any animal.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
