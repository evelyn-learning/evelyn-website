/**
 * Batch-4 fixtures, part "wave" (wave_diagram: transverse, standing) — see
 * practice-figure-fixtures-batch4.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  // --- wave_diagram: transverse ---------------------------------------------
  {
    id: 'wave-transverse-simple',
    note: 'simple: two cycles, amplitude arrow in the left margin and wavelength crest to crest, both printed',
    question: 'The wave shown has a frequency of 4 Hz. What is its speed?',
    alt: 'A snapshot of a transverse wave: two full cycles about a dashed equilibrium line, with its amplitude and its wavelength marked by labelled arrows.',
    spec: { type: 'wave_diagram', params: { variant: 'transverse', amplitude: 0.2, wavelength: 1.5 } },
  },
  {
    id: 'wave-transverse-dense-labels-points',
    note: 'dense: starts on a crest, 2.5 cycles, crest / trough / equilibrium words, two lettered points, direction arrow with a speed',
    question: 'The wave shown travels to the right. In which direction is the point Q moving at this instant?',
    alt: 'A snapshot of a transverse wave with two and a half cycles. A crest, a trough and the equilibrium position are named, two points on the wave carry letters, and an arrow shows the wave travelling to the right.',
    spec: { type: 'wave_diagram', params: { variant: 'transverse', amplitude: 3, wavelength: 8, xUnit: 'cm', yUnit: 'cm', cycles: 2.5, start: 'cosine', labels: ['crest', 'trough', 'equilibrium'], points: [{ x: 4, label: 'P' }, { x: 10, label: 'Q' }], direction: 'right', speedLabel: 'v = 12 cm/s' } },
  },
  {
    id: 'wave-transverse-blank-wavelength',
    note: 'a "?" on the wavelength; the amplitude printed; the speed given on the direction arrow',
    question: 'The wave shown has a frequency of 5 Hz. What is the wavelength marked "?"?',
    alt: 'A snapshot of a transverse wave travelling to the right. Its amplitude is labelled; the distance from one crest to the next is marked with a boxed question mark.',
    spec: { type: 'wave_diagram', params: { variant: 'transverse', amplitude: 0.5, wavelength: 2.4, showWavelength: 'blank', direction: 'right', speedLabel: 'v = 12 m/s' } },
  },
  {
    id: 'wave-transverse-scale-read-off',
    note: 'scale: numbered axes and a grid, nothing printed — amplitude and wavelength are read; two points; travelling left',
    question: 'The graph shows a snapshot of a wave on a rope. What is the amplitude of the wave?',
    alt: 'A graph of displacement in centimetres against position in metres showing two full cycles of a wave, with two lettered points on it and an arrow showing it travels to the left.',
    spec: { type: 'wave_diagram', params: { variant: 'transverse', amplitude: 4, wavelength: 2, yUnit: 'cm', scale: true, xStep: 0.5, yStep: 2, yMax: 6, points: [{ x: 1.25, label: 'P' }, { x: 3, label: 'Q' }], direction: 'left', speedLabel: 'v' } },
  },
  {
    id: 'wave-transverse-time-blank-amplitude',
    note: 'displacement against TIME: the horizontal dimension is the period; three cycles; a "?" on the amplitude',
    question: 'The record shows the displacement of one point of a string as a wave passes. What is the frequency of the wave?',
    alt: 'A record of displacement against time for one point: three full cycles about a dashed equilibrium line. The time for one cycle is labelled; the amplitude is marked with a boxed question mark.',
    spec: { type: 'wave_diagram', params: { variant: 'transverse', axis: 'time', amplitude: 5, period: 0.4, yUnit: 'cm', showAmplitude: 'blank', cycles: 3 } },
  },
  // --- wave_diagram: standing -----------------------------------------------
  {
    id: 'wave-standing-simple-third-harmonic',
    note: 'simple: a string in its third harmonic, node dots only, the length printed',
    question: 'The string shown vibrates in a standing wave. What is the wavelength of the wave?',
    alt: 'A standing wave on a string clamped at both ends, drawn as a solid and a dashed curve forming three loops, with a dot at each node and the length of the string marked.',
    spec: { type: 'wave_diagram', params: { variant: 'standing', harmonics: [3], length: 1.2 } },
  },
  {
    id: 'wave-standing-dense-three-harmonics',
    note: 'dense: the first three harmonics stacked, every node lettered N and every antinode A, the harmonic numbers printed',
    question: 'The first three standing waves on a string are shown. The first has a frequency of 110 Hz. What is the frequency of the third?',
    alt: 'Three standing waves on the same string, one under another, with one, two and three loops. Nodes and antinodes are lettered, each row is numbered, and the length of the string is marked.',
    spec: { type: 'wave_diagram', params: { variant: 'standing', harmonics: [1, 2, 3], length: 0.9, nodes: 'labels', antinodes: 'labels', harmonicLabels: 'value' } },
  },
  {
    id: 'wave-standing-blank-pipe-closed',
    note: 'a tube closed at one end, first and third harmonics, "n = ?" on each row and a "?" on the length',
    question: 'The two standing waves shown are in a tube closed at one end. The lower one has a wavelength of 0.8 m. How long is the tube?',
    alt: 'Two standing waves in a tube closed at its left end and open at its right end, one under the other. Nodes are dots and antinodes are rings. The number of each harmonic and the length of the tube are marked with boxed question marks.',
    spec: { type: 'wave_diagram', params: { variant: 'standing', medium: 'open_closed', harmonics: [1, 3], length: 0.6, showLength: 'blank', harmonicLabels: 'blank', antinodes: 'dots' } },
  },
  {
    id: 'wave-standing-open-pipe-lettered',
    note: 'a tube open at both ends in its second harmonic, N and A lettered, the length named L',
    question: 'The standing wave shown is in a tube open at both ends. In terms of L, what is its wavelength?',
    alt: 'A standing wave in a tube open at both ends, with antinodes at the two ends and in the middle and two nodes between them, each lettered. The length of the tube is marked with a letter.',
    spec: { type: 'wave_diagram', params: { variant: 'standing', medium: 'open_open', harmonics: [2], showLength: 'name', nodes: 'labels', antinodes: 'labels' } },
  },
];
