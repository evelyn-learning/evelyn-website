/**
 * AP Macroeconomics — Unit 3 CED 3.9: Automatic Stabilizers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.automatic-stabilizers.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.automatic-stabilizers.v1' }],
  theory: [
    { loId: 'apmacro.automatic-stabilizers', content: `AUTOMATIC STABILIZERS: features of the government budget that adjust COUNTER-CYCLICALLY WITHOUT any new legislation. They soften business-cycle swings as a built-in property of how taxes and transfer programs are designed.` },
    { loId: 'apmacro.automatic-stabilizers', content: `THE LITMUS TEST vs discretionary policy: DID CONGRESS HAVE TO VOTE? New stimulus bill, tax-rate change → DISCRETIONARY. Revenue falling because incomes fell, UI payouts rising because layoffs rose → AUTOMATIC. Both are fiscal policy.` },
    { loId: 'apmacro.automatic-stabilizers', content: `PROGRESSIVE INCOME TAXES as a stabilizer: rates rise with income. In RECESSION, incomes fall → households slide into lower brackets → average tax rate falls → disposable income falls LESS than gross income → C and AD fall less. In EXPANSION, the reverse — a rising average tax rate damps AD growth.` },
    { loId: 'apmacro.automatic-stabilizers', content: `UNEMPLOYMENT INSURANCE (UI): layoffs rise in recession → UI payouts expand automatically under existing eligibility rules. Recipients spend most of it on essentials (high MPC), cushioning C and AD. In recovery, payouts shrink on their own — automatically tightening the fiscal stance.` },
    { loId: 'apmacro.automatic-stabilizers', content: `MEANS-TESTED TRANSFERS (SNAP/food stamps, Medicaid, TANF): eligibility expands when incomes fall and contracts when they rise — the same counter-cyclical pattern as UI, no legislation needed.` },
    { loId: 'apmacro.automatic-stabilizers', content: `CORPORATE INCOME TAX as a cyclical-revenue stabilizer: profits fall sharply in recessions, so corporate tax revenue falls MORE than proportionally to GDP — an automatic fiscal loosening in downturns.` },
    { loId: 'apmacro.automatic-stabilizers', content: `WHY ECONOMISTS FAVOR STABILIZERS over discretionary action: (1) NO LAGS — they respond in real time, while discretionary policy suffers recognition, legislative, and implementation lags; (2) NO POLITICAL FRICTION — they work through gridlock; (3) SELF-REVERSING — they tighten automatically in recovery, avoiding hard-to-remove stimulus and chronic deficits; (4) SCALED TO NEED — the response is proportional to the downturn's size.` },
    { loId: 'apmacro.automatic-stabilizers', content: `LIMITATION: stabilizers SOFTEN cycles; they do not fully OFFSET them. The recession that occurs with stabilizers is shallower than without, but the gap does not close by itself — severe downturns may still call for discretionary policy.` },
    { loId: 'apmacro.automatic-stabilizers', content: `SIDE EFFECT TO EXPECT ON EXAMS: in a recession the budget deficit AUTOMATICALLY widens (revenue falls, transfers rise) even with zero policy change. A widening deficit during a downturn is not itself evidence of discretionary stimulus.` },
    { loId: 'apmacro.automatic-stabilizers', kind: 'definition', title: 'automatic stabilizer', content: `a budget feature that adjusts counter-cyclically without new legislation.` },
    { loId: 'apmacro.automatic-stabilizers', kind: 'definition', title: 'progressive tax', content: `a tax whose average rate rises with income; produces counter-cyclical revenue swings.` },
  ],
  methods: [
    {
      title: 'Classify a fiscal event: automatic stabilizer vs discretionary policy',
      steps: [
        `STEP 1 — ASK: did the change require NEW LEGISLATION (a vote), or did it flow from EXISTING program rules and tax structure?`,
        `STEP 2 — Vote/new law (stimulus package, rate change, new program) → DISCRETIONARY.`,
        `STEP 3 — Built-in response (revenue moving with incomes, UI/SNAP enrollment moving with conditions) → AUTOMATIC.`,
        `STEP 4 — JUSTIFY with the mechanism: name the program design feature (progressive brackets, eligibility rules) that produced the change without action.`,
      ],
      example: {
        problem: `Classify: (a) a seven-hundred-billion-dollar stimulus bill after a recession; (b) tax revenue falling ten percent in a recession under progressive rates; (c) UI payouts more than doubling in a downturn; (d) Congress voting a three-point income-tax-rate cut; (e) SNAP enrollment doubling in a slump.`,
        solution: `(a) DISCRETIONARY — new legislation. (b) AUTOMATIC — built-in bracket structure, no vote. (c) AUTOMATIC — existing eligibility rules expand payouts. (d) DISCRETIONARY — requires a vote. (e) AUTOMATIC — means-tested eligibility expands on its own.`,
      },
      relatedLoIds: ['apmacro.automatic-stabilizers'],
    },
  ],
  pointers: [
    { content: 'Litmus test: did Congress vote? Yes → discretionary. No → automatic stabilizer.', kind: 'tip' },
    { content: 'The big three stabilizers: progressive income taxes, unemployment insurance, means-tested transfers.', kind: 'tip' },
    { content: 'Advantages over discretionary: no lags, no politics, self-reversing, scaled to the downturn.', kind: 'tip' },
    { content: 'Stabilizers SOFTEN recessions; they do not close the gap — deep slumps may still need discretionary action.', kind: 'tip' },
    { content: 'Deficits widen automatically in recessions — not proof of any discretionary stimulus.', kind: 'tip' },
  ],
};
