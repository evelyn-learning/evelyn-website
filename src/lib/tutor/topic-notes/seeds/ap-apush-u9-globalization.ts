/**
 * AP US History — Unit 9 CED 9.4-9.5: Globalization, Technology, and a
 * Changing America.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.globalization-tech.v1`. Covers NAFTA/WTO and
 * deindustrialization, the PC/internet revolution, the post-1965
 * immigration demographic shift, Clinton-era budget/welfare policy, and
 * rising inequality — anchored by the DHS immigration-origins data table
 * (lawful permanent resident admissions only).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_GLOBALIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.globalization-tech.v1',
  course: 'AP United States History',
  cedUnit: 9,
  cedTopic: '9.4-9.5',
  cedTitle: 'Globalization, Technology, and a Changing America',
  planId: 'evelyn.ap.apush.globalization-tech.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.globalization-tech.v1' }],
  theory: [
    {
      loId: 'apush.globalization-tech',
      kind: 'definition',
      title: 'NAFTA',
      content:
        'The North American Free Trade Agreement (effective 1994), removing most tariffs on trade among the US, Canada, and Mexico. Supporters: lower prices, expanded exports. Critics: manufacturing job losses as production shifted to lower-wage locations. Both are recognized positions.',
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'definition',
      title: 'Immigration and Nationality Act of 1965',
      content:
        'Abolished the national-origins quota system that had favored European immigration since the 1920s, replacing it with family-reunification and skills-based criteria — the legal driver of the demographic shift toward Latin American/Asian-majority legal immigration visible by the 2000s.',
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'definition',
      title: 'welfare reform (1996)',
      content:
        "The Personal Responsibility and Work Opportunity Reconciliation Act, signed by Clinton, replacing open-ended federal cash assistance with time-limited, work-requirement-based state block grants — a still-debated change to the social safety net.",
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'event',
      title: 'deindustrialization and the "Rust Belt"',
      content:
        'US manufacturing employment declined from its mid-20th-century peak as production moved overseas or automated, hitting the industrial Midwest/Northeast hardest — part of a long-term shift toward a service/information economy, not a single-decade event.',
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'event',
      title: 'the PC and internet revolution',
      content:
        'Personal-computer ownership grew rapidly through the 1980s-90s (Apple, IBM PC, Windows); the 1990s saw commercialization and mass adoption of the internet (WWW, browsers, early e-commerce) — a defining transformation of the era\'s economy and daily life.',
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'event',
      title: 'Clinton-era budget surpluses',
      content:
        'Deficit reduction combined with strong 1990s growth (including from trade expansion and the tech boom) produced federal budget surpluses by the late 1990s — a marked change from the deficits of the 1980s (Unit 9.2-9.3).',
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'framework',
      title: 'the immigration-origins table: scope matters',
      content:
        'The DHS table used in this unit counts only persons obtaining LAWFUL PERMANENT RESIDENT status ("green cards") — 1960s: Europe 35% / Asia 11% / Latin America 39% / other 15%; 2000s: Europe 13% / Asia 34% / Latin America 41% / other 12%. It does NOT count temporary visa holders, refugees/asylees (tallied separately), or the undocumented population — its findings apply to legal permanent immigration specifically.',
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'framework',
      title: 'rising inequality is multi-causal',
      content:
        'Earnings for workers without a college degree grew more slowly than for highly educated/specialized workers, attributed to technological change (automation), globalization (production shifting abroad), and declining unionization together — no single explanation accounts for it alone.',
    },
    {
      loId: 'apush.globalization-tech',
      kind: 'trap',
      title: 'globalization\'s effects were uneven, not uniform',
      content:
        'Aggregate national growth in this period coexisted with sharply uneven regional and educational outcomes: manufacturing regions lost jobs while other sectors/regions gained, and non-college-educated workers\' earnings lagged behind — do not describe the period as a uniform national experience of either growth or loss.',
    },
  ],
  methods: [
    {
      title: 'Read a described data table for scope before drawing conclusions',
      when_to_use:
        'Use this before drawing any conclusion from a described data-table stimulus (a Quantitative Analysis document) — check exactly what population or category the table measures before generalizing.',
      steps: [
        'IDENTIFY EXACTLY WHAT THE TABLE COUNTS (e.g. lawful permanent resident admissions specifically, not all immigration).',
        'READ THE TREND ACROSS THE GIVEN PERIODS — which categories rose, which fell, and by how much.',
        'NAME A SPECIFIC LEGAL OR HISTORICAL CAUSE for the trend, not just a description of the numbers.',
        'STATE WHAT THE TABLE DOES NOT SHOW — the categories or populations it excludes — before generalizing beyond its actual scope.',
      ],
      example: {
        problem:
          'A DHS table shows legal permanent immigration shifting from Europe-majority (1960s) to Latin America/Asia-majority (2000s). What caused this, and what does the table not show?',
        solution:
          'The Immigration and Nationality Act of 1965 abolished the national-origins quota system favoring Europe, enabling the compositional shift the table documents. The table does not show temporary visa holders, refugees/asylees tallied separately, or the undocumented population — its findings apply only to lawful permanent resident admissions.',
      },
      relatedLoIds: ['apush.globalization-tech'],
    },
  ],
  pointers: [
    { content: 'The immigration-origins table counts LAWFUL PERMANENT RESIDENTS only — never generalize its figures to "all immigration."', kind: 'trap' },
    { content: 'The Immigration Act of 1965 is the legal cause of the demographic shift, even though the compositional change did not fully show up until decades later.', kind: 'tip' },
    { content: 'NAFTA/trade liberalization: state both the consumer-price/export benefit AND the manufacturing-job-loss critique — this course does not pick a winner.', kind: 'tip' },
    { content: '#1 trap: describing globalization-era growth as uniform. Regional (Rust Belt) and educational (college vs. non-college) divergence is the point.', kind: 'trap' },
    { content: 'Clinton-era budget surpluses (late 1990s) followed 1980s deficits (Unit 9.2-9.3) — sequence the two eras correctly on the exam.', kind: 'tip' },
  ],
};
