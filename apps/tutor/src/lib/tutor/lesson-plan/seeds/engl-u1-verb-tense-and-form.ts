/**
 * HS English — Grammar & Usage: Verb Tense & Form.
 *
 * The timeline machinery of real writing (CCSS L.9-10.1): choose the tense
 * a time relationship demands, hold that tense steady across a passage
 * unless a signal word licenses a shift, and get the irregular past and
 * past-participle forms right after a helping verb. Every practice item is
 * a revision-choice or error-spot MCQ, and every excerpt is original prose.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U1_VERB_TENSE_AND_FORM: LessonPlan = {
  id: 'evelyn.hs.engl.verb-tense-and-form.v1',
  title: 'Verb Tense & Form',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.verb-tense-and-form',
      standard: 'ENGL-1.4',
      description:
        'Choose the verb tense that matches the time relationships in a sentence, keep that tense consistent across a passage unless a signal word licenses a shift, and use the correct irregular past and past-participle forms after helping verbs (CCSS L.9-10.1).',
    },
  ],
  prerequisites: ['engl.pronoun-agreement-clarity'],
  followUps: ['engl.clauses-and-phrases'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame verb tense and form as the machinery that carries a reader through time — the thing that makes a story, an essay, or an interview answer easy to follow.',
      script:
        'Think about the college essay you will write next year, or the answer you give in an interview when someone asks what you did last summer. Both of them ask a reader to follow a timeline: this happened, then that happened, and here is what is still true today. Verb tense is the machinery that carries that timeline, and verb form is what keeps the machinery from grinding — a sentence like "I had went to the shop" (WRONG) stops a reader cold, even when the idea behind it is clear. Today you learn to pick the tense a time relationship demands, hold it steady across a whole paragraph, and land the irregular forms that trip up almost everyone.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tense-and-form',
      kind: 'concept',
      goal: 'The choose-then-hold method for tense, the sequence rule for two past events, and the participle-after-a-helper rule that decides form.',
      keyIdeas: [
        'CHOOSE THE TENSE THE TIME RELATIONSHIP DEMANDS — before picking a verb, name when the action happens relative to everything else in the sentence. Simple past for a finished past event ("she trained all winter"), simple present for a habit or an ongoing truth ("she trains every winter"), future for what has not happened yet ("she will train next winter").',
        'HOLD ONE TENSE ACROSS THE PASSAGE — every verb describing the same stretch of time takes the same tense. A present-tense verb dropped into a past-tense narrative is an error, not a style choice: "Last spring we repainted the mural. First we SCRUB the bricks." (WRONG) versus "Last spring we repainted the mural. First we SCRUBBED the bricks." (CORRECT).',
        'PRESENT PERFECT LINKS PAST TO NOW — "has/have + past participle" covers an action that started earlier and still continues or still matters: "I have written three drafts since Monday." Do not mix it into a narrative of a finished, dated event.',
        'PAST PERFECT MARKS THE EARLIER OF TWO PAST EVENTS — "had + past participle" goes on whichever event happened first; the later, reference event stays simple past: "By the time the doors opened, the line HAD stretched around the block." This is the sequence-of-tenses rule.',
        'SIGNAL WORDS EARN A SHIFT — now, today, currently, already, since, by the time, yesterday, and next year license a change of tense. With no such signal, the tense the passage has already established holds.',
        'FORM IS A SEPARATE CHECK FROM TENSE — after have, has, had, or will have, and in the passive with a form of "be", the verb must appear in its PAST PARTICIPLE form, never its simple past form: "had gone" and "was written" (CORRECT) versus "had went" and "was wrote" (WRONG).',
        'IRREGULAR VERBS ARE WHERE FORM BREAKS — learn all three shapes: go/went/gone, write/wrote/written, begin/began/begun, do/did/done, see/saw/seen, take/took/taken, break/broke/broken, choose/chose/chosen, ring/rang/rung. The middle shape stands alone; the third shape needs a helper in front of it.',
        'THE CLASSIC ERROR — a wrong verb almost always sounds fine on its own. "She walks the dogs" is a perfectly normal sentence, and it is still wrong inside a paragraph that has been narrating last summer. Judge every verb against the timeline around it, never against how it sounds by itself.',
      ],
      vocabulary: [
        { term: 'past participle', definition: 'the third form of a verb (gone, written, broken), used after have, has, had, will have, or a form of "be" — often different from the simple past form.' },
        { term: 'tense consistency', definition: 'keeping every verb that describes the same stretch of time in the same tense unless a signal word justifies a shift.' },
        { term: 'past perfect', definition: '"had + past participle" — marks the earlier of two past events, as in "had stretched" before "opened".' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-hold-the-tense',
      kind: 'worked_example',
      problem:
        'Choose the correct verb: "All last winter, Devi coached the middle-school chess club. She ran the Saturday drills, sorted the boards after every match, and (posts / posted) the results on the hallway board each Monday."',
      steps: [
        'Name the timeline first. "All last winter" plus "coached" fixes the passage in a finished stretch of past time.',
        'List the other verbs describing that same stretch: "ran" and "sorted". Both are simple past, so the passage has already established simple past.',
        'Look for a signal word that would license a shift to the present — now, today, currently, these days. There is none.',
        'Match the verb to the established tense: "and POSTED the results on the hallway board each Monday." The present-tense "posts" reads smoothly on its own, which is exactly why it is easy to miss.',
      ],
      answer: 'posted — the passage narrates a finished past winter, so every verb in it stays simple past',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-participle-after-helper',
      kind: 'worked_example',
      problem:
        'A student writes: "By the time the coach announced the roster, Elena had went to three tryouts and had wrote a letter asking for a spot." Two verbs are wrong. Which ones, and why?',
      steps: [
        'Check the TENSE choice first, because it is actually correct here. "By the time" signals two past events in sequence, and the tryouts and the letter both came before the announcement, so past perfect ("had + participle") is the right tense.',
        'The error is FORM, not tense. After the helper "had", a verb must appear in its past participle form.',
        '"Went" is the simple past of go; the participle is "gone". "Wrote" is the simple past of write; the participle is "written".',
        'WRONG: "had went ... had wrote." CORRECT: "By the time the coach announced the roster, Elena had gone to three tryouts and had written a letter asking for a spot."',
        'Why writers land here: "she went" and "she wrote" are correct standing alone, so the ear approves them even after a helper. The helper is the tell — the moment you see have, has, had, or will have, switch to the third form.',
      ],
      answer:
        'The two forms after "had": WRONG "had went" and "had wrote"; CORRECT "had gone" and "had written."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-hold-present-tense',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the passage? "Every Saturday the neighborhood repair cafe opens at nine. Volunteers set up the tables, sort the broken toasters and lamps by type, and ___ the owners how to make the fix themselves."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'show', correct: true },
        { id: 'b', text: 'showed' },
        { id: 'c', text: 'had shown' },
        { id: 'd', text: 'showing' },
      ],
      expectedAnswer: 'show',
      hints: [
        'Look at the other verbs in the passage — "opens", "set up", and "sort". What tense has the passage established?',
        'No signal word licenses a shift out of the present, so the verb must stay present: "show".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sequence-of-tenses',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The editor published our article on Friday. Two days earlier, three of us ___ the entire opening section."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'rewrite' },
        { id: 'b', text: 'rewrote' },
        { id: 'c', text: 'had rewritten', correct: true },
        { id: 'd', text: 'have rewritten' },
      ],
      expectedAnswer: 'had rewritten',
      hints: [
        'Two past events are being compared: the publishing and the rewriting. Which one happened first?',
        '"Two days earlier" marks the rewriting as the earlier event, and the earlier of two past events takes past perfect: "had + past participle".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-correct-form',
      kind: 'try_yourself',
      problem: 'Which sentence is grammatically correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'By the end of the season, our goalie had broken the school record for shutouts.', correct: true },
        { id: 'b', text: 'By the end of the season, our goalie had broke the school record for shutouts.' },
        { id: 'c', text: 'The announcement about the record was wrote by the team captain.' },
        { id: 'd', text: 'Our goalie has already went to two tryouts for the club team.' },
      ],
      expectedAnswer: 'By the end of the season, our goalie had broken the school record for shutouts.',
      hints: [
        'After have, has, had, or a form of "be", the verb needs its past participle. Check each option for a simple past form sitting where a participle belongs.',
        'break/broke/broken, write/wrote/written, go/went/gone — only one option puts the third form after its helper.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sounds-fine-alone',
      kind: 'misconception_check',
      question:
        'A student writes: "Last July I volunteered at the animal shelter. I walk the dogs every afternoon and clean the kennels before closing." Asked about the second sentence, the student says it sounds fine, so it must be right. What went wrong?',
      commonErrors: [
        {
          answer: 'The present-tense "walk" and "clean" are acceptable because the sentence sounds correct on its own',
          misconception: 'Judging a verb by how it sounds in isolation instead of against the timeline the passage has already established.',
          correctsTo:
            'The first sentence sets a finished past timeline with "Last July" and "volunteered", and no signal word licenses a shift. WRONG: "I walk the dogs every afternoon and clean the kennels before closing." CORRECT: "I walked the dogs every afternoon and cleaned the kennels before closing." A verb that sounds fine alone can still break the passage it lives in.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name the time relationship first, then pick the tense — and hold that tense for every verb describing the same stretch of time.',
        'Only a signal word (now, today, already, since, by the time, next year) earns a tense shift; without one, the established tense holds.',
        'For two past events, the earlier one takes past perfect ("had + past participle") and the later reference event stays simple past.',
        'Form is a separate check: after have, has, had, will have, or a form of "be", use the past participle — "had gone" and "was written", never "had went" or "was wrote".',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Verb Tense & Form' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
