/**
 * AP Environmental Science — Unit 7 FRQ Practice.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_ENVSCI_U7_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.envsci.u7-frq-practice.v1', title: 'U7 FRQ Practice',
  curriculum: 'AP', grade: '11', subject: 'science', topic: 'ap-environmental-science', locale: 'en',
  los: [{ id: 'apenvsci.u7-frq-practice', description: 'Apply Unit 7 air-pollution concepts to AP-style FRQs.', standard: 'AP-ENVSCI-7-FRQ' }],
  prerequisites: ['apenvsci.air-quality-mitigation'], followUps: [], estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Stakes.', script: "Two Unit 7 FRQs: smog/inversion + acid rain mitigation.", estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Refresh.', keyIdeas: [
      'Pollutant types: primary/secondary, point/nonpoint. 6 criteria pollutants.',
      'Photochemical (LA: NOx + VOCs + sun) vs industrial (London: SO₂ + soot + fog).',
      'Acid rain: SO₂ → H₂SO₄, NOx → HNO₃. Cap-and-trade success.',
      'Indoor pollutants: radon, CO, formaldehyde, mold.',
    ], estimatedMinutes: 2 },
    { id: 'try-frq-smog', kind: 'try_yourself',
      problem: 'FRQ Practice 1 — Smog and Inversion. Mexico City sits in a high-altitude valley surrounded by mountains. It has chronic photochemical smog. (a) Explain why valleys + altitude make air quality worse. (b) Identify the chemistry of photochemical smog. (c) Suggest THREE policy interventions specifically tailored to Mexico City\'s situation.',
      expectedAnswer: '(a) VALLEY: surrounding mountains block horizontal wind, prevent dispersion. Pollution accumulates in basin. \nAt night, surface cools faster than mountain air → cool air pools at bottom of valley → THERMAL INVERSION traps pollution under warm air aloft. \nALTITUDE: ~7,300 ft above sea level. Air is THINNER → LESS OXYGEN per breath → INCOMPLETE COMBUSTION in engines → MORE CO and HC emissions per liter of fuel burned. Plus, less efficient combustion overall. (3)\n(b) Photochemical smog chemistry:\n• Primary pollutants from cars + power plants: NOx, VOCs (gasoline, paints). \n• In SUNLIGHT: NOx + VOCs + UV → ground-level OZONE (O₃), peroxyacetyl nitrate (PAN), and other secondary pollutants. \n• Brown haze; eye + respiratory irritation. (2)\n(c) Mexico City-specific policies:\n• Hoy NO CIRCULA — license plate restrictions on certain days reducing vehicle counts. \n• EXPAND METRO/PUBLIC TRANSIT (already extensive but more needed). \n• EV transition + cleaner buses. \n• MIGRATE INDUSTRIES out of valley if possible. \n• PHASE OUT 2-stroke vehicles + older polluting cars. \n• EMISSIONS INSPECTIONS (verificación). \n• AIR QUALITY ALERT system + hourly monitoring. \n• Reforestation of surrounding mountains (improves air quality + filters). (2.5)\nTotal: 7.5 points.',
      responseFormat: 'frq', hints: ['Topography + altitude + chemistry; specific to context.'], estimatedMinutes: 7 },
    { id: 'try-frq-acidrain', kind: 'try_yourself',
      problem: 'FRQ Practice 2 — Acid Rain. (a) Explain the chemical formation of acid rain from SO₂ and NOx. (b) Describe THREE ecological impacts of acid rain. (c) The 1990 Clean Air Act Amendments used cap-and-trade for SO₂. Explain how it works and why it succeeded (~70% SO₂ reduction). (d) Why might cap-and-trade work LESS WELL for some pollutants?',
      expectedAnswer: '(a) Chemistry:\n• SO₂ (from coal combustion) + H₂O + O₂ → H₂SO₄ (sulfuric acid). \n• NOx (from cars + power plants) + H₂O + O₂ → HNO₃ (nitric acid). \n• Acids dissolve in water droplets in clouds → fall as acid rain (pH 4-5). (2)\n(b) Impacts:\n• AQUATIC: low pH harms fish (eggs, fry); aluminum mobilized from sediments → toxic. Adirondack lakes had massive fish die-offs in 1980s. \n• FORESTS: leaches Ca, Mg from soil; weakens trees. Spruces and pines particularly susceptible. \n• MONUMENTS/BUILDINGS: marble (CaCO₃) dissolves; statues degrade. \n• HUMAN HEALTH: respiratory issues from acid aerosols; drinking water acidified by passing through eroded pipes. \n• SOIL: nutrient leaching reduces agricultural productivity. (3)\n(c) Cap-and-trade mechanics + success:\n• EPA set total NATIONAL CAP on SO₂ emissions (declining over time). \n• Power plants ALLOCATED tradable permits. \n• Plants choose CHEAPEST reduction: scrubbers, switching coal types, buying permits, fuel switching. \n• Plants making cheap reductions could SELL extra permits. \n• MARKET FORCES drove efficient outcomes. \n• ~70% SO₂ reduction achieved by 2018. Predicted costs were $5-7B/year; actual $1-2B/year. \nWHY IT SUCCEEDED:\n• SO₂ is MEASURABLE — sources easy to monitor. \n• POINT SOURCES (power plants) are countable. \n• TECHNOLOGY (scrubbers) was AVAILABLE. \n• Industry SUPPORTED market mechanism over flat ban. \n• Government MAINTAINED the cap (didn\'t weaken it under pressure). (3)\n(d) When cap-and-trade works LESS well:\n• MOBILE/distributed sources hard to track (cars). \n• LOCAL/REGIONAL pollutants (where local hot spots matter): trades may concentrate harm in some communities while reducing total. ENVIRONMENTAL JUSTICE concerns. \n• POLLUTANTS without good monitoring tech (some persistent organic pollutants). \n• When TECHNOLOGY for reduction doesn\'t yet exist (forces invention by mandate may work better). \n• When TOTAL CAP set too high (lenient cap → minimal reductions). (2)\nTotal: 10 points.',
      responseFormat: 'frq', hints: ['Chemistry, impacts, mechanism, limits.'], estimatedMinutes: 8 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Smog: chemistry differs (LA photochemical vs London industrial).',
      'Inversions trap pollutants — valleys particularly vulnerable.',
      'Acid rain: SO₂/NOx chemistry; impacts; cap-and-trade success.',
      'Specific case studies: Donora, London 1952, Adirondacks, Mexico City.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '7', cedTopic: '7-FRQ', cedTitle: 'Unit 7 FRQ Practice', sources: [{ type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on AP Env Sci Unit-7 FRQs.' }] },
};
