/**
 * Biology — Unit 1 CED 1.1: Characteristics of Life & Levels of Organization.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.characteristics-of-life.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U1_CHARACTERISTICS_OF_LIFE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.characteristics-of-life.v1',
  course: 'Biology',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Characteristics of Life & Levels of Organization',
  planId: 'evelyn.hs.bio.characteristics-of-life.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.characteristics-of-life.v1' }],
  theory: [
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'Life is a checklist, not a single test', content: `LIFE IS A CHECKLIST, NOT A SINGLE TEST — no one property proves life. Fire grows, spreads and consumes fuel; a car uses energy and responds to a turned key; a salt crystal gets bigger. Something is alive only if it shows essentially ALL of the characteristics on this list, so the useful question is never "does it move?" but "which items on the list does it fail?".` },
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'Cellular organization', content: `CELLULAR ORGANIZATION — every living thing is one cell or made of cells, and every living thing is ORDERED: atoms built into molecules, molecules into structures, structures into cells. Non-living matter can be complex without being organized into cells. This is the item a virus fails outright.` },
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'Metabolism and energy use', content: `METABOLISM AND ENERGY USE — living things take in energy and matter and run chemical reactions to build, repair and move. Plants capture light and store it in glucose (C6H12O6); animals release that energy by burning glucose with O2 and giving off CO2 and H2O. A rock does no chemistry on its own account.` },
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'Response to stimuli and homeostasis', content: `RESPONSE TO STIMULI AND HOMEOSTASIS — these are related but not the same. RESPONSE is reacting to something outside (a plant bends toward light, you pull your hand off a hot pan). HOMEOSTASIS is the stronger claim: actively holding INTERNAL conditions steady while the outside changes — human body temperature stays near 37 °C whether the room is 5 °C or 40 °C, by sweating or shivering. A thermostat mimics homeostasis; only a cell does it for itself.` },
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'Growth, development and reproduction', content: `GROWTH, DEVELOPMENT AND REPRODUCTION — living things grow by making more cells (not by piling material on the outside, the way a crystal or a stalactite does) and they DEVELOP, changing form on a program: tadpole → frog, seed → seedling → tree. They also reproduce, but read this carefully — reproduction is a property of the KIND of organism, not a requirement of every individual. A sterile mule, a worker bee and a person past childbearing age are all fully alive.` },
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'Heredity and dna', content: `HEREDITY AND DNA — offspring resemble parents because instructions are passed down in DNA, the same molecule in every organism on Earth. This shared code is the reason a gene from one species can be read by another, and the reason evidence from bacteria tells us something about humans.` },
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'Adaptation and evolution', content: `ADAPTATION AND EVOLUTION — populations change over generations as inherited variation is filtered by the environment. Note the level: an INDIVIDUAL does not evolve during its lifetime. Weightlifting does not give your children bigger muscles; only changes in the DNA that gets passed on count.` },
    { loId: 'bio.characteristics-of-life', kind: 'framework', title: 'The levels of organization', content: `THE LEVELS OF ORGANIZATION — one ladder, smallest to largest: atom → molecule (DNA, protein) → organelle → CELL → tissue → organ → organ system → ORGANISM → population → community → ecosystem → biosphere. Two hinge words are the ones students trade by mistake: a POPULATION is all members of ONE species in an area (every heron in a marsh); a COMMUNITY is ALL the species living there together (the herons plus the frogs, cattails and bacteria); an ECOSYSTEM adds the non-living parts — water, soil, sunlight, temperature. Below the organism, each rung is built from the one under it and does something the parts alone cannot: that is why a heart pumps although a single cardiac muscle cell cannot.` },
    { loId: 'bio.characteristics-of-life', kind: 'definition', title: 'homeostasis', content: `the active maintenance of steady internal conditions while the external environment changes.` },
    { loId: 'bio.characteristics-of-life', kind: 'definition', title: 'population', content: 'all the individuals of a single species living in one area.' },
    { loId: 'bio.characteristics-of-life', kind: 'definition', title: 'community', content: 'all the populations of all the different species living together in one area.' },
    { loId: 'bio.characteristics-of-life', kind: 'definition', title: 'ecosystem', content: `a community together with the non-living factors it interacts with, such as water, soil and sunlight.` },
  ],
  methods: [
    {
      title: 'Worked seed vs crystal',
      steps: [
        `Do not settle it on activity or size change — the crystal is the one visibly changing, so "it grows" cannot be the deciding test. Run the whole checklist on each.`,
        `Check cellular organization: the seed is made of cells, with a tiny dormant embryo plant inside and stored food around it. The crystal is a repeating lattice of ions — ordered, but not cells.`,
        `Check heredity and metabolism: the seed carries DNA and runs a slow trickle of metabolism, and given water and warmth it will develop into an oak with the parent tree's inherited traits. The crystal has no DNA, no reactions of its own, and no program to develop into anything.`,
        `Check HOW each one gets bigger: the seed will grow by dividing cells from the inside; the crystal grows by ions sticking to its outside surface. Internal growth from cells versus external accumulation is the clean line between the two.`,
        `Score them: the seed meets every item (dormant, but equipped for all of them); the crystal meets essentially none except a superficial size increase.`,
      ],
      example: { problem: `A dry oak seed sits in a jar and does nothing for two years. In the same room, a salt crystal hanging in a jar of brine slowly gets larger every week. Biologists call the seed living and the crystal non-living. Use the characteristics of life to justify both calls.`, solution: `The seed is living — cells, DNA, metabolism, and growth by cell division with a developmental program. The crystal only accumulates material on its outside; it has no cells, no DNA and no metabolism.` },
      relatedLoIds: ['bio.characteristics-of-life'],
    },
    {
      title: 'Worked mule reproduction',
      steps: [
        `Grant the fact: the student is right that a mule cannot reproduce. The error is not in the biology of mules; it is in how the criterion is being applied.`,
        `Notice the LEVEL the criterion belongs to. Reproduction is how a kind of organism persists across generations, so it is tested at the level of the species or population, not on each individual body.`,
        `Test that reading against ordinary cases: a worker bee is sterile, a seedling has not reproduced yet, and a person past childbearing age never will again. If the criterion applied individual-by-individual, all three would be classed as non-living, which is plainly wrong.`,
        `Run the rest of the checklist on the mule: it is made of cells, it metabolizes food, it holds its body temperature steady, it grew from a fertilized egg and developed, it responds to stimuli, and it carries DNA. It meets every other item.`,
        `State the criterion properly: living things reproduce and pass DNA to offspring AS A KIND. An individual that does not reproduce is still alive; a category of thing that has never reproduced anywhere is the one that fails.`,
      ],
      example: { problem: `A mule (the offspring of a horse and a donkey) is sterile and can never produce offspring. A student argues: "Reproduction is on the list of characteristics of life, the mule fails it, so by our own rule a mule is not alive." Where exactly does that reasoning break down, and how should the reproduction criterion be stated?`, solution: `The reasoning applies a species-level criterion to a single individual. A mule is alive — reproduction is a property of the kind of organism, and the mule satisfies every other characteristic.` },
      relatedLoIds: ['bio.characteristics-of-life'],
    },
  ],
  pointers: [
    { content: `Life requires essentially the whole checklist, and a virus fails the core of it. A virus is not a cell — it is genetic material in a protein coat, with no cytoplasm, no organelles and no membrane machinery of its own. It has no metabolism, so it takes in no energy and runs no reactions. It maintains no homeostasis, and it does not grow. It cannot even copy itself: it must inject its genes into a living host cell and use THAT cell's ribosomes and enzymes. So most biologists classify viruses as non-living — genuinely on the border, which is exactly why they are the best test of whether you are using the checklist or just pattern-matching one or two items.`, kind: 'common-error' },
    { content: `Life is a checklist, not one test: cells, metabolism, homeostasis, response to stimuli, growth and development, reproduction and heredity via DNA, and adaptation over generations. Something must meet essentially all of it.`, kind: 'tip' },
    { content: `Response = reacting to the outside; homeostasis = actively holding the INSIDE steady while the outside changes.`, kind: 'tip' },
    { content: `Living things grow from the inside by cell division; crystals and stalactites only pile material on the outside.`, kind: 'tip' },
    { content: `Reproduction and evolution are tested at the level of the species or population — a sterile mule is alive, and no individual evolves during its own lifetime.`, kind: 'tip' },
    { content: `The ladder: atom → molecule → organelle → cell → tissue → organ → organ system → organism → population → community → ecosystem → biosphere. Population = one species; community = all the species; ecosystem = community + the non-living factors.`, kind: 'tip' },
    { content: `Never argue "it's alive because it grows/moves/uses energy." Fire, cars and salt crystals all pass one or two items. The only defensible answer names which checklist items the thing FAILS — usually cells, DNA, metabolism or homeostasis.`, kind: 'common-error' },
    { content: `Response to stimuli ≠ homeostasis. Bending toward light or yanking your hand off a pan = response. Sweating to hold 37 °C while the room hits 38 °C = homeostasis (INTERNAL condition held steady). If the answer doesn't mention an internal variable, it isn't homeostasis.`, kind: 'vocab-note' },
    { content: `Ask HOW it got bigger. Living things grow by cell division from the inside; crystals, stalactites and snowballs add material to the outside surface. "It got bigger" is not growth in the biological sense.`, kind: 'gotcha' },
    { content: `Reproduction and evolution are tested at the SPECIES/POPULATION level, not per individual. A sterile mule, a worker bee and a seedling are all alive. And no individual evolves in its lifetime — only heritable DNA changes passed to offspring count.`, kind: 'edge-case' },
    { content: `Population = one species in an area (all herons in the marsh). Community = all species there (herons + frogs + cattails + bacteria). Ecosystem = that community PLUS non-living factors (water, soil, sunlight, temperature). Students swap population and community constantly.`, kind: 'vocab-note' },
    { content: `Viruses are the trap case: they have DNA/RNA, mutate and evolve, but they are not cells, have no metabolism, no homeostasis, don't grow, and can only copy themselves by hijacking a host cell's ribosomes. Most biologists call them non-living.`, kind: 'gotcha' },
    { content: `"Dormant" does not mean "non-living." A dry seed, a frozen tardigrade or a bacterial spore is doing almost nothing visible but still has cells, DNA and the machinery for every characteristic. Judge on equipment and organization, not current activity.`, kind: 'edge-case' },
    { content: `Keep the ladder rungs straight below the organism: tissue = same-type cells, organ = several tissues, organ system = several organs. A heron's cardiac muscle tissue is smaller than its heart, which is smaller than the whole heron. Don't skip organelle between molecule and cell.`, kind: 'tip' },
  ],
};
