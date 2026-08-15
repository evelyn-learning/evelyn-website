/**
 * Biology — Unit 2 CED 2.2: Organelles & Their Functions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.organelles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U2_ORGANELLES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.organelles.v1',
  course: 'Biology',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Organelles & Their Functions',
  planId: 'evelyn.hs.bio.organelles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.organelles.v1' }],
  theory: [
    { loId: 'bio.organelles', kind: 'framework', title: 'Compartments exist for a reason', content: `COMPARTMENTS EXIST FOR A REASON — a eukaryotic cell separates jobs into membrane-bound rooms so incompatible chemistry can run at the same time. Digestive enzymes that would shred the cell are sealed inside lysosomes; the same logic explains every organelle on this list.` },
    { loId: 'bio.organelles', content: `THE CONTROL ROOM: NUCLEUS — a double membrane (the nuclear envelope) pierced by pores holds the DNA. DNA never leaves; a messenger RNA copy exits through the pores. The nucleolus inside is where ribosomes are assembled.` },
    { loId: 'bio.organelles', content: `THE WORKERS: RIBOSOMES — tiny non-membrane machines that read mRNA and BUILD protein. FREE ribosomes floating in the cytoplasm make proteins used inside the cell; ribosomes stuck to the rough ER make proteins headed for export or for membranes. Ribosomes build proteins; no other organelle does.` },
    { loId: 'bio.organelles', kind: 'framework', title: 'The secretory pathway, step by step', content: `THE SECRETORY PATHWAY, STEP BY STEP — for a protein that will leave the cell: (1) a ribosome on the ROUGH ER builds it directly into the ER interior; (2) the ROUGH ER folds it and does a first round of tagging; (3) a transport VESICLE buds off and carries it to the GOLGI APPARATUS; (4) the GOLGI modifies, labels and sorts it — the shipping department, not a factory; (5) a secretory vesicle travels out to the CELL MEMBRANE and fuses with it, releasing the protein outside. Learn this as one route, not five facts.` },
    { loId: 'bio.organelles', kind: 'framework', title: 'The support departments', content: `THE SUPPORT DEPARTMENTS — SMOOTH ER has no ribosomes: it builds lipids, stores calcium ions, and breaks down drugs and alcohol (liver cells are packed with it). LYSOSOMES are acidic bags of digestive enzymes that recycle worn-out organelles and broken-down food. VACUOLES store water and materials; in a plant cell one huge central vacuole fills most of the volume and its water pressure is what holds a leaf up — a wilted plant is a plant whose vacuoles emptied.` },
    { loId: 'bio.organelles', content: `THE POWER PLANTS: MITOCHONDRIA — a double membrane whose INNER membrane is folded into deep ridges called CRISTAE. Folding packs enormous membrane area into a small organelle, and the ATP-making machinery sits in that membrane, so more folding means more ATP per organelle. This is the cleanest structure-function pairing in the unit. Mitochondria are in BOTH plant and animal cells; every cell that uses energy needs them.` },
    { loId: 'bio.organelles', kind: 'framework', title: 'The plant-only parts', content: `THE PLANT-ONLY PARTS — CHLOROPLASTS (green, stacked internal membranes, capture light to make sugar) and the rigid CELL WALL of cellulose outside the membrane, which gives shape and protection. Plant cells have chloroplasts IN ADDITION to mitochondria: they make sugar and then still have to burn it.` },
    { loId: 'bio.organelles', content: `THE SCAFFOLDING: CYTOSKELETON — a network of protein filaments and tubes that gives the cell shape, anchors organelles, and acts as the track that vesicles are hauled along. Without it the secretory pathway would have no roads.` },
    { loId: 'bio.organelles', kind: 'definition', title: 'organelle', content: 'a specialized internal compartment or structure of a cell that performs one job.' },
    { loId: 'bio.organelles', kind: 'definition', title: 'vesicle', content: 'a small membrane sac that carries cargo between organelles or out of the cell.' },
    { loId: 'bio.organelles', kind: 'definition', title: 'cristae', content: `the deep folds of the inner mitochondrial membrane that increase the surface area available for making ATP.` },
  ],
  methods: [
    {
      title: 'Worked trace secreted protein',
      steps: [
        `Start in the NUCLEUS: the gene is copied into messenger RNA, and the mRNA leaves through a nuclear pore. The DNA itself stays behind.`,
        `Go to the ROUGH ER: a ribosome bound to its surface reads the mRNA and builds the enzyme directly into the ER interior, where the ER folds it into shape. The destination decides the address — a protein going outside the cell is built on the rough ER, not on a free ribosome.`,
        `Bud off a TRANSPORT VESICLE: a piece of ER membrane pinches off around the enzyme and carries it across the cytoplasm, dragged along cytoskeleton tracks, to the Golgi.`,
        `Pass through the GOLGI APPARATUS: the enzyme is chemically modified, tagged with a shipping label, and packed into a secretory vesicle. Note that the Golgi did not build anything — it finished and addressed what the ER sent.`,
        `Finish at the CELL MEMBRANE: the secretory vesicle fuses with the membrane and the enzyme is released outside the cell, where it travels to the small intestine.`,
      ],
      example: { problem: `A cell in the pancreas makes digestive enzymes and releases them into the small intestine. Trace one enzyme molecule from the gene that codes for it to the moment it leaves the cell, naming every organelle it passes through and what each one does to it.`, solution: `Nucleus (mRNA copy) → ribosome on the rough ER (built and folded) → transport vesicle → Golgi apparatus (modified, labeled, packaged) → secretory vesicle → fuses with the cell membrane and is released.` },
      relatedLoIds: ['bio.organelles'],
    },
    {
      title: 'Worked cristae structure function',
      steps: [
        `Name the structure in question: the folds of the inner mitochondrial membrane are the CRISTAE, and they are the reason a mitochondrion has a double membrane at all.`,
        `Ask what the folds are made of and what sits in them: the protein machinery that actually produces ATP is embedded in the inner membrane, so the amount of ATP-making machinery depends on how much inner membrane there is.`,
        `See what folding does: folding packs far more membrane area into the same outer volume. Cell A therefore has much more inner-membrane surface, and so many more ATP-producing sites, than cell B.`,
        `Correct the prediction: counting mitochondria is not enough, because it counts containers rather than working surface. Cell A makes considerably more ATP — which is exactly why heart and flight-muscle cells have the most heavily folded cristae in the body.`,
      ],
      example: { problem: `Two heart-muscle cells are compared. Cell A has mitochondria whose inner membranes are packed with deep, tightly spaced folds; cell B has mitochondria of the same outer size but with few, shallow folds. A student predicts both cells make the same amount of ATP "because they have the same number of mitochondria." Evaluate the prediction.`, solution: `The prediction is wrong. ATP output tracks inner-membrane surface area, not mitochondrion count, so cell A with its deeper cristae makes far more ATP.` },
      relatedLoIds: ['bio.organelles'],
    },
  ],
  pointers: [
    { content: `Only ribosomes build proteins. On the secretory route the ribosome sits ON the rough ER and builds the protein straight into it, so the rough ER is a folding and processing workshop, not a warehouse. The Golgi then receives that already-built protein and modifies, labels and packages it. The order is fixed and one-way: ribosome on rough ER, then vesicle, then Golgi, then vesicle, then the cell membrane.`, kind: 'common-error' },
    { content: `The secretory pathway is one route, in order: ribosome on the rough ER, transport vesicle, Golgi, secretory vesicle, cell membrane.`, kind: 'tip' },
    { content: `Ribosomes BUILD proteins; the rough ER folds them; the Golgi modifies, labels and ships them. No organelle does another's job.`, kind: 'tip' },
    { content: `Structure predicts function: the folded cristae of the inner mitochondrial membrane pack in surface area, and surface area is where ATP gets made.`, kind: 'tip' },
    { content: `Nucleus stores DNA and exports mRNA; smooth ER makes lipids and detoxifies; lysosomes digest and recycle; vacuoles store and, in plants, hold the cell rigid; the cytoskeleton shapes the cell and carries vesicles.`, kind: 'tip' },
    { content: `Plant cells have chloroplasts, a cell wall and a large central vacuole IN ADDITION to mitochondria — not instead of them.`, kind: 'tip' },
    { content: `Only RIBOSOMES build proteins. The rough ER folds and processes; the Golgi modifies, labels and ships. Never write "the Golgi makes the protein" or "the ER stores it" — those roles are not interchangeable.`, kind: 'common-error' },
    { content: `Say "ribosome ON the rough ER," not "the rough ER makes the protein." The ribosome is a separate, non-membrane structure stuck to the ER surface — that phrasing keeps the two jobs distinct.`, kind: 'vocab-note' },
    { content: `The destination decides where a protein is built: export/membrane proteins start on rough-ER ribosomes; proteins used inside the cytoplasm are made on FREE ribosomes and never enter the ER, Golgi or a vesicle.`, kind: 'edge-case' },
    { content: `Mitochondria are in plant cells too. Chloroplasts make sugar; mitochondria still have to release its energy as ATP. Chloroplasts are IN ADDITION to mitochondria, never instead of them.`, kind: 'gotcha' },
    { content: `ATP output tracks inner-membrane surface area, not mitochondrion count. When comparing cells, look at how deep and tightly packed the CRISTAE are — counting containers isn't counting working surface.`, kind: 'common-error' },
    { content: `Cristae = folds of the INNER mitochondrial membrane only. Don't call the outer membrane, the stacked membranes of a chloroplast, or ER folds "cristae."`, kind: 'vocab-note' },
    { content: `DNA never leaves the nucleus — an mRNA copy exits through the nuclear pores. Writing "the DNA goes to the ribosome" breaks the whole pathway at step one.`, kind: 'gotcha' },
    { content: `Self-check when identifying a mystery cell: lots of rough ER + big Golgi + vesicles at the membrane = a secretor; masses of smooth ER = lipid-making or detox (liver); packed cristae = high energy demand.`, kind: 'tip' },
  ],
};
