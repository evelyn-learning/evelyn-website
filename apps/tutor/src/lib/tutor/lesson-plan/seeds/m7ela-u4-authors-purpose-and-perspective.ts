/**
 * Grade 7 ELA — Reading Informational Text: Author's Purpose & Perspective.
 *
 * Why a text was written, and where the writer stands on the subject
 * (CCSS RI.7.6). Five purpose families and the clues each one leaves; then
 * perspective, read from what the writer put in, what the writer left out,
 * the loaded words, and whether the piece asks the reader to do something.
 * The four misconceptions this lesson is built to break: purpose is the
 * topic, facts mean "to inform", perspective only counts when it is stated
 * outright, and "to entertain" for anything that is fun to read.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every topic is school- or neighborhood-scale on
 * purpose: real persuasive writing, no live political controversy.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U4_AUTHORS_PURPOSE_AND_PERSPECTIVE: LessonPlan = {
  id: 'evelyn.ms.m7ela.authors-purpose-and-perspective.v1',
  title: 'Author\'s Purpose & Perspective',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.authors-purpose-and-perspective',
      standard: 'M7ELA-4.2',
      description:
        'Determine why an author wrote a text — to inform, to persuade, to entertain, to explain or to describe — and determine the author\'s own perspective on the subject, telling it apart from the perspective of another author writing about the same thing, using what the author includes and leaves out, the loaded words, and whether the text asks the reader to do something (CCSS RI.7.6).',
    },
  ],
  prerequisites: ['m7ela.text-structure'],
  followUps: ['m7ela.tracing-an-argument'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already hears purpose and perspective in ordinary life, so the lesson only gives the skill a name.',
      script:
        'Your friend texts you about the new pizza place on Third Street. The crust was soggy, and the line took twenty minutes. Then you walk past the shop and there is a flyer taped in the window: FRESH DOUGH DAILY. FAMILY OWNED. TRY OUR TUESDAY DEAL. Same pizza place, same week. Neither one is lying to you. What changed is WHY each one was written and whose side it is on. Your friend wanted to save you a bad dinner. The flyer wants you inside the shop. You already hear that difference. Today we name it, and we practice proving it from the exact words on the page.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-purpose-and-perspective',
      kind: 'concept',
      goal: 'Name the five purpose families and their clues, separate topic from purpose, and teach perspective as something you find in word choice, in emphasis and in what is missing.',
      keyIdeas: [
        'PURPOSE IS THE WHY, AND IT IS A VERB — there are five common ones. TO INFORM: tell you what is so. TO PERSUADE: get you to believe something or do something. TO ENTERTAIN: give you a good time, usually with a story, a voice or a joke. TO EXPLAIN: make you understand how something works or why it happened. TO DESCRIBE: put a picture of a place, a person or a thing in your head.',
        'EACH PURPOSE LEAVES CLUES YOU CAN POINT AT — TO INFORM leaves dates, names, a flat tone and no ask. TO PERSUADE leaves a claim, reasons for it, words that judge, and usually a line telling you what should happen. TO EXPLAIN leaves steps and the word because. TO DESCRIBE leaves sense words: what it looked like, smelled like, sounded like. TO ENTERTAIN leaves scene, character and dialogue. Name the clue, then name the purpose.',
        'THE TOPIC IS NOT THE PURPOSE — "it is about the lunch period" names the topic. "It argues that the lunch period should be longer" names the purpose. If your answer does not start with a verb, you have answered the wrong question. Two writers can share a topic and have completely different purposes.',
        'PERSPECTIVE IS WHERE THE WRITER STANDS ON THE SUBJECT, and it is not the same as the topic either. Look in three places. ONE: what got included and what got left out, because a writer who never mentions the other side has told you which side is theirs. TWO: loaded words, which carry a judgment along with the meaning — crammed instead of added, rammed through instead of passed. THREE: whether the piece asks you to do something. A writer almost never has to announce a position for you to find it.',
        'FACTS DO NOT SETTLE THE QUESTION — persuasive writing is packed with facts. That is what makes it work. The writer picked the true facts that help the case and left out the ones that do not. So do not ask "are there facts here". Ask what the WHOLE text is trying to leave you believing or doing, and check that against the first sentence, the middle and the last.',
      ],
      vocabulary: [
        { term: 'author\'s purpose', definition: 'the reason a text was written, said as a verb: to inform, to persuade, to entertain, to explain or to describe.' },
        { term: 'perspective', definition: 'where the writer stands on the subject, which shows in the words they chose and in what they decided to include.' },
        { term: 'loaded word', definition: 'a word that carries a judgment along with its meaning, such as crammed instead of added.' },
        { term: 'call to action', definition: 'the line that tells the reader what should happen or what to do; a strong sign the purpose is to persuade.' },
        { term: 'omission', definition: 'something a fair treatment of the subject would have included, which this text left out.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-purpose-with-facts',
      kind: 'worked_example',
      problem:
        'Name the purpose of this piece from a school newsletter, and say what gave it away.\n\n"Our first bell rings at 7:20. Doctors say people our age need around nine hours of sleep, and almost nobody on my bus is getting it. Half of first period is spent waking up. The school board should move the first bell to 8:30."',
      steps: [
        'Start with the clues, not with a guess. There are facts in here: the 7:20 bell, what doctors say about sleep. A lot of students stop right there and answer "to inform".',
        'Now look for the clues the other families leave. There are no steps and no because, so it is not explaining. There is no scene and no dialogue, so it is not entertaining. There are no sense words, so it is not describing.',
        'Read the last sentence again. "The school board should move the first bell to 8:30" is a call to action. It tells somebody what to do. Informative writing has no reason to do that.',
        'Check which facts were chosen. Every fact in the passage points the same direction: the bell is early, the sleep is short, the first period is wasted. Nothing about why the day starts at 7:20, and nothing about buses or after-school practice. Those are omissions, and they tell you the writer is building a case, not surveying the subject.',
        'Say the answer as a verb with the evidence attached. The purpose is TO PERSUADE the school board to start the day later, and the proof is the claim plus reasons plus the should sentence at the end.',
        'WRONG answer to avoid: "to inform, because it has facts about sleep." Facts are a tool. Persuasion picks up that tool more often than anything else, because true facts are the most convincing kind.',
      ],
      answer:
        'The purpose is to persuade the school board to move the first bell later. Evidence: a claim backed by chosen reasons, and a call to action in the last sentence — "The school board should move the first bell to 8:30." The facts about sleep are evidence being used, not proof that the piece is informative.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-perspective-from-words',
      kind: 'worked_example',
      problem:
        'This writer never says "I think". Find their perspective anyway, and point at the words that show it.\n\n"The plan to cram a skate ramp into Halden Park would pave over the only patch of open grass on our block. Families have spread out blankets there since before I was born. The parks office calls it an upgrade."',
      steps: [
        'First be sure what the subject is: a skate ramp going into Halden Park. Both a fan and an opponent could write about that, so the subject alone tells you nothing.',
        'Hunt the loaded words. "Cram" means squeeze something in where it does not fit; a fan would have written "add" or "build". "Pave over" makes the ramp sound like a loss; a fan would have written "use the space". Swap those two words for neutral ones and the whole feeling drains out of the sentence.',
        'Look at the emphasis. The grass gets a history going back before the writer was born. The ramp gets one short clause and no reason for existing at all.',
        'Look at the omission. Nobody in this passage wants the ramp. Skaters are never mentioned, and neither is any reason the parks office gave. A fair treatment would have both, so leaving them out is itself evidence.',
        'Read the last line as the tell. "The parks office calls it an upgrade" hands the word upgrade to somebody else, in a tone that refuses to agree with it.',
        'State it with evidence: the writer is against the skate ramp and on the side of the families who use the grass, and you know it from "cram", from "pave over", from the way the grass gets a whole history while the ramp gets one short clause, and from a parks office whose reasons never appear.',
      ],
      answer:
        'The writer opposes the skate ramp and sides with the families who use the open grass. Evidence: the loaded words "cram" and "pave over", the long history given to the grass against one short clause for the ramp, the missing reasons from the parks office, and the last line that hands the word "upgrade" to someone else rather than agreeing with it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-primary-purpose',
      kind: 'try_yourself',
      problem:
        'Read this notice from a school website, then choose its primary purpose.\n\n"The library will be closed for floor repairs from the ninth to the twelfth. Books due during those days can be dropped in the return box by the gym doors. The reading room opens again on the thirteenth."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'To explain how a damaged library floor gets repaired' },
        { id: 'b', text: 'To persuade readers that the library should stay open during the repairs' },
        { id: 'c', text: 'To inform readers about the closing dates and where to return books', correct: true },
        { id: 'd', text: 'To entertain readers with a story about the school library' },
      ],
      expectedAnswer: 'To inform readers about the closing dates and where to return books',
      hints: [
        'Run the clues. Are there steps and the word because? Sense words? A scene with characters? A line telling somebody what should happen?',
        'The notice gives dates and one instruction, and it never argues that anything should change. It also never tells you HOW a floor is repaired.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-perspectives',
      kind: 'try_yourself',
      problem:
        'Two seventh graders wrote about the same subject for the school paper.\n\nWRITER A: "Ten more minutes of lunch would let us actually eat. Right now the line swallows most of the break, and half the room is still holding a sandwich when the bell goes."\n\nWRITER B: "Those ten minutes have to come from somewhere, and the somewhere is class time. The counter line clears fast once the first rush is through."\n\nWhat is the main difference between the two writers?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Writer A thinks lunch is too short to eat in, while Writer B thinks the extra minutes would cost class time', correct: true },
        { id: 'b', text: 'Writer A is writing about lunch, while Writer B is writing about class time' },
        { id: 'c', text: 'Writer A is trying to persuade, while Writer B is only reporting the facts with no position' },
        { id: 'd', text: 'Writer A gives opinions, while Writer B gives facts, so only Writer B has a purpose' },
      ],
      expectedAnswer: 'Writer A thinks lunch is too short to eat in, while Writer B thinks the extra minutes would cost class time',
      hints: [
        'Both writers are writing about the same subject: making the lunch period ten minutes longer. So the difference cannot be the topic.',
        'Writer B sounds calmer than Writer A, but read what Writer B actually claims. Saying the line clears fast is an argument, not a neutral report.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-perspective-word-choice',
      kind: 'try_yourself',
      problem:
        'Read this sentence from a student blog, then choose the best description of the writer\'s perspective.\n\n"The new phone rule locks every student\'s phone in a pouch for seven straight hours, and nobody bothered to ask a single seventh grader what they thought of it."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The writer thinks the rule is harsh and was decided without asking students', correct: true },
        { id: 'b', text: 'The writer thinks the rule is a fair way to keep phones from distracting the class' },
        { id: 'c', text: 'The writer has no position and is only reporting what the new rule says' },
        { id: 'd', text: 'The writer thinks students should be allowed to use phones during a test' },
      ],
      expectedAnswer: 'The writer thinks the rule is harsh and was decided without asking students',
      hints: [
        'Trade each loaded word for a plain one. "Locks" becomes stores, "seven straight hours" becomes the school day, "nobody bothered to ask" becomes students were not consulted. What feeling disappears when you do that?',
        'A writer does not have to say "I think" for you to know where they stand. The words they picked are the evidence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-facts-and-topic',
      kind: 'misconception_check',
      question:
        'A student reads a newsletter piece arguing for a longer lunch period and writes: "The purpose is to inform, because it is full of facts. And it is about the lunch period." What went wrong, and what is the right answer?',
      commonErrors: [
        {
          answer: 'The purpose is to inform, because the text is full of facts.',
          misconception:
            'Treating the presence of facts as proof that a text is informative, and treating true as the same thing as neutral.',
          correctsTo:
            'Facts are a tool, and persuasion picks up that tool constantly, because true facts are the most convincing kind. The writer chose the facts that help the case and quietly left out the ones that do not. So the test is never "are there facts here". The test is what the WHOLE text is trying to leave you believing or doing. This one ends by saying what the school should do, gives reasons for it, and never mentions a single cost of the change. That is persuasion.',
        },
        {
          answer: 'The purpose is the lunch period.',
          misconception:
            'Answering with the topic when the question asked for the purpose. The topic is what the text is ABOUT; the purpose is why it was WRITTEN.',
          correctsTo:
            'The lunch period is the subject, and two writers who disagree completely would both have that same subject. A purpose is a verb: to persuade the principal to add ten minutes to lunch. If your answer could be written on a list of topics, it is not a purpose yet. Add the verb and say who the writer wants to move.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Purpose is a verb, not a topic: to inform, to persuade, to entertain, to explain, to describe.',
        'Each purpose leaves clues. A call to action means persuade. Steps and because mean explain. Dates and a flat tone with no ask mean inform.',
        'Facts prove nothing about purpose. Persuasive writing is full of facts, picked on purpose to make a case.',
        'Perspective is where the writer stands, and it usually shows in loaded words, in what got the most space, and in what was left out — not in an announcement.',
        'Two writers can share a subject and stand in opposite places. Say what each one wants, then point at the words that prove it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Author\'s Purpose & Perspective' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
