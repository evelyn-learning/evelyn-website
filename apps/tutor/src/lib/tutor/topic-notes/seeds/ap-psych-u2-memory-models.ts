/**
 * AP Psychology — Unit 2 CED 2.3-2.4: Introduction to Memory and Encoding.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.memory-models.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.memory-models.v1' }],
  theory: [
    { loId: 'appsych.memory-models', content: `ATKINSON-SHIFFRIN MODEL: memory is a THREE-STAGE system, not a single store. Information flows SENSORY MEMORY → SHORT-TERM MEMORY → LONG-TERM MEMORY. Each stage differs in CAPACITY and DURATION — that pairing is exactly what AP questions test.` },
    { loId: 'appsych.memory-models', content: `SENSORY MEMORY: extremely brief storage of raw sensory input. ICONIC memory is visual and lasts about half a second; ECHOIC memory is auditory and lasts about 3-4 seconds. Capacity is LARGE but the trace fades almost instantly unless attention selects it for further processing.` },
    { loId: 'appsych.memory-models', content: `SHORT-TERM MEMORY (STM): the stage of CONSCIOUS processing. Capacity is about SEVEN PLUS OR MINUS TWO items (Miller, 1956). Duration is roughly 20-30 SECONDS without rehearsal. REHEARSAL (repeating or actively working with material) is what moves information from STM into LTM.` },
    { loId: 'appsych.memory-models', content: `LONG-TERM MEMORY (LTM): the permanent store. Capacity is VIRTUALLY UNLIMITED; duration is theoretically a LIFETIME. Getting material INTO LTM (encoding well) and back OUT (retrieval cues) are the hard parts — the storage space itself is not the bottleneck.` },
    { loId: 'appsych.memory-models', content: `WORKING MEMORY (Baddeley): the modern, more sophisticated replacement for the passive STM box. Components: the PHONOLOGICAL LOOP (temporary verbal/auditory storage), the VISUOSPATIAL SKETCHPAD (temporary visual/spatial storage), the CENTRAL EXECUTIVE (directs attention and coordinates the subsystems), and the EPISODIC BUFFER (integrates information across modalities). Key upgrade over Atkinson-Shiffrin: working memory is ACTIVE — it manipulates information, not just holds it — and it explains dual-task findings (two verbal tasks interfere with each other; a verbal plus a visual task interfere far less).` },
    { loId: 'appsych.memory-models', content: `ENCODING TYPES: SEMANTIC encoding (by MEANING) is the MOST EFFECTIVE for long-term retention. ACOUSTIC encoding (by SOUND) is useful for verbal material. VISUAL encoding (by IMAGE) is weaker alone but powerful when combined with semantic encoding. Ranking to remember: semantic > acoustic > visual.` },
    { loId: 'appsych.memory-models', content: `LEVELS OF PROCESSING (Craik & Lockhart): SHALLOW processing attends to surface features (font, color, shape of the word); DEEP processing attends to MEANING, associations, and elaboration. DEEP BEATS SHALLOW for long-term retention because meaning-based encoding connects new material to existing knowledge, creating multiple retrieval paths.` },
    { loId: 'appsych.memory-models', content: `CHUNKING: grouping items into MEANINGFUL UNITS to expand what STM can hold. A phone number split as 555-867-5309 is three chunks; the same digits unchunked are ten separate items. Chunking works because each chunk occupies ONE of the roughly seven STM slots.` },
    { loId: 'appsych.memory-models', content: `MNEMONIC DEVICES: METHOD OF LOCI (visualize items at locations along a familiar route), PEG WORD (associate items with rhyming numbered pegs — one-bun, two-shoe), ACRONYMS (HOMES for the Great Lakes: Huron, Ontario, Michigan, Erie, Superior), and RHYMES ("30 days hath September..."). All exploit imagery plus meaningful structure.` },
    { loId: 'appsych.memory-models', content: `TWO EVIDENCE-BACKED STUDY EFFECTS: the SPACING EFFECT (distributed practice over time beats cramming — memories consolidate across sessions) and the TESTING EFFECT (actively RETRIEVING information strengthens memory more than re-reading it). AP loves scenarios where a student who practices retrieval, spaced out, outperforms one who crams by re-reading.` },
    { loId: 'appsych.memory-models', content: `AUTOMATIC vs EFFORTFUL processing: AUTOMATIC processing happens WITHOUT conscious effort — space (where things are), frequency (how often), and time (sequence of the day) get encoded incidentally. EFFORTFUL processing requires ATTENTION and rehearsal — new vocabulary, formulas, names.` },
    { loId: 'appsych.memory-models', kind: 'definition', title: 'working memory', content: `active processing of information; central executive + phonological loop + visuospatial sketchpad (+ episodic buffer).` },
    { loId: 'appsych.memory-models', kind: 'definition', title: 'chunking', content: `grouping items into meaningful units; expands effective STM capacity.` },
    { loId: 'appsych.memory-models', kind: 'definition', title: 'levels of processing', content: `shallow (surface features) vs deep (meaning-based) encoding; deep processing retains better.` },
  ],
  methods: [
    {
      title: 'Evaluate a study method with memory psychology',
      steps: [
        `STEP 1 — IDENTIFY THE ENCODING DEPTH. Passive re-reading is SHALLOW processing (word recognition only); practice problems and self-explanation force SEMANTIC, DEEP processing.`,
        `STEP 2 — CHECK THE SCHEDULE. Cramming = massed practice, no SPACING EFFECT. Study distributed over days/weeks lets consolidation occur between sessions.`,
        `STEP 3 — CHECK FOR RETRIEVAL. Does the method make the student PULL information out (testing effect) or just push it past their eyes again? Retrieval practice strengthens the trace; re-exposure barely does.`,
        `STEP 4 — PREDICT RETENTION. Shallow + massed + no retrieval → STM gets filled but little transfers to LTM; recall on exam day is shaky. Deep + spaced + tested → multiple retrieval episodes consolidate LTM; recall is strong.`,
        `STEP 5 — NAME THE PRINCIPLES in your answer: levels of processing, spacing effect, testing effect. AP rubrics award the labeled terms, not just the intuition.`,
      ],
      example: {
        problem: `You are studying for an AP exam. Compare two methods using memory psychology: (A) re-reading the textbook three times the night before; (B) reading once, then doing practice problems spaced over weeks.`,
        solution: `Method A is shallow processing plus cramming — low retention, little STM-to-LTM transfer. Method B combines DEEP semantic processing (practice problems), the SPACING EFFECT, and the TESTING EFFECT — multiple retrieval episodes consolidate LTM. Method B wins, backed by decades of research.`,
      },
      relatedLoIds: ['appsych.memory-models'],
    },
    {
      title: 'Classify a scenario by memory stage',
      steps: [
        `STEP 1 — ASK ABOUT DURATION. Under a second or two of raw sensory impression → SENSORY MEMORY (iconic if visual, echoic if auditory).`,
        `STEP 2 — ASK ABOUT USE. Held consciously and used within about 30 seconds (dialing a number you just heard) → SHORT-TERM / WORKING MEMORY.`,
        `STEP 3 — ASK ABOUT PERMANENCE. Well-encoded, available days to years later (your home address) → LONG-TERM MEMORY.`,
        `STEP 4 — JUSTIFY with CAPACITY + DURATION — those two properties are what distinguish the stages on the AP exam.`,
      ],
      example: {
        problem: `Identify the memory stage: (a) hearing a phone number and dialing it 5 seconds later; (b) remembering your home address; (c) briefly seeing a flash of light.`,
        solution: `(a) SHORT-TERM (working) memory — actively held and used briefly. (b) LONG-TERM memory — permanent, well-encoded. (c) SENSORY memory — iconic trace of brief visual input.`,
      },
      relatedLoIds: ['appsych.memory-models'],
    },
  ],
  pointers: [
    { content: 'Three stages: sensory (huge, sub-second) → STM (7±2, ~30s) → LTM (unlimited, lifetime). Pair capacity + duration.', kind: 'tip' },
    { content: 'Iconic = visual (~0.5 sec); echoic = auditory (~3-4 sec). Easy MCQ points.', kind: 'tip' },
    { content: 'Baddeley added ACTIVE manipulation: phonological loop + visuospatial sketchpad + central executive + episodic buffer.', kind: 'tip' },
    { content: 'Semantic > acoustic > visual encoding; deep > shallow processing (Craik & Lockhart).', kind: 'tip' },
    { content: 'Spacing effect + testing effect beat cramming + re-reading — the classic AP study-skills scenario.', kind: 'tip' },
    { content: 'Lyrics compete with verbal study for the phonological loop — that is the working-memory answer to "music while studying."', kind: 'tip' },
  ],
};
