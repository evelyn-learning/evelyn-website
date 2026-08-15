/**
 * Algebra 1 — Linear Functions: Point-Slope & Standard Form.
 *
 * The "write the line" toolkit (CCSS A-CED.A.2, F-LE.A.2): build an
 * equation straight from a point and a slope, get the slope from two
 * points, and move freely between point-slope, slope-intercept, and
 * standard form — including reading intercepts straight off Ax + By = C.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U4_POINT_SLOPE_STANDARD_FORM: LessonPlan = {
  id: 'evelyn.hs.alg1.point-slope-standard-form.v1',
  title: 'Point-Slope & Standard Form',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.point-slope-standard-form',
      standard: 'ALG1-4.4',
      description:
        'Write a linear equation in point-slope form from a point and a slope or from two points, convert among point-slope, slope-intercept, and standard form, and find intercepts from standard form (CCSS A-CED.A.2, F-LE.A.2).',
    },
  ],
  prerequisites: ['alg1.slope-intercept-form'],
  followUps: ['alg1.parallel-perpendicular'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame point-slope as the fastest way to turn "one data point plus a rate" into an equation, and standard form as the shape built for intercepts.',
      script:
        'A hiking trail sits at 1,200 metres of elevation two kilometres in, and climbs 85 metres for every kilometre after that. That is one point and a rate — and point-slope form turns it into an equation in a single line, with no hunting for the y-intercept first. Today you get all three forms of a line and the ability to move between them at will, because each form answers a different question fast.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-forms',
      kind: 'concept',
      goal: 'Point-slope form, where it comes from, the two-point case, and clean conversions among the three forms.',
      keyIdeas: [
        'POINT-SLOPE FORM — y − y₁ = m(x − x₁), where m is the slope and (x₁, y₁) is ANY point on the line. Given a point and a slope you can write the equation immediately, with no algebra to find b.',
        'WHY IT WORKS — slope between a general point (x, y) and the known point (x₁, y₁) is (y − y₁)/(x − x₁) = m. Multiply both sides by (x − x₁) and you have the form. It is the slope formula with the denominator cleared.',
        'FROM TWO POINTS — compute m = (y₂ − y₁)/(x₂ − x₁) first, then feed either point into point-slope. Both choices simplify to the same line, so pick the point with easier numbers.',
        'THE THREE FORMS, EACH WITH A JOB — point-slope y − y₁ = m(x − x₁) for building from a point; slope-intercept y = mx + b for graphing and comparing rates; standard form Ax + By = C with integer A, B, C and A ≥ 0 for intercepts and for solving systems.',
        'CONVERTING — point-slope to slope-intercept: distribute m, then add y₁ to both sides. Slope-intercept to standard: move the x-term to the left, then multiply every term by the LCD to clear fractions and by −1 if needed to make A positive.',
        'INTERCEPTS FROM STANDARD FORM — set y = 0 and solve Ax = C for the x-intercept; set x = 0 and solve By = C for the y-intercept. Two substitutions, no rearranging — that is what standard form is good at.',
        'SIGN TRAP — the minus signs in y − y₁ = m(x − x₁) are part of the template, so a negative coordinate flips them: x₁ = −3 gives (x + 3), and y₁ = −2 gives (y + 2). Write the raw substitution y − (−2) = m(x − (−3)) FIRST, then simplify.',
        'DISTRIBUTE FULLY — −3(x + 3) = −3x − 9, not −3x + 3. A single missed distribution moves the whole line, and the check catches it: substitute the original point at the end and both sides must agree.',
      ],
      vocabulary: [
        { term: 'point-slope form', definition: 'y − y₁ = m(x − x₁); the equation of a line built directly from one point and the slope.' },
        { term: 'standard form', definition: 'Ax + By = C with integer coefficients and A ≥ 0; the form that hands you both intercepts in one substitution each.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-point-and-slope',
      kind: 'worked_example',
      problem: 'A line passes through (3, −2) with slope 4. Write it in point-slope form, then slope-intercept form, then standard form.',
      steps: [
        'Substitute into y − y₁ = m(x − x₁) with (x₁, y₁) = (3, −2) and m = 4: y − (−2) = 4(x − 3).',
        'Simplify the double negative: y + 2 = 4(x − 3). ← POINT-SLOPE FORM.',
        'Distribute the 4: y + 2 = 4x − 12.',
        'Subtract 2 from both sides: y = 4x − 14. ← SLOPE-INTERCEPT FORM.',
        'Move the x-term left: −4x + y = −14, then multiply by −1 so A is positive: 4x − y = 14. ← STANDARD FORM.',
        'Check with the original point: 4(3) − (−2) = 12 + 2 = 14. ✓',
      ],
      answer: 'y + 2 = 4(x − 3); y = 4x − 14; 4x − y = 14',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-points-intercepts',
      kind: 'worked_example',
      problem: 'A line passes through (−3, 4) and (1, −8). Write it in point-slope form using (−3, 4), convert to standard form, and find both intercepts.',
      steps: [
        'Slope first: m = (−8 − 4)/(1 − (−3)) = −12/4 = −3.',
        'Substitute (x₁, y₁) = (−3, 4): y − 4 = −3(x − (−3)) → y − 4 = −3(x + 3). Note the sign flip inside the parentheses — this is where most errors happen.',
        'Distribute the −3 across BOTH terms: y − 4 = −3x − 9.',
        'Add 4: y = −3x − 5, so standard form is 3x + y = −5.',
        'x-intercept: set y = 0 → 3x = −5 → x = −5/3, the point (−5/3, 0). y-intercept: set x = 0 → y = −5, the point (0, −5).',
        'Check with the OTHER point (1, −8): 3(1) + (−8) = 3 − 8 = −5. ✓ Using (1, −8) in point-slope instead gives y + 8 = −3(x − 1) → y = −3x − 5 — the same line.',
      ],
      answer: 'y − 4 = −3(x + 3); standard form 3x + y = −5; intercepts (−5/3, 0) and (0, −5)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-point-slope-signs',
      kind: 'try_yourself',
      problem: 'A line passes through (−5, 2) with slope 3. Which equation is its point-slope form?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y − 2 = 3(x + 5)', correct: true },
        { id: 'b', text: 'y − 2 = 3(x − 5)' },
        { id: 'c', text: 'y + 2 = 3(x + 5)' },
        { id: 'd', text: 'y + 5 = 3(x − 2)' },
      ],
      expectedAnswer: 'y − 2 = 3(x + 5)',
      hints: [
        'Write the raw substitution y − y₁ = m(x − x₁) before you simplify anything.',
        'x₁ = −5 makes (x − (−5)) = (x + 5); y₁ = 2 is positive, so the y-side stays y − 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-to-standard-form',
      kind: 'try_yourself',
      problem: 'Rewrite y − 6 = −2(x − 1) in standard form Ax + By = C with integer coefficients and A > 0.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2x + y = 8', correct: true },
        { id: 'b', text: '2x + y = 4' },
        { id: 'c', text: '−2x + y = 8' },
        { id: 'd', text: '2x + y = −8' },
      ],
      expectedAnswer: '2x + y = 8',
      hints: [
        'Distribute the −2 across both terms: −2 times −1 is +2, not −2.',
        'Get y alone first (y = −2x + 8), then add 2x to both sides.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-standard-c',
      kind: 'try_yourself',
      problem: 'A line passes through (2, 3) and (4, −7). Written in standard form 5x + y = C, what is C? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'Slope first: m = (−7 − 3)/(4 − 2).',
        'With m = −5 and the point (2, 3): y − 3 = −5(x − 2) → y = −5x + 13, so 5x + y = C.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-substitution-signs',
      kind: 'misconception_check',
      question: 'Two students both write y − 7 = 5(x − 2). Student A was given the point (2, −7) with slope 5; Student B was given the point (−2, 7) with slope 5. Both are wrong. What went wrong in each?',
      commonErrors: [
        {
          answer: 'Student A: y − 7 = 5(x − 2) from the point (2, −7)',
          misconception: 'Treating the template as "y minus the number you see" and copying y₁ = −7 in as a positive 7.',
          correctsTo: 'y − y₁ with y₁ = −7 is y − (−7) = y + 7, so the correct equation is y + 7 = 5(x − 2). Check: at x = 2 it gives y + 7 = 0, so y = −7. ✓',
        },
        {
          answer: 'Student B: y − 7 = 5(x − 2) from the point (−2, 7)',
          misconception: 'Dropping the negation on x₁ — plugging −2 straight in as if the minus in (x − x₁) had already been used up.',
          correctsTo: 'x₁ = −2 gives (x − (−2)) = (x + 2), so the correct equation is y − 7 = 5(x + 2). Check: at x = −2 it gives y − 7 = 0, so y = 7. ✓',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y − y₁ = m(x − x₁): write it the instant you have a point and a slope.',
        'Two points → slope first, then either point; both give the same line.',
        'Negative coordinates flip the template signs: x₁ = −3 gives (x + 3), y₁ = −2 gives (y + 2).',
        'Point-slope → slope-intercept: distribute and solve for y. → standard: move the x-term across, clear fractions, keep A positive.',
        'From Ax + By = C: y = 0 gives the x-intercept, x = 0 gives the y-intercept.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Point-Slope & Standard Form' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
