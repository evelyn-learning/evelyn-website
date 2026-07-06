/**
 * AP Psychology — Unit 2 CED 2.3-2.4: Introduction to Memory and Encoding.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.memory-models.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_MEMORY_MODELS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.memory-models.v1',
  course: 'AP Psychology',
  cedUnit: 2,
  cedTopic: '2.3-2.4',
  cedTitle: 'Introduction to Memory and Encoding',
  planId: 'evelyn.ap.psych.memory-models.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.memory-models.v1' }],
  theory: [
    { loId: 'appsych.memory-models', content: 'ATKINSON-SHIFFRIN MODEL (3 stages):' },
    { loId: 'appsych.memory-models', content: `  1. SENSORY MEMORY: brief storage of sensory input. ICONIC (visual, ~0.5 sec) and ECHOIC (auditory, ~3-4 sec). Capacity: large but very brief.` },
    { loId: 'appsych.memory-models', content: `  2. SHORT-TERM MEMORY (STM): conscious processing. Capacity: 7±2 items (Miller, 1956). Duration: ~20-30 seconds without rehearsal.` },
    { loId: 'appsych.memory-models', content: `  3. LONG-TERM MEMORY (LTM): permanent storage. Capacity: virtually unlimited. Duration: lifetime (theoretically).` },
    { loId: 'appsych.memory-models', content: '  • REHEARSAL helps move STM → LTM.' },
    { loId: 'appsych.memory-models', content: 'WORKING MEMORY (Baddeley): more sophisticated update of STM.' },
    { loId: 'appsych.memory-models', content: '  • PHONOLOGICAL LOOP: temporary storage for verbal/auditory info.' },
    { loId: 'appsych.memory-models', content: '  • VISUOSPATIAL SKETCHPAD: temporary storage for visual/spatial info.' },
    { loId: 'appsych.memory-models', content: '  • CENTRAL EXECUTIVE: directs attention, coordinates other components.' },
    { loId: 'appsych.memory-models', content: '  • EPISODIC BUFFER: integrates info across modalities.' },
    { loId: 'appsych.memory-models', content: 'ENCODING — converting sensory info into a memory trace.' },
    { loId: 'appsych.memory-models', content: 'ENCODING TYPES:' },
    { loId: 'appsych.memory-models', content: '  • SEMANTIC encoding: by MEANING. Most effective for long-term retention.' },
    { loId: 'appsych.memory-models', content: '  • ACOUSTIC encoding: by SOUND. Useful for verbal info.' },
    { loId: 'appsych.memory-models', content: '  • VISUAL encoding: by IMAGE. Less effective alone but powerful with semantic.' },
    { loId: 'appsych.memory-models', content: 'LEVELS OF PROCESSING (Craik & Lockhart):' },
    { loId: 'appsych.memory-models', content: '  • SHALLOW processing: surface features (font color, font shape).' },
    { loId: 'appsych.memory-models', content: '  • DEEP processing: meaning, association, elaboration. Better recall.' },
    { loId: 'appsych.memory-models', content: '  • DEEP > SHALLOW for long-term retention.' },
    { loId: 'appsych.memory-models', content: `CHUNKING: grouping items into meaningful units to expand STM. Phone number 555-867-5309 (3 chunks) easier than 5558675309 (10 individual digits).` },
    { loId: 'appsych.memory-models', content: 'MNEMONIC DEVICES:' },
    { loId: 'appsych.memory-models', content: '  • METHOD OF LOCI: visualize items at locations along a familiar route.' },
    { loId: 'appsych.memory-models', content: '  • PEG WORD: associate items with rhyming numbered "pegs" (one-bun, two-shoe).' },
    { loId: 'appsych.memory-models', content: '  • ACRONYMS: HOMES = Lakes Huron, Ontario, Michigan, Erie, Superior.' },
    { loId: 'appsych.memory-models', content: '  • RHYMES: "30 days hath September..."' },
    { loId: 'appsych.memory-models', content: 'SPACING EFFECT (distributed practice): study spaced over time > cramming.' },
    { loId: 'appsych.memory-models', content: `TESTING EFFECT: actively retrieving info STRENGTHENS memory more than re-reading.` },
    { loId: 'appsych.memory-models', content: 'AUTOMATIC vs EFFORTFUL processing:' },
    { loId: 'appsych.memory-models', content: '  • AUTOMATIC: without conscious effort (location, frequency, time).' },
    { loId: 'appsych.memory-models', content: '  • EFFORTFUL: requires attention and rehearsal.' },
    { loId: 'appsych.memory-models', kind: 'definition', title: 'working memory', content: `active processing of info; central executive + phonological loop + visuospatial sketchpad.` },
    { loId: 'appsych.memory-models', kind: 'definition', title: 'chunking', content: 'grouping items into meaningful units; expands STM.' },
    { loId: 'appsych.memory-models', kind: 'definition', title: 'levels of processing', content: 'shallow vs deep encoding; deep retains better.' },
  ],
  methods: [
    {
      title: 'Worked process',
      steps: [
        'METHOD A: Re-reading textbook 3× the night before (cramming, shallow).',
        '  • SHALLOW processing — passive reading focuses on word recognition.',
        '  • CRAMMING — no spacing.',
        '  • Likely retention: low. STM filled but not transferred to LTM.',
        '  • Recall during exam: shaky.',
        'METHOD B: Reading once, then doing practice problems, spaced over weeks.',
        '  • DEEP processing — practice problems require ENCODING by MEANING.',
        '  • SPACING EFFECT — distributed across weeks.',
        '  • TESTING EFFECT — actively retrieving info strengthens it.',
        '  • Likely retention: HIGH. Multiple retrieval episodes consolidate LTM.',
        `METHOD B WINS. Practice + spacing + testing > cramming + re-reading. Backed by 50+ years of research.`,
      ],
      example: { problem: `You're studying for an AP exam. Compare TWO study methods using memory psychology.`, solution: 'Practice + spacing + testing >> cramming + re-reading.' },
      relatedLoIds: ['appsych.memory-models'],
    },
  ],
  pointers: [
    { content: 'Atkinson-Shiffrin: sensory → STM (7±2, ~30s) → LTM (unlimited, lifetime).', kind: 'tip' },
    { content: 'Working memory: phonological loop + visuospatial sketchpad + central executive.', kind: 'tip' },
    { content: 'Encoding: semantic > acoustic > visual. Deep > shallow processing.', kind: 'tip' },
    { content: 'Chunking expands STM. Mnemonics, spacing, testing improve LTM.', kind: 'tip' },
    { content: 'Automatic (effortless) vs effortful processing.', kind: 'tip' },
  ],
};
