/**
 * HS English — Reading Nonfiction: Central Idea & Supporting Details.
 *
 * What a nonfiction text SAYS about its topic (CCSS RI.9-10.1, RI.9-10.2):
 * the Goldilocks test for scope, the jobs supporting details do, and the
 * one-sentence summary check. All excerpts are short ORIGINAL prose written
 * for this lesson — no real publications, no quoted authors.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U7_CENTRAL_IDEA_AND_DETAILS: LessonPlan = {
  id: 'evelyn.hs.engl.central-idea-and-details.v1',
  title: 'Central Idea & Supporting Details',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.central-idea-and-details',
      standard: 'ENGL-7.1',
      description:
        'Determine the central idea of a nonfiction text, distinguish it from a single narrow detail or an overly broad topic, and identify which details actually support and develop it (CCSS RI.9-10.1, RI.9-10.2).',
    },
  ],
  prerequisites: ['engl.theme'],
  followUps: ['engl.authors-purpose-and-perspective'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame central idea as the everyday skill of compressing an article into one honest sentence — the doorway into the Reading Nonfiction unit.',
      script:
        'A friend sends you an article and asks what it says. You do not read it aloud. You give one sentence — and if that sentence is good, your friend knows the point. That one sentence is the central idea, and it is the single most useful move in reading nonfiction: skimming the news, pulling three science articles for a project, deciding whether a source is even worth your time. Today we open the Reading Nonfiction unit by getting that sentence right, because most readers miss it the same two ways — they grab one striking fact, or they hand back the topic and call it the point.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-central-idea',
      kind: 'concept',
      goal: 'Define central idea as topic plus claim, install the Goldilocks scope test, and name the first-sentence trap and detail-magnet error.',
      keyIdeas: [
        'CENTRAL IDEA = TOPIC + WHAT THE TEXT SAYS ABOUT IT. The topic is a noun phrase you could put on a folder tab: "school gardens," "city buses." The central idea is a full sentence with a claim in it: "School gardens change what students are willing to eat." If your answer has no verb doing real work, you have named the topic, not the idea.',
        'THE GOLDILOCKS TEST — scope has to fit. TOO NARROW means you handed back one detail (a date, a number, a single example) and promoted it to the point. TOO BROAD means you handed back the whole subject ("transportation matters in cities"), a sentence that would fit a hundred other texts. The central idea is the one statement that covers THIS text and no more.',
        'DETAILS HAVE A JOB — every supporting detail SUPPORTS, EXPLAINS, or PROVES the central idea. It gives an example of it, spells out how it works, or offers evidence that it is true. A fact that does none of those three jobs may be interesting, but it is not supporting THIS idea.',
        'THE FIRST-SENTENCE TRAP — the central idea is not always sentence one. Writers open with background, a common belief, or a scene, then turn. Watch for the turn words: however, but, yet, still, in fact. What follows the turn is usually the actual claim, and the opening was the setup being corrected.',
        'THE SUMMARIZE-IN-ONE-SENTENCE CHECK — say the whole text in a single sentence, in your own words, without looking. If your sentence uses only half the paragraph, it is too narrow. If it could describe a text you have never read, it is too broad. That sentence, tightened, is the central idea.',
        'THE DETAIL-MAGNET ERROR — the most vivid item in a text pulls attention to itself: the big percentage, the shocking number, the strange example. Vivid does not mean central. Ask what the striking fact was put there to prove; the answer to that question is the central idea, and the fact is the evidence serving it.',
        'TEST AGAINST EVERY SENTENCE — a real central idea has every other sentence working for it. Read your candidate sentence, then check each sentence of the text and ask what job it does. If several sentences have no relationship to your candidate, your candidate is a detail wearing a crown.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'what the text is about, stated as a noun phrase — not yet a claim.' },
        { term: 'central idea', definition: 'the single sentence stating what the text says ABOUT its topic; every other sentence supports it.' },
        { term: 'supporting detail', definition: 'a fact, example, or explanation whose job is to support, explain, or prove the central idea.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-goldilocks',
      kind: 'worked_example',
      problem:
        'Determine the central idea of this excerpt, using the Goldilocks test: "A city transit report found that ridership on the number 12 bus rose 34 percent after the route added Saturday service. Riders surveyed said the weekend trips finally let them reach jobs and clinics they could not walk to. Planners now describe schedule gaps, not missing routes, as the neighborhood\'s real barrier."',
      steps: [
        'Name the topic first, as a noun phrase: Saturday bus service on one city route. That is a folder tab, not yet an idea — no claim in it.',
        'Ask what the text SAYS about that topic. Sentence 2 explains why the riders came (access to jobs and clinics), and sentence 3 states the conclusion planners drew: the problem was WHEN buses ran, not WHERE they went.',
        'Draft the sentence: adding weekend service showed that the neighborhood was limited by the schedule rather than by the routes themselves.',
        'Run Goldilocks — too narrow: "Ridership rose 34 percent." True, and it is one number from one sentence; the rest of the excerpt does no work for it.',
        'Run Goldilocks — too broad: "Public transit is important to city residents." That sentence would fit any transit text ever written, so it cannot be THIS text\'s point.',
        'Check it against every sentence: the 34 percent is evidence, the rider surveys explain the cause, and the planners\' conclusion states the idea outright. All three sentences serve the drafted claim, so the scope is right.',
      ],
      answer:
        'Adding Saturday service revealed that the schedule, not the route map, was the real barrier to getting around the neighborhood',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-detail-magnet',
      kind: 'worked_example',
      problem:
        'A student reads this excerpt and says the central idea is "Students who tend a garden eat 21 percent more vegetables." What did the student miss? Excerpt: "A three-year study across eleven districts found that students who tended a school garden ate 21 percent more vegetables at lunch. The effect held even at schools where the cafeteria menu never changed. Researchers concluded that growing food changes what students are willing to try, not what schools put on the tray."',
      steps: [
        'Notice what the student grabbed: the largest, most quotable number in the excerpt. That is the detail magnet at work — vivid pulled harder than central.',
        'Ask the diagnostic question: what was that statistic put there to PROVE? It is evidence that gardening changed student eating, which means it serves an idea rather than being one.',
        'Read sentence 2, which the student\'s answer ignores entirely: the effect appeared even where the menu stayed the same. That sentence exists only to rule out the cafeteria as the cause.',
        'Read sentence 3, where the researchers state the claim outright: the change happened in what students were WILLING to try, not in what was offered. Sentences 1 and 2 are both working for that claim.',
        'Rewrite with correct scope: growing food changes what students are willing to eat, even when the cafeteria menu does not change. The 21 percent stays in the answer only as evidence, not as the point.',
      ],
      answer:
        'The 21 percent is the evidence, not the idea: the excerpt claims that growing food changes what students are willing to try, even when the menu stays the same',
      estimatedMinutes: 3,
    },
    {
      id: 'try-central-idea-library',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "A neighborhood library began lending cooking equipment alongside books. Within a year, checkouts of its cookbooks had doubled, and staff reported that many borrowers were opening a recipe for the first time." Which statement best states the central idea?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cookbook checkouts at the library doubled in a single year.' },
        { id: 'b', text: 'Lending kitchen equipment pulled borrowers into a book collection they had been ignoring.', correct: true },
        { id: 'c', text: 'Libraries provide many different services to their communities.' },
        { id: 'd', text: 'Most people cannot follow a recipe without professional equipment.' },
      ],
      expectedAnswer: 'Lending kitchen equipment pulled borrowers into a book collection they had been ignoring.',
      hints: [
        'Two sentences, and both have to be covered. One choice repeats only the number from sentence 2 — that is the too-narrow trap.',
        'Ask what the equipment lending DID. The excerpt links a new service to a change in who reached for the cookbooks.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-supporting-detail',
      kind: 'try_yourself',
      problem:
        'A science article has this central idea: rooftop gardens lower the cooling costs of the buildings beneath them. Which detail actually SUPPORTS that idea?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rooftop gardens are usually planted with herbs and shallow-rooted grasses.' },
        { id: 'b', text: 'The first rooftop garden in the city opened in 1998.' },
        { id: 'c', text: 'Buildings with planted roofs used 18 percent less air conditioning during a summer heat wave than nearby buildings of the same size.', correct: true },
        { id: 'd', text: 'Tenants often say the rooftop garden is their favorite part of the building.' },
      ],
      expectedAnswer:
        'Buildings with planted roofs used 18 percent less air conditioning during a summer heat wave than nearby buildings of the same size.',
      hints: [
        'A supporting detail has to support, explain, or prove THIS claim — which is about cooling costs, not about popularity or planting choices.',
        'Three choices are true facts about rooftop gardens that say nothing about cooling. Only one measures energy use.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-sentence-summary',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "A wildlife group counted river otters along a 40-mile stretch of urban river every spring for a decade. Numbers stayed near zero until the city upgraded its wastewater plant, after which sightings rose each year. The group now treats the otter count as a rough measure of the river\'s water quality." Which is the best one-sentence summary?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A wildlife group has counted river otters every spring for ten years.' },
        { id: 'b', text: 'Urban rivers are home to many kinds of wildlife.' },
        { id: 'c', text: 'Otter numbers recovered after a wastewater upgrade, so the group now uses otter counts as a stand-in for water quality.', correct: true },
        { id: 'd', text: 'River otters prefer treated wastewater to natural habitat.' },
      ],
      expectedAnswer:
        'Otter numbers recovered after a wastewater upgrade, so the group now uses otter counts as a stand-in for water quality.',
      hints: [
        'A good summary covers all three sentences. Check each choice against sentence 2 and sentence 3, not just sentence 1.',
        'One choice states only the method, one states the general topic, and one claims something the excerpt never says about otter preferences.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-first-sentence',
      kind: 'misconception_check',
      question:
        'A student says: "The first sentence of an article is the central idea. That is what a topic sentence is for, so I read sentence one and move on." What went wrong?',
      commonErrors: [
        {
          answer: 'The first sentence always states the central idea',
          misconception: 'Treating the opening sentence as an automatic thesis, which makes a setup or a common belief look like the writer\'s claim.',
          correctsTo:
            'Nonfiction writers often open with background, a widely held belief, or a scene, then turn against it with however, but, or in fact. When that happens, sentence one is the idea being CORRECTED. Locate the turn, then test your candidate sentence against every sentence in the text — the central idea is the one they all work for, wherever it sits.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Central idea = topic + what the text SAYS about it; a topic alone is a folder tab, not an idea.',
        'Goldilocks test: not too narrow (one detail promoted to the point), not too broad (a sentence that fits any text on the subject).',
        'Supporting details do one of three jobs — support, explain, or prove the central idea.',
        'The central idea is not always sentence one; watch for however, but, and in fact, and check your sentence against the whole text.',
        'The most vivid statistic is usually evidence, not the idea. Ask what it was put there to prove.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Central Idea & Supporting Details' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
