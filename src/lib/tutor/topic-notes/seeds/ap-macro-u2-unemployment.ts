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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.unemployment.v1' }],
  theory: [
    { loId: 'apmacro.unemployment', content: `POPULATION BREAKDOWN: total population = WORKING-AGE population (sixteen and over) + under-sixteen. Within working-age: LABOR FORCE = employed + unemployed; NOT-IN-LABOR-FORCE = retirees, full-time students not seeking work, stay-at-home caregivers, discouraged workers.` },
    { loId: 'apmacro.unemployment', content: `EMPLOYED: anyone with a paid job — full-time, part-time, or self-employed. Even ONE hour of paid work in the survey week counts as employed.` },
    { loId: 'apmacro.unemployment', content: `UNEMPLOYED requires ALL THREE conditions: (a) NO paid job, (b) AVAILABLE to work, (c) ACTIVELY LOOKED for work in the past four weeks. Drop any one and the person is NOT unemployed — they are simply out of the labor force. "No job" alone does NOT mean unemployed.` },
    { loId: 'apmacro.unemployment', content: `DISCOURAGED WORKERS: want a job and are available but have STOPPED looking (believe none are available). NOT in the labor force, NOT counted as unemployed — a standard criticism of the headline rate. Counting them requires adding them to BOTH numerator and denominator, which raises the measured rate substantially.` },
    { loId: 'apmacro.unemployment', content: `UNEMPLOYMENT RATE: $UR = \\frac{\\text{unemployed}}{\\text{labor force}} \\times 100$. The denominator is the LABOR FORCE, never the total population.` },
    { loId: 'apmacro.unemployment', content: `LABOR FORCE PARTICIPATION RATE: $LFPR = \\frac{\\text{labor force}}{\\text{working-age population}} \\times 100$ — the fraction of the working-age population engaged with the labor market at all (working OR searching).` },
    { loId: 'apmacro.unemployment', content: `FRICTIONAL UNEMPLOYMENT: short-term, from normal turnover — people between jobs, fresh graduates searching, voluntary movers. Always exists; some is HEALTHY (better matches forming).` },
    { loId: 'apmacro.unemployment', content: `STRUCTURAL UNEMPLOYMENT: a MISMATCH between workers' skills or locations and available jobs — coal miners in a region pivoting to tech. Slower to resolve than frictional; requires retraining or relocation. Technology and trade regenerate it even in booms.` },
    { loId: 'apmacro.unemployment', content: `CYCLICAL UNEMPLOYMENT: caused by the business cycle — when real GDP falls below potential, firms lay workers off. Resolves as the economy recovers. Cyclical UE = actual UR − natural rate (can be NEGATIVE when the economy overheats).` },
    { loId: 'apmacro.unemployment', content: `NATURAL RATE OF UNEMPLOYMENT (NRU) = frictional + structural. The rate prevailing when cyclical unemployment is ZERO. Roughly four to five percent in the modern US. FULL EMPLOYMENT means actual UR = NRU — NOT zero unemployment; frictional and structural components never vanish.` },
    { loId: 'apmacro.unemployment', kind: 'definition', title: 'labor force', content: `the sum of employed and unemployed people aged sixteen and over.` },
    { loId: 'apmacro.unemployment', kind: 'definition', title: 'discouraged worker', content: `a person who wants a job and is available but has stopped actively looking — not in the labor force, not in the official unemployment rate.` },
    { loId: 'apmacro.unemployment', kind: 'definition', title: 'natural rate of unemployment', content: `frictional + structural unemployment; the rate when cyclical unemployment is zero.` },
  ],
  methods: [
    {
      title: 'Compute UR and LFPR from BLS-style population data',
      steps: [
        `STEP 1 — WORKING-AGE POPULATION = total population − under-sixteen.`,
        `STEP 2 — LABOR FORCE = employed + unemployed (only those meeting all three unemployment conditions). Leave discouraged workers, students, and retirees OUT.`,
        `STEP 3 — CROSS-CHECK: working-age − labor force should equal the sum of the not-in-labor-force groups given (students + retired + discouraged).`,
        `STEP 4 — $UR = \\frac{\\text{unemployed}}{\\text{labor force}} \\times 100$.`,
        `STEP 5 — $LFPR = \\frac{\\text{labor force}}{\\text{working-age population}} \\times 100$.`,
        `STEP 6 — If asked for a BROADER rate including discouraged workers: add them to BOTH the unemployed count and the labor force, then recompute. AP wants the OFFICIAL rate unless it explicitly asks otherwise.`,
      ],
      example: {
        problem: `An economy has (in millions): total population 200, under-sixteen 50, students not seeking work 20, retired 30, discouraged workers 5, employed 90, unemployed actively searching 5. Find the labor force, UR, and LFPR.`,
        solution: `Working-age = 200 − 50 = 150. Labor force = 90 + 5 = 95 (check: 150 − 95 = 55 = 20 + 30 + 5). UR = 5/95 ≈ 5.3 percent. LFPR = 95/150 ≈ 63.3 percent. Broader rate with discouraged workers counted: (5+5)/(95+5) = 10 percent.`,
      },
      relatedLoIds: ['apmacro.unemployment'],
    },
    {
      title: 'Classify an unemployment scenario as frictional, structural, or cyclical',
      steps: [
        `STEP 1 — ASK WHY the person lacks work: normal transition, skill/location mismatch, or economy-wide downturn?`,
        `STEP 2 — FRICTIONAL markers: short-term, voluntary quit, new graduate, relocation search — normal turnover.`,
        `STEP 3 — STRUCTURAL markers: industry decline, automation, skills obsolete, wrong region — the JOB ITSELF is gone or moved, not coming back with recovery.`,
        `STEP 4 — CYCLICAL markers: layoffs tied to falling sales in a recession; the job returns when demand recovers.`,
        `STEP 5 — JUSTIFY with the marker, not just the label ("structural — coal demand is permanently declining, so his skills no longer match available jobs").`,
      ],
      example: {
        problem: `Classify: (a) a graduate spending two months interviewing; (b) a coal miner laid off as the local mine permanently closes; (c) a factory worker laid off when recession cuts the firm's sales.`,
        solution: `(a) FRICTIONAL — normal entry search, short-term matching. (b) STRUCTURAL — skills/location mismatched with where jobs now exist; recovery alone will not restore the mine. (c) CYCLICAL — downturn-driven; resolves as the economy recovers.`,
      },
      relatedLoIds: ['apmacro.unemployment'],
    },
  ],
  pointers: [
    { content: 'UR = unemployed / LABOR FORCE × 100 — never divide by total population.', kind: 'tip' },
    { content: 'Unemployed = no job AND available AND searched in the past four weeks. All three.', kind: 'tip' },
    { content: 'Discouraged workers and stay-at-home parents are NOT unemployed — they are out of the labor force.', kind: 'tip' },
    { content: 'Natural rate = frictional + structural. Full employment = UR at NRU, not zero.', kind: 'tip' },
    { content: 'Cyclical UE = actual UR − NRU; it can go negative when the economy runs hot.', kind: 'tip' },
    { content: 'Broader rates add discouraged workers to BOTH numerator and denominator.', kind: 'tip' },
  ],
};
