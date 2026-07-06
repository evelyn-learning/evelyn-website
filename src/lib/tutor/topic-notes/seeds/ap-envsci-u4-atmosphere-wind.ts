/**
 * AP Environmental Science — Unit 4 CED 4.4-4.5: Atmosphere and Wind.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.atmosphere-wind.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_ATMOSPHERE_WIND: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.atmosphere-wind.v1',
  course: 'AP Environmental Science',
  cedUnit: 4,
  cedTopic: '4.4-4.5',
  cedTitle: 'Atmosphere and Wind',
  planId: 'evelyn.ap.envsci.atmosphere-wind.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.atmosphere-wind.v1' }],
  theory: [
    { loId: 'apenvsci.atmosphere-wind', content: 'ATMOSPHERIC LAYERS (bottom to top):' },
    { loId: 'apenvsci.atmosphere-wind', content: `  • TROPOSPHERE (0-12 km): where weather happens; temperature decreases with altitude. Most water vapor here.` },
    { loId: 'apenvsci.atmosphere-wind', content: `  • STRATOSPHERE (12-50 km): contains OZONE LAYER (~20-30 km, blocks UV). Temperature INCREASES with altitude (UV absorption by ozone).` },
    { loId: 'apenvsci.atmosphere-wind', content: '  • MESOSPHERE (50-85 km): coldest layer; meteors burn up.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • THERMOSPHERE (85-600+ km): aurora; very thin air.' },
    { loId: 'apenvsci.atmosphere-wind', content: 'GAS COMPOSITION of dry air (memorize):' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • N₂ (nitrogen): 78%.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • O₂ (oxygen): 21%.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • Ar (argon): 0.9%.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • CO₂: ~0.04% (420 ppm in 2024). Greenhouse gas.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • Trace: water vapor (variable), Ne, He, CH₄.' },
    { loId: 'apenvsci.atmosphere-wind', content: `CONVECTION CELLS — three pairs of Hadley/Ferrel/Polar cells per hemisphere drive global circulation:` },
    { loId: 'apenvsci.atmosphere-wind', content: `  • HADLEY CELL: equator to ~30° latitude. Warm air rises at equator → moves poleward → cools and SINKS at ~30° → returns to equator at surface. SINKING air at 30° creates DESERT BELTS (Sahara, Middle East, Australia, southwestern US).` },
    { loId: 'apenvsci.atmosphere-wind', content: '  • FERREL CELL: 30° to 60° latitude. Mid-latitudes — variable weather.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • POLAR CELL: 60° to pole. Sinking cold dense air at poles.' },
    { loId: 'apenvsci.atmosphere-wind', content: `CORIOLIS EFFECT: due to Earth's rotation, moving air (and water) is DEFLECTED — RIGHT in Northern Hemisphere, LEFT in Southern Hemisphere. Stronger at higher latitudes. Causes:` },
    { loId: 'apenvsci.atmosphere-wind', content: '  • Cyclones rotate counter-clockwise in N. hemisphere, clockwise in S.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • Wind belts curve.' },
    { loId: 'apenvsci.atmosphere-wind', content: 'GLOBAL WIND BELTS (resulting from convection + Coriolis):' },
    { loId: 'apenvsci.atmosphere-wind', content: `  • TRADE WINDS: 0-30°. From east toward equator (NE in N, SE in S). Drove sailing ships from Europe to Americas.` },
    { loId: 'apenvsci.atmosphere-wind', content: '  • WESTERLIES: 30-60°. From west. Drove return voyages.' },
    { loId: 'apenvsci.atmosphere-wind', content: '  • POLAR EASTERLIES: 60-90°. From east.' },
    { loId: 'apenvsci.atmosphere-wind', content: `INTERTROPICAL CONVERGENCE ZONE (ITCZ): where N and S Hadley cells converge near equator. Heavy rain belt.` },
    { loId: 'apenvsci.atmosphere-wind', content: `RAIN SHADOW: when moist air rises over a mountain range, it cools, condenses, and rains on the windward side. After crossing the peak, it descends, warms, and is dry on the leeward side. Creates desert just downwind of mountains. Examples: Death Valley (downwind of Sierras); eastern Cascades (Washington); Atacama (downwind of Andes).` },
    { loId: 'apenvsci.atmosphere-wind', kind: 'definition', title: 'Hadley cell', content: 'tropical convection cell from equator to 30°; sinking creates deserts.' },
    { loId: 'apenvsci.atmosphere-wind', kind: 'definition', title: 'Coriolis effect', content: `apparent deflection of moving objects due to Earth's rotation.` },
    { loId: 'apenvsci.atmosphere-wind', kind: 'definition', title: 'rain shadow', content: 'dry zone leeward of mountains; common cause of regional deserts.' },
  ],
  methods: [
    {
      title: 'Worked deserts',
      steps: [
        `STEP 1 — Equatorial sun heats air → air rises (low pressure at equator, lots of rain).`,
        'STEP 2 — Rising air cools, dumps moisture as rain over equator.',
        'STEP 3 — Now-dry air moves poleward at high altitude (within Hadley cell).',
        'STEP 4 — Around 30° latitude, the cooled-but-now-dry air SINKS toward surface.',
        `STEP 5 — Sinking air WARMS as it descends (compression heating) and remains DRY (already lost moisture).`,
        `STEP 6 — At surface, this dry warm air creates a HIGH-pressure belt with little precipitation → DESERTS.`,
        `STEP 7 — Examples: Sahara, Arabia, Australian outback, Mojave/Sonoran (US), Atacama (S. America), Kalahari (S. Africa).`,
      ],
      example: { problem: `Why are most major deserts located near 30° latitude? Use atmospheric circulation to explain.`, solution: 'Hadley cell descending dry air at 30° latitude creates global desert belts.' },
      relatedLoIds: ['apenvsci.atmosphere-wind'],
    },
  ],
  pointers: [
    { content: `Atmosphere: troposphere (weather), stratosphere (ozone), mesosphere, thermosphere.`, kind: 'tip' },
    { content: 'Composition: 78% N₂, 21% O₂, 0.04% CO₂.', kind: 'tip' },
    { content: `3 cells per hemisphere: Hadley (0-30°), Ferrel (30-60°), Polar (60-90°). Sinking at 30° → deserts.`, kind: 'tip' },
    { content: 'Coriolis: deflects right in N, left in S; drives global wind belts.', kind: 'tip' },
    { content: 'Rain shadow: dry side leeward of mountains.', kind: 'tip' },
  ],
};
