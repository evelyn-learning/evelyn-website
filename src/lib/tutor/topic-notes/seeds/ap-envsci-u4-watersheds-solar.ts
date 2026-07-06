/**
 * AP Environmental Science — Unit 4 CED 4.6-4.7: Watersheds and Solar Radiation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.watersheds-solar.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_WATERSHEDS_SOLAR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.watersheds-solar.v1',
  course: 'AP Environmental Science',
  cedUnit: 4,
  cedTopic: '4.6-4.7',
  cedTitle: 'Watersheds and Solar Radiation',
  planId: 'evelyn.ap.envsci.watersheds-solar.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.watersheds-solar.v1' }],
  theory: [
    { loId: 'apenvsci.watersheds-solar', content: `WATERSHED (drainage basin): land area that drains to a common waterbody (river, lake, ocean).` },
    { loId: 'apenvsci.watersheds-solar', content: `  • Defined by topographic high points (DIVIDES) — the boundary water flows away from.` },
    { loId: 'apenvsci.watersheds-solar', content: `  • Examples: Mississippi watershed (1.2M sq mi, 41% of US drains here); Amazon (35% of South America).` },
    { loId: 'apenvsci.watersheds-solar', content: 'WATERSHED FUNCTION:' },
    { loId: 'apenvsci.watersheds-solar', content: '  • Collect/convey water from rain/snowmelt to streams/rivers.' },
    { loId: 'apenvsci.watersheds-solar', content: '  • Recharge groundwater (when soil/vegetation allows infiltration).' },
    { loId: 'apenvsci.watersheds-solar', content: '  • Filter pollutants (wetland role).' },
    { loId: 'apenvsci.watersheds-solar', content: 'LAND-USE IMPACTS on watersheds:' },
    { loId: 'apenvsci.watersheds-solar', content: `  • IMPERVIOUS SURFACES (parking lots, roads): water can't infiltrate → more runoff, more flooding, less aquifer recharge.` },
    { loId: 'apenvsci.watersheds-solar', content: '  • DEFORESTATION: less canopy interception, less infiltration, more erosion.' },
    { loId: 'apenvsci.watersheds-solar', content: '  • AGRICULTURE: fertilizer/pesticide runoff (NPS pollution).' },
    { loId: 'apenvsci.watersheds-solar', content: '  • URBAN DEVELOPMENT: combined sewer overflows, road salt, oil/grease.' },
    { loId: 'apenvsci.watersheds-solar', content: `  • HEALTHY watersheds (forested, undeveloped, wetlands intact): better water quality and flood control.` },
    { loId: 'apenvsci.watersheds-solar', content: 'SOLAR RADIATION (insolation): energy received per unit area from Sun.' },
    { loId: 'apenvsci.watersheds-solar', content: '  • Earth receives uneven insolation:' },
    { loId: 'apenvsci.watersheds-solar', content: `  • EQUATOR: high (sun nearly directly overhead year-round). Concentrated solar energy on small surface area.` },
    { loId: 'apenvsci.watersheds-solar', content: '  • POLES: low (sun low on horizon). Same energy spread over larger area.' },
    { loId: 'apenvsci.watersheds-solar', content: '  • This drives global temperature gradient.' },
    { loId: 'apenvsci.watersheds-solar', content: `SEASONS — caused by Earth's 23.5° AXIAL TILT, not by orbital distance from sun.` },
    { loId: 'apenvsci.watersheds-solar', content: `  • In Northern summer (June solstice), Northern hemisphere TILTED TOWARD sun → more direct sunlight, longer days. Southern hemisphere tilted AWAY → winter.` },
    { loId: 'apenvsci.watersheds-solar', content: `  • In Southern summer (December solstice), reverse. 
  • EQUINOXES (March, September): tilt is sideways; both hemispheres receive equal sun.` },
    { loId: 'apenvsci.watersheds-solar', content: `  • TROPIC OF CANCER (23.5°N): northernmost latitude where sun is directly overhead at June solstice.` },
    { loId: 'apenvsci.watersheds-solar', content: '  • TROPIC OF CAPRICORN (23.5°S): southernmost, December solstice.' },
    { loId: 'apenvsci.watersheds-solar', content: '  • ARCTIC CIRCLE (66.5°N): polar night/day at solstices.' },
    { loId: 'apenvsci.watersheds-solar', content: '  • EQUATORIAL regions have least seasonal variation.' },
    { loId: 'apenvsci.watersheds-solar', content: `COMMON MISCONCEPTION: seasons are due to distance from sun. Earth's orbit IS slightly elliptical, but variation is only ~3% — NOT significant. Tilt drives seasons.` },
    { loId: 'apenvsci.watersheds-solar', kind: 'definition', title: 'watershed', content: 'land area draining to a common waterbody.' },
    { loId: 'apenvsci.watersheds-solar', kind: 'definition', title: 'insolation', content: 'incoming solar radiation per unit area.' },
    { loId: 'apenvsci.watersheds-solar', kind: 'definition', title: 'axial tilt', content: `Earth's 23.5° tilt; cause of seasons.` },
  ],
  methods: [
    {
      title: 'Worked watershed',
      steps: [
        `STEP 1 — IMMEDIATE consequences:
  • RUNOFF SPIKES during/after construction (bare soil, no canopy). 
  • EROSION carries soil into streams (turbidity, sedimentation). 
  • FLOODING risk increases as impervious surfaces ↑.`,
        `STEP 2 — LONG-TERM consequences:
  • POLLUTION: oil from cars, road salt, fertilizers from landscaping → enters runoff. 
  • REDUCED AQUIFER RECHARGE — less infiltration; groundwater lowers. 
  • FISH HABITAT degraded (sediment + pollutants). 
  • DOWNSTREAM FLOODING (impervious surface concentrates runoff). 
  • Higher water TREATMENT COSTS for downstream cities.`,
        `STEP 3 — Mitigation: green infrastructure, retention ponds, permeable pavement, vegetation buffers.`,
      ],
      example: { problem: `A new shopping mall is built on a 50-acre parking-lot foundation in a previously forested watershed. Predict three immediate and three long-term consequences for the downstream watershed.`, solution: `Immediate: runoff, erosion, flooding. Long-term: pollution, reduced recharge, habitat degradation.` },
      relatedLoIds: ['apenvsci.watersheds-solar'],
    },
  ],
  pointers: [
    { content: 'Watershed = drainage basin; land use within affects downstream water.', kind: 'tip' },
    { content: 'Insolation: highest at equator (direct), lowest at poles (oblique).', kind: 'tip' },
    { content: 'Seasons from 23.5° AXIAL TILT, not orbital distance.', kind: 'tip' },
    { content: 'Tropics of Cancer (23.5°N) and Capricorn (23.5°S) bound direct-overhead range.', kind: 'tip' },
  ],
};
