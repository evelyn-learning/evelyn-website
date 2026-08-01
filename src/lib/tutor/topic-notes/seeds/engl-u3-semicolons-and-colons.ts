/**
 * HS English — Unit 3 CED 3.2: Semicolons & Colons.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.semicolons-and-colons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U3_SEMICOLONS_AND_COLONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.semicolons-and-colons.v1',
  course: 'HS English',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Semicolons & Colons',
  planId: 'evelyn.hs.engl.semicolons-and-colons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.semicolons-and-colons.v1' }],
  theory: [
    { loId: 'engl.semicolons-and-colons', kind: 'framework', title: 'The one test both marks share', content: `THE ONE TEST BOTH MARKS SHARE — cover everything to the LEFT of the mark and read it aloud. If it cannot stand alone as its own sentence, neither a semicolon nor a colon is allowed there. That single test catches most semicolon and colon errors before they happen.` },
    { loId: 'engl.semicolons-and-colons', content: `SEMICOLON JOB 1: JOINING TWO COMPLETE SENTENCES — a semicolon links two independent clauses whose ideas belong together: "The gym flooded on Thursday; the tournament moved to the middle school." Both sides must be able to stand alone. A semicolon is roughly a soft period, so it says to the reader: these two statements are one thought.` },
    { loId: 'engl.semicolons-and-colons', content: `SEMICOLON JOB 2: TRANSITION WORDS BETWEEN CLAUSES — words such as however, therefore, moreover, instead, in fact, and for example are conjunctive adverbs, not conjunctions. When one of them opens the second complete sentence, put a semicolon BEFORE it and a comma AFTER it: "The recipe called for buttermilk; however, we used yogurt instead."` },
    { loId: 'engl.semicolons-and-colons', content: `SEMICOLON JOB 3: THE SUPER-COMMA LIST — when the items in a list already contain commas of their own, upgrade the dividers between items to semicolons so the reader can tell where each item ends: "Our exchange partners came from Lima, Peru; Osaka, Japan; and Cork, Ireland."` },
    { loId: 'engl.semicolons-and-colons', content: `COLON JOB: A COMPLETE CLAUSE THAT POINTS FORWARD — a colon requires a full independent clause on its left, and then introduces what the clause has promised: a list, an explanation, an elaboration, or a single emphatic word. "The kit contained everything we needed: rope, chalk, and a headlamp." "She finally admitted the real reason: she had never wanted the job."` },
    { loId: 'engl.semicolons-and-colons', kind: 'framework', title: 'The right side of a colon is free', content: `THE RIGHT SIDE OF A COLON IS FREE — unlike a semicolon, a colon does not care whether what follows it is a complete sentence. A list, a phrase, or one word is all fine. The demand is entirely on the LEFT side.` },
    { loId: 'engl.semicolons-and-colons', content: `ERROR A: SEMICOLON BEFORE A FRAGMENT — the most common semicolon mistake is using it where the second half cannot stand alone. WRONG: "We repainted the whole set on Saturday; hoping the paint would dry by opening night." The words after the semicolon have no subject. CORRECT: "We repainted the whole set on Saturday, hoping the paint would dry by opening night." A dependent opener breaks it from the other direction. WRONG: "Because the bus broke down; we missed the first hour." CORRECT: "Because the bus broke down, we missed the first hour."` },
    { loId: 'engl.semicolons-and-colons', content: `ERROR B: COLON AFTER AN INCOMPLETE CLAUSE — writers drop a colon in the middle of a sentence right where the list starts, which leaves a dangling verb or preposition on the left. WRONG: "The three things I packed were: sunscreen, a paperback, and my sketchbook." WRONG: "We stopped for supplies such as: batteries and tape." CORRECT: "I packed three things: sunscreen, a paperback, and my sketchbook." Either delete the colon or finish the clause before it. Also remember that a semicolon is never followed directly by and, but, or so — choose one mark or the conjunction, not both.` },
    { loId: 'engl.semicolons-and-colons', kind: 'definition', title: 'independent clause', content: `a group of words with a subject and a verb that can stand alone as a complete sentence.` },
    { loId: 'engl.semicolons-and-colons', kind: 'definition', title: 'conjunctive adverb', content: `a transition word such as however, therefore, moreover, or instead that connects ideas but cannot join two clauses the way and or but can.` },
    { loId: 'engl.semicolons-and-colons', kind: 'definition', title: 'super-comma', content: 'a semicolon used to divide list items that already contain commas inside them.' },
  ],
  methods: [
    {
      title: 'Worked semicolon vs colon',
      steps: [
        `Cover everything to the left of the blank and read it: "The darkroom rule was posted on the door in red marker." Subject "rule", verb "was posted" — a complete independent clause. Both marks are therefore eligible, so the test alone does not decide it.`,
        `Now read the right side: "nobody opens this door while the light is on." That is also a complete sentence, which keeps the semicolon in play.`,
        `Ask what the right side is DOING for the left side. The left side promises a rule and does not say what it is; the right side delivers exactly that rule. That is elaboration, not a separate related fact.`,
        `A semicolon would be grammatically legal but would flatten the sentence into two equal statements. The colon is the better choice because it makes the left side point forward and lets the rule land at the end.`,
        `CORRECT: "The darkroom rule was posted on the door in red marker: nobody opens this door while the light is on." Note that the right side of a colon may be a full sentence, a list, or a single word — the colon never demands one shape.`,
      ],
      example: { problem: `Which mark belongs in the blank, a semicolon or a colon? "The darkroom rule was posted on the door in red marker ___ nobody opens this door while the light is on."`, solution: `A colon — the left side is a complete clause that promises a rule, and the right side delivers it: "The darkroom rule was posted on the door in red marker: nobody opens this door while the light is on."` },
      relatedLoIds: ['engl.semicolons-and-colons'],
    },
    {
      title: 'Worked fragment traps',
      steps: [
        `Test the colon first. Cover everything to its left: "My favorite parts of the trip were". Subject "parts", verb "were" — and then nothing. A linking verb with no complement is not a complete sentence, so the colon has nothing to attach to.`,
        `There are two repairs. Delete the colon and let the list finish the sentence: "My favorite parts of the trip were the ferry ride, the night market, and the walk back along the harbor." Or finish the clause first and keep the colon: "Three parts of the trip stood out: the ferry ride, the night market, and the walk back along the harbor."`,
        `Now test the semicolon. Cover everything to its right: "even though my shoes were soaked the whole time." That opens with the subordinator "even though", so it is a dependent clause and cannot stand alone. A semicolon needs a complete sentence on BOTH sides.`,
        `The repair there is a comma, which is the normal mark before a trailing dependent clause.`,
        `WRONG: "My favorite parts of the trip were: the ferry ride, the night market, and the walk back along the harbor; even though my shoes were soaked the whole time." CORRECT: "Three parts of the trip stood out: the ferry ride, the night market, and the walk back along the harbor, even though my shoes were soaked the whole time."`,
      ],
      example: { problem: `A student writes: "My favorite parts of the trip were: the ferry ride, the night market, and the walk back along the harbor; even though my shoes were soaked the whole time." Both marks were placed where the sentence felt like it paused. Are they correct?`, solution: `No — the colon sits after an incomplete clause and the semicolon sits before a dependent fragment. CORRECT: "Three parts of the trip stood out: the ferry ride, the night market, and the walk back along the harbor, even though my shoes were soaked the whole time."` },
      relatedLoIds: ['engl.semicolons-and-colons'],
    },
  ],
  pointers: [
    { content: `No — pause length is not the rule. Read the right side alone: "determined to get the timing right before Friday" has no subject and no main verb, so it is a fragment, and a semicolon requires a complete sentence on BOTH sides. CORRECT: "We rehearsed the closing number six times, determined to get the timing right before Friday." If the writer wants the weight of a semicolon, the fix is to make the second half stand alone: "We rehearsed the closing number six times; we were determined to get the timing right before Friday."`, kind: 'common-error' },
    { content: `Cover everything to the left of the mark: if it cannot stand alone as a sentence, neither a semicolon nor a colon is allowed there.`, kind: 'tip' },
    { content: `A semicolon joins two COMPLETE sentences that belong together, and it also acts as a super-comma between list items that already contain commas.`, kind: 'tip' },
    { content: `A transition word such as however or therefore takes a semicolon before it and a comma after it; a semicolon is never followed directly by and, but, or so.`, kind: 'tip' },
    { content: `A colon needs a complete clause on its left and then points forward to a list, an explanation, or one emphatic word — and the right side never has to be a full sentence.`, kind: 'tip' },
    { content: `Don't call the semicolon "a strong comma." Pause length is never the rule. Read the words AFTER the semicolon alone: no subject + main verb means no semicolon. "...six times; determined to get the timing right" is wrong — use a comma.`, kind: 'common-error' },
    { content: `Semicolon = complete sentence on BOTH sides. Colon = complete sentence on the LEFT only. The right side of a colon can be a list, a phrase, or one word.`, kind: 'gotcha' },
    { content: `Never write "were:" or "such as:" or "including:" — those leave a dangling verb or preposition. Fix by deleting the colon or finishing the clause: "I packed three things: sunscreen, a paperback, and my sketchbook."`, kind: 'common-error' },
    { content: `*However, therefore, moreover, instead, in fact* are conjunctive adverbs, not conjunctions — they can't glue clauses the way *and* or *but* can. Pattern: clause **;** however**,** clause. A comma alone there is a comma splice.`, kind: 'vocab-note' },
    { content: `Never write "; and", "; but", or "; so". Pick the semicolon OR the conjunction with a comma — not both.`, kind: 'gotcha' },
    { content: `A clause opening with *because, although, even though, while, since, if* is dependent — it can't sit on either side of a semicolon. "Because the bus broke down; we missed the hour" needs a comma instead.`, kind: 'edge-case' },
    { content: `Upgrade list commas to semicolons only when the items themselves contain commas: "Lima, Peru; Osaka, Japan; and Cork, Ireland." A plain list of simple items keeps commas — don't sprinkle super-commas for emphasis.`, kind: 'edge-case' },
    { content: `When both marks are legal, ask what the right side is DOING. Separate related fact → semicolon. Delivers what the left side promised (a rule, a reason, a list) → colon.`, kind: 'tip' },
  ],
};
