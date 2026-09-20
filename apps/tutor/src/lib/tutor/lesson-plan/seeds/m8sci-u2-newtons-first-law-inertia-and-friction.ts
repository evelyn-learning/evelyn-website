/**
 * Grade 8 Science (Physical Science) — Newton's First Law: Inertia & Friction.
 *
 * CONCEPT-LED exemplar for the m8sci fan-out (NGSS MS-PS2-2). The student has
 * no procedure to lean on here: the whole lesson is building one mental model
 * -- an object keeps whatever motion it has, at rest or moving in a straight
 * line at a steady speed, until a NET force changes it -- and then making
 * that model survive contact with a world in which everything the student
 * has ever rolled, slid or thrown eventually stopped. The stopping is the
 * hard part. Every rolling ball the student has watched slow down is a piece
 * of evidence for the wrong rule, so the plan spends most of its time on
 * WHERE the stopping comes from: friction and air resistance, which are real
 * forces on the object, pointing against its motion.
 *
 * The two traps it is built to kill are (a) the impetus error -- the push
 * you gave the ball is "inside" it and "runs out", which is the single most
 * common middle-school error on this topic -- and (b) the belief that a
 * moving object needs a force to keep it moving. The two traps reinforce each
 * other, which is why the misconception check takes them in one breath.
 *
 * SCOPE GUARD: this plan explains that an object keeps its motion (at rest,
 * or moving in a straight line at constant speed) unless a net force acts on
 * it, that inertia grows with mass, and that friction and air resistance are
 * the everyday forces that make moving things stop -- so the first law is not
 * contradicted by a rolling ball slowing down. The curriculum marks it as the
 * first of three lessons sharing MS-PS2-2, split by law, and that split sets
 * the boundary:
 *   - NEWTON'S SECOND LAW is row 2.2. This file says that a more massive
 *     object needs a bigger force to change its motion by the same amount,
 *     and says it in words only. It never writes F = m × a, never names
 *     acceleration as a quantity, and never computes a force, a mass or a
 *     change in speed. "Inertia grows with mass" is the whole of what this
 *     row owns.
 *   - NEWTON'S THIRD LAW is row 2.3. The book-on-a-table example in the
 *     concept segment names two forces ON THE BOOK (the table's upward push
 *     and Earth's downward pull) and calls them balanced. It never names the
 *     book's push on the table, never uses the words "action" or "reaction",
 *     and never says the two forces are a pair.
 *   - FORCES AND NET FORCE are row 1.4 and are assumed, not re-taught: this
 *     file uses "net force" and "balanced" as words the student already
 *     holds (restated in the vocabulary list, not re-taught), and the only
 *     adding of forces it does is "the two pushes are the same size in
 *     opposite directions, so the net force is zero." No force in this file
 *     carries a number of newtons; the only quantity with a unit anywhere in
 *     the body is the cyclist's steady 5 meters per second in the third
 *     try_yourself, and nothing is computed from it.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no orbit, planet, moon, tide,
 *     plate, current or weather system appears anywhere in this file. The one
 *     mention of anything beyond the ground is a single sentence in the
 *     misconception check saying that a space probe far out in empty space
 *     keeps moving for years with its engine off because there is no air to
 *     push against it; it is there only as the friction-free contrast to a
 *     rolling ball, and it says nothing about gravity, about why the probe is
 *     where it is, or about where it is going.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - AP PHYSICS boundary (there is no HS physics course in this catalog, so
 *     that is the course above): every force in this file lies along one
 *     line, either with the motion or against it, and is described as a push
 *     in a direction, never as a vector, an arrow with a length, or a
 *     free-body diagram. No item asks for an acceleration, a stopping
 *     distance, a coefficient of friction, or a kinetic-energy comparison,
 *     and momentum is not mentioned. The formula this row stops short of is
 *     F = m × a, which belongs to row 2.2 in its small-whole-number form and
 *     to `ap-physics-newtons-second-deep.ts` in every form beyond that.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every force
 * in this file is written out in words with its direction stated, and every
 * item is solvable from the text printed inside it. Never write "see the
 * force diagram", and never assume the student has a cart, a ramp, a puck,
 * an air-hockey table or a spring scale in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.4 -> 2.1 -> 2.2
 * (`forces-and-net-force` before it, `newtons-second-law-force-mass-and-acceleration`
 * after it). Both arrays were empty while this exemplar was the only row on
 * disk; the controller hand-wired them at course registration (2026-09-19).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U2_NEWTONS_FIRST_LAW_INERTIA_AND_FRICTION: LessonPlan = {
  id: 'evelyn.ms.m8sci.newtons-first-law-inertia-and-friction.v1',
  title: 'Newton\'s First Law: Inertia & Friction',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.newtons-first-law-inertia-and-friction',
      standard: 'M8SCI-2.1',
      description:
        'Explain that an object keeps its motion (at rest, or moving in a straight line at constant speed) unless a net force acts on it, that inertia grows with mass, and that friction and air resistance are the everyday forces that make moving things stop -- so the first law is not contradicted by a rolling ball slowing down (NGSS MS-PS2-2).',
    },
  ],
  prerequisites: ['m8sci.forces-and-net-force'],
  followUps: ['m8sci.newtons-second-law-force-mass-and-acceleration'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two everyday puzzles side by side -- the loaded cart that is hard to start and hard to stop, and the rolled ball that stops on its own -- so the student wants one rule that handles both.',
      script:
        'Picture an empty shopping cart. You can get it rolling with one hand and stop it with one finger. Now picture the same cart loaded to the top with cases of water. Getting it moving takes a real shove with both arms, and here is the part people forget: once it is rolling, stopping it takes just as much of a shove. The cart did not change. The wheels did not change. Something about what is in it changed how hard its motion is to alter. Hold that thought and take a second puzzle. You roll a ball across a gym floor. Nobody touches it, and it slows down and stops anyway. Most people would say that is just what moving things do -- they run down. Newton said the exact opposite. He said a moving thing keeps moving, at the same speed and in the same direction, forever, unless something pushes on it. So either Newton was wrong, or something pushed on that ball the whole way across the floor. By the end of today you will be able to say what pushed on it, which way, and why the loaded cart is harder to stop.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-first-law',
      kind: 'concept',
      goal: 'Build the first-law model in both halves (at rest and in steady motion), attach inertia to mass, and install friction and air resistance as the outside forces that do the stopping.',
      keyIdeas: [
        'THE FIRST LAW HAS TWO HALVES, AND THEY ARE THE SAME RULE. An object at rest stays at rest, and an object moving in a straight line at a steady speed keeps moving in that straight line at that steady speed, unless a net force acts on it. Both halves say one thing: with no net force, the motion does not change. A book lying on a table is the resting case. Two forces act on the book -- the table pushes up on it and Earth pulls down on it -- and they are the same size in opposite directions, so the net force on the book is zero and the book stays exactly where it is. It will stay there until something gives it a net force: your hand, a tilt of the table, a gust of wind.',
        'THE MOVING HALF IS THE SURPRISING ONE, SO SAY IT SLOWLY. A moving object does not need a force to keep moving. A hockey puck hit once across smooth ice slides a very long way, and the reason it slides so far is not that the stick is still pushing it -- the stick stopped touching it in the first instant. The reason is that almost nothing is pushing on it at all. On a surface with no friction and no air, the puck would slide in a straight line at the same speed with nothing pushing it forward and nothing holding it back, and it would never stop. WRONG: "The puck keeps going because the push from the stick is still in it." CORRECT: "The push ended when the stick lost contact. The puck keeps going because nothing has changed its motion yet." A force is a push or a pull between two objects while they interact. It is not a thing an object carries away with it.',
        'INERTIA IS THE NAME FOR HOW HARD AN OBJECT\'S MOTION IS TO CHANGE, AND IT GROWS WITH MASS. Every object resists having its motion changed -- sped up, slowed down, or turned -- and the amount of that resistance is its inertia. The more mass an object has, the more inertia it has. That is the whole of the loaded-cart puzzle: the loaded cart has far more mass than the empty one, so a bigger force is needed to change its motion by the same amount, whether the change is getting it going or getting it stopped. Two things inertia is NOT. It is not a force: inertia does not push or pull on anything, so it never appears in the list of forces on an object. And it is not a fuel or a supply: an object does not use up its inertia as it moves, and inertia does not fade. Mass is measured in kilograms, and the mass -- and so the inertia -- of an object is the same whether it is sitting still or moving fast.',
        'FRICTION AND AIR RESISTANCE ARE THE FORCES THAT STOP THINGS. Friction is a force between two surfaces that are touching, and it pushes against their sliding or rolling across each other. Air resistance is the push of the air on an object moving through it, and it also points against the motion. Every ball you have ever rolled across grass or a floor had both acting on it the entire time it was moving, and each one pointed backward, against the direction the ball was going. So a rolling ball that slows down is not evidence against the first law. It is the first law working exactly as written: the ball had a net force on it, pointing backward, and its motion changed. The way to catch this is to run the contrast in your head. Take the friction away -- a puck on an air-hockey table, where a cushion of air lifts it off the surface -- and the same object glides across at nearly the same speed the whole way. The object did not change. The backward force did.',
        'THE SEATBELT IS THE FIRST LAW SEEN FROM INSIDE THE CAR. When a car is moving along a straight road at a steady speed, everything in it is moving at that speed too. When the brakes bring the car to a sudden stop, the brakes act on the car -- not on you. Your body keeps moving forward at the old speed, because nothing has pushed on it yet, and it keeps moving until something does: the seatbelt, which pushes backward on your chest and changes your motion gently, or the dashboard, which does the same job suddenly and badly. WRONG: "When the car stopped, a force threw me forward." CORRECT: "Nothing pushed me forward. The car slowed and I kept going, until the belt slowed me too." The same idea explains why loose things in the cup holder slide toward the outside of a bend: the car turns because the road pushes on its tires, and the coins keep going straight until the side of the cup holder pushes on them.',
        'HOW TO ANSWER ANY FIRST-LAW QUESTION. First, name the object you are asking about, and only that object. Second, list every force ON that object, each one with its direction. Third, add them up along the line of motion. If they add to zero, the motion does not change: an object at rest stays at rest, and a moving object keeps its speed and direction. If they do not add to zero, the motion changes in the direction of the net force. A cyclist riding on flat ground at a steady speed is the case people get wrong: the forward push from her pedaling and the backward pushes of friction and air resistance add to zero, which is exactly why her speed is steady. She is not pedaling to keep a force on the bike. She is pedaling to cancel the forces that would otherwise slow it.',
      ],
      vocabulary: [
        { term: 'Newton\'s first law', definition: 'an object at rest stays at rest, and an object moving in a straight line at a steady speed keeps that motion, unless a net force acts on it.' },
        { term: 'inertia', definition: 'the tendency of an object to keep its motion unchanged; how hard its motion is to change. Inertia grows with mass, and it is not a force.' },
        { term: 'net force', definition: 'the single force left over when all the forces on one object are added together, taking their directions into account.' },
        { term: 'balanced forces', definition: 'forces on one object that add to a net force of zero, so the object\'s motion does not change.' },
        { term: 'friction', definition: 'a force between two touching surfaces that pushes against their sliding or rolling across each other.' },
        { term: 'air resistance', definition: 'the push of the air against an object moving through it, pointing against the motion.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-puck-slides-to-a-stop',
      kind: 'worked_example',
      problem:
        'A hockey puck is hit once with a stick and slides across a smooth ice rink in a straight line. It slows down gradually and comes to a stop some distance away. Nobody and nothing touched it after the stick. A student says: "The puck stopped, so Newton\'s first law must be wrong -- moving things do not keep moving." Is the student right? Explain what happened to the puck.',
      steps: [
        'Name the object and only the object. We are asking about the puck, so the forces that matter are the forces ON the puck. The stick is the first thing to check, and it is out of the picture: it touched the puck for an instant and then lost contact, and a force is a push between two objects while they interact. Once contact ends, the stick is pushing on nothing.',
        'List the forces on the puck after the stick is gone, each with a direction. Along the line it is sliding, there are two: friction from the ice, pushing backward against the sliding, and air resistance, pushing backward against the puck as it moves through the air. Both point the same way, against the motion, and nothing points forward.',
        'Add them up. Two backward forces and no forward force add to a net force pointing backward. The first law says that with a net force, the motion changes -- and a backward net force on a forward-moving puck means it slows down. That is what happened. The puck did exactly what the first law says an object with a net force on it does.',
        'So the student has the law backward. The first law does not say "moving things keep moving no matter what." It says "moving things keep moving unless a net force acts on them." Friction and air resistance are net force. WRONG: "The puck stopped, so the law is wrong." CORRECT: "The puck stopped because a backward net force acted on it, which is what the law predicts."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The force inventory says the only forces along the line of motion point backward. The direction of the change agrees: the puck slowed along its own line and never swerved sideways, which is exactly what a backward-pointing force does and a sideways one would not. And a contrasting surface agrees too: on rougher ice the same hit stops the puck sooner, and on smoother ice it slides farther, so whatever is doing the stopping is coming from the surface, not from inside the puck. Three different kinds of evidence, one answer.',
        'Second, change one thing about the setup and check that the answer moves the way it should. Put the same puck on an air-hockey table, where a cushion of air lifts it off the surface and friction is nearly gone. Now the backward force is close to zero, and the puck crosses the whole table at nearly the speed it left your hand. Same puck, same hit, different surface, different result. If the slowing had come from the push "running out", the air table could not have changed anything, because the push would have been the same. The answer moved when the surface moved, so the surface is the cause.',
      ],
      answer:
        'The student is not right. After the stick loses contact, the only forces on the puck along its line of motion are friction from the ice and air resistance, both pointing backward, so there is a net force on the puck and its motion changes -- it slows and stops. That is the first law working as written, not a contradiction of it. Take the friction away, on an air-hockey table, and the same puck keeps nearly all of its speed.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-seatbelt-and-mass',
      kind: 'worked_example',
      problem:
        'A car is driving along a straight, flat road at a steady speed. A passenger sits in the front seat, and a full water bottle stands on the smooth dashboard in front of her. The driver brakes hard and the car stops quickly. Describe what happens to the passenger and to the bottle, and say why. Then say what would be different if the passenger had much more mass.',
      steps: [
        'Start with what is true before the brakes. The car, the passenger and the bottle are all moving forward at the same steady speed, in a straight line. For each of them, the forces along the road add to zero -- that is what a steady speed means -- so nothing is changing anyone\'s motion.',
        'Now the brakes act. Ask carefully what the brakes push on. They push on the car. They do not touch the passenger and they do not touch the bottle. So in the first instant, the car\'s motion changes and theirs does not: the passenger and the bottle keep moving forward at the old speed while the car under them slows.',
        'Follow the passenger. She keeps moving forward until something pushes backward on her. The seatbelt does that. It tightens across her chest and lap, pushes backward on her, and slows her along with the car. Without the belt, she would keep moving at the old speed until the dashboard pushed on her instead, and that push would happen all at once. WRONG: "The sudden stop threw her forward." CORRECT: "Nothing threw her. She kept going while the car slowed, until the belt slowed her too."',
        'Follow the bottle. The only thing touching it is the smooth dashboard, and the friction from a smooth surface is small. That small backward push is not enough to slow the bottle as fast as the car is slowing, so the bottle keeps most of its forward speed and slides forward across the dashboard -- toward the windshield -- while the car slows under it. From inside the car it looks like the bottle jumped forward. It did not. It kept doing what it was doing.',
        'Now the passenger with more mass. Inertia grows with mass, so a more massive passenger resists a change in her motion more than a lighter one does. She keeps moving forward at the old speed exactly as the lighter passenger did -- that part is the same -- but to slow her along with the car, in the same short time, the seatbelt has to push backward on her harder. Notice what did NOT change: both passengers were moving at the same speed, and both kept moving forward when the car slowed. Mass does not decide whether an object keeps its motion. It decides how big a force is needed to change it.',
        'Run the check for clues of different kinds. The force inventory says the brakes act on the car and not on the bottle. The timing agrees: the bottle moves forward relative to the car only once the car starts slowing, never before, which is what you would see if the bottle simply kept its old motion and would not see if some new forward force had appeared. And the direction agrees under a change of setup, which is the contrasting case: if the driver had instead stepped on the gas and the car had suddenly sped up, the bottle would have slid BACKWARD across the dashboard -- toward the passenger -- because now the car is gaining speed under a bottle that is keeping its old, slower speed. Brake, and loose things go forward. Speed up, and they go backward. Turn left, and they slide right. In every case the loose object is keeping its motion while the car changes its own, and the answer moves the right way each time the setup moves.',
      ],
      answer:
        'The brakes act on the car, not on the passenger or the bottle, so both keep moving forward at the old speed while the car slows. The seatbelt pushes backward on the passenger and slows her with the car; the bottle, held only by the small friction of a smooth dashboard, slides forward toward the windshield. A passenger with more mass has more inertia: she keeps moving forward just as surely, and the belt has to push backward on her harder to slow her along with the car in the same time. If the car had sped up instead, the bottle would have slid backward.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-why-the-ball-stops',
      kind: 'try_yourself',
      problem:
        'You kick a soccer ball once, and it rolls across a flat grass field in a straight line, slowing down until it stops. Nothing touches it after your foot. Why does the ball slow down and stop?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The push you gave it is used up a little at a time as the ball rolls, and the ball stops when none of that push is left.' },
        { id: 'b', text: 'A moving object needs a force acting on it to keep moving, and once the ball leaves your foot there is no force pushing it forward.' },
        { id: 'c', text: 'The ball\'s inertia gets weaker the longer it rolls, so it holds on to its motion less and less well and finally lets it go.' },
        { id: 'd', text: 'Friction from the grass and air resistance both push backward on the ball, so there is a net force on it and its motion changes.', correct: true },
      ],
      expectedAnswer: 'Friction from the grass and air resistance both push backward on the ball, so there is a net force on it and its motion changes.',
      hints: [
        'Start with the force inventory. Your foot stopped touching the ball in the first instant, so it is no longer pushing. What is still touching the ball, and what is it moving through, the whole time it rolls?',
        'A force is a push between two objects while they interact; it is not something the ball carries away. If the ball is slowing, the first law says a net force is acting. Which choice names real forces and the direction they point?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-is-harder-to-stop',
      kind: 'try_yourself',
      problem:
        'Two identical skateboards roll side by side across the same smooth floor at the same steady speed. One carries a heavy backpack strapped to it; the other carries nothing. You reach out and stop each one with your hand, bringing both to rest in the same amount of time. Which skateboard needs the bigger push from your hand, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The one with the backpack, because it has more mass and so more inertia, so a bigger force is needed to change its motion by the same amount.', correct: true },
        { id: 'b', text: 'The empty one, because a lighter object speeds up more easily, and anything that speeds up that easily must also be harder to slow down again once it is moving.' },
        { id: 'c', text: 'They need the same push, because they are moving at the same speed, and how hard an object is to stop depends only on how fast it is going.' },
        { id: 'd', text: 'The one with the backpack, because a heavier object carries a stronger force of motion inside it, and your hand has to overcome that force.' },
      ],
      expectedAnswer: 'The one with the backpack, because it has more mass and so more inertia, so a bigger force is needed to change its motion by the same amount.',
      hints: [
        'Both skateboards are being asked to make the same change -- from the same speed to rest, in the same time. So the question is which one resists that change more. What is the word for that resistance, and what does it grow with?',
        'A moving object does not carry a force inside it, and inertia is not something that depends on speed. Which choice ties the answer to mass and to nothing else?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-steady-speed-cyclist',
      kind: 'try_yourself',
      problem:
        'A cyclist rides along a flat, straight road at a steady 5 meters per second, pedaling the whole time. She never speeds up, slows down or turns. Which statement correctly describes the forces on her and her bike along the road?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'There is a net forward force on her, because she is moving forward, and an object that is moving must have a net force pushing it the way it is going.' },
        { id: 'b', text: 'The forward push her pedaling produces is balanced by the backward pushes of friction and air resistance, so the net force along the road is zero and her motion does not change.', correct: true },
        { id: 'c', text: 'There are no forces on her at all, because a steady speed in a straight line is what the first law says happens when nothing is pushing or pulling on an object.' },
        { id: 'd', text: 'There is a net backward force on her from friction and air resistance, which is exactly why she has to keep pedaling instead of coasting -- the moment she stopped pedaling, she would begin to slow down.' },
      ],
      expectedAnswer: 'The forward push her pedaling produces is balanced by the backward pushes of friction and air resistance, so the net force along the road is zero and her motion does not change.',
      hints: [
        'Use the steady speed as your evidence. The first law says motion changes only when there is a net force. Her motion is not changing, so what must the net force along the road be?',
        'A net force of zero is not the same as no forces. List every force along the road, forward and backward -- do not forget the one her pedaling produces -- and ask what they add to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-force-runs-out',
      kind: 'misconception_check',
      question:
        'A student writes: "A rolling ball slows down and stops because the force you gave it runs out, and once it stops, that proves that moving things need a force to keep them going." Two different things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The ball slows down because the force you gave it runs out.',
          misconception:
            'Treating a force as a supply that is handed to the ball at the kick and then carried inside it, draining away as the ball rolls, because from the outside that is exactly what a slowing ball looks like.',
          correctsTo:
            'A force is a push or a pull between two objects while they are interacting. Your foot pushed on the ball only while it was touching the ball, and that push ended in the first instant. Nothing was left "inside" the ball to run out. What the ball has after the kick is its motion, and it keeps that motion until something else pushes on it. Something else does: friction from the ground and air resistance both push backward on the ball the entire time it rolls, and that backward net force is what slows it. The test that settles it is to change the surface. The same kick on a smoother floor sends the ball much farther, and a puck on an air-hockey table, with almost no friction, barely slows at all. If the kick were being used up, a smoother surface could not make it last longer -- the kick was the same. The surface changed the stopping, so the surface, not the kick, is doing the stopping.',
        },
        {
          answer: 'Once it stops, that proves that moving things need a force to keep them going.',
          misconception:
            'Reading the first law backward, so that "it stopped" becomes evidence that motion needs a force to maintain it, when the stopping is itself the sign that a force was acting.',
          correctsTo:
            'The first law says a moving object keeps its speed and direction UNLESS a net force acts on it -- so a moving object needs no force to keep moving, and it needs a force to STOP. The ball stopping is not evidence against the law; it is evidence that a net force was there, pointing backward, and we can name it: friction and air resistance. Where those forces are nearly absent, moving things simply keep moving. A space probe far out in empty space keeps moving for years with its engine off, because there is no air out there to push against it, and a puck on an air-hockey table crosses the whole table at nearly the speed it started with. WRONG: "It stopped, so motion needs a force." CORRECT: "It stopped, so a force acted on it. Take the force away and it would not have stopped."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Newton\'s first law: an object at rest stays at rest, and an object moving in a straight line at a steady speed keeps that motion, unless a net force acts on it.',
        'Both halves are one rule: with no net force, the motion does not change. With a net force, it changes in the direction of the net force.',
        'A moving object does not need a force to keep moving. A force is a push between two objects while they interact, and it is not something the object carries away and uses up.',
        'Inertia is how hard an object\'s motion is to change. It grows with mass. It is not a force and it does not run out.',
        'A more massive object needs a bigger force to change its motion by the same amount, whether that change is getting it going or getting it stopped.',
        'Friction and air resistance are real forces on a moving object, and both point against the motion. They are why a rolling ball slows down -- the first law working as written, not a contradiction of it.',
        'Take the friction away, on an air-hockey table, and the same object keeps nearly all of its speed. The stopping comes from the surface, not from inside the object.',
        'When a car brakes, the brakes act on the car, not on you. You keep moving until the seatbelt pushes on you. Loose objects slide forward when a car brakes, backward when it speeds up, and to the outside when it turns.',
        'To answer any first-law question: name the one object, list every force on it with its direction, add them along the line of motion, and read the result. Zero means no change; not zero means a change that way.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Newton\'s First Law: Inertia & Friction' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
