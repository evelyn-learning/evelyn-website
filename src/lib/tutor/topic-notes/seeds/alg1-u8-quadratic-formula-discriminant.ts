/**
 * Algebra 1 — Unit 8 CED 8.4: The Quadratic Formula & the Discriminant.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.quadratic-formula-discriminant.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U8_QUADRATIC_FORMULA_DISCRIMINANT: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.quadratic-formula-discriminant.v1',
  course: 'Algebra 1',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'The Quadratic Formula & the Discriminant',
  planId: 'evelyn.hs.alg1.quadratic-formula-discriminant.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.quadratic-formula-discriminant.v1' }],
  theory: [
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'framework', title: 'The formula', content: `THE FORMULA — for ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) / (2a). It comes from completing the square on the general equation, so it inherits "always works".` },
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'framework', title: 'Standard form first', content: `STANDARD FORM FIRST — the equation must equal 0 before reading off a, b, c. For 2x² = 5x − 3, rewrite as 2x² − 5x + 3 = 0, so a = 2, b = −5, c = 3.` },
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'framework', title: 'Signs ride along', content: `SIGNS RIDE ALONG — b = −5 means −b = 5 and b² = 25. Writing −b² instead of (−b)² is the most common formula error.` },
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'framework', title: 'The discriminant', content: `THE DISCRIMINANT — the part under the root, b² − 4ac. Positive → 2 real solutions; zero → exactly 1 (the parabola kisses the x-axis); negative → 0 real solutions.` },
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'framework', title: 'Graph connection', content: `GRAPH CONNECTION — the discriminant counts x-intercepts of y = ax² + bx + c. You can answer "how many solutions" questions with zero solving.` },
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'framework', title: 'Which tool', content: `WHICH TOOL — factorable? factor. b even and a = 1? completing the square is quick. Anything else → formula. All three give the same roots.` },
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'definition', title: 'discriminant', content: 'b² − 4ac — the expression under the radical that counts real solutions.' },
    { loId: 'alg1.quadratic-formula-discriminant', kind: 'definition', title: 'standard form', content: 'ax² + bx + c = 0, required before identifying a, b, c.' },
  ],
  methods: [
    {
      title: 'Worked two roots',
      steps: [
        'Already standard form: a = 2, b = −5, c = 3.',
        'Discriminant first: b² − 4ac = 25 − 24 = 1. Positive → expect 2 real solutions.',
        'x = (5 ± √1) / 4 = (5 ± 1)/4.',
        `x = 6/4 = 3/2 or x = 4/4 = 1. Check by factoring: (2x − 3)(x − 1) = 0. ✓ Same roots.`,
      ],
      example: { problem: 'Solve with the quadratic formula: 2x² − 5x + 3 = 0', solution: 'x = 3/2 or x = 1' },
      relatedLoIds: ['alg1.quadratic-formula-discriminant'],
    },
    {
      title: 'Worked discriminant only',
      steps: [
        'a = 3, b = 2, c = 4.',
        'Discriminant: b² − 4ac = 4 − 48 = −44.',
        `Negative discriminant → the square root of a negative is not a real number → 0 real solutions.`,
        `Graph check: y = 3x² + 2x + 4 opens upward with vertex above the x-axis — it never crosses.`,
      ],
      example: { problem: 'Without solving, determine how many real solutions 3x² + 2x + 4 = 0 has.', solution: 'No real solutions' },
      relatedLoIds: ['alg1.quadratic-formula-discriminant'],
    },
  ],
  pointers: [
    { content: 'Rewrite in standard form first: 3x² − 6x + 2 = 0, so a = 3, b = −6, c = 2.', kind: 'common-error' },
    { content: 'x = (−b ± √(b² − 4ac)) / (2a) — works on every quadratic.', kind: 'tip' },
    { content: 'Standard form (= 0) before reading a, b, c; signs ride along.', kind: 'tip' },
    { content: 'Discriminant b² − 4ac: positive → 2 real solutions, zero → 1, negative → 0.', kind: 'tip' },
    { content: 'Factor when it is easy; formula when it is not — same roots either way.', kind: 'tip' },
    { content: `When b is negative, write it in parentheses: b = −5 gives b² = (−5)² = **25**, not −25. Same for −b: −(−5) = **+5**. Dropping the parentheses is the #1 source of wrong roots.`, kind: 'common-error' },
    { content: `Never read a, b, c until the equation equals 0. For 3x² = 6x − 2 the values are a = 3, b = −6, c = 2 — not b = 6, c = −2.`, kind: 'gotcha' },
    { content: `The entire fraction bar is under −b ± √(...): divide BOTH parts by 2a. x = (5 ± 1)/4 means 6/4 and 4/4 — not 5 ± (1/4).`, kind: 'notation-note' },
    { content: `"Discriminant" is only b² − 4ac — no square root, no ±, no dividing by 2a. Report it as a plain signed number (e.g. −44 or 25), and don't say √25 = 25 is the discriminant.`, kind: 'vocab-note' },
    { content: `Discriminant = 0 means ONE solution, not zero solutions. Negative means zero real solutions. Say it out loud: "zero discriminant → one root; negative discriminant → no real roots."`, kind: 'common-error' },
    { content: `The discriminant counts real solutions, it doesn't tell you what they are. If asked "how many solutions," stop after b² − 4ac; if asked "solve," you still need the full formula.`, kind: 'tip' },
    { content: `Watch for a missing term: in x² − 9 = 0, b = 0 (not blank); in 2x² + 5x = 0, c = 0. Plug in 0 rather than skipping the slot.`, kind: 'edge-case' },
    { content: `If a is negative (e.g. −x² + 4x − 3 = 0), you may multiply the whole equation by −1 first — the roots don't change. Otherwise remember 2a is negative in the denominator.`, kind: 'tip' },
  ],
};
