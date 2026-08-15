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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.watersheds-solar.v1' }],
  theory: [
    { loId: 'apenvsci.watersheds-solar', content: `WATERSHED (drainage basin): the land area that drains to a common waterbody — a river, lake, or ocean. Its boundary is set by topographic high points called DIVIDES; water flows away from a divide into one basin or the other. Scale examples: the Mississippi watershed drains about 41% of the continental US; the Amazon basin covers roughly 35% of South America.` },
    { loId: 'apenvsci.watersheds-solar', content: `WATERSHED FUNCTIONS: (a) COLLECT and CONVEY water from rain and snowmelt into streams and rivers; (b) RECHARGE groundwater where soil and vegetation allow INFILTRATION; (c) FILTER pollutants — wetlands within the watershed are natural filters and flood sponges.` },
    { loId: 'apenvsci.watersheds-solar', content: `LAND-USE IMPACTS on a watershed: IMPERVIOUS SURFACES (roads, parking lots, roofs) block infiltration → MORE runoff, MORE flooding, LESS aquifer recharge. DEFORESTATION removes canopy interception and root structure → more erosion and runoff. AGRICULTURE adds fertilizer and pesticide runoff (nonpoint-source pollution). URBAN development adds combined sewer overflows, road salt, and oil/grease.` },
    { loId: 'apenvsci.watersheds-solar', content: `HEALTHY watersheds — forested, undeveloped, wetlands intact — deliver BETTER water quality and natural FLOOD CONTROL downstream. Everything done upstream (paving, farming, clearing) is felt by everyone DOWNSTREAM: higher flood peaks, sediment, pollutants, and higher water-treatment costs.` },
    { loId: 'apenvsci.watersheds-solar', content: `WATERSHED MANAGEMENT toolkit: RIPARIAN BUFFERS (streamside vegetation filters runoff), WETLAND protection and restoration, farm BEST MANAGEMENT PRACTICES (cover crops, contour plowing, integrated pest management), STORMWATER controls (retention ponds, permeable pavement, green infrastructure), and ZONING limits on impervious surface.` },
    { loId: 'apenvsci.watersheds-solar', content: `SOLAR RADIATION is UNEVEN across Earth. At the EQUATOR the sun is nearly overhead year-round — rays strike almost PERPENDICULAR, concentrating energy on a small area. Near the POLES the sun sits low: the SAME beam spreads over a LARGER area and passes through MORE atmosphere, so each square meter gets less energy. This latitudinal gradient drives the global temperature pattern (and hence circulation).` },
    { loId: 'apenvsci.watersheds-solar', content: `SEASONS are caused by Earth's 23.5-DEGREE AXIAL TILT — NOT by distance from the sun. In Northern summer (June solstice) the Northern Hemisphere is tilted TOWARD the sun: more direct rays, longer days. In December the reverse. At the EQUINOXES (March, September) the tilt is sideways-on and both hemispheres receive equal sun.` },
    { loId: 'apenvsci.watersheds-solar', content: `KEY LATITUDES: TROPIC OF CANCER (23.5 N) — northernmost latitude with the sun directly overhead, at the June solstice. TROPIC OF CAPRICORN (23.5 S) — southernmost, at the December solstice. ARCTIC CIRCLE (66.5 N) — experiences 24-hour polar day/night at the solstices. EQUATORIAL regions show the LEAST seasonal variation.` },
    { loId: 'apenvsci.watersheds-solar', content: `COMMON MISCONCEPTION — "seasons come from Earth being closer to the sun." Earth's orbit IS slightly elliptical, but the distance varies only about 3% — in fact Earth is CLOSEST in January, during Northern winter. TILT, not distance, drives seasons; the tilt effect on sun angle and day length overwhelms the tiny distance effect.` },
    { loId: 'apenvsci.watersheds-solar', kind: 'definition', title: 'watershed', content: `the land area that drains to a common waterbody; bounded by topographic divides.` },
    { loId: 'apenvsci.watersheds-solar', kind: 'definition', title: 'insolation', content: `INcoming SOLar radiATION — solar energy received per unit area; highest where rays strike perpendicular (equator), lowest where oblique (poles).` },
    { loId: 'apenvsci.watersheds-solar', kind: 'definition', title: 'axial tilt', content: `Earth's 23.5-degree tilt relative to its orbital plane; the cause of seasons.` },
  ],
  methods: [
    {
      title: 'Trace a land-use change through a watershed',
      steps: [
        `STEP 1 — Identify what the change does to INFILTRATION: paving and clearing reduce it; vegetation and wetlands increase it.`,
        `STEP 2 — Less infiltration means MORE surface RUNOFF — predict higher flood peaks and flashier streams downstream.`,
        `STEP 3 — List what the runoff CARRIES: sediment from bare soil, nutrients and pesticides from farms, oil/salt/grease from roads.`,
        `STEP 4 — Follow the groundwater side: reduced infiltration → reduced AQUIFER RECHARGE → lower water tables and diminished dry-season stream flow.`,
        `STEP 5 — State downstream CONSEQUENCES: flooding, turbidity, degraded fish habitat, higher treatment costs — then name MITIGATIONS (retention ponds, permeable pavement, riparian buffers, wetland restoration).`,
      ],
      example: {
        problem: `A new shopping mall is built on a 50-acre parking-lot foundation in a previously forested watershed. Predict three immediate and three long-term consequences for the downstream watershed.`,
        solution: `IMMEDIATE: runoff spikes (bare soil, no canopy), erosion sends sediment into streams (turbidity), and flood risk rises as impervious surface grows. LONG-TERM: chronic pollution (oil, road salt, landscaping fertilizer), reduced aquifer recharge from lost infiltration, and degraded fish habitat plus greater downstream flooding and treatment costs. Mitigate with green infrastructure, retention ponds, permeable pavement, and vegetation buffers.`,
      },
      relatedLoIds: ['apenvsci.watersheds-solar'],
    },
    {
      title: 'Reason about seasons from tilt geometry',
      steps: [
        `STEP 1 — Fix the month, then ask which hemisphere is tilted TOWARD the sun. June: Northern. December: Southern. That hemisphere has summer.`,
        `STEP 2 — Locate the overhead sun: June solstice → Tropic of Cancer (23.5 N); December solstice → Tropic of Capricorn (23.5 S); equinoxes → the equator.`,
        `STEP 3 — Apply the polar rule: inside the Arctic or Antarctic Circle, the summer pole gets 24-hour daylight and the winter pole 24-hour darkness around the solstice.`,
        `STEP 4 — If the question raises orbital distance, dismiss it: the ~3% distance variation is negligible next to the tilt-driven change in sun angle and day length.`,
      ],
      relatedLoIds: ['apenvsci.watersheds-solar'],
    },
  ],
  pointers: [
    { content: 'Watershed = drainage basin, bounded by DIVIDES. Everything upstream affects everyone downstream.', kind: 'tip' },
    { content: 'Impervious surface is the FRQ villain: less infiltration → more runoff and flooding, less aquifer recharge.', kind: 'tip' },
    { content: 'Watershed fixes: riparian buffers, wetlands, farm BMPs, retention ponds, permeable pavement.', kind: 'tip' },
    { content: 'Equator gets more energy per area because rays strike PERPENDICULAR; polar rays spread over a larger area.', kind: 'tip' },
    { content: 'Seasons come from the 23.5-degree TILT, not distance — Earth is actually closest to the sun in January.', kind: 'tip' },
    { content: 'June solstice: sun overhead at Tropic of Cancer (23.5 N); December: Capricorn (23.5 S); equinox: equator.', kind: 'tip' },
  ],
};
