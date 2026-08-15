/**
 * AP Environmental Science — Unit 4 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_ENVSCI_U4_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.envsci.u4-frq-practice.v1', title: 'U4 FRQ Practice',
  curriculum: 'AP', grade: '11', subject: 'science', topic: 'ap-environmental-science', locale: 'en',
  los: [{ id: 'apenvsci.u4-frq-practice', description: 'Apply Unit 4 earth-systems concepts to AP-style FRQs.', standard: 'AP-ENVSCI-4-FRQ' }],
  prerequisites: ['apenvsci.climate-enso'], followUps: [], estimatedMinutes: 26,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Two Unit 4 FRQs: tectonics + soil and atmosphere/climate/watersheds.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Plate boundaries; CLORPT factors; soil texture (loam ideal).',
      'Atmospheric layers; convection cells; Coriolis; rain shadow.',
      'Watersheds; insolation; axial tilt → seasons.',
      'Climate factors: latitude, elevation, ocean, topography. ENSO oscillation.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-tectonics-soil', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Tectonics + Soil. The Pacific Northwest USA sits at the Cascadia subduction zone (Juan de Fuca plate subducting under North American plate). (a) Identify the boundary type and predict two hazards. (b) Volcanic eruptions deposit ash that becomes soil over thousands of years. Identify which CLORPT factors are dominant in this region. (c) Compare the soil that forms here (cool, wet, forested) with desert soil in Eastern Washington (hot, dry, sparse vegetation). Predict differences in horizon thickness and organic matter.',
      expectedAnswer: '(a) CONVERGENT (oceanic-continental subduction). Hazards: \n• EARTHQUAKES — major risk; Cascadia is overdue for M9.0 megaquake. \n• TSUNAMIS — coastal areas vulnerable. \n• VOLCANIC ERUPTIONS — Cascade volcanoes (Mt. Rainier, Mt. St. Helens, Mt. Hood) sit on subducted-melt zone. (2)\n(b) CLORPT factors most important in PNW soil formation:\n• PARENT MATERIAL: volcanic ash + glacial till + bedrock varies. \n• CLIMATE: cool temperatures + abundant rainfall accelerate weathering. \n• ORGANISMS: temperate rainforest, lush vegetation, abundant biota in soil. \n• TIME: ~10,000 years since last glaciation; soils still developing. (2)\n(c) PNW (rainforest) soil:\n• THICK O horizon (lots of leaf litter). \n• THICK A horizon, dark, rich in organic matter. \n• Active leaching → developed B horizon. \n• Deep total profile. \nE WA (desert) soil:\n• THIN O horizon (little vegetation). \n• THIN A horizon, lighter color, low organic matter. \n• Limited leaching → poorly developed B. \n• Shallow profile (slow weathering due to limited moisture). (2.5)\nTotal: 6.5 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 3, scoringCriteria: 'Identifies a convergent (oceanic-continental subduction) boundary and predicts two hazards (earthquakes, tsunamis, or volcanic eruptions).', modelResponse: 'CONVERGENT oceanic-continental subduction. Hazards: major EARTHQUAKES (Cascadia is overdue for an M9), TSUNAMIS along the coast, and VOLCANIC ERUPTIONS from Cascade volcanoes such as Mt. Rainier and Mt. St. Helens.' },
        { criterionId: 'b', maxPoints: 3, scoringCriteria: 'Names dominant CLORPT soil-forming factors for the region (parent material from volcanic ash/glacial till, cool wet climate, abundant organisms, and time since glaciation).', modelResponse: 'PARENT MATERIAL: volcanic ash and glacial till; CLIMATE: cool temperatures and heavy rainfall accelerate weathering; ORGANISMS: lush temperate rainforest and soil biota; TIME: soils still developing ~10,000 years since glaciation.' },
        { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Compares the wet forested soil with the arid soil, predicting thicker horizons and more organic matter in the PNW and thin, low-organic, shallow horizons in the desert.', modelResponse: 'PNW rainforest soil has a THICK O horizon (leaf litter), a thick dark organic-rich A horizon, active leaching to a developed B, and a deep profile; the E. WA desert soil has a thin O and A, low organic matter, poorly developed B, and a shallow profile due to limited moisture.' },
      ] },
      responseFormat: 'frq', hints: ['Hazards from tectonics; CLORPT applied; climate-driven soil differences.'], estimatedMinutes: 7 },
    { id: 'try-frq-climate-watershed', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Climate + Watershed. The Western US is experiencing a megadrought. The Colorado River watershed (drains 250,000 sq mi, supports 40 million people, irrigation, hydropower) has reduced flow. (a) Use atmospheric circulation to explain why much of the SW US is naturally arid. (b) An El Niño year has just begun. Predict its impact on Colorado watershed precipitation and snowpack. (c) Identify three water-conservation practices the watershed states could implement. (d) Climate change is projected to reduce average precipitation in the SW. Predict the consequences for Colorado River users.',
      expectedAnswer: '(a) The SW US sits in the SUBTROPICAL HIGH PRESSURE belt at ~30°N — the descending branch of the Hadley cell. Air sinks here, warms, and is dry. This is the same global pattern that creates Sahara, Australian outback, etc. Plus rain shadows from coastal mountains. (2)\n(b) El Niño often brings WETTER winters to SW US (storms track over Southern Tier). Increased precipitation, increased snowpack in Rockies → potentially more spring snowmelt → MORE Colorado River flow. (1.5)\n(c) Conservation practices:\n• AGRICULTURAL EFFICIENCY (drip irrigation, drought-tolerant crops, fewer water-intensive crops like alfalfa). \n• RESTRICTIONS on lawn watering, swimming pools, golf courses in cities. \n• Increased PRICE/TIERED rates for water (encourages efficiency). \n• WATER RECYCLING (treated wastewater for irrigation, industry). \n• DESALINATION on coast (expensive but increasingly used). (2)\n(d) Consequences if precipitation drops:\n• REDUCED RIVER FLOW: reservoirs (Lake Powell, Lake Mead) drop further. \n• HYDROPOWER reduces (low water levels reduce generation). \n• WATER SHORTAGES: fewer agricultural fields irrigated; cities ration. \n• CONFLICTS between states / cities / Indigenous nations. \n• ECOLOGICAL HARM: reduced flow harms riparian habitats and fisheries (Grand Canyon endemics, salmon). \n• EFFECTS ON 40M PEOPLE: water restrictions, agricultural relocations, possible climate migration. (3)\nTotal: 8.5 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Explains SW aridity via the subtropical high at ~30°N — the descending, warming, drying branch of the Hadley cell (plus rain shadows).', modelResponse: 'The SW US sits under the SUBTROPICAL HIGH at ~30°N, the descending branch of the Hadley cell, where air sinks, warms, and dries — the same pattern that creates the Sahara — reinforced by coastal-mountain rain shadows.' },
        { criterionId: 'b', maxPoints: 2, scoringCriteria: 'Predicts El Niño brings wetter winters and greater snowpack to the SW, increasing Colorado River flow.', modelResponse: 'El Niño typically brings WETTER winters to the SW as storms track over the southern tier, increasing precipitation and Rocky Mountain snowpack, so spring snowmelt could raise Colorado River flow.' },
        { criterionId: 'c', maxPoints: 2, scoringCriteria: 'Identifies three water-conservation practices (agricultural efficiency, urban restrictions, tiered pricing, water recycling, or desalination).', modelResponse: 'Improve AGRICULTURAL EFFICIENCY (drip irrigation, less water-intensive crops), impose urban RESTRICTIONS and TIERED pricing on water, and expand WATER RECYCLING of treated wastewater (with desalination on the coast).' },
        { criterionId: 'd', maxPoints: 3, scoringCriteria: 'Predicts consequences of reduced precipitation for Colorado River users: lower reservoirs/flow, less hydropower, shortages and rationing, interstate conflict, and ecological harm.', modelResponse: 'Reduced flow drops reservoirs (Lake Powell, Lake Mead), cuts HYDROPOWER, forces agricultural and urban WATER SHORTAGES and rationing, drives CONFLICT among states, cities, and tribes, and harms riparian ecosystems — affecting the 40 million people who depend on the river.' },
      ] },
      responseFormat: 'frq', hints: ['Hadley desert; El Niño boost; conservation; future scenarios.'], estimatedMinutes: 7 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Plate boundaries → hazards (earthquakes, volcanoes, tsunamis).',
      'CLORPT shapes soil; loam ideal for agriculture.',
      'Hadley cell → 30° desert belts; rain shadows; Coriolis.',
      'Watersheds; ENSO; climate change implications.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '4', cedTopic: '4-FRQ', cedTitle: 'Unit 4 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Env Sci Unit-4 FRQs.' }] },
};
