/**
 * Geometry — Reasoning & Proof: Inductive & Deductive Reasoning.
 *
 * The gateway to the proof culture (CCSS G-CO.C; MP3): patterns DISCOVER
 * geometry, deduction PROVES it. Equal billing for the two classic
 * failures — treating confirming examples as proof, and running an
 * if-then arrow backward — because avoiding those is what makes the rest
 * of the course honest.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U2_INDUCTIVE_DEDUCTIVE_REASONING: LessonPlan = {
  id: 'evelyn.hs.geom.inductive-deductive-reasoning.v1',
  title: 'Inductive & Deductive Reasoning',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.inductive-deductive-reasoning',
      standard: 'GEOM-2.1',
      description:
        'Distinguish inductive from deductive reasoning, state conjectures from patterns and disprove them with a single counterexample, and apply the Law of Detachment and the Law of Syllogism to reach valid conclusions (CCSS G-CO.C, MP3).',
    },
  ],
  prerequisites: ['geom.angle-pair-relationships'],
  followUps: ['geom.conditional-statements'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Separate the reasoning that DISCOVERS a result from the reasoning that GUARANTEES it — the difference between a hunch and a building that stands.',
      script:
        'An architect notices that the last five arches she designed all held their load, and starts to believe the shape is safe. A structural engineer will not sign the drawings on that. One is pattern-spotting; the other demands a chain of reasons that cannot fail. Geometry runs on both. You will use patterns to GUESS what is true, and deduction to KNOW it — and today you learn exactly where the first kind of reasoning stops being trustworthy.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-reasonings',
      kind: 'concept',
      goal: 'Inductive vs deductive reasoning, the power of one counterexample, and the two laws that move a proof forward.',
      keyIdeas: [
        'INDUCTIVE REASONING — look at specific cases, spot the pattern, state a general claim. It is how every theorem in this course was FOUND. It is never how one is proved.',
        'CONJECTURE — the general claim inductive reasoning produces. A conjecture is a well-supported guess with no guarantee attached, no matter how many cases back it.',
        'COUNTEREXAMPLE — a single case where the hypothesis holds but the conclusion fails. ONE counterexample destroys a conjecture permanently. A thousand confirming cases prove nothing.',
        'DEDUCTIVE REASONING — start from definitions, postulates, theorems, and the given facts, and force each step. The conclusion is certain, not likely. Every step owes a REASON.',
        'LAW OF DETACHMENT — if the statement "if p, then q" is true AND p is true, then q is true. The arrow runs FORWARD only.',
        'THE CONVERSE TRAP (classic error) — being handed q does NOT let you conclude p. "If it is a square, it has four right angles" plus "this shape has four right angles" gives nothing: a rectangle qualifies too.',
        'LAW OF SYLLOGISM — if p leads to q and q leads to r, then p leads to r. Chaining short implications like this is literally what a proof is.',
        'DIAGRAMS ARE NOT GIVENS (classic error) — you may never assume a right angle, congruent segments, or parallel lines because a picture looks that way. Only stated or marked facts count: ⊥, ≅, and ∥ have to be told to you.',
      ],
      vocabulary: [
        { term: 'conjecture', definition: 'a general statement believed true based on observed cases, but not yet proved.' },
        { term: 'counterexample', definition: 'one specific case that satisfies the hypothesis but fails the conclusion, disproving a conjecture.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-conjecture-then-prove',
      kind: 'worked_example',
      problem:
        'A class measures several linear pairs of angles and records 30° with 150°, 72° with 108°, and 115° with 65°. State the conjecture the pattern suggests, then prove it deductively. (A linear pair is two adjacent angles whose non-shared sides form a straight line: ray BA and ray BC are opposite rays, and ray BD lies between them, giving ∠ABD and ∠DBC.)',
      steps: [
        'Inductive step — add each recorded pair: 30 + 150 = 180, 72 + 108 = 180, 115 + 65 = 180. The pattern is a constant sum of 180°.',
        'State the conjecture: the two angles of a linear pair are supplementary. This is a GUESS so far — three cases, not a proof.',
        'Now deduce it. Statement: ∠ABD and ∠DBC form a linear pair. Reason: Given.',
        'Statement: ray BA and ray BC are opposite rays, so ∠ABC is a straight angle. Reason: Definition of a linear pair.',
        'Statement: m∠ABC = 180°. Reason: Definition of a straight angle.',
        'Statement: m∠ABD + m∠DBC = m∠ABC. Reason: Angle Addition Postulate.',
        'Statement: m∠ABD + m∠DBC = 180°. Reason: Substitution. The chain covers EVERY linear pair, so the conjecture is now a theorem.',
      ],
      answer:
        'Conjecture: the angles of a linear pair are supplementary — promoted to a theorem by the deductive chain (definition of linear pair, definition of straight angle, Angle Addition Postulate, substitution).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-converse-trap',
      kind: 'worked_example',
      problem:
        'A classmate reasons: "Our theorem says that if two angles are vertical angles, then they are congruent. I know ∠1 ≅ ∠2. So ∠1 and ∠2 are vertical angles." Is the conclusion valid? Explain, and repair the reasoning.',
      steps: [
        'Name the pieces: p is "the angles are vertical" and q is "the angles are congruent". The theorem is "if p, then q".',
        'Check what was handed over: the classmate was given ∠1 ≅ ∠2, which is q — the CONCLUSION side, not the hypothesis.',
        'The Law of Detachment only fires forward: it needs p to deliver q. Starting from q and reaching back to p is the converse, and the converse of a true statement can be false.',
        'Kill it with a counterexample: draw a 40° angle in one corner of the page and a separate 40° angle in another corner. They are congruent, and they are not vertical angles — so q does not force p.',
        'Repair it: to conclude that ∠1 ≅ ∠2 by this theorem, you must first be GIVEN that ∠1 and ∠2 are vertical angles. Then Detachment applies and the congruence follows.',
      ],
      answer:
        'Invalid — the classmate ran the arrow backward (the converse trap). Two separate 40° angles are congruent without being vertical angles; Detachment needs the hypothesis, not the conclusion.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-detachment',
      kind: 'try_yourself',
      problem:
        'A theorem states: if a quadrilateral is a square, then it has four right angles. You are told that quadrilateral QRST has four right angles. What does deductive reasoning let you conclude about QRST?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'QRST is a square' },
        { id: 'b', text: 'QRST is not a square' },
        { id: 'c', text: 'Nothing — the given fact matches the conclusion, not the hypothesis', correct: true },
        { id: 'd', text: 'QRST has four congruent sides' },
      ],
      expectedAnswer: 'Nothing — the given fact matches the conclusion, not the hypothesis',
      hints: [
        'The Law of Detachment needs the hypothesis p to hand you the conclusion q. Which one were you handed?',
        'You were handed the four right angles, which is q. Running back to p is the converse trap — a non-square rectangle has four right angles too.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-counterexample',
      kind: 'try_yourself',
      problem:
        'Consider the conjecture: "If two angles are supplementary, then they form a linear pair." Which single example disproves it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A 130° angle and a 50° angle drawn in separate parts of the plane, sharing no side', correct: true },
        { id: 'b', text: 'A 130° angle and a 50° angle that form a linear pair' },
        { id: 'c', text: 'A pair of vertical angles that each measure 90°' },
        { id: 'd', text: 'Two 40° angles that share a common side' },
      ],
      expectedAnswer: 'A 130° angle and a 50° angle drawn in separate parts of the plane, sharing no side',
      hints: [
        'A counterexample must SATISFY the hypothesis (supplementary) and BREAK the conclusion (linear pair).',
        'Two angles adding to 180° do not have to touch each other at all — and a linear pair must be adjacent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-pattern',
      kind: 'try_yourself',
      problem:
        'Points are placed on a circle and every point is joined to every other point by a segment. With 2 points there is 1 segment, with 3 points there are 3 segments, with 4 points there are 6, and with 5 points there are 10. Using inductive reasoning, how many segments are there for 7 points? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '21',
      hints: [
        'Look at the jumps between terms: 1 to 3 to 6 to 10. How much is added each time, and what happens to that amount?',
        'The jumps are 2, then 3, then 4 — so the next jumps are 5 and 6: six points give 15, and seven points give 15 + 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-examples-are-not-proof',
      kind: 'misconception_check',
      question:
        'A student measures the three angles of five different triangles and gets a sum of 180° every time. She writes: "I have proved that the angle sum of every triangle is 180°." Is she right?',
      commonErrors: [
        {
          answer: 'Yes — five triangles all worked, so the statement is proved',
          misconception: 'Treating repeated confirming examples as a proof.',
          correctsTo:
            'Five cases make a strong CONJECTURE, not a proof — there are infinitely many triangles and she checked five. Only a deductive chain from definitions, postulates, and theorems covers them all. (That proof does exist and arrives later in the course.)',
        },
        {
          answer: 'Her conjecture would only be in trouble if a lot of triangles failed',
          misconception: 'Believing a conjecture needs several counterexamples before it falls.',
          correctsTo:
            'The scoreboard is lopsided: ONE counterexample destroys a conjecture forever, while no number of confirming cases can prove one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Inductive reasoning goes cases → pattern → conjecture. It DISCOVERS; it never proves.',
        'Deductive reasoning goes definitions, postulates, theorems, and givens → certain conclusion, with a REASON attached to every step.',
        'One counterexample kills a conjecture permanently; a thousand confirming cases still leave it a guess.',
        'Detachment runs forward (if p then q, plus p, gives q) and Syllogism chains p → q → r. Never run the arrow backward, and never read facts off a picture.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Inductive & Deductive Reasoning' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
