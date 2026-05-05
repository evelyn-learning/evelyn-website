/**
 * AP Psychology — Learning theories.
 *
 * Classical conditioning (Pavlov), operant conditioning (Skinner),
 * observational learning (Bandura).
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PSYCH_LEARNING: LessonPlan = {
  id: 'evelyn.ap.psych.learning.v1',
  title: 'Learning: classical, operant, observational',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.learning',
      description: 'Distinguish classical, operant, and observational learning and identify examples of each.',
      standard: 'AP-PSYCH-LRN',
    },
  ],
  prerequisites: [],
  followUps: ['appsych.memory'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pavlov\'s dogs as the iconic gateway.',
      script: 'A bell rings. A dog drools. The dog learned to associate the bell with food. That simple discovery — Pavlov\'s in 1900 — opened the entire science of LEARNING. Three theories trace from there.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-theories',
      kind: 'concept',
      goal: 'Three theories + key terms + examples.',
      keyIdeas: [
        'CLASSICAL CONDITIONING (Pavlov): pairing a NEUTRAL stimulus with one that already triggers a response. After enough pairings, the neutral stimulus alone triggers the response.',
        '  Unconditioned stimulus (US): naturally triggers response. Food → drool.',
        '  Conditioned stimulus (CS): paired with US. Bell → eventually drool.',
        '  EXTINCTION: CS without US → conditioned response fades.',
        'OPERANT CONDITIONING (Skinner): behavior is shaped by its CONSEQUENCES.',
        '  REINFORCEMENT increases behavior. Positive (give something good). Negative (remove something bad — relief).',
        '  PUNISHMENT decreases behavior. Positive (apply something bad). Negative (remove something good).',
        '  SCHEDULES: continuous (every time) vs partial (sometimes). Partial schedules produce more PERSISTENT behavior — slot machines exploit this.',
        'OBSERVATIONAL LEARNING (Bandura): learning by WATCHING others. Bandura\'s Bobo doll experiment — kids who watched adults attack a doll mimicked the attacks.',
        'IMPORTANT: includes "modeling" — kids learn aggression, kindness, language, work habits largely by watching.',
        'EXAMPLES IN DAILY LIFE: classical (anxiety from associated triggers); operant (training pets, paychecks); observational (toddlers imitating speech).',
      ],
      vocabulary: [
        { term: 'classical conditioning', definition: 'learning by association of stimuli.' },
        { term: 'operant conditioning', definition: 'learning by consequences of behavior.' },
        { term: 'observational learning', definition: 'learning by watching others.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Identify the type for each: (a) child cries, parent gives candy, child cries more in future. (b) Smell of brewing coffee makes you alert. (c) Toddler imitates dad\'s pretend phone call.',
      steps: [
        '(a) Crying → reward (candy) → more crying. Behavior shaped by consequence → OPERANT CONDITIONING (positive reinforcement).',
        '(b) Coffee smell paired repeatedly with caffeine alertness → smell alone now triggers alertness. CLASSICAL CONDITIONING.',
        '(c) Watch and copy → OBSERVATIONAL LEARNING.',
      ],
      answer: '(a) operant, (b) classical, (c) observational',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A student studies hard, gets an A, then studies even harder for the next test. What kind of conditioning?',
      expectedAnswer: 'operant (positive reinforcement)',
      responseFormat: 'free',
      hints: [
        'Behavior (studying) was followed by a desirable outcome (A grade).',
        'Outcome shaped future behavior.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-reinforce',
      kind: 'misconception_check',
      question: 'Is negative reinforcement the same as punishment?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating negative reinforcement with punishment.',
          correctsTo: 'No — REINFORCEMENT (positive or negative) INCREASES behavior. Negative reinforcement REMOVES something unpleasant (taking aspirin to relieve a headache → more aspirin-taking next headache). PUNISHMENT (positive or negative) DECREASES behavior. Common confusion because of the word "negative".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Classical: associate stimuli (Pavlov).',
        'Operant: consequences shape behavior (Skinner).',
        'Observational: learning by watching (Bandura).',
        'Reinforcement INCREASES; punishment DECREASES.',
        'Partial reinforcement creates the most persistent behavior.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are slot machines so addictive in terms of operant conditioning?',
      hint: 'Variable-ratio schedule. Reward arrives on RANDOM presses. The brain expects a payoff but never knows when. This produces the most persistent and resistant-to-extinction behavior known.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
