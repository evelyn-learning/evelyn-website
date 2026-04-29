/**
 * Grade 4 Science — Information Transfer with Patterns.
 * NGSS 4-PS4-3: generate and compare multiple solutions that use
 * patterns to transfer information.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_SCI_INFORMATION_TRANSFER: LessonPlan = {
  id: 'evelyn.g4.science.physics.information-transfer.v1',
  title: 'Sending Information with Patterns',
  curriculum: 'NGSS', grade: '4', subject: 'science', topic: 'waves', locale: 'en',
  los: [{ id: 'ngss.4-ps4-3', description: 'Generate and compare multiple solutions that use patterns to transfer information.', standard: 'NGSS.4-PS4-3' }],
  prerequisites: ['ngss.4-ps4-1'], followUps: ['ngss.ms-ps4-3'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Bring it to life with familiar signals.', script: 'A flashing red brake light. A song. A text message. They all SEND INFORMATION using patterns. How does information travel through air, wires, or light?', estimatedMinutes: 2 },
    { id: 'concept-patterns-as-info', kind: 'concept', goal: 'Information travels via patterns: ON/OFF, dots/dashes, frequencies, colors. Different signals use different patterns.', keyIdeas: [
      'Information needs a CODE — a pattern someone can decode at the other end.',
      'BINARY: just 1 and 0 (or ON/OFF). Computers use this.',
      'MORSE CODE: short and long pulses (dots and dashes) for letters.',
      'TRAFFIC LIGHTS: color codes (red = stop, green = go).',
      'RADIO: information rides on radio waves at specific frequencies; different stations = different frequencies.',
      'SOUND: voice modulates wave amplitude and frequency.',
      'WIFI / CELL: pattern of radio waves carrying digital code.',
    ], vocabulary: [{ term: 'code', definition: 'a system of patterns that means something.' }, { term: 'signal', definition: 'a pattern that carries information.' }], estimatedMinutes: 4 },
    { id: 'worked-morse', kind: 'worked_example', problem: 'In Morse code, S = "...". O = "---". Send "SOS" using flashes of a flashlight.', steps: [
      'S = three short flashes (dot dot dot).',
      'O = three long flashes (dash dash dash).',
      'S = three short flashes again.',
      'Pause between letters so the receiver knows where one letter ends.',
      'Total: short-short-short / long-long-long / short-short-short.',
    ], answer: '"SOS" = ... --- ... using a flashlight (short / long / short flashes).', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why do traffic lights use COLORS instead of just one bulb that flashes faster or slower?', expectedAnswer: 'Colors are easier to interpret instantly and at a distance. Each color is a clear distinct signal — red/yellow/green can\'t be confused even at high speed. A flashing pattern would take more time and attention to decode.', responseFormat: 'free', hints: ['Think about driving fast — what\'s easier to read in a split second?', 'Distinct categories (colors) vs counting flashes.'], estimatedMinutes: 3 },
    { id: 'misconception-info-needs-wires', kind: 'misconception_check', question: 'A friend says "phones need wires to send messages — that\'s how the words get there." But what about cell phones?', commonErrors: [{ answer: 'Yes — info needs wires.', misconception: 'Believing all information transfer requires physical connection.', correctsTo: 'Cell phones, WiFi, radio, and TV all use INVISIBLE WAVES (radio waves, light waves) to send information through the air. No wire needed. The waves carry coded patterns that the receiver decodes.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Information travels via patterns (codes).', 'Codes use ON/OFF, colors, frequencies, etc.', 'Wires are ONE way; waves through air work too.', 'Same idea applies to phones, radio, and computers.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
