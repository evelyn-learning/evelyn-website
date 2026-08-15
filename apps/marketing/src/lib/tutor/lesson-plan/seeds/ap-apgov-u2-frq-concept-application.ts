/**
 * AP US Government & Politics — Unit 2 FRQ Practice: Concept Application
 * (AP Gov FRQ 1) — 3 points, one point per lettered part, no stimulus
 * document.
 *
 * Format (per the authentic AP Gov Concept Application FRQ): a short,
 * non-partisan hypothetical political scenario, followed by three parts —
 * (A) DESCRIBE a course concept the scenario illustrates, (B) EXPLAIN how
 * that concept, in the context of the scenario, affects a political
 * institution or behavior, and (C) EXPLAIN how a different course
 * principle could be used to respond to the situation. NO
 * passageId/passageIds — the scenario is entirely self-contained prose;
 * every modelResponse answers strictly from the scenario text.
 *
 * Scenario draws on the Unit-2 presidency and congressional-powers content
 * plans (ap-apgov-u2-presidency.ts, ap-apgov-u2-congress.ts): the formal
 * war-power tension between Congress's Article I power to declare war and
 * the president's Article II commander-in-chief role for part (A), the
 * power of the purse as a congressional check for part (B), and the "going
 * public" informal presidential power for part (C).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_FRQ_CONCEPT_APPLICATION: LessonPlan = {
  id: 'evelyn.ap.apgov.u2-frq-concept-application.v1',
  title: 'Unit 2 FRQ Practice — Concept Application',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u2-frq-concept-application',
      description:
        'Answer a complete AP Gov Concept Application free-response question — a short non-partisan scenario about war powers followed by three parts that describe the formal constitutional war power creating the scenario\'s tension, explain how Congress\'s power of the purse can check the president in context, and explain how the president could respond using an informal power — scored against the authentic AP Gov 3-point Concept Application rubric (1 point per part).',
      standard: 'AP-APGOV-2-FRQ-CA',
    },
  ],
  prerequisites: ['apgov.congress-structure', 'apgov.presidency-power'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the shortest AP Gov FRQ format concrete for a war-powers scenario, and correct the instinct to write a mini-essay when the task wants three tight, targeted answers.',
      script:
        "Of the four free-response questions on the AP Gov exam, Concept Application is the shortest — just 3 points — but it trips up more students than its length suggests. You'll get a short political scenario, usually invented and deliberately non-partisan, and three parts: describe a concept the scenario illustrates, explain how that concept affects something in the scenario, and explain how a completely different course principle could respond to what's happening. Unit 2's version of this trap often shows up around war powers, where students blur together the president's commander-in-chief authority, Congress's power to declare war, and Congress's power of the purse into one vague answer. Today's scenario is a president who orders airstrikes without congressional authorization as the clock runs on the War Powers Resolution — and you'll answer all three parts the way an AP reader would score them, part by part.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ca-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Concept Application FRQ asks for and how the 3-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get a short, invented, non-partisan political scenario (never a real current event) and three parts, each worth 1 point and graded independently. There is no thesis, no contextualization, no document — this format tests whether you can APPLY course concepts to a new, concrete situation, not whether you can recite a definition in the abstract.',
        'PART (A) — DESCRIBE (0-1 point): "describe" is a lower bar than "explain" but still higher than "name." Full credit requires stating what the constitutional power IS and connecting it to the specific tension in the scenario — not just dropping a vocabulary term with no elaboration.',
        'PART (B) — EXPLAIN IN CONTEXT (0-1 point): "explain" always means cause-and-effect, tied to the specific scenario. Full credit requires showing HOW Congress\'s power of the purse could actually be used to check the president in THIS scenario, using scenario-specific details (the appropriations bill, the funding cutoff), not a textbook definition of the power of the purse restated in the abstract.',
        'PART (C) — EXPLAIN AN INFORMAL PRESIDENTIAL RESPONSE (0-1 point): this part asks for an INFORMAL power — one not written into Article II\'s enumerated list (veto, commander-in-chief, appointments, pardons) but exercised through the office\'s political and public influence, such as going public, bargaining, or issuing an executive order. Full credit requires explaining how that informal power could be used to respond to the specific pressure described in the scenario.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: naming a power without describing/explaining it ("this shows the power of the purse" and nothing more), or confusing an informal power (part C) with one of the president\'s formal Article II powers.',
        'Total = 3 points, one per part, each graded independently — missing part (a) does not cost you credit on (b) or (c). This is the authentic AP Gov Concept Application scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-concept-application-frq',
      kind: 'try_yourself',
      problem:
        "Read the scenario and answer parts (A), (B), and (C).\n\nThe president orders a series of airstrikes against militant camps in a country with which the United States is not at war, citing an imminent threat to American forces stationed nearby. The president does not seek a declaration of war from Congress, nor a specific authorization for use of military force, either before the strikes begin or in the weeks that follow. Under the War Powers Resolution of 1973, the president must withdraw U.S. forces from hostilities within 60 days unless Congress declares war or specifically authorizes the operation; that 60-day deadline is now approaching. Members of Congress debate formally invoking the Resolution, and several propose attaching a provision cutting off funding for the airstrikes to a must-pass appropriations bill needed to keep the government funded.\n\n(A) Describe the formal constitutional war power that creates the tension in the scenario.\n(B) In the context of the scenario, explain how Congress can use its power of the purse to check the president.\n(C) Explain how the president could respond to the funding-cutoff threat using an informal power.",
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The scenario's tension comes from Congress's Article I, Section 8 power to declare war colliding with the president's Article II role as commander-in-chief: the president ordered airstrikes and kept them running toward the Resolution's 60-day deadline without Congress ever declaring war or authorizing the operation, so the formal constitutional question is whether the president may direct sustained military action that only Congress has the constitutional power to formally declare. (B) Because federal funds cannot be spent without a congressional appropriation, Congress can attach a provision cutting off funding for the airstrikes to the must-pass appropriations bill; since that bill has to pass to keep the government funded, tying the funding cutoff to it forces the president to either accept the loss of funding for the operation or accept the political cost of the broader appropriations fight, giving Congress a lever over the airstrikes beyond simply invoking the Resolution's 60-day clock. (C) The president could respond by going public — using press conferences, televised addresses, or direct appeals to the public to frame the strikes as necessary to protect American forces abroad — building public and media pressure on individual members of Congress so that voting for the funding cutoff carries a political cost, making it harder for Congress to actually follow through on defunding the operation even though it has the formal power to do so.",
      rubric: {
        parts: [
          {
            criterionId: 'A-describe',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes — more than simply names — the constitutional war power at the center of the scenario\'s tension, identifying Congress\'s Article I power to declare war and connecting it to the president\'s commander-in-chief role and the scenario\'s specific facts (airstrikes ordered without a declaration or authorization, the approaching 60-day deadline). No credit (0/1) for naming "war powers" with no description, or a description with no connection to the scenario.',
            modelResponse:
              "The scenario's tension comes from Congress's Article I, Section 8 power to declare war colliding with the president's Article II role as commander-in-chief: the president ordered airstrikes and kept them running toward the War Powers Resolution's 60-day deadline without Congress ever declaring war or authorizing the operation, raising the constitutional question of how far commander-in-chief authority extends without the formal declaration or authorization only Congress can give.",
          },
          {
            criterionId: 'B-explain-check',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, using scenario-specific detail, HOW Congress\'s power of the purse could check the president here — attaching a funding cutoff for the airstrikes to the must-pass appropriations bill, leveraging the bill\'s necessity to force a choice on the president. No credit (0/1) for a generic definition of the power of the purse with no tie to the scenario\'s appropriations bill or funding cutoff.',
            modelResponse:
              "Because federal funds cannot be spent without a congressional appropriation, Congress can attach a provision cutting off funding for the airstrikes to the must-pass appropriations bill; since that bill has to pass to keep the government funded, the funding cutoff forces the president to choose between accepting the loss of funding for the operation or accepting the political fallout of a larger appropriations fight — a lever over the airstrikes beyond simply invoking the Resolution's 60-day clock.",
          },
          {
            criterionId: 'C-explain-response',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains an INFORMAL presidential power (not a formal Article II power like the veto or commander-in-chief authority) and how it could be used to respond to the scenario\'s funding-cutoff threat, tied to the scenario\'s specific facts. No credit (0/1) for describing a formal power instead of an informal one, or for an explanation not grounded in the scenario.',
            modelResponse:
              "The president could go public — using press conferences, televised addresses, or direct appeals to the public to frame the strikes as necessary to protect American forces abroad — building public and media pressure on individual members of Congress so that voting for the funding cutoff carries a political cost, making Congress less likely to actually follow through on defunding the operation even though it holds the formal power to do so.",
          },
        ],
      },
      hints: [
        'Each part is its own answer — don\'t blend (A), (B), and (C) into one paragraph.',
        '"Describe" wants what the power IS plus the scenario detail that shows it; "explain" always wants cause-and-effect tied to the scenario, not a textbook definition.',
        'Part (C) wants an INFORMAL power (going public, bargaining) — not one of the president\'s formal Article II powers.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Concept Application is 3 points, one per part, each graded independently — a short non-partisan scenario, no document, no thesis.',
        '"Describe" (part A) wants the power plus the scenario detail that shows it; "explain" (parts B/C) always wants cause-and-effect tied to the scenario\'s specific facts, not a general definition.',
        'Congress\'s power of the purse lets it attach conditions (like a funding cutoff) to must-pass legislation, giving it leverage over presidential actions beyond formal war-powers mechanisms alone.',
        'Part (C) deliberately asks for an INFORMAL presidential power (going public, bargaining, executive orders/agreements) — a formal Article II power earns no credit there.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-FRQ-CA',
    cedTitle: 'Unit 2 FRQ Practice — Concept Application',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Concept Application free-response task wording and 3-point rubric (1 point per lettered part).',
      },
    ],
  },
};
