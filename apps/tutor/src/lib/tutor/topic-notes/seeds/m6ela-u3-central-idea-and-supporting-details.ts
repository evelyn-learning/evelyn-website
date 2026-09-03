/**
 * Grade 6 English Language Arts — Unit 3 CED 3.1: Central Idea & Supporting Details.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.central-idea-and-supporting-details.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.central-idea-and-supporting-details.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Central Idea & Supporting Details',
  planId: 'evelyn.ms.m6ela.central-idea-and-supporting-details.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.central-idea-and-supporting-details.v1' }],
  theory: [
    { loId: 'm6ela.central-idea-and-supporting-details', content: `A TOPIC IS A WORD OR A SHORT PHRASE. A CENTRAL IDEA IS A WHOLE SENTENCE. Earthworms, sea turtles and public libraries are topics. They name what an informational text is about, and they make no claim about it. A central idea states the main point the text makes about that topic: "Earthworms make soil healthier in more than one way." If your answer to "what is the central idea" fits in one or two words, you have named the topic and stopped early.` },
    { loId: 'm6ela.central-idea-and-supporting-details', content: `BUILD THE CENTRAL IDEA FROM WHAT EVERY PART OF THE TEXT ADDS UP TO, NOT FROM ONE SENTENCE ALONE. Ask what fact or idea the text keeps returning to, and what point it makes about that thing across the whole text, not just its first sentence. A central idea has to be broad enough to cover every paragraph, not narrow enough to fit only one of them.` },
    { loId: 'm6ela.central-idea-and-supporting-details', content: `A SUPPORTING DETAIL IS A SPECIFIC FACT THAT LETS YOU ANSWER "HOW DO YOU KNOW THAT IS TRUE." Each supporting detail should connect back to the central idea and help prove it. A detail that is interesting and true, but does not connect to the stated central idea, is off topic, even when it appears in the very same paragraph.` },
    { loId: 'm6ela.central-idea-and-supporting-details', content: `A SINGLE SUPPORTING DETAIL IS NOT A CENTRAL IDEA, EVEN WHEN IT IS THE MOST INTERESTING ONE. If your sentence describes only one fact from the text and leaves the others unexplained, you have picked a detail instead of the idea that ties every detail together.` },
    { loId: 'm6ela.central-idea-and-supporting-details', content: `TEST YOUR CENTRAL IDEA AGAINST TWO SEPARATE DETAILS. Say the sentence, then point at two different facts in the text that support it. If you can only find one, or none, you have a guess, and if a detail in the text contradicts your sentence, the sentence is wrong, not the detail.` },
    { loId: 'm6ela.central-idea-and-supporting-details', kind: 'definition', title: 'topic', content: `the subject an informational text is about, named in a word or short phrase, such as earthworms or the water cycle.` },
    { loId: 'm6ela.central-idea-and-supporting-details', kind: 'definition', title: 'central idea', content: `the one sentence stating the main point a text makes about its topic, supported by the whole text.` },
    { loId: 'm6ela.central-idea-and-supporting-details', kind: 'definition', title: 'supporting detail', content: `a specific fact, example or explanation from the text that helps prove the central idea is true.` },
    { loId: 'm6ela.central-idea-and-supporting-details', kind: 'definition', title: 'informational text', content: `a text written to explain, describe or give facts about a real subject, rather than tell a story.` },
    { loId: 'm6ela.central-idea-and-supporting-details', kind: 'definition', title: 'off topic', content: `true and printed in the text, but not connected to the central idea being discussed.` },
  ],
  methods: [
    {
      title: 'Worked build a central idea',
      steps: [
        `Name the topic first, in a word or short phrase. This paragraph keeps circling earthworms and soil. That is the subject, not the central idea, because it makes no claim about anything.`,
        `Ask what fact the paragraph returns to about that topic across every sentence, not just the first one. Sentence two says the tunnels "let air and water reach plant roots." Sentence three says eating rotten matter lets earthworms "release it from their bodies as castings full of nutrients."`,
        `Ask what those two facts add up to. Tunnels bring air and water to the soil, and castings bring nutrients to the soil. Both are ways the soil becomes healthier because earthworms are living in it.`,
        `Write one sentence that covers both facts, not just one of them: "Earthworms make soil healthier in more than one way, by loosening it and by adding nutrients to it."`,
        `Run the two-detail test. Detail one: their tunnels "let air and water reach plant roots." Detail two: their castings are "full of nutrients." Two separate places in the paragraph, both supporting the same sentence. The central idea holds.`,
        `Check the last sentence too. It says farmers count earthworms "to get a quick sense of how healthy that soil is," which only makes sense if earthworms are already doing something to make soil healthier. That sentence supports the central idea instead of adding a new one.`,
      ],
      example: { problem: `Read this paragraph about earthworms, then state its central idea and support it with two details.

"Earthworms spend most of their lives tunneling through soil. As they move, their tunnels let air and water reach plant roots that would otherwise sit in packed, dry dirt. Earthworms also eat dead leaves and other rotting plant matter, then release it from their bodies as castings full of nutrients. Farmers and gardeners often count the number of earthworms in a patch of soil to get a quick sense of how healthy that soil is."`, solution: `Central idea: earthworms make soil healthier in more than one way, by loosening it and by adding nutrients to it. Evidence: their tunnels "let air and water reach plant roots," and their castings are "full of nutrients."` },
      relatedLoIds: ['m6ela.central-idea-and-supporting-details'],
    },
    {
      title: 'Worked find the detail that does not belong',
      steps: [
        `Check each detail against the central idea one at a time. Ask: does this fact explain why the owl's neck matters for looking around, or is it about something else?`,
        `Detail one restates the paragraph's first sentence: "An owl cannot roll its eyes to look sideways the way a person can, because an owl's eyes are fixed in their sockets." That explains why the neck has to do so much work in the first place, so it connects directly to the central idea.`,
        `Detail two restates the paragraph's second sentence: "an owl's neck contains many more bones than a human neck, arranged so the owl can turn its head far around without cutting off the blood flow to its brain." That describes the neck doing exactly the job the central idea names, so it also connects directly.`,
        `Detail three restates the paragraph's last sentence: "An owl also blinks using three different eyelids: one for regular blinking, one for use while sleeping, and one for keeping the eye clean." This sentence is true, but it explains blinking and eye care, not why the neck turns or why the owl can watch its surroundings without moving its whole body. It does not connect to this central idea at all.`,
        `WRONG (as a supporting detail for this central idea): "An owl also blinks using three different eyelids: one for regular blinking, one for use while sleeping, and one for keeping the eye clean." This sentence is a true fact about owls, but it supports a different idea entirely — how an owl protects and cleans its eyes — not how the neck lets it look around.`,
        `CORRECT supporting-detail list for this central idea keeps only the first two details: the eyes are fixed in their sockets and cannot roll sideways, and the neck has extra bones arranged to turn far around without cutting off blood flow.`,
      ],
      example: { problem: `Read the paragraph, the central idea already written below it, and a classmate's list of three details meant to support that idea. One of the three does not actually support it. Find the one that does not belong.

"An owl cannot roll its eyes to look sideways the way a person can, because an owl's eyes are fixed in their sockets. Instead, an owl's neck contains many more bones than a human neck, arranged so the owl can turn its head far around without cutting off the blood flow to its brain. An owl also blinks using three different eyelids: one for regular blinking, one for use while sleeping, and one for keeping the eye clean."

Central idea: An owl's neck is built to do a job its eyes cannot do on their own — letting it watch its surroundings without turning its whole body.

Classmate's three details:
1. An owl's eyes cannot roll sideways because they are fixed in their sockets.
2. An owl's neck has many more bones than a human's, arranged to turn far without cutting off blood flow to the brain.
3. An owl blinks using three different eyelids, each with its own job.`, solution: `Detail three does not belong. It is a true fact about owls, but it explains blinking and eye care, not the central idea about the neck's job. The central idea is supported only by the fact that an owl's eyes are fixed in their sockets and cannot roll sideways, and the fact that its neck has extra bones arranged to turn far around without cutting off blood flow.` },
      relatedLoIds: ['m6ela.central-idea-and-supporting-details'],
    },
  ],
  pointers: [
    { content: `Students often say "The central idea is libraries." — A topic names what the article is about. A central idea says something about it, as a full sentence. Turn the word into a sentence that covers every kind of lending the article mentions, then test it: does it fit tools, sewing machines, telescopes, museum passes, meeting rooms, and computer labs all at once? "Public libraries now offer far more than books to borrow or use" does. "Libraries" alone does not say anything yet.`, kind: 'common-error' },
    { content: `Students often say "The central idea is that libraries let you borrow tools." — A central idea has to cover every detail the article gives, not just the most interesting one. This sentence explains tools, but it leaves out sewing machines, telescopes, museum passes, meeting rooms and computer labs entirely, and none of those are borrowed tools. Check any central idea by asking whether it still holds once you swap in a different detail from the same article. If the sentence stops making sense, it was a detail wearing a central idea's clothes.`, kind: 'common-error' },
    { content: `A topic is a word or short phrase. A central idea is a whole sentence stating the main point a text makes about that topic.`, kind: 'tip' },
    { content: `Build a central idea from what every part of the text adds up to, not from one sentence alone. It has to be broad enough to cover every paragraph.`, kind: 'tip' },
    { content: `A single supporting detail is not a central idea, even the most interesting one. WRONG: treating "libraries let you borrow tools" as the whole idea. CORRECT: "Public libraries now offer far more than books to borrow or use," which covers tools, sewing machines, telescopes, museum passes, meeting rooms and computer labs together.`, kind: 'tip' },
    { content: `A supporting detail is a specific fact that answers "how do you know that is true" for the central idea. A detail that is true but does not connect to the stated central idea is off topic, even inside the same paragraph.`, kind: 'tip' },
    { content: `Test every central idea against two separate details. One detail, or none, means you have a guess, and a detail that contradicts your sentence means the sentence is wrong.`, kind: 'tip' },
    { content: `A fact can be true and still not belong on a supporting-details list, when it explains something else entirely — an owl's three eyelids explain blinking, not why its neck turns.`, kind: 'tip' },
  ],
};
