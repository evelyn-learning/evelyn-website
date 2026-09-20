/**
 * Grade 8 Science (Physical Science) — Conduction, Convection & Radiation.
 *
 * Row 5.2, procedure-led. One routine runs the whole lesson: name the warmer
 * thing and the cooler thing and fix the direction the energy is going, then
 * ask three questions in order -- are the two things touching, is a liquid or
 * a gas itself moving and carrying energy along, does the energy cross a gap
 * with nothing flowing across it -- and read off conduction, convection or
 * radiation. The fourth move is the check: name what is NOT doing the work,
 * and change one condition to see whether the answer moves.
 *
 * The three traps it is built to kill are (a) "cold flows in", the belief that
 * coldness is a substance that travels, which the misconception check takes
 * head on; (b) "metal is colder", which is the same error wearing a different
 * coat -- your skin reports how fast it is losing energy, not the temperature
 * of what it is touching; and (c) treating any warm air anywhere as proof of
 * convection, when convection needs the matter itself to travel.
 *
 * SCOPE GUARD: this plan explains the MECHANISM of each of the three ways
 * thermal energy moves and classifies described situations by mechanism, and
 * it states the one direction rule that sits under all three. Its scope cell
 * carries a lineage clause and NO withheld clause; per controller ruling 33
 * that absence is stated rather than invented. The lineage clause, verbatim:
 * "This is the mechanism Grade 6 withheld: mantle convection
 * (`m6sci-u4-earths-plates-and-mantle-convection.ts`), sea breezes and ocean
 * currents (`m6sci-u8-how-ocean-currents-move-heat-around-the-globe.ts`) --
 * LO descriptions read -- appear here only as examples of convection, never
 * re-taught (DCI PS3.A/PS3.B, foundational to MS-PS3-3)." Every absence
 * claimed below is claimed of the plan's AUTHORED TEXT -- the objective, the
 * segments and the metadata -- and not of this guard or of the chain loIds,
 * which necessarily name the neighboring rows. What each edge means, and what
 * is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 5.1 (temperature and thermal energy) is the
 *     previous row and is assumed, not re-taught: "thermal energy" and "heat"
 *     are restated in the vocabulary list in the same words that row settled
 *     them in, and no segment here separates an average from a total or ranks
 *     two samples by thermal energy. Row 5.3 (mass, material and temperature
 *     change) owns HOW MUCH a temperature moves: nothing in this file states
 *     an amount of energy transferred, asks how far a temperature would
 *     change, or compares two materials by how much warming a given transfer
 *     produces. Row 5.4 (insulators, conductors and thermal design) owns which
 *     materials block which mechanism and owns design evaluation: the nouns
 *     "insulator" and "conductor" appear in no authored string (the verb
 *     "conducts" appears once, in the misconception check, for what the metal
 *     bench does to energy from a hand), no device is judged against a
 *     criterion, and no design is chosen over another. Two
 *     places do compare materials, and both are deliberately allowed because
 *     the comparison IS the conduction mechanism rather than a design move --
 *     the wooden spoon in the first worked example, which is the contrasting
 *     case that shows the transfer ran through the metal, and the metal bench
 *     against the wooden bench in the misconception check, which is how the
 *     "metal is colder" error is corrected. Neither names a material as a
 *     class of material, and neither builds anything. Row 6.3 (density,
 *     thermal expansion and why warm fluids rise) owns the particle-level
 *     reason a warmed fluid is less dense: this file uses "warmer fluid is
 *     less dense than the cooler fluid around it" as a stated fact inside the
 *     convection loop and says outright that the particle-spacing reason
 *     behind it is a later lesson; it never derives it, and no volume,
 *     density value or cubic centimeter appears. Row 9.1 (what a wave is) and
 *     row 10.3 (light versus sound and the spectrum) own waves: radiation is
 *     described as energy carried by waves that need no matter, and nothing
 *     here names a kind of wave, a wavelength, a frequency or a speed.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary. The two Grade 6 phenomena the
 *     cell names appear as examples of convection and nothing else, one
 *     sentence each, inside a single key idea: warmer rock rising and cooler
 *     rock sinking in Earth's mantle, and warmer air over sunlit land rising
 *     while cooler air from over the sea moves in beneath it, with the slow
 *     sinking of cold ocean water named in the same breath. No tectonic
 *     plate, plate boundary, landform, fault, weather front, named ocean
 *     current, climate or weather system appears anywhere in the file --
 *     grepped: the word "plate" occurs only as the small warm plate that
 *     heats the tank in the second item, and "current" only inside
 *     "convection current". Nothing is said about what the mantle's loop
 *     moves or where a breeze goes next, and no item is built on any of
 *     the three examples.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above). The quantity this file
 *     stops short of is specific heat and the formula it stops short of is
 *     q = mcDeltaT: no sample is given an amount of energy, no transfer is
 *     given a rate in any unit, and no material is given a number for how well
 *     it passes energy along. The kelvin scale, absolute zero, the laws of
 *     thermodynamics, entropy and heat engines are named in no authored
 *     string, and no energy anywhere is stated in joules. On the radiation
 *     side it stops short of naming infrared or any other band of the
 *     spectrum and of any emission law relating radiated energy to
 *     temperature: "everything warm gives off some, and warmer things give off
 *     more" is the whole of what this row owns there.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every situation
 * is written out in words inside the item that uses it, including the
 * direction each thing faces and which surfaces are touching, and every item
 * is solvable from the text printed inside it. Never write "look at the
 * diagram of the convection current", and never assume the student has a
 * kettle, a tank of water or a thermometer in front of them.
 *
 * NOTE ON BURNED EXAMPLES (controller ruling 32/36): `los[0].description` is
 * student-facing and carries part (i) of the scope cell verbatim. Part (i)
 * names no concrete specimen -- only the three mechanisms in their general
 * form -- so nothing is burned by it, and the three items are free to
 * classify fresh situations. The specimens actually used are: a fire in a
 * fire pit or on a beach (hook), metal spoon in soup and wooden spoon
 * (worked example 1), pot of
 * water on a stove ring (worked example 2), toaster (item 1), warmed tank of
 * water (item 2), cold can of soda (item 3), freezer door and the two benches
 * (misconception check). No specimen is shared between a teaching segment and
 * an item; do not "helpfully" reuse one across that line in a later edit.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 5.1 -> 5.2 -> 5.3
 * (`temperature-and-thermal-energy` -> `conduction-convection-and-radiation`
 * -> `mass-material-and-temperature-change`), and both arrays below are
 * populated with those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U5_CONDUCTION_CONVECTION_AND_RADIATION: LessonPlan = {
  id: 'evelyn.ms.m8sci.conduction-convection-and-radiation.v1',
  title: 'Conduction, Convection & Radiation',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.conduction-convection-and-radiation',
      standard: 'M8SCI-5.2',
      description:
        'Explain the MECHANISM of each way thermal energy moves -- conduction as faster-moving particles bumping neighbors through contact, convection as warmer fluid rising and cooler fluid sinking in a loop, radiation as energy carried by waves needing no matter -- and classify a situation; state that energy always moves from warmer to cooler, never "cold flowing in" (NGSS DCI PS3.A, PS3.B).',
    },
  ],
  prerequisites: ['m8sci.temperature-and-thermal-energy'],
  followUps: ['m8sci.mass-material-and-temperature-change'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put all three transfer mechanisms into one scene the student has already stood in, so the lesson starts from a puzzle about three different paths rather than from three definitions.',
      script:
        'Think about the last time you stood close to a fire in a fire pit or on a beach. Three things were happening to you at once, and they were not the same thing three times over. Your face felt warm, even though the nearest flame was an arm\'s length away and nothing was touching you -- and if somebody stepped between you and the fire, your face went cool almost at once, before you could have felt any air change. Meanwhile the air straight above the flames was shimmering and streaming upward, and anything you held up there got warm fast, while the same thing held out to the side did not. And if you were toasting something on a long metal skewer, the metal in your hand slowly got warm too, minute by minute, working its way up from the hot end. One fire, three completely different routes for the same energy. Today you get the three routes by name, you get the mechanism of each one -- what the particles are actually doing -- and you get a short routine for taking any situation somebody describes to you and saying which route it is.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-mechanisms-and-the-routine',
      kind: 'concept',
      goal: 'Fix the direction rule first, build the three mechanisms as three different things the particles do, then hand over the ordered routine and the traps that sit inside it.',
      keyIdeas: [
        'ONE RULE SITS UNDER ALL THREE, AND IT ONLY RUNS ONE WAY. Thermal energy moves from the warmer thing to the cooler thing. Always, with no exceptions, and never the other way around on its own. You already have the word for it from the last lesson: heat is the name for thermal energy on the move, and an object has thermal energy rather than containing heat. The moving keeps going while there is a temperature difference and stops when the two things reach the same temperature -- which is why a drink left on a table ends up at room temperature and then stays there. Notice what that rule rules out. There is no such thing as coldness traveling from one place to another. "Cold" is simply less thermal energy, so a cold thing is not sending anything into a warm thing. WRONG: "The ice cube sends cold into the drink." CORRECT: "Thermal energy moves out of the warmer drink and into the cooler ice, and the drink cools because it is the one losing energy." Everything that follows is about HOW the energy makes that one-way trip, never about which way it goes.',
        'CONDUCTION: PASSED ALONG BY PARTICLES THAT STAY WHERE THEY ARE. Conduction needs contact. Where a warmer object touches a cooler one, the particles at the warmer surface are moving faster, and they bump into the slower particles next to them and set those moving faster. Those particles bump their own neighbors, and the energy is handed along the line, neighbor to neighbor, deeper and deeper into the cooler object. The important detail is what does NOT happen: in a solid the particles do not travel anywhere. Each one vibrates in place and passes energy on, like a whole row of people jostling shoulders without anybody walking down the row. That is why conduction works best in solids, where the particles are packed close enough to bump their neighbors constantly. Metals pass energy along this way much faster than wood or plastic does, which is worth knowing now; which materials to pick for a particular job is a later lesson.',
        'CONVECTION: THE MATTER ITSELF TRAVELS, CARRYING ITS ENERGY WITH IT. Convection happens only in fluids -- liquids and gases -- because only a fluid can flow. Warm one part of a fluid and that part becomes less dense than the cooler fluid around it. The cooler, denser fluid sinks beneath it and pushes it upward, so the warmed fluid rises, spreads out, gives up energy to whatever is cooler higher up, becomes denser again, and sinks back down to where it started. That round trip is a convection current, and the whole loop is the mechanism. Nothing about this is the fluid wanting to go anywhere: the rising happens because the cooler fluid around it sinks underneath and shoves it up. Exactly WHY warming a fluid makes it less dense -- what happens to the spacing of its particles -- is a later lesson; for today, take it as the fact that starts the loop. And keep hold of the difference that matters: in conduction the energy moves while the matter stays put, and in convection the matter carries the energy along as it goes.',
        'CONVECTION IS NOT JUST A KITCHEN EFFECT, AND YOU HAVE MET IT BEFORE. Two of the biggest examples are ones you already know by name. Earth\'s mantle is solid rock that creeps so slowly it flows like an extremely thick fluid over long stretches of time, and warmer rock rising while cooler rock sinks there is a convection loop on an enormous scale. On a sunny afternoon at the coast, the air over the land is warmed more than the air over the sea, so that warmer air rises and cooler air from over the water moves in beneath it -- the breeze you feel coming in off the sea is the bottom of a convection loop. Cold ocean water sinking while warmer water spreads out above it moves thermal energy around the globe in the same way. Those are named here as examples of one mechanism, and that is all they are needed for today; what they do to Earth is not this lesson.',
        'RADIATION: CARRIED BY WAVES, AND THE ONLY ONE THAT NEEDS NO MATTER AT ALL. Everything warm gives off energy as waves, and warmer things give off more of it. Those waves travel outward in straight lines from whatever is giving them off, and they need nothing to travel through -- no touching, no fluid, not even any air. When they land on something that absorbs them, that thing warms up. This is the only one of the three that can cross a space with no matter in it, and it is how energy from the Sun crosses the emptiness between the Sun and the Earth and warms the ground. Two consequences worth holding on to. Because the waves travel in straight lines, whatever is facing the warm object gets warmed and whatever is turned away or shadowed does not, and putting something solid in the way stops it at once. And because nothing has to flow or touch, radiation arrives immediately rather than building up over minutes the way a conduction path does.',
        'THE ROUTINE, IN ORDER, AND THE TRAPS INSIDE IT. (1) Name the warmer thing and the cooler thing, and say out loud which way the energy is going -- warmer to cooler, every time. (2) Ask whether the two are touching, directly or through a solid path joining them. If they are, and the path is solid, that is conduction. (3) Ask whether a liquid or a gas is itself moving from the warmer place to the cooler one and carrying energy along with it. If it is, that is convection. (4) Ask whether energy is arriving across a gap with nothing flowing across it. If it is, that is radiation. (5) Check the answer: say what is NOT doing the work, and change one condition to see whether the answer moves. Two traps live in the middle of this. The first is treating warm air as automatic proof of convection -- warm air only counts if the air is actually traveling to the cooler thing, so standing beside a fire rather than above it is radiation, not convection. The second is forgetting that most real situations run two or three of these at once; the routine asks which one is carrying MOST of the energy along the path the question is about, so decide which path the question means before you answer.',
      ],
      vocabulary: [
        { term: 'conduction', definition: 'the transfer of thermal energy through contact, as faster-moving particles bump their slower neighbors and pass energy along without traveling anywhere themselves.' },
        { term: 'convection', definition: 'the transfer of thermal energy by the movement of a fluid, in which warmer fluid rises, cooler fluid sinks beneath it, and the moving matter carries its energy with it.' },
        { term: 'convection current', definition: 'the loop a fluid travels in during convection: up where it is warmed, across, down where it is cooled, and back again.' },
        { term: 'radiation', definition: 'the transfer of thermal energy by waves, which travel in straight lines and need no matter to pass through, so they can cross a space with nothing in it.' },
        { term: 'fluid', definition: 'a liquid or a gas -- any substance that can flow.' },
        { term: 'heat', definition: 'thermal energy on the move from a warmer object to a cooler one. An object has thermal energy; it does not contain heat.' },
      ],
      suggestedTools: ['show_table', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-soup-spoon',
      kind: 'worked_example',
      problem:
        'A metal spoon is left standing in a bowl of hot soup, with the bowl-end of the spoon down in the soup and the handle sticking up into the air, touching nothing else. After a minute the handle is too warm to hold comfortably, and the warmth arrived gradually -- the part nearest the soup warmed first, then the middle, then the very end. Which mechanism carried the energy to the handle, and how do you know it was that one?',
      steps: [
        'Step 1, name the warmer thing, the cooler thing and the direction. The soup is the warmer thing and the spoon started out at room temperature, so it is the cooler thing. Thermal energy is moving out of the soup and into the spoon, and then along the spoon toward the handle. That direction is fixed before any mechanism is chosen, and it never runs the other way.',
        'Step 2, ask about contact. The soup is touching the bowl-end of the spoon, and the spoon is one unbroken piece of solid metal from that end to the handle. So there is a solid path joining the warm soup to the cool handle. That is a conduction path, and it is the obvious candidate.',
        'Step 3, ask about a moving fluid along that path. Is any liquid or gas carrying energy from the soup up to the handle? No. The metal of the spoon is a solid, and its particles vibrate in place rather than traveling up the handle. There is convection inside the soup itself, where warmer soup rises and cooler soup sinks, but that loop stays in the bowl; it is not what delivers energy to the far end of the handle.',
        'Step 4, ask about a gap. Is energy arriving across a gap with nothing flowing across it? The handle is in the air, and the hot soup does radiate some energy to everything near it. But the handle is warmed most on the stretch nearest the soup and least at the far end, and the warmth worked its way along the metal over a minute rather than arriving the instant the spoon went in. Radiation arrives immediately and warms whatever faces the warm object; being joined by metal is what made this handle special. So radiation is happening, and it is not what is doing the work here. The answer is conduction.',
        'WRONG: "The hot soup rose up the spoon and warmed the handle." CORRECT: "No soup went up the spoon. The soup\'s particles bumped the metal particles at the bowl-end, those bumped their neighbors, and the energy was handed along the metal to the handle while every metal particle stayed where it was." Conduction moves energy through matter that stays put; that is the whole difference between it and convection.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The contact inventory says there is an unbroken solid path from the soup to the handle and no fluid moving along it. The TIMING agrees from a second direction: the warmth took about a minute and moved along the spoon end to end, which is what handing energy along a line of particles looks like and is not what a wave crossing a gap looks like. And the GEOMETRY agrees from a third: the handle is warm all the way around, not just on the side facing the soup, which is what you get from energy arriving through the metal and not from waves arriving from one direction. Three different kinds of evidence, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Swap the metal spoon for a wooden one of the same shape, left in the same soup for the same minute. The wooden handle stays cool enough to hold. Nothing else changed -- same soup, same temperature, same air around it, same shape standing in the same bowl -- so whatever is doing the warming has to be something that travels through the material of the spoon. If radiation from the soup had been warming the handle, it would have warmed the wooden handle just as well. The answer moved when the material moved, so the path runs through the material, and that is conduction.',
      ],
      answer:
        'Conduction. The soup touches the bowl-end of the spoon and the spoon is one solid piece of metal, so the soup\'s particles set the metal particles at that end moving faster, those bump their neighbors, and the energy is handed along the metal to the handle while the metal itself stays where it is. The gradual, end-to-end arrival of the warmth and the fact that a wooden spoon in the same soup stays cool both confirm it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pot-on-the-stove',
      kind: 'worked_example',
      problem:
        'A metal pot of cool water is set on a stove ring, and the ring is switched on and becomes hot. The flat base of the pot rests directly on the ring. After a short while the water at the very top of the pot is warm, even though only the bottom is being heated, and the water is seen to be moving: it rises above the middle of the base, spreads across the surface, sinks down near the walls of the pot, and travels back along the base toward the middle. Run the routine on two separate paths: first the path from the ring into the metal base, and then the path from the base up to the water at the top.',
      steps: [
        'Path one, step 1. The warmer thing is the stove ring and the cooler thing is the metal base of the pot, so thermal energy is moving from the ring into the base. Step 2, contact: the base is resting directly on the ring, metal against metal, with the two surfaces pressed together. Step 3, a moving fluid along that path: none, because both are solids. Step 4, a gap: none, because they are touching. Path one is conduction -- the ring\'s particles bump the base\'s particles, and the energy is handed along into and through the metal while the metal stays where it is.',
        'Path two, step 1. Now the warmer thing is the pot base and the cooler thing is the water at the top of the pot, and thermal energy is moving upward from the base to the top. Step 2, contact: the base touches only the water lying right against it, not the water at the top, so conduction alone would have to hand the energy up particle by particle through the whole depth of the water. Step 3, a moving fluid: yes, and the description says so directly -- the water rises above the middle of the base, crosses the surface, sinks near the walls, and returns along the base. The matter itself is making a round trip. Path two is convection.',
        'Say the mechanism of path two properly, because this is the part that gets stated backward. The water lying on the base is warmed first, and warmed water is less dense than the cooler water around it. The cooler, denser water beside it sinks underneath and pushes it upward. It rises to the surface, spreads out, gives up energy to the cooler water and the air up there, becomes denser again, and sinks back down near the walls -- then travels along the base to the middle and is warmed again. That closed round trip is a convection current, and it is why the top of the pot warms long before conduction through still water could have carried anything that far.',
        'WRONG: "The warm water rises because heat rises, and warm water wants to get away from the hot base." CORRECT: "Warmed water is less dense than the cooler water around it, so the cooler, denser water sinks beneath it and pushes it up." Water does not want anything, and it is not the warmth that rises on its own -- it is a quantity of warmed water being pushed up by cooler water sinking underneath it. Getting this right matters, because the pushing is what makes it a loop: something has to come down for anything to go up.',
        'Step 5 for both paths, name what is NOT doing the work. Radiation is not carrying either of these: the ring and the base are touching, so nothing has to cross a gap, and inside the water there is matter everywhere along the path and the matter is visibly moving. The hot ring does radiate energy to the room, and the outside of the pot does too, but neither of those is on either path the question asked about. This is the trap the routine is built to catch -- almost every real situation has more than one mechanism running, so the first job is deciding which path is being asked about.',
        'Now run the two checks. First, three clues of DIFFERENT KINDS agree that path two is convection. The observation of the matter itself: the water is making a complete round trip, which conduction cannot produce because conducting particles stay put. The pattern of warming: the TOP warms early while the corners of the base are still the coolest part of the water, which is the shape of a loop and not the shape of energy spreading outward evenly from the base. And the speed: the top warms within a short while, far sooner than energy handed along particle by particle through that whole depth of still water would arrive. Second, change one condition and check that the answer moves. Freeze the pot of water solid first, then set it on the same ring. Now nothing can flow, no loop can form, and the only route left is particle-to-particle handing along through the ice -- conduction -- and the top takes far longer to warm. One condition changed, and the mechanism and the timing both changed with it. That is the proof that the flowing was doing the work.',
      ],
      answer:
        'Path one, ring to base, is conduction: two solids pressed together, particles bumping their neighbors, no gap and no flow. Path two, base to the water at the top, is convection: water warmed at the base is less dense, the cooler and denser water sinks beneath it and pushes it up, it spreads across the surface, cools, sinks near the walls and returns along the base, and the moving water carries its energy with it. Freeze the water first and the loop is impossible, leaving only slow conduction -- which is how you know the flow was carrying the energy.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-toaster',
      kind: 'try_yourself',
      problem:
        'A toaster has a wire inside it that glows orange while the toaster is on. A slice of bread stands in the slot facing that wire, with a gap of about one centimeter of air between the bread and the wire, and the bread touches the wire nowhere. The side of the bread facing the wire browns quickly and evenly from top to bottom, while the side turned away from the wire browns far less. Which mechanism is carrying most of the energy to the bread, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Conduction, because the air in the gap is touching both the glowing wire and the bread, so the air particles next to the wire speed up, bump the particles beside them, and hand the energy across that centimeter to the bread faster than any other route could.' },
        { id: 'b', text: 'Convection, because the air in the gap is warmed by the wire and then rises, and that moving air carries the energy along with it and delivers it to the bread as it flows past the slice.' },
        { id: 'c', text: 'None of the three, because the orange glow is light rather than thermal energy and the two are separate things, so the browning must be coming from the dry air already sitting inside the toaster rather than from the wire at all.' },
        { id: 'd', text: 'Radiation, because the energy crosses the gap as waves that need no matter to travel through, which is also why the whole facing side browns evenly while the side turned away from the wire does not.', correct: true },
      ],
      expectedAnswer: 'Radiation, because the energy crosses the gap as waves that need no matter to travel through, which is also why the whole facing side browns evenly while the side turned away from the wire does not.',
      hints: [
        'Start with the contact question and then the flow question. Nothing is touching the wire, so conduction along a solid path is out. Now think about which way warmed air goes: if moving air were doing the delivering, would the bread brown evenly from top to bottom, or would the top brown first?',
        'One of the three mechanisms travels in straight lines from whatever gives it off and needs nothing at all to travel through. Which one is that, and does it explain why the facing side browns and the far side does not?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-warmed-tank',
      kind: 'try_yourself',
      problem:
        'A tall glass tank is filled with still water at room temperature, with tiny specks of a fine powder mixed evenly through it so that any movement of the water can be followed. A small warm plate is pressed against one corner of the tank floor and left there. Over the next few minutes the specks above that corner travel upward, then across the surface, then down the far side, then back along the floor toward the warm corner. The water near the surface becomes warm well before the far bottom corner does. Which mechanism is carrying most of the energy through the water, and which statement of the reason is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Convection, because the water itself is moving in a loop: the water warmed at the corner is less dense than the cooler water around it, so that cooler and denser water sinks beneath it and pushes it up, and the moving water carries its energy along with it.', correct: true },
        { id: 'b', text: 'Conduction, because the water is one connected body of matter with no gaps anywhere in it, so the only route available is for each particle to bump the particles beside it and hand the energy along from neighbor to neighbor through the whole tank.' },
        { id: 'c', text: 'Radiation, because the warm plate gives off waves that travel straight upward through the water to the surface, which is exactly why the surface becomes warm well before the far bottom corner does.' },
        { id: 'd', text: 'All three are carrying about the same amount, because a warm surface always hands energy along by contact, always sets the fluid above it moving, and always gives off waves, so there is no way to pick out one of them as the main route.' },
      ],
      expectedAnswer: 'Convection, because the water itself is moving in a loop: the water warmed at the corner is less dense than the cooler water around it, so that cooler and denser water sinks beneath it and pushes it up, and the moving water carries its energy along with it.',
      hints: [
        'The specks are doing the most useful thing in this description. Ask what they tell you about whether the matter is staying put or making a round trip, and remember which mechanism requires the matter itself to travel.',
        'Then check the reasoning as well as the name. Something has to come down for anything to go up: which choice says what pushes the warmed water upward, rather than leaving it to rise on its own?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cold-can',
      kind: 'try_yourself',
      problem:
        'You take a can of soda out of the refrigerator and wrap both hands tightly around it, palms flat against the metal. Within a minute your hands feel cold, and the can is no longer as cold as it was when you picked it up. Which statement correctly describes what moved, which way it moved, and by which mechanism?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cold moved out of the can and into your hands by conduction, which is why your hands feel cold, and the can is less cold now because some of the cold it started with has left it and gone into your skin.' },
        { id: 'b', text: 'Thermal energy moved from your warmer hands into the cooler can by conduction through the surfaces that are touching, and your hands feel cold because they are the ones losing energy, not because anything cold arrived in them.', correct: true },
        { id: 'c', text: 'Thermal energy moved from your hands into the can by radiation, because your warm hands give off waves the whole time and the metal absorbs them, and pressing your palms flat against the can simply lets those waves arrive sooner.' },
        { id: 'd', text: 'Thermal energy moved from your hands into the can by convection, because the thin layer of air trapped between your palms and the metal is warmed by your skin, rises, and carries the energy to the can as it flows.' },
      ],
      expectedAnswer: 'Thermal energy moved from your warmer hands into the cooler can by conduction through the surfaces that are touching, and your hands feel cold because they are the ones losing energy, not because anything cold arrived in them.',
      hints: [
        'Fix the direction before you pick a mechanism. Which of the two is warmer, your hands or the can just out of the refrigerator? Thermal energy only ever goes one way between them, and there is nothing else that travels.',
        'Now the mechanism. Your palms are flat against the metal, so there is no gap for waves to cross and no room for a layer of air to flow anywhere. What is left when two things are simply touching?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cold-does-not-travel',
      kind: 'misconception_check',
      question:
        'A student writes: "When I open the freezer I can feel the cold pouring out over my feet, so cold really does flow. And that is also why the metal bench in the park is colder than the wooden bench next to it -- metal is just a colder material." Two separate things have gone wrong here. What are they?',
      commonErrors: [
        {
          answer: 'Cold flows out of the freezer, so cold is something that travels.',
          misconception:
            'Treating coldness as a substance that can move from place to place, because opening a freezer really does produce a wave of chilly air across your feet, and the simplest reading of that feeling is that something cold came out.',
          correctsTo:
            'Something does move, and it is worth being exact about what. The AIR inside the freezer moves: it is cold, and cold air is denser than the warmer air of the kitchen, so it sinks out of the open door and spreads across the floor while warmer kitchen air flows in above it. That is air traveling and carrying its low energy with it, which is convection, and air is matter. What does NOT move is "cold" by itself, because coldness is not a substance -- it is simply having less thermal energy. In energy terms the traffic runs the other way entirely: thermal energy moves out of the warm kitchen and into the cold freezer, because thermal energy always moves from warmer to cooler, which is exactly why the freezer has to keep running to stay cold once the door is open. WRONG: "Cold poured out onto my feet." CORRECT: "Cold air sank out onto my feet, and at the same time thermal energy moved from the warm kitchen into the cold freezer. The air traveled; coldness is not a thing that can travel."',
        },
        {
          answer: 'The metal bench is colder than the wooden bench, so metal is a colder material.',
          misconception:
            'Reading the feeling in your hand as a reading of the bench\'s temperature, when what your skin actually reports is how fast it is losing thermal energy.',
          correctsTo:
            'The two benches have been standing side by side in the same air all night, so they are at the same temperature -- a thermometer laid on each one would read the same. Both are cooler than your hand, so thermal energy moves out of your hand and into whichever bench you touch. The difference is the rate. Metal passes energy along from particle to particle far faster than wood does, so the metal draws energy out of your palm quickly and carries it away into the rest of the bench, while the wood takes it slowly and the little it takes stays near the surface. Your skin does not measure temperature; it measures how fast it is losing energy, so the fast one feels colder. WRONG: "The metal bench is at a lower temperature." CORRECT: "Both benches are at the same temperature. The metal conducts energy out of my hand faster, so my hand cools faster and reports that as colder." The same effect run the other way is worth noticing: on a hot day in full sun, when both benches are warmer than your hand, the metal one feels far hotter for exactly the same reason.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Thermal energy always moves from the warmer thing to the cooler thing, and it keeps moving until they reach the same temperature. Coldness is not a substance and never travels.',
        'Conduction: contact. Faster particles bump their slower neighbors and hand the energy along, while the particles themselves stay where they are. Best in solids; metals pass it along much faster than wood or plastic.',
        'Convection: a fluid flows. Warmed fluid is less dense, the cooler and denser fluid around it sinks beneath it and pushes it up, then it cools, becomes denser and sinks again -- a convection current. Here the matter itself carries the energy.',
        'Radiation: waves. They travel in straight lines, need no matter at all, and can cross a space with nothing in it, which is how energy from the Sun reaches the ground. Everything warm gives off some, and warmer things give off more.',
        'The difference that decides most questions: in conduction the matter stays put and the energy moves through it; in convection the matter travels and takes the energy with it.',
        'The routine: name the warmer thing and the cooler thing, then ask in order whether they are touching, whether a fluid is flowing from one to the other, and whether energy is crossing a gap with nothing flowing across it.',
        'Warm air near something is not by itself proof of convection. The air has to be traveling to the cooler thing for convection to be the answer -- beside a fire is radiation, above it is convection.',
        'Most real situations run two or three mechanisms at once, so decide which path the question is asking about, then say which mechanism is carrying most of the energy along that path.',
        'What your skin reports is how fast it is losing thermal energy, not the temperature of what it is touching. That is why metal at the same temperature as wood feels colder.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Conduction, Convection & Radiation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
