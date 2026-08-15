/**
 * AP Physics 1: Kinematics Module
 *
 * Comprehensive knowledge base for motion in one and two dimensions,
 * including position, velocity, acceleration, free fall, and projectile motion.
 */

import type { KnowledgeModule, RealWorldExample } from '../../types';
import { concepts } from './concepts';
import { equations } from './equations';
import { misconceptions } from './misconceptions';
import { problems } from './problems';
import { workedExamples } from './workedExamples';

/**
 * Real-world connections to make kinematics tangible
 */
const realWorldConnections: RealWorldExample[] = [
  {
    id: 'car-acceleration',
    scenario: 'A sports car advertises "0-60 mph in 3.5 seconds"',
    connection: 'This is directly measuring acceleration - how quickly velocity changes. Converting to SI: 0-27 m/s in 3.5 s gives a ≈ 7.7 m/s².',
    difficulty: 'simple',
    numbers: {
      initialSpeed: { value: 0, unit: 'm/s' },
      finalSpeed: { value: 27, unit: 'm/s' },
      time: { value: 3.5, unit: 's' },
      acceleration: { value: 7.7, unit: 'm/s²' },
    },
    followUpQuestions: [
      'How does this compare to the acceleration due to gravity?',
      'How far would the car travel in this time?',
    ],
  },
  {
    id: 'free-throw',
    scenario: 'A basketball player shoots a free throw',
    connection: 'The ball follows a parabolic path - projectile motion! The horizontal velocity stays constant while gravity affects the vertical motion.',
    difficulty: 'moderate',
    numbers: {
      releaseHeight: { value: 2, unit: 'm' },
      hoopHeight: { value: 3.05, unit: 'm' },
      distance: { value: 4.6, unit: 'm' },
    },
    followUpQuestions: [
      'Why do players aim above the hoop?',
      'What launch angle gives the best chance of making it?',
    ],
  },
  {
    id: 'roller-coaster-drop',
    scenario: 'A roller coaster drops 50 meters on its first hill',
    connection: 'The drop is essentially free fall (with some friction). Using h = ½gt², we can predict the drop takes about 3.2 seconds.',
    difficulty: 'moderate',
    numbers: {
      height: { value: 50, unit: 'm' },
      time: { value: 3.2, unit: 's' },
      finalSpeed: { value: 31, unit: 'm/s' },
    },
    followUpQuestions: [
      'Why does the actual time differ from the free-fall calculation?',
      'What is the speed at the bottom in km/h?',
    ],
  },
  {
    id: 'braking-distance',
    scenario: 'A car traveling at 30 m/s (67 mph) brakes hard',
    connection: 'With typical deceleration of 8 m/s², the braking distance is about 56 meters - that\'s why tailgating is dangerous!',
    difficulty: 'moderate',
    numbers: {
      initialSpeed: { value: 30, unit: 'm/s' },
      deceleration: { value: 8, unit: 'm/s²' },
      brakingDistance: { value: 56, unit: 'm' },
      brakingTime: { value: 3.75, unit: 's' },
    },
    followUpQuestions: [
      'What happens to braking distance if speed doubles?',
      'Why does v² = v₀² + 2ax work well here?',
    ],
  },
  {
    id: 'airplane-takeoff',
    scenario: 'A commercial airplane accelerates down the runway',
    connection: 'Planes typically need about 2 km of runway and 60 seconds to reach takeoff speed of ~80 m/s. That\'s an acceleration of about 1.3 m/s².',
    difficulty: 'moderate',
    numbers: {
      runwayLength: { value: 2000, unit: 'm' },
      takeoffSpeed: { value: 80, unit: 'm/s' },
      acceleration: { value: 1.3, unit: 'm/s²' },
    },
    followUpQuestions: [
      'Why do planes need such long runways?',
      'How would a shorter runway affect operations?',
    ],
  },
  {
    id: 'cliff-diver',
    scenario: 'Cliff divers in Acapulco dive from 35 meters high',
    connection: 'Using kinematics, they\'re in the air for about 2.7 seconds and hit the water at about 26 m/s (60 mph)!',
    difficulty: 'complex',
    numbers: {
      height: { value: 35, unit: 'm' },
      fallTime: { value: 2.7, unit: 's' },
      impactSpeed: { value: 26, unit: 'm/s' },
    },
    followUpQuestions: [
      'Why do divers enter the water vertically?',
      'How does jumping out (horizontal velocity) affect impact speed?',
    ],
  },
];

