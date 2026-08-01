/**
 * HS English — Unit 2 CED 2.2: Simple, Compound & Complex Sentences.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.sentence-types-combining.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U2_SENTENCE_TYPES_COMBINING: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.sentence-types-combining.v1',
  course: 'HS English',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Simple, Compound & Complex Sentences',
  planId: 'evelyn.hs.engl.sentence-types-combining.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.sentence-types-combining.v1' }],
  theory: [
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'The clause-count method', content: `THE CLAUSE-COUNT METHOD — every sentence type is decided by two numbers: how many INDEPENDENT clauses (subject + verb, could stand alone) and how many DEPENDENT clauses (subject + verb, but opens with a subordinator and cannot stand alone). Count both, then read off the name. Length, commas, and how impressive the sentence sounds decide nothing.` },
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'The four types', content: `THE FOUR TYPES — SIMPLE = 1 independent, 0 dependent ("The band rehearsed in the garage"). COMPOUND = 2 or more independent, 0 dependent ("The band rehearsed in the garage, and the neighbors complained"). COMPLEX = 1 independent + 1 or more dependent ("Because the drummer was late, the band rehearsed without him"). COMPOUND-COMPLEX = 2 or more independent + at least 1 dependent ("Because the drummer was late, the band rehearsed without him, and the set still sounded tight").` },
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'Subordinators signal dependent clauses', content: `SUBORDINATORS SIGNAL DEPENDENT CLAUSES — although, because, since, when, while, if, unless, after, before, until, even though, and the relative pronouns who, which, that. Put one in front of a complete sentence and it can no longer stand alone: "The doors opened" is independent; "when the doors opened" is dependent.` },
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'Three legal ways to build a compound', content: `THREE LEGAL WAYS TO BUILD A COMPOUND — comma + a coordinating conjunction (for, and, nor, but, or, yet, so), a semicolon, or a semicolon plus a transition word with a comma after it ("The rehearsal ran long; therefore, we skipped the last song"). Choose the conjunction that names the real relationship: "but" for contrast, "so" for result, "and" for addition.` },
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'Complex sentences choose the emphasis', content: `COMPLEX SENTENCES CHOOSE THE EMPHASIS — the independent clause carries the idea the reader remembers, and the dependent clause carries the background. "Although we lost, the crowd stayed" praises the crowd; "Although the crowd stayed, we lost" mourns the loss. When combining, decide which fact matters most and make THAT one the independent clause.` },
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'Punctuation rule for dependent clauses', content: `PUNCTUATION RULE FOR DEPENDENT CLAUSES — a dependent clause placed FIRST takes a comma after it ("When the doors opened, the line stretched around the block"). The same clause placed LAST usually takes no comma ("The line stretched around the block when the doors opened"). This is the comma students most often add or drop by ear.` },
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — THE COMMA SPLICE WHILE COMBINING. Joining two independent clauses with a comma and nothing else is WRONG: "The film ran three hours, nobody left early." CORRECT versions add the missing joiner: "The film ran three hours, but nobody left early" or "The film ran three hours; nobody left early." A comma alone is never strong enough.` },
    { loId: 'engl.sentence-types-combining', kind: 'framework', title: 'Classic error', content: `CLASSIC ERROR — MISCOUNTING COMPOUND PARTS. Two verbs sharing one subject is a compound VERB, not a compound sentence: "The band rehearsed in the garage and recorded a demo" is still SIMPLE, because the second half has no subject of its own. And because it is one clause, no comma goes before that "and". Ask "does each side have its own subject?" before you call a sentence compound.` },
    { loId: 'engl.sentence-types-combining', kind: 'definition', title: 'independent clause', content: `a subject-verb group that expresses a complete thought and could stand alone as a sentence.` },
    { loId: 'engl.sentence-types-combining', kind: 'definition', title: 'dependent clause', content: `a subject-verb group that opens with a subordinator or relative pronoun and cannot stand alone.` },
    { loId: 'engl.sentence-types-combining', kind: 'definition', title: 'compound-complex sentence', content: `a sentence with at least two independent clauses and at least one dependent clause.` },
  ],
  methods: [
    {
      title: 'Worked name the type',
      steps: [
        `Split the sentence at its joining words and find each subject-verb pair: "the storm knocked out power", "the shelter kept its lights on", "volunteers served dinner".`,
        `Check the first one for a subordinator. It opens with "While", so "While the storm knocked out power downtown" cannot stand alone — that is 1 DEPENDENT clause.`,
        `Test the other two alone. "The shelter kept its lights on" stands alone, and "volunteers served dinner to almost two hundred people" stands alone. That is 2 INDEPENDENT clauses, joined legally by comma + "and".`,
        `Read off the count: 2 independent + 1 dependent = COMPOUND-COMPLEX. Note the comma after "downtown" — the dependent clause came first, so it earns a comma.`,
      ],
      example: { problem: `Name the sentence type: "While the storm knocked out power downtown, the shelter kept its lights on, and volunteers served dinner to almost two hundred people."`, solution: `Compound-complex — 2 independent clauses joined by comma + "and", plus 1 dependent clause opening with "While".` },
      relatedLoIds: ['engl.sentence-types-combining'],
    },
    {
      title: 'Worked combine emphasis',
      steps: [
        `Test each side of the comma alone. "The rain started at halftime" is a complete sentence, and "the marching band finished the whole show" is a complete sentence. Two independent clauses.`,
        `The draft joins two independent clauses with a comma and nothing else, so it is WRONG — that is a comma splice. A comma alone cannot hold two complete sentences together.`,
        `Name the real relationship between the ideas: the rain should have stopped the show, and the band played anyway. That is contrast, not addition, so "and" would be limp and "but" fits.`,
        `Now decide the emphasis. The point of the sentence is the band, so the band belongs in the independent clause. Making the rain a dependent clause pushes it into the background: "Although the rain started at halftime, the marching band finished the whole show."`,
        `Both of these are CORRECT: "The rain started at halftime, but the marching band finished the whole show" (compound) and "Although the rain started at halftime, the marching band finished the whole show" (complex). The complex version emphasizes the band more strongly, because the dependent clause demotes the rain.`,
      ],
      example: { problem: `A student wants to combine these two sentences: "The rain started at halftime. The marching band finished the whole show." Their draft is "The rain started at halftime, the marching band finished the whole show." Is that draft correct, and what is the better combination?`, solution: `The draft is a comma splice. Best combination: "Although the rain started at halftime, the marching band finished the whole show." — a complex sentence that puts the emphasis on the band.` },
      relatedLoIds: ['engl.sentence-types-combining'],
    },
  ],
  pointers: [
    { content: `Count clauses, not words. There is exactly one subject here, "photographer", and it runs both verbs: "captured" and "posted". That is a compound VERB, not a second clause, so no comma belongs before "and". The commas are only setting off the modifying phrase "balancing on a stepladder at the back of the crowded gym", which has no subject at all. One independent clause, zero dependent clauses: the sentence is SIMPLE.`, kind: 'common-error' },
    { content: `Name any sentence by counting clauses: simple = 1 independent; compound = 2 or more independent; complex = 1 independent + 1 or more dependent; compound-complex = 2 or more independent + at least 1 dependent.`, kind: 'tip' },
    { content: `Join independent clauses with a comma + coordinating conjunction, a semicolon, or a semicolon + transition — a comma alone is a comma splice.`, kind: 'tip' },
    { content: `A dependent clause opens with a subordinator (although, because, when, if, since, until) or a relative pronoun; first position takes a comma after it, last position usually takes none.`, kind: 'tip' },
    { content: `When combining, put the idea you want remembered in the independent clause and the background in the dependent clause; and check for a real second subject before calling a sentence compound.`, kind: 'tip' },
    { content: `Before calling a sentence compound, ask: **does the second half have its own subject?** "The band rehearsed and recorded a demo" = compound VERB, still SIMPLE — and no comma before that "and".`, kind: 'common-error' },
    { content: `Length, commas, and fancy vocabulary decide NOTHING. A twenty-word sentence stuffed with modifying phrases can still be simple. Only the count of independent + dependent clauses names the type.`, kind: 'gotcha' },
    { content: `Comma position with dependent clauses is not by ear: dependent FIRST takes a comma ("When the bell rang, we left"); dependent LAST usually takes none ("We left when the bell rang").`, kind: 'common-error' },
    { content: `A comma alone can never hold two complete sentences together. Fix a splice one of three ways: add a coordinating conjunction after the comma, swap in a semicolon, or use semicolon + transition + comma ("...; however, ...").`, kind: 'common-error' },
    { content: `"Complex" does not mean "complicated" or "long" — it's a technical label meaning exactly 1 independent + at least 1 dependent clause. "Because it rained, we left" is short and still complex.`, kind: 'vocab-note' },
    { content: `Don't confuse a coordinating conjunction (for, and, nor, but, or, yet, so) with a subordinator (although, because, since, when, while, if). Coordinators join equals into a compound; subordinators demote a clause into a dependent one.`, kind: 'vocab-note' },
    { content: `When you combine, the independent clause is what the reader remembers. "Although we lost, the crowd stayed" praises the crowd; flip them and you mourn the loss. Pick the emphasis on purpose, not by whichever sentence you wrote first.`, kind: 'tip' },
    { content: `Relative pronouns (who, which, that) also start dependent clauses. "The runner who won the 800 collapsed" has two subject-verb pairs but is COMPLEX, not compound — the "who" clause can't stand alone.`, kind: 'edge-case' },
  ],
};
