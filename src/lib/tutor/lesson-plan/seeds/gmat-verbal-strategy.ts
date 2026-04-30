/**
 * GMAT — Verbal Reasoning strategy.
 *
 * Sentence correction, critical reasoning, reading comprehension.
 * Rapid-fire pattern recognition.
 */

import type { LessonPlan } from '../types';

export const SEED_GMAT_VERBAL_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.gmat.verbal-strategy.v1',
  title: 'GMAT Verbal: SC, CR, RC',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'gmat.verbal-strategy',
      description: 'Apply effective strategy to GMAT verbal section across three question types.',
      standard: 'GMAT-VERBAL',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame verbal as fast pattern recognition.',
      script: 'GMAT verbal moves FAST — about 1.8 minutes per question for ~36 questions. The skill is recognizing the underlying pattern in each question type quickly, not deep reading.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'Three question types + signature strategies.',
      keyIdeas: [
        'SENTENCE CORRECTION (SC): a sentence with one part underlined; pick the version that is grammatically correct AND most concise. Test grammar (subject-verb agreement, parallelism, modifiers, pronoun reference) AND style (avoid wordiness).',
        'SC strategy: read the original. Look for grammar errors. If none, look for clearer/more concise phrasing. Eliminate aggressively.',
        'CRITICAL REASONING (CR): a short argument followed by a question (strengthen, weaken, assumption, inference, find the flaw). Identify the conclusion and the evidence; pick the choice that does what the question asks.',
        'CR strategy: read the question FIRST. Then read the argument knowing what to look for. Conclusion vs evidence is critical.',
        'READING COMPREHENSION (RC): passages of varying length followed by questions. Active reading: identify main idea, structure, tone.',
        'COMMON RC trap: a choice that\'s technically supported by the passage but doesn\'t answer the asked question.',
        'TIME: ~62 minutes for ~36 questions. ~1.7 min/question average. Don\'t over-invest.',
      ],
      vocabulary: [
        { term: 'sentence correction', definition: 'a GMAT question type testing grammar and clarity.' },
        { term: 'critical reasoning', definition: 'a GMAT question type testing logical analysis of arguments.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-cr',
      kind: 'worked_example',
      problem: 'Strategy walk-through for a CR weaken question: "Sales of widgets rose 20% after the company added a smiley face to the package. Therefore, the smiley face caused the sales increase."',
      steps: [
        'Identify CONCLUSION: smiley face caused the sales increase.',
        'Identify EVIDENCE: sales rose 20% after smiley was added.',
        'For WEAKEN, find a choice that suggests something ELSE caused the increase (alternative cause, confounder, missing baseline).',
        'Strong weakener candidates: "the company also doubled marketing spend at the same time", "the industry overall grew 25% that quarter".',
        'Both suggest the smiley wasn\'t the cause — alternative explanations exist.',
      ],
      answer: 'find an alternative cause for the sales increase',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In SC, between two grammatically correct choices, what generally wins?',
      expectedAnswer: 'the more concise / clearer one',
      responseFormat: 'free',
      hints: [
        'GMAT SC values economy.',
        'Wordy passive constructions tend to lose.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rc-memorize',
      kind: 'misconception_check',
      question: 'For RC, should you try to memorize the passage and answer from memory?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Trying to retain RC passages.',
          correctsTo: 'No — RC questions are designed to trip up confident memory. Always REFER BACK to the passage to verify. Memory introduces errors; the text is right there.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three types: SC (grammar + clarity), CR (argument logic), RC (passage analysis).',
        'CR: read the question first.',
        'SC: prefer concise; eliminate aggressively.',
        'RC: refer back to passage; don\'t trust memory.',
        '~1.7 min/question — pace yourself.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does GMAT include sentence correction? What does it test that other verbal sections don\'t?',
      hint: 'Business writing demands clarity and concision. SC stress-tests editorial judgment in dense English. Real-world value: a rep who writes clear emails saves everyone\'s time.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
