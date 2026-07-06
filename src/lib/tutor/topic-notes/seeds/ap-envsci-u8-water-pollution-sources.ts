/**
 * AP Environmental Science — Unit 8 CED 8.1-8.2+8.4: Water Pollution Sources.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.water-pollution-sources.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_WATER_POLLUTION_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.water-pollution-sources.v1',
  course: 'AP Environmental Science',
  cedUnit: 8,
  cedTopic: '8.1-8.2+8.4',
  cedTitle: 'Water Pollution Sources',
  planId: 'evelyn.ap.envsci.water-pollution-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.water-pollution-sources.v1' }],
  theory: [
    { loId: 'apenvsci.water-pollution-sources', content: 'WATER POLLUTION SOURCES:' },
    { loId: 'apenvsci.water-pollution-sources', content: `  • POINT SOURCE: identifiable, fixed location.
     Examples: sewage treatment plant outfall, factory discharge, oil-tanker spill, chemical plant pipe.
     Easier to regulate and monitor.` },
    { loId: 'apenvsci.water-pollution-sources', content: `  • NONPOINT SOURCE: diffuse, hard to trace.
     Examples: agricultural runoff (fertilizer, pesticide), urban runoff (oil, lawn chemicals), atmospheric deposition (mercury), construction sediment.
     LARGER total contribution; harder to regulate.` },
    { loId: 'apenvsci.water-pollution-sources', content: 'TYPES OF POLLUTANTS:' },
    { loId: 'apenvsci.water-pollution-sources', content: `  • PATHOGENS (bacteria, viruses, parasites): from sewage, livestock waste. Cause cholera, typhoid, dysentery.` },
    { loId: 'apenvsci.water-pollution-sources', content: `  • OXYGEN-DEMANDING WASTES: organic matter that decomposers consume O₂ to break down. Includes sewage, food processing.` },
    { loId: 'apenvsci.water-pollution-sources', content: '  • INORGANIC NUTRIENTS (N, P): cause eutrophication.' },
    { loId: 'apenvsci.water-pollution-sources', content: '  • TOXIC HEAVY METALS (lead, mercury, arsenic): bioaccumulate, persist.' },
    { loId: 'apenvsci.water-pollution-sources', content: '  • SYNTHETIC ORGANIC COMPOUNDS: pesticides, PCBs, pharmaceuticals.' },
    { loId: 'apenvsci.water-pollution-sources', content: '  • SEDIMENT: from erosion. Cloudy water blocks light, smothers eggs/larvae.' },
    { loId: 'apenvsci.water-pollution-sources', content: '  • RADIOACTIVE: from mining, nuclear, medical waste.' },
    { loId: 'apenvsci.water-pollution-sources', content: '  • THERMAL: heated water from power plants reduces dissolved O₂.' },
    { loId: 'apenvsci.water-pollution-sources', content: 'SURFACE vs GROUNDWATER:' },
    { loId: 'apenvsci.water-pollution-sources', content: `  • SURFACE WATER: rivers, lakes, oceans. Easier to clean (sunlight, mixing). Pollution visible.` },
    { loId: 'apenvsci.water-pollution-sources', content: `  • GROUNDWATER (in AQUIFERS): below land surface. SLOW to contaminate AND slow to clean. Once polluted, takes decades to centuries to recover. Examples of groundwater contamination: leaking underground gasoline tanks, septic systems, fracking fluid, agricultural nitrates.` },
    { loId: 'apenvsci.water-pollution-sources', content: `INDICATOR SPECIES: their presence/absence reveals water quality. Mayflies, stoneflies = clean; midge larvae, blackworms = polluted.` },
    { loId: 'apenvsci.water-pollution-sources', content: `CLEAN WATER ACT (1972, US): regulates point sources via NPDES (National Pollutant Discharge Elimination System) permits. Limited control over nonpoint sources.` },
    { loId: 'apenvsci.water-pollution-sources', content: 'WETLANDS AND MANGROVES:' },
    { loId: 'apenvsci.water-pollution-sources', content: '  • WETLANDS: areas saturated with water (swamps, marshes, bogs, fens).' },
    { loId: 'apenvsci.water-pollution-sources', content: `  • Functions:
     - WATER PURIFICATION (plants and microbes break down pollutants).
     - FLOOD CONTROL (act as sponges).
     - SEDIMENT TRAPPING.
     - HABITAT (50% of N. American bird species use wetlands).
     - CARBON STORAGE (peat).
     - RECHARGE GROUNDWATER.` },
    { loId: 'apenvsci.water-pollution-sources', content: `  • THREATS: drainage for agriculture and development. ~50% of US wetlands lost; >85% in some states (CA).` },
    { loId: 'apenvsci.water-pollution-sources', content: '  • MANGROVES: salt-tolerant trees in tropical/subtropical coasts.' },
    { loId: 'apenvsci.water-pollution-sources', content: `  • Functions:
     - PROTECT COASTS from storms (10-15 mm waves reduced per 100 m of mangrove).
     - PREVENT EROSION (root systems hold sediment).
     - NURSERY for fisheries (shrimp, crabs, fish).
     - CARBON STORAGE (mangroves store ~5x more C per area than terrestrial forests).` },
    { loId: 'apenvsci.water-pollution-sources', content: `  • THREATS: shrimp aquaculture (mangrove cleared for ponds), coastal development, sea-level rise.` },
    { loId: 'apenvsci.water-pollution-sources', content: '  • Loss: ~30-50% of historical mangrove cover gone; 1-2% disappearing per year.' },
    { loId: 'apenvsci.water-pollution-sources', kind: 'definition', title: 'point source', content: 'identifiable, fixed pollution location.' },
    { loId: 'apenvsci.water-pollution-sources', kind: 'definition', title: 'nonpoint source', content: 'diffuse pollution (agriculture, urban runoff).' },
    { loId: 'apenvsci.water-pollution-sources', kind: 'definition', title: 'mangrove', content: 'salt-tolerant tropical/subtropical coastal tree; nursery + protection.' },
  ],
  methods: [
    {
      title: 'Worked classify',
      steps: [
        '(a) POINT — single, identifiable pipe.',
        '(b) NONPOINT — diffuse, occurs across many lawns; rainfall-dependent.',
        '(c) POINT — single identifiable spill location.',
        '(d) NONPOINT — atmospheric source spread across watershed.',
      ],
      example: { problem: `Classify each as POINT or NONPOINT water pollution source: (a) Wastewater pipe from sewage treatment plant. (b) Lawn fertilizer washed into a stream during rain. (c) Oil tanker spill. (d) Atmospheric deposition of mercury onto a lake.`, solution: '(a) Point. (b) Nonpoint. (c) Point. (d) Nonpoint.' },
      relatedLoIds: ['apenvsci.water-pollution-sources'],
    },
  ],
  pointers: [
    { content: 'Point (factory, pipe) vs nonpoint (agriculture, urban) pollution.', kind: 'tip' },
    { content: `Pathogens, oxygen-demanding wastes, nutrients, toxics, sediment, thermal, radioactive.`, kind: 'tip' },
    { content: 'Groundwater pollution slow to develop AND to clean up.', kind: 'tip' },
    { content: `Wetlands + mangroves provide flood control, habitat, water purification, carbon storage.`, kind: 'tip' },
    { content: 'Clean Water Act 1972 controls point sources via NPDES; nonpoint less regulated.', kind: 'tip' },
  ],
};
