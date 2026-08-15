/**
 * Grades 11-12 Social Studies — Sociology (intro).
 *
 * Sociological imagination, theories, socialization, institutions, inequality.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_SOCIOLOGY: LessonPlan = {
  id: 'evelyn.ss.11-12.sociology.v1',
  title: 'Sociology — institutions, structure, inequality',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'sociology',
  locale: 'en',
  los: [
    {
      id: 'hs.sociology',
      description: 'Apply sociological imagination; distinguish functionalist, conflict, and interactionist perspectives.',
      standard: 'NCSS-D2',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame sociology as seeing patterns where people see only individuals.',
      script: 'C. Wright Mills called it the "sociological imagination": the skill of seeing personal troubles as public issues. One person\'s unemployment is private. 10 million people\'s unemployment in 1933 was a structural issue caused by financial collapse. Sociology zooms out from individuals to PATTERNS — and the patterns are usually surprising.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sociology',
      kind: 'concept',
      goal: 'Three theoretical perspectives + socialization + institutions + stratification.',
      keyIdeas: [
        'FUNCTIONALISM (Durkheim): society = system of interdependent parts; institutions exist because they serve functions. Asks: what does this institution DO?',
        'CONFLICT THEORY (Marx, Weber): society = arena of competing groups for power, wealth, status. Asks: who BENEFITS from this arrangement?',
        'SYMBOLIC INTERACTIONISM (Mead, Goffman): society = meanings constructed in face-to-face interaction. Asks: how do people INTERPRET this situation?',
        'SOCIALIZATION: how people learn cultural norms. Primary (family), secondary (school, peers, media). The "looking-glass self" — we see ourselves as we think others see us.',
        'INSTITUTIONS: family, education, religion, government, economy, media. Each fulfills functions AND distributes resources unequally.',
        'STRATIFICATION: society arranged in layers by class, race, gender, etc. Class isn\'t just income — it includes wealth, education, occupational prestige, social capital.',
        'INTERSECTIONALITY: identities (race + gender + class + sexuality...) intersect; experience can\'t be reduced to one axis.',
        'CULTURE: shared norms, values, symbols, language. Culture varies between societies and within (subcultures, countercultures).',
      ],
      vocabulary: [
        { term: 'sociological imagination', definition: 'connecting individual experience to broader social structures.' },
        { term: 'functionalism', definition: 'theory that institutions exist because they serve functions for the social system.' },
        { term: 'stratification', definition: 'society\'s layered arrangement by class, race, gender, etc.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-perspectives',
      kind: 'worked_example',
      problem: 'How would each perspective analyze public schools?',
      steps: [
        'FUNCTIONALIST: schools transmit knowledge, teach civic norms, sort talent by ability, create shared identity. They\'re necessary system maintenance.',
        'CONFLICT: schools reproduce inequality. Wealthy districts have richer resources; tracking sorts kids by class background; "hidden curriculum" rewards middle-class behavior.',
        'INTERACTIONIST: meaning is made in classrooms. Teacher expectations become self-fulfilling prophecies (Pygmalion effect); how students label themselves and each other shapes outcomes.',
        'All three perspectives are partially right. Schools simultaneously serve functions, reproduce inequality, and are interaction-rich sites of meaning-making.',
      ],
      answer: 'Functionalist, conflict, and interactionist views capture different real aspects.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A study finds children of college graduates are more likely to graduate college themselves. What sociological concept does this illustrate?',
      expectedAnswer: 'social reproduction (or intergenerational mobility / cultural capital) — institutions reproduce existing class structure across generations',
      responseFormat: 'free',
      hints: [
        'It\'s about how social position transmits across generations.',
        'Bourdieu\'s "cultural capital" is the textbook term.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-blame',
      kind: 'misconception_check',
      question: 'A student says: "Poor people are poor because of bad choices." How would a sociologist respond?',
      commonErrors: [
        {
          answer: 'because of laziness',
          misconception: 'Reducing structural outcomes to individual choices.',
          correctsTo: 'Sociologists don\'t deny individual choice, but show that structures HEAVILY constrain choices. A child born in a poor neighborhood has worse schools, fewer adult role models in stable jobs, less family wealth to fall back on, less access to healthcare, more environmental stress. Same "choices" play out very differently in different structural settings. Blaming individuals while ignoring structure is the FUNDAMENTAL ATTRIBUTION ERROR — overweighting personality, underweighting situation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sociological imagination: see personal troubles as public issues.',
        'Three perspectives: functionalist, conflict, interactionist — each sees real things.',
        'Institutions both serve functions AND reproduce inequality.',
        'Identities intersect; one-axis explanations miss most of the action.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
