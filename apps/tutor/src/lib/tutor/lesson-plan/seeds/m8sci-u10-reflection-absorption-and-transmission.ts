/**
 * Grade 8 Science (Physical Science) — Reflection, Absorption & Transmission.
 *
 * CONCEPT-LED row 10.1, the entry lesson for Unit 10 (NGSS MS-PS4-2). The
 * student has no procedure to lean on: the lesson installs one mental model --
 * where a wave meets a material its energy is SHARED OUT three ways, reflected
 * back, absorbed into the material, or transmitted through, and the three
 * shares together account for everything that arrived -- and then makes that
 * model do work on described materials. The hard part is that the student's
 * everyday language has only two boxes, "it gets through" and "it is blocked",
 * so blocked-means-absorbed is the error the whole file is built around.
 *
 * The three traps it is built to kill are (a) blocked-means-absorbed, which
 * collapses reflection and absorption into one idea and makes shiny foil and
 * black card look like the same material; (b) color-is-in-the-object, which
 * survives untouched unless the student is made to change the lamp rather than
 * the object; and (c) energy-is-used-up, which arrives dressed as "the soft
 * furniture soaked the sound up and it was gone".
 *
 * SCOPE GUARD: this plan models what happens when a light or sound wave meets
 * a material -- reflected, absorbed, transmitted, usually more than one of
 * them at once -- explains that we see an object because light reflects off it
 * into the eye and that a red object reflects red light and absorbs the rest,
 * and predicts the outcome for a material described in words. Per CONTROLLER
 * RULING 33: this row's curriculum scope cell has part (i) and nothing else.
 * It carries NO lineage clause (there is no m6sci or m7sci predecessor to
 * name -- neither sibling course has a lesson on waves at a surface) and no
 * "Withholds:" clause; its only boundary note is the split parenthetical,
 * verbatim: "first of two lessons sharing MS-PS4-2, split by phenomenon: 10.2
 * is bending at a boundary". Nothing has been invented to fill the two missing
 * parts; the boundaries below are derived from the neighboring scope cells and
 * the curriculum's "Explicitly excluded" table instead. Every absence claim
 * below was grepped against the AUTHORED BODY -- the segment fields the tutor
 * speaks -- and not against this comment, the chain loIds or `los[0].description`,
 * which legitimately carry the neighboring rows' words and the curriculum cell's
 * own wording; each such hit is named where it matters below.
 *   - GRADE 8 NEIGHBORS. Row 10.2 (refraction) owns what happens to the
 *     DIRECTION of light that crosses into a new material. Grepped against the
 *     authored body: "bend", "refract", "lens" and "straw" appear zero times,
 *     and the only match for the letters "angle" anywhere in the file is inside
 *     the word "tangle" (of fibers), so no angle is named, measured or compared. This file says that some light is transmitted and carries on out
 *     the other side, and says nothing whatever about which way it goes when it
 *     does, nor about its speed changing, which is 10.2's mechanism. Row 10.3
 *     (light versus sound and the spectrum) owns what light IS and how it
 *     differs from sound. This file treats light and sound side by side purely
 *     as waves arriving at a material: grepped, "spectrum", "vacuum", "medium",
 *     "electromagnetic", "radio", "microwave", "infrared", "ultraviolet",
 *     "X-ray" and "gamma" appear zero times in the authored body, the two are
 *     never compared for speed, and it is never said that sound needs matter to
 *     travel in or that light does not. Row 10.4 (analog and digital) is not
 *     touched: no signal, no information, no pulse. Rows 9.2 and 9.4 own the
 *     wave MEASURES and the amplitude-energy link: grepped, "amplitude",
 *     "wavelength", "frequency", "hertz", "pitch", "crest" and "trough" appear
 *     zero times. "Loud", "louder" and "faintly" DO appear, as the everyday
 *     words for how much sound arrives. No wave in this file is measured and no
 *     wave is described by its size; where two situations ARE compared -- the
 *     furnished and the emptied room, the two rooms off the hallway -- the
 *     comparison is about how much of one arriving wave's energy survives to a
 *     place, which is this row's own subject, never about one wave being bigger
 *     than another, which is 9.2 and 9.4.
 *     Row 9.3 owns wave speed and distance = speed × time: no speed, no time
 *     interval and no distance is stated or computed anywhere in this file, and
 *     the legacy echo arithmetic the salvage column warns about (343 meters per
 *     second, a cliff, a round trip) is deliberately not carried. The word
 *     "echo" occurs exactly once outside this comment, inside `los[0].description`,
 *     where it is part of the curriculum cell copied verbatim; it appears in no
 *     segment, no item and no hint, and nothing in the file reflects a sound
 *     off anything and then times its return. Row 5.2 owns
 *     conduction, convection and radiation: absorbed energy is said to end up
 *     as thermal energy IN the material that absorbed it, which is where the
 *     energy went, and grepped, "conduction", "convection" and "radiation"
 *     appear zero times; no mechanism of transfer from one object to another is
 *     described. Row 4.3 (energy transformation and conservation) is assumed,
 *     not re-taught: the phrase "energy is transferred and transformed, never
 *     used up" appears exactly twice in the authored body -- concept keyIdea 2
 *     and the WRONG/CORRECT step of the second worked example -- each time as a
 *     rule the student already holds and is being asked to apply, never as new
 *     content, and nothing else about energy transformation is taught.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: the Sun appears only as the
 *     ordinary source of the light landing on an object outdoors. Grepped,
 *     "greenhouse", "climate", "atmosphere", "weather", "orbit", "planet" and
 *     "season" appear zero times; nothing is said about the Sun's light
 *     crossing anything, warming the Earth, or being trapped anywhere.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row. The eye is named, because the row's own scope sentence requires
 *     it, and it is named as the place the reflected light arrives -- plus one
 *     sentence saying that eyes adjust to a DIM room and have nothing to adjust
 *     to in a fully dark one, which is there only to close off the "wait long
 *     enough and you can see in the dark" escape. Grepped, the words "retina",
 *     "pupil", "rod", "cone", "eardrum", "cell" and "organism" appear zero
 *     times, no structure of the eye or the ear is described, and nothing is
 *     said about how seeing or hearing works once the wave gets there.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in this
 *     catalog, so AP Physics is the course above): this file stops short of the
 *     law of reflection as an angle relationship -- no angle is named, measured
 *     or compared anywhere, and the smooth-versus-rough contrast is made in
 *     words about directions, never with an angle of incidence -- and short of
 *     Snell's law, ray-diagram construction, the thin-lens equation and
 *     interference, which are `ap-physics2-optics.ts`. No share of the energy
 *     is ever given as a number, a fraction or a percentage: every comparison
 *     is "most", "a small part", "nearly none". Photon energy and any account
 *     of WHY a particular surface absorbs a particular color are
 *     `ap-physics2-modern.ts` and HS chemistry, and neither is attempted. There
 *     is no formula of any kind in the authored body, in words or in symbols:
 *     the only "=" anywhere below this comment is the TypeScript assignment on
 *     the export line.
 *
 * NOTE ON BURNED EXAMPLES (CONTROLLER RULING 32/36): `los[0].description` is
 * student-facing and names concrete examples -- a mirror, an echo, a black
 * curtain, acoustic foam, window glass, a thin wall, and the red object that
 * reflects red light. Every one of those is BURNED for the items: an item built
 * on one would be answerable from the lesson objective rather than from the
 * science. All three try_yourself items therefore use fresh specimens (a dark
 * blue tent, two shirts under a blue lamp, two rooms off a hallway), and the
 * cell's own examples appear only in teaching segments. A later editor must not
 * "helpfully" move one of them into an item.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every surface,
 * material and observation in this file is written out in words inside the
 * segment that uses it, and every item is solvable from the text printed inside
 * it. Never write "look at the ray diagram", and never assume the student has a
 * lamp, a mirror, a prism or a sheet of foil in front of them. Nothing in this
 * file asks for an observation the student has to go and make.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U10_REFLECTION_ABSORPTION_AND_TRANSMISSION: LessonPlan = {
  id: 'evelyn.ms.m8sci.reflection-absorption-and-transmission.v1',
  title: 'Reflection, Absorption & Transmission',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.reflection-absorption-and-transmission',
      standard: 'M8SCI-10.1',
      description:
        'Model what happens when a light or sound wave meets a material -- reflected (mirror, echo), absorbed (a black curtain, acoustic foam), transmitted (window glass, a thin wall) -- usually some of each, explain that we see an object because light reflects off it into the eye and that a red object reflects red light and absorbs the rest, and predict the outcome for a material (NGSS MS-PS4-2).',
    },
  ],
  prerequisites: ['m8sci.amplitude-and-wave-energy'],
  followUps: ['m8sci.refraction-bending-light-at-a-boundary'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Catch one surface doing two things at once, in light and then in sound, so the student wants a rule that shares energy out instead of picking a winner.',
      script:
        'Stand in front of a shop window after dark and you see two things at once in the same sheet of glass. Through it: the display inside the shop. On it: your own face looking back at you, and the street behind you. One flat piece of glass, doing two jobs in the same instant. Come back in the middle of a bright afternoon and the same sheet of glass behaves quite differently. Now the street reflected in it is so bright that you have to cup your hands around your eyes to make out anything inside at all. Sound does the same kind of double act. Sit in a room with the windows shut while a bus goes past outside. You hear it, so some of that sound got through the glass. But it arrives muffled and small, so most of it did not. Neither of those surfaces is doing just one thing. Each of them is splitting up what arrives. Today is about the three places a wave\'s energy can go when it meets a material, and about how you work out, from what you can see and feel and hear, which of the three is doing most of the work.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-shares',
      kind: 'concept',
      goal: 'Install the three-share model with conservation underneath it, attach the evidence you would look for to each share, and turn it on seeing and on color.',
      keyIdeas: [
        'THREE THINGS CAN HAPPEN WHERE A WAVE MEETS A MATERIAL, AND USUALLY MORE THAN ONE OF THEM DOES. When a light wave or a sound wave arrives at the surface of a material, the energy it is carrying has three places it can go. Some is REFLECTED: it comes back off the surface, into the space the wave came from. Some is ABSORBED: it goes into the material and stays there. Some is TRANSMITTED: it passes through the material and carries on out the other side. Those three shares together account for all of the energy that arrived -- none of it is created at the surface and none of it is destroyed there. So the useful question about a material is never "which one of the three happens", because usually at least two of them do. The useful question is "how is the arriving energy shared out between the three".',
        'ABSORBED ENERGY DOES NOT VANISH. IT USUALLY ENDS UP WARMING THE MATERIAL. Absorbed is the word that gets misread, because in everyday speech "soaked up" sounds like "gone". Energy that a surface absorbs sets the particles of that material moving a little faster, and a material whose particles are moving faster is a material that is a little warmer. WRONG: "The black paint absorbed the sunlight, so that energy is gone." CORRECT: "The black paint absorbed the sunlight, and the energy is now thermal energy in the paint, which is why the paint is hot." You already hold the rule underneath this: energy is transferred and transformed, never used up. Sound works the same way. Sound energy absorbed by a thick soft material ends up as a very small amount of thermal energy spread through the fibers -- far too little to feel, but that is where it went.',
        'WHICH SHARE IS BIGGEST DEPENDS ON THE MATERIAL AND ON THE KIND OF WAVE, AND THE SAME MATERIAL CAN TREAT LIGHT AND SOUND QUITE DIFFERENTLY. For light: a sheet of clear glass transmits most of what reaches it and reflects a little; shiny metal foil reflects most of it and transmits none; a dull black surface absorbs most of it. Now ask about sound and the answers move. That same closed pane of glass transmits only a small part of the sound that hits it, which is why the bus outside sounds muffled, while a heavy curtain that stops light almost completely lets a great deal of sound straight through. So "does it let waves through" is not a property a material has on its own. It is a question about one material and one kind of wave together, and you have to ask it again each time the wave changes.',
        'WE SEE MOST THINGS BY THE LIGHT THEY REFLECT. A few things make their own light: a lamp, a phone screen, a flame. Everything else you have ever looked at, you saw because light from somewhere else landed on it, and some of that light was reflected off it and traveled into your eyes. Take the light away and the seeing stops with it. In a room with no light at all, a white towel and a black towel look exactly the same, because neither one is sending anything to your eye. WRONG: "Give your eyes long enough to adjust and you can see in a completely dark room." CORRECT: "Eyes adjust to a DIM room, where a little light is still bouncing around. With no light at all there is nothing to adjust to." There is a second half to this, and it is the difference between seeing a thing and seeing IN a thing. A very smooth surface sends the light that reflects off it away in one tidy direction, so what you see in it is a picture of wherever that light came from -- which is why the street behind you shows up in a shop window. A rough surface, and nearly every ordinary surface is rough once you look closely enough, scatters the reflected light off in all directions at once, which is why you can see a painted wall from anywhere in the room instead of from one lucky spot.',
        'COLOR IS THE LIGHT A SURFACE SENDS BACK, NOT SOMETHING STORED IN THE SURFACE. Daylight, and the light from most lamps, is a mixture of many colors together. When that mixture lands on a surface, the surface absorbs some of the colors and reflects the others, and the ones it reflects are the ones that reach your eye. A red plastic chair reflects the red part of the mixture and absorbs most of the rest, and that is the whole reason it looks red. A white surface reflects nearly every color, so it looks like whatever light is falling on it. A black surface absorbs nearly all of them, which is also why a black car left out in the sun gets so much hotter than a white one parked beside it. Here is the test that shows the color is in the light coming back and not in the object: light that red chair with green light alone, with no red in it at all, and the chair has nothing red left to reflect. It looks almost black, and it stays that way for as long as the green lamp is the only light in the room.',
        'HOW TO ANSWER ANY QUESTION IN THIS LESSON. First, name the wave and name the material it is arriving at, and keep them straight -- light at a fabric is a different question from sound at the same fabric. Second, take the three shares one at a time and hunt for the evidence the situation gives you for each one. Evidence of REFLECTION: you can see the material, or you can see something else pictured in it, or the sound comes back to you. Evidence of ABSORPTION: the material warms up, or the sound dies away quickly without coming back. Evidence of TRANSMISSION: you can see through it, or somebody on the other side can hear it. Third, check that your three answers together account for everything that arrived and no more. If you have said that a surface reflects almost all of the light and also absorbs almost all of it, you have spent the same energy twice.',
      ],
      vocabulary: [
        { term: 'reflection', definition: 'the part of a wave\'s energy that comes back off a surface, into the space the wave arrived from.' },
        { term: 'absorption', definition: 'the part of a wave\'s energy that goes into a material and stays there, usually ending up as a small amount of thermal energy in it.' },
        { term: 'transmission', definition: 'the part of a wave\'s energy that passes through a material and carries on out the other side.' },
        { term: 'transparent', definition: 'a material that transmits most of the light reaching it, so you can see through it clearly.' },
        { term: 'opaque', definition: 'a material that transmits none of the light reaching it, so everything that arrives is either reflected or absorbed.' },
        { term: 'scattered reflection', definition: 'reflection off a rough surface, which sends the reflected light away in many directions at once instead of one.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-garden-hose-in-the-sun',
      kind: 'worked_example',
      problem:
        'A dark green rubber garden hose lies coiled on a pale concrete path in full sunlight all afternoon. Three things are true about it. From right across the garden you can see it easily, and it looks dark green. Where it lies in the sun the rubber feels hot to the touch, while a loop of the same hose lying in the shade of a wall feels cool. And where the hose crosses the pale concrete, you cannot see even a trace of the path through the rubber. Using those three facts, work out what the sunlight is doing where it meets the hose: how much of it is reflected, how much absorbed, and how much transmitted?',
      steps: [
        'Name the wave and name the material. The wave is the light arriving from the Sun; the material is the rubber of the hose. Each of the three facts in the question is a piece of evidence about one of the three shares, so take them one at a time rather than trying to see the whole answer at once.',
        'Fact one is evidence of REFLECTION. You can see the hose from across the garden, and a hose does not make its own light, so the light reaching your eyes from it is light that arrived as sunlight and came back off the surface. The color narrows it down: the hose looks green, so the part of the sunlight mixture that the rubber reflects is mainly the green part, and it looks DARK green rather than bright green, so it is not reflecting very much even of that.',
        'Fact two is evidence of ABSORPTION. The rubber in the sun is hot and the identical rubber in the shade is cool. The rubber is the same in both places, so the difference has to be the sunlight. Energy that went into the rubber did not stop existing; it became thermal energy in the rubber, and "hot" is what that feels like from outside. That also fits fact one, because a surface that reflects only a little of what lands on it has to be absorbing most of the rest.',
        'Fact three is evidence about TRANSMISSION, and it is a negative result. If any useful amount of light were passing through the rubber and coming out the far side, you would catch at least a hint of the pale concrete through the hose. You see none at all, so the transmitted share here is as near to nothing as makes no difference. Rubber this thick is opaque to light.',
        'Put the three together and check they account for everything. Nearly all of the sunlight landing on the hose is absorbed, a small part -- mainly the green part -- is reflected, and effectively none is transmitted. That uses up all of the arriving energy exactly once, and it fits all three facts. Notice what "usually more than one of the three" does NOT mean: it does not mean an equal share each. One of the three can be so small here that it is honest to call it zero.',
        'Now run the check a science answer needs, because there is no arithmetic here to redo. Look for clues of DIFFERENT KINDS that agree. What you can SEE says reflection is happening, and tells you which color is coming back. What you can FEEL says absorption is happening, and the cool loop in the shade rules out any other reason for the warmth, because that loop is the same rubber on the same afternoon. What you cannot see -- the concrete hidden behind the hose -- says transmission is not happening. Three different kinds of evidence, three different shares, and no two of them are the same kind of check.',
        'Then change exactly one thing and confirm the answer moves with it. Swap the dark green rubber hose for a clear plastic tube of the same thickness, lying on the same path in the same sunlight. Now the pale concrete shows through it plainly, so the transmitted share has gone from nearly nothing to most of the light. The tube is hard to pick out from across the garden, so the reflected share has fallen. And the tube stays far cooler than the rubber did, so the absorbed share has fallen too. One material swapped, all three shares moved -- which is what you would expect if the shares belong to the material and the wave together, and not to light on its own.',
      ],
      answer:
        'Nearly all of the sunlight that lands on the hose is absorbed, and that absorbed energy is why the sunlit rubber is hot while the shaded loop is cool. A small part is reflected, mainly the green part of the sunlight mixture, and that reflected light is what makes the hose visible and makes it look dark green. Effectively none is transmitted, which is why the pale concrete cannot be seen through the rubber at all. Swap in a clear plastic tube of the same thickness and all three shares move at once: most of the light is transmitted, little is reflected, and the tube stays cool.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-empty-living-room',
      kind: 'worked_example',
      problem:
        'A family is moving out of an apartment. On the last day the living room is completely empty: the rugs, the sofa and the curtains have all been carried out, while the walls, the ceiling and the size of the room are exactly as they were. Saying one word out loud in the empty room sounds startlingly different from how it sounded a week earlier. The voice is boomy, and each word seems to hang in the air for a moment before it dies away. The neighbors on the other side of the wall report that they can hear the voice through the wall, just as clearly as they always could. Explain, in terms of what happens where a sound wave meets a material, why the empty room sounds so different -- and say what happened to the sound energy back when the room was furnished.',
      steps: [
        'Name the wave and name the materials. The wave is sound, spreading out from the person speaking in every direction. The materials it meets are the surfaces of the room. A week ago those included soft rugs, a padded sofa and heavy curtains; today they are bare plaster walls and a bare wooden floor. The room did not change and the walls did not change. The materials the sound meets changed.',
        'Take REFLECTION first. A hard, heavy, smooth surface reflects most of the sound energy that reaches it straight back into the room. In the empty room a word you say crosses the room, reflects off a wall, crosses back, reflects again, and goes round like that many times before the last of its energy has been absorbed. Each of those crossings takes a little time, and the sum of them is what you are hearing as the word hanging in the air after you have stopped speaking.',
        'Now ABSORPTION, which is what the soft things were doing. A thick soft material sends very little sound back. The sound energy works its way into the tangle of fibers and stays there, so a wave that meets a rug or a curtain loses most of its energy on that single meeting instead of carrying on around the room. With rugs, curtains and a sofa in place, a word had handed over most of its energy to the furnishings after only a few crossings, so it did not hang on and the room did not sound boomy.',
        'This is the step to be careful with, because the everyday words point the wrong way. WRONG: "The soft furniture soaked the sound up and destroyed it." CORRECT: "The soft furniture absorbed the sound energy, and that energy became a very small amount of thermal energy in the fibers of the material." Energy is transferred and transformed, never used up, and that rule holds here exactly as it holds everywhere else. The amount is far too small to feel, which is why absorbing a room full of sound does not leave a rug noticeably warm -- but it is where the energy went, and "it was destroyed" is not an available answer.',
        'TRANSMISSION is the third share, and the question tells you it barely changed: the neighbors hear the voice through the wall today just as they did before. That makes sense. What carries sound into the next apartment is the wall, and the wall is the one thing that was not carried out. Taking the soft things away changed how much energy came back into the room and how much of it stayed in the furnishings. It did not change the path through the wall.',
        'Run the check with clues of DIFFERENT KINDS. First, what changed and what did not: the walls, the ceiling and the size of the room are all the same, and only the materials in the room were removed, so the materials have to be the cause. Second, the behavior in time: the new thing is that a word hangs on, which points at energy making many trips before it is all absorbed, and a sound that is merely louder would not hang on longer. Third, what the neighbors report: nothing on their side changed, so whatever changed is about energy staying inside the room, not about energy leaving it. Three clues of three different kinds, one explanation.',
        'Then change one thing back and confirm the answer moves. Carry a single heavy rug back in and lay it on the floor. The hanging-on gets noticeably shorter straight away, while the neighbors notice no difference at all. One material returned, one share of the energy changed, and the sound changed in the direction the explanation predicts. And it rules out the alternatives: if the booming had been caused by the room somehow being bigger, or by the bare plaster having dried out, laying one rug on the floor could not have changed anything.',
      ],
      answer:
        'The room sounds different because the materials the sound meets changed. Hard bare plaster and a bare floor reflect most of the sound energy back into the room, so a word crosses it many times before all of its energy has been absorbed, and that is the boomy, hanging-on sound. The rugs, sofa and curtains had been absorbing most of the energy of any wave that met them, so words died away after very few crossings and did not hang on. That absorbed energy was not destroyed: it became a very small amount of thermal energy in the fibers of the soft materials. The transmitted share is unchanged, because the wall the neighbors hear through is the one thing that was not removed.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-tent-in-the-sun',
      kind: 'try_yourself',
      problem:
        'A camping tent is made from one layer of thick, dark blue fabric. It is fully zipped shut, with no gaps anywhere. On a sunny afternoon, someone sitting inside finds that it is dim in there but not dark -- there is easily enough light to read by. From outside, the tent is simple to spot from right across the field as a patch of dark blue, and the fabric on the sunlit side feels distinctly warmer than the fabric on the shaded side. Which statement best describes what the sunlight is doing where it meets the tent fabric?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All of the sunlight that reaches the fabric passes straight through it, which is why there is light to read by inside, and the sunlit side feels warmer only because the air on a sunny side of a tent is warmer than the air in the shade.' },
        { id: 'b', text: 'Some of the sunlight is reflected and the rest of it passes through, and none of it at all is absorbed, because absorbing light is something that only a black surface can do and this fabric is dark blue rather than black.' },
        { id: 'c', text: 'Every bit of the sunlight that reaches the fabric is reflected back off it, which is exactly why the tent is so easy to spot from across the field, and the light inside must be getting in around the zip rather than through the cloth.' },
        { id: 'd', text: 'Some of the sunlight is reflected, which is why you can see the tent and see that it is blue; some is absorbed and warms the fabric; and a small part is transmitted through it, which is why it is dim inside rather than dark.', correct: true },
      ],
      expectedAnswer: 'Some of the sunlight is reflected, which is why you can see the tent and see that it is blue; some is absorbed and warms the fabric; and a small part is transmitted through it, which is why it is dim inside rather than dark.',
      hints: [
        'Take the three shares one at a time and ask what evidence the question hands you for each. There is something you can see from outside the tent, something you can feel on the fabric itself, and something the person inside notices. Each of those points at a different share.',
        'A real material almost never does only one of the three. Before you choose, check that your answer accounts for all three facts at once: the color you can see from across the field, the warmth of the sunlit side compared with the shaded side, and the light that is getting in.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-shirts-under-a-blue-lamp',
      kind: 'try_yourself',
      problem:
        'A clothing store lights one display with a lamp that gives out blue light only -- there is no other color in it, and no other light reaches that display. Two shirts hang side by side in it. In ordinary daylight, one of them looks white and the other looks yellow. Under the blue lamp the white shirt looks blue, and the yellow shirt looks almost black. Why does the yellow shirt look almost black under that lamp?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A yellow surface reflects the yellow part of whatever light lands on it and absorbs the other colors, and this lamp is sending out no yellow light at all, so there is almost nothing for the shirt to reflect back toward your eyes.', correct: true },
        { id: 'b', text: 'The colored lamp has changed the color of the dye in the fabric for as long as the shirt stands under it, because a material shows its real color only in daylight and takes on a new color of its own under any colored light.' },
        { id: 'c', text: 'A blue lamp is much dimmer than daylight, so both shirts are harder to see under it, and the yellow one looks darkest of the two because yellow is the palest color and the palest colors are always the first to disappear as light gets dimmer.' },
        { id: 'd', text: 'The yellow shirt is transmitting the blue light straight through the fabric and out the other side instead of reflecting any of it, so none of the light from the lamp comes back off the shirt toward your eyes.' },
      ],
      expectedAnswer: 'A yellow surface reflects the yellow part of whatever light lands on it and absorbs the other colors, and this lamp is sending out no yellow light at all, so there is almost nothing for the shirt to reflect back toward your eyes.',
      hints: [
        'Start with what the lamp is putting out, and then ask what a yellow surface does with each color that lands on it. The white shirt is your control here: it reflects nearly every color, which is why it looks like whatever light is falling on it.',
        'The color you see is the light that comes back off the surface into your eye. If a surface reflects only one color, and that color is not in the light arriving, what is left to come back?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-rooms-off-a-hallway',
      kind: 'try_yourself',
      problem:
        'Two rooms of the same size open off the same hallway, and their two doors are identical and both shut. Room 1 has bare hard walls and a bare hard floor. Room 2 has a thick soft carpet and heavy soft hangings over most of its walls. The same speaker plays the same music at the same setting in each room in turn. Standing out in the hallway, you hear the music from room 1 clearly, and the music from room 2 only faintly. A student says this proves that the two doors must be different after all. What is the better explanation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The soft carpet and the hangings in room 2 reflect the sound energy back toward the speaker so strongly that very little of it ever reaches the door of that room, so there is almost nothing left at the door to be transmitted into the hallway.' },
        { id: 'b', text: 'The doors can be identical. In room 2 the carpet and the hangings absorb a large share of the sound energy every time a wave meets them, so far less sound energy is left arriving at the door to be transmitted through it into the hallway.', correct: true },
        { id: 'c', text: 'Sound cannot pass through a solid wooden door at all, so everything you hear out in the hallway must have come through the thin gap underneath the door, and the thick carpet in room 2 is covering more of its gap than the bare floor in room 1 is.' },
        { id: 'd', text: 'The hard walls in room 1 add extra sound energy to the music every time a wave bounces off them, so that room ends up louder than the speaker on its own could ever make it, and it is that added energy the hallway is hearing.' },
      ],
      expectedAnswer: 'The doors can be identical. In room 2 the carpet and the hangings absorb a large share of the sound energy every time a wave meets them, so far less sound energy is left arriving at the door to be transmitted through it into the hallway.',
      hints: [
        'Before any sound can reach the hallway it has to survive the room it started in. Ask what the soft materials do to the sound energy each time a wave meets them, and how much energy is still traveling around room 2 by the time a wave arrives at the door.',
        'Check each explanation against a rule you already hold: energy is not created at a surface, and it is not destroyed there either. An explanation that has a wall adding energy to a wave, or has sound simply ceasing to exist, has broken that rule before it starts.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-color-and-blocked-means-absorbed',
      kind: 'misconception_check',
      question:
        'A student writes: "A blue mug is still blue in a completely dark room, because the blue is in the mug itself. And a sheet of shiny foil does not let any light through it, so the foil must be absorbing all the light that lands on it." Two different things are wrong there. What are they?',
      commonErrors: [
        {
          answer: 'A blue mug is still blue in a completely dark room, because the blue is in the mug itself.',
          misconception:
            'Treating color as a substance sitting in the object and waiting to be looked at, rather than as a description of the light the object is sending back. It is a reasonable thing to believe, because in ordinary life the light is almost always there and the mug does look the same every single time you see it.',
          correctsTo:
            'What the mug really has is a surface that reflects the blue part of whatever light lands on it and absorbs most of the other colors. That property of the surface does not go away in the dark. But color is what reaches your eye, and in a room with no light at all nothing reaches your eye from the mug, so there is no color to see -- the mug, the walls and everything else in the room are equally invisible. The test that settles it does not even need a dark room. Light the mug with red light alone, with no blue in it, and the mug has nothing it can reflect: it looks almost black, and it stays that way for as long as the red lamp is the only light there. If the blue were in the mug rather than in the light coming back off it, changing the lamp could not possibly change what you see.',
        },
        {
          answer: 'A sheet of shiny foil does not let any light through it, so the foil must be absorbing all the light that lands on it.',
          misconception:
            'Reading "no light gets through" as "the light must have gone into the material". Transmission and absorption are the two shares that both end with no light coming out the far side, so it is easy to collapse blocked and absorbed into one idea and forget that reflection is also a way of stopping light.',
          correctsTo:
            'There are three shares, not two, and finding that no light gets through only tells you that the transmitted share is near zero. It does not tell you whether the rest was reflected or absorbed. Shiny foil reflects almost all of the light that reaches it and absorbs very little, which is exactly why it throws a bright glare and why you can make out a blurry version of yourself in it. A dull black sheet of card blocks the light just as completely and does it the opposite way round, by absorbing nearly all of it and reflecting almost none. WRONG: "It does not let light through, so it is absorbing the light." CORRECT: "It does not let light through, so the light is either reflected or absorbed -- and which of those it is settles what happens next." Leave both sheets out in the sun and the black card gets far hotter than the foil, because the energy the foil sent straight back is energy the card kept.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Where a wave meets a material, its energy is shared out three ways: reflected back off the surface, absorbed into the material, or transmitted through to the other side.',
        'The three shares together account for all of the energy that arrived. None of it is created at the surface and none of it is destroyed there.',
        'Almost every real surface does more than one of the three at once, and sometimes one share is so small that it is honest to call it zero.',
        'Absorbed energy does not vanish. It usually ends up as thermal energy in the material, which is why a dark surface left in the sun gets hot.',
        'Which share is biggest depends on the material AND on the kind of wave. A closed pane of glass transmits most of the light and only a little of the sound; a heavy curtain does close to the opposite.',
        'We see most objects by light that came from somewhere else, landed on them, and was reflected off them into our eyes. With no light in a room at all, there is nothing to see.',
        'A smooth surface reflects light away in one direction, so what you see in it is a picture of somewhere else. A rough surface scatters the reflected light in all directions, so you can see the object itself from anywhere in the room.',
        'Color is the light a surface sends back: a red object reflects the red part of the mixture and absorbs most of the rest. Light it with green light alone and it looks almost black.',
        'To work out what a material is doing to a wave: name the wave and the material, then look for the evidence for each share separately -- what you can see, what you can feel, and what gets through to the other side.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Reflection, Absorption & Transmission' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
