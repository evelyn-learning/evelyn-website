/**
 * Grade 7 Science — Unit 4 CED 4.3: Cellular Respiration.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.cellular-respiration.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U4_CELLULAR_RESPIRATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.cellular-respiration.v1',
  course: 'Grade 7 Science',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Cellular Respiration',
  planId: 'evelyn.ms.m7sci.cellular-respiration.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.cellular-respiration.v1' }],
  theory: [
    { loId: 'm7sci.cellular-respiration', kind: 'framework', title: 'What cellular respiration is', content: `WHAT CELLULAR RESPIRATION IS — it is the chemical process a cell uses to get energy out of food. Here is the whole thing as a word equation: glucose + oxygen → carbon dioxide + water + released energy. The things on the left are the inputs, and the things on the right are the outputs. Glucose is a sugar, and it is the food being broken down. Most of this process happens inside the MITOCHONDRIA, which is why cells that work hard, like muscle cells, hold so many of them.` },
    { loId: 'm7sci.cellular-respiration', kind: 'framework', title: 'Breathing is not cellular respiration', content: `BREATHING IS NOT CELLULAR RESPIRATION — this is the confusion this lesson exists to end. WRONG: "Cellular respiration is another word for breathing." CORRECT: "Breathing moves air into and out of the lungs. Cellular respiration is a chemical process inside cells that releases energy from food." The two are connected, because breathing is the delivery service that brings oxygen to the cells and carries the carbon dioxide away. But delivering a package is not the same as opening it. An earthworm has no lungs and never breathes, and every one of its cells still carries out cellular respiration.` },
    { loId: 'm7sci.cellular-respiration', kind: 'framework', title: 'Energy is released, never created', content: `ENERGY IS RELEASED, NEVER CREATED — the energy was already stored in the food, and before that it came from sunlight captured by a plant. WRONG: "Cellular respiration makes energy for the cell." CORRECT: "Cellular respiration releases the energy that was already stored in food, in a form the cell can spend." No process anywhere creates energy out of nothing. Watch your own sentences for the word made.` },
    { loId: 'm7sci.cellular-respiration', kind: 'framework', title: 'It runs in every living cell, all the time', content: `IT RUNS IN EVERY LIVING CELL, ALL THE TIME — not only during exercise, and not only in animals. Your cells were doing this while you slept, because staying alive costs energy even when you are still. Growing, healing a scraped knee, thinking and keeping warm all cost energy. Hard exercise does not switch the process on; it makes an already running process run faster, which is why you breathe harder and your heart speeds up.` },
    { loId: 'm7sci.cellular-respiration', kind: 'framework', title: 'Plants do cellular respiration too, day and night', content: `PLANTS DO CELLULAR RESPIRATION TOO, DAY AND NIGHT — a plant cell has mitochondria just as your cells do, and it uses them constantly. Photosynthesis and cellular respiration are COMPLEMENTS, not opposites and not two options a living thing chooses between. The inputs of one are the outputs of the other: photosynthesis runs carbon dioxide + water + light energy → glucose + oxygen, and cellular respiration runs glucose + oxygen → carbon dioxide + water + released energy. A plant makes its own food, and then it still has to break that food down to use the energy inside it. Making dinner and eating dinner are two different jobs.` },
    { loId: 'm7sci.cellular-respiration', kind: 'framework', title: 'A note on running without oxygen', content: `A NOTE ON RUNNING WITHOUT OXYGEN — some living things, such as certain bacteria in deep mud, can release energy from food without any oxygen. Your muscle cells can do it too, but only briefly, during something like a hard sprint, and they release far less energy from the same food that way. That is as far as we take this idea this year.` },
    { loId: 'm7sci.cellular-respiration', kind: 'definition', title: 'cellular respiration', content: `the chemical process in which a cell uses oxygen to release the energy stored in glucose.` },
    { loId: 'm7sci.cellular-respiration', kind: 'definition', title: 'glucose', content: 'a sugar that living things use as food and break down for energy.' },
    { loId: 'm7sci.cellular-respiration', kind: 'definition', title: 'mitochondria', content: `the organelles where most of cellular respiration takes place and where energy is released from food.` },
    { loId: 'm7sci.cellular-respiration', kind: 'definition', title: 'breathing', content: `the movement of air into and out of the lungs, which delivers oxygen and removes carbon dioxide.` },
    { loId: 'm7sci.cellular-respiration', kind: 'definition', title: 'anaerobic', content: 'describing a process that releases energy from food without using oxygen.' },
  ],
  methods: [
    {
      title: 'Worked breathing versus respiration',
      steps: [
        `Start where the student started. Air comes in through the nose and mouth and fills the lungs. This is breathing. It is a movement, made by muscles, and nothing chemical has released any energy yet.`,
        `Follow the oxygen out of the lungs. Oxygen passes from the lungs into the blood, and the blood carries it around the body to a muscle cell in your leg.`,
        `Follow the food separately. The glucose in that same muscle cell came from breakfast, not from the air. It traveled through the digestive system and then through the blood.`,
        `Now go inside the cell. In the mitochondria, glucose and oxygen react. The energy stored in the glucose is released into a form the cell can spend, and carbon dioxide and water are left over. THIS is cellular respiration, and it is happening continuously in that cell, not once per breath.`,
        `Finish the round trip. The carbon dioxide leaves the cell, rides the blood back to the lungs, and you breathe it out. So breathing bookends the process: it delivers the oxygen and removes the waste gas.`,
        `WRONG way to say this: "Breathing is cellular respiration." CORRECT way: "Breathing moves air in and out of my lungs so that cellular respiration, which happens inside my cells, has the oxygen it needs and a way to get rid of the carbon dioxide it produces."`,
      ],
      example: { problem: `A student writes: "I did cellular respiration about twenty thousand times today, because that is how many breaths I took." Trace one breath from the air to a muscle cell in your leg and explain what is wrong with that sentence.`, solution: `The two are different things. Breathing is the movement of air in and out of the lungs, about twenty thousand times a day. Cellular respiration is a chemical process running continuously inside the cells, where glucose and oxygen release energy and leave carbon dioxide and water. Breathing supplies and removes the gases; it does not release the energy.` },
      relatedLoIds: ['m7sci.cellular-respiration'],
    },
    {
      title: 'Worked plant at night',
      steps: [
        `List what each process needs. Photosynthesis needs light, carbon dioxide and water. Cellular respiration needs glucose and oxygen, and it does not need light at all.`,
        `Take noon first. There is plenty of light, so photosynthesis is running and the tree is making glucose. But the tree also needs energy right now to grow, to repair damage and to move water up its trunk, so cellular respiration is running at the same time in the same tree, breaking some of that glucose back down.`,
        `Now take two in the morning. There is no light, so photosynthesis has stopped. Cellular respiration has NOT stopped, because it never needed light. The tree breaks down glucose it made earlier in the day and releases the energy stored in it.`,
        `Check the gases. At night the tree is taking in oxygen and giving off carbon dioxide, because only cellular respiration is running. In bright daylight photosynthesis usually runs faster than cellular respiration, so on balance the tree gives off oxygen, and that hides the cellular respiration going on underneath.`,
        `WRONG way to say this: "Plants photosynthesize during the day and respire at night." That sentence makes the two sound like a shift schedule where the plant switches from one to the other. CORRECT way: "A plant carries out cellular respiration all the time, day and night. Photosynthesis is the one that stops in the dark."`,
        `Notice why the tree cannot skip either job. Photosynthesis stores energy in food. Cellular respiration is the only way to get that energy back out and spend it. That is why a plant kept in complete darkness eventually dies: it runs out of stored food to break down.`,
      ],
      example: { problem: `An oak tree stands in a field. Describe what its cells are doing with energy at noon on a sunny day, and what they are doing at two in the morning in the dark.`, solution: `At noon the tree is doing both photosynthesis and cellular respiration at the same time. At two in the morning photosynthesis has stopped for lack of light, but cellular respiration continues, releasing energy from glucose the tree stored earlier and giving off carbon dioxide.` },
      relatedLoIds: ['m7sci.cellular-respiration'],
    },
  ],
  pointers: [
    { content: `Students often say "Cellular respiration is just another word for breathing." — WRONG: "Cellular respiration is how you breathe." CORRECT: "Breathing moves air into and out of the lungs. Cellular respiration is a chemical process inside cells that releases energy from food." Notice the first word: CELLULAR. It tells you where this happens, and it is not the lungs. Breathing is the delivery service that brings oxygen to the cells and carries the waste carbon dioxide away. Delivering a package is not the same as opening it. Plants and earthworms have no lungs and never breathe, and their cells carry out cellular respiration all the same.`, kind: 'common-error' },
    { content: `Students often say "Cellular respiration only happens when you exercise." — Every living cell carries out cellular respiration every second it is alive, including while you sleep. Staying alive costs energy: your heart beats, your body stays warm, your cells repair themselves. Exercise does not turn the process on. It makes an already running process run faster, so your cells need more oxygen and produce more carbon dioxide, and that is why you breathe harder. If cellular respiration ever actually stopped in a cell, that cell would die.`, kind: 'common-error' },
    { content: `The word equation: glucose + oxygen → carbon dioxide + water + released energy. Most of it happens in the mitochondria.`, kind: 'tip' },
    { content: `Breathing is NOT cellular respiration. Breathing moves air in and out of the lungs; cellular respiration is a chemical process inside cells that releases energy from food.`, kind: 'tip' },
    { content: `The energy is RELEASED from food, never made or created. It was stored in the food first.`, kind: 'tip' },
    { content: `Plants carry out cellular respiration too, all the time, day and night. Photosynthesis is the one that stops in the dark.`, kind: 'tip' },
    { content: `Photosynthesis and cellular respiration are complements, not opposites: the inputs of one are the outputs of the other. A plant makes its own food and then still has to break it down to use it.`, kind: 'tip' },
    { content: `Every living cell does this every second, not only during exercise. Exercise just makes it run faster.`, kind: 'tip' },
    { content: `Never write that cellular respiration "makes" or "creates" energy. It **releases** energy that was already stored in glucose. Scan your own sentences for the words *makes*, *creates*, or *produces energy* and swap in *releases*.`, kind: 'vocab-note' },
    { content: `The first word is CELLULAR — it tells you the location. If your sentence puts cellular respiration in the lungs, nose, or chest, it's wrong. It happens inside cells, mostly in the mitochondria.`, kind: 'gotcha' },
    { content: `Don't say "plants photosynthesize during the day and respire at night." That makes it sound like a shift schedule. Cellular respiration runs in plants **all the time**; photosynthesis is the one that stops in the dark.`, kind: 'common-error' },
    { content: `Exercise doesn't switch cellular respiration ON. It speeds up a process that was already running while you slept. If it truly stopped in a cell, that cell would die.`, kind: 'common-error' },
    { content: `Photosynthesis and cellular respiration are complements, not opposites. Saying they "cancel out" is wrong — one **stores** energy in food, the other **releases** it so the cell can spend it. Making dinner and eating dinner are two different jobs.`, kind: 'gotcha' },
    { content: `Organisms with no lungs still do cellular respiration. An earthworm, a mushroom, an oak tree, and a single-celled amoeba never breathe, and every one of their cells releases energy from glucose.`, kind: 'edge-case' },
    { content: `Keep the inputs straight: oxygen arrives from the air, but glucose comes from food, not from breathing. In a diagram, draw them entering the cell by two different routes.`, kind: 'tip' },
    { content: `**Anaerobic** means "without oxygen," not "without energy." Some mud bacteria and your own muscles during a sprint can release energy this way — just far less from the same glucose.`, kind: 'vocab-note' },
  ],
};
