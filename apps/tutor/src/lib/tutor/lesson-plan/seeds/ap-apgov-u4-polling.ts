/**
 * AP US Government & Politics — CED Unit 4.5: Measuring Public Opinion.
 *
 * Unit-4 content plan (follows the Unit-1/2/3 calibration template — see
 * ap-apgov-u1-federalism.ts for the shared Passage/rubric infra this plan
 * reuses). Second stop in Unit 4's public-opinion walk: picks up directly
 * from the socialization lesson's account of how opinions FORM, and asks
 * how those opinions get scientifically MEASURED.
 *
 * Covers scientific polling methodology (random sampling, sample size and
 * margin of error, the ~1/sqrt(n) intuition, question wording and order
 * effects, weighting), poll types (benchmark, tracking, entrance/exit polls,
 * and push polls as a manipulation tactic rather than genuine research),
 * and why polls miss (nonresponse, likely-voter screens).
 *
 * NO WIRED PASSAGE — this lesson's worked example is a self-contained
 * numeric illustration of the sample-size/margin-of-error relationship,
 * not a document or data-table stimulus; no Task-1..11 passage models
 * survey-methodology figures, so none is cited here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U4_POLLING: LessonPlan = {
  id: 'evelyn.ap.apgov.public-opinion-measurement.v1',
  title: 'U4.5 Measuring Public Opinion',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.public-opinion-measurement',
      description:
        'Explain the methodology of scientific public-opinion polling — random sampling, sample size and margin of error, question wording and order effects, and weighting — describe the major poll types (benchmark, tracking, entrance/exit, and push polls), and explain why polls can miss the true population value (nonresponse, likely-voter screens).',
      standard: 'AP-APGOV-4.5',
    },
  ],
  prerequisites: ['apgov.socialization-opinion'],
  followUps: ['apgov.ideology-policy'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see a poll\'s topline number as the visible tip of a much larger set of methodological choices, and to be skeptical of any claim that a bigger sample is automatically a better one.',
      script:
        "Last lesson covered how people FORM political opinions. Today: how do we find out, at scale, what tens of millions of people actually think, by asking only a few hundred or a couple thousand of them? Here's a famous cautionary tale. In 1936, a magazine called Literary Digest mailed out ten million straw-poll postcards and got 2.4 million back — a massive sample by any standard — and confidently predicted Alf Landon would beat Franklin Roosevelt for president. Roosevelt won in a landslide. A competing pollster, George Gallup, correctly predicted the actual winner using a sample of only 50,000 people. The size of Literary Digest's sample wasn't the problem — WHO ended up in it was: mailing lists skewed toward car and telephone owners, wealthier than the country as a whole during the Depression. Today we cover the actual rules a legitimate poll has to follow — and a few sneaky ways a poll can be designed to mislead instead of measure.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-polling-methodology-and-types',
      kind: 'concept',
      goal: 'Explain random sampling, sample size and margin of error (including the 1/sqrt(n) intuition), question wording/order effects, weighting, the major poll types, and why polls miss (nonresponse, likely-voter screens).',
      keyIdeas: [
        'RANDOM SAMPLING IS THE FOUNDATION: a scientific poll selects respondents so that every member of the target population has a known, nonzero chance of being chosen — this is what makes the sample REPRESENTATIVE of the whole population, not the sample\'s raw size. A large sample built from a non-random source (e.g. an easy-to-reach or self-selected group) can still be badly biased, exactly as the 1936 Literary Digest poll was despite its 2.4 million respondents.',
        'SAMPLE SIZE AND MARGIN OF ERROR — THE 1/sqrt(n) INTUITION: margin of error (MoE) shrinks as sample size (n) grows, but NOT proportionally — it shrinks roughly with the square root of n. Practically: to cut the margin of error in HALF, a poll needs roughly FOUR TIMES the sample size, not twice. This is why polls of a few hundred to a couple thousand respondents are standard: past a certain point, a much bigger sample buys only a small further reduction in margin of error, at a much higher cost — while a non-random sample of any size does not fix bias at all.',
        'QUESTION WORDING AND ORDER EFFECTS: how a question is phrased, and the order questions appear in, can shift results even when the underlying opinion hasn\'t changed. Loaded or leading language ("Do you support the reckless plan to..." vs. a neutral description of the same plan) can push respondents toward or away from an answer; asking one question can also prime respondents\' thinking on a later question (order effects). Legitimate pollsters test and neutralize wording carefully for exactly this reason.',
        'WEIGHTING: after collecting raw responses, pollsters adjust (weight) the results so the sample\'s demographic makeup (age, gender, race, region, education, etc.) matches known population benchmarks, typically from the Census. Weighting corrects for a sample that, by chance or nonresponse, ends up demographically skewed relative to the population it is meant to represent.',
        'POLL TYPES — BENCHMARK POLLS: an initial poll taken early in a campaign, before major advertising or events, to establish a baseline reading of where a candidate or issue stands.',
        'POLL TYPES — TRACKING POLLS: polls repeated at frequent, regular intervals (often daily) during a campaign, so that a rolling sample of results captures short-term MOVEMENT in opinion over time rather than a single snapshot.',
        'POLL TYPES — ENTRANCE AND EXIT POLLS: entrance polls survey voters as they arrive to vote (used especially in caucuses); exit polls survey voters immediately after they leave the polling place. Both are used to project outcomes, explain voter demographics and motivations, and analyze WHY people voted as they did — not merely THAT they voted.',
        'POLL TYPES — PUSH POLLS ARE MANIPULATION, NOT RESEARCH: a "push poll" is a political ad disguised as a survey call — it asks leading, often false or unverifiable, negative questions about a candidate ("Would it change your opinion of Candidate X to know they were investigated for ___?") not to measure opinion, but to PLANT a negative impression under the guise of legitimate polling. A push poll is not a scientific poll at all; it is a persuasion tactic.',
        'WHY POLLS MISS — NONRESPONSE: even a properly random initial sample can end up biased if certain kinds of people are systematically less likely to respond (answer the phone, complete the survey) than others, skewing the pool of ACTUAL respondents away from the population even when the original invitation list was random.',
        'WHY POLLS MISS — LIKELY-VOTER SCREENS: pre-election polls often report results only among respondents a pollster classifies as "likely voters," using screening questions (past voting history, stated intent, enthusiasm). If the screen misjudges who will actually turn out — a persistent challenge in a low-turnout or unusual election — the poll can accurately measure the opinions of the WRONG subset of people, producing a final result that misses the actual electorate.',
      ],
      vocabulary: [
        {
          term: 'random sampling',
          definition:
            'a sampling method giving every member of the target population a known, nonzero chance of selection — what makes a sample representative, independent of its raw size.',
        },
        {
          term: 'margin of error',
          definition:
            'the range within which a poll\'s reported result is expected to fall relative to the true population value; shrinks roughly with the square root of sample size, not sample size itself.',
        },
        {
          term: 'weighting',
          definition:
            "adjusting a poll's raw results so the sample's demographic makeup matches known population benchmarks (e.g. Census data), correcting for demographic skew in who actually responded.",
        },
        {
          term: 'push poll',
          definition:
            'a political ad disguised as a survey, using leading or unverified negative claims about a candidate to plant an impression rather than to measure genuine opinion; not a scientific poll.',
        },
        {
          term: 'nonresponse',
          definition:
            'bias introduced when certain kinds of people are systematically less likely to respond to a poll than others, skewing the pool of actual respondents even from a randomly selected invitation list.',
        },
        {
          term: 'likely-voter screen',
          definition:
            "a set of screening questions pollsters use to report results only among respondents judged likely to actually vote; misjudging turnout can make a poll accurately measure the wrong subset of people.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sample-size-margin-of-error',
      kind: 'worked_example',
      problem:
        'A pollster runs a properly random national survey with a sample of 400 respondents and reports a margin of error of about +/-5 percentage points. Facing budget pressure, a colleague proposes simply doubling the sample to 800 respondents, expecting that to cut the margin of error roughly in half, to about +/-2.5 points. (a) Using the ~1/sqrt(n) relationship between sample size and margin of error, evaluate whether doubling the sample size will actually cut the margin of error in half. (b) Identify approximately how large the sample would need to grow to actually cut the original +/-5-point margin of error in half. (c) A separate colleague proposes an easier fix: skip random sampling and instead poll 50,000 people who voluntarily click a link on the pollster\'s website. Explain why this second proposal, despite its much larger sample, would not necessarily produce a MORE accurate poll than the original 400-person random sample.',
      steps: [
        'STATE THE RELATIONSHIP. Margin of error shrinks roughly with the SQUARE ROOT of sample size (n), not with n itself. So MoE is proportional to 1/sqrt(n) — doubling n does not halve MoE; it only shrinks MoE by a factor of 1/sqrt(2), about 0.71.',
        'EVALUATE THE DOUBLING CLAIM (PART A). Going from n=400 to n=800 doubles the sample, but only shrinks the margin of error to roughly 5 x 0.71 ≈ 3.5 points, NOT down to 2.5 points. The colleague\'s expectation is wrong: doubling the sample does much less than the colleague assumes.',
        'FIND THE SAMPLE SIZE THAT ACTUALLY HALVES MoE (PART B). Because MoE scales with 1/sqrt(n), CUTTING MoE in half requires roughly QUADRUPLING n. Starting from n=400, the sample would need to grow to roughly 4 x 400 = 1,600 respondents to bring the margin of error down to about +/-2.5 points.',
        'EVALUATE THE SELF-SELECTED SAMPLE (PART C). A large but non-randomly-selected sample — people who chose to click a link — is not automatically more accurate just because it is bigger. Random sampling, not sample size, is what makes a sample representative of the whole population; a self-selected online sample systematically excludes anyone who doesn\'t visit the site or chooses not to click, the same underlying flaw (a non-random source, not sample size) that made the 1936 Literary Digest poll\'s 2.4-million-respondent sample badly wrong.',
        'LINK TO THE COURSE THESIS. Sample size and sample representativeness are two SEPARATE properties of a poll. Growing n reduces margin of error only slowly (by the square root), and even a very large n cannot fix a sample that was never randomly selected in the first place — which is exactly the reasoning behind this lesson\'s "bigger sample always beats a representative sample" misconception check.',
      ],
      answer:
        'Doubling the sample from 400 to 800 would shrink the margin of error only to about +/-3.5 points (a factor of 1/sqrt(2) ≈ 0.71), not to +/-2.5 points, because margin of error scales with the square root of sample size, not sample size itself. Actually cutting the original +/-5-point margin of error in half requires roughly QUADRUPLING the sample, to about 1,600 respondents. The larger, self-selected 50,000-person online sample would not necessarily be more accurate than the smaller random sample, because it is randomness of selection — not raw sample size — that makes a sample representative; a large but non-random sample can still be badly biased, just as the 1936 Literary Digest poll\'s 2.4 million respondents were skewed toward wealthier, more accessible households and wrongly predicted the 1936 election\'s outcome.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. Two weeks before an election, Campaign A commissions a phone survey that asks: "If you knew that Candidate Smith had been sued multiple times for fraud, would that change your vote?" Separately, a news organization runs the same properly randomly sampled poll of registered voters every single day for the final month of the campaign, tracking how support for each candidate shifts. On election night, a network surveys voters as they leave polling places to ask how and why they voted. (a) Identify the type of poll Campaign A is conducting, and explain why it does not function as genuine public-opinion research. (b) Identify the type of poll the news organization is running, and explain what distinguishes it from a single one-time poll. (c) Identify the type of poll the network conducts on election night, and explain what kind of information it can provide that a pre-election poll cannot.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies Campaign A\'s survey as a PUSH POLL and explains that it uses a leading, unverified negative claim to plant an impression of the candidate rather than to genuinely measure opinion. No credit for identifying a different poll type or omitting the manipulation/leading-question reasoning.',
            modelResponse:
              "Campaign A's survey is a PUSH POLL, not genuine research. Its question is designed to plant a negative impression of Candidate Smith through a leading, unverified accusation, rather than to neutrally measure what voters actually think — the goal is persuasion disguised as polling, not accurate measurement of opinion.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies the news organization\'s poll as a TRACKING POLL and explains that repeating the same poll at frequent, regular intervals captures movement/change in opinion over time, unlike a single snapshot poll. No credit for identifying a different poll type or omitting the repeated-measurement/movement-over-time point.',
            modelResponse:
              "The news organization is running a TRACKING POLL. By repeating the same randomly sampled survey daily throughout the final month of the campaign, it captures how support shifts over time, rather than providing only a single snapshot the way a one-time poll would.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies the network\'s survey as an EXIT POLL and explains that it can capture voters\' actual voting behavior and stated reasons for voting a particular way immediately after they vote, information a pre-election poll (which asks about intended, not actual, behavior) cannot provide. No credit for identifying a different poll type or omitting the actual-vote/reasons distinction.',
            modelResponse:
              "The network is conducting an EXIT POLL, surveying voters immediately after they leave the polling place. Unlike a pre-election poll, which can only ask about intended future behavior, an exit poll captures how people actually just voted and their stated reasons why — information only available after the vote itself has been cast.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-bigger-sample-beats-representative',
      kind: 'misconception_check',
      question:
        'True or false: a poll with a much larger sample size is always more accurate than a poll with a smaller sample, regardless of how each sample was selected.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming sample SIZE alone determines poll accuracy, without considering whether the sample was randomly selected — treating "more respondents" as automatically synonymous with "more representative."',
          correctsTo:
            "FALSE. A poll's accuracy depends on whether its sample is RANDOMLY and therefore REPRESENTATIVELY selected, not simply on how many people responded. The clearest historical example: in 1936, Literary Digest magazine mailed ten million straw-poll postcards and received 2.4 million responses — a huge sample — and confidently predicted Alf Landon would defeat Franklin Roosevelt. Roosevelt won in a landslide. The poll failed not because the sample was too small, but because it was drawn from telephone and car-registration lists that skewed toward wealthier households during the Depression — a non-random, unrepresentative source. George Gallup, using a properly random sample of only about 50,000 people, correctly predicted the actual winner. A large sample reduces margin of error only slowly (roughly with the square root of sample size) and does nothing to fix bias from a non-random selection method — a smaller, properly random sample will reliably outperform a larger, non-random one.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Random sampling — not raw sample size — is what makes a poll representative; the 1936 Literary Digest poll (2.4 million respondents, wrong prediction) versus Gallup\'s ~50,000-person random sample (correct prediction) is the classic illustration.',
        'Margin of error shrinks roughly with the square root of sample size: doubling the sample only shrinks MoE by a factor of about 0.71, and cutting MoE in half requires roughly QUADRUPLING the sample.',
        'Question wording and order can shift results independent of any real opinion change; weighting adjusts raw results to match known population demographics (e.g. Census benchmarks).',
        'Poll types: benchmark (early baseline), tracking (repeated at frequent intervals to capture movement), entrance/exit (surveyed at/after voting, to explain vote choice and turnout). Push polls are NOT genuine research — they use leading negative claims to manipulate impressions, disguised as a survey.',
        'Polls can miss the true population value through nonresponse (systematic differences in who actually responds) and likely-voter screens that misjudge who will actually turn out.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.5',
    cedTitle: 'Measuring Public Opinion',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
