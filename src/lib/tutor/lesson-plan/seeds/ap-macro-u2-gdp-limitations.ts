/**
 * AP Macroeconomics — CED Unit 2.2: Limitations of GDP.
 *
 * Briefer plan covering what GDP does and does not capture about
 * well-being. AP frequently tests "name 2-3 things GDP misses" in
 * short FRQs, so try-yourselfs are calibrated to that exam form.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_GDP_LIMITATIONS: LessonPlan = {
  id: 'evelyn.ap.macro.gdp-limitations.v1',
  title: 'Limitations of GDP',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.gdp-limitations',
      description:
        'Identify specific dimensions of well-being and economic activity that GDP fails to capture, and articulate why GDP is still used despite these limitations.',
      standard: 'AP-MACRO-2.2',
    },
  ],
  prerequisites: ['apmacro.circular-flow-gdp'],
  followUps: ['apmacro.unemployment'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the limits of GDP feel concrete.',
      script:
        "GDP per capita in the United States is around $80,000. In Norway it is similar. But Norway has more leisure time, lower inequality, longer life expectancy, and cleaner air. GDP says they are roughly tied; quality of life suggests something more nuanced is going on. GDP is a useful number — but it is a number, not a verdict.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-limits',
      kind: 'concept',
      goal: 'Cover the seven canonical limitations of GDP and the rationale for still using it.',
      keyIdeas: [
        'NON-MARKET PRODUCTION: GDP excludes work that does not pass through markets — child care done by parents, cleaning your own house, growing your own food. Economies with more home production have artificially LOW GDP relative to ones that buy the same services.',
        'LEISURE: GDP counts what you produce, not the time you have to enjoy it. A country that works 60-hour weeks may have higher GDP than one with 35-hour weeks, but the latter may have higher overall well-being.',
        'ENVIRONMENTAL DAMAGE: GDP counts the value of production but not the resource depletion or pollution caused. Cutting down a forest and selling the timber adds to GDP; the loss of the forest does not subtract.',
        'INCOME DISTRIBUTION: GDP per capita is an AVERAGE — it is silent on who gets the income. A country with $80K per capita could be 10% earning $700K and 90% earning $10K, or evenly distributed. GDP looks the same.',
        'UNDERGROUND / ILLEGAL ECONOMY: cash-only services, drug markets, unreported informal work. None counted, but they involve real production and consumption.',
        'QUALITY CHANGES are imperfectly captured. A 2026 smartphone is dramatically better than a 2010 phone but if both sell for $700, GDP only sees the price. Statistical agencies try to adjust for quality, but imperfectly.',
        'PRODUCT-MIX BLINDNESS: building a tank costs the same as building a hospital wing — both add to GDP equally — but they have very different effects on well-being. GDP is morally neutral.',
        'WHY WE STILL USE IT: GDP is RELIABLY MEASURABLE, internationally comparable, available in near-real-time, and correlated (imperfectly) with most things people care about — health, education, life expectancy, food security. It is a flawed thermometer, but a usable one.',
      ],
      vocabulary: [
        { term: 'non-market production', definition: 'goods and services produced outside formal markets — household work, volunteer labor, subsistence farming.' },
        { term: 'underground economy', definition: 'unreported or illegal economic activity not captured in official statistics.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-limits',
      kind: 'worked_example',
      problem:
        "Two countries each have GDP per capita of $50,000. Country X: average workweek 45 hours; high pollution; very unequal income (top 10% gets 50% of total income); typical worker has 10 days vacation. Country Y: average workweek 32 hours; clean air; moderate inequality (top 10% gets 25%); typical worker has 30 days vacation. GDP says they are equal. Identify FOUR specific dimensions in which Y is plausibly higher in well-being than X, and name the GDP limitation each maps to.",
      steps: [
        'DIMENSION 1 — leisure: Y has 32-hour weeks vs X\'s 45 → 13 fewer work hours weekly + 20 more vacation days yearly. GDP misses LEISURE.',
        'DIMENSION 2 — environmental quality: Y has clean air vs X\'s high pollution. Lung-disease rates and quality-of-life implications. GDP misses ENVIRONMENTAL DAMAGE.',
        'DIMENSION 3 — income distribution: Y\'s top 10% gets 25% of income vs X\'s 50%. The "average" $50K masks vastly different median experiences. GDP misses INCOME DISTRIBUTION.',
        'DIMENSION 4 — non-market value of leisure-enabled activities: with more time off, Y\'s residents likely produce more non-market goods (parenting time, community involvement, home cooking) that GDP does not count but contribute to well-being. GDP misses NON-MARKET PRODUCTION.',
        'INTERPRETATION: identical GDP, very different lived experiences. The exercise shows GDP is a TOTAL-PRODUCTION number, not a WELL-BEING number. Both countries produce the same dollar value; what they produce, who gets it, and at what cost to time and environment differ substantially.',
      ],
      answer:
        'Four dimensions: leisure (Y has more), environmental quality (Y is cleaner), income distribution (Y is more even), non-market production (Y\'s extra leisure enables more). Same GDP, different well-being.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-name-three',
      kind: 'try_yourself',
      problem:
        'Name THREE specific things GDP fails to capture. For each, give a brief example illustrating what gets missed.',
      expectedAnswer:
        'Three of the seven canonical limitations, each with a specific example. Examples: (1) Non-market production — a parent staying home to care for children produces real value but generates zero GDP, while paying a daycare for the same care does add to GDP. (2) Environmental damage — a coal plant that produces $1B of electricity adds $1B to GDP but its air pollution costs ($X in health damages) are not subtracted. (3) Income distribution — two countries with identical GDP per capita can have very different median incomes if inequality differs. Other valid: leisure, illegal/underground economy, quality changes, product mix. Strong answers PAIR each limitation with a specific concrete example, not just the term.',
      responseFormat: 'free',
      hints: [
        'Pick three from: non-market work, leisure, environment, distribution, underground economy, quality, product mix.',
        'For each, the example should show specifically what GDP measurement misses.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-still-use',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Despite all these limitations, GDP remains the dominant economic indicator used by governments and the media. Give two specific reasons why GDP continues to be used so heavily despite its known flaws.',
      expectedAnswer:
        'Two strong reasons (any two of the following): (1) RELIABLY MEASURABLE — GDP can be calculated consistently from market transactions that are observable and recorded. Most alternative well-being measures (happiness, equality, environmental quality) are harder to measure consistently across countries and over time. (2) INTERNATIONALLY COMPARABLE — every country reports GDP using common methodology (UN System of National Accounts), allowing apples-to-apples comparison; alternative measures often use country-specific metrics. (3) AVAILABLE IN NEAR-REAL-TIME — GDP is reported quarterly with a few-week lag, while many well-being measures (life expectancy, inequality, environmental quality) update yearly or less frequently. (4) STRONG CORRELATIONS — GDP correlates with health outcomes, education levels, food security, and life expectancy at the country level. It is a flawed proxy but often a useful one. (5) POLICY-RESPONSIVE — fiscal/monetary policy can affect GDP within months; some well-being indicators are slow-moving. Strong answers explicitly cite specific properties (measurability, comparability, timeliness) and not just "everyone uses it."',
      responseFormat: 'frq',
      hints: [
        'What practical features make a number useful as a policy benchmark?',
        'How do alternatives compare on those features?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'GDP misses: non-market production, leisure, environment, distribution, underground/illegal, quality changes, product mix.',
        'GDP is a PRODUCTION number, not a WELL-BEING number.',
        'It survives despite limits because it is measurable, comparable, timely, and correlated with what we care about.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.2',
    cedTitle: 'Limitations of GDP',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '6', note: 'OpenStax Macro AP — limitations of GDP framing.' },
    ],
  },
};
