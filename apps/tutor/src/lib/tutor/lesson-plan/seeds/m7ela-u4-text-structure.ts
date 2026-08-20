/**
 * Grade 7 ELA — Reading Informational Text: Text Structure.
 *
 * Concept-led (CCSS RI.7.5). The five common informational shapes —
 * chronological or sequence, cause and effect, compare and contrast,
 * problem and solution, and description — taught through the signal words
 * that give each one away, then pushed past labeling to the RI.7.5
 * question that actually matters: why did the writer choose that shape?
 *
 * Three misconceptions are targeted by name: dates do not make a passage
 * chronological, one stray "because" does not make it cause and effect,
 * and a long text can nest one shape inside another.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U4_TEXT_STRUCTURE: LessonPlan = {
  id: 'evelyn.ms.m7ela.text-structure.v1',
  title: 'Text Structure',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.text-structure',
      standard: 'M7ELA-4.1',
      description:
        'Identify the five common informational text structures — chronological or sequence, cause and effect, compare and contrast, problem and solution, and description — from their signal words and from how the ideas actually relate, and explain how the structure a writer chooses helps develop the ideas in the text (CCSS RI.7.5).',
    },
  ],
  prerequisites: ['m7ela.technical-and-domain-vocabulary'],
  followUps: ['m7ela.authors-purpose-and-perspective'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that arrangement is a choice by putting two answers from the same person side by side.',
      script:
        'Ask a friend how to get to their house and you get one shape of answer. Go past the gas station, turn left at the mural, it is the blue one with the trampoline out front. Now ask that same friend which of the two pizza places by the park is better. You get a completely different shape. This one has thicker crust, that one is cheaper, this one is packed every Friday. Same friend, same voice, two totally different arrangements, because the two questions needed different things. Writing works exactly the same way. The shape a writer picks for their ideas has a name. It is called text structure. Today you learn to spot five of them from a handful of sentences, and then to ask the better question: why did the writer pick that shape and not another one?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-structures',
      kind: 'concept',
      goal: 'Name the five structures with their signal words and a relationship test for each, then push past the label to the purpose question RI.7.5 asks.',
      keyIdeas: [
        'TEXT STRUCTURE IS THE SHAPE OF A WHOLE PASSAGE, NOT WHAT IT IS ABOUT — two writers can pick the same topic and arrange it two completely different ways. Structure is the arrangement: which idea comes first, what sits next to what, where the passage lands. It is a decision the writer made, and you can catch them making it.',
        'CHRONOLOGICAL OR SEQUENCE — the parts are arranged in time order or in step order. Signal words: first, then, next, later, after that, finally, that spring. The test: does each part come AFTER the one before it, so that swapping two parts would break the passage? Instructions, recipes and histories live here.',
        'CAUSE AND EFFECT — one thing makes another thing happen. Signal words: because, so, since, as a result, therefore, led to. The test: can you retell the WHOLE passage as "X happened, so Y happened"? Careful, though. One "because" sitting inside one sentence does not settle anything. It explains a single detail. The test is about the whole passage.',
        'COMPARE AND CONTRAST AND PROBLEM AND SOLUTION — two shapes that are easy to tell apart once you count the subjects. Compare and contrast holds two subjects up against each other and uses the same categories on both. Signal words: however, both, unlike, while, on the other hand, instead. Problem and solution names one thing that is not working and then gives a fix. Signal words: the trouble was, one difficulty, one answer is, to fix this, that solved it. If there is no fix on the page, it is not problem and solution.',
        'DESCRIPTION — one subject, and the sentences pile up features, parts or examples about it. Signal words are weakest here: for example, such as, in addition, along one wall. The test: are the sentences siblings, each adding another fact about the same one thing, instead of leading into one another? Description is where you land when nothing else fits.',
        'NAME THE SHAPE, THEN ASK WHY THE WRITER CHOSE IT — this is the half of the job most readers skip, and it is the half that matters. A comparison is there so you can judge or pick. A problem and solution is there to move you toward doing something. A sequence is there so you can follow or repeat something. A cause and effect is there to explain why something turned out the way it did. A description is there so you can picture one thing clearly. Say the shape, then say what the shape is DOING for the writer.',
      ],
      vocabulary: [
        { term: 'text structure', definition: 'the pattern a writer uses to arrange the ideas in an informational text.' },
        { term: 'signal words', definition: 'small linking words that hint at a structure, such as because, however, first or such as. They are a clue, not proof.' },
        { term: 'chronological', definition: 'arranged in the order that things happened, or in the order steps must be done.' },
        { term: 'dominant structure', definition: 'the shape that organizes a passage as a whole, even when a smaller shape shows up inside one part of it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-time-words-are-not-the-shape',
      kind: 'worked_example',
      problem:
        'Name the structure of this paragraph, and say why the writer chose it.\n\n"Last spring the bike rack outside Cedar Middle School was full before the first bell. Students who came later locked their bikes to the fence, and by June the fence was bent in two places. This year the school put a second rack behind the gym. The fence has stayed straight ever since."',
      steps: [
        'Do not start with the words. Start by saying out loud what each sentence DOES.',
        'Sentence 1 and sentence 2 name something that is not working: the rack fills up early, so bikes end up on the fence, and the fence bends. Sentence 3 says what the school did. Sentence 4 says what changed.',
        'Now check the tempting label. "Last spring", "by June" and "This year" are time words, and time words pull hard toward chronological. So test it. Take the time words out and read it again: rack full, fence bending, second rack added, fence fine. It still holds together. That means time is a DETAIL here, not the plan.',
        'Check cause and effect too, because there is a real causal link in here — the full rack is why bikes go on the fence, and that is why the fence bends. But notice where that link lives. It sits inside the first half. The paragraph does not exist to explain why fences bend. It exists to name a trouble and report a fix.',
        'Apply the problem and solution test directly. Is something clearly not working in the first part? Yes. Does a later part act on it? Yes, the second rack. And the last sentence reports that the fix worked.',
        'Finish the job. Why did the writer choose this shape? The paragraph is for a school newsletter, and the writer wants families to see that a complaint was heard and something got done. Problem and solution is the only shape that ends on a fix, so it is the shape that makes the school look like it listened.',
      ],
      answer:
        'Problem and solution. Sentences 1 and 2 name the trouble, sentence 3 gives the fix and sentence 4 reports the result. The time words are supporting detail, not the arrangement. The writer chose this shape because it ends on the fix, which is what a newsletter wants families to see.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-one-because-trap',
      kind: 'worked_example',
      problem:
        'A student reads this paragraph, spots the word "because", and labels it cause and effect. What did the student miss?\n\n"A paper map and a phone map both get you to the same corner, but they help in different ways. A paper map shows the whole town at once, so you can see how one street feeds into the next. A phone map instead gives you one turn at a time, and it can change the route because it knows which roads are busy right now."',
      steps: [
        'Find where the signal word actually sits. "Because" turns up near the end of sentence 3, and it explains one single thing: why a phone map can change the route. It is not doing anything to sentences 1 and 2.',
        'Notice the second bit of bait. There is a "so" in sentence 2 as well. Two cause words in a short paragraph feels like a lot, which is exactly why this trap catches people.',
        'Now label the parts instead. Sentence 1 names TWO subjects and says they do the same job in different ways. Sentence 2 is entirely about the paper map. Sentence 3 is entirely about the phone map, and the word "instead" marks the switch from one to the other.',
        'Run the compare and contrast test: are two subjects being held up against each other using the same category? Yes. The category is how each one helps you find your way. One subject gets a sentence, then the other subject gets a sentence.',
        'Name the mistake plainly. The student read one word and labeled the whole paragraph from it. A connecting word like "because" tells you how two ideas link inside a sentence. Structure tells you how the whole paragraph is built. Those are different sized questions.',
        'Finish the job. Why this shape? The writer wants you to be able to choose. Putting the two maps in matching terms means you can see what you gain and what you give up with each one, which a paragraph about only one map could never do.',
      ],
      answer:
        'The paragraph is compare and contrast. Sentence 1 sets up two subjects, sentence 2 covers the paper map and sentence 3 covers the phone map. The word "because" explains one detail inside sentence 3 and does not set the shape of the whole paragraph.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-cause-effect',
      kind: 'try_yourself',
      problem:
        'Read the paragraph, then choose its structure.\n\n"Two winters ago a beaver family built a dam on the creek behind Pine Ridge Park. The water spread out behind the dam and made a shallow pond, and as a result frogs started laying eggs there every spring. Herons wade in the shallows now, because there is so much for them to eat."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cause and effect', correct: true },
        { id: 'b', text: 'Chronological sequence' },
        { id: 'c', text: 'Problem and solution' },
        { id: 'd', text: 'Description' },
      ],
      expectedAnswer: 'Cause and effect',
      hints: [
        'Try the rewrite test on the whole paragraph. Can you retell it as "X happened, so Y happened, so Z happened" without changing what it means?',
        'The dam makes the pond, the pond brings the frogs, the frogs bring the herons. Each part is there because of the part before it. Nothing in the paragraph is called a trouble, and nothing is offered as a fix.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-this-shape',
      kind: 'try_yourself',
      problem:
        'The Cedar Middle School newsletter runs a piece about the two spring clubs students can sign up for, Robotics and Garden Crew. It goes through when each club meets, then what each club makes or grows, then what each one costs to join. Both clubs are covered under every heading. Why did the writer arrange the piece this way?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because readers have to pick one club, and matching headings let them line the two up and weigh the differences', correct: true },
        { id: 'b', text: 'Because readers need the story of how each club got started, told in the order it happened' },
        { id: 'c', text: 'Because the piece has to explain what caused the school to create the two clubs' },
        { id: 'd', text: 'Because compare and contrast is the clearest shape for any newsletter piece' },
      ],
      expectedAnswer: 'Because readers have to pick one club, and matching headings let them line the two up and weigh the differences',
      hints: [
        'Ask what a student reading this piece actually has to DO once they finish it.',
        'Naming the shape is only half the job. One choice names the work the side-by-side arrangement does for the reader. Two of them name work a different shape would do, and one claims a shape is always best.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-description-with-a-because',
      kind: 'try_yourself',
      problem:
        'Read the paragraph, then choose its structure.\n\n"The kitchen at Lake Hollow Camp is a long room with windows on three sides. A row of steel pots hangs above the counter, and a chalkboard by the door lists the meals for the week. The wooden table down the middle seats twenty, and it is scarred all over because campers have carved their initials into it for years."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Description', correct: true },
        { id: 'b', text: 'Cause and effect' },
        { id: 'c', text: 'Chronological sequence' },
        { id: 'd', text: 'Problem and solution' },
      ],
      expectedAnswer: 'Description',
      hints: [
        'Count the subjects. Then ask whether the sentences lead into one another or just keep adding more facts about the same one thing.',
        'The word "because" here explains one detail about one table. Structure is about how the whole paragraph is put together, not about one word inside one sentence.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-signal-word-only',
      kind: 'misconception_check',
      question:
        'A student reads a short article about a lighthouse that mentions the year it was built and the year its light was replaced, and says: "There are dates in it, so the structure is chronological." What went wrong?',
      commonErrors: [
        {
          answer: 'The passage has dates in it, so the structure must be chronological.',
          misconception:
            'Treating one signal — a date, a "because", a "however" — as the label for the whole passage. This is reading one tile and naming the whole floor.',
          correctsTo:
            'Dates are signal words, and signal words are a clue, not a verdict. Chronological means TIME is what puts the parts in order, so that swapping two parts would break the passage. In an article about a lighthouse, the two dates are just two more facts about one building, sitting next to its height, its color and the sound of its horn. Those facts are siblings, not a chain, and that makes the structure description. Do the test on the whole passage, every time, and let the words be a hint that sends you to the test.',
        },
        {
          answer: 'It cannot be description, because part of it is clearly cause and effect.',
          misconception:
            'Believing a passage is allowed only one structure, so finding any trace of a second one must mean the first label is wrong.',
          correctsTo:
            'A long text often nests one shape inside another. A problem and solution article can hold a cause and effect paragraph inside its first half, and a comparison can hold a tiny sequence inside one of its parts. That is normal, and it is not a contradiction. What you name is the DOMINANT structure — the shape that holds the whole thing together — and everything smaller is detail work inside it. A short passage like the ones in this lesson usually has one clear dominant shape, so if two labels both feel right, read again and ask which one organizes ALL the sentences rather than just one of them.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five shapes: chronological or sequence, cause and effect, compare and contrast, problem and solution, and description.',
        'Signal words to keep in your ear: first, then, finally; because, as a result, therefore; however, both, unlike; the trouble was, one answer is; for example, such as.',
        'Signal words are a clue, not a verdict. One "because" explains a link between two ideas. Structure is about how the whole passage is built.',
        'Dates do not make a passage chronological. Chronological means time is what puts the parts in order, so that swapping two parts would break it.',
        'Name the shape, then finish the job: comparison helps you judge, problem and solution pushes you to act, sequence lets you follow along, cause and effect explains why, description helps you picture one thing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Text Structure' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
