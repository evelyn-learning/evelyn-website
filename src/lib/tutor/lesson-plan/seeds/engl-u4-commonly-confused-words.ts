/**
 * HS English — Grammar & Usage: Commonly Confused Words.
 *
 * The lookalike pairs that autocorrect cannot fix (CCSS L.9-10.1, L.9-10.2):
 * affect/effect, then/than, accept/except, lose/loose, fewer/less,
 * allusion/illusion. Each pair is resolved by a TEST — part of speech,
 * comparison vs. sequence, countable vs. mass — not by memorized lists.
 * Every practice item is a fill-the-blank or spot-the-correct-sentence MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U4_COMMONLY_CONFUSED_WORDS: LessonPlan = {
  id: 'evelyn.hs.engl.commonly-confused-words.v1',
  title: 'Commonly Confused Words',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.commonly-confused-words',
      standard: 'ENGL-4.4',
      description:
        'Choose correctly between commonly confused word pairs — affect/effect, then/than, accept/except, lose/loose, fewer/less, allusion/illusion and similar — by applying a meaning test and a part-of-speech test rather than relying on sound or habit (CCSS L.9-10.1, L.9-10.2).',
    },
  ],
  prerequisites: ['engl.tone-and-register'],
  followUps: ['engl.claims-and-evidence'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame confusable pairs as the errors spellcheck cannot catch — the ones a real reader sees first.',
      script:
        'Autocorrect will not save you here. Every word in this lesson is spelled correctly, so no red squiggle ever appears — which is exactly why these are the errors that survive all the way into a job application, a scholarship essay, or an email to a teacher. Write "the new schedule effected my mood" and the sentence looks clean to the software and wrong to the human reading it. The good news is that nobody memorizes their way out of this. Each pair has a two-second test built into its meaning, and once you know the test, the word chooses itself.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-tests',
      kind: 'concept',
      goal: 'Organize the confusable pairs by the TEST that resolves each one, with a memory hook per pair.',
      keyIdeas: [
        'THE BIG IDEA — do not memorize pairs, memorize TESTS. Every confusable pair splits along one of three lines: what part of speech the slot needs, what the sentence MEANS, or whether the thing being counted can be counted at all.',
        'THE PART-OF-SPEECH TEST: AFFECT vs EFFECT — "affect" is almost always the VERB (to influence), "effect" is almost always the NOUN (the result). Try inserting "the" in front of the blank: if "the ___" reads naturally, you need the noun "effect". WRONG: "The new schedule effected my mood." CORRECT: "The new schedule affected my mood, and the effect lasted all week." Memory hook: Affect = Action, Effect = End result.',
        'THE COMPARISON TEST vs THE TIME TEST: THAN vs THEN — "than" appears only in comparisons (more, less, better, worse, older); "then" marks time or sequence (next, after that, at that point). Ask which the sentence is doing. WRONG: "Her draft was stronger then mine." CORRECT: "Her draft was stronger than mine, and then she revised it again." Memory hook: thAn compAres, thEn is timE.',
        'THE COUNTABLE TEST vs THE MASS TEST: FEWER vs LESS — use "fewer" for things you can count one by one (fewer chairs, fewer errors, fewer students); use "less" for amounts measured as a mass (less water, less time, less patience). WRONG: "This draft has less errors." CORRECT: "This draft has fewer errors and needs less revision." Memory hook: if you can put a number in front of it, use FEWER.',
        'THE MEANING TEST — ACCEPT vs EXCEPT — "accept" is a verb meaning to receive or agree to; "except" means leaving something out. Substitute "receive" or "leave out" and see which fits. WRONG: "Everyone excepted the invitation accept Devon." CORRECT: "Everyone accepted the invitation except Devon." Memory hook: EXcept EXcludes.',
        'THE MEANING TEST — LOSE vs LOOSE — "lose" (one o) is the verb: to misplace or be defeated. "Loose" (two o\'s) is the adjective: not tight. WRONG: "Do not loose your notes." CORRECT: "Do not lose your notes; the binder rings are loose." Memory hook: LOOSE has an extra o because it is roomy; LOSE lost one.',
        'THE MEANING TEST — ALLUSION vs ILLUSION — an "allusion" is an indirect reference to something outside the text; an "illusion" is a false appearance. WRONG: "The poem makes an illusion to a childhood summer." CORRECT: "The poem makes an allusion to a childhood summer, and the calm it describes turns out to be an illusion." Memory hook: aLLusion points eLsewhere, iLLusion is unreaL.',
        'THE HABIT THAT CATCHES THE REST — when two words sound alike, say what you MEAN in plain words first ("influenced", "compared to", "leave out", "not tight"), then pick the word that carries that meaning. Reading the finished sentence back with the plain-word version substituted in catches almost every remaining slip.',
      ],
      vocabulary: [
        { term: 'part of speech', definition: 'the grammatical job a word does in a sentence — verb, noun, adjective — which often decides which twin belongs in the slot.' },
        { term: 'count noun', definition: 'a noun for things that can be numbered one by one (errors, chairs), which takes "fewer" rather than "less".' },
        { term: 'allusion', definition: 'an indirect reference to a person, event, or work outside the text.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-affect-effect',
      kind: 'worked_example',
      problem:
        'Choose the correct word: "The city council wanted to know how the later bus schedule would ___ attendance at the after-school tutoring center."',
      steps: [
        'Identify what the slot needs. The words right before the blank are "would ___", and "would" is a helping verb — a helping verb must be followed by a main VERB.',
        'Apply the part-of-speech test: "affect" is the verb, "effect" is the noun. Confirm it with the "the" check — "would the effect attendance" is nonsense, so the noun does not belong here.',
        'Plug in the plain-word meaning: the council wants to know how the schedule would INFLUENCE attendance. "Influence" is a verb, which matches "affect".',
        'Final sentence: "The city council wanted to know how the later bus schedule would AFFECT attendance at the after-school tutoring center." If you wanted the noun instead, the sentence would have to be rebuilt: "The council wanted to know the EFFECT of the later bus schedule on attendance."',
      ],
      answer: 'affect — the slot follows the helping verb "would", so it needs the verb form',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fewer-less-error',
      kind: 'worked_example',
      problem:
        'A student writes: "Since the club switched to online sign-ups, there are less members waiting in line and the whole process takes less time." It sounds natural read aloud. Is it correct?',
      steps: [
        'The sentence uses "less" twice, so test each one separately. Never judge the sentence as a whole — each blank has its own noun.',
        'First use: "less members". Apply the countable test — can you put a number in front of "members"? Yes: twelve members, forty members. Members are counted one by one, so the correct word is "fewer". This half is WRONG.',
        'Second use: "less time". Can you say "four times" and mean the same thing as an amount of time? No — time here is a mass, measured rather than counted. "Less" is CORRECT.',
        'Why the ear fails: "less" has become the default in everyday speech, so both halves sound fine. The number test is what separates them.',
      ],
      answer:
        'Half correct — the revision is "there are FEWER members waiting in line and the whole process takes LESS time." Members are countable; time is not.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-then-than',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The revised opening paragraph was far more specific ___ the original, so the editor kept it."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'than', correct: true },
        { id: 'b', text: 'then' },
        { id: 'c', text: 'that' },
        { id: 'd', text: 'then as' },
      ],
      expectedAnswer: 'than',
      hints: [
        'Is this sentence comparing two things, or telling you what happened next?',
        '"More specific" signals a comparison, and comparisons take "than" — thAn compAres.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-accept-except',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "Every member of the newspaper staff agreed to the new deadline ___ the two photographers, who asked for one extra day."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'accept' },
        { id: 'b', text: 'except', correct: true },
        { id: 'c', text: 'accepted' },
        { id: 'd', text: 'excepting of' },
      ],
      expectedAnswer: 'except',
      hints: [
        'Substitute the plain words "leave out" and "receive" into the blank — which meaning does the sentence need?',
        'The photographers are being left out of the group that agreed, so the sentence needs the excluding word: EXcept EXcludes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence uses every confusable word correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The closing paragraph makes an allusion to a long winter, and the effect is that the ending feels colder than the opening.', correct: true },
        { id: 'b', text: 'The closing paragraph makes an illusion to a long winter, and the affect is that the ending feels colder then the opening.' },
        { id: 'c', text: 'The closing paragraph makes an allusion to a long winter, and the effect is that the ending feels colder then the opening.' },
        { id: 'd', text: 'The closing paragraph makes an illusion to a long winter, and the effect is that the ending feels colder than the opening.' },
      ],
      expectedAnswer: 'The closing paragraph makes an allusion to a long winter, and the effect is that the ending feels colder than the opening.',
      hints: [
        'Check the three slots one at a time: the reference word, the word after "the", and the comparison word.',
        'A reference to something outside the text is an allusion; "the ___" takes the noun "effect"; and "colder ___ the opening" is a comparison, so it takes "than".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-lose-loose',
      kind: 'misconception_check',
      question:
        'A student writes "I did not want to loose my place in the essay" and defends it: "loose sounds exactly like what I mean, and it is spelled fine — spellcheck did not flag it." What went wrong?',
      commonErrors: [
        {
          answer: 'loose is correct because it is spelled correctly and sounds right',
          misconception: 'Trusting sound and spellcheck instead of checking the part of speech and meaning — both twins are real words, so no tool flags the wrong one.',
          correctsTo:
            'The sentence needs a VERB meaning to misplace, which is "lose" with one o. "Loose" is an adjective meaning not tight, which cannot follow "to want to" here. CORRECT: "I did not want to lose my place in the essay." Compare: "The pages were loose in the binder."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Learn the TEST, not the list: part of speech, meaning, or countability decides every one of these pairs.',
        'Affect = the verb (Action); effect = the noun (End result) — if "the ___" fits, you need "effect".',
        'ThAn compAres; thEn is timE. Fewer counts one by one; less measures a mass. EXcept EXcludes; accept receives.',
        'Lose (one o) is the verb, loose (two o\'s) is not tight; an allusion points elsewhere, an illusion is not real.',
        'Spellcheck cannot catch any of these — say the plain-word meaning first, then pick the word that carries it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Commonly Confused Words' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
