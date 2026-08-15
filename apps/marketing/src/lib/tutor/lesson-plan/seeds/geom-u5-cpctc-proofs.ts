/**
 * Geometry — Triangles: Congruence Proofs with CPCTC.
 *
 * The payoff lesson of the congruence unit (CCSS G-CO.B.7, G-CO.C.10):
 * the criteria get you the triangles, CPCTC gets you the part you actually
 * wanted. Ordering is the whole lesson — CPCTC is a conclusion drawn FROM
 * congruence, never an ingredient used to establish it.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U5_CPCTC_PROOFS: LessonPlan = {
  id: 'evelyn.hs.geom.cpctc-proofs.v1',
  title: 'Congruence Proofs with CPCTC',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.cpctc-proofs',
      standard: 'GEOM-5.3',
      description:
        'Prove two triangles congruent with a valid criterion and then use CPCTC to justify that a remaining pair of corresponding sides or angles is congruent, supplying a reason for every statement (CCSS G-CO.B.7, G-CO.C.10).',
    },
  ],
  prerequisites: ['geom.triangle-congruence-criteria'],
  followUps: ['geom.isosceles-equilateral'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame CPCTC as the tool that lets you measure what you cannot reach — the reason congruence proofs are worth writing.',
      script:
        'A surveyor needs the distance across a river, but walking the tape across is not an option. So she builds a triangle on her own bank that is congruent to the triangle spanning the water — and measures the copy instead. That move only works because of one guarantee: once two triangles are congruent, EVERY pair of matching parts is equal, including the one you could never reach. Last lesson you learned to prove congruence with three parts. Today you learn to cash it in for the other three.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cpctc',
      kind: 'concept',
      goal: 'What CPCTC says, where it is allowed to appear in a proof, and the two errors that break proofs.',
      keyIdeas: [
        'WHAT CPCTC STANDS FOR — Corresponding Parts of Congruent Triangles are Congruent. Once △ABC ≅ △DEF is on the page, all six matching parts follow for free: AB ≅ DE, BC ≅ EF, CA ≅ FD, ∠A ≅ ∠D, ∠B ≅ ∠E, ∠C ≅ ∠F.',
        'THE TWO-STAGE SHAPE OF EVERY PROOF — Stage 1: collect three parts and name a criterion (SSS, SAS, ASA, AAS, or HL) to conclude the triangles are congruent. Stage 2: write the ONE part you were asked about and justify it with CPCTC. Nothing else goes between those stages.',
        'CPCTC COMES LAST, NEVER FIRST — it is a conclusion drawn FROM congruence, so it may only appear on a line BELOW the congruence statement. Using it to supply one of the three parts you still need is circular reasoning.',
        'EVERY STATEMENT NEEDS A REASON — in a two-column proof the left column states, the right column justifies. Legal reasons: Given, a definition (midpoint, angle bisector, perpendicular), a property (Reflexive), a theorem (Vertical Angles), a congruence criterion, or CPCTC.',
        'HIDDEN GIVENS FEED STAGE 1 — a shared side is congruent to itself (Reflexive Property); vertical angles are congruent; a midpoint splits a segment into two congruent pieces; an angle bisector makes two congruent angles; ⊥ marks create two 90° angles.',
        'LETTER ORDER IS THE LOOKUP TABLE — write the congruence statement with corresponding vertices in matching positions, and reading off a part becomes mechanical. △ABC ≅ △DEF pairs ∠B with ∠E; the sloppy △ABC ≅ △EDF pairs ∠B with ∠D instead and every CPCTC line after it is wrong.',
        'WHAT CPCTC BUYS YOU DOWNSTREAM — once CPCTC hands you an angle pair, you can keep going: congruent alternate interior angles prove two lines parallel, congruent adjacent angles prove a ray is a bisector, and a pair of congruent supplementary angles proves lines are perpendicular.',
      ],
      vocabulary: [
        {
          term: 'CPCTC',
          definition:
            'Corresponding Parts of Congruent Triangles are Congruent — the reason cited when a matching pair of sides or angles is claimed after the triangles have already been proved congruent.',
        },
        {
          term: 'Reflexive Property',
          definition:
            'any segment or angle is congruent to itself — the reason that lets a shared side count as a matching pair in both triangles.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-midpoint-x',
      kind: 'worked_example',
      problem:
        'Segments AC and BD intersect at point M. Given: M is the midpoint of AC, and M is the midpoint of BD. Prove that AB ≅ CD. Write the statement and reason for each line.',
      steps: [
        'Statement: M is the midpoint of AC and of BD. Reason: Given.',
        'Statement: AM ≅ CM and BM ≅ DM. Reason: Definition of midpoint (a midpoint cuts a segment into two congruent pieces).',
        'Statement: ∠AMB ≅ ∠CMD. Reason: Vertical Angles Theorem — the two segments cross at M, so these angles sit opposite each other.',
        'Check the arrangement before naming the criterion: side AM, included angle ∠AMB, side BM — the angle sits BETWEEN the two sides.',
        'Statement: △AMB ≅ △CMD. Reason: SAS. (Stage 1 is done — the congruence is now on the page.)',
        'Statement: AB ≅ CD. Reason: CPCTC — AB and CD are corresponding parts, matched by the letter order A↔C, M↔M, B↔D.',
      ],
      answer: 'AB ≅ CD by CPCTC, after proving △AMB ≅ △CMD by SAS.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-circular-cpctc',
      kind: 'worked_example',
      problem:
        'A student is asked to prove AB ≅ DE given only that ∠A ≅ ∠D and ∠B ≅ ∠E in triangles ABC and DEF. The student writes: (1) ∠A ≅ ∠D — Given. (2) ∠B ≅ ∠E — Given. (3) AB ≅ DE — CPCTC. (4) △ABC ≅ △DEF — ASA. What is wrong with this proof?',
      steps: [
        'Read line 3 against line 4: CPCTC is a conclusion that follows FROM a congruence, but the congruence is not stated until line 4 — the proof borrows its own conclusion.',
        'That circularity also breaks line 4: ASA needs a genuine side pair, and the only side offered came from the illegal line 3. Strip line 3 and just two angle pairs remain.',
        'Two pairs of angles with no side is the AAA pattern — it forces the SHAPE to match but not the SIZE, so the triangles are similar, not necessarily congruent. No criterion applies and the proof cannot be repaired by rearranging lines.',
        'What a legal version looks like: if AB ≅ DE had been GIVEN, then (1) ∠A ≅ ∠D, (2) AB ≅ DE, (3) ∠B ≅ ∠E — Given; (4) △ABC ≅ △DEF — ASA (the given side is included between the two given angles); (5) BC ≅ EF — CPCTC.',
        'The rule that prevents this every time: CPCTC may only appear on a line BELOW the line that names the congruence criterion.',
      ],
      answer:
        'The proof is circular — line 3 uses CPCTC before congruence is established, and without that illegal line only two angle pairs remain, which is AAA and proves nothing about size.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-reason',
      kind: 'try_yourself',
      problem:
        'Triangles JKL and MKL share side KL. A proof reads: (1) JK ≅ MK — Given. (2) ∠JKL ≅ ∠MKL — Given. (3) KL ≅ KL — ? (4) △JKL ≅ △MKL — SAS. (5) JL ≅ ML — CPCTC. Which reason belongs on line 3?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Reflexive Property', correct: true },
        { id: 'b', text: 'CPCTC' },
        { id: 'c', text: 'Definition of midpoint' },
        { id: 'd', text: 'Vertical Angles Theorem' },
      ],
      expectedAnswer: 'Reflexive Property',
      hints: [
        'Line 3 claims a segment is congruent to itself — which reason says exactly that?',
        'KL is the side the two triangles share; no midpoint and no crossing lines appear anywhere in this proof.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-legal-cpctc',
      kind: 'try_yourself',
      problem: 'Which of these is a legitimate use of CPCTC inside a two-column proof?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Stating AB ≅ DE so that △ABC ≅ △DEF can then be proved by SSS' },
        { id: 'b', text: 'Stating ∠C ≅ ∠F on the line after △ABC ≅ △DEF has been proved by ASA', correct: true },
        { id: 'c', text: 'Stating that two triangles are congruent because all three pairs of angles match' },
        { id: 'd', text: 'Stating BC ≅ EF on the first line of the proof, before any criterion has been named' },
      ],
      expectedAnswer: 'Stating ∠C ≅ ∠F on the line after △ABC ≅ △DEF has been proved by ASA',
      hints: [
        'CPCTC is a payout, not an ingredient — which option collects it after the congruence is already on the page?',
        'Three of these place CPCTC before the congruence statement exists, or use it to claim the congruence itself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A proof establishes △GHJ ≅ △KLM by SAS, so ∠H ≅ ∠L by CPCTC. If m∠H = (5x - 12)° and m∠L = 43°, solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '11',
      hints: [
        'CPCTC makes the two angle measures equal: 5x - 12 = 43.',
        'Add 12 to both sides, then divide by 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cpctc-too-early',
      kind: 'misconception_check',
      question:
        'A student writes: (1) AB ≅ DE — CPCTC. (2) ∠A ≅ ∠D — Given. (3) AC ≅ DF — Given. (4) △ABC ≅ △DEF — SAS. Every line has a reason, so is the proof valid?',
      commonErrors: [
        {
          answer: 'Yes — all four lines are justified, so the proof works',
          misconception:
            'Treating CPCTC as a way to OBTAIN a matching part, rather than as a conclusion that only follows once congruence is already proved.',
          correctsTo:
            'Line 1 assumes the triangles are congruent in order to prove they are congruent — circular. CPCTC may only appear BELOW the line naming the criterion. Build the three parts from givens, definitions, or theorems (a shared side, vertical angles, a midpoint), name SSS/SAS/ASA/AAS/HL, and cite CPCTC after that.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CPCTC = Corresponding Parts of Congruent Triangles are Congruent — one congruence statement hands you all six matching parts.',
        'Two stages, always in this order: prove the triangles congruent with a criterion, THEN cite CPCTC for the part you were asked about.',
        'CPCTC never supplies a part used to reach the congruence — that is circular reasoning.',
        'Every line needs a reason: Given, definition, Reflexive Property, Vertical Angles Theorem, a criterion, or CPCTC.',
        'Write the congruence statement with vertices in matching order — the letter order tells you which parts correspond.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Congruence Proofs with CPCTC' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
