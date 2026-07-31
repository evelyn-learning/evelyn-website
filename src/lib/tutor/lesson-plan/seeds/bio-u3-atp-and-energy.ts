/**
 * Biology — Cell Energy: ATP & Energy Flow in Living Systems.
 *
 * The opening lesson of the cell-energy unit (NGSS HS-LS1-7). It sets up the
 * currency before either factory: what ATP is, how the ATP ⇄ ADP cycle
 * recharges it, and why a cell keeps only seconds of it on hand. Photosynthesis
 * (3.2) and cellular respiration (3.3) both make sense only once a student
 * knows what they are spending and earning, so the concept segment is built
 * around the currency-vs-storage distinction.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U3_ATP_AND_ENERGY: LessonPlan = {
  id: 'evelyn.hs.bio.atp-and-energy.v1',
  title: 'ATP & Energy Flow in Living Systems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.atp-and-energy',
      standard: 'BIO-3.1',
      description:
        'Describe the structure of ATP and the ATP ⇄ ADP cycle, and use it to trace how energy flows from sunlight through autotrophs and heterotrophs, losing usable energy as heat at every transfer (NGSS HS-LS1-7).',
    },
  ],
  prerequisites: ['bio.transport-across-membranes'],
  followUps: ['bio.photosynthesis'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame ATP as a rechargeable battery the body drains and refills thousands of times a day.',
      script:
        'Your body contains only about 250 grams of ATP at any moment — roughly the mass of an apple. Yet in a single day you burn through your own body weight in it, because every molecule gets recharged and reused thousands of times. Sprint up a flight of stairs and your muscles empty their ATP in seconds, then refill it just as fast. In this lesson you will see what ATP actually is, how that recharge works, and why no cell ever bothers to stockpile it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-atp-cycle',
      kind: 'concept',
      goal: 'ATP structure, the ATP ⇄ ADP cycle, currency vs storage, autotrophs vs heterotrophs, and heat loss at every transfer.',
      keyIdeas: [
        'WHAT ATP IS MADE OF — adenosine triphosphate has three parts: an ADENINE base, a five-carbon RIBOSE sugar, and a tail of THREE PHOSPHATE groups strung in a row. The name is the structure: "tri-phosphate" means three phosphates.',
        'WHERE THE ENERGY SITS — the three phosphates each carry negative charge and repel each other, so the tail is under strain, like a compressed spring. Breaking the bond to the LAST (terminal) phosphate lets that strain relax and releases usable energy. The energy is in the crowded arrangement, not stored inside the bond like liquid in a bottle.',
        'THE ATP ⇄ ADP CYCLE — ATP → ADP + phosphate + energy powers cellular work. Running it backward, ADP + phosphate + energy → ATP, recharges the molecule. ADP is not waste; it is the discharged battery waiting to be refilled. The same molecules cycle round and round, thousands of times a day.',
        'CURRENCY, NOT STORAGE — ATP is SHORT-TERM spending money. A cell holds only a few seconds worth. LONG-TERM energy is stored in GLUCOSE and, over longer spans, in FAT, which pack far more energy per molecule. Cells convert storage into ATP on demand rather than hoarding ATP itself.',
        'AUTOTROPHS VS HETEROTROPHS — AUTOTROPHS (plants, algae, some bacteria) make their own food from light or chemicals; HETEROTROPHS (animals, fungi) must eat other organisms to obtain it. Both groups then run cellular respiration to turn that food into ATP — plants respire too, day and night.',
        'THE BIG PICTURE — PHOTOSYNTHESIS stores energy: light energy is packed into the bonds of C6H12O6, with CO2 and H2O as the raw materials. CELLULAR RESPIRATION releases it: C6H12O6 + O2 → CO2 + H2O + ATP. One deposits into savings, the other withdraws into spending money.',
        'NEVER 100 PERCENT EFFICIENT — every energy transformation loses some energy as HEAT. Cellular respiration captures only about 40 percent of glucose energy as ATP; the rest warms you, which is exactly why your body is warmer than the room. Energy is not destroyed, but the escaped heat is no longer usable for work.',
        'WHY IT FLOWS ONE WAY — because each transfer sheds heat, energy FLOWS through an ecosystem (sunlight → producers → consumers → heat) rather than cycling like matter. That is why food chains run short: only a small fraction of energy makes it to the next level.',
      ],
      vocabulary: [
        { term: 'ATP', definition: 'adenosine triphosphate — the short-term energy currency cells spend to do work.' },
        { term: 'ADP', definition: 'adenosine diphosphate — the two-phosphate, discharged form of ATP, ready to be recharged.' },
        { term: 'autotroph', definition: 'an organism that makes its own food, such as a plant using photosynthesis.' },
        { term: 'heterotroph', definition: 'an organism that must consume other organisms to obtain food energy.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_concept_map', 'show_balanced_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-recharge-cycle',
      kind: 'worked_example',
      problem:
        'A muscle cell spends an ATP molecule to power a contraction. Name what the ATP becomes, where the released energy came from, and what has to happen before that same molecule can be spent again.',
      steps: [
        'Start with the structure: ATP is adenine + ribose + three phosphates in a row. Spending it means breaking off the terminal (third) phosphate.',
        'Write the reaction: ATP → ADP + phosphate + energy. The molecule left behind is ADP, which still has adenine, ribose, and two phosphates.',
        'Account for the energy: the three negatively charged phosphates were repelling one another. Removing the last one relieves that strain, and the released energy drives the contraction.',
        'Recharge to reuse: the cell runs the reaction backward — ADP + phosphate + energy → ATP — using energy harvested from food by cellular respiration. Only then can that molecule be spent again.',
      ],
      answer:
        'It becomes ADP plus a free phosphate. The energy came from relieving the repulsion among the crowded phosphates. Cellular respiration must reattach a phosphate to ADP before the molecule can be spent again.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-storage-vs-currency',
      kind: 'worked_example',
      problem:
        'A student reasons: "ATP is the energy molecule, so an organism preparing for a long winter should build up a big reserve of ATP." Explain why cells store fat and glucose instead, and what would actually go wrong with the ATP plan.',
      steps: [
        'Separate the two jobs: ATP is spending money for immediate work; glucose and fat are savings accounts for the long term.',
        'Compare capacity: one fat or glucose molecule holds far more energy than one ATP, so storing the same energy as ATP would take an enormous number of molecules — an impossible bulk for a cell.',
        'Check stability and turnover: ATP is unstable and is spent within seconds of being made. A cell holds only a few seconds worth at a time and simply keeps recharging ADP as needed.',
        'State the correct plan: the organism stores fat, then converts it to ATP on demand through cellular respiration all winter. The ATP pool stays small the whole time — it is a shuttle, not a warehouse.',
      ],
      answer:
        'Fat and glucose are the long-term stores because they hold far more energy per molecule and are stable; ATP is unstable, held in tiny amounts, and continuously regenerated from ADP as it is spent.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-atp-structure',
      kind: 'try_yourself',
      problem: 'Which list correctly names the three parts of an ATP molecule?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Adenine, a ribose sugar, and three phosphate groups', correct: true },
        { id: 'b', text: 'Adenine, a glucose sugar, and two phosphate groups' },
        { id: 'c', text: 'An amino acid, a fatty acid, and three phosphate groups' },
        { id: 'd', text: 'Adenine, a ribose sugar, and a single phosphate group' },
      ],
      expectedAnswer: 'Adenine, a ribose sugar, and three phosphate groups',
      hints: [
        'The full name adenosine TRIphosphate tells you two of the three parts outright.',
        'The sugar in ATP is the same five-carbon sugar found in RNA, not the six-carbon sugar C6H12O6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-currency-vs-storage',
      kind: 'try_yourself',
      problem:
        'A cell has just made a large batch of ATP from a meal. Which statement best describes what that ATP is for?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'ATP is where the body stores energy long-term, so the batch will last for days' },
        { id: 'b', text: 'ATP replaces glucose entirely, so the cell no longer needs food molecules' },
        { id: 'c', text: 'ATP is short-term spending money — it is used within seconds, while glucose and fat hold the long-term reserves', correct: true },
        { id: 'd', text: 'ATP is a waste product of digestion that the cell will export and discard' },
      ],
      expectedAnswer:
        'ATP is short-term spending money — it is used within seconds, while glucose and fat hold the long-term reserves',
      hints: [
        'Ask how long a cell can survive on the ATP it is holding right now: seconds, or days?',
        'Which molecules does an organism actually build up before a long fast or a winter — ATP, or fat and glucose?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plants-respire',
      kind: 'try_yourself',
      problem:
        'A plant sits in a sunny window all afternoon, photosynthesizing steadily. How does that plant obtain the ATP its cells need to grow and transport materials?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plants do not do cellular respiration; photosynthesis makes ATP for every cellular job directly' },
        { id: 'b', text: 'The plant runs cellular respiration on the glucose it made, releasing that stored energy as ATP', correct: true },
        { id: 'c', text: 'The plant absorbs ready-made ATP from the soil through its roots' },
        { id: 'd', text: 'Sunlight is converted straight into ATP in every cell of the plant, including the roots' },
      ],
      expectedAnswer: 'The plant runs cellular respiration on the glucose it made, releasing that stored energy as ATP',
      hints: [
        'Photosynthesis STORES energy in glucose. Which process RELEASES stored energy as ATP?',
        'Root cells never see light, yet they still need ATP — so the plant must be doing something with its glucose.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-energy-recycled',
      kind: 'misconception_check',
      question:
        'A student writes: "Energy is never destroyed, so a cell recycles the same energy forever — that is why the ATP ⇄ ADP cycle can keep running without any food." What went wrong?',
      commonErrors: [
        {
          answer: 'The ATP cycle recycles energy, so no new energy input is needed',
          misconception:
            'Confusing the recycling of MOLECULES (ADP and phosphate are reused) with the recycling of ENERGY, and overlooking the heat lost at every transformation.',
          correctsTo:
            'The MOLECULES cycle; the ENERGY does not. Every transfer leaks some energy as heat, which escapes the cell and can no longer do work — cellular respiration captures only about 40 percent of glucose energy as ATP. So the cycle needs a constant fresh supply of energy from food, and ultimately from sunlight. Energy is conserved but degraded, which is why it FLOWS through living systems rather than cycling within them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'ATP = adenine + ribose + three phosphates. Breaking off the terminal phosphate releases usable energy.',
        'The cycle: ATP → ADP + phosphate + energy to spend; ADP + phosphate + energy → ATP to recharge.',
        'ATP is short-term currency held for seconds; glucose and fat are the long-term storage molecules.',
        'Autotrophs make their own food, heterotrophs eat it — but BOTH run cellular respiration to make ATP.',
        'Photosynthesis stores energy in C6H12O6; cellular respiration releases it as ATP.',
        'No transformation is 100 percent efficient — heat escapes each time, so energy flows one way through living systems.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'ATP & Energy Flow in Living Systems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
