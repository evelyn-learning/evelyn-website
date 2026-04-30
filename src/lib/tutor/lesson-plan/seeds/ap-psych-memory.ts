/**
 * AP Psychology — Memory.
 *
 * Three-stage model (sensory, short-term, long-term). Encoding,
 * storage, retrieval. Forgetting and reconstructive memory.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PSYCH_MEMORY: LessonPlan = {
  id: 'evelyn.ap.psych.memory.v1',
  title: 'Memory: encoding, storage, retrieval',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'sci',
  topic: 'psychology',
  locale: 'en',
  los: [
    {
      id: 'appsych.memory',
      description: 'Describe the three-stage model of memory and processes affecting accurate recall.',
      standard: 'AP-PSYCH-MEM',
    },
  ],
  prerequisites: ['appsych.learning'],
  followUps: ['appsych.development'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Memory feels reliable but isn\'t — eyewitness testimony fails routinely.',
      script: 'Eyewitness testimony has put thousands in prison. DNA evidence later showed many were INNOCENT. How? Memory isn\'t a recording — it\'s a RECONSTRUCTION every time you recall. Today: how that works.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-stages-processes',
      kind: 'concept',
      goal: 'Three-stage model + encoding/storage/retrieval + forgetting.',
      keyIdeas: [
        'THREE-STAGE MODEL (Atkinson-Shiffrin):',
        '  SENSORY MEMORY: ~1 second. Iconic (visual) ~250ms. Echoic (auditory) ~3-4s. Most decays before reaching awareness.',
        '  SHORT-TERM MEMORY (working memory): ~15-30 seconds without rehearsal. Capacity ~7±2 chunks (Miller, 1956).',
        '  LONG-TERM MEMORY: potentially permanent. Vast capacity. Subdivided into EXPLICIT (facts, events — declarative) and IMPLICIT (skills — procedural).',
        'PROCESSES:',
        '  ENCODING: getting info IN. Deeper processing (meaning) → better retention than shallow (appearance).',
        '  STORAGE: holding it.',
        '  RETRIEVAL: getting it back out. Recognition (multiple choice) usually easier than recall (fill-in-blank).',
        'FORGETTING:',
        '  Decay (no rehearsal).',
        '  Interference (proactive: old info blocks new; retroactive: new blocks old).',
        '  Retrieval failure (info there but not accessible).',
        'RECONSTRUCTIVE memory: each recall ALTERS the trace. False memories can be implanted by suggestion (Loftus). Eyewitness testimony is famously unreliable.',
        'TECHNIQUES that boost memory: spaced practice, retrieval practice (testing yourself), elaboration (relate to existing knowledge), mnemonics, sleep.',
      ],
      vocabulary: [
        { term: 'working memory', definition: 'short-term memory plus the active manipulation of that information.' },
        { term: 'encoding', definition: 'converting incoming information into storable form.' },
        { term: 'reconstructive memory', definition: 'memory built from fragments at recall, not played back like a recording.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-eyewitness',
      kind: 'worked_example',
      problem: 'Why is eyewitness testimony unreliable from a memory-science perspective?',
      steps: [
        'ENCODING: stress, brief exposure, lighting, weapon focus all degrade what was actually encoded.',
        'STORAGE: time gaps allow decay and reconstruction.',
        'RETRIEVAL: leading questions ("did you see THE gun?" vs "was there a gun?") can implant details.',
        'RECONSTRUCTION: every recall edits the memory. By trial, the witness "remembers" details that may have been suggested.',
        'CONFIDENCE doesn\'t correlate well with accuracy. A confident eyewitness can be wrong.',
        'Modern reforms: blind lineups, video-recorded interviews, sequential photo arrays.',
      ],
      answer: 'memory is reconstructive, vulnerable at every stage; confidence ≠ accuracy',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does spaced practice (studying spread over days) beat cramming?',
      expectedAnswer: 'gives the brain repeated retrieval and consolidation opportunities; cramming overloads short-term and doesn\'t consolidate to long-term',
      responseFormat: 'free',
      hints: [
        'Memory consolidation happens between sessions.',
        'Repeated retrieval strengthens long-term storage.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-recording',
      kind: 'misconception_check',
      question: 'Does memory work like a video recording?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating memory as faithful playback.',
          correctsTo: 'No — memory is RECONSTRUCTIVE. Each recall rebuilds the experience from fragments. Schemas, expectations, and suggestions can alter recall. False memories CAN be implanted with surprisingly little effort. Trustworthy memory science accounts for this.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three stages: sensory → short-term → long-term.',
        'Working memory ~7±2 chunks; rehearsal extends.',
        'Three processes: encoding, storage, retrieval.',
        'Memory is RECONSTRUCTIVE — confident recall ≠ accurate.',
        'Best learning practices: spaced practice, retrieval practice, elaboration.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does sleep help memory consolidation?',
      hint: 'During sleep (especially REM), the hippocampus replays patterns from the day to the cortex, consolidating short-term traces into long-term storage. Skip sleep, skip consolidation. All-nighters before tests literally hurt encoding.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
