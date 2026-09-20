/**
 * Grade 8 Science (Physical Science) — Potential Energy: Stored by Position.
 *
 * Concept-led row 4.2 (NGSS MS-PS3-2). The mental model the whole lesson
 * builds is that potential energy is stored in the ARRANGEMENT of two or
 * more objects that push or pull on each other, and that one rule covers
 * every kind of it: move the objects against the force between them and the
 * stored energy goes up; let the force move them and it comes back out as
 * motion. Height is the case the student has met and is the case that
 * installs the wrong rule, so the file teaches "against the force" as the
 * rule and "higher" as one instance of it.
 *
 * The two traps it is built to kill are (a) "potential energy means being up
 * high", which makes a stretched spring and a pair of magnets invisible as
 * stored energy, and (b) "the energy is inside the object", which the pair of
 * magnets refutes cleanly -- carry one magnet across the room and the stored
 * energy is nearly gone while neither magnet has changed at all.
 *
 * SCOPE GUARD: this plan models how stored potential energy changes when the
 * arrangement of interacting objects changes, and RANKS arrangements. Its
 * scope cell's withheld clause, verbatim: "Withholds PE = mgh and
 * spring-constant arithmetic (AP Physics)." What that means at each edge, and
 * what is deliberately ALLOWED there:
 *   - NO AMOUNT IS EVER COMPUTED OR MEASURED. Every comparison in this file
 *     is a ranking, and every ranking it actually makes changes exactly ONE
 *     quantity (a height, a stretch, a separation, a mass) while holding the
 *     rest fixed. Where two quantities change in opposite directions -- the
 *     heavier pot on the lower sill in worked example 1, and a distractor in
 *     the first item -- the file DECLINES to rank and says so in words. The
 *     only numbers in the body are heights (1, 2, 3, 4, 6 and 9 meters) and
 *     lengths (1, 2, 4, 5, 10 and 15 centimeters); they are there to order
 *     arrangements, and nothing is calculated from any of them. Worked
 *     example 2 states outright that "twice as far" does not have to mean
 *     "twice as much stored", which is the file's way of refusing the
 *     proportionality a formula would supply.
 *   - GRADE 8 NEIGHBORS. Row 4.1 (kinetic energy from mass and speed) is the
 *     prerequisite and is assumed: "motion energy" and "kinetic energy" are
 *     used as words the student already holds, and the mass and speed
 *     relationship -- in particular the double-the-speed-four-times-the-energy
 *     ratio -- is never restated or used. Row 4.3 (energy transformations and
 *     conservation) is the follow-up and is NOT taught here: wherever a
 *     release is mentioned it is one clause saying the stored energy becomes
 *     motion energy, no chain of energy forms is traced, and no total is ever
 *     claimed to be conserved (the words "transformation" and "conservation"
 *     occur in this file only inside the followUps loId, which names the next
 *     row). Row 4.4 (energy transferred between objects when motion
 *     changes) is not touched: no item asks which object gave and which
 *     received. Rows 3.1, 3.3 and 3.4 supply the forces and are assumed, not
 *     re-taught -- that Earth pulls objects down, that like magnetic poles
 *     push apart and opposite poles pull together, and that like charges push
 *     apart. The word "field" does not appear.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no orbit, planet, moon, plate,
 *     current, reservoir or weather system appears anywhere in this file. The
 *     only gravity in it is Earth pulling a nearby object toward the ground.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. Chemical potential energy is named once, in
 *     the misconception check, as energy stored in the arrangement of atoms
 *     inside a battery or a tank of fuel; food, organisms and respiration are
 *     deliberately not the example chosen there.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): the formulas this row
 *     stops short of are PE = mgh and the spring-constant relationship, and
 *     neither appears in words or in symbols. No quantity in the body carries
 *     a unit of energy or of force, and nothing is computed from any of the
 *     heights and lengths that do appear; work = force × distance appears
 *     nowhere in the body, in symbols or in words, and is never used as a way
 *     of reaching an answer; the
 *     inverse-square weakening of gravity with distance is not mentioned, and
 *     the one distractor that leans on a force weakening with distance is a
 *     magnetic one, stated only as a direction and never as a law. Nuclear
 *     energy, which the legacy salvage list carries, is dropped entirely --
 *     no row in this course touches it.
 *
 * NOTE ON ITEM DESIGN: the objective names three arrangements -- a book
 * lifted higher, a spring stretched further, two magnets pushed closer with
 * like poles facing -- and the objective is student-facing, so all three are
 * burned as item material and are used only in the teaching segments. The
 * items run on a backpack on two stairwell landings, two rubber bands in
 * launchers, and two magnets with OPPOSITE poles facing. That last one is the
 * deliberate transfer case: every magnetic arrangement in the teaching
 * segments has LIKE poles facing, where closer means more stored, so the
 * third item can only be reached by applying the "against the force" rule to
 * a pull instead of a push. Do not "helpfully" work the attracting pair in
 * the concept segment; the item exists to test exactly that step.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * arrangement in this file is written out in words -- which pole faces which,
 * how far above what, how far from the relaxed shape -- and every item is
 * solvable from the text printed inside it. Never write "look at the
 * diagram", and never assume the student has a spring, a magnet or a
 * launcher in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.1 -> 4.2 ->
 * 4.3 (`kinetic-energy-mass-and-speed` -> `potential-energy-and-position` ->
 * `energy-transformations-and-conservation`), and both arrays are populated
 * with those real loIds. The two exemplars' empty arrays are a registration
 * artifact and are not the pattern.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U4_POTENTIAL_ENERGY_AND_POSITION: LessonPlan = {
  id: 'evelyn.ms.m8sci.potential-energy-and-position.v1',
  title: 'Potential Energy: Stored by Position',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.potential-energy-and-position',
      standard: 'M8SCI-4.2',
      description:
        'Model how the potential energy stored in a system changes when the arrangement of interacting objects changes -- a book lifted higher, a spring stretched further, two magnets pushed closer with like poles facing -- and rank arrangements by stored energy (NGSS MS-PS3-2).',
    },
  ],
  prerequisites: ['m8sci.kinetic-energy-mass-and-speed'],
  followUps: ['m8sci.energy-transformations-and-conservation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put three completely still arrangements side by side -- a phone held over tile, a latched spring, two magnets held together against their own push -- so the student notices that something is loaded into each one before any of them moves.',
      script:
        'Think about three things that are perfectly still. A phone held out at arm\'s length over a hard tile floor. A spring pressed all the way down inside a pop-up toy, with the lid latched shut on top of it. And two magnets, held about a centimeter apart with their north poles facing each other, pushing back against your hands the whole time. Nothing in any of those three is moving. Nothing is warm, nothing is glowing, nothing is making a sound. And yet every one of them makes you a little uneasy, because you know exactly what happens the moment you let go. The phone drops and the screen cracks. The lid pops. The magnets fly apart. Something got loaded into each of those three, and it got loaded there when the objects were put where they are -- not into the phone, not into the spring, not into either magnet, but into the way they are arranged. Today you will learn what that stored something is, what sets how much of it there is, and how to line up two arrangements and say which one holds more.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-stored-by-arrangement',
      kind: 'concept',
      goal: 'Install potential energy as a property of an arrangement rather than an object, give the one against-the-force rule, run it through the gravitational, elastic and magnetic cases, and finish with the ranking routine and its honest failure case.',
      keyIdeas: [
        'POTENTIAL ENERGY IS STORED IN AN ARRANGEMENT, NOT INSIDE ONE OBJECT. Potential energy is energy stored in the way two or more objects that push or pull on each other are placed. The objects taken together are called a system, and the stored energy belongs to the system. A crate resting on a high shelf does not have potential energy the way it has a mass: what has it is the crate and Earth together, and what sets the amount is how far apart they are. The clearest way to see this is with two magnets held with their north poles facing, a centimeter apart. Carry one of them to the other side of the room and almost nothing is stored any more -- and neither magnet has changed in any way at all. Nothing was drained out of either one, because there was never anything stored in either one on its own.',
        'THE ONE RULE, AND IT IS NOT "HIGHER". Find the force between the objects and ask which way it is pushing or pulling them. Move them AGAINST that force and the stored energy goes UP. Let the force move them the way it was already pushing or pulling, and the stored energy goes DOWN and comes out as motion energy. That single rule covers every case in this lesson. Lifting a box stores energy because Earth pulls the box down and the lift went up. Pressing a spring in stores energy because the spring pushes back out and the press went in. "Higher" only looks like the rule because Earth\'s pull is the force in the first example anyone meets. Get in the habit of naming the force first, then the direction, and only then saying which arrangement holds more.',
        'GRAVITATIONAL POTENTIAL ENERGY: HOW FAR ABOVE, AND HOW MUCH MASS. Between any object near the ground and Earth, the force is Earth\'s pull, straight down toward the surface the object could fall to. So two things raise the stored energy of that arrangement: setting the object farther above that surface, and giving it more mass. Hold one fixed and change the other, and the ranking is easy -- the same box on a 4-meter balcony stores more than that box on a 1-meter table, and a full box on the 4-meter balcony stores more than an empty one in the same spot. Notice what is NOT on that list. How fast you carried it up does not appear. How long it has been sitting there does not appear. How tired you are does not appear. The arrangement is the whole story.',
        'ELASTIC POTENTIAL ENERGY: HOW FAR FROM ITS RELAXED SHAPE. Something springy -- a spring, a bungee cord, a bent ruler, a trampoline mat -- has one shape it takes when nothing is pushing or pulling on it, called its relaxed shape. Pull it away from that shape and the material pulls back toward it; press it in and the material pushes back out. Either way, changing its shape moves against the force the material is applying, so either way energy goes into the arrangement. SQUEEZING STORES ENERGY JUST AS STRETCHING DOES, which surprises people who think only stretching counts. The farther from the relaxed shape it is held, the more is stored, and the arrangement here is the parts of the object itself, pulled apart from or pressed into one another.',
        'MAGNETIC AND ELECTRIC ARRANGEMENTS FOLLOW THE SAME RULE. You already know that two like magnetic poles push each other apart, that two opposite poles pull toward each other, and that two like electric charges push apart while opposite charges pull together. None of that changes the rule; it only changes which way the force points, and that is the thing you have to check every time. Take two magnets with their north poles facing and push them closer together: they push back the whole way, harder and harder as the gap closes, so the move is against the force and the arrangement stores more the closer they are held. Let go and the push drives them apart, and the stored energy becomes motion energy.',
        'HOW TO RANK TWO ARRANGEMENTS, AND WHEN TO REFUSE. Step one, name the objects in the system and the force between them. Step two, say which way that force pushes or pulls them. Step three, check how many quantities differ between the two arrangements. If exactly one differs -- a height, a stretch, a separation, a mass -- then the arrangement set farther against the force stores more, and you can say so. If two of them differ in opposite directions, such as a lighter object placed higher against a heavier object placed lower, then you CANNOT rank them by reasoning alone. Saying so is the right answer, not a dodge: to settle that pair you would have to measure both amounts, and measuring is a job for a later course. This lesson ranks arrangements; it never puts a number on one.',
      ],
      vocabulary: [
        { term: 'potential energy', definition: 'energy stored in the arrangement of two or more objects that push or pull on each other; it changes when their arrangement changes.' },
        { term: 'system', definition: 'the objects being considered together, such as a lifted crate and Earth, or a pair of magnets. Stored potential energy belongs to the system, not to one object in it.' },
        { term: 'gravitational potential energy', definition: 'energy stored in the arrangement of an object and Earth; more of it when the object is set farther above the surface it could fall to, and more of it for more mass.' },
        { term: 'elastic potential energy', definition: 'energy stored in something springy that is held away from its relaxed shape, whether it has been stretched or squeezed.' },
        { term: 'magnetic potential energy', definition: 'energy stored in the arrangement of two magnets, set by how they are placed relative to each other and by which poles face which.' },
        { term: 'relaxed shape', definition: 'the shape a springy object takes when nothing is stretching or squeezing it.' },
        { term: 'kinetic energy', definition: 'the energy an object has because it is moving; also called motion energy. Stored potential energy becomes kinetic energy when the arrangement is released.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-flowerpots',
      kind: 'worked_example',
      problem:
        'A school keeps three identical flowerpots, each holding the same soil and the same plant, so all three have the same mass. One stands on a windowsill 1 meter above the ground, one on a windowsill 4 meters above the ground, and one on a ledge 9 meters above the ground. Rank the three arrangements from most stored energy to least, and say what the ranking depends on. Then decide whether you could rank a fourth pot, one with twice the mass, sitting on a sill 2 meters above the ground, against the pot on the 4-meter sill.',
      steps: [
        'Name the system and the force. A pot on its own is not storing anything. For each pot the system is that pot and Earth, and the force between them is Earth\'s pull on the pot, pointing straight down toward the ground.',
        'Say where the force would take things. Release a pot and the pull takes it straight down to the ground below it. So "down to the ground" is the direction of the force, and how far the pot has been set above that ground is how far the arrangement has been set against the pull.',
        'Count how many quantities differ. The three pots are identical, with the same soil and the same plant, so the mass is the same for all three. The only quantity that differs is the height. One quantity, so this comparison can be ranked by reasoning.',
        'Rank them. The pot on the 9-meter ledge stores the most, the pot on the 4-meter sill is next, and the pot on the 1-meter sill stores the least. Same mass throughout, so more height above the ground means more stored in the arrangement.',
        'Now the fourth pot: twice the mass, 2 meters up, against the original pot at 4 meters. Two quantities differ this time, and they pull the comparison in opposite directions -- the extra mass raises the stored energy and the lower sill lowers it. WRONG: "Twice as heavy beats half as high, so the heavy one must store more." CORRECT: "Two quantities changed in opposite directions, so this pair cannot be ranked by reasoning alone. Settling it would mean measuring both amounts, and this lesson ranks arrangements rather than measuring them." Being able to say that is part of the skill, not a failure to answer.',
        'Run the checks a science answer needs, because there is no arithmetic here to redo. Look for clues of DIFFERENT KINDS that agree. First, the arrangement itself: the ledge pot sits farthest from the ground it would fall to, so it is the one set farthest against Earth\'s pull. Second, what it took to set it up: carrying a pot up to the 9-meter ledge means lifting it against that same pull far farther than putting one on the 1-meter sill did, and you can feel the difference in your arms. Third, what comes back out on release: a pot knocked off the 9-meter ledge is moving much faster when it reaches the ground, and does far more damage, than one knocked off the 1-meter sill. The arrangement, the setting up and the letting go are three different kinds of evidence, and all three rank the ledge first.',
        'Change one thing and check that the answer moves with it. Carry the ledge pot down and put it on the 1-meter sill. Nothing about the pot changed -- same soil, same plant, same mass -- and yet that arrangement now stores the least of the three. Then go the other way: leave the 4-meter pot exactly where it is and pour in twice as much soil. The height did not move, the mass did, and that arrangement now stores more than it did a moment ago. Each time exactly one quantity moved and the answer moved with it, which is what tells you the ranking is really about the arrangement.',
      ],
      answer:
        'From most stored to least: the pot on the 9-meter ledge, then the pot on the 4-meter sill, then the pot on the 1-meter sill. With the same mass in all three, the ranking depends only on how far each pot is set above the ground it could fall to, which is how far that arrangement sits against Earth\'s pull. The fourth pot cannot be ranked against the 4-meter pot by reasoning alone, because it has more mass and less height and the two differences push the comparison in opposite directions.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-spring-and-two-magnets',
      kind: 'worked_example',
      problem:
        'Two arrangements, one question about each. First: inside a pop-up toy a spring is pressed down and held by a latch. In one toy the spring is held 2 centimeters shorter than its relaxed length; in a second, identical toy it is held 4 centimeters shorter. Second: two identical bar magnets are held with their north poles facing each other, so they push apart. In one arrangement they are held 4 centimeters apart, and in another arrangement the same two magnets are held 1 centimeter apart. For each pair, say which arrangement stores more, and then say what the two pairs have in common.',
      steps: [
        'Start with the spring, and name what actually moved. The two ends of the spring are closer together than they are when the spring is relaxed, and a spring held shorter than its relaxed length pushes back outward against whatever is holding it in. So the force points outward and the pressing went inward: the move was against the force, and energy went into the arrangement.',
        'Rank the two toys. The only quantity that differs is how far the spring is held from its relaxed length, 2 centimeters in one toy and 4 centimeters in the other. Farther from the relaxed shape means more stored, so the toy with the spring held 4 centimeters shorter stores more. WRONG: "It is pressed twice as far, so it stores exactly twice as much." CORRECT: "It is pressed farther, so it stores more. How much more is not something this lesson can say, and twice as far does not have to mean twice as much." Ranking is the claim you are entitled to make here.',
        'Now the magnets. Two north poles facing each other push apart, so the force on each magnet points away from the other one. Moving them from 4 centimeters apart to 1 centimeter apart pushes them together, which is straight against that force, and the push back gets harder the smaller the gap gets. So the 1-centimeter arrangement is the one set farther against the force, and it stores more.',
        'Say what the two pairs share. In both, somebody moved objects against the force between them, and the arrangement set farther against that force is the one holding more. And in both, releasing the arrangement lets the force do the moving: the latch opens and the lid flies up, the hands come away and the magnets shoot apart, and in each case the stored energy becomes motion energy. Notice that "more stored" went with a SMALLER number for the magnets and a LARGER number for the spring. That is why the rule is about the force and not about the distance.',
        'Run the checks. Look for clues of DIFFERENT KINDS that agree. First, the direction: in both pairs the force points one way and the setting-up went the other way, which is the rule itself. Second, what the setting-up took: pressing the spring that second 2 centimeters takes a harder push than the first 2 centimeters did, and squeezing the last centimeter between two magnets that are shoving each other away is the hardest part of the whole move. Third, what comes back out: the toy whose spring is held 4 centimeters shorter throws its lid higher when the latch opens, and the magnets released from 1 centimeter apart fly apart faster than the same pair released from 4 centimeters apart. The direction, the setting up and the letting go all point the same way.',
        'Change one thing and check that the answer moves. Let the spring all the way back out to its relaxed length and latch nothing: now nothing has been moved against anything, nothing is stored, and opening the lid does nothing at all. Then hold the same two magnets 10 centimeters apart instead of 1 centimeter: at that distance they barely push on each other, so barely anything is stored, and letting go hardly moves them. Same spring, same magnets, different arrangement, different answer -- which is exactly the claim this lesson makes, that the energy is in the arrangement.',
      ],
      answer:
        'The toy whose spring is held 4 centimeters shorter than its relaxed length stores more than the one held 2 centimeters shorter, and the magnets held 1 centimeter apart store more than the same pair held 4 centimeters apart. Both pairs follow one rule: the objects were moved against the force between them, and the arrangement set farther against that force stores more. For the spring that meant a bigger number of centimeters and for the magnets a smaller one, which is why the rule names the force rather than the distance. Twice as far does not have to mean twice as much stored, and this lesson ranks arrangements rather than measuring them.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-stairwell-landings',
      kind: 'try_yourself',
      problem:
        'You carry the same full backpack up a stairwell, packed exactly as it was when you started. First you set it down on the landing 3 meters above the ground floor. Then you pick it up, carry it to the next landing, 6 meters above the ground floor, and set it down there. Nothing is added to the backpack or taken out of it at any point. Which statement about the two arrangements is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They store the same amount, because it is the same backpack packed in exactly the same way, and nothing about the backpack itself changed anywhere on the way up the stairs.' },
        { id: 'b', text: 'The arrangement at 6 meters stores more only if you ran up the stairs, because hurrying pushes more energy into the backpack than carrying it up slowly and steadily does.' },
        { id: 'c', text: 'The arrangement at 6 meters stores more, because the backpack has been set farther above the floor it could fall back to, and the whole of that extra lift moved it against Earth\'s downward pull.', correct: true },
        { id: 'd', text: 'You cannot compare the two, because stored energy depends on how heavy the backpack is, and without being told how many kilograms of gear are inside it there is no way to rank one arrangement against the other.' },
      ],
      expectedAnswer: 'The arrangement at 6 meters stores more, because the backpack has been set farther above the floor it could fall back to, and the whole of that extra lift moved it against Earth\'s downward pull.',
      hints: [
        'Name the system before anything else: the backpack and Earth, with Earth\'s pull acting downward on the backpack. Then ask how many quantities are actually different between the two arrangements.',
        'Only one quantity changed between the two landings, so this pair can be ranked by reasoning. Which way does Earth\'s pull point, and which arrangement has been set farther against it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-stretched-bands',
      kind: 'try_yourself',
      problem:
        'Two identical rubber bands are fitted to two identical launchers. The first band is pulled back 5 centimeters from its relaxed length and held still. The second band is pulled back 15 centimeters from its relaxed length and held still. Neither one has been released yet. Which statement about the two arrangements is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They store the same amount, because both bands are the same size and made of the same rubber, and how much energy something can store is fixed by the material it is made out of.' },
        { id: 'b', text: 'Neither of them stores any energy at all while it is being held still, because nothing in either launcher is moving yet, and energy is the thing that moving objects have.' },
        { id: 'c', text: 'The band pulled back 5 centimeters stores more, because stretching a rubber band uses up its springiness a bit at a time, so the band pulled back 15 centimeters has already spent more of what it had to give.' },
        { id: 'd', text: 'The band pulled back 15 centimeters stores more, because it is held farther from its relaxed shape, and every centimeter of that stretch moved against the rubber pulling back the other way.', correct: true },
      ],
      expectedAnswer: 'The band pulled back 15 centimeters stores more, because it is held farther from its relaxed shape, and every centimeter of that stretch moved against the rubber pulling back the other way.',
      hints: [
        'A stretched rubber band pulls back toward its relaxed shape the entire time it is held. So compare the direction the stretching went with the direction the rubber is pulling.',
        'The two bands are identical and only one quantity differs between the arrangements, so this pair can be ranked. Holding something still does not empty it of stored energy -- ask which arrangement is set farther against the pull of the rubber.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-magnets-opposite-poles',
      kind: 'try_yourself',
      problem:
        'Two bar magnets lie on a smooth table, lined up so that the north pole of the first magnet faces the south pole of the second. Arranged that way, the two magnets pull toward each other. In the first arrangement they are held in place 1 centimeter apart. In the second arrangement the same two magnets are held in place 5 centimeters apart. Neither magnet is changed in any way. Which arrangement stores more energy, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The 5-centimeter arrangement, because these two magnets pull toward each other, so separating them means moving against that pull, and letting go lets the pull drag them back together.', correct: true },
        { id: 'b', text: 'The 1-centimeter arrangement, because two magnets always store more energy the closer together they are placed, whichever of their poles happens to be facing which.' },
        { id: 'c', text: 'Neither, because the two arrangements store exactly the same amount: the energy of a magnet is sealed inside that magnet, and moving one of them cannot change what the other one is holding.' },
        { id: 'd', text: 'The 1-centimeter arrangement, because the pull between two magnets gets weaker the farther apart they are moved, and a weaker pull between them has to mean less energy stored in the arrangement.' },
      ],
      expectedAnswer: 'The 5-centimeter arrangement, because these two magnets pull toward each other, so separating them means moving against that pull, and letting go lets the pull drag them back together.',
      hints: [
        'The rule does not say "closer" and it does not say "farther". It says "against the force". Which way is the force between these two magnets pointing, now that a north pole is facing a south pole?',
        'Picture letting go of both of them. They come together on their own, so nobody has to push them together -- but somebody does have to pull against that attraction to get them apart. Which of those two moves is the one that loads the arrangement?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-height-and-inside-the-object',
      kind: 'misconception_check',
      question:
        'A student writes: "Potential energy just means being up high, and it is stored inside the object that is up high." Two separate things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Potential energy just means being up high.',
          misconception:
            'Meeting gravitational potential energy first and taking height to be the definition, because almost every early example of stored energy is something that was lifted.',
          correctsTo:
            'Height is one case of the rule, not the rule itself. Energy is stored whenever objects that push or pull on each other are moved against that push or pull. Lifting a crate stores GRAVITATIONAL potential energy, because Earth pulls the crate down and the lift went up. Holding something springy away from its relaxed shape stores ELASTIC potential energy, because the material pushes or pulls back toward that shape and the stretch or the squeeze went the other way. Pushing two magnets together with like poles facing stores MAGNETIC potential energy, because they push each other apart and the squeeze went in. The same idea covers two like electric charges pushed closer together, and the chemical energy stored in the arrangement of the atoms inside a battery or a tank of fuel, which the next lesson follows through a chain. WRONG: "Nothing was lifted, so nothing is stored." CORRECT: "Nothing was lifted, so no gravitational energy is stored -- now name the other forces in the arrangement and check those."',
        },
        {
          answer: 'It is stored inside the object that is up high.',
          misconception:
            'Treating stored energy as a substance the raised object has been filled with, because the raised object is the only thing in the whole situation that visibly moved.',
          correctsTo:
            'Stored potential energy belongs to the ARRANGEMENT of at least two objects that pull or push on each other, and for a lifted object those two are the object and Earth. The amount depends on how far the object sits above the surface it could fall to, which is a fact about the pair and not about the object. Two magnets make this impossible to miss. Hold two magnets with their north poles a centimeter apart and a lot is stored; carry one of them to the far side of the room and almost nothing is stored -- and if you weigh, measure or test either magnet afterward, it is exactly the same magnet it was before. Nothing was taken out of either one, because nothing was ever in either one on its own. What changed was where they were placed relative to each other. WRONG: "The lifted object is full of energy." CORRECT: "The object and Earth, arranged that far apart, hold energy between them."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Potential energy is energy stored in the ARRANGEMENT of two or more objects that push or pull on each other. It is not sitting inside any one of them.',
        'The one rule: move the objects against the force between them and the stored energy goes up. Let the force move them and it comes back out as motion energy.',
        'Name the force and its direction first, and only then say which arrangement holds more. "Higher" is one case of the rule, not the rule.',
        'Gravitational: the same object set farther above the surface it could fall to stores more, and more mass at the same height stores more.',
        'Elastic: the farther something springy is held from its relaxed shape, the more it stores. Squeezing stores energy just as stretching does.',
        'Magnetic: two magnets pushed closer with like poles facing store more the closer they are held, because they push apart the whole way. Same rule, different force.',
        'To rank two arrangements, check how many quantities differ. If exactly one differs, the one set farther against the force stores more.',
        'If two quantities differ in opposite directions -- lighter but higher, for instance -- the honest answer is that they cannot be ranked by reasoning alone. Saying so is the right answer.',
        'A completely still object can be part of an arrangement holding a great deal of stored energy. Nothing has to be moving for energy to be stored.',
        'Twice as far does not have to mean twice as much stored. This lesson ranks arrangements; it does not put a number on one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Potential Energy: Stored by Position' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
