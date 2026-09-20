/**
 * Grade 8 Science (Physical Science) — Insulators, Conductors & Thermal
 * Design.
 *
 * Row 5.4, PROCEDURE-LED. One routine runs the whole lesson: name the job and
 * the direction (which side is warmer, which is cooler, and is the device
 * trying to slow the crossing or speed it up), write down the criterion, take
 * the three transfer mechanisms one at a time and name the material or feature
 * that blocks or boosts each, hunt for the mechanism nothing in the design
 * deals with, check the device still does its other jobs, and only then compare
 * two designs mechanism by mechanism. Both worked examples run those same moves
 * in the same order -- the first on a device that MINIMIZES transfer, the
 * second on a pair of devices that MAXIMIZE it -- so the pattern is
 * unmistakable, and each ends with the two-part verification move (three clues
 * of different kinds agreeing, then one changed condition that moves the
 * answer).
 *
 * The three traps it is built to kill are (a) "the cooler keeps the cold in",
 * which sends a student hunting for the feature that blocks incoming cold and
 * so judges every design from the wrong end; (b) "an insulator stops the
 * transfer", when what it does is stretch the transfer out in time; and (c)
 * "shiny is better", which is exactly wrong on any surface whose job is to soak
 * radiation up.
 *
 * SCOPE GUARD: this plan evaluates a PROPOSED DEVICE against a stated
 * criterion by naming which transfer mechanism each material or feature blocks
 * or boosts, and chooses between two designs with the reason. Per the
 * controller ruling that a scope cell has UP TO three parts, this row's cell
 * has only part (i): it carries NO lineage clause and NO withheld clause, and
 * neither has been invented here. Every absence claimed below is claimed of the
 * plan's AUTHORED TEXT -- the objective, the segments and the metadata -- and
 * not of this guard or of the chain loIds, which necessarily name the
 * neighboring rows. What each edge means, and what is deliberately ALLOWED
 * there:
 *   - GRADE 8 NEIGHBORS. Row 5.2 (conduction, convection and radiation) owns
 *     the MECHANISMS and is assumed, not re-taught: each of the three is
 *     restated once in the vocabulary list as something the student already
 *     holds, and no segment argues for a mechanism, derives one, or asks the
 *     student to classify a described everyday SITUATION by mechanism, which is
 *     5.2's exercise. This row's own work starts one step later, at which
 *     MATERIAL or FEATURE acts on which mechanism inside a proposed device.
 *     Row 5.1 (temperature versus thermal energy) is assumed as the words
 *     "thermal energy"; nothing here re-argues the average-versus-total
 *     distinction. Row 5.3 (mass, material and temperature change) owns how much a sample's
 *     temperature moves for a given amount of matter and material, so every
 *     comparison this plan makes holds the contents FIXED -- the same drink,
 *     the same amount, in both containers; the same bowl of water, the same
 *     amount, in both ovens; the same tray of berries in both boxes -- and says
 *     so inside the item. Nothing here predicts how far a temperature would
 *     move from an amount of energy, a mass or a material; the two worked
 *     examples only subtract two GIVEN readings in order to compare two
 *     containers, and no sample is compared with a sample of a different
 *     substance. Row 6.1 (the particle model and the states of matter) is the
 *     next row: this file says only that a vacuum has almost no particles in
 *     it, and never sorts
 *     particle behavior by state. Row 2.4 (collisions and designing for safety)
 *     runs the same design-evaluation PRACTICE against a completely different
 *     criterion; no safety, force, time-of-stop or area idea appears here.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears in the authored text. No mantle,
 *     plate, ocean current, sea breeze, weather system, water cycle, climate or
 *     greenhouse effect is named anywhere in it. The Sun appears only as a
 *     source of radiation landing on a device, in the second worked example and
 *     in one item, and the atmosphere is never described. The clear lid of the
 *     solar oven is credited with exactly two things -- letting sunlight through
 *     and sealing the warm air in -- and deliberately NOT with trapping
 *     outgoing radiation, because that account belongs to a topic this course
 *     does not teach.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. Hot food, frozen berries, a tub of ice cream
 *     and a pot of water are objects with temperatures and nothing else; no
 *     organism, cell, nutrition, food safety or body process is described.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in this
 *     catalog, so AP Physics is the course above). The quantity this file stops
 *     short of is SPECIFIC HEAT and the formula it stops short of is
 *     q = mcDeltaT: no material is given a conductivity value, an R-value, an
 *     emissivity or a specific-heat number, and no energy anywhere is stated in
 *     joules. Every material property this plan uses is either a plain
 *     comparison ("copper conducts thermal energy quickly", "wood conducts it
 *     slowly") or is STATED INSIDE the item that needs it. It also stops short
 *     of the laws of thermodynamics, of entropy and of heat engines; none of
 *     those words is used as content. The only physical quantities anywhere are
 *     stipulated test readings in degrees Celsius, two masses in grams and
 *     elapsed times in hours, and the only arithmetic performed on any of them
 *     is subtracting two readings and dividing one difference by another.
 *
 * NOTE ON BURNED EXAMPLES: the scope cell's part (i) names four devices -- a
 * lunch cooler, a thermos, a solar oven and a house wall -- and part (i) is
 * copied verbatim into `los[0].description`, which the academy renders to the
 * student as the lesson objective. All four are therefore BURNED for items: an
 * item built on one of them would be partly answerable from the objective. They
 * are used only in TEACHING segments here (the thermos in the first worked
 * example, the solar oven in the second, the house wall in one concept
 * sentence, and the cooler nowhere at all), and all three items use fresh
 * devices -- an insulated bag for hot food, a shipping box for frozen berries,
 * and a camping pot. A later editor must not "helpfully" move a cell example
 * into an item.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every device in
 * this file is written out in words inside the segment that asks about it,
 * including what each part is made of and what that material does to thermal
 * energy, and the criterion the design is being judged against is stated in the
 * same breath -- because a design-evaluation item that leans on an unstated
 * material property is the design-row form of "look at the diagram". Never
 * assume the student has a thermos, a thermometer, a foam block or a pot in
 * front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 5.3 -> 5.4 -> 6.1
 * (`mass-material-and-temperature-change` ->
 * `insulators-conductors-and-thermal-design` ->
 * `the-particle-model-and-states-of-matter`), and both arrays below are
 * populated with those real loIds.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U5_INSULATORS_CONDUCTORS_AND_THERMAL_DESIGN: LessonPlan = {
  id: 'evelyn.ms.m8sci.insulators-conductors-and-thermal-design.v1',
  title: 'Insulators, Conductors & Thermal Design',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.insulators-conductors-and-thermal-design',
      standard: 'M8SCI-5.4',
      description:
        'Evaluate a proposed device that maximizes or minimizes thermal energy transfer (a lunch cooler, a thermos, a solar oven, a house wall) by naming which transfer mechanism each material or feature blocks or boosts, and choose the better of two designs with the reason (NGSS MS-PS3-3).',
    },
  ],
  prerequisites: ['m8sci.mass-material-and-temperature-change'],
  followUps: ['m8sci.the-particle-model-and-states-of-matter'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two everyday thermal facts side by side -- the thin puffy jacket that beats a thick sweatshirt, and the metal rail that feels colder than the wood beside it -- so that "how fast does thermal energy cross this material" arrives as a question the student already has evidence about.',
      script:
        'Two things you have already noticed, and they do not look connected. First one: a thin puffy jacket keeps you warmer on a cold morning than a thick, heavy sweatshirt does, even though the sweatshirt is the one that feels solid and serious. Second one: on a cold day the metal handrail outside feels much colder against your hand than the wooden bench beside it -- and those two have been sitting in the same cold air all night, so they are at the same temperature as each other. Neither of those is about how much energy is inside the jacket or inside the rail. Both of them are about how FAST thermal energy is allowed to cross a material. That is the whole of today. Every object anybody has ever built to keep something hot, or to keep something cold, or to do the opposite and pour thermal energy into something as quickly as possible, is somebody answering that one question with a choice of materials. By the end of this lesson somebody can hand you a design they have thought up, tell you what each part is made of, and you will be able to work through it part by part, say which way the energy is trying to go, say what each part does about it, and say whether the design is any good.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-thermal-design-routine',
      kind: 'concept',
      goal: 'Install conductor and insulator as ends of one scale, the trapped-air rule, the one-feature-per-mechanism table and its reverse for maximizing, the both-directions rule that kills cold-flows, and the ordered routine for judging a proposed design.',
      keyIdeas: [
        'A THERMAL CONDUCTOR IS A MATERIAL THERMAL ENERGY CROSSES QUICKLY, AND A THERMAL INSULATOR IS ONE IT CROSSES SLOWLY. The everyday conductors are the metals -- copper, aluminum, steel. The everyday insulators are wood, plastic, foam, cloth, paper and still air. Read the definition again and notice the word it uses: SLOWLY, not never. An insulator does not block thermal energy and no material does; what an insulator does is stretch the crossing out in time, and that is the whole of it. This also settles the handrail. The metal rail and the wooden bench next to it sat in the same cold air all night, so they are at the same temperature, and the rail still feels far colder because metal is a conductor: it carries thermal energy out of your hand quickly. What your hand reports is not how cold the rail is. It is how fast your hand is losing energy to it. The wood takes the same energy away slowly, so it hardly feels cold at all.',
        'MOST GOOD INSULATORS ARE MOSTLY AIR, AND THE AIR HAS TO BE HELD STILL. Still air conducts thermal energy very slowly -- far more slowly than any metal, and more slowly than wood or plastic -- so a material that holds a lot of air in place is an excellent insulator. That is exactly what foam, wool, a fleece, a woolly hat and a puffy jacket are: a small amount of solid holding a large amount of air in a great many tiny pockets. The word TRAPPED is doing real work in that sentence. Air that is free to move does not insulate, because moving air carries thermal energy along with it from place to place, which is convection. So the pockets have to be small enough that the air inside one cannot circulate. Two consequences catch people out. A puffy jacket squashed flat under a backpack strap stops insulating at that spot, because the pockets are gone and the air with them. And a wide hollow gap inside a wall is not an insulator at all, however empty it looks: the air in a wide gap warms on the warm side, rises, cools on the cold side, sinks, and goes round and round, ferrying thermal energy across the gap the whole time.',
        'THERE ARE THREE WAYS ACROSS, SO THERE ARE THREE JOBS TO DO, AND A DIFFERENT KIND OF FEATURE DOES EACH ONE. You already know the three ways from the last lesson. To slow CONDUCTION, put a slow-conducting material in the path and make that layer thicker. To slow CONVECTION, stop the fluid circulating: seal the gaps so air cannot come in or go out, hold the air still in small pockets, or take the air away altogether. To slow RADIATION, face the source with a shiny, mirror-like surface, which reflects most of the radiation landing on it instead of soaking it up. Then hold on to the one fact that separates radiation from the other two: conduction and convection both need matter in the way, and radiation does not. So a VACUUM -- a space with almost no particles in it -- shuts conduction and convection down almost completely and does nothing whatever about radiation. A design with a vacuum in it still needs a shiny surface, and a vacuum with no shiny surface is where that design leaks.',
        'RUN EVERY ONE OF THOSE RULES BACKWARD AND YOU HAVE A DESIGN THAT MAXIMIZES TRANSFER INSTEAD. Plenty of devices are built to move thermal energy as fast as possible, not as slowly as possible. To speed up CONDUCTION, choose a fast-conducting material, make the layer thin, and press the two surfaces into direct contact so that no film of air sits between them. To speed up CONVECTION, let the fluid circulate freely, or push it along with a fan or a pump. To take in as much RADIATION as possible, face the source with a dark, dull surface, which soaks up most of the radiation that lands on it, and set flat shiny panels around it, angled to bounce still more radiation onto it. Notice that shiny and dark are opposites doing opposite jobs. That is why "shiny is better" is not a rule: a shiny surface is right wherever you want radiation turned back, and exactly wrong wherever you want radiation soaked up.',
        'AN INSULATOR DOES NOT KNOW WHICH WAY THE ENERGY IS GOING, AND COLD DOES NOT GO ANYWHERE. Thermal energy always moves from the warmer side to the cooler side, and an insulator slows that crossing whichever way it happens to be running. The same foam box keeps hot food hot and keeps cold food cold, and it is not doing two different jobs. It is doing one job, twice, in opposite directions. So nothing in any design "keeps the cold in", and cold never leaks anywhere, because cold is not a thing that moves. WRONG: "The foam keeps the cold inside the box." CORRECT: "The inside of the box is colder than the room around it, so thermal energy is crossing from the room into the box, and the foam slows that crossing down." This matters for more than the wording. A student who believes cold flows will go looking for the feature that blocks the incoming cold, and will end up judging every design from the wrong end.',
        'HOW TO EVALUATE A PROPOSED THERMAL DESIGN, IN ORDER. (1) Name the job and the direction: which side is warmer, which side is cooler, and is the device trying to SLOW the crossing or SPEED it up? Write the criterion down, because the word "good" means nothing until there is one. (2) Take the three mechanisms one at a time -- conduction, then convection, then radiation -- and for each one name the material or feature that blocks it or boosts it. (3) Look for a mechanism that nothing in the design deals with. That is where a design leaks, and it is the single most useful question in the routine. (4) Check that the device still does its other jobs: closing properly, holding its shape, being possible to carry, open and clean. (5) Only now compare the designs, mechanism by mechanism, against the criterion you wrote down -- never on which one sounds more advanced, and never on which material sounds better. A house wall is the routine done once in each season: the same insulation slows thermal energy leaving in winter and slows it arriving in summer.',
      ],
      vocabulary: [
        { term: 'conduction', definition: 'thermal energy passing through matter that is in contact, from faster-moving particles to their slower neighbors. From the last lesson.' },
        { term: 'convection', definition: 'thermal energy carried from place to place by a moving fluid, as warmer fluid rises and cooler fluid sinks. From the last lesson.' },
        { term: 'radiation', definition: 'thermal energy carried by waves, which needs no matter to cross and is the only one of the three that can cross empty space. From the last lesson.' },
        { term: 'thermal conductor', definition: 'a material that thermal energy crosses quickly, such as copper, aluminum or steel.' },
        { term: 'thermal insulator', definition: 'a material that thermal energy crosses slowly, such as foam, wool, wood, plastic or still air. It slows the crossing; it never stops it.' },
        { term: 'vacuum', definition: 'a space with almost no particles in it. Conduction and convection need matter, so neither can cross a vacuum; radiation can.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-thermos-minimizes-transfer',
      kind: 'worked_example',
      problem:
        'A thermos is built like this, and every fact you need is here. There are two containers, a smaller one inside a larger one, joined to each other only at a narrow neck at the top. Almost all of the air has been pumped out of the space between them, leaving a vacuum. Both of the surfaces facing that empty space have been polished until they are mirror-shiny. The stopper is thick plastic and seals the top tightly. In a test, the same 300 grams of the same drink was poured at 80 degrees Celsius into a thermos and into an open metal mug, and both were left standing in the same room for three hours. At the end the drink in the thermos was at 75 degrees Celsius and the drink in the open mug was at 30 degrees Celsius. Name what each part of the thermos does, and use the two readings to say how much difference the design made.',
      steps: [
        'Step 1, name the job and the direction, and write down the criterion. The drink starts warmer than the room, so thermal energy is crossing from the drink out to the room, and it will keep crossing that way for as long as the drink is the warmer of the two. This device is trying to SLOW that crossing. The criterion is simple: keep the drink as close to its starting temperature as possible for as long as possible.',
        'Step 2, conduction. For thermal energy to conduct out of the drink, it needs matter in contact all the way from the inner container to the outside. Almost all of that path has been removed: between the two containers there is a vacuum, and a vacuum has almost no particles, so there is next to nothing for conduction to pass through. The one solid path left is the narrow neck where the two containers join, and it is narrow on purpose. The thick plastic stopper covers the other opening, and plastic is a slow conductor. Conduction is dealt with.',
        'Step 3, convection. Air cannot circulate where there is almost no air, so no convection loop can get going in the vacuum gap. At the top, the stopper seals the opening, so warm air and vapor cannot rise out of the flask and be replaced by cooler air from the room. Convection is dealt with.',
        'Step 4, radiation, and this is the step the design would fail without. Radiation is the one mechanism that needs no matter, so the vacuum does nothing to it at all: radiation crosses that empty gap exactly as easily as it crosses any other empty space. That is why both surfaces facing the gap are polished mirror-shiny -- a shiny surface reflects most of the radiation that lands on it, so radiation leaving the inner container is largely sent straight back. WRONG: "The vacuum stops all three ways, so the shiny surfaces are just decoration." CORRECT: "The vacuum stops the two mechanisms that need matter. Radiation is the one that does not need matter, and the mirror surfaces are the only feature in the whole design aimed at it."',
        'Step 5, use the readings, and notice first why the comparison is fair. The same drink, the same 300 grams of it, the same starting temperature, the same room and the same three hours -- the only thing that differed between the two was the container. In the thermos the drink fell from 80 degrees Celsius to 75 degrees Celsius, so the drop was 80 - 75 = 5 degrees Celsius. In the open mug it fell from 80 degrees Celsius to 30 degrees Celsius, so the drop was 80 - 30 = 50 degrees Celsius. Comparing the two drops: 50 ÷ 5 = 10, so the open mug lost ten times as much temperature over the same three hours. And note the word "slowed", not "stopped": the thermos drink still fell by 5 degrees Celsius, because no insulator stops a transfer.',
        'Step 6, run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The mechanism inventory says each of the three ways out has a feature aimed at it and none is left unguarded. The physical build agrees independently: a vacuum is difficult and expensive to make and nobody would build one into a flask unless removing the matter were the point. And the measurement agrees from a third direction: the drop in the thermos was one tenth of the drop in the plain mug over the same hours. Three different kinds of evidence, one answer.',
        'Step 7, change one condition and check that the answer moves. Let ordinary air back into the gap between the two containers and change nothing else. Now there is matter in the gap, so conduction has a path across it and the air in the gap can circulate as well, warming at the inner wall, rising, cooling at the outer wall and sinking. Two mechanisms that were shut down are open again, and the drink cools far faster. Now put the vacuum back but paint both of those facing surfaces dull black instead of polishing them. Conduction and convection are still shut down, but the black surfaces soak up and give off radiation instead of reflecting it, so the one mechanism the vacuum never touched is now wide open, and the drink cools faster again. The answer moved both times, and each time it moved for a reason we can name.',
      ],
      answer:
        'The vacuum between the two containers removes almost all the matter, so conduction and convection have almost nothing to cross; the narrow neck and the thick plastic stopper close the two remaining solid paths and seal the top against air moving in and out. Radiation is the one mechanism a vacuum does nothing about, and the mirror-shiny surfaces facing the gap reflect most of it back. In the test the same drink lost 80 - 75 = 5 degrees Celsius in the thermos and 80 - 30 = 50 degrees Celsius in the open mug over the same three hours, and 50 ÷ 5 = 10, so the mug lost ten times as much. The thermos slowed the transfer; it did not stop it.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-two-solar-ovens',
      kind: 'worked_example',
      problem:
        'Two solar ovens are proposed for warming a bowl of water outdoors on a sunny day, and every fact you need about the materials is given here. Both boxes are the same size, both hold the same 200 grams of water in the same bowl, both start at 20 degrees Celsius, and both sit in the same sunshine for the same hour. Design A: the inside is painted dull black, which soaks up almost all of the sunlight that lands on it; the lid is a sheet of clear glass that lets sunlight through and seals the top so that no air moves in or out; the walls are thick foam full of tiny sealed pockets of trapped air; and four flat shiny panels are angled around the lid to bounce extra sunlight down through it. Design B: the inside is painted glossy white, which reflects most of the sunlight that lands on it; the top is left open; the walls are one thin sheet of aluminum, a metal that conducts thermal energy quickly; and there are no panels. After the hour, the water in design A is at 60 degrees Celsius and the water in design B is at 30 degrees Celsius. Which design meets the criterion better, and what does each feature do?',
      steps: [
        'Step 1, name the job and the direction, and write down the criterion. A solar oven is the opposite kind of device from a thermos: it is trying to MAXIMIZE the transfer coming in from the Sun, and then, once the water inside is warmer than the air outside, to MINIMIZE the transfer going back out. So the same routine runs, with some features boosting a mechanism and others blocking one. The criterion is to get the water as warm as possible in an hour.',
        'Step 2, radiation coming in. Design A faces the incoming sunlight with a dull black surface, which soaks up almost all of it, and the four angled shiny panels bounce extra sunlight down through the clear lid so that more radiation lands inside in the first place; the glass lid lets that sunlight through. Design B faces the sunlight with glossy white, which reflects most of it straight back out of the open top, and it has no panels. WRONG: "Design B must be better at this, because a shiny, light surface is the better thermal surface." CORRECT: "Shiny reflects radiation. That is the right choice where you want radiation turned back, as on the mirror surfaces facing the vacuum in a thermos, and it is exactly the wrong choice on a surface whose whole job is to soak radiation up."',
        'Step 3, convection. Design A has a lid that seals, so the warmed air inside cannot rise out of the box and cooler air cannot sink in behind it; the convection loop is closed off. Design B is open at the top, so the warmest air in the box rises straight out and cooler air sinks in to take its place, carrying thermal energy away about as fast as the sunlight brings it. This is the biggest single difference between the two designs and it is the one an eye passes over, because an open top does not look like a missing part.',
        'Step 4, conduction, and then the other jobs. Design A has thick foam walls full of trapped air, which conducts slowly, so thermal energy that has arrived inside leaves through the walls only slowly. Design B has thin aluminum walls, and aluminum conducts quickly, so energy that does get in crosses straight back out through the walls. Both boxes hold their shape and both can be opened to get the bowl out, so nothing separates them on the other jobs.',
        'Step 5, use the readings, and notice first why the comparison is fair. Same bowl, same 200 grams of water, same starting temperature, same sunshine, same hour -- the only thing that differed was the box. Design A rose from 20 degrees Celsius to 60 degrees Celsius, so its rise was 60 - 20 = 40 degrees Celsius. Design B rose from 20 degrees Celsius to 30 degrees Celsius, so its rise was 30 - 20 = 10 degrees Celsius. Comparing the two rises: 40 ÷ 10 = 4, so design A warmed the same water four times as much in the same hour. Design A meets the criterion better, and it does so on all three mechanisms at once.',
        'Step 6, run the two checks. First, three clues of DIFFERENT KINDS agree. Going mechanism by mechanism, design A wins on radiation in, on convection out and on conduction out, which is three separate questions with the same answer. Reading the design the other way round agrees too: every one of design B\'s features is the reverse of the matching feature in design A, so the two are not close calls on a mixed scorecard. And the measurement agrees from a third direction, with a rise four times as large from the same sunlight in the same hour.',
        'Step 7, change one condition and check that the answer moves. Take design A and change only the paint inside, from dull black to the same glossy white as design B. Now most of the sunlight that comes through the lid is reflected back up and straight out through the clear glass, so much less radiation is soaked up, and the rise collapses even though the sealed lid and the foam walls have not changed. Now put the black paint back and change only the lid, cutting a wide hole in it. The radiation still arrives and is still soaked up, but the warmed air now rises out through the hole and cooler air sinks in behind it, so a large part of what arrives is carried away again. Two different single changes, each one moving the answer, and each one naming a different mechanism as the cause.',
      ],
      answer:
        'Design A, and by a wide margin. It boosts the radiation coming in with a dull black surface that soaks up almost all of the sunlight and four angled shiny panels that bounce extra sunlight through a clear lid; it blocks convection out with a lid that seals; and it slows conduction out with thick trapped-air foam walls. Design B reverses all three: glossy white reflects most of the sunlight away, the open top lets a convection loop carry the warmed air off, and thin aluminum walls conduct quickly. In the test design A rose 60 - 20 = 40 degrees Celsius and design B rose 30 - 20 = 10 degrees Celsius, and 40 ÷ 10 = 4, so design A warmed the same water four times as much in the same hour.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-hot-food-delivery-bag',
      kind: 'try_yourself',
      problem:
        'An insulated bag is proposed for carrying hot food from a kitchen to a customer, and every fact you need about it is given here. The outside is tough fabric. Inside that is a thick middle layer of foam made of many tiny sealed pockets of air; the air in those pockets conducts thermal energy slowly and cannot circulate from one pocket to the next. The inner lining is a shiny silver surface that reflects most of the radiation landing on it. A zipper seals the bag closed all the way round, so no air moves in or out while it is shut. The criterion is to keep the food hot for as long as possible. Which statement correctly names what the foam layer and the shiny lining each do?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The foam layer keeps the cold of the street from soaking in through the fabric, and the shiny lining turns back any cold that does make it through the foam, so the cold is stopped twice over before it can ever reach the food.' },
        { id: 'b', text: 'The foam layer slows conduction, because the air sealed in its pockets conducts thermal energy slowly and cannot carry it across by circulating, and the shiny lining reflects radiation from the hot food back toward the food instead of letting it leave through the sides.', correct: true },
        { id: 'c', text: 'The foam layer is what stops radiation leaving the bag, because radiation cannot pass through a thick solid layer, and the shiny lining is what stops conduction, because a smooth mirror surface has no gaps in it for thermal energy to get through.' },
        { id: 'd', text: 'The foam layer and the shiny lining are two goes at the very same job, since both of them are there to slow conduction through the sides, and the only other mechanism this design deals with at all is air moving in and out, which the zipper takes care of.' },
      ],
      expectedAnswer: 'The foam layer slows conduction, because the air sealed in its pockets conducts thermal energy slowly and cannot carry it across by circulating, and the shiny lining reflects radiation from the hot food back toward the food instead of letting it leave through the sides.',
      hints: [
        'Take the mechanisms one at a time. The food is warmer than the street, so thermal energy is crossing from the food outward. Which of the three ways out does a layer of trapped air act on, and which one does a mirror-like surface act on?',
        'Cold is not a thing that travels, so no feature can block it. And a design is stronger, not weaker, when its features act on different mechanisms rather than all on the same one. Which choice gives each feature a different mechanism and gets both of them the right way round?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-berry-boxes',
      kind: 'try_yourself',
      problem:
        'Two boxes are proposed for carrying a tray of frozen berries home on a warm day, and every fact you need is given here. Both boxes are the same size, both carry the same tray of berries, both are carried the same way for the same two hours, and both are covered on the outside with the same shiny foil, so the two reflect the same amount of the sunlight that lands on them. Box A has walls of thick foam full of tiny sealed pockets of air; the air in those pockets conducts thermal energy slowly and cannot circulate from one pocket to the next, and the lid clips down and seals all the way round. Box B has walls made of two thin sheets of cardboard with a wide hollow gap between them; the gap is open at the bottom and at the top, so air moves freely up through it and out, and the lid rests loosely on top, leaving a finger-wide opening along one edge. The criterion is to keep the berries frozen for as long as possible. Which box meets it better, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Box B, because the hollow gap in its wall has nothing solid inside it, and thermal energy needs something solid to travel through, so a wall built with an empty space in the middle of it stops the crossing completely.' },
        { id: 'b', text: 'Box B, because its wall is built from two separate sheets with a space between them, so thermal energy has to get through three layers there instead of the single layer that box A offers it, and three layers is the longer journey.' },
        { id: 'c', text: 'Box A, because the air in its foam pockets cannot circulate, so that one layer blocks conduction and convection together, while box B\'s wide open gap lets a convection loop carry thermal energy across the wall and its loose lid lets warm air straight in.', correct: true },
        { id: 'd', text: 'They keep the berries frozen for the same length of time, because both boxes carry the same shiny foil on the outside, and on a warm sunny day the radiation that foil turns away is the only thing that ever reaches a box, so the walls make no difference.' },
      ],
      expectedAnswer: 'Box A, because the air in its foam pockets cannot circulate, so that one layer blocks conduction and convection together, while box B\'s wide open gap lets a convection loop carry thermal energy across the wall and its loose lid lets warm air straight in.',
      hints: [
        'Both boxes have air in their walls, so the air on its own cannot be what separates them. Ask what the air in each wall is allowed to do: in one of them it is held in tiny pockets, and in the other it is free to move from the bottom of the gap to the top.',
        'The foil is the same on both, so radiation is a tie and cannot decide this. Run the other two mechanisms, and do not forget the lids -- one seals and one leaves an opening, and an opening is a route for moving air.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-camping-pot-two-jobs',
      kind: 'try_yourself',
      problem:
        'A camping pot is proposed, and every fact you need about the materials is given here. The pot has two jobs at once. On the stove it must let thermal energy pass from the flame into the water as quickly as possible, and a minute later a person must be able to lift it by its handle without being burned. Copper conducts thermal energy quickly. Wood conducts thermal energy slowly. A cooking plastic is also available, and it conducts thermal energy slowly and keeps its shape at cooking temperatures. Which design meets both jobs, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A thin copper base with a copper handle, because using one material throughout means every part of the pot is made of the fastest conductor available, and a pot built entirely from the fastest conductor is the fastest pot there is.' },
        { id: 'b', text: 'A base and a handle both made of the cooking plastic, because one slow-conducting material all the way round holds the thermal energy inside the pot rather than letting it escape, and it leaves the whole outside of the pot cool enough to touch.' },
        { id: 'c', text: 'A base of the cooking plastic with a copper handle, because a slow-conducting base stops the thermal energy escaping back down into the stove once it is in the water, and a copper handle carries any spare warmth away from the pot and out into the air.' },
        { id: 'd', text: 'A thin copper base with a thick wooden handle, because copper conducts quickly, so a thin copper base lets thermal energy cross from the flame into the water fast, while wood conducts slowly, so the end the person holds stays far cooler than the water does.', correct: true },
      ],
      expectedAnswer: 'A thin copper base with a thick wooden handle, because copper conducts quickly, so a thin copper base lets thermal energy cross from the flame into the water fast, while wood conducts slowly, so the end the person holds stays far cooler than the water does.',
      hints: [
        'This pot is asked to do opposite things in two different places. Take the jobs one at a time: at the base the design wants to MAXIMIZE the crossing, and at the handle it wants to MINIMIZE it. A single material cannot be the answer to both.',
        'Before anything can be kept in, it has to get in. Check each choice against the base job first -- does the flame\'s thermal energy reach the water quickly through that base? -- and only then check whether the handle it names stays cool.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-blanket-and-perfect-insulator',
      kind: 'misconception_check',
      question:
        'A student writes: "Wrapping a tub of ice cream in a thick wool blanket would melt it faster, because a blanket is a warm thing and it would make the ice cream warmer. And a really good cooler must stop thermal energy completely, so ice inside one would never melt at all." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Wrapping ice cream in a wool blanket would melt it faster, because a blanket is a warm thing.',
          misconception:
            'Treating a blanket as something that supplies thermal energy rather than as a barrier that slows a crossing, because a blanket wrapped round a person always ends up feeling warm, which makes it look as though the warmth is coming from the blanket.',
          correctsTo:
            'A blanket supplies no thermal energy to anything. Wool is an insulator: it holds a great deal of air still in tiny pockets, and still air conducts thermal energy very slowly, so wool slows the crossing whichever direction the crossing happens to be running. Around a person, thermal energy is crossing from the person out to the cooler room, and the wool slows it, so the person stays warmer. Around a tub of ice cream on a warm day, thermal energy is crossing from the warmer room in to the colder ice cream, and the wool slows that crossing in exactly the same way, so the ice cream stays frozen for LONGER, not for less time. WRONG: "A blanket makes things warm." CORRECT: "A blanket slows thermal energy crossing it, and which way it is crossing is decided by which side is warmer." The test that settles it is to wrap one tub and leave an identical tub on the counter beside it, then come back in an hour. The wrapped one is the one still frozen.',
        },
        {
          answer: 'A really good cooler stops thermal energy completely, so ice inside one would never melt.',
          misconception:
            'Reading the word insulator as blocker -- a wall the transfer simply cannot cross -- rather than as a material the transfer crosses slowly.',
          correctsTo:
            'No insulator stops thermal energy; every one of them only slows it down, and there is no material and no design that does better than that. A thermos comes closer than almost anything, and it still does not manage it: the vacuum inside it leaves almost no matter for conduction or convection to use, but radiation needs no matter at all, and the mirror-shiny surfaces reflect most of that radiation rather than all of it. Given long enough, the inside of any container and the room around it end up at the same temperature. This is why a thermal design is always judged against a TIME rather than against perfection: keep the drink hot until lunch, keep the inside cold until the end of the journey. WRONG: "A good enough insulator stops the transfer." CORRECT: "A good insulator stretches the transfer out, and the design is judged on whether it stretched it out long enough."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A thermal conductor is a material thermal energy crosses quickly (the metals: copper, aluminum, steel). A thermal insulator is one it crosses slowly (foam, wool, wood, plastic, paper, still air).',
        'An insulator slows the crossing. It never stops it, and no material does. Given long enough, the two sides reach the same temperature.',
        'Most good insulators are mostly air. The air has to be TRAPPED in small pockets, because air that can circulate carries thermal energy across by convection.',
        'A wide hollow gap is not an insulator: the air in it warms on the warm side, rises, cools on the cool side and sinks, ferrying energy across the whole time.',
        'One feature per mechanism. Slow conduction with a thicker layer of a slow-conducting material; slow convection by sealing gaps, trapping the air in small pockets, or removing the air; slow radiation with a shiny, mirror-like surface.',
        'Conduction and convection need matter; radiation does not. A vacuum shuts the first two down almost completely and does nothing at all about the third, which is why a vacuum flask also needs mirror surfaces.',
        'To MAXIMIZE transfer instead, reverse every rule: a fast conductor in a thin layer in direct contact, fluid free to circulate or pushed by a fan, and a dark dull surface facing the source with shiny panels angled to bounce more radiation onto it.',
        'Shiny is not better. Shiny reflects radiation, which is right where you want radiation turned back and wrong where you want it soaked up.',
        'Cold does not flow and nothing keeps the cold in. Thermal energy crosses from the warmer side to the cooler side, and an insulator slows it whichever way it is going.',
        'The routine: name the job, the direction and the criterion; take the three mechanisms one at a time and name what blocks or boosts each; hunt for the mechanism nothing deals with, because that is the leak; check the other jobs; then compare.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Insulators, Conductors & Thermal Design' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
