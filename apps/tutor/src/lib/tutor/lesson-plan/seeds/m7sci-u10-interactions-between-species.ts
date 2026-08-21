/**
 * Grade 7 Science (Life Science) -- Ecosystem Interactions: Interactions
 * Between Species.
 *
 * Concept-led (NGSS MS-LS2-2). The five interaction types matter far less
 * than the procedure that sorts them: take each species on its own and ask
 * whether it benefits, is harmed, or is unaffected. Two answers give the
 * label. Everything else in this lesson exists to drill that test.
 *
 * TWO REGISTER RULES ENFORCED THROUGHOUT: no moral framing of predation
 * (benefit and harm, never cruel or bad), and no intent language anywhere
 * (a bee does not decide to help a flower -- pollen sticks to it and moves).
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U10_INTERACTIONS_BETWEEN_SPECIES: LessonPlan = {
  id: 'evelyn.ms.m7sci.interactions-between-species.v1',
  title: 'Interactions Between Species',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.interactions-between-species',
      standard: 'M7SCI-10.1',
      description:
        'Classify the interactions between two species in an ecosystem as predation, competition, mutualism, commensalism, or parasitism by asking, for each species separately, whether it benefits, is harmed, or is unaffected (NGSS MS-LS2-2).',
    },
  ],
  prerequisites: ['m7sci.biomes-and-habitats'],
  followUps: ['m7sci.population-changes-and-limits'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that one backyard holds several different kinds of species interaction, so a sorting tool is needed.',
      script:
        'Watch one backyard for a minute. A bee lands on a flower and lifts off dusted with yellow. A robin carries twigs into a fork of the oak tree. On the porch, a dog scratches at a tick behind its ear. Along the fence, a cat freezes and watches a mouse. That is four pairs of living things, and not one pair is doing what another pair is doing. Ecologists do not invent a new name for every backyard. They use five names, and one short test that tells you which name fits. Today you learn the test, and the names come along for free.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-interaction-types',
      kind: 'concept',
      goal: 'Install the benefit / harmed / unaffected test, then hang the five interaction types on it.',
      keyIdeas: [
        'ONE TEST SORTS ALL OF THEM -- take the two species one at a time and ask a single question about each: does this species BENEFIT, is it HARMED, or is it UNAFFECTED. That is two answers, one per species, and the pair of answers hands you the label. Never judge the pair as a whole at once, and never start from the name you were hoping for. Most students walk in believing that every interaction between species is either eating or fighting. Most interactions are neither.',
        'PREDATION -- one species eats the other. An owl catches a mouse: the owl benefits, the mouse is harmed. Predation happens in every ecosystem there is, and it is an ordinary relationship, not a crime. Describe it with the words benefit and harm. Do not describe it with the words cruel, mean or evil. A predator is not a bad animal and prey is not a victim; those words belong to stories, not to ecology.',
        'COMPETITION -- two species need the SAME resource and there is not enough of it to go around, so both are held back. Lions and hyenas at one carcass are competing, because every mouthful one takes is a mouthful the other does not get. Competition does not require fighting, and it does not even require meeting: a hawk that hunts mice by day and an owl that hunts the same mice by night are competing, because they draw on one short supply. Competition also happens WITHIN a single species -- two lions in one pride, or two pine seedlings sprouting a step apart, compete with each other too.',
        'THE THREE SYMBIOSES -- these are the close relationships where two species live together over a long stretch of time. MUTUALISM: both benefit, as when a bee takes nectar from a flower and carries that flower pollen to the next plant. COMMENSALISM: one benefits and the other is unaffected, as when a robin nests in an oak. PARASITISM: one benefits and the other is harmed, as when a tick feeds on the blood of a dog. Run the test and the three sort themselves out: benefit and benefit, benefit and unaffected, benefit and harm.',
        'A PARASITE USUALLY DOES NOT KILL ITS HOST -- and the reason is structural, not kind. A parasite lives on or in its host and feeds there over days, weeks or years. A host that dies quickly takes the parasite home with it and ends the feeding. So slow harm, not death, is the ordinary pattern. WRONG: "A parasite is a slow predator that kills its host in the end." CORRECT: "A parasite feeds on a living host and usually harms it without killing it." That is also the clean line between the two: a predator kills and eats, and the whole relationship is over in minutes, while a parasite feeds on something that goes on living.',
        'COMMENSALISM IS THE HARDEST LABEL TO BE SURE OF -- showing that a species BENEFITS is usually easy, and showing that it is HARMED is usually easy. Showing that a species is truly UNAFFECTED is much harder, because a small effect is easy to miss. Scientists still use the label, and a careful answer says the honest thing out loud: as far as we can tell, the tree is unaffected. That is not a weak answer. That is what science actually asks for.',
      ],
      vocabulary: [
        { term: 'predation', definition: 'an interaction in which one species eats another; the predator benefits and the prey is harmed.' },
        { term: 'competition', definition: 'an interaction in which two organisms need the same limited resource, so both get less of it.' },
        { term: 'symbiosis', definition: 'a close relationship between two species that live together over a long stretch of time.' },
        { term: 'mutualism', definition: 'a symbiosis in which both species benefit.' },
        { term: 'commensalism', definition: 'a symbiosis in which one species benefits and the other is unaffected.' },
        { term: 'parasitism', definition: 'a symbiosis in which one species benefits and the other is harmed, usually without being killed.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-three-pairs',
      kind: 'worked_example',
      problem:
        'Name the interaction in each pair and say how you decided. (1) A bee lands on a flower, drinks nectar, and lifts off with pollen stuck to its body; some of that pollen rubs onto the next flower it visits. (2) A tick attaches behind the ear of a dog and feeds on its blood for several days. (3) A robin builds a nest in the fork of an oak tree.',
      steps: [
        'Run the same test three times. For each species in the pair ask: benefit, harmed, or unaffected. Write both answers down BEFORE you reach for a name.',
        'Bee and flower. The bee gets nectar, which is food, so the bee BENEFITS. The flower gets its pollen delivered to another flower of its kind, which is how it makes seeds, so the flower BENEFITS. Benefit and benefit is MUTUALISM.',
        'Watch the language on that one. The bee does not visit in order to help the plant. The bee visits because the flower holds nectar, and pollen sticks to a fuzzy bee on the way past. The benefit to the plant is a CONSEQUENCE of how the flower is built and how the bee moves. Nothing decided anything.',
        'Tick and dog. The tick gets a blood meal, so the tick BENEFITS. The dog loses blood, and the bite itches and can become infected, so the dog is HARMED. Benefit and harm is PARASITISM. Notice that the dog is still walking around. That is the usual outcome, not a lucky one.',
        'Robin and oak. The robin gets a sheltered place for its eggs, so the robin BENEFITS. A nest of twigs resting in a fork does not feed the oak and does not damage it, so as far as we can tell the oak is UNAFFECTED. Benefit and unaffected is COMMENSALISM.',
        'Now look at what the three had in common: one species benefited every time, so the first answer never once decided the label. The SECOND answer did all the work. That is the fast way to run this test -- spot the species that obviously gains, then spend your thinking on the other one.',
      ],
      answer:
        'Bee and flower = mutualism (both benefit); tick and dog = parasitism (tick benefits, dog harmed); robin and oak = commensalism (robin benefits, oak unaffected).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-predation-vs-competition',
      kind: 'worked_example',
      problem:
        'Three things are happening in one grassland. (1) An owl catches a mouse and eats it. (2) A hawk hunts the same kind of mouse by day while the owl hunts it by night, and this year mice are scarce. (3) A flea lives in the fur of a fox and feeds on small amounts of its blood. Name each interaction.',
      steps: [
        'Same test, three more times. Benefit, harmed, or unaffected, one species at a time.',
        'Owl and mouse. The owl gets a meal, so it BENEFITS. The mouse is caught and eaten, so it is HARMED. One species eats the other, which is PREDATION.',
        'Hawk and owl. This is the pair students get wrong, because the two birds never even meet. Ask the test anyway. Mice are scarce, so every mouse the owl takes is a mouse the hawk cannot have: the hawk is HARMED, meaning held back. Reverse it and the owl is HARMED in the same way. Harm and harm, over one short supply, is COMPETITION.',
        'Be careful about what competition is about. It is about the resource, not about the two birds attacking each other. Meeting is not required. And the supply has to be LIMITED: if mice were everywhere and no bird went hungry, these two would not be competing at all, even though they eat exactly the same food.',
        'Flea and fox. The flea gets blood, so it BENEFITS. The fox loses a little blood and gets itchy bites, so it is HARMED. The fox keeps hunting and living, so this is PARASITISM.',
        'Set case 1 against case 3 and the difference is time. Predation ends the life of the mouse in a single event. Parasitism harms the fox slowly while the fox stays alive, which is the arrangement that keeps the flea fed.',
      ],
      answer:
        'Owl and mouse = predation; hawk and owl = competition (they share one limited food supply without ever meeting); flea and fox = parasitism.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cow-gut-bacteria',
      kind: 'try_yourself',
      problem:
        'Certain bacteria live in the stomach of a cow. The bacteria get a warm place and a steady supply of food. With the help of those bacteria, the cow can break down tough grass that it could not break down on its own. Which interaction is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Commensalism, because the bacteria gain and a cow is far too big to be affected by something that small' },
        { id: 'b', text: 'Predation, because the bacteria feed on material inside the cow' },
        { id: 'c', text: 'Parasitism, because anything that lives inside another animal is harming it' },
        { id: 'd', text: 'Mutualism, because the bacteria and the cow each get something they need', correct: true },
      ],
      expectedAnswer: 'Mutualism, because the bacteria and the cow each get something they need',
      hints: [
        'Run the test on one species at a time. The bacteria clearly benefit, so the label depends completely on your answer for the cow.',
        'Read the last sentence of the problem again. It tells you exactly what the cow gets out of the arrangement.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-squirrels',
      kind: 'try_yourself',
      problem:
        'Two different species of squirrel live in the same forest, and both of them eat acorns. In a year when the oak trees make few acorns, both species raise fewer young. Neither squirrel eats the other, and the two species almost never meet. Which interaction is this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Parasitism, because one species is gaining at the expense of the other' },
        { id: 'b', text: 'No interaction at all, because the two species almost never meet' },
        { id: 'c', text: 'Predation, because each species is taking food away from the other' },
        { id: 'd', text: 'Competition, because both species need the same resource and there is not enough of it', correct: true },
      ],
      expectedAnswer: 'Competition, because both species need the same resource and there is not enough of it',
      hints: [
        'Two species do not have to touch each other to affect each other. Ask what each species gets in the year the acorns run short.',
        'Predation means one species EATS the other, and parasitism means one species lives on or in the other and feeds there. Check whether either of those is happening here.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plant-on-bark',
      kind: 'try_yourself',
      problem:
        'A small plant grows on the bark high up the trunk of a rainforest tree. The plant makes its own food from sunlight, takes nothing from the tree, and is far too small to shade it. The tree appears to be neither helped nor harmed. Which answer is best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mutualism, because the plant benefits and the tree benefits from having it there' },
        { id: 'b', text: 'Parasitism, because the plant is living on the tree and taking up its space' },
        { id: 'c', text: 'Commensalism, and a careful answer adds that being sure the tree is truly unaffected is hard', correct: true },
        { id: 'd', text: 'Competition, because the plant and the tree both need sunlight to make food' },
      ],
      expectedAnswer: 'Commensalism, and a careful answer adds that being sure the tree is truly unaffected is hard',
      hints: [
        'One species obviously benefits, so the label rests entirely on your answer for the tree.',
        'Three of these answers claim the tree either gains something or loses something. The problem tells you it does neither.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-parasites-and-competition',
      kind: 'misconception_check',
      question:
        'A student writes: "A tick is a parasite, so the dog it feeds on will die from it. And the tick is not competing with anything, because competition only happens between two different species." Both sentences are wrong. What should each one say?',
      commonErrors: [
        {
          answer: 'A parasite kills the host it feeds on.',
          misconception:
            'Hearing that a parasite harms its host and stretching harm all the way to death, because the word parasite sounds like the worst thing that could happen to an animal.',
          correctsTo:
            'Most parasites do not kill their hosts, and the reason is structural. A parasite lives on or in one host and feeds there over a long stretch of time. A host that dies quickly ends the feeding and takes the parasite down with it, so slow harm is the ordinary pattern: the dog itches, loses a little blood, and goes on living. That is also the clean line between the two words. A predator kills and eats, and the relationship is finished. A parasite feeds on something that stays alive.',
        },
        {
          answer: 'Competition only happens between two different species.',
          misconception:
            'Filing competition alongside the other interaction types, which are all described between two species, and never noticing that members of ONE species need the same things as each other.',
          correctsTo:
            'Competition happens whenever a resource is short and more than one organism needs it, and members of the same species are the fiercest competitors of all, because they need almost exactly the same food, the same nesting places and the same space. Two ticks feeding on one dog are competing with each other. So are two seedlings sprouting a hand apart. When the competitors belong to different species we call it competition between species; when they belong to the same species we call it competition within a species. The test does not change either way: is there one supply that is not big enough for everyone.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'One test does all the work: for each species separately, ask BENEFIT, HARMED, or UNAFFECTED. The two answers give you the label.',
        'Predation = one species eats the other. Competition = both need the same limited resource, so both are held back.',
        'Mutualism = both benefit. Commensalism = one benefits, the other is unaffected. Parasitism = one benefits, the other is harmed.',
        'Most parasites do not kill their hosts. A dead host ends the feeding, so slow harm is the usual pattern.',
        'Competition needs the resource to be short, does not require fighting or even meeting, and happens within one species as well as between two.',
        'Predation is an ordinary ecological relationship. Describe it with benefit and harm, never with cruel or bad, and never say that a species decided, wanted or chose anything.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Interactions Between Species' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
