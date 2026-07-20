/**
 * Digital SAT — Reading & Writing: Transitions.
 *
 * Expression-of-Ideas skill: pick the transition word/phrase that matches
 * the LOGICAL relationship between the surrounding sentences — continuation,
 * contrast, cause-and-effect, example, or sequence. The method comes before
 * the choices: classify the relationship first, THEN look at the four
 * options. Traps are (1) picking the fanciest-sounding word regardless of
 * category, and (2) classifying off only part of the second sentence and
 * missing a qualifier that flips the relationship.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U7_TRANSITIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.transitions.v1',
  title: 'Transitions',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.transitions',
      standard: 'DSAT-7.2',
      description:
        'Select the transition that matches the logical relationship between two sentences — continuation, contrast, cause-and-effect, example, or sequence — by classifying the relationship BEFORE reading the answer choices.',
    },
  ],
  prerequisites: ['dsat.rhetorical-synthesis'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame transitions as a scorable, logic-only skill worth several points per test.',
      script:
        'Transition questions show up 4 to 6 times on every digital SAT — roughly one in ten Reading and Writing questions. They test zero vocabulary and zero grammar rules. They test one thing: can you name the logical relationship between two sentences before you look at the answer choices? Learn the five relationship categories and this becomes one of the fastest point categories on the test.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-taxonomy',
      kind: 'concept',
      goal: 'Teach the five-category relationship taxonomy and the classify-before-choices method, plus the two named traps.',
      keyIdeas: [
        'THE METHOD — cover the blank with your thumb, read only the sentence before and the sentence after, and put the logical relationship into your own words BEFORE looking at the four choices. Match a choice to that relationship — never the other way around.',
        'CONTINUATION (addition) — the second sentence extends or reinforces the same point as the first, adding a new but agreeing fact. Signal words: also, moreover, furthermore, in addition, likewise, similarly.',
        'CONTRAST — the second sentence pushes back on, qualifies, or reverses the first. Signal words: however, nevertheless, yet, on the other hand, in contrast, still.',
        'CAUSE AND EFFECT — the second sentence is a direct result or consequence of the first, with the causal link actually stated, not just implied. Signal words: therefore, thus, consequently, as a result, hence, so.',
        'EXAMPLE — the second sentence illustrates the first with one specific, concrete case. Signal words: for example, for instance, specifically, namely, such as.',
        'SEQUENCE — the second sentence is the next step in a timeline or process, not a logical outcome. Signal words: next, then, subsequently, meanwhile, after that. Don’t confuse this with cause/effect: "then" marks TIME, "therefore" marks a RESULT.',
        'TRAP — the sophistication trap. A fancy-sounding choice (nevertheless, furthermore) is planted as the wrong-CATEGORY distractor. Pick by relationship, never by how advanced or academic the word sounds.',
        'TRAP — the half-sentence trap. The digital SAT often adds a qualifier AFTER the blank that changes the relationship (a result that turns out to be an error, a prediction that gets contradicted). Read the FULL second sentence, not just up to the first comma, before classifying.',
      ],
      vocabulary: [
        { term: 'continuation transition', definition: 'signals the next sentence extends or agrees with the same idea (also, moreover, furthermore).' },
        { term: 'contrast transition', definition: 'signals the next sentence opposes or qualifies the first (however, nevertheless, yet).' },
        { term: 'cause-effect transition', definition: 'signals the next sentence is a stated consequence of the first (therefore, thus, as a result).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cause-effect',
      kind: 'worked_example',
      problem:
        'Marine biologists have long assumed that octopuses navigate reefs using visual landmarks alone. Recent tracking data complicates that assumption: several octopuses continued reaching the same den after researchers temporarily blinded the reef’s most visible coral formations. ______, memory of scent trails may play a larger role in octopus navigation than sight does. Which choice completes the text with the most logical transition? (a) For example, (b) Similarly, (c) Therefore, (d) However',
      steps: [
        'Cover the blank. Sentence before: an assumption (vision-only navigation) is being complicated by a specific finding (octopuses still found the den after being blinded). Sentence after the blank: a broader claim that scent memory may matter more than sight.',
        'Classify: the blank sentence is not a new example and not a reversal of the finding just given — it is a CONCLUSION drawn FROM that finding. That is cause-and-effect.',
        'Test each choice against that relationship: (a) "For example" needs an illustrative case, but the blank sentence is a conclusion, not an instance. (b) "Similarly" needs a parallel case, and there isn’t one. (d) "However" needs a reversal, but the blank sentence continues the same direction as the finding, it doesn’t oppose it. (c) "Therefore" signals a conclusion drawn from evidence — exactly what the blank sentence is doing.',
        'Match: (c) Therefore.',
      ],
      answer: '(c) Therefore',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sophistication-trap',
      kind: 'worked_example',
      problem:
        'Urban beekeeping has grown rapidly in dense cities over the past decade, with permitted hives increasing by more than 300 percent in some municipalities. ______, several cities have begun offering tax incentives to residents who install rooftop hives, further accelerating the trend. Which choice completes the text with the most logical transition? (a) Moreover, (b) Nevertheless, (c) For example, (d) Consequently',
      steps: [
        'Cover the blank. Sentence before: hive permits have grown sharply. Sentence after the blank: cities are now offering a second, separate incentive that keeps the same trend going.',
        'Classify: the blank sentence adds a new, AGREEING fact on top of the first — no reversal, no single illustrative case, no stated causal chain. That is continuation.',
        'Reject (b) "Nevertheless" first — this is the sophistication trap. It sounds advanced, but it announces a contrast that the passage never sets up; nothing here is being opposed or walked back.',
        'Reject (c) "For example" — the tax-incentive fact isn’t an illustration of the first sentence’s claim, it’s a separate supporting fact. Reject (d) "Consequently" — that would require the text to state that the hive increase CAUSED the incentive programs, which it never does.',
        'Match: (a) Moreover — plain addition of a second supporting fact.',
      ],
      answer: '(a) Moreover',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cause-effect',
      kind: 'try_yourself',
      problem:
        'A local bakery switched to compostable packaging last spring after customer surveys showed strong support for reducing plastic waste. ______, the bakery reports it now spends nearly twice as much per order on packaging materials. Which choice completes the text with the most logical transition?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'For example,' },
        { id: 'b', text: 'Similarly,' },
        { id: 'c', text: 'As a result,', correct: true },
        { id: 'd', text: 'Nevertheless,' },
      ],
      expectedAnswer: 'As a result,',
      hints: [
        'Cover the blank — is the cost increase a separate example, a parallel comparison, an opposing idea, or a consequence of switching packaging?',
        'The packaging switch directly produced the cost change: that’s a stated result, not a comparison or a contrast.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-contrast',
      kind: 'try_yourself',
      problem:
        'Standardized reviews of the new highway bypass predicted a dramatic drop in downtown traffic congestion. ______, weekday travel times through downtown have barely changed since the bypass opened. Which choice completes the text with the most logical transition?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Moreover,' },
        { id: 'b', text: 'However,', correct: true },
        { id: 'c', text: 'For instance,' },
        { id: 'd', text: 'Consequently,' },
      ],
      expectedAnswer: 'However,',
      hints: [
        'What was PREDICTED versus what actually HAPPENED — do those two sentences agree or disagree?',
        'The prediction and the real outcome point in different directions. That’s a reversal, not a result.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-example',
      kind: 'try_yourself',
      problem:
        'Many companies have adopted four-day workweeks to test whether reduced hours affect productivity. ______, a mid-sized software firm in Portland shortened its schedule to four days and reported no measurable change in quarterly output. Which choice completes the text with the most logical transition?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'However,' },
        { id: 'b', text: 'For example,', correct: true },
        { id: 'c', text: 'Therefore,' },
        { id: 'd', text: 'Nevertheless,' },
      ],
      expectedAnswer: 'For example,',
      hints: [
        'Is the Portland firm a single case that fits under the first sentence’s general claim, or does it oppose that claim, or is it a result of it?',
        'One specific company doing exactly what the first sentence describes companies doing in general — that’s an illustration.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-sentence',
      kind: 'misconception_check',
      question:
        'A student sees: "The lab’s initial results seemed to confirm the hypothesis. ______, further trials revealed a measurement error that had inflated the original data." The student picks "Moreover" because both sentences seem to be about the same experiment. What went wrong?',
      commonErrors: [
        {
          answer: 'Moreover',
          misconception:
            'Classified the relationship from surface-level topic overlap (both sentences mention the experiment) instead of reading the full second sentence for the actual logical move.',
          correctsTo:
            'Sentence 2 undercuts sentence 1: the initial results only "seemed to confirm" the hypothesis, and further trials showed that impression was wrong (a measurement error inflated the data). That is CONTRAST, not continuation. The correct choice is "However" — the reversal signal sits in the words "revealed a measurement error," which "Moreover" skips right past.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Classify the relationship FIRST — continuation, contrast, cause-and-effect, example, or sequence — before you look at the four choices.',
        'Read the FULL second sentence, not just up to the blank; the real relationship is often hidden in a qualifier that comes after it.',
        'Ignore how sophisticated a word sounds — match by logic, not by vocabulary level.',
        'Don’t confuse sequence (time order: then, next) with cause-and-effect (stated result: therefore, as a result).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Transitions' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
