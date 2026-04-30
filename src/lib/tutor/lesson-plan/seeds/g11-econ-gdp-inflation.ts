/**
 * G11 — Economics: GDP, inflation, unemployment.
 *
 * Three core macro indicators. GDP measures total economic output;
 * inflation measures rising prices; unemployment measures jobs
 * gap. How they\'re measured, what they mean, and how they\'re
 * related (Phillips curve intuition).
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ECON_GDP_INFLATION: LessonPlan = {
  id: 'evelyn.g11.ss.econ.gdp-inflation.v1',
  title: 'GDP, Inflation, and Unemployment',
  curriculum: 'state-standards',
  grade: '11',
  subject: 'social-studies',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'ss.g11.econ.macro-indicators',
      description: 'Define and interpret GDP, inflation rate, and unemployment rate.',
    },
  ],
  prerequisites: ['ss.g11.econ.supply-demand'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame these three indicators as the "vital signs" of an economy.',
      script: 'When a doctor checks you, they look at three vital signs — pulse, blood pressure, temperature. When economists check a country, they look at GDP, inflation, and unemployment. Almost every macroeconomic story you read is about one of these three (or how they affect each other).',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-indicators',
      kind: 'concept',
      goal: 'GDP definition + real vs nominal; inflation + CPI; unemployment definitions and limits.',
      keyIdeas: [
        'GDP (Gross Domestic Product): total value of all final goods and services produced WITHIN a country in a given period (usually a year).',
        '  NOMINAL GDP: at current prices.',
        '  REAL GDP: adjusted for inflation. The right measure for comparing across years.',
        '  GDP per CAPITA: GDP divided by population. Better measure of average prosperity.',
        '  Limits: ignores unpaid work, environmental damage, inequality.',
        'INFLATION: a general rise in prices over time. Measured by:',
        '  CPI (Consumer Price Index): tracks the cost of a standard "basket of goods". CPI inflation = % change year-over-year.',
        '  Modest inflation (2-3%) is normal and considered healthy.',
        '  HIGH inflation (10%+) erodes purchasing power; severe is HYPERINFLATION (Weimar Germany, Zimbabwe).',
        '  DEFLATION (negative inflation) sounds nice but causes economic problems (people delay purchases, debt becomes harder to repay).',
        'UNEMPLOYMENT RATE: % of the LABOR FORCE actively looking for work but not employed.',
        '  Labor force = working + actively job-hunting. NOT in labor force: retirees, full-time students, those who have stopped looking.',
        '  TYPES:',
        '    Frictional: between jobs (normal turnover).',
        '    Structural: skills mismatch (industries shifting).',
        '    Cyclical: economic downturn job losses.',
        '  FULL EMPLOYMENT ≠ 0% — usually 4-5% (accounts for frictional + structural).',
        'RELATIONSHIPS:',
        '  Phillips curve (loose): low unemployment ↔ higher inflation, and vice versa. Holds in some periods, breaks in others.',
        '  Stagflation: high unemployment + high inflation at the same time (1970s).',
        'BUSINESS CYCLE: economy oscillates between expansion (GDP growing, unemployment falling) and recession (GDP shrinking, unemployment rising). Recessions are usually defined as 2 consecutive quarters of GDP decline.',
      ],
      vocabulary: [
        { term: 'GDP', definition: 'total value of goods and services produced in a country.' },
        { term: 'real GDP', definition: 'GDP adjusted for inflation.' },
        { term: 'inflation', definition: 'general rise in prices over time.' },
        { term: 'unemployment rate', definition: 'percent of labor force seeking but not finding work.' },
        { term: 'recession', definition: 'a period of economic decline, usually 2+ quarters of falling GDP.' },
      ],
      suggestedTools: ['show_equation', 'show_table', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-real-vs-nominal',
      kind: 'worked_example',
      problem: 'In 2020 GDP was $20T (nominal). In 2024 it was $25T (nominal). Inflation between 2020 and 2024 totaled 18%. Did real GDP grow?',
      steps: [
        'NOMINAL grew: 25/20 = 25% increase.',
        'But 18% of that was just rising prices, not more output.',
        'Real growth: ~25% - 18% = ~7%. (Roughly. More precise: divide nominal GDP by price index.)',
        'Yes — real GDP grew about 7% over four years (~1.7% per year). Modest growth.',
      ],
      answer: '~7% real growth (small but positive)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A country has 100 people in its labor force. 95 are working, 5 are job-hunting, 30 are retirees. What\'s the unemployment rate?',
      expectedAnswer: '5%',
      responseFormat: 'numeric',
      hints: [
        'Unemployment rate = (job-hunters) / (labor force).',
        'Retirees aren\'t in the labor force — don\'t include them.',
        '5/100 = 5%.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-zero-unemployment',
      kind: 'misconception_check',
      question: 'Mira thinks "0% unemployment would be the goal of any healthy economy." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating zero unemployment as ideal.',
          correctsTo: 'Wrong. SOME unemployment is unavoidable and healthy. Frictional unemployment (people changing jobs) and structural unemployment (skills shifting) always exist. 0% unemployment would mean no one ever changed jobs — and would also signal extreme overheating that drives inflation up. Most economists target ~4-5% as "full employment."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'GDP = total output. Use REAL GDP (inflation-adjusted) for comparisons.',
        'Inflation = general price rise. Mild (2-3%) is healthy; high erodes purchasing power.',
        'Unemployment = % of labor force seeking work. ~4-5% is "full employment".',
        'Recession = 2+ quarters of falling GDP.',
        'Trade-offs exist between low unemployment and inflation (Phillips curve, with caveats).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the published unemployment rate often criticized as understating real labor-market problems?',
      hint: 'It excludes "discouraged workers" (those who gave up looking) and underemployed people (working part-time but want full-time). Alternative measures (U-6) include these and are usually higher.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
