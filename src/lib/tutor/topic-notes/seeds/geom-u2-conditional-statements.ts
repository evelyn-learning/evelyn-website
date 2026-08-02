/**
 * Geometry — Unit 2 CED 2.2: Conditional Statements, Converses & Counterexamples.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.conditional-statements.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U2_CONDITIONAL_STATEMENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.conditional-statements.v1',
  course: 'Geometry',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Conditional Statements, Converses & Counterexamples',
  planId: 'evelyn.hs.geom.conditional-statements.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.conditional-statements.v1' }],
  theory: [
    { loId: 'geom.conditional-statements', kind: 'framework', title: 'If-then form', content: `IF-THEN FORM — a conditional is "if p, then q". The p part is the HYPOTHESIS (what must be true for the rule to fire); the q part is the CONCLUSION (what follows). Any claim can be rewritten this way: "All right angles measure 90°" becomes "If an angle is a right angle, then it measures 90°."` },
    { loId: 'geom.conditional-statements', kind: 'framework', title: 'One counterexample kills it', content: `ONE COUNTEREXAMPLE KILLS IT — a conditional is FALSE only when the hypothesis is true and the conclusion is false. That single case is a counterexample. Twenty confirming examples prove nothing; one counterexample settles it forever. A case where the hypothesis is false is not a counterexample at all — the rule never fired.` },
    { loId: 'geom.conditional-statements', kind: 'framework', title: 'The three relatives', content: `THE THREE RELATIVES — from "if p, then q" you can build the CONVERSE "if q, then p" (swap), the INVERSE "if not p, then not q" (negate), and the CONTRAPOSITIVE "if not q, then not p" (swap AND negate).` },
    { loId: 'geom.conditional-statements', kind: 'framework', title: 'The contrapositive is the twin', content: `THE CONTRAPOSITIVE IS THE TWIN — a conditional and its contrapositive ALWAYS have the same truth value; if one is true the other is true. The converse and inverse are twins of each other, but neither is a twin of the original. So a true statement can have a false converse.` },
    { loId: 'geom.conditional-statements', content: `CLASSIC ERROR 1: ASSUMING THE CONVERSE — "If a figure is a square, then it is a rectangle" is true; its converse "If a figure is a rectangle, then it is a square" is false. Proving a statement never gives you its converse for free — the converse has to be proved separately.` },
    { loId: 'geom.conditional-statements', content: `CLASSIC ERROR 2: MISLABELING — swapping gives the converse, negating gives the inverse. Students who only negate and call it a converse have written the inverse. Read the order of operations off the name: contra-positive = contradict (negate) AND swap.` },
    { loId: 'geom.conditional-statements', kind: 'framework', title: 'Negate carefully', content: `NEGATE CAREFULLY — the negation of "greater than 5" is "not greater than 5", which means 5 or less — not "less than 5". The negation of "the angle is acute" is "the angle is not acute", which includes right and obtuse angles.` },
    { loId: 'geom.conditional-statements', content: `BICONDITIONAL = DEFINITION — when a statement AND its converse are both true, you can write "p if and only if q". Every DEFINITION works both ways (an angle is right if and only if it measures 90°), which is why definitions are legal reasons in a proof. Most theorems are one-way until their converse is proved separately.` },
    { loId: 'geom.conditional-statements', kind: 'definition', title: 'converse', content: `the statement formed by swapping the hypothesis and conclusion of a conditional: "if q, then p".` },
    { loId: 'geom.conditional-statements', kind: 'definition', title: 'counterexample', content: `a single case where the hypothesis is true but the conclusion is false, proving the conditional false.` },
  ],
  methods: [
    {
      title: 'Worked three relatives',
      steps: [
        `Name the parts. Hypothesis p: two angles are vertical angles. Conclusion q: they are congruent.`,
        `Converse (swap): "If two angles are congruent, then they are vertical angles." FALSE — reason: the two base angles of an isosceles triangle are congruent but sit side by side, not across an intersection, so they are not vertical angles. That is a counterexample.`,
        `Inverse (negate both): "If two angles are NOT vertical angles, then they are NOT congruent." FALSE — reason: the same isosceles base angles are not vertical yet are congruent. (Expected: the inverse and the converse always match in truth value.)`,
        `Contrapositive (swap AND negate): "If two angles are NOT congruent, then they are NOT vertical angles." TRUE — reason: it is the contrapositive of a true statement, so it must share its truth value.`,
        `Read the pattern: original TRUE, contrapositive TRUE, converse FALSE, inverse FALSE. Two twins, two truth values.`,
      ],
      example: { problem: `For the true statement "If two angles are vertical angles, then they are congruent", write the converse, the inverse, and the contrapositive, and decide whether each is true or false.`, solution: `Converse: false. Inverse: false. Contrapositive: true — a conditional and its contrapositive always agree.` },
      relatedLoIds: ['geom.conditional-statements'],
    },
    {
      title: 'Worked converse trap',
      steps: [
        `Identify what was used. The theorem is p → q with p = "form a linear pair" and q = "are supplementary". The classmate started from q and concluded p — that is the CONVERSE, not the theorem.`,
        `Test the converse on its own: "If two angles are supplementary, then they form a linear pair."`,
        `Hunt a counterexample — a case where the hypothesis holds but the conclusion fails. Take ∠A = 130° drawn in one corner of the room and ∠B = 50° drawn on a separate sheet of paper. Reason: 130 + 50 = 180, so they are supplementary (hypothesis true).`,
        `Check the conclusion for that case: a linear pair must be ADJACENT — sharing a vertex and a side, with the outer sides forming a straight line. These two angles share nothing, so they are not a linear pair (conclusion false). Counterexample found; the converse is false.`,
        `Verdict: the reasoning is invalid. The true theorem lets you go linear pair → supplementary only. Going supplementary → linear pair requires proving the converse, and the converse is false.`,
      ],
      example: { problem: `A classmate reasons: "Our theorem says: if two angles form a linear pair, then they are supplementary. Angles A and B are supplementary, so A and B must form a linear pair." Is the reasoning valid? Justify or produce a counterexample.`, solution: `Invalid — the classmate assumed the converse. Counterexample: a 130° angle and a separate 50° angle are supplementary but not adjacent, so they form no linear pair.` },
      relatedLoIds: ['geom.conditional-statements'],
    },
  ],
  pointers: [
    { content: `"If two lines are not perpendicular, then they do not form a right angle" is the INVERSE, not the converse. The converse SWAPS the parts: "If two lines form a right angle, then they are perpendicular." Swap = converse, negate = inverse, swap and negate = contrapositive.`, kind: 'common-error' },
    { content: `Examples can only DISPROVE (one counterexample) or suggest. To establish a conditional you argue deductively from definitions, postulates, and proved theorems — which is exactly what a two-column proof does next lesson.`, kind: 'common-error' },
    { content: `A conditional is "if p (hypothesis), then q (conclusion)"; it is false only when p is true and q is false.`, kind: 'tip' },
    { content: 'Swap → converse. Negate → inverse. Swap AND negate → contrapositive.', kind: 'tip' },
    { content: `A statement and its contrapositive always agree; the converse and inverse agree with each other, not with the original.`, kind: 'tip' },
    { content: `One counterexample (hypothesis true, conclusion false) disproves a statement; no pile of examples proves one.`, kind: 'tip' },
    { content: `When a statement and its converse are both true, write it as a biconditional — that is what every definition is.`, kind: 'tip' },
    { content: `Swap = converse. Negate = inverse. Swap AND negate = contrapositive. If you only negated both parts and called it the converse, you wrote the **inverse** — the single most common mislabel in this topic.`, kind: 'common-error' },
    { content: `A counterexample needs the hypothesis TRUE and the conclusion FALSE. A case where the hypothesis fails is not a counterexample — the rule never fired. "A triangle isn't a square" disproves nothing about a statement whose hypothesis is "if a figure is a square".`, kind: 'gotcha' },
    { content: `Negate by writing "not ...", then translate carefully: not(greater than 5) = 5 or less, not(acute) = right OR obtuse, not(equilateral) includes isosceles. Don't flip to the opposite extreme.`, kind: 'vocab-note' },
    { content: `Proving p → q gives you the contrapositive for free and NOTHING else. If a proof step starts from the conclusion of a theorem and lands on its hypothesis, you assumed the converse — flag it as invalid unless the converse was separately proved.`, kind: 'common-error' },
    { content: `Drawing six confirming figures proves nothing. Examples can only disprove (one counterexample) or hint. To establish a conditional you must argue from definitions, postulates, and proved theorems.`, kind: 'gotcha' },
    { content: `Quick self-check: converse and inverse must always get the SAME truth value, and the original and contrapositive must match too. If your four answers don't pair up 2-and-2, you mislabeled or negated wrong.`, kind: 'tip' },
    { content: `Only write "p if and only if" q when you've checked BOTH directions are true. Every definition is biconditional; most theorems are one-way. Don't upgrade a theorem to a definition just because it's true.`, kind: 'edge-case' },
    { content: `Rewrite "all/every/no" claims in if-then form before working with them. "All right angles measure 90°" → hypothesis: an angle is a right angle; conclusion: it measures 90°. Don't guess parts from word order.`, kind: 'tip' },
  ],
};
