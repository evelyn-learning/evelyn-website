/**
 * Grade 7 ELA — Vocabulary Acquisition: Context Clues.
 *
 * Procedure-led (CCSS L.7.4a). One four-step routine runs the whole lesson:
 * read past the hard word to the end of the sentence, look for a signal,
 * make a guess, then SUBSTITUTE the guess back in and check. That last step
 * is the one students skip, so every worked example and every hint returns
 * to it.
 *
 * NOTE FOR FUTURE AUTHORS: every target word in this file is a real English
 * word used with its real dictionary meaning, and every sentence around it is
 * original prose written for this lesson. If you add an item, check the word
 * in a dictionary first. An invented word, or a real word given a wrong
 * definition, is the one unrecoverable defect in a context-clues lesson.
 * Target words used here: famished, sturdy, weary, elated, conceal,
 * reluctant, meticulous, abundant, vacant, frigid, wary.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U7_CONTEXT_CLUES: LessonPlan = {
  id: 'evelyn.ms.m7ela.context-clues.v1',
  title: 'Context Clues',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.context-clues',
      standard: 'M7ELA-7.1',
      description:
        'Use the words and sentences around an unfamiliar word as a clue to its meaning, recognizing definition, synonym, contrast and example clues, and confirm the guess by substituting it back into the sentence (CCSS L.7.4a).',
    },
  ],
  prerequisites: ['m7ela.commas-and-end-punctuation'],
  followUps: ['m7ela.roots-prefixes-and-suffixes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the student they already read around unknown words without noticing.',
      script:
        'Read this message from a friend. "I skipped lunch, and by four in the afternoon I was famished. I ate two bowls of cereal standing up at the counter." You may never have seen the word famished before. You still know what it means, and you knew it in about one second. Nothing in that message defined it for you. The cereal did. Skipping lunch did. Your brain grabbed the words around famished and worked backward to hungry, and it did that on its own. Today we are going to slow that down and turn it into a routine you can run on purpose, so that a hard word in a science article stops being a wall.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-clue-types',
      kind: 'concept',
      goal: 'Install the four-step routine, then name the four clue types and the signal words that give each one away.',
      keyIdeas: [
        'RUN THE SAME FOUR STEPS EVERY TIME. Step one, read PAST the hard word all the way to the end of the sentence, and then read the next sentence too. Step two, look for a signal word. Step three, make a guess in your own plain words. Step four, put your guess into the sentence in place of the hard word and read it again. Step four is the one everybody skips, and it is the one that catches a wrong guess.',
        'DEFINITION CLUE: the sentence simply tells you, usually right after a comma or the word "or". "Grandpa built the shelf out of oak because he wanted it sturdy, or strongly built enough to hold a stack of heavy books." The clue hands you the meaning. Sturdy means strongly built. Signals: or, that is, which means, a pair of commas, a dash.',
        'SYNONYM OR RESTATEMENT CLUE: the writer says the same thing again in easier words. "After three soccer games in one day the whole team was weary. Nobody talked, and half of us fell asleep on the bus." Weary means very tired. Nothing announces the clue, so watch for an idea repeated in plainer language.',
        'CONTRAST OR ANTONYM CLUE: the sentence gives you the OPPOSITE, so you flip it. "My sister was elated about the concert tickets, but I was miserable, because I had to stay home." Elated is set against miserable, so elated means very happy. Signals: but, however, unlike, instead, although, on the other hand. When you see one of these, expect the clue to be an opposite and remember to flip it.',
        'EXAMPLE CLUE: the writer lists cases of the word instead of defining it. "My dog will conceal anything he steals, such as a sock under the couch or a tennis ball behind the trash can." Every example is a hiding place, so conceal means to hide. Signals: such as, for instance, including, like, for example.',
        'THE CLUE IS NOT ALWAYS TOUCHING THE WORD. It often sits in the NEXT sentence, and sometimes two sentences later. If the sentence holding the hard word gives you nothing, that does not mean you are stuck. It means you have not read far enough yet.',
      ],
      vocabulary: [
        { term: 'context', definition: 'the words and sentences around a word, which show how it is being used.' },
        { term: 'context clue', definition: 'a piece of information near an unfamiliar word that points to its meaning.' },
        { term: 'signal word', definition: 'a word such as or, but, unlike or such as that tells you which kind of clue is coming.' },
        { term: 'restatement', definition: 'the same idea said a second time in easier words.' },
        { term: 'antonym', definition: 'a word that means the opposite of another word.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-contrast-reluctant',
      kind: 'worked_example',
      problem:
        'What does "reluctant" mean here? "Marcus was reluctant to try the high diving board, but his little sister ran straight off the end of it without stopping."',
      steps: [
        'Step one. Read past the hard word to the end of the sentence. Do not stop at reluctant and panic. The sentence keeps going, and the part after the comma is where the work is.',
        'Step two. Look for a signal. The word "but" is sitting right there, and but is a CONTRAST signal. That tells you the second half of the sentence is the opposite of the first half.',
        'So compare the two halves. The sister ran straight off the end without stopping. She was eager, and she did not hesitate at all. Marcus is the opposite of that.',
        'Step three. Guess in plain words. The opposite of eager is unwilling, or hesitant. Guess: reluctant means unwilling to do something.',
        'Step four, the step people skip. Substitute the guess back in and read the whole thing again. "Marcus was unwilling to try the high diving board, but his little sister ran straight off the end of it without stopping." That reads perfectly, so the guess holds.',
        'Watch what happens if you miss the contrast signal and guess "excited" instead. Substitute it: "Marcus was excited to try the high diving board, but his little sister ran straight off the end of it." Now the word "but" makes no sense, because both halves say the same thing. Step four caught the error. That is the whole reason to do it.',
      ],
      answer:
        'Reluctant means unwilling or hesitant. The contrast signal "but" sets Marcus against a sister who did not hesitate at all.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-next-sentence-meticulous',
      kind: 'worked_example',
      problem:
        'What does "meticulous" mean here? "Our science teacher told us to be meticulous with the measurements. That means lining the ruler up exactly, writing down every digit, and checking each number a second time before you move on."',
      steps: [
        'Step one. Read past the hard word. The first sentence ends without explaining anything, and that is exactly where most students give up. Keep going into the second sentence.',
        'Step two. Look for a signal. "That means" is a DEFINITION signal, and it is doing its job in the sentence AFTER the one with the hard word. The clue was never touching the word at all.',
        'Read what the definition signal introduces. Lining the ruler up exactly. Writing down every digit. Checking each number a second time. All three are about being extremely careful with small details.',
        'Step three. Guess in plain words. Meticulous means very careful about every small detail.',
        'Step four. Substitute and check. "Our science teacher told us to be very careful about every small detail with the measurements." That reads fine, so the guess holds.',
        'One more check worth doing. Meticulous is not the same as slow, even though being meticulous often takes longer. The clue described what you DO, which is check details, not how fast you go. Keep the meaning the clue actually gave you.',
      ],
      answer:
        'Meticulous means extremely careful and exact about small details. The definition clue sat in the next sentence, after "That means".',
      estimatedMinutes: 3,
    },
    {
      id: 'try-example-clue-abundant',
      kind: 'try_yourself',
      problem:
        'What does "abundant" mean in this sentence? "Snacks were abundant at the end-of-season party, including three bowls of chips, two full pizzas, and a cooler packed with drinks."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'left behind and forgotten' },
        { id: 'b', text: 'present in large amounts; more than enough', correct: true },
        { id: 'c', text: 'hard to find, because there was almost none left' },
        { id: 'd', text: 'delicious and freshly made' },
      ],
      expectedAnswer: 'present in large amounts; more than enough',
      hints: [
        'Find the signal word. "Including" tells you an EXAMPLE clue is coming, so read the list and ask what all three items have in common.',
        'The list counts things: three bowls, two pizzas, a packed cooler. It does not say how anything tasted. Substitute each choice into the sentence and keep the one that still makes sense.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-contrast-clue-vacant',
      kind: 'try_yourself',
      problem:
        'What does "vacant" mean in this sentence? "Every seat in the front row was taken, but the two rows behind the drummer stayed vacant for the whole show."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'empty; with nobody in them', correct: true },
        { id: 'b', text: 'full, with somebody in every seat' },
        { id: 'c', text: 'set aside for a break or a holiday' },
        { id: 'd', text: 'broken, so that nobody was allowed to sit there' },
      ],
      expectedAnswer: 'empty; with nobody in them',
      hints: [
        'The signal word is "but", so this is a contrast clue. Whatever the front row was, those two rows were the opposite of it.',
        'The front row was TAKEN. Flip that. And be careful: the sentence never says why those rows stayed that way, so any choice that gives a reason is going past the evidence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-next-sentence-frigid',
      kind: 'try_yourself',
      problem:
        'What does "frigid" mean in this passage? "Ms. Okafor propped the classroom door open in January and the room went frigid. We kept our coats zipped up all period, and I could see my own breath when I answered a question."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'stiff and hard to bend' },
        { id: 'b', text: 'warm and stuffy' },
        { id: 'c', text: 'extremely cold', correct: true },
        { id: 'd', text: 'quiet and uncomfortable' },
      ],
      expectedAnswer: 'extremely cold',
      hints: [
        'The first sentence does not explain frigid, so read on. The clue is in the second sentence.',
        'Zipped coats and visible breath point at one thing only. Choice a is what "rigid" means, and frigid only LOOKS like rigid, which is not evidence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-lookalike-and-adjacent-clue',
      kind: 'misconception_check',
      question:
        'A student reads this: "The stray cat was wary of us at first. It would not come near the bowl until we backed away, sat down and stayed completely still for ten minutes." The student says wary means tired, because wary looks almost exactly like weary. Are they right?',
      commonErrors: [
        {
          answer: 'Yes, wary means tired, because wary looks almost exactly like weary.',
          misconception:
            'Treating two words that LOOK alike as words that mean alike. Similar spelling feels like strong evidence, so the student stops reading and never tests the guess.',
          correctsTo:
            'Spelling is not evidence. Wary means careful and watchful because you think something might be dangerous. Weary means very tired. They are two different words that happen to sit one letter apart. Run step four and the error shows up immediately. Substitute tired: "The stray cat was tired of us at first. It would not come near the bowl until we backed away and stayed still." A tired cat has no reason to wait for you to back away. Now substitute careful: "The stray cat was careful around us at first. It would not come near the bowl until we backed away and stayed still." That fits every detail. When a word reminds you of another word, treat it as a hunch to test, never as an answer.',
        },
        {
          answer: 'You cannot tell what wary means, because the sentence with wary in it never explains it.',
          misconception:
            'Believing the clue has to be right next to the word, so the student declares themselves stuck the moment the first sentence comes up empty.',
          correctsTo:
            'The clue is often in the NEXT sentence, and here it is. The second sentence says the cat would not come near until people backed away and held still for ten minutes. That is a cat watching for danger. Not knowing a word is not the same as being stuck. Read past it, read the sentence after it, then guess and substitute.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four steps, every time: read past the word to the end of the sentence, look for a signal, guess in plain words, then substitute the guess back in and check.',
        'Step four is the one that catches wrong guesses. If the sentence stops making sense with your guess inside it, the guess is wrong.',
        'Definition clue signals: or, that is, which means, a dash or a pair of commas.',
        'Contrast clue signals: but, however, unlike, instead, although. These mean the clue is an OPPOSITE, so flip it.',
        'Example clue signals: such as, for instance, including, like. Ask what all the examples have in common.',
        'The clue is often in the next sentence, not beside the word, and a word that merely looks like a word you know does not have to mean the same thing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Context Clues' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
