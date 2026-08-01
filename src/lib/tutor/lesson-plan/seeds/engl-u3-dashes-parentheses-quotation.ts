/**
 * HS English — Grammar & Usage: Dashes, Parentheses & Quotation Marks.
 *
 * The punctuation of VOICE (CCSS L.9-10.2): fence nonessential material
 * with a matching pair of dashes, parentheses, or commas; use a single
 * dash for an emphatic break; and punctuate dialogue and quoted material
 * so a reader always knows who is speaking. Every excerpt is original
 * prose, and every practice item is a revision-choice MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U3_DASHES_PARENTHESES_QUOTATION: LessonPlan = {
  id: 'evelyn.hs.engl.dashes-parentheses-quotation.v1',
  title: 'Dashes, Parentheses & Quotation Marks',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.dashes-parentheses-quotation',
      standard: 'ENGL-3.4',
      description:
        'Set off nonessential material with a matching pair of dashes or parentheses (never mixing one mark with another), use a single dash for an emphatic break after a complete clause, and punctuate dialogue and quoted material correctly with quotation marks (CCSS L.9-10.2, L.9-10.2b).',
    },
  ],
  prerequisites: ['engl.apostrophes-and-possessives'],
  followUps: ['engl.precision-and-concision'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame dashes, parentheses, and quotation marks as the punctuation that controls volume and voice in real writing.',
      script:
        'Read these two sentences out loud. "The trail, which floods every spring, is closed until May." Now: "The trail — which floods every spring — is closed until May." Same words, different volume. Commas are a neutral aside, parentheses are a whisper, and dashes are the writer grabbing your sleeve. Quotation marks do something else entirely: they hand the sentence over to another voice, which is how every story with dialogue and every interview quote in an article works. Today you learn how to pick the right mark, how to close what you open, and how to punctuate a line of dialogue so the reader never loses track of who is talking.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-fences-and-voices',
      kind: 'concept',
      goal: 'The fence-and-match method for nonessential material, the emphatic dash, and the rules for punctuating quoted speech.',
      keyIdeas: [
        'THE DELETION TEST — nonessential material is anything you can lift out of the sentence and still have a complete sentence that names the same thing. If it passes the deletion test, it needs a fence on BOTH sides. If deleting it changes which person or thing you mean, it is essential and gets no fence at all.',
        'THREE FENCES, THREE VOLUMES — commas are the neutral default, dashes are loud and dramatic, parentheses are a quiet murmur the reader can skip. All three do the same grammatical job, so the choice is a choice about tone: "My grandfather, a retired welder, still fixes every bike on the block" is plain reporting; swap in dashes for emphasis or parentheses for a soft footnote.',
        'MATCH THE FENCE — whatever mark opens the interrupter must close it. A dash opens, a dash closes. A comma opens, a comma closes. An opening parenthesis closes with its partner. WRONG: "The mural on the gym wall — painted by last year\'s seniors, is finally finished." CORRECT: "The mural on the gym wall — painted by last year\'s seniors — is finally finished." Also CORRECT: "The mural on the gym wall, painted by last year\'s seniors, is finally finished." Mixing marks is the single most common error in this unit.',
        'THE SINGLE EMPHATIC DASH — one dash, not a pair, creates a hard break near the end of a sentence, and what comes BEFORE it must already be a complete clause. CORRECT: "She checked every pocket twice and found exactly what she expected — nothing." WRONG: "She checked — every pocket twice and found nothing," which drops the dash inside the clause instead of after it.',
        'PARENTHESES DEMOTE, SO KEEP THEM SHORT — material inside parentheses is background the sentence can live without, and the sentence outside the parentheses must still read correctly when they are removed. End punctuation stays outside unless the whole sentence sits inside them.',
        'QUOTATION MARKS FRAME ANOTHER VOICE — put the speaker\'s exact words inside double quotation marks, introduce or follow them with a comma, and capitalize the first word of the quoted sentence. CORRECT: "We are leaving at six," Dad said. CORRECT: Dad said, "We are leaving at six." WRONG: Dad said "we are leaving at six".',
        'PERIODS AND COMMAS GO INSIDE — in American usage the period or comma that ends quoted speech sits inside the closing quotation mark, always. A question mark or exclamation point goes inside when the quoted words ask or exclaim ("Did you lock it?" she asked) and outside when the surrounding sentence does (Who decided the theme was "seasons"?). Start a new paragraph each time the speaker changes.',
        'QUOTES INSIDE QUOTES, AND NO QUOTES FOR EMPHASIS — when a speaker quotes someone else, the inner quotation takes single marks inside the double ones: "Coach kept repeating \'run your own race,\' so that is what I did," Priya told me. And never use quotation marks to stress a word; a reader takes "fresh" bread as sarcasm, not emphasis.',
      ],
      vocabulary: [
        { term: 'nonessential material', definition: 'a word or phrase that can be deleted without changing which person or thing the sentence means, and which therefore needs a matching fence on both sides.' },
        { term: 'appositive', definition: 'a noun phrase set beside another noun to rename or explain it, such as "a retired welder" in "my grandfather, a retired welder".' },
        { term: 'speech tag', definition: 'the short attribution attached to quoted words, such as "she said" or "Priya told me", joined to the quotation by a comma.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-choose-the-fence',
      kind: 'worked_example',
      problem:
        'A writer drafts this line for a school newsletter: "The robotics club which meets in the basement lab on Thursdays won its first regional title this year." Where does punctuation belong, and which fence should the writer use?',
      steps: [
        'Find the material that interrupts the main sentence: "which meets in the basement lab on Thursdays".',
        'Run the deletion test: "The robotics club won its first regional title this year." That is a complete sentence and it still names the same club, so the interrupter is NONESSENTIAL and needs a fence.',
        'Choose the volume. This is quiet background in a news sentence, not a dramatic reveal, so commas or parentheses fit better than dashes. Commas are the plainest choice.',
        'Fence BOTH sides with the same mark. CORRECT: "The robotics club, which meets in the basement lab on Thursdays, won its first regional title this year." Also CORRECT with the quieter fence: "The robotics club (which meets in the basement lab on Thursdays) won its first regional title this year." WRONG: a single comma before the interrupter and nothing after it, which strands the reader mid-aside.',
      ],
      answer:
        'Fence the nonessential clause on both sides: "The robotics club, which meets in the basement lab on Thursdays, won its first regional title this year."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mixed-fence',
      kind: 'worked_example',
      problem:
        'A student turns in this sentence: "The photograph on the back wall — a blurry shot of a marching band in the rain, is the only picture the school never replaced." Name the error and fix it.',
      steps: [
        'Locate the interrupter: "a blurry shot of a marching band in the rain". It renames "the photograph", so it is an appositive.',
        'Run the deletion test: "The photograph on the back wall is the only picture the school never replaced." Complete and unchanged in meaning, so the appositive is nonessential and does need a fence.',
        'Now inspect the fence itself. The writer OPENED with a dash and CLOSED with a comma. That is the mixed-fence error: the reader is told an emphatic aside is starting and then never sees it end, because the closing mark is a different mark.',
        'Repair it by making both marks match, and pick the volume you actually want. CORRECT and emphatic: "The photograph on the back wall — a blurry shot of a marching band in the rain — is the only picture the school never replaced." CORRECT and neutral: "The photograph on the back wall, a blurry shot of a marching band in the rain, is the only picture the school never replaced." WRONG in either direction: one dash with one comma, or an opening parenthesis closed by a comma.',
      ],
      answer:
        'The fence does not match — a dash opened the aside and a comma closed it. Use two dashes ("wall — a blurry shot of a marching band in the rain — is") or two commas, never one of each.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-match-the-fence',
      kind: 'try_yourself',
      problem:
        'Which version of this sentence is punctuated correctly? Base sentence: The old projector a machine older than the school itself still hummed to life every Friday.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The old projector — a machine older than the school itself — still hummed to life every Friday.', correct: true },
        { id: 'b', text: 'The old projector — a machine older than the school itself, still hummed to life every Friday.' },
        { id: 'c', text: 'The old projector, a machine older than the school itself — still hummed to life every Friday.' },
        { id: 'd', text: 'The old projector a machine older than the school itself, still hummed to life every Friday.' },
      ],
      expectedAnswer: 'The old projector — a machine older than the school itself — still hummed to life every Friday.',
      hints: [
        'Delete "a machine older than the school itself" and read what is left. If the sentence still works, the phrase is nonessential and needs a fence on both sides.',
        'Whatever mark opens the aside has to close it. Two dashes or two commas — never a dash paired with a comma, and never a fence with only one side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-emphatic-dash',
      kind: 'try_yourself',
      problem: 'Which sentence uses a single emphatic dash correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I finally found the missing key — in the pocket of a jacket I had not worn since March.', correct: true },
        { id: 'b', text: 'I finally found — the missing key in the pocket of a jacket I had not worn since March.' },
        { id: 'c', text: 'I finally — found the missing key in the pocket of a jacket I had not worn since March.' },
        { id: 'd', text: 'I finally found the missing key in the pocket of a jacket — I had not worn since March.' },
      ],
      expectedAnswer: 'I finally found the missing key — in the pocket of a jacket I had not worn since March.',
      hints: [
        'Cover everything from the dash onward. Can the words before the dash stand alone as a complete sentence?',
        'A single dash breaks AFTER a complete clause and then delivers the punch. Options that drop the dash between a verb and its object, or inside the clause, cut the sentence in the wrong place.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dialogue-punctuation',
      kind: 'try_yourself',
      problem: 'You are writing a scene for a short story. Which line of dialogue is punctuated correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"We should leave now," Rosa said, "before the trail gets dark."', correct: true },
        { id: 'b', text: '"We should leave now", Rosa said, "before the trail gets dark".' },
        { id: 'c', text: '"We should leave now." Rosa said, "before the trail gets dark."' },
        { id: 'd', text: '"We should leave now," Rosa said, "Before the trail gets dark."' },
      ],
      expectedAnswer: '"We should leave now," Rosa said, "before the trail gets dark."',
      hints: [
        'Check two things: where the commas and periods sit relative to the closing quotation mark, and whether the second half of the quotation starts a new sentence.',
        'In American usage commas and periods go INSIDE the closing quotation mark, a comma (not a period) joins quoted words to the speech tag, and a quotation that continues the same sentence resumes in lowercase.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-period-outside-quote',
      kind: 'misconception_check',
      question:
        'A student writes: She said "I will be there by six". When corrected, the student argues: "The period ends my sentence, not hers, so it belongs outside the quotation marks." What went wrong?',
      commonErrors: [
        {
          answer: 'She said "I will be there by six".',
          misconception:
            'Treating the closing period as belonging to the outer sentence, and skipping the comma that introduces quoted speech.',
          correctsTo:
            'Two fixes. First, a speech tag is joined to the quotation by a comma, so it is "She said," and then the quotation. Second, in American usage the period or comma always sits INSIDE the closing quotation mark, no matter whose sentence it finishes. CORRECT: She said, "I will be there by six." Question marks and exclamation points are the only marks that move: they go inside when the quoted words ask or exclaim, and outside when the surrounding sentence does.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Deletion test first: if the material can be lifted out and the sentence still works, fence it on BOTH sides; if it identifies which one you mean, use no fence at all.',
        'Match the fence — a dash opens and a dash closes, a comma opens and a comma closes, a parenthesis closes with its partner. Never mix one mark with another.',
        'Commas are neutral, dashes are emphatic, parentheses are a whisper; a single dash breaks only AFTER a complete clause.',
        'Quoted speech takes a comma with its speech tag, a capital on the first quoted word of a sentence, and periods and commas INSIDE the closing quotation mark; new speaker, new paragraph.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Dashes, Parentheses & Quotation Marks' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
