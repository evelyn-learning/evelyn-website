/**
 * Biology — Classification & Diversity: The Three Domains, Six Kingdoms & Viruses.
 *
 * The taxonomy template for the HS Biology fan-out (NGSS HS-LS4-1, HS-LS4-2).
 * Students arrive with a memorized kingdom list and no procedure, so the
 * concept segment is organized around three sorting questions that place any
 * described organism — plus the two grouping stories that break the tidy
 * picture: Protista as a leftover bin, and viruses as not-alive at all.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U8_DOMAINS_KINGDOMS_DIVERSITY: LessonPlan = {
  id: 'evelyn.hs.bio.domains-kingdoms-diversity.v1',
  title: 'The Three Domains, Six Kingdoms & Viruses',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.domains-kingdoms-diversity',
      standard: 'BIO-8.3',
      description:
        'Classify organisms into the three domains and six kingdoms using cell type, cellularity, and mode of nutrition, explain how rRNA sequence evidence reshaped those groupings, and justify why viruses fall outside the classification system (NGSS HS-LS4-1, HS-LS4-2).',
    },
  ],
  prerequisites: ['bio.phylogenetics-cladograms'],
  followUps: ['bio.ecosystems-biomes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame classification as a live scientific argument, using extremophiles and the antibiotics-for-a-cold mistake.',
      script:
        'There are microbes thriving in a Yellowstone hot spring at nearly boiling temperature, and in acid so strong it would burn your skin. For decades biologists filed them under "weird bacteria" — until someone read their genes and found they are no closer to bacteria than you are. That discovery redrew the top of the tree of life, and it is the same reason astrobiologists studying icy moons are excited. In this lesson you get a three-question procedure that places almost any organism, and you settle an argument you have probably already had: why the doctor will not give you antibiotics for a cold.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-domains-kingdoms',
      kind: 'concept',
      goal: 'The three domains and the evidence behind them, the six kingdoms, the three sorting questions, and where Protista and viruses break the tidy picture.',
      keyIdeas: [
        'THE THREE DOMAINS — the broadest level of classification: Bacteria, Archaea, and Eukarya. Bacteria and Archaea are both PROKARYOTIC (no nucleus, no membrane-bound organelles); Eukarya covers every organism whose cells have a nucleus, from an amoeba to a whale.',
        'WHY THE TREE WAS REDRAWN — Archaea were originally lumped in with bacteria because they look alike under a microscope. Comparing ribosomal RNA (rRNA) sequences showed their molecular machinery is deeply different, and that ARCHAEA ARE MORE CLOSELY RELATED TO EUKARYA — to us — than they are to Bacteria. Looking alike is not evidence of relatedness; shared sequence is.',
        'ARCHAEA AND EXTREME LIVING — many archaea are extremophiles: thermophiles in hot springs and deep-sea vents, halophiles in salt lakes, methanogens in swamps and in animal guts. Extremophile is a habitat description, not a taxonomic rank, and not every archaean is one.',
        'THE SIX KINGDOMS — Eubacteria and Archaebacteria (the two prokaryotic kingdoms, matching the Bacteria and Archaea domains), then four eukaryotic kingdoms: Protista, Fungi, Plantae, Animalia.',
        'THE THREE SORTING QUESTIONS — place any organism by asking, in order: (1) Prokaryote or eukaryote? (2) Unicellular or multicellular? (3) Autotroph or heterotroph? For a heterotroph add a fourth: does it ABSORB nutrients after digesting them outside its body (fungi) or INGEST food and digest it inside (animals)? Fungi are heterotrophs with cell walls of chitin — being rooted and immobile does NOT make something a plant.',
        'PROTISTA IS A LEFTOVER BIN — Protista was defined by what its members are NOT: eukaryotes that are not fungi, not plants, not animals. It contains organisms as unrelated to each other as amoebas, kelp, and Paramecium, so it does NOT form one branch on a phylogenetic tree. Modern classification is splitting it apart; expect the six-kingdom picture to keep changing.',
        'VIRUSES SIT OUTSIDE THE SYSTEM — a virus is genetic material (DNA or RNA) inside a protein coat called a CAPSID, sometimes with an outer envelope. It is ACELLULAR (not made of cells), has no metabolism of its own, and cannot reproduce without hijacking a host cell. Because it fails the characteristics of life, it belongs to no domain and no kingdom. This is also why antibiotics do nothing for a cold: antibiotics attack bacterial cell structures like cell walls and bacterial ribosomes, and a virus has neither.',
        'HOW VIRUSES REPRODUCE — in the LYTIC cycle the virus injects its genes, forces the host to build new virus particles, and bursts (lyses) the cell right away. In the LYSOGENIC cycle the viral genes instead integrate into the host DNA and are copied silently every time the cell divides, until some trigger switches the infection back to the lytic cycle. That dormant stage is why an infection like cold sores can reappear years later.',
      ],
      vocabulary: [
        { term: 'domain', definition: 'the broadest classification level, above kingdom: Bacteria, Archaea, or Eukarya.' },
        { term: 'capsid', definition: 'the protein coat enclosing a virus particle genetic material.' },
        { term: 'lysogenic cycle', definition: 'a viral cycle in which the viral genes integrate into host DNA and are copied silently before turning lytic.' },
      ],
      suggestedTools: ['show_concept_map', 'show_table', 'show_labeled_image'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-place-the-organism',
      kind: 'worked_example',
      problem:
        'An organism is found growing on a rotting log. It is multicellular, its cells each have a nucleus, it has cell walls made of chitin, it cannot make its own food, and it feeds by releasing digestive enzymes onto the dead wood and absorbing the broken-down nutrients. Which kingdom does it belong to, and which domain?',
      steps: [
        'Question 1 — prokaryote or eukaryote? Its cells have a nucleus, so it is a EUKARYOTE. That rules out Eubacteria and Archaebacteria immediately, and places it in domain Eukarya.',
        'Question 2 — unicellular or multicellular? It is multicellular, which rules out most of Protista.',
        'Question 3 — autotroph or heterotroph? It cannot make its own food, so it is a HETEROTROPH. That rules out Plantae, even though the organism is rooted in place and never moves.',
        'Follow-up question for heterotrophs — absorb or ingest? It digests the wood OUTSIDE its body and absorbs the nutrients, which is the fungal strategy, not the animal one. The chitin cell wall confirms it.',
        'Both answers now follow: kingdom Fungi, domain Eukarya.',
      ],
      answer: 'Kingdom Fungi, domain Eukarya — a multicellular eukaryotic heterotroph that absorbs nutrients after digesting them externally.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-virus-not-alive',
      kind: 'worked_example',
      problem:
        'A virus particle has DNA, it evolves over time, and it makes copies of itself inside a host. Biologists still refuse to place it in any kingdom. Test the virus against the characteristics of life and explain why it fails.',
      steps: [
        'Check cellular organization: every living thing is made of one or more cells. A virus is ACELLULAR — genetic material in a protein capsid, with no cytoplasm, no ribosomes, no cell membrane of its own making. First failure.',
        'Check metabolism: living things take in energy and run chemical reactions. A virus has no enzymes for energy use and does nothing at all outside a host — a virus particle on a doorknob is chemically inert. Second failure.',
        'Check independent reproduction: living things reproduce using their own machinery. A virus carries instructions but no machinery, so it must hijack a host cell ribosomes and enzymes to be copied. Third failure.',
        'Weigh what it DOES have: genetic material and evolution by natural selection are real, which is why the question is genuinely debated — but those two traits alone are not enough.',
        'Conclude: because a virus is not made of cells, has no metabolism, and cannot reproduce on its own, it sits outside the domains and kingdoms entirely rather than forming a seventh kingdom.',
      ],
      answer: 'It fails on cellular organization, metabolism, and independent reproduction — so it is classified outside the system, not as a kingdom of its own.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-place-mushroom-type',
      kind: 'try_yourself',
      problem:
        'An organism is multicellular, each of its cells has a nucleus, it is anchored in the soil and cannot move, it has cell walls, and it obtains food by secreting enzymes onto decaying leaves and absorbing the products. Which kingdom does it belong to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plantae, because it has cell walls and stays rooted in one place' },
        { id: 'b', text: 'Protista, because it is neither an animal nor a bacterium' },
        { id: 'c', text: 'Fungi, because it is a multicellular eukaryotic heterotroph that absorbs digested nutrients', correct: true },
        { id: 'd', text: 'Eubacteria, because organisms that live in soil are prokaryotes' },
      ],
      expectedAnswer: 'Fungi, because it is a multicellular eukaryotic heterotroph that absorbs digested nutrients',
      hints: [
        'Run the three sorting questions in order: nucleus or not, one cell or many, makes its own food or not.',
        'It cannot make its own food, so it is not a plant no matter how still it stands — now ask whether it absorbs or ingests.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-archaea-relatedness',
      kind: 'try_yourself',
      problem:
        'Ribosomal RNA sequencing of a thermophilic prokaryote from a hot spring shows its genetic machinery is far more similar to that of yeast and humans than to that of E. coli. What does this evidence support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Archaea share a more recent common ancestor with Eukarya than with Bacteria, which is why they were split into their own domain', correct: true },
        { id: 'b', text: 'Archaea and Bacteria are each other closest relatives, since both are prokaryotes that look alike under a microscope' },
        { id: 'c', text: 'Archaea are actually eukaryotes whose nuclei are too small to see' },
        { id: 'd', text: 'rRNA sequences are unreliable for classification, so cell shape should be used instead' },
      ],
      expectedAnswer: 'Archaea share a more recent common ancestor with Eukarya than with Bacteria, which is why they were split into their own domain',
      hints: [
        'Molecular similarity is evidence of shared ancestry; looking alike under a microscope is not.',
        'The result is the surprising one: the hot-spring prokaryote sides with the organisms that have nuclei.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-virus-classification',
      kind: 'try_yourself',
      problem:
        'A student with a common cold asks why the doctor will not prescribe antibiotics, and also which kingdom the cold virus belongs to. What is the correct response?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Antibiotics would work, but doctors save them for severe cases; the virus belongs to kingdom Eubacteria' },
        { id: 'b', text: 'Antibiotics kill all microbes including viruses; the virus belongs to a seventh kingdom created for viruses' },
        { id: 'c', text: 'Antibiotics only work on eukaryotes; the virus belongs to kingdom Protista along with other hard-to-place organisms' },
        { id: 'd', text: 'Antibiotics target bacterial structures such as cell walls and bacterial ribosomes, which a virus does not have; the virus belongs to no kingdom because it is acellular and cannot reproduce on its own', correct: true },
      ],
      expectedAnswer: 'Antibiotics target bacterial structures such as cell walls and bacterial ribosomes, which a virus does not have; the virus belongs to no kingdom because it is acellular and cannot reproduce on its own',
      hints: [
        'Ask what an antibiotic physically attacks, then ask whether a virus particle has that part.',
        'A virus is genetic material in a protein capsid with no cells and no metabolism — check whether that can sit in any kingdom.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fungi-are-plants',
      kind: 'misconception_check',
      question:
        'A student says: "Mushrooms grow in the ground, they have cell walls, and they never move, so they are obviously in kingdom Plantae." What went wrong?',
      commonErrors: [
        {
          answer: 'Mushrooms belong to kingdom Plantae',
          misconception: 'Sorting by appearance and lifestyle (rooted, still, cell walls) instead of by the defining trait — how the organism obtains its food.',
          correctsTo:
            'Fungi cannot photosynthesize. They are heterotrophs that digest food outside the body and absorb it, while plants are autotrophs that build their own sugar. The cell walls differ too: chitin in fungi, cellulose in plants. On a phylogenetic tree fungi actually sit CLOSER to animals than to plants — so "does not move" is never the deciding question.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three domains: Bacteria, Archaea, Eukarya. rRNA sequencing showed Archaea are more closely related to Eukarya than to Bacteria.',
        'Six kingdoms: Eubacteria, Archaebacteria, Protista, Fungi, Plantae, Animalia.',
        'Three sorting questions: prokaryote or eukaryote, unicellular or multicellular, autotroph or heterotroph — then, for heterotrophs, absorb (fungi) or ingest (animals).',
        'Protista is a leftover grouping of unrelated eukaryotes, so it does not form a single branch on a phylogenetic tree.',
        'A virus is genetic material in a protein capsid: acellular, no metabolism, needs a host to reproduce — so it belongs to no kingdom, and antibiotics do nothing against it.',
        'Lytic cycle: copy and burst the host cell now. Lysogenic cycle: integrate into host DNA and stay silent until triggered.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'The Three Domains, Six Kingdoms & Viruses' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
