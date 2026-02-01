/**
 * AP Physics 1: Kinematics - Worked Examples
 *
 * Step-by-step walkthroughs with teaching notes for common problem types.
 */

import type { WorkedExample } from '../../types';

export const workedExamples: WorkedExample[] = [
  {
    id: 'worked-kinematic-equation-selection',
    title: 'Choosing the Right Kinematic Equation',
    concepts: ['velocity', 'acceleration', 'displacement'],
    difficulty: 2,

    problem: {
      statement: 'A car starts from rest and accelerates at 3 m/s² for 8 seconds. How far does it travel?',
      givenValues: [
        { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity (rest)' },
        { symbol: 'a', value: 3, unit: 'm/s²', description: 'Acceleration' },
        { symbol: 't', value: 8, unit: 's', description: 'Time' },
      ],
      find: 'Displacement (Δx)',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Alright, let\'s start by listing what we know and what we need to find. What information does the problem give us?',
        checkQuestion: 'What are our given values?',
      },
      {
        step: 2,
        tutorSays: 'Good. We have initial velocity is zero since it starts from rest, acceleration is 3 meters per second squared, and time is 8 seconds. We need to find displacement.',
        tutorDoes: {
          action: 'showTable',
          headers: ['Known', 'Unknown'],
          rows: [
            ['v₀ = 0 m/s', 'Δx = ?'],
            ['a = 3 m/s²', ''],
            ['t = 8 s', ''],
          ],
        },
      },
      {
        step: 3,
        tutorSays: 'Now here\'s the key question: which kinematic equation should we use? We have four main ones. Let me show you how to choose.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v = v_0 + at \\quad\\quad \\Delta x = v_0 t + \\frac{1}{2}at^2',
          label: 'Kinematic Equations',
        },
      },
      {
        step: 4,
        tutorSays: 'Look at what variable each equation involves. We know v naught, a, and t. We need delta x. Which equation has exactly those variables?',
        checkQuestion: 'Which equation connects v₀, a, t, and Δx?',
        commonStumble: 'Students sometimes try to find v first. That works, but isn\'t the most direct path.',
      },
      {
        step: 5,
        tutorSays: 'Right, the position-time equation. It has everything we need and nothing extra. Let me write it out.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x = v_0 t + \\frac{1}{2}at^2',
          label: 'Our equation',
        },
      },
      {
        step: 6,
        tutorSays: 'Since the car starts from rest, v naught is zero. That whole first term drops out. What are we left with?',
        checkQuestion: 'What does the equation simplify to when v₀ = 0?',
      },
      {
        step: 7,
        tutorSays: 'Exactly, just delta x equals one-half a t squared. Now plug in our numbers. What do you get?',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x = \\frac{1}{2}(3)(8)^2 = \\frac{1}{2}(3)(64) = 96 \\text{ m}',
          label: 'Solution',
        },
      },
      {
        step: 8,
        tutorSays: 'The car travels 96 meters. Let\'s do a quick sanity check: after 8 seconds at 3 meters per second squared acceleration, the car is going... what speed?',
        checkQuestion: 'What\'s the final velocity?',
      },
      {
        step: 9,
        tutorSays: 'Right, v equals a times t equals 24 meters per second. Average velocity would be half that, so 12 meters per second times 8 seconds gives 96 meters. Our answer checks out!',
      },
    ],

    keyTakeaways: [
      'List knowns and unknowns first',
      'Choose the equation that has your unknowns and no extra variables',
      'When v₀ = 0, the equation simplifies significantly',
      'Always sanity-check your answer',
    ],

    practiceNow: 'basic-velocity-1',
  },

  {
    id: 'worked-free-fall-up',
    title: 'Ball Thrown Straight Up',
    concepts: ['free-fall', 'velocity', 'acceleration'],
    difficulty: 3,

    problem: {
      statement: 'You throw a ball straight up with an initial velocity of 15 m/s. Find the maximum height and total time in the air. Use g = 10 m/s².',
      givenValues: [
        { symbol: 'v_0', value: 15, unit: 'm/s', description: 'Initial velocity (upward)' },
        { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
      ],
      find: 'Maximum height and total time of flight',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Let\'s visualize what happens. The ball goes up, slows down, stops at the top, then falls back down. What\'s special about that moment at the very top?',
        checkQuestion: 'What is the velocity at maximum height?',
      },
      {
        step: 2,
        tutorSays: 'Exactly, velocity is zero at the top. That\'s our key insight. Let me draw this out.',
        tutorDoes: {
          action: 'showDiagram',
          type: 'projectile',
          params: { v0: 15, angle: 90, showComponents: true, showVelocityAtPoints: true },
        },
      },
      {
        step: 3,
        tutorSays: 'Now, what about acceleration at the top? Is it also zero?',
        checkQuestion: 'Is acceleration zero at maximum height?',
        commonStumble: 'Many students think a = 0 at the top. The velocity is zero, but gravity still pulls.',
      },
      {
        step: 4,
        tutorSays: 'No! Gravity is always acting, even at the peak. If acceleration were zero there, the ball would just float. The acceleration is constantly g equals 10 meters per second squared downward, throughout the entire flight.',
      },
      {
        step: 5,
        tutorSays: 'Let\'s set up coordinates. I\'ll take up as positive. That means acceleration is negative: a equals negative 10 meters per second squared.',
        tutorDoes: {
          action: 'showTable',
          headers: ['Variable', 'Value'],
          rows: [
            ['v₀', '+15 m/s (up)'],
            ['v (at top)', '0 m/s'],
            ['a', '-10 m/s² (down)'],
          ],
        },
      },
      {
        step: 6,
        tutorSays: 'To find maximum height, I need an equation with v, v naught, a, and height, but not time. Which equation is that?',
        checkQuestion: 'Which kinematic equation doesn\'t involve time?',
      },
      {
        step: 7,
        tutorSays: 'Right, v squared equals v naught squared plus 2 a delta x. At the top, v equals zero. Let me solve for height.',
        tutorDoes: {
          action: 'showEquation',
          latex: '0 = v_0^2 + 2a(\\Delta y) \\Rightarrow \\Delta y = -\\frac{v_0^2}{2a}',
          label: 'Solving for height',
        },
      },
      {
        step: 8,
        tutorSays: 'Plugging in: delta y equals negative 15 squared over 2 times negative 10. That\'s negative 225 over negative 20.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta y = -\\frac{(15)^2}{2(-10)} = -\\frac{225}{-20} = 11.25 \\text{ m}',
          label: 'Maximum height',
        },
      },
      {
        step: 9,
        tutorSays: 'Maximum height is 11.25 meters. Now for time. Here\'s a shortcut: the motion is symmetric. Time up equals time down. So I just need to find time to reach the top and double it.',
        checkQuestion: 'What equation can find time to reach the top?',
      },
      {
        step: 10,
        tutorSays: 'Use v equals v naught plus a t. At the top, v equals zero.',
        tutorDoes: {
          action: 'showEquation',
          latex: '0 = 15 + (-10)t \\Rightarrow t_{up} = 1.5 \\text{ s}',
          label: 'Time to top',
        },
      },
      {
        step: 11,
        tutorSays: 'Time to reach the top is 1.5 seconds. By symmetry, it takes another 1.5 seconds to fall back. Total time is 3 seconds.',
        tutorDoes: {
          action: 'showEquation',
          latex: 't_{total} = 2 \\times t_{up} = 2 \\times 1.5 = 3 \\text{ s}',
          label: 'Total time',
        },
      },
    ],

    keyTakeaways: [
      'At maximum height, velocity is zero but acceleration is NOT zero',
      'Gravity acts constantly throughout the flight (a = -g if up is positive)',
      'Motion is symmetric: time up = time down',
      'Use v² = v₀² + 2aΔx when time isn\'t involved',
    ],

    practiceNow: 'free-fall-2',
  },

  {
    id: 'worked-projectile-components',
    title: 'Projectile Motion with Components',
    concepts: ['projectile-motion'],
    difficulty: 4,

    problem: {
      statement: 'A football is kicked at 25 m/s at an angle of 37° above the horizontal. Find how far it travels horizontally before landing. Use g = 10 m/s², sin(37°) = 0.6, cos(37°) = 0.8.',
      givenValues: [
        { symbol: 'v_0', value: 25, unit: 'm/s', description: 'Initial speed' },
        { symbol: '\\theta', value: 37, unit: '°', description: 'Launch angle' },
        { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
      ],
      find: 'Horizontal range',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Projectile motion might look complicated, but here\'s the key insight: horizontal and vertical motion are completely independent. We can analyze them separately.',
        tutorDoes: {
          action: 'showDiagram',
          type: 'projectile',
          params: { v0: 25, angle: 37, showComponents: true, showVelocityAtPoints: true },
        },
      },
      {
        step: 2,
        tutorSays: 'First, let\'s break the initial velocity into components. Horizontal is v naught times cosine theta, vertical is v naught times sine theta.',
        checkQuestion: 'Can you calculate v₀ₓ and v₀ᵧ?',
      },
      {
        step: 3,
        tutorSays: 'Let me show the calculation.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v_{0x} = 25 \\cos(37°) = 25(0.8) = 20 \\text{ m/s}',
          label: 'Horizontal component',
        },
      },
      {
        step: 4,
        tutorSays: 'And vertical.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v_{0y} = 25 \\sin(37°) = 25(0.6) = 15 \\text{ m/s}',
          label: 'Vertical component',
        },
      },
      {
        step: 5,
        tutorSays: 'Now, what\'s the horizontal acceleration? Remember, gravity only pulls downward.',
        checkQuestion: 'Is there any horizontal force on the football after it leaves the foot?',
      },
      {
        step: 6,
        tutorSays: 'Right, no horizontal force means no horizontal acceleration. The horizontal velocity stays constant at 20 meters per second throughout the flight!',
        tutorDoes: {
          action: 'showTable',
          headers: ['Horizontal', 'Vertical'],
          rows: [
            ['v₀ₓ = 20 m/s', 'v₀ᵧ = 15 m/s'],
            ['aₓ = 0', 'aᵧ = -10 m/s²'],
            ['vₓ = constant', 'vᵧ changes'],
          ],
        },
      },
      {
        step: 7,
        tutorSays: 'To find range, I need horizontal distance equals horizontal velocity times time. So what\'s the time of flight? That comes from the vertical motion.',
        commonStumble: 'Students often try to use total velocity instead of components.',
      },
      {
        step: 8,
        tutorSays: 'The ball lands at the same height it was kicked from. So total vertical displacement is zero. Let me use that.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta y = v_{0y}t + \\frac{1}{2}a_y t^2 = 0',
          label: 'Vertical displacement = 0',
        },
      },
      {
        step: 9,
        tutorSays: 'Substituting our values: 15t minus 5t squared equals zero. I can factor out t.',
        tutorDoes: {
          action: 'showEquation',
          latex: '15t - 5t^2 = 0 \\Rightarrow t(15 - 5t) = 0',
          label: 'Factoring',
        },
      },
      {
        step: 10,
        tutorSays: 'So t equals zero, which is the start, or t equals 3 seconds, which is when it lands. The time of flight is 3 seconds.',
        checkQuestion: 'Now can you find the range?',
      },
      {
        step: 11,
        tutorSays: 'Range equals horizontal velocity times time.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'R = v_{0x} \\times t = 20 \\times 3 = 60 \\text{ m}',
          label: 'Range',
        },
      },
      {
        step: 12,
        tutorSays: 'The football travels 60 meters horizontally. Notice we never mixed horizontal and vertical quantities - we analyzed them completely separately, only connecting through time.',
      },
    ],

    keyTakeaways: [
      'Always decompose initial velocity into horizontal and vertical components',
      'Horizontal: constant velocity (no acceleration)',
      'Vertical: constant acceleration (free fall)',
      'The only thing they share is time',
      'For level ground, set Δy = 0 to find time of flight',
    ],

    practiceNow: 'projectile-2',
  },

  {
    id: 'worked-graph-interpretation',
    title: 'Reading Motion Graphs',
    concepts: ['velocity', 'acceleration', 'displacement'],
    difficulty: 3,

    problem: {
      statement: 'A velocity-time graph shows an object starting at rest, accelerating uniformly to 20 m/s over 4 seconds, then moving at constant velocity for 6 more seconds. Find the total displacement and the acceleration during the first 4 seconds.',
      givenValues: [
        { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity' },
        { symbol: 'v_f', value: 20, unit: 'm/s', description: 'Final velocity' },
        { symbol: 't_1', value: 4, unit: 's', description: 'Acceleration phase' },
        { symbol: 't_2', value: 6, unit: 's', description: 'Constant velocity phase' },
      ],
      find: 'Acceleration and total displacement',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Let me draw this velocity-time graph. It\'s one of the most useful tools in kinematics.',
        tutorDoes: {
          action: 'showGraph',
          type: 'velocity-time',
          data: {
            title: 'Velocity vs Time',
            xLabel: 'Time (s)',
            yLabel: 'Velocity (m/s)',
            xRange: [0, 10],
            yRange: [0, 25],
            functions: [
              { fn: '5*t', domain: [0, 4], label: 'Accelerating' },
              { fn: '20', domain: [4, 10], label: 'Constant v' },
            ],
          },
        },
      },
      {
        step: 2,
        tutorSays: 'There are two magic things about velocity-time graphs. The slope tells you acceleration. The area under the curve tells you displacement. Let\'s use both.',
        checkQuestion: 'What does the slope of a v-t graph represent?',
      },
      {
        step: 3,
        tutorSays: 'Right, slope equals acceleration. During the first 4 seconds, the line goes from 0 to 20 meters per second.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'a = \\frac{\\Delta v}{\\Delta t} = \\frac{20 - 0}{4 - 0} = 5 \\text{ m/s}^2',
          label: 'Acceleration',
        },
      },
      {
        step: 4,
        tutorSays: 'The acceleration is 5 meters per second squared. Now for displacement - that\'s the area under the graph. Let\'s break it into two parts.',
        commonStumble: 'Students sometimes try to use equations when reading the graph directly is easier.',
      },
      {
        step: 5,
        tutorSays: 'The first section, from 0 to 4 seconds, is a triangle. What\'s the area of a triangle?',
        checkQuestion: 'Area = (1/2) × base × height. What values do we use?',
      },
      {
        step: 6,
        tutorSays: 'Base is 4 seconds, height is 20 meters per second.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'A_1 = \\frac{1}{2} \\times 4 \\times 20 = 40 \\text{ m}',
          label: 'Displacement (0-4 s)',
        },
      },
      {
        step: 7,
        tutorSays: 'The second section, from 4 to 10 seconds, is a rectangle. Base is 6 seconds, height is 20 meters per second.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'A_2 = 6 \\times 20 = 120 \\text{ m}',
          label: 'Displacement (4-10 s)',
        },
      },
      {
        step: 8,
        tutorSays: 'Total displacement is the sum of the two areas.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x_{total} = 40 + 120 = 160 \\text{ m}',
          label: 'Total displacement',
        },
      },
      {
        step: 9,
        tutorSays: 'So the object travels 160 meters total. The v-t graph gives us everything: slope for acceleration, area for displacement. It\'s incredibly powerful.',
      },
    ],

    keyTakeaways: [
      'Slope of v-t graph = acceleration',
      'Area under v-t graph = displacement',
      'Break complex graphs into simple shapes (triangles, rectangles)',
      'During constant velocity, a = 0 (horizontal line on v-t graph)',
    ],

    practiceNow: 'graph-interpretation-1',
  },

  // ============================================================================
  // EXAMPLES FROM OPENSTAX UNIVERSITY PHYSICS VOL. 1
  // ============================================================================
  {
    id: 'worked-average-velocity-vector',
    title: 'Average Velocity: The Vector Nature of Displacement',
    concepts: ['displacement', 'velocity'],
    difficulty: 2,
    // From OpenStax University Physics Vol. 1, Chapter 3, Example 3.1

    problem: {
      statement: 'The position of a particle moving along the x-axis varies with time according to x(t) = 40 - 5t, where x is in meters and t is in seconds. (a) Find the displacement of the particle from t = 0 to t = 2 s. (b) What is the average velocity during this time interval? (c) Is the velocity increasing or decreasing with time?',
      givenValues: [
        { symbol: 't_1', value: 0, unit: 's', description: 'Initial time' },
        { symbol: 't_2', value: 2, unit: 's', description: 'Final time' },
      ],
      find: 'Displacement, average velocity, and velocity behavior',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'We have a position function that tells us exactly where the particle is at any time. Let\'s start by finding where it is at t = 0 and t = 2 seconds.',
        checkQuestion: 'What is x(0)?',
      },
      {
        step: 2,
        tutorSays: 'At t = 0: x(0) = 40 - 5(0) = 40 meters. Now let\'s find x(2).',
        tutorDoes: {
          action: 'showEquation',
          latex: 'x(0) = 40 - 5(0) = 40 \\text{ m}',
          label: 'Initial position',
        },
      },
      {
        step: 3,
        tutorSays: 'At t = 2 seconds: x(2) = 40 - 5(2) = 30 meters.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'x(2) = 40 - 5(2) = 30 \\text{ m}',
          label: 'Position at t = 2 s',
        },
      },
      {
        step: 4,
        tutorSays: 'Now, displacement is the change in position. What\'s the displacement?',
        checkQuestion: 'Δx = x(2) - x(0) = ?',
      },
      {
        step: 5,
        tutorSays: 'The displacement is negative, meaning the particle moved in the negative x direction.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x = x(2) - x(0) = 30 - 40 = -10 \\text{ m}',
          label: 'Displacement',
        },
      },
      {
        step: 6,
        tutorSays: 'For average velocity, we divide displacement by time interval.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v_{avg} = \\frac{\\Delta x}{\\Delta t} = \\frac{-10 \\text{ m}}{2 \\text{ s}} = -5 \\text{ m/s}',
          label: 'Average velocity',
        },
      },
      {
        step: 7,
        tutorSays: 'Interesting! The position function is linear, so the velocity is constant at -5 m/s. It\'s not increasing or decreasing - it stays the same throughout.',
        commonStumble: 'Students sometimes confuse "constant velocity" with "zero velocity." A constant negative velocity means steady motion in the negative direction.',
      },
    ],

    keyTakeaways: [
      'Displacement can be negative (direction matters)',
      'Average velocity = Δx/Δt (not |Δx|/Δt)',
      'When position varies linearly with time, velocity is constant',
      'Negative velocity means motion in the negative direction',
    ],

    practiceNow: 'displacement-vs-distance-1',
  },

  {
    id: 'worked-instantaneous-velocity',
    title: 'Instantaneous Velocity from Position Function',
    concepts: ['velocity', 'position'],
    difficulty: 3,
    // From OpenStax University Physics Vol. 1, Chapter 3, Example 3.4

    problem: {
      statement: 'The position of a particle is given by x(t) = 3t + 0.5t³, where x is in meters and t is in seconds. Find the instantaneous velocity at t = 2 s.',
      givenValues: [
        { symbol: 't', value: 2, unit: 's', description: 'Time of interest' },
      ],
      find: 'Instantaneous velocity at t = 2 s',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Instantaneous velocity is found by taking the derivative of position with respect to time. The derivative gives us the rate of change at any instant.',
        checkQuestion: 'Do you know how to take a derivative?',
      },
      {
        step: 2,
        tutorSays: 'Velocity is the derivative of position: v(t) = dx/dt. Let me differentiate term by term.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v(t) = \\frac{dx}{dt} = \\frac{d}{dt}(3t + 0.5t^3)',
          label: 'Taking the derivative',
        },
      },
      {
        step: 3,
        tutorSays: 'Using the power rule: d/dt(tⁿ) = n×tⁿ⁻¹. The derivative of 3t is 3, and the derivative of 0.5t³ is 1.5t².',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v(t) = 3 + 1.5t^2',
          label: 'Velocity function',
        },
      },
      {
        step: 4,
        tutorSays: 'Now we have the velocity as a function of time. To find instantaneous velocity at t = 2 s, just plug in t = 2.',
        checkQuestion: 'What is v(2)?',
      },
      {
        step: 5,
        tutorSays: 'Substituting t = 2 seconds into our velocity equation.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v(2) = 3 + 1.5(2)^2 = 3 + 6 = 9 \\text{ m/s}',
          label: 'Instantaneous velocity at t = 2 s',
        },
      },
      {
        step: 6,
        tutorSays: 'The particle is moving at 9 m/s in the positive direction at t = 2 seconds. Notice this velocity changes with time - it\'s accelerating because v(t) depends on t.',
        commonStumble: 'Students sometimes find average velocity instead. Average velocity over 0 to 2 s would be different from this instantaneous value.',
      },
    ],

    keyTakeaways: [
      'Instantaneous velocity = derivative of position',
      'v(t) = dx/dt',
      'If v(t) depends on t, the object is accelerating',
      'The power rule makes these derivatives straightforward',
    ],

    practiceNow: 'acceleration-1',
  },

  {
    id: 'worked-stopping-distance',
    title: 'Calculating Stopping Distance',
    concepts: ['acceleration', 'velocity', 'displacement'],
    difficulty: 3,
    // From OpenStax University Physics Vol. 1, Chapter 3, Example 3.10

    problem: {
      statement: 'A cheetah running at 30 m/s sees prey and begins to decelerate at 4 m/s². How far does the cheetah travel before stopping?',
      givenValues: [
        { symbol: 'v_0', value: 30, unit: 'm/s', description: 'Initial velocity' },
        { symbol: 'v', value: 0, unit: 'm/s', description: 'Final velocity (stopped)' },
        { symbol: 'a', value: -4, unit: 'm/s²', description: 'Acceleration (deceleration)' },
      ],
      find: 'Stopping distance',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'The cheetah starts fast and slows to a stop. We know initial velocity, final velocity, and acceleration. We need distance. What kinematic equation should we use?',
        checkQuestion: 'Which equation has v, v₀, a, and Δx but not t?',
      },
      {
        step: 2,
        tutorSays: 'The velocity-displacement equation is perfect here. It connects velocity, acceleration, and displacement without requiring time.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v^2 = v_0^2 + 2a\\Delta x',
          label: 'Kinematic equation',
        },
      },
      {
        step: 3,
        tutorSays: 'Now let\'s solve for displacement. Since v = 0 (the cheetah stops), the equation simplifies nicely.',
        tutorDoes: {
          action: 'showEquation',
          latex: '0 = v_0^2 + 2a\\Delta x \\Rightarrow \\Delta x = -\\frac{v_0^2}{2a}',
          label: 'Solving for displacement',
        },
      },
      {
        step: 4,
        tutorSays: 'Plugging in our values. Note that acceleration is negative because the cheetah is slowing down.',
        checkQuestion: 'Why is acceleration negative here?',
        commonStumble: 'Students often forget the negative sign for deceleration and get a negative displacement, which doesn\'t make sense physically.',
      },
      {
        step: 5,
        tutorSays: 'Let\'s calculate.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x = -\\frac{(30)^2}{2(-4)} = -\\frac{900}{-8} = 112.5 \\text{ m}',
          label: 'Stopping distance',
        },
      },
      {
        step: 6,
        tutorSays: 'The cheetah needs 112.5 meters to stop from 30 m/s. That\'s over a football field! This shows why stopping distance increases dramatically with speed - it depends on v² not v.',
      },
    ],

    keyTakeaways: [
      'Use v² = v₀² + 2aΔx when time is not given or needed',
      'Deceleration means negative acceleration (opposite to velocity)',
      'Stopping distance is proportional to v² - double speed means quadruple stopping distance',
      'Always check that your answer makes physical sense',
    ],

    practiceNow: 'deceleration-1',
  },

  {
    id: 'worked-free-fall-comparison',
    title: 'Free Fall: Comparing Dropped and Thrown Objects',
    concepts: ['free-fall', 'acceleration'],
    difficulty: 3,
    // From OpenStax University Physics Vol. 1, Chapter 3, Example 3.14

    problem: {
      statement: 'A ball is dropped from a height of 100 m. At the same instant, a second ball is thrown straight down from the same height with an initial velocity of 10 m/s. (a) How long does it take each ball to reach the ground? (b) What is the difference in their velocities when they hit the ground? Use g = 10 m/s².',
      givenValues: [
        { symbol: 'h', value: 100, unit: 'm', description: 'Height' },
        { symbol: 'v_{0,dropped}', value: 0, unit: 'm/s', description: 'Initial velocity of dropped ball' },
        { symbol: 'v_{0,thrown}', value: 10, unit: 'm/s', description: 'Initial velocity of thrown ball' },
        { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
      ],
      find: 'Time for each ball to fall, velocity difference at impact',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'Both balls experience the same acceleration g, but they start with different velocities. Let\'s set up coordinates with downward as positive.',
        tutorDoes: {
          action: 'showTable',
          headers: ['', 'Dropped Ball', 'Thrown Ball'],
          rows: [
            ['v₀', '0 m/s', '10 m/s'],
            ['a', '10 m/s²', '10 m/s²'],
            ['Δy', '100 m', '100 m'],
          ],
        },
      },
      {
        step: 2,
        tutorSays: 'For the dropped ball with v₀ = 0, we use h = ½gt² to find time.',
        tutorDoes: {
          action: 'showEquation',
          latex: 't_{dropped} = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2(100)}{10}} = \\sqrt{20} \\approx 4.47 \\text{ s}',
          label: 'Time for dropped ball',
        },
      },
      {
        step: 3,
        tutorSays: 'For the thrown ball, we need the full kinematic equation since v₀ ≠ 0. Let\'s solve h = v₀t + ½gt².',
        tutorDoes: {
          action: 'showEquation',
          latex: '100 = 10t + 5t^2 \\Rightarrow t^2 + 2t - 20 = 0',
          label: 'Setting up quadratic for thrown ball',
        },
      },
      {
        step: 4,
        tutorSays: 'Using the quadratic formula, and taking the positive root.',
        tutorDoes: {
          action: 'showEquation',
          latex: 't_{thrown} = \\frac{-2 + \\sqrt{4 + 80}}{2} = \\frac{-2 + 9.17}{2} \\approx 3.58 \\text{ s}',
          label: 'Time for thrown ball',
        },
      },
      {
        step: 5,
        tutorSays: 'The thrown ball lands about 0.9 seconds earlier. Now let\'s find the final velocities using v = v₀ + gt.',
        checkQuestion: 'What are the final velocities?',
      },
      {
        step: 6,
        tutorSays: 'For the dropped ball:',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v_{dropped} = 0 + 10(4.47) = 44.7 \\text{ m/s}',
          label: 'Final velocity of dropped ball',
        },
      },
      {
        step: 7,
        tutorSays: 'For the thrown ball:',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v_{thrown} = 10 + 10(3.58) = 45.8 \\text{ m/s}',
          label: 'Final velocity of thrown ball',
        },
      },
      {
        step: 8,
        tutorSays: 'The velocity difference is only about 1.1 m/s. Interesting! Even though one ball started 10 m/s faster, the difference in final velocities is much smaller. That\'s because the slower ball had more time to accelerate.',
        commonStumble: 'Students might expect the velocity difference to stay at 10 m/s throughout, but the dropped ball has more time to accelerate.',
      },
    ],

    keyTakeaways: [
      'Same acceleration does not mean same time of fall if initial velocities differ',
      'The quadratic formula is often needed when v₀ ≠ 0',
      'Initial velocity differences diminish over time when falling (the dropped ball catches up somewhat)',
      'Both balls have the same acceleration throughout - only velocities differ',
    ],

    practiceNow: 'free-fall-1',
  },

  {
    id: 'worked-velocity-time-area',
    title: 'Finding Displacement from Velocity-Time Graph',
    concepts: ['velocity', 'displacement'],
    difficulty: 3,
    // From OpenStax University Physics Vol. 1, Chapter 3, Example 3.7

    problem: {
      statement: 'A jet accelerates from rest for the first 20 seconds with a constant acceleration of 10 m/s², then maintains constant velocity for the next 40 seconds. Find the total displacement.',
      givenValues: [
        { symbol: 'a_1', value: 10, unit: 'm/s²', description: 'Acceleration phase' },
        { symbol: 't_1', value: 20, unit: 's', description: 'Acceleration time' },
        { symbol: 't_2', value: 40, unit: 's', description: 'Constant velocity time' },
      ],
      find: 'Total displacement',
    },

    walkthrough: [
      {
        step: 1,
        tutorSays: 'This problem has two phases. Let me sketch the velocity-time graph first. During acceleration, velocity increases linearly. Then it stays constant.',
        tutorDoes: {
          action: 'showGraph',
          type: 'velocity-time',
          data: {
            title: 'Jet Velocity vs Time',
            xLabel: 'Time (s)',
            yLabel: 'Velocity (m/s)',
            xRange: [0, 60],
            yRange: [0, 250],
            functions: [
              { fn: '10*t', domain: [0, 20], label: 'Accelerating' },
              { fn: '200', domain: [20, 60], label: 'Constant v' },
            ],
          },
        },
      },
      {
        step: 2,
        tutorSays: 'First, what velocity does the jet reach after accelerating for 20 seconds?',
        checkQuestion: 'v = v₀ + at with v₀ = 0, a = 10, t = 20?',
      },
      {
        step: 3,
        tutorSays: 'The jet reaches 200 m/s (that\'s about 450 mph!). Now, displacement is the area under the v-t curve.',
        tutorDoes: {
          action: 'showEquation',
          latex: 'v = 0 + 10(20) = 200 \\text{ m/s}',
          label: 'Final velocity of acceleration phase',
        },
      },
      {
        step: 4,
        tutorSays: 'For the first 20 seconds, the area is a triangle. Base = 20 s, height = 200 m/s.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x_1 = \\frac{1}{2}(20)(200) = 2000 \\text{ m}',
          label: 'Displacement during acceleration',
        },
      },
      {
        step: 5,
        tutorSays: 'For the next 40 seconds at constant velocity, the area is a rectangle.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x_2 = 200 \\times 40 = 8000 \\text{ m}',
          label: 'Displacement during constant velocity',
        },
      },
      {
        step: 6,
        tutorSays: 'Total displacement is the sum of both areas.',
        tutorDoes: {
          action: 'showEquation',
          latex: '\\Delta x_{total} = 2000 + 8000 = 10{,}000 \\text{ m} = 10 \\text{ km}',
          label: 'Total displacement',
        },
      },
      {
        step: 7,
        tutorSays: 'The jet travels 10 km total. Notice that most of the distance (80%) is covered during the constant velocity phase, even though it lasts only twice as long. That\'s because velocity is so much higher during that phase.',
      },
    ],

    keyTakeaways: [
      'Area under v-t graph = displacement',
      'Break complex graphs into simple shapes (triangles, rectangles)',
      'At higher velocities, you cover more distance per unit time',
      'Can verify with kinematic equations: Δx = ½at² for acceleration phase',
    ],

    practiceNow: 'graph-interpretation-1',
  },
];
