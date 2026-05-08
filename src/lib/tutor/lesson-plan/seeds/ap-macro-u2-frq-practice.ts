/**
 * AP Macroeconomics — Unit 2 FRQ Practice.
 *
 * End-of-unit consolidation: three FRQ-style problems exercising GDP
 * computation + composition, unemployment and labor-force calculations,
 * inflation/CPI, real-vs-nominal GDP, and business-cycle classification.
 * Modeled on documented past CB FRQ patterns; verbatim swap-in queued
 * for when scrape-ced-frqs.ts ships.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.macro.u2-frq-practice.v1',
  title: 'U2 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.u2-frq-practice',
      description:
        'Apply Unit 2 measurement concepts (GDP composition, unemployment, inflation, CPI, real-vs-nominal GDP, business cycle) to multi-part free-response problems with AP-style rubric scoring.',
      standard: 'AP-MACRO-2-FRQ',
    },
  ],
  prerequisites: [
    'apmacro.circular-flow-gdp',
    'apmacro.gdp-limitations',
    'apmacro.unemployment',
    'apmacro.price-indices-inflation',
    'apmacro.costs-of-inflation',
    'apmacro.real-vs-nominal-gdp',
    'apmacro.business-cycle',
  ],
  followUps: [],
  estimatedMinutes: 32,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set Unit 2 FRQ stakes — measurement is testable.',
      script:
        "Unit 2 FRQs are the most NUMERICAL part of AP Macro. You will be asked to compute GDP, unemployment rate, inflation rate, real vs nominal GDP, output gap. Show every formula and every plug-in. Partial credit accumulates. Three problems incoming, each modeled on past AP Macro patterns.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Refresher on Unit 2 calculation conventions and partial-credit rules.',
      keyIdeas: [
        'NUMERICAL FRQs reward (1) stating the formula explicitly, (2) substituting the given values, (3) computing the answer, (4) labeling units (% or $).',
        'GDP COMPOSITION questions ask you to identify what to INCLUDE and what to EXCLUDE. Be precise: transfer payments are NOT in G; intermediate goods are NOT counted; used goods are NOT counted; imports SUBTRACT.',
        'UNEMPLOYMENT questions: UR uses LABOR FORCE in the denominator (NOT total population). Discouraged workers are EXCLUDED.',
        'CPI / INFLATION: CPI uses a fixed basket; deflator uses current-year mix. Inflation rate = (new − old) / old × 100.',
        'REAL vs NOMINAL: Real = (Nominal / Deflator) × 100. In the base year, Real = Nominal.',
        'OUTPUT GAP = actual − potential. Sign matters: negative = recession, positive = overheating.',
        'WATCH UNITS: GDP in dollars or trillions; unemployment in percent; inflation in percent; CPI as an index.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-frq-gdp-compose',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 1 — GDP Composition + Computation. Country X reports for the year: consumption = $700B; private investment = $150B; government purchases = $200B; transfer payments = $100B; exports = $80B; imports = $150B; resales of used cars = $40B; intermediate goods purchased by firms = $250B. (a) Define GDP. (b) Compute the country\'s GDP using the expenditure approach. (c) Identify any items in the data above that should NOT be counted in GDP, and briefly justify each exclusion. (d) Country X\'s NX is negative. Explain in one sentence what NX < 0 implies about the country\'s trade situation.',
      expectedAnswer:
        '(a) GDP = market value of all final goods/services produced within a country in a given period (year/quarter). (1 point)\n(b) Y = C + I + G + NX. NX = X − M = $80 − $150 = −$70B. Y = $700 + $150 + $200 + (−$70) = $980B. (2 points: 1 for setup with formula, 1 for correct number)\n(c) Excluded items: TRANSFER PAYMENTS ($100B) — no production occurs, just government redistribution. USED-CAR RESALES ($40B) — those cars were counted in earlier years\' GDP when first produced; counting them again would double-count. INTERMEDIATE GOODS ($250B) — already embedded in the value of the final goods firms sell; counting separately would double-count. (3 points: 1 per correct exclusion + brief justification)\n(d) Negative NX means the country imports MORE than it exports — a trade DEFICIT. Domestic consumers and firms purchase more from foreign producers than foreign buyers purchase from domestic producers. (1 point)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'Y = C + I + G + NX. Identify each piece, exclude the rest.',
        'Be specific in the exclusion justifications: name the rule (no production, double-counting).',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-unemployment',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 2 — Unemployment + Labor Force. A country reports: total population 250M; under-16 population 60M; full-time students not seeking work 30M; retired 40M; discouraged workers 8M; employed 100M; unemployed (actively job-searching) 12M. (a) State the formula for the unemployment rate. (b) Compute the labor force, the unemployment rate (UR), and the labor force participation rate (LFPR). Show your work. (c) Suppose 4 of the 8M discouraged workers re-enter the labor force AND find jobs immediately. Compute the new UR and LFPR. (d) Identify whether each of the following is officially counted as unemployed in the original data: (i) a college student studying full-time who is not job-searching, (ii) a coal miner laid off two months ago who has been actively interviewing.',
      expectedAnswer:
        '(a) UR = (Unemployed / Labor Force) × 100. (1 point)\n(b) Working-age population = 250M − 60M = 190M. Labor Force = Employed + Unemployed = 100 + 12 = 112M. UR = (12 / 112) × 100 ≈ 10.71%. LFPR = (LF / Working-age) × 100 = (112 / 190) × 100 ≈ 58.95%. (3 points: 1 each for LF, UR, LFPR with calculation shown)\n(c) After 4M discouraged workers find jobs and re-enter: they MOVE from "not in LF" to "employed in LF." New employed = 104M; new unemployed = 12M; new LF = 116M; new working-age = 190M (unchanged). New UR = (12 / 116) × 100 ≈ 10.34%. New LFPR = (116 / 190) × 100 ≈ 61.05%. UR DROPS slightly (denominator grew but numerator unchanged); LFPR RISES (4M added to LF). (2 points: 1 for new UR, 1 for new LFPR with reasoning)\n(d) (i) NOT counted as unemployed — the student is not actively job-searching, so by definition not in the labor force. (ii) COUNTED as unemployed — the laid-off coal miner is actively job-searching (interviewing in past 4 weeks), available, and lacks a job. (2 points: 1 each with justification)\nTotal: 8 points.',
      responseFormat: 'numeric',
      hints: [
        'Labor force = employed + unemployed (NOT including discouraged or students or retired).',
        'When discouraged workers re-enter, they move into the LF — affects both numerator and denominator depending on whether they find work.',
        'Official "unemployed" requires (no job) + (available) + (actively looking past 4 weeks).',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-real-nominal',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 3 — CPI, Inflation, Real GDP. A country reports for the years 2022 (base) and 2026: 2022 nominal GDP = $800B, GDP deflator = 100. 2026 nominal GDP = $1,012B, GDP deflator = 115. CPI in 2022 = 100, CPI in 2026 = 120. (a) Compute real GDP in 2026. (b) Compute the real GDP growth rate from 2022 to 2026. (c) Compute the inflation rate over the period using CPI. (d) Compare the inflation rates implied by the GDP deflator (100 → 115) and the CPI (100 → 120). Why might these differ? Identify ONE specific reason.',
      expectedAnswer:
        '(a) Real GDP 2026 = (Nominal / Deflator) × 100 = (1012 / 115) × 100 = $880B. (2 points)\n(b) Real GDP 2022 = nominal in base year = $800B. Real growth = (880 − 800) / 800 × 100 = 10% over 4 years. Annualized ≈ 2.41% per year. (2 points: 1 for setup, 1 for correct number)\n(c) CPI inflation = (CPI_new − CPI_old) / CPI_old × 100 = (120 − 100) / 100 × 100 = 20%. (1 point)\n(d) Deflator-implied inflation: (115 − 100) / 100 × 100 = 15%. CPI implies 20%; deflator implies 15%. They differ by 5 pp. ONE reason (any of the following): (i) BASKET COVERAGE — CPI uses a fixed basket of consumer goods (includes imports); deflator uses current-year mix of all DOMESTIC production (excludes imports, includes capital goods + government). If imported goods\' prices rose faster, CPI would rise faster than the deflator. (ii) SUBSTITUTION — CPI fixed basket misses consumers shifting away from goods whose prices rose; deflator captures this and tends to read lower in such cases. (iii) WEIGHT DIFFERENCES — even for the same goods, CPI and deflator weight them differently (CPI by base-year quantities, deflator by current-year quantities). Strong answers cite a specific mechanism, not just "they use different baskets." (2 points: 1 for the correct numerical comparison, 1 for a specific mechanism explaining the divergence)\nTotal: 7 points.',
      responseFormat: 'numeric',
      hints: [
        'Real GDP = (Nominal / Deflator) × 100.',
        'Inflation rate uses (new − old) / old × 100.',
        'For (d), think about WHAT is in the CPI basket vs the deflator\'s basket.',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Always state the formula → substitute → compute → label units. Partial credit at every step.',
        'Y = C + I + G + NX. Exclude transfers, used goods, intermediate goods.',
        'UR uses Labor Force in denominator. LFPR uses Working-Age Population.',
        'Real GDP = (Nominal / Deflator) × 100. Real growth uses real values.',
        'Output gap negative → recession. Positive → overheating.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-FRQ',
    cedTitle: 'Unit 2 FRQ Practice',
    sources: [
      { type: 'frq-style', source: 'AP Plans Initiative author', note: 'Three multi-part problems modeled on documented past AP Macro Unit-2 FRQ patterns. Verbatim CB FRQs to swap in once scrape-ced-frqs.ts ships.' },
    ],
  },
};
