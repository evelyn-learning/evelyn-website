/**
 * HS English — Grammar & Usage: Simple, Compound & Complex Sentences.
 *
 * The sentence-variety engine of real writing (CCSS L.9-10.1, L.9-10.3):
 * count independent and dependent clauses to name any sentence type, then
 * combine short choppy sentences into compound, complex, and
 * compound-complex sentences that carry the intended emphasis. Every
 * practice item is a revision-choice or identification MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U2_SENTENCE_TYPES_COMBINING: LessonPlan = {
  id: 'evelyn.hs.engl.sentence-types-combining.v1',
  title: 'Simple, Compound & Complex Sentences',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.sentence-types-combining',
      standard: 'ENGL-2.2',
      description:
        'Identify simple, compound, complex, and compound-complex sentences by counting independent and dependent clauses, and combine short related sentences into longer structures that vary rhythm and place emphasis where the writer intends (CCSS L.9-10.1, L.9-10.3).',
    },
  ],
  prerequisites: ['engl.clauses-and-phrases'],
  followUps: ['engl.fragments-and-run-ons'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Sentence variety is what makes writing sound like a person instead of a list — frame combining as the control writers use to steer emphasis.',
      script:
        'Read this out loud: "The interview was short. I was nervous. I still got the job." Now read this: "Although the interview was short and I was nervous, I still got the job." Same three facts, completely different voice. The first sounds like a police report; the second sounds like someone telling a story, and it puts the win at the end where the reader remembers it. That is not a style accident. It is one skill: knowing how clauses combine. Today you learn to name the four sentence types and to join short sentences on purpose, so the shape of your writing carries the meaning you actually want.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-clause-count',
      kind: 'concept',
      goal: 'The clause-counting method for naming the four sentence types, plus the legal joining moves and the errors that show up when writers combine.',
      keyIdeas: [
        'THE CLAUSE-COUNT METHOD — every sentence type is decided by two numbers: how many INDEPENDENT clauses (subject + verb, could stand alone) and how many DEPENDENT clauses (subject + verb, but opens with a subordinator and cannot stand alone). Count both, then read off the name. Length, commas, and how impressive the sentence sounds decide nothing.',
        'THE FOUR TYPES — SIMPLE = 1 independent, 0 dependent ("The band rehearsed in the garage"). COMPOUND = 2 or more independent, 0 dependent ("The band rehearsed in the garage, and the neighbors complained"). COMPLEX = 1 independent + 1 or more dependent ("Because the drummer was late, the band rehearsed without him"). COMPOUND-COMPLEX = 2 or more independent + at least 1 dependent ("Because the drummer was late, the band rehearsed without him, and the set still sounded tight").',
        'SUBORDINATORS SIGNAL DEPENDENT CLAUSES — although, because, since, when, while, if, unless, after, before, until, even though, and the relative pronouns who, which, that. Put one in front of a complete sentence and it can no longer stand alone: "The doors opened" is independent; "when the doors opened" is dependent.',
        'THREE LEGAL WAYS TO BUILD A COMPOUND — comma + a coordinating conjunction (for, and, nor, but, or, yet, so), a semicolon, or a semicolon plus a transition word with a comma after it ("The rehearsal ran long; therefore, we skipped the last song"). Choose the conjunction that names the real relationship: "but" for contrast, "so" for result, "and" for addition.',
        'COMPLEX SENTENCES CHOOSE THE EMPHASIS — the independent clause carries the idea the reader remembers, and the dependent clause carries the background. "Although we lost, the crowd stayed" praises the crowd; "Although the crowd stayed, we lost" mourns the loss. When combining, decide which fact matters most and make THAT one the independent clause.',
        'PUNCTUATION RULE FOR DEPENDENT CLAUSES — a dependent clause placed FIRST takes a comma after it ("When the doors opened, the line stretched around the block"). The same clause placed LAST usually takes no comma ("The line stretched around the block when the doors opened"). This is the comma students most often add or drop by ear.',
        'CLASSIC ERROR — THE COMMA SPLICE WHILE COMBINING. Joining two independent clauses with a comma and nothing else is WRONG: "The film ran three hours, nobody left early." CORRECT versions add the missing joiner: "The film ran three hours, but nobody left early" or "The film ran three hours; nobody left early." A comma alone is never strong enough.',
        'CLASSIC ERROR — MISCOUNTING COMPOUND PARTS. Two verbs sharing one subject is a compound VERB, not a compound sentence: "The band rehearsed in the garage and recorded a demo" is still SIMPLE, because the second half has no subject of its own. And because it is one clause, no comma goes before that "and". Ask "does each side have its own subject?" before you call a sentence compound.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a subject-verb group that expresses a complete thought and could stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'a subject-verb group that opens with a subordinator or relative pronoun and cannot stand alone.' },
        { term: 'compound-complex sentence', definition: 'a sentence with at least two independent clauses and at least one dependent clause.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-the-type',
      kind: 'worked_example',
      problem:
        'Name the sentence type: "While the storm knocked out power downtown, the shelter kept its lights on, and volunteers served dinner to almost two hundred people."',
      steps: [
        'Split the sentence at its joining words and find each subject-verb pair: "the storm knocked out power", "the shelter kept its lights on", "volunteers served dinner".',
        'Check the first one for a subordinator. It opens with "While", so "While the storm knocked out power downtown" cannot stand alone — that is 1 DEPENDENT clause.',
        'Test the other two alone. "The shelter kept its lights on" stands alone, and "volunteers served dinner to almost two hundred people" stands alone. That is 2 INDEPENDENT clauses, joined legally by comma + "and".',
        'Read off the count: 2 independent + 1 dependent = COMPOUND-COMPLEX. Note the comma after "downtown" — the dependent clause came first, so it earns a comma.',
      ],
      answer: 'Compound-complex — 2 independent clauses joined by comma + "and", plus 1 dependent clause opening with "While".',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-combine-emphasis',
      kind: 'worked_example',
      problem:
        'A student wants to combine these two sentences: "The rain started at halftime. The marching band finished the whole show." Their draft is "The rain started at halftime, the marching band finished the whole show." Is that draft correct, and what is the better combination?',
      steps: [
        'Test each side of the comma alone. "The rain started at halftime" is a complete sentence, and "the marching band finished the whole show" is a complete sentence. Two independent clauses.',
        'The draft joins two independent clauses with a comma and nothing else, so it is WRONG — that is a comma splice. A comma alone cannot hold two complete sentences together.',
        'Name the real relationship between the ideas: the rain should have stopped the show, and the band played anyway. That is contrast, not addition, so "and" would be limp and "but" fits.',
        'Now decide the emphasis. The point of the sentence is the band, so the band belongs in the independent clause. Making the rain a dependent clause pushes it into the background: "Although the rain started at halftime, the marching band finished the whole show."',
        'Both of these are CORRECT: "The rain started at halftime, but the marching band finished the whole show" (compound) and "Although the rain started at halftime, the marching band finished the whole show" (complex). The complex version emphasizes the band more strongly, because the dependent clause demotes the rain.',
      ],
      answer:
        'The draft is a comma splice. Best combination: "Although the rain started at halftime, the marching band finished the whole show." — a complex sentence that puts the emphasis on the band.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-type',
      kind: 'try_yourself',
      problem:
        'What type of sentence is this? "The debate club met after school, and the new members argued until the custodian turned off the lights."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Simple' },
        { id: 'b', text: 'Compound' },
        { id: 'c', text: 'Complex' },
        { id: 'd', text: 'Compound-complex', correct: true },
      ],
      expectedAnswer: 'Compound-complex',
      hints: [
        'Find every subject-verb pair, then check which ones could stand alone as sentences.',
        '"The debate club met after school" and "the new members argued" both stand alone, but "until the custodian turned off the lights" opens with a subordinator — count 2 independent plus 1 dependent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-combine-choice',
      kind: 'try_yourself',
      problem:
        'Which combination best joins these sentences while keeping the emphasis on the finished mural? "The art class worked through three weekends. The mural covered the entire cafeteria wall by Monday."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'After the art class worked through three weekends, the mural covered the entire cafeteria wall by Monday.', correct: true },
        { id: 'b', text: 'The art class worked through three weekends, the mural covered the entire cafeteria wall by Monday.' },
        { id: 'c', text: 'Although the mural covered the entire cafeteria wall by Monday, the art class worked through three weekends.' },
        { id: 'd', text: 'The art class worked through three weekends and covering the entire cafeteria wall by Monday.' },
      ],
      expectedAnswer:
        'After the art class worked through three weekends, the mural covered the entire cafeteria wall by Monday.',
      hints: [
        'The idea you want the reader to remember belongs in the INDEPENDENT clause; the background belongs in the dependent clause.',
        'Check each option for a comma splice and for a clause that lost its verb. Only one option keeps the mural independent and joins the clauses legally.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-compound',
      kind: 'try_yourself',
      problem: 'Which sentence is a COMPOUND sentence?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The intern answered every email, so the manager offered her a second summer.', correct: true },
        { id: 'b', text: 'The intern answered every email and organized the entire filing system.' },
        { id: 'c', text: 'Because the intern answered every email, the manager offered her a second summer.' },
        { id: 'd', text: 'The intern, working through her lunch break every day of June, answered every email.' },
      ],
      expectedAnswer: 'The intern answered every email, so the manager offered her a second summer.',
      hints: [
        'A compound sentence needs TWO independent clauses — so each side of the joining word must have its own subject.',
        'Option b has one subject with two verbs (compound verb, still simple), option c opens with a subordinator (complex), and option d is one clause with a long modifying phrase.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-long-means-compound',
      kind: 'misconception_check',
      question:
        'A student labels this sentence compound: "The photographer, balancing on a stepladder at the back of the crowded gym, captured the winning shot and posted it before the buzzer." Their reasoning: "It is long, it has commas, and it has an and in it." What went wrong?',
      commonErrors: [
        {
          answer: 'It must be compound because it is long, has commas, and contains "and"',
          misconception: 'Using length, commas, and the presence of "and" as the test instead of counting independent clauses with their own subjects.',
          correctsTo:
            'Count clauses, not words. There is exactly one subject here, "photographer", and it runs both verbs: "captured" and "posted". That is a compound VERB, not a second clause, so no comma belongs before "and". The commas are only setting off the modifying phrase "balancing on a stepladder at the back of the crowded gym", which has no subject at all. One independent clause, zero dependent clauses: the sentence is SIMPLE.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name any sentence by counting clauses: simple = 1 independent; compound = 2 or more independent; complex = 1 independent + 1 or more dependent; compound-complex = 2 or more independent + at least 1 dependent.',
        'Join independent clauses with a comma + coordinating conjunction, a semicolon, or a semicolon + transition — a comma alone is a comma splice.',
        'A dependent clause opens with a subordinator (although, because, when, if, since, until) or a relative pronoun; first position takes a comma after it, last position usually takes none.',
        'When combining, put the idea you want remembered in the independent clause and the background in the dependent clause; and check for a real second subject before calling a sentence compound.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Simple, Compound & Complex Sentences' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
