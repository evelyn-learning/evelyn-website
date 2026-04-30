/**
 * AP Lang — Rhetorical Analysis Essay (Q2).
 *
 * Identifying author's rhetorical choices and their effect on the audience.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_LANG_RHETORICAL_ANALYSIS: LessonPlan = {
  id: 'evelyn.ap.lang.rhetorical-analysis.v1',
  title: 'AP Lang Rhetorical Analysis Essay',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ela',
  topic: 'literature',
  locale: 'en',
  los: [
    {
      id: 'aplang.rhetorical-analysis',
      description: 'Analyze how an author\'s rhetorical choices — appeals, diction, syntax, structure — develop a line of reasoning to achieve a specific purpose for a specific audience.',
      standard: 'AP-LANG-Q2',
    },
  ],
  prerequisites: ['aplang.argument-essay'],
  followUps: ['aplang.synthesis'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Rhetorical analysis as reverse-engineering persuasion.',
      script: 'When MLK writes "Letter from Birmingham Jail" or Lincoln gives the Gettysburg Address, every word is a deliberate choice. Your job in the rhetorical analysis essay is to figure out HOW those choices work — what audience they target, what feelings they evoke, what argument they advance. You\'re reverse-engineering the rhetoric, not just admiring it.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'A method: SOAPS → APPEALS → CHOICES → EFFECTS → THESIS.',
      keyIdeas: [
        'SOAPS: Speaker (who is writing?), Occasion (when, in response to what?), Audience (who is the intended reader?), Purpose (to convince of what? to do what?), Subject (the topic).',
        'APPEALS (Aristotle): ETHOS (credibility, character of speaker — "as a doctor of 30 years..."), PATHOS (emotion — "imagine your child..."), LOGOS (logic and evidence — "studies show...").',
        'RHETORICAL CHOICES to look for: DICTION (word choice — formal? casual? loaded?), SYNTAX (sentence structure — short emphatic vs long winding), STRUCTURE (the organization of the argument — refutation, concession, climactic), TONE (attitude toward subject and audience), FIGURATIVE LANGUAGE (metaphor, irony, allusion), REPETITION + PARALLELISM (anaphora, isocolon).',
        'CONNECT CHOICE TO EFFECT: don\'t just NAME a device; show what it DOES for the audience and purpose. "The repetition of \'I have a dream\' creates a rhythmic incantation that builds emotional momentum, drawing the audience into the speaker\'s vision and converting individual hope into shared resolve."',
        'THESIS shape: "Through [choice 1] and [choice 2], [author] develops [a line of reasoning] to [purpose] for [audience]." Avoid generic praise — name SPECIFIC choices.',
        'CHOOSE DEFENSIBLE CHOICES: don\'t analyze every device. Pick 2–3 that genuinely advance the argument. Depth beats breadth.',
        'COMMON ERRORS: listing devices with no analysis ("she uses pathos and ethos"), summarizing the passage instead of analyzing, praising the writer ("MLK is a great writer") without making a claim about HOW.',
      ],
      vocabulary: [
        { term: 'anaphora', definition: 'repetition of the same word or phrase at the start of successive clauses.' },
        { term: 'ethos / pathos / logos', definition: 'Aristotle\'s three appeals — credibility, emotion, logic.' },
        { term: 'rhetorical situation', definition: 'speaker, audience, occasion, purpose, subject — the SOAPS context.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mlk',
      kind: 'worked_example',
      problem: 'Sketch a thesis + one analytical paragraph for MLK\'s "Letter from Birmingham Jail".',
      steps: [
        'SOAPS: MLK writing from jail to white moderate clergy who criticized his protests as untimely.',
        'PURPOSE: defend nonviolent direct action, persuade moderates to support civil rights NOW, reframe "wait" as a privilege of those not suffering.',
        'CHOICES: ETHOS (cites Augustine, Aquinas, Niebuhr — religious authority moderates respect); STRUCTURE (concession-then-refutation — acknowledges their concerns then dismantles each); ALLUSION (biblical figures, founding documents) — borrows their frame.',
        'PATHOS: the long catalog of "when you have seen vicious mobs lynch your mothers and fathers..." — concrete suffering, second-person address, builds shared moral weight.',
        'THESIS sketch: "Through extended biblical and historical allusion and the rhetorical structure of concession-then-refutation, King redirects the white moderate clergy\'s objections back at themselves, framing inaction as the true betrayal of their shared faith."',
        'PARAGRAPH: "King\'s decision to cite Aquinas and Augustine — figures the clergy revere — is itself an act of strategic ethos. By deploying the moderates\' own intellectual heritage, King precludes the dismissal that he is acting outside their tradition. The structural move is generous in form (\'I had hoped that you would understand\') but devastating in content: it converts shared authority into shared obligation, leaving the moderates with no neutral ground from which to counsel patience."',
      ],
      answer: 'Method demonstrates how named choices (ethos via authority, structure of concession-refutation) advance the argument for the specific audience.',
      estimatedMinutes: 7,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a one-sentence thesis for a speech you\'ve analyzed. Formula: "Through [choice 1] and [choice 2], [speaker] develops [reasoning] to [purpose] for [audience]."',
      expectedAnswer: 'Example: "Through anaphora on \'we shall fight\' and concession to past defeat, Churchill galvanizes a war-weary British public to commit to continued resistance against Nazi Germany."',
      responseFormat: 'free',
      hints: [
        'Name TWO craft choices.',
        'Pin down the audience — vague \'the reader\' is weaker than \'a war-weary British public\'.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-naming-devices',
      kind: 'misconception_check',
      question: 'Is identifying many rhetorical devices a strong rhetorical analysis essay?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating analysis as a device-spotting exercise.',
          correctsTo: 'No — listing devices is the cardinal sin of weak rhet-analysis essays. Graders specifically look for HOW the device produces an effect for the audience and purpose. "MLK uses anaphora" is naming. "MLK\'s anaphora on \'I have a dream\' converts a personal vision into a collective rallying cry, drawing the audience into shared aspiration" is analysis. Two strong choices analyzed deeply beat ten devices listed.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SOAPS first. Audience and purpose anchor everything.',
        'Connect each choice to its EFFECT on the audience\'s response to the purpose.',
        'Pick 2-3 choices, analyze deeply. Don\'t list.',
        'Thesis names choices AND purpose AND audience.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the AP rubric specifically reward "explaining how rhetorical choices contribute to the author\'s argument or purpose"?',
      hint: 'The rubric language is asking you to LINK choice → effect → purpose. Mere description of a passage shows reading; mere device naming shows vocabulary. Linking choice → effect → purpose shows REASONING — which is what the test is measuring. Internalize the chain when you read.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
