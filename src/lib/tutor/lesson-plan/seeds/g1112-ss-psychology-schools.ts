/**
 * Grades 11-12 Social Studies — Psychology Schools Survey.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SS_PSYCHOLOGY_SCHOOLS: LessonPlan = {
  id: 'evelyn.g1112.ss.psychology.schools.v1',
  title: 'Psychology — The Five Major Schools',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'psychology',
  locale: 'en',
  los: [
    {
      id: 'g1112.ss.psychology.schools',
      description: 'Identify the five major schools of psychology (psychoanalytic, behaviourist, cognitive, humanistic, biological), key theorists, and the questions each addresses.',
      standard: 'APA-NATIONAL-STANDARDS-PSYCH',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Psychology has multiple "schools" because there\'s no single right way to study the mind.',
      script: 'Are people driven by unconscious desires (Freud)? Shaped by reinforcement (Skinner)? Or do they think their way through challenges (cognitive)? Each school answers differently — and each captures something real. Today: the five major schools.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-psych',
      kind: 'concept',
      goal: 'Five major schools, key figures, contributions, criticisms.',
      keyIdeas: [
        'PSYCHOANALYTIC (Freud, late 1800s): unconscious drives, childhood experiences, sexual + aggressive instincts shape adult behaviour. Methods: free association, dream analysis. CRITICISM: untestable, sample bias.',
        '  Key concepts: id/ego/superego, defense mechanisms, Oedipus complex.',
        'BEHAVIOURIST (Pavlov, Watson, Skinner; 1900s): study only OBSERVABLE behaviour. Mind is a "black box."',
        '  CLASSICAL conditioning (Pavlov): bell + food → bell alone elicits salivation.',
        '  OPERANT conditioning (Skinner): reinforcement and punishment shape future behaviour.',
        '  CRITICISM: ignores cognition, internal states.',
        'COGNITIVE (Piaget, Beck, Tversky/Kahneman; 1950s+): mind is an information processor. Studies attention, memory, problem solving.',
        '  PIAGET: stages of cognitive development.',
        '  TVERSKY/KAHNEMAN: heuristics + biases.',
        '  Cognitive Revolution (1960s) replaced behaviourism.',
        'HUMANISTIC (Maslow, Rogers; 1950s+): human potential, self-actualisation, meaning.',
        '  MASLOW: hierarchy of needs.',
        '  ROGERS: client-centered therapy. Unconditional positive regard.',
        '  CRITICISM: less empirically rigorous.',
        'BIOLOGICAL / NEUROSCIENCE (1970s+): brain structure + neurochemistry → behaviour.',
        '  Neurons, synapses, neurotransmitters (dopamine, serotonin).',
        '  Brain regions: amygdala (emotion), hippocampus (memory), prefrontal cortex (planning).',
        '  Modern psychiatry leans heavily on this school.',
        'EVOLUTIONARY PSYCHOLOGY (1980s+): asks WHY behaviours evolved.',
        'SOCIO-CULTURAL: how culture and social context shape mind.',
        'MOST PSYCHOLOGISTS today are eclectic.',
      ],
      vocabulary: [
        { term: 'classical conditioning', definition: 'learning through association of stimuli (Pavlov\'s dogs).' },
        { term: 'self-actualisation', definition: 'the realisation of one\'s full potential; top of Maslow\'s hierarchy.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A patient is afraid of dogs after being bitten as a child. How would each major school explain this?',
      steps: [
        'PSYCHOANALYTIC: childhood trauma in unconscious; perhaps symbolises a deeper fear.',
        'BEHAVIOURIST: classical conditioning — bite paired with dog creates fear conditioned to all dogs.',
        'COGNITIVE: schemas about dogs are now "dangerous"; biased attention toward threat cues.',
        'HUMANISTIC: anxiety blocks self-actualisation; therapy provides safe space.',
        'BIOLOGICAL: amygdala over-activates; possibly altered cortisol response.',
        'Treatment combines: behaviourist (exposure therapy), cognitive (reframe thoughts), biological (anxiolytic if severe).',
      ],
      answer: 'Each school offers a different lens; modern treatment combines multiple.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why was Freud\'s psychoanalysis so influential despite weak empirical evidence?',
      expectedAnswer: '(1) FIRST systematic theory of mind. (2) Invented modern talk therapy. (3) Provided concepts (unconscious, defense mechanisms) used in art and literature. (4) Some ideas (importance of childhood) validated even if specifics rejected. Influence ≠ correctness; Freud is studied historically more than scientifically today.',
      responseFormat: 'free',
      hints: ['Why does any first systematic theory have outsized influence?', 'What did Freud invent in clinical practice?'],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-school-superior',
      kind: 'misconception_check',
      question: 'A student picks "biological psychology" as the right school because it\'s "the most scientific." Why is this oversimplified?',
      commonErrors: [
        {
          answer: 'Biological psych is the right school',
          misconception: 'Treating different schools as competitors when they address different questions.',
          correctsTo: 'Different schools address different LEVELS OF EXPLANATION. Biological tells you which brain regions are involved. Cognitive tells you the information-processing steps. Behaviourist tells you environmental triggers. Social tells you cultural context. ALL can be valid simultaneously. The "best" school depends on the question.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five major schools: psychoanalytic, behaviourist, cognitive, humanistic, biological.',
        'Each addresses a different question/level of explanation.',
        'Modern psychology is integrative.',
        'Biological + cognitive currently dominant in research.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
