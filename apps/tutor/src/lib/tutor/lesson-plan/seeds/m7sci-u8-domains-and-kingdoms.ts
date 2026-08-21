/**
 * Grade 7 Science (Life Science) — Classification: Domains & Kingdoms.
 *
 * Concept-led (NGSS MS-LS4-2). The lesson is organized around ONE primary
 * split -- cells without a nucleus versus cells with one -- and then two
 * sorting questions (one cell or many, and how the organism gets its food)
 * that place the eukaryotic kingdoms a seventh grader actually meets.
 *
 * Three things are handled deliberately here. Fungi are not plants, and the
 * reason is nutrition, not appearance. Most bacteria are harmless or useful,
 * so the "bacteria equals germs" reflex gets corrected out loud. And the
 * number of kingdoms genuinely differs between textbooks because DNA evidence
 * keeps reshaping the groups -- that is science working, not science failing.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course, and no
 * organism is ever shown. Every organism in every item is described in words
 * that are sufficient to place it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U8_DOMAINS_AND_KINGDOMS: LessonPlan = {
  id: 'evelyn.ms.m7sci.domains-and-kingdoms.v1',
  title: 'Domains & Kingdoms',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.domains-and-kingdoms',
      standard: 'M7SCI-8.2',
      description:
        'Name the three domains of life and the major eukaryotic kingdoms, and place a described organism into a group using cell type, number of cells, and how the organism gets its food (NGSS MS-LS4-2).',
    },
  ],
  prerequisites: ['m7sci.classifying-living-things'],
  followUps: ['m7sci.using-dichotomous-keys'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use one shelf of the fridge to show that "alive" covers wildly different kinds of living things.',
      script:
        'Open the fridge and look at one shelf. There is a lemon, which is a plant. There is yogurt, which is full of living bacteria that someone added on purpose. There is a container of leftovers with a fuzzy green patch on top, and that patch is a fungus. If you left the door open long enough, something would eventually eat the lemon, and that would be an animal. Four completely different kinds of living things, all within arm reach, and the differences between them are far bigger than the difference between you and a mouse. Today we sort all of life into a small number of groups, and the very first question we ask turns out to be about something you cannot see at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-domains-and-kingdoms',
      kind: 'concept',
      goal: 'Establish the nucleus split, name the three domains and the four eukaryotic kingdoms, give the two sorting questions, and be honest that the kingdom list has changed.',
      keyIdeas: [
        'THE BIGGEST DIVIDE IN LIFE IS THE NUCLEUS — every living thing is made of cells, and cells come in two basic builds. In some cells the DNA sits loose in the cell, with no nucleus holding it. Those cells are called PROKARYOTIC. In other cells the DNA is packed inside a nucleus, and the cell also has other parts wrapped in their own membranes. Those cells are called EUKARYOTIC. That one difference splits life more deeply than legs, leaves, size or color ever could.',
        'THE THREE DOMAINS — a DOMAIN is the widest group biologists use. There are three. BACTERIA and ARCHAEA are both made of prokaryotic cells, with no nucleus, and each one of them is a single cell. EUKARYA holds every living thing built from eukaryotic cells, which means every plant, every animal, every fungus, and a huge mixed set of mostly single-celled organisms called protists. So the split is two domains without a nucleus and one domain with one.',
        'BACTERIA AND ARCHAEA ARE NOT THE SAME GROUP — under a microscope they look much alike, and older textbooks lumped them together into one group called Monera. Then biologists compared their DNA and the chemistry of their cells, and the two turned out to be deeply different from each other. That is why they are now two separate domains and Monera is no longer used. Two more corrections come with this. Archaea are NOT only found in extreme places; plenty live in ordinary soil, in the ocean and inside animal guts. And prokaryotes are not "simple" or "primitive" or "less evolved" -- there is no ranking here. They live nearly everywhere on this planet, which is not what failure looks like.',
        'THE EUKARYOTIC KINGDOMS YOU NEED — inside Eukarya, a KINGDOM is the next group down. Four of them matter for now. PROTISTS are mostly single-celled, and they are a mixed bag; some, like pond algae, make their own food, and others, like an amoeba, engulf smaller cells. FUNGI include mushrooms, molds and yeasts. PLANTS are many-celled and make their own food using light. ANIMALS are many-celled and take food into their bodies.',
        'TWO QUESTIONS SORT THE EUKARYOTES — first, one cell or many cells? Second, how does it get food? There are three answers to the food question and they do most of the work. It MAKES its own food from light, like a plant or pond algae. It ABSORBS food, meaning it releases chemicals onto its food, breaks the food down outside itself, and soaks up the pieces, like a fungus. Or it INGESTS food, meaning it takes the food inside its body and digests it there, like an animal.',
        'FUNGI ARE NOT PLANTS — a mushroom stays in one spot, grows out of the ground and has cell walls, so students file it under plants every year. It is not a plant. A plant makes its own food from light; a fungus cannot do that at all and must absorb food that was already alive. The cell wall does not decide it either, because a fungus wall is built from a different material than a plant wall. WRONG: "A mushroom is a plant because it grows in the ground and does not move." CORRECT: "A mushroom is a fungus because it cannot make its own food and instead absorbs nutrients from what it grows on."',
      ],
      vocabulary: [
        { term: 'domain', definition: 'the widest group in classification; the three domains are Bacteria, Archaea, and Eukarya.' },
        { term: 'kingdom', definition: 'the next group below a domain, such as Protists, Fungi, Plants, or Animals.' },
        { term: 'prokaryotic cell', definition: 'a cell whose DNA is not held inside a nucleus; the cells of Bacteria and Archaea.' },
        { term: 'eukaryotic cell', definition: 'a cell that keeps its DNA inside a nucleus; the cells of every organism in Eukarya.' },
        { term: 'protist', definition: 'a mixed group of mostly single-celled eukaryotes that are not fungi, plants, or animals.' },
        { term: 'fungus', definition: 'a eukaryote such as a mushroom, mold, or yeast that gets food by breaking it down outside its body and absorbing it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-no-nucleus',
      kind: 'worked_example',
      problem:
        'A scientist collects a single-celled organism from warm water at the edge of a hot spring. Under a powerful microscope she sees that the cell has no nucleus, and its DNA is loose inside the cell. Which domain is it in?',
      steps: [
        'Start with the first question, the one that splits life most deeply: does the cell have a nucleus?',
        'It does not. The DNA is loose in the cell, so this is a PROKARYOTIC cell.',
        'That immediately rules out Eukarya, because every organism in Eukarya is built from cells that keep their DNA in a nucleus. Two domains are left: Bacteria and Archaea.',
        'Now try to choose between those two, and notice that you cannot. Bacteria and Archaea both have prokaryotic cells and both are single-celled, so what she can see through the microscope does not separate them.',
        'The temptation is to guess Archaea because the water is hot. Resist it. Hot springs do hold archaea, but they also hold bacteria, and plenty of archaea live in ordinary cool soil and ocean water. Where an organism lives is a habitat, not a domain.',
        'What actually decides it is the evidence from unit 8.1: compare the DNA and the cell chemistry of this organism with known bacteria and known archaea, and see which it matches.',
        'So the honest answer stops halfway, and that is the correct place to stop.',
      ],
      answer:
        'It is a prokaryote, so it belongs to either Bacteria or Archaea. The microscope alone cannot decide between those two, and the hot spring is not evidence either -- comparing its DNA with known bacteria and archaea is what settles it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mold-on-leftovers',
      kind: 'worked_example',
      problem:
        'The fuzzy green patch on old leftovers is made of many cells. Each cell has a nucleus. It spreads as fine threads that grow down into the food. It is not able to use light to make food; instead it releases chemicals into the food and soaks up the broken-down nutrients. Place it in a domain and a kingdom.',
      steps: [
        'Question one, the nucleus. Each cell has a nucleus, so these are eukaryotic cells and the organism is in domain EUKARYA. Bacteria and Archaea are now out.',
        'Question two, one cell or many? Many. That makes a protist unlikely, since protists are mostly single-celled.',
        'Question three, how does it get food? It cannot make its own food from light, so it is not a plant. Two ways of getting food are left: absorb or ingest.',
        'The description says it releases chemicals into the food and soaks up what is broken down. That is breaking food down OUTSIDE the body and then absorbing it, which is the fungus method. An animal would take the food inside its body first.',
        'So this is a fungus, in domain Eukarya.',
        'Check the trap on the way out. It grows in one place, spreads outward and never moves, and it is green in this case. WRONG: "It is a plant because it is green and stays still." CORRECT: "It is a fungus because it cannot make its own food from light, and instead absorbs nutrients it breaks down outside itself." Color is a pigment, not a kingdom, and molds come in green, black, white and orange.',
      ],
      answer:
        'Domain Eukarya, kingdom Fungi. Its cells have nuclei, it is many-celled, and it feeds by breaking food down outside itself and absorbing it, which is the fungal method rather than the plant or animal one.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-place-by-nucleus',
      kind: 'try_yourself',
      problem:
        'A biologist studies an organism from a drop of pond water. It is far too small to see without a microscope, it is made of a single cell, and that cell holds its DNA inside a nucleus. Which conclusion is best supported?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It belongs to domain Bacteria, because it is too small to see without a microscope.' },
        { id: 'b', text: 'It belongs to domain Eukarya, because its cell keeps its DNA inside a nucleus.', correct: true },
        { id: 'c', text: 'It belongs to domain Archaea, because Archaea is the domain of single-celled organisms.' },
        { id: 'd', text: 'It belongs to no domain, because an organism made of only one cell is not fully alive.' },
      ],
      expectedAnswer: 'It belongs to domain Eukarya, because its cell keeps its DNA inside a nucleus.',
      hints: [
        'Only one feature in this description sorts life at the domain level. Being tiny is not it, and being single-celled is not it either.',
        'Bacteria and Archaea are both single-celled and both microscopic, so neither of those facts can separate them from anything. Ask instead where the DNA is kept.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-place-by-food',
      kind: 'try_yourself',
      problem:
        'An organism grows on a fallen log in the woods. It is made of many cells, each cell has a nucleus, it never moves from that log, it has cell walls, and it feeds by releasing chemicals onto the dead wood and then absorbing the nutrients that break loose. Which kingdom does it belong to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plants, because it has cell walls and stays rooted in one place.' },
        { id: 'b', text: 'Animals, because it cannot make its own food.' },
        { id: 'c', text: 'Fungi, because it is a many-celled eukaryote that breaks food down outside itself and absorbs it.', correct: true },
        { id: 'd', text: 'Protists, because anything that is not clearly a plant or an animal goes there.' },
      ],
      expectedAnswer: 'Fungi, because it is a many-celled eukaryote that breaks food down outside itself and absorbs it.',
      hints: [
        'Staying in one place and having cell walls are true of more than one kingdom, so neither of them decides the answer. The food question decides it.',
        'There are three ways to get food: make it from light, absorb it after breaking it down outside the body, or take it inside the body and digest it there. Match the description to one of the three.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-groups-changed',
      kind: 'try_yourself',
      problem:
        'Older textbooks put every organism without a nucleus into one single group called Monera. Newer textbooks split those organisms into two separate domains, Bacteria and Archaea. Which statement best explains why the grouping changed?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The earlier scientists were careless, which shows that classification is mostly guesswork.' },
        { id: 'b', text: 'New evidence from DNA and cell chemistry showed the two groups differ deeply, so the grouping was changed to match the evidence.', correct: true },
        { id: 'c', text: 'So many new organisms were discovered that one group became too crowded and had to be divided.' },
        { id: 'd', text: 'Archaea were given their own domain because they live in extreme places, and extreme habitats need their own group.' },
      ],
      expectedAnswer: 'New evidence from DNA and cell chemistry showed the two groups differ deeply, so the grouping was changed to match the evidence.',
      hints: [
        'Ask what scientists gained access to that they did not have before. Groups get redrawn when better evidence arrives, not when someone changes their mind.',
        'Two of these choices describe reasons that have nothing to do with how related the organisms are -- one is about counting, and one is about habitat.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fungi-and-bacteria',
      kind: 'misconception_check',
      question:
        'A student says: "Mushrooms are plants, because they grow out of the ground and never move. And bacteria are germs, so life on Earth would be better off with none of them." Both halves of that are wrong. Explain why.',
      commonErrors: [
        {
          answer: 'Mushrooms belong to the plant kingdom.',
          misconception:
            'Sorting by what an organism looks like and where it sits still, instead of by how it gets its food.',
          correctsTo:
            'A plant makes its own food using light. A mushroom cannot do that at all. It grows through soil or dead wood, releases chemicals that break the material down, and absorbs the pieces -- so it is a fungus, and it belongs to its own kingdom. Cell walls do not settle the question either, because fungi have cell walls too, built from a different material than plant walls. The useful habit is to stop asking "does it move" and start asking "where does its food come from".',
        },
        {
          answer: 'All bacteria are harmful, so the world would be better without them.',
          misconception:
            'Meeting bacteria only through the words germ, infection and antibacterial soap, so the whole domain gets treated as a disease.',
          correctsTo:
            'Only a small share of bacteria cause disease in people. Most are harmless, and many are necessary. Bacteria live in your intestines and help you digest food. Bacteria turn milk into yogurt and cheese. Bacteria in soil break down dead leaves and dead animals, and without decomposers doing that work the nutrients would stay locked up and new plants could not grow. A world with no bacteria would not be a cleaner world; it would be a world where dead material never broke down.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The first and biggest question is the nucleus: prokaryotic cells keep their DNA loose, eukaryotic cells keep it inside a nucleus.',
        'Three domains: Bacteria and Archaea, both prokaryotic and single-celled, and Eukarya, everything built from cells with a nucleus.',
        'Bacteria and Archaea are two separate domains, not one Monera group, because DNA and cell chemistry showed they are deeply different.',
        'Four eukaryotic kingdoms to know: Protists (mostly single-celled and mixed), Fungi, Plants, Animals.',
        'Sort a eukaryote with two questions: one cell or many, and does it MAKE its food from light, ABSORB it after breaking it down outside, or INGEST it into its body.',
        'Fungi absorb their food and are not plants. Most bacteria are harmless or useful. Archaea are not only found in extreme places, and no group here is higher or more advanced than another.',
        'Textbooks disagree about the number of kingdoms because DNA evidence keeps reshaping the groups. Changing a grouping to fit new evidence is science working correctly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Domains & Kingdoms' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
