/**
 * Geometry — Reasoning & Proof: Conditional Statements, Converses & Counterexamples.
 *
 * The grammar of every theorem in the course (CCSS G-CO.C, MP3). Students
 * learn to rewrite claims in if-then form, build the converse / inverse /
 * contrapositive, and test truth with a single counterexample. Heavy billing
 * for the two classic errors: assuming the converse, and calling the inverse
 * a converse.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U2_CONDITIONAL_STATEMENTS: LessonPlan = {
  id: 'evelyn.hs.geom.conditional-statements.v1',
  title: 'Conditional Statements, Converses & Counterexamples',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.conditional-statements',
      standard: 'GEOM-2.2',
      description:
        'Rewrite claims in if-then form, construct the converse, inverse, and contrapositive of a conditional, and judge the truth of each — disproving a false statement with a single counterexample (CCSS G-CO.C, MP3).',
    },
  ],
  prerequisites: ['geom.inductive-deductive-reasoning'],
  followUps: ['geom.two-column-proofs'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame if-then sentences as the language of rules people actually live by — and warn that flipping a rule can break it.',
      script:
        'Building code: "If a ramp rises more than 6 inches, then it must have a handrail." Warranty: "If the seal is broken, then the coverage ends." Rules that matter get written as if-then sentences, because that form says exactly when the rule fires and exactly what follows. Every theorem you prove for the rest of this course is an if-then sentence too. Today you learn how to write one, how to flip it — and why flipping it sometimes turns a true rule into a false one. A handrail on the porch steps does not prove the porch rises more than 6 inches.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-conditionals',
      kind: 'concept',
      goal: 'If-then form, the three related conditionals, truth-testing by counterexample, and the converse trap.',
      keyIdeas: [
        'IF-THEN FORM — a conditional is "if p, then q". The p part is the HYPOTHESIS (what must be true for the rule to fire); the q part is the CONCLUSION (what follows). Any claim can be rewritten this way: "All right angles measure 90°" becomes "If an angle is a right angle, then it measures 90°."',
        'ONE COUNTEREXAMPLE KILLS IT — a conditional is FALSE only when the hypothesis is true and the conclusion is false. That single case is a counterexample. Twenty confirming examples prove nothing; one counterexample settles it forever. A case where the hypothesis is false is not a counterexample at all — the rule never fired.',
        'THE THREE RELATIVES — from "if p, then q" you can build the CONVERSE "if q, then p" (swap), the INVERSE "if not p, then not q" (negate), and the CONTRAPOSITIVE "if not q, then not p" (swap AND negate).',
        'THE CONTRAPOSITIVE IS THE TWIN — a conditional and its contrapositive ALWAYS have the same truth value; if one is true the other is true. The converse and inverse are twins of each other, but neither is a twin of the original. So a true statement can have a false converse.',
        'CLASSIC ERROR 1: ASSUMING THE CONVERSE — "If a figure is a square, then it is a rectangle" is true; its converse "If a figure is a rectangle, then it is a square" is false. Proving a statement never gives you its converse for free — the converse has to be proved separately.',
        'CLASSIC ERROR 2: MISLABELING — swapping gives the converse, negating gives the inverse. Students who only negate and call it a converse have written the inverse. Read the order of operations off the name: contra-positive = contradict (negate) AND swap.',
        'NEGATE CAREFULLY — the negation of "greater than 5" is "not greater than 5", which means 5 or less — not "less than 5". The negation of "the angle is acute" is "the angle is not acute", which includes right and obtuse angles.',
        'BICONDITIONAL = DEFINITION — when a statement AND its converse are both true, you can write "p if and only if q". Every DEFINITION works both ways (an angle is right if and only if it measures 90°), which is why definitions are legal reasons in a proof. Most theorems are one-way until their converse is proved separately.',
      ],
      vocabulary: [
        {
          term: 'converse',
          definition: 'the statement formed by swapping the hypothesis and conclusion of a conditional: "if q, then p".',
        },
        {
          term: 'counterexample',
          definition: 'a single case where the hypothesis is true but the conclusion is false, proving the conditional false.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-three-relatives',
      kind: 'worked_example',
      problem:
        'For the true statement "If two angles are vertical angles, then they are congruent", write the converse, the inverse, and the contrapositive, and decide whether each is true or false.',
      steps: [
        'Name the parts. Hypothesis p: two angles are vertical angles. Conclusion q: they are congruent.',
        'Converse (swap): "If two angles are congruent, then they are vertical angles." FALSE — reason: the two base angles of an isosceles triangle are congruent but sit side by side, not across an intersection, so they are not vertical angles. That is a counterexample.',
        'Inverse (negate both): "If two angles are NOT vertical angles, then they are NOT congruent." FALSE — reason: the same isosceles base angles are not vertical yet are congruent. (Expected: the inverse and the converse always match in truth value.)',
        'Contrapositive (swap AND negate): "If two angles are NOT congruent, then they are NOT vertical angles." TRUE — reason: it is the contrapositive of a true statement, so it must share its truth value.',
        'Read the pattern: original TRUE, contrapositive TRUE, converse FALSE, inverse FALSE. Two twins, two truth values.',
      ],
      answer:
        'Converse: false. Inverse: false. Contrapositive: true — a conditional and its contrapositive always agree.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-converse-trap',
      kind: 'worked_example',
      problem:
        'A classmate reasons: "Our theorem says: if two angles form a linear pair, then they are supplementary. Angles A and B are supplementary, so A and B must form a linear pair." Is the reasoning valid? Justify or produce a counterexample.',
      steps: [
        'Identify what was used. The theorem is p → q with p = "form a linear pair" and q = "are supplementary". The classmate started from q and concluded p — that is the CONVERSE, not the theorem.',
        'Test the converse on its own: "If two angles are supplementary, then they form a linear pair."',
        'Hunt a counterexample — a case where the hypothesis holds but the conclusion fails. Take ∠A = 130° drawn in one corner of the room and ∠B = 50° drawn on a separate sheet of paper. Reason: 130 + 50 = 180, so they are supplementary (hypothesis true).',
        'Check the conclusion for that case: a linear pair must be ADJACENT — sharing a vertex and a side, with the outer sides forming a straight line. These two angles share nothing, so they are not a linear pair (conclusion false). Counterexample found; the converse is false.',
        'Verdict: the reasoning is invalid. The true theorem lets you go linear pair → supplementary only. Going supplementary → linear pair requires proving the converse, and the converse is false.',
      ],
      answer:
        'Invalid — the classmate assumed the converse. Counterexample: a 130° angle and a separate 50° angle are supplementary but not adjacent, so they form no linear pair.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-contrapositive',
      kind: 'try_yourself',
      problem:
        'Which statement is the CONTRAPOSITIVE of "If a polygon is a square, then it has four right angles"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'If a polygon does not have four right angles, then it is not a square.', correct: true },
        { id: 'b', text: 'If a polygon has four right angles, then it is a square.' },
        { id: 'c', text: 'If a polygon is not a square, then it does not have four right angles.' },
        { id: 'd', text: 'If a polygon is a square, then it does not have four right angles.' },
      ],
      expectedAnswer: 'If a polygon does not have four right angles, then it is not a square.',
      hints: [
        'The contrapositive does BOTH moves: swap the two parts and negate both of them.',
        'Swapping alone gives the converse; negating alone gives the inverse. You need the one that did both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-counterexample',
      kind: 'try_yourself',
      problem:
        'Which case is a valid counterexample to the statement "If a quadrilateral has four congruent sides, then it is a square"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A rhombus with four 7 cm sides and angles of 60°, 120°, 60°, 120°', correct: true },
        { id: 'b', text: 'A square with four 4 cm sides and four right angles' },
        { id: 'c', text: 'A rectangle with sides 3 cm and 5 cm and four right angles' },
        { id: 'd', text: 'A parallelogram with sides 4 cm and 7 cm and angles of 70° and 110°' },
      ],
      expectedAnswer: 'A rhombus with four 7 cm sides and angles of 60°, 120°, 60°, 120°',
      hints: [
        'A counterexample must make the hypothesis TRUE — so the figure must actually have four congruent sides.',
        'Then the conclusion must FAIL: four equal sides, but the angles are not all 90°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'The statement "If two angles are complementary, then each angle measures 45°" is false. To build a counterexample you draw a first angle measuring 32°. What must the second angle measure, in degrees, for the pair to be complementary? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '58',
      hints: [
        'Complementary angles have measures adding to 90°, so the hypothesis is satisfied when 32 + x = 90.',
        'Subtract 32 from 90.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-converse-vs-inverse',
      kind: 'misconception_check',
      question:
        'A student is asked for the converse of "If two lines are perpendicular, then they form a right angle" and writes: "If two lines are not perpendicular, then they do not form a right angle." A second student says the original statement must be true because they drew six perpendicular pairs and every one made a right angle. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Converse: "If two lines are not perpendicular, then they do not form a right angle."',
          misconception: 'Treating the converse as "the negated version" — negating both parts instead of swapping them.',
          correctsTo:
            'That is the INVERSE. The converse SWAPS the parts: "If two lines form a right angle, then they are perpendicular." Swap = converse, negate = inverse, swap and negate = contrapositive.',
        },
        {
          answer: 'The statement is proven true because six drawings all worked.',
          misconception: 'Believing confirming examples prove a conditional — inductive evidence mistaken for proof.',
          correctsTo:
            'Examples can only DISPROVE (one counterexample) or suggest. To establish a conditional you argue deductively from definitions, postulates, and proved theorems — which is exactly what a two-column proof does next lesson.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A conditional is "if p (hypothesis), then q (conclusion)"; it is false only when p is true and q is false.',
        'Swap → converse. Negate → inverse. Swap AND negate → contrapositive.',
        'A statement and its contrapositive always agree; the converse and inverse agree with each other, not with the original.',
        'One counterexample (hypothesis true, conclusion false) disproves a statement; no pile of examples proves one.',
        'When a statement and its converse are both true, write it as a biconditional — that is what every definition is.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.2',
    cedTitle: 'Conditional Statements, Converses & Counterexamples',
  },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
