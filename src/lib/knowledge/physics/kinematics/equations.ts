/**
 * AP Physics 1: Kinematics - Equations
 */

import type { Equation } from '../../types';

export const equations: Equation[] = [
  {
    id: 'velocity-definition',
    name: 'Definition of Average Velocity',
    latex: 'v_{avg} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_f - x_i}{t_f - t_i}',
    description: 'Average velocity equals displacement divided by time interval',

    variables: [
      { symbol: 'v_{avg}', name: 'Average velocity', description: 'Rate of position change over the interval', unit: 'm/s' },
      { symbol: 'Δx', name: 'Displacement', description: 'Change in position (final - initial)', unit: 'm' },
      { symbol: 'Δt', name: 'Time interval', description: 'Duration of motion', unit: 's' },
    ],

    useWhen: [
      'Finding average velocity from displacement and time',
      'Finding displacement when you know average velocity and time',
      'Any motion (doesn\'t require constant acceleration)',
    ],

    limitations: [
      'Gives average, not instantaneous velocity',
      'Cannot determine acceleration from this alone',
    ],

    commonMistakes: [
      'Using distance instead of displacement',
      'Confusing average velocity with average speed',
    ],
  },

  {
    id: 'acceleration-definition',
    name: 'Definition of Average Acceleration',
    latex: 'a_{avg} = \\frac{\\Delta v}{\\Delta t} = \\frac{v_f - v_i}{t_f - t_i}',
    description: 'Average acceleration equals change in velocity divided by time interval',

    variables: [
      { symbol: 'a_{avg}', name: 'Average acceleration', description: 'Rate of velocity change', unit: 'm/s²' },
      { symbol: 'Δv', name: 'Change in velocity', description: 'Final velocity minus initial velocity', unit: 'm/s' },
      { symbol: 'Δt', name: 'Time interval', description: 'Duration over which velocity changes', unit: 's' },
    ],

    useWhen: [
      'Finding acceleration from velocity change and time',
      'Finding velocity change when you know acceleration and time',
    ],

    limitations: [
      'Gives average acceleration for the interval',
      'For constant acceleration, average = instantaneous',
    ],

    commonMistakes: [
      'Forgetting acceleration can be negative',
      'Confusing acceleration with velocity',
    ],
  },

  {
    id: 'kinematic-1',
    name: 'Velocity-Time Relation',
    latex: 'v = v_0 + at',
    description: 'Final velocity equals initial velocity plus acceleration times time',

    variables: [
      { symbol: 'v', name: 'Final velocity', description: 'Velocity at time t', unit: 'm/s' },
      { symbol: 'v_0', name: 'Initial velocity', description: 'Velocity at t = 0', unit: 'm/s' },
      { symbol: 'a', name: 'Acceleration', description: 'Constant acceleration', unit: 'm/s²' },
      { symbol: 't', name: 'Time', description: 'Time elapsed since start', unit: 's' },
    ],

    useWhen: [
      'Know: v₀, a, t — Find: v',
      'Know: v, v₀, a — Find: t',
      'Know: v, v₀, t — Find: a',
      'Don\'t have or need displacement (x)',
    ],

    limitations: [
      'Only valid for constant acceleration',
      'Cannot find position/displacement with this alone',
    ],

    derivation: {
      steps: [
        'Start with definition: a = Δv/Δt = (v - v₀)/t',
        'Solve for v: multiply both sides by t',
        'at = v - v₀',
        'Add v₀ to both sides: v = v₀ + at',
      ],
    },

    commonMistakes: [
      'Using when acceleration is not constant',
      'Getting signs wrong for a or v₀',
      'Forgetting to convert units (e.g., km/h to m/s)',
    ],

    graphicalMeaning: {
      description: 'On a v-t graph, this is a straight line with slope a and y-intercept v₀',
      whiteboard: {
        action: 'showGraph',
        type: 'velocity-time',
        data: {
          title: 'v = v₀ + at',
          xLabel: 'Time (s)',
          yLabel: 'Velocity (m/s)',
          xRange: [0, 5],
          yRange: [0, 30],
          functions: [{ fn: '5 + 4*t', label: 'v = 5 + 4t' }],
        },
      },
    },
  },

  {
    id: 'kinematic-2',
    name: 'Position-Time Relation',
    latex: 'x = x_0 + v_0 t + \\frac{1}{2}at^2',
    description: 'Position equals initial position plus initial velocity times time plus half acceleration times time squared',

    variables: [
      { symbol: 'x', name: 'Final position', description: 'Position at time t', unit: 'm' },
      { symbol: 'x_0', name: 'Initial position', description: 'Position at t = 0', unit: 'm' },
      { symbol: 'v_0', name: 'Initial velocity', description: 'Velocity at t = 0', unit: 'm/s' },
      { symbol: 'a', name: 'Acceleration', description: 'Constant acceleration', unit: 'm/s²' },
      { symbol: 't', name: 'Time', description: 'Time elapsed', unit: 's' },
    ],

    useWhen: [
      'Know: x₀, v₀, a, t — Find: x',
      'Know: x, x₀, v₀, a — Find: t (quadratic!)',
      'Don\'t have or need final velocity',
    ],

    limitations: [
      'Only valid for constant acceleration',
      'Finding t requires solving quadratic equation',
    ],

    derivation: {
      steps: [
        'Average velocity for constant acceleration: v_avg = (v₀ + v)/2',
        'Displacement = average velocity × time: Δx = v_avg × t',
        'Substitute v = v₀ + at: Δx = [(v₀ + v₀ + at)/2] × t',
        'Simplify: Δx = v₀t + ½at²',
        'Add initial position: x = x₀ + v₀t + ½at²',
      ],
    },

    commonMistakes: [
      'Forgetting the ½ in front of at²',
      'Using the wrong sign for a',
      'Not recognizing when you need to solve a quadratic for t',
    ],

    graphicalMeaning: {
      description: 'On an x-t graph, this is a parabola. The curvature indicates acceleration direction.',
      whiteboard: {
        action: 'showGraph',
        type: 'position-time',
        data: {
          title: 'x = x₀ + v₀t + ½at²',
          xLabel: 'Time (s)',
          yLabel: 'Position (m)',
          xRange: [0, 5],
          yRange: [0, 60],
          functions: [{ fn: '10 + 5*t + 0.5*2*t^2', label: 'x = 10 + 5t + t²' }],
        },
      },
    },
  },

  {
    id: 'kinematic-3',
    name: 'Velocity-Position Relation (Time-Independent)',
    latex: 'v^2 = v_0^2 + 2a\\Delta x',
    description: 'Final velocity squared equals initial velocity squared plus twice acceleration times displacement',

    variables: [
      { symbol: 'v', name: 'Final velocity', description: 'Velocity at final position', unit: 'm/s' },
      { symbol: 'v_0', name: 'Initial velocity', description: 'Velocity at initial position', unit: 'm/s' },
      { symbol: 'a', name: 'Acceleration', description: 'Constant acceleration', unit: 'm/s²' },
      { symbol: 'Δx', name: 'Displacement', description: 'Change in position (x - x₀)', unit: 'm' },
    ],

    useWhen: [
      'Time is not given and not needed',
      'Know: v₀, a, Δx — Find: v',
      'Know: v, v₀, Δx — Find: a',
      'Know: v, v₀, a — Find: Δx',
    ],

    limitations: [
      'Only valid for constant acceleration',
      'Cannot find time with this equation alone',
      'Watch out: gives v², so v could be ± (check physics!)',
    ],

    derivation: {
      steps: [
        'From v = v₀ + at, solve for t: t = (v - v₀)/a',
        'Substitute into x = x₀ + v₀t + ½at²',
        'After algebra: v² = v₀² + 2aΔx',
        'Alternative: Use energy concepts (½mv² change = work)',
      ],
    },

    commonMistakes: [
      'Forgetting to take square root to get v (and consider ±)',
      'Using distance instead of displacement for Δx',
      'Sign errors with acceleration',
    ],
  },

  {
    id: 'kinematic-4',
    name: 'Average Velocity (Constant Acceleration)',
    latex: 'v_{avg} = \\frac{v_0 + v}{2}',
    description: 'For constant acceleration, average velocity is the arithmetic mean of initial and final velocities',

    variables: [
      { symbol: 'v_{avg}', name: 'Average velocity', description: 'Mean velocity during motion', unit: 'm/s' },
      { symbol: 'v_0', name: 'Initial velocity', description: 'Velocity at start', unit: 'm/s' },
      { symbol: 'v', name: 'Final velocity', description: 'Velocity at end', unit: 'm/s' },
    ],

    useWhen: [
      'Finding average velocity from endpoints',
      'Combined with Δx = v_avg × t for quick solutions',
      'Useful for symmetry arguments in projectile motion',
    ],

    limitations: [
      'ONLY valid for constant acceleration',
      'For non-constant acceleration, must integrate',
    ],

    commonMistakes: [
      'Using this formula when acceleration is not constant',
      'Confusing with average speed (total distance / total time)',
    ],
  },

  {
    id: 'free-fall-g',
    name: 'Free Fall Acceleration',
    latex: 'g = 9.8 \\, \\text{m/s}^2 \\approx 10 \\, \\text{m/s}^2',
    description: 'The magnitude of acceleration due to gravity near Earth\'s surface',

    variables: [
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Magnitude of acceleration due to gravity', unit: 'm/s²' },
    ],

    useWhen: [
      'Any free fall or projectile motion problem',
      'Use -g when taking "up" as positive',
      'Use +g when taking "down" as positive',
    ],

    limitations: [
      'Assumes near Earth\'s surface',
      'Assumes air resistance is negligible',
      'Varies slightly with altitude and location',
    ],

    commonMistakes: [
      'Forgetting the sign depends on coordinate system choice',
      'Thinking g is negative (g is a magnitude, always positive)',
      'Using g = 10 when precision matters',
    ],
  },

  {
    id: 'projectile-components',
    name: 'Projectile Motion Component Equations',
    latex: 'v_{0x} = v_0 \\cos\\theta \\quad v_{0y} = v_0 \\sin\\theta',
    description: 'Breaking initial velocity into horizontal and vertical components',

    variables: [
      { symbol: 'v_{0x}', name: 'Initial horizontal velocity', description: 'Horizontal component of initial velocity', unit: 'm/s' },
      { symbol: 'v_{0y}', name: 'Initial vertical velocity', description: 'Vertical component of initial velocity', unit: 'm/s' },
      { symbol: 'v_0', name: 'Initial speed', description: 'Magnitude of initial velocity', unit: 'm/s' },
      { symbol: 'θ', name: 'Launch angle', description: 'Angle above horizontal', unit: 'degrees' },
    ],

    useWhen: [
      'Starting any projectile motion problem',
      'When given initial speed and angle',
    ],

    limitations: [
      'Assumes angle measured from horizontal',
      'Make sure calculator is in correct mode (degrees vs radians)',
    ],

    commonMistakes: [
      'Swapping sine and cosine',
      'Calculator in wrong angle mode',
      'Using these components in the wrong kinematic equations',
    ],
  },

  {
    id: 'projectile-range',
    name: 'Projectile Range (Level Ground)',
    latex: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
    description: 'Horizontal distance traveled by a projectile launched and landing at the same height',

    variables: [
      { symbol: 'R', name: 'Range', description: 'Horizontal distance traveled', unit: 'm' },
      { symbol: 'v_0', name: 'Initial speed', description: 'Launch speed', unit: 'm/s' },
      { symbol: 'θ', name: 'Launch angle', description: 'Angle above horizontal', unit: 'degrees' },
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Usually 9.8 m/s²', unit: 'm/s²' },
    ],

    useWhen: [
      'Finding range for projectile on level ground',
      'Quick calculations when memorized',
      'Comparing ranges for different angles',
    ],

    limitations: [
      'Only works when launch and landing heights are the same',
      'Ignores air resistance',
      'Not required to memorize for AP exam (can derive)',
    ],

    commonMistakes: [
      'Using when landing height differs from launch height',
      'Forgetting it\'s sin(2θ), not sin(θ)',
      'Not recognizing maximum range is at 45°',
    ],
  },

  // ============================================================================
  // ADDITIONAL EQUATIONS FROM OPENSTAX UNIVERSITY PHYSICS
  // ============================================================================
  {
    id: 'instantaneous-velocity',
    name: 'Instantaneous Velocity (Calculus)',
    latex: 'v(t) = \\frac{dx}{dt} = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t}',
    description: 'Instantaneous velocity is the derivative of position with respect to time. On a position-time graph, it is the slope of the tangent line.',
    // From OpenStax University Physics Vol. 1, Equation 3.4

    variables: [
      { symbol: 'v(t)', name: 'Instantaneous velocity', description: 'Velocity at a specific instant', unit: 'm/s' },
      { symbol: 'dx/dt', name: 'Time derivative of position', description: 'Rate of change of position', unit: 'm/s' },
    ],

    useWhen: [
      'Finding velocity from a position function x(t)',
      'Position varies non-linearly with time',
      'Need velocity at a specific instant, not average',
    ],

    limitations: [
      'Requires calculus (differentiation)',
      'Position function must be differentiable',
    ],

    commonMistakes: [
      'Confusing with average velocity',
      'Errors in differentiation (forgetting power rule, chain rule)',
      'Not evaluating at the correct time',
    ],
  },

  {
    id: 'instantaneous-acceleration',
    name: 'Instantaneous Acceleration (Calculus)',
    latex: 'a(t) = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}',
    description: 'Instantaneous acceleration is the derivative of velocity with respect to time (or second derivative of position). On a v-t graph, it is the slope of the tangent line.',
    // From OpenStax University Physics Vol. 1, Equation 3.9

    variables: [
      { symbol: 'a(t)', name: 'Instantaneous acceleration', description: 'Acceleration at a specific instant', unit: 'm/s²' },
      { symbol: 'dv/dt', name: 'Time derivative of velocity', description: 'Rate of change of velocity', unit: 'm/s²' },
      { symbol: 'd²x/dt²', name: 'Second derivative of position', description: 'Rate of change of rate of change of position', unit: 'm/s²' },
    ],

    useWhen: [
      'Finding acceleration from velocity or position function',
      'Acceleration is not constant',
      'Need to analyze motion at a specific instant',
    ],

    limitations: [
      'Requires calculus (differentiation)',
      'Velocity or position function must be differentiable',
    ],

    commonMistakes: [
      'Forgetting that constant velocity means zero acceleration',
      'Sign errors when differentiating',
      'Confusing slope of x-t graph (velocity) with slope of v-t graph (acceleration)',
    ],
  },

  {
    id: 'position-from-velocity-integral',
    name: 'Position from Velocity (Integration)',
    latex: 'x(t) = x_0 + \\int_0^t v(t\')\\, dt\'',
    description: 'Position is the initial position plus the integral of velocity over time. Graphically, displacement equals the area under the v-t curve.',
    // From OpenStax University Physics Vol. 1, Equation 3.18

    variables: [
      { symbol: 'x(t)', name: 'Position at time t', description: 'Final position', unit: 'm' },
      { symbol: 'x_0', name: 'Initial position', description: 'Position at t = 0', unit: 'm' },
      { symbol: 'v(t\')', name: 'Velocity function', description: 'Velocity as a function of time', unit: 'm/s' },
    ],

    useWhen: [
      'Have velocity as a function of time and need position',
      'Velocity is not constant',
      'Finding displacement from a v-t graph (area under curve)',
    ],

    limitations: [
      'Requires calculus (integration)',
      'Velocity function must be integrable',
      'Need to know initial position',
    ],

    commonMistakes: [
      'Forgetting the constant of integration (x₀)',
      'Sign errors with areas below the time axis',
      'Not recognizing that area under v-t curve gives displacement, not distance',
    ],
  },

  {
    id: 'velocity-from-acceleration-integral',
    name: 'Velocity from Acceleration (Integration)',
    latex: 'v(t) = v_0 + \\int_0^t a(t\')\\, dt\'',
    description: 'Velocity is the initial velocity plus the integral of acceleration over time. Graphically, Δv equals the area under the a-t curve.',
    // From OpenStax University Physics Vol. 1, Equation 3.17

    variables: [
      { symbol: 'v(t)', name: 'Velocity at time t', description: 'Final velocity', unit: 'm/s' },
      { symbol: 'v_0', name: 'Initial velocity', description: 'Velocity at t = 0', unit: 'm/s' },
      { symbol: 'a(t\')', name: 'Acceleration function', description: 'Acceleration as a function of time', unit: 'm/s²' },
    ],

    useWhen: [
      'Have acceleration as a function of time and need velocity',
      'Acceleration is not constant',
      'Finding velocity change from an a-t graph (area under curve)',
    ],

    limitations: [
      'Requires calculus (integration)',
      'Acceleration function must be integrable',
      'Need to know initial velocity',
    ],

    commonMistakes: [
      'Forgetting the initial velocity term',
      'Integration errors',
      'Confusing area under a-t graph (gives Δv) with area under v-t graph (gives Δx)',
    ],
  },

  {
    id: 'maximum-height-free-fall',
    name: 'Maximum Height (Vertical Throw)',
    latex: 'h_{max} = \\frac{v_0^2}{2g}',
    description: 'Maximum height reached by an object thrown straight up with initial velocity v₀',
    // Derived from kinematic equations (OpenStax University Physics Vol. 1)

    variables: [
      { symbol: 'h_{max}', name: 'Maximum height', description: 'Highest point above launch position', unit: 'm' },
      { symbol: 'v_0', name: 'Initial velocity', description: 'Upward velocity at launch', unit: 'm/s' },
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Usually 9.8 m/s²', unit: 'm/s²' },
    ],

    useWhen: [
      'Object thrown straight up',
      'Need maximum height without finding time first',
      'Quick calculations for vertical projectile problems',
    ],

    derivation: {
      steps: [
        'At maximum height, v = 0',
        'Use v² = v₀² - 2gh',
        'Set v = 0: 0 = v₀² - 2gh_max',
        'Solve: h_max = v₀²/(2g)',
      ],
    },

    limitations: [
      'Only for vertical motion (straight up/down)',
      'Ignores air resistance',
      'Height is above launch point, not above ground',
    ],

    commonMistakes: [
      'Using when there is horizontal motion (projectile at angle)',
      'Forgetting to square v₀',
      'Confusing h_max with total height above ground',
    ],
  },

  {
    id: 'time-of-flight-vertical',
    name: 'Total Time of Flight (Vertical Throw)',
    latex: 't_{total} = \\frac{2v_0}{g}',
    description: 'Total time in air for an object thrown straight up and caught at the same height',
    // Derived from kinematic equations (OpenStax University Physics Vol. 1)

    variables: [
      { symbol: 't_{total}', name: 'Total time', description: 'Time from launch to return', unit: 's' },
      { symbol: 'v_0', name: 'Initial velocity', description: 'Upward velocity at launch', unit: 'm/s' },
      { symbol: 'g', name: 'Gravitational acceleration', description: 'Usually 9.8 m/s²', unit: 'm/s²' },
    ],

    useWhen: [
      'Object thrown straight up and returns to same height',
      'Quick calculation using symmetry of motion',
    ],

    derivation: {
      steps: [
        'Time to reach peak: 0 = v₀ - gt_up → t_up = v₀/g',
        'By symmetry, time down = time up',
        't_total = 2t_up = 2v₀/g',
      ],
    },

    limitations: [
      'Only works when start and end heights are the same',
      'Only for vertical motion',
      'Ignores air resistance',
    ],

    commonMistakes: [
      'Using when launch and landing heights differ',
      'Forgetting the factor of 2',
      'Applying to projectile motion at an angle',
    ],
  },
];
