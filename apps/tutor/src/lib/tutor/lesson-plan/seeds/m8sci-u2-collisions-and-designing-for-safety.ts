/**
 * Grade 8 Science (Physical Science) — Collisions & Designing for Safety.
 *
 * PROCEDURE-LED row (NGSS MS-PS2-1). One routine runs the whole lesson:
 * name what is being protected and the change in motion it must go through,
 * ask what the design does to the TIME of the stop, ask what it does to the
 * AREA the push lands on, check that the design still does its other jobs,
 * and only then compare designs. The two quantitative moves the row is
 * allowed are used and no others: force equals mass times acceleration
 * (F = m × a) forward, with small whole numbers, and ratio comparisons
 * between two stops of the same object -- plus one supporting addition
 * (2 + 2 + 2 = 6) used to check a reported stopping time against a
 * reported rate.
 *
 * The three traps it is built to kill are (a) "a cushion absorbs the force
 * so that none of it reaches you", (b) "the bigger object in a collision
 * pushes harder", and (c) "softer always means safer", which is false the
 * moment a soft layer squashes flat at once and the stop is as short as it
 * would have been with nothing there at all.
 *
 * SCOPE GUARD: this plan applies two rules the student already holds -- the
 * third law, and force equals mass times acceleration -- to a collision
 * between two objects, and then judges a PROPOSED safety design by whether
 * it spreads the stopping force over a longer time or a larger area. Its
 * scope cell has no lineage clause; its withheld clause, verbatim, is
 * "Withholds momentum and impulse (`ap-physics-c-mech-energy-momentum.ts`)."
 * What that means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 2.3 (the third law) is APPLIED, not re-taught:
 *     "equal in size, opposite in direction, on different objects, so they
 *     never cancel" is restated as something the student already has -- in
 *     the first key idea, in the vocabulary list, in one worked-example
 *     step and in the misconception check -- and no segment argues for the
 *     law. Where an item turns on a pair (the two skaters), identifying the
 *     pair is only half of the required answer; the other half is the
 *     force-mass-acceleration consequence, which is this row's own work.
 *     Row 2.2 (F = m × a) is likewise assumed: the formula is used forward
 *     with small whole numbers to compare two stops of the SAME object, and
 *     is never rearranged for an unknown mass or acceleration. Row 2.1 (the
 *     first law) explains why an unbelted person keeps moving when the car
 *     slows, and that explanation is deliberately NOT restated here: the
 *     seat belt appears only as a DESIGN judged on rule two, the area its
 *     push arrives over, and no segment re-argues inertia. Rows 4.1 and 4.4
 *     own kinetic energy and energy transfer; the words "energy" and
 *     "kinetic" do not appear in the body at all, and "absorb" appears only
 *     inside the misconception this file exists to kill ("an airbag absorbs
 *     the force"), where it is quoted and then corrected. A cushion here is
 *     judged on force, time and area only.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is
 *     in scope for this row, and none appears. There is no plate, current,
 *     orbit, weather system or water-cycle sentence anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope
 *     for this row, and none appears. Heads, chests and hips are named only
 *     as objects a force acts on; no bone, tissue, organ, injury mechanism
 *     or medical outcome is described, and no injury statistic is stated
 *     anywhere in the file.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog,
 *     so that is the course above). The formulas and quantities this row
 *     stops short of are named: MOMENTUM and IMPULSE -- the words do not
 *     appear, no quantity of the form mass times velocity is formed, and no
 *     force is multiplied by a time; work = force × distance, one-half m v
 *     squared and m g h do not appear, and the word "work" occurs in the
 *     body only as an ordinary verb ("why that works"), never as a physical
 *     quantity; force divided by area is never
 *     written, and the word "pressure" is not used, so the area rule is
 *     stated in words as "less of the push lands on any one part" and
 *     nothing is computed from an area. Acceleration is always GIVEN or
 *     compared in the form "the speed drops at a rate of N meters per
 *     second each second"; the file never writes acceleration as a change
 *     in velocity divided by a time, which is the course above's form.
 *   - HS CHEMISTRY boundary: nothing in this row is chemistry. No
 *     substance, reaction, particle model or material property beyond
 *     "crushes and stays crushed" / "keeps its shape" appears, and each of
 *     those is STATED inside the item that needs it rather than assumed.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every design
 * in this file is written out in words inside the item that asks about it,
 * including what each part is made of, what it does when it is pushed on,
 * and the criterion the design is being judged against -- because a
 * design-evaluation item that leans on an unstated material property is the
 * design-row form of "look at the diagram". Never assume the student has a
 * helmet, a cart, a track or a foam block in front of them.
 *
 * NOTE ON REAL-WORLD SAFETY CLAIMS: this row is unusually easy to write a
 * confident, ungrounded safety claim into. The file therefore states only
 * what a named design IS (a crumple zone is a front built from panels that
 * fold and crush; an airbag inflates so the head and chest push into it; a
 * seat belt is a wide strap across the chest and hips; a helmet is a hard
 * outer shell over a crushable liner) and derives every consequence from
 * the two rules taught in the concept segment. No effectiveness figure, no
 * injury statistic and no comparison of real products appears.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.3 -> 2.4 ->
 * 3.1 (`newtons-third-law-action-reaction-pairs` ->
 * `collisions-and-designing-for-safety` -> `gravity-mass-distance-and-weight`).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U2_COLLISIONS_AND_DESIGNING_FOR_SAFETY: LessonPlan = {
  id: 'evelyn.ms.m8sci.collisions-and-designing-for-safety.v1',
  title: 'Collisions & Designing for Safety',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.collisions-and-designing-for-safety',
      standard: 'M8SCI-2.4',
      description:
        'Apply the third law and the force-mass-acceleration idea to a collision between two objects (a cart hitting a wall, two skaters pushing off, a ball and a bat) and evaluate a proposed safety design -- helmet padding, crumple zone, airbag, egg-drop cushion -- by whether it spreads the stopping force over a longer time or larger area (NGSS MS-PS2-1).',
    },
  ],
  prerequisites: ['m8sci.newtons-third-law-action-reaction-pairs'],
  followUps: ['m8sci.gravity-mass-distance-and-weight'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Surface two stops the student has already made with their own body -- bent knees off a wall, hands pulled back on a catch -- so that "make the stop last longer" arrives as something they already do rather than as a new rule.',
      script:
        'Think about the last time you jumped down off something a bit too high -- a low wall, the third step from the bottom. You did not land stiff-legged with your knees locked. Nobody does that twice. You bent your knees on the way down and let yourself sink a little, and the landing was fine. Now think about catching a ball that is coming in hard. You do not hold your hands out rigid and let it slam into them. You move your hands back with the ball as you catch it. Two completely different situations, and your body does the same thing in both: it makes the stop take longer. Nothing about bending your knees changes how fast you were falling, and nothing about pulling your hands back changes how fast the ball was going. You still have to lose all of that speed. What you are changing is how long you take to lose it. Today you are going to find out why that works, why it is the single idea behind a bike helmet, a car built to crumple, an airbag and a box of foam around a raw egg, and how to look at a safety design somebody has proposed and say whether it will actually do anything.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-collisions-and-design',
      kind: 'concept',
      goal: 'Apply the third law and force equals mass times acceleration to a collision, install the two design rules (longer time, larger area) with their honest limits, and give the ordered routine for judging a proposed design.',
      keyIdeas: [
        'IN A COLLISION, BOTH OBJECTS ARE PUSHED, AND THE TWO PUSHES ARE THE SAME SIZE. You already know the third law: when two objects interact, each pushes on the other with a force equal in size and opposite in direction, and the two forces act on DIFFERENT objects, so they never cancel. A collision is that law happening fast. While a bat and a ball are touching, the bat pushes forward on the ball and the ball pushes backward on the bat, and those two pushes are the same size. Nothing travels out of the bat and into the ball. The bat pushes the ball only while they are touching, and the push ends when they come apart. What is different about the two objects is their mass, and that is where the second law comes in: force equals mass times acceleration (F = m × a), so the same size push produces a much bigger change in motion in the object with less mass. The ball, with far less mass than the bat and the arms swinging it, flies off at high speed. The bat slows a little in the batter\'s hands. Same size force on each, wildly different results, and the reason is mass and nothing else.',
        'STOPPING IS A CHANGE IN MOTION, SO STOPPING TAKES A FORCE. Slowing down is a change in velocity in exactly the way that speeding up is, and any change in velocity needs a force. If you are moving at 6 meters per second and then you are at rest, your speed has dropped by the whole 6 meters per second, and something pushed on you to do it. Here is the part that decides everything else in this lesson: no safety design can remove that drop. If you are moving and then you have stopped, all of the speed is gone, whatever is wrapped around you. A design does not get to choose WHETHER you stop. It only gets to choose HOW the stop is delivered -- how long it takes, and how much of you it lands on.',
        'RULE ONE: THE SAME DROP IN SPEED, SPREAD OVER A LONGER TIME, NEEDS A SMALLER FORCE. Acceleration is how fast the speed is changing, and it is measured in meters per second each second. If a stop takes three times as long, the same drop in speed happens three times more slowly, so the acceleration is one third as big -- and since force equals mass times acceleration and the mass has not changed, the force is one third as big too. That is the whole of bending your knees. It is also what a CRUMPLE ZONE is: the front of a car built from panels designed to fold and crush during a collision, so that the passenger compartment behind them comes to rest over a longer time than a rigid front would allow. It is what an AIRBAG is: a bag that inflates in a collision so that a person\'s head and chest push into it and slow down over a longer time than they would against a hard steering wheel. And it is what an EGG-DROP CUSHION is: a crushable layer that keeps crushing while the egg inside it is still slowing, so that the egg loses its speed over a longer time than it would against the floor.',
        'RULE TWO: THE SAME PUSH, SPREAD OVER A LARGER AREA, LANDS LESS HEAVILY ON ANY ONE PART. This rule is different from rule one and it is easy to run them together. Spreading a push over a larger area does not make the total push any smaller. What it changes is how much of that push arrives at any one part of you. A SEAT BELT is a wide strap that lies across the chest and the hips rather than a thin cord across the stomach, so the backward push that slows you is shared out across a wide band instead of concentrated on one narrow line. A HELMET\'S hard outer shell does the same job for the head: whatever the shell is resting against, the shell presses on the head over the whole area it covers, instead of one small patch of skull taking all of it. Many good designs use both rules at once -- a helmet has a hard shell for the area and a crushable liner for the time -- and when you evaluate a design it is worth asking about each rule separately.',
        'WHAT A SAFETY DESIGN CANNOT DO, SAID PLAINLY. It cannot absorb the force so that none of it reaches you: you still have to lose all of your speed, and something still has to push on you to take it away. It cannot let you keep your speed while everything around you stops. And a soft layer that squashes completely flat the instant it is loaded -- what engineers call BOTTOMING OUT -- buys almost no extra time at all, because once it is flat you are stopping against whatever is behind it, in the same short time as if the layer had never been there. That is why "softer" and "safer" are not the same word. What lengthens a stop is a layer that keeps giving way for the whole time you are still slowing down, which needs both enough thickness and enough firmness to keep pushing back the whole way.',
        'HOW TO EVALUATE A PROPOSED SAFETY DESIGN, IN ORDER. (1) Name the thing being protected and the change in motion it has to go through -- from what speed, to rest, and remember the design cannot change that part. (2) Ask what the design does to the TIME: does anything crush, fold, stretch or give way while the stop is happening, and does it keep giving way for the whole stop rather than flattening at once? (3) Ask what the design does to the AREA: does the push arrive over a wide part of the object, or all at one small spot? (4) Check that the design still does its other jobs: staying on, staying together, holding the protected thing in place. (5) Compare the candidates on those answers -- not on which one feels softer to the hand, and not on which one comes out of the test undamaged, because a part that crushed is a part that was doing rule one.',
      ],
      vocabulary: [
        { term: 'collision', definition: 'an interaction in which two objects come into contact and push on each other, changing the motion of both.' },
        { term: 'action-reaction pair', definition: 'the two forces of an interaction: equal in size, opposite in direction, and acting on two different objects, so they never cancel. This is the third law, from the last lesson.' },
        { term: 'stopping time', definition: 'how long an object takes to go from its starting speed to rest. It is the quantity most safety designs are built to make longer.' },
        { term: 'crumple zone', definition: 'a part of a vehicle, usually the front, built from panels designed to fold and crush during a collision rather than keep their shape.' },
        { term: 'bottoming out', definition: 'what a padded layer does when it squashes completely flat early in a stop, after which the object is stopping against whatever is behind the layer.' },
        { term: 'newton', definition: 'the unit of force. A force of 1 newton acting on a mass of 1 kilogram makes its speed change at a rate of 1 meter per second each second.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cart-into-a-barrier',
      kind: 'worked_example',
      problem:
        'A test cart with a mass of 2 kilograms rolls along a track at 6 meters per second and is brought to rest by a barrier at the end. The test is run twice, at the same 6 meters per second both times. Test one uses the bare barrier, which keeps its shape, and the cart\'s speed drops at a rate of 60 meters per second each second while it is stopping. Test two fits the same barrier with a padded block that crushes and stays crushed; the stop takes three times as long as test one, and the cart\'s speed drops at a rate of 20 meters per second each second. Find the force on the cart in each test, say which force the barrier feels, and say what the padding did and did not change.',
      steps: [
        'Step 1, name what is being stopped and the change in motion. The cart is being stopped, and in both tests it goes from 6 meters per second to rest, so the drop in speed is the same 6 meters per second both times. The padding did not change that and could not have. Hold on to this: it is the reason the comparison is fair.',
        'Step 2, the time. Test one stops the cart at a rate of 60 meters per second each second. That rate means 6 meters per second is lost in each tenth of a second, so the whole 6 meters per second is gone in one tenth of a second. Test two stops it at a rate of 20 meters per second each second, which means 2 meters per second is lost in each tenth of a second, so losing 6 meters per second takes three tenths of a second: 2 + 2 + 2 = 6. Three tenths of a second is three times one tenth of a second, which is exactly the "three times as long" the test reported. The two numbers agree.',
        'Step 3, the force, from force equals mass times acceleration (F = m × a). Test one: 2 kilograms × 60 meters per second each second = 120 newtons. Test two: 2 kilograms × 20 meters per second each second = 40 newtons. Compare them: 120 newtons ÷ 40 newtons = 3, so the padded barrier puts one third of the force on the cart. Notice that the force ratio and the time ratio are the same number, 3, running opposite ways: three times as long, one third the force.',
        'Step 4, the other object. While the cart and the barrier are touching, the barrier pushes backward on the cart and the cart pushes forward on the barrier, equal in size and opposite in direction. So in test one the barrier feels 120 newtons from the cart and in test two it feels 40 newtons. WRONG: "The barrier pushes 120 newtons on the cart and the cart pushes 120 newtons back, so they cancel and the cart should not slow down at all." CORRECT: "One of those forces acts on the cart and the other acts on the barrier. Two forces on two different objects cannot cancel. The only force here acting on the cart is the barrier\'s 120 newtons, and that is what stops it."',
        'Step 5, run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The arithmetic agrees: the same 2 kilograms multiplied by a rate one third as big gives a force one third as big. The timing agrees independently: the reported stopping time was three times longer, and the rate of speed change came out three times smaller, two measurements that did not have to match and did. And the physical evidence agrees: after test two the padded block is crushed and stays crushed, so something really did give way over a distance while the cart was still moving -- the longer stop is visible on the block, not just felt.',
        'Step 6, change one condition and check that the answer moves. Make the padded block twice as thick, so it keeps crushing for six times as long as the bare barrier stop instead of three times. Now the same 6 meters per second is lost at a rate of 10 meters per second each second, and 2 kilograms × 10 meters per second each second = 20 newtons, which is one sixth of 120 newtons. The answer moved, and it moved the right way. Now change a different condition instead: replace the padding with a material that feels just as soft but squashes completely flat in the first instant. It has bottomed out, the cart is stopping against the bare barrier behind it, the stopping time is back to the short one and the force is back to 120 newtons. Softness was never the cause. Crushing for the whole stop was.',
      ],
      answer:
        'Test one: 2 kilograms × 60 meters per second each second = 120 newtons on the cart, and the cart pushes 120 newtons on the barrier. Test two: 2 kilograms × 20 meters per second each second = 40 newtons on the cart, and 40 newtons on the barrier. The padding did not change the cart\'s mass or the 6 meters per second it had to lose; it made the losing take three times as long, and that made the force one third as large.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-evaluate-three-helmets',
      kind: 'worked_example',
      problem:
        'Three helmet designs are proposed for a skateboarder, and every fact you need about them is given here. Design A is a single hard plastic shell, shaped to the head and touching it all over, with nothing inside it; the shell keeps its shape when it is pushed on and does not crush. Design B is a thick liner of crushable foam with no outer shell; the foam crushes slowly and stays crushed, and it touches the head all over. Design C is a hard plastic shell like design A with a thick crushable foam liner like design B inside it. All three stay on the head and stay together. The criterion is the one the designs are being judged against: make the force on the head as small as possible when the head is brought to rest against the ground. Which design best meets it, and why?',
      steps: [
        'Step 1, name what is being protected and the change in motion. The head is being protected, and it goes from whatever speed the skateboarder was falling at to rest against the ground. No helmet changes that speed or that stop. Every design here is competing on how the stop is delivered.',
        'Step 2, ask each design what it does to the TIME. Design A: the shell keeps its shape and does not crush, so nothing gives way while the head is slowing, and the head stops in as short a time as it would with no helmet at all. Design B: the foam crushes slowly and stays crushed, so it keeps giving way for the whole stop and the head loses its speed over a longer time. Design C: the same foam liner is inside it, so it lengthens the stop in the same way design B does. On rule one, B and C pass and A fails.',
        'Step 3, ask each design what it does to the AREA. Design A: the shell touches the head all over, so the push arrives spread across the whole covered area rather than at one small spot. Design B: the foam also touches the head all over, but with no shell there is nothing to hold the outside rigid, so the ground or an object on it presses into the foam at one place and the push arrives at the head over a smaller patch. Design C: the hard shell holds its shape and presses on the liner, and through it on the head, over the whole covered area. On rule two, A and C pass and B is the weakest.',
        'Step 4, check the other jobs and compare. All three stay on and stay together, so nothing separates them there. Line up the two rules: A gives area but not time, B gives time but the least area, and C gives both. Design C best meets the criterion. WRONG: "Design A is best, because a hard shell is the strongest of the three and the strongest material must protect the head best." CORRECT: "Strength is not the criterion. The criterion is a smaller force on the head, and a part that keeps its shape does nothing at all to the stopping time -- what makes the force smaller is a layer that crushes for the whole stop, held under a shell that spreads the push out." A shell that comes through the fall undamaged has told you nothing about the head inside it. As it happens, design C is how skateboard and bicycle helmets are actually built: a hard outer shell over a crushable foam liner.',
        'Step 5, run the two checks. First, three clues of DIFFERENT KINDS agree on design C. The time test says it is the only design with both a crushing layer and something to hold that layer in shape while it crushes. The area test says it is the only design in which a rigid surface spreads the push across the whole head. And the failure test agrees from the other side: each of A and B fails exactly one of the two rules, and C is what you get by fixing the failure in each. Three different questions, one answer.',
        'Step 6, change one condition and check that the answer moves. Take design C and use a liner that has ALREADY been crushed flat in an earlier fall. The liner stays crushed, which was the stated property, so there is nothing left to give way, and design C now behaves like design A: the shell still spreads the push over the whole head, but the stop is as short as with no liner at all. The answer moved, and it moved for a reason we can name. That is also the honest limit of the whole design: a crushable layer does its job by crushing, so a layer that has already done it once has nothing left to do.',
      ],
      answer:
        'Design C. The head has to lose the same speed whatever it is wearing, so the designs compete on time and area. The crushable liner keeps giving way while the head is slowing, which lengthens the stopping time and so lowers the force; the hard shell keeps its shape and presses on the head over the whole area it covers, so less of the push lands on any one part. Design A does the area job and nothing for the time; design B does the time job but delivers the push over a smaller patch. Only C does both.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-two-skaters-push-off',
      kind: 'try_yourself',
      problem:
        'Two skaters stand facing each other at rest on smooth ice, palms together. One has a mass of 60 kilograms and the other has a mass of 30 kilograms. They push against each other once and glide apart in opposite directions. The push starts when their palms meet and ends when their palms come apart, so each skater is pushed for exactly the same length of time. Which statement about the push and about how fast each skater ends up moving is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The 60-kilogram skater pushes with a bigger force than the 30-kilogram skater does, because a skater with twice as much mass has twice as much body behind the push, so the size of the force each one delivers is set by how much mass is behind it, and that is why the lighter skater is sent away faster.' },
        { id: 'b', text: 'The two pushes are equal in size and opposite in direction, so the one cancels the other out and neither skater is left with any force acting on them at all; the two of them drift apart afterwards only because they were leaning on each other, not because either push did anything.' },
        { id: 'c', text: 'Each skater pushes on the other with a force of the same size, in opposite directions, and the two forces act on two different skaters so they cannot cancel; the 30-kilogram skater ends up moving twice as fast, because the same size push changes the motion of half the mass twice as much.', correct: true },
        { id: 'd', text: 'The 30-kilogram skater pushes with a bigger force than the 60-kilogram skater does, because the lighter skater ends up moving faster, and the skater who ends up moving faster must have been the one who pushed harder -- the speeds after the push are how you tell which of the two forces was the bigger one.' },
      ],
      expectedAnswer: 'Each skater pushes on the other with a force of the same size, in opposite directions, and the two forces act on two different skaters so they cannot cancel; the 30-kilogram skater ends up moving twice as fast, because the same size push changes the motion of half the mass twice as much.',
      hints: [
        'Start with the third law. When two objects interact, how do the sizes of the two forces compare, and which object does each of the two forces act on?',
        'Then use force equals mass times acceleration. The same size force is acting for the same length of time on two masses, one of them half the other. Which one has its motion changed more, and by what factor?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sandbag-on-two-surfaces',
      kind: 'try_yourself',
      problem:
        'A sandbag with a mass of 5 kilograms is dropped from the same height twice, so it is moving at the same speed at the moment it lands both times. Landing one is onto bare concrete, and the sandbag\'s speed drops at a rate of 80 meters per second each second while it stops. Landing two is onto a thick foam mat that crushes and stays crushed, and the sandbag\'s speed drops at a rate of 20 meters per second each second. Which statement about the two landings is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mat takes most of the sandbag\'s speed away before the sandbag reaches the bottom of it, so the sandbag is barely moving by the time it actually stops, and that lower landing speed, rather than anything to do with how long the stop took, is the reason the force works out smaller on the mat.' },
        { id: 'b', text: 'The force is 400 newtons in both landings, because the sandbag has the same mass and lands at the same speed either way, and once those two things are fixed the force is fixed along with them -- a mat can only change how the landing looks and sounds, not the force on what is landing.' },
        { id: 'c', text: 'The mat pushes up on the sandbag with 100 newtons, and that upward push cancels part of the 400 newtons the sandbag would otherwise have taken, so the two forces subtract and the force left over on the sandbag in the second landing is 300 newtons.' },
        { id: 'd', text: 'The force is 5 kilograms × 80 meters per second each second = 400 newtons on the concrete and 5 kilograms × 20 meters per second each second = 100 newtons on the mat, so the mat makes the stop four times as long and the force one quarter as large.', correct: true },
      ],
      expectedAnswer: 'The force is 5 kilograms × 80 meters per second each second = 400 newtons on the concrete and 5 kilograms × 20 meters per second each second = 100 newtons on the mat, so the mat makes the stop four times as long and the force one quarter as large.',
      hints: [
        'The sandbag lands at the same speed both times, so the drop in speed is the same and only the rate of the drop is different. Put the mass and each rate into force equals mass times acceleration.',
        'Then compare the two forces you get. If the same drop in speed happens at one quarter of the rate, how much longer must the stop have taken?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-jar-packaging',
      kind: 'try_yourself',
      problem:
        'A company ships glass jars and has two package designs to choose between. Every fact you need is here. Design 1 lines the box with a thin layer of very soft sponge; the sponge squashes completely flat the instant the box lands, and the jar is then resting against the rigid wall of the box. Design 2 lines the box with a layer of firmer foam 5 centimeters thick that crushes gradually and stays crushed while it is being pushed on, and that touches the jar over its whole surface. Both designs hold the jar in place, and both boxes are dropped from the same height onto the same hard floor, so the jar is moving at the same speed at the moment it starts to stop. The criterion is to make the force on the jar as small as possible. Which evaluation is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Design 2, because its foam keeps crushing through the whole 5 centimeters while the jar is still slowing, so the jar loses its speed over a longer time and the force on it is smaller; the thin sponge squashes flat at once, after which the jar stops against the rigid box wall in the same short time as with no lining at all.', correct: true },
        { id: 'b', text: 'Design 1, because the sponge is far softer to the hand than the firmer foam is, and how soft a lining feels when you press it with a finger is the direct measure of how gentle the stop inside it will be, so the softest lining always lets the smallest force through and the thickness of the layer does not enter into it.' },
        { id: 'c', text: 'Neither design changes the force on the jar, because both boxes are dropped from the same height onto the same floor, and the drop height and the hardness of the floor are the only two things that decide the force on whatever is inside, so a lining can only change how much noise the landing makes.' },
        { id: 'd', text: 'Design 2, because the thick foam grips the jar firmly enough that the jar does not have to slow down at all when the box lands, so the jar keeps the speed it started with the whole way through, and an object whose motion never changes has no force acting on it at any point.' },
      ],
      expectedAnswer: 'Design 2, because its foam keeps crushing through the whole 5 centimeters while the jar is still slowing, so the jar loses its speed over a longer time and the force on it is smaller; the thin sponge squashes flat at once, after which the jar stops against the rigid box wall in the same short time as with no lining at all.',
      hints: [
        'Run the routine. The jar has the same speed to lose in both designs, so ask what each lining does to the TIME: which one is still giving way while the jar is still slowing, and which one has already flattened?',
        'Be careful with the word soft. A lining that squashes flat in the first instant has bottomed out, and after that the jar is stopping against whatever is behind it. Thickness and firmness together are what keep a layer giving way for the whole stop.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-padding-absorbs-force',
      kind: 'misconception_check',
      question:
        'A student writes: "An airbag works by absorbing the crash force so that none of it gets to you. And in a crash between a big truck and a small car, the truck hits the car much harder than the car hits the truck, which is why the car comes off worse." Two different things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'An airbag absorbs the force so that none of it reaches you.',
          misconception:
            'Treating force as a substance that a soft object can soak up and hold, because that is what a cushion looks like it is doing from the outside.',
          correctsTo:
            'A force is a push between two objects while they are touching, not a fluid that can be stored somewhere. If you are moving and then you are at rest, all of your speed is gone, and something pushed on you to take it away -- the airbag itself is the thing pushing on you. What the airbag changes is not whether it pushes but how. It inflates so that your head and chest push into it and slow down over a longer time than they would against a hard steering wheel, and force equals mass times acceleration, so a drop in speed spread over a longer time means a smaller acceleration and a smaller force. It also touches you across a wide area rather than at one small spot, so less of that push lands on any one part of you. WRONG: "The bag absorbed the force." CORRECT: "The bag delivered the force, over a longer time and a wider area, which is what made it smaller."',
        },
        {
          answer: 'In a crash between a big truck and a small car, the truck hits the car harder than the car hits the truck.',
          misconception:
            'Reading the outcome backward into the forces: the car is visibly wrecked and the truck is not, so it feels obvious that the truck must have pushed harder, when what actually differs is the mass each equal push acted on.',
          correctsTo:
            'The third law settles the forces and it has no exception for size. While the truck and the car are touching, the truck pushes on the car and the car pushes back on the truck with a force equal in size and opposite in direction. Those two forces act on two different vehicles, so they never cancel. The difference in outcome comes from force equals mass times acceleration: the same size push acting on the car\'s much smaller mass changes the car\'s motion far more than it changes the truck\'s. To see that mass is what makes the difference, change one thing -- give the car the same mass as the truck. The two pushes are still equal, as they always were, but now the two vehicles have their motion changed by the same amount and neither is thrown around by the other. WRONG: "The truck hit harder." CORRECT: "The pushes were equal, and the car has less mass, so the same push changed its motion much more."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'In a collision the two objects push on each other with forces equal in size and opposite in direction, acting on two different objects, so they never cancel.',
        'The same size push changes the motion of the object with less mass much more, because force equals mass times acceleration (F = m × a).',
        'Stopping is a change in motion, so it takes a force. No safety design can remove the drop in speed; it can only change how the stop is delivered.',
        'Rule one, time: the same drop in speed spread over a longer time is a smaller acceleration, so a smaller force. Three times as long means one third the force.',
        'Rule two, area: spreading a push over a larger area does not make the total push smaller, but less of it lands on any one part.',
        'A crumple zone, an airbag and an egg-drop cushion are all rule one. A seat belt and a helmet shell are rule two, and a helmet does both at once.',
        'Softer is not the same as safer. A layer that squashes flat at once has bottomed out, and after that the stop is as short as with no layer at all.',
        'To evaluate a proposed design: name what is protected and the change in motion it must go through, ask what the design does to the time, ask what it does to the area, check its other jobs, then compare.',
        'A part that crushed was doing its job. Coming through undamaged is not evidence that a design protected what was inside it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Collisions & Designing for Safety' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
