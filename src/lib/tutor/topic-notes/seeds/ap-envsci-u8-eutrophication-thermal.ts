/**
 * AP Environmental Science — Unit 8 CED 8.5-8.6: Eutrophication and Thermal Pollution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.envsci.eutrophication-thermal.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENVSCI_EUTROPHICATION_THERMAL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.envsci.eutrophication-thermal.v1',
  course: 'AP Environmental Science',
  cedUnit: 8,
  cedTopic: '8.5-8.6',
  cedTitle: 'Eutrophication and Thermal Pollution',
  planId: 'evelyn.ap.envsci.eutrophication-thermal.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.envsci.eutrophication-thermal.v1' }],
  theory: [
    { loId: 'apenvsci.eutrophication-thermal', content: `EUTROPHICATION is nutrient enrichment of water — especially NITROGEN and PHOSPHORUS — that triggers excessive plant and algae growth followed by OXYGEN DEPLETION. NATURAL eutrophication unfolds over thousands of years; CULTURAL (anthropogenic) eutrophication is RAPID and driven by human fertilizer, sewage, and detergent inputs.` },
    { loId: 'apenvsci.eutrophication-thermal', content: `THE EUTROPHICATION CHAIN — memorize the order: (1) FERTILIZER RUNOFF of N and P enters the waterway; (2) ALGAL BLOOM of algae and cyanobacteria; (3) the bloom BLOCKS SUNLIGHT so submerged plants die; (4) the short-lived algae undergo MASS DIE-OFF; (5) DECOMPOSER bacteria consume the dead algae using DISSOLVED OXYGEN; (6) HYPOXIA (DO below ~2-3 mg/L) or ANOXIA (zero DO) sets in; (7) FISH KILLS as fish suffocate or flee; (8) CYANOBACTERIA TOXINS (microcystins) make water unsafe.` },
    { loId: 'apenvsci.eutrophication-thermal', content: `DISSOLVED OXYGEN (DO) is the master variable for aquatic life — most fish need about 5+ mg/L. DO INCREASES with COOLER temperatures, agitation (waves, rapids), and photosynthesis; DO DECREASES with WARMER temperatures, decomposition, higher salinity, and hypoxia, and salt water holds LESS oxygen than freshwater. Species tolerance tracks DO: TROUT need 6-8 mg/L (sensitive, cold-water), BASS need 4-5 mg/L, and CARP tolerate just 2-3 mg/L (hardy), so sensitive species vanish first as water degrades.` },
    { loId: 'apenvsci.eutrophication-thermal', content: `BIOLOGICAL OXYGEN DEMAND (BOD) is the amount of dissolved oxygen microorganisms consume to break down organic matter in the water. HIGH BOD signals HIGH ORGANIC POLLUTION (sewage, manure, food waste) because more decomposers are drawing oxygen down. BOD rises and DO falls together downstream of an organic-waste input.` },
    { loId: 'apenvsci.eutrophication-thermal', content: `DEAD ZONES (hypoxic zones) are the large-scale outcome. The GULF OF MEXICO dead zone — the world's second largest at roughly 6,000-8,000 square miles, about the size of New Jersey — is fed by Mississippi River nutrient runoff draining Midwest cornfields. CHESAPEAKE BAY is chronically hypoxic, the BALTIC SEA fisheries crashed, and LAKE ERIE blooms caused the 2014 Toledo drinking-water emergency.` },
    { loId: 'apenvsci.eutrophication-thermal', content: `CONTROLLING EUTROPHICATION means cutting N and P at the source: PRECISION AGRICULTURE, COVER CROPS, and vegetated BUFFER STRIPS between fields and water; ADVANCED SEWAGE TREATMENT that removes nitrogen and phosphorus; and PHOSPHATE-FREE DETERGENTS (now banned in many places).` },
    { loId: 'apenvsci.eutrophication-thermal', content: `THERMAL POLLUTION is heat added to a water body that harms aquatic life. Sources: POWER-PLANT COOLING (the dominant source), industrial cooling, urban runoff heated off pavement, and removal of shading RIPARIAN VEGETATION. A typical 1000 MW plant uses about a billion gallons of cooling water per day, discharged roughly 10 degrees Celsius warmer.` },
    { loId: 'apenvsci.eutrophication-thermal', content: `THERMAL POLLUTION IMPACTS: (a) DECREASED DO because warm water holds less oxygen; (b) INCREASED METABOLIC RATES so fish need more oxygen and food precisely when less is available; (c) LIFE-CYCLE DISRUPTION as temperature-triggered spawning fires at the wrong time; (d) INVASIVE warm-water species displacing native cold-water species; (e) more frequent ALGAL BLOOMS as warmth speeds algal growth.` },
    { loId: 'apenvsci.eutrophication-thermal', content: `THERMAL MITIGATION: COOLING TOWERS transfer heat to the atmosphere by evaporation; COOLING PONDS let heat dissipate; CLOSED-LOOP (recirculating) cooling reuses water instead of discharging it hot; and shifting to RENEWABLE energy removes the cooling-water demand entirely.` },
    { loId: 'apenvsci.eutrophication-thermal', kind: 'definition', title: 'eutrophication', content: `nutrient (N and P) enrichment of water that drives an algal bloom, die-off, decomposition, and oxygen depletion.` },
    { loId: 'apenvsci.eutrophication-thermal', kind: 'definition', title: 'dissolved oxygen (DO)', content: `oxygen dissolved in water and available to aquatic life; falls with warmth and decomposition, rises with cool water and photosynthesis.` },
    { loId: 'apenvsci.eutrophication-thermal', kind: 'definition', title: 'thermal pollution', content: `heat introduced to a water body (chiefly from power-plant cooling) that lowers DO and stresses or displaces temperature-sensitive species.` },
  ],
  methods: [
    {
      title: 'Diagnose a fish kill and trace the eutrophication chain',
      when_to_use: `When a scenario describes low dissolved oxygen, an algal bloom, or a summer fish kill near farmland and asks you to explain the cause.`,
      steps: [
        `STEP 1 — DIAGNOSE eutrophication (often with thermal stress in late summer, when water is warmest and holds the least oxygen).`,
        `STEP 2 — SOURCE: rain washed FERTILIZER (N, P) from fields into the water. Name it as a NONPOINT source.`,
        `STEP 3 — BLOOM: nutrient-rich warm water fuels an ALGAL BLOOM that shades and kills submerged plants.`,
        `STEP 4 — DIE-OFF: the short-lived algae die en masse.`,
        `STEP 5 — DECOMPOSITION: bacteria break down the dead algae, CONSUMING DISSOLVED OXYGEN and raising BOD.`,
        `STEP 6 — HYPOXIA: DO drops below ~3 mg/L; sensitive fish suffocate first. Warm-water stratification can trap anoxic water at the bottom, shrinking the habitable zone.`,
      ],
      example: {
        problem: `A pond near agricultural fields experiences a fish kill in late summer. Diagnose the likely cause and trace the chain of events.`,
        solution: `Spring fertilizer runoff (N, P) entered the pond; summer warmth fueled an algal bloom; the algae died; decomposers consumed dissolved oxygen (high BOD); DO fell below ~3 mg/L in already-warm low-oxygen water; fish suffocated. Cause: cultural eutrophication with thermal stress.`,
      },
      relatedLoIds: ['apenvsci.eutrophication-thermal'],
    },
  ],
  pointers: [
    { content: `Eutrophication chain: nutrients (N, P) → algal bloom → die-off → decomposers consume O₂ → hypoxia → fish kill.`, kind: 'tip' },
    { content: `DO falls with warm water + decomposition; DO rises with cool water + photosynthesis. Salt water holds less O₂.`, kind: 'tip' },
    { content: `High BOD = high organic pollution; decomposers pull DO down. BOD up and DO down go together.`, kind: 'tip' },
    { content: `Gulf of Mexico dead zone = Mississippi fertilizer runoff. Thermal pollution warms water and lowers DO too.`, kind: 'tip' },
    { content: `Mitigation: cover crops, buffer strips, advanced sewage treatment for nutrients; cooling towers for thermal.`, kind: 'tip' },
  ],
};
