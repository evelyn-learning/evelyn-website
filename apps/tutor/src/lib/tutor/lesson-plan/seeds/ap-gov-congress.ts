/**
 * AP Gov — Congress: Structure, Powers, Lawmaking.
 *
 * House vs Senate, committees, leadership, the legislative process.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_GOV_CONGRESS: LessonPlan = {
  id: 'evelyn.ap.gov.congress.v1',
  title: 'Congress: Structure and Lawmaking',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'ap-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.congress',
      description: 'Compare the House and Senate, identify key leadership and committee roles, and trace how a bill becomes law.',
      standard: 'AP-GOV-2.A',
    },
  ],
  prerequisites: ['apgov.constitution'],
  followUps: ['apgov.presidency'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two chambers built for different purposes.',
      script: 'The House of Representatives and the Senate look like two halves of one Congress, but they\'re built to play opposite roles. The House is fast, populous, responsive — designed to reflect public passion. The Senate is slow, deliberate, smaller — designed to cool that passion. Madison called the Senate the "saucer that cools the tea". Most lawmaking happens in the friction between the two.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-structure',
      kind: 'concept',
      goal: 'House vs Senate, leadership, committees, lawmaking process.',
      keyIdeas: [
        'HOUSE: 435 members, 2-year terms, by population. Initiates revenue bills (taxes). Speaker is most powerful position. Tighter rules — Rules Committee schedules debate; cloture not needed. Majority wins.',
        'SENATE: 100 members (2 per state), 6-year staggered terms. Confirms presidential appointments, ratifies treaties (2/3), tries impeachment. Vice President is President of Senate (votes only on ties). Majority Leader sets agenda. FILIBUSTER: extended debate to block; broken by CLOTURE (60 votes).',
        'COMMITTEES are where most work happens. STANDING (permanent, by topic — Ways and Means, Foreign Relations). SELECT (temporary, specific issue). JOINT (both chambers). CONFERENCE (reconcile House and Senate versions of a bill). Committee chairs (majority party, often by seniority) control hearings, markup, and which bills get a vote.',
        'LEADERSHIP: Speaker of the House (elected by the majority party). Majority Leader (House and Senate). Minority Leader. Whips (count and round up votes).',
        'LAWMAKING STEPS: 1) Bill introduced (any member). 2) Referred to committee. 3) Hearings, markup, committee vote. 4) Floor debate; House: Rules Committee; Senate: filibuster possible. 5) Floor vote — majority wins. 6) Other chamber repeats. 7) Conference committee reconciles differences. 8) Both chambers vote on the conference version. 9) President signs or vetoes. 10) Veto override needs 2/3 of both chambers.',
        'POWER OF THE PURSE: only Congress can appropriate money. Originates in the House.',
        'OVERSIGHT: Congress investigates the executive branch via hearings, subpoenas, and the Government Accountability Office.',
        'DELEGATE vs TRUSTEE roles: a delegate votes how constituents want; a trustee votes their own best judgment. Most members blend both (politico).',
      ],
      vocabulary: [
        { term: 'filibuster', definition: 'extended Senate debate used to delay or block a vote.' },
        { term: 'cloture', definition: 'a 60-vote Senate motion that ends a filibuster.' },
        { term: 'pork-barrel spending', definition: 'spending targeted at a specific district to benefit constituents.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bill',
      kind: 'worked_example',
      problem: 'Trace how a bill on environmental policy might become a law, from introduction to enactment.',
      steps: [
        'STEP 1: Senator introduces S.123 in the Senate. (Could equally start in the House as H.R.123.)',
        'STEP 2: Referred to Senate Environment and Public Works Committee. Committee chair decides whether to schedule hearings.',
        'STEP 3: Hearings — experts and stakeholders testify. Markup — committee revises text. Committee vote — passes 12-7.',
        'STEP 4: Floor debate. Majority Leader brings it up. Opponents may filibuster; cloture invoked with 60 votes.',
        'STEP 5: Senate floor vote — passes 55-45.',
        'STEP 6: Sent to House. Referred to relevant committee, hearings, markup, vote, floor debate (with Rules Committee setting time), floor vote.',
        'STEP 7: House version differs from Senate version. CONFERENCE COMMITTEE reconciles.',
        'STEP 8: Both chambers vote on the conference report.',
        'STEP 9: President signs (10 days). If vetoed, Congress can override with 2/3 of both chambers.',
        'OUTCOME: Most bills die in committee. Of those that pass one chamber, many die in the other. Few become law.',
      ],
      answer: 'Introduction → committee → floor → other chamber → conference → both chambers → president.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A senator threatens to talk for 20 hours to prevent a vote. What is this called, and how can the Senate stop it?',
      expectedAnswer: 'Filibuster — broken by cloture, which requires 60 votes.',
      responseFormat: 'free',
      hints: [
        'Extended debate to delay a vote = ?',
        'The motion to end it requires 3/5 of senators (60).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equal-power',
      kind: 'misconception_check',
      question: 'Do the House and Senate have equal power on every type of legislation?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the two chambers as identical.',
          correctsTo: 'No — both must pass a bill, but each has unique powers. House ORIGINATES revenue bills (Article I, Section 7). Senate confirms presidential appointments and ratifies treaties (2/3). Senate tries impeachment after House impeaches. The asymmetric powers reflect the framers\' different visions for each chamber.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'House: 435, 2-yr, by pop, Speaker, originates revenue. Senate: 100, 6-yr, equal-state, filibuster + cloture, confirms appointments.',
        'Committees do most work. Conference reconciles differences.',
        'Lawmaking: bill → committee → floor → other chamber → conference → both → president.',
        'Veto override: 2/3 of both chambers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the seniority system in committees still influence which bills get heard, even though it isn\'t a constitutional rule?',
      hint: 'The Constitution doesn\'t mention committees. Seniority is a party norm — committee chairs control hearings, markup, and scheduling. Senior chairs accumulate institutional knowledge, allies, and discretion. Reform efforts have weakened seniority but not eliminated it. This is an "informal constitution" or norms-based power.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
