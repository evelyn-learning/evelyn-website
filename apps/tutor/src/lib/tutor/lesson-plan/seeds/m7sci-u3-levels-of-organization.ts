/**
 * Grade 7 Science (Life Science) — Body Systems: Levels of Organization.
 *
 * Concept-led (NGSS MS-LS1-3). The standard is not really about reciting the
 * ladder cell -> tissue -> organ -> organ system -> organism. It is about the
 * body being a SYSTEM OF INTERACTING SUBSYSTEMS: the levels depend on each
 * other, so a failure at one level shows up at every level above it. The
 * lesson therefore spends its worked examples tracing a change UP the ladder
 * rather than reciting the ladder itself.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it. If a lesson needs a diagram
 * or a table, write it out in prose -- never "see the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U3_LEVELS_OF_ORGANIZATION: LessonPlan = {
  id: 'evelyn.ms.m7sci.levels-of-organization.v1',
  title: 'Cells to Tissues to Organs to Systems',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.levels-of-organization',
      standard: 'M7SCI-3.1',
      description:
        'Order the levels of organization in a living thing from cells to tissues to organs to organ systems to the whole organism, and use that order to explain how the body works as a system of interacting subsystems in which a change at one level affects the levels above it (NGSS MS-LS1-3).',
    },
  ],
  prerequisites: ['m7sci.diffusion-and-osmosis'],
  followUps: ['m7sci.digestive-and-circulatory-systems'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the idea that one simple action already uses several levels of the body at once.',
      script:
        'Run up a flight of stairs and stop at the top. Your legs ache a little. Your heart is thumping. You are breathing faster than you were at the bottom. Notice that you did not choose any of that. You only chose to climb. Your leg muscles pulled, and that pulling used up oxygen and food, so blood had to arrive faster, so your lungs had to take in air faster to keep that blood supplied. One action, and three different parts of you had to change together. Today we sort the body into levels, from a single cell up to the whole you, and then we do the part that actually matters: we watch what happens at every level when one level runs into trouble.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-levels',
      kind: 'concept',
      goal: 'Build the ladder cell to tissue to organ to organ system to organism, and establish that the levels interact rather than simply stack.',
      keyIdeas: [
        'THE LADDER, SMALLEST TO LARGEST — CELLS make up TISSUES, tissues make up ORGANS, organs make up ORGAN SYSTEMS, and organ systems make up the whole ORGANISM. Each level is built out of the level below it. Learn the order once, and then spend your effort on what each level actually means, because that is where the questions live.',
        'A TISSUE IS SIMILAR CELLS DOING ONE SHARED JOB — not any handful of cells that happen to be near each other. Muscle tissue is many muscle cells that all shorten to pull. Nervous tissue is many nerve cells that all carry signals. WRONG: "A tissue is a group of cells." CORRECT: "A tissue is a group of SIMILAR cells that work together on the same job." The word similar is doing all the work in that sentence.',
        'AN ORGAN IS DIFFERENT TISSUES WORKING TOGETHER — that is the jump from the level below. The heart is an organ, and it contains muscle tissue that squeezes, nervous tissue that carries the signals which speed the beat up or slow it down, and connective tissue that holds the whole thing together. The stomach is an organ too: muscle tissue churns the food while the tissue lining the inside releases the juices that break the food down. One kind of tissue is a tissue. Several kinds built into one structure with one big job is an organ.',
        'AN ORGAN SYSTEM IS ORGANS WORKING TOGETHER — the circulatory system is the heart plus the blood vessels plus the blood, and it moves materials around the body. The digestive system is the mouth, the stomach, the small intestine and more, and it breaks food down into pieces small enough to enter the blood. All the organ systems together make one ORGANISM, which is one complete living thing.',
        'THE LEVELS DEPEND ON EACH OTHER, AND THAT IS THE REAL POINT — a body is a system made of smaller systems that interact. Nothing works alone. Your muscle cells cannot get oxygen unless the circulatory system delivers it, and the circulatory system has no oxygen to deliver unless the respiratory system takes air in. So a problem at a low level does not stay at that level. Damage a tissue and you have damaged an organ; weaken an organ and the whole system it belongs to does less; weaken a system and the entire organism feels it.',
        'TWO TRAPS WORTH NAMING NOW — first, LEVEL IS ABOUT ORGANIZATION, NOT SIZE. A large single cell, like a bird egg cell, is still just a cell, and a tiny scrap of muscle is still a tissue. Bigger does not mean higher up the ladder. Second, SYSTEMS OVERLAP. One organ can belong to more than one system: the pancreas releases juices that help digest food, which makes it part of the digestive system, and it also releases hormones into the blood that control blood sugar, which places it in the endocrine system, the hormone system, as well. The systems are names we use to describe the body, not walls inside it.',
      ],
      vocabulary: [
        { term: 'tissue', definition: 'a group of similar cells that work together to carry out the same job.' },
        { term: 'organ', definition: 'a structure made of two or more different tissues that work together to do one main job.' },
        { term: 'organ system', definition: 'a group of organs that work together to carry out a large task for the body.' },
        { term: 'organism', definition: 'one complete living thing, made of all of its organ systems working together.' },
        { term: 'level of organization', definition: 'one step in the order cell, tissue, organ, organ system, organism, where each step is built from the step below it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-the-heart',
      kind: 'worked_example',
      problem:
        'A student is told three things about the heart. It is built from muscle tissue, nervous tissue and connective tissue. It squeezes to push blood forward. It works alongside the blood vessels and the blood to move materials around the body. Name the level of organization of (1) the muscle tissue in it, (2) the heart itself, and (3) the heart together with the blood vessels and the blood.',
      steps: [
        'Start with the muscle tissue. Ask the tissue question: is this many SIMILAR cells doing one shared job? Yes, muscle tissue is many muscle cells that all shorten to pull. So the muscle tissue sits at the TISSUE level.',
        'Now the heart. Ask the organ question: are there DIFFERENT kinds of tissue built into one structure with one main job? Yes, three different kinds are listed, and together they do one job, which is pushing blood forward. So the heart is an ORGAN.',
        'A quick check on that reasoning. If the heart were made of muscle tissue and nothing else, it would just be a lump of muscle tissue. It is the combination of different tissues in one structure that makes something an organ.',
        'Now the heart plus the vessels plus the blood. These are separate parts working together on one large task, moving materials around the body. That is the ORGAN SYSTEM level, and this particular one is the circulatory system.',
        'One extra fact that catches students out: blood is counted as a tissue, even though it is a liquid. It is a group of similar cells carried in fluid, doing a shared job. The definition never mentioned being solid.',
        'Finish by walking the ladder in order to check nothing was skipped: muscle cell, then muscle tissue, then the heart, then the circulatory system, then the whole person. Every step is built out of the step before it.',
      ],
      answer:
        'The muscle tissue is at the tissue level. The heart is an organ, because different tissues are built into one structure with one main job. The heart together with the blood vessels and the blood is an organ system, the circulatory system.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trace-a-failure-upward',
      kind: 'worked_example',
      problem:
        'A woman has weak heart muscle tissue, so her heart cannot squeeze as hard as it used to. Every other part of her body starts out healthy. Trace what happens at the organ level, at the system level, and for the whole person.',
      steps: [
        'Start at the level where the trouble is. Weak muscle tissue means the cells of that tissue pull with less force. That is the TISSUE level.',
        'Step up to the ORGAN. The heart is built from that muscle tissue, so a weaker squeeze means less blood is pushed out with each beat. The heart is not a separate thing from its tissues, so damaged tissue is a damaged organ.',
        'Step up to the ORGAN SYSTEM. The circulatory system depends on the heart to move blood through the vessels. Less blood moving means the system delivers less oxygen and fewer nutrients to the cells of the body, and carries away waste more slowly.',
        'Step sideways for a moment, because systems interact. Body cells need oxygen to release the energy stored in food. If oxygen arrives more slowly, cells release energy more slowly. The respiratory system responds by taking in air faster, which is why breathing gets quick and shallow after very little effort.',
        'Step up to the whole ORGANISM. The person feels tired and out of breath climbing the same stairs that were easy last year. That symptom began in a tissue, several levels down.',
        'WRONG way to describe this: "Only the heart is affected, because the other organs are fine." CORRECT way: "The heart is a subsystem of the body, so when it does less every system that depends on the blood it moves does less too." Nothing in the body chose to slow down. Each part simply had less of what it needed.',
      ],
      answer:
        'Weak muscle tissue means the heart, an organ, pushes out less blood per beat. The circulatory system then delivers less oxygen and fewer nutrients to cells and removes waste more slowly, so cells release energy from food more slowly and the respiratory system works harder. The whole person tires quickly and gets out of breath. A change at the tissue level traveled all the way up.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-order-the-levels',
      kind: 'try_yourself',
      problem:
        'Put these four levels of organization in order, starting with the smallest and simplest: organ, cell, organ system, tissue.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'cell, tissue, organ, organ system', correct: true },
        { id: 'b', text: 'cell, organ, tissue, organ system' },
        { id: 'c', text: 'tissue, cell, organ, organ system' },
        { id: 'd', text: 'cell, tissue, organ system, organ' },
      ],
      expectedAnswer: 'cell, tissue, organ, organ system',
      hints: [
        'Each level is built out of the level below it. Ask which one is a building block of the next.',
        'The heart is made of tissues, and the tissues are made of cells. The heart is one part of a larger system.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-a-tissue',
      kind: 'try_yourself',
      problem:
        'A scientist studies a sample from inside a leg. Every cell in the sample is the same kind of cell, and all of them shorten together to pull on a bone. Which level of organization is this sample?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A tissue, because it is a group of similar cells working together on one job.', correct: true },
        { id: 'b', text: 'An organ, because any group of cells working together is called an organ.' },
        { id: 'c', text: 'An organ system, because many cells are involved at once.' },
        { id: 'd', text: 'An organism, because the sample is made of living cells.' },
      ],
      expectedAnswer: 'A tissue, because it is a group of similar cells working together on one job.',
      hints: [
        'Two facts in the question matter: the cells are all the SAME kind, and they all do the SAME job.',
        'An organ needs two or more DIFFERENT kinds of tissue built into one structure. Only one kind of cell is described here.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-system-interaction',
      kind: 'try_yourself',
      problem:
        'An illness damages the tissue that lines the inside of the stomach, so the stomach releases much less of the juice that breaks food down. Which statement best describes what happens next?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Only the stomach is affected, because each organ does its own job on its own.' },
        { id: 'b', text: 'Only that one tissue is affected, because a problem in cells is too small to reach a whole system.' },
        { id: 'c', text: 'Nothing changes for the person, because the other organs take over the job of the stomach.' },
        { id: 'd', text: 'The digestive system breaks down less food, so fewer nutrients reach the blood and the rest of the body receives less of what it needs.', correct: true },
      ],
      expectedAnswer: 'The digestive system breaks down less food, so fewer nutrients reach the blood and the rest of the body receives less of what it needs.',
      hints: [
        'The stomach is one organ inside a larger system, and that system hands its results to the blood.',
        'Ask what the next level up was counting on the stomach to do, and then ask who was counting on that.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-organs-work-alone',
      kind: 'misconception_check',
      question:
        'A student writes: "Each organ has its own job and does it by itself. The heart pumps blood, the lungs take in air, and the stomach digests food, so a problem with one organ is a problem for that organ only." What is wrong with that?',
      commonErrors: [
        {
          answer: 'Each organ works independently, so a problem with one organ stays with that organ.',
          misconception:
            'Reading the list of organs and their jobs as a list of separate machines, because each job can be stated in its own short sentence.',
          correctsTo:
            'The body is a system made of smaller systems that interact, and the jobs are linked in a chain. The lungs take oxygen into the blood, but that oxygen goes nowhere unless the heart moves the blood. The stomach breaks food down, but the pieces feed the body only after the blood carries them to the cells. So when the heart pushes out less blood, muscle cells all over the body receive less oxygen and less food, and the person tires quickly even though the muscles themselves are healthy. State it as a chain, not as a list: this organ supplies that system, which supplies those cells.',
        },
        {
          answer: 'The bigger a structure is, the higher its level of organization, and each organ belongs to exactly one system.',
          misconception:
            'Turning the ladder into a size ranking, and treating the system names as sealed boxes with nothing shared between them.',
          correctsTo:
            'Level describes how something is ORGANIZED, not how big it is. A bird egg cell is large and is still a single cell; a scrap of muscle far smaller than that egg is still a tissue, because it is many similar cells doing a shared job. And systems overlap. The pancreas releases juices that help digest food, which puts it in the digestive system, and it also releases hormones into the blood that control blood sugar, which puts it in the endocrine (hormone) system too. Organ systems are useful names for describing the body, not walls built inside it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The order, smallest to largest: cell, tissue, organ, organ system, organism. Each level is built out of the level below it.',
        'A tissue is SIMILAR cells doing one shared job -- muscle tissue, nervous tissue. Not just any group of cells.',
        'An organ is DIFFERENT tissues built into one structure with one main job -- the heart holds muscle, nervous and connective tissue.',
        'An organ system is organs working together -- the circulatory system is the heart, the vessels and the blood; the digestive system is the mouth, stomach, small intestine and more.',
        'The real idea behind this lesson: the body is a system of interacting subsystems, so a failure at one level shows up at every level above it. Weak heart muscle tissue ends as a person out of breath on the stairs.',
        'Level means organization, not size: a large egg cell is still one cell. And systems overlap -- the pancreas serves both the digestive system and the endocrine system.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Cells to Tissues to Organs to Systems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
