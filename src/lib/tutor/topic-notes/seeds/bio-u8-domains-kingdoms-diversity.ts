/**
 * Biology — Unit 8 CED 8.3: The Three Domains, Six Kingdoms & Viruses.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.domains-kingdoms-diversity.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U8_DOMAINS_KINGDOMS_DIVERSITY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.domains-kingdoms-diversity.v1',
  course: 'Biology',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'The Three Domains, Six Kingdoms & Viruses',
  planId: 'evelyn.hs.bio.domains-kingdoms-diversity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.domains-kingdoms-diversity.v1' }],
  theory: [
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'The three domains', content: `THE THREE DOMAINS — the broadest level of classification: Bacteria, Archaea, and Eukarya. Bacteria and Archaea are both PROKARYOTIC (no nucleus, no membrane-bound organelles); Eukarya covers every organism whose cells have a nucleus, from an amoeba to a whale.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'Why the tree was redrawn', content: `WHY THE TREE WAS REDRAWN — Archaea were originally lumped in with bacteria because they look alike under a microscope. Comparing ribosomal RNA (rRNA) sequences showed their molecular machinery is deeply different, and that ARCHAEA ARE MORE CLOSELY RELATED TO EUKARYA — to us — than they are to Bacteria. Looking alike is not evidence of relatedness; shared sequence is.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'Archaea and extreme living', content: `ARCHAEA AND EXTREME LIVING — many archaea are extremophiles: thermophiles in hot springs and deep-sea vents, halophiles in salt lakes, methanogens in swamps and in animal guts. Extremophile is a habitat description, not a taxonomic rank, and not every archaean is one.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'The six kingdoms', content: `THE SIX KINGDOMS — Eubacteria and Archaebacteria (the two prokaryotic kingdoms, matching the Bacteria and Archaea domains), then four eukaryotic kingdoms: Protista, Fungi, Plantae, Animalia.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'The three sorting questions', content: `THE THREE SORTING QUESTIONS — place any organism by asking, in order: (1) Prokaryote or eukaryote? (2) Unicellular or multicellular? (3) Autotroph or heterotroph? For a heterotroph add a fourth: does it ABSORB nutrients after digesting them outside its body (fungi) or INGEST food and digest it inside (animals)? Fungi are heterotrophs with cell walls of chitin — being rooted and immobile does NOT make something a plant.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'Protista is a leftover bin', content: `PROTISTA IS A LEFTOVER BIN — Protista was defined by what its members are NOT: eukaryotes that are not fungi, not plants, not animals. It contains organisms as unrelated to each other as amoebas, kelp, and Paramecium, so it does NOT form one branch on a phylogenetic tree. Modern classification is splitting it apart; expect the six-kingdom picture to keep changing.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'Viruses sit outside the system', content: `VIRUSES SIT OUTSIDE THE SYSTEM — a virus is genetic material (DNA or RNA) inside a protein coat called a CAPSID, sometimes with an outer envelope. It is ACELLULAR (not made of cells), has no metabolism of its own, and cannot reproduce without hijacking a host cell. Because it fails the characteristics of life, it belongs to no domain and no kingdom. This is also why antibiotics do nothing for a cold: antibiotics attack bacterial cell structures like cell walls and bacterial ribosomes, and a virus has neither.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'framework', title: 'How viruses reproduce', content: `HOW VIRUSES REPRODUCE — in the LYTIC cycle the virus injects its genes, forces the host to build new virus particles, and bursts (lyses) the cell right away. In the LYSOGENIC cycle the viral genes instead integrate into the host DNA and are copied silently every time the cell divides, until some trigger switches the infection back to the lytic cycle. That dormant stage is why an infection like cold sores can reappear years later.` },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'definition', title: 'domain', content: 'the broadest classification level, above kingdom: Bacteria, Archaea, or Eukarya.' },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'definition', title: 'capsid', content: 'the protein coat enclosing a virus particle genetic material.' },
    { loId: 'bio.domains-kingdoms-diversity', kind: 'definition', title: 'lysogenic cycle', content: `a viral cycle in which the viral genes integrate into host DNA and are copied silently before turning lytic.` },
  ],
  methods: [
    {
      title: 'Worked place the organism',
      steps: [
        `Question 1 — prokaryote or eukaryote? Its cells have a nucleus, so it is a EUKARYOTE. That rules out Eubacteria and Archaebacteria immediately, and places it in domain Eukarya.`,
        `Question 2 — unicellular or multicellular? It is multicellular, which rules out most of Protista.`,
        `Question 3 — autotroph or heterotroph? It cannot make its own food, so it is a HETEROTROPH. That rules out Plantae, even though the organism is rooted in place and never moves.`,
        `Follow-up question for heterotrophs — absorb or ingest? It digests the wood OUTSIDE its body and absorbs the nutrients, which is the fungal strategy, not the animal one. The chitin cell wall confirms it.`,
        'Both answers now follow: kingdom Fungi, domain Eukarya.',
      ],
      example: { problem: `An organism is found growing on a rotting log. It is multicellular, its cells each have a nucleus, it has cell walls made of chitin, it cannot make its own food, and it feeds by releasing digestive enzymes onto the dead wood and absorbing the broken-down nutrients. Which kingdom does it belong to, and which domain?`, solution: `Kingdom Fungi, domain Eukarya — a multicellular eukaryotic heterotroph that absorbs nutrients after digesting them externally.` },
      relatedLoIds: ['bio.domains-kingdoms-diversity'],
    },
    {
      title: 'Worked virus not alive',
      steps: [
        `Check cellular organization: every living thing is made of one or more cells. A virus is ACELLULAR — genetic material in a protein capsid, with no cytoplasm, no ribosomes, no cell membrane of its own making. First failure.`,
        `Check metabolism: living things take in energy and run chemical reactions. A virus has no enzymes for energy use and does nothing at all outside a host — a virus particle on a doorknob is chemically inert. Second failure.`,
        `Check independent reproduction: living things reproduce using their own machinery. A virus carries instructions but no machinery, so it must hijack a host cell ribosomes and enzymes to be copied. Third failure.`,
        `Weigh what it DOES have: genetic material and evolution by natural selection are real, which is why the question is genuinely debated — but those two traits alone are not enough.`,
        `Conclude: because a virus is not made of cells, has no metabolism, and cannot reproduce on its own, it sits outside the domains and kingdoms entirely rather than forming a seventh kingdom.`,
      ],
      example: { problem: `A virus particle has DNA, it evolves over time, and it makes copies of itself inside a host. Biologists still refuse to place it in any kingdom. Test the virus against the characteristics of life and explain why it fails.`, solution: `It fails on cellular organization, metabolism, and independent reproduction — so it is classified outside the system, not as a kingdom of its own.` },
      relatedLoIds: ['bio.domains-kingdoms-diversity'],
    },
  ],
  pointers: [
    { content: `Fungi cannot photosynthesize. They are heterotrophs that digest food outside the body and absorb it, while plants are autotrophs that build their own sugar. The cell walls differ too: chitin in fungi, cellulose in plants. On a phylogenetic tree fungi actually sit CLOSER to animals than to plants — so "does not move" is never the deciding question.`, kind: 'common-error' },
    { content: `Three domains: Bacteria, Archaea, Eukarya. rRNA sequencing showed Archaea are more closely related to Eukarya than to Bacteria.`, kind: 'tip' },
    { content: 'Six kingdoms: Eubacteria, Archaebacteria, Protista, Fungi, Plantae, Animalia.', kind: 'tip' },
    { content: `Three sorting questions: prokaryote or eukaryote, unicellular or multicellular, autotroph or heterotroph — then, for heterotrophs, absorb (fungi) or ingest (animals).`, kind: 'tip' },
    { content: `Protista is a leftover grouping of unrelated eukaryotes, so it does not form a single branch on a phylogenetic tree.`, kind: 'tip' },
    { content: `A virus is genetic material in a protein capsid: acellular, no metabolism, needs a host to reproduce — so it belongs to no kingdom, and antibiotics do nothing against it.`, kind: 'tip' },
    { content: `Lytic cycle: copy and burst the host cell now. Lysogenic cycle: integrate into host DNA and stay silent until triggered.`, kind: 'tip' },
    { content: `Don't use "immobile + cell walls = plant." The deciding question is nutrition: plants are autotrophs with cellulose walls; fungi are heterotrophs with **chitin** walls that digest externally and absorb. Fungi sit closer to animals than to plants on the tree.`, kind: 'common-error' },
    { content: `"Extremophile" is a habitat description, not a taxon. Not all archaea are extremophiles (methanogens live in cow guts), and some bacteria tolerate extremes too. Never write "Domain Extremophile."`, kind: 'vocab-note' },
    { content: `Similar appearance is not evidence of relatedness — **rRNA sequence** is. Archaea look like bacteria under a microscope but share a more recent common ancestor with Eukarya. Cite molecular data, not morphology, when justifying the three-domain split.`, kind: 'gotcha' },
    { content: `Viruses are classified OUTSIDE the system — not as a seventh kingdom and not in Domain Bacteria. Say "acellular, no metabolism, cannot reproduce independently," and note that having DNA/RNA and evolving is not enough to count as alive.`, kind: 'common-error' },
    { content: `Antibiotics fail against viruses because viruses have no cell wall and no bacterial ribosomes — not because viruses are "too small" or "resistant." Name the missing target structure in your answer.`, kind: 'tip' },
    { content: `Protista is a leftover bin defined by what its members are NOT. Amoebas, kelp, and Paramecium are not one branch on a phylogenetic tree, so never call Protista a monophyletic group or a single lineage.`, kind: 'edge-case' },
    { content: `Multicellular does not automatically rule out Protista — kelp is a multicellular protist. Use multicellularity to narrow, then confirm with nutrition and structure (chitin, cellulose, ingestion) before committing.`, kind: 'edge-case' },
    { content: `Lysogenic ≠ dead or harmless. In the lysogenic cycle viral DNA integrates into host DNA and is copied silently at every cell division until a trigger flips it lytic — that's why cold sores return. Lytic = build and burst now.`, kind: 'gotcha' },
  ],
};
