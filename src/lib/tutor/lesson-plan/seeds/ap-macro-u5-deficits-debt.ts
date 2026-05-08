/**
 * AP Macroeconomics — CED Unit 5.3: Government Deficits and the
 * National Debt.
 *
 * Long-run sustainability emphasis. Builds on U3.8 (where deficit/debt
 * was first introduced). Here we cover debt-to-GDP, sustainability,
 * intergenerational implications.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_DEFICITS_DEBT: LessonPlan = {
  id: 'evelyn.ap.macro.deficits-debt.v1',
  title: 'U5.3 Government Deficits and the National Debt',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.deficits-debt',
      description:
        'Distinguish budget deficit from national debt, compute debt-to-GDP ratio, identify factors affecting long-run debt sustainability, and articulate intergenerational and crowding-out implications of persistent deficits.',
      standard: 'AP-MACRO-5.3',
    },
  ],
  prerequisites: ['apmacro.money-growth-inflation', 'apmacro.fiscal-policy'],
  followUps: ['apmacro.crowding-out-long-run'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame debt as a long-run constraint with intergenerational implications.',
      script:
        "When a government runs a deficit, it borrows from someone — domestic savers, foreign governments, future taxpayers. The debt accumulates. At some point, debt service eats a significant chunk of the budget, leaving less room for everything else. AP cares about debt because it shapes the LONG-RUN POSSIBILITIES for fiscal policy: a country with high debt-to-GDP has fewer tools available next time a recession hits.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-debt',
      kind: 'concept',
      goal: 'Cover deficit/debt distinction, debt-to-GDP, sustainability, and intergenerational reasoning.',
      keyIdeas: [
        'BUDGET DEFICIT: spending > revenue IN A GIVEN YEAR (annual flow). NATIONAL DEBT: cumulative sum of past deficits minus surpluses (stock at a point in time). Reviewed from U3.8.',
        'DEBT-TO-GDP RATIO: national debt divided by GDP, expressed as a percentage. The most-cited measure of debt burden because it normalizes by the economy\'s ability to service the debt. Examples: U.S. debt-to-GDP ≈ 100% (2024); Japan ≈ 250%; many European countries 80-130%.',
        'WHY DEBT-TO-GDP rather than absolute debt: a $30T debt burden is very different in a $25T economy (debt-to-GDP = 120%) than in a $50T economy (60%). Larger economies can sustain more absolute debt.',
        'DEBT SUSTAINABILITY: a country can sustain a steady debt-to-GDP ratio if real GDP grows at least as fast as real debt grows. If interest payments + new deficits cause debt to grow faster than GDP, debt-to-GDP rises over time. Eventually, lenders question the country\'s ability to repay; interest rates rise; the debt becomes harder to service. Severe cases: sovereign-debt crises (Greece 2010, Argentina multiple times).',
        'COSTS OF HIGH DEBT: (1) DEBT SERVICE — paying interest takes a growing share of the budget, leaving less for other priorities. (2) CROWDING OUT — government borrowing competes with private; persistent deficits raise real interest rates over time, reducing private I and long-run growth (covered next plan). (3) FOREIGN DEBT — debt held by foreign creditors means future debt service is a transfer abroad. (4) FISCAL POLICY CONSTRAINT — high debt-to-GDP makes large new stimulus packages politically harder and economically riskier.',
        'INTERGENERATIONAL ARGUMENT: today\'s deficits become tomorrow\'s debt service. Future taxpayers pay either through higher taxes or reduced government services. Some economists argue this is unfair burden-shifting; others argue if the debt finances investment (infrastructure, education) that benefits future generations, the trade is fair.',
        'COUNTER-ARGUMENT — debt-financed investment: if government spending creates productive capacity (research, infrastructure, education) that raises future GDP, the debt may PAY FOR ITSELF in higher future tax revenues. Not all deficits are equal — the COMPOSITION of spending matters as much as the magnitude.',
        'WHEN DEFICITS ARE WIDELY ACCEPTED: during recessions (counter-cyclical stabilization), wars, and major emergencies. The 2008-09 and 2020 recessions saw large U.S. deficits with broad expert support. Persistent peacetime deficits at full employment are more controversial.',
      ],
      vocabulary: [
        { term: 'debt-to-GDP ratio', definition: 'national debt as a percentage of GDP; primary measure of debt burden.' },
        { term: 'debt sustainability', definition: 'the ability of a government to maintain a steady debt-to-GDP ratio over time.' },
        { term: 'debt service', definition: 'interest payments on the national debt.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-debt-sustain',
      kind: 'worked_example',
      problem:
        "Country Y has a national debt of $20T and a GDP of $25T. (a) Compute the debt-to-GDP ratio. (b) If GDP grows at 2% per year and the debt grows at 4% per year, compute the debt-to-GDP ratio after 5 years. (c) Identify whether the trajectory is sustainable.",
      steps: [
        'STEP 1 — INITIAL DEBT-TO-GDP = $20T / $25T × 100 = 80%.',
        'STEP 2 — AFTER 5 YEARS. Debt grows: $20T × (1.04)⁵ = $20T × 1.217 = $24.33T. GDP grows: $25T × (1.02)⁵ = $25T × 1.104 = $27.61T. New debt-to-GDP = $24.33T / $27.61T × 100 ≈ 88.1%.',
        'STEP 3 — TRAJECTORY ASSESSMENT. Debt-to-GDP rose from 80% to 88% in 5 years — a roughly 8 percentage-point increase. At this pace, debt-to-GDP would continue rising indefinitely. The trajectory is NOT SUSTAINABLE in the long run because debt is growing faster than GDP.',
        'STEP 4 — STABILIZING CONDITION. To stabilize debt-to-GDP at 80%, debt must grow no faster than GDP — i.e., debt growth ≤ 2% per year. Currently 4% — too fast.',
        'STEP 5 — IMPLICATIONS. Stabilizing requires either (i) faster GDP growth, (ii) slower debt growth (smaller deficits), or (iii) a combination. Politically, smaller deficits typically require either spending cuts or tax increases, both controversial.',
      ],
      answer: '(a) 80%. (b) ≈88.1% after 5 years. (c) Not sustainable; debt growth (4%) exceeds GDP growth (2%).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-deficit-vs-debt',
      kind: 'try_yourself',
      problem:
        "In two sentences, distinguish a budget DEFICIT from the national DEBT. Then explain why economists usually focus on the DEBT-TO-GDP RATIO rather than the absolute dollar level of debt.",
      expectedAnswer:
        'DEFICIT: the amount by which government spending exceeds tax revenue in a SINGLE YEAR. Annual flow. DEBT: the cumulative total of all past deficits minus past surpluses, plus accumulated interest. Stock at a point in time. The DEBT-TO-GDP RATIO is preferred because absolute dollar amounts mask the country\'s ability to service the debt. A $1T debt is huge for a $5T economy (20% debt-to-GDP) but moderate for a $25T economy (4%). The ratio measures BURDEN relative to capacity. Large economies can sustain more absolute debt; the ratio captures sustainability and comparability across countries and time.',
      responseFormat: 'free',
      hints: [
        'Deficit: per-year. Debt: running cumulative total.',
        'GDP normalization is the key.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-sustainability',
      kind: 'try_yourself',
      problem:
        "Country Z has debt-to-GDP of 120%. Its GDP is growing 1.5% per year and its debt is growing 5% per year. (a) Is the debt trajectory sustainable? Justify with quantitative reasoning. (b) Identify TWO potential consequences if debt-to-GDP continues to rise indefinitely.",
      expectedAnswer:
        '(a) NOT sustainable. Debt is growing 3.5 percentage points faster than GDP per year. Debt-to-GDP will rise over time, not stabilize. To stabilize, debt growth must slow to GDP\'s 1.5% rate or below — requiring either reduced deficits, higher GDP growth, or both. Without action, debt-to-GDP will climb steadily, with trouble compounding. (b) Two consequences (any two): (i) DEBT-SERVICE CRISIS — interest payments consume a growing share of the budget, eventually crowding out other government spending and forcing painful trade-offs. (ii) RISING INTEREST RATES — as creditors worry about repayment, they demand higher yields; debt-service costs rise even faster, accelerating the problem (vicious cycle). (iii) CROWDING OUT — persistent government borrowing raises real interest rates, reducing private investment and slowing long-run growth — making debt-to-GDP harder to stabilize through GDP growth. (iv) SOVEREIGN DEBT CRISIS — at some threshold (varies by country), markets lose confidence; access to credit dries up; the country may default or require IMF/EU bailout (Greece 2010). (v) CURRENCY DEPRECIATION — countries that print money to repay debt cause inflation and currency depreciation. (vi) FUTURE FISCAL CONSTRAINT — high debt limits ability to respond to future recessions with stimulus.',
      responseFormat: 'free',
      hints: [
        'Compare debt growth to GDP growth.',
        'Sustainability requires debt to grow no faster than GDP.',
        'Consequences: debt service, interest rates, crowding-out, crisis.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-debt-good-bad',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Some economists argue that ALL government debt is harmful and should be paid down; others argue that some debt is fine, and certain types of debt-financed spending may even pay for themselves. (a) Make the case AGAINST government debt. (b) Make the case that SOME debt is acceptable or even desirable. (c) State which kinds of spending most plausibly justify debt financing.',
      expectedAnswer:
        '(a) AGAINST: debt creates future obligations that consume budget through interest payments. It crowds out private investment by raising real interest rates. It can constrain future fiscal policy by leaving less room for emergency response. It shifts burden to future taxpayers who didn\'t vote for the spending. Persistent peacetime debt at full employment may also contribute to higher inflation if monetary policy accommodates by printing money. Severe debt can lead to sovereign-debt crises. (b) SOME DEBT acceptable: (i) DURING RECESSIONS — fiscal stimulus financed by debt counter-cyclical, reducing the depth and length of downturns. The cost of inaction (lost output, prolonged unemployment) often exceeds the cost of debt service. (ii) FOR PRODUCTIVE INVESTMENT — debt that finances infrastructure, education, R&D, or public health raises future GDP. If the increase in future tax revenues exceeds debt service, the debt PAYS FOR ITSELF. Like a business borrowing to invest in productive capacity. (iii) WAR / EMERGENCY — financing wartime defense or disaster response cannot wait for tax revenue. (iv) INTERGENERATIONAL FAIRNESS WORKS BOTH WAYS — if today\'s debt finances long-lived public goods (a bridge, a hospital, an educated workforce), future generations benefit AND should help pay. (c) JUSTIFIABLE: long-lived productive investments — infrastructure (roads, ports, broadband), education, basic R&D, public health, climate adaptation. Less justifiable: deficits financing transfer payments at full employment, or operating spending that generates no future return. The COMPOSITION of debt-financed spending matters at least as much as the level. Strong answers articulate both sides + identify productive vs operating spending distinction.',
      responseFormat: 'frq',
      hints: [
        'Against: future cost, crowding out, fiscal constraint.',
        'For: counter-cyclical stabilization, productive investment, emergencies.',
        'Spending composition matters: investment vs operating.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Deficit (annual) ≠ Debt (cumulative). Debt-to-GDP normalizes by economy size.',
        'Sustainable: debt growth ≤ GDP growth.',
        'High debt: crowding out, debt service, fiscal constraint, possible crisis.',
        'Composition matters: productive investment can pay for itself; operating debt does not.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.3',
    cedTitle: 'Government Deficits and the National Debt',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '17', note: 'OpenStax Macro AP — government debt, sustainability, intergenerational reasoning.' },
    ],
  },
};
