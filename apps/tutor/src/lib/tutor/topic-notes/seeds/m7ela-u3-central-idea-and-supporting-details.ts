/**
 * Grade 7 English Language Arts — Unit 3 CED 3.1: Central Idea & Supporting Details.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.central-idea-and-supporting-details.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.central-idea-and-supporting-details.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Central Idea & Supporting Details',
  planId: 'evelyn.ms.m7ela.central-idea-and-supporting-details.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.central-idea-and-supporting-details.v1' }],
  theory: [
    { loId: 'm7ela.central-idea-and-supporting-details', content: `THE TOPIC IS A WORD. THE CENTRAL IDEA IS A SENTENCE. The topic is what the text is about, and you could write it on a folder tab: bees, sleep, city buses. The central idea is the most important POINT the text makes about that topic: bees do more for our food crops than most people realize. If your answer has no verb doing real work, you have handed back the topic and stopped early.` },
    { loId: 'm7ela.central-idea-and-supporting-details', content: `SUPPORTING DETAILS ARE THE FACTS, EXAMPLES AND REASONS THAT BACK THE POINT UP. Each one has a job. It gives an example of the idea, it explains how the idea works, or it shows that the idea is true. A detail that does none of those three jobs is not supporting THIS idea, however interesting it is.` },
    { loId: 'm7ela.central-idea-and-supporting-details', kind: 'framework', title: 'The whole-text test', content: `THE WHOLE-TEXT TEST — this is the test the questions are built on. A candidate central idea has to cover the WHOLE text, not one paragraph and not one sentence. Say your candidate out loud, then walk back through the text sentence by sentence and ask what job each sentence does for it. If several sentences have nothing to do with your candidate, your candidate is a detail wearing a crown.` },
    { loId: 'm7ela.central-idea-and-supporting-details', content: `THE FIRST SENTENCE IS OFTEN A HOOK, NOT THE POINT. Writers open with a common belief, a surprise or a scene, and then turn against it. Watch for the turn words: but, however, yet, in fact. What comes AFTER the turn is usually the real point, and the opening was the thing being corrected. So never take sentence one on trust. Test it like every other sentence.` },
    { loId: 'm7ela.central-idea-and-supporting-details', content: `THE MOST SURPRISING DETAIL IS ALMOST NEVER THE CENTRAL IDEA. The strangest fact in a text pulls your eye, but interesting is not the same as important. Ask what the surprising fact was put there to PROVE. Whatever it proves is the central idea, and the fact is a supporting detail doing its job.` },
    { loId: 'm7ela.central-idea-and-supporting-details', kind: 'definition', title: 'topic', content: 'what a text is about, said in a word or two — not yet a point.' },
    { loId: 'm7ela.central-idea-and-supporting-details', kind: 'definition', title: 'central idea', content: `the most important point the whole text makes about its topic, written as a complete sentence.` },
    { loId: 'm7ela.central-idea-and-supporting-details', kind: 'definition', title: 'supporting detail', content: 'a fact, example or reason whose job is to back up the central idea.' },
    { loId: 'm7ela.central-idea-and-supporting-details', kind: 'definition', title: 'informational text', content: `writing whose job is to explain something true, such as an article, a notice or a field guide entry.` },
  ],
  methods: [
    {
      title: 'Worked whole text test',
      steps: [
        `Name the topic first, in a word or two: birds and winter. That is a folder tab. There is no point in it yet, so it cannot be the answer.`,
        `Now ask what the paragraph SAYS about that topic. Sentence 2 gives a reason — the birds that leave are chasing food, not fleeing cold. Sentence 3 gives the flip side — birds that can find winter food stay.`,
        `Draft a candidate sentence: birds migrate to follow their food, which is why the birds that can change what they eat are able to stay put.`,
        `Run the whole-text test. Sentence 1 sets up the surprise that not all birds go. Sentence 2 states the reason. Sentence 3 shows the other half of the same reason. All three sentences work for the candidate, so the scope is right.`,
        `Now test a weaker candidate so you can see it fail: "Insects and soft fruit disappear in winter." That is true, and it is one clause of one sentence. Sentences 1 and 3 do nothing for it, so it is a supporting detail, not the point.`,
        `Test one more: "Birds are interesting animals." Every sentence in the paragraph is about birds, so it passes the first glance, but that sentence would fit a thousand other paragraphs. It is too big to be THIS text's point.`,
      ],
      example: { problem: `Find the central idea of this paragraph, and show how you tested it.

"Not every bird flies south for the winter. The birds that leave are mostly following food, not running from the cold, because insects and soft fruit disappear once the freeze arrives. Birds that can switch to seeds, nuts or the insects tucked under tree bark often stay in one place all year."`, solution: `Central idea: birds migrate to follow food rather than to escape the cold, which is why birds that can switch to seeds and bark insects stay all year. Supporting details: insects and soft fruit vanish in the freeze, and some birds can change what they eat.` },
      relatedLoIds: ['m7ela.central-idea-and-supporting-details'],
    },
    {
      title: 'Worked hook versus point',
      steps: [
        `Look at where the student got that answer. It is sentence one, almost word for word. That is the first-sentence trap: taking the opening line on trust because it came first.`,
        `Find the turn word. Sentence 2 starts with "But". A "but" tells you the writer is about to push back on what was just said, so sentence 1 is the setup being corrected, not the point.`,
        `Read what comes after the turn. Sentence 3 says the brain goes back over the day's practice while you sleep and files it away, and it gives an everyday example of that happening.`,
        `Draft the candidate: sleep is when your brain stores what you practiced, so sleep is part of learning a skill and not just a rest from being tired.`,
        `Run the whole-text test on it. Sentence 1 sets up the common belief, sentence 2 says that belief is not the biggest part, and sentence 3 states the real point and gives the example. Every sentence has a job under the candidate, so it holds.`,
        `WRONG answer: "Staying up late is bad for you." It covers only the hook, and it is the very idea the writer says is not the main cost. CORRECT answer: sleep is when your brain files away what you practiced, so it helps a new skill stick.`,
      ],
      example: { problem: `A student says the central idea of this paragraph is "Staying up late is bad for you." Explain what went wrong, and give the real central idea.

"Everybody already knows that staying up late leaves you tired. But being tired is not the biggest cost. While you sleep, your brain goes back over what you practiced during the day and files it away, which is why a piece of music or a skateboard trick you kept fumbling at night can feel easier the next morning."`, solution: `The student crowned the hook. The word "But" at the start of sentence 2 signals the turn, and the real central idea is that sleep is when the brain stores what you practiced, so it is part of learning a skill rather than only a cure for tiredness.` },
      relatedLoIds: ['m7ela.central-idea-and-supporting-details'],
    },
  ],
  pointers: [
    { content: `Students often say "The central idea is bees." — A topic is a word you could write on a folder tab. A central idea is a complete sentence with a point in it. Ask what the paragraph SAYS about bees, and the answer arrives: bees do far more for the food we eat than most people realize. Notice that this sentence has a verb doing real work, and that every sentence in the paragraph is backing it up.`, kind: 'common-error' },
    { content: `Students often say "The central idea is that farmers rent hives and drive them to their fields." — Run the whole-text test. The sentence about renting hives covers one sentence of three, and the pollination sentence does no work for it. Then ask the real question: what was that surprising fact put there to PROVE? It is there to show how much farmers depend on bees, which means it is evidence for the central idea, not the central idea itself.`, kind: 'common-error' },
    { content: `The topic is a word. The central idea is a complete sentence stating the most important point the text makes about that topic.`, kind: 'tip' },
    { content: `Supporting details are the facts, examples and reasons that back the point up. Each one gives an example, explains how it works, or shows it is true.`, kind: 'tip' },
    { content: `The whole-text test: your candidate has to cover EVERY sentence, not one paragraph and not one line.`, kind: 'tip' },
    { content: `The first sentence is often a hook. Look for but, however, yet or in fact, because the real point usually comes after the turn.`, kind: 'tip' },
    { content: `The most surprising detail is almost never the central idea. Ask what it was put there to prove.`, kind: 'tip' },
    { content: `If your central idea can be written on a folder tab ("bees," "sleep," "gears"), you've handed back the **topic**. A central idea is a full sentence with a verb doing real work: what does the text SAY about bees?`, kind: 'vocab-note' },
    { content: `Don't crown sentence one. Writers open with a common belief and then flip it. Scan for **but, however, yet, in fact** — the real point usually lands after the turn, and sentence one is the thing being corrected.`, kind: 'gotcha' },
    { content: `The weirdest fact is bait, not the point. Trucking beehives across the country grabs your eye, but ask: what was this fact put here to PROVE? Whatever it proves is the central idea; the fact is a supporting detail.`, kind: 'common-error' },
    { content: `Say your candidate out loud, then walk the text sentence by sentence and give each sentence a job. If two or three sentences do nothing for your candidate, it's a detail wearing a crown — widen it.`, kind: 'tip' },
    { content: `A candidate can also be TOO big. "Birds are interesting animals" covers every sentence — and a thousand other paragraphs too. If your sentence would fit some other text just as well, it isn't this text's point.`, kind: 'edge-case' },
    { content: `A supporting detail must do one of three jobs: give an example of the idea, explain how it works, or show it's true. A true, fascinating fact that does none of those isn't supporting THIS idea.`, kind: 'vocab-note' },
    { content: `A central idea is not a summary. A summary retells what happened in order; the central idea is one sentence naming the point. If you're writing "first... then... also...", stop — you're summarizing.`, kind: 'gotcha' },
    { content: `Some texts state the central idea nowhere. If no single sentence says it, you have to build the sentence yourself from what the details keep proving — don't just copy the longest-looking line.`, kind: 'edge-case' },
  ],
};
