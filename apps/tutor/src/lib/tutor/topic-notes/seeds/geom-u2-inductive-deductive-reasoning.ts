/**
 * Geometry — Unit 2 CED 2.1: Inductive & Deductive Reasoning.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.inductive-deductive-reasoning.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U2_INDUCTIVE_DEDUCTIVE_REASONING: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.inductive-deductive-reasoning.v1',
  course: 'Geometry',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Inductive & Deductive Reasoning',
  planId: 'evelyn.hs.geom.inductive-deductive-reasoning.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.inductive-deductive-reasoning.v1' }],
  theory: [
    { loId: 'geom.inductive-deductive-reasoning', kind: 'framework', title: 'Inductive reasoning', content: `INDUCTIVE REASONING — look at specific cases, spot the pattern, state a general claim. It is how every theorem in this course was FOUND. It is never how one is proved.` },
    { loId: 'geom.inductive-deductive-reasoning', kind: 'framework', title: 'Conjecture', content: `CONJECTURE — the general claim inductive reasoning produces. A conjecture is a well-supported guess with no guarantee attached, no matter how many cases back it.` },
    { loId: 'geom.inductive-deductive-reasoning', kind: 'framework', title: 'Counterexample', content: `COUNTEREXAMPLE — a single case where the hypothesis holds but the conclusion fails. ONE counterexample destroys a conjecture permanently. A thousand confirming cases prove nothing.` },
    { loId: 'geom.inductive-deductive-reasoning', kind: 'framework', title: 'Deductive reasoning', content: `DEDUCTIVE REASONING — start from definitions, postulates, theorems, and the given facts, and force each step. The conclusion is certain, not likely. Every step owes a REASON.` },
    { loId: 'geom.inductive-deductive-reasoning', kind: 'framework', title: 'Law of Detachment', content: `LAW OF DETACHMENT — if the statement "if p, then q" is true AND p is true, then q is true. The arrow runs FORWARD only.` },
    { loId: 'geom.inductive-deductive-reasoning', content: `THE CONVERSE TRAP (classic error) — being handed q does NOT let you conclude p. "If it is a square, it has four right angles" plus "this shape has four right angles" gives nothing: a rectangle qualifies too.` },
    { loId: 'geom.inductive-deductive-reasoning', kind: 'framework', title: 'Law of Syllogism', content: `LAW OF SYLLOGISM — if p leads to q and q leads to r, then p leads to r. Chaining short implications like this is literally what a proof is.` },
    { loId: 'geom.inductive-deductive-reasoning', content: `DIAGRAMS ARE NOT GIVENS (classic error) — you may never assume a right angle, congruent segments, or parallel lines because a picture looks that way. Only stated or marked facts count: ⊥, ≅, and ∥ have to be told to you.` },
    { loId: 'geom.inductive-deductive-reasoning', kind: 'definition', title: 'conjecture', content: 'a general statement believed true based on observed cases, but not yet proved.' },
    { loId: 'geom.inductive-deductive-reasoning', kind: 'definition', title: 'counterexample', content: `one specific case that satisfies the hypothesis but fails the conclusion, disproving a conjecture.` },
  ],
  methods: [
    {
      title: 'Worked conjecture then prove',
      steps: [
        `Inductive step — add each recorded pair: 30 + 150 = 180, 72 + 108 = 180, 115 + 65 = 180. The pattern is a constant sum of 180°.`,
        `State the conjecture: the two angles of a linear pair are supplementary. This is a GUESS so far — three cases, not a proof.`,
        'Now deduce it. Statement: ∠ABD and ∠DBC form a linear pair. Reason: Given.',
        `Statement: ray BA and ray BC are opposite rays, so ∠ABC is a straight angle. Reason: Definition of a linear pair.`,
        'Statement: m∠ABC = 180°. Reason: Definition of a straight angle.',
        'Statement: m∠ABD + m∠DBC = m∠ABC. Reason: Angle Addition Postulate.',
        `Statement: m∠ABD + m∠DBC = 180°. Reason: Substitution. The chain covers EVERY linear pair, so the conjecture is now a theorem.`,
      ],
      example: { problem: `A class measures several linear pairs of angles and records 30° with 150°, 72° with 108°, and 115° with 65°. State the conjecture the pattern suggests, then prove it deductively. (A linear pair is two adjacent angles whose non-shared sides form a straight line: ray BA and ray BC are opposite rays, and ray BD lies between them, giving ∠ABD and ∠DBC.)`, solution: `Conjecture: the angles of a linear pair are supplementary — promoted to a theorem by the deductive chain (definition of linear pair, definition of straight angle, Angle Addition Postulate, substitution).` },
      relatedLoIds: ['geom.inductive-deductive-reasoning'],
    },
    {
      title: 'Worked converse trap',
      steps: [
        `Name the pieces: p is "the angles are vertical" and q is "the angles are congruent". The theorem is "if p, then q".`,
        `Check what was handed over: the classmate was given ∠1 ≅ ∠2, which is q — the CONCLUSION side, not the hypothesis.`,
        `The Law of Detachment only fires forward: it needs p to deliver q. Starting from q and reaching back to p is the converse, and the converse of a true statement can be false.`,
        `Kill it with a counterexample: draw a 40° angle in one corner of the page and a separate 40° angle in another corner. They are congruent, and they are not vertical angles — so q does not force p.`,
        `Repair it: to conclude that ∠1 ≅ ∠2 by this theorem, you must first be GIVEN that ∠1 and ∠2 are vertical angles. Then Detachment applies and the congruence follows.`,
      ],
      example: { problem: `A classmate reasons: "Our theorem says that if two angles are vertical angles, then they are congruent. I know ∠1 ≅ ∠2. So ∠1 and ∠2 are vertical angles." Is the conclusion valid? Explain, and repair the reasoning.`, solution: `Invalid — the classmate ran the arrow backward (the converse trap). Two separate 40° angles are congruent without being vertical angles; Detachment needs the hypothesis, not the conclusion.` },
      relatedLoIds: ['geom.inductive-deductive-reasoning'],
    },
  ],
  pointers: [
    { content: `Five cases make a strong CONJECTURE, not a proof — there are infinitely many triangles and she checked five. Only a deductive chain from definitions, postulates, and theorems covers them all. (That proof does exist and arrives later in the course.)`, kind: 'common-error' },
    { content: `The scoreboard is lopsided: ONE counterexample destroys a conjecture forever, while no number of confirming cases can prove one.`, kind: 'common-error' },
    { content: `Inductive reasoning goes cases → pattern → conjecture. It DISCOVERS; it never proves.`, kind: 'tip' },
    { content: `Deductive reasoning goes definitions, postulates, theorems, and givens → certain conclusion, with a REASON attached to every step.`, kind: 'tip' },
    { content: `One counterexample kills a conjecture permanently; a thousand confirming cases still leave it a guess.`, kind: 'tip' },
    { content: `Detachment runs forward (if p then q, plus p, gives q) and Syllogism chains p → q → r. Never run the arrow backward, and never read facts off a picture.`, kind: 'tip' },
    { content: `A counterexample must satisfy the hypothesis and fail the conclusion. "Two angles in separate corners of the page" only disproves "supplementary → linear pair" if the two angles actually sum to 180°. Check the hypothesis part before you call it a counterexample.`, kind: 'common-error' },
    { content: `Before applying Detachment, label the pieces: p = hypothesis, q = conclusion. Then ask which one you were *handed*. If you were handed q, the honest answer is "nothing follows" — write that, don't invent a conclusion.`, kind: 'gotcha' },
    { content: `Never read ⊥, ≅, or ∥ off a diagram. A picture may *look* like a right angle or equal segments; unless it is stated in the Given or shown with tick/arc/square marks, it does not exist for your proof.`, kind: 'common-error' },
    { content: `Don't write "proved" when you mean "conjectured." Measuring five triangles gives a conjecture; only a deductive chain earns the words *proved* and *theorem*. Verifying more cases never upgrades it.`, kind: 'vocab-note' },
    { content: `The scoreboard is not symmetric: ONE counterexample kills a conjecture permanently, while a thousand confirming cases leave it a guess. Don't say a conjecture "needs several counterexamples" or is "mostly true."`, kind: 'gotcha' },
    { content: `Syllogism needs the middle statement to match *exactly*: p → q and q → r chain to p → r. "If it's a square, it has 4 right angles" and "if it's a rectangle, it's a parallelogram" don't chain — the q's aren't the same statement.`, kind: 'edge-case' },
    { content: `In a numeric-pattern problem, extend the pattern the way the problem's structure suggests, but remember your answer is a conjecture. Adding differences (1, 3, 6, 10, 15, 21) is inductive — a formula proof would be the deductive version.`, kind: 'tip' },
    { content: `Every line of a deductive argument owes a REASON, and the reason must be a definition, postulate, theorem, or Given — never "because it looks that way" or "because I measured it." Measurement belongs to the inductive half only.`, kind: 'tip' },
  ],
};
