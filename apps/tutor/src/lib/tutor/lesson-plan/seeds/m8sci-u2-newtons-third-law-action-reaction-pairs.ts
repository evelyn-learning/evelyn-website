/**
 * Grade 8 Science (Physical Science) — Newton's Third Law: Action-Reaction
 * Pairs.
 *
 * CONCEPT-LED row (NGSS MS-PS2-1). There is no procedure to fall back on
 * here either: the lesson builds one mental model -- every force is one half
 * of a pair, the two halves are equal in size and opposite in direction, and
 * they act on DIFFERENT objects -- and then makes that model survive the
 * objection every student raises the moment they hear it, which is that if
 * forces always come in equal and opposite pairs then nothing should ever be
 * able to move. Answering that objection is most of the lesson, and the
 * answer is always the same move: forces add up only when they act on the
 * SAME object, and the two halves of a pair never do.
 *
 * The three traps it is built to kill are (a) action-and-reaction-cancel,
 * (b) the-bigger-object-pushes-harder (equal forces do not mean equal
 * effects; the effect depends on mass, which is the first-law lesson's
 * inertia), and (c) confusing a third-law PAIR (two forces, two objects)
 * with BALANCED forces (two forces, one object), which look identical on
 * paper and are the single most common source of a wrong pairing.
 *
 * SCOPE GUARD: this plan identifies the action-reaction pair in an
 * interaction, states that the two forces are equal in size, opposite in
 * direction, and act on different objects, and explains why they therefore
 * never cancel. The curriculum cell marks it, verbatim, as the "first of two
 * lessons sharing MS-PS2-1: this one is the law, 2.4 is the design
 * application". That cell carries no "Builds on" lineage clause and no
 * "Withholds:" clause, so the boundaries below are drawn from the neighbor
 * rows and from the course's stated quantitative ceiling rather than quoted
 * from it:
 *   - COLLISIONS AND SAFETY DESIGN are row 2.4. Almost every interaction in
 *     this file is a sustained push or pull rather than an impact -- a hand
 *     on a wall, feet on the ground, a rocket and its own exhaust gas, a
 *     person pushing a box, a cart or a book, a backpack on a desk, a throw.
 *     The one brief contact anywhere in the file is the hammer striking the
 *     nail in the first item, and it is there only to identify the pair: no
 *     item or step in this file asks about a stopping force, a time of
 *     contact, spreading a force over a longer time or a larger area, or any
 *     design at all. Outside this guard, the only occurrence of the word
 *     collision in the file is the `followUps` chain entry naming row 2.4;
 *     and outside this guard, the words crash, helmet, padding, airbag,
 *     crumple, momentum and impulse occur nowhere in the file at all.
 *   - NEWTON'S SECOND LAW is row 2.2. This file never writes F = m × a, in
 *     symbols or in words, and never computes how fast anything speeds up.
 *     Outside this guard, the word acceleration occurs in the file only
 *     inside the `prerequisites` id for row 2.2. Where it needs the idea that
 *     the same size force changes a small mass more than a large one, it
 *     says exactly that in words and grounds it on inertia from the
 *     first-law lesson, which is the previous-but-one row and is assumed.
 *   - NEWTON'S FIRST LAW is row 2.1 and is assumed, not re-taught: inertia,
 *     net force and balanced forces are used as words the student already
 *     holds, restated in the vocabulary list. What this file adds to
 *     "balanced forces" is only the contrast with a pair.
 *   - ADDING FORCES ON A LINE is row 1.4 and is likewise assumed. All of the
 *     arithmetic anywhere in the file is subtraction along one line: 40
 *     newtons forward minus 10 newtons backward and 40 newtons forward minus
 *     40 newtons backward, both in the second worked example, and 20 newtons
 *     forward minus 6 newtons backward in the misconception check. Nothing
 *     else in the file is computed.
 *   - GRAVITY is row 3.1. Earth's downward pull is named as a force that
 *     acts on an object, and its third-law partner (the object's upward pull
 *     on Earth) is named once. This file never says what gravity depends on,
 *     never states a force in newtons for any object's weight, and never
 *     separates mass from weight; outside this guard the word weight does
 *     not occur in the file.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no orbit, planet, moon, solar
 *     system, tide, plate or weather system appears. The rocket in the first
 *     worked example lifts off from a launch pad and gets one sentence
 *     saying it does not need air to push against, which is there only to
 *     kill the "the exhaust pushes on the air" error; it says nothing about
 *     where the rocket is going, about orbits, or about anything beyond the
 *     air.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. The swimmer, the students and the person
 *     pushing the box are described only as objects that push and are
 *     pushed; no muscle, cell, organism or energy-for-living-things idea
 *     appears anywhere.
 *   - HS CHEMISTRY boundary: nothing in this file is chemistry. The rocket's
 *     fuel is named once, only as the source of the hot gas; no reaction, no
 *     substance and no energy transformation is described.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): every force in this file lies along one
 *     line and is described as a push or a pull in a stated direction, never
 *     as a vector, an arrow with a length, a signed number or a free-body
 *     diagram. The quantities this row stops short of are momentum and
 *     impulse, which belong to `ap-physics-c-mech-energy-momentum.ts`, and
 *     the formula it stops short of is F = m × a, which belongs to row 2.2
 *     in its small-whole-number form and to
 *     `ap-physics-newtons-second-deep.ts` in every form beyond that.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every force
 * in this file is written out in words with the object it acts on and the
 * direction it points, and every item is solvable from the text printed
 * inside it. Never write "see the force diagram", and never assume the
 * student has a cart, a spring scale or a pair of skateboards in front of
 * them. Note also that no specimen is shared between a teaching segment and
 * an item: the wall, the person standing on the floor, the jump, walking,
 * car tires, the rocket, the box, the book and the shopping cart belong to
 * the teaching segments, and the hammer and nail, the backpack on the desk
 * and the thrown ball belong to the three items and appear nowhere else. The swimmer named
 * in the LO description is there because the curriculum cell names her and
 * part (i) is copied verbatim; deliberately, NO item in this file uses a
 * swimmer or any other push-against-water case, because a student who has
 * read the objective would answer such an item from the objective rather
 * than from the law. The same applies to the wall, the cell's other example:
 * it is used only to open the lesson, never as an item.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U2_NEWTONS_THIRD_LAW_ACTION_REACTION_PAIRS: LessonPlan = {
  id: 'evelyn.ms.m8sci.newtons-third-law-action-reaction-pairs.v1',
  title: 'Newton\'s Third Law: Action-Reaction Pairs',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.newtons-third-law-action-reaction-pairs',
      standard: 'M8SCI-2.3',
      description:
        'Identify the action-reaction pair in an interaction (you push the wall, the wall pushes you; a swimmer pushes water back, water pushes the swimmer forward), state that the two forces are equal in size, opposite in direction, and act on DIFFERENT objects, and explain why they therefore never cancel (NGSS MS-PS2-1).',
    },
  ],
  prerequisites: ['m8sci.newtons-second-law-force-mass-and-acceleration'],
  followUps: ['m8sci.collisions-and-designing-for-safety'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice that a wall, which does nothing at all, moved them -- so that the question "where did the push on ME come from" is already open before the law is stated.',
      script:
        'Sit in a chair with wheels, roll up to a wall, put both hands flat on it and push. You roll backward. Nobody is surprised by that. But say out loud what just happened. The wall has no motor. It did not lean on you, it did not shove you, it did not do anything at all -- it is a wall. You are the one who pushed. And yet you are the one who moved. Something pushed you backward, because your motion changed, and by now you know that motion does not change on its own. So what pushed you? Look at what your hands were touching. There is only one candidate, and it is the wall. Here is the claim today rests on: at the exact moment your hands pushed the wall, the wall pushed your hands, just as hard, in the opposite direction. Not afterward. Not because the wall decided anything. At the same instant, as one single event. And once you believe that, you get an objection for free, which almost everyone raises: if every push comes with an equal push the other way, why does anything ever move at all? Answering that is the rest of the lesson.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-third-law',
      kind: 'concept',
      goal: 'Install the pair (equal, opposite, same instant, two objects), separate a third-law pair from balanced forces, and make "equal forces, unequal effects" the answer to why anything moves.',
      keyIdeas: [
        'A FORCE IS NEVER SOMETHING ONE OBJECT DOES ALONE. A force is a push or a pull between two objects, and Newton\'s third law says it always comes with a partner: when object A pushes on object B, object B pushes back on A at the same instant, with a force of the same size, in the opposite direction. The two forces are called an action-reaction pair, and the two names are just labels -- neither force comes first, neither one causes the other, and they start and stop together. Say a pair out loud in two matching sentences and it is hard to get wrong: "my hands push the wall to the north" and "the wall pushes my hands to the south". The two objects are the same two in both sentences, the directions are opposite, and the sizes are equal.',
        'THE TWO FORCES OF A PAIR ACT ON DIFFERENT OBJECTS, AND THAT IS THE WHOLE REASON THEY NEVER CANCEL. One of them acts on A and the other acts on B, always. And two forces add up only when they act on the SAME object -- that is what finding a net force means, and it is why the very first question about any force is "on what?" So the two halves of a pair are never added to each other, because there is no single object for that sum to be about. WRONG: "The push and the push back are equal and opposite, so they cancel and nothing can move." CORRECT: "The push acts on B and the push back acts on A. Each object\'s motion is changed by the force acting on IT, and neither force does anything at all to the object it is not on." If pairs really did cancel, nothing you have ever pushed would have moved, and things move all day.',
        'A PAIR AND A SET OF BALANCED FORCES LOOK THE SAME ON PAPER AND ARE NOT THE SAME THING. Both are two forces, equal in size and opposite in direction. The difference is the count of objects. Stand still on the floor. Earth pulls you downward and the floor pushes you upward, those two are the same size in opposite directions, and both of them act on YOU -- one object, two forces, so they are balanced forces and the net force on you is zero, which is why you stay put. Now find the partner of the floor\'s push on you: it is your push downward on the floor, and that one acts on the FLOOR, not on you. Even Earth\'s pull on you has a partner, which is your pull upward on Earth. So the test is a counting test. Name the object each force acts on. Two forces on one object are balanced forces. Two forces on two objects, each pushing the other, are an action-reaction pair.',
        'EQUAL FORCES DO NOT MEAN EQUAL EFFECTS, AND THAT IS WHY THE WORLD LOOKS ONE-SIDED. Jump straight up. Your feet push downward on Earth and Earth pushes upward on you, and those two forces are the same size. You clearly speed upward, and Earth clearly does not visibly move. Nothing about the forces is unequal -- what is unequal is the mass. You already know from the first-law lesson that inertia grows with mass, so the same size force changes the motion of a small mass a lot and the motion of an enormous one far too little to detect. Earth\'s mass is beyond enormous next to yours. WRONG: "The bigger object pushes harder, and that is why the smaller one goes flying." CORRECT: "The two pushes are the same size. The smaller mass changes its motion more, because there is less inertia to change."',
        'ONCE YOU SEE THE PAIRS, THEY ARE WHAT GETS EVERYTHING MOVING. Walk across a room: your shoe pushes backward on the ground, and the ground pushes forward on your shoe, and that forward push on you is what moves you -- which is why walking on smooth ice, where your shoe cannot get the grip to push backward on the ground, does not work. A car does the same thing through its tires: the tires push backward on the road, the road pushes forward on the tires. In every one of these, the useful force -- the one that changes the motion you care about -- is the partner, the one pointing back at you. That is the pattern worth carrying: to get pushed forward, push something backward.',
        'HOW TO NAME AND USE A PAIR, IN ORDER. First, name the two objects that are touching or otherwise interacting. Second, write one sentence: object A pushes on object B, in this direction. Third, the partner is written by swapping the two objects and reversing the direction, keeping the size the same: object B pushes on object A, in the opposite direction. Fourth -- and this is the step that answers every "why does it move" question -- pick the ONE object whose motion you are asking about, list only the forces acting on THAT object, and add those. The partner force is not on that list, because it acts on the other object. Most wrong answers about the third law come from skipping step four and adding forces that live on two different objects.',
      ],
      vocabulary: [
        { term: 'Newton\'s third law', definition: 'when one object pushes or pulls on a second object, the second object pushes or pulls back on the first at the same instant, with a force of the same size in the opposite direction.' },
        { term: 'action-reaction pair', definition: 'the two forces of one interaction: equal in size, opposite in direction, and acting on two different objects. Also called a force pair.' },
        { term: 'interaction', definition: 'two objects acting on each other, which is what every force really is.' },
        { term: 'balanced forces', definition: 'two or more forces on ONE object that add to a net force of zero, so that object\'s motion does not change.' },
        { term: 'net force', definition: 'the single force left over when all the forces on one object are added together, taking their directions into account.' },
        { term: 'inertia', definition: 'how hard an object\'s motion is to change. Inertia grows with mass, so the same size force changes a small mass more than a large one.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rocket-and-its-gas',
      kind: 'worked_example',
      problem:
        'A rocket stands on a launch pad. Its engines burn fuel and send a huge stream of hot gas straight downward out of the bottom of the rocket, and the rocket lifts off. A student says the rocket rises because the hot gas pushes down against the ground. Name the action-reaction pair, say what pushes the rocket upward, and say whether the student is right.',
      steps: [
        'Name the two objects that are interacting. It is tempting to say the rocket and the ground, but the rocket leaves the ground in the first moment and keeps rising for a long time after that, so the ground cannot be the answer. It is also tempting to say the rocket and the air. The two objects actually pushing on each other are the ROCKET and the HOT GAS it is throwing out.',
        'Write the first half of the pair as one sentence, with the object and the direction stated. The rocket pushes the hot gas downward, hard and continuously, out of the bottom of the engine.',
        'Write the partner by swapping the objects and reversing the direction, keeping the size the same. The hot gas pushes the rocket upward, with a force of exactly the same size, at the same instant. That upward push on the rocket is what lifts it. Nothing else needs to be under the rocket at all.',
        'Now check that the pair does not cancel, which is where the counting test earns its place. The downward force acts on the GAS, and you can see what it does: the gas shoots downward at enormous speed. The upward force acts on the ROCKET, and you can see what that does too: the rocket rises. Two forces, two objects, two different results. There is no one object for them to add up on, so they never cancel.',
        'WRONG: "The rocket rises because the gas pushes down on the ground, or on the air, and shoves the rocket up." CORRECT: "The gas pushes on the ROCKET, because the rocket is what pushed the gas. A rocket needs nothing underneath it to push against, which is why a rocket keeps working high above the ground where there is almost no air left." A common way to say this badly is that the rocket is "riding on" the exhaust. It is not resting on anything. It is being pushed by the gas it threw away.',
        'Run the check a science answer needs, because there is no arithmetic here to redo. First, three clues of DIFFERENT KINDS that agree. The object inventory: after lift-off nothing is touching the rocket except its own gas and the air around it, and the air is pushing backward against its motion, not forward. The directions: the gas leaves downward and the rocket goes upward, exactly opposite, which is what a pair requires and what no other explanation predicts. The timing: the rocket starts rising at the instant the gas starts leaving and stops gaining speed the moment the engines shut off, which is what you would see if the gas were the pusher and would not see if the ground were.',
        'Second, change one condition and check that the answer moves with it. Steer the engines so that the hot gas leaves sideways, to the east, instead of downward. The pair follows the change: the rocket pushes the gas east, so the gas pushes the rocket west, and the rocket is pushed sideways rather than up. The direction of the push on the rocket is always exactly opposite the direction it threw the gas. If the ground were doing the pushing, turning the nozzle could not have changed which way the rocket went.',
      ],
      answer:
        'The pair is: the rocket pushes the hot gas downward, and the hot gas pushes the rocket upward with a force of the same size at the same instant. The upward push on the rocket is what lifts it. The student is not right -- the gas does not need to push against the ground or the air, and the proof is that a rocket still works high above the ground where there is almost no air, and that aiming the gas sideways pushes the rocket the opposite way.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pushing-a-box',
      kind: 'worked_example',
      problem:
        'You push a heavy box forward across a gym floor with a force of 40 newtons. Friction from the floor pushes backward on the box with a force of 10 newtons. The box speeds up. A student objects: "The box pushes back on you with 40 newtons, so 40 newtons forward and 40 newtons backward cancel, and the box cannot speed up at all." Name the pair, and explain why the box speeds up anyway.',
      steps: [
        'Name the pair first, before anything is added. The two objects interacting are you and the box. You push the box forward with 40 newtons; the box pushes you backward with 40 newtons, at the same instant. Equal in size, opposite in direction, one force on the box and one force on you.',
        'Now pick the ONE object whose motion the question is about. It is the box. So list only the forces acting ON THE BOX: your push, 40 newtons forward, and friction from the floor, 10 newtons backward. The box\'s 40-newton push on YOU is not on this list, and leaving it off is not a trick -- it acts on you, so it changes your motion, not the box\'s.',
        'Add the forces on the box along the line of motion. Forty newtons forward and 10 newtons backward leave a net force of 30 newtons forward, because 40 - 10 = 30. A net force of 30 newtons forward on the box means the box\'s motion changes forward: it speeds up. That is the answer to the question asked.',
        'WRONG: "The 40 newtons forward and the 40 newtons backward cancel." CORRECT: "Those two forces are never added together, because they act on different objects. The only forces that get added are the ones on the same object -- here, the 40 newtons forward and the 10 newtons backward, both on the box." The student added one force on the box to one force on a person. That sum is about nothing.',
        'For completeness, run the same routine on the other object, which is you. The forces on you along the line are the box pushing you backward with 40 newtons and friction from the floor pushing your shoes forward. That is why you cannot push a heavy box while standing on slick ice: without the floor\'s forward push on your shoes, the box\'s backward push on you simply slides you away.',
        'Run the check. First, three clues of DIFFERENT KINDS that agree that the box\'s push on you is real and is on you. Your hands feel pressed and flattened while you push, which is that force acting on them. Your body leans forward into the box, which is what a person does to stay put against a backward push. And the ice case just described is a contrast of a third kind: remove the floor\'s grip on your shoes and you, not the box, are the thing that moves.',
        'Second, change exactly one condition and see the answer move. Push the same box, with the same 40 newtons, onto thick carpet where friction pushes backward on the box with 40 newtons instead of 10. Now the forces on the box are 40 newtons forward and 40 newtons backward, and 40 - 40 = 0, so the net force on the box is zero and the box stops speeding up -- it keeps whatever steady speed it had, or stays at rest if it was at rest. Notice what did NOT change: the action-reaction pair is still 40 newtons on the box and 40 newtons on you, exactly as before. The pair never decided anything. What decided it was the list of forces on the box.',
      ],
      answer:
        'The pair is: you push the box forward with 40 newtons, and the box pushes you backward with 40 newtons. Those two never cancel, because one acts on the box and one acts on you. The box speeds up because the forces ON THE BOX are 40 newtons forward and 10 newtons of friction backward, and 40 - 10 = 30 newtons of net force forward. On thick carpet, with 40 newtons of friction, 40 - 40 = 0 and the box would stop speeding up, even though the pair is unchanged.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-hammer-and-nail',
      kind: 'try_yourself',
      problem:
        'A student holds a nail against a block of wood and hits the head of the nail with a hammer. The nail is driven into the wood, and the student feels a sharp jolt in the hand holding the hammer. Which statement correctly names the action-reaction pair for that hit, and says what it means?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The hammer pushes the nail downward, and the nail pushes back on the hammer with a much smaller force, because the hammer is heavy and moving fast while the nail is small and was sitting still, and the force left over is what drives the nail in.' },
        { id: 'b', text: 'The hammer pushes the nail downward, and the nail pushes the hammer upward with a force of the same size at the same instant, and because one of those forces acts on the nail and the other acts on the hammer, neither cancels the other.', correct: true },
        { id: 'c', text: 'The hammer pushes the nail downward and the nail pushes the hammer upward with a force of the same size, so those two forces cancel each other out, and the nail moves only because the wood underneath it gives way and lets it through.' },
        { id: 'd', text: 'The hammer pushes the nail downward, and that is the only force in this interaction, because a nail is not doing anything and an object that is just sitting there being hit cannot push back on the thing that is hitting it.' },
      ],
      expectedAnswer: 'The hammer pushes the nail downward, and the nail pushes the hammer upward with a force of the same size at the same instant, and because one of those forces acts on the nail and the other acts on the hammer, neither cancels the other.',
      hints: [
        'Every force is a push between two objects. Name the two objects in this hit, then say which object each force acts on. The jolt the student feels is a clue about where the second force lands.',
        'Two forces are added together only when they act on the same object. If one of them acts on the nail and the other acts on the hammer, is there any sum to take?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-backpack-on-a-desk',
      kind: 'try_yourself',
      problem:
        'A backpack rests on a desk and does not move. Three of the forces in this situation are: Earth pulls the backpack downward; the desk pushes the backpack upward; the backpack pushes the desk downward. Which statement about these forces is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The desk\'s upward push on the backpack and the backpack\'s downward push on the desk are balanced forces, and being balanced is exactly why the backpack sits still, since two forces of the same size in opposite directions must add up to nothing whichever objects they act on.' },
        { id: 'b', text: 'Earth\'s downward pull on the backpack and the backpack\'s downward push on the desk are the action-reaction pair, because they are the same size and the backpack simply passes Earth\'s pull straight along into the desk beneath it.' },
        { id: 'c', text: 'The desk\'s upward push on the backpack and the backpack\'s downward push on the desk are the action-reaction pair, because those are the two objects pushing on each other; the forces that balance are Earth\'s pull and the desk\'s push, which both act on the backpack.', correct: true },
        { id: 'd', text: 'Earth\'s downward pull on the backpack and the desk\'s upward push on the backpack are the action-reaction pair, because they are equal in size and opposite in direction, and being equal and opposite is what makes two forces a pair, whether or not the two of them act on the same object.' },
      ],
      expectedAnswer: 'The desk\'s upward push on the backpack and the backpack\'s downward push on the desk are the action-reaction pair, because those are the two objects pushing on each other; the forces that balance are Earth\'s pull and the desk\'s push, which both act on the backpack.',
      hints: [
        'Ask what each force acts ON. Write the name of that object next to each of the three forces before you choose.',
        'An action-reaction pair is two objects pushing on each other, so one of its forces acts on each object. Balanced forces are two forces that act on the SAME object and add to zero.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-throwing-a-ball-on-a-skateboard',
      kind: 'try_yourself',
      problem:
        'A student stands still on a skateboard on a smooth, flat floor and throws a heavy ball straight forward. While the throw is happening, the student pushes the ball forward with a force of 50 newtons. The ball flies forward quickly, and the student rolls slowly backward. The student has much more mass than the ball. Which statement about the two forces is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The student pushes the ball forward with 50 newtons and the ball pushes back with much less than that, because a light ball cannot push on a person as hard as a person can push on it, and the extra push that is left over is what sends the ball off so fast, while the small push back barely stirs someone with as much mass as a person.' },
        { id: 'b', text: 'The student pushes the ball forward with 50 newtons and the ball pushes the student backward with 50 newtons, so the two forces cancel and neither of them can move anything, and the only reason the student rolls backward is that a smooth floor lets a skateboard drift once the throw is over.' },
        { id: 'c', text: 'The student pushes the ball forward with 50 newtons and the ball pushes back with 50 newtons only while they are touching, and once the ball leaves the hands that forward push keeps acting inside the ball, which is what keeps the ball flying, and the student rolls backward because that push had to come out of the student first.' },
        { id: 'd', text: 'The student pushes the ball forward with 50 newtons and the ball pushes the student backward with 50 newtons at the same instant; one force acts on the ball and the other on the student, so neither cancels the other, and the ball speeds up far more than the student does because it has much less mass to change, not because it was pushed harder.', correct: true },
      ],
      expectedAnswer: 'The student pushes the ball forward with 50 newtons and the ball pushes the student backward with 50 newtons at the same instant; one force acts on the ball and the other on the student, so neither cancels the other, and the ball speeds up far more than the student does because it has much less mass to change, not because it was pushed harder.',
      hints: [
        'The third law compares the two pushes, not the two motions. Ask what each push acts on, and whether the size of a push depends on which object has more mass.',
        'One of these forces acts on the ball and the other acts on the student, so they are never added to each other. What decides how much each one speeds up is how much mass there is to change.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pairs-cancel-and-bigger-pushes-harder',
      kind: 'misconception_check',
      question:
        'A student writes: "Newton\'s third law cannot be right. If everything I push pushes back on me exactly as hard, then the two forces cancel and nothing could ever be pushed anywhere. And anyway, when I push an empty shopping cart, I obviously push on the cart harder than it pushes on me, because I am the one doing the pushing and the cart is the thing that rolls away." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'The two forces of a pair cancel, so nothing could ever be pushed anywhere.',
          misconception:
            'Adding the two halves of a pair together as if they were two forces on one object, because "equal in size and opposite in direction" is exactly the description of two forces that do cancel -- when, and only when, they act on the same object.',
          correctsTo:
            'Forces are added only when they act on the same object, and the two halves of a pair never do. Push a book across a table: your hand pushes the book forward, and that force acts on the BOOK, so the book speeds up forward. The book pushes your hand backward, and that force acts on your HAND, so your hand is pushed backward and you feel the book press into your fingers. There is no single object for those two to be added on, so there is no sum, and nothing cancels. The way to catch this every time is to write the object beside each force before adding anything: "20 newtons forward, on the book" and "20 newtons backward, on the hand" cannot be added, while "20 newtons forward on the book" and "6 newtons of friction backward on the book" can, and those two leave a net force of 14 newtons forward on the book. And if pairs really did cancel, then no push you have ever given anything would have moved it, because every push you have ever given has had a partner.',
        },
        {
          answer: 'I push on the cart harder than the cart pushes on me, because I am the one doing the pushing and the cart is the thing that rolls away.',
          misconception:
            'Reading the two forces off the two motions -- the cart rolls away and the person does not, so the person must have pushed harder -- which treats the size of a force as something the more active or the larger object gets more of.',
          correctsTo:
            'The two forces are the same size, always, no matter which object is heavier, which one is moving, or which one you think of as doing the pushing. What is different is not the forces but the masses, and inertia grows with mass, so the same size force changes a light object\'s motion a lot and a heavy object\'s motion very little. The empty cart rolls away because it has far less mass than you do and its wheels turn freely; you barely move because you have much more mass and because friction from the floor holds your shoes in place. Change one condition and watch the answer move: push the same cart just as hard while standing on a smooth floor in socks, and now YOU slide backward too, even though the push is exactly the size it was before. WRONG: "The one that moves more was pushed harder." CORRECT: "Both were pushed the same. The one with less mass changed its motion more."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Newton\'s third law: when object A pushes or pulls on object B, object B pushes or pulls back on A at the same instant, with a force of the same size, in the opposite direction.',
        'The two forces of an action-reaction pair act on DIFFERENT objects -- one on each -- and that is the whole reason they never cancel.',
        'Forces are added together only when they act on the same object. Before adding anything, write the object beside each force.',
        'A pair is two forces on two objects, each pushing the other. Balanced forces are two forces on ONE object that add to zero. They look identical until you count the objects.',
        'Equal forces do not mean equal effects. The same size force changes a small mass much more than a large one, because inertia grows with mass.',
        'To answer "why did it move", pick the one object you care about, list only the forces on THAT object, and add those. The partner force belongs to the other object and is not on the list.',
        'To name a pair: name the two objects, write "A pushes B this way", then swap the objects and reverse the direction, keeping the size the same.',
        'To get pushed forward, push something backward: a shoe pushes the ground back and the ground pushes the shoe forward; a rocket pushes gas down and the gas pushes the rocket up.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Newton\'s Third Law: Action-Reaction Pairs' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
