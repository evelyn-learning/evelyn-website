/**
 * AP US History — CED Unit 1.4-1.5: The Columbian Exchange.
 *
 * Period-1 fan-out content plan (follows the Period-3 Vertical Slice's
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Second plan in Period 1's within-period chain
 * (native-societies → columbian-exchange → spanish-colonization).
 *
 * Anchor text: Christopher Columbus's 1493 letter to Luis de Santángel —
 * evelyn.passage.apush-columbus-letter.v1. Teaching point is the
 * BIDIRECTIONAL nature of the Columbian Exchange (crops/goods moved both
 * ways across the Atlantic; disease overwhelmingly moved west) and
 * Columbus's own framing of the encounter as Europe's first widely
 * circulated account of the "New World." Quotes ONLY the seeded excerpt
 * ("guileless, and so liberal" — not "artless and generous").
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U1_COLUMBIAN_EXCHANGE: LessonPlan = {
  id: 'evelyn.ap.apush.columbian-exchange.v1',
  title: 'U1.4 The Columbian Exchange',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.columbian-exchange',
      description:
        'Explain the causes and effects of the Columbian Exchange, including the bidirectional transfer of crops, animals, and disease between the Americas and the Eastern Hemisphere, and the demographic catastrophe disease inflicted on Native American populations.',
      standard: 'AP-APUSH-1.4',
    },
  ],
  prerequisites: ['apush.native-societies'],
  followUps: ['apush.spanish-colonization'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Columbian Exchange as a two-way biological transformation of both hemispheres, not a one-way delivery of European goods to a passive Americas.',
      script:
        "Picture a plate of spaghetti with tomato sauce in Italy, or a bag of potato chips in Ireland, or a field of corn in sub-Saharan Africa. None of those foods existed in the Eastern Hemisphere before 1492 — tomatoes, potatoes, and maize all originated in the Americas, and all three reshaped diets and populations across Europe, Africa, and Asia within a couple of centuries of contact. Meanwhile, no horse, no cow, and no wheat field existed anywhere in the Americas before Europeans brought them. And the deadliest transfer of all left almost no visible trace on a dinner plate: diseases like smallpox, to which Native peoples had no prior exposure, killed on a scale historians still struggle to fully convey. This unit is about that whole two-way exchange — crops, animals, and disease — moving across the Atlantic in both directions, with consequences that were nowhere close to equal on both sides.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-columbian-exchange',
      kind: 'concept',
      goal: 'Explain the bidirectional transfer of crops, animals, and disease in the Columbian Exchange and its demographic impact on Native American populations.',
      keyIdeas: [
        'WHAT THE COLUMBIAN EXCHANGE WAS: the transfer of plants, animals, diseases, and people between the Eastern Hemisphere (Europe, Africa, Asia) and the Western Hemisphere (the Americas) that began with sustained contact after 1492 — one of the largest ecological and demographic transformations in human history.',
        'AMERICAS → EASTERN HEMISPHERE: maize, potatoes, and tomatoes (along with beans, squash, and cacao) moved east across the Atlantic. These crops transformed diets and, in some regions, enabled substantial population growth in Europe, Africa, and Asia over the following centuries — the potato in particular became a staple crop across much of Northern Europe.',
        'EASTERN HEMISPHERE → AMERICAS: wheat, horses, and cattle (along with pigs and sugar cane) moved west. Horses in particular transformed how many Native peoples of the Americas hunted, traveled, and made war in the generations after their introduction — an animal that had not existed anywhere in the Americas before contact.',
        'DISEASE WAS THE MOST CONSEQUENTIAL TRANSFER, AND IT MOVED OVERWHELMINGLY WEST: smallpox, measles, and influenza — diseases Native populations had no prior exposure or acquired immunity to — spread far ahead of European settlement itself in many regions, since Native trade and travel networks carried disease faster than colonists physically moved.',
        'THE DEMOGRAPHIC CATASTROPHE: the resulting population loss was staggering and regionally variable — historians estimate losses as high as roughly 90% in some of the hardest-hit regions (such as parts of the Caribbean and central Mexico) over the first century of contact. This scale should be stated carefully: it varied enormously by region and time period, and it resulted from a combination of disease, forced labor, violence, and social disruption, not disease alone.',
        'COLUMBUS\'S LETTER AS THE FIRST WIDELY CIRCULATED ACCOUNT: Columbus\'s 1493 letter to Luis de Santángel, announcing his first voyage, described the abundance of Española\'s land and the character of the people he encountered. Printed and circulated across Europe almost immediately, it gave most Europeans their first account of the "New World" — a framing that helped set expectations (of resources and people ready to be acquired) for the voyages and colonization that followed.',
        'THE EXCHANGE WAS NOT SYMMETRICAL IN ITS CONSEQUENCES: even though crops and animals moved in both directions, the demographic impact fell overwhelmingly on Native American populations, while Afro-Eurasian societies mostly gained new food sources that supported population growth — a genuinely two-way exchange in what moved, but a deeply one-sided outcome in who paid the cost.',
      ],
      vocabulary: [
        {
          term: 'Columbian Exchange',
          definition:
            'the transfer of plants, animals, diseases, and people between the Eastern and Western Hemispheres following sustained contact after 1492.',
        },
        {
          term: 'virgin soil epidemic',
          definition:
            'an epidemic among a population with no prior exposure or acquired immunity to a disease, resulting in unusually high mortality — the pattern by which smallpox and measles devastated Native American populations after contact.',
        },
        {
          term: 'demographic catastrophe',
          definition:
            "the severe, regionally variable Native American population decline following contact — estimated as high as roughly 90% in some hard-hit regions over the first century — caused by a combination of disease, forced labor, violence, and social disruption.",
        },
      ],
      passageId: 'evelyn.passage.apush-columbus-letter.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-columbus-letter',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Columbus\'s 1493 letter to Luis de Santángel, announcing his first voyage: "Española is a wonder. Its mountains and plains, and meadows, and fields, are so beautiful and rich for planting and sowing, and rearing cattle of all kinds, and for building towns and villages. The harbours on the coast, and the number and size and wholesomeness of the rivers, most of them bearing gold, surpass anything that would be believed by one who had not seen them.… It is true that when they are reassured and have thrown off this fear, they are guileless, and so liberal of all they have that no one would believe it who had not seen it." What is Columbus emphasizing, and why does that framing matter for what followed?',
      steps: [
        'SOURCE IT FIRST. Written in 1493, immediately after Columbus\'s first voyage, addressed to Luis de Santángel, a royal treasury official who had helped finance the expedition. The letter was printed and circulated across Europe within months — this is not a private diary entry but a public-facing report meant to justify further investment in the voyages.',
        'IDENTIFY THE FIRST CLAIM: ABUNDANCE. Columbus describes Española\'s land as extraordinarily fertile ("beautiful and rich for planting and sowing, and rearing cattle") and its harbors and rivers as surpassing belief, some "bearing gold." This is a description built to impress patrons who wanted a return on their investment — resources presented as abundant and ready to be exploited.',
        'IDENTIFY THE SECOND CLAIM: THE PEOPLE. Columbus describes the islanders as "guileless" and "so liberal of all they have that no one would believe it" — generous and unsuspecting once their initial fear passed. Read alongside the first claim, this description frames the people, like the land, as unresistant to what Columbus and his readers might do next.',
        'CONNECT TO THE COLUMBIAN EXCHANGE CONCEPT. This letter is not itself evidence of crops, animals, or disease moving across the Atlantic — it is evidence of the FIRST WIDELY CIRCULATED EUROPEAN FRAMING of the encounter, published before the exchange\'s ecological and demographic consequences had even begun to unfold. It shows how the earliest published account emphasized resources and people that seemed available for the taking.',
        'STATE THE LINK TO THE COURSE THESIS. Columbus\'s letter mattered less for what it accurately described than for what it circulated: an influential early account that helped generate European enthusiasm for further voyages — voyages that would set the full Columbian Exchange, and the demographic catastrophe that followed it, into motion.',
      ],
      answer:
        'Columbus emphasizes two things: the extraordinary abundance of Española\'s land (fertile for farming and cattle-raising, with harbors and gold-bearing rivers "surpass[ing] anything that would be believed") and the generous, unsuspecting character of the people he encountered ("guileless, and so liberal of all they have that no one would believe it"). Written in 1493 to a royal treasury official who had helped finance the voyage, and printed and circulated across Europe almost immediately, this letter was Europe\'s first widely read account of the encounter — not a private record, but a public case for further investment. Its framing of both the land and the people as abundant and available mattered because it helped generate European enthusiasm for the voyages that followed, setting in motion the broader Columbian Exchange whose consequences — crops and disease moving in both directions, and a demographic catastrophe for Native populations — Columbus\'s own letter does not describe or anticipate.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE crop, animal, or disease that moved from the Americas to the Eastern Hemisphere as part of the Columbian Exchange. (b) Briefly explain ONE effect this item had outside the Americas. (c) Briefly explain ONE effect the Columbian Exchange had on Native American populations.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly names an item that genuinely moved from the Americas to the Eastern Hemisphere — e.g. maize, potatoes, or tomatoes. No credit for an item that moved the opposite direction (e.g. wheat, horses, cattle) or a vague, unnamed item.',
            modelResponse:
              'The potato, originally domesticated in the Americas, moved east to Europe as part of the Columbian Exchange.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate effect the named item had outside the Americas, connected clearly to the item named in (a). No credit for a vague or disconnected effect.',
            modelResponse:
              'The potato became a staple crop across much of Northern Europe because it grew well in poor soil and produced more calories per acre than many traditional grain crops, supporting significant population growth in the following centuries.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate effect of the Columbian Exchange on Native American populations — e.g. catastrophic disease-driven population decline (virgin soil epidemics of smallpox/measles), regionally variable but severe, sometimes estimated as high as roughly 90% in the hardest-hit areas over the first century. No credit for a vague or unsupported claim about Native populations.',
            modelResponse:
              'Diseases like smallpox and measles, to which Native populations had no prior exposure, caused catastrophic population decline across much of the Americas — losses that historians estimate reached as high as roughly 90% in some of the hardest-hit regions within the first century of contact.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-one-way',
      kind: 'misconception_check',
      question:
        'True or false: the Columbian Exchange only flowed from the Eastern Hemisphere to the Americas — Europeans brought crops, animals, and disease to a "New World" that had nothing comparable to offer in return.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating "Columbian Exchange" as a synonym for "European goods arriving in the Americas," rather than a genuinely bidirectional transfer — likely because the demographic consequences (Native population loss) were so overwhelmingly one-sided that the whole exchange gets remembered as one-directional.',
          correctsTo:
            'FALSE. The exchange moved substantially in both directions. Maize, potatoes, and tomatoes moved from the Americas to the Eastern Hemisphere, reshaping diets and, in the case of the potato, enabling significant population growth across much of Northern Europe; other American crops similarly spread through Africa and Asia in the following centuries. Wheat, horses, and cattle moved the opposite direction, from the Eastern Hemisphere into the Americas. What was NOT symmetrical was the demographic cost: disease moved overwhelmingly toward the Americas, causing a Native American population catastrophe with no comparable Eastern Hemisphere counterpart. Both things are true at once — the exchange of crops, animals, and disease ran in both directions, but its consequences did not.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Columbian Exchange moved in both directions: maize, potatoes, and tomatoes went east to the Eastern Hemisphere; wheat, horses, and cattle went west to the Americas.',
        'Disease (smallpox, measles) moved overwhelmingly west, causing a demographic catastrophe among Native American populations — estimated as high as roughly 90% in some hard-hit regions over the first century, and it resulted from disease, forced labor, violence, and social disruption together.',
        'Columbus\'s 1493 letter to Luis de Santángel, printed and circulated widely, was Europe\'s first widely read account of the encounter — describing the land\'s abundance and the people as "guileless, and so liberal."',
        'The exchange was bidirectional in what moved, but deeply one-sided in its demographic consequences — do not treat it as simply "Europe brought things to the Americas."',
        'Horses, absent from the Americas before contact, transformed hunting, travel, and warfare for many Native peoples in the generations after their introduction.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.4-1.5',
    cedTitle: 'The Columbian Exchange',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-columbus-letter.v1',
        chapter: '1493',
        note: 'Columbus, letter to Luis de Santángel — anchor document for Europe\'s first widely circulated framing of the encounter.',
      },
    ],
  },
};
