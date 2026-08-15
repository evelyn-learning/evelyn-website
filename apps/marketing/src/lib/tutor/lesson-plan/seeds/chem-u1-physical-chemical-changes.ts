/**
 * Chemistry — Atomic Structure & Properties: Physical & Chemical
 * Properties and Changes.
 *
 * The classification skill the whole course leans on (NGSS HS-PS1-2):
 * does the substance's IDENTITY survive the change? Physical properties
 * and changes preserve it; chemical ones rearrange atoms into new
 * substances — with mass conserved either way. The star misconceptions
 * get equal billing: bubbles and irreversibility are not proof of a
 * chemical change.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U1_PHYSICAL_CHEMICAL_CHANGES: LessonPlan = {
  id: 'evelyn.hs.chem.physical-chemical-changes.v1',
  title: 'Physical & Chemical Properties and Changes',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.physical-chemical-changes',
      standard: 'CHEM-1.2',
      description:
        'Distinguish physical from chemical properties and changes using evidence that a substance\'s chemical identity was or was not preserved, and apply conservation of mass to the substances involved (NGSS HS-PS1-2).',
    },
  ],
  prerequisites: ['chem.classifying-matter'],
  followUps: ['chem.measurement-sig-figs'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'One question — did the substance survive? — separates cooking from spoiling, and it is the question chemists ask about every change.',
      script:
        'Melt butter in a pan and you can chill it back into butter. Leave that same butter out for three weeks and it goes rancid — and no fridge on earth turns it back. Both looked like "the butter changed." Only one of them destroyed the butter. That single question — did the substance keep its chemical identity, or did its atoms rearrange into something genuinely new? — is what you will answer today, and you will answer it with evidence rather than a hunch. Every reaction, every lab, every equation in the rest of this course starts by knowing which kind of change you are watching.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-physical-vs-chemical',
      kind: 'concept',
      goal: 'The identity test for properties and changes, the real evidence for a chemical change, and the two traps (bubbles, irreversibility) that fool most students.',
      keyIdeas: [
        'THE IDENTITY TEST — the ONE question behind everything today: after the change, is it still the same substance? Yes → PHYSICAL change. No, new substances with new properties exist → CHEMICAL change. Memorized lists of examples fail on new cases; the identity test never does.',
        'PHYSICAL vs CHEMICAL PROPERTY — a PHYSICAL property is anything you can measure WITHOUT destroying the substance (color, odor, density, melting point, boiling point, hardness, solubility, conductivity, state); measuring the density of copper leaves you with copper. A CHEMICAL property describes how a substance reacts and can only be observed by trying to turn it into something else (flammability, reactivity with acid, ability to rust, toxicity) — to observe iron\'s ability to rust, you must let some iron stop being iron.',
        'INTENSIVE vs EXTENSIVE — intensive properties (density, melting point, color) do NOT depend on how much you have; extensive properties (mass, volume, length) do. Only intensive properties identify a substance: a 1 g sample and a 50 kg block of aluminum share the same density, 2.7 g/cm³.',
        'PHYSICAL CHANGE — form, shape, or state changes; the molecules themselves survive intact. Ice melting is still H₂O. Salt dissolving is still Na⁺ and Cl⁻ ions, just dispersed. Copper drawn into wire is still copper.',
        'CHEMICAL CHANGE (a reaction) — atoms REARRANGE into new substances: reactants → products. 2 Mg + O₂ → 2 MgO. Magnesium (a shiny bendable metal) and oxygen (an invisible gas) are gone; white crumbly magnesium oxide is what you now have.',
        'EVIDENCE OF A CHEMICAL CHANGE — unexpected color change, gas produced by mixing (not by heating past a boiling point), a precipitate (solid appearing when two clear solutions meet), light emitted, or a temperature change the surroundings did not supply. Treat these as CLUES that demand the identity test, not as proof by themselves.',
        'THE TWO TRAPS — (1) BUBBLES ≠ CHEMICAL: boiling water bubbles furiously and is still H₂O; opening a soda bubbles and the CO₂ was already dissolved CO₂. (2) IRREVERSIBLE ≠ CHEMICAL: shatter a mug or scramble the layers of a milkshake and you will never undo it, yet no new substance formed. Reversibility is a hint, never the test.',
        'CONSERVATION OF MASS — atoms are never created or destroyed, so in a closed system total mass before = total mass after, for physical AND chemical changes alike. Burning wood only LOOKS like mass vanished because CO₂ and water vapor left the scene; burned magnesium GAINS mass because oxygen from the air joined it.',
      ],
      vocabulary: [
        { term: 'physical property', definition: 'a characteristic observable without changing the substance into a different substance.' },
        { term: 'chemical property', definition: 'a description of how a substance reacts to become a different substance.' },
        { term: 'intensive property', definition: 'a property whose value is independent of the amount of sample.' },
        { term: 'chemical change', definition: 'a process in which atoms rearrange, producing substances with new chemical identities.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify-lab-observations',
      kind: 'worked_example',
      problem:
        'A lab tech records four observations about a strip of zinc metal. (1) It is shiny and gray. (2) Its density is 7.1 g/cm³. (3) The strip has a mass of 5.0 g. (4) Dropped into hydrochloric acid, it fizzes and slowly disappears, leaving a colorless solution. Label each observation as a physical property, a chemical property, or an extensive property, and state whether a chemical change occurred.',
      steps: [
        'Observation 1 — "shiny and gray": you looked at it and the zinc is still zinc. Observed without destroying the substance → physical property. It is also intensive; a bigger strip is not grayer.',
        'Observation 2 — density 7.1 g/cm³: measured by weighing and measuring volume, both of which leave the zinc intact → physical property, and intensive, so it can help identify the metal.',
        'Observation 3 — mass 5.0 g: still physical, but this one depends entirely on how big the piece is → extensive property. Cut the strip in half and the value changes, so mass alone can never identify a substance.',
        'Observation 4 — reacts with hydrochloric acid: to observe this you had to let the zinc stop being zinc. "Reacts with acid" is therefore a chemical property, and the event itself was a chemical change: Zn + 2 HCl → ZnCl₂ + H₂.',
        'Apply the identity test to observation 4: the zinc atoms are now bound in dissolved ZnCl₂ and the fizzing is newly formed H₂ gas — substances that did not exist before. New substances → chemical change confirmed.',
      ],
      answer: 'Shiny/gray and density 7.1 g/cm³ = physical (intensive); mass 5.0 g = physical but extensive; reacting with acid = chemical property, and that reaction was a chemical change',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-bubbles-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "Boiling water must be a chemical change — it makes gas bubbles, and gas is one of the signs of a chemical reaction." Find the flaw, then contrast boiling with a case where bubbles really do prove a chemical change.',
      steps: [
        'Run the identity test on boiling first: liquid water is H₂O, and the steam leaving the pot is H₂O. Same molecules, same substance — only the spacing and motion of the molecules changed. Physical change, no matter how violent the bubbling looks.',
        'Name the flaw precisely: "gas produced" is evidence only when the gas is a NEW substance. In boiling, the gas is the same substance that was already in the beaker, so the clue does not apply.',
        'Confirm with a second check — reversibility and constant temperature: condense the steam on a cold lid and liquid water returns, and the water holds at 100 °C throughout because the energy is going into separating molecules, not into breaking bonds within them.',
        'Now the contrasting case: drop an antacid tablet into water and it fizzes too, but the escaping gas is CO₂, and no CO₂ existed as CO₂ before. Bicarbonate and citric acid in the tablet rearranged into new products. Chemical change.',
        'The reliable rule: do not ask "are there bubbles?" Ask "is the gas a substance that did not exist a moment ago?" That question separates a boiling pot from a fizzing tablet every time.',
      ],
      answer: 'Boiling is a PHYSICAL change — the bubbles are H₂O vapor, the same substance; bubbles only signal a chemical change when the gas is a newly formed substance, as with the antacid tablet\'s CO₂',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-chemical-change',
      kind: 'try_yourself',
      problem:
        'Which of these four everyday events is a CHEMICAL change?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A copper roof turning green over many years', correct: true },
        { id: 'b', text: 'Dry ice giving off a thick white fog as it sits on a table' },
        { id: 'c', text: 'A sugar cube dissolving completely in hot tea' },
        { id: 'd', text: 'A ceramic plate shattering on the floor' },
      ],
      expectedAnswer: 'A copper roof turning green over many years',
      hints: [
        'Run the identity test on each one: after the event, is the original substance still present as itself?',
        'Fog, dissolving, and shattering all leave the starting substance chemically untouched. Only one of the four produces a compound that did not exist before.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-intensive-property',
      kind: 'try_yourself',
      problem:
        'A forensic chemist has an unknown metal fragment and needs to identify it. Which measurement is most useful for identifying WHICH metal it is?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Its density, because density is intensive — every sample of that metal gives the same value', correct: true },
        { id: 'b', text: 'Its mass, because mass is the most precisely measurable quantity in the lab' },
        { id: 'c', text: 'Its volume, because volume tells you how much of the substance is present' },
        { id: 'd', text: 'Its length, because the fragment can be measured without damaging evidence' },
      ],
      expectedAnswer: 'Its density, because density is intensive — every sample of that metal gives the same value',
      hints: [
        'Identifying a substance requires a property that does not change when you cut the sample in half.',
        'Mass, volume, and length are all extensive — they scale with sample size. Which listed property is a fixed fingerprint for the material itself?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A 2.4 g strip of magnesium is burned inside a sealed container of oxygen. The magnesium reacts completely, and the only product is 4.0 g of white magnesium oxide powder. What mass of oxygen, in grams, combined with the magnesium? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '1.6',
      hints: [
        'The container is sealed, so no atoms entered or left: total mass of reactants = total mass of products.',
        'Magnesium mass + oxygen mass = magnesium oxide mass. Solve 2.4 + oxygen = 4.0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-irreversible-means-chemical',
      kind: 'misconception_check',
      question:
        'A student says: "Dissolving salt in water must be a chemical change — the salt crystals are gone, you cannot see them anymore, and you certainly cannot pick them back out." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'The salt disappeared and cannot be recovered, so it became something new',
          misconception: 'Using "looks gone" and "seems irreversible" as the test, instead of asking whether the chemical identity survived.',
          correctsTo:
            'The salt is not gone — it is dispersed. Sodium chloride separates into Na⁺ and Cl⁻ ions that were already the units making up the crystal, and no new substance forms; the solution still tastes salty because the salt is still chemically there. It is also perfectly reversible: boil off the water and the crystals return unchanged. And even genuinely irreversible events like shattering a mug are physical. The test is identity, never recoverability.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The identity test decides everything: same substance after the change → physical; new substances → chemical.',
        'Physical properties (color, density, melting point) are observable without destroying the sample; chemical properties (flammability, reactivity with acid) can only be observed by destroying it.',
        'Only INTENSIVE properties like density identify a substance — extensive ones like mass and volume just tell you how much you have.',
        'Color change, new gas, precipitate, light, or unexplained temperature change are clues that demand the identity test — they are not proof on their own.',
        'The two traps: bubbles ≠ chemical (boiling water is still H₂O) and irreversible ≠ chemical (a shattered mug is still ceramic).',
        'Mass is always conserved: burning wood only seems to lose mass because gases escape, and burning magnesium gains mass because oxygen joins it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Physical & Chemical Properties and Changes' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
