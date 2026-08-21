/**
 * Grade 7 Science (Life Science) — Ecosystems: Ecosystem Disruption & Change.
 *
 * NGSS MS-LS2-4 asks the student to CONSTRUCT AN ARGUMENT FROM EVIDENCE that a
 * change to the physical or living parts of an ecosystem changes populations.
 * So the spine of this plan is causal reasoning, not a list of disasters:
 * name the change, name the populations it touches first, then follow the
 * effect at least two steps further through the food web.
 *
 * Three ideas carry the lesson. (1) Disruptions are natural as well as human.
 * (2) After a disruption a community rebuilds in stages — succession — and the
 * rebuilt community may not match the original. (3) A species moved to a new
 * place can spread quickly because the predators, diseases and competitors
 * that limited it at home are absent. That last idea is deliberately written
 * WITHOUT moral language: the organism is not villainous, it is unchecked.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every food web
 * in this file is written out in words, with the arrows pointing in the
 * direction energy flows (from the eaten to the eater). Never write "see the
 * web above". No invented statistics appear here on purpose.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U10_ECOSYSTEM_DISRUPTION: LessonPlan = {
  id: 'evelyn.ms.m7sci.ecosystem-disruption.v1',
  title: 'Ecosystem Disruption & Change',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.ecosystem-disruption',
      standard: 'M7SCI-10.3',
      description:
        'Construct an argument supported by evidence that changes to the physical or living parts of an ecosystem, including natural disruptions and the arrival of a new species, cause changes in the populations that live there, and trace those changes at least two steps through a food web (NGSS MS-LS2-4).',
    },
  ],
  prerequisites: ['m7sci.population-changes-and-limits'],
  followUps: ['m7sci.biodiversity-and-human-impact'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the ripple idea physical and personal before any vocabulary arrives.',
      script:
        'Imagine the pond behind a school. One summer the rain stops for weeks and the pond shrinks to a puddle. The frogs have less water to lay eggs in, so the next spring there are fewer frogs. The herons that fed on those frogs go somewhere else. The insects the frogs used to eat are suddenly harder to find in the pond, and there are more of them buzzing over the grass. Nobody touched the herons. Nobody touched the insects. One change to the water moved through the whole pond. Today we learn how to trace a change like that on purpose, and how to back up what we say with evidence instead of a guess.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-disruption',
      kind: 'concept',
      goal: 'Define disruption, install the two-steps-out tracing habit, and set up succession and unchecked new species without moral framing.',
      keyIdeas: [
        'A DISRUPTION IS A CHANGE TO PART OF AN ECOSYSTEM — either a physical part (water, temperature, soil, light) or a living part (a species arrives, a species disappears, a disease spreads). Fires, floods, droughts, storms and diseases are natural disruptions, and they were changing ecosystems long before there were people to watch. WRONG: "Ecosystems only get disrupted when people interfere." CORRECT: people cause some disruptions, and nature causes many others.',
        'ONE CHANGE RIPPLES OUTWARD — this is the whole skill. Do not stop at the first population. Take the chain grass to grasshopper, grasshopper to lizard, lizard to hawk, where each arrow points the way energy flows, from the eaten to the eater. Remove the hawks and the lizards face less hunting, so lizard numbers rise. More lizards eat more grasshoppers, so grasshopper numbers fall. Fewer grasshoppers eat less grass, so the grass grows back. The effect flips direction at every step down the chain, and it does not stop at the neighbor. It also reaches sideways, because a food web is not a single line: if more rabbits eat more of the grass, then the mice that also feed on that grass have less to eat, even though nothing ate a mouse and nothing was removed from the mouse part of the web.',
        'AN ARGUMENT NEEDS EVIDENCE, NOT A FEELING — a scientific argument has three parts. The CLAIM says what changed. The EVIDENCE is the measurements: counts of each population before and after, rainfall records, temperature records, the feeding relationships already known for that web. The REASONING explains how the evidence leads to the claim. "The deer will die out" is a guess. "Deer counts dropped in the three years after the shrubs they feed on were cleared, and deer feed mainly on those shrubs, so clearing the shrubs reduced the deer population" is an argument.',
        'AFTER A DISRUPTION, A COMMUNITY REBUILDS IN STAGES — that rebuilding is called SUCCESSION. After a forest fire, grasses and wildflowers come first because their seeds sprout fast in open sunlight. Their roots hold the soil and their dead leaves feed it. Then shrubs and fast-growing trees shade out the grasses. Then slower-growing trees rise above the fast ones. Each stage changes conditions in a way that lets the next stage take hold. The rebuilt community may look much like the old one, or it may not: a species that disappeared during the disruption does not come back on its own, and the new mix of plants may favor different animals. WRONG: "An ecosystem always returns to exactly what it was." CORRECT: it rebuilds, and what it rebuilds into depends on what survived and what conditions are like now.',
        'NOT EVERY DISRUPTION IS DAMAGE — some ecosystems are shaped by disruption that comes back again and again. A grass fire that sweeps a prairie every few years clears dead material, returns nutrients to the soil, and keeps young trees from taking over the grassland. Certain pine trees have cones sealed with resin that opens in the heat of a fire, releasing the seeds onto the newly cleared ground. What matters is how large the disruption is and how often it happens, not the word "fire" by itself.',
        'A SPECIES IN A NEW PLACE CAN SPREAD FAST — a NATIVE species has lived in an area for a long time, alongside the predators, diseases and competitors that limit its numbers. An INVASIVE species is one carried to a new area, often by accident on a ship or in shipped wood, where those limits are missing. With little eating it and little competing with it, its population can grow quickly and crowd out native species. Be careful with the language here: the organism is not evil and is not trying to take over. Nothing in nature decides to spread. The reason for the change is the absence of the controls that held it in check at home.',
      ],
      vocabulary: [
        { term: 'disruption', definition: 'a change to a physical or living part of an ecosystem that affects the populations living there.' },
        { term: 'succession', definition: 'the rebuilding of a community in stages after a disruption, where each stage changes conditions and makes the next stage possible.' },
        { term: 'native species', definition: 'a species that has lived in an area long enough that local predators, diseases and competitors limit its numbers.' },
        { term: 'invasive species', definition: 'a species carried into a new area where the predators, diseases and competitors that limited it elsewhere are absent, so its population can grow quickly.' },
        { term: 'evidence', definition: 'measurements or observations, such as population counts before and after a change, used to support a claim.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-predator-removal',
      kind: 'worked_example',
      problem:
        'A desert food chain runs like this, with each arrow pointing the way energy flows: grass to grasshopper, grasshopper to lizard, lizard to hawk. A disease spreads through the hawks and most of them disappear. Trace the effect at least two steps further down the chain, and say what evidence would test your prediction.',
      steps: [
        'Name the change first. The disruption is a living change: one population, the hawks, drops sharply. Nothing else changed at the same time.',
        'Step one. Ask which population the hawks touched directly. Hawks ate lizards, so with fewer hawks hunting, fewer lizards are eaten. The lizard population rises.',
        'Step two. Ask what the lizards eat. Lizards eat grasshoppers. More lizards means more grasshoppers eaten, so the grasshopper population falls.',
        'Step three. Ask what the grasshoppers eat. Grasshoppers eat grass. Fewer grasshoppers means less grass eaten, so the grass grows thicker. Notice the pattern: up, down, up. The effect flips direction at each step because each population is eaten by the one above it.',
        'Now add the limit. The lizard population does not rise forever. As lizards become more common they run out of grasshoppers to eat, and that shortage of food is a limiting factor that stops the rise. A prediction that ends with "and then there were lizards everywhere" ignores that.',
        'Finally, name the evidence. Counts of hawks, lizards and grasshoppers taken the same way each year, before and after the disease, plus the known feeding relationships in this chain. WRONG way to argue: "Losing the hawks must be bad for everything." CORRECT way: state the claim, give the counts, and explain the chain that connects them.',
      ],
      answer:
        'Fewer hawks means fewer lizards eaten, so lizards rise. More lizards eat more grasshoppers, so grasshoppers fall. Fewer grasshoppers eat less grass, so the grass increases. Yearly population counts of hawks, lizards and grasshoppers, compared before and after the disease, would test the prediction.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-drought-and-recovery',
      kind: 'worked_example',
      problem:
        'A meadow food web runs like this, with each arrow pointing the way energy flows: grass to rabbit, grass to mouse, rabbit to fox, mouse to fox. A drought lasting two summers leaves far less grass growing. Construct an argument for what happens to the rabbits and the foxes, and say whether the meadow returns to exactly what it was once the rain comes back.',
      steps: [
        'Name the change and its type. Less rainfall is a change to a PHYSICAL part of the ecosystem. It is a natural disruption, not a human one.',
        'Step one. Grass is a producer and the food source for both rabbits and mice. Less grass means less food, and food shortage is a limiting factor. Both the rabbit and the mouse populations fall.',
        'Step two. Foxes eat rabbits and mice. With fewer of both, foxes have less food, so the fox population falls as well. The drought never touched a fox directly, yet it reached the foxes in two steps.',
        'State the argument in full. CLAIM: the drought reduced the rabbit and fox populations. EVIDENCE: rainfall records showing two dry summers, measurements of how much grass was growing, and yearly counts of rabbits and foxes. REASONING: rabbits feed on the grass and foxes feed on the rabbits, so a shortage at the bottom of the web moves upward.',
        'Now the recovery. When the rain returns the grass grows back, the surviving rabbits have more food, and the rabbit population can rise again, which lets the fox population rise too.',
        'But do not promise an exact return. If a plant species died out of the meadow during the drought, it does not come back on its own. If different plants spread into the bare ground first, the mix of food in the meadow is different, and that may favor different animals. WRONG: "Everything goes back to normal." CORRECT: the meadow rebuilds through succession, and the rebuilt meadow may be similar to the old one or noticeably different.',
      ],
      answer:
        'Less grass means less food for rabbits and mice, so both fall; fewer rabbits and mice means less food for foxes, so foxes fall too, even though the drought never touched a fox directly. When rain returns the meadow rebuilds in stages, but it does not have to rebuild into exactly the community that was there before.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-trace-two-steps',
      kind: 'try_yourself',
      problem:
        'A meadow food web runs like this, with each arrow pointing the way energy flows: grass to rabbit, grass to mouse, rabbit to fox, mouse to fox. A disease removes most of the foxes, and nothing else changes at first. Which prediction traces the effect two steps out and is best supported?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The rabbit population increases, and nothing else in the meadow changes.' },
        { id: 'b', text: 'The rabbit and mouse populations decrease, because losing any member of a food web makes every population fall.' },
        { id: 'c', text: 'The rabbit and mouse populations increase, and the grass increases as well.' },
        { id: 'd', text: 'The rabbit and mouse populations increase, and the grass they feed on decreases.', correct: true },
      ],
      expectedAnswer: 'The rabbit and mouse populations increase, and the grass they feed on decreases.',
      hints: [
        'Step one: the foxes ate both the rabbits and the mice. What happens to those two populations when far fewer of them are eaten?',
        'Step two: follow the arrows back one more link. Both rabbits and mice feed on the grass, so what happens to the grass when there are more of them?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fire-and-succession',
      kind: 'try_yourself',
      problem:
        'Lightning starts a fire that burns through a pine forest. Ten years later, grasses, wildflowers, shrubs and young pines are growing where the burned trees stood. Which statement is best supported by what is described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because plants are growing again, the fire did not really change any of the populations in the forest.' },
        { id: 'b', text: 'The forest will rebuild in exactly the same order and end with exactly the same species in the same numbers as before.' },
        { id: 'c', text: 'The ecosystem was destroyed permanently, because the original trees are gone.' },
        { id: 'd', text: 'The community is rebuilding in stages through succession, and it may end up different from the forest that burned.', correct: true },
      ],
      expectedAnswer: 'The community is rebuilding in stages through succession, and it may end up different from the forest that burned.',
      hints: [
        'Two of these answers are extremes: one says the ecosystem is ruined forever, the other says nothing really happened. Both are stronger claims than the description supports.',
        'Grasses and wildflowers first, then shrubs and young trees, is a sequence. Ask whether a rebuilt community has to match the old one exactly.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-new-species-spread',
      kind: 'try_yourself',
      problem:
        'A water plant native to another continent is accidentally released into a lake. Within a few years it covers most of the lake surface, while in the lakes where it is native it grows only in scattered patches. Which explanation is best supported?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The new lake must contain more nutrients than any of the lakes where the plant is native.' },
        { id: 'b', text: 'The plant grows faster in the new lake because it wants more space than it had at home.' },
        { id: 'c', text: 'The plant is a harmful kind of plant, so it damages every lake it reaches.' },
        { id: 'd', text: 'In its native lakes, insects, diseases and competing plants limit its growth, and in the new lake those limits are absent.', correct: true },
      ],
      expectedAnswer: 'In its native lakes, insects, diseases and competing plants limit its growth, and in the new lake those limits are absent.',
      hints: [
        'The plant is the same plant in both lakes. If the plant did not change, then something about the two places must be different.',
        'Think about what keeps a population from growing without limit: things that eat it, diseases that spread through it, and other species competing for the same space and light.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-human-only-and-permanent',
      kind: 'misconception_check',
      question:
        'A student writes: "Ecosystems only get disrupted when people interfere, and once an ecosystem has been disrupted it is ruined for good." Two separate things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Ecosystems only get disrupted when people interfere.',
          misconception:
            'Hearing the word disruption as a word for damage caused by people, because most disruption stories a student meets are human ones.',
          correctsTo:
            'People cause some disruptions, and nature causes many others. Lightning fires, floods, droughts, storms and diseases all change the physical or living parts of an ecosystem, and they were doing so long before there were people. The useful question is never who caused it. The useful question is what changed, which populations that change touched first, and where the effect went from there.',
        },
        {
          answer: 'Once an ecosystem has been disrupted it is ruined for good.',
          misconception:
            'Treating every disruption as permanent destruction, and treating recovery as an all-or-nothing return to the exact community that was there before.',
          correctsTo:
            'After a disruption a community usually rebuilds in stages, which is called succession: fast-growing plants first, then shrubs and quick trees, then slower trees. Some ecosystems even depend on disruption that returns regularly, such as a prairie kept open by periodic fire, or pine cones sealed with resin that opens only in the heat of a fire. What matters is how large the disruption is and how often it happens. And the rebuilt community does not have to match the original one: a species lost during the disruption does not return on its own, so the meadow or forest that grows back may support a different mix of animals.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A disruption is a change to a physical part of an ecosystem (water, temperature, soil, light) or to a living part (a species arrives, disappears, or gets sick). Many disruptions are natural.',
        'A change to ONE population ripples outward. Trace at least two steps: remove a predator and its prey rises, then the food that prey eats falls.',
        'The ripple travels sideways too — two species that eat the same food are connected even though neither one eats the other.',
        'An argument needs a claim, evidence (population counts before and after, rainfall records, known feeding relationships) and reasoning that links them. A prediction with no measurements behind it is a guess.',
        'Succession is the rebuilding of a community in stages after a disruption, and the rebuilt community may differ from the original one.',
        'Not all disruption is damage: some ecosystems, like fire-swept prairies and certain pine forests, depend on disruption that returns regularly.',
        'A species moved to a new place can spread quickly because the predators, diseases and competitors that limited it at home are missing. Nothing in nature decides to spread, and the organism is not evil.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Ecosystem Disruption & Change' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
