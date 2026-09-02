/**
 * Grade 6 ELA — Sentence Fluency, Style & Punctuation: Maintaining Consistent
 * Style & Tone.
 *
 * PROCEDURE-LED fan-out row for m6ela. There is one repeatable move and the
 * whole lesson makes it fluent: read a whole piece of writing, decide which
 * register most of its sentences are using, and find the one sentence that
 * does not match — then rewrite that sentence in the established register
 * while keeping the same information (CCSS L.6.3b). The break only exists
 * across sentences, so every item in this file prints a multi-sentence
 * passage rather than a single sentence, the way row 5.3's pronoun-shift row
 * has to. Both worked examples run the lapse-then-fix procedure in opposite
 * directions — a casual aside inside a formal announcement, then a stiff,
 * jargon-heavy sentence inside a casual letter — so the pattern reads as one
 * skill rather than two.
 *
 * SCOPE GUARD: Grade 6 row 6.4 checks whether one piece of writing keeps the
 * same level of formality and the same tone in every sentence from start to
 * finish, and repairs the single sentence that breaks that established
 * register. DELIBERATELY EXCLUDED: varying sentence length and opening for
 * stylistic interest (row 6.2, `varying-sentence-patterns-for-style`,
 * L.6.3a) — that skill changes a sentence's rhythm and structure inside an
 * already-consistent register, and no item in this file asks the student to
 * vary or judge a sentence's structure; recognizing and revising an isolated
 * nonstandard grammatical form such as a double negative or "ain't" (row 5.4,
 * `standard-and-nonstandard-english`, L.6.1e) — that is a sentence-level
 * standard-English check that holds regardless of context, while every lapse
 * in this file is a grammatically correct sentence that is wrong only next to
 * the sentences around it; analyzing how one already-printed word's
 * connotation creates the tone of a text the student reads (row 2.4,
 * `word-choice-and-tone`, RL.6.4) — that lesson is the reading-side skill,
 * isolating a single word inside one sentence with a swap test, while this
 * lesson is the writing-side counterpart, comparing whole sentences against a
 * whole piece's established register and revising the one that breaks it; no
 * swap test and no single-word tone analysis appears anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item — an invented class newsletter, a garden-club report,
 * a letter between cousins, a diary entry, and a museum blurb, none of them a
 * real publication. This course carries no passage machinery — no passageId,
 * no shared texts — so each question must be solvable from the words printed
 * inside it. Every phrase this file puts inside quotation marks appears
 * character-for-character in the excerpt above it; quote your own excerpt
 * exactly, never from memory. No contraction appears anywhere in this file;
 * where a passage needed an informal marker, the excerpts use slang, filler
 * words, and exaggeration instead, so nothing here relies on the
 * reported-speech or cited-specimen exemptions.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is an invented
 * announcement, letter, or diary entry about fictional people, clubs, and
 * events — a bake sale, a garden club's rainfall log, a summer-camp letter, a
 * treehouse build, and a museum bird exhibit. None of them asserts a claim
 * about the real world that a student could look up; every specific inside
 * them (the number of species, the rainfall schedule, the talent-show win) is
 * stipulated for its own item and is never contradicted elsewhere in that
 * item, so there is nothing here for a claim ledger to verify.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U6_MAINTAINING_CONSISTENT_STYLE_AND_TONE: LessonPlan = {
  id: 'evelyn.ms.m6ela.maintaining-consistent-style-and-tone.v1',
  title: 'Maintaining Consistent Style & Tone',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.maintaining-consistent-style-and-tone',
      standard: 'M6ELA-6.4',
      description:
        'Keep one piece of writing\'s level of formality and tone consistent from start to finish, revising the one sentence whose register breaks that consistency — a whole-passage style check, distinct from Unit 5\'s sentence-level standard-English check (CCSS L.6.3b).',
    },
  ],
  prerequisites: ['m6ela.commas-for-nonrestrictive-and-parenthetical-elements'],
  followUps: ['m6ela.context-clues'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already feels a register break even when a sentence is grammatically fine, before naming the skill.',
      script:
        'Imagine you write a note excusing your own absence, and it starts: "Please excuse my absence on Friday due to a scheduled orthodontist appointment." Then, halfway through, it suddenly says: "anyway lol my mom will explain the rest." Nothing about that second sentence is grammatically wrong. It is a complete sentence. But something about it feels off, and it is not the grammar — it is that the note picked one voice at the start and then switched voices partway through. Every piece of writing settles on one level of formality near the beginning, formal or casual, and strong writers keep it steady from the first word to the last. Today we learn to catch the one sentence that breaks that pattern, in either direction, and fix it so it matches everything around it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-register-and-the-comparison-test',
      kind: 'concept',
      goal: 'Define register and tone as whole-passage properties, and install the compare-to-the-majority procedure for finding and fixing the one sentence that breaks them.',
      keyIdeas: [
        'A PIECE OF WRITING PICKS ONE REGISTER AND HOLDS IT FROM START TO FINISH. A school report, a class newsletter, or a note to a principal chooses a formal register: careful word choice, no slang, no casual asides. A text to a friend or a personal story chooses an informal register: everyday words, exclamation points, casual filler. The choice happens once, near the beginning, and every sentence after it should match.',
        'A LAPSE IS ONE SENTENCE THAT DOES NOT MATCH THE REST. A single slangy aside dropped into an otherwise formal report breaks the piece, even though every other sentence is fine. A single stiff, jargon-heavy sentence dropped into a warm, casual letter breaks it the same way, just in the opposite direction. Either way it is the same mistake: one sentence picked a different register than the rest of the piece.',
        'FIND THE LAPSE BY COMPARING SENTENCES TO EACH OTHER, NOT BY JUDGING ONE SENTENCE ALONE. Read the whole piece first and decide which register most of its sentences are using. Then check every sentence against that majority. The sentence that does not match is the lapse, and it cannot be spotted by reading it in isolation — the break only exists next to the sentences around it.',
        'A LAPSE CAN BE A PERFECTLY CORRECT SENTENCE. A sentence can have no fragment, no run-on, and no nonstandard grammar, and still be the one that breaks a piece, because the problem is not how the sentence is built — it is that its wording does not match the register the rest of the piece already established.',
        'FIX A LAPSE BY REWRITING IT IN THE ESTABLISHED REGISTER, KEEPING THE SAME INFORMATION. A casual aside inside a formal report gets rewritten with precise, formal wording that still says what the aside said. A stiff, jargon-heavy sentence inside a casual letter gets rewritten with the same warm, everyday words the rest of the letter already uses.',
        'SLANG, CASUAL FILLER WORDS, AND EXAGGERATION SIGNAL AN INFORMAL REGISTER. PRECISE VOCABULARY AND FORMAL TRANSITIONS SIGNAL A FORMAL REGISTER. Noticing those signals is what lets a reader spot the one sentence that switched registers partway through a piece.',
      ],
      vocabulary: [
        { term: 'register', definition: 'how formal or informal a piece of writing needs to be for its audience and purpose, such as a school report versus a text to a friend.' },
        { term: 'style', definition: 'the level of formality and word choice a writer settles on for one whole piece of writing.' },
        { term: 'tone', definition: 'the attitude a piece of writing carries toward its subject, held steady from the first sentence to the last.' },
        { term: 'formal', definition: 'careful, precise word choice with no slang and no casual asides, suited to a report, a letter to an official, or a class presentation.' },
        { term: 'consistency', definition: 'keeping the same register and tone in every sentence of a piece, instead of switching partway through.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-formal-report-with-a-casual-lapse',
      kind: 'worked_example',
      problem:
        'Read the class newsletter announcement below, then find the one sentence that breaks its formal, informative tone.\n\n"The sixth-grade class is holding a bake sale on Friday to raise money for the spring field trip. Every homeroom will set up a table in the cafeteria at lunchtime. Anyway, cookies are basically the best thing ever, no joke. All proceeds will go directly toward transportation and admission costs for the trip."',
      steps: [
        'Set aside the sentence you are unsure about, and read only the rest of the announcement: "The sixth-grade class is holding a bake sale on Friday to raise money for the spring field trip." "Every homeroom will set up a table in the cafeteria at lunchtime." "All proceeds will go directly toward transportation and admission costs for the trip." All three state facts about the event in careful, precise wording, with no slang anywhere.',
        'That is the established register: formal and informative. Now check the remaining sentence against it: "Anyway, cookies are basically the best thing ever, no joke."',
        'Name exactly what does not match. The words "anyway," "basically," and "no joke" are casual filler. No other sentence in the announcement uses wording like that, and none of them state a personal opinion the way this one does.',
        'Confirm the lapse is not a grammar problem. The sentence is complete and correctly punctuated. The problem is that its register does not match the three sentences around it, not how it is built.',
        'Fix the lapse by keeping the same information — that cookies are a popular item at the sale — in formal wording. WRONG: "Anyway, cookies are basically the best thing ever, no joke." CORRECT: "Cookies are expected to be one of the sale\'s most popular items."',
        'Read the repaired announcement straight through and confirm every sentence now matches: careful, factual wording from the first sentence to the last.',
      ],
      answer:
        'The lapse is "Anyway, cookies are basically the best thing ever, no joke." It breaks the announcement\'s formal register with casual filler words, even though it is a grammatically complete sentence. Rewritten to match: "Cookies are expected to be one of the sale\'s most popular items."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-casual-letter-with-a-formal-lapse',
      kind: 'worked_example',
      problem:
        'Read the diary entry below, then find the one sentence that breaks its warm, casual tone.\n\n"Saturday was awesome because Priya and I finally built the treehouse we had been planning all summer. We used the extra plywood from her dad\'s garage and about a million nails. Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection. We are already planning to paint it green next weekend."',
      steps: [
        'Set aside the sentence you are unsure about, and read only the rest of the entry: "Saturday was awesome because Priya and I finally built the treehouse we had been planning all summer." "We used the extra plywood from her dad\'s garage and about a million nails." "We are already planning to paint it green next weekend." All three sound like a friend talking: everyday words, an exaggeration ("a million nails"), and an exclamation of excitement ("awesome").',
        'That is the established register: warm and casual. Now check the remaining sentence against it: "Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection."',
        'Name exactly what does not match. Words like "subsequently," "aforementioned," and "deemed" are precise, formal vocabulary. No other sentence in the entry uses wording anywhere near that stiff.',
        'Notice the direction is reversed from the bake-sale example: there, a casual sentence landed inside a formal piece; here, a formal sentence lands inside a casual piece. The fix works the same way either direction — find the register most of the piece is using, and match the lapse to it.',
        'Fix the lapse by keeping the same information — that the treehouse was checked and found sturdy — in casual wording. WRONG: "Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection." CORRECT: "We checked it over afterward, and it felt totally sturdy."',
        'Read the repaired entry straight through and confirm every sentence now matches: warm, everyday wording from the first sentence to the last.',
      ],
      answer:
        'The lapse is "Subsequently, the aforementioned structure was deemed structurally sound upon a thorough inspection." It breaks the entry\'s casual register with stiff, formal vocabulary. Rewritten to match: "We checked it over afterward, and it felt totally sturdy."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-formal-report-find-the-lapse',
      kind: 'try_yourself',
      problem:
        'Read the science-club report below, then choose the sentence that breaks its formal, informative tone.\n\n"The sixth-grade garden club began tracking rainfall in March. Every Monday, a different student records the week\'s total and posts it on the class bulletin board. Honestly, the whole thing is kind of a snooze, but somebody has to do it. The data will help the club decide which vegetables to plant in the raised beds next spring."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The sixth-grade garden club began tracking rainfall in March.' },
        { id: 'b', text: 'Every Monday, a different student records the week\'s total and posts it on the class bulletin board.' },
        { id: 'c', text: 'Honestly, the whole thing is kind of a snooze, but somebody has to do it.', correct: true },
        { id: 'd', text: 'The data will help the club decide which vegetables to plant in the raised beds next spring.' },
      ],
      expectedAnswer: 'Honestly, the whole thing is kind of a snooze, but somebody has to do it.',
      hints: [
        'Read the report once for its overall register, ignoring any one sentence for now. Three of the four sentences state plain facts about the club\'s routine. One sentence instead shares a personal opinion in casual wording.',
        'Look for words like "honestly" and "kind of a snooze" — casual filler that a report about a garden schedule does not normally use.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-casual-letter-find-the-lapse',
      kind: 'try_yourself',
      problem:
        'Read the letter below, then choose the sentence that breaks its warm, casual tone.\n\n"Dear Marcus,\n\nCamp was seriously the best this year, because we got to canoe every single day and race our cabin-mates across the lake each morning before breakfast. My cabin also won the talent show this year, which was honestly the most amazing surprise of the whole two weeks. Furthermore, the aforementioned recreational activities yielded a marked improvement in my physical conditioning. I cannot wait to tell you every single detail about camp when I finally get to see you in person next weekend.\n\nYour cousin,\nDana"',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Camp was seriously the best this year, because we got to canoe every single day and race our cabin-mates across the lake each morning before breakfast.' },
        { id: 'b', text: 'My cabin also won the talent show this year, which was honestly the most amazing surprise of the whole two weeks.' },
        { id: 'c', text: 'I cannot wait to tell you every single detail about camp when I finally get to see you in person next weekend.' },
        { id: 'd', text: 'Furthermore, the aforementioned recreational activities yielded a marked improvement in my physical conditioning.', correct: true },
      ],
      expectedAnswer: 'Furthermore, the aforementioned recreational activities yielded a marked improvement in my physical conditioning.',
      hints: [
        'Read the letter once for its overall register, ignoring any one sentence for now. Three of the four sentences sound like one cousin talking to another. One sentence instead sounds like it belongs in a lab report.',
        'Look for words like "furthermore," "aforementioned," and "conditioning" — formal, report-style vocabulary that a letter between cousins does not normally use.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-museum-blurb-choose-the-best-fix',
      kind: 'try_yourself',
      problem:
        'Read the museum newsletter blurb below, then choose the sentence that would best replace the one that breaks its formal, informative tone.\n\n"The museum\'s new bird exhibit opens Saturday and features twelve species native to the wetlands behind the visitor center. Visitors will be able to view several rare herons through the observation windows. Okay but seriously, you have got to see the herons, they are so cool. The exhibit will remain open through the end of October."\n\nReplace this sentence: "Okay but seriously, you have got to see the herons, they are so cool."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The observation windows offer an especially clear view of the exhibit\'s rare herons, a highlight many visitors will not want to miss.', correct: true },
        { id: 'b', text: 'Okay but seriously, you have got to see the herons up close, because they are honestly the coolest thing in the whole exhibit hands down.' },
        { id: 'c', text: 'Honestly, the herons are basically the best part of the entire exhibit, so you should for sure go check them out this weekend, no cap.' },
        { id: 'd', text: 'Herons, guys — do not skip them, they are seriously worth the whole trip out to the museum this weekend.' },
      ],
      expectedAnswer: 'The observation windows offer an especially clear view of the exhibit\'s rare herons, a highlight many visitors will not want to miss.',
      hints: [
        'The other three sentences in the blurb state facts in precise, formal wording with no slang. Look for the one replacement that matches that same wording instead of just restating the same casual idea in different casual words.',
        'Rule out any choice that still uses filler like "okay," "seriously," "honestly," or "no cap," or that still opens with an informal exclamation — those keep the lapse instead of fixing it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-grammar-versus-register',
      kind: 'misconception_check',
      question:
        'A student picks out a sentence they think breaks a passage\'s consistency, but explains it this way: "That sentence is wrong because it is a run-on." Another student, working on a different passage, explains a pick this way: "I found the lapse by looking for the one word with the strongest feeling, the way I would for a story\'s tone." What has gone wrong in each explanation?',
      commonErrors: [
        {
          answer: 'That sentence is wrong because it is a run-on.',
          misconception:
            'Treating a whole-passage register check as though it were the sentence-completeness check from Unit 5 and Unit 6.1. The sentence in question can be a complete, correctly punctuated sentence with no fragment and no run-on, and still be the lapse, because the problem is not how the sentence is built.',
          correctsTo:
            'Check a sentence\'s grammar and its register separately. A run-on has a structural problem that exists inside that one sentence alone. A register lapse only exists next to the sentences around it: the sentence itself can be perfectly correct, and it is still the one that does not belong, because its wording does not match the rest of the piece.',
        },
        {
          answer: 'I found the lapse by looking for the one word with the strongest feeling, the way I would for a story\'s tone.',
          misconception:
            'Confusing this whole-passage register check with the single-word tone analysis used for reading a story, which hunts for one word\'s effect inside a sentence that is already fixed on the page.',
          correctsTo:
            'This check compares whole sentences to the register the rest of a piece has already established, not one word\'s feeling inside a single sentence. Read the whole piece, decide what register most of it uses, and then look for the one sentence — not the one word — that does not match. The word-by-word check belongs to reading a text that is already finished; this check belongs to keeping a piece of writing steady while it is being judged as a whole.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A piece of writing picks one register, formal or informal, and holds it from the first sentence to the last.',
        'A lapse is one sentence that does not match the rest, whether a casual aside lands inside a formal piece or a stiff, jargon-heavy sentence lands inside a casual one.',
        'Find a lapse by comparing sentences to the majority register of the whole piece, never by judging one sentence alone.',
        'A lapse can be a grammatically perfect sentence. The problem is its register, not its structure.',
        'Fix a lapse by rewriting it in the established register while keeping the same information.',
        'This is a whole-passage check. A single word\'s tone inside one sentence is a different skill.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Maintaining Consistent Style & Tone' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
