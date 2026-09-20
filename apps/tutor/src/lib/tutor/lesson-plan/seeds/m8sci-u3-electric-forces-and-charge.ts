/**
 * Grade 8 Science (Physical Science) — Electric Forces & Charge.
 *
 * Row 3.2 (NGSS MS-PS2-3), concept-led. The student has no procedure to lean
 * on here: the whole lesson builds one mental model -- matter carries two
 * kinds of charge, like kinds push apart and opposite kinds pull together,
 * and rubbing does not make charge but moves electrons from one object onto
 * the other -- and then makes that model survive the case that breaks it for
 * most students, a rubbed balloon sticking to a wall nobody touched.
 *
 * The three traps it is built to kill are (a) rubbing-creates-charge, the
 * belief that the rubbing manufactures negative charge out of nothing and
 * leaves the other surface alone; (b) the-wall-becomes-charged, the belief
 * that the balloon must have handed the wall a charge in order to stick to
 * it; and (c) the belief that a charged object can only pull on something
 * that is already charged, so the wall and the paper bits must have been
 * charged first. All three come apart on the same two facts -- charge is
 * moved and never made, and charges inside a neutral object can shift a
 * little way in place -- which is why the concept segment sets them out
 * together and the misconception check takes the first two in one breath.
 *
 * SCOPE GUARD: this plan explains that objects carry positive or negative
 * charge, that like charges repel and opposite charges attract, that rubbing
 * transfers charge (the balloon on the wall), and identifies from described
 * data which factors change the strength of an electric force -- amount of
 * charge and distance apart. Its scope cell's lineage and withheld clauses,
 * verbatim: "(first of two lessons sharing MS-PS2-3, split by force type)";
 * "Withholds Coulomb's law (`ap-physics2-electrostatics.ts`) and ALL current
 * electricity, circuits and V = IR (`ap-physics2-circuits.ts`; see sign-off
 * 6)." What that means at each edge, and what is deliberately ALLOWED there.
 * Every absence claimed below is an absence from the BODY of the plan -- the
 * word naming each one necessarily occurs here in the guard itself, and the
 * two chain loIds necessarily contain their own row's words -- "magnetic" and
 * "electromagnets" in `followUps`, "gravity", "mass" and "weight" in
 * `prerequisites`:
 *   - MAGNETIC FORCES are row 3.3, the other half of MS-PS2-3. This file is
 *     electric charge only: no magnet, magnetic pole, iron or electromagnet
 *     appears anywhere in the body, and no comparison is drawn between the
 *     two kinds of force.
 *   - FIELDS are row 3.4. The word "field" does not appear anywhere in the
 *     body. What IS deliberately allowed here is the plain observation that
 *     the force acts across a gap while the objects are still apart -- the
 *     balloon starts moving toward the wall before it touches, and the
 *     hanging ball is pushed from centimeters away -- because the row cannot
 *     describe a rubbed balloon honestly without it. The file states that
 *     this happens and says outright that HOW it happens is a later lesson
 *     in this unit; it never names, pictures or explains the region around a
 *     charge.
 *   - GRAVITY is row 3.1, the previous row, and is assumed rather than
 *     re-taught: one clause in the concept segment says the student already
 *     met "grows with the amount, weakens with distance" there, and uses it
 *     to mark the contrast that gravity only pulls while an electric force
 *     can also push. No mass, no weight and no gravitational arithmetic
 *     appears, and the word gravity occurs in the body only in that one
 *     keyIdea and in the `prerequisites` loId; an
 *     unrubbed balloon falling and paper bits jumping upward are described
 *     without naming it.
 *   - NEWTON'S THIRD LAW is row 2.3 and is likewise assumed, not re-taught:
 *     the concept segment says in one clause that each of the two charged
 *     objects feels the force, referring to what the student already knows
 *     about forces, and never uses the words action, reaction or pair.
 *   - INSIDE THE ATOM is row 7.2, four units later, so this file borrows the
 *     minimum the transfer rule needs and no more. An electron is introduced
 *     as a tiny particle that carries negative charge, sits on the outside of
 *     atoms and is loose enough to be dragged from one surface to another,
 *     and the positive charge is described only as staying fixed in place.
 *     The words nucleus, proton and neutron do not appear in the body, no atom is
 *     counted, drawn or named, and nothing is said about how many electrons
 *     an atom has. Ions, charged atoms and electron shells belong to
 *     `chem-u3-ion-formation.ts` and `chem-u2-electron-configurations.ts`
 *     and are not touched.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. In particular there is no
 *     lightning, no storm and no weather anywhere in the body, which is
 *     where a static-charge lesson most easily drifts into Grade 6 Unit 6.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. Hair appears only as a surface that a
 *     balloon is rubbed against.
 *   - HS CHEMISTRY / AP PHYSICS boundary (there is no HS physics course in
 *     this catalog, so AP Physics 2 is the course above): the formula this
 *     row stops short of is Coulomb's law, F = k q1 q2 / r squared, which
 *     belongs to `ap-physics2-electrostatics.ts`. No charge is ever written
 *     as a number or given a unit, no force is stated in newtons, nothing is
 *     described as an inverse square or as "so many times weaker", and no
 *     quantity is computed anywhere in the body. Every number in the body is a
 *     small, invented, illustrative one -- counts of rubs, distances in
 *     centimeters, how far a hanging ball settles aside, counts of paper
 *     bits, and the trial numbers themselves -- and every conclusion drawn
 *     from them is a direction, stronger or weaker, never a ratio. Current,
 *     circuits, voltage, resistance and V = IR are excluded entirely by
 *     sign-off 6, and the words current, circuit, volt, ampere and resistance
 *     do not appear in the body; the
 *     legacy `g8-sci-electricity.ts` concept-current segment, its Ohm's-law
 *     worked example and its numeric V = IR try item are not carried.
 *   - INVESTIGATION VOCABULARY is Grade 7's (`m7sci-u1-*`) and is assumed,
 *     not re-taught. Reading trials for a factor is this row's own scope, so
 *     the file does it in plain words -- "compare two trials that differ in
 *     exactly one thing" -- and never says variable, control, fair test or
 *     hypothesis. Choosing the NEXT trial to run is row 3.3's move and no
 *     item asks for one.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every trial,
 * every charge and every direction in this file is written out in words
 * inside the item, and every item is solvable from the text printed inside
 * it. Never write "look at the diagram", and never assume the student has a
 * balloon, a comb, a charged sphere or scraps of paper in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 3.1 -> 3.2 ->
 * 3.3 (`gravity-mass-distance-and-weight` -> `electric-forces-and-charge` ->
 * `magnetic-forces-and-electromagnets`), and both arrays carry those real
 * loIds. The two hand-written exemplars leave their chain arrays empty
 * because they are registered before their neighbors exist; that is a
 * registration artifact and not the pattern for a fan-out row.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U3_ELECTRIC_FORCES_AND_CHARGE: LessonPlan = {
  id: 'evelyn.ms.m8sci.electric-forces-and-charge.v1',
  title: 'Electric Forces & Charge',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.electric-forces-and-charge',
      standard: 'M8SCI-3.2',
      description:
        'Explain that objects carry positive or negative charge, that like charges repel and opposite charges attract, that rubbing transfers charge (the balloon on the wall), and identify from data which factors change the strength of an electric force -- amount of charge and distance apart (NGSS MS-PS2-3).',
    },
  ],
  prerequisites: ['m8sci.gravity-mass-distance-and-weight'],
  followUps: ['m8sci.magnetic-forces-and-electromagnets'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get three results out of one rubbing -- hairs that stand apart, balloons that refuse to meet, and a plain wall that holds on -- so the student wants one rule that covers all three.',
      script:
        'Rub a balloon on your hair for a few seconds and then hold it a little way from your head. Single hairs lift off and follow it, and they stand apart from one another instead of lying flat. Now press that same balloon against a wall and let go. It stays there. Here is what should bother you about that. You rubbed the balloon and you rubbed your hair, so whatever the rubbing did, it did it to those two things. Nobody rubbed the wall. The wall has been sitting there all day doing nothing, and the balloon holds on to it anyway -- and it will hold on to a door or a window just as well. One more result: rub a second balloon the same way, bring the two balloons together, and they refuse to meet. You can feel them pushing apart while there is still air between them. One rubbing, three results. By the end of today all three come out of a single rule about two kinds of charge, and you will be able to say which objects ended up charged, which kind each one got, and what makes the push or the pull stronger.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-kinds-of-charge',
      kind: 'concept',
      goal: 'Install the two-kinds-of-charge model, the repel-and-attract rule, transfer by rubbing, the neutral-object case, and the two factors that set how strong the force is.',
      keyIdeas: [
        'THERE ARE TWO KINDS OF CHARGE, AND MOST THINGS CARRY PLENTY OF BOTH. Electric charge is a property of matter, and it comes in exactly two kinds: positive and negative. Almost everything around you holds an enormous amount of both kinds at the same time, in equal amounts, and an object like that is called neutral. Neutral does not mean empty of charge. It means the two kinds are balanced, so the object has no overall charge of its own. An object is positively or negatively charged only when that balance has been broken, which means it now has more of one kind than of the other.',
        'LIKE CHARGES REPEL, OPPOSITE CHARGES ATTRACT, AND THE FORCE REACHES ACROSS A GAP. Two objects that both carry negative charge push each other apart. Two objects that both carry positive charge push each other apart in exactly the same way. An object with negative charge and an object with positive charge pull toward each other. That is the whole rule. Two things to say about it straight away. First, it runs both ways at once: each of the two objects feels the force, as is true of every force you have met. Second, the objects do not have to be touching. A charged object pushes or pulls on another charged object while there is still air between them, which is why two rubbed balloons start pushing apart before they meet. HOW a push can cross a gap is taken up in a later lesson in this unit; THAT it crosses one is what you need today.',
        'RUBBING DOES NOT MAKE CHARGE. IT MOVES ELECTRONS FROM ONE OBJECT ONTO THE OTHER. The negative charge in ordinary matter is carried by electrons, tiny particles that sit on the outside of atoms, and some of them are held loosely enough that dragging two surfaces across each other pulls them off one surface and onto the other. Positive charge does not travel between everyday objects that way; it stays fixed in place. So rubbing always charges BOTH objects, and always with opposite kinds: the surface that gained electrons now has extra negative charge, and the surface that lost them is short by exactly that many and is left positive. WRONG: "Rubbing creates negative charge on the balloon." CORRECT: "Rubbing moved electrons from the hair onto the balloon, and the hair is left positive by exactly the amount the balloon gained." Add up the charge on both objects together and it is the same after the rubbing as it was before. Nothing was made and nothing was destroyed. It was moved.',
        'A CHARGED OBJECT ALSO PULLS ON A NEUTRAL ONE, AND THAT IS THE BALLOON-ON-THE-WALL PUZZLE. A wall nobody has rubbed is neutral, and a rubbed balloon sticks to it anyway. The reason is that the charges in the wall\'s surface can shift a short way without leaving the wall. Hold a negatively charged balloon close to the surface and the negative charges in it are pushed slightly deeper in, which leaves the part of the surface nearest the balloon slightly positive while the negative charge sits slightly farther back. So the pull on the balloon comes from charges that are NEARER and the push comes from charges that are FARTHER, and the electric force is stronger over a shorter distance -- which means the pull is the bigger of the two and the balloon is attracted. The wall never gains an overall charge. Its charges only rearrange, and they settle back as soon as the balloon is taken away.',
        'TWO THINGS SET HOW STRONG AN ELECTRIC FORCE IS: HOW MUCH CHARGE, AND HOW FAR APART. Put more charge on either one of the two objects and the force between them gets stronger. Move the two objects farther apart and the force gets weaker; bring them closer and it gets stronger. Both factors are working at the same time, which is why a lightly charged object held very close can pull just as hard as a heavily charged one held far away, and why you cannot judge either factor from a single trial. You already know this shape of rule from the lesson before this one, where gravity grew with the amount and weakened with distance -- but here is the difference that makes this force new: gravity only ever pulls, while an electric force pulls or pushes depending on which kinds of charge are involved.',
        'HOW TO READ A SET OF TRIALS FOR ITS FACTORS. When you are handed the results of several trials and asked what changes the strength of the force, hunt for a PAIR of trials that differ in exactly one thing. If two trials used the same distance and different amounts of rubbing, that pair tells you what the amount of charge did. If two trials used the same rubbing and different distances, that pair tells you what the distance did. A pair that differs in two things at once tells you nothing about either one, however interesting the two results look side by side, because there is no way to say which of the two changes produced what you are seeing.',
      ],
      vocabulary: [
        { term: 'electric charge', definition: 'a property of matter that comes in two kinds, positive and negative, and that makes objects push or pull on one another.' },
        { term: 'neutral', definition: 'carrying equal amounts of positive and negative charge, and so having no overall charge -- which is not the same as having no charge at all.' },
        { term: 'electron', definition: 'a tiny particle that carries negative charge and sits on the outside of atoms; electrons are what moves when two surfaces are rubbed together.' },
        { term: 'electric force', definition: 'the push or the pull between two charged objects, or between a charged object and a neutral one.' },
        { term: 'repel', definition: 'to push apart. Two objects carrying the same kind of charge repel each other.' },
        { term: 'attract', definition: 'to pull together. Two objects carrying opposite kinds of charge attract each other, and a charged object also attracts a neutral one.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-balloon-hair-and-wall',
      kind: 'worked_example',
      problem:
        'You rub a balloon on your hair for a few seconds. The balloon then holds on to a wall that nobody has touched all day, and your hair is left standing up with single hairs spread apart from one another. A student says: "The balloon made new negative charge, and then it charged the wall positive so that it could stick." Say what charge the balloon, the hair and the wall each end up with, and explain why the balloon stays on the wall.',
      steps: [
        'Start with what the rubbing did, and be exact about it, because this is where the student went wrong the first time. Rubbing does not make charge; it moves electrons. Dragging the rubber of the balloon across your hair pulls electrons off the hair and onto the balloon. The balloon therefore ends up with more electrons than it started with, which is an overall negative charge, and your hair ends up short by exactly that many electrons, which is an overall positive charge. Two surfaces were rubbed, so two objects ended up charged, and they got opposite kinds.',
        'Check that against what your hair is doing, because the hair is evidence you can see. Every single hair lost electrons, so every single hair now carries positive charge -- the same kind as the hair next to it. Like charges repel, so the hairs push one another apart and stand up instead of lying flat. The hair as a whole is pulled toward the balloon at the same time, because positive and negative attract. One transfer, two behaviors, and they are opposite behaviors: apart from each other, toward the balloon.',
        'Now the wall, which is the part the student got wrong the second time. The wall is neutral. It holds equal amounts of positive and negative charge and nobody has moved any of it. But the charges in the wall\'s surface can shift a short way in place. The balloon\'s negative charge pushes the surface electrons a little deeper in, so the surface right under the balloon is left slightly positive while the negative charge sits slightly farther back. The balloon is pulled toward the nearer positive charge and pushed by the farther negative charge, and because the electric force is stronger over a shorter distance, the pull beats the push. That leftover pull presses the balloon against the wall, and friction between the balloon and the wall keeps it from sliding down.',
        'WRONG: "The balloon charged the wall positive." CORRECT: "The wall still holds equal amounts of both kinds of charge. Its charges shifted a little way in place, and they settle back as soon as the balloon is taken away." Notice what the correct version does not need: in this whole story the wall does not gain or lose a single electron.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The inventory of what was touched says only the balloon and the hair were rubbed, so only those two should have ended up charged, and only those two show any new behavior. The directions agree next, and they agree in opposite senses: the hairs spread APART from one another, which is what like charges do, while the hair as a whole leans TOWARD the balloon, which is what opposite charges do -- one transfer predicting two different motions. And the wall behaves the same everywhere, which is a third kind of clue: peel the balloon off and press it against a fresh spot, and it holds on there too. That is what you would expect if the wall is simply neutral and its charges shift under whatever is brought near them, and not what you would expect if one particular patch had been handed a charge.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Take an identical balloon that has not been rubbed and press it against the same wall. It falls straight down. Same balloon, same wall, same press against the surface, and no holding on at all -- because no electrons were moved and neither object has an overall charge. The one condition that changed is the rubbing, and the result changed with it, which is exactly what the explanation says should happen.',
      ],
      answer:
        'The balloon ends up negatively charged and the hair positively charged, because rubbing moved electrons from the hair onto the balloon; nothing was created, and the two amounts match. The wall stays neutral. The balloon\'s negative charge shifts the charges in the wall\'s surface a little way in place, leaving the nearest part of the surface slightly positive, and because the electric force is stronger over a shorter distance the pull from the nearer positive charge beats the push from the farther negative charge. That leftover pull holds the balloon against the wall, and friction keeps it from sliding down.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reading-the-trials',
      kind: 'worked_example',
      problem:
        'A small foam ball hangs on a long thread and has been given negative charge. A plastic sphere on the end of a stick is rubbed until it is negatively charged too, and is then held near the hanging ball. The ball swings aside, away from the sphere, and settles there, and how far it settles aside from hanging straight down is the measure of how hard it is being pushed. Trial 1: the sphere is rubbed 10 times and held 5 centimeters from the ball, and the ball settles 1 centimeter aside. Trial 2: the sphere is rubbed 30 times and held 5 centimeters from the ball, and the ball settles 3 centimeters aside. Trial 3: the sphere is rubbed 30 times and held 9 centimeters from the ball, and the ball settles 1 centimeter aside. What do these trials show about what makes an electric force stronger or weaker?',
      steps: [
        'Be clear about what is being measured before you compare anything. With nothing charged nearby, the ball hangs straight down. A sideways push moves it away from straight down until it settles in a new place, and a harder push settles it farther aside. So the number of centimeters aside is standing in for the strength of the electric force: more centimeters means a stronger push.',
        'Find a pair of trials that differ in exactly one thing. Trials 1 and 2 were both run with the sphere 5 centimeters from the ball, and the only difference between them is the rubbing -- 10 times against 30 times. More rubbing drags more electrons onto the sphere, so the sphere carries more charge in Trial 2 than in Trial 1. The ball settles 1 centimeter aside in the first and 3 centimeters aside in the second. More charge, stronger force.',
        'Now find the pair that isolates the other factor. Trials 2 and 3 were both run after 30 rubs, so the amount of charge is the same in both, and the only difference is how far away the sphere was held -- 5 centimeters against 9 centimeters. The ball settles 3 centimeters aside in the nearer trial and 1 centimeter aside in the farther one. Farther apart, weaker force; closer together, stronger force.',
        'Look at Trials 1 and 3 together, because this is where a reader goes wrong. Both of them ended with the ball 1 centimeter aside, and it is tempting to read that tie as evidence that the rubbing made no difference, or that the distance made no difference. Neither reading is allowed, because those two trials differ in BOTH things at once: Trial 3 had more rubbing AND more distance, and the two changes worked against each other. WRONG: "Trials 1 and 3 gave the same result, so neither factor matters." CORRECT: "Trials 1 and 3 changed two things at once, so on their own they settle nothing. Compare Trial 1 with Trial 2 for the charge, and Trial 2 with Trial 3 for the distance."',
        'Now run the two checks. First, three clues of DIFFERENT KINDS that agree. The two clean pairs are the first clue, and each moves the way the rule says it should. The direction of the swing is a second and different kind of clue: in every trial the ball moves AWAY from the sphere and never toward it, which is what two objects carrying the same kind of charge do, so the trials are also confirming that both objects are negatively charged. And the third clue is what happens when the sphere is carried out of the room: the ball settles back to hanging straight down, which says the push is there only while the charged sphere is near, and is not something that happened to the ball once and stayed with it.',
        'Second, change one condition and check that the answer moves. Suppose the sphere had been given positive charge instead of negative, with everything else in the three trials left exactly as it was. Now the ball would settle aside TOWARD the sphere rather than away from it, because opposite charges attract -- and the two factors would still set how far it settled, with more charge moving it farther and more distance moving it less. The kind of charge decides which way; the amount of charge and the distance decide how strongly. Change the kind and the direction flips, which is how you know the direction was coming from the kinds of charge and not from the sphere being nearby at all.',
      ],
      answer:
        'The trials show that the electric force gets stronger when there is more charge on the objects and weaker when the objects are farther apart. Trials 1 and 2 differ only in the rubbing, and the ball settles farther aside after more rubbing. Trials 2 and 3 differ only in the distance, and the ball settles less far aside from farther away. Trials 1 and 3 give the same result but differ in two things at once, so that pair settles nothing by itself.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-charged-beads',
      kind: 'try_yourself',
      problem:
        'Two small plastic beads, Bead A and Bead B, hang next to each other on separate threads, a few centimeters apart. Bead A carries negative charge. Bead B carries positive charge. Nothing else charged is anywhere near them. What do the beads do, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They stay exactly where they are until something pushes them into contact, because an electric force can only act between two objects that are actually touching each other.' },
        { id: 'b', text: 'They swing toward each other, because the two beads carry opposite kinds of charge, and opposite charges attract across the gap without needing to touch.', correct: true },
        { id: 'c', text: 'They swing away from each other, because both beads are charged, and any two charged objects push each other apart no matter which kinds of charge they happen to carry.' },
        { id: 'd', text: 'Bead B swings toward Bead A while Bead A hangs still, because negative charge is the kind that does the pulling and positive charge is the kind that gets pulled.' },
      ],
      expectedAnswer: 'They swing toward each other, because the two beads carry opposite kinds of charge, and opposite charges attract across the gap without needing to touch.',
      hints: [
        'Name the kind of charge on each bead first, and then ask which half of the rule applies: the half about two charges of the same kind, or the half about charges of opposite kinds.',
        'Then ask how many of the beads feel the force. An electric force acts on both of the objects involved, and it does not wait for them to touch before it starts.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rubbed-strip-and-cloth',
      kind: 'try_yourself',
      problem:
        'A plastic strip is rubbed with a dry cloth. Both of them were neutral before the rubbing started, and while they are rubbed together some electrons are dragged off the cloth and onto the strip. Which statement describes the charge on each object afterward, with the right reason?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The strip has negative charge and the cloth is still neutral, because the rubbing produced new negative charge on the strip and did nothing at all to the cloth that was rubbing it.' },
        { id: 'b', text: 'Both the strip and the cloth have negative charge, because rubbing two surfaces hard against each other adds negative charge to each of the two surfaces that were rubbed.' },
        { id: 'c', text: 'The strip has negative charge and the cloth has positive charge, because the electrons that left the cloth are extra negative charge on the strip and leave the cloth short by exactly that amount.', correct: true },
        { id: 'd', text: 'The strip has negative charge and the cloth has positive charge, because the rubbing pushed positive charge out of the strip and over into the cloth while the electrons stayed where they were.' },
      ],
      expectedAnswer: 'The strip has negative charge and the cloth has positive charge, because the electrons that left the cloth are extra negative charge on the strip and leave the cloth short by exactly that amount.',
      hints: [
        'Follow the electrons, and keep track of both objects. The strip gained some. What does the cloth now have too little of, and what kind of overall charge does that leave it with?',
        'Two of these statements reach the same pair of charges by different routes, so the reason is what separates them. Which particles actually move between two everyday objects, and which charge stays fixed in place?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-comb-and-paper-bits',
      kind: 'try_yourself',
      problem:
        'A student rubs a plastic comb on a wool sweater and then holds it just above a pile of tiny paper bits, counting how many bits jump up and stick to the comb. Trial 1: the comb is rubbed 5 times and held 2 centimeters above the pile, and 3 bits jump up. Trial 2: the comb is rubbed 20 times and held 2 centimeters above the pile, and 12 bits jump up. Trial 3: the comb is rubbed 20 times and held 6 centimeters above the pile, and 2 bits jump up. Which conclusion do these three trials support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rubbing the comb more makes the force stronger, and the distance makes no difference to it, because the comb in Trial 3 had been rubbed 20 times and still pulled paper bits up to it from 6 centimeters away.' },
        { id: 'b', text: 'Only the distance matters here, because Trials 1 and 3 are the pair to compare and 3 bits from 2 centimeters against 2 bits from 6 centimeters is nearly the same result, so the extra rubbing in Trial 3 changed nothing the count could show.' },
        { id: 'c', text: 'The paper bits must have been carrying a charge of their own all along, because a comb can only pull on something that is already charged, so these trials measure the bits rather than the comb and tell you nothing about how it was rubbed.' },
        { id: 'd', text: 'More rubbing makes the force stronger and more distance makes it weaker: Trials 1 and 2 differ only in the rubbing, and the count rises from 3 bits to 12, while Trials 2 and 3 differ only in the distance, and the count falls from 12 bits to 2.', correct: true },
      ],
      expectedAnswer: 'More rubbing makes the force stronger and more distance makes it weaker: Trials 1 and 2 differ only in the rubbing, and the count rises from 3 bits to 12, while Trials 2 and 3 differ only in the distance, and the count falls from 12 bits to 2.',
      hints: [
        'Do not read the trials in the order they are written. Hunt for a pair that differs in exactly one thing, and then hunt for a second pair that differs in exactly one different thing.',
        'Then check the pair you are tempted by. If two trials changed both the rubbing and the height at the same time, what can that pair tell you about either one on its own?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rubbing-and-the-wall',
      kind: 'misconception_check',
      question:
        'A student writes: "Rubbing a balloon on your hair creates negative charge on the balloon out of nothing, and the balloon sticks to the wall because it has made the wall positively charged." Two separate things have gone wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'Rubbing creates negative charge on the balloon out of nothing.',
          misconception:
            'Treating rubbing as something that manufactures charge, and treating the balloon as the only object it happens to, because the balloon is the object you were paying attention to and the charge on it certainly was not there before.',
          correctsTo:
            'Rubbing moves charge; it never makes any. Electrons are loose enough to be dragged from one surface onto another, and that is all the rubbing does. So the charge on the balloon is not new charge -- it is negative charge that used to be on your hair. And because it came from somewhere, the other object cannot be left alone: your hair is now short by exactly the electrons the balloon gained, which leaves the hair positively charged. Add the two together and the total is exactly what it was before you started. The hair is the evidence, and you can see it: the single hairs stand apart from one another, which is what like charges do, and the whole head of hair leans toward the balloon, which is what opposite charges do. WRONG: "The rubbing created charge on the balloon." CORRECT: "The rubbing moved electrons from the hair to the balloon, so the balloon went negative and the hair went positive by the same amount."',
        },
        {
          answer: 'The balloon sticks to the wall because it has made the wall positively charged.',
          misconception:
            'Assuming that the only way to be attracted is to be charged, so the wall must have been given a charge; the rule "opposite charges attract" is remembered correctly and then applied to an object that never had to be charged at all.',
          correctsTo:
            'The wall is neutral before the balloon arrives and neutral the whole time the balloon is on it. What happens instead is that the charges inside the wall\'s surface shift a short way in place. The balloon\'s negative charge pushes the surface electrons slightly deeper in, so the part of the surface nearest the balloon is left slightly positive while the negative charge sits slightly farther back. The balloon is pulled by the nearer positive charge and pushed by the farther negative charge, and the electric force is stronger over a shorter distance, so the pull wins and the balloon is held against the wall. Nothing was handed over: no electron crosses from the balloon to the wall, and the wall\'s charges settle back the moment the balloon is taken away. The test is easy to run in your head. Peel the balloon off and press it against a fresh spot a meter along the wall, and it holds on there too -- and then at the spot after that. A wall that had been given a charge in one place could not keep doing that everywhere you move the balloon. WRONG: "The balloon charged the wall." CORRECT: "The wall stayed neutral, and its charges only shifted a little way in place, which is enough to make the pull beat the push."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Electric charge comes in two kinds, positive and negative. An object with equal amounts of both is neutral, which means balanced, not empty.',
        'Like charges repel and opposite charges attract, and the push or the pull acts across the gap between the objects without them touching.',
        'Rubbing never creates charge. It drags electrons from one surface onto the other, so BOTH objects end up charged, with opposite kinds, and the total is unchanged.',
        'Electrons are what moves between everyday objects. The positive charge stays fixed in place.',
        'A charged object also attracts a neutral one: the charges in the neutral object shift a little way in place, the opposite kind ends up nearer, and the nearer pull beats the farther push.',
        'That is why a rubbed balloon holds on to a wall that nobody rubbed, and the wall is still neutral the whole time.',
        'Two things set how strong an electric force is: how much charge the objects carry, and how far apart they are. More charge is stronger, more distance is weaker.',
        'To find a factor in a set of trials, compare two trials that differ in exactly one thing. A pair that differs in two things at once settles nothing on its own.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Electric Forces & Charge' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
