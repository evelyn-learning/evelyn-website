/**
 * GRE Verbal — Reading Comprehension.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_VERBAL_READING_COMP: LessonPlan = {
  id: 'evelyn.testprep.gre.verbal.reading-comp.v1',
  title: 'GRE Verbal — Reading Comprehension Strategy',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-verbal',
  locale: 'en',
  los: [
    {
      id: 'testprep.gre.verbal.reading-comp',
      description: 'Drill GRE Reading Comprehension: short and long passages, main-idea + detail + inference + tone questions, "select all that apply" variants.',
      standard: 'GRE-VERBAL',
    },
  ],
  prerequisites: ['testprep.gre.verbal.sentence-equiv'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE Reading Comprehension passages are dense and fast — strategy matters as much as comprehension.',
      script: 'Each passage gets 1-4 questions. Spend 2 minutes reading + 1 minute per question. Some passages are humanities, some social science, some natural science. Today we cover the question types and the read-then-attack approach that maximises accuracy under time pressure.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-comp',
      kind: 'concept',
      goal: 'Passage approach, question types, "select all", argument analysis.',
      keyIdeas: [
        'TIME: ~2 min reading + 1 min per question. A 4-question passage takes ~6 min total.',
        'READING APPROACH:',
        '  Read the WHOLE passage first (don\'t skim — GRE passages are dense and skimming costs accuracy).',
        '  Note the MAIN ARGUMENT in your head (or scratchpad): what is the author CLAIMING and what EVIDENCE supports it?',
        '  Note SHIFTS in tone or argument (counterexamples, qualifications).',
        'QUESTION TYPES:',
        '  MAIN IDEA: skim for the thesis statement (often near beginning or end).',
        '  DETAIL: hunt for the specific phrase; verify in context.',
        '  INFERENCE: what does the passage IMPLY? Avoid extreme answers.',
        '  TONE/PURPOSE: characterise author attitude or section function.',
        '  ARGUMENT STRUCTURE: identify counterexamples, qualifications, premises.',
        '  SELECT ALL THAT APPLY: GRE-specific. Up to three answer choices may all be correct. Evaluate each independently.',
        '  HIGHLIGHT-IN-PASSAGE: rare; click on the sentence that performs a stated function.',
        'PROCEDURE per question:',
        '  Read the question STEM.',
        '  Predict an answer in your own words BEFORE reading choices.',
        '  Eliminate choices that contradict the passage or use extreme language.',
        '  Pick the closest match.',
        '  For "select all" questions, evaluate each choice independently — don\'t cap your selections.',
        'COMMON TRAPS:',
        '  Answers that go BEYOND what the passage states.',
        '  Answers that REVERSE a relationship (cause vs effect).',
        '  Answers that match individual words from the passage but in a different context.',
      ],
      vocabulary: [
        { term: 'argument structure', definition: 'how the passage builds its case — main claim, supporting evidence, counterarguments, qualifications.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A passage describes a study where caffeine improved memory test scores in older adults. The author concludes caffeine MAY have neuroprotective effects but cautions that the study was observational with possible confounders. Question: "The author\'s primary purpose is to..." (A) advocate for caffeine consumption, (B) discuss preliminary evidence with appropriate caveats, (C) refute claims about caffeine, (D) compare two studies.',
      steps: [
        'Identify the author\'s overall stance. The passage describes findings + caveats.',
        '(A) advocate — too strong; the author cautions, not advocates.',
        '(B) discuss with caveats — matches: presents findings + acknowledges limitations.',
        '(C) refute — opposite of what the passage does.',
        '(D) compare two studies — only one study mentioned.',
        'Answer: (B). Tone questions usually favour nuanced answers; extremes are usually wrong.',
      ],
      answer: '(B) discuss preliminary evidence with appropriate caveats',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A passage argues that the rise of social media has reduced face-to-face conversation among teens. SELECT ALL THAT APPLY: which would WEAKEN the author\'s argument? (A) Teen text-messaging volume has dropped. (B) Studies show teens still spend equal time with friends in person. (C) Adults\' face-to-face conversation has also declined. (D) Teens report richer in-person conversations than 10 years ago.',
      expectedAnswer: '(B) and (D). (B) directly contradicts the claim — teens still see friends face-to-face. (D) contradicts a related claim — quality of in-person conversation hasn\'t declined. (A) doesn\'t directly address face-to-face. (C) is a related observation but doesn\'t weaken the teen-specific claim. For "select all," evaluate each independently — don\'t feel pressure to pick more or fewer than naturally apply.',
      responseFormat: 'free',
      hints: [
        'Each "weaken" option must contradict the SPECIFIC claim about teen face-to-face conversation.',
        'Some options are about adults — irrelevant to a teen-specific claim.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-skim',
      kind: 'misconception_check',
      question: 'A student tries to save time by skimming GRE passages instead of reading them. Why does this often hurt the score?',
      commonErrors: [
        {
          answer: 'Skim to save time',
          misconception: 'Treating GRE passages like newspaper articles.',
          correctsTo: 'GRE passages are extremely dense — every sentence carries weight. Skimming misses qualifications, shifts in argument, or counterexamples that questions specifically test on. The correct strategy: read more carefully but FEWER passages closely. Better to spend 2.5 min reading well and answering with high accuracy than to skim and need multiple re-reads. Track time on questions, not on reading.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read first; predict the answer before looking at choices.',
        'Avoid extreme answers on inference / tone questions.',
        '"Select all that apply" — evaluate each independently.',
        'Don\'t skim — GRE passages reward careful reading.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
