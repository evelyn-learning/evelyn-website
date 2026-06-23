/**
 * MCAT — Medical College Admission Test strategy.
 *
 * Format, content sections, scoring, time management, prep approach.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.mcat.strategy.v1',
  title: 'MCAT strategy: format, sections, prep approach',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'test-prep',
  topic: 'mcat',
  locale: 'en',
  los: [
    {
      id: 'mcat.strategy',
      description: 'Plan an effective approach to the MCAT including content review, practice, and pacing.',
      standard: 'MCAT-STRAT',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'MCAT as the gatekeeper of US medical school.',
      script: 'The MCAT is ~7.5 hours, ~230 questions, covers biology + chemistry + physics + biochemistry + psychology + sociology + critical reading. Almost every US med school requires it. Strategy and stamina matter as much as content knowledge.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format-prep',
      kind: 'concept',
      goal: 'Format + sections + scoring + prep timeline.',
      keyIdeas: [
        'FORMAT: 4 sections, all multiple choice. ~7.5 hours total with breaks.',
        '  CHEM/PHYS: chem + physics + general physics applied to biology. ~95 min, 59 Qs.',
        '  CARS (Critical Analysis and Reasoning): humanities passages with reasoning questions. ~90 min, 53 Qs. NO outside knowledge needed.',
        '  BIO/BIOCHEM: bio + biochem. ~95 min, 59 Qs.',
        '  PSYCH/SOC: psychology + sociology + behavioral science. ~95 min, 59 Qs.',
        'SCORING: each section 118-132. Total 472-528. Median ~500. Top med schools median ~518-520.',
        'PASSAGE-BASED: most questions tied to research-style passages. Skill: extract info from unfamiliar science passages quickly.',
        'CARS is HEAVILY weighted in admissions. Reading speed and reasoning rule. Practice CARS regularly even when content review focuses elsewhere.',
        'PREP TIMELINE: typically 3-6 months full study, 300-500 hours total.',
        '  Phase 1: content review (outline gaps, learn missing topics).',
        '  Phase 2: practice questions sectioned by topic.',
        '  Phase 3: full-length practice tests under timed conditions. Critical for stamina.',
        'COMMON resources: AAMC official materials (most representative), commercial prep (Kaplan, Princeton Review, etc.).',
        'TEST-DAY: bring ID, eat well, hydrate strategically, plan bathroom breaks at section boundaries.',
      ],
      vocabulary: [
        { term: 'CARS', definition: 'Critical Analysis and Reasoning Skills section — humanities reading.' },
        { term: 'AAMC', definition: 'Association of American Medical Colleges — makers of the MCAT.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cars',
      kind: 'worked_example',
      problem: 'Why is the CARS section uniquely important for med-school admissions?',
      steps: [
        'CARS isn\'t a science section — it tests pure reading and reasoning.',
        'Med schools view CARS as a proxy for the kind of analytical reading needed in clinical practice (interpreting studies, parsing patient histories).',
        'Many schools weight CARS heavily — even more than aggregate GPA in some cases.',
        'PREP: read dense humanities texts daily. Practice slow, careful reading where you EXTRACT main idea + author position + evidence.',
        'NO outside knowledge needed — you must answer ONLY from the passage. Resist bringing your own opinions.',
        'CARS scores improve SLOWLY with practice — start early.',
      ],
      answer: 'tests reading comprehension under pressure, weighted heavily by med schools',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How long total for a serious MCAT prep?',
      expectedAnswer: '300-500 hours, typically 3-6 months',
      responseFormat: 'free',
      hints: [
        'Full content review + practice questions + full-length practice tests.',
        'Months of consistent study, not weeks.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-content-only',
      kind: 'misconception_check',
      question: 'Is MCAT prep mostly about memorizing content?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating MCAT as memorization-heavy.',
          correctsTo: 'No — MCAT mostly tests APPLICATION of content to passages you\'ve never seen. Content knowledge is necessary but not sufficient. The skill is reading complex passages, integrating info, applying concepts. Practice questions and full-length tests train this.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '7.5 hours, 4 sections (Chem/Phys, CARS, Bio/Biochem, Psych/Soc).',
        'CARS = pure reading/reasoning; weighted heavily.',
        'Most questions tied to research passages.',
        'Plan ~300-500 hours over 3-6 months.',
        'Full-length practice tests are non-negotiable for stamina.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do many test-takers improve more from PRACTICE than from MORE CONTENT REVIEW?',
      hint: 'Most students know more content than they realize but can\'t deploy it under time pressure. Practice teaches: pacing, format familiarity, test-mindedness, reading dense passages efficiently. Beyond a baseline, practice yields more than additional review.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
