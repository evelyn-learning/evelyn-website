/**
 * Grade 7 Science (Life Science) — Energy: Cellular Respiration.
 *
 * The energy-bookkeeping row of Unit 4 (NGSS MS-LS1-7), and the place where
 * two confusions have to die. First: breathing is NOT cellular respiration.
 * Breathing moves air; cellular respiration is a chemical process inside
 * cells. Second: plants do cellular respiration too, all the time, day and
 * night. Photosynthesis and cellular respiration are COMPLEMENTS -- the
 * inputs of one are the outputs of the other -- not opposites, and not two
 * alternatives an organism picks between.
 *
 * Register note: word equation only. No glycolysis, no Krebs cycle, no
 * electron transport chain, no ATP counts. Anaerobic respiration is a single
 * passing sentence with no biochemistry.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U4_CELLULAR_RESPIRATION: LessonPlan = {
  id: 'evelyn.ms.m7sci.cellular-respiration.v1',
  title: 'Cellular Respiration',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.cellular-respiration',
      standard: 'M7SCI-4.3',
      description:
        'Describe cellular respiration as the chemical process in which cells use glucose and oxygen to release stored energy, producing carbon dioxide and water, and distinguish it from breathing while explaining why plants carry it out as well (NGSS MS-LS1-7).',
    },
  ],
  prerequisites: ['m7sci.photosynthesis'],
  followUps: ['m7sci.matter-and-energy-in-organisms'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Separate the visible act of breathing from the invisible chemical process that actually releases energy.',
      script:
        'Take a normal breath in, and let it out. The part you just noticed is not the useful part. Air moved into your lungs and back out again, and by itself that did nothing for you at all. The useful part is happening somewhere you cannot see it: inside every one of your cells, right now, while you sit still. It happened all night while you were asleep, and it is happening in the grass outside at midnight too. Today we follow the food you ate and the oxygen you breathed in all the way to the place where the energy actually gets released, and we separate two words that get mixed up more often than any other pair in life science.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cellular-respiration',
      kind: 'concept',
      goal: 'Word equation, location, breathing versus respiration, energy released not created, and plants respiring around the clock.',
      keyIdeas: [
        'WHAT CELLULAR RESPIRATION IS — it is the chemical process a cell uses to get energy out of food. Here is the whole thing as a word equation: glucose + oxygen → carbon dioxide + water + released energy. The things on the left are the inputs, and the things on the right are the outputs. Glucose is a sugar, and it is the food being broken down. Most of this process happens inside the MITOCHONDRIA, which is why cells that work hard, like muscle cells, hold so many of them.',
        'BREATHING IS NOT CELLULAR RESPIRATION — this is the confusion this lesson exists to end. WRONG: "Cellular respiration is another word for breathing." CORRECT: "Breathing moves air into and out of the lungs. Cellular respiration is a chemical process inside cells that releases energy from food." The two are connected, because breathing is the delivery service that brings oxygen to the cells and carries the carbon dioxide away. But delivering a package is not the same as opening it. An earthworm has no lungs and never breathes, and every one of its cells still carries out cellular respiration.',
        'ENERGY IS RELEASED, NEVER CREATED — the energy was already stored in the food, and before that it came from sunlight captured by a plant. WRONG: "Cellular respiration makes energy for the cell." CORRECT: "Cellular respiration releases the energy that was already stored in food, in a form the cell can spend." No process anywhere creates energy out of nothing. Watch your own sentences for the word made.',
        'IT RUNS IN EVERY LIVING CELL, ALL THE TIME — not only during exercise, and not only in animals. Your cells were doing this while you slept, because staying alive costs energy even when you are still. Growing, healing a scraped knee, thinking and keeping warm all cost energy. Hard exercise does not switch the process on; it makes an already running process run faster, which is why you breathe harder and your heart speeds up.',
        'PLANTS DO CELLULAR RESPIRATION TOO, DAY AND NIGHT — a plant cell has mitochondria just as your cells do, and it uses them constantly. Photosynthesis and cellular respiration are COMPLEMENTS, not opposites and not two options a living thing chooses between. The inputs of one are the outputs of the other: photosynthesis runs carbon dioxide + water + light energy → glucose + oxygen, and cellular respiration runs glucose + oxygen → carbon dioxide + water + released energy. A plant makes its own food, and then it still has to break that food down to use the energy inside it. Making dinner and eating dinner are two different jobs.',
        'A NOTE ON RUNNING WITHOUT OXYGEN — some living things, such as certain bacteria in deep mud, can release energy from food without any oxygen. Your muscle cells can do it too, but only briefly, during something like a hard sprint, and they release far less energy from the same food that way. That is as far as we take this idea this year.',
      ],
      vocabulary: [
        { term: 'cellular respiration', definition: 'the chemical process in which a cell uses oxygen to release the energy stored in glucose.' },
        { term: 'glucose', definition: 'a sugar that living things use as food and break down for energy.' },
        { term: 'mitochondria', definition: 'the organelles where most of cellular respiration takes place and where energy is released from food.' },
        { term: 'breathing', definition: 'the movement of air into and out of the lungs, which delivers oxygen and removes carbon dioxide.' },
        { term: 'anaerobic', definition: 'describing a process that releases energy from food without using oxygen.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-breathing-versus-respiration',
      kind: 'worked_example',
      problem:
        'A student writes: "I did cellular respiration about twenty thousand times today, because that is how many breaths I took." Trace one breath from the air to a muscle cell in your leg and explain what is wrong with that sentence.',
      steps: [
        'Start where the student started. Air comes in through the nose and mouth and fills the lungs. This is breathing. It is a movement, made by muscles, and nothing chemical has released any energy yet.',
        'Follow the oxygen out of the lungs. Oxygen passes from the lungs into the blood, and the blood carries it around the body to a muscle cell in your leg.',
        'Follow the food separately. The glucose in that same muscle cell came from breakfast, not from the air. It traveled through the digestive system and then through the blood.',
        'Now go inside the cell. In the mitochondria, glucose and oxygen react. The energy stored in the glucose is released into a form the cell can spend, and carbon dioxide and water are left over. THIS is cellular respiration, and it is happening continuously in that cell, not once per breath.',
        'Finish the round trip. The carbon dioxide leaves the cell, rides the blood back to the lungs, and you breathe it out. So breathing bookends the process: it delivers the oxygen and removes the waste gas.',
        'WRONG way to say this: "Breathing is cellular respiration." CORRECT way: "Breathing moves air in and out of my lungs so that cellular respiration, which happens inside my cells, has the oxygen it needs and a way to get rid of the carbon dioxide it produces."',
      ],
      answer:
        'The two are different things. Breathing is the movement of air in and out of the lungs, about twenty thousand times a day. Cellular respiration is a chemical process running continuously inside the cells, where glucose and oxygen release energy and leave carbon dioxide and water. Breathing supplies and removes the gases; it does not release the energy.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-plant-at-night',
      kind: 'worked_example',
      problem:
        'An oak tree stands in a field. Describe what its cells are doing with energy at noon on a sunny day, and what they are doing at two in the morning in the dark.',
      steps: [
        'List what each process needs. Photosynthesis needs light, carbon dioxide and water. Cellular respiration needs glucose and oxygen, and it does not need light at all.',
        'Take noon first. There is plenty of light, so photosynthesis is running and the tree is making glucose. But the tree also needs energy right now to grow, to repair damage and to move water up its trunk, so cellular respiration is running at the same time in the same tree, breaking some of that glucose back down.',
        'Now take two in the morning. There is no light, so photosynthesis has stopped. Cellular respiration has NOT stopped, because it never needed light. The tree breaks down glucose it made earlier in the day and releases the energy stored in it.',
        'Check the gases. At night the tree is taking in oxygen and giving off carbon dioxide, because only cellular respiration is running. In bright daylight photosynthesis usually runs faster than cellular respiration, so on balance the tree gives off oxygen, and that hides the cellular respiration going on underneath.',
        'WRONG way to say this: "Plants photosynthesize during the day and respire at night." That sentence makes the two sound like a shift schedule where the plant switches from one to the other. CORRECT way: "A plant carries out cellular respiration all the time, day and night. Photosynthesis is the one that stops in the dark."',
        'Notice why the tree cannot skip either job. Photosynthesis stores energy in food. Cellular respiration is the only way to get that energy back out and spend it. That is why a plant kept in complete darkness eventually dies: it runs out of stored food to break down.',
      ],
      answer:
        'At noon the tree is doing both photosynthesis and cellular respiration at the same time. At two in the morning photosynthesis has stopped for lack of light, but cellular respiration continues, releasing energy from glucose the tree stored earlier and giving off carbon dioxide.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-breathing-versus-respiration',
      kind: 'try_yourself',
      problem: 'Which statement correctly describes the difference between breathing and cellular respiration?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They are two names for the same process.' },
        { id: 'b', text: 'Breathing releases energy from food; cellular respiration delivers oxygen to the lungs.' },
        {
          id: 'c',
          text: 'Breathing moves air into and out of the lungs; cellular respiration is a chemical process inside cells that releases energy from food.',
          correct: true,
        },
        { id: 'd', text: 'Cellular respiration happens in the lungs; breathing happens inside the cells.' },
      ],
      expectedAnswer:
        'Breathing moves air into and out of the lungs; cellular respiration is a chemical process inside cells that releases energy from food.',
      hints: [
        'One of these is a movement you can feel, made by muscles. The other is a chemical change you cannot feel at all. Ask which one happens where.',
        'An earthworm has no lungs and never breathes, yet its cells still release energy from food. So the two cannot be the same thing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-inputs-and-outputs',
      kind: 'try_yourself',
      problem: 'A mouse cell is carrying out cellular respiration. Which statement describes it correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Carbon dioxide and water go in, and glucose and oxygen come out.' },
        { id: 'b', text: 'Glucose and oxygen go in, and carbon dioxide and water come out, with new energy created by the cell.' },
        {
          id: 'c',
          text: 'Glucose and oxygen go in, and carbon dioxide and water come out, with energy released from the glucose.',
          correct: true,
        },
        { id: 'd', text: 'Glucose and carbon dioxide go in, and oxygen and water come out.' },
      ],
      expectedAnswer:
        'Glucose and oxygen go in, and carbon dioxide and water come out, with energy released from the glucose.',
      hints: [
        'Say the word equation to yourself first: glucose + oxygen → carbon dioxide + water + released energy. Then check which choice matches it.',
        'Two choices have the same inputs and outputs and differ only in what they say about the energy. One of those two uses a word that breaks a rule you already know about energy.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plants-respire',
      kind: 'try_yourself',
      problem: 'It is two in the morning and a sunflower is standing in a dark garden. What are its cells doing?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing with energy, because plants only work when there is light.' },
        { id: 'b', text: 'Photosynthesis only, using light energy they saved up during the day.' },
        {
          id: 'c',
          text: 'Cellular respiration, releasing energy from glucose the plant made earlier, just as they were doing during the day.',
          correct: true,
        },
        { id: 'd', text: 'Cellular respiration for the first time that day, because plants photosynthesize in the day and respire at night.' },
      ],
      expectedAnswer:
        'Cellular respiration, releasing energy from glucose the plant made earlier, just as they were doing during the day.',
      hints: [
        'Ask which of the two processes needs light. Then ask what happens to the other one when the light goes away.',
        'The plant still has to grow and repair itself at night, and that costs energy. A plant does not take a shift off from cellular respiration.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-breathing-is-respiration',
      kind: 'misconception_check',
      question:
        'A student writes: "Cellular respiration is how you breathe. When you exercise you do a lot of it, and when you rest you stop." What is wrong with that?',
      commonErrors: [
        {
          answer: 'Cellular respiration is just another word for breathing.',
          misconception:
            'Hearing the word respiration, which sounds like the respiratory system, and assuming the process must be the lung movement itself.',
          correctsTo:
            'WRONG: "Cellular respiration is how you breathe." CORRECT: "Breathing moves air into and out of the lungs. Cellular respiration is a chemical process inside cells that releases energy from food." Notice the first word: CELLULAR. It tells you where this happens, and it is not the lungs. Breathing is the delivery service that brings oxygen to the cells and carries the waste carbon dioxide away. Delivering a package is not the same as opening it. Plants and earthworms have no lungs and never breathe, and their cells carry out cellular respiration all the same.',
        },
        {
          answer: 'Cellular respiration only happens when you exercise.',
          misconception:
            'Connecting the process to the feeling of breathing hard, so it seems to switch on during a sprint and switch off at rest.',
          correctsTo:
            'Every living cell carries out cellular respiration every second it is alive, including while you sleep. Staying alive costs energy: your heart beats, your body stays warm, your cells repair themselves. Exercise does not turn the process on. It makes an already running process run faster, so your cells need more oxygen and produce more carbon dioxide, and that is why you breathe harder. If cellular respiration ever actually stopped in a cell, that cell would die.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The word equation: glucose + oxygen → carbon dioxide + water + released energy. Most of it happens in the mitochondria.',
        'Breathing is NOT cellular respiration. Breathing moves air in and out of the lungs; cellular respiration is a chemical process inside cells that releases energy from food.',
        'The energy is RELEASED from food, never made or created. It was stored in the food first.',
        'Plants carry out cellular respiration too, all the time, day and night. Photosynthesis is the one that stops in the dark.',
        'Photosynthesis and cellular respiration are complements, not opposites: the inputs of one are the outputs of the other. A plant makes its own food and then still has to break it down to use it.',
        'Every living cell does this every second, not only during exercise. Exercise just makes it run faster.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Cellular Respiration' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
