/**
 * TEST PLAN — G11 AP Macro — Phase 9 stress test.
 *
 * Exercises all 7 Phase 9 economics kinds:
 *   1. production_possibilities (SVG — bowed-out curve + points + shift)
 *   2. business_cycle           (SVG — wave + trend + phase markers)
 *   3. aggregate_demand_supply  (SVG — AD/SRAS/LRAS + shift)
 *   4. money_market             (SVG — Ms vertical, Md downward + shift)
 *   5. loanable_funds           (SVG — S upward, D downward + shift)
 *   6. phillips_curve           (SVG — SRPC + LRPC + shift)
 *   7. foreign_exchange_market  (SVG — S/D for currency + shift)
 *
 * Uses abstract phrasing in try-yourself to avoid the
 * "judge confuses seed problem text with brain show_problem" cascade
 * documented in the open-issues compendium.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G11_PHASE9_ECONOMICS: LessonPlan = {
  id: 'evelyn.test.g11.economics.phase9.v1',
  title: '[TEST] G11 AP Macro — Phase 9 stress test',
  curriculum: 'AP Macroeconomics',
  grade: '9-12',
  subject: 'social',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'test.phase9.economics-coverage',
      description: 'Exercise all 7 Phase 9 economics kinds with scribble + handwrite markings per kind.',
      standard: 'INTERNAL-TEST',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the cross-kind econ test session.',
      script: 'We\'ll tour seven foundational AP Macro graphs today. Ready?',
      estimatedMinutes: 1,
    },

    // ── 1. PPC ─────────────────────────────────────────────────────
    {
      id: 'concept-ppc',
      kind: 'concept',
      goal: 'Render production_possibilities + scribble + handwrite.',
      teacherNote:
        '1. show_diagram with type="production_possibilities", params:\n' +
        '   { xAxis: { label: "Guns", max: 100 }, yAxis: { label: "Butter", max: 100 },\n' +
        '     curve: "bowed-out",\n' +
        '     points: [{x:70, y:60, label:"A"}, {x:30, y:30, label:"B"}, {x:90, y:80, label:"C"}],\n' +
        '     title: "Guns vs Butter" }\n\n' +
        '2. tutor_scribble { target: "point A", color: "#16a34a", label: "efficient" }\n' +
        '3. tutor_handwrite { text: "On the PPC = efficient. Inside = wasted resources. Outside = unattainable." }\n' +
        '4. Briefly explain opportunity cost, then advance.',
      keyIdeas: ['On the PPC = efficient.', 'Inside the PPC = inefficient.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 2. Business cycle ──────────────────────────────────────────
    {
      id: 'concept-business-cycle',
      kind: 'concept',
      goal: 'Render business_cycle + scribble + handwrite on the Peak.',
      teacherNote:
        '1. show_diagram with type="business_cycle", params:\n' +
        '   { cycles: 1.5, showTrend: true, title: "Business Cycle" }\n\n' +
        '2. tutor_scribble { target: "Peak", color: "#dc2626", label: "expansion ends here" }\n' +
        '3. tutor_handwrite { text: "Peak → recession → trough → expansion → next peak." }\n' +
        '4. Briefly explain the four phases, then advance.',
      keyIdeas: ['Four phases: peak, recession, trough, expansion.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 3. AD/AS ───────────────────────────────────────────────────
    {
      id: 'concept-ad-as',
      kind: 'concept',
      goal: 'Render aggregate_demand_supply + scribble on AD + handwrite.',
      teacherNote:
        '1. show_diagram with type="aggregate_demand_supply", params:\n' +
        '   { potentialGdp: 50, initialEquilibriumGdp: 50, initialPriceLevel: 50,\n' +
        '     showLras: true,\n' +
        '     shift: { curve: "AD", direction: "right", magnitude: 10, label: "fiscal stimulus" },\n' +
        '     title: "AD/AS — Expansionary Fiscal Policy" }\n\n' +
        '2. tutor_scribble { target: "AD\'", color: "#dc2626", label: "fiscal stimulus" }\n' +
        '3. tutor_handwrite { text: "AD shifts right → both Y and P rise in the short run." }\n' +
        '4. Briefly explain the short-run effect of fiscal stimulus, then advance.',
      keyIdeas: ['AD shift right → higher Y AND higher P (short run).'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 4. Money market ────────────────────────────────────────────
    {
      id: 'concept-money-market',
      kind: 'concept',
      goal: 'Render money_market + scribble on Ms + handwrite.',
      teacherNote:
        '1. show_diagram with type="money_market", params:\n' +
        '   { moneySupplyQuantity: 50, initialInterestRate: 50,\n' +
        '     shift: { curve: "Ms", direction: "right", magnitude: 15, label: "Fed buys bonds" },\n' +
        '     title: "Money Market — Expansionary Monetary Policy" }\n\n' +
        '2. tutor_scribble { target: "Ms\'", color: "#16a34a", label: "open market purchase" }\n' +
        '3. tutor_handwrite { text: "Fed buys bonds → Ms shifts right → interest rate falls." }\n' +
        '4. Briefly explain expansionary monetary policy, then advance.',
      keyIdeas: ['Ms shift right → interest rate falls.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 5. Loanable funds ──────────────────────────────────────────
    {
      id: 'concept-loanable-funds',
      kind: 'concept',
      goal: 'Render loanable_funds + scribble on D + handwrite.',
      teacherNote:
        '1. show_diagram with type="loanable_funds", params:\n' +
        '   { initialQuantity: 50, initialRealRate: 50,\n' +
        '     shift: { curve: "D", direction: "right", magnitude: 15, label: "gov\'t borrowing" },\n' +
        '     title: "Loanable Funds — Crowding Out" }\n\n' +
        '2. tutor_scribble { target: "D\'", color: "#dc2626", label: "deficit spending" }\n' +
        '3. tutor_handwrite { text: "Gov\'t borrowing → D shifts right → real rate rises → crowds out private investment." }\n' +
        '4. Briefly explain crowding out, then advance.',
      keyIdeas: ['Gov\'t deficit spending raises real rate → crowds out private investment.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 6. Phillips curve ──────────────────────────────────────────
    {
      id: 'concept-phillips-curve',
      kind: 'concept',
      goal: 'Render phillips_curve + scribble on SRPC + handwrite.',
      teacherNote:
        '1. show_diagram with type="phillips_curve", params:\n' +
        '   { nairu: 50, initialUnemployment: 50, initialInflation: 30, showLrpc: true,\n' +
        '     shift: { curve: "SRPC", direction: "up", magnitude: 10, label: "supply shock" },\n' +
        '     title: "Phillips Curve — Stagflation" }\n\n' +
        '2. tutor_scribble { target: "SRPC\'", color: "#dc2626", label: "cost-push shock" }\n' +
        '3. tutor_handwrite { text: "SRPC shifts up = stagflation. LRPC stays vertical at NAIRU." }\n' +
        '4. Briefly explain SRPC vs LRPC, then advance.',
      keyIdeas: ['SRPC: short-run tradeoff between unemployment & inflation.', 'LRPC: vertical at NAIRU; no long-run tradeoff.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── 7. FX market ───────────────────────────────────────────────
    {
      id: 'concept-fx-market',
      kind: 'concept',
      goal: 'Render foreign_exchange_market + scribble + handwrite.',
      teacherNote:
        '1. show_diagram with type="foreign_exchange_market", params:\n' +
        '   { currency: "USD", quoteCurrency: "EUR",\n' +
        '     initialQuantity: 50, initialExchangeRate: 50,\n' +
        '     shift: { curve: "D", direction: "right", magnitude: 15, label: "higher US interest rates" },\n' +
        '     title: "USD Appreciates" }\n\n' +
        '2. tutor_scribble { target: "DUSD\'", color: "#16a34a", label: "capital inflows" }\n' +
        '3. tutor_handwrite { text: "Demand for USD rises → USD appreciates against EUR." }\n' +
        '4. Briefly explain currency appreciation, then advance.',
      keyIdeas: ['Demand for a currency rises → that currency appreciates.'],
      suggestedTools: ['show_diagram', 'tutor_scribble', 'tutor_handwrite'],
      estimatedMinutes: 2,
    },

    // ── try-yourself ───────────────────────────────────────────────
    {
      id: 'try-yourself',
      kind: 'try_yourself',
      // Abstract phrasing — no concrete numbers — to avoid the judge
      // mixing seed problem state with the brain's show_problem.
      problem: 'In the loanable funds market, when government deficit spending shifts demand right, what happens to the real interest rate?',
      expectedAnswer: 'rises',
      hints: [
        'Right-shift of demand = more buyers competing for the same supply.',
        'Higher demand → higher equilibrium price (rate, in this market).',
      ],
      responseFormat: 'free',
      estimatedMinutes: 1,
    },

    // ── recap ──────────────────────────────────────────────────────
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PPC: on=efficient, inside=inefficient, outside=unattainable.',
        'Business cycle phases: peak → recession → trough → expansion.',
        'AD right → Y↑ P↑ short run.',
        'Ms right → interest rate falls.',
        'Gov\'t borrowing → real rate↑ → crowds out investment.',
        'SRPC shifts up = stagflation; LRPC stays vertical at NAIRU.',
        'Higher demand for a currency → that currency appreciates.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Internal QA', org: 'Evelyn', license: 'Internal-test' },
  schemaVersion: 1,
  metadata: {
    purpose: 'Test seed for Phase 9 (economics). All 7 kinds × one scribble + one handwrite per concept.',
  },
};
