/**
 * Chemistry — States of Matter: Phase Changes & Heating Curves.
 *
 * Energy bookkeeping across a phase change (NGSS HS-PS3-2, HS-PS3-4):
 * rising segments are one phase warming (q = mcΔT), flat plateaus are a
 * phase change at constant temperature (q = mΔH). The star misconception
 * gets equal billing — "adding heat always raises the temperature" dies
 * at the plateau. Described entirely in words; no graph is ever shown.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U7_PHASE_CHANGES_HEATING_CURVES: LessonPlan = {
  id: 'evelyn.hs.chem.phase-changes-heating-curves.v1',
  title: 'Phase Changes & Heating Curves',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.phase-changes-heating-curves',
      standard: 'CHEM-7.2',
      description:
        'Track the energy of a substance through a heating curve, using q = mcΔT for warming within one phase and q = mΔH for the constant-temperature plateaus of melting and boiling (NGSS HS-PS3-2, HS-PS3-4).',
    },
  ],
  prerequisites: ['chem.kinetic-molecular-theory'],
  followUps: ['chem.gas-laws'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A thermometer that refuses to move — ice water stays stubbornly at 0 °C, which is exactly why cooks and paramedics trust it.',
      script:
        'Drop ice into a glass of water, stir, and stick a thermometer in it. Leave it on a warm counter for ten minutes and the reading does not budge: 0 °C. Heat is pouring in from the room the whole time — so where is it going? Not into temperature. It is going into prying water molecules loose from the ice crystal. That is why an ice bath is the most reliable cold source in a lab, why a paramedic\'s ice pack holds a steady temperature on a burn, and why a pot of boiling pasta water sits at 100 °C no matter how high you crank the burner. Today you learn to read that story as a heating curve — and to compute the energy at every stage of it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-heating-curve',
      kind: 'concept',
      goal: 'Two energy accounts (kinetic vs potential), the two formulas that go with them, and why the thermometer stalls during a phase change.',
      keyIdeas: [
        'TWO PLACES ENERGY CAN GO — added heat either speeds particles up (KINETIC energy, which the thermometer reads as temperature) or pulls particles apart against their attractions (POTENTIAL energy, stored in the separation). It never does both at the same moment for the same sample.',
        'RISING SEGMENT = ONE PHASE WARMING — while a substance stays solid, or stays liquid, or stays gas, all the added heat goes to kinetic energy. Temperature climbs steadily and q = mcΔT applies (mass × specific heat × temperature change).',
        'FLAT PLATEAU = PHASE CHANGE AT CONSTANT TEMPERATURE — the moment melting or boiling begins, the temperature STOPS changing even though heat keeps flowing in. Every joule goes to potential energy, breaking attractions apart. Here ΔT = 0, so q = mcΔT is useless; use q = mΔH instead.',
        'THE TWO PLATEAUS FOR WATER — melting sits at 0 °C and costs the heat of fusion, ΔHfus = 334 J/g. Boiling sits at 100 °C and costs the heat of vaporization, ΔHvap = 2260 J/g. Boiling costs about 6.8 times more per gram, so the boiling plateau lasts far longer than the melting plateau.',
        'WHY VAPORIZATION COSTS MORE — melting only loosens particles enough to let them slide past each other; vaporization must separate them COMPLETELY. Full separation takes far more energy than partial loosening.',
        'EACH PHASE HAS ITS OWN SPECIFIC HEAT — for water, ice is 2.06 J/g·°C, liquid is 4.18 J/g·°C, steam is 2.02 J/g·°C. Liquid water needs about twice the energy per degree, so the liquid-warming segment is the slowest-rising one. Never carry one phase\'s specific heat across a plateau into the next phase.',
        'A MULTI-STAGE PROBLEM IS A SUM — going from ice below 0 °C to steam above 100 °C is five separate calculations added together: warm the ice, melt it, warm the liquid, boil it, warm the steam. One single mcΔT across the whole trip is always wrong.',
        'COOLING RUNS THE SAME MOVIE BACKWARD — freezing and condensing RELEASE exactly the energy that melting and boiling absorbed, at the same temperatures (HS-PS3-2: energy is conserved, just moved). Melting and boiling are endothermic (ΔH positive); freezing and condensing are exothermic (ΔH negative). Same magnitude, opposite sign.',
      ],
      vocabulary: [
        { term: 'heat of fusion (ΔHfus)', definition: 'the energy per gram needed to melt a solid at its melting point, with no temperature change.' },
        { term: 'heat of vaporization (ΔHvap)', definition: 'the energy per gram needed to boil a liquid at its boiling point, with no temperature change.' },
        { term: 'specific heat (c)', definition: 'the energy needed to raise one gram of a substance by one degree Celsius while it stays in the same phase.' },
        { term: 'heating curve', definition: 'the record of a substance\'s temperature as heat is added steadily — sloped stretches where one phase warms, flat stretches where a phase change happens.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-two-stage',
      kind: 'worked_example',
      problem:
        'How much heat, in joules, is needed to take 50.0 g of liquid water from 25.0 °C to steam at 100.0 °C? Use c(liquid water) = 4.18 J/g·°C and ΔHvap = 2260 J/g.',
      steps: [
        'Split the trip into stages first. Stage 1: warm liquid water from 25.0 °C up to its boiling point, 100.0 °C — one phase, temperature changing. Stage 2: boil all of it at 100.0 °C — a phase change, temperature constant.',
        'Stage 1 uses q = mcΔT because the water stays liquid the whole way: ΔT = 100.0 − 25.0 = 75.0 °C, so q₁ = (50.0)(4.18)(75.0) = 15,675 J.',
        'Stage 2 uses q = mΔHvap because ΔT = 0 there — the thermometer holds at 100.0 °C while the liquid turns to gas: q₂ = (50.0)(2260) = 113,000 J.',
        'Add the stages: q_total = 15,675 + 113,000 = 128,675 J, about 129 kJ.',
        'Notice the split: over 87% of the energy went into the flat boiling plateau, not into raising the temperature. That is why a pot takes a few minutes to reach a boil and much longer to boil dry.',
      ],
      answer: '128,675 J (about 129 kJ) — 15,675 J to warm the liquid, 113,000 J to vaporize it',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-single-formula-trap',
      kind: 'worked_example',
      problem:
        'A student is asked how much heat converts 10.0 g of ice at −10.0 °C into liquid water at 10.0 °C, and answers q = (10.0)(4.18)(20.0) = 836 J. Find the flaw and give the correct total. Use c(ice) = 2.06 J/g·°C, ΔHfus = 334 J/g, c(liquid water) = 4.18 J/g·°C.',
      steps: [
        'Name the move: the student ran one q = mcΔT straight from −10.0 °C to +10.0 °C, using the LIQUID specific heat for the whole trip. That silently assumes the sample was liquid at −10 °C and that melting is free.',
        'Why it fails: the trip crosses 0 °C, where a plateau sits. At 0 °C the temperature stalls while the ice melts, and that stall absorbs energy no ΔT term can capture. The ice stretch also uses the ice specific heat, not the liquid one.',
        'Stage 1 — warm the ice from −10.0 °C to 0.0 °C: q₁ = (10.0)(2.06)(10.0) = 206 J.',
        'Stage 2 — melt it at 0.0 °C, temperature constant: q₂ = (10.0)(334) = 3340 J. This is the term the student dropped entirely, and it is the biggest one.',
        'Stage 3 — warm the liquid from 0.0 °C to 10.0 °C: q₃ = (10.0)(4.18)(10.0) = 418 J.',
        'Total: 206 + 3340 + 418 = 3964 J — nearly five times the student\'s 836 J. Whenever a problem crosses a melting or boiling point, break it into stages.',
      ],
      answer: '3964 J — the student omitted the 3340 J melting plateau and used the liquid specific heat for the ice',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plateau-meaning',
      kind: 'try_yourself',
      problem:
        'A pure substance is heated at a steady rate. For several minutes its temperature holds perfectly constant, then it begins rising again. What is happening during the constant-temperature stretch?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The absorbed energy is separating particles against their attractions, so potential energy rises while average kinetic energy — the temperature — stays constant', correct: true },
        { id: 'b', text: 'The substance temporarily stops absorbing heat until the phase change is finished' },
        { id: 'c', text: 'The particles keep speeding up, but the thermometer lags behind and catches up later' },
        { id: 'd', text: 'The specific heat of the substance drops to zero for that stretch' },
      ],
      expectedAnswer: 'The absorbed energy is separating particles against their attractions, so potential energy rises while average kinetic energy — the temperature — stays constant',
      hints: [
        'Heat is still flowing in at a steady rate — the energy has to be going somewhere. Temperature only tracks one of the two energy accounts.',
        'If it is not speeding particles up, it must be pulling them apart. Which choice says exactly that?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-steam-burn',
      kind: 'try_yourself',
      problem:
        'Steam at 100 °C causes far more severe burns than liquid water at 100 °C, even though both are at the same temperature. Why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Condensing on the skin releases 2260 J per gram of stored energy before the water has cooled by even one degree', correct: true },
        { id: 'b', text: 'Steam is actually hotter than 100 °C, so it starts from a higher temperature' },
        { id: 'c', text: 'Steam has a much higher specific heat than liquid water' },
        { id: 'd', text: 'Gas particles move faster, so they simply transfer their heat more quickly' },
      ],
      expectedAnswer: 'Condensing on the skin releases 2260 J per gram of stored energy before the water has cooled by even one degree',
      hints: [
        'Both are at 100 °C, so temperature cannot be the difference. What extra energy does steam carry that liquid water at the same temperature does not?',
        'Condensation is the reverse of boiling, so it releases ΔHvap — and that release happens at constant temperature, on top of any later cooling.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'How much heat, in joules, is required to completely melt 25.0 g of ice that is already sitting at 0 °C? The heat of fusion of water is ΔHfus = 334 J/g. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '8350',
      hints: [
        'The ice is already at its melting point, so the temperature never changes — ΔT = 0 and q = mcΔT gives nothing. Use the plateau formula q = mΔHfus instead.',
        '25.0 × 334 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-heat-raises-temp',
      kind: 'misconception_check',
      question:
        'A student says: "If you keep adding heat, the temperature has to keep going up — that is what heat does." Why is this wrong for a substance that is melting or boiling?',
      commonErrors: [
        {
          answer: 'Adding heat always raises the temperature',
          misconception: 'Treating temperature as a direct readout of total energy, so a flat plateau looks impossible.',
          correctsTo:
            'Temperature only measures AVERAGE KINETIC energy. During melting or boiling, every added joule goes into potential energy — pulling particles apart against their attractions — so the sample gains energy while the thermometer holds perfectly steady. Ice water sits at 0 °C on a warm counter for exactly this reason: the heat is being spent on melting, not on warming.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Heat goes to one of two accounts: kinetic energy (temperature rises) or potential energy (particles separate) — never both at once for the same sample.',
        'Rising stretch = one phase warming → q = mcΔT. Flat plateau = phase change at constant temperature → q = mΔH.',
        'For water: melting at 0 °C costs ΔHfus = 334 J/g; boiling at 100 °C costs ΔHvap = 2260 J/g — about 6.8 times more, so the boiling plateau is much longer.',
        'Each phase has its own specific heat (ice 2.06, liquid 4.18, steam 2.02 J/g·°C) — never carry one across a plateau.',
        'Any trip that crosses a melting or boiling point is a SUM of stages; one mcΔT across the whole range always undercounts.',
        'Freezing and condensing release exactly what melting and boiling absorbed — same magnitude, opposite sign.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Phase Changes & Heating Curves' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
