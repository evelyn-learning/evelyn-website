/**
 * G11 — Government: Elections and voting in the US.
 *
 * How elected officials get into office. Federal election structure
 * (House, Senate, President), the Electoral College and why it
 * matters, primaries vs general election, voting rights history,
 * voter turnout patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_SS_ELECTIONS_VOTING: LessonPlan = {
  id: 'evelyn.g11.ss.elections-voting.v1',
  title: 'Elections and Voting',
  curriculum: 'state-standards',
  grade: '11',
  subject: 'social-studies',
  topic: 'government',
  locale: 'en',
  los: [
    {
      id: 'ss.g11.govt.elections',
      description: 'Explain how US elections work, including the Electoral College and primary system.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Highlight a feature unique to US elections.',
      script: 'In 2000 and 2016, the US elected a President who got FEWER popular votes than the loser. How is that possible? Because the United States doesn\'t actually elect the President directly. It elects the ELECTORAL COLLEGE, which then picks the President. That quirk — and many others — make American elections a system worth understanding piece by piece.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-elections',
      kind: 'concept',
      goal: 'Federal offices, Electoral College, primaries, voting rights timeline, turnout.',
      keyIdeas: [
        'FEDERAL ELECTED OFFICES:',
        '  PRESIDENT: 4-year term, max 2 terms (22nd Amendment).',
        '  SENATORS: 6-year terms, 2 per state. About 1/3 elected every 2 years.',
        '  HOUSE REPRESENTATIVES: 2-year terms. Number per state by population (re-apportioned every 10 years after Census). 435 total seats.',
        'PRIMARY ELECTIONS: each major party (Democratic, Republican) holds primaries in each state to pick its nominee.',
        '  CLOSED primary: only registered party members vote.',
        '  OPEN primary: any voter can choose which party\'s primary to participate in.',
        '  Iowa CAUCUS and New Hampshire PRIMARY traditionally lead the calendar.',
        'GENERAL ELECTION: in November of even-numbered years.',
        '  Presidential elections: every 4 years.',
        '  Midterm elections: every 4 years (between presidential), only Congress.',
        'ELECTORAL COLLEGE for President:',
        '  Each state gets ELECTORS = (number of House reps) + (2 senators).',
        '  Total electors: 538. Need 270 to win.',
        '  Most states: WINNER-TAKE-ALL — whoever wins the state\'s popular vote gets all electors. Only Maine and Nebraska split.',
        '  Result: candidates focus on SWING STATES (Pennsylvania, Michigan, Wisconsin, etc.). Solid red/blue states get less attention.',
        '  Possible to win Electoral College while LOSING national popular vote (2000 Bush, 2016 Trump).',
        'VOTING RIGHTS TIMELINE:',
        '  Originally: only white male property owners.',
        '  15th Amendment (1870): Black men granted voting rights (in theory; suppressed via Jim Crow).',
        '  19th Amendment (1920): Women granted voting rights.',
        '  Voting Rights Act (1965): banned racial voting discrimination.',
        '  26th Amendment (1971): voting age lowered to 18.',
        'VOTER TURNOUT: typically 50-65% in presidential years, 35-45% in midterms. Lower than most developed democracies.',
      ],
      vocabulary: [
        { term: 'Electoral College', definition: 'the body that formally elects the US President.' },
        { term: 'primary', definition: 'an election within a party to pick its nominee.' },
        { term: 'caucus', definition: 'a meeting where party members select a nominee through discussion.' },
        { term: 'swing state', definition: 'a state where the presidential outcome is close and uncertain.' },
        { term: 'midterm election', definition: 'a federal election between presidential elections.' },
      ],
      suggestedTools: ['show_concept_map', 'show_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-electoral-college',
      kind: 'worked_example',
      problem: 'Texas has 38 House reps + 2 Senators. How many electoral votes does Texas have?',
      steps: [
        'Electors = House reps + Senators.',
        'Texas: 38 + 2 = 40 electoral votes.',
        'For comparison: Wyoming (1 + 2 = 3), California (52 + 2 = 54).',
        'Note the small-state bias: Wyoming has 1 elector per ~190K people; California has 1 per ~720K. Smaller states have proportionally more electoral weight.',
      ],
      answer: '40',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'When are midterm elections, and what are at stake?',
      expectedAnswer: 'Every 4 years between presidential elections (so every even year). All House seats + ~1/3 of Senate + many state/local races. President NOT on ballot.',
      responseFormat: 'free',
      hints: [
        'Every even year. NO president on the ballot in midterm.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-popular-vote',
      kind: 'misconception_check',
      question: 'Mira thinks "the candidate with the most votes wins the presidency." What\'s wrong?',
      commonErrors: [
        {
          answer: 'right — that\'s how elections work',
          misconception: 'Treating the popular vote as the formal presidential election.',
          correctsTo: 'Wrong. The Electoral College decides. Most popular votes does NOT guarantee winning. Five times in US history (1824, 1876, 1888, 2000, 2016) a candidate won the presidency while losing the popular vote. The Electoral College is intentional in the Constitution; reform proposals exist (e.g., National Popular Vote Interstate Compact) but it\'s still the rule.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'President 4-yr (max 2 terms), Senate 6-yr, House 2-yr.',
        'Electoral College: 538 total, 270 needed. House reps + 2 senators per state.',
        'Winner-take-all in most states → swing states matter most.',
        'Possible to win EC while losing popular vote.',
        'Voting rights expanded over centuries: 15th, 19th, VRA 1965, 26th.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why was the Electoral College created in the first place?',
      hint: 'Founders distrusted direct democracy ("tyranny of the majority"); wanted to balance state-vs-national interests; feared voters in distant states wouldn\'t be informed enough about candidates without electors as intermediaries. Some of those reasons are now considered outdated.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
