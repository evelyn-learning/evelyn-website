/**
 * Grade 7 ELA — Reading Literature: Figurative Language.
 *
 * Simile, metaphor, personification, hyperbole and idiom (CCSS RL.7.4).
 * The lesson pushes past labeling: RL.7.4 asks what a figure MEANS and what
 * it does to the reader, so every item ends on the quality that crosses from
 * one thing to the other. The four traps it names are the ones that break
 * later work — calling every comparison a metaphor, reading the word "is" as
 * a metaphor signal, calling any verb personification, and treating hyperbole
 * as a lie.
 *
 * NOTE FOR FUTURE AUTHORS: every line quoted in this file is original prose
 * written for the item. Figurative-language lessons are the single easiest
 * place to reach for a famous line — do not. No lyrics, no published poems,
 * no book passages, no borrowed similes. This course also carries no passage
 * machinery, so each question must be solvable from the words printed inside
 * it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U2_FIGURATIVE_LANGUAGE: LessonPlan = {
  id: 'evelyn.ms.m7ela.figurative-language.v1',
  title: 'Figurative Language',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.figurative-language',
      standard: 'M7ELA-2.3',
      description:
        'Identify simile, metaphor, personification, hyperbole and idiom in a sentence, and explain what each figure MEANS and what it does to the reader by naming the two things compared and the one quality that crosses between them (CCSS RL.7.4).',
    },
  ],
  prerequisites: ['m7ela.point-of-view'],
  followUps: ['m7ela.tone-mood-and-word-choice'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already reads figurative language every day, so the lesson only names a habit they own.',
      script:
        'Your friend wins three rounds in a row and the group chat says he is on fire. Nobody grabs a bucket. You tell your mom you are starving and she does not call a doctor. Somebody says the science room was a zoo today, and you can picture it perfectly without a single animal being in the building. Not one of those sentences is true if you read it word for word, and every single one of them tells you something exact. That is the trade figurative language makes. Here is the part that catches people out. The question is almost never just what is this called. The question is what does it actually tell me. Today we name the five kinds you will meet most often, and then we practice the harder half: saying what each one means and why the writer picked it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-figures',
      kind: 'concept',
      goal: 'Name the five figures, give each a test that does not misfire, and make meaning-plus-effect the real answer.',
      keyIdeas: [
        'FIGURATIVE LANGUAGE MEANS THE WORDS ARE NOT LITERALLY TRUE, AND THAT IS ON PURPOSE. Your job has two halves. Half one is the name: simile, metaphor, personification, hyperbole, idiom. Half two is the half that actually counts: what is this really telling me, and why is it better than the plain version? An answer that stops at the name has done half the work.',
        'SIMILE — a comparison between two UNLIKE things, flagged by the word like or the word as. "The bench at the bus stop was as cold as a can straight out of the fridge." The signal word keeps the two things side by side. Careful, though: like and as do not always make a simile. "Nia sings like her brother" compares a singer to a singer. Those are two things of the same kind, so nothing has to cross a gap, and that is a plain comparison, not a figure.',
        'METAPHOR — a comparison that skips the signal word and says one thing IS the other. "My little brother is a car alarm." The two things still have to be UNLIKE, and that is the part students drop. The word is does not make a metaphor by itself. "The car is a Honda" uses is, and it is literally true, because a Honda is simply what kind of car it is. Nothing was compared, so that sentence is not a figure at all.',
        'PERSONIFICATION — giving a HUMAN quality to something that is not human. The test is the word itself: does it need a mind, a mood or a body? "The wind blew all night" is literal, because blowing is just what wind does. "The wind complained all night" is personification, because only something with feelings can complain. Just any verb is not enough. The verb has to be a human one.',
        'HYPERBOLE AND IDIOM — HYPERBOLE is exaggeration on purpose, stretched so far that nobody is meant to believe it: "This backpack weighs more than the school." It is not a lie and it is not a mistake. The writer knows the number is false and so do you, and the size of the stretch tells you the size of the feeling. IDIOM is a phrase whose meaning the language agreed on long ago, and you cannot build that meaning out of the words in it: "spill the beans" means tell the secret, and there are no beans anywhere.',
        'THE MEANING TEST — three questions, every time. What is being described? What is it compared to? WHICH ONE quality crosses over? "My little brother is a car alarm" carries loud, sudden and impossible to ignore. It does not carry batteries, wires or a red flashing light. Picking the one quality that fits is the reading. Naming the figure is only the label on the front.',
      ],
      vocabulary: [
        { term: 'figurative language', definition: 'words that mean something other than what they literally say, usually by comparing or exaggerating.' },
        { term: 'simile', definition: 'a comparison between two unlike things that uses like or as.' },
        { term: 'metaphor', definition: 'a comparison that says one thing is another, unlike thing, with no like or as.' },
        { term: 'personification', definition: 'giving a human quality, feeling or action to something that is not human.' },
        { term: 'hyperbole', definition: 'exaggeration used on purpose, so big that nobody is meant to believe it.' },
        { term: 'idiom', definition: 'a common phrase whose meaning cannot be worked out from the words in it, such as spill the beans.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-interpret-metaphor',
      kind: 'worked_example',
      problem:
        'Name the figure, then say what it actually tells you.\n\n"On the hill behind the school, our old van was a turtle."',
      steps: [
        'Check for a signal word first, because that is the fastest split. There is no like and no as anywhere in the line. The line says the van WAS a turtle, so this is a metaphor, not a simile.',
        'Now check that the two things are unlike, because the word was on its own does not prove anything. A van is a machine. A turtle is an animal. Nothing puts them in the same group, so a real comparison is happening.',
        'Name both sides out loud. The thing being described is the van. The thing it is compared to is a turtle.',
        'Here is the part that actually answers the question: which ONE quality crosses over? Turtles are famously slow. A tired old van on a hill is slow. Slowness is the quality being handed to the van.',
        'Check what does NOT cross over, so you do not overreach. Nobody is saying the van is green, or has a shell, or lives near a pond. Choosing only the quality that fits is your job as the reader.',
        'Finish with the meaning and then the effect. Meaning: the van crawled up that hill. Effect: "was a turtle" makes you see the crawl, and it is a little bit funny, which tells you the narrator likes the old van instead of being angry at it. "The van was slow" would say the fact and lose all of that.',
      ],
      answer:
        'Metaphor. The van is compared to a turtle, and the quality that crosses over is slowness, so the meaning is that the van crawled up the hill. The picture is gentle and a bit funny, so the narrator sounds fond of the old van rather than annoyed by it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-two-errors',
      kind: 'worked_example',
      problem:
        'A student reads the line below and writes: "This is a simile, because the fridge is compared to a person. Also it is wrong, because a fridge cannot be in a bad mood." Two things went wrong. Find both and fix them.\n\n"The old fridge grumbled all night and refused to settle down."',
      steps: [
        'Test the label before anything else. A simile needs the word like or the word as. Read the line again. Neither one is in it. So simile is the wrong name, and the reason the student reached for it is that any comparison feels like a simile once you notice it.',
        'Find the right name. Grumbling needs a voice and a mood. Refusing needs a choice. Both of those belong to people, and the writer handed both of them to a fridge. That is personification.',
        'Watch the trap going the other way. Not every verb counts. WRONG: "The old fridge buzzed all night" is personification. CORRECT: that sentence is literal, because a buzz is just a noise a machine makes. The test is whether the word needs a mind or a mood, not whether the word is a verb.',
        'Now the second error. "A fridge cannot be in a bad mood" is completely true, and it helps nobody. The writer never claimed the fridge has feelings. Judging a figure by whether it is literally true is the fastest way to walk straight past what it says.',
        'Ask the meaning question instead. What does human grumpiness lend the fridge? A noise that keeps going, that changes, and that somehow feels like it is doing it on purpose.',
        'Put the whole answer together: it is personification, and it tells you the fridge was loud and stubborn all night long. Because the narrator makes the fridge sound like it is being difficult on purpose, you also learn that the narrator was lying there awake listening to every sound of it.',
      ],
      answer:
        'It is personification, not a simile, because there is no like or as and because grumbled and refused are human words. And a figure is never judged by whether it is literally true: the human grumpiness makes the fridge sound loud, stubborn and impossible to ignore, which tells you the narrator was awake all night listening to it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-meaning-of-metaphor',
      kind: 'try_yourself',
      problem:
        'Read the sentence, then choose what the metaphor tells you.\n\n"By the fourth quarter, our ten-point lead was an ice cube in July."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The lead was shrinking fast and was not going to last.', correct: true },
        { id: 'b', text: 'The game was played outdoors in hot weather.' },
        { id: 'c', text: 'The lead was small from the very beginning.' },
        { id: 'd', text: 'The team stopped trying in the fourth quarter.' },
      ],
      expectedAnswer: 'The lead was shrinking fast and was not going to last.',
      hints: [
        'Name both sides first. The thing being described is the lead. The thing it is compared to is an ice cube in July.',
        'Ask what happens to an ice cube in July, and how quickly. That is the one quality crossing over to the lead.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-personification',
      kind: 'try_yourself',
      problem: 'Which sentence uses personification?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The old furnace was as loud as a leaf blower.' },
        { id: 'b', text: 'The old furnace switched on at six every morning.' },
        { id: 'c', text: 'The old furnace groaned twice and then gave up for the night.', correct: true },
        { id: 'd', text: 'I have asked Dad to fix that furnace a thousand times.' },
      ],
      expectedAnswer: 'The old furnace groaned twice and then gave up for the night.',
      hints: [
        'Three of these are a simile, a plain literal sentence and a hyperbole. Sort those three out first and see what is left.',
        'Personification needs a HUMAN quality, not just any verb. Switching on is what a furnace does by itself. Which sentence gives the furnace something only a person can do?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-metaphor-versus-literal-is',
      kind: 'try_yourself',
      problem: 'Which sentence is a metaphor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'On group projects, Emre works like a machine.' },
        { id: 'b', text: 'On group projects, Emre is the glue.', correct: true },
        { id: 'c', text: 'The bike Emre rides is a mountain bike.' },
        { id: 'd', text: 'Emre says our project took forever.' },
      ],
      expectedAnswer: 'On group projects, Emre is the glue.',
      hints: [
        'Cross out any sentence that uses like or as. That one is a simile, so it cannot be the answer here.',
        'The word is does not make a metaphor on its own. One sentence left over uses is and is simply true, word for word. A metaphor has to join two UNLIKE things.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-every-comparison-is-a-metaphor',
      kind: 'misconception_check',
      question:
        'A student writes two labels. Label 1: "The car is a Honda" is a metaphor, because it uses the word is. Label 2: "Nia fought like a tiger" is a metaphor, because it compares two things. What went wrong in each one?',
      commonErrors: [
        {
          answer: '"The car is a Honda" is a metaphor, because it uses the word is.',
          misconception:
            'Treating the word is as the thing that makes a metaphor, without checking whether the two things it joins are actually unlike.',
          correctsTo:
            'A metaphor joins two UNLIKE things and says one of them is the other, which is exactly why a metaphor can never be true word for word. A car and a Honda are the same kind of thing, because Honda is simply what kind of car it is. Nothing crossed a gap, so nothing was compared, and the sentence is a plain fact. Use this test: could the sentence be true word for word? "The car is a Honda" can, so it is literal. "My little brother is a car alarm" cannot, so that one is the metaphor.',
        },
        {
          answer: '"Nia fought like a tiger" is a metaphor, because it compares two things.',
          misconception:
            'Calling every comparison a metaphor. Simile and metaphor both compare, so comparing is not what separates them. What separates them is the signal word.',
          correctsTo:
            'A comparison that uses like or as is a SIMILE. "Nia fought like a tiger" has the word like sitting right there, so it is a simile. Take the signal word out and rewrite it as "Nia was a tiger in that game" and now you have the metaphor. Then do the half that matters: either version hands Nia one quality of a tiger, which is fierce and fearless attacking, so the sentence is telling you how hard she played. It is not telling you anything about how she looked.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simile compares two unlike things using like or as. Metaphor says one thing IS the other, with no like or as.',
        'The word is does not make a metaphor. "The car is a Honda" is a plain fact. A metaphor has to join two UNLIKE things.',
        'Personification gives a human quality to something not human. The wind blowing is literal. The wind complaining is personification.',
        'Hyperbole is exaggeration on purpose, too big to believe, and it is neither a lie nor a mistake. An idiom is a phrase whose meaning you cannot build out of its words.',
        'Naming the figure is only half the answer. Say which one quality crosses over, and say what that tells you about the thing being described.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Figurative Language' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
