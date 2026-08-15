/**
 * AP Physics 1: Kinematics - Common Misconceptions
 */

import type { Misconception } from '../../types';

export const misconceptions: Misconception[] = [
  {
    id: 'velocity-acceleration-confusion',
    name: 'Velocity-Acceleration Confusion',
    relatedConcepts: ['velocity', 'acceleration'],
    severity: 'critical',

    description: 'Believing that velocity and acceleration must have the same sign, or that zero velocity means zero acceleration.',

    origin: 'In everyday language, "accelerating" means "speeding up." Students struggle with the physics definition where acceleration can oppose velocity (deceleration) or exist when velocity is momentarily zero (like at the top of a throw).',

    detectPatterns: {
      verbal: [
        'if it\'s slowing down, it\'s not accelerating',
        'acceleration is zero when it stops',
        'at the top it has no acceleration',
        'negative acceleration means slowing down',
      ],
      problemSolving: [
        'Setting a = 0 at maximum height in projectile motion',
        'Changing acceleration sign when object changes direction',
        'Unable to handle negative velocity with positive acceleration',
      ],
      graphical: [
        'Thinking v-t graph must cross zero when a-t graph crosses zero',
        'Drawing a = 0 when v = 0',
      ],
    },

    correction: {
      acknowledge: 'I see what you\'re thinking - in everyday language we say "accelerating" when we mean speeding up. But physics uses a more precise definition.',
      conflictQuestion: 'When you throw a ball straight up, what\'s happening to its velocity at the very top? And what force is acting on it there?',
      conflictExample: 'At the peak, the ball has v = 0, but gravity is still pulling it down with the same strength. If acceleration were zero there, the ball would just float! Instead, that constant downward acceleration is what slows it going up and speeds it coming down.',
      correctExplanation: 'Acceleration is the rate of change of velocity, not the velocity itself. An object can have zero velocity while still having acceleration - that\'s exactly what happens at turning points. And acceleration can be opposite to velocity - that\'s what makes things slow down.',
      whiteboard: [
        {
          action: 'showGraph',
          type: 'velocity-time',
          data: {
            title: 'Ball Thrown Upward',
            xLabel: 'Time (s)',
            yLabel: 'Velocity (m/s)',
            xRange: [0, 4],
            yRange: [-20, 20],
            functions: [{ fn: '20 - 10*t', label: 'v(t)' }],
            points: [{ x: 2, y: 0, label: 'v=0 but a≠0!' }],
          },
        },
      ],
      verificationQuestion: 'So if a car is moving east at 30 m/s and has an acceleration of 5 m/s² to the west, what will happen to its speed?',
    },

    persistence: 'high',
    relatedMisconceptions: ['acceleration-is-speed'],
  },

  {
    id: 'displacement-distance-confusion',
    name: 'Displacement vs Distance Confusion',
    relatedConcepts: ['displacement', 'position'],
    severity: 'moderate',

    description: 'Treating displacement and distance as interchangeable, or not understanding that displacement can be zero even after significant motion.',

    origin: 'In everyday usage, "how far did you go?" could mean either. Students don\'t naturally think about direction as part of the answer.',

    detectPatterns: {
      verbal: [
        'the displacement is 10 meters there and 10 meters back',
        'it traveled 20 meters total',
        'distance is the same as displacement',
      ],
      problemSolving: [
        'Adding magnitudes when they should subtract for displacement',
        'Using total distance in kinematic equations instead of displacement',
        'Getting confused when displacement is negative',
      ],
    },

    correction: {
      acknowledge: 'Those terms do sound similar, and in everyday life we often use them interchangeably. Physics needs to be more precise though.',
      conflictQuestion: 'If you walk to the kitchen and back to your room, how far did you walk? And where are you now compared to where you started?',
      conflictExample: 'You walked maybe 20 meters total - that\'s the distance. But you ended up right where you started, so your displacement is zero. The kinematic equations use displacement, which cares about where you end up relative to where you started.',
      correctExplanation: 'Distance is the total path length - it\'s always positive. Displacement is the change in position, a vector from start to end. A round trip has large distance but zero displacement.',
      verificationQuestion: 'A runner does 4 laps around a 400-meter track. What\'s the total distance? What\'s the displacement?',
    },

    persistence: 'medium',
  },

  {
    id: 'gravity-acceleration-varies',
    name: 'g Changes During Flight',
    relatedConcepts: ['free-fall', 'projectile-motion'],
    severity: 'critical',

    description: 'Believing that gravitational acceleration changes during an object\'s flight - perhaps being zero at the peak, or being different on the way up vs down.',

    origin: 'Students conflate what the velocity is doing with what the acceleration is doing. Since velocity changes throughout the flight, they assume acceleration must too.',

    detectPatterns: {
      verbal: [
        'at the top, gravity stops pulling',
        'acceleration changes at the peak',
        'going up, acceleration is less',
        'the acceleration changes direction when it falls',
      ],
      problemSolving: [
        'Using different values of g for ascent vs descent',
        'Setting g = 0 at maximum height',
        'Changing the sign of g partway through a problem',
      ],
    },

    correction: {
      acknowledge: 'It does seem like something changes at the top - the object stops and reverses. Good observation about what\'s happening.',
      conflictQuestion: 'The gravitational force on a 1 kg ball near Earth\'s surface is about 10 N downward. Does that force disappear or change direction when the ball reaches its peak?',
      conflictExample: 'No, gravity doesn\'t turn off! It\'s always pulling down with the same 9.8 m/s² throughout the entire motion. What changes is the velocity - but the acceleration stays constant.',
      correctExplanation: 'Near Earth\'s surface, gravitational acceleration is constant at g = 9.8 m/s² downward. This doesn\'t change with the object\'s height (for typical problems), velocity, or direction of motion. It\'s what causes the velocity to change at a steady rate.',
      whiteboard: [
        {
          action: 'showDiagram',
          type: 'projectile',
          params: { v0: 20, angle: 90, showComponents: true, showVelocityAtPoints: true },
        },
      ],
      verificationQuestion: 'If I drop a ball from rest, and you throw one straight up, at the instant both have the same height, which one has greater acceleration?',
    },

    persistence: 'high',
    relatedMisconceptions: ['velocity-acceleration-confusion'],
  },

  {
    id: 'heavier-falls-faster',
    name: 'Heavier Objects Fall Faster',
    relatedConcepts: ['free-fall'],
    severity: 'moderate',

    description: 'Believing that heavier objects fall faster than lighter ones (ignoring air resistance).',

    origin: 'Aristotelian physics (intuitive, but wrong). Reinforced by everyday experiences with air resistance - a rock does fall faster than a feather in air.',

    detectPatterns: {
      verbal: [
        'the heavier one hits first',
        'it falls faster because it\'s heavier',
        'more mass means more acceleration',
      ],
      problemSolving: [
        'Using different g values for objects of different masses',
        'Trying to factor mass into free-fall acceleration',
      ],
    },

    correction: {
      acknowledge: 'That seems to match everyday experience - a rock does hit the ground before a feather. Let\'s think about why that happens.',
      conflictQuestion: 'If I drop a baseball and a bowling ball from the same height, which hits first? What if we could remove all the air?',
      conflictExample: 'The famous story is that Galileo tested this. In a vacuum, everything falls at the same rate - astronauts on the Moon dropped a hammer and a feather and they landed together. On Earth, air resistance affects light things more.',
      correctExplanation: 'In free fall (no air resistance), all objects have the same acceleration of g regardless of mass. The difference we see with a feather vs rock is entirely due to air resistance - not gravity pulling harder on heavier objects.',
      verificationQuestion: 'A 10 kg cannonball and a 1 kg baseball are dropped from the same height in a vacuum. Which hits first and why?',
    },

    persistence: 'medium',
  },

  {
    id: 'projectile-horizontal-slows',
    name: 'Horizontal Motion Slows in Projectile',
    relatedConcepts: ['projectile-motion'],
    severity: 'moderate',

    description: 'Believing that the horizontal velocity of a projectile decreases during flight, similar to the vertical velocity.',

    origin: 'Students generalize from vertical motion where velocity does change. They also have everyday experience with things slowing down due to friction.',

    detectPatterns: {
      verbal: [
        'the horizontal velocity decreases as it rises',
        'at the top it\'s moving slowest horizontally',
        'gravity slows down the horizontal motion too',
      ],
      problemSolving: [
        'Using kinematic equations with acceleration for horizontal motion',
        'Calculating horizontal velocity at different times incorrectly',
        'Drawing decreasing horizontal velocity vectors',
      ],
    },

    correction: {
      acknowledge: 'It makes sense to think everything slows down as it goes up. Let\'s think about what force is acting horizontally.',
      conflictQuestion: 'Gravity pulls things downward. Is there any horizontal force on a ball after you throw it? (Ignore air resistance)',
      conflictExample: 'There\'s no horizontal force on the ball. And Newton tells us if there\'s no force, there\'s no acceleration. The horizontal velocity stays exactly constant throughout the flight.',
      correctExplanation: 'Gravity only acts vertically. With no horizontal force, horizontal acceleration is zero, and horizontal velocity stays constant. That\'s why we can analyze projectile motion as two independent problems - constant velocity horizontally, constant acceleration vertically.',
      whiteboard: [
        {
          action: 'showDiagram',
          type: 'projectile',
          params: { v0: 20, angle: 45, showComponents: true, showVelocityAtPoints: true },
        },
      ],
      verificationQuestion: 'A ball is thrown with horizontal velocity 10 m/s and vertical velocity 15 m/s. What is the horizontal velocity at the top of the arc?',
    },

    persistence: 'medium',
    relatedMisconceptions: ['projectile-motion-dependent'],
  },

  {
    id: 'projectile-motion-dependent',
    name: 'Horizontal and Vertical Motion Are Linked',
    relatedConcepts: ['projectile-motion'],
    severity: 'moderate',

    description: 'Believing that horizontal and vertical components of projectile motion affect each other.',

    origin: 'The motion looks like one smooth curve, so students think it\'s one unified motion where components interact.',

    detectPatterns: {
      verbal: [
        'the horizontal motion affects how fast it falls',
        'it falls differently because it\'s also moving sideways',
        'the vertical velocity depends on the horizontal',
      ],
      problemSolving: [
        'Using total velocity in vertical calculations',
        'Coupling x and y equations incorrectly',
        'Thinking a faster horizontal velocity means slower vertical fall',
      ],
    },

    correction: {
      acknowledge: 'The parabolic path does look like one connected motion. Good observation that it curves.',
      conflictQuestion: 'If I drop a ball from a cliff, and at the exact same moment I throw another ball horizontally from the same cliff, which one hits the water first?',
      conflictExample: 'They hit at exactly the same time! The horizontal motion doesn\'t affect the vertical at all. The thrown ball travels farther horizontally, but it falls vertically at exactly the same rate as the dropped ball.',
      correctExplanation: 'Horizontal and vertical motion are completely independent. The only connection is time - they happen simultaneously. Each direction can be analyzed separately with its own initial velocity and acceleration.',
      verificationQuestion: 'A bullet is fired horizontally from a gun, and at the same instant, another bullet is dropped from the same height. Ignoring air resistance, which one hits the ground first?',
    },

    persistence: 'medium',
    relatedMisconceptions: ['projectile-horizontal-slows'],
  },

  {
    id: 'average-instantaneous-confusion',
    name: 'Average vs Instantaneous Confusion',
    relatedConcepts: ['velocity', 'acceleration'],
    severity: 'minor',

    description: 'Not distinguishing between average and instantaneous values, or not knowing when each is appropriate.',

    origin: 'Students often work with constant acceleration where average and instantaneous values are related simply. They don\'t develop clear mental models for when they differ.',

    detectPatterns: {
      verbal: [
        'the velocity is 5 m/s for the whole trip',
        'what\'s the acceleration at that moment',
        'using average velocity as if it\'s constant',
      ],
      problemSolving: [
        'Using v_avg in equations that require v or v₀',
        'Finding instantaneous velocity at a point using average formula',
        'Not recognizing when acceleration is non-constant',
      ],
    },

    correction: {
      acknowledge: 'It\'s true that we often get the same answer either way. Let\'s think about when they\'re different.',
      conflictQuestion: 'If you drive 30 mph for an hour and then 60 mph for an hour, what\'s your average speed? Is your velocity ever exactly that value during the trip?',
      conflictExample: 'The average is 45 mph, but your velocity was never actually 45 mph - it was always 30 or 60. Average tells you about the overall trip; instantaneous tells you about a specific moment.',
      correctExplanation: 'Average velocity = total displacement / total time. Instantaneous velocity = velocity at one specific moment. For constant velocity, they\'re equal. For changing velocity, they\'re usually different.',
      verificationQuestion: 'On a position-time graph, how do you find average velocity between two points? How do you find instantaneous velocity at one point?',
    },

    persistence: 'low',
  },

  {
    id: 'graphs-as-pictures',
    name: 'Graphs as Pictures of Motion',
    relatedConcepts: ['velocity', 'position'],
    severity: 'moderate',

    description: 'Interpreting physics graphs as literal pictures of the motion path rather than abstract representations of how quantities relate.',

    origin: 'Graphs in everyday contexts (maps, trajectories) do show physical paths. Students transfer this to x-t or v-t graphs.',

    detectPatterns: {
      verbal: [
        'the object goes up because the line goes up',
        'it curves because the graph curves',
        'it bounces when the graph goes down',
      ],
      problemSolving: [
        'Drawing x-t graphs that look like the physical path',
        'Confusing position vs time with position vs position',
        'Thinking upward slope means object moves upward spatially',
      ],
      graphical: [
        'Drawing x-t graphs that look like the physical path',
        'Thinking velocity-time graph shows the trajectory',
        'Interpreting peaks in x-t as "highest points" in space',
      ],
    },

    correction: {
      acknowledge: 'Graphs can show paths - like a map. But these physics graphs are showing something different.',
      conflictQuestion: 'If I walk in a straight line to the right, but I start slow and speed up, what does the position-time graph look like?',
      conflictExample: 'Even though you\'re moving in a straight line, the x-t graph curves upward. The curve doesn\'t mean your path curves - it shows that you\'re speeding up over time.',
      correctExplanation: 'An x-t or v-t graph is not a picture of the path. The x-axis is time, not space. A curved position-time graph means changing velocity, not a curved path. A straight velocity-time line with a slope means constant acceleration, not a hill.',
      whiteboard: [
        {
          action: 'showGraph',
          type: 'position-time',
          data: {
            title: 'Object Moving Right and Speeding Up',
            xLabel: 'Time (s)',
            yLabel: 'Position (m)',
            xRange: [0, 5],
            yRange: [0, 30],
            functions: [{ fn: 't^2', label: 'x = t²' }],
          },
        },
      ],
      verificationQuestion: 'If a position-time graph is a straight line, what does that tell you about the motion?',
    },

    persistence: 'medium',
  },

  // ============================================================================
  // ADDITIONAL MISCONCEPTIONS FROM OPENSTAX UNIVERSITY PHYSICS
  // ============================================================================
  {
    id: 'speed-velocity-confusion',
    name: 'Speed vs Velocity Confusion',
    relatedConcepts: ['velocity', 'displacement'],
    severity: 'moderate',
    // Based on OpenStax University Physics Vol. 1, Chapter 3

    description: 'Treating speed and velocity as interchangeable, not recognizing that velocity includes direction while speed does not.',

    origin: 'In everyday language, "speed" and "velocity" are used interchangeably. Students don\'t initially see the need for two different terms.',

    detectPatterns: {
      verbal: [
        'the velocity is 60 miles per hour',
        'speed is negative because it\'s going backwards',
        'what\'s the velocity? 10 meters per second',
      ],
      problemSolving: [
        'Treating speed as negative when object moves in negative direction',
        'Using speed when displacement is needed',
        'Not considering direction when asked for velocity',
      ],
    },

    correction: {
      acknowledge: 'In everyday conversation, we use speed and velocity interchangeably. Physics needs to be more precise.',
      conflictQuestion: 'If you drive 60 km north and then 60 km south, what\'s your total distance? What\'s your average speed? What\'s your average velocity?',
      conflictExample: 'You drove 120 km total at, say, 60 km/h average speed. But you ended up where you started, so displacement is zero, meaning average velocity is zero! Speed ignores direction; velocity depends on it.',
      correctExplanation: 'Speed is a scalar - just magnitude, always positive. Velocity is a vector - it has both magnitude AND direction. You can have high speed but zero average velocity (like running laps). Velocity can be negative (direction), but speed cannot.',
      verificationQuestion: 'A car drives 100 km east then 100 km west, taking 2 hours total. What is its average speed? What is its average velocity?',
    },

    persistence: 'medium',
  },

  {
    id: 'acceleration-means-speeding-up',
    name: 'Acceleration Always Means Speeding Up',
    relatedConcepts: ['acceleration', 'velocity'],
    severity: 'critical',
    // Based on OpenStax University Physics Vol. 1, Chapter 3

    description: 'Believing that acceleration always means an object is going faster, not understanding that negative acceleration (or acceleration opposite to velocity) causes slowing down.',

    origin: 'In everyday language, "accelerating" exclusively means speeding up. The term "deceleration" reinforces this by seeming to be something different from acceleration.',

    detectPatterns: {
      verbal: [
        'it\'s decelerating, not accelerating',
        'acceleration makes things go faster',
        'if it\'s slowing down there\'s no acceleration',
        'negative acceleration means no acceleration',
      ],
      problemSolving: [
        'Unable to use negative acceleration in equations',
        'Treating deceleration as a separate concept from acceleration',
        'Confusion about sign of acceleration when object slows down',
      ],
    },

    correction: {
      acknowledge: 'You\'re right that in everyday speech, "accelerating" means speeding up. But physics defines acceleration differently.',
      conflictQuestion: 'When you step on the brakes in a car, is there a force on you? If there\'s a force, what does Newton\'s second law say about acceleration?',
      conflictExample: 'When braking, you feel pushed forward - that\'s because there\'s a backward acceleration (deceleration). F = ma still applies! The acceleration is just in the opposite direction to the velocity.',
      correctExplanation: 'Acceleration is the rate of change of velocity, regardless of whether speed increases or decreases. When acceleration is in the same direction as velocity, speed increases. When acceleration opposes velocity, speed decreases. "Deceleration" is just negative acceleration.',
      whiteboard: [
        {
          action: 'showTable',
          headers: ['Velocity', 'Acceleration', 'Result'],
          rows: [
            ['+', '+', 'Speeding up'],
            ['+', '-', 'Slowing down'],
            ['-', '-', 'Speeding up (in - direction)'],
            ['-', '+', 'Slowing down'],
          ],
        },
      ],
      verificationQuestion: 'A ball rolling right at 5 m/s has an acceleration of -2 m/s² (left). Is the ball speeding up or slowing down?',
    },

    persistence: 'high',
    relatedMisconceptions: ['velocity-acceleration-confusion'],
  },

  {
    id: 'position-zero-means-stopped',
    name: 'Position Zero Means Object is Stopped',
    relatedConcepts: ['position', 'velocity'],
    severity: 'minor',
    // Based on OpenStax University Physics Vol. 1, Chapter 3

    description: 'Confusing position with velocity - thinking that when an object passes through the origin (position = 0), it must be at rest.',

    origin: 'Students conflate "being at zero" with "having zero velocity." The number zero takes on an outsized significance.',

    detectPatterns: {
      verbal: [
        'when x = 0, the object stops',
        'at the origin it has no velocity',
        'position is zero so it\'s not moving',
      ],
      problemSolving: [
        'Setting v = 0 when x = 0',
        'Confusion when position function passes through zero but velocity is non-zero',
      ],
    },

    correction: {
      acknowledge: 'It\'s natural to associate "zero position" with something special. But position and velocity are independent quantities.',
      conflictQuestion: 'Imagine you\'re jogging past a mailbox. The moment you pass it, what\'s your position relative to the mailbox? What\'s your velocity?',
      conflictExample: 'At the instant you pass the mailbox, your position relative to it is zero, but you\'re still moving! Position tells you WHERE something is. Velocity tells you HOW FAST it\'s moving. They\'re completely different things.',
      correctExplanation: 'Position tells us location relative to a reference point. Velocity tells us rate of change of position. An object can be at x = 0 while moving at any velocity, just like it can be at any position while stopped. Don\'t mix up "where" with "how fast."',
      verificationQuestion: 'If x(t) = 10t - 5, what is the position and velocity at t = 0.5 s?',
    },

    persistence: 'low',
  },
];
