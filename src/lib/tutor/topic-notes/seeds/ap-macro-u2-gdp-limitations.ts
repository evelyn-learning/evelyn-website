/**
 * AP Macroeconomics — Unit 2 CED 2.2: Limitations of GDP.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.gdp-limitations.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.gdp-limitations.v1' }],
  theory: [
    { loId: 'apmacro.gdp-limitations', content: `THE CORE FRAME: GDP is a TOTAL-PRODUCTION number, not a WELL-BEING number. Two countries with identical GDP per capita can have very different lived experiences. AP tests "name specific things GDP misses" — pair each limitation with a concrete example.` },
    { loId: 'apmacro.gdp-limitations', content: `NON-MARKET PRODUCTION: GDP excludes work that never passes through markets — parents caring for their own children, cleaning your own house, growing your own food. Paying a daycare for the SAME child care adds to GDP; doing it yourself adds nothing. Economies with more home production show artificially LOW GDP.` },
    { loId: 'apmacro.gdp-limitations', content: `LEISURE: GDP counts what is produced, not the time left to enjoy it. A country working sixty-hour weeks may out-produce one working thirty-five-hour weeks, yet the second may have higher overall well-being. GDP is silent on work-life balance.` },
    { loId: 'apmacro.gdp-limitations', content: `ENVIRONMENTAL DAMAGE: GDP counts the value of production but never SUBTRACTS resource depletion or pollution. Clear-cutting a forest and selling the timber ADDS to GDP; the loss of the forest subtracts nothing. A coal plant's electricity counts; its health damages do not.` },
    { loId: 'apmacro.gdp-limitations', content: `INCOME DISTRIBUTION: GDP per capita is an AVERAGE and says nothing about who gets the income. The same average is consistent with extreme concentration (a small share earning most of the income) or an even spread — GDP looks identical in both cases; median experiences differ enormously.` },
    { loId: 'apmacro.gdp-limitations', content: `UNDERGROUND / ILLEGAL ECONOMY: cash-only services, unreported informal work, and illegal markets involve real production and consumption but appear nowhere in official GDP.` },
    { loId: 'apmacro.gdp-limitations', content: `QUALITY CHANGES are imperfectly captured: a current smartphone is dramatically better than one from fifteen years ago, but if both sold at the same price GDP sees no improvement. Statistical agencies adjust for quality, imperfectly.` },
    { loId: 'apmacro.gdp-limitations', content: `PRODUCT-MIX BLINDNESS: a tank and a hospital wing of equal cost add EQUALLY to GDP despite very different well-being effects. GDP is morally neutral about WHAT is produced.` },
    { loId: 'apmacro.gdp-limitations', content: `WHY GDP IS STILL USED: (a) RELIABLY MEASURABLE from recorded market transactions; (b) INTERNATIONALLY COMPARABLE — common UN methodology across countries; (c) TIMELY — quarterly with a short lag, while inequality or life-expectancy data update slowly; (d) CORRELATED (imperfectly) with health, education, food security, and life expectancy; (e) POLICY-RESPONSIVE within months. A flawed thermometer, but a usable one.` },
    { loId: 'apmacro.gdp-limitations', kind: 'definition', title: 'non-market production', content: `goods and services produced outside formal markets — household work, volunteer labor, subsistence farming.` },
    { loId: 'apmacro.gdp-limitations', kind: 'definition', title: 'underground economy', content: `unreported or illegal economic activity not captured in official statistics.` },
  ],
  methods: [
    {
      title: 'Compare two equal-GDP countries on well-being dimensions',
      steps: [
        `STEP 1 — NOTE the setup: identical GDP per capita means GDP alone cannot rank the countries.`,
        `STEP 2 — SCAN the scenario for the canonical missing dimensions: work hours/vacation (LEISURE), pollution (ENVIRONMENT), income concentration (DISTRIBUTION), home/volunteer work (NON-MARKET), unreported activity (UNDERGROUND), what is produced (PRODUCT MIX).`,
        `STEP 3 — For each dimension found, STATE the concrete difference AND NAME the GDP limitation it maps to ("thirteen fewer weekly work hours → GDP misses leisure").`,
        `STEP 4 — CONCLUDE with the frame: same production total, different lived experience — GDP measures production, not well-being.`,
      ],
      example: {
        problem: `Countries X and Y have identical GDP per capita. X: forty-five-hour weeks, high pollution, top decile earns half of all income, ten vacation days. Y: thirty-two-hour weeks, clean air, top decile earns a quarter of income, thirty vacation days. Identify four well-being dimensions where Y plausibly leads, naming the GDP limitation each maps to.`,
        solution: `(1) Leisure — Y works thirteen fewer hours weekly with twenty more vacation days (GDP misses leisure). (2) Environmental quality — Y's clean air vs X's pollution (GDP ignores environmental damage). (3) Distribution — Y's income far less concentrated; the identical average masks different medians (GDP per capita is an average). (4) Non-market production — Y's extra time off enables parenting, community, home production GDP never counts. Same GDP, different well-being.`,
      },
      relatedLoIds: ['apmacro.gdp-limitations'],
    },
  ],
  pointers: [
    { content: 'Memorize the seven misses: non-market work, leisure, environment, distribution, underground economy, quality changes, product mix.', kind: 'tip' },
    { content: 'On FRQs, PAIR each limitation with a concrete example — the term alone scores less.', kind: 'tip' },
    { content: 'GDP = production, not well-being. Identical GDP per capita can hide opposite lived experiences.', kind: 'tip' },
    { content: 'Classic contrast: paid daycare counts in GDP; identical care by a parent does not.', kind: 'tip' },
    { content: 'Why still use GDP: measurable, comparable, timely, correlated with what we care about.', kind: 'tip' },
  ],
};
