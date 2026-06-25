/**
 * AP Macroeconomics — CED Unit 5.5: Crowding Out (Long-Run Focus).
 *
 * Builds on U3.8 (fiscal policy) and U4.7 (loanable funds). Here the
 * focus is on cumulative LONG-RUN effects of persistent deficits on
 * private investment and economic growth.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_CROWDING_OUT_LONG_RUN: LessonPlan = {
  id: 'evelyn.ap.macro.crowding-out-long-run.v1',
  title: 'U5.5 Crowding Out (Long-Run Focus)',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.crowding-out-long-run',
      description:
        'Apply the loanable funds market to predict long-run effects of persistent government deficits on private investment, real interest rates, and the capital stock; explain how reduced investment reduces long-run economic growth.',
      standard: 'AP-MACRO-5.5',
    },
  ],
  prerequisites: ['apmacro.deficits-debt'],
  followUps: ['apmacro.economic-growth'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish short-run crowding-out from long-run growth implications.',
      script:
        "Short-run crowding out is annoying — it makes fiscal stimulus less effective. Long-run crowding out is dangerous — it slowly shrinks the capital stock, slows productivity growth, and shrinks future GDP. The Unit 3 version of crowding out is a static snapshot. The Unit 5 version is the cumulative damage of running deficits year after year.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-long-run-crowding',
      kind: 'concept',
      goal: 'Cover the loanable-funds review, the cumulative capital-stock effect, and the LRAS implications.',
      keyIdeas: [
        'REVIEW (U3.8 / U4.7): when government runs a deficit, it BORROWS in the loanable funds market. Demand for loanable funds shifts RIGHT. Equilibrium real interest rate RISES. Higher r reduces private investment (I).',
        'SHORT-RUN crowding out: in a single period, fiscal stimulus financed by deficit produces some private I reduction that partially offsets the AD shift. The net AD effect is positive but smaller than the multiplier alone would imply.',
        'LONG-RUN crowding out: PERSISTENT deficits over many years cumulatively reduce private investment and slow capital accumulation. Less capital stock means lower labor productivity, lower potential GDP, and slower long-run growth. The economy\'s LRAS curve grows more slowly than it would have without persistent deficits.',
        'MECHANISM (year-by-year): Year 1 deficit shifts D right in loanable funds, raises r, reduces private I. Year 2 deficit does the same. After 10 years, private investment has been suppressed every year. The CAPITAL STOCK accumulates more slowly than it would have. Less capital per worker → lower productivity → lower long-run GDP.',
        'GROWTH-RATE EFFECT vs LEVEL EFFECT. Short-run crowding-out is mostly a LEVEL effect (one-period AD shift smaller than expected). Long-run crowding-out is a GROWTH-RATE effect — cumulative compounding suppression of investment.',
        'RICARDIAN EQUIVALENCE (a counterargument): some economists argue that rational households anticipate future tax increases needed to service deficit-financed spending, so they save more today to prepare. The increased private saving offsets the government dis-saving, leaving total loanable funds unchanged. If Ricardian equivalence held perfectly, crowding out would be zero. Empirical reality: partial — households save somewhat more, but not fully offsetting deficits.',
        'OFFSETTING FACTORS: (1) DEEP RECESSIONS — when slack exists, idle savings absorb deficits; r barely rises; crowding-out small. (2) FOREIGN CAPITAL inflows — if domestic deficits raise r, foreign savings flow in seeking the higher return; foreign-funded loanable supply rises; r rises less than otherwise. The U.S. has historically attracted significant foreign capital, partially offsetting domestic crowding-out. (3) DEBT-FINANCED INVESTMENT — if government spending itself is productive (infrastructure, R&D, education), it raises LRAS. Net effect on long-run output depends on whether the productivity gain exceeds the private-investment loss.',
        'POLICY IMPLICATION: large persistent peacetime deficits at full employment are MOST damaging via long-run crowding-out. Counter-cyclical deficits during recessions are LEAST damaging because they fill in slack rather than competing with productive private I.',
      ],
      vocabulary: [
        { term: 'long-run crowding out', definition: 'cumulative reduction in private investment and capital stock from persistent government deficits.' },
        { term: 'Ricardian equivalence', definition: 'the proposition that rational households offset government dis-saving with private saving, neutralizing crowding-out.' },
      ],
      suggestedTools: ['loanable_funds'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cumulative-effect',
      kind: 'worked_example',
      problem:
        "Country A and Country B both run identical fiscal deficits of 5% of GDP for 20 years. Country A is at full employment with strong private investment demand throughout. Country B is in a deep recession with weak loan demand throughout. (a) Identify the size of crowding-out in each country. (b) Predict the long-run effect on capital stock and potential GDP for each. (c) Identify which country experiences greater long-run damage from the persistent deficits.",
      steps: [
        'STEP 1 — COUNTRY A (full employment): private investment demand is strong; loanable funds market is tight. Government deficit shifts D RIGHT; with steep S curve, real r rises substantially; private I falls noticeably. Each year of deficit displaces meaningful private investment.',
        'STEP 2 — COUNTRY A long-run effect: capital stock grows more slowly than it would have without deficits. After 20 years, capital stock is materially lower; LRAS has grown more slowly; potential GDP is lower than the counterfactual. Significant long-run crowding-out.',
        'STEP 3 — COUNTRY B (deep recession): private investment demand is weak; the loanable funds market has substantial slack (idle savings). Government deficit shifts D right but r barely rises (S curve is flat in slack conditions). Private I is barely affected because it was already weak.',
        'STEP 4 — COUNTRY B long-run effect: capital stock not significantly suppressed by deficits because private I wasn\'t being deployed anyway. Furthermore, the deficit-financed stimulus may have prevented capital-stock erosion (factories closing during prolonged downturn). Long-run damage minimal; possibly even net positive.',
        'STEP 5 — COMPARISON. Country A faces SUBSTANTIAL long-run damage from sustained deficits at full employment. Country B faces MINIMAL damage; in fact, the counter-cyclical use of deficits may have HELPED preserve long-run capital. The same fiscal action (5% deficits) has very different long-run consequences depending on the macroeconomic environment.',
        'STEP 6 — POLICY LESSON. AP wants you to know: deficits are most justifiable in deep recessions; least defensible at full employment. The same deficit number means different things in different conditions.',
      ],
      answer: 'Country A: substantial crowding-out, slower capital accumulation, lower long-run potential GDP. Country B: minimal damage, possibly net positive. Same deficits, very different long-run consequences.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-mechanism',
      kind: 'try_yourself',
      problem:
        'In your own words, describe the LONG-RUN crowding-out mechanism. Connect it to the loanable funds market AND to long-run economic growth.',
      expectedAnswer:
        'When the government runs persistent deficits, it borrows year after year in the loanable funds market. Each year, the government\'s borrowing demand shifts D rightward. With unchanged S, the equilibrium real interest rate rises. The higher real rate makes some private investment projects unprofitable; private I falls each year. Over decades, this cumulatively suppresses CAPITAL ACCUMULATION — fewer factories, machines, infrastructure, technology investment than would have happened without the deficits. A smaller capital stock means LOWER LABOR PRODUCTIVITY (less capital per worker). Lower productivity slows the growth of POTENTIAL GDP — LRAS shifts right more slowly than it otherwise would. The long-run effect is reduced long-run economic growth and a lower future standard of living. Strong answers connect: deficit → loanable funds D right → real r up → I down → capital stock smaller → productivity lower → potential GDP / LRAS lower.',
      responseFormat: 'free',
      hints: [
        'Trace the chain: deficit → loanable funds → r → I → capital stock → productivity → LRAS.',
        'It\'s the year-after-year accumulation that matters in the long run.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-context-dependence',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why is long-run crowding-out generally LARGER when an economy is at full employment than when it is in deep recession? Use the loanable funds market in your explanation.',
      expectedAnswer:
        'Long-run crowding-out is larger at full employment because the loanable funds market is TIGHT and real interest rates respond strongly to deficit-driven demand shifts. AT FULL EMPLOYMENT: private investment demand is strong (firms see profitable projects); supply of loanable funds is fully utilized; the supply curve is relatively STEEP (less slack to absorb additional borrowing without rate increases). When government deficit shifts D right, the equilibrium r rises substantially; private I falls notably. IN DEEP RECESSION: private investment demand is weak (firms see few profitable projects); savers are eager to lend at any reasonable rate; supply curve is FLAT (substantial slack). Government deficit shifts D right but r barely rises; private I is already low and unaffected. Empirical evidence: the U.S. ran very large deficits during 2009-2012 with very low and stable real interest rates — minimal crowding-out. The 1980s saw large deficits with rising real rates — meaningful crowding-out. The same deficit produces different levels of crowding-out depending on whether the economy is at potential or in a slump. Strong answers articulate the role of S-curve elasticity / market tightness, name the comparison with explicit mechanism.',
      responseFormat: 'frq',
      hints: [
        'Tight loanable funds market = steep S curve = large r response to D shift.',
        'Slack market = flat S curve = small r response.',
        'Reference real-world examples (1980s vs 2009-12).',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Long-run crowding-out: persistent deficits → cumulative suppression of private I → smaller capital stock → lower potential GDP.',
        'Mechanism: deficit → loanable funds D right → r up → I down → capital stock → productivity → LRAS.',
        'Magnitude depends on macroeconomic state: large at full employment; small in deep recession.',
        'Ricardian equivalence: counterargument that private saving offsets government dis-saving. Partial in practice.',
        'Productive deficit-financed spending (R&D, infrastructure) may offset the crowding-out via LRAS gains.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.5',
    cedTitle: 'Crowding Out',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '17', note: 'OpenStax Macro AP — long-run crowding-out, capital accumulation effects.' },
    ],
  },
};
