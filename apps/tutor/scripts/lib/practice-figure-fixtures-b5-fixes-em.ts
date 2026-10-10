/**
 * Batch-5 fixtures, part "fixes-em" (fix f: mechanics_setup drawn NOT to
 * scale, so an asked-for angle or height cannot be measured off the sketch) —
 * see practice-figure-fixtures-batch5.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const M = (params: Record<string, unknown>): FigureFixture['spec'] => ({ type: 'mechanics_setup', params });

export const FIXTURES: FigureFixture[] = [
  {
    id: 'fix5-f-pendulum-blank-angle-not-to-scale',
    note: 'f: the release angle is what the question asks — drawn at the fixed 35°, not at the true 60°, with "not to scale" under the sketch; length and rise printed',
    question: 'A pendulum 2.0 m long is released from the position shown, where the bob is 1.0 m above its lowest point. What angle does the string make with the vertical?',
    alt: 'A simple pendulum pulled to one side of a dashed vertical line. The length of the string and the height of the bob above its lowest position are marked; the angle from the vertical is a boxed question mark. The sketch is marked not to scale.',
    spec: M({ variant: 'pendulum', angle: 60, length: 2, notToScale: true, show: { angle: 'blank', height: 'value' } }),
  },
  {
    id: 'fix5-f-pendulum-blank-height-small-angle',
    note: 'f: a 10° swing whose rise is asked — at its true angle the height dimension would be a sliver (and readable against the length); not to scale it has room',
    question: 'The pendulum shown is released from rest. How far above its lowest point does the bob start?',
    alt: 'A simple pendulum pulled to one side of a dashed vertical line, with the length of the string and the angle from the vertical marked. A dimension line for the height of the bob above its lowest position is a boxed question mark. The sketch is marked not to scale.',
    spec: M({ variant: 'pendulum', angle: 10, length: 1.5, notToScale: true, show: { height: 'blank' }, points: [{ angle: 10, label: 'P' }, { angle: 0, label: 'Q' }] }),
  },
  {
    id: 'fix5-f-projectile-blank-angle-not-to-scale',
    note: 'f: the launch angle is asked — the path is the fixed schematic shape (50°), not the true 20° parabola; range printed, the points keep their order',
    question: 'A ball launched at 28 m/s from level ground lands 51.4 m away, as shown. At what angle above the horizontal was it launched, if the angle is less than 45°? (g = 9.8 m/s²)',
    alt: 'A projectile launched from level ground along a dashed path that rises to a highest point and falls back. The launch speed and the horizontal distance to the landing point are marked; the launch angle is a boxed question mark. The sketch is marked not to scale.',
    spec: M({ variant: 'projectile', speed: 28, angle: 20, notToScale: true, show: { angle: 'blank', range: 'value' }, points: [{ at: 'apex', label: 'P' }, { at: 'landing', label: 'Q' }] }),
  },
  {
    id: 'fix5-f-incline-blank-angle-not-to-scale',
    note: 'f: the incline angle is asked — the wedge is drawn at the fixed 32°, not at the true 50°',
    question: 'The blocks shown are at rest on a frictionless incline. What is the angle of the incline?',
    alt: 'A block on a frictionless inclined plane connected by a string over a pulley at the top of the incline to a second block hanging beside it. Both masses are marked; the angle of the incline is a boxed question mark. The sketch is marked not to scale.',
    spec: M({ variant: 'pulley', arrangement: 'incline', m1: 5, m2: 3.83, angle: 50, frictionless: true, notToScale: true, show: { angle: 'blank' } }),
  },
];
