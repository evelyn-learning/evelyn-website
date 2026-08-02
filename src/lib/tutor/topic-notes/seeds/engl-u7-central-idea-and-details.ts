/**
 * HS English — Unit 7 CED 7.1: Central Idea & Supporting Details.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.central-idea-and-details.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U7_CENTRAL_IDEA_AND_DETAILS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.central-idea-and-details.v1',
  course: 'HS English',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Central Idea & Supporting Details',
  planId: 'evelyn.hs.engl.central-idea-and-details.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.central-idea-and-details.v1' }],
  theory: [
    { loId: 'engl.central-idea-and-details', content: `CENTRAL IDEA = TOPIC + WHAT THE TEXT SAYS ABOUT IT. The topic is a noun phrase you could put on a folder tab: "school gardens," "city buses." The central idea is a full sentence with a claim in it: "School gardens change what students are willing to eat." If your answer has no verb doing real work, you have named the topic, not the idea.` },
    { loId: 'engl.central-idea-and-details', kind: 'framework', title: 'The Goldilocks test', content: `THE GOLDILOCKS TEST — scope has to fit. TOO NARROW means you handed back one detail (a date, a number, a single example) and promoted it to the point. TOO BROAD means you handed back the whole subject ("transportation matters in cities"), a sentence that would fit a hundred other texts. The central idea is the one statement that covers THIS text and no more.` },
    { loId: 'engl.central-idea-and-details', kind: 'framework', title: 'Details have a job', content: `DETAILS HAVE A JOB — every supporting detail SUPPORTS, EXPLAINS, or PROVES the central idea. It gives an example of it, spells out how it works, or offers evidence that it is true. A fact that does none of those three jobs may be interesting, but it is not supporting THIS idea.` },
    { loId: 'engl.central-idea-and-details', kind: 'framework', title: 'The first-sentence trap', content: `THE FIRST-SENTENCE TRAP — the central idea is not always sentence one. Writers open with background, a common belief, or a scene, then turn. Watch for the turn words: however, but, yet, still, in fact. What follows the turn is usually the actual claim, and the opening was the setup being corrected.` },
    { loId: 'engl.central-idea-and-details', kind: 'framework', title: 'The summarize-in-one-sentence check', content: `THE SUMMARIZE-IN-ONE-SENTENCE CHECK — say the whole text in a single sentence, in your own words, without looking. If your sentence uses only half the paragraph, it is too narrow. If it could describe a text you have never read, it is too broad. That sentence, tightened, is the central idea.` },
    { loId: 'engl.central-idea-and-details', kind: 'framework', title: 'The detail-magnet error', content: `THE DETAIL-MAGNET ERROR — the most vivid item in a text pulls attention to itself: the big percentage, the shocking number, the strange example. Vivid does not mean central. Ask what the striking fact was put there to prove; the answer to that question is the central idea, and the fact is the evidence serving it.` },
    { loId: 'engl.central-idea-and-details', kind: 'framework', title: 'Test against every sentence', content: `TEST AGAINST EVERY SENTENCE — a real central idea has every other sentence working for it. Read your candidate sentence, then check each sentence of the text and ask what job it does. If several sentences have no relationship to your candidate, your candidate is a detail wearing a crown.` },
    { loId: 'engl.central-idea-and-details', kind: 'definition', title: 'topic', content: 'what the text is about, stated as a noun phrase — not yet a claim.' },
    { loId: 'engl.central-idea-and-details', kind: 'definition', title: 'central idea', content: `the single sentence stating what the text says ABOUT its topic; every other sentence supports it.` },
    { loId: 'engl.central-idea-and-details', kind: 'definition', title: 'supporting detail', content: `a fact, example, or explanation whose job is to support, explain, or prove the central idea.` },
  ],
  methods: [
    {
      title: 'Worked Goldilocks',
      steps: [
        `Name the topic first, as a noun phrase: Saturday bus service on one city route. That is a folder tab, not yet an idea — no claim in it.`,
        `Ask what the text SAYS about that topic. Sentence 2 explains why the riders came (access to jobs and clinics), and sentence 3 states the conclusion planners drew: the problem was WHEN buses ran, not WHERE they went.`,
        `Draft the sentence: adding weekend service showed that the neighborhood was limited by the schedule rather than by the routes themselves.`,
        `Run Goldilocks — too narrow: "Ridership rose 34 percent." True, and it is one number from one sentence; the rest of the excerpt does no work for it.`,
        `Run Goldilocks — too broad: "Public transit is important to city residents." That sentence would fit any transit text ever written, so it cannot be THIS text's point.`,
        `Check it against every sentence: the 34 percent is evidence, the rider surveys explain the cause, and the planners' conclusion states the idea outright. All three sentences serve the drafted claim, so the scope is right.`,
      ],
      example: { problem: `Determine the central idea of this excerpt, using the Goldilocks test: "A city transit report found that ridership on the number 12 bus rose 34 percent after the route added Saturday service. Riders surveyed said the weekend trips finally let them reach jobs and clinics they could not walk to. Planners now describe schedule gaps, not missing routes, as the neighborhood's real barrier."`, solution: `Adding Saturday service revealed that the schedule, not the route map, was the real barrier to getting around the neighborhood` },
      relatedLoIds: ['engl.central-idea-and-details'],
    },
    {
      title: 'Worked detail magnet',
      steps: [
        `Notice what the student grabbed: the largest, most quotable number in the excerpt. That is the detail magnet at work — vivid pulled harder than central.`,
        `Ask the diagnostic question: what was that statistic put there to PROVE? It is evidence that gardening changed student eating, which means it serves an idea rather than being one.`,
        `Read sentence 2, which the student's answer ignores entirely: the effect appeared even where the menu stayed the same. That sentence exists only to rule out the cafeteria as the cause.`,
        `Read sentence 3, where the researchers state the claim outright: the change happened in what students were WILLING to try, not in what was offered. Sentences 1 and 2 are both working for that claim.`,
        `Rewrite with correct scope: growing food changes what students are willing to eat, even when the cafeteria menu does not change. The 21 percent stays in the answer only as evidence, not as the point.`,
      ],
      example: { problem: `A student reads this excerpt and says the central idea is "Students who tend a garden eat 21 percent more vegetables." What did the student miss? Excerpt: "A three-year study across eleven districts found that students who tended a school garden ate 21 percent more vegetables at lunch. The effect held even at schools where the cafeteria menu never changed. Researchers concluded that growing food changes what students are willing to try, not what schools put on the tray."`, solution: `The 21 percent is the evidence, not the idea: the excerpt claims that growing food changes what students are willing to try, even when the menu stays the same` },
      relatedLoIds: ['engl.central-idea-and-details'],
    },
  ],
  pointers: [
    { content: `Nonfiction writers often open with background, a widely held belief, or a scene, then turn against it with however, but, or in fact. When that happens, sentence one is the idea being CORRECTED. Locate the turn, then test your candidate sentence against every sentence in the text — the central idea is the one they all work for, wherever it sits.`, kind: 'common-error' },
    { content: `Central idea = topic + what the text SAYS about it; a topic alone is a folder tab, not an idea.`, kind: 'tip' },
    { content: `Goldilocks test: not too narrow (one detail promoted to the point), not too broad (a sentence that fits any text on the subject).`, kind: 'tip' },
    { content: `Supporting details do one of three jobs — support, explain, or prove the central idea.`, kind: 'tip' },
    { content: `The central idea is not always sentence one; watch for however, but, and in fact, and check your sentence against the whole text.`, kind: 'tip' },
    { content: `The most vivid statistic is usually evidence, not the idea. Ask what it was put there to prove.`, kind: 'tip' },
    { content: `If your "central idea" is a noun phrase with no verb doing real work ("school gardens," "city buses," "the effects of transit"), you've named the TOPIC. Force it into a full sentence that makes a claim before you call it an idea.`, kind: 'vocab-note' },
    { content: `The biggest number in the passage is almost never the central idea. Ask: what was this statistic put there to PROVE? Your answer to that question is the idea; the number stays as evidence.`, kind: 'common-error' },
    { content: `Don't assume sentence one is the thesis. Scan for **however, but, yet, still, in fact** — what follows the turn is usually the real claim, and the opening was the belief being corrected.`, kind: 'gotcha' },
    { content: `Test your candidate against EVERY sentence, not just the ones that fit. If two or three sentences do no work for your sentence, it's a detail wearing a crown — widen it until they all have a job.`, kind: 'tip' },
    { content: `"Too broad" has a test: if your sentence could describe a text you've never read ("transit matters," "gardens are healthy"), it's not THIS text's idea. Add the specific claim that makes it unrepeatable.`, kind: 'common-error' },
    { content: `A supporting detail must do one of three jobs: give an example, explain how it works, or prove it's true. "Interesting and in the same paragraph" is not a job — true facts can still be non-supporting.`, kind: 'vocab-note' },
    { content: `Watch for the rule-out sentence ("the effect held even when the menu didn't change"). It looks skippable but usually eliminates a rival cause — and answers that ignore it are too narrow.`, kind: 'edge-case' },
    { content: `Do the one-sentence summary from memory, not by copying the passage. If you find yourself lifting a whole sentence verbatim, you're probably restating a detail instead of synthesizing the idea.`, kind: 'tip' },
  ],
};
