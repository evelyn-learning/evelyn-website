/**
 * Grade 7 ELA — Reading Literature: Text Evidence & Inference.
 *
 * The course opener (CCSS RL.7.1, RI.7.1). Explicit meaning versus inference,
 * and the habit every later lesson leans on: point at the exact words that
 * support the claim. Names the two failure modes head on — a guess with no
 * line behind it, and a quoted line that does not actually support the claim
 * it was attached to. The formula installed here is claim + "because" + the
 * exact words.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U1_TEXT_EVIDENCE_AND_INFERENCE: LessonPlan = {
  id: 'evelyn.ms.m7ela.text-evidence-and-inference.v1',
  title: 'Text Evidence & Inference',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.text-evidence-and-inference',
      standard: 'M7ELA-1.1',
      description:
        'Tell the difference between what a text states outright and what it lets a reader conclude, draw inferences the words actually support, and cite the exact wording that backs up each claim (CCSS RL.7.1, RI.7.1).',
    },
  ],
  prerequisites: [],
  followUps: ['m7ela.plot-structure-and-conflict'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already infers all day, then add the one new rule: point at the words.',
      script:
        'You walk into the kitchen and there is an empty pizza box on the counter, three plates in the sink, and your little brother will not look at you. Nobody said a word. You already know what happened to your slice. That move you just made has a name. You took details you could see and worked out something nobody told you. Readers do this on every page. The one thing school adds is a rule: you have to be able to point at the exact words that let you say it. Today we split what a text says outright from what a text lets you conclude, and we practice pointing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-evidence-and-inference',
      kind: 'concept',
      goal: 'Separate explicit meaning from inference, define text evidence, and name the two failure modes.',
      keyIdeas: [
        'EXPLICIT MEANS THE TEXT SAYS IT OUTRIGHT — if you can put your finger on a sentence and read the answer straight off the page, the meaning is explicit. "The gym was cold" is explicit. You do not have to work anything out; you only have to find it.',
        'AN INFERENCE IS A CONCLUSION THE TEXT LETS YOU REACH — the words do not say it, but they hand you enough to build it. Inference = a detail from the text + what you already know about how the world works. "Her breath fogged in the gym" plus what you know about cold air gets you to the same conclusion, but nobody printed it.',
        'TEXT EVIDENCE IS THE EXACT WORDS, NOT YOUR RETELLING — evidence means the wording that is really on the page, quoted or pointed at precisely. Saying "it says he was upset somewhere near the start" is not evidence. Saying he "shoved the paper into his bag without folding it" is.',
        'THE FORMULA: CLAIM + BECAUSE + THE EXACT WORDS — say what you think, say "because", then give the wording that earned it. Not "I think the dog is scared." Instead: "The dog is scared, because she is hiding under the table and will not come out for food." If you cannot finish the sentence after "because", you do not have an inference yet.',
        'FAILURE MODE ONE, THE GUESS — a guess is a claim with no line behind it. It can even be a very reasonable claim. The test is never "could this be true?" It is "does this text make me say it?" If the words never point there, the idea came from you, not from the page.',
        'FAILURE MODE TWO, THE MISMATCHED QUOTE — this one is sneakier, because there IS a quotation attached. The quote is real, it just does not prove the claim it was stapled to. Test every quote on its own: read only that line, and ask whether it alone makes the claim true. If it does not, keep hunting for the line that does.',
      ],
      vocabulary: [
        { term: 'explicit', definition: 'stated outright in the text, so you can point at the sentence and read it.' },
        { term: 'inference', definition: 'a conclusion you build from a detail in the text plus what you already know.' },
        { term: 'text evidence', definition: 'the exact words from the passage that support your claim.' },
        { term: 'claim', definition: 'the thing you are saying is true about the text, which then has to be backed up.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-explicit-versus-inference',
      kind: 'worked_example',
      problem:
        'Sort this passage into what it SAYS and what it lets you CONCLUDE.\n\n"Tia dropped her backpack by the door. She looked at the empty hook where the leash usually hung, then at the open gate. She was running before her mom finished the question."',
      steps: [
        'Start with the explicit part, which is anything you can read straight off the page. The text says Tia dropped her backpack, that the hook where the leash usually hangs is empty, that the gate is open, and that she started running.',
        'Now list what the passage never says. It never says there is a dog. It never says the dog is gone. It never says where Tia is going or why she is in a hurry.',
        'Pick the detail that is doing the most work. An empty leash hook and an open gate are sitting in the same sentence on purpose. A writer does not put those two side by side by accident.',
        'Add what you already know: a leash belongs to an animal, a leash on its hook means the animal is home, and an open gate is how an animal gets out. That is ordinary knowledge, the kind everyone in the room shares.',
        'Put it in the formula. The dog has gotten out and Tia has run after it, because the text says she looked at "the empty hook where the leash usually hung, then at the open gate" and then "was running before her mom finished the question."',
        'Check the size of the step. The claim stops at the dog being out. It does not say the dog is lost, or hurt, or that Tia left the gate open herself. None of those has a line under it.',
      ],
      answer:
        'Explicit: the leash hook is empty, the gate is open, and Tia runs. Inference: the dog has gotten out and Tia is going after it, because the empty hook and the open gate appear together and she runs before her mom can finish asking.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-match-the-evidence',
      kind: 'worked_example',
      problem:
        'A student makes a good claim and then attaches the wrong line to it. Fix the evidence.\n\n"Owen carried the poster boards two at a time so the wet paint would not smudge. When the group ran out of tape, he pulled a fresh roll out of his own bag. He was the last one to leave and did not mention it."\n\nStudent answer: Owen shares what he has, because he "carried the poster boards two at a time."',
      steps: [
        'Judge the claim and the evidence separately. That is the whole trick here. The claim, that Owen shares what he has, is fine. Something in this passage does support it.',
        'Now test the quoted line by itself. Read only "carried the poster boards two at a time so the wet paint would not smudge" and ask what it proves. It proves Owen is being careful with wet paint. Careful is not the same as sharing.',
        'So the quote is real but mismatched. This is failure mode two. The quotation marks made the answer look finished, and the line underneath does not hold the claim up.',
        'Hunt for the line that does. Which sentence shows Owen giving something of his own to other people? "When the group ran out of tape, he pulled a fresh roll out of his own bag." Only that one involves his property going to the group.',
        'WRONG: Owen shares what he has, because he "carried the poster boards two at a time." CORRECT: Owen shares what he has, because when the group ran out of tape "he pulled a fresh roll out of his own bag."',
        'Keep the habit. Before you hand in a quote, cover the rest of the passage and read only that line. If the claim still stands, the evidence fits. If it does not, keep looking.',
      ],
      answer:
        'The claim is fine, the evidence is not. The poster-board line shows Owen being careful, not sharing. The line that supports the claim is that when the group ran out of tape "he pulled a fresh roll out of his own bag."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-is-the-inference',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the inference the passage supports.\n\n"Rosa leaned her bike against the fence and pulled off her helmet. Her shirt was stuck to her back with sweat, and she drank the whole water bottle without stopping."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rosa won a race that afternoon.' },
        { id: 'b', text: 'Rosa was wearing a helmet.' },
        { id: 'c', text: 'Rosa does not enjoy riding her bike.' },
        { id: 'd', text: 'Rosa has just finished a hard ride.', correct: true },
      ],
      expectedAnswer: 'Rosa has just finished a hard ride.',
      hints: [
        'An inference is something the passage does NOT say outright. Cross off any choice you can read straight off the page.',
        'Sweat and a whole bottle of water gone are what hard work leaves behind. Check the other choices for a race, or for how Rosa feels about biking, and see whether either one is really in the words.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-line',
      kind: 'try_yourself',
      problem:
        'Claim: Pepper the dog has started to trust Marcus. Which line from the passage best supports that claim?\n\n"The new dog, Pepper, hid under the kitchen table for her first two days. Marcus sat on the floor nearby and read out loud without ever looking at her. By Saturday, Pepper was asleep against his shoe."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"Pepper followed Marcus to the bus stop every morning."' },
        { id: 'b', text: '"The new dog, Pepper, hid under the kitchen table for her first two days."' },
        { id: 'c', text: '"Marcus sat on the floor nearby and read out loud without ever looking at her."' },
        { id: 'd', text: '"By Saturday, Pepper was asleep against his shoe."', correct: true },
      ],
      expectedAnswer: '"By Saturday, Pepper was asleep against his shoe."',
      hints: [
        'The claim is about what PEPPER does now. Two of these lines are about something else: one is about how she acted at the start, one is about what Marcus does.',
        'One choice never appears in the passage at all. Read the four options against the words before you pick.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-supported-or-guess',
      kind: 'try_yourself',
      problem:
        'Read the passage. Three of these are guesses or are contradicted by the words. Which claim does the passage actually support?\n\n"The rain started during second period. At lunch, Dev pushed his tray away and stared out the window. His soccer bag sat zipped beside his chair."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Dev does not like rainy weather in general.' },
        { id: 'b', text: 'Dev left his soccer bag at home this morning.' },
        { id: 'c', text: 'Dev has been told that his game is cancelled.' },
        { id: 'd', text: 'Dev is worried the rain will stop his soccer game.', correct: true },
      ],
      expectedAnswer: 'Dev is worried the rain will stop his soccer game.',
      hints: [
        'One choice is flatly contradicted by a line in the passage. Find that one first and cross it off.',
        'Of the ones left, ask which goes further than the words allow. Nobody in this passage announces anything, and one bad afternoon does not prove how Dev feels about rain every time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-guess-and-mismatch',
      kind: 'misconception_check',
      question:
        'Passage: "Priya sat in the third row of the gym. She checked the clock, then the door, then the clock again. Her jacket had been holding the seat next to her for twenty minutes." Two students answer the question "What can you tell about Priya?" One writes that her friend missed the bus. The other writes that Priya is waiting for someone, because she "sat in the third row of the gym." What went wrong in each?',
      commonErrors: [
        {
          answer: 'Priya is waiting for a friend who missed the bus.',
          misconception:
            'Making a guess. The waiting part is supported, but the reason is invented — the passage never says anything about a bus, or about why the seat is still empty.',
          correctsTo:
            'Split the answer in two and test each half. "Priya is waiting for someone" survives, because her jacket "had been holding the seat next to her for twenty minutes" and she keeps checking the clock and the door. "Her friend missed the bus" has no line behind it at all. It could be true, and that is not the test. The test is whether the words on the page make you say it. Cut the half you cannot point at.',
        },
        {
          answer: 'Priya is waiting for someone, because she "sat in the third row of the gym."',
          misconception:
            'Attaching a real quotation that does not support the claim. Quotation marks make an answer look finished, so this error slips through even when the line proves nothing.',
          correctsTo:
            'Read the quoted line alone and ask whether it makes the claim true. Sitting in the third row tells you where Priya is, not that she is waiting for anybody. The lines that do the work are the saved seat and the checking: her jacket "had been holding the seat next to her for twenty minutes" while she "checked the clock, then the door, then the clock again." Same claim, correct evidence.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Explicit means the text says it outright. An inference is a conclusion the text lets you build from a detail plus what you already know.',
        'Text evidence is the exact wording on the page, not a rough memory of where it was.',
        'Use the formula every time: claim + "because" + the exact words.',
        'A guess is a claim with no line behind it. Ask "does this text make me say it?", not "could this be true?"',
        'A quotation is not proof by itself. Read the line alone and check that it holds up the claim you attached it to.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Text Evidence & Inference' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
