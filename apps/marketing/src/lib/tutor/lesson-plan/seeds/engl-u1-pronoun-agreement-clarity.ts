/**
 * HS English — Grammar & Usage: Pronouns (Agreement, Case & Clarity).
 *
 * The second usage skill in the unit (CCSS L.9-10.1): match a pronoun to
 * its TRUE antecedent, choose subject vs object case (I/me, who/whom) by
 * job rather than by ear, and repair pronouns whose reference is ambiguous
 * or vague. Every practice item is a revision-choice or error-spot MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U1_PRONOUN_AGREEMENT_CLARITY: LessonPlan = {
  id: 'evelyn.hs.engl.pronoun-agreement-clarity.v1',
  title: 'Pronouns: Agreement, Case & Clarity',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.pronoun-agreement-clarity',
      standard: 'ENGL-1.3',
      description:
        'Match every pronoun to its true antecedent in number, choose subject or object case (I/me, who/whom) by the job the pronoun does, and revise pronouns whose reference is ambiguous or vague (CCSS L.9-10.1).',
    },
  ],
  prerequisites: ['engl.subject-verb-agreement'],
  followUps: ['engl.verb-tense-and-form'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pronoun slips confuse readers and cost credibility — frame the skill as keeping real writing clear and precise.',
      script:
        'Pronouns are the smallest words you write and the ones that cause the most confusion. Send a group email that says "Dana told Sam that she got the internship" and two people will read two different pieces of news. Write "between you and I" in a college essay and a reader who knows the rule hears the mistake instead of your story. Today you get three quick tests: match the pronoun to the real noun behind it, decide subject or object by the job the pronoun does, and make sure every pronoun points at exactly one thing a reader can name.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pronoun-rules',
      kind: 'concept',
      goal: 'Antecedent agreement, the case tests (cover test, he/him for who/whom), and the two clarity failures.',
      keyIdeas: [
        'AGREEMENT WITH THE ANTECEDENT — a pronoun matches the noun it stands for, and that noun is the TRUE antecedent, never the nearest noun. WRONG: "The debate club posted their schedule." CORRECT: "The debate club posted its schedule," because "club" names one group acting as a unit.',
        'INDEFINITE ANTECEDENTS — each, either, neither, everyone, everybody, anyone, and nobody are singular, so the pronoun pointing back to them is singular. WRONG: "Each of the poets read their poem twice." CORRECT: "Each of the poets read the poem twice." Rewriting the whole sentence as plural also works: "All of the poets read their poems twice."',
        'SUBJECT CASE vs OBJECT CASE — I, we, he, she, they, and who perform the action; me, us, him, her, them, and whom receive the action or follow a preposition. WRONG: "Me and Jordan filmed the interview." CORRECT: "Jordan and I filmed the interview."',
        'THE COVER TEST — in a compound, cover the other name and read the sentence alone. "The director thanked Jordan and (I / me)" becomes "The director thanked me," so the compound must be "Jordan and me." Politeness never decides case. WRONG: "between you and I." CORRECT: "between you and me," because "between" is a preposition and prepositions take object case.',
        'WHO vs WHOM — rebuild the inner clause with he or him. If "he" fits, use who; if "him" fits, use whom. "The reporter WHO called" (he called) versus "the reporter WHOM we called" (we called him). The final m of whom matches the m of him.',
        'AMBIGUOUS REFERENCE — if a pronoun could point to two different nouns, the reader has to guess. WRONG: "Nadia told Priya that she had been chosen." CORRECT: name the person outright: "Nadia told Priya that Priya had been chosen."',
        'VAGUE REFERENCE — this, that, it, and which must point at a specific noun, not at a whole previous clause. WRONG: "The rehearsal ran two hours late, which frustrated the crew." CORRECT: "The rehearsal ran two hours late, and the delay frustrated the crew."',
        'NO ANTECEDENT AT ALL — a pronoun with nothing behind it is the easiest error to cut. WRONG: "In the article it says the levee held." CORRECT: "The article says the levee held." If you cannot point to the noun, delete the pronoun and name the thing.',
      ],
      vocabulary: [
        { term: 'antecedent', definition: 'the noun a pronoun stands for and must agree with in number.' },
        { term: 'case', definition: 'the form a pronoun takes based on its job — subject (I, she, who) or object (me, her, whom).' },
        { term: 'ambiguous reference', definition: 'a pronoun that could sensibly point to two different nouns, so the reader cannot tell which is meant.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-case-cover-test',
      kind: 'worked_example',
      problem:
        'Choose the correct pronoun: "The festival organizers handed the microphone to Jordan and (I / me) right before the closing act."',
      steps: [
        'Decide the job the pronoun does: it sits after the preposition "to," so it is receiving something, not performing the action.',
        'Run the cover test — hide "Jordan and" and read the sentence alone: "The festival organizers handed the microphone to me."',
        '"To I" is not English, so the object form is the correct one. Adding a second name to the phrase never changes the case.',
        'Final sentence: "The festival organizers handed the microphone to Jordan and ME right before the closing act."',
      ],
      answer: 'me — the pronoun follows the preposition "to," so it takes object case: "to Jordan and me"',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hypercorrection-trap',
      kind: 'worked_example',
      problem:
        'A student writes this line in a personal essay: "Between you and I, the interview changed how I saw my grandmother." The student defends it by saying that "I" sounds more formal. Is the sentence correct?',
      steps: [
        'Name the pattern first: "between" is a preposition, and every preposition takes an object pronoun after it.',
        'The object forms are me, us, him, her, them, and whom, so the required phrasing is "between you and me."',
        'Why the ear fails here: students are corrected so often for saying "me and my friend went" that they begin swapping "I" in everywhere, a habit called hypercorrection. Formality is not a grammar rule; the job of the pronoun is.',
        'The cover test confirms it: "between I" is impossible, while "between me" is natural.',
      ],
      answer:
        'No — WRONG: "Between you and I." CORRECT: "Between you and me, the interview changed how I saw my grandmother."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-who-whom',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The volunteer coordinator ___ we emailed last week returned our call this morning."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'whom', correct: true },
        { id: 'b', text: 'who' },
        { id: 'c', text: 'whose' },
        { id: 'd', text: 'which' },
      ],
      expectedAnswer: 'whom',
      hints: [
        'Rebuild the inner clause with he or him: "we emailed ___ last week." Which form fits?',
        '"We emailed him" fits, so the object form is required: whom.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ambiguous-reference',
      kind: 'try_yourself',
      problem:
        'A student film review contains this line: "Nadia showed the rough cut to Priya, and she suggested trimming the opening scene." Which revision removes the ambiguity?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nadia showed the rough cut to Priya, and Priya suggested trimming the opening scene.', correct: true },
        { id: 'b', text: 'Nadia showed the rough cut to Priya, and she herself suggested trimming the opening scene.' },
        { id: 'c', text: 'Nadia showed the rough cut to Priya, and they suggested trimming the opening scene.' },
        { id: 'd', text: 'Nadia showed the rough cut to Priya, and this suggested trimming the opening scene.' },
      ],
      expectedAnswer: 'Nadia showed the rough cut to Priya, and Priya suggested trimming the opening scene.',
      hints: [
        'Ask who "she" is — both Nadia and Priya are available, so the reader has to guess.',
        'The repair names the person. Adding "herself" keeps the same ambiguity, "they" changes the number, and "this" points at no noun at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence uses its pronouns correctly?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The essay contest gave the top prize to Marcus and me, and the judges praised our closing paragraphs.',
          correct: true,
        },
        { id: 'b', text: 'The essay contest gave the top prize to Marcus and I, and the judges praised our closing paragraphs.' },
        { id: 'c', text: 'Marcus and me revised the closing paragraph together the night before the deadline.' },
        { id: 'd', text: 'The committee announced their decision at the assembly, and the finalists cheered.' },
      ],
      expectedAnswer:
        'The essay contest gave the top prize to Marcus and me, and the judges praised our closing paragraphs.',
      hints: [
        'Use the cover test on each compound, then check whether every pronoun matches the noun it stands for.',
        'Object case follows "to," so "to Marcus and me" is right; "Marcus and me revised" needs subject case, and a committee acting as one unit takes "its."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-compound-subject-case',
      kind: 'misconception_check',
      question:
        'A student writes "Me and Jordan filmed the interview after school" and defends it: "That is how everyone says it out loud." What went wrong?',
      commonErrors: [
        {
          answer: 'Me and Jordan filmed the interview',
          misconception: 'Using the object form inside a compound SUBJECT because the spoken habit sounds normal.',
          correctsTo:
            'Cover the other name and the error becomes audible: "Me filmed the interview" is not English, while "I filmed the interview" is. A compound subject takes subject case, and the other person is named first: "Jordan and I filmed the interview after school."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A pronoun agrees with its TRUE antecedent, not the nearest noun; each, everyone, and neither are singular, and a group acting as one unit takes "its."',
        'Case follows the job: subject forms act (I, she, they, who), object forms receive or follow a preposition (me, her, them, whom).',
        'Cover the other name in a compound to hear the right form, and rebuild the clause with he or him to settle who versus whom.',
        'Every pronoun needs exactly one nameable antecedent — repair ambiguous "she" by naming the person, and repair vague "this/it/which" by naming the noun.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Pronouns: Agreement, Case & Clarity' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
