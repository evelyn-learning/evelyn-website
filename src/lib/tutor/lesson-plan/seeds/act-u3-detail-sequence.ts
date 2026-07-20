/**
 * ACT — Reading: Detail & Sequence Questions.
 *
 * Detail questions ask what the passage LITERALLY says — the fastest
 * points on ACT Reading because the answer is locatable, not inferred.
 * Sequence (event-ordering) questions ask for the order events actually
 * happened in a narrative, which is frequently NOT the order the passage
 * narrates them (flashbacks, framing devices). Both question types reward
 * the same discipline: go to the exact line cited, verify against the
 * TEXT, don't trust memory or "mentioned first." All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U3_DETAIL_SEQUENCE: LessonPlan = {
  id: 'evelyn.testprep.act.detail-sequence.v1',
  title: 'Detail & Sequence Questions',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.detail-sequence',
      standard: 'ACT-3.2',
      description:
        'Locate answers to detail questions using exact line references, and determine the true chronological order of events in narrative passages that narrate out of sequence.',
    },
  ],
  prerequisites: ['act.main-idea-purpose'],
  followUps: ['act.inference-generalization'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame detail and sequence questions as the fastest points on ACT Reading — the answer is locatable, not inferred — if you trust the line reference over memory.',
      script:
        "At about 52 seconds a question, ACT Reading rewards questions where the answer is sitting right there in the text. Detail questions cite a line number — go there, don't guess from memory. Sequence questions ask what order events REALLY happened in — and narrative passages love to open in the present and flash back. Today: the line-reference habit and the chronology habit.",
      suggestedTools: ['show_text'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-line-and-sequence',
      kind: 'concept',
      goal: 'Line-reference lookup discipline for detail questions, plus the narration-order-vs-chronological-order distinction for sequence questions, and the traps in each.',
      keyIdeas: [
        'DETAIL questions ask what the passage LITERALLY states. Before answering, locate the exact line reference the question cites — never rely on memory of the whole passage.',
        "LINE-REFERENCE DISCIPLINE: go to the cited line, then read one sentence before and one sentence after for context. The answer's wording often sits just outside the cited line, not inside it.",
        'TRAP — NEARBY LOOKALIKE: a wrong choice recycles words from a DIFFERENT nearby line. Re-verify the choice against the EXACT line cited, not just whether it "sounds familiar."',
        'TRAP — WORD-MATCHING vs MEANING-MATCHING: the correct detail answer often paraphrases the passage; wrong answers repeat exact passage words but distort the underlying fact.',
        'SEQUENCE (event-ordering) questions ask for the CHRONOLOGICAL order events happened — not the order they are narrated. Narrative passages routinely open in the present and flash back, or jump ahead.',
        'TRAP — NARRATION ORDER: assuming "mentioned first" means "happened first." Flashbacks and framing devices break this assumption constantly in ACT prose-fiction and humanities passages.',
        'STRATEGY: as you read, underline temporal signal words — "three years earlier," "the following spring," "by then," "now," "two years after" — and use them to build a timeline independent of paragraph order.',
        'PACE CHECK: at ~52 seconds per question, line-reference and sequence questions should be some of your FASTEST. The answer is locatable in the text — verify and move on, don\'t overthink.',
      ],
      vocabulary: [
        { term: 'line reference', definition: 'the specific line number(s) a question cites — always the fastest path to the answer.' },
        { term: 'chronological order', definition: 'the order events actually happened in time, which may differ from the order a passage narrates them.' },
        { term: 'flashback', definition: 'a narrative jump backward in time to an earlier event, common in ACT prose-fiction and humanities passages.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-line-lookup',
      kind: 'worked_example',
      problem: `Passage (lines 1-7):
1  Mara had wanted to be a locksmith since she was nine, when her
2  grandfather let her take apart an old strongbox on the porch. By the
3  time she turned sixteen, she had rebuilt six broken locks, but she had
4  never opened one without a key. Her grandfather watched from the
5  doorway, arms crossed, saying nothing, until she finally coaxed the
6  tumblers into place. "Now you're a locksmith," he said, and only then
7  did he smile.

Question: According to line 4, what had Mara never done before this moment?`,
      steps: [
        'The question cites line 4 exactly — go there, not to the whole passage from memory.',
        'Line 4 reads: "never opened one without a key."',
        'Match the fact precisely: Mara had rebuilt locks (line 3) but had never opened one WITHOUT a key.',
        "Trap check: line 3's \"six broken locks\" is a different fact (how many she rebuilt) — don't let it bleed into the line-4 answer.",
      ],
      answer: 'She had never opened a lock without using a key.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sequence-trap',
      kind: 'worked_example',
      problem: `Passage (lines 1-9):
1  Elena stood at the trailhead, lacing her boots for the sunrise
2  climb. She had not always loved mountains. Three years earlier, on
3  her first hike with the school club, she had turned back after
4  twenty minutes, certain her legs would give out. The following
5  spring she tried again, and finished, though barely. Now, on her
6  tenth attempt at this particular peak, she tightened her laces and
7  stepped onto the trail without a second thought, the fear she
8  remembered from that first hike a distant, almost unbelievable,
9  memory.

Events described in the passage:
  I. Elena turns back twenty minutes into her first hike.
  II. Elena finishes a climb after trying again the following spring.
  III. Elena steps onto the trail for her tenth attempt at this peak.

Question: Which lists the events in the order they actually happened, earliest to latest?`,
      steps: [
        "This is a sequence question — do NOT default to narration order. The passage opens in the present (lines 1-2), then flashes back.",
        'Underline the temporal signal words: "three years earlier" (line 2), "the following spring" (line 4-5), "now... tenth attempt" (line 5-6, present time).',
        'Build the timeline from those markers: the turned-back hike is earliest (three years ago), the finished hike is next (the following spring), the tenth attempt is latest (now).',
        'Order: I (turned back) -> II (finished the following spring) -> III (tenth attempt, present).',
      ],
      answer: 'I, II, III',
      estimatedMinutes: 3,
    },
    {
      id: 'try-line-count',
      kind: 'try_yourself',
      problem: `Passage (lines 1-7):
1  Mara had wanted to be a locksmith since she was nine, when her
2  grandfather let her take apart an old strongbox on the porch. By the
3  time she turned sixteen, she had rebuilt six broken locks, but she had
4  never opened one without a key. Her grandfather watched from the
5  doorway, arms crossed, saying nothing, until she finally coaxed the
6  tumblers into place. "Now you're a locksmith," he said, and only then
7  did he smile.

Question: According to line 3, how many locks had Mara rebuilt by the time she turned sixteen?`,
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Four' },
        { id: 'b', text: 'Five' },
        { id: 'c', text: 'Six', correct: true },
        { id: 'd', text: 'Sixteen' },
      ],
      expectedAnswer: 'Six',
      hints: [
        "The question cites line 3 specifically — don't rely on memory of the whole passage.",
        'Line 3 reads "...she had rebuilt six broken locks..." — that\'s the number to match, not her age.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sequence-devon',
      kind: 'try_yourself',
      problem: `Passage (lines 1-7):
1  By the time Devon sat down at the state championship table, he had
2  already forgotten his first tournament loss, the one that sent him
3  crying to the parking lot at age eight. Two years after that loss, a
4  coach spotted him hustling games at the library and offered free
5  lessons. He said yes without hesitating. Four years later still,
6  ranked in the state's top ten, Devon barely remembered how close
7  he'd come to quitting after that first defeat.

Events described in the passage:
  I. A coach offers Devon free lessons.
  II. Devon sits at the state championship table, ranked in the state's top ten.
  III. Devon loses his first tournament and cries in the parking lot.

Question: Which lists the events in the order they actually happened, earliest to latest?`,
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I, II, III' },
        { id: 'b', text: 'III, I, II', correct: true },
        { id: 'c', text: 'II, III, I' },
        { id: 'd', text: 'III, II, I' },
      ],
      expectedAnswer: 'III, I, II',
      hints: [
        "Don't default to the order the events are introduced — the passage opens near the end of the timeline (line 1) and then flashes back.",
        'Time markers: the loss happens "at age eight" (earliest); the coach\'s offer is "two years after that loss"; the championship table is "four years later still" (latest).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-paraphrase-trap',
      kind: 'try_yourself',
      problem: `Passage (lines 1-7):
1  Mara had wanted to be a locksmith since she was nine, when her
2  grandfather let her take apart an old strongbox on the porch. By the
3  time she turned sixteen, she had rebuilt six broken locks, but she had
4  never opened one without a key. Her grandfather watched from the
5  doorway, arms crossed, saying nothing, until she finally coaxed the
6  tumblers into place. "Now you're a locksmith," he said, and only then
7  did he smile.

Question: According to lines 4-5, what did Mara's grandfather do while she worked on the lock?`,
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'He crossed his arms and gave her step-by-step instructions.' },
        { id: 'b', text: 'He watched silently from the doorway with his arms crossed.', correct: true },
        { id: 'c', text: 'He left the doorway to fetch a spare key.' },
        { id: 'd', text: 'He smiled and told her she had almost finished.' },
      ],
      expectedAnswer: 'He watched silently from the doorway with his arms crossed.',
      hints: [
        'Lines 4-5 say he "watched from the doorway, arms crossed, saying nothing" — rule out any choice where he speaks or acts before she finishes.',
        'Only one choice matches BOTH details: the silence AND the arms-crossed posture.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-narration-order',
      kind: 'misconception_check',
      question:
        'A passage opens with a character standing at a trailhead, then flashes back to a hike three years earlier, then returns to the present. A student asked to order three events picks the order the passage MENTIONS them in. What went wrong?',
      commonErrors: [
        {
          answer: 'Orders events by where they appear in the passage (narration order)',
          misconception: 'Assuming a passage narrates events in the order they happened.',
          correctsTo:
            'Narrative passages frequently open in the present or in medias res, then flash back. Find the explicit temporal signal words ("three years earlier," "the following spring," "now") and build the timeline from THOSE, ignoring paragraph order.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Detail questions: go to the exact line cited, read a sentence before and after, and match MEANING, not just recycled words.',
        'Distrust choices that reuse passage wording but attach a different, unstated fact — the nearby-lookalike trap.',
        'Sequence questions ask for chronological order, not narration order — watch for flashbacks and temporal signal words ("three years earlier," "the following spring," "by then").',
        'At ~52 seconds a question, these should be your fastest points: verify against the text and move on.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Detail & Sequence Questions' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
