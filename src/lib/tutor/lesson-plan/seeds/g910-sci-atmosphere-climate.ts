/**
 * Grades 9-10 Science — Atmosphere and Climate.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_SCI_ATMOSPHERE_CLIMATE: LessonPlan = {
  id: 'evelyn.g910.science.atmosphere-climate.v1',
  title: 'Earth Science — Atmosphere, Greenhouse Effect, and Climate',
  curriculum: 'NGSS',
  grade: '10',
  subject: 'science',
  topic: 'earth-science-hs',
  locale: 'en',
  los: [
    {
      id: 'g910.sci.earth.atmosphere',
      description: 'Describe the layers of Earth\'s atmosphere, the greenhouse effect, and the relationship between atmospheric composition and climate change.',
      standard: 'NGSS-HS-ESS2-4',
    },
  ],
  prerequisites: ['g910.sci.earth.plate-tectonics'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A few rare gases (CO₂, methane, water vapor) in our atmosphere keep Earth warm enough for life — and increasing them is changing the climate.',
      script: 'Without the greenhouse effect, Earth\'s average temperature would be about -18°C (well below freezing). With it, we\'re at +15°C. The greenhouse effect is GOOD — and natural. The problem is humans have increased greenhouse gases by ~50% in 200 years, pushing Earth\'s thermostat upward.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-atmosphere',
      kind: 'concept',
      goal: 'Layers, composition, greenhouse effect, climate change basics.',
      keyIdeas: [
        'ATMOSPHERIC LAYERS (bottom up):',
        '  TROPOSPHERE: 0-12 km. Where weather happens. Temp DECREASES with altitude.',
        '  STRATOSPHERE: 12-50 km. Contains the OZONE LAYER (absorbs UV). Temp INCREASES with altitude.',
        '  MESOSPHERE: 50-85 km. Where meteors burn up. Temp DECREASES.',
        '  THERMOSPHERE: 85-600 km. Auroras occur here. Temp INCREASES (very hot but very thin air).',
        'COMPOSITION (by volume): 78% nitrogen (N₂), 21% oxygen (O₂), 1% argon and trace gases. Trace includes CO₂ (~0.04%), methane (CH₄), water vapor (variable).',
        'GREENHOUSE EFFECT: certain gases (CO₂, CH₄, H₂O, N₂O) absorb INFRARED radiation that Earth emits, then re-emit it in all directions. This traps heat near the surface.',
        '  Without it: Earth would be ~33°C colder, frozen.',
        '  With it: liveable temperatures, but tunable by gas concentrations.',
        'GREENHOUSE GASES (most to least powerful per molecule, ignoring abundance):',
        '  Water vapor: most abundant, but cycles fast (rain).',
        '  CO₂: very abundant + persistent (centuries in atmosphere).',
        '  Methane (CH₄): 25× more potent than CO₂ per molecule, lasts ~12 years.',
        '  N₂O, CFCs, etc.: minor but potent.',
        'CLIMATE CHANGE: human activities (fossil fuel burning, deforestation, agriculture) have raised CO₂ from ~280 ppm pre-industrial to ~420 ppm now. This is causing:',
        '  Average global temperature rise (~1.2°C since 1880).',
        '  Sea-level rise (melting ice + ocean thermal expansion).',
        '  More extreme weather (heat waves, intense storms, droughts).',
        '  Shifts in biome distribution (warming pushes biomes poleward).',
        'EVIDENCE: ice cores (CO₂ trapped in ancient ice), thermometers, satellite measurements, ocean data, glacial retreat photos.',
        '"Climate" vs "weather": climate = long-term patterns (decades+); weather = day-to-day. Single hot/cold days don\'t prove or disprove climate change.',
      ],
      vocabulary: [
        { term: 'greenhouse effect', definition: 'the trapping of heat near a planet\'s surface by atmospheric gases that absorb infrared radiation.' },
        { term: 'parts per million (ppm)', definition: 'a measure of trace gas concentration; 420 ppm CO₂ means 420 CO₂ molecules per million air molecules.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A student claims "Mars has CO₂ in its atmosphere — much more than Earth — so it should be hot from the greenhouse effect. Why is it actually frigid?',
      steps: [
        'Mars\'s atmosphere is ~95% CO₂ but is THIN — surface pressure is ~1% of Earth\'s. Total CO₂ MASS is much less than Earth\'s.',
        'Greenhouse effect depends on absolute amount of gas, not just percentage.',
        'Mars is also farther from the Sun, so it receives less solar energy to begin with.',
        'Earth\'s thicker atmosphere (rich in CO₂ + water vapor) traps more heat than Mars\'s thin one.',
        'Lesson: greenhouse strength depends on TOTAL gas amount, atmospheric thickness, and starting solar input.',
      ],
      answer: 'Mars\'s atmosphere is too thin (1% of Earth\'s pressure) to retain much heat, even with high CO₂ percentage.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is methane considered a major contributor to climate change despite being much less abundant than CO₂?',
      expectedAnswer: 'Methane is ~25× more potent per molecule than CO₂ at trapping heat (over 100 years; even higher over 20 years). So even at much smaller concentrations, methane has a big warming effect. Sources: livestock (cattle digestion), rice paddies, natural gas leaks, landfills, melting permafrost (a feedback loop). Reducing methane is one of the fastest ways to slow warming.',
      responseFormat: 'free',
      hints: [
        'Per molecule, methane absorbs more IR than CO₂.',
        'How does that change its impact even at low concentration?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-weather-vs-climate',
      kind: 'misconception_check',
      question: 'A student says "we had a freezing winter, so global warming isn\'t real." What\'s the misconception?',
      commonErrors: [
        {
          answer: 'Cold day disproves warming',
          misconception: 'Confusing weather (short-term local) with climate (long-term global).',
          correctsTo: 'Weather is what\'s happening THIS WEEK in YOUR PLACE. Climate is the AVERAGE over decades, ACROSS the globe. A freezing day in Chicago is consistent with a warming planet — local weather has always varied. Climate trends are measured by global average temperature over many years. Climate change means the AVERAGE is rising, even though weather still has cold days. Climate scientists also note climate change is making weather MORE EXTREME (both hotter heat waves and unusual cold snaps).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Layers: troposphere → stratosphere → mesosphere → thermosphere.',
        'Greenhouse gases (CO₂, CH₄, H₂O) trap heat — natural and necessary.',
        'Human-caused increase in CO₂ from 280 → 420 ppm = warming.',
        'Methane is potent per molecule but shorter-lived.',
        'Weather ≠ climate. Climate is the long-term average.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
