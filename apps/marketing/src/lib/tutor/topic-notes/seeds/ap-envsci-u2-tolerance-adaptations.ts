/**
 * AP Environmental Science — Unit 2 CED 2.4+2.6: Tolerance and Adaptations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.tolerance-adaptations.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_TOLERANCE_ADAPTATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.tolerance-adaptations.v1',
  course: 'AP Environmental Science',
  cedUnit: 2,
  cedTopic: '2.4+2.6',
  cedTitle: 'Tolerance and Adaptations',
  planId: 'evelyn.ap.envsci.tolerance-adaptations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.tolerance-adaptations.v1' }],
  theory: [
    { loId: 'apenvsci.tolerance-adaptations', content: `ECOLOGICAL TOLERANCE is the RANGE of conditions (temperature, salinity, pH, moisture, and so on) under which a species can SURVIVE and REPRODUCE. Different species have different ranges, and those ranges largely determine WHERE a species can live.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `THE TOLERANCE CURVE is a bell-shaped plot of performance versus an environmental variable, split into THREE ZONES. Read the curve to place an organism's current condition and predict its fate.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `OPTIMAL ZONE — the center of the curve where the species THRIVES and reproduces well. ZONE OF PHYSIOLOGICAL STRESS — flanks the optimum; the organism SURVIVES but does poorly (slow growth, reduced reproduction). ZONE OF INTOLERANCE — the tails; conditions are too extreme and the organism CANNOT survive.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `LIEBIG'S LAW OF THE MINIMUM: growth is limited by whatever resource is in SHORTEST SUPPLY — the single most limiting factor. Adding more of an already-abundant nutrient does NOTHING if a different resource is the bottleneck. Classic image: a barrel holds only as much water as its SHORTEST stave allows.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `SHELFORD'S LAW OF TOLERANCE: organisms have BOTH a MINIMUM and a MAXIMUM tolerance for any factor. Too LITTLE and too MUCH both cause harm. This generalizes Liebig, who only addressed shortage — Shelford covers both ends of the range.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `GENERALIST — broad tolerance, many food sources; survives habitat change. Examples: raccoons, coyotes, humans, cockroaches. SPECIALIST — narrow tolerance, specific food/habitat; vulnerable to change. Examples: koalas (eucalyptus only), pandas (bamboo), polar bears (sea ice). Specialization is high-reward in stable environments but high-RISK in changing ones.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `ADAPTATIONS are HERITABLE traits that increase fitness in a given environment. AP requires distinguishing THREE categories using this sort test: an ACTION is behavioral, a PHYSICAL feature is structural, INTERNAL chemistry is physiological. STRUCTURAL (anatomical) — cactus spines, thick arctic fur, webbed duck feet, long giraffe necks. BEHAVIORAL (actions) — bird migration, hibernation, desert nocturnality, pack hunting in wolves.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `PHYSIOLOGICAL (internal/biochemical) adaptations — antifreeze proteins in arctic fish; venom production; heat tolerance in extremophile bacteria; detoxification enzymes. These are chemistry-based, not visible anatomy or behavior.` },
    { loId: 'apenvsci.tolerance-adaptations', content: `NICHE: the role or position a species occupies in its ecosystem — its habitat, food, resource use, and time of activity. Closely related species can COEXIST by occupying DIFFERENT niches (resource partitioning), which reduces direct competition.` },
    { loId: 'apenvsci.tolerance-adaptations', kind: 'definition', title: 'limiting factor', content: `the resource in shortest supply that constrains a population's growth (the core of Liebig's Law).` },
    { loId: 'apenvsci.tolerance-adaptations', kind: 'definition', title: 'specialist', content: `a species with narrow tolerance and specific habitat or food needs; vulnerable to environmental change.` },
    { loId: 'apenvsci.tolerance-adaptations', kind: 'definition', title: 'generalist', content: `a species with broad tolerance that uses many habitats and food sources; resilient to change.` },
  ],
  methods: [
    {
      title: 'Identify the limiting factor (Liebig test)',
      when_to_use: `When a problem lists several resource levels and asks why adding one nutrient fails to improve growth.`,
      steps: [
        `STEP 1 — List what the organism NEEDS and what it currently HAS, with rough abundance for each.`,
        `STEP 2 — Recall that performance is set by the SCARCEST input; abundant inputs are not the constraint.`,
        `STEP 3 — Name the LIMITING FACTOR: the single resource in shortest supply.`,
        `STEP 4 — Cite LIEBIG'S LAW OF THE MINIMUM: growth is capped by the most limiting resource regardless of the others.`,
        `STEP 5 — Prescribe the fix: supply the limiting resource, not the abundant ones.`,
      ],
      example: {
        problem: `A farmer adds phosphorus fertilizer but yields do not improve. Soil tests show abundant N, P, and K, but very low water. What limits growth, and what law applies?`,
        solution: `Water is the scarcest input, so WATER is the limiting factor. Adding phosphorus cannot help because phosphorus was never the constraint. This is Liebig's Law of the Minimum — the farmer should IRRIGATE, not fertilize.`,
      },
      relatedLoIds: ['apenvsci.tolerance-adaptations'],
    },
    {
      title: 'Classify an adaptation as structural, behavioral, or physiological',
      when_to_use: `When asked to categorize traits — a very common AP multiple-choice and short-answer format.`,
      steps: [
        `STEP 1 — Ask: is it an ACTION the organism performs? If yes → BEHAVIORAL.`,
        `STEP 2 — Ask: is it a visible PHYSICAL/anatomical feature? If yes → STRUCTURAL.`,
        `STEP 3 — Ask: is it INTERNAL chemistry or a biochemical process? If yes → PHYSIOLOGICAL.`,
        `STEP 4 — Double-check borderline cases: blubber and stored fat are structural; producing antifreeze is physiological even though both fight cold.`,
      ],
      example: {
        problem: `Classify: (a) a bear hibernating, (b) antifreeze proteins in Arctic cod blood, (c) a whale's thick blubber, (d) water-storing cactus stems, (e) fish schooling.`,
        solution: `(a) Behavioral. (b) Physiological. (c) Structural. (d) Structural. (e) Behavioral.`,
      },
      relatedLoIds: ['apenvsci.tolerance-adaptations'],
    },
  ],
  pointers: [
    { content: `Tolerance curve has three zones: OPTIMAL | STRESS | INTOLERANCE. Read where the organism sits.`, kind: 'tip' },
    { content: `Liebig = the MINIMUM (scarcest) resource limits growth. Barrel's shortest stave.`, kind: 'tip' },
    { content: `Shelford adds the other end: too MUCH of a factor harms too, not just too little.`, kind: 'tip' },
    { content: `Adaptation sort: action = behavioral, body part = structural, internal chemistry = physiological.`, kind: 'tip' },
    { content: `Specialists (koala, panda, polar bear) are extinction-prone under change; generalists thrive.`, kind: 'tip' },
    { content: `Niche differences let similar species coexist via resource partitioning.`, kind: 'tip' },
  ],
};
