/**
 * AP World History: Modern — CED Unit 3.1: Empires Expand.
 *
 * Unit-3 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did the Ottoman, Safavid, Mughal, Qing, and Russian empires use
 * gunpowder weapons, cavalry, and administrative capacity together to
 * expand and consolidate rule over vast, diverse territories, 1450-1750?).
 *
 * UNWIRED per the Unit-3 block: no passage is anchored to this topic. The
 * worked_example is therefore a structured claim-evaluation exercise
 * (identify what's accurate / what's overreach / counterevidence /
 * revised conclusion), following the Unit-1 `dar-al-islam` unwired
 * template, rather than a source-quote analysis.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U3_EMPIRES_EXPANSION: LessonPlan = {
  id: 'evelyn.ap.apworld.empires-expansion.v1',
  title: 'U3.1 Empires Expand',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.empires-expansion',
      description:
        'Explain how the Ottoman, Safavid, Mughal, Qing, and Russian empires used gunpowder weapons, cavalry, and administrative capacity to expand and consolidate power over diverse populations and vast territories in the period 1450-1750.',
      standard: 'AP-APWORLD-3.1',
    },
  ],
  prerequisites: ['apworld.east-asia-song'],
  followUps: ['apworld.empires-administration'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: "Make the point that gunpowder alone doesn't explain these empires' expansion — administration and cavalry mattered just as much.",
      script:
        "In 1453, Ottoman cannons breached walls that had turned back besieging armies for a thousand years, and Constantinople fell. It's tempting to tell the whole story of this era's land-based empires — Ottoman, Safavid, Mughal, Qing, Russian — as a story about guns: whoever had the better artillery won. But guns don't besiege a city for weeks, feed an army, or govern the population left behind once the walls come down. The empires that actually endured after 1450 combined gunpowder weapons with something less dramatic but just as decisive: the administrative capacity to finance, supply, and organize the conquest — and often, still, cavalry. This topic is about seeing both halves of that story at once.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-empires-expand',
      kind: 'concept',
      goal: 'Explain how the Ottoman, Safavid, Mughal, Qing, and Russian empires expanded and consolidated power through a combination of gunpowder weapons, cavalry, and administrative/logistical capacity, 1450-1750.',
      keyIdeas: [
        'THE OTTOMAN CONQUEST OF CONSTANTINOPLE (1453): Sultan Mehmed II besieged the Byzantine capital with massive siege cannons (including enormous bombards built for the siege) that finally breached the ancient Theodosian Walls, ending the thousand-year-old Byzantine Empire and giving the Ottomans a capital (renamed Istanbul) spanning Europe and Asia. The cannons opened the breach, but a months-long siege, a naval blockade of the Golden Horn, and a disciplined force to exploit the breach were what actually took the city.',
        'THE SAFAVID EMPIRE was founded in 1501 by Shah Ismail I, who conquered Persia and imposed Twelver Shiism as the state religion — a political and military founding that also set up a lasting rivalry with the Sunni Ottoman Empire to its west.',
        'THE MUGHAL EMPIRE was founded in 1526 when Babur, a Central Asian prince descended from Timur and Genghis Khan, defeated the much larger army of the Delhi Sultanate at the First Battle of Panipat using gunpowder weapons (matchlock guns and cannon, organized behind a fortified line of carts) combined with flanking cavalry charges — guns created the opening, cavalry mobility exploited it. Akbar (r. 1556-1605) then consolidated and expanded Mughal rule across most of the Indian subcontinent.',
        'THE QING CONQUEST OF MING CHINA (1644): gunpowder-equipped Manchu banner armies took advantage of Ming collapse to seize Beijing and, over subsequent decades, the rest of China, founding the Qing Dynasty. Conquest was only the first step — lasting Qing rule depended on absorbing and continuing the existing, already-sophisticated Ming bureaucratic and civil-service apparatus rather than ruling by force alone.',
        'RUSSIAN EXPANSION EASTWARD: Ivan IV ("the Terrible") was crowned the first Russian tsar in 1547 and began pushing Russian control east of the Ural Mountains into Siberia; this expansion continued for generations (including under Peter the Great, r. 1682-1725), driven by the fur trade and organized through small, mobile, gunpowder-armed forces (including Cossack bands) rather than large standing armies, gradually incorporating vast, sparsely populated territory.',
        'GUNPOWDER WEAPONS — cannon capable of breaching fortified walls, and hand-held firearms that reduced the training time needed to field an effective soldier compared to, say, a mounted archer — gave centralizing states a real military edge against both rival empires and older, cavalry-based nomadic powers whose mobility had long been militarily decisive.',
        "CAVALRY DID NOT DISAPPEAR: the transition from cavalry-dominant to gun-and-infantry-dominant warfare was gradual, not sudden. Babur's victory at Panipat itself depended on cavalry as much as guns; Ottoman, Safavid, and Mughal armies all continued to rely on cavalry alongside gunpowder infantry and artillery for generations after 1450.",
        "THE COMBINED EFFECT: gunpowder weapons were a genuine, shared technological edge across these empires' expansion — but administrative capacity (financing sieges, supplying armies, absorbing or building bureaucracies to govern conquered territory) and continued reliance on cavalry were equally necessary. An empire with guns but no capacity to administer what it conquered would not have endured; several of these empires' administrative solutions are the subject of the next topic.",
      ],
      vocabulary: [
        {
          term: 'gunpowder empires',
          definition:
            "a historians' label (not a period term) for early modern land-based empires — often applied to the Ottomans, Safavids, and Mughals — whose expansion is associated with gunpowder-weapon adoption, though administrative and cavalry capacity mattered just as much to their success.",
        },
        {
          term: 'siege artillery',
          definition:
            'large gunpowder cannon built or deployed specifically to breach fortified walls, as in the Ottoman bombardment of Constantinople\'s Theodosian Walls in 1453.',
        },
        {
          term: 'Manchu banners',
          definition:
            "the hereditary military-social units that formed the core of the conquering Manchu military elite in the 1644 Qing conquest of Ming China; discussed further as an administrative institution in the next topic.",
        },
        {
          term: 'tsar',
          definition:
            'the title ("Caesar") adopted by Ivan IV in 1547 as the first Russian ruler crowned under that title, marking a claim to imperial authority as Russian territory expanded.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-guns-alone-claim',
      kind: 'worked_example',
      problem:
        'A student claims: "Babur defeated the far larger army of the Delhi Sultanate at the First Battle of Panipat (1526) simply because he had cannons and the Lodis did not." Evaluate this claim using what you know about the founding of the Mughal Empire and land-based-empire expansion more broadly, 1450-1750.',
      steps: [
        "IDENTIFY WHAT'S ACCURATE. Babur's forces did include gunpowder weapons — matchlock guns and cannon, organized with Ottoman-style tactical advice — a real technological edge the more traditionally organized, larger Lodi army lacked.",
        "IDENTIFY THE OVERREACH. Reducing the victory to guns ALONE ignores that Babur's army used INTEGRATED tactics: gunpowder weapons positioned behind a fortified barrier of carts, combined with flanking cavalry charges that encircled the Lodi army once gunfire had disordered its front lines, including its war elephants. Guns created the opening; cavalry mobility exploited it — neither alone would have won the battle.",
        "CITE A PARALLEL — THE OTTOMAN CASE. At Constantinople in 1453, Mehmed II's siege cannons breached the Theodosian Walls, but capturing the city also required sustained administrative capacity: financing a months-long siege, coordinating a naval blockade of the Golden Horn, and organizing a disciplined force to exploit the breach once it opened. Gunpowder created a hole in the wall; organization is what walked an army through it.",
        'CITE A PARALLEL — THE QING CASE. The 1644 Qing conquest of Ming China rested on gunpowder-equipped Manchu banner armies, but DURABLE control of a vast, populous, already-bureaucratized empire depended on absorbing and continuing the existing Ming administrative apparatus, not on artillery.',
        "STATE A REVISED CONCLUSION. Gunpowder weapons were a genuine, shared edge across these empires' expansion, but administrative capacity (financing, logistics, absorbing or building bureaucracies) and cavalry/tactical organization were equally decisive. An empire built on guns alone, without the administrative or military-organizational capacity to consolidate a conquest, would not have endured.",
      ],
      answer:
        "The claim is half right and half overreach. It is accurate that Babur's gunpowder weapons — matchlock guns and cannon — gave him a real edge the Lodi army lacked. But it overreaches by crediting guns ALONE: Babur's victory depended on integrating those guns with a fortified cart-barrier and flanking cavalry charges that exploited the disorder gunfire caused in the Lodi ranks. The same pattern holds elsewhere: Mehmed II's cannons breached Constantinople's walls in 1453, but capturing the city took a financed, organized siege and naval blockade; the Qing conquest of Ming China in 1644 rested on gunpowder-armed Manchu banners, but lasting Qing rule depended on absorbing the existing Ming bureaucracy. Across these empires, gunpowder created opportunities that administrative capacity and cavalry/tactical organization were needed to convert into lasting power.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE land-based empire founded or substantially expanded using gunpowder weapons in the period 1450-1750. (b) Explain how gunpowder weapons contributed to that empire's expansion. (c) Explain ONE non-gunpowder factor (administrative, cavalry, or organizational) that also contributed to that empire's successful expansion or consolidation.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine land-based empire whose founding or expansion involved gunpowder weapons in this period — e.g. the Ottoman, Mughal, Qing, or Safavid empire, or Russia. No credit for a vague statement with no identifiable specific empire, or an anachronistic/incorrect one.',
            modelResponse:
              'One land-based empire that expanded using gunpowder weapons was the Ottoman Empire.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate mechanism by which gunpowder weapons contributed to that empire's expansion — e.g. breaching fortified walls, defeating cavalry-based rivals, or reducing training time for effective infantry. No credit for a vague claim disconnected from the empire named in (a).",
            modelResponse:
              "The Ottomans used massive siege cannons to breach the previously impregnable Theodosian Walls of Constantinople in 1453, ending the Byzantine Empire and giving the Ottomans a capital spanning Europe and Asia.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, historically accurate NON-gunpowder factor — e.g. administrative/logistical capacity to finance and organize a siege or campaign, continued reliance on cavalry, or absorption of an existing bureaucracy. No credit for restating a gunpowder-based factor or a vague, unsupported claim.",
            modelResponse:
              "Taking Constantinople also required the Ottomans to sustain a months-long siege and coordinate a naval blockade of the Golden Horn — an administrative and logistical achievement, not just a technological one, since financing and supplying such a prolonged siege required an organized, well-resourced state.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-guns-alone',
      kind: 'misconception_check',
      question:
        'True or false: land-based empires like the Ottomans, Mughals, and Qing expanded primarily because they possessed superior gunpowder weapons, while administrative capacity and cavalry played only a marginal role.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Crediting gunpowder technology ALONE for these empires' expansion — the 'gunpowder empires' label misleads students into treating administration and cavalry as afterthoughts rather than co-equal causes.",
          correctsTo:
            "FALSE. Gunpowder weapons were a genuine, shared technological edge — Ottoman siege cannon breached Constantinople's walls in 1453, and Babur's guns helped defeat a much larger Lodi army at Panipat in 1526 — but guns alone do not explain these empires' expansion or endurance. Babur's Panipat victory also depended on flanking cavalry charges; the Ottomans needed a financed, organized siege and naval blockade to actually take Constantinople; the Qing conquest of Ming China in 1644 rested on gunpowder-armed Manchu banners, but LASTING Qing rule depended on absorbing the existing, already-sophisticated Ming bureaucracy. On the AP exam, treat gunpowder technology, administrative/logistical capacity, and continued cavalry use as CO-EQUAL causes of these empires' expansion and consolidation, not gunpowder as the whole story.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Mehmed II's siege cannons breached Constantinople's Theodosian Walls in 1453, ending the Byzantine Empire — but taking the city also required a financed, organized siege and naval blockade.",
        'The Safavid Empire (founded 1501, Shah Ismail I) imposed Twelver Shiism as state religion, setting up a lasting rivalry with the Sunni Ottomans.',
        "Babur founded the Mughal Empire in 1526 by combining gunpowder weapons with flanking cavalry tactics to defeat the larger Delhi Sultanate army at Panipat; Akbar (r. 1556-1605) then consolidated Mughal rule.",
        "The Qing conquest of Ming China (1644) used gunpowder-armed Manchu banner armies, but lasting rule depended on absorbing the existing Ming bureaucracy, not artillery.",
        'Ivan IV was crowned the first Russian tsar in 1547 and began Russian expansion east into Siberia, continued for generations by small, mobile, gunpowder-armed forces.',
        "Gunpowder weapons, administrative/logistical capacity, and continued cavalry use were CO-EQUAL causes of these empires' expansion — not gunpowder alone.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.1',
    cedTitle: 'Empires Expand',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP World History' }],
  },
};
