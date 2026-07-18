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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.carrying-capacity-growth.v1' }],
  theory: [
    { loId: 'apenvsci.carrying-capacity-growth', kind: 'definition', title: 'carrying capacity (K)', content: `the MAXIMUM population size an environment can sustain INDEFINITELY given available resources (food, water, space, etc.). Symbol $K$. It is not fixed — if resources fall (drought kills the grass), $K$ falls with them.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `EXPONENTIAL GROWTH (J-CURVE): when resources are UNLIMITED (or far greater than the population), the population grows at a CONSTANT PER-CAPITA rate. Equation $dN/dt = rN$, where $N$ is population size and $r$ is the per-capita growth rate. The plot is a J shape — SLOW at first, then ACCELERATING without bound. Real populations only show this transiently (new colonizers, bacteria in fresh medium).` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `LOGISTIC GROWTH (S-CURVE): real populations approach $K$, so growth SLOWS as the population fills the environment. Equation $dN/dt = rN(1 - N/K)$. The term $(1 - N/K)$ is the BRAKE: near zero population it is ≈1 (near-exponential), and at $N = K$ it becomes zero (growth stops). The plot is S-shaped — slow start, fast middle, leveling off at $K$.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `GROWTH IS FASTEST at $N = K/2$ — the INFLECTION POINT of the S-curve, where $dN/dt$ is at its MAXIMUM. Below $K/2$ there are too few individuals; above $K/2$ the environment is crowding them. This midpoint is where the absolute number of new individuals per year peaks.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `PER-CAPITA GROWTH RATE $r$: computed as $r = (B - D)/N$ — births minus deaths, divided by population (immigration and emigration can be added). Often expressed as a PERCENT per year. If $r$ is greater than zero the population grows; if $r$ is less than zero it declines. World human $r$ was about 1.0% in 2024.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `RULE OF 70: a quick estimate of DOUBLING TIME. Doubling time in years ≈ 70 divided by the growth rate in percent per year, i.e. $t = 70/r$ (with $r$ as a percent). A rate of 2% doubles in about 35 years; 7% doubles in about 10 years. Handy for exponential-growth estimates on the exam.` },
    { loId: 'apenvsci.carrying-capacity-growth', kind: 'definition', title: 'density-dependent factor', content: `a limiting factor whose effect SCALES with population density — it hits harder in crowded populations. Examples: food/resource competition, disease transmission, competition for territory, predation, waste accumulation.` },
    { loId: 'apenvsci.carrying-capacity-growth', kind: 'definition', title: 'density-independent factor', content: `a limiting factor whose effect is INDEPENDENT of population density — it hits the same regardless of crowding. Examples: floods, fires, hurricanes, volcanic eruptions, prolonged drought, extreme cold.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `OVERSHOOT and CRASH: in unstable environments a population may EXCEED $K$ (overshoot) and then CRASH below it. Common when there is a LAG — the population keeps growing on momentum while resources are already depleting — or when $K$ itself suddenly drops (grass dies in a drought). The result can be a boom-bust cycle rather than a smooth plateau.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `BIOTIC POTENTIAL: the MAXIMUM reproductive rate of a species under IDEAL conditions (unlimited food, no predators or disease). It is essentially never realized because the environment imposes resistance — the gap between biotic potential and reality is what limiting factors explain.` },
    { loId: 'apenvsci.carrying-capacity-growth', content: `LIFE-HISTORY LEVERS on $r$: AGE OF FIRST REPRODUCTION (earlier → higher $r$), CLUTCH/LITTER SIZE (larger → higher $r$), and INTERBIRTH INTERVAL (shorter → higher $r$). These connect back to r/K strategies: r-selected species maximize these levers, K-selected species do not.` },
  ],
  methods: [
    {
      title: 'Estimate doubling time with the rule of 70',
      when_to_use: `When a population grows at a roughly constant percent rate and the question asks how long it takes to double, or the size after several doublings.`,
      steps: [
        `STEP 1 — GET the growth rate as a PERCENT per unit time (if given births and deaths, first compute $r = (B - D)/N$).`,
        `STEP 2 — DOUBLING TIME ≈ 70 divided by that percent rate, i.e. $t = 70/r$.`,
        `STEP 3 — COUNT how many doubling times fit in the interval asked about, then DOUBLE the starting population that many times.`,
      ],
      example: {
        problem: `A bacterial culture grows at r = 35% per hour. (a) Use the rule of 70 to estimate doubling time. (b) If you start with 1000 cells, predict the population in 4 hours.`,
        solution: `(a) Doubling time = 70 / 35 = 2 hours. (b) In 4 hours there are 4 / 2 = 2 doublings, so 1000 → 2000 → 4000. Population ≈ 4000 cells.`,
      },
      relatedLoIds: ['apenvsci.carrying-capacity-growth'],
    },
    {
      title: 'Compute logistic growth rate dN/dt',
      when_to_use: `When given $r$, $N$, and $K$ and asked for the instantaneous growth rate under the logistic model.`,
      steps: [
        `STEP 1 — WRITE the logistic equation $dN/dt = rN(1 - N/K)$.`,
        `STEP 2 — PLUG IN $r$, $N$, and $K$; evaluate the brake term $(1 - N/K)$ first.`,
        `STEP 3 — INTERPRET: the rate is near zero when $N$ is tiny OR when $N$ is near $K$, and it is LARGEST at $N = K/2$.`,
      ],
      example: {
        problem: `A pond has carrying capacity K = 500 fish and intrinsic growth rate r = 0.20 per year. Find dN/dt when (a) N = 250, (b) N = 100, (c) N = 500.`,
        solution: `(a) 0.20 × 250 × (1 − 250/500) = 0.20 × 250 × 0.5 = 25 fish/year. (b) 0.20 × 100 × (1 − 100/500) = 0.20 × 100 × 0.8 = 16 fish/year. (c) 0.20 × 500 × (1 − 500/500) = 0 — growth stops at K. Growth is fastest at N = K/2 = 250.`,
      },
      relatedLoIds: ['apenvsci.carrying-capacity-growth'],
    },
  ],
  pointers: [
    { content: `Exponential (J): $dN/dt = rN$, unlimited resources. Logistic (S): $dN/dt = rN(1 - N/K)$, approaches $K$.`, kind: 'tip' },
    { content: `Per-capita rate $r = (B - D)/N$; express as a percent for the rule of 70.`, kind: 'tip' },
    { content: `Rule of 70: doubling time ≈ 70/rate-percent, i.e. $t = 70/r$.`, kind: 'tip' },
    { content: `Logistic growth is FASTEST at $N = K/2$ and zero at $N = K$.`, kind: 'tip' },
    { content: `Density-dependent = food, disease, competition. Density-independent = weather, fire, floods.`, kind: 'tip' },
    { content: `Overshoot and crash happens when a population exceeds $K$ (lag) or when $K$ suddenly drops.`, kind: 'tip' },
  ],
};
