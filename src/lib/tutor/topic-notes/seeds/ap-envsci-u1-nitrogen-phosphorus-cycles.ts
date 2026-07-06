/**
 * AP Environmental Science — Unit 1 CED 1.5-1.6: Nitrogen and Phosphorus Cycles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.nitrogen-phosphorus-cycles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_NITROGEN_PHOSPHORUS_CYCLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.nitrogen-phosphorus-cycles.v1',
  course: 'AP Environmental Science',
  cedUnit: 1,
  cedTopic: '1.5-1.6',
  cedTitle: 'Nitrogen and Phosphorus Cycles',
  planId: 'evelyn.ap.envsci.nitrogen-phosphorus-cycles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.nitrogen-phosphorus-cycles.v1' }],
  theory: [
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: 'NITROGEN CYCLE — five key processes (memorize order):' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • NITROGEN FIXATION: N₂ (atmospheric) → NH₃/NH₄⁺ (ammonia/ammonium). Performed by:` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '    - Symbiotic bacteria in legume roots (e.g., Rhizobium in soybean nodules).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '    - Free-living soil bacteria (Azotobacter).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '    - Cyanobacteria in water.' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '    - Lightning (small amount).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '    - Industrial Haber-Bosch process (synthesizes fertilizer).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • NITRIFICATION: NH₄⁺ → NO₂⁻ (nitrite) → NO₃⁻ (nitrate). Performed by nitrifying bacteria (Nitrosomonas → Nitrobacter). NO₃⁻ is the form most plants absorb.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • ASSIMILATION: plants absorb NO₃⁻ (or sometimes NH₄⁺) and incorporate into amino acids, proteins, DNA. Animals get N by eating plants/animals.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '  • AMMONIFICATION: decomposers convert dead organic N back to NH₄⁺.' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • DENITRIFICATION: NO₃⁻ → N₂ (returned to atmosphere). Performed by anaerobic bacteria in oxygen-poor soils/wetlands.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `KEY: nitrogen FIXATION and DENITRIFICATION are MIRROR PROCESSES — fixation pulls N from air; denitrification returns N to air.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `WHY N IS OFTEN LIMITING: although abundant in atmosphere, biologically usable forms (NO₃⁻, NH₄⁺) are scarce. Adding N fertilizer typically boosts plant growth.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: 'HUMAN DISRUPTIONS to nitrogen cycle:' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • SYNTHETIC FERTILIZER (Haber-Bosch process): doubles natural nitrogen-fixation rate globally.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • RUNOFF: excess fertilizer washes into streams → EUTROPHICATION (algal blooms → oxygen depletion → fish kills). Gulf of Mexico DEAD ZONE from Mississippi runoff.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • COMBUSTION: high-temp combustion (cars, power plants) creates NOx → acid rain, smog.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: 'PHOSPHORUS CYCLE — major differences from N:' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '  • NO ATMOSPHERIC STAGE. P stays in solid/dissolved form.' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • Source: WEATHERING of phosphate-containing rocks releases PO₄³⁻ into soil/water.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • Plant uptake → consumed by animals → released back via decomposition or excretion.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • Eventual SEDIMENTATION on ocean floor — geological uplift returns rocks to land slowly.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '  • Often LIMITING in freshwater systems (just as N often limits land/marine).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: 'HUMAN DISRUPTIONS to phosphorus cycle:' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '  • PHOSPHATE MINING for fertilizer (finite resource).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: '  • DETERGENTS (banned in many places now).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `  • FERTILIZER RUNOFF → eutrophication of freshwater lakes (Lake Erie algal blooms).` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', kind: 'definition', title: 'nitrogen fixation', content: 'converting atmospheric N₂ to biologically usable forms (NH₃, NH₄⁺).' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', kind: 'definition', title: 'eutrophication', content: 'nutrient enrichment of water → algal bloom → O₂ depletion → fish kill.' },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', kind: 'definition', title: 'denitrification', content: 'NO₃⁻ → N₂; returns N to atmosphere; anaerobic bacteria.' },
  ],
  methods: [
    {
      title: 'Worked eutrophication',
      steps: [
        'STEP 1 — Fertilizer (rich in NO₃⁻ and PO₄³⁻) enters pond. Nutrient enrichment.',
        'STEP 2 — ALGAL BLOOM: algae explode in population given the nutrients.',
        'STEP 3 — Algae quickly die off (life cycle short or shading themselves out).',
        `STEP 4 — Decomposers break down dead algae using OXYGEN — DECOMPOSITION CONSUMES DISSOLVED O₂.`,
        'STEP 5 — Pond becomes HYPOXIC (low oxygen) or ANOXIC (no oxygen).',
        'STEP 6 — FISH KILL: fish suffocate. Surviving organisms are mostly anaerobic.',
      ],
      example: { problem: `A farmer applies excess nitrogen fertilizer to his fields. Heavy rain washes the fertilizer into a nearby pond. Trace the chain of events leading to fish kills.`, solution: `Fertilizer → algal bloom → die-off → decomposition consumes O₂ → fish kill (eutrophication).` },
      relatedLoIds: ['apenvsci.nitrogen-phosphorus-cycles'],
    },
  ],
  pointers: [
    { content: 'N cycle: fixation, nitrification, assimilation, ammonification, denitrification.', kind: 'tip' },
    { content: 'Fixation = N₂ → NH₃/NH₄⁺. Denitrification = NO₃⁻ → N₂.', kind: 'tip' },
    { content: `P cycle: NO atmospheric stage; weathering → uptake → decomposition → sedimentation.`, kind: 'tip' },
    { content: 'Both cycles disrupted by fertilizer runoff → eutrophication → dead zones.', kind: 'tip' },
  ],
};
