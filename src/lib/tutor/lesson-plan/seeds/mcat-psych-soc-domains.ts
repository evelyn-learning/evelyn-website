/**
 * MCAT — Psychological, Social, and Biological Foundations of Behavior.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_PSYCH_SOC_DOMAINS: LessonPlan = {
  id: 'evelyn.testprep.mcat.psych-soc.domains.v1',
  title: 'MCAT Psych/Soc — Section Overview and High-Yield Domains',
  curriculum: 'MCAT',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-psych-soc',
  locale: 'en',
  los: [
    {
      id: 'testprep.mcat.psych-soc.domains',
      description: 'Map the MCAT Psych/Soc section: content distribution, foundational theories, sociology fundamentals, study tips.',
      standard: 'MCAT-PS',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Psych/Soc is the section most students underestimate — and the most rewarding to study because much is memorisation.',
      script: 'Many MCAT takers don\'t have a strong psych/soc background. The section tests theories, terminology, and study designs from intro psych and intro sociology. The good news: most content is highly learnable through flashcards. Today: the high-yield domains and the canonical theories.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mcat-ps',
      kind: 'concept',
      goal: 'Format, content distribution, foundational theories, sociology basics.',
      keyIdeas: [
        'FORMAT: 59 questions, 95 minutes.',
        'CONTENT:',
        '  PSYCHOLOGY (~65%): cognitive, behavioural, social, abnormal, developmental, biological.',
        '  SOCIOLOGY (~30%): theories of society, demographics, social institutions, social inequality.',
        '  BIOLOGY (~5%): especially behavioural neuroscience.',
        'PSYCHOLOGY HIGH-YIELD:',
        '  Sensation/perception: thresholds, signal detection, depth cues.',
        '  Memory: sensory → working → long-term; encoding, retrieval, forgetting.',
        '  Cognition: problem-solving heuristics, biases (anchoring, availability), schemas.',
        '  Learning: classical conditioning (Pavlov), operant conditioning (Skinner — reinforcement schedules).',
        '  Motivation: drive theories, Maslow\'s hierarchy.',
        '  Emotion: James-Lange, Cannon-Bard, Schachter-Singer.',
        '  Personality: Freud, trait theory (Big Five), social-cognitive.',
        '  Disorders: DSM-5 categories — anxiety, mood, psychotic, personality, dissociative.',
        '  Therapies: psychodynamic, cognitive-behavioural, humanistic, biomedical.',
        '  Developmental: Piaget, Erikson, Kohlberg, Vygotsky.',
        'SOCIOLOGY HIGH-YIELD:',
        '  Theoretical perspectives: functionalism, conflict theory, symbolic interactionism, feminist theory.',
        '  Social institutions: family, religion, education, government, economy.',
        '  Demographics: age structure, urbanisation, migration, fertility/mortality.',
        '  Social inequality: race, class, gender, intersectionality.',
        '  Health disparities: SES gradients, access, social determinants.',
        '  Group dynamics: conformity (Asch), obedience (Milgram), bystander effect, groupthink.',
        'STUDY TIP: this section rewards FLASHCARDS more than other sections. Theories, theorists, and definitions are the backbone. Khan Academy MCAT psych/soc videos cover the AAMC content outline well.',
      ],
      vocabulary: [
        { term: 'social determinants of health', definition: 'non-medical factors (income, education, housing, social support) that influence health outcomes; tested heavily on MCAT and clinically relevant.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A passage describes a study where participants overestimated the frequency of plane crashes after watching news coverage. Which heuristic best explains this?',
      steps: [
        'Identify: people overestimate frequency based on EASE OF RECALL, not actual statistics.',
        'This is the AVAILABILITY HEURISTIC — judging probability by how easily examples come to mind.',
        'Vivid news coverage makes plane crashes "available" in memory, biasing the estimate upward.',
        'Compare to other heuristics:',
        '  ANCHORING — relying on initial info as a reference point. Doesn\'t fit.',
        '  REPRESENTATIVENESS — judging based on prototype matching. Doesn\'t fit.',
        '  Answer: AVAILABILITY heuristic.',
      ],
      answer: 'Availability heuristic',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 4-year-old is told that a tall thin glass holds the same amount of water as a short wide glass. The child insists the tall one has more. Which Piagetian concept does this illustrate?',
      expectedAnswer: 'Lack of CONSERVATION — the understanding that quantity remains constant despite changes in shape. Conservation typically develops in the CONCRETE OPERATIONAL stage (around age 7-11). At 4 years, the child is in the PREOPERATIONAL stage and lacks conservation. The classic Piagetian water-glass task demonstrates this.',
      responseFormat: 'free',
      hints: [
        'Piaget studied this exact phenomenon (tall vs short containers).',
        'The concept is named for what the child fails to do.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-undervalue',
      kind: 'misconception_check',
      question: 'A pre-med student plans to spend 1 week on Psych/Soc out of a 4-month MCAT prep schedule. Why is this likely too little?',
      commonErrors: [
        {
          answer: '1 week for psych/soc',
          misconception: 'Treating Psych/Soc as a "fluff" section that doesn\'t reward study.',
          correctsTo: 'Psych/Soc is 1 of 4 sections — 25% of total score weight. Most pre-meds don\'t major in psychology or sociology, so the content is genuinely new. The terminology alone (theorists, theories, study designs) requires consolidation. A reasonable allocation is 20-25% of prep time. Skimping costs 5-10 points easily, dragging down the total. Treat it like the high-yield section it is.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Psych/Soc = 25% of total score. Don\'t underweight.',
        'Psych: sensation, memory, learning, emotion, disorders, development.',
        'Soc: theories (functionalism, conflict, symbolic), inequality, health disparities.',
        'High flashcard yield — terminology + theorists.',
        'Khan Academy MCAT psych/soc covers most content.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
