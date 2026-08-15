/**
 * AP Environmental Science — Unit 4 CED 4.8-4.9: Climate and ENSO.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.climate-enso.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_CLIMATE_ENSO: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.climate-enso.v1',
  course: 'AP Environmental Science',
  cedUnit: 4,
  cedTopic: '4.8-4.9',
  cedTitle: 'Climate and ENSO',
  planId: 'evelyn.ap.envsci.climate-enso.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.climate-enso.v1' }],
  theory: [
    { loId: 'apenvsci.climate-enso', content: `WEATHER vs CLIMATE: WEATHER is short-term atmospheric conditions — today, this week. CLIMATE is the AVERAGE weather over LONG periods, conventionally 30 YEARS. "It snowed today" is weather; "winters here average below freezing" is climate. AP answers must use the right word.` },
    { loId: 'apenvsci.climate-enso', content: `CLIMATE FACTORS — what shapes a region's climate: LATITUDE (higher latitude → cooler, more seasonal swing), ELEVATION (cooler with height — roughly 6.5 degrees C lost per 1000 m), OCEAN CURRENTS (warm currents like the Gulf Stream warm NW Europe; cold ones like the California Current cool coastal California), TOPOGRAPHY (mountains make rain shadows; valleys trap pollution), PROXIMITY TO WATER (oceans MODERATE temperature — smaller seasonal swings; inland climates are extreme), and PREVAILING WINDS (deliver ocean moisture to land).` },
    { loId: 'apenvsci.climate-enso', content: `SAME LATITUDE, DIFFERENT CLIMATE: two cities at identical latitude get similar insolation, yet a coastal city (ocean-moderated, narrow temperature range) and an inland city (continental — hot summers, frigid winters) differ dramatically. When comparing climates, hold latitude fixed and hunt for the OTHER factor: elevation, currents, water proximity, or topography.` },
    { loId: 'apenvsci.climate-enso', content: `OCEAN-ATMOSPHERE COUPLING: the ocean stores ENORMOUS heat, and atmospheric circulation responds to sea-surface temperatures. That coupling is why a shift in Pacific water temperature (ENSO) can reorganize weather worldwide.` },
    { loId: 'apenvsci.climate-enso', content: `ENSO (El Nino-Southern Oscillation): a periodic see-saw in tropical Pacific sea-surface temperature AND atmospheric pressure. It cycles between neutral, El Nino (warm phase), and La Nina (cool phase) roughly every 3-7 years. It is a NATURAL oscillation — but climate change intensifies its impacts by raising the baseline.` },
    { loId: 'apenvsci.climate-enso', content: `NEUTRAL (normal) conditions: TRADE WINDS blow EAST-to-WEST across the Pacific, piling warm surface water in the west near Indonesia. Along the Peruvian coast, cold nutrient-rich water UPWELLS to replace the departing surface water — feeding one of the world's richest FISHERIES. Rain follows the warm water: Indonesia/Australia wet, coastal Peru dry.` },
    { loId: 'apenvsci.climate-enso', content: `EL NINO (warm phase): trade winds WEAKEN, so the warm pool sloshes BACK EASTWARD across the Pacific. UPWELLING off Peru is SUPPRESSED. Results: Peru/Ecuador get FLOODS; Indonesia/Australia get DROUGHT and fires; Peruvian FISHERIES COLLAPSE without nutrient upwelling. Global ripples: warmer North American winters, a WEAKER Atlantic hurricane season (more wind shear), wetter US Gulf states, droughts in parts of Africa.` },
    { loId: 'apenvsci.climate-enso', content: `LA NINA (cool phase): trade winds STRENGTHEN — an exaggerated normal. Cold upwelling off Peru INTENSIFIES; even more warm water piles up in the west, so Indonesia/Australia get EXTRA rain and flooding. US effects: a STRONGER Atlantic hurricane season, colder northern winters, and a DRIER Southwest.` },
    { loId: 'apenvsci.climate-enso', content: `THE MECHANISM TO CITE ON FRQs is always the TRADE WINDS: their strength sets where the warm water sits, which sets where air rises (rain) and whether Peruvian upwelling runs (fisheries). Weak trades = El Nino; strong trades = La Nina. Strong El Nino years also RAISE global average temperature as the warm Pacific vents heat to the atmosphere.` },
    { loId: 'apenvsci.climate-enso', kind: 'definition', title: 'climate', content: `the long-term average of weather, typically taken over 30 or more years.` },
    { loId: 'apenvsci.climate-enso', kind: 'definition', title: 'El Nino', content: `the warm phase of ENSO: trade winds weaken and warm Pacific surface water shifts eastward, suppressing Peruvian upwelling.` },
    { loId: 'apenvsci.climate-enso', kind: 'definition', title: 'upwelling', content: `the rising of cold, nutrient-rich deep water along a coast; it fuels productive fisheries like Peru's.` },
  ],
  methods: [
    {
      title: 'Compare two regional climates',
      steps: [
        `STEP 1 — Compare LATITUDE first. Same latitude means similar insolation, so the climate difference must come from another factor.`,
        `STEP 2 — Check ELEVATION: higher is cooler by about 6.5 degrees C per 1000 m — enough to give an equatorial highland an "eternal spring" climate.`,
        `STEP 3 — Check WATER PROXIMITY and OCEAN CURRENTS: coastal = moderated (narrow annual range, adjusted by warm or cold currents); inland = continental extremes.`,
        `STEP 4 — Check TOPOGRAPHY relative to prevailing winds: windward of mountains = wet; leeward = rain-shadow dry.`,
        `STEP 5 — Name the DOMINANT factor explicitly and state the resulting climate contrast — that is the scored move on FRQs.`,
      ],
      example: {
        problem: `Compare and predict the climates of (a) San Francisco, CA (38 N, coastal) and (b) Wichita, KS (38 N, inland).`,
        solution: `Same latitude, so insolation is similar — the difference is OCEAN PROXIMITY. San Francisco: the Pacific moderates temperatures (mild winters, cool marine-layer summers) — a maritime/Mediterranean climate with a narrow range. Wichita: no ocean buffer — a continental climate with hot summers above 35 degrees C and sub-freezing winters.`,
      },
      relatedLoIds: ['apenvsci.climate-enso'],
    },
    {
      title: 'Predict regional impacts of an ENSO phase',
      steps: [
        `STEP 1 — Identify the phase and state the TRADE-WIND change: El Nino = trades WEAKEN; La Nina = trades STRENGTHEN.`,
        `STEP 2 — Track the WARM WATER: weak trades let it shift EAST (El Nino); strong trades pile it further WEST (La Nina). Rain follows the warm water.`,
        `STEP 3 — Read off PERUVIAN UPWELLING: suppressed in El Nino (fisheries collapse, coastal floods); intensified in La Nina (rich fishing, dry coast).`,
        `STEP 4 — Assign the western Pacific the OPPOSITE: Indonesia/Australia get drought and fires in El Nino, extra rain and floods in La Nina.`,
        `STEP 5 — Add the remote effects: El Nino → weaker Atlantic hurricanes, warmer/wetter southern US, higher global average temperature; La Nina → stronger Atlantic hurricanes, drier US Southwest, colder northern winters.`,
      ],
      example: {
        problem: `Predict the typical impact of an El Nino event on: (a) Peruvian fishermen, (b) Indonesian farmers, (c) a California winter.`,
        solution: `(a) BAD for Peruvian fishermen — suppressed upwelling crashes anchovy and sardine stocks; the fishery collapses. (b) BAD for Indonesian farmers — the warm pool has moved east, bringing drought, crop failure, and forest fires. (c) California winter turns WET — El Nino typically brings heavier rain and storms, sometimes floods and landslides (La Nina winters tend to be drier).`,
      },
      relatedLoIds: ['apenvsci.climate-enso'],
    },
  ],
  pointers: [
    { content: 'Weather = short-term; climate = 30-year average. Use the exact term the question asks about.', kind: 'tip' },
    { content: 'Climate factors: latitude, elevation, ocean currents, topography, water proximity, prevailing winds.', kind: 'tip' },
    { content: 'Elevation cools ~6.5 degrees C per 1000 m — why equatorial Quito is cooler than sea-level Singapore.', kind: 'tip' },
    { content: 'ENSO hinges on TRADE WINDS: weak trades = El Nino (warm water east); strong trades = La Nina.', kind: 'tip' },
    { content: 'El Nino kills Peruvian upwelling → fishery collapse + Peru floods, while Indonesia/Australia get drought.', kind: 'tip' },
    { content: 'Hurricanes: El Nino SUPPRESSES the Atlantic season (wind shear); La Nina strengthens it.', kind: 'tip' },
  ],
};
