/**
 * Chemistry — Equilibrium & Le Chatelier's Principle.
 *
 * Dynamic equilibrium (NGSS HS-PS1-6): forward and reverse reactions still
 * running at equal rates, and the three levers — concentration, pressure/
 * volume, temperature — that let a chemist push the balance where they want
 * it. The Haber process anchors every example. No Keq math at this level;
 * the star misconception is "equilibrium means the reaction stopped."
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U9_EQUILIBRIUM_LE_CHATELIER: LessonPlan = {
  id: 'evelyn.hs.chem.equilibrium-le-chatelier.v1',
  title: "Equilibrium & Le Chatelier's Principle",
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.equilibrium-le-chatelier',
      standard: 'CHEM-9.4',
      description:
        'Describe dynamic equilibrium as equal forward and reverse rates, and use Le Chatelier\'s principle to predict how changes in concentration, pressure/volume, and temperature shift a reversible reaction (NGSS HS-PS1-6).',
    },
  ],
  prerequisites: ['chem.reaction-rates-collision'],
  followUps: ['chem.acids-bases-definitions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Equilibrium as the lever that lets chemists steer a reaction that refuses to finish — the reaction that feeds half the planet.',
      script:
        'About half the nitrogen atoms in your body got there through one factory reaction: N₂ + 3 H₂ ⇌ 2 NH₃, ammonia for fertilizer. Here is the frustrating part — that reaction never finishes. Nitrogen and hydrogen make ammonia, and ammonia turns right back into nitrogen and hydrogen, forever. Engineers could not stop the reverse reaction, so they did something smarter: they learned to TILT the balance, squeezing the gases to hundreds of atmospheres and pulling ammonia out as fast as it forms. Today you learn the rule they used — Le Chatelier\'s principle — and you will be able to predict which way any reversible reaction leans when you disturb it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-equilibrium-shifts',
      kind: 'concept',
      goal: 'Dynamic equilibrium as balanced rates, then the three stresses and the shifts they cause — plus the two classic traps (equilibrium is not static, equilibrium is not 50/50).',
      keyIdeas: [
        'REVERSIBLE REACTIONS — most reactions run both ways. We write them with a double arrow: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g). The forward reaction builds product; the reverse tears it back apart.',
        'EQUILIBRIUM = EQUAL RATES, NOT ZERO RATES — as reactants get used up the forward rate falls, and as product piles up the reverse rate rises. When the two rates finally match, concentrations stop changing. Both reactions are still running full speed; they simply cancel. That is why we call it DYNAMIC equilibrium.',
        'EQUILIBRIUM IS NOT A 50/50 SPLIT — the balance point can sit far to the product side, far to the reactant side, or anywhere between. "Equal rates" says nothing about equal amounts.',
        'LE CHATELIER\'S PRINCIPLE — disturb a system at equilibrium and it shifts in whichever direction partly UNDOES the disturbance. Ask yourself: what did I just add too much of, and which direction consumes it?',
        'STRESS 1, CONCENTRATION — add a reactant (or remove a product) and the system shifts RIGHT, toward products. Add a product (or remove a reactant) and it shifts LEFT. Industry exploits this by continuously draining product off: the reaction keeps chasing an equilibrium it never reaches.',
        'STRESS 2, PRESSURE/VOLUME (gases only) — squeezing the container raises pressure, so the system shifts toward the side with FEWER moles of gas to relieve it. Expanding shifts toward MORE moles of gas. Count the gas coefficients on each side; if both sides tie, pressure does nothing. Solids and liquids do not count.',
        'STRESS 3, TEMPERATURE — treat heat as a substance. In an exothermic reaction heat is a PRODUCT (N₂ + 3 H₂ ⇌ 2 NH₃ + heat, ΔH = −92 kJ); in an endothermic one heat is a REACTANT. Heating shifts away from the heat side; cooling shifts toward it. Temperature is the only stress that actually changes the balance point itself, not just the amounts.',
        'THE CATALYST TRAP — a catalyst speeds up the forward AND reverse reactions by exactly the same factor, so equilibrium arrives sooner but lands in the SAME place. Catalysts change the schedule, never the destination.',
      ],
      vocabulary: [
        { term: 'dynamic equilibrium', definition: 'the state in which the forward and reverse reaction rates are equal, so concentrations hold steady while both reactions continue.' },
        { term: 'reversible reaction', definition: 'a reaction that proceeds in both directions, written with a ⇌ arrow.' },
        { term: "Le Chatelier's principle", definition: 'a system at equilibrium responds to a stress by shifting in the direction that partly relieves that stress.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-haber-three-stresses',
      kind: 'worked_example',
      problem:
        'The Haber process runs N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), ΔH = −92 kJ. Predict the direction of the shift when a plant engineer (a) pumps in extra N₂, (b) compresses the reaction vessel to a smaller volume, (c) raises the temperature.',
      steps: [
        '(a) Extra N₂ means too much reactant. The system shifts in the direction that CONSUMES N₂ — to the right, making more NH₃.',
        '(b) Compressing raises the pressure. Count moles of gas: the left side has 1 + 3 = 4, the right side has 2. Fewer gas molecules means less pressure, so the system shifts RIGHT, toward the 2-mole side. More NH₃ again.',
        '(c) ΔH = −92 kJ means the forward reaction RELEASES heat, so heat belongs on the product side: N₂ + 3 H₂ ⇌ 2 NH₃ + heat. Raising the temperature adds heat — too much product — so the system shifts LEFT, back toward N₂ and H₂. Less ammonia.',
        'Putting it together: high pressure and low temperature both favor ammonia. Real plants still run near 400 °C, because at genuinely low temperature the reaction is far too SLOW to be useful — the compromise buys rate at the cost of yield, with a catalyst covering the difference.',
      ],
      answer: '(a) shifts right, (b) shifts right (4 moles of gas → 2), (c) shifts left (heat is a product of an exothermic reaction)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pressure-tie-trap',
      kind: 'worked_example',
      problem:
        'A student predicts that compressing the vessel will push H₂(g) + I₂(g) ⇌ 2 HI(g) toward more HI, "because higher pressure always makes more product." Evaluate the claim, then predict what compression actually does.',
      steps: [
        'Check the reasoning first: the pressure rule is not "toward products," it is "toward the side with FEWER moles of gas." The student swapped a direction rule for a counting rule.',
        'Count the gas moles: left side 1 + 1 = 2, right side 2. The two sides are TIED.',
        'With equal moles of gas on both sides, shifting either way changes nothing about the total number of gas molecules, so shifting relieves none of the added pressure.',
        'Compression therefore causes NO shift for this reaction. Both concentrations rise together, the forward and reverse rates rise together, and the balance holds exactly where it was.',
        'The takeaway: always count coefficients before applying the pressure rule — and remember it only counts GASES. If the same reaction ran in solution, pressure would be irrelevant too.',
      ],
      answer: 'The claim is wrong — moles of gas tie 2 to 2, so compression produces no shift',
      estimatedMinutes: 3,
    },
    {
      id: 'try-remove-product',
      kind: 'try_yourself',
      problem:
        'In the reaction CaCO₃(s) ⇌ CaO(s) + CO₂(g), a lime kiln continuously pumps the CO₂ gas out of the chamber. Which way does the equilibrium shift, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Right — removing a product makes the system shift to replace it, decomposing more CaCO₃', correct: true },
        { id: 'b', text: 'Left — removing CO₂ lowers the pressure, which favors the reactant side' },
        { id: 'c', text: 'No shift — CO₂ is a gas, and gases do not appear in equilibrium reasoning' },
        { id: 'd', text: 'Right at first, then left once the forward reaction stops' },
      ],
      expectedAnswer: 'Right — removing a product makes the system shift to replace it, decomposing more CaCO₃',
      hints: [
        'Le Chatelier: the system shifts to partly UNDO whatever you did. You took something away — what does it do?',
        'CO₂ sits on the product side. Removing a product means the system runs forward to replace it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-endothermic-heating',
      kind: 'try_yourself',
      problem:
        'For the endothermic reaction N₂O₄(g) ⇌ 2 NO₂(g), ΔH = +57 kJ, a sealed tube of the mixture is dropped into hot water. Which way does the equilibrium shift?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Right — heat acts as a reactant here, so adding heat drives the system toward NO₂', correct: true },
        { id: 'b', text: 'Left — heating always drives a system back toward its reactants' },
        { id: 'c', text: 'Right — heating speeds up the forward reaction only, so products win' },
        { id: 'd', text: 'No shift — temperature changes the rate but never the position of an equilibrium' },
      ],
      expectedAnswer: 'Right — heat acts as a reactant here, so adding heat drives the system toward NO₂',
      hints: [
        'ΔH is positive, so the forward reaction ABSORBS heat. Which side of the arrow does heat belong on?',
        'Heat is a reactant here. Adding more of a reactant shifts the system the same way it always does.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Ammonia is burned over a catalyst: 4 NH₃(g) + 5 O₂(g) ⇌ 4 NO(g) + 6 H₂O(g). All four substances are gases. If the reaction vessel is compressed to half its volume, the equilibrium shifts toward the side with fewer moles of gas. How many total moles of gas are on the side the system shifts toward? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'Add up the coefficients of the gases on each side of the ⇌ separately.',
        'Left side: 4 + 5. Right side: 4 + 6. Compression favors the smaller total — report that total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equilibrium-stopped',
      kind: 'misconception_check',
      question:
        'A student says: "Once a reaction reaches equilibrium it has stopped, and the reactants and products must be present in equal amounts." Two things are wrong here — what are they?',
      commonErrors: [
        {
          answer: 'The reaction has stopped, and the amounts are equal',
          misconception: 'Reading "equilibrium" as static and as a 50/50 split, instead of as equal forward and reverse RATES.',
          correctsTo:
            'Nothing stops. The forward and reverse reactions keep running at full speed; they just run at the SAME rate, so every molecule of product formed is matched by one broken apart and the concentrations hold steady. Think of an escalator going up while you walk down at exactly the same pace — you stay level, but nobody is resting. And equal RATES do not mean equal AMOUNTS: an equilibrium can sit 99% products or 99% reactants and still be a perfectly balanced equilibrium.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Dynamic equilibrium: forward rate = reverse rate, so concentrations hold steady while both reactions keep running.',
        'Le Chatelier: stress an equilibrium and it shifts in the direction that partly relieves the stress.',
        'Concentration: add reactant or remove product → shift right; add product or remove reactant → shift left.',
        'Pressure: compressing shifts toward FEWER moles of gas — count the gas coefficients first, and expect no shift if they tie.',
        'Temperature: treat heat as a product when exothermic and a reactant when endothermic, then apply the concentration rule.',
        'A catalyst reaches equilibrium faster but never moves it; equal rates never imply equal amounts.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: "Equilibrium & Le Chatelier's Principle" },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
