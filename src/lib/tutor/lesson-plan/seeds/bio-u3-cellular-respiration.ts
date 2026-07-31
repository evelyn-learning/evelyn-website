/**
 * Biology — Cell Energy: Cellular Respiration & Fermentation.
 *
 * The sibling of the photosynthesis plan in Unit 3 (NGSS HS-LS1-7), and the
 * same kind of lesson: three stages, three locations, one running ATP tally.
 * Nearly every student error here is a bookkeeping error about WHERE a stage
 * runs and WHICH stage pays out the ATP, so the concept segment is organized
 * around that ledger.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U3_CELLULAR_RESPIRATION: LessonPlan = {
  id: 'evelyn.hs.bio.cellular-respiration.v1',
  title: 'Cellular Respiration & Fermentation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.cellular-respiration',
      standard: 'BIO-3.3',
      description:
        'Explain how cellular respiration releases the energy stored in glucose, tracing glycolysis, the Krebs cycle and the electron transport chain through their locations and ATP yields, and contrast that with the anaerobic fermentation pathways (NGSS HS-LS1-7).',
    },
  ],
  prerequisites: ['bio.photosynthesis'],
  followUps: ['bio.cell-cycle-mitosis'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame respiration as the reason you breathe, and fermentation as the burn in a sprint.',
      script:
        'Sprint up a flight of stairs and two things happen: you gasp for air, and your legs start to burn. Both are this lesson. The air is for the last step of a process that unpacks the sugar from your breakfast, and the burn shows up the moment that process runs short of oxygen and your cells fall back on a much cheaper backup plan — the same backup plan that makes bread rise and beer ferment. In this lesson you follow one glucose molecule through three stages, and you will be able to say exactly where each stage happens and how much ATP it pays.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-stages',
      kind: 'concept',
      goal: 'The overall equation, the three stages with their locations and ATP yields, oxygen as final electron acceptor, and the anaerobic fallback.',
      keyIdeas: [
        'THE OVERALL EQUATION — C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP. Read it as an unpacking: one high-energy sugar plus oxygen becomes low-energy waste, and the released energy is captured as ATP. ATP is the spendable currency; glucose is the savings account.',
        'WHERE IT HAPPENS — stage 1 (glycolysis) runs in the CYTOPLASM. Stage 2 (Krebs cycle) runs in the MITOCHONDRIAL MATRIX, the fluid inside the mitochondrion. Stage 3 (electron transport chain) runs ON THE INNER MITOCHONDRIAL MEMBRANE. Only stage 1 is outside the mitochondrion.',
        'STAGE 1: GLYCOLYSIS — splits one glucose (6 carbons) into two pyruvate (3 carbons each). Net yield about 2 ATP, plus NADH. It needs NO oxygen, which is why it is the one stage that keeps running when oxygen runs out.',
        'STAGE 2: KREBS CYCLE — pyruvate is broken down in the matrix and every remaining carbon leaves as CO2 — this is the CO2 you exhale. Direct yield is small, about 2 ATP per glucose; the real payload is the loaded electron carriers NADH and FADH2.',
        'STAGE 3: ELECTRON TRANSPORT CHAIN — NADH and FADH2 drop their electrons onto the inner membrane, the energy pumps H+ across, and the H+ flowing back through ATP synthase makes about 34 ATP. This is where nearly all the ATP is made, even though stages 1 and 2 did the dismantling.',
        'THE ATP LEDGER — about 2 + about 2 + about 34, so roughly 36-38 ATP per glucose. Say "about": the number varies by cell type and textbook, but the SHAPE never varies — the chain out-earns the other two stages roughly ten to one.',
        "OXYGEN'S ONE JOB — oxygen is the FINAL ELECTRON ACCEPTOR at the end of the chain, picking up spent electrons and H+ to become water. It is not consumed in glycolysis or the Krebs cycle at all. Remove oxygen and electrons back up in the chain, the carriers stay loaded, and stages 2 and 3 both jam.",
        'ANAEROBIC BACKUP: FERMENTATION — with no oxygen, only glycolysis runs, so the cell nets just 2 ATP per glucose. Fermentation itself makes NO ATP; it only recycles the electron carriers so glycolysis can keep going. Muscle cells run LACTIC ACID fermentation (pyruvate → lactic acid, the sprint burn); yeast runs ALCOHOLIC fermentation (pyruvate → ethanol + CO2, which raises bread and carbonates beer).',
        'RESPIRATION IS PHOTOSYNTHESIS IN REVERSE — photosynthesis runs 6CO2 + 6H2O + light → C6H12O6 + 6O2; respiration runs it backwards. One stores energy in glucose, the other spends it. Plants do BOTH: they photosynthesize in the light and respire around the clock, because plant cells need ATP too.',
      ],
      vocabulary: [
        { term: 'glycolysis', definition: 'the first stage, in the cytoplasm, that splits glucose into two pyruvate for a net of about 2 ATP.' },
        { term: 'mitochondrial matrix', definition: 'the fluid inside the mitochondrion, where the Krebs cycle runs.' },
        { term: 'final electron acceptor', definition: 'the molecule that takes electrons at the end of the transport chain — oxygen, which becomes water.' },
        { term: 'fermentation', definition: 'an anaerobic pathway that recycles electron carriers so glycolysis can keep making its 2 ATP.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_balanced_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-carbons',
      kind: 'worked_example',
      problem:
        'One glucose molecule from your breakfast is fully broken down with plenty of oxygen available. Follow its 6 carbon atoms: where do they end up, and which stage releases them?',
      steps: [
        'Start the count in the cytoplasm. Glycolysis splits the 6-carbon glucose into two 3-carbon pyruvate molecules. No carbon has left yet — all 6 are still in the cell, now in two pieces.',
        'Move the pyruvate into the mitochondrial matrix. As pyruvate is prepared and then fed through the Krebs cycle, every one of its carbons is stripped off and released as CO2.',
        'Add up the carbon leaving: 2 pyruvate carrying 3 carbons each means all 6 carbons exit as 6 CO2, which matches the 6CO2 on the right side of the overall equation. That CO2 diffuses into your blood and you breathe it out.',
        'Account for the oxygen separately. The O2 you inhaled is never used to break the carbons off; it waits at the end of the electron transport chain on the inner membrane, accepts the spent electrons, and becomes the 6H2O.',
      ],
      answer:
        'All 6 carbons leave as 6 CO2, released in the mitochondrial matrix during pyruvate breakdown and the Krebs cycle — and exhaled. The inhaled O2 ends up as water at the end of the electron transport chain.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-etc-blocked',
      kind: 'worked_example',
      problem:
        'A poison blocks the very last step of the electron transport chain, so oxygen can no longer accept electrons. Glycolysis and the Krebs cycle are untouched by the poison. A student predicts the cell will still make about 4 ATP per glucose, since only stage 3 was hit. Why is even that too generous?',
      steps: [
        'Take the student\'s reasoning seriously first: stages 1 and 2 do pay out about 2 ATP each, so subtracting only stage 3 does seem to leave about 4.',
        'Now ask what stages 1 and 2 hand off. Both load electrons onto NADH and FADH2, and the ONLY place those carriers get unloaded is the electron transport chain.',
        'With the chain blocked, the carriers stay loaded. There is no supply of empty NAD+ coming back, and the Krebs cycle stalls for lack of empty carriers — so its 2 ATP stop too.',
        'Only glycolysis survives, and only if fermentation steps in to recycle NAD+ on its own. So the cell drops to about 2 ATP per glucose, not 4 — and cells that cannot ferment fast enough die. Blocking the last step of the chain shuts down far more than the last step.',
      ],
      answer:
        'About 2 ATP, not 4 — the Krebs cycle depends on the chain to empty its electron carriers, so blocking the chain stalls stage 2 as well, leaving only glycolysis.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-locations',
      kind: 'try_yourself',
      problem:
        'A cell is broken open and its mitochondria are removed entirely, leaving the cytoplasm intact and supplied with glucose. Which stage of cellular respiration can still run, and where does it normally take place?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Krebs cycle, which takes place in the cytoplasm' },
        { id: 'b', text: 'Glycolysis, which takes place in the cytoplasm', correct: true },
        { id: 'c', text: 'Glycolysis, which takes place in the mitochondria' },
        { id: 'd', text: 'The electron transport chain, which takes place in the cytoplasm' },
      ],
      expectedAnswer: 'Glycolysis, which takes place in the cytoplasm',
      hints: [
        'Two of the three stages happen inside the mitochondrion. Which one does not?',
        'Glycolysis is the stage that runs in the cytoplasm and needs neither oxygen nor mitochondria.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-atp-yield',
      kind: 'try_yourself',
      problem:
        'A muscle cell sprinting without enough oxygen runs lactic acid fermentation instead of complete aerobic respiration. Roughly how does its ATP yield per glucose compare?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Fermentation yields more, about 38 ATP, versus about 2 ATP for aerobic respiration' },
        { id: 'b', text: 'The two are about equal, roughly 36-38 ATP either way' },
        { id: 'c', text: 'Fermentation yields about 34 ATP, versus about 36-38 ATP for aerobic respiration' },
        { id: 'd', text: 'Fermentation yields only about 2 ATP, versus about 36-38 ATP for aerobic respiration', correct: true },
      ],
      expectedAnswer: 'Fermentation yields only about 2 ATP, versus about 36-38 ATP for aerobic respiration',
      hints: [
        'Without oxygen, which of the three stages is the only one still running — and what is its net payout?',
        'Glycolysis nets about 2 ATP, and fermentation itself makes none; the chain that normally makes about 34 is shut down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-oxygen-role',
      kind: 'try_yourself',
      problem:
        'In aerobic cellular respiration, what does the oxygen you inhale actually do, and what becomes of it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It accepts electrons at the end of the electron transport chain and becomes water', correct: true },
        { id: 'b', text: 'It splits glucose apart during glycolysis and becomes carbon dioxide' },
        { id: 'c', text: 'It carries electrons from the Krebs cycle to the chain and becomes NADH' },
        { id: 'd', text: 'It is built into ATP as the third phosphate and is stored in the cell' },
      ],
      expectedAnswer: 'It accepts electrons at the end of the electron transport chain and becomes water',
      hints: [
        'Oxygen is not used in either of the first two stages — it has exactly one job, at the very end.',
        'Look at the right side of C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP: which product contains the oxygen you inhaled?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plants-only-photosynthesize',
      kind: 'misconception_check',
      question:
        'A student says: "Plants photosynthesize and animals respire — that is the trade. Plants do not do cellular respiration, because they make their own food instead." What went wrong?',
      commonErrors: [
        {
          answer: 'Plants photosynthesize instead of respiring',
          misconception:
            'Treating photosynthesis and respiration as two halves of a division of labor between kingdoms, rather than as two processes a plant cell runs at once — making food is confused with spending it.',
          correctsTo:
            'Plants do BOTH. Photosynthesis stores energy in glucose, but a plant cell still has to spend that energy, and the only way to turn glucose into usable ATP is cellular respiration. Plant cells have mitochondria and respire around the clock, including all night when photosynthesis has stopped. During bright daylight photosynthesis simply runs faster than respiration, so the plant releases O2 on balance — which hides the respiration going on underneath.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP — glucose is unpacked and the energy is captured as ATP. This is photosynthesis run in reverse, and plants do both.',
        'Glycolysis: cytoplasm, splits glucose into 2 pyruvate, net about 2 ATP, needs no oxygen.',
        'Krebs cycle: mitochondrial matrix, releases all 6 carbons as the CO2 you exhale, about 2 ATP plus loaded electron carriers.',
        'Electron transport chain: inner mitochondrial membrane, about 34 ATP — nearly the whole payout. Total is roughly 36-38 ATP per glucose.',
        'Oxygen is only the FINAL ELECTRON ACCEPTOR at the end of the chain, becoming water; without it, stages 2 and 3 jam.',
        'Fermentation makes no ATP itself — it recycles carriers so glycolysis alone can net about 2 ATP: lactic acid in muscle, ethanol and CO2 in yeast.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Cellular Respiration & Fermentation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
