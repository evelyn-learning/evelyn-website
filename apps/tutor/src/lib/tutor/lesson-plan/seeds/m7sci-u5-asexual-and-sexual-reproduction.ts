/**
 * Grade 7 Science (Life Science) — Reproduction: Asexual & Sexual Reproduction.
 *
 * Concept-led row built on what NGSS MS-LS3-2 actually asks for: the
 * VARIATION consequence. Asexual reproduction involves one parent and gives
 * offspring with the same genetic information as that parent; sexual
 * reproduction combines genetic information from two parents and gives
 * offspring that vary. The lesson is a trade-off, not a ranking -- the
 * "asexual is primitive" framing is named and rejected, and so is the idea
 * that variation shows up because an organism needs it.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U5_ASEXUAL_AND_SEXUAL_REPRODUCTION: LessonPlan = {
  id: 'evelyn.ms.m7sci.asexual-and-sexual-reproduction.v1',
  title: 'Asexual & Sexual Reproduction',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.asexual-and-sexual-reproduction',
      standard: 'M7SCI-5.2',
      description:
        'Describe how asexual reproduction gives offspring with the same genetic information as the single parent while sexual reproduction combines genetic information from two parents, and explain why that difference means sexual reproduction results in offspring with genetic variation (NGSS MS-LS3-2).',
    },
  ],
  prerequisites: ['m7sci.cell-division-and-growth'],
  followUps: ['m7sci.plant-reproduction-and-pollination'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the puzzle: one strawberry patch of look-alikes next to a family of siblings who all look different.',
      script:
        'A strawberry plant on a windowsill sends out a long stem sideways. Where that stem touches soil, a whole new strawberry plant grows. That new plant is not a little bit like the first one. It carries the same genetic information, from one parent, with nothing added. Now think about a family of brothers and sisters. Same two parents, and yet one is tall, one has curly hair, one is the only one who can roll a tongue. Same starting point, completely different results. Living things make new living things in two very different ways, and today we find out why one way gives copies and the other way gives surprises.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-ways-to-reproduce',
      kind: 'concept',
      goal: 'Define both kinds of reproduction by parent number and genetic outcome, then land the variation trade-off without ranking either one.',
      keyIdeas: [
        'TWO WAYS, TOLD APART BY ONE QUESTION -- how many parents? ASEXUAL REPRODUCTION has ONE parent, and the offspring receive the same genetic information the parent has. SEXUAL REPRODUCTION has TWO parents, and the offspring receive a combination of genetic information from both. Everything else in this lesson follows from that single difference.',
        'WHAT ASEXUAL REPRODUCTION LOOKS LIKE -- a bacterium copies its genetic information and splits into two. A yeast cell grows a small bump, or bud, that breaks off as a new yeast. A hydra in a pond grows a bud on its side that drops off and swims away. A strawberry plant sends out a runner that roots and becomes a new plant. A piece of potato with an eye on it grows into a whole potato plant. One parent every time, and the offspring carry the same genetic information as that parent. Careful, though: same genetic information does not mean same appearance. A runner plant rooted in deep shade may end up smaller than its parent, because where a living thing grows still affects how it grows.',
        'WHAT SEXUAL REPRODUCTION LOOKS LIKE -- most animals and most flowering plants do this. Each parent makes special cells called sex cells, and each sex cell carries half of that parent genetic information. When two sex cells join, the new organism gets one half from each parent. That combination is new. It did not exist in either parent, which is why offspring resemble both parents without matching either one.',
        'THE TRADE-OFF, WHICH IS THE WHOLE POINT -- asexual reproduction is fast and needs no partner, so one organism alone can fill a good spot quickly. The cost is that the offspring are all alike, so a change in conditions, such as a new disease or a hot dry season, can affect all of them the same way. Sexual reproduction is slower and needs two parents, and it produces offspring that VARY. Over many generations that variation is what gives a group of organisms different responses to a change instead of one shared response.',
        'NEITHER WAY IS HIGHER, BETTER OR MORE ADVANCED -- this is the error to refuse. WRONG: "Asexual reproduction is a primitive, simpler kind of life." CORRECT: "Asexual reproduction is a different strategy that works extremely well in many situations." Bacteria and strawberries are not behind anybody. Plenty of organisms use both ways: a strawberry plant spreads by runners AND grows flowers that make seeds, and yeast buds AND can reproduce sexually.',
        'TWO SENTENCES TO NEVER WRITE -- first, WRONG: "The offspring is a blend of the two parents, like mixing two paint colors." CORRECT: the offspring receives whole instructions from each parent, so a trait can show up looking like one parent, or like neither grandparent you expected. Second, WRONG: "Variation appears because the species needs it." CORRECT: variation comes from combining genetic information from two parents, and it happens whether or not anything needs it. Nothing produces a trait because that trait would be useful.',
      ],
      vocabulary: [
        { term: 'asexual reproduction', definition: 'reproduction involving one parent, in which the offspring receive the same genetic information as that parent.' },
        { term: 'sexual reproduction', definition: 'reproduction involving two parents, in which the offspring receive a combination of genetic information from both.' },
        { term: 'offspring', definition: 'the new living things produced by a parent or a pair of parents.' },
        { term: 'sex cell', definition: 'a special cell made by a parent that carries half of the genetic information of that parent.' },
        { term: 'genetic variation', definition: 'the differences in genetic information among the members of a group of living things.' },
        { term: 'budding', definition: 'a form of asexual reproduction in which a new organism grows out of the body of the parent and then separates.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-the-cases',
      kind: 'worked_example',
      problem:
        'Sort each of these four cases as asexual or sexual reproduction, and say what you expect the offspring genetic information to look like. Case 1: a gardener cuts one potato into pieces, each with an eye, and plants them. Case 2: two apple trees exchange pollen, and seeds form inside the apples. Case 3: a single bacterium in warm milk copies its genetic information and splits into two bacteria. Case 4: two frogs in a pond produce a mass of eggs that hatch into tadpoles.',
      steps: [
        'Use the one question that decides it every time: how many parents contributed genetic information?',
        'Case 1: every piece came off ONE potato. One parent, so asexual. Each new plant carries the same genetic information as that original potato plant. Gardeners rely on this, because it is how you get a whole field that produces the same potato you liked.',
        'Case 2: pollen from one tree, the flower of another tree. Two parents, so sexual. Each seed receives a combination of genetic information from both trees, and no two seeds get the same combination. That is why apple growers do not grow a favorite apple variety from seed.',
        'Case 3: one bacterium, splitting. One parent, so asexual. Both new bacteria carry the same genetic information as the original.',
        'Case 4: two frogs, so sexual. Each tadpole receives a combination from both parents, and the tadpoles vary from one another.',
        'Notice what did NOT matter in any of these: size, how fast it happened, or whether the organism seemed simple. Only the number of parents mattered.',
      ],
      answer:
        'Case 1 asexual (one potato, offspring carry the same genetic information). Case 2 sexual (two trees, every seed a different combination). Case 3 asexual (one bacterium, both offspring the same). Case 4 sexual (two frogs, tadpoles vary).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-why-variation-matters',
      kind: 'worked_example',
      problem:
        'A farmer grows two strawberry fields. Field A was grown entirely from runners off one strawberry plant. Field B was grown from seeds, which formed after flowers on many different plants were pollinated. A new mold spreads through the area. In Field A almost every plant is damaged. In Field B some plants are badly damaged, some are lightly damaged, and some are barely touched. Explain the difference.',
      steps: [
        'Name how each field was made. Field A came from runners, which is asexual reproduction from one parent. Field B came from seeds, which is sexual reproduction with two parents behind each seed.',
        'State the genetic information in each field. Every plant in Field A carries the same genetic information as that one parent plant. The plants in Field B each carry a different combination from two parents, so Field B has genetic variation and Field A has almost none.',
        'Apply the mold to Field A. The mold meets many plants, but genetically it is meeting the same plant over and over. Whatever the mold does to one plant, it can do to all of them, so the damage is even across the whole field.',
        'Apply the mold to Field B. The plants differ, so the mold does not meet the same plant twice. Some plants happen to have genetic information that leaves them less affected, and those are the ones barely touched.',
        'WRONG way to finish this: "The Field B plants developed resistance because they needed it." That sentence is false and it is the trap in this lesson. No plant produced anything in response to the mold arriving. CORRECT way: the differences were already there, from the moment each seed formed, long before the mold showed up. The mold did not create the variation. It only revealed it.',
        'Also refuse the ranking. Field A is not a worse or more primitive field. Runners gave the farmer a fast, uniform crop from one good plant, which is exactly what the farmer wanted. The uniformity is the benefit AND the risk at the same time.',
      ],
      answer:
        'Field A plants all carry the same genetic information, so the mold affects them all the same way. Field B plants each carry a different combination of genetic information from two parents, so they respond differently. The variation in Field B existed before the mold arrived and was not produced in response to it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-the-outcome',
      kind: 'try_yourself',
      problem:
        'A hydra living in a pond grows a small bud on the side of its body. The bud grows larger, then breaks off and lives on its own. What is true about the genetic information of the new hydra?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It has the same genetic information as its one parent, because this is asexual reproduction.', correct: true },
        { id: 'b', text: 'It has half of the genetic information of each of its two parents, because this is sexual reproduction.' },
        { id: 'c', text: 'It has genetic information that is a blend of the genetic information of the pond hydras around it.' },
        { id: 'd', text: 'It has new genetic information that the parent did not have, because budding creates variation.' },
      ],
      expectedAnswer: 'It has the same genetic information as its one parent, because this is asexual reproduction.',
      hints: [
        'Start with the question that decides every case: how many parents contributed genetic information here?',
        'The bud grew out of the body of a single hydra. No second parent appears anywhere in the description.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-variation-consequence',
      kind: 'try_yourself',
      problem:
        'A grower fills an entire field with potato plants grown from pieces of one single potato. Which statement best describes the risk of doing this?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The plants are weaker than seed-grown plants, because asexual reproduction is a more primitive way to reproduce.' },
        { id: 'b', text: 'The plants carry the same genetic information, so a disease that affects one plant can affect all of them the same way.', correct: true },
        { id: 'c', text: 'The plants will slowly become more different from one another over the season, so the field will stop being uniform.' },
        { id: 'd', text: 'The plants cannot grow properly, because a new plant needs genetic information from two parents to develop.' },
      ],
      expectedAnswer: 'The plants carry the same genetic information, so a disease that affects one plant can affect all of them the same way.',
      hints: [
        'Every plant in this field came from one parent potato. Ask what all of those plants share.',
        'The risk is not that the plants are weak. The risk is that they are all the same, so one problem is one problem for the entire field.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-source-of-variation',
      kind: 'try_yourself',
      problem:
        'Two guinea pigs have a litter of four young. The four young do not look exactly alike, and none of them looks exactly like either parent. What is the best explanation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each young guinea pig received a different combination of genetic information from its two parents.', correct: true },
        { id: 'b', text: 'Each young guinea pig is an even blend, or average, of the two parents, the way two paint colors mix.' },
        { id: 'c', text: 'The parents produced different young on purpose so that the litter would survive different conditions.' },
        { id: 'd', text: 'The young changed their own genetic information after birth to fit the place where they live.' },
      ],
      expectedAnswer: 'Each young guinea pig received a different combination of genetic information from its two parents.',
      hints: [
        'Two of these choices say that something produced variation because variation was useful. Nothing in living things works that way.',
        'Each parent passes on genetic information through sex cells, and the halves that get combined are not the same for every offspring.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-asexual-is-primitive-and-variation-on-demand',
      kind: 'misconception_check',
      question:
        'A student writes: "Asexual reproduction is the primitive, lower way to reproduce. Sexual reproduction is the advanced way, because organisms make variation when they need it to survive." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'Asexual reproduction is primitive or lower than sexual reproduction.',
          misconception:
            'Ranking the two strategies, usually because asexual reproduction is met first in simple-looking organisms such as bacteria and yeast.',
          correctsTo:
            'There is no higher or lower here. They are two strategies with different trade-offs. Asexual reproduction is fast, needs no partner, and passes on genetic information that already works in that place -- which is an excellent deal when conditions stay steady. Sexual reproduction is slower and needs two parents, and what it buys is offspring that vary. Notice that many organisms use both: a strawberry plant spreads by runners and also grows flowers that make seeds. An organism that did the primitive thing on Monday and the advanced thing on Tuesday would make no sense. They are just two tools.',
        },
        {
          answer: 'Organisms make variation when they need it to survive.',
          misconception:
            'Treating need as a cause -- believing that a challenge in the environment triggers useful differences to appear.',
          correctsTo:
            'Variation does not arrive on request. It comes from combining genetic information from two parents, and it happens whether conditions are easy or hard, useful or useless. In the strawberry example, the plants that were barely touched by the mold were already different before the mold existed. The mold did not produce that difference; it only made the difference visible. The habit worth building is to refuse any sentence of the form "the organism developed it because it needed it."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'One parent means asexual reproduction, and the offspring carry the same genetic information as that parent.',
        'Two parents means sexual reproduction: each parent contributes genetic information through sex cells, and each offspring gets a different combination.',
        'Asexual examples: a bacterium splitting, a yeast or hydra budding, a strawberry runner, a piece of potato with an eye. Sexual examples: most animals and most flowering plants.',
        'The trade-off: asexual is fast and needs no partner, but the offspring are alike, so one change can affect all of them the same way. Sexual is slower, and it produces offspring that vary.',
        'Neither way is higher, better or more advanced, and many organisms use both.',
        'Offspring are not a blend of their parents, and variation never appears because something needed it -- the differences come from how genetic information is combined.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Asexual & Sexual Reproduction' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
