/**
 * AP Physics 1: Kinematics - Practice Problems
 */

import type { Problem } from '../../types';

export const problems: Problem[] = [
  // ============================================================================
  // BASIC VELOCITY AND DISPLACEMENT
  // ============================================================================
  {
    id: 'basic-velocity-1',
    source: 'curated',
    concepts: ['velocity', 'displacement'],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 2,

    title: 'Runner\'s Average Velocity',
    statement: 'A runner completes a 400-meter track in 50 seconds. What is the runner\'s average speed?',

    givenValues: [
      { symbol: 'd', value: 400, unit: 'm', description: 'Track length' },
      { symbol: 't', value: 50, unit: 's', description: 'Time' },
    ],
    unknowns: [
      { symbol: 'v_{avg}', description: 'Average speed', unit: 'm/s' },
    ],

    solution: {
      approach: 'Use the definition of average speed: total distance divided by time.',
      steps: [
        {
          stepNumber: 1,
          description: 'Write the average speed formula',
          equation: 'v_{avg} = \\frac{d}{t}',
        },
        {
          stepNumber: 2,
          description: 'Substitute the values',
          substitution: 'v_{avg} = \\frac{400 \\text{ m}}{50 \\text{ s}}',
        },
        {
          stepNumber: 3,
          description: 'Calculate',
          result: 'v_{avg} = 8 \\text{ m/s}',
        },
      ],
      finalAnswer: { value: 8, unit: 'm/s' },
    },

    hints: [
      { level: 1, hint: 'What formula relates speed, distance, and time?' },
      { level: 2, hint: 'Average speed = total distance ÷ time' },
      { level: 3, hint: 'Divide 400 by 50' },
    ],

    tags: ['basic', 'average-speed'],
  },

  {
    id: 'displacement-vs-distance-1',
    source: 'curated',
    concepts: ['displacement', 'position'],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 3,

    title: 'Round Trip',
    statement: 'A student walks 200 meters east to school, then realizes they forgot their homework and walks 200 meters back home. What is (a) the total distance traveled and (b) the total displacement?',

    solution: {
      approach: 'Distinguish between distance (total path length) and displacement (change in position).',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate total distance',
          explanation: 'Distance is the total path length, regardless of direction',
          result: 'd = 200\\text{ m} + 200\\text{ m} = 400\\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Calculate displacement',
          explanation: 'Displacement is the change in position: final position minus initial position',
          result: '\\Delta x = x_f - x_i = 0\\text{ m} - 0\\text{ m} = 0\\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) 400 m, (b) 0 m' },
      conceptualAnswer: 'The student ends up where they started, so displacement is zero despite walking 400 meters total.',
    },

    hints: [
      { level: 1, hint: 'Think about the difference between "how far did you walk" and "where did you end up".' },
      { level: 2, hint: 'Distance adds up all motion. Displacement only cares about start and end points.' },
      { level: 3, hint: 'Since the student returns home, the final position equals the initial position.' },
    ],

    problemSpecificErrors: [
      {
        error: 'Saying displacement is 400 m',
        howToDetect: 'Student adds the two distances',
        feedback: 'That\'s the total distance. Where did the student end up relative to where they started?',
      },
    ],

    tags: ['conceptual', 'displacement-vs-distance'],
  },

  // ============================================================================
  // ACCELERATION
  // ============================================================================
  {
    id: 'acceleration-1',
    source: 'curated',
    concepts: ['acceleration', 'velocity'],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,

    title: 'Car Acceleration',
    statement: 'A car accelerates from rest to 25 m/s in 10 seconds. What is its average acceleration?',

    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity (rest)' },
      { symbol: 'v', value: 25, unit: 'm/s', description: 'Final velocity' },
      { symbol: 't', value: 10, unit: 's', description: 'Time' },
    ],
    unknowns: [
      { symbol: 'a', description: 'Average acceleration', unit: 'm/s²' },
    ],

    solution: {
      approach: 'Use the definition of acceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Write the acceleration formula',
          equation: 'a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}',
        },
        {
          stepNumber: 2,
          description: 'Substitute values',
          substitution: 'a = \\frac{25\\text{ m/s} - 0\\text{ m/s}}{10\\text{ s}}',
        },
        {
          stepNumber: 3,
          description: 'Calculate',
          result: 'a = 2.5\\text{ m/s}^2',
        },
      ],
      finalAnswer: { value: 2.5, unit: 'm/s²' },
    },

    hints: [
      { level: 1, hint: 'Acceleration is the rate of change of velocity.' },
      { level: 2, hint: 'Use a = Δv/Δt' },
      { level: 3, hint: 'a = (25 - 0)/10' },
    ],

    tags: ['basic', 'acceleration'],
  },

  {
    id: 'deceleration-1',
    source: 'curated',
    concepts: ['acceleration', 'velocity'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 4,

    title: 'Braking Car',
    statement: 'A car traveling at 30 m/s applies brakes and comes to a stop in 6 seconds. (a) What is the acceleration? (b) How far does the car travel while braking?',

    givenValues: [
      { symbol: 'v_0', value: 30, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'v', value: 0, unit: 'm/s', description: 'Final velocity (stopped)' },
      { symbol: 't', value: 6, unit: 's', description: 'Time' },
    ],
    unknowns: [
      { symbol: 'a', description: 'Acceleration', unit: 'm/s²' },
      { symbol: '\\Delta x', description: 'Displacement (braking distance)', unit: 'm' },
    ],

    solution: {
      approach: 'First find acceleration from velocity change, then use kinematics to find distance.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find acceleration',
          equation: 'a = \\frac{v - v_0}{t}',
          substitution: 'a = \\frac{0 - 30}{6} = -5\\text{ m/s}^2',
        },
        {
          stepNumber: 2,
          description: 'Choose equation for displacement',
          explanation: 'We know v₀, v, a, and t. Can use any of several equations.',
          equation: '\\Delta x = v_0 t + \\frac{1}{2}at^2',
        },
        {
          stepNumber: 3,
          description: 'Substitute and solve',
          substitution: '\\Delta x = (30)(6) + \\frac{1}{2}(-5)(6)^2',
          result: '\\Delta x = 180 - 90 = 90\\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) -5 m/s², (b) 90 m' },
      alternativeApproaches: [
        {
          name: 'Using average velocity',
          description: 'Use v_avg = (v₀ + v)/2, then Δx = v_avg × t',
          steps: [
            { stepNumber: 1, description: 'Find average velocity', result: 'v_{avg} = (30 + 0)/2 = 15\\text{ m/s}' },
            { stepNumber: 2, description: 'Find displacement', result: '\\Delta x = 15 \\times 6 = 90\\text{ m}' },
          ],
        },
      ],
    },

    hints: [
      { level: 1, hint: 'Part (a): How does velocity change over time?' },
      { level: 2, hint: 'The acceleration is negative because the car is slowing down.' },
      { level: 3, hint: 'For part (b), use Δx = v₀t + ½at² or use average velocity.' },
    ],

    problemSpecificErrors: [
      {
        error: 'Getting positive acceleration',
        howToDetect: 'Student says a = 5 m/s²',
        feedback: 'The car is slowing down, so velocity is decreasing. What sign should the acceleration have?',
      },
    ],

    tags: ['kinematics', 'braking', 'negative-acceleration'],
  },

  // ============================================================================
  // FREE FALL
  // ============================================================================
  {
    id: 'free-fall-1',
    source: 'curated',
    concepts: ['free-fall'],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,

    title: 'Dropped Ball',
    statement: 'A ball is dropped from a height of 45 meters. How long does it take to hit the ground? (Use g = 10 m/s²)',

    givenValues: [
      { symbol: 'h', value: 45, unit: 'm', description: 'Height' },
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity (dropped)' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 't', description: 'Time to fall', unit: 's' },
    ],

    diagram: {
      type: 'free-fall',
      params: { height: 45, v0: 0, showVelocityVectors: true },
    },

    solution: {
      approach: 'Use kinematic equation with initial velocity zero.',
      steps: [
        {
          stepNumber: 1,
          description: 'Set up coordinate system',
          explanation: 'Take downward as positive, so a = +g',
        },
        {
          stepNumber: 2,
          description: 'Write the equation',
          equation: '\\Delta y = v_0 t + \\frac{1}{2}gt^2',
        },
        {
          stepNumber: 3,
          description: 'Simplify for dropped object (v₀ = 0)',
          equation: 'h = \\frac{1}{2}gt^2',
        },
        {
          stepNumber: 4,
          description: 'Solve for t',
          equation: 't = \\sqrt{\\frac{2h}{g}}',
          substitution: 't = \\sqrt{\\frac{2(45)}{10}} = \\sqrt{9} = 3\\text{ s}',
        },
      ],
      finalAnswer: { value: 3, unit: 's' },
    },

    hints: [
      { level: 1, hint: 'For a dropped object, the initial velocity is zero.' },
      { level: 2, hint: 'Use h = ½gt² since v₀ = 0' },
      { level: 3, hint: 'Solve for t: t = √(2h/g)' },
    ],

    tags: ['free-fall', 'dropped'],
  },

  {
    id: 'free-fall-2',
    source: 'curated',
    concepts: ['free-fall'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 4,

    title: 'Ball Thrown Upward',
    statement: 'A ball is thrown straight up with an initial velocity of 20 m/s. (a) What maximum height does it reach? (b) How long until it returns to the starting point? (Use g = 10 m/s²)',

    givenValues: [
      { symbol: 'v_0', value: 20, unit: 'm/s', description: 'Initial velocity (upward)' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'h_{max}', description: 'Maximum height', unit: 'm' },
      { symbol: 't_{total}', description: 'Total time of flight', unit: 's' },
    ],

    solution: {
      approach: 'At maximum height, velocity is zero. Use this and symmetry of motion.',
      steps: [
        {
          stepNumber: 1,
          description: 'At maximum height, v = 0. Use v² = v₀² - 2gh',
          equation: '0 = v_0^2 - 2gh_{max}',
        },
        {
          stepNumber: 2,
          description: 'Solve for maximum height',
          equation: 'h_{max} = \\frac{v_0^2}{2g}',
          substitution: 'h_{max} = \\frac{20^2}{2(10)} = \\frac{400}{20} = 20\\text{ m}',
        },
        {
          stepNumber: 3,
          description: 'Find time to reach maximum height using v = v₀ - gt',
          substitution: '0 = 20 - 10t_{up}',
          result: 't_{up} = 2\\text{ s}',
        },
        {
          stepNumber: 4,
          description: 'By symmetry, time down equals time up',
          result: 't_{total} = 2t_{up} = 4\\text{ s}',
        },
      ],
      finalAnswer: { text: '(a) 20 m, (b) 4 s' },
    },

    hints: [
      { level: 1, hint: 'What is the velocity at the maximum height?' },
      { level: 2, hint: 'At the top, v = 0. Use v² = v₀² - 2gh.' },
      { level: 3, hint: 'The motion is symmetric - time up equals time down.' },
    ],

    problemSpecificErrors: [
      {
        error: 'Saying acceleration is zero at the top',
        howToDetect: 'Student sets a = 0 at maximum height',
        feedback: 'At the top, velocity is zero, but what about acceleration? Is gravity still acting?',
      },
    ],

    tags: ['free-fall', 'thrown-up', 'symmetry'],
  },

  // ============================================================================
  // PROJECTILE MOTION
  // ============================================================================
  {
    id: 'projectile-1',
    source: 'curated',
    concepts: ['projectile-motion'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Horizontal Projectile',
    statement: 'A ball is thrown horizontally from a cliff 80 m high with a speed of 15 m/s. (a) How long is it in the air? (b) How far from the base of the cliff does it land? (Use g = 10 m/s²)',

    givenValues: [
      { symbol: 'h', value: 80, unit: 'm', description: 'Cliff height' },
      { symbol: 'v_{0x}', value: 15, unit: 'm/s', description: 'Horizontal velocity' },
      { symbol: 'v_{0y}', value: 0, unit: 'm/s', description: 'Initial vertical velocity' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 't', description: 'Time in air', unit: 's' },
      { symbol: 'x', description: 'Horizontal distance', unit: 'm' },
    ],

    diagram: {
      type: 'projectile',
      params: { v0: 15, angle: 0, height: 80, showComponents: true },
    },

    solution: {
      approach: 'Analyze vertical and horizontal motion independently.',
      steps: [
        {
          stepNumber: 1,
          description: 'Vertical motion determines time (v₀y = 0)',
          equation: 'h = \\frac{1}{2}gt^2',
          explanation: 'Horizontal velocity doesn\'t affect falling time',
        },
        {
          stepNumber: 2,
          description: 'Solve for time',
          substitution: '80 = \\frac{1}{2}(10)t^2',
          result: 't = \\sqrt{16} = 4\\text{ s}',
        },
        {
          stepNumber: 3,
          description: 'Horizontal motion: constant velocity',
          equation: 'x = v_{0x} \\times t',
        },
        {
          stepNumber: 4,
          description: 'Calculate horizontal distance',
          substitution: 'x = 15 \\times 4 = 60\\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) 4 s, (b) 60 m' },
    },

    hints: [
      { level: 1, hint: 'Horizontal and vertical motion are independent.' },
      { level: 2, hint: 'The vertical motion is just free fall from rest.' },
      { level: 3, hint: 'First find time from vertical motion, then use it for horizontal distance.' },
    ],

    problemSpecificErrors: [
      {
        error: 'Thinking horizontal velocity affects falling time',
        howToDetect: 'Student tries to use 15 m/s in the vertical calculation',
        feedback: 'The horizontal velocity doesn\'t affect vertical motion. What determines how long it takes to fall?',
      },
    ],

    tags: ['projectile', 'horizontal-launch'],
  },

  {
    id: 'projectile-2',
    source: 'curated',
    concepts: ['projectile-motion'],
    difficulty: 4,
    type: 'calculation',
    estimatedMinutes: 7,

    title: 'Angled Projectile',
    statement: 'A soccer ball is kicked at 20 m/s at an angle of 30° above the horizontal. (a) Find the horizontal and vertical components of initial velocity. (b) What is the maximum height? (c) How far does it travel horizontally? (Use g = 10 m/s²)',

    givenValues: [
      { symbol: 'v_0', value: 20, unit: 'm/s', description: 'Initial speed' },
      { symbol: '\\theta', value: 30, unit: '°', description: 'Launch angle' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'v_{0x}', description: 'Initial horizontal velocity', unit: 'm/s' },
      { symbol: 'v_{0y}', description: 'Initial vertical velocity', unit: 'm/s' },
      { symbol: 'h_{max}', description: 'Maximum height', unit: 'm' },
      { symbol: 'R', description: 'Range', unit: 'm' },
    ],

    diagram: {
      type: 'projectile',
      params: { v0: 20, angle: 30, showComponents: true, showVelocityAtPoints: true },
    },

    solution: {
      approach: 'Decompose velocity, then analyze vertical and horizontal motion separately.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find velocity components',
          equation: 'v_{0x} = v_0 \\cos\\theta = 20 \\cos 30° = 20(0.866) = 17.3\\text{ m/s}',
        },
        {
          stepNumber: 2,
          description: 'Vertical component',
          equation: 'v_{0y} = v_0 \\sin\\theta = 20 \\sin 30° = 20(0.5) = 10\\text{ m/s}',
        },
        {
          stepNumber: 3,
          description: 'Maximum height (v_y = 0 at top)',
          equation: 'h_{max} = \\frac{v_{0y}^2}{2g} = \\frac{10^2}{2(10)} = 5\\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Time to maximum height',
          equation: 't_{up} = \\frac{v_{0y}}{g} = \\frac{10}{10} = 1\\text{ s}',
        },
        {
          stepNumber: 5,
          description: 'Total time of flight (by symmetry)',
          result: 't_{total} = 2t_{up} = 2\\text{ s}',
        },
        {
          stepNumber: 6,
          description: 'Horizontal range',
          equation: 'R = v_{0x} \\times t_{total} = 17.3 \\times 2 = 34.6\\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) v₀ₓ = 17.3 m/s, v₀ᵧ = 10 m/s; (b) 5 m; (c) 34.6 m' },
    },

    hints: [
      { level: 1, hint: 'Start by finding the horizontal and vertical components of velocity.' },
      { level: 2, hint: 'v₀ₓ = v₀cos(θ) and v₀ᵧ = v₀sin(θ)' },
      { level: 3, hint: 'At max height, vertical velocity is zero. Use v² = v₀² - 2gh.' },
    ],

    tags: ['projectile', 'angled-launch', 'components'],
  },

  // ============================================================================
  // GRAPH INTERPRETATION
  // ============================================================================
  {
    id: 'graph-interpretation-1',
    source: 'curated',
    concepts: ['velocity', 'displacement'],
    difficulty: 3,
    type: 'graphical',
    estimatedMinutes: 5,

    title: 'Reading a Velocity-Time Graph',
    statement: 'A velocity-time graph shows a car starting at v = 10 m/s at t = 0, increasing linearly to v = 30 m/s at t = 4 s, then staying constant at 30 m/s until t = 8 s. (a) What is the acceleration during the first 4 seconds? (b) What is the total displacement from t = 0 to t = 8 s?',

    solution: {
      approach: 'Use the slope for acceleration and area under curve for displacement.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find acceleration (slope of v-t graph)',
          equation: 'a = \\frac{\\Delta v}{\\Delta t} = \\frac{30 - 10}{4 - 0} = 5\\text{ m/s}^2',
        },
        {
          stepNumber: 2,
          description: 'Displacement 0-4s (area of trapezoid)',
          equation: '\\Delta x_1 = \\frac{1}{2}(v_0 + v_f)t = \\frac{1}{2}(10 + 30)(4) = 80\\text{ m}',
        },
        {
          stepNumber: 3,
          description: 'Displacement 4-8s (area of rectangle)',
          equation: '\\Delta x_2 = v \\times t = 30 \\times 4 = 120\\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Total displacement',
          result: '\\Delta x_{total} = 80 + 120 = 200\\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) 5 m/s², (b) 200 m' },
    },

    hints: [
      { level: 1, hint: 'On a v-t graph, what does the slope represent? What does the area represent?' },
      { level: 2, hint: 'Slope = acceleration, Area under curve = displacement' },
      { level: 3, hint: 'Break the area into simpler shapes (triangle, rectangle, or trapezoid).' },
    ],

    tags: ['graphs', 'v-t-graph', 'area', 'slope'],
  },

  // ============================================================================
  // MULTI-STEP / AP-STYLE
  // ============================================================================
  {
    id: 'ap-style-1',
    source: 'curated',
    concepts: ['acceleration', 'free-fall', 'velocity'],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 8,

    title: 'Rocket Launch',
    statement: 'A model rocket accelerates upward at 15 m/s² for 2 seconds, after which the engine cuts off. (a) How high is the rocket when the engine cuts off? (b) What is its velocity at that moment? (c) How much higher does it rise after engine cutoff? (d) What is its maximum height? (Use g = 10 m/s²)',

    givenValues: [
      { symbol: 'a', value: 15, unit: 'm/s²', description: 'Acceleration during burn' },
      { symbol: 't_{burn}', value: 2, unit: 's', description: 'Burn time' },
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity (rest)' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],

    solution: {
      approach: 'Solve in two phases: powered flight, then free-fall upward.',
      steps: [
        {
          stepNumber: 1,
          description: 'Phase 1 - Height at engine cutoff',
          equation: 'h_1 = \\frac{1}{2}at^2 = \\frac{1}{2}(15)(2)^2 = 30\\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Phase 1 - Velocity at engine cutoff',
          equation: 'v_1 = at = 15 \\times 2 = 30\\text{ m/s}',
        },
        {
          stepNumber: 3,
          description: 'Phase 2 - Additional height after cutoff',
          explanation: 'Now it\'s in free-fall (a = -g), starting at v₁ = 30 m/s',
          equation: 'h_2 = \\frac{v_1^2}{2g} = \\frac{30^2}{2(10)} = 45\\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Maximum height',
          result: 'h_{max} = h_1 + h_2 = 30 + 45 = 75\\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) 30 m, (b) 30 m/s, (c) 45 m, (d) 75 m' },
    },

    hints: [
      { level: 1, hint: 'Break this into two phases: powered flight and free-fall.' },
      { level: 2, hint: 'After engine cutoff, the rocket is in free-fall with initial velocity equal to the velocity at cutoff.' },
      { level: 3, hint: 'At maximum height, velocity is zero. Use v² = v₁² - 2gh₂.' },
    ],

    tags: ['multi-step', 'rocket', 'two-phase'],
  },

  {
    id: 'ap-style-2',
    source: 'curated',
    concepts: ['projectile-motion', 'velocity'],
    difficulty: 5,
    type: 'multi-step',
    estimatedMinutes: 10,

    title: 'Cliff Dive',
    statement: 'A diver runs off a 10-meter high cliff with a horizontal velocity of 3 m/s. (a) How long is the diver in the air? (b) How far from the base of the cliff does the diver land? (c) What is the diver\'s velocity (magnitude and direction) just before hitting the water? (Use g = 10 m/s²)',

    givenValues: [
      { symbol: 'h', value: 10, unit: 'm', description: 'Cliff height' },
      { symbol: 'v_{0x}', value: 3, unit: 'm/s', description: 'Horizontal velocity' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],

    diagram: {
      type: 'projectile',
      params: { v0: 3, angle: 0, height: 10, showComponents: true, showVelocityAtPoints: true },
    },

    solution: {
      approach: 'Analyze horizontal and vertical motion separately, combine for final velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Time in air (from vertical motion)',
          equation: 'h = \\frac{1}{2}gt^2 \\Rightarrow t = \\sqrt{\\frac{2h}{g}}',
          substitution: 't = \\sqrt{\\frac{2(10)}{10}} = \\sqrt{2} \\approx 1.41\\text{ s}',
        },
        {
          stepNumber: 2,
          description: 'Horizontal distance',
          equation: 'x = v_{0x} \\times t = 3 \\times 1.41 = 4.24\\text{ m}',
        },
        {
          stepNumber: 3,
          description: 'Final vertical velocity',
          equation: 'v_y = gt = 10 \\times 1.41 = 14.1\\text{ m/s (downward)}',
        },
        {
          stepNumber: 4,
          description: 'Final speed (magnitude)',
          equation: 'v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{3^2 + 14.1^2} = \\sqrt{9 + 199} = 14.4\\text{ m/s}',
        },
        {
          stepNumber: 5,
          description: 'Direction (angle below horizontal)',
          equation: '\\theta = \\tan^{-1}\\left(\\frac{v_y}{v_x}\\right) = \\tan^{-1}\\left(\\frac{14.1}{3}\\right) = 78°\\text{ below horizontal}',
        },
      ],
      finalAnswer: { text: '(a) 1.41 s, (b) 4.24 m, (c) 14.4 m/s at 78° below horizontal' },
    },

    hints: [
      { level: 1, hint: 'Start with vertical motion to find time.' },
      { level: 2, hint: 'Horizontal velocity stays constant. Vertical velocity increases due to gravity.' },
      { level: 3, hint: 'Use Pythagorean theorem for final speed, arctan for direction.' },
    ],

    tags: ['projectile', 'horizontal-launch', 'velocity-vector'],
  },

  // ============================================================================
  // PROBLEMS FROM OPENSTAX UNIVERSITY PHYSICS VOL. 1
  // ============================================================================
  {
    id: 'openstax-position-function-1',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['position', 'displacement', 'velocity'],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,

    title: 'Position Function Analysis',
    statement: 'The position of a particle moving along the x-axis is given by x(t) = 50t − 2t², where x is in meters and t is in seconds. (a) What is the position at t = 0 and t = 5 s? (b) What is the displacement between t = 0 and t = 5 s? (c) What is the average velocity?',

    givenValues: [
      { symbol: 't_1', value: 0, unit: 's', description: 'Initial time' },
      { symbol: 't_2', value: 5, unit: 's', description: 'Final time' },
    ],
    unknowns: [
      { symbol: '\\Delta x', description: 'Displacement', unit: 'm' },
      { symbol: 'v_{avg}', description: 'Average velocity', unit: 'm/s' },
    ],

    solution: {
      approach: 'Evaluate the position function at given times, then use definitions of displacement and average velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find position at t = 0',
          substitution: 'x(0) = 50(0) - 2(0)² = 0 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Find position at t = 5 s',
          substitution: 'x(5) = 50(5) - 2(5)² = 250 - 50 = 200 \\text{ m}',
        },
        {
          stepNumber: 3,
          description: 'Calculate displacement',
          equation: '\\Delta x = x(5) - x(0) = 200 - 0 = 200 \\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Calculate average velocity',
          equation: 'v_{avg} = \\frac{\\Delta x}{\\Delta t} = \\frac{200 \\text{ m}}{5 \\text{ s}} = 40 \\text{ m/s}',
        },
      ],
      finalAnswer: { text: '(a) x(0) = 0 m, x(5) = 200 m; (b) Δx = 200 m; (c) v_avg = 40 m/s' },
    },

    hints: [
      { level: 1, hint: 'Plug t = 0 and t = 5 directly into the position function.' },
      { level: 2, hint: 'Displacement = final position − initial position' },
      { level: 3, hint: 'Average velocity = displacement ÷ time interval' },
    ],

    tags: ['position-function', 'average-velocity', 'openstax'],
  },

  {
    id: 'openstax-instantaneous-velocity-1',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['velocity', 'acceleration'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Instantaneous Velocity and Acceleration',
    statement: 'The position of a dragster is given by x(t) = 5t², where x is in meters and t is in seconds. (a) Find the instantaneous velocity at t = 3 s. (b) Find the instantaneous acceleration at t = 3 s.',

    givenValues: [
      { symbol: 't', value: 3, unit: 's', description: 'Time of interest' },
    ],
    unknowns: [
      { symbol: 'v(3)', description: 'Instantaneous velocity at t = 3 s', unit: 'm/s' },
      { symbol: 'a(3)', description: 'Instantaneous acceleration at t = 3 s', unit: 'm/s²' },
    ],

    solution: {
      approach: 'Use calculus: velocity is the derivative of position, acceleration is the derivative of velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find velocity function by differentiating position',
          equation: 'v(t) = \\frac{dx}{dt} = \\frac{d}{dt}(5t^2) = 10t',
        },
        {
          stepNumber: 2,
          description: 'Evaluate velocity at t = 3 s',
          result: 'v(3) = 10(3) = 30 \\text{ m/s}',
        },
        {
          stepNumber: 3,
          description: 'Find acceleration function by differentiating velocity',
          equation: 'a(t) = \\frac{dv}{dt} = \\frac{d}{dt}(10t) = 10 \\text{ m/s}^2',
        },
        {
          stepNumber: 4,
          description: 'Evaluate acceleration at t = 3 s',
          result: 'a(3) = 10 \\text{ m/s}^2 \\text{ (constant)}',
        },
      ],
      finalAnswer: { text: '(a) v(3) = 30 m/s; (b) a(3) = 10 m/s²' },
    },

    hints: [
      { level: 1, hint: 'Velocity is the derivative of position with respect to time.' },
      { level: 2, hint: 'Use the power rule: d/dt(tⁿ) = n·tⁿ⁻¹' },
      { level: 3, hint: 'Acceleration is the derivative of velocity with respect to time.' },
    ],

    tags: ['calculus', 'derivatives', 'instantaneous', 'openstax'],
  },

  {
    id: 'openstax-two-trains',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['velocity', 'displacement'],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 8,

    title: 'Two Trains Meeting',
    statement: 'Two trains are 300 km apart on the same track, heading toward each other. Train A travels at 80 km/h and Train B travels at 70 km/h. (a) How long until they meet? (b) How far does each train travel before meeting?',

    givenValues: [
      { symbol: 'd_0', value: 300, unit: 'km', description: 'Initial separation' },
      { symbol: 'v_A', value: 80, unit: 'km/h', description: 'Speed of Train A' },
      { symbol: 'v_B', value: 70, unit: 'km/h', description: 'Speed of Train B' },
    ],
    unknowns: [
      { symbol: 't', description: 'Time until meeting', unit: 'h' },
      { symbol: 'd_A', description: 'Distance traveled by Train A', unit: 'km' },
      { symbol: 'd_B', description: 'Distance traveled by Train B', unit: 'km' },
    ],

    solution: {
      approach: 'Set up position equations for each train and find when they meet (same position).',
      steps: [
        {
          stepNumber: 1,
          description: 'The trains approach each other, so their relative velocity adds up',
          equation: 'v_{rel} = v_A + v_B = 80 + 70 = 150 \\text{ km/h}',
        },
        {
          stepNumber: 2,
          description: 'Time to close the gap',
          equation: 't = \\frac{d_0}{v_{rel}} = \\frac{300}{150} = 2 \\text{ hours}',
        },
        {
          stepNumber: 3,
          description: 'Distance traveled by Train A',
          equation: 'd_A = v_A \\times t = 80 \\times 2 = 160 \\text{ km}',
        },
        {
          stepNumber: 4,
          description: 'Distance traveled by Train B',
          equation: 'd_B = v_B \\times t = 70 \\times 2 = 140 \\text{ km}',
        },
        {
          stepNumber: 5,
          description: 'Verify: distances sum to initial separation',
          result: '160 + 140 = 300 \\text{ km } \\checkmark',
        },
      ],
      finalAnswer: { text: '(a) 2 hours; (b) Train A: 160 km, Train B: 140 km' },
    },

    hints: [
      { level: 1, hint: 'When two objects move toward each other, how do their velocities combine?' },
      { level: 2, hint: 'The relative velocity is the sum of their speeds.' },
      { level: 3, hint: 'Time = distance ÷ relative velocity' },
    ],

    problemSpecificErrors: [
      {
        error: 'Subtracting velocities instead of adding',
        howToDetect: 'Student gets 10 km/h relative velocity',
        feedback: 'When objects move toward each other, the gap closes faster. Should the relative velocity be larger or smaller than either individual velocity?',
      },
    ],

    tags: ['relative-motion', 'meeting-problems', 'openstax'],
  },

  {
    id: 'openstax-stopping-car',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['acceleration', 'velocity', 'displacement'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Emergency Braking',
    statement: 'A car traveling at 25 m/s begins to decelerate at 5 m/s² when the driver sees an obstacle. (a) How long does it take to stop? (b) How far does it travel while stopping?',

    givenValues: [
      { symbol: 'v_0', value: 25, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'v', value: 0, unit: 'm/s', description: 'Final velocity' },
      { symbol: 'a', value: -5, unit: 'm/s²', description: 'Deceleration' },
    ],
    unknowns: [
      { symbol: 't', description: 'Stopping time', unit: 's' },
      { symbol: '\\Delta x', description: 'Stopping distance', unit: 'm' },
    ],

    solution: {
      approach: 'Use kinematic equations for constant acceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Find stopping time using v = v₀ + at',
          equation: '0 = 25 + (-5)t',
          result: 't = 5 \\text{ s}',
        },
        {
          stepNumber: 2,
          description: 'Find stopping distance using v² = v₀² + 2aΔx',
          equation: '0 = (25)^2 + 2(-5)\\Delta x',
        },
        {
          stepNumber: 3,
          description: 'Solve for displacement',
          result: '\\Delta x = \\frac{625}{10} = 62.5 \\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) 5 s; (b) 62.5 m' },
      alternativeApproaches: [
        {
          name: 'Using average velocity',
          description: 'Since acceleration is constant, v_avg = (v₀ + v)/2',
          steps: [
            { stepNumber: 1, description: 'Calculate average velocity', result: 'v_{avg} = (25 + 0)/2 = 12.5 \\text{ m/s}' },
            { stepNumber: 2, description: 'Use average velocity to find displacement', result: '\\Delta x = v_{avg} \\times t = 12.5 \\times 5 = 62.5 \\text{ m}' },
          ],
        },
      ],
    },

    hints: [
      { level: 1, hint: 'For stopping time, what equation relates v, v₀, a, and t?' },
      { level: 2, hint: 'For stopping distance, what equation relates v, v₀, a, and Δx?' },
      { level: 3, hint: 'Remember that deceleration means negative acceleration.' },
    ],

    tags: ['braking', 'stopping-distance', 'safety', 'openstax'],
  },

  {
    id: 'openstax-baseball-up',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['free-fall', 'velocity'],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Baseball Thrown Vertically',
    statement: 'A baseball is thrown straight up with an initial velocity of 30 m/s. (a) What is the maximum height reached? (b) How long is it in the air before returning to the thrower? (c) What is its velocity at h = 25 m on the way up? Use g = 10 m/s².',

    givenValues: [
      { symbol: 'v_0', value: 30, unit: 'm/s', description: 'Initial velocity (upward)' },
      { symbol: 'g', value: 10, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'h_{max}', description: 'Maximum height', unit: 'm' },
      { symbol: 't_{total}', description: 'Total time in air', unit: 's' },
      { symbol: 'v_{25m}', description: 'Velocity at h = 25 m', unit: 'm/s' },
    ],

    solution: {
      approach: 'Use kinematic equations with a = -g (taking up as positive).',
      steps: [
        {
          stepNumber: 1,
          description: 'At maximum height, v = 0. Use v² = v₀² - 2gh',
          equation: '0 = (30)^2 - 2(10)h_{max}',
          result: 'h_{max} = \\frac{900}{20} = 45 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Find time to maximum height using v = v₀ - gt',
          equation: '0 = 30 - 10t_{up}',
          result: 't_{up} = 3 \\text{ s}',
        },
        {
          stepNumber: 3,
          description: 'Total time is twice the time up (by symmetry)',
          result: 't_{total} = 2 \\times 3 = 6 \\text{ s}',
        },
        {
          stepNumber: 4,
          description: 'Find velocity at h = 25 m using v² = v₀² - 2gh',
          equation: 'v^2 = (30)^2 - 2(10)(25) = 900 - 500 = 400',
          result: 'v = \\sqrt{400} = 20 \\text{ m/s (upward)}',
        },
      ],
      finalAnswer: { text: '(a) 45 m; (b) 6 s; (c) 20 m/s (upward)' },
    },

    hints: [
      { level: 1, hint: 'At maximum height, the ball momentarily stops. What is v?' },
      { level: 2, hint: 'Use the time-independent equation v² = v₀² - 2gh for parts (a) and (c).' },
      { level: 3, hint: 'The motion is symmetric: time up equals time down.' },
    ],

    problemSpecificErrors: [
      {
        error: 'Getting negative velocity for part (c)',
        howToDetect: 'Student reports v = -20 m/s for the way up',
        feedback: 'On the way up, velocity should be positive (upward). The negative solution applies to the way down.',
      },
    ],

    tags: ['free-fall', 'vertical-throw', 'symmetry', 'openstax'],
  },

  {
    id: 'openstax-bullet-deceleration',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['acceleration', 'velocity', 'displacement'],
    difficulty: 4,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Bullet Penetration',
    statement: 'A bullet traveling at 400 m/s penetrates a wooden block and comes to rest after traveling 10 cm into the wood. What is the average deceleration of the bullet?',

    givenValues: [
      { symbol: 'v_0', value: 400, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'v', value: 0, unit: 'm/s', description: 'Final velocity' },
      { symbol: '\\Delta x', value: 0.10, unit: 'm', description: 'Penetration depth' },
    ],
    unknowns: [
      { symbol: 'a', description: 'Deceleration', unit: 'm/s²' },
    ],

    solution: {
      approach: 'Use the kinematic equation that relates velocity and displacement.',
      steps: [
        {
          stepNumber: 1,
          description: 'Convert 10 cm to meters',
          result: '\\Delta x = 10 \\text{ cm} = 0.10 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Use v² = v₀² + 2aΔx',
          equation: '0 = (400)^2 + 2a(0.10)',
        },
        {
          stepNumber: 3,
          description: 'Solve for acceleration',
          equation: 'a = -\\frac{(400)^2}{2(0.10)} = -\\frac{160{,}000}{0.20} = -800{,}000 \\text{ m/s}^2',
        },
        {
          stepNumber: 4,
          description: 'Express in scientific notation',
          result: 'a = -8 \\times 10^5 \\text{ m/s}^2',
        },
      ],
      finalAnswer: { value: -800000, unit: 'm/s²' },
      conceptualAnswer: 'The magnitude is about 80,000 times g! This enormous deceleration explains why bullets cause such damage - the rapid change in momentum.',
    },

    hints: [
      { level: 1, hint: 'Which kinematic equation has v, v₀, a, and Δx but not t?' },
      { level: 2, hint: 'Don\'t forget to convert centimeters to meters.' },
      { level: 3, hint: 'The acceleration should be negative (slowing down).' },
    ],

    tags: ['high-acceleration', 'unit-conversion', 'openstax'],
  },

  {
    id: 'openstax-dropped-vs-thrown',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['free-fall'],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 4,

    title: 'Dropped vs Thrown Down',
    statement: 'A ball is dropped from rest from a tower. At the same instant, another ball is thrown straight down with initial velocity 10 m/s from the same height. (a) Which ball has greater acceleration during the fall? (b) Which ball has greater velocity after falling 20 m? Use g = 10 m/s².',

    solution: {
      approach: 'Remember that all objects in free fall have the same acceleration regardless of initial velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Part (a): Both balls experience only gravity',
          explanation: 'Acceleration is determined by forces, not velocity. Both have a = g downward.',
          result: 'Both have the same acceleration: g = 10 \\text{ m/s}^2 \\text{ downward}',
        },
        {
          stepNumber: 2,
          description: 'Part (b): Find velocity of dropped ball after 20 m',
          equation: 'v^2 = v_0^2 + 2gh = 0 + 2(10)(20) = 400',
          result: 'v_{dropped} = 20 \\text{ m/s}',
        },
        {
          stepNumber: 3,
          description: 'Find velocity of thrown ball after 20 m',
          equation: 'v^2 = v_0^2 + 2gh = (10)^2 + 2(10)(20) = 100 + 400 = 500',
          result: 'v_{thrown} = \\sqrt{500} \\approx 22.4 \\text{ m/s}',
        },
      ],
      finalAnswer: { text: '(a) Same acceleration (g); (b) Thrown ball is faster (22.4 m/s vs 20 m/s)' },
      conceptualAnswer: 'The thrown ball always has greater velocity because it started faster and gained the same speed (from acceleration) as the dropped ball.',
    },

    hints: [
      { level: 1, hint: 'Does initial velocity affect the force of gravity on an object?' },
      { level: 2, hint: 'For acceleration: F = ma, and F is the same for both.' },
      { level: 3, hint: 'For velocity: use v² = v₀² + 2gh with different v₀ values.' },
    ],

    tags: ['free-fall', 'conceptual', 'same-acceleration', 'openstax'],
  },

  {
    id: 'openstax-finding-g',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['free-fall'],
    difficulty: 4,
    type: 'calculation',
    estimatedMinutes: 5,

    title: 'Measuring Gravitational Acceleration',
    statement: 'An astronaut drops a rock on an alien planet. The rock falls 1.5 m in the first second. What is the gravitational acceleration on this planet?',

    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity (dropped)' },
      { symbol: '\\Delta y', value: 1.5, unit: 'm', description: 'Displacement in first second' },
      { symbol: 't', value: 1, unit: 's', description: 'Time' },
    ],
    unknowns: [
      { symbol: 'g', description: 'Gravitational acceleration', unit: 'm/s²' },
    ],

    solution: {
      approach: 'Use the kinematic equation for position with zero initial velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'For a dropped object, use h = ½gt²',
          equation: '\\Delta y = v_0 t + \\frac{1}{2}gt^2 = \\frac{1}{2}gt^2 \\text{ (since } v_0 = 0)',
        },
        {
          stepNumber: 2,
          description: 'Solve for g',
          equation: 'g = \\frac{2\\Delta y}{t^2}',
        },
        {
          stepNumber: 3,
          description: 'Substitute values',
          result: 'g = \\frac{2(1.5)}{(1)^2} = 3 \\text{ m/s}^2',
        },
      ],
      finalAnswer: { value: 3, unit: 'm/s²' },
      conceptualAnswer: 'This is about 1/3 of Earth\'s gravity. The planet is probably smaller or less dense than Earth, like Mars (g ≈ 3.7 m/s²).',
    },

    hints: [
      { level: 1, hint: 'For a dropped object, what is the initial velocity?' },
      { level: 2, hint: 'Use Δy = ½gt² and solve for g.' },
      { level: 3, hint: 'Compare to Earth\'s g = 9.8 m/s² to check if answer is reasonable.' },
    ],

    tags: ['free-fall', 'experimental', 'other-planets', 'openstax'],
  },

  {
    id: 'openstax-area-under-curve',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3',
    concepts: ['velocity', 'displacement', 'acceleration'],
    difficulty: 3,
    type: 'graphical',
    estimatedMinutes: 6,

    title: 'Displacement from a Complex v-t Graph',
    statement: 'A car\'s velocity-time graph shows: (1) velocity increasing from 0 to 15 m/s during 0-5 s, (2) constant velocity of 15 m/s during 5-15 s, (3) velocity decreasing from 15 m/s to 0 during 15-20 s. Find the total displacement.',

    solution: {
      approach: 'Calculate the area under each section of the v-t graph.',
      steps: [
        {
          stepNumber: 1,
          description: 'Section 1 (0-5 s): Triangle',
          equation: 'A_1 = \\frac{1}{2}(5)(15) = 37.5 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Section 2 (5-15 s): Rectangle',
          equation: 'A_2 = (10)(15) = 150 \\text{ m}',
        },
        {
          stepNumber: 3,
          description: 'Section 3 (15-20 s): Triangle',
          equation: 'A_3 = \\frac{1}{2}(5)(15) = 37.5 \\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Total displacement is the sum of all areas',
          result: '\\Delta x_{total} = 37.5 + 150 + 37.5 = 225 \\text{ m}',
        },
      ],
      finalAnswer: { value: 225, unit: 'm' },
    },

    hints: [
      { level: 1, hint: 'Displacement is the area under the v-t curve.' },
      { level: 2, hint: 'Break the graph into simpler shapes: triangles and rectangles.' },
      { level: 3, hint: 'Area of triangle = ½ × base × height; Area of rectangle = base × height' },
    ],

    tags: ['graphs', 'area-under-curve', 'v-t-graph', 'openstax'],
  },

  // ============================================================================
  // OPENSTAX EXTRACTED PROBLEMS (Added 2026-01-31)
  // ============================================================================
  {
    id: 'openstax-ch3-p24',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 24',
    concepts: ["position"],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 2,
    title: 'Particle positions on vertical coordinate system',
    statement: 'Consider a coordinate system in which the positive x axis is directed upward vertically. What are the positions of a particle (a) 5.0 m directly above the origin and (b) 2.0 m below the origin?',
    givenValues: [
      { symbol: 'd_1', value: 5, unit: 'm', description: 'Distance above origin' },
      { symbol: 'd_2', value: 2, unit: 'm', description: 'Distance below origin' },
    ],
    unknowns: [
      { symbol: 'x_a', description: 'Position of particle (a)', unit: 'm' },
      { symbol: 'x_b', description: 'Position of particle (b)', unit: 'm' },
    ],
    solution: {
      approach: 'Determine positions based on coordinate system definition',
      steps: [
        {
          stepNumber: 1,
          description: 'Identify coordinate system',
          explanation: 'Positive x-axis points upward vertically',
          result: 'Positive direction is upward',
        },
        {
          stepNumber: 2,
          description: 'Find position (a)',
          explanation: '5.0 m above origin means positive position',
          result: 'x_a = +5.0 \\text{ m}',
        },
        {
          stepNumber: 3,
          description: 'Find position (b)',
          explanation: '2.0 m below origin means negative position',
          result: 'x_b = -2.0 \\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) +5.0 m, (b) -2.0 m' },
    },
    hints: [
      { level: 1, hint: 'Think about what positive and negative directions mean in this coordinate system' },
      { level: 2, hint: 'If positive x is upward, what sign should positions above and below the origin have?' },
      { level: 3, hint: 'Above origin = positive position, below origin = negative position' },
    ],
    problemSpecificErrors: [
      {
        error: 'Getting the signs wrong',
        howToDetect: 'Student gives negative value for above origin or positive for below',
        feedback: 'Remember that in this coordinate system, positive x is upward. Above the origin means positive position.',
      },
    ],
    tags: ["coordinate_systems","position","sign_conventions"],
  },

  {
    id: 'openstax-ch3-p25',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 25',
    concepts: ["position","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Car position vectors and displacement',
    statement: 'A car is 2.0 km west of a traffic light at t = 0 and 5.0 km east of the light at t = 6.0 min. Assume the origin of the coordinate system is the light and the positive x direction is eastward. (a) What are the car\'s position vectors at these two times? (b) What is the car\'s displacement between 0 min and 6.0 min?',
    givenValues: [
      { symbol: 'd_{west}', value: 2, unit: 'km', description: 'Initial distance west of light' },
      { symbol: 'd_{east}', value: 5, unit: 'km', description: 'Final distance east of light' },
      { symbol: 't_1', value: 0, unit: 'min', description: 'Initial time' },
      { symbol: 't_2', value: 6, unit: 'min', description: 'Final time' },
    ],
    unknowns: [
      { symbol: 'x_1', description: 'Initial position', unit: 'km' },
      { symbol: 'x_2', description: 'Final position', unit: 'km' },
      { symbol: '\Delta x', description: 'Displacement', unit: 'km' },
    ],
    solution: {
      approach: 'Use coordinate system to find positions, then calculate displacement',
      steps: [
        {
          stepNumber: 1,
          description: 'Find initial position',
          explanation: '2.0 km west means negative position since east is positive',
          result: 'x_1 = -2.0 \\text{ km}',
        },
        {
          stepNumber: 2,
          description: 'Find final position',
          explanation: '5.0 km east means positive position',
          result: 'x_2 = +5.0 \\text{ km}',
        },
        {
          stepNumber: 3,
          description: 'Calculate displacement',
          equation: '\\Delta x = x_2 - x_1',
          substitution: '\\Delta x = 5.0 - (-2.0) = 7.0 \\text{ km}',
          result: '\\Delta x = 7.0 \\text{ km}',
        },
      ],
      finalAnswer: { text: '(a) x₁ = -2.0 km, x₂ = +5.0 km; (b) Δx = 7.0 km' },
    },
    hints: [
      { level: 1, hint: 'Set up the coordinate system with the traffic light as origin and east as positive' },
      { level: 2, hint: 'West of origin means negative position, east means positive position' },
      { level: 3, hint: 'Displacement = final position - initial position = x₂ - x₁' },
    ],
    problemSpecificErrors: [
      {
        error: 'Confusing displacement with distance traveled',
        howToDetect: 'Student gives answer > 7.0 km for displacement',
        feedback: 'Displacement is change in position (final - initial), not total distance traveled',
      },
    ],
    tags: ["displacement","coordinate_systems","position_vectors"],
  },

  {
    id: 'openstax-ch3-p26',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 26',
    concepts: ["velocity"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Shanghai maglev train average velocity',
    statement: 'The Shanghai maglev train connects Longyang Road to Pudong International Airport, a distance of 30 km. The journey takes 8 minutes on average. What is the maglev train\'s average velocity?',
    givenValues: [
      { symbol: 'd', value: 30, unit: 'km', description: 'Distance traveled' },
      { symbol: 't', value: 8, unit: 'min', description: 'Time taken' },
    ],
    unknowns: [
      { symbol: 'v_{avg}', description: 'Average velocity', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use average velocity formula and convert units',
      steps: [
        {
          stepNumber: 1,
          description: 'Convert distance to meters',
          substitution: 'd = 30 \\text{ km} = 30 \\times 1000 = 30000 \\text{ m}',
          result: 'd = 30000 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Convert time to seconds',
          substitution: 't = 8 \\text{ min} = 8 \\times 60 = 480 \\text{ s}',
          result: 't = 480 \\text{ s}',
        },
        {
          stepNumber: 3,
          description: 'Calculate average velocity',
          equation: 'v_{avg} = \\frac{\\Delta x}{\\Delta t}',
          substitution: 'v_{avg} = \\frac{30000}{480} = 62.5 \\text{ m/s}',
          result: 'v_{avg} = 62.5 \\text{ m/s}',
        },
      ],
      finalAnswer: { value: 62.5, unit: 'm/s' },
    },
    hints: [
      { level: 1, hint: 'Use the formula for average velocity: displacement divided by time' },
      { level: 2, hint: 'Convert both distance and time to SI units (meters and seconds)' },
      { level: 3, hint: '30 km = 30,000 m and 8 min = 480 s' },
    ],
    problemSpecificErrors: [
      {
        error: 'Forgetting unit conversions',
        howToDetect: 'Answer is not in m/s or has wrong magnitude',
        feedback: 'Make sure to convert km to m and minutes to seconds before calculating',
      },
    ],
    tags: ["average_velocity","unit_conversion"],
  },

  {
    id: 'openstax-ch3-p27',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 27',
    concepts: ["position","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Particle crossing origin and displacement',
    statement: 'The position of a particle moving along the x-axis is given by x(t) = 4.0 - 2.0t m. (a) At what time does the particle cross the origin? (b) What is the displacement of the particle between t = 3.0 s and t = 6.0 s?',
    givenValues: [
      { symbol: 'x(t)', value: 'variable', unit: 'm', description: 'Position function: x(t) = 4.0 - 2.0t' },
      { symbol: 't_1', value: 3, unit: 's', description: 'Initial time for displacement' },
      { symbol: 't_2', value: 6, unit: 's', description: 'Final time for displacement' },
    ],
    unknowns: [
      { symbol: 't', description: 'Time when particle crosses origin', unit: 's' },
      { symbol: '\Delta x', description: 'Displacement', unit: 'm' },
    ],
    solution: {
      approach: 'Set position to zero to find crossing time, then calculate displacement',
      steps: [
        {
          stepNumber: 1,
          description: 'Find when particle crosses origin',
          equation: 'x(t) = 0',
          substitution: '4.0 - 2.0t = 0',
          result: 't = 2.0 \\text{ s}',
        },
        {
          stepNumber: 2,
          description: 'Find position at t = 3.0 s',
          substitution: 'x(3.0) = 4.0 - 2.0(3.0) = -2.0 \\text{ m}',
          result: 'x_1 = -2.0 \\text{ m}',
        },
        {
          stepNumber: 3,
          description: 'Find position at t = 6.0 s',
          substitution: 'x(6.0) = 4.0 - 2.0(6.0) = -8.0 \\text{ m}',
          result: 'x_2 = -8.0 \\text{ m}',
        },
        {
          stepNumber: 4,
          description: 'Calculate displacement',
          equation: '\\Delta x = x_2 - x_1',
          substitution: '\\Delta x = -8.0 - (-2.0) = -6.0 \\text{ m}',
          result: '\\Delta x = -6.0 \\text{ m}',
        },
      ],
      finalAnswer: { text: '(a) t = 2.0 s; (b) Δx = -6.0 m' },
    },
    hints: [
      { level: 1, hint: 'For part (a), set x(t) = 0 and solve for t' },
      { level: 2, hint: 'For part (b), find x(3.0) and x(6.0), then calculate the difference' },
      { level: 3, hint: 'At origin: 4.0 - 2.0t = 0, so t = 2.0 s. Displacement = x(6.0) - x(3.0)' },
    ],
    problemSpecificErrors: [
      {
        error: 'Calculating distance instead of displacement',
        howToDetect: 'Student gives positive value for displacement in part (b)',
        feedback: 'Displacement can be negative. It\'s final position minus initial position, not absolute distance.',
      },
    ],
    tags: ["position_functions","displacement","origin_crossing"],
  },

  {
    id: 'openstax-ch3-p28',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 28',
    concepts: ["displacement","velocity"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Cyclist displacement and average velocity',
    statement: 'A cyclist rides 8.0 km east for 20 minutes, then they turn and head west for 8 minutes and 3.2 km. Finally, they ride east for 16 km, which takes 40 minutes. (a) What is the final displacement of the cyclist? (b) What is their average velocity?',
    givenValues: [
      { symbol: 'd_1', value: 8, unit: 'km', description: 'First distance east' },
      { symbol: 't_1', value: 20, unit: 'min', description: 'First time interval' },
      { symbol: 'd_2', value: 3.2, unit: 'km', description: 'Distance west' },
      { symbol: 't_2', value: 8, unit: 'min', description: 'Second time interval' },
      { symbol: 'd_3', value: 16, unit: 'km', description: 'Final distance east' },
      { symbol: 't_3', value: 40, unit: 'min', description: 'Third time interval' },
    ],
    unknowns: [
      { symbol: '\Delta x', description: 'Final displacement', unit: 'km' },
      { symbol: 'v_{avg}', description: 'Average velocity', unit: 'km/min' },
    ],
    solution: {
      approach: 'Track displacement using coordinate system, then calculate average velocity',
      steps: [
        {
          stepNumber: 1,
          description: 'Set up coordinate system',
          explanation: 'Let east be positive direction',
          result: 'East = +, West = -',
        },
        {
          stepNumber: 2,
          description: 'Calculate total displacement',
          equation: '\\Delta x = \\Delta x_1 + \\Delta x_2 + \\Delta x_3',
          substitution: '\\Delta x = (+8.0) + (-3.2) + (+16) = 20.8 \\text{ km}',
          result: '\\Delta x = 20.8 \\text{ km}',
        },
        {
          stepNumber: 3,
          description: 'Calculate total time',
          substitution: 't_{total} = 20 + 8 + 40 = 68 \\text{ min}',
          result: 't_{total} = 68 \\text{ min}',
        },
        {
          stepNumber: 4,
          description: 'Calculate average velocity',
          equation: 'v_{avg} = \\frac{\\Delta x}{t_{total}}',
          substitution: 'v_{avg} = \\frac{20.8}{68} = 0.306 \\text{ km/min}',
          result: 'v_{avg} = 0.31 \\text{ km/min}',
        },
      ],
      finalAnswer: { text: '(a) Δx = 20.8 km east; (b) v_avg = 0.31 km/min east' },
    },
    hints: [
      { level: 1, hint: 'Set up a coordinate system with east as positive, then track the net displacement' },
      { level: 2, hint: 'Add up all displacements: +8.0 km - 3.2 km + 16 km' },
      { level: 3, hint: 'Average velocity = total displacement ÷ total time = 20.8 km ÷ 68 min' },
    ],
    problemSpecificErrors: [
      {
        error: 'Adding distances instead of displacements',
        howToDetect: 'Student gets displacement of 27.2 km',
        feedback: 'Remember that displacement is a vector - westward motion should be subtracted from eastward motion',
      },
      {
        error: 'Confusing average velocity with average speed',
        howToDetect: 'Student uses total distance traveled instead of displacement',
        feedback: 'Average velocity uses displacement, not total distance traveled',
      },
    ],
    tags: ["displacement","average_velocity","vector_addition"],
  },

  {
    id: 'openstax-ch3-p29',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 29',
    concepts: ["velocity"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 7,
    title: 'Chelyabinsk meteor blast wave velocity',
    statement: 'On February 15, 2013, a superbolide meteor entered Earth\'s atmosphere over Chelyabinsk, Russia, and exploded at an altitude of 23.5 km. The blast wave took approximately 2 minutes 30 seconds to reach ground level. The blast wave traveled at 10° above the horizon. (a) What was the average velocity of the blast wave? (b) Compare this with the speed of sound, which is 343 m/s at sea level.',
    givenValues: [
      { symbol: 'h', value: 23.5, unit: 'km', description: 'Altitude of explosion' },
      { symbol: 't', value: 2.5, unit: 'min', description: 'Time to reach ground' },
      { symbol: '\theta', value: 10, unit: '°', description: 'Angle above horizon' },
      { symbol: 'v_{sound}', value: 343, unit: 'm/s', description: 'Speed of sound' },
    ],
    unknowns: [
      { symbol: 'v_{blast}', description: 'Average velocity of blast wave', unit: 'm/s' },
      { symbol: 'ratio', description: 'Ratio to speed of sound', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Calculate distance traveled using trigonometry, then find velocity',
      steps: [
        {
          stepNumber: 1,
          description: 'Find distance traveled by blast wave',
          equation: 'd = \\frac{h}{\\sin\\theta}',
          substitution: 'd = \\frac{23.5}{\\sin(10°)} = \\frac{23.5}{0.174} = 135 \\text{ km}',
          result: 'd = 135 \\text{ km} = 135000 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Convert time to seconds',
          substitution: 't = 2.5 \\text{ min} = 150 \\text{ s}',
          result: 't = 150 \\text{ s}',
        },
        {
          stepNumber: 3,
          description: 'Calculate average velocity',
          equation: 'v_{blast} = \\frac{d}{t}',
          substitution: 'v_{blast} = \\frac{135000}{150} = 900 \\text{ m/s}',
          result: 'v_{blast} = 900 \\text{ m/s}',
        },
        {
          stepNumber: 4,
          description: 'Compare with speed of sound',
          equation: 'ratio = \\frac{v_{blast}}{v_{sound}}',
          substitution: 'ratio = \\frac{900}{343} = 2.62',
          result: '2.62 \\text{ times faster than sound}',
        },
      ],
      finalAnswer: { text: '(a) 900 m/s; (b) 2.62 times the speed of sound' },
    },
    hints: [
      { level: 1, hint: 'The blast wave travels in a straight line at 10° above horizontal - use trigonometry to find the distance' },
      { level: 2, hint: 'If the wave travels at angle θ above horizontal and drops height h, distance = h/sin(θ)' },
      { level: 3, hint: 'Distance = 23.5 km / sin(10°) = 135 km, then velocity = distance/time' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using height instead of actual distance traveled',
        howToDetect: 'Student gets velocity around 157 m/s',
        feedback: 'The blast wave travels at an angle, so it covers more distance than just the vertical height',
      },
      {
        error: 'Forgetting to convert units',
        howToDetect: 'Answer not in m/s or wrong by factor of 1000',
        feedback: 'Make sure all units are consistent - convert km to m and minutes to seconds',
      },
    ],
    tags: ["trigonometry","velocity","unit_conversion","real_world_application"],
  },

  {
    id: 'openstax-ch3-p30',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 30',
    concepts: ["velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Woodchuck average velocity and speed',
    statement: 'A woodchuck runs 20 m to the right in 5 s, then turns and runs 10 m to the left in 3 s. (a) What is the average velocity of the woodchuck? (b) What is its average speed?',
    givenValues: [
      { symbol: 'd_1', value: 20, unit: 'm', description: 'Distance right' },
      { symbol: 't_1', value: 5, unit: 's', description: 'Time for first segment' },
      { symbol: 'd_2', value: 10, unit: 'm', description: 'Distance left' },
      { symbol: 't_2', value: 3, unit: 's', description: 'Time for second segment' },
    ],
    unknowns: [
      { symbol: 'v_{avg}', description: 'Average velocity', unit: 'm/s' },
      { symbol: 's_{avg}', description: 'Average speed', unit: 'm/s' },
    ],
    solution: {
      approach: 'Calculate displacement for velocity, total distance for speed',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate net displacement',
          explanation: 'Right is positive, left is negative',
          substitution: '\\Delta x = 20 - 10 = 10 \\text{ m}',
          result: '\\Delta x = 10 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Calculate total time',
          substitution: 't_{total} = 5 + 3 = 8 \\text{ s}',
          result: 't_{total} = 8 \\text{ s}',
        },
        {
          stepNumber: 3,
          description: 'Calculate average velocity',
          equation: 'v_{avg} = \\frac{\\Delta x}{t_{total}}',
          substitution: 'v_{avg} = \\frac{10}{8} = 1.25 \\text{ m/s}',
          result: 'v_{avg} = 1.25 \\text{ m/s to the right}',
        },
        {
          stepNumber: 4,
          description: 'Calculate total distance',
          substitution: 'd_{total} = 20 + 10 = 30 \\text{ m}',
          result: 'd_{total} = 30 \\text{ m}',
        },
        {
          stepNumber: 5,
          description: 'Calculate average speed',
          equation: 's_{avg} = \\frac{d_{total}}{t_{total}}',
          substitution: 's_{avg} = \\frac{30}{8} = 3.75 \\text{ m/s}',
          result: 's_{avg} = 3.75 \\text{ m/s}',
        },
      ],
      finalAnswer: { text: '(a) 1.25 m/s to the right; (b) 3.75 m/s' },
    },
    hints: [
      { level: 1, hint: 'Remember the difference between velocity (uses displacement) and speed (uses total distance)' },
      { level: 2, hint: 'For velocity: net displacement = 20m - 10m = 10m. For speed: total distance = 20m + 10m = 30m' },
      { level: 3, hint: 'Average velocity = 10m ÷ 8s = 1.25 m/s. Average speed = 30m ÷ 8s = 3.75 m/s' },
    ],
    problemSpecificErrors: [
      {
        error: 'Confusing velocity and speed calculations',
        howToDetect: 'Student uses total distance for velocity or displacement for speed',
        feedback: 'Velocity uses net displacement (can cancel out), speed uses total distance traveled (always positive)',
      },
    ],
    tags: ["average_velocity","average_speed","displacement_vs_distance"],
  },

  {
    id: 'openstax-ch3-p37',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 37',
    concepts: ["acceleration"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Cheetah acceleration from rest',
    statement: 'A cheetah can accelerate from rest to a speed of 30.0 m/s in 7.00 s. What is its acceleration?',
    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity (at rest)' },
      { symbol: 'v_f', value: 30, unit: 'm/s', description: 'Final velocity' },
      { symbol: 't', value: 7, unit: 's', description: 'Time taken' },
    ],
    unknowns: [
      { symbol: 'a', description: 'Acceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use the definition of acceleration',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply acceleration definition',
          equation: 'a = \\frac{v_f - v_0}{t}',
          substitution: 'a = \\frac{30.0 - 0}{7.00}',
          result: 'a = 4.29 \\text{ m/s}^2',
        },
      ],
      finalAnswer: { value: 4.29, unit: 'm/s²' },
    },
    hints: [
      { level: 1, hint: 'Use the basic definition of acceleration: change in velocity divided by time' },
      { level: 2, hint: 'Acceleration = (final velocity - initial velocity) / time' },
      { level: 3, hint: 'a = (30.0 - 0) / 7.00 = 4.29 m/s²' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong formula',
        howToDetect: 'Student tries to use kinematic equations with displacement',
        feedback: 'This is a simple acceleration problem - just use a = Δv/Δt',
      },
    ],
    tags: ["acceleration","basic_kinematics"],
  },

  {
    id: 'openstax-ch3-p38',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 38',
    concepts: ["acceleration"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Dr. Stapp rocket sled acceleration',
    statement: 'Dr. John Paul Stapp was a U.S. Air Force officer who studied the effects of extreme acceleration on the human body. On December 10, 1954, Stapp rode a rocket sled, accelerating from rest to a top speed of 282 m/s (1015 km/h) in 5.00 s and was brought jarringly back to rest in only 1.40 s. Calculate his (a) acceleration in his direction of motion and (b) acceleration opposite to his direction of motion. Express each in multiples of g (9.80 m/s²).',
    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'v_{max}', value: 282, unit: 'm/s', description: 'Maximum velocity' },
      { symbol: 't_1', value: 5, unit: 's', description: 'Acceleration time' },
      { symbol: 't_2', value: 1.4, unit: 's', description: 'Deceleration time' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'a_1', description: 'Acceleration during speedup', unit: 'm/s²' },
      { symbol: 'a_2', description: 'Acceleration during slowdown', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Calculate acceleration for each phase separately',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate acceleration during speedup',
          equation: 'a_1 = \\frac{v_{max} - v_0}{t_1}',
          substitution: 'a_1 = \\frac{282 - 0}{5.00} = 56.4 \\text{ m/s}^2',
          result: 'a_1 = 56.4 \\text{ m/s}^2',
        },
        {
          stepNumber: 2,
          description: 'Express in multiples of g',
          substitution: '\\frac{a_1}{g} = \\frac{56.4}{9.80} = 5.76g',
          result: 'a_1 = 5.76g',
        },
        {
          stepNumber: 3,
          description: 'Calculate acceleration during slowdown',
          equation: 'a_2 = \\frac{v_f - v_{max}}{t_2}',
          substitution: 'a_2 = \\frac{0 - 282}{1.40} = -201 \\text{ m/s}^2',
          result: 'a_2 = -201 \\text{ m/s}^2',
        },
        {
          stepNumber: 4,
          description: 'Express deceleration in multiples of g',
          substitution: '\\frac{|a_2|}{g} = \\frac{201}{9.80} = 20.5g',
          result: 'a_2 = -20.5g',
        },
      ],
      finalAnswer: { text: '(a) 56.4 m/s² = 5.76g; (b) -201 m/s² = -20.5g' },
    },
    hints: [
      { level: 1, hint: 'Calculate the acceleration for each phase separately using a = Δv/Δt' },
      { level: 2, hint: 'For speedup: (282-0)/5.00. For slowdown: (0-282)/1.40' },
      { level: 3, hint: 'Don\'t forget to divide by 9.80 to express in terms of g' },
    ],
    problemSpecificErrors: [
      {
        error: 'Forgetting negative sign for deceleration',
        howToDetect: 'Student gives positive value for part (b)',
        feedback: 'Deceleration should be negative since velocity decreases',
      },
      {
        error: 'Wrong calculation of multiples of g',
        howToDetect: 'Incorrect ratio when dividing by 9.80',
        feedback: 'To express in multiples of g, divide the acceleration by 9.80 m/s²',
      },
    ],
    tags: ["acceleration","deceleration","unit_conversion","real_world_application"],
  },

  {
    id: 'openstax-ch3-p40',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 40',
    concepts: ["acceleration"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 5,
    title: 'Commuter backing out of garage',
    statement: 'A commuter backs her car out of her garage with an acceleration of 1.40 m/s². (a) How long does it take her to reach a speed of 2.00 m/s? (b) If she then brakes to a stop in 0.800 s, what is her acceleration?',
    givenValues: [
      { symbol: 'a_1', value: 1.4, unit: 'm/s²', description: 'Initial acceleration' },
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'v_1', value: 2, unit: 'm/s', description: 'Velocity after acceleration' },
      { symbol: 't_2', value: 0.8, unit: 's', description: 'Braking time' },
    ],
    unknowns: [
      { symbol: 't_1', description: 'Time to reach 2.00 m/s', unit: 's' },
      { symbol: 'a_2', description: 'Braking acceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use kinematic equations for each phase',
      steps: [
        {
          stepNumber: 1,
          description: 'Find time to reach 2.00 m/s',
          equation: 'v_1 = v_0 + a_1 t_1',
          substitution: '2.00 = 0 + 1.40 \\times t_1',
          result: 't_1 = 1.43 \\text{ s}',
        },
        {
          stepNumber: 2,
          description: 'Find braking acceleration',
          equation: 'a_2 = \\frac{v_f - v_1}{t_2}',
          substitution: 'a_2 = \\frac{0 - 2.00}{0.800} = -2.50 \\text{ m/s}^2',
          result: 'a_2 = -2.50 \\text{ m/s}^2',
        },
      ],
      finalAnswer: { text: '(a) 1.43 s; (b) -2.50 m/s²' },
    },
    hints: [
      { level: 1, hint: 'For part (a), use v = v₀ + at. For part (b), calculate the change in velocity divided by time' },
      { level: 2, hint: 'Part (a): 2.00 = 0 + 1.40t, solve for t. Part (b): acceleration = (0 - 2.00)/0.800' },
      { level: 3, hint: 't = 2.00/1.40 = 1.43 s. Braking acceleration = -2.00/0.800 = -2.50 m/s²' },
    ],
    problemSpecificErrors: [
      {
        error: 'Forgetting negative sign for braking',
        howToDetect: 'Student gives positive acceleration for part (b)',
        feedback: 'Braking means slowing down, so acceleration should be negative (opposite to velocity)',
      },
    ],
    tags: ["acceleration","kinematics","multi_phase_motion"],
  },

  {
    id: 'openstax-ch3-p43',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 43',
    concepts: ["displacement","velocity"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 2,
    title: 'Particle with constant velocity',
    statement: 'A particle moves in a straight line at a constant velocity of 30 m/s. What is its displacement between t = 0 and t = 5.0 s?',
    givenValues: [
      { symbol: 'v', value: 30, unit: 'm/s', description: 'Constant velocity' },
      { symbol: 't_0', value: 0, unit: 's', description: 'Initial time' },
      { symbol: 't_f', value: 5, unit: 's', description: 'Final time' },
    ],
    unknowns: [
      { symbol: '\Delta x', description: 'Displacement', unit: 'm' },
    ],
    solution: {
      approach: 'Use displacement formula for constant velocity',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate displacement',
          equation: '\\Delta x = v \\times \\Delta t',
          substitution: '\\Delta x = 30 \\times (5.0 - 0) = 30 \\times 5.0',
          result: '\\Delta x = 150 \\text{ m}',
        },
      ],
      finalAnswer: { value: 150, unit: 'm' },
    },
    hints: [
      { level: 1, hint: 'For constant velocity, displacement equals velocity times time' },
      { level: 2, hint: 'Use the formula: displacement = velocity × time interval' },
      { level: 3, hint: 'Δx = 30 m/s × 5.0 s = 150 m' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using kinematic equations unnecessarily',
        howToDetect: 'Student tries to use equations with acceleration',
        feedback: 'For constant velocity (zero acceleration), simply use displacement = velocity × time',
      },
    ],
    tags: ["constant_velocity","displacement","basic_kinematics"],
  },

  {
    id: 'openstax-ch3-p44',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 44',
    concepts: ["displacement","acceleration"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Particle with constant acceleration from rest',
    statement: 'A particle moves in a straight line with an initial velocity of 0 m/s and a constant acceleration of 30 m/s². If x = 0 at t = 0, what is the particle\'s position at t = 5 s?',
    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'a', value: 30, unit: 'm/s²', description: 'Constant acceleration' },
      { symbol: 'x_0', value: 0, unit: 'm', description: 'Initial position' },
      { symbol: 't', value: 5, unit: 's', description: 'Time' },
    ],
    unknowns: [
      { symbol: 'x', description: 'Position at t = 5 s', unit: 'm' },
    ],
    solution: {
      approach: 'Use kinematic equation for position',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply kinematic equation',
          equation: 'x = x_0 + v_0 t + \\frac{1}{2}at^2',
          substitution: 'x = 0 + 0 \\times 5 + \\frac{1}{2} \\times 30 \\times 5^2',
          result: 'x = \\frac{1}{2} \\times 30 \\times 25 = 375 \\text{ m}',
        },
      ],
      finalAnswer: { value: 375, unit: 'm' },
    },
    hints: [
      { level: 1, hint: 'Use the kinematic equation that relates position, initial velocity, acceleration, and time' },
      { level: 2, hint: 'Since v₀ = 0 and x₀ = 0, the equation simplifies to x = ½at²' },
      { level: 3, hint: 'x = ½ × 30 × 5² = ½ × 30 × 25 = 375 m' },
    ],
    problemSpecificErrors: [
      {
        error: 'Forgetting the ½ factor',
        howToDetect: 'Student gets 750 m instead of 375 m',
        feedback: 'Don\'t forget the ½ factor in the kinematic equation x = x₀ + v₀t + ½at²',
      },
      {
        error: 'Using wrong kinematic equation',
        howToDetect: 'Student tries to find velocity first',
        feedback: 'You can go directly to position using x = x₀ + v₀t + ½at²',
      },
    ],
    tags: ["constant_acceleration","kinematics","position"],
  },

  {
    id: 'openstax-ch3-p45',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 45',
    concepts: ["displacement","velocity","acceleration"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 4,
    title: 'Particle with initial velocity and acceleration',
    statement: 'A particle moves in a straight line with an initial velocity of 30 m/s and constant acceleration 30 m/s². (a) What is its displacement at t = 5 s? (b) What is its velocity at this same time?',
    givenValues: [
      { symbol: 'v_0', value: 30, unit: 'm/s', description: 'Initial velocity' },
      { symbol: 'a', value: 30, unit: 'm/s²', description: 'Constant acceleration' },
      { symbol: 't', value: 5, unit: 's', description: 'Time' },
    ],
    unknowns: [
      { symbol: '\Delta x', description: 'Displacement', unit: 'm' },
      { symbol: 'v', description: 'Velocity at t = 5 s', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations for displacement and velocity',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate displacement',
          equation: '\\Delta x = v_0 t + \\frac{1}{2}at^2',
          substitution: '\\Delta x = 30 \\times 5 + \\frac{1}{2} \\times 30 \\times 25',
          result: '\\Delta x = 150 + 375 = 525 \\text{ m}',
        },
        {
          stepNumber: 2,
          description: 'Calculate velocity',
          equation: 'v = v_0 + at',
          substitution: 'v = 30 + 30 \\times 5 = 30 + 150',
          result: 'v = 180 \\text{ m/s}',
        },
      ],
      finalAnswer: { text: '(a) 525 m; (b) 180 m/s' },
    },
    hints: [
      { level: 1, hint: 'Use separate kinematic equations for displacement and velocity' },
      { level: 2, hint: 'For displacement: Δx = v₀t + ½at². For velocity: v = v₀ + at' },
      { level: 3, hint: 'Displacement: 30×5 + ½×30×25 = 525 m. Velocity: 30 + 30×5 = 180 m/s' },
    ],
    problemSpecificErrors: [
      {
        error: 'Confusing displacement with position',
        howToDetect: 'Student asks about initial position',
        feedback: 'The problem asks for displacement, which is change in position regardless of starting point',
      },
    ],
    tags: ["constant_acceleration","kinematics","displacement","velocity"],
  },

  {
    id: 'openstax-ch3-p48',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 48',
    concepts: ["acceleration","displacement","velocity"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 5,
    title: 'Particle with constant acceleration reaching given displacement',
    statement: 'A particle has a constant acceleration of 6.0 m/s². (a) If its initial velocity is 2.0 m/s, at what time is its displacement 5.0 m? (b) What is its velocity at that time?',
    givenValues: [
      { symbol: 'a', value: 6, unit: 'm/s²', description: 'Constant acceleration' },
      { symbol: 'v_0', value: 2, unit: 'm/s', description: 'Initial velocity' },
      { symbol: '\Delta x', value: 5, unit: 'm', description: 'Displacement' },
    ],
    unknowns: [
      { symbol: 't', description: 'Time to reach displacement', unit: 's' },
      { symbol: 'v', description: 'Velocity at that time', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equation to find time, then calculate velocity',
      steps: [
        {
          stepNumber: 1,
          description: 'Set up kinematic equation for displacement',
          equation: '\\Delta x = v_0 t + \\frac{1}{2}at^2',
          substitution: '5.0 = 2.0t + \\frac{1}{2}(6.0)t^2 = 2.0t + 3.0t^2',
          result: '3.0t^2 + 2.0t - 5.0 = 0',
        },
        {
          stepNumber: 2,
          description: 'Solve quadratic equation',
          equation: 't = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
          substitution: 't = \\frac{-2.0 \\pm \\sqrt{4.0 + 60}}{6.0} = \\frac{-2.0 \\pm 8.0}{6.0}',
          result: 't = 1.0 \\text{ s (taking positive root)}',
        },
        {
          stepNumber: 3,
          description: 'Calculate velocity at t = 1.0 s',
          equation: 'v = v_0 + at',
          substitution: 'v = 2.0 + 6.0 \\times 1.0',
          result: 'v = 8.0 \\text{ m/s}',
        },
      ],
      finalAnswer: { text: '(a) t = 1.0 s; (b) v = 8.0 m/s' },
    },
    hints: [
      { level: 1, hint: 'Use the kinematic equation for displacement to set up a quadratic equation in time' },
      { level: 2, hint: '5.0 = 2.0t + 3.0t² leads to the quadratic 3.0t² + 2.0t - 5.0 = 0' },
      { level: 3, hint: 'Use the quadratic formula: t = (-2 ± √64)/6, take the positive root t = 1.0 s' },
    ],
    problemSpecificErrors: [
      {
        error: 'Taking the negative root',
        howToDetect: 'Student gets negative time',
        feedback: 'Time must be positive - take the positive root of the quadratic equation',
      },
      {
        error: 'Arithmetic errors in quadratic formula',
        howToDetect: 'Wrong discriminant or final answer',
        feedback: 'Check your arithmetic: b² - 4ac = 4 + 60 = 64, so √64 = 8',
      },
    ],
    tags: ["quadratic_equations","kinematics","constant_acceleration"],
  },

  {
    id: 'openstax-ch3-p66',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 66',
    concepts: ["free-fall","displacement","velocity"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Ball thrown upward - multiple time calculations',
    statement: 'Calculate the displacement and velocity at times of (a) 0.500 s, (b) 1.00 s, (c) 1.50 s, and (d) 2.00 s for a ball thrown straight up with an initial velocity of 15.0 m/s. Take the point of release to be y₀ = 0.',
    givenValues: [
      { symbol: 'v_0', value: 15, unit: 'm/s', description: 'Initial velocity (upward)' },
      { symbol: 'y_0', value: 0, unit: 'm', description: 'Initial position' },
      { symbol: 'g', value: -9.8, unit: 'm/s²', description: 'Gravitational acceleration (downward)' },
    ],
    unknowns: [
      { symbol: 'y(t)', description: 'Displacement at various times', unit: 'm' },
      { symbol: 'v(t)', description: 'Velocity at various times', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations for free fall at each time',
      steps: [
        {
          stepNumber: 1,
          description: 'Set up kinematic equations',
          equation: 'y = v_0 t + \\frac{1}{2}gt^2, \\quad v = v_0 + gt',
          result: 'y = 15.0t - 4.90t^2, \\quad v = 15.0 - 9.80t',
        },
        {
          stepNumber: 2,
          description: 'Calculate for t = 0.500 s',
          substitution: 'y = 15.0(0.500) - 4.90(0.500)^2 = 7.50 - 1.23 = 6.27 \\text{ m}',
          result: 'y = 6.27 \\text{ m}, \\quad v = 15.0 - 9.80(0.500) = 10.1 \\text{ m/s}',
        },
        {
          stepNumber: 3,
          description: 'Calculate for t = 1.00 s',
          substitution: 'y = 15.0(1.00) - 4.90(1.00)^2 = 15.0 - 4.90 = 10.1 \\text{ m}',
          result: 'y = 10.1 \\text{ m}, \\quad v = 15.0 - 9.80(1.00) = 5.20 \\text{ m/s}',
        },
        {
          stepNumber: 4,
          description: 'Calculate for t = 1.50 s',
          substitution: 'y = 15.0(1.50) - 4.90(1.50)^2 = 22.5 - 11.0 = 11.5 \\text{ m}',
          result: 'y = 11.5 \\text{ m}, \\quad v = 15.0 - 9.80(1.50) = 0.30 \\text{ m/s}',
        },
        {
          stepNumber: 5,
          description: 'Calculate for t = 2.00 s',
          substitution: 'y = 15.0(2.00) - 4.90(2.00)^2 = 30.0 - 19.6 = 10.4 \\text{ m}',
          result: 'y = 10.4 \\text{ m}, \\quad v = 15.0 - 9.80(2.00) = -4.60 \\text{ m/s}',
        },
      ],
      finalAnswer: { text: '(a) y=6.27m, v=10.1m/s; (b) y=10.1m, v=5.20m/s; (c) y=11.5m, v=0.30m/s; (d) y=10.4m, v=-4.60m/s' },
    },
    hints: [
      { level: 1, hint: 'Use y = v₀t + ½gt² for position and v = v₀ + gt for velocity, with g = -9.80 m/s²' },
      { level: 2, hint: 'The equations become y = 15.0t - 4.90t² and v = 15.0 - 9.80t' },
      { level: 3, hint: 'Substitute each time value into both equations. Note velocity becomes negative after ~1.53 s' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using positive value for g',
        howToDetect: 'Position keeps increasing or wrong velocity signs',
        feedback: 'Gravity acts downward, so use g = -9.80 m/s² in the equations',
      },
      {
        error: 'Arithmetic errors in calculations',
        howToDetect: 'Wrong numerical values',
        feedback: 'Double-check your arithmetic, especially with negative numbers and squares',
      },
    ],
    tags: ["free_fall","projectile_motion","kinematics","multiple_calculations"],
  },

  {
    id: 'openstax-ch3-p68',
    source: 'curated',
    sourceReference: 'OpenStax University Physics Vol. 1, Chapter 3, Problem 68',
    concepts: ["free-fall","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Basketball player jump velocity',
    statement: 'A basketball referee tosses the ball straight up for the starting tip-off. At what velocity must a basketball player leave the ground to rise 1.25 m above the floor in an attempt to get the ball?',
    givenValues: [
      { symbol: 'h', value: 1.25, unit: 'm', description: 'Maximum height above floor' },
      { symbol: 'v_f', value: 0, unit: 'm/s', description: 'Velocity at maximum height' },
      { symbol: 'g', value: -9.8, unit: 'm/s²', description: 'Gravitational acceleration' },
    ],
    unknowns: [
      { symbol: 'v_0', description: 'Initial velocity (takeoff)', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equation relating velocity, acceleration, and displacement',
      steps: [
        {
          stepNumber: 1,
          description: 'Apply kinematic equation',
          explanation: 'At maximum height, final velocity is zero',
          equation: 'v_f^2 = v_0^2 + 2g\\Delta y',
          substitution: '0^2 = v_0^2 + 2(-9.80)(1.25)',
        },
        {
          stepNumber: 2,
          description: 'Solve for initial velocity',
          substitution: '0 = v_0^2 - 24.5',
          result: 'v_0^2 = 24.5',
        },
        {
          stepNumber: 3,
          description: 'Take square root',
          result: 'v_0 = \\sqrt{24.5} = 4.95 \\text{ m/s}',
        },
      ],
      finalAnswer: { value: 4.95, unit: 'm/s' },
    },
    hints: [
      { level: 1, hint: 'At the maximum height, the velocity is zero. Use a kinematic equation relating initial velocity, final velocity, and displacement' },
      { level: 2, hint: 'Use v² = v₀² + 2gΔy with v = 0 at the top' },
      { level: 3, hint: '0 = v₀² + 2(-9.80)(1.25), so v₀² = 24.5 and v₀ = 4.95 m/s' },
    ],
    problemSpecificErrors: [
      {
        error: 'Using wrong kinematic equation',
        howToDetect: 'Student tries to use equations involving time',
        feedback: 'Since time isn\'t given, use the equation that relates velocities and displacement: v² = v₀² + 2gΔy',
      },
      {
        error: 'Sign error with gravity',
        howToDetect: 'Getting imaginary or wrong answer',
        feedback: 'Remember g = -9.80 m/s² since gravity opposes upward motion',
      },
    ],
    tags: ["free_fall","maximum_height","kinematics"],
  },

  // ============================================================================
  // OPENSTAX EXTRACTED PROBLEMS (Added 2026-01-31)
  // ============================================================================
  {
    id: 'pdf-ch2-p15',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 15',
    concepts: ["velocity","acceleration","free-fall","position"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Calculating Velocity of a Falling Object: A Rock Thrown Down',
    statement: 'What happens if the person on the cliff throws the rock straight down, instead of straight up? To explore this question, calculate the velocity of the rock when it is 5.10 m below the starting point, and has been thrown downward with an initial speed of 13.0 m/s.',
    givenValues: [
      { symbol: 'y', value: -5.10, unit: 'm', description: 'final position (negative because below starting point)' },
      { symbol: 'y_0', value: 0, unit: 'm', description: 'initial position' },
      { symbol: 'v_0', value: -13.0, unit: 'm/s', description: 'initial velocity (negative because downward)' },
      { symbol: 'a', value: -9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'v', description: 'final velocity', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use the kinematic equation that relates velocity, position, and acceleration without time: v² = v₀² + 2a(y - y₀)',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that up is positive, so downward motion and positions below the starting point are negative.' },
      { level: 2, hint: 'Use the kinematic equation v² = v₀² + 2a(y - y₀) since it doesn\'t involve time.' },
      { level: 3, hint: 'When taking the square root, choose the negative value since the rock continues moving downward.' },
    ],
    tags: ["free-fall","kinematics","negative-velocity","projectile-motion"],
  },

  {
    id: 'pdf-ch2-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 1 (Reaction Time Experiment)',
    concepts: ["free-fall","acceleration","position"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Reaction Time and Stopping Distance',
    statement: 'A simple experiment can be done to determine your reaction time. Have a friend hold a ruler between your thumb and index finger, separated by about 1 cm. Note the mark on the ruler that is right between your fingers. Have your friend drop the ruler unexpectedly, and try to catch it between your two fingers. Note the new reading on the ruler. Assuming acceleration is that due to gravity, calculate your reaction time. How far would you travel in a car (moving at 30 m/s) if the time it took your foot to go from the gas pedal to the brake was twice this reaction time?',
    givenValues: [
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
      { symbol: 'v₀', value: 0, unit: 'm/s', description: 'initial velocity of ruler' },
      { symbol: 'v_car', value: 30, unit: 'm/s', description: 'car velocity' },
    ],
    unknowns: [
      { symbol: 't_reaction', description: 'reaction time', unit: 's' },
      { symbol: 'd', description: 'distance traveled by car', unit: 'm' },
    ],
    solution: {
      approach: 'Use kinematic equation for free fall to find reaction time, then calculate stopping distance',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The ruler undergoes free fall motion with initial velocity zero' },
      { level: 2, hint: 'Use the kinematic equation relating distance, time, and acceleration' },
      { level: 3, hint: 'The brake reaction time is twice the measured reaction time' },
    ],
    tags: ["free-fall","reaction-time","practical-application","safety"],
  },

  {
    id: 'pdf-ch2-p2',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 2 (Finding g from Falling Object)',
    concepts: ["free-fall","acceleration","displacement"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Determining g from Experimental Data',
    statement: 'An object, usually a metal ball for which air resistance is negligible, is dropped and the time it takes to fall a known distance is measured. Suppose the ball falls 1.0000 m in 0.45173 s. Assuming the ball is not affected by air resistance, what is the precise acceleration due to gravity at this location?',
    givenValues: [
      { symbol: 'Δy', value: -1.0000, unit: 'm', description: 'displacement (downward, negative)' },
      { symbol: 't', value: 0.45173, unit: 's', description: 'time of fall' },
      { symbol: 'v₀', value: 0, unit: 'm/s', description: 'initial velocity' },
      { symbol: 'y₀', value: 0, unit: 'm', description: 'initial position' },
    ],
    unknowns: [
      { symbol: 'g', description: 'acceleration due to gravity', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use kinematic equation to solve for acceleration',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The object starts from rest, so initial velocity is zero' },
      { level: 2, hint: 'Use the kinematic equation that relates displacement, time, and acceleration' },
      { level: 3, hint: 'The negative sign indicates downward direction; g is the magnitude' },
    ],
    tags: ["experimental-physics","precision","free-fall","measurement"],
  },

  {
    id: 'pdf-ch2-p3',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 3 (Ice Chunk Free Fall)',
    concepts: ["free-fall","displacement","acceleration"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Ice Chunk Falling from Glacier',
    statement: 'A chunk of ice breaks off a glacier and falls 30.0 meters before it hits the water. Assuming it falls freely (there is no air resistance), how long does it take to hit the water?',
    givenValues: [
      { symbol: 'y₀', value: 0, unit: 'm', description: 'initial position' },
      { symbol: 'y', value: -30.0, unit: 'm', description: 'final position (downward)' },
      { symbol: 'v₀', value: 0, unit: 'm/s', description: 'initial velocity' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 't', description: 'time to fall', unit: 's' },
    ],
    solution: {
      approach: 'Use kinematic equation to find time of fall',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The ice starts from rest and falls under gravity alone' },
      { level: 2, hint: 'Use the kinematic equation that doesn\'t involve final velocity' },
      { level: 3, hint: 'Take the positive square root since time cannot be negative' },
    ],
    tags: ["free-fall","time-calculation","glacier","natural-phenomena"],
  },

  {
    id: 'pdf-ch2-p4',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 4 (Average Velocity from Graph)',
    concepts: ["velocity","displacement","position"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Average Velocity from Position-Time Graph',
    statement: 'Find the average velocity of a jet-powered car whose position is given by the following data points from a position versus time graph: at t = 0.50 s, x = 525 m; at t = 6.40 s, x = 2000 m.',
    givenValues: [
      { symbol: 't₁', value: 0.50, unit: 's', description: 'initial time' },
      { symbol: 'x₁', value: 525, unit: 'm', description: 'initial position' },
      { symbol: 't₂', value: 6.40, unit: 's', description: 'final time' },
      { symbol: 'x₂', value: 2000, unit: 'm', description: 'final position' },
    ],
    unknowns: [
      { symbol: 'v_avg', description: 'average velocity', unit: 'm/s' },
    ],
    solution: {
      approach: 'Calculate slope of position vs time graph',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Average velocity is the slope of the position versus time graph' },
      { level: 2, hint: 'Use the formula: average velocity = change in position / change in time' },
      { level: 3, hint: 'Make sure to use final values minus initial values for the changes' },
    ],
    tags: ["graphical-analysis","average-velocity","jet-car","linear-motion"],
  },

  {
    id: 'pdf-ch2-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 1',
    concepts: ["velocity","acceleration"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Finding Acceleration from Velocity-Time Graph Using Tangent Line',
    statement: 'Find the tangent line to the curve at t = 25 s. Determine the endpoints of the tangent. These correspond to a position of 1300 m at time 19 s and a position of 3120 m at time 32 s. Plug these endpoints into the equation to solve for the slope.',
    givenValues: [
      { symbol: 'x_1', value: 1300, unit: 'm', description: 'position at first endpoint' },
      { symbol: 't_1', value: 19, unit: 's', description: 'time at first endpoint' },
      { symbol: 'x_2', value: 3120, unit: 'm', description: 'position at second endpoint' },
      { symbol: 't_2', value: 32, unit: 's', description: 'time at second endpoint' },
    ],
    unknowns: [
      { symbol: 'a', description: 'acceleration (slope of velocity-time graph)', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Find the slope of the tangent line to the velocity-time curve, which represents acceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The slope of a velocity vs. time graph gives acceleration.' },
      { level: 2, hint: 'Use the slope formula: slope = \\frac{\\text{rise}}{\\text{run}} = \\frac{\\Delta v}{\\Delta t}' },
      { level: 3, hint: 'The tangent line represents the instantaneous rate of change at that point.' },
    ],
    tags: ["graphical-analysis","tangent-line","instantaneous-acceleration"],
  },

  {
    id: 'pdf-ch2-p2',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 2',
    concepts: ["velocity","acceleration"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Calculating Acceleration from Velocity-Time Graph at t = 25s',
    statement: 'Calculate the acceleration of the jet car at a time of 25 s by finding the slope of the v vs. t graph. The slope of the curve at t = 25s is equal to the slope of the line tangent at that point. Determine endpoints of the tangent line from the figure, and then plug them into the equation to solve for slope.',
    givenValues: [
      { symbol: 't', value: 25, unit: 's', description: 'time at which to find acceleration' },
    ],
    unknowns: [
      { symbol: 'a', description: 'acceleration at t = 25s', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Find the slope of the tangent line to the velocity-time curve at t = 25s to determine instantaneous acceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The instantaneous acceleration equals the slope of the tangent line to the v-t curve.' },
      { level: 2, hint: 'Read coordinates of two points on the tangent line from the graph.' },
      { level: 3, hint: 'Use slope = \\frac{\\text{rise}}{\\text{run}} where rise is change in velocity and run is change in time.' },
    ],
    tags: ["graphical-analysis","instantaneous-acceleration","tangent-line","jet-car"],
  },

  {
    id: 'pdf-ch2-p3',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Conceptual Question 1',
    concepts: ["displacement","position"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Distinguishing Distance, Displacement, and Magnitude of Displacement',
    statement: 'Give an example in which there are clear distinctions among distance traveled, displacement, and magnitude of displacement. Specifically identify each quantity in your example.',
    solution: {
      approach: 'Provide a concrete example that illustrates the differences between these three related but distinct quantities.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think of a path that involves changing direction or returning to the starting point.' },
      { level: 2, hint: 'Distance is the total path length, displacement is the straight-line change in position.' },
      { level: 3, hint: 'Magnitude of displacement is always positive and equals the absolute value of displacement.' },
    ],
    tags: ["conceptual","distance","displacement","magnitude"],
  },

  {
    id: 'pdf-ch2-p4',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Conceptual Question 2',
    concepts: ["displacement","position"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 4,
    title: 'When Distance Traveled Equals Magnitude of Displacement',
    statement: 'Under what circumstances does distance traveled equal magnitude of displacement? What is the only case in which magnitude of displacement and displacement are exactly the same?',
    solution: {
      approach: 'Analyze the geometric and directional conditions required for these equalities.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider what happens when you move in a straight line without changing direction.' },
      { level: 2, hint: 'Remember that magnitude is always positive or zero.' },
      { level: 3, hint: 'Think about coordinate systems and positive/negative directions.' },
    ],
    tags: ["conceptual","displacement","distance","straight-line-motion"],
  },

  {
    id: 'pdf-ch2-p5',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Conceptual Question 4',
    concepts: ["velocity"],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 3,
    title: 'Speed vs Velocity - Bird Diving Example',
    statement: 'A student writes, \'A bird that is diving for prey has a speed of 10 m/s downward.\' What is wrong with the student\'s statement? What has the student actually described? Explain.',
    givenValues: [
      { symbol: 'v', value: 10, unit: 'm/s downward', description: 'incorrectly stated speed' },
    ],
    solution: {
      approach: 'Identify the conceptual error in confusing speed with velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember the difference between scalar and vector quantities.' },
      { level: 2, hint: 'Speed has no direction; velocity has both magnitude and direction.' },
    ],
    tags: ["conceptual","speed","velocity","scalar-vector"],
  },

  {
    id: 'pdf-ch2-p6',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 6',
    concepts: ["acceleration","velocity"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Vector Nature of Acceleration',
    statement: 'Acceleration is the change in velocity over time. Given this information, is acceleration a vector or a scalar quantity? Explain.',
    solution: {
      approach: 'Analyze the definition of acceleration and the vector nature of velocity to determine if acceleration is a vector or scalar quantity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about whether velocity is a vector or scalar quantity.' },
      { level: 2, hint: 'Consider what happens when you divide a vector by a scalar.' },
      { level: 3, hint: 'Remember that acceleration can change the direction of motion, not just the speed.' },
    ],
    tags: ["vectors","acceleration","conceptual"],
  },

  {
    id: 'pdf-ch2-p7',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 7',
    concepts: ["velocity"],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 3,
    title: 'Temperature as Scalar or Vector',
    statement: 'A weather forecast states that the temperature is predicted to be 25°C the following day. Is this temperature a vector or a scalar quantity? Explain.',
    givenValues: [
      { symbol: 'T', value: 25, unit: '°C', description: 'predicted temperature' },
    ],
    solution: {
      approach: 'Determine whether temperature requires direction information or only magnitude to be completely specified.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Does temperature have a direction associated with it?' },
      { level: 2, hint: 'Think about what information you need to completely describe temperature.' },
    ],
    tags: ["scalars","vectors","temperature","conceptual"],
  },

  {
    id: 'pdf-ch2-p8',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 8',
    concepts: ["velocity"],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 4,
    title: 'Time Measurement Devices',
    statement: 'Give an example (but not one from the text) of a device used to measure time and identify what change in that device indicates a change in time.',
    solution: {
      approach: 'Identify a common time-measuring device and explain how its physical change corresponds to time passage.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about devices you use daily to check the time.' },
      { level: 2, hint: 'Consider what physically changes in the device as time passes.' },
    ],
    tags: ["time","measurement","conceptual"],
  },

  {
    id: 'pdf-ch2-p9',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 9',
    concepts: ["velocity","displacement"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 6,
    title: 'Average Speed vs. Magnitude of Average Velocity',
    statement: 'There is a distinction between average speed and the magnitude of average velocity. Give an example that illustrates the difference between these two quantities.',
    solution: {
      approach: 'Create a scenario where the path taken affects the total distance but not the displacement, showing how average speed and magnitude of average velocity differ.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about a round trip where you end up where you started.' },
      { level: 2, hint: 'Consider how total distance differs from displacement.' },
      { level: 3, hint: 'Remember that displacement is the straight-line distance from start to finish.' },
    ],
    tags: ["velocity","speed","displacement","distance","conceptual"],
  },

  {
    id: 'pdf-ch2-p10',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 10',
    concepts: ["velocity","displacement"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Odometer vs. Speedometer Measurements',
    statement: 'Does a car\'s odometer measure distance traveled or displacement? Does its speedometer measure speed or velocity?',
    solution: {
      approach: 'Analyze what each instrument actually measures based on their design and function.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about whether these instruments provide directional information.' },
      { level: 2, hint: 'Consider what happens to the odometer reading when you drive in circles.' },
      { level: 3, hint: 'Remember that velocity is a vector quantity requiring both magnitude and direction.' },
    ],
    tags: ["velocity","speed","displacement","distance","measurement","conceptual"],
  },

  {
    id: 'pdf-ch2-p11',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 11',
    concepts: ["velocity","displacement"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 7,
    title: 'Calculating Average Speed vs. Average Velocity Magnitude',
    statement: 'If you divide the total distance traveled on a car trip (as determined by the odometer) by the time for the trip, are you calculating the average speed or the magnitude of the average velocity? Under what circumstances are these two quantities the same?',
    solution: {
      approach: 'Analyze the calculation method and determine when average speed equals the magnitude of average velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider what the odometer measures versus what displacement represents.' },
      { level: 2, hint: 'Think about when the path length equals the straight-line distance.' },
      { level: 3, hint: 'Imagine driving from city A to city B: when would distance equal displacement?' },
    ],
    tags: ["velocity","speed","displacement","distance","average","conceptual"],
  },

  {
    id: 'pdf-ch2-p12',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 12',
    concepts: ["velocity"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 6,
    title: 'Instantaneous Velocity vs. Instantaneous Speed',
    statement: 'How are instantaneous velocity and instantaneous speed related to one another? How do they differ?',
    solution: {
      approach: 'Compare the definitions and properties of instantaneous velocity and instantaneous speed.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about the relationship between any vector and its magnitude.' },
      { level: 2, hint: 'Consider whether these quantities can be negative.' },
      { level: 3, hint: 'Remember that both describe motion at a single instant, not over time.' },
    ],
    tags: ["velocity","speed","instantaneous","vectors","scalars","conceptual"],
  },

  {
    id: 'pdf-ch2-p13',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 13',
    concepts: ["acceleration","velocity"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 8,
    title: 'Constant Speed with Non-zero Acceleration',
    statement: 'Is it possible for speed to be constant while acceleration is not zero? Give an example of such a situation.',
    solution: {
      approach: 'Consider situations where the magnitude of velocity remains constant but the direction changes, requiring acceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about motion in a circle at constant speed.' },
      { level: 2, hint: 'Remember that velocity is a vector - it can change even if speed doesn\'t.' },
      { level: 3, hint: 'Consider what type of acceleration is needed to keep an object moving in a circle.' },
    ],
    tags: ["acceleration","velocity","speed","circular motion","centripetal","conceptual"],
  },

  {
    id: 'pdf-ch2-p14',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 14',
    concepts: ["velocity","acceleration"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 3,
    title: 'Constant Velocity with Non-Zero Acceleration',
    statement: 'Is it possible for velocity to be constant while acceleration is not zero? Explain.',
    solution: {
      approach: 'Analyze the definitions of velocity and acceleration to determine if they can have these characteristics simultaneously.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about the definition of acceleration in terms of velocity change.' },
      { level: 2, hint: 'If velocity doesn\'t change, what does that tell you about acceleration?' },
    ],
    tags: ["definitions","conceptual-understanding","velocity-acceleration-relationship"],
  },

  {
    id: 'pdf-ch2-p15',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 15',
    concepts: ["velocity","acceleration"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 3,
    title: 'Zero Velocity with Non-Zero Acceleration',
    statement: 'Give an example in which velocity is zero yet acceleration is not.',
    solution: {
      approach: 'Identify situations where an object momentarily has zero velocity but is still experiencing acceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about objects that change direction during their motion.' },
      { level: 2, hint: 'Consider what happens at the highest point when you throw a ball upward.' },
    ],
    tags: ["free-fall","projectile-motion","turning-points"],
  },

  {
    id: 'pdf-ch2-p16',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 16',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 4,
    title: 'Direction of Acceleration for Decelerating Train',
    statement: 'If a subway train is moving to the left (has a negative velocity) and then comes to a stop, what is the direction of its acceleration? Is the acceleration positive or negative?',
    givenValues: [
      { symbol: 'v_i', value: 'variable', unit: 'm/s', description: 'initial velocity (negative, moving left)' },
      { symbol: 'v_f', value: 0, unit: 'm/s', description: 'final velocity (at stop)' },
    ],
    unknowns: [
      { symbol: 'a', description: 'acceleration direction and sign', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use the definition of acceleration and analyze the change in velocity to determine the direction.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider how the velocity changes from negative to zero.' },
      { level: 2, hint: 'Acceleration points in the direction of velocity change, not necessarily in the direction of motion.' },
      { level: 3, hint: 'If velocity becomes less negative (closer to zero), the acceleration must be positive.' },
    ],
    tags: ["signs-and-directions","deceleration","one-dimensional-motion"],
  },

  {
    id: 'pdf-ch2-p17',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 17',
    concepts: ["velocity","acceleration"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Signs of Acceleration for Velocity Reduction',
    statement: 'Plus and minus signs are used in one-dimensional motion to indicate direction. What is the sign of an acceleration that reduces the magnitude of a negative velocity? Of a positive velocity?',
    solution: {
      approach: 'Analyze how acceleration affects velocity magnitude in both positive and negative velocity cases.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about what happens to the velocity value when its magnitude decreases.' },
      { level: 2, hint: 'Acceleration that reduces speed always points opposite to the velocity direction.' },
      { level: 3, hint: 'For negative velocity, reducing magnitude means becoming less negative (moving toward zero).' },
    ],
    tags: ["signs-and-directions","deceleration","velocity-magnitude"],
  },

  {
    id: 'pdf-ch2-p18',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 18',
    concepts: ["velocity","displacement","acceleration"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 4,
    title: 'Information Needed for Kinematic Problem Solving',
    statement: 'What information do you need in order to choose which equation or equations to use to solve a problem? Explain.',
    solution: {
      approach: 'Identify the key pieces of information needed to select appropriate kinematic equations.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Start by listing what you know and what you need to find.' },
      { level: 2, hint: 'Consider the five kinematic variables: position, initial velocity, final velocity, acceleration, and time.' },
      { level: 3, hint: 'Choose equations that avoid variables you don\'t know and don\'t need.' },
    ],
    tags: ["problem-solving","kinematic-equations","strategy"],
  },

  {
    id: 'pdf-ch2-p19',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 19',
    concepts: ["velocity","displacement","acceleration"],
    difficulty: 1,
    type: 'conceptual',
    estimatedMinutes: 2,
    title: 'Final Step in Problem Solving',
    statement: 'What is the last thing you should do when solving a problem? Explain.',
    solution: {
      approach: 'Identify the most important final step in the problem-solving process.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about quality control in problem solving.' },
      { level: 2, hint: 'Consider what you should do after getting a numerical result.' },
    ],
    tags: ["problem-solving","reasonableness-check","strategy"],
  },

  {
    id: 'pdf-ch2-p20',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 20',
    concepts: ["acceleration","free-fall"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 3,
    title: 'Acceleration of Rock in Free Fall',
    statement: 'What is the acceleration of a rock thrown straight upward on the way up? At the top of its flight? On the way down?',
    givenValues: [
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'a', description: 'acceleration at different points', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Apply the principle that gravitational acceleration is constant throughout the motion.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about what causes the rock\'s motion to change.' },
      { level: 2, hint: 'Gravity acts continuously throughout the motion.' },
      { level: 3, hint: 'Acceleration doesn\'t depend on the direction of velocity, only on the forces acting.' },
    ],
    tags: ["free-fall","constant-acceleration","gravity"],
  },

  {
    id: 'pdf-ch2-p21',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 21',
    concepts: ["velocity","acceleration","free-fall"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Velocity and Acceleration Analysis for Vertical Motion',
    statement: 'An object that is thrown straight up falls back to Earth. This is one-dimensional motion. (a) When is its velocity zero? (b) Does its velocity change direction? (c) Does the acceleration due to gravity have the same sign on the way up as on the way down?',
    solution: {
      approach: 'Analyze the velocity and acceleration characteristics throughout the vertical motion.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about what happens at the turning point of the motion.' },
      { level: 2, hint: 'Consider how velocity and acceleration can be different from each other.' },
      { level: 3, hint: 'Acceleration depends on forces, while velocity depends on motion direction.' },
    ],
    tags: ["free-fall","projectile-motion","velocity-direction","constant-acceleration"],
  },

  {
    id: 'pdf-ch2-p22',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 22',
    concepts: ["velocity","acceleration","free-fall"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 8,
    title: 'Rock Speed Comparison: Up vs Down Path',
    statement: 'Suppose you throw a rock nearly straight up at a coconut in a palm tree, and the rock misses on the way up but hits the coconut on the way down. Neglecting air resistance, how does the speed of the rock when it hits the coconut on the way down compare with what it would have been if it had hit the coconut on the way up? Is it more likely to dislodge the coconut on the way up or down? Explain.',
    givenValues: [
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'v_{up}', description: 'speed when hitting coconut on way up', unit: 'm/s' },
      { symbol: 'v_{down}', description: 'speed when hitting coconut on way down', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use conservation of energy and kinematic equations to compare speeds at the same height on the way up versus way down.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Think about conservation of energy - what happens to kinetic and potential energy?' },
      { level: 2, hint: 'At the same height, the rock has the same total mechanical energy whether going up or down.' },
      { level: 3, hint: 'Use v² = v₀² - 2gh for upward motion and v² = 2g(h_max - h) for downward motion from the peak.' },
    ],
    tags: ["conservation-of-energy","projectile-motion","free-fall","conceptual-physics"],
  },

  {
    id: 'pdf-ch2-p23',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 23',
    concepts: ["velocity","acceleration","free-fall"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 7,
    title: 'Effect of Air Resistance on Projectile Motion',
    statement: 'If an object is thrown straight up and air resistance is negligible, then its speed when it returns to the starting point is the same as when it was released. If air resistance were not negligible, how would its speed upon return compare with its initial speed? How would the maximum height to which it rises be affected?',
    givenValues: [
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'v_f', description: 'final speed upon return with air resistance', unit: 'm/s' },
      { symbol: 'h_max', description: 'maximum height with air resistance', unit: 'm' },
    ],
    solution: {
      approach: 'Analyze the effects of air resistance on both the upward and downward portions of the trajectory using energy considerations.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider what air resistance does to the mechanical energy of the system.' },
      { level: 2, hint: 'Air resistance always opposes motion, so it does negative work in both directions.' },
      { level: 3, hint: 'Think about energy conservation: initial KE = final KE + energy lost to air resistance + PE at maximum height.' },
    ],
    tags: ["air-resistance","energy-dissipation","free-fall","conceptual-physics"],
  },

  {
    id: 'pdf-ch2-p24',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 24',
    concepts: ["acceleration","free-fall"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Safe Fall Height Comparison: Moon vs Earth',
    statement: 'The severity of a fall depends on your speed when you strike the ground. All factors but the acceleration due to gravity being the same, how many times higher could a safe fall on the Moon be than on Earth (gravitational acceleration on the Moon is about 1/6 that of the Earth)?',
    givenValues: [
      { symbol: 'g_E', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity on Earth' },
      { symbol: 'g_M', value: 1.63, unit: 'm/s²', description: 'acceleration due to gravity on Moon (g_E/6)' },
    ],
    unknowns: [
      { symbol: '\frac{h_M}{h_E}', description: 'ratio of safe fall heights', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use kinematic equations to relate fall height to impact speed, then find the ratio of heights for the same impact speed.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the kinematic equation relating final velocity to height for free fall from rest.' },
      { level: 2, hint: 'Set the impact speeds equal and solve for the ratio of heights.' },
      { level: 3, hint: 'Remember that v² = 2gh for free fall, so if v is the same, then gh must be the same.' },
    ],
    tags: ["free-fall","gravity-comparison","kinematics","moon-physics"],
  },

  {
    id: 'pdf-ch2-p25',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 25',
    concepts: ["velocity","acceleration","free-fall"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Astronaut Jump Height: Moon vs Earth',
    statement: 'How many times higher could an astronaut jump on the Moon than on Earth if his takeoff speed is the same in both locations (gravitational acceleration on the Moon is about 1/6 of on Earth)?',
    givenValues: [
      { symbol: 'g_E', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity on Earth' },
      { symbol: 'g_M', value: 1.63, unit: 'm/s²', description: 'acceleration due to gravity on Moon (g_E/6)' },
      { symbol: 'v_0', value: 'variable', unit: 'm/s', description: 'takeoff speed (same on both)' },
    ],
    unknowns: [
      { symbol: '\frac{h_M}{h_E}', description: 'ratio of jump heights', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use kinematic equations to find maximum height in terms of initial velocity and gravity, then compare the ratios.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'At the peak of the jump, what is the astronaut\'s velocity?' },
      { level: 2, hint: 'Use v² = v₀² - 2gh with final velocity equal to zero.' },
      { level: 3, hint: 'The maximum height is inversely proportional to gravitational acceleration when initial speed is constant.' },
    ],
    tags: ["free-fall","gravity-comparison","kinematics","moon-physics","projectile-motion"],
  },

  {
    id: 'pdf-ch2-p26',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 26',
    concepts: ["position","velocity","acceleration"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 10,
    title: 'Position vs Time Graph Analysis',
    statement: '(a) Explain how you can use the graph of position versus time in Figure 2.52 to describe the change in velocity over time. Identify (b) the time (t₁, t₂, or t₃) at which the instantaneous velocity is greatest, (c) the time at which it is zero, and (d) the time at which it is negative.',
    givenValues: [
      { symbol: 'graph', value: 'variable', unit: 'position vs time', description: 'position versus time graph (Figure 2.52) with points at t₁, t₂, t₃' },
    ],
    unknowns: [
      { symbol: 'v(t)', description: 'velocity as function of time', unit: 'm/s' },
    ],
    solution: {
      approach: 'Analyze the slope of the position-time graph to determine velocity characteristics at different times.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that velocity is the rate of change of position with respect to time.' },
      { level: 2, hint: 'The slope of a position vs time graph gives the instantaneous velocity.' },
      { level: 3, hint: 'Look for the steepest part of the curve for maximum speed, flat parts for zero velocity, and downward slopes for negative velocity.' },
    ],
    tags: ["graphical-analysis","position-time-graphs","velocity","slope-interpretation"],
  },

  {
    id: 'pdf-ch2-p27',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 27',
    concepts: ["position","velocity"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 12,
    title: 'Sketching Velocity from Position Graph',
    statement: '(a) Sketch a graph of velocity versus time corresponding to the graph of position versus time given in Figure 2.53. (b) Identify the time or times (t₁, t₂, etc.) at which the instantaneous velocity is greatest. (c) At which times is it zero? (d) At which times is it negative?',
    givenValues: [
      { symbol: 'graph', value: 'variable', unit: 'position vs time', description: 'position versus time graph (Figure 2.53)' },
    ],
    unknowns: [
      { symbol: 'v(t)', description: 'velocity versus time graph', unit: 'm/s' },
    ],
    solution: {
      approach: 'Convert position-time graph to velocity-time graph by analyzing slopes, then identify key characteristics.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The height of the velocity graph at any time equals the slope of the position graph at that same time.' },
      { level: 2, hint: 'Find points where the position graph is horizontal - these correspond to zero velocity.' },
      { level: 3, hint: 'The steepness of the position curve determines the magnitude of velocity; the direction (up/down) determines the sign.' },
    ],
    tags: ["graphical-analysis","position-time-graphs","velocity-time-graphs","graph-sketching"],
  },

  {
    id: 'pdf-ch2-p28',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 28',
    concepts: ["velocity","acceleration"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 8,
    title: 'Acceleration from Velocity-Time Graph',
    statement: '(a) Explain how you can determine the acceleration over time from a velocity versus time graph such as the one in Figure 2.54. (b) Based on the graph, how does acceleration change over time?',
    givenValues: [
      { symbol: 'graph', value: 'variable', unit: 'velocity vs time', description: 'velocity versus time graph (Figure 2.54)' },
    ],
    unknowns: [
      { symbol: 'a(t)', description: 'acceleration as function of time', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Analyze the relationship between velocity-time graphs and acceleration using the concept of slope.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that acceleration is the rate of change of velocity with respect to time.' },
      { level: 2, hint: 'Just as velocity is the slope of position vs time, acceleration is the slope of velocity vs time.' },
      { level: 3, hint: 'Look at how steep the velocity curve is at different times to determine how acceleration varies.' },
    ],
    tags: ["graphical-analysis","velocity-time-graphs","acceleration","slope-interpretation"],
  },

  {
    id: 'pdf-ch2-p29',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 29',
    concepts: ["velocity","acceleration"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 15,
    title: 'Sketching Acceleration from Velocity Graph',
    statement: '(a) Sketch a graph of acceleration versus time corresponding to the graph of velocity versus time given in Figure 2.55. (b) Identify the time or times (t₁, t₂, etc.) at which the acceleration is greatest. (c) At which times is it zero? (d) At which times is it negative?',
    givenValues: [
      { symbol: 'graph', value: 'variable', unit: 'velocity vs time', description: 'velocity versus time graph (Figure 2.55)' },
    ],
    unknowns: [
      { symbol: 'a(t)', description: 'acceleration versus time graph', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Convert velocity-time graph to acceleration-time graph by analyzing slopes and their variations.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The value of acceleration at any time equals the slope of the velocity graph at that time.' },
      { level: 2, hint: 'Find sections where the velocity graph is horizontal - these correspond to zero acceleration.' },
      { level: 3, hint: 'Curved sections of the velocity graph indicate changing acceleration, while straight sections indicate constant acceleration.' },
    ],
    tags: ["graphical-analysis","velocity-time-graphs","acceleration-time-graphs","graph-sketching","slope-interpretation"],
  },

  {
    id: 'pdf-ch2-p30',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 30',
    concepts: ["velocity","acceleration","position"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 15,
    title: 'Elevator Motion Graph Analysis',
    statement: 'Consider the velocity vs. time graph of a person in an elevator shown in Figure 2.56. Suppose the elevator is initially at rest. It then accelerates for 3 seconds, maintains that velocity for 15 seconds, then decelerates for 5 seconds until it stops. The acceleration for the entire trip is not constant so we cannot use the equations of motion from Motion Equations for Constant Acceleration in One Dimension for the complete trip. (We could, however, use them in the three individual sections where acceleration is a constant.) Sketch graphs of (a) position vs. time and (b) acceleration vs. time for this trip.',
    givenValues: [
      { symbol: 't_1', value: 3, unit: 's', description: 'acceleration time' },
      { symbol: 't_2', value: 15, unit: 's', description: 'constant velocity time' },
      { symbol: 't_3', value: 5, unit: 's', description: 'deceleration time' },
    ],
    unknowns: [
      { symbol: 'x(t)', description: 'position vs. time graph', unit: 'm' },
      { symbol: 'a(t)', description: 'acceleration vs. time graph', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Analyze each phase of motion and determine how position and acceleration change with time based on the given velocity profile.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The slope of the velocity vs. time graph gives acceleration' },
      { level: 2, hint: 'The area under the velocity vs. time graph gives displacement' },
      { level: 3, hint: 'Position changes are cumulative - each phase adds to the previous position' },
    ],
    tags: ["kinematics","graphs","elevator","motion-analysis"],
  },

  {
    id: 'pdf-ch2-p31',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 31',
    concepts: ["position","velocity","acceleration"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 12,
    title: 'Cylinder Rolling on Inclined Plane',
    statement: 'A cylinder is given a push and then rolls up an inclined plane. If the origin is the starting point, sketch the position, velocity, and acceleration of the cylinder vs. time as it goes up and then down the plane.',
    givenValues: [
      { symbol: 'x_0', value: 0, unit: 'm', description: 'initial position at origin' },
    ],
    unknowns: [
      { symbol: 'x(t)', description: 'position vs. time graph', unit: 'm' },
      { symbol: 'v(t)', description: 'velocity vs. time graph', unit: 'm/s' },
      { symbol: 'a(t)', description: 'acceleration vs. time graph', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Analyze the motion in two phases: rolling up the incline and rolling back down, considering constant deceleration up and constant acceleration down.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider the effect of gravity component along the inclined plane' },
      { level: 2, hint: 'The acceleration is constant throughout the motion (ignoring friction)' },
      { level: 3, hint: 'At the turning point, velocity is zero but acceleration is still present' },
    ],
    tags: ["kinematics","inclined-plane","graphs","rolling-motion"],
  },

  {
    id: 'pdf-ch2-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 1',
    concepts: ["displacement"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Path A Distance and Displacement',
    statement: 'Find the following for path A in Figure 2.57: (a) The distance traveled. (b) The magnitude of the displacement from start to finish. (c) The displacement from start to finish.',
    givenValues: [
      { symbol: 'path', value: 'variable', unit: '', description: 'path A from Figure 2.57' },
    ],
    unknowns: [
      { symbol: 'd', description: 'distance traveled', unit: 'm' },
      { symbol: '|\vec{s}|', description: 'magnitude of displacement', unit: 'm' },
      { symbol: '\vec{s}', description: 'displacement vector', unit: 'm' },
    ],
    solution: {
      approach: 'From Figure 2.57, analyze path A to determine total distance and net displacement vector.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Distance is always positive and follows the actual path' },
      { level: 2, hint: 'Displacement is the straight-line distance from start to end' },
      { level: 3, hint: 'Displacement is a vector quantity with both magnitude and direction' },
    ],
    tags: ["displacement","distance","vectors","path-analysis"],
  },

  {
    id: 'pdf-ch2-p5',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 5',
    concepts: ["velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Earth\'s Speed and Velocity Around Sun',
    statement: '(a) Calculate Earth\'s average speed relative to the Sun. (b) What is its average velocity over a period of one year?',
    givenValues: [
      { symbol: 'r', value: 1.50e11, unit: 'm', description: 'Earth\'s orbital radius (1 AU)' },
      { symbol: 'T', value: 1, unit: 'year', description: 'orbital period' },
      { symbol: 'T', value: 3.16e7, unit: 's', description: 'orbital period in seconds' },
    ],
    unknowns: [
      { symbol: 'v_{avg}', description: 'average speed', unit: 'm/s' },
      { symbol: '\vec{v}_{avg}', description: 'average velocity', unit: 'm/s' },
    ],
    solution: {
      approach: 'Calculate average speed using orbital circumference and period, then determine average velocity for complete orbit.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Speed is distance divided by time, velocity is displacement divided by time' },
      { level: 2, hint: 'Earth travels in a circular orbit with circumference 2πr' },
      { level: 3, hint: 'After one complete orbit, Earth returns to its starting position' },
    ],
    tags: ["orbital-motion","average-speed","average-velocity","circular-motion"],
  },

  {
    id: 'pdf-ch2-p6',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 6',
    concepts: ["velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Helicopter Blade Tip Motion',
    statement: 'A helicopter blade spins at exactly 100 revolutions per minute. Its tip is 5.00 m from the center of rotation. (a) Calculate the average speed of the blade tip in the helicopter\'s frame of reference. (b) What is its average velocity over one revolution?',
    givenValues: [
      { symbol: 'f', value: 100, unit: 'rev/min', description: 'rotation frequency' },
      { symbol: 'r', value: 5.00, unit: 'm', description: 'blade tip radius' },
    ],
    unknowns: [
      { symbol: 'v_{avg}', description: 'average speed of blade tip', unit: 'm/s' },
      { symbol: '\vec{v}_{avg}', description: 'average velocity over one revolution', unit: 'm/s' },
    ],
    solution: {
      approach: 'Convert rotation rate to standard units, calculate circumference, then find speed and velocity.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert revolutions per minute to revolutions per second first' },
      { level: 2, hint: 'The blade tip travels the circumference in each revolution' },
      { level: 3, hint: 'After one complete revolution, the blade tip returns to its starting position' },
    ],
    tags: ["circular-motion","rotational-speed","average-velocity","helicopter"],
  },

  {
    id: 'pdf-ch2-p7',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 7',
    concepts: ["velocity","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Continental Drift Rate',
    statement: 'The North American and European continents are moving apart at a rate of about 3 cm/y. At this rate how long will it take them to drift 500 km farther apart than they are at present?',
    givenValues: [
      { symbol: 'v', value: 3, unit: 'cm/y', description: 'rate of continental drift' },
      { symbol: 'd', value: 500, unit: 'km', description: 'additional separation distance' },
    ],
    unknowns: [
      { symbol: 't', description: 'time required for additional separation', unit: 'years' },
    ],
    solution: {
      approach: 'Use the basic kinematic relationship v = d/t, solving for time.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Make sure to convert units consistently before calculating.' },
      { level: 2, hint: 'Use the relationship distance = rate × time, and solve for time.' },
    ],
    tags: ["unit-conversion","average-velocity","geological-time"],
  },

  {
    id: 'pdf-ch2-p8',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 8',
    concepts: ["velocity","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'San Andreas Fault Motion',
    statement: 'Land west of the San Andreas fault in southern California is moving at an average velocity of about 6 cm/y northwest relative to land east of the fault. Los Angeles is west of the fault and may thus someday be at the same latitude as San Francisco, which is east of the fault. How far in the future will this occur if the displacement to be made is 590 km northwest, assuming the motion remains constant?',
    givenValues: [
      { symbol: 'v', value: 6, unit: 'cm/y', description: 'average velocity of land west of fault' },
      { symbol: 'd', value: 590, unit: 'km', description: 'displacement needed' },
    ],
    unknowns: [
      { symbol: 't', description: 'time for Los Angeles to reach San Francisco\'s latitude', unit: 'years' },
    ],
    solution: {
      approach: 'Use the relationship between displacement, velocity, and time.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert the displacement to the same units as the velocity rate.' },
      { level: 2, hint: 'Use t = d/v to find the time required.' },
    ],
    tags: ["unit-conversion","geological-motion","average-velocity"],
  },

  {
    id: 'pdf-ch2-p9',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 9',
    concepts: ["velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Zephyr Train Speed Record',
    statement: 'On May 26, 1934, a streamlined, stainless steel diesel train called the Zephyr set the world\'s nonstop long-distance speed record for trains. Its run from Denver to Chicago took 13 hours, 4 minutes, 58 seconds, and was witnessed by more than a million people along the route. The total distance traveled was 1633.8 km. What was its average speed in km/h and m/s?',
    givenValues: [
      { symbol: 'd', value: 1633.8, unit: 'km', description: 'total distance traveled' },
      { symbol: 't', value: 13.083, unit: 'h', description: 'total travel time (13 h 4 min 58 s)' },
    ],
    unknowns: [
      { symbol: 'v₁', description: 'average speed', unit: 'km/h' },
      { symbol: 'v₂', description: 'average speed', unit: 'm/s' },
    ],
    solution: {
      approach: 'Convert time to consistent units and calculate average speed using v = d/t.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert the time to decimal hours first.' },
      { level: 2, hint: 'To convert km/h to m/s, multiply by 1000 and divide by 3600.' },
      { level: 3, hint: 'Use the conversion factor: 1 km/h = 5/18 m/s ≈ 0.278 m/s' },
    ],
    tags: ["average-speed","unit-conversion","historical-record"],
  },

  {
    id: 'pdf-ch2-p10',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 10',
    concepts: ["velocity"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Moon\'s Orbital Radius Increase',
    statement: 'Tidal friction is slowing the rotation of the Earth. As a result, the orbit of the Moon is increasing in radius at a rate of approximately 4 cm/year. Assuming this to be a constant rate, how many years will pass before the radius of the Moon\'s orbit increases by 1%?',
    givenValues: [
      { symbol: 'v', value: 4, unit: 'cm/year', description: 'rate of orbital radius increase' },
      { symbol: 'r₀', value: 384400, unit: 'km', description: 'current orbital radius of Moon' },
    ],
    unknowns: [
      { symbol: 't', description: 'time for 1% increase in orbital radius', unit: 'years' },
    ],
    solution: {
      approach: 'Calculate 1% of the current orbital radius, then find the time needed using the given rate.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'You\'ll need to look up or estimate the current orbital radius of the Moon (approximately 384,400 km).' },
      { level: 2, hint: 'Calculate what 1% of the orbital radius equals in the same units as the rate.' },
      { level: 3, hint: 'Use t = distance/rate to find the time required.' },
    ],
    tags: ["percentage-calculation","astronomical-motion","unit-conversion"],
  },

  {
    id: 'pdf-ch2-p11',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 11',
    concepts: ["velocity","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Student\'s Trip to University',
    statement: 'A student drove to the university from their home and noted that the odometer reading of their car increased by 12.0 km. The trip took 18.0 min. (a) What was their average speed? (b) If the straight-line distance from their home to the university is 10.3 km in a direction 25° south of east, what was their average velocity? (c) If they returned home by the same path 7 h 30 min after they left, what were their average speed and velocity for the entire trip?',
    givenValues: [
      { symbol: 'd_path', value: 12, unit: 'km', description: 'distance traveled along path' },
      { symbol: 't₁', value: 18, unit: 'min', description: 'time for trip to university' },
      { symbol: 'd_straight', value: 10.3, unit: 'km', description: 'straight-line displacement' },
      { symbol: 't_total', value: 7.5, unit: 'h', description: 'total time for round trip (7 h 30 min)' },
    ],
    unknowns: [
      { symbol: 'v_avg_a', description: 'average speed to university', unit: 'km/h' },
      { symbol: 'v_avg_b', description: 'average velocity to university', unit: 'km/h' },
      { symbol: 'v_avg_c', description: 'average speed for entire trip', unit: 'km/h' },
      { symbol: 'v_vel_c', description: 'average velocity for entire trip', unit: 'km/h' },
    ],
    solution: {
      approach: 'Calculate average speed and velocity separately for each part, distinguishing between distance traveled and displacement.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that speed uses total distance while velocity uses displacement.' },
      { level: 2, hint: 'For a round trip, the total displacement is zero.' },
      { level: 3, hint: 'Convert all times to the same units before calculating.' },
    ],
    tags: ["average-speed","average-velocity","displacement-vs-distance","round-trip"],
  },

  {
    id: 'pdf-ch2-p12',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 12',
    concepts: ["velocity"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Nerve Signal Travel Time',
    statement: 'The speed of propagation of the action potential (an electrical signal) in a nerve cell depends (inversely) on the diameter of the axon (nerve fiber). If the nerve cell connecting the spinal cord to your feet is 1.1 m long, and the nerve impulse speed is 18 m/s, how long does it take for the nerve signal to travel this distance?',
    givenValues: [
      { symbol: 'd', value: 1.1, unit: 'm', description: 'length of nerve cell' },
      { symbol: 'v', value: 18, unit: 'm/s', description: 'nerve impulse speed' },
    ],
    unknowns: [
      { symbol: 't', description: 'time for nerve signal to travel', unit: 's' },
    ],
    solution: {
      approach: 'Use the basic relationship v = d/t to solve for time.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the basic kinematic equation relating distance, speed, and time.' },
      { level: 2, hint: 'Solve for time: t = distance/speed' },
    ],
    tags: ["biological-application","nerve-conduction","basic-kinematics"],
  },

  {
    id: 'pdf-ch2-p13',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 13',
    concepts: ["velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Earth-Moon Distance from Radio Echo',
    statement: 'Conversations with astronauts on the lunar surface were characterized by a kind of echo in which the earthbound person\'s voice was so loud in the astronaut\'s space helmet that it was picked up by the astronaut\'s microphone and transmitted back to Earth. It is reasonable to assume that the echo time equals the time necessary for the radio wave to travel from the Earth to the Moon and back (that is, neglecting any time delays in the electronic equipment). Calculate the distance from Earth to the Moon given that the echo time was 2.56 s and that radio waves travel at the speed of light.',
    givenValues: [
      { symbol: 't_echo', value: 2.56, unit: 's', description: 'echo time (round trip)' },
      { symbol: 'c', value: 300000000, unit: 'm/s', description: 'speed of light' },
    ],
    unknowns: [
      { symbol: 'd', description: 'distance from Earth to Moon', unit: 'm' },
    ],
    solution: {
      approach: 'The echo time is for a round trip, so divide by 2 to get one-way travel time, then use d = vt.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The echo time includes the trip from Earth to Moon and back to Earth.' },
      { level: 2, hint: 'Divide the echo time by 2 to get the one-way travel time.' },
      { level: 3, hint: 'Use d = vt where v is the speed of light and t is the one-way time.' },
    ],
    tags: ["space-communication","speed-of-light","round-trip-time"],
  },

  {
    id: 'pdf-ch2-p14',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 14',
    concepts: ["velocity","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Football Quarterback Motion Analysis',
    statement: 'A football quarterback runs 15.0 m straight down the playing field in 2.50 s. He is then hit and pushed 3.00 m straight backward in 1.75 s. He breaks the tackle and runs straight forward another 21.0 m in 5.20 s. Calculate his average velocity (a) for each of the three intervals and (b) for the entire motion.',
    givenValues: [
      { symbol: 'd₁', value: 15, unit: 'm', description: 'displacement in first interval (forward)' },
      { symbol: 't₁', value: 2.5, unit: 's', description: 'time for first interval' },
      { symbol: 'd₂', value: -3, unit: 'm', description: 'displacement in second interval (backward)' },
      { symbol: 't₂', value: 1.75, unit: 's', description: 'time for second interval' },
      { symbol: 'd₃', value: 21, unit: 'm', description: 'displacement in third interval (forward)' },
      { symbol: 't₃', value: 5.2, unit: 's', description: 'time for third interval' },
    ],
    unknowns: [
      { symbol: 'v₁', description: 'average velocity for first interval', unit: 'm/s' },
      { symbol: 'v₂', description: 'average velocity for second interval', unit: 'm/s' },
      { symbol: 'v₃', description: 'average velocity for third interval', unit: 'm/s' },
      { symbol: 'v_total', description: 'average velocity for entire motion', unit: 'm/s' },
    ],
    solution: {
      approach: 'Calculate average velocity for each interval using v = d/t, then find overall average velocity using total displacement and total time.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Define a positive direction (forward) and use negative values for backward motion.' },
      { level: 2, hint: 'For each interval, use v = displacement/time.' },
      { level: 3, hint: 'For the total average velocity, use the total displacement and total time, not the average of the individual velocities.' },
    ],
    tags: ["average-velocity","multi-interval-motion","vector-direction","sports-physics"],
  },

  {
    id: 'pdf-ch2-p15',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 15',
    concepts: ["velocity","displacement"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Electron Orbital Motion in Hydrogen Atom',
    statement: 'The planetary model of the atom pictures electrons orbiting the atomic nucleus much as planets orbit the Sun. In this model you can view hydrogen, the simplest atom, as having a single electron in a circular orbit 1.06 × 10^(-10) m in diameter. (a) If the average speed of the electron in this orbit is known to be 2.20 × 10^6 m/s, calculate the number of revolutions per second it makes about the nucleus. (b) What is the electron\'s average velocity per revolution?',
    givenValues: [
      { symbol: 'd', value: 1.06e-10, unit: 'm', description: 'diameter of electron orbit' },
      { symbol: 'v', value: 2.20e6, unit: 'm/s', description: 'average speed of electron' },
    ],
    unknowns: [
      { symbol: 'f', description: 'frequency (revolutions per second)', unit: 'rev/s' },
      { symbol: 'v_avg', description: 'average velocity per revolution', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use circular motion relationships. For part (a), find the circumference and use v = distance/time. For part (b), recognize that average velocity over a complete revolution is zero since it\'s a closed path.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Remember that for circular motion, the circumference is the distance traveled in one revolution.' },
      { level: 2, hint: 'Average velocity is displacement divided by time, not distance divided by time.' },
    ],
    tags: ["circular-motion","atomic-model","frequency"],
  },

  {
    id: 'pdf-ch2-p16',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 16',
    concepts: ["acceleration","velocity"],
    difficulty: 1,
    type: 'calculation',
    estimatedMinutes: 3,
    title: 'Cheetah Acceleration',
    statement: 'A cheetah can accelerate from rest to a speed of 30.0 m/s in 7.00 s. What is its acceleration?',
    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'initial velocity (from rest)' },
      { symbol: 'v_f', value: 30.0, unit: 'm/s', description: 'final velocity' },
      { symbol: 't', value: 7.00, unit: 's', description: 'time interval' },
    ],
    unknowns: [
      { symbol: 'a', description: 'acceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use the definition of acceleration: a = (v_f - v_0)/t',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the basic definition of acceleration as change in velocity over time.' },
    ],
    tags: ["basic-acceleration","animals","motion-from-rest"],
  },

  {
    id: 'pdf-ch2-p17',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 17',
    concepts: ["acceleration"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Dr. Stapp\'s Rocket Sled Experiment',
    statement: 'Dr. John Paul Stapp was U.S. Air Force officer who studied the effects of extreme deceleration on the human body. On December 10, 1954, Stapp rode a rocket sled, accelerating from rest to a top speed of 282 m/s (1015 km/h) in 5.00 s, and was brought jarringly back to rest in only 1.40 s! Calculate his (a) acceleration and (b) deceleration. Express each in multiples of g by taking its ratio to the acceleration of gravity.',
    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'initial velocity (from rest)' },
      { symbol: 'v_max', value: 282, unit: 'm/s', description: 'maximum velocity' },
      { symbol: 't_1', value: 5.00, unit: 's', description: 'acceleration time' },
      { symbol: 't_2', value: 1.40, unit: 's', description: 'deceleration time' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'a_1', description: 'acceleration during speed-up phase', unit: 'm/s²' },
      { symbol: 'a_2', description: 'acceleration during deceleration phase', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Calculate acceleration and deceleration separately using a = Δv/Δt, then express as multiples of g',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Calculate the acceleration and deceleration phases separately.' },
      { level: 2, hint: 'Remember that deceleration is negative acceleration.' },
    ],
    tags: ["extreme-acceleration","human-factors","g-forces"],
  },

  {
    id: 'pdf-ch2-p18',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 18',
    concepts: ["acceleration","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Car Backing and Braking',
    statement: 'A commuter backs her car out of her garage with an acceleration of 1.40 m/s². (a) How long does it take her to reach a speed of 2.00 m/s? (b) If she then brakes to a stop in 0.800 s, what is her deceleration?',
    givenValues: [
      { symbol: 'a_1', value: 1.40, unit: 'm/s²', description: 'acceleration while backing' },
      { symbol: 'v', value: 2.00, unit: 'm/s', description: 'final speed while backing' },
      { symbol: 't_2', value: 0.800, unit: 's', description: 'braking time' },
    ],
    unknowns: [
      { symbol: 't_1', description: 'time to reach 2.00 m/s', unit: 's' },
      { symbol: 'a_2', description: 'deceleration during braking', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use v = v_0 + at for both parts, solving for time in part (a) and acceleration in part (b)',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For part (a), the car starts from rest and accelerates to 2.00 m/s.' },
      { level: 2, hint: 'For part (b), the initial velocity is 2.00 m/s and final velocity is 0.' },
    ],
    tags: ["everyday-motion","braking","two-phase-motion"],
  },

  {
    id: 'pdf-ch2-p19',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 19',
    concepts: ["acceleration","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'ICBM Acceleration',
    statement: 'Assume that an intercontinental ballistic missile goes from rest to a suborbital speed of 6.50 km/s in 60.0 s (the actual speed and time are classified). What is its average acceleration in m/s² and in multiples of g?',
    givenValues: [
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'initial velocity (from rest)' },
      { symbol: 'v_f', value: 6500, unit: 'm/s', description: 'final velocity (6.50 km/s converted)' },
      { symbol: 't', value: 60.0, unit: 's', description: 'time interval' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'a', description: 'average acceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Convert units and use a = (v_f - v_0)/t, then express as multiple of g',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Don\'t forget to convert km/s to m/s.' },
      { level: 2, hint: 'Use the basic acceleration formula and then divide by g to get multiples of gravity.' },
    ],
    tags: ["missiles","high-acceleration","unit-conversion"],
  },

  {
    id: 'pdf-ch2-p20',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 20',
    concepts: ["acceleration","velocity","position"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Olympic Sprinter Acceleration',
    statement: 'An Olympic-class sprinter starts a race with an acceleration of 4.50 m/s². (a) What is her speed 2.40 s later? (b) Sketch a graph of her position vs. time for this period.',
    givenValues: [
      { symbol: 'a', value: 4.50, unit: 'm/s²', description: 'acceleration' },
      { symbol: 't', value: 2.40, unit: 's', description: 'time' },
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'initial velocity (starts from rest)' },
    ],
    unknowns: [
      { symbol: 'v', description: 'final velocity', unit: 'm/s' },
      { symbol: 'x(t)', description: 'position as function of time', unit: 'm' },
    ],
    solution: {
      approach: 'Use kinematic equations: v = v_0 + at for velocity and x = x_0 + v_0*t + ½at² for position',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The sprinter starts from rest, so initial velocity is zero.' },
      { level: 2, hint: 'For constant acceleration from rest, position varies as t².' },
    ],
    tags: ["sports","kinematics","graphing","parabolic-motion"],
  },

  {
    id: 'pdf-ch2-p21',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 21',
    concepts: ["acceleration","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Baseball Caught in Mitt',
    statement: 'A well-thrown ball is caught in a well-padded mitt. If the deceleration of the ball is 2.10e4 m/s², and 1.85 ms elapses from the time the ball first touches the mitt until it stops, what was the initial velocity of the ball?',
    givenValues: [
      { symbol: 'a', value: -2.10e4, unit: 'm/s²', description: 'deceleration (negative acceleration)' },
      { symbol: 't', value: 1.85e-3, unit: 's', description: 'time to stop (1.85 ms converted)' },
      { symbol: 'v_f', value: 0, unit: 'm/s', description: 'final velocity (ball stops)' },
    ],
    unknowns: [
      { symbol: 'v_0', description: 'initial velocity of the ball', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use v_f = v_0 + at and solve for v_0',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert milliseconds to seconds before calculating.' },
      { level: 2, hint: 'The deceleration is negative, so be careful with signs when solving for initial velocity.' },
    ],
    tags: ["sports","deceleration","unit-conversion","collision"],
  },

  {
    id: 'pdf-ch2-p22',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 22',
    concepts: ["acceleration","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Bullet Muzzle Velocity',
    statement: 'A bullet in a gun is accelerated from the firing chamber to the end of the barrel at an average rate of 6.20e5 m/s² for 8.10e-4 s. What is its muzzle velocity (that is, its final velocity)?',
    givenValues: [
      { symbol: 'a', value: 6.20e5, unit: 'm/s²', description: 'average acceleration' },
      { symbol: 't', value: 8.10e-4, unit: 's', description: 'time in barrel' },
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'initial velocity (starts from rest)' },
    ],
    unknowns: [
      { symbol: 'v_f', description: 'muzzle velocity (final velocity)', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use v_f = v_0 + at with v_0 = 0',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The bullet starts from rest in the firing chamber.' },
      { level: 2, hint: 'Use the basic equation v = v₀ + at with v₀ = 0.' },
    ],
    tags: ["ballistics","firearms","high-acceleration","scientific-notation"],
  },

  {
    id: 'pdf-ch2-p23',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 23',
    concepts: ["velocity","acceleration"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Light-Rail Train Acceleration and Deceleration',
    statement: '(a) A light-rail commuter train accelerates at a rate of 1.35 m/s². How long does it take to reach its top speed of 80.0 km/h, starting from rest? (b) The same train ordinarily decelerates at a rate of 1.65 m/s². How long does it take to come to a stop from its top speed? (c) In emergencies the train can decelerate more rapidly, coming to rest from 80.0 km/h in 8.30 s. What is its emergency deceleration in m/s²?',
    givenValues: [
      { symbol: 'a₁', value: 1.35, unit: 'm/s²', description: 'acceleration rate' },
      { symbol: 'v_top', value: 80, unit: 'km/h', description: 'top speed' },
      { symbol: 'a₂', value: -1.65, unit: 'm/s²', description: 'normal deceleration rate' },
      { symbol: 't_emergency', value: 8.3, unit: 's', description: 'emergency stopping time' },
      { symbol: 'v₀', value: 0, unit: 'm/s', description: 'initial velocity (rest)' },
    ],
    unknowns: [
      { symbol: 't₁', description: 'time to reach top speed', unit: 's' },
      { symbol: 't₂', description: 'time to stop normally', unit: 's' },
      { symbol: 'a_emergency', description: 'emergency deceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use kinematic equation v = v₀ + at for each part',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert km/h to m/s by multiplying by 1000/3600' },
      { level: 2, hint: 'Use v = v₀ + at for constant acceleration' },
      { level: 3, hint: 'Deceleration is negative acceleration' },
    ],
    tags: ["acceleration","unit-conversion","multi-part"],
  },

  {
    id: 'pdf-ch2-p24',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 24',
    concepts: ["acceleration","displacement","velocity"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Car Acceleration on Freeway Entry',
    statement: 'While entering a freeway, a car accelerates from rest at a rate of 2.40 m/s² for 12.0 s. (a) Draw a sketch of the situation. (b) List the knowns in this problem. (c) How far does the car travel in those 12.0 s? To solve this part, first identify the unknown, and then discuss how you chose the appropriate equation to solve for it. After choosing the equation, show your steps in solving for the unknown, check your units, and discuss whether the answer is reasonable. (d) What is the car\'s final velocity? Solve for this unknown in the same manner as in part (c), showing all steps explicitly.',
    givenValues: [
      { symbol: 'v₀', value: 0, unit: 'm/s', description: 'initial velocity (rest)' },
      { symbol: 'a', value: 2.4, unit: 'm/s²', description: 'acceleration' },
      { symbol: 't', value: 12, unit: 's', description: 'time interval' },
    ],
    unknowns: [
      { symbol: 'x', description: 'distance traveled', unit: 'm' },
      { symbol: 'v', description: 'final velocity', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations for constant acceleration',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For distance with constant acceleration from rest, use x = ½at²' },
      { level: 2, hint: 'For final velocity with constant acceleration, use v = v₀ + at' },
      { level: 3, hint: 'Always check units to verify your equation choice is correct' },
    ],
    tags: ["acceleration","kinematics","problem-solving-method"],
  },

  {
    id: 'pdf-ch2-p25',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 25',
    concepts: ["acceleration","displacement","velocity"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Runner Deceleration Analysis',
    statement: 'At the end of a race, a runner decelerates from a velocity of 9.00 m/s at a rate of 2.00 m/s². (a) How far does she travel in the next 5.00 s? (b) What is her final velocity? (c) Evaluate the result. Does it make sense?',
    givenValues: [
      { symbol: 'v₀', value: 9, unit: 'm/s', description: 'initial velocity' },
      { symbol: 'a', value: -2, unit: 'm/s²', description: 'deceleration' },
      { symbol: 't', value: 5, unit: 's', description: 'time interval' },
    ],
    unknowns: [
      { symbol: 'x', description: 'distance traveled', unit: 'm' },
      { symbol: 'v', description: 'final velocity', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations for constant acceleration (deceleration)',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use x = v₀t + ½at² for distance and v = v₀ + at for final velocity' },
      { level: 2, hint: 'Deceleration is negative acceleration' },
      { level: 3, hint: 'Check if the runner stops before the given time using v = v₀ + at = 0' },
    ],
    tags: ["deceleration","physical-reasonableness","kinematics"],
  },

  {
    id: 'pdf-ch2-p26',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 26',
    concepts: ["acceleration","displacement","velocity"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Blood Acceleration in Heart Ventricle',
    statement: 'Professional Application: Blood is accelerated from rest to 30.0 cm/s in a distance of 1.80 cm by the left ventricle of the heart. (a) Make a sketch of the situation. (b) List the knowns in this problem. (c) How long does the acceleration take? To solve this part, first identify the unknown, and then discuss how you chose the appropriate equation to solve for it. After choosing the equation, show your steps in solving for the unknown, checking your units. (d) Is the answer reasonable when compared with the time for a heartbeat?',
    givenValues: [
      { symbol: 'v₀', value: 0, unit: 'cm/s', description: 'initial velocity (rest)' },
      { symbol: 'v', value: 30, unit: 'cm/s', description: 'final velocity' },
      { symbol: 'x', value: 1.8, unit: 'cm', description: 'distance' },
    ],
    unknowns: [
      { symbol: 't', description: 'time for acceleration', unit: 's' },
    ],
    solution: {
      approach: 'Use kinematic equations to find time, then evaluate reasonableness',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the equation x = (v₀ + v)t/2 when you know initial velocity, final velocity, and distance' },
      { level: 2, hint: 'A complete heartbeat cycle takes about 0.8 seconds' },
      { level: 3, hint: 'The acceleration phase is only part of the complete heartbeat cycle' },
    ],
    tags: ["biological-application","kinematics","reasonableness-check"],
  },

  {
    id: 'pdf-ch2-p27',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 27',
    concepts: ["acceleration","displacement","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Hockey Puck Slap Shot Distance',
    statement: 'In a slap shot, a hockey player accelerates the puck from a velocity of 8.00 m/s to 40.0 m/s in the same direction. If this shot takes 0.0210 s, calculate the distance over which the puck accelerates.',
    givenValues: [
      { symbol: 'v₀', value: 8, unit: 'm/s', description: 'initial velocity' },
      { symbol: 'v', value: 40, unit: 'm/s', description: 'final velocity' },
      { symbol: 't', value: 0.021, unit: 's', description: 'time interval' },
    ],
    unknowns: [
      { symbol: 'x', description: 'distance over which puck accelerates', unit: 'm' },
    ],
    solution: {
      approach: 'Use kinematic equation relating distance to velocities and time',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use x = (v₀ + v)t/2 when you know both velocities and time' },
      { level: 2, hint: 'This equation gives the average velocity multiplied by time' },
      { level: 3, hint: 'The distance is quite small, which makes sense for contact time with a hockey stick' },
    ],
    tags: ["sports-physics","kinematics","average-velocity"],
  },

  {
    id: 'pdf-ch2-p28',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 28',
    concepts: ["acceleration","displacement","velocity"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Motorcycle Acceleration Analysis',
    statement: 'A powerful motorcycle can accelerate from rest to 26.8 m/s (100 km/h) in only 3.90 s. (a) What is its average acceleration? (b) How far does it travel in that time?',
    givenValues: [
      { symbol: 'v₀', value: 0, unit: 'm/s', description: 'initial velocity (rest)' },
      { symbol: 'v', value: 26.8, unit: 'm/s', description: 'final velocity' },
      { symbol: 't', value: 3.9, unit: 's', description: 'time interval' },
    ],
    unknowns: [
      { symbol: 'a', description: 'average acceleration', unit: 'm/s²' },
      { symbol: 'x', description: 'distance traveled', unit: 'm' },
    ],
    solution: {
      approach: 'Use basic kinematic equations for constant acceleration',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use a = (v - v₀)/t for acceleration' },
      { level: 2, hint: 'For distance from rest, use x = ½at² or x = (v₀ + v)t/2' },
      { level: 3, hint: 'Check that 100 km/h equals 26.8 m/s' },
    ],
    tags: ["acceleration","motorcycle","kinematics"],
  },

  {
    id: 'pdf-ch2-p29',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 29',
    concepts: ["acceleration","velocity","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Freight Train Acceleration and Deceleration',
    statement: 'Freight trains can produce only relatively small accelerations and decelerations. (a) What is the final velocity of a freight train that accelerates at a rate of 0.0500 m/s² for 8.00 min, starting with an initial velocity of 4.00 m/s? (b) If the train can slow down at a rate of 0.550 m/s², how long will it take to come to a stop from this velocity? (c) How far will it travel in each case?',
    givenValues: [
      { symbol: 'v₀', value: 4, unit: 'm/s', description: 'initial velocity' },
      { symbol: 'a₁', value: 0.05, unit: 'm/s²', description: 'acceleration rate' },
      { symbol: 't₁', value: 8, unit: 'min', description: 'acceleration time' },
      { symbol: 'a₂', value: -0.55, unit: 'm/s²', description: 'deceleration rate' },
    ],
    unknowns: [
      { symbol: 'v₁', description: 'velocity after acceleration', unit: 'm/s' },
      { symbol: 't₂', description: 'time to stop', unit: 's' },
      { symbol: 'x₁', description: 'distance during acceleration', unit: 'm' },
      { symbol: 'x₂', description: 'distance during deceleration', unit: 'm' },
    ],
    solution: {
      approach: 'Apply kinematic equations for each phase of motion',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Convert minutes to seconds: 1 min = 60 s' },
      { level: 2, hint: 'For each phase, identify the initial conditions and apply appropriate kinematic equations' },
      { level: 3, hint: 'The final velocity of part (a) becomes the initial velocity for part (b)' },
    ],
    tags: ["trains","multi-phase-motion","unit-conversion","kinematics"],
  },

  {
    id: 'pdf-ch2-p30',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 30',
    concepts: ["acceleration","velocity","displacement"],
    difficulty: 2,
    type: 'multi-step',
    estimatedMinutes: 6,
    title: 'Fireworks Shell Launch Acceleration',
    statement: 'A fireworks shell is accelerated from rest to a velocity of 65.0 m/s over a distance of 0.250 m. (a) How long did the acceleration last? (b) Calculate the acceleration.',
    givenValues: [
      { symbol: 'v₀', value: 0, unit: 'm/s', description: 'initial velocity (rest)' },
      { symbol: 'v', value: 65, unit: 'm/s', description: 'final velocity' },
      { symbol: 'x', value: 0.25, unit: 'm', description: 'distance' },
    ],
    unknowns: [
      { symbol: 't', description: 'time for acceleration', unit: 's' },
      { symbol: 'a', description: 'acceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use kinematic equations to find time and acceleration',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use v² = v₀² + 2ax when you know both velocities and distance' },
      { level: 2, hint: 'Once you have acceleration, use v = v₀ + at to find time' },
      { level: 3, hint: 'The very high acceleration and short time make sense for an explosive launch' },
    ],
    tags: ["explosives","high-acceleration","kinematics"],
  },

  {
    id: 'pdf-ch2-p31',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 31',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 8,
    title: 'Swan Taking Off from Water',
    statement: 'A swan on a lake gets airborne by flapping its wings and running on top of the water. (a) If the swan must reach a velocity of 6.00 m/s to take off and it accelerates from rest at an average rate of 0.350 m/s², how far will it travel before becoming airborne? (b) How long does this take?',
    givenValues: [
      { symbol: 'v_f', value: 6, unit: 'm/s', description: 'final velocity needed for takeoff' },
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'initial velocity (starts from rest)' },
      { symbol: 'a', value: 0.35, unit: 'm/s²', description: 'average acceleration' },
    ],
    unknowns: [
      { symbol: 'd', description: 'distance traveled', unit: 'm' },
      { symbol: 't', description: 'time taken', unit: 's' },
    ],
    solution: {
      approach: 'Use kinematic equations to find distance and time for constant acceleration from rest.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The swan starts from rest, so initial velocity is zero.' },
      { level: 2, hint: 'Use v² = v₀² + 2as for distance and v = v₀ + at for time.' },
      { level: 3, hint: 'Check your answer by using s = v₀t + ½at² with the time found.' },
    ],
    tags: ["kinematics","constant-acceleration","motion-from-rest"],
  },

  {
    id: 'pdf-ch2-p32',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 32',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Woodpecker Head Deceleration',
    statement: 'A woodpecker\'s brain is specially protected from large decelerations by tendon-like attachments inside the skull. While pecking on a tree, the woodpecker\'s head comes to a stop from an initial velocity of 0.600 m/s in a distance of only 2.00 mm. (a) Find the acceleration in m/s² and in multiples of g. (b) Calculate the stopping time. (c) The tendons cradling the brain stretch, making its stopping distance 4.50 mm (greater than the head and, hence, less deceleration of the brain). What is the brain\'s deceleration, expressed in multiples of g?',
    givenValues: [
      { symbol: 'v_0', value: 0.6, unit: 'm/s', description: 'initial velocity of head' },
      { symbol: 'v_f', value: 0, unit: 'm/s', description: 'final velocity (stops)' },
      { symbol: 'd_{head}', value: 0.002, unit: 'm', description: 'stopping distance of head' },
      { symbol: 'd_{brain}', value: 0.0045, unit: 'm', description: 'stopping distance of brain' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'a_{head}', description: 'acceleration of head', unit: 'm/s²' },
      { symbol: 't', description: 'stopping time', unit: 's' },
      { symbol: 'a_{brain}', description: 'acceleration of brain', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use kinematic equations to find accelerations and time, then express accelerations as multiples of g.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The negative sign indicates deceleration (acceleration opposite to motion).' },
      { level: 2, hint: 'Convert mm to m: 2.00 mm = 0.00200 m, 4.50 mm = 0.00450 m' },
      { level: 3, hint: 'To express in multiples of g, divide the acceleration by 9.80 m/s².' },
    ],
    tags: ["kinematics","deceleration","biological-application","unit-conversion"],
  },

  {
    id: 'pdf-ch2-p33',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 33',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Football Player Collision with Goalpost',
    statement: 'An unwary football player collides with a padded goalpost while running at a velocity of 7.50 m/s and comes to a full stop after compressing the padding and his body 0.350 m. (a) What is his deceleration? (b) How long does the collision last?',
    givenValues: [
      { symbol: 'v_0', value: 7.5, unit: 'm/s', description: 'initial velocity' },
      { symbol: 'v_f', value: 0, unit: 'm/s', description: 'final velocity (stops)' },
      { symbol: 'd', value: 0.35, unit: 'm', description: 'stopping distance' },
    ],
    unknowns: [
      { symbol: 'a', description: 'deceleration', unit: 'm/s²' },
      { symbol: 't', description: 'collision time', unit: 's' },
    ],
    solution: {
      approach: 'Use kinematic equations to find deceleration and collision time.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The player comes to a complete stop, so final velocity is zero.' },
      { level: 2, hint: 'Use v² = v₀² + 2as first to find acceleration.' },
      { level: 3, hint: 'The negative acceleration indicates deceleration (slowing down).' },
    ],
    tags: ["kinematics","collision","deceleration","sports-physics"],
  },

  {
    id: 'pdf-ch2-p34',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 34',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'WWII Pilot Survival Deceleration',
    statement: 'In World War II, there were several reported cases of airmen who jumped from their flaming airplanes with no parachute to escape certain death. Some fell about 20,000 feet (6000 m), and some of them survived, with few life-threatening injuries. For these lucky pilots, the tree branches and snow drifts on the ground allowed their deceleration to be relatively small. If we assume that a pilot\'s speed upon impact was 123 mph (54 m/s), then what was his deceleration? Assume that the trees and snow stopped him over a distance of 3.0 m.',
    givenValues: [
      { symbol: 'v_0', value: 54, unit: 'm/s', description: 'impact velocity' },
      { symbol: 'v_f', value: 0, unit: 'm/s', description: 'final velocity (stops)' },
      { symbol: 'd', value: 3, unit: 'm', description: 'stopping distance' },
    ],
    unknowns: [
      { symbol: 'a', description: 'deceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use the kinematic equation v_f² = v_0² + 2ad to find deceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The pilot comes to a complete stop, so final velocity is zero.' },
      { level: 2, hint: 'The given speed is already converted to m/s for you.' },
      { level: 3, hint: 'Compare this to g = 9.8 m/s² to see how many g\'s this represents.' },
    ],
    tags: ["kinematics","deceleration","historical-application","extreme-conditions"],
  },

  {
    id: 'pdf-ch2-p35',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 35',
    concepts: ["free-fall","velocity","acceleration","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Squirrel Falling from Tree',
    statement: 'Consider a grey squirrel falling out of a tree to the ground. (a) If we ignore air resistance in this case (only for the sake of this problem), determine a squirrel\'s velocity just before hitting the ground, assuming it fell from a height of 3.0 m. (b) If the squirrel stops in a distance of 2.0 cm through bending its limbs, compare its deceleration with that of the airman in the previous problem.',
    givenValues: [
      { symbol: 'h', value: 3, unit: 'm', description: 'fall height' },
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity' },
      { symbol: 'd_{stop}', value: 0.02, unit: 'm', description: 'stopping distance' },
      { symbol: 'a_{pilot}', value: -486, unit: 'm/s²', description: 'pilot\'s deceleration from previous problem' },
    ],
    unknowns: [
      { symbol: 'v', description: 'velocity just before hitting ground', unit: 'm/s' },
      { symbol: 'a_{squirrel}', description: 'squirrel\'s deceleration', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use free fall kinematics for part (a), then deceleration kinematics for part (b), and compare results.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For free fall, use v² = 2gh when starting from rest.' },
      { level: 2, hint: 'Convert 2.0 cm to meters: 2.0 cm = 0.020 m' },
      { level: 3, hint: 'To compare accelerations, find the ratio of their magnitudes.' },
    ],
    tags: ["free-fall","deceleration","comparison","biological-application"],
  },

  {
    id: 'pdf-ch2-p36',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 36',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Express Train Through Station',
    statement: 'An express train passes through a station. It enters with an initial velocity of 22.0 m/s and decelerates at a rate of 0.150 m/s² as it goes through. The station is 210 m long. (a) How long did the nose of the train stay in the station? (b) How fast is it going when the nose leaves the station? (c) If the train is 130 m long, when does the end of the train leave the station? (d) What is the velocity of the end of the train as it leaves?',
    givenValues: [
      { symbol: 'v_0', value: 22, unit: 'm/s', description: 'initial velocity entering station' },
      { symbol: 'a', value: -0.15, unit: 'm/s²', description: 'deceleration rate' },
      { symbol: 'L_{station}', value: 210, unit: 'm', description: 'length of station' },
      { symbol: 'L_{train}', value: 130, unit: 'm', description: 'length of train' },
    ],
    unknowns: [
      { symbol: 't_a', description: 'time for nose to traverse station', unit: 's' },
      { symbol: 'v_b', description: 'velocity when nose leaves station', unit: 'm/s' },
      { symbol: 't_c', description: 'time for end of train to leave station', unit: 's' },
      { symbol: 'v_d', description: 'velocity when end leaves station', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations to track the motion of both the nose and end of the train through the station.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The nose travels 210 m to cross the station, but the end travels 210 + 130 = 340 m.' },
      { level: 2, hint: 'Use the quadratic formula when you get a quadratic equation from s = v₀t + ½at².' },
      { level: 3, hint: 'Take the smaller positive root from the quadratic formula for realistic times.' },
    ],
    tags: ["kinematics","quadratic-equation","train-motion","multi-part"],
  },

  {
    id: 'pdf-ch2-p37',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 37',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Dragster Performance Analysis',
    statement: 'Dragsters can actually reach a top speed of 145 m/s in only 4.45 s—considerably less time than given in Example 2.10 and Example 2.11. (a) Calculate the average acceleration for such a dragster. (b) Find the final velocity of this dragster starting from rest and accelerating at the rate found in (a) for 402 m (a quarter mile) without using any information on time. (c) Why is the final velocity greater than that used to find the average acceleration? Hint: Consider whether the assumption of constant acceleration is valid for a dragster. If not, discuss whether the acceleration would be greater at the beginning or end of the run and what effect that would have on the final velocity.',
    givenValues: [
      { symbol: 'v_{top}', value: 145, unit: 'm/s', description: 'top speed reached' },
      { symbol: 't', value: 4.45, unit: 's', description: 'time to reach top speed' },
      { symbol: 'v_0', value: 0, unit: 'm/s', description: 'initial velocity (starts from rest)' },
      { symbol: 'd', value: 402, unit: 'm', description: 'quarter mile distance' },
    ],
    unknowns: [
      { symbol: 'a_{avg}', description: 'average acceleration', unit: 'm/s²' },
      { symbol: 'v_{final}', description: 'final velocity after 402 m', unit: 'm/s' },
    ],
    solution: {
      approach: 'Calculate average acceleration, then use it to find velocity after traveling quarter mile. Analyze the physics of non-constant acceleration.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For part (a), use v = v₀ + at with the given time and final speed.' },
      { level: 2, hint: 'For part (b), use v² = v₀² + 2as with the distance, ignoring the time information.' },
      { level: 3, hint: 'Consider how tire grip and air resistance change during the acceleration phase.' },
    ],
    tags: ["kinematics","average-acceleration","automotive","conceptual-analysis"],
  },

  {
    id: 'pdf-ch2-p38',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 38',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Bicycle Racer Sprint to Victory',
    statement: 'A bicycle racer sprints at the end of a race to clinch a victory. The racer has an initial velocity of 11.5 m/s and accelerates at the rate of 0.500 m/s² for 7.00 s. (a) What is his final velocity? (b) The racer continues at this velocity to the finish line. If he was 300 m from the finish line when he started to accelerate, how much time did he save? (c) One other racer was 5.00 m ahead when the winner started to accelerate, but he was unable to accelerate, and traveled at 11.8 m/s until the finish line. How far ahead of him (in meters and in seconds) did the winner finish?',
    givenValues: [
      { symbol: 'v_0', value: 11.5, unit: 'm/s', description: 'initial velocity of winner' },
      { symbol: 'a', value: 0.5, unit: 'm/s²', description: 'acceleration during sprint' },
      { symbol: 't_{accel}', value: 7, unit: 's', description: 'acceleration time' },
      { symbol: 'd_{total}', value: 300, unit: 'm', description: 'distance from start of sprint to finish' },
      { symbol: 'd_{ahead}', value: 5, unit: 'm', description: 'other racer\'s initial lead' },
      { symbol: 'v_{other}', value: 11.8, unit: 'm/s', description: 'other racer\'s constant velocity' },
    ],
    unknowns: [
      { symbol: 'v_f', description: 'final velocity after acceleration', unit: 'm/s' },
      { symbol: 'Δt', description: 'time saved', unit: 's' },
      { symbol: 'Δd', description: 'winning margin in distance', unit: 'm' },
      { symbol: 'Δt_{win}', description: 'winning margin in time', unit: 's' },
    ],
    solution: {
      approach: 'Find final velocity, calculate time savings, then analyze the race between winner and other racer.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Break the winner\'s motion into two phases: acceleration phase and constant velocity phase.' },
      { level: 2, hint: 'The other racer starts 5 m ahead, so only needs to travel 295 m total.' },
      { level: 3, hint: 'Calculate where the other racer is when the winner finishes to find the distance gap.' },
    ],
    tags: ["kinematics","racing","multi-phase-motion","relative-motion"],
  },

  {
    id: 'pdf-ch2-p39',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 39',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Burt Munro\'s Motorcycle World Record',
    statement: 'In 1967, New Zealander Burt Munro set the world record for an Indian motorcycle, on the Bonneville Salt Flats in Utah, with a maximum speed of 183.58 mi/h. The one-way course was 5.00 mi long. Acceleration rates are often described by the time it takes to reach 60.0 mi/h from rest. If this time was 4.00 s, and Burt accelerated at this rate until he reached his maximum speed, how long did it take Burt to complete the course?',
    givenValues: [
      { symbol: 'v_{max}', value: 183.58, unit: 'mi/h', description: 'maximum speed' },
      { symbol: 'd', value: 5.00, unit: 'mi', description: 'course length' },
      { symbol: 'v_{60}', value: 60.0, unit: 'mi/h', description: 'reference speed for acceleration' },
      { symbol: 't_{60}', value: 4.00, unit: 's', description: 'time to reach 60 mi/h from rest' },
    ],
    unknowns: [
      { symbol: 't_{total}', description: 'total time to complete course', unit: 's' },
    ],
    solution: {
      approach: 'Find the acceleration rate, then calculate time to reach maximum speed and distance during acceleration, followed by constant speed phase',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'First find the constant acceleration rate from the given information about reaching 60 mi/h' },
      { level: 2, hint: 'The motion has two phases: acceleration to maximum speed, then constant speed' },
      { level: 3, hint: 'Be careful with unit conversions between mi/h and mi/s' },
    ],
    tags: ["acceleration","two-phase-motion","unit-conversion","real-world-application"],
  },

  {
    id: 'pdf-ch2-p40',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 40',
    concepts: ["velocity","acceleration","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Usain Bolt\'s Olympic Records',
    statement: '(a) A world record was set for the men\'s 100-m dash in the 2008 Olympic Games in Beijing by Usain Bolt of Jamaica. Bolt "coasted" across the finish line with a time of 9.69 s. If we assume that Bolt accelerated for 3.00 s to reach his maximum speed, and maintained that speed for the rest of the race, calculate his maximum speed and his acceleration. (b) During the same Olympics, Bolt also set the world record in the 200-m dash with a time of 19.30 s. Using the same assumptions as for the 100-m dash, what was his maximum speed for this race?',
    givenValues: [
      { symbol: 'd_{100}', value: 100, unit: 'm', description: '100-m dash distance' },
      { symbol: 't_{100}', value: 9.69, unit: 's', description: '100-m dash time' },
      { symbol: 't_{acc}', value: 3.00, unit: 's', description: 'acceleration time' },
      { symbol: 'd_{200}', value: 200, unit: 'm', description: '200-m dash distance' },
      { symbol: 't_{200}', value: 19.30, unit: 's', description: '200-m dash time' },
    ],
    unknowns: [
      { symbol: 'v_{max,100}', description: 'maximum speed in 100-m dash', unit: 'm/s' },
      { symbol: 'a_{100}', description: 'acceleration in 100-m dash', unit: 'm/s²' },
      { symbol: 'v_{max,200}', description: 'maximum speed in 200-m dash', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations for two-phase motion: acceleration phase and constant velocity phase',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The motion has two phases: acceleration for 3.00 s, then constant speed' },
      { level: 2, hint: 'Use the total distance equation: distance during acceleration + distance at constant speed = total distance' },
      { level: 3, hint: 'For part (b), assume the same acceleration as in the 100-m dash' },
    ],
    tags: ["acceleration","constant-velocity","two-phase-motion","olympic-records"],
  },

  {
    id: 'pdf-ch2-p41',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 41',
    concepts: ["free-fall","displacement","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 6,
    title: 'Ball Thrown Upward - Multiple Time Points',
    statement: 'Calculate the displacement and velocity at times of (a) 0.500, (b) 1.00, (c) 1.50, and (d) 2.00 s for a ball thrown straight up with an initial velocity of 15.0 m/s. Take the point of release to be y = 0.',
    givenValues: [
      { symbol: 'v_0', value: 15.0, unit: 'm/s', description: 'initial velocity (upward)' },
      { symbol: 'y_0', value: 0, unit: 'm', description: 'initial position' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity (downward)' },
    ],
    unknowns: [
      { symbol: 'y', description: 'displacement at various times', unit: 'm' },
      { symbol: 'v', description: 'velocity at various times', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations for constant acceleration: y = v_0t - \\frac{1}{2}gt² and v = v_0 - gt',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the kinematic equations for constant acceleration with g = 9.80 m/s² downward' },
      { level: 2, hint: 'Positive velocity means upward motion, negative means downward' },
      { level: 3, hint: 'The ball reaches maximum height when velocity equals zero' },
    ],
    tags: ["projectile-motion","free-fall","upward-throw","kinematics"],
  },

  {
    id: 'pdf-ch2-p42',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 42',
    concepts: ["free-fall","displacement","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 7,
    title: 'Rock Thrown Downward from Bridge',
    statement: 'Calculate the displacement and velocity at times of (a) 0.500, (b) 1.00, (c) 1.50, (d) 2.00, and (e) 2.50 s for a rock thrown straight down with an initial velocity of 14.0 m/s from the Verrazano Narrows Bridge in New York City. The roadway of this bridge is 70.0 m above the water.',
    givenValues: [
      { symbol: 'v_0', value: -14.0, unit: 'm/s', description: 'initial velocity (downward)' },
      { symbol: 'y_0', value: 70.0, unit: 'm', description: 'initial height above water' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'y', description: 'height above water at various times', unit: 'm' },
      { symbol: 'v', description: 'velocity at various times', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations with downward as negative direction: y = y_0 + v_0t - \\frac{1}{2}gt² and v = v_0 - gt',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Take downward as negative direction for both initial velocity and acceleration' },
      { level: 2, hint: 'The initial position is 70.0 m above the water' },
      { level: 3, hint: 'Check if the rock hits the water (y = 0) before t = 2.50 s' },
    ],
    tags: ["free-fall","downward-throw","bridge-height","kinematics"],
  },

  {
    id: 'pdf-ch2-p43',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 43',
    concepts: ["free-fall","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 4,
    title: 'Basketball Player Jump Height',
    statement: 'A basketball referee tosses the ball straight up for the starting tip-off. At what velocity must a basketball player leave the ground to rise 1.25 m above the floor in an attempt to get the ball?',
    givenValues: [
      { symbol: 'h', value: 1.25, unit: 'm', description: 'maximum height above ground' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'v_0', description: 'initial velocity needed', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equation v² = v₀² - 2gh, where final velocity at maximum height is zero',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'At the maximum height, the velocity is zero' },
      { level: 2, hint: 'Use the kinematic equation that relates initial velocity, final velocity, acceleration, and displacement' },
      { level: 3, hint: 'The acceleration is -g (upward motion against gravity)' },
    ],
    tags: ["free-fall","vertical-jump","maximum-height","basketball"],
  },

  {
    id: 'pdf-ch2-p44',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 44',
    concepts: ["free-fall","displacement"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 5,
    title: 'Helicopter Life Preserver Drop',
    statement: 'A rescue helicopter is hovering over a person whose boat has sunk. One of the rescuers throws a life preserver straight down to the victim with an initial velocity of 1.40 m/s and observes that it takes 1.8 s to reach the water. (a) List the knowns in this problem. (b) How high above the water was the preserver released? Note that the downdraft of the helicopter reduces the effects of air resistance on the falling life preserver, so that an acceleration equal to that of gravity is reasonable.',
    givenValues: [
      { symbol: 'v_0', value: 1.40, unit: 'm/s', description: 'initial velocity (downward)' },
      { symbol: 't', value: 1.8, unit: 's', description: 'time to reach water' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'h', description: 'height above water', unit: 'm' },
    ],
    solution: {
      approach: 'Use kinematic equation for displacement with constant acceleration',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The preserver is thrown downward, so initial velocity and gravity both act in the same direction' },
      { level: 2, hint: 'Use the displacement equation that includes both initial velocity and acceleration terms' },
      { level: 3, hint: 'Air resistance is negligible due to helicopter downdraft' },
    ],
    tags: ["free-fall","downward-throw","helicopter-rescue","displacement-calculation"],
  },

  {
    id: 'pdf-ch2-p45',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 45',
    concepts: ["free-fall","velocity","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 8,
    title: 'Dolphin Jump Analysis',
    statement: 'A dolphin in an aquatic show jumps straight up out of the water at a velocity of 13.0 m/s. (a) List the knowns in this problem. (b) How high does his body rise above the water? To solve this part, first note that the final velocity is now a known and identify its value. Then identify the unknown, and discuss how you chose the appropriate equation to solve for it. After choosing the equation, show your steps in solving for the unknown, checking units, and discuss whether the answer is reasonable. (c) How long is the dolphin in the air? Neglect any effects due to his size or orientation.',
    givenValues: [
      { symbol: 'v_0', value: 13.0, unit: 'm/s', description: 'initial velocity (upward)' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'h', description: 'maximum height above water', unit: 'm' },
      { symbol: 't_{total}', description: 'total time in air', unit: 's' },
    ],
    solution: {
      approach: 'Use kinematic equations for projectile motion with upward initial velocity',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'At maximum height, the velocity is zero' },
      { level: 2, hint: 'The motion is symmetric - time up equals time down' },
      { level: 3, hint: 'Use v² = v₀² - 2gh for part (b) and v = v₀ - gt for part (c)' },
    ],
    tags: ["projectile-motion","vertical-launch","symmetry","maximum-height","time-of-flight"],
  },

  {
    id: 'pdf-ch2-p46',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 46',
    concepts: ["free-fall","displacement","velocity"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 10,
    title: 'Swimmer Diving Board Analysis',
    statement: 'A swimmer bounces straight up from a diving board and falls feet first into a pool. She starts with a velocity of 4.00 m/s, and her takeoff point is 1.80 m above the pool. (a) How long are her feet in the air? (b) What is her highest point above the board? (c) What is her velocity when her feet hit the water?',
    givenValues: [
      { symbol: 'v_0', value: 4.00, unit: 'm/s', description: 'initial velocity (upward)' },
      { symbol: 'h_0', value: 1.80, unit: 'm', description: 'diving board height above pool' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 't_{air}', description: 'total time in air', unit: 's' },
      { symbol: 'h_{max}', description: 'maximum height above diving board', unit: 'm' },
      { symbol: 'v_f', description: 'final velocity when hitting water', unit: 'm/s' },
    ],
    solution: {
      approach: 'Use kinematic equations considering the swimmer starts above the pool and ends at pool level',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Set up a coordinate system with the pool surface as y = 0' },
      { level: 2, hint: 'For part (a), use the displacement equation and solve the quadratic equation' },
      { level: 3, hint: 'The swimmer goes up first, then falls down past the starting point to the pool' },
    ],
    tags: ["projectile-motion","diving-board","quadratic-equation","multi-part-motion"],
  },

  {
    id: 'pdf-ch2-p55',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 55',
    concepts: ["free-fall","velocity","displacement"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Rock Dropped into Well with Sound Travel Time',
    statement: 'Suppose you drop a rock into a dark well and, using precision equipment, you measure the time for the sound of a splash to return. (a) Neglecting the time required for sound to travel up the well, calculate the distance to the water if the sound returns in 2.0000 s. (b) Now calculate the distance taking into account the time for sound to travel up the well. The speed of sound is 332.00 m/s in this well.',
    givenValues: [
      { symbol: 't_{total}', value: 2.0000, unit: 's', description: 'Total time for sound to return' },
      { symbol: 'v_{sound}', value: 332.00, unit: 'm/s', description: 'Speed of sound in the well' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'Acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'd', description: 'Distance to water', unit: 'm' },
    ],
    solution: {
      approach: 'For part (a), use free fall kinematics. For part (b), account for both fall time and sound travel time.',
      steps: [
        {
          stepNumber: 1,
          description: 'Part (a): Neglecting sound travel time, the rock falls for 2.0000 s',
          equation: 'd = \\frac{1}{2}gt^2',
          substitution: 'd = \\frac{1}{2}(9.80)(2.0000)^2',
        },
        {
          stepNumber: 1,
          description: 'Calculate distance for part (a)',
          equation: 'd = \\frac{1}{2}(9.80)(4.0000) = 19.60 \\text{ m}',
        },
        {
          stepNumber: 1,
          description: 'Part (b): Let t₁ = fall time, t₂ = sound travel time, where t₁ + t₂ = 2.0000 s',
          equation: 'd = \\frac{1}{2}gt_1^2 \\text{ and } d = v_{sound} \\cdot t_2',
        },
        {
          stepNumber: 1,
          description: 'From the sound equation: t₂ = d/332.00, so t₁ = 2.0000 - d/332.00',
          equation: 'd = \\frac{1}{2}(9.80)(2.0000 - \\frac{d}{332.00})^2',
        },
        {
          stepNumber: 1,
          description: 'Expanding and rearranging into quadratic form',
          equation: 'd = 4.90(2.0000 - \\frac{d}{332.00})^2',
        },
        {
          stepNumber: 1,
          description: 'Solving the quadratic equation yields',
          equation: 'd ≈ 19.50 \\text{ m}',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For part (a), treat this as a simple free fall problem where the rock falls for the entire 2.0000 s.' },
      { level: 2, hint: 'For part (b), the total time is the sum of fall time and sound travel time. Set up equations for both motions.' },
      { level: 3, hint: 'You\'ll need to solve a quadratic equation in part (b). The distance appears in both the fall equation and the sound travel equation.' },
    ],
    tags: ["free-fall","quadratic-equations","sound-travel","precision-measurement"],
  },

  {
    id: 'pdf-ch2-p56',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 56',
    concepts: ["free-fall","velocity","acceleration","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Steel Ball Bouncing on Hard Floor',
    statement: 'A steel ball is dropped onto a hard floor from a height of 1.50 m and rebounds to a height of 1.45 m. (a) Calculate its velocity just before it strikes the floor. (b) Calculate its velocity just after it leaves the floor on its way back up. (c) Calculate its acceleration during contact with the floor if that contact lasts 0.0800 ms. (d) How much did the ball compress during its collision with the floor, assuming the floor is absolutely rigid?',
    givenValues: [
      { symbol: 'h_1', value: 1.50, unit: 'm', description: 'Initial drop height' },
      { symbol: 'h_2', value: 1.45, unit: 'm', description: 'Rebound height' },
      { symbol: '\Delta t', value: 0.0800, unit: 'ms', description: 'Contact time with floor' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'Acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'v_1', description: 'Velocity just before striking floor', unit: 'm/s' },
      { symbol: 'v_2', description: 'Velocity just after leaving floor', unit: 'm/s' },
      { symbol: 'a', description: 'Acceleration during contact', unit: 'm/s²' },
      { symbol: 'd', description: 'Compression distance', unit: 'm' },
    ],
    solution: {
      approach: 'Use kinematic equations for free fall and collision analysis.',
      steps: [
        {
          stepNumber: 1,
          description: 'Part (a): Find velocity just before impact using v² = u² + 2as',
          equation: 'v_1^2 = 0 + 2gh_1 = 2(9.80)(1.50)',
          substitution: 'v_1 = \\sqrt{29.4} = 5.42 \\text{ m/s (downward)}',
        },
        {
          stepNumber: 1,
          description: 'Part (b): Find velocity just after leaving floor using energy conservation for rebound',
          equation: 'v_2^2 = 2gh_2 = 2(9.80)(1.45)',
          substitution: 'v_2 = \\sqrt{28.42} = 5.33 \\text{ m/s (upward)}',
        },
        {
          stepNumber: 1,
          description: 'Part (c): Calculate acceleration during contact using v = u + at',
          equation: 'a = \\frac{v_2 - (-v_1)}{\\Delta t} = \\frac{5.33 - (-5.42)}{0.0800 \\times 10^{-3}}',
          substitution: 'a = \\frac{10.75}{8.00 \\times 10^{-5}} = 1.34 \\times 10^5 \\text{ m/s²}',
        },
        {
          stepNumber: 1,
          description: 'Part (d): Find compression using average velocity during contact',
          equation: 'd = v_{avg} \\times \\Delta t = \\frac{(-v_1 + 0)}{2} \\times \\Delta t',
          substitution: 'd = \\frac{-5.42}{2} \\times 8.00 \\times 10^{-5} = 2.17 \\times 10^{-4} \\text{ m}',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use energy conservation or kinematic equations to find the velocities just before and after collision.' },
      { level: 2, hint: 'For the acceleration during contact, consider the change in velocity over the contact time.' },
      { level: 3, hint: 'For compression, think about the motion during the brief contact time - the ball goes from moving downward to stationary at maximum compression.' },
    ],
    tags: ["collision","energy-conservation","contact-forces","deformation"],
  },

  {
    id: 'pdf-ch2-p57',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 57',
    concepts: ["free-fall","velocity","displacement","position"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Coin Dropped from Rising Hot Air Balloon',
    statement: 'A coin is dropped from a hot-air balloon that is 300 m above the ground and rising at 10.0 m/s upward. For the coin, find (a) the maximum height reached, (b) its position and velocity 4.00 s after being released, and (c) the time before it hits the ground.',
    givenValues: [
      { symbol: 'h_0', value: 300, unit: 'm', description: 'Initial height above ground' },
      { symbol: 'v_0', value: 10.0, unit: 'm/s', description: 'Initial upward velocity' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'Acceleration due to gravity' },
      { symbol: 't', value: 4.00, unit: 's', description: 'Time for part (b)' },
    ],
    unknowns: [
      { symbol: 'h_{max}', description: 'Maximum height reached', unit: 'm' },
      { symbol: 'y', description: 'Position at t = 4.00 s', unit: 'm' },
      { symbol: 'v', description: 'Velocity at t = 4.00 s', unit: 'm/s' },
      { symbol: 't_{ground}', description: 'Time to hit ground', unit: 's' },
    ],
    solution: {
      approach: 'Use kinematic equations with upward as positive direction and initial position at 300 m.',
      steps: [
        {
          stepNumber: 1,
          description: 'Part (a): Find maximum height using v² = v₀² - 2g(h - h₀)',
          equation: '0 = (10.0)^2 - 2(9.80)(h_{max} - 300)',
          substitution: 'h_{max} = 300 + \\frac{100}{19.6} = 305.1 \\text{ m}',
        },
        {
          stepNumber: 1,
          description: 'Part (b): Find position at t = 4.00 s using y = y₀ + v₀t - ½gt²',
          equation: 'y = 300 + 10.0(4.00) - \\frac{1}{2}(9.80)(4.00)^2',
          substitution: 'y = 300 + 40.0 - 78.4 = 261.6 \\text{ m}',
        },
        {
          stepNumber: 1,
          description: 'Find velocity at t = 4.00 s using v = v₀ - gt',
          equation: 'v = 10.0 - 9.80(4.00) = 10.0 - 39.2 = -29.2 \\text{ m/s}',
        },
        {
          stepNumber: 1,
          description: 'Part (c): Find time to hit ground when y = 0',
          equation: '0 = 300 + 10.0t - \\frac{1}{2}(9.80)t^2',
          substitution: '4.9t^2 - 10.0t - 300 = 0',
        },
        {
          stepNumber: 1,
          description: 'Using quadratic formula',
          equation: 't = \\frac{10.0 \\pm \\sqrt{100 + 5880}}{9.8} = \\frac{10.0 \\pm 77.3}{9.8}',
          substitution: 't = 8.91 \\text{ s (taking positive root)}',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Set up a coordinate system with upward as positive and the initial position as 300 m above ground.' },
      { level: 2, hint: 'The coin initially moves upward due to the balloon\'s velocity, reaches a maximum height, then falls.' },
      { level: 3, hint: 'For part (c), you\'ll need to solve a quadratic equation. Remember to take the positive time value.' },
    ],
    tags: ["projectile-motion","initial-velocity","quadratic-equations","maximum-height"],
  },

  {
    id: 'pdf-ch2-p58',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 58',
    concepts: ["free-fall","velocity","acceleration","displacement"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Soft Tennis Ball Bouncing on Hard Floor',
    statement: 'A soft tennis ball is dropped onto a hard floor from a height of 1.50 m and rebounds to a height of 1.10 m. (a) Calculate its velocity just before it strikes the floor. (b) Calculate its velocity just after it leaves the floor on its way back up. (c) Calculate its acceleration during contact with the floor if that contact lasts 3.50 ms. (d) How much did the ball compress during its collision with the floor, assuming the floor is absolutely rigid?',
    givenValues: [
      { symbol: 'h_1', value: 1.50, unit: 'm', description: 'Initial drop height' },
      { symbol: 'h_2', value: 1.10, unit: 'm', description: 'Rebound height' },
      { symbol: '\Delta t', value: 3.50, unit: 'ms', description: 'Contact time with floor' },
      { symbol: 'g', value: 9.80, unit: 'm/s²', description: 'Acceleration due to gravity' },
    ],
    unknowns: [
      { symbol: 'v_1', description: 'Velocity just before striking floor', unit: 'm/s' },
      { symbol: 'v_2', description: 'Velocity just after leaving floor', unit: 'm/s' },
      { symbol: 'a', description: 'Acceleration during contact', unit: 'm/s²' },
      { symbol: 'd', description: 'Compression distance', unit: 'm' },
    ],
    solution: {
      approach: 'Use kinematic equations for free fall and collision analysis, similar to problem 56 but with different values.',
      steps: [
        {
          stepNumber: 1,
          description: 'Part (a): Find velocity just before impact using v² = u² + 2as',
          equation: 'v_1^2 = 0 + 2gh_1 = 2(9.80)(1.50)',
          substitution: 'v_1 = \\sqrt{29.4} = 5.42 \\text{ m/s (downward)}',
        },
        {
          stepNumber: 1,
          description: 'Part (b): Find velocity just after leaving floor using energy conservation for rebound',
          equation: 'v_2^2 = 2gh_2 = 2(9.80)(1.10)',
          substitution: 'v_2 = \\sqrt{21.56} = 4.64 \\text{ m/s (upward)}',
        },
        {
          stepNumber: 1,
          description: 'Part (c): Calculate acceleration during contact using v = u + at',
          equation: 'a = \\frac{v_2 - (-v_1)}{\\Delta t} = \\frac{4.64 - (-5.42)}{3.50 \\times 10^{-3}}',
          substitution: 'a = \\frac{10.06}{3.50 \\times 10^{-3}} = 2.87 \\times 10^3 \\text{ m/s²}',
        },
        {
          stepNumber: 1,
          description: 'Part (d): Find compression using average velocity during compression phase',
          equation: 'd = v_{avg} \\times t_{compress} = \\frac{(-v_1 + 0)}{2} \\times \\frac{\\Delta t}{2}',
          substitution: 'd = \\frac{-5.42}{2} \\times \\frac{3.50 \\times 10^{-3}}{2} = 4.74 \\times 10^{-3} \\text{ m}',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'This problem is very similar to problem 56, but with a softer ball that has a longer contact time and lower rebound height.' },
      { level: 2, hint: 'The longer contact time (3.50 ms vs 0.0800 ms) will result in a much smaller acceleration during collision.' },
      { level: 3, hint: 'For compression, assume the compression and expansion phases each take half the total contact time.' },
    ],
    tags: ["collision","energy-conservation","contact-forces","deformation","soft-materials"],
  },

  {
    id: 'pdf-ch2-p63',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 63',
    concepts: ["position","velocity","acceleration"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Position Graph for Subway Shuttle Train',
    statement: 'Construct the position graph for the subway shuttle train as shown in Figure 2.18 (a). Your graph should show the position of the train, in kilometers, from t = 0 to 20 s. You will need to use the information on acceleration and velocity given in the examples for this figure.',
    givenValues: [
      { symbol: 't', value: 'variable', unit: 's', description: 'time interval (0 to 20 s)' },
    ],
    unknowns: [
      { symbol: 'x(t)', description: 'position as a function of time', unit: 'km' },
    ],
    solution: {
      approach: 'Use kinematic equations and information from Figure 2.18(a) to construct position vs time graph',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Break the motion into distinct phases based on the acceleration and velocity information' },
      { level: 2, hint: 'Use the kinematic equation x = x₀ + v₀t + ½at² for each phase' },
      { level: 3, hint: 'Ensure continuity of position between different phases of motion' },
    ],
    tags: ["kinematics","position-time-graphs","subway-motion"],
  },

  {
    id: 'pdf-ch2-p64',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 64',
    concepts: ["velocity","position"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Finding Velocity from Position Graph Slope',
    statement: '(a) Take the slope of the curve in Figure 2.62 to find the jogger\'s velocity at t = 2.5 s. (b) Repeat at 7.5 s. These values must be consistent with the graph in Figure 2.63.',
    givenValues: [
      { symbol: 't₁', value: 2.5, unit: 's', description: 'first time point' },
      { symbol: 't₂', value: 7.5, unit: 's', description: 'second time point' },
    ],
    unknowns: [
      { symbol: 'v(2.5)', description: 'velocity at t = 2.5 s', unit: 'm/s' },
      { symbol: 'v(7.5)', description: 'velocity at t = 7.5 s', unit: 'm/s' },
    ],
    solution: {
      approach: 'Calculate the slope of the position vs time curve at the specified times',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The slope of a position vs time graph gives the instantaneous velocity' },
      { level: 2, hint: 'Draw tangent lines to the curve at the specified times' },
      { level: 3, hint: 'Use rise over run (Δx/Δt) to calculate the slope of each tangent line' },
    ],
    tags: ["kinematics","graphical-analysis","velocity","slope"],
  },

  {
    id: 'pdf-ch2-p65',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 65',
    concepts: ["velocity","acceleration"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Track Sprinter Velocity Analysis',
    statement: 'A graph of v vs t is shown for a world-class track sprinter in a 100-m race. (See Figure 2.65). (a) What is his average velocity for the first 4 s? (b) What is his instantaneous velocity at t = 5 s? (c) What is his average acceleration between 0 and 4 s? (d) What is his time for the race?',
    givenValues: [
      { symbol: 'd_total', value: 100, unit: 'm', description: 'total race distance' },
      { symbol: 't₁', value: 4, unit: 's', description: 'time interval for average calculations' },
      { symbol: 't₂', value: 5, unit: 's', description: 'time for instantaneous velocity' },
    ],
    unknowns: [
      { symbol: 'v_avg', description: 'average velocity for first 4 s', unit: 'm/s' },
      { symbol: 'v(5)', description: 'instantaneous velocity at t = 5 s', unit: 'm/s' },
      { symbol: 'a_avg', description: 'average acceleration between 0 and 4 s', unit: 'm/s²' },
      { symbol: 't_race', description: 'total time for the race', unit: 's' },
    ],
    solution: {
      approach: 'Analyze the velocity vs time graph to extract required information',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The area under a velocity vs time graph gives displacement' },
      { level: 2, hint: 'Average velocity = total displacement / total time' },
      { level: 3, hint: 'For part (d), the total area under the curve must equal 100 m' },
    ],
    tags: ["kinematics","velocity-time-graphs","sprinting","graphical-analysis"],
  },

  {
    id: 'pdf-ch2-p66',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 66',
    concepts: ["position","velocity","acceleration"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Position Graph Analysis and Velocity Graph Construction',
    statement: 'Figure 2.66 shows the position graph for a particle for 6 s. (a) Draw the corresponding Velocity vs Time graph. (b) What is the acceleration between 0 s and 2 s? (c) What happens to the acceleration at exactly 2 s?',
    givenValues: [
      { symbol: 't_total', value: 6, unit: 's', description: 'total time interval' },
      { symbol: 't_transition', value: 2, unit: 's', description: 'transition time point' },
    ],
    unknowns: [
      { symbol: 'v(t)', description: 'velocity as function of time', unit: 'm/s' },
      { symbol: 'a₁', description: 'acceleration between 0 and 2 s', unit: 'm/s²' },
      { symbol: 'a(2)', description: 'acceleration behavior at t = 2 s', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Analyze position graph slopes to construct velocity graph and find accelerations',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The slope of position vs time gives velocity' },
      { level: 2, hint: 'The slope of velocity vs time gives acceleration' },
      { level: 3, hint: 'Look for sudden changes in slope at t = 2 s in the original position graph' },
    ],
    tags: ["kinematics","graphical-analysis","position-velocity-relationship"],
  },

  {
    id: 'pdf-ch2-p67',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 67',
    concepts: ["velocity","acceleration"],
    difficulty: 4,
    type: 'conceptual',
    estimatedMinutes: 20,
    title: 'Critical Thinking: Two Cars Race Analysis',
    statement: 'Critical Thinking: Two cars are side by side on a path where friction is negligible. Car A starts from rest and has a positive, constant acceleration while car B travels at a constant speed. The cars reach the same checkpoint down the road at the same time. (a) Which car is traveling faster at the checkpoint? Briefly explain your reasoning. (b) Based on experimental data, an equation that fits the data is suggested for the speed of car A at the checkpoint, V, which may not be correct: V = K·v₀, where K is a constant with appropriate units and v₀ is the initial velocity of car B. Is this equation consistent with your answer from part a? Explain why or why not. Does this equation make sense? Explain why or why not. (c) Graph the velocity of car A and the velocity of car B vs distance along the path, starting when the cars are side by side.',
    givenValues: [
      { symbol: 'v₀ₐ', value: 0, unit: 'm/s', description: 'initial velocity of car A' },
      { symbol: 'aₐ', value: 'variable', unit: 'm/s²', description: 'acceleration of car A (constant > 0)' },
      { symbol: 'vᵦ', value: 'variable', unit: 'm/s', description: 'constant velocity of car B (v₀)' },
    ],
    unknowns: [
      { symbol: 'vₐ_final', description: 'final velocity of car A at checkpoint', unit: 'm/s' },
      { symbol: 'K', description: 'proportionality constant in proposed equation', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Use kinematic equations and logical reasoning to analyze the motion of both cars',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Both cars travel the same distance in the same time' },
      { level: 2, hint: 'Use kinematic equations: x = v₀t + ½at² for car A and x = vt for car B' },
      { level: 3, hint: 'For the graph, consider how velocity changes with distance, not time' },
    ],
    tags: ["kinematics","critical-thinking","acceleration","constant-velocity"],
  },

  {
    id: 'pdf-ch2-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Test Prep Problem 1',
    concepts: ["displacement","position"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Position, Distance, and Displacement Comparison',
    statement: 'Which of the following statements comparing position, distance traveled, and displacement is correct?\na. An object may record a distance traveled of zero while recording a non-zero displacement.\nb. An object may record a non-zero distance traveled while recording a displacement of zero.\nc. An object may record a non-zero distance traveled while maintaining a position of zero.\nd. An object may record a non-zero displacement while maintaining a position of zero.',
    unknowns: [
      { symbol: 'answer', description: 'correct statement about position, distance, and displacement', unit: 'none' },
    ],
    solution: {
      approach: 'Analyze each statement by considering definitions of position, distance traveled, and displacement',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider an object moving in a circular path returning to its starting point' },
      { level: 2, hint: 'Distance is always positive and measures total path, displacement measures net change in position' },
      { level: 3, hint: 'Displacement can be zero even when distance is not zero' },
    ],
    tags: ["displacement","distance","position","conceptual","multiple-choice"],
  },

  {
    id: 'pdf-ch2-p2',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Test Prep Problem 2',
    concepts: ["velocity","acceleration","free-fall"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 5,
    title: 'Coordinate System for Falling Feather',
    statement: 'A student is trying to determine the acceleration of a feather as she drops it to the ground. If the student is looking to achieve a positive velocity and positive acceleration, what is the most sensible way to set up her coordinate system?\na. Her hand should be a coordinate of zero and the upward direction should be considered positive.\nb. Her hand should be a coordinate of zero and the downward direction should be considered positive.\nc. The floor should be a coordinate of zero and the upward direction should be considered positive.\nd. The floor should be a coordinate of zero and the downward direction should be considered positive.',
    givenValues: [
      { symbol: 'g', value: 9.8, unit: 'm/s²', description: 'acceleration due to gravity (downward)' },
    ],
    unknowns: [
      { symbol: 'coordinate_system', description: 'optimal coordinate system setup', unit: 'none' },
    ],
    solution: {
      approach: 'Determine coordinate system that makes both velocity and acceleration positive for falling feather',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Both velocity and acceleration of the falling feather are in the same direction' },
      { level: 2, hint: 'For both to be positive, that direction must be chosen as positive' },
      { level: 3, hint: 'The feather falls downward, so downward should be positive' },
    ],
    tags: ["coordinate-systems","free-fall","velocity","acceleration","multiple-choice"],
  },

  {
    id: 'pdf-ch2-p3',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Test Prep Problem 3',
    concepts: ["velocity"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Experimental Design for Cart Collision Velocities',
    statement: 'A group of students has two carts, A and B, with wheels that turn with negligible friction. The two carts travel along a straight horizontal track and eventually collide. Before the collision, cart A travels to the right and cart B is initially at rest. After the collision, the carts stick together. (a) Describe an experimental procedure to determine the velocities of the carts before and after the collision, including all the additional equipment you would need. You may include a labeled diagram of your setup to help in your description. Indicate what measurements you would take and how you would take them. Include enough detail so that another student could carry out your procedure. (b) There will be sources of error in the measurements taken in the experiment both before and after the collision. Which velocity will be more greatly affected by this error: the velocity prior to the collision or the velocity after the collision? Or will both sets of data be affected equally? Justify your answer.',
    givenValues: [
      { symbol: 'v_{B0}', value: 0, unit: 'm/s', description: 'initial velocity of cart B' },
      { symbol: 'friction', value: 'variable', unit: '', description: 'friction in wheels (negligible)' },
    ],
    unknowns: [
      { symbol: 'v_{A0}', description: 'initial velocity of cart A', unit: 'm/s' },
      { symbol: 'v_f', description: 'final velocity of combined carts', unit: 'm/s' },
    ],
    solution: {
      approach: 'Design experiment using motion sensors or video analysis to measure velocities',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Consider using motion sensors or video analysis to track cart positions over time' },
      { level: 2, hint: 'Velocity can be calculated from the slope of position vs time graphs' },
      { level: 3, hint: 'Think about relative error: the same absolute error has bigger impact on smaller measurements' },
    ],
    tags: ["experimental-design","velocity","collision","measurement-error","motion-sensors"],
  },

  {
    id: 'pdf-ch2-p4',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 4',
    concepts: ["velocity","acceleration"],
    difficulty: 3,
    type: 'conceptual',
    estimatedMinutes: 8,
    title: 'Ranking Average Accelerations from Velocity-Time Graph',
    statement: 'A cart is constrained to move along a straight line. A varying net force along the direction of motion is exerted on the cart. The cart\'s velocity v as a function of time t is shown in the graph. The five labeled points divide the graph into four sections. Which of the following correctly ranks the magnitude of the average acceleration of the cart during the four sections of the graph?\na. $a_{CD} > a_{AB} > a_{BC} > a_{DE}$\nb. $a_{BC} > a_{AB} > a_{CD} > a_{DE}$\nc. $a_{AB} > a_{BC} > a_{DE} > a_{CD}$\nd. $a_{CD} > a_{AB} > a_{DE} > a_{BC}$',
    givenValues: [
      { symbol: 'v-t graph', value: 'variable', unit: '', description: 'Velocity versus time graph with five labeled points creating four sections' },
    ],
    unknowns: [
      { symbol: 'ranking', description: 'Correct ranking of average acceleration magnitudes', unit: 'dimensionless' },
    ],
    solution: {
      approach: 'Calculate average acceleration as slope of velocity-time graph for each section and compare magnitudes',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Average acceleration equals the slope of the velocity-time graph' },
      { level: 2, hint: 'Compare the steepness of each section - steeper slopes mean larger magnitude accelerations' },
      { level: 3, hint: 'Remember that magnitude means absolute value - both positive and negative slopes can have large magnitudes' },
    ],
    tags: ["velocity-time-graphs","average-acceleration","graphical-analysis","kinematics"],
  },

  {
    id: 'pdf-ch2-p5',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 5',
    concepts: ["velocity","displacement","position"],
    difficulty: 2,
    type: 'conceptual',
    estimatedMinutes: 12,
    title: 'Position and Velocity Graphs for Sliding Book',
    statement: 'Push a book across a table and observe it slow to a stop. Draw graphs showing the book\'s position vs. time and velocity vs. time if the direction of its motion is considered positive. Draw graphs showing the book\'s position vs. time and velocity vs. time if the direction of its motion is considered negative.',
    givenValues: [
      { symbol: 'motion', value: 'variable', unit: '', description: 'Book pushed across table, slowing due to friction' },
    ],
    unknowns: [
      { symbol: 'x-t and v-t graphs', description: 'Position and velocity graphs for both positive and negative direction conventions', unit: 'various' },
    ],
    solution: {
      approach: 'Analyze the motion qualitatively and sketch appropriate graphs for both direction conventions',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The book experiences constant deceleration due to friction' },
      { level: 2, hint: 'Position changes according to x = x₀ + v₀t + ½at², velocity changes as v = v₀ + at' },
      { level: 3, hint: 'The shape of the graphs depends only on the sign convention chosen for the positive direction' },
    ],
    tags: ["motion-graphs","friction","deceleration","graphical-representation"],
  },

  {
    id: 'pdf-ch2-p6',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 6',
    concepts: ["acceleration","position"],
    difficulty: 4,
    type: 'multi-step',
    estimatedMinutes: 20,
    title: 'Determining Marble Acceleration from Position Data',
    statement: 'A group of students is attempting to determine the average acceleration of a marble released from the top of a long ramp. Below is a set of data representing the marble\'s position with respect to time. Use the data table to construct a graph determining the acceleration of the marble. Select a set of data points from the table and plot those points on the graph. Fill in the blank column in the table for any quantities you graph other than the given data. Label the axes and indicate the scale for each. Draw a best-fit line or curve through your data points. Using the best-fit line, determine the value of the marble\'s acceleration.',
    givenValues: [
      { symbol: 'x', value: 'variable', unit: 'cm', description: 'Position measurements: [0.0, 0.3, 1.25, 2.8, 5.0, 7.75, 11.3]' },
      { symbol: 't', value: 'variable', unit: 's', description: 'Time measurements: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]' },
    ],
    unknowns: [
      { symbol: 'a', description: 'Acceleration of the marble', unit: 'cm/s²' },
    ],
    solution: {
      approach: 'Use kinematic equation x = x₀ + v₀t + ½at² and plot x vs t² to find acceleration from slope',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'For constant acceleration from rest, position follows x = ½at²' },
      { level: 2, hint: 'Plot position vs t² to get a linear relationship where the slope equals ½a' },
      { level: 3, hint: 'Calculate the slope using any two well-separated points on your best-fit line' },
    ],
    tags: ["data-analysis","graphical-methods","constant-acceleration","kinematics-equations"],
  },

  {
    id: 'pdf-ch2-p7',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 2, Problem 7',
    concepts: ["free-fall","acceleration"],
    difficulty: 3,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Gravitational Acceleration on Asteroid',
    statement: 'Observing a spacecraft land on a distant asteroid, scientists notice that the craft is falling at a rate of 5 m/s. When it is 100 m closer to the surface of the asteroid, the craft reports a velocity of 8 m/s. According to their data, what is the approximate gravitational acceleration on this asteroid?\na. 0 m/s²\nb. 0.03 m/s²\nc. 0.20 m/s²\nd. 0.65 m/s²\ne. 33 m/s²',
    givenValues: [
      { symbol: 'v₁', value: 5, unit: 'm/s', description: 'Initial velocity of spacecraft' },
      { symbol: 'v₂', value: 8, unit: 'm/s', description: 'Final velocity after falling 100 m closer' },
      { symbol: 'Δx', value: 100, unit: 'm', description: 'Distance fallen (displacement)' },
    ],
    unknowns: [
      { symbol: 'g', description: 'Gravitational acceleration on asteroid', unit: 'm/s²' },
    ],
    solution: {
      approach: 'Use kinematic equation relating velocity, acceleration, and displacement',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the kinematic equation that relates initial velocity, final velocity, acceleration, and displacement' },
      { level: 2, hint: 'The equation v² = v₀² + 2aΔx applies here, where a is the gravitational acceleration' },
      { level: 3, hint: 'Substitute the known values and solve algebraically for the acceleration' },
    ],
    tags: ["free-fall","kinematics-equations","gravitational-acceleration","asteroid-physics"],
  },

  {
    id: 'pdf-ch3-p1',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 3, Problem 1',
    concepts: ["displacement","position","velocity"],
    difficulty: 2,
    type: 'calculation',
    estimatedMinutes: 10,
    title: 'Pythagorean Theorem for Displacement',
    statement: 'You walk in a two-dimensional path. You walk 14 blocks in all, 9 east followed by 5 north. What is the straight-line distance?',
    givenValues: [
      { symbol: 'd_east', value: 9, unit: 'blocks', description: 'displacement east' },
      { symbol: 'd_north', value: 5, unit: 'blocks', description: 'displacement north' },
    ],
    unknowns: [
      { symbol: 'd_total', description: 'straight-line distance', unit: 'blocks' },
    ],
    solution: {
      approach: 'Use the Pythagorean theorem since the two displacement vectors are perpendicular.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'The east and north displacements are perpendicular to each other.' },
      { level: 2, hint: 'Use the Pythagorean theorem: $c^2 = a^2 + b^2$ where c is the hypotenuse.' },
      { level: 3, hint: 'The straight-line distance is shorter than the total path walked (14 blocks).' },
    ],
    tags: ["pythagorean-theorem","displacement","two-dimensional-motion","vectors"],
  },

  {
    id: 'pdf-ch3-p2',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 3, Problem 2',
    concepts: ["displacement","velocity","projectile-motion"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 15,
    title: 'Woman Takes a Walk - Vector Addition',
    statement: 'Use the graphical technique for adding vectors to find the total displacement of a person who walks the following three paths (displacements) on a flat field. First, she walks 25.0 m in a direction 49.0° north of east. Then, she walks 23.0 m heading 15.0° north of east. Finally, she turns and walks 32.0 m in a direction 68.0° south of east.',
    givenValues: [
      { symbol: 'd₁', value: 25, unit: 'm', description: 'first displacement magnitude' },
      { symbol: 'θ₁', value: 49, unit: 'degrees north of east', description: 'first displacement direction' },
      { symbol: 'd₂', value: 23, unit: 'm', description: 'second displacement magnitude' },
      { symbol: 'θ₂', value: 15, unit: 'degrees north of east', description: 'second displacement direction' },
      { symbol: 'd₃', value: 32, unit: 'm', description: 'third displacement magnitude' },
      { symbol: 'θ₃', value: 68, unit: 'degrees south of east', description: 'third displacement direction' },
    ],
    unknowns: [
      { symbol: 'R', description: 'resultant displacement magnitude', unit: 'm' },
      { symbol: 'θ_R', description: 'resultant displacement direction', unit: 'degrees' },
    ],
    solution: {
      approach: 'Use the head-to-tail method to add vectors graphically, then measure the resultant magnitude and direction.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'Use the head-to-tail method: place each vector\'s tail at the previous vector\'s head.' },
      { level: 2, hint: 'The resultant vector goes from the tail of the first vector to the head of the last vector.' },
      { level: 3, hint: 'Vector addition is commutative - you can add the vectors in any order and get the same result.' },
    ],
    tags: ["vector-addition","head-to-tail-method","displacement","graphical-methods","two-dimensional-motion"],
  },

  {
    id: 'pdf-ch3-p3',
    source: 'curated',
    sourceReference: 'College Physics for AP Courses 2e, Chapter 3, Problem 3',
    concepts: ["displacement","velocity"],
    difficulty: 3,
    type: 'multi-step',
    estimatedMinutes: 12,
    title: 'Woman Sailing a Boat - Vector Subtraction',
    statement: 'A woman sailing a boat at night is following directions to a dock. The instructions read to first sail 27.5 m in a direction 66.0° north of east from her current location, and then travel 30.0 m in a direction 112° north of east (or 22° west of north). If the woman makes a mistake and travels in the opposite direction for the second leg of the trip, where will she end up? Compare this location with the location of the dock.',
    givenValues: [
      { symbol: 'd₁', value: 27.5, unit: 'm', description: 'first displacement magnitude' },
      { symbol: 'θ₁', value: 66, unit: 'degrees north of east', description: 'first displacement direction' },
      { symbol: 'd₂', value: 30, unit: 'm', description: 'second displacement magnitude' },
      { symbol: 'θ₂', value: 112, unit: 'degrees north of east', description: 'intended second displacement direction' },
    ],
    unknowns: [
      { symbol: 'R_dock', description: 'displacement to dock', unit: 'm' },
      { symbol: 'R_actual', description: 'actual displacement with mistake', unit: 'm' },
      { symbol: 'Δ', description: 'difference between actual and intended positions', unit: 'm' },
    ],
    solution: {
      approach: 'Calculate the intended path to the dock, then calculate the actual path with the mistake, and find the difference using vector subtraction.',
      steps: [
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
        {
          stepNumber: 1,
          description: 'Calculate',
        },
      ],
      finalAnswer: { text: 'See explanation above' },
    },
    hints: [
      { level: 1, hint: 'First find where the dock is located, then find where she actually ends up.' },
      { level: 2, hint: 'The opposite direction means adding 180° to the original angle.' },
      { level: 3, hint: 'Vector subtraction A⃗ - B⃗ equals A⃗ + (-B⃗), where -B⃗ has the same magnitude as B⃗ but opposite direction.' },
    ],
    tags: ["vector-subtraction","displacement","navigation","graphical-methods","two-dimensional-motion"],
  },
];
