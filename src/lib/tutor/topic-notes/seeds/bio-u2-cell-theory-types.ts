/**
 * Biology — Unit 2 CED 2.1: Cell Theory: Prokaryotic & Eukaryotic Cells.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.cell-theory-types.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U2_CELL_THEORY_TYPES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.cell-theory-types.v1',
  course: 'Biology',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Cell Theory: Prokaryotic & Eukaryotic Cells',
  planId: 'evelyn.hs.bio.cell-theory-types.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.cell-theory-types.v1' }],
  theory: [
    { loId: 'bio.cell-theory-types', kind: 'framework', title: 'The three tenets', content: `THE THREE TENETS — (1) all living things are made of one or more cells; (2) the cell is the basic unit of structure and function in life; (3) all cells come from pre-existing cells. Tenet 3 is the one that killed spontaneous generation.` },
    { loId: 'bio.cell-theory-types', kind: 'framework', title: 'Who built it', content: `WHO BUILT IT — Hooke (1665) looked at cork through a lens, saw empty boxes and named them "cells" (he was seeing dead cell walls). Leeuwenhoek (1670s) was first to see LIVING single-celled organisms, his "animalcules". Schleiden (1838, plants) and Schwann (1839, animals) generalized to all life. Virchow (1855) added tenet 3: every cell from a cell.` },
    { loId: 'bio.cell-theory-types', kind: 'framework', title: 'The one big split', content: `THE ONE BIG SPLIT — PROKARYOTIC cells (bacteria and archaea) have NO nucleus and NO membrane-bound organelles; their DNA sits loose in a region called the nucleoid. EUKARYOTIC cells (animals, plants, fungi, protists) enclose their DNA in a true nucleus and run many membrane-bound organelles.` },
    { loId: 'bio.cell-theory-types', content: `WHAT PROKARYOTES STILL HAVE (the classic error zone) — no nucleus does NOT mean no DNA. A prokaryote has a full genome, plus ribosomes (smaller ones, not membrane-bound, so they are allowed), a cell membrane, cytoplasm and usually a cell wall. What it lacks is compartments, not contents.` },
    { loId: 'bio.cell-theory-types', kind: 'framework', title: 'DNA shape and size', content: `DNA SHAPE AND SIZE — prokaryotic DNA is typically ONE circular chromosome; eukaryotic DNA is multiple LINEAR chromosomes wound on proteins. Prokaryotes run about 1 to 10 micrometers across; eukaryotes about 10 to 100 micrometers, roughly ten times wider and so vastly larger in volume.` },
    { loId: 'bio.cell-theory-types', kind: 'framework', title: 'Why compartments pay', content: `WHY COMPARTMENTS PAY — membranes let a eukaryote run reactions that would wreck each other side by side: digestive enzymes stay sealed in a lysosome, ATP production is concentrated inside a mitochondrion. That is the whole point of being eukaryotic.` },
    { loId: 'bio.cell-theory-types', kind: 'framework', title: 'Plant vs animal', content: `PLANT VS ANIMAL — both are eukaryotic, so both have a nucleus, mitochondria, ribosomes and a cell membrane. PLANT cells add a rigid cell wall of cellulose, chloroplasts for photosynthesis, and one LARGE central vacuole whose water pressure holds the plant up. ANIMAL cells have no wall and no chloroplasts, keep only small vacuoles, and have centrioles. Note plants have mitochondria too — they do not run on chloroplasts alone.` },
    { loId: 'bio.cell-theory-types', kind: 'framework', title: 'Why cells stay small', content: `WHY CELLS STAY SMALL — a cell takes in food and dumps waste through its SURFACE, but the volume it must supply is the inside. Double the radius and surface area goes up about 4 times while volume goes up about 8 times, so the surface-area-to-volume RATIO falls. Past a certain size the membrane cannot service the interior fast enough, so cells divide instead of growing — and cells that need high exchange (like an intestinal cell) fold their surface into microvilli to raise the ratio back up.` },
    { loId: 'bio.cell-theory-types', kind: 'definition', title: 'prokaryote', content: `a cell with no membrane-bound nucleus and no membrane-bound organelles; bacteria and archaea.` },
    { loId: 'bio.cell-theory-types', kind: 'definition', title: 'nucleoid', content: `the region of a prokaryotic cell where the circular chromosome sits, not enclosed by a membrane.` },
    { loId: 'bio.cell-theory-types', kind: 'definition', title: 'surface-area-to-volume ratio', content: `the amount of membrane available per unit of interior; it shrinks as a cell grows, which caps cell size.` },
  ],
  methods: [
    {
      title: 'Worked identify mystery cell',
      steps: [
        `Check the deciding feature first: is the DNA enclosed in a nucleus? No — the chromosome is loose in the cytoplasm. That alone makes it prokaryotic.`,
        `Confirm with the supporting evidence: a single CIRCULAR chromosome, no membrane-bound organelles, and a size of 4 micrometers all sit in the prokaryotic range of about 1 to 10 micrometers.`,
        `Rule out the plant/animal question: plant and animal are both categories of EUKARYOTE, so a prokaryotic cell is neither. The cell wall is not evidence for "plant" here — bacteria have walls too, made of different material than cellulose.`,
        `Handle the missing mitochondria: prokaryotes never have them. They carry out cellular respiration using enzymes built into the cell membrane itself, so ATP is made at the membrane rather than in an organelle.`,
      ],
      example: { problem: `A lab report describes a mystery cell: about 4 micrometers across, no nucleus visible, a single circular chromosome loose in the cytoplasm, thousands of ribosomes, a cell membrane and a cell wall, and no mitochondria. Is it prokaryotic or eukaryotic, plant or animal — and where does it make its ATP?`, solution: `Prokaryotic (a bacterium) — neither plant nor animal, since both of those are eukaryotic; it makes ATP using its cell membrane instead of mitochondria.` },
      relatedLoIds: ['bio.cell-theory-types'],
    },
    {
      title: 'Worked size limit',
      steps: [
        `Set up the small cube: surface area is 6 times 1 times 1 = 6 square units, and volume is 1 times 1 times 1 = 1 cubic unit. The surface-area-to-volume ratio is 6 to 1.`,
        `Set up the big cube: surface area is 6 times 2 times 2 = 24 square units, and volume is 2 times 2 times 2 = 8 cubic units. The ratio is 24 to 8, which is 3 to 1.`,
        `Compare honestly: the student is right that surface area grew — it went from 6 to 24, four times bigger. But volume grew EIGHT times, so the membrane available per unit of interior was cut in half.`,
        `Read the biology off the numbers: nutrients in, waste out and signals across all pass through the surface, while the demand comes from the volume. As the ratio falls the interior starves, so cells divide rather than keep growing — and cells needing extra exchange fold their membrane into microvilli to push the ratio back up.`,
      ],
      example: { problem: `A student argues that a cell could just keep growing to any size it wants, since a bigger cell has more membrane to feed itself with. Use a cube-shaped model cell 1 unit on a side, then one 2 units on a side, to show why that fails.`, solution: `The ratio drops from 6:1 to 3:1 — volume outgrows surface area, so a bigger cell has LESS membrane per unit of interior, which is why cells stay small and divide.` },
      relatedLoIds: ['bio.cell-theory-types'],
    },
  ],
  pointers: [
    { content: `The prokaryotic rule removes MEMBRANE-BOUND COMPARTMENTS, not contents. A prokaryote has a full genome (one circular chromosome in the nucleoid), plenty of ribosomes, a cell membrane, cytoplasm and usually a cell wall — it just has no nucleus and no membrane-bound organelles. A cell truly missing DNA, ribosomes and a membrane could not copy itself, build a protein, or stay separate from its surroundings, so it could not be alive at all.`, kind: 'common-error' },
    { content: `Cell theory: all living things are made of cells; the cell is the basic unit of life; all cells come from pre-existing cells (Hooke named them, Leeuwenhoek saw living ones, Schleiden and Schwann generalized, Virchow added tenet 3).`, kind: 'tip' },
    { content: `Prokaryote = no nucleus, no membrane-bound organelles, one circular chromosome, about 1-10 micrometers — but it still has DNA, ribosomes and a membrane.`, kind: 'tip' },
    { content: `Eukaryote = DNA in a true nucleus, many membrane-bound organelles, linear chromosomes, about 10-100 micrometers.`, kind: 'tip' },
    { content: `Plant and animal cells are both eukaryotic; plants add a cellulose cell wall, chloroplasts and a large central vacuole, and still keep their mitochondria.`, kind: 'tip' },
    { content: `Cells stay small because volume grows faster than surface area: as the surface-area-to-volume ratio falls, the membrane can no longer service the interior, so cells divide.`, kind: 'tip' },
    { content: `"No membrane-bound organelles" removes **compartments, not contents**. Prokaryotes still have DNA, ribosomes, cytoplasm, a cell membrane and usually a wall. Ribosomes are allowed because they aren't membrane-bound.`, kind: 'common-error' },
    { content: `A cell wall is NOT evidence for "plant." Bacteria, archaea and fungi have walls too, of different materials (peptidoglycan, chitin) — only plant walls are cellulose. Use the nucleus first, then chloroplasts + large central vacuole for plant.`, kind: 'gotcha' },
    { content: `Plant vs. animal is a question only for eukaryotes. If a cell has no nucleus, the correct answer is "neither" — don't force it into one of those boxes.`, kind: 'edge-case' },
    { content: `Plant cells have mitochondria AND chloroplasts. Chloroplasts capture light energy into sugar; mitochondria still burn that sugar for ATP. Never write "plants use chloroplasts instead of mitochondria."`, kind: 'common-error' },
    { content: `Say "surface-area-to-volume **ratio**," not "surface area." A big cell has MORE total surface area — it just has less per unit of interior. State the ratio (e.g., 6:1 → 3:1) to make the argument work.`, kind: 'vocab-note' },
    { content: `For a cube of side s: SA = 6s², V = s³. Double s and SA ×4 while V ×8 — always compute both, then divide. Don't just say "volume grows faster" without numbers.`, kind: 'tip' },
    { content: `Keep the historians straight: Hooke *named* cells (dead cork walls, 1665), Leeuwenhoek saw the first *living* cells, Schleiden/Schwann generalized to plants/animals, Virchow added "all cells from pre-existing cells" — the tenet that ended spontaneous generation.`, kind: 'vocab-note' },
    { content: `Prokaryotic DNA = one circular chromosome in the **nucleoid** — a region, not an organelle, with no membrane. Don't call it a nucleus or write "nucleoid membrane."`, kind: 'vocab-note' },
  ],
};
