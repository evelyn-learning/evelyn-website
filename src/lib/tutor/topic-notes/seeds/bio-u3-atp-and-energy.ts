/**
 * Biology — Unit 3 CED 3.1: ATP & Energy Flow in Living Systems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.atp-and-energy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U3_ATP_AND_ENERGY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.atp-and-energy.v1',
  course: 'Biology',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'ATP & Energy Flow in Living Systems',
  planId: 'evelyn.hs.bio.atp-and-energy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.atp-and-energy.v1' }],
  theory: [
    { loId: 'bio.atp-and-energy', kind: 'framework', title: 'What atp is made of', content: `WHAT ATP IS MADE OF — adenosine triphosphate has three parts: an ADENINE base, a five-carbon RIBOSE sugar, and a tail of THREE PHOSPHATE groups strung in a row. The name is the structure: "tri-phosphate" means three phosphates.` },
    { loId: 'bio.atp-and-energy', kind: 'framework', title: 'Where the energy sits', content: `WHERE THE ENERGY SITS — the three phosphates each carry negative charge and repel each other, so the tail is under strain, like a compressed spring. Breaking the bond to the LAST (terminal) phosphate lets that strain relax and releases usable energy. The energy is in the crowded arrangement, not stored inside the bond like liquid in a bottle.` },
    { loId: 'bio.atp-and-energy', content: `THE ATP ⇄ ADP CYCLE — ATP → ADP + phosphate + energy powers cellular work. Running it backward, ADP + phosphate + energy → ATP, recharges the molecule. ADP is not waste; it is the discharged battery waiting to be refilled. The same molecules cycle round and round, thousands of times a day.` },
    { loId: 'bio.atp-and-energy', kind: 'framework', title: 'Currency, not storage', content: `CURRENCY, NOT STORAGE — ATP is SHORT-TERM spending money. A cell holds only a few seconds worth. LONG-TERM energy is stored in GLUCOSE and, over longer spans, in FAT, which pack far more energy per molecule. Cells convert storage into ATP on demand rather than hoarding ATP itself.` },
    { loId: 'bio.atp-and-energy', kind: 'framework', title: 'Autotrophs vs heterotrophs', content: `AUTOTROPHS VS HETEROTROPHS — AUTOTROPHS (plants, algae, some bacteria) make their own food from light or chemicals; HETEROTROPHS (animals, fungi) must eat other organisms to obtain it. Both groups then run cellular respiration to turn that food into ATP — plants respire too, day and night.` },
    { loId: 'bio.atp-and-energy', kind: 'framework', title: 'The big picture', content: `THE BIG PICTURE — PHOTOSYNTHESIS stores energy: light energy is packed into the bonds of C6H12O6, with CO2 and H2O as the raw materials. CELLULAR RESPIRATION releases it: C6H12O6 + O2 → CO2 + H2O + ATP. One deposits into savings, the other withdraws into spending money.` },
    { loId: 'bio.atp-and-energy', kind: 'framework', title: 'Never 100 percent efficient', content: `NEVER 100 PERCENT EFFICIENT — every energy transformation loses some energy as HEAT. Cellular respiration captures only about 40 percent of glucose energy as ATP; the rest warms you, which is exactly why your body is warmer than the room. Energy is not destroyed, but the escaped heat is no longer usable for work.` },
    { loId: 'bio.atp-and-energy', kind: 'framework', title: 'Why it flows one way', content: `WHY IT FLOWS ONE WAY — because each transfer sheds heat, energy FLOWS through an ecosystem (sunlight → producers → consumers → heat) rather than cycling like matter. That is why food chains run short: only a small fraction of energy makes it to the next level.` },
    { loId: 'bio.atp-and-energy', kind: 'definition', title: 'ATP', content: 'adenosine triphosphate — the short-term energy currency cells spend to do work.' },
    { loId: 'bio.atp-and-energy', kind: 'definition', title: 'ADP', content: `adenosine diphosphate — the two-phosphate, discharged form of ATP, ready to be recharged.` },
    { loId: 'bio.atp-and-energy', kind: 'definition', title: 'autotroph', content: 'an organism that makes its own food, such as a plant using photosynthesis.' },
    { loId: 'bio.atp-and-energy', kind: 'definition', title: 'heterotroph', content: 'an organism that must consume other organisms to obtain food energy.' },
  ],
  methods: [
    {
      title: 'Worked recharge cycle',
      steps: [
        `Start with the structure: ATP is adenine + ribose + three phosphates in a row. Spending it means breaking off the terminal (third) phosphate.`,
        `Write the reaction: ATP → ADP + phosphate + energy. The molecule left behind is ADP, which still has adenine, ribose, and two phosphates.`,
        `Account for the energy: the three negatively charged phosphates were repelling one another. Removing the last one relieves that strain, and the released energy drives the contraction.`,
        `Recharge to reuse: the cell runs the reaction backward — ADP + phosphate + energy → ATP — using energy harvested from food by cellular respiration. Only then can that molecule be spent again.`,
      ],
      example: { problem: `A muscle cell spends an ATP molecule to power a contraction. Name what the ATP becomes, where the released energy came from, and what has to happen before that same molecule can be spent again.`, solution: `It becomes ADP plus a free phosphate. The energy came from relieving the repulsion among the crowded phosphates. Cellular respiration must reattach a phosphate to ADP before the molecule can be spent again.` },
      relatedLoIds: ['bio.atp-and-energy'],
    },
    {
      title: 'Worked storage vs currency',
      steps: [
        `Separate the two jobs: ATP is spending money for immediate work; glucose and fat are savings accounts for the long term.`,
        `Compare capacity: one fat or glucose molecule holds far more energy than one ATP, so storing the same energy as ATP would take an enormous number of molecules — an impossible bulk for a cell.`,
        `Check stability and turnover: ATP is unstable and is spent within seconds of being made. A cell holds only a few seconds worth at a time and simply keeps recharging ADP as needed.`,
        `State the correct plan: the organism stores fat, then converts it to ATP on demand through cellular respiration all winter. The ATP pool stays small the whole time — it is a shuttle, not a warehouse.`,
      ],
      example: { problem: `A student reasons: "ATP is the energy molecule, so an organism preparing for a long winter should build up a big reserve of ATP." Explain why cells store fat and glucose instead, and what would actually go wrong with the ATP plan.`, solution: `Fat and glucose are the long-term stores because they hold far more energy per molecule and are stable; ATP is unstable, held in tiny amounts, and continuously regenerated from ADP as it is spent.` },
      relatedLoIds: ['bio.atp-and-energy'],
    },
  ],
  pointers: [
    { content: `The MOLECULES cycle; the ENERGY does not. Every transfer leaks some energy as heat, which escapes the cell and can no longer do work — cellular respiration captures only about 40 percent of glucose energy as ATP. So the cycle needs a constant fresh supply of energy from food, and ultimately from sunlight. Energy is conserved but degraded, which is why it FLOWS through living systems rather than cycling within them.`, kind: 'common-error' },
    { content: `ATP = adenine + ribose + three phosphates. Breaking off the terminal phosphate releases usable energy.`, kind: 'tip' },
    { content: `The cycle: ATP → ADP + phosphate + energy to spend; ADP + phosphate + energy → ATP to recharge.`, kind: 'tip' },
    { content: `ATP is short-term currency held for seconds; glucose and fat are the long-term storage molecules.`, kind: 'tip' },
    { content: `Autotrophs make their own food, heterotrophs eat it — but BOTH run cellular respiration to make ATP.`, kind: 'tip' },
    { content: `Photosynthesis stores energy in C6H12O6; cellular respiration releases it as ATP.`, kind: 'tip' },
    { content: `No transformation is 100 percent efficient — heat escapes each time, so energy flows one way through living systems.`, kind: 'tip' },
    { content: `Don't say the energy is "stored in the phosphate bond" like liquid in a bottle. The energy comes from RELIEVING the repulsion among three crowded negative phosphates. Breaking a bond always costs energy; the payoff is in the more stable ADP + phosphate that results.`, kind: 'common-error' },
    { content: `Matter cycles; energy does NOT. ADP and phosphate get reused thousands of times, but the energy driving the recharge must be freshly supplied by food and ultimately sunlight. Saying "the cell recycles energy" is wrong even though energy is conserved.`, kind: 'gotcha' },
    { content: `Plants respire too — day AND night, in every cell. Photosynthesis makes glucose, not ATP for general cellular work. If a question asks how a plant powers growth or transport, the answer is cellular respiration.`, kind: 'gotcha' },
    { content: `Autotroph vs heterotroph is about how an organism GETS food, not about whether it makes ATP. Both make ATP the same way. Also, fungi are heterotrophs, not plants — they absorb food rather than photosynthesize.`, kind: 'vocab-note' },
    { content: `ADP is not waste or a "used-up" molecule — it's the discharged battery. Never write ATP → energy alone; the products are ADP + a free phosphate + energy, and the phosphate must be named.`, kind: 'common-error' },
    { content: `"Cells make lots of ATP to store energy" is a trap. ATP is unstable and lasts seconds; a cell holds only a few seconds' worth. Long-term storage = glucose, then fat. Stockpiling ATP would take an impossible number of molecules.`, kind: 'common-error' },
    { content: `"Lost as heat" doesn't mean destroyed. The energy still exists — it's just dispersed and can no longer do work. Say "no longer usable," not "disappears," when explaining the ~40% efficiency of respiration.`, kind: 'vocab-note' },
    { content: `Read the prefix: TRI-phosphate = 3, DI-phosphate = 2. Only the TERMINAL (third) phosphate comes off during normal spending — the adenine and ribose stay attached the whole time and are never released.`, kind: 'tip' },
  ],
};
