/**
 * AP Government — Political parties and elections.
 *
 * Two-party system, party realignments, primaries, the Electoral
 * College, gerrymandering.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_GOV_POLITICAL_PARTIES: LessonPlan = {
  id: 'evelyn.ap.gov.political-parties.v1',
  title: 'Political parties and US elections',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'ap-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.parties-elections',
      description: 'Analyze the role of political parties, primaries, and the Electoral College in US elections.',
      standard: 'AP-GOV-PRD-1',
    },
  ],
  prerequisites: ['apgov.federalism'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The constitutional silence on parties.',
      script: 'The Constitution mentions parties NOWHERE. The Founders feared "factions" — yet by the 1790s, Hamilton and Jefferson were leading rival parties. Today, two parties dominate every level of US politics, even though they\'re structurally invisible to the Constitution.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-system-process',
      kind: 'concept',
      goal: 'Two-party dynamic + primaries + Electoral College + gerrymandering.',
      keyIdeas: [
        'TWO-PARTY SYSTEM: persistent in US due to single-member-district plurality elections (Duverger\'s law). Third parties rarely break through.',
        'PARTY REALIGNMENTS: major shifts in voter coalitions. 1860 (Republicans rise on anti-slavery), 1932 (FDR\'s New Deal coalition), 1968-80 (Southern Democrats become Republicans).',
        'PRIMARIES: voters within each party choose nominees. CLOSED primary (registered party members only) vs OPEN (any voter). Iowa CAUCUSES, New Hampshire primary traditionally first.',
        'GENERAL ELECTION: presidential, Congressional, state. Held first Tuesday after first Monday in November.',
        'ELECTORAL COLLEGE (presidential): 538 electors total (House + Senate + 3 for DC). 270 to win. Each state\'s electors = its Congressional delegation. WINNER-TAKE-ALL in 48 states (Maine and Nebraska use district method).',
        'CONSEQUENCES of EC: candidates focus on swing states. Possible to win popular vote but lose presidency (Hillary Clinton 2016, Al Gore 2000).',
        'CONGRESSIONAL ELECTIONS: House every 2 years (all 435 seats), Senate every 6 (1/3 each cycle).',
        'GERRYMANDERING: drawing district lines to favor a party. Two techniques: PACKING (concentrate opponents in one district) and CRACKING (split them across many to dilute). Has been ruled UNCONSTITUTIONAL when racial, but partisan gerrymandering has been left to states (Rucho v. Common Cause, 2019).',
      ],
      vocabulary: [
        { term: 'realignment', definition: 'a major lasting shift in party coalitions.' },
        { term: 'Electoral College', definition: 'the body that formally elects the president; 538 electors.' },
        { term: 'gerrymandering', definition: 'drawing district lines to favor one party.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ec',
      kind: 'worked_example',
      problem: 'How can a candidate win the popular vote but LOSE the Electoral College?',
      steps: [
        'Each state\'s electors are awarded WINNER-TAKE-ALL (48 of 50 states).',
        'A candidate can rack up huge popular vote margins in a few large states they\'d win anyway (e.g., California, NY) — wasted votes beyond the win.',
        'They can lose narrowly in many swing states.',
        'Result: large national popular margin, but fewer electors.',
        'Happened in 2000 (Bush vs Gore), 2016 (Trump vs Clinton). 5 times in US history total.',
      ],
      answer: 'wasted popular votes in landslide states, narrow losses in swing states',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In gerrymandering, what does "PACKING" do, and what does "CRACKING" do?',
      expectedAnswer: 'packing: concentrate opponents in one district (limit them to one seat); cracking: split opponents across many districts (dilute their voting power)',
      responseFormat: 'free',
      hints: [
        'Both reduce opposition representation.',
        'One stuffs them in; the other spreads them thin.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-third-parties-can-win',
      kind: 'misconception_check',
      question: 'Could a third party realistically win a US presidential election today?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Underestimating the structural barriers.',
          correctsTo: 'Extremely unlikely — single-member plurality + winner-take-all EC + ballot-access barriers + media coverage strongly favor two-party. Even with billion-dollar campaigns and polling support (Perot 1992 won 19% popular, ZERO electors), no third party has won. Realignment usually happens INSIDE one of the two parties, not via a new party.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two-party system from single-member plurality elections.',
        'Primaries (closed/open) → general election.',
        'Electoral College: 538, 270 wins; mostly winner-take-all.',
        'Possible to win popular vote and lose presidency.',
        'Gerrymandering: packing + cracking distort representation.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the Constitution mention parties NOWHERE despite their dominance?',
      hint: 'The Founders feared "factions" (Federalist 10). They designed the system without parties in mind. Parties emerged immediately anyway — first faction debate was Federalists vs Democratic-Republicans by the 1790s. Constitution doesn\'t require parties; the design just doesn\'t prevent them.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
