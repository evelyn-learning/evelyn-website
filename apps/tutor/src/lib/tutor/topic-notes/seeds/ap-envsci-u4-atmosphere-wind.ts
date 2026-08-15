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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.atmosphere-wind.v1' }],
  theory: [
    { loId: 'apenvsci.atmosphere-wind', content: `ATMOSPHERIC LAYERS, bottom to top: TROPOSPHERE (0-12 km — where WEATHER happens; nearly all water vapor lives here; temperature DECREASES with altitude), STRATOSPHERE (12-50 km — contains the OZONE LAYER at roughly 20-30 km that blocks UV; temperature INCREASES with altitude because ozone absorbs UV), MESOSPHERE (50-85 km — coldest layer; meteors burn up), THERMOSPHERE (85-600+ km — auroras; extremely thin air).` },
    { loId: 'apenvsci.atmosphere-wind', content: `GAS COMPOSITION of dry air — MEMORIZE: nitrogen 78%, oxygen 21%, argon 0.9%, CO2 about 0.04% (420 ppm as of 2024, and rising — the key GREENHOUSE GAS). Trace gases include water vapor (highly variable), neon, helium, and methane.` },
    { loId: 'apenvsci.atmosphere-wind', content: `THE CIRCULATION ENGINE: intense equatorial heating makes air RISE at the equator; that rising sets up three paired CONVECTION CELLS per hemisphere that move heat poleward. Convection cells + Earth's rotation together explain where rain belts, deserts, and prevailing winds sit.` },
    { loId: 'apenvsci.atmosphere-wind', content: `HADLEY CELL (0-30 degrees latitude): warm air RISES at the equator (heavy rain), moves poleward aloft, cools, and SINKS near 30 degrees. The sinking air is DRY (it dropped its moisture over the equator) and warms as it descends — creating the global DESERT BELTS at ~30 degrees: Sahara, Middle East, Australian outback, southwestern US.` },
    { loId: 'apenvsci.atmosphere-wind', content: `FERREL CELL (30-60 degrees): mid-latitude cell with variable, changeable weather. POLAR CELL (60-90 degrees): cold dense air SINKS at the poles. Together with the Hadley cell that makes THREE cells per hemisphere — rising at 0 and 60 degrees (wet), sinking at 30 and 90 degrees (dry).` },
    { loId: 'apenvsci.atmosphere-wind', content: `CORIOLIS EFFECT: because Earth rotates, moving air and water are DEFLECTED — to the RIGHT in the Northern Hemisphere, to the LEFT in the Southern Hemisphere; the effect strengthens toward the poles. Consequences: cyclones spin COUNTER-CLOCKWISE in the Northern Hemisphere and clockwise in the Southern, and the global wind belts curve rather than blowing straight north-south.` },
    { loId: 'apenvsci.atmosphere-wind', content: `GLOBAL WIND BELTS (convection + Coriolis): TRADE WINDS (0-30 degrees, blow from the east toward the equator — NE trades in the north, SE trades in the south; they carried sailing ships from Europe to the Americas), WESTERLIES (30-60 degrees, blow from the west — the return route), POLAR EASTERLIES (60-90 degrees, from the east).` },
    { loId: 'apenvsci.atmosphere-wind', content: `INTERTROPICAL CONVERGENCE ZONE (ITCZ): the band near the equator where the northern and southern Hadley cells CONVERGE and air rises hardest — a persistent HEAVY-RAIN belt. It migrates seasonally with the overhead sun, driving monsoon rains.` },
    { loId: 'apenvsci.atmosphere-wind', content: `RAIN SHADOW: moist air forced UP a mountain range cools and CONDENSES — heavy rain and snow on the WINDWARD side. Crossing the crest, the now-dry air DESCENDS, warms by compression, and stays dry — a DESERT on the LEEWARD side. Examples: Death Valley (leeward of the Sierra Nevada), eastern Cascades in Washington, the Atacama (leeward of the Andes).` },
    { loId: 'apenvsci.atmosphere-wind', kind: 'definition', title: 'Hadley cell', content: `the tropical convection cell from the equator to about 30 degrees latitude; its sinking dry air creates the world's major desert belts.` },
    { loId: 'apenvsci.atmosphere-wind', kind: 'definition', title: 'Coriolis effect', content: `the apparent deflection of moving air and water caused by Earth's rotation — right in the Northern Hemisphere, left in the Southern.` },
    { loId: 'apenvsci.atmosphere-wind', kind: 'definition', title: 'rain shadow', content: `the dry zone on the leeward side of a mountain range; a common cause of regional deserts.` },
  ],
  methods: [
    {
      title: 'Explain a regional wet or dry pattern with circulation',
      steps: [
        `STEP 1 — Locate the region's LATITUDE and place it in a cell: 0-30 Hadley, 30-60 Ferrel, 60-90 Polar.`,
        `STEP 2 — Ask: is air RISING or SINKING there? Rising (equator, 60 degrees) → cooling → condensation → WET. Sinking (30 degrees, poles) → warming, already dry → DRY.`,
        `STEP 3 — Add the WIND BELT for that latitude (trades, westerlies, or polar easterlies) and apply CORIOLIS: deflect right in the north, left in the south.`,
        `STEP 4 — Check for TOPOGRAPHY: mountains across the prevailing wind create a wet windward side and a rain-shadow desert leeward.`,
        `STEP 5 — Name real examples to anchor the answer (Sahara at 30 degrees, ITCZ rainforests at the equator, Death Valley in the Sierra rain shadow).`,
      ],
      example: {
        problem: `Why are most major deserts located near 30 degrees latitude? Use atmospheric circulation to explain.`,
        solution: `Equatorial heating makes air rise; rising air cools and dumps its moisture as rain over the equator. The now-dry air moves poleward aloft within the Hadley cell and SINKS near 30 degrees. Sinking air warms by compression and stays dry, creating a high-pressure belt with little precipitation — hence the desert belts: Sahara, Arabia, Australian outback, Mojave/Sonoran, Atacama, Kalahari.`,
      },
      relatedLoIds: ['apenvsci.atmosphere-wind'],
    },
  ],
  pointers: [
    { content: 'Composition: 78% nitrogen, 21% oxygen, 0.04% CO2. Ozone layer lives in the STRATOSPHERE, not the troposphere.', kind: 'tip' },
    { content: 'Three cells per hemisphere: Hadley 0-30, Ferrel 30-60, Polar 60-90. Sinking dry air at 30 = desert belts.', kind: 'tip' },
    { content: 'Coriolis: right in the Northern Hemisphere, left in the Southern. N-hemisphere cyclones spin counter-clockwise.', kind: 'tip' },
    { content: 'Wind belts: trades 0-30 (from east), westerlies 30-60 (from west), polar easterlies 60-90.', kind: 'tip' },
    { content: 'Rain shadow: WINDWARD side wet, LEEWARD side dry. Descending air warms and dries — never say it "picks up" rain.', kind: 'tip' },
    { content: 'ITCZ = converging Hadley cells at the equator; migrates with the seasons and drives monsoons.', kind: 'tip' },
  ],
};
