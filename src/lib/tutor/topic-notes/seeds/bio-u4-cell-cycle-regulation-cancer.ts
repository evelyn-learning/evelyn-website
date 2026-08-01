/**
 * Biology — Unit 4 CED 4.2: Cell Cycle Regulation, Checkpoints & Cancer.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.cell-cycle-regulation-cancer.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U4_CELL_CYCLE_REGULATION_CANCER: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.cell-cycle-regulation-cancer.v1',
  course: 'Biology',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Cell Cycle Regulation, Checkpoints & Cancer',
  planId: 'evelyn.hs.bio.cell-cycle-regulation-cancer.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.cell-cycle-regulation-cancer.v1' }],
  theory: [
    { loId: 'bio.cell-cycle-regulation-cancer', content: `THE G1 CHECKPOINT (the "should I?" gate) — a healthy cell does not divide whenever it can; regulation is the default state and uncontrolled division is the failure state. The first inspection comes at the end of G1, before DNA is copied. It verifies that the cell is big enough, that nutrients and growth signals are present, and that the DNA is undamaged. A cell that fails may pause, repair, or exit into G0, a resting state where mature nerve and muscle cells spend their whole lives.` },
    { loId: 'bio.cell-cycle-regulation-cancer', content: `THE G2 CHECKPOINT (the "did I copy it right?" gate) — checked after S phase, before mitosis begins. It verifies that DNA replication actually FINISHED and that the new copies carry no errors. Passing it commits the cell to mitosis.` },
    { loId: 'bio.cell-cycle-regulation-cancer', content: `THE M (SPINDLE) CHECKPOINT (the "are they hooked up?" gate) — checked during metaphase, before the chromatids are pulled apart. It verifies that every chromosome is attached to spindle fibers from BOTH poles. If even one is unattached, anaphase is delayed; otherwise a daughter cell ends up with the wrong number of chromosomes.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'framework', title: 'Cyclins drive it forward', content: `CYCLINS DRIVE IT FORWARD — the checkpoints are enforced by proteins called cyclins and their partner enzymes (cyclin-dependent kinases). Cyclin levels RISE and FALL through the cycle; when a particular cyclin builds up past a threshold and the checkpoint conditions are met, the pair switches on and pushes the cell into the next phase. Cyclins are the accelerator pedal being pressed, not a timer running out.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'framework', title: 'Apoptosis is programmed cell death', content: `APOPTOSIS IS PROGRAMMED CELL DEATH — a damaged cell that cannot be repaired triggers its own orderly self-destruction and is cleaned up by neighbors. This is a normal, useful process, not an accident: it also sculpts the webbing away from between a developing fetus's fingers. Apoptosis is the last line of defense against passing damage on.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'framework', title: 'Accelerator and brake', content: `ACCELERATOR AND BRAKE — PROTO-ONCOGENES are normal genes that push the cycle forward (the accelerator). A mutation can jam one on, making it an ONCOGENE that shouts "divide" constantly. TUMOR SUPPRESSOR GENES are the brake: they halt the cycle, order repair, or trigger apoptosis. p53, called "the guardian of the genome," is the famous one — it stops a damaged cell at G1 and sends it to repair or to apoptosis. Note the asymmetry: an oncogene is a gas pedal STUCK DOWN, while a broken tumor suppressor is a brake line CUT. Neither one makes a tumor suppressor speed anything up.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'framework', title: 'Cancer takes accumulated mutations', content: `CANCER TAKES ACCUMULATED MUTATIONS — one mutation is almost never enough. A cell typically needs SEVERAL independent failures, usually in both accelerator and brake genes, before it divides without limit. That is why cancer risk climbs steeply with age (a lifetime of mutations piling up in the same cell lines) and with carcinogen exposure such as tobacco smoke or UV light (which raises the mutation rate). It is also why cancer is NOT contagious — the mutated cells are your own, not a transmitted pathogen.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'framework', title: 'Benign vs malignant', content: `BENIGN VS MALIGNANT — a mass of over-dividing cells is a tumor. A BENIGN tumor stays in one place and is usually harmless once removed. A MALIGNANT tumor invades neighboring tissue and can METASTASIZE: cells break away, travel through blood or lymph, and start new tumors elsewhere in the SAME body. Metastasis is spread within one person, which is a different thing entirely from an infection spreading between people.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'definition', title: 'checkpoint', content: `a control point in the cell cycle where the cell verifies conditions before continuing.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'definition', title: 'apoptosis', content: `programmed cell death — a controlled self-destruct that removes damaged or unneeded cells.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'definition', title: 'tumor suppressor gene', content: `a gene such as p53 whose normal job is to halt division, order repair, or trigger apoptosis.` },
    { loId: 'bio.cell-cycle-regulation-cancer', kind: 'definition', title: 'metastasis', content: 'the spread of cancer cells from the original tumor to distant parts of the body.' },
  ],
  methods: [
    {
      title: 'Worked which checkpoint',
      steps: [
        `Place the cell in the cycle. DNA copying happens in S phase, and this cell has just finished S, so it is sitting in G2.`,
        `Match the problem to the inspection. The G2 checkpoint is the one that verifies replication finished completely and the new DNA is error-free — so the G2 checkpoint should catch the break.`,
        `Ask what the brake does when it detects damage. p53 is a tumor suppressor: it halts the cycle before mitosis and gives repair enzymes time to work.`,
        `Name both outcomes. If the break is repaired, the cell passes the checkpoint and enters mitosis normally. If the damage is beyond repair, p53 triggers apoptosis so the broken DNA is never copied into daughter cells.`,
      ],
      example: { problem: `A cell has finished copying its DNA, but one chromosome carries a break that the copying machinery left unrepaired. Which checkpoint should catch this, and what are the cell's two possible fates if p53 is working normally?`, solution: `The G2 checkpoint catches it; with p53 working, the cell either pauses and repairs the break, or undergoes apoptosis.` },
      relatedLoIds: ['bio.cell-cycle-regulation-cancer'],
    },
    {
      title: 'Worked two hits',
      steps: [
        `Say what breaking p53 actually does: it removes a brake. The cell loses its main damage-detector at G1, so it can now enter S phase carrying damage it should have paused to fix.`,
        `Notice what is still missing: losing a brake is not the same as pressing the accelerator. The cell still divides only when growth signals and cyclins tell it to, so it is not yet dividing uncontrollably.`,
        `Add what a tumor needs. Uncontrolled division usually requires SEVERAL failures accumulating in the same cell line — for example an activated oncogene jamming the accelerator on, a second tumor suppressor knocked out, and a loss of the normal limit on how many times a cell may divide.`,
        `Explain the real consequence of the first hit: the broken p53 makes each later mutation more likely to survive uncorrected, so the cell's descendants accumulate damage faster. That is why the process usually takes years, and why risk climbs with age and with repeated carcinogen exposure.`,
        `Correct the claim: this morning's damage is one step down a long road, not the arrival. Most cells with a single damaged gene are repaired, destroyed by apoptosis, or simply carry on dividing normally.`,
      ],
      example: { problem: `A student claims: "A single UV photon damaged one skin cell's p53 gene this morning, so that cell is now cancerous." Walk through why a broken p53 alone does not make a cancer cell, and what else would have to happen.`, solution: `Losing p53 removes one brake but does not by itself cause cancer — several accumulated mutations, typically in both proto-oncogenes and tumor suppressors, are needed before a cell divides without control.` },
      relatedLoIds: ['bio.cell-cycle-regulation-cancer'],
    },
  ],
  pointers: [
    { content: `Cancer almost always requires SEVERAL accumulated mutations in the same cell line — typically a jammed-on proto-oncogene plus one or more knocked-out tumor suppressors such as p53 — which is why risk rises with age and with carcinogen exposure. And the "spread" in cancer is METASTASIS: cells break away from the original tumor and travel to other tissues in the SAME person. They are that person's own cells, not a pathogen, so cancer cannot be passed to anyone else by contact.`, kind: 'common-error' },
    { content: `Three checkpoints: G1 checks size, nutrients, growth signals and DNA damage before copying; G2 checks that replication finished correctly before mitosis; M (spindle) checks that every chromosome is attached to both poles before anaphase.`, kind: 'tip' },
    { content: `Cyclins and their partner kinases rise and fall to push the cell from phase to phase — the accelerator being pressed, not a clock running down.`, kind: 'tip' },
    { content: `Apoptosis is programmed cell death: a normal, orderly self-destruct for cells too damaged to repair.`, kind: 'tip' },
    { content: `Proto-oncogenes are the accelerator (mutated and jammed on, they become oncogenes); tumor suppressor genes such as p53 are the brake. Tumor suppressors never speed the cycle up.`, kind: 'tip' },
    { content: `Cancer takes ACCUMULATED mutations, usually several and usually in both accelerator and brake genes — hence rising risk with age and with carcinogens, and hence not contagious.`, kind: 'tip' },
    { content: `A benign tumor stays put; a malignant one invades neighboring tissue and can metastasize to distant sites. Chemotherapy targets rapidly dividing cells, which is why it also hits hair follicles and the gut lining.`, kind: 'tip' },
    { content: `Don't say a mutated tumor suppressor "makes the cell divide faster." A broken tumor suppressor is a **cut brake line** — it removes a stop signal. Only a jammed-on proto-oncogene (now an oncogene) actively pushes division. Use loss-of-function vs. gain-of-function language.`, kind: 'common-error' },
    { content: `"Proto-oncogene" is the NORMAL, healthy gene; "oncogene" is its mutated, stuck-on version. A healthy cell has proto-oncogenes and needs them — never write that a normal cell contains oncogenes.`, kind: 'vocab-note' },
    { content: `Metastasis = spread of a person's own cells WITHIN one body. Transmission = spread between bodies. Cancer metastasizes but is not contagious, because the rogue cells are the patient's own, not a pathogen.`, kind: 'vocab-note' },
    { content: `Match the damage to the right gate: unreplicated or newly broken DNA after S phase → **G2**; damage/size/nutrient problems before copying → **G1**; an unattached chromosome at metaphase → **M (spindle)**. Ask "where in the cycle is the cell right now?" first.`, kind: 'tip' },
    { content: `One mutation ≠ cancer. Losing p53 only means later damage goes uncorrected; you still need several hits in the same cell line, usually in both proto-oncogenes and tumor suppressors. Say "accumulated mutations," not "a mutation."`, kind: 'gotcha' },
    { content: `Apoptosis is a normal, regulated process — not damage, injury, or failure. It sculpts fingers in a fetus and removes irreparable cells. Don't describe it as "the cell dying because it's broken"; it is the cell deliberately killing itself on orders from genes like p53.`, kind: 'gotcha' },
    { content: `Cyclins don't count down like a timer. Their levels RISE past a threshold and then fall; the cyclin–CDK pair only fires if checkpoint conditions are also met. High cyclin plus damaged DNA still means no advance in a healthy cell.`, kind: 'common-error' },
    { content: `Exiting into G0 is not failure or death — mature nerve and muscle cells sit there permanently and are perfectly functional. Don't equate "not dividing" with "damaged" or "about to undergo apoptosis."`, kind: 'edge-case' },
  ],
};
