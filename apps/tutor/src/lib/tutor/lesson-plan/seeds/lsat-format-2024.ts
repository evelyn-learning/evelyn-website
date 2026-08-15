/**
 * LSAT — Post-August 2024 Format Overview.
 *
 * Logic Games (Analytical Reasoning) was removed effective August 2024
 * following a 2019 ADA settlement related to accessibility for blind
 * test-takers. A second Logical Reasoning section replaced it. Currency-
 * checked against LSAC's Aug 2024 announcement + Princeton Review and
 * U.S. News coverage of the change.
 */

import type { LessonPlan } from '../types';

export const SEED_LSAT_FORMAT_2024: LessonPlan = {
  id: 'evelyn.testprep.lsat.format-2024.v1',
  title: 'LSAT (Post-August 2024): Format and Why Logic Games Went Away',
  curriculum: 'LSAC',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'lsat',
  locale: 'en',
  los: [
    {
      id: 'lsat.format-2024',
      description: 'Describe the current LSAT structure post-August 2024 (2 LR + 1 RC + 1 unscored variable section), the unchanged 120-180 scoring scale, and why Logic Games was removed. Distinguish the LSAT exam itself from LSAT Argumentative Writing.',
      standard: 'LSAT-2024',
    },
  ],
  prerequisites: [],
  followUps: ['lsat.logical-reasoning', 'lsat.reading-comprehension'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Logic Games is gone — and that\'s the biggest LSAT change in 30 years.',
      script: 'For 33 years (1991-2024) the LSAT had three scored question types: Logical Reasoning, Reading Comprehension, and Logic Games (Analytical Reasoning). Then in August 2024 LSAC removed Logic Games entirely — replaced by a second Logical Reasoning section. The reason isn\'t that LR is harder; it\'s that Logic Games required diagramming, which disadvantaged blind test-takers (a 2019 ADA settlement forced the change). For students, the practical effect: you no longer need to grind 100 hours of grouping/sequencing puzzles. You DO need to be excellent at Logical Reasoning.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Sections, timing, scoring, and the variable section.',
      keyIdeas: [
        'FOUR SECTIONS, all 35 minutes each: TWO scored Logical Reasoning sections, ONE scored Reading Comprehension section, ONE UNSCORED variable section (could be a third LR or a second RC — used to pilot items for future tests).',
        'YOU WON\'T KNOW which section is unscored. Treat every section as if it counts.',
        'TOTAL TIME: ~3 hours including instructions and a 10-minute break between sections 2 and 3.',
        'SCORING SCALE UNCHANGED: 120-180. Curve calibrated so a few points typically separate the median (~152) from a 170 (90th percentile).',
        'NO PENALTY for wrong answers. Always answer every question — guess if needed.',
        'LSAT ARGUMENTATIVE WRITING: a separate, untimed-on-test-day component. You complete it online within ~1 year of taking the LSAT. UNSCORED but REQUIRED — every law school receives it. Replaced the older 35-minute on-site writing sample in 2024.',
        'FROM JUNE 2024 to NOW: Logic Games removed. From August 2024 forward, all LSATs use the 2 LR + 1 RC + 1 variable structure.',
        'STARTING AUGUST 2026: LSAC moving toward in-person testing for most US/international takers (away from at-home testing). Doesn\'t change content.',
      ],
      vocabulary: [
        { term: 'Logical Reasoning (LR)', definition: 'an LSAT section testing analysis of short arguments — strengthen, weaken, assumption, etc.' },
        { term: 'Reading Comprehension (RC)', definition: 'an LSAT section with long passages followed by 5-8 questions, including some passage-pair items.' },
        { term: 'variable section', definition: 'an unscored experimental LSAT section LSAC uses to pilot future questions; could be LR or RC.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-impact',
      kind: 'concept',
      goal: 'What changed for prep, what didn\'t.',
      keyIdeas: [
        'PREP TIME REALLOCATION: students who used to spend 30-40% of prep on Logic Games can now spend it on Logical Reasoning instead. LR is now ~50% of your scored test (2 of 3 scored sections).',
        'OLD Logic Games BOOKS / COURSES: irrelevant for the new format. Don\'t buy used 2022 Manhattan / Powerscore Logic Games Bibles unless purely for fun. The strategy didn\'t transfer.',
        'WHAT DIDN\'T CHANGE: the difficulty curve, the 120-180 scale, percentile distributions, the test\'s gatekeeper role for law school admissions. Mean scores held essentially flat after the change (LSAC research on 200,000+ test sessions showed a 0.01-point shift).',
        'WRITING SAMPLE shifted format too: from a 35-minute proctored argumentative response on test day, to an UNTIMED online "LSAT Argumentative Writing" you can take separately. Required to apply to most law schools, but never graded — readers see your raw response.',
        'CALCULATOR + NOTES: not allowed. You\'ll be given scratch paper for diagramming during LR, especially for sequencing-style arguments and conditional logic ("if X then Y").',
      ],
      vocabulary: [
        { term: 'percentile', definition: 'the percentage of test-takers who scored at or below a given score; 90th percentile ≈ 170.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You finish your LSAT, and one of the four sections felt strange — different from the others. Should you assume it was the unscored variable section?',
      expectedAnswer: 'Maybe — but never trust this guess on test day. LSAC deliberately makes the variable section feel like the others. If you treated it as unscored and slacked off, and you guessed wrong, you\'ve thrown away ~25% of your score. Always perform on every section. Find out which was experimental only after scores release.',
      responseFormat: 'free',
      hints: [
        'The variable section is designed to feel scored.',
        'Best strategy is the same on every section.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-logic-games-still-useful',
      kind: 'misconception_check',
      question: 'Studying Logic Games puzzles is still useful preparation for the modern LSAT because they teach formal logic skills you\'ll use in Logical Reasoning. True or false?',
      commonErrors: [
        {
          answer: 'true — formal logic transfers',
          misconception: 'Overestimating the transfer between Logic Games diagramming and LR argument-analysis.',
          correctsTo: 'Mostly false. Logic Games tested closed-system puzzle solving (e.g., "if A is third, then B must be fifth"). Logical Reasoning tests argument analysis — identifying assumptions, finding flaws in real-world reasoning, evaluating evidence. Some conditional-logic tools transfer (contrapositive, biconditional), but LR doesn\'t require the diagramming skill that dominated Logic Games prep. For limited prep time, drill more LR — fewer hours on legacy Logic Games material.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 sections, 35 min each. 2 scored LR + 1 scored RC + 1 unscored variable.',
        'Score 120-180. Median ~152, 170 ≈ 90th percentile.',
        'Logic Games gone since Aug 2024. Argumentative Writing is separate, untimed, unscored, required.',
        'Treat every section as scored. No penalty for wrong answers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did LSAC choose to ADD a second Logical Reasoning section instead of, say, two Reading Comprehension sections, when removing Logic Games?',
      hint: 'LR is the most predictive single section of law school performance — it tests argument analysis, the bread-and-butter cognitive skill of legal practice. Doubling the LR signal sharpens the test\'s validity. RC is also relevant but more passage-luck-dependent (some RC passages are easier than others; doubling RC would amplify that variance). LSAC research showed a second LR section preserved the score distribution better than alternatives. The change was empirically driven, not just an obvious swap.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
