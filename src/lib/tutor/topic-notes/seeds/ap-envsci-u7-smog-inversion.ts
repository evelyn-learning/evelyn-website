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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.smog-inversion.v1' }],
  theory: [
    { loId: 'apenvsci.smog-inversion', content: `SMOG = smoke + fog: a noxious atmospheric haze. TWO TYPES with COMPLETELY DIFFERENT chemistry — PHOTOCHEMICAL (LA-style) and INDUSTRIAL (London-style, sulfurous). AP questions almost always hinge on which type, so learn the contrast cold.` },
    { loId: 'apenvsci.smog-inversion', content: `PHOTOCHEMICAL SMOG CHEMISTRY: NOx + VOCs (from cars, gasoline vapors) + SUNLIGHT → ground-level OZONE (O₃) plus secondary irritants like PEROXYACETYL NITRATE (PAN). It is a SUNLIGHT-DRIVEN reaction — no sun, no photochemical smog. Appears as a BROWN haze; causes eye irritation and respiratory problems.` },
    { loId: 'apenvsci.smog-inversion', content: `PHOTOCHEMICAL SMOG CONDITIONS: WARM, SUNNY climates with heavy TRAFFIC. Classic cities: Los Angeles, Mexico City, Beijing, Athens. WORST IN SUMMER (more sunlight, higher temperatures) and around MORNING/EVENING COMMUTES when NOx emissions peak.` },
    { loId: 'apenvsci.smog-inversion', content: `INDUSTRIAL (LONDON-STYLE) SMOG CHEMISTRY: SO₂ + soot/particulates + MOISTURE → SULFURIC ACID droplets suspended in fog. Source is heavy COAL COMBUSTION. Yellow-grey suffocating haze; can be LETHAL when an inversion holds it in place.` },
    { loId: 'apenvsci.smog-inversion', content: `INDUSTRIAL SMOG CONDITIONS: COOL, HUMID climates burning coal for heat and industry — historical London, industrial Britain, coal-heavy Chinese cities. WORST IN WINTER because coal heating demand peaks. Contrast with photochemical smog's summer peak — a favorite AP discriminator.` },
    { loId: 'apenvsci.smog-inversion', content: `THERMAL INVERSION: a layer of WARM air sitting ABOVE COOL air at the surface — the reverse of the normal profile. NORMALLY temperature DECREASES with altitude, so warm surface air rises and carries pollutants up and away. In an inversion, cool surface air CANNOT RISE through the warmer layer above, so POLLUTANTS ARE TRAPPED below the inversion "lid."` },
    { loId: 'apenvsci.smog-inversion', content: `WHAT CAUSES INVERSIONS: (a) ground cooling rapidly at NIGHT chills the surface air; (b) HIGH-PRESSURE SYSTEMS push sinking warm air aloft; (c) TOPOGRAPHY — valleys and basins (LA, Mexico City, Salt Lake City) pool cool air while mountain walls block horizontal wind dispersal. A stagnant inversion can persist for DAYS → severe air quality events.` },
    { loId: 'apenvsci.smog-inversion', content: `WHY VALLEYS ARE WORST: mountain walls block wind, night-cooled air pools at the valley floor, and a warm layer aloft caps it. Emissions from cars and factories inside the valley build up hour after hour with nowhere to go. Mexico City adds a twist: HIGH ALTITUDE means less efficient combustion → MORE emissions per vehicle, plus mountains all around.` },
    { loId: 'apenvsci.smog-inversion', content: `AP CASE STUDIES (know these): DONORA, PA (1948) — industrial smog + inversion killed 20 and sickened about 6,000. LONDON GREAT SMOG (1952) — coal smoke + fog + a 5-day inversion killed about 12,000; spurred clean-air regulation. LOS ANGELES — chronic photochemical smog from auto exhaust + sunny climate + basin topography; improved dramatically after the 1970s Clean Air Act.` },
    { loId: 'apenvsci.smog-inversion', kind: 'definition', title: 'photochemical smog', content: `NOx + VOCs + sunlight → ground-level ozone and PAN; LA-style; warm sunny climates, worst in summer.` },
    { loId: 'apenvsci.smog-inversion', kind: 'definition', title: 'industrial smog', content: `SO₂ + soot + fog → sulfuric acid droplets; London-style; cool humid coal-burning climates, worst in winter.` },
    { loId: 'apenvsci.smog-inversion', kind: 'definition', title: 'thermal inversion', content: `warm air layer above cool surface air, trapping pollutants near the ground.` },
  ],
  methods: [
    {
      title: 'Compare two smog events (chemistry, climate, season, source)',
      when_to_use: 'FRQ or comparison questions naming a smog episode or a smoggy city.',
      steps: [
        `STEP 1 — IDENTIFY THE TYPE from the clues: sunny + traffic + brown haze + summer → photochemical; cool + coal + fog + winter → industrial.`,
        `STEP 2 — STATE THE CHEMISTRY: photochemical = NOx + VOCs + sunlight → O₃ and PAN; industrial = SO₂ + particulates + moisture → sulfuric acid fog.`,
        `STEP 3 — NAME THE PRIMARY SOURCE: automobiles for photochemical; coal combustion (heating + industry) for industrial.`,
        `STEP 4 — EXPLAIN THE SEASON: summer peak (more sun and heat) vs winter peak (more coal heating).`,
        `STEP 5 — ADD THE INVERSION ROLE: BOTH types are worsened when an inversion caps the city — LA has a semi-permanent inversion plus valley topography; London 1952 had a high-pressure system plus cold and fog for 5 days.`,
      ],
      example: {
        problem: `Compare LA smog (1970s peak) and the London Great Smog (1952): chemistry, climate, time of year worst, primary source.`,
        solution: `LA: photochemical — NOx + VOCs + sunlight → ozone/PAN; warm sunny dry basin; worst in SUMMER; source = automobiles. London: industrial — SO₂ + particulates + fog → sulfuric acid droplets; cool humid climate; worst in WINTER; source = coal. BOTH were intensified by thermal inversions trapping pollutants.`,
      },
      relatedLoIds: ['apenvsci.smog-inversion'],
    },
  ],
  pointers: [
    { content: 'Photochemical smog NEEDS sunlight: NOx + VOCs + sun → O₃. No sun, no LA-style smog.', kind: 'tip' },
    { content: 'Season tells the type: summer peak = photochemical; winter peak = industrial (coal heating).', kind: 'tip' },
    { content: 'Inversion = warm OVER cool. Cool surface air cannot rise, so pollutants are trapped.', kind: 'tip' },
    { content: 'Valleys (LA, Mexico City, Salt Lake City) pool cool air and block wind — inversion hotspots.', kind: 'tip' },
    { content: 'Case studies: Donora 1948 (20 dead), London 1952 (~12,000 dead) — both inversion-trapped smog.', kind: 'tip' },
    { content: 'PAN (peroxyacetyl nitrate) is the other photochemical product AP may name besides ozone.', kind: 'tip' },
  ],
};
