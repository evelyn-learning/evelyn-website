/**
 * G11 — Social Studies: Civil Rights Movement (1954-1968).
 *
 * The struggle to end racial segregation and secure voting rights
 * for Black Americans. Brown v. Board, Montgomery Bus Boycott,
 * lunch counter sit-ins, March on Washington, Civil Rights Act,
 * Voting Rights Act, and key figures.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_SS_CIVIL_RIGHTS_MOVEMENT: LessonPlan = {
  id: 'evelyn.g11.ss.civil-rights-movement.v1',
  title: 'The Civil Rights Movement',
  curriculum: 'state-standards',
  grade: '11',
  subject: 'social-studies',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g11.ushistory.civil-rights',
      description: 'Explain the goals, strategies, key events, and outcomes of the Civil Rights Movement.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the movement as a long, organized struggle, not isolated events.',
      script: 'In 1954, Black Americans were legally segregated — separate schools, water fountains, buses, restaurants — and largely barred from voting in much of the South. By 1968, those laws were federally illegal and Black voting rates had risen dramatically. That transformation didn\'t happen by accident. It came from decades of organized struggle, courage, and strategic nonviolent action.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cr-movement',
      kind: 'concept',
      goal: 'Origins, key events and people, strategies, legislative outcomes, ongoing struggle.',
      keyIdeas: [
        'BACKGROUND: After Reconstruction (1877), Southern states passed JIM CROW LAWS — racial segregation in schools, transit, restaurants, etc. Plessy v. Ferguson (1896) said "separate but equal" was constitutional. Voting suppression via poll taxes, literacy tests, Klan violence.',
        'BROWN v. BOARD OF EDUCATION (1954): Supreme Court ruled school segregation unconstitutional, OVERTURNING Plessy. Major legal turning point.',
        'KEY EVENTS:',
        '  MONTGOMERY BUS BOYCOTT (1955-56): Rosa PARKS arrested for refusing to give up her bus seat. Black community boycotted city buses for ~13 months. Led by a young pastor — MARTIN LUTHER KING JR. Buses desegregated.',
        '  LITTLE ROCK NINE (1957): nine Black students integrated Central High School in Arkansas under federal protection.',
        '  LUNCH COUNTER SIT-INS (1960): Greensboro, NC — Black college students sat at "whites only" lunch counters. Spread across the South.',
        '  FREEDOM RIDES (1961): integrated buses traveling through the South testing federal desegregation. Met with violence.',
        '  MARCH ON WASHINGTON (Aug 28, 1963): ~250,000 marched. MLK\'s "I HAVE A DREAM" speech.',
        '  BIRMINGHAM (1963): MLK arrested; "Letter from Birmingham Jail". Police chief Bull Connor used dogs and fire hoses on protesters; shocking national TV.',
        '  SELMA TO MONTGOMERY MARCHES (1965): voting rights marches; "Bloody Sunday" police violence televised.',
        'STRATEGIES:',
        '  NONVIOLENT direct action (inspired by Gandhi): sit-ins, boycotts, marches, freedom rides.',
        '  Legal challenges through NAACP — strategic litigation.',
        '  Some leaders (Malcolm X, later Black Power movement) advocated more militant approaches.',
        'LEGISLATIVE WINS:',
        '  CIVIL RIGHTS ACT of 1964: banned segregation in public accommodations and employment discrimination.',
        '  VOTING RIGHTS ACT of 1965: outlawed voting discrimination practices, sent federal observers to ensure registration.',
        '  FAIR HOUSING ACT of 1968: banned housing discrimination.',
        'KEY FIGURES: MLK, Rosa Parks, Malcolm X, John Lewis, Ella Baker, Thurgood Marshall, Medgar Evers (assassinated 1963), Fannie Lou Hamer.',
        'MLK assassinated April 4, 1968 in Memphis.',
        'AFTERMATH: legal segregation ended, but economic and de facto segregation persisted. Movement\'s focus broadened to economic justice, criminal justice, voting rights protection. Ongoing struggle.',
      ],
      vocabulary: [
        { term: 'Jim Crow', definition: 'state and local laws enforcing racial segregation in the South.' },
        { term: 'segregation', definition: 'enforced separation of racial groups.' },
        { term: 'nonviolent direct action', definition: 'peaceful protest tactics — boycotts, sit-ins, marches.' },
        { term: 'Civil Rights Act of 1964', definition: 'banned segregation and employment discrimination.' },
      ],
      suggestedTools: ['show_concept_map', 'show_timeline'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-strategy',
      kind: 'worked_example',
      problem: 'Why was nonviolent direct action particularly effective for the Civil Rights Movement?',
      steps: [
        'MORAL CONTRAST: peaceful protesters being attacked by police created stark imagery. Public sympathy shifted.',
        'NATIONAL TV: brought Southern violence into Northern living rooms. Many Northerners hadn\'t fully grasped Jim Crow until they saw Bull Connor\'s dogs or Bloody Sunday.',
        'COALITION-BUILDING: nonviolence allowed religious leaders, white allies, and international observers to join. A violent movement would have isolated them.',
        'POLITICAL PRESSURE: federal officials had to act when violence and injustice were visible nationwide. LBJ pushed Civil Rights Act through partly because of public pressure.',
        'COMPARISON: cf. how non-violent protests in India (Gandhi) similarly turned moral force into political change.',
      ],
      answer: 'See above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What major Supreme Court ruling in 1954 ended legal segregation in public schools?',
      expectedAnswer: 'Brown v. Board of Education',
      responseFormat: 'free',
      hints: [
        '1954 case overturning Plessy v. Ferguson (1896).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'misconception-mlk-alone',
      kind: 'misconception_check',
      question: 'Maya thinks the Civil Rights Movement was "led by MLK; without him it wouldn\'t have happened." What\'s missing?',
      commonErrors: [
        {
          answer: 'true — he was the leader',
          misconception: 'Centering one figure in a broad coordinated movement.',
          correctsTo: 'MLK was the most-recognized voice, but the movement was a vast network. Decades of NAACP legal work (Thurgood Marshall, Charles Hamilton Houston) prepared the ground. Local leaders like Ella Baker and Fannie Lou Hamer organized communities. SNCC organized students. Many figures across many strategies. MLK\'s eloquence and discipline were vital — but he stood on a movement, not above it.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Background: Jim Crow segregation + voting suppression after Reconstruction.',
        'Brown v. Board (1954) ended legal school segregation.',
        'Key events: Montgomery boycott, sit-ins, March on Washington, Selma.',
        'Strategy: nonviolent direct action + legal challenges.',
        'Wins: Civil Rights Act (1964), Voting Rights Act (1965), Fair Housing Act (1968).',
        'MLK led but did not stand alone — many movement leaders.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the Civil Rights Movement considered "ongoing" today?',
      hint: 'Legal segregation ended, but residential, educational, and economic disparities persist. Modern movements (Black Lives Matter, voting rights advocacy) extend the work.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
