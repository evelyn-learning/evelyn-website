/**
 * Grades 3-5 Social Studies — US Constitution Intro.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_CONSTITUTION_INTRO: LessonPlan = {
  id: 'evelyn.g35.ss.constitution-intro.v1',
  title: 'Grades 3-5 SS — US Constitution Intro',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.constitution-intro',
      description: 'Identify the purpose of the US Constitution; recognise the three branches of government and the Bill of Rights.',
      standard: 'NCSS 3-5 Power, Authority, Governance',
    },
  ],
  prerequisites: ['g35.ss.american-revolution'],
  followUps: ['g35.ss.state-governments'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'After winning the war, the US needed RULES to govern itself. Those rules became the Constitution.',
      script: 'Independence in 1783 was just the start. The 13 states had to figure out HOW to be a country. They wrote a Constitution in 1787 — a document that\'s still in use today, more than 230 years later. Today we drill its main parts.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-constitution',
      kind: 'concept',
      goal: 'Purpose + structure + branches + Bill of Rights.',
      keyIdeas: [
        'CONSTITUTION: the highest LAW of the United States. Written in 1787, ratified 1788, in use today.',
        'PURPOSE (from the Preamble): "establish justice, ensure domestic tranquillity, provide for the common defence, promote the general welfare, secure the blessings of liberty".',
        'THREE BRANCHES of government:',
        '1) LEGISLATIVE — Congress (Senate + House of Representatives). Makes laws.',
        '2) EXECUTIVE — President. Enforces laws.',
        '3) JUDICIAL — Supreme Court + federal courts. Interprets laws.',
        'CHECKS AND BALANCES: each branch can check the others, so no branch becomes too powerful.',
        'BILL OF RIGHTS: the FIRST 10 AMENDMENTS to the Constitution. Protects individual rights.',
        'KEY RIGHTS: free speech (1st Amendment), right to bear arms (2nd), no unreasonable searches (4th), trial by jury (6th).',
        'AMENDMENTS: the Constitution can be changed. There have been 27 amendments total.',
        'WE THE PEOPLE: the Constitution opens with these words — meaning the government gets its power from citizens.',
      ],
      vocabulary: [
        { term: 'Constitution', definition: 'the highest law of the United States, setting up the government.' },
        { term: 'amendment', definition: 'a change or addition to the Constitution.' },
        { term: 'Bill of Rights', definition: 'the first 10 amendments — protections for individual rights.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-branches',
      kind: 'worked_example',
      problem: 'Match each branch with its job: Legislative, Executive, Judicial. Jobs: makes laws / enforces laws / interprets laws.',
      steps: [
        'LEGISLATIVE → makes laws (Congress writes and passes them).',
        'EXECUTIVE → enforces laws (President carries them out).',
        'JUDICIAL → interprets laws (Supreme Court decides what they mean and if they are constitutional).',
        'Three jobs, three branches, balanced power.',
      ],
      answer: 'Legislative=makes; Executive=enforces; Judicial=interprets.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What is the FIRST AMENDMENT to the Constitution about?',
      expectedAnswer: 'Free speech, freedom of religion, freedom of the press, freedom to assemble, and to petition the government.',
      responseFormat: 'free',
      hints: [
        'It\'s the most famous of the Bill of Rights.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-old-irrelevant',
      kind: 'misconception_check',
      question: 'A child says "the Constitution is too old to matter today." Why is this wrong?',
      commonErrors: [
        {
          answer: 'Old = doesn\'t matter',
          misconception: 'Confusing age with relevance.',
          correctsTo: 'The US Constitution is the LIVING SUPREME LAW. Every modern court case, election, law, and Supreme Court decision still goes back to it. AMENDMENTS allow it to grow with the times — slavery was abolished by the 13th Amendment (1865), women won the vote with the 19th (1920). It\'s old but still very much in use; in fact, lawyers and judges quote it daily.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Constitution = highest law. Written 1787, still in use.',
        'Three branches: Legislative (Congress), Executive (President), Judicial (Supreme Court).',
        'Checks and balances prevent any one branch dominating.',
        'Bill of Rights = first 10 amendments protecting individual rights.',
        'Can be amended (27 amendments so far).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might the writers of the Constitution have included the Bill of Rights?',
      hint: 'Many states wouldn\'t ratify the Constitution UNLESS individual rights were protected. People feared a strong central government could become tyrannical (like Britain had been). The Bill of Rights (added 1791) reassured citizens by guaranteeing freedoms — speech, religion, assembly, fair trials. Without it, the Constitution might not have been adopted.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
