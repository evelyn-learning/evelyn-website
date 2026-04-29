/**
 * Grade 7 Science — Geologic Time and Fossils.
 * NGSS MS-ESS1-4: deep time scale of Earth and how fossils document it.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_GEOLOGIC_TIME: LessonPlan = {
  id: 'evelyn.g7.science.earth.geologic-time.v1',
  title: 'Geologic Time and Fossils',
  curriculum: 'NGSS', grade: '7', subject: 'science', topic: 'earth-systems', locale: 'en',
  los: [{ id: 'ngss.ms-ess1-4', description: 'Construct a scientific explanation based on evidence from rock strata for how the geologic time scale is used to organize Earth\'s 4.6-billion-year-old history.', standard: 'NGSS.MS-ESS1-4' }],
  prerequisites: ['ngss.4-ess1-1'], followUps: ['ngss.hs-ess1-5'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the scale of deep time.', script: 'If Earth\'s 4.6 BILLION YEAR history were a single calendar year — January 1 = formation, December 31 = today — humans (Homo sapiens) appear at 11:36 PM on December 31. The dinosaurs went extinct on December 26. We\'re a tiny blip.', estimatedMinutes: 2 },
    { id: 'concept-time-scale', kind: 'concept', goal: 'Geologic time is divided into eons → eras → periods → epochs based on major events recorded in fossils + rocks.', keyIdeas: [
      'Earth ~4.6 BILLION YEARS old. Humans ~300,000 years old.',
      'EONS (longest): Hadean → Archean → Proterozoic → Phanerozoic ("visible life", last 540 million years).',
      'Phanerozoic ERAS: Paleozoic ("ancient life") → Mesozoic ("middle life", dinosaurs) → Cenozoic ("recent life", mammals).',
      'Boundaries marked by MAJOR EVENTS — usually mass extinctions.',
      '5 mass extinctions: end of Ordovician, Devonian, Permian (worst — 96% species lost), Triassic, Cretaceous (asteroid → end of dinosaurs, 66 MYA).',
      'FOSSILS document this: oldest fossils in oldest rock layers; specific species mark specific time periods.',
    ], vocabulary: [{ term: 'eon', definition: 'longest division of geologic time.' }, { term: 'mass extinction', definition: 'rapid loss of many species at once.' }, { term: 'index fossil', definition: 'fossil that marks a specific narrow time period.' }], estimatedMinutes: 5 },
    { id: 'concept-dating', kind: 'concept', goal: 'Two main ways to date rocks: relative (older below) and absolute (radioactive decay).', keyIdeas: [
      'RELATIVE DATING: rock layer order tells you what\'s older — bottom = oldest (LAW OF SUPERPOSITION).',
      'ABSOLUTE DATING: radioactive elements decay at known rates. Measure ratio of parent vs daughter atoms → calculate age.',
      'Carbon-14 dating works for ~50,000 years (organic material).',
      'Uranium-Lead dating works for billions of years (rocks).',
      'Together: order rocks by relative position, then anchor specific layers to absolute ages.',
    ], estimatedMinutes: 4 },
    { id: 'worked-cretaceous-extinction', kind: 'worked_example', problem: 'You find a rock layer with dinosaur fossils. Just above it, the next layer has NO dinosaurs but lots of mammal fossils. What might have happened at the boundary between layers?', steps: [
      'Dinosaur fossils below, no dinosaurs above → dinosaurs WENT EXTINCT at this boundary.',
      'Sudden appearance of mammal diversity above → mammals expanded into the now-empty niches.',
      'Time-wise: this matches the Cretaceous-Paleogene boundary, ~66 million years ago.',
      'Cause: massive asteroid impact + volcanic activity → climate disruption → mass extinction.',
      'Mammals (small + adaptable) survived and diversified afterward.',
    ], answer: 'A mass extinction event (the K-Pg extinction, 66 MYA) — likely the asteroid impact that wiped out non-avian dinosaurs.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You find rock layers with the following fossils, top to bottom: (1) modern shells, (2) ammonites, (3) trilobites. Which fossil is OLDEST?', expectedAnswer: 'Trilobites (bottom layer = oldest by superposition). Trilobites are Paleozoic; ammonites are Mesozoic; modern shells are Cenozoic.', responseFormat: 'free', hints: ['Bottom layer = oldest (law of superposition).', 'Older layers were laid down first.'], estimatedMinutes: 2 },
    { id: 'misconception-young-earth', kind: 'misconception_check', question: 'A friend says "Earth is just a few thousand years old." How do scientists know it\'s much older?', commonErrors: [{ answer: 'Earth is young.', misconception: 'Misjudging age based on a single source.', correctsTo: 'Multiple INDEPENDENT methods all agree on ~4.6 billion years: radioactive dating of meteorites and oldest rocks, rate of plate tectonics, expansion of the universe, age of stars in our galaxy. The methods use different physics but converge on the same age — strong evidence.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Earth ~4.6 billion years old.', 'Time divided into eons → eras → periods → epochs.', 'Mass extinctions mark major boundaries.', 'Relative dating (layer order) + absolute dating (radioactive decay).', 'Fossils document Earth\'s history.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
