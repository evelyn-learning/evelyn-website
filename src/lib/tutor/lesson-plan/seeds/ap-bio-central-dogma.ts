/**
 * AP Biology — Unit 6 part 1: Central Dogma (DNA → RNA → Protein).
 *
 * DNA replication, transcription, translation, mutations.
 * Foundation for all of Unit 6 (~12-16% of exam).
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_CENTRAL_DOGMA: LessonPlan = {
  id: 'evelyn.ap.bio.central-dogma.v1',
  title: 'AP Bio — Unit 6: DNA Replication, Transcription, Translation, Mutations',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'ap.bio.central-dogma',
      description: 'Trace the central dogma — DNA replication, transcription to RNA, translation to protein — identifying enzymes, substrates, and key regulatory features; classify mutation types and predict their effects.',
      standard: 'AP-BIO-6.1-6.6',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Unit 6 = the largest AP Bio unit by exam weight.',
      script: 'Unit 6 is about 12-16% of the AP Bio exam — the single largest unit. The central dogma (DNA replication, transcription, translation) is its backbone, plus gene regulation + biotechnology in the second half. Master the molecular mechanisms once and you handle the recurring "given a sequence, predict the protein" or "given a mutation, predict the effect" questions confidently.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-replication',
      kind: 'concept',
      goal: 'DNA replication — semiconservative + bidirectional.',
      keyIdeas: [
        'DNA STRUCTURE recap: double helix, two antiparallel strands held by H-bonds between BASE PAIRS (A-T two H-bonds; G-C three H-bonds, hence higher melting temp). Sugar-phosphate backbone outside; bases inside.',
        'SEMICONSERVATIVE REPLICATION (Meselson-Stahl 1958): each daughter DNA contains ONE PARENTAL strand + ONE NEWLY SYNTHESIZED strand. NOT conservative (parent intact + new copy) NOR dispersive (mixed bits).',
        'KEY ENZYMES:',
        '  HELICASE: unwinds the double helix at the REPLICATION FORK, breaking H-bonds.',
        '  SINGLE-STRAND BINDING PROTEINS: keep separated strands from re-annealing.',
        '  TOPOISOMERASE / GYRASE: relieves supercoiling ahead of fork.',
        '  PRIMASE: synthesizes short RNA PRIMERS (~10 nt) where DNA pol can start.',
        '  DNA POLYMERASE III (prokaryotes) / δ + ε (eukaryotes): synthesizes new strand 5\' → 3\', requires primer.',
        '  DNA POLYMERASE I (prokaryotes): removes RNA primers + fills with DNA.',
        '  DNA LIGASE: seals nicks (joins Okazaki fragments).',
        'LEADING vs LAGGING STRAND: replication fork moves in one direction; one strand (LEADING) is synthesized continuously toward the fork; the other (LAGGING) is synthesized in OKAZAKI FRAGMENTS away from the fork, each requiring its own primer.',
        'DIRECTIONALITY: DNA polymerase can ONLY synthesize 5\' → 3\'. Reads template 3\' → 5\'. This is the WHY behind leading/lagging asymmetry.',
        'FIDELITY: DNA pol III has 3\' → 5\' EXONUCLEASE proofreading activity — error rate ~1 in 10⁹ after proofreading + mismatch repair.',
        'TELOMERES + TELOMERASE: chromosome ends shorten with each replication (lagging-strand problem). TELOMERASE (RT-class enzyme) extends telomeres in stem cells, gametes, cancer cells.',
      ],
      vocabulary: [
        { term: 'semiconservative replication', definition: 'each daughter DNA contains one parental strand + one newly synthesized strand (Meselson-Stahl experiment).' },
        { term: 'Okazaki fragments', definition: 'short DNA segments synthesized on the lagging strand, later joined by DNA ligase.' },
        { term: 'telomerase', definition: 'reverse-transcriptase-class enzyme that extends telomeric repeats; active in stem cells, germ cells, and cancer cells.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-transcription-translation',
      kind: 'concept',
      goal: 'Transcription + RNA processing + translation.',
      keyIdeas: [
        'TRANSCRIPTION: DNA → mRNA. Catalyzed by RNA POLYMERASE. Reads template strand 3\' → 5\', synthesizes mRNA 5\' → 3\'. Uses URACIL (U) instead of T.',
        'PROMOTER: DNA sequence upstream of gene where RNA polymerase binds. Eukaryotes use TATA box + transcription factors. Prokaryotes have −10 + −35 sequences recognized by sigma factor.',
        'mRNA PROCESSING (eukaryotes only):',
        '  5\' CAP added (modified guanine) — protects mRNA + signals ribosome binding.',
        '  3\' POLY-A TAIL added (~200 A residues) — protects from degradation + aids export.',
        '  SPLICING: introns (non-coding) removed by SPLICEOSOME (small nuclear RNAs + proteins); exons (coding) joined.',
        'ALTERNATIVE SPLICING: same gene → multiple mRNAs by including different exon combinations → multiple proteins. Major source of human protein diversity (~20K genes producing ~100K+ proteins).',
        'TRANSLATION: mRNA → protein. Occurs at RIBOSOMES (rRNA + protein; large + small subunits).',
        'CODONS: triplets of mRNA nucleotides specifying amino acids. 64 possible codons, 20 amino acids → DEGENERATE code (multiple codons per AA). START codon AUG (Met). STOP codons UAA, UAG, UGA (no AA, terminate translation).',
        'tRNA: cloverleaf-shaped RNA carrying an amino acid + anticodon (complementary to mRNA codon). AMINOACYL-tRNA SYNTHETASE charges tRNAs with their specific AA — one synthetase per amino acid.',
        'TRANSLATION STAGES:',
        '  INITIATION: small ribosomal subunit binds mRNA + initiator tRNA at AUG; large subunit joins.',
        '  ELONGATION: tRNAs enter A site, peptide bond forms (peptidyl transferase activity of large rRNA), ribosome translocates 3 nt, used tRNA exits E site.',
        '  TERMINATION: stop codon recognized by RELEASE FACTOR; polypeptide released.',
        'POST-TRANSLATIONAL MODIFICATION: phosphorylation, glycosylation, cleavage (e.g., zymogens), folding (chaperones), targeting (signal sequences direct proteins to ER, mitochondria, etc.).',
      ],
      vocabulary: [
        { term: 'codon', definition: 'a triplet of mRNA nucleotides encoding one amino acid (or a stop signal); 64 possible codons specify 20 amino acids + 3 stop codons.' },
        { term: 'spliceosome', definition: 'eukaryotic complex of small nuclear RNAs + proteins that removes introns from pre-mRNA + joins exons.' },
        { term: 'alternative splicing', definition: 'same pre-mRNA spliced different ways to produce multiple mature mRNAs + proteins from one gene; major source of proteome diversity.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-mutations',
      kind: 'concept',
      goal: 'Mutation classification + effects.',
      keyIdeas: [
        'POINT MUTATIONS (single nucleotide change):',
        '  SILENT: codon change but same AA (degenerate code). NO effect.',
        '  MISSENSE: codon change → different AA. Effect varies — could be neutral (similar AA) or severe (e.g., sickle cell — Glu → Val in β-globin).',
        '  NONSENSE: codon → STOP. Truncated protein, usually nonfunctional.',
        'INSERTIONS / DELETIONS (indels):',
        '  In multiples of 3: adds/removes whole AAs but reading frame intact.',
        '  NOT in multiples of 3: FRAMESHIFT — entire downstream sequence misread. Catastrophic; protein usually nonfunctional.',
        'CHROMOSOMAL MUTATIONS (large scale):',
        '  DELETIONS, DUPLICATIONS, INVERSIONS, TRANSLOCATIONS (segments moved between chromosomes).',
        '  NONDISJUNCTION in meiosis → ANEUPLOIDY (extra/missing chromosomes). Trisomy 21 (Down syndrome). Sex chromosome aneuploidies (XXY = Klinefelter, X0 = Turner).',
        'MUTATION SOURCES: spontaneous (replication errors), chemical mutagens (e.g., ROS, alkylating agents), radiation (UV → thymine dimers; ionizing radiation breaks strands), retroviral integration, transposable elements ("jumping genes").',
        'GERMLINE vs SOMATIC: GERMLINE mutations heritable (in egg/sperm); SOMATIC mutations affect only the individual (not heritable but can drive cancer).',
        'EVOLUTIONARY ROLE: mutations are the ULTIMATE source of new genetic variation; natural selection acts on it.',
      ],
      vocabulary: [
        { term: 'frameshift mutation', definition: 'insertion or deletion not in multiples of 3, shifting the reading frame of downstream codons; usually catastrophic.' },
        { term: 'missense mutation', definition: 'point mutation changing one amino acid to another; effect depends on chemical similarity of substituted AA.' },
        { term: 'nondisjunction', definition: 'failure of homologous chromosomes (meiosis I) or sister chromatids (meiosis II) to separate, producing aneuploid gametes.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A coding mRNA sequence reads 5\'-AUG-CCA-UCG-UAA-3\'. Translate it. If the second nucleotide of the second codon (CCA) mutates from C to A, what type of mutation is this and what is the new sequence?',
      expectedAnswer: 'Original translation: AUG (Met-Start) → CCA (Pro) → UCG (Ser) → UAA (Stop). So protein = Met-Pro-Ser. After mutation, second codon becomes CAA → Gln. New protein = Met-Gln-Ser. This is a MISSENSE mutation (one AA changed, Pro → Gln). Reading frame intact, no stop introduced. Effect would depend on whether Gln can substitute for Pro functionally (Pro creates kinks; Gln is polar uncharged — likely a structural change worth noting).',
      responseFormat: 'free',
      hints: [
        'Use the codon chart: AUG=Met, CCA=Pro, UCG=Ser, UAA=Stop.',
        'C→A at position 2 of codon 2: CCA becomes CAA.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-rna-pol-template',
      kind: 'misconception_check',
      question: 'During transcription, RNA polymerase uses the CODING strand of DNA as template. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing template (antisense) and coding (sense) strands.',
          correctsTo: 'False — and a recurring AP trap. The TEMPLATE (or "antisense") strand is what RNA polymerase READS. The CODING (or "sense") strand has the SAME sequence as the mRNA produced (except T → U). Example: if coding strand is 5\'-ATG-CCA-3\', template is 3\'-TAC-GGT-5\' (complementary + antiparallel), and mRNA produced is 5\'-AUG-CCA-3\' (same as coding strand with U substituted for T). Why this naming makes sense: the CODING strand "codes" for the same protein the mRNA does (you can read protein directly from it without complementing). AP frequently asks "which strand was used as template" — the answer is always the strand RNA pol READS, which is COMPLEMENTARY to the mRNA.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'DNA replication: semiconservative; helicase, primase, DNA pol III, ligase. Leading + lagging (Okazaki fragments).',
        'Transcription: RNA pol; eukaryotic mRNA gets 5\' cap, poly-A tail, splicing (introns removed). Alternative splicing → proteome diversity.',
        'Translation: ribosome reads codons; tRNA + aminoacyl synthetase delivers AAs; AUG start, UAA/UAG/UGA stop.',
        'Mutations: silent, missense, nonsense (point); frameshift (indel not ÷3); chromosomal (aneuploidy etc.).',
        'Coding strand = same sequence as mRNA. Template strand = what RNA pol reads.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are eukaryotic mRNAs processed (cap, splicing, poly-A tail) while prokaryotic mRNAs are typically used directly without processing?',
      hint: 'Several intersecting reasons. (1) COMPARTMENTALIZATION: Eukaryotic transcription happens in NUCLEUS; translation in CYTOPLASM. mRNA must be exported and survive transit. The cap + poly-A tail mark mRNA as "ready for export" + protect from cytoplasmic nucleases. Prokaryotes lack this separation — translation begins WHILE transcription is still ongoing on the same mRNA. (2) GENE STRUCTURE: Eukaryotic genes are SPLIT into exons + introns; splicing assembles the coding sequence post-transcriptionally. Most prokaryotic genes lack introns. (3) REGULATION: processing is a layer where eukaryotic cells can REGULATE expression (alternative splicing, mRNA stability via poly-A length, capping efficiency). (4) EVOLUTIONARY history: introns likely originated from mobile genetic elements; splicing machinery may have evolved to manage them. The processing system as a whole is one of the deepest divergences between domains. AP often asks for ANY ONE reason — knowing the cluster lets you tailor the answer to the question stem.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
