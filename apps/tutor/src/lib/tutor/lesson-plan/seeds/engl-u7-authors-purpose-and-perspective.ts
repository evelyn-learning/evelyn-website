/**
 * HS English — Reading Informational Text: Author's Purpose & Perspective.
 *
 * Why a text exists and whose angle it carries (CCSS RI.9-10.4, RI.9-10.6):
 * the four purpose families and their cue features, perspective read from
 * loaded word choice, emphasis, and omission, and the whole-text test that
 * kills the topic-vs-purpose error. All excerpts are short ORIGINAL prose
 * written for this lesson — invented products, invented reports, no real
 * publications or authors quoted.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U7_AUTHORS_PURPOSE_AND_PERSPECTIVE: LessonPlan = {
  id: 'evelyn.hs.engl.authors-purpose-and-perspective.v1',
  title: 'Author\'s Purpose & Perspective',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.authors-purpose-and-perspective',
      standard: 'ENGL-7.2',
      description:
        'Determine why an author wrote a text — to inform, persuade, entertain, or explain — and identify the author\'s perspective on the subject by analyzing loaded word choice, what the text emphasizes, and what it leaves out (CCSS RI.9-10.4, RI.9-10.6).',
    },
  ],
  prerequisites: ['engl.central-idea-and-details'],
  followUps: ['engl.text-structure'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the same subject, written by two different people for two different reasons, produces two different texts — and that readers who miss the reason get played.',
      script:
        'Two pages describe the same phone. One is a review on a gadget site; the other is the product page written by the company that makes it. Both list the screen size. Both mention the battery. Only one of them will tell you the camera struggles indoors, and only one of them ends with a buy button. Nothing on either page is technically false — the difference is WHY each page was written and WHOSE angle it carries. That is the skill today: reading for purpose and perspective, so that a sponsored post, a company page, and an honest report stop looking alike.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-purpose-and-perspective',
      kind: 'concept',
      goal: 'The four purpose families and their cue features, perspective as angle revealed by word choice, emphasis, and omission, and the two errors that wreck purpose analysis.',
      keyIdeas: [
        'FOUR PURPOSE FAMILIES — INFORM (report what is so), PERSUADE (move you to believe or do something), ENTERTAIN (give you an experience — story, humor, suspense, voice), EXPLAIN (make a process or a cause understandable). Purpose is the WHY behind the text.',
        'CUE FEATURES — each family leaves fingerprints. INFORM: data, dates, sources, flat tone, no ask. PERSUADE: a claim plus reasons, loaded words, a call to action, opposing views dismissed or missing. ENTERTAIN: scene, dialogue, character, jokes, a voice you notice. EXPLAIN: steps, sequence words, cause-and-effect language, definitions.',
        'PURPOSE CAN MIX, BUT ONE USUALLY LEADS — a persuasive piece may open with a funny anecdote and close with statistics. The question is never "which families appear" but "which one is the text ultimately serving." Ask what the author wants you walking away with.',
        'PERSPECTIVE IS THE ANGLE — not the topic, but the author\'s stance toward it. Three places it shows: LOADED WORD CHOICE (crowded versus packed, cheap versus affordable, spending versus investment), EMPHASIS (what gets three sentences and what gets three words), and OMISSION (the side, cost, or counterexample that never appears).',
        'OMISSION IS EVIDENCE — you cannot see it by reading harder; you see it by asking what a fair treatment WOULD have included. A product page that lists nine features and zero drawbacks has told you its perspective by what is missing.',
        'NEUTRAL-SOUNDING IS NOT NEUTRAL — a calm, factual voice can still be angled. Every writer selects which true facts to include and which words to name them with, and selection is perspective. Distrust the reflex that says "it sounds objective, so it must be objective."',
        'TOPIC IS NOT PURPOSE — the most common error is answering what the text is ABOUT when the question asks why it was WRITTEN. "It is about electric buses" names a topic; "it argues the city should buy electric buses" names a purpose. Purpose answers start with a verb.',
        'THE WHOLE-TEXT TEST — the purpose you name has to fit the WHOLE text, not one flashy line. One vivid joke does not make a report entertaining, and one statistic does not make an advertisement informative. Check the claim against the first sentence, the middle, and the last.',
      ],
      vocabulary: [
        { term: 'author\'s purpose', definition: 'the reason a text was written — to inform, persuade, entertain, or explain — stated as a verb, not a topic.' },
        { term: 'perspective', definition: 'the author\'s angle or stance toward the subject, revealed by word choice, emphasis, and omission.' },
        { term: 'loaded language', definition: 'wording that carries judgment along with its meaning, nudging the reader to feel a certain way about a neutral fact.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-purpose-and-angle',
      kind: 'worked_example',
      problem:
        'Name the primary purpose and the perspective of this excerpt, citing the words that reveal the angle: "The Riverton council\'s so-called modernization plan will bulldoze the last open lot on Ninth Street to make room for a parking deck. The neighbors who have gardened that lot for eleven years were given nine days to clear it. The council calls this progress."',
      steps: [
        'Check purpose against the cue features. There are facts here (eleven years, nine days), but the text is not simply reporting — it selects facts that all point the same direction and never gives the council a reason for the decision. That pattern belongs to PERSUADE, not INFORM.',
        'Find the loaded word choice: "so-called" attaches doubt to the plan before it is described; "bulldoze" is chosen over "clear" or "redevelop"; "were given nine days" frames the neighbors as acted upon rather than consulted.',
        'Find the emphasis and the omission: the gardeners get an eleven-year history, while the parking deck gets four words and no justification. The council\'s reasoning is absent entirely — a fair report would have it.',
        'Read the last sentence as the tell: "The council calls this progress" hands the word "progress" to the council in a tone that refuses it. The author is not neutral about who is right.',
        'State both answers as one claim with evidence: the purpose is to persuade readers that the demolition is unjust, and the perspective sides with the gardeners — visible in "so-called," "bulldoze," and the missing case for the parking deck.',
      ],
      answer:
        'Primary purpose: to persuade readers that the demolition is unjust. Perspective: sympathetic to the gardeners and hostile to the council — evidence: "so-called," "bulldoze," the eleven-year detail, and the total omission of the council\'s reasoning',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-facts-are-not-informative',
      kind: 'worked_example',
      problem:
        'A student reads this excerpt and labels its purpose "to inform, because it is full of specific facts": "The Halden A2 bottle keeps drinks cold for 26 hours and weighs only 310 grams. Competing bottles give up their chill by hour twelve and are heavier besides. Order before Friday and shipping is free." What did the student miss?',
      steps: [
        'Confirm the facts are real facts: 26 hours, 310 grams, hour twelve. The student is right that specific data appears — that is exactly what makes the trap work.',
        'Apply the whole-text test instead of the fact test. Sentence one praises the product, sentence two runs down every competitor, sentence three tells you to buy by Friday. Every part pushes one way.',
        'Check the cue features that are MISSING for INFORM: no source for the 26-hour figure, no drawback, no named competitor, no measurement conditions. An informative text has nothing to lose by including those; this one does.',
        'Check the word choice: "only 310 grams" and rivals that "give up their chill" are judgments dressed as description. Neutral phrasing would be "310 grams" and "stay cold for twelve hours."',
        'Correct the rule the student was using. Facts are a TOOL that any purpose can pick up; persuasion uses facts constantly, and using them well is what makes it convincing. Purpose is decided by what the whole text is trying to make the reader do — here, buy the bottle.',
      ],
      answer:
        'The purpose is to persuade the reader to buy the bottle; facts inside a text are evidence being used, not proof that the purpose is informative — the selected comparison and the "order before Friday" call to action settle it',
      estimatedMinutes: 3,
    },
    {
      id: 'try-primary-purpose',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "Groundwater beneath the Kessel Valley fell 4 meters between 2011 and 2024, according to the county water survey. Three of the valley\'s eight monitoring wells now run dry each August." What is the primary purpose of this excerpt?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'To inform readers of a measured change by reporting survey findings', correct: true },
        { id: 'b', text: 'To persuade readers that the county should restrict water use' },
        { id: 'c', text: 'To explain the process by which an aquifer refills after rainfall' },
        { id: 'd', text: 'To entertain readers with a story about a hot, dry summer' },
      ],
      expectedAnswer: 'To inform readers of a measured change by reporting survey findings',
      hints: [
        'Run the cue features: is there a claim plus an ask, a set of steps, a scene with characters, or sourced data with a flat tone?',
        'The excerpt names a source and reports numbers. It never says what anyone should DO about the drop, and it never says WHY the water fell.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-perspective-word-choice',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The new Fairhaven bus schedule was rammed through in a single meeting, and riders in the north end were handed a route that skips their clinic entirely." Which perspective do the word choices reveal?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The writer views the schedule change as rushed and dismissive of north-end riders', correct: true },
        { id: 'b', text: 'The writer views the schedule change as an efficient decision made without delay' },
        { id: 'c', text: 'The writer has no stance and is simply reporting when the vote occurred' },
        { id: 'd', text: 'The writer believes north-end riders requested the route change themselves' },
      ],
      expectedAnswer: 'The writer views the schedule change as rushed and dismissive of north-end riders',
      hints: [
        'Swap each loaded word for a neutral one: "rammed through" becomes "approved," "were handed" becomes "received," "skips entirely" becomes "does not stop at." What feeling disappears?',
        'The same decision could be described as "passed in one meeting." The words actually chosen judge the speed and the outcome.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-the-bias',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The Verrick 9 tablet ships with 128 gigabytes of storage and a 10-inch screen, and it costs 40 dollars more than last year\'s model. Anyone still buying a budget tablet is settling for junk. Battery life measured about nine hours in our testing." Which detail most clearly signals the writer\'s bias?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The storage and screen specifications listed in the first sentence' },
        { id: 'b', text: 'The statement that budget-tablet buyers are settling for junk', correct: true },
        { id: 'c', text: 'The note that the tablet costs 40 dollars more than last year\'s model' },
        { id: 'd', text: 'The measured nine-hour battery result' },
      ],
      expectedAnswer: 'The statement that budget-tablet buyers are settling for junk',
      hints: [
        'Three of these details could be checked by anyone with the tablet in hand. One of them cannot be checked at all.',
        'Look for the sentence that judges the READER rather than measuring the product.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-facts-mean-informative',
      kind: 'misconception_check',
      question:
        'A student says: "This piece cites three studies and gives exact percentages, so its purpose has to be to inform. You cannot call something persuasive when everything in it is true." What went wrong?',
      commonErrors: [
        {
          answer: 'The text contains verifiable facts, therefore its purpose is to inform',
          misconception: 'Treating the presence of facts as proof of purpose, and treating "true" as the same thing as "neutral."',
          correctsTo:
            'Facts are a tool, not a purpose — persuasion runs on them, and the most effective persuasion uses only true ones. What decides purpose is what the WHOLE text does with those facts: which ones were selected, which were left out, whether the text names a drawback or a counterargument, and whether it ends by telling you what to believe or do. Ask that, not "are there facts here."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Purpose is a verb, not a topic: inform, persuade, entertain, explain — and one family usually leads even when several appear.',
        'Perspective shows up in three places: loaded word choice, what gets emphasized, and what is left out.',
        'Neutral-sounding is not neutral — every text selects, and selection is an angle.',
        'Facts inside a text prove nothing about its purpose; apply the whole-text test instead of the fact test.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Author\'s Purpose & Perspective' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
