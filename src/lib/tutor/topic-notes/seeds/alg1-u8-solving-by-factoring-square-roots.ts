/**
 * Algebra 1 — Unit 8 CED 8.2: Solving Quadratics by Factoring & Square Roots.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.solving-by-factoring-square-roots.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U8_SOLVING_BY_FACTORING_SQUARE_ROOTS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.solving-by-factoring-square-roots.v1',
  course: 'Algebra 1',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Solving Quadratics by Factoring & Square Roots',
  planId: 'evelyn.hs.alg1.solving-by-factoring-square-roots.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.solving-by-factoring-square-roots.v1' }],
  theory: [
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'framework', title: 'Zero product property', content: `ZERO PRODUCT PROPERTY — if A × B = 0, then A = 0 OR B = 0. Nothing else multiplies to zero, so a factored quadratic hands you two tiny equations for free.` },
    { loId: 'alg1.solving-by-factoring-square-roots', content: `THE = 0 PRECONDITION — the property only works against ZERO. From x(x − 3) = 10 you may NOT write x = 10 or x − 3 = 10, because plenty of pairs multiply to 10. Rearrange to = 0 first, always.` },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'framework', title: 'The factoring routine', content: `THE FACTORING ROUTINE — 1) move every term to one side so the equation reads = 0, 2) factor completely (GCF first, then trinomial or difference of squares), 3) set each factor equal to 0 and solve those linear equations.` },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'framework', title: 'Never divide by a variable', content: `NEVER DIVIDE BY A VARIABLE — for x² = 12x, dividing by x gives only x = 12 and silently throws away x = 0. Factor instead: x(x − 12) = 0 keeps both roots.` },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'framework', title: 'Square-root method', content: `SQUARE-ROOT METHOD — when there is no plain x term, skip factoring: x² = k gives x = ±√k. So x² = 49 has TWO answers, 7 and −7.` },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'framework', title: 'Shifted version', content: `SHIFTED VERSION — (x − h)² = k works the same way once the squared part is alone: x − h = ±√k, so x = h ± √k. Isolate the square before you root, e.g. divide off a coefficient first.` },
    { loId: 'alg1.solving-by-factoring-square-roots', content: `THE ± IS NOT OPTIONAL — writing only the positive root is the single most common way students lose half of a correct answer.` },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'framework', title: 'Roots are x-intercepts', content: `ROOTS ARE X-INTERCEPTS — the solutions of ax² + bx + c = 0 are exactly where the parabola y = ax² + bx + c crosses the x-axis, which is why a quadratic usually has two of them.` },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'definition', title: 'zero product property', content: 'if a product equals 0, at least one factor equals 0.' },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'definition', title: 'root', content: `a value of x that makes the equation true — also called a zero or an x-intercept.` },
    { loId: 'alg1.solving-by-factoring-square-roots', kind: 'definition', title: '± (plus-or-minus)', content: 'shorthand saying both the positive and the negative value are solutions.' },
  ],
  methods: [
    {
      title: 'Worked factoring',
      steps: [
        'It is not equal to zero yet, so subtract 15 from both sides: x² + 2x − 15 = 0.',
        'Factor: find two numbers that multiply to −15 and add to +2 → +5 and −3.',
        'So (x + 5)(x − 3) = 0.',
        'Zero product property: x + 5 = 0 OR x − 3 = 0.',
        `Solve each: x = −5 or x = 3. Check x = −5: (−5)² + 2(−5) = 25 − 10 = 15. ✓ Check x = 3: 9 + 6 = 15. ✓`,
      ],
      example: { problem: 'Solve: x² + 2x = 15', solution: 'x = −5 or x = 3' },
      relatedLoIds: ['alg1.solving-by-factoring-square-roots'],
    },
    {
      title: 'Worked square root',
      steps: [
        `Do NOT expand — the squared part is already grouped, so isolate it. Divide both sides by 2: (x − 4)² = 49.`,
        'Take the square root of both sides and attach the ±: x − 4 = ±7.',
        'Split into two equations: x − 4 = 7 gives x = 11, and x − 4 = −7 gives x = −3.',
        `The trap here is stopping at x = 11. Both roots count. Check x = 11: 2(7)² = 98. ✓ Check x = −3: 2(−7)² = 2(49) = 98. ✓`,
      ],
      example: { problem: 'Solve: 2(x − 4)² = 98', solution: 'x = 11 or x = −3' },
      relatedLoIds: ['alg1.solving-by-factoring-square-roots'],
    },
  ],
  pointers: [
    { content: `Expand and rearrange to zero first: x² − 3x = 10 → x² − 3x − 10 = 0 → (x − 5)(x + 2) = 0 → x = 5 or x = −2. Check x = 5: 5(2) = 10. ✓ Check x = −2: (−2)(−5) = 10. ✓`, kind: 'common-error' },
    { content: `x² = 49 means x = ±7, so x = 7 or x = −7 — both square to 49. The ± is part of the method, not decoration.`, kind: 'common-error' },
    { content: `Zero product property works ONLY against zero — rearrange to = 0 before you factor.`, kind: 'tip' },
    { content: 'Routine: get = 0, factor completely (GCF first), set each factor = 0.', kind: 'tip' },
    { content: 'Never divide both sides by x — factor it out, or you lose the x = 0 root.', kind: 'tip' },
    { content: `Square-root method: x² = k → x = ±√k, and (x − h)² = k → x = h ± √k. Isolate the square first; keep the ±.`, kind: 'tip' },
    { content: 'The roots you find are the x-intercepts of the parabola y = ax² + bx + c.', kind: 'tip' },
    { content: `The zero product property only works against **0**. If you see \`(x+2)(x−1) = 6\`, expand and rearrange to \`= 0\` first — never set a factor equal to 6.`, kind: 'common-error' },
    { content: `Never divide both sides by \`x\`. In \`x² = 12x\`, dividing gives only x = 12 and silently deletes x = 0. Factor to \`x(x − 12) = 0\` and keep both roots.`, kind: 'gotcha' },
    { content: `Write the \`±\` the moment you take a square root, not after. \`x² = 49 → x = ±7\`. Half a correct answer is still wrong.`, kind: 'common-error' },
    { content: `Isolate the squared expression BEFORE rooting. In \`2(x − 4)² = 98\`, divide by 2 first; don't square-root while a coefficient is still attached, and don't expand a perfect square you could just root.`, kind: 'common-error' },
    { content: `For \`(x − h)² = k\`, the ± lands on the RIGHT side: \`x − h = ±√k\`, then x = h ± √k. Solve the two linear equations separately — don't write \`x = ±(h + √k)\`.`, kind: 'gotcha' },
    { content: `"Root," "zero," "solution," and "x-intercept" all name the same thing here — but the x-intercept is written as a POINT, e.g. root x = 3 ↔ intercept (3, 0).`, kind: 'vocab-note' },
    { content: `Factor COMPLETELY, GCF first. \`2x² − 8x = 0\` → \`2x(x − 4) = 0\`; the constant 2 gives no root, but the x factor gives x = 0. Don't stop after pulling out the GCF.`, kind: 'edge-case' },
    { content: `If \`x² = k\` with k negative (e.g. x² = −9), there is no real solution — the parabola never crosses the x-axis. And \`(x − h)² = 0\` gives just ONE root, x = h.`, kind: 'edge-case' },
    { content: `Always plug both roots back into the ORIGINAL equation, not your rearranged version — that catches sign slips in factoring, like mixing up +5 and −3 in (x + 5)(x − 3).`, kind: 'tip' },
  ],
};
