/**
 * AP Gov — Civil Liberties and Civil Rights.
 *
 * 1st Amendment cases, due process, equal protection, selective incorporation.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_GOV_CIVIL_LIBERTIES: LessonPlan = {
  id: 'evelyn.ap.gov.civil-liberties.v1',
  title: 'Civil Liberties and Civil Rights',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'civics',
  locale: 'en',
  los: [
    {
      id: 'apgov.civil-liberties',
      description: 'Distinguish civil liberties from civil rights and apply key Supreme Court cases on speech, religion, due process, and equal protection.',
      standard: 'AP-GOV-3',
    },
  ],
  prerequisites: ['apgov.constitution'],
  followUps: ['apgov.judicial'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Liberties vs rights — two related but distinct concepts.',
      script: 'You\'ll hear "civil liberties" and "civil rights" used interchangeably, but they\'re not the same. Civil LIBERTIES protect you from the government — speech, religion, due process. Civil RIGHTS protect you from discrimination — equal treatment under the law. Both come from the Constitution, but they answer different questions: what can\'t the government do TO me, vs what must the government NOT TOLERATE being done to me.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cases',
      kind: 'concept',
      goal: 'Key cases and the principle of selective incorporation.',
      keyIdeas: [
        'CIVIL LIBERTIES: protections from government overreach (1st-8th Amendments).',
        'CIVIL RIGHTS: protections from discrimination (14th Amendment Equal Protection Clause).',
        'SELECTIVE INCORPORATION: the 14th Amendment\'s due-process clause is used by the Supreme Court to apply Bill of Rights protections to STATES (originally only restricted the federal government). Done case-by-case over the 20th century.',
        'SPEECH: Schenck v. US (1919) — "clear and present danger" — speech that creates real risk can be restricted. Tinker v. Des Moines (1969) — students don\'t shed 1st Amendment rights at school; symbolic speech (armbands) protected.',
        'RELIGION: 1st Amendment has TWO clauses. ESTABLISHMENT (no government religion) → Engel v. Vitale (1962) banned school-sponsored prayer. FREE EXERCISE (you may practice your religion) → Wisconsin v. Yoder (1972) Amish exempt from compulsory schooling beyond 8th grade.',
        'DUE PROCESS: 5th and 14th amendments. PROCEDURAL = how government acts (fair trial). SUBSTANTIVE = what government can do (privacy). Gideon v. Wainwright (1963) — right to attorney for accused who can\'t afford one. Roe v. Wade (1973) → overturned by Dobbs (2022).',
        'EQUAL PROTECTION: 14th Amendment. Brown v. Board (1954) — separate is inherently unequal; ended legal segregation in schools. Loving v. Virginia (1967) — bans on interracial marriage struck down. Obergefell v. Hodges (2015) — same-sex marriage nationwide.',
        '2ND AMENDMENT: McDonald v. Chicago (2010) incorporated 2nd against the states. DC v. Heller (2008) recognized individual right.',
      ],
      vocabulary: [
        { term: 'selective incorporation', definition: 'using the 14th Amendment to apply Bill of Rights protections to state governments.' },
        { term: 'establishment clause', definition: 'forbids the government from setting up an official religion or favoring one.' },
        { term: 'free exercise clause', definition: 'protects individuals\' right to practice their religion.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-tinker',
      kind: 'worked_example',
      problem: 'Explain how Tinker v. Des Moines (1969) applied the 1st Amendment to a public school.',
      steps: [
        'FACTS: Students wore black armbands to protest Vietnam War. School suspended them.',
        'ISSUE: Does the 1st Amendment protect students\' symbolic speech in public schools?',
        'HOLDING: Yes — students "do not shed their constitutional rights at the schoolhouse gate."',
        'STANDARD: Schools may restrict speech only if it would substantially disrupt learning. Black armbands didn\'t cause disruption.',
        'IMPACT: Established that public-school students retain free-speech rights, with the "substantial disruption" test for restrictions.',
        'NOTE: The 1st Amendment originally restricted only the federal government — Tinker is a SELECTIVE INCORPORATION case applying it to a state-run school via the 14th Amendment.',
      ],
      answer: 'Tinker held that public-school students retain 1st Amendment rights, restrictable only when speech would substantially disrupt learning.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which Supreme Court case established the right to court-appointed counsel for criminal defendants who can\'t afford an attorney?',
      expectedAnswer: 'Gideon v. Wainwright (1963)',
      responseFormat: 'free',
      hints: [
        '1963 case. Gideon represented himself, lost, then wrote a hand-written petition from prison.',
        'Applied 6th Amendment to states via 14th.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rights-vs-liberties',
      kind: 'misconception_check',
      question: 'Are voting rights protected by civil LIBERTIES or civil RIGHTS?',
      commonErrors: [
        {
          answer: 'civil liberties',
          misconception: 'Lumping all constitutional protections under "liberties".',
          correctsTo: 'Civil RIGHTS. Civil liberties protect you FROM government action (speech, religion, due process). Civil rights protect you from DISCRIMINATION in voting, employment, housing, education. Voting rights legislation (15th, 19th, 24th, 26th amendments + Voting Rights Act of 1965) falls under civil rights — they\'re about ensuring EQUAL access to the ballot, not protecting you from government interference per se.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Civil liberties = protections FROM government. Civil rights = protections from discrimination.',
        'Selective incorporation: 14th Amendment applies Bill of Rights to states case-by-case.',
        'Key cases: Tinker (student speech), Engel (no school prayer), Gideon (right to counsel), Brown (school segregation), Roe → Dobbs.',
        'Two religion clauses: Establishment (no official religion) and Free Exercise (you may practice).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why was Brown v. Board (1954) such a major civil rights case beyond just schools?',
      hint: 'It overturned Plessy v. Ferguson (1896) "separate but equal" doctrine for the first time. The reasoning — separate facilities are inherently unequal — extended beyond schools to all government-mandated segregation. The decision triggered massive resistance, the Civil Rights Movement, and eventually the Civil Rights Act of 1964.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
