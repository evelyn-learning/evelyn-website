/**
 * Grade 7 ELA — Narrative Writing: Narrative Technique.
 *
 * The writer's side of Unit 1.3 (CCSS W.7.3b, W.7.3d). Unit 1.3 taught
 * students to READ the detail that proves a trait; this row teaches them to
 * PRODUCE it. Three techniques, one organizing rule: show, do not tell.
 * Dialogue that does a job (punctuated correctly), pacing that slows at the
 * moment that matters, and one precise word in place of three vague ones.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence, scene and character in this file
 * is original prose written for the item. This course carries no passage
 * machinery — no passageId, no shared texts — so each question must be
 * solvable from the words printed inside it, and no published work may be
 * quoted or closely paraphrased. All practice items are revision-choice
 * MCQs; there are no writing prompts and no free-response tasks.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U9_NARRATIVE_TECHNIQUE: LessonPlan = {
  id: 'evelyn.ms.m7ela.narrative-technique.v1',
  title: 'Narrative Technique',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.narrative-technique',
      standard: 'M7ELA-9.4',
      description:
        'Use narrative techniques - dialogue, pacing and description - to develop experiences, events and characters, replacing sentences that tell a feeling with concrete sensory detail, punctuating dialogue correctly, slowing the pace at the moment that matters, and choosing precise words in place of vague ones (CCSS W.7.3b, W.7.3d).',
    },
  ],
  prerequisites: ['m7ela.transitions-and-cohesion'],
  followUps: ['m7ela.research-questions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Feel the gap between a story that reports a game and a story that puts you inside it, so the lesson is about a difference the student already hears.',
      script:
        'Two friends tell you about the same soccer game. The first one says, "It was a really exciting game and everyone was nervous." You nod. You have already stopped listening. The second one says, "Nobody on our bench sat down for the last four minutes. Priya took the free kick and I watched the goalie step the wrong way." Now you are in it. Both friends had the same facts. The second one gave you details instead of labels, and your brain did the rest. Writers have three main tools for pulling that off: dialogue, pacing and description. Today you learn all three, and the one rule that runs underneath them - show, do not tell.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-narrative-technique',
      kind: 'concept',
      goal: 'Establish show-not-tell as the organizing rule, then the three techniques that carry it out: description, dialogue with correct punctuation, and pacing, plus precise word choice.',
      keyIdeas: [
        'SHOW, DO NOT TELL IS THE WHOLE LESSON - a telling sentence names the feeling for the reader ("She was nervous."). A showing sentence gives the detail that proves the feeling and lets the reader name it ("She read the first line of her speech, then read it again, and the paper shook a little in her hand."). The test is simple: cross out the feeling word. If nothing is left standing, you told. If a picture is left standing, you showed.',
        'THIS IS UNIT 1.3 TURNED AROUND - in "How Writers Build Characters" you were the reader, hunting for the detail that proved a trait. Now you are the writer who has to plant that detail. Same five moves, other direction: what a character says, does, thinks, looks like, and how others react. If a reader could point at your line and say "that proves it", you did your job.',
        'DIALOGUE MUST DO A JOB - real people chat about the weather, but story dialogue earns its space by revealing character or moving the story forward. "Hi, how are you?" does neither. "It\'s fine. Just don\'t touch the fins - I\'ll do that part." reveals someone who is upset and covering it. PUNCTUATION, three rules that always hold: (1) the comma goes INSIDE the closing quotation mark, before the tag - CORRECT: "I already fed him," Rosa said. WRONG: "I already fed him." Rosa said. (2) A question mark replaces that comma and also stays inside - CORRECT: "Did you feed him?" Rosa asked. (3) START A NEW PARAGRAPH EVERY TIME THE SPEAKER CHANGES, so the reader never has to guess who is talking.',
        'PACING IS WHERE YOU SPEND YOUR SENTENCES - the important moment gets slowed down with detail, beat by beat. The unimportant parts get summarized and skipped past in a sentence: "The bus ride and the warm-up passed in a blur." Giving every part of a story the same amount of space is the most common pacing mistake, and it makes the big moment feel like nothing happened. Ask which second of your story matters most, then spend the most words there.',
        'ONE PRECISE WORD BEATS THREE VAGUE ONES - "walked" is a word that tells you almost nothing. Shuffled, trudged, bolted and crept each carry a whole mood inside them. The same goes for nouns: "dog" is empty, "a soaked terrier" is a picture. Do not fix a weak sentence by stacking adjectives on it. A pile like "a big, scary, huge, loud dog" is weaker than "a Rottweiler dragging its owner up the sidewalk", because the pile still gives the reader nothing to see.',
      ],
      vocabulary: [
        { term: 'narrative technique', definition: 'a tool a story writer uses to develop an event or a character, such as dialogue, pacing or description.' },
        { term: 'show, do not tell', definition: 'giving the reader the concrete detail that proves a feeling instead of naming the feeling outright.' },
        { term: 'sensory detail', definition: 'a detail a reader can see, hear, smell, taste or feel.' },
        { term: 'dialogue tag', definition: 'the short phrase that names the speaker, such as Rosa said or he asked.' },
        { term: 'pacing', definition: 'how fast a story moves - how many words a writer spends on each part of it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-show-not-tell',
      kind: 'worked_example',
      problem:
        'Revise this telling sentence so that it shows instead.\n\n"Ellie was excited when she saw the puppy in the window."',
      steps: [
        'Name the feeling the sentence is telling: excited. That word is about to become forbidden, because the reader is supposed to supply it.',
        'Ask what a body actually does when it feels that. Excitement is fast and loud. It grabs. It repeats itself. It forgets to be cool in front of other people.',
        'Pick ONE or TWO concrete details, not five. "Ellie hit the glass with both hands." "She said the same three words to her mom four times."',
        'Upgrade the verbs while you are here. Ellie did not walk to the window, and she did not go to the window. She BOLTED to the window. One precise verb does the work that "walked quickly and happily" was trying to do.',
        'Write the revision and then run the test - cross out any word that names the feeling. Nothing should collapse. "Ellie bolted to the window and pressed both hands flat against the glass. \'Mom. Mom. Look at him,\' she said, and she said it again before her mom got there." The word excited never appears, and no reader will miss it.',
        'WRONG revision to avoid: "Ellie was very excited and felt really happy when she saw the cute little puppy in the window." That is the original sentence wearing extra adjectives. It still tells, and now it is longer.',
      ],
      answer:
        'STRONG revision: "Ellie bolted to the window and pressed both hands flat against the glass. \'Mom. Mom. Look at him,\' she said, and she said it again before her mom got there." The feeling word is gone, one precise verb (bolted) replaced a vague one, and the reader supplies "excited" without being asked.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dialogue-and-pacing',
      kind: 'worked_example',
      problem:
        'This draft covers the right events but spends its words in the wrong places, and its dialogue is doing no work. Fix the pacing, make the dialogue reveal something, and punctuate it correctly.\n\nWEAK draft: "The bus ride to the field took forty minutes and I counted eleven red cars and ate half a bag of pretzels and the seat by the window was warm. Then we warmed up for twenty minutes and did passing drills. At the end of the game I caught the ball and we won. Dad was proud."',
      steps: [
        'First decide which second of this story matters most. It is the catch. Everything before it is transportation, and the draft spends three quarters of its words there.',
        'Summarize the unimportant part in one short sentence and move on: "The ride and the drills passed in a blur." That is pacing speeding up, and it costs you nothing, because nobody came for the pretzels.',
        'Now slow the catch down, beat by beat, using details a reader can see and feel. One sentence becomes four: "The ball came down out of the lights. I lost it, found it again, and it slapped into my palms harder than I expected. I closed both hands. I did not let go until the whistle."',
        'Look at "Dad was proud." That is telling, and it is the last line, which is the worst place to tell. Replace it with dialogue that does a job. "Dad was proud" becomes something only Dad would say.',
        'Punctuate that dialogue correctly. CORRECT: "You held on," Dad said. The comma sits INSIDE the closing quotation mark and the tag begins with a lowercase d. WRONG: "You held on." Dad said. - a period there ends the sentence, so the tag is left stranded with nothing to attach to.',
        'If anyone answers him, that answer starts a NEW PARAGRAPH, because the speaker changed:\n\n"You held on," Dad said.\n\n"I know," I said. "I know."\n\nNotice that the second speaker gets his own line, and that repeating "I know" reveals more than "I was happy" ever would.',
      ],
      answer:
        'STRONG revision: "The ride and the drills passed in a blur. Then the ball came down out of the lights. I lost it, found it again, and it slapped into my palms harder than I expected. I closed both hands. I did not let go until the whistle.\n\n\'You held on,\' Dad said.\n\n\'I know,\' I said. \'I know.\'" - the unimportant part is summarized in one sentence, the important moment is stretched across four, the dialogue reveals instead of chatting, the comma sits inside the quotation mark before the tag, and the new speaker starts a new paragraph.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-revise-telling-sentence',
      kind: 'try_yourself',
      problem:
        'A student wrote this telling sentence about a school talent show: "Marcus was nervous while he waited backstage for his turn."\n\nWhich revision SHOWS that Marcus is nervous instead of telling it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Marcus felt very nervous, and he was really anxious, while he waited backstage for his turn.' },
        { id: 'b', text: 'Marcus was a nervous, jumpy, worried, uneasy boy waiting backstage for his turn.' },
        { id: 'c', text: 'Marcus read the first line of his poem, then read it again, and the paper shook a little in his hand.', correct: true },
        { id: 'd', text: 'Marcus laughed with the drummers backstage and asked the teacher if he could please go first.' },
      ],
      expectedAnswer: 'Marcus read the first line of his poem, then read it again, and the paper shook a little in his hand.',
      hints: [
        'Cross out every word that names a feeling. Which choice still leaves a picture standing?',
        'One choice adds adjectives, one repeats the feeling word, and one shows a boy who cannot wait to get on stage. Only one gives you a detail that proves nerves.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-dialogue-that-reveals',
      kind: 'try_yourself',
      problem:
        'Dev knocked Priya\'s model rocket off the shelf and snapped one of the fins. They are picking up the pieces together.\n\nWhich line of Priya\'s dialogue reveals the most about her?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"Hey, Dev. How was your weekend?"' },
        { id: 'b', text: '"It\'s fine. It\'s fine. Just don\'t touch the fins, okay? I\'ll do that part."', correct: true },
        { id: 'c', text: '"You knocked my model rocket off the shelf and one of the fins broke."' },
        { id: 'd', text: '"They said it might rain again on Saturday."' },
      ],
      expectedAnswer: '"It\'s fine. It\'s fine. Just don\'t touch the fins, okay? I\'ll do that part."',
      hints: [
        'Story dialogue has to do a job: reveal character or move the story. Two of these choices are small talk that any person could say in any scene.',
        'One choice only repeats what the reader already watched happen. The remaining choice shows someone saying she is fine while making sure Dev does not touch anything.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pacing-choice',
      kind: 'try_yourself',
      problem:
        'Kai is writing about the day he caught the last pass of the season. The catch is the moment that matters. The bus ride and the warm-up drills are not.\n\nWhich version paces the moment best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bus ride took forty minutes. I counted eleven red cars and finished half a bag of pretzels. The window seat was warm and the heater rattled. Then the game happened and I caught the ball.' },
        { id: 'b', text: 'The ride and the drills passed in a blur. Then the ball came down out of the lights. I lost it, found it again, and it slapped into my palms harder than I expected. I closed both hands and did not let go until the whistle.', correct: true },
        { id: 'c', text: 'The bus ride took forty minutes and the seats were warm. The warm-up drills took twenty minutes and my hands were cold. The last play took four seconds and I caught the ball.' },
        { id: 'd', text: 'It was a really exciting game, and at the end I caught the ball and we won, which made everyone happy.' },
      ],
      expectedAnswer: 'The ride and the drills passed in a blur. Then the ball came down out of the lights. I lost it, found it again, and it slapped into my palms harder than I expected. I closed both hands and did not let go until the whistle.',
      hints: [
        'Count the sentences each version spends on the catch, and the sentences it spends on the bus.',
        'One version is slow in the wrong place, one gives every part the same amount of space, and one summarizes the big moment and then tells you it was exciting.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-adjectives-and-telling',
      kind: 'misconception_check',
      question:
        'A student is told her scene is flat, so she revises "The dog ran at us" into "The big, scary, huge, terrifying dog ran at us very fast." She says the description is stronger now because it has more describing words. What went wrong?',
      commonErrors: [
        {
          answer: 'More adjectives means better description.',
          misconception:
            'Treating description as a quantity of adjectives, so the fix is to stack more feeling-words onto a vague noun instead of replacing it with a specific one.',
          correctsTo:
            'Big, scary, huge and terrifying are four labels and zero pictures - and two of them mean nearly the same thing. One precise noun or verb usually beats three adjectives. "A Rottweiler dragging its owner up the sidewalk" puts something in the reader\'s head, and it never uses the word scary. Same with the verb: ran is vague, but bolted, charged and lunged each carry a mood inside them. Cut the pile, choose the exact word, and add one concrete detail a reader could see.',
        },
        {
          answer: 'Telling the reader the feeling is faster, so it is better writing.',
          misconception:
            'Confusing fast with effective - saving words by naming the emotion, which hands the reader a label instead of an experience.',
          correctsTo:
            'It is faster, and that is exactly the problem. "She was nervous" takes three words and does nothing to the reader, because being told a feeling is not the same as feeling it. Showing costs more words, so you spend them where they count: slow down and show at the moment that matters, and summarize the parts that do not. That is pacing and showing working together, and it is why a whole bus ride can be one sentence while four seconds of a catch takes four.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Show, do not tell. Cross out the feeling word - if a picture is still standing, you showed it.',
        'This is Unit 1.3 from the other side: as a reader you hunted for the detail that proved a trait, and as a writer you have to plant it.',
        'Dialogue must reveal character or move the story. Punctuate it right: the comma goes inside the closing quotation mark before the tag, and a new speaker always starts a new paragraph.',
        'Pacing is where you spend your sentences. Slow down at the moment that matters, summarize the parts that do not, and never give every part the same amount of space.',
        'One precise word beats three vague ones. Trade walked for shuffled, trudged or bolted, and never fix a flat sentence by stacking adjectives on it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Narrative Technique' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
