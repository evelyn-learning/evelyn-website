/**
 * Grades 3-5 Social Studies — State Governments.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_STATE_GOVERNMENTS: LessonPlan = {
  id: 'evelyn.g35.ss.state-governments.v1',
  title: 'Grades 3-5 SS — State Governments',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.state-governments',
      description: 'Identify the structure and powers of state governments; distinguish state from federal authority.',
      standard: 'NCSS 3-5 Power, Authority, Governance',
    },
  ],
  prerequisites: ['g35.ss.constitution-intro'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'You live in BOTH a state AND the United States — and each has its own government with its own jobs.',
      script: 'Texas. California. Vermont. Each is a STATE, with its own government, laws, and capital. The United States as a whole has the FEDERAL government. Two layers, working together. Today we drill what each does.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-state-gov',
      kind: 'concept',
      goal: 'State structure + state powers + federalism.',
      keyIdeas: [
        'STATE GOVERNMENT MIRROR FEDERAL: each state has 3 branches (executive, legislative, judicial).',
        'EXECUTIVE: GOVERNOR (each state\'s "president").',
        'LEGISLATIVE: state legislature — usually two houses (similar to Congress). Examples: Texas Legislature, California State Senate + Assembly.',
        'JUDICIAL: state courts. State Supreme Court is the top.',
        'EACH STATE has a CAPITAL CITY (e.g. Texas → Austin, California → Sacramento, New York → Albany — NOT NYC).',
        'STATE POWERS: education (public schools), driving laws (driver\'s licenses), local police, marriage licences, in-state taxes, state highways.',
        'FEDERAL POWERS: national defence, foreign affairs, currency, federal courts, interstate commerce.',
        'SHARED POWERS: taxation, building roads, education funding (both contribute).',
        'FEDERALISM: the system of two layers of government working together.',
        '50 STATES: each has its own constitution AND must follow the US Constitution.',
        'WHEN STATE AND FEDERAL CONFLICT: federal law generally wins (Supremacy Clause).',
      ],
      vocabulary: [
        { term: 'governor', definition: 'the head of a state government.' },
        { term: 'federalism', definition: 'a system where power is divided between national (federal) and state governments.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-power',
      kind: 'worked_example',
      problem: 'Sort these powers — STATE or FEDERAL? "Print money" / "Decide school curriculum" / "Issue driver\'s licences" / "Declare war".',
      steps: [
        '"Print money" → FEDERAL (only the US government can print US currency).',
        '"Decide school curriculum" → STATE (each state sets its own school standards).',
        '"Issue driver\'s licences" → STATE (each state has its own DMV).',
        '"Declare war" → FEDERAL (Congress declares war, not states).',
      ],
      answer: 'Money + war = federal. Schools + licences = state.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Who is the head of a state government — the governor or the president?',
      expectedAnswer: 'The governor. The president heads the federal (national) government, not the state.',
      responseFormat: 'free',
      hints: [
        'President = whole country.',
        'Governor = one state.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-federal',
      kind: 'misconception_check',
      question: 'A child says "the US government does everything." Why is this wrong?',
      commonErrors: [
        {
          answer: 'US government does everything',
          misconception: 'Forgetting the role of state and local governments.',
          correctsTo: 'Most things in everyday life — schools, driving rules, marriage licences, local police, parks — are STATE or LOCAL government responsibilities. The federal government handles bigger-scale things: defence, foreign policy, currency. Both layers work together. Calling 911 reaches local police. Going to school happens through state-funded districts. Renewing a driver\'s license? State.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '50 states, each with own government + capital.',
        '3 branches mirror federal structure: governor, legislature, courts.',
        'State powers: schools, driving, local issues.',
        'Federal powers: defence, currency, foreign affairs.',
        'Federalism = two layers working together.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might 50 states have 50 DIFFERENT sets of laws?',
      hint: 'Each state has different geography, history, economy, and population needs. Texas\'s oil-driven economy needs different laws than Vermont\'s rural one. A coastal state like Florida has hurricane laws Wyoming doesn\'t need. The federalism design lets states experiment — laws that work can spread; bad ideas stay local. It\'s called the "laboratory of democracy".',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
