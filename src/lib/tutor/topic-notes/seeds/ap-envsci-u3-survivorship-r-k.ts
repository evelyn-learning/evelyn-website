/**
 * AP Environmental Science — Unit 3 CED 3.1-3.3: Survivorship and Life History.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.survivorship-r-k.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_SURVIVORSHIP_R_K: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.survivorship-r-k.v1',
  course: 'AP Environmental Science',
  cedUnit: 3,
  cedTopic: '3.1-3.3',
  cedTitle: 'Survivorship and Life History',
  planId: 'evelyn.ap.envsci.survivorship-r-k.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.survivorship-r-k.v1' }],
  theory: [
    { loId: 'apenvsci.survivorship-r-k', content: `GENERALIST vs SPECIALIST. A GENERALIST has BROAD tolerance — many habitats, many food sources — so it is RESILIENT to environmental change. Examples: rats, raccoons, coyotes, humans. A SPECIALIST has NARROW tolerance — one specific habitat or food — so it is VULNERABLE to change. Examples: koalas (eucalyptus), pandas (bamboo), some orchids. When an environment is disturbed, generalists persist and specialists decline.` },
    { loId: 'apenvsci.survivorship-r-k', content: `r-SELECTED and K-SELECTED are the two ends of a CONTINUUM of life-history strategies, not two rigid boxes. The letters come from the logistic-growth equation: $r$ is the intrinsic rate of increase and $K$ is carrying capacity. r-strategists maximize $r$ (reproduce fast); K-strategists live near $K$ (invest in fewer, stronger offspring).` },
    { loId: 'apenvsci.survivorship-r-k', content: `r-SELECTED SPECIES: MANY SMALL offspring, LITTLE-to-NO parental care, SHORT generation time, EARLY reproduction, and LOW survival rate per offspring (most die young). They THRIVE in UNSTABLE, disturbed environments and are typically the PIONEER species that first colonize open ground. Examples: insects, weeds, mice, dandelions, frogs.` },
    { loId: 'apenvsci.survivorship-r-k', content: `K-SELECTED SPECIES: FEW LARGE offspring, SIGNIFICANT parental care, LONG generation time, LATE reproduction, and HIGH survival rate per offspring. They THRIVE in STABLE environments but are VULNERABLE to extinction because they recover SLOWLY from disturbance. Examples: elephants, whales, primates, oak trees, condors.` },
    { loId: 'apenvsci.survivorship-r-k', content: `SURVIVORSHIP CURVE: a graph of how many individuals of a cohort survive to each age. AXES: x-axis is AGE (often as percent of maximum lifespan); y-axis is NUMBER OF SURVIVORS, usually on a LOG SCALE so a constant mortality rate plots as a straight line. Three characteristic shapes — Type I, II, III.` },
    { loId: 'apenvsci.survivorship-r-k', kind: 'definition', title: 'Type I survivorship', content: `HIGH survival through early and middle life, then a SHARP decline in old age. Concave curve that drops at the END. Typical of K-SELECTED species with strong parental care. Examples: humans, elephants, large mammals.` },
    { loId: 'apenvsci.survivorship-r-k', kind: 'definition', title: 'Type II survivorship', content: `ROUGHLY CONSTANT mortality rate at ALL ages — a STRAIGHT DIAGONAL line on a log scale. Chance of dying is about the same whatever the age. Examples: many birds, some lizards, hydra. This is the middle of the r/K spectrum.` },
    { loId: 'apenvsci.survivorship-r-k', kind: 'definition', title: 'Type III survivorship', content: `VERY HIGH mortality EARLY, then the few survivors live long. Curve drops STEEPLY at the start then PLATEAUS. Typical of r-SELECTED species — many offspring, no parental care. Examples: oysters, sea turtles, fish, dandelions, oak trees (acorns to mature trees).` },
    { loId: 'apenvsci.survivorship-r-k', content: `MATCHING SHAPE TO STRATEGY. Type I ⟷ K-selected (invest heavily, protect young). Type III ⟷ r-selected (flood the environment with offspring, let most die). Type II sits in between. The SAME logic that predicts offspring number and parental care predicts the survivorship curve.` },
    { loId: 'apenvsci.survivorship-r-k', content: `RESPONSE TO DISTURBANCE. After a disturbance (fire, hurricane, clear-cut), r-SELECTED species RECOVER FIRST: high reproductive output plus short generation time means many new individuals within months. K-selected species take YEARS to DECADES because reproduction is slow. This is why weeds and insects rebound before slow-breeding mammals.` },
    { loId: 'apenvsci.survivorship-r-k', content: `EXTINCTION VULNERABILITY. K-SELECTED species carry higher long-term extinction risk when habitat SHRINKS: they need large stable habitats, small populations face inbreeding/genetic-bottleneck risk, and slow reproduction means slow recovery from any shock. r-selected species persist in small fragmented patches and bounce back quickly.` },
    { loId: 'apenvsci.survivorship-r-k', kind: 'definition', title: 'survivorship curve', content: `a graph of the number (or fraction) of individuals from a starting cohort still alive at each age; its shape (Type I, II, or III) summarizes a species' mortality pattern.` },
  ],
  methods: [
    {
      title: 'Classify a species by r/K strategy and survivorship curve',
      when_to_use: `When a question gives a species' reproductive traits and asks for its life-history strategy and/or survivorship curve type.`,
      steps: [
        `STEP 1 — COUNT the OFFSPRING and CARE. Many offspring with little/no care points to r-selected; few offspring with heavy care points to K-selected.`,
        `STEP 2 — CHECK the TIMESCALE. Short generation time and early reproduction reinforce r-selected; long generation time and late reproduction reinforce K-selected.`,
        `STEP 3 — LOCATE the EARLY-LIFE MORTALITY. Enormous juvenile die-off means Type III; low juvenile mortality with a late-life drop means Type I; steady mortality at all ages means Type II.`,
        `STEP 4 — MAP strategy to curve. r-selected → Type III; K-selected → Type I; intermediate → Type II. State BOTH the strategy and the curve type, and justify from the traits given.`,
      ],
      example: {
        problem: `For each species, identify likely r/K strategy AND survivorship curve type: (a) salmon, (b) elephant, (c) house sparrow.`,
        solution: `(a) Salmon lay thousands of eggs with no parental care and huge early-life mortality → r-selected, Type III. (b) Elephants gestate ~22 months, raise one calf at a time for years, few offspring, heavy care → K-selected, Type I. (c) House sparrows lay several eggs per clutch with modest care and fairly constant adult mortality → middle of the spectrum, Type II.`,
      },
      relatedLoIds: ['apenvsci.survivorship-r-k'],
    },
  ],
  pointers: [
    { content: `Generalist = broad tolerance, resilient; specialist = narrow tolerance, vulnerable.`, kind: 'tip' },
    { content: `r-selected: many small offspring, no care, fast. K-selected: few large, much care, slow.`, kind: 'tip' },
    { content: `Type I = drops at end (humans); Type II = straight line (some birds); Type III = drops early (oysters).`, kind: 'tip' },
    { content: `r-selected ⟷ Type III; K-selected ⟷ Type I; Type II is the middle of the spectrum.`, kind: 'tip' },
    { content: `After disturbance r-selected recover first; K-selected carry higher extinction risk.`, kind: 'tip' },
    { content: `Survivorship y-axis is usually LOG scale, so constant mortality plots as a straight line.`, kind: 'tip' },
  ],
};
