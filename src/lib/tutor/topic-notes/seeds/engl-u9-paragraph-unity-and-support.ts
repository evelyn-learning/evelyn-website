/**
 * HS English — Unit 9 CED 9.2: Topic Sentences & Paragraph Unity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.paragraph-unity-and-support.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U9_PARAGRAPH_UNITY_AND_SUPPORT: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.paragraph-unity-and-support.v1',
  course: 'HS English',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Topic Sentences & Paragraph Unity',
  planId: 'evelyn.hs.engl.paragraph-unity-and-support.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.paragraph-unity-and-support.v1' }],
  theory: [
    { loId: 'engl.paragraph-unity-and-support', kind: 'framework', title: 'The topic sentence is a promise', content: `THE TOPIC SENTENCE IS A PROMISE — it names the one claim the paragraph will prove. "The new late bus has opened up after-school clubs" promises evidence about clubs and the bus. A reader who finishes the paragraph should feel that exact promise was kept, no more and no less.` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'framework', title: 'Unity', content: `UNITY — every sentence in the paragraph serves the topic sentence. The test is one question asked of each sentence: does this help prove the promise? If the honest answer is no, the sentence goes, no matter how good it is on its own.` },
    { loId: 'engl.paragraph-unity-and-support', content: `DEVELOPMENT = EVIDENCE + EXPLANATION — a supported point needs something specific (a number, an example, a detail, a moment) AND a sentence that says what the specific thing shows. Evidence alone leaves the reader guessing; explanation alone is just the claim again, louder.` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'framework', title: 'Error 1', content: `ERROR 1 — THE OFF-TOPIC DRIFT. One sentence follows an association instead of the promise: a fact about a person mentioned in passing, a related-but-different complaint, a memory the writer likes. It usually enters because it is true and interesting. It still breaks unity and must be cut or moved to its own paragraph.` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'framework', title: 'Error 2', content: `ERROR 2 — REPEATING THE POINT IN NEW WORDS. "The store should open at lunch. Opening at lunch would be a good idea." Nothing was added; the claim was reworded. Restatement feels like writing because the page gets longer, but the reader learns nothing new. Ask of every added sentence: what does the reader now know that they did not know one sentence ago?` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'framework', title: 'Placement', content: `PLACEMENT — the topic sentence usually comes first, and first is the safest choice in school writing. But the position is not the rule; the JOB is. A paragraph can open with a brief lead-in and land the topic sentence second, and it can occasionally close with it. What is never optional is that the claim is stated somewhere, in one sentence, unmistakably.` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'framework', title: 'One paragraph, one idea', content: `ONE PARAGRAPH, ONE IDEA — if a paragraph is trying to prove two claims, it does not need better transitions; it needs to become two paragraphs. Splitting is a fix, not an admission of failure.` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'framework', title: 'The revision routine', content: `THE REVISION ROUTINE — (1) underline the topic sentence, (2) ask of each remaining sentence "does this serve that promise?", (3) cut what drifts, (4) replace any restatement with a specific detail plus a line saying what it shows.` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'definition', title: 'unity', content: `the condition in which every sentence of a paragraph serves the claim made by its topic sentence.` },
    { loId: 'engl.paragraph-unity-and-support', kind: 'definition', title: 'development', content: `specific evidence plus explanation of what that evidence shows — not restatement of the claim.` },
  ],
  methods: [
    {
      title: 'Worked find the drift',
      steps: [
        `Find the promise first. Sentence 1 is the topic sentence: the late bus made after-school clubs possible for students who live far away. That is the job of this room.`,
        `Apply the unity test to sentence 2: does the old three o'clock deadline help prove that the bus opened up clubs? Yes — it shows what the problem was before, so the change means something. Keep it.`,
        `Apply the test to sentence 3: does what Mr. Alvarez does on weekends help prove that the bus opened up clubs? No. It is about the driver as a person, not about club access. It entered the paragraph by association, because the bus made the writer think of the driver.`,
        `Apply the test to sentence 4: does doubled robotics attendance help prove the promise? Yes, and it is the strongest sentence in the paragraph — it is the specific evidence that clubs actually filled up.`,
        `Cut sentence 3. Notice what makes this hard: sentence 3 is true, it is friendly, and it is the most human line in the paragraph. Being true and being on the job are different tests, and only the second one decides.`,
      ],
      example: { problem: `Find the sentence that breaks unity in this paragraph, and explain the test you used. "(1) The new late bus has made after-school clubs possible for students who live across the district. (2) Before it started running, anyone without a ride home had to leave the building at three o'clock sharp. (3) The driver, Mr. Alvarez, also coaches a youth soccer league on weekends. (4) Since September, robotics club attendance has nearly doubled."`, solution: `Sentence 3 breaks unity — the driver's weekend coaching does not help prove that the late bus opened up after-school clubs, so it is cut even though it is true and interesting.` },
      relatedLoIds: ['engl.paragraph-unity-and-support'],
    },
    {
      title: 'Worked restating not developing',
      steps: [
        `Identify the promise. Sentence 1 is the topic sentence: the store should stay open during lunch. Everything after it should give the reader a reason to agree.`,
        `Test sentence 2 with the added-knowledge question: what does the reader know now that they did not know one sentence ago? Nothing. "Should stay open" and "would be a good idea" are the same claim in different words. This is the restatement error.`,
        `Test sentence 3: it gives a specific fact — the store opens only in a twenty-minute window before first period, and most buses have not arrived yet. That is real evidence, and it is the only sentence in the paragraph doing work.`,
        `Test sentence 4: "students would really benefit" is the claim again with an intensifier attached. Adding "really" is not adding support. This is the same error as sentence 2.`,
        `Fix it. Cut sentences 2 and 4, then develop sentence 3 by saying what it shows: "Right now it opens only in the twenty minutes before first period, when most buses have not arrived. A student who rides bus 14 cannot reach the counter before it closes, so the store is effectively unavailable to about a third of the school." Now there is evidence plus an explanation of what the evidence proves.`,
      ],
      example: { problem: `A student turns in this paragraph and says it is done: "(1) The school store should stay open during lunch. (2) Keeping it open at lunch would be a good idea. (3) Right now it opens only in the twenty minutes before first period, when most buses have not arrived. (4) Students would really benefit from being able to shop at lunch." Which sentences actually develop the point, and how would you fix the paragraph?`, solution: `Only sentence 3 develops the point; sentences 2 and 4 restate the claim in new words and should be replaced with evidence plus an explanation of what that evidence shows.` },
      relatedLoIds: ['engl.paragraph-unity-and-support'],
    },
  ],
  pointers: [
    { content: `Unity is decided by one question only: does this sentence help prove the topic sentence? An interesting, true, beautifully worded sentence that does a different job still breaks the paragraph, and readers feel the break even when they cannot name it. The good news is that cutting is not deleting forever — a strong off-topic sentence is often the seed of its own paragraph, so move it rather than mourn it.`, kind: 'common-error' },
    { content: `The topic sentence is a promise: it names the one claim the paragraph will prove.`, kind: 'tip' },
    { content: `Unity test — ask of every sentence "does this help prove the promise?" If no, cut it or move it to its own paragraph.`, kind: 'tip' },
    { content: `Development means specific evidence plus a line explaining what it shows; rewording the claim adds length, not support.`, kind: 'tip' },
    { content: `A true, interesting sentence can still be off-topic — and one paragraph that is proving two claims should become two paragraphs.`, kind: 'tip' },
    { content: `A sentence being **true** is not the same as it being **on the job**. Ask "does this help prove my topic sentence?" — not "is this accurate/interesting/well-written?" The best-sounding line in a draft is often the one that has to go.`, kind: 'common-error' },
    { content: `Don't confuse *unity* with *development*. Unity = every sentence serves one claim (a cutting problem). Development = specific evidence plus explanation (an adding problem). A paragraph can be perfectly unified and still say nothing.`, kind: 'vocab-note' },
    { content: `Adding intensifiers is not adding support. "Students would *really* benefit" is the same claim as "students would benefit." Words like *really, definitely, so important, clearly* signal restatement, not evidence.`, kind: 'gotcha' },
    { content: `Test each new sentence with: "What does the reader know now that they didn't one sentence ago?" If the answer is "nothing," you reworded the claim instead of proving it.`, kind: 'tip' },
    { content: `Cutting isn't deleting forever. An off-topic sentence that's genuinely strong usually deserves its own paragraph — move it to a scratch line at the bottom of the page instead of mourning it.`, kind: 'tip' },
    { content: `Evidence with no explanation is half a job. A statistic or example left alone makes the reader guess what it proves — always follow it with a sentence saying what it shows about your claim.`, kind: 'common-error' },
    { content: `"Topic sentence first" is the safe default, not the rule. It may follow a short lead-in or close the paragraph — but it must exist, in one sentence, somewhere. A paragraph whose claim is only implied has no promise to test against.`, kind: 'edge-case' },
    { content: `If a paragraph is proving two claims, better transitions won't save it — split it into two paragraphs. "Also" and "in addition" are often the seam where the paragraph should have been cut in half.`, kind: 'gotcha' },
  ],
};
