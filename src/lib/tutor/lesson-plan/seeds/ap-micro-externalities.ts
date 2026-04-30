/**
 * AP Microeconomics — Externalities and public goods.
 *
 * Market failures: when markets don\'t allocate efficiently.
 * Solutions: taxes, subsidies, regulation.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MICRO_EXTERNALITIES: LessonPlan = {
  id: 'evelyn.ap.micro.externalities-public-goods.v1',
  title: 'Externalities and public goods',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'apmicro.externalities',
      description: 'Identify externalities and public goods and analyze government interventions.',
      standard: 'AP-MICRO-6.1',
    },
  ],
  prerequisites: ['apmicro.ppc'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why "the market" sometimes fails.',
      script: 'A factory dumps pollution into a river. Local fishermen lose their catch. The factory pays nothing for the damage. This is an EXTERNALITY — and it\'s a place where free markets fail to allocate efficiently. Today: when markets break, and how to fix them.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types-fixes',
      kind: 'concept',
      goal: 'Externalities + public goods + government solutions.',
      keyIdeas: [
        'EXTERNALITY: a cost or benefit affecting a THIRD PARTY who didn\'t choose it.',
        '  NEGATIVE externality: pollution, secondhand smoke, traffic. Producer doesn\'t pay full social cost; OVER-produced.',
        '  POSITIVE externality: vaccines (you protect others too), education, R&D. Producer doesn\'t capture full social benefit; UNDER-produced.',
        'SOCIALLY OPTIMAL quantity differs from MARKET quantity when externalities exist.',
        'SOLUTIONS for negative externalities:',
        '  Pigouvian TAX: tax the activity equal to its external cost. Carbon tax, cigarette tax.',
        '  REGULATION: set limits (EPA emissions caps).',
        '  CAP-AND-TRADE: limit total emissions, let firms trade permits. Market-based regulation.',
        'SOLUTIONS for positive externalities:',
        '  SUBSIDY: government pays part of the cost. Vaccine programs, R&D credits.',
        '  GOVERNMENT PROVISION: schools, libraries.',
        'PUBLIC GOODS: NON-EXCLUDABLE (can\'t prevent anyone from using) and NON-RIVAL (one person\'s use doesn\'t reduce others\'). National defense, lighthouses, fireworks.',
        'FREE-RIDER PROBLEM: people benefit from public goods without paying. Markets under-provide. Government must step in (funded by taxes).',
        'COMMON-POOL RESOURCES: rival but not excludable (fisheries, atmosphere). Tend to be over-used (Tragedy of the Commons).',
      ],
      vocabulary: [
        { term: 'externality', definition: 'a cost or benefit affecting a third party who didn\'t choose it.' },
        { term: 'public good', definition: 'a good that is non-excludable and non-rival.' },
        { term: 'free-rider problem', definition: 'people benefiting from a good without paying.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pollution',
      kind: 'worked_example',
      problem: 'A coal plant produces electricity at $0.05/kWh. It also creates $0.03/kWh in environmental damage. Why is unrestricted output INEFFICIENT, and what fix works?',
      steps: [
        'Plant\'s PRIVATE cost: $0.05/kWh. PRIVATE incentive: produce as much as buyers want at that price.',
        'TRUE social cost: $0.05 + $0.03 (externality) = $0.08/kWh.',
        'Unrestricted: plant produces too much because it doesn\'t pay $0.03 in damages → overuse, more pollution than socially optimal.',
        'PIGOUVIAN TAX = $0.03/kWh: now the plant pays the true social cost. Output adjusts to socially optimal.',
        'OR cap-and-trade: limit total emissions, let plants trade allowances within the cap.',
        'OR direct regulation: emission limits per kWh.',
        'All three internalize the externality — make the polluter face the true cost.',
      ],
      answer: 'Pigouvian tax of $0.03/kWh internalizes the externality',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why are public goods (like national defense) usually provided by GOVERNMENT, not markets?',
      expectedAnswer: 'free-rider problem — people benefit without paying, so private markets under-provide',
      responseFormat: 'free',
      hints: [
        'Public goods are non-excludable.',
        'Why would anyone PAY if they get the benefit anyway?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pollution-illegal',
      kind: 'misconception_check',
      question: 'Is the solution to pollution simply to MAKE IT ILLEGAL?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'All-or-nothing regulation.',
          correctsTo: 'Not always best. Some pollution is unavoidable in essential industries (electricity, transport). The economic question is: what\'s the OPTIMAL level (where marginal cost = marginal benefit)? Pigouvian taxes set the right INCENTIVE; outright bans may impose huge costs without commensurate benefit.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Externality: cost/benefit on third party not chosen.',
        'Negative → market over-produces. Positive → market under-produces.',
        'Pigouvian tax / regulation / cap-and-trade for negatives. Subsidy / provision for positives.',
        'Public goods: non-excludable + non-rival. Free-rider problem → government provision.',
        'Common-pool resources can collapse without rules (tragedy of the commons).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Climate change is a global externality. What makes it especially hard to solve?',
      hint: 'Externality is GLOBAL — emissions in one country damage others. No global government to enforce a Pigouvian tax. Free-riding tempting at every step. Paris Agreement is voluntary cooperation. Time-scale (decades to centuries) makes political incentives misalign with the problem.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
