/**
 * AP World History — Unit 6 CED 6.3: Resistance to Imperialism.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.imperial-resistance.v1`. Covers the range of
 * resistance to imperial expansion (armed rebellion, monarchical/military
 * resistance, millenarian movements) and the factors distinguishing
 * successful resistance (Adwa) from suppressed resistance that was still
 * consequential (the Sepoy Rebellion), 1857-1901.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U6_IMPERIAL_RESISTANCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.imperial-resistance.v1',
  course: 'AP World History: Modern',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Resistance to Imperialism',
  planId: 'evelyn.ap.apworld.imperial-resistance.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.imperial-resistance.v1' }],
  theory: [
    {
      loId: 'apworld.imperial-resistance',
      kind: 'definition',
      title: 'Sepoy Rebellion (1857)',
      content:
        "A large-scale uprising of Indian soldiers (sepoys) in the British East India Company's army, joined by many Indian rulers and civilians, sparked by grievances including new cartridges rumored to be greased with cow and pig fat, layered on long-building resentment at Company rule. Suppressed after over a year of fighting, but serious enough that the Crown dissolved Company rule and assumed direct control (the Raj) in 1858.",
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'definition',
      title: 'millenarian movement',
      content:
        'A religious or prophetic movement that responds to crisis or foreign pressure with the expectation of imminent, often supernaturally delivered, deliverance or transformation, rather than conventional political/military organizing — e.g. the Xhosa cattle-killing movement (1856-57).',
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'event',
      title: 'Battle of Adwa (1896)',
      content:
        "Emperor Menelik II's Ethiopian forces decisively defeated an invading Italian army, forcing Italy to recognize Ethiopian independence. The clearest counterexample to \"resistance always failed\": Ethiopia remained one of only two African states (with Liberia) never formally colonized.",
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'event',
      title: 'Yaa Asantewaa and the War of the Golden Stool (1900)',
      content:
        "Yaa Asantewaa, Queen Mother of Ejisu, led Asante forces against British demands to surrender the Golden Stool (the sacred symbol of Asante royal authority) — the last major Asante war against British rule. Ultimately suppressed and Asante formally annexed, but a striking example of a woman leading a state's most significant armed resistance to colonization.",
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'event',
      title: 'Anglo-Zulu War (1879)',
      content:
        'The Zulu Kingdom inflicted a major defeat on British forces at the Battle of Isandlwana — one of the most significant tactical defeats a colonial power suffered against an African army in this period — but sustained British reinforcement led to Zulu defeat later the same year and the breakup of Zulu independent power.',
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'event',
      title: 'Boxer Uprising (1899-1901)',
      content:
        'An anti-foreign, anti-Christian movement in Qing China, eventually backed by the Qing court, that besieged foreign legations in Beijing. An international Eight-Nation Alliance suppressed it; the resulting Boxer Protocol (1901) imposed a large indemnity and further concessions — resistance here provoked harsher intervention rather than relief.',
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'event',
      title: 'Xhosa cattle-killing movement (1856-57)',
      content:
        "Followed a prophecy that killing cattle and destroying crops would bring ancestral spirits to drive out European settlers in southern Africa. The resulting famine catastrophically weakened Xhosa capacity to resist further encroachment — a case where a resistance movement's own methods backfired against the resisting society. (A comparable prophetic-movement pattern responding to settler dispossession is the Ghost Dance movement among Native American peoples in the same era, noted here for comparison only.)",
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'cause',
      title: 'why outcomes diverged',
      content:
        "Adwa succeeded because Ethiopia was a relatively centralized, unified state under Menelik II able to field a large, coordinated, comparatively well-armed force against a small, overextended Italian invading army. Where resisting states were more fragmented, less able to arm themselves comparably, or faced larger/reinforced opposing forces (the Zulu after Isandlwana; Qing China facing the Eight-Nation Alliance), resistance was ultimately suppressed even after real tactical successes.",
    },
    {
      loId: 'apworld.imperial-resistance',
      kind: 'framework',
      title: 'suppressed resistance can still be consequential',
      content:
        'The Sepoy Rebellion was militarily suppressed, yet it forced a fundamental restructuring of British rule in India (Company to Raj, 1858). Outcome should be evaluated on two axes: did the resisting state preserve independence, AND did the resistance change how the imperial power subsequently governed?',
    },
  ],
  methods: [
    {
      title: 'Compare two resistance movements\' outcomes (unity, armament, stakes)',
      when_to_use:
        'Use when an FRQ or short-answer asks WHY one resistance movement succeeded (or was more consequential) than another.',
      steps: [
        'Identify what is being compared: was this resistance to a NEW invasion, or an uprising WITHIN an already-established zone of control?',
        'Assess unity/centralization and armament on the resisting side.',
        'Assess the scale and overextension of the opposing force.',
        "Weigh the stakes for the imperial power (a new, unestablished claim vs. an already-entrenched, heavily invested colonial holding).",
        'State the comparative conclusion — connect unity/armament/stakes to the actual outcome, not to a general claim that "resistance works" or "resistance fails."',
      ],
      example: {
        problem: 'Why did Adwa (1896) preserve Ethiopian independence while the Sepoy Rebellion (1857) did not preserve Indian independence from British rule?',
        solution:
          'Ethiopia fought as a unified, comparatively well-armed state against one overextended Italian invading force with limited immediate stakes for Italy in defeat. The Sepoy Rebellion challenged an already-entrenched British colonial power in India with much larger, sustainable military reserves and much higher stakes in maintaining control — so despite serious fighting, it was suppressed, though it still forced Britain to replace Company rule with direct Crown governance.',
      },
      relatedLoIds: ['apworld.imperial-resistance'],
    },
  ],
  pointers: [
    { content: 'Never claim "resistance always failed" — the Battle of Adwa (1896) is the clean counterexample the AP exam expects you to be able to name.', kind: 'trap' },
    { content: 'A SUPPRESSED resistance movement can still be historically consequential: the Sepoy Rebellion failed militarily but ended Company rule and produced the Raj.', kind: 'tip' },
    { content: 'Millenarian movements (Xhosa cattle-killing, Ghost Dance) responded to crisis with prophecy, not conventional warfare — and could backfire against the resisting society itself.', kind: 'tip' },
    { content: "Explaining divergent outcomes requires naming BOTH sides' unity/armament AND the opposing force's scale/stakes — a one-sided explanation (only the resisters, or only the invaders) won't earn full credit.", kind: 'tip' },
    { content: 'Don\'t confuse the Boxer Uprising\'s outcome (harsher terms via the Boxer Protocol) with a "successful" resistance — some resistance provoked worse terms, not relief.', kind: 'common-error' },
  ],
};