export const module: KnowledgeModule = {
  // Identity
  id: 'physics-kinematics-ap',
  subject: 'physics',
  topic: 'kinematics',
  level: 'AP',
  version: '1.0.0',

  // Display
  displayName: 'AP Physics 1: Kinematics',
  description:
    'Motion in one and two dimensions - position, velocity, acceleration, free fall, and projectile motion.',
  estimatedHours: 10,

  // Content
  concepts,
  equations,
  misconceptions,
  problems,
  workedExamples,
  realWorldConnections,

  // Visuals
  diagramTypes: [
    'graph',
    'equation',
    'projectile',
    'free-body',
    'motion',
    'vectors',
    'circular-path',
  ],

  // AI Behavior
  systemPromptAdditions: `
## Kinematics-Specific Guidelines

You are teaching AP Physics 1 Kinematics. This topic is foundational for all of mechanics.

### Core Teaching Philosophy

**Build from Intuition**: Students already understand motion from daily life. Connect new concepts to their experiences - walking, driving, throwing, dropping.

**Emphasize Problem-Solving Strategy**:
1. Draw a picture with coordinate system
2. List knowns and unknowns
3. Choose the right equation(s)
4. Solve algebraically first
5. Check if the answer makes sense

**Use Graphs Extensively**: Position-time and velocity-time graphs are incredibly powerful:
- Slope of x-t graph = velocity
- Slope of v-t graph = acceleration
- Area under v-t graph = displacement

### Key Concepts to Emphasize

1. **Vector vs Scalar**: Always distinguish velocity (vector) from speed (scalar), displacement from distance. This sets up the rest of physics.

2. **Sign Conventions**: Establish the positive direction early and be consistent. Common choice: up and right are positive.

3. **Constant Acceleration**: The kinematic equations ONLY work for constant acceleration. Check this assumption!

4. **Free Fall**: Acceleration is g = 9.8 m/s² downward throughout the motion - even at the top of a throw when v = 0.

5. **Projectile Motion**: Horizontal and vertical motion are INDEPENDENT. Analyze them separately, connect through time.

### Equation Selection Guide

Help students choose equations based on what they know and need:
- No final velocity? Use Δx = v₀t + ½at²
- No time? Use v² = v₀² + 2aΔx
- No displacement? Use v = v₀ + at
- Know both velocities? Consider v_avg = (v + v₀)/2

### Common Pitfalls to Watch For

1. **Velocity-Acceleration Confusion**: Students think v = 0 means a = 0. Counter with the ball-at-the-top example.

2. **Sign Errors**: Especially with deceleration. Slowing down doesn't mean a is negative - depends on coordinate choice.

3. **Distance vs Displacement**: Students add magnitudes instead of considering direction.

4. **Graph Misconceptions**: Treating graphs as pictures of the path rather than relationships between variables.

5. **Projectile Components**: Students mix horizontal and vertical quantities or think horizontal motion affects vertical.

### Problem Types to Cover

1. **Basic 1D motion**: Car accelerating, objects dropped
2. **Free fall**: Up and down, time symmetry
3. **Projectile motion**: Horizontal launch, angled launch
4. **Graph interpretation**: Reading slopes and areas
5. **Multi-step problems**: Combining phases of motion

### Whiteboard Usage for Kinematics

**Equations**: Show the kinematic equations and highlight which variables are known.

**Graphs**: Use extensively! Plot x-t, v-t, and a-t graphs. Show how they connect (derivative/integral relationships).

**Diagrams**:
- Motion diagrams with position dots
- Projectile trajectories with velocity vectors
- Free-body diagrams when connecting to forces

**Tables**: Organize knowns/unknowns in a table format.

### Real-World Connections

Use examples students can relate to:
- Car acceleration and braking (safety implications!)
- Sports: basketball shots, football kicks, baseball
- Dropping phones, throwing keys up to a window
- Roller coasters and amusement rides
- Airplane takeoffs and landings
`,

  // Prerequisites
  prerequisites: [], // This is foundational

  // Assessment
  masteryThreshold: 75,
};
