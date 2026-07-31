/**
 * Biology — Cell Division: Cell Cycle Regulation, Checkpoints & Cancer.
 *
 * The control-system companion to the mitosis lesson (NGSS HS-LS1-4). The
 * mechanics of PMAT are assumed; what this plan teaches is the REGULATION —
 * the checkpoints, the accelerator/brake gene pair, and why cancer is an
 * accumulation of failures rather than a single switch flipping. Nearly every
 * student error here is a "one cause, one effect" simplification, so the
 * concept segment keeps returning to how many things must go wrong.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U4_CELL_CYCLE_REGULATION_CANCER: LessonPlan = {
  id: 'evelyn.hs.bio.cell-cycle-regulation-cancer.v1',
  title: 'Cell Cycle Regulation, Checkpoints & Cancer',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.cell-cycle-regulation-cancer',
      standard: 'BIO-4.2',
      description:
        'Explain how checkpoints, cyclins, proto-oncogenes and tumor suppressor genes regulate the cell cycle, and how accumulated mutations in those controls lead to cancer (NGSS HS-LS1-4).',
    },
  ],
  prerequisites: ['bio.cell-cycle-mitosis'],
  followUps: ['bio.meiosis'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the cell cycle as a machine with brakes, and cancer as what happens when the brakes wear out.',
      script:
        'Your body makes roughly 25 million new cells every second — and almost none of them go wrong. That is the astonishing part. A cell about to divide runs a series of inspections first, and a cell that fails one is either repaired or told to destroy itself. Cancer is not a strange invader; it is one of your own cells that stopped taking the inspections seriously. In this lesson you will learn exactly which inspections exist, what each one checks, and why it usually takes several separate failures — not one — before a tumor ever appears.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-checkpoints-and-control',
      kind: 'concept',
      goal: 'Regulation as the default state: the three checkpoints and what each verifies, the cyclin machinery, apoptosis, and the accelerator/brake gene pair behind cancer.',
      keyIdeas: [
        'THE G1 CHECKPOINT (the "should I?" gate) — a healthy cell does not divide whenever it can; regulation is the default state and uncontrolled division is the failure state. The first inspection comes at the end of G1, before DNA is copied. It verifies that the cell is big enough, that nutrients and growth signals are present, and that the DNA is undamaged. A cell that fails may pause, repair, or exit into G0, a resting state where mature nerve and muscle cells spend their whole lives.',
        'THE G2 CHECKPOINT (the "did I copy it right?" gate) — checked after S phase, before mitosis begins. It verifies that DNA replication actually FINISHED and that the new copies carry no errors. Passing it commits the cell to mitosis.',
        'THE M (SPINDLE) CHECKPOINT (the "are they hooked up?" gate) — checked during metaphase, before the chromatids are pulled apart. It verifies that every chromosome is attached to spindle fibers from BOTH poles. If even one is unattached, anaphase is delayed; otherwise a daughter cell ends up with the wrong number of chromosomes.',
        'CYCLINS DRIVE IT FORWARD — the checkpoints are enforced by proteins called cyclins and their partner enzymes (cyclin-dependent kinases). Cyclin levels RISE and FALL through the cycle; when a particular cyclin builds up past a threshold and the checkpoint conditions are met, the pair switches on and pushes the cell into the next phase. Cyclins are the accelerator pedal being pressed, not a timer running out.',
        'APOPTOSIS IS PROGRAMMED CELL DEATH — a damaged cell that cannot be repaired triggers its own orderly self-destruction and is cleaned up by neighbors. This is a normal, useful process, not an accident: it also sculpts the webbing away from between a developing fetus\'s fingers. Apoptosis is the last line of defense against passing damage on.',
        'ACCELERATOR AND BRAKE — PROTO-ONCOGENES are normal genes that push the cycle forward (the accelerator). A mutation can jam one on, making it an ONCOGENE that shouts "divide" constantly. TUMOR SUPPRESSOR GENES are the brake: they halt the cycle, order repair, or trigger apoptosis. p53, called "the guardian of the genome," is the famous one — it stops a damaged cell at G1 and sends it to repair or to apoptosis. Note the asymmetry: an oncogene is a gas pedal STUCK DOWN, while a broken tumor suppressor is a brake line CUT. Neither one makes a tumor suppressor speed anything up.',
        'CANCER TAKES ACCUMULATED MUTATIONS — one mutation is almost never enough. A cell typically needs SEVERAL independent failures, usually in both accelerator and brake genes, before it divides without limit. That is why cancer risk climbs steeply with age (a lifetime of mutations piling up in the same cell lines) and with carcinogen exposure such as tobacco smoke or UV light (which raises the mutation rate). It is also why cancer is NOT contagious — the mutated cells are your own, not a transmitted pathogen.',
        'BENIGN VS MALIGNANT — a mass of over-dividing cells is a tumor. A BENIGN tumor stays in one place and is usually harmless once removed. A MALIGNANT tumor invades neighboring tissue and can METASTASIZE: cells break away, travel through blood or lymph, and start new tumors elsewhere in the SAME body. Metastasis is spread within one person, which is a different thing entirely from an infection spreading between people.',
      ],
      vocabulary: [
        { term: 'checkpoint', definition: 'a control point in the cell cycle where the cell verifies conditions before continuing.' },
        { term: 'apoptosis', definition: 'programmed cell death — a controlled self-destruct that removes damaged or unneeded cells.' },
        { term: 'tumor suppressor gene', definition: 'a gene such as p53 whose normal job is to halt division, order repair, or trigger apoptosis.' },
        { term: 'metastasis', definition: 'the spread of cancer cells from the original tumor to distant parts of the body.' },
      ],
      suggestedTools: ['show_diagram', 'show_concept_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-which-checkpoint',
      kind: 'worked_example',
      problem:
        'A cell has finished copying its DNA, but one chromosome carries a break that the copying machinery left unrepaired. Which checkpoint should catch this, and what are the cell\'s two possible fates if p53 is working normally?',
      steps: [
        'Place the cell in the cycle. DNA copying happens in S phase, and this cell has just finished S, so it is sitting in G2.',
        'Match the problem to the inspection. The G2 checkpoint is the one that verifies replication finished completely and the new DNA is error-free — so the G2 checkpoint should catch the break.',
        'Ask what the brake does when it detects damage. p53 is a tumor suppressor: it halts the cycle before mitosis and gives repair enzymes time to work.',
        'Name both outcomes. If the break is repaired, the cell passes the checkpoint and enters mitosis normally. If the damage is beyond repair, p53 triggers apoptosis so the broken DNA is never copied into daughter cells.',
      ],
      answer: 'The G2 checkpoint catches it; with p53 working, the cell either pauses and repairs the break, or undergoes apoptosis.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-hits',
      kind: 'worked_example',
      problem:
        'A student claims: "A single UV photon damaged one skin cell\'s p53 gene this morning, so that cell is now cancerous." Walk through why a broken p53 alone does not make a cancer cell, and what else would have to happen.',
      steps: [
        'Say what breaking p53 actually does: it removes a brake. The cell loses its main damage-detector at G1, so it can now enter S phase carrying damage it should have paused to fix.',
        'Notice what is still missing: losing a brake is not the same as pressing the accelerator. The cell still divides only when growth signals and cyclins tell it to, so it is not yet dividing uncontrollably.',
        'Add what a tumor needs. Uncontrolled division usually requires SEVERAL failures accumulating in the same cell line — for example an activated oncogene jamming the accelerator on, a second tumor suppressor knocked out, and a loss of the normal limit on how many times a cell may divide.',
        'Explain the real consequence of the first hit: the broken p53 makes each later mutation more likely to survive uncorrected, so the cell\'s descendants accumulate damage faster. That is why the process usually takes years, and why risk climbs with age and with repeated carcinogen exposure.',
        'Correct the claim: this morning\'s damage is one step down a long road, not the arrival. Most cells with a single damaged gene are repaired, destroyed by apoptosis, or simply carry on dividing normally.',
      ],
      answer: 'Losing p53 removes one brake but does not by itself cause cancer — several accumulated mutations, typically in both proto-oncogenes and tumor suppressors, are needed before a cell divides without control.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-spindle-checkpoint',
      kind: 'try_yourself',
      problem:
        'A cell in metaphase has all of its chromosomes lined up except one, which has not attached to any spindle fiber. A working M (spindle) checkpoint responds how, and why does that response matter?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It triggers immediate DNA replication so the unattached chromosome can be copied again' },
        { id: 'b', text: 'It lets anaphase proceed, because one loose chromosome will drift to a pole on its own' },
        { id: 'c', text: 'It delays anaphase until every chromosome is attached to spindle fibers, so each daughter cell receives the correct chromosome number', correct: true },
        { id: 'd', text: 'It halts the cell in G1, where growth signals and cell size are checked' },
      ],
      expectedAnswer: 'It delays anaphase until every chromosome is attached to spindle fibers, so each daughter cell receives the correct chromosome number',
      hints: [
        'The M checkpoint sits right before the chromatids get pulled apart — ask what would go wrong if the pull happened one moment too early.',
        'An unattached chromosome cannot be dragged to a pole, so one daughter cell would end up short a chromosome and the other with an extra.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-oncogene-vs-suppressor',
      kind: 'try_yourself',
      problem:
        'Using the accelerator-and-brake picture of cell cycle control, which statement correctly describes proto-oncogenes and tumor suppressor genes in a HEALTHY cell?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Proto-oncogenes normally promote division when growth signals call for it; tumor suppressor genes normally halt division, order repair, or trigger apoptosis', correct: true },
        { id: 'b', text: 'Tumor suppressor genes speed the cycle up, while proto-oncogenes slow it down' },
        { id: 'c', text: 'Both are abnormal cancer-causing genes that a healthy cell does not carry at all' },
        { id: 'd', text: 'Proto-oncogenes trigger apoptosis, while tumor suppressor genes copy DNA during S phase' },
      ],
      expectedAnswer: 'Proto-oncogenes normally promote division when growth signals call for it; tumor suppressor genes normally halt division, order repair, or trigger apoptosis',
      hints: [
        'Both gene types are normal parts of every healthy cell — the "onco" in proto-oncogene describes what it can become if mutated, not what it does now.',
        'Sort them by the pedal each one controls: one pushes the cycle forward, the other stops it. p53 is the classic brake.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-chemo-side-effects',
      kind: 'try_yourself',
      problem:
        'Many chemotherapy drugs work by interfering with DNA replication or with spindle fibers, so they damage cells that are dividing rapidly. Patients on these drugs often lose their hair and suffer nausea and digestive problems. What best explains this pattern of side effects?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The drugs are attracted specifically to hair and gut tissue by chemical signals those tissues release' },
        { id: 'b', text: 'Hair follicle and gut lining cells are themselves precancerous, so the drug correctly destroys them' },
        { id: 'c', text: 'The drugs weaken the immune system, and hair loss and nausea are symptoms of the resulting infections' },
        { id: 'd', text: 'Hair follicle cells and the cells lining the gut normally divide very rapidly, so a drug that targets rapidly dividing cells hits them along with the tumor', correct: true },
      ],
      expectedAnswer: 'Hair follicle cells and the cells lining the gut normally divide very rapidly, so a drug that targets rapidly dividing cells hits them along with the tumor',
      hints: [
        'The drug cannot tell a cancer cell from a healthy cell — it can only tell a dividing cell from a resting one.',
        'Ask which healthy tissues replace themselves fastest: hair grows continuously and the gut lining is rebuilt every few days.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-mutation-causes-cancer',
      kind: 'misconception_check',
      question:
        'A student says: "Cancer happens when a cell gets one bad mutation — and since it spreads through the body, you can catch it from someone who has it." What went wrong, in both halves of that claim?',
      commonErrors: [
        {
          answer: 'One mutation causes cancer, and cancer is contagious because it spreads',
          misconception:
            'Compressing a multi-step accumulation into a single event, and confusing metastasis (spread WITHIN one body) with transmission (spread BETWEEN bodies, which is what infectious disease means).',
          correctsTo:
            'Cancer almost always requires SEVERAL accumulated mutations in the same cell line — typically a jammed-on proto-oncogene plus one or more knocked-out tumor suppressors such as p53 — which is why risk rises with age and with carcinogen exposure. And the "spread" in cancer is METASTASIS: cells break away from the original tumor and travel to other tissues in the SAME person. They are that person\'s own cells, not a pathogen, so cancer cannot be passed to anyone else by contact.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three checkpoints: G1 checks size, nutrients, growth signals and DNA damage before copying; G2 checks that replication finished correctly before mitosis; M (spindle) checks that every chromosome is attached to both poles before anaphase.',
        'Cyclins and their partner kinases rise and fall to push the cell from phase to phase — the accelerator being pressed, not a clock running down.',
        'Apoptosis is programmed cell death: a normal, orderly self-destruct for cells too damaged to repair.',
        'Proto-oncogenes are the accelerator (mutated and jammed on, they become oncogenes); tumor suppressor genes such as p53 are the brake. Tumor suppressors never speed the cycle up.',
        'Cancer takes ACCUMULATED mutations, usually several and usually in both accelerator and brake genes — hence rising risk with age and with carcinogens, and hence not contagious.',
        'A benign tumor stays put; a malignant one invades neighboring tissue and can metastasize to distant sites. Chemotherapy targets rapidly dividing cells, which is why it also hits hair follicles and the gut lining.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Cell Cycle Regulation, Checkpoints & Cancer' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
