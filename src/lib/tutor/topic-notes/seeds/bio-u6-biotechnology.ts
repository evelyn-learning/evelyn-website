/**
 * Biology — Unit 6 CED 6.4: Biotechnology: PCR, Gel Electrophoresis & Genetic Engineering.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.biotechnology.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U6_BIOTECHNOLOGY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.biotechnology.v1',
  course: 'Biology',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Biotechnology: PCR, Gel Electrophoresis & Genetic Engineering',
  planId: 'evelyn.hs.bio.biotechnology.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.biotechnology.v1' }],
  theory: [
    { loId: 'bio.biotechnology', kind: 'framework', title: 'Restriction enzymes', content: `RESTRICTION ENZYMES — MOLECULAR SCISSORS. Each restriction enzyme cuts DNA only where it finds its own short RECOGNITION SEQUENCE. EcoRI, for example, cuts wherever it reads 5'-GAATTC-3'. Different enzyme, different sequence, different cut sites — so the same DNA sample cut with two different enzymes gives two different sets of pieces.` },
    { loId: 'bio.biotechnology', kind: 'framework', title: 'Sticky ends', content: `STICKY ENDS — WHY THE CUT MATTERS. Many restriction enzymes cut the two strands unevenly, leaving a short single-stranded overhang called a STICKY END. Two pieces cut by the SAME enzyme have matching overhangs, so they base-pair with each other, and the enzyme DNA ligase seals the joint. This is why the cut is not just destruction: it is what makes DNA from two organisms joinable.` },
    { loId: 'bio.biotechnology', content: `RECOMBINANT DNA AND PLASMID VECTORS. A PLASMID is a small circular DNA loop in bacteria. Cut the plasmid and the human gene with the same restriction enzyme, let the sticky ends pair, seal with ligase, and you have RECOMBINANT DNA — DNA from two sources in one molecule. Put that plasmid back into bacteria and they read the human gene like their own. Human insulin is made exactly this way: engineered bacteria in a tank produce the human protein.` },
    { loId: 'bio.biotechnology', kind: 'framework', title: 'Pcr', content: `PCR — TARGETED COPYING, NOT READING. The polymerase chain reaction amplifies ONE chosen stretch of DNA. Each cycle has three steps: DENATURE (heat to about 95 C to separate the two strands), ANNEAL (cool to about 55 C so short primers stick to the ends of the target region), EXTEND (about 72 C while DNA polymerase builds new strands). Every cycle DOUBLES the copies of the target: 1 → 2 → 4 → 8 → 16, so 20 cycles turns a trace amount into about a million copies. PCR COPIES a region; it does not read out the order of the bases — that is sequencing.` },
    { loId: 'bio.biotechnology', kind: 'framework', title: 'Gel electrophoresis', content: `GEL ELECTROPHORESIS — SORTING BY SIZE. DNA pieces are loaded into small wells at one end of a gel slab and an electric field is switched on. The phosphate backbone gives DNA a NEGATIVE charge, so every piece migrates toward the POSITIVE electrode at the far end. The gel is a dense mesh, and how far a piece gets in a fixed run time depends on its size in BASE PAIRS.` },
    { loId: 'bio.biotechnology', kind: 'framework', title: 'The rule students invert', content: `THE RULE STUDENTS INVERT — SMALLER TRAVELS FARTHER. Small pieces slip through the gel mesh easily and end up FAR from the wells; large pieces snag and stay CLOSE to the wells. So a band near the bottom of the gel (far from the wells) is a SMALL fragment, and a band near the top (close to the wells) is a LARGE one. Say it out loud the right way round once: smaller = farther. Sizes are read off by comparing against a DNA ladder, a lane of pieces of known length.` },
    { loId: 'bio.biotechnology', kind: 'framework', title: 'Dna fingerprinting', content: `DNA FINGERPRINTING — WHY BAND PATTERNS IDENTIFY PEOPLE. Certain regions of the genome repeat a short sequence a different number of times in different people. Cut or amplify those regions and everyone gets a personal set of fragment lengths, so everyone gets a personal pattern of bands. In forensics, a suspect matches when their band pattern lines up with the crime-scene sample band for band. In paternity testing, a child's bands must ALL be accounted for: each band comes from the mother or from the biological father, so a child band present in neither the mother nor the tested man rules that man out.` },
    { loId: 'bio.biotechnology', content: `CRISPR AND THE ETHICS AROUND IT. CRISPR-Cas9 edits DNA in place: a short GUIDE RNA is designed to match a chosen sequence, it leads the Cas9 enzyme there, Cas9 cuts, and the cell's repair machinery either disables the gene or copies in a supplied template. It is far more precise than older methods, which is why the debate is real on both sides: gene-edited crops and therapies can mean drought-resistant harvests and a cure for sickle cell disease, while the open questions are off-target edits, who can afford the treatment, ecological effects of releasing engineered organisms, and whether edits should ever be made to embryos, where the change would pass to every descendant. Major scientific bodies find approved genetically modified foods as safe to eat as conventional ones; most of the live disagreement is about the systems and consequences around the technology, not the food itself.` },
    { loId: 'bio.biotechnology', kind: 'definition', title: 'restriction enzyme', content: `a protein that cuts DNA wherever it finds its own specific recognition sequence, often leaving sticky ends.` },
    { loId: 'bio.biotechnology', kind: 'definition', title: 'plasmid', content: `a small circular DNA loop in bacteria, used as a vector to carry a gene into a cell.` },
    { loId: 'bio.biotechnology', kind: 'definition', title: 'gel electrophoresis', content: `a method that sorts DNA fragments by size, pulling the negatively charged DNA toward the positive electrode.` },
  ],
  methods: [
    {
      title: 'Worked read a gel',
      steps: [
        `Read the direction of travel first. DNA is negatively charged, so it left the wells and moved toward the positive electrode at the far end. Distance from the wells therefore means distance travelled.`,
        `Match each sample band to the ladder band it lines up with. The band close to the wells has travelled the same distance as the 3000 base-pair reference, so it is a 3000 base-pair piece. The band far down the gel lines up with the 500 base-pair reference, so it is a 500 base-pair piece.`,
        `Sanity-check the sizes against the rule: the piece that stayed near the wells is the LARGER one (3000), and the piece that ran farthest is the SMALLER one (500). That is the expected pattern, so the reading is consistent.`,
        `Count the cuts. The plasmid is a circle, so one cut would open it into a single linear piece and give one band. Two bands means the circle was cut into two separate pieces, which takes two cuts.`,
        `Add the pieces to get the whole. Every base pair of the original circle is in one of the two fragments, so the plasmid is 3000 + 500 = 3500 base pairs.`,
      ],
      example: { problem: `A plasmid is cut with a restriction enzyme and run on a gel. Lane 1 is the ladder, a reference lane with clearly separated bands whose sizes are known: 5000, 3000, 1000 and 500 base pairs, printed from the wells downward in that order. Lane 2 holds the cut plasmid and shows exactly two bands: one sitting very close to the wells, level with the ladder's 3000 base-pair band, and one far down the gel near the opposite end, level with the ladder's 500 base-pair band. How many cuts did the enzyme make in the circular plasmid, and how big is the whole plasmid?`, solution: `Two cuts, producing a 3000 base-pair piece and a 500 base-pair piece; the original plasmid was 3500 base pairs.` },
      relatedLoIds: ['bio.biotechnology'],
    },
    {
      title: 'Worked size distance inversion',
      steps: [
        `Name what actually drives separation. The electric field pulls every DNA piece toward the positive electrode with the same force per base pair, so pieces are not sorted by how strongly they are pulled. They are sorted by how easily they get through the gel.`,
        `Picture the gel as a tangled mesh, not an open lane. A short 400 base-pair fragment threads through the pores quickly. A long 6000 base-pair fragment keeps catching on the mesh and creeps along.`,
        `Apply that to the run time. Both pieces travel for the same number of minutes, so the one that moves faster ends up farther from the wells. Distance from the wells is therefore a measure of SMALLNESS, not largeness.`,
        `Assign the bands. The band close to the bottom, far from the wells, is the 400 base-pair fragment. The band near the top, barely out of the wells, is the 6000 base-pair fragment.`,
        `Locate the error precisely. The student imported an everyday intuition — heavy things sink, light things lag — into a system where the mesh, not the weight, decides. The correct one-line rule is: SMALLER fragments travel FARTHER.`,
      ],
      example: { problem: `A student runs a gel of a DNA sample and reports: "Lane 2 shows two bands, one near the top of the gel just below the wells and one close to the bottom. The top band must be the small fragment, because small pieces are light and get left behind at the start." The lane really does contain a 6000 base-pair fragment and a 400 base-pair fragment. Which band is which, and where did the reasoning go wrong?`, solution: `The bottom band is the 400 base-pair fragment and the top band is the 6000 base-pair fragment — smaller fragments slip through the gel mesh faster and end up farther from the wells.` },
      relatedLoIds: ['bio.biotechnology'],
    },
  ],
  pointers: [
    { content: `A longer fragment does carry more charge, but it also has proportionally more length to drag, so the pull per base pair is essentially the same for every piece. What differs is the gel itself: it is a dense mesh, and a long fragment keeps snagging on it while a short one threads straight through. In the same run time the small piece ends up FARTHEST from the wells and the large piece stays CLOSEST to them. The rule to keep: SMALLER travels FARTHER.`, kind: 'common-error' },
    { content: `Restriction enzymes cut DNA at their own recognition sequence (EcoRI at 5'-GAATTC-3') and often leave sticky ends; matching sticky ends plus ligase join DNA from two organisms into recombinant DNA.`, kind: 'tip' },
    { content: `A plasmid is the vector: put the human insulin gene into a plasmid, put the plasmid into bacteria, and the bacteria produce human insulin.`, kind: 'tip' },
    { content: `PCR COPIES one targeted region — denature, anneal, extend — doubling it each cycle (1 → 2 → 4 → 8 → 16). It does not read the sequence.`, kind: 'tip' },
    { content: `In gel electrophoresis DNA is negatively charged, so it moves toward the POSITIVE electrode, and SMALLER fragments travel FARTHER from the wells. Sizes are read against a ladder of known lengths.`, kind: 'tip' },
    { content: `DNA fingerprinting compares band patterns: a forensic match lines up band for band, and in paternity testing every child band must come from the mother or the biological father.`, kind: 'tip' },
    { content: `CRISPR uses a guide RNA to steer Cas9 to a chosen sequence and cut it so the gene can be disabled or replaced — powerful enough that off-target edits, access and ecological release are all genuine parts of the discussion.`, kind: 'tip' },
    { content: `Say it once, correctly: **smaller travels farther**. A band near the wells = LARGE fragment; a band near the far end = SMALL fragment. Charge doesn't sort the pieces — the gel mesh does, since charge per base pair is the same for every fragment.`, kind: 'common-error' },
    { content: `PCR **copies**, it doesn't **read**. Reading the base order is sequencing. Also don't say PCR 'sorts' DNA — that's the gel. Match the verb to the tool: cut (restriction enzyme), copy (PCR), sort (gel), edit (CRISPR).`, kind: 'vocab-note' },
    { content: `On a circular plasmid, number of cuts = number of bands (2 bands = 2 cuts). On a LINEAR piece it's different: 1 cut gives 2 fragments, so cuts = bands − 1. Check which shape you were given before counting.`, kind: 'edge-case' },
    { content: `Two fragments of the same size run as ONE band — a two-band lane may still be three pieces. Also, a fragment too small can run off the end of the gel. Don't claim the band count is the piece count without a size check against the ladder.`, kind: 'edge-case' },
    { content: `Recombinant DNA only works if the gene and the plasmid are cut with the **same** restriction enzyme — different enzymes leave non-matching sticky ends that won't base-pair. And ligase seals the joint; the enzyme that cut it can't glue it back.`, kind: 'gotcha' },
    { content: `In paternity gels, a match is not 'shares some bands' — every child band must trace to the mother or the tested man. One unexplained child band excludes him. Shared bands alone prove nothing; unrelated people share plenty.`, kind: 'common-error' },
    { content: `CRISPR uses a **guide RNA** — not DNA, not a primer — to steer Cas9. PCR uses **DNA primers**. Don't swap the two, and don't say Cas9 'finds' the sequence on its own; the guide RNA does the targeting.`, kind: 'vocab-note' },
    { content: `PCR cycles double: n cycles from 1 copy gives 2^n, not n×2. 4 cycles = 16, 10 cycles = ~1000. Quick check: if your answer is small and linear, you added instead of doubled.`, kind: 'tip' },
  ],
};
