/**
 * AP Macroeconomics — Unit 3 CED 3.8: Fiscal Policy.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fiscal-policy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FISCAL_POLICY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.fiscal-policy.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.8',
  cedTitle: 'Fiscal Policy',
  planId: 'evelyn.ap.macro.fiscal-policy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fiscal-policy.v1' }],
  theory: [
    { loId: 'apmacro.fiscal-policy', content: `FISCAL POLICY: government changes in spending (G) or taxes (T) to influence AD. EXPANSIONARY = G up and/or T down → AD right. Used in recession. CONTRACTIONARY = G down and/or T up → AD left. Used to cool overheating.` },
    { loId: 'apmacro.fiscal-policy', content: `EXPANSIONARY FISCAL POLICY MECHANICS: increase in G shifts AD right by spending multiplier × ΔG. Tax cut shifts AD right by |tax multiplier| × ΔT. Combined effects can be calculated and added.` },
    { loId: 'apmacro.fiscal-policy', content: `CONTRACTIONARY FISCAL POLICY: opposite directions. Used when economy is in inflationary gap or when policymakers want to slow inflation.` },
    { loId: 'apmacro.fiscal-policy', content: `CROWDING OUT: when the government borrows to fund deficit spending, it competes with private borrowers in the loanable-funds market. Real interest rates rise; private investment (I) falls; some of the fiscal stimulus is offset. Magnitude of crowding-out varies; it is partial, not total — fiscal policy still has SOME effect, just less than the multiplier alone implies.` },
    { loId: 'apmacro.fiscal-policy', content: `BUDGET DEFICIT (annual): government spending > revenue THIS YEAR. NATIONAL DEBT (cumulative): sum of all past deficits minus surpluses. AP frequently tests this distinction. Deficit is a flow; debt is a stock.` },
    { loId: 'apmacro.fiscal-policy', content: `TIME LAGS limit fiscal-policy precision: (1) RECOGNITION lag — data on GDP/unemployment is reported with delay. (2) LEGISLATIVE lag — Congress is slow to pass spending or tax legislation. (3) IMPLEMENTATION lag — programs take time to start and money to flow. By the time stimulus reaches the economy, the underlying conditions may have changed. This is one reason monetary policy (faster to deploy) often takes the lead in stabilization.` },
    { loId: 'apmacro.fiscal-policy', content: `DISCRETIONARY vs AUTOMATIC: this plan covers DISCRETIONARY fiscal policy — actions requiring new legislation. AUTOMATIC STABILIZERS (next plan) operate without legislation.` },
    { loId: 'apmacro.fiscal-policy', content: `FISCAL MULTIPLIER on AD: the effect on real GDP depends on (i) the size of ΔG and ΔT, (ii) the relevant multipliers (spending vs tax, both function of MPC), (iii) crowding out, (iv) the AD-AS situation (multiplier dampens at full employment when SRAS is steep).` },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'discretionary fiscal policy', content: `changes in government spending or taxes that require legislation; deliberate macro stabilization.` },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'crowding out', content: `reduction in private investment caused by government deficit borrowing pushing up interest rates.` },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'budget deficit', content: 'government spending exceeds revenue in a given year (annual flow).' },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'national debt', content: 'cumulative sum of past deficits minus surpluses (stock).' },
  ],
  methods: [
    {
      title: 'Worked fiscal mix',
      steps: [
        `STEP 1 — MULTIPLIERS. Spending multiplier = 1/(1−0.75) = 4. Tax multiplier = −0.75/0.25 = −3.`,
        `STEP 2 — OPTION (i): ΔG = +$100B → ΔAD = 4 × $100B = +$400B. AD shifts right by $400B.`,
        `STEP 3 — OPTION (ii): ΔT = −$100B → ΔAD = −3 × (−$100B) = +$300B. AD shifts right by $300B.`,
        `STEP 4 — COMPARISON. Option (i) produces a $400B AD shift; option (ii) produces $300B. SAME dollar amount of fiscal action; spending shifts AD by more because the spending multiplier is larger in magnitude (the government dollar enters the cycle in full; only MPC of a tax cut enters initially).`,
        `STEP 5 — CLOSING THE $400B GAP. Option (i) alone closes the gap exactly: ΔAD = $400B = gap. Option (ii) alone closes only $300B of the $400B gap.`,
        `STEP 6 — COMBINED FISCAL MIX. To close the gap exactly with a balanced-budget operation (ΔG = ΔT, both positive — i.e., spending hike financed by tax hike): balanced-budget multiplier = 1, so ΔAD = ΔG. To produce ΔAD = +$400B requires ΔG = $400B and ΔT = $400B. Or alternative: any combination satisfying 4 × ΔG + 3 × |ΔT cut| = $400B. E.g. ΔG = $50B + ΔT = -$67B → ΔAD = 200 + 200 = $400B.`,
        `STEP 7 — CAVEAT: ignored crowding out (would partially offset the AD shift) and assumed price level fixed (true only at deep recessionary gap with flat SRAS). Real-world fiscal-multiplier estimates run 0.5-2.0, often below the textbook value.`,
      ],
      example: { problem: `An economy is in a recessionary gap of $400B (potential = $5.0T, actual = $4.6T). MPC = 0.75. The legislature is considering two options: (i) increase G by $100B, OR (ii) cut taxes by $100B. (a) Compute the AD shift produced by each option. (b) Which option closes more of the gap? (c) What combined fiscal mix would EXACTLY close the gap?`, solution: `Option (i): ΔAD +$400B (closes gap exactly). Option (ii): ΔAD +$300B (closes 75%). Combined balanced-budget G+T of $400B each closes the gap.` },
      relatedLoIds: ['apmacro.fiscal-policy'],
    },
  ],
  pointers: [
    { content: 'Expansionary fiscal: G up and/or T down → AD right. For recessions.', kind: 'tip' },
    { content: 'Contractionary fiscal: G down and/or T up → AD left. For overheating.', kind: 'tip' },
    { content: 'Spending multiplier > |tax multiplier|. ΔG hits harder dollar-for-dollar.', kind: 'tip' },
    { content: `Crowding out: deficit financing raises rates → I falls → partial offset of stimulus.`, kind: 'tip' },
    { content: 'Deficit (flow, annual) ≠ debt (stock, cumulative).', kind: 'tip' },
    { content: 'Lags: recognition + legislative + implementation. Fiscal policy is slow.', kind: 'tip' },
  ],
};
