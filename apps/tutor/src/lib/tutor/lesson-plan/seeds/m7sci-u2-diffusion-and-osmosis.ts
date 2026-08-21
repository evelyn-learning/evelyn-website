/**
 * Grade 7 Science (Life Science) — Cells: Moving Materials: Diffusion & Osmosis.
 *
 * Follows the organelles plan (NGSS MS-LS1-2) and picks up the cell membrane
 * exactly where that lesson left it: the gatekeeper at the cell boundary.
 * Diffusion is spreading; osmosis is diffusion of WATER; both are passive.
 * Active transport appears only as the contrast that defines "passive" -- its
 * machinery is deliberately not taught here.
 *
 * The error this plan works hardest against is intent language. Particles do
 * not want anything, do not know anything, and are not trying to even things
 * out. They move randomly, and spreading is what randomness adds up to.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. Every beaker,
 * membrane and setup below is written out in words on purpose.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U2_DIFFUSION_AND_OSMOSIS: LessonPlan = {
  id: 'evelyn.ms.m7sci.diffusion-and-osmosis.v1',
  title: 'Moving Materials: Diffusion & Osmosis',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.diffusion-and-osmosis',
      standard: 'M7SCI-2.4',
      description:
        'Explain how a selectively permeable cell membrane lets materials move in and out by diffusion and osmosis, predict which way water moves when a cell is surrounded by salty water or by pure water, and explain why these movements cost the cell no energy (NGSS MS-LS1-2).',
    },
  ],
  prerequisites: ['m7sci.organelles-and-their-jobs'],
  followUps: ['m7sci.levels-of-organization'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor spreading in something the student has already smelled, seen and eaten.',
      script:
        'Somebody makes popcorn in the kitchen. Two minutes later you can smell it from the far end of the house, and nobody carried it to you. Drop one bead of food coloring into a glass of still water and walk away; when you come back the whole glass is tinted, and nobody stirred it. Leave a raisin in a cup of water overnight and it comes back fat. Put a stick of celery in salty water and it goes floppy. Those four things look unrelated. They are the same thing happening, and it is the thing your cells use all day to get food in and waste out. Today we name it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-diffusion-and-osmosis',
      kind: 'concept',
      goal: 'Selective permeability, diffusion, osmosis and the water-direction rule, why both are passive, and the ban on intent language.',
      keyIdeas: [
        'THE MEMBRANE IS THE GATEKEEPER, AND IT IS PICKY — last lesson the cell membrane was the boundary that controls what gets in and out. The proper name for that pickiness is SELECTIVELY PERMEABLE: some things cross the membrane easily, some cross slowly, and some do not cross at all. Water and small particles like oxygen cross easily. Big particles and many dissolved salts do not. The whole lesson rests on that split, because what CANNOT cross decides what happens to what CAN.',
        'DIFFUSION IS SPREADING OUT — every particle is always moving, jiggling in random directions. If a substance starts out crowded in one spot, that random jiggling carries more particles away from the crowded spot than back into it, simply because there are more of them there to begin with. The result is DIFFUSION: the substance spreads from where it is more crowded to where it is less crowded, until it is evenly spread. That is the popcorn smell reaching your room, and it is how oxygen gets into a cell.',
        'NOTHING IS DECIDING ANYTHING — this is the sentence to get right. WRONG: "The particles want to spread out." WRONG: "The particles know that the other side is emptier." CORRECT: "The particles move randomly, and spreading out is the result." A particle has no goal and no information. Saying it wants to spread is like saying a rolling marble wants to go downhill. Use the comparison if it helps you picture it, then drop it, because nothing in a cell wants, knows or tries.',
        'OSMOSIS IS DIFFUSION OF WATER — when the word applies to WATER moving across a membrane, we call it OSMOSIS. Osmosis is not a different force; it is the same spreading, tracked for water only. The direction rule for a twelve-year-old is exactly this: WATER MOVES FROM WHERE THERE IS MORE WATER TOWARD WHERE THERE IS LESS WATER. Salty water counts as having LESS water, because some of what is in the cup is salt rather than water. So a cell sitting in salty water loses water and shrinks, and the same cell sitting in pure water gains water and swells. That is the limp celery and the fat raisin.',
        'BOTH ARE PASSIVE, WHICH MEANS FREE — diffusion and osmosis are PASSIVE. The cell spends no energy on either one. The movement happens because particles were already moving; the cell does not have to push. WRONG: "The cell uses energy to let oxygen diffuse in." CORRECT: "Oxygen diffuses in on its own, and the cell spends nothing." The contrast is ACTIVE TRANSPORT, where a cell moves something the OTHER way, from less crowded toward more crowded. That never happens on its own, so the cell has to pay energy for it. You do not need to know how the cell does that yet. You only need the test: moving WITH the spreading is free, and moving AGAINST the spreading costs energy.',
        'EVENLY SPREAD DOES NOT MEAN STOPPED — once the food coloring looks the same everywhere, it is tempting to say the particles have finished and parked. They have not. They keep jiggling forever. What changed is the bookkeeping: about as many particles now wander each way across any line you draw, so the amounts balance and the color stays even. Motion never stops; only the lopsidedness does.',
      ],
      vocabulary: [
        { term: 'selectively permeable', definition: 'describes a membrane that lets some substances cross while blocking others.' },
        { term: 'diffusion', definition: 'the spreading of particles from where they are more crowded to where they are less crowded, caused by their random motion.' },
        { term: 'osmosis', definition: 'the diffusion of water across a membrane, from where there is more water toward where there is less water.' },
        { term: 'passive', definition: 'describes movement that costs the cell no energy, because it happens on its own.' },
        { term: 'active transport', definition: 'movement of a substance the opposite way, toward where it is already more crowded, which does cost the cell energy.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-food-coloring',
      kind: 'worked_example',
      problem:
        'A student places one drop of blue food coloring at the bottom of a tall glass of still water. Nobody stirs it and nobody heats it. Describe what happens over the next few hours, explain why it happens, and say whether anything had to spend energy to make it happen.',
      steps: [
        'Start with where things are crowded. At the very start, all of the coloring particles are packed into one small blue blob at the bottom, and the rest of the glass has none.',
        'Remember what the particles are doing. They are jiggling in random directions, all the time. So are the water particles around them.',
        'Now count. A particle at the edge of the blob is just as likely to jiggle outward as inward. But there are many particles inside the blob and almost none outside it, so far more of them wander OUT of the blob than wander back in.',
        'That imbalance is the whole explanation. The blue spreads, the blob fades, and after a few hours the color looks the same everywhere in the glass. This spreading is diffusion.',
        'WRONG way to say it: "The coloring wants to spread out evenly." CORRECT way: "The coloring particles move randomly, and because they started crowded in one place, the random movement spreads them out." Nothing in the glass has a goal.',
        'Now the energy question. Nobody stirred, nobody heated, nothing pushed. The particles were already moving before the drop went in. So the answer is that no energy had to be spent to make this happen -- diffusion is passive.',
        'One last check. Once the glass is evenly blue, the particles have NOT stopped. They keep jiggling, and roughly as many cross any imaginary line each way, so the color simply stays even.',
      ],
      answer:
        'The blue spreads through the whole glass until the color is even. It happens because the coloring particles move randomly and started out crowded in one spot, so more of them wander out of the blob than back into it. No energy had to be spent, because diffusion is passive, and the particles keep moving even after the color looks even.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-raisin-and-celery',
      kind: 'worked_example',
      problem:
        'Two cups sit on a counter. Cup 1 holds plain water, and a dried raisin is dropped into it. Cup 2 holds water with a large spoonful of salt stirred in, and a crisp stick of celery is stood up in it. Both are left overnight. Predict what each one looks like in the morning, and explain both results with the same rule.',
      steps: [
        'Say what the rule is before touching either cup. Water moves across a membrane from where there is MORE water toward where there is LESS water. That movement of water is called osmosis.',
        'Cup 1, the raisin. A raisin is a grape that has been dried, so its cells hold very little water. The plain water in the cup is almost all water. So there is more water outside the raisin than inside it.',
        'Apply the rule to cup 1. Water moves from outside the raisin into its cells. The raisin swells up overnight and looks plump and grape-like in the morning.',
        'Cup 2, the celery. Now compare the same way. Inside the celery cells is mostly water. In the cup, a lot of the space is taken up by dissolved salt, so the cup counts as having LESS water than the celery cells do.',
        'Apply the rule to cup 2. Water moves from inside the celery cells out into the salty cup. The cells lose water, so the celery goes limp and floppy instead of snapping when you bend it.',
        'Notice that the rule never changed. Only which side had more water changed, and that flipped the direction. This is also why a limp piece of lettuce goes crisp again in a bowl of cold plain water -- water moves back in.',
        'WRONG way to say cup 2: "The salt moved into the celery and pushed the water out." Osmosis moves WATER, and the salt is not doing anything on purpose. CORRECT way: "Water moved out of the celery cells toward the side that had less water."',
      ],
      answer:
        'The raisin is plump, because the plain water has more water than the raisin cells do, so water moved into it. The celery is limp, because the salty water has less water than the celery cells do, so water moved out of it. Both results come from the same rule: water moves toward the side with less water.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-water-direction',
      kind: 'try_yourself',
      problem:
        'The same kind of cell is placed in two different beakers. Beaker 1 holds very salty water. Beaker 2 holds pure water with nothing dissolved in it. The inside of the cell is mostly water with a little salt in it. Which way does water move in each beaker?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Water moves out of the cell in beaker 1, but no water moves in beaker 2, because pure water has nothing dissolved in it.' },
        { id: 'b', text: 'Water moves into the cell in beaker 1, and out of the cell in beaker 2.' },
        { id: 'c', text: 'Salt moves into the cell in beaker 1, and salt moves out of the cell in beaker 2.' },
        { id: 'd', text: 'Water moves out of the cell in beaker 1, and into the cell in beaker 2.', correct: true },
      ],
      expectedAnswer: 'Water moves out of the cell in beaker 1, and into the cell in beaker 2.',
      hints: [
        'Take one beaker at a time, and ask a single question: which side has more water, the inside of the cell or the liquid around it?',
        'Very salty water counts as having LESS water, because some of the cup is salt. Pure water counts as having MORE water than the inside of a cell. Then send the water toward the side with less.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-passive-energy',
      kind: 'try_yourself',
      problem:
        'There is more oxygen in the fluid around a cell than there is inside the cell. Oxygen spreads into the cell until it is evenly spread. Which statement about energy is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cell spends energy, because the membrane has to open a gate for every particle that enters.' },
        { id: 'b', text: 'The cell spends energy, because anything crossing the cell membrane has to be pushed through by the cell.' },
        { id: 'c', text: 'The cell spends no energy, because the oxygen particles are already moving randomly and spreading is the result.', correct: true },
        { id: 'd', text: 'The cell spends no energy, because oxygen is a gas, and gases never need energy to move anywhere.' },
      ],
      expectedAnswer: 'The cell spends no energy, because the oxygen particles are already moving randomly and spreading is the result.',
      hints: [
        'Ask the one question that decides the energy cost: is the substance moving WITH the spreading, or the other way against it?',
        'Two of these choices charge the cell for something it never had to do. One of them is free for the right reason, and one is free for a made-up reason about gases.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evenly-spread',
      kind: 'try_yourself',
      problem:
        'Hours after a drop of food coloring was added to a glass of still water, the color looks exactly the same everywhere in the glass. What are the coloring particles doing now?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They have stopped moving, because they are already evenly spread.' },
        { id: 'b', text: 'They have settled into a layer at the bottom, because the spreading is finished.' },
        { id: 'c', text: 'They keep moving, but only back toward the spot where the drop first landed.' },
        { id: 'd', text: 'They keep moving randomly, and about as many go each way, so the color stays even.', correct: true },
      ],
      expectedAnswer: 'They keep moving randomly, and about as many go each way, so the color stays even.',
      hints: [
        'Nothing turned the jiggling off. Ask what actually changed between the first minute and the third hour.',
        'Even color does not require still particles. It only requires that the traffic in each direction match.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-intent-and-osmosis',
      kind: 'misconception_check',
      question:
        'A student writes: "When a cell is put in salty water, the particles know one side is saltier, so they want to even things out. Osmosis is the salt moving across the membrane until both sides match." Two separate things are wrong there. Name both.',
      commonErrors: [
        {
          answer: 'The particles know where to go and want to even things out.',
          misconception:
            'Giving particles goals and information, because the outcome looks so purposeful. The evening-out is real, so it feels like something must be aiming for it.',
          correctsTo:
            'Particles have no goals and no information. Each one jiggles in a random direction. The evening-out happens for a counting reason: where particles are crowded there are simply more of them available to wander away, so more leave than arrive until the two sides match. WRONG: "They want to spread out." CORRECT: "They move randomly, and spreading out is what that adds up to." Watch for this everywhere in biology -- words like wants, tries, knows and decides almost always signal an explanation that has skipped the real cause.',
        },
        {
          answer: 'Osmosis is the salt moving across the membrane.',
          misconception:
            'Treating osmosis as a general word for anything crossing a membrane, rather than the specific word for water.',
          correctsTo:
            'Osmosis is the diffusion of WATER, and only water. The membrane is selectively permeable, and in this setup water crosses it while the salt largely does not. So the salt stays put and the water does the moving instead: it leaves the cell and goes toward the salty side, which is the side with less water. The cell shrinks. Any substance spreading out is diffusion; call it osmosis only when the substance is water.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The cell membrane is selectively permeable -- some things cross it, some do not, and what cannot cross decides what happens to what can.',
        'Diffusion is particles spreading from where they are more crowded to where they are less crowded, until they are evenly spread.',
        'Particles do not want or know anything. They move randomly, and spreading out is the result of that randomness.',
        'Osmosis is diffusion of WATER across a membrane, and water moves toward the side that has less water. Salty water counts as having less water.',
        'A cell in salty water loses water and shrinks; the same cell in pure water gains water and swells.',
        'Diffusion and osmosis are passive and cost the cell nothing. Moving something the other way, toward where it is already crowded, is active transport and does cost energy.',
        'Evenly spread does not mean stopped -- the particles keep moving, and the amounts crossing each way just balance out.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Moving Materials: Diffusion & Osmosis' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
