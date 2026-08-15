/**
 * AP Environmental Science — Unit 2 CED 2.1+2.3: Biodiversity and Island
 * Biogeography.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.biodiversity-island-biogeo.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_BIODIVERSITY_ISLAND_BIOGEO: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.biodiversity-island-biogeo.v1',
  course: 'AP Environmental Science',
  cedUnit: 2,
  cedTopic: '2.1+2.3',
  cedTitle: 'Biodiversity and Island Biogeography',
  planId: 'evelyn.ap.envsci.biodiversity-island-biogeo.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.biodiversity-island-biogeo.v1' }],
  theory: [
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `BIODIVERSITY IS MULTI-SCALE — it is NOT just a species headcount. AP tests THREE LEVELS: SPECIES diversity, GENETIC diversity, and ECOSYSTEM diversity. Know all three and be able to distinguish them.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `SPECIES DIVERSITY: the number AND relative abundance of different species in a community. A community with many species, evenly distributed, is more diverse than one dominated by a single species.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `GENETIC DIVERSITY: variation in genes WITHIN a single species. HIGHER genetic diversity → better resilience to disease, climate change, and environmental shifts, because more alleles means more raw material for adaptation. LOW genetic diversity (e.g. after a population bottleneck) is a major extinction risk even when population numbers look adequate.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `ECOSYSTEM DIVERSITY: the variety of ecosystems (habitats) within a region. A landscape with rainforest, adjacent savanna, and riverine forest supports more total life than a single uniform habitat.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `WHY BIODIVERSITY MATTERS (four FRQ-ready reasons): RESILIENCE — diverse ecosystems recover better from disturbance. SERVICES — pollination, pest control, and water purification depend on species variety. POTENTIAL — undiscovered medicines, food crops, and materials. INTRINSIC — the ethical/cultural value of nature itself.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `ISLAND BIOGEOGRAPHY (MacArthur & Wilson, 1967): species richness on an island reflects a BALANCE between IMMIGRATION (new species arriving) and EXTINCTION (species dying out). The number of species settles where these two rates cross.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `TWO KEY VARIABLES drive island species count: SIZE — LARGER islands support MORE species (more habitat, larger populations, less random extinction). DISTANCE FROM MAINLAND — CLOSER islands receive MORE immigrants, so MORE species. Best case = large AND close; worst case = small AND far.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', kind: 'formula', title: 'species-area relationship', content: `$S = c \\cdot A^{z}$, where S = species count, A = area, c = a constant, and z is typically about 0.20 to 0.30. Because z is well below 1, doubling area only raises species count by roughly 15 to 20% — area and species do NOT scale one-for-one.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `HABITAT FRAGMENTATION creates "HABITAT ISLANDS." A forest cut up by roads and farms behaves like an island archipelago. Smaller, more isolated patches sustain FEWER species — especially large mammals and slow-dispersing organisms. Preserving TOTAL area does NOT preserve species count. Fragments also suffer EDGE EFFECTS: small patches have proportionately MORE edge (more sun, wind, predators, invasives), so INTERIOR species that need deep, undisturbed habitat lose out.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `CONSERVATION IMPLICATION: protected areas should be LARGE, CONNECTED (corridors linking fragments), and have SUFFICIENT INTERIOR. One large connected reserve generally outperforms many small isolated patches of the same total area.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', kind: 'definition', title: 'biodiversity', content: `the variety of life, measured at species, genetic, and ecosystem levels.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', kind: 'definition', title: 'edge effect', content: `altered conditions at habitat boundaries (more light, wind, predators, invasives) that reduce usable interior-species habitat.` },
  ],
  methods: [
    {
      title: 'Rank islands by predicted species richness',
      when_to_use: `When a question gives island areas and distances-from-mainland and asks which sustains the most species.`,
      steps: [
        `STEP 1 — Compare islands that share a DISTANCE. Among equal-distance islands, the LARGER one holds more species (size effect).`,
        `STEP 2 — Compare islands that share an AREA. Among equal-area islands, the CLOSER one holds more species (isolation effect).`,
        `STEP 3 — Combine both rankings into a single order. The large-and-close island wins; the small-and-far island loses.`,
        `STEP 4 — State the general principle: large + close = species-rich; small + far = species-poor.`,
      ],
      example: {
        problem: `Island A is 100 km² and 50 km from the mainland. Island B is 200 km² and 50 km from the mainland. Island C is 100 km² and 200 km from the mainland. Which has the MOST species?`,
        solution: `A vs B: same distance, B is bigger, so B > A. A vs C: same area, A is closer, so A > C. Order: B > A > C. Island B (largest and close) has the most species.`,
      },
      relatedLoIds: ['apenvsci.biodiversity-island-biogeo'],
    },
    {
      title: 'Predict fragmentation impact with the species-area relationship',
      when_to_use: `When a contiguous habitat is broken into patches and you must argue biodiversity loss despite unchanged total area.`,
      steps: [
        `STEP 1 — Apply $S \\propto A^{z}$ with z about 0.25 to a SINGLE fragment versus the whole original habitat.`,
        `STEP 2 — Show that each smaller patch supports only a FRACTION of the original species count, not the full set.`,
        `STEP 3 — Note that fragments overlap heavily in species, so summing patches does NOT recover the original richness.`,
        `STEP 4 — Layer on EDGE EFFECTS: each patch now has more edge, shrinking usable interior habitat further.`,
        `STEP 5 — Conclude with an estimated total loss and name mitigation (corridors, larger reserves).`,
      ],
      example: {
        problem: `A 10,000-hectare forest is split into ten 1,000-hectare patches. Total area is unchanged. Predict the biodiversity impact.`,
        solution: `Using S proportional to A^0.25, the whole forest scores about 10 units while each 1,000-ha fragment scores about 5.6 — roughly 56% of the original per patch. Fragments share most species, so total richness falls an estimated 20 to 50%. Edge effects in each smaller patch cut interior habitat on top of that. Total area preserved does NOT mean species preserved.`,
      },
      relatedLoIds: ['apenvsci.biodiversity-island-biogeo'],
    },
  ],
  pointers: [
    { content: `Three levels of biodiversity: SPECIES, GENETIC, ECOSYSTEM. Naming all three earns FRQ points.`, kind: 'tip' },
    { content: `Island richness = immigration vs extinction balance; bigger + closer → more species.`, kind: 'tip' },
    { content: `Species-area: S = c·A^z with z ≈ 0.25. Doubling area adds only ~15-20% more species.`, kind: 'tip' },
    { content: `Fragmentation = "habitat islands." Same total area, but fewer species survive.`, kind: 'tip' },
    { content: `Edge effects hurt interior species; small patches are almost all edge.`, kind: 'tip' },
    { content: `Conservation rule of thumb: large + connected + interior beats many small isolated patches.`, kind: 'tip' },
  ],
};
