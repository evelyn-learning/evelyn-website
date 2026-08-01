/**
 * Algebra 1 — Unit 4 CED 4.2: Slope & Rate of Change.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.slope-rate-of-change.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U4_SLOPE_RATE_OF_CHANGE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.slope-rate-of-change.v1',
  course: 'Algebra 1',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Slope & Rate of Change',
  planId: 'evelyn.hs.alg1.slope-rate-of-change.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.slope-rate-of-change.v1' }],
  theory: [
    { loId: 'alg1.slope-rate-of-change', kind: 'framework', title: 'Slope is rise over run', content: `SLOPE IS RISE OVER RUN — slope measures how much y changes for each 1 unit that x increases. Slope = rise/run = (change in y)/(change in x) = Δy/Δx.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'framework', title: 'The two-point formula', content: `THE TWO-POINT FORMULA — for points (x₁, y₁) and (x₂, y₂), m = (y₂ − y₁)/(x₂ − x₁). Subtracting in the other order in BOTH the top and the bottom gives the same answer, because the two sign flips cancel.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'framework', title: 'Order trap', content: `ORDER TRAP — the #1 error is mismatching the order: (y₂ − y₁)/(x₁ − x₂). That flips only one sign, so you get the right size with the WRONG sign. Lock the same point in as "point 2" on the top and the bottom.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'framework', title: 'Inversion trap', content: `INVERSION TRAP — the #2 error is writing run/rise. The change in y always goes on TOP. A quick sanity check: if the line looks steep, slope should be bigger than 1, not smaller.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'framework', title: 'Slope is a unit rate in context', content: `SLOPE IS A UNIT RATE IN CONTEXT — say it as "y-units per one x-unit," e.g. a slope of −3 on a graph of candle height (cm) vs time (hours) means the candle burns down 3 cm per hour. Always attach units and always keep the sign.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'framework', title: 'Four slope types', content: `FOUR SLOPE TYPES — POSITIVE: line rises left to right (y grows as x grows). NEGATIVE: line falls left to right. ZERO: horizontal, rise = 0, so m = 0/run = 0 — y never changes. UNDEFINED: vertical, run = 0, so m = rise/0 — division by zero, so there is no slope number.` },
    { loId: 'alg1.slope-rate-of-change', content: `ZERO vs UNDEFINED — "flat" is zero (two points share the same y, like (1, 5) and (9, 5)); "straight up" is undefined (two points share the same x, like (3, 1) and (3, 7)). Mixing these up is the classic vertical-line mistake.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'framework', title: 'Any two points work', content: `ANY TWO POINTS WORK — on a straight line the ratio Δy/Δx is the same no matter which two points you pick. That constant rate of change is exactly what makes the relationship linear.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'definition', title: 'slope', content: `the constant rate of change of a line: Δy/Δx, the same between any two of its points.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'definition', title: 'rate of change', content: `the real-world meaning of slope — output units per one input unit, e.g. dollars per month.` },
    { loId: 'alg1.slope-rate-of-change', kind: 'definition', title: 'undefined slope', content: `what a vertical line has: the run is 0, so the slope ratio would require dividing by zero.` },
  ],
  methods: [
    {
      title: 'Worked two points',
      steps: [
        'Label the points: (x₁, y₁) = (−3, 4) and (x₂, y₂) = (2, 19).',
        'Rise (top): y₂ − y₁ = 19 − 4 = 15.',
        'Run (bottom): x₂ − x₁ = 2 − (−3) = 2 + 3 = 5. Subtracting a negative adds.',
        'm = 15/5 = 3. Positive slope, so the line rises left to right.',
        `Check by swapping which point is "first": (4 − 19)/(−3 − 2) = (−15)/(−5) = 3. ✓ Same answer, as long as BOTH subtractions use the same order.`,
      ],
      example: { problem: 'Find the slope of the line through (−3, 4) and (2, 19).', solution: 'm = 3' },
      relatedLoIds: ['alg1.slope-rate-of-change'],
    },
    {
      title: 'Worked order trap context',
      steps: [
        `The two points are (2, 1400) and (5, 800), with time on the x-axis and elevation on the y-axis.`,
        `Take point 2 to be (5, 800) on BOTH the top and the bottom: m = (800 − 1400)/(5 − 2).`,
        'm = (−600)/3 = −200.',
        `TRAP: a student who computes (1400 − 800)/(5 − 2) = 200 has used point (2, 1400) on top but point (5, 800) on the bottom. That mismatch flips the sign and says she is climbing, which contradicts the story.`,
        `Interpret with units and sign: the slope is −200 meters per hour — her elevation drops 200 meters for every hour she walks.`,
      ],
      example: { problem: `A hiker walks down from a ridge at a steady pace. After 2 hours she is at 1400 meters of elevation; after 5 hours she is at 800 meters. Find the rate of change of her elevation and state what it means.`, solution: 'm = −200 meters per hour (elevation falls 200 m each hour).' },
      relatedLoIds: ['alg1.slope-rate-of-change'],
    },
  ],
  pointers: [
    { content: `Slope is rise over run, so the change in y goes on TOP: (14 − 2)/(5 − 1) = 12/4 = 3. Sanity check: y climbed 12 while x moved only 4, so the line is steep and the slope must be greater than 1.`, kind: 'common-error' },
    { content: `Here the run is 3 − 3 = 0 and the rise is 7 − 1 = 6, so the slope would be 6/0, which is UNDEFINED. Zero slope means the RISE is 0 (a flat, horizontal line); undefined slope means the RUN is 0 (a vertical line).`, kind: 'common-error' },
    { content: `Slope = rise/run = Δy/Δx = (y₂ − y₁)/(x₂ − x₁) — the change in y always goes on top.`, kind: 'tip' },
    { content: `Use the SAME point order on the top and the bottom; mismatching the order flips the sign.`, kind: 'tip' },
    { content: `In context, slope is a unit rate: state it as y-units per one x-unit, with the sign kept.`, kind: 'tip' },
    { content: `Positive rises, negative falls, zero is horizontal (rise = 0), undefined is vertical (run = 0).`, kind: 'tip' },
    { content: `Circle which point you call "point 2" and use it on BOTH the top and bottom. Mismatching order — (y₂ − y₁)/(x₁ − x₂) — gives the right number with the wrong sign, so a falling line looks like it's rising.`, kind: 'common-error' },
    { content: `Δy always goes on TOP. Sanity-check: if y changed more than x, slope must be bigger than 1. Getting 4/12 = 1/3 when y jumped 12 and x moved 4 means you flipped the fraction.`, kind: 'common-error' },
    { content: `Zero slope ≠ undefined slope. Same y-values (like (−2,5) and (6,5)) → rise = 0 → m = 0, horizontal. Same x-values (like (3,1) and (3,7)) → run = 0 → division by zero → UNDEFINED, vertical.`, kind: 'edge-case' },
    { content: `Say "undefined slope," not "no slope" or "slope = 0/6" or "infinite slope." A vertical line has no slope *number* because you'd divide by zero — don't write m = ∞ as an answer.`, kind: 'vocab-note' },
    { content: `Watch the double negative in the run: for (−3, 4) and (2, 19), x₂ − x₁ = 2 − (−3) = 5, not 2 − 3 = −1. Subtracting a negative adds.`, kind: 'gotcha' },
    { content: `A rate of change answer isn't finished until it has a sign AND units: "−200 meters per hour," not "200." Then read it back against the story — if the hiker is descending, a positive slope means you made an error.`, kind: 'tip' },
    { content: `Time is almost always the input (x). In "at 4 s the drone is 96 m up, at 10 s it's 60 m up," the points are (4, 96) and (10, 60) — not (96, 4). Writing them backwards gives the reciprocal slope.`, kind: 'gotcha' },
    { content: `On one straight line, any two points give the same slope — so if two pairs of points give different answers, the data isn't linear or you slipped up. Checking with a second pair is a free verification.`, kind: 'tip' },
  ],
};
