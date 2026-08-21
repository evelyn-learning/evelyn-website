/**
 * Grade 7 English Language Arts — Unit 4 CED 4.1: Text Structure.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.text-structure.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U4_TEXT_STRUCTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.text-structure.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Text Structure',
  planId: 'evelyn.ms.m7ela.text-structure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.text-structure.v1' }],
  theory: [
    { loId: 'm7ela.text-structure', kind: 'framework', title: 'Text structure is the shape of a whole passage, not what it is about', content: `TEXT STRUCTURE IS THE SHAPE OF A WHOLE PASSAGE, NOT WHAT IT IS ABOUT — two writers can pick the same topic and arrange it two completely different ways. Structure is the arrangement: which idea comes first, what sits next to what, where the passage lands. It is a decision the writer made, and you can catch them making it.` },
    { loId: 'm7ela.text-structure', kind: 'framework', title: 'Chronological or sequence', content: `CHRONOLOGICAL OR SEQUENCE — the parts are arranged in time order or in step order. Signal words: first, then, next, later, after that, finally, that spring. The test: does each part come AFTER the one before it, so that swapping two parts would break the passage? Instructions, recipes and histories live here.` },
    { loId: 'm7ela.text-structure', kind: 'framework', title: 'Cause and effect', content: `CAUSE AND EFFECT — one thing makes another thing happen. Signal words: because, so, since, as a result, therefore, led to. The test: can you retell the WHOLE passage as "X happened, so Y happened"? Careful, though. One "because" sitting inside one sentence does not settle anything. It explains a single detail. The test is about the whole passage.` },
    { loId: 'm7ela.text-structure', kind: 'framework', title: 'Compare and contrast and problem and solution', content: `COMPARE AND CONTRAST AND PROBLEM AND SOLUTION — two shapes that are easy to tell apart once you count the subjects. Compare and contrast holds two subjects up against each other and uses the same categories on both. Signal words: however, both, unlike, while, on the other hand, instead. Problem and solution names one thing that is not working and then gives a fix. Signal words: the trouble was, one difficulty, one answer is, to fix this, that solved it. If there is no fix on the page, it is not problem and solution.` },
    { loId: 'm7ela.text-structure', kind: 'framework', title: 'Description', content: `DESCRIPTION — one subject, and the sentences pile up features, parts or examples about it. Signal words are weakest here: for example, such as, in addition, along one wall. The test: are the sentences siblings, each adding another fact about the same one thing, instead of leading into one another? Description is where you land when nothing else fits.` },
    { loId: 'm7ela.text-structure', kind: 'framework', title: 'Name the shape, then ask why the writer chose it', content: `NAME THE SHAPE, THEN ASK WHY THE WRITER CHOSE IT — this is the half of the job most readers skip, and it is the half that matters. A comparison is there so you can judge or pick. A problem and solution is there to move you toward doing something. A sequence is there so you can follow or repeat something. A cause and effect is there to explain why something turned out the way it did. A description is there so you can picture one thing clearly. Say the shape, then say what the shape is DOING for the writer.` },
    { loId: 'm7ela.text-structure', kind: 'definition', title: 'text structure', content: 'the pattern a writer uses to arrange the ideas in an informational text.' },
    { loId: 'm7ela.text-structure', kind: 'definition', title: 'signal words', content: `small linking words that hint at a structure, such as because, however, first or such as. They are a clue, not proof.` },
    { loId: 'm7ela.text-structure', kind: 'definition', title: 'chronological', content: 'arranged in the order that things happened, or in the order steps must be done.' },
    { loId: 'm7ela.text-structure', kind: 'definition', title: 'dominant structure', content: `the shape that organizes a passage as a whole, even when a smaller shape shows up inside one part of it.` },
  ],
  methods: [
    {
      title: 'Worked time words are not the shape',
      steps: [
        'Do not start with the words. Start by saying out loud what each sentence DOES.',
        `Sentence 1 and sentence 2 name something that is not working: the rack fills up early, so bikes end up on the fence, and the fence bends. Sentence 3 says what the school did. Sentence 4 says what changed.`,
        `Now check the tempting label. "Last spring", "by June" and "This year" are time words, and time words pull hard toward chronological. So test it. Take the time words out and read it again: rack full, fence bending, second rack added, fence fine. It still holds together. That means time is a DETAIL here, not the plan.`,
        `Check cause and effect too, because there is a real causal link in here — the full rack is why bikes go on the fence, and that is why the fence bends. But notice where that link lives. It sits inside the first half. The paragraph does not exist to explain why fences bend. It exists to name a trouble and report a fix.`,
        `Apply the problem and solution test directly. Is something clearly not working in the first part? Yes. Does a later part act on it? Yes, the second rack. And the last sentence reports that the fix worked.`,
        `Finish the job. Why did the writer choose this shape? The paragraph is for a school newsletter, and the writer wants families to see that a complaint was heard and something got done. Problem and solution is the only shape that ends on a fix, so it is the shape that makes the school look like it listened.`,
      ],
      example: { problem: `Name the structure of this paragraph, and say why the writer chose it.

"Last spring the bike rack outside Cedar Middle School was full before the first bell. Students who came later locked their bikes to the fence, and by June the fence was bent in two places. This year the school put a second rack behind the gym. The fence has stayed straight ever since."`, solution: `Problem and solution. Sentences 1 and 2 name the trouble, sentence 3 gives the fix and sentence 4 reports the result. The time words are supporting detail, not the arrangement. The writer chose this shape because it ends on the fix, which is what a newsletter wants families to see.` },
      relatedLoIds: ['m7ela.text-structure'],
    },
    {
      title: 'Worked one because trap',
      steps: [
        `Find where the signal word actually sits. "Because" turns up near the end of sentence 3, and it explains one single thing: why a phone map can change the route. It is not doing anything to sentences 1 and 2.`,
        `Notice the second bit of bait. There is a "so" in sentence 2 as well. Two cause words in a short paragraph feels like a lot, which is exactly why this trap catches people.`,
        `Now label the parts instead. Sentence 1 names TWO subjects and says they do the same job in different ways. Sentence 2 is entirely about the paper map. Sentence 3 is entirely about the phone map, and the word "instead" marks the switch from one to the other.`,
        `Run the compare and contrast test: are two subjects being held up against each other using the same category? Yes. The category is how each one helps you find your way. One subject gets a sentence, then the other subject gets a sentence.`,
        `Name the mistake plainly. The student read one word and labeled the whole paragraph from it. A connecting word like "because" tells you how two ideas link inside a sentence. Structure tells you how the whole paragraph is built. Those are different sized questions.`,
        `Finish the job. Why this shape? The writer wants you to be able to choose. Putting the two maps in matching terms means you can see what you gain and what you give up with each one, which a paragraph about only one map could never do.`,
      ],
      example: { problem: `A student reads this paragraph, spots the word "because", and labels it cause and effect. What did the student miss?

"A paper map and a phone map both get you to the same corner, but they help in different ways. A paper map shows the whole town at once, so you can see how one street feeds into the next. A phone map instead gives you one turn at a time, and it can change the route because it knows which roads are busy right now."`, solution: `The paragraph is compare and contrast. Sentence 1 sets up two subjects, sentence 2 covers the paper map and sentence 3 covers the phone map. The word "because" explains one detail inside sentence 3 and does not set the shape of the whole paragraph.` },
      relatedLoIds: ['m7ela.text-structure'],
    },
  ],
  pointers: [
    { content: `Students often say "The passage has dates in it, so the structure must be chronological." — Dates are signal words, and signal words are a clue, not a verdict. Chronological means TIME is what puts the parts in order, so that swapping two parts would break the passage. In an article about a lighthouse, the two dates are just two more facts about one building, sitting next to its height, its color and the sound of its horn. Those facts are siblings, not a chain, and that makes the structure description. Do the test on the whole passage, every time, and let the words be a hint that sends you to the test.`, kind: 'common-error' },
    { content: `Students often say "It cannot be description, because part of it is clearly cause and effect." — A long text often nests one shape inside another. A problem and solution article can hold a cause and effect paragraph inside its first half, and a comparison can hold a tiny sequence inside one of its parts. That is normal, and it is not a contradiction. What you name is the DOMINANT structure — the shape that holds the whole thing together — and everything smaller is detail work inside it. A short passage like the ones in this lesson usually has one clear dominant shape, so if two labels both feel right, read again and ask which one organizes ALL the sentences rather than just one of them.`, kind: 'common-error' },
    { content: `Five shapes: chronological or sequence, cause and effect, compare and contrast, problem and solution, and description.`, kind: 'tip' },
    { content: `Signal words to keep in your ear: first, then, finally; because, as a result, therefore; however, both, unlike; the trouble was, one answer is; for example, such as.`, kind: 'tip' },
    { content: `Signal words are a clue, not a verdict. One "because" explains a link between two ideas. Structure is about how the whole passage is built.`, kind: 'tip' },
    { content: `Dates do not make a passage chronological. Chronological means time is what puts the parts in order, so that swapping two parts would break it.`, kind: 'tip' },
    { content: `Name the shape, then finish the job: comparison helps you judge, problem and solution pushes you to act, sequence lets you follow along, cause and effect explains why, description helps you picture one thing.`, kind: 'tip' },
    { content: `One "because" or one "so" does not make a passage cause and effect. Ask if you can retell the WHOLE passage as "X happened, so Y happened." If the causal link lives inside one sentence, it's a detail, not the shape.`, kind: 'common-error' },
    { content: `Dates and time words don't automatically mean chronological. Try covering the time words and reread. If the passage still holds together, time was a detail. Chronological means swapping two parts would break the passage.`, kind: 'gotcha' },
    { content: `Structure is the shape, not the topic. "It's about bikes" is not an answer. Two writers can take the same subject and arrange it five different ways, so name the arrangement, not the subject.`, kind: 'vocab-note' },
    { content: `No fix on the page means it is not problem and solution. A passage that only describes what's going wrong is cause and effect or description. Point to the sentence that gives the fix before you use that label.`, kind: 'edge-case' },
    { content: `Count the subjects before you choose. Two subjects measured on the same categories = compare and contrast. One subject with facts piling up = description. One thing broken plus a fix = problem and solution.`, kind: 'tip' },
    { content: `A passage can hold more than one shape. A cause-and-effect paragraph can sit inside a problem-and-solution article. Name the DOMINANT structure — the one that organizes every sentence, not just one part.`, kind: 'edge-case' },
    { content: `Don't stop at the label. Half the answer is why the writer picked that shape: comparison helps you choose, problem and solution pushes you to act, sequence lets you follow along, cause and effect explains why, description helps you picture it.`, kind: 'common-error' },
    { content: `Description is the shape you land on when nothing else fits — its signal words (for example, such as, in addition) are the weakest. Check: are the sentences siblings, each adding a fact about one thing, instead of leading into each other?`, kind: 'tip' },
  ],
};
