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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.nitrogen-phosphorus-cycles.v1' }],
  theory: [
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `THE NITROGEN PARADOX: the atmosphere is 78% nitrogen, but plants CANNOT use N₂ gas — the triple bond is too stable. Only specific bacteria (or industrial processes or lightning) can convert it into usable forms. This bottleneck is why N is so often the LIMITING nutrient on land and in the ocean.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', kind: 'definition', title: 'nitrogen fixation', content: `NITROGEN FIXATION converts atmospheric N₂ into biologically usable NH₃ / NH₄⁺ (ammonia / ammonium). Fixers include SYMBIOTIC bacteria in legume root nodules (Rhizobium), FREE-LIVING soil bacteria (Azotobacter), CYANOBACTERIA in water, LIGHTNING (small amount), and the industrial HABER-BOSCH process that makes synthetic fertilizer.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `NITRIFICATION: nitrifying bacteria convert NH₄⁺ into NO₂⁻ (nitrite) and then NO₃⁻ (nitrate), running Nitrosomonas then Nitrobacter. NO₃⁻ (nitrate) is the form MOST PLANTS absorb, so nitrification is what makes fixed nitrogen plant-ready.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `ASSIMILATION: plants absorb NO₃⁻ (sometimes NH₄⁺) and build it into amino acids, proteins, and DNA. Animals get their nitrogen by EATING plants or other animals — they cannot take it from soil or air directly.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `AMMONIFICATION: decomposers convert dead organic nitrogen (from dead organisms and waste) back into NH₄⁺, returning it to the soil pool. Also called mineralization.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', kind: 'definition', title: 'denitrification', content: `DENITRIFICATION converts NO₃⁻ back to N₂ gas, returning nitrogen to the atmosphere. It is performed by ANAEROBIC bacteria in oxygen-poor soils and wetlands. Fixation and denitrification are MIRROR processes — one pulls N from the air, the other returns it.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `FULL NITROGEN CYCLE ORDER (memorize): FIXATION (N₂ to NH₃/NH₄⁺), NITRIFICATION (NH₄⁺ to NO₂⁻ to NO₃⁻), ASSIMILATION (plants take up NO₃⁻), AMMONIFICATION (decomposers return NH₄⁺), DENITRIFICATION (NO₃⁻ back to N₂). Fixation and denitrification bracket the cycle at the atmospheric end.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `HUMAN DISRUPTIONS to the nitrogen cycle: SYNTHETIC FERTILIZER via Haber-Bosch has roughly DOUBLED the global natural nitrogen-fixation rate; fertilizer RUNOFF into streams causes EUTROPHICATION (algal blooms, oxygen depletion, fish kills) — the Gulf of Mexico DEAD ZONE is fed by Mississippi runoff; high-temperature COMBUSTION in cars and power plants creates NOx that drives acid rain and smog.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `PHOSPHORUS CYCLE — the key contrast with nitrogen: there is NO ATMOSPHERIC STAGE. Phosphorus stays in solid or dissolved form. Its source is WEATHERING of phosphate-bearing rocks, which releases PO₄³⁻ (phosphate) into soil and water; plants take it up, animals eat plants, and decomposition/excretion returns it.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `PHOSPHORUS is SLOW and geological. After entering water, phosphate eventually settles as SEDIMENT on the ocean floor; only slow GEOLOGIC UPLIFT returns those rocks to land, which is why the P cycle lacks the rapid biotic turnover the N cycle has. Phosphorus is often the LIMITING nutrient in FRESHWATER systems (just as N tends to limit land and marine systems).` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', kind: 'definition', title: 'eutrophication', content: `EUTROPHICATION is nutrient enrichment of water (usually from N and P runoff) that triggers an ALGAL BLOOM; when the algae die, decomposers consume dissolved O₂, driving the water hypoxic/anoxic and causing FISH KILLS.` },
    { loId: 'apenvsci.nitrogen-phosphorus-cycles', content: `HUMAN DISRUPTIONS to the phosphorus cycle: PHOSPHATE MINING for fertilizer draws down a FINITE resource; phosphate DETERGENTS (now banned in many places) added P to wastewater; FERTILIZER RUNOFF drives eutrophication of freshwater lakes — Lake Erie algal blooms are a classic example.` },
  ],
  methods: [
    {
      title: 'Trace a eutrophication chain from fertilizer to fish kill',
      when_to_use: 'When an FRQ describes fertilizer or nutrient runoff into a water body and asks for the mechanism or consequences.',
      steps: [
        `STEP 1 — NUTRIENT ENRICHMENT. Fertilizer rich in NO₃⁻ and PO₄³⁻ washes into the water body, raising nutrient levels.`,
        `STEP 2 — ALGAL BLOOM. Freed from nutrient limitation, algae explode in population.`,
        `STEP 3 — DIE-OFF. Algae die quickly (short life cycle, self-shading).`,
        `STEP 4 — DECOMPOSITION CONSUMES OXYGEN. Decomposers break down the dead algae using dissolved O₂.`,
        `STEP 5 — HYPOXIA/ANOXIA. The water becomes low-oxygen (hypoxic) or oxygen-free (anoxic).`,
        `STEP 6 — FISH KILL. Fish and other aerobic organisms suffocate; a recurring dead zone can form.`,
      ],
      example: { problem: `A farmer applies excess nitrogen fertilizer; heavy rain washes it into a nearby pond. Trace the chain of events leading to fish kills.`, solution: `Fertilizer (NO₃⁻, PO₄³⁻) enters the pond and enriches it -> algal bloom -> algae die off -> decomposers break them down and consume dissolved O₂ -> pond turns hypoxic/anoxic -> fish suffocate. This is EUTROPHICATION.` },
      relatedLoIds: ['apenvsci.nitrogen-phosphorus-cycles'],
    },
  ],
  pointers: [
    { content: 'N cycle order: fixation, nitrification, assimilation, ammonification, denitrification.', kind: 'tip' },
    { content: 'Fixation = N₂ to NH₃/NH₄⁺; denitrification = NO₃⁻ to N₂. They are mirror processes.', kind: 'tip' },
    { content: 'Nitrate (NO₃⁻) is the form most plants actually absorb.', kind: 'tip' },
    { content: 'Phosphorus has NO atmospheric stage and is slow/geological; N limits land, P often limits freshwater.', kind: 'tip' },
    { content: 'Fertilizer runoff -> eutrophication -> algal bloom -> O₂ depletion -> fish kill (Gulf/Lake Erie dead zones).', kind: 'tip' },
    { content: 'Haber-Bosch roughly doubled global N fixation; NOx from combustion drives acid rain and smog.', kind: 'tip' },
  ],
};
