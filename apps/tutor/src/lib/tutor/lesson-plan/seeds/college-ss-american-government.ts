/**
 * College Intro — American Government (Poli Sci 101).
 *
 * Constitution, branches, federalism, civil liberties, parties, policy.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SS_AMERICAN_GOVERNMENT: LessonPlan = {
  id: 'evelyn.college.american-government.v1',
  title: 'American government — Constitution, branches, federalism',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'social-studies',
  topic: 'american-government',
  locale: 'en',
  los: [
    {
      id: 'college.amgov',
      description: 'Analyze the structure of US government, separation of powers, federalism, and the policy process.',
      standard: 'COLLEGE-AMGOV',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame US government as designed to be SLOW.',
      script: 'The US Constitution is famous for being inefficient on purpose. Bicameral Congress. Separate executive. Independent judiciary. Federal vs state. The framers had just lived through a tyranny and a near-failed confederation; they wanted obstacles to both. The frustration you feel about gridlock is partly designed in. Understanding government here means understanding why slowness was a FEATURE.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-system',
      kind: 'concept',
      goal: 'Constitution structure + branches + federalism + parties + policy.',
      keyIdeas: [
        'CONSTITUTION: 7 articles + 27 amendments. Articles I-III establish branches; IV federalism; V amendment; VI supremacy + oaths; VII ratification.',
        'SEPARATION OF POWERS: legislative (makes law), executive (enforces), judicial (interprets). Each can check the others.',
        'CHECKS + BALANCES: Congress passes law → president signs/vetoes → Congress overrides veto with 2/3 → Court can rule unconstitutional → Congress can amend Constitution. Slow on purpose.',
        'FEDERALISM: powers split between national and state. Article I §8 enumerates national powers; 10th Amendment reserves rest to states. Implied powers via Necessary + Proper Clause (McCulloch v. Maryland).',
        'BILL OF RIGHTS: first 10 amendments protect individual liberties. 14th Amendment (1868) incorporated most against states.',
        'PARTIES: Constitution didn\'t plan for them; emerged immediately. Two-party system reinforced by single-member districts + plurality voting (Duverger\'s law).',
        'POLICY PROCESS: agenda-setting → formulation → adoption (Congress + president) → implementation (executive agencies) → evaluation. Many veto points; few clean wins.',
        'BUREAUCRACY: cabinet departments + agencies execute law. Largely staffed by career civil service; political appointees lead them. Often the actual rule-makers.',
      ],
      vocabulary: [
        { term: 'separation of powers', definition: 'division of government among legislative, executive, and judicial branches.' },
        { term: 'federalism', definition: 'division of powers between national and state governments.' },
        { term: 'incorporation doctrine', definition: 'application of Bill of Rights protections against state governments via the 14th Amendment.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bill',
      kind: 'worked_example',
      problem: 'A bill passes the House but the Senate filibusters. What\'s required to overcome the filibuster, and why is this not in the Constitution?',
      steps: [
        'Filibuster = unlimited debate in the Senate. To END debate (cloture): 60 votes (3/5 of 100).',
        'Constitution requires only majority for most legislation; the filibuster is a SENATE RULE, not constitutional.',
        'Could be eliminated by Senate majority vote at any time (the "nuclear option" — already done for nominations).',
        'Effect: 60-vote requirement for most major legislation gives the minority party a veto. Defenders argue it forces compromise; critics argue it produces gridlock.',
        'Lesson: a lot of how government actually operates lives in CHAMBER RULES + INFORMAL NORMS, not the Constitution.',
      ],
      answer: '60 votes for cloture; it\'s a Senate rule, not a constitutional requirement.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does the US have only two major parties despite no constitutional requirement?',
      expectedAnswer: 'single-member districts + plurality (winner-take-all) voting create strong incentives toward two parties (Duverger\'s law); third parties tend to act as spoilers',
      responseFormat: 'free',
      hints: [
        'It\'s about the voting system, not law.',
        'Compare to proportional representation systems with many parties.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-popular-vote',
      kind: 'misconception_check',
      question: 'A student says: "The president is elected by popular vote." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because of voting',
          misconception: 'Conflating popular vote with the Electoral College.',
          correctsTo: 'The president is elected by the ELECTORAL COLLEGE — 538 electors allocated by state. Each state\'s legislature decides how to allocate its electors (most use winner-take-all). It\'s possible (and has happened five times) for the popular-vote loser to win the Electoral College. Reform proposals exist but require either a constitutional amendment or interstate compacts (the National Popular Vote Interstate Compact is one such effort).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Slow by design: 3 branches, 2 chambers, federal-state split.',
        'Many veto points; few clean wins.',
        'Bill of Rights expanded to states via 14th Amendment.',
        'Two-party system from voting structure, not law.',
        'Real rule-making often happens in agencies + chamber rules, not Constitution text.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
