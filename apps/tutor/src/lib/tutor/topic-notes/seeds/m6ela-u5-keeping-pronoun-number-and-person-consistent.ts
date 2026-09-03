/**
 * Grade 6 English Language Arts — Unit 5 CED 5.3: Keeping Pronoun Number & Person Consistent.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.keeping-pronoun-number-and-person-consistent.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U5_KEEPING_PRONOUN_NUMBER_AND_PERSON_CONSISTENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.keeping-pronoun-number-and-person-consistent.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Keeping Pronoun Number & Person Consistent',
  planId: 'evelyn.ms.m6ela.keeping-pronoun-number-and-person-consistent.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.keeping-pronoun-number-and-person-consistent.v1' }],
  theory: [
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', content: `EVERY PIECE OF WRITING SETS A PERSON AND A NUMBER FOR ITS STORY, AND BOTH HAVE TO HOLD FOR THE WHOLE PIECE, NOT JUST ONE SENTENCE. Person: first (I, we — the writer speaking), second (you — the writer speaking straight to a reader), third (he, she, it, they — someone else). Number: singular (I, you, he, she, it) or plural (we, you all, they).` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', content: `THE MOST COMMON SHIFT SWAPS PERSON, NOT NUMBER. Personal narration in "I" drifts into "you" mid-paragraph when the writer still means only themself. WRONG: "I love the smell of rain on hot pavement. You just stand there and breathe it in." CORRECT: "I love the smell of rain on hot pavement. I just stand there and breathe it in."` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', content: `A NUMBER SHIFT HAPPENS WHEN "I" AND "WE" GET MIXED UP WITH NO REASON. If nobody has joined or left the piece of writing, an unexplained switch between "I" and "we" has nobody new to mean. WRONG: "I spent the whole afternoon organizing my baseball cards by year. Every card from before 2010 went into a shoebox. Then we labeled the binder and put it on the shelf." CORRECT: "...Then I labeled the binder and put it on the shelf." No second person is ever mentioned, so "we" has nothing to point at.` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', content: `A SHIFT IS ONLY VISIBLE ACROSS SENTENCES, SO CHECK THE WHOLE PIECE, NOT ONE LINE AT A TIME. Read the pronoun that opens the piece, hold it in mind, and check every later pronoun that refers back to the same person or group against it. A single sentence can be perfectly correct on its own and still be the broken link in a passage.` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', kind: 'framework', title: 'Not every change is a mistake', content: `NOT EVERY CHANGE IS A MISTAKE — CHECK WHETHER SOMETHING REAL CHANGED FIRST. If the writing gives a real reason, such as a task handed to one person alone after a group did something together, the pronoun is allowed to change with it. Ask: did the writing introduce a reason for this pronoun to be different, or did it just slide?` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', content: `THE FIX IS TO CHANGE ONLY THE PRONOUN THAT BROKE AWAY, NOT TO REWRITE THE WHOLE PASSAGE. Find the one pronoun that does not match what the piece already established, and change only that one so it fits, unless the writing already gave a real reason for the change.` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', kind: 'definition', title: 'person', content: `which role a pronoun plays in a piece of writing — first (I, we, the writer), second (you, the reader), or third (he, she, it, they, someone else).` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', kind: 'definition', title: 'number', content: `whether a pronoun means one (singular: I, you, he, she, it) or more than one (plural: we, you all, they).` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', kind: 'definition', title: 'shift', content: `a change in person or number partway through a piece of writing that breaks the pattern the writing already set.` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', kind: 'definition', title: 'consistent', content: `staying the same throughout a piece of writing, so every pronoun matches the person and number set earlier.` },
    { loId: 'm6ela.keeping-pronoun-number-and-person-consistent', kind: 'definition', title: 'narrator', content: `the person telling a story, whose pronoun (usually I or we) should stay steady unless the writing gives a real reason to change it.` },
  ],
  methods: [
    {
      title: 'Worked person shift I to you',
      steps: [
        `Read the whole passage first, not one sentence at a time. A shift can only be seen by comparing an early pronoun to a later one.`,
        `Name the person the passage opens with. The first sentence uses "I" — first person, singular — and nobody else has been introduced anywhere in the passage.`,
        `Check the middle sentence against that. "You always get there early before it gets crowded, so there is more room to practice" switches to second person, but the passage never starts talking to a reader anywhere else. Nothing in the story changed; the pronoun just slid.`,
        `Confirm with the last sentence. "I am usually ready to head home for breakfast" returns to first person, which tells you the writer meant "I" the whole time and picked "you" by accident in the middle.`,
        `Repair only the sentence that broke away. WRONG: "You always get there early before it gets crowded, so there is more room to practice." CORRECT: "I always get there early before it gets crowded, so there is more room to practice."`,
        `Read the fixed passage straight through to confirm every pronoun now points at the same person.`,
      ],
      example: { problem: `Find the shift and repair it, then say which rule caught it.

"I spend every Saturday morning at the skate park with my cousin. You always get there early before it gets crowded, so there is more room to practice. By ten that morning, I am usually ready to head home for breakfast."`, solution: `The middle sentence should read "I always get there early before it gets crowded, so there is more room to practice." The passage opens and closes in first person singular ("I"), so the second sentence's "you" is the shift, and it is the one that has to match, not the other two sentences.` },
      relatedLoIds: ['m6ela.keeping-pronoun-number-and-person-consistent'],
    },
    {
      title: 'Worked number shift I to we',
      steps: [
        `Check whether a second person ever joins the piece. Read all three sentences and list who is named: only "I," across the whole passage. No cousin, no friend, no sibling is ever mentioned.`,
        `Notice where the pronoun changes anyway. The last sentence switches to "we," which is plural, even though only one person has done anything in this passage so far.`,
        `Ask what "we" would have to mean. It would need a second labeler standing in the room, and the passage never puts one there. With nobody to be part of "we," the plural has nothing to point at.`,
        `Repair the pronoun to match the number the passage already set. WRONG: "Then we labeled the binder and put it on the shelf." CORRECT: "Then I labeled the binder and put it on the shelf."`,
        `Read the fixed passage straight through. All three sentences now stay first person singular, matching a solo afternoon of sorting cards.`,
      ],
      example: { problem: `Find the shift and repair it, then say which rule caught it.

"I spent the whole afternoon organizing my baseball cards by year. Every card from before 2010 went into a shoebox, and every card after that went into a binder. Then we labeled the binder and put it on the shelf."`, solution: `The last sentence should read "Then I labeled the binder and put it on the shelf." No second person ever enters the passage, so the number has to stay singular throughout, matching the "I" that opened it.` },
      relatedLoIds: ['m6ela.keeping-pronoun-number-and-person-consistent'],
    },
  ],
  pointers: [
    { content: `Students often say "It should say "We ran to the garage and back," because the passage already started in the plural, with "my family and I."" — A shift is only a mistake when nothing in the piece explains it. Here, Dad specifically asks one person, "by myself," to grab the tape — that sentence is the reason the pronoun is allowed to narrow from "we" to "I." The rule is to look for a real change in who is doing the action before deciding a shift is wrong, not to flag every pronoun that differs from the first one.`, kind: 'common-error' },
    { content: `Students often say "A piece of writing can never use more than one pronoun for the people in it." — Consistency means every pronoun stays true to what is actually happening, not that only one pronoun is ever allowed. "We" is correct while the whole group acts together, and "I" becomes correct the moment the writing says one person acts alone. What is never allowed is switching with no reason given — that unexplained kind of switch is the actual error this lesson teaches you to catch.`, kind: 'common-error' },
    { content: `Every piece of writing sets a person (first: I, we; second: you; third: he, she, it, they) and a number (singular or plural), and both have to hold across the whole piece.`, kind: 'tip' },
    { content: `The most common shift slides from "I" into "you" mid-paragraph when the writer still means only themself. WRONG: "I love the smell of rain on hot pavement. You just stand there and breathe it in." CORRECT: "I love the smell of rain on hot pavement. I just stand there and breathe it in."`, kind: 'tip' },
    { content: `A number shift happens when "I" and "we" get mixed up with no reason. If nobody new ever joins the piece, an unexplained "we" has nothing to point at.`, kind: 'tip' },
    { content: `A shift is only visible across sentences. Hold the pronoun the passage opened with in mind, and check every later pronoun that refers to the same person or group against it.`, kind: 'tip' },
    { content: `Not every change is a mistake. If the writing gives a real reason — a task handed to one person alone, or a new person joining the action — the pronoun is allowed to change with it.`, kind: 'tip' },
    { content: `The fix is to change only the pronoun that broke away so it matches what the passage already established, not to rewrite the whole passage.`, kind: 'tip' },
  ],
};
