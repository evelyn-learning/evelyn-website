/**
 * AP Macroeconomics — CED Unit 2.1: The Circular Flow and GDP.
 *
 * The first measurement chapter. Establishes GDP as the market value of
 * final goods/services produced within a country in a year, the three
 * equivalent ways to compute it, and the boundary cases (what counts,
 * what doesn't). Foundational for everything in Unit 2 onward.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_CIRCULAR_FLOW_GDP: LessonPlan = {
  id: 'evelyn.ap.macro.circular-flow-gdp.v1',
  title: 'The Circular Flow and GDP',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.circular-flow-gdp',
      description:
        'Define GDP, identify what is and is not counted in GDP, apply the expenditure approach (Y = C + I + G + NX), and explain why the three measurement approaches (expenditure, income, value-added) yield the same total.',
      standard: 'AP-MACRO-2.1',
    },
  ],
  prerequisites: ['apmacro.marginal-analysis-consumer'],
  followUps: ['apmacro.gdp-limitations'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make GDP feel like the country\'s scoreboard.',
      script:
        "When commentators say the U.S. economy is 28 trillion dollars or that China overtook Japan in 2010, they are talking about GDP. It is the single number we use to compare the size of every economy on earth, and to tell whether a country is growing or shrinking quarter by quarter. This lesson defines that number precisely — what it counts, what it leaves out, and three equivalent ways to compute it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-gdp',
      kind: 'concept',
      goal: 'Define GDP precisely; cover the three measurement approaches and the inclusion/exclusion rules.',
      keyIdeas: [
        'GDP DEFINITION: the MARKET VALUE of all FINAL goods and services PRODUCED WITHIN a country DURING a given period (usually a year). Five binding words — each rules out something.',
        'MARKET VALUE — values goods at their market prices, in dollars (or local currency). A loaf of bread valued at the price someone actually paid, not at how much you "enjoy" it.',
        'FINAL — counts only goods sold to FINAL users. INTERMEDIATE goods (a tire sold to Ford to put on a new car) are EXCLUDED to avoid double-counting. The tire\'s value is already included in the car\'s final price.',
        'PRODUCED — only currently-produced goods. Used-good resales (a 2015 Ford selling on the used market) do NOT count — that car was counted in 2015\'s GDP.',
        'WITHIN A COUNTRY — geographic boundary. A Toyota factory in Tennessee counts in U.S. GDP even though Toyota is Japanese. (Contrast: GNP uses ownership-of-factor boundaries.)',
        'DURING A PERIOD — the year (or quarter) the production happens.',
        'EXPENDITURE APPROACH (most common on AP): Y = C + I + G + NX. C = Consumption (households). I = Investment (firms\' capital + housing + inventory change). G = Government purchases of goods and services. NX = Net exports (exports - imports).',
        'INCOME APPROACH: sum all the income earned in production — wages, rent, interest, profits. Algebraically equal to the expenditure approach: every dollar spent is a dollar of income to someone.',
        'VALUE-ADDED APPROACH: at each stage of production, count only the value the firm ADDED. (Wheat farmer: $0.20. Miller: $0.15. Baker: $0.40. Loaf sells for $0.75. Total value-added: $0.75 = the loaf\'s final price.) Algebraically equal to expenditure.',
        'WHAT GDP DOES NOT COUNT: used-good resales, financial transactions (stock trades), transfer payments (Social Security, unemployment insurance — money moves but no production occurs), purely illegal market activity, household production (chores done at home), volunteer work.',
      ],
      vocabulary: [
        { term: 'GDP', definition: 'the market value of all final goods and services produced within a country in a given period.' },
        { term: 'final good', definition: 'a good sold to its end user (counted in GDP); contrasted with an intermediate good.' },
        { term: 'intermediate good', definition: 'a good used as an input to another good (NOT counted separately to avoid double-counting).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-gdp-expenditure',
      kind: 'worked_example',
      problem:
        'In a given year a small economy reports: household consumption = $400B; private investment (incl. inventory change) = $80B; government purchases of goods and services = $120B; exports = $90B; imports = $110B; transfer payments (Social Security etc.) = $70B; used-car resales = $30B. Compute GDP using the expenditure approach.',
      steps: [
        'STEP 1 — IDENTIFY components of Y = C + I + G + NX. Drop everything else (transfers, used goods).',
        'STEP 2 — ASSIGN: C = $400B, I = $80B, G = $120B. For NX: Exports $90B − Imports $110B = −$20B (trade deficit).',
        'STEP 3 — EXCLUDE the non-GDP items. Transfer payments ($70B): excluded — no current production occurs, money just moves between people. Used-car resales ($30B): excluded — those cars were already counted when first produced.',
        'STEP 4 — COMPUTE. Y = 400 + 80 + 120 + (−20) = $580B.',
        'STEP 5 — VERIFY logic. NX is NEGATIVE in this economy. That\'s fine — it just means imports exceed exports. NX subtracts from GDP because imports are NOT domestically produced (they are foreign production showing up in C, I, or G; the −Imports backs them out).',
      ],
      answer: 'GDP = $580B (C $400 + I $80 + G $120 + NX −$20).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-define',
      kind: 'try_yourself',
      problem:
        'In your own words, state the GDP definition AND name two specific things that GDP does not count even though they involve money changing hands. Briefly justify each exclusion.',
      expectedAnswer:
        'GDP = the market value of all final goods and services produced within a country in a given period (year/quarter). Two examples of EXCLUDED money-flows: (1) Transfer payments (e.g. Social Security checks): no production occurs — the government just moves money from taxpayers to recipients. Counting transfers would double-count or invent value. (2) Used-good resales (e.g. selling a 2018 car in 2026): the car was counted in 2018\'s GDP when first produced. Counting it again in 2026 would double-count. Other valid examples: stock trades (financial transactions, no production), illegal market activity (formally excluded), household chores (not market-priced).',
      responseFormat: 'free',
      hints: [
        'The five binding words: market value, final, produced, within country, during period.',
        'For exclusions, pick examples where money flows but no NEW production happened.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-final-intermediate',
      kind: 'try_yourself',
      problem:
        'For each transaction below, state whether it is included in current-year GDP and BRIEFLY explain why or why not. (a) A bakery sells $3 of flour to a customer for home baking. (b) The bakery buys $3 of flour from a wholesaler to make bread. (c) The bakery sells the resulting bread to a customer for $9. (d) Two friends sell each other their old textbooks for $40 total.',
      expectedAnswer:
        '(a) INCLUDED: $3. Flour sold to a final consumer (the home baker) is a final good. (b) EXCLUDED: this $3 is an intermediate-good purchase. Including it would double-count, since the flour\'s value gets embedded in the bread the bakery later sells. (c) INCLUDED: $9. The bread is a final good sold to a final consumer. The $9 contains the embedded $3 of flour value (the bakery added $6 of value: labor + ovens + profit). (d) EXCLUDED: used textbook resales — those books were counted in GDP when first produced. The friends\' transaction is a transfer of an existing good, not new production. Total counted in this year\'s GDP from these four transactions: $3 + $9 = $12.',
      responseFormat: 'free',
      hints: [
        'Ask: is this a final good or an intermediate good?',
        'Ask: was this produced this year, or just resold?',
        'The bakery\'s flour purchase is a textbook intermediate-good case.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-three-approaches',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why do the three approaches to measuring GDP (expenditure, income, value-added) yield exactly the same total? Use a concrete supply chain to illustrate.',
      expectedAnswer:
        'They yield the same total because in any market transaction, every dollar SPENT is also a dollar of INCOME and represents a unit of VALUE ADDED. Concrete chain: a wheat farmer grows wheat and sells it to a miller for $0.20. Wheat farmer\'s value-added = $0.20 (no inputs assumed). Miller grinds it into flour and sells to a baker for $0.35. Miller\'s value-added = $0.35 - $0.20 = $0.15. Baker bakes a loaf and sells it to a consumer for $0.75. Baker\'s value-added = $0.75 - $0.35 = $0.40. (1) EXPENDITURE: the consumer spent $0.75 on the loaf (the only FINAL transaction). GDP contribution = $0.75. (2) VALUE-ADDED: $0.20 + $0.15 + $0.40 = $0.75. (3) INCOME: every value-added dollar becomes wages/rent/interest/profit to someone in the chain. The farmer earns the $0.20, miller earns $0.15 in income net of input cost, baker earns $0.40 net. Sum: $0.75. All three approaches sum to the SAME number because they are three views of the same flow — production, income, and final spending must balance by accounting identity.',
      responseFormat: 'frq',
      hints: [
        'Walk a single good through a supply chain and compute each approach.',
        'Why is value-added at each stage equal to that stage\'s contribution to final price?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-transfers',
      kind: 'misconception_check',
      question:
        "A student says: 'Government spending is part of G in the GDP equation, so increasing Social Security payments would raise GDP.' Is this right?",
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Conflating government PURCHASES (G in the GDP equation) with government TRANSFER PAYMENTS (which are not in G).',
          correctsTo:
            'NO. G in Y = C + I + G + NX is government PURCHASES OF GOODS AND SERVICES — paying salaries to teachers, building roads, buying military equipment. Transfer payments (Social Security checks, unemployment insurance, food stamps) are NOT in G because no new production occurs — the government takes money from taxpayers and gives it to recipients. The recipients then spend the money, which DOES show up in C (consumption) when they buy goods. So transfers indirectly affect GDP via C, but they are not themselves GDP. The AP exam regularly tests this distinction; mixing up "government spending" (a casual term that conflates both) with "G" (the GDP-equation term) is a classic point-loser.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'GDP = market value of FINAL goods/services PRODUCED WITHIN a country DURING a period.',
        'Y = C + I + G + NX (expenditure approach — most common on AP).',
        'EXCLUDED: intermediate goods (avoid double-counting), used-good resales, transfer payments, financial transactions, household production.',
        'NX = exports − imports. Imports SUBTRACT from GDP because they are not domestic production.',
        'Transfers ≠ G. G is purchases; transfers move money without new production.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.1',
    cedTitle: 'The Circular Flow and GDP',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '6', note: 'OpenStax Macro AP chapter on macroeconomic measurement.' },
    ],
  },
};
