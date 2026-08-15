/**
 * G11 — Economics: Fiscal and monetary policy.
 *
 * Two main policy levers governments use to influence the economy.
 * FISCAL: Congress + President control taxes and spending. MONETARY:
 * the Fed controls interest rates and money supply. How each is
 * used to fight recession (expansionary) or inflation (contractionary).
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ECON_FISCAL_MONETARY: LessonPlan = {
  id: 'evelyn.g11.ss.econ.fiscal-monetary.v1',
  title: 'Fiscal and Monetary Policy',
  curriculum: 'state-standards',
  grade: '11',
  subject: 'social-studies',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'ss.g11.econ.policy',
      description: 'Distinguish fiscal from monetary policy and explain how each affects the economy.',
    },
  ],
  prerequisites: ['ss.g11.econ.gdp-inflation'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame these as the two main tools government uses to steer the economy.',
      script: 'When the economy slows, who fixes it — Congress or the Federal Reserve? Both, but with different tools. Congress controls FISCAL POLICY: taxes and spending. The Fed controls MONETARY POLICY: interest rates and money supply. Different actors, different speeds, different politics. Understanding both is the key to making sense of economic news.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-fiscal-monetary',
      kind: 'concept',
      goal: 'Definitions, who controls each, expansionary vs contractionary, trade-offs.',
      keyIdeas: [
        'FISCAL POLICY: government TAXING and SPENDING decisions.',
        '  Controlled by: CONGRESS + PRESIDENT (legislation + signing).',
        '  EXPANSIONARY (stimulus): cut taxes OR increase spending. Pump money into the economy. Used in recessions.',
        '  CONTRACTIONARY: raise taxes OR cut spending. Pull money out. Used to fight inflation.',
        '  PROS: targeted (e.g. infrastructure spending creates jobs).',
        '  CONS: SLOW (legislation takes time), POLITICAL (partisan disagreement), can balloon DEFICITS.',
        'MONETARY POLICY: central bank actions affecting INTEREST RATES and MONEY SUPPLY.',
        '  Controlled by: in the US, the FEDERAL RESERVE (the Fed). Independent of Congress.',
        '  Main tool: SETTING the FEDERAL FUNDS RATE — the rate banks charge each other for overnight loans. Ripples through to consumer rates (mortgages, credit cards).',
        '  EXPANSIONARY: LOWER interest rates → cheaper to borrow → more spending and investment → economy heats up.',
        '  CONTRACTIONARY: RAISE interest rates → more expensive to borrow → less spending → economy cools, inflation drops.',
        '  PROS: fast (Fed can act in days), insulated from politics.',
        '  CONS: blunt (affects whole economy), takes 6-18 months for full effect, "pushing on a string" in deep recessions.',
        'WHEN TO USE WHICH:',
        '  RECESSION: both expansionary fiscal + monetary (cut taxes, raise spending; lower rates).',
        '  INFLATION: contractionary monetary mostly (raise rates). Contractionary fiscal politically hard.',
        'THE 2008 financial crisis and 2020 COVID recession both used massive expansionary fiscal AND monetary policy together.',
      ],
      vocabulary: [
        { term: 'fiscal policy', definition: 'government tax and spending decisions affecting the economy.' },
        { term: 'monetary policy', definition: 'central bank actions on interest rates and money supply.' },
        { term: 'Federal Reserve', definition: 'the central bank of the United States.' },
        { term: 'expansionary policy', definition: 'increases economic activity (cut taxes/raise spending; lower rates).' },
        { term: 'contractionary policy', definition: 'decreases economic activity (raise taxes/cut spending; raise rates).' },
      ],
      suggestedTools: ['show_table', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-recession-response',
      kind: 'worked_example',
      problem: 'A recession hits. Unemployment jumps from 5% to 9%. What policy responses might government and Fed each take?',
      steps: [
        'GOAL: stimulate spending, increase demand, reduce unemployment.',
        'FISCAL (Congress + President):',
        '  - Cut taxes (consumers have more money to spend).',
        '  - Increase spending (infrastructure, unemployment benefits — money flows into the economy).',
        '  - May involve a stimulus package.',
        'MONETARY (Fed):',
        '  - LOWER federal funds rate. Cheaper loans → people buy houses / cars; businesses invest.',
        '  - Possibly QUANTITATIVE EASING (Fed buys assets to inject money).',
        'RESULT: more spending, more hiring, GDP and employment recover. Side effect: rising deficits + risk of future inflation.',
      ],
      answer: 'Expansionary fiscal + expansionary monetary',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Inflation is at 8% and rising. What does the Fed likely do?',
      expectedAnswer: 'Raise interest rates (contractionary monetary policy).',
      responseFormat: 'free',
      hints: [
        'High inflation → cool the economy.',
        'Fed\'s tool: interest rates. Direction?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fed-prints',
      kind: 'misconception_check',
      question: 'Sage says "the Fed prints money to fix recessions." Is that accurate?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating "creating money" with literal printing of cash.',
          correctsTo: 'The Fed doesn\'t literally print cash (that\'s the Treasury\'s Bureau of Engraving and Printing). The Fed CREATES MONEY DIGITALLY by buying assets — primarily bonds — from banks. The banks now have more reserves, the money supply expands. It\'s sometimes called "printing money" colloquially, but the mechanics are bond purchases (open market operations), not paper bills.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Fiscal = Congress + President; taxes and spending.',
        'Monetary = the Fed; interest rates and money supply.',
        'Expansionary (cut taxes / raise spending; lower rates) = fight recession.',
        'Contractionary (opposite) = fight inflation.',
        'Fiscal is targeted but slow; monetary is fast but blunt.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the Fed deliberately INDEPENDENT of Congress?',
      hint: 'Politicians have short-term incentives — they\'d cut rates before elections. Long-term price stability requires a body insulated from those pressures. Independent central banks worldwide tend to deliver lower inflation than politically-controlled ones.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
