/**
 * Grade 7 Science (Life Science) — Body Systems: Respiratory & Nervous.
 *
 * Concept-led (NGSS MS-LS1-3). Two systems in one lesson, joined by the
 * interaction spine the standard actually asks for: the respiratory system
 * puts oxygen into the blood, the circulatory system carries it to cells
 * where it is used to release energy from food, and the nervous system
 * adjusts breathing to match how hard those cells are working.
 *
 * THE MISCONCEPTION THIS LESSON EXISTS TO KILL: "breathing IS respiration".
 * It is not. Breathing is the movement of air. Cellular respiration is the
 * chemical process inside cells that releases energy from food. Unit 4 is
 * built on that distinction, so it is taught here with an explicit
 * WRONG/CORRECT pair and checked again in the misconception segment.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every item
 * here is solvable from the words printed in it. If a lesson needs a diagram
 * or a table, write it out in prose -- never "see the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U3_RESPIRATORY_AND_NERVOUS_SYSTEMS: LessonPlan = {
  id: 'evelyn.ms.m7sci.respiratory-and-nervous-systems.v1',
  title: 'Respiratory & Nervous Systems',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.respiratory-and-nervous-systems',
      standard: 'M7SCI-3.3',
      description:
        'Trace the path of air through the respiratory system to the alveoli where oxygen enters the blood and carbon dioxide leaves it, trace a stimulus through sensory neuron, processing and motor neuron to a response, and explain how the respiratory, circulatory and nervous systems interact to supply cells with oxygen and adjust breathing to match demand (NGSS MS-LS1-3).',
    },
  ],
  prerequisites: ['m7sci.digestive-and-circulatory-systems'],
  followUps: ['m7sci.homeostasis'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor both systems in one felt experience: breathing changes without being chosen.',
      script:
        'Hold your breath for as long as it stays comfortable. Somewhere in there, something starts pushing you to breathe again, and it gets harder and harder to ignore. You did not choose that. Now think about running for a bus. By the time you sit down you are puffing, and you did not choose that either. Something inside you noticed a change and changed your breathing to match it. Today we take apart the system that moves the air and the system that does the noticing. And we fix the one mix-up that causes more trouble in this unit than anything else, which is that breathing and respiration are not the same thing at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-air-and-signals',
      kind: 'concept',
      goal: 'Air path and gas exchange, the stimulus-to-response chain and reflexes, the breathing-versus-respiration split, and how the three systems interact.',
      keyIdeas: [
        'THE PATH AIR TAKES, AND WHAT ACTUALLY MOVES IT — air enters through the NOSE or MOUTH, travels down the TRACHEA, which is the windpipe in your throat, and the trachea splits into two BRONCHI, one going into each LUNG. Inside a lung the tubes branch smaller and smaller like the branches of a tree, and at the ends of the smallest tubes sit the ALVEOLI, which are tiny air sacs. Breathing out sends the air back along the same route in reverse. The lungs themselves have no muscle that pumps. The muscle doing the work is the DIAPHRAGM, a sheet of muscle underneath the lungs: when it contracts it flattens and pulls down, the space inside your chest gets bigger, the air pressure in there drops below the pressure outside, and air moves in on its own. When the diaphragm relaxes, the space gets smaller, the pressure rises, and air moves out. WRONG: "The lungs suck air in and then push it back out." CORRECT: "The diaphragm changes the size of the chest, and air moves in or out because of the pressure difference."',
        'GAS EXCHANGE HAPPENS AT THE ALVEOLI, AND NOWHERE ELSE ALONG THE PATH — every alveolus is wrapped in CAPILLARIES, the smallest blood vessels, and the wall between the air and the blood is extremely thin. OXYGEN moves out of the air in the alveolus and into the blood. CARBON DIOXIDE moves out of the blood and into the air in the alveolus, and you breathe it out. Both gases move in the same place, in opposite directions, at the same time. Notice what is NOT happening: your lungs do not sort the air into separate gases. Air is a mixture and most of it is nitrogen, which goes in and comes back out unchanged, and the air you breathe out still contains plenty of oxygen. What changes is the AMOUNT of each gas, not which gases are present.',
        'THE BIG TRAP, AND THE MOST IMPORTANT SENTENCE IN THIS UNIT — BREATHING and CELLULAR RESPIRATION are two different things. Breathing is the MOVEMENT OF AIR into and out of your lungs; it is a physical movement, and you can watch someone do it from across the room. Cellular respiration is a CHEMICAL PROCESS inside your cells, where oxygen is used to release the energy stored in food. They are connected, because breathing is what supplies the oxygen that cellular respiration uses, but they happen in different places and they are not the same event. WRONG: "Respiration means breathing in and out." CORRECT: "Breathing moves air into and out of the lungs; cellular respiration releases energy from food inside cells." Note the word released. The energy was already in the food. Nothing in your body creates energy.',
        'THE NERVOUS SYSTEM, AND THE CHAIN TO MEMORIZE — the nervous system is the BRAIN, the SPINAL CORD and the NERVES that reach the rest of the body. The pattern behind almost every question on it is a chain: a STIMULUS is any change that gets detected, a SENSORY NEURON carries a signal inward to the spinal cord or brain, the signal is PROCESSED there, a MOTOR NEURON carries a signal back outward to a muscle or a gland, and the RESPONSE is what that muscle or gland then does. Stimulus, sensory neuron, processing, motor neuron, response, in that order. Be careful how you describe it: signals travel and cells respond to the signals that reach them. Calling the brain the boss of the body helps you picture the layout, and then it stops helping, because no cell is giving orders and no cell is choosing to obey.',
        'A REFLEX TAKES THE SHORT ROUTE — put your hand on something sharp and it pulls back before you feel anything. That signal did not travel all the way up to your brain and back. It went sensory neuron, then SPINAL CORD, then motor neuron, then muscle, and the spinal cord did the processing. The route is shorter, so the response is faster, and that speed is the whole point of a reflex. Your brain does receive the message a moment later, which is exactly why the pain shows up AFTER your hand has already moved. The feeling was not what caused the movement.',
        'THE THREE SYSTEMS ARE ONE TEAM — this is the idea the whole unit is built on. The RESPIRATORY system puts oxygen into the blood at the alveoli and takes carbon dioxide out of it. The CIRCULATORY system carries that oxygen to every cell in the body and carries the carbon dioxide back to the lungs. Inside those cells, the oxygen is used to release energy from food. The NERVOUS system watches the result: when cells work harder, more carbon dioxide builds up in the blood, sensors detect that change, and signals travel out to the diaphragm and the rib muscles to make breathing faster and deeper. No one system does this job alone. Each one hands something to the next.',
      ],
      vocabulary: [
        { term: 'trachea', definition: 'the windpipe, the tube carrying air from the throat down toward the lungs.' },
        { term: 'alveoli', definition: 'the tiny air sacs at the ends of the smallest tubes in the lungs, where oxygen enters the blood and carbon dioxide leaves it.' },
        { term: 'diaphragm', definition: 'the sheet of muscle below the lungs whose contraction and relaxation moves air in and out.' },
        { term: 'cellular respiration', definition: 'the chemical process inside cells that uses oxygen to release the energy stored in food.' },
        { term: 'neuron', definition: 'a nerve cell that carries signals; sensory neurons carry signals inward and motor neurons carry signals outward.' },
        { term: 'reflex', definition: 'a fast automatic response processed by the spinal cord rather than the brain.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-oxygen',
      kind: 'worked_example',
      problem:
        'Trace one oxygen molecule from the air just outside the nose of a jogger all the way to a working muscle cell in the leg, naming each structure in order. Then say where the carbon dioxide in the next breath out came from.',
      steps: [
        'Start at the opening. The air enters through the nose, where it is warmed and filtered, and travels down the trachea.',
        'Follow the branching. The trachea splits into two bronchi, one going into each lung, and inside the lung those tubes branch smaller and smaller until they end at the alveoli.',
        'Cross over at the alveolus. The wall between the air in the alveolus and the blood in the capillary around it is extremely thin, so oxygen moves out of the air and into the blood right there. This is the only place along the whole path where that crossing happens.',
        'Hand off to the circulatory system. The blood now carrying oxygen returns to the heart, and the heart pumps it out through arteries, then through smaller and smaller vessels, until it reaches the capillaries running past the leg muscle cells. Oxygen moves out of the blood and into a muscle cell.',
        'Say what the cell does with it. Inside the muscle cell the oxygen is used in cellular respiration to release the energy stored in food. WRONG: "The oxygen gives the cell energy." CORRECT: "The energy was already stored in the food, and the oxygen is what lets the cell release it." Carbon dioxide is produced in that same process.',
        'Send the carbon dioxide back the other way. It moves out of the muscle cell into the blood, the blood carries it back to the heart and then to the lungs, it crosses the thin wall into an alveolus, and it leaves along the same tubes the oxygen came down.',
        'Notice the point of the trace. Neither system could do this alone. Lungs with no circulation would load oxygen into blood that never went anywhere, and circulation with no lungs would have nothing to carry.',
      ],
      answer:
        'Nose, then trachea, then bronchi, then the smaller tubes inside the lung, then an alveolus, then across the thin wall into the blood, then heart, then arteries and smaller vessels, then into a leg muscle cell, where the oxygen is used to release energy stored in food. The carbon dioxide breathed out was produced inside those cells during that same process and traveled back the other way: cell, blood, heart, lungs, alveolus, out.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-why-breathing-speeds-up',
      kind: 'worked_example',
      problem:
        'A student starts jogging. Within a short time the breathing is faster and deeper, and the student never decided to breathe that way. Explain what changed inside the body and which systems produced the change.',
      steps: [
        'Begin with what changed first, at the smallest level. The leg muscle cells are working harder, so they are releasing more energy from food, which means they are using more oxygen and producing more carbon dioxide.',
        'Follow the carbon dioxide. It moves out of those cells into the blood, so the amount of carbon dioxide in the blood rises. That rise is the STIMULUS.',
        'Find the detecting step. Sensors in the brain and in some blood vessels detect the rise in carbon dioxide. This is the sensory side of the chain.',
        'Find the processing step. The part of the brain that sets breathing rhythm processes that information, and signals then travel outward along nerves to the diaphragm and to the muscles between the ribs.',
        'Find the response. Those muscles contract more often and more strongly, so the chest changes size more and more frequently, so more air moves in and out. More oxygen crosses into the blood at the alveoli and more carbon dioxide leaves it.',
        'Watch your language on the last step. WRONG: "The body wanted more oxygen, so it decided to breathe faster." CORRECT: "A change was detected, signals traveled out along nerves, and the muscles responded." Nothing chose anything. This is also why holding your breath gets harder and harder rather than staying easy.',
        'Name the whole pattern. Stimulus, which is rising carbon dioxide, then detection, then processing, then signals out, then a response, which is faster and deeper breathing.',
      ],
      answer:
        'The working muscle cells used more oxygen and produced more carbon dioxide, so the carbon dioxide in the blood rose. Sensors detected that rise, the brain sent signals along nerves to the diaphragm and rib muscles, and those muscles moved more air in and out. The nervous system adjusted the breathing rate, the respiratory system supplied the oxygen, and the circulatory system moved both gases between the lungs and the cells.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-gas-exchange-site',
      kind: 'try_yourself',
      problem: 'Where in the respiratory system does oxygen move into the blood, and what moves the opposite way at that same place?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In the alveoli, where oxygen moves into the blood and carbon dioxide moves out of it.', correct: true },
        { id: 'b', text: 'In the alveoli, where carbon dioxide moves into the blood and oxygen moves out of it.' },
        { id: 'c', text: 'In the trachea, where oxygen moves into the blood and carbon dioxide moves out of it.' },
        { id: 'd', text: 'In the bronchi, where the lungs separate the air into oxygen and carbon dioxide.' },
      ],
      expectedAnswer: 'In the alveoli, where oxygen moves into the blood and carbon dioxide moves out of it.',
      hints: [
        'The crossing happens where the wall between the air and the blood is thinnest, at the very end of the branching tubes.',
        'Check the direction of each gas. Oxygen is what the cells need delivered, and carbon dioxide is what the cells produced and need taken away.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reflex-path',
      kind: 'try_yourself',
      problem: 'You touch something sharp and your hand pulls back before you feel any pain. Which path did the signal take, and why is that path so fast?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sensory neuron to the brain, where you decide to move, then motor neuron to the muscle; it is fast because thinking is fast.' },
        { id: 'b', text: 'The muscle in your arm detected the sharp point by itself and pulled back, with no neuron involved.' },
        { id: 'c', text: 'Sensory neuron to the spinal cord to motor neuron to the muscle; it is fast because the signal skips the longer trip to the brain.', correct: true },
        { id: 'd', text: 'A nerve carried the signal straight from your hand to your arm muscle without passing through the spinal cord or the brain.' },
      ],
      expectedAnswer: 'Sensory neuron to the spinal cord to motor neuron to the muscle; it is fast because the signal skips the longer trip to the brain.',
      hints: [
        'Your hand had already moved before you felt anything, so the movement cannot have waited on a decision.',
        'Something still had to do the processing. Ask which structure did it instead of the brain, and what the shorter route buys you.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-systems-interact',
      kind: 'try_yourself',
      problem: 'Which statement best describes how the respiratory, circulatory and nervous systems work together while a student is running?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The respiratory system carries oxygen directly to the muscle cells, and the circulatory system only carries waste away.' },
        { id: 'b', text: 'The lungs release the energy stored in food, and the blood carries that energy to the muscles.' },
        { id: 'c', text: 'The respiratory system puts oxygen into the blood at the alveoli, the circulatory system carries it to the muscle cells where it is used to release energy from food, and the nervous system makes breathing faster to match the demand.', correct: true },
        { id: 'd', text: 'The circulatory system takes oxygen in from the air, and the respiratory system delivers that oxygen to the cells.' },
      ],
      expectedAnswer: 'The respiratory system puts oxygen into the blood at the alveoli, the circulatory system carries it to the muscle cells where it is used to release energy from food, and the nervous system makes breathing faster to match the demand.',
      hints: [
        'The lungs never touch a leg muscle. Ask which system is the delivery service between them.',
        'Energy is released from food inside cells, not inside lungs, and it is never created.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-breathing-is-respiration',
      kind: 'misconception_check',
      question:
        'A student writes: "Respiration is when you breathe in oxygen and breathe out carbon dioxide." There are two separate problems in that one sentence. What are they?',
      commonErrors: [
        {
          answer: 'Respiration is just another word for breathing.',
          misconception:
            'Hearing respiration and breathing used loosely as if they were the same word, and assuming respiration is simply the formal name for moving air in and out.',
          correctsTo:
            'They are two different things happening in two different places. BREATHING is the movement of air into and out of the lungs, driven by the diaphragm. CELLULAR RESPIRATION is a chemical process inside cells, where oxygen is used to release the energy stored in food. WRONG: "Respiration means breathing in and out." CORRECT: "Breathing moves air; cellular respiration releases energy from food inside cells." The link between them is real, because breathing supplies the oxygen that cellular respiration uses and clears out the carbon dioxide that cellular respiration produces, but a link is not the same as being the same thing. Keep these two separate now and the whole of the next unit gets easier. Also note released, not made: the energy was already stored in the food.',
        },
        {
          answer: 'You breathe in only oxygen and you breathe out only carbon dioxide.',
          misconception:
            'Picturing the lungs as a machine that sorts the air, keeping the oxygen and swapping in carbon dioxide, because only those two gases ever get mentioned.',
          correctsTo:
            'Air is a mixture, and most of it is nitrogen, which goes in and comes back out unchanged because your body does nothing with it. Oxygen is only a part of the air you breathe in, and the air you breathe out still contains plenty of oxygen. What gas exchange changes is the AMOUNT of each gas: exhaled air has less oxygen than inhaled air and more carbon dioxide. That is why rescue breathing works at all, and it is the reason to say the amounts changed rather than saying one gas was traded for another.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Air path: nose or mouth, trachea, bronchi, smaller tubes in the lungs, alveoli, and back out the same way.',
        'Gas exchange happens only at the alveoli: oxygen moves into the blood, carbon dioxide moves out of it, at the same place at the same time.',
        'The lungs do not pump. The diaphragm changes the size of the chest and air moves because of the pressure difference.',
        'BREATHING moves air. CELLULAR RESPIRATION is the chemical process inside cells that releases energy from food. They are connected, not identical, and energy is released rather than made.',
        'The nervous chain, in order: stimulus, sensory neuron, processing, motor neuron, response. A reflex routes through the spinal cord instead of the brain, which is why it is faster and why the pain arrives after the movement.',
        'The three systems together: respiratory puts oxygen into the blood, circulatory carries it to the cells where it releases energy from food, nervous adjusts breathing to match how hard the cells are working.',
        'Describe signals and responses, never orders. Nothing in the body decides, wants or instructs.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Respiratory & Nervous Systems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
