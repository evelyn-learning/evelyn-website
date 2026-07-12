/**
 * AP US History — Unit 8 CED 8.9-8.10: The Civil Rights Movement.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.civil-rights-movement.v1`. Covers Brown, Montgomery,
 * Little Rock, sit-ins/Freedom Rides, Birmingham, the March on Washington,
 * the Civil Rights Act (1964) and Voting Rights Act (1965), the movement's
 * northern shift, and Black Power — anchored by the reused Brown v. Board
 * opinion excerpt. MLK's works and Malcolm X's ideas are described only,
 * never quoted (copyright).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_CIVIL_RIGHTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.civil-rights-movement.v1',
  course: 'AP United States History',
  cedUnit: 8,
  cedTopic: '8.9-8.10',
  cedTitle: 'The Civil Rights Movement',
  planId: 'evelyn.ap.apush.civil-rights-movement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.civil-rights-movement.v1' }],
  theory: [
    {
      loId: 'apush.civil-rights-movement',
      kind: 'event',
      title: 'Brown v. Board of Education (1954)',
      content:
        'The Supreme Court ruled segregated public schools violate the Fourteenth Amendment\'s Equal Protection Clause, rejecting "separate but equal" (Plessy v. Ferguson, 1896) as "inherently unequal." Brown established the constitutional PRINCIPLE but did not by itself desegregate a single classroom — implementation faced years of resistance.',
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'event',
      title: 'the Montgomery Bus Boycott (1955-56)',
      content:
        "After Rosa Parks's arrest, Montgomery's Black community sustained a bus boycott for over a year, ending when the Supreme Court ruled the city's bus segregation unconstitutional. Launched Martin Luther King Jr. to national leadership; he and allied ministers founded the SCLC in 1957.",
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'event',
      title: 'Little Rock (1957)',
      content:
        "When Arkansas's governor used the National Guard to block the \"Little Rock Nine\" from enrolling at Central High School, Eisenhower federalized the Guard and sent Army troops to enforce the students' enrollment — implementing Brown sometimes required direct federal force against a defiant state.",
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'event',
      title: 'sit-ins and Freedom Rides (1960-61)',
      content:
        'The 1960 Greensboro sit-ins spread rapidly and led to SNCC\'s founding; CORE\'s 1961 Freedom Rides tested (and provoked federal enforcement of) desegregation of interstate bus terminals, facing violent resistance that forced federal intervention.',
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'event',
      title: 'the Birmingham campaign (1963)',
      content:
        'SCLC organized marches and sit-ins against segregation in Birmingham; Bull Connor\'s forceful response (including the arrest of children in the "Children\'s Crusade") drew national media coverage and shifted public opinion. King was jailed during the campaign.',
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'framework',
      title: '"Letter from Birmingham Jail" (1963) — described, not quoted',
      content:
        'Written from jail, responding to clergy urging King to slow down: he argues a law is unjust when it degrades human dignity or is imposed without the affected group\'s voice, defends nonviolent direct action as necessary because negotiation had failed (creating a crisis that forces a resistant community to negotiate), and criticizes moderates who prioritize order over the substance of justice.',
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'event',
      title: 'the March on Washington (August 1963)',
      content:
        'A coalition (SCLC, SNCC, NAACP, CORE, the Urban League, allied unions) marched for "Jobs and Freedom." King\'s address (described, not quoted) built political momentum behind the civil rights legislation passed within the following year.',
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'definition',
      title: 'Civil Rights Act (1964) and Voting Rights Act (1965)',
      content:
        'The 1964 Act barred discrimination in employment (Title VII) and public accommodations, reaching PRIVATE conduct the Equal Protection Clause alone could not. The 1965 Act, passed after the violently suppressed Selma march ("Bloody Sunday"), banned literacy tests and authorized federal oversight of voting in discriminatory jurisdictions.',
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'event',
      title: "the movement's northern shift and Black Power",
      content:
        'After 1965, attention turned to Northern housing/employment discrimination and de facto segregation, contributing to unrest in cities like Watts (1965) and Detroit/Newark (1967). Stokely Carmichael (SNCC) popularized "Black Power" (1966); Malcolm X (described, not quoted) argued for self-defense and independent Black economic/political power before his 1965 assassination.',
    },
    {
      loId: 'apush.civil-rights-movement',
      kind: 'trap',
      title: 'not one organization, not one strategy',
      content:
        'The movement combined the NAACP\'s litigation strategy, SCLC\'s nonviolent direct action, SNCC\'s student organizing (later shifting toward Black Power), and CORE\'s direct action — sometimes cooperating (March on Washington), sometimes disagreeing sharply over pace and method.',
    },
  ],
  methods: [
    {
      title: 'Explain why a landmark ruling was "only the beginning" of a movement',
      when_to_use:
        'Use when a prompt asks why a Supreme Court decision (like Brown) did not, by itself, end the discrimination it addressed.',
      steps: [
        'STATE WHAT THE RULING ACTUALLY DECIDED (the specific legal principle and its scope — e.g. public schools only).',
        'IDENTIFY WHAT IT DID NOT DECIDE OR ENFORCE (an implementation timeline, other forms of discrimination, private conduct).',
        'NAME THE SPECIFIC RESISTANCE OR GAP that followed (e.g. "massive resistance," a governor defying a court order).',
        'CONNECT TO THE ORGANIZING/LEGISLATION THAT FOLLOWED to close that gap.',
      ],
      example: {
        problem: 'Why was Brown v. Board (1954) only the beginning of the civil rights movement?',
        solution:
          'Brown decided only that segregated public schools violate Equal Protection — it set no enforcement timeline and said nothing about transportation, lunch counters, employment, or voting. Years of resistance (Little Rock, 1957) and a decade of further organizing (Montgomery, sit-ins, Freedom Rides, Birmingham, the March on Washington) were needed to convert the ruling into changed practice and new federal statutes (1964, 1965).',
      },
      relatedLoIds: ['apush.civil-rights-movement'],
    },
  ],
  pointers: [
    { content: 'Brown (1954) is a ruling about PUBLIC SCHOOLS and GOVERNMENT action — it did not reach private businesses; that required the Civil Rights Act of 1964.', kind: 'trap' },
    { content: 'Never quote MLK\'s speeches or the Letter from Birmingham Jail directly — describe the argument structure in your own words (copyright).', kind: 'gotcha' },
    { content: 'Sequence for the AP exam: Brown (1954) → Montgomery (1955-56) → Little Rock (1957) → sit-ins/Freedom Rides (1960-61) → Birmingham (1963) → March on Washington (1963) → CRA (1964) → VRA (1965).', kind: 'tip' },
    { content: 'Black Power (1966+) is a PARALLEL current, not a replacement for nonviolent integrationism — both existed within "the movement" at once.', kind: 'trap' },
    { content: 'The Voting Rights Act followed Selma\'s "Bloody Sunday" — a good specific-evidence pairing for SAQ (b) parts.', kind: 'frq-vocab' },
  ],
};
