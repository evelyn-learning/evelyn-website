/**
 * Grade 7 Science (Life Science) — Body Systems: Digestive & Circulatory.
 *
 * Row 3.2 of the m7sci course (NGSS MS-LS1-3). MS-LS1-3 is about SUBSYSTEMS
 * INTERACTING, so the spine of this lesson is the handoff: the digestive
 * system breaks food into pieces small enough to pass into the blood, and the
 * circulatory system carries those pieces to every cell. Neither system is
 * useful alone, and that is the point.
 *
 * The four errors this lesson is built to kill: that the stomach does most of
 * the digesting and absorbing (the small intestine does most absorption);
 * that food "becomes" blood; that the two systems are unrelated; and that the
 * heart cleans or makes blood.
 *
 * NOTE FOR FUTURE AUTHORS: there are no images in this course. The digestive
 * path and the parts of the circulatory system are written out in words in
 * every item -- never "see the diagram above". Keep the anatomy qualitative:
 * do not invent lengths, volumes or heartbeat counts.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U3_DIGESTIVE_AND_CIRCULATORY_SYSTEMS: LessonPlan = {
  id: 'evelyn.ms.m7sci.digestive-and-circulatory-systems.v1',
  title: 'Digestive & Circulatory Systems',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.digestive-and-circulatory-systems',
      standard: 'M7SCI-3.2',
      description:
        'Trace food through the digestive path and describe the parts of the circulatory system, and explain how these two subsystems interact so that nutrients absorbed in the small intestine reach every cell in the body (NGSS MS-LS1-3).',
    },
  ],
  prerequisites: ['m7sci.levels-of-organization'],
  followUps: ['m7sci.respiratory-and-nervous-systems'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the lesson as one delivery problem that takes two systems to solve.',
      script:
        'You eat an apple at lunch. A few hours later, a cell in your little toe is using something from that apple. Stop and think about how strange that is. The apple never went anywhere near your toe. It went down your throat and into your middle. So something had to take the apple apart into pieces small enough to travel, and something else had to carry those pieces all the way down your leg. Two different body systems, doing two different jobs, handing off from one to the other. Today we follow the apple.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-breakdown-and-delivery',
      kind: 'concept',
      goal: 'The digestive path, absorption in the small intestine, the parts of the circulatory system, and the handoff between the two.',
      keyIdeas: [
        'TWO SYSTEMS, ONE JOB — a body cell cannot chew. It needs nutrients delivered to it, already tiny and already dissolved. The DIGESTIVE system does the taking apart: it breaks food into pieces small enough to pass into the blood. The CIRCULATORY system does the delivering: it carries those pieces to every cell in the body. Neither system is any use on its own, and that is the whole lesson. Systems inside a body work as a team.',
        'THE PATH FOOD TAKES — MOUTH: teeth chew food into smaller pieces, and saliva begins breaking down starchy foods like bread. ESOPHAGUS: a muscular tube whose walls squeeze in waves to push food down. Nothing is broken down here and nothing is absorbed here; it is transport only. STOMACH: muscular walls churn the food, and acid and juices break it down further, especially the protein in foods like eggs and meat. SMALL INTESTINE: the breakdown is finished, helped by fluids that arrive from the liver and the pancreas. LARGE INTESTINE: water is taken back out of what is left over, and the remains leave the body.',
        'THE SMALL INTESTINE IS WHERE THE FOOD ACTUALLY GETS IN — this is the step students most often put in the wrong place. Most nutrients are ABSORBED in the small intestine, which means they pass through its wall and into the blood. The inside of that wall is folded and covered in tiny finger-shaped bumps called VILLI, and just under them run blood vessels so thin that the small nutrient pieces can cross into the blood. The stomach has none of that: it is a thick churning bag with a protective lining, so almost nothing is absorbed there. WRONG: "The stomach digests the food and puts it into the blood." CORRECT: "The stomach helps break food down, and the small intestine is where most nutrients are absorbed into the blood."',
        'THE THREE PARTS OF THE CIRCULATORY SYSTEM — the HEART is a muscle that pumps. That is its one job. It does not make blood and it does not clean blood; blood cells are made in bone marrow, and wastes are taken out of the blood by the kidneys and the liver. The BLOOD VESSELS are the pipes: ARTERIES carry blood away from the heart, VEINS carry blood back to the heart, and CAPILLARIES are the tiny vessels in between, with walls only one cell thick. Materials only move in and out of the blood at the capillaries. The BLOOD itself is the carrier: red blood cells carry oxygen, white blood cells fight germs, platelets help cuts clot, and PLASMA is the liquid part that the dissolved nutrients ride in.',
        'THE HANDOFF, AND WHY FOOD DOES NOT BECOME BLOOD — capillaries sit right under the villi of the small intestine. The tiny nutrient pieces cross into the blood there, and from that moment they are passengers. The blood was already there; the food joins it. WRONG: "Food turns into blood." CORRECT: "The small pieces of food are carried in the blood, dissolved in the plasma." Then the heart pumps that blood through the vessels, and at capillaries all over the body the nutrients pass out to the cells that need them. That is what MS-LS1-3 means by subsystems interacting: the digestive system prepares the cargo and the circulatory system moves it.',
        'THE DELIVERY COMPARISON, AND WHERE IT BREAKS DOWN — it helps to picture the digestive system as a place that unpacks a shipment and the circulatory system as the trucks and roads that carry the unpacked goods out. Use that to remember the two jobs. Then drop it, because nobody is driving. No organ decides anything and no organ wants anything. Muscles squeeze, the heart pumps, pressure pushes, and small pieces drift from where there are many of them to where there are few. It all runs on physics and chemistry, not on choices.',
      ],
      vocabulary: [
        { term: 'digestion', definition: 'the breaking down of food into pieces small enough for the body to absorb.' },
        { term: 'absorption', definition: 'the passing of small nutrient pieces through the intestine wall and into the blood.' },
        { term: 'small intestine', definition: 'the organ where digestion is finished and where most nutrients are absorbed into the blood.' },
        { term: 'villi', definition: 'the tiny finger-shaped bumps lining the small intestine that give it a huge surface for absorbing.' },
        { term: 'capillary', definition: 'a blood vessel with walls one cell thick, where materials pass between the blood and the body.' },
        { term: 'plasma', definition: 'the liquid part of blood, which carries the dissolved nutrients along with everything else.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-the-apple',
      kind: 'worked_example',
      problem:
        'Follow one bite of an apple from the moment it enters the mouth to the moment a nutrient from it reaches a muscle cell in the arm. Name what happens at each stop, and say exactly where the digestive system hands off to the circulatory system.',
      steps: [
        'Mouth. Teeth cut and grind the bite into smaller pieces, and saliva begins breaking down the starchy part of the apple. Smaller pieces matter because breaking food down works from the outside in, so more small pieces means more surface to work on.',
        'Esophagus. The walls of this tube squeeze in waves and push the swallowed food down toward the stomach. Nothing is broken down here and nothing crosses into the blood here. It is a hallway, not a room.',
        'Stomach. The muscular walls churn the food, and acid and juices break it down further. Ask the key question here: has anything entered the blood yet? No. The stomach has no villi and its lining is built to keep things out, so almost nothing is absorbed. This is the step students get wrong.',
        'Small intestine. The breakdown is finished, with help from fluids sent in by the liver and the pancreas. Now the pieces are small enough to pass through a wall.',
        'The handoff. The wall of the small intestine is folded and covered in villi, and capillaries run just beneath them. The small nutrient pieces cross that wall and enter the blood. This exact spot is where the digestive system stops and the circulatory system takes over.',
        'Circulation. The nutrients ride dissolved in the plasma. Blood returns to the heart, and the heart pumps it out through arteries, which branch smaller and smaller until they become capillaries in the arm muscle.',
        'Delivery. At those arm capillaries, the walls are one cell thick, so nutrients pass out of the blood and into the muscle cells. Meanwhile, back in the digestive system, what was never absorbed moves into the large intestine, where water is taken back out of it and the remains leave the body.',
      ],
      answer:
        'Mouth (chewing and saliva) to esophagus (transport only) to stomach (churning, acid, no real absorption) to small intestine, where the nutrients are absorbed through the villi into capillaries. That is the handoff. The blood then carries the nutrients, dissolved in plasma, through the heart and out to capillaries in the arm, where they pass into the muscle cells. The leftovers go on to the large intestine, which takes back water.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-broken-handoff',
      kind: 'worked_example',
      problem:
        'A person has an illness that flattens the villi in the small intestine, so the inside of that wall becomes smooth. The person still chews normally, the stomach still churns and still makes acid, and the heart and blood vessels are perfectly healthy. Explain why the body cells still end up short of nutrients.',
      steps: [
        'Split the job in two. Breaking food down is one job. Getting the broken-down pieces into the blood is a different job. Check them separately.',
        'Check the breaking down. Chewing works. The stomach works. The fluids from the liver and pancreas still arrive at the small intestine. So the food really is being broken into small pieces. Nothing is wrong with digestion itself.',
        'Check the delivery. The heart still pumps, the vessels are open, and the blood is fine. So the circulatory system can still carry anything it is given.',
        'Now find the broken step. It is the handoff in between. Absorbing works because the small intestine wall has an enormous surface, and the villi are what create that surface. Flatten the villi and the surface shrinks, so far fewer nutrient pieces cross into the blood.',
        'Say what that means for a cell in the leg. The nutrients never got aboard. A delivery truck in perfect condition still delivers nothing if nothing is loaded onto it. The circulatory system is not broken; it simply has less cargo.',
        'Notice the general lesson, which is what MS-LS1-3 is really testing. WRONG: "The digestive system and the circulatory system are separate, so a problem in one does not affect the other." CORRECT: "The systems are linked, so a failure at the point where they connect shows up as a problem in cells far away from the injury."',
      ],
      answer:
        'Digestion still happens and circulation still works, but absorption fails. The villi are what give the small intestine the surface it needs to pass nutrients into the blood, so with them flattened, far fewer nutrients ever enter the blood. The circulatory system can only deliver what the digestive system hands it, so cells all over the body run short.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-absorption-site',
      kind: 'try_yourself',
      problem:
        'A student eats a bowl of oatmeal. Where do most of the nutrients from that oatmeal pass into the blood?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In the stomach, because that is where the food is churned and broken down by acid' },
        { id: 'b', text: 'In the mouth, because chewing and saliva have already started breaking the food down' },
        { id: 'c', text: 'In the large intestine, because that is the last stop before the remains leave the body' },
        { id: 'd', text: 'In the small intestine, because its wall is covered in villi with capillaries just beneath them', correct: true },
      ],
      expectedAnswer: 'In the small intestine, because its wall is covered in villi with capillaries just beneath them',
      hints: [
        'Breaking food down and letting it into the blood are two different jobs. Ask which organ is BUILT for the second one.',
        'Absorbing needs a huge surface with very thin blood vessels right underneath. Only one organ in the path is lined with villi.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-heart-job',
      kind: 'try_yourself',
      problem: 'Which statement best describes what the heart does?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It makes new blood to replace the blood the body uses up.' },
        { id: 'b', text: 'It cleans the wastes out of the blood before sending it back out.' },
        { id: 'c', text: 'It pumps blood through the vessels so that materials reach the cells of the body.', correct: true },
        { id: 'd', text: 'It stores the nutrients from food until the body cells need them.' },
      ],
      expectedAnswer: 'It pumps blood through the vessels so that materials reach the cells of the body.',
      hints: [
        'The heart is a muscle. Think about the one thing a muscle can actually do.',
        'Blood cells are made in bone marrow, and wastes are taken out of the blood by the kidneys and the liver. So neither of those jobs belongs to the heart.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-systems-interact',
      kind: 'try_yourself',
      problem:
        'A student eats a sandwich. Which statement best describes how the digestive system and the circulatory system work together to get nutrients from that sandwich to a muscle cell in the leg?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The digestive system sends the sandwich straight to the muscle cell through a tube of its own.' },
        { id: 'b', text: 'The sandwich turns into new blood in the stomach, and that new blood travels down to the muscle cell.' },
        { id: 'c', text: 'The digestive system breaks the sandwich into pieces small enough to pass into the blood, and the blood carries those pieces to the muscle cell.', correct: true },
        { id: 'd', text: 'The two systems work separately: the digestive system feeds the stomach and the circulatory system feeds the heart.' },
      ],
      expectedAnswer:
        'The digestive system breaks the sandwich into pieces small enough to pass into the blood, and the blood carries those pieces to the muscle cell.',
      hints: [
        'One system takes the food apart. The other one moves the pieces. Look for the choice that gives each system the right job.',
        'Food never turns into blood, and no tube runs from the intestine to your leg. The nutrients travel dissolved in the blood you already have.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-stomach-does-everything',
      kind: 'misconception_check',
      question:
        'A student writes: "The stomach is where the food is digested and absorbed, and once it is absorbed the food becomes blood." Two things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The stomach does most of the digesting and most of the absorbing.',
          misconception:
            'Assuming the loudest, most memorable organ must be doing all the work, because the stomach is the one part of the path a student can actually feel churning and rumbling.',
          correctsTo:
            'The stomach is only one step, and it is a breaking-down step, not an absorbing step. It churns food and breaks it down further with acid and juices, especially protein. But it has no villi and its lining is built to keep things out, so almost nothing crosses into the blood there. The SMALL INTESTINE is where the breakdown is finished and where most nutrients are absorbed, because its wall is folded and covered in villi with capillaries just underneath. Say it as two sentences and the error goes away: the stomach helps break food down, and the small intestine lets the nutrients in.',
        },
        {
          answer: 'Once food is absorbed it becomes blood.',
          misconception:
            'Hearing "the food goes into the blood" and picturing one substance changing into another, rather than one substance being carried by another.',
          correctsTo:
            'Blood is not made out of your lunch. The blood is already there, moving in a loop, and the small nutrient pieces dissolve into the liquid part of it called plasma. They are passengers on a bus, not the bus. The blood carries them to capillaries all over the body, and there the nutrients pass out of the blood and into the cells. Keeping this straight also makes the next idea easier: the same blood is carrying oxygen and hauling wastes away at the same time, all as cargo.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The digestive system breaks food into pieces small enough to enter the blood; the circulatory system delivers those pieces to every cell. Two subsystems, one job.',
        'The path: mouth (chewing and saliva) to esophagus (transport only) to stomach (churning, acid, protein breakdown) to small intestine to large intestine (takes back water).',
        'Most nutrient absorption happens in the SMALL INTESTINE, not the stomach, because its wall is folded and covered in villi with capillaries just beneath.',
        'The circulatory system is the heart (a pump), the blood vessels (arteries away from the heart, veins back to it, capillaries in between), and the blood.',
        'The heart only pumps. It does not make blood and it does not clean it -- blood cells come from bone marrow, and the kidneys and liver remove wastes.',
        'Food does not turn into blood. The nutrients ride dissolved in the plasma, and they leave the blood at capillaries to enter the cells.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Digestive & Circulatory Systems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
