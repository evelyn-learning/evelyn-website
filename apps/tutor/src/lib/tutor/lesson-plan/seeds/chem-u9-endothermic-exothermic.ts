/**
 * Chemistry — Thermochemistry: Endothermic & Exothermic Reactions.
 *
 * Energy accounting at the bond level (NGSS HS-PS1-4): breaking bonds
 * costs energy, forming bonds pays it back, and the difference IS ΔH.
 * The star misconception gets equal billing — a cold pack feels cold
 * because it ABSORBS energy, not because it "releases cold".
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U9_ENDOTHERMIC_EXOTHERMIC: LessonPlan = {
  id: 'evelyn.hs.chem.endothermic-exothermic.v1',
  title: 'Endothermic & Exothermic Reactions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.endothermic-exothermic',
      standard: 'CHEM-9.1',
      description:
        'Classify reactions as endothermic or exothermic from the sign of ΔH and from bond-energy accounting, explaining energy flow in terms of bonds broken versus bonds formed (NGSS HS-PS1-4).',
    },
  ],
  prerequisites: ['chem.dilutions-colligative'],
  followUps: ['chem.specific-heat-calorimetry'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two packs from the same first-aid kit — one gets hot, one gets cold — and the difference is pure bond bookkeeping.',
      script:
        'Reach into a first-aid kit and you can pull out two nearly identical plastic pouches. Snap one and it climbs to 50°C — a hand warmer for a hypothermic hiker. Snap the other and it plunges toward 2°C — an ice pack for a sprained ankle, no freezer required. Same kit, same squeeze, opposite temperatures. Neither pouch stores hot or cold; both are just running a chemical reaction, and the reaction decides which way energy flows. Today you learn to read that direction off a chemical equation before you ever touch the pack — and to calculate exactly how much energy moves.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-energy-flow',
      kind: 'concept',
      goal: 'Bond breaking vs bond forming as the engine behind ΔH, the sign convention, and the classic sign and "cold" errors.',
      keyIdeas: [
        'ENERGY LIVES IN BONDS — a chemical bond is a stable, low-energy arrangement. Pulling one apart is like pulling apart two magnets: it COSTS energy. Letting atoms snap together into a new bond RELEASES energy. Every reaction breaks old bonds and forms new ones, so every reaction has an energy bill.',
        'BREAKING ABSORBS, FORMING RELEASES — this is the sentence the whole unit rests on, and it is exactly backwards in most students\' heads. Bonds do not "store energy you get by breaking them"; you PAY to break them and get PAID when they form.',
        'ΔH IS THE NET BILL — enthalpy change ΔH = (energy to break all reactant bonds) − (energy released forming all product bonds). It is the difference, not either piece alone.',
        'THE SIGN CONVENTION — ΔH NEGATIVE means exothermic: forming the product bonds paid back MORE than breaking cost, so the surplus leaves the system as heat and the beaker feels HOT. ΔH POSITIVE means endothermic: breaking cost more than forming paid back, so the system pulls the shortfall in from its surroundings and the beaker feels COLD.',
        'ENERGY DIAGRAM READING — plot reactants and products by energy. Products BELOW reactants → energy went out → exothermic, ΔH negative. Products ABOVE reactants → energy came in → endothermic, ΔH positive. The vertical gap between the two levels is |ΔH|.',
        'WHERE YOU MEET EACH ONE — exothermic: combustion of fuels, hand warmers, neutralizing acid with base, an explosion, respiration in your cells. Endothermic: instant cold packs, melting ice, cooking an egg, photosynthesis, decomposing limestone in a cement kiln.',
        'THE TRAP: "COLD" IS NOT A THING THAT GETS RELEASED — a cold pack does not emit cold. It ABSORBS energy from your skin, and your skin having less energy is what "cold" means. Endothermic reactions gain energy; they cool you by taking it.',
        'THE OTHER TRAP: SIGN FLIPPING — writing formed minus broken instead of broken minus formed reverses every answer, turning an explosion into a cold pack. Always subtract in the order: bonds BROKEN first, bonds FORMED second.',
      ],
      vocabulary: [
        { term: 'exothermic', definition: 'a reaction that releases energy to its surroundings; ΔH is negative and the surroundings warm up.' },
        { term: 'endothermic', definition: 'a reaction that absorbs energy from its surroundings; ΔH is positive and the surroundings cool down.' },
        { term: 'enthalpy change (ΔH)', definition: 'the net energy exchanged with the surroundings at constant pressure, equal to bonds broken minus bonds formed.' },
        { term: 'bond energy', definition: 'the energy in kJ/mol required to break one mole of a particular bond — the same amount released when that bond forms.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-bond-energy-water',
      kind: 'worked_example',
      problem:
        'Hydrogen burns in a rocket engine: 2 H₂ + O₂ → 2 H₂O. Bond energies in kJ/mol: H-H = 436, O=O = 498, O-H = 463. Calculate ΔH and classify the reaction.',
      steps: [
        'Count the bonds BROKEN on the reactant side: 2 H₂ molecules contain 2 H-H bonds, and O₂ contains 1 O=O bond.',
        'Energy in (breaking): 2 × 436 + 1 × 498 = 872 + 498 = 1370 kJ. This is the cost, and it is always a positive number.',
        'Count the bonds FORMED on the product side: each H₂O has 2 O-H bonds, and there are 2 water molecules → 4 O-H bonds.',
        'Energy out (forming): 4 × 463 = 1852 kJ. This is the payback.',
        'ΔH = broken − formed = 1370 − 1852 = -482 kJ. The payback exceeded the cost by 482 kJ.',
        'Negative ΔH → EXOTHERMIC. The surplus 482 kJ leaves as heat and light, which is exactly why this reaction lifts rockets. Products sit 482 kJ BELOW reactants on the energy diagram.',
      ],
      answer: 'ΔH = -482 kJ — exothermic, because forming four O-H bonds releases more than breaking H-H and O=O costs',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sign-flip-trap',
      kind: 'worked_example',
      problem:
        'The Haber process makes fertilizer ammonia: N₂ + 3 H₂ → 2 NH₃. Bond energies in kJ/mol: N≡N = 941, H-H = 436, N-H = 391. A student computes ΔH = 2346 − 2249 = +97 kJ and concludes the reaction is endothermic. Find the error and give the correct answer.',
      steps: [
        'Check the student\'s two totals first — those are actually right. Broken: 1 N≡N (941) + 3 H-H (3 × 436 = 1308) = 2249 kJ. Formed: 2 NH₃ molecules × 3 N-H bonds each = 6 N-H bonds × 391 = 2346 kJ.',
        'Name the move: the student subtracted FORMED minus BROKEN. That is the definition run backwards.',
        'Why it matters: the subtraction order encodes the direction of energy flow. Breaking is what the system pays; forming is what it collects. ΔH must be paid minus collected = broken − formed.',
        'Redo it in the legal order: ΔH = 2249 − 2346 = -97 kJ.',
        'Negative ΔH → EXOTHERMIC, the opposite of the student\'s conclusion. Industrial ammonia plants do in fact have to remove heat from the reactor, confirming the sign.',
        'Reality check on the flip: forming 2346 kJ worth of bonds while spending only 2249 kJ leaves a 97 kJ surplus with nowhere to go except out into the surroundings. Whenever formed > broken, the answer is negative.',
      ],
      answer: 'ΔH = -97 kJ — exothermic; the student reversed the subtraction, which flips the sign and the classification',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cold-pack',
      kind: 'try_yourself',
      problem:
        'An instant cold pack works by dissolving ammonium nitrate in water; the pouch drops from 22°C to 2°C. Which statement correctly describes the process?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is endothermic — the process absorbs energy from the water and your skin, so ΔH is positive', correct: true },
        { id: 'b', text: 'It is exothermic — the pack releases cold into the surroundings, so ΔH is negative' },
        { id: 'c', text: 'It is endothermic — the pack loses energy to the surroundings, so ΔH is negative' },
        { id: 'd', text: 'Neither — no bonds change, so ΔH is exactly zero' },
      ],
      expectedAnswer: 'It is endothermic — the process absorbs energy from the water and your skin, so ΔH is positive',
      hints: [
        'Nothing ever "releases cold". Something got colder because energy LEFT it — so where did that energy go?',
        'Energy flowed INTO the pack from its surroundings. Energy in means endothermic, and endothermic carries a positive ΔH.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-bond-reasoning',
      kind: 'try_yourself',
      problem: 'A reaction is exothermic. What must be true about its bonds?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Forming the product bonds releases more energy than breaking the reactant bonds absorbs', correct: true },
        { id: 'b', text: 'Breaking the reactant bonds releases more energy than forming the product bonds absorbs' },
        { id: 'c', text: 'The products contain more total bonds than the reactants do' },
        { id: 'd', text: 'No bonds are broken, so all of the energy is released' },
      ],
      expectedAnswer: 'Forming the product bonds releases more energy than breaking the reactant bonds absorbs',
      hints: [
        'Two of the choices swap which step absorbs and which step releases. Fix that first: breaking absorbs, forming releases.',
        'Exothermic means net energy comes OUT, so the releasing step (forming) must outweigh the absorbing step (breaking).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Hydrogen chloride forms from its elements: H₂ + Cl₂ → 2 HCl. Bond energies in kJ/mol: H-H = 436, Cl-Cl = 242, H-Cl = 431. Calculate ΔH for the reaction. Type your answer as a number in kJ, with a minus sign in front if it is negative (for example, -890).',
      responseFormat: 'numeric',
      expectedAnswer: '-184',
      hints: [
        'Bonds broken: one H-H plus one Cl-Cl. Bonds formed: two H-Cl (one in each HCl molecule).',
        'ΔH = broken − formed = (436 + 242) − (2 × 431) = 678 − 862. Keep the subtraction in that order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cold-released',
      kind: 'misconception_check',
      question:
        'A student says: "The cold pack is exothermic because it gives off cold — you can feel the cold coming out of it." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'The pack releases cold, so it is exothermic',
          misconception: 'Treating "cold" as a substance that can be emitted, and attaching the exothermic label to anything you can feel.',
          correctsTo:
            'Cold is not a thing that travels — only energy travels, and it always moves from hotter to colder. Your hand feels cold because the pack ABSORBS energy out of your skin, leaving your skin with less. Energy flowing INTO the reaction makes it ENDOTHERMIC with a POSITIVE ΔH. Exothermic is the opposite case: energy flowing out, surroundings warming, negative ΔH — that is the hand warmer, not the ice pack.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Breaking bonds ABSORBS energy; forming bonds RELEASES energy — get this backwards and every answer inverts.',
        'ΔH = bonds broken − bonds formed. The subtraction order is part of the definition.',
        'ΔH negative = exothermic: surroundings warm up, products sit below reactants on the energy diagram (combustion, hand warmers, neutralization).',
        'ΔH positive = endothermic: surroundings cool down, products sit above reactants (cold packs, melting, photosynthesis).',
        'Nothing releases "cold" — a cold pack feels cold because it takes energy from you, which is the definition of endothermic.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Endothermic & Exothermic Reactions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
