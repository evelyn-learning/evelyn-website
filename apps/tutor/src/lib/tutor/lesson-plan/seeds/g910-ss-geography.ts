/**
 * Grades 9-10 Social Studies — Geography (Human + Physical).
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SS_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.g910.ss.geography.v1',
  title: 'Grades 9-10 Geography — physical, human, interactions',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'social-studies',
  topic: 'geography',
  locale: 'en',
  los: [
    {
      id: 'g910.ss.geography',
      description: 'Apply the five themes of geography (location, place, region, movement, human-environment interaction) to explain settlement patterns, resource distribution, and global interdependence.',
      standard: 'NCSS-3-People-Places-Environments',
    },
  ],
  prerequisites: ['g68.ss.world-regions-geography'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Geography is not memorising capitals — it is the discipline that explains why people, resources, and conflicts cluster where they do.',
      script: 'Why are most major cities on rivers or coasts? Why is the Sahel chronically food-insecure? Why does Switzerland have four official languages but Mongolia has one? Geography answers these — by linking physical features (climate, terrain, water, soil) to human responses (settlement, trade, governance, conflict). Today we map the lens that turns place names into explanations.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-geography',
      kind: 'concept',
      goal: 'Five themes of geography, physical vs human geography, GIS, globalisation, environmental geography.',
      keyIdeas: [
        'FIVE THEMES of Geography (NCGE): LOCATION (absolute = lat/long; relative = "north of X"), PLACE (physical and cultural characteristics that make somewhere distinct), REGION (areas defined by shared features — formal/Saudi Arabia, functional/MTA service area, vernacular/the South), MOVEMENT (people, goods, ideas crossing space), HUMAN-ENVIRONMENT INTERACTION (how people adapt to + reshape the environment).',
        'PHYSICAL GEOGRAPHY studies natural systems — landforms, climate, water cycles, ecosystems. Plate tectonics generates mountains/earthquakes. Climate is shaped by latitude, altitude, ocean currents, prevailing winds.',
        'HUMAN GEOGRAPHY studies how humans organise space — population, urbanisation, economic geography, political geography, cultural geography. CITIES form at sites with water access, transport advantages, defensive features.',
        'GEOGRAPHIC INFORMATION SYSTEMS (GIS) layer data on maps to reveal patterns — disease outbreaks, election results, deforestation rates, retail catchments. Most modern policy uses GIS analysis.',
        'GLOBALISATION compresses geography in some ways (instant communication, container shipping) while heightening it in others (which countries get the factories vs. which get the e-waste).',
        'CARRYING CAPACITY of a region depends on water, soil, climate, and technology. The Sahel\'s low capacity is climate-driven; the Netherlands\' high capacity is technology-driven (dykes, intensive ag).',
        'ENVIRONMENTAL GEOGRAPHY studies sustainability — climate change, water rights, deforestation, biodiversity. The discipline\'s core lesson: physical and human systems are coupled; you cannot intervene in one without affecting the other.',
        'GEOGRAPHIC DETERMINISM (Diamond, "Guns, Germs, and Steel") is one influential framework — but contested by historians who emphasise the role of contingent decisions and institutions.',
      ],
      vocabulary: [
        { term: 'GIS', definition: 'Geographic Information Systems; software for layering spatial data on maps to reveal patterns and inform decisions.' },
        { term: 'carrying capacity', definition: 'the maximum population a region can sustainably support given its resources, climate, and technology.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cities',
      kind: 'worked_example',
      problem: 'Why are major world cities so often located at the mouth of a river? List physical and human factors.',
      steps: [
        'PHYSICAL factors: rivers provide fresh water for drinking and agriculture; deltas have flat, fertile soil; estuaries allow ocean-going ships to enter; the river itself enables inland transport upstream.',
        'HUMAN factors: trade hub combining ocean and inland routes; defensible (often surrounded by water on multiple sides); industrial sites need water for processing and waste removal; concentration creates labour markets that attract more business — positive feedback loop.',
        'Examples: London (Thames), New York (Hudson), Shanghai (Yangtze), Buenos Aires (Río de la Plata), Cairo (Nile delta), Mumbai (multiple river outlets).',
        'Caveat: river-mouth cities are vulnerable to flooding, sea-level rise, and storm surges. Climate-change era is forcing reassessment of this historic pattern.',
      ],
      answer: 'Convergence of fresh water, fertile delta land, ocean+inland trade routes, defensibility, and self-reinforcing economic agglomeration.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Use the five themes of geography to analyse YOUR town or city in one paragraph.',
      expectedAnswer: 'Sample (Boston): LOCATION — 42°N latitude, on Massachusetts Bay; relative location at the convergence of multiple colonial-era trade routes. PLACE — kettle-pond landscape from glaciation; cultural identity blending Puritan history, immigrant waves (Irish, Italian, Caribbean, Asian), and elite higher education. REGION — formal: New England; functional: Greater Boston metro area; vernacular: "the Hub." MOVEMENT — historic seaport; T (subway) commuters; international student flows. HUMAN-ENVIRONMENT INTERACTION — landfill expansions reshaped the original peninsula; Big Dig moved highway underground; sea-level rise now threatens the harbor district.',
      responseFormat: 'free',
      hints: [
        'Each theme should be addressed with something specific to your area.',
        'Look for a non-obvious detail per theme — those score higher than generic facts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-determinism',
      kind: 'misconception_check',
      question: 'A student writes: "Africa is poor because of its geography — bad climate, no good harbors." What is the problem with this reasoning?',
      commonErrors: [
        {
          answer: 'Geography determines economic outcomes',
          misconception: 'Hard geographic determinism — treating physical geography as the sole explanation for human outcomes.',
          correctsTo: 'Two problems. (1) Africa is enormously diverse — climates range from Mediterranean to rainforest to desert; coastlines and harbors vary widely. Lumping the continent oversimplifies. (2) Geographic determinism ignores the role of historical contingencies — colonial extraction, post-colonial debt, governance choices, global trade rules — that have demonstrably shaped current outcomes. Botswana and the Democratic Republic of Congo share regional geography but had radically different post-independence trajectories driven largely by institutions and decisions, not geography. A serious geographic analysis treats geography as ENABLING and CONSTRAINING factors interacting with human choices, not as fate.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five themes: location, place, region, movement, human-environment interaction.',
        'Physical geography (landforms/climate) shapes — but does not determine — human outcomes.',
        'Cities cluster where physical advantages and human institutions align.',
        'GIS is the modern toolkit for spatial analysis.',
        'Reject hard geographic determinism — geography enables and constrains; institutions and choices matter too.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
