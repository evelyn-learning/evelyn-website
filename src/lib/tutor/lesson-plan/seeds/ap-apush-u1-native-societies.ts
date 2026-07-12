/**
 * AP US History — CED Unit 1.2-1.3: Native American Societies Before
 * European Contact.
 *
 * Period-1 fan-out content plan (follows the Period-3 Vertical Slice's
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). First plan in Period 1's within-period chain
 * (native-societies → columbian-exchange → spanish-colonization); no
 * passage is wired here per the period spec (the wired documents describe
 * the EUROPEAN side of contact, not the pre-contact societies themselves).
 *
 * Teaching point: the diversity of pre-contact North American societies —
 * different economies (agricultural, maritime, hunting/fishing/gathering)
 * adapted to different environments, and different political structures —
 * against the two linked misconceptions of an "empty wilderness" and a
 * single, uniform "Indian culture."
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U1_NATIVE_SOCIETIES: LessonPlan = {
  id: 'evelyn.ap.apush.native-societies.v1',
  title: 'U1.2 Native American Societies Before European Contact',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.native-societies',
      description:
        'Explain how Native American societies before 1492 developed distinct economic, social, and political structures adapted to their specific environments, including Mississippian mound-building societies, Ancestral Puebloan agricultural communities, the Haudenosaunee (Iroquois) Confederacy, and Pacific Northwest maritime societies.',
      standard: 'AP-APUSH-1.2',
    },
  ],
  prerequisites: [],
  followUps: ['apush.columbian-exchange'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see pre-1492 North America as densely inhabited and enormously diverse, not an empty backdrop waiting for history to begin.',
      script:
        "Ask most people to picture North America the day before Columbus landed, and a lot of them picture emptiness — scattered small bands wandering an untouched wilderness. Here's what was actually there: a city near present-day St. Louis with a population in the same range as London at the time, built around a massive earthen mound bigger at its base than the Great Pyramid of Giza. Multi-story stone apartment complexes in the desert Southwest, some five stories tall, centuries before Europeans built anything comparable in North America. A political confederation in the Northeast, uniting five nations under a shared law, that had already been functioning for generations. Dense, permanent villages on the Pacific coast that never planted a single crop, because the salmon runs did all the providing they needed. None of this was one culture repeated across a continent — it was hundreds of distinct societies, each solving the problem of how to live off a very different environment. That diversity is exactly what this unit is about.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-native-societies-diversity',
      kind: 'concept',
      goal: 'Explain how distinct Native American societies developed different economies and political structures adapted to their environments before 1492.',
      keyIdeas: [
        'SCALE AND DIVERSITY, NOT EMPTINESS OR UNIFORMITY: pre-1492 North America held an estimated population in the millions (scholarly estimates vary widely and are still debated, but consistently place it well above the old "sparse wilderness" assumption), organized into hundreds of distinct societies speaking different languages and running different economies and governments. There was no single "Native American culture" — there were, and are, many.',
        'MISSISSIPPIAN MOUND BUILDERS (CAHOKIA): near present-day St. Louis, Cahokia was the largest pre-Columbian settlement north of Mexico, peaking roughly 1050–1200 CE with a population estimated in the range of 10,000–20,000 (some estimates run higher) centered on Monks Mound, a massive earthen platform mound. Cahokia\'s Mississippian culture depended on intensive maize agriculture in the fertile Mississippi River floodplain, supported long-distance trade networks (shell, copper, mica moving hundreds of miles), and was organized under a stratified political and religious hierarchy.',
        'ANCESTRAL PUEBLOANS: in the arid Southwest, Ancestral Puebloan communities (e.g., Chaco Canyon, Mesa Verde) built multi-story stone and adobe great houses and cliff dwellings, some standing multiple stories tall. Their economy depended on irrigated maize, beans, and squash agriculture adapted to a dry environment through careful water management, and Chaco Canyon anchored a wide regional trade network (turquoise, macaws, and other goods moved across hundreds of miles).',
        'THE HAUDENOSAUNEE (IROQUOIS) CONFEDERACY: in the Northeast woodlands, five nations (Mohawk, Oneida, Onondaga, Cayuga, Seneca) united under the Great Law of Peace, a sophisticated political alliance predating sustained European contact, with a council structure for resolving disputes between member nations. Haudenosaunee society was organized around matrilineal clans, in which women held significant social and political authority, including a voice in selecting male chiefs.',
        'PACIFIC NORTHWEST MARITIME SOCIETIES: coastal peoples of the Pacific Northwest built dense, permanent, socially stratified societies (chiefs, nobility, commoners) WITHOUT relying on agriculture at all — the annual salmon runs and other marine resources were abundant and reliable enough to support large sedentary populations. These societies practiced the potlatch, an elaborate feast at which a host distributed and even destroyed wealth to affirm and negotiate social status.',
        'THE COMMON THREAD IS ADAPTATION, NOT UNIFORMITY: what these societies shared was not a common economy or government, but a common pattern of building complex, sustainable societies closely adapted to a specific environment — farming floodplains and deserts, fishing rich coastal waters, or governing through confederation rather than monarchy. The specific solution always depended on the specific place.',
      ],
      vocabulary: [
        {
          term: 'Mississippian culture',
          definition:
            'a mound-building agricultural civilization centered in the Mississippi River valley, at its height (c. 1050–1200 CE) organized around large chiefdom centers like Cahokia; supported by maize agriculture and long-distance trade.',
        },
        {
          term: 'Cahokia',
          definition:
            'the largest pre-Columbian settlement north of Mexico, near present-day St. Louis; a Mississippian mound-building center with an estimated peak population in the 10,000–20,000 range, centered on the massive earthen Monks Mound.',
        },
        {
          term: 'Ancestral Puebloans',
          definition:
            'a Southwest agricultural civilization (e.g., Chaco Canyon, Mesa Verde) known for multi-story stone/adobe dwellings, irrigated maize farming adapted to an arid environment, and extensive regional trade networks.',
        },
        {
          term: 'Haudenosaunee (Iroquois) Confederacy',
          definition:
            'a political alliance of five Northeastern nations (Mohawk, Oneida, Onondaga, Cayuga, Seneca) governed under the Great Law of Peace, with matrilineal clan structures giving women significant political authority.',
        },
        {
          term: 'potlatch',
          definition:
            'a Pacific Northwest ceremonial feast at which a host distributed or destroyed wealth to affirm, negotiate, or elevate social status — practiced by dense, non-agricultural maritime societies supported by salmon and marine resources.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-comparing-societies',
      kind: 'worked_example',
      problem:
        'A classmate claims: "Native American societies before 1492 were all basically similar — small hunter-gatherer bands living off the land." Using Cahokia and the Pacific Northwest maritime societies as your two examples, explain why this claim is inaccurate.',
      steps: [
        'IDENTIFY THE CLAIM BEING TESTED. The claim collapses two very different things into one: (1) that all pre-1492 Native societies were small, and (2) that they were all "hunter-gatherer," meaning they did not build complex, settled societies.',
        'TEST IT AGAINST CAHOKIA. Cahokia was not small or foraging-based — at its peak (c. 1050–1200 CE) it held an estimated 10,000–20,000+ people, built the massive Monks Mound, ran on intensive maize agriculture in the Mississippi floodplain, and supported long-distance trade in shell and copper. This alone falsifies "all small hunter-gatherer bands."',
        'TEST IT AGAINST THE PACIFIC NORTHWEST. Pacific Northwest maritime societies were also large and settled — but they got there WITHOUT agriculture at all, relying instead on the salmon runs and other marine resources. This shows a second, entirely different path to a complex, stratified, permanent society (chiefs, nobility, commoners, the potlatch).',
        'DRAW THE CONTRAST BETWEEN THE TWO EXAMPLES THEMSELVES. Cahokia and the Pacific Northwest societies did not just differ from the "small hunter-gatherer" stereotype — they differed from EACH OTHER: one an agricultural river-valley civilization, the other a non-agricultural coastal one. That difference is itself evidence against treating "Native American societies" as one uniform category.',
        'STATE THE LINK TO THE COURSE THESIS. The historical reality is a spectrum of adaptations to specific environments — intensive floodplain agriculture, arid-land irrigation farming, coastal maritime economies, and confederated political alliances — not a single lifestyle repeated across the continent.',
      ],
      answer:
        'The claim is inaccurate because it treats "Native American society" as one uniform, small-scale category, when the historical record shows the opposite. Cahokia, near present-day St. Louis, was a large, agriculturally based Mississippian center — an estimated 10,000–20,000+ people at its peak (c. 1050–1200 CE), supported by intensive maize farming and long-distance trade, and organized around the massive earthen Monks Mound. Pacific Northwest maritime societies were also large and permanently settled, but reached that scale through an entirely different path: no agriculture at all, relying instead on abundant salmon runs to support dense, socially stratified populations that practiced the potlatch. These two societies not only contradict the "small hunter-gatherer band" stereotype individually — they contradict each other, since one depended on farming and the other explicitly did not. Native American societies before 1492 adapted in diverse, environment-specific ways, not through one shared lifestyle.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE way a specific Native American society adapted its economy to its environment before 1492. (b) Briefly explain ONE piece of specific historical evidence that supports your answer to (a). (c) Briefly explain ONE way two Native American societies differed from each other in social or political organization.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine economic adaptation by a named Native American society before 1492 — e.g. Mississippian floodplain maize agriculture at Cahokia, Ancestral Puebloan irrigated agriculture in the arid Southwest, or Pacific Northwest reliance on salmon runs without agriculture. No credit for a vague, unnamed "lived off the land" statement.',
            modelResponse:
              'The Ancestral Puebloans of the Southwest adapted to their arid environment by developing irrigated agriculture, channeling scarce water to grow maize, beans, and squash in a region that received little rainfall.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence (a site, structure, or practice) that supports the adaptation named in (a) and connects it clearly to that adaptation. No credit for evidence that is generic or unconnected to the stated adaptation.',
            modelResponse:
              'Chaco Canyon\'s multi-story stone great houses and its network of water-management and trade infrastructure show the scale of organization the Ancestral Puebloans achieved by adapting agriculture to a dry environment, supporting large communities that similar unirrigated farming could not.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate difference in social or political organization between two named Native American societies — e.g. the Haudenosaunee\'s confederated, matrilineal political alliance versus Cahokia\'s stratified chiefdom hierarchy, or the Pacific Northwest\'s non-agricultural, potlatch-based hierarchy versus an agricultural society\'s hierarchy. No credit for a vague or unsupported contrast.',
            modelResponse:
              'The Haudenosaunee Confederacy organized political authority through a council of five united nations bound by the Great Law of Peace, with matrilineal clans giving women a voice in selecting chiefs, while Cahokia was organized as a single stratified chiefdom with religious and political authority concentrated in a ruling hierarchy rather than distributed among allied nations.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-empty-wilderness',
      kind: 'misconception_check',
      question:
        'True or false: before 1492, North America was a sparsely populated wilderness, and the Native peoples living there shared basically one common culture and way of life.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Collapsing two separate errors into one assumption: treating pre-contact North America as empty (rather than densely inhabited) and treating its inhabitants as culturally uniform (rather than organized into hundreds of distinct societies).',
          correctsTo:
            'FALSE, on both counts. North America before 1492 held an estimated population in the millions, organized into hundreds of distinct societies with different languages, economies, and governments. It was not empty: Cahokia alone held an estimated 10,000–20,000+ people at its peak (c. 1050–1200 CE), built on intensive maize agriculture and the massive earthen Monks Mound. And it was not uniform: Ancestral Puebloan communities farmed irrigated maize in the arid Southwest; the Haudenosaunee Confederacy governed through an alliance of five nations under the Great Law of Peace with matrilineal clans; Pacific Northwest maritime peoples built dense, stratified societies on salmon runs without farming at all. Treating "Native America" as an empty backdrop or a single culture erases the specific, environment-adapted societies the AP exam expects you to be able to name.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pre-1492 North America held an estimated population in the millions across hundreds of distinct societies — not an empty wilderness.',
        'Cahokia (Mississippian culture): the largest pre-Columbian settlement north of Mexico, an estimated 10,000–20,000+ people at its peak (c. 1050–1200 CE), built on intensive maize agriculture and centered on Monks Mound.',
        'Ancestral Puebloans adapted to the arid Southwest through irrigated maize agriculture and multi-story stone/adobe dwellings (Chaco Canyon, Mesa Verde).',
        'The Haudenosaunee (Iroquois) Confederacy united five nations under the Great Law of Peace, with matrilineal clans giving women political authority.',
        'Pacific Northwest maritime societies built dense, stratified societies (the potlatch) on abundant salmon runs — without agriculture at all.',
        'The common thread across these societies is adaptation to a specific environment, not a shared uniform culture.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.2-1.3',
    cedTitle: 'Native American Societies Before European Contact',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
