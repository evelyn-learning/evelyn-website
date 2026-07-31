/**
 * Chemistry — Chemical Reactions: Oxidation & Reduction Basics.
 *
 * Electron bookkeeping (NGSS HS-PS1-2): oxidation numbers as the tool that
 * makes an invisible electron transfer countable, plus the two classic
 * traps — "oxidation needs oxygen" and the reversed agent labels.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U5_REDOX_INTRO: LessonPlan = {
  id: 'evelyn.hs.chem.redox-intro.v1',
  title: 'Oxidation & Reduction Basics',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.redox-intro',
      standard: 'CHEM-5.4',
      description:
        'Assign oxidation numbers and use their changes to identify which species is oxidized, which is reduced, and which acts as the oxidizing or reducing agent in a chemical reaction (NGSS HS-PS1-2).',
    },
  ],
  prerequisites: ['chem.predicting-products-activity'],
  followUps: ['chem.the-mole-molar-mass'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Batteries, rust, and a browning apple are all the same reaction type — electrons changing owners.',
      script:
        'The battery in your phone is doing exactly one thing: pushing electrons out of a zinc-like metal, through your screen, and into something on the other side that wants them. Stop the electron traffic and the phone dies. That same electron handoff is why a cut apple browns, why iron railings rust, why bleach lifts a stain, and why the food you ate this morning is powering you right now. Chemists call it REDOX — reduction and oxidation. Today we learn the bookkeeping trick that lets you look at any equation and say, in ten seconds, which atom gave electrons away and which one took them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-redox',
      kind: 'concept',
      goal: 'Oxidation and reduction as paired electron transfer, made countable by oxidation numbers — plus the agent-label reversal and the oxygen myth.',
      keyIdeas: [
        'THE CORE IDEA — OXIDATION IS LOSS of electrons, REDUCTION IS GAIN of electrons ("OIL RIG"). They ALWAYS happen together: electrons cannot vanish, so whatever one species loses, another species gains, in the same reaction, in the same instant.',
        'OXIDATION NUMBERS — the accounting tool. An oxidation number is the charge an atom WOULD have if every bond it made were fully ionic. It is a bookkeeping label, not a real measured charge, and it is what makes an invisible electron transfer visible on paper.',
        'THE RULES, APPLIED IN ORDER — (1) a pure element is 0 (Fe, O₂, Na, Cl₂ all zero); (2) a monatomic ion equals its charge (Na⁺ = +1, S²⁻ = −2); (3) hydrogen is +1 (except −1 in metal hydrides like NaH); (4) oxygen is −2 (except −1 in peroxides like H₂O₂); (5) the oxidation numbers in a species must SUM to its overall charge — 0 for a neutral compound, the ion charge for a polyatomic ion.',
        'READING THE CHANGE — write the oxidation number of each element before and after. If a number goes UP the atom lost electrons and was OXIDIZED; if it goes DOWN the atom gained electrons and was REDUCED. If no number changes anywhere, the reaction is not redox at all.',
        'THE AGENT REVERSAL (trap #1) — the OXIDIZING AGENT is the species that gets REDUCED, because it is the one taking electrons and thereby causing the other partner to be oxidized. The REDUCING AGENT is the species that gets OXIDIZED. Students reliably swap these; the agent is named for what it DOES TO THE OTHER, not for what happens to it.',
        'THE OXYGEN MYTH (trap #2) — oxidation does NOT require oxygen. The word is historical, from the era when oxygen was the only known electron thief. In 2 Na + Cl₂ → 2 NaCl there is no oxygen anywhere, yet sodium is oxidized (0 → +1) and chlorine is reduced (0 → −1). Losing electrons is the definition; oxygen is just one common way to lose them.',
        'WHERE THIS SHOWS UP — single-replacement reactions (Zn + Cu²⁺ → Zn²⁺ + Cu) and combustion are always redox; double-replacement and simple acid-base neutralizations usually are not, because ions swap partners without any oxidation number moving.',
      ],
      vocabulary: [
        { term: 'oxidation', definition: 'loss of electrons by a species; its oxidation number increases.' },
        { term: 'reduction', definition: 'gain of electrons by a species; its oxidation number decreases.' },
        { term: 'oxidation number', definition: 'the charge an atom would carry if each of its bonds were counted as fully ionic.' },
        { term: 'oxidizing agent', definition: 'the species that takes electrons from another and is itself reduced.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rust',
      kind: 'worked_example',
      problem:
        'Iron railings rust by the reaction 4 Fe + 3 O₂ → 2 Fe₂O₃. Assign oxidation numbers and state which element is oxidized and which is reduced.',
      steps: [
        'Start with the reactants. Fe is a pure element, so its oxidation number is 0. O₂ is also a pure element, so oxygen starts at 0 as well.',
        'Now the product Fe₂O₃. Oxygen follows rule 4: each O is −2, and there are 3 of them, for a total of −6.',
        'Fe₂O₃ is a neutral compound, so everything must sum to 0. The two iron atoms together must contribute +6, which means each Fe is +3.',
        'Compare before and after. Fe went 0 → +3: the number went UP, so iron LOST electrons and was OXIDIZED. Oxygen went 0 → −2: the number went DOWN, so oxygen GAINED electrons and was REDUCED.',
        'Name the agents from what each does to the other: iron hands electrons over, so iron is the REDUCING agent; oxygen takes them, so oxygen is the OXIDIZING agent.',
      ],
      answer: 'Fe is oxidized (0 → +3) and is the reducing agent; O is reduced (0 → −2) and is the oxidizing agent',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-agent-swap',
      kind: 'worked_example',
      problem:
        'A student analyzes Zn + CuSO₄ → ZnSO₄ + Cu and writes: "Zinc loses electrons, so zinc is the oxidizing agent." Find the flaw and give the correct labels for every species, including the sulfate.',
      steps: [
        'Assign oxidation numbers first. On the left, Zn is a pure element = 0, and in CuSO₄ the copper ion is Cu²⁺ = +2. On the right, in ZnSO₄ the zinc ion is Zn²⁺ = +2, and Cu is a pure element = 0.',
        'Read the changes. Zn: 0 → +2, an increase, so zinc is OXIDIZED. Cu: +2 → 0, a decrease, so copper is REDUCED. The student got this part right.',
        'Now the flaw. The student named zinc the OXIDIZING agent because zinc was oxidized — but the agent labels describe what a species does to its PARTNER. Zinc supplies the electrons that reduce copper, so zinc is the REDUCING agent. Copper takes those electrons and thereby oxidizes the zinc, so Cu²⁺ is the OXIDIZING agent.',
        'Check the sulfate. In SO₄²⁻ the sulfur is +6 and each oxygen is −2 on BOTH sides of the equation — nothing changes, so sulfate is a spectator ion and is neither oxidized nor reduced.',
        'The permanent fix: the species that gets reduced is always the oxidizing agent, and the species that gets oxidized is always the reducing agent. The two labels are always crossed.',
      ],
      answer: 'Zn is oxidized (0 → +2) and is the REDUCING agent; Cu²⁺ is reduced (+2 → 0) and is the OXIDIZING agent; sulfate is a spectator',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-reduced',
      kind: 'try_yourself',
      problem:
        'In the reaction Mg + 2 HCl → MgCl₂ + H₂, which species is REDUCED?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Hydrogen — it goes from +1 in HCl to 0 in H₂', correct: true },
        { id: 'b', text: 'Magnesium — it goes from 0 to +2' },
        { id: 'c', text: 'Chlorine — it goes from −1 to +1' },
        { id: 'd', text: 'Nothing is reduced, because no oxygen appears in the reaction' },
      ],
      expectedAnswer: 'Hydrogen — it goes from +1 in HCl to 0 in H₂',
      hints: [
        'Assign oxidation numbers on both sides first: Mg alone and H₂ are pure elements, so both are 0.',
        'Reduction means the oxidation number goes DOWN. Which element\'s number decreases from left to right?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-oxidizing-agent',
      kind: 'try_yourself',
      problem:
        'Sodium metal burns in chlorine gas: 2 Na + Cl₂ → 2 NaCl. Which species is the OXIDIZING agent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cl₂ — it is reduced from 0 to −1, and taking those electrons is what oxidizes the sodium', correct: true },
        { id: 'b', text: 'Na — it is the one being oxidized, so it must be the oxidizing agent' },
        { id: 'c', text: 'NaCl — the product holds all the transferred electrons' },
        { id: 'd', text: 'There is no oxidizing agent, because no oxygen is present' },
      ],
      expectedAnswer: 'Cl₂ — it is reduced from 0 to −1, and taking those electrons is what oxidizes the sodium',
      hints: [
        'Assign the numbers: both Na and Cl₂ start at 0; in NaCl sodium is +1 and chlorine is −1.',
        'The agent labels are always crossed — the species that gets REDUCED is the oxidizing agent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Potassium permanganate, KMnO₄, is the deep purple compound used to disinfect water. Using the rules that potassium is +1 and each oxygen is −2, and knowing the compound is neutral overall, what is the oxidation number of the manganese atom? Type your answer as a number (write a negative answer like -2).',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'The oxidation numbers of all five atoms must sum to 0, because KMnO₄ carries no overall charge.',
        'Potassium contributes +1 and the four oxygens contribute 4 × (−2) = −8, a running total of −7. What must Mn contribute to bring the sum to 0?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-oxygen-required',
      kind: 'misconception_check',
      question:
        'A student says: "The reaction 2 Na + Cl₂ → 2 NaCl cannot be oxidation, because there is no oxygen in it anywhere." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'No oxygen means no oxidation',
          misconception: 'Taking the historical name literally and requiring oxygen to be a reactant before a reaction can count as redox.',
          correctsTo:
            'Oxidation is defined by ELECTRONS, not by oxygen. The name is a leftover from the 1700s, when oxygen was the only electron thief chemists had identified. Here sodium goes 0 → +1 (loses an electron, oxidized) and chlorine goes 0 → −1 (gains an electron, reduced) — a textbook redox reaction with no oxygen atom in sight. The test is always the same: did any oxidation number change?',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'OIL RIG — Oxidation Is Loss of electrons, Reduction Is Gain. The two always occur together in the same reaction.',
        'Oxidation numbers make the transfer countable: pure element = 0, monatomic ion = its charge, H = +1, O = −2, and everything sums to the overall charge.',
        'Number goes UP → oxidized. Number goes DOWN → reduced. No number changes → not a redox reaction.',
        'The agent labels are crossed: the species REDUCED is the oxidizing agent; the species OXIDIZED is the reducing agent.',
        'Oxidation needs no oxygen — 2 Na + Cl₂ → 2 NaCl is redox because electrons moved, not because oxygen showed up.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Oxidation & Reduction Basics' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
