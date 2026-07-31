/**
 * HS English — Reading Poetry: Poetic Form & Structure.
 *
 * How a poem is BUILT (CCSS RL.9-10.5): the line as a unit of attention,
 * the stanza as a paragraph of poetry, enjambment versus end-stopped
 * lines, and free verse versus fixed forms such as the sonnet and the
 * haiku. All example lines are short ORIGINAL verse written for this
 * lesson — no copyrighted quotations, no named poems or poets.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U8_POETIC_FORM_AND_STRUCTURE: LessonPlan = {
  id: 'evelyn.hs.engl.poetic-form-and-structure.v1',
  title: 'Poetic Form & Structure',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.poetic-form-and-structure',
      standard: 'ENGL-8.4',
      description:
        'Read a poem through its structure — lines, stanzas, enjambment versus end-stopped lines, and free verse versus fixed forms such as the sonnet and the haiku — and explain how a specific structural choice shapes the poem\'s meaning or pace (CCSS RL.9-10.5).',
    },
  ],
  prerequisites: ['engl.sound-devices'],
  followUps: ['engl.thesis-statements'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a line break changes meaning before any poem is on the table, then point the intuition at how poems are built.',
      script:
        'Send a friend the message "I am fine" and nothing happens. Send the same three words as two lines — "I am" on one line, "fine." on the next — and your friend starts worrying. Not one word changed. Only the break did. Comedians run the same machine: the pause before the punchline does more work than the words after it. Poets have been engineering that pause for centuries, and they have names for the tools — line, stanza, break, form. We have spent this unit listening to how poems SOUND. Today we look at how they are BUILT, and at why moving one word down to the next line is a real change to the poem.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-line-stanza-form',
      kind: 'concept',
      goal: 'Line versus sentence, stanza, enjambment versus end-stop and their pacing effects, free verse versus fixed forms, and the two habits that make poems readable.',
      keyIdeas: [
        'LINE VS SENTENCE — the sentence is the unit of MEANING; the line is the poet\'s unit of ATTENTION. Prose ends its lines wherever the margin happens to fall, but a poet chooses every single ending, so each break is a small instruction about where to look and how long to linger.',
        'STANZA = PARAGRAPH OF POETRY — a group of lines set off by white space. A stanza break signals a shift: new time, new speaker, new idea, or simply a silence the reader has to walk across before the next line arrives.',
        'END-STOPPED — the line ends where the thought ends, usually with punctuation: "The kettle screamed. / We let it." The reader gets a full stop at the edge of the line, so the poem moves in clean, deliberate steps.',
        'ENJAMBED — the sentence runs over the break into the next line: "Some mornings the noise / is the only company." The reader has to keep going, so the poem gains speed, and the word stranded at the line end ("noise") gets a moment of extra weight before the sentence resolves it.',
        'PACING IS THE POINT — a stack of end-stopped lines feels measured, even heavy; a run of enjambed lines feels breathless. Switching between the two is how a poet changes the speed of a poem without changing a single word of the sentence.',
        'FREE VERSE VS FIXED FORMS — free verse inherits no meter and no rhyme scheme, but it is structure BY CHOICE, not the absence of structure: the poet still picks every line ending and every stanza length. A fixed form arrives with its rules already attached — a SONNET runs fourteen lines and pivots at a turn called the VOLTA, where the argument changes direction; a HAIKU runs three lines of five, seven, and five syllables and pivots on an image rather than an argument.',
        'READ THE SENTENCE, NOT THE LINE — when a poem confuses you, read straight through the breaks to the punctuation and find the sentence first. Then reread and ask what each break did to it. Stopping hard at every line ending is the most common way to garble an enjambed poem.',
        'LINE BREAKS ARE NEVER RANDOM — "the poet just hit enter" is not an analysis. Assume the ending word was chosen on purpose, ask why THAT word was given the edge of the line, and the structural argument writes itself.',
      ],
      vocabulary: [
        { term: 'enjambment', definition: 'a line break that interrupts a sentence, carrying the thought over into the next line.' },
        { term: 'end-stopped line', definition: 'a line whose ending coincides with the end of a phrase or sentence, usually marked by punctuation.' },
        { term: 'volta', definition: 'the turn in a sonnet where the argument or feeling shifts direction, traditionally near line nine.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-enjambment-emphasis',
      kind: 'worked_example',
      problem:
        'Analyze how the line breaks shape emphasis in these four original lines: "The bridge held / everything we carried / across the water / and then let go."',
      steps: [
        'Find the sentence first, ignoring the breaks: The bridge held everything we carried across the water and then let go. One sentence spread over four lines, so every line ending except the last is enjambed.',
        'Now read line by line and notice the false endings. Line 1, "The bridge held," lands as a complete thought — the bridge held, it did not fail. The reader commits to that reading for a beat.',
        'Line 2 revises it: the bridge did not simply hold, it held "everything we carried." The enjambment let the reader believe one thing and then corrected it, so the emphasis is built out of the break rather than out of an adjective.',
        'The final break is the loudest. After three lines of holding, "and then let go" sits alone at the end, isolated by the break. Run those same words together in one prose sentence and the reversal slides by unnoticed.',
      ],
      answer:
        'The enjambments create false endings — "The bridge held" reads as complete until line 2 revises it — and the last break isolates "and then let go," so the structure, not the vocabulary, delivers the reversal',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hard-stop-error',
      kind: 'worked_example',
      problem:
        'A student reads these original lines aloud, stopping hard at the end of every line: "My mother kept the light / on for a boy who never / came home." The student then says the poem is confusing, and that because it is free verse the breaks were random anyway. Two things went wrong — what are they?',
      steps: [
        'Error one: treating line breaks as punctuation. Stopping hard after "the light" turns a fragment into a false sentence, and "on for a boy who never" is not a thought at all. The lines were never meant to be read as separate sentences.',
        'The fix is to read the sentence, not the line: My mother kept the light on for a boy who never came home. The meaning is clear now, and the breaks become a second layer sitting on top of a sentence the reader already understands.',
        'Reread with a light hesitation, not a stop, at each break. "My mother kept the light" holds a hopeful image for a beat; "on for a boy who never" strands the reader on "never"; "came home" drops the ending. That hesitation is the effect the poet built.',
        'Error two: free verse is not the absence of structure. There is no fixed meter or rhyme here, but the poet still chose to break after "never" instead of after "boy." That choice IS the structure, and naming it is exactly what the analysis is supposed to do.',
      ],
      answer:
        'The student read the line breaks as full stops instead of reading the sentence through them, and mistook the absence of a fixed form for the absence of structural choices — the break that strands "never" is deliberate and analyzable',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-enjambment',
      kind: 'try_yourself',
      problem:
        'Read these original lines: "The kettle screamed. / We let it. / Some mornings the noise / is the only company." Which line break is ENJAMBED?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The break after "The kettle screamed."' },
        { id: 'b', text: 'The break after "We let it."' },
        { id: 'c', text: 'The break after "the noise"', correct: true },
        { id: 'd', text: 'None of them — every line here ends a complete thought' },
      ],
      expectedAnswer: 'The break after "the noise"',
      hints: [
        'An end-stopped line finishes its thought at the edge, usually with punctuation; an enjambed line hands an unfinished sentence to the next line.',
        'Two of these lines end with a period. Find the one whose sentence is only half built when the line runs out.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-stanza-break-effect',
      kind: 'try_yourself',
      problem:
        'A poem\'s first stanza fills a kitchen with relatives, stacked dishes, and overlapping talk. Then comes a blank line, and the final stanza is a single line: "Now I set one plate." What is the stanza break doing?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Creating a silence that enacts the years and the loss between the two scenes', correct: true },
        { id: 'b', text: 'Signalling that a different character has started speaking' },
        { id: 'c', text: 'Marking the point where the rhyme scheme changes' },
        { id: 'd', text: 'Separating the sections so the poem is easier to print on a page' },
      ],
      expectedAnswer: 'Creating a silence that enacts the years and the loss between the two scenes',
      hints: [
        'A stanza break is a paragraph break made of white space. Ask what happens in the gap, not just on either side of it.',
        'A crowd sits on one side of the blank line and one plate sits on the other. What does the reader feel while crossing it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-form',
      kind: 'try_yourself',
      problem:
        'A poem runs exactly fourteen lines, and around line nine the speaker stops piling up complaints and turns toward a resolution. Which form best matches that description?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A haiku' },
        { id: 'b', text: 'A sonnet', correct: true },
        { id: 'c', text: 'Free verse' },
        { id: 'd', text: 'A couplet' },
      ],
      expectedAnswer: 'A sonnet',
      hints: [
        'Two facts are doing the work here: the exact line count, and the place where the poem changes direction.',
        'Fourteen lines with a turn around line nine — and that turn has a name, the volta.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-free-verse-structureless',
      kind: 'misconception_check',
      question:
        'A student says: "Free verse has no rules, so the poet just pressed enter wherever it felt right. There is nothing to analyze about the structure of a free verse poem." What went wrong?',
      commonErrors: [
        {
          answer: 'Free verse has no form, so its line breaks are arbitrary and not worth analyzing',
          misconception: 'Reading free verse as the absence of structure, rather than as structure chosen line by line instead of inherited from a fixed form.',
          correctsTo:
            'Free verse gives up fixed meter and rhyme, not structure. The poet still decides where every line ends, how long each stanza runs, and which word is left hanging at a break — and those decisions do the pacing and emphasis work that meter and rhyme do inside a sonnet. Ask why THIS word was given the end of the line, and the analysis is already underway.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The sentence is the unit of meaning and the line is the poet\'s unit of attention — read the sentence first, then ask what the breaks did to it.',
        'End-stopped lines close a thought and slow the poem down; enjambed lines push the sentence over the break, speed it up, and strand the last word for emphasis.',
        'A stanza is a paragraph of poetry, and the white space between stanzas is a silence the reader has to cross.',
        'Fixed forms arrive with rules — a sonnet is fourteen lines with a volta, a haiku is three lines of five, seven, and five with an image pivot — while free verse makes structural choices without inheriting them.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Poetic Form & Structure' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
