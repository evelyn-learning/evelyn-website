/**
 * Biology — Unit 1: Characteristics of Life & Levels of Organization.
 *
 * The opening plan of the HS Biology fan-out (NGSS HS-LS1-2). Nearly every
 * error here is a boundary error: students test ONE property instead of the
 * whole checklist, or they slide a rung on the organization ladder
 * (population vs community vs ecosystem). The concept segment is built
 * around those two boundaries.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U1_CHARACTERISTICS_OF_LIFE: LessonPlan = {
  id: 'evelyn.hs.bio.characteristics-of-life.v1',
  title: 'Characteristics of Life & Levels of Organization',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.characteristics-of-life',
      standard: 'BIO-1.1',
      description:
        'Use the shared characteristics of living things to decide whether something is alive, and order biological systems from molecules through cells, tissues, organs and organisms up to populations, communities, ecosystems and the biosphere (NGSS HS-LS1-2).',
    },
  ],
  prerequisites: [],
  followUps: ['bio.scientific-method-bio'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame "is it alive?" as a decision real professionals have to make and defend.',
      script:
        'A doctor in an emergency room has to declare, on the record, the moment a patient is no longer alive. A forensic scientist looks at a swab from a crime scene and decides whether the specks in it are bacteria or just dust. A NASA team stares at soil from Mars and argues for years about whether a gas reading means life. None of them can answer with a feeling — they need a checklist that works on anything, from a virus to a redwood. Building that checklist, and learning where every living thing sits on the ladder from molecule to biosphere, is the frame the whole rest of this course hangs on.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-life-and-levels',
      kind: 'concept',
      goal: 'The characteristics-of-life checklist, the boundary cases that break it, and the levels of organization from atom to biosphere.',
      keyIdeas: [
        'LIFE IS A CHECKLIST, NOT A SINGLE TEST — no one property proves life. Fire grows, spreads and consumes fuel; a car uses energy and responds to a turned key; a salt crystal gets bigger. Something is alive only if it shows essentially ALL of the characteristics on this list, so the useful question is never "does it move?" but "which items on the list does it fail?".',
        'CELLULAR ORGANIZATION — every living thing is one cell or made of cells, and every living thing is ORDERED: atoms built into molecules, molecules into structures, structures into cells. Non-living matter can be complex without being organized into cells. This is the item a virus fails outright.',
        'METABOLISM AND ENERGY USE — living things take in energy and matter and run chemical reactions to build, repair and move. Plants capture light and store it in glucose (C6H12O6); animals release that energy by burning glucose with O2 and giving off CO2 and H2O. A rock does no chemistry on its own account.',
        'RESPONSE TO STIMULI AND HOMEOSTASIS — these are related but not the same. RESPONSE is reacting to something outside (a plant bends toward light, you pull your hand off a hot pan). HOMEOSTASIS is the stronger claim: actively holding INTERNAL conditions steady while the outside changes — human body temperature stays near 37 °C whether the room is 5 °C or 40 °C, by sweating or shivering. A thermostat mimics homeostasis; only a cell does it for itself.',
        'GROWTH, DEVELOPMENT AND REPRODUCTION — living things grow by making more cells (not by piling material on the outside, the way a crystal or a stalactite does) and they DEVELOP, changing form on a program: tadpole → frog, seed → seedling → tree. They also reproduce, but read this carefully — reproduction is a property of the KIND of organism, not a requirement of every individual. A sterile mule, a worker bee and a person past childbearing age are all fully alive.',
        'HEREDITY AND DNA — offspring resemble parents because instructions are passed down in DNA, the same molecule in every organism on Earth. This shared code is the reason a gene from one species can be read by another, and the reason evidence from bacteria tells us something about humans.',
        'ADAPTATION AND EVOLUTION — populations change over generations as inherited variation is filtered by the environment. Note the level: an INDIVIDUAL does not evolve during its lifetime. Weightlifting does not give your children bigger muscles; only changes in the DNA that gets passed on count.',
        'THE LEVELS OF ORGANIZATION — one ladder, smallest to largest: atom → molecule (DNA, protein) → organelle → CELL → tissue → organ → organ system → ORGANISM → population → community → ecosystem → biosphere. Two hinge words are the ones students trade by mistake: a POPULATION is all members of ONE species in an area (every heron in a marsh); a COMMUNITY is ALL the species living there together (the herons plus the frogs, cattails and bacteria); an ECOSYSTEM adds the non-living parts — water, soil, sunlight, temperature. Below the organism, each rung is built from the one under it and does something the parts alone cannot: that is why a heart pumps although a single cardiac muscle cell cannot.',
      ],
      vocabulary: [
        { term: 'homeostasis', definition: 'the active maintenance of steady internal conditions while the external environment changes.' },
        { term: 'population', definition: 'all the individuals of a single species living in one area.' },
        { term: 'community', definition: 'all the populations of all the different species living together in one area.' },
        { term: 'ecosystem', definition: 'a community together with the non-living factors it interacts with, such as water, soil and sunlight.' },
      ],
      suggestedTools: ['show_concept_map', 'show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-seed-vs-crystal',
      kind: 'worked_example',
      problem:
        'A dry oak seed sits in a jar and does nothing for two years. In the same room, a salt crystal hanging in a jar of brine slowly gets larger every week. Biologists call the seed living and the crystal non-living. Use the characteristics of life to justify both calls.',
      steps: [
        'Do not settle it on activity or size change — the crystal is the one visibly changing, so "it grows" cannot be the deciding test. Run the whole checklist on each.',
        'Check cellular organization: the seed is made of cells, with a tiny dormant embryo plant inside and stored food around it. The crystal is a repeating lattice of ions — ordered, but not cells.',
        'Check heredity and metabolism: the seed carries DNA and runs a slow trickle of metabolism, and given water and warmth it will develop into an oak with the parent tree\'s inherited traits. The crystal has no DNA, no reactions of its own, and no program to develop into anything.',
        'Check HOW each one gets bigger: the seed will grow by dividing cells from the inside; the crystal grows by ions sticking to its outside surface. Internal growth from cells versus external accumulation is the clean line between the two.',
        'Score them: the seed meets every item (dormant, but equipped for all of them); the crystal meets essentially none except a superficial size increase.',
      ],
      answer:
        'The seed is living — cells, DNA, metabolism, and growth by cell division with a developmental program. The crystal only accumulates material on its outside; it has no cells, no DNA and no metabolism.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mule-reproduction',
      kind: 'worked_example',
      problem:
        'A mule (the offspring of a horse and a donkey) is sterile and can never produce offspring. A student argues: "Reproduction is on the list of characteristics of life, the mule fails it, so by our own rule a mule is not alive." Where exactly does that reasoning break down, and how should the reproduction criterion be stated?',
      steps: [
        'Grant the fact: the student is right that a mule cannot reproduce. The error is not in the biology of mules; it is in how the criterion is being applied.',
        'Notice the LEVEL the criterion belongs to. Reproduction is how a kind of organism persists across generations, so it is tested at the level of the species or population, not on each individual body.',
        'Test that reading against ordinary cases: a worker bee is sterile, a seedling has not reproduced yet, and a person past childbearing age never will again. If the criterion applied individual-by-individual, all three would be classed as non-living, which is plainly wrong.',
        'Run the rest of the checklist on the mule: it is made of cells, it metabolizes food, it holds its body temperature steady, it grew from a fertilized egg and developed, it responds to stimuli, and it carries DNA. It meets every other item.',
        'State the criterion properly: living things reproduce and pass DNA to offspring AS A KIND. An individual that does not reproduce is still alive; a category of thing that has never reproduced anywhere is the one that fails.',
      ],
      answer:
        'The reasoning applies a species-level criterion to a single individual. A mule is alive — reproduction is a property of the kind of organism, and the mule satisfies every other characteristic.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-candle-flame',
      kind: 'try_yourself',
      problem:
        'A candle flame grows when the wick is longer, consumes fuel and oxygen, gives off carbon dioxide and water as waste, and flickers in response to a draft. Which statement best explains why biologists still classify a flame as non-living?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It does not use energy, and using energy is the single test for life' },
        { id: 'b', text: 'It is not made of cells and carries no DNA, so it fails several items on the checklist even though it mimics a few', correct: true },
        { id: 'c', text: 'It does not grow, since a flame only changes shape rather than getting larger' },
        { id: 'd', text: 'It does not respond to its environment, because flickering is a physical effect rather than a response' },
      ],
      expectedAnswer: 'It is not made of cells and carries no DNA, so it fails several items on the checklist even though it mimics a few',
      hints: [
        'Something is living only if it meets essentially ALL the characteristics — so look for the items the flame fails, not the ones it imitates.',
        'The flame really does consume fuel, really does give off waste, and really does react to a draft. Ask what it is physically made of, and whether anything is inherited.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-levels-order',
      kind: 'try_yourself',
      problem:
        'A biologist working in a marsh collects data on four things: (1) the cardiac muscle tissue inside one heron\'s heart, (2) that heron\'s whole heart, (3) all of the herons living in the marsh, (4) all of the living things in the marsh — herons, frogs, cattails and bacteria together. Which ordering runs from the SMALLEST level of organization to the LARGEST?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'the whole heart → the cardiac muscle tissue → all the herons → all the living things in the marsh' },
        { id: 'b', text: 'the cardiac muscle tissue → the whole heart → all the living things in the marsh → all the herons' },
        { id: 'c', text: 'the whole heart → the cardiac muscle tissue → all the living things in the marsh → all the herons' },
        { id: 'd', text: 'the cardiac muscle tissue → the whole heart → all the herons → all the living things in the marsh', correct: true },
      ],
      expectedAnswer: 'the cardiac muscle tissue → the whole heart → all the herons → all the living things in the marsh',
      hints: [
        'Sort the two body-level items first: is an organ built out of tissues, or a tissue built out of organs?',
        'Then sort the two field items: all the herons is one species (a population); all the living things together is many species (a community), and a community contains that population.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-homeostasis',
      kind: 'try_yourself',
      problem:
        'A student steps from a 20 °C classroom into 38 °C outdoor heat. Within a minute they begin to sweat, and a thermometer shows their internal body temperature holding at about 37 °C. Which characteristic of life does this best demonstrate, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Growth and development, because sweating uses stored energy that would otherwise build new cells' },
        { id: 'b', text: 'Metabolism, because sweat is a chemical waste product of burning glucose' },
        { id: 'c', text: 'Homeostasis, because an internal condition is being actively held steady while the outside conditions change', correct: true },
        { id: 'd', text: 'Response to stimuli only, because sweating is simply a reaction to hot air and nothing internal is being regulated' },
      ],
      expectedAnswer: 'Homeostasis, because an internal condition is being actively held steady while the outside conditions change',
      hints: [
        'Compare the two numbers in the problem: the outside temperature swung by 18 °C, and the inside temperature did what?',
        'Reacting to the outside is a response; holding the inside constant while the outside moves is the stronger, more specific characteristic.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-viruses-alive',
      kind: 'misconception_check',
      question:
        'A student says: "Viruses reproduce inside you, they mutate, and new flu strains evolve every year. Reproduction, heredity and evolution are all on the checklist, so viruses are clearly alive." What went wrong?',
      commonErrors: [
        {
          answer: 'Viruses are alive because they reproduce, mutate and evolve',
          misconception: 'Treating the characteristics of life as a menu where matching a few items is enough, and overlooking that a virus copies itself only by hijacking a host cell rather than on its own.',
          correctsTo:
            'Life requires essentially the whole checklist, and a virus fails the core of it. A virus is not a cell — it is genetic material in a protein coat, with no cytoplasm, no organelles and no membrane machinery of its own. It has no metabolism, so it takes in no energy and runs no reactions. It maintains no homeostasis, and it does not grow. It cannot even copy itself: it must inject its genes into a living host cell and use THAT cell\'s ribosomes and enzymes. So most biologists classify viruses as non-living — genuinely on the border, which is exactly why they are the best test of whether you are using the checklist or just pattern-matching one or two items.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Life is a checklist, not one test: cells, metabolism, homeostasis, response to stimuli, growth and development, reproduction and heredity via DNA, and adaptation over generations. Something must meet essentially all of it.',
        'Response = reacting to the outside; homeostasis = actively holding the INSIDE steady while the outside changes.',
        'Living things grow from the inside by cell division; crystals and stalactites only pile material on the outside.',
        'Reproduction and evolution are tested at the level of the species or population — a sterile mule is alive, and no individual evolves during its own lifetime.',
        'The ladder: atom → molecule → organelle → cell → tissue → organ → organ system → organism → population → community → ecosystem → biosphere. Population = one species; community = all the species; ecosystem = community + the non-living factors.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Characteristics of Life & Levels of Organization' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
