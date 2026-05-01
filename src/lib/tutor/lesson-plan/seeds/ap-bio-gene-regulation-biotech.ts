/**
 * AP Biology — Unit 6 part 2: Gene Regulation + Biotechnology.
 *
 * Operons, eukaryotic regulation, epigenetics, PCR, gel electrophoresis,
 * CRISPR, gene cloning. Recurring AP FRQ source.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_BIO_GENE_REGULATION_BIOTECH: LessonPlan = {
  id: 'evelyn.ap.bio.gene-regulation-biotech.v1',
  title: 'AP Bio — Unit 6: Gene Regulation, Operons, PCR, CRISPR',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'ap.bio.gene-regulation-biotech',
      description: 'Explain prokaryotic operon regulation (lac, trp), describe eukaryotic gene-regulation mechanisms (transcription factors, epigenetics), and apply biotechnology techniques (PCR, gel electrophoresis, CRISPR-Cas9) to AP-style scenarios.',
      standard: 'AP-BIO-6.7-6.8',
    },
  ],
  prerequisites: ['ap.bio.central-dogma'],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Gene regulation + biotech = high-yield AP FRQ source.',
      script: 'The second half of Unit 6 covers gene regulation + biotechnology. Operons (especially the lac operon) appear on AP exams almost every year. Eukaryotic regulation explains how identical genomes produce specialized cell types. Biotechnology (PCR, gel electrophoresis, CRISPR) shows up in passage-based FRQs that ask you to interpret experimental results. These topics reward conceptual understanding plus pattern recognition.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-prokaryote-operons',
      kind: 'concept',
      goal: 'Operons — bacterial gene regulation.',
      keyIdeas: [
        'OPERON: cluster of GENES under control of a SINGLE PROMOTER + OPERATOR, transcribed together as a polycistronic mRNA. Bacterial-specific structure (eukaryotes regulate genes individually).',
        'COMPONENTS: PROMOTER (RNA pol binding) + OPERATOR (regulatory protein binding site) + STRUCTURAL GENES (the coding sequences). Plus a REGULATORY GENE encoding a repressor or activator, often elsewhere on chromosome.',
        'lac OPERON (E. coli, INDUCIBLE — turned ON when needed):',
        '  STRUCTURAL GENES: lacZ (β-galactosidase), lacY (permease), lacA (transacetylase) — break down lactose.',
        '  DEFAULT STATE: lac REPRESSOR protein binds operator → blocks transcription. Genes OFF.',
        '  WHEN LACTOSE PRESENT: allolactose (lactose isomer) binds repressor → repressor releases operator → RNA pol transcribes. Genes ON.',
        '  CATABOLITE REPRESSION: when GLUCOSE is also present, cAMP is LOW → CAP (catabolite activator protein) DOESN\'T bind → transcription is WEAK even if no repressor. Glucose preferred over lactose. Bacteria prioritize glucose ("diauxic growth").',
        'trp OPERON (E. coli, REPRESSIBLE — turned ON by default, OFF when product abundant):',
        '  STRUCTURAL GENES: code for tryptophan biosynthesis enzymes.',
        '  DEFAULT STATE: trp repressor INACTIVE → genes ON, bacteria makes trp.',
        '  WHEN TRP ABUNDANT: trp binds + activates repressor → represses operator → transcription OFF. Negative feedback to stop unnecessary synthesis.',
        'INDUCIBLE vs REPRESSIBLE summary: INDUCIBLE (lac) = OFF by default, ON when substrate present (catabolic). REPRESSIBLE (trp) = ON by default, OFF when product abundant (anabolic).',
      ],
      vocabulary: [
        { term: 'operon', definition: 'cluster of genes under one promoter + operator, co-transcribed as polycistronic mRNA in bacteria; absent in eukaryotes.' },
        { term: 'inducible operon', definition: 'operon normally OFF, switched ON by a signal (e.g., lac operon turned on by lactose); usually catabolic.' },
        { term: 'repressible operon', definition: 'operon normally ON, switched OFF by feedback from product abundance (e.g., trp operon); usually anabolic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-eukaryote-regulation',
      kind: 'concept',
      goal: 'Eukaryotic regulation + epigenetics.',
      keyIdeas: [
        'EUKARYOTIC REGULATION OCCURS at MULTIPLE LEVELS:',
        '  CHROMATIN PACKAGING (most fundamental): heterochromatin (tightly packed) = genes generally OFF; euchromatin (loose) = genes accessible.',
        '  TRANSCRIPTIONAL: transcription factors (TFs) bind enhancers/silencers; mediator complex bridges TFs to RNA pol II.',
        '  POST-TRANSCRIPTIONAL: alternative splicing, mRNA stability (poly-A length), microRNAs (target mRNAs for degradation or translational silencing).',
        '  TRANSLATIONAL: mRNA-binding proteins control ribosome access.',
        '  POST-TRANSLATIONAL: protein modifications, targeted degradation (ubiquitin-proteasome system).',
        'TRANSCRIPTION FACTORS: proteins binding to specific DNA sequences (PROMOTER-PROXIMAL elements + ENHANCERS sometimes far away). GENERAL TFs needed for all RNA pol II transcription. SPECIFIC TFs determine cell-type-specific expression.',
        'ENHANCERS: regulatory DNA sequences that can be far (kilobases) from the gene; loop into contact with promoter via mediator. One enhancer can target multiple genes; one gene can have many enhancers.',
        'EPIGENETICS: heritable changes in gene expression NOT due to DNA sequence changes. Two main mechanisms:',
        '  DNA METHYLATION: methyl groups added to cytosine (CpG islands); usually REPRESSES transcription.',
        '  HISTONE MODIFICATIONS: acetylation (loosens chromatin → activates) vs methylation (varies — H3K9me3 represses, H3K4me3 activates). Histone code reads chromatin state.',
        'EXAMPLES: X-chromosome inactivation (XIST RNA + methylation creates BARR BODY in female cells). Genomic imprinting (parent-of-origin expression). Twin studies show epigenetic divergence with age + environment.',
        'CELL DIFFERENTIATION: same genome, different epigenetic patterns → different cell types. Critical for understanding development.',
      ],
      vocabulary: [
        { term: 'transcription factor', definition: 'a DNA-binding protein that activates or represses transcription of specific genes; major control point in eukaryotes.' },
        { term: 'epigenetics', definition: 'heritable changes in gene expression not caused by DNA sequence change; mediated by DNA methylation + histone modifications.' },
        { term: 'enhancer', definition: 'a DNA regulatory element that can be far from the gene + loops into contact with the promoter to amplify transcription.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-biotech',
      kind: 'concept',
      goal: 'Key biotechnology techniques.',
      keyIdeas: [
        'POLYMERASE CHAIN REACTION (PCR): amplifies a specific DNA region in vitro. Cycles of:',
        '  DENATURATION (~95°C): strands separate.',
        '  ANNEALING (~50-65°C): primers (short DNA, ~20 nt) bind flanking the target region.',
        '  EXTENSION (~72°C): TAQ POLYMERASE (heat-stable, from Thermus aquaticus) synthesizes new strand from primers.',
        '  ~30 cycles → ~10⁹ copies. Doubles each cycle.',
        'GEL ELECTROPHORESIS: separates DNA fragments by SIZE. DNA is negatively charged → migrates toward anode. Smaller fragments move FASTER through agarose pores. Compare to size standards (ladders) to read fragment lengths.',
        'INTERPRETATION: lanes side-by-side; band positions reveal fragment sizes. Common AP application: restriction digest of two samples → bands tell whether sequences differ.',
        'RESTRICTION ENZYMES: bacterial enzymes cutting DNA at specific recognition sequences (e.g., EcoRI cuts GAATTC). Used to clone genes + RFLP analysis.',
        'GENE CLONING: insert gene of interest into a PLASMID VECTOR using restriction enzymes + DNA ligase; transform into bacteria; bacteria replicate plasmid + may express protein.',
        'CRISPR-Cas9 (game-changing 2010s technology): GUIDE RNA directs Cas9 nuclease to a specific genomic site → Cas9 cuts both strands → cell repairs (often imperfectly, knocking out the gene; or with template, inserting a desired sequence).',
        'APPLICATIONS: knockout mice, gene therapy (e.g., 2023 FDA-approved sickle cell + β-thalassemia treatments using CRISPR), agricultural improvement, basic research. Massive ethical debate over germline editing in humans.',
        'OTHER TECHNIQUES often referenced: DNA SEQUENCING (Sanger original, then Next-Gen Sequencing). FLUORESCENT TAGS + GFP for protein localization. KARYOTYPING for chromosomal abnormalities.',
      ],
      vocabulary: [
        { term: 'PCR', definition: 'polymerase chain reaction — in-vitro amplification of specific DNA via thermal cycles + heat-stable Taq polymerase + primers.' },
        { term: 'gel electrophoresis', definition: 'separation of DNA fragments by size in an electric field through an agarose gel; smaller fragments migrate faster.' },
        { term: 'CRISPR-Cas9', definition: 'genome-editing system using guide RNA + Cas9 nuclease to make targeted DNA cuts; enables knockout + insertion at chosen sites.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bacterial mutant of the lac operon has a non-functional repressor protein. Predict the operon\'s expression pattern in (a) lactose absent + glucose absent, (b) lactose absent + glucose present, (c) lactose present + glucose absent, (d) lactose present + glucose present.',
      expectedAnswer: 'Without functional repressor, the operator is ALWAYS unblocked. So the operon is CONSTITUTIVELY ACCESSIBLE. But CAP regulation (via cAMP, glucose) still applies. (a) Lactose− Glucose−: glucose absent → high cAMP → CAP active → STRONG TRANSCRIPTION (despite no lactose). (b) Lactose− Glucose+: glucose present → low cAMP → CAP inactive → WEAK TRANSCRIPTION. (c) Lactose+ Glucose−: STRONG (same as a). (d) Lactose+ Glucose+: WEAK (CAP off). Key insight: this mutant wastes resources making β-galactosidase even without lactose — CAP regulation prevents catastrophic over-expression but doesn\'t fully shut it off. AP loves this kind of "predict mutant phenotype" question.',
      responseFormat: 'free',
      hints: [
        'No functional repressor = always unblocked operator.',
        'CAP/cAMP regulation still depends on glucose presence.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-pcr-cells',
      kind: 'misconception_check',
      question: 'PCR requires living cells to amplify DNA, since DNA replication is a cellular process. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing in vivo and in vitro DNA synthesis.',
          correctsTo: 'False. PCR is entirely IN VITRO — it happens in a thermocycler tube with purified components: target DNA, primers, dNTPs, Taq polymerase, and buffer. The reason it works without cells: Taq polymerase is HEAT-STABLE (~95°C denaturation step would kill normal cells + denature normal DNA pol), and the cycling conditions automate the denaturation/annealing/extension that cells would do at constant temperature. PCR was Kary Mullis\'s 1983 invention specifically because in-vivo amplification is slow + requires whole-cell metabolism. The in-vitro nature is what makes PCR fast (hours instead of days), specific (primers target one sequence), and powerful (works with tiny starting samples — even single cells, ancient DNA, or crime-scene traces). AP biology often slips this confusion into PCR questions — the absence of cells is the technique\'s defining feature.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'lac operon: inducible (off by default, on with lactose). trp: repressible (on by default, off with trp). Catabolite repression by glucose/cAMP/CAP.',
        'Eukaryotic regulation: chromatin → transcription → RNA processing → translation → post-translational. Multiple control points.',
        'Epigenetics: DNA methylation (usually represses), histone modifications (acetylation activates).',
        'PCR: 95° denature → 50-65° anneal → 72° extend. Taq polymerase. ~30 cycles → 10⁹ copies.',
        'Gel electrophoresis: smaller fragments faster. CRISPR-Cas9: gRNA + Cas9 cuts at specific site.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is eukaryotic gene regulation generally more complex (multi-level) than prokaryotic regulation (which is mostly transcriptional)?',
      hint: 'Several factors push eukaryotes toward layered regulation. (1) MULTICELLULARITY: a 200+ cell-type human body needs each cell to express a tailored subset of ~20K genes. The regulatory complexity is REQUIRED to produce specialized cells from one genome. Prokaryotes are mostly single-celled. (2) GENOME SIZE + STRUCTURE: eukaryotic genomes are larger + organized in chromatin; chromatin packing itself becomes a regulatory layer absent in prokaryotes. (3) INTRONS + ALTERNATIVE SPLICING: split genes create a post-transcriptional regulatory level. (4) NUCLEAR-CYTOPLASMIC SEPARATION: mRNA must be exported, creating opportunities for regulation at export, stability, and translation. (5) DEVELOPMENT + DIFFERENTIATION: epigenetic mechanisms maintain cell identity through divisions, requiring stable but heritable regulatory marks. (6) RESPONSE TO COMPLEX ENVIRONMENTS: animals integrate signals from neurons, hormones, immune cells — needing flexible multi-input control. Prokaryotes mostly need to respond to nutrients quickly, where transcriptional control suffices. AP often asks ANY ONE difference; knowing the conceptual cluster of "cell types + genome size + nuclear envelope" lets you craft a strong answer.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
