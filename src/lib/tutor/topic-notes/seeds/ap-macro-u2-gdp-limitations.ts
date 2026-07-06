/**
 * AP Macroeconomics — Unit 2 CED 2.2: Limitations of GDP.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.gdp-limitations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_GDP_LIMITATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.gdp-limitations.v1',
  course: 'AP Macroeconomics',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Limitations of GDP',
  planId: 'evelyn.ap.macro.gdp-limitations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.gdp-limitations.v1' }],
  theory: [
    { loId: 'apmacro.gdp-limitations', content: `NON-MARKET PRODUCTION: GDP excludes work that does not pass through markets — child care done by parents, cleaning your own house, growing your own food. Economies with more home production have artificially LOW GDP relative to ones that buy the same services.` },
    { loId: 'apmacro.gdp-limitations', content: `LEISURE: GDP counts what you produce, not the time you have to enjoy it. A country that works 60-hour weeks may have higher GDP than one with 35-hour weeks, but the latter may have higher overall well-being.` },
    { loId: 'apmacro.gdp-limitations', content: `ENVIRONMENTAL DAMAGE: GDP counts the value of production but not the resource depletion or pollution caused. Cutting down a forest and selling the timber adds to GDP; the loss of the forest does not subtract.` },
    { loId: 'apmacro.gdp-limitations', content: `INCOME DISTRIBUTION: GDP per capita is an AVERAGE — it is silent on who gets the income. A country with $80K per capita could be 10% earning $700K and 90% earning $10K, or evenly distributed. GDP looks the same.` },
    { loId: 'apmacro.gdp-limitations', content: `UNDERGROUND / ILLEGAL ECONOMY: cash-only services, drug markets, unreported informal work. None counted, but they involve real production and consumption.` },
    { loId: 'apmacro.gdp-limitations', content: `QUALITY CHANGES are imperfectly captured. A 2026 smartphone is dramatically better than a 2010 phone but if both sell for $700, GDP only sees the price. Statistical agencies try to adjust for quality, but imperfectly.` },
    { loId: 'apmacro.gdp-limitations', content: `PRODUCT-MIX BLINDNESS: building a tank costs the same as building a hospital wing — both add to GDP equally — but they have very different effects on well-being. GDP is morally neutral.` },
    { loId: 'apmacro.gdp-limitations', content: `WHY WE STILL USE IT: GDP is RELIABLY MEASURABLE, internationally comparable, available in near-real-time, and correlated (imperfectly) with most things people care about — health, education, life expectancy, food security. It is a flawed thermometer, but a usable one.` },
    { loId: 'apmacro.gdp-limitations', kind: 'definition', title: 'non-market production', content: `goods and services produced outside formal markets — household work, volunteer labor, subsistence farming.` },
    { loId: 'apmacro.gdp-limitations', kind: 'definition', title: 'underground economy', content: 'unreported or illegal economic activity not captured in official statistics.' },
  ],
  methods: [
    {
      title: 'Worked limits',
      steps: [
        `DIMENSION 1 — leisure: Y has 32-hour weeks vs X's 45 → 13 fewer work hours weekly + 20 more vacation days yearly. GDP misses LEISURE.`,
        `DIMENSION 2 — environmental quality: Y has clean air vs X's high pollution. Lung-disease rates and quality-of-life implications. GDP misses ENVIRONMENTAL DAMAGE.`,
        `DIMENSION 3 — income distribution: Y's top 10% gets 25% of income vs X's 50%. The "average" $50K masks vastly different median experiences. GDP misses INCOME DISTRIBUTION.`,
        `DIMENSION 4 — non-market value of leisure-enabled activities: with more time off, Y's residents likely produce more non-market goods (parenting time, community involvement, home cooking) that GDP does not count but contribute to well-being. GDP misses NON-MARKET PRODUCTION.`,
        `INTERPRETATION: identical GDP, very different lived experiences. The exercise shows GDP is a TOTAL-PRODUCTION number, not a WELL-BEING number. Both countries produce the same dollar value; what they produce, who gets it, and at what cost to time and environment differ substantially.`,
      ],
      example: { problem: `Two countries each have GDP per capita of $50,000. Country X: average workweek 45 hours; high pollution; very unequal income (top 10% gets 50% of total income); typical worker has 10 days vacation. Country Y: average workweek 32 hours; clean air; moderate inequality (top 10% gets 25%); typical worker has 30 days vacation. GDP says they are equal. Identify FOUR specific dimensions in which Y is plausibly higher in well-being than X, and name the GDP limitation each maps to.`, solution: `Four dimensions: leisure (Y has more), environmental quality (Y is cleaner), income distribution (Y is more even), non-market production (Y's extra leisure enables more). Same GDP, different well-being.` },
      relatedLoIds: ['apmacro.gdp-limitations'],
    },
  ],
  pointers: [
    { content: `GDP misses: non-market production, leisure, environment, distribution, underground/illegal, quality changes, product mix.`, kind: 'tip' },
    { content: 'GDP is a PRODUCTION number, not a WELL-BEING number.', kind: 'tip' },
    { content: `It survives despite limits because it is measurable, comparable, timely, and correlated with what we care about.`, kind: 'tip' },
  ],
};
