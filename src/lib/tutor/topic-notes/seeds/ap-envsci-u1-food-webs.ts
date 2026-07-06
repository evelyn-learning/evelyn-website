/**
 * AP Environmental Science — Unit 1 CED 1.11: Food Chains and Webs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.food-webs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_FOOD_WEBS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.food-webs.v1',
  course: 'AP Environmental Science',
  cedUnit: 1,
  cedTopic: '1.11',
  cedTitle: 'Food Chains and Webs',
  planId: 'evelyn.ap.envsci.food-webs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.food-webs.v1' }],
  theory: [
    { loId: 'apenvsci.food-webs', content: `FOOD CHAIN: linear sequence of organisms each feeding on the next. e.g., grass → rabbit → fox → hawk.` },
    { loId: 'apenvsci.food-webs', content: `FOOD WEB: multiple interconnected food chains. More realistic. Most species occupy multiple positions.` },
    { loId: 'apenvsci.food-webs', content: `Why webs > chains for stability: REDUNDANCY — if one species declines, predators have alternatives. Simple food chains are FRAGILE.` },
    { loId: 'apenvsci.food-webs', content: `KEYSTONE SPECIES: species whose IMPACT on the ecosystem is DISPROPORTIONATELY LARGE relative to its abundance. Removing it dramatically restructures the community.` },
    { loId: 'apenvsci.food-webs', content: '  • Examples:' },
    { loId: 'apenvsci.food-webs', content: `    - SEA OTTERS: eat sea urchins. Without otters, urchins overgraze KELP forests → ecosystem collapse to "urchin barrens."` },
    { loId: 'apenvsci.food-webs', content: `    - WOLVES (Yellowstone): keep elk populations in check. Without wolves, elk overgraze willows → trophic cascade affects beavers, songbirds, riparian zones.` },
    { loId: 'apenvsci.food-webs', content: '    - BEAVERS: ECOSYSTEM ENGINEERS — dams create wetlands.' },
    { loId: 'apenvsci.food-webs', content: '    - CORALS: reef-builders; provide habitat for thousands of species.' },
    { loId: 'apenvsci.food-webs', content: `  • Distinguish from DOMINANT species (most abundant) — keystone need not be most abundant.` },
    { loId: 'apenvsci.food-webs', content: `TROPHIC CASCADE: change at one trophic level ripples through the rest. Wolves → elk → willows → songbirds is a classic cascade.` },
    { loId: 'apenvsci.food-webs', content: `BIOACCUMULATION: a single organism accumulates a substance (e.g., a fat-soluble toxin) over its lifetime — concentration in its body increases over time.` },
    { loId: 'apenvsci.food-webs', content: `BIOMAGNIFICATION: concentration INCREASES at HIGHER TROPHIC LEVELS. Each predator eats many prey, each of which has accumulated some toxin → predator gets the SUM. Toxins concentrate up the food web.` },
    { loId: 'apenvsci.food-webs', content: `  • Classic example: DDT in 1960s. Algae absorbed DDT → fish accumulated → birds (eagles, ospreys) had highest concentrations → eggshell thinning, near-extinction. Banned 1972.` },
    { loId: 'apenvsci.food-webs', content: `  • MERCURY in fish (especially top predators like tuna, swordfish, sharks). Pregnant women advised to limit consumption.` },
    { loId: 'apenvsci.food-webs', content: '  • PCBs, DIOXINS — fat-soluble organic pollutants.' },
    { loId: 'apenvsci.food-webs', content: 'TRAITS that make a substance prone to biomagnification:' },
    { loId: 'apenvsci.food-webs', content: '  • FAT-SOLUBLE (lipophilic) — stored in fatty tissues; not flushed out.' },
    { loId: 'apenvsci.food-webs', content: '  • PERSISTENT — degrades slowly in environment.' },
    { loId: 'apenvsci.food-webs', content: '  • LOW EXCRETION RATE.' },
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'keystone species', content: 'species with disproportionately large ecosystem impact relative to abundance.' },
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'biomagnification', content: 'increase in toxin concentration at successive trophic levels.' },
    { loId: 'apenvsci.food-webs', kind: 'definition', title: 'trophic cascade', content: 'effect at one trophic level ripples through others.' },
  ],
  methods: [
    {
      title: 'Worked keystone',
      steps: [
        `STEP 1 — Without otters, urchins are released from predation → urchin population EXPLODES.`,
        `STEP 2 — Urchins overgraze KELP → kelp forests COLLAPSE to "urchin barrens" (bare rock).`,
        `STEP 3 — Loss of kelp → loss of HABITAT for hundreds of species (rockfish, crabs, sea lions). Biodiversity declines.`,
        'STEP 4 — Bonus: kelp sequesters carbon. Loss → less ocean carbon storage.',
        'STEP 5 — Bonus: kelp dampens wave energy. Loss → coastal erosion increases.',
        `CONCLUSION: sea otters are a KEYSTONE species — their removal triggers a TROPHIC CASCADE.`,
      ],
      example: { problem: `Sea otters off the California coast prey on sea urchins, which graze on kelp. Predict three changes if a disease wiped out the sea otters.`, solution: `Urchin explosion → kelp collapse → biodiversity loss + downstream effects (carbon, erosion).` },
      relatedLoIds: ['apenvsci.food-webs'],
    },
  ],
  pointers: [
    { content: 'Food web > food chain in real ecosystems. Webs add stability via redundancy.', kind: 'tip' },
    { content: `Keystone species: high impact / low abundance. Removal triggers trophic cascades.`, kind: 'tip' },
    { content: 'Bioaccumulation = within individual. Biomagnification = across trophic levels.', kind: 'tip' },
    { content: 'Fat-soluble + persistent + low-excretion → high biomagnification risk.', kind: 'tip' },
  ],
};
