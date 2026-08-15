/**
 * AP Environmental Science — Unit 7 CED 7.6+7.8: Air Quality Mitigation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.air-quality-mitigation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_AIR_QUALITY_MITIGATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.air-quality-mitigation.v1',
  course: 'AP Environmental Science',
  cedUnit: 7,
  cedTopic: '7.6+7.8',
  cedTitle: 'Air Quality Mitigation',
  planId: 'evelyn.ap.envsci.air-quality-mitigation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.air-quality-mitigation.v1' }],
  theory: [
    { loId: 'apenvsci.air-quality-mitigation', content: `BIG PICTURE: the US cut criteria air pollutants about 75% since 1970 WHILE the economy tripled and population grew 60%. Pollution and growth can DECOUPLE. The toolkit is TECHNOLOGY (scrubbers, catalytic converters) combined with POLICY (Clean Air Act, cap-and-trade, fuel standards) — AP wants you matching the right control to the right pollutant.` },
    { loId: 'apenvsci.air-quality-mitigation', content: `POWER-PLANT CONTROLS (match device → pollutant): SCRUBBERS (flue gas desulfurization, FGD) react SO₂ with lime to form calcium sulfate (gypsum) — removes ~95% of SO₂. ELECTROSTATIC PRECIPITATORS charge particles and collect them on oppositely charged plates — ~99% PM removal. BAGHOUSES (fabric filters) trap fine particulates like giant vacuum bags.` },
    { loId: 'apenvsci.air-quality-mitigation', content: `NOx CONTROLS AT PLANTS: SELECTIVE CATALYTIC REDUCTION (SCR) injects ammonia (NH₃) over a catalyst so NH₃ + NOx → N₂ + H₂O, cutting NOx 80-95%. LOW-NOx BURNERS redesign the combustion itself to form less NOx in the first place — prevention rather than capture.` },
    { loId: 'apenvsci.air-quality-mitigation', content: `VEHICLE CONTROLS: CATALYTIC CONVERTERS (standard since 1975) convert CO → CO₂, hydrocarbons → CO₂ + H₂O, and NOx → N₂ + O₂. UNLEADED GASOLINE was required partly because LEAD POISONS the catalyst; the phase-out cut lead emissions over 99%. Also: low-sulfur fuels, evaporative controls that capture gasoline vapors, state emissions inspections, and CAFE fuel-economy standards.` },
    { loId: 'apenvsci.air-quality-mitigation', content: `INDUSTRIAL CONTROLS: filters, condensers, and absorbers on exhaust streams; PROCESS MODIFICATION (switching to less-polluting solvents); and LEAK DETECTION and repair programs. Prevention at the process level is usually cheaper than end-of-pipe capture.` },
    { loId: 'apenvsci.air-quality-mitigation', content: `POLICY TOOLS: CLEAN AIR ACT (1970, amended 1990) set NAAQS for the criteria pollutants, required State Implementation Plans (SIPs), and imposed New Source Performance Standards. CAP-AND-TRADE for SO₂ cut emissions ~70%. Tiered vehicle emissions standards and CAFE standards tightened over time. International: MONTREAL PROTOCOL (CFCs/ozone layer — the success story) and KYOTO/PARIS agreements (CO₂).` },
    { loId: 'apenvsci.air-quality-mitigation', content: `THREE REGULATORY STYLES (compare for FRQs): MARKET-BASED (SO₂ cap-and-trade — efficient because plants find the cheapest cuts), OUTRIGHT BAN/PHASE-OUT (lead in gasoline, 1973-1996 — works when a full substitute exists), and TECHNOLOGY MANDATE (catalytic converters required on all new cars from 1975 — works when the technology is ready and fleet turnover spreads it). Different pollutants suit different tools.` },
    { loId: 'apenvsci.air-quality-mitigation', content: `NOISE POLLUTION: excessive sound that disrupts humans or wildlife. Sources: traffic, aircraft, construction, industrial machinery. Health impacts: HEARING DAMAGE (prolonged exposure above 85 dB causes permanent loss — also the OSHA 8-hour limit), chronic STRESS, sleep disturbance, elevated blood pressure and cortisol, and cognitive effects in children. WILDLIFE: noise masks communication and disrupts breeding — whales near shipping lanes, birds near highways.` },
    { loId: 'apenvsci.air-quality-mitigation', content: `DECIBELS ARE LOGARITHMIC: 70 dB is 10× the sound intensity of 60 dB; 80 dB is 100× 60 dB. Benchmarks: whisper 30 dB, conversation 60 dB, traffic 80 dB, lawnmower 90 dB, jackhammer 110 dB, jet engine 140 dB (pain threshold).` },
    { loId: 'apenvsci.air-quality-mitigation', content: `NOISE MITIGATION: SOUND BARRIERS along highways (5-10 dB reduction); VEGETATION BUFFERS (absorb sound AND clean air); urban planning that separates homes from industrial/transport corridors; rubberized "quiet" pavement; quieter vehicles (EVs roughly 50% quieter than gas cars at low speed); building soundproofing (double-paned windows); hearing protection; and for marine noise, rerouted or slowed shipping lanes.` },
    { loId: 'apenvsci.air-quality-mitigation', kind: 'definition', title: 'scrubber', content: `pollution-control device removing SO₂ from power-plant exhaust by reacting it with lime to form gypsum.` },
    { loId: 'apenvsci.air-quality-mitigation', kind: 'definition', title: 'catalytic converter', content: `vehicle device converting CO, hydrocarbons, and NOx into CO₂, H₂O, and N₂; standard on US cars since 1975.` },
    { loId: 'apenvsci.air-quality-mitigation', kind: 'definition', title: 'decibel (dB)', content: `logarithmic unit of sound intensity; every 10 dB is a 10× increase.` },
  ],
  methods: [
    {
      title: 'Match the control to the pollutant (and justify)',
      when_to_use: 'Questions naming a pollutant or source and asking for reduction strategies.',
      steps: [
        `STEP 1 — IDENTIFY the pollutant and its source category: power plant, vehicle, or industrial process.`,
        `STEP 2 — PICK THE TECHNOLOGY: SO₂ → scrubber; PM → electrostatic precipitator or baghouse; NOx at plants → SCR or low-NOx burners; vehicle CO/HC/NOx → catalytic converter; lead → fuel substitution.`,
        `STEP 3 — PICK THE POLICY that drives adoption: cap-and-trade (measurable pollutant, identifiable sources), phase-out/ban (full substitute exists), or technology mandate (device ready, cost bearable).`,
        `STEP 4 — JUSTIFY with a success metric: SO₂ down ~70% via cap-and-trade; lead down over 99% via phase-out; auto CO/HC/NOx down ~90% per vehicle via converters.`,
      ],
      example: {
        problem: `The US has cut criteria air pollutants ~75% since 1970 while the economy tripled and population grew 60%. Identify three technical or policy actions that drove this success.`,
        solution: `(1) CLEAN AIR ACT (1970, 1990): NAAQS + state implementation plans + source standards. (2) CATALYTIC CONVERTERS from 1975 cut auto CO, HC, and NOx ~90% — paired with unleaded gasoline, which alone cut lead over 99%. (3) SCRUBBERS plus 1990 SO₂ CAP-AND-TRADE cut SO₂ ~70%. Key insight: pollution and economic growth DECOUPLED through targeted policy plus technology.`,
      },
      relatedLoIds: ['apenvsci.air-quality-mitigation'],
    },
  ],
  pointers: [
    { content: 'Device→pollutant: scrubber = SO₂; precipitator/baghouse = PM; SCR = NOx; converter = auto CO/HC/NOx.', kind: 'tip' },
    { content: 'Unleaded gas exists partly because lead POISONS catalytic converters — two policies linked.', kind: 'tip' },
    { content: 'Three regulatory styles: cap-and-trade (SO₂), ban/phase-out (lead), tech mandate (converters).', kind: 'tip' },
    { content: 'US criteria pollutants down ~75% since 1970 while GDP tripled — growth and pollution decouple.', kind: 'tip' },
    { content: 'dB is logarithmic: +10 dB = 10× intensity. 85 dB sustained = hearing damage (OSHA limit).', kind: 'tip' },
    { content: 'Vegetation buffers do double duty: absorb noise AND filter air pollution.', kind: 'tip' },
  ],
};
