/**
 * Geometry — Unit 2 CED 2.3: Algebraic Properties & Two-Column Proofs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.two-column-proofs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U2_TWO_COLUMN_PROOFS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.two-column-proofs.v1',
  course: 'Geometry',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Algebraic Properties & Two-Column Proofs',
  planId: 'evelyn.hs.geom.two-column-proofs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.two-column-proofs.v1' }],
  theory: [
    { loId: 'geom.two-column-proofs', kind: 'framework', title: 'What a proof is', content: `WHAT A PROOF IS — a chain that starts at the GIVEN, ends at the PROVE, and never skips. Each statement is a link, and each link is held by a reason. If one reason is missing, the chain is broken no matter how obvious the step looks.` },
    { loId: 'geom.two-column-proofs', kind: 'framework', title: 'The two columns', content: `THE TWO COLUMNS — statements on the left, reasons on the right, numbered in matching rows. Row 1 is almost always the Given. Every reason must be exactly one of four things: a given, a definition, a postulate, or a property/theorem already proved.` },
    { loId: 'geom.two-column-proofs', kind: 'framework', title: 'Properties of equality', content: `PROPERTIES OF EQUALITY — Addition, Subtraction, Multiplication, and Division (do the same operation to both sides), plus the Distributive Property (a(b + c) = ab + ac). You name the property that matches what you DID: subtracting 2x from both sides is the Subtraction Property of Equality, even though the goal was to isolate x.` },
    { loId: 'geom.two-column-proofs', kind: 'framework', title: 'Reflexive, symmetric, transitive', content: `REFLEXIVE, SYMMETRIC, TRANSITIVE — Reflexive: a = a, and AB ≅ AB (a segment equals itself — this is how shared sides get into proofs). Symmetric: if a = b then b = a. Transitive: if a = b and b = c then a = c. All three work for congruence (≅) exactly as they do for equality (=).` },
    { loId: 'geom.two-column-proofs', content: `SUBSTITUTION vs TRANSITIVE — Transitive links two equations through a shared middle quantity (AB = CD and CD = EF give AB = EF). Substitution swaps a quantity for its equal INSIDE another statement (knowing x = 5, rewrite 3x + 1 as 3(5) + 1). Both are legal; use the one that describes the move.` },
    { loId: 'geom.two-column-proofs', kind: 'framework', title: 'Geometry brings its own reasons', content: `GEOMETRY BRINGS ITS OWN REASONS — Segment Addition Postulate (if B is between A and C, then AB + BC = AC), Angle Addition Postulate (if D is inside ∠ABC, then m∠ABD + m∠DBC = m∠ABC), definition of midpoint, definition of angle bisector, and the bridge between numbers and figures: segments are congruent exactly when their lengths are equal.` },
    { loId: 'geom.two-column-proofs', kind: 'framework', title: 'Error', content: `ERROR — NO FREE STEPS. "Obviously," "it looks equal," "because the picture shows it," or simply restating the statement in words are not reasons. If you cannot name the definition, postulate, or property, the step is not yet earned.` },
    { loId: 'geom.two-column-proofs', kind: 'framework', title: 'Error', content: `ERROR — NEVER ASSUME THE PROVE. The statement you are asked to prove can never appear as a Given, and no line may quietly depend on it. That is circular reasoning: it proves the conclusion using the conclusion, which proves nothing at all.` },
    { loId: 'geom.two-column-proofs', kind: 'definition', title: 'two-column proof', content: `a proof laid out in numbered rows with statements in the left column and the reason justifying each statement in the right column.` },
    { loId: 'geom.two-column-proofs', kind: 'definition', title: 'postulate', content: `a statement accepted as true without proof, used as a starting reason (a theorem, by contrast, is a statement that has been proved).` },
  ],
  methods: [
    {
      title: 'Worked algebraic proof',
      steps: [
        `Row 1 — Statement: 4x - 7 = 2x + 9. Reason: Given. Every proof opens by putting the given on the board.`,
        `Row 2 — Statement: 2x - 7 = 9. Reason: Subtraction Property of Equality (2x was subtracted from both sides). Name what you did, not what you were aiming for.`,
        `Row 3 — Statement: 2x = 16. Reason: Addition Property of Equality (7 was added to both sides).`,
        `Row 4 — Statement: x = 8. Reason: Division Property of Equality (both sides divided by 2). The last statement matches the Prove exactly, so the chain is complete.`,
      ],
      example: { problem: 'Write a two-column proof. Given: 4x - 7 = 2x + 9. Prove: x = 8.', solution: `x = 8, proved in four rows: Given, Subtraction Property, Addition Property, Division Property of Equality.` },
      relatedLoIds: ['geom.two-column-proofs'],
    },
    {
      title: 'Worked segment addition',
      steps: [
        `Diagnose the shortcut: AB = CD is the given; AC = BD is the PROVE. Writing the prove statement and calling it "Given" assumes the very thing in question. It also hides the real reason the two big segments match: both of them contain the same middle piece BC.`,
        'Row 1 — Statement: AB = CD. Reason: Given.',
        `Row 2 — Statement: BC = BC. Reason: Reflexive Property of Equality. This is the shared middle piece, and it is free — but it still needs its row.`,
        `Row 3 — Statement: AB + BC = CD + BC. Reason: Addition Property of Equality (equal quantities added to equal quantities).`,
        `Row 4 — Statement: AB + BC = AC and CD + BC = BD. Reason: Segment Addition Postulate, since B is between A and C, and C is between B and D.`,
        `Row 5 — Statement: AC = BD. Reason: Substitution Property (AC and BD replace the sums they equal in row 3). Now the prove is earned instead of assumed.`,
      ],
      example: { problem: `Points A, B, C, and D lie on a line in that order. Given: AB = CD. Prove: AC = BD. A classmate writes a one-row proof — "AC = BD, Reason: Given" — because the picture makes it look obvious. Fix it.`, solution: `A five-row proof: Given, Reflexive Property, Addition Property of Equality, Segment Addition Postulate, Substitution — the shared piece BC is what makes AC = BD.` },
      relatedLoIds: ['geom.two-column-proofs'],
    },
  ],
  pointers: [
    { content: `The reason exists and has a name: definition of midpoint (a midpoint divides a segment into two congruent segments). Row 2 is correct only when it reads "AM = MB, Reason: definition of midpoint." If you cannot name a given, definition, postulate, or proved property, the step is not earned.`, kind: 'common-error' },
    { content: `Only what the problem hands you may be labeled "Given." The Prove statement must arrive as the LAST row, supported by a definition, postulate, or property.`, kind: 'common-error' },
    { content: `Two-column proof: statements left, reasons right, starting at the Given and ending at the Prove — no skipped links.`, kind: 'tip' },
    { content: `Every reason is a given, a definition, a postulate, or an already-proved property/theorem. "Obviously" is never a reason.`, kind: 'tip' },
    { content: `Name the property that matches the move: subtract from both sides → Subtraction Property; distribute inside one side → Distributive Property.`, kind: 'tip' },
    { content: `Reflexive (a = a) hands you shared sides and angles for free; Transitive chains through a shared middle; Substitution swaps an equal quantity inside a statement.`, kind: 'tip' },
    { content: `Segment Addition and Angle Addition Postulates are the workhorse geometric reasons — and the Prove statement may never be assumed along the way.`, kind: 'tip' },
    { content: `Name the property by the operation you *performed*, not the one you undid. Going from 2x - 7 = 9 to 2x = 16 means you **added** 7 → Addition Property of Equality, even though you were "getting rid of" a minus 7.`, kind: 'common-error' },
    { content: `Distributive Property changes only one side of the equation; the four Properties of Equality change both sides. If 3(x+4) = 21 becomes 3x + 12 = 21, nothing happened to 21 — so it is Distributive, not Multiplication Property of Equality.`, kind: 'gotcha' },
    { content: `Transitive needs a shared middle *quantity* across two equations (AB = CD, CD = EF → AB = EF). Substitution replaces an equal quantity *inside* a larger expression or statement. If you're swapping into a sum like AB + BC, that's Substitution.`, kind: 'vocab-note' },
    { content: `Match the ending of the property name to the symbol in the row: \`=\` → Property of **Equality**, \`≅\` → Property of **Congruence**. ∠1 ≅ ∠2 and ∠2 ≅ ∠3 gives Transitive Property of *Congruence*, not of Equality.`, kind: 'vocab-note' },
    { content: `The Prove statement may never appear as a Given or as an early row. Writing "AC = BD — Reason: Given" when AC = BD is the Prove is circular reasoning, not a shortcut. Only what the problem literally hands you is "Given."`, kind: 'common-error' },
    { content: `"Obviously," "the picture shows it," or restating the statement in words is not a reason. If M is the midpoint, the reason is *definition of midpoint* — the justification has a name, so use it.`, kind: 'common-error' },
    { content: `Reflexive rows (BC = BC, ∠A ≅ ∠A) feel like wasted space, but a shared side or angle still needs its own numbered row before you can add it to both sides. Skip it and the addition step has nothing to stand on.`, kind: 'tip' },
    { content: `Segment/Angle Addition Postulates require a betweenness condition: B *between* A and C, or D in the *interior* of ∠ABC. State that condition — with points listed out of order (say B not between A and C), the postulate does not apply.`, kind: 'edge-case' },
  ],
};
