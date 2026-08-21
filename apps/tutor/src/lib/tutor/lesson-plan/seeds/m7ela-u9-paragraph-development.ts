/**
 * Grade 7 ELA — Informative Writing: Paragraph Development.
 *
 * Procedure-led (CCSS W.7.2b). Two habits run the whole lesson. UNITY: read
 * the topic sentence, then ask of every other sentence "does this one help?"
 * DEVELOPMENT: a topic sentence plus one thin detail is not a finished
 * paragraph, so the writer adds relevant facts, definitions, concrete
 * details, quotations and examples.
 *
 * NOTE FOR FUTURE AUTHORS: the off-topic sentence in every item here is TRUE
 * and interesting on purpose. That is what makes the error real — a sentence
 * that is obviously silly teaches nothing. Every paragraph a student is asked
 * about is printed in full inside the problem text; nothing is referenced
 * that the student cannot read. No statistics are invented anywhere in this
 * file; the supporting details are ordinary facts or story details.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U9_PARAGRAPH_DEVELOPMENT: LessonPlan = {
  id: 'evelyn.ms.m7ela.paragraph-development.v1',
  title: 'Paragraph Development',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.paragraph-development',
      standard: 'M7ELA-9.2',
      description:
        'Develop an informative paragraph with relevant facts, definitions, concrete details, quotations and examples, and keep it unified by cutting any sentence that does not serve the topic sentence (CCSS W.7.2b).',
    },
  ],
  prerequisites: ['m7ela.informative-thesis-and-structure'],
  followUps: ['m7ela.transitions-and-cohesion'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor unity and development in the everyday experience of explaining something to a friend.',
      script:
        'Picture a friend asking you how the skate park behind the community center ever got built. You start telling the story, then you stop to mention who owns the ice cream place across the street, then you remember a joke about your cousin, and three minutes later your friend still does not know how the skate park got built. Now picture the opposite. You say one sentence, your friend nods, and it is done: "A group of students kept asking until the town said yes." A paragraph works the same way. It has one job, it says what that job is, and then it actually does the job instead of drifting or repeating itself. Today you will practice two moves: cutting the sentence that wandered off, and finishing a paragraph that stopped too early.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-unity-and-development',
      kind: 'concept',
      goal: 'Install the unity test, name the five developing moves, and kill the length-and-repetition myths.',
      keyIdeas: [
        'THE TOPIC SENTENCE NAMES THE ONE JOB. It tells the reader what this paragraph is going to explain: "A school library gets its books in several different ways." Everything after it exists to do that job. If you cannot say the job in one sentence, you do not have a paragraph yet.',
        'THE UNITY TEST IS ONE QUESTION, ASKED OVER AND OVER. Read the topic sentence. Then read each other sentence and ask, "does this one help?" If the honest answer is no, that sentence goes. It does not matter that it is true. It does not matter that it is the most interesting line on the page. Being true and being on the job are two different tests, and only the second one decides.',
        'DEVELOPMENT MEANS FIVE MOVES, and they are the ones your writing standard names: a relevant FACT (yeast gives off carbon dioxide gas), a DEFINITION (a gear is a pair of toothed wheels linked by a chain), a CONCRETE DETAIL (the sign-up sheet was taped to the door), a QUOTATION (the librarian said, "We buy what students ask for"), and an EXAMPLE (a swallow eats flying insects). Reach for a different move each time and the paragraph fills itself.',
        'A TOPIC SENTENCE PLUS ONE THIN DETAIL IS NOT A FINISHED PARAGRAPH. It is a paragraph that stopped too early. The reader is left holding a claim and one crumb of proof. Ask yourself the honest question: would somebody who knew nothing about this now understand it? If not, keep developing.',
        'REPEATING IS NOT DEVELOPING. "Low gears make hills easier. Hills are much easier in a low gear." The page got longer and the reader learned nothing. After every sentence you add, ask what the reader knows now that they did not know one sentence ago. If the answer is nothing, replace that sentence with one of the five moves.',
        'ONE PARAGRAPH DOES ONE JOB, AND LENGTH IS NOT THE TEST. Nobody owes you five sentences. A paragraph is finished when the job is done, which sometimes takes three sentences and sometimes takes eight. And if you find yourself doing two jobs, do not hunt for a better transition — split it into two paragraphs. The topic sentence usually comes first, and first is the safest place for it in school writing, but the real rule is that the paragraph has ONE controlling idea, stated somewhere, unmistakably.',
      ],
      vocabulary: [
        { term: 'topic sentence', definition: 'the sentence that states the one idea a paragraph will explain.' },
        { term: 'unity', definition: 'the condition in which every sentence in a paragraph helps the topic sentence do its job.' },
        { term: 'development', definition: 'building a point out with facts, definitions, concrete details, quotations and examples instead of restating it.' },
        { term: 'concrete detail', definition: 'a specific thing a reader could picture, such as a taped-up sign-up sheet, rather than a general statement.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cut-the-drift',
      kind: 'worked_example',
      problem:
        'Find the sentence that breaks unity, and name the test you used. "(1) The skate park on Cedar Street got built because a group of students kept asking for it. (2) They spent three weekends collecting signatures outside the grocery store. (3) Then they spoke at a town council meeting and handed the council the whole folder of names. (4) Wet concrete has to be poured in layers and left to harden for days before anyone can ride on it. (5) After the council voted yes, the students helped choose the patch of ground behind the community center."',
      steps: [
        'Find the job first. Sentence 1 is the topic sentence, and the job it names is narrow: the park got built BECAUSE students kept asking. So every other sentence has to help explain how the asking worked.',
        'Ask the question of sentence 2. Does collecting signatures outside the grocery store help explain how the asking worked? Yes. That is the students asking, in a concrete detail you can picture. Keep it.',
        'Ask it of sentence 3. Does speaking at the council meeting help? Yes, and it is the strongest sentence in the paragraph, because it is the moment the asking reached the people who decide. Keep it.',
        'Ask it of sentence 4. Does how wet concrete hardens help explain that students kept asking until the town said yes? No. It is about building the surface, not about the students. It slipped in by association: the writer thought "skate park," then thought "concrete."',
        'Ask it of sentence 5. Does helping choose the spot help? Yes. It shows the asking paid off and the students stayed involved. Keep it.',
        'Cut sentence 4. Notice what makes this hard. Sentence 4 is true, and it is genuinely interesting, and a reader might enjoy it more than any other line. None of that is the test. If the writer loves it, it can start its own paragraph about how the park was constructed, which is a different job.',
      ],
      answer:
        'Sentence 4 breaks unity. How concrete hardens does not help explain that students kept asking until the park was approved, so it is cut even though it is true and interesting.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-finish-the-thin-paragraph',
      kind: 'worked_example',
      problem:
        'A student says this paragraph is finished. "(1) The low gears on a bike make a steep hill easier to climb. (2) Low gears really help a lot on a hill. (3) Hills are much easier when you shift down." Is it finished, and how would you develop it?',
      steps: [
        'Read the topic sentence and state the job: explain why low gears make a steep hill easier.',
        'Test sentence 2 with the added-knowledge question. What does the reader know now that they did not know one sentence ago? Nothing. "Make a steep hill easier" and "really help a lot on a hill" are the same claim in different words. That is repeating, not developing.',
        'Test sentence 3 the same way. "Hills are much easier when you shift down" is the claim a third time. So this paragraph has a topic sentence and zero support. It is not five sentences short. It is one job short.',
        'Now develop it with the moves. Start with a DEFINITION: "A gear is a pair of toothed wheels joined by the chain, and shifting moves the chain onto a different pair."',
        'Add a relevant FACT: "In a low gear the chain sits on a small ring at the pedals and a large one at the back wheel, so one full turn of the pedals spins the back wheel less than one full turn."',
        'Add the CONCRETE DETAIL that shows what the fact means for a rider: "You have to pedal more times to cover the same stretch of road, but each push takes less force from your legs."',
        'Finish with an EXAMPLE: "That is why a rider going up the hill behind the community center spins the pedals quickly in a low gear instead of standing up and stamping on them in a high one."',
        'Read the new paragraph and check unity one last time. Topic sentence, definition, fact, detail, example, and every single one of them is about why low gears make climbing easier. The job is done, so the paragraph is finished.',
      ],
      answer:
        'It is not finished. Sentences 2 and 3 only repeat the claim, so they are replaced with real development: a definition of a gear, the fact about the small front ring and large rear one, the detail that each push takes less force, and the example of the rider on the community center hill.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-sentence-does-not-belong',
      kind: 'try_yourself',
      problem:
        'Read this paragraph. "(1) Dough rises because the yeast mixed into it is alive. (2) Yeast is a tiny fungus, and it feeds on the sugars in the flour. (3) As the yeast feeds, it gives off carbon dioxide gas. (4) The word loaf comes from an old English word for bread. (5) The dough is stretchy enough to trap that gas in small bubbles, so the whole lump swells." Which sentence does NOT belong?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sentence 2: Yeast is a tiny fungus, and it feeds on the sugars in the flour.' },
        { id: 'b', text: 'Sentence 3: As the yeast feeds, it gives off carbon dioxide gas.' },
        { id: 'c', text: 'Sentence 4: The word loaf comes from an old English word for bread.', correct: true },
        { id: 'd', text: 'Sentence 5: The dough is stretchy enough to trap that gas in small bubbles, so the whole lump swells.' },
      ],
      expectedAnswer: 'Sentence 4: The word loaf comes from an old English word for bread.',
      hints: [
        'Read sentence 1 first and say the job out loud: explain why dough rises. Then ask each other sentence, "does this one help?"',
        'Three of these sentences build one chain: yeast feeds, gas comes out, dough traps it. One is a true and interesting fact about where a word came from, which is a different job.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-sentence-develops',
      kind: 'try_yourself',
      problem:
        'A paragraph opens with this topic sentence: "Some birds migrate because the food they live on disappears in winter." Which added sentence best DEVELOPS that point?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Birds that migrate do it because winter makes their food hard to find.' },
        { id: 'b', text: 'Swallows catch insects in the air, and once cold weather ends the insect season a swallow that stayed north would have almost nothing left to catch.', correct: true },
        { id: 'c', text: 'The word migrate means to move from one place to another.' },
        { id: 'd', text: 'Bright lights on tall buildings can confuse birds that are flying at night.' },
      ],
      expectedAnswer: 'Swallows catch insects in the air, and once cold weather ends the insect season a swallow that stayed north would have almost nothing left to catch.',
      hints: [
        'Ask the added-knowledge question of each choice: what does the reader learn that the topic sentence did not already say?',
        'One choice says the claim again in new words, one defines a word without showing why any bird leaves, and one is true but about a different problem birds face. Only one gives an example that shows the food actually running out.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-topic-sentence-fits',
      kind: 'try_yourself',
      problem:
        'These three sentences are the support for one paragraph. "Librarians read reviews and keep a running list of titles students ask for. The school sets aside money every year for new books. Other books arrive as gifts from families whose children have outgrown them." Which topic sentence fits this support best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Reading every day is one of the best habits a student can build.' },
        { id: 'b', text: 'A school library gets its books in several different ways.', correct: true },
        { id: 'c', text: 'Families often donate books their children have outgrown.' },
        { id: 'd', text: 'Librarians do far more work in a week than most students realize.' },
      ],
      expectedAnswer: 'A school library gets its books in several different ways.',
      hints: [
        'A topic sentence has to promise exactly what the support delivers. Not broader, not narrower.',
        'One choice is a general opinion the support never proves, one covers only the third sentence, and one makes a claim about how hard librarians work that the support never argues.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-five-sentences-and-padding',
      kind: 'misconception_check',
      question:
        'A student writes a topic sentence and two real supporting details, then says, "It is only three sentences, so it does not count as a paragraph yet. I will add two more." Are they right?',
      commonErrors: [
        {
          answer: 'Yes. A paragraph has to be five sentences long.',
          misconception:
            'Treating a sentence count as the rule. Somebody once said "five sentences" as a rough guide, and the student turned it into a law.',
          correctsTo:
            'There is no five-sentence rule. Length is not the test; the job being finished is the test. Read the topic sentence, then ask whether somebody who knew nothing about the subject would now understand it. If yes, the paragraph is done at three sentences. If no, it is not done at eight. Counting sentences tells you nothing about whether the reader was helped.',
        },
        {
          answer: 'The student adds two more sentences that say the same thing in new words.',
          misconception:
            'Believing that adding sentences develops a paragraph, even when the new sentences only repeat what is already there.',
          correctsTo:
            'Repeating is not developing. A sentence earns its place only if the reader knows something new after reading it. If a paragraph really does need more, add one of the five developing moves: a relevant fact, a definition, a concrete detail, a quotation or an example. Padding makes the paragraph longer and weaker at the same time.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A paragraph does ONE job, and the topic sentence names it. Two jobs means two paragraphs, not a better transition.',
        'The unity test: read the topic sentence, then ask of every other sentence, "does this one help?" If no, cut it.',
        'A true, interesting sentence can still be off the job. Being interesting does not earn a sentence its place; helping the topic sentence does.',
        'Develop with the five moves: a relevant fact, a definition, a concrete detail, a quotation, an example.',
        'A topic sentence plus one thin detail is not finished, and repeating the claim in new words does not finish it either.',
        'There is no five-sentence rule. The paragraph is done when the job is done.',
        'The topic sentence usually comes first, and that is the safest choice, but the real rule is one controlling idea.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Paragraph Development' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
