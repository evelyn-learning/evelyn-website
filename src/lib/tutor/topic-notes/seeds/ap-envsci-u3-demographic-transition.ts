/**
 * AP Environmental Science — Unit 3 CED 3.8-3.9: Demographic Transition.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.demographic-transition.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_DEMOGRAPHIC_TRANSITION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.demographic-transition.v1',
  course: 'AP Environmental Science',
  cedUnit: 3,
  cedTopic: '3.8-3.9',
  cedTitle: 'Demographic Transition',
  planId: 'evelyn.ap.envsci.demographic-transition.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.demographic-transition.v1' }],
  theory: [
    { loId: 'apenvsci.demographic-transition', content: `HUMAN POPULATION HISTORY. For 99.9% of human existence the population was tiny (~10 million by 1 AD). It reached 1 billion around 1804, 2 billion by ~1927 (123 years later), 4 billion by ~1974 (47 years later), and 8 billion in 2022 (48 years later). The acceleration is RECENT — and the rate is now SLOWING. The UN projects a peak near 10.4 billion around 2080.` },
    { loId: 'apenvsci.demographic-transition', content: `WHAT DROVE THE EXPLOSION (1800s onward): the INDUSTRIAL REVOLUTION, IMPROVED AGRICULTURE (fertilizer, mechanization, the Green Revolution), and PUBLIC HEALTH (sanitation, vaccines, antibiotics). The single biggest driver was REDUCED INFANT/CHILD MORTALITY. Ironically, dropping infant mortality STARTS a population explosion that then takes 30-50 years to slow as birth rates catch up.` },
    { loId: 'apenvsci.demographic-transition', kind: 'definition', title: 'demographic transition model (DTM)', content: `a four-stage model describing how a country shifts from HIGH birth and death rates to LOW birth and death rates as it develops economically. Death rates fall before birth rates, which is why a growth surge sits in the middle of the transition.` },
    { loId: 'apenvsci.demographic-transition', content: `STAGE 1 — PRE-INDUSTRIAL (pre-1800s globally; today almost no countries): HIGH birth rates and HIGH death rates roughly cancel. Population is stable but small, with slow growth at best.` },
    { loId: 'apenvsci.demographic-transition', kind: 'definition', title: 'Stage 2 — transitional', content: `the DEATH RATE FALLS FIRST (medicine, sanitation, food) while the BIRTH RATE STAYS HIGH (cultural lag). The gap between them makes the population EXPLODE. Most of the growth to 8 billion came from Stage 2. Today: much of Sub-Saharan Africa.` },
    { loId: 'apenvsci.demographic-transition', content: `STAGE 3 — INDUSTRIAL (today: India, Brazil, Indonesia, China recently): the BIRTH RATE begins to FALL (urbanization, education, family planning) while the death rate keeps falling slightly. Population is STILL GROWING but the growth rate is slowing.` },
    { loId: 'apenvsci.demographic-transition', kind: 'definition', title: 'Stage 4 — post-industrial', content: `both birth and death rates are LOW. Population is STABLE or SLOWLY DECLINING, and TFR is often below replacement (roughly 1.2-1.7). Today: US, EU, Japan.` },
    { loId: 'apenvsci.demographic-transition', content: `STAGE 5 (proposed by some demographers): SUPER-LOW fertility and an AGING population, so the population actively shrinks. Examples cited: South Korea, Japan, Italy. Not universally adopted, but useful for describing today's lowest-fertility countries.` },
    { loId: 'apenvsci.demographic-transition', content: `KEY INSIGHT: most developing countries today are in STAGE 2-3 and will likely complete their own transition over the coming decades. That pending transition is what drives global population toward a peak near 10 billion rather than unbounded growth.` },
    { loId: 'apenvsci.demographic-transition', content: `CRUCIAL DISTINCTION — SPEED. The transition took roughly 200 YEARS in Europe but only about 50 YEARS in many developing countries today. Modern countries IMPORT medical technology, family-planning knowledge, and education rather than inventing them slowly, so the whole sequence runs faster. Iran's TFR fell from about 7 in 1979 to 1.7 by 2020; Bangladesh from 6.6 in 1975 to 1.9 in 2022.` },
    { loId: 'apenvsci.demographic-transition', content: `WHY IT DIFFUSES FASTER NOW: imported vaccines/antibiotics/sanitation, knowledge transfer on contraception and women's education, global institutions (UN, WHO, NGOs), mass media spreading smaller-family norms, economic globalization accelerating urbanization, and education reaching people via mobile internet.` },
  ],
  methods: [
    {
      title: 'Identify a country\'s demographic-transition stage',
      when_to_use: `When given a country's TFR, mortality, life expectancy, and development indicators and asked which DTM stage it is in.`,
      steps: [
        `STEP 1 — READ the BIRTH SIDE (TFR). Very high TFR points early (Stage 2); TFR near replacement points to Stage 3; TFR below replacement points to Stage 4/5.`,
        `STEP 2 — READ the DEATH SIDE (infant mortality, life expectancy). Falling-but-still-high mortality with rising life expectancy signals Stage 2; low mortality and long life expectancy signal Stage 4.`,
        `STEP 3 — CHECK the GAP. A large birth-minus-death gap means fast growth (Stage 2); a small gap means a stabilizing population (Stage 4).`,
        `STEP 4 — NAME the stage and justify from the numbers, noting whether the population is exploding, slowing, or stable/declining.`,
      ],
      example: {
        problem: `Identify the likely DTM stage: (a) Niger (TFR 6.5, infant mortality 50/1000, life expectancy 62, rural). (b) Brazil (TFR 1.6, infant mortality 12/1000, life expectancy 75). (c) Japan (TFR 1.3, infant mortality 2/1000, life expectancy 84).`,
        solution: `(a) High TFR with still-high infant mortality and improving life expectancy → STAGE 2 (transitional); death rate falling faster than birth rate, growing fast. (b) Below-replacement TFR with low mortality and long life expectancy → STAGE 4 (or late Stage 3); population stabilizing. (c) Very low TFR with very low mortality and very high life expectancy → STAGE 4 (Stage 5 by some definitions); aging and slowly declining.`,
      },
      relatedLoIds: ['apenvsci.demographic-transition'],
    },
  ],
  pointers: [
    { content: `Stages: 1 (high B + D), 2 (D drops, explosion), 3 (B drops), 4 (low B + D, stable).`, kind: 'tip' },
    { content: `Most population growth came from Stage 2 — death-rate decline precedes birth-rate decline.`, kind: 'tip' },
    { content: `Reduced infant/child mortality is the biggest driver of the modern population explosion.`, kind: 'tip' },
    { content: `Modern developing countries transit faster than Europe did (about 50 vs. 200 years).`, kind: 'tip' },
    { content: `Education, family planning, and urbanization drive countries through the transition.`, kind: 'tip' },
    { content: `Pending Stage 2-3 transitions drive global population toward a peak near 10 billion.`, kind: 'tip' },
  ],
};
