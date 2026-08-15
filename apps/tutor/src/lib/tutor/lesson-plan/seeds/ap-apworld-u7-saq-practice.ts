/**
 * AP World History: Modern — Unit 7 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ).
 *
 * Stimulus-based: this SAQ explicitly asks the student to use the excerpt
 * below, so it sets `passageId` — evelyn.passage.apworld-fourteen-points.v1,
 * Woodrow Wilson's Fourteen Points (1918) (the same excerpt seeded as
 * Document 1 of the Unit-7 DBQ packet). Each of the three parts is graded
 * independently, 1 point each, brief-response format (2-4 sentences),
 * scored against the authentic AP World SAQ rubric style. Prompt draws on
 * WWI as a global war (7.1-7.3, the postwar settlement) and interwar
 * anti-imperial ferment (7.4-7.6).
 *
 * DOCUMENT FIDELITY: the excerpt contains three of Wilson's fourteen
 * points (I, V, XIV); to keep the SAQ's three parts logically chained and
 * unambiguous, part (a) is scoped explicitly to Point V (the colonial-
 * claims-adjustment principle), since parts (b) and (c) both build on that
 * specific principle's postwar fate. Part (c)'s colonial response is Ho Chi
 * Minh's 1919 petition to the Paris Peace Conference — already established,
 * described (never quoted), in the Unit-7 interwar-world content plan — kept
 * consistent with that plan rather than introducing a new fact here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U7_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u7-saq-practice.v1',
  title: 'Unit 7 SAQ Practice — Wilson\'s Fourteen Points and the Colonial Gap',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u7-saq-practice',
      description:
        'Answer a complete three-part AP World History Short Answer Question using a stimulus excerpt from Woodrow Wilson\'s Fourteen Points (1918) — briefly describing the excerpt\'s colonial-claims principle, explaining how the postwar settlement departed from it, and explaining a colonial political response to that gap — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-7-SAQ',
    },
  ],
  prerequisites: [
    'apworld.wwi-global',
    'apworld.interwar-world',
    'apworld.wwii-global',
    'apworld.conflict-legacies',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how Wilson's Fourteen Points promised colonized peoples a real say in the postwar settlement, and how the actual peace delivered something very different. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part — using Wilson's own words as your stimulus. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, using the Fourteen Points excerpt as the stimulus.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THIS SAQ IS STIMULUS-BASED: part (a) requires you to engage with what the excerpt actually says; parts (b) and (c) ask you to go beyond the excerpt, using your own knowledge of what happened AFTER Wilson made this promise — the excerpt itself does not narrate the peace settlement or any colonial response to it.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — here, describing the specific colonial-claims principle in Point V (that colonized populations\' interests must have "equal weight" with the claims of the government seeking title over them).',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — for part (b), connecting Point V\'s promise to the specific postwar reality (the mandate system\'s "tutelage" language) that departed from it; for part (c), connecting that gap to a specific colonial political response (Ho Chi Minh\'s 1919 petition to the Paris Peace Conference).',
        'The single most common way students lose SAQ points is being too vague: "the peace treaty didn\'t match what Wilson said" earns nothing, but "the mandate system assigned tutelage over colonized peoples to Allied powers instead of weighing their interests equally, as Wilson had promised" earns credit because it states the specific departure.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below from Woodrow Wilson\'s Fourteen Points (1918), answer parts (a), (b), and (c).\n(a) Describe the principle Wilson states in the excerpt regarding the adjustment of colonial claims.\n(b) Explain ONE way the postwar settlement departed from that principle.\n(c) Explain ONE colonial political response to that gap between promise and reality.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-fourteen-points.v1',
      expectedAnswer:
        '(a) In Point V, Wilson calls for "a free, open-minded, and absolutely impartial adjustment of all colonial claims," insisting that "the interests of the populations concerned must have equal weight with the equitable claims of the government whose title is to be determined" — in other words, colonized peoples\' own interests should count as much as the claims of the power that governs them, not be dismissed automatically in the imperial power\'s favor. (b) The mandate system established by Article 22 of the Covenant of the League of Nations, incorporated into the Treaty of Versailles (1919), departed sharply from this principle: instead of weighing colonized peoples\' interests equally, it labeled the populations of former German colonies and Ottoman territories as "not yet able to stand by themselves under the strenuous conditions of the modern world" and assigned "tutelage" over them to Allied "Mandatory" powers — chiefly Britain and France, who administered former Ottoman territories like Iraq, Palestine, and Syria/Lebanon much as they administered their existing colonies, rather than treating those populations\' own interests as equally weighted. (c) One colonial political response to that gap was the young Vietnamese nationalist later known as Ho Chi Minh\'s 1919 petition to the Paris Peace Conference, which explicitly invoked Wilson\'s own stated principle of self-determination to call for basic civil rights and greater political voice for the Vietnamese people under French colonial rule; the conference did not take up the petition, but it is a documented example of colonized peoples directly citing Wilson\'s wartime promise to demand the equal treatment the postwar settlement failed to deliver.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes Point V\'s colonial-claims principle — that colonized populations\' interests must have "equal weight" with the claims of the government seeking title over them, in an "impartial" adjustment process. No credit (0/1) for a vague statement with no specific reference to the excerpt\'s actual principle, a description of a different point (I or XIV) presented as if it were the colonial-claims principle, or a description that misstates it.',
            modelResponse:
              'In Point V, Wilson calls for colonial claims to be adjusted "impartially," stating that the interests of the populations living in a colonized territory must be given "equal weight" with the claims of the government seeking title over that territory — treating colonized peoples\' own interests as a legitimate factor rather than an afterthought.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, accurate way the postwar settlement departed from Point V\'s principle — e.g. the Versailles mandate system\'s "tutelage" language assigning former German/Ottoman territories to Allied powers rather than weighing colonized peoples\' interests equally. No credit (0/1) for a vague statement with no specific historical grounding, or one that does not connect to the excerpt\'s actual principle.',
            modelResponse:
              'The mandate system established by Article 22 of the Versailles treaty (1919) departed from this principle: instead of weighing colonized peoples\' interests equally, it labeled the populations of former German and Ottoman territories as "not yet able to stand by themselves" and assigned "tutelage" over them to Allied Mandatory powers, chiefly Britain and France, extending a form of colonial administration rather than the impartial process Wilson had promised.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly explains ONE specific, historically accurate colonial political response to the gap between Wilson\'s promise and the postwar settlement — e.g. Ho Chi Minh\'s 1919 petition to the Paris Peace Conference invoking Wilson\'s own self-determination principle. No credit (0/1) for a vague claim with no specific response named, or a response that is not historically accurate.',
            modelResponse:
              "One colonial response to this gap was the young Vietnamese nationalist later known as Ho Chi Minh's 1919 petition to the Paris Peace Conference, which invoked Wilson's own stated principle of self-determination to call for civil rights and greater political voice for the Vietnamese people under French colonial rule — a direct appeal to the promise the postwar settlement had just failed to deliver.",
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'Part (a) asks specifically about the colonial-claims principle (Point V) — don\'t describe Point I (open diplomacy) or Point XIV (the League of Nations) instead.',
        'Part (c) is the one place you go furthest beyond the excerpt: it does not narrate any colonial response, so bring in that outside knowledge yourself.',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific description/explanation per part — no thesis, no contextualization, no outside-evidence requirement.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        '"Briefly explain" always means fact + connection to WHY/HOW it matters — a fact alone often only satisfies a "describe" part.',
        'The excerpt only makes Wilson\'s Point V promise — it does not narrate the mandate system or any colonial response. Parts (b) and (c) require your own outside knowledge of Versailles\'s Article 22 and Ho Chi Minh\'s 1919 petition.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7-SAQ',
    cedTitle: 'Unit 7 SAQ Practice — Wilson\'s Fourteen Points and the Colonial Gap',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-fourteen-points.v1',
        chapter: '1918',
        note: 'Woodrow Wilson, Fourteen Points, Point V — stimulus excerpt for this SAQ.',
      },
    ],
  },
};
