/**
 * Grade 7 Science (Life Science) — Reproduction: Plant Reproduction & Pollination.
 *
 * Concept-led (NGSS MS-LS1-4). The spine is that flower parts have JOBS, and
 * those structures raise the PROBABILITY that pollen reaches a stigma and that
 * a seed ends up somewhere it can grow. Two errors are targeted head on: that
 * pollination and fertilization are one event, and that a plant "attracts"
 * pollinators on purpose. Structure and consequence only -- never intent.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every flower in
 * this file is described in words, part by part, so each item is solvable from
 * the text printed in it -- never "see the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U5_PLANT_REPRODUCTION_AND_POLLINATION: LessonPlan = {
  id: 'evelyn.ms.m7sci.plant-reproduction-and-pollination.v1',
  title: 'Plant Reproduction & Pollination',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.plant-reproduction-and-pollination',
      standard: 'M7SCI-5.3',
      description:
        'Describe the parts of a flower by the job each one does, trace the path from pollination to fertilization to seed and fruit to seed dispersal, and argue from evidence that specialized plant structures affect the probability of successful reproduction (NGSS MS-LS1-4).',
    },
  ],
  prerequisites: ['m7sci.asexual-and-sexual-reproduction'],
  followUps: ['m7sci.environment-and-growth'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with two everyday objects that are both reproductive structures the student has handled without noticing.',
      script:
        'Walk through tall grass in the fall and you come home with little prickly balls stuck all over your socks. You pick them off and drop them on the path, annoyed. You have just planted something. Now think about the last apple you ate. You threw away the core, and the core was full of seeds. Burrs and apples look like nothing alike, but they are doing the same job. Both are ways a plant gets a seed away from the parent plant and into new ground. Today we start earlier than that, at the flower, and we follow the whole chain: pollen moves, an egg cell is fertilized, a seed forms, a fruit forms around it, and then the seed travels. Every step depends on a plant part with a specific job.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-flower-parts-and-pollination',
      kind: 'concept',
      goal: 'Name flower parts by function, separate pollination from fertilization, and frame pollinator relationships as consequence rather than intent.',
      keyIdeas: [
        'A FLOWER IS A REPRODUCTIVE STRUCTURE, AND EACH PART HAS A JOB. The STAMEN is the pollen-producing part: a thin stalk called the filament, topped by a sac called the ANTHER, and the anther is where pollen forms. The PISTIL is the seed-producing part: a sticky tip called the STIGMA, a narrow column called the style, and a rounded chamber at the base called the OVARY. Inside the ovary sit tiny OVULES, and each ovule contains an egg cell. Petals and sepals surround all of this. Learn these five names by asking what would fail if that part were missing.',
        'POLLINATION AND FERTILIZATION ARE TWO DIFFERENT EVENTS, IN THAT ORDER. POLLINATION is the TRANSFER of pollen from an anther onto a stigma. Nothing has joined yet. FERTILIZATION happens afterward: a tube grows down from the pollen grain through the style, and a sperm cell from the pollen joins the egg cell inside an ovule. WRONG: "The flower was pollinated, so the egg cell was fertilized at that moment." RIGHT: "The flower was pollinated, and fertilization followed when a sperm cell reached the egg cell." Pollination can happen and fertilization can still fail, so the two words are not swappable.',
        'AFTER FERTILIZATION, THE FLOWER TURNS INTO A SEED CARRIER. Each fertilized ovule becomes a SEED, which holds a tiny plant plus a food supply. The ovary around those ovules swells and becomes the FRUIT. That is what a fruit IS -- not a snack the plant set out, but the grown ovary wrapped around seeds. An apple, a tomato, a pea pod and a burr are all fruits by that definition. Petals usually dry up and fall off once they are no longer part of the transfer.',
        'SEED DISPERSAL MOVES THE SEED AWAY FROM THE PARENT. A seed dropped directly under the parent plant sits in the parent shade and competes with it for water and light, so seeds that travel have a better chance. WIND carries light seeds with wings or fluff. WATER floats seeds like a coconut. ANIMALS EATING FRUIT swallow seeds with the sweet flesh and leave them somewhere else later. HOOKED BURRS catch on fur or on your socks and fall off far from where they started. Dispersal is the last step in the chain, and it is still part of reproduction.',
        'STRUCTURES RAISE THE CHANCE OF POLLINATION -- THEY DO NOT PLAN IT. Bright petals, scent and sugary nectar bring animal visitors in. A bee comes for the nectar, brushes past the anthers, gets dusted with pollen, and carries some of it to the next flower it lands on. BOTH SIDES GAIN: the animal gets food, and the pollen gets moved. But be careful with the language. WRONG: "The flower developed bright petals in order to attract bees." RIGHT: "Flowers with brighter petals were visited more often and left more offspring, and over many generations bright petals became common in that population." No plant plans anything and no plant chooses anything. Structure, then consequence, over many generations.',
        'NOT EVERY FLOWER USES ANIMALS. Grasses, oaks and many other plants are pollinated by WIND. Their flowers are small, dull and green, with no scent and no nectar, because none of that would move air. Instead they release large amounts of very light pollen, and sheer quantity raises the chance that a grain lands on a stigma of the same kind of plant. That loose pollen in the air is also what sets off hay fever in spring. So a plain green flower is not a failed flower. It is a plant whose pollen travels a different way.',
      ],
      vocabulary: [
        { term: 'pollination', definition: 'the transfer of pollen from an anther onto a stigma.' },
        { term: 'fertilization', definition: 'the joining of a sperm cell from a pollen grain with an egg cell inside an ovule, which happens after pollination.' },
        { term: 'stamen', definition: 'the pollen-producing part of a flower, made of a filament and an anther.' },
        { term: 'pistil', definition: 'the seed-producing part of a flower, made of a stigma, a style and an ovary.' },
        { term: 'ovule', definition: 'a small structure inside the ovary that contains an egg cell and becomes a seed once it is fertilized.' },
        { term: 'seed dispersal', definition: 'the movement of seeds away from the parent plant by wind, water, animals or hooks.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-parts',
      kind: 'worked_example',
      problem:
        'A student takes a lily flower apart and describes four things without naming any of them. Part 1: flat, colored, arranged in a ring around the outside. Part 2: a thin stalk with a small sac at the top; when the sac splits open, fine dusty grains fall out. Part 3: a column standing in the center, sticky at the very tip, narrowing in the middle, and widening into a rounded chamber at the bottom. Part 4: small round bodies packed inside that rounded chamber. Name each part, and say which one receives pollen.',
      steps: [
        'Work part by part, and each time ask what job the description implies rather than trying to picture a textbook drawing.',
        'Part 1 is flat, colored and on the outside. Those are the PETALS. Color and scent make animal visits more likely, but petals carry no pollen themselves.',
        'Part 2 has a sac that splits and releases dusty grains. Those grains are POLLEN, so this is a STAMEN. The thin stalk is the filament and the sac at the top is the ANTHER.',
        'Part 3 is one column with three regions, so read it from top to bottom. The sticky tip is the STIGMA, the narrow middle is the style, and the rounded chamber at the base is the OVARY. Together they are the PISTIL.',
        'Part 4 sits inside the ovary, so those are the OVULES. Each ovule holds an egg cell, and each fertilized ovule becomes a seed.',
        'Now the question asked. Pollen is received at the STIGMA, the sticky tip. Notice why the stickiness matters: a grain that lands there stays there instead of blowing off. Say that carefully, though. WRONG: "The stigma is sticky in order to hold pollen." RIGHT: "Flowers with stickier stigmas held more of the pollen that landed on them and left more offspring, and over many generations sticky stigmas became common."',
      ],
      answer:
        'Part 1 is the petals. Part 2 is a stamen, made of a filament and an anther that produces pollen. Part 3 is the pistil, made of a stigma at the top, a style in the middle and an ovary at the base. Part 4 is the ovules inside the ovary. The stigma is the part that receives pollen.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sealed-room-tomatoes',
      kind: 'worked_example',
      problem:
        'A gardener plants two tomato seeds from the same packet. One plant grows outdoors. The other grows in a sealed indoor room with no insects and no moving air. Both plants grow tall, stay green and healthy, and both produce plenty of flowers. Weeks later the outdoor plant carries tomatoes and the indoor plant carries none. Explain the difference using the evidence given, and predict one thing the gardener could do indoors to change the result.',
      steps: [
        'First list what is the SAME, because that is what rules explanations out. Same seed packet, so the same kind of plant. Both grew tall and green, so both were healthy. Both flowered, so both could build flowers.',
        'Now list what DIFFERS. Outdoors there are insects and moving air. In the sealed room there are neither.',
        'Ask what those two missing things actually do. Pollen has to get from an anther onto a stigma. Pollen does not travel there by itself. It is carried, either by an animal visitor or by moving air.',
        'With no carrier, no pollen reached a stigma, so no pollination happened. With no pollination there is no fertilization. With no fertilization the ovules never became seeds, and the ovary never swelled into a fruit. A tomato IS that swollen ovary, so no tomatoes is exactly what we should expect.',
        'Check a wrong explanation against the evidence. WRONG: "The indoor plant did not get enough light, and that is why it made no fruit." The evidence says the indoor plant grew tall, stayed green and flowered, which is not what a badly lit plant does. The evidence points at the missing transfer step, not at light.',
        'Now predict. If the missing piece is the carrier, then supplying a carrier should restore the tomatoes. The gardener could brush pollen from an anther onto a stigma with a small soft paintbrush, or set up a fan so moving air shakes the pollen loose. That prediction is testable: run it on half the indoor flowers and leave the other half alone.',
      ],
      answer:
        'The indoor flowers were never pollinated. Both plants were healthy and both flowered, so the difference is not the plant and not the light -- it is that the sealed room had no insects and no moving air to carry pollen from an anther to a stigma. No pollination means no fertilization, so no ovule became a seed and no ovary became a fruit. The gardener could move pollen by hand with a soft brush, or add a fan, and then compare treated flowers with untreated ones.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-part-receives-pollen',
      kind: 'try_yourself',
      problem: 'In a flower, which structure receives pollen?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The anther, the sac at the top of the stamen' },
        { id: 'b', text: 'The stigma, the sticky tip of the pistil', correct: true },
        { id: 'c', text: 'The ovary, the rounded chamber at the base of the pistil' },
        { id: 'd', text: 'The petals, the colored parts arranged around the outside' },
      ],
      expectedAnswer: 'The stigma, the sticky tip of the pistil',
      hints: [
        'Pollen leaves one part of a flower and arrives at another. One of these choices is where pollen is PRODUCED, so it cannot also be where pollen is received.',
        'The receiving part is on the pistil, and it is the part a bee brushes first because it stands at the top.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pollination-versus-fertilization',
      kind: 'try_yourself',
      problem:
        'A bee picks up pollen from the anther of one apple flower and later lands on a second apple flower, leaving some of that pollen on its stigma. Which statement describes what has happened so far?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Pollination has happened, and fertilization follows only if a sperm cell from the pollen reaches an egg cell inside an ovule.', correct: true },
        { id: 'b', text: 'Fertilization has happened, because pollination and fertilization are two names for the same event.' },
        { id: 'c', text: 'Fertilization has happened first, and pollination will follow once the seed starts to form.' },
        { id: 'd', text: 'Neither has happened, because pollen has to land on a petal before it can reach the pistil.' },
      ],
      expectedAnswer: 'Pollination has happened, and fertilization follows only if a sperm cell from the pollen reaches an egg cell inside an ovule.',
      hints: [
        'One of these words means a TRANSFER from place to place. The other means two cells JOINING. Decide which one the bee just finished doing.',
        'The pollen is sitting on the outside of the pistil, at the stigma. The egg cell is much further in, inside an ovule in the ovary. Something still has to travel.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-wind-pollinated-evidence',
      kind: 'try_yourself',
      problem:
        'A field plant has small green flowers with no scent and no nectar. In late spring its anthers release huge clouds of very light, dry pollen whenever the air moves. What is the best conclusion, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Its pollen is carried by wind, and releasing so much light pollen raises the chance that some grains land on a stigma of the same kind of plant.', correct: true },
        { id: 'b', text: 'Its pollen is carried by insects, because every flowering plant depends on insects for pollination.' },
        { id: 'c', text: 'It cannot reproduce, because it has no bright petals and no nectar to bring pollinators in.' },
        { id: 'd', text: 'Its pollen is carried by water, because dull green flowers only grow close to ponds and streams.' },
      ],
      expectedAnswer: 'Its pollen is carried by wind, and releasing so much light pollen raises the chance that some grains land on a stigma of the same kind of plant.',
      hints: [
        'Read the two clues together: the flower offers nothing an animal would come for, and the pollen is light, dry and released when the air moves.',
        'Wind cannot aim. If a carrier cannot aim, the only way to keep the chance of a hit reasonable is to send out a very large amount.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pollination-is-not-fertilization',
      kind: 'misconception_check',
      question:
        'A student writes: "Pollination is when the pollen fertilizes the flower, and flowers are colorful because people like looking at them." Two separate things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Pollination and fertilization are the same event.',
          misconception:
            'Collapsing two steps into one, because both words show up in the same paragraph and both sound like the moment reproduction happens.',
          correctsTo:
            'They are two events, and they happen in a fixed order. POLLINATION is a transfer: pollen moves from an anther onto a stigma, on the OUTSIDE of the pistil. Nothing has joined yet. FERTILIZATION comes afterward: a tube grows from the pollen grain down through the style, and a sperm cell joins the egg cell inside an ovule. The proof that they are separate is that pollination sometimes happens and fertilization never follows, for example when the pollen came from a different kind of plant. Only after fertilization does an ovule become a seed and the ovary become a fruit. Keep the chain in order: pollination, then fertilization, then seed, then fruit, then dispersal.',
        },
        {
          answer: 'Flowers are brightly colored because people like to look at them.',
          misconception:
            'Explaining a plant structure by what it does for humans, and then sliding into the idea that the plant chose the structure on purpose.',
          correctsTo:
            'Flowering plants existed long before people did, so we cannot be the reason. Bright petals, scent and nectar make animal visits more likely, and a visitor that comes for the nectar brushes the anthers, picks up pollen, and drops some of it on the next stigma it touches. Both sides gain: the animal gets food, and the pollen gets moved. Now the language trap. WRONG: "The flower developed bright petals in order to attract bees." RIGHT: "Flowers with brighter petals were visited more often and left more offspring, and over many generations bright petals became common in that population." No plant plans, chooses or intends anything. Also remember that many flowers are not showy at all -- grasses and oaks have small dull flowers and let the wind carry their pollen instead.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Flower parts by job: stamen (filament plus anther) produces pollen; pistil (stigma, style, ovary) receives pollen and holds the ovules; petals surround it all.',
        'Pollination is the TRANSFER of pollen onto a stigma. Fertilization is the JOINING of a sperm cell with an egg cell, and it comes afterward. They are never the same event.',
        'Order of the whole chain: pollination, fertilization, ovule becomes seed, ovary becomes fruit, seed is dispersed.',
        'A fruit is a grown ovary wrapped around seeds -- an apple, a tomato, a pea pod and a burr all count.',
        'Seeds are dispersed by wind, by water, by animals that eat the fruit, and by hooks that catch on fur, so the new plant does not compete with its parent.',
        'Bright petals, scent and nectar raise the chance of an animal visit, and both the plant and the animal gain. Say it as structure and consequence over many generations, never as a plant planning or wanting anything.',
        'Wind-pollinated plants have small dull flowers with no nectar and release large amounts of light pollen instead.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Plant Reproduction & Pollination' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
