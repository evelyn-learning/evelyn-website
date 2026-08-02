/**
 * Geometry — Unit 4 CED 4.1: Translations in the Coordinate Plane.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.translations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U4_TRANSLATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.translations.v1',
  course: 'Geometry',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Translations in the Coordinate Plane',
  planId: 'evelyn.hs.geom.translations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.translations.v1' }],
  theory: [
    { loId: 'geom.translations', kind: 'framework', title: 'What a translation is', content: `WHAT A TRANSLATION IS — every point of a figure moves the SAME distance in the SAME direction. No turning, no flipping, no stretching. The starting figure is the PREIMAGE, the moved copy is the IMAGE, and image points get prime marks: A moves to A prime, written A'.` },
    { loId: 'geom.translations', kind: 'framework', title: 'The coordinate rule', content: `THE COORDINATE RULE — a translation is (x, y) → (x + a, y + b). Every single vertex takes the same a and the same b. Translating a triangle is just the same arithmetic done three times.` },
    { loId: 'geom.translations', kind: 'framework', title: 'Vector language', content: `VECTOR LANGUAGE — the pair a, b is the TRANSLATION VECTOR: a is how far right, b is how far up. So "7 right and 3 down" is the vector with components 7 and -3, and the rule (x, y) → (x + 7, y - 3).` },
    { loId: 'geom.translations', content: `SIGN DISCIPLINE (classic error 1) — left and down are the NEGATIVE directions. "6 units left" is a = -6, not +6; "2 units down" is b = -2. Students hear a positive word like "move" and add. Always test the rule on one point before doing the rest.` },
    { loId: 'geom.translations', content: `FINDING THE RULE FROM A PAIR (classic error 2) — subtract IMAGE minus PREIMAGE: a = x' - x and b = y' - y. Reversing the subtraction flips both signs and gives the translation that undoes the move instead of the one that made it.` },
    { loId: 'geom.translations', kind: 'framework', title: 'Rigid motion', content: `RIGID MOTION — a translation preserves distance and angle measure, so the image is ≅ to the preimage. It also preserves ORIENTATION: the vertices still read clockwise (or counter-clockwise) in the same order, which is what separates a slide from a flip.` },
    { loId: 'geom.translations', kind: 'framework', title: 'Every point travels on a parallel track', content: `EVERY POINT TRAVELS ON A PARALLEL TRACK — the segments AA', BB', and CC' joining each point to its image are all parallel and all the same length. If your connectors are not parallel and equal, you did not translate — you distorted the figure.` },
    { loId: 'geom.translations', kind: 'definition', title: 'preimage', content: `the original figure before a transformation; the moved copy is its image, labeled with prime marks.` },
    { loId: 'geom.translations', kind: 'definition', title: 'translation vector', content: `the pair of components a, b giving the horizontal and vertical shift applied to every point.` },
  ],
  methods: [
    {
      title: 'Worked apply rule',
      steps: [
        `Read the rule: a = 5 (5 units right) and b = -2 (2 units down). Same shift for all three vertices.`,
        `A(-2, 3) → A'(-2 + 5, 3 - 2) = A'(3, 1).`,
        `B(1, 5) → B'(1 + 5, 5 - 2) = B'(6, 3). C(4, -1) → C'(4 + 5, -1 - 2) = C'(9, -3).`,
        `Check one side with the distance formula: AB runs from (-2, 3) to (1, 5), so AB = √(3² + 2²) = √13. A'B' runs from (3, 1) to (6, 3), so A'B' = √(3² + 2²) = √13. Same length — the slide is rigid. ✓`,
        `Check the connectors: A to A' is 5 right and 2 down; B to B' is 5 right and 2 down; C to C' is 5 right and 2 down. Parallel and equal, as required.`,
      ],
      example: { problem: `Triangle ABC has vertices A(-2, 3), B(1, 5), and C(4, -1). Apply the translation (x, y) → (x + 5, y - 2) and give the vertices of the image △A'B'C'. Then check that the side lengths survived.`, solution: `A'(3, 1), B'(6, 3), C'(9, -3) — and △A'B'C' ≅ △ABC` },
      relatedLoIds: ['geom.translations'],
    },
    {
      title: 'Worked find rule sign trap',
      steps: [
        'The rule is found by subtracting IMAGE minus PREIMAGE, coordinate by coordinate.',
        `Horizontal: a = x' - x = 2 - 7 = -5. Vertical: b = y' - y = 4 - (-1) = 4 + 1 = 5.`,
        'So the correct rule is (x, y) → (x - 5, y + 5): 5 units left and 5 units up.',
        `Find the error: the student computed preimage minus image (7 - 2 = 5 and -1 - 4 = -5), which flips both signs. Their rule is the trip BACK from P' to P.`,
        `Always test on the given point: the student's rule sends P(7, -1) to (12, -6), nowhere near P'(2, 4). The correct rule sends P(7, -1) to (7 - 5, -1 + 5) = (2, 4) = P'. ✓`,
      ],
      example: { problem: `A translation maps P(7, -1) onto P'(2, 4). A student writes the rule as (x, y) → (x + 5, y - 5). Find the correct rule and explain the error.`, solution: `(x, y) → (x - 5, y + 5); the student subtracted in the wrong order, flipping both signs.` },
      relatedLoIds: ['geom.translations'],
    },
  ],
  pointers: [
    { content: `A translation applies the SAME rule (x, y) → (x + 5, y + 2) to every vertex. Recompute B' and C' with that rule, then verify: AA', BB', and CC' must all be parallel and the same length. Unequal shifts stretch the figure, so the result is no longer ≅ to the preimage and is not a translation at all.`, kind: 'common-error' },
    { content: `A translation slides every point by the same vector: (x, y) → (x + a, y + b), applied identically to every vertex.`, kind: 'tip' },
    { content: 'Left and down are negative: "6 left, 2 down" is (x, y) → (x - 6, y - 2).', kind: 'tip' },
    { content: `To find the rule from a before-and-after pair, subtract image minus preimage: a = x' - x, b = y' - y. Reversing it flips both signs.`, kind: 'tip' },
    { content: `Translations are rigid motions: lengths, angle measures, and orientation are unchanged, so the image is ≅ to the preimage.`, kind: 'tip' },
    { content: `Every connector AA', BB', CC' is parallel and equal in length — a fast way to check your work.`, kind: 'tip' },
    { content: `"Left" and "down" mean **subtract**. Translate the word phrase into signs *before* you touch coordinates: "6 left, 2 down" → (x, y) → (x − 6, y − 2). Writing (x + 6, y + 2) because the sentence sounded positive is the #1 error here.`, kind: 'common-error' },
    { content: `When finding a rule from a before-and-after pair, subtract **image minus preimage**: a = x′ − x, b = y′ − y. Reversing it gives the trip *back* from image to preimage — both signs flip. Test your rule on the given point before writing it down.`, kind: 'gotcha' },
    { content: `Watch negatives inside the subtraction: b = y′ − y with y = −1 and y′ = 4 gives 4 − (−1) = **+5**, not 3. Rewrite the double negative as addition every time instead of doing it in your head.`, kind: 'common-error' },
    { content: `Prime marks are not optional decoration. A and A′ are different points; writing "A(3, 1)" for the image loses track of which figure you mean. Keep vertex order matched too — A→A′, B→B′, C→C′ — or your congruence statement is wrong.`, kind: 'vocab-note' },
    { content: `The **same** a and b go on every vertex — never adjust one point "so it looks right." Verify by checking that AA′, BB′, and CC′ are all parallel and equal in length. If they aren't, you stretched the figure, not translated it.`, kind: 'common-error' },
    { content: `A translation preserves **orientation** — vertices still read clockwise (or counterclockwise) in the same order. If your image reads the opposite way around, you reflected it. Preserving side lengths alone doesn't prove you translated.`, kind: 'gotcha' },
    { content: `You don't need the distance formula to confirm lengths and angles survived — rigid motion guarantees it. If PQ = 12 cm and ∠Q = 63°, then P′Q′ = 12 cm and ∠Q′ = 63°, no matter how big the shift.`, kind: 'tip' },
    { content: `a = 0 or b = 0 is still a legal translation: (x, y) → (x, y − 4) is purely vertical. And a = b = 0 leaves every point fixed — the image equals the preimage. Don't reject a rule just because one component is missing.`, kind: 'edge-case' },
  ],
};
