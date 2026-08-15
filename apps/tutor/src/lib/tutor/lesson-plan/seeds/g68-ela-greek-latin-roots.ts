/**
 * Grades 6-8 ELA — Greek & Latin Roots.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_GREEK_LATIN_ROOTS: LessonPlan = {
  id: 'evelyn.g68.ela.greek-latin-roots.v1',
  title: 'Grades 6-8 ELA — Greek & Latin Roots',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.greek-latin-roots',
      description: 'Identify common Greek and Latin roots; use them to determine the meaning of unfamiliar words in academic texts.',
      standard: 'CCSS.ELA-LITERACY.L.7.4.B',
    },
  ],
  prerequisites: ['g68.ela.analyzing-media'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Knowing 30 common Greek/Latin roots unlocks the meaning of HUNDREDS of English words.',
      script: 'Geo = earth. Logy = study. Geology = study of the earth. Bio = life. Logy = study. Biology = study of life. Once you know the roots, you can guess at words you\'ve never seen — geomorphic, biotic, oncology, cryogenic. Today we drill the high-impact roots.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-roots',
      kind: 'concept',
      goal: 'Top Greek/Latin roots + how to apply them.',
      keyIdeas: [
        'WHY ENGLISH LOVES THESE ROOTS: scientific, medical, and academic English borrowed heavily from Greek and Latin. About 60% of English vocabulary has Greek or Latin origins.',
        'COMMON GREEK ROOTS: bio (life), geo (earth), graph (write), logy (study), photo (light), tele (far), micro (small), macro (large), auto (self), phon (sound), hydro (water), chrono (time), psych (mind), thermo (heat).',
        'COMMON LATIN ROOTS: aud (hear), dict (speak), port (carry), scrib/script (write), vis (see), spect (look), struct (build), rupt (break), mit/miss (send), tract (pull), ject (throw), cred (believe).',
        'STRATEGY: split unknown word into parts. Identify the root. Define each piece. Combine.',
        'EXAMPLES: telescope = tele (far) + scope (see) → instrument for seeing far. Hydrology = hydro (water) + logy (study) → study of water. Audible = aud (hear) + ible (capable of) → capable of being heard.',
        'WORKS FOR SCIENCE TERMS: photosynthesis = photo (light) + synthesis (combining) → combining with light. Thermometer = thermo (heat) + meter (measure) → instrument for measuring heat.',
        'WORKS FOR ABSTRACT TERMS: chronology = chrono (time) + logy (study) → arrangement by time. Predict = pre (before) + dict (say) → say in advance.',
      ],
      vocabulary: [
        { term: 'root', definition: 'the core part of a word that carries primary meaning; usually from Greek or Latin in academic vocabulary.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-roots',
      kind: 'worked_example',
      problem: 'Use roots to figure out what "biography" means.',
      steps: [
        'Split: bio + graph + y.',
        'bio = life (Greek). graph = write (Greek). -y = noun ending.',
        'Combine: writing about a life.',
        'Definition: a written account of someone\'s life.',
        'Confirms expected meaning.',
      ],
      answer: 'Biography = "writing about a life" = an account of someone\'s life.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Use roots to define "thermograph".',
      expectedAnswer: 'thermo (heat) + graph (write) → an instrument that records temperature; a record of temperature.',
      responseFormat: 'free',
      hints: [
        'thermo = heat.',
        'graph = write/record.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-coincidence',
      kind: 'misconception_check',
      question: 'A student sees "tele" in "telescope" and "tele" in "stereo" and concludes both have to do with "far". Is this right?',
      commonErrors: [
        {
          answer: 'Both contain "tele" → both about distance',
          misconception: 'Treating shared letters as evidence of shared root meaning.',
          correctsTo: '"Telescope" does come from Greek tele (far) + skopein (see). But "stereo" is from a different Greek root — stereos (solid), nothing to do with distance. Just because letters look the same doesn\'t guarantee a shared root. When unsure, look up the etymology. Roots help, but check; don\'t over-apply.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Roots: core meaning, often Greek or Latin.',
        'Common Greek: bio, geo, graph, logy, photo, tele, micro.',
        'Common Latin: aud, dict, port, script, spect, struct.',
        'Strategy: split → define → combine.',
        'Verify when unsure — letter overlap doesn\'t guarantee shared root.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might learning Greek and Latin roots specifically help in science class?',
      hint: 'Scientific vocabulary is HEAVILY Greek/Latin. Photosynthesis, mitochondria, chlorophyll, electromagnetic, ecosystem — all built from roots. Once you know the parts, new science words feel familiar instead of intimidating. Investing time in 30 high-impact roots pays back many-fold across science classes.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
