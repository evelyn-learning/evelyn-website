/**
 * GCSE Math Higher — Histograms with Frequency Density.
 * Unequal class widths, frequency density = frequency / class width,
 * area = frequency interpretation.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_HISTOGRAMS: LessonPlan = {
  id: 'evelyn.gcse.math.histograms.v1',
  title: 'GCSE Higher — Histograms (Frequency Density)',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.histograms',
      description: 'Construct and interpret histograms with unequal class widths using frequency density; estimate counts within sub-intervals from the area.',
      standard: 'GCSE-MATH-S3',
    },
  ],
  prerequisites: ['gcse.math.cumulative-freq'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Histograms with unequal class widths trip up most candidates — but the rule "area = frequency" makes them mechanical.',
      script: 'A bar chart has uniform bar widths and bar HEIGHT shows frequency. A histogram allows DIFFERENT widths, so we use AREA to show frequency. The y-axis becomes "frequency density" — a slightly weird unit you only see in this context. Once you internalise area = frequency, every histogram question becomes addition and multiplication.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-density',
      kind: 'concept',
      goal: 'Frequency density formula, drawing rules, and the area-frequency principle.',
      keyIdeas: [
        'FREQUENCY DENSITY = frequency / class width. Plotted on the y-axis. Units: count per unit width.',
        'AREA OF A BAR = frequency density × class width = (frequency/width) × width = FREQUENCY. So bar area gives the count in that class.',
        'TOTAL FREQUENCY = sum of all bar areas. Useful for finding total sample size from a graph.',
        'TO ESTIMATE A SUB-INTERVAL: if the question asks "how many were between 10 and 14" but the class is 8 to 16 with frequency 24 — assume uniform distribution within the class. Sub-area = (4/8) × 24 = 12. (Half the class width → half the count.)',
        'DRAWING TIP: never leave gaps between bars (continuous data). The width is determined by the class boundaries.',
        'HEIGHT INTUITION: a NARROW class with the same frequency as a WIDE class will appear TALLER. Bars look uneven, which is correct.',
        'COMPARING WITH BAR CHARTS: bar chart for discrete categories (height = frequency). Histogram for continuous data with unequal classes (height = density, area = frequency).',
      ],
      vocabulary: [
        { term: 'frequency density', definition: 'frequency divided by class width; the y-axis scale on a histogram with unequal class widths.' },
        { term: 'class width', definition: 'the size of an interval in grouped continuous data, e.g. 5 ≤ x < 10 has width 5.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build-histogram',
      kind: 'worked_example',
      problem: 'Times taken (min): 0–10 had frequency 5; 10–30 had frequency 24; 30–40 had frequency 15; 40–60 had frequency 8. Compute the frequency density for each class. Then estimate the number of times between 20 and 30 minutes.',
      steps: [
        'Class widths: 10, 20, 10, 20.',
        'Frequency densities: 5/10 = 0.5; 24/20 = 1.2; 15/10 = 1.5; 8/20 = 0.4.',
        'For "20–30 minutes": this is HALF of the 10–30 class (which has width 20). Estimate uses uniform-within-class assumption.',
        'Estimated frequency in 20–30 = (10/20) × 24 = 12.',
        'EQUIVALENT view: sub-area = density × sub-width = 1.2 × 10 = 12. Same answer either way.',
      ],
      answer: 'Densities: 0.5, 1.2, 1.5, 0.4. Estimated 20–30 min frequency: 12.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A histogram bar covers 5 ≤ x < 15 and has height (frequency density) 4. What is the frequency for that class?',
      expectedAnswer: '40',
      responseFormat: 'numeric',
      hints: [
        'Frequency = density × class width.',
        'Width = 15 − 5 = 10.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tall-bar',
      kind: 'misconception_check',
      question: 'Two classes have the same frequency: A is 10 ≤ x < 15 with frequency 20; B is 15 ≤ x < 35 with frequency 20. A student says they\'ll have the same height bars. Correct?',
      commonErrors: [
        {
          answer: 'Same height because same frequency',
          misconception: 'Treating histogram heights as frequencies (like a bar chart).',
          correctsTo: 'Heights are FREQUENCY DENSITY, not frequency. Class A: width 5, density 20/5 = 4. Class B: width 20, density 20/20 = 1. Bar A is FOUR TIMES TALLER even though they have equal counts. The areas are equal (both 20) — and area is what represents frequency.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Frequency density = frequency / class width.',
        'AREA of bar = frequency in that class. Sum of areas = total sample size.',
        'Sub-interval estimate: use proportion of class width (assumes uniform within class).',
        'Tall bar ≠ high frequency — could be a narrow class.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A histogram has a single bar covering 0 ≤ x < 50 with frequency density 3. Half-way through (around x = 25) the density drops sharply. Suggest two reasons why the original combined-bar representation is statistically misleading.',
      hint: 'A constant-density bar implies uniform distribution within the class. If real data has a sharp drop at x = 25, the smooth single bar (1) hides the drop and could mislead about typical values, and (2) gives wrong sub-interval estimates if you applied the proportional rule to find frequency in 20–25 vs 30–35. Better: split into two narrower classes that capture the shape.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
