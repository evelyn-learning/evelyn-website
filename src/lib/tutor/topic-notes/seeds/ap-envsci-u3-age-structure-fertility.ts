/**
 * AP Environmental Science — Unit 3 CED 3.6-3.7: Age Structure and Fertility.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.age-structure-fertility.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_AGE_STRUCTURE_FERTILITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.age-structure-fertility.v1',
  course: 'AP Environmental Science',
  cedUnit: 3,
  cedTopic: '3.6-3.7',
  cedTitle: 'Age Structure and Fertility',
  planId: 'evelyn.ap.envsci.age-structure-fertility.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.age-structure-fertility.v1' }],
  theory: [
    { loId: 'apenvsci.age-structure-fertility', kind: 'definition', title: 'age structure diagram (population pyramid)', content: `a horizontal bar chart of a population by age and sex: age groups stacked vertically (youngest at the BOTTOM), MALES on the left, FEMALES on the right. Bar length = the percent of the total population in that age-sex group. Its SHAPE forecasts the population's trajectory.` },
    { loId: 'apenvsci.age-structure-fertility', content: `THREE TYPICAL SHAPES. EXPANDING (broad base): many young, few old — high birth rate, future GROWTH (Niger, Uganda, Afghanistan). STABLE (column/rectangle): roughly equal across ages — birth rate ≈ death rate, FLAT trajectory (USA, UK, France). DECLINING / TOP-HEAVY (narrow base, wider middle): more elderly than children — will SHRINK (Japan, Italy, Germany).` },
    { loId: 'apenvsci.age-structure-fertility', content: `WHAT A PYRAMID PREDICTS. A WIDE BASE means large young cohorts that WILL reach reproductive age → continued growth. A COLUMN means each cohort roughly replaces the last → flat. A NARROW BASE means too few young people to replace dying elderly → the population decreases over time. Read the base first.` },
    { loId: 'apenvsci.age-structure-fertility', kind: 'definition', title: 'population momentum', content: `continued population GROWTH even AFTER fertility falls to replacement level, because the large young cohorts already alive still have to move through their reproductive years. An expanding pyramid keeps growing for roughly 30-50 years after TFR drops.` },
    { loId: 'apenvsci.age-structure-fertility', kind: 'definition', title: 'total fertility rate (TFR)', content: `the AVERAGE number of children a woman would have over her lifetime given current age-specific fertility rates. It is NOT the same as births per year — it is a per-woman lifetime figure and is the key predictor of long-run trajectory.` },
    { loId: 'apenvsci.age-structure-fertility', content: `REPLACEMENT-LEVEL FERTILITY: the TFR needed to hold population size CONSTANT over time. In LOW-mortality countries it is about 2.1 (each woman replaces herself plus a partner; the extra 0.1 covers childhood mortality and the sex ratio). In HIGH-mortality countries it is higher, roughly 2.5 to 3.0+, to offset greater infant/child mortality.` },
    { loId: 'apenvsci.age-structure-fertility', content: `CURRENT WORLD TFR is about 2.3 (2024) and has been FALLING worldwide; projections put it near 1.8 by 2100. The global trend is toward lower fertility, which is why UN projections have world population peaking rather than growing without limit.` },
    { loId: 'apenvsci.age-structure-fertility', content: `TFR PATTERNS by country. Well BELOW replacement (about 1.0-1.5): aging and shrinking — Japan ~1.3, Italy ~1.2, South Korea ~0.7 (lowest in the world). NEAR replacement (about 1.8-2.2): USA ~1.7, UK, France. HIGH (about 4-7): growing fast — Niger ~6.5, Somalia ~6.0, DRC ~6.0.` },
    { loId: 'apenvsci.age-structure-fertility', content: `FACTORS THAT LOWER TFR: EDUCATION (especially of women/girls), ACCESS to contraception and family planning, WOMEN in the workforce (delayed childbearing), URBANIZATION (children are less of an economic asset in cities), LOWER infant mortality (parents need fewer births to ensure survivors), and the HIGHER COST of raising children in modern economies. Education of women is the single strongest lever.` },
    { loId: 'apenvsci.age-structure-fertility', content: `TRAJECTORY IMPLICATIONS differ by shape. Expanding populations face resource pressure and schooling/jobs demand. Declining populations face AGING challenges: pensions, healthcare load, a SHRINKING workforce with fewer workers per retiree, and a falling tax base — often prompting immigration or pro-natal policy.` },
    { loId: 'apenvsci.age-structure-fertility', content: `LINKING TFR TO THE PYRAMID. High TFR builds a broad base (expanding); TFR near 2.1 builds a column (stable); TFR well below 2.1 erodes the base (declining/top-heavy). But momentum means the pyramid lags the TFR — a country can have below-replacement TFR yet keep growing for decades.` },
  ],
  methods: [
    {
      title: 'Read a population pyramid and predict its trajectory',
      when_to_use: `When given the shape of an age-structure diagram (or the percent young vs. old) and asked to forecast growth over the next several decades.`,
      steps: [
        `STEP 1 — LOOK AT THE BASE. A wide base (large percent of children) signals an EXPANDING population; a narrow base with a heavy top signals a DECLINING one; even bars signal STABLE.`,
        `STEP 2 — APPLY MOMENTUM. If the base is wide, expect continued growth for roughly 30-50 years even if TFR is already falling.`,
        `STEP 3 — INFER the likely TFR: broad base → high TFR (well above replacement); column → TFR near replacement ~2.1; top-heavy → TFR well below replacement.`,
        `STEP 4 — STATE the trajectory (grow / stable / shrink) and name the challenge it creates (resource/schooling pressure vs. aging/workforce strain).`,
      ],
      example: {
        problem: `Country X has children 0-9 at 35% of the population and adults over 60 at 5%. Country Y has 0-9 at 12% and over-60 at 25%. Predict each country's 50-year trajectory.`,
        solution: `Country X: very wide base, tiny top → EXPANDING pyramid, likely high TFR (about 4-6); it will GROW substantially over 50 years by momentum, facing resource and schooling pressure. Country Y: narrow base, heavy top → DECLINING pyramid, likely TFR about 1.0-1.5; it will SHRINK and age, facing pension, healthcare, and workforce challenges.`,
      },
      relatedLoIds: ['apenvsci.age-structure-fertility'],
    },
  ],
  pointers: [
    { content: `Pyramid base tells the story: wide = expanding, column = stable, narrow = declining.`, kind: 'tip' },
    { content: `Replacement-level TFR ≈ 2.1 in low-mortality settings; 2.5-3+ where mortality is high.`, kind: 'tip' },
    { content: `TFR = average lifetime children per woman — NOT births per year.`, kind: 'tip' },
    { content: `Population momentum: a 30-50 year lag between a TFR drop and population decline.`, kind: 'tip' },
    { content: `TFR falls with women's education, contraception, urbanization, lower infant mortality.`, kind: 'tip' },
    { content: `Declining populations face aging: pensions, healthcare, shrinking workforce, falling tax base.`, kind: 'tip' },
  ],
};
