/**
 * Grades 6-8 Social Studies — Civil Rights Movement.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_CIVIL_RIGHTS_MOVEMENT: LessonPlan = {
  id: 'evelyn.g68.ss.civil-rights-movement.v1',
  title: 'Grades 6-8 SS — Civil Rights Movement',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.civil-rights-movement',
      description: 'Identify key figures, strategies, and outcomes of the 1950s-60s civil rights movement.',
      standard: 'NCSS 6-8 Civic Ideals & Practices',
    },
  ],
  prerequisites: ['g68.ss.depression-wwii'],
  followUps: ['g68.ss.cold-war-overview'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Through nonviolent resistance, ordinary people changed laws and reshaped America.',
      script: 'In 1955, Rosa Parks refused to give up her seat on a bus. In 1963, MLK delivered "I Have a Dream". By 1965, the Voting Rights Act had passed. Today we drill how movements WORK — and how rights are won, not given.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-civil-rights',
      kind: 'concept',
      goal: 'Background + key events + leaders + legislation + legacy.',
      keyIdeas: [
        'BACKGROUND: After Reconstruction (1877), Jim Crow laws enforced segregation in the South. Plessy v. Ferguson (1896) had legalised "separate but equal".',
        'BROWN v. BOARD OF EDUCATION (1954): Supreme Court ruled school segregation unconstitutional, OVERTURNING Plessy. Marked the legal turning point.',
        'MONTGOMERY BUS BOYCOTT (1955-56): Rosa Parks refused to give up her seat. Black community boycotted buses for 381 days. Court ruled bus segregation unconstitutional.',
        'NONVIOLENT RESISTANCE: strategy of MLK and others. Sit-ins (1960 — Greensboro, NC), Freedom Rides (1961), peaceful marches.',
        'KEY FIGURES: Martin Luther King Jr. (leader of nonviolent resistance), Rosa Parks, Malcolm X (more militant approach), Thurgood Marshall (legal strategy, later Supreme Court justice), John Lewis (student leader), Fannie Lou Hamer.',
        'MARCH ON WASHINGTON (Aug 28, 1963): 250,000+ people. MLK\'s "I Have a Dream" speech.',
        'BIRMINGHAM (1963): protests faced fire hoses and police dogs. Images on TV shocked the country.',
        'CIVIL RIGHTS ACT (1964): banned segregation in public places, prohibited employment discrimination by race.',
        'SELMA TO MONTGOMERY MARCH (March 1965): for voting rights; "Bloody Sunday" attacks broadcast nationally.',
        'VOTING RIGHTS ACT (1965): banned discriminatory voting practices (poll taxes, literacy tests).',
        'MLK ASSASSINATED April 4, 1968 in Memphis.',
        'FAIR HOUSING ACT (1968): banned housing discrimination.',
        'LEGACY: civil rights gains were profound but incomplete. Discrimination persisted in subtler forms; debates over equality continue.',
        'OTHER MOVEMENTS BUILT ON IT: women\'s rights, LGBTQ+ rights, disability rights, Latinx rights, etc.',
      ],
      vocabulary: [
        { term: 'segregation', definition: 'the legal or social separation of people by race.' },
        { term: 'civil rights', definition: 'rights that protect citizens from discrimination by government or others.' },
        { term: 'nonviolent resistance', definition: 'a strategy of opposing injustice through peaceful protest, marches, and refusal rather than violence.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-brown',
      kind: 'worked_example',
      problem: 'Why was Brown v. Board of Education (1954) such a turning point?',
      steps: [
        'For 58 years, Plessy v. Ferguson (1896) had ruled "separate but equal" CONSTITUTIONAL. School segregation was legal in many states.',
        'In Brown v Board, the NAACP (led by Thurgood Marshall) argued separate schools were INHERENTLY UNEQUAL — based on social science showing harm to Black children.',
        'The Supreme Court UNANIMOUSLY agreed. Decision: separate educational facilities are inherently unequal, violating the 14th Amendment.',
        'Result: legal foundation for ending segregation in education AND eventually all public spaces.',
        'Implementation was slow and resisted (e.g. Little Rock crisis, 1957), but the legal precedent was set.',
      ],
      answer: 'Overturned Plessy; ruled separate-but-equal unconstitutional in education.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What did the Civil Rights Act of 1964 accomplish?',
      expectedAnswer: 'Banned segregation in public places (restaurants, hotels, theatres) and discrimination in employment based on race, colour, religion, sex, or national origin. Major federal civil rights law.',
      responseFormat: 'free',
      hints: [
        'It outlawed segregation in many places.',
        'It also addressed jobs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-king-alone',
      kind: 'misconception_check',
      question: 'A student says "MLK led the civil rights movement by himself." Why is this wrong?',
      commonErrors: [
        {
          answer: 'MLK alone',
          misconception: 'Reducing a mass movement to one leader.',
          correctsTo: 'The civil rights movement was a MASS MOVEMENT of thousands. Rosa Parks, Ella Baker, Fannie Lou Hamer, John Lewis, Bayard Rustin, Diane Nash, Stokely Carmichael, and countless ordinary people made it work. MLK was a visible leader, but boycotts, sit-ins, marches, and legal cases required organising by many. Calling it "MLK\'s movement" erases the work of many — especially women and lesser-known activists.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Brown v Board (1954): overturned separate-but-equal.',
        'Montgomery Boycott (1955-56) launched mass nonviolent action.',
        'March on Washington (1963), MLK "I Have a Dream".',
        'Civil Rights Act (1964): banned public segregation + employment discrimination.',
        'Voting Rights Act (1965): banned discriminatory voting practices.',
        'MLK assassinated 1968.',
        'Movement was many people, not one.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why was NONVIOLENT resistance so effective at producing change?',
      hint: 'Several reasons: 1) Moral high ground — peaceful protesters facing violence drew sympathy and support. 2) TV coverage in the 1950s-60s broadcast images of brutality (fire hoses, dogs) into living rooms, shifting public opinion. 3) Hard to vilify peaceful marchers; easy to vilify violent ones. 4) Built coalitions across races, religions, regions. 5) Forced authorities to either accept change or look brutal. The strategy required immense discipline; protesters trained for it. The combination produced political pressure no force-based approach matched.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
