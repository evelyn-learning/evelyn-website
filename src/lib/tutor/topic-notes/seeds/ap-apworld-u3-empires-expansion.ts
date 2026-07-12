/**
 * AP World History — Unit 3 CED 3.1: Empires Expand.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.empires-expansion.v1`. Covers the Ottoman, Safavid,
 * Mughal, Qing, and Russian empires' expansion via gunpowder weapons,
 * cavalry, and administrative capacity, 1450-1750 — and the misconception
 * that gunpowder technology alone explains their rise.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_EMPIRES_EXPANSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.empires-expansion.v1',
  course: 'AP World History',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Empires Expand',
  planId: 'evelyn.ap.apworld.empires-expansion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.empires-expansion.v1' }],
  theory: [
    {
      loId: 'apworld.empires-expansion',
      kind: 'definition',
      title: 'gunpowder empires',
      content:
        "A historians' label (not a period term) for early modern land-based empires — often applied to the Ottomans, Safavids, and Mughals — whose expansion is associated with gunpowder-weapon adoption. Administrative and cavalry capacity mattered just as much to their success; treat the label as shorthand, not a full explanation.",
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'definition',
      title: 'siege artillery',
      content:
        "Large gunpowder cannon built or deployed specifically to breach fortified walls, as in the Ottoman bombardment of Constantinople's Theodosian Walls in 1453 — cannon that had turned back besiegers for a thousand years.",
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'event',
      title: 'Ottoman conquest of Constantinople (1453)',
      content:
        "Sultan Mehmed II besieged the Byzantine capital with massive siege cannons that finally breached the ancient Theodosian Walls, ending the thousand-year-old Byzantine Empire. The cannons opened the breach, but a months-long financed siege, a naval blockade of the Golden Horn, and a disciplined force to exploit the breach were what actually took the city.",
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'event',
      title: 'Safavid Empire founded (1501)',
      content:
        'Shah Ismail I conquered Persia and imposed Twelver Shiism as the state religion — a political and military founding that also set up a lasting rivalry with the Sunni Ottoman Empire.',
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'event',
      title: 'Mughal Empire founded (1526, First Battle of Panipat)',
      content:
        'Babur, a Central Asian prince descended from Timur and Genghis Khan, defeated the much larger Delhi Sultanate army by combining gunpowder weapons (matchlock guns and cannon, behind a fortified line of carts) with flanking cavalry charges. Akbar (r. 1556-1605) then consolidated and expanded Mughal rule across most of the subcontinent.',
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'event',
      title: 'Qing conquest of Ming China (1644)',
      content:
        'Gunpowder-equipped Manchu banner armies took Beijing amid Ming collapse, founding the Qing Dynasty. Lasting rule depended on absorbing and continuing the existing, already-sophisticated Ming bureaucratic apparatus, not on artillery alone.',
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'event',
      title: 'Russian expansion eastward',
      content:
        'Ivan IV ("the Terrible") was crowned the first Russian tsar in 1547 and began pushing Russian control east of the Urals into Siberia, continued for generations (including under Peter the Great, r. 1682-1725) by small, mobile, gunpowder-armed forces (including Cossack bands) rather than large standing armies.',
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'cause',
      title: 'gunpowder weapons gave a real military edge',
      content:
        'Cannon capable of breaching fortified walls, and hand-held firearms that reduced the training time needed to field an effective soldier, gave centralizing states an edge against both rival empires and older, cavalry-based nomadic powers whose mobility had long been militarily decisive.',
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'cause',
      title: 'cavalry did not disappear',
      content:
        "The shift from cavalry-dominant to gun-and-infantry-dominant warfare was gradual, not sudden. Babur's Panipat victory depended on cavalry as much as guns; Ottoman, Safavid, and Mughal armies all continued relying on cavalry alongside gunpowder infantry and artillery for generations after 1450.",
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'framework',
      title: 'gunpowder + administration + cavalry, combined',
      content:
        "Gunpowder weapons were a genuine, shared technological edge, but administrative capacity (financing sieges, supplying armies, absorbing or building bureaucracies to govern conquered territory) and continued reliance on cavalry were equally necessary. An empire with guns but no capacity to administer what it conquered would not have endured.",
    },
    {
      loId: 'apworld.empires-expansion',
      kind: 'trap',
      title: 'do not credit gunpowder alone',
      content:
        "The 'gunpowder empires' label can mislead: guns created openings (a breach in a wall, a disordered enemy line), but financed/organized sieges, logistics, and continued cavalry use were what converted those openings into lasting conquest and rule.",
    },
  ],
  methods: [
    {
      title: "Evaluate a technological-determinism claim about an empire's expansion",
      when_to_use:
        "Use this when a claim credits a single military technology (usually gunpowder) as the SOLE cause of an empire's victory or expansion.",
      steps: [
        'Identify what part of the claim is accurate (the technology really was present and gave an edge).',
        'Identify the overreach (crediting the technology ALONE, ignoring other necessary factors).',
        'Cite a parallel case where administrative/logistical capacity, or cavalry, was equally necessary to convert a technological edge into lasting control.',
        'State a revised conclusion naming gunpowder, administrative capacity, and (where relevant) cavalry as co-equal causes.',
      ],
      example: {
        problem:
          'Evaluate: "Babur defeated the Lodi army at Panipat (1526) simply because he had cannons and the Lodis did not."',
        solution:
          "Accurate: Babur's gunpowder weapons gave a real edge the Lodi army lacked. Overreach: crediting guns alone ignores that Babur's victory depended on integrating guns with a fortified cart-barrier and flanking cavalry charges. Parallel: the Ottomans needed a financed, organized siege and naval blockade — not just cannon — to take Constantinople in 1453; the Qing needed to absorb the existing Ming bureaucracy to hold China after 1644. Revised conclusion: gunpowder, administrative capacity, and cavalry were co-equal causes of these empires' expansion.",
      },
      relatedLoIds: ['apworld.empires-expansion'],
    },
  ],
  pointers: [
    { content: 'The "gunpowder empires" label is a historians\' shorthand, not a full explanation — never credit gunpowder technology alone for an empire\'s rise on an FRQ.', kind: 'trap' },
    { content: "Mehmed II's cannons breached Constantinople's walls in 1453, but taking the city also required a financed siege and a naval blockade of the Golden Horn — a good example for arguing administrative capacity mattered as much as guns.", kind: 'frq-vocab' },
    { content: "Babur's 1526 Panipat victory combined gunpowder weapons with flanking cavalry — cavalry did not vanish once gunpowder arrived; the transition was gradual across the Ottoman, Safavid, and Mughal armies.", kind: 'tip' },
    { content: 'The Qing conquest of Ming China (1644) used gunpowder-armed Manchu banners, but LASTING rule depended on absorbing the existing Ming bureaucracy — conquest and consolidation are different problems.', kind: 'tip' },
    { content: 'Ivan IV was crowned the first Russian tsar in 1547; Russian eastward expansion into Siberia was driven by the fur trade and small mobile forces, not a single dramatic gunpowder battle.', kind: 'tip' },
  ],
};
