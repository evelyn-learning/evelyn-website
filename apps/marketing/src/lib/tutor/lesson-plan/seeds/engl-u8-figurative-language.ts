/**
 * HS English — Reading Literature: Metaphor, Simile & Personification.
 *
 * Figurative comparison as meaning-making (CCSS RL.9-10.4, L.9-10.5):
 * naming the two things compared, the quality carried across, and the
 * difference between a figure and a literal likeness. All verse and prose
 * excerpts are short ORIGINAL lines written for this lesson — no
 * copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U8_FIGURATIVE_LANGUAGE: LessonPlan = {
  id: 'evelyn.hs.engl.figurative-language.v1',
  title: 'Metaphor, Simile & Personification',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.figurative-language',
      standard: 'ENGL-8.1',
      description:
        'Identify metaphor, simile, personification, and hyperbole in literary and everyday language, and interpret what each comparison adds by naming the two things compared and the quality transferred between them (CCSS RL.9-10.4, L.9-10.5).',
    },
  ],
  prerequisites: ['engl.inference-and-evidence'],
  followUps: ['engl.imagery-and-symbolism'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that figurative language is ordinary speech, not decoration — then point that instinct at poetry.',
      script:
        'A commentator yells "he is on fire" and nobody calls the fire department. Your friend is "drowning in homework" and stays completely dry. Someone gets nicknamed The Wall and everyone instantly knows he does not let anything past him. None of those sentences is literally true, and every one of them is precisely true — that is the trade figurative language makes. Poets did not invent this move; they just aim it carefully. Today we learn to name the figure, then do the harder and more interesting thing: say exactly what it carries across.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-figures',
      kind: 'concept',
      goal: 'The four core figures, the transfer test that interprets them, and the like/as shortcut that mislabels literal comparisons.',
      keyIdeas: [
        'SIMILE — an EXPLICIT comparison of two unlike things, flagged by like, as, than, or resembles: "Her patience was thin as frost on a windshield." The signal word keeps the two things separate; they are held side by side.',
        'METAPHOR — an IMPLICIT comparison that states the equation outright, with no signal word: "Her patience was frost." Metaphor is the bolder move because it claims identity instead of resemblance, so the reader has to work out how the two things can possibly be the same.',
        'THE TRANSFER TEST — the whole interpretation, in three questions. What is being described? What is it compared to? WHICH QUALITY crosses from one to the other? "Grief is a locked room" transfers enclosure and no-way-out, not walls and hinges. Naming the figure is labeling; naming the transferred quality is reading.',
        'PERSONIFICATION — giving human qualities, actions, or intentions to something nonhuman: "The kettle complained on the burner." Test it by asking whether the verb or adjective requires a mind — complaining does, boiling does not.',
        'HYPERBOLE — deliberate, obvious exaggeration for emphasis, not meant to be believed: "I have apologized nine thousand times." The point is the size of the feeling, not the size of the number. If a reader could plausibly take it as fact, it is not hyperbole.',
        'EXTENDED METAPHOR — one comparison sustained across several lines or a whole poem, with new details drawn from the same source: if hope starts as a small fire, later lines can add kindling, wind, and ash. Watch for the sustained image; it usually carries the poem\'s argument.',
        'NOT LITERALLY FALSE — MEANING TRUE — a figure is not a lie or a mistake. "The city never sleeps" is false as a fact and accurate as a description. Judging a figure by its literal truth is the fastest way to miss what it says.',
        'THE LIKE / AS SHORTCUT ERROR — the signal word alone does not make a simile. "He ran like the wind" compares two UNLIKE things (a runner, moving air) and is a simile. "She acts like her sister" compares two like things and is a plain literal comparison — no quality is transferred across a gap, so there is nothing figurative to interpret. Ask what gap the comparison crosses before you label it.',
      ],
      vocabulary: [
        { term: 'figurative language', definition: 'language that means something other than its literal statement, usually by comparing one thing to another.' },
        { term: 'vehicle and tenor', definition: 'the tenor is the thing actually being described; the vehicle is what it is compared to. The meaning lives in the quality the vehicle lends the tenor.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-interpret-metaphor',
      kind: 'worked_example',
      problem:
        'Interpret the figurative language in these original lines: "My grandmother\'s kitchen was a lighthouse. / Every lost cousin steered for that yellow window, / and nobody ever asked how far they had drifted."',
      steps: [
        'Identify the figure: the kitchen IS a lighthouse — an equation with no like or as, so this is a metaphor, not a simile.',
        'Name both sides of the comparison. Tenor: the grandmother\'s kitchen. Vehicle: a lighthouse.',
        'Run the transfer test — ask which qualities of a lighthouse are being lent. A lighthouse is a fixed, visible signal that guides people who are off course, and it does so without judging why they strayed.',
        'Check which qualities do NOT transfer: nobody claims the kitchen is tall, stone, or on a cliff. Selecting the relevant quality is the reader\'s job.',
        'Confirm the rest of the image agrees: "steered," "drifted," and the "yellow window" all belong to the same sea-and-beacon picture, so the metaphor is extended across the lines rather than dropped after one.',
        'State the meaning in a sentence: the kitchen functioned as a steady, welcoming point of orientation for family members who had lost their bearings.',
      ],
      answer:
        'Metaphor — the kitchen (tenor) is compared to a lighthouse (vehicle), transferring the qualities of a constant, visible refuge that guides the lost home without asking questions; "steered" and "drifted" extend the image',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-literal-reading-error',
      kind: 'worked_example',
      problem:
        'A student reads the line "The old bridge groaned under the truck, tired of holding up a town that had stopped thanking it" and answers: "This is a simile, because the bridge is compared to a tired person. Also it is not true — bridges cannot get tired." Two errors are hiding here. Find both and fix them.',
      steps: [
        'Check the label first. A simile needs an explicit signal word — like, as, than, resembles. The line has none; it assigns human states directly to the bridge. That makes it personification, not simile.',
        'Diagnose why the student reached for simile: hearing any comparison and reaching for the like/as category is the most common labeling reflex. The presence of a comparison does not fix the figure.',
        'Confirm the personification by testing the words: "groaned," "tired of," and "thanking" all require a mind or a body. A bridge can creak, but only a creature can be tired of something.',
        'Address the second error — reading the figure literally. "Bridges cannot get tired" is factually correct and critically useless; nobody was claiming the bridge has feelings.',
        'Replace the literal test with the transfer test: what does human weariness lend the bridge? Long service, accumulated strain, and — through "stopped thanking it" — the town\'s neglect of something it depends on.',
        'State the corrected reading: personification transfers weariness and unacknowledged labor to the bridge, so the line is about the town\'s ingratitude as much as about the structure.',
      ],
      answer:
        'It is personification, not simile — no like or as, and human states are assigned directly to the bridge; and a figure is judged by what it transfers (long strain, unthanked service), not by whether it is literally true',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-figure',
      kind: 'try_yourself',
      problem:
        'Which figure of speech appears in these original lines? "The wind read the newspaper on the bench, / turned a page, and lost interest."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Personification', correct: true },
        { id: 'b', text: 'Simile' },
        { id: 'c', text: 'Hyperbole' },
        { id: 'd', text: 'No figurative language — this describes a literal breeze' },
      ],
      expectedAnswer: 'Personification',
      hints: [
        'Look for a signal word. Is there a like or an as anywhere in the lines?',
        'Reading, turning a page, and losing interest all require a mind. What is doing them?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpret-transfer',
      kind: 'try_yourself',
      problem:
        'Read the original line: "His apology was a paper umbrella." What does the metaphor most likely convey about the apology?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It looked like protection but fell apart the moment it was needed', correct: true },
        { id: 'b', text: 'It was written down on paper rather than spoken aloud' },
        { id: 'c', text: 'It was colorful and decorative in an appealing way' },
        { id: 'd', text: 'It was offered during a rainstorm, which made it awkward' },
      ],
      expectedAnswer: 'It looked like protection but fell apart the moment it was needed',
      hints: [
        'Name both sides first: the apology is the tenor, the paper umbrella is the vehicle.',
        'An umbrella is supposed to shelter you. What happens to a paper one in actual rain? That failure is the quality being transferred.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-personification',
      kind: 'try_yourself',
      problem: 'Which sentence uses personification?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The fog pressed its face to the window and waited for us to leave.', correct: true },
        { id: 'b', text: 'The fog was as thick as wet cotton that morning.' },
        { id: 'c', text: 'The fog rolled in from the harbor before sunrise.' },
        { id: 'd', text: 'I have told you a billion times to shut the window.' },
      ],
      expectedAnswer: 'The fog pressed its face to the window and waited for us to leave.',
      hints: [
        'Three of these are a simile, a plain literal description, and hyperbole. Sort them before choosing.',
        'Personification needs a human action, intention, or body part given to something nonhuman. Which fog has a face and a plan?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-every-like-is-simile',
      kind: 'misconception_check',
      question:
        'A student says: "The sentence \'She sings like her mother did\' is a simile, because it has the word like. Every like or as means simile." What went wrong?',
      commonErrors: [
        {
          answer: 'Any sentence containing like or as is a simile',
          misconception: 'Labeling by signal word alone, without checking whether the comparison crosses a gap between unlike things.',
          correctsTo:
            'A simile compares two UNLIKE things so that a quality can transfer across the gap — "she sings like a hinge in a hurricane." Comparing a singer to another singer is a literal comparison of manner: same category, nothing transferred, nothing to interpret. Test the gap first, then apply the label.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simile compares explicitly with like or as; metaphor states the equation with no signal word.',
        'The transfer test is the interpretation: name the two things compared, then name the single quality that crosses over.',
        'Personification gives human minds or bodies to nonhuman things; hyperbole exaggerates so obviously that nobody is meant to believe it.',
        'A figure is literally false and meaning true — and a like or as between two similar things is a plain comparison, not a simile.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Metaphor, Simile & Personification' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
