/**
 * AP Psychology — Unit 2 CED 2.5-2.6: Storing and Retrieving Memories.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.psych.memory-storage-retrieval.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_PSYCH_MEMORY_STORAGE_RETRIEVAL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.psych.memory-storage-retrieval.v1',
  course: 'AP Psychology',
  cedUnit: 2,
  cedTopic: '2.5-2.6',
  cedTitle: 'Storing and Retrieving Memories',
  planId: 'evelyn.ap.psych.memory-storage-retrieval.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.psych.memory-storage-retrieval.v1' }],
  theory: [
    { loId: 'appsych.memory-storage-retrieval', content: `LONG-TERM MEMORY IS NOT ONE THING. It splits into EXPLICIT (declarative) memory — consciously recalled — and IMPLICIT (nondeclarative) memory — expressed without conscious awareness. Different KINDS of memory live in DIFFERENT BRAIN AREAS; that separation is the central theme of this topic.` },
    { loId: 'appsych.memory-storage-retrieval', content: `EXPLICIT (DECLARATIVE) MEMORY has two subtypes. SEMANTIC memory holds facts and general knowledge ("Paris is the capital of France"). EPISODIC memory holds personal events tied to a time and place ("last summer I visited Paris"). Both depend on the HIPPOCAMPUS and surrounding medial temporal lobe.` },
    { loId: 'appsych.memory-storage-retrieval', content: `IMPLICIT (NONDECLARATIVE) MEMORY is unconscious. PROCEDURAL memory holds motor skills and habits (riding a bike, typing) and depends on the CEREBELLUM and BASAL GANGLIA. CLASSICALLY CONDITIONED emotional responses are also implicit; the AMYGDALA is critical for fear conditioning.` },
    { loId: 'appsych.memory-storage-retrieval', content: `PATIENT HM (Henry Molaison): had his HIPPOCAMPUS removed at age 27 (1953) to treat severe epilepsy. Result: ANTEROGRADE AMNESIA — he could not form NEW EXPLICIT memories. But PROCEDURAL learning stayed intact — he improved at mirror tracing and jigsaw puzzles over days even though he did not REMEMBER practicing. His RETROGRADE memories from before surgery were largely spared (already consolidated). This double dissociation is foundational evidence that explicit and implicit memory are separate systems.` },
    { loId: 'appsych.memory-storage-retrieval', content: `RETRIEVAL is pulling a stored memory back into consciousness. RETRIEVAL CUES are stimuli that help access stored information — the more and better the cues, the easier the retrieval. Most everyday "forgetting" is really retrieval failure: the memory is there but the right cue is missing.` },
    { loId: 'appsych.memory-storage-retrieval', content: `PRIMING: exposure to one stimulus unconsciously activates related concepts, speeding their retrieval. Recently seeing "doctor" makes "nurse" come to mind faster. Priming is an IMPLICIT memory effect.` },
    { loId: 'appsych.memory-storage-retrieval', content: `CONTEXT-DEPENDENT MEMORY: retrieval is easier in the SAME EXTERNAL CONTEXT as encoding. Studying in the room where you will test, or the classic finding that words learned underwater are recalled better underwater. STATE-DEPENDENT MEMORY: retrieval is easier in the same INTERNAL state (e.g., matching caffeine or mood at encoding and retrieval). MOOD-CONGRUENT MEMORY: your current mood biases you toward memories of the same emotional tone — part of why depression's rumination pulls up negative memories in a vicious cycle.` },
    { loId: 'appsych.memory-storage-retrieval', content: `TYPES OF RETRIEVAL differ in difficulty. RECALL means producing information with NO external cues (essay, fill-in-the-blank). RECOGNITION means IDENTIFYING previously seen information (multiple choice) and is EASIER because the cue is supplied. RELEARNING is faster than first learning — the "savings" reveal that some trace survived even when recall and recognition fail.` },
    { loId: 'appsych.memory-storage-retrieval', content: `SERIAL POSITION EFFECT: in a list, the FIRST items (PRIMACY — extra rehearsal into LTM) and the LAST items (RECENCY — still in STM) are recalled best; MIDDLE items fare worst. On an immediate test recency is strong; after a delay recency fades while primacy persists.` },
    { loId: 'appsych.memory-storage-retrieval', content: `BRAIN STRUCTURES for memory (know the pairings): HIPPOCAMPUS forms new EXPLICIT memories; CEREBELLUM handles PROCEDURAL memory and classically conditioned responses; AMYGDALA handles EMOTIONAL and fear memories; PREFRONTAL CORTEX supports working memory and coordinates encoding and retrieval. Memory is a DISTRIBUTED system — different types are stored in different places.` },
    { loId: 'appsych.memory-storage-retrieval', kind: 'definition', title: 'episodic memory', content: `personal events tied to time and place; explicit; hippocampus-dependent.` },
    { loId: 'appsych.memory-storage-retrieval', kind: 'definition', title: 'procedural memory', content: `motor skills and habits; implicit; cerebellum- and basal-ganglia-dependent.` },
    { loId: 'appsych.memory-storage-retrieval', kind: 'definition', title: 'priming', content: `exposure to one stimulus unconsciously activates related concepts, easing their retrieval.` },
  ],
  methods: [
    {
      title: 'Classify a long-term memory type',
      steps: [
        `STEP 1 — CONSCIOUS OR NOT? If the person deliberately declares the memory, it is EXPLICIT; if it shows up through performance without awareness, it is IMPLICIT.`,
        `STEP 2 — FOR EXPLICIT, FACT OR EVENT? General knowledge → SEMANTIC; a specific personal episode with time/place → EPISODIC.`,
        `STEP 3 — FOR IMPLICIT, SKILL OR REFLEX? A trained motor skill or habit → PROCEDURAL (cerebellum); a conditioned emotional reaction → CLASSICAL CONDITIONING (amygdala).`,
        `STEP 4 — NAME THE BRAIN AREA if the question asks — it earns rubric points and confirms your classification.`,
      ],
      example: {
        problem: `Classify each: (a) recalling that the capital of France is Paris; (b) riding a bicycle; (c) remembering your wedding day; (d) reflexively flinching at a thunderclap.`,
        solution: `(a) SEMANTIC (explicit). (b) PROCEDURAL (implicit, cerebellum). (c) EPISODIC (explicit, hippocampus). (d) CLASSICAL CONDITIONING (implicit emotional response, amygdala).`,
      },
      relatedLoIds: ['appsych.memory-storage-retrieval'],
    },
    {
      title: 'Apply retrieval-cue concepts to a scenario',
      steps: [
        `STEP 1 — LOCATE ENCODING AND RETRIEVAL CONDITIONS. Note the external setting AND the internal state (mood, caffeine, stress) at study time versus test time.`,
        `STEP 2 — MATCH OR MISMATCH? A CONTEXT match (same place) or STATE match (same internal state) supplies extra retrieval cues and aids recall; a mismatch removes cues and impairs it.`,
        `STEP 3 — CHECK MOOD. Emotional state biases which memories surface (mood-congruent retrieval), separate from the context/state effects.`,
        `STEP 4 — RECOMMEND matching study conditions to test conditions (quiet, similar time of day) to maximize overlapping cues.`,
      ],
      example: {
        problem: `You cannot recall an answer during a test, but the moment you leave the room it pops into mind. Explain with context-dependent memory.`,
        solution: `CONTEXT-DEPENDENT MEMORY: retrieval is easier where encoding occurred. If you studied somewhere relaxed, the high-pressure test room offers fewer matching cues (and test anxiety shifts your internal STATE too). Leaving restores a context/state closer to studying, so the cue re-activates the memory. Fix: study under conditions similar to the test.`,
      },
      relatedLoIds: ['appsych.memory-storage-retrieval'],
    },
  ],
  pointers: [
    { content: 'Explicit = semantic (facts) + episodic (events), hippocampus. Implicit = procedural (skills, cerebellum) + conditioned responses (amygdala).', kind: 'tip' },
    { content: 'Patient HM: no hippocampus → no NEW explicit memories, but procedural learning intact. The key dissociation.', kind: 'tip' },
    { content: 'Context = external setting; state = internal condition; mood-congruent = emotional tone biases recall.', kind: 'tip' },
    { content: 'Recall (produce, no cue) is harder than recognition (identify, cue given). Relearning shows savings.', kind: 'tip' },
    { content: 'Serial position: primacy (rehearsal → LTM) + recency (still in STM); middle items lost.', kind: 'tip' },
    { content: 'Alzheimer\'s sparing piano-playing while losing faces mirrors HM: procedural spared, explicit destroyed.', kind: 'tip' },
  ],
};
