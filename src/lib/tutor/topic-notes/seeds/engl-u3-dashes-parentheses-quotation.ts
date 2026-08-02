/**
 * HS English — Unit 3 CED 3.4: Dashes, Parentheses & Quotation Marks.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.dashes-parentheses-quotation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U3_DASHES_PARENTHESES_QUOTATION: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.dashes-parentheses-quotation.v1',
  course: 'HS English',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Dashes, Parentheses & Quotation Marks',
  planId: 'evelyn.hs.engl.dashes-parentheses-quotation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.dashes-parentheses-quotation.v1' }],
  theory: [
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'The deletion test', content: `THE DELETION TEST — nonessential material is anything you can lift out of the sentence and still have a complete sentence that names the same thing. If it passes the deletion test, it needs a fence on BOTH sides. If deleting it changes which person or thing you mean, it is essential and gets no fence at all.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'Three fences, three volumes', content: `THREE FENCES, THREE VOLUMES — commas are the neutral default, dashes are loud and dramatic, parentheses are a quiet murmur the reader can skip. All three do the same grammatical job, so the choice is a choice about tone: "My grandfather, a retired welder, still fixes every bike on the block" is plain reporting; swap in dashes for emphasis or parentheses for a soft footnote.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'Match the fence', content: `MATCH THE FENCE — whatever mark opens the interrupter must close it. A dash opens, a dash closes. A comma opens, a comma closes. An opening parenthesis closes with its partner. WRONG: "The mural on the gym wall — painted by last year's seniors, is finally finished." CORRECT: "The mural on the gym wall — painted by last year's seniors — is finally finished." Also CORRECT: "The mural on the gym wall, painted by last year's seniors, is finally finished." Mixing marks is the single most common error in this unit.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'The single emphatic dash', content: `THE SINGLE EMPHATIC DASH — one dash, not a pair, creates a hard break near the end of a sentence, and what comes BEFORE it must already be a complete clause. CORRECT: "She checked every pocket twice and found exactly what she expected — nothing." WRONG: "She checked — every pocket twice and found nothing," which drops the dash inside the clause instead of after it.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'Parentheses demote, so keep them short', content: `PARENTHESES DEMOTE, SO KEEP THEM SHORT — material inside parentheses is background the sentence can live without, and the sentence outside the parentheses must still read correctly when they are removed. End punctuation stays outside unless the whole sentence sits inside them.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'Quotation marks frame another voice', content: `QUOTATION MARKS FRAME ANOTHER VOICE — put the speaker's exact words inside double quotation marks, introduce or follow them with a comma, and capitalize the first word of the quoted sentence. CORRECT: "We are leaving at six," Dad said. CORRECT: Dad said, "We are leaving at six." WRONG: Dad said "we are leaving at six".` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'Periods and commas go inside', content: `PERIODS AND COMMAS GO INSIDE — in American usage the period or comma that ends quoted speech sits inside the closing quotation mark, always. A question mark or exclamation point goes inside when the quoted words ask or exclaim ("Did you lock it?" she asked) and outside when the surrounding sentence does (Who decided the theme was "seasons"?). Start a new paragraph each time the speaker changes.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'framework', title: 'Quotes inside quotes, and no quotes for emphasis', content: `QUOTES INSIDE QUOTES, AND NO QUOTES FOR EMPHASIS — when a speaker quotes someone else, the inner quotation takes single marks inside the double ones: "Coach kept repeating 'run your own race,' so that is what I did," Priya told me. And never use quotation marks to stress a word; a reader takes "fresh" bread as sarcasm, not emphasis.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'definition', title: 'nonessential material', content: `a word or phrase that can be deleted without changing which person or thing the sentence means, and which therefore needs a matching fence on both sides.` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'definition', title: 'appositive', content: `a noun phrase set beside another noun to rename or explain it, such as "a retired welder" in "my grandfather, a retired welder".` },
    { loId: 'engl.dashes-parentheses-quotation', kind: 'definition', title: 'speech tag', content: `the short attribution attached to quoted words, such as "she said" or "Priya told me", joined to the quotation by a comma.` },
  ],
  methods: [
    {
      title: 'Worked choose the fence',
      steps: [
        `Find the material that interrupts the main sentence: "which meets in the basement lab on Thursdays".`,
        `Run the deletion test: "The robotics club won its first regional title this year." That is a complete sentence and it still names the same club, so the interrupter is NONESSENTIAL and needs a fence.`,
        `Choose the volume. This is quiet background in a news sentence, not a dramatic reveal, so commas or parentheses fit better than dashes. Commas are the plainest choice.`,
        `Fence BOTH sides with the same mark. CORRECT: "The robotics club, which meets in the basement lab on Thursdays, won its first regional title this year." Also CORRECT with the quieter fence: "The robotics club (which meets in the basement lab on Thursdays) won its first regional title this year." WRONG: a single comma before the interrupter and nothing after it, which strands the reader mid-aside.`,
      ],
      example: { problem: `A writer drafts this line for a school newsletter: "The robotics club which meets in the basement lab on Thursdays won its first regional title this year." Where does punctuation belong, and which fence should the writer use?`, solution: `Fence the nonessential clause on both sides: "The robotics club, which meets in the basement lab on Thursdays, won its first regional title this year."` },
      relatedLoIds: ['engl.dashes-parentheses-quotation'],
    },
    {
      title: 'Worked mixed fence',
      steps: [
        `Locate the interrupter: "a blurry shot of a marching band in the rain". It renames "the photograph", so it is an appositive.`,
        `Run the deletion test: "The photograph on the back wall is the only picture the school never replaced." Complete and unchanged in meaning, so the appositive is nonessential and does need a fence.`,
        `Now inspect the fence itself. The writer OPENED with a dash and CLOSED with a comma. That is the mixed-fence error: the reader is told an emphatic aside is starting and then never sees it end, because the closing mark is a different mark.`,
        `Repair it by making both marks match, and pick the volume you actually want. CORRECT and emphatic: "The photograph on the back wall — a blurry shot of a marching band in the rain — is the only picture the school never replaced." CORRECT and neutral: "The photograph on the back wall, a blurry shot of a marching band in the rain, is the only picture the school never replaced." WRONG in either direction: one dash with one comma, or an opening parenthesis closed by a comma.`,
      ],
      example: { problem: `A student turns in this sentence: "The photograph on the back wall — a blurry shot of a marching band in the rain, is the only picture the school never replaced." Name the error and fix it.`, solution: `The fence does not match — a dash opened the aside and a comma closed it. Use two dashes ("wall — a blurry shot of a marching band in the rain — is") or two commas, never one of each.` },
      relatedLoIds: ['engl.dashes-parentheses-quotation'],
    },
  ],
  pointers: [
    { content: `Two fixes. First, a speech tag is joined to the quotation by a comma, so it is "She said," and then the quotation. Second, in American usage the period or comma always sits INSIDE the closing quotation mark, no matter whose sentence it finishes. CORRECT: She said, "I will be there by six." Question marks and exclamation points are the only marks that move: they go inside when the quoted words ask or exclaim, and outside when the surrounding sentence does.`, kind: 'common-error' },
    { content: `Deletion test first: if the material can be lifted out and the sentence still works, fence it on BOTH sides; if it identifies which one you mean, use no fence at all.`, kind: 'tip' },
    { content: `Match the fence — a dash opens and a dash closes, a comma opens and a comma closes, a parenthesis closes with its partner. Never mix one mark with another.`, kind: 'tip' },
    { content: `Commas are neutral, dashes are emphatic, parentheses are a whisper; a single dash breaks only AFTER a complete clause.`, kind: 'tip' },
    { content: `Quoted speech takes a comma with its speech tag, a capital on the first quoted word of a sentence, and periods and commas INSIDE the closing quotation mark; new speaker, new paragraph.`, kind: 'tip' },
    { content: `Never mix fences: a dash must close with a dash, a comma with a comma, an open paren with a close paren. "The mural — painted by seniors, is finished" strands the reader mid-aside. Check that your closing mark matches your opening one before you move on.`, kind: 'common-error' },
    { content: `Run the deletion test before you punctuate anything. If lifting the phrase out changes WHICH person or thing you mean, it's essential — no fence at all. "The student who forgot her lunch" needs no commas; "my sister, who forgot her lunch" does.`, kind: 'gotcha' },
    { content: `A single emphatic dash only works if everything BEFORE it is already a complete clause. "I finally found the key — in a jacket pocket" works; "She checked — every pocket twice" does not. Cover the dash and read what's left: is it a sentence?`, kind: 'edge-case' },
    { content: `In American usage, periods and commas ALWAYS go inside the closing quotation mark, even when the period ends your sentence, not the speaker's. Only question marks and exclamation points move: inside if the quoted words ask, outside if your sentence does.`, kind: 'common-error' },
    { content: `Don't drop the comma that joins a speech tag to its quotation: not \`Dad said "we are leaving"\` but \`Dad said, "We are leaving."\` And capitalize the first word of a quoted sentence — the tag doesn't absorb it.`, kind: 'common-error' },
    { content: `"Nonessential" doesn't mean unimportant — it means deletable without changing which thing you mean. An appositive is the noun phrase that renames another noun ("a retired welder"), and appositives are almost always nonessential.`, kind: 'vocab-note' },
    { content: `Never use quotation marks for emphasis. "Fresh" bread reads as sarcasm — the reader thinks you doubt it's fresh. Use italics or stronger word choice instead.`, kind: 'gotcha' },
    { content: `The sentence outside parentheses must read perfectly with the parentheses deleted — including its verb and end punctuation. End punctuation stays outside the closing paren unless the entire sentence sits inside it. Start a new paragraph every time the speaker changes.`, kind: 'tip' },
  ],
};
