/**
 * Grade 7 ELA — Vocabulary: Roots, Prefixes & Suffixes (CCSS L.7.4b).
 *
 * Procedure-led. One four-step routine runs the whole lesson: break the word,
 * name each part, assemble a rough meaning, then check that meaning against
 * the sentence. Word parts buy an educated guess, never a guarantee.
 *
 * NOTE FOR FUTURE AUTHORS: every word-part claim in this file was checked one
 * at a time. If you add an example, verify BOTH that the letters really are
 * that prefix, root or suffix AND that the meaning printed for it is accurate.
 * A wrong decomposition taught confidently is worse than no lesson at all.
 * The false-prefix trap (uncle is not un + cle) is the misconception that most
 * often survives this lesson, so it is carried in three separate segments.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U7_ROOTS_PREFIXES_AND_SUFFIXES: LessonPlan = {
  id: 'evelyn.ms.m7ela.roots-prefixes-and-suffixes.v1',
  title: 'Roots, Prefixes & Suffixes',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.roots-prefixes-and-suffixes',
      standard: 'M7ELA-7.2',
      description:
        'Use common grade-appropriate Greek and Latin roots, prefixes and suffixes as clues to the meaning of an unfamiliar word, and confirm or reject that guess against the sentence the word appears in (CCSS L.7.4b).',
    },
  ],
  prerequisites: ['m7ela.context-clues'],
  followUps: ['m7ela.connotation-and-denotation'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a word you have never seen can still be half-readable, using a word from the student\'s own world.',
      script:
        'You have never taken a class in the word "unhelpfully", but you already know what it means. Watch what your brain does with it. It chops off "un", which means not. It chops off "ly", which means in that way. What is left in the middle is "helpful", and you know that one. Not helpful, done that way. Nobody taught you that word. You built it out of parts you already owned. Today we are going to do that on purpose, with the parts that show up in hundreds of words, and we are going to learn the one place this trick goes wrong.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-word-parts',
      kind: 'concept',
      goal: 'Install the four-step routine, load a small bank of trustworthy prefixes, suffixes and roots, and name the false-prefix trap.',
      keyIdeas: [
        'A LONG WORD IS USUALLY A SHORT WORD WEARING PARTS. There are three kinds. A prefix goes on the front. A suffix goes on the end. The root is the piece in the middle that carries the core meaning. "Unbreakable" is un plus break plus able. Break is the root, un is the prefix, able is the suffix.',
        'PREFIXES CHANGE THE MEANING. These eight cover a huge amount of ground: un- means not (unhappy), re- means again or back (rewrite, return), pre- means before (preview), mis- means wrongly or badly (misspell), dis- means not or the opposite of (dishonest), sub- means under (a subway is an underground way), inter- means between (an interstate highway runs between states), and non- means not (nonstop).',
        'SUFFIXES USUALLY CHANGE THE JOB OF THE WORD TOO, not just its meaning. -less means without and makes an adjective (harm becomes harmless). -ful means full of or having (color becomes colorful). -able means able to be (break becomes breakable). -tion names the act or the result and makes a noun (invent becomes invention). -ly means in that way and makes an adverb (quick becomes quickly). -ment also makes a noun (agree becomes agreement). -ist names a person who does it (science becomes scientist).',
        'ROOTS ARE THE HEART OF THE WORD, and many of ours are Greek or Latin. port means carry, dict means say, scrib and script mean write, spect means look, aud means hear, struct means build, tele means far, bio means life, graph means write. Transport is carry across. Predict is say before. Biography is writing about a life. A telescope lets you look far.',
        'THE ROUTINE IS FOUR STEPS. One, break the word into parts. Two, name what each part means. Three, put the meanings together into a rough guess. Four, and this is the step everyone skips, check the guess against the sentence. Word parts hand you a guess, not a guarantee. If the sentence disagrees with your guess, the sentence wins every time.',
        'THE TRAP: LETTERS ARE NOT PARTS. Plenty of words begin with the letters of a prefix and have no prefix at all. An uncle is not a "cle" that is not there. Under is not the opposite of "der". A restaurant is not a place where you "staurant" again, because there is no such word part. Two tests catch this. First, take the prefix off and see whether what is left is a real word or a root you recognize. Second, and this one decides it, ask whether the prefix meaning actually fits what the word means.',
      ],
      vocabulary: [
        { term: 'prefix', definition: 'a word part added to the FRONT of a word that changes its meaning, such as un-, re- or pre-.' },
        { term: 'suffix', definition: 'a word part added to the END of a word that changes its meaning and often changes its job in the sentence, such as -less, -tion or -ly.' },
        { term: 'root', definition: 'the core part of a word that carries its main meaning, such as port meaning carry or aud meaning hear.' },
        { term: 'base word', definition: 'a complete word that other parts get attached to, such as break inside unbreakable.' },
        { term: 'part of speech', definition: 'the job a word does in a sentence: noun, verb, adjective, adverb and so on.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-root-biography',
      kind: 'worked_example',
      problem:
        'Use the word parts to figure out the underlined word. "Nina checked out a biography of a woman who flew mail planes across the desert in the 1930s."',
      steps: [
        'Step one, break it. Biography splits into bio and graph. There is no prefix on the front and no suffix on the end here. Both pieces are roots.',
        'Step two, name the parts. bio means life. graph means write. You have met graph before in autograph, which is auto meaning self plus graph meaning write, so an autograph is a person writing their own name.',
        'Step three, assemble a rough guess. Life plus writing gives you something like writing about a life. That is close enough to test.',
        'Step four, check it against the sentence. Nina checked one out, so it is a thing from a library. It is about a woman and what she did for a living. Writing about a person\'s life fits the sentence exactly. The guess holds.',
        'Notice how far that gets you with the same two roots. Biology is the study of life. A paragraph, a photograph and a graph all carry the writing or drawing idea. A telescope is tele meaning far plus scope meaning look, so it is a tool for looking far away.',
      ],
      answer:
        'A biography is a written account of a real person\'s life. bio = life, graph = write, and the sentence confirms it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-false-prefix-test',
      kind: 'worked_example',
      problem:
        'Two words in this sentence begin with the letters m-i-s. Only ONE of them uses the prefix mis-. "The trail was misty at sunrise, so Dev misjudged the last turn and had to walk back."',
      steps: [
        'Start with what mis- means: wrongly or badly. That meaning is the tool you are about to test with.',
        'Test misjudged. Take mis- off and you are left with judged, which is a real word. Now the meaning test: does judged wrongly fit the sentence? Dev took the wrong turn and had to walk back, so yes, he judged the turn wrongly. Both tests pass. Misjudged really does use the prefix mis-.',
        'Now test misty. Take mis- off and you are left with ty. That is not a word and it is not a root you know. First test already failed.',
        'Run the meaning test anyway, because it is the one that decides. Would misty mean tying something wrongly? Nothing in the sentence is being tied. The sentence says sunrise on a trail, so misty is about mist in the air. The meaning test fails too.',
        'So misty is really mist plus the suffix -y, which means covered with or full of, the same -y that is inside cloudy and rainy. The letters m-i-s were a coincidence.',
        'This is the trap the whole lesson is built around. Uncle, under and reason all start with the letters of a prefix and none of them has one. Always run the meaning test before you trust a prefix.',
      ],
      answer:
        'Only misjudged uses the prefix mis- (wrongly), meaning he judged the turn wrongly. Misty is mist plus the suffix -y, meaning covered with mist.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-false-prefix',
      kind: 'try_yourself',
      problem: 'In which word do the letters u-n actually work as the prefix un- meaning not?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'uncle' },
        { id: 'b', text: 'uncomfortable', correct: true },
        { id: 'c', text: 'under' },
        { id: 'd', text: 'unicorn' },
      ],
      expectedAnswer: 'uncomfortable',
      hints: [
        'Take the letters u-n off the front of each word. Is what is left a real word or a root you recognize?',
        'Then run the meaning test, which is the one that decides. Only one of these four means "not" plus the rest of the word. Watch out for unicorn: it starts with uni-, a different prefix that means one, and corn here is an old word for horn.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-assemble-predict',
      kind: 'try_yourself',
      problem:
        'Read the sentence. "Our science teacher predicted the storm two days before the first raindrop fell." The word predict is built from pre- and the root dict. Which meaning comes from those parts?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'to say something before it happens', correct: true },
        { id: 'b', text: 'to see something before it happens' },
        { id: 'c', text: 'to say something over again' },
        { id: 'd', text: 'to write something down ahead of time' },
      ],
      expectedAnswer: 'to say something before it happens',
      hints: [
        'pre- means before. Now name the root: dict shows up in dictate and in dictionary. What do all of those have in common?',
        'Three of these swap out one part for a different one. Watch for a choice that quietly turns dict into looking or into writing, and for one that turns pre- into re-.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-assemble-unbreakable',
      kind: 'try_yourself',
      problem:
        'Read the sentence. "The company claims the phone case is unbreakable, but Theo dropped his down the stairs and it cracked in two places." Using the word parts, what does unbreakable mean?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'able to be broken' },
        { id: 'b', text: 'full of breaks' },
        { id: 'c', text: 'not able to be broken', correct: true },
        { id: 'd', text: 'broken all over again' },
      ],
      expectedAnswer: 'not able to be broken',
      hints: [
        'Break it into three pieces: un, break, able. Name each one before you put them back together.',
        'Theo\'s case did crack, but that does not change what the word means. It only tells you the company was wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-parts-are-a-guess',
      kind: 'misconception_check',
      question:
        'A student says that awful must mean full of awe, because -ful means full of, and that a suffix only ever changes a word\'s meaning, never its job in the sentence. What would you tell them?',
      commonErrors: [
        {
          answer: 'Awful means full of awe, because that is what the parts say.',
          misconception:
            'Treating word parts as a guarantee instead of a guess, and never running step four. The parts really do read that way, so the student stops before checking the sentence.',
          correctsTo:
            'The parts are honest about the word\'s history. Awful did once mean full of awe. But words drift, and today awful means very bad: "The soup was awful, so I ate cereal instead." Step four exists for exactly this. Assemble your guess from the parts, then check it against the sentence, and when the two disagree the sentence wins. Word parts get you close, they do not get you certain.',
        },
        {
          answer: 'A suffix only changes the meaning. It cannot change the part of speech.',
          misconception:
            'Thinking of a suffix as decoration on the end rather than as something that changes the job the word does in a sentence.',
          correctsTo:
            'Most suffixes change both. Invent is a verb, and adding -tion makes invention, a noun. Agree is a verb, and adding -ment makes agreement, a noun. Color is a noun, and adding -ful makes colorful, an adjective. Harm is a noun, and adding -less makes harmless, an adjective. Quick is an adjective, and adding -ly makes quickly, an adverb. That is why the suffix is worth naming out loud: it tells you what kind of word you are holding.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four steps, every time: break the word, name each part, assemble a rough meaning, then check it against the sentence.',
        'Prefixes go on the front and change meaning: un- not, re- again or back, pre- before, mis- wrongly, dis- not, sub- under, inter- between, non- not.',
        'Suffixes go on the end and usually change the job of the word as well: -less without, -ful full of, -able able to be, -tion and -ment name a thing, -ly makes an adverb, -ist names a person.',
        'Roots carry the core meaning: port carry, dict say, scrib and script write, spect look, aud hear, struct build, tele far, bio life, graph write.',
        'Letters are not parts. Uncle is not un plus cle, misty is not mis plus ty, and restaurant is not re plus staurant. Ask whether the prefix meaning actually fits.',
        'Word parts give you a good guess, not a guarantee. Awful no longer means full of awe. When the parts and the sentence disagree, the sentence wins.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Roots, Prefixes & Suffixes' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
