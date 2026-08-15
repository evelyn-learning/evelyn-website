/**
 * Biology — Cells: Cell Theory & the Two Cell Types.
 *
 * The concept/process template applied to the unit's organizing idea
 * (NGSS HS-LS1-2). Nearly every error here is a subtraction error: students
 * hear "prokaryotes have no nucleus" and quietly delete DNA, ribosomes or the
 * membrane along with it, so the concept segment states what stays as loudly
 * as what goes.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U2_CELL_THEORY_TYPES: LessonPlan = {
  id: 'evelyn.hs.bio.cell-theory-types.v1',
  title: 'Cell Theory: Prokaryotic & Eukaryotic Cells',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.cell-theory-types',
      standard: 'BIO-2.1',
      description:
        'State the three tenets of cell theory and the observations that built them, and distinguish prokaryotic from eukaryotic cells (and plant from animal cells) by the structures each one has, including why surface-area-to-volume ratio keeps cells small (NGSS HS-LS1-2).',
    },
  ],
  prerequisites: ['bio.enzymes'],
  followUps: ['bio.organelles'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame cell theory as a hard-won claim about where living things come from, and cell size as a physical limit you can feel.',
      script:
        'For two thousand years people believed maggots simply appeared in meat and mice grew out of damp grain. It took a lens, a cork shaving and about two centuries of argument to replace that with one sentence: every cell comes from another cell. That sentence is why a doctor can say an infection was caught, not spontaneously generated. And it comes with a strange size rule — you are made of trillions of cells instead of a few huge ones, and by the end of this lesson you will know exactly what physical limit forces that.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cell-theory-and-types',
      kind: 'concept',
      goal: 'The three tenets and their history, the prokaryote/eukaryote split, plant vs animal differences, and the size limit set by surface-area-to-volume ratio.',
      keyIdeas: [
        'THE THREE TENETS — (1) all living things are made of one or more cells; (2) the cell is the basic unit of structure and function in life; (3) all cells come from pre-existing cells. Tenet 3 is the one that killed spontaneous generation.',
        'WHO BUILT IT — Hooke (1665) looked at cork through a lens, saw empty boxes and named them "cells" (he was seeing dead cell walls). Leeuwenhoek (1670s) was first to see LIVING single-celled organisms, his "animalcules". Schleiden (1838, plants) and Schwann (1839, animals) generalized to all life. Virchow (1855) added tenet 3: every cell from a cell.',
        'THE ONE BIG SPLIT — PROKARYOTIC cells (bacteria and archaea) have NO nucleus and NO membrane-bound organelles; their DNA sits loose in a region called the nucleoid. EUKARYOTIC cells (animals, plants, fungi, protists) enclose their DNA in a true nucleus and run many membrane-bound organelles.',
        'WHAT PROKARYOTES STILL HAVE (the classic error zone) — no nucleus does NOT mean no DNA. A prokaryote has a full genome, plus ribosomes (smaller ones, not membrane-bound, so they are allowed), a cell membrane, cytoplasm and usually a cell wall. What it lacks is compartments, not contents.',
        'DNA SHAPE AND SIZE — prokaryotic DNA is typically ONE circular chromosome; eukaryotic DNA is multiple LINEAR chromosomes wound on proteins. Prokaryotes run about 1 to 10 micrometers across; eukaryotes about 10 to 100 micrometers, roughly ten times wider and so vastly larger in volume.',
        'WHY COMPARTMENTS PAY — membranes let a eukaryote run reactions that would wreck each other side by side: digestive enzymes stay sealed in a lysosome, ATP production is concentrated inside a mitochondrion. That is the whole point of being eukaryotic.',
        'PLANT VS ANIMAL — both are eukaryotic, so both have a nucleus, mitochondria, ribosomes and a cell membrane. PLANT cells add a rigid cell wall of cellulose, chloroplasts for photosynthesis, and one LARGE central vacuole whose water pressure holds the plant up. ANIMAL cells have no wall and no chloroplasts, keep only small vacuoles, and have centrioles. Note plants have mitochondria too — they do not run on chloroplasts alone.',
        'WHY CELLS STAY SMALL — a cell takes in food and dumps waste through its SURFACE, but the volume it must supply is the inside. Double the radius and surface area goes up about 4 times while volume goes up about 8 times, so the surface-area-to-volume RATIO falls. Past a certain size the membrane cannot service the interior fast enough, so cells divide instead of growing — and cells that need high exchange (like an intestinal cell) fold their surface into microvilli to raise the ratio back up.',
      ],
      vocabulary: [
        { term: 'prokaryote', definition: 'a cell with no membrane-bound nucleus and no membrane-bound organelles; bacteria and archaea.' },
        { term: 'nucleoid', definition: 'the region of a prokaryotic cell where the circular chromosome sits, not enclosed by a membrane.' },
        { term: 'surface-area-to-volume ratio', definition: 'the amount of membrane available per unit of interior; it shrinks as a cell grows, which caps cell size.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_table', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-mystery-cell',
      kind: 'worked_example',
      problem:
        'A lab report describes a mystery cell: about 4 micrometers across, no nucleus visible, a single circular chromosome loose in the cytoplasm, thousands of ribosomes, a cell membrane and a cell wall, and no mitochondria. Is it prokaryotic or eukaryotic, plant or animal — and where does it make its ATP?',
      steps: [
        'Check the deciding feature first: is the DNA enclosed in a nucleus? No — the chromosome is loose in the cytoplasm. That alone makes it prokaryotic.',
        'Confirm with the supporting evidence: a single CIRCULAR chromosome, no membrane-bound organelles, and a size of 4 micrometers all sit in the prokaryotic range of about 1 to 10 micrometers.',
        'Rule out the plant/animal question: plant and animal are both categories of EUKARYOTE, so a prokaryotic cell is neither. The cell wall is not evidence for "plant" here — bacteria have walls too, made of different material than cellulose.',
        'Handle the missing mitochondria: prokaryotes never have them. They carry out cellular respiration using enzymes built into the cell membrane itself, so ATP is made at the membrane rather than in an organelle.',
      ],
      answer: 'Prokaryotic (a bacterium) — neither plant nor animal, since both of those are eukaryotic; it makes ATP using its cell membrane instead of mitochondria.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-size-limit',
      kind: 'worked_example',
      problem:
        'A student argues that a cell could just keep growing to any size it wants, since a bigger cell has more membrane to feed itself with. Use a cube-shaped model cell 1 unit on a side, then one 2 units on a side, to show why that fails.',
      steps: [
        'Set up the small cube: surface area is 6 times 1 times 1 = 6 square units, and volume is 1 times 1 times 1 = 1 cubic unit. The surface-area-to-volume ratio is 6 to 1.',
        'Set up the big cube: surface area is 6 times 2 times 2 = 24 square units, and volume is 2 times 2 times 2 = 8 cubic units. The ratio is 24 to 8, which is 3 to 1.',
        'Compare honestly: the student is right that surface area grew — it went from 6 to 24, four times bigger. But volume grew EIGHT times, so the membrane available per unit of interior was cut in half.',
        'Read the biology off the numbers: nutrients in, waste out and signals across all pass through the surface, while the demand comes from the volume. As the ratio falls the interior starves, so cells divide rather than keep growing — and cells needing extra exchange fold their membrane into microvilli to push the ratio back up.',
      ],
      answer: 'The ratio drops from 6:1 to 3:1 — volume outgrows surface area, so a bigger cell has LESS membrane per unit of interior, which is why cells stay small and divide.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-prokaryote-contents',
      kind: 'try_yourself',
      problem:
        'A bacterium is examined at high magnification. Which statement about what it contains is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It has no DNA, because it has no nucleus to store DNA in' },
        { id: 'b', text: 'It has DNA and ribosomes, but no nucleus and no membrane-bound organelles', correct: true },
        { id: 'c', text: 'It has no ribosomes, because ribosomes are made in the nucleolus of a nucleus' },
        { id: 'd', text: 'It has a nucleus but no other membrane-bound organelles' },
      ],
      expectedAnswer: 'It has DNA and ribosomes, but no nucleus and no membrane-bound organelles',
      hints: [
        'Separate two different claims: "no compartment for the DNA" is not the same as "no DNA".',
        'Ribosomes are not wrapped in a membrane, so nothing about the prokaryotic rule forbids them — and a cell with no DNA and no ribosomes could not build a single protein.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plant-vs-animal',
      kind: 'try_yourself',
      problem:
        'A eukaryotic cell is described as having a nucleus, mitochondria, ribosomes, a rigid outer wall, chloroplasts, and one large fluid-filled compartment taking up most of its interior. Which cell is it, and what does the large compartment do?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A plant cell; the large central vacuole stores water and its pressure keeps the cell firm', correct: true },
        { id: 'b', text: 'An animal cell; the large compartment is a lysosome full of digestive enzymes' },
        { id: 'c', text: 'A prokaryotic cell; the rigid wall shows it is a bacterium' },
        { id: 'd', text: 'A plant cell; the chloroplasts replace mitochondria, so it makes all of its ATP by photosynthesis' },
      ],
      expectedAnswer: 'A plant cell; the large central vacuole stores water and its pressure keeps the cell firm',
      hints: [
        'Two structures on the list appear in plants but not animals — find them first, then decide what the big compartment is.',
        'A wall alone does not mean bacterium, and a plant cell keeps its mitochondria: it still respires the sugar it makes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-size-ratio',
      kind: 'try_yourself',
      problem:
        'Two cube-shaped model cells sit side by side: one is 1 unit on a side, the other is 3 units on a side. Which cell exchanges materials with its surroundings more efficiently per unit of interior, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The 3-unit cell, because it has more total surface area (54 square units versus 6)' },
        { id: 'b', text: 'They are equally efficient, because both are the same cube shape' },
        { id: 'c', text: 'The 3-unit cell, because a larger cell can hold more organelles to do the transporting' },
        { id: 'd', text: 'The 1-unit cell, because its surface-area-to-volume ratio is 6 to 1 while the larger cell drops to 2 to 1', correct: true },
      ],
      expectedAnswer: 'The 1-unit cell, because its surface-area-to-volume ratio is 6 to 1 while the larger cell drops to 2 to 1',
      hints: [
        'Do not compare surface areas on their own — compare each cell\'s surface area against the volume that surface has to serve.',
        'For the 3-unit cube: surface area is 6 times 3 times 3 = 54, volume is 3 times 3 times 3 = 27, so the ratio is 54 to 27.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-simpler-means-missing',
      kind: 'misconception_check',
      question:
        'A student writes: "Prokaryotes are the simple cells, so they have no DNA, no ribosomes and no membrane — that is what makes them different from eukaryotes." What went wrong?',
      commonErrors: [
        {
          answer: 'Prokaryotes have no DNA, no ribosomes and no membrane',
          misconception: 'Turning "simpler" into a blanket subtraction — deleting essential contents along with the missing compartments.',
          correctsTo:
            'The prokaryotic rule removes MEMBRANE-BOUND COMPARTMENTS, not contents. A prokaryote has a full genome (one circular chromosome in the nucleoid), plenty of ribosomes, a cell membrane, cytoplasm and usually a cell wall — it just has no nucleus and no membrane-bound organelles. A cell truly missing DNA, ribosomes and a membrane could not copy itself, build a protein, or stay separate from its surroundings, so it could not be alive at all.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cell theory: all living things are made of cells; the cell is the basic unit of life; all cells come from pre-existing cells (Hooke named them, Leeuwenhoek saw living ones, Schleiden and Schwann generalized, Virchow added tenet 3).',
        'Prokaryote = no nucleus, no membrane-bound organelles, one circular chromosome, about 1-10 micrometers — but it still has DNA, ribosomes and a membrane.',
        'Eukaryote = DNA in a true nucleus, many membrane-bound organelles, linear chromosomes, about 10-100 micrometers.',
        'Plant and animal cells are both eukaryotic; plants add a cellulose cell wall, chloroplasts and a large central vacuole, and still keep their mitochondria.',
        'Cells stay small because volume grows faster than surface area: as the surface-area-to-volume ratio falls, the membrane can no longer service the interior, so cells divide.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Cell Theory: Prokaryotic & Eukaryotic Cells' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
