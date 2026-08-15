/**
 * G9 — Three branches of US government.
 *
 * Legislative (Congress), Executive (President), Judicial (Courts).
 * What each does, checks and balances.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_CIVICS_THREE_BRANCHES: LessonPlan = {
  id: 'evelyn.g9.civics.three-branches.v1',
  title: 'The three branches of US government',
  curriculum: 'NCSS',
  grade: '9',
  subject: 'ss',
  topic: 'civics',
  locale: 'en',
  los: [
    {
      id: 'ncss.911.civic.branches',
      description: 'Explain the structure and functions of the three branches of government and how they check each other.',
      standard: 'NCSS.D2.Civ.4.9-12',
    },
  ],
  prerequisites: ['ncss.68.civic.constitution'],
  followUps: ['ncss.911.civic.federalism'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame separation of powers as anti-tyranny insurance.',
      script: 'The Framers had just fought a king. They did NOT want one all-powerful person — or even one branch — to rule. So they SPLIT government into three. Each branch can stop the others. That\'s the real reason American government is so slow — it\'s working as designed.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-branches',
      kind: 'concept',
      goal: 'What each branch does and how it\'s checked.',
      keyIdeas: [
        'LEGISLATIVE (Article I): Congress = Senate (100 members, 2 per state) + House of Representatives (435 members, by population). MAKES laws. Controls federal spending ("power of the purse").',
        'EXECUTIVE (Article II): President + Vice President + Cabinet + federal agencies. ENFORCES laws. Commander-in-chief of military. Can VETO laws (Congress can override with 2/3 vote).',
        'JUDICIAL (Article III): Supreme Court + lower federal courts. INTERPRETS laws. JUDICIAL REVIEW — can strike down laws as unconstitutional (established by Marbury v. Madison, 1803).',
        'CHECKS AND BALANCES: each branch has tools to limit the others. President vetoes Congress; Congress overrides veto; Congress impeaches President; courts strike down laws; President nominates judges; Senate confirms (or rejects).',
        'WHY THREE: drawn from Montesquieu\'s "Spirit of the Laws" (1748). Idea: power divided is power restrained. The Framers REALLY didn\'t trust concentrated power.',
      ],
      vocabulary: [
        { term: 'separation of powers', definition: 'splitting government authority among different branches.' },
        { term: 'checks and balances', definition: 'tools each branch has to limit the others.' },
        { term: 'judicial review', definition: 'the courts\' power to strike down laws that violate the Constitution.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-veto-override',
      kind: 'worked_example',
      problem: 'Congress passes a law. The President vetoes it. What can Congress do, and what does it take?',
      steps: [
        'Congress can OVERRIDE the veto.',
        'Override requires a 2/3 vote in BOTH the House and the Senate.',
        '2/3 of 435 (House) = 290 votes minimum. 2/3 of 100 (Senate) = 67 votes minimum.',
        'If both clear that bar, the bill becomes law without the President\'s signature.',
        'Override is RARE — supermajorities are hard to get when parties are divided.',
      ],
      answer: 'override the veto with a 2/3 vote in both chambers',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which branch can declare a law unconstitutional, and what is that power called?',
      expectedAnswer: 'judicial branch; judicial review',
      responseFormat: 'free',
      hints: [
        'Established by Marbury v. Madison in 1803.',
        'The branch that interprets laws holds this power.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equal-power',
      kind: 'misconception_check',
      question: 'Are the three branches always EQUALLY powerful?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating "co-equal" as "always equal in practice".',
          correctsTo: 'They\'re CO-EQUAL by design, but in practice the balance shifts. The presidency has grown stronger over the 20th century (especially in war/crisis). The Court\'s power depends on the era. The system is dynamic — checks and balances aren\'t a frozen state.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Legislative MAKES laws (Congress).',
        'Executive ENFORCES laws (President).',
        'Judicial INTERPRETS laws (Courts).',
        'Each branch CHECKS the other two.',
        'Slow government is a feature, not a bug.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is impeachment a check on the executive — and why is it rarely used?',
      hint: 'House impeaches (charges); Senate convicts (2/3 vote). Hard to get 2/3 — only 3 presidents have been impeached, NONE convicted by the Senate.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
