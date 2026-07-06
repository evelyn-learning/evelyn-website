/**
 * AP Environmental Science — Unit 7 CED 7.2-7.3: Smog and Inversion.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.smog-inversion.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_SMOG_INVERSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.smog-inversion.v1',
  course: 'AP Environmental Science',
  cedUnit: 7,
  cedTopic: '7.2-7.3',
  cedTitle: 'Smog and Inversion',
  planId: 'evelyn.ap.envsci.smog-inversion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.smog-inversion.v1' }],
  theory: [
    { loId: 'apenvsci.smog-inversion', content: 'SMOG: a noxious mixture of smoke and fog or atmospheric haze.' },
    { loId: 'apenvsci.smog-inversion', content: 'TWO TYPES (memorize):' },
    { loId: 'apenvsci.smog-inversion', content: '' },
    { loId: 'apenvsci.smog-inversion', content: 'PHOTOCHEMICAL (LA-style) SMOG:' },
    { loId: 'apenvsci.smog-inversion', content: '  • Forms in WARM, SUNNY climates with heavy traffic.' },
    { loId: 'apenvsci.smog-inversion', content: `  • CHEMISTRY: NOx + VOCs (from cars, gasoline) + SUNLIGHT → ground-level OZONE (O₃) + secondary pollutants like PEROXYACETYL NITRATE (PAN).` },
    { loId: 'apenvsci.smog-inversion', content: '  • Typical of: Los Angeles, Mexico City, Beijing, Athens.' },
    { loId: 'apenvsci.smog-inversion', content: '  • Brown haze; eye irritation; respiratory problems.' },
    { loId: 'apenvsci.smog-inversion', content: '  • Worse in summer (more sunlight, higher temperatures).' },
    { loId: 'apenvsci.smog-inversion', content: '  • Worse during morning/evening commute (NOx peaks).' },
    { loId: 'apenvsci.smog-inversion', content: '' },
    { loId: 'apenvsci.smog-inversion', content: 'INDUSTRIAL (London-style, sulfurous) SMOG:' },
    { loId: 'apenvsci.smog-inversion', content: '  • Forms in COOL, HUMID climates with heavy COAL combustion.' },
    { loId: 'apenvsci.smog-inversion', content: `  • CHEMISTRY: SO₂ + soot/particulates + moisture → SULFURIC ACID droplets, suffocating fog.` },
    { loId: 'apenvsci.smog-inversion', content: `  • Typical of historical: London (Great Smog of 1952 killed 12,000); industrial Britain; coal-heavy China cities.` },
    { loId: 'apenvsci.smog-inversion', content: '  • Yellow-grey haze; chokes lungs; can be lethal in inversions.' },
    { loId: 'apenvsci.smog-inversion', content: '  • Worse in winter (more heating).' },
    { loId: 'apenvsci.smog-inversion', content: '' },
    { loId: 'apenvsci.smog-inversion', content: 'THERMAL INVERSION: layer of warm air above cool air at the surface.' },
    { loId: 'apenvsci.smog-inversion', content: '  • Normally: temperature DECREASES with altitude (warm rises, cool sinks).' },
    { loId: 'apenvsci.smog-inversion', content: `  • In inversion: surface air is COOLER than air above. Cool surface air can't rise through warmer layer above. POLLUTANTS GET TRAPPED below the inversion lid.` },
    { loId: 'apenvsci.smog-inversion', content: '  • Causes:' },
    { loId: 'apenvsci.smog-inversion', content: '    - Cool ground at night.' },
    { loId: 'apenvsci.smog-inversion', content: '    - High-pressure systems (sinking warm air aloft).' },
    { loId: 'apenvsci.smog-inversion', content: '    - Topography: valleys (LA, Mexico City, Salt Lake City) trap cool air.' },
    { loId: 'apenvsci.smog-inversion', content: '  • Without an inversion, pollutants would diffuse upward and dissipate.' },
    { loId: 'apenvsci.smog-inversion', content: `  • Inversion can persist for days during stagnant weather → SEVERE air quality events.` },
    { loId: 'apenvsci.smog-inversion', content: '' },
    { loId: 'apenvsci.smog-inversion', content: 'AP CASE STUDIES:' },
    { loId: 'apenvsci.smog-inversion', content: `  • DONORA, PA (1948): industrial smog + temperature inversion → 20 deaths, 6,000 sickened.` },
    { loId: 'apenvsci.smog-inversion', content: `  • LONDON GREAT SMOG (1952): coal smoke + fog + inversion → 12,000 deaths over 5 days.` },
    { loId: 'apenvsci.smog-inversion', content: `  • LOS ANGELES (chronic): photochemical smog from auto exhaust + sunny climate + valley topography. Improved dramatically since 1970s Clean Air Act.` },
    { loId: 'apenvsci.smog-inversion', content: `  • MEXICO CITY: at altitude (less efficient combustion → more emissions), surrounded by mountains (traps).` },
    { loId: 'apenvsci.smog-inversion', kind: 'definition', title: 'photochemical smog', content: 'NOx + VOCs + sunlight → ozone; LA-style.' },
    { loId: 'apenvsci.smog-inversion', kind: 'definition', title: 'industrial smog', content: 'SO₂ + soot + fog; London-style; cool, humid, coal-burning.' },
    { loId: 'apenvsci.smog-inversion', kind: 'definition', title: 'thermal inversion', content: 'warm air over cool air, trapping pollutants near ground.' },
  ],
  methods: [
    {
      title: 'Worked compare',
      steps: [
        `CHEMISTRY:
  • LA: NOx + VOCs + SUNLIGHT → ozone, PAN. Photochemical.
  • London: SO₂ + particulates + FOG → sulfuric acid droplets. Industrial.`,
        `CLIMATE:
  • LA: warm, sunny, dry valleys (San Fernando Valley + LA basin).
  • London: cool, humid, often foggy.`,
        `TIME OF YEAR:
  • LA: SUMMER (more sun + heat).
  • London: WINTER (more coal heating).`,
        `PRIMARY SOURCE:
  • LA: AUTOMOBILES (NOx + VOCs).
  • London: COAL combustion for heating + industry.`,
        `INVERSION ROLE:
  • Both worsened by inversions trapping pollutants.
  • LA: persistent semi-permanent inversion + valley.
  • London 1952: unusual high-pressure system + cold weather + fog → 5-day inversion.`,
      ],
      example: { problem: `Compare LA smog (1970s peak) and London Great Smog (1952): chemistry, climate, time of year worst, primary source.`, solution: `LA: photochemical, sunny, summer, cars. London: industrial, cool, winter, coal. Both: inversions trap.` },
      relatedLoIds: ['apenvsci.smog-inversion'],
    },
  ],
  pointers: [
    { content: 'Photochemical (LA): warm, sunny, NOx + VOCs + sun → O₃. Cars main source.', kind: 'tip' },
    { content: 'Industrial (London): cool, foggy, SO₂ + soot. Coal main source.', kind: 'tip' },
    { content: `Thermal inversion: warm-over-cool air traps pollutants. Valleys especially vulnerable.`, kind: 'tip' },
    { content: 'Famous events: Donora 1948, London 1952. Both spurred regulation.', kind: 'tip' },
  ],
};
