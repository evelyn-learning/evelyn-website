/**
 * AP Environmental Science — Unit 7 CED 7.1+7.4+7.5: Air Pollution Sources.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.air-pollution-sources.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_AIR_POLLUTION_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.air-pollution-sources.v1',
  course: 'AP Environmental Science',
  cedUnit: 7,
  cedTopic: '7.1+7.4+7.5',
  cedTitle: 'Air Pollution Sources',
  planId: 'evelyn.ap.envsci.air-pollution-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.air-pollution-sources.v1' }],
  theory: [
    { loId: 'apenvsci.air-pollution-sources', content: `PRIMARY vs SECONDARY: PRIMARY pollutants are emitted DIRECTLY into the atmosphere (CO, SO₂, NOx, particulates, VOCs). SECONDARY pollutants FORM IN THE ATMOSPHERE from reactions among primary pollutants (ground-level ozone O₃, photochemical smog, acid rain). AP loves asking you to classify — always ask "was it emitted, or did it form later?"` },
    { loId: 'apenvsci.air-pollution-sources', content: `POINT vs NONPOINT SOURCES: POINT sources have an identifiable, fixed location (smokestack, factory, power plant) — EASY to regulate because you know exactly who emits. NONPOINT sources are diffuse and hard to pin down (cars, lawn mowers, agriculture) — HARDER to regulate because emissions come from millions of small, mobile contributors.` },
    { loId: 'apenvsci.air-pollution-sources', content: `SIX EPA CRITERIA POLLUTANTS (memorize — regulated under the Clean Air Act via NATIONAL AMBIENT AIR QUALITY STANDARDS, NAAQS): carbon monoxide (CO), lead (Pb), nitrogen oxides (NOx), sulfur dioxide (SO₂), particulate matter (PM), and ground-level ozone (O₃). Of the six, ONLY OZONE is SECONDARY — the other five are primary.` },
    { loId: 'apenvsci.air-pollution-sources', content: `CARBON MONOXIDE (CO): produced by INCOMPLETE COMBUSTION. Major source: MOTOR VEHICLES. Both point and nonpoint. Health mechanism: CO BINDS HEMOGLOBIN more strongly than oxygen does → blood can't carry oxygen → asphyxiation. Colorless, odorless — why homes need CO detectors.` },
    { loId: 'apenvsci.air-pollution-sources', content: `LEAD (Pb): from LEADED GASOLINE (mostly phased out in the US) and batteries. Primary pollutant. A CUMULATIVE NEUROTOXIN — it builds up in the body and causes developmental damage, especially in children. The gasoline phase-out cut atmospheric lead by over 99%.` },
    { loId: 'apenvsci.air-pollution-sources', content: `NITROGEN OXIDES (NOx = NO + NO₂): formed when HIGH-TEMPERATURE COMBUSTION forces atmospheric N₂ and O₂ to react. Major sources: cars and power plants. Primary pollutant, but a key INGREDIENT for two secondary problems: PHOTOCHEMICAL SMOG (with VOCs + sunlight) and ACID RAIN (forms HNO₃).` },
    { loId: 'apenvsci.air-pollution-sources', content: `SULFUR DIOXIDE (SO₂): from burning COAL AND OIL (sulfur in the fuel oxidizes) plus metal smelting. Major source: COAL-FIRED POWER PLANTS. Primary pollutant; precursor of ACID RAIN (forms H₂SO₄ in the atmosphere) and of industrial (London-style) smog.` },
    { loId: 'apenvsci.air-pollution-sources', content: `PARTICULATE MATTER (PM): tiny suspended particles. Two size classes: PM10 (diameter ≤ 10 micrometers) and PM2.5 (≤ 2.5 micrometers). PM2.5 is the MOST DANGEROUS — small enough to penetrate DEEP into the lungs and even the bloodstream. Sources: combustion, dust, wildfires, industry.` },
    { loId: 'apenvsci.air-pollution-sources', content: `GROUND-LEVEL OZONE (O₃): the ONLY SECONDARY criteria pollutant — forms when NOx + VOCs react in SUNLIGHT. Do NOT confuse with STRATOSPHERIC ozone, which is protective ("good up high, bad nearby"). Ground-level ozone damages lung tissue and plants. VOCs (volatile organic compounds — solvents, gasoline vapors, paints) are its co-ingredient; CO₂ and methane (CH₄) are greenhouse gases tracked separately from the criteria six.` },
    { loId: 'apenvsci.air-pollution-sources', content: `INDOOR AIR POLLUTANTS (know sources): RADON — radioactive gas from rock/soil decay that seeps into basements; #2 cause of lung cancer in the US after smoking. CO — gas appliances, heaters, attached garages. TOBACCO SMOKE — thousands of chemicals in secondhand smoke. VOCs — paints, cleaners, furniture, carpets. MOLD — damp basements and bathrooms. ASBESTOS — old building materials; lung cancer when fibers are inhaled. LEAD — old paint, pipes, dust. FORMALDEHYDE — pressed wood (particle board) and insulation.` },
    { loId: 'apenvsci.air-pollution-sources', content: `WHY INDOOR AIR MATTERS MORE THAN STUDENTS EXPECT: indoor pollutant concentrations are often 2-5× outdoor levels; most people spend about 90% of their time indoors; and many homes have POOR VENTILATION, letting pollutants accumulate. Globally, air pollution kills roughly 7 million people per year — about 4 million from outdoor and 3 million from indoor exposure.` },
    { loId: 'apenvsci.air-pollution-sources', kind: 'definition', title: 'primary pollutant', content: `a pollutant emitted directly into the atmosphere (CO, SO₂, NOx, PM, VOCs).` },
    { loId: 'apenvsci.air-pollution-sources', kind: 'definition', title: 'secondary pollutant', content: `a pollutant formed in the atmosphere by reactions among primary pollutants (ground-level O₃, acid rain).` },
    { loId: 'apenvsci.air-pollution-sources', kind: 'definition', title: 'criteria pollutants', content: `the six EPA-regulated outdoor pollutants under NAAQS: CO, Pb, NOx, SO₂, PM, O₃.` },
  ],
  methods: [
    {
      title: 'Classify a pollutant (primary/secondary, point/nonpoint)',
      when_to_use: 'Any AP question that names a pollutant and asks you to categorize it or identify its source.',
      steps: [
        `STEP 1 — ORIGIN TEST: was the substance EMITTED directly (primary) or did it FORM in the atmosphere from other emissions (secondary)? Ozone and acid rain are the classic secondaries.`,
        `STEP 2 — SOURCE TEST: can you point to ONE fixed location emitting it (point — smokestack, plant) or is it diffuse from many contributors (nonpoint — traffic, agriculture)?`,
        `STEP 3 — CRITERIA CHECK: is it one of the EPA six (CO, Pb, NOx, SO₂, PM, O₃)? If yes, note it's regulated under NAAQS.`,
        `STEP 4 — For secondaries, NAME THE PRECURSORS: ozone comes from NOx + VOCs + sunlight; acid rain comes from SO₂ and NOx reacting with water.`,
      ],
      example: {
        problem: `Classify each pollutant: (a) sulfur dioxide from a power plant, (b) ground-level ozone, (c) acid rain falling on a forest, (d) exhaust from rush-hour traffic.`,
        solution: `(a) SO₂: PRIMARY, POINT source, criteria pollutant. (b) O₃: SECONDARY (NOx + VOCs + sunlight), criteria pollutant. (c) Acid rain: SECONDARY (SO₂ and NOx → H₂SO₄ and HNO₃). (d) Exhaust: PRIMARY pollutants (CO, NOx, PM) from a NONPOINT source (many diffuse cars).`,
      },
      relatedLoIds: ['apenvsci.air-pollution-sources'],
    },
  ],
  pointers: [
    { content: 'Of the 6 criteria pollutants, ONLY ozone is secondary — the rest are primary.', kind: 'tip' },
    { content: 'Point = one fixed source (smokestack), easy to regulate. Nonpoint = diffuse (cars), hard.', kind: 'tip' },
    { content: 'CO binds hemoglobin → asphyxiation. From incomplete combustion; main source is vehicles.', kind: 'tip' },
    { content: 'PM2.5 beats PM10 for danger — small enough to reach deep lung tissue.', kind: 'tip' },
    { content: 'Radon: radioactive soil gas in basements; #2 US lung-cancer cause after smoking.', kind: 'tip' },
    { content: 'Indoor air is often 2-5× more polluted than outdoor, and we spend ~90% of time inside.', kind: 'tip' },
  ],
};
