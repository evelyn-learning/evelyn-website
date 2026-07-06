/**
 * AP Environmental Science — Unit 9 CED 9.6-9.7: Ocean Warming and Acidification.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.ocean-changes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_OCEAN_CHANGES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.ocean-changes.v1',
  course: 'AP Environmental Science',
  cedUnit: 9,
  cedTopic: '9.6-9.7',
  cedTitle: 'Ocean Warming and Acidification',
  planId: 'evelyn.ap.envsci.ocean-changes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.ocean-changes.v1' }],
  theory: [
    { loId: 'apenvsci.ocean-changes', content: 'OCEAN ABSORPTION:' },
    { loId: 'apenvsci.ocean-changes', content: '  • Oceans absorbed ~90% of excess HEAT from anthropogenic warming since 1970.' },
    { loId: 'apenvsci.ocean-changes', content: '  • Oceans absorbed ~30% of human CO₂ EMISSIONS.' },
    { loId: 'apenvsci.ocean-changes', content: '  • Without ocean buffering, atmospheric warming would be far worse.' },
    { loId: 'apenvsci.ocean-changes', content: `  • But: ocean processes are NOT NEUTRAL — absorption causes warming + acidification.` },
    { loId: 'apenvsci.ocean-changes', content: 'OCEAN WARMING:' },
    { loId: 'apenvsci.ocean-changes', content: '  • Top 700m of ocean has WARMED ~0.6°C since 1969.' },
    { loId: 'apenvsci.ocean-changes', content: '  • Heat extends to deeper layers, slowly.' },
    { loId: 'apenvsci.ocean-changes', content: `  • CONSEQUENCES:
     - THERMAL EXPANSION (water expands when warmed) → contributes ~50% of sea-level rise.
     - DISSOLVED OXYGEN drops (warmer water holds less O₂) → DEAD ZONES expanding.
     - CORAL BLEACHING: corals expel symbiotic algae (zooxanthellae) when stressed by heat. Without algae, corals lose color (bleach) and energy source. Prolonged bleaching → coral death.
     - SPECIES RANGE SHIFTS poleward.
     - HURRICANE intensity increasing (warm ocean = more energy).
     - FISHERY DECLINES (especially cold-water species).` },
    { loId: 'apenvsci.ocean-changes', content: `CORAL REEFS:
  • ~25% of marine species depend on coral reefs (1% of ocean by area, 25% of biodiversity).
  • CORAL BLEACHING events increasing in frequency and intensity:
     - Mass events 1998 (linked to ENSO + warming), 2010, 2014-17 (3-year global event), 2023-24 (worst on record).
     - Great Barrier Reef: ~50% of corals lost in last 30 years.
     - Caribbean coral lost ~80% since 1970s.
     - Tropical Pacific reefs widely damaged.
  • RECOVERY possible if cooling resumes; impossible during continuous heat stress.` },
    { loId: 'apenvsci.ocean-changes', content: 'OCEAN ACIDIFICATION:' },
    { loId: 'apenvsci.ocean-changes', content: '  • CO₂ + H₂O → H₂CO₃ (carbonic acid).' },
    { loId: 'apenvsci.ocean-changes', content: '  • Carbonic acid breaks down → H⁺ + HCO₃⁻.' },
    { loId: 'apenvsci.ocean-changes', content: '  • Hydrogen ions LOWER pH → more acidic.' },
    { loId: 'apenvsci.ocean-changes', content: `  • Ocean pH dropped from ~8.2 (pre-industrial) to ~8.1 (2020) — a 30% INCREASE in H⁺ concentration (logarithmic scale).` },
    { loId: 'apenvsci.ocean-changes', content: '  • Projected to drop another 0.3-0.4 pH units by 2100.' },
    { loId: 'apenvsci.ocean-changes', content: 'IMPACT on shell-builders:' },
    { loId: 'apenvsci.ocean-changes', content: '  • SHELLS made from CALCIUM CARBONATE (CaCO₃).' },
    { loId: 'apenvsci.ocean-changes', content: '  • Acidification increases H⁺, which combines with CO₃²⁻ → HCO₃⁻.' },
    { loId: 'apenvsci.ocean-changes', content: '  • Less CO₃²⁻ available for shell-building organisms.' },
    { loId: 'apenvsci.ocean-changes', content: `  • Affected: corals, oysters, clams, mussels, scallops, sea urchins, plankton (foraminifera).` },
    { loId: 'apenvsci.ocean-changes', content: '  • Below pH ~7.8, EXISTING SHELLS DISSOLVE.' },
    { loId: 'apenvsci.ocean-changes', content: `  • Severe impacts on:
     - Pteropods (small free-swimming snails) at base of marine food webs.
     - Plankton supporting fish.
     - Coral reefs (already stressed by warming).
     - Commercial shellfish (Pacific NW oyster industry collapsed in 2007 due to acidified upwelled water).` },
    { loId: 'apenvsci.ocean-changes', content: `COMBINED EFFECTS:
  • Warming + acidification + reduced O₂ + sea-level rise compound stress.
  • Reefs face MULTIPLE stressors simultaneously.
  • Deep ocean ecosystems are also being affected.
  • Some adaptation possible (coral species, microbes), but rate of change exceeds adaptation pace.` },
    { loId: 'apenvsci.ocean-changes', kind: 'definition', title: 'coral bleaching', content: 'corals expel symbiotic algae under heat stress; eventual death.' },
    { loId: 'apenvsci.ocean-changes', kind: 'definition', title: 'ocean acidification', content: 'CO₂ → carbonic acid → ocean pH drops, harming shell-builders.' },
    { loId: 'apenvsci.ocean-changes', kind: 'definition', title: 'thermal expansion', content: 'water expands when warmed; ~50% of sea-level rise.' },
  ],
  methods: [
    {
      title: 'Worked bleaching',
      steps: [
        'STEP 1 — Sea surface temperature rises 1°C+ above normal for weeks.',
        `STEP 2 — Corals expel zooxanthellae (symbiotic algae). Lose color (white) and primary food source.`,
        `STEP 3 — Bleached corals can survive ~2-4 weeks of high heat. If cooling occurs, algae may return.`,
        'STEP 4 — Prolonged heat (2-3+ months) → corals starve, weaken, die.',
        'STEP 5 — Months later: 10-50% of corals dead in heat-affected reef.',
        `STEP 6 — Without coral, REEF FISH lose habitat. Populations decline. Many species locally extinct.`,
        'STEP 7 — Fish/invertebrate POPULATIONS continue declining over years.',
        'STEP 8 — Reef may transition to ALGAL DOMINANCE (algae outcompete dying corals).',
        `STEP 9 — Recovery possible IF: temperatures return to normal, no further bleaching, water quality maintained. Takes decades.`,
        `STEP 10 — With CONTINUED warming + repeated bleaching: REEF COLLAPSE. Cannot recover. 
• Lost ecosystem services: coastal protection, fishery support, tourism. 
• 2024-25: bleaching the most extensive ever recorded.`,
      ],
      example: { problem: `A coral reef ecosystem. Heat stress causes bleaching. Trace what happens to the reef in months → years.`, solution: `Heat → bleaching → death → fish decline → algal phase → ecosystem collapse if heat persists.` },
      relatedLoIds: ['apenvsci.ocean-changes'],
    },
  ],
  pointers: [
    { content: 'Oceans absorbed 90% excess heat + 30% CO₂.', kind: 'tip' },
    { content: 'Ocean warming → coral bleaching, dead zones expanding, hurricanes stronger.', kind: 'tip' },
    { content: 'CO₂ + H₂O → carbonic acid → 30% more acidic; harms shell-builders.', kind: 'tip' },
    { content: 'Reefs at compounded risk: warming + acid + pollution.', kind: 'tip' },
    { content: 'Reducing CO₂ emissions is the single biggest lever.', kind: 'tip' },
  ],
};
