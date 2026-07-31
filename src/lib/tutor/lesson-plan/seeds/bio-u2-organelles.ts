/**
 * Biology — Cell Structure: Organelles & Their Functions.
 *
 * The concept/process template for the HS Biology fan-out (NGSS HS-LS1-2).
 * Organelles are usually taught as a flashcard list, which is exactly why
 * students cannot answer "why" questions about them. This plan is organized
 * around two through-lines instead: the SECRETORY PATHWAY as a single story
 * (ribosome → rough ER → Golgi → vesicle → membrane), and structure-function
 * pairing (folded cristae mean more surface, so more ATP).
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U2_ORGANELLES: LessonPlan = {
  id: 'evelyn.hs.bio.organelles.v1',
  title: 'Organelles & Their Functions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.organelles',
      standard: 'BIO-2.2',
      description:
        'Explain how the major organelles of a eukaryotic cell divide the work of the cell, tracing a protein through the secretory pathway and connecting each organelle\'s structure to the function it performs (NGSS HS-LS1-2).',
    },
  ],
  prerequisites: ['bio.cell-theory-types'],
  followUps: ['bio.cell-membrane-structure'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the cell as a working factory whose departments explain real biology, from insulin to muscle fatigue.',
      script:
        'Every time you eat, cells in your pancreas build insulin, wrap it, ship it, and dump it into your bloodstream — in about an hour, on an assembly line you have never seen. A sprinter\'s leg muscle burns out because a specific organelle runs short. And a child born with one broken recycling compartment can develop a fatal storage disease. A cell is not a bag of parts; it is a factory with departments, and today you learn the floor plan well enough to predict what a cell does just by looking at what it is full of.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-organelle-division-of-labor',
      kind: 'concept',
      goal: 'The secretory pathway as one continuous story, plus the structure-function logic that explains each organelle\'s shape.',
      keyIdeas: [
        'COMPARTMENTS EXIST FOR A REASON — a eukaryotic cell separates jobs into membrane-bound rooms so incompatible chemistry can run at the same time. Digestive enzymes that would shred the cell are sealed inside lysosomes; the same logic explains every organelle on this list.',
        'THE CONTROL ROOM: NUCLEUS — a double membrane (the nuclear envelope) pierced by pores holds the DNA. DNA never leaves; a messenger RNA copy exits through the pores. The nucleolus inside is where ribosomes are assembled.',
        'THE WORKERS: RIBOSOMES — tiny non-membrane machines that read mRNA and BUILD protein. FREE ribosomes floating in the cytoplasm make proteins used inside the cell; ribosomes stuck to the rough ER make proteins headed for export or for membranes. Ribosomes build proteins; no other organelle does.',
        'THE SECRETORY PATHWAY, STEP BY STEP — for a protein that will leave the cell: (1) a ribosome on the ROUGH ER builds it directly into the ER interior; (2) the ROUGH ER folds it and does a first round of tagging; (3) a transport VESICLE buds off and carries it to the GOLGI APPARATUS; (4) the GOLGI modifies, labels and sorts it — the shipping department, not a factory; (5) a secretory vesicle travels out to the CELL MEMBRANE and fuses with it, releasing the protein outside. Learn this as one route, not five facts.',
        'THE SUPPORT DEPARTMENTS — SMOOTH ER has no ribosomes: it builds lipids, stores calcium ions, and breaks down drugs and alcohol (liver cells are packed with it). LYSOSOMES are acidic bags of digestive enzymes that recycle worn-out organelles and broken-down food. VACUOLES store water and materials; in a plant cell one huge central vacuole fills most of the volume and its water pressure is what holds a leaf up — a wilted plant is a plant whose vacuoles emptied.',
        'THE POWER PLANTS: MITOCHONDRIA — a double membrane whose INNER membrane is folded into deep ridges called CRISTAE. Folding packs enormous membrane area into a small organelle, and the ATP-making machinery sits in that membrane, so more folding means more ATP per organelle. This is the cleanest structure-function pairing in the unit. Mitochondria are in BOTH plant and animal cells; every cell that uses energy needs them.',
        'THE PLANT-ONLY PARTS — CHLOROPLASTS (green, stacked internal membranes, capture light to make sugar) and the rigid CELL WALL of cellulose outside the membrane, which gives shape and protection. Plant cells have chloroplasts IN ADDITION to mitochondria: they make sugar and then still have to burn it.',
        'THE SCAFFOLDING: CYTOSKELETON — a network of protein filaments and tubes that gives the cell shape, anchors organelles, and acts as the track that vesicles are hauled along. Without it the secretory pathway would have no roads.',
      ],
      vocabulary: [
        { term: 'organelle', definition: 'a specialized internal compartment or structure of a cell that performs one job.' },
        { term: 'vesicle', definition: 'a small membrane sac that carries cargo between organelles or out of the cell.' },
        { term: 'cristae', definition: 'the deep folds of the inner mitochondrial membrane that increase the surface area available for making ATP.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_concept_map', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-secreted-protein',
      kind: 'worked_example',
      problem:
        'A cell in the pancreas makes digestive enzymes and releases them into the small intestine. Trace one enzyme molecule from the gene that codes for it to the moment it leaves the cell, naming every organelle it passes through and what each one does to it.',
      steps: [
        'Start in the NUCLEUS: the gene is copied into messenger RNA, and the mRNA leaves through a nuclear pore. The DNA itself stays behind.',
        'Go to the ROUGH ER: a ribosome bound to its surface reads the mRNA and builds the enzyme directly into the ER interior, where the ER folds it into shape. The destination decides the address — a protein going outside the cell is built on the rough ER, not on a free ribosome.',
        'Bud off a TRANSPORT VESICLE: a piece of ER membrane pinches off around the enzyme and carries it across the cytoplasm, dragged along cytoskeleton tracks, to the Golgi.',
        'Pass through the GOLGI APPARATUS: the enzyme is chemically modified, tagged with a shipping label, and packed into a secretory vesicle. Note that the Golgi did not build anything — it finished and addressed what the ER sent.',
        'Finish at the CELL MEMBRANE: the secretory vesicle fuses with the membrane and the enzyme is released outside the cell, where it travels to the small intestine.',
      ],
      answer:
        'Nucleus (mRNA copy) → ribosome on the rough ER (built and folded) → transport vesicle → Golgi apparatus (modified, labeled, packaged) → secretory vesicle → fuses with the cell membrane and is released.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cristae-structure-function',
      kind: 'worked_example',
      problem:
        'Two heart-muscle cells are compared. Cell A has mitochondria whose inner membranes are packed with deep, tightly spaced folds; cell B has mitochondria of the same outer size but with few, shallow folds. A student predicts both cells make the same amount of ATP "because they have the same number of mitochondria." Evaluate the prediction.',
      steps: [
        'Name the structure in question: the folds of the inner mitochondrial membrane are the CRISTAE, and they are the reason a mitochondrion has a double membrane at all.',
        'Ask what the folds are made of and what sits in them: the protein machinery that actually produces ATP is embedded in the inner membrane, so the amount of ATP-making machinery depends on how much inner membrane there is.',
        'See what folding does: folding packs far more membrane area into the same outer volume. Cell A therefore has much more inner-membrane surface, and so many more ATP-producing sites, than cell B.',
        'Correct the prediction: counting mitochondria is not enough, because it counts containers rather than working surface. Cell A makes considerably more ATP — which is exactly why heart and flight-muscle cells have the most heavily folded cristae in the body.',
      ],
      answer:
        'The prediction is wrong. ATP output tracks inner-membrane surface area, not mitochondrion count, so cell A with its deeper cristae makes far more ATP.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-golgi-role',
      kind: 'try_yourself',
      problem:
        'A protein has just been folded inside the rough ER and is about to be shipped out of the cell. What does the Golgi apparatus do to it next?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It builds the protein from amino acids, since the Golgi is where protein synthesis happens' },
        { id: 'b', text: 'It modifies, labels and packages the protein into a vesicle for delivery', correct: true },
        { id: 'c', text: 'It digests the protein with enzymes so its parts can be recycled' },
        { id: 'd', text: 'It copies the gene for the protein so more copies can be made' },
      ],
      expectedAnswer: 'It modifies, labels and packages the protein into a vesicle for delivery',
      hints: [
        'Which organelle already BUILT the protein? The Golgi comes after that step, so it cannot be doing the same job.',
        'Think of the Golgi as the shipping department: it finishes, addresses and boxes up what the factory floor produced.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mitochondria-in-plants',
      kind: 'try_yourself',
      problem:
        'A student examines a leaf cell and finds chloroplasts, a cell wall, and a large central vacuole. Would you also expect to find mitochondria in this cell, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No — plants have chloroplasts instead of mitochondria, so the two never appear together' },
        { id: 'b', text: 'No — the cell wall supplies the plant cell with energy, so mitochondria are unnecessary' },
        { id: 'c', text: 'Yes — but only because the chloroplasts stop working at night, when mitochondria take over their job of making sugar' },
        { id: 'd', text: 'Yes — plant cells still have to release energy from the sugar they make, and that is the mitochondria\'s job', correct: true },
      ],
      expectedAnswer: 'Yes — plant cells still have to release energy from the sugar they make, and that is the mitochondria\'s job',
      hints: [
        'Making a fuel and burning a fuel are two different jobs. Which organelle does each one?',
        'Chloroplasts store energy in sugar; something still has to convert that sugar into usable ATP, day and night.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cell-identity-from-organelles',
      kind: 'try_yourself',
      problem:
        'A researcher describes an unlabeled animal cell: its cytoplasm is crowded with rough ER, it has an unusually large Golgi apparatus, and it is full of vesicles clustered near the cell membrane. What is this cell most likely specialized to do?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Secrete large amounts of protein, such as a hormone or a digestive enzyme', correct: true },
        { id: 'b', text: 'Store starch and water for the organism, like a storage cell in a root' },
        { id: 'c', text: 'Contract repeatedly and rapidly, like a muscle cell during exercise' },
        { id: 'd', text: 'Carry out photosynthesis at a high rate, like a cell in a sunlit leaf' },
      ],
      expectedAnswer: 'Secrete large amounts of protein, such as a hormone or a digestive enzyme',
      hints: [
        'List the route those three structures belong to, in order. What pathway are rough ER, Golgi and vesicles all part of?',
        'An organelle is abundant when the cell does a lot of that job — here the entire export assembly line is enlarged.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-organelles-as-list',
      kind: 'misconception_check',
      question:
        'A student writes: "The ribosome makes the protein, and then the Golgi makes it again but better, and the rough ER just stores proteins until the Golgi needs them." What went wrong?',
      commonErrors: [
        {
          answer: 'The Golgi makes proteins and the rough ER is a storage room',
          misconception:
            'Memorizing organelles as an unordered list of nouns, so their ROLES get swapped and the one-way order of the secretory pathway disappears.',
          correctsTo:
            'Only ribosomes build proteins. On the secretory route the ribosome sits ON the rough ER and builds the protein straight into it, so the rough ER is a folding and processing workshop, not a warehouse. The Golgi then receives that already-built protein and modifies, labels and packages it. The order is fixed and one-way: ribosome on rough ER, then vesicle, then Golgi, then vesicle, then the cell membrane.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The secretory pathway is one route, in order: ribosome on the rough ER, transport vesicle, Golgi, secretory vesicle, cell membrane.',
        'Ribosomes BUILD proteins; the rough ER folds them; the Golgi modifies, labels and ships them. No organelle does another\'s job.',
        'Structure predicts function: the folded cristae of the inner mitochondrial membrane pack in surface area, and surface area is where ATP gets made.',
        'Nucleus stores DNA and exports mRNA; smooth ER makes lipids and detoxifies; lysosomes digest and recycle; vacuoles store and, in plants, hold the cell rigid; the cytoskeleton shapes the cell and carries vesicles.',
        'Plant cells have chloroplasts, a cell wall and a large central vacuole IN ADDITION to mitochondria — not instead of them.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Organelles & Their Functions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
