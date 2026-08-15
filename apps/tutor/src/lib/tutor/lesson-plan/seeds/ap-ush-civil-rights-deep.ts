/**
 * AP US History — Civil Rights Movement (deep dive).
 *
 * From Brown v. Board (1954) through the Voting Rights Act (1965)
 * and Black Power. Key events, leaders, and tactics.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_CIVIL_RIGHTS_DEEP: LessonPlan = {
  id: 'evelyn.ap.ush.civil-rights-deep.v1',
  title: 'Civil Rights Movement: 1954-1968',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.civil-rights',
      description: 'Analyze the strategies, leaders, and consequences of the Civil Rights Movement.',
      standard: 'AP-USH-NAT-9',
    },
  ],
  prerequisites: ['apush.reconstruction'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Movement as a continuation of Reconstruction — finishing what was abandoned.',
      script: 'In 1865 the Civil War ended slavery. In 1877 Reconstruction ended and Jim Crow began. From 1954 to 1968, Americans finished what 1865 started — using courts, marches, sit-ins, and unimaginable courage to dismantle segregation.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-key-events',
      kind: 'concept',
      goal: 'Eight key moments + the strategic shift over time.',
      keyIdeas: [
        'BROWN v. BOARD OF EDUCATION (1954): Supreme Court overturned "separate but equal". Ended legal school segregation in theory; enforcement took decades.',
        'MONTGOMERY BUS BOYCOTT (1955-56): Rosa Parks arrested for not giving up bus seat. 381-day Black community boycott led by Martin Luther King Jr. Buses desegregated.',
        'LITTLE ROCK NINE (1957): nine Black students integrated Central High School with federal troop protection after Arkansas governor blocked them.',
        'SIT-INS (1960): Greensboro four sat at Woolworth\'s lunch counter. Movement spread to dozens of cities.',
        'FREEDOM RIDES (1961): integrated buses traveled through South. Riders beaten, buses bombed. Forced federal intervention.',
        'MARCH ON WASHINGTON (1963): 250,000 marched. King\'s "I Have a Dream" speech. Pressure for civil rights legislation.',
        'CIVIL RIGHTS ACT OF 1964: outlawed discrimination based on race, color, religion, sex, national origin. Ended legal segregation in public accommodations.',
        'VOTING RIGHTS ACT OF 1965: outlawed literacy tests and poll taxes. Federal oversight of voting in places with discrimination history. Black voter registration in South soared.',
        'STRATEGIC EVOLUTION: Started with court cases (NAACP), shifted to nonviolent direct action (King, SCLC, SNCC), and by mid-60s split — some embraced Black Power (Malcolm X, Black Panthers) frustrated by slow change.',
      ],
      vocabulary: [
        { term: 'civil disobedience', definition: 'nonviolent refusal to obey unjust laws to produce social change.' },
        { term: 'segregation', definition: 'enforced separation of racial groups by law.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mlk',
      kind: 'worked_example',
      problem: 'Why did Martin Luther King Jr. emphasize NONVIOLENT resistance, and how did it work tactically?',
      steps: [
        'Inspired by Gandhi\'s independence movement in India.',
        'BELIEF: violence breeds violence; moral authority comes from accepting suffering without retaliation.',
        'TACTIC: protests in Southern cities forced violent reactions from white mobs and police. Cameras captured the brutality.',
        'White Northern viewers saw injustice clearly — public opinion shifted.',
        'Federal government (Kennedy, then Johnson) had to act. Birmingham 1963 (police dogs, fire hoses on children) was a turning point — led directly to the 1964 Civil Rights Act.',
        'Nonviolence was both moral and tactical: leveraging moral asymmetry to win over a national audience.',
      ],
      answer: 'moral authority + tactical leverage of media coverage to shift national opinion',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What did the Voting Rights Act of 1965 outlaw, and why was it needed even after the Civil Rights Act of 1964?',
      expectedAnswer: 'literacy tests, poll taxes, other voting restrictions; CRA didn\'t cover voting comprehensively',
      responseFormat: 'free',
      hints: [
        'Civil Rights Act of 1964 covered public accommodations, employment.',
        'But Black Southerners still couldn\'t vote due to obstacles. VRA targeted that specifically.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mlk-only',
      kind: 'misconception_check',
      question: 'Was the Civil Rights Movement essentially Martin Luther King Jr.?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Reducing the Movement to a single leader.',
          correctsTo: 'No — the Movement included thousands of organizers, lawyers, students, and ordinary people. Ella Baker, Diane Nash, John Lewis, Bayard Rustin, Fannie Lou Hamer, Thurgood Marshall, Medgar Evers, and many more were essential. King was a key figure but not the only one.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Brown (1954) → bus boycott (1956) → sit-ins, freedom rides (1960-61) → March on Washington (1963).',
        'Civil Rights Act 1964: ended legal public segregation.',
        'Voting Rights Act 1965: ended voting discrimination tactics.',
        'Strategy evolved: courts → nonviolent direct action → split with Black Power.',
        'Media coverage was a key tactical weapon.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did the Vietnam War complicate the Civil Rights Movement after 1965?',
      hint: 'Black Americans drafted disproportionately. King spoke out against the war (1967) — alienated moderate allies (LBJ). Movement split: some focused on economic justice (Poor People\'s Campaign), some on Black Power. King assassinated 1968. War absorbed political energy.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
