/**
 * [TEST] Pacing v2 — straight lines (multi-tier).
 *
 * Replaces the mean-only test plan as the primary boredom-test surface.
 * Three difficulty tiers walk a real concept progression: slope basics
 * → slope-intercept form → distance from point to line. Each tier has
 * 4+ try-yourself problems so streak can build into the silent-ramp
 * (3) and explicit-offer (4) thresholds without exhausting the plan.
 *
 * Why this plan rather than means: a student answering correctly across
 * tiers is genuinely demonstrating ramping mastery, not just repeating
 * the same algorithm with bigger numbers. Phase 2 advisory hints will
 * surface earlier and more meaningfully (the "you've got this — want
 * to push to harder geometry?" offer at threshold 4 lands different
 * than "want a tougher mean problem?").
 *
 * Wolfram-verifiable answers throughout — every numeric answer is
 * exact integer or simple fraction. No ELA / brain-affirmation-only
 * paths, so streak signal stays Wolfram-grounded.
 *
 * Phase 1+2 expected log progression:
 *   streak builds across try-easy-1 → try-easy-2 → ... reaches 3
 *   → silent-ramp hint fires (next generate_problem difficulty=harder)
 *   → reaches 4 → explicit-offer hint fires
 *   → boredom cue or wrong streak triggers respective hints
 *   → topic switch ("let's do circles") resets streak
 *
 * Phase 3 expected: Slow down click → next teaching turn shows more
 *   sub-questions / breakdown. Speed up → tighter explanations.
 * Phase 4 expected: paceBias persists across re-launches of the same
 *   plan via localStorage.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_PACING_LINES: LessonPlan = {
  id: 'evelyn.test.pacing.lines.v1',
  title: '[TEST] Pacing v2 — straight lines',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'algebra',
  locale: 'en',
  los: [
    {
      id: 'evelyn.test.pacing.lines.slope',
      description: 'Compute the slope of a line through two points.',
    },
    {
      id: 'evelyn.test.pacing.lines.equation',
      description: 'Find the equation of a line in slope-intercept form (y = mx + b).',
    },
    {
      id: 'evelyn.test.pacing.lines.distance',
      description: 'Find the perpendicular distance from a point to a line.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the test plan: lines warm-up at three difficulty tiers, designed for pacing-v2 streak/cue/hint validation.',
      script: 'We\'ll work through some problems on straight lines today — slope, equations, and distances. Three tiers, easier to harder. Just answer each one as we go.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope',
      kind: 'concept',
      goal: 'Introduce slope as rise over run between two points.',
      keyIdeas: [
        'SLOPE measures how steep a line is. Positive = goes up left-to-right, negative = goes down.',
        'Formula: slope m = (y₂ − y₁) / (x₂ − x₁). Order doesn\'t matter as long as you\'re consistent.',
        'Horizontal line: slope = 0. Vertical line: slope is undefined.',
      ],
      vocabulary: [
        { term: 'slope', definition: 'rate of change of y with respect to x — rise over run.' },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'worked-slope',
      kind: 'worked_example',
      problem: 'Find the slope of the line through (1, 3) and (4, 12).',
      steps: [
        'Identify the points: (x₁, y₁) = (1, 3) and (x₂, y₂) = (4, 12).',
        'Apply m = (y₂ − y₁) / (x₂ − x₁) = (12 − 3) / (4 − 1) = 9 / 3 = 3.',
      ],
      answer: '3',
      estimatedMinutes: 2,
    },
    {
      id: 'try-slope-1',
      kind: 'try_yourself',
      problem: 'Find the slope of the line through (2, 1) and (5, 7).',
      expectedAnswer: '2',
      responseFormat: 'numeric',
      hints: ['Rise = 7 − 1 = 6. Run = 5 − 2 = 3.', 'Slope = rise / run.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-slope-2',
      kind: 'try_yourself',
      problem: 'Find the slope of the line through (-1, 2) and (3, 14).',
      expectedAnswer: '3',
      responseFormat: 'numeric',
      hints: ['Rise = 14 − 2 = 12. Run = 3 − (-1) = 4.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-slope-3',
      kind: 'try_yourself',
      problem: 'Find the slope of the line through (0, 5) and (4, -3).',
      expectedAnswer: '-2',
      responseFormat: 'numeric',
      hints: ['Rise = -3 − 5 = -8. Run = 4 − 0 = 4.', 'Watch the sign — line goes DOWN.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-slope-4',
      kind: 'try_yourself',
      problem: 'Find the slope of the line through (-2, -3) and (1, 6).',
      expectedAnswer: '3',
      responseFormat: 'numeric',
      hints: ['Rise = 6 − (-3) = 9. Run = 1 − (-2) = 3.'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-equation',
      kind: 'concept',
      goal: 'Slope-intercept form: y = mx + b.',
      keyIdeas: [
        'Slope-intercept form: y = mx + b. Here m is the slope and b is the y-intercept (where the line crosses the y-axis).',
        'To find equation given slope + a point: substitute the slope for m, the point\'s coordinates for x and y, and solve for b.',
        'To find equation given two points: compute slope first, then use one point to solve for b.',
      ],
      vocabulary: [
        { term: 'y-intercept', definition: 'the y-value where the line crosses the y-axis (x = 0).' },
        { term: 'slope-intercept form', definition: 'the form y = mx + b — slope m, y-intercept b.' },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'worked-equation',
      kind: 'worked_example',
      problem: 'Find the equation of the line with slope 2 passing through (3, 8).',
      steps: [
        'Slope-intercept form: y = mx + b, with m = 2.',
        'Substitute the point (3, 8): 8 = 2(3) + b → 8 = 6 + b → b = 2.',
        'Equation: y = 2x + 2.',
      ],
      answer: 'y = 2x + 2',
      estimatedMinutes: 2,
    },
    {
      id: 'try-equation-1',
      kind: 'try_yourself',
      problem: 'Find the equation of the line with slope 3 passing through (1, 5).',
      expectedAnswer: 'y = 3x + 2',
      responseFormat: 'free',
      hints: ['Substitute m = 3 and (1, 5) into y = mx + b.', '5 = 3(1) + b → b = 2.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equation-2',
      kind: 'try_yourself',
      problem: 'Find the equation of the line through (0, -1) and (2, 5).',
      expectedAnswer: 'y = 3x - 1',
      responseFormat: 'free',
      hints: ['First find the slope: (5 − (-1)) / (2 − 0) = 6 / 2 = 3.', 'Then b = -1 (point (0, -1) gives y-intercept directly).'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equation-3',
      kind: 'try_yourself',
      problem: 'Find the equation of the line through (-1, 4) and (2, -2).',
      expectedAnswer: 'y = -2x + 2',
      responseFormat: 'free',
      hints: ['Slope = (-2 − 4) / (2 − (-1)) = -6 / 3 = -2.', 'Use a point: 4 = -2(-1) + b → 4 = 2 + b → b = 2.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equation-4',
      kind: 'try_yourself',
      problem: 'Find the equation of the line with slope -1 passing through (4, 1).',
      expectedAnswer: 'y = -x + 5',
      responseFormat: 'free',
      hints: ['1 = -1(4) + b → 1 = -4 + b → b = 5.'],
      estimatedMinutes: 2,
    },
    {
      id: 'concept-distance',
      kind: 'concept',
      goal: 'Perpendicular distance from a point to a line.',
      keyIdeas: [
        'Distance from point (x₀, y₀) to line ax + by + c = 0 is d = |ax₀ + by₀ + c| / √(a² + b²).',
        'Rewrite y = mx + b form into ax + by + c = 0 by moving all terms to one side: mx − y + b = 0 (so a = m, b-coeff = -1, c = b).',
        'The absolute value ensures the distance is non-negative regardless of which side of the line the point is on.',
      ],
      vocabulary: [
        { term: 'perpendicular distance', definition: 'the shortest distance from a point to a line — measured along the perpendicular.' },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'worked-distance',
      kind: 'worked_example',
      problem: 'Find the distance from the point (3, 4) to the line 3x + 4y - 5 = 0.',
      steps: [
        'Identify a = 3, b = 4, c = -5; point (x₀, y₀) = (3, 4).',
        'Numerator: |3(3) + 4(4) + (-5)| = |9 + 16 − 5| = |20| = 20.',
        'Denominator: √(3² + 4²) = √(9 + 16) = √25 = 5.',
        'Distance = 20 / 5 = 4.',
      ],
      answer: '4',
      estimatedMinutes: 3,
    },
    {
      id: 'try-distance-1',
      kind: 'try_yourself',
      problem: 'Find the distance from the point (1, 2) to the line y = 0 (the x-axis).',
      expectedAnswer: '2',
      responseFormat: 'numeric',
      hints: ['Distance from a point to the x-axis is just |y|.'],
      estimatedMinutes: 1,
    },
    {
      id: 'try-distance-2',
      kind: 'try_yourself',
      problem: 'Find the distance from the point (0, 0) to the line 3x + 4y - 25 = 0.',
      expectedAnswer: '5',
      responseFormat: 'numeric',
      hints: ['a = 3, b = 4, c = -25.', 'Numerator: |0 + 0 − 25| = 25.', 'Denominator: √(9 + 16) = 5.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-distance-3',
      kind: 'try_yourself',
      problem: 'Find the distance from the point (1, 1) to the line x + y - 4 = 0.',
      expectedAnswer: 'sqrt(2)',
      responseFormat: 'free',
      hints: ['a = 1, b = 1, c = -4.', 'Numerator: |1 + 1 − 4| = 2.', 'Denominator: √2. So 2 / √2 = √2.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-distance-4',
      kind: 'try_yourself',
      problem: 'Find the distance from the point (2, 3) to the line 5x - 12y + 39 = 0.',
      expectedAnswer: '1',
      responseFormat: 'numeric',
      hints: ['a = 5, b = -12, c = 39.', 'Numerator: |10 − 36 + 39| = |13| = 13.', 'Denominator: √(25 + 144) = √169 = 13.'],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Slope: m = (y₂ − y₁) / (x₂ − x₁).',
        'Slope-intercept form: y = mx + b. b is found by substituting a known point.',
        'Distance from (x₀, y₀) to ax + by + c = 0: d = |ax₀ + by₀ + c| / √(a² + b²).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
