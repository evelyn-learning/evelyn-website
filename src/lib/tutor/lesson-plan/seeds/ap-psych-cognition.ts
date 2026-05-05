/**
 * AP Psychology — Cognition: thinking, language, problem-solving.
 *
 * Concepts, prototypes, heuristics, biases, language acquisition.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PSYCH_COGNITION: LessonPlan = {
  id: 'evelyn.ap.psych.cognition.v1',
  title: 'Cognition: thinking, problem-solving, language',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'social-studies',
  topic: 'ap-psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.cognition',
      description: 'Identify cognitive processes including problem-solving, heuristics, biases, and language.',
      standard: 'AP-PSYCH-COG',
    },
  ],
  prerequisites: ['appsych.memory'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame thinking as patterned, not free.',
      script: 'You think you choose freely. Actually your brain runs on shortcuts called HEURISTICS that mostly work — until they fail. Cognitive biases aren\'t bugs; they\'re the trade-off for fast, mostly-right thinking. Today: how the mind handles the world.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Concepts + heuristics + biases + language.',
      keyIdeas: [
        'CONCEPTS: mental categories. Help organize the world. PROTOTYPE = the most typical example (a robin is a more prototypical bird than a penguin).',
        'PROBLEM SOLVING:',
        '  ALGORITHM: step-by-step procedure that guarantees solution (slow but reliable).',
        '  HEURISTIC: mental shortcut (fast but can err).',
        '  INSIGHT: sudden "aha" — solution arrives without conscious step-through.',
        'COMMON HEURISTICS / BIASES (Kahneman & Tversky):',
        '  AVAILABILITY: judge frequency by how easily examples come to mind. Why people overestimate plane crash deaths (vivid, on news) vs car-crash deaths (common, undercounted).',
        '  REPRESENTATIVENESS: judge probability by similarity to a stereotype. Conjunction fallacy: "Linda is a feminist bank teller" judged more likely than "Linda is a bank teller" — impossible (subset).',
        '  ANCHORING: first number heard biases later estimates. "Was Gandhi older or younger than 144 when he died?" → estimates higher than "older or younger than 32?".',
        '  CONFIRMATION BIAS: seek and remember information confirming existing beliefs.',
        '  FRAMING: same fact, presented differently, changes decisions. "90% survival" feels different from "10% mortality".',
        'LANGUAGE: phonemes (sounds) → morphemes (smallest meaning units) → words → grammar.',
        'CHOMSKY: humans have innate LANGUAGE-ACQUISITION DEVICE. Critical period — easy to learn before puberty, much harder after.',
      ],
      vocabulary: [
        { term: 'heuristic', definition: 'a mental shortcut for fast judgment or decision.' },
        { term: 'cognitive bias', definition: 'a systematic error in thinking caused by heuristics.' },
        { term: 'critical period', definition: 'a window of development when language acquisition is easiest.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-availability',
      kind: 'worked_example',
      problem: 'Why do people overestimate the danger of plane travel relative to car travel?',
      steps: [
        'AVAILABILITY HEURISTIC: we judge frequency by how easily examples come to mind.',
        'Plane crashes: rare but VIVID, often on news, photos of wreckage. Easy to recall.',
        'Car crashes: thousands daily, brief local news, rarely viral. Hard to recall specific instances.',
        'Result: brain says "I can think of plane crashes more easily" → "planes must be more dangerous".',
        'Reality: per mile, planes are MUCH safer than cars. Driving 12 miles ≈ same risk as a typical flight.',
        'The heuristic uses RECALL ease as a proxy for REAL frequency — and recall is biased by media coverage.',
      ],
      answer: 'availability heuristic — vivid plane crashes are easier to recall than common car crashes',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re told a person is "introverted, neat, detailed." Asked: librarian or salesperson? Why is this a trap?',
      expectedAnswer: 'representativeness — but salespeople vastly outnumber librarians; base rates favor "salesperson"',
      responseFormat: 'free',
      hints: [
        'You match traits to the librarian stereotype.',
        'But you\'re ignoring base rates.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rational',
      kind: 'misconception_check',
      question: 'Are humans usually rational decision-makers?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Believing classical-economics rational-actor model.',
          correctsTo: 'No — decades of research (Kahneman, Tversky) show systematic biases. Humans use heuristics that are EFFICIENT but not rational. Behavioral economics has rebuilt the field around this: "predictably irrational".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Concepts organize via prototypes.',
        'Problem-solving: algorithms (reliable), heuristics (fast).',
        'Common biases: availability, representativeness, anchoring, confirmation, framing.',
        'Language has structure phonemes → morphemes → grammar; acquisition has a critical period.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might evolution have favored heuristics over algorithms?',
      hint: 'Speed mattered — predators don\'t wait for full analysis. A quick "probably-right" answer was usually better than a slow exact one. Heuristics succeed in average cases. They fail in modern situations evolution didn\'t prepare us for (statistics, abstract risks).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
