/**
 * AP US Government & Politics — CED Unit 4.5: Measuring Public Opinion.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.public-opinion-measurement.v1`. Covers scientific
 * polling methodology (random sampling, sample size and margin of error,
 * the ~1/sqrt(n) intuition, question wording/order effects, weighting),
 * poll types (benchmark, tracking, entrance/exit, push polls), and why
 * polls miss (nonresponse, likely-voter screens).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_PUBLIC_OPINION_MEASUREMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.public-opinion-measurement.v1',
  course: 'AP US Government & Politics',
  cedUnit: 4,
  cedTopic: '4.5',
  cedTitle: 'Measuring Public Opinion',
  planId: 'evelyn.ap.apgov.public-opinion-measurement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.public-opinion-measurement.v1' }],
  theory: [
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'definition',
      title: 'random sampling',
      content:
        'A sampling method giving every member of the target population a known, nonzero chance of selection. Randomness of selection — not raw sample size — is what makes a sample REPRESENTATIVE of the whole population. A large sample drawn from a non-random source (e.g. a self-selected or easy-to-reach group) can still be badly biased.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'definition',
      title: 'margin of error',
      content:
        'The range within which a poll\'s reported result is expected to fall relative to the true population value. Margin of error shrinks roughly with the SQUARE ROOT of sample size (n), not with n itself: doubling the sample only shrinks margin of error by a factor of about 1/sqrt(2) (~0.71), and cutting margin of error in half requires roughly QUADRUPLING the sample.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'concept',
      title: 'question wording and order effects',
      content:
        'How a question is phrased, and the order questions appear in, can shift results even when the underlying opinion hasn\'t changed. Loaded or leading language can push respondents toward or away from an answer; asking one question can prime a respondent\'s thinking on a later question (an order effect). Legitimate pollsters test and neutralize wording carefully for this reason.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'concept',
      title: 'weighting',
      content:
        'After collecting raw responses, pollsters adjust (weight) the results so the sample\'s demographic makeup (age, gender, race, region, education, etc.) matches known population benchmarks, typically from the Census — correcting for a sample that ends up demographically skewed relative to the population it is meant to represent.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'concept',
      title: 'poll types: benchmark, tracking, entrance/exit',
      content:
        'BENCHMARK POLL: an initial poll early in a campaign, before major advertising or events, establishing a baseline reading. TRACKING POLL: repeated at frequent, regular intervals (often daily) so a rolling sample captures short-term MOVEMENT in opinion, not just a single snapshot. ENTRANCE/EXIT POLLS: entrance polls survey voters as they arrive to vote (used especially in caucuses); exit polls survey voters immediately after they leave the polling place — both used to project outcomes and explain voter demographics and motivations (WHY people voted as they did, not merely THAT they voted).',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'definition',
      title: 'push poll',
      content:
        'A political ad disguised as a survey call — it asks leading, often false or unverifiable, negative questions about a candidate not to measure opinion, but to PLANT a negative impression under the guise of legitimate polling. A push poll is not a scientific poll at all; it is a persuasion tactic.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'concept',
      title: 'why polls miss: nonresponse',
      content:
        'Even a properly random initial sample can end up biased if certain kinds of people are systematically less likely to respond (answer the phone, complete the survey) than others, skewing the pool of ACTUAL respondents away from the population even when the original invitation list was random.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'concept',
      title: 'why polls miss: likely-voter screens',
      content:
        'Pre-election polls often report results only among respondents a pollster classifies as "likely voters," using screening questions (past voting history, stated intent, enthusiasm). If the screen misjudges who will actually turn out, the poll can accurately measure the opinions of the WRONG subset of people, producing a result that misses the actual electorate.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'event',
      title: '1936 Literary Digest vs. Gallup — sample size is not the same as representativeness',
      content:
        'In 1936, Literary Digest mailed ten million straw-poll postcards, received 2.4 million responses, and confidently (and wrongly) predicted Alf Landon would beat Franklin Roosevelt — Roosevelt won in a landslide. The mailing lists skewed toward car and telephone owners, wealthier than the country as a whole during the Depression: a non-random, unrepresentative source. George Gallup, using a properly random sample of only about 50,000 people, correctly predicted the winner. The lesson: randomness of selection, not raw sample size, determines accuracy.',
    },
    {
      loId: 'apgov.public-opinion-measurement',
      kind: 'trap',
      title: 'a bigger sample does not automatically beat a representative one',
      content:
        'Don\'t assume a much larger sample is always more accurate regardless of how it was selected. A large but non-randomly-selected sample (e.g. a self-selected online poll) systematically excludes anyone who doesn\'t opt in — the same underlying flaw that made the 1936 Literary Digest poll badly wrong despite its 2.4 million respondents. A smaller, properly random sample reliably outperforms a larger, non-random one.',
    },
  ],
  methods: [
    {
      title: 'Apply the ~1/sqrt(n) margin-of-error relationship',
      when_to_use:
        'Use this whenever a prompt asks how changing a poll\'s sample size affects its margin of error.',
      steps: [
        'STATE THE RELATIONSHIP: margin of error is proportional to 1/sqrt(n), not 1/n.',
        'FOR A GIVEN CHANGE IN n, COMPUTE THE FACTOR: doubling n shrinks margin of error by ~1/sqrt(2) (~0.71); quadrupling n is needed to cut margin of error in half.',
        'DO NOT ASSUME A PROPORTIONAL RELATIONSHIP — doubling the sample does NOT halve the margin of error.',
        'SEPARATELY CHECK WHETHER THE SAMPLE IS RANDOM. A larger n only helps if the underlying sample is randomly selected; a bigger non-random sample does not fix bias.',
      ],
      example: {
        problem: 'A poll of 400 respondents has a margin of error of about ±5 points. About how large would the sample need to grow to cut that margin of error in half?',
        solution:
          'Because margin of error scales with 1/sqrt(n), cutting it in half requires roughly QUADRUPLING n — from 400 to about 1,600 respondents, not simply doubling to 800.',
      },
      relatedLoIds: ['apgov.public-opinion-measurement'],
    },
    {
      title: 'Classify a described poll by type',
      when_to_use:
        'Use this whenever a prompt describes a specific poll (timing, sampling, question content) and asks what type it is.',
      steps: [
        'CHECK FOR LEADING/NEGATIVE, UNVERIFIED CLAIMS ABOUT A CANDIDATE disguised as a survey question — that is a PUSH POLL, not genuine research.',
        'CHECK FOR REPEATED, FREQUENT SAMPLING OVER TIME (often daily) — that is a TRACKING POLL, meant to capture movement.',
        'CHECK FOR TIMING AT/IMMEDIATELY AFTER VOTING — that is an ENTRANCE or EXIT POLL, used to explain actual vote choice and turnout.',
        'CHECK FOR AN EARLY, PRE-CAMPAIGN BASELINE READING — that is a BENCHMARK POLL.',
        'IF NONE OF THE ABOVE, DESCRIBE THE METHODOLOGY DIRECTLY (random sampling, margin of error, weighting) rather than forcing it into a named type.',
      ],
      relatedLoIds: ['apgov.public-opinion-measurement'],
    },
  ],
  pointers: [
    { content: 'Margin of error scales with the SQUARE ROOT of sample size — doubling n shrinks MoE by only ~0.71x; quadrupling n is needed to halve it.', kind: 'trap' },
    { content: 'A bigger sample is not automatically more accurate: randomness of selection, not raw size, makes a sample representative (1936 Literary Digest vs. Gallup).', kind: 'trap' },
    { content: 'A push poll is a persuasion tactic disguised as a survey, not genuine polling research — look for leading, unverified negative claims about a candidate.', kind: 'tip' },
    { content: 'Tracking polls repeat the SAME poll at frequent intervals to capture movement; benchmark polls are a single early baseline.', kind: 'tip' },
    { content: 'Exit/entrance polls capture actual voting behavior and stated reasons — information a pre-election poll (which only asks about intent) cannot provide.', kind: 'tip' },
    { content: 'Nonresponse and likely-voter screens can bias even a properly randomly SELECTED poll — representativeness of the invitation list is not the whole story.', kind: 'tip' },
  ],
};
