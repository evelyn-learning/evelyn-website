/**
 * Grade 7 Science — Unit 8 CED 8.1: Why We Classify Living Things.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.classifying-living-things.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U8_CLASSIFYING_LIVING_THINGS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.classifying-living-things.v1',
  course: 'Grade 7 Science',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Why We Classify Living Things',
  planId: 'evelyn.ms.m7sci.classifying-living-things.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.classifying-living-things.v1' }],
  theory: [
    { loId: 'm7sci.classifying-living-things', kind: 'framework', title: 'The problem with everyday names', content: `THE PROBLEM WITH EVERYDAY NAMES — a common name is whatever the people nearby happen to say. That breaks in two directions at once. One animal can carry many names in different places and different languages. And one name can point to different animals: the bird called a robin in North America and the bird called a robin in Britain are two different birds that are not close relatives. If two scientists cannot be sure they are talking about the same organism, they cannot compare their results at all.` },
    { loId: 'm7sci.classifying-living-things', kind: 'framework', title: 'One name per species', content: `ONE NAME PER SPECIES — the fix is BINOMIAL NOMENCLATURE, a two-word naming system set up by Carolus Linnaeus in the 1700s. The first word is the GENUS and the second word is the SPECIES name. Humans are Homo sapiens. The lion is Panthera leo. The tiger is Panthera tigris. Notice that the lion and the tiger share their first word, so the name itself already tells you they are placed in the same genus. A scientific name is not Latin decoration. It is an address.` },
    { loId: 'm7sci.classifying-living-things', kind: 'framework', title: 'How to write one', content: `HOW TO WRITE ONE — the genus is capitalized, the species name is lowercase, and both words are italicized when typed (or underlined when written by hand). Panthera leo is correct. Panthera Leo, panthera leo, and leo Panthera are all wrong. Getting this right is a small habit that makes your writing readable by any scientist anywhere.` },
    { loId: 'm7sci.classifying-living-things', kind: 'framework', title: 'Groups inside groups', content: `GROUPS INSIDE GROUPS — every organism is filed into a set of nested groups, from the widest to the narrowest: DOMAIN, KINGDOM, PHYLUM, CLASS, ORDER, FAMILY, GENUS, SPECIES. Think of boxes packed inside boxes. An organism inside a family is also inside the order that holds that family, and inside the class that holds that order, all the way up. So an organism is not in one group. It is in all eight at once, and each step down is a smaller, more particular group.` },
    { loId: 'm7sci.classifying-living-things', kind: 'framework', title: 'What the groups actually mean now', content: `WHAT THE GROUPS ACTUALLY MEAN NOW — modern classification groups organisms by shared ANCESTRY. Scientists compare DNA as well as body structures, and organisms placed in the same group are placed there because the evidence says they descended from the same ancestor. The further down two organisms stay together, the more recent the ancestor they share. This is why Unit 7 came first: classification is the family tree, written out as groups.` },
    { loId: 'm7sci.classifying-living-things', kind: 'framework', title: 'Why it changes, and what it is not', content: `WHY IT CHANGES, AND WHAT IT IS NOT — because the groups are a claim about ancestry, new evidence can improve them, and organisms do get moved. Revision is the system working, not the system failing. Two warnings go with this. Looking alike is not proof of kinship, because similar ways of living can produce similar body parts in separate lines, exactly like the analogous structures from Unit 7. And the group names and boundaries are a human-made filing system laid over real relationships, so the lines are ours even though the ancestry is real. Even the word species can be hard to draw a sharp edge around, and scientists still argue about some cases. No group is higher, lower, simpler or more advanced than any other.` },
    { loId: 'm7sci.classifying-living-things', kind: 'definition', title: 'classification', content: `sorting living things into groups based on what the evidence says about how they are related.` },
    { loId: 'm7sci.classifying-living-things', kind: 'definition', title: 'taxonomy', content: `the branch of science that names living things and organizes them into those groups.` },
    { loId: 'm7sci.classifying-living-things', kind: 'definition', title: 'binomial nomenclature', content: `the two-word naming system, genus plus species name, that gives each species one scientific name used worldwide.` },
    { loId: 'm7sci.classifying-living-things', kind: 'definition', title: 'genus', content: `the group just above species, and the first word of a scientific name; organisms in one genus are very closely related.` },
    { loId: 'm7sci.classifying-living-things', kind: 'definition', title: 'species', content: `a group of organisms so closely related that they can reproduce together and produce offspring that can also reproduce; the edges of this idea are genuinely hard to draw in some cases.` },
    { loId: 'm7sci.classifying-living-things', kind: 'definition', title: 'common ancestor', content: `an organism from the past that two or more later kinds of organism both descended from.` },
  ],
  methods: [
    {
      title: 'Worked nested groups',
      steps: [
        `Start at the top of each list and compare one level at a time. Domain matches. Kingdom matches. Phylum matches. Class matches. Order matches. Family matches: both are in Felidae.`,
        `Keep going. At Genus the two lists split. The house cat is in Felis and the lion is in Panthera. Below that they differ again, at the species name.`,
        `Now say what the nesting means. Every animal in the Family Felidae is also in the Order Carnivora, and every animal in Carnivora is also in the Class Mammalia. The smaller box sits inside the larger one, so being in Felidae automatically means being in all the groups above it.`,
        `That is why an organism is not filed in one group. It is filed in all eight at the same time, and each step down names a smaller and more particular set of relatives.`,
        `Build the scientific names from the last two levels, because the two-word name is exactly genus plus species name. The house cat is Felis catus. The lion is Panthera leo. In both, the genus is capitalized, the species name is lowercase, and both words are italicized.`,
        `Read what the shared levels tell you. These two share every group down to Family Felidae, which means the evidence places them in the same branch of the cat family and says they share a common ancestor. It does NOT mean one of them is above the other or further along than the other. Groups describe relationships, not rank.`,
      ],
      example: { problem: `Here is how two animals are classified. The house cat: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Felidae, Genus Felis, species catus. The lion: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Felidae, Genus Panthera, species leo. Explain what "groups inside groups" means using these two animals, and write the scientific name of each animal correctly.`, solution: `The two share every level from Domain down through Family Felidae and split at Genus, because each group nests inside the one above it, so an organism belongs to all eight groups at once. Their scientific names are Felis catus and Panthera leo, each written with a capitalized genus, a lowercase species name, and both words italicized.` },
      relatedLoIds: ['m7sci.classifying-living-things'],
    },
    {
      title: 'Worked classification changes',
      steps: [
        `Ask what the old grouping was based on. It was based on shared body features connected to hunting: the hooked beak and the curved claws.`,
        `Ask what classification is supposed to show. It is supposed to show shared ancestry, meaning which organisms descended from the same ancestor.`,
        `Now put those two together. A hooked beak is very useful for a bird that tears food, so it can appear in two separate lines of birds that both hunt that way. Those are analogous structures from Unit 7: similar because of similar living, not because of a shared ancestor.`,
        `Ask why DNA changed the answer. DNA is inherited directly from ancestors, so comparing DNA is a much more direct record of ancestry than comparing body parts that a similar way of living could have shaped separately.`,
        `When the ancestry evidence and the appearance evidence disagree, the ancestry evidence decides the grouping. So falcons were moved onto a different branch. Nothing about the birds changed at all. Only our picture of who is related to whom got better.`,
        `WRONG way to read this: "Scientists were wrong before, so classification is unreliable." CORRECT way: "Scientists grouped using the best evidence they had, better evidence arrived, and the classification was updated." A system that can be corrected by evidence is a strong system, not a weak one.`,
      ],
      example: { problem: `For a long time, scientists grouped falcons together with hawks and eagles. All of those birds hunt other animals, and all of them have hooked beaks and sharp curved claws. Later, comparisons of DNA showed that falcons are more closely related to parrots and songbirds than they are to hawks and eagles, and the classification was changed. Why did the grouping change, and does the change mean classification cannot be trusted?`, solution: `The grouping changed because classification is a claim about shared ancestry, and DNA evidence tracks ancestry more directly than a hooked beak does. The beak and claws are analogous structures shaped by a similar way of hunting, not proof of close kinship. The change shows the system working as it should: new evidence improves the groups.` },
      relatedLoIds: ['m7sci.classifying-living-things'],
    },
  ],
  pointers: [
    { content: `Students often say "Classification is fixed, so any change means someone made a mistake." — Classification states which organisms descended from which ancestors, and that is a claim evidence can sharpen. When DNA comparisons became available, scientists could read ancestry far more directly than before, and some organisms moved. The earlier scientists were not sloppy; they used the best evidence of their time. WRONG: "The old classification was a mistake, so the system does not work." CORRECT: "New evidence arrived and the classification was updated." Expect it to keep changing, because evidence keeps arriving.`, kind: 'common-error' },
    { content: `Students often say "Organisms that look alike belong in the same group." — Looks are a starting clue, not the decision. A similar way of living can shape similar body parts in two separate lines, which is what analogous structures are. Falcons were once filed with hawks and eagles because of the hooked beak and curved claws, and DNA later placed falcons nearer to parrots and songbirds. So the test is shared ancestry, checked with DNA as well as structures. And note what this does not mean: no group is higher, lower, simpler or more advanced than another. The groups say who is related to whom, and nothing more.`, kind: 'common-error' },
    { content: `Everyday names are ambiguous: one organism can have many names, and one name can point to different organisms, so scientists agreed on one scientific name per species.`, kind: 'tip' },
    { content: `Binomial nomenclature gives a two-word name, genus then species name: genus capitalized, species name lowercase, both italicized. Panthera leo, Homo sapiens.`, kind: 'tip' },
    { content: `The groups nest inside one another, widest to narrowest: domain, kingdom, phylum, class, order, family, genus, species. Every organism is in all eight at once.`, kind: 'tip' },
    { content: `Modern classification groups organisms by shared ancestry, using DNA as well as body structures.`, kind: 'tip' },
    { content: `That is why classifications get revised when new evidence arrives -- revision is the system working, not the system failing.`, kind: 'tip' },
    { content: `Looking alike is not proof of kinship; similar ways of living can shape similar parts separately. And the group labels are a human-made filing system placed over real relationships, with no group higher or more advanced than another.`, kind: 'tip' },
    { content: `The second word of a scientific name is never used alone. "*leo*" by itself is meaningless — several genera can reuse the same species word. Always write both words: *Panthera leo*. After the first mention you may shorten the genus to a letter: *P. leo*.`, kind: 'vocab-note' },
    { content: `Capitalization and italics are part of the answer, not decoration. *Panthera leo* is right. Panthera Leo, panthera leo, and *leo Panthera* are all wrong. Handwriting? Underline each word separately.`, kind: 'common-error' },
    { content: `"Same group" is not one thing — say WHICH level. Two animals in the same class are distant relatives; two in the same genus are close. Saying "they're grouped together" without naming the level says almost nothing.`, kind: 'tip' },
    { content: `An organism is not filed in one box. If it is in Family Felidae it is automatically in Carnivora, Mammalia, Chordata, Animalia, and Eukarya too. Answering "a lion is in Felidae" as if that's its only group misses the nesting.`, kind: 'gotcha' },
    { content: `Looking alike is a clue, not proof. Hooked beaks and curved claws can be shaped separately by a similar way of hunting — those are analogous structures from Unit 7. Before you group by appearance, ask: is this inherited from a shared ancestor, or just a similar job?`, kind: 'common-error' },
    { content: `When a classification changes, don't write "scientists were wrong" or "the system failed." Write "new evidence, usually DNA, showed a different ancestry, so the grouping was updated." The organisms didn't change — our picture of their family tree got better.`, kind: 'gotcha' },
    { content: `The order of the eight levels goes widest to narrowest, and going DOWN means fewer, more closely related organisms. Kingdom is huge; genus is tiny. Students often flip this and say species is the biggest group.`, kind: 'common-error' },
    { content: `No group is higher, more advanced, or further along than another. Bacteria are not "below" mammals. The hierarchy shows who is related to whom — it is not a ranking or a ladder of improvement.`, kind: 'edge-case' },
  ],
};
