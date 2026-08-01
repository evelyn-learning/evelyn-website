/**
 * HS English — Composition: Transitions & Cohesion.
 *
 * The move that makes writing readable (CCSS W.9-10.2c, L.9-10.3): name the
 * LOGICAL relationship between two ideas first, then pick the transition whose
 * family signals that relationship — and hold the paragraph together with
 * repeated key nouns and pronoun threads, not just connector words. Every
 * practice item is a revision-choice MCQ over an original passage.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U9_TRANSITIONS_AND_COHESION: LessonPlan = {
  id: 'evelyn.hs.engl.transitions-and-cohesion.v1',
  title: 'Transitions & Cohesion',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.transitions-and-cohesion',
      standard: 'ENGL-9.3',
      description:
        'Choose transitions by naming the logical relationship between ideas first — addition, contrast, cause and effect, example, or sequence — and build cohesion across a paragraph through repeated key terms and clear pronoun threads (CCSS W.9-10.2c, L.9-10.3).',
    },
  ],
  prerequisites: ['engl.paragraph-unity-and-support'],
  followUps: ['engl.introductions-and-conclusions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Flow is a reader experience, not a word list — frame transitions as the signal that tells a reader how one idea connects to the next.',
      script:
        'Think about the last time someone gave you directions and left out a step. You were not confused because the words were hard. You were confused because you could not tell how one instruction connected to the next. Or think about a friend who tells a story out of order, doubling back with "oh wait, but before that." The facts are all there, and the story still falls apart. Writing works the same way. A transition is the small signal that tells your reader what relationship is coming next: another point, a turn, a result, an example. Today you learn to name that relationship first and pick the word second, and you learn the quieter half of flow that most writers never notice.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-relationship-first',
      kind: 'concept',
      goal: 'The relationship-first method, the transition families, and the two ways flow actually breaks.',
      keyIdeas: [
        'RELATIONSHIP FIRST — before you reach for a word, say the connection out loud in plain language: "the second sentence adds another reason", "the second sentence pushes back", "the second sentence is what happened because of the first." Name the relationship, THEN pick the transition. Writers who pick the word first end up choosing whatever sounds impressive.',
        'THE TRANSITION FAMILIES — ADDITION (also, in addition, furthermore, moreover) stacks another point on the same side. CONTRAST (however, but, on the other hand, in contrast) turns against the point just made. CAUSE AND EFFECT (therefore, as a result, consequently, so) says the first idea produced the second. EXAMPLE (for example, for instance, specifically) narrows to one concrete case. SEQUENCE AND TIME (first, next, meanwhile, later, finally) orders events on a clock, not on a logic chain. CONCESSION (although, granted, admittedly) gives ground before pivoting back.',
        'SEQUENCE IS NOT CAUSE — "later" means it happened after; "therefore" means it happened because. Two events can share a timeline without one producing the other, and swapping these two families invents a cause the writing never proved.',
        'THE SPRINKLE ERROR — transitions cannot repair a paragraph whose ideas are in the wrong order. If a reader gets lost, the first question is whether the sentences are sequenced correctly, not which connector is missing. Sprinkling "moreover" and "furthermore" over scrambled ideas is like labeling the doors of a house you built backwards.',
        'COHESION BEYOND TRANSITION WORDS — most of a paragraph\'s flow comes from REPEATED KEY NOUNS. Name the thing, then name it again: "The mural took three weekends. The mural now covers the north wall of the gym." Swapping in a fresh synonym every sentence looks varied and reads like a new topic each time.',
        'PRONOUN THREADS — a pronoun is a thread back to a noun the reader already holds. That thread only works when there is exactly one noun it could point to. "The coaches met the referees, and they apologized" snaps the thread; "the referees apologized" repairs it. Vague "this" and "it" openers are the most common cohesion break in student writing.',
        'THE FANCY-WORD TRAP — "moreover" is the word writers reach for when they want a sentence to sound finished. It means ADDITION. If the next sentence actually turns against the one before it, the honest word is "but" or "however", and the fancier word quietly tells the reader the opposite of what you meant.',
        'READ BOTH SIDES — a transition sits between two sentences and belongs to both. Read the full sentence before it and the full sentence after it, all the way to the period, because a qualifier late in the second sentence often flips the relationship you thought you had.',
      ],
      vocabulary: [
        { term: 'transition', definition: 'a word or phrase that names the logical relationship between two ideas — addition, contrast, cause, example, or sequence.' },
        { term: 'cohesion', definition: 'the sense that sentences belong to one paragraph, built mainly from repeated key nouns and clear pronoun threads.' },
        { term: 'pronoun thread', definition: 'the link from a pronoun back to the one noun it stands for; it breaks when more than one noun could fit.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-the-relationship',
      kind: 'worked_example',
      problem:
        'Choose the best transition for the blank: "The school newspaper prints a short issue every month. The staff writes every article, shoots every photo, and lays out every page. ___, they sell the ads that pay for the printing." (a) However (b) In addition (c) For example (d) Therefore',
      steps: [
        'Cover the choices. Read only the sentence before and the sentence after the blank, all the way to the period.',
        'Say the relationship in plain language: the second sentence lists jobs the staff does, and the blank sentence names one more job they do. That is another item on the same side — ADDITION.',
        'Now check the families. "However" is contrast, but nothing turns against the list. "For example" would need ad-selling to be an instance of writing, shooting, and laying out, and it is a separate job instead. "Therefore" would claim the layout work caused the ad sales, which the passage never says.',
        'Only "In addition" belongs to the addition family: "In addition, they sell the ads that pay for the printing."',
      ],
      answer: '(b) In addition — the blank sentence adds one more job to the list, so the relationship is addition.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wrong-relationship',
      kind: 'worked_example',
      problem:
        'A student writes: "The ceramics class ordered a new kiln in January so that everyone could fire final projects on time. Moreover, the kiln did not arrive until the last week of school." The sentence reads smoothly out loud. Is the transition right?',
      steps: [
        'Resist the ear. A transition can sound perfectly natural and still name the wrong relationship, because "moreover" carries a finished, formal tone that masks its meaning.',
        'Name the relationship without the word: sentence one sets up an expectation (a kiln in January, projects fired on time). Sentence two reports the opposite outcome (the kiln showed up in the final week). The second sentence turns against the first.',
        'That is CONTRAST. Check what "moreover" actually signals: addition — another point on the SAME side. It tells the reader that the late delivery agrees with the plan, which is the reverse of the truth.',
        'Replace it with a contrast-family word: "However, the kiln did not arrive until the last week of school." The rhythm is identical and the logic is now honest.',
        'The lesson: a smooth-sounding transition is not a correct one. Name the relationship, then confirm the word belongs to that family.',
      ],
      answer:
        'No — the relationship is contrast, not addition, so "Moreover" should be "However": "However, the kiln did not arrive until the last week of school."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-pick-the-family',
      kind: 'try_yourself',
      problem:
        'Which transition best fills the blank? "The art room ran out of blue glaze in early October, and the order was back-ordered for two months. ___, almost every bowl in the winter show came out green or brown."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'For example,' },
        { id: 'b', text: 'As a result,', correct: true },
        { id: 'c', text: 'Nevertheless,' },
        { id: 'd', text: 'Meanwhile,' },
      ],
      expectedAnswer: 'As a result,',
      hints: [
        'Say the connection in plain words first: did the glaze shortage simply happen at the same time as the green and brown bowls, or did it produce them?',
        'The missing blue glaze is the reason the bowls came out green or brown, so you need a cause-and-effect word, not an example, a contrast, or a time marker.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-wrong-relationship',
      kind: 'try_yourself',
      problem:
        'In which pair of sentences does the transition name the WRONG relationship?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The trail crew planted forty saplings along the creek. In addition, they built a low fence to keep the deer away.' },
        { id: 'b', text: 'Practice was scheduled outdoors at four o\'clock. However, the field flooded, so the coach moved everyone into the gym.' },
        { id: 'c', text: 'The bike-repair table opens outside the gym every Friday morning. Therefore, most students bring their bikes on Thursday afternoon.', correct: true },
        { id: 'd', text: 'Many clubs raise money with bake sales. For instance, the robotics team sold cookies for three weeks to buy a new battery pack.' },
      ],
      expectedAnswer: 'The bike-repair table opens outside the gym every Friday morning. Therefore, most students bring their bikes on Thursday afternoon.',
      hints: [
        'Name the relationship in each pair yourself before you judge the word: addition, contrast, cause and effect, or example.',
        'One pair uses a cause-and-effect word for two events that only share a schedule. Bringing a bike on Thursday is not caused by a Friday repair table; it happens before it, so the honest signal is a time word such as "Meanwhile" or a rewrite.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cohesion-without-transitions',
      kind: 'try_yourself',
      problem:
        'A draft reads: "The debate club started recording its practice rounds this fall. That has helped." Which revision of the second sentence improves cohesion WITHOUT adding a transition word?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Those recordings have helped members hear the filler words they repeat.', correct: true },
        { id: 'b', text: 'Moreover, that has helped.' },
        { id: 'c', text: 'Therefore, it has helped a lot this season.' },
        { id: 'd', text: 'This has been a big help, and it is something they like.' },
      ],
      expectedAnswer: 'Those recordings have helped members hear the filler words they repeat.',
      hints: [
        'Cohesion comes from repeating the key noun and keeping a clear pronoun thread — which revision names the thing from sentence one again?',
        'Two choices just bolt a transition onto the same vague sentence, and one piles up "this" and "it" with no noun behind them. Only one repeats "recordings" and threads "members" to "they."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-more-transitions',
      kind: 'misconception_check',
      question:
        'A student adds a transition to the front of nearly every sentence — "Moreover... Furthermore... Additionally..." — and says the paragraph flows better now because it has more connectors. What went wrong?',
      commonErrors: [
        {
          answer: 'More transition words means better flow.',
          misconception:
            'Treating transitions as decoration sprinkled on top of a paragraph rather than as signals of a specific relationship, so that a connector is added even where no relationship needs marking.',
          correctsTo:
            'A transition earns its place only when the relationship between two ideas would otherwise be unclear. Stacking connectors makes every sentence sound equally emphatic and hides which links actually matter, and a transition can never fix ideas that are in the wrong order. Cut the ones that mark nothing, verify that each remaining word matches its relationship, and carry the rest of the flow with repeated key nouns and clear pronoun threads.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name the logical relationship in plain language FIRST — addition, contrast, cause and effect, example, sequence, concession — then pick a word from that family.',
        'Sequence is not cause: "later" marks time, "therefore" claims a result.',
        'A transition cannot fix an order problem, and more transitions do not mean better flow.',
        'Most cohesion is quiet: repeat the key noun instead of hunting for synonyms, and keep every pronoun pointing at exactly one noun.',
        'Read the full sentence on BOTH sides of a transition — a late qualifier often flips the relationship.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Transitions & Cohesion' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
