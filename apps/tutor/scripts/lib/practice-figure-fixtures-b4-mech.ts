/**
 * Batch-4 fixtures, part "mech" (mechanics_setup: projectile, pulley, spring_mass, pendulum,
 * collision, circular) — see practice-figure-fixtures-batch4.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const M = (params: Record<string, unknown>) => ({ type: 'mechanics_setup', params });

export const FIXTURES: FigureFixture[] = [
  // --- projectile -----------------------------------------------------------
  {
    id: 'mech-projectile-angled',
    note: 'simple: launched from the ground at an angle; speed and angle printed, nothing computed is shown',
    question: 'A ball is kicked from level ground as shown. How long is it in the air? (g = 9.8 m/s²)',
    alt: 'A ball launched from level ground at an angle, with its launch speed and launch angle marked and a dashed curved path that comes back down to the ground.',
    spec: M({ variant: 'projectile', speed: 20, angle: 30 }),
  },
  {
    id: 'mech-projectile-cliff-dense',
    note: 'dense: launched at an angle from a cliff, lettered points at the apex, at 3 s and at landing, height, maximum height and range all dimensioned',
    question: 'A stone is thrown from the top of a cliff as shown. At which lettered point is its speed least?',
    alt: 'A stone thrown upward at an angle from the top of a cliff. A dashed path rises to a highest point and falls to the ground beyond the cliff, with three lettered points on it and dimension lines for heights and horizontal distance.',
    spec: M({ variant: 'projectile', speed: 25, angle: 53.13, height: 25, g: 10, points: [{ at: 'apex', label: 'P' }, { at: 3, label: 'Q' }, { at: 'landing', label: 'R' }], show: { angle: 'value', height: 'value', maxHeight: 'value', range: 'value' }, symbols: { speed: 'v' } }),
  },
  {
    id: 'mech-projectile-blank-range-table',
    note: 'level launch from a table; the range is the "?"',
    question: 'A marble rolls off a table as shown. How far from the foot of the table does it land? (g = 9.8 m/s²)',
    alt: 'A marble leaving the edge of a table horizontally and following a dashed curved path to the floor. The height of the table is marked and the horizontal distance to the landing point is left blank.',
    spec: M({ variant: 'projectile', speed: 3, angle: 0, height: 1.225, platform: 'table', show: { range: 'blank' } }),
  },
  {
    id: 'mech-projectile-blank-max-height',
    note: 'steep launch, maximum height asked for, angle named θ by hiding its value is not possible — the angle is printed',
    question: 'A projectile is launched as shown. What maximum height does it reach? (g = 10 m/s²)',
    alt: 'A projectile launched steeply from level ground with its speed and angle marked. A vertical dimension line at the highest point of the dashed path is left blank.',
    spec: M({ variant: 'projectile', speed: 30, angle: 60, g: 10, show: { maxHeight: 'blank' } }),
  },
  // --- pulley ----------------------------------------------------------------
  {
    id: 'mech-pulley-atwood',
    note: 'simple: Atwood machine, both masses printed',
    question: 'The two blocks shown are released from rest. What is the magnitude of their acceleration? (g = 9.8 m/s²; ignore the mass of the pulley and string)',
    alt: 'An Atwood machine: a pulley hanging from a ceiling with a string over it and a block hanging from each end, each block marked with its mass.',
    spec: M({ variant: 'pulley', arrangement: 'atwood', m1: 3, m2: 5 }),
  },
  {
    id: 'mech-pulley-incline-dense',
    note: 'dense: block on a rough incline tied over a pulley at the top to a hanging block — both masses, the angle and the friction coefficient printed',
    question: 'The system shown is released from rest and the hanging block moves down. What is the tension in the string? (g = 9.8 m/s²)',
    alt: 'A block on an inclined plane connected by a string over a pulley at the top of the incline to a second block hanging beside it. The masses, the angle of the incline and a friction coefficient are marked.',
    spec: M({ variant: 'pulley', arrangement: 'incline', m1: 4, m2: 6, angle: 30, mu: 0.2 }),
  },
  {
    id: 'mech-pulley-table-blank-mass',
    note: 'block on a frictionless table tied over the edge to a hanging block whose mass is the "?"',
    question: 'The block on the frictionless table shown accelerates at 2.45 m/s². What is the mass of the hanging block? (g = 9.8 m/s²)',
    alt: 'A block on a table connected by a string over a pulley at the table edge to a hanging block. The table is marked frictionless, the mass of the block on the table is given and the mass of the hanging block is left blank.',
    spec: M({ variant: 'pulley', arrangement: 'table', m1: 6, m2: 2, frictionless: true, show: { m2: 'blank' } }),
  },
  // --- spring_mass -------------------------------------------------------------
  {
    id: 'mech-spring-horizontal',
    note: 'simple: a horizontal spring stretched from equilibrium; k and x printed, the block unnamed apart from "m"',
    question: 'The spring shown is stretched from its equilibrium position. What force does it exert on the block?',
    alt: 'A block attached to a wall by a horizontal coil spring. A dashed line marks the equilibrium position and a dimension line marks how far the spring is stretched past it; the spring constant is given.',
    spec: M({ variant: 'spring_mass', k: 200, x: 0.15 }),
  },
  {
    id: 'mech-spring-vertical-dense',
    note: 'dense: a hanging spring stretched below equilibrium with k, m and x all printed',
    question: 'The block shown is pulled down from equilibrium and released. What is the period of its oscillation?',
    alt: 'A block hanging from a ceiling on a vertical coil spring, pulled below a dashed equilibrium line. The spring constant, the mass of the block and the displacement are marked.',
    spec: M({ variant: 'spring_mass', orientation: 'vertical', k: 80, m: 0.5, x: 0.04 }),
  },
  {
    id: 'mech-spring-blank-compressed',
    note: 'a compressed horizontal spring; the compression is the "?"',
    question: 'The spring shown stores 4.0 J of elastic potential energy. By how much is it compressed?',
    alt: 'A block pressed against a horizontal coil spring attached to a wall, compressed short of a dashed equilibrium line. The spring constant and the mass are marked and the compression distance is left blank.',
    spec: M({ variant: 'spring_mass', k: 800, m: 2, x: -0.1, show: { x: 'blank' } }),
  },
  // --- pendulum ----------------------------------------------------------------
  {
    id: 'mech-pendulum-length',
    note: 'simple: length and angle printed',
    question: 'What is the period of the pendulum shown for small swings? (g = 9.8 m/s²)',
    alt: 'A simple pendulum hanging from a ceiling, drawn pulled to one side of a dashed vertical line, with the length of the string and the angle from the vertical marked.',
    spec: M({ variant: 'pendulum', angle: 20, length: 0.99 }),
  },
  {
    id: 'mech-pendulum-dense-points',
    note: 'dense: length, mass, angle, the height above the lowest point, the swing path and three lettered positions',
    question: 'The pendulum shown is released from rest at position X. At which lettered position is its kinetic energy greatest?',
    alt: 'A pendulum drawn at the right-hand end of a dashed swing path with three lettered positions on the path. The string length, the mass of the bob, the angle from the vertical and the height of the bob above its lowest point are marked.',
    spec: M({ variant: 'pendulum', angle: 50, length: 2, mass: 0.5, show: { height: 'value' }, showArc: true, points: [{ angle: 50, label: 'X' }, { angle: 0, label: 'Y' }, { angle: -30, label: 'Z' }] }),
  },
  {
    id: 'mech-pendulum-blank-height',
    note: 'the height of the bob above its lowest point is the "?"; the angle is printed',
    question: 'The pendulum shown is held at rest. How high is the bob above its lowest point?',
    alt: 'A pendulum pulled well to one side of a dashed vertical line, with the string length and angle marked. A dashed outline shows the bob at its lowest point and the vertical distance between the two positions is left blank.',
    spec: M({ variant: 'pendulum', angle: 60, length: 1.2, show: { height: 'blank' } }),
  },
  // --- collision ---------------------------------------------------------------
  {
    id: 'mech-collision-head-on',
    note: 'simple: two carts, one at rest, bounce apart — every value printed',
    question: 'Two carts collide on a frictionless track as shown. Is the collision elastic?',
    alt: 'Two carts on a track shown before and after a collision. Before, the left cart moves right and the right cart is at rest; after, both carts move right. Each cart is marked with its mass and each arrow with a speed.',
    spec: M({ variant: 'collision', masses: [2, 2], before: [4, 0], after: [1, 3] }),
  },
  {
    id: 'mech-collision-dense-opposite',
    note: 'dense: carts approach from both sides and both reverse; all six values printed, custom names',
    question: 'Carts X and Y collide head-on as shown. How much kinetic energy is lost in the collision?',
    alt: 'Two carts named "X" and "Y" on a track before and after a head-on collision. Before, they move toward each other; after, they move apart. Masses and speeds are marked.',
    spec: M({ variant: 'collision', masses: [3, 1.5], before: [2, -4], after: [-1, 2], labels: ['X', 'Y'] }),
  },
  {
    id: 'mech-collision-blank-stick',
    note: 'perfectly inelastic: the carts leave joined and their shared velocity is the "?"',
    question: 'The two carts shown stick together when they collide. What is their velocity just after the collision?',
    alt: 'Two carts on a track before and after a collision. Before, the left cart moves right toward a cart at rest; after, the two carts are joined and their velocity is left blank.',
    spec: M({ variant: 'collision', masses: [1.5, 0.5], before: [6, 0], after: 4.5, show: { v1: 'blank' } }),
  },
  // --- circular ----------------------------------------------------------------
  {
    id: 'mech-circular-ball',
    note: 'simple: an object on a circular path, its velocity arrow, radius and speed printed',
    question: 'A ball moves in a horizontal circle as shown. What is the magnitude of its centripetal acceleration?',
    alt: 'A top view of a ball on a dashed circular path with an arrow tangent to the circle showing its velocity. The radius of the circle and the speed are marked.',
    spec: M({ variant: 'circular', radius: 0.8, speed: 4 }),
  },
  {
    id: 'mech-circular-dense-orbit',
    note: 'dense: a satellite in orbit round a named body — velocity and force arrows, radius, speed and mass printed, clockwise',
    question: 'A satellite orbits Earth as shown. What is the magnitude of the gravitational force F on it?',
    alt: 'A satellite on a dashed circular orbit round a disc named "Earth", moving clockwise, with one arrow along its direction of travel and one arrow pointing at Earth. The orbit radius, the speed and the mass are marked.',
    spec: M({ variant: 'circular', radius: 7000, speed: 7.5, mass: 400, lengthUnit: 'km', speedUnit: 'km/s', direction: 'clockwise', position: 120, arrows: ['velocity', 'force'], center: 'Earth' }),
  },
  {
    id: 'mech-circular-blank-speed',
    note: 'the speed is the "?"; the acceleration arrow is drawn dashed and named',
    question: 'A 2 kg puck moves in a circle as shown, held by a string whose tension is 36 N. What is its speed?',
    alt: 'A top view of a puck on a dashed circular path with a velocity arrow whose value is left blank and a dashed arrow pointing to the centre. The radius and the mass are marked.',
    spec: M({ variant: 'circular', radius: 0.5, mass: 2, position: 300, arrows: ['velocity', 'acceleration'], show: { speed: 'blank' } }),
  },
];
