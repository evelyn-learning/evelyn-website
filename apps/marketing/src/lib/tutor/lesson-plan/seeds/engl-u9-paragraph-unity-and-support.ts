/**
 * HS English — Writing: Topic Sentences & Paragraph Unity.
 *
 * The load-bearing paragraph skill (CCSS W.9-10.2b, W.9-10.5): open with a
 * topic sentence that makes a promise, keep every following sentence doing
 * that one job, and develop the point with evidence plus explanation rather
 * than restatement. Taught entirely through revision-choice MCQs — which
 * sentence to delete, which topic sentence fits, which sentence develops.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U9_PARAGRAPH_UNITY_AND_SUPPORT: LessonPlan = {
  id: 'evelyn.hs.engl.paragraph-unity-and-support.v1',
  title: 'Topic Sentences & Paragraph Unity',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.paragraph-unity-and-support',
      standard: 'ENGL-9.2',
      description:
        'Write and revise a paragraph that states one clear topic sentence, keeps every remaining sentence serving that single job, and develops the point with specific evidence and explanation instead of repetition — including spotting the off-topic sentence that breaks unity and cutting it (CCSS W.9-10.2b, W.9-10.5).',
    },
  ],
  prerequisites: ['engl.thesis-statements'],
  followUps: ['engl.transitions-and-cohesion'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a paragraph as a room with one job — and unity as the difference between an explanation people follow and one they give up on.',
      script:
        'Think about the last time someone tried to explain something in a group chat and it took eleven messages. A detour about who was there, a joke, a second detour, and by the end nobody remembered the point. Now think about the friend who explains the same thing in three lines and everyone gets it immediately. A paragraph works like a room: it has one job. The topic sentence announces that job, and every sentence after it either does that job or does not belong. Today you will practice the revision move that separates those two explanations — spotting the sentence that wandered off, and replacing empty repetition with real support.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-unity-and-support',
      kind: 'concept',
      goal: 'What a topic sentence promises, what unity requires, what real development looks like, and the two errors that wreck both.',
      keyIdeas: [
        'THE TOPIC SENTENCE IS A PROMISE — it names the one claim the paragraph will prove. "The new late bus has opened up after-school clubs" promises evidence about clubs and the bus. A reader who finishes the paragraph should feel that exact promise was kept, no more and no less.',
        'UNITY — every sentence in the paragraph serves the topic sentence. The test is one question asked of each sentence: does this help prove the promise? If the honest answer is no, the sentence goes, no matter how good it is on its own.',
        'DEVELOPMENT = EVIDENCE + EXPLANATION — a supported point needs something specific (a number, an example, a detail, a moment) AND a sentence that says what the specific thing shows. Evidence alone leaves the reader guessing; explanation alone is just the claim again, louder.',
        'ERROR 1 — THE OFF-TOPIC DRIFT. One sentence follows an association instead of the promise: a fact about a person mentioned in passing, a related-but-different complaint, a memory the writer likes. It usually enters because it is true and interesting. It still breaks unity and must be cut or moved to its own paragraph.',
        'ERROR 2 — REPEATING THE POINT IN NEW WORDS. "The store should open at lunch. Opening at lunch would be a good idea." Nothing was added; the claim was reworded. Restatement feels like writing because the page gets longer, but the reader learns nothing new. Ask of every added sentence: what does the reader now know that they did not know one sentence ago?',
        'PLACEMENT — the topic sentence usually comes first, and first is the safest choice in school writing. But the position is not the rule; the JOB is. A paragraph can open with a brief lead-in and land the topic sentence second, and it can occasionally close with it. What is never optional is that the claim is stated somewhere, in one sentence, unmistakably.',
        'ONE PARAGRAPH, ONE IDEA — if a paragraph is trying to prove two claims, it does not need better transitions; it needs to become two paragraphs. Splitting is a fix, not an admission of failure.',
        'THE REVISION ROUTINE — (1) underline the topic sentence, (2) ask of each remaining sentence "does this serve that promise?", (3) cut what drifts, (4) replace any restatement with a specific detail plus a line saying what it shows.',
      ],
      vocabulary: [
        { term: 'unity', definition: 'the condition in which every sentence of a paragraph serves the claim made by its topic sentence.' },
        { term: 'development', definition: 'specific evidence plus explanation of what that evidence shows — not restatement of the claim.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-find-the-drift',
      kind: 'worked_example',
      problem:
        'Find the sentence that breaks unity in this paragraph, and explain the test you used. "(1) The new late bus has made after-school clubs possible for students who live across the district. (2) Before it started running, anyone without a ride home had to leave the building at three o\'clock sharp. (3) The driver, Mr. Alvarez, also coaches a youth soccer league on weekends. (4) Since September, robotics club attendance has nearly doubled."',
      steps: [
        'Find the promise first. Sentence 1 is the topic sentence: the late bus made after-school clubs possible for students who live far away. That is the job of this room.',
        'Apply the unity test to sentence 2: does the old three o\'clock deadline help prove that the bus opened up clubs? Yes — it shows what the problem was before, so the change means something. Keep it.',
        'Apply the test to sentence 3: does what Mr. Alvarez does on weekends help prove that the bus opened up clubs? No. It is about the driver as a person, not about club access. It entered the paragraph by association, because the bus made the writer think of the driver.',
        'Apply the test to sentence 4: does doubled robotics attendance help prove the promise? Yes, and it is the strongest sentence in the paragraph — it is the specific evidence that clubs actually filled up.',
        'Cut sentence 3. Notice what makes this hard: sentence 3 is true, it is friendly, and it is the most human line in the paragraph. Being true and being on the job are different tests, and only the second one decides.',
      ],
      answer:
        'Sentence 3 breaks unity — the driver\'s weekend coaching does not help prove that the late bus opened up after-school clubs, so it is cut even though it is true and interesting.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-restating-not-developing',
      kind: 'worked_example',
      problem:
        'A student turns in this paragraph and says it is done: "(1) The school store should stay open during lunch. (2) Keeping it open at lunch would be a good idea. (3) Right now it opens only in the twenty minutes before first period, when most buses have not arrived. (4) Students would really benefit from being able to shop at lunch." Which sentences actually develop the point, and how would you fix the paragraph?',
      steps: [
        'Identify the promise. Sentence 1 is the topic sentence: the store should stay open during lunch. Everything after it should give the reader a reason to agree.',
        'Test sentence 2 with the added-knowledge question: what does the reader know now that they did not know one sentence ago? Nothing. "Should stay open" and "would be a good idea" are the same claim in different words. This is the restatement error.',
        'Test sentence 3: it gives a specific fact — the store opens only in a twenty-minute window before first period, and most buses have not arrived yet. That is real evidence, and it is the only sentence in the paragraph doing work.',
        'Test sentence 4: "students would really benefit" is the claim again with an intensifier attached. Adding "really" is not adding support. This is the same error as sentence 2.',
        'Fix it. Cut sentences 2 and 4, then develop sentence 3 by saying what it shows: "Right now it opens only in the twenty minutes before first period, when most buses have not arrived. A student who rides bus 14 cannot reach the counter before it closes, so the store is effectively unavailable to about a third of the school." Now there is evidence plus an explanation of what the evidence proves.',
      ],
      answer:
        'Only sentence 3 develops the point; sentences 2 and 4 restate the claim in new words and should be replaced with evidence plus an explanation of what that evidence shows.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-delete-the-sentence',
      kind: 'try_yourself',
      problem:
        'Which sentence should be deleted to keep this paragraph unified? "(1) The quiet study room has become the most contested space in the library. (2) Students sign up for its twelve seats within minutes of the sheet going up each morning. (3) Ms. Duncan repainted the reading nook a soft green over the summer. (4) During exam weeks the sheet is full before the first bell rings."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sentence 1: The quiet study room has become the most contested space in the library.' },
        { id: 'b', text: 'Sentence 2: Students sign up for its twelve seats within minutes of the sheet going up each morning.' },
        { id: 'c', text: 'Sentence 3: Ms. Duncan repainted the reading nook a soft green over the summer.', correct: true },
        { id: 'd', text: 'Sentence 4: During exam weeks the sheet is full before the first bell rings.' },
      ],
      expectedAnswer: 'Sentence 3: Ms. Duncan repainted the reading nook a soft green over the summer.',
      hints: [
        'Underline the topic sentence first, then ask of each other sentence: does this help prove that the study room is contested?',
        'Two sentences give evidence about demand for the seats. One is about redecorating a different part of the library — true, but not the paragraph\'s job.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-topic-sentence',
      kind: 'try_yourself',
      problem:
        'A paragraph contains this support: "Bins were added to every hallway in October. Custodians report that the paper bins now fill twice as fast as they did last year. The student council began sorting the collected cans every Friday." Which topic sentence best fits this support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Recycling is one of the most important things a community can do for the environment.' },
        { id: 'b', text: 'The school recycling program has expanded quickly since October.', correct: true },
        { id: 'c', text: 'The student council meets every Friday afternoon in the cafeteria.' },
        { id: 'd', text: 'Custodians handle far more work each week than most students realize.' },
      ],
      expectedAnswer: 'The school recycling program has expanded quickly since October.',
      hints: [
        'A topic sentence must promise exactly what the support delivers — no broader, no narrower.',
        'One option is a general opinion the support never proves, one covers only a single detail, and one makes a claim about custodians that the support does not argue.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-develops',
      kind: 'try_yourself',
      problem:
        'A paragraph opens with this topic sentence: "The switch to a four-minute passing period has made the halls calmer." Which sentence best DEVELOPS that point?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The halls are noticeably calmer now than they were before the schedule changed.' },
        { id: 'b', text: 'Hall monitors logged eleven late arrivals in October compared with thirty-four in September, and students no longer sprint between the science wing and the gym.', correct: true },
        { id: 'c', text: 'Passing periods at this school used to be three minutes long.' },
        { id: 'd', text: 'Many students argue that the lunch period should be extended as well.' },
      ],
      expectedAnswer: 'Hall monitors logged eleven late arrivals in October compared with thirty-four in September, and students no longer sprint between the science wing and the gym.',
      hints: [
        'Ask the added-knowledge question of each choice: what does the reader learn that the topic sentence did not already say?',
        'One choice restates the claim, one gives background without proving anything, and one drifts to a different issue. Only one supplies specific evidence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-interesting-is-not-on-topic',
      kind: 'misconception_check',
      question:
        'A student is told to cut the sentence that breaks unity and refuses: "But that is the best line in the paragraph — it is the only part anyone would actually want to read." What went wrong?',
      commonErrors: [
        {
          answer: 'Kept the off-topic sentence because it was the most interesting one.',
          misconception: 'Treating interest, truth, or good phrasing as proof that a sentence belongs — judging sentences on quality instead of on job.',
          correctsTo:
            'Unity is decided by one question only: does this sentence help prove the topic sentence? An interesting, true, beautifully worded sentence that does a different job still breaks the paragraph, and readers feel the break even when they cannot name it. The good news is that cutting is not deleting forever — a strong off-topic sentence is often the seed of its own paragraph, so move it rather than mourn it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The topic sentence is a promise: it names the one claim the paragraph will prove.',
        'Unity test — ask of every sentence "does this help prove the promise?" If no, cut it or move it to its own paragraph.',
        'Development means specific evidence plus a line explaining what it shows; rewording the claim adds length, not support.',
        'A true, interesting sentence can still be off-topic — and one paragraph that is proving two claims should become two paragraphs.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Topic Sentences & Paragraph Unity' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
