/**
 * Grade 7 ELA — Reading Literature: How Writers Build Characters.
 *
 * The concept-led exemplar for the m7ela course (CCSS RL.7.3, RL.7.1).
 * Indirect characterization as five moves a reader can actually point at —
 * what a character says, does, thinks, looks like, and how others react —
 * plus the misconception that breaks every later character question: taking
 * a character's stated feeling as automatically true when the actions around
 * it say otherwise.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U1_CHARACTERIZATION: LessonPlan = {
  id: 'evelyn.ms.m7ela.characterization.v1',
  title: 'How Writers Build Characters',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.characterization',
      standard: 'M7ELA-1.3',
      description:
        'Analyze how a writer reveals a character through speech, actions, thoughts, appearance and other characters reactions, and cite the specific detail in the text that supports each conclusion (CCSS RL.7.3, RL.7.1).',
    },
  ],
  prerequisites: ['m7ela.plot-structure-and-conflict'],
  followUps: ['m7ela.setting-and-story-elements'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already reads people this way, so the lesson only names a skill they own.',
      script:
        'Someone walks up to your lunch table and drops into the seat without a word. They do not look up. They push the same chip around the tray for a minute. Nobody had to tell you anything, and already you have a pretty good guess about their day. You did that by reading details. Writers count on it. A good writer almost never says a character is stubborn or kind or scared. Instead they show you a detail and let you do exactly what you just did at that lunch table. Today we name the five moves writers use, and we practice pointing at the exact line that gave the answer away.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-characterization',
      kind: 'concept',
      goal: 'Name direct and indirect characterization, the five indirect moves, and the stated-feeling trap.',
      keyIdeas: [
        'A TRAIT IS WHAT SOMEONE IS LIKE, NOT WHAT THEY DO — brave, careful, jealous and generous are traits. Riding a bike, opening a box and losing a game are events. If your answer to "what is this character like" could go on a list of things that happened, it is a plot detail, not a trait. Trade it for the word the detail proves.',
        'DIRECT CHARACTERIZATION IS THE WRITER TELLING YOU — "Mateo was stubborn." It is quick and it is rare, because it does all the work for the reader and leaves nothing to notice.',
        'INDIRECT CHARACTERIZATION IS THE WRITER SHOWING YOU, and there are five moves to watch for: what the character SAYS, what the character DOES, what the character THINKS, how the character LOOKS, and how OTHER characters react to them. Almost every character question you will ever meet is asking you to catch one of those five.',
        'THE BIG TRAP — what a character says about themselves is not automatically true. People say they are fine when they are not. When the words point one way and the actions point the other way, believe the actions. That gap is usually the whole point of the scene, and a writer builds it on purpose.',
        'EVERY CLAIM NEEDS THE LINE THAT PROVES IT — a trait you cannot attach to a specific detail is a guess. Say the trait, then say "because" and quote the words that earned it. If nothing in the text fits after "because", the trait is not in the passage, no matter how likely it seems.',
      ],
      vocabulary: [
        { term: 'trait', definition: 'a word for what a character is like on the inside, such as careful, generous or jealous.' },
        { term: 'direct characterization', definition: 'when the writer states a character trait outright.' },
        { term: 'indirect characterization', definition: 'when the writer shows a detail and lets the reader work out the trait.' },
        { term: 'inference', definition: 'a conclusion you reach by combining a detail in the text with what you already know.' },
        { term: 'text evidence', definition: 'the exact words from the passage that support your conclusion.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-infer-from-action',
      kind: 'worked_example',
      problem:
        'Read this and name one trait, then point at the line that proves it.\n\n"Maya counted the granola bars in her bag. Four, and five people at the table. She slid hers across to Devon and said she had already eaten."',
      steps: [
        'First ask which of the five moves is doing the work here. Nobody describes Maya, and nobody reacts to her. What we get is what she DOES and one thing she SAYS.',
        'List the actions plainly: she counts, she notices there is one short, she gives hers away, and she tells Devon she has already eaten.',
        'Now test that last line. If she had really already eaten, she would not have counted the bars so carefully or needed to explain herself. So the claim is almost certainly not true — she said it so that Devon would take the bar without feeling bad.',
        'Turn the details into a trait word. Giving away your own food is generous. Covering it with a small excuse so the other person is comfortable is thoughtful.',
        'Say it with the evidence attached: Maya is generous and thoughtful, because she "slid hers across to Devon" and then said she had already eaten so that he would take it easily.',
        'Notice what a weaker answer would look like: "Maya gave Devon a granola bar." That is true, but it is the event, not the trait. The question asks what she is like.',
      ],
      answer:
        'Maya is generous and thoughtful. Evidence: she slides her own bar across to Devon, then says she has already eaten so that he will accept it without feeling bad.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-says-versus-shows',
      kind: 'worked_example',
      problem:
        'What is really going on with Theo? Use the details.\n\n"\'I don\'t care who wins,\' Theo said. He checked the scoreboard again. His knee was bouncing so hard the bench shook."',
      steps: [
        'Two of the five moves collide here. What Theo SAYS is that he does not care. What Theo DOES is check the scoreboard and bounce his knee hard enough to shake a bench.',
        'Take the words on their own first. "I do not care who wins" is a claim about his own feelings, and characters are allowed to be wrong or dishonest about those.',
        'Now weigh the actions. Checking the scoreboard AGAIN means he had already checked it. A knee bouncing that hard is a body under stress. Neither of those is what not caring looks like.',
        'When words and actions disagree, the actions win. Theo cares very much about the score and is trying not to show it.',
        'WRONG answer to avoid: "Theo is relaxed, because he says he does not care." That takes the stated feeling as the true one and ignores every other detail in the passage. RIGHT answer: Theo is anxious about the game and is hiding it.',
        'State it with evidence: Theo is nervous and is covering it up, because he "checked the scoreboard again" and his knee "was bouncing so hard the bench shook" right after claiming not to care.',
      ],
      answer:
        'Theo is nervous about the game and is hiding it. His words say he does not care, but he checks the scoreboard again and his knee bounces hard enough to shake the bench.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-infer-trait',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the best description of Nadia.\n\n"Nadia read the instructions twice before she opened the box. Then she laid every piece out in rows and counted them against the list."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nadia is careful.', correct: true },
        { id: 'b', text: 'Nadia is bored.' },
        { id: 'c', text: 'Nadia does not understand how the model works.' },
        { id: 'd', text: 'Nadia is impatient.' },
      ],
      expectedAnswer: 'Nadia is careful.',
      hints: [
        'List what Nadia actually does, in order. Then ask what kind of person does those things on purpose.',
        'Reading twice and counting every piece against a list is checking. Checking before you start is what careful looks like.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-says-versus-shows',
      kind: 'try_yourself',
      problem:
        'What does the detail about the shoelace tell you?\n\n"\'I\'m not nervous,\' Sam told his sister. He had tied and retied his left shoelace four times."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sam is nervous, even though he says he is not.', correct: true },
        { id: 'b', text: 'Sam is telling the truth and feels calm.' },
        { id: 'c', text: 'Sam\'s shoelace is broken.' },
        { id: 'd', text: 'Sam does not take care of his clothes.' },
      ],
      expectedAnswer: 'Sam is nervous, even though he says he is not.',
      hints: [
        'Sam says one thing. Sam does another. When those two disagree, which one should a reader trust?',
        'Nobody reties the same lace four times because of the lace. Repeating a small action like that is a sign of nerves.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-evidence',
      kind: 'try_yourself',
      problem:
        'Which detail best shows that Ben thinks about other people, not only himself?\n\n"Every morning Ben got to the bus stop ten minutes early. He carried a spare pencil in case someone forgot one. His backpack held an umbrella even in July."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'He carries a spare pencil in case someone forgets one.', correct: true },
        { id: 'b', text: 'He gets to the bus stop ten minutes early.' },
        { id: 'c', text: 'He keeps an umbrella in his backpack even in July.' },
        { id: 'd', text: 'He carries a backpack every morning.' },
      ],
      expectedAnswer: 'He carries a spare pencil in case someone forgets one.',
      hints: [
        'All three of the first details show Ben planning ahead. Only one of them plans ahead for a person who is not Ben.',
        'Read each option and ask who benefits. The spare pencil is the only item he cannot use himself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-stated-feeling',
      kind: 'misconception_check',
      question:
        'A student reads "\'I\'m not nervous,\' Sam said" and writes that Sam is a calm person. What went wrong?',
      commonErrors: [
        {
          answer: 'Sam is calm, because he says he is not nervous.',
          misconception:
            'Treating what a character says about their own feelings as automatically true, and stopping reading at the quotation mark.',
          correctsTo:
            'A character can be wrong about themselves, or can be covering something up on purpose. The line about tying the same shoelace four times is sitting right there, and it points the other way. When words and actions disagree, believe the actions: Sam is nervous and is hiding it. Writers build that gap deliberately, so it is usually the most important thing in the passage, not a detail to skip.',
        },
        {
          answer: 'Sam ties his shoes a lot.',
          misconception:
            'Repeating the detail instead of drawing a conclusion from it. This answer names the event and stops before the trait.',
          correctsTo:
            'The question asks what the detail TELLS you, so the answer has to go one step past the text. Take the detail, add what you already know about people, and land on a trait: someone who reties the same lace four times is nervous. Then attach the line as evidence.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A trait says what a character is LIKE. If your answer names something that happened, it is a plot detail, not a trait.',
        'Direct characterization tells you outright. Indirect characterization shows you and lets you work it out.',
        'The five indirect moves: what a character says, does, thinks, looks like, and how others react to them.',
        'When a character\'s words disagree with their actions, believe the actions. That gap is usually the point of the scene.',
        'Every trait needs the line that proves it. Say the trait, say "because", then quote the detail.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'How Writers Build Characters' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
