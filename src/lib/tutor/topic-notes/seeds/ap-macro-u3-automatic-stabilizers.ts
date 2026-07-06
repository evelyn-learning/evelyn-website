/**
 * AP Macroeconomics — Unit 3 CED 3.9: Automatic Stabilizers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.automatic-stabilizers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_AUTOMATIC_STABILIZERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.automatic-stabilizers.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.9',
  cedTitle: 'Automatic Stabilizers',
  planId: 'evelyn.ap.macro.automatic-stabilizers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.automatic-stabilizers.v1' }],
  theory: [
    { loId: 'apmacro.automatic-stabilizers', content: `AUTOMATIC STABILIZERS: features of the budget that adjust counter-cyclically WITHOUT any new legislative action. They smooth business-cycle fluctuations as a built-in feature of how the budget is structured.` },
    { loId: 'apmacro.automatic-stabilizers', content: `PROGRESSIVE INCOME TAXES: tax rates rise with income. In an EXPANSION, incomes rise → average tax rate rises → people pay a larger share of income in taxes → disposable income grows more slowly than gross income → C grows more slowly → AD growth is dampened. In a RECESSION, incomes fall → average tax rate falls → less of the decline is borne by households → C falls less than gross income → AD decline is dampened. The progressive structure automatically slows expansions and softens recessions.` },
    { loId: 'apmacro.automatic-stabilizers', content: `UNEMPLOYMENT INSURANCE (UI): when unemployment rises in a recession, more people receive UI payments — without Congress passing new legislation. UI replaces some of lost wages; recipients spend most of it; this cushions the fall in C and AD. In recovery, UI payments fall as unemployment falls — automatically tightening the budget.` },
    { loId: 'apmacro.automatic-stabilizers', content: `MEANS-TESTED TRANSFER PROGRAMS (food stamps / SNAP, Medicaid, TANF): eligibility expands when household incomes fall, contracts when incomes rise. Same counter-cyclical structure as UI.` },
    { loId: 'apmacro.automatic-stabilizers', content: `CORPORATE INCOME TAXES (cyclical-revenue effect): corporate profits fall sharply in recessions, so corporate tax revenue falls more than proportionally to GDP. This counter-cyclical revenue swing is a stabilizer effect.` },
    { loId: 'apmacro.automatic-stabilizers', content: `WHY ECONOMISTS LIKE STABILIZERS: (1) NO LAGS — they kick in immediately as conditions change, while discretionary policy faces recognition + legislative + implementation lags. (2) NO POLITICAL FRICTION — no need for Congress. (3) SELF-REVERSING — they automatically tighten as the economy recovers, avoiding the chronic-deficit problem of discretionary stimulus that doesn't reverse.` },
    { loId: 'apmacro.automatic-stabilizers', content: `LIMITATIONS: stabilizers SOFTEN cycles but don't fully OFFSET them. The depth of the recession that occurs WITH stabilizers is less than what would occur WITHOUT them, but the gap doesn't close on its own. Discretionary policy may still be needed for severe downturns.` },
    { loId: 'apmacro.automatic-stabilizers', content: `AP TESTS this distinction: AUTOMATIC stabilizers vs DISCRETIONARY policy. Both are fiscal policy; the difference is whether new legislation is required.` },
    { loId: 'apmacro.automatic-stabilizers', kind: 'definition', title: 'automatic stabilizer', content: 'a budget feature that adjusts counter-cyclically without new legislation.' },
    { loId: 'apmacro.automatic-stabilizers', kind: 'definition', title: 'progressive tax', content: `a tax in which average rates rise with income; produces counter-cyclical revenue swings.` },
  ],
  methods: [
    {
      title: 'Worked stabilizer tracing',
      steps: [
        'STABILIZER (a): PROGRESSIVE INCOME TAX in a recession.',
        `  • Recession hits. Real GDP falls. Household incomes fall (some workers lose jobs; others see wage cuts; bonuses shrink).`,
        `  • As incomes fall, households move into LOWER tax brackets. Their average tax rate falls.`,
        `  • Disposable income falls by LESS than gross income because the tax burden has eased.`,
        `  • Lower disposable-income drop → smaller fall in C → smaller AD reduction → recession is shallower.`,
        `  • In recovery, the reverse: incomes rise, average tax rate rises, AD growth is moderated.`,
        '',
        'STABILIZER (b): UNEMPLOYMENT INSURANCE in a recession.',
        '  • Recession hits. Layoffs increase. More workers become unemployed.',
        `  • UI program automatically increases payouts to newly-unemployed eligible workers (no Congress needed; it is the program design).`,
        `  • Recipients spend most of UI income on essentials (food, rent) — high MPC for UI recipients.`,
        '  • UI spending feeds back into C → AD is supported.',
        `  • As recovery proceeds and unemployment falls, UI payments naturally decrease — automatically tightening the fiscal stance.`,
        '',
        `BOTH stabilizers operate WITHOUT NEW LEGISLATION. They are baked into the program design. Their effect on AD: they REDUCE the magnitude of the downward shift, softening the recession. Combined with discretionary policy, the recession can be addressed faster and more effectively.`,
      ],
      example: { problem: `Trace how each of the following automatic stabilizers softens a recession. (a) Progressive personal income tax. (b) Unemployment insurance.`, solution: `Progressive tax: average tax rate falls in recession → disposable income falls less than gross → C and AD cushioned. UI: payouts rise automatically → recipient spending supports C → AD cushioned.` },
      relatedLoIds: ['apmacro.automatic-stabilizers'],
    },
  ],
  pointers: [
    { content: 'Automatic stabilizers: counter-cyclical adjustments WITHOUT legislation.', kind: 'tip' },
    { content: `Major examples: progressive income tax, unemployment insurance, means-tested transfers (SNAP, Medicaid).`, kind: 'tip' },
    { content: 'They SOFTEN cycles, do not fully offset them.', kind: 'tip' },
    { content: `Advantages over discretionary: no lags, no political friction, self-reversing, proportional to need.`, kind: 'tip' },
    { content: 'Both discretionary policy AND stabilizers are types of fiscal policy.', kind: 'tip' },
  ],
};
