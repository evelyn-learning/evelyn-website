/**
 * G4 — Social Studies: Three branches of US government.
 *
 * Legislative makes laws, Executive enforces them, Judicial
 * interprets them. The CHECKS AND BALANCES that keep any one
 * branch from getting too powerful. Anchored on familiar examples
 * — Congress, the President, the Supreme Court.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SS_BRANCHES_OF_GOVERNMENT: LessonPlan = {
  id: 'evelyn.g4.ss.branches-of-government.v1',
  title: 'The Three Branches of US Government',
  curriculum: 'state-standards',
  grade: '4',
  subject: 'social-studies',
  topic: 'civics',
  locale: 'en',
  los: [
    {
      id: 'ss.g4.civics.branches',
      description: 'Identify the three branches of US government and explain how each functions.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a "team of three with different jobs" metaphor to set up branches.',
      script: 'Imagine a board game where one player can write the rules, another can enforce them, and a third can decide what counts as a foul. If one player did all three, they\'d win every game. The Founders set up the US government the same way — three SEPARATE branches, each with one job, so no one branch can take over.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-branches',
      kind: 'concept',
      goal: 'Branch jobs + main institutions + how they check each other.',
      keyIdeas: [
        'LEGISLATIVE branch — MAKES LAWS.',
        '  Institution: CONGRESS, made up of two parts:',
        '    HOUSE OF REPRESENTATIVES — number of seats per state depends on population.',
        '    SENATE — exactly 2 senators per state, regardless of size.',
        'EXECUTIVE branch — ENFORCES LAWS.',
        '  Head: the PRESIDENT (with the Vice President and Cabinet).',
        '  Manages federal agencies, signs treaties, commands the military.',
        'JUDICIAL branch — INTERPRETS LAWS (decides what they mean and whether they\'re constitutional).',
        '  Top court: the SUPREME COURT (9 Justices).',
        'CHECKS AND BALANCES — each branch can limit the others:',
        '  Congress writes laws — but the PRESIDENT can VETO them.',
        '  Congress can OVERRIDE a veto with a 2/3 majority.',
        '  The Supreme Court can strike down laws as UNCONSTITUTIONAL.',
        '  The President nominates Justices, but Senate must CONFIRM them.',
        'No branch can do everything alone. They have to cooperate (or compromise) to get things done.',
      ],
      vocabulary: [
        { term: 'legislative', definition: 'the law-making branch — Congress.' },
        { term: 'executive', definition: 'the law-enforcing branch — the President.' },
        { term: 'judicial', definition: 'the law-interpreting branch — the courts.' },
        { term: 'veto', definition: 'the President\'s power to reject a law passed by Congress.' },
        { term: 'checks and balances', definition: 'the system that lets each branch limit the others.' },
      ],
      suggestedTools: ['show_concept_map', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-which-branch',
      kind: 'worked_example',
      problem: 'For each event, name the branch: (a) Congress passes a law about national parks. (b) The President signs the law. (c) Someone challenges the law in court, and the Supreme Court rules on it.',
      steps: [
        '(a) "Passes a law" → LEGISLATIVE (Congress).',
        '(b) "Signs the law" → EXECUTIVE (President carries out / enforces, also signs new laws).',
        '(c) "Rules on" the law → JUDICIAL (Supreme Court interprets).',
        'Notice all three branches were involved with the same law — that\'s normal.',
      ],
      answer: 'Legislative, Executive, Judicial',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'The President nominates a Supreme Court Justice. The Senate has to confirm or reject the nomination. Which branch is checking the other?',
      expectedAnswer: 'Legislative checking Executive',
      responseFormat: 'free',
      hints: [
        'The Senate is part of Congress = legislative.',
        'The President\'s pick gets reviewed by the legislative branch.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-president-makes-laws',
      kind: 'misconception_check',
      question: 'Sage says "The President makes the laws." Right?',
      commonErrors: [
        {
          answer: 'yes — they sign laws',
          misconception: 'Confusing signing/enforcing with making.',
          correctsTo: 'Wrong. CONGRESS makes laws (legislative branch). The President can sign or veto laws Congress passes — but the President doesn\'t WRITE laws. The Founders specifically separated these jobs so one person couldn\'t both make and enforce the rules.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three branches: Legislative (Congress) makes laws. Executive (President) enforces. Judicial (courts) interprets.',
        'Congress = House + Senate. House by population, Senate 2 per state.',
        'Veto / override / confirmation / unconstitutional ruling = checks and balances.',
        'No branch can act alone — designed to require cooperation.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the Founders separate these powers instead of giving one person the whole job?',
      hint: 'They\'d just escaped a king (George III) who had all three powers and used them harshly. Separation was a safeguard against tyranny.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
