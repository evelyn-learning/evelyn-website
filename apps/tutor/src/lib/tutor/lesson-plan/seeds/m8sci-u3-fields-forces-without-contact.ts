/**
 * Grade 8 Science (Physical Science) — Fields: Forces Without Contact.
 *
 * CONCEPT-LED row 3.4 (NGSS MS-PS2-5). The student has no procedure to lean
 * on here: the lesson builds one idea -- the space around a mass, a charged
 * object or a magnet is not empty of everything, because a FIELD fills it,
 * and that is how a pull or a push reaches across a gap -- and then uses that
 * idea to judge whether a described investigation is evidence for it. Unit 3
 * has spent three lessons on forces that act with nothing in between:
 * gravity, the electric force, the magnetic force. This row is the account of
 * HOW, and it is the first thing in the course the student cannot see, touch
 * or weigh.
 *
 * The two traps it is built to kill are (a) the field-as-a-substance error --
 * invisible stuff sprays out of the magnet, crosses the gap, grabs the nail
 * and is slowly used up -- and (b) the field-needs-a-partner error, in which
 * the field only comes into existence at the moment a second object arrives,
 * so a point with nothing at it has nothing going on. Both are the same
 * mistake seen from two sides: treating the field as a thing that happens
 * BETWEEN two objects rather than as a condition OF the space.
 *
 * SCOPE GUARD: this plan explains that gravitational, electric and magnetic
 * forces act across empty space through a field that fills the space around a
 * mass, charge or magnet, evaluates described investigations as evidence that
 * the field is there even where the objects do not touch, and states that a
 * field is stronger nearer its source. Its scope cell has no lineage clause;
 * its withheld clause, verbatim: "Withholds field-strength calculations and
 * field-line mathematics (`ap-physics2-electrostatics.ts`,
 * `ap-physics2-magnetism.ts`)." What that means at each edge, and what is
 * deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 3.1 (gravity: mass, distance and weight) is
 *     assumed, not re-taught: gravity appears as one of the three non-contact
 *     forces and as the field every mass has around it, and this file never
 *     says that gravity grows with the masses, never separates mass from
 *     weight, and never states a weight in newtons. Row 3.2 (electric forces
 *     and charge) is assumed, not re-taught: charge is used as a word the
 *     student already holds -- a charged object, a comb or a rod that becomes
 *     charged when it is rubbed -- and the one sentence about a charged object
 *     pulling on something uncharged is flagged as the earlier lesson's result
 *     rather than re-derived. The words positive and negative do not appear in
 *     this file, no two charges are compared, and 3.2's like-repel /
 *     opposite-attract rule is nowhere restated. Row 3.3 (magnetic forces and
 *     electromagnets) is assumed, not re-taught: which metals a magnet pulls
 *     on is used as a fact the student already holds, and the word "pole" does
 *     not appear in the body at all -- the ends of a bar magnet are called its
 *     ends, because naming the poles would pull 3.3's content in behind them.
 *     No electromagnet, coil, turn of wire or current appears anywhere in this
 *     file (the word "electromagnet" occurs only inside the prerequisites
 *     loId). Where this
 *     file says a field is stronger nearer its source, it is making a claim
 *     about the SPACE at two places, which is this row's own sentence; it
 *     never runs 3.2's or 3.3's what-changes-the-strength investigation, and
 *     the amount of charge, the strength of the magnet and the number of coil
 *     turns are never named as variables. Row 4.1 (kinetic energy) is next
 *     and is not touched: no energy of any kind is named in the body, and the
 *     word "energy" occurs only inside the followUps loId.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: Earth appears in two roles
 *     only, each in the smallest form that makes its sentence work -- Earth's
 *     magnetic field is named as the thing a compass needle lines up with when
 *     no other magnet is near, and Earth's gravitational field is named as
 *     reaching out as far as the Moon (once in the concept segment, restated
 *     in the recap). There is no core, no dynamo, no magnetic pole of Earth,
 *     no orbit, no planet, no season, no tide and no Earth system anywhere in
 *     this file, and neither sentence is explained or tested by any item.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. Grade 7's fair-test vocabulary is assumed
 *     rather than re-taught: the fifth key idea and the third item ask the
 *     student to change one thing at a time, and the words variable,
 *     independent, dependent, controlled and hypothesis appear nowhere.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): no field is given a strength as a number or
 *     a unit anywhere in this file -- every number in it is a stated distance,
 *     count or size inside a described setup, never a measurement of a field,
 *     and every comparison of one field with another is the word "stronger"
 *     or "weaker". The structures this row stops short of are Coulomb's law
 *     and the computed electric field of `ap-physics2-electrostatics.ts`, and
 *     the field-line mathematics, right-hand rule, force on a moving charge
 *     and induction of `ap-physics2-magnetism.ts`. The lines of a filing
 *     pattern appear in one role only -- in the second worked example, in the
 *     third item's wrong choice, in the misconception check and in the recap
 *     -- as a pattern people draw, never as objects that come out of a magnet.
 *     Not one of them is ever counted, spaced or added, and no inverse-square
 *     relationship is stated anywhere: the distance claim in this file is
 *     "stronger nearer, weaker farther", with no rate attached.
 *   - HS CHEMISTRY boundary: no chemistry is in scope for this row, and none
 *     appears -- no substance is identified and no atom, electron or chemical
 *     model is drawn on. The word "particle" occurs only inside the clause
 *     that names the limit of the thermometer comparison in the misconception
 *     check, and the iron filings are described only as tiny bits of iron.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * investigation in this file is written out in words inside the segment that
 * uses it -- what was placed where, what the gap was, what moved and what did
 * not -- and every item is solvable from the text printed inside it. Never
 * write "look at the field diagram", and never assume the student has a
 * magnet, a compass, iron filings or a charged rod in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 3.3 -> 3.4 -> 4.1
 * (`magnetic-forces-and-electromagnets` -> `fields-forces-without-contact` ->
 * `kinetic-energy-mass-and-speed`), and both arrays carry those real loIds.
 *
 * NOTE ON ITEM SPECIMENS: the compass needle, the iron filings and the
 * charged comb bending a stream of water are named in this row's scope cell,
 * which is copied verbatim into the student-facing LO description, so they
 * are burned as item material. They teach here -- in the hook, the concept
 * segment and the two worked examples -- and no try_yourself reuses any of
 * the three investigations. The items run on a hanging paper clip, a mapped
 * pair of points around a bar magnet, and a plan for testing a charged rod
 * against a hanging foam ball, and none of those three appears in a teaching
 * segment. The third item does use a charged rod, as the scope cell's phrase
 * does, but there is no water in it, the setup and the question are
 * different -- which PLAN would be evidence, not what the rod does -- and
 * nothing in the LO description answers it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U3_FIELDS_FORCES_WITHOUT_CONTACT: LessonPlan = {
  id: 'evelyn.ms.m8sci.fields-forces-without-contact.v1',
  title: 'Fields: Forces Without Contact',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.fields-forces-without-contact',
      standard: 'M8SCI-3.4',
      description:
        'Explain that gravitational, electric and magnetic forces act across empty space through a FIELD that fills the space around a mass, charge or magnet, evaluate an investigation as evidence that the field exists even where the objects do not touch (a compass needle turning near a magnet, iron filings, a charged rod bending a stream of water), and state that a field is stronger nearer its source (NGSS MS-PS2-5).',
    },
  ],
  prerequisites: ['m8sci.magnetic-forces-and-electromagnets'],
  followUps: ['m8sci.kinetic-energy-mass-and-speed'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Collect three ordinary pulls that happen across a gap, and turn the gap itself into the question the lesson answers.',
      script:
        'Hold a fridge magnet near the door of a fridge and let go a little too early. It does not drop. It jumps the last bit of the way and lands with a click, and for that last instant nothing at all was touching it. Rub a balloon on a wool sweater and hold it just above your head, and your hair lifts up toward it before the balloon gets anywhere near your scalp. Drop your keys and they fall, with nothing pushing them down and nothing under them. Three pulls, three gaps, and in every one of them the two objects were not touching when the pulling started. Now think about what that means. Every push you have studied so far needed two things to be in contact -- your hand on a cart, the ground under your shoes, the air against a moving ball. These three do not. So either a force can reach across a stretch of nothing at all, or there is something in that stretch that we have not named yet. Today you will name it, and then you will do the harder thing: look at what somebody actually did in an investigation and decide whether it really is evidence that the something is there.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-what-a-field-is',
      kind: 'concept',
      goal: 'Name the three non-contact forces, define a field as a condition of the space rather than a substance, establish that it is there with nothing in it to feel it, attach strength to nearness, and give the three questions that decide whether an investigation is evidence.',
      keyIdeas: [
        'MOST FORCES NEED CONTACT. THREE DO NOT. When you push a shopping cart, your hands are on the handle. When friction slows a rolling ball, the ball and the ground are touching. When air resistance pushes back on a cyclist, the air is against her. Those are contact forces, and every one of them ends the instant the two surfaces come apart. Three forces in this course work the other way, and you have met all three already: gravity, which pulls between any two masses; the electric force, which pulls or pushes between charged objects; and the magnetic force, which pulls or pushes between magnets and pulls on iron, steel, nickel and cobalt. Each of these acts with a gap of air, or of nothing at all, in between. Rub a plastic comb on a wool sweater and hold it beside a thin stream of water running from a tap, and the stream bends toward the comb without the comb ever touching it. The water carries no charge of its own, and it still bends -- for the reason you already know from the lesson on electric forces and charge, that a charged object shifts the charges inside a nearby object a little, so the near side is pulled toward it.',
        'A FIELD IS THE CONDITION OF THE SPACE AROUND A SOURCE, NOT A SUBSTANCE COMING OUT OF IT. Every mass has a gravitational field around it. Every charged object has an electric field around it. Every magnet has a magnetic field around it. The field is the region in which another mass, another charge or another magnet would feel a force, and at each place in that region the field has a strength and a direction: this much pull, that way. That is the whole idea. The hardest part is what a field is NOT. WRONG: "Invisible magnetic stuff sprays out of the magnet, crosses the gap, takes hold of the nail, and the magnet slowly runs out of it." CORRECT: "The magnet fills the space around it with a magnetic field, and the nail is pulled by the field at the place where the nail sits." Nothing streams across the gap, nothing is used up, and a magnet that has lifted a hundred nails is not emptier than it was. A field is a condition of a place, in the way that being uphill is a condition of a place, and not a material you could catch in a jar.',
        'THE FIELD IS THERE WHETHER OR NOT ANYTHING IS THERE TO FEEL IT. This is the sentence that catches people out, so take it slowly. Put a small magnetic object at some spot near a magnet and it is tugged; that tug is how you find out the field is there. Take the object away and put it in a drawer, and the field at that spot is exactly what it was. The object did not make the field. It revealed it. Scientists call an object used this way a test object, and it is worth saying what the word test means here: the object tests the space, the way a thermometer tests how warm a room is without making the room warm. The two errors that follow from getting this backward are worth naming now. WRONG: "There is no field at a place until something magnetic gets close enough, and then the two of them make it together." CORRECT: "The field is already at that place; bringing something magnetic there only shows you what was already true of the space."',
        'A FIELD IS STRONGER NEARER ITS SOURCE. Put the same test object at two places, one near the source and one far from it, and the pull at the near place is the stronger of the two. That is true of all three fields: near a magnet the pull on a steel object is strong, and a few steps away it is too weak to notice; the hair on your arm lifts toward a charged balloon a couple of centimeters away and does nothing at all across a room. Two warnings come with this. First, a field does not stop at an edge. It gets weaker and weaker as you go out, and there is no line you can cross where it switches off -- eventually it is simply too weak to matter. Second, weaker is not gone: Earth is enormous, and its gravitational field is still strong enough at the Moon, far out in space, to keep pulling on it. Near, strong; far, weak; nowhere, never.',
        'HOW TO JUDGE WHETHER AN INVESTIGATION IS EVIDENCE THAT A FIELD IS THERE. Three questions, in order, and a good investigation answers all three. (1) WAS THERE A REAL GAP? Nothing touching across it, and nothing else that could have done the job instead -- no tilt of the table, no thread being pulled, no puff of air from a hand waving nearby. If the two objects touched, the result says nothing about acting at a distance. (2) DOES THE EFFECT DEPEND ON THE SOURCE? Take the magnet or the charged object away, or swap it for something that is not a magnet and not charged, and the effect should disappear. An effect that happens either way was never coming from the source. (3) DOES THE EFFECT DEPEND ON WHERE YOU PUT THE TEST OBJECT? Move it nearer and the effect should grow; move it farther and it should shrink. That is the field being mapped, place by place. One more rule sits over all three, and you already use it: change one thing between trials and keep everything else the same, or you will not know which change did the work.',
      ],
      vocabulary: [
        { term: 'contact force', definition: 'a push or a pull that acts only while two objects are touching, such as a hand on a cart, friction, or air resistance.' },
        { term: 'non-contact force', definition: 'a push or a pull that acts between two objects that are not touching; gravity, the electric force and the magnetic force are the three in this course.' },
        { term: 'field', definition: 'the region of space around a mass, a charged object or a magnet in which another mass, charge or magnet would feel a force, with a strength and a direction at every place in it.' },
        { term: 'gravitational field', definition: 'the field around any mass, in which another mass is pulled toward it.' },
        { term: 'electric field', definition: 'the field around a charged object, in which another charged object is pushed or pulled.' },
        { term: 'magnetic field', definition: 'the field around a magnet, in which another magnet, or a piece of iron, steel, nickel or cobalt, is pushed or pulled.' },
        { term: 'test object', definition: 'a small object placed at a spot on purpose, to find out whether a force acts there and how strong it is; it reveals the field and does not create it.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-compass-near-a-magnet',
      kind: 'worked_example',
      problem:
        'A student puts a compass on a wooden table, well away from anything magnetic. The needle settles, and one end of it points north. She then slides a bar magnet along the table toward the compass and stops it 5 centimeters away, so that the magnet and the compass never touch. The needle swings around and settles pointing toward the magnet instead. She lifts the magnet away, and the needle swings back to north. She repeats this with the magnet at eight different places around the compass, and at each one the needle settles pointing in a different direction. Is this good evidence that a magnetic field fills the space around the magnet? Say what the investigation shows, and what it does not show.',
      steps: [
        'Start with the gap, because that is question one. The needle turned, so a force acted on it -- a needle does not swing for no reason. Now ask what was touching the needle at the moment it turned. The magnet was 5 centimeters away and never reached the compass. The table was under the compass the whole time, before and after, so the table cannot be what changed. The air in the room did not move. There is a real gap, and something reached across it.',
        'Name the force. A compass needle is itself a small magnet, balanced so that it can turn freely, which is exactly why it is useful here: it is a test object for magnetic fields. So what acted on it was a magnetic force, and it acted at the place where the needle sits, not at the place where the magnet sits.',
        'Now question two, does the effect depend on the source. She lifted the magnet away and the needle swung back to north. Effect gone with the magnet gone: the magnet is the cause. Notice what the needle did when the magnet was absent, though, because it matters. It did not flop to a random direction -- it lined up pointing north, which it does because Earth has a magnetic field of its own and the needle lines up with it. So the space around that table was never free of field. Bringing the bar magnet close added a much stronger field nearby, and the needle lined up with that instead.',
        'Now question three, and this is the part that turns a single result into evidence for a FIELD rather than for a one-off tug. She tried eight places, and at each one the needle settled in a different direction. A field has a direction at every place in it, and those directions are different from place to place around a magnet -- so a test object that reports a different direction at each place is reporting on the space, place by place. WRONG: "The needle turned, so the magnet pulled the compass toward it." CORRECT: "The needle turned to line up with the field where the needle was, and the direction it chose depended on where in the space it sat."',
        'Say what the investigation does NOT show, because that is half of evaluating it. It does not show anything traveling out of the magnet: nothing was seen crossing the gap, and nothing needed to. It does not give a strength -- she read directions, not sizes, so no number about the field comes out of this at all. And it does not show that the field appears only when the compass is there; the compass is how she looked, and looking at something is not making it.',
        'Run the two checks a science answer needs, because there is no arithmetic here to redo. First, three clues of DIFFERENT KINDS that agree. The gap clue: nothing touched the needle, so whatever acted on it acted across 5 centimeters of air. The on-and-off clue: the effect arrived with the magnet and left with the magnet, so the magnet is the source and not the table, the room or the compass itself. The many-places clue: the direction depended on where the compass sat, which is what a field filling a region does and what a single fixed tug could not do. Three different kinds of evidence, one answer. Second, change one thing and check that the answer moves. Slide a copper bar of the same size and shape to the same spot instead of the magnet. Copper is not one of the metals a magnet pulls on, and the needle stays pointing north. Same size, same motion across the same table, no turn -- so the turning was never about an object being brought near. It was about a magnet being brought near.',
      ],
      answer:
        'Yes, it is good evidence. A force acted on the needle across a 5 centimeter gap with nothing touching it, the effect appeared and disappeared with the magnet, and the direction the needle settled in depended on where the compass sat -- which is a field being mapped place by place, not a single tug. What it does not show is any substance crossing the gap, any strength as a number, or any suggestion that the field exists only while the compass is there. Repeat it with a copper bar and the needle does not move, which is what pins the cause to the magnet.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-iron-filings-pattern',
      kind: 'worked_example',
      problem:
        'A stiff card is laid flat on top of a bar magnet, so that the card rests on the magnet and nothing else touches either of them. Iron filings -- tiny bits of iron, like gray dust -- are sprinkled evenly all over the card, and the card is tapped gently with a finger. The filings do not stay where they landed. They swing around and settle into curved lines that sweep from one end of the magnet to the other. Near the two ends of the magnet the lines are crowded close together and the filings stand up on end; out at the corners of the card the filings barely moved from where they fell. A student looks at it and says: "That proves a magnet shoots out invisible lines, and the filings are lying along the lines." What does the pattern actually show, and what is wrong with the student sentence?',
      steps: [
        'Start with what one filing is doing, because the pattern is only a lot of filings each doing that. A filing is a tiny piece of iron, and a piece of iron placed in a magnetic field becomes a small magnet for as long as it is there. So each filing behaves like a very small compass needle: it turns until it lines up with the field at its own spot. There are thousands of them, so there are thousands of separate reports, one per place, all taken at the same moment.',
        'Read the reports as a map. Every filing has turned, including the ones a long way from the magnet, and no filing is touching the magnet -- the card is in between. So the force reached across the card to each of them, at every place on the card, and the space above the magnet is filled with field rather than having field only in certain streaks.',
        'Read the crowding as a strength map, which is question three from the concept segment, answered all at once. Near the two ends of the magnet the filings are packed together and stand right up on end, because the field there is strong enough to lift them against their own weight. Out at the corners of the card, far from the magnet, the same filings barely shifted. Same filings, same tap, different places: the field is strongest near the magnet and gets weaker the farther out you look. Stronger nearer its source.',
        'Now the student sentence. WRONG: "A magnet shoots out invisible lines, and the filings are lying along the lines." CORRECT: "The magnet fills the space around it with a field, and each filing turns to match the field at its own spot; the lines are the pattern all that turning makes, not objects that came out of the magnet." Two things go wrong in the student version. Nothing is shot out -- see the first correction of the day, that a field is a condition of the space and not a substance leaving the source. And the lines are not real: people draw field lines because they are a handy way to show which way a field points, but there is no gap between two drawn lines where nothing happens. Drop one more filing into a space between two of the lines and it turns too, because the field is at that place as well.',
        'One more thing the student sentence gets backward, and it is worth its own line: the filings did not create the pattern in the space. WRONG: "The lines are there because the filings are there." CORRECT: "The field was there before any filing landed; sweeping the filings off the card does not change the space above the magnet one bit."',
        'Run the two checks. First, three clues of DIFFERENT KINDS that agree that a field fills the space. The no-contact clue: not one filing touched the magnet, and every one of them moved. The direction clue: the filings settle in different directions at different places, and a single compass carried around the magnet reports those same directions at those same places, so two very different test objects agree. The strength clue: the effect fades steadily with distance from the magnet, which is what a field around a source does. Second, change one thing and check that the answer moves. Slide the magnet out from under the card and tap again: the filings shuffle and stay wherever they land, in no pattern at all. Or keep the magnet and use a card three times as thick, which pushes every filing farther from the magnet: the same pattern forms, but it is fainter, and fewer filings stand on end. Farther away, weaker field -- the answer moved in the direction the field idea predicts.',
      ],
      answer:
        'The pattern shows that a magnetic field fills the whole space around the magnet, because every filing turned to match the field at its own place without touching the magnet, and it shows that the field is stronger nearer the magnet, because the filings are crowded and standing on end near the ends of the magnet and barely moved at the far corners of the card. The student sentence is wrong twice: nothing is shot out of a magnet, since a field is a condition of the space rather than a substance, and the lines are a pattern we draw rather than real objects -- a filing placed between two lines turns as well.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-clip-hanging-in-the-air',
      kind: 'try_yourself',
      problem:
        'One end of a short thread is taped to a table and a steel paper clip is tied to the other end. The clip is lying flat on the table. A strong magnet is held in the air above the clip and lowered slowly. When the magnet is about 1 centimeter above the clip, the clip rises off the table and hangs there in the air, leaning toward the magnet, with the thread pulled tight and a clear gap of air between the clip and the magnet. Nothing touches the clip except the thread, and the air in the room is still. What does this result show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It shows that the magnet\'s field is a stream of invisible stuff pouring out across the 1 centimeter of air and taking hold of the clip the way a sticky thread would, and that the magnet holds a limited supply of it which runs a little lower every time it lifts something.' },
        { id: 'b', text: 'It shows that the clip and the magnet must really be touching somewhere, because a force is a push or a pull between two objects, and a push or a pull can only be passed along where two surfaces are pressed against each other.' },
        { id: 'c', text: 'It shows that a magnet produces a pull only at the moment something magnetic comes close enough to it, so there was no field in the space above the table until the clip was raised into it and the two of them made the pull together.' },
        { id: 'd', text: 'It shows that a magnetic force acts on the clip across the gap, with nothing but the thread touching the clip and the thread pulling downward, so the space above the table is filled with a magnetic field from the magnet, and the clip is pulled by the field at the place where it hangs.', correct: true },
      ],
      expectedAnswer: 'It shows that a magnetic force acts on the clip across the gap, with nothing but the thread touching the clip and the thread pulling downward, so the space above the table is filled with a magnetic field from the magnet, and the clip is pulled by the field at the place where it hangs.',
      hints: [
        'Work through the gap first. The clip is hanging in the air with nothing but still air between it and the magnet, so a force is acting on it where it hangs. What is the word for what fills the space around a magnet and does that?',
        'It is tempting to picture the pull as a thing that travels across the gap, or as a thing that is made at the last moment when the clip gets close enough. A field is neither: it is a condition of the space, it is there before the clip rises, and nothing is used up by it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-mapping-two-points',
      kind: 'try_yourself',
      problem:
        'A student maps the space around a bar magnet that is lying still on a table. She sets a small steel washer down at point P, 2 centimeters from one end of the magnet, and the washer is tugged strongly toward the magnet. She moves the same washer to point Q, 10 centimeters from that same end and in the same direction, and the tug there is much weaker, though it is still there. She then picks the washer up and shuts it in a drawer across the room, leaving the magnet alone on the table. Which statement about points P and Q is correct now that the washer is gone?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The magnetic field is still at P and at Q, because the field belongs to the space around the magnet and the washer only revealed it, and the field at P is the stronger of the two because P is nearer the magnet.', correct: true },
        { id: 'b', text: 'There is no field at P or at Q any more, because a force has to act between two objects, and with the washer shut in a drawer there is nothing left for the magnet to pull on, so nothing at all is going on at either point until something magnetic is put back.' },
        { id: 'c', text: 'The field is still at P and at Q and it is exactly as strong at one as at the other, because a magnet fills the space all around it evenly, right out to an edge where the field stops all at once and beyond which there is none.' },
        { id: 'd', text: 'The field at P is now the weaker of the two, because the magnet handed over a little of its field to the washer while the washer sat at P, and a magnet that has been used that way is left with a thinner patch in the space it has given from.' },
      ],
      expectedAnswer: 'The magnetic field is still at P and at Q, because the field belongs to the space around the magnet and the washer only revealed it, and the field at P is the stronger of the two because P is nearer the magnet.',
      hints: [
        'Ask what the washer was for. It was a test object, and a test object is a way of finding out what the space is like -- the way a thermometer finds out how warm a room is. Does taking the thermometer out of the room change how warm the room is?',
        'Then compare the two points. One is 2 centimeters from the end of the magnet and the other is 10 centimeters from it, and the tug was much weaker at the far one. What does that say about the field at the two places, with or without the washer there?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-designing-the-charged-rod-test',
      kind: 'try_yourself',
      problem:
        'A student wants to show that a charged object can pull on something without touching it. She has a plastic rod that becomes charged when she rubs it on a wool cloth, and a light foam ball hanging still on a long thread. Which plan gives her the best evidence that a force acts across a gap?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rub the rod on the wool and press it firmly against the hanging ball; if the ball swings away from where it was resting, that shows the charged rod is able to move the ball, and a rod that can move a ball it is pressed against can certainly do the same job from a short distance off, so one clear result in contact settles the question.' },
        { id: 'b', text: 'Bring the rubbed rod slowly toward the still ball and stop while a clear gap of air remains, recording whether the ball swings toward the rod while nothing is touching it, and then repeat the whole approach with the same rod left unrubbed, so that the charge is the only difference between the two trials.', correct: true },
        { id: 'c', text: 'Rub the rod on the wool and then wave it quickly back and forth in the air beside the hanging ball, and watch closely for the ball to move; any movement at all would have to have come from the charge reaching across the gap to pull on it.' },
        { id: 'd', text: 'Hold the rubbed rod near the ball and look hard at the gap between them for the faint lines of the field running from one to the other, since seeing the lines in the space between the two objects would be the most direct evidence possible that the field is there.' },
      ],
      expectedAnswer: 'Bring the rubbed rod slowly toward the still ball and stop while a clear gap of air remains, recording whether the ball swings toward the rod while nothing is touching it, and then repeat the whole approach with the same rod left unrubbed, so that the charge is the only difference between the two trials.',
      hints: [
        'Run the claim past the three questions. The claim is about a force acting with a gap, so the plan has to keep a gap open and let nothing else cross it -- and it has to show that the effect goes away when the charge does.',
        'Check each plan for something other than the charge that could have moved the ball, and check whether the plan expects to SEE the field rather than to detect it by what it does to a test object.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-field-as-stuff',
      kind: 'misconception_check',
      question:
        'A student writes: "A magnet works by spraying invisible magnetic stuff into the space around it, and that stuff grabs a nail and drags it in, which is why an old magnet that has picked up a lot of nails gets weak. And if there is nothing magnetic anywhere near it, none of that is happening, so there is no field around the magnet at all." Two different things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'A magnet sprays invisible stuff into the space, the stuff grabs the nail, and the magnet runs low on it.',
          misconception:
            'Treating a field as a material that is stored in the magnet, travels across the gap and is spent on each job, because every pull the student has ever explained before this lesson worked by something touching something, so an invisible something seems like the only way to fill the gap.',
          correctsTo:
            'A field is a condition of the space around the magnet, not a material in it. Saying there is a magnetic field at a place means that a magnet, or a piece of iron, steel, nickel or cobalt, placed at that place would be pushed or pulled, with a particular strength and in a particular direction. Nothing travels across the gap and nothing is consumed: the nail is pulled by the field at the place where the nail is. The picture to keep is a map rather than a spray. And the test that settles it is the one from the iron filings: every filing on the card turns at the same moment, all over the card at once, including filings far from the magnet and filings sitting between the curved lines of the pattern. That is a whole region being a certain way, not a stream going somewhere. Magnets can indeed lose strength -- dropping them hard or heating them will do it -- but not by being used, and picking up a nail costs a magnet nothing.',
        },
        {
          answer: 'With nothing magnetic nearby, there is no field around the magnet at all.',
          misconception:
            'Reading a field as something that happens BETWEEN two objects, so that it only comes into existence once the second object arrives and the two of them make it together, when the field is a property of the space that one object alone sets up.',
          correctsTo:
            'The field is there whether or not anything is there to feel it. The second object is how you find out about the field, and finding out about something is not the same as making it. Put a small steel object at a spot near a magnet and it is tugged; take it away and shut it in a drawer, and the space at that spot is exactly as it was, and it will tug the next magnetic thing that arrives there. A thermometer is the comparison to hold on to: the room is warm before the thermometer goes in, the thermometer reports the warmth, and taking it out again does not cool the room. Like every comparison it has a limit -- warmth is the motion of particles in the air, and a field is not made of particles at all -- but the part that matters carries over exactly. WRONG: "Nothing is near it, so there is no field." CORRECT: "Nothing is near it, so nothing is being pulled -- and the field is there all the same."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Most forces need contact. Three do not: gravity, the electric force and the magnetic force all act between objects that are not touching.',
        'A field is the region of space around a mass, a charged object or a magnet in which another mass, charge or magnet would feel a force, with a strength and a direction at every place in it.',
        'A field is a condition of the space, not a substance sprayed out of the source. Nothing crosses the gap and nothing is used up.',
        'The field is there whether or not anything is there to feel it. A test object reveals the field; it does not create it.',
        'A field is stronger nearer its source and weaker farther away. It fades out rather than stopping at an edge, and weaker never means gone -- Earth\'s gravitational field still reaches the Moon.',
        'To judge whether an investigation is evidence of a field, ask three questions: was there a real gap with nothing else able to do the job; does the effect disappear when the source is taken away; and does the effect change when the test object is moved nearer or farther?',
        'Between trials, change one thing and keep everything else the same, or you will not know which change did the work.',
        'Field lines are a pattern people draw to show which way a field points. They are not objects coming out of a magnet, and the field is just as real in the spaces between the drawn lines.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Fields: Forces Without Contact' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
