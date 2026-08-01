/**
 * Biology — Unit 3 CED 3.3: Cellular Respiration & Fermentation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.cellular-respiration.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U3_CELLULAR_RESPIRATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.cellular-respiration.v1',
  course: 'Biology',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Cellular Respiration & Fermentation',
  planId: 'evelyn.hs.bio.cellular-respiration.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.cellular-respiration.v1' }],
  theory: [
    { loId: 'bio.cellular-respiration', kind: 'framework', title: 'The overall equation', content: `THE OVERALL EQUATION — C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP. Read it as an unpacking: one high-energy sugar plus oxygen becomes low-energy waste, and the released energy is captured as ATP. ATP is the spendable currency; glucose is the savings account.` },
    { loId: 'bio.cellular-respiration', kind: 'framework', title: 'Where it happens', content: `WHERE IT HAPPENS — stage 1 (glycolysis) runs in the CYTOPLASM. Stage 2 (Krebs cycle) runs in the MITOCHONDRIAL MATRIX, the fluid inside the mitochondrion. Stage 3 (electron transport chain) runs ON THE INNER MITOCHONDRIAL MEMBRANE. Only stage 1 is outside the mitochondrion.` },
    { loId: 'bio.cellular-respiration', content: `STAGE 1: GLYCOLYSIS — splits one glucose (6 carbons) into two pyruvate (3 carbons each). Net yield about 2 ATP, plus NADH. It needs NO oxygen, which is why it is the one stage that keeps running when oxygen runs out.` },
    { loId: 'bio.cellular-respiration', content: `STAGE 2: KREBS CYCLE — pyruvate is broken down in the matrix and every remaining carbon leaves as CO2 — this is the CO2 you exhale. Direct yield is small, about 2 ATP per glucose; the real payload is the loaded electron carriers NADH and FADH2.` },
    { loId: 'bio.cellular-respiration', content: `STAGE 3: ELECTRON TRANSPORT CHAIN — NADH and FADH2 drop their electrons onto the inner membrane, the energy pumps H+ across, and the H+ flowing back through ATP synthase makes about 34 ATP. This is where nearly all the ATP is made, even though stages 1 and 2 did the dismantling.` },
    { loId: 'bio.cellular-respiration', kind: 'framework', title: 'The atp ledger', content: `THE ATP LEDGER — about 2 + about 2 + about 34, so roughly 36-38 ATP per glucose. Say "about": the number varies by cell type and textbook, but the SHAPE never varies — the chain out-earns the other two stages roughly ten to one.` },
    { loId: 'bio.cellular-respiration', kind: 'framework', title: `Oxygen's one job`, content: `OXYGEN'S ONE JOB — oxygen is the FINAL ELECTRON ACCEPTOR at the end of the chain, picking up spent electrons and H+ to become water. It is not consumed in glycolysis or the Krebs cycle at all. Remove oxygen and electrons back up in the chain, the carriers stay loaded, and stages 2 and 3 both jam.` },
    { loId: 'bio.cellular-respiration', content: `ANAEROBIC BACKUP: FERMENTATION — with no oxygen, only glycolysis runs, so the cell nets just 2 ATP per glucose. Fermentation itself makes NO ATP; it only recycles the electron carriers so glycolysis can keep going. Muscle cells run LACTIC ACID fermentation (pyruvate → lactic acid, the sprint burn); yeast runs ALCOHOLIC fermentation (pyruvate → ethanol + CO2, which raises bread and carbonates beer).` },
    { loId: 'bio.cellular-respiration', kind: 'framework', title: 'Respiration is photosynthesis in reverse', content: `RESPIRATION IS PHOTOSYNTHESIS IN REVERSE — photosynthesis runs 6CO2 + 6H2O + light → C6H12O6 + 6O2; respiration runs it backwards. One stores energy in glucose, the other spends it. Plants do BOTH: they photosynthesize in the light and respire around the clock, because plant cells need ATP too.` },
    { loId: 'bio.cellular-respiration', kind: 'definition', title: 'glycolysis', content: `the first stage, in the cytoplasm, that splits glucose into two pyruvate for a net of about 2 ATP.` },
    { loId: 'bio.cellular-respiration', kind: 'definition', title: 'mitochondrial matrix', content: 'the fluid inside the mitochondrion, where the Krebs cycle runs.' },
    { loId: 'bio.cellular-respiration', kind: 'definition', title: 'final electron acceptor', content: `the molecule that takes electrons at the end of the transport chain — oxygen, which becomes water.` },
    { loId: 'bio.cellular-respiration', kind: 'definition', title: 'fermentation', content: `an anaerobic pathway that recycles electron carriers so glycolysis can keep making its 2 ATP.` },
  ],
  methods: [
    {
      title: 'Worked trace carbons',
      steps: [
        `Start the count in the cytoplasm. Glycolysis splits the 6-carbon glucose into two 3-carbon pyruvate molecules. No carbon has left yet — all 6 are still in the cell, now in two pieces.`,
        `Move the pyruvate into the mitochondrial matrix. As pyruvate is prepared and then fed through the Krebs cycle, every one of its carbons is stripped off and released as CO2.`,
        `Add up the carbon leaving: 2 pyruvate carrying 3 carbons each means all 6 carbons exit as 6 CO2, which matches the 6CO2 on the right side of the overall equation. That CO2 diffuses into your blood and you breathe it out.`,
        `Account for the oxygen separately. The O2 you inhaled is never used to break the carbons off; it waits at the end of the electron transport chain on the inner membrane, accepts the spent electrons, and becomes the 6H2O.`,
      ],
      example: { problem: `One glucose molecule from your breakfast is fully broken down with plenty of oxygen available. Follow its 6 carbon atoms: where do they end up, and which stage releases them?`, solution: `All 6 carbons leave as 6 CO2, released in the mitochondrial matrix during pyruvate breakdown and the Krebs cycle — and exhaled. The inhaled O2 ends up as water at the end of the electron transport chain.` },
      relatedLoIds: ['bio.cellular-respiration'],
    },
    {
      title: 'Worked etc blocked',
      steps: [
        `Take the student's reasoning seriously first: stages 1 and 2 do pay out about 2 ATP each, so subtracting only stage 3 does seem to leave about 4.`,
        `Now ask what stages 1 and 2 hand off. Both load electrons onto NADH and FADH2, and the ONLY place those carriers get unloaded is the electron transport chain.`,
        `With the chain blocked, the carriers stay loaded. There is no supply of empty NAD+ coming back, and the Krebs cycle stalls for lack of empty carriers — so its 2 ATP stop too.`,
        `Only glycolysis survives, and only if fermentation steps in to recycle NAD+ on its own. So the cell drops to about 2 ATP per glucose, not 4 — and cells that cannot ferment fast enough die. Blocking the last step of the chain shuts down far more than the last step.`,
      ],
      example: { problem: `A poison blocks the very last step of the electron transport chain, so oxygen can no longer accept electrons. Glycolysis and the Krebs cycle are untouched by the poison. A student predicts the cell will still make about 4 ATP per glucose, since only stage 3 was hit. Why is even that too generous?`, solution: `About 2 ATP, not 4 — the Krebs cycle depends on the chain to empty its electron carriers, so blocking the chain stalls stage 2 as well, leaving only glycolysis.` },
      relatedLoIds: ['bio.cellular-respiration'],
    },
  ],
  pointers: [
    { content: `Plants do BOTH. Photosynthesis stores energy in glucose, but a plant cell still has to spend that energy, and the only way to turn glucose into usable ATP is cellular respiration. Plant cells have mitochondria and respire around the clock, including all night when photosynthesis has stopped. During bright daylight photosynthesis simply runs faster than respiration, so the plant releases O2 on balance — which hides the respiration going on underneath.`, kind: 'common-error' },
    { content: `C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP — glucose is unpacked and the energy is captured as ATP. This is photosynthesis run in reverse, and plants do both.`, kind: 'tip' },
    { content: `Glycolysis: cytoplasm, splits glucose into 2 pyruvate, net about 2 ATP, needs no oxygen.`, kind: 'tip' },
    { content: `Krebs cycle: mitochondrial matrix, releases all 6 carbons as the CO2 you exhale, about 2 ATP plus loaded electron carriers.`, kind: 'tip' },
    { content: `Electron transport chain: inner mitochondrial membrane, about 34 ATP — nearly the whole payout. Total is roughly 36-38 ATP per glucose.`, kind: 'tip' },
    { content: `Oxygen is only the FINAL ELECTRON ACCEPTOR at the end of the chain, becoming water; without it, stages 2 and 3 jam.`, kind: 'tip' },
    { content: `Fermentation makes no ATP itself — it recycles carriers so glycolysis alone can net about 2 ATP: lactic acid in muscle, ethanol and CO2 in yeast.`, kind: 'tip' },
    { content: `Fermentation makes **zero ATP**. Its only job is recycling NADH back to NAD+ so glycolysis can keep running. When asked "how much ATP does fermentation make?", the 2 ATP comes from glycolysis, not from fermentation.`, kind: 'common-error' },
    { content: `Don't say oxygen "breaks apart the glucose" or "burns the sugar." O2 is used at exactly one place — the end of the electron transport chain — where it accepts electrons and H+ to become water. The carbons are stripped off without it.`, kind: 'common-error' },
    { content: `Track which product each reactant becomes: the 6 carbons of glucose exit as **CO2** (Krebs), and the inhaled **O2** ends up as **H2O** (ETC). Inhaled oxygen atoms do not appear in the CO2 you exhale.`, kind: 'gotcha' },
    { content: `Blocking the ETC doesn't just delete 34 ATP. NADH and FADH2 have nowhere to unload, no NAD+ returns, and the Krebs cycle stalls too — so yield drops to about 2, not 4. Downstream blocks back up upstream.`, kind: 'edge-case' },
    { content: `Keep the three addresses straight: glycolysis = **cytoplasm**, Krebs = **mitochondrial matrix** (the fluid), ETC = **inner mitochondrial membrane** (embedded in it, not floating). Only glycolysis happens outside the mitochondrion.`, kind: 'vocab-note' },
    { content: `Plants respire 24/7 in their own mitochondria. Photosynthesis stores energy in glucose; only respiration converts it to spendable ATP. In bright light photosynthesis just outruns respiration, so net O2 is released — the respiration is hidden, not absent.`, kind: 'gotcha' },
    { content: `Pyruvate is not lactic acid or ethanol. Pyruvate is glycolysis's normal 3-carbon product in *every* cell; what happens to it next depends on oxygen — Krebs cycle if present, fermentation product if not.`, kind: 'vocab-note' },
    { content: `Write ATP totals as "about 2, about 2, about 34, roughly 36–38." The exact number varies by cell and textbook, but the shape must not: the ETC out-earns the other two stages by roughly ten to one.`, kind: 'tip' },
  ],
};
