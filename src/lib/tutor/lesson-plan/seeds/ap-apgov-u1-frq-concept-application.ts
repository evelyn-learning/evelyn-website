/**
 * AP US Government & Politics — Unit 1 FRQ Practice: Concept Application
 * (AP Gov FRQ 1), the shortest and most frequently tested of the four AP
 * Gov free-response formats — 3 points, one point per lettered part, no
 * stimulus document.
 *
 * Format (per the authentic AP Gov Concept Application FRQ): a short,
 * non-partisan hypothetical political scenario, followed by three parts —
 * (A) DESCRIBE a course concept the scenario illustrates, (B) EXPLAIN how
 * that concept, in the context of the scenario, affects a political
 * institution or behavior, and (C) EXPLAIN how a second, different Unit-1
 * principle could be used to respond to or limit the situation in the
 * scenario. Unlike Quantitative Analysis or SCOTUS Comparison, Concept
 * Application carries NO passageId/passageIds — the scenario is entirely
 * self-contained prose, so nothing here is graded against a seeded
 * document; every modelResponse answers strictly from the scenario text.
 *
 * Scenario draws on the federalism-foundations content plan
 * (ap-apgov-u1-federalism.ts): categorical grants (conditional federal
 * funding attached to a narrow purpose) for part (A)/(B), and the Tenth
 * Amendment's reservation of powers to the states — a distinct federalism
 * principle from the grant mechanism itself — for part (C).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_FRQ_CONCEPT_APPLICATION: LessonPlan = {
  id: 'evelyn.ap.apgov.u1-frq-concept-application.v1',
  title: 'Unit 1 FRQ Practice — Concept Application',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u1-frq-concept-application',
      description:
        'Answer a complete AP Gov Concept Application free-response question — a short non-partisan scenario followed by three parts that describe a course concept the scenario illustrates, explain how that concept affects a political institution or behavior in context, and explain how a different Unit-1 principle could be used to respond to or limit the scenario\'s action — scored against the authentic AP Gov 3-point Concept Application rubric (1 point per part).',
      standard: 'AP-APGOV-1-FRQ-CA',
    },
  ],
  prerequisites: ['apgov.federalism-foundations'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the shortest AP Gov FRQ format concrete, and correct the instinct to write a mini-essay when the task wants three tight, targeted answers.',
      script:
        "Of the four free-response questions on the AP Gov exam, Concept Application is the shortest — just 3 points — but it trips up more students than its length suggests. You'll get a short political scenario, usually invented and deliberately non-partisan, and three parts: describe a concept the scenario illustrates, explain how that concept affects something in the scenario, and explain how a completely different course principle could respond to or limit what's happening. The trap is writing one long paragraph that blends all three together. The fix is the opposite: treat each letter as its own tight, separate answer, tied directly back to the scenario's specific details — not a general definition recited from memory. Today you'll answer one complete Concept Application FRQ and get scored the way an AP reader would score it, part by part.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ca-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Concept Application FRQ asks for and how the 3-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get a short, invented, non-partisan political scenario (never a real current event) and three parts, each worth 1 point and graded independently. There is no thesis, no contextualization, no document — this format tests whether you can APPLY course concepts to a new, concrete situation, not whether you can recite a definition in the abstract.',
        'PART (A) — DESCRIBE (0-1 point): "describe" is a lower bar than "explain" but still higher than "name." Full credit requires stating what the concept IS and connecting it to the specific detail in the scenario that illustrates it — not just dropping the vocabulary term with no elaboration. Simply writing "this is federalism" earns nothing; describing WHAT federalism principle is at work and HOW the scenario shows it does.',
        'PART (B) — EXPLAIN IN CONTEXT (0-1 point): "explain" always means cause-and-effect, tied to the specific scenario — not a general explanation of the concept from part (A) in the abstract. Full credit requires showing HOW or WHY the concept from (A) affects a named political institution\'s behavior, incentives, or options, using scenario-specific details, not a textbook definition restated.',
        'PART (C) — EXPLAIN A SECOND, DIFFERENT PRINCIPLE (0-1 point): this part deliberately asks for a DIFFERENT course concept than the one used in (A)/(B) — reusing the same concept from (A) earns no credit here. Full credit requires explaining how that second principle could be used to RESPOND TO or LIMIT the action described in the scenario, with the explanation grounded in the scenario\'s specific facts.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: naming a concept without describing/explaining it ("this shows federalism" and nothing more), or explaining a concept in the abstract without ever tying it back to what the scenario specifically says.',
        'Total = 3 points, one per part, each graded independently — missing part (a) does not cost you credit on (b) or (c). This is the authentic AP Gov Concept Application scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-concept-application-frq',
      kind: 'try_yourself',
      problem:
        "Read the scenario and answer parts (A), (B), and (C).\n\nThe federal government creates a new education grant program for state K-12 systems. To receive any of the grant's funding, a state must agree to adopt a specific reading curriculum framework chosen by the U.S. Department of Education and submit to federal compliance audits of participating schools. Governor Ruiz publicly objects, arguing that curriculum decisions have always belonged to the states and that the new conditions amount to the federal government dictating classroom content through the back door of the budget. In the state legislature, some members argue the state should accept both the money and the conditions because the funding gap is severe; others argue the legislature should refuse the grant entirely rather than cede control over curriculum policy to Washington.\n\n(A) Describe the concept of a categorical grant illustrated in the scenario.\n(B) In the context of the scenario, explain how a categorical grant's conditions affect the state legislature's policymaking behavior.\n(C) In the context of the scenario, explain how the Tenth Amendment's reservation of powers to the states could be used to limit the federal government's influence over the state's curriculum decision.",
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The scenario illustrates a categorical grant: federal education funding offered to states, but restricted to a narrow purpose and conditioned on the state adopting a specific federally chosen curriculum framework and submitting to compliance audits — money with strings attached, rather than funding the state is free to spend as it sees fit. (B) Because accepting the grant requires adopting the federal curriculum framework, the conditions pressure the state legislature to align its education policy with federal preferences even though education is not an enumerated national power; the legislature's real choice is narrowed to either surrendering curriculum control in exchange for the funding or refusing the money to preserve full policymaking discretion, giving the federal government indirect influence over a policy area it cannot regulate directly. (C) Because education is not among the national government's enumerated powers, it is reserved to the states under the Tenth Amendment; that reserved authority means the state legislature retains the constitutional option to simply refuse the categorical grant and its conditions, keeping full control over its own curriculum at the cost of forgoing the federal funding — a check on federal leverage that does not depend on winning a court case, only on the state's willingness to decline the money.",
      rubric: {
        parts: [
          {
            criterionId: 'A-describe',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes — more than simply names — the concept of a categorical grant, stating that it is federal funding restricted to a narrow purpose with conditions attached (here, adopting a specific curriculum and submitting to audits), and connects this to the scenario\'s specific detail. No credit (0/1) for writing "categorical grant" with no description of what that means, or a description with no connection to the scenario.',
            modelResponse:
              'The scenario illustrates a categorical grant: federal education funding that is not unrestricted, but instead conditioned on the state adopting a specific federally chosen reading curriculum framework and submitting participating schools to federal compliance audits — funding tied to a narrowly defined purpose and set of conditions, not money the state is free to spend however it chooses.',
          },
          {
            criterionId: 'B-explain-in-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, using scenario-specific detail, HOW the categorical grant\'s conditions affect the state legislature\'s policymaking behavior — e.g. the conditions pressure the legislature to adopt the federally preferred curriculum in order to receive the funding, narrowing the legislature\'s real choice to accept-with-conditions or refuse-and-lose-funding. No credit (0/1) for a generic definition of categorical grants with no cause-and-effect tie to the state legislature\'s behavior in THIS scenario.',
            modelResponse:
              'Because receiving the grant requires adopting the federally chosen curriculum framework, the conditions pressure the state legislature to align its education policy with federal preferences even though education is traditionally a state matter — the legislature\'s decision is no longer simply "what curriculum do we want" but "is the funding worth surrendering curriculum control," giving the federal government indirect influence over a policy area it cannot regulate directly through an enumerated power.',
          },
          {
            criterionId: 'C-explain-second',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains a DIFFERENT Unit-1 principle than the one used in (A)/(B) — here, the Tenth Amendment\'s reservation of powers to the states — and explains, tied to the scenario, how it could be used to respond to or limit the federal government\'s action. No credit (0/1) for reusing the categorical-grant concept from (A) instead of a second principle, or for an explanation not grounded in the scenario.',
            modelResponse:
              "Because education is not among the national government's enumerated powers, it is reserved to the states under the Tenth Amendment; that reserved authority gives the state legislature the constitutional option to simply refuse the categorical grant and its conditions, preserving full control over its own curriculum at the cost of forgoing the federal funding — a limit on federal leverage grounded in reserved powers, distinct from the grant mechanism described in parts (A) and (B).",
          },
        ],
      },
      hints: [
        'Each part is its own answer — don\'t blend (A), (B), and (C) into one paragraph.',
        '"Describe" wants what the concept IS plus the scenario detail that shows it; "explain" always wants cause-and-effect tied to the scenario, not a textbook definition.',
        'Part (C) wants a DIFFERENT principle than (A) — reusing the same concept there earns no credit.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Concept Application is 3 points, one per part, each graded independently — a short non-partisan scenario, no document, no thesis.',
        '"Describe" (part A) wants the concept plus the scenario detail that shows it; "explain" (parts B/C) always wants cause-and-effect tied to the scenario\'s specific facts, not a general definition.',
        'Part (C) deliberately asks for a SECOND, DIFFERENT course principle than the one used in (A)/(B) — reusing the same concept earns no credit there.',
        'A categorical grant restricts federal funding to a narrow purpose with conditions attached; the Tenth Amendment\'s reserved powers give states the option to refuse those conditions by refusing the money.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-FRQ-CA',
    cedTitle: 'Unit 1 FRQ Practice — Concept Application',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Concept Application free-response task wording and 3-point rubric (1 point per lettered part).',
      },
    ],
  },
};
