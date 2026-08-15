/**
 * MCAT Format & Scoring (2024-2026 era).
 *
 * 4 sections, ~7h 30m total seated time, ~230 questions, scored 472-528.
 * Computer-based, mostly passage-driven, NO penalty for wrong answers.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_FORMAT_2025: LessonPlan = {
  id: 'evelyn.testprep.mcat.format-2025.v1',
  title: 'MCAT — Current Format, Scoring & Section Mechanics',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat',
  locale: 'en',
  los: [
    {
      id: 'mcat.format-2025',
      description: 'Recall the four MCAT sections, total time, scoring scale, score interpretation for med-school admissions, and the structural quirks (passage-based, CARS = no outside knowledge, no wrong-answer penalty).',
      standard: 'MCAT-FORMAT',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why understanding the format matters before content review.',
      script: 'The MCAT is the longest standardized test most pre-meds will ever sit — about 7.5 hours including breaks. Before you even open a content book, you should know exactly how the test is structured, scored, and weighted. The right strategy follows the format: passage-driven sections reward reading skill, CARS is unique because it allows zero outside knowledge, and your section-balance matters because med schools see all four scaled scores.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Section structure, timing, content distribution.',
      keyIdeas: [
        'FOUR SECTIONS, all multiple-choice, computer-based at Pearson VUE centers.',
        'CHEM/PHYS (Chemical and Physical Foundations of Biological Systems): 59 questions, 95 minutes. Tests gen chem (~30%), gen physics (~25%), organic chem (~15%), biochem (~25%), bio (~5%) — applied to biological/medical scenarios.',
        'CARS (Critical Analysis and Reasoning Skills): 53 questions, 90 minutes. 9 humanities/social-science passages, ~6 questions each. NO outside knowledge — answer only from the passage.',
        'BIO/BIOCHEM (Biological and Biochemical Foundations of Living Systems): 59 questions, 95 minutes. Bio (~65%), biochem (~25%), gen chem (~5%), organic (~5%).',
        'PSYCH/SOC (Psychological, Social, and Biological Foundations of Behavior): 59 questions, 95 minutes. Psych (~65%), socio (~30%), bio (~5%).',
        'PASSAGE-BASED: ~10 passages per science section with 4-7 questions each. ~15 standalone (discrete) questions per science section. CARS is 100% passage-based.',
        'NO WRONG-ANSWER PENALTY. Always guess on questions you can\'t solve — never leave blank.',
        'BREAK STRUCTURE: 10-min after Chem/Phys, 30-min lunch after CARS, 10-min after Bio/Biochem. Optional — don\'t skip them; you\'ll need every break.',
      ],
      vocabulary: [
        { term: 'CARS', definition: 'Critical Analysis and Reasoning Skills — MCAT\'s humanities/social-science reading section.' },
        { term: 'discrete (standalone) question', definition: 'an MCAT question not tied to any passage; pure content recall and application.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-scoring',
      kind: 'concept',
      goal: 'Scaled scoring, percentile interpretation, target scores.',
      keyIdeas: [
        'EACH SECTION scaled 118 (lowest) to 132 (highest). Midpoint = 125. Total composite = sum of 4 sections, range 472-528, midpoint 500.',
        'MEAN total ≈ 500 (re-centered). MEDIAN matriculant ≈ 511-512. Top-20 med schools median 518-520.',
        'PERCENTILES (rough): 500 = ~50th, 510 = ~80th, 515 = ~90th, 520 = ~95th, 525 = ~99th. Score-percentile mapping is published yearly by AAMC.',
        'SECTION BALANCE matters: schools look at each scaled score, not just composite. A 130/130/130/120 (510 total) reads as a CARS weakness. Aim for balanced ≥125 in every section.',
        'CARS most resistant to score improvement. Plan early, practice steadily.',
        'NO COMPOSITE SUBSCORES. Just the 4 section scores plus the total. There\'s no "verbal/quant" split.',
        'YEAR-TO-YEAR: identical scoring scale since 2015 reformatting; year-over-year scores are directly comparable.',
      ],
      vocabulary: [
        { term: 'scaled score', definition: 'a 118-132 standardized score per MCAT section, calibrated so that raw-score differences across test forms map to the same scaled score.' },
        { term: 'AAMC', definition: 'Association of American Medical Colleges — author and publisher of the MCAT.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A student scores 128 / 124 / 129 / 127 across the four MCAT sections. What is the composite total and roughly what percentile?',
      expectedAnswer: 'Total = 128 + 124 + 129 + 127 = 508. ~75th percentile (above mean of 500, below median matriculant ~511). The 124 in CARS would be a yellow flag — many top schools want ≥125 in every section.',
      responseFormat: 'numeric',
      hints: [
        'Total = sum of the four scaled scores.',
        '500 ≈ 50th percentile; 510 ≈ 80th; 515 ≈ 90th.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cars-content',
      kind: 'misconception_check',
      question: 'Should you bring outside knowledge from history, philosophy, or sociology classes to answer CARS questions?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating CARS like a content section.',
          correctsTo: 'No. CARS is the only MCAT section that explicitly tests reading and reasoning ALONE — every correct answer is supported BY THE PASSAGE. Bringing outside opinion or knowledge is the #1 reason high-content students underperform on CARS. Even if the passage gets a fact "wrong" by your standards, the right MCAT answer reflects the passage\'s argument, not yours. Train this discipline early.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '4 sections × 95 min (CARS = 90), ~230 Qs total. ~7h 30m seated.',
        'Each section 118-132. Total 472-528. Mean 500, matriculant median ~511.',
        'CARS: 100% passage-based, NO outside knowledge, hardest to improve.',
        'No wrong-answer penalty — always guess.',
        'Schools look at every section score; aim for balanced ≥125.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does AAMC scale every section to a 118-132 range instead of using raw scores?',
      hint: 'Raw scores aren\'t comparable across test forms — different sittings have slightly different difficulty. Scaling (equating) maps raw scores to a fixed 118-132 ladder so a 129 in May means the same as a 129 in September. This is why the official "score conversion" varies by form: a slightly easier form needs more raw-correct for the same scaled score. Composite percentiles are published from a multi-year rolling pool, so percentiles drift slightly even when scaled scores don\'t.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
