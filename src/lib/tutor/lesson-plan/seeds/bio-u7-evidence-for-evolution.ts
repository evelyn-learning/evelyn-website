/**
 * Biology — Evolution: Evidence for Evolution.
 *
 * The concept/process template for the HS Biology fan-out (NGSS HS-LS4-1).
 * The whole lesson is one argument: several INDEPENDENT lines of evidence
 * point at the same conclusion. Most student errors here are classification
 * errors (calling any shared function "homologous") or story errors
 * (evolution as a ladder aimed at humans), so the concept segment is
 * organized around the same-plan / same-job distinction and the ancestry
 * bookkeeping that follows from it.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U7_EVIDENCE_FOR_EVOLUTION: LessonPlan = {
  id: 'evelyn.hs.bio.evidence-for-evolution.v1',
  title: 'Evidence for Evolution',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.evidence-for-evolution',
      standard: 'BIO-7.1',
      description:
        'Use independent lines of evidence — the fossil record, homologous and vestigial structures, comparative embryology, DNA and protein comparisons, and biogeography — to construct and support an explanation of common ancestry (NGSS HS-LS4-1).',
    },
  ],
  prerequisites: ['bio.biotechnology'],
  followUps: ['bio.natural-selection'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame common ancestry as a conclusion that many separate fields reached independently — and that still matters this year, in hospitals.',
      script:
        'Hold your arm out and bend it. Inside it: one long bone, then two side by side, then a cluster of small bones, then five digits. A bat wing has exactly that layout. So does a whale flipper, and a horse leg. Four animals, four completely different jobs, one shared blueprint. Paleontologists digging rock, embryologists watching eggs develop, and geneticists reading DNA all arrived at the same explanation without consulting each other — and the same process is running right now in hospitals, where bacteria evolve resistance to our antibiotics in a matter of months. In this lesson you learn to read each line of evidence, and to tell the two kinds of look-alike structures apart.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-lines-of-evidence',
      kind: 'concept',
      goal: 'The independent lines of evidence, the homologous/analogous distinction, and the ancestry reasoning that molecular data supports.',
      keyIdeas: [
        'THE CORE ARGUMENT — no single fossil or gene "proves" evolution. The strength is CONVERGENCE: fossils, anatomy, embryos, DNA, and geography are collected by different scientists using different methods, and they keep producing the same family tree. Independent methods agreeing is the strongest kind of scientific evidence.',
        'THE FOSSIL RECORD — sedimentary rock stacks in layers, so deeper generally means older. TRANSITIONAL fossils show a mix of features from two groups: Tiktaalik is a fish with gills and scales but also a neck, weight-bearing ribs, and limb bones inside its fins; Archaeopteryx has feathers and wings alongside teeth, claws, and a bony tail. These were often PREDICTED before they were found — scientists searched rocks of a specific age and found the expected intermediate.',
        'HOMOLOGOUS STRUCTURES — SAME underlying structure, DIFFERENT function, inherited from a shared ancestor. The tetrapod forelimb is the classic case: human arm, bat wing, whale flipper, and horse leg all run one bone (humerus), then two (radius and ulna), then wrist bones, then digits. Lifting, flying, swimming, running — one inherited plan, remodeled. Homology is evidence of COMMON ANCESTRY.',
        'ANALOGOUS STRUCTURES — SAME function, DIFFERENT underlying structure and separate origins. A bird wing is a modified forelimb with internal bones; an insect wing is a flap of the exoskeleton with no bones at all. Both fly; neither inherited flight from a shared winged ancestor. Analogy is evidence of CONVERGENT EVOLUTION — similar environmental pressures producing similar solutions independently.',
        'HOW TO TELL THEM APART — do NOT ask "do they do the same job?" Ask "is the internal construction the same?" Same bones or tissues in the same arrangement, even doing different jobs, means HOMOLOGOUS. Same job built from different parts means ANALOGOUS. Shared function is the trap; shared blueprint is the evidence.',
        'VESTIGIAL STRUCTURES AND EMBRYOLOGY — vestigial structures are inherited leftovers that no longer serve their original function: hip and hind-limb bones buried in whales, wings on flightless ostriches and kiwis, the human tailbone. Comparative embryology adds another layer — fish, chicken, and human embryos all pass through a stage with a tail and pharyngeal (gill-like) arches, because they share an inherited developmental program even where the adults look nothing alike.',
        'MOLECULAR EVIDENCE — the rule is simple: the MORE SIMILAR the DNA and protein sequences, the MORE RECENT the common ancestor. Humans and chimpanzees share roughly 98 to 99 percent of their DNA; humans and mice far less; humans and yeast far less again. And the genetic code itself is essentially UNIVERSAL — the same codons specify the same amino acids in bacteria, oak trees, and humans, which is what you expect if all life inherited one code rather than each lineage inventing its own.',
        'BIOGEOGRAPHY AND EVOLUTION IN REAL TIME — geography carries the same signal: isolated Australia has marsupials found nowhere else, and island groups such as the Galapagos hold clusters of closely related species that differ island to island. And evolution is not only historical. Bacteria exposed to an antibiotic are mostly killed, the few resistant survivors reproduce, and within months the population is dominated by resistant strains — an allele-frequency shift you can measure in a lab or a hospital ward.',
      ],
      vocabulary: [
        { term: 'homologous structure', definition: 'a structure with the same underlying anatomy in different species, inherited from a shared ancestor even when the functions differ.' },
        { term: 'analogous structure', definition: 'a structure serving the same function in different species but built from different parts with separate evolutionary origins.' },
        { term: 'vestigial structure', definition: 'an inherited structure that has lost its original function but is still present in reduced form.' },
        { term: 'convergent evolution', definition: 'the independent evolution of similar traits in unrelated lineages facing similar environmental pressures.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_table', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-homologous-vs-analogous',
      kind: 'worked_example',
      problem:
        'Compare two pairs of swimming and flying structures. Pair 1: a dolphin flipper, which contains a single upper-arm bone, two forearm bones, wrist bones, and five sets of finger bones; and a shark fin, which contains no such bones and is stiffened instead by rods of cartilage. Pair 2: a bat wing, which contains a single upper-arm bone, two forearm bones, and long finger bones spreading a skin membrane; and a butterfly wing, which contains no bones and is a thin extension of the exoskeleton supported by hollow veins. Classify each pair as homologous or analogous, and state what each pair is evidence for.',
      steps: [
        'Ignore what each structure DOES first — both pairs share a function (Pair 1 swims, Pair 2 flies), and shared function is exactly the trap. Compare internal construction instead.',
        'Pair 1: the dolphin flipper has the one-bone, two-bone, wrist, digits arrangement — the standard tetrapod forelimb plan. The shark fin has cartilage rods and no limb bones at all. Different construction, same job, so the pair is ANALOGOUS: streamlined swimming appendages evolved twice, independently.',
        'Pair 2: the bat wing has the one-bone, two-bone, wrist, digits plan again. The butterfly wing is exoskeleton with veins and no bones. Different construction, same job, so this pair is also ANALOGOUS: flight evolved separately in insects and in mammals.',
        'Now notice the cross-pair comparison that IS homologous: the dolphin flipper and the bat wing share the same forelimb bone plan while doing completely different jobs (swimming versus flying). That is homology, and it points to a shared tetrapod ancestor whose forelimb was remodeled in each lineage.',
        'State the evidence each type provides: analogous structures are evidence of CONVERGENT EVOLUTION under similar pressures; homologous structures are evidence of COMMON ANCESTRY.',
      ],
      answer:
        'Both pairs are analogous (same function, different construction) and show convergent evolution; the dolphin flipper and bat wing compared to each other are homologous and show common ancestry.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-molecular-similarity',
      kind: 'worked_example',
      problem:
        'A lab compares the DNA sequence of one gene in four species against the human version and reports the percent of the sequence that matches: Species W matches 98 percent, Species X matches 92 percent, Species Y matches 85 percent, and Species Z matches 60 percent. Which species shares the most recent common ancestor with humans, which shares the most distant one, and what does the fact that all four species use the SAME gene and the same genetic code tell you?',
      steps: [
        'State the rule being applied: sequence differences accumulate as mutations over time after two lineages split, so the more similar two sequences are, the LESS time has passed since their lineages separated — that is, the more recent their common ancestor.',
        'Rank the four species by similarity to humans: W at 98 percent, then X at 92, then Y at 85, then Z at 60.',
        'The highest similarity, Species W at 98 percent, means the fewest accumulated differences and therefore the MOST RECENT common ancestor with humans.',
        'The lowest similarity, Species Z at 60 percent, means the most accumulated differences and therefore the MOST DISTANT common ancestor — the lineages split longest ago.',
        'Interpret the shared code: every one of these species carries a recognizable version of the same gene and reads it with the same codon-to-amino-acid assignments. That universality is what you expect if all four inherited the gene and the code from a single ancestral population, and not what you would expect if each lineage had originated independently.',
        'Add the caution that keeps the reasoning honest: percent similarity ranks how recent each split was, but it does NOT mean humans descended from W, X, Y, or Z. All five species are living endpoints; the ancestors they share are extinct populations, not any modern species on the list.',
      ],
      answer:
        'Species W (98 percent) shares the most recent common ancestor and Species Z (60 percent) the most distant; the shared gene and universal genetic code indicate all four species inherited them from a single common ancestor.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-wings',
      kind: 'try_yourself',
      problem:
        'A bird wing contains an upper-arm bone, two forearm bones, and fused hand bones. An insect wing contains no bones and is a thin outgrowth of the exoskeleton. Both are used for powered flight. How should these two wings be classified, and what are they evidence for?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Homologous, because both structures are used for flight, which shows the bird and the insect inherited flight from a shared winged ancestor' },
        { id: 'b', text: 'Analogous, because the wings do the same job but are built from completely different parts, which shows convergent evolution', correct: true },
        { id: 'c', text: 'Homologous, because insects and birds both have wings that spread out from the body in a similar shape' },
        { id: 'd', text: 'Vestigial, because both wings have lost their original function over evolutionary time' },
      ],
      expectedAnswer: 'Analogous, because the wings do the same job but are built from completely different parts, which shows convergent evolution',
      hints: [
        'Do not classify by what the structures DO. Ask instead whether the internal construction is the same.',
        'One wing has limb bones inside it and the other has none — same job, different blueprint. Which term describes that, and which process does it point to?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-molecular-ancestry',
      kind: 'try_yourself',
      problem:
        'Sequencing one gene in three species and comparing each to the human version gives these matches: Species A matches 98 percent, Species B matches 85 percent, and Species C matches 74 percent. Which conclusion is best supported?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Species C is the most highly evolved of the three, because it has changed the most since the split from humans' },
        { id: 'b', text: 'Humans are descended from Species A, because a 98 percent match is close enough to be a direct ancestor' },
        { id: 'c', text: 'Species C shares the most recent common ancestor with humans, because a 74 percent match leaves the most room for further change' },
        { id: 'd', text: 'Species A shares the most recent common ancestor with humans, because fewer sequence differences mean less time since the two lineages split', correct: true },
      ],
      expectedAnswer: 'Species A shares the most recent common ancestor with humans, because fewer sequence differences mean less time since the two lineages split',
      hints: [
        'Sequence differences pile up as mutations after two lineages separate. So what does a HIGH percent match say about how long ago the split happened?',
        'Rank the three matches, then remember that a living species is a cousin, never the ancestor — the shared ancestor is an extinct population.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-antibiotic-resistance',
      kind: 'try_yourself',
      problem:
        'A hospital treats a bacterial infection with an antibiotic. On day 1, about 1 percent of the bacterial population carries a mutation that makes it resistant to the drug. Most of the rest are killed by the antibiotic. Three weeks later, roughly 90 percent of the bacteria in the population are resistant. What best explains the change?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The resistant bacteria survived the antibiotic and reproduced, so their proportion of the population rose over many generations', correct: true },
        { id: 'b', text: 'The antibiotic caused individual bacteria to develop resistance because they needed it to survive' },
        { id: 'c', text: 'Individual bacteria adapted during their own lifetimes by becoming stronger each time they were exposed to the drug' },
        { id: 'd', text: 'The bacteria evolved toward a more advanced final form, since evolution moves populations toward greater complexity' },
      ],
      expectedAnswer: 'The resistant bacteria survived the antibiotic and reproduced, so their proportion of the population rose over many generations',
      hints: [
        'The resistance mutation was already present in about 1 percent of the population on day 1, before the drug was given. What did the antibiotic actually do to the rest?',
        'Evolution changes the makeup of a POPULATION across generations; it does not give an individual a trait because that individual needs it, and it is not aimed at any goal.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-humans-from-monkeys',
      kind: 'misconception_check',
      question:
        'A student says: "Human DNA is about 98 percent the same as chimpanzee DNA, so humans evolved from monkeys — and evolution has been working its way up toward us the whole time." What went wrong?',
      commonErrors: [
        {
          answer: 'Humans evolved from monkeys, and evolution progresses toward humans',
          misconception:
            'Reading a family tree as a LADDER — treating living relatives as ancestors, and treating evolution as goal-directed progress with humans at the top.',
          correctsTo:
            'High DNA similarity means humans and chimpanzees share a recent COMMON ANCESTOR, not that one descended from the other. That ancestor was an extinct ape species, and chimpanzees have been evolving along their own branch for just as long as humans have. Evolution also has no goal and no direction: it is a change in allele frequencies caused by which individuals survive and reproduce in a particular environment. There is no "working up toward" anything — a bacterium that thrives is exactly as evolved as we are.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The argument is convergence: fossils, anatomy, embryos, DNA, and biogeography are independent methods that keep producing the same family tree.',
        'HOMOLOGOUS = same underlying structure, different function (the tetrapod forelimb in arm, wing, flipper, and leg) — evidence of COMMON ANCESTRY.',
        'ANALOGOUS = same function, different construction (bird wing versus insect wing) — evidence of CONVERGENT EVOLUTION. Classify by blueprint, never by job.',
        'Vestigial structures (whale hip bones, ostrich wings, the human tailbone) and shared embryonic stages are inherited leftovers from ancestors.',
        'More similar DNA and proteins means a more recent common ancestor, and the near-universal genetic code points to a single origin for all life.',
        'Living species are cousins, not ancestors: humans did not evolve from monkeys, and evolution has no goal or direction — as antibiotic resistance evolving in weeks shows.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Evidence for Evolution' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
