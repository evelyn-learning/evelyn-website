/**
 * Grade 7 Science (Life Science) — Classification: Why We Classify Living Things.
 *
 * Opens Unit 8 (NGSS MS-LS4-2). The lesson has three jobs: show WHY a shared
 * naming system is needed (common names are ambiguous), teach the nested
 * hierarchy and binomial nomenclature, and land the modern idea that
 * classification groups organisms by shared ANCESTRY using DNA as well as
 * body features -- which is why the system is revised when new evidence
 * arrives. That last point connects straight back to Unit 7.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it. Ranks are written out in
 * prose, never shown as a diagram or a table. No organism is ever described
 * as higher, lower, simpler or more advanced than another.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U8_CLASSIFYING_LIVING_THINGS: LessonPlan = {
  id: 'evelyn.ms.m7sci.classifying-living-things.v1',
  title: 'Why We Classify Living Things',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.classifying-living-things',
      standard: 'M7SCI-8.1',
      description:
        'Explain why scientists classify living things and name them with a two-word scientific name, describe how the groups of the classification hierarchy nest inside one another, and explain that organisms are grouped by shared ancestry using DNA as well as body features, so classifications are revised when new evidence appears (NGSS MS-LS4-2).',
    },
  ],
  prerequisites: ['m7sci.adaptation-and-artificial-selection'],
  followUps: ['m7sci.domains-and-kingdoms'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the ambiguity of common names a real problem the student can feel before any vocabulary arrives.',
      script:
        'Someone posts a photo of a spider they found in the garage and asks whether it is dangerous. Three people answer with three different names. One name is what people call that spider in their town. Another name belongs to a completely different spider on the other side of the world. Now nobody knows which spider is actually in that garage. Scientists hit this problem constantly, and sometimes it matters a great deal: two plants can share the same everyday name when one of them is safe to eat and the other one is not. So biologists agreed on a system. Every kind of living thing gets one name that works everywhere, and every living thing gets sorted into groups that mean something. Today we find out what that system is and why it keeps changing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-why-classify',
      kind: 'concept',
      goal: 'Motivate scientific names from ambiguity, teach the nested hierarchy and binomial rules, then land ancestry-based grouping and revisability.',
      keyIdeas: [
        'THE PROBLEM WITH EVERYDAY NAMES — a common name is whatever the people nearby happen to say. That breaks in two directions at once. One animal can carry many names in different places and different languages. And one name can point to different animals: the bird called a robin in North America and the bird called a robin in Britain are two different birds that are not close relatives. If two scientists cannot be sure they are talking about the same organism, they cannot compare their results at all.',
        'ONE NAME PER SPECIES — the fix is BINOMIAL NOMENCLATURE, a two-word naming system set up by Carolus Linnaeus in the 1700s. The first word is the GENUS and the second word is the SPECIES name. Humans are Homo sapiens. The lion is Panthera leo. The tiger is Panthera tigris. Notice that the lion and the tiger share their first word, so the name itself already tells you they are placed in the same genus. A scientific name is not Latin decoration. It is an address.',
        'HOW TO WRITE ONE — the genus is capitalized, the species name is lowercase, and both words are italicized when typed (or underlined when written by hand). Panthera leo is correct. Panthera Leo, panthera leo, and leo Panthera are all wrong. Getting this right is a small habit that makes your writing readable by any scientist anywhere.',
        'GROUPS INSIDE GROUPS — every organism is filed into a set of nested groups, from the widest to the narrowest: DOMAIN, KINGDOM, PHYLUM, CLASS, ORDER, FAMILY, GENUS, SPECIES. Think of boxes packed inside boxes. An organism inside a family is also inside the order that holds that family, and inside the class that holds that order, all the way up. So an organism is not in one group. It is in all eight at once, and each step down is a smaller, more particular group.',
        'WHAT THE GROUPS ACTUALLY MEAN NOW — modern classification groups organisms by shared ANCESTRY. Scientists compare DNA as well as body structures, and organisms placed in the same group are placed there because the evidence says they descended from the same ancestor. The further down two organisms stay together, the more recent the ancestor they share. This is why Unit 7 came first: classification is the family tree, written out as groups.',
        'WHY IT CHANGES, AND WHAT IT IS NOT — because the groups are a claim about ancestry, new evidence can improve them, and organisms do get moved. Revision is the system working, not the system failing. Two warnings go with this. Looking alike is not proof of kinship, because similar ways of living can produce similar body parts in separate lines, exactly like the analogous structures from Unit 7. And the group names and boundaries are a human-made filing system laid over real relationships, so the lines are ours even though the ancestry is real. Even the word species can be hard to draw a sharp edge around, and scientists still argue about some cases. No group is higher, lower, simpler or more advanced than any other.',
      ],
      vocabulary: [
        { term: 'classification', definition: 'sorting living things into groups based on what the evidence says about how they are related.' },
        { term: 'taxonomy', definition: 'the branch of science that names living things and organizes them into those groups.' },
        { term: 'binomial nomenclature', definition: 'the two-word naming system, genus plus species name, that gives each species one scientific name used worldwide.' },
        { term: 'genus', definition: 'the group just above species, and the first word of a scientific name; organisms in one genus are very closely related.' },
        { term: 'species', definition: 'a group of organisms so closely related that they can reproduce together and produce offspring that can also reproduce; the edges of this idea are genuinely hard to draw in some cases.' },
        { term: 'common ancestor', definition: 'an organism from the past that two or more later kinds of organism both descended from.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-nested-groups',
      kind: 'worked_example',
      problem:
        'Here is how two animals are classified. The house cat: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Felidae, Genus Felis, species catus. The lion: Domain Eukarya, Kingdom Animalia, Phylum Chordata, Class Mammalia, Order Carnivora, Family Felidae, Genus Panthera, species leo. Explain what "groups inside groups" means using these two animals, and write the scientific name of each animal correctly.',
      steps: [
        'Start at the top of each list and compare one level at a time. Domain matches. Kingdom matches. Phylum matches. Class matches. Order matches. Family matches: both are in Felidae.',
        'Keep going. At Genus the two lists split. The house cat is in Felis and the lion is in Panthera. Below that they differ again, at the species name.',
        'Now say what the nesting means. Every animal in the Family Felidae is also in the Order Carnivora, and every animal in Carnivora is also in the Class Mammalia. The smaller box sits inside the larger one, so being in Felidae automatically means being in all the groups above it.',
        'That is why an organism is not filed in one group. It is filed in all eight at the same time, and each step down names a smaller and more particular set of relatives.',
        'Build the scientific names from the last two levels, because the two-word name is exactly genus plus species name. The house cat is Felis catus. The lion is Panthera leo. In both, the genus is capitalized, the species name is lowercase, and both words are italicized.',
        'Read what the shared levels tell you. These two share every group down to Family Felidae, which means the evidence places them in the same branch of the cat family and says they share a common ancestor. It does NOT mean one of them is above the other or further along than the other. Groups describe relationships, not rank.',
      ],
      answer:
        'The two share every level from Domain down through Family Felidae and split at Genus, because each group nests inside the one above it, so an organism belongs to all eight groups at once. Their scientific names are Felis catus and Panthera leo, each written with a capitalized genus, a lowercase species name, and both words italicized.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-classification-changes',
      kind: 'worked_example',
      problem:
        'For a long time, scientists grouped falcons together with hawks and eagles. All of those birds hunt other animals, and all of them have hooked beaks and sharp curved claws. Later, comparisons of DNA showed that falcons are more closely related to parrots and songbirds than they are to hawks and eagles, and the classification was changed. Why did the grouping change, and does the change mean classification cannot be trusted?',
      steps: [
        'Ask what the old grouping was based on. It was based on shared body features connected to hunting: the hooked beak and the curved claws.',
        'Ask what classification is supposed to show. It is supposed to show shared ancestry, meaning which organisms descended from the same ancestor.',
        'Now put those two together. A hooked beak is very useful for a bird that tears food, so it can appear in two separate lines of birds that both hunt that way. Those are analogous structures from Unit 7: similar because of similar living, not because of a shared ancestor.',
        'Ask why DNA changed the answer. DNA is inherited directly from ancestors, so comparing DNA is a much more direct record of ancestry than comparing body parts that a similar way of living could have shaped separately.',
        'When the ancestry evidence and the appearance evidence disagree, the ancestry evidence decides the grouping. So falcons were moved onto a different branch. Nothing about the birds changed at all. Only our picture of who is related to whom got better.',
        'WRONG way to read this: "Scientists were wrong before, so classification is unreliable." CORRECT way: "Scientists grouped using the best evidence they had, better evidence arrived, and the classification was updated." A system that can be corrected by evidence is a strong system, not a weak one.',
      ],
      answer:
        'The grouping changed because classification is a claim about shared ancestry, and DNA evidence tracks ancestry more directly than a hooked beak does. The beak and claws are analogous structures shaped by a similar way of hunting, not proof of close kinship. The change shows the system working as it should: new evidence improves the groups.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-common-names',
      kind: 'try_yourself',
      problem:
        'A student in the United States and a student in Britain are writing to each other about a bird they both call a robin. When they compare descriptions, they realize they are describing two different birds. The American robin is Turdus migratorius and the European robin is Erithacus rubecula. What does this example best show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Everyday names can point to different organisms in different places, so scientists use one agreed scientific name for each species.', correct: true },
        { id: 'b', text: 'One of the two students is using the wrong name, because each animal has only one correct everyday name.' },
        { id: 'c', text: 'The two birds must be closely related, because people gave them the same everyday name.' },
        { id: 'd', text: 'Scientific names are only needed for organisms that live in more than one country.' },
      ],
      expectedAnswer: 'Everyday names can point to different organisms in different places, so scientists use one agreed scientific name for each species.',
      hints: [
        'Neither student made a mistake. Both used the name that people around them actually use.',
        'Ask what problem the two scientific names solve that the word robin does not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-writing-the-name',
      kind: 'try_yourself',
      problem:
        'A student is typing the scientific name of the lion in a report. The genus is Panthera and the species name is leo. Which version follows the rules of binomial nomenclature?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Panthera Leo, with both words capitalized and italicized' },
        { id: 'b', text: 'panthera leo, with both words lowercase and italicized' },
        { id: 'c', text: 'Panthera leo, with the genus capitalized, the species name lowercase, and both words italicized', correct: true },
        { id: 'd', text: 'Leo panthera, with the species name first and the genus second' },
      ],
      expectedAnswer: 'Panthera leo, with the genus capitalized, the species name lowercase, and both words italicized',
      hints: [
        'Three separate rules are being checked at once: which word comes first, which word gets a capital letter, and how the pair is formatted.',
        'The genus always comes first and is the only one of the two words that starts with a capital letter.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-basis-of-grouping',
      kind: 'try_yourself',
      problem:
        'Biologists are deciding which group a newly studied animal belongs in. Which approach matches how classification works today?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Use its outward appearance alone, because organisms that look alike are always closely related.' },
        { id: 'b', text: 'Use its DNA together with its body structures, because organisms are grouped by the ancestry the evidence supports.', correct: true },
        { id: 'c', text: 'Use the habitat it lives in, because organisms found in the same place belong in the same group.' },
        { id: 'd', text: 'Use the everyday name people already gave it, because the name shows which group it belongs in.' },
      ],
      expectedAnswer: 'Use its DNA together with its body structures, because organisms are grouped by the ancestry the evidence supports.',
      hints: [
        'Remember what the groups are a claim about. They are not a claim about looks, place or name.',
        'Two of these choices were shown to fail earlier in this lesson: the falcons looked like hawks, and the two robins shared a name.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-classification-fixed-and-looks-based',
      kind: 'misconception_check',
      question:
        'A student says: "Classification was finished hundreds of years ago, so if scientists move an animal into a different group now, they must have been sloppy before. Anyway, you can just group animals by what they look like." What is wrong here?',
      commonErrors: [
        {
          answer: 'Classification is fixed, so any change means someone made a mistake.',
          misconception:
            'Treating classification as a finished list to be memorized rather than as a claim about ancestry that evidence can improve.',
          correctsTo:
            'Classification states which organisms descended from which ancestors, and that is a claim evidence can sharpen. When DNA comparisons became available, scientists could read ancestry far more directly than before, and some organisms moved. The earlier scientists were not sloppy; they used the best evidence of their time. WRONG: "The old classification was a mistake, so the system does not work." CORRECT: "New evidence arrived and the classification was updated." Expect it to keep changing, because evidence keeps arriving.',
        },
        {
          answer: 'Organisms that look alike belong in the same group.',
          misconception:
            'Grouping by appearance, because appearance is the easiest thing to see and often does line up with relatedness.',
          correctsTo:
            'Looks are a starting clue, not the decision. A similar way of living can shape similar body parts in two separate lines, which is what analogous structures are. Falcons were once filed with hawks and eagles because of the hooked beak and curved claws, and DNA later placed falcons nearer to parrots and songbirds. So the test is shared ancestry, checked with DNA as well as structures. And note what this does not mean: no group is higher, lower, simpler or more advanced than another. The groups say who is related to whom, and nothing more.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Everyday names are ambiguous: one organism can have many names, and one name can point to different organisms, so scientists agreed on one scientific name per species.',
        'Binomial nomenclature gives a two-word name, genus then species name: genus capitalized, species name lowercase, both italicized. Panthera leo, Homo sapiens.',
        'The groups nest inside one another, widest to narrowest: domain, kingdom, phylum, class, order, family, genus, species. Every organism is in all eight at once.',
        'Modern classification groups organisms by shared ancestry, using DNA as well as body structures.',
        'That is why classifications get revised when new evidence arrives -- revision is the system working, not the system failing.',
        'Looking alike is not proof of kinship; similar ways of living can shape similar parts separately. And the group labels are a human-made filing system placed over real relationships, with no group higher or more advanced than another.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Why We Classify Living Things' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
