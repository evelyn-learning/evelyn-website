/**
 * AP US Government & Politics — Unit 4 FRQ Practice: Concept Application
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
 * Scenario draws on the Unit-4 polling-methodology content plan
 * (ap-apgov-u4-polling.ts): a Senate candidate facing two conflicting polls
 * in the same week raises the random-sampling-vs-self-selection
 * methodological contrast for part (A), the margin-of-error interpretation
 * for part (B), and tracking-poll use for campaign resource allocation for
 * part (C).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U4_FRQ_CONCEPT_APPLICATION: LessonPlan = {
  id: 'evelyn.ap.apgov.u4-frq-concept-application.v1',
  title: 'Unit 4 FRQ Practice — Concept Application',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u4-frq-concept-application',
      description:
        'Answer a complete AP Gov Concept Application free-response question — a short non-partisan scenario about a Senate candidate facing two conflicting polls in the same week — describing a methodological reason the polls could differ, explaining how margin of error affects what the live-caller poll can tell the campaign, and explaining how the campaign could use tracking polls to decide resource allocation — scored against the authentic AP Gov 3-point Concept Application rubric (1 point per part).',
      standard: 'AP-APGOV-4-FRQ-CA',
    },
  ],
  prerequisites: ['apgov.public-opinion-measurement'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the shortest AP Gov FRQ format concrete for a conflicting-polls scenario, and correct the instinct to treat every poll number as equally trustworthy.',
      script:
        "Of the four free-response questions on the AP Gov exam, Concept Application is the shortest — just 3 points — but it trips up more students than its length suggests. You'll get a short political scenario, usually invented and deliberately non-partisan, and three parts: describe a concept the scenario illustrates, explain how that concept affects something in the scenario, and explain how a different course principle could respond to what's happening. Unit 4's version of this trap shows up around polling: a candidate sees two polls in the same week that disagree, and the instinct is to average them or just believe whichever number is friendlier — missing that the two polls were built completely differently, and that even the more trustworthy one comes with a margin of error that changes what it can actually tell you. Today's scenario is a Senate candidate staring at a live-caller poll and an online opt-in poll that don't agree — and you'll answer all three parts the way an AP reader would score them, part by part.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ca-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Concept Application FRQ asks for and how the 3-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get a short, invented, non-partisan political scenario (never a real current event) and three parts, each worth 1 point and graded independently. There is no thesis, no contextualization, no document — this format tests whether you can APPLY course concepts to a new, concrete situation, not whether you can recite a definition in the abstract.',
        'PART (A) — DESCRIBE (0-1 point): "describe" is a lower bar than "explain" but still higher than "name." Full credit requires stating the methodological difference between the two polls — not just asserting "one poll is better" with no methodological reasoning.',
        'PART (B) — EXPLAIN THE STANDARD IN CONTEXT (0-1 point): "explain" always means applying a rule to specific facts, not restating the rule alone. Full credit requires explaining that a margin of error is a RANGE around the reported result, applied to the scenario\'s specific numbers (a +2 lead with a ±3 MoE), not a textbook definition of margin of error with no application to this poll\'s numbers.',
        'PART (C) — EXPLAIN A CAMPAIGN USE (0-1 point): full credit requires explaining how repeating a poll at frequent intervals (a tracking poll) lets a campaign observe MOVEMENT in support over time and use that movement to decide where to direct money, staff, or advertising — not a bare assertion that "the campaign should poll more."',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: treating both polls as equally credible with no methodological reasoning, or citing a margin of error without applying it to the scenario\'s specific reported lead.',
        'Total = 3 points, one per part, each graded independently — missing part (a) does not cost you credit on (b) or (c). This is the authentic AP Gov Concept Application scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-concept-application-frq',
      kind: 'try_yourself',
      problem:
        "Read the scenario and answer parts (A), (B), and (C).\n\nA Senate candidate's campaign sees two polls released the same week. The first is a live-caller poll of 1,200 registered voters, conducted by randomly dialing phone numbers, showing the candidate ahead by 2 points with a margin of error of plus-or-minus 3 points. The second is an online opt-in poll of 400 respondents, in which anyone could click a link on a news website to participate, showing the candidate trailing by 6 points. Campaign staff are unsure which number to trust and how to use either one to plan the campaign's final month.\n\n(A) Describe one methodological reason the two polls could differ.\n(B) In the context of the scenario, explain how margin of error affects what the first poll can tell the campaign.\n(C) Explain how the campaign could use tracking polls to decide how to allocate its remaining resources.",
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The two polls differ methodologically in how respondents were selected: the live-caller poll randomly dialed phone numbers, giving every registered voter with a phone a known, nonzero chance of being included, which makes it a properly random and therefore more representative sample; the online opt-in poll instead let anyone who happened to visit the website and choose to click participate, a self-selected convenience sample that can skew toward whichever voters are more motivated, engaged, or online at that moment, regardless of the actual electorate's makeup. That methodological gap alone — random selection versus self-selection — can produce very different topline numbers even if underlying opinion hasn't shifted at all. (B) The first poll's margin of error of plus-or-minus 3 points, applied to its reported 2-point lead, means the true state of the race could plausibly range from the candidate trailing by 1 point to leading by 5 points. In other words, the poll does not establish a statistically meaningful lead — the campaign should treat the race as a close, competitive contest rather than banking on a comfortable 2-point advantage, since a trailing result is well within the poll's own margin of error. (C) The campaign could commission a tracking poll — the same properly random survey repeated at frequent, regular intervals — to see whether its position is improving, worsening, or holding steady over the campaign's final weeks. If tracking data shows the race tightening in a particular region or among a particular demographic, the campaign can redirect advertising spending, canvassing staff, or candidate travel toward shoring up that support; if tracking shows a lead holding safely outside the margin of error, the campaign can instead redirect those resources to closer races or other priorities.",
      rubric: {
        parts: [
          {
            criterionId: 'A-describe',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes a real methodological reason the polls could differ — the live-caller poll\'s random sampling of registered voters versus the online poll\'s self-selected, opt-in convenience sample. No credit (0/1) for asserting one poll is simply "more accurate" or "biased" with no methodological reasoning tied to sampling method.',
            modelResponse:
              "The live-caller poll randomly dialed phone numbers, giving every registered voter a known, nonzero chance of being included, making it a properly random and more representative sample; the online opt-in poll instead let anyone who chose to click a website link participate, a self-selected convenience sample that can skew toward more motivated or engaged respondents regardless of the actual electorate's makeup.",
          },
          {
            criterionId: 'B-explain-moe',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains that the margin of error creates a range around the reported result and applies it to the scenario\'s specific numbers (a +2 lead with a ±3 MoE spans roughly -1 to +5), concluding the poll does not establish a clear, statistically meaningful lead. No credit (0/1) for defining margin of error in the abstract with no application to the scenario\'s specific lead and MoE.',
            modelResponse:
              "A margin of error of plus-or-minus 3 points applied to the reported 2-point lead means the true race could plausibly range from the candidate trailing by 1 point to leading by 5 points — the poll does not establish a statistically meaningful lead, so the campaign should treat the race as close and competitive rather than banking on a safe 2-point advantage.",
          },
          {
            criterionId: 'C-explain-tracking',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains that a tracking poll — the same random survey repeated at frequent intervals — lets the campaign observe movement in support over time, and connects that movement to a resource-allocation decision (where to spend money, deploy staff, or advertise). No credit (0/1) for a bare assertion that the campaign "should poll more" with no connection to tracking or to resource allocation.',
            modelResponse:
              "By commissioning a tracking poll — the same properly random survey repeated at frequent, regular intervals — the campaign can observe whether its support is growing, shrinking, or holding steady over time. If tracking shows the race tightening in a particular region or demographic, the campaign can redirect advertising, canvassing staff, or candidate travel there; if tracking shows a safe lead holding outside the margin of error, it can redirect those same resources elsewhere.",
          },
        ],
      },
      hints: [
        'Each part is its own answer — don\'t blend (A), (B), and (C) into one paragraph.',
        'Part (A) wants a real methodological reason (random sampling vs. self-selection), not just "one poll must be wrong."',
        'Part (B) wants the margin of error APPLIED to this poll\'s specific +2 lead and ±3 range, not a textbook definition.',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Concept Application is 3 points, one per part, each graded independently — a short non-partisan scenario, no document, no thesis.',
        'Random sampling (every voter has a known, nonzero chance of selection) versus a self-selected, opt-in convenience sample is a real methodological reason two polls on the same race can disagree.',
        'A margin of error creates a RANGE around the reported result — a +2 lead with a ±3 MoE spans roughly -1 to +5, meaning the poll does not establish a clear, statistically meaningful lead.',
        'A tracking poll repeats the same random survey at frequent intervals to capture movement over time, which a campaign can use to decide where to direct money, staff, and advertising.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-FRQ-CA',
    cedTitle: 'Unit 4 FRQ Practice — Concept Application',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Concept Application free-response task wording and 3-point rubric (1 point per lettered part).',
      },
    ],
  },
};
