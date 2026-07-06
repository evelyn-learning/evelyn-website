/**
 * AP Macroeconomics — Unit 2 CED 2.3: Unemployment.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.unemployment.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_UNEMPLOYMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.unemployment.v1',
  course: 'AP Macroeconomics',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Unemployment',
  planId: 'evelyn.ap.macro.unemployment.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.unemployment.v1' }],
  theory: [
    { loId: 'apmacro.unemployment', content: `POPULATION CATEGORIES: total population breaks into (a) WORKING-AGE POPULATION (typically 16+) and (b) under-16. Within the working-age population: LABOR FORCE = employed + unemployed. NOT-IN-LABOR-FORCE = retirees, full-time students not seeking work, stay-at-home caregivers, discouraged workers, etc.` },
    { loId: 'apmacro.unemployment', content: `EMPLOYED: someone with a paid job — full-time, part-time, or self-employed. Even one hour of paid work in the survey week counts as employed.` },
    { loId: 'apmacro.unemployment', content: `UNEMPLOYED: someone who (a) does NOT have a job, (b) is AVAILABLE to work, AND (c) has actively LOOKED for work in the past 4 weeks. ALL THREE conditions must hold. Drop any one, and the person is NOT counted as unemployed.` },
    { loId: 'apmacro.unemployment', content: `DISCOURAGED WORKERS: people who want a job, are available, but have STOPPED looking because they believe no jobs are available. They are NOT in the labor force and NOT counted as unemployed. The headline UR is criticized for this exclusion.` },
    { loId: 'apmacro.unemployment', content: `UNEMPLOYMENT RATE (UR) = Unemployed / Labor Force × 100. NOT (Unemployed / Total Population) — that is a different and not-used statistic.` },
    { loId: 'apmacro.unemployment', content: `LABOR FORCE PARTICIPATION RATE (LFPR) = Labor Force / Working-Age Population × 100. Tells you what FRACTION of the working-age population is engaged in the labor market at all.` },
    { loId: 'apmacro.unemployment', content: `THREE TYPES OF UNEMPLOYMENT: (1) FRICTIONAL — short-term unemployment from people changing jobs, fresh graduates searching, etc. Always exists; some level is healthy.` },
    { loId: 'apmacro.unemployment', content: `(2) STRUCTURAL — caused by mismatch between workers' skills/locations and available jobs. Coal miners in a region pivoting to tech. Slower-resolving than frictional. Requires retraining or relocation.` },
    { loId: 'apmacro.unemployment', content: `(3) CYCLICAL — caused by the business cycle. When real GDP falls below potential GDP (recession), firms lay off workers. Resolves as the economy recovers.` },
    { loId: 'apmacro.unemployment', content: `NATURAL RATE OF UNEMPLOYMENT (NRU) = frictional + structural unemployment. The level the economy returns to when cyclical unemployment is zero. NOT zero — even a healthy economy has frictional and structural components. Estimated around 4-5% in the modern U.S.` },
    { loId: 'apmacro.unemployment', content: `FULL EMPLOYMENT means cyclical unemployment is zero — actual UR equals NRU. Does NOT mean zero unemployment.` },
    { loId: 'apmacro.unemployment', kind: 'definition', title: 'labor force', content: 'the sum of employed and unemployed people aged 16+.' },
    { loId: 'apmacro.unemployment', kind: 'definition', title: 'discouraged worker', content: `a person who wants a job and is available but has stopped actively looking — not counted in the labor force or in the official unemployment rate.` },
    { loId: 'apmacro.unemployment', kind: 'definition', title: 'natural rate of unemployment', content: `frictional + structural unemployment combined; the rate that prevails when cyclical unemployment is zero.` },
  ],
  methods: [
    {
      title: 'Worked rates',
      steps: [
        `STEP 1 — IDENTIFY working-age population. Total 200M − under-16 50M = 150M working-age.`,
        'STEP 2 — IDENTIFY labor force. LF = employed + unemployed = 90M + 5M = 95M.',
        `STEP 3 — VERIFY non-labor-force adds up. Working-age 150M − LF 95M = 55M not-in-labor-force. Categories given: students 20M + retired 30M + discouraged 5M = 55M. ✓ Discouraged workers correctly excluded from LF.`,
        `STEP 4 — UNEMPLOYMENT RATE. UR = (Unemployed / Labor Force) × 100 = (5 / 95) × 100 ≈ 5.26%. Round to 5.3%.`,
        `STEP 5 — LABOR FORCE PARTICIPATION RATE. LFPR = (LF / Working-Age Population) × 100 = (95 / 150) × 100 ≈ 63.3%.`,
        `STEP 6 — INTERPRET. The official UR of 5.3% understates "real" unemployment because the 5M discouraged workers (who want jobs but stopped looking) are excluded. If they were counted, "broader" UR would be (5+5)/(95+5) = 10%. AP usually wants the OFFICIAL number unless asked otherwise.`,
      ],
      example: { problem: `A small economy reports: total population 200 million; under-16 population 50 million; full-time students not seeking work 20 million; retired 30 million; discouraged workers 5 million; employed 90 million; unemployed actively job-searching 5 million. Compute (a) labor force, (b) unemployment rate, (c) labor force participation rate.`, solution: 'LF = 95M. UR ≈ 5.3%. LFPR ≈ 63.3%.' },
      relatedLoIds: ['apmacro.unemployment'],
    },
  ],
  pointers: [
    { content: 'UR = Unemployed / Labor Force × 100 (NOT / total population).', kind: 'tip' },
    { content: 'LFPR = Labor Force / Working-Age Population × 100.', kind: 'tip' },
    { content: `Unemployed requires (no job) AND (available) AND (actively looking past 4 weeks).`, kind: 'tip' },
    { content: 'Discouraged workers: NOT in labor force, NOT counted as unemployed.', kind: 'tip' },
    { content: `Three types: frictional (transition), structural (mismatch), cyclical (recession).`, kind: 'tip' },
    { content: 'Natural rate = frictional + structural. Full employment = NRU ≠ 0%.', kind: 'tip' },
  ],
};
