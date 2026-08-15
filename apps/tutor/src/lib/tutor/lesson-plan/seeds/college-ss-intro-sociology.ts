/**
 * College Intro — Intro Sociology (Soc 101).
 *
 * Sociological imagination, theories, methods, institutions, inequality, change.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SS_INTRO_SOCIOLOGY: LessonPlan = {
  id: 'evelyn.college.intro-sociology.v1',
  title: 'Intro sociology — imagination, methods, structures',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'social-studies',
  topic: 'intro-sociology',
  locale: 'en',
  los: [
    {
      id: 'college.soc',
      description: 'Apply sociological imagination, distinguish theoretical perspectives, and read sociological methods.',
      standard: 'COLLEGE-SOC',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Soc 101 as building skills to see structure where others see only individuals.',
      script: 'The first move in sociology is the hardest: stop treating outcomes as the result of individual choices. Average outcomes are usually shaped by structure — laws, markets, networks, neighborhoods, institutions. Individuals choose within constraints. Sociology builds tools to see those constraints and how they got built.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-soc101',
      kind: 'concept',
      goal: 'Imagination + theories + methods + institutions + stratification + change.',
      keyIdeas: [
        'SOCIOLOGICAL IMAGINATION (Mills): connecting personal troubles to public issues — unemployment, addiction, illness as social phenomena, not just individual failings.',
        'THEORIES: functionalist (institutions serve functions), conflict (groups compete for resources/power), interactionist (meaning made face-to-face).',
        'METHODS: ethnography (deep participant observation), surveys (quantitative breadth), historical/comparative, content analysis, experiments (rare in soc).',
        'INSTITUTIONS: family, education, religion, economy, polity, media. Each fulfills functions AND distributes resources unequally.',
        'STRATIFICATION: class (Marx — relation to means of production; Weber — class + status + party), race, gender, sexuality. Intersectional analysis.',
        'CULTURE: norms, values, symbols, language. Material vs nonmaterial culture. Cultural lag (norms slower than tech).',
        'SOCIAL CHANGE: drivers — technology, conflict, demography, ideology, environment. Change is contested + uneven.',
        'GLOBALIZATION: flows of goods, capital, ideas, people across borders. Compresses time-space; creates winners + losers; produces cultural hybrids.',
      ],
      vocabulary: [
        { term: 'sociological imagination', definition: 'connecting personal experience to broader social structures.' },
        { term: 'ethnography', definition: 'in-depth participant observation, often over months or years.' },
        { term: 'cultural lag', definition: 'when nonmaterial culture (norms, beliefs) lags behind material change (tech).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-marriage',
      kind: 'worked_example',
      problem: 'Average age of first marriage in the US has risen from ~22 (1970) to ~30 (2020). Use sociological lenses to explain.',
      steps: [
        'FUNCTIONALIST: economic shifts mean longer schooling needed; later marriage matches longer human-capital investment.',
        'CONFLICT: women\'s labor-force participation + reproductive control reduced economic dependency on early marriage.',
        'INTERACTIONIST: cultural meaning of marriage shifted from economic necessity to emotional partnership; people delay until they feel "ready" — a moving target.',
        'STRUCTURAL: housing costs + student debt + delayed career consolidation push back life milestones generally.',
        'All four are real and complementary, not competing — same trend, multiple causal threads.',
      ],
      answer: 'Multiple causes — education, gender shifts, cultural meaning, economic structure.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A researcher surveys 500 Americans on attitudes about the police. The sample is 80% college students. What\'s the methodological problem?',
      expectedAnswer: 'sampling bias / non-representative sample — college students differ from general population on age, education, race composition, etc., so results don\'t generalize',
      responseFormat: 'free',
      hints: [
        'Who do the 500 RESPRESENT?',
        'Generalization requires a sample matching the target population.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-blame',
      kind: 'misconception_check',
      question: 'A student says: "Sociology is just blaming society instead of holding individuals accountable." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because of structure',
          misconception: 'Reading structural analysis as denying individual responsibility.',
          correctsTo: 'Sociology examines how STRUCTURES (laws, institutions, markets, networks) shape outcomes at scale. It doesn\'t deny individual choice or moral responsibility. The point is: when you see the same outcome happening reliably across thousands of individuals (e.g., poverty correlated with neighborhood, education correlated with parental income), individual-level explanations are insufficient. Both levels matter; sociology fills the gap that pure individualism leaves.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sociological imagination: see personal troubles as public issues.',
        'Three theory traditions; each captures real things.',
        'Methods: pick by question. Surveys for breadth, ethnography for depth.',
        'Stratification operates on multiple intersecting axes.',
        'Structure + agency together explain outcomes.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
