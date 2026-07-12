/**
 * AP US Government & Politics — Unit 5 FRQ Practice: Concept Application
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
 * Scenario draws on the Unit-5 interest-groups content plan
 * (ap-apgov-u5-interest-groups.ts): an environmental interest group with a
 * limited budget must choose among lobbying an agency during rulemaking,
 * filing suit challenging that rulemaking, and a grassroots social-media
 * mobilization drive — raising the lobbying-the-bureaucracy advantage for
 * part (A), the litigation-as-alternate-channel reasoning for part (B), and
 * the free-rider problem for part (C), all drawn from that plan's lobbying,
 * litigation, and free-rider material.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_FRQ_CONCEPT_APPLICATION: LessonPlan = {
  id: 'evelyn.ap.apgov.u5-frq-concept-application.v1',
  title: 'Unit 5 FRQ Practice — Concept Application',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u5-frq-concept-application',
      description:
        'Answer a complete AP Gov Concept Application free-response question — a short non-partisan scenario about a budget-limited environmental interest group choosing among lobbying an agency during rulemaking, filing suit, and a grassroots social-media drive — describing an advantage of lobbying the bureaucracy during rulemaking, explaining why litigation might succeed where lobbying fails, and explaining how the free-rider problem constrains the grassroots option — scored against the authentic AP Gov 3-point Concept Application rubric (1 point per part).',
      standard: 'AP-APGOV-5-FRQ-CA',
    },
  ],
  prerequisites: ['apgov.interest-groups'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the shortest AP Gov FRQ format concrete for an interest group choosing among lobbying, litigation, and grassroots mobilization, and correct the instinct to treat the three strategies as interchangeable.',
      script:
        "Of the four free-response questions on the AP Gov exam, Concept Application is the shortest — just 3 points — but it trips up more students than its length suggests. You'll get a short political scenario, usually invented and deliberately non-partisan, and three parts: describe a concept the scenario illustrates, explain how that concept affects something in the scenario, and explain how a different course principle could respond to what's happening. Unit 5's version of this trap shows up around interest groups: a small group with limited money has to pick ONE strategy — lobbying the bureaucracy, suing in court, or mobilizing grassroots supporters — and the instinct is to treat all three as roughly equivalent ways to 'apply pressure,' missing that each one works through a completely different mechanism, with its own advantages and its own structural limits. Today's scenario is an environmental interest group facing exactly that choice — and you'll answer all three parts the way an AP reader would score them, part by part.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ca-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Concept Application FRQ asks for and how the 3-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get a short, invented, non-partisan political scenario (never a real current event) and three parts, each worth 1 point and graded independently. There is no thesis, no contextualization, no document — this format tests whether you can APPLY course concepts to a new, concrete situation, not whether you can recite a definition in the abstract.',
        'PART (A) — DESCRIBE (0-1 point): "describe" is a lower bar than "explain" but still higher than "name." Full credit requires stating a real advantage of lobbying an agency specifically DURING its rulemaking process — that lobbying can supply the agency with technical information or arguments while the rule is still being drafted — not just asserting "lobbying helps" with no mechanism.',
        'PART (B) — EXPLAIN IN CONTEXT (0-1 point): "explain" always means applying a rule to specific facts, not restating the rule alone. Full credit requires explaining why litigation, decided by an independent court rather than the same agency officials the lobbying effort is trying to persuade, can succeed on procedural or legal grounds even when lobbying that agency has failed to change its substantive position.',
        'PART (C) — EXPLAIN A CONSTRAINT (0-1 point): full credit requires explaining that because the benefits of a successful grassroots-driven policy win (e.g., stronger environmental standards) are shared by the public generally, individuals can enjoy those benefits without contributing time or money to the mobilization effort — the free-rider problem — which undermines the group\'s ability to sustain grassroots participation and funding.',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: describing all three strategies (lobbying, litigation, grassroots mobilization) as interchangeable ways to "pressure" government, instead of explaining the distinct mechanism and constraint that makes each one work (or fail) the way it does.',
        'Total = 3 points, one per part, each graded independently — missing part (a) does not cost you credit on (b) or (c). This is the authentic AP Gov Concept Application scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-concept-application-frq',
      kind: 'try_yourself',
      problem:
        "Read the scenario and answer parts (A), (B), and (C).\n\nA small environmental interest group has only a modest annual budget and must decide how to respond to a federal agency's proposed rule that would weaken emissions standards for a class of industrial facilities. The group's leadership is considering three options: hiring a professional lobbying firm to work directly with the agency during the rule's public comment and drafting process; filing a lawsuit challenging the agency's rulemaking procedure in federal court; or launching a grassroots social-media campaign to mobilize ordinary citizens to pressure the agency and their members of Congress. The group can only afford to pursue one option seriously this year.\n\n(A) Describe one advantage of lobbying the bureaucracy during rulemaking.\n(B) In the context of the scenario, explain why litigation might succeed where lobbying fails.\n(C) Explain how the free-rider problem constrains the grassroots option.",
      responseFormat: 'frq',
      expectedAnswer:
        "(A) One advantage of lobbying the bureaucracy during rulemaking is that the group can supply the agency with specialized technical information and analysis that agency staff need but do not have in-house — since the notice-and-comment rulemaking process allows any interested party to submit information and arguments while the rule is still being drafted, a well-prepared lobbying effort can shape the substance of the final rule directly, rather than trying to challenge it only after it has already taken effect. (B) Litigation might succeed where lobbying fails because a lawsuit is decided by an independent federal court rather than by the same agency officials the group's lobbying effort has already tried and failed to persuade; the group can challenge the rulemaking on procedural or legal grounds — for example, arguing the agency did not properly follow the required notice-and-comment process or acted outside its statutory authority — giving it an independent forum that does not depend on changing the agency's own substantive judgment about how strict the emissions standards should be. (C) A grassroots social-media mobilization campaign, if successful, would produce benefits — such as stronger emissions standards protecting air quality — that are shared by the general public whether or not any particular person participated in or donated to the campaign. Because individuals can enjoy those benefits without contributing their own time or money, many potential supporters will free-ride on the efforts of others rather than get involved themselves, making it difficult for the group to sustain the level of grassroots participation and funding a real mobilization campaign requires.",
      rubric: {
        parts: [
          {
            criterionId: 'A-describe-lobbying',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes a real advantage of lobbying an agency during rulemaking — supplying technical information/arguments during the public comment period that can shape the rule\'s substance before it is finalized. No credit (0/1) for a bare assertion that "lobbying helps" or "lobbying gives influence" with no mechanism tied to the rulemaking process.',
            modelResponse:
              "Lobbying the agency during rulemaking lets the group supply specialized technical information and arguments the agency needs but does not have in-house, while the rule is still being drafted through the notice-and-comment process — shaping the final rule's substance directly rather than trying to overturn it after it already takes effect.",
          },
          {
            criterionId: 'B-explain-litigation',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains that litigation is decided by an independent court rather than the same agency the lobbying effort failed to persuade, and that the group can win on procedural/legal grounds (e.g., improper rulemaking process, exceeding statutory authority) regardless of the agency\'s substantive preference. No credit (0/1) for asserting litigation "works better" with no independent-forum or procedural reasoning.',
            modelResponse:
              "Litigation is decided by an independent federal court, not by the same agency officials the group's lobbying already failed to persuade, so the group can challenge the rulemaking on procedural or legal grounds — such as the agency not properly following the required notice-and-comment process — and potentially force a change regardless of the agency's own substantive judgment about the rule.",
          },
          {
            criterionId: 'C-explain-freerider',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains that a grassroots campaign\'s benefits (stronger environmental standards) are shared by the public regardless of participation, so individuals can free-ride rather than contribute, undermining the campaign\'s ability to sustain participation and funding. No credit (0/1) for a response that does not connect the shared benefit to free-riding.',
            modelResponse:
              "Because a successful grassroots campaign's benefit — stronger emissions standards — would be shared by the public generally regardless of who participated, individuals can enjoy that benefit without contributing time or money to the campaign, so many potential supporters free-ride rather than get involved, making it hard for the group to sustain the participation and funding a real mobilization effort needs.",
          },
        ],
      },
      hints: [
        'Each part is its own answer — don\'t blend (A), (B), and (C) into one paragraph.',
        'Part (A) wants a specific mechanism (technical information during notice-and-comment), not just "lobbying helps."',
        'Part (C) wants the free-rider problem explicitly — shared benefits mean people can enjoy the win without pitching in.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Concept Application is 3 points, one per part, each graded independently — a short non-partisan scenario, no document, no thesis.',
        'Lobbying an agency during rulemaking works by supplying technical information during the notice-and-comment process, shaping the rule before it is finalized.',
        'Litigation offers an independent forum — a court, not the agency itself — and can succeed on procedural/legal grounds even when lobbying has failed to change the agency\'s substantive position.',
        'The free-rider problem: because a grassroots campaign\'s benefits are shared by everyone regardless of participation, individuals can enjoy them without contributing, undermining sustained mobilization and funding.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-FRQ-CA',
    cedTitle: 'Unit 5 FRQ Practice — Concept Application',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Concept Application free-response task wording and 3-point rubric (1 point per lettered part).',
      },
    ],
  },
};
