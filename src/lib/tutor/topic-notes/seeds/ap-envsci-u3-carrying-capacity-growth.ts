/**
 * AP Environmental Science — Unit 3 CED 3.4-3.5: Carrying Capacity and Growth.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.carrying-capacity-growth.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_CARRYING_CAPACITY_GROWTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.carrying-capacity-growth.v1',
  course: 'AP Environmental Science',
  cedUnit: 3,
  cedTopic: '3.4-3.5',
  cedTitle: 'Carrying Capacity and Growth',
  planId: 'evelyn.ap.envsci.carrying-capacity-growth.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.carrying-capacity-growth.v1' }],
  theory: [
    { loId: 'apenvsci.carrying-capacity-growth', content: `CARRYING CAPACITY (K): the maximum population size an environment can sustain indefinitely given available resources.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `EXPONENTIAL GROWTH (J-curve): when resources are unlimited (or much greater than population), population grows at a CONSTANT PER-CAPITA RATE. Each generation produces a multiplicative number of new individuals. dN/dt = rN. Plot is a J shape — slow at first, then accelerating.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `LOGISTIC GROWTH (S-curve): real populations approach K. Growth slows as population nears capacity. dN/dt = rN(1 − N/K). Plot is S-shaped — slow start, fast middle, slowing at K.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: 'PER-CAPITA GROWTH RATE r:' },
    { loId: 'apenvsci.carrying-capacity-growth', content: '  • r = (births − deaths)/population, often expressed as % per year.' },
    { loId: 'apenvsci.carrying-capacity-growth', content: '  • If r > 0: population grows. r < 0: population declines.' },
    { loId: 'apenvsci.carrying-capacity-growth', content: '  • In humans, r is given as % per year (e.g., world r ≈ 1.0% in 2024).' },
    { loId: 'apenvsci.carrying-capacity-growth', content: `RULE OF 70: doubling time (years) ≈ 70 / r (where r is % per year). E.g., r = 2% → doubles in ~35 years. r = 7% → doubles in ~10 years. Useful for quick estimates.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: 'POPULATION-LIMITING FACTORS — two categories:' },
    { loId: 'apenvsci.carrying-capacity-growth', content: `  • DENSITY-DEPENDENT factors: their effect SCALES with population density. Examples: food availability, disease (more contagious in dense populations), competition for territory, predation, accumulating waste.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `  • DENSITY-INDEPENDENT factors: their effect is INDEPENDENT of population density. Examples: floods, fires, hurricanes, volcanic eruptions, prolonged drought, extreme cold.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `OVERSHOOT and CRASH: in unstable environments, populations may exceed K (overshoot) and then crash. Common pattern when K decreases (e.g., grass dies in drought) or population growth has lag.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `BIOTIC POTENTIAL: maximum reproductive rate under ideal conditions. Usually never realized — environment limits.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: 'AGE OF FIRST REPRODUCTION (AFR), CLUTCH SIZE, INTERBIRTH INTERVAL all affect r.' },
    { loId: 'apenvsci.carrying-capacity-growth', kind: 'definition', title: 'carrying capacity', content: 'K — maximum sustainable population given resources.' },
    { loId: 'apenvsci.carrying-capacity-growth', kind: 'definition', title: 'exponential growth', content: 'J-curve; constant per-capita rate; unlimited resources.' },
    { loId: 'apenvsci.carrying-capacity-growth', kind: 'definition', title: 'logistic growth', content: 'S-curve; growth slows as N approaches K.' },
    { loId: 'apenvsci.carrying-capacity-growth', kind: 'definition', title: 'density-dependent', content: 'limiting factor whose effect scales with population density.' },
  ],
  methods: [
    {
      title: 'Worked doubling',
      steps: [
        'STEP 1 — Doubling time = 70 / 35 = 2 hours.',
        'STEP 2 — In 4 hours: 4 / 2 = 2 doublings.',
        'STEP 3 — 1000 → 2000 → 4000. Population ≈ 4000 cells.',
      ],
      example: { problem: `A bacterial culture grows at r = 35% per hour. (a) Use the rule of 70 to estimate doubling time. (b) If you start with 1000 cells, predict the population in 4 hours.`, solution: 'Doubling time ≈ 2 hours; ~4000 cells after 4 hours.' },
      relatedLoIds: ['apenvsci.carrying-capacity-growth'],
    },
  ],
  pointers: [
    { content: 'Exponential (J): unlimited resources, constant r. Logistic (S): approaches K.', kind: 'tip' },
    { content: 'r = (B − D)/N; doubling time ≈ 70/r%.', kind: 'tip' },
    { content: `Density-dependent (food, disease, competition); density-independent (weather, fire).`, kind: 'tip' },
    { content: 'Overshoot and crash possible when populations exceed K.', kind: 'tip' },
  ],
};
