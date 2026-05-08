/**
 * AP Macroeconomics — CED Unit 2.3: Unemployment.
 *
 * Higher-density plan: unemployment carries multiple distinct AP
 * question-types — compute UR, compute LFPR, classify by type
 * (frictional/structural/cyclical), distinguish discouraged workers
 * from unemployed, define natural rate of unemployment. Four
 * try-yourselfs.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_UNEMPLOYMENT: LessonPlan = {
  id: 'evelyn.ap.macro.unemployment.v1',
  title: 'U2.3 Unemployment',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.unemployment',
      description:
        'Compute unemployment rate and labor force participation rate from BLS-style population data, classify unemployment by type (frictional, structural, cyclical), distinguish the unemployed from discouraged workers, and define the natural rate of unemployment.',
      standard: 'AP-MACRO-2.3',
    },
  ],
  prerequisites: ['apmacro.gdp-limitations'],
  followUps: ['apmacro.price-indices-inflation'],
  estimatedMinutes: 26,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make unemployment statistics feel less obvious than they look.',
      script:
        "When the news says \"unemployment is 4 percent,\" that is a precise statistic with a precise definition — not just \"4 percent of people don\'t have jobs.\" It does not count children, retirees, students who are not seeking work, stay-at-home parents, OR people who have given up looking. The official number is built from a specific set of inclusion-and-exclusion rules that AP loves to test.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-unemployment',
      kind: 'concept',
      goal: 'Cover the population breakdown, the two key rates, the three types, and the natural-rate concept.',
      keyIdeas: [
        'POPULATION CATEGORIES: total population breaks into (a) WORKING-AGE POPULATION (typically 16+) and (b) under-16. Within the working-age population: LABOR FORCE = employed + unemployed. NOT-IN-LABOR-FORCE = retirees, full-time students not seeking work, stay-at-home caregivers, discouraged workers, etc.',
        'EMPLOYED: someone with a paid job — full-time, part-time, or self-employed. Even one hour of paid work in the survey week counts as employed.',
        'UNEMPLOYED: someone who (a) does NOT have a job, (b) is AVAILABLE to work, AND (c) has actively LOOKED for work in the past 4 weeks. ALL THREE conditions must hold. Drop any one, and the person is NOT counted as unemployed.',
        'DISCOURAGED WORKERS: people who want a job, are available, but have STOPPED looking because they believe no jobs are available. They are NOT in the labor force and NOT counted as unemployed. The headline UR is criticized for this exclusion.',
        'UNEMPLOYMENT RATE (UR) = Unemployed / Labor Force × 100. NOT (Unemployed / Total Population) — that is a different and not-used statistic.',
        'LABOR FORCE PARTICIPATION RATE (LFPR) = Labor Force / Working-Age Population × 100. Tells you what FRACTION of the working-age population is engaged in the labor market at all.',
        'THREE TYPES OF UNEMPLOYMENT: (1) FRICTIONAL — short-term unemployment from people changing jobs, fresh graduates searching, etc. Always exists; some level is healthy.',
        '(2) STRUCTURAL — caused by mismatch between workers\' skills/locations and available jobs. Coal miners in a region pivoting to tech. Slower-resolving than frictional. Requires retraining or relocation.',
        '(3) CYCLICAL — caused by the business cycle. When real GDP falls below potential GDP (recession), firms lay off workers. Resolves as the economy recovers.',
        'NATURAL RATE OF UNEMPLOYMENT (NRU) = frictional + structural unemployment. The level the economy returns to when cyclical unemployment is zero. NOT zero — even a healthy economy has frictional and structural components. Estimated around 4-5% in the modern U.S.',
        'FULL EMPLOYMENT means cyclical unemployment is zero — actual UR equals NRU. Does NOT mean zero unemployment.',
      ],
      vocabulary: [
        { term: 'labor force', definition: 'the sum of employed and unemployed people aged 16+.' },
        { term: 'discouraged worker', definition: 'a person who wants a job and is available but has stopped actively looking — not counted in the labor force or in the official unemployment rate.' },
        { term: 'natural rate of unemployment', definition: 'frictional + structural unemployment combined; the rate that prevails when cyclical unemployment is zero.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rates',
      kind: 'worked_example',
      problem:
        'A small economy reports: total population 200 million; under-16 population 50 million; full-time students not seeking work 20 million; retired 30 million; discouraged workers 5 million; employed 90 million; unemployed actively job-searching 5 million. Compute (a) labor force, (b) unemployment rate, (c) labor force participation rate.',
      steps: [
        'STEP 1 — IDENTIFY working-age population. Total 200M − under-16 50M = 150M working-age.',
        'STEP 2 — IDENTIFY labor force. LF = employed + unemployed = 90M + 5M = 95M.',
        'STEP 3 — VERIFY non-labor-force adds up. Working-age 150M − LF 95M = 55M not-in-labor-force. Categories given: students 20M + retired 30M + discouraged 5M = 55M. ✓ Discouraged workers correctly excluded from LF.',
        'STEP 4 — UNEMPLOYMENT RATE. UR = (Unemployed / Labor Force) × 100 = (5 / 95) × 100 ≈ 5.26%. Round to 5.3%.',
        'STEP 5 — LABOR FORCE PARTICIPATION RATE. LFPR = (LF / Working-Age Population) × 100 = (95 / 150) × 100 ≈ 63.3%.',
        'STEP 6 — INTERPRET. The official UR of 5.3% understates "real" unemployment because the 5M discouraged workers (who want jobs but stopped looking) are excluded. If they were counted, "broader" UR would be (5+5)/(95+5) = 10%. AP usually wants the OFFICIAL number unless asked otherwise.',
      ],
      answer: 'LF = 95M. UR ≈ 5.3%. LFPR ≈ 63.3%.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'For each scenario, classify the worker\'s unemployment as FRICTIONAL, STRUCTURAL, or CYCLICAL. Briefly justify.',
      expectedAnswer:
        '(Examples — AP question would give 4-5 scenarios; sample answers below.) (a) "A recent college graduate spending two months interviewing for entry-level jobs": FRICTIONAL — short-term, arises from normal job-market matching, fresh entrant searching. (b) "A coal miner in West Virginia laid off after the local mine closes; coal demand structurally declining": STRUCTURAL — skills/location mismatched with where current jobs exist. (c) "A factory worker laid off when the firm\'s sales fall during a recession": CYCLICAL — driven by business-cycle downturn; resolves as economy recovers. (d) "A worker who quit to relocate with a spouse and is now job-searching in the new city": FRICTIONAL — voluntary transition, short-duration search.',
      responseFormat: 'free',
      hints: [
        'Frictional = short-term, normal turnover.',
        'Structural = persistent mismatch (skills, geography, technology).',
        'Cyclical = caused by recession / business cycle.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-discouraged',
      kind: 'try_yourself',
      problem:
        'Country A reports: working-age population 100M, employed 60M, unemployed (actively searching) 4M, discouraged workers (want job but stopped looking) 6M. (a) Compute the official UR. (b) The government redefines "unemployed" to include discouraged workers. Compute the broader UR under this redefinition. (c) Briefly explain why mainstream economists generally retain the narrower official definition.',
      expectedAnswer:
        '(a) Official UR: LF = 60 + 4 = 64M. UR = 4/64 × 100 = 6.25%. (b) Broader: include discouraged workers in BOTH numerator (now unemployed) AND denominator (now in labor force). LF\' = 60 + 4 + 6 = 70M; unemployed\' = 4 + 6 = 10M. UR\' = 10/70 × 100 ≈ 14.3%. (c) The narrower definition retains "actively searching in past 4 weeks" because it is OBJECTIVELY MEASURABLE — searching behavior is observable. "Wanting a job" is self-reported and harder to verify; counting it expands the rate dramatically and makes cross-country comparisons inconsistent. The BLS does publish broader rates (U-5, U-6) that include discouraged workers and underemployed for completeness, but the official headline U-3 is the strict definition. Strong answers articulate the measurement-rigor argument plus international comparability.',
      responseFormat: 'numeric',
      hints: [
        'Discouraged workers must be added to BOTH numerator and denominator under the broader definition.',
        'Why might the narrow definition be preferred for official statistics?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-natural-rate',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Define the natural rate of unemployment. Then explain why "full employment" does not mean a 0% unemployment rate. Use the three-types framework in your answer.',
      expectedAnswer:
        'NATURAL RATE OF UNEMPLOYMENT (NRU) = frictional unemployment + structural unemployment. It is the unemployment rate that prevails when cyclical unemployment is ZERO — when the economy is at potential output. Full employment in macroeconomics means actual UR = NRU, NOT actual UR = 0%. Why? Because frictional and structural unemployment NEVER go to zero in a real economy: (1) FRICTIONAL — there are always people transitioning between jobs, fresh graduates searching, voluntary movers. Some of this is even healthy — it represents workers finding better matches and the labor market adjusting. (2) STRUCTURAL — even in boom times, technology and trade create skill/location mismatches faster than retraining and relocation can resolve them. Some workers are in transition. Only CYCLICAL unemployment (the recession-caused kind) goes to zero at full employment. So full employment is NRU (estimated ~4-5% in the modern US) — not zero. Politicians who promise "zero unemployment" are either ignoring how labor markets work or being politically loose with terminology.',
      responseFormat: 'frq',
      hints: [
        'The natural rate equals which two of the three types?',
        'Which type is zero at "full employment"?',
        'Why are the other two never zero?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-stay-home',
      kind: 'misconception_check',
      question:
        'A stay-at-home parent who decides not to work in order to care for children full-time — is this person counted as UNEMPLOYED in official statistics?',
      commonErrors: [
        {
          answer: 'yes — they don\'t have a job, so they\'re unemployed',
          misconception:
            'Treating "no paid job" as equivalent to "unemployed." The official definition requires NOT JUST joblessness but ALSO active job-seeking.',
          correctsTo:
            'NO. To be officially UNEMPLOYED, a person must (a) lack a paid job, (b) be available to work, AND (c) have actively LOOKED for work in the past 4 weeks. A stay-at-home parent who has chosen not to seek paid work fails condition (c) and is therefore NOT in the labor force at all — neither employed nor unemployed. They are simply outside the labor market. Same applies to retirees, full-time students not job-hunting, and people on long-term leave. AP frequently tests this distinction; treating "no job" as "unemployed" is one of the most common point-losing errors. Note: this also means LFPR captures people\'s ENGAGEMENT with the labor market, not just whether they have jobs.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'UR = Unemployed / Labor Force × 100 (NOT / total population).',
        'LFPR = Labor Force / Working-Age Population × 100.',
        'Unemployed requires (no job) AND (available) AND (actively looking past 4 weeks).',
        'Discouraged workers: NOT in labor force, NOT counted as unemployed.',
        'Three types: frictional (transition), structural (mismatch), cyclical (recession).',
        'Natural rate = frictional + structural. Full employment = NRU ≠ 0%.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.3',
    cedTitle: 'Unemployment',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '8', note: 'OpenStax Macro AP — unemployment definitions, types, and natural rate.' },
    ],
  },
};
