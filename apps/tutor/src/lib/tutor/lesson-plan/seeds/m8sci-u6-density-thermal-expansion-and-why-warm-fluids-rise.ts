/**
 * Grade 8 Science (Physical Science) — Density, Thermal Expansion & Why Warm
 * Fluids Rise.
 *
 * Row 6.3, concept-led. There is no procedure to run here beyond one
 * division: the lesson builds a single chain of reasoning -- density is the
 * mass packed into each bit of space, warming a fluid spreads its particles
 * apart so the same mass takes more room, and a parcel of fluid whose density
 * has fallen ends up above the denser fluid around it because that denser
 * fluid sinks under it -- and then makes the chain survive the two intuitions
 * that compete with it.
 *
 * The two traps it is built to kill are (a) heavy-sinks-light-floats, the
 * collapse of density into mass, which the misconception check takes head on
 * with a steel bolt and a steel ship, and (b) particles-expand, the belief
 * that warming makes each particle bigger rather than pushing the same
 * particles farther apart.
 *
 * SCOPE GUARD: this plan does three things and stops. It divides a stated
 * mass by a stated volume and COMPARES the results; it explains what warming
 * does to a fluid volume and so to its density; and it explains why the less
 * dense part of a fluid ends up above the denser part. Its scope cell's
 * lineage and withheld clauses, verbatim: "the particle-level 'why' behind
 * convection in 5.2 and behind Grade 6's mantle-convection and ocean-current
 * lessons, which are referenced, not re-taught (shares MS-PS1-4 with 6.2 as a
 * coarse split: that lesson is the change-of-state consequence of adding
 * thermal energy, this one is the volume/density consequence)"; "Withholds
 * buoyant force and Archimedes' principle (`ap-physics2-fluids.ts`; sign-off
 * 10) and density-as-conversion-factor arithmetic
 * (`chem-u1-density-dimensional-analysis.ts`)." Both parts are present in the
 * cell; neither had to be supplied. Every absence claimed below is claimed of
 * the plan's AUTHORED TEXT -- the objective, the segments and the metadata --
 * and not of this guard or of the chain loIds, which necessarily name the
 * neighboring rows. What each edge means, and what is deliberately ALLOWED
 * there:
 *   - GRADE 8 NEIGHBORS. Row 6.2 (changes of state and thermal energy) is the
 *     previous row and shares MS-PS1-4 with this one, split coarsely: 6.2
 *     owns what adding thermal energy does to the STATE, this row owns what
 *     it does to the VOLUME. The split is held strictly. No sample in this
 *     file melts, freezes, boils, evaporates or condenses as part of the
 *     reasoning; no temperature plateau is mentioned; and the one place a
 *     change of state appears at all is a distractor in the second item,
 *     where "some of the fluid boiled into gas" is the named error and the
 *     sealed pouch rules it out. The single deliberate exception is the ice
 *     sentence in the third key idea and the last recap line -- ice is less
 *     dense than liquid water, so a solid is not always denser than its
 *     liquid -- which is a DENSITY fact about water and says nothing about
 *     what the temperature does while the freezing happens.
 *     Row 6.1 (the particle model and the states of matter) is assumed, not
 *     re-taught: "particles", "move faster" and "spread apart" are used as
 *     words the student already holds, and particle behavior is never sorted
 *     by state. Row 6.4 (characteristic properties identify a substance) is
 *     the next row and is not entered: no density here is used to identify
 *     anything, every sample is left unnamed, and the phrase "characteristic
 *     property" appears nowhere. Row 5.1 (temperature and thermal energy) is
 *     assumed for "warmer means the particles move faster on average"; no
 *     average-versus-total distinction is drawn and no sample is compared by
 *     thermal energy. Row 5.2 (conduction, convection and radiation) owns the
 *     transfer mechanisms: the word convection appears exactly once in the
 *     authored text, in the fourth key idea, where it is named as the word
 *     for the circulation and immediately handed to that lesson; the words
 *     conduction and radiation appear in no authored string; and no situation
 *     anywhere in this file is classified by transfer mechanism.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: hot mantle rock is named in one
 *     key idea and nowhere else, as one example of the same density
 *     difference at a very large scale, and it is kept qualitative -- no rate
 *     and no distance is given for it. Deep ocean water is mentioned in one
 *     clause of that same key idea, with where it goes handed to another
 *     lesson. No plate, boundary, landform, earthquake, volcano or named
 *     current appears in the authored text, and no weather, front, water
 *     cycle or climate appears anywhere in it.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears in the authored text.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics is the course above): the words buoyant,
 *     buoyancy and Archimedes appear in no authored string, no force anywhere
 *     is given a name, a size or a unit, and the only pushing described is
 *     the plain statement that denser fluid sinking under a less dense parcel
 *     pushes that parcel up. The ship in the hook and in the misconception
 *     check stays up because the ship as a whole, air included, is less dense
 *     than water; that is the whole of the explanation offered, and the
 *     buoyant force that actually holds it there is the quantity this file
 *     stops short of. Upward into chemistry, the file stops short of density
 *     used as a CONVERSION FACTOR: every density here is reached by dividing
 *     a stated mass by a stated volume and is then only compared against
 *     another density -- never multiplied by a volume to find a mass, never
 *     divided into a mass to find a volume -- and no significant-figure rule
 *     is mentioned. No gas law and no pressure-volume-temperature
 *     relationship appears: the pouches swell, and why a sealed fluid pushes
 *     on its container is never raised. No energy is stated in joules and
 *     q = mcDeltaT does not appear.
 *   - THE FORMULA CEILING, AND A CONFLICT WITH THE CONTRACT. The fan-out
 *     contract's unit rule allows exactly three formulas in this course and
 *     says that no other formula appears "in words or in symbols". This row's
 *     scope cell REQUIRES comparing 10 grams in 5 cubic centimeters against
 *     10 grams in 20 cubic centimeters, which cannot be done without mass per
 *     volume. The curriculum row wins, so mass per volume is taught -- but in
 *     WORDS only ("divide the mass by the volume", "grams in every cubic
 *     centimeter"). No symbolic density formula is written anywhere in this
 *     file, and the three allowed formulas do not appear either, because no
 *     speed, force or wave is in scope here.
 *
 * BURNED SPECIMENS (controller ruling 32). The objective is student-facing,
 * so the concrete examples it names cannot be used as items: the 10 grams in
 * 5 cubic centimeters against 10 grams in 20 cubic centimeters comparison,
 * and the bare facts that warm air, warm water and warm mantle rock rise
 * while cooler material sinks. All three items were built fresh. Do not
 * "helpfully" move one of those examples into an item later. The third item
 * deliberately tests the case the objective does NOT state -- a fluid warmed
 * at the TOP, where the less dense fluid is already above the denser fluid
 * and so nothing is pushed anywhere.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every sample
 * is written out in words with its mass in grams and its volume in cubic
 * centimeters stated inside the item itself, and every item is solvable from
 * the text printed inside it. Never write "read the density off the table",
 * and never assume the student has a balance, a measuring cylinder or a
 * heater in front of them. Sample L and Sample R are unnamed fluids with
 * invented round numbers, and each one says inside its own text that its
 * numbers are picked for easy arithmetic -- that sentence is there so no
 * student reads a real expansion size off a made-up sample, and it should
 * not be deleted.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 6.2 -> 6.3 ->
 * 6.4 (`changes-of-state-and-thermal-energy` ->
 * `density-thermal-expansion-and-why-warm-fluids-rise` ->
 * `characteristic-properties-identify-a-substance`), and both arrays below
 * are populated with those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U6_DENSITY_THERMAL_EXPANSION_AND_WHY_WARM_FLUIDS_RISE: LessonPlan = {
  id: 'evelyn.ms.m8sci.density-thermal-expansion-and-why-warm-fluids-rise.v1',
  title: 'Density, Thermal Expansion & Why Warm Fluids Rise',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.density-thermal-expansion-and-why-warm-fluids-rise',
      standard: 'M8SCI-6.3',
      description:
        'Explain density as how much mass is packed into a given volume (compare samples: 10 grams in 5 cubic centimeters is denser than 10 grams in 20 cubic centimeters), explain that warming a fluid makes its particles move faster and spread apart so the same mass takes more volume and the fluid becomes LESS dense, and use that to explain why warm air, warm water and warm mantle rock rise while cooler material sinks (NGSS MS-PS1-4).',
    },
  ],
  prerequisites: ['m8sci.changes-of-state-and-thermal-energy'],
  followUps: ['m8sci.characteristic-properties-identify-a-substance'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two everyday puzzles side by side -- the air at the ceiling being warmer than the air at the floor, and a steel ship staying up while a steel bolt sinks -- so the student wants one idea that settles both.',
      script:
        'Next time you are in a room with the heating on, stand up tall and then crouch down on the floor. The air near the ceiling is noticeably warmer than the air around your feet, even though the heater is down at floor level. Nobody carried that warm air up there. It went. Now take a second puzzle, and it looks like it has nothing at all to do with the first one. Drop a steel bolt into a sink full of water and it goes straight to the bottom. A cargo ship is built out of far more of the same steel, and it sits on the ocean all day without sinking. More steel, and it stays up. Most people answer that second puzzle with "heavy things sink and light things float", and that answer cannot be right, because the ship is the heavier of the two by an enormous margin. One single idea settles both puzzles, and it is not how heavy a thing is. It is how much mass is packed into each bit of space. By the end of today you will be able to say why the warm air ended up at the ceiling, why the ship stays up, and what warming a fluid actually does to the particles inside it.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-density-and-expansion',
      kind: 'concept',
      goal: 'Install density as mass per volume, separate it from mass and from size, show what warming does to a fluid volume and so to its density, and give the honest causal sentence for why the less dense part of a fluid ends up on top.',
      keyIdeas: [
        'DENSITY IS HOW MUCH MASS IS PACKED INTO EACH BIT OF SPACE. Two measurements decide it. One is how much matter the sample contains, which we measure as its mass in grams. The other is how much room that matter takes up, which we measure as its volume in cubic centimeters. To get the density, divide the mass by the volume, and the answer comes out in grams per cubic centimeter -- the number of grams sitting in every single cubic centimeter of the sample. A sample with a mass of 40 grams that takes up 8 cubic centimeters has 5 grams in every cubic centimeter, so its density is 5 grams per cubic centimeter. Water is the one worth holding on to: the density of water is about 1 gram per cubic centimeter, so one cubic centimeter of water holds about one gram of water.',
        'DENSITY IS NOT MASS, AND IT IS NOT SIZE. This is the part that takes real work, because in everyday speech "dense" and "heavy" are used to mean almost the same thing, and they are not. A sample can have a large mass and a low density: a beach ball blown up full of air has more mass than a small glass marble, and the marble is the denser of the two by an enormous margin, because the beach ball spreads its small amount of matter through a huge volume. A sample can also have a small mass and a high density, which is exactly what the marble is. And here is the test that separates density from mass every time: density does not depend on how much of a sample you have. Cut a block cleanly in half and each half has half the mass and half the volume, so the grams in every cubic centimeter are exactly what they were. Mass changes when you cut. Volume changes when you cut. Density does not.',
        'WARMING A FLUID SPREADS ITS PARTICLES OUT, AND THAT IS ALL IT DOES TO THEM. A fluid is anything that flows and takes the shape of its container -- a liquid or a gas. Warm a fluid and its particles move faster, and faster particles knock one another farther apart, so on average there is more space between them than there was. Two things follow, and you should say them separately. The mass does not change, because no particles were added and none were taken away; every particle that was there is still there. The volume goes up, because those same particles now need more room. Same mass, bigger volume, fewer grams in every cubic centimeter: the fluid has become LESS DENSE. That spreading out is called thermal expansion, and cooling runs it backward -- the particles slow down, crowd closer, the volume shrinks and the density goes up. WRONG: "Heating makes each particle swell up to a bigger size." CORRECT: "Every particle stays exactly the same size. What changes is how fast they move and how far apart they sit." One caution about water, because it is the exception people meet first: when liquid water freezes it EXPANDS, so ice is less dense than liquid water and floats on it. Never say that a solid is always denser than its liquid.',
        'NOTHING RISES BECAUSE IT WANTS TO. Put a warmed, less dense parcel of fluid next to the cooler, denser fluid around it, and here is what actually happens. The cooler fluid has more mass in every cubic centimeter, so it sinks, and as it sinks it slides underneath the warmed parcel and pushes that parcel up. The warm part going up and the cool part coming down are one single exchange, not two separate events, and you cannot have either half without the other. That is the answer to the room at the start: the heater warmed the air down at floor level, that air became less dense, and the cooler air filling the rest of the room sank under it and pushed it toward the ceiling. WRONG: "Warm air rises because it is trying to get away from the heater." CORRECT: "Warm air is less dense than the cooler air around it, so the cooler air sinks under it and pushes it up." When that exchange keeps going round and round inside a fluid it has a name -- convection -- and how it carries thermal energy from place to place is a separate lesson. This lesson is about the density difference that starts it.',
        'THE SAME SENTENCE WORKS AT EVERY SIZE. In a room, air warmed near the floor ends up near the ceiling, because the cooler air comes down and takes its place. In the ocean, water that is colder is denser than the water above it and sinks beneath it, setting slow movements going that a separate lesson follows. And far below your feet, in the layer of rock called the mantle, the rock is hot enough to creep along like something thick and slow rather than snapping like a brittle solid; hotter mantle rock is less dense than the cooler rock around it and moves upward, while cooler, denser rock sinks. Three wildly different sizes, from a bedroom to the inside of a planet, and the sentence you say about each of them is word for word the same one. It is the density difference that does the work, and how big the thing is makes no difference at all to the reasoning.',
        'HOW TO ANSWER ANY DENSITY QUESTION IN THIS LESSON. First, name the two things you are comparing, and check that you have the mass AND the volume of each of them -- or, if only one thing is being changed, check what happened to its mass and what happened to its volume. Second, if you have numbers, divide each mass by its own volume and read off the grams in every cubic centimeter, keeping each sample\'s two numbers together. If you do not have numbers, ask the two questions separately: did the mass change, and did the volume change? Third, say which one is denser, and say it as "more grams in every cubic centimeter", never as "heavier". Fourth, if the question is about a fluid, finish the sentence: the denser fluid sinks, slides underneath, and pushes the less dense fluid up above it. Getting the first step right is most of the work, because a question that hands you two masses and no volumes has not told you which sample is denser.',
      ],
      vocabulary: [
        { term: 'density', definition: 'how much mass is packed into each unit of volume; the mass of a sample divided by its volume, given here in grams per cubic centimeter.' },
        { term: 'volume', definition: 'how much room a sample takes up, measured here in cubic centimeters.' },
        { term: 'mass', definition: 'the amount of matter in a sample, measured here in grams. Warming or cooling a sealed sample does not change it.' },
        { term: 'fluid', definition: 'anything that flows and takes the shape of its container -- a liquid or a gas.' },
        { term: 'thermal expansion', definition: 'the growth in a sample\'s volume when it is warmed, caused by its particles moving faster and spreading farther apart, and never by the particles themselves growing.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-samples',
      kind: 'worked_example',
      problem:
        'Three samples sit on a bench, all of them at the same temperature. Sample A has a mass of 48 grams and takes up 6 cubic centimeters. Sample B has a mass of 48 grams and takes up 16 cubic centimeters. Sample C has a mass of 120 grams and takes up 15 cubic centimeters. Put the three in order from densest to least dense. Then answer a second question: is the sample with the largest mass the densest one?',
      steps: [
        'Set up the one calculation you need, and run it three times. For each sample, the question is how many grams sit in every single cubic centimeter of it, and you get that by dividing the mass by the volume. Keep each sample\'s two numbers together and never mix one sample\'s mass with another sample\'s volume.',
        'Sample A: 48 grams divided by 6 cubic centimeters gives 8 grams per cubic centimeter. Sample B: 48 grams divided by 16 cubic centimeters gives 3 grams per cubic centimeter. Sample C: 120 grams divided by 15 cubic centimeters gives 8 grams per cubic centimeter.',
        'Read the three answers off. Sample A and Sample C both hold 8 grams in every cubic centimeter, so they are equally dense, and they are the densest. Sample B holds 3 grams in every cubic centimeter and is the least dense of the three. The order from densest to least dense is Sample A and Sample C tied, then Sample B.',
        'Now the second question, and it is the one that catches people out. Sample C has by far the largest mass -- 120 grams against 48 grams -- and it is not denser than Sample A. It is exactly as dense. WRONG: "Sample C has the most mass, so Sample C must be the densest." CORRECT: "Sample C has the most mass AND the most room to spread that mass through, and the two grew together, so the grams in every cubic centimeter came out the same." Look at both numbers at once: 48 grams times 2.5 is 120 grams, and 6 cubic centimeters times 2.5 is 15 cubic centimeters. Sample C is two and a half Sample A\'s, and two and a half of something is packed exactly as tightly as one of it.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree that Sample A and Sample C are equally dense. The division says so: both come out at 8 grams per cubic centimeter. A same-volume comparison says so a second way, and it does not use the division at all -- take a 6 cubic centimeter piece out of Sample C, and since every cubic centimeter of Sample C holds 8 grams, that piece holds 8 times 6, which is 48 grams, exactly the mass of the whole of Sample A in exactly the same volume. And a sample-size test says so a third way: take a third of Sample C, which is 40 grams filling 5 cubic centimeters, and divide -- 40 grams divided by 5 cubic centimeters is 8 grams per cubic centimeter again. Cutting the sample did not move the number, which is what density does and what mass does not. Three different kinds of check, one answer.',
        'Second, change one thing and check that the answer moves the way it should. Leave Sample C with its 120 grams, but suppose it had taken up 40 cubic centimeters instead of 15. Now 120 grams divided by 40 cubic centimeters is 3 grams per cubic centimeter, so Sample C would be tied with Sample B as the LEAST dense sample on the bench -- with exactly the mass it had before. The mass never moved. The volume moved, and the answer moved with it, which is the sign that the volume was pulling its weight in the reasoning all along.',
      ],
      answer:
        'Sample A and Sample C are equally dense at 8 grams per cubic centimeter, and Sample B is the least dense at 3 grams per cubic centimeter, so the order from densest to least dense is Sample A and Sample C tied, then Sample B. No, the sample with the largest mass is not the densest: Sample C has two and a half times the mass of Sample A and two and a half times the volume, so the two of them pack their matter exactly as tightly as each other.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-warmed-pouch',
      kind: 'worked_example',
      problem:
        'Sample L is a fluid. Its numbers are picked to keep the arithmetic easy, and the swelling described here is drawn far larger than any real liquid would show. A sealed, stretchy pouch holds 300 grams of Sample L, and at room temperature the fluid inside takes up 100 cubic centimeters. The pouch is left somewhere warm. Nothing is added to it and nothing leaks out of it. When the fluid has warmed all the way through, the pouch has swelled and the fluid inside takes up 120 cubic centimeters. What has happened to the mass, the volume and the density of Sample L? And if that warmed pouchful were released gently in the middle of a deep tank of Sample L at room temperature, would it move up or down?',
      steps: [
        'Start with the mass, because it is the one that does not move. The pouch is sealed: nothing was added and nothing leaked out, so every particle that was inside at the start is still inside at the end. The mass is 300 grams before and 300 grams after. Warming a fluid does not add matter to it.',
        'Now the volume. It went from 100 cubic centimeters to 120 cubic centimeters. Why? The particles are moving faster than they were, so they knock one another farther apart, and the same particles now need more room to move in. WRONG: "The particles got bigger, so the fluid got bigger." CORRECT: "Every particle is exactly the same size it always was. It is the spaces between them that got bigger."',
        'Now the density, which is only those two numbers put together. Before: 300 grams divided by 100 cubic centimeters is 3 grams per cubic centimeter. After: 300 grams divided by 120 cubic centimeters is 2.5 grams per cubic centimeter. The same 300 grams is now spread through more room, so every cubic centimeter of it holds less. The density fell from 3 grams per cubic centimeter to 2.5 grams per cubic centimeter.',
        'Now the last question. The room-temperature Sample L filling the tank is still at 3 grams per cubic centimeter, and the warmed fluid is at 2.5 grams per cubic centimeter, which is less. So the room-temperature fluid, with more mass in every cubic centimeter, sinks underneath the warmed fluid and pushes it up. The warmed fluid moves upward -- not because it is trying to, and not because warmth travels upward, but because denser fluid went under it.',
        'Now run the two checks. First, three clues of DIFFERENT KINDS that agree the density went down. The inventory clue: the mass is pinned at 300 grams by the seal while the volume grew, and a fixed amount of matter spread over a growing amount of room can only thin out. The arithmetic clue: 3 grams per cubic centimeter before and 2.5 grams per cubic centimeter after, worked out from the stated numbers. And the particle clue, which uses no numbers at all: the same particles are now spread through 120 cubic centimeters instead of 100, so any cubic centimeter you pick out contains fewer of them than it used to. An inventory, a division and a picture of the particles, all pointing the same way.',
        'Second, change one thing and check that the answer moves. Put the same sealed pouch in a refrigerator instead of a warm room. Now the particles slow down, they crowd closer together and the pouch shrinks -- say to 75 cubic centimeters. The mass is still 300 grams, because the pouch is still sealed, so the density is 300 grams divided by 75 cubic centimeters, which is 4 grams per cubic centimeter. That is MORE than the 3 grams per cubic centimeter of the room-temperature fluid in the tank, so this time the pouchful would sink instead of being pushed up. One condition changed -- warmed became cooled -- and the answer turned right around, which is how you know the density was doing the work and not something else.',
      ],
      answer:
        'The mass is unchanged at 300 grams, because the pouch is sealed. The volume rose from 100 cubic centimeters to 120 cubic centimeters, because the faster-moving particles spread farther apart. So the density fell from 3 grams per cubic centimeter to 2.5 grams per cubic centimeter. Released in a deep tank of room-temperature Sample L, which is still at 3 grams per cubic centimeter, the warmed fluid would move upward, because the denser room-temperature fluid sinks under it and pushes it up.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-which-sample-is-denser',
      kind: 'try_yourself',
      problem:
        'Sample P has a mass of 90 grams and takes up 45 cubic centimeters. Sample Q has a mass of 36 grams and takes up 12 cubic centimeters. Both samples are at the same temperature. Which sample is denser, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sample P, because 90 grams is two and a half times the 36 grams of Sample Q, and the sample that contains more matter is the one whose matter must be packed in more tightly.' },
        { id: 'b', text: 'Sample Q, because Sample Q holds 3 grams in every cubic centimeter while Sample P holds only 2 grams in every cubic centimeter, so Sample Q fits more mass into the same amount of space.', correct: true },
        { id: 'c', text: 'Sample P, because Sample P fills 45 cubic centimeters against the 12 cubic centimeters of Sample Q, and a sample that takes up far more room has far more of its matter pressed into that room.' },
        { id: 'd', text: 'Neither one, because these numbers describe only how big a piece of each sample happens to be, and how much of a sample you have is exactly the thing that never changes its density.' },
      ],
      expectedAnswer: 'Sample Q, because Sample Q holds 3 grams in every cubic centimeter while Sample P holds only 2 grams in every cubic centimeter, so Sample Q fits more mass into the same amount of space.',
      hints: [
        'Neither the mass on its own nor the volume on its own can answer this. Work out, for each sample separately, how many grams are sitting in every single cubic centimeter of it.',
        'Divide each mass by its own volume, keeping each sample\'s two numbers together. The larger of the two answers, in grams per cubic centimeter, belongs to the denser sample.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-warmed-sealed-pouch',
      kind: 'try_yourself',
      problem:
        'Sample R is a fluid whose numbers are picked to keep the arithmetic easy. A sealed, stretchy pouch holds 360 grams of Sample R, and at 20 degrees Celsius the fluid inside takes up 120 cubic centimeters. The pouch is moved somewhere warm. Nothing is added to it and nothing leaks out of it. When the fluid has warmed all the way through, the pouch has swelled and the fluid inside takes up 180 cubic centimeters. Which statement describes correctly what has happened, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The mass has fallen below 360 grams while the volume has risen to 180 cubic centimeters, because some of the fluid has boiled into gas, and it is that gas puffing the pouch out, so there is now less matter filling a larger space.' },
        { id: 'b', text: 'The mass is still 360 grams and the volume has risen to 180 cubic centimeters, because every particle of Sample R has swollen to a larger size in the warmth, so the same particles at their new size need more room and the density has fallen from 3 grams per cubic centimeter to 2 grams per cubic centimeter.' },
        { id: 'c', text: 'The mass is still 360 grams, because nothing entered the pouch and nothing left it, and the volume has risen to 180 cubic centimeters, because the faster-moving particles push one another farther apart, so the density has fallen from 3 grams per cubic centimeter to 2 grams per cubic centimeter.', correct: true },
        { id: 'd', text: 'The mass is still 360 grams and the volume has risen to 180 cubic centimeters, but the density is still 3 grams per cubic centimeter, because the density of a fluid belongs to that fluid the way its color does, and warming it does not turn it into a different fluid.' },
      ],
      expectedAnswer: 'The mass is still 360 grams, because nothing entered the pouch and nothing left it, and the volume has risen to 180 cubic centimeters, because the faster-moving particles push one another farther apart, so the density has fallen from 3 grams per cubic centimeter to 2 grams per cubic centimeter.',
      hints: [
        'Take the three quantities one at a time. The pouch is sealed, so what can possibly have happened to the mass? Then ask what the warming did to the particles: did it change their size, or did it change how far apart they sit?',
        'Work out the grams in every cubic centimeter before and after, using the same 360 grams both times. If that number comes out different, then density is not something a fluid keeps no matter how warm it gets.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-heater-top-or-bottom',
      kind: 'try_yourself',
      problem:
        'Two identical tanks hold the same amount of water, all of it at 20 degrees Celsius to begin with. Tank 1 has a heater sitting under its base. Tank 2 has an identical heater held just below the water surface at the top. The two heaters give out thermal energy at the same rate, and both tanks are then left alone for twenty minutes. At the end, the water in Tank 1 is warmer all the way from the bottom to the top, while in Tank 2 only a thin layer at the very top is warm and everything below that layer is still close to 20 degrees Celsius. Why does Tank 1 warm all the way through while Tank 2 does not?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because thermal energy can travel only upward through a liquid, so the heater under Tank 1 sends it up through the whole depth of the water, while the heater at the top of Tank 2 has only air above it and the water underneath it can never be reached at all, so that water simply stays at the temperature it started at.' },
        { id: 'b', text: 'Because the water at the bottom of Tank 2 is held still by the weight of all the water piled on top of it, so it cannot travel up to the heater, while in Tank 1 there is no water underneath the heater to be pinned down in that way, which leaves the water there free to move up and take its turn.' },
        { id: 'c', text: 'Because warm water rises on its own but cool water has no reason to sink, so in Tank 1 the warmed water can climb from the bottom to the top, while in Tank 2 the cool water underneath has nothing to make it come up and take its turn beside the heater, so the warmth simply piles up in the layer where it was made.' },
        { id: 'd', text: 'Because the water Tank 1 heats becomes less dense than the cooler water above it, so that cooler, denser water sinks under it and pushes it up, and the exchange keeps stirring the tank; in Tank 2 the warmed water is made at the top, already above the denser water, so nothing sinks under it and nothing stirs.', correct: true },
      ],
      expectedAnswer: 'Because the water Tank 1 heats becomes less dense than the cooler water above it, so that cooler, denser water sinks under it and pushes it up, and the exchange keeps stirring the tank; in Tank 2 the warmed water is made at the top, already above the denser water, so nothing sinks under it and nothing stirs.',
      hints: [
        'Work out what each heater does to the density of the water right beside it, and then ask where in its own tank that less dense water already is.',
        'Nothing in a fluid rises because it is trying to. A less dense parcel goes up only when denser fluid sinks underneath it and pushes it up. Ask which tank has denser water sitting above the water that was warmed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-heavy-sinks-and-particles-swell',
      kind: 'misconception_check',
      question:
        'A student writes: "Heavy things sink and light things float, so a steel ship should go straight to the bottom. And when you heat a liquid up it takes more room because every particle in it swells." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Heavy things sink and light things float, so a steel ship should go straight to the bottom.',
          misconception:
            'Reading density off the mass alone, because a heavy object really does feel like it ought to sink, and in everyday speech the word "dense" is used to mean much the same thing as the word "heavy".',
          correctsTo:
            'What decides whether something stays up in water is its density -- how many grams it has in every cubic centimeter -- and not its mass. A solid bolt of steel is several times denser than water, so it sinks. A ship built out of the same steel is mostly hollow: the steel is wrapped around an enormous volume of air, and the ship as a whole, air included, is less dense than water, so it stays up. Nothing about the steel itself changed. The volume it was spread around did. WRONG: "It is heavy, so it sinks." CORRECT: "It has more grams in every cubic centimeter than water does, so it sinks." The pair that settles the argument is the beach ball and the glass marble from earlier in this lesson: the beach ball has the greater mass and it floats, the marble has the smaller mass and it sinks. If mass were deciding the answer, that pair could not happen.',
        },
        {
          answer: 'When you heat a liquid up it takes more room because every particle in it swells.',
          misconception:
            'Moving the growth from the sample to the particles themselves, because the sample really does get bigger and the particles look like the only thing inside it that could be doing the growing.',
          correctsTo:
            'A particle does not change size when it is warmed, and it does not melt, shrink or change color either. What warming changes is how fast the particles move. Faster particles knock one another farther apart, so the average space between them grows, and it is that extra space -- not bigger particles -- that makes the sample take up more room. The clearest sign of this is what happens to a gas. Warming a gas can easily make it take up half as much room again, and no particle grows by half. What grows is the empty space between the particles, which in a gas is already far larger than the particles themselves. WRONG: "The particles swell up when you heat them." CORRECT: "The particles stay exactly the same size, and they move farther apart."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Density is how much mass is packed into each bit of space. Divide the mass by the volume and read the answer as the grams sitting in every cubic centimeter.',
        'Density is not mass and it is not size. A sample can have a large mass and a low density, and another can have a small mass and a high density.',
        'Density does not depend on how much of a sample you have. Cut it in half and the mass halves, the volume halves, and the density is unchanged.',
        'The density of water is about 1 gram per cubic centimeter.',
        'Warming a fluid makes its particles move faster and spread farther apart. The mass stays the same, the volume goes up, and so the density goes down. That is thermal expansion, and cooling runs it backward.',
        'The particles themselves never swell. Only the spaces between them change.',
        'Nothing rises because it wants to. The cooler, denser fluid sinks, slides underneath the less dense fluid, and pushes it up -- one exchange, not two separate events.',
        'One sentence covers air near a ceiling, water in the ocean and hot rock in the mantle: the denser fluid sinks and the less dense fluid is pushed up above it.',
        'Ice is less dense than liquid water, because water expands when it freezes, so never say that a solid is always denser than its liquid.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Density, Thermal Expansion & Why Warm Fluids Rise' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
