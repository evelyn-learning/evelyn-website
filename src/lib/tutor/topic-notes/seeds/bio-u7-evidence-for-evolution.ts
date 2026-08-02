/**
 * Biology — Unit 7 CED 7.1: Evidence for Evolution.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.evidence-for-evolution.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U7_EVIDENCE_FOR_EVOLUTION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.evidence-for-evolution.v1',
  course: 'Biology',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Evidence for Evolution',
  planId: 'evelyn.hs.bio.evidence-for-evolution.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.evidence-for-evolution.v1' }],
  theory: [
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'The core argument', content: `THE CORE ARGUMENT — no single fossil or gene "proves" evolution. The strength is CONVERGENCE: fossils, anatomy, embryos, DNA, and geography are collected by different scientists using different methods, and they keep producing the same family tree. Independent methods agreeing is the strongest kind of scientific evidence.` },
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'The fossil record', content: `THE FOSSIL RECORD — sedimentary rock stacks in layers, so deeper generally means older. TRANSITIONAL fossils show a mix of features from two groups: Tiktaalik is a fish with gills and scales but also a neck, weight-bearing ribs, and limb bones inside its fins; Archaeopteryx has feathers and wings alongside teeth, claws, and a bony tail. These were often PREDICTED before they were found — scientists searched rocks of a specific age and found the expected intermediate.` },
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'Homologous structures', content: `HOMOLOGOUS STRUCTURES — SAME underlying structure, DIFFERENT function, inherited from a shared ancestor. The tetrapod forelimb is the classic case: human arm, bat wing, whale flipper, and horse leg all run one bone (humerus), then two (radius and ulna), then wrist bones, then digits. Lifting, flying, swimming, running — one inherited plan, remodeled. Homology is evidence of COMMON ANCESTRY.` },
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'Analogous structures', content: `ANALOGOUS STRUCTURES — SAME function, DIFFERENT underlying structure and separate origins. A bird wing is a modified forelimb with internal bones; an insect wing is a flap of the exoskeleton with no bones at all. Both fly; neither inherited flight from a shared winged ancestor. Analogy is evidence of CONVERGENT EVOLUTION — similar environmental pressures producing similar solutions independently.` },
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'How to tell them apart', content: `HOW TO TELL THEM APART — do NOT ask "do they do the same job?" Ask "is the internal construction the same?" Same bones or tissues in the same arrangement, even doing different jobs, means HOMOLOGOUS. Same job built from different parts means ANALOGOUS. Shared function is the trap; shared blueprint is the evidence.` },
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'Vestigial structures and embryology', content: `VESTIGIAL STRUCTURES AND EMBRYOLOGY — vestigial structures are inherited leftovers that no longer serve their original function: hip and hind-limb bones buried in whales, wings on flightless ostriches and kiwis, the human tailbone. Comparative embryology adds another layer — fish, chicken, and human embryos all pass through a stage with a tail and pharyngeal (gill-like) arches, because they share an inherited developmental program even where the adults look nothing alike.` },
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'Molecular evidence', content: `MOLECULAR EVIDENCE — the rule is simple: the MORE SIMILAR the DNA and protein sequences, the MORE RECENT the common ancestor. Humans and chimpanzees share roughly 98 to 99 percent of their DNA; humans and mice far less; humans and yeast far less again. And the genetic code itself is essentially UNIVERSAL — the same codons specify the same amino acids in bacteria, oak trees, and humans, which is what you expect if all life inherited one code rather than each lineage inventing its own.` },
    { loId: 'bio.evidence-for-evolution', kind: 'framework', title: 'Biogeography and evolution in real time', content: `BIOGEOGRAPHY AND EVOLUTION IN REAL TIME — geography carries the same signal: isolated Australia has marsupials found nowhere else, and island groups such as the Galapagos hold clusters of closely related species that differ island to island. And evolution is not only historical. Bacteria exposed to an antibiotic are mostly killed, the few resistant survivors reproduce, and within months the population is dominated by resistant strains — an allele-frequency shift you can measure in a lab or a hospital ward.` },
    { loId: 'bio.evidence-for-evolution', kind: 'definition', title: 'homologous structure', content: `a structure with the same underlying anatomy in different species, inherited from a shared ancestor even when the functions differ.` },
    { loId: 'bio.evidence-for-evolution', kind: 'definition', title: 'analogous structure', content: `a structure serving the same function in different species but built from different parts with separate evolutionary origins.` },
    { loId: 'bio.evidence-for-evolution', kind: 'definition', title: 'vestigial structure', content: `an inherited structure that has lost its original function but is still present in reduced form.` },
    { loId: 'bio.evidence-for-evolution', kind: 'definition', title: 'convergent evolution', content: `the independent evolution of similar traits in unrelated lineages facing similar environmental pressures.` },
  ],
  methods: [
    {
      title: 'Worked homologous vs analogous',
      steps: [
        `Ignore what each structure DOES first — both pairs share a function (Pair 1 swims, Pair 2 flies), and shared function is exactly the trap. Compare internal construction instead.`,
        `Pair 1: the dolphin flipper has the one-bone, two-bone, wrist, digits arrangement — the standard tetrapod forelimb plan. The shark fin has cartilage rods and no limb bones at all. Different construction, same job, so the pair is ANALOGOUS: streamlined swimming appendages evolved twice, independently.`,
        `Pair 2: the bat wing has the one-bone, two-bone, wrist, digits plan again. The butterfly wing is exoskeleton with veins and no bones. Different construction, same job, so this pair is also ANALOGOUS: flight evolved separately in insects and in mammals.`,
        `Now notice the cross-pair comparison that IS homologous: the dolphin flipper and the bat wing share the same forelimb bone plan while doing completely different jobs (swimming versus flying). That is homology, and it points to a shared tetrapod ancestor whose forelimb was remodeled in each lineage.`,
        `State the evidence each type provides: analogous structures are evidence of CONVERGENT EVOLUTION under similar pressures; homologous structures are evidence of COMMON ANCESTRY.`,
      ],
      example: { problem: `Compare two pairs of swimming and flying structures. Pair 1: a dolphin flipper, which contains a single upper-arm bone, two forearm bones, wrist bones, and five sets of finger bones; and a shark fin, which contains no such bones and is stiffened instead by rods of cartilage. Pair 2: a bat wing, which contains a single upper-arm bone, two forearm bones, and long finger bones spreading a skin membrane; and a butterfly wing, which contains no bones and is a thin extension of the exoskeleton supported by hollow veins. Classify each pair as homologous or analogous, and state what each pair is evidence for.`, solution: `Both pairs are analogous (same function, different construction) and show convergent evolution; the dolphin flipper and bat wing compared to each other are homologous and show common ancestry.` },
      relatedLoIds: ['bio.evidence-for-evolution'],
    },
    {
      title: 'Worked molecular similarity',
      steps: [
        `State the rule being applied: sequence differences accumulate as mutations over time after two lineages split, so the more similar two sequences are, the LESS time has passed since their lineages separated — that is, the more recent their common ancestor.`,
        `Rank the four species by similarity to humans: W at 98 percent, then X at 92, then Y at 85, then Z at 60.`,
        `The highest similarity, Species W at 98 percent, means the fewest accumulated differences and therefore the MOST RECENT common ancestor with humans.`,
        `The lowest similarity, Species Z at 60 percent, means the most accumulated differences and therefore the MOST DISTANT common ancestor — the lineages split longest ago.`,
        `Interpret the shared code: every one of these species carries a recognizable version of the same gene and reads it with the same codon-to-amino-acid assignments. That universality is what you expect if all four inherited the gene and the code from a single ancestral population, and not what you would expect if each lineage had originated independently.`,
        `Add the caution that keeps the reasoning honest: percent similarity ranks how recent each split was, but it does NOT mean humans descended from W, X, Y, or Z. All five species are living endpoints; the ancestors they share are extinct populations, not any modern species on the list.`,
      ],
      example: { problem: `A lab compares the DNA sequence of one gene in four species against the human version and reports the percent of the sequence that matches: Species W matches 98 percent, Species X matches 92 percent, Species Y matches 85 percent, and Species Z matches 60 percent. Which species shares the most recent common ancestor with humans, which shares the most distant one, and what does the fact that all four species use the SAME gene and the same genetic code tell you?`, solution: `Species W (98 percent) shares the most recent common ancestor and Species Z (60 percent) the most distant; the shared gene and universal genetic code indicate all four species inherited them from a single common ancestor.` },
      relatedLoIds: ['bio.evidence-for-evolution'],
    },
  ],
  pointers: [
    { content: `High DNA similarity means humans and chimpanzees share a recent COMMON ANCESTOR, not that one descended from the other. That ancestor was an extinct ape species, and chimpanzees have been evolving along their own branch for just as long as humans have. Evolution also has no goal and no direction: it is a change in allele frequencies caused by which individuals survive and reproduce in a particular environment. There is no "working up toward" anything — a bacterium that thrives is exactly as evolved as we are.`, kind: 'common-error' },
    { content: `The argument is convergence: fossils, anatomy, embryos, DNA, and biogeography are independent methods that keep producing the same family tree.`, kind: 'tip' },
    { content: `HOMOLOGOUS = same underlying structure, different function (the tetrapod forelimb in arm, wing, flipper, and leg) — evidence of COMMON ANCESTRY.`, kind: 'tip' },
    { content: `ANALOGOUS = same function, different construction (bird wing versus insect wing) — evidence of CONVERGENT EVOLUTION. Classify by blueprint, never by job.`, kind: 'tip' },
    { content: `Vestigial structures (whale hip bones, ostrich wings, the human tailbone) and shared embryonic stages are inherited leftovers from ancestors.`, kind: 'tip' },
    { content: `More similar DNA and proteins means a more recent common ancestor, and the near-universal genetic code points to a single origin for all life.`, kind: 'tip' },
    { content: `Living species are cousins, not ancestors: humans did not evolve from monkeys, and evolution has no goal or direction — as antibiotic resistance evolving in weeks shows.`, kind: 'tip' },
    { content: `Classify by BLUEPRINT, not by job. Shared function is the trap. Ask "same bones/tissues in the same arrangement?" — yes means homologous even if one swims and one flies; no means analogous even if both fly.`, kind: 'common-error' },
    { content: `Say "shares a more recent common ancestor with," not "evolved from." 98% DNA similarity to chimps means humans and chimps both descend from an extinct ancestral species — chimps are cousins on their own branch, not our ancestors.`, kind: 'vocab-note' },
    { content: `Vestigial does NOT mean useless. It means the structure lost its ORIGINAL function; whale hip bones and the human tailbone still anchor muscles. Define it as "reduced, no longer serving its ancestral function."`, kind: 'vocab-note' },
    { content: `Never argue from one line of evidence alone. Full-credit reasoning names at least two INDEPENDENT sources (e.g. fossils + DNA, or embryology + anatomy) and states that different methods converge on the same tree.`, kind: 'tip' },
    { content: `Higher percent similarity = MORE recent split = FEWER accumulated mutations. Students flip this and call the 60%-match species the closest relative. Check your ranking against the logic: more time apart → more differences.`, kind: 'common-error' },
    { content: `Convergent evolution produces ANALOGOUS structures — don't confuse it with the "convergence of evidence" argument (independent methods agreeing). Same word, two completely different ideas in this lesson.`, kind: 'gotcha' },
    { content: `In the antibiotic case, the drug does not CREATE resistance. The resistant mutation already existed in ~1% of cells; the antibiotic only selected which cells survived and reproduced. Say "selected for," never "caused a mutation."`, kind: 'common-error' },
    { content: `Deeper rock layers are generally older, but only within an undisturbed sequence — folding, faulting, and erosion can scramble the order. And a transitional fossil is a mix of features from two groups, not a "missing link" between two living species.`, kind: 'edge-case' },
  ],
};
