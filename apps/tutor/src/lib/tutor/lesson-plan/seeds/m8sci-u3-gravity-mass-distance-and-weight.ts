/**
 * Grade 8 Science (Physical Science) — Gravity: Mass, Distance & Weight.
 *
 * CONCEPT-LED row 3.1 (NGSS MS-PS2-4). The student has no procedure to lean
 * on here: the lesson builds one model -- gravity is an attraction between
 * every pair of masses, it grows with the masses and weakens with distance,
 * and it never switches off -- and then uses that model to pull apart two
 * quantities that everyday English runs together. Mass is the amount of
 * matter, in kilograms, and it is the same everywhere. Weight is the
 * gravitational force on that mass, in newtons, and it depends on where the
 * object is. Everything hard about this row lives in that split.
 *
 * The two traps it is built to kill are (a) mass-equals-weight -- the belief
 * that "my mass would be one sixth on the Moon", which swaps the quantity
 * that changes for the one that does not -- and (b) no-gravity-in-space, the
 * belief that astronauts float because Earth has let go of them, when the
 * pull on the space station is almost as strong as it is on the ground and
 * the floating comes from everything falling together.
 *
 * SCOPE GUARD: this plan argues from evidence that gravity is always
 * attractive and grows with the masses involved and weakens with distance,
 * and distinguishes mass (amount of matter, the same everywhere) from weight
 * (the gravitational force on that mass, smaller on the Moon). Its scope
 * cell's lineage and withheld clauses, verbatim: "This supplies the force
 * underneath Grade 6's `m6sci-u1-gravity-and-orbital-motion.ts` (LO
 * description read: gravity keeps objects in orbit, qualitatively) without
 * re-teaching orbits"; "Withholds F = Gm₁m₂/r² and any inverse-square
 * arithmetic (HS-PS2-4; the G6 table's "physics of gravity" reservation is
 * declined at the formula level — see sign-off 5)." What that means at each
 * edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 3.2 (electric forces) and row 3.3 (magnetic
 *     forces) are not entered: no charge, no magnet and no pole appears
 *     anywhere in the lesson body (the word "charge" occurs only inside the
 *     followUps loId for row 3.2). Row 3.4 (fields) owns the account of HOW a force
 *     reaches across empty space, so the word "field" appears nowhere in the
 *     lesson body -- only in this doc comment, saying what was left out;
 *     this file says only that the pull acts between two objects that are not
 *     touching, and stops. Rows 2.1-2.4 are assumed, not re-taught: "force",
 *     "newton" and "mass in kilograms" are used as words the student already
 *     holds, and no force in this file is added to another, so no net force
 *     is computed. Free-fall acceleration is not taught: the second worked
 *     example and the concept segment state that objects falling together
 *     fall at the same rate, as the observation that explains the floating,
 *     and never say WHY that is so -- the argument that a heavy and a light
 *     object land together needs Newton's second law, is not made anywhere in
 *     this file, and is not tested by any item.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: wherever an orbit is mentioned,
 *     it is only ever to say one of two things, in the one-sentence-example
 *     form the curriculum permits -- that Earth's pull reaches the Moon and
 *     keeps it circling Earth rather than drifting off in a straight line
 *     (concept keyIdea 3, restated in the second worked example), and that WHY
 *     the circling happens is an orbit question and not this lesson's question
 *     (concept keyIdea 5, restated in the second worked example). Neither is
 *     ever explained. No real body other than Earth and the Moon appears
 *     anywhere (World B in the third item is an invented world, stipulated by
 *     its scale readings), there is no solar system, no phase, no season, no
 *     tide, and no sideways-motion account of an orbit. The Moon appears only
 *     as the second place a mass can be weighed and as the far end of the
 *     reach of Earth's pull.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): the formula this row
 *     stops short of is F = Gm₁m₂/r², and with it every inverse-square
 *     statement -- this file never says how much weaker the pull gets for a
 *     given extra distance, never squares anything, and says so out loud in
 *     the concept segment. It states no strength of gravity for any real body
 *     other than Earth and the Moon (World B's readings in the third item are
 *     stipulated for an invented world), uses no gravitational-field strength
 *     in newtons per kilogram as a named quantity, and computes no orbital
 *     speed, escape speed or potential energy. The only figures for real
 *     gravity anywhere in it are the contract's settled ones: about 10 newtons
 *     for each kilogram of mass on Earth, and about one sixth of that on the
 *     Moon. The only distances to real places are given as ranges rather than
 *     values -- a space station a few hundred kilometers up, and Earth
 *     thousands of kilometers from its center to its surface -- because the
 *     comparison between those two is the whole point and a precise pair of
 *     numbers would invite the inverse-square arithmetic this row withholds.
 *     No chemistry appears at all.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * situation in this file is written out in words inside the item, every
 * quantity carries its unit in words, and every item is solvable from the
 * text printed inside it. Never write "look at the diagram", and never assume
 * the student has a scale, a mass set or a magnet in front of them. Note also
 * that the Moon's weaker pull is stated as a fact about the actual Moon
 * (which has far less mass than Earth), never as a general rule that a world
 * with less mass always pulls less hard at its surface -- that general rule
 * is false, because the size of the world matters too, and it is exactly the
 * sentence a future author is most likely to add.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.4 -> 3.1 ->
 * 3.2 (`collisions-and-designing-for-safety` -> `gravity-mass-distance-and-weight`
 * -> `electric-forces-and-charge`), and both arrays carry those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U3_GRAVITY_MASS_DISTANCE_AND_WEIGHT: LessonPlan = {
  id: 'evelyn.ms.m8sci.gravity-mass-distance-and-weight.v1',
  title: 'Gravity: Mass, Distance & Weight',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.gravity-mass-distance-and-weight',
      standard: 'M8SCI-3.1',
      description:
        'Argue from evidence that gravity is always attractive and grows with the masses involved and weakens with distance, and distinguish mass (amount of matter, the same everywhere) from weight (the gravitational force on that mass, smaller on the Moon) (NGSS MS-PS2-4).',
    },
  ],
  prerequisites: ['m8sci.collisions-and-designing-for-safety'],
  followUps: ['m8sci.electric-forces-and-charge'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set a loaded backpack that digs into a shoulder against the same kind of bag hanging still in mid-air on a space station, so the student wants to know which quantity changed between the two.',
      script:
        'Sling a full backpack over one shoulder and you know about it the whole way home. The strap digs in, your shoulder aches, and if you set the bag down on a bathroom scale the needle swings a long way around. Now picture a clip you have almost certainly seen: an astronaut on a space station lets go of a bag of tools in mid-air, and it does not drop. It hangs there, turning slowly, until somebody nudges it. Same kind of bag. Same amount of stuff inside it. No strap digging into anybody. Here is the question that runs through today. When people explain that clip, they usually say there is no gravity up there -- and they are wrong, by a lot. And here is the second half of the question. If you carried your backpack to the Moon, astronauts who have been there could tell you it would feel far lighter, light enough to hop around in. Would there be less stuff in it? By the end of this lesson you will be able to say exactly which quantity changes when you move an object somewhere else, which one never changes no matter where you take it, and why the tools in that clip are floating.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-gravity-mass-and-weight',
      kind: 'concept',
      goal: 'Build gravity as an always-attractive pull between masses that grows with mass and weakens with distance, then split mass from weight and install the routine for telling them apart.',
      keyIdeas: [
        'GRAVITY IS A PULL BETWEEN OBJECTS THAT HAVE MASS, AND IT ONLY EVER PULLS. Every object that has mass attracts every other object that has mass. Gravity never pushes, and there is no material you can put between two objects to shield one from the other. It acts between Earth and you, between Earth and the Moon, and -- this is the part that surprises people -- between you and the chair you are sitting on. You do not feel that last one because you and the chair both have tiny masses next to Earth\'s, so the pull between the two of you is far too weak to notice. Too weak to notice is not the same as zero. Gravity also acts between two objects that are nowhere near touching, which is how Earth pulls on something high above the ground; how a pull can reach across a gap like that is the question a later lesson in this unit takes up.',
        'TWO THINGS SET THE STRENGTH OF THE PULL: THE MASSES, AND THE DISTANCE. The more mass the two objects have, the stronger the pull between them. That is the whole reason Earth holds you on the ground: there is nothing special about ground, there is just an enormous amount of mass underneath it. And the farther apart the two objects are, the weaker the pull between them becomes. Both parts are at work at the same time, so a question about gravity is always a question about two masses and one distance. The Moon is the example to hold on to. The Moon has far less mass than Earth does, and that is why anything resting on the Moon is pulled toward the Moon much less strongly than the same object is pulled toward Earth here.',
        'THE PULL WEAKENS WITH DISTANCE, BUT IT NEVER RUNS OUT. There is no line you can cross where gravity stops. Move an object farther from Earth and Earth\'s pull on it gets weaker, and weaker again, and it goes on getting weaker forever without ever reaching exactly zero. Earth\'s pull reaches all the way out to the Moon -- it is the force that keeps the Moon circling Earth instead of drifting off in a straight line -- and it keeps reaching far beyond that. WRONG: "Gravity ends where the air ends." CORRECT: "Gravity gets weaker with distance and never ends; the air ending has nothing to do with it." Exactly how much weaker the pull gets for a given extra distance is a real question with a formula behind it, and that formula belongs to a later course. What this lesson needs is the direction: more distance, less pull.',
        'MASS AND WEIGHT ARE TWO DIFFERENT QUANTITIES WITH TWO DIFFERENT UNITS. Mass is the amount of matter in an object. It is measured in kilograms, and it is the same everywhere -- in this room, on the Moon, on a space station, drifting far from every star. Moving an object somewhere else does not add matter to it or take matter away. Weight is a force: it is the gravitational pull on that mass, it is measured in newtons, and it depends on where the object is and on what large mass is nearby. On Earth, each kilogram of mass weighs about 10 newtons. On the Moon, each kilogram of mass weighs about one sixth of that. WRONG: "I weigh 50 kilograms." CORRECT: "My mass is 50 kilograms, and on Earth that mass weighs about 500 newtons." Everyday English uses the word "weigh" for both quantities, which is exactly why they get tangled; in science they are as different as a length and a temperature.',
        'FLOATING IS NOT THE SAME AS HAVING NO GRAVITY. A space station circles a few hundred kilometers above the ground. That sounds enormous until you compare it with Earth itself, which measures thousands of kilometers from its center out to its surface, so an astronaut up there is only a little farther from Earth\'s center than you are right now, and Earth\'s pull on her is almost as strong as its pull on you. She floats for a completely different reason: she, the station, and every loose object inside it are all falling together at the same rate, so nothing presses on anything. No floor pushes up on her feet and no strap digs into her shoulder, and that is what people are describing when they say she feels weightless. You have felt a two-second version of it on a drop ride, in the moment when the car falls and the bag on your lap lifts away from you. Why the station keeps going around Earth instead of arriving at the ground is an orbit question, and it is not this lesson\'s question.',
        'HOW TO ANSWER ANY MASS-VERSUS-WEIGHT QUESTION. First, decide which quantity the question is actually about: the amount of matter, which is answered in kilograms, or the pull on that matter, which is answered in newtons. Second, if it is mass, the answer does not depend on location at all -- the same number goes in every place the object is taken. Third, if it is weight, ask what large mass is nearby and how far the object is from it, because those are the only two things that can change the answer. Fourth, check the size of your answer against the two figures worth remembering: on Earth each kilogram of mass weighs about 10 newtons, on the Moon about one sixth of that, and far from every large mass an object weighs very nearly nothing while every gram of matter in it is still there.',
      ],
      vocabulary: [
        { term: 'gravity', definition: 'the attraction between any two objects that have mass. It always pulls them toward each other and never pushes.' },
        { term: 'mass', definition: 'the amount of matter in an object, measured in kilograms. It is the same wherever the object is taken.' },
        { term: 'weight', definition: 'the gravitational force on an object, measured in newtons. It depends on what large mass is nearby and how far away it is.' },
        { term: 'newton', definition: 'the unit forces are measured in. On Earth, one kilogram of mass weighs about 10 newtons.' },
        { term: 'kilogram', definition: 'the unit mass is measured in. It counts matter, not pull, so it does not change with location.' },
        { term: 'free fall', definition: 'the state of an object that is falling with nothing holding it up. Objects falling together do not press on one another, which is why an astronaut in free fall feels weightless.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-toolbox-on-the-moon',
      kind: 'worked_example',
      problem:
        'A rover toolbox has a mass of 30 kilograms. It is weighed on Earth, and later the same sealed toolbox is weighed on the surface of the Moon with a scale that reads in newtons. Nothing is added to it or taken out of it at any point. Give its mass and its weight in both places, and say which of the two quantities changed and why.',
      steps: [
        'Sort the question into its two quantities before doing anything else. Mass is the amount of matter in the toolbox and is answered in kilograms. Weight is the gravitational pull on that matter and is answered in newtons. The question asks for both, in two places, so there are four numbers to produce.',
        'Mass on Earth. The problem gives it: 30 kilograms. Nothing to work out.',
        'Weight on Earth. Each kilogram of mass weighs about 10 newtons on Earth, and the toolbox has 30 kilograms of mass, so its weight is 30 lots of 10 newtons, which comes to about 300 newtons.',
        'Mass on the Moon. Nobody opened the toolbox, so no matter left it and no matter joined it. Its mass is still 30 kilograms. A trip changes where an object is; it does not change how much matter the object is made of. WRONG: "Its mass on the Moon is one sixth of 30 kilograms, which is 5 kilograms." CORRECT: "Its mass on the Moon is 30 kilograms, exactly as it was on Earth."',
        'Weight on the Moon. The Moon has far less mass than Earth has, so it pulls much less strongly on anything resting on it: each kilogram of mass weighs about one sixth as much there as it does here. One sixth of 300 newtons is 50 newtons, so the toolbox weighs about 50 newtons on the Moon. That is the number that fell, and it fell because what was pulling on the toolbox changed, not because the toolbox changed.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The units agree: the question about matter is answered in kilograms and only the newtons answer moved. The object agrees: the box was sealed the whole time, so there is no way for matter to have left it. And the surroundings agree: the one thing that genuinely changed between the two weighings is which large mass the toolbox was resting on, and that is precisely the thing weight depends on. Three different kinds of evidence, one answer.',
        'Second, change one condition and check that the answer moves the way it should. Carry the same sealed toolbox far away from Earth and the Moon and every other large mass, out where the nearest one is billions of kilometers off. Its mass is still 30 kilograms -- the same matter, in the same box -- and now a scale under it would read very nearly zero newtons. The mass reading has not moved once across three locations. The newtons reading has moved every single time. That is the test: weight is the quantity that answers to where you are, and mass is the quantity that does not.',
      ],
      answer:
        'Mass: 30 kilograms on Earth and 30 kilograms on the Moon -- unchanged, because no matter was added or removed. Weight: about 300 newtons on Earth (30 kilograms at about 10 newtons for each kilogram) and about 50 newtons on the Moon (one sixth of 300 newtons). Only the weight changed, because weight is the gravitational pull on the toolbox and the Moon, with far less mass than Earth, pulls much less strongly on anything at its surface.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-no-gravity-in-space-claim',
      kind: 'worked_example',
      problem:
        'A student writes: "There is no gravity in space. That is why astronauts on the space station float, and why a bag of tools let go in mid-air just hangs there instead of dropping." Using what you know about how gravity depends on mass and distance, say what is right in that claim and what is wrong with it, and give the correct reason for the floating.',
      steps: [
        'Take the claim apart. There are two pieces welded together: a claim about the world (there is no gravity in space) and an explanation built on it (that is why things float). They have to be checked separately, because the second one can fail even where the first one sounds convincing.',
        'Check the first piece against the distance rule. Gravity gets weaker with distance and never switches off, so the only question is how much weaker it is up there. A space station circles a few hundred kilometers above the ground, while Earth measures thousands of kilometers from its center out to its surface. Moving up a few hundred kilometers is therefore a small change in the distance from Earth\'s center, and Earth\'s pull on an astronaut on the station is almost as strong as its pull on you sitting still right now. The first piece is not slightly overstated. It is false.',
        'There is a second reason to be sure of that. Earth\'s pull reaches all the way out to the Moon, which is very much farther away than any space station, and it is what keeps the Moon circling Earth. A pull that reaches that far has obviously not run out a few hundred kilometers up.',
        'Now give the real reason for the floating. The station, the astronaut and every loose object inside are all falling, and all falling at the same rate together. Nothing is pressing on anything: no floor pushes up on her feet, no shelf pushes up on the toolbag. The feeling people call weightlessness is the feeling of nothing pressing on you. WRONG: "The tools hang in mid-air because there is no gravity acting on them." CORRECT: "The tools are falling, and so is everything around them, so they do not move away from the astronaut and nothing has to hold them up." Why the station keeps going around Earth instead of arriving at the ground is an orbit question, and it is not this lesson\'s question.',
        'Say what was right, because part of it was. Things really do float on a space station, and gravity really does get weaker as you go farther out -- the student had the direction of that rule correct. What went wrong is the size (a few hundred kilometers barely weakens Earth\'s pull) and the reason (the floating comes from falling together, not from an absence of gravity).',
        'Run the two checks. First, three clues of DIFFERENT KINDS agree. The distance comparison says a few hundred kilometers is small next to the thousands of kilometers from Earth\'s center to its surface. The reach of Earth\'s pull says the same thing from another direction, since that pull extends past the station all the way to the Moon. And an everyday case says it a third way: on a drop ride, the bag on your lap lifts away from you for a second or two, and nobody thinks Earth\'s gravity switched off at the top of the tower -- gravity is exactly what is making the car fall.',
        'Second, change one condition and watch the answer move. Suppose the station could be held still, at the same height, on top of an impossibly tall tower, so that it was no longer falling. The distance from Earth\'s center would be unchanged, so the pull would be unchanged -- but the astronaut would now stand on the floor with almost her full weight, and the released toolbag would drop to her feet. The floating vanished when the falling stopped, and the distance never moved. That is how you know the floating was about the falling.',
      ],
      answer:
        'The claim is wrong where it matters most. Gravity weakens with distance but never switches off, and a space station is only a few hundred kilometers up against the thousands of kilometers from Earth\'s center to its surface, so Earth\'s pull on an astronaut there is almost as strong as it is on the ground -- and the same pull reaches far past her to the Moon. The astronaut and the tools float because they and the station are all falling together at the same rate, so nothing presses on anything. Hold the station still at that height and she would stand on the floor with almost her full weight.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-camera-to-the-moon',
      kind: 'try_yourself',
      problem:
        'A survey camera has a mass of 6 kilograms, and on Earth it weighs about 60 newtons. The camera is packed, flown to the Moon, and set down on the surface there. Nothing is added to it or removed from it on the way. What are its mass and its weight on the Moon?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Its mass is still 6 kilograms and its weight is about 10 newtons, because the amount of matter did not change while the Moon pulls on each kilogram about one sixth as hard as Earth does.', correct: true },
        { id: 'b', text: 'Its mass falls to 1 kilogram and its weight falls to about 10 newtons, because everything about the camera is one sixth of what it was once the camera is somewhere with a weaker pull.' },
        { id: 'c', text: 'Its mass is still 6 kilograms and its weight is still about 60 newtons, because weight belongs to the camera itself and travels along with it to whatever place the camera is taken.' },
        { id: 'd', text: 'Its mass is still 6 kilograms and its weight is zero newtons, because the Moon has no air, and with no air pressing down from above there is nothing left to give the camera any weight at all.' },
      ],
      expectedAnswer: 'Its mass is still 6 kilograms and its weight is about 10 newtons, because the amount of matter did not change while the Moon pulls on each kilogram about one sixth as hard as Earth does.',
      hints: [
        'Answer the two questions separately. Mass counts the matter in the camera, in kilograms -- did any matter leave the case on the journey? Weight is the pull on that matter, in newtons, and the Moon is doing the pulling now.',
        'On the Moon each kilogram of mass weighs about one sixth of what it weighs on Earth. Take one sixth of the Earth weight you were given, and keep the kilograms where they were.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-probe-traveling-outward',
      kind: 'try_yourself',
      problem:
        'A space probe is launched from Earth and keeps traveling outward, getting farther and farther from Earth with its engines switched off. What happens to the strength of Earth\'s gravitational pull on the probe as it goes?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It stays exactly the same the whole way out, because Earth\'s mass is the only thing that sets the size of the pull and Earth\'s mass does not change while the probe travels.' },
        { id: 'b', text: 'It gets steadily weaker the farther out the probe goes, because the distance is growing while neither mass changes, but it never becomes exactly zero however far the probe travels.', correct: true },
        { id: 'c', text: 'It drops to zero the moment the probe rises above the air, because gravity is the weight of the air pressing objects down, and there is no air above the atmosphere to do the pressing.' },
        { id: 'd', text: 'It gets stronger as the probe goes farther out, because there is no air out there to resist the pull, so Earth\'s gravity can act on the probe with nothing left to hold it back.' },
      ],
      expectedAnswer: 'It gets steadily weaker the farther out the probe goes, because the distance is growing while neither mass changes, but it never becomes exactly zero however far the probe travels.',
      hints: [
        'Two things set the strength of a gravitational pull: the masses involved and the distance between them. Neither mass is changing here, so ask what the changing distance does to the pull.',
        'Check whether the pull can ever reach zero. Earth\'s pull reaches out as far as the Moon and keeps going past it, so there is no boundary out there where gravity is switched off.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-three-scale-readings',
      kind: 'try_yourself',
      problem:
        'A sealed test block with a mass of 12 kilograms is weighed in three places with the same kind of scale, which reads in newtons. On the surface of Earth it reads about 120 newtons. On the surface of World B it reads about 30 newtons. On a station drifting very far from Earth, from World B and from every other large mass, it reads very nearly zero newtons. The block is never opened. Which conclusion do these three readings support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The block lost matter each time it was moved, because a scale measures how much matter an object contains and the reading came out smaller at each new place the block was taken to.' },
        { id: 'b', text: 'Gravity switches off past the edge of a planet\'s atmosphere, which is what the near-zero reading out at the station shows, and the two surface readings differ only because one world has thicker air pressing down than the other.' },
        { id: 'c', text: 'The block held the same 12 kilograms of matter in all three places, and only the pull on it changed from one place to the next, so weight depends on where an object is while mass does not.', correct: true },
        { id: 'd', text: 'Distance from a surface is the only thing that ever changes a pull, so the three readings must mean the block was held at three different heights, and how much mass a world has makes no difference at all.' },
      ],
      expectedAnswer: 'The block held the same 12 kilograms of matter in all three places, and only the pull on it changed from one place to the next, so weight depends on where an object is while mass does not.',
      hints: [
        'The block was sealed and never opened, so start by asking what could physically have left it. Then ask what a scale reading in newtons is actually measuring -- matter, or a pull?',
        'Look at the third reading. It is taken far from every large mass, and it is nearly zero. Which quantity could that reading possibly have changed, and which quantity is still sitting inside the sealed block?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mass-versus-weight',
      kind: 'misconception_check',
      question:
        'A student writes: "On the Moon my mass would be one sixth of what it is on Earth, and my weight would stay the same, because my weight is just how much stuff I am made of." Two separate things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'On the Moon my mass would be one sixth of what it is on Earth.',
          misconception:
            'Attaching the one-sixth rule to the wrong quantity, because the number people quote for themselves in everyday life is in kilograms, so the quantity in kilograms is the one that seems as though it ought to change on the Moon.',
          correctsTo:
            'It is the WEIGHT that falls to about one sixth on the Moon, and the mass that stays put. Mass is the amount of matter in you, and a rocket journey does not remove five sixths of your atoms. Take a student with a mass of 60 kilograms. On Earth that mass is 60 kilograms and, at about 10 newtons for each kilogram, it weighs about 600 newtons. On the Moon that mass is still 60 kilograms, and it weighs about one sixth of 600 newtons, which is about 100 newtons. WRONG: "My mass would be one sixth." CORRECT: "My mass would be exactly what it is now; my weight would be about one sixth of what it is now." The quick check is the unit: kilograms count matter and travel with you unchanged, newtons measure a pull and depend on what is pulling.',
        },
        {
          answer: 'My weight is just how much stuff I am made of.',
          misconception:
            'Treating weight as a property stored inside an object, like its color or its volume, rather than as a force between that object and something else.',
          correctsTo:
            'Weight is a force, and a force is always an interaction between two objects. Your weight on Earth is the gravitational pull between you and Earth, so it depends on Earth being there and on how far from its center you are -- take Earth out of the situation and the number changes. The quantity that really does describe how much stuff you are made of is your mass, in kilograms. Carry the same body far from every large mass and its weight is very nearly nothing, while every atom of it is still there and its mass has not moved by a gram. WRONG: "Weight is the amount of stuff in me." CORRECT: "Mass is the amount of stuff in me. Weight is how hard something else is pulling on that mass right now."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Gravity is an attraction between any two objects that have mass. It only ever pulls, it acts between objects that are not touching, and it cannot be blocked or shielded.',
        'Two things set the strength of the pull: the masses involved (more mass, more pull) and the distance between them (more distance, less pull).',
        'The pull weakens with distance but never runs out. Earth\'s pull reaches the Moon and keeps going, so there is no boundary in space where gravity switches off.',
        'Mass is the amount of matter in an object, measured in kilograms, and it is the same everywhere you take the object.',
        'Weight is the gravitational force on that mass, measured in newtons, and it changes with what large mass is nearby and how far away it is.',
        'On Earth each kilogram of mass weighs about 10 newtons. On the Moon each kilogram weighs about one sixth of that, because the Moon has far less mass than Earth.',
        'Astronauts float because they, the station and everything loose inside are all falling together at the same rate, so nothing presses on anything -- not because gravity is missing up there.',
        'To answer any question of this kind: decide whether it is asking about matter (kilograms, never changes with location) or about a pull (newtons, changes with what is nearby and how far).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Gravity: Mass, Distance & Weight' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
