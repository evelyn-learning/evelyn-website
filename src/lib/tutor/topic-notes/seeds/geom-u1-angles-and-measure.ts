/**
 * Geometry — Unit 1 CED 1.3: Angles & Angle Measure.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.angles-and-measure.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U1_ANGLES_AND_MEASURE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.angles-and-measure.v1',
  course: 'Geometry',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Angles & Angle Measure',
  planId: 'evelyn.hs.geom.angles-and-measure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.angles-and-measure.v1' }],
  theory: [
    { loId: 'geom.angles-and-measure', kind: 'framework', title: 'What an angle is', content: `WHAT AN ANGLE IS — two rays that share an endpoint. The shared endpoint is the VERTEX; the rays are the SIDES. The measure is the amount of OPENING (turn) between the rays, written in degrees, with one full turn = 360°.` },
    { loId: 'geom.angles-and-measure', kind: 'framework', title: 'Naming rules', content: `NAMING RULES — three letters with the VERTEX IN THE MIDDLE: ∠ABC or ∠CBA both name the angle with vertex B. The single-letter name ∠B is legal ONLY when exactly one angle sits at B. A number label like ∠1 is always safe.` },
    { loId: 'geom.angles-and-measure', kind: 'framework', title: 'Size is opening, not length', content: `SIZE IS OPENING, NOT LENGTH — stretching the sides longer does not change the measure. Two angles drawn with sides of wildly different lengths can be congruent. Rays are infinite; only the spread between them is measured.` },
    { loId: 'geom.angles-and-measure', kind: 'framework', title: 'The four classes', content: `THE FOUR CLASSES — ACUTE: between 0° and 90°. RIGHT: exactly 90° (mark it with a small square). OBTUSE: between 90° and 180°. STRAIGHT: exactly 180°, the two rays forming a line. (Beyond 180° is called a reflex angle.)` },
    { loId: 'geom.angles-and-measure', kind: 'framework', title: `The protractor's two scales`, content: `THE PROTRACTOR'S TWO SCALES — every protractor carries an inner and an outer scale running opposite directions. Read the scale whose 0 sits on YOUR ray. Reading the wrong one returns 180° minus the true measure, so a 140° angle gets recorded as 40°. Sanity-check against the classification: an obtuse-looking opening cannot read 40°.` },
    { loId: 'geom.angles-and-measure', kind: 'framework', title: 'Angle Addition Postulate', content: `ANGLE ADDITION POSTULATE — if ray BD lies in the INTERIOR of ∠ABC, then m∠ABD + m∠DBC = m∠ABC. This is the angle twin of the Segment Addition Postulate, and it is what turns diagrams into equations.` },
    { loId: 'geom.angles-and-measure', kind: 'framework', title: 'Angle bisector', content: `ANGLE BISECTOR — a ray from the vertex that cuts an angle into two congruent angles. If ray BD bisects ∠ABC, then m∠ABD = m∠DBC = half of m∠ABC. An interior ray is NOT a bisector unless you are told so or can prove it.` },
    { loId: 'geom.angles-and-measure', kind: 'framework', title: 'Congruent vs equal', content: `CONGRUENT VS EQUAL — ∠A ≅ ∠B compares the FIGURES; m∠A = m∠B compares the NUMBERS. They say the same thing, but the ≅ symbol goes between angles and the = sign goes between measures. Writing ∠A = 40° is a notation slip; write m∠A = 40°.` },
    { loId: 'geom.angles-and-measure', kind: 'definition', title: 'vertex', content: `the common endpoint of the two rays that form an angle; the middle letter in a three-letter angle name.` },
    { loId: 'geom.angles-and-measure', kind: 'definition', title: 'angle bisector', content: 'a ray from the vertex that divides an angle into two congruent angles.' },
  ],
  methods: [
    {
      title: 'Worked Angle Addition',
      steps: [
        `Check the naming: each angle has Q in the middle, so all three share vertex Q. Ray QS splits the big angle ∠PQR into two smaller ones.`,
        `Because QS is INTERIOR, the Angle Addition Postulate applies: m∠PQS + m∠SQR = m∠PQR.`,
        'Substitute the given measures: 34° + 51° = m∠PQR.',
        'Add: m∠PQR = 85°.',
        `Classify: 85° is less than 90°, so ∠PQR is acute. (Note that the two parts, 34° and 51°, are not equal — QS is an interior ray but NOT a bisector.)`,
      ],
      example: { problem: `Ray QS lies in the interior of ∠PQR. m∠PQS = 34° and m∠SQR = 51°. Find m∠PQR and classify it.`, solution: 'm∠PQR = 85°, an acute angle.' },
      relatedLoIds: ['geom.angles-and-measure'],
    },
    {
      title: 'Worked protractor scale',
      steps: [
        `Identify which scale is in play: the measurement always starts from the ray sitting on 0. Ray QP is on the 0 of the OUTER scale, so the OUTER scale is the one to read.`,
        'Read ray QR on that same scale: the outer scale says 140. So m∠PQR = 140°.',
        `Diagnose the classmate's 40°: they read the inner scale, whose 0 sits on the opposite side. The two scales always sum to 180 at any mark — 40 + 140 = 180 — so the wrong scale hands back the supplement, not the angle.`,
        `Sanity-check with classification: 140° is obtuse and 40° is acute, and an angle cannot be both. Whenever the two candidate readings disagree, decide first whether the opening is bigger or smaller than a square corner, then keep the reading that matches.`,
      ],
      example: { problem: `You set a protractor with its center hole on vertex Q. Ray QP passes through the 0 mark of the OUTER scale. Ray QR passes through a point where the outer scale reads 140 and the inner scale reads 40. A classmate records m∠PQR = 40°. Who is right, and how can you tell without re-measuring?`, solution: `m∠PQR = 140°. The classmate read the scale whose 0 was not on ray QP, so they reported the supplement, 180° - 140° = 40°.` },
      relatedLoIds: ['geom.angles-and-measure'],
    },
  ],
  pointers: [
    { content: `The sides of an angle are RAYS — they go on forever, and the drawn length is just how much of them fits on the board. Angle measure is the amount of turn from one ray to the other, so m∠ABC = m∠DEF = 50° and ∠ABC ≅ ∠DEF.`, kind: 'common-error' },
    { content: `An angle is a figure and cannot equal a number. Write m∠ABC = 50° when you mean the measure, and ∠ABC ≅ ∠DEF when you mean the two figures match.`, kind: 'common-error' },
    { content: `Name angles with the vertex in the MIDDLE (∠ABC); use ∠B only when one angle sits at B.`, kind: 'tip' },
    { content: `Measure is opening, not side length: acute < 90°, right = 90°, obtuse between 90° and 180°, straight = 180°.`, kind: 'tip' },
    { content: `On a protractor, read the scale whose 0 is on your ray — the other scale gives 180° minus the true measure.`, kind: 'tip' },
    { content: `Angle Addition Postulate: an interior ray splits the angle, m∠ABD + m∠DBC = m∠ABC. A bisector splits it into two CONGRUENT halves — never assume one without being told.`, kind: 'tip' },
    { content: 'Angles are ≅ to each other; their measures are = to each other.', kind: 'tip' },
    { content: `Write \`m∠ABC = 50°\`, not \`∠ABC = 50°\`. The symbol ∠ABC names a *figure* (two rays), which can never equal a number. Reserve ≅ for the angles themselves: ∠ABC ≅ ∠DEF.`, kind: 'vocab-note' },
    { content: `Never use a single-letter name like ∠B when more than one angle sits at vertex B. With rays BA, BD, BC all at B, '∠B' could mean ∠ABD, ∠DBC, or ∠ABC — write three letters with the vertex in the middle.`, kind: 'common-error' },
    { content: `An interior ray is NOT a bisector unless the problem says 'bisects', shows tick marks, or you prove the halves congruent. In 34° + 51° = 85°, ray QS is interior but the halves differ — don't reflexively divide by 2.`, kind: 'gotcha' },
    { content: `Before trusting a protractor reading, classify by eye: bigger or smaller than a square corner? The two scales always sum to 180 at any mark, so the wrong one hands you the supplement (140° recorded as 40°).`, kind: 'tip' },
    { content: `Longer drawn sides do NOT mean a bigger angle. Sides are rays — infinite — so the drawn length is just what fit on the page. Two 50° angles with 10 cm and 3 cm sides are congruent.`, kind: 'common-error' },
    { content: `In bisector algebra, setting the two halves equal (3x + 5 = x + 25) gives x — but that's not the answer. Substitute back to get one half, then DOUBLE it for the whole angle: 35° → m∠JKL = 70°.`, kind: 'gotcha' },
    { content: `Angle Addition needs the middle ray in the INTERIOR. If ray BD falls outside ∠ABC, m∠ABD + m∠DBC ≠ m∠ABC — check the diagram or the wording before writing the equation.`, kind: 'edge-case' },
    { content: `Know the boundaries: 90° is right (not acute or obtuse), 180° is straight (its two rays form a line), and anything over 180° is reflex — not obtuse. Obtuse means strictly between 90° and 180°.`, kind: 'vocab-note' },
  ],
};
