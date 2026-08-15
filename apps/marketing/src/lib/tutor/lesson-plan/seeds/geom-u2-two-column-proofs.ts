/**
 * Geometry — Reasoning & Proof: Algebraic Properties & Two-Column Proofs.
 *
 * Where the course stops asking "what is true?" and starts asking "how do
 * you know?" (CCSS G-CO.C, MP3). Every algebra move the student has made
 * since Algebra 1 turns out to have a NAME, and those names become the
 * right-hand column of every proof for the rest of Geometry. Equal billing
 * for the two habits that sink beginners: leaving a step unjustified, and
 * quietly assuming the very thing being proved.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U2_TWO_COLUMN_PROOFS: LessonPlan = {
  id: 'evelyn.hs.geom.two-column-proofs.v1',
  title: 'Algebraic Properties & Two-Column Proofs',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.two-column-proofs',
      standard: 'GEOM-2.3',
      description:
        'Justify each step of an algebraic or geometric argument by naming the property, definition, or postulate that permits it, and organize a complete argument from Given to Prove as a two-column proof (CCSS G-CO.C, MP3).',
    },
  ],
  prerequisites: ['geom.conditional-statements'],
  followUps: ['geom.parallel-lines-transversals'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a proof as an argument that survives cross-examination — the standard every engineer, architect, and mathematician is held to.',
      script:
        'An architect cannot hand a city inspector a roof plan and say "trust me, those beams meet at a right angle." Every claim has to trace back to something already accepted. Geometry works the same way, and this lesson is where you learn the format: two columns, statements on the left, and on the right the reason each statement is allowed. Here is the surprise — you have been doing this since Algebra 1. Every time you subtracted the same number from both sides, you used a property with an official name. Today those names become your evidence.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-proof-structure',
      kind: 'concept',
      goal: 'The anatomy of a two-column proof, the properties that fill the reason column, and the two habits that break a proof.',
      keyIdeas: [
        'WHAT A PROOF IS — a chain that starts at the GIVEN, ends at the PROVE, and never skips. Each statement is a link, and each link is held by a reason. If one reason is missing, the chain is broken no matter how obvious the step looks.',
        'THE TWO COLUMNS — statements on the left, reasons on the right, numbered in matching rows. Row 1 is almost always the Given. Every reason must be exactly one of four things: a given, a definition, a postulate, or a property/theorem already proved.',
        'PROPERTIES OF EQUALITY — Addition, Subtraction, Multiplication, and Division (do the same operation to both sides), plus the Distributive Property (a(b + c) = ab + ac). You name the property that matches what you DID: subtracting 2x from both sides is the Subtraction Property of Equality, even though the goal was to isolate x.',
        'REFLEXIVE, SYMMETRIC, TRANSITIVE — Reflexive: a = a, and AB ≅ AB (a segment equals itself — this is how shared sides get into proofs). Symmetric: if a = b then b = a. Transitive: if a = b and b = c then a = c. All three work for congruence (≅) exactly as they do for equality (=).',
        'SUBSTITUTION vs TRANSITIVE — Transitive links two equations through a shared middle quantity (AB = CD and CD = EF give AB = EF). Substitution swaps a quantity for its equal INSIDE another statement (knowing x = 5, rewrite 3x + 1 as 3(5) + 1). Both are legal; use the one that describes the move.',
        'GEOMETRY BRINGS ITS OWN REASONS — Segment Addition Postulate (if B is between A and C, then AB + BC = AC), Angle Addition Postulate (if D is inside ∠ABC, then m∠ABD + m∠DBC = m∠ABC), definition of midpoint, definition of angle bisector, and the bridge between numbers and figures: segments are congruent exactly when their lengths are equal.',
        'ERROR — NO FREE STEPS. "Obviously," "it looks equal," "because the picture shows it," or simply restating the statement in words are not reasons. If you cannot name the definition, postulate, or property, the step is not yet earned.',
        'ERROR — NEVER ASSUME THE PROVE. The statement you are asked to prove can never appear as a Given, and no line may quietly depend on it. That is circular reasoning: it proves the conclusion using the conclusion, which proves nothing at all.',
      ],
      vocabulary: [
        {
          term: 'two-column proof',
          definition:
            'a proof laid out in numbered rows with statements in the left column and the reason justifying each statement in the right column.',
        },
        {
          term: 'postulate',
          definition:
            'a statement accepted as true without proof, used as a starting reason (a theorem, by contrast, is a statement that has been proved).',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-algebraic-proof',
      kind: 'worked_example',
      problem:
        'Write a two-column proof. Given: 4x - 7 = 2x + 9. Prove: x = 8.',
      steps: [
        'Row 1 — Statement: 4x - 7 = 2x + 9. Reason: Given. Every proof opens by putting the given on the board.',
        'Row 2 — Statement: 2x - 7 = 9. Reason: Subtraction Property of Equality (2x was subtracted from both sides). Name what you did, not what you were aiming for.',
        'Row 3 — Statement: 2x = 16. Reason: Addition Property of Equality (7 was added to both sides).',
        'Row 4 — Statement: x = 8. Reason: Division Property of Equality (both sides divided by 2). The last statement matches the Prove exactly, so the chain is complete.',
      ],
      answer: 'x = 8, proved in four rows: Given, Subtraction Property, Addition Property, Division Property of Equality.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-segment-addition',
      kind: 'worked_example',
      problem:
        'Points A, B, C, and D lie on a line in that order. Given: AB = CD. Prove: AC = BD. A classmate writes a one-row proof — "AC = BD, Reason: Given" — because the picture makes it look obvious. Fix it.',
      steps: [
        'Diagnose the shortcut: AB = CD is the given; AC = BD is the PROVE. Writing the prove statement and calling it "Given" assumes the very thing in question. It also hides the real reason the two big segments match: both of them contain the same middle piece BC.',
        'Row 1 — Statement: AB = CD. Reason: Given.',
        'Row 2 — Statement: BC = BC. Reason: Reflexive Property of Equality. This is the shared middle piece, and it is free — but it still needs its row.',
        'Row 3 — Statement: AB + BC = CD + BC. Reason: Addition Property of Equality (equal quantities added to equal quantities).',
        'Row 4 — Statement: AB + BC = AC and CD + BC = BD. Reason: Segment Addition Postulate, since B is between A and C, and C is between B and D.',
        'Row 5 — Statement: AC = BD. Reason: Substitution Property (AC and BD replace the sums they equal in row 3). Now the prove is earned instead of assumed.',
      ],
      answer:
        'A five-row proof: Given, Reflexive Property, Addition Property of Equality, Segment Addition Postulate, Substitution — the shared piece BC is what makes AC = BD.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-reason-distributive',
      kind: 'try_yourself',
      problem:
        'In a two-column proof, row 1 reads 3(x + 4) = 21 with the reason "Given." Row 2 reads 3x + 12 = 21. Which reason justifies row 2?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Distributive Property', correct: true },
        { id: 'b', text: 'Multiplication Property of Equality' },
        { id: 'c', text: 'Addition Property of Equality' },
        { id: 'd', text: 'Substitution Property' },
      ],
      expectedAnswer: 'Distributive Property',
      hints: [
        'Compare the two rows: was anything done to BOTH sides, or was only the left side rewritten?',
        'The right side never changed — the 3 was distributed across x and 4 inside one expression.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reason-transitive',
      kind: 'try_yourself',
      problem:
        'A proof contains these rows: ∠1 ≅ ∠2 (Given), ∠2 ≅ ∠3 (Given), and then ∠1 ≅ ∠3. Which reason justifies the last row?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Symmetric Property of Congruence' },
        { id: 'b', text: 'Transitive Property of Congruence', correct: true },
        { id: 'c', text: 'Reflexive Property of Congruence' },
        { id: 'd', text: 'Angle Addition Postulate' },
      ],
      expectedAnswer: 'Transitive Property of Congruence',
      hints: [
        'Two facts are being linked through a shared middle angle — which property chains a ≅ b and b ≅ c together?',
        'Symmetric only flips one statement around; Reflexive says something is congruent to itself. Neither uses two rows.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Point B is between A and C on a line. AB = 2x + 1, BC = x - 3, and AC = 25. Using the Segment Addition Postulate, solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'Segment Addition Postulate: AB + BC = AC, so (2x + 1) + (x - 3) = 25.',
        'Combine like terms to get 3x - 2 = 25, then use the Addition and Division Properties of Equality.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-circular',
      kind: 'misconception_check',
      question:
        'Given: M is the midpoint of AB. Prove: AM = MB. A student writes a two-row proof — row 1: "M is the midpoint of AB, Reason: Given"; row 2: "AM = MB, Reason: because M is the middle so the halves are obviously equal." What went wrong?',
      commonErrors: [
        {
          answer: 'AM = MB because M is in the middle — that is obvious from the picture',
          misconception:
            'Treating an appeal to the diagram or to intuition as a reason, so the step is never actually justified.',
          correctsTo:
            'The reason exists and has a name: definition of midpoint (a midpoint divides a segment into two congruent segments). Row 2 is correct only when it reads "AM = MB, Reason: definition of midpoint." If you cannot name a given, definition, postulate, or proved property, the step is not earned.',
        },
        {
          answer: 'Writing "AM = MB, Reason: Given" to close the proof faster',
          misconception:
            'Listing the Prove statement as a Given — assuming the conclusion instead of deriving it (circular reasoning).',
          correctsTo:
            'Only what the problem hands you may be labeled "Given." The Prove statement must arrive as the LAST row, supported by a definition, postulate, or property.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two-column proof: statements left, reasons right, starting at the Given and ending at the Prove — no skipped links.',
        'Every reason is a given, a definition, a postulate, or an already-proved property/theorem. "Obviously" is never a reason.',
        'Name the property that matches the move: subtract from both sides → Subtraction Property; distribute inside one side → Distributive Property.',
        'Reflexive (a = a) hands you shared sides and angles for free; Transitive chains through a shared middle; Substitution swaps an equal quantity inside a statement.',
        'Segment Addition and Angle Addition Postulates are the workhorse geometric reasons — and the Prove statement may never be assumed along the way.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Algebraic Properties & Two-Column Proofs' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
