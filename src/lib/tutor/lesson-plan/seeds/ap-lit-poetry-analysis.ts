/**
 * AP Lit — Poetry Analysis Essay (Q1).
 *
 * The poetry FRQ. Identifying speaker, tone, devices, structure, and meaning.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LIT_POETRY_ANALYSIS: LessonPlan = {
  id: 'evelyn.ap.lit.poetry-analysis.v1',
  title: 'AP Lit Poetry Analysis Essay',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ela',
  topic: 'literature',
  locale: 'en',
  los: [
    {
      id: 'aplit.poetry-analysis',
      description: 'Write an analytical essay on a given poem identifying speaker, tone, structure, key devices, and how they together produce meaning.',
      standard: 'AP-LIT-Q1',
    },
  ],
  prerequisites: ['aplit.literary-elements'],
  followUps: ['aplit.q3-essay'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame poetry analysis as evidence-based argument.',
      script: 'AP graders aren\'t looking for your feelings about the poem. They want a CLAIM about meaning, and EVIDENCE from the poem itself. Identify what the poem is doing — through speaker, tone, structure, imagery — and argue HOW those choices produce that meaning. The essay is an argument, not a reaction.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'A repeatable method: SPEAKER → TONE → STRUCTURE → DEVICES → MEANING.',
      keyIdeas: [
        'STEP 1 — READ TWICE: once for surface meaning, once for craft. Mark shifts, repetitions, odd word choices.',
        'STEP 2 — IDENTIFY SPEAKER: not always the poet. Pay attention to point of view (first vs third), stance (sympathetic, ironic, distant). The speaker\'s relationship to the subject is meaning.',
        'STEP 3 — TONE: the speaker\'s ATTITUDE toward the subject. Bitter? Reverent? Detached? Trace where the tone shifts. The shift itself is often the heart of the poem.',
        'STEP 4 — STRUCTURE: form (sonnet, free verse, ballad), stanza breaks, line lengths, end-stops vs enjambment, rhyme. Form is content. A sonnet promising rebellion AGAINST the sonnet form is doing something.',
        'STEP 5 — DEVICES: imagery, metaphor, personification, allusion, sound (alliteration, assonance), syntax, diction (formal, casual, archaic). Don\'t list — connect each to MEANING.',
        'STEP 6 — MEANING / THEME: what does the poem ultimately argue or reveal? Tie back to your evidence.',
        'THESIS shape (essay opens with this): "Through [device 1], [device 2], and [structural choice], [poem] develops [a complex theme/argument]." Avoid summary; commit to a claim.',
        'EVIDENCE: quote SHORT phrases (3-5 words) and analyze. Embed quotes inside your sentences. NEVER quote a full line as a stand-alone.',
        'COMMON ERRORS: paraphrasing the poem instead of analyzing; "I think the poet wants the reader to feel..." (no claim); naming devices without showing their function ("the poet uses imagery" — what imagery, doing what?).',
      ],
      vocabulary: [
        { term: 'enjambment', definition: 'a line of poetry that runs over into the next without a syntactic pause.' },
        { term: 'tone', definition: 'the speaker\'s attitude toward the subject, evident in word choice and rhythm.' },
        { term: 'volta', definition: 'a turn or shift in argument or tone, common in sonnets after line 8 or 12.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-example',
      kind: 'worked_example',
      problem: 'Apply the method to Frost\'s "Stopping by Woods on a Snowy Evening" (sketch a thesis + one analytical paragraph).',
      steps: [
        'SPEAKER: a traveler stopping in dark woods on the darkest evening of the year.',
        'TONE: contemplative, drawn to the woods, but pulled back by duty. Tension between escape and obligation.',
        'STRUCTURE: four quatrains, AABA-AABA-AABA-AAAA rhyme. The repetition in the final stanza ("And miles to go before I sleep" twice) is structurally unique — the form RESISTS resolution.',
        'DEVICES: imagery of "lovely, dark, and deep" woods; "promises to keep" hints at obligation; the doubled final line creates incantation, suggesting the speaker is convincing himself.',
        'THESIS sketch: "Through the seductive imagery of the woods and the structural repetition of the closing couplet, Frost dramatizes the speaker\'s reluctant return to obligation, suggesting that duty triumphs only with effort."',
        'PARAGRAPH: "The repetition of \'miles to go before I sleep\' in the final stanza performs the very act of self-persuasion the speaker requires. By doubling the line — the only quatrain in which a line repeats — Frost converts the words into a kind of mantra, signaling that the speaker must talk himself out of the woods\' pull. The form enacts the theme: duty isn\'t natural; it must be repeated to take hold."',
      ],
      answer: 'Method demonstrates how form, device, and theme tie together — the form ENACTS the theme.',
      estimatedMinutes: 7,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a one-sentence thesis for a poem you analyzed in class. Use the formula: "Through [X] and [Y], [poem] develops [theme]."',
      expectedAnswer: 'A complete one-sentence thesis using the formula. Example: "Through the imagery of confinement and the repetition of \'I, too\', Hughes\'s \'I, Too\' develops a defiant assertion of belonging that frames exclusion as temporary."',
      responseFormat: 'free',
      hints: [
        'Pick TWO craft choices to scaffold the thesis.',
        'Don\'t just summarize the poem — claim something.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-summary',
      kind: 'misconception_check',
      question: 'Is summarizing what the poem says (line by line) a strong way to start an analysis essay?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing summary with analysis.',
          correctsTo: 'No. Summary describes WHAT the poem says; analysis explains HOW the poem produces meaning. Graders read thousands of essays — summary signals "I haven\'t made an argument yet". Open with a thesis claim about how craft choices produce meaning, then develop with quoted evidence. If you find yourself paraphrasing, ask: SO WHAT? Why does that matter?',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Speaker → Tone → Structure → Devices → Meaning. Don\'t skip steps.',
        'Thesis names two craft choices and the meaning they produce.',
        'Quote short phrases, embed them, analyze immediately.',
        'Form is content. A choice of form is itself an argument.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does AP Lit reward essays that name a SHIFT or TENSION in the poem?',
      hint: 'Poems are usually small dramas — a movement from one state to another, or a tension between two pulls. Essays that identify the shift are arguing about what the poem DOES, not just what it says. Static descriptions ("the poem is sad") miss the dynamic. Look for volta, tonal shift, change in pronoun, change in tense.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
