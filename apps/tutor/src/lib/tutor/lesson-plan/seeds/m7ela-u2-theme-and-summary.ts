/**
 * Grade 7 ELA — Reading Literature: Theme & Objective Summary.
 *
 * Two linked skills that always travel together (CCSS RL.7.2). A THEME is a
 * complete idea about life that the whole story supports — never a one-word
 * topic, never a command, and almost never printed in the text. An OBJECTIVE
 * SUMMARY retells the important events in order, in the student's own words,
 * with no opinion smuggled in. The four errors this lesson hunts: theme as a
 * one-word topic, theme as a moral order, summary as a retelling of every
 * detail, and summary with a reaction hidden inside it.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences printed
 * inside it, and no published work may be quoted or closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U2_THEME_AND_SUMMARY: LessonPlan = {
  id: 'evelyn.ms.m7ela.theme-and-summary.v1',
  title: 'Theme & Objective Summary',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.theme-and-summary',
      standard: 'M7ELA-2.1',
      description:
        'Determine the theme of a story and state it as a complete idea about life rather than a one-word topic or a command, trace how the story develops that idea, and write an objective summary that retells the important events in order without opinion (CCSS RL.7.2).',
    },
  ],
  prerequisites: ['m7ela.setting-and-story-elements'],
  followUps: ['m7ela.point-of-view'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use two friends arguing about the same show to split what a story is ABOUT from what a story SAYS, and to split summary from reaction.',
      script:
        'Two friends finish the same show. One says it was about a kid and his dog. The other says it was about how you never notice you are lucky until the lucky part is over. Neither one is wrong. They are answering two different questions. The first friend named the SUBJECT. The second said what the show argues about being alive. That second answer is the theme, and it is the thing the writer actually built the whole story to hand you. Then a third friend walks up who missed it and asks what happened. That answer is a summary, and it is a different job again. Today we do both, and we learn to keep our own opinions out of the second one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-theme-and-summary',
      kind: 'concept',
      goal: 'Separate topic from theme, give a way to build a theme sentence, rule out the moral-as-command, and set the three rules of an objective summary.',
      keyIdeas: [
        'A TOPIC IS ONE WORD. A THEME IS A WHOLE SENTENCE. "Friendship" is a topic — it names the subject the story keeps circling and stops there. "Real friends tell you the truth even when it costs them something" is a theme, because it says what the story claims about friendship. If your answer fits on a sticky note as one word, you have named the room and not what happened inside it.',
        'BUILD THE THEME SENTENCE FROM THE CHANGE — ask two questions. What does the main character learn, or fail to learn, by the end? And what did it cost them? Answer both in one sentence about people in general, not about that one character. "Nina learned to share" is about Nina. "Sharing something you were saving is easier than explaining why you saved it" is a theme.',
        'A THEME OBSERVES. IT DOES NOT GIVE ORDERS. "Always be honest" and "Never give up" are commands, and a story does not bark commands at you. Watch for the words always and never at the front of your sentence. If you find one, you have written a moral, not a theme. Rewrite it as something the story shows about how life works.',
        'THE THEME IS ALMOST NEVER PRINTED IN THE STORY — you will not find a sentence to underline. You build the theme yourself out of what changed, how the trouble ended, and what the story kept coming back to. Then you check it: which exact moments force this reading? If you cannot point at any, the theme came from your head and not from the page.',
        'AN OBJECTIVE SUMMARY HAS THREE RULES — retell the IMPORTANT events IN ORDER, put them in YOUR OWN WORDS, and add NO opinion. Objective means the story could not tell you were the one writing it. No "I think", no "the best part", no "it got boring in the middle", no advice for the characters.',
        'A SUMMARY IS NOT A RETELLING OF EVERYTHING. Test each detail one at a time: if I cut this, does the ending still make sense? The color of the jacket goes. The reason the door was left open stays. A summary of a whole story is a few sentences, not a play-by-play, and it always includes how things turned out.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'the subject a story keeps returning to, named in a word or two, such as courage or jealousy.' },
        { term: 'theme', definition: 'a complete idea about life that the story supports, written as a full sentence.' },
        { term: 'moral', definition: 'a command or piece of advice, such as "always tell the truth". A moral is not a theme.' },
        { term: 'objective summary', definition: 'a short retelling of the important events, in order and in your own words, with no opinion in it.' },
        { term: 'objective', definition: 'sticking to what actually happened, without your feelings or judgments mixed in.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build-a-theme',
      kind: 'worked_example',
      problem:
        'Build a theme statement for this story.\n\n"For two years Rosa let her little brother win every game of chess. The week he finally beat her for real, he did not believe it. He asked her to play again so he could be sure. She won that second game, and he grinned the whole way home."',
      steps: [
        'Name the topic first, in a word or two. This story keeps circling kindness, or more exactly protecting someone. That is the subject. It is not the theme yet, because it makes no claim.',
        'Ask what changed. At the start Rosa is handing her brother wins he did not earn. At the end he has a win he did earn, and a loss right after it, and the loss is the thing that makes him grin.',
        'Ask what it cost. Two years of easy wins cost him the ability to trust a real one. He needed a second game, and a real loss, before the win felt true.',
        'Now write one sentence about people, not about Rosa. Protecting someone from losing can also take away their ability to believe a real win.',
        'Run the command test. The sentence does not start with always or never, and it does not tell anybody what to do. It says what the story shows happening. That is a theme.',
        'Prove it from the page. "Let her little brother win every game" for two years, "he did not believe it", "asked her to play again so he could be sure", and the grin that arrives only after a fair loss. Every step of the sentence has a line under it.',
        'Compare a weaker answer. "The theme is chess" names the setting. "Always let little kids win" is a command and the story does not even support it. Both stop before the idea.',
      ],
      answer:
        'Theme: protecting someone from losing can take away their ability to believe a real win. Evidence: two years of handed-over wins, his refusal to believe the real one, his demand for a second game, and the grin that comes only after a fair loss.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-the-summary',
      kind: 'worked_example',
      problem:
        'Fix this summary.\n\nStory: "Marcus joined the school garden club because his friend Dae did. He hated the mud and complained for a whole month. When the tomatoes came up in June, Marcus was the one still showing up on Saturdays, even after Dae quit."\n\nStudent summary: "This story was kind of slow. Marcus joins a garden club with his friend Dae, who wears a cool jacket. He complains a lot, which honestly got annoying. Then tomatoes."',
      steps: [
        'Hunt the opinions first and cross them out. "Kind of slow" is a judgment about the story. "Which honestly got annoying" is a reaction. Neither one is something that happened, so neither belongs.',
        'Hunt the invented detail. The jacket is not in the story at all. A summary can only carry what the text actually says.',
        'Hunt the detail that does not matter. Even if the jacket were in the story, cut it and the ending still makes sense, so it goes either way.',
        'Check whether the summary reaches the end. It stops at "then tomatoes". The most important event is missing: Marcus keeps coming after Dae quits. A summary that skips how things turned out is not finished.',
        'Rebuild it in order, in your own words: why he joined, how he acted at first, what changed, and where it ended.',
        'WRONG: "This story was kind of slow. Marcus joins a garden club with his friend Dae, who wears a cool jacket. He complains a lot, which honestly got annoying. Then tomatoes." CORRECT: "Marcus joins the school garden club to be with his friend Dae. He dislikes the work at first and complains for a month. After the tomatoes come up in June, he keeps showing up on Saturdays, even after Dae quits."',
        'Read the fixed version back and ask one question: could anyone tell who wrote this? No. That is what objective means.',
      ],
      answer:
        'Marcus joins the school garden club to be with his friend Dae. He dislikes the work at first and complains for a month. After the tomatoes come up in June, he keeps showing up on Saturdays, even after Dae quits.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-theme-not-topic',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the statement that is a THEME.\n\n"Every Friday Nell traded half her sandwich for Owen\'s chips. The week Owen forgot his lunch four days running, Nell kept handing over half her sandwich and said she was not that hungry anyway. Owen never asked why the trade had stopped being a trade."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sharing.' },
        { id: 'b', text: 'Real kindness often hides itself so the other person can accept it.', correct: true },
        { id: 'c', text: 'Always share your lunch with a friend who forgot theirs.' },
        { id: 'd', text: 'Nell gives Owen half of her sandwich every Friday.' },
      ],
      expectedAnswer: 'Real kindness often hides itself so the other person can accept it.',
      hints: [
        'A theme is a full sentence that says something about how life works. One choice is a single word, one gives an order, and one just repeats an event from the story.',
        'Look at the line where Nell says she is not that hungry anyway. Why would she say that? Which choice is built out of that line?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-supported-theme',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the theme the story actually supports.\n\n"Kiran ran his trumpet solo in the garage for six weeks so nobody would hear him miss notes. On concert night he missed one anyway. Afterward his sister said she had not noticed. Kiran had spent six weeks afraid of an audience that was not listening that closely."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Never let anyone hear you make a mistake.' },
        { id: 'b', text: 'Practicing alone is the fastest way to get good at something.' },
        { id: 'c', text: 'Music.' },
        { id: 'd', text: 'The fear of being judged is usually bigger than the judging that actually happens.', correct: true },
      ],
      expectedAnswer: 'The fear of being judged is usually bigger than the judging that actually happens.',
      hints: [
        'Two of these are not theme statements at all. One is a single word and one is an order. Cross those out first.',
        'The last sentence tells you what the story is getting at. Which choice is built from "afraid of an audience that was not listening that closely"?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-objective-summary',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the best OBJECTIVE SUMMARY.\n\n"Tessa found a stray dog behind the gym on Monday. She fed it half a granola bar and kept it a secret all week, hiding it in the storage shed. On Friday the custodian found the shed door open and the dog gone. Tessa put up eleven posters around the neighborhood, and on Sunday a neighbor called to say the dog was on her porch."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Kids should tell an adult right away when they find a stray animal.' },
        { id: 'b', text: 'Tessa is a really kind person, and the best part is that she never gave up looking for the dog.' },
        { id: 'c', text: 'Tessa found a dog behind the gym. She fed it half a granola bar. She hid it in the storage shed. The shed door was open. She made eleven posters.' },
        { id: 'd', text: 'Tessa hides a stray dog in a storage shed for a week. On Friday the shed door is open and the dog is gone. She puts up posters, and on Sunday a neighbor calls to say the dog is on her porch.', correct: true },
      ],
      expectedAnswer: 'Tessa hides a stray dog in a storage shed for a week. On Friday the shed door is open and the dog is gone. She puts up posters, and on Sunday a neighbor calls to say the dog is on her porch.',
      hints: [
        'Objective means no opinion and no advice. Two choices break that rule right away. Find the words that tell you what someone THINKS.',
        'Of the two left, one lists small details and stops before the ending. A summary has to say how things turned out.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-moral-and-opinion',
      kind: 'misconception_check',
      question:
        'A student is asked for the theme and writes "courage", then changes it to "always stand up for yourself". Later the same student summarizes a story as "It was about a boy and his bike, and it was pretty sad." What went wrong each time?',
      commonErrors: [
        {
          answer: 'The theme is courage. Basically the story is telling us to always stand up for yourself.',
          misconception:
            'Answering with a one-word topic, then rescuing it with a moral that gives a command. Both stop short of stating an idea the story supports.',
          correctsTo:
            'These are two different mistakes. "Courage" is the TOPIC. It names the subject and makes no claim, so there is nothing to prove from the page. "Always stand up for yourself" is a MORAL, because it gives an order, and it would fit hundreds of other stories, which means it came from the student and not from this text. A theme is a full sentence that says what THIS story shows about courage, and you build it from what changed and what it cost. Something like "Courage looks like certainty from the outside and feels like guessing from the inside" — and then point at the lines that force it.',
        },
        {
          answer: 'It was about a boy and his bike, and it was pretty sad.',
          misconception:
            'Treating a summary as a reaction. "Pretty sad" is how the reader felt, and "about a boy and his bike" names a subject instead of retelling events.',
          correctsTo:
            'An objective summary reports what happened, in order, in your own words, and stops there. Strip "it was pretty sad", because that is your feeling and not an event. Then replace "about a boy and his bike" with the actual chain: what the boy wanted, what got in the way, and how it ended. Test the finished version by asking whether anybody could tell who wrote it. If your opinion is showing, it is not objective yet.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A topic is one word. A theme is a whole sentence about how life works, and the whole story has to support it.',
        'Build the theme from what the main character learns or fails to learn, and what it cost. Then write it about people, not about that one character.',
        'If your theme starts with always or never, you wrote a moral. A story observes, it does not give orders.',
        'The theme is almost never printed in the text. You build it, then you point at the exact moments that force it.',
        'An objective summary retells the IMPORTANT events IN ORDER, in YOUR OWN WORDS, with NO opinion — and it always says how things turned out.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Theme & Objective Summary' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
