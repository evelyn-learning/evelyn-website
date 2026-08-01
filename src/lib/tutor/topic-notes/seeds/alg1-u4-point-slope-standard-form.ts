/**
 * Algebra 1 — Unit 4 CED 4.4: Point-Slope & Standard Form.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.point-slope-standard-form.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U4_POINT_SLOPE_STANDARD_FORM: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.point-slope-standard-form.v1',
  course: 'Algebra 1',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Point-Slope & Standard Form',
  planId: 'evelyn.hs.alg1.point-slope-standard-form.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.point-slope-standard-form.v1' }],
  theory: [
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'Point-slope form', content: `POINT-SLOPE FORM — y − y₁ = m(x − x₁), where m is the slope and (x₁, y₁) is ANY point on the line. Given a point and a slope you can write the equation immediately, with no algebra to find b.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'Why it works', content: `WHY IT WORKS — slope between a general point (x, y) and the known point (x₁, y₁) is (y − y₁)/(x − x₁) = m. Multiply both sides by (x − x₁) and you have the form. It is the slope formula with the denominator cleared.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'From two points', content: `FROM TWO POINTS — compute m = (y₂ − y₁)/(x₂ − x₁) first, then feed either point into point-slope. Both choices simplify to the same line, so pick the point with easier numbers.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'The three forms, each with a job', content: `THE THREE FORMS, EACH WITH A JOB — point-slope y − y₁ = m(x − x₁) for building from a point; slope-intercept y = mx + b for graphing and comparing rates; standard form Ax + By = C with integer A, B, C and A ≥ 0 for intercepts and for solving systems.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'Converting', content: `CONVERTING — point-slope to slope-intercept: distribute m, then add y₁ to both sides. Slope-intercept to standard: move the x-term to the left, then multiply every term by the LCD to clear fractions and by −1 if needed to make A positive.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'Intercepts from standard form', content: `INTERCEPTS FROM STANDARD FORM — set y = 0 and solve Ax = C for the x-intercept; set x = 0 and solve By = C for the y-intercept. Two substitutions, no rearranging — that is what standard form is good at.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'Sign trap', content: `SIGN TRAP — the minus signs in y − y₁ = m(x − x₁) are part of the template, so a negative coordinate flips them: x₁ = −3 gives (x + 3), and y₁ = −2 gives (y + 2). Write the raw substitution y − (−2) = m(x − (−3)) FIRST, then simplify.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'framework', title: 'Distribute fully', content: `DISTRIBUTE FULLY — −3(x + 3) = −3x − 9, not −3x + 3. A single missed distribution moves the whole line, and the check catches it: substitute the original point at the end and both sides must agree.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'definition', title: 'point-slope form', content: `y − y₁ = m(x − x₁); the equation of a line built directly from one point and the slope.` },
    { loId: 'alg1.point-slope-standard-form', kind: 'definition', title: 'standard form', content: `Ax + By = C with integer coefficients and A ≥ 0; the form that hands you both intercepts in one substitution each.` },
  ],
  methods: [
    {
      title: 'Worked point and slope',
      steps: [
        `Substitute into y − y₁ = m(x − x₁) with (x₁, y₁) = (3, −2) and m = 4: y − (−2) = 4(x − 3).`,
        'Simplify the double negative: y + 2 = 4(x − 3). ← POINT-SLOPE FORM.',
        'Distribute the 4: y + 2 = 4x − 12.',
        'Subtract 2 from both sides: y = 4x − 14. ← SLOPE-INTERCEPT FORM.',
        `Move the x-term left: −4x + y = −14, then multiply by −1 so A is positive: 4x − y = 14. ← STANDARD FORM.`,
        'Check with the original point: 4(3) − (−2) = 12 + 2 = 14. ✓',
      ],
      example: { problem: `A line passes through (3, −2) with slope 4. Write it in point-slope form, then slope-intercept form, then standard form.`, solution: 'y + 2 = 4(x − 3); y = 4x − 14; 4x − y = 14' },
      relatedLoIds: ['alg1.point-slope-standard-form'],
    },
    {
      title: 'Worked two points intercepts',
      steps: [
        'Slope first: m = (−8 − 4)/(1 − (−3)) = −12/4 = −3.',
        `Substitute (x₁, y₁) = (−3, 4): y − 4 = −3(x − (−3)) → y − 4 = −3(x + 3). Note the sign flip inside the parentheses — this is where most errors happen.`,
        'Distribute the −3 across BOTH terms: y − 4 = −3x − 9.',
        'Add 4: y = −3x − 5, so standard form is 3x + y = −5.',
        `x-intercept: set y = 0 → 3x = −5 → x = −5/3, the point (−5/3, 0). y-intercept: set x = 0 → y = −5, the point (0, −5).`,
        `Check with the OTHER point (1, −8): 3(1) + (−8) = 3 − 8 = −5. ✓ Using (1, −8) in point-slope instead gives y + 8 = −3(x − 1) → y = −3x − 5 — the same line.`,
      ],
      example: { problem: `A line passes through (−3, 4) and (1, −8). Write it in point-slope form using (−3, 4), convert to standard form, and find both intercepts.`, solution: 'y − 4 = −3(x + 3); standard form 3x + y = −5; intercepts (−5/3, 0) and (0, −5)' },
      relatedLoIds: ['alg1.point-slope-standard-form'],
    },
  ],
  pointers: [
    { content: `y − y₁ with y₁ = −7 is y − (−7) = y + 7, so the correct equation is y + 7 = 5(x − 2). Check: at x = 2 it gives y + 7 = 0, so y = −7. ✓`, kind: 'common-error' },
    { content: `x₁ = −2 gives (x − (−2)) = (x + 2), so the correct equation is y − 7 = 5(x + 2). Check: at x = −2 it gives y − 7 = 0, so y = 7. ✓`, kind: 'common-error' },
    { content: 'y − y₁ = m(x − x₁): write it the instant you have a point and a slope.', kind: 'tip' },
    { content: 'Two points → slope first, then either point; both give the same line.', kind: 'tip' },
    { content: `Negative coordinates flip the template signs: x₁ = −3 gives (x + 3), y₁ = −2 gives (y + 2).`, kind: 'tip' },
    { content: `Point-slope → slope-intercept: distribute and solve for y. → standard: move the x-term across, clear fractions, keep A positive.`, kind: 'tip' },
    { content: 'From Ax + By = C: y = 0 gives the x-intercept, x = 0 gives the y-intercept.', kind: 'tip' },
    { content: `Write the raw substitution with parentheses around negatives FIRST: y − (−2) = m(x − (−3)). Simplifying in your head is how (x + 3) becomes (x − 3). One extra line of writing prevents the most common error in this topic.`, kind: 'common-error' },
    { content: `In y − y₁ = m(x − x₁), the minus signs belong to the template, not to the coordinates. A point of (−5, 2) gives y − 2 = 3(x + 5) — the y stays minus, the x flips. Don't flip both or neither by reflex.`, kind: 'gotcha' },
    { content: `Standard form means Ax + By = C with A, B, C all **integers** and A ≥ 0. So y = ⅔x + 1 is not done at −⅔x + y = 1 — multiply by 3 to get −2x + 3y = 3, then by −1: 2x − 3y = −3.`, kind: 'vocab-note' },
    { content: `Distribute the slope across BOTH terms: −3(x + 3) = −3x − 9, never −3x + 3. Then check by plugging the original point into your final equation — both sides must match exactly.`, kind: 'common-error' },
    { content: `From two points, either point gives a correct point-slope equation — they look different but simplify to the same slope-intercept/standard form. Don't assume you're wrong because your equation doesn't match a friend's.`, kind: 'edge-case' },
    { content: `Find the slope BEFORE touching point-slope form when given two points. And keep the subtraction order consistent: (y₂ − y₁)/(x₂ − x₁), not (y₂ − y₁)/(x₁ − x₂), which flips the sign of m.`, kind: 'gotcha' },
    { content: `For intercepts from Ax + By = C, don't rearrange into y = mx + b first — just substitute. y = 0 gives the x-intercept, x = 0 gives the y-intercept. Report them as points: (−5/3, 0), not 'x = −5/3 is the intercept'.`, kind: 'tip' },
    { content: `Each form has a job: point-slope for building from a point, slope-intercept for graphing/comparing rates, standard for intercepts and systems. If a problem asks for slope, don't read A from Ax + By = C — the slope is −A/B.`, kind: 'vocab-note' },
  ],
};
