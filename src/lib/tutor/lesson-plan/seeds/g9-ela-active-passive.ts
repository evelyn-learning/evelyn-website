/**
 * G9 — Active vs passive voice.
 *
 * The structural difference, when each is appropriate, and why
 * "active" usually = stronger writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ELA_ACTIVE_PASSIVE: LessonPlan = {
  id: 'evelyn.g9.ela.grammar.active-passive.v1',
  title: 'Active and passive voice',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'ela',
  topic: 'grammar',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.9-10.l.1.b',
      description: 'Use various types of phrases and clauses to convey specific meanings, including active vs passive voice.',
      standard: 'CCSS.ELA-LITERACY.L.9-10.1.B',
    },
  ],
  prerequisites: ['ccss.ela.7.l.1'],
  followUps: ['ccss.ela.11-12.l.1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Contrast two versions of the same sentence.',
      script: 'Compare: "The cat ate the fish." vs "The fish was eaten by the cat." Same fact — different feel. The first is ACTIVE, the second PASSIVE. Most of the time, the active version is stronger.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-structures',
      kind: 'concept',
      goal: 'Identify each by structure and choose the right one for context.',
      keyIdeas: [
        'ACTIVE VOICE: subject DOES the action. Subject + verb + object. "The dog chased the ball."',
        'PASSIVE VOICE: subject RECEIVES the action. Object becomes subject. "The ball was chased by the dog."',
        'Passive structure: form of "to be" (is/was/were) + past participle (chased, eaten, written). The actor is in a "by ___" phrase OR omitted entirely.',
        'WHEN ACTIVE WINS: most writing — clearer, more direct, fewer words.',
        'WHEN PASSIVE IS USEFUL: 1) Actor unknown ("My bike was stolen"). 2) Actor unimportant ("The vaccine was developed in 2020"). 3) Actor deliberately hidden — politicians say "mistakes were made" instead of "I made mistakes". 4) Scientific writing, where the focus is on what happened, not who did it.',
        'WARNING: passive voice gets blamed for "weak writing" but it has legitimate uses. The skill is choosing wisely.',
      ],
      vocabulary: [
        { term: 'active voice', definition: 'sentence where the subject performs the action.' },
        { term: 'passive voice', definition: 'sentence where the subject receives the action.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-flip',
      kind: 'worked_example',
      problem: 'Convert to active: "The pizza was eaten by the kids."',
      steps: [
        'Find the actor: "the kids" (in the "by" phrase).',
        'Find the action: "ate" (was eaten = past tense passive of "eat").',
        'Find the receiver: "the pizza".',
        'Active form: ACTOR + VERB + RECEIVER → "The kids ate the pizza."',
      ],
      answer: 'The kids ate the pizza.',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is this sentence active or passive? "The novel was written in 1925."',
      expectedAnswer: 'passive',
      responseFormat: 'free',
      hints: [
        'Look for "was/were/is/are" + past participle.',
        'Is the subject DOING something or RECEIVING?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-passive-bad',
      kind: 'misconception_check',
      question: 'Is passive voice always wrong or weak writing?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating passive voice as a universal mistake.',
          correctsTo: 'No — passive is the right choice when the actor is unknown, unimportant, or being deliberately de-emphasized. "The vaccine was developed" is clearer than "Some scientists developed the vaccine" if you don\'t want to focus on which ones. Skill > rule.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Active: subject DOES the action ("The chef cooked dinner").',
        'Passive: subject RECEIVES the action ("Dinner was cooked by the chef").',
        'Passive = form of "be" + past participle.',
        'Default to active. Use passive when actor is unknown, unimportant, or when the focus is on the receiver.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do politicians often use passive voice ("Mistakes were made")? What does it accomplish?',
      hint: 'It avoids naming the responsible party. Compare to "I made mistakes" — much more accountable.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
