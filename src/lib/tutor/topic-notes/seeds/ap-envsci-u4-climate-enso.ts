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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.climate-enso.v1' }],
  theory: [
    { loId: 'apenvsci.climate-enso', content: 'WEATHER vs CLIMATE:' },
    { loId: 'apenvsci.climate-enso', content: '  • WEATHER: short-term atmospheric conditions (today, this week).' },
    { loId: 'apenvsci.climate-enso', content: '  • CLIMATE: average weather over LONG TIME PERIODS (typically 30 years).' },
    { loId: 'apenvsci.climate-enso', content: 'CLIMATE FACTORS:' },
    { loId: 'apenvsci.climate-enso', content: '  • LATITUDE: higher latitude → cooler, more seasonal variation.' },
    { loId: 'apenvsci.climate-enso', content: '  • ELEVATION: higher elevation → cooler (~6.5°C drop per 1000m).' },
    { loId: 'apenvsci.climate-enso', content: `  • OCEAN CURRENTS: warm currents (e.g., Gulf Stream warms NW Europe). Cold currents (e.g., California Current cools coastal CA).` },
    { loId: 'apenvsci.climate-enso', content: '  • TOPOGRAPHY: mountains affect rain shadows; valleys trap pollution.' },
    { loId: 'apenvsci.climate-enso', content: `  • PROXIMITY TO WATER: oceans moderate temperatures (lower seasonal swings); inland is more extreme.` },
    { loId: 'apenvsci.climate-enso', content: '  • PREVAILING WINDS: bring moisture from ocean to land.' },
    { loId: 'apenvsci.climate-enso', content: `OCEAN-ATMOSPHERE COUPLING: ocean stores enormous heat; atmospheric circulation depends on ocean temperatures.` },
    { loId: 'apenvsci.climate-enso', content: `EL NIÑO-SOUTHERN OSCILLATION (ENSO): periodic shift in Pacific Ocean temperatures and atmospheric pressure.` },
    { loId: 'apenvsci.climate-enso', content: 'NORMAL conditions (NEUTRAL phase):' },
    { loId: 'apenvsci.climate-enso', content: '  • Trade winds blow EAST → WEST across Pacific.' },
    { loId: 'apenvsci.climate-enso', content: '  • Push warm surface water westward (toward Indonesia).' },
    { loId: 'apenvsci.climate-enso', content: `  • COLD water UPWELLS off South American coast (Peru) — nutrient-rich, supports fisheries.` },
    { loId: 'apenvsci.climate-enso', content: '  • Indonesia/Australia: rainy. South America (Peru): dry. Cold upwelling.' },
    { loId: 'apenvsci.climate-enso', content: 'EL NIÑO (warm phase, every 3-7 years):' },
    { loId: 'apenvsci.climate-enso', content: '  • Trade winds WEAKEN.' },
    { loId: 'apenvsci.climate-enso', content: '  • Warm water sloshes BACK eastward across Pacific.' },
    { loId: 'apenvsci.climate-enso', content: '  • UPWELLING off Peru SUPPRESSED.' },
    { loId: 'apenvsci.climate-enso', content: '  • Result: Peru/Ecuador get FLOODS. Indonesia/Australia get DROUGHTS, fires.' },
    { loId: 'apenvsci.climate-enso', content: `  • Global ripple effects: warmer winters in N. America, weaker Atlantic hurricane season, US Gulf states wetter, Africa droughts.` },
    { loId: 'apenvsci.climate-enso', content: '  • Peru fisheries collapse without upwelling.' },
    { loId: 'apenvsci.climate-enso', content: 'LA NIÑA (cool phase):' },
    { loId: 'apenvsci.climate-enso', content: '  • Trade winds STRENGTHEN.' },
    { loId: 'apenvsci.climate-enso', content: '  • Cold upwelling INTENSIFIES off Peru.' },
    { loId: 'apenvsci.climate-enso', content: '  • Indonesia/Australia: extra rain, flooding.' },
    { loId: 'apenvsci.climate-enso', content: `  • US: stronger Atlantic hurricane season; cold winters in northern US, drier Southwest.` },
    { loId: 'apenvsci.climate-enso', content: `ENSO is a NATURAL CLIMATE OSCILLATION but its impacts are INTENSIFIED by climate change (warmer baseline, more extreme weather).` },
    { loId: 'apenvsci.climate-enso', kind: 'definition', title: 'climate', content: 'long-term average weather (typically 30+ years).' },
    { loId: 'apenvsci.climate-enso', kind: 'definition', title: 'El Niño', content: 'warm phase of ENSO; trade winds weaken, warm water moves east.' },
    { loId: 'apenvsci.climate-enso', kind: 'definition', title: 'upwelling', content: 'rising of cold, nutrient-rich water along coasts.' },
  ],
  methods: [
    {
      title: 'Worked region',
      steps: [
        'STEP 1 — Both at same latitude (38°N). So insolation similar.',
        `STEP 2 — SF has OCEAN PROXIMITY: Pacific Ocean moderates temperatures. Warm in winter (no extreme cold), cool in summer (Pacific marine layer). Mediterranean climate.`,
        `STEP 3 — Wichita is INLAND (no ocean buffer). Continental climate: hot summers (35°C+), cold winters (sub-freezing).`,
        `STEP 4 — Despite same latitude, climate is dramatically different due to ocean proximity.`,
      ],
      example: { problem: `Compare and predict climate of: (a) San Francisco, CA (38°N, coastal) and (b) Wichita, KS (38°N, inland).`, solution: `SF: maritime/Mediterranean (mild, narrow temperature range). Wichita: continental (extreme summer/winter).` },
      relatedLoIds: ['apenvsci.climate-enso'],
    },
  ],
  pointers: [
    { content: 'Weather (short-term) vs climate (30-year average).', kind: 'tip' },
    { content: `Climate factors: latitude, elevation, ocean currents, topography, prevailing winds.`, kind: 'tip' },
    { content: `ENSO oscillation: El Niño (warm, weak trades) vs La Niña (cold, strong trades) every 3-7 years.`, kind: 'tip' },
    { content: 'El Niño: Peruvian fishery collapse, US wet, Atlantic hurricanes weak.', kind: 'tip' },
  ],
};
