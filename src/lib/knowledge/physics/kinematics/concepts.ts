/**
 * AP Physics 1: Kinematics - Core Concepts
 */

import type { Concept } from '../../types';

export const concepts: Concept[] = [
  // ==========================================================================
  // FOUNDATIONAL CONCEPTS
  // ==========================================================================
  {
    id: 'position',
    name: 'Position',
    category: 'foundational',
    prerequisiteConcepts: [],

    definition: {
      formal: 'Position is a vector quantity that describes the location of an object relative to a chosen reference point (origin) in a coordinate system.',
      intuitive: 'Position tells you where something is. It\'s like giving directions - you need to say where you\'re measuring from and which way is positive.',
      forVoice: 'Position is simply where something is located. We always measure it from some starting point we choose, called the origin.',
    },

    keyPoints: [
      'Position is a vector - it has both magnitude and direction',
      'Position depends on your choice of origin and coordinate system',
      'The symbol for position is usually x or y (or r for 2D/3D)',
      'Units are typically meters (m) in physics',
    ],

    symbols: [
      { symbol: 'x', meaning: 'Position along x-axis', unit: 'meters', unitSymbol: 'm' },
      { symbol: 'y', meaning: 'Position along y-axis', unit: 'meters', unitSymbol: 'm' },
      { symbol: 'x₀', meaning: 'Initial position', unit: 'meters', unitSymbol: 'm' },
    ],

    explanations: [
      {
        id: 'position-number-line',
        approach: 'graphical',
        name: 'Number Line Approach',
        content: 'Think of position like a number line. You pick a zero point - that\'s your origin. Everything to the right is positive, everything to the left is negative. Your position is just the number on that line where you\'re standing.',
        bestFor: 'Visual learners, students struggling with signs',
      },
      {
        id: 'position-gps',
        approach: 'analogy',
        name: 'GPS Analogy',
        content: 'Position is like GPS coordinates. Your phone tells you where you are, but it only makes sense because we all agree on what those numbers mean - a reference system covering the whole Earth.',
        bestFor: 'Making the concept relatable',
      },
    ],

    realWorldExamples: [
      {
        id: 'position-mile-markers',
        scenario: 'Mile markers on a highway',
        connection: 'Mile markers are positions measured from a starting point (usually state border or city center)',
        difficulty: 'simple',
      },
      {
        id: 'position-football-field',
        scenario: 'Yard lines on a football field',
        connection: 'The 50-yard line is the origin, with positions measured toward each end zone',
        difficulty: 'simple',
      },
    ],

    commonErrors: [
      {
        error: 'Forgetting position can be negative',
        why: 'Students often think of position as distance, which is always positive',
        detection: ['Position is 5 meters', 'Can\'t have negative position'],
        correction: 'Remember, position is measured from the origin. If you go left of the origin, your position is negative - like -3 meters means 3 meters to the left of where you started measuring.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Identify position values from diagrams',
        exampleTask: 'Look at this number line. What is the position of object A?',
        successCriteria: 'Correctly reads position including sign',
      },
      {
        level: 'application',
        description: 'Determine positions in real scenarios',
        exampleTask: 'A car is 200m east of a traffic light. If east is positive, what is its position?',
        successCriteria: 'Sets up coordinate system and states position correctly',
      },
    ],

    checkQuestions: [
      'If I\'m at position -5 meters, what does that negative sign tell us?',
      'Can two people standing in the same spot have different positions? How?',
    ],

    masteryIndicators: [
      'Correctly interprets positive and negative positions',
      'Understands position depends on reference frame choice',
      'Can set up appropriate coordinate systems for problems',
    ],
  },

  // ==========================================================================
  {
    id: 'displacement',
    name: 'Displacement',
    category: 'foundational',
    prerequisiteConcepts: ['position'],

    definition: {
      formal: 'Displacement is the change in position of an object, calculated as final position minus initial position: Δx = x_f - x_i',
      intuitive: 'Displacement is how far you ended up from where you started, and in what direction. It\'s the straight-line difference between start and finish.',
      forVoice: 'Displacement tells you the change in position - where you ended up minus where you started. It\'s not about the path you took, just start to finish.',
    },

    keyPoints: [
      'Displacement is a vector (has direction)',
      'Displacement can be zero even if you moved (round trip)',
      'Displacement ≠ distance traveled',
      'Symbol: Δx (delta x) where Δ means "change in"',
    ],

    symbols: [
      { symbol: 'Δx', meaning: 'Displacement (change in position)', unit: 'meters', unitSymbol: 'm' },
      { symbol: 'd', meaning: 'Displacement (alternative symbol)', unit: 'meters', unitSymbol: 'm' },
    ],

    explanations: [
      {
        id: 'displacement-vs-distance',
        approach: 'intuitive',
        name: 'Displacement vs Distance',
        content: 'Imagine walking around a track and ending where you started. You might have walked 400 meters - that\'s your distance. But your displacement? Zero! You ended up right where you began. Displacement only cares about start and end points.',
        bestFor: 'Addressing the most common misconception',
      },
      {
        id: 'displacement-arrow',
        approach: 'graphical',
        name: 'Arrow Visualization',
        content: 'Draw an arrow from where you started to where you ended. The length of that arrow is the magnitude of displacement, and where it points is the direction. Doesn\'t matter what crazy path you took - just that straight arrow.',
        bestFor: 'Visual learners',
      },
    ],

    realWorldExamples: [
      {
        id: 'displacement-home',
        scenario: 'Walking to school and back home',
        connection: 'You might walk 2 km total, but if you end at home, displacement is zero',
        difficulty: 'simple',
      },
      {
        id: 'displacement-cyclist',
        scenario: 'Cyclist going around a circular park',
        connection: 'If they return to start, displacement is zero regardless of how far they cycled',
        difficulty: 'moderate',
        followUpQuestions: [
          'What if they stopped halfway around?',
          'How would displacement compare to distance in that case?',
        ],
      },
    ],

    commonErrors: [
      {
        error: 'Confusing displacement with distance',
        why: 'In everyday language, we use these interchangeably',
        detection: ['displacement is how far they traveled', 'displacement is always positive'],
        correction: 'Distance is total path length (always positive). Displacement is just final minus initial position (can be negative, can be zero). A round trip has lots of distance but zero displacement!',
      },
      {
        error: 'Forgetting displacement can be negative',
        why: 'Students think of it as a "distance" which is positive',
        detection: ['displacement is 10 meters when moving backward'],
        correction: 'If you move in the negative direction, your displacement is negative. Moving 5 meters to the left means Δx = -5 m.',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate displacement from positions',
        exampleTask: 'Start at x = 3m, end at x = -2m. What\'s the displacement?',
        successCriteria: 'Correctly calculates Δx = -5m',
      },
      {
        level: 'application',
        description: 'Distinguish displacement from distance',
        exampleTask: 'A person walks 4m east, then 3m west. Find displacement AND distance.',
        successCriteria: 'Gets displacement = 1m east, distance = 7m',
      },
    ],

    checkQuestions: [
      'If you run around a 400m track and end where you started, what\'s your displacement?',
      'Can displacement ever be larger than distance? Why or why not?',
    ],

    masteryIndicators: [
      'Clearly distinguishes displacement from distance',
      'Correctly handles negative displacements',
      'Can calculate displacement from position data',
    ],
  },

  // ==========================================================================
  {
    id: 'velocity',
    name: 'Velocity',
    category: 'core',
    prerequisiteConcepts: ['displacement'],

    definition: {
      formal: 'Velocity is the rate of change of position with respect to time, v = Δx/Δt. It is a vector quantity with both magnitude (speed) and direction.',
      intuitive: 'Velocity tells you how fast something is moving AND which direction it\'s going. It\'s displacement divided by time.',
      forVoice: 'Velocity is how quickly your position changes. It\'s displacement divided by time - so it tells you both how fast and which way.',
    },

    keyPoints: [
      'Velocity is a vector (speed + direction)',
      'Speed is the magnitude of velocity (always positive)',
      'Average velocity = total displacement / total time',
      'Instantaneous velocity = velocity at a specific moment',
      'Units: meters per second (m/s)',
    ],

    symbols: [
      { symbol: 'v', meaning: 'Velocity', unit: 'meters per second', unitSymbol: 'm/s' },
      { symbol: 'v₀', meaning: 'Initial velocity', unit: 'meters per second', unitSymbol: 'm/s' },
      { symbol: 'v̄', meaning: 'Average velocity', unit: 'meters per second', unitSymbol: 'm/s' },
    ],

    explanations: [
      {
        id: 'velocity-vs-speed',
        approach: 'intuitive',
        name: 'Velocity vs Speed',
        content: 'Your car speedometer shows speed - just how fast, always positive. But velocity includes direction. Driving 60 mph north is a different velocity than 60 mph south, even though the speed is the same.',
        bestFor: 'Addressing velocity/speed confusion',
      },
      {
        id: 'velocity-graph',
        approach: 'graphical',
        name: 'Position-Time Graph',
        content: 'On a position-time graph, velocity is the slope. Steep slope means fast, flat means stopped. Slope going up means positive velocity, slope going down means negative velocity.',
        bestFor: 'Connecting to graphs, visual learners',
      },
    ],

    realWorldExamples: [
      {
        id: 'velocity-car',
        scenario: 'Car driving on highway',
        connection: 'Speedometer shows speed (60 mph), but velocity would be "60 mph east"',
        difficulty: 'simple',
        numbers: {
          speed: { value: 60, unit: 'mph' },
        },
      },
    ],

    commonErrors: [
      {
        error: 'Using speed and velocity interchangeably',
        why: 'Everyday language doesn\'t distinguish them',
        detection: ['velocity is 30 mph', 'speed is negative'],
        correction: 'Speed is just the number - always positive. Velocity includes direction and can be negative. Think: speed is on your speedometer, velocity is speed plus "which way".',
      },
      {
        error: 'Thinking negative velocity means slowing down',
        why: 'Confusing velocity with acceleration',
        detection: ['negative velocity means decelerating'],
        correction: 'Negative velocity just means moving in the negative direction - like moving left or backward. You can have negative velocity and be speeding up, slowing down, or moving at constant speed!',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate average velocity',
        exampleTask: 'You travel 100m east in 20s. What\'s your average velocity?',
        successCriteria: 'Gets 5 m/s east (or +5 m/s)',
      },
      {
        level: 'application',
        description: 'Find velocity from position-time graph',
        exampleTask: 'From this position-time graph, what\'s the velocity during the first 5 seconds?',
        successCriteria: 'Correctly calculates slope',
      },
    ],

    checkQuestions: [
      'A car goes 30 mph north, then 30 mph south. Same speed - is the velocity the same?',
      'On a position-time graph, what does a horizontal line mean for velocity?',
    ],

    masteryIndicators: [
      'Distinguishes velocity from speed',
      'Can read velocity from position-time graphs',
      'Understands negative velocity means direction, not slowing',
    ],
  },

  // ==========================================================================
  {
    id: 'acceleration',
    name: 'Acceleration',
    category: 'core',
    prerequisiteConcepts: ['velocity'],

    definition: {
      formal: 'Acceleration is the rate of change of velocity with respect to time, a = Δv/Δt. It is a vector quantity.',
      intuitive: 'Acceleration is how quickly your velocity changes. It can mean speeding up, slowing down, or changing direction.',
      forVoice: 'Acceleration is how fast your velocity is changing. Speeding up, slowing down, or turning - all involve acceleration.',
    },

    keyPoints: [
      'Acceleration is a vector',
      'Acceleration ≠ velocity (common confusion)',
      'Negative acceleration doesn\'t always mean slowing down',
      'Units: meters per second squared (m/s²)',
      'Constant acceleration means velocity changes by the same amount each second',
    ],

    symbols: [
      { symbol: 'a', meaning: 'Acceleration', unit: 'meters per second squared', unitSymbol: 'm/s²' },
      { symbol: 'g', meaning: 'Acceleration due to gravity', unit: 'meters per second squared', unitSymbol: 'm/s²' },
    ],

    explanations: [
      {
        id: 'acceleration-intuitive',
        approach: 'intuitive',
        name: 'Rate of Change of Rate of Change',
        content: 'Position changes - that\'s velocity. Velocity changes - that\'s acceleration. It\'s the "change of the change." When you press the gas pedal, you feel acceleration. When you brake, that\'s also acceleration (negative).',
        bestFor: 'Building intuition',
      },
      {
        id: 'acceleration-negative',
        approach: 'step-by-step',
        name: 'Understanding Negative Acceleration',
        content: 'Negative acceleration just means acceleration in the negative direction. If you\'re moving right (positive) and slow down, acceleration is negative (leftward). But if you\'re moving left (negative) and speed up, acceleration is ALSO negative! The sign tells direction, not whether you\'re speeding up or slowing down.',
        bestFor: 'Addressing major misconception',
      },
    ],

    realWorldExamples: [
      {
        id: 'acceleration-car',
        scenario: 'Car accelerating from stoplight',
        connection: 'Going from 0 to 60 mph in 10 seconds is acceleration',
        difficulty: 'simple',
      },
      {
        id: 'acceleration-brake',
        scenario: 'Car braking to stop',
        connection: 'Slowing from 30 m/s to 0 in 5 seconds: a = -6 m/s²',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Thinking negative acceleration always means slowing down',
        why: 'The word "deceleration" creates this confusion',
        detection: ['negative acceleration means braking', 'slowing down so acceleration is negative'],
        correction: 'Negative acceleration means acceleration pointing in the negative direction. Whether you speed up or slow down depends on which way you\'re moving! Moving left and speeding up? That\'s negative acceleration too.',
      },
      {
        error: 'Confusing velocity and acceleration',
        why: 'Both describe motion, easy to mix up',
        detection: ['velocity is 10 m/s² ', 'acceleration is 5 m/s'],
        correction: 'Velocity tells you how fast position changes (m/s). Acceleration tells you how fast velocity changes (m/s²). Notice the units - that\'s a quick way to check!',
      },
    ],

    practiceProgression: [
      {
        level: 'recognition',
        description: 'Calculate average acceleration',
        exampleTask: 'Velocity changes from 10 m/s to 30 m/s in 4 seconds. Find acceleration.',
        successCriteria: 'Gets a = 5 m/s²',
      },
      {
        level: 'analysis',
        description: 'Determine if object speeds up or slows down',
        exampleTask: 'Velocity is -20 m/s and acceleration is -5 m/s². Is the object speeding up or slowing down?',
        successCriteria: 'Correctly identifies speeding up (same sign)',
      },
    ],

    checkQuestions: [
      'If velocity and acceleration have the same sign, is the object speeding up or slowing down?',
      'Can an object have zero velocity but non-zero acceleration?',
    ],

    masteryIndicators: [
      'Correctly interprets negative acceleration',
      'Distinguishes acceleration from velocity',
      'Can determine speeding up vs slowing down from signs',
    ],
  },

  // ==========================================================================
  {
    id: 'free-fall',
    name: 'Free Fall',
    category: 'core',
    prerequisiteConcepts: ['acceleration', 'velocity'],

    definition: {
      formal: 'Free fall is motion under the sole influence of gravity, with constant acceleration g ≈ 9.8 m/s² directed downward, regardless of the object\'s mass.',
      intuitive: 'Free fall is when gravity is the only thing affecting an object\'s motion. Everything falls at the same rate - about 10 m/s faster every second.',
      forVoice: 'Free fall is when only gravity acts on an object. The key insight: everything falls at the same rate, about 9.8 meters per second squared, regardless of mass.',
    },

    keyPoints: [
      'g ≈ 9.8 m/s² (often rounded to 10 m/s²)',
      'Direction of g is always downward',
      'Mass doesn\'t affect free fall (in absence of air resistance)',
      'At the peak of motion, v = 0 but a = g (still accelerating!)',
      'Free fall is a special case of constant acceleration',
    ],

    symbols: [
      { symbol: 'g', meaning: 'Acceleration due to gravity', unit: 'meters per second squared', unitSymbol: 'm/s²' },
    ],

    explanations: [
      {
        id: 'free-fall-galileo',
        approach: 'experimental',
        name: 'Galileo\'s Discovery',
        content: 'Galileo figured out that all objects fall at the same rate, regardless of mass. A hammer and feather dropped together hit the ground at the same time - if there\'s no air! Astronauts actually did this on the Moon.',
        bestFor: 'Historical context, addressing mass misconception',
      },
      {
        id: 'free-fall-peak',
        approach: 'intuitive',
        name: 'Understanding the Peak',
        content: 'When you throw a ball up, at the very top it stops for an instant - velocity is zero. But is acceleration zero? No! Gravity is still pulling at 9.8 m/s². That\'s why it immediately starts falling back down.',
        bestFor: 'Addressing the v=0 means a=0 misconception',
      },
    ],

    realWorldExamples: [
      {
        id: 'free-fall-drop',
        scenario: 'Dropping a ball from a building',
        connection: 'After 1 second: 9.8 m/s. After 2 seconds: 19.6 m/s. Gets 9.8 m/s faster each second.',
        difficulty: 'simple',
      },
      {
        id: 'free-fall-throw-up',
        scenario: 'Throwing a ball straight up',
        connection: 'Ball slows by 9.8 m/s each second going up, speeds up by 9.8 m/s each second coming down',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Thinking heavier objects fall faster',
        why: 'Everyday experience with air resistance misleads',
        detection: ['heavier falls faster', 'bowling ball hits first'],
        correction: 'Without air resistance, everything falls at the same rate! A hammer and feather fall together in a vacuum. Air resistance makes light fluffy things fall slower in real life.',
      },
      {
        error: 'Thinking acceleration is zero at the peak',
        why: 'Velocity is zero at the peak, students confuse v and a',
        detection: ['at the top acceleration is zero', 'no acceleration at peak'],
        correction: 'At the peak, velocity is zero for an instant, but acceleration is still 9.8 m/s² downward! That\'s why the ball starts falling immediately - gravity never stops.',
      },
    ],

    practiceProgression: [
      {
        level: 'application',
        description: 'Calculate free fall velocity',
        exampleTask: 'A ball is dropped. What\'s its velocity after 3 seconds?',
        successCriteria: 'Gets v = 29.4 m/s (or ~30 m/s) downward',
      },
      {
        level: 'analysis',
        description: 'Analyze throw up and catch',
        exampleTask: 'Ball thrown up at 20 m/s. How long until it returns?',
        successCriteria: 'Correctly gets ~4 seconds (up and down)',
      },
    ],

    checkQuestions: [
      'If I drop a bowling ball and a tennis ball at the same time (ignoring air), which hits first?',
      'At the very peak when you throw a ball up, what\'s the acceleration?',
    ],

    masteryIndicators: [
      'Understands all objects fall at the same rate',
      'Correctly handles the peak of projectile motion',
      'Can solve free fall problems with correct signs',
    ],
  },

  // ==========================================================================
  {
    id: 'projectile-motion',
    name: 'Projectile Motion',
    category: 'advanced',
    prerequisiteConcepts: ['velocity', 'acceleration', 'free-fall'],

    definition: {
      formal: 'Projectile motion is two-dimensional motion under gravity where an object moves with constant horizontal velocity while experiencing constant vertical acceleration (g).',
      intuitive: 'Projectile motion is what happens when you throw something at an angle. The key trick: horizontal and vertical motions are completely independent!',
      forVoice: 'Projectile motion is when something moves in two dimensions under gravity, like a thrown ball. The breakthrough: horizontal motion and vertical motion are independent. We can solve them separately!',
    },

    keyPoints: [
      'Horizontal and vertical motions are independent',
      'Horizontal: constant velocity (no acceleration)',
      'Vertical: constant acceleration (g = 9.8 m/s² down)',
      'The shape of the path is a parabola',
      'Time in air depends only on vertical motion',
    ],

    symbols: [
      { symbol: 'vₓ', meaning: 'Horizontal velocity (constant)', unit: 'meters per second', unitSymbol: 'm/s' },
      { symbol: 'vᵧ', meaning: 'Vertical velocity (changes)', unit: 'meters per second', unitSymbol: 'm/s' },
      { symbol: 'θ', meaning: 'Launch angle', unit: 'degrees', unitSymbol: '°' },
    ],

    explanations: [
      {
        id: 'projectile-independence',
        approach: 'intuitive',
        name: 'Independence Principle',
        content: 'Imagine you\'re on a moving train and drop a ball. To you, it falls straight down. To someone outside, it moves in a curve. The horizontal motion (train moving) doesn\'t affect how fast it falls. This is why we can solve projectile motion by treating x and y separately!',
        bestFor: 'Building core intuition',
      },
      {
        id: 'projectile-components',
        approach: 'algebraic',
        name: 'Component Method',
        content: 'Break the initial velocity into components: vₓ = v₀cos(θ) and vᵧ = v₀sin(θ). Then solve horizontal (constant v) and vertical (free fall) separately. They share only one thing: time.',
        bestFor: 'Problem-solving approach',
      },
    ],

    realWorldExamples: [
      {
        id: 'projectile-basketball',
        scenario: 'Basketball shot',
        connection: 'Ball follows parabola; player adjusts angle and speed to get ball through hoop',
        difficulty: 'moderate',
      },
      {
        id: 'projectile-cannon',
        scenario: 'Cannon firing at 45°',
        connection: '45° gives maximum range on level ground - equal split of horizontal and vertical velocity',
        difficulty: 'moderate',
      },
    ],

    commonErrors: [
      {
        error: 'Thinking horizontal velocity changes',
        why: 'Everything else in the problem changes, seems natural',
        detection: ['horizontal acceleration', 'slows down horizontally'],
        correction: 'Gravity only pulls down! There\'s no horizontal force, so horizontal velocity stays constant throughout the flight. Only vertical velocity changes.',
      },
      {
        error: 'Using the wrong component for time calculations',
        why: 'Confusing when to use vₓ vs vᵧ',
        detection: ['using horizontal velocity for time in air'],
        correction: 'Time in the air is determined by vertical motion only. Use the vertical equations to find time, then use that time in horizontal calculations.',
      },
    ],

    practiceProgression: [
      {
        level: 'application',
        description: 'Find range of projectile',
        exampleTask: 'Ball launched at 20 m/s at 30° above horizontal. How far does it go?',
        successCriteria: 'Correctly finds time from vertical, then range from horizontal',
      },
      {
        level: 'synthesis',
        description: 'Design a projectile problem',
        exampleTask: 'What angle should you throw at to hit a target 50m away with a 25 m/s throw?',
        successCriteria: 'Sets up and solves for angle',
      },
    ],

    checkQuestions: [
      'If you double the horizontal velocity, what happens to the time in the air?',
      'At what angle do you get maximum range on level ground?',
    ],

    masteryIndicators: [
      'Correctly separates motion into components',
      'Knows horizontal velocity is constant',
      'Can solve for range, max height, and time of flight',
    ],
  },
];
