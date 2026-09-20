/**
 * Grade 8 Science (Physical Science) — Refraction: Bending Light at a
 * Boundary.
 *
 * CONCEPT-LED row 10.2 (NGSS MS-PS4-2, DCI PS4.B). The student has no
 * procedure to lean on: the lesson builds one mental model -- light runs in
 * straight lines inside a material and changes direction only at the boundary
 * where it crosses into another one, because that is where its speed changes
 * -- and then makes that model do real work on things the student has already
 * seen and mis-explained. Everything else in the lesson is that one idea
 * applied: to how a submerged object looks, and to what a curved piece of
 * glass does to a whole beam at once.
 *
 * The three traps it is built to kill are (a) "the water pushes the light
 * over", which treats the surface as something that shoves a ray rather than
 * as the place where a speed changes; (b) "light speeds up in water, the way
 * sound does", which is a true fact about sound carried across to light,
 * where the comparison runs the other way; and (c) "the straw is somewhere
 * other than where it looks" read as a fact about the straw rather than about
 * the path the light took to the eye.
 *
 * SCOPE GUARD: this plan explains that light travels in straight lines except
 * where it crosses from one transparent material into another, where its path
 * bends (refracts) because its speed changes -- why a straw looks broken in a
 * glass, why a pool looks shallower than it is -- and describes qualitatively
 * how a lens uses refraction to bring light together or spread it out. The
 * scope cell's withheld clause, verbatim: "Withholds Snell's law, ray-diagram
 * construction and the thin-lens equation (`ap-physics2-optics.ts`,
 * `ap-physics-2-optics.ts`)." The cell carries NO lineage clause -- there is
 * no `m6*`/`m7*` predecessor for it to name, and none is invented here. What
 * the boundary means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 10.1 (reflection, absorption, transmission) is
 *     assumed, not re-taught: this file uses "you see a thing because light
 *     from it reaches your eye" as a sentence the student already holds, and
 *     never classifies a material as reflecting, absorbing or transmitting,
 *     never explains why a red object is red, and never mentions a mirror or
 *     an echo. Row 9.3 (a wave's speed is set by the medium) is likewise
 *     assumed and is the reason the speed change may simply be asserted here.
 *     Row 10.3 (light versus sound, and the electromagnetic spectrum) is NOT
 *     entered: sound reaches the authored body in one place only -- the second
 *     misconception check -- plus the single recap line that restates it, and
 *     in both it is nothing but the speed comparison that runs opposite to
 *     light's. Neither place says that sound needs a medium, neither mentions
 *     the vacuum of space, and neither names a member of the electromagnetic
 *     spectrum; the words radio, microwave, infrared, ultraviolet, X-ray,
 *     gamma and rainbow appear nowhere in the authored body, and no color is
 *     separated out of white light anywhere. (The chain loIds and this guard
 *     itself necessarily carry some of those words; the absence claims are
 *     about the authored body.)
 *   - EXAMPLES BURNED BY THE OBJECTIVE. Part (i) of the scope cell, which is
 *     copied verbatim into the student-facing `los[0].description`, names the
 *     straw that looks broken in a glass and the pool that looks shallower
 *     than it is. Both are therefore answerable from the objective and are
 *     used ONLY in teaching segments -- the pool in the hook, the straw in the
 *     first worked example. Neither appears in any item, and a later editor
 *     should not "helpfully" move one into one. The three item specimens are
 *     fresh: a beam crossing into a tank of water, two beams meeting a glass
 *     block square-on and at a slant, and a second lens thinner at its middle
 *     than at its edges.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. There is no rainbow, no sky, no
 *     atmosphere, no mirage and no weather anywhere in the authored body. The
 *     only thing beyond the room that the body mentions at all is the sun, and
 *     only inside the second worked example, where it is the reason the rays
 *     arriving at the lens are parallel; nothing else about the sun is said.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row. The eye appears only as the place the light arrives and the
 *     point at which a straight line is assumed backward; no part of the eye
 *     is named, the eye's own lens is never mentioned, and vision is never
 *     treated as a body system.
 *   - HS CHEMISTRY boundary: nothing in this row is chemistry. No substance is
 *     identified, no particle model of the material is given, and the word
 *     density does not appear -- the materials here differ only in how fast
 *     light goes through them.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): every bend in this file is described in words
 *     -- toward or away from the line that stands straight up out of the
 *     surface, or toward the thicker part of a wedge -- and never as an angle.
 *     No angle is measured, named or compared as a number, so the formula this
 *     row stops short of is Snell's law -- the sine relation between the angle
 *     of arrival and the angle of departure at a surface, which is not written
 *     out even here -- together with every index of refraction as a number. No ray diagram is
 *     constructed and no ray is drawn or measured; the one tracing move in the
 *     file is the instruction to trace a straight line backward from the
 *     direction light was going when it reached the eye, which is an
 *     explanation of what the eye assumes, not a construction. No focal
 *     length, object distance or image distance is given as a quantity -- the
 *     lens in the second worked example is held "about a hand's width" above
 *     the paper, which describes a setup rather than measuring it -- so the
 *     thin-lens equation is stopped short of as well. Total internal
 *     reflection, the critical angle, dispersion and interference do not
 *     appear.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every ray,
 * surface and lens in this file is written out in words, with the direction of
 * every bend stated relative to the line that stands straight up from the
 * surface, and every item is solvable from the text printed inside it. Never
 * write "see the ray diagram", and never assume the student has a glass block,
 * a lens, a laser pointer or a tank of water in front of them -- the
 * investigations described here are described, never assigned.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 10.1 -> 10.2 ->
 * 10.3 (`reflection-absorption-and-transmission` before it,
 * `light-versus-sound-and-the-electromagnetic-spectrum` after it), and both
 * arrays carry those real loIds. The two hand-written exemplars populate
 * theirs too, although their own doc comments say the arrays are empty.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U10_REFRACTION_BENDING_LIGHT_AT_A_BOUNDARY: LessonPlan = {
  id: 'evelyn.ms.m8sci.refraction-bending-light-at-a-boundary.v1',
  title: 'Refraction: Bending Light at a Boundary',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.refraction-bending-light-at-a-boundary',
      standard: 'M8SCI-10.2',
      description:
        'Explain that light travels in straight lines except where it crosses from one transparent material into another, where its path bends (refracts) because its speed changes -- why a straw looks broken in a glass, why a pool looks shallower than it is -- and describe qualitatively how a lens uses refraction to bring light together or spread it out (NGSS MS-PS4-2, DCI PS4.B).',
    },
  ],
  prerequisites: ['m8sci.reflection-absorption-and-transmission'],
  followUps: ['m8sci.light-versus-sound-and-the-electromagnetic-spectrum'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a thing the student has already seen and already explained wrongly -- their own legs looking short and snapped at the water line -- so that the lesson has something to correct rather than something to introduce.',
      script:
        'You are standing in the shallow end of a swimming pool, looking down at your own feet. They are not where they should be. Your legs look short, and they look bent at the exact line where the water starts, as though someone had snapped them at the surface and slid the bottom halves forward. Step out onto the tiles and your legs are fine. Step back in and they are wrong again. Here is the part worth noticing. The water is doing nothing at all to your legs. It is doing something to the light. The same thing makes the bottom of a pool look closer to the surface than it really is, which is why a person who is certain they can stand up at the far end is sometimes badly wrong about that. One thing happens to light at the moment it crosses out of water and into air, and that one moment is enough to put a whole object somewhere it is not. Today you will find out what that one thing is, which way it goes, and why a curved piece of glass can use it to gather a whole beam of sunlight into a single bright spot.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-refraction-at-a-boundary',
      kind: 'concept',
      goal: 'Install the model in the order it has to be used: straight lines inside one material, a change of speed at the boundary as the cause of the bend, which way the bend goes and the one case where there is none, the apparent-position consequence, and the lens as the same rule applied to a curved surface.',
      keyIdeas: [
        'INSIDE ONE MATERIAL, LIGHT GOES IN STRAIGHT LINES. Light crossing a room, a tank of clear water or a block of glass travels in straight lines the whole way through. It does not curve, it does not sag and it does not wander. The only place its direction changes is a BOUNDARY: the surface where one transparent material ends and a different one begins. A tank of water has two of those on the path of a beam that goes in and comes out again -- the surface where the light enters and the surface where it leaves -- and a bend can happen at each one, with a straight run in between. So the first move in any question of this kind is to find the boundaries and ignore everything in between, because nothing happens in between.',
        'THE BEND HAPPENS BECAUSE THE SPEED CHANGES, AND NOTHING TOUCHES THE LIGHT. Light travels fastest where there is nothing in its way at all, about 300,000 kilometers per second, and it travels more slowly inside a transparent material. It is slower in water than in air, and slower in glass than in air. When light crosses a boundary, its speed changes at that surface, and that change of speed is what turns its path. This is the sentence to be careful with. WRONG: "The water is heavier than the air, so it pushes the light over to one side." CORRECT: "Nothing pushes the light. The light travels at a different speed on the far side of the surface, and a path that changes speed at a slant changes direction there." The name for the whole effect -- the change of direction at a boundary because of a change of speed -- is REFRACTION.',
        'WHICH WAY IT BENDS, AND THE ONE CASE WHERE IT DOES NOT BEND AT ALL. Direction needs a reference, so use this one: the line that stands straight up out of the surface at the exact point where the light arrives. Going from a faster material into a slower one at a slant -- air into water, air into glass -- the path bends TOWARD that upright line. Going the other way, from a slower material into a faster one at a slant -- water into air, glass into air -- it bends AWAY from that line. And now the case that decides whether a student really has the idea: light that arrives square-on, traveling exactly along that upright line, does not bend at all. Its speed still changes, because the material still changed. There is simply no side of the beam that meets the surface ahead of the other side, so there is nothing to turn it. Refraction needs both a change of speed AND an arrival at a slant.',
        'REFRACTION IS WHY A THING CAN LOOK LIKE IT IS SOMEWHERE IT IS NOT. You see a thing because light from it reaches your eye. Your eye has no way of knowing where that light has been; it only knows the direction the light was going when it arrived, and it assumes, always, that the light came in a straight line all the way. When the light has actually bent at a surface on its way to you, that assumption is wrong, and the thing appears along the straight line traced backward from the direction the light was last going -- which is not where the thing is. That is the whole of the pool. Light leaves the bottom of the pool, bends away from the upright line as it escapes into the air, and reaches your eye traveling in a direction that traces back to a point higher than the real bottom. So the pool looks shallower than it is. Nothing moved. The light took a bent path and your eye read it as a straight one.',
        'A LENS IS THE SAME RULE APPLIED TO A CURVED SURFACE, TWICE. A lens is a piece of transparent material whose surfaces are curved rather than flat, so that different parts of a wide beam meet the surface at different slants and are turned by different amounts. The rule that makes a lens predictable is this one: when light crosses a wedge of transparent material at a slant, it is turned TOWARD the thicker part of that wedge, first at the surface where it enters and again at the surface where it leaves. A lens that is thicker at its middle than at its edges therefore turns every ray toward its middle, and a wide beam of parallel rays passing through it is brought together at a single point beyond it. Compare that with a flat sheet of window glass, whose two surfaces are parallel: there the light bends toward the upright line going in and away from it by the same amount coming out, so it leaves traveling in the direction it started, shifted a little to one side and gathered nowhere.',
        'HOW TO ANSWER ANY REFRACTION QUESTION. First, name the two materials and say which of them light travels more slowly in. Second, find the boundary, and be sure it is the only place anything happens. Third, ask how the light arrives there: at a slant, so it turns, or square-on, so it does not. Fourth, say which way it turns -- toward the upright line if it is entering the slower material, away from it if it is leaving one. Fifth, and only if the question is about how something LOOKS, trace the straight line backward from the direction the light was going when it reached the eye, and say where that line says the thing is. Run those five in order and the awkward cases stop being awkward.',
      ],
      vocabulary: [
        { term: 'refraction', definition: 'the change in direction of light where it crosses at a slant from one transparent material into another, caused by the change in its speed at that boundary.' },
        { term: 'transparent', definition: 'letting light pass through, so that things can be seen through it -- air, clear water, window glass and clear plastic are all transparent.' },
        { term: 'boundary', definition: 'the surface where one material ends and another begins; the only place along a light path where the direction can change.' },
        { term: 'normal line', definition: 'the imaginary line that stands straight up out of a surface at the point where light meets it, used to say which way a bend goes; it is a reference line, not a real thing.' },
        { term: 'lens', definition: 'a piece of transparent material with curved surfaces, which refracts the parts of a wide beam by different amounts and so brings the beam together or spreads it out.' },
        { term: 'apparent position', definition: 'where an object looks as though it is, found by tracing the light straight back from the direction it was going when it reached the eye; it differs from the real position whenever the light was refracted on the way.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-straw-looks-broken',
      kind: 'worked_example',
      problem:
        'A straight plastic straw stands at a slant in a tall glass of clear water, leaning against the rim, with its lower half under the water and its upper half in the air. Looked at from the side, the straw does not look straight. It looks as though it has been snapped at the water line, with the underwater part shifted to one side of where the upper part points. A student says the water must be squashing the straw. Explain what is actually happening, and how you would show that the straw itself is fine.',
      steps: [
        'Name the two materials and say which one light is slower in. The light that shows you the underwater part of the straw has to leave the water and cross into the air before it can reach your eye. So the two materials are water and air, and light travels more slowly in water than in air.',
        'Find the boundary. There is exactly one on this path: the flat top surface of the water. Below it the light runs in a straight line through the water; above it the light runs in a straight line through the air; the only place the direction can change is the surface itself. Notice that this already predicts something about what you see -- if the direction changes only at the surface, then the apparent snap should sit exactly at the surface and nowhere else.',
        'Say which way the light turns, and how it arrives. Light leaving the underwater part of the straw reaches the surface at a slant, because you are looking from the side rather than from straight overhead. It is crossing from the slower material into the faster one, so it bends AWAY from the line that stands straight up out of the water surface.',
        'Trace the line back, because this question is about how something looks. Your eye receives that light and assumes it came in a straight line the whole way. Trace that straight line backward and it does not arrive at the real underwater straw; it arrives beside it. So the underwater half is seen at an apparent position that is shifted from its real one, while the half in the air, whose light never crossed a boundary, is seen exactly where it is. Two halves of one straight straw, seen in two places that do not line up, with the mismatch at the surface. That is the snap. WRONG: "The water is squashing or bending the straw." CORRECT: "The straw is straight. The light from its lower half changed direction at the water surface, and the eye read that bent path as a straight one."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. WHERE the effect appears agrees: the apparent break sits exactly at the water line, not spread along the straw, which is what a boundary effect looks like and not what squashing would look like. WHAT THE OBJECT IS LIKE agrees: lift the straw out and it is straight, and run a finger down it while it is still under the water and it is straight under your finger too, so nothing has happened to the straw. And HOW IT DEPENDS ON THE VIEWER agrees: move your head around until you are looking down into the glass from as close to straight above the straw as you can get, and the apparent break shrinks away to almost nothing, because the light from the underwater half is now leaving the surface close to square-on and is barely turned at all. Three different kinds of evidence, one answer -- and the third kind is one that squashing could never produce, because an object that was really bent would look bent from every side.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Pour the water out and leave the straw leaning in the empty glass. Same straw, same glass, same light, same viewing position -- and the straw now looks perfectly straight, because there is no longer a water-to-air boundary on the path. Then pour water back in, but only half as deep. The apparent snap comes back, and it comes back at the new water line, lower down the straw. The effect follows the boundary, not the straw.',
      ],
      answer:
        'The straw is straight and nothing is happening to it. Light from the underwater half of the straw meets the top surface of the water at a slant and crosses from water into air, which is a change from a slower material to a faster one, so it bends away from the line that stands straight up out of the surface. Your eye assumes that light travels in a straight line all the way, traces the arriving light straight back, and places the underwater half beside where it really is, while the half in the air is seen exactly where it is. The mismatch appears at the surface, which is where the bend happened. Empty the glass and the straw looks straight again.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-magnifier-bright-spot',
      kind: 'worked_example',
      problem:
        'On a bright day, a magnifying glass -- a round piece of clear glass that is thicker at its middle than at its edges -- is held still, about a hand\'s width above a sheet of paper, with sunlight falling on it from above. A small, very bright spot appears on the paper, and the paper under the spot becomes warm. A student says the glass is making the sunlight stronger. Explain what the glass actually did to the light, and say what the student has wrong.',
      steps: [
        'Start with the light before it reaches the glass. The sun is so far away that the sunlight arriving at the glass is a wide patch of rays all traveling parallel to one another, spread across the whole width of the glass. Nothing about that patch is concentrated yet: the same light is falling on the paper beside the glass, and there it is just ordinary daylight.',
        'Apply the boundary rule at the first surface. Each ray meets the curved top surface of the glass at a slant -- a different slant at each place across the glass, because the surface is curved -- and crosses from air into glass, which is a change into a slower material. So each ray is turned, and the amount of the turn is different at different places across the glass. The way to keep track of all of them at once is the wedge rule: light crossing a wedge of transparent material at a slant is turned toward the thicker part of the wedge.',
        'Apply it again at the second surface, then read off the result. The rays cross the curved bottom surface on the way out, from glass back into air, and are turned toward the thicker part once more. For this glass the thick part is the middle, so every ray is turned inward toward the middle, and the rays that entered spread right across the wide face of the glass all arrive at one small place on the paper.',
        'Now say what the student has wrong. WRONG: "The glass makes the light stronger." CORRECT: "The glass does not make any light at all, and it adds nothing to the light that falls on it. It gathers the light from its whole wide face into a small spot, so all of that light arrives in one small place instead of being spread out." The spot is bright for the same reason it is warm: the light that used to land on a face the size of your palm is now landing on a patch the size of a pinhead. The total is the same light, delivered to a smaller place.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The AREAS agree: a wide face of glass, a tiny spot, and nothing bright anywhere else on the paper -- light gathered from somewhere has to have left somewhere. The SHADOW agrees: the paper immediately around the bright spot, in the glass\'s own shadow, is darker than the paper further away, which is exactly what you would see if the light that should have landed there had been redirected inward. And COVERING PART OF THE GLASS agrees: put your hand over half of the glass and the spot stays in the same place and keeps its shape, and only gets dimmer -- so every part of the glass was sending light to that same spot, which is what "gathered" means and is not what "made stronger" would predict.',
        'Second, change one thing and check that the answer moves the way it should. Swap the magnifying glass for a flat sheet of window glass of the same thickness, whose two surfaces are parallel instead of curved. The light still slows down inside it, and it still bends at each surface -- but at parallel surfaces the second bend undoes the first, so the rays leave still parallel to one another, shifted slightly to one side, and no spot forms at all. Same material, same sunlight, same height above the paper; only the shape of the surfaces changed, and the spot vanished. That is the evidence that the gathering comes from the curve of the surfaces and not from the glass being glass.',
      ],
      answer:
        'The glass did not make the sunlight stronger and did not add anything to it. Sunlight reaches the glass as a wide patch of parallel rays. Each ray refracts at the curved top surface as it crosses from air into the slower glass, and again at the curved bottom surface on the way out, and at both surfaces it is turned toward the thicker part of the glass, which for this lens is the middle. Every ray is therefore turned inward, and the light from the whole wide face of the glass is gathered into one small spot on the paper. The spot is bright and warm because the same amount of light is arriving in a much smaller place. Replace the lens with a flat sheet of window glass, whose surfaces are parallel, and the two bends cancel, the rays leave parallel, and there is no spot.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-where-the-path-changes',
      kind: 'try_yourself',
      problem:
        'A narrow beam of light travels through the air and enters a tank of still, clear water at a slant, then carries on through the water to the far wall of the tank. There is no dye in the water, no bubbles in it, and nothing floating in it. Which statement correctly describes the path the beam takes?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It runs in a straight line through the air, changes direction once at the water surface, and then runs in a new straight line through the water, because its speed changes only where it crosses from one material into the other.', correct: true },
        { id: 'b', text: 'It runs straight down to the surface and then curves more and more the deeper it goes, because the water presses harder the further down you go and turns the beam a little further round at every depth, so the curve is tightest near the bottom.' },
        { id: 'c', text: 'It runs in one straight line the whole way, through the air and the water alike, because the water is clear, and a clear material is one that lets light through without changing anything about it.' },
        { id: 'd', text: 'It changes direction at the surface and then changes direction a second time part way down, because the light gives up a little more of its speed with every centimeter of water it travels through, and each fresh loss of speed turns it again.' },
      ],
      expectedAnswer: 'It runs in a straight line through the air, changes direction once at the water surface, and then runs in a new straight line through the water, because its speed changes only where it crosses from one material into the other.',
      hints: [
        'Ask where the material the light is traveling through actually changes. The beam is in air, and then it is in water. How many places on its whole journey is that true of?',
        'Refraction happens where the speed changes, and the speed changes at the boundary. Inside one material the speed is the same at every point, so what is the only kind of path the light can take there?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-square-on-and-at-a-slant',
      kind: 'try_yourself',
      problem:
        'Two narrow beams of light travel through the air and meet the flat top surface of a thick glass block. Beam 1 arrives square-on, traveling exactly along the line that stands straight up out of that surface. Beam 2 arrives at a slant. Which statement correctly describes what each beam does?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both beams bend toward the line that stands straight up out of the surface, and both bend by the same amount, because the bending is decided by the two materials on either side of the boundary, and both beams are crossing the same boundary from air into glass.' },
        { id: 'b', text: 'Beam 1 carries straight on into the glass with no change of direction, while beam 2 bends toward the line that stands straight up out of the surface, and both beams travel more slowly once they are inside the glass.', correct: true },
        { id: 'c', text: 'Beam 1 bends and beam 2 does not, because a beam arriving square-on drives into the full thickness of the glass and is turned the most by it, while a slanted beam only grazes the surface and slides on through in the direction it was already going.' },
        { id: 'd', text: 'Neither beam changes direction and neither changes speed, because glass is transparent, and a transparent material is one that lets light pass through it exactly as it arrived, which is why you can see through a window clearly.' },
      ],
      expectedAnswer: 'Beam 1 carries straight on into the glass with no change of direction, while beam 2 bends toward the line that stands straight up out of the surface, and both beams travel more slowly once they are inside the glass.',
      hints: [
        'Refraction needs two things at once: a change of speed, and an arrival at a slant. Check each beam against both of them separately, and do not let a missing second condition cancel the first one.',
        'Think about what turning would even mean for a beam arriving square-on. No side of it reaches the surface ahead of any other side, so there is nothing to turn it -- and ask yourself whether that has any bearing at all on how fast it goes once it is inside.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-second-lens-thinner-in-the-middle',
      kind: 'try_yourself',
      problem:
        'A wide beam of light, whose rays all travel parallel to one another, is sent through a thin lens of clear plastic that is thicker at its middle than at its edges, and beyond that lens the rays come together at a single point. The same beam is then sent through a second lens, cut from the same clear plastic and the same distance across, but thinner at its middle than at its edges. What do the rays do after passing through the second lens, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They come together at a point beyond it, exactly as they did with the first lens, because both lenses are cut from the same clear plastic, and it is the material a lens is made of, rather than the shape it is cut to, that decides how the light is turned.' },
        { id: 'b', text: 'They carry straight on in the direction they were already going, because the light bends one way as it enters the plastic and then bends back by the same amount as it leaves again, so that for any lens the two bends cancel each other out.' },
        { id: 'c', text: 'They bend away from one another and go on spreading out, because at each surface the light is turned toward the thicker part of the plastic it is crossing, and in this lens the thick part is at the edges.', correct: true },
        { id: 'd', text: 'They bend away from one another and go on spreading out, because the thin middle leaves less plastic in the way of the light, and light always fans outward when the material in front of it gets thinner.' },
      ],
      expectedAnswer: 'They bend away from one another and go on spreading out, because at each surface the light is turned toward the thicker part of the plastic it is crossing, and in this lens the thick part is at the edges.',
      hints: [
        'The rule does not mention middles or edges at all. It says which way light is turned when it crosses a wedge of transparent material at a slant: toward the thick side of the wedge. Apply that rule at the top surface and again at the bottom surface of this lens.',
        'More than one of these answers predicts the rays spreading out, so the prediction on its own cannot settle it and the reason has to be right too. Ask which reason would still hold if the lens were cut from a different clear material, and which one depends on there simply being less material in the way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-the-water-pushes-it',
      kind: 'misconception_check',
      question:
        'A student writes: "Light bends when it goes into water because water is heavier than air and pushes the light over to one side. And light must travel faster in water than in air, the way sound does." Two separate things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Light bends because the water is heavier and pushes it over to one side.',
          misconception:
            'Treating the surface as something that shoves the light, because a change of direction feels as though it needs a push -- and water really is heavier than the same volume of air, so "the water pushed it" sounds like it is explaining something.',
          correctsTo:
            'Nothing touches the light and nothing pushes it. What changes at the surface is the SPEED: light travels more slowly in water than in air, and a path whose speed changes at a slant changes direction there. The test that settles it is the square-on case. Send a beam straight down into the water, along the line that stands straight up out of the surface, and it slows down by exactly as much as a slanted beam does -- and it does not turn at all. A push would still be a push whichever way the beam was pointing, so a push cannot explain a bend that disappears the moment the beam arrives square-on. WRONG: "The water pushes the light over." CORRECT: "The light changes speed at the surface, and it turns only if it arrives at a slant."',
        },
        {
          answer: 'Light travels faster in water than in air, the way sound does.',
          misconception:
            'Carrying a true fact about sound across to light. Sound really does travel faster through water and through steel than through air, so the transfer feels safe -- but the two comparisons run in opposite directions, and this is the error that makes every prediction come out backward.',
          correctsTo:
            'Light travels fastest where there is nothing in its way at all, about 300,000 kilometers per second, and more slowly inside a transparent material: slower in water than in air, and slower in glass than in air. Sound goes the other way, moving faster through water and through steel than through air. So for light, going from air into water is going into a SLOWER material, and that is why a slanted beam turns toward the line that stands straight up out of the surface as it enters, and away from that line when it leaves the water again. Get the speed comparison backward and every direction in this lesson comes out reversed. WRONG: "Water carries waves better, so light must speed up in it." CORRECT: "Sound speeds up in water and light slows down in it, and refraction follows the light rule, not the sound rule."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Inside one material light travels in straight lines. The only place its direction changes is a boundary, where one transparent material ends and another begins.',
        'Refraction is the change of direction at a boundary, and the cause is the change of SPEED there. Nothing touches the light and nothing pushes it.',
        'Light travels fastest where nothing is in its way, about 300,000 kilometers per second, and more slowly in a transparent material. It is slower in water than in air, and slower in glass than in air.',
        'Sound runs the opposite way -- faster in water and in steel than in air. Refraction follows the light rule, not the sound rule.',
        'Entering a slower material at a slant, light bends TOWARD the line that stands straight up out of the surface. Leaving a slower material at a slant, it bends AWAY from that line.',
        'Light arriving square-on does not bend at all, even though its speed still changes. Refraction needs a change of speed AND an arrival at a slant.',
        'Your eye assumes that light came in a straight line. When the light bent on the way, the object is seen along that straight line traced backward, which is why a pool looks shallower than it is and a straw looks snapped at the water line. Nothing moved; the light took a bent path.',
        'A lens has curved surfaces, so different parts of a beam are turned by different amounts. At each surface the light is turned toward the thicker part of the material, so a lens thicker at its middle gathers a parallel beam into a point.',
        'To answer any refraction question: name the two materials and the slower one, find the boundary, ask whether the light arrives at a slant or square-on, say which way it turns, and only then trace the line back to say where something looks.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Refraction: Bending Light at a Boundary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
