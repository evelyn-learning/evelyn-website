/**
 * Grades 6-8 Social Studies — Economic Systems Intro.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_SS_ECONOMIC_SYSTEMS: LessonPlan = {
  id: 'evelyn.g68.ss.economic-systems.v1',
  title: 'Grades 6-8 SS — Economic Systems',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ss',
  topic: 'g68-ss',
  locale: 'en',
  los: [
    {
      id: 'g68.ss.economic-systems',
      description: 'Identify market, command, and mixed economic systems; recognise their trade-offs.',
      standard: 'NCSS 6-8 Production, Distribution, Consumption',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Every society has to answer THREE economic questions — and how it answers them defines its system.',
      script: 'Three big questions every society must answer: WHAT to produce? HOW to produce it? FOR WHOM to produce? Different countries answer differently. Today we drill the systems and trade-offs.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-systems',
      kind: 'concept',
      goal: 'Three systems + characteristics + real-world examples.',
      keyIdeas: [
        'THREE BASIC QUESTIONS: 1) WHAT goods/services to produce? 2) HOW to produce them? 3) FOR WHOM (who gets them)?',
        'MARKET ECONOMY: businesses and consumers decide via supply and demand. Government has limited role. Pros: efficient, encourages innovation. Cons: inequality, can ignore those who can\'t pay. Example: very pure market economies are rare; closest examples include Hong Kong historically.',
        'COMMAND ECONOMY: government decides what to produce, how, for whom. Pros: can mobilise quickly, control inequality. Cons: inefficient, weak innovation, often shortages. Examples: USSR (1917-1991), North Korea, Cuba.',
        'TRADITIONAL ECONOMY: customs and traditions decide. Often subsistence farming, barter. Pros: stable, environmentally light. Cons: slow change, hard to scale. Examples: parts of Indigenous communities.',
        'MIXED ECONOMY: combines market and government. Most countries today are mixed.',
        'US is mostly market with government roles (regulation, public schools, military, social security). Sweden is more government-heavy but still market. China is officially communist but has large market sector.',
        'CAPITALISM: economic system where private individuals/companies own the means of production. Often paired with market economies.',
        'SOCIALISM: economic system where the state or community owns means of production. Often paired with command or heavily regulated mixed economies.',
        'TRADE-OFFS: efficiency vs equality, innovation vs stability, freedom vs security. No system is perfect.',
        'IN PRACTICE: every modern economy is MIXED — the question is the proportion of market vs government.',
      ],
      vocabulary: [
        { term: 'market economy', definition: 'an economic system where supply and demand drive decisions, with limited government control.' },
        { term: 'command economy', definition: 'an economic system where the government makes economic decisions.' },
        { term: 'mixed economy', definition: 'an economy that combines market and government features.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-system',
      kind: 'worked_example',
      problem: 'Why do most modern countries have MIXED economies rather than pure market or pure command?',
      steps: [
        'PURE MARKET problems: doesn\'t handle inequality well; some markets fail (e.g. pollution, monopolies); doesn\'t fund "public goods" like roads, military, parks.',
        'PURE COMMAND problems: terrible at innovation, often shortages, depends on perfect government decisions (impossible).',
        'MIXED gets BENEFITS of both: market efficiency for most goods + government for things markets can\'t handle (defence, education, regulation).',
        'Practical answer: every successful economy mixes. Debate is about the BALANCE — more market or more government?',
      ],
      answer: 'Mixed combines market efficiency with government safety nets and public goods.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Give ONE example of a "public good" that the government provides because the market wouldn\'t do it well.',
      expectedAnswer: 'National defence, roads/highways, public schools, parks, courts, fire departments, lighthouses, basic research. Anything benefiting many people but hard to charge users for individually.',
      responseFormat: 'free',
      hints: [
        'Things everyone uses but can\'t easily be sold individually.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-binary',
      kind: 'misconception_check',
      question: 'A student says "America is capitalism, the USSR was socialism, end of story." Why is this oversimplified?',
      commonErrors: [
        {
          answer: 'Binary capitalism vs socialism',
          misconception: 'Treating economic systems as a yes/no rather than a spectrum.',
          correctsTo: 'In reality, every economy is on a SPECTRUM. The US has Social Security, Medicare, public schools, antitrust laws — government roles socialists endorse. Sweden has private corporations + free markets — more market than the label suggests. China is officially communist but has huge market activity. Reality is mixed; labels (capitalism, socialism) describe DIRECTION, not absolute identity. Smart students think in proportions, not absolutes.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three economic questions: what, how, for whom.',
        'Market: supply/demand decide. Command: government decides. Traditional: custom decides.',
        'All modern economies are MIXED — proportions differ.',
        'Trade-offs: efficiency vs equality, innovation vs stability.',
        'Capitalism / socialism describe direction, not absolutes.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does MARKET FAILURE sometimes JUSTIFY government action?',
      hint: 'Markets work well for most goods but fail in certain cases: 1) MONOPOLIES (one company controls market, gouges customers). 2) EXTERNALITIES (pollution affects people not in the transaction). 3) PUBLIC GOODS (national defence — hard to exclude non-payers). 4) INFORMATION ASYMMETRY (sellers know more than buyers). Government can address these failures with regulation, taxes, or direct provision. The case for some government is precisely WHERE markets fail.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
