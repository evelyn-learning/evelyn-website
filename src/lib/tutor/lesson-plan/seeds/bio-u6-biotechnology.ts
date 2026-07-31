/**
 * Biology — Biotechnology: PCR, Gel Electrophoresis & Genetic Engineering.
 *
 * The lab-technique template for the HS Biology fan-out (NGSS HS-LS3-2,
 * HS-ETS1-3). Every tool in this unit is a way of CUTTING, COPYING, SORTING
 * or EDITING DNA, and almost every student error is a mix-up about which
 * tool does which job — plus the one inversion that dominates the unit:
 * on a gel, SMALLER fragments travel FARTHER. The concept segment is
 * organized around that job list, and the gel results are described
 * entirely in words so the lesson stays solvable by voice alone.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U6_BIOTECHNOLOGY: LessonPlan = {
  id: 'evelyn.hs.bio.biotechnology.v1',
  title: 'Biotechnology: PCR, Gel Electrophoresis & Genetic Engineering',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.biotechnology',
      standard: 'BIO-6.4',
      description:
        'Explain how restriction enzymes, plasmid vectors, PCR, gel electrophoresis and CRISPR are used to cut, copy, sort and edit DNA, and interpret gel banding patterns and DNA fingerprints to draw conclusions about identity and relatedness (NGSS HS-LS3-2, HS-ETS1-3).',
    },
  ],
  prerequisites: ['bio.mutations'],
  followUps: ['bio.evidence-for-evolution'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame biotechnology as a small set of tools that read, copy and rewrite DNA in the real world.',
      script:
        'A single hair at a crime scene holds far too little DNA to work with — so a lab copies that trace a billion times over in an afternoon, then sorts the pieces by size until a pattern of bands appears that matches exactly one person. The same handful of tools puts human insulin inside bacteria so a diabetic can buy it at a pharmacy, and edits a wheat gene so the crop survives a dry summer. In this lesson you learn what each tool actually does — and how to read the bands on a gel without falling for the one mistake nearly everyone makes first.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-dna-toolkit',
      kind: 'concept',
      goal: 'The four jobs — cut, paste, copy, sort — plus fingerprinting, CRISPR editing, and the ethics conversation around them.',
      keyIdeas: [
        'RESTRICTION ENZYMES — MOLECULAR SCISSORS. Each restriction enzyme cuts DNA only where it finds its own short RECOGNITION SEQUENCE. EcoRI, for example, cuts wherever it reads 5\'-GAATTC-3\'. Different enzyme, different sequence, different cut sites — so the same DNA sample cut with two different enzymes gives two different sets of pieces.',
        'STICKY ENDS — WHY THE CUT MATTERS. Many restriction enzymes cut the two strands unevenly, leaving a short single-stranded overhang called a STICKY END. Two pieces cut by the SAME enzyme have matching overhangs, so they base-pair with each other, and the enzyme DNA ligase seals the joint. This is why the cut is not just destruction: it is what makes DNA from two organisms joinable.',
        'RECOMBINANT DNA AND PLASMID VECTORS. A PLASMID is a small circular DNA loop in bacteria. Cut the plasmid and the human gene with the same restriction enzyme, let the sticky ends pair, seal with ligase, and you have RECOMBINANT DNA — DNA from two sources in one molecule. Put that plasmid back into bacteria and they read the human gene like their own. Human insulin is made exactly this way: engineered bacteria in a tank produce the human protein.',
        'PCR — TARGETED COPYING, NOT READING. The polymerase chain reaction amplifies ONE chosen stretch of DNA. Each cycle has three steps: DENATURE (heat to about 95 C to separate the two strands), ANNEAL (cool to about 55 C so short primers stick to the ends of the target region), EXTEND (about 72 C while DNA polymerase builds new strands). Every cycle DOUBLES the copies of the target: 1 → 2 → 4 → 8 → 16, so 20 cycles turns a trace amount into about a million copies. PCR COPIES a region; it does not read out the order of the bases — that is sequencing.',
        'GEL ELECTROPHORESIS — SORTING BY SIZE. DNA pieces are loaded into small wells at one end of a gel slab and an electric field is switched on. The phosphate backbone gives DNA a NEGATIVE charge, so every piece migrates toward the POSITIVE electrode at the far end. The gel is a dense mesh, and how far a piece gets in a fixed run time depends on its size in BASE PAIRS.',
        'THE RULE STUDENTS INVERT — SMALLER TRAVELS FARTHER. Small pieces slip through the gel mesh easily and end up FAR from the wells; large pieces snag and stay CLOSE to the wells. So a band near the bottom of the gel (far from the wells) is a SMALL fragment, and a band near the top (close to the wells) is a LARGE one. Say it out loud the right way round once: smaller = farther. Sizes are read off by comparing against a DNA ladder, a lane of pieces of known length.',
        'DNA FINGERPRINTING — WHY BAND PATTERNS IDENTIFY PEOPLE. Certain regions of the genome repeat a short sequence a different number of times in different people. Cut or amplify those regions and everyone gets a personal set of fragment lengths, so everyone gets a personal pattern of bands. In forensics, a suspect matches when their band pattern lines up with the crime-scene sample band for band. In paternity testing, a child\'s bands must ALL be accounted for: each band comes from the mother or from the biological father, so a child band present in neither the mother nor the tested man rules that man out.',
        'CRISPR AND THE ETHICS AROUND IT. CRISPR-Cas9 edits DNA in place: a short GUIDE RNA is designed to match a chosen sequence, it leads the Cas9 enzyme there, Cas9 cuts, and the cell\'s repair machinery either disables the gene or copies in a supplied template. It is far more precise than older methods, which is why the debate is real on both sides: gene-edited crops and therapies can mean drought-resistant harvests and a cure for sickle cell disease, while the open questions are off-target edits, who can afford the treatment, ecological effects of releasing engineered organisms, and whether edits should ever be made to embryos, where the change would pass to every descendant. Major scientific bodies find approved genetically modified foods as safe to eat as conventional ones; most of the live disagreement is about the systems and consequences around the technology, not the food itself.',
      ],
      vocabulary: [
        { term: 'restriction enzyme', definition: 'a protein that cuts DNA wherever it finds its own specific recognition sequence, often leaving sticky ends.' },
        { term: 'plasmid', definition: 'a small circular DNA loop in bacteria, used as a vector to carry a gene into a cell.' },
        { term: 'gel electrophoresis', definition: 'a method that sorts DNA fragments by size, pulling the negatively charged DNA toward the positive electrode.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-a-gel',
      kind: 'worked_example',
      problem:
        'A plasmid is cut with a restriction enzyme and run on a gel. Lane 1 is the ladder, a reference lane with clearly separated bands whose sizes are known: 5000, 3000, 1000 and 500 base pairs, printed from the wells downward in that order. Lane 2 holds the cut plasmid and shows exactly two bands: one sitting very close to the wells, level with the ladder\'s 3000 base-pair band, and one far down the gel near the opposite end, level with the ladder\'s 500 base-pair band. How many cuts did the enzyme make in the circular plasmid, and how big is the whole plasmid?',
      steps: [
        'Read the direction of travel first. DNA is negatively charged, so it left the wells and moved toward the positive electrode at the far end. Distance from the wells therefore means distance travelled.',
        'Match each sample band to the ladder band it lines up with. The band close to the wells has travelled the same distance as the 3000 base-pair reference, so it is a 3000 base-pair piece. The band far down the gel lines up with the 500 base-pair reference, so it is a 500 base-pair piece.',
        'Sanity-check the sizes against the rule: the piece that stayed near the wells is the LARGER one (3000), and the piece that ran farthest is the SMALLER one (500). That is the expected pattern, so the reading is consistent.',
        'Count the cuts. The plasmid is a circle, so one cut would open it into a single linear piece and give one band. Two bands means the circle was cut into two separate pieces, which takes two cuts.',
        'Add the pieces to get the whole. Every base pair of the original circle is in one of the two fragments, so the plasmid is 3000 + 500 = 3500 base pairs.',
      ],
      answer: 'Two cuts, producing a 3000 base-pair piece and a 500 base-pair piece; the original plasmid was 3500 base pairs.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-size-distance-inversion',
      kind: 'worked_example',
      problem:
        'A student runs a gel of a DNA sample and reports: "Lane 2 shows two bands, one near the top of the gel just below the wells and one close to the bottom. The top band must be the small fragment, because small pieces are light and get left behind at the start." The lane really does contain a 6000 base-pair fragment and a 400 base-pair fragment. Which band is which, and where did the reasoning go wrong?',
      steps: [
        'Name what actually drives separation. The electric field pulls every DNA piece toward the positive electrode with the same force per base pair, so pieces are not sorted by how strongly they are pulled. They are sorted by how easily they get through the gel.',
        'Picture the gel as a tangled mesh, not an open lane. A short 400 base-pair fragment threads through the pores quickly. A long 6000 base-pair fragment keeps catching on the mesh and creeps along.',
        'Apply that to the run time. Both pieces travel for the same number of minutes, so the one that moves faster ends up farther from the wells. Distance from the wells is therefore a measure of SMALLNESS, not largeness.',
        'Assign the bands. The band close to the bottom, far from the wells, is the 400 base-pair fragment. The band near the top, barely out of the wells, is the 6000 base-pair fragment.',
        'Locate the error precisely. The student imported an everyday intuition — heavy things sink, light things lag — into a system where the mesh, not the weight, decides. The correct one-line rule is: SMALLER fragments travel FARTHER.',
      ],
      answer: 'The bottom band is the 400 base-pair fragment and the top band is the 6000 base-pair fragment — smaller fragments slip through the gel mesh faster and end up farther from the wells.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-band-sizes',
      kind: 'try_yourself',
      problem:
        'A DNA sample is cut and run on a gel. The lane shows two clear bands: one only a short distance from the wells and one nearly at the far end of the gel. The lab knows the sample contains a 5000 base-pair fragment and a 500 base-pair fragment. Which band is which?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The band near the wells is the 500 base-pair fragment, and the far band is the 5000 base-pair fragment' },
        { id: 'b', text: 'The band near the wells is the 5000 base-pair fragment, and the far band is the 500 base-pair fragment', correct: true },
        { id: 'c', text: 'Both fragments travel the same distance, because both carry the same negative charge' },
        { id: 'd', text: 'It is impossible to tell without knowing how long the gel was run' },
      ],
      expectedAnswer: 'The band near the wells is the 5000 base-pair fragment, and the far band is the 500 base-pair fragment',
      hints: [
        'The gel is a mesh. Which size of fragment gets snagged, and which one slips through easily?',
        'Smaller fragments travel FARTHER from the wells, so the band furthest from the wells is the smallest piece.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-direction-of-travel',
      kind: 'try_yourself',
      problem: 'Once the current is switched on in a gel electrophoresis box, which electrode does the DNA move toward, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Toward the negative electrode, because DNA carries an overall positive charge' },
        { id: 'b', text: 'Toward the negative electrode, because the phosphate backbone makes DNA negatively charged' },
        { id: 'c', text: 'It does not move at all; only the loading dye migrates, and the DNA stays in the wells' },
        { id: 'd', text: 'Toward the positive electrode, because the phosphate backbone makes DNA negatively charged', correct: true },
      ],
      expectedAnswer: 'Toward the positive electrode, because the phosphate backbone makes DNA negatively charged',
      hints: [
        'Start with the charge on the molecule itself — what does the phosphate group in the DNA backbone contribute?',
        'Opposite charges attract: a negatively charged molecule is pulled toward the POSITIVE electrode.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pcr-cycles',
      kind: 'try_yourself',
      problem:
        'A technician starts with 1 copy of a target DNA region and runs 4 complete PCR cycles of denature, anneal and extend. About how many copies of that region are present at the end, and what has PCR actually accomplished?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'About 16 copies — each cycle doubles the number of copies of the target region', correct: true },
        { id: 'b', text: 'About 8 copies — the first cycle only separates the strands and does not copy anything' },
        { id: 'c', text: 'About 4 copies — PCR adds one new copy of the target region per cycle' },
        { id: 'd', text: 'About 16 copies, and PCR has also read out the order of the bases in the target region' },
      ],
      expectedAnswer: 'About 16 copies — each cycle doubles the number of copies of the target region',
      hints: [
        'Write the count out cycle by cycle, starting from 1 copy, remembering what happens to the number each time.',
        '1 → 2 → 4 → 8 → 16. And be careful about the second half of each choice: copying a region is a different job from reading its sequence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-larger-travels-farther',
      kind: 'misconception_check',
      question:
        'A student says: "The band furthest from the wells has to be the biggest fragment — it had the most DNA in it, so the current pushed it hardest and it got the furthest down the gel." What went wrong?',
      commonErrors: [
        {
          answer: 'The band furthest from the wells is the largest fragment',
          misconception: 'Treating the gel as an open track where a bigger, more strongly charged piece is driven farther, instead of as a mesh that filters by size.',
          correctsTo:
            'A longer fragment does carry more charge, but it also has proportionally more length to drag, so the pull per base pair is essentially the same for every piece. What differs is the gel itself: it is a dense mesh, and a long fragment keeps snagging on it while a short one threads straight through. In the same run time the small piece ends up FARTHEST from the wells and the large piece stays CLOSEST to them. The rule to keep: SMALLER travels FARTHER.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Restriction enzymes cut DNA at their own recognition sequence (EcoRI at 5\'-GAATTC-3\') and often leave sticky ends; matching sticky ends plus ligase join DNA from two organisms into recombinant DNA.',
        'A plasmid is the vector: put the human insulin gene into a plasmid, put the plasmid into bacteria, and the bacteria produce human insulin.',
        'PCR COPIES one targeted region — denature, anneal, extend — doubling it each cycle (1 → 2 → 4 → 8 → 16). It does not read the sequence.',
        'In gel electrophoresis DNA is negatively charged, so it moves toward the POSITIVE electrode, and SMALLER fragments travel FARTHER from the wells. Sizes are read against a ladder of known lengths.',
        'DNA fingerprinting compares band patterns: a forensic match lines up band for band, and in paternity testing every child band must come from the mother or the biological father.',
        'CRISPR uses a guide RNA to steer Cas9 to a chosen sequence and cut it so the gene can be disabled or replaced — powerful enough that off-target edits, access and ecological release are all genuine parts of the discussion.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Biotechnology: PCR, Gel Electrophoresis & Genetic Engineering' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
