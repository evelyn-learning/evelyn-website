/**
 * College Intro — Intro Psychology (Psych 101).
 *
 * Methods, neuroscience, learning, cognition, development, social, abnormal.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SS_INTRO_PSYCHOLOGY: LessonPlan = {
  id: 'evelyn.college.intro-psychology.v1',
  title: 'Intro psychology — methods, brain, mind, behavior',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'social-studies',
  topic: 'intro-psychology',
  locale: 'en',
  los: [
    {
      id: 'college.psych',
      description: 'Identify research methods, key brain structures, learning principles, cognitive biases, and developmental stages.',
      standard: 'COLLEGE-PSY',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Psych 101 as a survey of the science of mind + behavior.',
      script: 'Psych 101 covers more than any one course should — methods, brain, learning, memory, development, abnormal. The skill is to see the connecting THREADS: every claim is supported by specific methods, with specific limits. Replication has been a problem in psychology; treat findings with appropriate humility.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-survey',
      kind: 'concept',
      goal: 'Methods + biological + cognitive + developmental + social + abnormal psych.',
      keyIdeas: [
        'METHODS: experimental (cause), correlational (association), case study (depth), longitudinal (over time), neuroimaging (fMRI shows blood flow correlate of activity).',
        'NEUROSCIENCE: neurons + synapses + neurotransmitters (dopamine, serotonin, norepinephrine, GABA, glutamate). Brain regions specialize but cooperate.',
        'LEARNING: classical + operant conditioning + observational learning (Bandura). Memory: sensory → working (limited) → long-term (declarative + procedural). Forgetting curves; reconsolidation.',
        'COGNITION: dual-process (System 1 fast + automatic, System 2 slow + deliberate; Kahneman). Heuristics + biases. Language acquisition.',
        'DEVELOPMENT: Piaget\'s stages (sensorimotor → preoperational → concrete-op → formal-op). Vygotsky\'s zone of proximal development. Erikson\'s psychosocial stages.',
        'SOCIAL: attribution (fundamental attribution error), conformity (Asch), obedience (Milgram), in-group bias, persuasion (Cialdini\'s influence principles).',
        'ABNORMAL: DSM categories. Anxiety, mood (depression, bipolar), psychotic (schizophrenia), personality, neurodevelopmental (autism, ADHD). Treatment: therapy + medication.',
        'REPLICATION CRISIS: many classic findings haven\'t replicated reliably. Be skeptical of single studies; trust meta-analyses + replication waves.',
      ],
      vocabulary: [
        { term: 'fMRI', definition: 'functional magnetic resonance imaging; measures blood-oxygen changes correlated with brain activity.' },
        { term: 'fundamental attribution error', definition: 'tendency to overweight personality and underweight situation in explaining others\' behavior.' },
        { term: 'replication crisis', definition: 'finding that many published psychology results fail to replicate in independent studies.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mem-decay',
      kind: 'worked_example',
      problem: 'A study group reviews material once a week vs cramming the night before a test. Why does the spaced study group remember more long-term?',
      steps: [
        'SPACING EFFECT: information is better retained when study is distributed over time.',
        'Each retrieval STRENGTHENS the memory trace and re-encodes it slightly differently.',
        'Cramming creates short-term encoding without time for consolidation; the trace is brittle.',
        'Mechanism: hippocampus + cortex consolidation requires sleep + time; spaced practice fits that schedule, cramming overloads it.',
        'Practical: spaced repetition apps (Anki) automate this for vocabulary and factual learning.',
      ],
      answer: 'Spaced study triggers consolidation + repeated retrieval; cramming doesn\'t.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A friend insists their sleep tracker shows they\'re a "morning person" because of one good week. What methodological problem applies?',
      expectedAnswer: 'small sample / selection — one week is not enough to establish a stable pattern; conclusions need replicated, longer observation',
      responseFormat: 'free',
      hints: [
        'How many data points are reliable for a chronotype claim?',
        'A single week could be coincidence or affected by other factors (caffeine, stress, weather).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-genes',
      kind: 'misconception_check',
      question: 'A student says: "Personality is in your DNA." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because genes',
          misconception: 'Treating genetic influence as deterministic.',
          correctsTo: 'Twin studies estimate heritability of personality traits at ~30-50% — meaning genes account for that share of trait VARIANCE within a population, not that traits are "set in DNA". Environment, experience, and gene-environment interactions explain the rest. Heritability also varies by environment (heritable in privileged conditions, less so in deprived ones). Genes constrain ranges, not specific outcomes.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Match question to method; experiments alone establish cause.',
        'Brain regions specialize but cooperate.',
        'Memory: encode → consolidate → retrieve. Spaced practice + retrieval beats cramming.',
        'Two-system thinking: fast + automatic vs slow + deliberate.',
        'Replication crisis: trust meta-analyses; be skeptical of single sensational findings.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
