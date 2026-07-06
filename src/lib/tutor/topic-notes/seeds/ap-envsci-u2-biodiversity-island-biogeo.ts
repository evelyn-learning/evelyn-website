/**
 * AP Environmental Science — Unit 2 CED 2.1+2.3: Biodiversity and Island Biogeography.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.biodiversity-island-biogeo.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.biodiversity-island-biogeo.v1' }],
  theory: [
    { loId: 'apenvsci.biodiversity-island-biogeo', content: 'BIODIVERSITY at three levels:' },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: '  • SPECIES DIVERSITY: number and abundance of different species in a community.' },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `  • GENETIC DIVERSITY: variation in genes within a species. Higher → better resilience to disease, climate change, environmental shifts.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `  • ECOSYSTEM DIVERSITY: variety of ecosystems in a region. Tropical rainforest vs adjacent savanna vs riverine forest provides multiple habitats.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: 'WHY BIODIVERSITY MATTERS:' },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: '  • RESILIENCE: diverse ecosystems recover better from disturbance.' },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `  • SERVICES: pollination, pest control, water purification depend on species variety.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: '  • POTENTIAL: undiscovered medicines, food crops, materials.' },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: '  • INTRINSIC: ethical/cultural value of nature.' },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `ISLAND BIOGEOGRAPHY (MacArthur & Wilson 1967): species richness on an island reflects a balance between IMMIGRATION (new species arriving) and EXTINCTION (species dying out).` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: 'TWO KEY VARIABLES:' },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `  • SIZE — larger islands support more species (more habitat, larger populations, less random extinction).` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `  • DISTANCE FROM MAINLAND — closer islands receive more immigrants → more species.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `SPECIES-AREA RELATIONSHIP: S = c·A^z, where S = species count, A = area, z ≈ 0.20–0.30 typically. Doubling area roughly increases species count by ~15-20%.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `PRACTICAL CONSEQUENCE — habitat fragmentation creates "HABITAT ISLANDS." A forest fragmented by roads/farms behaves like an island archipelago. Smaller, more isolated patches → fewer species sustained, especially large mammals and slow-dispersing organisms.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `EDGE EFFECTS: small fragments have proportionately more EDGE relative to interior. Edges experience different conditions (more sun, wind, predators, invasives) — interior species suffer.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', content: `CONSERVATION IMPLICATION: protected areas should be LARGE, CONNECTED (corridors between fragments), and have SUFFICIENT INTERIOR.` },
    { loId: 'apenvsci.biodiversity-island-biogeo', kind: 'definition', title: 'biodiversity', content: 'variety of life — measured at species, genetic, and ecosystem levels.' },
    { loId: 'apenvsci.biodiversity-island-biogeo', kind: 'definition', title: 'island biogeography', content: 'theory predicting island species count from size and isolation.' },
    { loId: 'apenvsci.biodiversity-island-biogeo', kind: 'definition', title: 'edge effect', content: 'altered conditions at habitat boundaries; reduces interior-species habitat.' },
  ],
  methods: [
    {
      title: 'Worked island',
      steps: [
        'STEP 1 — Compare A vs B: same distance, B is bigger → B > A.',
        'STEP 2 — Compare A vs C: same area, A is closer → A > C.',
        'STEP 3 — Order: B > A > C. Island B (largest, close) has the most species.',
        `STEP 4 — General principle: large + close = species-rich; small + far = species-poor.`,
      ],
      example: { problem: `Island A has area 100 km² and is 50 km from mainland. Island B has area 200 km² and is 50 km from mainland. Island C has area 100 km² and is 200 km from mainland. Predict which has the MOST species.`, solution: 'B (largest, closest combo). Order: B > A > C.' },
      relatedLoIds: ['apenvsci.biodiversity-island-biogeo'],
    },
  ],
  pointers: [
    { content: 'Three levels: species, genetic, ecosystem diversity.', kind: 'tip' },
    { content: 'Island biogeography: bigger + closer → more species.', kind: 'tip' },
    { content: 'Habitat fragmentation behaves like islands — size matters.', kind: 'tip' },
    { content: 'Edge effects reduce interior habitat in small fragments.', kind: 'tip' },
    { content: 'Conservation: large patches + corridors > many small isolated patches.', kind: 'tip' },
  ],
};
