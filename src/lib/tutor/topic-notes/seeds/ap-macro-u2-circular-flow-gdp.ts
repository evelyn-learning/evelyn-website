/**
 * AP Macroeconomics — Unit 2 CED 2.1: The Circular Flow and GDP.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.circular-flow-gdp.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.circular-flow-gdp.v1' }],
  theory: [
    { loId: 'apmacro.circular-flow-gdp', content: `GDP DEFINITION: the MARKET VALUE of all FINAL goods and services PRODUCED WITHIN a country DURING a given period (usually a year). Five binding words — each one rules something out.` },
    { loId: 'apmacro.circular-flow-gdp', content: `THE FIVE BINDING WORDS. MARKET VALUE: goods valued at actual market prices. FINAL: only goods sold to end users; INTERMEDIATE goods (a tire sold to a carmaker) are excluded to avoid double-counting — the tire's value is already inside the car's final price. PRODUCED: only current production; used-good resales were counted the year they were made. WITHIN A COUNTRY: geographic boundary — a Toyota plant in Tennessee counts in US GDP (contrast GNP, which follows ownership). DURING A PERIOD: the year or quarter the production happens.` },
    { loId: 'apmacro.circular-flow-gdp', content: `EXPENDITURE APPROACH (most common on AP): $Y = C + I + G + NX$. C = consumption by households. I = investment (firms' capital purchases + new housing + INVENTORY CHANGE). G = government PURCHASES of goods and services. NX = net exports = exports − imports.` },
    { loId: 'apmacro.circular-flow-gdp', content: `IMPORTS SUBTRACT because they are not domestic production: foreign-made goods show up inside C, I, or G when purchased, and the minus-imports term backs them out. A NEGATIVE NX (trade deficit) is perfectly normal — it simply means imports exceed exports.` },
    { loId: 'apmacro.circular-flow-gdp', content: `INCOME APPROACH: sum all income earned in production — wages, rent, interest, profits. Equals the expenditure total by accounting identity: every dollar SPENT on final output is a dollar of INCOME to someone in the chain.` },
    { loId: 'apmacro.circular-flow-gdp', content: `VALUE-ADDED APPROACH: at each production stage, count only the value the firm ADDED (its sale price minus the inputs it bought). Farmer + miller + baker value-added sums exactly to the loaf's final price. All three approaches are three views of the same circular flow — production, income, and final spending balance by identity.` },
    { loId: 'apmacro.circular-flow-gdp', content: `WHAT GDP DOES NOT COUNT: used-good resales (counted when first produced), financial transactions (stock trades — asset swaps, no production), TRANSFER PAYMENTS (Social Security, unemployment insurance — money moves but nothing is produced), purely illegal market activity, household production (your own chores), and volunteer work.` },
    { loId: 'apmacro.circular-flow-gdp', content: `TRANSFERS ARE NOT G. G is government PURCHASES (teacher salaries, roads, military equipment). Transfer payments move money from taxpayers to recipients with no production — they enter GDP only INDIRECTLY, later, through C when recipients spend. "Raising Social Security raises G" is a classic AP point-loser.` },
    { loId: 'apmacro.circular-flow-gdp', content: `FINAL vs INTERMEDIATE DEPENDS ON THE BUYER: flour sold to a home baker is a FINAL good (counted); the same flour sold to a bakery is an INTERMEDIATE input (not counted separately — its value is embedded in the bread's price).` },
    { loId: 'apmacro.circular-flow-gdp', kind: 'definition', title: 'GDP', content: `the market value of all final goods and services produced within a country in a given period.` },
    { loId: 'apmacro.circular-flow-gdp', kind: 'definition', title: 'final good', content: `a good sold to its end user (counted in GDP); contrasted with an intermediate good.` },
    { loId: 'apmacro.circular-flow-gdp', kind: 'definition', title: 'intermediate good', content: `a good used as an input to another good (NOT counted separately, to avoid double-counting).` },
  ],
  methods: [
    {
      title: 'Compute GDP with the expenditure approach from a data list',
      steps: [
        `STEP 1 — SORT the given items into $C$, $I$, $G$, exports, imports — and a DISCARD pile for anything that is not current domestic production (transfers, used-good sales, financial transactions).`,
        `STEP 2 — COMPUTE $NX$ = exports − imports. Negative is fine (trade deficit).`,
        `STEP 3 — JUSTIFY each exclusion in one clause: transfers = no production occurs; used goods = counted when originally produced; stock trades = asset swaps.`,
        `STEP 4 — SUM: $Y = C + I + G + NX$.`,
        `STEP 5 — SANITY-CHECK the sign story: a negative NX lowers measured GDP because the import content of C, I, and G must be backed out — it does not mean trade "destroyed" output.`,
      ],
      example: {
        problem: `An economy reports (in billions of dollars): consumption 400, private investment 80, government purchases 120, exports 90, imports 110, transfer payments 70, used-car resales 30. Compute GDP.`,
        solution: `Discard transfers (no production) and used-car resales (counted when produced). NX = 90 − 110 = −20. Y = 400 + 80 + 120 − 20 = 580 billion dollars.`,
      },
      relatedLoIds: ['apmacro.circular-flow-gdp'],
    },
    {
      title: 'Trace a supply chain to show the three approaches agree',
      steps: [
        `STEP 1 — LIST each stage's sale price down the chain (farmer → miller → baker → consumer).`,
        `STEP 2 — VALUE-ADDED at each stage = that stage's sale price − the inputs it bought. Sum the value-addeds.`,
        `STEP 3 — EXPENDITURE = the final consumer's payment (the only FINAL transaction in the chain).`,
        `STEP 4 — INCOME: each stage's value-added becomes someone's wages, rent, interest, or profit; sum them.`,
        `STEP 5 — CONFIRM all three totals equal the final price — the accounting identity behind the circular flow.`,
      ],
      example: {
        problem: `A farmer sells wheat to a miller for twenty cents; the miller sells flour to a baker for thirty-five cents; the baker sells the loaf to a consumer for seventy-five cents. Show that the expenditure, value-added, and income approaches give the same GDP contribution.`,
        solution: `Value-added: farmer twenty cents, miller fifteen (thirty-five minus twenty), baker forty (seventy-five minus thirty-five) — sum = seventy-five cents. Expenditure: the consumer's seventy-five cents on the loaf (only final sale). Income: each value-added slice is income to that stage — also seventy-five cents. All three equal the loaf's final price.`,
      },
      relatedLoIds: ['apmacro.circular-flow-gdp'],
    },
  ],
  pointers: [
    { content: 'Y = C + I + G + NX. NX = exports − imports; negative NX just means a trade deficit.', kind: 'tip' },
    { content: 'Transfers (Social Security, unemployment checks) are NOT in G — no production occurs.', kind: 'tip' },
    { content: 'Intermediate goods are excluded to avoid double-counting; final-vs-intermediate depends on the buyer.', kind: 'tip' },
    { content: 'Used-good resales and stock trades never count — no current production.', kind: 'tip' },
    { content: 'Inventory change counts inside I; a Toyota plant in the US counts in US GDP (geography, not ownership).', kind: 'tip' },
    { content: 'Expenditure = income = value-added: every dollar spent on final output is income to someone.', kind: 'tip' },
  ],
};
