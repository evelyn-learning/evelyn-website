/**
 * AP Macroeconomics — Unit 4 CED 4.7: The Loanable Funds Market.
 *
 * **Calibration baseline** for the topic-notes initiative — first
 * hand-authored baseline, intended to demonstrate the gold standard
 * for: theory `kind` tagging, optional `title` headlines, inline
 * diagrams via the existing solver, method recipes with examples,
 * and (critically) the kind of FRQ-vocab / gotcha / edge-case pointers
 * the bulk pointer-gen pass should aim for.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/ap-macro-u4-loanable-funds.ts
 * (planId evelyn.ap.macro.loanable-funds-market.v1).
 *
 * See project_topic_notes_initiative.md for the 11 grilled design
 * decisions. Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'apmacro.loanable-funds-market';

export const BASELINE_AP_MACRO_LOANABLE_FUNDS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.loanable-funds-market.v1',
  course: 'AP Macroeconomics',
  cedUnit: 4,
  cedTopic: '4.7',
  cedTitle: 'The Loanable Funds Market',
  planId: 'evelyn.ap.macro.loanable-funds-market.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-05-10',
  sources: [
    { type: 'plan', planId: 'evelyn.ap.macro.loanable-funds-market.v1' },
    { type: 'textbook', book: 'OpenStax Principles of Macroeconomics for AP Courses', chapter: '17' },
  ],
  theory: [
    {
      loId: LO,
      kind: 'framework',
      title: 'Axes & convention',
      content:
        'y-axis: REAL interest rate (r). x-axis: QUANTITY OF LOANABLE FUNDS. AP convention — same axes every time.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Supply (S) — saving',
      content:
        'UPWARD-sloping. Higher real r encourages MORE saving (households defer consumption to earn the higher real return). At any given r, supply comes from household saving + business retained earnings + government surpluses (rare) + foreign saving (capital inflows).',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Demand (D) — borrowing',
      content:
        'DOWNWARD-sloping. Higher real r makes investment borrowing LESS attractive (more projects fail the cost-benefit test). At any given r, demand comes from firms (investment), households (mortgages, durable goods), and government (deficit financing).',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Equilibrium real rate',
      content:
        'r* is set where S intersects D. At r*, quantity of saving supplied equals quantity of borrowing demanded.',
      diagram: {
        type: 'loanable_funds',
        params: { title: 'Loanable funds equilibrium' },
      },
    },
    {
      loId: LO,
      kind: 'shifter-list',
      title: 'Supply shifters',
      content:
        '(a) household saving rate changes (cultural / demographic / retirement-account incentives). (b) tax policy on savings (higher cap-gains tax discourages saving; lower encourages). (c) foreign capital inflows / outflows. (d) government surplus or deficit changes (surplus increases public saving; deficit decreases it).',
    },
    {
      loId: LO,
      kind: 'shifter-list',
      title: 'Demand shifters',
      content:
        "(a) firms' investment-opportunity expectations (better tech outlook → D right; recession fears → D left). (b) government deficit borrowing (deficit raises D; surplus or smaller deficit lowers D). (c) household borrowing demand (consumer confidence, housing market). (d) foreign borrowing.",
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Crowding out via this model',
      content:
        'When government runs a DEFICIT, it competes with private borrowers for loanable funds. Government borrowing shifts D RIGHTWARD. Equilibrium r RISES. Higher real rates discourage private I (firms postpone projects). Some of the fiscal stimulus is OFFSET by reduced private investment. This is the loanable-funds-market mechanism behind crowding-out (also referenced in U3.8).',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Connection to money market (Fisher)',
      content:
        'nominal i (money market) = real r (loanable funds) + expected inflation. Both markets respond to similar shocks but through different curves. AP often gives FRQs that ask you to draw BOTH and trace effects through both.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'loanable funds market',
      content:
        'the market in which savers (suppliers) and borrowers (demanders) interact to determine the real interest rate.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'crowding out',
      content:
        'reduction in private investment due to government deficit financing raising the real interest rate.',
    },
  ],
  methods: [
    {
      title: 'Analyze a fiscal-policy shock on the loanable funds market',
      when_to_use:
        'When the FRQ describes a change in government borrowing (deficit, surplus, stimulus financed by debt) and asks for the effect on real interest rates and/or private investment.',
      steps: [
        'Identify the EVENT: is the government becoming a bigger borrower (deficit ↑) or a smaller borrower / net saver (deficit ↓ or surplus)?',
        'Bigger borrower → DEMAND for loanable funds shifts RIGHT. Smaller borrower / surplus → DEMAND shifts LEFT (or some texts treat surplus as supply RIGHT — either is acceptable, be consistent).',
        'Trace the new EQUILIBRIUM: with unchanged S, rightward D shift raises r*. With unchanged S, leftward D shift lowers r*.',
        'Translate r* change to PRIVATE INVESTMENT effect: higher r → fewer private projects clear the cost-benefit threshold → private I FALLS. Lower r → private I RISES.',
        'State the CROWDING-OUT interpretation if the deficit was the trigger: fiscal stimulus added government spending but the higher real rate suppressed private I, so the net AD increase is smaller than the multiplier alone implies.',
        'Draw the DIAGRAM showing the original D, the shifted D, and the new equilibrium at higher r* and higher Q*.',
      ],
      example: {
        problem:
          'The U.S. government enacts a $1 trillion fiscal stimulus financed entirely by deficit borrowing. (a) Identify the effect on the loanable funds market. (b) Identify the effect on real interest rates. (c) Identify the effect on private investment. (d) Explain the crowding-out interpretation.',
        solution:
          'D shifts RIGHTWARD (government adds $1T of borrowing on top of private demand). Equilibrium r RISES. At the new higher r, fewer private projects clear → private I FALLS. Crowding out: the fiscal stimulus added ΔG, but the higher r reduced private I; the actual AD shift is smaller than (multiplier × ΔG). Magnitude depends on the elasticity of D and on how much slack is in the economy.',
      },
      relatedLoIds: [LO],
      diagram: {
        type: 'loanable_funds',
        params: {
          title: 'Deficit shock',
          shift: { curve: 'D', direction: 'right', label: 'Gov deficit' },
        },
      },
    },
  ],
  pointers: [
    // From plan recap — kind: 'tip' (key takeaways).
    {
      content: 'Loanable funds market sets REAL interest rate. S upward; D downward.',
      kind: 'tip',
    },
    {
      content: 'S shifters: saving incentives, foreign capital inflows, government surplus.',
      kind: 'tip',
    },
    {
      content: 'D shifters: investment demand, government deficit, household borrowing.',
      kind: 'tip',
    },
    {
      content:
        'Government deficit → D shifts RIGHT → r RISES → private I FALLS = CROWDING OUT.',
      kind: 'tip',
    },
    {
      content:
        'Money market sets nominal i; loanable funds sets real r. Connected via Fisher: nominal = real + expected inflation.',
      kind: 'tip',
    },
    // Hand-added calibration pointers — gold standard for what gen-topic-notes-pointers.ts
    // should aim for in bulk authoring. FRQ-vocab + gotchas + edge-cases + common-errors.
    {
      content:
        "Don't confuse loanable funds with the money market. Different axes (real r vs nominal i), different supply curves (upward S of savings vs vertical Ms set by Fed), different policy levers (saving/borrowing incentives vs OMO/discount/reserve).",
      kind: 'gotcha',
    },
    {
      content:
        "FRQ vocab: say 'demand shifts RIGHT/LEFT', not 'increases/decreases'. Say 'real interest rate RISES/FALLS', not 'goes up/down'. CB rubric is strict on shift terminology.",
      kind: 'frq-vocab',
    },
    {
      content:
        'Crowding-out is partial in most economies and largest at full employment. Near-zero in deep recessions when private investment demand is already weak independently — fiscal stimulus then has its full multiplier effect.',
      kind: 'edge-case',
    },
    {
      content:
        "If the FRQ gives you a budget DEFICIT, that's a DEMAND shifter (gov't borrowing). Don't accidentally shift supply. If it gives you a SURPLUS, either shift D LEFT or S RIGHT — pick one and be consistent through the answer.",
      kind: 'common-error',
    },
  ],
};
