/**
 * G3 — States of matter and changes.
 *
 * Solid, liquid, gas. How particles arrange in each. Phase changes:
 * melting, freezing, evaporation, condensation.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SCI_STATES_OF_MATTER: LessonPlan = {
  id: 'evelyn.g3.sci.physical.states-of-matter.v1',
  title: 'States of matter and phase changes',
  curriculum: 'NGSS',
  grade: '3',
  subject: 'sci',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.2.ps1.a',
      description: 'Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.',
      standard: 'NGSS.2-PS1-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.5.ps1.a'],
  estimatedMinutes: 11,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use water as the universal example.',
      script: 'Water shows up in three forms in your kitchen: ice (solid), water (liquid), steam (gas). Same stuff, three different shapes. That\'s states of matter.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-states',
      kind: 'concept',
      goal: 'Three states + how particles act in each + four phase changes.',
      keyIdeas: [
        'SOLID: keeps its shape and size. Particles are PACKED tightly and just vibrate. Examples: ice, rock, wood.',
        'LIQUID: takes the shape of its container, but keeps the same VOLUME. Particles slide past each other. Examples: water, oil, juice.',
        'GAS: fills any container completely. Particles fly around fast and far apart. Examples: water vapor, oxygen, helium.',
        'PHASE CHANGES (state changes): caused by adding or removing HEAT.',
        'MELTING: solid → liquid (add heat). Ice → water at 0°C.',
        'FREEZING: liquid → solid (remove heat). Water → ice at 0°C.',
        'EVAPORATION / BOILING: liquid → gas (add heat). Water → steam.',
        'CONDENSATION: gas → liquid (remove heat). Steam → water droplets on a cold mirror.',
      ],
      vocabulary: [
        { term: 'solid', definition: 'matter with a fixed shape and size; tightly packed particles.' },
        { term: 'liquid', definition: 'matter that flows but keeps the same volume.' },
        { term: 'gas', definition: 'matter that fills any space; particles fly around freely.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-cycle',
      kind: 'worked_example',
      problem: 'Trace what happens to an ice cube left out on a hot day, then put in the freezer.',
      steps: [
        'Start: SOLID (ice cube).',
        'Hot day adds HEAT → ice MELTS into water (liquid).',
        'Sun keeps heating → water EVAPORATES into water vapor (gas).',
        'Now imagine you collect the water before it evaporates and put it in the freezer.',
        'Freezer REMOVES heat → water FREEZES back into ice.',
        'All these are PHASE CHANGES — same water, different states, just different amounts of heat.',
      ],
      answer: 'solid → liquid (melt) → gas (evaporate); freezer goes back: liquid → solid (freeze)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You leave a cold drink on the table and notice water droplets on the OUTSIDE of the glass. Where did they come from?',
      expectedAnswer: 'water vapor in the air condensed (gas → liquid)',
      responseFormat: 'free',
      hints: [
        'The air around the glass cooled down — what did the water vapor in that cold air do?',
        'Gas → liquid is called…',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-particle-disappear',
      kind: 'misconception_check',
      question: 'When water evaporates, does it DISAPPEAR?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating evaporation as destruction of matter.',
          correctsTo: 'No — the water turned into water VAPOR (gas) and dispersed into the air. Same molecules, just spread out. If the air cools, those molecules condense back into liquid (dew on grass, water on cold glass).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solid: fixed shape, packed particles.',
        'Liquid: takes container shape, particles slide.',
        'Gas: fills space, particles fly far apart.',
        'Adding heat: melt, evaporate. Removing heat: freeze, condense.',
        'No matter is destroyed — just changed states.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'There\'s a 4th state: PLASMA. Can you think of where you see plasma in everyday life?',
      hint: 'Lightning is plasma. The Sun is a giant ball of plasma. Neon signs and fluorescent bulbs glow because of plasma.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
