/**
 * Geometry — Unit 5 CED 5.3: Congruence Proofs with CPCTC.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.cpctc-proofs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U5_CPCTC_PROOFS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.cpctc-proofs.v1',
  course: 'Geometry',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Congruence Proofs with CPCTC',
  planId: 'evelyn.hs.geom.cpctc-proofs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.cpctc-proofs.v1' }],
  theory: [
    { loId: 'geom.cpctc-proofs', kind: 'framework', title: 'What cpctc stands for', content: `WHAT CPCTC STANDS FOR — Corresponding Parts of Congruent Triangles are Congruent. Once △ABC ≅ △DEF is on the page, all six matching parts follow for free: AB ≅ DE, BC ≅ EF, CA ≅ FD, ∠A ≅ ∠D, ∠B ≅ ∠E, ∠C ≅ ∠F.` },
    { loId: 'geom.cpctc-proofs', kind: 'framework', title: 'The two-stage shape of every proof', content: `THE TWO-STAGE SHAPE OF EVERY PROOF — Stage 1: collect three parts and name a criterion (SSS, SAS, ASA, AAS, or HL) to conclude the triangles are congruent. Stage 2: write the ONE part you were asked about and justify it with CPCTC. Nothing else goes between those stages.` },
    { loId: 'geom.cpctc-proofs', kind: 'framework', title: 'Cpctc comes last, never first', content: `CPCTC COMES LAST, NEVER FIRST — it is a conclusion drawn FROM congruence, so it may only appear on a line BELOW the congruence statement. Using it to supply one of the three parts you still need is circular reasoning.` },
    { loId: 'geom.cpctc-proofs', kind: 'framework', title: 'Every statement needs a reason', content: `EVERY STATEMENT NEEDS A REASON — in a two-column proof the left column states, the right column justifies. Legal reasons: Given, a definition (midpoint, angle bisector, perpendicular), a property (Reflexive), a theorem (Vertical Angles), a congruence criterion, or CPCTC.` },
    { loId: 'geom.cpctc-proofs', kind: 'framework', title: 'Hidden givens feed stage 1', content: `HIDDEN GIVENS FEED STAGE 1 — a shared side is congruent to itself (Reflexive Property); vertical angles are congruent; a midpoint splits a segment into two congruent pieces; an angle bisector makes two congruent angles; ⊥ marks create two 90° angles.` },
    { loId: 'geom.cpctc-proofs', kind: 'framework', title: 'Letter order is the lookup table', content: `LETTER ORDER IS THE LOOKUP TABLE — write the congruence statement with corresponding vertices in matching positions, and reading off a part becomes mechanical. △ABC ≅ △DEF pairs ∠B with ∠E; the sloppy △ABC ≅ △EDF pairs ∠B with ∠D instead and every CPCTC line after it is wrong.` },
    { loId: 'geom.cpctc-proofs', kind: 'framework', title: 'What cpctc buys you downstream', content: `WHAT CPCTC BUYS YOU DOWNSTREAM — once CPCTC hands you an angle pair, you can keep going: congruent alternate interior angles prove two lines parallel, congruent adjacent angles prove a ray is a bisector, and a pair of congruent supplementary angles proves lines are perpendicular.` },
    { loId: 'geom.cpctc-proofs', kind: 'definition', title: 'CPCTC', content: `Corresponding Parts of Congruent Triangles are Congruent — the reason cited when a matching pair of sides or angles is claimed after the triangles have already been proved congruent.` },
    { loId: 'geom.cpctc-proofs', kind: 'definition', title: 'Reflexive Property', content: `any segment or angle is congruent to itself — the reason that lets a shared side count as a matching pair in both triangles.` },
  ],
  methods: [
    {
      title: 'Worked midpoint x',
      steps: [
        'Statement: M is the midpoint of AC and of BD. Reason: Given.',
        `Statement: AM ≅ CM and BM ≅ DM. Reason: Definition of midpoint (a midpoint cuts a segment into two congruent pieces).`,
        `Statement: ∠AMB ≅ ∠CMD. Reason: Vertical Angles Theorem — the two segments cross at M, so these angles sit opposite each other.`,
        `Check the arrangement before naming the criterion: side AM, included angle ∠AMB, side BM — the angle sits BETWEEN the two sides.`,
        `Statement: △AMB ≅ △CMD. Reason: SAS. (Stage 1 is done — the congruence is now on the page.)`,
        `Statement: AB ≅ CD. Reason: CPCTC — AB and CD are corresponding parts, matched by the letter order A↔C, M↔M, B↔D.`,
      ],
      example: { problem: `Segments AC and BD intersect at point M. Given: M is the midpoint of AC, and M is the midpoint of BD. Prove that AB ≅ CD. Write the statement and reason for each line.`, solution: 'AB ≅ CD by CPCTC, after proving △AMB ≅ △CMD by SAS.' },
      relatedLoIds: ['geom.cpctc-proofs'],
    },
    {
      title: 'Worked circular cpctc',
      steps: [
        `Read line 3 against line 4: CPCTC is a conclusion that follows FROM a congruence, but the congruence is not stated until line 4 — the proof borrows its own conclusion.`,
        `That circularity also breaks line 4: ASA needs a genuine side pair, and the only side offered came from the illegal line 3. Strip line 3 and just two angle pairs remain.`,
        `Two pairs of angles with no side is the AAA pattern — it forces the SHAPE to match but not the SIZE, so the triangles are similar, not necessarily congruent. No criterion applies and the proof cannot be repaired by rearranging lines.`,
        `What a legal version looks like: if AB ≅ DE had been GIVEN, then (1) ∠A ≅ ∠D, (2) AB ≅ DE, (3) ∠B ≅ ∠E — Given; (4) △ABC ≅ △DEF — ASA (the given side is included between the two given angles); (5) BC ≅ EF — CPCTC.`,
        `The rule that prevents this every time: CPCTC may only appear on a line BELOW the line that names the congruence criterion.`,
      ],
      example: { problem: `A student is asked to prove AB ≅ DE given only that ∠A ≅ ∠D and ∠B ≅ ∠E in triangles ABC and DEF. The student writes: (1) ∠A ≅ ∠D — Given. (2) ∠B ≅ ∠E — Given. (3) AB ≅ DE — CPCTC. (4) △ABC ≅ △DEF — ASA. What is wrong with this proof?`, solution: `The proof is circular — line 3 uses CPCTC before congruence is established, and without that illegal line only two angle pairs remain, which is AAA and proves nothing about size.` },
      relatedLoIds: ['geom.cpctc-proofs'],
    },
  ],
  pointers: [
    { content: `Line 1 assumes the triangles are congruent in order to prove they are congruent — circular. CPCTC may only appear BELOW the line naming the criterion. Build the three parts from givens, definitions, or theorems (a shared side, vertical angles, a midpoint), name SSS/SAS/ASA/AAS/HL, and cite CPCTC after that.`, kind: 'common-error' },
    { content: `CPCTC = Corresponding Parts of Congruent Triangles are Congruent — one congruence statement hands you all six matching parts.`, kind: 'tip' },
    { content: `Two stages, always in this order: prove the triangles congruent with a criterion, THEN cite CPCTC for the part you were asked about.`, kind: 'tip' },
    { content: `CPCTC never supplies a part used to reach the congruence — that is circular reasoning.`, kind: 'tip' },
    { content: `Every line needs a reason: Given, definition, Reflexive Property, Vertical Angles Theorem, a criterion, or CPCTC.`, kind: 'tip' },
    { content: `Write the congruence statement with vertices in matching order — the letter order tells you which parts correspond.`, kind: 'tip' },
    { content: `CPCTC can never be one of the three parts that gets you to the congruence. If your reason column says CPCTC on any line ABOVE the line naming SSS/SAS/ASA/AAS/HL, the proof is circular — no rearranging fixes it.`, kind: 'common-error' },
    { content: `Write the congruence statement with corresponding vertices in matching positions. △ABC ≅ △DEF pairs ∠B with ∠E; sloppily writing △ABC ≅ △EDF pairs ∠B with ∠D and every CPCTC line below it is wrong.`, kind: 'vocab-note' },
    { content: `A shared side is NOT 'Given' — cite the Reflexive Property (KL ≅ KL). Likewise the crossing angles at an intersection are 'Vertical Angles Theorem,' not 'they look equal' or 'Given.'`, kind: 'common-error' },
    { content: `Before naming SAS, check the angle actually sits BETWEEN the two sides you have; before naming ASA, check the side sits BETWEEN the two angles. Otherwise you have SSA or AAS — different criterion, or none.`, kind: 'gotcha' },
    { content: `Two pairs of angles with no side is AAA — it proves similar, not congruent. There is no AAA criterion, so no CPCTC line can follow it.`, kind: 'edge-case' },
    { content: `CPCTC justifies ONE part per line. Don't write 'AB ≅ DE and ∠B ≅ ∠E — CPCTC' as a single statement, and don't list all six parts — state only the part the problem asked for.`, kind: 'tip' },
    { content: `'Definition of midpoint' gives you congruent SEGMENTS; 'definition of angle bisector' gives congruent ANGLES; ⊥ marks give two 90° angles (then use 'all right angles are congruent'). Don't swap these reasons.`, kind: 'vocab-note' },
    { content: `CPCTC is a reason, not a destination. If the goal is 'lines are parallel' or 'ray is a bisector,' CPCTC gives you the angle pair and you still need one more line (e.g., Converse of Alternate Interior Angles) to finish.`, kind: 'gotcha' },
  ],
};
