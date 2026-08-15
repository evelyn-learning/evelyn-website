/**
 * Grades 6-8 ELA — Active vs Passive Voice.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_ACTIVE_PASSIVE_VOICE: LessonPlan = {
  id: 'evelyn.g68.ela.active-passive-voice.v1',
  title: 'Grades 6-8 ELA — Active vs Passive Voice',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.active-passive-voice',
      description: 'Identify and convert between active and passive voice; choose the right voice for the writing\'s purpose.',
      standard: 'CCSS.ELA-LITERACY.L.7.1.C',
    },
  ],
  prerequisites: ['g68.ela.sentence-variety'],
  followUps: ['g68.ela.word-choice'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Active voice is usually stronger — but passive has its place.',
      script: 'ACTIVE: "The cat chased the mouse." PASSIVE: "The mouse was chased by the cat." Same event. Active is direct and energetic; passive feels distanced. Most writing benefits from active voice. But passive isn\'t wrong — it has a job. Today we drill both and when to pick each.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-voice',
      kind: 'concept',
      goal: 'Definition + recognition + conversion + when to use passive.',
      keyIdeas: [
        'ACTIVE VOICE: subject performs the action. SUBJECT → VERB → OBJECT. "The dog buried the bone."',
        'PASSIVE VOICE: subject receives the action. OBJECT → BE-VERB + PAST PARTICIPLE → (BY ACTOR). "The bone was buried by the dog."',
        'PASSIVE FORMULA: form of "to be" (am/is/are/was/were/been/being) + past participle (-ed for regular verbs).',
        'CONVERTING ACTIVE → PASSIVE: swap subject and object. Add "be" + past participle. Original subject moves to "by..." (or omitted).',
        'CONVERTING PASSIVE → ACTIVE: identify the actual actor (often after "by"). Make them the subject. Use a direct verb.',
        'WHEN TO USE PASSIVE: 1) Actor unknown ("The window was broken"). 2) Actor irrelevant ("The package was delivered"). 3) Emphasising the receiver ("The student was praised by the teacher"). 4) Scientific writing ("The solution was heated").',
        'WHEN TO USE ACTIVE: most other times. Active voice is shorter, clearer, and more energetic.',
        'COMMON ERROR: using passive to sound formal. Often makes writing wordy and weak.',
      ],
      vocabulary: [
        { term: 'active voice', definition: 'a sentence where the subject performs the action.' },
        { term: 'passive voice', definition: 'a sentence where the subject receives the action.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-convert',
      kind: 'worked_example',
      problem: 'Convert this passive sentence to active: "The cake was eaten by the children."',
      steps: [
        'Identify the actor: "the children".',
        'Make actor the subject: "The children..."',
        'Use a direct verb (active form of the past participle): "ate".',
        'Original subject becomes object: "the cake".',
        'Active version: "The children ate the cake."',
        'Notice: shorter, more direct.',
      ],
      answer: '"The children ate the cake."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Convert this active sentence to passive: "The students wrote the essays."',
      expectedAnswer: '"The essays were written by the students."',
      responseFormat: 'free',
      hints: [
        'Object becomes subject: "The essays..."',
        'Add "were" + past participle "written".',
        'Add "by the students" at end.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-passive-bad',
      kind: 'misconception_check',
      question: 'A student rewrites every passive sentence in their essay to active. Is "always avoid passive" the right rule?',
      commonErrors: [
        {
          answer: 'Always avoid passive',
          misconception: 'Treating a stylistic preference as an absolute rule.',
          correctsTo: 'Passive has legitimate uses: when the actor is unknown, irrelevant, or when the receiver is the focus. "The window was broken" is correct if you don\'t know who broke it. Scientific writing uses passive for objectivity: "The mixture was heated to 100°C". The rule is "default to active, choose passive deliberately when it serves the meaning". Not all passive is bad.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Active: subject does the action.',
        'Passive: subject receives the action; uses "be + past participle".',
        'Default to active for clarity and energy.',
        'Use passive when actor is unknown, irrelevant, or receiver is the focus.',
        'Scientific writing often uses passive.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When might passive voice be PREFERRED in journalism?',
      hint: 'When the actor is unknown or contested. "Three protesters were arrested" — passive avoids attributing the action to a specific source if it\'s not yet verified. Or: "Mistakes were made" — passive can dodge accountability (sometimes deliberately, sometimes legitimately when no single actor is responsible). Journalists weigh accuracy and tone when choosing voice.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
