/**
 * Grade 6 English Language Arts — Unit 6 CED 6.3: Commas for Extra Information.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.commas-for-nonrestrictive-and-parenthetical-elements.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U6_COMMAS_FOR_NONRESTRICTIVE_AND_PARENTHETICAL_ELEMENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.commas-for-nonrestrictive-and-parenthetical-elements.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Commas for Extra Information',
  planId: 'evelyn.ms.m6ela.commas-for-nonrestrictive-and-parenthetical-elements.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.commas-for-nonrestrictive-and-parenthetical-elements.v1' }],
  theory: [
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', content: `RESTRICTIVE INFORMATION IS INFORMATION THE SENTENCE NEEDS; NONRESTRICTIVE INFORMATION IS EXTRA. "My brother Daniel plays trumpet" with no comma means Daniel is naming which brother, among more than one. "My brother, Daniel, plays trumpet" with a comma pair means "my brother" already identifies one person, and the name is just extra information added on the side. The words never change. Only the commas do, and the commas are telling the reader how many brothers there are.` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', content: `THE REMOVAL TEST IS THE WHOLE PROCEDURE. Cover the part in question with your thumb and read what is left. If the sentence still points to the exact same person, place, or thing, the covered part is nonrestrictive and gets set off. If covering it leaves you unsure who or what is meant, the covered part is restrictive, the sentence needs it, and it takes no comma at all.` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', content: `THREE MATCHING MARKS DO THE SAME JOB. A pair of commas is the most common choice. A pair of parentheses sets extra information off quietly, like a side note. A pair of dashes sets it off loudly, for something the writer wants to stand out. Pick one pair for a given sentence, and use the SAME mark on both sides — never open with a comma and close with a dash.` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', content: `A MARK IN THE MIDDLE ALWAYS NEEDS A PARTNER. When nonrestrictive information sits in the middle of a sentence, it needs a mark before it AND a mark after it. WRONG: "My teacher, Ms. Alvarez teaches two science classes." CORRECT: "My teacher, Ms. Alvarez, teaches two science classes." When the extra information sits at the very end of the sentence, one mark before it is enough, because the period finishes the job: "She waved to her best friend, Priya."` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', content: `THE EXTRA PART CAN BE ONE WORD OR A WHOLE CLAUSE. "My dog, Biscuit," sets off a single name. "The library, which just reopened its comics section," sets off a whole clause. The removal test works exactly the same way no matter how long the extra part is: cover it, and check whether the sentence still points to the same thing.` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', kind: 'definition', title: 'nonrestrictive element', content: `information a sentence does not need in order to identify what it is talking about.` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', kind: 'definition', title: 'restrictive element', content: `information a sentence does need, because without it, the reader cannot tell what or who is meant.` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', kind: 'definition', title: 'parenthetical element', content: `a nonrestrictive comment or aside dropped into the middle of a sentence, as if in a whisper.` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', kind: 'definition', title: 'appositive', content: `a word or short phrase placed next to a noun that renames or identifies it, such as "Daniel" in "my brother, Daniel,".` },
    { loId: 'm6ela.commas-for-nonrestrictive-and-parenthetical-elements', kind: 'definition', title: 'dash', content: `a long mark, used in a matching pair, that sets off extra information more forcefully than a comma does.` },
  ],
  methods: [
    {
      title: 'Worked drop test changing fact',
      steps: [
        `Run the removal test on the name Biscuit. Cover it with your thumb and read what is left: "Mateo's dog knows three tricks." Because Mateo has two dogs, that sentence no longer tells you which dog knows the tricks.`,
        `Since covering "Biscuit" changes which dog the sentence points to, the name is restrictive information the sentence needs to identify the right dog. Restrictive information takes no commas at all.`,
        `CORRECT: "Mateo's dog Biscuit knows three tricks." Leave the sentence exactly as it is written — the name is doing necessary identifying work.`,
        `Now change the fact: Mateo has only one dog. Run the exact same removal test on the exact same words. Cover "Biscuit": "Mateo's dog knows three tricks." This time, since there is only one dog, the sentence still points to the same animal without the name.`,
        `Since covering "Biscuit" this time changes nothing about which dog is meant, the name is now nonrestrictive: extra information the writer chose to add. Nonrestrictive information gets set off with a matching pair of marks.`,
        `CORRECT for one dog: "Mateo's dog, Biscuit, knows three tricks." Same words, same order. Only the commas changed, and they changed because the fact behind the sentence changed.`,
      ],
      example: { problem: `Punctuate this sentence correctly for the fact given, then explain why.

Fact: Mateo has two dogs.
Sentence: "Mateo's dog Biscuit knows three tricks."`, solution: `With two dogs: "Mateo's dog Biscuit knows three tricks." (no commas, because the name identifies which dog). With one dog: "Mateo's dog, Biscuit, knows three tricks." (a comma pair, because the name is extra).` },
      relatedLoIds: ['m6ela.commas-for-nonrestrictive-and-parenthetical-elements'],
    },
    {
      title: 'Worked pair rule and matching marks',
      steps: [
        `Sentence 1. The name "Ms. Alvarez" sits in the middle of the sentence. Run the removal test: cover the name and read "My teacher teaches two science classes." Because Ms. Alvarez is the only science teacher the speaker has, that sentence still points to the same person, so the name is nonrestrictive.`,
        `WRONG: "My teacher, Ms. Alvarez teaches two science classes." A comma opens the extra information but nothing closes it, so the sentence never finishes marking it off.`,
        `CORRECT: "My teacher, Ms. Alvarez, teaches two science classes." Now a comma sits on both sides of the name, opening the extra information and closing it again.`,
        `Sentence 2. This time the extra information is a whole clause, not a single name: "which just added a whole shelf of comics." Cover the clause and read what is left: "The library closes at six on Fridays." Because there is only one library the speaker means, the sentence still points to the same place without the clause, so the clause is nonrestrictive too.`,
        `WRONG: "The library which just added a whole shelf of comics closes at six on Fridays." No mark opens or closes the clause, so a reader cannot tell where the extra part starts and stops.`,
        `CORRECT with commas: "The library, which just added a whole shelf of comics, closes at six on Fridays." CORRECT with dashes instead: "The library — which just added a whole shelf of comics — closes at six on Fridays." Both are right, because commas and dashes do the same job here. What is never right is opening the pair with one kind of mark and closing it with a different kind.`,
      ],
      example: { problem: `Fix each sentence so its extra information is set off correctly, and name the rule that catches the mistake.

Fact 1: Ms. Alvarez is the only science teacher the speaker has.
Sentence 1: "My teacher, Ms. Alvarez teaches two science classes."

Fact 2: There is only one library the speaker means.
Sentence 2: "The library which just added a whole shelf of comics closes at six on Fridays."`, solution: `Sentence 1: "My teacher, Ms. Alvarez, teaches two science classes." (a comma is needed on both sides of mid-sentence extra information). Sentence 2: "The library, which just added a whole shelf of comics, closes at six on Fridays." — or the same sentence with a matching pair of dashes in place of the commas.` },
      relatedLoIds: ['m6ela.commas-for-nonrestrictive-and-parenthetical-elements'],
    },
  ],
  pointers: [
    { content: `Students often say "My friend, Noah plays the drums." — A comma is not there to mark a breath. It is there because the removal test says the name is extra. Cover "Noah" and read "My friend plays the drums." Since Noah is the only friend the speaker means, that still points to the same person, so "Noah" is nonrestrictive and belongs inside a matching pair. Because the name sits in the middle of the sentence, it needs a mark on both sides: "My friend, Noah, plays the drums."`, kind: 'common-error' },
    { content: `Students often say "My friend Noah, plays the drums." — A pair means both sides get marked, and the marks go around the extra information, not on just one edge of it. Since "Noah" sits in the middle of the sentence and passes the removal test, it needs a comma right before it and right after it: "My friend, Noah, plays the drums." A single comma on either side alone is never a finished pair.`, kind: 'common-error' },
    { content: `Nonrestrictive information is extra: the sentence still names the same thing without it. Restrictive information is not extra: take it away and the reader loses track of who or what is meant.`, kind: 'tip' },
    { content: `Run the removal test: cover the part in question and read what is left. If it still points to the exact same person, place, or thing, the part is nonrestrictive and needs to be set off.`, kind: 'tip' },
    { content: `Three marks do the same job: a pair of commas, a pair of parentheses, or a pair of dashes. Use the same mark on both sides. Never mix a comma with a dash in one pair.`, kind: 'tip' },
    { content: `Nonrestrictive information in the middle of a sentence needs a mark on both sides. WRONG: "My teacher, Ms. Alvarez teaches two science classes." CORRECT: "My teacher, Ms. Alvarez, teaches two science classes."`, kind: 'tip' },
    { content: 'The test works the same whether the extra part is one word or a whole clause.', kind: 'tip' },
    { content: `The removal test is not about pauses or how something sounds when you read it aloud. It's about whether the sentence still points to the same person, place, or thing when you cover the part in question. Don't use your ear — use your thumb.`, kind: 'common-error' },
    { content: `Nonrestrictive information in the middle of a sentence needs TWO marks — one before AND one after. A single comma on one side only is an incomplete pair. Always check: if you put a mark down, where is its partner?`, kind: 'gotcha' },
    { content: `Never open a pair with one mark and close it with a different mark. Once you pick commas, use commas on both sides. Once you pick dashes, use dashes on both sides. A pair must match.`, kind: 'vocab-note' },
    { content: `When extra information sits at the very end of a sentence, it needs only ONE mark before it — the period at the end does the closing job for you. Example: 'She waved to her best friend, Priya.' One comma is enough.`, kind: 'edge-case' },
    { content: `The same words in the same order can be restrictive OR nonrestrictive — it all depends on the real-world fact. With one dog: 'Mateo's dog, Biscuit,' (commas). With two dogs: 'Mateo's dog Biscuit' (no commas). The sentence doesn't change; the punctuation does.`, kind: 'gotcha' },
    { content: `An appositive is a noun or noun phrase that renames or identifies another noun right next to it (like 'Daniel' in 'my brother, Daniel'). All appositives are nonrestrictive when they're in the middle of a sentence — always run the removal test to be sure.`, kind: 'vocab-note' },
    { content: `The removal test works exactly the same way for a single word as it does for a whole clause. Cover 'Biscuit' or cover 'which just reopened last month' — the question is the same: does the sentence still point to the same thing?`, kind: 'tip' },
  ],
};
