/**
 * AP Macroeconomics — Unit 2 CED 2.1: The Circular Flow and GDP.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.circular-flow-gdp.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_CIRCULAR_FLOW_GDP: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.circular-flow-gdp.v1',
  course: 'AP Macroeconomics',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'The Circular Flow and GDP',
  planId: 'evelyn.ap.macro.circular-flow-gdp.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.circular-flow-gdp.v1' }],
  theory: [
    { loId: 'apmacro.circular-flow-gdp', content: `GDP DEFINITION: the MARKET VALUE of all FINAL goods and services PRODUCED WITHIN a country DURING a given period (usually a year). Five binding words — each rules out something.` },
    { loId: 'apmacro.circular-flow-gdp', content: `MARKET VALUE — values goods at their market prices, in dollars (or local currency). A loaf of bread valued at the price someone actually paid, not at how much you "enjoy" it.` },
    { loId: 'apmacro.circular-flow-gdp', content: `FINAL — counts only goods sold to FINAL users. INTERMEDIATE goods (a tire sold to Ford to put on a new car) are EXCLUDED to avoid double-counting. The tire's value is already included in the car's final price.` },
    { loId: 'apmacro.circular-flow-gdp', content: `PRODUCED — only currently-produced goods. Used-good resales (a 2015 Ford selling on the used market) do NOT count — that car was counted in 2015's GDP.` },
    { loId: 'apmacro.circular-flow-gdp', content: `WITHIN A COUNTRY — geographic boundary. A Toyota factory in Tennessee counts in U.S. GDP even though Toyota is Japanese. (Contrast: GNP uses ownership-of-factor boundaries.)` },
    { loId: 'apmacro.circular-flow-gdp', content: 'DURING A PERIOD — the year (or quarter) the production happens.' },
    { loId: 'apmacro.circular-flow-gdp', content: `EXPENDITURE APPROACH (most common on AP): Y = C + I + G + NX. C = Consumption (households). I = Investment (firms' capital + housing + inventory change). G = Government purchases of goods and services. NX = Net exports (exports - imports).` },
    { loId: 'apmacro.circular-flow-gdp', content: `INCOME APPROACH: sum all the income earned in production — wages, rent, interest, profits. Algebraically equal to the expenditure approach: every dollar spent is a dollar of income to someone.` },
    { loId: 'apmacro.circular-flow-gdp', content: `VALUE-ADDED APPROACH: at each stage of production, count only the value the firm ADDED. (Wheat farmer: $0.20. Miller: $0.15. Baker: $0.40. Loaf sells for $0.75. Total value-added: $0.75 = the loaf's final price.) Algebraically equal to expenditure.` },
    { loId: 'apmacro.circular-flow-gdp', content: `WHAT GDP DOES NOT COUNT: used-good resales, financial transactions (stock trades), transfer payments (Social Security, unemployment insurance — money moves but no production occurs), purely illegal market activity, household production (chores done at home), volunteer work.` },
    { loId: 'apmacro.circular-flow-gdp', kind: 'definition', title: 'GDP', content: `the market value of all final goods and services produced within a country in a given period.` },
    { loId: 'apmacro.circular-flow-gdp', kind: 'definition', title: 'final good', content: `a good sold to its end user (counted in GDP); contrasted with an intermediate good.` },
    { loId: 'apmacro.circular-flow-gdp', kind: 'definition', title: 'intermediate good', content: `a good used as an input to another good (NOT counted separately to avoid double-counting).` },
  ],
  methods: [
    {
      title: 'Worked gdp expenditure',
      steps: [
        `STEP 1 — IDENTIFY components of Y = C + I + G + NX. Drop everything else (transfers, used goods).`,
        `STEP 2 — ASSIGN: C = $400B, I = $80B, G = $120B. For NX: Exports $90B − Imports $110B = −$20B (trade deficit).`,
        `STEP 3 — EXCLUDE the non-GDP items. Transfer payments ($70B): excluded — no current production occurs, money just moves between people. Used-car resales ($30B): excluded — those cars were already counted when first produced.`,
        'STEP 4 — COMPUTE. Y = 400 + 80 + 120 + (−20) = $580B.',
        `STEP 5 — VERIFY logic. NX is NEGATIVE in this economy. That's fine — it just means imports exceed exports. NX subtracts from GDP because imports are NOT domestically produced (they are foreign production showing up in C, I, or G; the −Imports backs them out).`,
      ],
      example: { problem: `In a given year a small economy reports: household consumption = $400B; private investment (incl. inventory change) = $80B; government purchases of goods and services = $120B; exports = $90B; imports = $110B; transfer payments (Social Security etc.) = $70B; used-car resales = $30B. Compute GDP using the expenditure approach.`, solution: 'GDP = $580B (C $400 + I $80 + G $120 + NX −$20).' },
      relatedLoIds: ['apmacro.circular-flow-gdp'],
    },
  ],
  pointers: [
    { content: `GDP = market value of FINAL goods/services PRODUCED WITHIN a country DURING a period.`, kind: 'tip' },
    { content: 'Y = C + I + G + NX (expenditure approach — most common on AP).', kind: 'tip' },
    { content: `EXCLUDED: intermediate goods (avoid double-counting), used-good resales, transfer payments, financial transactions, household production.`, kind: 'tip' },
    { content: `NX = exports − imports. Imports SUBTRACT from GDP because they are not domestic production.`, kind: 'tip' },
    { content: 'Transfers ≠ G. G is purchases; transfers move money without new production.', kind: 'tip' },
  ],
};
