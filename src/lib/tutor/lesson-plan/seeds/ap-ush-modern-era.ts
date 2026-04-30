/**
 * AP USH — Modern Era (1980-Present).
 *
 * Reagan revolution, end of Cold War, globalization, 9/11, polarization.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_MODERN_ERA: LessonPlan = {
  id: 'evelyn.ap.ush.modern-era.v1',
  title: 'Modern Era (1980–Present)',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'us history',
  locale: 'en',
  los: [
    {
      id: 'apush.modern-era',
      description: 'Trace the political shift from the Reagan Revolution through the end of the Cold War, the rise of globalization, the impact of 9/11, and the deepening of partisan polarization.',
      standard: 'AP-USH-9',
    },
  ],
  prerequisites: ['apush.cold-war'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A 40-year arc that defines today\'s politics.',
      script: 'Start in 1980: high inflation, Cold War tense, faith in government low after Vietnam and Watergate. End now: a hyperconnected economy, post-Cold War order under stress, two parties that almost never agree on anything. Understanding the arc — Reagan, the Soviet collapse, NAFTA, the Internet, 9/11, 2008 crisis, polarization — is understanding how today happened.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-arc',
      kind: 'concept',
      goal: 'Major chapters of 1980-present.',
      keyIdeas: [
        'REAGAN REVOLUTION (1981-1989): tax cuts (Economic Recovery Tax Act 1981), deregulation, tough Cold War posture (Strategic Defense Initiative; "Tear down this wall" 1987). Coalition: economic conservatives + religious right (Moral Majority) + Cold War hawks. Trickle-down ("supply-side") economics. Deficits ballooned despite anti-deficit rhetoric.',
        'COLD WAR ENDS: Berlin Wall falls (Nov 1989), Soviet Union dissolves (Dec 1991). Bush 41 manages German reunification, Gulf War (1991, expel Iraq from Kuwait). "End of history" framing — liberal democracy seems triumphant.',
        'CLINTON (1993-2001): centrist Democrat ("third way"). NAFTA (1994), welfare reform (1996), balanced budget by 1998, dot-com boom. Impeachment over Lewinsky scandal (acquitted 1999). Globalization accelerates.',
        'GLOBALIZATION + TECH: NAFTA, WTO (1995), China admitted to WTO (2001). Manufacturing jobs decline; service economy grows. The Internet (commercial 1990s), e-commerce, smartphones (2007 iPhone). Productivity boom; inequality rises.',
        '9/11 + WAR ON TERROR: Sep 11, 2001 attacks. ~3,000 killed. Bush 43 launches Afghanistan war (2001) targeting Al-Qaeda + Taliban. Iraq War (2003) on contested WMD claims. PATRIOT Act (2001) expands surveillance powers. Guantanamo Bay; debate over enhanced interrogation. Wars long, costly, inconclusive.',
        '2008 FINANCIAL CRISIS: subprime mortgage collapse → bank failures (Lehman) → Great Recession. TARP bailout (2008), Obama stimulus (2009), Dodd-Frank (2010). Slow recovery; political backlash on left (Occupy) and right (Tea Party).',
        'OBAMA (2009-2017): first Black president. Affordable Care Act (2010). Same-sex marriage nationally (Obergefell, 2015). Killing of Osama bin Laden (2011). Drone warfare expands. Polarization deepens; Congress mostly gridlocked.',
        'POPULISM + POLARIZATION (2016-): Trump elected 2016 on anti-immigration, anti-trade, populist platform. First impeachment (Ukraine, 2019). Pandemic (2020). Election dispute and Jan 6, 2021. Biden 2020-24 (CHIPS Act 2022, Inflation Reduction Act 2022). Trump returns 2025. Parties geographically polarized; trust in institutions historically low.',
        'DEMOGRAPHIC CHANGE: US becomes more diverse — Hispanic population grows from ~6% (1980) to ~19% (2020). Asian-American population grows. Aging population strains entitlements (Social Security, Medicare).',
      ],
      vocabulary: [
        { term: 'supply-side economics', definition: 'theory that tax cuts on top earners spur growth that benefits everyone (Reagan-era).' },
        { term: 'PATRIOT Act', definition: '2001 law expanding US surveillance and law-enforcement authority after 9/11.' },
        { term: 'Great Recession', definition: 'the 2007-2009 economic downturn triggered by the subprime mortgage collapse.' },
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'worked-reagan-vs-fdr',
      kind: 'worked_example',
      problem: 'Compare the Reagan Revolution\'s political coalition to the New Deal coalition. What broke and what shifted?',
      steps: [
        'NEW DEAL COALITION (1932-1968ish): white Southern Democrats + urban ethnic immigrants + Black voters (after FDR) + organized labor + intellectuals. Held together by economic populism + WWII legacy.',
        'BREAKS: Civil Rights Act (1964) and Voting Rights Act (1965) push white Southerners toward Republicans (Nixon\'s Southern Strategy). Vietnam splits the left. Stagflation 1970s discredits Keynesian consensus.',
        'REAGAN COALITION: economic conservatives + religious right (post-Roe) + Cold War hawks + suburban whites + previously Democratic blue-collar "Reagan Democrats". Held together by anti-government, anti-Soviet, social-traditionalist themes.',
        'GEOGRAPHIC INVERSION: South flips Republican; Northeast and West Coast urban areas trend Democratic. By 2000s, the parties\' regional bases have swapped from where they stood in 1960.',
        'CONCEPTUAL SHIFT: New Deal era — what does GOVERNMENT do FOR you? Reagan era — what does GOVERNMENT do TO you? Reagan reframed politics around limiting government, not expanding it.',
      ],
      answer: 'New Deal coalition fractures over civil rights, Vietnam, and economy; Reagan assembles a new coalition around limited government, social conservatism, and Cold War strength. South flips R; coastal cities D.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the 2008 financial crisis a key inflection point in modern US politics?',
      expectedAnswer: 'It triggered both the Tea Party (right-wing populist anger at bailouts and government spending) and Occupy Wall Street (left-wing populist anger at inequality and bank power). It eroded trust in elite institutions on both sides and seeded the populist movements behind Trump (2016) and Sanders (2016, 2020). Globalization\'s losers became more politically mobilized.',
      responseFormat: 'free',
      hints: [
        'What political movements emerged AFTER 2008?',
        'Both left and right started rejecting elite consensus — why?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-end-of-history',
      kind: 'misconception_check',
      question: 'After the Soviet Union fell in 1991, was the world headed toward universal liberal democracy?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Taking the "end of history" thesis at face value.',
          correctsTo: 'It looked that way at the time (Fukuyama\'s "End of History"), but no. China grew without democratizing. Russia under Putin reverted to authoritarianism. Religious fundamentalism rose globally. 9/11 inaugurated a long counter-terrorism era. The 2008 crisis cracked confidence in market liberalism. By the 2010s, "democratic backsliding" became a topic of study. Liberal democracy faces real challenges, not a triumphal march. The 1990s consensus was overconfident.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Reagan Revolution: tax cuts, deregulation, Cold War win. New coalition replaces New Deal.',
        'Cold War ends 1989-91; brief unipolar moment.',
        '9/11 + Iraq War + 2008 crisis = trust collapse.',
        'Populism + polarization shape 2016-present.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Trace one continuous thread connecting the 1980 Reagan election to present-day politics.',
      hint: 'Several work: (1) Tax-cutting orthodoxy in Republican party (Reagan → Bush 43 → Trump 2017 → today). (2) Religious right\'s influence on judicial nominations leading to Dobbs (2022). (3) Geographic realignment — every election since 1980 has shown the South more Republican and coastal cities more Democratic. Pick one and trace cause/effect.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
