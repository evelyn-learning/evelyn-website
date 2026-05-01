/**
 * NCLEX — National Council Licensure Examination strategy.
 *
 * Adaptive nursing licensure exam. Maslow\'s hierarchy + ABCs +
 * safety prioritization.
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.nclex.strategy.v1',
  title: 'NCLEX strategy: prioritization frameworks for nursing licensure',
  curriculum: 'CCSS',
  grade: 'nursing',
  subject: 'test-prep',
  topic: 'nclex-rn',
  locale: 'en',
  los: [
    {
      id: 'nclex.strategy',
      description: 'Apply NCLEX-style prioritization frameworks for nursing licensure questions.',
      standard: 'NCLEX',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'NCLEX as a different kind of test.',
      script: 'NCLEX (RN or PN) doesn\'t just test what you know — it tests how you THINK as a nurse. Most questions have multiple "correct" actions; you must pick the BEST one. Frameworks for prioritizing are your edge.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Format + adaptive scoring + key prioritization frameworks.',
      keyIdeas: [
        'FORMAT: Computer Adaptive Test (CAT). Questions get harder when you answer correctly, easier when you don\'t. Test ENDS when the algorithm is 95% confident in your competence.',
        'LENGTH: variable. Minimum 75 questions, max 145 (NCLEX-RN). Test can end at 75 if confident.',
        'PASSING: not a percentage — based on COMPETENCE level. The algorithm decides.',
        'QUESTION FORMATS: multiple choice, multiple response (select all that apply), fill-in-the-blank (calculations), drag-and-drop ordering, hot spot, video.',
        'PRIORITIZATION FRAMEWORKS:',
        '  ABCs: AIRWAY → BREATHING → CIRCULATION. The patient who can\'t breathe gets attention BEFORE the patient with chest pain.',
        '  MASLOW: physiological needs → safety → love → esteem → self-actualization. Lower-level needs come first.',
        '  SAFETY: prevent harm. A confused patient at risk of falling outranks a stable patient with mild pain.',
        '  ACUTE > CHRONIC: a new sudden problem outranks a stable chronic one.',
        '  UNSTABLE > STABLE: deteriorating patient first.',
        'COMMON TRAP: choosing what you "would like to do" rather than what the protocol mandates. NCLEX wants the answer per nursing standards, not personal preference.',
        'AVOID extreme answers like "always", "never", "all" — usually wrong in clinical reality.',
        'When stuck between two: pick the one that addresses an IMMEDIATE life threat or that you can do FIRST.',
      ],
      vocabulary: [
        { term: 'CAT', definition: 'Computer Adaptive Test — adjusts difficulty based on responses.' },
        { term: 'ABCs', definition: 'Airway, Breathing, Circulation — clinical prioritization order.' },
        { term: 'Maslow\'s hierarchy', definition: 'pyramid of human needs from physiological to self-actualization.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-prioritize',
      kind: 'worked_example',
      problem: 'You have four patients. Whom do you assess FIRST? (1) Stable post-op recovering well. (2) New admission with chest pain. (3) Patient calling for pain medication. (4) Patient expressing breathing difficulty.',
      steps: [
        'Apply ABCs.',
        'Patient 4: "breathing difficulty" — AIRWAY/BREATHING issue. Highest priority.',
        'Patient 2: chest pain (CIRCULATION concern, possibly cardiac). Second.',
        'Patient 3: pain — important but not life-threatening.',
        'Patient 1: stable, lowest immediate priority.',
        'Order: 4 → 2 → 3 → 1.',
        'Reasoning: airway/breathing always precedes circulation precedes comfort.',
      ],
      answer: 'patient 4 first (breathing difficulty)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does NCLEX END after as few as 75 questions for some test-takers?',
      expectedAnswer: 'computer adaptive — algorithm reaches 95% confidence about competence; can be high competence (passing fast) or low (failing fast)',
      responseFormat: 'free',
      hints: [
        'Adaptive test based on confidence intervals.',
        'Stops EARLY when confident either way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-everything-correct',
      kind: 'misconception_check',
      question: 'On NCLEX, are all the answer choices wrong except one?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating NCLEX like other tests.',
          correctsTo: 'No — multiple choices may be technically correct nursing actions. The question asks for the BEST or FIRST one. Apply frameworks (ABCs, Maslow, safety) to choose. This is what makes NCLEX hard for content-strong students new to clinical reasoning.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CAT format: variable length, ends at confidence threshold.',
        'Multiple "correct" answers; pick the BEST.',
        'Frameworks: ABCs, Maslow, safety, acute > chronic, unstable > stable.',
        'Apply nursing standards, not personal preference.',
        'Avoid extreme-language answers ("always", "never").',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does NCLEX adopt computer-adaptive testing rather than fixed-length?',
      hint: 'Efficiency — competent test-takers pass faster; struggling ones identified faster. Reduces overall test time. Better measurement at the borderline (where competence decisions matter most). More content security — different test-takers see different items.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
