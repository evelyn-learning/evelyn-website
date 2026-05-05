/**
 * Grades 3-5 Social Studies — Citizenship & Rights.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_CITIZENSHIP_RIGHTS: LessonPlan = {
  id: 'evelyn.g35.ss.citizenship-rights.v1',
  title: 'Grades 3-5 SS — Citizenship & Rights',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.citizenship-rights',
      description: 'Identify rights and responsibilities of US citizens; recognise civic participation as foundational to democracy.',
      standard: 'NCSS 3-5 Civic Ideals & Practices',
    },
  ],
  prerequisites: ['g35.ss.constitution-intro'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Citizens have RIGHTS — but also RESPONSIBILITIES.',
      script: 'A citizen of the United States has certain rights — to speak freely, to vote when old enough, to a fair trial. But citizens ALSO have responsibilities — to follow laws, pay taxes, serve on juries, vote, help the community. Today we drill both sides.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-citizenship',
      kind: 'concept',
      goal: 'Rights + responsibilities + ways to participate.',
      keyIdeas: [
        'CITIZEN: a member of a country with rights and responsibilities under its government.',
        'WAYS TO BECOME A US CITIZEN: born in the US (or to US parents abroad), or NATURALIZED (immigrant who passes a test and oath ceremony).',
        'KEY RIGHTS (from the Bill of Rights and other amendments):',
        '1) Free speech (1st Amendment).',
        '2) Freedom of religion.',
        '3) Right to a fair trial (6th Amendment).',
        '4) Right to vote (when 18, with the 26th Amendment).',
        '5) Equal protection (14th Amendment).',
        'KEY RESPONSIBILITIES:',
        '1) Obey laws.',
        '2) Pay taxes.',
        '3) Serve on juries when called.',
        '4) Register for selective service (men age 18-25).',
        '5) Vote in elections (when of age).',
        'GOOD CITIZENSHIP also includes: helping neighbours, volunteering, staying informed, respecting others\' rights.',
        'KIDS CAN PARTICIPATE: writing letters to leaders, learning about issues, helping the community, voting in school elections.',
      ],
      vocabulary: [
        { term: 'citizen', definition: 'a member of a country with rights and responsibilities under its laws.' },
        { term: 'naturalize', definition: 'become a citizen of a country one was not born in.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rights-responsibilities',
      kind: 'worked_example',
      problem: 'Sort these into RIGHTS or RESPONSIBILITIES: "speak freely" / "obey laws" / "vote at 18" / "pay taxes" / "fair trial".',
      steps: [
        'RIGHTS (things citizens are entitled to): speak freely, vote at 18, fair trial.',
        'RESPONSIBILITIES (things citizens must do): obey laws, pay taxes.',
        'Notice: rights and responsibilities work TOGETHER. Without responsibilities (like obeying laws), the system that protects everyone\'s rights breaks down.',
      ],
      answer: 'Rights: speak freely, vote, fair trial. Responsibilities: obey laws, pay taxes.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name TWO ways a kid (under 18) can be a good citizen.',
      expectedAnswer: 'Volunteer at a community event. Help a neighbour. Pick up litter. Stay informed about local issues. Treat people fairly. Follow school and family rules.',
      responseFormat: 'free',
      hints: [
        'You don\'t need to be 18 to contribute.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-rights-only',
      kind: 'misconception_check',
      question: 'A child says "I have rights but no responsibilities since I\'m a kid." Why is this incomplete?',
      commonErrors: [
        {
          answer: 'Kids = rights only',
          misconception: 'Treating responsibility as something only adults have.',
          correctsTo: 'Even kids have responsibilities: follow rules, treat others kindly, help when you can. Citizenship is a habit you start young. Adults take on more legal responsibilities (jury duty, taxes, voting), but the everyday muscles of citizenship — fairness, helpfulness, respecting rules — start in childhood. You\'re building your citizen self every day.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Citizen = has rights AND responsibilities.',
        'Rights: speech, religion, fair trial, voting, equal protection.',
        'Responsibilities: laws, taxes, juries, voting.',
        'Good citizens also volunteer + stay informed.',
        'Kids can be good citizens too.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is VOTING called the most important civic responsibility?',
      hint: 'Voting is how citizens choose their leaders and shape their laws. In a democracy, government gets its power from citizens. Voting is how you make that power real. Issues at every level — schools, taxes, environment, foreign policy — depend on who gets elected. People who don\'t vote let others choose for them. That\'s why voting (and informed voting) is treated as a cornerstone responsibility.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
