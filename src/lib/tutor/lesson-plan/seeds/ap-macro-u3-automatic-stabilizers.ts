/**
 * AP Macroeconomics — CED Unit 3.9: Automatic Stabilizers.
 *
 * Built-in fiscal mechanisms that smooth the business cycle without
 * requiring new legislation: progressive taxes, unemployment insurance,
 * means-tested transfer programs. Briefer plan; AP tests them as the
 * "passive" counterpart to discretionary fiscal policy.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_AUTOMATIC_STABILIZERS: LessonPlan = {
  id: 'evelyn.ap.macro.automatic-stabilizers.v1',
  title: 'Automatic Stabilizers',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.automatic-stabilizers',
      description:
        'Identify the major automatic stabilizers (progressive taxes, unemployment insurance, means-tested transfers), explain how each acts counter-cyclically without new legislation, and distinguish automatic from discretionary fiscal policy.',
      standard: 'AP-MACRO-3.9',
    },
  ],
  prerequisites: ['apmacro.fiscal-policy'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame stabilizers as silent always-on counter-cyclical force.',
      script:
        "When a recession hits, certain parts of the federal budget AUTOMATICALLY soften the blow — without Congress passing a single law. Tax revenue falls because incomes fall. Unemployment-insurance payments rise because more people are jobless. These mechanisms cushion the downturn before discretionary policy can even hold a hearing. They are economists' favorite policy: they work in real time, they don't need political agreement, and they reverse on their own when the economy recovers.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-stabilizers',
      kind: 'concept',
      goal: 'Cover what automatic stabilizers are, how each major one works, and why they are valued.',
      keyIdeas: [
        'AUTOMATIC STABILIZERS: features of the budget that adjust counter-cyclically WITHOUT any new legislative action. They smooth business-cycle fluctuations as a built-in feature of how the budget is structured.',
        'PROGRESSIVE INCOME TAXES: tax rates rise with income. In an EXPANSION, incomes rise → average tax rate rises → people pay a larger share of income in taxes → disposable income grows more slowly than gross income → C grows more slowly → AD growth is dampened. In a RECESSION, incomes fall → average tax rate falls → less of the decline is borne by households → C falls less than gross income → AD decline is dampened. The progressive structure automatically slows expansions and softens recessions.',
        'UNEMPLOYMENT INSURANCE (UI): when unemployment rises in a recession, more people receive UI payments — without Congress passing new legislation. UI replaces some of lost wages; recipients spend most of it; this cushions the fall in C and AD. In recovery, UI payments fall as unemployment falls — automatically tightening the budget.',
        'MEANS-TESTED TRANSFER PROGRAMS (food stamps / SNAP, Medicaid, TANF): eligibility expands when household incomes fall, contracts when incomes rise. Same counter-cyclical structure as UI.',
        'CORPORATE INCOME TAXES (cyclical-revenue effect): corporate profits fall sharply in recessions, so corporate tax revenue falls more than proportionally to GDP. This counter-cyclical revenue swing is a stabilizer effect.',
        'WHY ECONOMISTS LIKE STABILIZERS: (1) NO LAGS — they kick in immediately as conditions change, while discretionary policy faces recognition + legislative + implementation lags. (2) NO POLITICAL FRICTION — no need for Congress. (3) SELF-REVERSING — they automatically tighten as the economy recovers, avoiding the chronic-deficit problem of discretionary stimulus that doesn\'t reverse.',
        'LIMITATIONS: stabilizers SOFTEN cycles but don\'t fully OFFSET them. The depth of the recession that occurs WITH stabilizers is less than what would occur WITHOUT them, but the gap doesn\'t close on its own. Discretionary policy may still be needed for severe downturns.',
        'AP TESTS this distinction: AUTOMATIC stabilizers vs DISCRETIONARY policy. Both are fiscal policy; the difference is whether new legislation is required.',
      ],
      vocabulary: [
        { term: 'automatic stabilizer', definition: 'a budget feature that adjusts counter-cyclically without new legislation.' },
        { term: 'progressive tax', definition: 'a tax in which average rates rise with income; produces counter-cyclical revenue swings.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-stabilizer-tracing',
      kind: 'worked_example',
      problem:
        "Trace how each of the following automatic stabilizers softens a recession. (a) Progressive personal income tax. (b) Unemployment insurance.",
      steps: [
        'STABILIZER (a): PROGRESSIVE INCOME TAX in a recession.',
        '  • Recession hits. Real GDP falls. Household incomes fall (some workers lose jobs; others see wage cuts; bonuses shrink).',
        '  • As incomes fall, households move into LOWER tax brackets. Their average tax rate falls.',
        '  • Disposable income falls by LESS than gross income because the tax burden has eased.',
        '  • Lower disposable-income drop → smaller fall in C → smaller AD reduction → recession is shallower.',
        '  • In recovery, the reverse: incomes rise, average tax rate rises, AD growth is moderated.',
        '',
        'STABILIZER (b): UNEMPLOYMENT INSURANCE in a recession.',
        '  • Recession hits. Layoffs increase. More workers become unemployed.',
        '  • UI program automatically increases payouts to newly-unemployed eligible workers (no Congress needed; it is the program design).',
        '  • Recipients spend most of UI income on essentials (food, rent) — high MPC for UI recipients.',
        '  • UI spending feeds back into C → AD is supported.',
        '  • As recovery proceeds and unemployment falls, UI payments naturally decrease — automatically tightening the fiscal stance.',
        '',
        'BOTH stabilizers operate WITHOUT NEW LEGISLATION. They are baked into the program design. Their effect on AD: they REDUCE the magnitude of the downward shift, softening the recession. Combined with discretionary policy, the recession can be addressed faster and more effectively.',
      ],
      answer: 'Progressive tax: average tax rate falls in recession → disposable income falls less than gross → C and AD cushioned. UI: payouts rise automatically → recipient spending supports C → AD cushioned.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'For each policy action, classify it as AUTOMATIC STABILIZER or DISCRETIONARY FISCAL POLICY. Justify briefly.',
      expectedAnswer:
        '(Sample scenarios — typical AP problem; sample answers below.) (a) "Government enacts a $700B stimulus package after a recession": DISCRETIONARY. New legislation passed; not built into baseline budget. (b) "Tax revenue falls 10% during a recession because of the progressive tax structure": AUTOMATIC. No legislation; revenue change is a built-in feature of progressive rates. (c) "Unemployment-insurance payments rise from $100B to $250B during a recession": AUTOMATIC. The increase is from existing program eligibility, not from new legislation. (d) "Congress votes to cut income tax rates by 3 percentage points": DISCRETIONARY. Legislative action; rate change requires a vote. (e) "SNAP (food stamp) enrollment doubles during a downturn": AUTOMATIC. Eligibility-based program; expanding enrollment does not require new legislation.',
      responseFormat: 'free',
      hints: [
        'Did Congress vote? If yes, discretionary. If no, automatic.',
        'Built into baseline budget vs new legislation.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-economists-like',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Many economists argue that automatic stabilizers should be expanded relative to discretionary fiscal policy. Identify TWO advantages automatic stabilizers have over discretionary policy.',
      expectedAnswer:
        'Two advantages (any two): (1) NO LAGS — automatic stabilizers adjust in real time as economic conditions change. Discretionary policy faces RECOGNITION lag (data is delayed), LEGISLATIVE lag (political negotiation takes months), and IMPLEMENTATION lag (programs take time to deploy). By the time discretionary stimulus reaches the economy, conditions may have changed; automatic stabilizers always hit at the right moment. (2) NO POLITICAL FRICTION — no need for Congressional agreement. Stabilizers are baked into existing programs. Even when government is gridlocked, stabilizers function. Discretionary policy can be blocked or watered down by political disagreement, especially in divided governments. (3) SELF-REVERSING — when the economy recovers, stabilizers automatically tighten (revenue rises, UI claims fall). Discretionary stimulus can be hard to remove because beneficiaries lobby to keep programs; this contributes to chronic deficits. (4) SCALED TO NEED — stabilizers respond proportionally to the downturn (more unemployment → more UI; bigger income drop → bigger tax-burden relief). Discretionary policy is one-shot and can be miscalibrated. Strong answers cite specific advantages — speed, political ease, automatic reversal, proportional response — and explain WHY each matters.',
      responseFormat: 'frq',
      hints: [
        'What problems does discretionary policy face that stabilizers avoid?',
        'Compare on speed, political process, and reversal.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Automatic stabilizers: counter-cyclical adjustments WITHOUT legislation.',
        'Major examples: progressive income tax, unemployment insurance, means-tested transfers (SNAP, Medicaid).',
        'They SOFTEN cycles, do not fully offset them.',
        'Advantages over discretionary: no lags, no political friction, self-reversing, proportional to need.',
        'Both discretionary policy AND stabilizers are types of fiscal policy.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.9',
    cedTitle: 'Automatic Stabilizers',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '17', note: 'OpenStax Macro AP — automatic stabilizers, no-legislation feature.' },
    ],
  },
};
